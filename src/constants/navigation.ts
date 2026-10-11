import { NavItem } from "@/types";
import { TESTIMONIALS_DATA } from "./testimonials";

const ALL_LINKS: NavItem[] = [
  { label: "Home", href: "/#hero" },
  { label: "Our Story", href: "/#story" },
  { label: "Flavours", href: "/#flavours" },
  { label: "Process", href: "/#process" },
  { label: "Reviews", href: "/#testimonials" },
  { label: "FAQs", href: "/#faqs" },
];

// The Reviews section is hidden until there are genuine quotes to show.
export const NAVIGATION_LINKS: NavItem[] = ALL_LINKS.filter(
  (l) => l.label !== "Reviews" || TESTIMONIALS_DATA.length > 0,
);
