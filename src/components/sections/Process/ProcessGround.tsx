import React from "react";

/**
 * The soft stage behind the process flow: a studio glow, and a faint,
 * glass-like stream that winds from the scoop through the bowl and kadayi
 * (wider and narrower as it flows, never a hard road). The cast shadows under
 * each vessel are drawn with the vessels themselves (see `.process-cast`).
 * Pure SVG in artboard units (1000 x ~874), drawn behind everything else.
 */

const W = 1000;
const H = (W * 1100) / 1258;

/** Centre line of the stream, top-left to bottom. */
const POINTS: Array<[number, number]> = [
  [350, 15],
  [395, 85],
  [450, 160],
  [545, 255],
  [625, 340],
  [690, 440],
  [760, 540],
  [715, 560],
  [700, 625],
];

type Pt = [number, number];

/** Samples a Catmull-Rom spline through `pts`. */
function sampleSpline(pts: Pt[], perSegment: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Half-width of a stream at fraction `t` along it: it swells and narrows. */
const halfWidth = (t: number) => 62 + 22 * Math.sin(t * Math.PI * 3.2 + 0.6) + 10 * Math.sin(t * 17);

const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

/** Builds the outline, centre line and inner currents for a stream through `points`. */
function buildStream(points: Pt[], scale = 1) {
  const center = sampleSpline(points, 24);
  const offset = (k: number): Pt[] =>
    center.map((p, i) => {
      const a = center[Math.max(0, i - 1)];
      const b = center[Math.min(center.length - 1, i + 1)];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      const w = halfWidth(i / (center.length - 1)) * k * scale;
      return [p[0] + (-dy / len) * w, p[1] + (dx / len) * w];
    });
  return {
    outline: toPath(offset(1)) + " " + toPath([...offset(-1)].reverse()).replace("M", "L") + " Z",
    center: toPath(center),
    swirlA: toPath(offset(0.45)),
    swirlB: toPath(offset(-0.35)),
  };
}

/** Branch off the main stream at the kadayi, down-left to the pudina bowl. */
const BRANCH_POINTS: Array<[number, number]> = [
  [615, 330],
  [572, 395],
  [522, 455],
  [498, 540],
  [525, 600],
];

const STREAMS = [
  { id: "main", ...buildStream(POINTS) },
  { id: "branch", ...buildStream(BRANCH_POINTS, 0.78) },
];

export const ProcessGround: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="none"
    data-parallax="0.06"
    className="process-ground pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
  >
    <defs>
      <radialGradient id="stage-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fffaf0" stopOpacity="0.7" />
        <stop offset="0.55" stopColor="#fff3df" stopOpacity="0.3" />
        <stop offset="1" stopColor="#fff3df" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="stream-fill" gradientUnits="userSpaceOnUse" x1="300" y1="-90" x2="560" y2="820">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="0.5" stopColor="#fbefdc" stopOpacity="0.4" />
        <stop offset="1" stopColor="#ecd2ae" stopOpacity="0.28" />
      </linearGradient>
      <filter id="stream-soft" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1600" height="1600">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
      <filter id="stream-shadow" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1600" height="1600">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      {/* Fade the stream in below the "Why" artwork and out at the bottom */}
      <linearGradient id="stream-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="640">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.14" stopColor="#fff" stopOpacity="1" />
        <stop offset="0.84" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="stream-fade-mask" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1600" height="1600">
        <rect x="-300" y="-300" width="1600" height="1600" fill="#000" />
        <rect x="-300" y="0" width="1600" height="640" fill="url(#stream-fade)" />
      </mask>
      {/* Each stream flows in from its source as the section scrolls into view */}
      {STREAMS.map((st) => (
        <mask key={st.id} id={"stream-reveal-" + st.id} maskUnits="userSpaceOnUse" x="-300" y="-300" width="1600" height="1600">
          <path
            className="process-stream-reveal"
            d={st.center}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth="320"
            strokeLinecap="round"
          />
        </mask>
      ))}
    </defs>

    <g className="process-contact">
      <ellipse cx="520" cy="250" rx="420" ry="300" fill="url(#stage-glow)" />
    </g>

    <g mask="url(#stream-fade-mask)">
      {STREAMS.map((st) => (
        <g key={st.id} mask={"url(#stream-reveal-" + st.id + ")"}>
          {/* faint depth under the stream's lower edge */}
          <path d={st.outline} fill="#8a5a30" fillOpacity="0.1" transform="translate(4 9)" filter="url(#stream-shadow)" />
          {/* translucent body */}
          <path d={st.outline} fill="url(#stream-fill)" filter="url(#stream-soft)" />
          {/* delicate glassy edge */}
          <path d={st.outline} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.4" />
          <path d={st.outline} fill="none" stroke="#b98d5e" strokeOpacity="0.22" strokeWidth="1" transform="translate(1.5 2.5)" />
          {/* a couple of thin currents inside, for a sense of flow */}
          <path d={st.swirlA} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.2" />
          <path d={st.swirlB} fill="none" stroke="#c9a173" strokeOpacity="0.18" strokeWidth="1" />
        </g>
      ))}
    </g>
  </svg>
);
