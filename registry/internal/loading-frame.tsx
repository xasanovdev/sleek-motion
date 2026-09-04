"use client";

import { useCallback, useEffect, useRef, useState, type Ref } from "react";
import { MotionSurface } from "./motion-surface";
import { useMotionPreference } from "./use-motion-preference";

function assignRef(ref: Ref<HTMLElement> | undefined, element: HTMLElement | null) {
  if (typeof ref === "function") return ref(element);
  if (ref) ref.current = element;
}
export function LoadingFrame({ ref: forwardedRef, paused = false, reducedMotion, label = "Loading", ...props }: {
  ref?: Ref<HTMLElement>; paused?: boolean; reducedMotion?: boolean; label?: string; [key: string]: unknown;
}) {
  const reduce = useMotionPreference(reducedMotion);
  const node = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const ref = useCallback((element: HTMLElement | null) => {
    node.current = element;
    const cleanup = assignRef(forwardedRef, element);
    return () => { node.current = null; if (typeof cleanup === "function") cleanup(); else assignRef(forwardedRef, null); };
  }, [forwardedRef]);
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  return <MotionSurface as="span" role={label ? "status" : undefined} aria-label={label || undefined} {...props} ref={ref}
    data-running={visible && pageVisible && !paused && !reduce} />;
}
