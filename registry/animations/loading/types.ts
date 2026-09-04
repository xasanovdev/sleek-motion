import type { ComponentPropsWithRef, CSSProperties } from "react";

export type LoaderProps = Omit<ComponentPropsWithRef<"span">, "children"> & {
  label?: string;
  paused?: boolean;
  reducedMotion?: boolean;
  /** A full animation cycle in seconds. */
  duration?: number;
};
export function loaderStyle(style: CSSProperties | undefined, duration: number): CSSProperties {
  return { ...style, "--sm-duration": `${Math.max(0.1, duration)}s` } as CSSProperties;
}
