"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Flame, Wheat } from "lucide-react";
import { InView } from "@/components/common/InView";

/**
 * "Our beliefs": a three-chapter story told on a pinned stage (desktop) that advances as you
 * scroll, and as three stacked chapters that animate in one by one (phones and tablets).
 */

const CHAPTERS = [
  {
    kicker: "Chapter 01",
    title: "Why single millet?",
    paras: [
      "Our Nani-Dadi wisdom has always valued simplicity, one grain at a time, prepared thoughtfully.",
      "Different millets have different nutritional profiles, textures and digestion characteristics. By using one millet in each pack, we keep the ingredient profile clear, allowing us to highlight the unique qualities of each millet, and make it easier to understand what you’re eating.",
    ],
  },
  {
    kicker: "Chapter 02",
    title: "Why popped?",
    paras: [
      "Popping is a traditional heat processing technique that makes the millet lighter, crispier and easier to digest while retaining many of the grain’s naturally occurring nutrients, including fibre and minerals such as iron, magnesium and phosphorus.",
      "It also makes the millet starch more  digestible, creating a naturally light and enjoyable way to eat whole grains.",
    ],
  },
  {
    kicker: "Chapter 03",
    title: "Raw millet vs. our process",
    paras: [
      "Whole millets naturally contain phytic acid and tannins, compounds that can reduce the bioavailability of certain nutrients.",
      "At Taptah, we follow a traditional process of soaking the millet before roasting or popping it. Soaking can help reduce some of these compounds, while our roasting process brings out the millet’s flavour, aroma and texture.",
    ],
  },
] as const;

const GRAIN = { src: "/images/why/single-jwaar-grain.webp", width: 1286, height: 1223 };
const POP1 = { src: "/images/why/pop-jwaar-1.webp", width: 1397, height: 1126 };
const POP2 = { src: "/images/why/pop-jwaar-2.webp", width: 1293, height: 1217 };

const sty = (v: Record<string, string | number>) => v as React.CSSProperties;

/* ---------- the three visuals ---------- */

function MilletVisual() {
  // the other millets: dim, drifting grains around the one we chose
  const others = [
    { c: "#7a3b2e", s: 3.4, x: 8, y: 22, d: 0 },
    { c: "#b9b38a", s: 2.6, x: 84, y: 16, d: 0.15 },
    { c: "#d9a441", s: 3, x: 90, y: 62, d: 0.3 },
    { c: "#8c5a3c", s: 2.4, x: 14, y: 74, d: 0.45 },
    { c: "#a8a27a", s: 2, x: 70, y: 86, d: 0.6 },
    { c: "#c4693f", s: 2.2, x: 34, y: 8, d: 0.75 },
  ];
  return (
    <div className="relative aspect-square w-full">
      <span className="bel-halo absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <span className="bel-ring absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8154B]/25" />
      {others.map((o, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="bel-other absolute rounded-full"
          style={sty({
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: `${o.s}rem`,
            height: `${o.s}rem`,
            background: `radial-gradient(circle at 35% 30%, ${o.c}, #00000055)`,
            "--dl": `${o.d}s`,
          })}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 w-[24%] -translate-x-1/2 -translate-y-1/2">
        <div className="bel-grain">
          <Image
            src={GRAIN.src}
            alt="A single jowar grain"
            width={GRAIN.width}
            height={GRAIN.height}
            sizes="200px"
            className="h-auto w-full drop-shadow-[0_18px_24px_rgba(60,20,0,0.3)]"
          />
        </div>
      </div>
      <p className="bel-tag absolute inset-x-0 bottom-[6%] text-center text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-[#C8154B]">
        One grain at a time
      </p>
    </div>
  );
}

function PopVisual() {
  const sats = [
    { ...POP2, x: -30, y: -32, s: 17, r: -24 },
    { ...POP1, x: 34, y: -28, s: 15, r: 30 },
    { ...POP1, x: -38, y: 18, s: 13, r: 50 },
    { ...POP2, x: 36, y: 26, s: 16, r: -40 },
    { ...POP1, x: 2, y: -44, s: 10, r: 12 },
    { ...POP2, x: -6, y: 42, s: 11, r: 75 },
  ];
  const tags = [
    { t: "Lighter", x: 4, y: 12 },
    { t: "Crispier", x: 66, y: 8 },
    { t: "Easier to digest", x: 52, y: 82 },
  ];
  return (
    <div className="relative aspect-square w-full">
      <span className="bel-halo absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="bel-wave absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F2B760]/60"
          style={sty({ "--dl": `${0.7 + i * 0.22}s` })}
        />
      ))}
      {/* the grain shrinks away as the heat builds... */}
      <div className="absolute left-1/2 top-1/2 w-[20%] -translate-x-1/2 -translate-y-1/2">
        <div className="bel-seed">
          <Image src={GRAIN.src} alt="" width={GRAIN.width} height={GRAIN.height} sizes="120px" className="h-auto w-full" />
        </div>
      </div>
      {/* ...and pops */}
      <div className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2">
        <div className="bel-bigpop">
          <Image
            src={POP1.src}
            alt="A popped jowar puff"
            width={POP1.width}
            height={POP1.height}
            sizes="280px"
            className="h-auto w-full drop-shadow-[0_20px_26px_rgba(60,20,0,0.32)]"
          />
        </div>
      </div>
      {sats.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="bel-sat absolute w-[14%]"
          style={sty({
            left: `${50 + p.x}%`,
            top: `${50 + p.y}%`,
            width: `${p.s}%`,
            "--fx": `${-p.x}cqw`,
            "--fy": `${-p.y}cqw`,
            "--r": `${p.r}deg`,
            "--dl": `${0.8 + i * 0.08}s`,
          })}
        >
          <Image src={p.src} alt="" width={p.width} height={p.height} sizes="100px" className="h-auto w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.4)]" />
        </div>
      ))}
      {tags.map((g, i) => (
        <span
          key={g.t}
          className="bel-chip absolute rounded-full bg-[#C8154B] px-4 py-1.5 text-[0.85rem] font-semibold text-[#F2EEBF] shadow-lg sm:text-[0.95rem]"
          style={sty({ left: `${g.x}%`, top: `${g.y}%`, "--dl": `${1.3 + i * 0.18}s` })}
        >
          {g.t}
        </span>
      ))}
    </div>
  );
}

function ProcessVisual() {
  const steps = [
    {
      Icon: Wheat,
      title: "Raw millet",
      note: "Naturally holds phytic acid and tannins",
      chips: ["Phytic acid", "Tannins"],
      tone: "muted",
    },
    {
      Icon: Droplets,
      title: "Soaked",
      note: "Helps in reduction of these compounds",
      chips: [],
      tone: "mid",
    },
    {
      Icon: Flame,
      title: "Roasted & popped",
      note: "Brings out flavour, aroma and texture",
      chips: ["Flavour", "Aroma", "Texture"],
      tone: "hot",
    },
  ] as const;
  return (
    <div className="relative mx-auto w-full max-w-[30rem] py-2">
      <span aria-hidden="true" className="bel-line absolute bottom-10 left-[1.65rem] top-10 w-[3px] rounded-full bg-gradient-to-b from-[#082567]/20 via-[#F2B760] to-[#C8154B]" />
      <ol className="relative flex flex-col gap-5">
        {steps.map(({ Icon, title, note, chips, tone }, i) => (
          <li key={title} className="bel-step flex items-start gap-4" style={sty({ "--dl": `${0.25 + i * 0.5}s` })}>
            <span
              className={
                "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-4 ring-[#F2EEBF] " +
                (tone === "hot" ? "bg-[#C8154B] text-[#F2EEBF]" : tone === "mid" ? "bg-[#F2B760] text-[#082567]" : "bg-white text-[#082567]")
              }
            >
              <Icon aria-hidden="true" strokeWidth={1.6} className="h-6 w-6" />
            </span>
            <div
              className={
                "flex-1 rounded-2xl p-4 ring-1 " +
                (tone === "hot" ? "bg-white/85 ring-[#C8154B]/40" : "bg-white/55 ring-[#082567]/10")
              }
            >
              <p className="text-[1.25rem] font-semibold leading-tight text-[#C8154B]">{title}</p>
              <p className="mt-1 text-[1rem] leading-snug text-[#082567]">{note}</p>
              {chips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className={
                        "rounded-full px-3 py-1 text-[0.8rem] font-semibold " +
                        (tone === "hot" ? "bg-[#F2B760] text-[#082567]" : "bg-[#C8154B]/80 text-[#F2EEBF]")
                      }
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const VISUALS = [MilletVisual, PopVisual, ProcessVisual];

/** Little handwritten asides in the margin, one per chapter. */
const NOTES = ["one grain at a time", "heat makes it light", "soak first, then roast"];

const script = "font-[family-name:var(--font-script)]";

/** An ink underline that draws itself when its page arrives. */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 12" fill="none" aria-hidden="true" className={"bk-ink " + className}>
      <path
        d="M3 7C25 2 40 11 62 6s38-5 60-1 40 4 62 0 26-1 33 1"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Copy({ i }: { i: number }) {
  const c = CHAPTERS[i];
  return (
    <div className="bk-copy">
      <p className="bk-kicker">{c.kicker}</p>
      <h3 className={script + " bk-title"}>{c.title}</h3>
      <Squiggle className="bk-squiggle" />
      <div className="bk-body">
        {c.paras.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className={script + " bk-note"}>&mdash; {NOTES[i]}</p>
    </div>
  );
}

/** The picture that goes with a chapter, on its own page. */
function VisualPage({ i, on }: { i: number; on: boolean }) {
  const V = VISUALS[i];
  return (
    <div className="bk-vis-frame">
      <div className="bel-vis w-full [container-type:inline-size]" data-on={on}>
        <V />
      </div>
    </div>
  );
}

/** Last spread, left page: the belief in one line. */
function ClosingLeft({ cur }: { cur: boolean }) {
  return (
    <div className="bk-closing flex h-full flex-col" data-cur={cur}>
      <p className="bk-kicker">The last page</p>
      <p className={script + " bk-quote"}>
        &ldquo;One millet.
        <br />
        Roasted right.
        <br />
        Crunch for life.&rdquo;
      </p>
      <Squiggle className="bk-squiggle" />
      <Image
        src="/images/why/jwar.webp"
        alt=""
        aria-hidden="true"
        width={1151}
        height={1367}
        sizes="300px"
        className="why-jowar-sway pointer-events-none absolute -bottom-[4%] right-[2%] w-[42%] origin-bottom-left opacity-95 drop-shadow-[0_10px_14px_rgba(90,50,20,0.2)] [mask-image:linear-gradient(180deg,#000_68%,transparent_97%)]"
      />
    </div>
  );
}

/** Last spread, right page: the stamp of approval. */
function ClosingRight({ cur }: { cur: boolean }) {
  return (
    <div className="bk-closing flex h-full flex-col" data-cur={cur}>
      <p className="bk-kicker">Taptah Pop Jowar</p>
      <p className={script + " bk-note bk-note-lg"}>straight from Nani&rsquo;s kitchen to yours</p>
      <Link
        href="/products"
        transitionTypes={["nav-forward"]}
        className="bk-cta group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#C8154B] px-7 py-3.5 text-base font-semibold text-[#F2EEBF] shadow-lg transition-all duration-300 hover:bg-[#a90f3d]"
      >
        Meet the Millet
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <div className="bk-stamp" aria-hidden="true">
        <span>Nani-Dadi</span>
        <strong>Approved</strong>
      </div>
    </div>
  );
}

/* ---------- the section ---------- */

export const Beliefs: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  // `settled` trails `step` until the page has finished turning, so the new page's
  // animations start once it is actually in view.
  const [settled, setSettled] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setSettled(step), 750);
    return () => window.clearTimeout(t);
  }, [step]);

  // Desktop: scrolling turns the pages. (Below lg the chapters are simply stacked.)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(0.9999, Math.max(0, -r.top / span)) : 0;
      setStep(Math.floor(p * 4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="beliefs" aria-label="Our beliefs" className="bk-table relative text-[#082567] [overflow-x:clip] lg:pb-[18vw]">
      {/* things left on the table */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
        {[
          ["/images/why/pop-jwaar-1.webp", 1397, 1126, "3%", "18%", "5vw", "18deg", "7s"],
          ["/images/why/masalla-pop-jwaar-1.webp", 1316, 1195, "91%", "26%", "4.4vw", "-24deg", "9s"],
          ["/images/why/podina-pop-jwaar.webp", 1452, 1083, "5%", "80%", "4vw", "40deg", "8s"],
          ["/images/why/pop-jwaar-2.webp", 1293, 1217, "92%", "76%", "5vw", "-12deg", "6s"],
        ].map(([src, w, h, l, t, size, r, d], i) => (
          <Image
            key={i}
            src={src as string}
            alt=""
            width={w as number}
            height={h as number}
            sizes="6vw"
            className="proc-float absolute drop-shadow-[0_8px_8px_rgba(60,28,12,0.25)]"
            style={{ left: l as string, top: t as string, width: size as string, "--r": r, "--d": d } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Title */}
      <InView className="relative z-10 mx-auto max-w-[1120px] px-5 pb-4 pt-20 sm:px-8 lg:pb-0 lg:pt-28">
        <p className="bel-in bk-kicker" style={{ "--i": 0 } as React.CSSProperties}>
          Our Beliefs
        </p>
        <h2 className={script + " bel-in bk-hero bk-hero-m"} style={{ "--i": 1 } as React.CSSProperties}>
          Super Nani-Dadi wisdom, in every pop.
        </h2>
        <Squiggle className="bk-squiggle bk-squiggle-in" />
      </InView>

      {/* Desktop: the diary, pinned while the pages turn */}
      <div ref={trackRef} className="relative z-10 hidden h-[440vh] lg:block">
        <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-5 pb-4 pt-20">
          <div className="bk" style={{ width: "min(1120px, 94vw, calc((100svh - 190px) * 1.6))" }}>
            <span className="bk-ribbon" aria-hidden="true" />
            <div className="bk-hardcover">
              <div className="bk-pages">
                {/* the spread underneath: first picture on the left, the closing page on the right */}
                <div className="bk-base-l bk-page-l">
                  <VisualPage i={0} on={settled === 0} />
                  <span className="bk-pgno bk-pgno-l">1</span>
                </div>
                <div className="bk-base-r bk-page-r">
                  <ClosingRight cur={settled === 3} />
                  <span className="bk-pgno">8</span>
                </div>

                {CHAPTERS.map((_, i) => {
                  const flipped = step > i;
                  return (
                    <div key={i} className="bk-leaf" data-flipped={flipped} style={{ zIndex: flipped ? 10 + i : 30 - i }}>
                      <div className="bk-face bk-front bk-page-r" data-cur={settled === i}>
                        <Copy i={i} />
                        <span className="bk-pgno">{i * 2 + 2}</span>
                      </div>
                      <div className="bk-face bk-back bk-page-l">
                        {i < CHAPTERS.length - 1 ? (
                          <VisualPage i={i + 1} on={settled === i + 1} />
                        ) : (
                          <ClosingLeft cur={settled === 3} />
                        )}
                        <span className="bk-pgno bk-pgno-l">{i * 2 + 3}</span>
                      </div>
                    </div>
                  );
                })}
                <span className="bk-spine" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* page dots */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className={script + " text-[1.5rem] leading-none text-[#082567]"}>
              {step < 3 ? "keep scrolling to turn the page" : "the end"}
            </span>
            <span className="flex items-center gap-2">
              {[0, 1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={
                    "h-2 rounded-full transition-all duration-500 " +
                    (n === step ? "w-7 bg-[#C8154B]" : "w-2 bg-[#C8154B]/25")
                  }
                />
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Tablet and phone: loose diary pages, one after another */}
      <div className="relative z-10 mx-auto flex max-w-[640px] flex-col gap-14 px-5 pb-24 pt-10 sm:px-8 lg:hidden">
        {CHAPTERS.map((_, i) => {
          const V = VISUALS[i];
          return (
            <InView key={i} threshold={0.2} className="bk-card" data-odd={i % 2 === 1}>
              <span className="bk-tape" aria-hidden="true" />
              <Copy i={i} />
              <div className="bel-vis mx-auto mt-8 w-full max-w-[24rem] [container-type:inline-size]">
                <V />
              </div>
            </InView>
          );
        })}
      </div>
    </section>
  );
};
