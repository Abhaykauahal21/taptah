import React from "react";

/**
 * Static wavy top edge of the cream page content that slides up over the
 * pinned hero. The SVG is exactly as tall as the wave and sits flush on top
 * of the content, so there is no extra band, shadow or seam.
 */
export const WaveEdge: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-x-0 bottom-full block h-16 w-full text-background sm:h-24"
  >
    <path
      fill="currentColor"
      d="M0 70C180 20 360 20 560 55s380 50 560 10c120-27 220-35 320-15V121H0Z"
    />
  </svg>
);
