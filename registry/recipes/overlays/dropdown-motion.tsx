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

export const dropdownMotionVariants = scaleFadeVariants;
/** Motion only. The consumer owns semantics, focus management and dismissal. */
export function DropdownMotion<T extends AnimationTag = "div">(
  props: AnimationProps<T, PresenceOptions & ScaleFadeOptions>,
) {
  return (
    <ScaleFade<T>
      duration={0.16}
      {...props}
      style={{
        ...props.style,
        transformOrigin:
          props.style?.transformOrigin ?? "var(--transform-origin, top)",
      }}
    />
  );
}
