"use client";

import type { AnimationProps, AnimationTag } from "../../internal/types";
import { ContentSwap, contentSwapVariants, type ContentSwapOptions } from "../content/content-swap";

export const pageTransitionVariants = contentSwapVariants;
/** Mount above route content; the consumer owns routing, focus and announcements. */
export function PageTransition<T extends AnimationTag = "div">(props: AnimationProps<T, ContentSwapOptions>) {
  return <ContentSwap<T> {...props} />;
}
