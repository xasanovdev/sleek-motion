"use client";

import { useId, useState } from "react";
import { SharedElement } from "../../registry/animations/content/shared-element";
import { LayoutGroup } from "motion/react";

export default function Example({ reducedMotion = false }: { reducedMotion?: boolean } = {}) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return <LayoutGroup id={id}><div><button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>Resize preview</button>
    <div style={{ minHeight: 220, display: "grid", placeItems: "center", marginTop: 20 }}>
      {expanded ? <SharedElement key="large" layoutId="cover" reducedMotion={reducedMotion} style={{ width: "100%", height: 210, background: "#d9edfd", borderRadius: 20, padding: 24 }}><h3>Weekend collection</h3><p>A closer look at the same object.</p></SharedElement> : <SharedElement key="small" layoutId="cover" reducedMotion={reducedMotion} style={{ width: 120, height: 140, background: "#d9edfd", borderRadius: 12, padding: 18 }}>Weekend collection</SharedElement>}
    </div></div></LayoutGroup>;
}
