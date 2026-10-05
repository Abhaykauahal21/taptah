import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import { ScrollWords } from "./ScrollWords";
import { WhyArtwork } from "./WhyArtwork";
import { WhyMotion } from "./WhyMotion";

export const Why: React.FC = () => {
  return (
    <section
      id="story"
      aria-label="Why Taptah"
      className="why-section relative overflow-hidden bg-background pb-16 text-maroon lg:pb-24"
    >
      <WhyMotion />
      {/* Mountain & farmhouse illustration (transparent) */}
      <Image
        src="/images/why/mointain.webp"
        alt=""
        aria-hidden="true"
        width={1774}
        height={887}
        sizes="(min-width: 768px) 44vw, 0px"
        className="why-mountain pointer-events-none absolute bottom-0 right-0 hidden h-auto origin-bottom translate-x-[4vw] -translate-y-[1vw] scale-y-[1.2] w-[44vw] max-w-[800px] opacity-80 md:block"
      />

      <div className="relative mx-auto grid max-w-[1500px] items-start gap-y-10 lg:grid-cols-[38%_minmax(0,1fr)]">
        {/* Artwork (cream backdrop is baked in and matches the section) */}
        <div className="mx-auto w-full max-w-md px-5 sm:px-8 lg:mx-0 lg:max-w-none lg:translate-x-[8vw] lg:px-0">
          <WhyArtwork />
        </div>

        <div className="px-5 sm:px-8 lg:pl-[11vw] lg:pr-[2vw] lg:pt-[clamp(1rem,4vw,4rem)]">
          <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] sm:gap-[2.5vw]">
            {/* Intro */}
            <div>
              <div className="flex items-start gap-[1.2vw]">
                <h2 className="text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
                  <span className="why-line">
                    <span className="why-line-inner" style={{ "--i": 0 } as React.CSSProperties}>
                      Why
                    </span>
                  </span>
                  <span className="why-line">
                    <span className="why-line-inner" style={{ "--i": 1 } as React.CSSProperties}>
                      Taptah?
                    </span>
                  </span>
                </h2>
                <Leaf
                  aria-hidden="true"
                  strokeWidth={0.9}
                  className="why-leaf-icon mt-[1.6vw] h-[clamp(2rem,3.6vw,3.5rem)] w-[clamp(2rem,3.6vw,3.5rem)] shrink-0 -rotate-[8deg] text-[#6B1022]/80"
                />
              </div>

              <ScrollWords
                className="mt-[clamp(1rem,2vw,1.75rem)] max-w-[30rem] text-[clamp(1.05rem,1.35vw,1.3rem)] font-medium leading-[1.55] text-[#3a2a24]"
                text="Taptah is a Sanskrit word that embodies the essence of purity, warmth and nourishment. It reflects our belief in the power of honest food to bring healthier, happier lives — today and for tomorrow."
              />

              <Link
                href="#process"
                className="why-cta mt-[clamp(1.5rem,3vw,2.5rem)] inline-flex items-center gap-3 rounded-full border border-[#6B1022]/70 px-[clamp(1.5rem,2.6vw,2.5rem)] py-[clamp(0.6rem,1vw,0.85rem)] text-[clamp(1rem,1.2vw,1.15rem)] font-semibold text-[#6B1022] transition-colors duration-300 hover:bg-[#6B1022] hover:text-cream"
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Pull quote */}
            <blockquote className="why-quote text-[clamp(1.4rem,2.05vw,2rem)] font-medium italic leading-[1.3] text-[#6B1022] sm:pt-[0.5vw]">
              <span aria-hidden="true">&ldquo;</span> Food that nourishes
              traditions that live on.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
