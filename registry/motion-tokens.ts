import type { Transition } from "motion/react";

/** Durations are seconds; distances are pixels. */
export const motionTokens = {
  duration: { fast: 0.16, normal: 0.2, slow: 0.24 },
  distance: { small: 8, normal: 12, large: 16 },
  easeOut: [0.23, 1, 0.32, 1],
  scale: 0.96,
  stagger: 0.04,
} as const;

export const layoutTransition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 1,
} satisfies Transition;

export function tween(
  duration: number = motionTokens.duration.normal,
  delay = 0,
): Transition {
  return {
    type: "tween",
    duration: Math.max(0, duration),
    delay: Math.max(0, delay),
    ease: motionTokens.easeOut,
  };
}
