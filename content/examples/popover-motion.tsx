"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PopoverMotion } from "../../registry/recipes/overlays/popover-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  function close() { trigger.current?.focus(); setOpen(false); }
  useEffect(() => { if (!open) return; function outside(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); } document.addEventListener("pointerdown", outside); return () => document.removeEventListener("pointerdown", outside); }, [open]);
  return <div ref={root} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}><button ref={trigger} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>Open popover</button>
    <div style={{ minHeight: 200, marginTop: 12 }}><PopoverMotion duration={.2 / speed} id={id} show={open} reducedMotion={reducedMotion} style={{ transformOrigin: "left top", background: "white", padding: 20, borderRadius: 12, border: "1px solid #e4e4e7" }}><h3>Share this collection</h3><p>Anyone with your link can view it.</p><button type="button" onClick={close}>Close panel</button></PopoverMotion></div></div>;
}
