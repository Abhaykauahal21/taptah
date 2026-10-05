import React from "react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  aspectRatio?: "square" | "video" | "portrait" | "wide";
  label?: string;
  className?: string;
  category?: string;
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspectRatio = "video",
  label = "Image Placeholder",
  category = "Editorial Asset",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-muted/40 p-6 text-center transition-colors",
        aspectRatios[aspectRatio],
        className
      )}
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="rounded-full bg-sand px-3 py-1 text-[11px] font-semibold tracking-widest text-secondary uppercase">
          {category}
        </span>
        <p className="font-serif text-base font-medium text-foreground/80">
          {label}
        </p>
        <span className="text-xs text-muted-foreground">
          Pending official photography
        </span>
      </div>
    </div>
  );
};
