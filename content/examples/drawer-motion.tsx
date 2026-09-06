"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DrawerMotion } from "../../registry/recipes/overlays/drawer-motion";

export default function Example({ reducedMotion = false, speed = 1, rtl = false }: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => { if (open && !dialog.current?.open) dialog.current?.showModal(); }, [open]);
  return <div><button type="button" onClick={() => setOpen(true)}>Open drawer</button>
    <dialog dir={rtl ? "rtl" : "ltr"} ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); setOpen(false); }} style={{ padding: 0, border: 0, width: "min(360px, calc(100vw - 32px))", margin: 0, marginInlineStart: "auto", insetBlock: 0, height: "100dvh", maxHeight: "100dvh", borderRadius: 0, background: "transparent" }}>
      <DrawerMotion dir={rtl ? "rtl" : "ltr"} duration={.2 / speed} show={open} edge={rtl ? "left" : "right"} reducedMotion={reducedMotion} onExitComplete={() => dialog.current?.close()}><div style={{ padding: 28, background: "white", minHeight: "100dvh" }}><h3 id={titleId}>Collection settings</h3><p>A native dialog owns focus trapping, Escape and focus restoration.</p><button type="button" onClick={() => setOpen(false)}>Close drawer</button></div></DrawerMotion>
    </dialog><p>Open the surface, then press Escape or use its close button.</p></div>;
}
