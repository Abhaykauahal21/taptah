"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { InView } from "@/components/common/InView";
import { TESTIMONIALS_DATA } from "@/constants/testimonials";
import { TestimonialItem } from "@/types";
import { cn } from "@/lib/utils";
import { Blob, Heap, Leaves } from "./ReviewArt";

const VISIBLE = 3;

function Avatar({ item }: { item: TestimonialItem }) {
  if (item.avatar) {
    return (
      <Image
        src={item.avatar}
        alt={item.author}
        width={120}
        height={120}
        className="h-[60px] w-[60px] shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = item.author
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <span
      aria-hidden="true"
      className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white shadow-inner"
      style={{ background: `linear-gradient(145deg, ${item.tone[0]}, ${item.tone[1]})` }}
    >
      {initials}
    </span>
  );
}

const HEAP_KINDS = ["plain", "masala", "pudina"] as const;

function CardArt({ slot }: { slot: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[46%] overflow-hidden rounded-r-[20px] md:hidden">
      <Blob className="absolute -right-[22%] top-[6%] h-[96%] w-[118%]" />
      <Leaves className="bottom-[8%] left-[14%] h-[40%] w-[50%]" />
      <Heap kind={HEAP_KINDS[slot % 3]} className="absolute -right-[4%] bottom-[2%] w-[86%]" />
    </div>
  );
}

function ReviewCard({ item, slot = 0 }: { item: TestimonialItem; slot?: number }) {
  return (
    <figure className="review-card relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white/45 p-5 shadow-[0_8px_30px_-12px_rgba(120,70,30,0.25)] ring-1 ring-white/60 max-md:min-h-[15rem] max-md:bg-[#fdf4e8]/90">
      <CardArt slot={slot} />
      <span
        aria-hidden="true"
        className="text-[2.6rem] font-bold leading-[0.7] text-[#7a1020]"
      >
        &ldquo;
      </span>
      <blockquote className="relative mt-3 flex-1 text-[1.02rem] font-medium leading-[1.45] text-[#4a3a33] max-md:max-w-[62%]">
        {item.quote}
      </blockquote>
      <figcaption className="relative mt-5 flex items-center gap-3">
        <Avatar item={item} />
        <div>
          <p className="text-[1.05rem] font-bold leading-tight text-[#6B1022]">
            {item.author}
          </p>
          <p className="text-sm font-medium text-[#9a5a3c]">{item.location}</p>
          <div className="mt-1 flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < item.rating ? "fill-amber-500 text-amber-500" : "text-amber-300",
                )}
              />
            ))}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export const Testimonials: React.FC = () => {
  const [start, setStart] = useState(0);
  const total = TESTIMONIALS_DATA.length;
  const shown = Array.from({ length: VISIBLE }, (_, i) => TESTIMONIALS_DATA[(start + i) % total]);
  const step = (dir: 1 | -1) => setStart((s) => (s + dir + total) % total);

  return (
    <section
      id="testimonials"
      aria-label="Customer Reviews"
      className="relative overflow-hidden bg-background px-5 py-16 text-maroon sm:px-8 lg:px-12 lg:pb-20 lg:pt-6"
    >
      {/* Soft warm light behind the cards */}
      <div data-parallax="0.1" className="pointer-events-none absolute right-[-8%] top-1/2 h-[120%] w-[70%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,236,208,0.9),transparent)]" />

      <InView className="reviews-art relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] lg:gap-12">
        <div data-parallax="0.04" className="reviews-head relative">
          {/* Phones: jowar on the left, a heap of pop jowar on the right */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-5 -top-6 bottom-0 overflow-visible md:hidden">
            <Image
              src="/images/why/jwar.png"
              alt=""
              width={1151}
              height={1367}
              sizes="40vw"
              className="why-jowar-sway absolute -left-[20%] -top-[4%] w-[56%] origin-bottom-left drop-shadow-[0_10px_14px_rgba(90,50,20,0.2)] [mask-image:linear-gradient(180deg,#000_62%,transparent_96%)]"
            />
            <Blob className="absolute -right-[28%] -top-[2%] h-[46%] w-[74%]" />
            <Heap kind="plain" className="absolute -right-[16%] top-[2%] w-[40%]" />
            <Image
              src="/images/why/single-jwaar-grain.png"
              alt=""
              width={1286}
              height={1223}
              className="proc-float absolute left-[8%] top-[44%] w-[5%]"
              style={{ "--r": "20deg", "--d": "6s" } as React.CSSProperties}
            />
            <Image
              src="/images/why/jwar-grain-2.png"
              alt=""
              width={1512}
              height={1040}
              className="proc-float absolute left-[22%] top-[58%] w-[6%]"
              style={{ "--r": "-30deg", "--d": "7s" } as React.CSSProperties}
            />
          </div>
          <p className="relative max-md:ml-[34%] text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/70 sm:text-xs">
            Real Stories
          </p>
          <span aria-hidden="true" className="relative mt-3 block h-px w-14 bg-[#6B1022]/50 md:hidden max-md:ml-[34%]" />
          <h2 className="relative mt-3 max-md:ml-[34%] max-md:text-[2.7rem] text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
            Loved by
            <br />
            Snack Enthusiasts.
          </h2>
          <p className="relative mt-5 max-w-[26rem] max-md:ml-[34%] max-md:text-[0.98rem] text-[clamp(1rem,1.2vw,1.2rem)] font-medium leading-[1.5] text-[#4a3a33]">
            From fitness lovers to flavour seekers, Taptah is winning hearts
            across India with its clean, crunchy and delicious snacks.
          </p>

          <div className="mt-7 hidden gap-3 md:flex">
            {([
              { dir: -1, Icon: ArrowLeft, label: "Previous reviews" },
              { dir: 1, Icon: ArrowRight, label: "Next reviews" },
            ] as const).map(({ dir, Icon, label }) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                onClick={() => step(dir)}
                className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#6B1022]/70 text-[#6B1022] transition-colors duration-300 hover:bg-[#6B1022] hover:text-cream"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 max-md:mt-2 md:grid-cols-3" aria-live="polite">
          {shown.map((item, i) => (
            <div
              key={`${start}-${item.id}`}
              className="review-slide"
              style={{ "--i": i } as React.CSSProperties}
            >
              <ReviewCard item={item} slot={i} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 md:hidden">
          <div className="flex gap-3">
            {([
              { dir: -1, Icon: ArrowLeft, label: "Previous reviews" },
              { dir: 1, Icon: ArrowRight, label: "Next reviews" },
            ] as const).map(({ dir, Icon, label }) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                onClick={() => step(dir)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6B1022]/70 text-[#6B1022] transition-colors active:bg-[#6B1022] active:text-cream"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          <div className="flex gap-2" aria-hidden="true">
            {TESTIMONIALS_DATA.map((t, i) => (
              <span
                key={t.id}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === start ? "w-6 bg-[#6B1022]" : "w-2 bg-[#6B1022]/25",
                )}
              />
            ))}
          </div>
        </div>
      </InView>
    </section>
  );
};
