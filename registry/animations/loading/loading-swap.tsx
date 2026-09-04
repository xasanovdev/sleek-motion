"use client";

import type { ReactNode } from "react";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import {
  ContentSwap,
  contentSwapVariants,
  type ContentSwapOptions,
} from "../content/content-swap";

export const loadingSwapVariants = contentSwapVariants;
export function LoadingSwap<T extends AnimationTag = "div">({
  loading,
  fallback,
  children,
  ...props
}: AnimationProps<T, { loading: boolean; fallback: ReactNode }>) {
  const swapProps = {
    ...props,
    contentKey: loading ? "loading" : "content",
    "aria-busy": loading,
  } as AnimationProps<T, ContentSwapOptions>;
  return (
    <ContentSwap<T> {...swapProps}>{loading ? fallback : children}</ContentSwap>
  );
}
