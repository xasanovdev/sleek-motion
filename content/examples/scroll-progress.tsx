"use client";

import { useRef } from "react";
import { ScrollProgress } from "../../registry/animations/viewport/scroll-progress";

export default function Example({ rtl = false }: { reducedMotion?: boolean; rtl?: boolean } = {}) {
  const container = useRef<HTMLDivElement>(null);
  return <div><p>Reading progress follows the scroll position.</p><ScrollProgress dir={rtl ? "rtl" : "ltr"} container={container} style={{ height: 4, background: "#0072ce", marginBottom: 12 }} />
    <div ref={container} tabIndex={0} role="region" aria-label="Reading preview" style={{ height: 220, overflowY: "auto", padding: 20, background: "white", borderRadius: 12 }}>
      {["Begin with purpose", "Keep your bearings", "A little restraint", "The final detail"].map((title) => <section key={title} style={{ minHeight: 170 }}><h3>{title}</h3><p>Good motion connects the moments between states and keeps the next step clear.</p></section>)}
    </div></div>;
}
