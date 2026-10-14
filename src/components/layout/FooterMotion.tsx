"use client";

import { useEffect } from "react";

/**
 * Drives the footer's scroll- and pointer-linked effects. Renders nothing.
 *
 * Published as CSS variables on the elements that use them (CSS does all of
 * the visual work):
 *   --fp   0 -> 1 as the footer scrolls into view (sun rises, valley dollies in,
 *          the wordmark fans into place)
 *   --mx   pointer x across the footer, 0..1 (jowar leans away from the cursor)
 * and, per wordmark letter, `--h` (0..1): how close the cursor is, so the
 * letters near it lift and glow.
 *
 * Kept deliberately cheap: the footer's box is measured only when the layout
 * changes (never per frame, which would force a layout), the variables are
 * written only to the few elements that read them, and nothing runs while the
 * footer is off screen. `data-live` lets CSS pause every footer animation too.
 */
export function FooterMotion() {
  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;

    // Lets CSS pause every footer animation while it is off screen.
    const live = new IntersectionObserver(
      ([e]) => footer.setAttribute("data-live", String(e.isIntersecting)),
      { rootMargin: "80px 0px" },
    );
    live.observe(footer);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => live.disconnect();
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const fx = Array.from(
      footer.querySelectorAll<HTMLElement>(
        ".footer-dawn, .footer-rays, .footer-sundisc, .footer-valley, .footer-jowar, .footer-word span",
      ),
    );
    const setVar = (name: string, value: string) => fx.forEach((el) => el.style.setProperty(name, value));
    const letters = Array.from(footer.querySelectorAll<HTMLElement>(".footer-word span"));

    let visible = false;
    let raf = 0;
    let px = -1;
    let py = -1;
    let mx = 0.5;
    let mxTarget = 0.5;
    let fp = 0;
    let shownFp = -1;
    let shownMx = -1;
    const lastH = letters.map(() => 0);

    // Footer box in page coordinates, measured on layout changes only.
    let top = 0;
    let left = 0;
    let width = 1;
    let height = 1;
    const measure = () => {
      const r = footer.getBoundingClientRect();
      top = r.top + window.scrollY;
      left = r.left;
      width = r.width || 1;
      height = r.height || 1;
    };
    measure();

    const frame = () => {
      raf = 0;
      if (!visible) return;
      const vh = window.innerHeight;
      const target = Math.min(1, Math.max(0, (vh - (top - window.scrollY)) / height));
      fp += (target - fp) * 0.18;
      mx += (mxTarget - mx) * 0.08;
      if (Math.abs(fp - shownFp) > 0.002) {
        setVar("--fp", fp.toFixed(3));
        shownFp = fp;
      }
      if (Math.abs(mx - shownMx) > 0.004) {
        setVar("--mx", mx.toFixed(3));
        shownMx = mx;
      }

      // Wordmark letters react to the cursor
      if (fine && letters.length && px >= 0) {
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
      px = e.clientX;
      py = e.clientY;
      mxTarget = (e.clientX - left) / width;
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
        if (visible) {
          measure();
          wake();
        }
      },
      { threshold: 0 },
    );
    io.observe(footer);

    // Anything above the footer changing size moves it: measure again.
    let measureTimer = 0;
    const remeasure = () => {
      window.clearTimeout(measureTimer);
      measureTimer = window.setTimeout(() => {
        measure();
        wake();
      }, 120);
    };
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    ro.observe(footer);

    window.addEventListener("scroll", wake, { passive: true });
    if (fine) {
      footer.addEventListener("pointermove", onMove, { passive: true });
      footer.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(measureTimer);
      live.disconnect();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", wake);
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
