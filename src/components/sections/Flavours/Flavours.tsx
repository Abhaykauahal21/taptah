import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { InView } from "@/components/common/InView";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { FlavourItem } from "@/types";

function FlavourCard({ flavour, index }: { flavour: FlavourItem; index: number }) {
  return (
    <article
      data-parallax={["0.05", "-0.04", "0.07"][index % 3]}
      className="flavour-card group relative flex flex-col overflow-hidden rounded-[22px] text-cream shadow-[0_22px_40px_-18px_rgba(40,10,10,0.55)]"
      style={{ background: flavour.theme.to, "--i": index } as React.CSSProperties}
    >
      {/* The artwork already carries the pack, name, tagline and badges */}
      <div className="overflow-hidden">
        <Image
          src={flavour.image}
          alt={`${flavour.name} pop jowar: ${flavour.tagline}`}
          width={1145}
          height={1374}
          sizes="(min-width: 1024px) 31vw, 92vw"
          className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 px-5 pb-5 pt-1">
        <span className="text-2xl font-semibold">&#8377;{flavour.price}</span>
        <AddToCartButton id={flavour.id} />
      </div>
    </article>
  );
}

export const Flavours: React.FC = () => {
  return (
    <section
      id="flavours"
      aria-label="Our Flavours"
      className="relative overflow-hidden bg-background px-5 py-16 text-maroon sm:px-8 lg:px-12 lg:py-24"
    >
      <InView className="flavours-art mx-auto max-w-[1280px]">
        <div data-parallax="0.06" className="flavours-head flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/70 sm:text-xs">
              Our Flavours
            </p>
            <h2 className="mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
              Flavours That
              <br />
              Tell a Story.
            </h2>
          </div>

          <div className="flex items-end gap-8 sm:gap-12">
            <p className="max-w-[16rem] text-[clamp(1rem,1.15vw,1.15rem)] font-medium leading-snug text-[#4a3a33]">
              Classic grains, exciting flavours. Find your perfect crunch.
            </p>
            <Link
              href="#flavours"
              className="group hidden shrink-0 items-center gap-2 text-base font-semibold text-[#6B1022] sm:inline-flex"
            >
              View All Flavours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:gap-7">
          {FLAVOURS_DATA.map((flavour, i) => (
            <FlavourCard key={flavour.id} flavour={flavour} index={i} />
          ))}
        </div>
      </InView>
    </section>
  );
};
