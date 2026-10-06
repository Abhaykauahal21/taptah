"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Page loader (light, matches the site).
 *
 * A single jowar kernel heats up inside a progress ring, shakes harder and
 * harder, and POPS: a fountain of popped jowar (plain, masala and pudina) is
 * thrown out in arcs. "Taptah:" appears first as a fine outline and then
 * fills with colour from the bottom up as the real page load climbs; the
 * status line walks through the same steps as the process section. A cream
 * curtain, with a maroon one right behind it, then lifts away on a wavy edge
 * (the same wave that closes the hero) to reveal the page.
 *
 * `<html data-loading="true">` is set by the layout so the hero's entrance
 * animations stay paused behind the loader; it is cleared as the curtain lifts.
 */

const MIN_MS = 3400; // long enough for the pop and the fountain to play out
const MAX_MS = 9000; // never trap the visitor on a slow network
const ASSET_PATIENCE_MS = 4500; // stop waiting for assets (and let the bar finish) after this
const LETTERS = "Taptah:".split("");

const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
  const d = 70 + (i % 3) * 26;
  return {
    x: Math.round(Math.cos(a) * d),
    y: Math.round(Math.sin(a) * d - 8),
    s: 5 + (i % 4) * 2,
    i,
  };
});

/** Warm dust motes drifting up behind everything (deterministic, so SSR matches). */
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  bottom: `${(i * 13) % 30}%`,
  width: 3 + (i % 3) * 2,
  height: 3 + (i % 3) * 2,
  animationDelay: `${(i % 7) * 0.45}s`,
  animationDuration: `${5 + (i % 5)}s`,
}));

/** Popped jowar thrown out of the kernel: where it lands, how high it flies, how it spins. */
const PIECES = [
  { src: "/images/why/pop-jwaar-1.webp", w: 1397, h: 1126, dx: -150, up: 120, fall: 150, rot: -300, size: 34 },
  { src: "/images/why/masalla-pop-jwaar-1.webp", w: 1316, h: 1195, dx: 140, up: 135, fall: 160, rot: 320, size: 36 },
  { src: "/images/why/pop-jwaar-2.webp", w: 1293, h: 1217, dx: -85, up: 175, fall: 195, rot: 260, size: 28 },
  { src: "/images/why/podina-pop-jwaar.webp", w: 1452, h: 1083, dx: 95, up: 170, fall: 190, rot: -280, size: 30 },
  { src: "/images/why/masalla-pop-jwaar-2.webp", w: 1452, h: 1083, dx: -205, up: 80, fall: 110, rot: 200, size: 28 },
  { src: "/images/why/pop-jwaar-1.webp", w: 1397, h: 1126, dx: 210, up: 85, fall: 115, rot: -220, size: 26 },
  { src: "/images/why/podina-pop-jwaar.webp", w: 1452, h: 1083, dx: -30, up: 205, fall: 225, rot: 180, size: 24 },
  { src: "/images/why/masalla-pop-jwaar-1.webp", w: 1316, h: 1195, dx: 38, up: 195, fall: 215, rot: -200, size: 22 },
];

/**
 * Sprites the steps section's grain physics draws straight from /public (not via
 * next/image), fetched and decoded while the loader plays.
 */
const GRAIN_SPRITES = [
  "/images/why/jwar-grain-2.webp",
  "/images/why/single-jwaar-grain.webp",
  "/images/why/pop-jwaar-1.webp",
  "/images/why/pop-jwaar-2.webp",
  "/images/why/masalla-pop-jwaar-1.webp",
  "/images/why/masalla-pop-jwaar-2.webp",
  "/images/why/podina-pop-jwaar.webp",
];

/** Resolves once an <img> already in the page has downloaded and decoded. */
const imgReady = (img: HTMLImageElement) =>
  img.complete && img.naturalWidth > 0
    ? Promise.resolve()
    : img.decode
      ? img.decode().catch(() => undefined)
      : Promise.resolve();

/** What the loader is "doing" as the count climbs, echoing the process steps. */
const STAGES = [
  "Sourcing ancient grains",
  "Cleaning with care",
  "Slow-roasting on the flame",
  "Seasoning the crunch",
];

const RING_R = 118;
const RING_C = 2 * Math.PI * RING_R;

export const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    // A reload always starts at the hero: stop the browser restoring the old scroll position.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const toTop = () => window.scrollTo(0, 0);
    window.addEventListener("pagehide", toTop);
    const start = performance.now();
    let ready = false;
    let raf = 0;
    let finished = false;

    const markReady = () => {
      ready = true;
    };
    const heroImg = new window.Image();
    heroImg.src = "/images/hero/hero.webp";
    const assets = Promise.all([
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
      heroImg.decode ? heroImg.decode().catch(() => undefined) : Promise.resolve(),
      // The steps section's own pictures (they load eagerly with the page), so
      // every bowl, bottle and leaf is already there the moment you scroll to it.
      // Lazy ones are warmed through a detached copy with the same srcset/sizes, so the
      // browser fetches the very candidate the page will use. (Waiting on the lazy <img>
      // itself never settles off screen, and flipping its `loading` attribute would
      // trip a hydration mismatch.)
      ...Array.from(document.querySelectorAll<HTMLImageElement>("#process img")).map((img) => {
        if (img.loading !== "lazy" || img.complete) return imgReady(img);
        const copy = new window.Image();
        copy.sizes = img.sizes;
        copy.srcset = img.srcset;
        copy.src = img.currentSrc || img.src;
        return imgReady(copy);
      }),
      ...GRAIN_SPRITES.map((src) => {
        const img = new window.Image();
        img.src = src;
        return imgReady(img);
      }),
    ]);
    // Whatever is still outstanding after a few seconds is not worth holding the visitor for.
    const patience = new Promise<void>((r) => window.setTimeout(r, ASSET_PATIENCE_MS));
    Promise.race([assets, patience]).then(markReady);

    const lift = () => {
      if (finished) return;
      finished = true;
      toTop();
      setLifting(true);
      // The hero's entrance animations begin as the curtain starts to rise.
      window.setTimeout(() => root.removeAttribute("data-loading"), 350);
      window.setTimeout(() => setGone(true), 1600);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const elapsed = now - start;
      // The count also follows the clock so it climbs smoothly through the pop animation.
      const paced = (elapsed / (MIN_MS - 300)) * 100;
      const target = Math.min(ready ? 100 : 90, paced);
      progressRef.current += (target - progressRef.current) * 0.12;
      if (progressRef.current > 99.4) progressRef.current = 100;
      setProgress(Math.round(progressRef.current));
      if ((progressRef.current >= 100 && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        cancelAnimationFrame(raf);
        setProgress(100);
        lift();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pagehide", toTop);
      root.removeAttribute("data-loading");
    };
  }, []);

  if (gone) return null;

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(progress / 25))];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Taptah"
      className={"loader" + (lifting ? " loader-lifting" : "")}
    >
      {/* A deep maroon layer sits behind the cream one and follows it up */}
      <div className="loader-back" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="loader-wave-back">
          <path
            fill="currentColor"
            d="M0 0H1440V52C1290 98 1130 92 940 56S600 20 400 58S120 96 0 56Z"
          />
        </svg>
      </div>

      <div className="loader-panel">
        <span className="loader-vignette" aria-hidden="true" />
        {MOTES.map((m, i) => (
          <span key={i} className="loader-mote" style={m as React.CSSProperties} />
        ))}

        <div className="loader-stage">
          {/* Progress ring that fills with the real load */}
          <svg className="loader-ringsvg" viewBox="0 0 260 260" aria-hidden="true">
            <defs>
              <linearGradient id="loader-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f0a63a" />
                <stop offset="1" stopColor="#b23a22" />
              </linearGradient>
            </defs>
            <circle
              cx="130"
              cy="130"
              r={RING_R}
              fill="none"
              stroke="rgba(107,16,34,0.12)"
              strokeWidth="2"
            />
            <circle
              cx="130"
              cy="130"
              r={RING_R}
              fill="none"
              stroke="url(#loader-ring-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress / 100)}
              transform="rotate(-90 130 130)"
            />
          </svg>

          {/* Warm glow that builds as the kernel heats */}
          <span className="loader-glow" />
          <span className="loader-ring loader-ring-1" />
          <span className="loader-ring loader-ring-2" />
          <span className="loader-ring loader-ring-3" />
          <span className="loader-shadow" />

          <Image
            src="/images/why/single-jwaar-grain.webp"
            alt=""
            aria-hidden="true"
            width={160}
            height={152}
            priority
            className="loader-kernel"
          />

          <div className="loader-pop-wrap">
            <Image
              src="/images/why/pop-jwaar-1.webp"
              alt=""
              aria-hidden="true"
              width={300}
              height={242}
              priority
              className="loader-pop"
            />
          </div>

          {SPARKS.map((s) => (
            <span
              key={s.i}
              className="loader-spark"
              style={
                {
                  "--x": `${s.x}px`,
                  "--y": `${s.y}px`,
                  width: s.s,
                  height: s.s,
                  animationDelay: `${1.55 + (s.i % 3) * 0.03}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="loader-fountain" aria-hidden="true">
          {PIECES.map((p, i) => (
            <span
              key={i}
              className="loader-piece"
              style={
                {
                  "--dx": `${p.dx}px`,
                  "--up": `${p.up}px`,
                  "--fall": `${p.fall}px`,
                  "--rot": `${p.rot}deg`,
                  width: p.size,
                  animationDelay: `${1.62 + i * 0.045}s`,
                } as React.CSSProperties
              }
            >
              <Image
                src={p.src}
                alt=""
                width={p.w}
                height={p.h}
                sizes="40px"
                style={{ animationDelay: `${1.62 + i * 0.045}s` }}
              />
            </span>
          ))}
        </div>

        {/* Wordmark: the outline is drawn first, then the colour fills it as the load climbs */}
        <div className="loader-word" aria-hidden="true">
          <div className="loader-word-outline">
            {LETTERS.map((c, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </div>
          <div
            className="loader-word-fill"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          >
            {LETTERS.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
        <p className="loader-tag">Ancient Grain &middot; Modern Crunch</p>

        <div className="loader-meter" aria-hidden="true">
          <span key={stage} className="loader-stage-label">
            {stage}
          </span>
          <span className="loader-count">{progress}%</span>
        </div>

        {/* Wavy lower edge of the curtain */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="loader-wave"
        >
          <path
            fill="currentColor"
            d="M0 0H1440V45C1320 95 1180 100 1000 62S680 18 480 52S160 92 0 48Z"
          />
        </svg>
      </div>
    </div>
  );
};
