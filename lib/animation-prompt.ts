import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAnimationDoc } from "../content/animations";
import { githubSourceUrl, repositoryUrl } from "../registry/manifest";
import { getRegistrySource } from "./registry-source";

export function getUsageExample(slug: string) {
  const doc = getAnimationDoc(slug);
  if (!doc) throw new Error("Unknown animation");
  if (doc.example) return doc.example;
  return readFileSync(resolve(process.cwd(), "content/examples", slug + ".tsx"), "utf8")
    .replaceAll('"../../registry/', '"./registry/');
}

/** A self-contained handoff; remote links are references, embedded files are authoritative. */
export function getAnimationPrompt(slug: string) {
  const doc = getAnimationDoc(slug);
  if (!doc) throw new Error("Unknown animation");
  const source = getRegistrySource(slug);
  const instructions = [
    "Integrate Sleekmation's " + doc.name + " into my existing project.",
    "Purpose: " + doc.purpose,
    doc.term ? "Motion vocabulary: " + doc.term + " — " + doc.termDescription : "",
    "Repository: " + repositoryUrl,
    "1. Inspect my framework, package manager, design system and the relevant UI before editing. Reuse existing controls and styles. If the target UI is unclear, ask one focused question.",
    "2. Use the complete source snapshot below. Save every file to its named path, including registry/LICENSE, or update all relative imports consistently. Preserve the included license notice without replacing my project license. GitHub links are references and may lag this snapshot; a missing remote file is not a blocker.",
    "3. These sources require React 19 and Motion 13 (motion/react), plus CSS Module support for loaders. Check existing versions before changing dependencies. Use the project's package manager; do not add Next.js, Tailwind, a provider, or an installer for this component.",
    "4. Adapt the example to the target UI. Keep native semantics, focus, keyboard behavior, reduced-motion handling, SSR visibility and cleanup intact. Avoid movement on frequently repeated keyboard actions.",
    "Use when: " + doc.use,
    "Avoid: " + doc.avoid,
    "Accessibility: " + doc.accessibility,
    "Performance: " + doc.performance,
    "5. Verify the interaction, rapid reversals, reduced motion and narrow layouts. Run the relevant checks and summarize the changes and any limitations.",
    "\nREFERENCE LINKS",
    ...source.files.map((file) => file.path + " — " + githubSourceUrl(file.path)),
    "\nUSAGE EXAMPLE\n```tsx\n" + getUsageExample(slug).trimEnd() + "\n```",
    "\nCOMPLETE SOURCE FILES",
    ...source.files.map((file) => "\n### " + file.path + "\n```" + (file.path.endsWith(".css") ? "css" : file.path.endsWith(".tsx") ? "tsx" : file.path.endsWith(".ts") ? "ts" : "text") + "\n" + file.code.trimEnd() + "\n```"),
  ];
  return instructions.filter(Boolean).join("\n\n") + "\n";
}
