"use client";

import clsx from "clsx";

import type { Demo } from "./playground.types";

const snippets: Record<Demo, readonly string[]> = {
  fade: ["<Fade show={saved}>", "  <SuccessMessage />", "</Fade>"],
  swap: [
    "<DirectionalContentSwap",
    "  contentKey={step}",
    "  direction={direction}",
    ">",
    "  <StepContent />",
    "</DirectionalContentSwap>",
  ],
  collapse: ["<Collapse open={isOpen}>", "  <PanelContent />", "</Collapse>"],
};

export function CodePreview({
  className,
  demo,
}: {
  className?: string;
  demo: Demo;
}) {
  return (
    <div
      className={clsx(
        "overflow-x-auto border-t border-zinc-950/10 bg-zinc-950 p-5 sm:p-6",
        className,
      )}
    >
      <pre className="min-w-max font-mono text-base/7 text-zinc-300 sm:text-sm/6">
        <code>
          {snippets[demo].map((line, index) => (
            <span key={`${line}-${index}`} className="flex gap-4">
              <span className="w-4 shrink-0 select-none text-right text-zinc-600 tabular-nums">
                {index + 1}
              </span>
              <span className={index === 0 ? "text-brand-400" : undefined}>
                {line || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
