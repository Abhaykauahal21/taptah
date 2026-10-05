"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Window outline in objectBoundingBox units (traced from the reference art). */
const WINDOW_PATH =
  "M0.1364 0.0087C0.4091 -0.0109 0.7208 0.0652 0.8766 0.2391C0.9805 0.3587 1.0000 0.5217 0.9870 0.6522C0.9740 0.7826 0.9026 0.8696 0.7987 0.9239C0.6429 0.9891 0.4610 0.9946 0.3442 0.9565C0.2013 0.9130 0.0714 0.7609 0.0260 0.5870C0.0000 0.4783 0.0130 0.3478 0.0390 0.2174C0.0519 0.1196 0.0844 0.0435 0.1364 0.0087Z";

/**
 * The "Why" artwork, built from layers in the reference artboard's own
 * coordinate space (1145 x 1374): decorative leaves and branch, a sunlit field
 * inside the cut-out window, and the jowar cut-out breaking out of it. On
 * scroll-in the window opens, the jowar rises and the leaves settle in;
 * afterwards the jowar sways.
 */
export const WhyArtwork: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="why-art relative aspect-[1145/1374] w-full"
      data-revealed={revealed}
      role="img"
      aria-label="Golden jowar millet standing in front of a sunlit field"
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="why-window-clip" clipPathUnits="objectBoundingBox">
            <path d={WINDOW_PATH} />
          </clipPath>
        </defs>
      </svg>

      {/* Decorative line-art leaves */}
      <Image
        src="/images/why/deco-leaves.webp"
        alt=""
        width={260}
        height={320}
        className="why-deco why-deco-leaves absolute left-0 top-[2.9%] w-[22.7%]"
      />
      <Image
        src="/images/why/deco-branch.webp"
        alt=""
        width={350}
        height={490}
        className="why-deco why-deco-branch absolute left-[0.9%] top-[32%] w-[30.6%]"
      />

      {/* Field inside the cut-out window */}
      <div className="why-window absolute left-[17.9%] top-0 h-[66.95%] w-[67.25%] overflow-hidden">
        <Image
          src="/images/why/bg-jwar.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 26vw, 60vw"
          className="why-field object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8e9d6]/30 via-transparent to-transparent" />
      </div>

      {/* Jowar cut-out, breaking out of the window */}
      <div className="why-jowar absolute bottom-[34%] left-[21%] w-[62%]">
        <Image
          src="/images/why/jwar.png"
          alt=""
          width={1151}
          height={1367}
          sizes="(min-width: 1024px) 24vw, 60vw"
          className="why-jowar-sway h-auto w-full drop-shadow-[0_18px_22px_rgba(90,50,20,0.25)]"
        />
      </div>
    </div>
  );
};
