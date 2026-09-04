"use client";

import type { Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMeasuredHeight } from "../../internal/use-measured-height";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";

export const autoHeightVariants: Variants = {
  visible: ({ height }: { height?: number } = {}) => ({
    height: height ?? "auto",
  }),
};
/** Padding belongs on the child; the outer element owns height and clipping. */
export function AutoHeight<T extends AnimationTag = "div">({
  children,
  duration,
  delay,
  reducedMotion,
  style,
  ...props
}: AnimationProps<T>) {
  const { ref, height } = useMeasuredHeight();
  const reduce = useMotionPreference(reducedMotion);
  return (
    <MotionSurface
      {...props}
      initial={false}
      animate={{ height: height ?? "auto" }}
      transition={tween(reduce ? 0 : duration, reduce ? 0 : delay)}
      style={{ ...style, overflow: "clip" }}
    >
      <div ref={ref} style={{ display: "flow-root" }}>
        {children}
      </div>
    </MotionSurface>
  );
}
