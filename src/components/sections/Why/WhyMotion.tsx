"use client";

import { useEffect } from "react";

/**
 * Publishes the section's scroll progress as `--ws` (0 as it enters at the
 * bottom of the viewport, 1 as it leaves at the top) and flips
 * `data-in-view` once the section has come into view. Renders nothing; the
 * parallax and reveals live in CSS.
 */
export function WhyMotion() {
  useEffect(() => {
    const el = document.getElementById("story");
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      el.style.setProperty("--ws", reduced ? "0.5" : p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-in-view", "true");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
