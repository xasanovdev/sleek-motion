"use client";

import { Button } from "@/components/ui/button";

import clsx from "clsx";
import { useState } from "react";

import { Fade } from "@/registry/animations/presence/fade";

import { PlaygroundCard } from "./playground-card";
import type { PlaygroundCopy } from "./playground.types";

export function FadeDemo({
  className,
  copy,
  reduceMotion,
}: {
  className?: string;
  copy: PlaygroundCopy;
  reduceMotion: boolean;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <PlaygroundCard
      className={clsx("flex min-h-48 flex-col justify-between gap-5 p-5", className)}
    >
      <div className="relative grid flex-1 place-items-center">
        <Fade
          show={visible}
          reducedMotion={reduceMotion}
          className="w-full rounded-xl bg-brand-50 p-4 ring-1 ring-brand-500/15 [grid-area:1/1]"
        >
          <p className="font-medium text-brand-600">{copy.fadeTitle}</p>
          <p className="mt-1 text-base/7 text-zinc-600 sm:text-sm/6">
            {copy.fadeBody}
          </p>
        </Fade>
        {!visible && (
          <p className="text-base/7 text-zinc-400 [grid-area:1/1] sm:text-sm/6">
            {copy.hidden}
          </p>
        )}
      </div>
      <div className="text-base/7 sm:text-sm/6">
        <Button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="pressable w-full rounded-xl bg-zinc-950/5 px-3 py-2.5 font-medium text-zinc-800 outline-none hover:bg-zinc-950/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {visible ? copy.hide : copy.show}
        </Button>
      </div>
    </PlaygroundCard>
  );
}
