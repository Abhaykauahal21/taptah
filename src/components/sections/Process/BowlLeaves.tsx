import React from "react";
import Image from "next/image";

/**
 * Green jowar leaves tucked around the bowl. `behind` leaves sit behind the
 * bowl's rim, `front` leaves overlap its edge. Positions are percentages of
 * the process artboard (the bowl spans x 35-57%, y 8-26%); each leaf sways
 * gently around its base.
 */

interface LeafSpec {
  src: string;
  width: number;
  height: number;
  /** Where the leaf's stem attaches, in % of the artboard. */
  x: number;
  y: number;
  /** Leaf width, in % of the artboard. */
  size: number;
  /** Rotation in degrees. The artwork points down-right (~35deg) at 0. */
  rotate: number;
  delay: number;
}

const A = { src: "/images/why/leaf-a.png", width: 127, height: 99 };
const B = { src: "/images/why/leaf-b.png", width: 175, height: 126 };

const LEAVES: { behind: LeafSpec[]; front: LeafSpec[] } = {
  // One leaf tucked in at each side of the bowl's base; nothing around the rim.
  behind: [
    { ...B, x: 44.3, y: 23.2, size: 5.6, rotate: 128, delay: 0 },
    { ...B, x: 50.8, y: 23.2, size: 5.6, rotate: -16, delay: 0.8 },
    // Growing out of the jowar stalks at the scoop (stem base at ~41%, 4.6%)
    { ...B, x: 40.7, y: 4.4, size: 5.2, rotate: 128, delay: 0.5 },
    { ...A, x: 41.5, y: 4.7, size: 4.4, rotate: -14, delay: 1.1 },
  ],
  front: [],
};

function Leaf({ leaf }: { leaf: LeafSpec }) {
  return (
    <div
      className="process-flow absolute hidden lg:block"
      style={{
        left: `${leaf.x}%`,
        top: `${leaf.y}%`,
        width: `${leaf.size}%`,
        transitionDelay: `${0.9 + leaf.delay * 0.15}s`,
      }}
    >
      <Image
        loading="eager"
        src={leaf.src}
        alt=""
        aria-hidden="true"
        width={leaf.width}
        height={leaf.height}
        sizes="12vw"
        className="bowl-leaf h-auto w-full drop-shadow-[2px_6px_5px_rgba(60,35,15,0.25)]"
        style={
          {
            "--r": `${leaf.rotate}deg`,
            transformOrigin: "3% 8%",
            animationDelay: `${leaf.delay}s`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export const BowlLeavesBehind: React.FC = () => (
  <>
    {LEAVES.behind.map((l, i) => (
      <Leaf key={i} leaf={l} />
    ))}
  </>
);

export const BowlLeavesFront: React.FC = () => (
  <>
    {LEAVES.front.map((l, i) => (
      <Leaf key={i} leaf={l} />
    ))}
  </>
);
