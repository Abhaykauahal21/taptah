import { Allura, Cormorant_Garamond } from "next/font/google";

/**
 * Primary typeface — headlines, navigation and body copy.
 */
export const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Handwritten script accent (e.g. "Crunch Clean Repeat").
 */
export const fontScript = Allura({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
  weight: "400",
});
