"use client";

import type { Transition } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { layoutTransition } from "../../motion-tokens";

export const layoutShiftTransition = layoutTransition;
export function LayoutShift<T extends AnimationTag = "div">({
  layout = "position",
  transition = layoutShiftTransition,
  duration: _duration,
  delay: _delay,
  reducedMotion,
  ...props
}: AnimationProps<
  T,
  {
    layout?: true | "position" | "size" | "preserve-aspect";
    transition?: Transition;
  }
>) {
  const reduce = useMotionPreference(reducedMotion);
  return (
    <MotionSurface
      {...props}
      layout={reduce ? false : layout}
      transition={transition}
    />
  );
}
