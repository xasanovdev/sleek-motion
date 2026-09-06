"use client";

import type { Key } from "react";
import { ContentSwap, contentSwapVariants } from "../content/content-swap";
import { Pressable, type PressableProps } from "./pressable";

export const iconSwapButtonVariants = contentSwapVariants;
export type IconSwapButtonProps = PressableProps & {
  iconKey: Key;
  "aria-label": string;
};

/** Supply the accessible action label and, for toggles, aria-pressed. */
export function IconSwapButton({
  iconKey,
  children,
  duration = 0.16,
  reducedMotion,
  ...props
}: IconSwapButtonProps) {
  return (
    <Pressable {...props} duration={duration} reducedMotion={reducedMotion}>
      <span aria-hidden="true" style={{ display: "inline-grid" }}>
        <ContentSwap
          as="span"
          contentKey={iconKey}
          mode="sync"
          duration={duration}
          reducedMotion={reducedMotion}
          style={{ gridArea: "1 / 1" }}
        >
          {children}
        </ContentSwap>
      </span>
    </Pressable>
  );
}
