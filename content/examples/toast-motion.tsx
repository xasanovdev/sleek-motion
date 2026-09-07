"use client";

import { Button } from "@base-ui/react/button";
import { Toast } from "@base-ui/react/toast";
import { motion } from "motion/react";
import { toastMotionVariants } from "../../registry/recipes/overlays/toast-motion";
import { tween } from "../../registry/motion-tokens";

type Settings = { reducedMotion?: boolean; speed?: number };
export default function Example(props: Settings = {}) {
  return <Toast.Provider timeout={0} limit={1}><Notification {...props} /></Toast.Provider>;
}

function Notification({ reducedMotion = false, speed = 1 }: Settings) {
  const manager = Toast.useToastManager();
  const active = manager.toasts.find((toast) => toast.transitionStatus !== "ending");
  return <div><Button onClick={() => active ? manager.close(active.id) : manager.add({ title: "Collection saved", description: "Your changes are ready to share." })}>{active ? "Dismiss notification" : "Show notification"}</Button>
    <Toast.Viewport style={{ minHeight: 170, paddingTop: 24 }}>
      {manager.toasts.map((toast) => <Toast.Root key={toast.id} toast={toast} swipeDirection={[]} render={<motion.div variants={toastMotionVariants} custom={{ direction: "up", reducedMotion }} initial="hidden" animate={toast.transitionStatus === "ending" ? "hidden" : "visible"} transition={tween(.2 / speed)} />} style={{ padding: 24, background: "white", borderRadius: 12, border: "1px solid #e4e4e7" }}>
        <Toast.Title render={<h3 />} /><Toast.Description /><Toast.Close aria-label="Close notification">Close</Toast.Close>
      </Toast.Root>)}
    </Toast.Viewport>
  </div>;
}
