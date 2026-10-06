"use client";

import { useEffect } from "react";

/**
 * One scroll-driven parallax engine for the whole site.
 *
 * Mark any element with `data-parallax="0.12"`. Positive speeds make an element
 * drift slower than the page (it feels further away); negative speeds make it
 * faster (nearer). The offset is zero when the element is centred in the
 * viewport.
 *
 * How it works, and why:
 *  - Each element gets one paused Web Animation of its `translate` property,
 *    and scrolling just scrubs its `currentTime`. That never writes to the
 *    element's `style` attribute (or any attribute), so React's hydration of
 *    server-rendered markup cannot be upset by it.
 *  - One passive scroll listener and one requestAnimationFrame serve every
 *    element; page positions are measured only on load / resize / layout change,
 *    never per frame; elements that are off screen are not touched.
 *  - `translate` is animated on the compositor and never fights an element's
 *    own `transform` animations.
 *
 * Skipped entirely for reduced-motion visitors.
 */

interface Item {
  el: HTMLElement;
  speed: number;
  anim: Animation;
  /** Page-space centre, measured with the current offset removed. */
  cy: number;
  /** Offset currently applied. */
  y: number;
  active: boolean;
}

const MAX_OFFSET = 140; // px, a hard cap so nothing ever drifts out of its section
const DURATION = 1000; // ms; progress 0..1 maps onto -MAX_OFFSET..+MAX_OFFSET

export function ParallaxManager() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof Element.prototype.animate !== "function") return;

    const items = new Map<HTMLElement, Item>();
    let vh = window.innerHeight;
    let raf = 0;
    let measureTimer = 0;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const it = items.get(e.target as HTMLElement);
          if (it) it.active = e.isIntersecting;
        }
        schedule();
      },
      { rootMargin: "25% 0px 25% 0px" },
    );

    const measure = (it: Item) => {
      const r = it.el.getBoundingClientRect();
      it.cy = r.top + window.scrollY + r.height / 2 - it.y;
    };

    const measureAll = () => {
      vh = window.innerHeight;
      items.forEach(measure);
      schedule();
    };
    const measureSoon = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measureAll, 120);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        if (items.has(el)) return;
        const anim = el.animate(
          { translate: [`0px ${-MAX_OFFSET}px`, `0px ${MAX_OFFSET}px`] },
          { duration: DURATION, fill: "both", easing: "linear" },
        );
        anim.pause();
        anim.currentTime = DURATION / 2;
        const it: Item = {
          el,
          speed: parseFloat(el.dataset.parallax ?? "0") || 0,
          anim,
          cy: 0,
          y: 0,
          active: false,
        };
        items.set(el, it);
        measure(it);
        io.observe(el);
      });
    };

    const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));

    const frame = () => {
      raf = 0;
      const midY = window.scrollY + vh / 2;
      items.forEach((it) => {
        if (!it.active) return;
        const y = clamp((midY - it.cy) * it.speed);
        if (Math.abs(y - it.y) < 0.15) return;
        it.y = y;
        it.anim.currentTime = ((y + MAX_OFFSET) / (2 * MAX_OFFSET)) * DURATION;
      });
    };

    function schedule() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    scan();
    measureAll();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measureSoon);
    // Images and fonts settle after load, which can move things: measure again.
    window.addEventListener("load", measureSoon);
    const settle = [600, 1800, 4500].map((ms) =>
      window.setTimeout(() => {
        scan();
        measureAll();
      }, ms),
    );
    const ro = new ResizeObserver(measureSoon);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(measureTimer);
      settle.forEach(window.clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measureSoon);
      window.removeEventListener("load", measureSoon);
      io.disconnect();
      ro.disconnect();
      items.forEach((it) => it.anim.cancel());
    };
  }, []);

  return null;
}
