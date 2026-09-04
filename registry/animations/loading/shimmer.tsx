"use client";

import type { ReactNode } from "react";
import { LoadingFrame } from "../../internal/loading-frame";
import { loaderStyle, type LoaderProps } from "./types";
import styles from "./loading.module.css";

export function Shimmer({ duration = 1.4, children, className, style, ...props }: LoaderProps & { children?: ReactNode }) {
  return <LoadingFrame {...props} className={[styles.frame, styles.skeleton, className].filter(Boolean).join(" ")}
    style={loaderStyle(style, duration)}>{children}<span aria-hidden="true" className={styles.sheen} /></LoadingFrame>;
}
