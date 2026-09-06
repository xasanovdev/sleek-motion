"use client";

import { useState } from "react";
import { ProgressBar } from "../../registry/animations/loading/progress-bar";

export default function Example({ reducedMotion = false, speed = 1, rtl = false }: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [value, setValue] = useState(35);
  return <div><div style={{ minHeight: 110, display: "grid", placeItems: "center" }}><ProgressBar dir={rtl ? "rtl" : "ltr"} duration={.2 / speed} value={value} label="Upload progress" reducedMotion={reducedMotion} style={{ width: "100%", height: 8, borderRadius: 4, color: "#0072ce" }} /></div>
    <label>Upload progress: {value}%<input name="progress" type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} style={{ width: "100%" }} /></label></div>;
}
