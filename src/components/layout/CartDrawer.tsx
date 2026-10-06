"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Truck, X } from "lucide-react";
import { FREE_SHIPPING_AT, cart, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/** Slide-in cart. Opens from the navbar bag icon or any "Add to Cart" button. */
export const CartDrawer: React.FC = () => {
  const { open, lines, count, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const left = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  return (
    <div
      className={cn("fixed inset-0 z-[70]", open ? "visible" : "invisible delay-500")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={open ? 0 : -1}
        onClick={cart.close}
        className={cn(
          "absolute inset-0 bg-[#1a0904]/55 transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        data-lenis-prevent
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(430px,100vw)] flex-col bg-[linear-gradient(180deg,#fbf0de,#f6e3c6)] text-[#4a3a33] shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-[#6B1022]/12 px-6 py-5">
          <div>
            <h2 className="text-[1.7rem] font-semibold leading-none text-[#6B1022]">Your Cart</h2>
            <p className="mt-1 text-sm font-medium text-[#8a6a5a]">
              {count === 0 ? "Nothing here yet" : `${count} ${count === 1 ? "pack" : "packs"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={cart.close}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1022] transition-colors hover:bg-[#6B1022]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {lines.length > 0 && (
          <div className="border-b border-[#6B1022]/10 px-6 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#6B1022]">
              <Truck className="h-4 w-4" />
              {left === 0
                ? "You've unlocked free delivery!"
                : `Add ₹${left} more for free delivery`}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#6B1022]/12">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d9893a] to-[#6B1022] transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Image
                src="/images/why/pop-jwaar-1.png"
                alt=""
                aria-hidden="true"
                width={140}
                height={113}
                className="h-auto w-28 opacity-90 drop-shadow-[0_10px_8px_rgba(60,30,10,0.25)]"
              />
              <p className="mt-5 text-xl font-semibold text-[#6B1022]">Your cart is empty</p>
              <p className="mt-1 max-w-[16rem] text-[0.95rem] font-medium">
                Pick a flavour and we&apos;ll pop it in.
              </p>
              <Link
                href="#flavours"
                onClick={cart.close}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#6B1022]/60 px-6 py-2.5 font-semibold text-[#6B1022] transition-colors hover:bg-[#6B1022] hover:text-cream"
              >
                Explore flavours
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ id, qty, flavour }) => (
                <li
                  key={id}
                  className="flex gap-4 rounded-2xl bg-white/55 p-3 ring-1 ring-white/70"
                >
                  <div
                    className="relative h-[92px] w-[76px] shrink-0 overflow-hidden rounded-xl"
                    style={{ background: flavour.theme.to }}
                  >
                    <Image
                      src={flavour.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover object-[50%_8%]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[1.1rem] font-semibold leading-tight text-[#6B1022]">
                          {flavour.name}
                        </p>
                        <p className="truncate text-sm font-medium text-[#8a6a5a]">
                          {flavour.tagline}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${flavour.name}`}
                        onClick={() => cart.remove(id)}
                        className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8a6a5a] transition-colors hover:bg-[#6B1022]/10 hover:text-[#6B1022]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-[#6B1022]/25 bg-white/60">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => cart.setQty(id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B1022] transition-colors hover:bg-[#6B1022]/10"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-[0.95rem] font-semibold tabular-nums text-[#6B1022]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => cart.setQty(id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B1022] transition-colors hover:bg-[#6B1022]/10"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-lg font-semibold tabular-nums text-[#6B1022]">
                        ₹{qty * flavour.price}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-[#6B1022]/12 bg-[#fbf0de]/80 px-6 pb-6 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-[#6B1022]">Subtotal</span>
              <span className="text-2xl font-semibold tabular-nums text-[#6B1022]">₹{subtotal}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#8a6a5a]">
              Taxes included. {left === 0 ? "Delivery is free." : "Delivery calculated at checkout."}
            </p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#8a1830,#5a0e1c)] px-6 py-3.5 text-[1.05rem] font-semibold text-cream shadow-[0_10px_24px_-10px_rgba(90,14,28,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(90,14,28,0.9)]"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={cart.close}
              className="mt-2 w-full py-2 text-sm font-semibold text-[#6B1022]/80 transition-colors hover:text-[#6B1022]"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};
