"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { PlaygroundCard } from "./playground-card";
import type { PlaygroundCopy } from "./playground.types";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

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
        <AnimatePresence initial={false} mode="wait">
          {visible ? (
            <motion.div
              key="message"
              initial={{
                opacity: 0,
                transform: reduceMotion ? "none" : "translateY(8px) scale(0.97)",
              }}
              animate={{ opacity: 1, transform: "none" }}
              exit={{
                opacity: 0,
                transform: reduceMotion ? "none" : "translateY(-8px) scale(0.97)",
              }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="w-full rounded-xl bg-brand-50 p-4 ring-1 ring-brand-500/15"
            >
              <p className="font-medium text-brand-600">{copy.fadeTitle}</p>
              <p className="mt-1 text-base/7 text-zinc-600 sm:text-sm/6">
                {copy.fadeBody}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: EASE_OUT }}
              className="text-base/7 text-zinc-400 sm:text-sm/6"
            >
              {copy.hidden}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="text-base/7 sm:text-sm/6">
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="pressable w-full rounded-xl bg-zinc-950/5 px-3 py-2.5 font-medium text-zinc-800 outline-none hover:bg-zinc-950/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {visible ? copy.hide : copy.show}
        </button>
      </div>
    </PlaygroundCard>
  );
}
