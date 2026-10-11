import type { Metadata } from "next";
import Image from "next/image";
import { InView } from "@/components/common/InView";
import { PageTransition } from "@/components/common/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { FlavourCard } from "@/components/sections/Flavours/FlavourCard";
import { FLAVOURS_DATA } from "@/constants/flavours";

export const metadata: Metadata = {
  title: "All Products",
  description: "Every Taptah Pop Jowar flavour in one place: Butter Salt, Peri Peri and Tangy Pudina.",
};

export default function ProductsPage() {
  return (
    <PageTransition>
      <main className="flex-1">
        <section
          aria-label="All products"
          className="relative overflow-hidden bg-background px-5 pb-20 pt-32 text-[#C8154B] sm:px-8 lg:px-12 lg:pb-28 lg:pt-40"
        >
          {/* soft washes in each flavour's colour, and a faded jowar stalk */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            <span className="flavour-wash left-[2%] bg-[#C28A1C]" />
            <span className="flavour-wash left-[34%] bg-[#B3261E] [animation-delay:-3s]" />
            <span className="flavour-wash right-[2%] bg-[#4F7A2B] [animation-delay:-6s]" />
            <Image
              src="/images/why/leaf-b.webp"
              alt=""
              width={175}
              height={126}
              className="flavour-leaf absolute -left-[3%] top-[14%] w-[15vw] max-w-[14rem] rotate-[24deg]"
            />
          </div>

          <InView className="flavours-art relative z-10 mx-auto max-w-[1280px]">
            <div className="flavours-head mx-auto max-w-[1040px]">
              <div className="flex items-center gap-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-[#C8154B]/70 sm:text-sm">
                  All Products
                </p>
                <span aria-hidden="true" className="rv-rule hidden h-px w-16 bg-[#C8154B]/45 sm:block" />
              </div>
              <h1 className="mt-3 text-[clamp(2.6rem,5.4vw,5rem)] font-semibold leading-[1.04] tracking-tight">
                <span className="rv-line" style={{ "--l": 0 } as React.CSSProperties}>
                  <span>Pick Your</span>
                </span>
                <span className="rv-line" style={{ "--l": 1 } as React.CSSProperties}>
                  <span>Crunch.</span>
                </span>
              </h1>
              <p className="mt-5 max-w-[30rem] text-[clamp(1.05rem,1.35vw,1.3rem)] font-medium leading-[1.55] text-[#082567]">
                One millet, {FLAVOURS_DATA.length} flavours. Open any pack to see what is inside, or add it
                straight to your cart.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-[1040px] gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FLAVOURS_DATA.map((flavour, i) => (
                <div key={flavour.id} className="mx-auto w-full max-w-[22rem] sm:max-w-none">
                  <FlavourCard
                    flavour={flavour}
                    index={i}
                    href={`/products/${flavour.id}`}
                    viewName={`pack-${flavour.id}`}
                  />
                </div>
              ))}
            </div>
          </InView>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}
