"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DropdownMotion } from "../../registry/recipes/overlays/dropdown-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("Default view");
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  function close() { trigger.current?.focus(); setOpen(false); }
  useEffect(() => { if (!open) return; function outside(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); } document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside); }, [open]);
  return <div ref={root} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}><button ref={trigger} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>Open options</button>
    <div style={{ minHeight: 200, marginTop: 12 }}><DropdownMotion duration={.16 / speed} id={id} show={open} reducedMotion={reducedMotion} style={{ transformOrigin: "left top", background: "white", padding: 20, borderRadius: 12, border: "1px solid #e4e4e7" }}><p>View options</p><button type="button" onClick={() => { setSelection("Compact view"); close(); }}>Compact view</button><button type="button" onClick={() => { setSelection("Comfortable view"); close(); }}>Comfortable view</button><button type="button" onClick={close}>Close panel</button></DropdownMotion></div><p aria-live="polite">{selection}</p></div>;
}
