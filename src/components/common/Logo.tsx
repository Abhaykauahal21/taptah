import React from "react";

/**
 * The Taptah wordmark (public/logo.webp). It is used as a mask, so it takes its colour from
 * `currentColor`: Raspberry on light backgrounds, Almond Oil on dark ones.
 * Brand rule: never display it narrower than 70px.
 */
export const Logo: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ style, ...props }) => (
  <span
    role="img"
    aria-label="Taptah"
    {...props}
    style={{
      display: "block",
      aspectRatio: "2172 / 724",
      backgroundColor: "currentColor",
      WebkitMask: "url(/logo.webp) center / contain no-repeat",
      mask: "url(/logo.webp) center / contain no-repeat",
      ...style,
    }}
  />
);
