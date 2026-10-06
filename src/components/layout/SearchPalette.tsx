"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search, X } from "lucide-react";
import { FLAVOURS_DATA } from "@/constants/flavours";
import { NAVIGATION_LINKS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

/** Command-palette style search. Opens from the navbar, or with Ctrl/Cmd + K. */

interface Entry {
  label: string;
  hint: string;
  href: string;
  group: "Jump to" | "Flavours";
}

const ENTRIES: Entry[] = [
  ...NAVIGATION_LINKS.filter((l) => l.label !== "FAQs").map((l) => ({
    label: l.label,
    hint: "Section",
    href: l.href,
    group: "Jump to" as const,
  })),
  ...FLAVOURS_DATA.map((f) => ({
    label: f.name,
    hint: `${f.tagline}  ·  ₹${f.price}`,
    href: "#flavours",
    group: "Flavours" as const,
  })),
  { label: "Contact us", hint: "hello@taptah.com", href: "mailto:hello@taptah.com", group: "Jump to" },
];

export const SearchPalette: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? ENTRIES.filter((e) => (e.label + " " + e.hint).toLowerCase().includes(q))
      : ENTRIES;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  // Reset when it closes, so it always opens fresh.
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) {
      setQuery("");
      setIndex(0);
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      itemRefs.current[index]?.click();
    }
  };

  return (
    <div
      className={cn("fixed inset-0 z-[70]", open ? "visible" : "invisible delay-300")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#1a0904]/55 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onKeyDown={onKeyDown}
        data-lenis-prevent
        className={cn(
          "absolute left-1/2 top-[13vh] w-[min(620px,92vw)] -translate-x-1/2 overflow-hidden rounded-3xl border border-cream/15 bg-[linear-gradient(180deg,#3e1a0d,#240e07)] text-cream shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 border-b border-cream/12 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-cream/60" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Search flavours, sections…"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent text-xl font-medium text-cream placeholder:text-cream/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-4 py-10 text-center text-cream/55">
              Nothing matches &ldquo;{query}&rdquo;
            </li>
          )}
          {results.map((r, i) => {
            const header = i === 0 || results[i - 1].group !== r.group ? r.group : null;
            return (
              <React.Fragment key={r.group + r.label}>
                {header && (
                  <li
                    aria-hidden="true"
                    className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream/40"
                  >
                    {header}
                  </li>
                )}
                <li role="option" aria-selected={i === index}>
                  <a
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    href={r.href}
                    onClick={onClose}
                    onMouseMove={() => setIndex(i)}
                    className={cn(
                      "flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors",
                      i === index ? "bg-cream/12" : "bg-transparent",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[1.1rem] font-semibold">{r.label}</span>
                      <span className="block truncate text-sm text-cream/55">{r.hint}</span>
                    </span>
                    {i === index && <CornerDownLeft className="h-4 w-4 shrink-0 text-cream/60" />}
                  </a>
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-cream/10 px-5 py-3 text-xs font-medium text-cream/45">
          <span>↑ ↓ to move &nbsp;·&nbsp; Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
