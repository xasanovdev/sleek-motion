"use client";

import { useState } from "react";
import { Stagger, StaggerItem } from "../../registry/animations/presence/stagger";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [show, setShow] = useState(true);
  return <div><button type="button" onClick={() => setShow(!show)}>Toggle collection</button>
    <div style={{ minHeight: 200, marginTop: 20 }}><Stagger duration={.2 / speed} show={show} interval={0.04} reducedMotion={reducedMotion}>
      {["A place to begin", "Room to explore", "Ready to share"].map((title) => <StaggerItem key={title}><p style={{ padding: 14, marginBlock: 8, background: "white", border: "1px solid #e4e4e7", borderRadius: 8 }}>{title}</p></StaggerItem>)}
    </Stagger></div></div>;
}
