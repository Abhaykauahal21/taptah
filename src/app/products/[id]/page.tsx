import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
import { AddToCartButton } from "@/components/common/AddToCartButton";
import { InView } from "@/components/common/InView";
import { PageTransition } from "@/components/common/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { FLAVOURS_DATA, FLAVOUR_BADGES } from "@/constants/flavours";

const HEAT = ["Mild", "Medium", "Hot"];

export function generateStaticParams() {
  return FLAVOURS_DATA.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const f = FLAVOURS_DATA.find((x) => x.id === id);
  return f ? { title: f.name, description: f.description } : {};
}

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const flavour = FLAVOURS_DATA.find((f) => f.id === id);
  if (!flavour) notFound();
  const others = FLAVOURS_DATA.filter((f) => f.id !== flavour.id);

  return (
    <PageTransition>
      <main className="flex-1">
        <section
          aria-label={flavour.name}
          className="relative overflow-hidden bg-background px-5 pb-20 pt-28 text-[#C8154B] sm:px-8 lg:px-12 lg:pb-28 lg:pt-36"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute right-[-10%] top-[8%] h-[70%] w-[55%] rounded-full opacity-40 blur-[90px]"
              style={{ background: flavour.accentColor }}
            />
          </div>

          <InView className="pd-art relative z-10 mx-auto max-w-[1180px]">
            <Link
              href="/products"
              transitionTypes={["nav-back"]}
              className="pd-rise group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-[#C8154B]"
              style={rise(0)}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              All products
            </Link>

            <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              {/* The pack: this photo is the one that morphs in from the product list */}
              <div className="mx-auto w-full max-w-[26rem] lg:max-w-none">
                <div
                  className="relative aspect-[1144/1375] overflow-hidden rounded-[26px] shadow-[0_30px_60px_-24px_rgba(60,28,12,0.55)]"
                  style={{ background: flavour.tone }}
                >
                  <ViewTransition name={`pack-${flavour.id}`} share="morph" default="none">
                    <Image
                      src={flavour.image}
                      alt={`${flavour.name} pop jowar pack`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-cover"
                    />
                  </ViewTransition>
                </div>
              </div>

              <div>
                <p
                  className="pd-rise text-[13px] font-semibold uppercase tracking-[0.3em] text-[#C8154B]/70 sm:text-sm"
                  style={rise(1)}
                >
                  Pop Jowar
                </p>
                <h1
                  className="pd-rise mt-3 text-[clamp(2.6rem,5.2vw,4.8rem)] font-semibold leading-[1.04] tracking-tight"
                  style={rise(2)}
                >
                  {flavour.name}
                </h1>
                <p
                  className="pd-rise mt-3 text-[1.25rem] font-semibold text-[#082567]"
                  style={rise(3)}
                >
                  {flavour.tagline}
                </p>
                <p
                  className="pd-rise mt-4 max-w-[32rem] text-[clamp(1.05rem,1.3vw,1.25rem)] font-medium leading-[1.6] text-[#082567]"
                  style={rise(4)}
                >
                  {flavour.description}
                </p>

                <div className="pd-rise mt-6 flex flex-wrap items-center gap-x-8 gap-y-3" style={rise(5)}>
                  {flavour.spiceLevel && (
                    <span
                      className="flex items-center gap-2 text-[0.85rem] font-semibold uppercase tracking-[0.2em] text-[#082567]"
                      aria-label={`Spice level: ${HEAT[flavour.spiceLevel - 1]}`}
                    >
                      <span className="flex gap-0.5" aria-hidden="true">
                        {[1, 2, 3].map((n) => (
                          <Flame
                            key={n}
                            className={
                              n <= flavour.spiceLevel!
                                ? "h-4 w-4 fill-[#ffb347] text-[#ffb347]"
                                : "h-4 w-4 text-[#082567]/25"
                            }
                          />
                        ))}
                      </span>
                      {HEAT[flavour.spiceLevel - 1]}
                    </span>
                  )}
                </div>

                <div className="pd-rise mt-6 max-w-[16rem]" style={rise(6)}>
                  <AddToCartButton id={flavour.id} image={flavour.image} className="w-full max-w-none" />
                </div>

                <div className="pd-rise mt-10" style={rise(7)}>
                  <h2 className="text-[1.5rem] font-semibold">What is inside</h2>
                  <ol className="mt-3 max-w-[34rem] divide-y divide-[#C8154B]/15">
                    {flavour.ingredients.map((ing, i) => (
                      <li key={ing.name} className="grid grid-cols-[2rem_1fr] items-baseline gap-1 py-2.5">
                        <span className="text-[0.85rem] font-semibold italic tabular-nums text-[#C8154B]/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="leading-snug">
                          <span className="text-[1.08rem] font-semibold text-[#082567]">{ing.name}</span>
                          <span className="ml-2.5 text-[0.95rem] italic text-[#082567]/70">{ing.note}</span>
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#C8154B]/80">
                    {FLAVOUR_BADGES.map((b, i) => (
                      <span key={b.id} className="flex items-center gap-3">
                        {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#C8154B]" />}
                        {b.label}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* More flavours */}
            <div className="pd-rise mt-20" style={rise(8)}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold">More flavours</h2>
                <Link
                  href="/products"
                  transitionTypes={["nav-back"]}
                  className="group inline-flex items-center gap-2 border-b border-[#C8154B]/30 pb-0.5 text-[1rem] font-semibold transition-colors hover:border-[#C8154B]"
                >
                  View all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {others.map((f) => (
                  <Link
                    key={f.id}
                    href={`/products/${f.id}`}
                    transitionTypes={["nav-forward"]}
                    className="group flex items-center gap-4 rounded-[20px] bg-white/55 p-3 ring-1 ring-[#082567]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-lg"
                  >
                    <span
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                      style={{ background: f.theme.to }}
                    >
                      <Image
                        src={f.image}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover object-[50%_44%] transition-transform duration-500 group-hover:scale-110"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[1.2rem] font-semibold leading-tight">{f.name}</span>
                      <span className="mt-0.5 block text-[0.95rem] leading-snug text-[#082567]/75">
                        {f.tagline}
                      </span>
                    </span>
                    <ArrowRight className="ml-auto h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </InView>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}
