import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/common/PageTransition";
import { OffscreenPause } from "@/components/layout/OffscreenPause";
import { Hero } from "@/components/sections/Hero";
import { WaveEdge } from "@/components/sections/Hero/WaveEdge";
import { Why } from "@/components/sections/Why";
import { Beliefs } from "@/components/sections/Beliefs";
import { Process } from "@/components/sections/Process";
import { Flavours, FlavourJars } from "@/components/sections/Flavours";
import { SnackSmart } from "@/components/sections/SnackSmart";
import { WhereToFind } from "@/components/sections/WhereToFind";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <OffscreenPause />
      <PageTransition>
      <main className="flex-1">
        {/* The hero stays pinned; everything below slides up over it */}
        <Hero />
        <div className="relative z-10">
          <WaveEdge />
          <div className="bg-background">
            <Why />
            <Beliefs />
            <Process />
            <Flavours />
            <FlavourJars />
            <SnackSmart />
            <WhereToFind />
            <Testimonials />
          </div>
          <Footer />
        </div>
      </main>
      </PageTransition>
    </>
  );
}
