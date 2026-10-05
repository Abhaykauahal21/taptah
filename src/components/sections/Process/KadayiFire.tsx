"use client";

import React, { useEffect, useRef } from "react";

/**
 * Live fire and smoke for the kadayi, drawn on a canvas that sits over the
 * kadayi image and extends above it so the smoke can rise freely.
 *
 * Coordinates are in kadayi-image pixels (1419 x 1108); the canvas is 1.7x as
 * tall as the image, with the image's top edge at y = OFFSET_Y.
 */

const IMG_W = 1419;
const IMG_H = 1108;
const CANVAS_H = IMG_H * 1.7;
const OFFSET_Y = IMG_H * 0.7;

/** Where flames burn: the two openings in the clay stove. */
const OPENINGS = [
  // Gap under the wok, between the clay supports
  { x0: 500, x1: 880, yBase: 650, height: 150 },
  // Firebox with the logs
  { x0: 490, x1: 890, yBase: 1010, height: 250 },
];

/** Flames are clipped to these rectangles (x, y, w, h) so they stay in the stove. */
const FLAME_CLIP: Array<[number, number, number, number]> = [
  [480, 548, 420, 112],
  [468, 790, 446, 262],
];

interface Flame {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  max: number;
  phase: number;
}
interface Smoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  life: number;
  max: number;
  alpha: number;
  phase: number;
}
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
/** Offset of a puff's shadow, proportional to its size. */
const r2 = (r: number) => r * 0.12;

export const KadayiFire: React.FC<{ className?: string }> = ({
  className = "hidden lg:block",
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = false;
    let last = 0;
    let scale = 1;
    let t = 0;
    let flameTimer = 0;
    let smokeTimer = 0;
    let emberTimer = 0;
    let flames: Flame[] = [];
    let smoke: Smoke[] = [];
    let embers: Ember[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = canvas.clientWidth;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(((w * CANVAS_H) / IMG_W) * dpr));
      scale = (w / IMG_W) * dpr;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const emitFlame = () => {
      const o = OPENINGS[Math.random() < 0.55 ? 1 : 0];
      const x = rnd(o.x0 + 40, o.x1 - 40);
      // taller in the middle, shorter at the edges
      const mid = 1 - Math.abs((x - (o.x0 + o.x1) / 2) / ((o.x1 - o.x0) / 2));
      flames.push({
        x,
        y: o.yBase + rnd(-10, 10),
        vx: rnd(-14, 14),
        vy: -rnd(90, 150) * (0.55 + mid * 0.6) * (o.height / 200),
        size: rnd(34, 62) * (0.6 + mid * 0.6),
        life: 0,
        max: rnd(0.55, 1.1),
        phase: rnd(0, Math.PI * 2),
      });
    };

    const emitSmoke = () => {
      smoke.push({
        x: rnd(520, 900),
        y: rnd(170, 250),
        vx: rnd(8, 30),
        vy: -rnd(38, 70),
        r: rnd(30, 55),
        grow: rnd(26, 44),
        life: 0,
        max: rnd(4.5, 7),
        alpha: rnd(0.18, 0.3),
        phase: rnd(0, Math.PI * 2),
      });
    };

    const emitEmber = () => {
      embers.push({
        x: rnd(560, 840),
        y: rnd(640, 900),
        vx: rnd(-20, 40),
        vy: -rnd(90, 190),
        life: 0,
        max: rnd(1.2, 2.4),
      });
    };

    const update = (dt: number) => {
      t += dt;
      flameTimer -= dt;
      while (flameTimer <= 0) {
        emitFlame();
        flameTimer += 0.02;
      }
      smokeTimer -= dt;
      while (smokeTimer <= 0) {
        emitSmoke();
        smokeTimer += rnd(0.16, 0.3);
      }
      emberTimer -= dt;
      while (emberTimer <= 0) {
        emitEmber();
        emberTimer += rnd(0.12, 0.3);
      }

      flames.forEach((f) => {
        f.life += dt;
        f.x += (f.vx + Math.sin(t * 7 + f.phase) * 26) * dt;
        f.y += f.vy * dt;
      });
      flames = flames.filter((f) => f.life < f.max);

      smoke.forEach((s) => {
        s.life += dt;
        s.x += (s.vx + Math.sin(t * 0.9 + s.phase) * 14) * dt;
        s.y += s.vy * dt;
        s.r += s.grow * dt;
      });
      smoke = smoke.filter((s) => s.life < s.max);

      embers.forEach((e) => {
        e.life += dt;
        e.x += (e.vx + Math.sin(t * 5 + e.x) * 20) * dt;
        e.y += e.vy * dt;
      });
      embers = embers.filter((e) => e.life < e.max);
    };

    // Pre-rendered soft sprites: drawing one is far cheaper than building a
    // fresh radial gradient for every flame, puff and ember on every frame.
    const makeSprite = (stops: Array<[number, string]>) => {
      const size = 96;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d");
      if (g) {
        const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        stops.forEach(([o, col]) => gr.addColorStop(o, col));
        g.fillStyle = gr;
        g.fillRect(0, 0, size, size);
      }
      return c;
    };
    const SP = {
      smokeWhite: makeSprite([
        [0, "rgba(255, 255, 255, 1)"],
        [0.6, "rgba(255, 252, 246, 0.6)"],
        [1, "rgba(255, 252, 246, 0)"],
      ]),
      smokeShadow: makeSprite([
        [0, "rgba(120, 92, 76, 1)"],
        [1, "rgba(120, 92, 76, 0)"],
      ]),
      fireLight: makeSprite([
        [0, "rgba(255, 140, 40, 1)"],
        [1, "rgba(255, 90, 20, 0)"],
      ]),
      flame: makeSprite([
        [0, "rgba(255, 245, 190, 0.75)"],
        [0.35, "rgba(255, 190, 70, 0.55)"],
        [0.7, "rgba(255, 90, 20, 0.28)"],
        [1, "rgba(200, 30, 0, 0)"],
      ]),
      ember: makeSprite([
        [0, "rgba(255, 220, 130, 1)"],
        [1, "rgba(255, 120, 30, 0)"],
      ]),
    };

    const blob = (sp: HTMLCanvasElement, x: number, y: number, r: number, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, OFFSET_Y * scale);

      // Smoke: billowy white puffs. A faint warm shadow under each one keeps
      // the white readable against the cream background.
      const puff = (s: Smoke, dx: number, dy: number, white: boolean) => {
        const k = s.life / s.max;
        const fade = Math.sin(Math.min(1, k * 1.15) * Math.PI) ** 0.8;
        for (let i = 0; i < 3; i++) {
          const ang = s.phase + i * 2.1 + t * 0.15;
          const ox = Math.cos(ang) * s.r * 0.35 + dx;
          const oy = Math.sin(ang) * s.r * 0.3 + dy;
          const r = s.r * 0.72;
          if (white) {
            const a = Math.min(0.8, s.alpha * 3) * fade;
            blob(SP.smokeWhite, s.x + ox, s.y + oy, r, a);
          } else {
            const a = s.alpha * 0.9 * fade;
            blob(SP.smokeShadow, s.x + ox, s.y + oy, r * 1.05, a);
          }
        }
      };
      for (const s of smoke) puff(s, r2(s.r), r2(s.r), false);
      for (const s of smoke) puff(s, 0, 0, true);

      // Firelight on the underside of the wok
      const flicker = 0.7 + Math.sin(t * 9) * 0.12 + Math.sin(t * 23) * 0.08;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      blob(SP.fireLight, 700, 600, 300, 0.28 * flicker);
      ctx.restore();

      // Flames, clipped to the stove openings and blended additively
      ctx.save();
      ctx.beginPath();
      FLAME_CLIP.forEach(([x, y, w, h]) => ctx.rect(x, y, w, h));
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      for (const f of flames) {
        const k = f.life / f.max;
        const r = f.size * (1 - k * 0.85);
        const a = (1 - k) ** 1.3;
        blob(SP.flame, f.x, f.y, r, a);
      }
      ctx.restore();

      // Embers drifting up out of the fire
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        const k = e.life / e.max;
        blob(SP.ember, e.x, e.y, 7 * (1 - k * 0.6), 0.9 * (1 - k));
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && canvas.clientWidth > 0;
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={"pointer-events-none absolute left-0 top-[-70%] h-[170%] w-full " + className}
    />
  );
};
