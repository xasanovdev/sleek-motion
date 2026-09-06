"use client";

import { useState } from "react";
import { AutoHeight } from "../../registry/animations/layout/auto-height";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [expanded, setExpanded] = useState(false);
  return <div><button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>Change content length</button>
    <AutoHeight duration={.2 / speed} reducedMotion={reducedMotion} style={{ marginTop: 20, background: "white", borderRadius: 12 }}><div style={{ padding: 24 }}><h3>Delivery details</h3><p>Your order is on its way.</p>{expanded && <><p>Track each step from our studio to your doorstep.</p><p>We will send a confirmation when it arrives.</p></>}</div></AutoHeight>
    <p>This text follows the changing height.</p></div>;
}
