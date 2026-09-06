"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ModalMotion } from "../../registry/recipes/overlays/modal-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => { if (open && !dialog.current?.open) dialog.current?.showModal(); }, [open]);
  return <div><button type="button" onClick={() => setOpen(true)}>Open dialog</button>
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); setOpen(false); }} style={{ margin: "auto", padding: 0, border: 0, width: "min(360px, calc(100vw - 32px))", borderRadius: 16, background: "transparent" }}>
      <ModalMotion duration={.2 / speed} show={open} reducedMotion={reducedMotion} onExitComplete={() => dialog.current?.close()}><div style={{ padding: 28, background: "white", minHeight: 220 }}><h3 id={titleId}>Collection settings</h3><p>A native dialog owns focus trapping, Escape and focus restoration.</p><button type="button" onClick={() => setOpen(false)}>Close dialog</button></div></ModalMotion>
    </dialog><p>Open the surface, then press Escape or use its close button.</p></div>;
}
