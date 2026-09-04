"use client";

import { AnimatePresence, type Variants } from "motion/react";
import { tween } from "../motion-tokens";
import { MotionSurface } from "./motion-surface";
import type { AnimationProps, AnimationTag, PresenceOptions } from "./types";
import { useMotionPreference } from "./use-motion-preference";

export function createPresence<Options extends object>(
  variants: Variants,
  getOptions: (props: Options) => { custom: object; rest: object },
) {
  return function PresenceAnimation<T extends AnimationTag = "div">({
    show = true,
    initial = false,
    duration,
    delay,
    reducedMotion,
    onExitComplete,
    ...props
  }: AnimationProps<T, PresenceOptions & Options>) {
    const reduce = useMotionPreference(reducedMotion);
    const { custom, rest } = getOptions(props as Options);
    const data = { ...custom, reducedMotion: reduce };
    return (
      <AnimatePresence
        initial={initial}
        custom={data}
        onExitComplete={onExitComplete}
      >
        {show && (
          <MotionSurface
            {...rest}
            key="content"
            custom={data}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={tween(duration, delay)}
          />
        )}
      </AnimatePresence>
    );
  };
}
