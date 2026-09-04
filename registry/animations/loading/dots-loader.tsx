"use client";

import { LoadingFrame } from "../../internal/loading-frame";
import { loaderStyle, type LoaderProps } from "./types";
import styles from "./loading.module.css";

export function DotsLoader({ duration = 0.9, className, style, ...props }: LoaderProps) {
  return <LoadingFrame {...props} className={[styles.frame, styles.dots, className].filter(Boolean).join(" ")}
    style={loaderStyle({ ...style }, duration)}>{[0, 1, 2].map((dot) => <span key={dot} aria-hidden="true" className={styles.dot} />)}</LoadingFrame>;
}
