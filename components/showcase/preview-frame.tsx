"use client";

import { useState, type ReactNode } from "react";
import { ArrowPathIcon, ArrowRightIcon, CheckIcon, ChevronDownIcon, CursorArrowRaysIcon, Squares2X2Icon } from "@heroicons/react/16/solid";
import { getAnimationDoc } from "@/content/animations";
import type { RegistrySlug } from "@/registry/manifest";
import { useMotionPreference } from "@/registry/internal/use-motion-preference";
import { PromptCopy } from "./prompt-copy";

const guides: Partial<Record<RegistrySlug, { title: string; description: string; effect: string; hint: string }>> = {
  fade: { title: "A softer way to appear.", description: "Watch the message fade in and out. Everything around it stays exactly where it is.", effect: "Opacity", hint: "Hide the message, then bring it back." },
  "scale-fade": { title: "A little depth. A clear arrival.", description: "The message grows gently into place as it appears, then softens away when dismissed.", effect: "Scale + opacity", hint: "Toggle the message to see its entrance and exit." },
  "slide-fade": { title: "Give the entrance a direction.", description: "The message travels a short distance as it appears. Try another direction to see how it changes the feeling.", effect: "Slide + opacity", hint: "Show and hide the message. Try a different direction." },
  "content-swap": { title: "One place. A new state.", description: "The next piece of content takes over the same space with a gentle fade between states.", effect: "Crossfade", hint: "Move between the steps to compare both states." },
  "directional-content-swap": { title: "Keep a sense of direction.", description: "Forward moves one way; back moves the other. The motion makes each step feel connected.", effect: "Directional slide", hint: "Try Next, then Previous to reverse the motion." },
  collapse: { title: "Make room for the details.", description: "The panel opens smoothly and the content below follows. Add more text to see the height adapt.", effect: "Height", hint: "Open the panel or change the amount of content." },
};

export function usePreviewSettings() {
  const [replay, setReplay] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [reduced, setReduced] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [compact, setCompact] = useState(false);
  const systemReduced = useMotionPreference();
  return { replay, setReplay, speed, setSpeed, reduced, setReduced, rtl, setRtl, compact, setCompact, systemReduced };
}

type PreviewSettings = ReturnType<typeof usePreviewSettings>;

function PreviewSwitch({ label, description, checked, disabled, onChange }: {
  label: string; description: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void;
}) {
  return <label className="studio-switch">
    <input type="checkbox" name={label.toLowerCase().replaceAll(" ", "-")} aria-label={label} checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    <span className="studio-switch-copy"><strong>{label}</strong><small>{description}</small></span>
    <span className="studio-switch-track" aria-hidden="true" />
  </label>;
}

export function PreviewFrame({ slug, settings, children, prompt, timed = true, directional = false }: {
  slug: RegistrySlug; settings: PreviewSettings; children: ReactNode; prompt?: string; timed?: boolean; directional?: boolean;
}) {
  const doc = getAnimationDoc(slug)!;
  const guide = guides[slug] ?? {
    title: "See the difference in motion.",
    description: doc.purpose,
    effect: doc.term ?? doc.category,
    hint: doc.category === "Viewport" ? "Interact with the example to follow the motion." : "Try the controls in the example. Replay to start again.",
  };
  const reduce = settings.reduced || settings.systemReduced;

  return <section className="preview-panel preview-studio" aria-label="Live preview" data-layout={prompt ? "detail" : "inline"}>
    <div className="studio-layout">
      <div className="studio-workspace">
        <div className="preview-toolbar">
          <div className="studio-toolbar-title"><Squares2X2Icon className="size-4 shrink-0" aria-hidden="true" /><p>Live preview</p><span className="studio-live-label">Interactive</span></div>
          <button type="button" className="studio-replay" onClick={() => settings.setReplay((value) => value + 1)}><ArrowPathIcon className="size-4 shrink-0" aria-hidden="true" />Replay</button>
        </div>
        <div className="preview-stage studio-canvas" data-compact={settings.compact}>
          <div className="preview-device" data-testid="preview-device">{children}</div>
        </div>
        <p className="studio-canvas-caption"><CursorArrowRaysIcon className="size-4 shrink-0" aria-hidden="true" />{guide.hint}</p>
      </div>
      <aside className="studio-inspector" aria-label="Preview guide and settings">
        {prompt && <div className="studio-guide">
          <p className="studio-eyebrow">What to notice</p>
          <h2>{guide.title}</h2>
          <p>{guide.description}</p>
          <div className="studio-effect"><span className="studio-effect-mark" aria-hidden="true" />{guide.effect}<span className="studio-effect-divider" aria-hidden="true">/</span>{reduce ? "Reduced motion" : "Motion preview"}</div>
        </div>}
        {prompt && <div className="studio-use">
          <PromptCopy slug={slug} prompt={prompt} primary />
          <p><CheckIcon className="size-4 shrink-0" aria-hidden="true" />Source + agent instructions included</p>
          <a href="#prompt" className="studio-read-prompt" onClick={() => {
            const details = document.getElementById("prompt");
            if (details instanceof HTMLDetailsElement) details.open = true;
          }}>Read the prompt<ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" /></a>
        </div>}
        <div className="preview-options studio-settings">
          <p className="studio-settings-title">Try it your way</p>
          {timed && <label className="studio-speed"><span>Playback speed</span><span className="studio-select-wrap"><select name="preview-speed" aria-label="Speed" value={settings.speed} onChange={(event) => settings.setSpeed(Number(event.target.value))}><option value={0.25}>0.25×</option><option value={0.5}>0.5×</option><option value={1}>1× · Normal</option><option value={2}>2×</option></select><ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" /></span></label>}
          {!timed && <p className="studio-native-timing">{slug === "scroll-progress" ? "Progress follows your scroll position." : "Uses natural spring timing."}</p>}
          <PreviewSwitch label={settings.systemReduced ? "Reduced motion (system)" : "Reduced motion"} description={settings.systemReduced ? "Following your device preference" : "Preview with less movement"} checked={reduce} disabled={settings.systemReduced} onChange={settings.setReduced} />
          <PreviewSwitch label="Compact preview" description="Try a smaller screen" checked={settings.compact} onChange={settings.setCompact} />
          {directional && <PreviewSwitch label="RTL" description="Preview right-to-left" checked={settings.rtl} onChange={settings.setRtl} />}
        </div>
      </aside>
    </div>
  </section>;
}
