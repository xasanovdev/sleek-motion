"use client";

import { useState } from "react";
import { IconSwapButton } from "../../registry/animations/feedback/icon-swap-button";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [saved, setSaved] = useState(false);
  return <div><IconSwapButton duration={.16 / speed} iconKey={String(saved)} aria-label="Save to favorites" aria-pressed={saved} reducedMotion={reducedMotion} onClick={() => setSaved(!saved)}>
    <span style={{ fontSize: 28 }} aria-hidden="true">{saved ? "★" : "☆"}</span>
  </IconSwapButton><p aria-live="polite">{saved ? "Added to favorites." : "Save this collection to your favorites."}</p></div>;
}
