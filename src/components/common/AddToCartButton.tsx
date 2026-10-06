"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * A round thumbnail of the pack lifts off the button, arcs across the page and
 * drops into the navbar bag. Resolves when it lands.
 */
function flyToCart(from: DOMRect, to: DOMRect, image: string): Promise<void> {
  const size = 64;
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    backgroundImage: `url("${image}")`,
    backgroundSize: "135%",
    backgroundPosition: "50% 38%",
    border: "2px solid #fbf0de",
    boxShadow: "0 14px 24px -8px rgba(40,10,10,0.55)",
    zIndex: "9999",
    pointerEvents: "none",
    willChange: "transform, opacity",
  });
  document.body.appendChild(el);

  const sx = from.left + from.width / 2 - size / 2;
  const sy = from.top + from.height / 2 - size / 2;
  const ex = to.left + to.width / 2 - size / 2;
  const ey = to.top + to.height / 2 - size / 2;
  // Control point of the arc: well above both ends.
  const cx = (sx + ex) / 2;
  const cy = Math.min(sy, ey) - 140;

  const frames: Keyframe[] = [];
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const k = easeInOut(t);
    const x = (1 - k) * (1 - k) * sx + 2 * (1 - k) * k * cx + k * k * ex;
    const y = (1 - k) * (1 - k) * sy + 2 * (1 - k) * k * cy + k * k * ey;
    // Pops up a touch at the start, then shrinks into the bag.
    const scale = t < 0.15 ? 0.6 + (t / 0.15) * 0.55 : 1.15 - 0.95 * easeInOut((t - 0.15) / 0.85);
    frames.push({
      transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${k * 300}deg)`,
      opacity: t > 0.92 ? 1 - (t - 0.92) / 0.08 : 1,
      offset: t,
    });
  }

  return new Promise((resolve) => {
    const anim = el.animate(frames, { duration: 820, easing: "linear", fill: "forwards" });
    const done = () => {
      el.remove();
      resolve();
    };
    anim.onfinish = done;
    anim.oncancel = done;
  });
}

/**
 * "Add to Cart" for a flavour. With an `image`, a thumbnail of the pack flies
 * into the navbar bag; the bag bumps, the item is added, then the drawer opens.
 */
export const AddToCartButton: React.FC<{ id: string; image?: string; className?: string }> = ({
  id,
  image,
  className,
}) => {
  const [added, setAdded] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return;
    const target = document.querySelector<HTMLElement>("[data-cart-target]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!image || !target || reduce || typeof Element.prototype.animate !== "function") {
      cart.add(id);
      return;
    }

    busy.current = true;
    setAdded(true);
    await flyToCart(e.currentTarget.getBoundingClientRect(), target.getBoundingClientRect(), image);
    cart.add(id, false); // bumps the badge and the bag
    timers.current.push(window.setTimeout(() => cart.open(), 320));
    timers.current.push(
      window.setTimeout(() => {
        setAdded(false);
        busy.current = false;
      }, 1500),
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-1 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97]",
        added ? "bg-[#fbe7b8] text-[#5a1020]" : "bg-cream text-[#5a1020] hover:bg-white",
        className,
      )}
    >
      <span className={cn("flex items-center gap-2 transition-all duration-300", added && "-translate-y-6 opacity-0")}>
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </span>
      <span
        aria-hidden={!added}
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
          added ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
        Added
      </span>
    </button>
  );
};
