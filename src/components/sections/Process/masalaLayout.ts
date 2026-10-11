import * as ML from "./mobileLayout";

/**
 * Where the two masala bowls sit, where each hand dips in, and where it sprinkles over the
 * popped-jowar bowls. All in artboard units (desktop: 1000 wide; phones: see mobileLayout.ts).
 * `flip` hands reach in from the left, the others from the right.
 */
export interface Station {
  id: "pudina" | "red";
  img: string;
  /** Natural size of the bowl image, to keep its aspect. */
  imgW: number;
  imgH: number;
  bowl: { x: number; y: number; w: number };
  /** The pinch touches the masala here... */
  dip: { x: number; y: number };
  /** ...and sprinkles it here, just above the popped-jowar bowl. */
  target: { x: number; y: number };
  flip: boolean;
}

export interface StationLayout {
  W: number;
  H: number;
  handW: number;
  stations: Station[];
}

const PUDINA = { img: "/images/why/masala-bowl-pudina.webp", imgW: 1518, imgH: 1024 };
const RED = { img: "/images/why/masala-bowl-red.webp", imgW: 1476, imgH: 1004 };

export const DESKTOP_STATIONS: StationLayout = {
  W: 1000,
  H: (1000 * 1100) / 1258,
  handW: 150,
  stations: [
    {
      id: "pudina",
      ...PUDINA,
      bowl: { x: 222, y: 500, w: 120 },
      dip: { x: 282, y: 512 },
      target: { x: 500, y: 408 },
      flip: true,
    },
    {
      id: "red",
      ...RED,
      bowl: { x: 885, y: 538, w: 96 },
      dip: { x: 933, y: 549 },
      target: { x: 740, y: 408 },
      flip: false,
    },
  ],
};

export const MOBILE_STATIONS: StationLayout = {
  W: ML.M_W,
  H: ML.M_H,
  handW: 100,
  stations: [
    {
      id: "pudina",
      ...PUDINA,
      bowl: { x: 63, y: 796, w: 100 },
      dip: { x: 113, y: 812 },
      target: { x: ML.BOWL3.x + ML.BOWL3.w / 2, y: 592 },
      flip: true,
    },
    {
      id: "red",
      ...RED,
      bowl: { x: 315, y: 778, w: 100 },
      dip: { x: 365, y: 794 },
      target: { x: ML.BOWL2.x + ML.BOWL2.w / 2, y: 592 },
      flip: false,
    },
  ],
};
