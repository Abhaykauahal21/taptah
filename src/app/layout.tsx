import type { Metadata, Viewport } from "next";
import { fontSerif, fontScript } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Loader } from "@/components/layout/Loader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F8E9D6",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Taptah",
    "Ancient Grains",
    "Healthy Snacks",
    "Indian Food Brand",
    "Artisanal Snacks",
    "Roasted Snacks",
  ],
  authors: [{ name: "Taptah" }],
  creator: "Taptah",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@taptah",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-loading="true"
      suppressHydrationWarning
      className={`${fontSerif.variable} ${fontScript.variable}`}
    >
      <body className="min-h-screen flex flex-col font-serif bg-background text-foreground antialiased selection:bg-maroon selection:text-cream">
        <Loader />
        <SmoothScroll />
        <noscript>
          <style>{`.loader{display:none}html[data-loading]{overflow:auto!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
