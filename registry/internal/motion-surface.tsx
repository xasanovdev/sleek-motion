"use client";

import { motion, useIsPresent } from "motion/react";
import type { ElementType } from "react";
import type { AnimationTag } from "./types";

// Public components retain tag-specific DOM/ref types. This boundary only selects
// a built-in Motion element; it never creates a new component during render.
export function MotionSurface({
  as = "div",
  ...props
}: {
  as?: AnimationTag;
  [key: string]: unknown;
}) {
  const present = useIsPresent();
  const Element = motion[as] as ElementType;
  return (
    <Element
      {...props}
      inert={!present || props.inert || undefined}
      aria-hidden={!present ? true : props["aria-hidden"]}
    />
  );
}
