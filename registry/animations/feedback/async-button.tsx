"use client";

import type { ReactNode } from "react";
import { ContentSwap, contentSwapVariants } from "../content/content-swap";
import { Pressable, type PressableProps } from "./pressable";

export const asyncButtonVariants = contentSwapVariants;
export type AsyncButtonStatus = "idle" | "loading" | "success" | "error";
export type AsyncButtonProps = PressableProps & {
  status: AsyncButtonStatus;
  loadingContent?: ReactNode;
  successContent?: ReactNode;
  errorContent?: ReactNode;
};

/** Controlled feedback; fetching and status reset belong to the consumer. */
export function AsyncButton({
  status,
  children,
  loadingContent = "Loading…",
  successContent = "Done",
  errorContent = "Try again",
  duration = 0.16,
  reducedMotion,
  onClick,
  ...props
}: AsyncButtonProps) {
  const loading = status === "loading";
  const content = { idle: children, loading: loadingContent, success: successContent, error: errorContent }[status];

  return (
    <Pressable
      {...props}
      duration={duration}
      reducedMotion={reducedMotion}
      aria-busy={loading}
      aria-disabled={loading || props["aria-disabled"]}
      data-status={status}
      onClick={(event) => {
        // Keep the button focusable during loading without allowing another submit.
        if (loading) { event.preventDefault(); return; }
        onClick?.(event);
      }}
    >
      <span style={{ display: "inline-grid" }}>
        <ContentSwap as="span" contentKey={status} mode="sync"
          duration={duration} reducedMotion={reducedMotion} style={{ gridArea: "1 / 1" }}>
          {content}
        </ContentSwap>
      </span>
    </Pressable>
  );
}
