"use client";

import { useState } from "react";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import {
  DirectionalContentSwap,
  directionalContentSwapVariants,
  type DirectionalContentSwapOptions,
} from "./directional-content-swap";

export const sequentialContentVariants = directionalContentSwapVariants;
export type SequentialContentOptions = Omit<
  DirectionalContentSwapOptions,
  "contentKey" | "direction"
> & {
  /** Ordered step index. Changing it replaces the content and infers direction. */
  step: number;
};

/** Motion only; the consumer owns navigation, validation and focus between steps. */
export function SequentialContent<T extends AnimationTag = "div">({
  step,
  ...props
}: AnimationProps<T, SequentialContentOptions>) {
  const [previous, setPrevious] = useState<{ step: number; direction: 1 | -1 }>(
    {
      step,
      direction: 1,
    },
  );
  const direction =
    Object.is(step, previous.step) ? previous.direction : step > previous.step ? 1 : -1;

  // Retain the last travel direction across unrelated renders and rapid reversals.
  if (!Object.is(step, previous.step)) setPrevious({ step, direction });

  const swapProps = { ...props, contentKey: step, direction } as AnimationProps<T, DirectionalContentSwapOptions>;

  return (
    <DirectionalContentSwap<T>
      {...swapProps}
    />
  );
}
