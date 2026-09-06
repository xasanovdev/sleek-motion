"use client";

import { useState } from "react";
import { Backdrop } from "../../registry/recipes/overlays/backdrop";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [show, setShow] = useState(false);
  return <div><button type="button" aria-pressed={show} onClick={() => setShow(!show)}>Toggle backdrop</button><div style={{ position: "relative", height: 190, marginTop: 20, borderRadius: 12, overflow: "hidden", background: "white" }}><p style={{ padding: 24 }}>Content behind the overlay.</p><Backdrop duration={.2 / speed} show={show} reducedMotion={reducedMotion} aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgb(24 24 27 / .45)" }} /></div></div>;
}
