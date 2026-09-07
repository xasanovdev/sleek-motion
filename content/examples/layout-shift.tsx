"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { LayoutShift } from "../../registry/animations/layout/layout-shift";

export default function Example({ reducedMotion = false }: { reducedMotion?: boolean } = {}) {
  const [reverse, setReverse] = useState(false);
  return <div><Button type="button" onClick={() => setReverse(!reverse)}>Reorder priorities</Button><div style={{ display: "flex", flexDirection: reverse ? "column-reverse" : "column", gap: 12, marginTop: 24 }}>
    {["Design review", "Motion pass", "Ready to ship"].map((title) => <LayoutShift key={title} reducedMotion={reducedMotion} style={{ padding: 16, background: "white", borderRadius: 8 }}>{title}</LayoutShift>)}
  </div></div>;
}
