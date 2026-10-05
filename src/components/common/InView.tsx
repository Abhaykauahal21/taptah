"use client";

import React, { useEffect, useRef, useState } from "react";

interface InViewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
}

/**
 * Wrapper that flips `data-in-view="true"` once it scrolls into view, so
 * descendants can animate with plain CSS selectors.
 */
export const InView: React.FC<InViewProps> = ({
  threshold = 0.2,
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
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} data-in-view={inView} {...props}>
      {children}
    </div>
  );
};
