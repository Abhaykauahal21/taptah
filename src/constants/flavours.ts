import { FlavourItem } from "@/types";

export const FLAVOURS_DATA: FlavourItem[] = [
  {
    id: "korean-kimchi",
    name: "Korean Kimchi",
    tagline: "Bold. Tangy. Unforgettable.",
    description: "Fiery gochugaru and fermented tang on light, crunchy pop jowar.",
    spiceLevel: 3,
    accentColor: "#9E1B2C",
    price: 99,
    theme: { from: "#8a1426", to: "#6a0f1f" },
    badge: "Best Seller",
    image: "/images/flavours/Korean-Kimchi.png",
  },
  {
    id: "classic-masala",
    name: "Classic Masala",
    tagline: "A timeless favourite.",
    description: "Warm, familiar masala spices tossed through every crunchy bite.",
    spiceLevel: 2,
    accentColor: "#C28A1C",
    price: 99,
    theme: { from: "#b8821c", to: "#8a5a10" },
    image: "/images/flavours/Classic-Masala.png",
  },
  {
    id: "herb-and-onion",
    name: "Herb & Onion",
    tagline: "Light. Fragrant. Addictive.",
    description: "Fresh herbs and sweet onion for a light, aromatic crunch.",
    spiceLevel: 1,
    accentColor: "#2F5D34",
    price: 99,
    theme: { from: "#2f5d34", to: "#1d4426" },
    image: "/images/flavours/Herb-Onion.png",
  },
];

export const FLAVOUR_BADGES = [
  { id: "fibre", label: "High Fibre", icon: "leaf" },
  { id: "clean", label: "No Preservatives", icon: "shield" },
  { id: "gluten", label: "Gluten Free", icon: "wheat" },
] as const;
