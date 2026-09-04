"use client";

import { ArrowPathIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export function PlaygroundHeader({
  className,
  label,
  onReplay,
  replayLabel,
}: {
  className?: string;
  label: string;
  onReplay: () => void;
  replayLabel: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-3 border-b border-zinc-950/8 px-5 py-3 sm:px-6",
        className,
      )}
    >
      <div className="flex items-center gap-4 text-base/7 sm:text-sm/6">
        <div aria-hidden="true" className="hidden items-center gap-1.5 sm:flex">
          <span className="size-2 rounded-full bg-zinc-300" />
          <span className="size-2 rounded-full bg-zinc-200" />
          <span className="size-2 rounded-full bg-zinc-200" />
        </div>
        <span className="font-medium text-zinc-950">{label}</span>
      </div>
      <div className="text-base/7 sm:text-sm/6">
        <button
          type="button"
          aria-label={replayLabel}
          onClick={onReplay}
          className="pressable inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-medium text-zinc-600 outline-none hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <ArrowPathIcon className="size-4 h-lh shrink-0 fill-current" />
          <span className="hidden min-[375px]:inline">{replayLabel}</span>
        </button>
      </div>
    </div>
  );
}
