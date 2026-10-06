"use client";

import React, { useEffect, useRef, useState } from "react";
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

/** Tablet / desktop: a small heap of pop jowar crowns each card, top right. */
function DesktopArt({ slot }: { slot: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 hidden h-[8.5rem] w-[58%] transition-[translate,scale] duration-500 ease-out md:block lg:group-hover:scale-[1.07]"
      style={{ translate: "calc(var(--px, 0) * 14px) calc(var(--py, 0) * 10px)" }}
    >
      <Blob className="absolute -right-[18%] -top-[34%] h-[150%] w-[108%]" />
      <Heap kind={HEAP_KINDS[slot % 3]} className="absolute -right-[2%] -top-[6%] w-[74%]" />
    </div>
  );
}

function ReviewCard({ item, slot = 0 }: { item: TestimonialItem; slot?: number }) {
  const ref = useRef<HTMLElement>(null);

  // Desktop mouse only: the card tilts towards the cursor, a glare follows it
  // and the pop jowar artwork drifts the other way for depth.
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.innerWidth < 1024) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 140ms ease-out, box-shadow 500ms ease";
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.style.setProperty("--px", `${-(x - 0.5) * 2}`);
    el.style.setProperty("--py", `${-(y - 0.5) * 2}`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "";
    el.style.transform = "";
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  return (
    <figure
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="review-card group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-white/45 p-5 shadow-[0_8px_30px_-12px_rgba(120,70,30,0.25)] ring-1 ring-white/60 transition-[transform,box-shadow,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:min-h-[15rem] max-md:bg-[#fdf4e8]/90 md:bg-[#fdf4e8]/80 md:p-6 lg:p-7 lg:hover:-translate-y-2 lg:hover:shadow-[0_30px_50px_-18px_rgba(120,70,30,0.5)]"
    >
      <span
        aria-hidden="true"
        className="rv-glare pointer-events-none absolute inset-0 z-10 hidden opacity-0 transition-opacity duration-500 lg:block lg:group-hover:opacity-100"
      />
      <CardArt slot={slot} />
      <DesktopArt slot={slot} />
      <span
        aria-hidden="true"
        className="relative text-[2.6rem] font-bold leading-[0.7] text-[#7a1020] md:text-[4.2rem] md:leading-[0.6]"
      >
        &ldquo;
      </span>
      <blockquote className="relative mt-3 flex-1 text-[1.1rem] font-medium leading-[1.45] text-[#4a3a33] max-md:max-w-[62%] md:mt-8 lg:text-[1.25rem] lg:leading-[1.5]">
        {item.quote}
      </blockquote>
      <span aria-hidden="true" className="relative mt-6 hidden h-px w-full bg-[#6B1022]/15 md:block" />
      <figcaption className="relative mt-5 flex items-center gap-3 md:mt-5">
        <Avatar item={item} />
        <div>
          <p className="text-[1.05rem] font-bold leading-tight text-[#6B1022]">
            {item.author}
          </p>
          <p className="text-base font-medium text-[#9a5a3c]">{item.location}</p>
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
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [moved, setMoved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  // Current cards slide out first, then the next set swaps in and animates in.
  const step = (d: 1 | -1) => {
    if (leaving) return;
    setDir(d);
    setLeaving(true);
    timer.current = setTimeout(() => {
      setStart((s) => (s + d + total) % total);
      setMoved(true);
      setLeaving(false);
    }, 460);
  };
  // The progress bar's animation end drives autoplay (desktop only: the bar is hidden below md).
  const autoAdvance = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    step(1);
  };
  const average = (TESTIMONIALS_DATA.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1);

  return (
    <section
      id="testimonials"
      aria-label="Customer Reviews"
      className="relative overflow-hidden bg-background px-5 py-16 text-maroon sm:px-8 lg:px-12 lg:pb-20 lg:pt-6"
    >
      {/* Soft warm light behind the cards */}
      <div data-parallax="0.1" className="pointer-events-none absolute right-[-8%] top-1/2 h-[120%] w-[70%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,236,208,0.9),transparent)]" />

      {/* Depth backdrop (tablet and up): far layers are pale and soft, near layers are
          bigger, blurrier and drift faster, so the cards seem to float in front. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {/* far: colour washes and a giant quotation mark */}
        <div data-parallax="0.03" className="absolute inset-0">
          <span className="absolute -left-[8%] top-[4%] h-[70%] w-[46%] rounded-full bg-[#f3c9b6]/55 blur-[90px]" />
          <span className="absolute -bottom-[16%] right-[6%] h-[64%] w-[42%] rounded-full bg-[#ffd99a]/50 blur-[100px]" />
          <span className="absolute left-[34%] top-[-18%] h-[50%] w-[30%] rounded-full bg-[#fbe3cf]/80 blur-[80px]" />
        </div>
        <p
          data-parallax="0.05"
          className="absolute left-[1.5%] top-[-3%] select-none font-serif text-[clamp(18rem,34vw,36rem)] font-semibold leading-none text-[#6B1022]/[0.055] [mask-image:linear-gradient(180deg,#000_30%,transparent_85%)]"
        >
          &ldquo;
        </p>

        {/* mid: jowar stalks, softly out of focus and faded into the page */}
        <div data-parallax="0.08" className="absolute inset-0">
          <Image
            src="/images/why/jwar.png"
            alt=""
            width={1151}
            height={1367}
            sizes="22vw"
            className="absolute -left-[3%] -bottom-[14%] w-[19vw] max-w-[22rem] rotate-[-9deg] opacity-[0.28] blur-[1.5px] [mask-image:linear-gradient(0deg,transparent_2%,#000_55%)]"
          />
          <Image
            src="/images/why/jwar.png"
            alt=""
            width={1151}
            height={1367}
            sizes="20vw"
            className="absolute -right-[4%] -top-[10%] w-[17vw] max-w-[20rem] rotate-[168deg] opacity-[0.2] blur-[2.5px] [mask-image:linear-gradient(0deg,transparent_2%,#000_55%)]"
          />
          <Image
            src="/images/why/leaf-b.png"
            alt=""
            width={175}
            height={126}
            className="absolute left-[39%] -top-[2%] w-[9vw] max-w-[9rem] rotate-[28deg] opacity-40 blur-[1px]"
          />
        </div>

        {/* near: big blurred pop jowar that drifts the most, plus a few crisp grains */}
        <div data-parallax="0.15" className="absolute inset-0">
          <Image
            src="/images/why/pop-jwaar-1.png"
            alt=""
            width={1397}
            height={1126}
            sizes="10vw"
            className="proc-float absolute left-[41%] top-[6%] w-[6vw] max-w-[6.5rem] opacity-60 blur-[4px]"
            style={{ "--r": "24deg", "--d": "7s" } as React.CSSProperties}
          />
          <Image
            src="/images/why/masalla-pop-jwaar-1.png"
            alt=""
            width={1316}
            height={1195}
            sizes="12vw"
            className="proc-float absolute right-[3%] bottom-[3%] w-[8vw] max-w-[8.5rem] opacity-45 blur-[6px]"
            style={{ "--r": "-18deg", "--d": "9s", "--dl": "-3s" } as React.CSSProperties}
          />
          <Image
            src="/images/why/podina-pop-jwaar.png"
            alt=""
            width={1452}
            height={1083}
            sizes="8vw"
            className="proc-float absolute left-[30%] bottom-[8%] w-[4.4vw] max-w-[5rem] opacity-70 blur-[2px]"
            style={{ "--r": "40deg", "--d": "6s", "--dl": "-1s" } as React.CSSProperties}
          />
          <Image
            src="/images/why/single-jwaar-grain.png"
            alt=""
            width={1286}
            height={1223}
            className="proc-float absolute left-[39%] top-[46%] w-[1.6vw] min-w-[18px]"
            style={{ "--r": "20deg", "--d": "6s" } as React.CSSProperties}
          />
          <Image
            src="/images/why/jwar-grain-2.png"
            alt=""
            width={1512}
            height={1040}
            className="proc-float absolute right-[1.5%] top-[40%] w-[2vw] min-w-[22px]"
            style={{ "--r": "-30deg", "--d": "8s", "--dl": "-2s" } as React.CSSProperties}
          />
        </div>

        {/* the section melts into its neighbours */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <InView
        data-paused={paused}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="reviews-art relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.72fr)] lg:gap-10 xl:gap-14">
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
          <p className="relative max-md:ml-[34%] text-[13px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/70 sm:text-sm">
            Real Stories
          </p>
          <span aria-hidden="true" className="rv-rule relative mt-3 block h-px w-14 bg-[#6B1022]/50 md:w-20 max-md:ml-[34%]" />
          <h2 className="relative mt-3 max-md:ml-[34%] max-md:text-[2.7rem] text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-tight text-[#6B1022]">
            <span className="rv-line" style={{ "--l": 0 } as React.CSSProperties}>
              <span>Loved by</span>
            </span>
            <span className="rv-line" style={{ "--l": 1 } as React.CSSProperties}>
              <span>Snack Enthusiasts.</span>
            </span>
          </h2>
          <p className="relative mt-5 max-w-[26rem] max-md:ml-[34%] max-md:text-[0.98rem] text-[clamp(1rem,1.2vw,1.2rem)] font-medium leading-[1.5] text-[#4a3a33]">
            From fitness lovers to flavour seekers, Taptah is winning hearts
            across India with its clean, crunchy and delicious snacks.
          </p>

          {/* Desktop: rating summary */}
          <div className="mt-6 hidden items-center gap-3 md:flex">
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="rv-star h-5 w-5 fill-amber-500 text-amber-500"
                  style={{ "--i": i } as React.CSSProperties}
                />
              ))}
            </div>
            <p className="text-[0.95rem] font-semibold text-[#6B1022]">
              {average} / 5
              <span className="ml-2 font-medium text-[#9a5a3c]">from our snackers</span>
            </p>
          </div>

          <div className="mt-8 hidden items-center gap-5 md:flex">
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
                  className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#6B1022]/70 text-[#6B1022] transition-all duration-300 hover:scale-105 hover:bg-[#6B1022] hover:text-cream"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="text-sm font-semibold tabular-nums tracking-widest text-[#6B1022]">
                {String(start + 1).padStart(2, "0")}
                <span className="text-[#6B1022]/40"> / {String(total).padStart(2, "0")}</span>
              </span>
              <span className="relative block h-[3px] w-24 overflow-hidden rounded-full bg-[#6B1022]/15">
                <span
                  key={start}
                  onAnimationEnd={autoAdvance}
                  className="rv-progress absolute inset-y-0 left-0 rounded-full bg-[#6B1022]"
                />
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 max-md:mt-2 md:grid-cols-3 lg:gap-6" aria-live="polite">
          {shown.map((item, i) => (
            <div
              key={`${start}-${item.id}`}
              className={cn("review-slide", i === 1 ? "lg:mt-12" : "lg:mb-12")}
              data-out={leaving}
              style={{ "--i": i, "--dir": dir, "--d0": moved ? "0.04s" : "0.15s" } as React.CSSProperties}
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
