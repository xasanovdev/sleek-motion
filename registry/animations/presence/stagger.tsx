"use client";

import { createContext, useContext } from "react";
import { AnimatePresence, type Variants } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type {
  AnimationProps,
  AnimationTag,
  PresenceOptions,
} from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { motionTokens, tween } from "../../motion-tokens";
import { slideFadeVariants } from "./slide-fade";

const StaggerContext = createContext<{
  reducedMotion: boolean;
  duration?: number;
}>({ reducedMotion: false });

export const staggerVariants: Variants = {
  hidden: {},
  visible: ({
    interval = motionTokens.stagger,
    delay = 0,
    reducedMotion = false,
  } = {}) => ({
    transition: {
      staggerChildren: reducedMotion ? 0 : Math.max(0, interval),
      delayChildren: reducedMotion ? 0 : Math.max(0, delay),
    },
  }),
};
export const staggerItemVariants = slideFadeVariants;
export function Stagger<T extends AnimationTag = "div">({
  show = true,
  initial = false,
  interval = motionTokens.stagger,
  delay = 0,
  duration,
  reducedMotion,
  onExitComplete,
  ...props
}: AnimationProps<T, PresenceOptions & { interval?: number }>) {
  const reduce = useMotionPreference(reducedMotion);
  return (
    <StaggerContext value={{ reducedMotion: reduce, duration }}>
      <AnimatePresence initial={initial} onExitComplete={onExitComplete}>
        {show && (
          <MotionSurface
            {...props}
            key="group"
            custom={{ interval, delay, reducedMotion: reduce }}
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>
    </StaggerContext>
  );
}
export function StaggerItem<T extends AnimationTag = "div">({
  duration,
  delay,
  reducedMotion,
  ...props
}: AnimationProps<T>) {
  const parent = useContext(StaggerContext);
  const reduce = useMotionPreference(reducedMotion || parent.reducedMotion);
  return (
    <MotionSurface
      {...props}
      custom={{ reducedMotion: reduce }}
      variants={staggerItemVariants}
      transition={tween(duration ?? parent.duration, reduce ? 0 : delay)}
    />
  );
}
