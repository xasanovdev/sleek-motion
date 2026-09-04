"use client";

import { motion, type SVGMotionProps, type Variants } from "motion/react";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";

export const checkboxMotionVariants: Variants = { unchecked: { pathLength: 0, opacity: 0 }, checked: { pathLength: 1, opacity: 1 } };
export type CheckboxMotionProps = Omit<SVGMotionProps<SVGSVGElement>, "initial" | "animate" | "exit" | "transition" | "children"> & { checked: boolean; duration?: number; reducedMotion?: boolean };
/** Decorative checkmark. Pair with a native checkbox or accessible checkbox primitive. */
export function CheckboxMotion({ checked, duration, reducedMotion, ...props }: CheckboxMotionProps) {
  const reduce = useMotionPreference(reducedMotion);
  return <motion.svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true" focusable="false">
    <motion.path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      variants={checkboxMotionVariants} initial={false} animate={checked ? "checked" : "unchecked"} transition={tween(reduce ? 0 : duration)} />
  </motion.svg>;
}
