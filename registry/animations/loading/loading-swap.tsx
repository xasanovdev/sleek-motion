"use client";

import type { ReactNode } from "react";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { ContentSwap, contentSwapVariants } from "../content/content-swap";

export const loadingSwapVariants = contentSwapVariants;
export function LoadingSwap<T extends AnimationTag = "div">({ loading, fallback, children, ...props }: AnimationProps<T, { loading: boolean; fallback: ReactNode }>) {
  return <ContentSwap<T> {...props} contentKey={loading ? "loading" : "content"} aria-busy={loading}>
    {loading ? fallback : children}
  </ContentSwap>;
}
