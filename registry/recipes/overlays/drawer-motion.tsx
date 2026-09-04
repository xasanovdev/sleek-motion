"use client";

import type { Variants } from "motion/react";
import { createPresence } from "../../internal/create-presence";

export type DrawerMotionOptions = {
  edge?: "top" | "right" | "bottom" | "left";
};
const offsets = {
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
  left: "translateX(-100%)",
  right: "translateX(100%)",
};
export const drawerMotionVariants: Variants = {
  hidden: ({
    edge = "right",
    reducedMotion = false,
  }: DrawerMotionOptions & { reducedMotion?: boolean } = {}) => ({
    opacity: 0,
    transform: reducedMotion ? "translate(0%, 0%)" : offsets[edge],
  }),
  visible: { opacity: 1, transform: "translate(0%, 0%)" },
};
/** Motion only; pair with an accessible dialog and position the surface at edge. */
export const DrawerMotion = createPresence<DrawerMotionOptions>(
  drawerMotionVariants,
  ({ edge = "right", ...rest }) => ({ custom: { edge }, rest }),
);
