"use client";

import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function PlaygroundCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-2xl bg-white shadow-xl shadow-zinc-950/8 ring-1 ring-zinc-950/10",
        className,
      )}
      {...props}
    />
  );
}
