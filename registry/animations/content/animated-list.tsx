"use client";

import { AnimatePresence, LayoutGroup } from "motion/react";
import { useId, type Key, type ReactNode } from "react";
import { MotionSurface } from "../../internal/motion-surface";
import type { AnimationProps, AnimationTag } from "../../internal/types";
import { useMotionPreference } from "../../internal/use-motion-preference";
import { layoutTransition, tween } from "../../motion-tokens";
import { slideFadeVariants } from "../presence/slide-fade";

export const animatedListVariants = slideFadeVariants;
export type AnimatedListOptions<Item> = {
  items: readonly Item[];
  getKey: (item: Item) => Key;
  renderItem: (item: Item, index: number) => ReactNode;
  itemAs?: AnimationTag;
  itemClassName?: string;
  initial?: boolean;
};
export function AnimatedList<Item, T extends AnimationTag = "ul">({
  as, items, getKey, renderItem, itemAs = "li", itemClassName, initial = false,
  duration, delay, reducedMotion, style, ...props
}: AnimationProps<T, AnimatedListOptions<Item>>) {
  const id = useId();
  const reduce = useMotionPreference(reducedMotion);
  return <LayoutGroup id={id}>
    <MotionSurface {...props} as={as ?? "ul"} style={{ position: "relative", ...style }}>
      <AnimatePresence initial={initial} mode="popLayout">
        {items.map((item, index) => <MotionSurface key={getKey(item)} as={itemAs} className={itemClassName}
          layout={reduce ? false : "position"} custom={{ reducedMotion: reduce }} variants={animatedListVariants}
          initial="hidden" animate="visible" exit="hidden" transition={{ ...tween(duration, delay), layout: layoutTransition }}>
          {renderItem(item, index)}
        </MotionSurface>)}
      </AnimatePresence>
    </MotionSurface>
  </LayoutGroup>;
}
