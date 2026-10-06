"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth, inertial scrolling with Lenis for the whole page.
 *
 * - Paused while the loader is up (`<html data-loading>`), then released.
 * - In-page `#anchor` links glide to their section instead of jumping
 *   (the sticky navbar's height is accounted for).
 * - Skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;

    // Touch screens already scroll with native inertia on the compositor;
    // running Lenis there only adds a per-frame JS loop and scroll handlers.
    if (window.matchMedia("(pointer: coarse)").matches) {
      const onTouchClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0) return;
        const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='#']");
        if (!a) return;
        const url = new URL(a.href, window.location.href);
        if (url.pathname !== window.location.pathname || url.origin !== window.location.origin) return;
        const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
        if (!target && url.hash) return;
        e.preventDefault();
        e.stopPropagation();
        const top = target ? target.getBoundingClientRect().top + window.scrollY - 64 : 0;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", url.hash || window.location.pathname);
      };
      document.addEventListener("click", onTouchClick, true);
      return () => document.removeEventListener("click", onTouchClick, true);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    const sync = () => {
      if (root.hasAttribute("data-loading")) lenis.stop();
      else lenis.start();
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-loading"] });

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.origin !== window.location.origin) return;
      const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
      if (!target && url.hash) return;
      // Capture phase + stopPropagation: Next's <Link> would otherwise jump to the hash itself.
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target ?? 0, { offset: target ? -64 : 0, duration: 1.6 });
      history.replaceState(null, "", url.hash || window.location.pathname);
    };
    document.addEventListener("click", onClick, true);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
