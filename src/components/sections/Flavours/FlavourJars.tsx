"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, Sparkles, Wheat } from "lucide-react";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { JAR_PRODUCTS } from "@/constants/flavours";
import { createJarSpin } from "./jarSpin";

/** Facets the jar's wrap-around label is cut into; more = rounder silhouette. */
const FACETS = 36;
/** The far wall seen through the glass needs far fewer. */
const BACK_FACETS = 12;

interface Jar {
  id: string;
  name: string;
  /** the big outlined word behind the jar */
  word: string;
  line: string;
  tag: string;
  /** arch gradient, picked to contrast with the label colour */
  from: string;
  to: string;
  /** text and outline colour on the arch */
  on: string;
  /** what you see of the label through the glass at the back of the jar */
  paper: string;
}

const JARS: Jar[] = [
  { id: "butter-salt", name: "Butter Salt", word: "Butter", line: "Creamy, golden and classic.", tag: "The Classic", from: "#9a1d47", to: "#4d0b25", on: "#fbe7b0", paper: "#e8d58a" },
  { id: "peri-peri", name: "Peri Peri", word: "Peri", line: "Hot, tangy and bold.", tag: "The Fiery One", from: "#ffd9b3", to: "#f29a6a", on: "#8f1d1a", paper: "#7d1a17" },
  { id: "italian-herbs", name: "Italian Herbs", word: "Herbs", line: "Oregano, basil and calm.", tag: "The Herby One", from: "#d8efcf", to: "#8fcb9e", on: "#1e4d2b", paper: "#1b4426" },
  { id: "tangy-pudina", name: "Tangy Pudina", word: "Pudina", line: "Cool mint, zesty kick.", tag: "The Fresh One", from: "#35683a", to: "#183d22", on: "#e7f3b8", paper: "#709a35" },
];

/** [left %, top %, size scale, drift x, drift y, rotation] */
const PUFFS = [
  ["-2%", "20%", 1, "-14px", "-22px", "-12deg"],
  ["86%", "38%", 0.8, "16px", "-18px", "14deg"],
  ["4%", "64%", 0.65, "-10px", "14px", "6deg"],
] as const;

const PERKS = [
  { icon: Wheat, label: "Single millet" },
  { icon: Flame, label: "Roasted, never fried" },
  { icon: Leaf, label: "No palm oil" },
  { icon: Sparkles, label: "No MSG" },
];

const facetIndexes = Array.from({ length: FACETS }, (_, i) => i);
const backIndexes = Array.from({ length: BACK_FACETS }, (_, i) => i);

type Vars = React.CSSProperties & Record<`--${string}`, string>;

export function JarCard({ jar, index, shop = false }: { jar: Jar; index: number; shop?: boolean }) {
  const product = JAR_PRODUCTS.find((p) => p.id === `jar-${jar.id}`);
  const frontEl = useRef<HTMLDivElement>(null);
  const backEl = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const ctl = useRef<ReturnType<typeof createJarSpin> | null>(null);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const spinner = createJarSpin(() => [frontEl.current, backEl.current]);
    ctl.current = spinner;
    // Textures only start downloading shortly before the section is reached.
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true);
          near.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    // First time it is properly on screen the jar swings in and settles.
    const seen = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          spinner.intro();
          seen.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
      spinner.dispose();
    };
  }, []);

  const style: Vars = {
    "--from": jar.from,
    "--to": jar.to,
    "--on": jar.on,
    "--paper": jar.paper,
    "--jar": `url(/images/flavours/jar-${jar.id}.webp)`,
  };

  return (
    <article
      ref={card}
      tabIndex={0}
      aria-label={`${jar.name} pop jowar jar..`}
      style={style}
      data-ready={ready}
      onPointerEnter={(e) => e.pointerType !== "touch" && ctl.current?.spin()}
      onPointerLeave={(e) => e.pointerType !== "touch" && ctl.current?.finish()}
      onPointerDown={(e) => e.pointerType === "touch" && ctl.current?.tap()}
      onFocus={() => ctl.current?.spin()}
      onBlur={() => ctl.current?.finish()}
      className={`jar-card group ${index % 2 ? "md:mt-12" : ""}`}
    >
      <div className="jar-arch" aria-hidden="true">
        <span className="jar-word">{jar.word}</span>
      </div>
      {PUFFS.map(([left, top, k, tx, ty, rot], i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src="/images/why/pop-jwaar-1.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="jar-puff"
          style={{ left, top, scale: String(k), "--tx": tx, "--ty": ty, "--rot": rot } as React.CSSProperties}
        />
      ))}

      <div className="jar" aria-hidden="true">
        {/* Far wall, popcorn surface, near wall and lid are separate layers so the
            browser never has to depth-sort flat discs against the strips. */}
        <div className="jar-stage">
          <div className="jar-tilt">
            <div ref={backEl} className="jar-spin">
              {backIndexes.map((i) => (
                <i key={i} className="jar-facet jar-back" style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
          </div>
        </div>
        <i className="jar-surface" />
        <div className="jar-stage">
          <div className="jar-tilt">
            <div ref={frontEl} className="jar-spin">
              {facetIndexes.map((i) => (
                <i key={i} className="jar-facet jar-front" style={{ "--i": i } as React.CSSProperties} />
              ))}
            </div>
          </div>
        </div>
        <i className="jar-lid" />
        <div className="jar-shade" />
        <div className="jar-gloss" />
        <div className="jar-base" />
      </div>

      <div className="relative z-10 mt-7 text-center text-[color:var(--on)]">
        <span className="jar-tag">{jar.tag}</span>
        <h4 className="mt-2.5 text-xl font-semibold tracking-tight sm:text-2xl">{jar.name}</h4>
        <p className="mt-1 text-sm font-medium opacity-80">{jar.line}</p>
        {shop && product && (
          <div className="mt-4 flex w-full flex-col items-center gap-2 px-3 xl:flex-row xl:gap-3" onPointerDown={(e) => e.stopPropagation()}>
            <span className="text-lg font-semibold">₹{product.price}</span>
            <AddToCartButton id={product.id} image={product.image} className="!w-full !py-2 !text-sm xl:!w-auto" />
          </div>
        )}
      </div>
    </article>
  );
}

/** The four jars in a row (a zig-zag from md up). */
export const JarGrid: React.FC<{ shop?: boolean }> = ({ shop = false }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-6">
    {JARS.map((jar, i) => (
      <JarCard key={jar.id} jar={jar} index={i} shop={shop} />
    ))}
  </div>
);

export const FlavourJars: React.FC = () => {
  return (
    <section
      id="flavour-jars"
      aria-label="Flavour jars"
      className="relative overflow-hidden bg-background px-5 pb-20 text-maroon sm:px-8 lg:px-12 lg:pb-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <Image src="/images/why/leaf-b.webp" alt="" width={175} height={126} className="flavour-leaf absolute -left-[2%] top-[6%] w-[12vw] max-w-[11rem] rotate-[24deg] opacity-70" />
        <Image src="/images/why/leaf-c.webp" alt="" width={169} height={141} className="flavour-leaf absolute -right-[2%] bottom-[10%] w-[12vw] max-w-[11rem] -rotate-[28deg] scale-x-[-1] opacity-70" />
      </div>

      <div className="relative mx-auto max-w-[1280px] md:max-w-[1040px]">
        <div className="jars-head relative mb-10 text-center md:mb-14">
          <p
            aria-hidden="true"
           
            className="jars-mark pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(5rem,17vw,15rem)] font-extrabold uppercase leading-none"
          >
            Pop Jowar
          </p>
          <p className="relative text-[13px] font-semibold uppercase tracking-[0.3em] text-[#C8154B]/70 sm:text-sm">
            Pick your jar
          </p>
          <h3 className="jars-title relative mt-3 text-[clamp(2.3rem,5.4vw,4.6rem)] font-semibold leading-[1.02] tracking-tight text-[#C8154B]">
            Four Jars.
            <br />
            One Endless Crunch.
          </h3>
          <p className="relative mx-auto mt-5 max-w-[34rem] text-[clamp(1rem,1.2vw,1.15rem)] font-medium leading-snug text-[#082567]">
            Single millet, roasted never fried, with no palm oil and no MSG. Give a jar a spin and find the one that sounds like you.
          </p>
        </div>
        <JarGrid />

        <div className="mt-16 flex flex-col items-center gap-8 md:mt-24">
          <ul className="jars-chips flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {PERKS.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon className="h-4 w-4 text-[#C8154B]" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            transitionTypes={["nav-forward"]}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#C8154B] px-7 py-3.5 text-base font-semibold text-cream shadow-[0_14px_30px_-14px_#C8154B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a90f3c]"
          >
            Shop All Flavours
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
