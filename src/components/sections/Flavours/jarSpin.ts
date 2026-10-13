/**
 * Spin controller for a 3D jar.
 *
 * The rotation itself is a Web Animation (`transform` only), so the browser
 * runs it on the compositor thread and it stays smooth even when the main
 * thread is busy with scrolling or other sections. JS only plans the
 * animation. It keeps a tiny model of the same curve so it always knows the
 * jar's current angle and speed, which lets it hand over between phases
 * without a jump:
 *
 *  - spin():   eases up from the current speed to a steady turn
 *  - finish(): keeps turning, brakes smoothly and settles label-front
 *  - tap():    one slow, eased turn for touch screens (no hover there)
 *  - intro():  one eased turn the first time the jar scrolls into view
 */

const SPEED = 60; // deg/s while spinning (~6s per turn)
const RAMP = 1.8; // s to reach full speed
const BRAKE = 1.0; // the braking distance is this many seconds of travel

type Kind = "lin" | "quad" | "out" | "inout";

interface Piece {
  dur: number; // s
  x0: number;
  x1: number;
  kind: Kind;
  /** quad only: share of the average speed at the start of the piece */
  a?: number;
}

const ease = (p: Piece, s: number) => {
  const t = Math.min(1, Math.max(0, s));
  switch (p.kind) {
    case "lin":
      return t;
    case "quad":
      return (p.a ?? 0) * t + (1 - (p.a ?? 0)) * t * t;
    case "out":
      return 1 - Math.pow(1 - t, 3);
    case "inout":
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
};

const easing = (p: Piece) => {
  switch (p.kind) {
    case "lin":
      return "linear";
    case "quad": {
      const a = p.a ?? 0;
      return `cubic-bezier(0.3333, ${(a / 3).toFixed(4)}, 0.6667, ${(a / 6 + 2 / 3).toFixed(4)})`;
    }
    case "out":
      return "cubic-bezier(0.215, 0.61, 0.355, 1)";
    case "inout":
      return "cubic-bezier(0.645, 0.045, 0.355, 1)";
  }
};

export function createJarSpin(getEls: () => (HTMLElement | null)[]) {
  let pieces: Piece[] = [];
  let t0 = 0;
  let anims: Animation[] = [];
  let mode: "rest" | "spin" | "finish" = "rest";
  let timer: ReturnType<typeof setTimeout> | undefined;

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Angle (deg) at time `now`, from the planned curve. */
  const pos = (now: number) => {
    if (!pieces.length) return 0;
    let t = (now - t0) / 1000;
    for (const pc of pieces) {
      if (t <= pc.dur) return pc.x0 + (pc.x1 - pc.x0) * ease(pc, t / pc.dur);
      t -= pc.dur;
    }
    return pieces[pieces.length - 1].x1;
  };
  const vel = (now: number) => Math.max(0, (pos(now + 8) - pos(now - 8)) / 0.016);

  const play = (next: Piece[]) => {
    const els = getEls().filter((e): e is HTMLElement => !!e);
    if (!els.length || !next.length) return;
    const total = next.reduce((n, p) => n + p.dur, 0);
    let at = 0;
    const frames: Keyframe[] = next.map((p) => {
      const f: Keyframe = { offset: at / total, transform: `rotateY(${p.x0}deg)`, easing: easing(p) };
      at += p.dur;
      return f;
    });
    frames.push({ offset: 1, transform: `rotateY(${next[next.length - 1].x1}deg)` });
    anims.forEach((a) => a.cancel());
    pieces = next;
    t0 = performance.now();
    anims = els.map((el) => el.animate(frames, { duration: total * 1000, fill: "forwards" }));
  };

  /** From angle p at speed v: keep turning, then brake into the next front-facing angle. */
  const planFinish = (p: number, v: number): Piece[] => {
    if (v < 20) {
      const target = Math.round(p / 360) * 360;
      return [{ dur: 0.5 + (Math.abs(target - p) / 360) * 1.1, x0: p, x1: target, kind: "inout" }];
    }
    const brake = v * BRAKE;
    let target = Math.ceil(p / 360) * 360;
    if (target - p < brake) target += 360;
    const out: Piece[] = [];
    const coast = target - brake - p;
    if (coast > 0.01) out.push({ dur: coast / v, x0: p, x1: p + coast, kind: "lin" });
    out.push({ dur: (3 * brake) / v, x0: target - brake, x1: target, kind: "out" });
    return out;
  };

  const spin = () => {
    clearTimeout(timer);
    if (reduced() || mode === "spin") return;
    const now = performance.now();
    const p = pos(now);
    const v = vel(now);
    const dist = ((v + SPEED) / 2) * RAMP;
    play([
      { dur: RAMP, x0: p, x1: p + dist, kind: "quad", a: (v * RAMP) / dist },
      { dur: 120, x0: p + dist, x1: p + dist + SPEED * 120, kind: "lin" },
    ]);
    mode = "spin";
  };

  const finish = () => {
    clearTimeout(timer);
    if (mode !== "spin") return;
    const now = performance.now();
    play(planFinish(pos(now), vel(now)));
    mode = "finish";
  };

  /** One full, eased turn from wherever the jar is. */
  const turn = (dur: number) => {
    const now = performance.now();
    const p = pos(now);
    play([{ dur, x0: p, x1: Math.round(p / 360) * 360 + 360, kind: "inout" }]);
    mode = "finish";
  };

  const tap = () => {
    clearTimeout(timer);
    if (reduced() || mode === "spin") return;
    turn(2.8);
  };

  const intro = () => {
    if (reduced() || mode !== "rest") return;
    turn(3);
  };

  const dispose = () => {
    clearTimeout(timer);
    anims.forEach((a) => a.cancel());
    anims = [];
  };

  return { spin, finish, tap, intro, dispose };
}
