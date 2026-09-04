"use client";

import type { AnimationProps, AnimationTag } from "../../internal/types";
import { SharedElement, sharedElementTransition } from "./shared-element";

export const sharedIndicatorTransition = sharedElementTransition;
/** Decorative only. Render inside the active tab/option and position with consumer styles. */
export function SharedIndicator<T extends AnimationTag = "span">({ as, ...props }: AnimationProps<T, { layoutId: string }>) {
  return <SharedElement {...props} as={as ?? "span"} aria-hidden="true" style={{ pointerEvents: "none", ...props.style }} />;
}
