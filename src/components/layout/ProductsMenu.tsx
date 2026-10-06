"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Truck } from "lucide-react";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { FREE_SHIPPING_AT, cart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/** More rows than this and the list scrolls (with a fade) instead of growing. */
const VISIBLE_ROWS = 4;

/**
 * The "Products" dropdown. A compact list that hangs under the Products link:
 * one row per flavour (thumbnail, name, tagline, price, quick add). It scales
 * to any number of products, because the list scrolls past a few rows.
 * Hover-safe: an invisible bridge joins it to the bar.
 */
export const ProductsMenu: React.FC<{
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onNavigate: () => void;
}> = ({ open, onEnter, onLeave, onNavigate }) => {
  const scrolls = FLAVOURS_DATA.length > VISIBLE_ROWS;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "absolute left-1/2 top-full z-10 w-[min(400px,94vw)] -translate-x-1/2 pt-4 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0 [transition-delay:0s,0s,0.3s]",
      )}
    >
      <div
        className="relative origin-top rounded-[22px] border border-cream/15 bg-[linear-gradient(180deg,rgba(62,26,13,0.97),rgba(34,13,6,0.97))] p-2.5 shadow-[0_26px_50px_-18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,240,215,0.12)]"
        style={{
          transform: open ? "scale(1)" : "scale(0.96)",
          transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Little notch pointing up at the Products link */}
        <span
          aria-hidden="true"
          className="absolute -top-[7px] left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-[3px] border-l border-t border-cream/15 bg-[#3e1a0d]"
        />

        <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-cream/55">
            Our Flavours
            <span className="rounded-full bg-cream/10 px-1.5 py-px text-[11px] tracking-normal text-cream/80">
              {FLAVOURS_DATA.length}
            </span>
          </p>
          <Link
            href="#flavours"
            onClick={onNavigate}
            tabIndex={open ? 0 : -1}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cream/90 transition-colors hover:text-cream"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul
          data-lenis-prevent
          className={cn(
            "space-y-1 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-color:rgba(255,240,215,0.25)_transparent] [scrollbar-width:thin]",
            scrolls && "max-h-[19.5rem] [mask-image:linear-gradient(180deg,#000_calc(100%-28px),transparent)] pb-5",
          )}
        >
          {FLAVOURS_DATA.map((f, i) => (
            <li
              key={f.id}
              className="group/row relative flex items-center gap-3 rounded-2xl p-1.5 pr-2 transition-colors duration-300 hover:bg-cream/[0.09]"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(10px)",
                transition: `opacity 0.45s ease-out ${0.06 + i * 0.06}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${0.06 + i * 0.06}s, background-color 0.3s`,
              }}
            >
              {/* Whole row is the link; the + button sits above it */}
              <Link
                href="#flavours"
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
                aria-label={`${f.name}, ${f.tagline}`}
                className="absolute inset-0 z-0 rounded-2xl"
              />

              <div
                className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl ring-1 ring-cream/15"
                style={{ background: f.theme.to }}
              >
                <Image
                  src={f.image}
                  alt=""
                  fill
                  sizes="60px"
                  className="object-cover object-[50%_44%] transition-transform duration-500 group-hover/row:scale-110"
                />
              </div>

              <div className="relative z-[1] min-w-0 flex-1 pointer-events-none">
                <p className="flex items-center gap-2 text-[1.05rem] font-semibold leading-tight text-cream">
                  <span className="truncate">{f.name}</span>
                  {f.badge && (
                    <span className="shrink-0 rounded-full bg-[#f6c46c] px-1.5 py-px text-[10px] font-bold uppercase tracking-wider text-[#5a1020]">
                      {f.badge}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 truncate text-sm text-cream/75">{f.tagline}</p>
              </div>

              <p className="relative z-[1] pointer-events-none text-[1.05rem] font-semibold tabular-nums text-cream">
                ₹{f.price}
              </p>

              <button
                type="button"
                aria-label={`Add ${f.name} to cart`}
                tabIndex={open ? 0 : -1}
                onClick={() => cart.add(f.id)}
                className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-[#5a1020] shadow-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
              >
                <Plus className="h-[18px] w-[18px]" />
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-cream/[0.06] px-3 py-2 text-[13px] font-medium text-cream/80">
          <Truck className="h-3.5 w-3.5 text-[#f6c46c]" />
          Free delivery on orders over ₹{FREE_SHIPPING_AT}
        </p>
      </div>
    </div>
  );
};
