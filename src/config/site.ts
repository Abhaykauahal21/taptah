export const siteConfig = {
  name: "Taptah",
  title: "Taptah — Wholesome Traditions, Modern Bites.",
  description:
    "Light, crunchy snacks crafted from ancient grains for a healthier, happier you.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://taptah.com",
  ogImage: "/images/common/og-image.jpg",
  links: {
    instagram: "https://instagram.com/taptah",
    twitter: "https://twitter.com/taptah",
  },
  contact: {
    email: "hello@taptah.com",
  },
};

export type SiteConfig = typeof siteConfig;
