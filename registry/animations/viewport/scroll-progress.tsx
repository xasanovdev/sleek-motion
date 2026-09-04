"use client";

import { useScroll, type UseScrollOptions } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";

/** Direct scroll position without smoothing or decorative lag; supply size and placement. */
export function ScrollProgress<T extends AnimationTag = "div">({
  container, target, offset, axis = "x", style, duration: _duration, delay: _delay, reducedMotion: _reducedMotion, ...props
}: AnimationProps<T, Pick<UseScrollOptions, "container" | "target" | "offset"> & { axis?: "x" | "y" }>) {
  const { scrollYProgress } = useScroll({ container, target, offset });
  return <MotionSurface {...props} aria-hidden="true" style={{
    ...style, transformOrigin: props.dir === "rtl" && axis === "x" ? "right" : "left top",
    ...(axis === "x" ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress }),
  }} />;
}
