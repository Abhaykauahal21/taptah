"use client";

import { useSyncExternalStore } from "react";
import { FLAVOURS_DATA } from "@/constants/flavours";

/**
 * A tiny cart store shared by the navbar, the flavour cards and the cart
 * drawer. Items persist in localStorage. `bump` changes on every add so the
 * badge can play its little animation.
 */

export interface CartItem {
  id: string;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  open: boolean;
  bump: number;
  /** Id of the flavour added most recently, so the drawer can highlight it. */
  lastAdded: string | null;
}

const KEY = "taptah-cart-v1";
export const FREE_SHIPPING_AT = 299;

const EMPTY: CartState = { items: [], open: false, bump: 0, lastAdded: null };
let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

function set(next: Partial<CartState>, persist = false) {
  state = { ...state, ...next };
  if (persist) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* storage can be unavailable (private mode); the cart still works in memory */
    }
  }
  emit();
}

function load() {
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as CartItem[];
    const items = parsed.filter(
      (i) => FLAVOURS_DATA.some((f) => f.id === i.id) && Number.isInteger(i.qty) && i.qty > 0,
    );
    state = { ...state, items };
  } catch {
    /* ignore a corrupt cart */
  }
}

export const cart = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot(): CartState {
    if (!loaded && typeof window !== "undefined") load();
    return state;
  },
  getServerSnapshot(): CartState {
    return EMPTY;
  },
  add(id: string, open = true) {
    const exists = state.items.some((i) => i.id === id);
    const items = exists
      ? state.items.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + 1, 20) } : i))
      : [...state.items, { id, qty: 1 }];
    set({ items, bump: state.bump + 1, lastAdded: id, open: open || state.open }, true);
  },
  setQty(id: string, qty: number) {
    const items =
      qty <= 0
        ? state.items.filter((i) => i.id !== id)
        : state.items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 20) } : i));
    set({ items }, true);
  },
  remove(id: string) {
    set({ items: state.items.filter((i) => i.id !== id) }, true);
  },
  open() {
    set({ open: true });
  },
  close() {
    set({ open: false });
  },
};

export function useCart() {
  const s = useSyncExternalStore(cart.subscribe, cart.getSnapshot, cart.getServerSnapshot);
  const lines = s.items.flatMap((i) => {
    const flavour = FLAVOURS_DATA.find((f) => f.id === i.id);
    return flavour ? [{ ...i, flavour }] : [];
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.flavour.price, 0);
  return { ...s, lines, count, subtotal };
}
