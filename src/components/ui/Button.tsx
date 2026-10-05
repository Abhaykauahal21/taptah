import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-cream hover:bg-primary/90 shadow-sm active:scale-[0.98]",
    secondary:
      "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm active:scale-[0.98]",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-cream active:scale-[0.98]",
    ghost:
      "text-primary hover:bg-muted/50",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-full uppercase tracking-wider",
    md: "h-11 px-6 text-sm rounded-full uppercase tracking-widest",
    lg: "h-13 px-8 text-base rounded-full uppercase tracking-widest",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
