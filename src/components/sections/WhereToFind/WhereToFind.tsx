import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { InView } from "@/components/common/InView";

/** Retailer logos (optimised copies live in /public/images/stores). "icon" logos are app tiles, "mark" logos sit on a white card. */
const STORES = [
  { name: "Amazon", src: "/images/stores/amazon.webp", w: 530, h: 160, kind: "mark", imgH: "h-7 sm:h-9" },
  { name: "Blinkit", src: "/images/stores/blinkit.webp", w: 200, h: 200, kind: "icon" },
  { name: "Zepto", src: "/images/stores/zepto.webp", w: 200, h: 200, kind: "icon" },
  { name: "Nature's Basket", src: "/images/stores/natures-basket.webp", w: 304, h: 200, kind: "mark", imgH: "h-10 sm:h-12" },
  { name: "Reliance Retail", src: "/images/stores/reliance.webp", w: 362, h: 180, kind: "mark", imgH: "h-10 sm:h-12" },
] as const;

const PACKS = [
  { src: "/images/flavours/PeriPeriPack.webp", alt: "Peri Peri Pop Jowar pack", side: "left", rot: -9 },
  { src: "/images/flavours/TangyPudinaPack.webp", alt: "Tangy Pudina Pop Jowar pack", side: "right", rot: 8 },
] as const;

const rv = (i: number): React.CSSProperties => ({ "--i": i }) as React.CSSProperties;

export const WhereToFind: React.FC = () => {
  return (
    <section
      id="where-to-find"
      aria-label="Where to find us"
      className="relative overflow-hidden bg-background px-5 py-20 text-[#C8154B] sm:px-8 lg:px-12 lg:py-28"
    >
      {/* Soft light that slowly breathes behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="wtf-glow absolute left-1/2 top-[55%] h-[90%] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.55),transparent)]" />
      </div>

      <InView className="wtf-art relative z-10 mx-auto max-w-[1100px] text-center">
        {/* Packs peek in from the sides on wide screens */}
        {PACKS.map((p) => (
          <div
            key={p.src}
            aria-hidden="true"
            className={`wtf-pack pointer-events-none absolute top-[6%] hidden w-[17%] max-w-[190px] lg:block ${
              p.side === "left" ? "-left-[12%]" : "-right-[12%]"
            }`}
            style={{ "--r": `${p.rot}deg`, "--from": p.side === "left" ? "-60px" : "60px" } as React.CSSProperties}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={572}
              height={687}
              sizes="190px"
              className="wtf-pack-img h-auto w-full drop-shadow-[0_18px_22px_rgba(8,37,103,0.28)]"
            />
          </div>
        ))}

        <p
          style={rv(0)}
          className="wtf-rise inline-flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#C8154B]/80 sm:text-sm"
        >
          <span aria-hidden="true" className="wtf-dot h-2.5 w-2.5 rounded-full bg-[#C8154B]" />
          Launching Soon
        </p>

        <h2
          style={rv(1)}
          className="wtf-rise mt-4 text-[clamp(2.5rem,5.4vw,5rem)] font-semibold leading-[1.04] tracking-tight"
        >
          Coming to a Shelf
          <br />
          Near You.
        </h2>

        <p
          style={rv(2)}
          className="wtf-rise mx-auto mt-5 max-w-[34rem] text-[clamp(1.05rem,1.35vw,1.3rem)] font-medium leading-[1.55] text-[#082567]"
        >
          Pop Jowar is on its way to your favourite stores and apps.
        </p>

        {/* Stores, in one row, standing on a shelf */}
        <div className="relative mt-12">
          <ul className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {STORES.map((store, i) => (
              <li key={store.name} style={rv(3 + i)} className="wtf-rise">
                <span
                  className={
                    "wtf-chip flex h-16 items-center justify-center overflow-hidden rounded-2xl shadow-[0_10px_24px_-14px_rgba(8,37,103,0.45)] sm:h-[4.5rem] " +
                    (store.kind === "icon"
                      ? "w-16 sm:w-[4.5rem]"
                      : "bg-white/80 px-5 ring-1 ring-[#082567]/10 backdrop-blur-sm sm:px-7")
                  }
                  style={{ "--b": `${i * 0.35}s` } as React.CSSProperties}
                >
                  <Image
                    src={store.src}
                    alt={store.name}
                    width={store.w}
                    height={store.h}
                    sizes="160px"
                    className={store.kind === "icon" ? "h-full w-full object-cover" : `${store.imgH} w-auto`}
                  />
                </span>
              </li>
            ))}
            <li style={rv(3 + STORES.length)} className="wtf-rise">
              <span className="flex h-16 items-center px-2 text-[1.05rem] font-semibold italic text-[#082567]/70 sm:h-[4.5rem] sm:text-[1.2rem]">
                and more
              </span>
            </li>
          </ul>
          <span
            aria-hidden="true"
            className="wtf-shelf mx-auto mt-5 block h-[3px] w-full max-w-[860px] rounded-full bg-gradient-to-r from-transparent via-[#C8154B]/45 to-transparent"
          />
        </div>

        <div
          style={rv(10)}
          className="wtf-rise mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
        >
          <p className="text-[1.15rem] font-semibold text-[#082567]">Be the first to crunch.</p>
          <a
            href="mailto:hello@taptah.com?subject=Notify%20me%20when%20Pop%20Jowar%20launches"
            className="hero-shine group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#C8154B] px-7 py-3.5 text-base font-semibold text-[#F2EEBF] shadow-lg transition-all duration-300 hover:bg-[#a90f3d] hover:shadow-xl"
          >
            Notify me
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </InView>
    </section>
  );
};
