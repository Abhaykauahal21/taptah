"use client";

import { useEffect } from "react";

/**
 * Drives the footer's scroll- and pointer-linked effects. Renders nothing.
 *
 * Published as CSS variables on #footer (CSS does all of the visual work):
 *   --fp   0 -> 1 as the footer scrolls into view (sun rises, valley dollies in,
 *          the wordmark fans into place)
 *   --mx   pointer x across the footer, 0..1 (jowar leans away from the cursor)
 * and, per wordmark letter, `--h` (0..1): how close the cursor is, so the
 * letters near it lift and glow.
 *
 * One scroll listener and one rAF, both idle while the footer is off screen.
 */
export function FooterMotion() {
  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(footer.querySelectorAll<HTMLElement>(".footer-word span"));
    let visible = false;
    let raf = 0;
    let px = -1;
    let py = -1;
    let mx = 0.5;
    let mxTarget = 0.5;
    let fp = 0;
    const lastH = letters.map(() => 0);

    const frame = () => {
      raf = 0;
      if (!visible) return;
      const r = footer.getBoundingClientRect();
      const vh = window.innerHeight;
      const target = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      fp += (target - fp) * 0.18;
      mx += (mxTarget - mx) * 0.08;
      footer.style.setProperty("--fp", fp.toFixed(4));
      footer.style.setProperty("--mx", mx.toFixed(3));

      // Wordmark letters react to the cursor
      if (letters.length && px >= 0) {
        const reach = window.innerWidth * 0.12;
        letters.forEach((el, i) => {
          const b = el.getBoundingClientRect();
          const dx = Math.abs(px - (b.left + b.width / 2));
          const dy = Math.abs(py - (b.top + b.height / 2));
          const h = Math.max(0, 1 - Math.hypot(dx, dy * 0.5) / reach);
          const eased = Math.round(h * h * 100) / 100;
          if (eased !== lastH[i]) {
            lastH[i] = eased;
            el.style.setProperty("--h", String(eased));
          }
        });
      }

      const settling = Math.abs(target - fp) > 0.0006 || Math.abs(mxTarget - mx) > 0.002;
      if (settling) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = footer.getBoundingClientRect();
      px = e.clientX;
      py = e.clientY;
      mxTarget = (e.clientX - r.left) / r.width;
      wake();
    };
    const onLeave = () => {
      px = -1;
      mxTarget = 0.5;
      letters.forEach((el, i) => {
        lastH[i] = 0;
        el.style.setProperty("--h", "0");
      });
      wake();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) wake();
      },
      { threshold: 0 },
    );
    io.observe(footer);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    footer.addEventListener("pointermove", onMove, { passive: true });
    footer.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
