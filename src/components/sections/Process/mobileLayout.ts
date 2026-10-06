/**
 * The process scene on phones and tablets: a tall, zig-zag artboard (480 x 880
 * units) instead of the desktop diagonal. GrainFlow simulates the grains in
 * these same units and ProcessMobile places the images with them, so the two
 * stay in register. Vessel sizes match the desktop artboard (a bowl is 220
 * units wide), only the arrangement changes.
 */
export const M_W = 480;
export const M_H = 880;

/** Naturally-grown cut-out (jowar, grain stream and scoop), 1396 x 1127. */
export const STALKS = { x: -6, y: 8, w: 200 };
/** Step 2 bowl, 1492 x 1054. */
export const BOWL1 = { x: 30, y: 205, w: 220 };
/** Step 3 kadayi, 1419 x 1108. */
export const KADAYI = { x: 285, y: 385, w: 190 };
/** Step 4 bowls: pudina on the left, masala on the right. */
export const BOWL3 = { x: 8, y: 600, w: 220 };
export const BOWL2 = { x: 258, y: 600, w: 220 };

/** Shaker bottles hang above their bowl, as on the desktop artboard. */
export const BOTTLE_W = 50;
export const BOTTLE_DX = [16, 164];
export const BOTTLE_DY = -28;
