"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { FLAVOUR_BADGES } from "@/constants/flavours";
import { cart } from "@/lib/cart";
import { FlavourItem } from "@/types";

/**
 * Phones: the ingredients open as a bottom sheet that slides up over the page
 * (the card itself is too small to hold the list). It has its own scroll, a
 * pack thumbnail, the list written in line by line, and Add to Cart pinned at
 * the bottom. Drag the top down, tap outside, press Esc or use the cross to close.
 */
export const IngredientsSheet: React.FC<{
  flavour: FlavourItem;
  open: boolean;
  onClose: () => void;
}> = ({ flavour, open, onClose }) => {
  // `visible` keeps the sheet in the DOM while it slides back down; `shown` drives the slide.
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const mounted = open || visible;
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);

  // It mounts with `open`, then slides in on the next frames. On close it slides
  // out first and unmounts once that has finished.
  useEffect(() => {
    let raf = 0;
    let raf2 = 0;
    let t1 = 0;
    let t2 = 0;
    if (open) {
      raf = requestAnimationFrame(() => {
        setVisible(true);
        raf2 = requestAnimationFrame(() => setShown(true));
      });
    } else {
      t1 = window.setTimeout(() => setShown(false), 0);
      t2 = window.setTimeout(() => setVisible(false), 600);
    }
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  // Page behind stays put while the sheet is up; Esc closes.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    drag.current = { y: e.touches[0].clientY, dy: 0 };
    if (panel.current) panel.current.style.transition = "none";
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag.current || !panel.current) return;
    const dy = Math.max(0, e.touches[0].clientY - drag.current.y);
    drag.current.dy = dy;
    panel.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!panel.current) return;
    panel.current.style.transition = "";
    panel.current.style.transform = "";
    if (d && d.dy > 100) onClose();
  };

  const addToCart = () => {
    onClose();
    // Let the sheet slide away first, then the bag fills and the cart opens.
    window.setTimeout(() => cart.add(flavour.id), 380);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${flavour.name} ingredients`}
      data-open={shown}
      className="flavour-sheet fixed inset-0 z-[90] md:hidden"
    >
      <button
        type="button"
        aria-label="Close ingredients"
        tabIndex={-1}
        onClick={onClose}
        className={
          "absolute inset-0 bg-[#1a0904]/55 backdrop-blur-[3px] transition-opacity duration-500 " +
          (shown ? "opacity-100" : "opacity-0")
        }
      />

      <div
        ref={panel}
        className={
          "absolute inset-x-0 bottom-0 flex max-h-[86dvh] flex-col overflow-hidden rounded-t-[28px] text-[#3a2018] shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.55)] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (shown ? "translate-y-0" : "translate-y-full")
        }
        style={{ background: `linear-gradient(180deg, #fffaf0, ${flavour.tone})`, "--accent": flavour.accentColor } as React.CSSProperties}
      >
        {/* Grab handle and header: drag down to dismiss */}
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="touch-none">
          <div className="flex justify-center pb-1 pt-3">
            <span className="h-1.5 w-11 rounded-full bg-[#6B1022]/25" />
          </div>
          <div className="flavour-ing-head flex items-center gap-4 px-5 pb-3 pt-2">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_18px_-8px_rgba(60,28,12,0.6)] ring-1 ring-black/5">
              <Image
                src={flavour.image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                style={{ objectPosition: "50% 42%", transform: "scale(1.15)", transformOrigin: "50% 42%" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                Ingredients
              </p>
              <p className="mt-1 truncate text-[1.7rem] font-semibold leading-none text-[#6B1022]">{flavour.name}</p>
              <svg viewBox="0 0 120 8" className="mt-2 h-2 w-28" fill="none" aria-hidden="true">
                <path
                  d="M2 5C16 1 28 7 42 4s26-3 40 0 24 2 36-1"
                  pathLength={1}
                  stroke="var(--accent)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="flavour-ing-squiggle"
                />
              </svg>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close ingredients"
              className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-full border border-[#6B1022]/25 text-[#6B1022] active:bg-[#6B1022] active:text-cream"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <ol
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {flavour.ingredients.map((ing, i) => (
            <li
              key={ing.name}
              className="flavour-ing-row relative grid grid-cols-[2rem_1fr] items-baseline py-3"
              style={{ "--k": i } as React.CSSProperties}
            >
              <span className="text-sm font-semibold italic tabular-nums text-[color:var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="leading-snug">
                <span className="block text-[1.12rem] font-semibold text-[#2f1a12]">{ing.name}</span>
                <span className="mt-0.5 block text-[0.95rem] italic text-[#7a5a48]">{ing.note}</span>
              </p>
            </li>
          ))}
        </ol>

        {/* Pinned footer: badges and Add to Cart */}
        <div className="border-t border-[#6B1022]/15 bg-[#fffaf0]/85 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
          <p className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B1022]/80">
            {FLAVOUR_BADGES.map((b, i) => (
              <React.Fragment key={b.id}>
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />}
                {b.label}
              </React.Fragment>
            ))}
          </p>
          <button
            type="button"
            onClick={addToCart}
            className="flex w-full items-center justify-between rounded-full bg-[linear-gradient(180deg,#8a1830,#5a0e1c)] py-3.5 pl-6 pr-6 text-[1.05rem] font-semibold text-cream shadow-[0_12px_24px_-12px_rgba(90,14,28,0.9)] active:scale-[0.98]"
          >
            <span>Add to Cart</span>
            <span className="tabular-nums">&#8377;{flavour.price}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
