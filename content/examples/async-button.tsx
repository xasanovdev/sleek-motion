"use client";

import { useEffect, useRef, useState } from "react";
import { AsyncButton } from "../../registry/animations/feedback/async-button";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fail, setFail] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function save() { if (status === "loading") return; setStatus("loading"); timer.current = setTimeout(() => setStatus(fail ? "error" : "success"), 900); }
  return <div><AsyncButton duration={.16 / speed} status={status} reducedMotion={reducedMotion} onClick={save} loadingContent="Saving…" successContent="Saved" errorContent="Try again">Save changes</AsyncButton>
    <p><label><input name="simulate-error" type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} /> Simulate an error</label></p><p role="status">{status === "success" ? "Changes saved successfully." : status === "error" ? "Could not save. Try again." : "Try the complete save flow."}</p></div>;
}
