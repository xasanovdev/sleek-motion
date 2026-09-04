"use client";

import { useCallback, useEffect, useRef, type Ref } from "react";
import { useAnimationControls } from "motion/react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { tween } from "../../motion-tokens";
import {
  slideFadeVariants,
  type SlideFadeOptions,
} from "../presence/slide-fade";

export const scrollRevealVariants = slideFadeVariants;
/** SSR and initially visible content stay visible; below-fold content reveals on entry. */
export function ScrollReveal<T extends AnimationTag = "div">({
  once = true,
  amount = 0.2,
  margin = "0px",
  direction = "up",
  distance,
  duration,
  delay,
  reducedMotion,
  ref: forwardedRef,
  ...props
}: AnimationProps<
  T,
  SlideFadeOptions & { once?: boolean; amount?: number; margin?: string }
>) {
  const reduce = useMotionPreference(reducedMotion);
  const controls = useAnimationControls();
  const node = useRef<HTMLElement | null>(null);
  const revealed = useRef(false);
  const ref = useCallback(
    (element: HTMLElement | null) => {
      node.current = element;
      const outer = forwardedRef as Ref<HTMLElement> | undefined;
      const cleanup = typeof outer === "function" ? outer(element) : undefined;
      if (outer && typeof outer !== "function") outer.current = element;
      return () => {
        node.current = null;
        if (typeof cleanup === "function") cleanup();
        else if (typeof outer === "function") outer(null);
        else if (outer) outer.current = null;
      };
    },
    [forwardedRef],
  );
  useEffect(() => {
    if (reduce || (once && revealed.current)) {
      controls.set("visible");
      return;
    }
    const element = node.current;
    if (!element) return;
    let first = true;
    const threshold = Math.min(1, Math.max(0, amount));
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inside =
          entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (first) controls.set(inside ? "visible" : "hidden");
        else void controls.start(inside ? "visible" : "hidden");
        first = false;
        if (inside) {
          revealed.current = true;
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduce, once, amount, margin, controls]);
  return (
    <MotionSurface
      {...props}
      ref={ref}
      initial="visible"
      animate={controls}
      custom={{ direction, distance, reducedMotion: reduce }}
      variants={scrollRevealVariants}
      transition={tween(duration, reduce ? 0 : delay)}
    />
  );
}
