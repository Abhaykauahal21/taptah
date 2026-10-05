"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import { NAVIGATION_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLabel, setActiveLabel] = useState(NAVIGATION_LINKS[0].label);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "nav-enter fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen
          ? "bg-[#2a1209]/95 shadow-lg shadow-black/10"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Taptah home"
          className="font-serif text-3xl font-medium leading-none tracking-tight text-cream transition-opacity hover:opacity-90 sm:text-4xl"
        >
          Taptah<span className="font-light">:</span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main Navigation"
        >
          {NAVIGATION_LINKS.map((link) => {
            const isActive = link.label === activeLabel;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActiveLabel(link.label)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative pb-1.5 text-[15px] font-semibold tracking-wide transition-colors hover:text-cream",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-cream after:transition-transform after:duration-300",
                  isActive
                    ? "text-cream after:scale-x-100"
                    : "text-cream/85 after:scale-x-0 hover:after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Search"
            className="hidden p-2 text-cream/90 transition-colors hover:text-cream sm:block"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className="relative p-2 text-cream/90 transition-colors hover:text-cream"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              1
            </span>
          </button>
          <Link
            href="#flavours"
            className="hidden items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-[15px] font-semibold text-maroon shadow-md transition-all duration-300 hover:bg-white hover:shadow-lg sm:inline-flex"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="p-2 text-cream lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-cream/10 px-6 pb-8 pt-4 lg:hidden"
          aria-label="Mobile Navigation"
        >
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => {
                setActiveLabel(link.label);
                setIsMobileMenuOpen(false);
              }}
              className="py-2.5 text-xl font-medium text-cream/90 transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#flavours"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-2.5 text-base font-semibold text-maroon"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      )}
    </header>
  );
};
