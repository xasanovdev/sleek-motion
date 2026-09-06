"use client";

import { useState } from "react";
import { CheckboxMotion } from "../../registry/animations/feedback/checkbox-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [checked, setChecked] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  return <label onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)} style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ position: "relative", display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "1px solid #0072ce", color: "#0072ce" }}>
      <CheckboxMotion duration={.2 / speed} checked={checked} reducedMotion={reducedMotion || keyboard} style={{ width: 24, height: 24 }} />
      <input name="digest" type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
    </span>Send me the weekly digest</label>;
}
