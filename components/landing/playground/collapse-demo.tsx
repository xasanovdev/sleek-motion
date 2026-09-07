"use client";

import { Button } from "@/components/ui/button";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { motion } from "motion/react";
import { useId, useState } from "react";

import { Collapse } from "@/registry/animations/layout/collapse";

import { PlaygroundCard } from "./playground-card";
import type { PlaygroundCopy } from "./playground.types";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function CollapseDemo({
  className,
  copy,
  reduceMotion,
}: {
  className?: string;
  copy: PlaygroundCopy;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(true);
  const panelId = useId();

  return (
    <PlaygroundCard className={clsx(className)}>
      <Button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500"
      >
        <span className="min-w-0 font-medium text-zinc-950">{copy.collapseTitle}</span>
        <motion.span
          aria-hidden="true"
          animate={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT }}
          className="shrink-0"
        >
          <ChevronDownIcon className="size-4 h-lh fill-zinc-500" />
        </motion.span>
      </Button>
      <Collapse id={panelId} open={open} reducedMotion={reduceMotion}>
        <p className="border-t border-zinc-950/10 p-5 text-base/7 text-pretty text-zinc-600">
          {copy.collapseBody}
        </p>
      </Collapse>
    </PlaygroundCard>
  );
}
