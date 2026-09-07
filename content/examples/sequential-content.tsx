"use client";

import { Button } from "@base-ui/react/button";

import { useState } from "react";
import { SequentialContent } from "../../registry/animations/content/sequential-content";

export default function Example({
  reducedMotion = false,
  speed = 1,
  rtl = false,
}: { reducedMotion?: boolean; speed?: number; rtl?: boolean } = {}) {
  const [step, setStep] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        <Button
          type="button"
          disabled={step === 0}
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={step === 2}
          onClick={() => setStep(step + 1)}
        >
          Next step
        </Button>
      </div>
      <p aria-live="polite">Step {step + 1} of 3</p>
      <SequentialContent
        dir={rtl ? "rtl" : "ltr"}
        duration={0.2 / speed}
        step={step}
        reducedMotion={reducedMotion}
      >
        <div
          style={{
            minHeight: 130,
            padding: 24,
            background: "white",
            borderRadius: 12,
          }}
        >
          <h3>
            {["Choose your space", "Make it personal", "You are ready"][step]}
          </h3>
          <p>Direction follows the step number.</p>
        </div>
      </SequentialContent>
    </div>
  );
}
