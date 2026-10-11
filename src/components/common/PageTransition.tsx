import { ViewTransition } from "react";

/**
 * Wrap each page's content in this. Links tagged `transitionTypes={["nav-forward"]}` slide the
 * old page out to the left and the new one in from the right; `nav-back` does the reverse
 * (the CSS lives in globals.css). Anything else (browser back, refresh) swaps with no motion.
 */
const map = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" } as const;

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={map} exit={map} default="none">
      {children}
    </ViewTransition>
  );
}
