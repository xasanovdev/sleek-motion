"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { PulseLoader } from "../../registry/animations/loading/pulse-loader";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [paused, setPaused] = useState(false);
  return <div><div style={{ minHeight: 120, display: "grid", placeItems: "center" }}><PulseLoader duration={1.2 / speed} label="Loading preview" paused={paused} reducedMotion={reducedMotion} style={{ fontSize: 32, color: "#0072ce" }} /></div>
    <Button type="button" onClick={() => setPaused(!paused)}>{paused ? "Resume loader" : "Pause loader"}</Button><p>Loading activity without a made-up completion percentage.</p></div>;
}
