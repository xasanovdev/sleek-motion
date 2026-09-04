"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { PlaygroundCard } from "./playground-card";
import type { PlaygroundCopy } from "./playground.types";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function ContentSwapDemo({
  className,
  copy,
  reduceMotion,
}: {
  className?: string;
  copy: PlaygroundCopy;
  reduceMotion: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  function changeExample(nextDirection: 1 | -1) {
    setDirection(nextDirection);
    setIndex((current) => {
      const count = copy.examples.length;
      return (current + nextDirection + count) % count;
    });
  }

  const variants = {
    enter: (customDirection: 1 | -1) => ({
      opacity: 0,
      transform: reduceMotion ? "none" : `translateX(${customDirection * 16}px)`,
    }),
    center: { opacity: 1, transform: "none" },
    exit: (customDirection: 1 | -1) => ({
      opacity: 0,
      transform: reduceMotion ? "none" : `translateX(${customDirection * -16}px)`,
    }),
  };

  return (
    <PlaygroundCard className={clsx(className)}>
      <div className="flex min-h-48 items-center p-6 sm:p-8">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <p className="text-xl font-semibold tracking-tight text-zinc-950">
              {copy.examples[index][0]}
            </p>
            <p className="mt-2 text-base/7 text-pretty text-zinc-600">
              {copy.examples[index][1]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-950/10 p-3">
        <ArrowButton label={copy.previous} onClick={() => changeExample(-1)}>
          <ArrowLeftIcon className="size-4 h-lh shrink-0 fill-current" />
        </ArrowButton>
        <p className="text-base/7 text-zinc-400 tabular-nums sm:text-sm/6">
          {index + 1} / {copy.examples.length}
        </p>
        <ArrowButton label={copy.next} onClick={() => changeExample(1)}>
          <ArrowRightIcon className="size-4 h-lh shrink-0 fill-current" />
        </ArrowButton>
      </div>
    </PlaygroundCard>
  );
}

function ArrowButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="pressable relative grid size-10 place-items-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-950/5 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <span
        aria-hidden="true"
        className="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2"
      />
      {children}
    </button>
  );
}
