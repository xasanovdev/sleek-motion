"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => true;

/** A stable SSR fallback and live updates if the OS preference changes. */
export function useMotionPreference(reducedMotion = false) {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot) || reducedMotion;
}
