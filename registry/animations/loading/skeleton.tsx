"use client";

import { Shimmer } from "./shimmer";
import type { LoaderProps } from "./types";

/** Decorative by default; announce loading once on the containing region. */
export function Skeleton({ label = "", style, ...props }: LoaderProps) {
  return <Shimmer {...props} label={label} aria-hidden={label ? undefined : true}
    style={{ display: "block", width: "100%", height: "1em", borderRadius: "0.25em", ...style }} />;
}
