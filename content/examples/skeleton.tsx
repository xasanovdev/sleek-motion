"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { Skeleton } from "../../registry/animations/loading/skeleton";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [paused, setPaused] = useState(false);
  return <div><div style={{ minHeight: 120, display: "grid", placeItems: "center" }}><Skeleton duration={1.4 / speed} label="Loading preview" paused={paused} reducedMotion={reducedMotion} style={{ width: "100%", height: 72, borderRadius: 12 }} /></div>
    <Button type="button" onClick={() => setPaused(!paused)}>{paused ? "Resume loader" : "Pause loader"}</Button><p>Loading activity without a made-up completion percentage.</p></div>;
}
