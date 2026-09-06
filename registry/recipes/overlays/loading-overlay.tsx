"use client";

import type {
  AnimationProps,
  AnimationTag,
  PresenceOptions,
} from "../../internal/types";
import { Fade, fadeVariants } from "../../animations/presence/fade";

export const loadingOverlayVariants = fadeVariants;
export type LoadingOverlayOptions = Omit<PresenceOptions, "show"> & {
  loading: boolean;
  label?: string;
};

/** Motion surface only; the consumer owns positioning and blocking the busy region. */
export function LoadingOverlay<T extends AnimationTag = "div">({
  loading,
  label = "Loading…",
  children,
  ...props
}: AnimationProps<T, LoadingOverlayOptions>) {
  const surfaceProps = { ...props, show: loading } as AnimationProps<T, PresenceOptions>;
  return (
    <Fade<T>
      role="status"
      aria-live="polite"
      aria-label={label}
      {...surfaceProps}
    >
      {children ?? label}
    </Fade>
  );
}
