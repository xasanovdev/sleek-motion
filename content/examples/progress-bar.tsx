"use client";

import { Slider } from "@base-ui/react/slider";
import { useState } from "react";
import { ProgressBar } from "../../registry/animations/loading/progress-bar";

export default function Example({ reducedMotion = false, speed = 1, rtl = false }: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [value, setValue] = useState(35);
  return <div><div style={{ minHeight: 110, display: "grid", placeItems: "center" }}><ProgressBar dir={rtl ? "rtl" : "ltr"} duration={.2 / speed} value={value} label="Upload progress" reducedMotion={reducedMotion} style={{ width: "100%", height: 8, borderRadius: 4, color: "#0072ce" }} /></div>
    <Slider.Root name="progress" min={0} max={100} value={value} onValueChange={setValue}>
      <div>Upload progress: <Slider.Value />%</div>
      <Slider.Control style={{ display: "flex", alignItems: "center", height: 48, touchAction: "none" }}>
        <Slider.Track style={{ position: "relative", width: "100%", height: 6, borderRadius: 4, background: "#e4e4e7" }}>
          <Slider.Indicator style={{ borderRadius: 4, background: "#0072ce" }} />
          <Slider.Thumb aria-label="Upload progress" style={{ width: 20, height: 20, borderRadius: "50%", background: "white", border: "2px solid #0072ce" }} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root></div>;
}
