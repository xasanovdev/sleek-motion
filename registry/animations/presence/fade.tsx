"use client";

import type { Variants } from "motion/react";
import { createPresence } from "../../internal/create-presence";

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} satisfies Variants;
export const Fade = createPresence(fadeVariants, (props) => ({
  custom: {},
  rest: props,
}));
