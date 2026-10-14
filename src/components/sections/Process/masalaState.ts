/**
 * Shared between MasalaStation (the hands) and GrainFlow (the grain physics): where each
 * hand is sprinkling right now, in artboard units. `active` is false when the hands are not
 * running (off screen, reduced motion), so GrainFlow can fall back to a gentle ambient shower.
 */
export interface Sprinkle {
  on: boolean;
  x: number;
  y: number;
}

export const masalaState: { active: boolean; pudina: Sprinkle; red: Sprinkle } = {
  active: false,
  pudina: { on: false, x: 0, y: 0 },
  red: { on: false, x: 0, y: 0 },
};
