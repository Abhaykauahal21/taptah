import React from "react";
import Image from "next/image";
import { Flame, Leaf, Sparkles, Sprout } from "lucide-react";
import { InView } from "@/components/common/InView";
import { PROCESS_STEPS } from "@/constants/process";
import { GrainFlow } from "./GrainFlow";
import { KadayiFire } from "./KadayiFire";
import {
  BOTTLE_DX,
  BOTTLE_DY,
  BOTTLE_W,
  BOWL1,
  BOWL2,
  BOWL3,
  KADAYI,
  M_H,
  M_W,
  STALKS,
} from "./mobileLayout";

/**
 * The process section for phones and tablets (below lg): a tall zig-zag of the
 * same vessels the desktop artboard uses, with each step label sitting beside
 * its vessel. Positions are in the 480 x 880 scene units from mobileLayout.ts
 * and become percentages of the scene, so everything scales together; GrainFlow
 * simulates the grains in those same units.
 */

const X = (x: number) => `${(x / M_W) * 100}%`;
const Y = (y: number) => `${(y / M_H) * 100}%`;
const W = (w: number) => `${(w / M_W) * 100}%`;

/** Small decorative pop jowar and grains drifting around the scene. */
const POPS: Array<[number, number, number, 1 | 2, number]> = [
  // x, y, width, sprite, rotation
  [186, 162, 24, 1, 20],
  [398, 168, 28, 2, -18],
  [452, 214, 20, 1, 40],
  [236, 360, 26, 2, -30],
  [398, 372, 24, 1, 14],
  [18, 336, 22, 2, 60],
  [196, 566, 24, 1, -12],
  [247, 590, 18, 2, 30],
  [14, 548, 22, 1, -40],
  [452, 566, 26, 2, 22],
  [118, 792, 26, 1, 10],
  [38, 808, 22, 2, -26],
  [440, 762, 24, 1, 34],
  [74, 262, 18, 2, 8],
  [340, 468, 18, 1, -22],
];

/** Green leaves tucked around the vessels. */
const LEAVES: Array<{ src: string; w: number; h: number; x: number; y: number; size: number; rot: number }> = [
  // beside the bowl, as on the desktop artboard
  { src: "leaf-b", w: 175, h: 126, x: 118, y: 336, size: 64, rot: 128 },
  { src: "leaf-b", w: 175, h: 126, x: 186, y: 338, size: 64, rot: -16 },
  // at the foot of the kadayi
  { src: "leaf-b", w: 175, h: 126, x: 438, y: 534, size: 70, rot: 160 },
  // between the flavour bowls
  { src: "leaf-a", w: 127, h: 99, x: 232, y: 742, size: 56, rot: 20 },
  // loose on the sides
  { src: "leaf-c", w: 169, h: 141, x: -12, y: 430, size: 56, rot: 70 },
  { src: "leaf-a", w: 127, h: 99, x: 492, y: 372, size: 60, rot: 120 },
  { src: "leaf-b", w: 175, h: 126, x: 470, y: 830, size: 74, rot: 150 },
];

const LABELS = [
  { ...PROCESS_STEPS[0], Icon: Sprout, x: 208, y: 22, w: 266 },
  { ...PROCESS_STEPS[1], Icon: Sparkles, x: 262, y: 216, w: 214 },
  { ...PROCESS_STEPS[2], Icon: Flame, x: 8, y: 398, w: 270 },
  { ...PROCESS_STEPS[3], Icon: Leaf, x: 152, y: 788, w: 322 },
];

/** A cheap contact shadow (a flat gradient ellipse) instead of a blurred black copy. */
function Cast({ className }: { src?: string; w?: number; h?: number; className: string }) {
  if (className.includes("air")) return null;
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[2%] left-[10%] h-[14%] w-[88%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,30,10,0.38),transparent)]"
    />
  );
}

function Item({
  x,
  y,
  w,
  delay,
  className = "",
  children,
}: {
  x: number;
  y: number;
  w: number;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={"process-flow absolute " + className}
      style={{ left: X(x), top: Y(y), width: W(w), transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export const ProcessMobile: React.FC = () => {
  return (
    <InView
      watch=".process-scene-m"
      threshold={0.25}
      className="process-art relative mx-auto max-w-[640px] lg:hidden"
    >
      {/* Heading and intro */}
      <div className="process-copy relative">
        {/* A spill of grains and leaves in the top-right corner */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-8 h-[8.5rem] w-32 sm:-right-8 sm:h-44 sm:w-40">
          <Image
            src="/images/why/leaf-b.png"
            alt=""
            width={175}
            height={126}
            className="absolute right-[-10%] top-[4%] w-[78%] rotate-[28deg] drop-shadow-[2px_6px_5px_rgba(60,35,15,0.25)]"
          />
          <Image
            src="/images/why/leaf-b.png"
            alt=""
            width={175}
            height={126}
            className="absolute right-[6%] top-[46%] w-[52%] rotate-[96deg] drop-shadow-[2px_6px_5px_rgba(60,35,15,0.25)]"
          />
          <Image
            src="/images/why/jwar-grain-2.webp"
            alt=""
            width={1512}
            height={1040}
            className="absolute right-[30%] top-[36%] w-[22%] rotate-[30deg]"
          />
          {[
            [10, 62, 16, 1, 10],
            [40, 8, 14, 2, -20],
            [30, 82, 12, 1, 40],
          ].map(([l, t, w, n, r], i) => (
            <Image
              key={i}
              src={`/images/why/pop-jwaar-${n}.webp`}
              alt=""
              width={140}
              height={113}
              className="proc-float absolute"
              style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, "--r": `${r}deg`, "--d": `${4 + i}s` } as React.CSSProperties}
            />
          ))}
        </div>

        <p className="flex items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.25em] text-[#6B1022]/80 sm:text-sm">
          The Taptah Process
          <span aria-hidden="true" className="h-px max-w-[10rem] flex-1 bg-[#6B1022]/30" />
        </p>
        <h2 className="relative mt-4 max-w-[17.5rem] text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-[#6B1022] sm:max-w-[30rem] sm:text-[3.6rem]">
          From Ancient Grains to Your Favourite Crunch.
        </h2>
        <p className="relative mt-5 max-w-[22rem] text-[1.05rem] font-medium leading-[1.5] text-[#3a2a24] sm:max-w-[28rem] sm:text-[1.2rem]">
          Every pack of Taptah Pop Jowar goes through a thoughtful journey —
          from our fields to your hands, with purity, care and the flavour of
          tradition.
        </p>
      </div>

      {/* The scene */}
      <div
        className="process-scene-m relative -mx-5 mt-8 aspect-[480/880] sm:mx-auto sm:max-w-[560px]"
      >
        {/* Studio glow and the flowing stream the grains travel along */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${M_W} ${M_H}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <radialGradient id="pm-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fffaf0" stopOpacity="0.75" />
              <stop offset="0.6" stopColor="#fff3df" stopOpacity="0.3" />
              <stop offset="1" stopColor="#fff3df" stopOpacity="0" />
            </radialGradient>
            <filter id="pm-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <g className="process-contact">
            <ellipse cx="240" cy="330" rx="330" ry="300" fill="url(#pm-glow)" />
            <ellipse cx="240" cy="690" rx="320" ry="220" fill="url(#pm-glow)" />
          </g>
          {[STREAM_A, STREAM_B].map((d, i) => (
            <g key={i}>
              <path
                className="process-stream-reveal"
                d={d}
                pathLength={1}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.45"
                strokeWidth="34"
                strokeLinecap="round"
                filter="url(#pm-soft)"
              />
              <path
                className="process-stream-reveal"
                d={d}
                pathLength={1}
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.85"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>

        {/* Line-art backdrop */}
        <Item x={-46} y={104} w={300} delay={0.2} className="pointer-events-none">
          <Image
            src="/images/why/mointain.webp"
            alt=""
            aria-hidden="true"
            width={1774}
            height={887}
            sizes="60vw"
            className="h-auto w-full opacity-45 [mask-image:radial-gradient(ellipse_at_50%_55%,#000_38%,transparent_72%)]"
          />
        </Item>
        <Item x={-8} y={762} w={118} delay={0.4} className="pointer-events-none">
          <Image
            src="/images/why/deco-branch.webp"
            alt=""
            aria-hidden="true"
            width={350}
            height={490}
            sizes="25vw"
            className="h-auto w-full opacity-55"
          />
        </Item>
        <Item x={420} y={428} w={64} delay={0.4} className="pointer-events-none">
          <Image
            src="/images/why/deco-leaves.webp"
            alt=""
            aria-hidden="true"
            width={260}
            height={320}
            sizes="15vw"
            className="h-auto w-full opacity-55"
          />
        </Item>

        {/* Leaves that sit behind the vessels */}
        {LEAVES.slice(0, 2).map((l, i) => (
          <SceneLeaf key={i} leaf={l} i={i} />
        ))}

        {/* Step 1: jowar stalks and the scoop */}
        <Item x={STALKS.x} y={STALKS.y} w={STALKS.w} delay={0}>
          <Cast src="/images/why/naturally-grown-clean.webp" w={1396} h={1127} className="process-cast-air" />
          <Image
            loading="eager"
            src="/images/why/naturally-grown-clean.webp"
            alt="Jowar stalks with a stream of grains pouring from a wooden scoop"
            width={1396}
            height={1127}
            sizes="(min-width: 640px) 280px, 50vw"
            className="relative h-auto w-full"
          />
        </Item>

        {/* Step 2: the bowl the grains pour into */}
        <Item x={BOWL1.x} y={BOWL1.y} w={BOWL1.w} delay={0.4}>
          <Cast src="/images/why/step-2-bowl-empty.webp" w={1492} h={1054} className="process-cast-floor" />
          <Image
            loading="eager"
            src="/images/why/step-2-bowl-empty.webp"
            alt="Cleaned jowar grains pouring into a wooden bowl"
            width={1492}
            height={1054}
            sizes="(min-width: 640px) 260px, 50vw"
            className="relative h-auto w-full"
          />
        </Item>

        {LEAVES.slice(2, 4).map((l, i) => (
          <SceneLeaf key={i} leaf={l} i={i + 2} />
        ))}

        {/* Step 3: slow-cooking kadayi on a clay chulha */}
        <Item x={KADAYI.x} y={KADAYI.y} w={KADAYI.w} delay={0.8}>
          <Cast src="/images/why/kadayi.webp" w={1419} h={1108} className="process-cast-floor" />
          <Image
            loading="eager"
            src="/images/why/kadayi.webp"
            alt="Copper kadayi on a clay stove with a wood fire burning below"
            width={1419}
            height={1108}
            sizes="(min-width: 640px) 230px, 45vw"
            className="relative h-auto w-full"
          />
          <KadayiFire className="" />
        </Item>

        {/* Step 4: two bowls, each with a pair of shakers */}
        {[
          { bowl: BOWL3, bottle: "podina-masalla-bottle", alt: "A wooden bowl catching pudina-flavoured pop jowar", d: 1.1 },
          { bowl: BOWL2, bottle: "masala-bottle", alt: "A wooden bowl catching freshly popped, masala-coated jowar", d: 1.25 },
        ].map(({ bowl, bottle, alt, d }) => (
          <React.Fragment key={bottle}>
            <Item x={bowl.x} y={bowl.y} w={bowl.w} delay={d}>
              <Cast src="/images/why/step-2-bowl-empty.webp" w={1492} h={1054} className="process-cast-floor" />
              <Image
                loading="eager"
                src="/images/why/step-2-bowl-empty.webp"
                alt={alt}
                width={1492}
                height={1054}
                sizes="(min-width: 640px) 260px, 50vw"
                className="relative h-auto w-full"
              />
            </Item>
            {BOTTLE_DX.map((dx, k) => (
              <Item key={k} x={bowl.x + dx} y={bowl.y + BOTTLE_DY} w={BOTTLE_W} delay={d + 0.4} className="z-10">
                <Image
                  loading="eager"
                  src={`/images/why/${bottle}.webp`}
                  alt={k === 0 ? "Spice shaker" : ""}
                  aria-hidden={k === 0 ? undefined : true}
                  width={1024}
                  height={1536}
                  sizes="(min-width: 640px) 60px, 14vw"
                  className={
                    "masala-shaker h-auto w-full drop-shadow-[4px_8px_6px_rgba(40,20,5,0.35)] " +
                    (k === 1 ? "masala-shaker-right" : "")
                  }
                />
              </Item>
            ))}
          </React.Fragment>
        ))}

        {LEAVES.slice(4).map((l, i) => (
          <SceneLeaf key={i} leaf={l} i={i + 4} />
        ))}

        {/* Grains spill from the scoop, heap up in the bowls and pop in the kadayi */}
        <GrainFlow layout="mobile" watch=".process-scene-m" className="" />

        {/* Pop jowar floating about */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
          {POPS.map(([x, y, w, n, r], i) => (
            <Image
              key={i}
              src={`/images/why/pop-jwaar-${n}.webp`}
              alt=""
              width={140}
              height={113}
              className="proc-float absolute"
              style={
                {
                  left: X(x),
                  top: Y(y),
                  width: W(w),
                  "--r": `${r}deg`,
                  "--d": `${4 + (i % 5)}s`,
                  "--dl": `${(i % 4) * -1.1}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Step labels, each beside its vessel */}
        {LABELS.map(({ Icon, ...l }, i) => (
          <div
            key={l.step}
            className="process-step absolute z-20 flex items-stretch gap-[0.55rem]"
            style={
              {
                left: X(l.x),
                top: Y(l.y),
                width: W(l.w),
                "--step-delay": `${1.1 + i * 0.35}s`,
              } as React.CSSProperties
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full bg-[#f0d9b2]/90 text-[0.95rem] font-semibold text-[#6B1022] shadow-[0_6px_14px_-6px_rgba(120,70,30,0.5)] sm:h-11 sm:w-11 sm:text-[1.1rem]">
              {String(l.step).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="w-px shrink-0 bg-[#6B1022]/20" />
            <div className="min-w-0 pb-1">
              <Icon aria-hidden="true" strokeWidth={1.1} className="h-7 w-7 text-[#6B1022] sm:h-9 sm:w-9" />
              <h3 className="mt-1 text-[1.12rem] font-semibold leading-[1.15] text-[#6B1022] sm:text-[1.4rem]">
                {l.title}
              </h3>
              <p className="mt-1 text-[0.95rem] font-medium leading-snug text-[#5a463c] sm:text-[1.1rem]">
                {l.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </InView>
  );
};

/** The two currents: scoop to bowl to kadayi, then the kadayi down to the bowls. */
const STREAM_A = "M150 150 C120 210 200 250 150 330 C100 400 230 400 330 450";
const STREAM_B =
  "M380 520 C420 590 330 600 250 640 C170 680 130 640 120 700 M330 600 C380 650 400 640 380 700";

function SceneLeaf({ leaf, i }: { leaf: (typeof LEAVES)[number]; i: number }) {
  return (
    <div
      aria-hidden="true"
      className="process-flow pointer-events-none absolute"
      style={{
        left: X(leaf.x),
        top: Y(leaf.y),
        width: W(leaf.size),
        transitionDelay: `${0.9 + i * 0.12}s`,
      }}
    >
      <Image
        loading="eager"
        src={`/images/why/${leaf.src}.png`}
        alt=""
        width={leaf.w}
        height={leaf.h}
        sizes="15vw"
        className="bowl-leaf h-auto w-full drop-shadow-[2px_6px_5px_rgba(60,35,15,0.25)]"
        style={
          {
            "--r": `${leaf.rot}deg`,
            transformOrigin: "3% 8%",
            animationDelay: `${(i % 4) * 0.7}s`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
