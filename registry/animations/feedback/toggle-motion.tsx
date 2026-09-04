"use client";

import type { Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";

export const toggleMotionVariants: Variants = {
  unchecked: { transform: "translateX(0px)" },
  checked: ({ distance = 16, rtl = false } = {}) => ({ transform: `translateX(${rtl ? -distance : distance}px)` }),
};
/** Decorative thumb only; the consumer owns the accessible switch/input. */
export function ToggleMotion<T extends AnimationTag = "span">({
  as, checked, distance = 16, dir, duration, delay, reducedMotion, ...props
}: AnimationProps<T, { checked: boolean; distance?: number }>) {
  const reduce = useMotionPreference(reducedMotion);
  return <MotionSurface {...props} as={as ?? "span"} dir={dir} aria-hidden="true" initial={false}
    custom={{ distance, rtl: dir === "rtl" }} variants={toggleMotionVariants} animate={checked ? "checked" : "unchecked"}
    transition={tween(reduce ? 0 : duration, reduce ? 0 : delay)} />;
}
