import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { InView } from "@/components/common/InView";
import { FooterMotion } from "./FooterMotion";

/**
 * Footer. A cream sky (matching the page above) over the golden jowar valley
 * (/images/footer/footer-bg.webp, transparent on top) with jowar swaying in
 * the foreground. Everything is alive: the sun glow breathes, the valley
 * drifts, pollen floats up, the sky content rises in piece by piece, and the
 * wordmark stands up letter by letter and then ripples with a sweep of light.
 */

const NAV = [
  { label: "Shop", href: "#flavours" },
  { label: "Our Story", href: "#story" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "mailto:hello@taptah.com" },
];

const LEGAL = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/taptah",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://twitter.com/taptah",
    icon: (
      <svg {...iconProps}>
        <path d="M4 4l7.2 9.6L4.2 20M20 4l-6.8 7.4M20 20L9 4H4l11 16h5Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@taptah",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.2 9.4v5.2l4.6-2.6-4.6-2.6Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@taptah.com",
    icon: <Mail width={20} height={20} strokeWidth={1.5} aria-hidden />,
  },
];

const WORD = "TAPTAH".split("");

/** Pollen drifting up through the valley (deterministic, so SSR matches). */
const POLLEN = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 53 + 9) % 100}%`,
  bottom: `${(i * 11) % 38}%`,
  width: 3 + (i % 3) * 2,
  height: 3 + (i % 3) * 2,
  animationDelay: `${(i % 8) * 0.7}s`,
  animationDuration: `${7 + (i % 5) * 1.3}s`,
}));

/** A small flock gliding along the mountain ridges: [top % of footer, size px, duration s, delay s]. */
const BIRDS = [
  [42, 26, 38, 0],
  [49, 18, 44, 6],
  [38, 14, 52, 14],
  [53, 22, 41, 22],
  [45, 12, 58, 30],
];

/**
 * Cloud layers, far to near, all hugging the mountain ridge. Each cloud: [sprite, top % of footer, width vw,
 * start offset 0..1 along its drift, drift seconds]. Far clouds are small, faint
 * and slow; near clouds are big, bright and fast. The layer also carries a
 * scroll-parallax speed (positive lags the page = farther away).
 */
const CLOUD_LAYERS = [
  {
    id: "far",
    phone: false,
    z: "-z-[15]",
    parallax: "0.12",
    opacity: 0.8,
    clouds: [
      [4, 30, 13, 0.15, 160],
      [2, 35, 12, 0.7, 175],
    ],
  },
  {
    id: "mid",
    phone: true,
    z: "-z-[14]",
    parallax: "0.07",
    opacity: 0.95,
    clouds: [
      [1, 32, 19, 0.35, 110],
      [3, 38, 17, 0.85, 120],
    ],
  },
  {
    id: "near",
    phone: false,
    z: "-z-[13]",
    parallax: "0.03",
    opacity: 0.9,
    clouds: [[3, 40, 15, 0.55, 95]],
  },
  {
    // In front of the mountains: a couple of small, slightly see-through clouds
    // drifting across the slopes, so the ridge sits between cloud layers.
    id: "front",
    phone: true,
    z: "z-[2]",
    parallax: "-0.04",
    opacity: 0.78,
    clouds: [
      [2, 39, 11, 0.2, 75],
      [4, 44, 9, 0.7, 88],
    ],
  },
] as const;

/** Leaves along the sky edges on phones: [edge, top %, width vw, rotation deg, drift s, delay s]. */
const LEAVES = [
  ["left", 6, 16, 150, 9, 0],
  ["right", 11, 15, 30, 11, 1.5],
  ["left", 29, 14, 120, 10, 0.8],
  ["right", 40, 12, 60, 12, 2.4],
] as const;

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

export const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="relative isolate mt-auto w-full overflow-hidden text-[#6B1022]"
      style={{
        background:
          "linear-gradient(180deg, #f8e9d6 0%, #f8e9d6 22%, #f5dcb9 52%, #efc78e 78%, #e8b06a 100%)",
      }}
    >
      <FooterMotion />

      {/* A sun that rises behind the ridge as you scroll into the footer, with
          slowly turning rays and a warm dawn wash over the sky */}
      <div className="footer-dawn pointer-events-none absolute inset-0 -z-20" aria-hidden="true" />
      <div className="footer-rays pointer-events-none absolute -z-20" aria-hidden="true" />
      <div className="footer-sundisc pointer-events-none absolute -z-20" aria-hidden="true" />

      {/* Clouds, in three depth layers: each drifts by itself and also slides
          against the page as you scroll, so they stay behind (or in front of) the mountains */}
      {CLOUD_LAYERS.map((layer) => (
        <div
          key={layer.id}
          data-parallax={layer.parallax}
          aria-hidden="true"
          className={"pointer-events-none absolute inset-0 " + layer.z + (layer.phone ? "" : " hidden sm:block")}
        >
          {layer.clouds.map(([sprite, top, width, start, dur], i) => (
            <div
              key={i}
              className="footer-cloud absolute left-0"
              style={
                {
                  top: `${top}%`,
                  width: `${width}vw`,
                  opacity: layer.opacity,
                  "--dur": `${dur}s`,
                  "--start": start,
                } as React.CSSProperties
              }
            >
              <Image
                src={`/images/footer/cloud-${sprite}.webp`}
                alt=""
                width={1000}
                height={380}
                sizes="40vw"
                className="h-auto w-full select-none sm:drop-shadow-[0_8px_16px_rgba(160,85,40,0.28)]"
              />
            </div>
          ))}
        </div>
      ))}

      {/* Birds crossing the sky */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        {BIRDS.map(([top, size, dur, delay], i) => (
          <svg
            key={i}
            viewBox="0 0 40 20"
            className={"footer-bird absolute left-0" + (i >= 2 ? " hidden sm:block" : "")}
            style={{
              top: `${top}%`,
              width: size,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <path className="footer-wing footer-wing-l" d="M20 12 Q11 1 1 5" />
            <path className="footer-wing footer-wing-r" d="M20 12 Q29 1 39 5" />
          </svg>
        ))}
      </div>

      {/* Sun glow low behind the valley, slowly breathing */}
      <div className="footer-sun pointer-events-none absolute inset-x-0 bottom-[10%] -z-10 h-[60%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,214,150,0.6),transparent_62%)]" />

      {/* Valley, anchored to the bottom, drifting ever so slightly */}
      <Image
        src="/images/footer/footer-bg.webp"
        alt=""
        aria-hidden="true"
        width={1988}
        height={791}
        sizes="100vw"
        className="footer-valley pointer-events-none sm:blur-[1.6px] sm:saturate-[0.88] absolute inset-x-0 bottom-0 -z-10 h-[44%] w-full select-none object-cover object-[50%_70%] sm:h-auto"
      />

      {/* Depth: atmospheric haze over the distant mountains, and a soft shade in
          the field behind the wordmark, so the content reads clearly */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-[41vw] sm:block bg-[linear-gradient(180deg,rgba(248,233,214,0.78)_0%,rgba(246,224,190,0.5)_30%,rgba(240,205,150,0.16)_62%,transparent_85%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[30vw] sm:block bg-[radial-gradient(ellipse_at_50%_62%,rgba(70,28,8,0.5),transparent_66%)]" />

      {/* Pollen */}
      <InView
        threshold={0.05}
        aria-hidden="true"
        className="footer-pollen-layer pointer-events-none absolute inset-0 z-[3]"
      >
        {POLLEN.map((p, i) => (
          <span key={i} className={"footer-pollen" + (i >= 7 ? " hidden sm:block" : "")} style={p as React.CSSProperties} />
        ))}
      </InView>

      {/* Wordmark, standing in the field */}
      <InView
        threshold={0.2}
        aria-hidden="true"
        className="footer-word-layer pointer-events-none absolute inset-x-0 bottom-[calc(min(5vw,72px)+3.4vw)] z-[4] hidden flex-col items-center sm:flex"
      >
        <div className="footer-word flex font-semibold leading-[0.8] tracking-[-0.01em]">
          {WORD.map((c, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </span>
          ))}
        </div>
        <p className="footer-script">Crunch · Clean · Repeat</p>
      </InView>

      {/* Jowar swaying in the foreground, left and right (the right one is mirrored) */}
      <InView
        threshold={0.15}
        className="footer-jowar-layer pointer-events-none absolute inset-0 z-[5] overflow-hidden"
        aria-hidden="true"
      >
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            data-parallax={side === "left" ? "-0.05" : "-0.07"}
            className={
              "absolute bottom-[-2%] w-[72vw] max-w-[560px] sm:bottom-[-3%] sm:w-[30vw] " +
              (side === "left" ? "left-[-15vw] sm:left-[-7vw]" : "right-[-15vw] sm:right-[-7vw]")
            }
          >
            <div className={"footer-jowar footer-jowar-" + side}>
              <Image
                src="/images/footer/footer-jwaar.webp"
                alt=""
                width={1477}
                height={1065}
                sizes="(min-width: 1024px) 30vw, 60vw"
                className={
                  "h-auto w-full select-none sm:drop-shadow-[0_14px_16px_rgba(60,30,8,0.35)] " +
                  (side === "right" ? "-scale-x-100" : "")
                }
              />
            </div>
          </div>
        ))}
      </InView>

      {/* Sky content: nav between hairlines, tagline, blurb and socials */}
      <InView
        threshold={0.15}
        className="footer-sky relative z-[6] mx-auto flex max-w-[1280px] flex-col items-center px-5 pb-[76vw] pt-28 text-center sm:pb-[34vw] sm:px-8 lg:px-12 lg:pb-[calc(30vw-3.5rem)] lg:pt-[6.5rem]"
      >
        {/* Phones: tagline, wordmark, intro, socials and a Shop Now button */}
        <div className="flex w-full flex-col items-center sm:hidden">
          <div className="footer-rise flex w-full items-center gap-3" style={rise(0)}>
            <span aria-hidden="true" className="h-px flex-1 bg-[#6B1022]/35" />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#6B1022]">
              Ancient Grain, Modern Crunch
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-[#6B1022]/35" />
          </div>

          <p
            aria-label="Taptah"
            className="relative mt-7 flex text-[23.5vw] font-semibold leading-[0.85] tracking-[-0.01em] text-[#6B1022] drop-shadow-[0_6px_10px_rgba(107,16,34,0.18)]"
          >
            {WORD.map((c, i) => (
              <span key={i} aria-hidden="true" className="footer-rise inline-block" style={rise(i + 1)}>
                {c}
              </span>
            ))}
            <sup aria-hidden="true" className="absolute -right-[1.6vw] top-[1vw] text-[2.6vw] font-medium tracking-normal">
              TM
            </sup>
          </p>
          <p
            className="footer-rise -mt-[1vw] font-[family-name:var(--font-script)] text-[8.6vw] leading-none text-[#a8642e]"
            style={rise(7)}
          >
            Crunch · Clean · Repeat
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 140 8"
            className="footer-rise mt-1 h-2 w-[34vw] text-[#a8642e]"
            style={rise(8)}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 5C30 2 60 6 90 3s34-1 47 1" />
          </svg>

          <p
            className="footer-rise mt-7 max-w-[19rem] text-[1.05rem] font-medium leading-[1.5] text-[#4a3a33]"
            style={rise(9)}
          >
            Light, crunchy snacks crafted from ancient grains, for a healthier,
            happier you.
          </p>

          <ul className="mt-6 flex items-center gap-3">
            {SOCIALS.map((s, i) => (
              <li key={s.label} className="footer-pop" style={rise(i + 10)}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3dcb9]/85 text-[#6B1022] shadow-[0_6px_14px_-8px_rgba(120,70,30,0.6)] transition-transform active:scale-90"
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>

          <Link
            href="#flavours"
            className="footer-rise mt-7 inline-flex items-center gap-3 rounded-full bg-[#5a0f1e] px-9 py-4 text-lg font-semibold text-[#fbe9cf] shadow-[0_14px_24px_-10px_rgba(60,8,18,0.7)] transition-transform active:scale-95"
            style={rise(14)}
          >
            Shop Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <nav aria-label="Footer" className="hidden w-full items-center gap-5 sm:flex sm:gap-8">
          <span
            className="footer-line hidden h-px flex-1 origin-right bg-[#6B1022]/25 sm:block"
            style={rise(0)}
          />
          <ul className="mx-auto flex flex-wrap items-center justify-center gap-x-7 gap-y-2 sm:gap-x-12">
            {NAV.map((l, i) => (
              <li key={l.label} className="footer-rise" style={rise(i + 1)}>
                <Link
                  href={l.href}
                  className="footer-link text-[0.82rem] font-semibold uppercase tracking-[0.34em] text-[#6B1022]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <span
            className="footer-line hidden h-px flex-1 origin-left bg-[#6B1022]/25 sm:block"
            style={rise(0)}
          />
        </nav>

        <p
          className="footer-rise mt-9 hidden text-[0.8rem] font-semibold uppercase tracking-[0.42em] text-[#6B1022] sm:block"
          style={rise(5)}
        >
          Ancient Grain, Modern Crunch
        </p>
        <p
          className="footer-rise mt-3 hidden max-w-[42rem] sm:block text-[clamp(1rem,1.3vw,1.2rem)] font-medium leading-[1.5] text-[#4a3a33]"
          style={rise(6)}
        >
          Light, crunchy snacks crafted from ancient grains, for a healthier,
          happier you.
        </p>

        <ul className="mt-6 hidden items-center gap-7 sm:flex">
          {SOCIALS.map((s, i) => (
            <li key={s.label} className="footer-pop" style={rise(i + 7)}>
              <a
                href={s.href}
                aria-label={s.label}
                className="footer-social block text-[#6B1022]"
                {...(s.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </InView>

      {/* Phones: leaves drifting down the sky edges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] overflow-hidden sm:hidden">
        {LEAVES.map(([side, top, w, rot, dur, delay], i) => (
          <Image
            key={i}
            src="/images/why/leaf-b.png"
            alt=""
            width={175}
            height={126}
            className="footer-leaf absolute drop-shadow-[2px_6px_5px_rgba(60,35,15,0.25)]"
            style={
              {
                [side]: "-3vw",
                top: `${top}%`,
                width: `${w}vw`,
                "--r": `${rot}deg`,
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Legal bar */}
      <InView
        threshold={0.3}
        className="footer-legal absolute inset-x-0 bottom-0 z-[6] bg-gradient-to-t from-black/50 to-transparent px-5 pb-4 pt-10 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px] border-t border-cream/30 pt-4">
          <div className="grid items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/90 sm:grid-cols-3">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Taptah Foods
            </p>
            <ul className="flex items-center justify-center gap-3 sm:gap-4">
              {LEGAL.map((l, i) => (
                <React.Fragment key={l.label}>
                  {i > 0 && (
                    <li aria-hidden="true" className="opacity-60">
                      ·
                    </li>
                  )}
                  <li>
                    <Link href={l.href} className="transition-opacity hover:opacity-60">
                      {l.label}
                    </Link>
                  </li>
                </React.Fragment>
              ))}
            </ul>
            <p className="text-center sm:text-right">All rights reserved.</p>
          </div>
        </div>
      </InView>
    </footer>
  );
};
