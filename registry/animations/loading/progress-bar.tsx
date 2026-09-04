"use client";

import { motion } from "motion/react";
import { LoadingFrame } from "../../internal/loading-frame";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";
import { loaderStyle, type LoaderProps } from "./types";
import styles from "./loading.module.css";

export function progressRatio(value: number, max: number) {
  return Number.isFinite(value) && Number.isFinite(max) && max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
}
export type ProgressBarProps = LoaderProps & { value?: number; max?: number };
export function ProgressBar({ value, max = 100, label = "Progress", duration = 0.2, reducedMotion, style, className, ...props }: ProgressBarProps) {
  const reduce = useMotionPreference(reducedMotion);
  const validMax = Number.isFinite(max) && max > 0 ? max : 100;
  const ratio = value === undefined ? undefined : progressRatio(value, validMax);
  return <LoadingFrame {...props} reducedMotion={reducedMotion} label={label} role="progressbar"
    aria-valuemin={0} aria-valuemax={validMax} aria-valuenow={ratio === undefined ? undefined : ratio * validMax}
    className={[styles.frame, className].filter(Boolean).join(" ")}
    style={loaderStyle({ display: "block", width: "100%", height: "0.25em", overflow: "hidden", background: "color-mix(in srgb, currentColor 12%, transparent)", ...style }, 1.2)}>
    {ratio === undefined ? <span aria-hidden="true" className={styles.indeterminate} /> :
      <motion.span aria-hidden="true" initial={false} animate={{ transform: `scaleX(${ratio})` }} transition={tween(reduce ? 0 : duration)}
        style={{ display: "block", width: "100%", height: "100%", background: "currentColor", transformOrigin: props.dir === "rtl" ? "right" : "left" }} />}
  </LoadingFrame>;
}
