"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { LoadingOverlay } from "../../registry/recipes/overlays/loading-overlay";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [loading, setLoading] = useState(false);
  return <div><Button type="button" onClick={() => setLoading(!loading)}>{loading ? "Finish refresh" : "Refresh collection"}</Button><div style={{ position: "relative", minHeight: 180, marginTop: 24, background: "white", borderRadius: 12, overflow: "hidden" }}><div aria-busy={loading} inert={loading} style={{ padding: 24 }}><h3>Your collection</h3><p>Last updated just now.</p></div><LoadingOverlay duration={.2 / speed} loading={loading} reducedMotion={reducedMotion} label="Refreshing collection" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgb(255 255 255 / .94)", color: "#0072ce" }} /></div></div>;
}
