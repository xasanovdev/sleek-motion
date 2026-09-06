"use client";

import { useState } from "react";
import { CircularProgress } from "../../registry/animations/loading/circular-progress";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [value, setValue] = useState(35);
  return <div><div style={{ minHeight: 110, display: "grid", placeItems: "center" }}><CircularProgress duration={.2 / speed} value={value} label="Upload progress" reducedMotion={reducedMotion} style={{ width: 80, height: 80, color: "#0072ce" }} /></div>
    <label>Upload progress: {value}%<input name="progress" type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} style={{ width: "100%" }} /></label></div>;
}
