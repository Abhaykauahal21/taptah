"use client";

import React, { useEffect, useRef, useState } from "react";

interface InViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
  /**
   * Selector of a descendant to watch instead of the wrapper. Used when the
   * wrapper is much taller than the part that matters (falls back to the
   * wrapper if the descendant has no box, e.g. `display: contents`).
   */
  watch?: string;
}

/**
 * Wrapper that flips `data-in-view="true"` once it scrolls into view, so
 * descendants can animate with plain CSS selectors.
 */
export const InView: React.FC<InViewProps> = ({
  threshold = 0.2,
  watch,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    const inner = watch ? el.querySelector(watch) : null;
    observer.observe(inner && inner.getClientRects().length ? inner : el);
    return () => observer.disconnect();
  }, [threshold, watch]);

  return (
    <div ref={ref} data-in-view={inView} {...props}>
      {children}
    </div>
  );
};
