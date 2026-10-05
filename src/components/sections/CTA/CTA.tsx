import React from "react";
import { Button } from "@/components/ui/Button";

export const CTA: React.FC = () => {
  return (
    <section
      id="cta"
      aria-label="Call to Action"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-maroon text-cream text-center"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold">
          Taste the Tradition
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream">
          Ready for a Crisp Revelation?
        </h2>
        <p className="text-sm sm:text-base text-cream/80 max-w-xl mx-auto font-sans leading-relaxed">
          Order your starter pack today and discover snacks crafted with pure ancient grains.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            size="lg"
            className="bg-gold text-primary hover:bg-gold/90"
          >
            Explore Snacks
          </Button>
        </div>
      </div>
    </section>
  );
};
