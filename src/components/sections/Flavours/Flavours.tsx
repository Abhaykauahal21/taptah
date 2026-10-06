import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InView } from "@/components/common/InView";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { FlavourCard } from "./FlavourCard";
import { FlavourList } from "./FlavourList";

/** One jowar ear drawn in pencil: a stalk, two leaves and a teardrop of kernel dots. */
function SketchEar({ x, h, cls }: { x: number; h: number; cls: string }) {
  const top = 150 - h;
  const dots = Array.from({ length: 9 }, (_, r) => {
    const half = 1.2 + 3.3 * Math.sin((Math.PI * (r + 0.6)) / 9.6);
    return [-1, 0, 1].filter((k) => Math.abs(k) * 1.9 <= half).map((k) => [x + k * 1.9, top + 4 + r * 3.1] as const);
  }).flat();
  return (
    <g className={"fl-sway " + cls}>
      <path d={`M${x} 150C${x - 1} ${top + 60} ${x + 1} ${top + 26} ${x} ${top + 30}`} />
      <path d={`M${x} 144C${x - 10} 140 ${x - 17} 130 ${x - 19} 120C${x - 9} 124 ${x - 2} 132 ${x} 144Z`} fill="#f1dcc0" fillOpacity="0.7" />
      <path d={`M${x} 136C${x + 9} 133 ${x + 15} 125 ${x + 17} 116C${x + 8} 119 ${x + 2} 126 ${x} 136Z`} fill="#f1dcc0" fillOpacity="0.7" />
      <path d={`M${x} ${top}C${x + 6} ${top + 8} ${x + 6} ${top + 22} ${x} ${top + 32}C${x - 6} ${top + 22} ${x - 6} ${top + 8} ${x} ${top}Z`} fill="#ecd2ab" fillOpacity="0.8" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.9" fill="#a98467" stroke="none" />
      ))}
    </g>
  );
}

/** A pencil-sketched pop jowar puff. */
function SketchPuff({ x, y, s = 1, cls }: { x: number; y: number; s?: number; cls: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={"fl-bob " + cls} fill="#f7ead4" fillOpacity="0.9">
        <circle cx="-4" cy="1" r="4.4" />
        <circle cx="3.6" cy="0" r="4.6" />
        <circle cx="0" cy="-4" r="4.2" />
        <circle cx="-1" cy="3.8" r="3.8" />
        <path d="M-2 -1l1.2 1M2 2l1.2-.8" strokeWidth="0.7" />
      </g>
    </g>
  );
}

const TREES = [
  [120, 70, 1],
  [104, 78, 0.8],
  [200, 84, 0.9],
] as const;

/**
 * Phones: a pencil-sketched jowar valley (mountains, a farmhouse, trees, a
 * sun and a few ears of jowar in front) that draws itself in when the
 * section appears. The ears sway and sketched pop jowar drifts about.
 */
function HeadArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 160"
      className="fl-art pointer-events-none absolute -top-5 right-[-1rem] aspect-[240/160] w-[40vw] max-w-[14rem] overflow-visible sm:hidden"
    >
      <defs>
        <radialGradient id="fl-wash" cx="50%" cy="55%" r="55%">
          <stop offset="0" stopColor="#f3dcb9" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f3dcb9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="124" cy="92" rx="122" ry="66" fill="url(#fl-wash)" />

      <g fill="none" stroke="#9a7254" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        {/* sun, with a ring of dashes turning slowly */}
        <circle cx="204" cy="30" r="9" fill="#f6dfb4" fillOpacity="0.8" />
        <circle cx="204" cy="30" r="16" strokeDasharray="1.5 4.5" strokeOpacity="0.7" className="fl-ring" />

        {/* far mountains */}
        <path d="M0 96L36 54L50 68L86 20L114 60L130 48L162 84L190 72L240 98" pathLength={1} className="fl-draw" />
        <path d="M86 20L80 36L90 32L96 44M36 54L40 64M130 48L126 58" strokeOpacity="0.7" pathLength={1} className="fl-draw" />
        <path d="M92 34L100 52M98 44L108 60M104 40L112 58M70 44L66 62M76 40L74 60M42 62L38 76M138 56L134 72M146 64L140 80" strokeOpacity="0.55" strokeWidth="0.7" pathLength={1} className="fl-draw" />

        {/* hill and furrowed field */}
        <path d="M0 110C40 92 92 102 132 96S208 98 240 106" pathLength={1} className="fl-draw" />
        <path d="M0 122C50 108 110 118 160 112S220 112 240 118" strokeOpacity="0.7" pathLength={1} className="fl-draw" />
        <path d="M0 134C60 122 120 132 170 126S224 126 240 130" strokeOpacity="0.5" pathLength={1} className="fl-draw" />

        {/* farmhouse */}
        <path d="M150 90V103H184V90" pathLength={1} className="fl-draw" />
        <path d="M146 90L167 76L188 90Z" fill="#f1dcc0" fillOpacity="0.8" pathLength={1} className="fl-draw" />
        <path d="M176 82V76H180V84" pathLength={1} className="fl-draw" />
        <path d="M160 103V95H166V103M171 95H178V100H171Z" strokeOpacity="0.8" pathLength={1} className="fl-draw" />

        {/* trees */}
        {TREES.map(([tx, ty, k], i) => (
          <g key={i} transform={`translate(${tx} ${ty}) scale(${k})`}>
            <path d="M0 30V12" pathLength={1} className="fl-draw" />
            <path d="M0 -12C8 -8 9 4 0 14C-9 4 -8 -8 0 -12Z" fill="#ecd9b6" fillOpacity="0.85" pathLength={1} className="fl-draw" />
            <path d="M-3 -4L2 0M-4 3L3 6M0 -8L3 -5M-2 8L2 10" strokeWidth="0.7" strokeOpacity="0.7" pathLength={1} className="fl-draw" />
          </g>
        ))}

        {/* a bird */}
        <g className="fl-bob fl-b2">
          <path d="M40 30c3-4 6-4 8 0c2-4 5-4 8 0" strokeOpacity="0.8" />
        </g>

        {/* jowar in front */}
        <SketchEar x={40} h={66} cls="" />
        <SketchEar x={62} h={80} cls="fl-s2" />
        <SketchEar x={84} h={58} cls="fl-s3" />
      </g>

      {/* sketched pop jowar drifting */}
      <g fill="none" stroke="#a98467" strokeWidth="0.9" strokeLinecap="round">
        <SketchPuff x={20} y={64} s={0.9} cls="fl-b1" />
        <SketchPuff x={226} y={74} s={0.75} cls="fl-b2" />
        <SketchPuff x={110} y={30} s={0.6} cls="fl-b3" />
      </g>
    </svg>
  );
}

export const Flavours: React.FC = () => {
  return (
    <section
      id="flavours"
      aria-label="Our Flavours"
      className="relative overflow-hidden bg-background px-5 py-16 text-maroon sm:px-8 lg:px-12 lg:py-24"
    >
      {/* Backdrop (tablet and up): colour washes in each flavour's tone, a faded
          outlined wordmark and two faded leaves. Everything melts into the page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="flavour-wash left-[2%] bg-[#C28A1C]" />
        <span className="flavour-wash left-[34%] bg-[#B3261E] [animation-delay:-3s]" />
        <span className="flavour-wash right-[2%] bg-[#4F7A2B] [animation-delay:-6s]" />
        <p data-parallax="0.08" className="flavour-watermark">
          Pop Jowar
        </p>
        <Image
          src="/images/why/leaf-b.png"
          alt=""
          width={175}
          height={126}
          className="flavour-leaf absolute -left-[3%] top-[8%] w-[15vw] max-w-[14rem] rotate-[24deg]"
        />
        <Image
          src="/images/why/leaf-c.png"
          alt=""
          width={169}
          height={141}
          className="flavour-leaf absolute -right-[3%] bottom-[6%] w-[15vw] max-w-[14rem] -rotate-[28deg] scale-x-[-1]"
        />
      </div>

      <InView className="flavours-art relative z-10 mx-auto max-w-[1280px]">
        <div data-parallax="0.06" className="flavours-head relative mx-auto flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:max-w-[1040px]">
          <HeadArt />
          <div>
            <div className="flex items-center gap-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/70 sm:text-sm">
                Our Flavours
              </p>
              <span aria-hidden="true" className="rv-rule hidden h-px w-16 bg-[#6B1022]/45 sm:block" />
            </div>
            <h2 className="relative z-10 mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
              <span className="rv-line" style={{ "--l": 0 } as React.CSSProperties}>
                <span>Flavours That</span>
              </span>
              <span className="rv-line" style={{ "--l": 1 } as React.CSSProperties}>
                <span>Tell a Story.</span>
              </span>
            </h2>
          </div>

          <div className="flex items-end gap-8 sm:gap-12">
            <p className="max-w-[16rem] text-[clamp(1rem,1.15vw,1.15rem)] font-medium leading-snug text-[#4a3a33]">
              Classic grains, exciting flavours. Find your perfect crunch.
            </p>
            <Link
              href="#flavours"
              className="group hidden shrink-0 items-center gap-2 border-b border-[#6B1022]/30 pb-0.5 text-base font-semibold text-[#6B1022] transition-colors hover:border-[#6B1022] sm:inline-flex"
            >
              View All Flavours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <FlavourList labels={FLAVOURS_DATA.map((f) => f.name)}>
          {FLAVOURS_DATA.map((flavour, i) => (
            <FlavourCard key={flavour.id} flavour={flavour} index={i} />
          ))}
        </FlavourList>
      </InView>
    </section>
  );
};
