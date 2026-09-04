"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

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

  return (
    <PlaygroundCard className={clsx(className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500"
      >
        <span className="min-w-0 font-medium text-zinc-950">{copy.collapseTitle}</span>
        <motion.span
          aria-hidden="true"
          animate={{
            transform: open && !reduceMotion ? "rotate(180deg)" : "rotate(0deg)",
          }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="shrink-0"
        >
          <ChevronDownIcon className="size-4 h-lh fill-zinc-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reduceMotion ? 0.12 : 0.24, ease: EASE_OUT },
              opacity: { duration: 0.16, ease: EASE_OUT },
            }}
            className="overflow-clip"
          >
            <p className="border-t border-zinc-950/10 p-5 text-base/7 text-pretty text-zinc-600">
              {copy.collapseBody}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PlaygroundCard>
  );
}
