"use client";

import { motion, type SVGMotionProps } from "motion/react";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";
import { progressRatio } from "./progress-bar";

export type CircularProgressProps = Omit<SVGMotionProps<SVGSVGElement>, "initial" | "animate" | "exit" | "transition" | "children" | "values"> & {
  value: number; max?: number; label?: string; duration?: number; reducedMotion?: boolean;
};
export function CircularProgress({ value, max = 100, label = "Progress", duration, reducedMotion, ...props }: CircularProgressProps) {
  const reduce = useMotionPreference(reducedMotion);
  const validMax = Number.isFinite(max) && max > 0 ? max : 100;
  const ratio = progressRatio(value, validMax);
  return <motion.svg width="1em" height="1em" viewBox="0 0 24 24" {...props} role="progressbar" aria-label={label}
    aria-valuemin={0} aria-valuemax={validMax} aria-valuenow={ratio * validMax}>
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.12" />
    <motion.circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      pathLength={1} strokeDasharray="1 1" transform="rotate(-90 12 12)" initial={false}
      animate={{ strokeDashoffset: 1 - ratio }} transition={tween(reduce ? 0 : duration)} />
  </motion.svg>;
}
