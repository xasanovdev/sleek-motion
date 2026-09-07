"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { Reveal } from "../../registry/animations/presence/reveal";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [show, setShow] = useState(true);
  return <div><Button type="button" onClick={() => setShow(!show)}>Toggle reveal</Button>
    <div style={{ minHeight: 160, marginTop: 24 }}><Reveal duration={.2 / speed} show={show} direction="right" reducedMotion={reducedMotion}>
      <div style={{ padding: 28, background: "#e5f2fd", borderRadius: 12 }}><h3>A new perspective</h3><p>Uncover a featured collection.</p></div>
    </Reveal></div></div>;
}
