import React from "react";

/**
 * Out-of-focus foliage hanging in from the left edge of the page, like a
 * branch caught in the foreground of a photograph. A single stem with
 * lanceolate leaves, drawn in soft sage and heavily blurred so it reads as
 * depth rather than detail. It sways very slightly.
 */

const LEAF = "M0 0C9 -10 26 -14 46 -6C28 6 10 8 0 0Z";

type Leaf = { x: number; y: number; a: number; s: number; tone: number };

/** Leaves along a stem, spaced from `from` to `to` on both sides. */
function along(
  pts: Array<[number, number]>,
  baseAngle: number,
  scale: number,
  flip = false,
): Leaf[] {
  return pts.flatMap(([x, y], i) => [
    { x, y, a: baseAngle - 24 + (flip ? 8 : 0) - i * 4, s: scale * (1 - i * 0.04), tone: i % 2 },
    { x, y, a: baseAngle + 168 + (flip ? -8 : 0) - i * 4, s: scale * (0.92 - i * 0.04), tone: (i + 1) % 2 },
  ]);
}

/** Stems: [path, points to hang leaves from, base angle, scale]. */
const STEMS: Array<{ d: string; pts: Array<[number, number]>; angle: number; scale: number; w: number }> = [
  // main branch, reaching well to the right
  {
    d: "M0 520C60 470 130 410 210 350C290 290 370 250 470 232",
    pts: [[40, 497], [86, 452], [138, 408], [196, 362], [262, 318], [330, 282], [398, 252], [456, 236]],
    angle: -34,
    scale: 2.5,
    w: 7,
  },
  // upper branch fanning up and out
  {
    d: "M40 470C90 390 150 320 230 262C290 218 350 190 420 176",
    pts: [[78, 418], [122, 364], [174, 312], [232, 266], [294, 226], [352, 198]],
    angle: -56,
    scale: 2.2,
    w: 6,
  },
  // lower branch sweeping right along the bottom
  {
    d: "M0 590C80 560 170 540 260 540C330 540 390 548 440 560",
    pts: [[50, 578], [110, 556], [172, 542], [236, 538], [300, 540], [366, 548], [420, 556]],
    angle: -8,
    scale: 2.1,
    w: 5.5,
  },
  // short sprig near the top
  {
    d: "M20 390C60 330 110 280 170 236",
    pts: [[48, 354], [86, 312], [130, 270]],
    angle: -64,
    scale: 1.8,
    w: 4.5,
  },
];

const LEAVES: Leaf[] = STEMS.flatMap((st) => along(st.pts, st.angle, st.scale));

export const BlurredFoliage: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 520 640"
    data-parallax="-0.12"
    className="blurred-foliage pointer-events-none absolute -left-[2%] top-[18%] z-[1] hidden h-[56%] w-[31%] overflow-visible lg:block"
  >
    <defs>
      <filter id="foliage-blur" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    <g filter="url(#foliage-blur)" opacity="0.8">
      {STEMS.map((st, i) => (
        <path
          key={i}
          d={st.d}
          fill="none"
          stroke="#7d8a5a"
          strokeWidth={st.w}
          strokeLinecap="round"
        />
      ))}
      {LEAVES.map((l, i) => (
        <path
          key={i}
          d={LEAF}
          transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s})`}
          fill={l.tone ? "#8f9c6c" : "#6f7d4f"}
          fillOpacity={l.tone ? 0.75 : 0.9}
        />
      ))}
    </g>
  </svg>
);
