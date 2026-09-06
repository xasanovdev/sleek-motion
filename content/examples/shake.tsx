"use client";

import { useState } from "react";
import { Shake } from "../../registry/animations/feedback/shake";

export default function Example({ reducedMotion = false, speed = 1 }: { reducedMotion?: boolean; speed?: number } = {}) {
  const [attempt, setAttempt] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  return <div onKeyDown={() => setKeyboard(true)} onPointerDown={() => setKeyboard(false)}><Shake duration={.24 / speed} trigger={attempt} reducedMotion={reducedMotion || keyboard}><div style={{ padding: 24, background: "white", borderRadius: 12 }}><h3>Invite code</h3><p>DEMO-CODE</p></div></Shake>
    <p role="status">{attempt > 0 ? "This code has expired. Request a new invitation." : "Try an expired code to see error feedback."}</p><button type="button" onClick={() => setAttempt(attempt + 1)}>Check code</button></div>;
}
