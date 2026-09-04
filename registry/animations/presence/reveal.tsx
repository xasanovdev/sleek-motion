"use client";

import type { Variants } from "motion/react";
import { createPresence } from "../../internal/create-presence";
import type { Direction } from "../../internal/types";

export type RevealOptions = { direction?: Direction };
const clips = {
  up: "inset(100% 0 0 0)",
  down: "inset(0 0 100% 0)",
  left: "inset(0 0 0 100%)",
  right: "inset(0 100% 0 0)",
};
export const revealVariants: Variants = {
  hidden: ({
    direction = "up",
    reducedMotion = false,
  }: { direction?: Direction; reducedMotion?: boolean } = {}) => ({
    opacity: 0,
    clipPath: reducedMotion ? "inset(0 0 0 0)" : clips[direction],
  }),
  visible: { opacity: 1, clipPath: "inset(0 0 0 0)" },
};
export const Reveal = createPresence<RevealOptions>(
  revealVariants,
  ({ direction = "up", ...rest }) => ({ custom: { direction }, rest }),
);
