"use client";

import { useState, type ComponentPropsWithRef } from "react";
import { motion, type Variants } from "motion/react";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";

export const pressableVariants: Variants = { idle: { transform: "scale(1)" }, pressed: ({ scale = 0.97 } = {}) => ({ transform: `scale(${scale})` }) };
export type PressableProps = ComponentPropsWithRef<"button"> & { scale?: number; duration?: number; reducedMotion?: boolean };
/** Native button semantics; only a pointer press produces spatial feedback. */
export function Pressable({
  scale = 0.97, duration = 0.16, reducedMotion, disabled, type = "button",
  onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onBlur, ...props
}: PressableProps) {
  const [pressed, setPressed] = useState(false);
  const reduce = useMotionPreference(reducedMotion);
  return <motion.button {...props} type={type} disabled={disabled} initial={false}
    variants={pressableVariants} custom={{ scale }} animate={pressed && !disabled && !reduce ? "pressed" : "idle"}
    transition={tween(reduce ? 0 : duration)}
    onPointerDown={(event) => { onPointerDown?.(event); if (!event.defaultPrevented && event.button === 0 && !disabled) setPressed(true); }}
    onPointerUp={(event) => { setPressed(false); onPointerUp?.(event); }}
    onPointerCancel={(event) => { setPressed(false); onPointerCancel?.(event); }}
    onPointerLeave={(event) => { setPressed(false); onPointerLeave?.(event); }}
    onBlur={(event) => { setPressed(false); onBlur?.(event); }} />;
}
