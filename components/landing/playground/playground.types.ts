import type { Locale } from "../landing.types";

export type Demo = "fade" | "swap" | "collapse";

export type PlaygroundCopy = {
  preview: string;
  chooseAnimation: string;
  pauseMotion: string;
  resumeMotion: string;
  interact: string;
  motionMode: string;
  reducedMode: string;
  tabs: Record<Demo, string>;
  replay: string;
  hide: string;
  show: string;
  hidden: string;
  fadeTitle: string;
  fadeBody: string;
  collapseTitle: string;
  collapseBody: string;
  previous: string;
  next: string;
  examples: readonly (readonly [title: string, description: string])[];
};

export type LocalizedPlaygroundCopy = Record<Locale, PlaygroundCopy>;
