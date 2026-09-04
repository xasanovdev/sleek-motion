"use client";

import { AnimatePresence, type Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { motionTokens, tween } from "../../motion-tokens";
import type { ContentSwapOptions } from "./content-swap";

export type DirectionalContentSwapOptions = ContentSwapOptions & {
  direction: 1 | -1;
  distance?: number;
  axis?: "x" | "y";
};
type DirectionData = {
  direction?: 1 | -1;
  distance?: number;
  axis?: "x" | "y";
  reducedMotion?: boolean;
};
function offset(
  {
    direction = 1,
    distance = motionTokens.distance.normal,
    axis = "x",
    reducedMotion = false,
  }: DirectionData = {},
  sign: number,
) {
  return {
    opacity: 0,
    transform: `translate${axis.toUpperCase()}(${reducedMotion ? 0 : direction * distance * sign}px)`,
  };
}
export const directionalContentSwapVariants: Variants = {
  hidden: (data: DirectionData) => offset(data, 1),
  visible: { opacity: 1, transform: "translate(0px, 0px)" },
  exit: (data: DirectionData) => offset(data, -1),
};
export function DirectionalContentSwap<T extends AnimationTag = "div">({
  contentKey,
  direction,
  distance,
  axis = "x",
  dir,
  mode = "wait",
  initial = false,
  duration,
  delay,
  reducedMotion,
  onExitComplete,
  ...props
}: AnimationProps<T, DirectionalContentSwapOptions>) {
  const reduce = useMotionPreference(reducedMotion);
  const custom = {
    direction: dir === "rtl" && axis === "x" ? -direction : direction,
    distance,
    axis,
    reducedMotion: reduce,
  };
  return (
    <AnimatePresence
      initial={initial}
      mode={mode}
      custom={custom}
      onExitComplete={onExitComplete}
    >
      <MotionSurface
        {...props}
        dir={dir}
        key={contentKey}
        custom={custom}
        variants={directionalContentSwapVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={tween(duration, delay)}
      />
    </AnimatePresence>
  );
}
