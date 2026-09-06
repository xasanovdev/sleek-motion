"use client";

import { useState } from "react";
import { PageTransition } from "../../registry/animations/viewport/page-transition";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [page, setPage] = useState("Overview");
  return <div><div role="group" aria-label="Preview pages" style={{ display: "flex", gap: 12 }}>{["Overview", "Activity"].map((name) => <button key={name} type="button" aria-pressed={page === name} onClick={() => setPage(name)}>{name}</button>)}</div>
    <div aria-live="polite" style={{ marginTop: 24 }}><PageTransition duration={.2 / speed} contentKey={page} reducedMotion={reducedMotion}><div style={{ padding: 24, minHeight: 150, background: "white", borderRadius: 12 }}><h3>{page}</h3><p>{page === "Overview" ? "Everything your team is working on." : "The latest updates from your team."}</p></div></PageTransition></div>
    <p>This preview swaps page content. Your router owns actual navigation and focus.</p></div>;
}
