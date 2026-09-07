"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { LoadingSwap } from "../../registry/animations/loading/loading-swap";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [loading, setLoading] = useState(true);
  return <div><Button type="button" onClick={() => setLoading(!loading)}>{loading ? "Resolve content" : "Load again"}</Button><div style={{ marginTop: 24 }}><LoadingSwap duration={.2 / speed} loading={loading} reducedMotion={reducedMotion} fallback={<p role="status">Fetching your collection…</p>}><div style={{ padding: 24, background: "white", borderRadius: 12 }}><h3>Your collection is ready</h3><p>12 saved ideas, all in one place.</p></div></LoadingSwap></div></div>;
}
