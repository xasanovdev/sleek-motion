"use client";

import { AnimatePresence, type Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMeasuredHeight } from "../../internal/use-measured-height";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { motionTokens, tween } from "../../motion-tokens";

export type CollapseOptions = {
  open: boolean;
  keepMounted?: boolean;
  initial?: boolean;
  onExitComplete?: () => void;
};
export const collapseVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: ({ height }: { height?: number } = {}) => ({
    height: height ?? "auto",
    opacity: 1,
  }),
};
function CollapsePanel<T extends AnimationTag>({
  open,
  children,
  duration = motionTokens.duration.slow,
  delay = 0,
  reducedMotion,
  style,
  ...props
}: AnimationProps<T, { open: boolean }>) {
  const { ref, height } = useMeasuredHeight();
  const reduce = useMotionPreference(reducedMotion);
  return (
    <MotionSurface
      {...props}
      inert={!open || props.inert || undefined}
      aria-hidden={!open ? true : props["aria-hidden"]}
      custom={{ height }}
      variants={collapseVariants}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      exit="hidden"
      style={{ ...style, overflow: "clip" }}
      transition={{
        height: tween(reduce ? 0 : duration, delay),
        opacity: tween(Math.min(duration, motionTokens.duration.fast), delay),
      }}
    >
      <div ref={ref} style={{ display: "flow-root" }}>
        {children}
      </div>
    </MotionSurface>
  );
}
export function Collapse<T extends AnimationTag = "div">({
  open,
  keepMounted = false,
  initial = false,
  onExitComplete,
  ...props
}: AnimationProps<T, CollapseOptions>) {
  return (
    <AnimatePresence initial={initial} onExitComplete={onExitComplete}>
      {(open || keepMounted) && (
        <CollapsePanel {...props} open={open} key="panel" />
      )}
    </AnimatePresence>
  );
}
