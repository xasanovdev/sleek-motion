import type { RegistrySlug, categories } from "../registry/manifest";
import { extendedDocs } from "./extended";

export type ApiRow = { name: string; type: string; default: string; description: string };
export type AnimationDoc = {
  slug: RegistrySlug; name: string; category: (typeof categories)[number];
  purpose: string; use: string; avoid: string; accessibility: string; performance: string;
  api: ApiRow[]; example: string;
  term?: string; termDescription?: string;
};

const presenceApi: ApiRow[] = [
  { name: "show", type: "boolean", default: "true", description: "Controls appearance and removal after exit." },
  { name: "initial", type: "boolean", default: "false", description: "Opt into an entrance on the first render." },
  { name: "onExitComplete", type: "() => void", default: "—", description: "Runs after exiting content is removed." },
];
const swapApi: ApiRow[] = [
  { name: "contentKey", type: "React.Key", default: "required", description: "Identifies the content state. Keep stable until the state changes." },
  { name: "mode", type: '"wait" | "sync" | "popLayout"', default: '"wait"', description: "Sequence exits, crossfade simultaneously, or pop exiting content out of layout." },
  ...presenceApi.filter((row) => row.name !== "show"),
];
export const sharedApi: ApiRow[] = [
  { name: "as", type: "HTML tag", default: '"div"', description: "Select a semantic element that permits the supplied children." },
  { name: "duration", type: "number (seconds)", default: "0.2 · Collapse: 0.24", description: "Duration of one enter or exit phase." },
  { name: "delay", type: "number (seconds)", default: "0", description: "Delay before a transition starts." },
  { name: "reducedMotion", type: "boolean", default: "false", description: "Force reduced motion. System preferences always apply." },
  { name: "className / style", type: "DOM styling props", default: "—", description: "Supply appearance; keep animation-owned properties on a separate wrapper." },
  { name: "ref / DOM props", type: "tag-specific props", default: "—", description: "React 19 ref forwarding, ARIA attributes, and compatible event handlers." },
];

function presenceExample(name: string, file: string, extra = "") {
  return `"use client";\n\nimport { useState } from "react";\nimport { ${name} } from "./registry/animations/presence/${file}";\n\nexport function Example() {\n  const [visible, setVisible] = useState(true);\n  return (\n    <div>\n      <button onClick={() => setVisible(!visible)}>Toggle message</button>\n      <${name} show={visible}${extra}>\n        <p>Changes saved. You are up to date.</p>\n      </${name}>\n    </div>\n  );\n}\n`;
}

export const animationDocs: AnimationDoc[] = [
  {
    slug: "fade", name: "Fade", category: "Presence",
    purpose: "Bring content in and out without adding a spatial story.",
    use: "Confirm a saved change, reveal supporting information, or soften a temporary status message.",
    avoid: "Do not delay essential information or animate every keystroke. Use direction only when it explains where content came from.",
    accessibility: "Exiting content becomes inert and hidden from assistive technology. Move focus to a persistent control before removing focused content. Useful opacity feedback remains under reduced motion.",
    performance: "Only opacity changes. There is no measurement or layout animation. Visible server-rendered content stays visible by default.",
    api: presenceApi, example: presenceExample("Fade", "fade"),
  },
  {
    slug: "scale-fade", name: "ScaleFade", category: "Presence",
    purpose: "Give a compact surface a subtle sense of depth.",
    use: "Introduce an occasional compact surface or confirmation. Match transform origin to the trigger when the surface is anchored.",
    avoid: "Avoid scaling large reading surfaces or menus used constantly from the keyboard. Never start a UI surface at scale zero.",
    accessibility: "Reduced motion removes scaling and keeps the fade. This primitive does not provide dialog roles, focus trapping, or dismissal.",
    performance: "Uses transform and opacity with a default scale of 0.96. Put unrelated transforms on an outer wrapper.",
    api: [...presenceApi, { name: "scale", type: "number", default: "0.96", description: "Scale at the hidden state. Keep it close to 1." }],
    example: presenceExample("ScaleFade", "scale-fade", " scale={0.96}"),
  },
  {
    slug: "slide-fade", name: "SlideFade", category: "Presence",
    purpose: "Explain the direction a temporary element entered from.",
    use: "Connect a notice to its edge or introduce a small piece of supporting content with meaningful direction.",
    avoid: "Avoid moving an entire page or using large distances for small state changes. Do not add directional movement without a reason.",
    accessibility: "Reduced motion removes travel while preserving opacity. Direction is physical: up starts below its final position. Choose left/right explicitly for RTL interfaces.",
    performance: "Uses transform and opacity; default travel is 12px. No element measurement or scroll listener is required.",
    api: [...presenceApi,
      { name: "direction", type: '"up" | "down" | "left" | "right"', default: '"up"', description: "Direction of travel during entrance." },
      { name: "distance", type: "number (pixels)", default: "12", description: "Distance from the resting position." }],
    example: presenceExample("SlideFade", "slide-fade", ' direction="up"'),
  },
  {
    slug: "content-swap", name: "ContentSwap", category: "Content",
    purpose: "Bridge two states in the same place with a quiet crossfade.",
    use: "Replace a status, a compact summary, or resolved content while maintaining a clear relationship between states.",
    avoid: "Do not wrap rapidly typed text or a whole application. A new key remounts the content; keep input state outside if it must survive.",
    accessibility: "Outgoing content is inert during exit. The consumer owns focus and any live announcements. Reduced motion keeps a short fade, capped at 160ms per phase.",
    performance: "Opacity-only transition. The default wait mode runs exit before entrance; total time is two phases. popLayout needs a positioned ancestor.",
    api: swapApi,
    example: `"use client";\n\nimport { useState } from "react";\nimport { ContentSwap } from "./registry/animations/content/content-swap";\n\nexport function Example() {\n  const [saved, setSaved] = useState(false);\n  return (\n    <div>\n      <button onClick={() => setSaved(!saved)}>Change status</button>\n      <ContentSwap contentKey={saved ? "saved" : "draft"}>\n        {saved ? "All changes saved" : "You have a draft"}\n      </ContentSwap>\n    </div>\n  );\n}\n`,
  },
  {
    slug: "directional-content-swap", name: "DirectionalContentSwap", category: "Content",
    purpose: "Keep forward and backward navigation spatially consistent.",
    use: "Move between occasional onboarding steps or related panels where forward and back communicate progress.",
    avoid: "Avoid frequent keyboard navigation and decorative sideways movement between unrelated states. It is not a router or carousel.",
    accessibility: "Pass dir=\"rtl\" explicitly to reverse horizontal travel; inherited direction is not read. Reduced motion removes translation. The consumer handles focus, step announcements, and navigation controls.",
    performance: "Uses transform and opacity. The latest direction is supplied to exiting content, including rapid reversals. Default wait mode uses two phases.",
    api: [...swapApi,
      { name: "direction", type: "1 | -1", default: "required", description: "Forward or backward travel, supplied with each state change." },
      { name: "axis", type: '"x" | "y"', default: '"x"', description: "Horizontal or vertical travel." },
      { name: "distance", type: "number (pixels)", default: "12", description: "Travel distance for enter and exit." },
      { name: "dir", type: '"ltr" | "rtl"', default: "—", description: "Explicit RTL reverses horizontal travel." }],
    example: `"use client";\n\nimport { useState } from "react";\nimport { DirectionalContentSwap } from "./registry/animations/content/directional-content-swap";\n\nexport function Example() {\n  const [step, setStep] = useState(0);\n  const [direction, setDirection] = useState<1 | -1>(1);\n  function go(next: 1 | -1) {\n    setDirection(next);\n    setStep((current) => current + next);\n  }\n  return (\n    <div>\n      <button disabled={step === 0} onClick={() => go(-1)}>Back</button>\n      <button disabled={step === 2} onClick={() => go(1)}>Next</button>\n      <DirectionalContentSwap contentKey={step} direction={direction} dir="ltr">\n        Step {step + 1} of 3\n      </DirectionalContentSwap>\n    </div>\n  );\n}\n`,
  },
  {
    slug: "collapse", name: "Collapse", category: "Layout",
    purpose: "Expand changing content while keeping the page in flow.",
    use: "Reveal help text, optional settings, or an expandable answer whose height can change with its content.",
    avoid: "Do not collapse the content containing the focused control. Avoid running many measured height animations at once in a large list.",
    accessibility: "The consumer owns aria-expanded, aria-controls, and focus restoration. Closed kept-mounted content is inert and aria-hidden. Reduced motion makes height changes immediate.",
    performance: "ResizeObserver measures an inner flow-root div. Height animation intentionally changes document flow; test under representative load. Put padding and borders inside the child.",
    api: [
      { name: "open", type: "boolean", default: "required", description: "Controls expansion and collapse." },
      { name: "keepMounted", type: "boolean", default: "false", description: "Preserve child state while closed, with focus exclusion." },
      ...presenceApi.filter((row) => row.name !== "show")],
    example: `"use client";\n\nimport { useId, useState } from "react";\nimport { Collapse } from "./registry/animations/layout/collapse";\n\nexport function Example() {\n  const [open, setOpen] = useState(false);\n  const id = useId();\n  return (\n    <div>\n      <button aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>\n        What is included?\n      </button>\n      <Collapse id={id} open={open} keepMounted>\n        <div style={{ padding: 16 }}>Typed source and reduced-motion support.</div>\n      </Collapse>\n    </div>\n  );\n}\n`,
  },
  ...extendedDocs,
];

export function getAnimationDoc(slug: string) {
  return animationDocs.find((entry) => entry.slug === slug);
}
