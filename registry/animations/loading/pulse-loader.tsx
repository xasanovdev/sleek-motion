"use client";

import { LoadingFrame } from "../../internal/loading-frame";
import { loaderStyle, type LoaderProps } from "./types";
import styles from "./loading.module.css";

export function PulseLoader({ duration = 1.2, className, style, ...props }: LoaderProps) {
  return <LoadingFrame {...props} className={[styles.frame, null, className].filter(Boolean).join(" ")}
    style={loaderStyle({ width: "0.75em", height: "0.75em", borderRadius: "50%", ...style }, duration)}><span aria-hidden="true" className={styles.pulse} /></LoadingFrame>;
}
