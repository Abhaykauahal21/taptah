"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/**
 * The "Products" mega-menu: the three flavours as little cards you can add
 * straight to the cart. Hover-safe: an invisible bridge joins it to the bar.
 */
export const ProductsMenu: React.FC<{
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onNavigate: () => void;
}> = ({ open, onEnter, onLeave, onNavigate }) => (
  <div
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    className={cn(
      "absolute left-1/2 top-full z-10 w-[min(880px,94vw)] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
      open
        ? "visible translate-y-0 opacity-100"
        : "invisible -translate-y-2 opacity-0 delay-100 [transition-delay:0s,0s,0.3s]",
    )}
  >
    <div
      className="origin-top rounded-[28px] border border-cream/15 bg-[linear-gradient(180deg,rgba(62,26,13,0.97),rgba(34,13,6,0.97))] p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,240,215,0.12)]"
      style={{ transform: open ? "scale(1)" : "scale(0.97)", transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}
    >
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cream/55">
          Our Flavours
        </p>
        <Link
          href="#flavours"
          onClick={onNavigate}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cream/85 transition-colors hover:text-cream"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {FLAVOURS_DATA.map((f, i) => (
          <li
            key={f.id}
            className="group relative overflow-hidden rounded-2xl"
            style={{
              background: f.theme.to,
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(14px)",
              transition: `opacity 0.5s ease-out ${0.08 + i * 0.07}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.07}s`,
            }}
          >
            <Link href="#flavours" onClick={onNavigate} className="block" tabIndex={open ? 0 : -1}>
              <div className="relative aspect-[4/3.1] overflow-hidden">
                <Image
                  src={f.image}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover object-[50%_10%] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
              <div className="p-3.5 pr-14 text-cream">
                <p className="text-[1.15rem] font-semibold leading-tight">{f.name}</p>
                <p className="mt-0.5 text-sm text-cream/70">{f.tagline}</p>
                <p className="mt-2 text-lg font-semibold">₹{f.price}</p>
              </div>
            </Link>
            <button
              type="button"
              aria-label={`Add ${f.name} to cart`}
              tabIndex={open ? 0 : -1}
              onClick={() => cart.add(f.id)}
              className="absolute bottom-3.5 right-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-[#5a1020] shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
