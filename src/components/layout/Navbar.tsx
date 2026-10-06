"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Search, ShoppingBag } from "lucide-react";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { NAVIGATION_LINKS } from "@/constants/navigation";
import { cart, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { CartDrawer } from "./CartDrawer";
import { ProductsMenu } from "./ProductsMenu";
import { SearchPalette } from "./SearchPalette";

/**
 * Navbar.
 *
 * - On the hero it is a roomy, transparent bar. After a little scroll it
 *   condenses into a floating, rounded capsule.
 * - It stays pinned at the top while you scroll.
 * - A highlight pill glides to whichever link you hover, and rests on the
 *   section you are currently reading (scroll-spy).
 * - On mobile the menu is a full-screen overlay with staggered links.
 */

/** Section behind each link, used to work out which one is "current". */
const SECTION_FOR: Record<string, string> = {
  Home: "hero",
  "Our Story": "story",
  Products: "flavours",
  Process: "process",
  Reviews: "testimonials",
};

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(NAVIGATION_LINKS[0].label);
  const [hover, setHover] = useState<string | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });
  const [searchOpen, setSearchOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const megaTimer = useRef(0);
  const { count, bump, open: cartOpen } = useCart();

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Scroll: condensed state and scroll-spy. One rAF.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      setScrolled(y > 40);


      // The last section whose top has passed ~40% of the viewport is current.
      let current = NAVIGATION_LINKS[0].label;
      for (const link of NAVIGATION_LINKS) {
        const id = SECTION_FOR[link.label];
        const el = id && id !== "hero" ? document.getElementById(id) : null;
        if (el && el.getBoundingClientRect().top <= vh * 0.4) current = link.label;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The highlight pill rests on the hovered link, else on the current one.
  const place = useCallback(() => {
    const target = itemRefs.current[hover ?? active];
    const list = listRef.current;
    if (!target || !list) return setPill((p) => ({ ...p, show: false }));
    const a = target.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ x: a.left - b.left, w: a.width, show: true });
  }, [hover, active]);

  useLayoutEffect(() => {
    place();
  }, [place, scrolled]);

  useEffect(() => {
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  // Mobile menu: lock the page behind it and close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = (delay = 160) => {
    window.clearTimeout(megaTimer.current);
    megaTimer.current = window.setTimeout(() => setMega(false), delay);
  };

  // Ctrl/Cmd + K opens search; Escape closes the mega menu and search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "Escape") {
        setMega(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Anything modal locks the page behind it.
  const overlay = searchOpen || cartOpen;
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen || overlay ? "hidden" : "";
  }, [menuOpen, overlay]);

  const condensed = scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          "nav-enter fixed inset-x-0 top-0 z-50 px-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6",
        )}
      >
        <div
          className={cn(
            "relative mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            condensed
              ? "mt-3 h-[60px] max-w-[1180px] rounded-full border border-cream/15 bg-[linear-gradient(180deg,rgba(62,26,13,0.94),rgba(36,14,7,0.94))] px-4 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,240,215,0.12)] sm:px-5"
              : "mt-0 h-20 max-w-[1400px] rounded-none border border-transparent bg-transparent px-2 sm:px-6 lg:h-24 lg:px-10",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Taptah home"
            className="group flex items-center gap-2.5 text-cream"
          >
            <span
              className={cn(
                "font-serif font-medium leading-none tracking-tight transition-all duration-500",
                condensed ? "text-[1.9rem] sm:text-[2.1rem]" : "text-4xl sm:text-5xl",
              )}
            >
              Taptah<span className="font-light">:</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:block" aria-label="Main Navigation">
            <ul
              ref={listRef}
              className="relative flex items-center gap-1"
              onMouseLeave={() => setHover(null)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 rounded-full bg-cream/[0.13] ring-1 ring-cream/20 transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  pill.show ? "opacity-100" : "opacity-0",
                )}
                style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
              />
              {NAVIGATION_LINKS.map((link) => {
                const isActive = link.label === active;
                return (
                  <li
                    key={link.label}
                    className="relative"
                    onMouseEnter={link.label === "Products" ? openMega : undefined}
                    onMouseLeave={link.label === "Products" ? () => closeMega() : undefined}
                  >
                    <Link
                      ref={(el) => {
                        itemRefs.current[link.label] = el;
                      }}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onMouseEnter={() => setHover(link.label)}
                      onFocus={() => {
                        setHover(link.label);
                        if (link.label === "Products") openMega();
                      }}
                      onBlur={() => {
                        setHover(null);
                        if (link.label === "Products") closeMega(250);
                      }}
                      onClick={() => setMega(false)}
                      className={cn(
                        "relative block rounded-full px-4 py-2.5 text-base font-semibold tracking-wide transition-colors duration-300",
                        isActive || hover === link.label
                          ? "text-cream"
                          : "text-cream/70",
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.label === "Products" && (
                      <ProductsMenu
                        open={mega && !menuOpen}
                        onEnter={openMega}
                        onLeave={() => closeMega()}
                        onNavigate={() => setMega(false)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search (Ctrl K)"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream sm:flex"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={cart.open}
              data-cart-target
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream/85 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <ShoppingBag
                key={`bag-${bump}`}
                className={cn("h-[18px] w-[18px]", bump > 0 && "nav-bag-bump")}
                strokeWidth={1.75}
              />
              {count > 0 && (
                <span
                  key={bump}
                  className="nav-badge absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white"
                >
                  {count}
                </span>
              )}
            </button>

            <Link
              href="#flavours"
              className="nav-cta group relative ml-1 hidden items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(180deg,#fff6e4,#f4dcb2)] px-5 py-2.5 text-[15px] font-semibold text-[#5a1020] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-6px_rgba(0,0,0,0.55)] sm:inline-flex"
            >
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Mobile menu toggle: three lines that morph into a cross */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full rounded bg-current transition-all duration-300",
                    menuOpen ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded bg-current transition-all duration-300",
                    menuOpen ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-full rounded bg-current transition-all duration-300",
                    menuOpen ? "top-1/2 -rotate-45" : "bottom-0",
                  )}
                />
              </span>
            </button>
          </div>

        </div>
      </header>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />

      {/* Mobile menu: a cream sheet in the site's own palette, big serif links,
          the flavours to add straight from the menu, and the Shop Now button. */}
      <div
        data-lenis-prevent
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[linear-gradient(180deg,#fbf0de,#f5e0c0)] px-6 pb-8 pt-[5.75rem] text-[#6B1022] transition-[opacity,visibility,clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          menuOpen
            ? "visible opacity-100 [clip-path:circle(150%_at_92%_4%)]"
            : "invisible opacity-0 [clip-path:circle(0%_at_92%_4%)]",
        )}
      >
        {/* soft colour and a faded jowar stalk behind the links */}
        <span aria-hidden="true" className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#f3c9b6]/60 blur-[70px]" />
        <span aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-24 h-64 w-64 rounded-full bg-[#ffd99a]/55 blur-[70px]" />
        <Image
          src="/images/why/jwar.png"
          alt=""
          aria-hidden="true"
          width={1151}
          height={1367}
          sizes="60vw"
          className="pointer-events-none absolute -right-10 bottom-[18%] w-[58vw] max-w-[16rem] rotate-[-8deg] opacity-[0.16] [mask-image:linear-gradient(0deg,transparent,#000_55%)]"
        />

        <nav aria-label="Mobile Navigation" className="relative">
          <ul className="flex flex-col">
            {NAVIGATION_LINKS.map((link, i) => {
              const current = link.label === active;
              return (
                <li
                  key={link.label}
                  style={{
                    transform: menuOpen ? "none" : "translateY(24px)",
                    opacity: menuOpen ? 1 : 0,
                    transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.06}s, opacity 0.6s ease-out ${0.2 + i * 0.06}s`,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className="group flex items-center gap-3 border-b border-[#6B1022]/12 py-[0.85rem]"
                  >
                    <span className="w-6 text-[13px] font-semibold italic tabular-nums text-[#6B1022]/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[2.15rem] font-semibold leading-none tracking-tight transition-transform duration-300 group-active:translate-x-1",
                        current ? "text-[#6B1022]" : "text-[#6B1022]/80",
                      )}
                    >
                      {link.label}
                    </span>
                    {current ? (
                      <span aria-hidden="true" className="ml-1 h-2 w-2 rounded-full bg-[#d9893a]" />
                    ) : null}
                    <ArrowRight className="ml-auto h-5 w-5 text-[#6B1022]/40 transition-transform duration-300 group-active:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Flavours, add straight from here */}
        <div
          className="relative mt-7"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "none" : "translateY(20px)",
            transition: "opacity 0.7s ease-out 0.65s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.65s",
          }}
        >
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/60">
            Our Flavours
          </p>
          <ul className="-mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FLAVOURS_DATA.map((f) => (
              <li
                key={f.id}
                className="flex w-[15.5rem] shrink-0 snap-start items-center gap-3 rounded-2xl bg-white/60 p-2.5 pr-3 ring-1 ring-white/80 shadow-[0_10px_22px_-14px_rgba(90,40,10,0.5)]"
              >
                <div
                  className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl"
                  style={{ background: f.tone }}
                >
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                    style={{ objectPosition: "50% 42%", transform: "scale(1.15)", transformOrigin: "50% 42%" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[1.05rem] font-semibold leading-tight">{f.name}</p>
                  <p className="text-[0.95rem] font-semibold text-[#6B1022]/70">₹{f.price}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${f.name} to cart`}
                  onClick={() => {
                    setMenuOpen(false);
                    window.setTimeout(() => cart.add(f.id), 250);
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B1022] text-cream transition-transform active:scale-90"
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative mt-auto flex flex-col gap-3 pt-8"
          style={{
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 0.7s ease-out 0.8s",
          }}
        >
          <Link
            href="#flavours"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#8a1830,#5a0e1c)] px-6 py-4 text-lg font-semibold text-cream shadow-[0_14px_26px_-12px_rgba(90,14,28,0.9)] active:scale-[0.98]"
          >
            Shop Now
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-center text-[12px] font-semibold uppercase tracking-[0.3em] text-[#6B1022]/55">
            Ancient Grain &middot; Modern Crunch
          </p>
        </div>
      </div>
    </>
  );
};
