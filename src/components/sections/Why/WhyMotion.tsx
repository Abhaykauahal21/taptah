"use client";

import { useEffect } from "react";

/**
 * Flips `data-in-view` on the Why section once it has come into view, which
 * starts its staged text reveals. Renders nothing. (The scroll parallax now
 * lives in ParallaxManager.)
 */
export function WhyMotion() {
  useEffect(() => {
    const el = document.getElementById("story");
    if (!el) return;
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
    return () => io.disconnect();
  }, []);
  return null;
}
