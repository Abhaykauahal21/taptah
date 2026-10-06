"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Flame, Plus, X } from "lucide-react";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { FLAVOUR_BADGES } from "@/constants/flavours";
import { FlavourItem } from "@/types";
import { cn } from "@/lib/utils";
import { IngredientsSheet } from "./IngredientsSheet";

const HEAT = ["Mild", "Medium", "Hot"];

/** Three flames, filled up to the flavour's spice level. */
function SpiceMeter({ level }: { level: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Spice level: ${HEAT[level - 1] ?? "Mild"}`}
    >
      <div className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <Flame
            key={n}
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5",
              n <= level ? "fill-[#ffb347] text-[#ffb347]" : "text-cream/30",
            )}
            style={{ transitionDelay: `${n * 60}ms` }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">
        {HEAT[level - 1] ?? "Mild"}
      </span>
    </div>
  );
}

/** Which pop jowar sprite pops out of each flavour's bowl. */
const PUFF_FOR: Record<string, { src: string; w: number; h: number }> = {
  "butter-salt": { src: "pop-jwaar-1", w: 1397, h: 1126 },
  "peri-peri": { src: "masalla-pop-jwaar-1", w: 1316, h: 1195 },
  "tangy-pudina": { src: "podina-pop-jwaar", w: 1452, h: 1083 },
};

/** [left %, size px, drift x px, rotation deg, delay s] */
const PUFFS = [
  [34, 34, -46, -200, 0],
  [46, 28, 18, 160, 0.25],
  [56, 38, 52, 240, 0.5],
  [40, 24, -14, -120, 0.8],
  [62, 30, 30, 180, 1.05],
  [28, 26, -64, -260, 1.3],
] as const;

export function FlavourCard({ flavour, index }: { flavour: FlavourItem; index: number }) {
  const puff = PUFF_FOR[flavour.id] ?? PUFF_FOR["butter-salt"];
  const [showing, setShowing] = useState(false);
  // Phones get a bottom sheet instead of the in-card panel.
  const [sheet, setSheet] = useState(false);
  // Where the reveal grows from: the centre of the button, as a % of the photo area.
  const [origin, setOrigin] = useState({ x: 85, y: 8 });

  useEffect(() => {
    if (!showing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowing(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showing]);

  const open = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setSheet(true);
      return;
    }
    const area = e.currentTarget.closest<HTMLElement>("[data-photo]");
    if (area) {
      const a = area.getBoundingClientRect();
      const b = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: ((b.left + b.width / 2 - a.left) / a.width) * 100,
        y: ((b.top + b.height / 2 - a.top) / a.height) * 100,
      });
    }
    setShowing(true);
  };

  return (
    <article
      data-parallax={["0.05", "-0.04", "0.07"][index % 3]}
      className="flavour-card group relative rounded-[22px] text-cream"
      style={
        {
          "--i": index,
          "--glow": flavour.accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="flavour-tilt relative flex flex-col overflow-hidden rounded-[22px]"
        style={{ background: flavour.theme.to }}
      >
        {/* Just the pack: the artwork is cropped to the packet and its edges melt into the backdrop */}
        <div
          data-photo
          className="relative aspect-[1144/1375] overflow-hidden"
          style={{ background: flavour.tone }}
        >
          <Image
            src={flavour.image}
            alt={`${flavour.name} pop jowar pack`}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 30vw, 80vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/* A band of light sweeps across the pack on hover */}
          <span
            aria-hidden="true"
            className="flavour-sheen pointer-events-none absolute inset-0 hidden md:block"
          />

          <button
            type="button"
            onClick={open}
            aria-haspopup="dialog"
            aria-label={`See what is inside ${flavour.name}`}
            className="flavour-ing-btn group/ing absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#6B1022]/20 bg-[#fffaf0]/85 py-1 pl-3 pr-1 text-[13px] sm:right-3 sm:top-3 sm:gap-2 sm:py-1.5 sm:pl-4 sm:pr-1.5 sm:text-[15px] font-semibold italic text-[#5a1020] shadow-[0_8px_18px_-10px_rgba(60,28,12,0.55)] backdrop-blur-md transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Ingredients
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B1022] text-cream transition-transform duration-500 group-hover/ing:rotate-90 sm:h-7 sm:w-7">
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </span>
          </button>

          {/* Ingredients: a circle of paper grows out of the button, then the list is written in line by line */}
          <div
            role="dialog"
            aria-label={`${flavour.name} ingredients`}
            aria-hidden={!showing}
            inert={!showing}
            data-open={showing}
            className="flavour-ing absolute inset-0 z-20 flex flex-col overflow-hidden px-5 pb-4 pt-5 text-[#3a2018]"
            style={
              {
                "--ox": `${origin.x}%`,
                "--oy": `${origin.y}%`,
                "--accent": flavour.accentColor,
                background: `linear-gradient(180deg, #fffaf0, ${flavour.tone})`,
              } as React.CSSProperties
            }
          >
            {/* faded jowar in the corner, like a pressed botanical on the page */}
            <Image
              src="/images/why/jwar.webp"
              alt=""
              aria-hidden="true"
              width={1151}
              height={1367}
              sizes="20vw"
              className="pointer-events-none absolute -bottom-[14%] -right-[12%] w-[58%] rotate-[-14deg] opacity-[0.13] [mask-image:linear-gradient(0deg,transparent,#000_60%)]"
            />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flavour-ing-head">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--accent)]">
                  Ingredients
                </p>
                <p className="mt-1 text-[1.75rem] font-semibold leading-none text-[#6B1022]">
                  {flavour.name}
                </p>
                <svg viewBox="0 0 120 8" className="mt-2 h-2 w-[7.5rem]" fill="none" aria-hidden="true">
                  <path
                    d="M2 5C16 1 28 7 42 4s26-3 40 0 24 2 36-1"
                    pathLength={1}
                    stroke="var(--accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="flavour-ing-squiggle"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowing(false)}
                aria-label="Close ingredients"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6B1022]/25 text-[#6B1022] transition-all duration-300 hover:rotate-90 hover:bg-[#6B1022] hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ol
              data-lenis-prevent
              className="relative mt-4 flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(107,16,34,0.3)_transparent] [scrollbar-width:thin]"
            >
              {flavour.ingredients.map((ing, i) => {
                const long = ing.note.length > 34;
                return (
                  <li
                    key={ing.name}
                    className="flavour-ing-row relative grid grid-cols-[1.9rem_1fr] items-baseline py-[7px]"
                    style={{ "--k": i } as React.CSSProperties}
                  >
                    <span className="text-[13px] font-semibold italic tabular-nums text-[color:var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className={cn("leading-snug", long ? "block" : "flex flex-wrap items-baseline gap-x-2.5")}>
                      <span className="text-[1.02rem] font-semibold text-[#2f1a12]">{ing.name}</span>
                      <span className="text-[13.5px] italic text-[#7a5a48]">{ing.note}</span>
                    </p>
                  </li>
                );
              })}
            </ol>

            <p className="relative mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-[#6B1022]/15 pt-3 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#6B1022]/80">
              {FLAVOUR_BADGES.map((b, i) => (
                <React.Fragment key={b.id}>
                  {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />}
                  {b.label}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-3 lg:px-5">
          <p className="text-[1.3rem] font-semibold leading-tight">{flavour.name}</p>
          <p className="mt-0.5 text-[0.92rem] leading-snug text-cream/75">{flavour.tagline}</p>
          {/* Phones: price and spice on one row, a full-width Add to Cart under them. md+: side by side. */}
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
            <div className="flex items-center justify-between gap-3 lg:shrink-0 lg:flex-col lg:items-start lg:justify-start lg:gap-1.5">
              <span className="text-xl font-semibold leading-none">&#8377;{flavour.price}</span>
              {flavour.spiceLevel && <SpiceMeter level={flavour.spiceLevel} />}
            </div>
            <AddToCartButton
              id={flavour.id}
              image={flavour.image}
              className="w-full max-w-none lg:w-auto lg:max-w-[11rem]"
            />
          </div>
        </div>
      </div>

      {/* Hover: pop jowar pops out of the bowl and drifts up over the pack (not while the ingredients are open) */}
      {!showing && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          {PUFFS.map(([left, size, dx, rot, delay], i) => (
            <Image
              key={i}
              src={`/images/why/${puff.src}.webp`}
              alt=""
              width={puff.w}
              height={puff.h}
              className="flavour-puff absolute drop-shadow-[0_4px_5px_rgba(40,15,5,0.4)]"
              style={
                {
                  left: `${left}%`,
                  bottom: "42%",
                  width: size,
                  height: "auto",
                  "--x": `${dx}px`,
                  "--r": `${rot}deg`,
                  "--d": `${delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
      <IngredientsSheet flavour={flavour} open={sheet} onClose={() => setSheet(false)} />
    </article>
  );
}
