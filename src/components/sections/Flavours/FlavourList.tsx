"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The flavour cards. From md up they sit in a three-column grid. On phones
 * they become a swipeable carousel that snaps card by card, with the next
 * card peeking in, the centred card in focus, and dots to jump between them.
 */
export const FlavourList: React.FC<{ children: React.ReactNode; labels: string[] }> = ({
  children,
  labels,
}) => {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const slides = React.Children.toArray(children);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    if (!first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    const i = Math.round(el.scrollLeft / step);
    setActive(Math.max(0, Math.min(slides.length - 1, i)));
    if (el.scrollLeft > 8) setTouched(true);
  }, [slides.length]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (!el || !target) return;
    el.scrollTo({
      left: target.offsetLeft - (el.clientWidth - target.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={track}
        data-active={active}
        onScroll={onScroll}
        className="flavour-track -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[15%] py-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:px-[24%] md:mx-auto md:mt-10 md:grid md:max-w-[1040px] md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:py-0 lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((child, i) => (
          <div
            key={i}
            className="flavour-slide w-[70%] shrink-0 snap-center sm:w-[52%] md:w-auto"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Phones: position dots and a swipe hint */}
      <div className="-mt-2 flex flex-col items-center gap-3 md:hidden">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a flavour">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={label}
              onClick={() => go(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                i === active ? "w-8 bg-[#6B1022]" : "w-2 bg-[#6B1022]/25",
              )}
            />
          ))}
        </div>
        <p
          aria-hidden="true"
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.3em] text-[#6B1022]/55 transition-opacity duration-500",
            touched ? "opacity-0" : "opacity-100",
          )}
        >
          Swipe to explore
        </p>
      </div>
    </>
  );
};
