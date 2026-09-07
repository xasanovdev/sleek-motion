"use client";

import { Menu } from "@base-ui/react/menu";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { tween } from "../../registry/motion-tokens";
import { dropdownMotionVariants } from "../../registry/recipes/overlays/dropdown-motion";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState("Comfortable view");
  const actions = useRef<Menu.Root.Actions | null>(null);
  return <div><Menu.Root open={open} onOpenChange={setOpen} actionsRef={actions}>
    <Menu.Trigger>Open options</Menu.Trigger>
    <Menu.Portal><Menu.Positioner sideOffset={8} align="start" style={{ zIndex: 100 }}>
      <Menu.Popup aria-label="View options" render={<motion.div initial="hidden" animate={open ? "visible" : "hidden"} variants={dropdownMotionVariants} custom={{ reducedMotion }} transition={tween(.16 / speed)} onAnimationComplete={() => { if (!open) actions.current?.unmount(); }} />} style={{ transformOrigin: "var(--transform-origin)", minWidth: 200, background: "white", padding: 6, borderRadius: 12, border: "1px solid #e4e4e7", boxShadow: "0 8px 30px #18181b1a" }}>
        {["Compact view", "Comfortable view"].map((name) => <Menu.Item key={name} onClick={() => setSelection(name)} style={(state) => ({ padding: 12, borderRadius: 6, background: state.highlighted ? "#f0f7fd" : "transparent", color: state.highlighted ? "#005da8" : "#3f3f46", outline: "none", cursor: "default" })}>{name}</Menu.Item>)}
        <Menu.Item onClick={() => setOpen(false)} style={(state) => ({ padding: 12, borderRadius: 6, background: state.highlighted ? "#f0f7fd" : "transparent", outline: "none" })}>Close panel</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner></Menu.Portal>
  </Menu.Root><p aria-live="polite">{selection}</p></div>;
}
