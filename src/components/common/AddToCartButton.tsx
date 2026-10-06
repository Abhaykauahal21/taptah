"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { cart } from "@/lib/cart";
import { cn } from "@/lib/utils";

/** "Add to Cart" for a flavour: adds one pack and opens the cart drawer. */
export const AddToCartButton: React.FC<{ id: string; className?: string }> = ({
  id,
  className,
}) => (
  <button
    type="button"
    onClick={() => cart.add(id)}
    className={cn(
      "flex flex-1 items-center justify-center gap-2 rounded-full bg-cream px-5 py-2.5 text-[15px] font-semibold text-[#5a1020] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg active:translate-y-0 active:scale-[0.97]",
      className,
    )}
  >
    <ShoppingCart className="h-4 w-4" />
    Add to Cart
  </button>
);
