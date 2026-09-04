"use client";

import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { layoutTransition } from "../../motion-tokens";

export const sharedIndicatorTransition = layoutTransition;
/** Decorative only; position inside the active option. Scope IDs with LayoutGroup. */
export function SharedIndicator<T extends AnimationTag = "span">({
  as,
  layoutId,
  reducedMotion,
  style,
  ...props
}: Omit<AnimationProps<T, { layoutId: string }>, "duration" | "delay">) {
  const reduce = useMotionPreference(reducedMotion);
  return (
    <MotionSurface
      {...props}
      as={as ?? "span"}
      layoutId={reduce ? undefined : layoutId}
      transition={sharedIndicatorTransition}
      aria-hidden="true"
      style={{ ...style, pointerEvents: "none" }}
    />
  );
}
