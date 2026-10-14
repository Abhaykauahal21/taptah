"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, X } from "lucide-react";
import { cart, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/** Slide-in cart. Opens from the navbar bag icon or any "Add to Cart" button. */
export const CartDrawer: React.FC = () => {
  const { open, lines, count, lastAdded, bump } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
          "absolute inset-0 bg-[#1a0904]/55 backdrop-blur-[3px] transition-opacity duration-500",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        data-lenis-prevent
        data-open={open}
        className={cn(
          "cart-drawer absolute inset-y-0 right-0 flex w-[min(430px,100vw)] flex-col bg-[linear-gradient(180deg,#F7F4D4,#ECE8B0)] text-[#082567] rounded-l-[28px] shadow-[-24px_0_60px_-20px_rgba(0,0,0,0.5)] transition-transform duration-[750ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="cart-reveal flex items-center justify-between border-b border-[#C8154B]/12 px-6 py-5" style={{ "--i": 0 } as React.CSSProperties}>
          <div>
            <h2 className="text-[1.7rem] font-semibold leading-none text-[#C8154B]">Your Cart</h2>
            <p className="mt-1 text-sm font-medium text-[#8a6a5a]">
              {count === 0 ? "Nothing here yet" : `${count} ${count === 1 ? "pack" : "packs"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={cart.close}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#C8154B] transition-colors hover:bg-[#C8154B]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Image
                src="/images/why/pop-jwaar-1.webp"
                alt=""
                aria-hidden="true"
                width={140}
                height={113}
                className="cart-empty-art h-auto w-28 drop-shadow-[0_10px_8px_rgba(60,30,10,0.25)]"
              />
              <p className="cart-reveal mt-5 text-xl font-semibold text-[#C8154B]" style={{ "--i": 3 } as React.CSSProperties}>Your cart is empty</p>
              <p className="cart-reveal mt-1 max-w-[16rem] text-[0.95rem] font-medium" style={{ "--i": 4 } as React.CSSProperties}>
                Pick a flavour and we&apos;ll pop it in.
              </p>
              <Link
                href="/products"
                onClick={cart.close}
                style={{ "--i": 5 } as React.CSSProperties}
                className="cart-reveal mt-6 inline-flex items-center gap-2 rounded-full border border-[#C8154B]/60 px-6 py-2.5 font-semibold text-[#C8154B] transition-colors hover:bg-[#C8154B] hover:text-cream"
              >
                Explore flavours
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map(({ id, qty, flavour }, n) => (
                <li
                  key={id}
                  className="cart-reveal relative flex gap-4 overflow-hidden rounded-2xl bg-white/55 p-3 ring-1 ring-white/70"
                  style={{ "--i": n + 2 } as React.CSSProperties}
                >
                  {id === lastAdded && (
                    <span key={bump} aria-hidden="true" className="cart-flash pointer-events-none absolute inset-0" />
                  )}
                  <div
                    className="relative h-[92px] w-[76px] shrink-0 overflow-hidden rounded-xl"
                    style={{ background: flavour.theme.to }}
                  >
                    <Image
                      src={flavour.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover object-[50%_44%]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[1.1rem] font-semibold leading-tight text-[#C8154B]">
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
                        className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8a6a5a] transition-colors hover:bg-[#C8154B]/10 hover:text-[#C8154B]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-start pt-2">
                      <div className="flex items-center rounded-full border border-[#C8154B]/25 bg-white/60">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => cart.setQty(id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#C8154B] transition-colors hover:bg-[#C8154B]/10"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span key={qty} className="cart-pop w-6 text-center text-[0.95rem] font-semibold tabular-nums text-[#C8154B]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => cart.setQty(id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#C8154B] transition-colors hover:bg-[#C8154B]/10"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="cart-reveal border-t border-[#C8154B]/12 bg-[#F7F4D4]/80 px-6 pb-6 pt-4" style={{ "--i": lines.length + 2 } as React.CSSProperties}>
            <button
              type="button"
              className="cart-checkout relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(180deg,#8a1830,#5a0e1c)] px-6 py-3.5 text-[1.05rem] font-semibold text-cream shadow-[0_10px_24px_-10px_rgba(90,14,28,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(90,14,28,0.9)]"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={cart.close}
              className="mt-2 w-full py-2 text-sm font-semibold text-[#C8154B]/80 transition-colors hover:text-[#C8154B]"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};
