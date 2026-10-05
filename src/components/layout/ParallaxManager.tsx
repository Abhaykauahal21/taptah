"use client";

import { useEffect } from "react";

/**
 * One scroll-driven parallax engine for the whole site.
 *
 * Mark any element with `data-parallax="0.12"` (vertical speed) and optionally
 * `data-parallax-x="0.05"`. Positive speeds make an element drift slower than
 * the page (it feels further away); negative speeds make it faster (nearer).
 * The offset is zero when the element is centred in the viewport.
 *
 * Why it is cheap:
 *  - a single passive scroll listener and a single requestAnimationFrame for
 *    every element on the page;
 *  - each element's page position is measured only on load / resize / layout
 *    change, never per frame, so scrolling does no layout reads;
 *  - it only moves elements that are (nearly) on screen;
 *  - it writes the individual `translate` property, which the compositor
 *    animates without repainting and which never fights the element's own
 *    `transform` animations.
 *
 * Skipped entirely for reduced-motion visitors.
 */

interface Item {
  el: HTMLElement;
  speed: number;
  speedX: number;
  /** Page-space centre, measured with the current offset removed. */
  cx: number;
  cy: number;
  /** Offset currently applied. */
  x: number;
  y: number;
  active: boolean;
}

const MAX_OFFSET = 140; // px, a hard cap so nothing ever drifts out of its section

export function ParallaxManager() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = new Map<HTMLElement, Item>();
    let vh = window.innerHeight;
    let vw = window.innerWidth;
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
      it.cx = r.left + window.scrollX + r.width / 2 - it.x;
      it.cy = r.top + window.scrollY + r.height / 2 - it.y;
    };

    const measureAll = () => {
      vh = window.innerHeight;
      vw = window.innerWidth;
      items.forEach(measure);
      schedule();
    };
    const measureSoon = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(measureAll, 120);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-parallax],[data-parallax-x]").forEach((el) => {
        if (items.has(el)) return;
        const it: Item = {
          el,
          speed: parseFloat(el.dataset.parallax ?? "0") || 0,
          speedX: parseFloat(el.dataset.parallaxX ?? "0") || 0,
          cx: 0,
          cy: 0,
          x: 0,
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
      const midX = window.scrollX + vw / 2;
      items.forEach((it) => {
        if (!it.active) return;
        const y = clamp((midY - it.cy) * it.speed);
        const x = it.speedX ? clamp((midX - it.cx) * it.speedX) : 0;
        if (Math.abs(y - it.y) < 0.15 && Math.abs(x - it.x) < 0.15) return;
        it.y = y;
        it.x = x;
        it.el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
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
      items.forEach((it) => it.el.style.removeProperty("translate"));
    };
  }, []);

  return null;
}
