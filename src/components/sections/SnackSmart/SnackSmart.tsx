"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Feather, Leaf, Wheat } from "lucide-react";
import { InView } from "@/components/common/InView";

/**
 * "One Millet. Zero Fuss." as two big numerals that count down to 1 and 0, three packs that
 * fan out and float, a spinning badge, and a few pieces of pop jowar drifting about.
 * (Gluten-Free is left out until it is confirmed and printed on the pack.)
 */

const POINTS = [
  { Icon: Wheat, label: "Single Millet", rot: -3 },
  { Icon: Leaf, label: "Real Flavours", rot: 2 },
  { Icon: Feather, label: "Light & Crunchy", rot: -1.5 },
];

const PACKS = [
  { src: "/images/flavours/PeriPeriPack.webp", alt: "Peri Peri Pop Jowar pack", x: -27, y: 7, rot: -11, depth: 0.5, z: 1, delay: 0.5 },
  { src: "/images/flavours/TangyPudinaPack.webp", alt: "Tangy Pudina Pop Jowar pack", x: 27, y: 9, rot: 10, depth: 0.7, z: 2, delay: 0.7 },
  { src: "/images/flavours/ButterSaltpack.webp", alt: "Butter Salt Pop Jowar pack", x: 0, y: -4, rot: 0, depth: 1, z: 3, delay: 0.3 },
] as const;

const POPS = [
  { src: "/images/why/pop-jwaar-1.webp", w: 1397, h: 1126, l: 4, t: 8, size: 9, r: 18, d: 6 },
  { src: "/images/why/masalla-pop-jwaar-1.webp", w: 1316, h: 1195, l: 82, t: 58, size: 10, r: -26, d: 8 },
  { src: "/images/why/podina-pop-jwaar.webp", w: 1452, h: 1083, l: 2, t: 70, size: 8, r: 40, d: 7 },
  { src: "/images/why/pop-jwaar-2.webp", w: 1293, h: 1217, l: 70, t: 2, size: 7, r: -10, d: 9 },
] as const;

const sty = (v: Record<string, string | number>) => v as React.CSSProperties;

/** Counts from `from` to `to` once it scrolls into view. */
function Counter({ from, to }: { from: number; to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(from);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      setDone(true);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1700;
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          setN(Math.round(from + (to - from) * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
          else setDone(true);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to]);

  return (
    <span ref={ref} className="ss-num" data-done={done} aria-hidden="true">
      {n}
    </span>
  );
}

export const SnackSmart: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);

  // The packs lean a little towards the cursor.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.setProperty("--mx", x.toFixed(3));
        stage.style.setProperty("--my", y.toFixed(3));
      });
    };
    const onLeave = () => {
      stage.style.setProperty("--mx", "0");
      stage.style.setProperty("--my", "0");
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      id="snack-smart"
      aria-label="Snack Smart"
      className="ss-section relative overflow-hidden bg-[#C8154B] px-5 py-20 text-[#F2EEBF] sm:px-8 lg:px-12 lg:py-28"
    >
      {/* dotted paper, a warm glow and a faded wordmark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="ss-dots absolute inset-0" />
        <span className="absolute -right-[8%] top-1/2 h-[120%] w-[60%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,190,120,0.3),transparent)]" />
        <p className="absolute -bottom-[0.2em] left-[1%] select-none whitespace-nowrap text-[clamp(7rem,19vw,19rem)] font-extrabold uppercase leading-none tracking-tight text-[#F2EEBF]/[0.05]">
          Snack Smart
        </p>
      </div>

      <InView className="ss-art relative z-10 mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        {/* Copy */}
        <div>
          <p className="ss-rise flex items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.3em] text-[#F2EEBF]/80 sm:text-sm" style={sty({ "--i": 0 })}>
            Snack Smart
            <span aria-hidden="true" className="h-px w-14 bg-[#F2EEBF]/40" />
          </p>

          <h2 className="mt-5">
            <span className="sr-only">One Millet. Zero Fuss.</span>
            <span aria-hidden="true" className="ss-row ss-rise" style={sty({ "--i": 1 })}>
              <Counter from={9} to={1} />
              <span className="ss-word">
                One
                <br />
                Millet.
              </span>
            </span>
            <span aria-hidden="true" className="ss-row ss-row-0 ss-rise" style={sty({ "--i": 2 })}>
              <Counter from={9} to={0} />
              <span className="ss-word">
                Zero
                <br />
                Fuss.
              </span>
            </span>
          </h2>

          <p
            className="ss-rise mt-8 max-w-[31rem] text-[clamp(1.1rem,1.4vw,1.35rem)] font-medium leading-[1.55] text-[#F2EEBF]/90"
            style={sty({ "--i": 3 })}
          >
            Pop Jowar is made from a single millet and real seasonings. Simple snacking, with crunch in every
            handful.
          </p>

          <ul className="mt-7 flex flex-wrap gap-3">
            {POINTS.map(({ Icon, label, rot }, i) => (
              <li key={label} className="ss-rise" style={sty({ "--i": 4 + i })}>
                <span
                  className="ss-sticker inline-flex items-center gap-2.5 rounded-full bg-[#F2EEBF] py-2 pl-2.5 pr-5 text-[1.05rem] font-semibold text-[#C8154B] shadow-[0_8px_16px_-8px_rgba(60,10,25,0.6)]"
                  style={sty({ "--rot": `${rot}deg` })}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8154B] text-[#F2EEBF]">
                    <Icon aria-hidden="true" strokeWidth={1.7} className="h-[18px] w-[18px]" />
                  </span>
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="ss-rise mt-9 flex flex-wrap items-center gap-4" style={sty({ "--i": 7 })}>
            <Link
              href="/products"
              transitionTypes={["nav-forward"]}
              className="hero-shine group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-[#F2EEBF] px-7 py-3.5 text-base font-semibold text-[#C8154B] shadow-lg transition-all duration-300 hover:bg-white hover:shadow-xl"
            >
              Shop Pop Jowar
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#flavours"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#F2EEBF]/60 px-7 py-3.5 text-base font-semibold text-[#F2EEBF] transition-colors duration-300 hover:bg-[#F2EEBF] hover:text-[#C8154B]"
            >
              Explore Products
            </Link>
          </div>
        </div>

        {/* Stage: three packs fan out, a badge spins, pop jowar drifts */}
        <div
          ref={stageRef}
          className="ss-stage relative mx-auto aspect-square w-full max-w-[34rem] [container-type:inline-size]"
          style={sty({ "--mx": 0, "--my": 0 })}
        >
          <span aria-hidden="true" className="ss-disc absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          {PACKS.map((p) => (
            <div
              key={p.src}
              className="ss-pack-pos absolute left-1/2 top-1/2 w-[46%]"
              style={sty({ "--d": p.depth, zIndex: p.z })}
            >
              <div className="ss-pack-fan" style={sty({ "--x": `${p.x}%`, "--y": `${p.y}%`, "--r": `${p.rot}deg`, "--dl": `${p.delay}s` })}>
                <div className="ss-pack-bob" style={sty({ "--b": `${p.delay * 4}s` })}>
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={572}
                    height={687}
                    sizes="(min-width: 1024px) 16rem, 40vw"
                    className="h-auto w-full rounded-[18px] shadow-[0_28px_36px_-14px_rgba(40,5,20,0.7)]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* spinning badge */}
          <div className="ss-badge-pos absolute right-[-2%] top-[-2%] z-[5] w-[30%]">
            <div className="ss-badge">
              <svg viewBox="0 0 160 160" className="ss-badge-spin h-full w-full" aria-hidden="true">
                <defs>
                  <path id="ss-circle" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
                </defs>
                <circle cx="80" cy="80" r="78" fill="#F2B760" />
                <circle cx="80" cy="80" r="72" fill="none" stroke="#C8154B" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
                <text fill="#C8154B" fontSize="13.5" fontWeight="700" letterSpacing="2.4">
                  <textPath href="#ss-circle">SINGLE MILLET • REAL FLAVOURS • LIGHT &amp; CRUNCHY •</textPath>
                </text>
              </svg>
              <Image
                src="/images/why/pop-jwaar-1.webp"
                alt=""
                aria-hidden="true"
                width={1397}
                height={1126}
                sizes="60px"
                className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_4px_rgba(60,10,25,0.4)]"
              />
            </div>
          </div>

          {/* pop jowar drifting around */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] hidden sm:block">
            {POPS.map((p, i) => (
              <Image
                key={i}
                src={p.src}
                alt=""
                width={p.w}
                height={p.h}
                sizes="80px"
                className="proc-float absolute drop-shadow-[0_10px_10px_rgba(40,5,20,0.45)]"
                style={sty({ left: `${p.l}%`, top: `${p.t}%`, width: `${p.size}%`, "--r": `${p.r}deg`, "--d": `${p.d}s` })}
              />
            ))}
          </div>
        </div>
      </InView>
    </section>
  );
};
