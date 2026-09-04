"use client";

import type { HTMLMotionProps } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";
import { slideFadeVariants, type SlideFadeOptions } from "../presence/slide-fade";

export const scrollRevealVariants = slideFadeVariants;
/** SSR content stays visible. Only below-fold content is revealed on viewport entry. */
export function ScrollReveal<T extends AnimationTag = "div">({
  once = true, amount = 0.2, margin, direction = "up", distance, duration, delay, reducedMotion, ...props
}: AnimationProps<T, SlideFadeOptions & { once?: boolean; amount?: number | "some" | "all"; margin?: NonNullable<HTMLMotionProps<"div">["viewport"]>["margin"] }>) {
  const reduce = useMotionPreference(reducedMotion);
  return <MotionSurface {...props} initial={false} animate={reduce ? "visible" : "hidden"} whileInView="visible"
    custom={{ direction, distance, reducedMotion: reduce }} variants={scrollRevealVariants}
    viewport={{ once, amount, margin }} transition={tween(duration, reduce ? 0 : delay)} />;
}
