"use client";

import type { Transition } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { layoutTransition } from "../../motion-tokens";

export const sharedElementTransition = layoutTransition;
/** Scope independent instances with Motion's LayoutGroup id. */
export function SharedElement<T extends AnimationTag = "div">({
  layoutId,
  transition = sharedElementTransition,
  reducedMotion,
  ...props
}: Omit<
  AnimationProps<T, { layoutId: string; transition?: Transition }>,
  "duration" | "delay"
>) {
  const reduce = useMotionPreference(reducedMotion);
  return (
    <MotionSurface
      {...props}
      layoutId={reduce ? undefined : layoutId}
      layout={!reduce}
      transition={transition}
    />
  );
}
