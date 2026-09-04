"use client";

import { useEffect, useRef, type Key } from "react";
import { useAnimationControls, type Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";

export const shakeVariants: Variants = {
  idle: { transform: "translateX(0px)" },
  shake: ({ distance = 4 } = {}) => ({ transform: [0, -distance, distance, -distance / 2, distance / 2, 0].map((x) => `translateX(${x}px)`) }),
};
/** Change trigger to replay error feedback. Pair with a visible error message. */
export function Shake<T extends AnimationTag = "div">({
  trigger, distance = 4, duration = 0.24, delay = 0, reducedMotion, ...props
}: AnimationProps<T, { trigger: Key; distance?: number }>) {
  const controls = useAnimationControls();
  const previous = useRef(trigger);
  const reduce = useMotionPreference(reducedMotion);
  useEffect(() => {
    const changed = previous.current !== trigger;
    previous.current = trigger;
    if (reduce) controls.set("idle");
    else if (changed) void controls.start("shake");
    return () => controls.stop();
  }, [trigger, reduce, controls]);
  return <MotionSurface {...props} initial={false} animate={controls} custom={{ distance }} variants={shakeVariants}
    transition={{ duration: Math.max(0, duration), delay: Math.max(0, delay), ease: "easeInOut" }} />;
}
