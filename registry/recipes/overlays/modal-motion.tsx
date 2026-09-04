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

export const modalMotionVariants = scaleFadeVariants;
/** Motion only. The consumer owns semantics, focus management and dismissal. */
export function ModalMotion<T extends AnimationTag = "div">(
  props: AnimationProps<T, PresenceOptions & ScaleFadeOptions>,
) {
  return (
    <ScaleFade<T>
      {...props}
      style={{ ...props.style, transformOrigin: "center" }}
    />
  );
}
