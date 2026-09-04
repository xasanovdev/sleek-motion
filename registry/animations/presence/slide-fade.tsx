"use client";

import type { Variants } from "motion/react";
import { createPresence } from "../../internal/create-presence";
import type { Direction } from "../../internal/types";
import { motionTokens } from "../../motion-tokens";

/** Direction is the direction of travel during entrance. */
export type SlideFadeOptions = { direction?: Direction; distance?: number };
export function slideTransform(direction: Direction, distance: number) {
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const sign = direction === "up" || direction === "left" ? 1 : -1;
  return `translate${axis}(${distance * sign}px)`;
}
export const slideFadeVariants: Variants = {
  hidden: ({
    direction = "up",
    distance = motionTokens.distance.normal,
    reducedMotion = false,
  } = {}) => ({
    opacity: 0,
    transform: slideTransform(direction, reducedMotion ? 0 : distance),
  }),
  visible: { opacity: 1, transform: "translate(0px, 0px)" },
};
export const SlideFade = createPresence<SlideFadeOptions>(
  slideFadeVariants,
  ({ direction = "up", distance = motionTokens.distance.normal, ...rest }) => ({
    custom: { direction, distance },
    rest,
  }),
);
