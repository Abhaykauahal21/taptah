import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { OffscreenPause } from "@/components/layout/OffscreenPause";
import { Hero } from "@/components/sections/Hero";
import { WaveEdge } from "@/components/sections/Hero/WaveEdge";
import { Why } from "@/components/sections/Why";
import { Process } from "@/components/sections/Process";
import { Flavours } from "@/components/sections/Flavours";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <OffscreenPause />
      <main className="flex-1">
        {/* The hero stays pinned; everything below slides up over it */}
        <Hero />
        <div className="relative z-10">
          <WaveEdge />
          <div className="bg-background">
            <Why />
            <Process />
            <Flavours />
            <Testimonials />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
