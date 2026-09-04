"use client";

import type {
  AnimationProps,
  AnimationTag,
  PresenceOptions,
} from "../../internal/types";
import {
  SlideFade,
  slideFadeVariants,
  type SlideFadeOptions,
} from "../../animations/presence/slide-fade";

export const toastMotionVariants = slideFadeVariants;
/** Motion only. The consumer owns semantics, focus management and dismissal. */
export function ToastMotion<T extends AnimationTag = "div">(
  props: AnimationProps<T, PresenceOptions & SlideFadeOptions>,
) {
  return <SlideFade<T> {...props} />;
}
