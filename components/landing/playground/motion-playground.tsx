"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import { ContentSwap } from "@/registry/animations/content/content-swap";
import { useId, useState } from "react";

import type { Locale } from "../landing.types";
import { AnimationMarquee } from "./animation-marquee";
import { CollapseDemo } from "./collapse-demo";
import { ContentSwapDemo } from "./content-swap-demo";
import { FadeDemo } from "./fade-demo";
import { playgroundCopy } from "./playground.copy";
import { PlaygroundHeader } from "./playground-header";
import type { Demo } from "./playground.types";


export function MotionPlayground({
  className,
  locale,
}: {
  className?: string;
  locale: Locale;
}) {
  const copy = playgroundCopy[locale];
  const reduceMotion = useReducedMotion() ?? false;
  const [demo, setDemo] = useState<Demo>("swap");
  const [replayKey, setReplayKey] = useState(0);
  const panelId = useId();

  return (
    <section
      id="playground"
      aria-label={copy.preview}
      className={clsx("min-w-0 scroll-mt-24", className)}
    >
      <AnimationMarquee
        activeDemo={demo}
        copy={copy}
        onChange={setDemo}
        panelId={panelId}
      />

      <div data-playground-part="panel" className="mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_-24px_rgba(0,42,76,0.18)] ring-1 ring-zinc-950/10 sm:rounded-3xl">
        <PlaygroundHeader
          label="Playground"
          replayLabel={copy.replay}
          onReplay={() => setReplayKey((current) => current + 1)}
        />

        <div
          id={panelId}
          role="region"
          aria-label={`${copy.tabs[demo]} — ${copy.preview}`}
          className="playground-canvas relative flex min-h-[26rem] flex-col px-5 py-6 sm:min-h-[30rem] sm:px-10 sm:py-8"
        >
          <div className="relative flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-medium text-zinc-900">{copy.tabs[demo]}</p>
              <p className="mt-1 text-sm text-zinc-500">{copy.preview}</p>
            </div>
            <span
              aria-hidden="true"
              className="rounded-md border border-zinc-950/8 bg-white/70 px-2 py-1 font-mono text-xs text-zinc-400"
            >
              {String(["fade", "swap", "collapse"].indexOf(demo) + 1).padStart(
                2,
                "0",
              )}{" "}
              / 03
            </span>
          </div>
          <div className="relative grid flex-1 place-items-center py-10">
            <ContentSwap contentKey={`${demo}-${replayKey}`} mode="sync" duration={0.16} reducedMotion={reduceMotion} style={{ gridArea: "1 / 1" }}
                className="w-full max-w-sm"
              >
                {demo === "fade" && (
                  <FadeDemo copy={copy} reduceMotion={reduceMotion} />
                )}
                {demo === "swap" && (
                  <ContentSwapDemo copy={copy} reduceMotion={reduceMotion} />
                )}
                {demo === "collapse" && (
                  <CollapseDemo copy={copy} reduceMotion={reduceMotion} />
                )}
            </ContentSwap>
          </div>
          <p className="relative text-center text-sm/6 text-zinc-500">
            {copy.interact}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-zinc-950/8 px-5 py-4 text-xs/5 text-zinc-500 sm:px-6">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand-500"
            />
            {reduceMotion ? copy.reducedMode : copy.motionMode}
          </span>
          <span className="font-mono">
            {reduceMotion ? "—" : demo === "collapse" ? "height + opacity" : "transform + opacity"}
          </span>
        </div>
      </div>
    </section>
  );
}
