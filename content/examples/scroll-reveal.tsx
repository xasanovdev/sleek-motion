"use client";

import { useRef } from "react";
import { ScrollReveal } from "../../registry/animations/viewport/scroll-reveal";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const container = useRef<HTMLDivElement>(null);
  return <div><p>Scroll inside the preview to reveal the next card.</p><div ref={container} tabIndex={0} role="region" aria-label="Scroll reveal preview" style={{ height: 220, overflowY: "auto", border: "1px solid #e4e4e7", borderRadius: 12, padding: 20 }}>
    <div style={{ height: 250 }}>Keep scrolling ↓</div><ScrollReveal duration={0.2 / speed} once={false} reducedMotion={reducedMotion}><div style={{ padding: 24, background: "#e5f2fd", borderRadius: 12 }}><h3>Just in view</h3><p>Content appears as it enters the viewport.</p></div></ScrollReveal><div style={{ height: 200 }} />
  </div><button type="button" onClick={() => container.current?.scrollTo({ top: 0, behavior: "instant" })}>Reset scroll</button></div>;
}
