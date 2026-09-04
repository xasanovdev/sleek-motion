"use client";

import clsx from "clsx";

import type { Demo, PlaygroundCopy } from "./playground.types";

export function DemoTabs({
  activeDemo,
  className,
  labels,
  onChange,
}: {
  activeDemo: Demo;
  className?: string;
  labels: PlaygroundCopy["tabs"];
  onChange: (demo: Demo) => void;
}) {
  return (
    <div className={clsx("border-b border-zinc-950/10 p-3 sm:p-4", className)}>
      <div
        role="tablist"
        aria-label="Animation examples"
        className="flex gap-1 overflow-x-auto rounded-xl bg-zinc-950/4 p-1 text-base/7 sm:text-sm/6"
      >
        {(Object.keys(labels) as Demo[]).map((demo) => (
          <button
            key={demo}
            type="button"
            role="tab"
            aria-selected={activeDemo === demo}
            onClick={() => onChange(demo)}
            className="shrink-0 rounded-lg px-3 py-2 font-medium text-zinc-500 outline-none aria-selected:bg-white aria-selected:text-zinc-950 aria-selected:shadow-sm focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            {labels[demo]}
          </button>
        ))}
      </div>
    </div>
  );
}
