"use client";

import { Popover } from "@base-ui/react/popover";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { tween } from "../../registry/motion-tokens";
import { popoverMotionVariants } from "../../registry/recipes/overlays/popover-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const actions = useRef<Popover.Root.Actions | null>(null);
  return <Popover.Root open={open} onOpenChange={setOpen} actionsRef={actions}>
    <Popover.Trigger>Open popover</Popover.Trigger>
    <Popover.Portal><Popover.Positioner sideOffset={8} align="start" style={{ zIndex: 100 }}>
      <Popover.Popup className="ui-example-popup" render={<motion.div initial="hidden" animate={open ? "visible" : "hidden"} variants={popoverMotionVariants} custom={{ reducedMotion }} transition={tween(.2 / speed)} onAnimationComplete={() => { if (!open) actions.current?.unmount(); }} />} style={{ transformOrigin: "var(--transform-origin)", width: "min(300px, var(--available-width))", padding: 20, background: "white", borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 30px #18181b1a" }}>
        <Popover.Title>Share this collection</Popover.Title><Popover.Description>Anyone with your link can view it.</Popover.Description><Popover.Close>Close panel</Popover.Close>
      </Popover.Popup>
    </Popover.Positioner></Popover.Portal>
  </Popover.Root>;
}
