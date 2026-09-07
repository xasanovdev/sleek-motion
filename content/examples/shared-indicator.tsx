"use client";

import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";

import { useId, useState } from "react";
import { SharedIndicator } from "../../registry/animations/content/shared-indicator";
import { LayoutGroup } from "motion/react";

export default function Example({ reducedMotion = false }: { reducedMotion?: boolean } = {}) {
  const [selected, setSelected] = useState("Monthly");
  const [keyboard, setKeyboard] = useState(false);
  const id = useId();
  return <LayoutGroup id={id}><div><ToggleGroup value={[selected]} onValueChange={(values) => { if (values.length) setSelected(values[0]); }} aria-label="Billing period" onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)} style={{ display: "flex", gap: 4 }}>
    {["Monthly", "Yearly"].map((label) => <Toggle type="button" key={label} value={label} style={{ position: "relative", flex: 1, padding: 18 }}>
      {selected === label && <SharedIndicator layoutId="selection" reducedMotion={reducedMotion || keyboard} style={{ position: "absolute", insetInline: 16, bottom: 4, height: 3, background: "#0072ce", borderRadius: 3 }} />}{label}
    </Toggle>)}
  </ToggleGroup><p aria-live="polite">{selected} billing selected.</p></div></LayoutGroup>;
}
