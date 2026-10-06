import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { HeroEffects } from "./HeroEffects";

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="sticky top-0 isolate flex h-[100svh] min-h-[620px] items-center overflow-hidden bg-[#2a1209] text-cream"
    >
      {/* Background image */}
      <div className="hero-bg absolute inset-0 -z-20">
        <Image
          src="/images/hero/hero.webp"
          alt="Spiced roasted ancient-grain puffs bursting from a stone bowl"
          fill
          priority
          sizes="100vw"
          className="hero-kenburns object-cover object-[72%_center] lg:object-center"
        />
      </div>
      {/* Readability overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#2a1209]/90 via-[#2a1209]/55 to-transparent lg:via-[#2a1209]/30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      {/* Breathing oven glow behind the bowl */}
      <div className="hero-glow absolute -z-10" />

      <HeroEffects />
      {/* Darkens the hero as the page slides up over it */}
      <div className="hero-cover pointer-events-none absolute inset-0 z-[5] bg-[#1a0904]" />

      <div className="hero-content relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-28 pt-28 sm:px-8 lg:px-12">
        <div className="max-w-[520px]">
          <p style={{ "--i": 0 } as React.CSSProperties} className="hero-fade mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/80 sm:text-xs">
            The Ancient Supergrain
          </p>

          <h1 className="text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-[clamp(3rem,4.9vw,4.75rem)]">
            <span className="hero-line">
              <span className="hero-line-inner" style={{ "--i": 0 } as React.CSSProperties}>
                Ancient Grain
              </span>
            </span>
            <span className="hero-line">
              <span className="hero-line-inner" style={{ "--i": 1 } as React.CSSProperties}>
                Modern Crunch.
              </span>
            </span>
          </h1>

          <p style={{ "--i": 3 } as React.CSSProperties} className="hero-fade mt-5 max-w-sm text-base leading-snug text-cream/90 sm:text-lg">
            Light, crunchy snacks crafted from ancient grains, for a healthier,
            happier you.
          </p>

          <div style={{ "--i": 4 } as React.CSSProperties} className="hero-fade mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="#flavours"
              className="hero-shine relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-cream px-6 py-3 text-base font-semibold text-maroon shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl"
            >
              Explore Pop Jowar
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#story"
              className="group inline-flex items-center gap-2.5 text-base font-semibold text-cream"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/60 transition-colors group-hover:bg-cream/15">
                <Play className="h-4 w-4 fill-cream" />
              </span>
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Handwritten tagline */}
      <p
        aria-hidden="true"
        className="hero-script pointer-events-none absolute right-[4%] top-[20%] z-10 hidden -rotate-6 text-center font-[family-name:var(--font-script)] text-4xl leading-[0.95] text-cream/95 drop-shadow-lg lg:block xl:text-5xl"
      >
        Crunch
        <br />
        Clean
        <br />
        Repeat
        <svg
          viewBox="0 0 40 50"
          className="mx-auto mt-2 h-10 w-8 text-cream/90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M20 4c-8 6-8 18 0 26 8-8 8-20 0-26Z" />
          <path d="M20 30v16" />
        </svg>
      </p>

      {/* Scroll indicator */}
      <a
        href="#story"
        style={{ "--i": 8 } as React.CSSProperties}
        className="hero-fade absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-cream/80 lg:flex"
      >
        <span className="flex h-8 w-5 justify-center rounded-full border border-cream/60 pt-1.5">
          <span className="h-1.5 w-0.5 animate-bounce rounded-full bg-cream/80" />
        </span>
        Scroll to explore
      </a>
    </section>
  );
};
