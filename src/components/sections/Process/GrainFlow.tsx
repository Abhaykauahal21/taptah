"use client";

import React, { useEffect, useRef } from "react";

/**
 * Grain physics for the process flow.
 *
 *  scoop (step 1) -> bowl (step 2) -> kadayi (step 3)
 *
 * Grains spill from the scoop into the bowl and pile up in a dome. The bowl
 * steadily tips grains over to the kadayi (and anything that doesn't fit
 * bounces off the same way). In the kadayi grains are tossed up as they roast;
 * some pop mid-air into pop jowar, which either drops back in or flies out
 * of the kadayi and fades away.
 *
 * Everything is simulated in "artboard units": the process artboard is 1000
 * units wide. The geometry mirrors the CSS placement of the images in
 * Process.tsx (bowl: left 35%, top 8%, width 22%; kadayi: left 52%, top 25%,
 * width 19%).
 */

const WORLD_W = 1000;
const WORLD_H = (WORLD_W * 1100) / 1258;

const SPRITES = [
  { src: "/images/why/jwar-grain-2.png", aspect: 1040 / 1512 },
  { src: "/images/why/single-jwaar-grain.png", aspect: 1223 / 1286 },
  // Pop jowar (index 2 and 3)
  { src: "/images/why/pop-jwaar-1.png", aspect: 1126 / 1397 },
  { src: "/images/why/pop-jwaar-2.png", aspect: 1217 / 1293 },
  // Masala-coated pop jowar (index 4)
  { src: "/images/why/masalla-pop-jwaar-1.png", aspect: 1195 / 1316 },
  // Masala-coated pop jowar (index 5)
  { src: "/images/why/masalla-pop-jwaar-2.png", aspect: 1083 / 1452 },
  // Pudina-coated pop jowar (index 6)
  { src: "/images/why/podina-pop-jwaar.png", aspect: 1083 / 1452 },
];
const SPRITE_PX = 96;
const POP_SPRITE = 2; // first pop jowar sprite index
const MASALA_SPRITE = 4; // masala sprites are 4 and 5
const PUDINA_SPRITE = 6;

/** Mouths of the two masala shakers, one each side of the bowl (artboard units). */
const SHAKERS = [
  { x: 702, y: 452, dir: 1 },
  { x: 788, y: 452, dir: -1 },
];
/** Mouths of the two pudina shakers, one each side of the third bowl. */
const PUDINA_SHAKERS = [
  { x: 462, y: 452, dir: 1 },
  { x: 548, y: 452, dir: -1 },
];

// Scoop mouth (where grains spill from)
const SPAWN = { x0: 405, x1: 455, y0: 0.065 * WORLD_H, y1: 0.11 * WORLD_H };

const COL_W = 4;
const STEP = 2.4; // default vertical spacing between stacked grains
const REPOSE = 2; // roll when a column is this many grains taller than a neighbour
const GRAVITY = 520;

interface Grain {
  sprite: number;
  size: number;
  rot: number;
  dx: number;
}

interface VesselConfig {
  /** Placement of the vessel's image, in artboard units. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Inner opening, as fractions of the image width. */
  rimL: number;
  rimR: number;
  /** Outer lip (where overflow tips over), as fractions of the image width. */
  spillL: number;
  spillR: number;
  /** Resting floor and maximum fill, as fractions of the image height. */
  floor: (u: number) => number;
  top: (u: number) => number;
  /** Thrown-off grains start fading below this fraction of the image height. */
  fadeBelow: number;
  /** Vertical spacing between stacked grains (bigger grains need more). */
  step?: number;
}

interface Vessel {
  /** y of the surface the vessel stands on (where thrown-off grains land). */
  groundY: number;
  step: number;
  cols: number;
  rimL: number;
  spillL: number;
  spillR: number;
  centerX: number;
  fadeY: number;
  stacks: Grain[][];
  pending: number[];
  colX: (i: number) => number;
  baseY: (i: number) => number;
  capacity: (i: number) => number;
  countOf: (i: number) => number;
}

function makeVessel(cfg: VesselConfig): Vessel {
  const rimL = cfg.x + cfg.rimL * cfg.w;
  const rimR = cfg.x + cfg.rimR * cfg.w;
  const cols = Math.floor((rimR - rimL) / COL_W);
  const centerX = (rimL + rimR) / 2;
  const colX = (i: number) => rimL + (i + 0.5) * COL_W;
  const u = (i: number) => (colX(i) - centerX) / ((rimR - rimL) / 2);
  const baseY = (i: number) => cfg.y + cfg.h * cfg.floor(u(i));
  const topY = (i: number) => cfg.y + cfg.h * cfg.top(u(i));
  const step = cfg.step ?? STEP;
  const stacks: Grain[][] = Array.from({ length: cols }, () => []);
  const pending = new Array<number>(cols).fill(0);
  return {
    groundY: cfg.y + 0.97 * cfg.h,
    step,
    cols,
    rimL,
    spillL: cfg.x + cfg.spillL * cfg.w,
    spillR: cfg.x + cfg.spillR * cfg.w,
    centerX,
    fadeY: cfg.y + cfg.fadeBelow * cfg.h,
    stacks,
    pending,
    colX,
    baseY,
    capacity: (i) => Math.max(0, Math.floor((baseY(i) - topY(i)) / step)),
    countOf: (i) => stacks[i].length + pending[i],
  };
}

const BOWL_CFG: VesselConfig = {
  x: 350,
  y: 0.08 * WORLD_H,
  w: 220,
  h: (220 * 1054) / 1492,
  rimL: 0.275,
  rimR: 0.83,
  spillL: 0.235,
  spillR: 0.868,
  // Floor of the empty bowl: lowest at the front-centre, rising to the sides
  floor: (u) => 0.594 + 0.087 * Math.sqrt(Math.max(0, 1 - u * u)),
  // A dome that peaks just above the rim
  top: (u) => 0.6 - 0.18 * (1 - u * u),
  fadeBelow: 0.62,
};

/** Step 4b: third bowl, left of the masala bowl, for the pudina flavour. */
const BOWL3_CFG: VesselConfig = {
  x: 390,
  y: 0.48 * WORLD_H,
  w: 220,
  h: (220 * 1054) / 1492,
  rimL: 0.275,
  rimR: 0.83,
  spillL: 0.235,
  spillR: 0.868,
  floor: (u) => 0.594 + 0.087 * Math.sqrt(Math.max(0, 1 - u * u)),
  top: (u) => 0.6 - 0.26 * (1 - u * u),
  fadeBelow: 0.62,
  step: 7,
};

/** Step 4: second bowl, down and to the left of the kadayi, for the masala. */
const BOWL2_CFG: VesselConfig = {
  ...BOWL_CFG,
  x: 630,
  y: 0.48 * WORLD_H,
  step: 7,
  // A fuller, rounder mound than the first bowl, like freshly tipped pop jowar
  top: (u) => 0.6 - 0.26 * (1 - u * u),
};

const KADAYI_CFG: VesselConfig = {
  x: 520,
  y: 0.25 * WORLD_H,
  w: 190,
  h: (190 * 1108) / 1419,
  rimL: 0.17,
  rimR: 0.83,
  spillL: 0.113,
  spillR: 0.881,
  floor: (u) => 0.262 + 0.085 * Math.sqrt(Math.max(0, 1 - u * u)),
  top: (u) => 0.262 - 0.05 * (1 - u * u),
  fadeBelow: 0.45,
};

interface Falling extends Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  /** Vessel it is heading for; null once thrown away. */
  target: Vessel | null;
  /** Thrown-away grains start fading once they fall below this y. */
  fadeY: number;
  /** Where a thrown-off grain lands (0 = none), bounces left, seconds since it settled (-1 = still falling). */
  groundY: number;
  bounces: number;
  landT: number;
  fade: number;
  /** A roasting grain that will burst into pop jowar at the top of its arc. */
  willPop: boolean;
  /** Seconds since it popped (-1 = not popped yet). */
  popT: number;
  /** Puffy pop jowar floats on the way out instead of dropping like a stone. */
  light: boolean;
}
interface PopFx {
  x: number;
  y: number;
  t: number;
}
interface Rolling extends Grain {
  vessel: Vessel;
  fromX: number;
  fromY: number;
  toCol: number;
  t: number;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

export const GrainFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let started = false;
    let visible = false;
    let last = 0;
    let spawnTimer = 0;
    let rollTimer = 0;
    let tossTimer = 0;
    let startAt = 0;

    const bowl = makeVessel(BOWL_CFG);
    const kadayi = makeVessel(KADAYI_CFG);
    const bowl2 = makeVessel(BOWL2_CFG);
    const bowl3 = makeVessel(BOWL3_CFG);
    const vessels = [bowl, kadayi, bowl2, bowl3];

    const sprites: HTMLCanvasElement[] = [];
    let falling: Falling[] = [];
    let rolling: Rolling[] = [];
    let popFx: PopFx[] = [];
    let masala: Array<{ x: number; y: number; vx: number; vy: number; life: number; pudina: boolean }> = [];
    let masalaTimer = 0;
    let pourTimer = 0;

    // Pre-render small sprites so the per-frame cost stays tiny.
    const loaded = Promise.all(
      SPRITES.map(
        (s) =>
          new Promise<HTMLCanvasElement>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = SPRITE_PX;
              c.height = Math.round(SPRITE_PX * s.aspect);
              c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
              resolve(c);
            };
            img.src = s.src;
          }),
      ),
    );

    let scale = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      scale = (w / WORLD_W) * dpr;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const colAt = (v: Vessel, x: number) =>
      Math.min(v.cols - 1, Math.max(0, Math.floor((x - v.rimL) / COL_W)));

    /** Columns (in the middle of the vessel) that still have room. */
    const openColumns = (v: Vessel) => {
      const open: number[] = [];
      for (let i = Math.floor(v.cols * 0.2); i < Math.ceil(v.cols * 0.8); i++) {
        if (v.countOf(i) < v.capacity(i)) open.push(i);
      }
      return open;
    };

    /** Column to aim a grain at: one with room, else the middle (it will overflow). */
    const aimColumn = (v: Vessel) => {
      const o = openColumns(v);
      return o.length ? o[Math.floor(Math.random() * o.length)] : Math.floor(rnd(v.cols * 0.35, v.cols * 0.65));
    };

    /** Nearest column (within a few) that still has room. */
    const freeColumnNear = (v: Vessel, c: number) => {
      for (let d = 1; d <= 4; d++) {
        const order = Math.random() < 0.5 ? [-d, d] : [d, -d];
        for (const o of order) {
          const j = c + o;
          if (j >= 0 && j < v.cols && v.countOf(j) < v.capacity(j)) return j;
        }
      }
      return -1;
    };

    /** Launch a grain on an arc that lands in column `c` of vessel `v`. */
    const launch = (
      g: Grain,
      x: number,
      y: number,
      v: Vessel,
      c: number,
      vy0: number,
      vxJitter = 4,
    ) => {
      const targetY = v.baseY(c) - v.countOf(c) * v.step;
      const T =
        (-vy0 + Math.sqrt(vy0 * vy0 + 2 * GRAVITY * Math.max(targetY - y, 12))) / GRAVITY;
      falling.push({
        ...g,
        x,
        y,
        vx: (v.colX(c) - x) / T + rnd(-vxJitter, vxJitter),
        vy: vy0,
        vr: rnd(-8, 8),
        target: v,
        fadeY: 0,
        groundY: 0,
        bounces: 0,
        landT: -1,
        fade: 1,
        willPop: false,
        popT: -1,
        light: false,
      });
    };

    /** Pour a fresh grain from the scoop into the bowl. */
    const spawn = () => {
      if (falling.length > 70) return;
      const open = openColumns(bowl);
      const col = open.length
        ? open[Math.floor(Math.random() * open.length)]
        : Math.floor(rnd(bowl.cols * 0.35, bowl.cols * 0.65));
      launch(
        {
          sprite: Math.random() < 0.35 ? 0 : 1,
          size: rnd(7.5, 10.5),
          rot: rnd(0, Math.PI * 2),
          dx: rnd(-1.2, 1.2),
        },
        rnd(SPAWN.x0, SPAWN.x1),
        rnd(SPAWN.y0, SPAWN.y1),
        bowl,
        col,
        rnd(0, 20),
      );
    };

    /** A grain that doesn't fit is thrown off: on to the next vessel, or away. */
    const throwOff = (v: Vessel, g: Grain, x: number, y: number) => {
      if (v === kadayi) {
        // The extra grain pops and arcs over to one of the flavour bowls.
        const b = Math.random() < 0.5 ? bowl2 : bowl3;
        g.sprite = POP_SPRITE + (Math.random() < 0.5 ? 0 : 1);
        g.size = rnd(18, 25);
        launch(g, x, y - 2, b, aimColumn(b), -rnd(120, 170), 3);
        return;
      }
      if (v === bowl) {
        const open = openColumns(kadayi);
        if (open.length) {
          const c = open[Math.floor(Math.random() * open.length)];
          return launch(g, x, y - 2, kadayi, c, -rnd(55, 95), 3);
        }
      }
      const dir: -1 | 1 =
        x < v.centerX ? -1 : x > v.centerX ? 1 : Math.random() < 0.5 ? -1 : 1;
      const vy = -rnd(40, 110);
      // Fast enough to clear the outer lip before dropping below it.
      const edge = dir < 0 ? v.spillL - 6 : v.spillR + 6;
      const t =
        (-vy + Math.sqrt(vy * vy + 2 * GRAVITY * Math.max(v.fadeY - y, 10))) / GRAVITY;
      falling.push({
        ...g,
        x,
        y: y - 2,
        vx: ((edge - x) / t) * rnd(1, 1.15),
        vy,
        vr: dir * rnd(4, 12),
        target: null,
        fadeY: v.fadeY,
        groundY: v.groundY + rnd(-6, 8),
        bounces: 0,
        landT: -1,
        fade: 1,
        willPop: false,
        popT: -1,
        light: false,
      });
    };

    /** One avalanche step: the tallest overly steep column sheds a grain. */
    const settleHeap = (v: Vessel) => {
      const candidates: Array<{ i: number; to: number; diff: number }> = [];
      for (let i = 0; i < v.cols; i++) {
        if (v.stacks[i].length === 0) continue;
        const here = v.countOf(i);
        for (const to of [i - 1, i + 1]) {
          if (to < 0 || to >= v.cols || v.countOf(to) >= v.capacity(to)) continue;
          const diff = here - v.countOf(to);
          if (diff >= REPOSE) candidates.push({ i, to, diff });
        }
      }
      if (!candidates.length) return;
      candidates.sort((a, b) => b.diff - a.diff);
      const pick = candidates[Math.floor(Math.random() * Math.min(3, candidates.length))];
      const grain = v.stacks[pick.i].pop();
      if (!grain) return;
      v.pending[pick.to]++;
      rolling.push({
        ...grain,
        vessel: v,
        fromX: v.colX(pick.i) + grain.dx,
        fromY: v.baseY(pick.i) - v.stacks[pick.i].length * v.step,
        toCol: pick.to,
        t: 0,
      });
    };

    /** Roasting: toss a grain off the kadayi's heap and catch it again. */
    const toss = () => {
      const filled: number[] = [];
      for (let i = 0; i < kadayi.cols; i++) {
        if (kadayi.stacks[i].length > 0) filled.push(i);
      }
      if (!filled.length) return;
      const c = filled[Math.floor(Math.random() * filled.length)];
      const grain = kadayi.stacks[c].pop();
      if (!grain) return;
      const x = kadayi.colX(c) + grain.dx;
      const y = kadayi.baseY(c) - kadayi.stacks[c].length * kadayi.step;
      const to = Math.min(kadayi.cols - 1, Math.max(0, c + Math.round(rnd(-3, 3))));
      launch(grain, x, y, kadayi, kadayi.capacity(to) > 0 ? to : c, -rnd(90, 150), 2);
      // Plain grains sometimes burst into pop jowar at the top of the toss.
      // Once both flavour bowls are full only a few more pop, so just a little overflows.
      const bothFull = !openColumns(bowl2).length && !openColumns(bowl3).length;
      if (grain.sprite < POP_SPRITE && Math.random() < (bothFull ? 0.16 : 0.5)) {
        falling[falling.length - 1].willPop = true;
      }
    };

    /** The bowl tips grains from its right-hand side over into the kadayi. */
    const pour = () => {
      const open = openColumns(kadayi);
      if (!open.length) return;
      for (let i = Math.floor(bowl.cols * 0.85); i >= 0; i--) {
        const grain = bowl.stacks[i].pop();
        if (!grain) continue;
        const x = bowl.colX(i) + grain.dx;
        const y = bowl.baseY(i) - bowl.stacks[i].length * bowl.step;
        const c = open[Math.floor(Math.random() * open.length)];
        launch(grain, x, y - 2, kadayi, c, -rnd(60, 100), 3);
        return;
      }
    };

    /** A roasting grain bursts into pop jowar. */
    const pop = (f: Falling) => {
      f.sprite = POP_SPRITE + (Math.random() < 0.5 ? 0 : 1);
      f.size = rnd(18, 25);
      f.popT = 0;
      popFx.push({ x: f.x, y: f.y, t: 0 });
      // Arcs over to one of the flavour bowls. Once a bowl is full the grain
      // bounces off its heap and tumbles away over the rim.
      const b = Math.random() < 0.5 ? bowl2 : bowl3;
      const c = aimColumn(b);
      const vy0 = -rnd(120, 170);
      const targetY = b.baseY(c) - b.countOf(c) * b.step;
      const T = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * GRAVITY * Math.max(targetY - f.y, 12))) / GRAVITY;
      f.target = b;
      f.vx = (b.colX(c) - f.x) / T;
      f.vy = vy0;
      f.vr = rnd(-8, 8);
    };

    /** Season a random pop jowar already heaped in `bowl`. */
    const season = (bowl: Vessel, from: number, count: number) => {
      const cols: number[] = [];
      for (let i = 0; i < bowl.cols; i++) if (bowl.stacks[i].length) cols.push(i);
      if (!cols.length) return;
      const st = bowl.stacks[cols[Math.floor(Math.random() * cols.length)]];
      const g = st[Math.floor(Math.random() * st.length)];
      if (g && g.sprite >= POP_SPRITE && g.sprite < MASALA_SPRITE) {
        // Seasoned pop jowar swells a little: it is coated now.
        g.sprite = from + (count > 1 && Math.random() < 0.5 ? 1 : 0);
        g.size = rnd(27, 34);
      }
    };

    const shake = () => {
      if (Math.random() < 0.34) {
        const sh = PUDINA_SHAKERS[Math.random() < 0.5 ? 0 : 1];
        masala.push({
          x: sh.x + rnd(-3, 3),
          y: sh.y + rnd(-2, 2),
          vx: sh.dir * rnd(18, 50),
          vy: rnd(-5, 25),
          life: 0,
          pudina: true,
        });
        if (Math.random() < 0.3) season(bowl3, PUDINA_SPRITE, 1);
        return;
      }
      const sh = SHAKERS[Math.random() < 0.5 ? 0 : 1];
      masala.push({
        x: sh.x + rnd(-3, 3),
        y: sh.y + rnd(-2, 2),
        vx: sh.dir * rnd(18, 50),
        vy: rnd(-5, 25),
        life: 0,
        pudina: false,
      });
      if (Math.random() < 0.3) season(bowl2, MASALA_SPRITE, 2);
    };

    const update = (dt: number) => {
      spawnTimer -= dt;
      while (spawnTimer <= 0) {
        spawn();
        spawnTimer += rnd(0.035, 0.075);
      }
      rollTimer -= dt;
      while (rollTimer <= 0) {
        vessels.forEach(settleHeap);
        rollTimer += 0.05;
      }
      tossTimer -= dt;
      while (tossTimer <= 0) {
        toss();
        tossTimer += rnd(0.08, 0.17);
      }
      masalaTimer -= dt;
      while (masalaTimer <= 0) {
        shake();
        masalaTimer += rnd(0.03, 0.06);
      }
      masala.forEach((m) => {
        m.life += dt;
        m.vy += GRAVITY * 0.7 * dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
      });
      masala = masala.filter((m) => m.life < 0.9 && m.y < bowl2.baseY(Math.floor(bowl2.cols / 2)) + 4);
      pourTimer -= dt;
      while (pourTimer <= 0) {
        pour();
        pourTimer += rnd(0.09, 0.16);
      }

      const stillFalling: Falling[] = [];
      for (const f of falling) {
        f.vy += GRAVITY * (f.light ? 0.4 : 1) * dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.rot += f.vr * dt;
        if (f.popT >= 0) f.popT += dt;
        if (f.willPop && f.popT < 0 && f.vy >= 0) {
          f.willPop = false;
          pop(f);
        }

        const v = f.target;
        if (v) {
          const c = colAt(v, f.x);
          const surface = v.baseY(c) - v.countOf(c) * v.step;
          if (f.y >= surface - f.size * 0.3 && f.vy > 0) {
            const grain = {
              sprite: f.sprite,
              size: v === bowl2 || v === bowl3 ? rnd(21, 27) : f.size,
              rot: f.rot,
              dx: f.dx,
            };
            if (v.countOf(c) < v.capacity(c)) {
              v.stacks[c].push(grain);
            } else {
              const j = freeColumnNear(v, c);
              if (j >= 0) {
                v.pending[j]++;
                rolling.push({ ...grain, vessel: v, fromX: f.x, fromY: f.y, toCol: j, t: 0 });
              } else {
                throwOff(v, grain, f.x, f.y);
              }
            }
            continue;
          }
        } else if (f.light) {
          // Pop jowar drifting off fades as it goes.
          if (f.popT > 0.6) f.fade -= dt * 1.3;
          if (f.fade <= 0) continue;
        } else if (f.groundY > 0) {
          // Thrown off a full bowl: it falls to the ground, bounces, settles and then vanishes.
          if (f.landT >= 0) {
            f.landT += dt;
            f.vx = 0;
            f.vy = 0;
            f.vr = 0;
            f.y = f.groundY;
            if (f.landT > 0.7) f.fade -= dt * 2.2;
            if (f.fade <= 0) continue;
          } else if (f.y >= f.groundY && f.vy > 0) {
            f.y = f.groundY;
            if (f.bounces >= 2 || f.vy < 60) {
              f.landT = 0;
            } else {
              f.vy = -f.vy * 0.34;
              f.vx *= 0.55;
              f.vr *= 0.6;
              f.bounces++;
            }
          }
        }
        if (f.y < WORLD_H + 40) stillFalling.push(f);
      }
      falling = stillFalling;

      const stillRolling: Rolling[] = [];
      for (const r of rolling) {
        r.t += dt / 0.2;
        if (r.t >= 1) {
          r.vessel.pending[r.toCol]--;
          r.vessel.stacks[r.toCol].push({
            sprite: r.sprite,
            size: r.size,
            rot: r.rot,
            dx: r.dx,
          });
        } else stillRolling.push(r);
      }
      rolling = stillRolling;

      popFx.forEach((p) => (p.t += dt));
      popFx = popFx.filter((p) => p.t < 0.5);
    };

    const drawGrain = (
      g: Grain,
      x: number,
      y: number,
      rot: number,
      alpha = 1,
      grow = 1,
    ) => {
      const sp = sprites[g.sprite];
      if (!sp) return;
      const w = g.size * grow;
      const h = w * (sp.height / sp.width);
      if (ctx.globalAlpha !== alpha) ctx.globalAlpha = alpha;
      // One setTransform is much cheaper than save/translate/rotate/restore,
      // and this runs for every grain in every heap on every frame.
      const c = Math.cos(rot) * scale;
      const s = Math.sin(rot) * scale;
      ctx.setTransform(c, s, -s, c, x * scale, y * scale);
      ctx.drawImage(sp, -w / 2, -h / 2, w, h);
    };
    const resetTransform = () => ctx.setTransform(scale, 0, 0, scale, 0, 0);

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      for (const v of vessels) {
        for (let i = 0; i < v.cols; i++) {
          v.stacks[i].forEach((g, idx) =>
            drawGrain(g, v.colX(i) + g.dx, v.baseY(i) - (idx + 0.5) * v.step, g.rot),
          );
        }
      }
      resetTransform();
      rolling.forEach((r) => {
        const v = r.vessel;
        const toX = v.colX(r.toCol) + r.dx;
        const toY = v.baseY(r.toCol) - (v.countOf(r.toCol) - 0.5) * v.step;
        const e = r.t * r.t * (3 - 2 * r.t);
        drawGrain(
          r,
          r.fromX + (toX - r.fromX) * e,
          r.fromY + (toY - r.fromY) * e,
          r.rot + r.t * 2,
        );
      });
      resetTransform();
      falling.forEach((f) => {
        // Pop: squash-and-stretch burst, then settle at full size
        let grow = 1;
        if (f.popT >= 0 && f.popT < 0.3) {
          const k = f.popT / 0.3;
          grow = k < 0.4 ? 0.45 + (k / 0.4) * 0.95 : 1.4 - ((k - 0.4) / 0.6) * 0.4;
        }
        drawGrain(f, f.x, f.y, f.rot, f.fade, grow);
      });
      resetTransform();
      for (const m of masala) {
        ctx.globalAlpha = Math.min(1, (0.9 - m.life) * 2);
        ctx.fillStyle = m.pudina
          ? m.life % 0.2 < 0.1 ? "#3f7d2a" : "#a9c24a"
          : m.life % 0.2 < 0.1 ? "#d63a14" : "#f08a1c";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Pop bursts: an expanding golden ring and a few sparks
      for (const p of popFx) {
        const k = p.t / 0.5;
        ctx.globalAlpha = (1 - k) * 0.85;
        ctx.strokeStyle = "rgba(255, 196, 92, 1)";
        ctx.lineWidth = 2.2 * (1 - k) + 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + k * 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 233, 170, 1)";
        for (let a = 0; a < 7; a++) {
          const ang = (a / 7) * Math.PI * 2 + p.x;
          const r = 6 + k * 24;
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(ang) * r, p.y + Math.sin(ang) * r, 1.6 * (1 - k) + 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!started || !visible || now < startAt) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
    };

    // Start once the artboard is in view (plus a beat for the images to land).
    const art = canvas.closest(".process-art");
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !started && canvas.clientWidth > 0) {
          started = true;
          startAt = performance.now() + 1800;
        }
      },
      { threshold: 0.3 },
    );
    if (art) io.observe(art);

    loaded.then((list) => {
      if (disposed) return;
      sprites.push(...list);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
    />
  );
};
