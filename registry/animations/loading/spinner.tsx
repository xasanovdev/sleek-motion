"use client";

import { LoadingFrame } from "../../internal/loading-frame";
import { loaderStyle, type LoaderProps } from "./types";
import styles from "./loading.module.css";

export function Spinner({ duration = 0.7, className, style, ...props }: LoaderProps) {
  return <LoadingFrame {...props} className={[styles.frame, null, className].filter(Boolean).join(" ")}
    style={loaderStyle({ width: "1em", height: "1em", borderRadius: "50%", ...style }, duration)}><span aria-hidden="true" className={styles.spinner} /></LoadingFrame>;
}
