"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";

export interface ScrollAnimationOptions {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

/**
 * Hook to quickly bind GSAP ScrollTrigger timelines to component refs
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animationCallback: (
    element: T,
    gsapInstance: typeof gsap,
    options?: ScrollAnimationOptions
  ) => void | gsap.core.Timeline,
  deps: unknown[] = [],
  options?: ScrollAnimationOptions
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        animationCallback(containerRef.current, gsap, options);
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
