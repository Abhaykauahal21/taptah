"use client";

import { useEffect } from "react";

/**
 * Marks every <section> / <footer> with `data-offscreen` while it is well away
 * from the viewport. CSS uses it to pause that section's looping animations,
 * so only what is on screen is ever animating. Renders nothing.
 */
export function OffscreenPause() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("main section, footer");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute("data-offscreen");
          else e.target.setAttribute("data-offscreen", "");
        }
      },
      { rootMargin: "120px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
