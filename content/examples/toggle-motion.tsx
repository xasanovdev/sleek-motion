"use client";

import { useState } from "react";
import { ToggleMotion } from "../../registry/animations/feedback/toggle-motion";

export default function Example({
  reducedMotion = false,
  speed = 1,
  rtl = false,
}: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [checked, setChecked] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  return (
    <label
      onKeyDown={() => setKeyboard(true)}
      onPointerDown={() => setKeyboard(false)}
      style={{ display: "flex", alignItems: "center", gap: 16 }}
    >
      <span
        style={{
          position: "relative",
          display: "inline-block",
          direction: rtl ? "rtl" : "ltr",
          width: 44,
          height: 28,
          padding: 4,
          borderRadius: 20,
          background: checked ? "#0072ce" : "#d4d4d8",
        }}
      >
        <ToggleMotion
          dir={rtl ? "rtl" : "ltr"}
          duration={0.2 / speed}
          checked={checked}
          distance={16}
          reducedMotion={reducedMotion || keyboard}
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "white",
          }}
        />
        <input
          name="notifications"
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
      </span>
      Notifications {checked ? "on" : "off"}
    </label>
  );
}
