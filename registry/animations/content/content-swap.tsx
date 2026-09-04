"use client";

import { AnimatePresence, type AnimatePresenceProps } from "motion/react";
import type { Key } from "react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { tween } from "../../motion-tokens";
import { fadeVariants } from "../presence/fade";

export const contentSwapVariants = fadeVariants;
export type ContentSwapOptions = {
  contentKey: Key;
  mode?: AnimatePresenceProps["mode"];
  initial?: boolean;
  onExitComplete?: () => void;
};
export function ContentSwap<T extends AnimationTag = "div">({
  contentKey, mode = "wait", initial = false, duration, delay, reducedMotion: _reducedMotion, onExitComplete, ...props
}: AnimationProps<T, ContentSwapOptions>) {
  return <AnimatePresence initial={initial} mode={mode} onExitComplete={onExitComplete}>
    <MotionSurface {...props} key={contentKey} variants={contentSwapVariants}
      initial="hidden" animate="visible" exit="hidden" transition={tween(duration, delay)} />
  </AnimatePresence>;
}
