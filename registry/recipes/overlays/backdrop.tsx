"use client";

import type {
  AnimationProps,
  AnimationTag,
  PresenceOptions,
} from "../../internal/types";
import { Fade, fadeVariants } from "../../animations/presence/fade";

export const backdropVariants = fadeVariants;
/** Motion only. The consumer owns semantics, focus management and dismissal. */
export function Backdrop<T extends AnimationTag = "div">(
  props: AnimationProps<T, PresenceOptions>,
) {
  return <Fade<T> {...props} />;
}
