import type { ComponentPropsWithRef } from "react";
import type { HTMLMotionProps } from "motion/react";

export type AnimationTag = keyof HTMLElementTagNameMap & keyof React.JSX.IntrinsicElements;
export type AnimationProps<T extends AnimationTag = "div", Own = object> = Own & {
  as?: T;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
  /** Skip movement even when the system allows it. */
  reducedMotion?: boolean;
} & Omit<HTMLMotionProps<T>, keyof Own | "as" | "ref" | "initial" | "animate" | "exit" | "variants" | "transition" | "custom" | "whileInView" | "whileHover" | "whileTap" | "layout" | "layoutId"> & {
  ref?: ComponentPropsWithRef<T>["ref"];
};
export type PresenceOptions = {
  show?: boolean;
  /** Opt in to animating content already visible on the first render. */
  initial?: boolean;
  onExitComplete?: () => void;
};
export type Direction = "up" | "down" | "left" | "right";
