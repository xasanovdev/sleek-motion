"use client";

import type { Variants } from "motion/react";
import { createPresence } from "../../internal/create-presence";
import { motionTokens } from "../../motion-tokens";

export type ScaleFadeOptions = { scale?: number };
export const scaleFadeVariants: Variants = {
  hidden: ({ scale = motionTokens.scale, reducedMotion = false } = {}) => ({
    opacity: 0,
    transform: `scale(${reducedMotion ? 1 : scale})`,
  }),
  visible: { opacity: 1, transform: "scale(1)" },
};
export const ScaleFade = createPresence<ScaleFadeOptions>(
  scaleFadeVariants,
  ({ scale = motionTokens.scale, ...rest }) => ({ custom: { scale }, rest }),
);
