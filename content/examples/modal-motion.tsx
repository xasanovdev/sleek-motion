"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { tween } from "../../registry/motion-tokens";
import { modalMotionVariants } from "../../registry/recipes/overlays/modal-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const actions = useRef<Dialog.Root.Actions | null>(null);
  return <Dialog.Root open={open} onOpenChange={setOpen} actionsRef={actions}>
    <Dialog.Trigger>Open dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop style={{ position: "absolute", inset: 0, background: "rgb(24 24 27 / .25)", zIndex: 100 }} />
      <Dialog.Popup className="ui-example-popup" render={<motion.div initial="hidden" animate={open ? "visible" : "hidden"} variants={modalMotionVariants} custom={{ reducedMotion }} transition={tween(.2 / speed)} onAnimationComplete={() => { if (!open) actions.current?.unmount(); }} />} style={{ position: "fixed", zIndex: 101, top: "50%", left: "50%", translate: "-50% -50%", width: "min(360px, calc(100vw - 32px))", padding: 28, borderRadius: 16, background: "white", outline: "none" }}>
        <Dialog.Title>Collection settings</Dialog.Title>
        <Dialog.Description>Base UI manages focus, Escape and dismissal. Sleekmation adds the motion.</Dialog.Description>
        <Dialog.Close>Close dialog</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
