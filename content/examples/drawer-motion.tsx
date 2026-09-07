"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { tween } from "../../registry/motion-tokens";
import { drawerMotionVariants } from "../../registry/recipes/overlays/drawer-motion";

export default function Example({ reducedMotion = false, speed = 1, rtl = false }: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const actions = useRef<Dialog.Root.Actions | null>(null);
  return <Dialog.Root open={open} onOpenChange={setOpen} actionsRef={actions}>
    <Dialog.Trigger>Open drawer</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop style={{ position: "absolute", inset: 0, background: "rgb(24 24 27 / .25)", zIndex: 100 }} />
      <Dialog.Popup className="ui-example-popup" dir={rtl ? "rtl" : "ltr"} render={<motion.div initial="hidden" animate={open ? "visible" : "hidden"} variants={drawerMotionVariants} custom={{ reducedMotion, edge: rtl ? "left" : "right" }} transition={tween(.2 / speed)} onAnimationComplete={() => { if (!open) actions.current?.unmount(); }} />} style={{ position: "fixed", zIndex: 101, top: 0, bottom: 0, right: rtl ? "auto" : 0, left: rtl ? 0 : "auto", width: "min(360px, calc(100vw - 32px))", height: "100dvh", overflowY: "auto", padding: 28, background: "white", outline: "none" }}>
        <Dialog.Title>Collection settings</Dialog.Title>
        <Dialog.Description>Base UI manages focus, Escape and dismissal. Sleekmation adds the motion.</Dialog.Description>
        <Dialog.Close>Close drawer</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
