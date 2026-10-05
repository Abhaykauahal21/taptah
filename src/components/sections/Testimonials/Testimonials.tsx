"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { InView } from "@/components/common/InView";
import { TESTIMONIALS_DATA } from "@/constants/testimonials";
import { TestimonialItem } from "@/types";
import { cn } from "@/lib/utils";

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

function ReviewCard({ item }: { item: TestimonialItem }) {
  return (
    <figure className="review-card flex h-full flex-col rounded-[20px] bg-white/45 p-5 shadow-[0_8px_30px_-12px_rgba(120,70,30,0.25)] ring-1 ring-white/60">
      <span
        aria-hidden="true"
        className="text-[2.6rem] font-bold leading-[0.7] text-[#7a1020]"
      >
        &ldquo;
      </span>
      <blockquote className="mt-3 flex-1 text-[1.02rem] font-medium leading-[1.45] text-[#4a3a33]">
        {item.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
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
        <div data-parallax="0.04" className="reviews-head">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/70 sm:text-xs">
            Real Stories
          </p>
          <h2 className="mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
            Loved by
            <br />
            Snack Enthusiasts.
          </h2>
          <p className="mt-5 max-w-[26rem] text-[clamp(1rem,1.2vw,1.2rem)] font-medium leading-[1.5] text-[#4a3a33]">
            From fitness lovers to flavour seekers, Taptah is winning hearts
            across India with its clean, crunchy and delicious snacks.
          </p>

          <div className="mt-7 flex gap-3">
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

        <div className="grid gap-5 md:grid-cols-3" aria-live="polite">
          {shown.map((item, i) => (
            <div
              key={`${start}-${item.id}`}
              className="review-slide"
              style={{ "--i": i } as React.CSSProperties}
            >
              <ReviewCard item={item} />
            </div>
          ))}
        </div>
      </InView>
    </section>
  );
};
