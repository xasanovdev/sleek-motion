"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useId, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/16/solid";
import { Fade } from "@/registry/animations/presence/fade";
import { ScaleFade } from "@/registry/animations/presence/scale-fade";
import { SlideFade } from "@/registry/animations/presence/slide-fade";
import { ContentSwap } from "@/registry/animations/content/content-swap";
import { DirectionalContentSwap } from "@/registry/animations/content/directional-content-swap";
import { Collapse } from "@/registry/animations/layout/collapse";
import { PreviewFrame, usePreviewSettings } from "./preview-frame";
import type { FoundationSlug } from "@/registry/manifest";
import type { Direction } from "@/registry/internal/types";

export function AnimationPreview({
  slug,
  prompt,
}: {
  slug: FoundationSlug;
  prompt?: string;
}) {
  const settings = usePreviewSettings();
  return (
    <PreviewFrame
      slug={slug}
      settings={settings}
      prompt={prompt}
      directional={slug === "directional-content-swap" || slug === "slide-fade"}
    >
      <DemoStage
        key={settings.replay}
        slug={slug}
        initial={settings.replay > 0}
        speed={settings.speed}
        reduced={settings.reduced || settings.systemReduced}
        rtl={settings.rtl}
      />
    </PreviewFrame>
  );
}

function DemoStage({
  slug,
  speed,
  reduced,
  rtl,
  initial,
}: {
  slug: FoundationSlug;
  speed: number;
  reduced: boolean;
  rtl: boolean;
  initial: boolean;
}) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [travel, setTravel] = useState<Direction>("up");
  const [axis, setAxis] = useState<"x" | "y">("x");
  const [mode, setMode] = useState<"wait" | "sync" | "popLayout">("wait");
  const [scale, setScale] = useState(0.96);
  const [distance, setDistance] = useState(12);
  const [keepMounted, setKeepMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const duration = (slug === "collapse" ? 0.24 : 0.2) / speed;
  const motionProps = { duration, reducedMotion: reduced, initial };
  const isPresence =
    slug === "fade" || slug === "scale-fade" || slug === "slide-fade";
  const isSwap = slug === "content-swap" || slug === "directional-content-swap";
  const messages = [
    [
      "A little more clarity.",
      "Good motion helps the next step feel familiar.",
    ],
    ["Keep your bearings.", "Related states share a place in your interface."],
    [
      "Make it your own.",
      "Copy the source. Tune the details for your product.",
    ],
  ];
  function go(next: 1 | -1) {
    setDirection(next);
    setStep((v) => Math.max(0, Math.min(2, v + next)));
  }
  const message = (
    <div className="demo-message">
      <CheckIcon
        className="demo-saved-icon size-4 shrink-0"
        aria-hidden="true"
      />
      <div>
        <p className="demo-message-title">Changes saved</p>
        <p className="demo-message-description">Your document is up to date.</p>
      </div>
      <span className="demo-message-time">Just now</span>
    </div>
  );
  const panel = (
    <div className="demo-state" data-testid="demo-state">
      <span className="font-mono text-xs text-brand-500">0{step + 1} / 03</span>
      <h2 className="mt-4 text-2xl font-medium tracking-tight">
        {messages[step][0]}
      </h2>
      <p className="mt-3 text-sm/6 text-zinc-500">{messages[step][1]}</p>
    </div>
  );

  return (
    <div className="w-full" dir={rtl ? "rtl" : "ltr"}>
      <div className="demo-content">
        {isPresence && (
          <div className="presence-scene">
            <div className="demo-document" aria-hidden="true">
              <div className="demo-document-header">
                <div>
                  <DocumentTextIcon className="size-4 shrink-0" />
                  Project brief
                </div>
                <EllipsisHorizontalIcon className="size-4 shrink-0" />
              </div>
              <div className="demo-document-body">
                <p className="demo-document-label">WORKSPACE / DOCUMENTS</p>
                <h3>A little room for big ideas.</h3>
                <p>Bring the next chapter into focus.</p>
                <div className="demo-document-lines">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="presence-notice">
              {slug === "fade" && (
                <Fade show={visible} {...motionProps} data-testid="demo-motion">
                  {message}
                </Fade>
              )}
              {slug === "scale-fade" && (
                <ScaleFade
                  show={visible}
                  scale={scale}
                  {...motionProps}
                  data-testid="demo-motion"
                >
                  {message}
                </ScaleFade>
              )}
              {slug === "slide-fade" && (
                <SlideFade
                  show={visible}
                  direction={travel}
                  distance={distance}
                  {...motionProps}
                  data-testid="demo-motion"
                >
                  {message}
                </SlideFade>
              )}
            </div>
          </div>
        )}
        {slug === "content-swap" && (
          <div className="relative grid w-full">
            <ContentSwap
              contentKey={step}
              mode={mode}
              {...motionProps}
              style={{ gridArea: "1 / 1" }}
              data-testid="demo-motion"
            >
              {panel}
            </ContentSwap>
          </div>
        )}
        {slug === "directional-content-swap" && (
          <div className="relative grid w-full">
            <DirectionalContentSwap
              contentKey={step}
              direction={direction}
              axis={axis}
              distance={distance}
              dir={rtl ? "rtl" : "ltr"}
              mode={mode}
              {...motionProps}
              style={{ gridArea: "1 / 1" }}
              data-testid="demo-motion"
            >
              {panel}
            </DirectionalContentSwap>
          </div>
        )}
        {slug === "collapse" && (
          <div className="demo-accordion">
            <Button
              type="button"
              className="flex min-h-14 w-full items-center justify-between gap-4 p-5 text-left text-sm font-medium"
              aria-expanded={visible}
              aria-controls={panelId}
              onClick={() => setVisible((v) => !v)}
            >
              A little room for the details
              <ChevronDownIcon
                className="size-4 shrink-0"
                style={{ transform: visible ? "rotate(180deg)" : "none" }}
                aria-hidden="true"
              />
            </Button>
            <Collapse
              id={panelId}
              open={visible}
              keepMounted={keepMounted}
              {...motionProps}
              data-testid="demo-motion"
            >
              <div className="border-t border-zinc-100 p-5 text-sm/6 text-zinc-500">
                <p>
                  All the details you need, with a little room to make them your
                  own.
                </p>
                {expanded && (
                  <p className="mt-3">
                    Add delivery instructions, a short note, or anything else
                    your team needs to know.
                  </p>
                )}
                <label className="mt-4 block">
                  Your note
                  <Input
                    name="preview-note"
                    className="catalog-input mt-1"
                    placeholder="This can stay with you…"
                  />
                </label>
              </div>
            </Collapse>
          </div>
        )}
      </div>
      <div className="demo-actions">
        {isSwap ? (
          <>
            <Button
              type="button"
              className="catalog-control"
              disabled={step === 0}
              onClick={() => go(-1)}
            >
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              Previous
            </Button>
            <span className="text-xs text-zinc-400" aria-live="polite">
              {step + 1} of 3
            </span>
            <Button
              type="button"
              className="catalog-control"
              disabled={step === 2}
              onClick={() => go(1)}
            >
              Next
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            className="catalog-control"
            onClick={() => setVisible((v) => !v)}
          >
            {visible
              ? slug === "collapse"
                ? "Close panel"
                : "Hide message"
              : slug === "collapse"
                ? "Open panel"
                : "Show message"}
          </Button>
        )}
        {slug === "collapse" && (
          <Button
            type="button"
            className="catalog-control"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Less content" : "More content"}
          </Button>
        )}
      </div>
      {slug !== "fade" && (
        <Collapsible.Root className="mt-5 text-center text-xs text-zinc-500">
          <Collapsible.Trigger className="mx-auto min-h-11 w-fit cursor-pointer p-2">
            Tune this example
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
              {isSwap && (
                <label>
                  Mode{" "}
                  <Select
                    label="Mode"
                    value={mode}
                    onValueChange={setMode}
                    options={["wait", "sync", "popLayout"].map((value) => ({
                      value: value as typeof mode,
                      label: value,
                    }))}
                  />
                </label>
              )}
              {slug === "directional-content-swap" && (
                <label>
                  Axis{" "}
                  <Select
                    label="Axis"
                    value={axis}
                    onValueChange={setAxis}
                    options={[
                      { value: "x", label: "x" },
                      { value: "y", label: "y" },
                    ]}
                  />
                </label>
              )}
              {slug === "slide-fade" && (
                <label>
                  Direction{" "}
                  <Select
                    label="Direction"
                    value={travel}
                    onValueChange={setTravel}
                    options={["up", "down", "left", "right"].map((value) => ({
                      value: value as Direction,
                      label: value,
                    }))}
                  />
                </label>
              )}
              {(slug === "slide-fade" ||
                slug === "directional-content-swap") && (
                <label>
                  Distance{" "}
                  <Select
                    label="Distance"
                    value={distance}
                    onValueChange={setDistance}
                    options={[8, 12, 16].map((value) => ({
                      value,
                      label: `${value}px`,
                    }))}
                  />
                </label>
              )}
              {slug === "scale-fade" && (
                <label>
                  Scale{" "}
                  <Select
                    label="Scale"
                    value={scale}
                    onValueChange={setScale}
                    options={[0.94, 0.96, 0.98].map((value) => ({
                      value,
                      label: String(value),
                    }))}
                  />
                </label>
              )}
              {slug === "collapse" && (
                <label className="inline-flex items-center gap-2">
                  <Checkbox
                    checked={keepMounted}
                    onCheckedChange={setKeepMounted}
                  />
                  Keep mounted
                </label>
              )}
            </div>
          </Collapsible.Panel>
        </Collapsible.Root>
      )}
      {isPresence && (
        <div className="demo-state-readout" aria-live="polite">
          <span
            className="demo-state-dot"
            data-visible={visible}
            aria-hidden="true"
          />
          {visible ? "Message visible" : "Message hidden"}
          <span aria-hidden="true">·</span>
          {Math.round(duration * 1000)} ms
        </div>
      )}
    </div>
  );
}
