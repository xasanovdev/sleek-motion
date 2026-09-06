"use client";

import { useState } from "react";
import { Pressable } from "../../registry/animations/feedback/pressable";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [count, setCount] = useState(0);
  return <div><Pressable duration={.16 / speed} reducedMotion={reducedMotion} onClick={() => setCount(count + 1)}>Save a change</Pressable><p aria-live="polite">{count ? count + " changes saved." : "Press with your pointer. Keyboard activation stays still."}</p></div>;
}
