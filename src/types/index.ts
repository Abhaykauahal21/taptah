export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface FlavourItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  spiceLevel?: 1 | 2 | 3;
  accentColor: string;
  /** Full card artwork under /public (pack, name, tagline and badges). */
  image: string;
  /** Price in rupees. */
  price: number;
  /** Card backdrop gradient (top, bottom). */
  theme: { from: string; to: string };
  /** Small flag in the corner of the card, e.g. "Best Seller". */
  badge?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  location?: string;
  role?: string;
  quote: string;
  rating: number;
  /** Portrait under /public; when absent an initials avatar is drawn. */
  avatar?: string;
  /** Gradient used for the initials avatar. */
  tone: [string, string];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  /** Label position over the process illustration, in percent. */
  position: { left: number; top: number };
}
