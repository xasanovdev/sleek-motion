"use client";

import { useState } from "react";
import { ToastMotion } from "../../registry/recipes/overlays/toast-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [show, setShow] = useState(false);
  return <div><button type="button" onClick={() => setShow(!show)}>{show ? "Dismiss notification" : "Show notification"}</button><div role="status" aria-live="polite" style={{ minHeight: 170, paddingTop: 24 }}><ToastMotion duration={.2 / speed} show={show} reducedMotion={reducedMotion} direction="up"><div style={{ padding: 24, background: "white", borderRadius: 12, border: "1px solid #e4e4e7" }}><h3>Collection saved</h3><p>Your changes are ready to share.</p></div></ToastMotion></div></div>;
}
