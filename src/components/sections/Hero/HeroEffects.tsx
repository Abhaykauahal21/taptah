"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Atmosphere for the hero:
 *  - pop jowar that bursts out of the bowl, then drifts at different depths
 *  - mouse + scroll parallax, published as CSS variables on the hero section
 *    (--hx / --hy in -1..1, --hs in 0..1) for the rest of the hero to use.
 */

interface Floater {
  src: string;
  width: number;
  height: number;
  /** Final position (% of the hero), size (vw) and rotation. */
  left: number;
  top: number;
  size: number;
  rotate: number;
  /** 0 = far, 1 = near: drives parallax strength and blur. */
  depth: number;
  delay: number;
  drift: number;
}

const P1 = { src: "/images/why/pop-jwaar-1.png", width: 1397, height: 1126 };
const P2 = { src: "/images/why/pop-jwaar-2.png", width: 1293, height: 1217 };

const FLOATERS: Floater[] = [
  { ...P1, left: 57, top: 20, size: 5.4, rotate: -18, depth: 0.95, delay: 0.1, drift: 7 },
  { ...P2, left: 72, top: 9, size: 4.4, rotate: 24, depth: 0.7, delay: 0.35, drift: 9 },
  { ...P1, left: 80, top: 50, size: 5.2, rotate: 12, depth: 1, delay: 0.2, drift: 8 },
  { ...P2, left: 63, top: 45, size: 3.4, rotate: -40, depth: 0.5, delay: 0.55, drift: 10 },
  { ...P1, left: 92, top: 55, size: 3.8, rotate: 30, depth: 0.6, delay: 0.45, drift: 11 },
  { ...P2, left: 53, top: 64, size: 3.1, rotate: 8, depth: 0.4, delay: 0.7, drift: 9 },
  { ...P1, left: 78, top: 5, size: 2.8, rotate: -8, depth: 0.25, delay: 0.8, drift: 12 },
  { ...P2, left: 94, top: 70, size: 2.6, rotate: 50, depth: 0.2, delay: 0.9, drift: 13 },
  { ...P1, left: 68, top: 30, size: 2.4, rotate: -60, depth: 0.3, delay: 1, drift: 10 },
];

export const HeroEffects: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = rootRef.current?.closest<HTMLElement>("#hero");
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- parallax: eased mouse + scroll, published as CSS variables ----
    // The loop only runs while something is still easing, and sleeps otherwise.
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let hsTarget = 0;
    let hsCurrent = 0;
    let heroH = section.offsetHeight || window.innerHeight;
    let hiddenNow = false;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;
      cx += (tx - cx) * Math.min(1, dt * 4);
      cy += (ty - cy) * Math.min(1, dt * 4);
      hsCurrent += (hsTarget - hsCurrent) * Math.min(1, dt * 9);
      section.style.setProperty("--hs", hsCurrent.toFixed(4));
      section.style.setProperty("--hx", cx.toFixed(3));
      section.style.setProperty("--hy", cy.toFixed(3));
      const settled =
        Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002 && Math.abs(hsTarget - hsCurrent) < 0.0005;
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      wake();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      wake();
    };
    const setScroll = () => {
      // Past the hero nothing visible changes, so don't wake the loop for it.
      const raw = window.scrollY / heroH;
      // Once the cream page fully covers the hero, stop painting and animating it.
      const covered = raw > 1.08;
      if (covered !== hiddenNow) {
        hiddenNow = covered;
        section.style.visibility = covered ? "hidden" : "";
      }
      const next = Math.min(1, Math.max(0, raw));
      if (next === hsTarget) return;
      hsTarget = next;
      wake();
    };
    const onResize = () => {
      heroH = section.offsetHeight || window.innerHeight;
      setScroll();
    };

    if (!reduced) {
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", setScroll, { passive: true });
      window.addEventListener("resize", onResize);
      setScroll();
    }

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", setScroll);
      window.removeEventListener("resize", onResize);
      section.style.visibility = "";
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">

      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="hero-float absolute hidden md:block"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: `${f.size}vw`,
              "--d": f.depth,
              "--bx": `${78 - f.left}vw`,
              "--by": `${78 - f.top}svh`,
              "--rot": `${f.rotate}deg`,
              "--drift": `${f.drift}s`,
              "--delay": `${f.delay + 1.1}s`,
              filter: `blur(${Math.max(0, (0.45 - f.depth) * 6).toFixed(1)}px)`,
            } as React.CSSProperties
          }
        >
          <Image
            src={f.src}
            alt=""
            width={f.width}
            height={f.height}
            sizes="8vw"
            className="hero-float-img h-auto w-full drop-shadow-[0_14px_14px_rgba(30,10,0,0.45)]"
          />
        </div>
      ))}
    </div>
  );
};
