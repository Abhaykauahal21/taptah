"use client";

import React, { useEffect, useRef } from "react";

/**
 * A paragraph whose words light up one by one as it scrolls through the
 * viewport: dim at first, filling to full ink from left to right.
 */
export const ScrollWords: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-w]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shown: number[] = spans.map(() => -1);
    const paint = (p: number) => {
      spans.forEach((s, i) => {
        const k = Math.round(Math.min(1, Math.max(0, p * (spans.length + 4) - i)) * 20) / 20;
        if (k === shown[i]) return; // only touch words that actually changed
        shown[i] = k;
        s.style.opacity = String(0.22 + k * 0.78);
      });
    };
    if (reduced) return paint(1);
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      rootMargin: "10% 0px 10% 0px",
    });
    io.observe(el);
    const update = () => {
      raf = 0;
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the paragraph enters at the bottom, 1 once it reaches ~35% height
      paint(Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.57))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-w>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
};
