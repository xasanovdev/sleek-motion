"use client";

import { Checkbox } from "@base-ui/react/checkbox";
import { useState } from "react";
import { CheckboxMotion } from "../../registry/animations/feedback/checkbox-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [checked, setChecked] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  return <label onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)} style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <Checkbox.Root name="digest" checked={checked} onCheckedChange={setChecked} style={{ position: "relative", display: "inline-grid", placeItems: "center", width: 28, height: 28, borderRadius: 6, border: "1px solid #0072ce", color: "#0072ce" }}>
      <CheckboxMotion duration={.2 / speed} checked={checked} reducedMotion={reducedMotion || keyboard} style={{ width: 24, height: 24 }} />
</Checkbox.Root>Send me the weekly digest</label>;
}
