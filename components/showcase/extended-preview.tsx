"use client";

import { examples } from "@/content/examples";
import { PreviewFrame, usePreviewSettings } from "./preview-frame";

export function ExtendedPreview({ slug, prompt }: { slug: keyof typeof examples; prompt?: string }) {
  const settings = usePreviewSettings();
  const Example = examples[slug];
  const timed = !["shared-element", "shared-indicator", "layout-shift", "scroll-progress"].includes(slug);
  const directional = ["sequential-content", "toggle-motion", "progress-bar", "scroll-progress", "drawer-motion"].includes(slug);
  return <PreviewFrame slug={slug} settings={settings} prompt={prompt} timed={timed} directional={directional}>
    <div className="extended-example" data-example={slug}><Example key={settings.replay} reducedMotion={settings.reduced || settings.systemReduced} speed={settings.speed} rtl={settings.rtl} /></div>
  </PreviewFrame>;
}
