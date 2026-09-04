"use client";

import type {
  AnimationProps,
  AnimationTag,
  PresenceOptions,
} from "../../internal/types";
import {
  ScaleFade,
  scaleFadeVariants,
  type ScaleFadeOptions,
} from "../../animations/presence/scale-fade";

export const popoverMotionVariants = scaleFadeVariants;
/** Motion only. The consumer owns semantics, focus management and dismissal. */
export function PopoverMotion<T extends AnimationTag = "div">(
  props: AnimationProps<T, PresenceOptions & ScaleFadeOptions>,
) {
  return (
    <ScaleFade<T>
      {...props}
      style={{
        ...props.style,
        transformOrigin:
          props.style?.transformOrigin ?? "var(--transform-origin, center)",
      }}
    />
  );
}
