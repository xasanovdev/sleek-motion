"use client";

import {
  ArrowsRightLeftIcon,
  Bars3BottomLeftIcon,
  PauseIcon,
  PlayIcon,
  Square2StackIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useState } from "react";

import type { Demo, PlaygroundCopy } from "./playground.types";

const animations = [
  { id: "fade", icon: Square2StackIcon },
  { id: "swap", icon: ArrowsRightLeftIcon },
  { id: "collapse", icon: Bars3BottomLeftIcon },
] as const;

export function AnimationMarquee({
  activeDemo,
  className,
  copy,
  onChange,
  panelId,
}: {
  activeDemo: Demo;
  className?: string;
  copy: PlaygroundCopy;
  onChange: (demo: Demo) => void;
  panelId: string;
}) {
  const [paused, setPaused] = useState(false);
  const PlaybackIcon = paused ? PlayIcon : PauseIcon;

  return (
    <div
      className={clsx("animation-marquee flex min-w-0 items-center gap-3", className)}
      data-paused={paused}
      data-playground-part="selector"
      role="group"
      aria-label={copy.chooseAnimation}
    >
      <div className="marquee-viewport min-w-0 flex-1">
        <div className="marquee-track flex w-max py-2">
          {[0, 1].map((group) => (
            <div key={group} className="marquee-group flex shrink-0 gap-3 pr-3" data-duplicate={group > 0 || undefined}>
              {[0, 1, 2].map((repeat) =>
                animations.map(({ id, icon: Icon }, index) => {
                  const duplicate = group > 0 || repeat > 0;
                  return (
                    <button
                      key={`${repeat}-${id}`}
                      type="button"
                      tabIndex={duplicate ? -1 : 0}
                      data-duplicate={duplicate || undefined}
                      aria-pressed={activeDemo === id}
                      aria-controls={panelId}
                      onClick={() => onChange(id)}
                      className="pressable flex min-h-11 shrink-0 items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-base/6 font-medium whitespace-nowrap text-zinc-600 hover:border-brand-500/40 hover:text-brand-500 aria-pressed:border-brand-500 aria-pressed:bg-brand-500 aria-pressed:text-white sm:text-sm/6"
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      {copy.tabs[id]}
                      <span aria-hidden="true" className="font-mono text-xs opacity-50">0{index + 1}</span>
                    </button>
                  );
                }),
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="marquee-playback pressable grid size-11 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-brand-500"
        aria-label={paused ? copy.resumeMotion : copy.pauseMotion}
        aria-pressed={paused}
        onClick={() => setPaused((current) => !current)}
      >
        <PlaybackIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
