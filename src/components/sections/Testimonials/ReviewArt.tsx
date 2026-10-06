import React from "react";
import Image from "next/image";

/**
 * Phone-only artwork for the reviews: pop jowar piled in loose heaps over a
 * soft brush-stroke blob, tucked between green leaves. Every piece is a real
 * cut-out with a consistent soft shadow, so the heaps read as one object.
 */

const SPRITES = {
  plain1: { src: "pop-jwaar-1", w: 1397, h: 1126 },
  plain2: { src: "pop-jwaar-2", w: 1293, h: 1217 },
  masala1: { src: "masalla-pop-jwaar-1", w: 1316, h: 1195 },
  masala2: { src: "masalla-pop-jwaar-2", w: 1452, h: 1083 },
  pudina: { src: "podina-pop-jwaar", w: 1452, h: 1083 },
} as const;
type Sprite = keyof typeof SPRITES;

/** [x %, y %, width %, sprite, rotation deg] */
type Piece = readonly [number, number, number, Sprite, number];

const HEAPS: Record<"plain" | "masala" | "pudina", Piece[]> = {
  plain: [
    [2, 46, 40, "plain2", -24],
    [38, 50, 42, "plain1", 18],
    [14, 30, 38, "plain1", 62],
    [50, 28, 36, "plain2", -38],
    [26, 54, 40, "plain1", -8],
    [30, 12, 34, "plain2", 30],
    [58, 8, 24, "plain1", -50],
  ],
  masala: [
    [4, 48, 40, "masala1", -20],
    [40, 52, 40, "masala2", 14],
    [16, 32, 38, "masala2", 58],
    [52, 28, 34, "masala1", -34],
    [28, 56, 38, "masala1", 4],
    [32, 12, 32, "plain1", 26],
    [60, 10, 24, "masala2", -46],
  ],
  pudina: [
    [2, 48, 40, "pudina", -26],
    [38, 52, 40, "plain2", 16],
    [14, 32, 38, "plain1", 64],
    [50, 30, 34, "pudina", -36],
    [26, 56, 38, "pudina", 6],
    [32, 12, 32, "plain2", 32],
    [58, 10, 24, "plain1", -48],
  ],
};


export function Heap({
  kind = "plain",
  className = "",
  float = true,
}: {
  kind?: keyof typeof HEAPS;
  className?: string;
  float?: boolean;
}) {
  return (
    <div className={"aspect-square drop-shadow-[0_6px_6px_rgba(70,35,10,0.28)] " + className}>
      {HEAPS[kind].map(([x, y, w, k, r], i) => {
        const sp = SPRITES[k];
        return (
          <Image
            key={i}
            src={`/images/why/${sp.src}.webp`}
            alt=""
            width={sp.w}
            height={sp.h}
            sizes="30vw"
            className={"absolute h-auto" + (float && i > 4 ? " proc-float" : "")}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                zIndex: i < 5 ? i : 0,
                rotate: float && i > 4 ? undefined : `${r}deg`,
                "--r": `${r}deg`,
                "--d": `${5 + i}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

/** A soft, hand-brushed blob of colour. */
export function Blob({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="rv-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d9d0" />
          <stop offset="1" stopColor="#ecc3b6" />
        </linearGradient>
      </defs>
      <path
        d="M104 8c42 2 84 30 90 74 6 46-24 92-72 106-44 12-100 0-114-44C-4 100 10 50 44 26 62 14 82 7 104 8Z"
        fill="url(#rv-blob)"
        opacity="0.8"
      />
      <path
        d="M30 120C20 70 70 22 120 24"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Leaves({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={"pointer-events-none absolute " + className}>
      <Image
        src="/images/why/leaf-b.png"
        alt=""
        width={175}
        height={126}
        className="absolute left-0 top-[34%] w-[62%] rotate-[-18deg] drop-shadow-[2px_5px_4px_rgba(60,35,15,0.28)]"
      />
      <Image
        src="/images/why/leaf-c.png"
        alt=""
        width={169}
        height={141}
        className="absolute right-[4%] top-0 w-[48%] rotate-[24deg] drop-shadow-[2px_5px_4px_rgba(60,35,15,0.28)]"
      />
    </div>
  );
}
