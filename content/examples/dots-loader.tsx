"use client";

import { useState } from "react";
import { DotsLoader } from "../../registry/animations/loading/dots-loader";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [paused, setPaused] = useState(false);
  return <div><div style={{ minHeight: 120, display: "grid", placeItems: "center" }}><DotsLoader duration={.9 / speed} label="Loading preview" paused={paused} reducedMotion={reducedMotion} style={{ fontSize: 32, color: "#0072ce" }} /></div>
    <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Resume loader" : "Pause loader"}</button><p>Loading activity without a made-up completion percentage.</p></div>;
}
