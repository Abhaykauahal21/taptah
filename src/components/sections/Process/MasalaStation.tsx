"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { masalaState } from "./masalaState";
import type { Station, StationLayout } from "./masalaLayout";

/**
 * Two bowls of masala, one each side of the popped-jowar bowls. A hand reaches in from the
 * outside, dips into its bowl, picks up a pinch, carries it over the popped jowar and
 * sprinkles it, then leaves; the other hand does the same half a cycle later.
 *
 * The hands are driven from one rAF loop so the sprinkle lines up with GrainFlow's falling
 * masala (which reads `masalaState`). The loop sleeps when the scene is off screen.
 */

const PERIOD = 10; // seconds for one full dip-carry-sprinkle-leave
const START_DELAY = 2.2; // let the first popped jowar land in the bowls
const HAND_ASPECT = 1024 / 1536;
/** The pinch in the hand photo, as a fraction of its width/height (before flipping). */
const PINCH = { x: 0.22, y: 0.66 };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (u: number, a: number, b: number) => Math.min(1, Math.max(0, (u - a) / (b - a)));

interface Pose {
  x: number;
  y: number;
  rot: number;
  op: number;
  sprinkling: boolean;
}

function pose(u: number, s: Station, handW: number): Pose {
  const side = s.flip ? -1 : 1;
  const D = s.dip;
  const S = s.target;
  const lift = handW * 0.38;
  const away = { x: D.x + side * handW * 0.7, y: D.y - handW * 0.45 };
  const hover = { x: D.x, y: D.y - lift };
  const carryTilt = side * -10;

  // enter
  if (u < 0.1) {
    const k = ease(seg(u, 0, 0.1));
    return { x: lerp(away.x, hover.x, k), y: lerp(away.y, hover.y, k), rot: lerp(side * 12, 0, k), op: Math.min(1, k * 1.6), sprinkling: false };
  }
  // dip into the masala
  if (u < 0.19) {
    const k = ease(seg(u, 0.1, 0.19));
    return { x: D.x, y: lerp(hover.y, D.y, k), rot: 0, op: 1, sprinkling: false };
  }
  // pick up, rise
  if (u < 0.25) {
    const k = ease(seg(u, 0.19, 0.25));
    return { x: D.x, y: lerp(D.y, hover.y, k), rot: 0, op: 1, sprinkling: false };
  }
  // carry over the popped jowar, in an arc
  if (u < 0.48) {
    const k = ease(seg(u, 0.25, 0.48));
    return {
      x: lerp(hover.x, S.x, k),
      y: lerp(hover.y, S.y, k) - Math.sin(Math.PI * k) * handW * 0.28,
      rot: lerp(0, carryTilt, k),
      op: 1,
      sprinkling: false,
    };
  }
  // sprinkle: rub the fingers together
  if (u < 0.7) {
    const k = seg(u, 0.48, 0.7);
    return {
      x: S.x + Math.sin(k * Math.PI * 2 * 5) * handW * 0.03,
      y: S.y + Math.sin(k * Math.PI * 2 * 7) * handW * 0.012,
      rot: carryTilt + Math.sin(k * Math.PI * 2 * 5) * 5,
      op: 1,
      sprinkling: true,
    };
  }
  // go back
  if (u < 0.9) {
    const k = ease(seg(u, 0.7, 0.9));
    return {
      x: lerp(S.x, hover.x, k),
      y: lerp(S.y, hover.y, k) - Math.sin(Math.PI * k) * handW * 0.2,
      rot: lerp(carryTilt, 0, k),
      op: 1,
      sprinkling: false,
    };
  }
  // leave
  const k = ease(seg(u, 0.9, 1));
  return { x: lerp(hover.x, away.x, k), y: lerp(hover.y, away.y, k), rot: lerp(0, side * 12, k), op: 1 - k, sprinkling: false };
}

export const MasalaStation: React.FC<{ layout: StationLayout; className?: string }> = ({ layout, className = "" }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const handRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const { W, handW, stations } = layout;
    const handH = handW * HAND_ASPECT;
    let raf = 0;
    let running = false;
    let visible = false;
    let t0 = 0;
    let scale = root.clientWidth / W;

    const frame = (now: number) => {
      raf = 0;
      if (!running) return;
      const t = (now - t0) / 1000 - START_DELAY;
      stations.forEach((s, i) => {
        const el = handRefs.current[i];
        if (!el) return;
        const local = t - (i * PERIOD) / 2;
        if (local < 0) {
          el.style.opacity = "0";
          masalaState[s.id].on = false;
          return;
        }
        const p = pose((local % PERIOD) / PERIOD, s, handW);
        const fx = s.flip ? 1 - PINCH.x : PINCH.x;
        el.style.transform = `translate(${(p.x - fx * handW) * scale}px, ${(p.y - PINCH.y * handH) * scale}px) rotate(${p.rot}deg)`;
        el.style.opacity = String(p.op);
        const st = masalaState[s.id];
        st.on = p.sprinkling;
        st.x = p.x;
        st.y = p.y + handH * 0.04;
      });
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        masalaState.active = true;
        if (!t0) t0 = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        masalaState.active = false;
        masalaState.pudina.on = false;
        masalaState.red.on = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        sync();
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(root);
    const ro = new ResizeObserver(() => {
      scale = root.clientWidth / W;
    });
    ro.observe(root);
    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      masalaState.active = false;
      masalaState.pudina.on = false;
      masalaState.red.on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [layout]);

  const { W, H, handW, stations } = layout;
  return (
    <div ref={rootRef} className={"pointer-events-none absolute inset-0 z-[12] " + className}>
      {stations.map((s, i) => {
        const bowlH = (s.bowl.w * s.imgH) / s.imgW;
        return (
          <React.Fragment key={s.id}>
            <div
              className="process-flow absolute"
              style={{
                left: `${(s.bowl.x / W) * 100}%`,
                top: `${(s.bowl.y / H) * 100}%`,
                width: `${(s.bowl.w / W) * 100}%`,
                height: `${(bowlH / H) * 100}%`,
                transitionDelay: `${1.5 + i * 0.15}s`,
              }}
            >
              <Image
                loading="eager"
                src={s.img}
                alt={s.id === "red" ? "A clay bowl of red masala" : "A clay bowl of pudina masala"}
                width={s.imgW}
                height={s.imgH}
                sizes="(min-width: 1024px) 16vw, 30vw"
                className="h-auto w-full drop-shadow-[4px_8px_6px_rgba(40,20,5,0.3)]"
              />
            </div>
            <div
              ref={(el) => {
                handRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="absolute left-0 top-0 opacity-0 will-change-transform"
              style={{
                width: `${(handW / W) * 100}%`,
                transformOrigin: `${(s.flip ? 1 - PINCH.x : PINCH.x) * 100}% ${PINCH.y * 100}%`,
              }}
            >
              <Image
                loading="eager"
                src={s.id === "red" ? "/images/why/hand-red.webp" : "/images/why/hand-pudina-olive.webp"}
                alt=""
                width={640}
                height={427}
                sizes="(min-width: 1024px) 20vw, 30vw"
                className={"h-auto w-full drop-shadow-[0_10px_8px_rgba(40,20,5,0.3)] " + (s.flip ? "-scale-x-100" : "")}
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
