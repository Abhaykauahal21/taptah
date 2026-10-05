import React from "react";
import Link from "next/link";
import { NAVIGATION_LINKS } from "@/constants/navigation";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-maroon text-cream pt-16 pb-12 mt-auto border-t border-maroon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-cream/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-bold tracking-tight text-cream">
              Taptah
            </span>
            <p className="text-sm text-cream/70 max-w-sm font-sans leading-relaxed">
              Wholesome Traditions, Modern Bites. Celebrating ancient grains
              and authentic Indian craftsmanship in every crisp roast.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gold font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-cream transition-colors text-xs uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-gold font-semibold">
              Connect
            </h4>
            <p className="text-xs text-cream/70">
              Crafted with care in India. Inquiries: hello@taptah.com
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Taptah Foods Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cream transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
