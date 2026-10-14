import { Allura, Barlow_Condensed, Cormorant_Garamond } from "next/font/google";

/**
 * Brand typography (Taptah Brand Guidelines, Sept 2026).
 *
 * Primary typeface: Barlow Condensed — headlines, navigation and body copy.
 * (The CSS variable is still called --font-serif so existing `font-serif` classes pick it up.)
 */
export const fontSerif = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

/**
 * Stand-ins until the licensed brand fonts are added in /public/fonts (see globals.css):
 *  - Baginda (logo font)       -> Cormorant Garamond, a similar thin high-contrast serif
 *  - Khaviax (secondary font)  -> Allura, for the handwritten "Crunch. Clean. Repeat." note
 */
export const fontLogo = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500"],
});

export const fontScript = Allura({
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
  weight: "400",
});
