"use client";

import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";

import { useState } from "react";
import { CopyButton } from "@/components/ui/motion-buttons";
import type { RegistrySource } from "@/lib/registry-source";
import { githubSourceUrl, repositoryUrl } from "@/registry/manifest";

export function SourcePanel({ source }: { source: RegistrySource }) {
  const [selected, setSelected] = useState(source.files[0].path);
  const [notice, setNotice] = useState("");
  const file = source.files.find((item) => item.path === selected) ?? source.files[0];
  const feedback = { onCopySuccess: () => setNotice("Copied to clipboard."), onCopyError: () => setNotice("Copy failed. Select the source below and copy it manually.") };
  return (
    <section id="source" className="doc-section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="doc-eyebrow">Own the details</p><h2 className="doc-heading">Source & required files</h2></div>
        <a className="doc-link text-sm" href={githubSourceUrl(file.path)} target="_blank" rel="noreferrer">{githubSourceUrl(file.path) === repositoryUrl ? "View repository ↗" : "View on GitHub ↗"}</a>
      </div>
      <p className="mt-4 max-w-2xl text-sm/7 text-zinc-500">Copy the component with its shared files. Keep the paths below intact in your project. No provider or Tailwind setup is needed.</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <CopyButton className="catalog-control" text={source.bundle} {...feedback}>Copy required files</CopyButton>
        <CopyButton className="catalog-control" text={source.files[0].code} {...feedback}>Copy component</CopyButton>
        <span className="px-2 text-xs text-zinc-500">{source.files.length} files · React 19 + Motion</span>
      </div>
      <p className="mt-3 text-xs/6 text-zinc-500">“Copy required files” includes the component and dependencies, separated by file-path comments. Save each section to its matching file.</p>
      <p aria-live="polite" className="min-h-6 text-xs/6 text-brand-600">{notice}</p>
      <div className="source-browser">
        <ToggleGroup className="source-files" orientation="vertical" aria-label="Required files" value={[file.path]} onValueChange={(values) => { if (values.length) setSelected(values[0]); }}>
          {source.files.map((item) => <Toggle value={item.path} key={item.path} title={item.path}>
            <span className="block">{item.path.split("/").at(-1)}</span><span className="mt-1 block truncate text-[10px] opacity-50">{item.path.replace("registry/", "").split("/").slice(0, -1).join("/") || "shared"}</span>
          </Toggle>)}
        </ToggleGroup>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2 text-xs text-zinc-400">
            <span className="break-all font-mono">{file.path}</span>
            <CopyButton className="rounded px-2 py-2 text-zinc-200" text={file.code} {...feedback}>Copy file</CopyButton>
          </div>
          <pre className="source-code" tabIndex={0} aria-label={file.path}><code>{file.code}</code></pre>
        </div>
      </div>
    </section>
  );
}

export function UsageExample({ code }: { code: string }) {
  const [notice, setNotice] = useState("");
  return <section id="usage" className="doc-section">
    <div className="flex items-center justify-between gap-3"><h2 className="doc-heading">A small starting point</h2>
      <CopyButton className="catalog-control" text={code} onCopySuccess={() => setNotice("Usage example copied.")} onCopyError={() => setNotice("Copy failed. Select and copy the example manually.")}>Copy example</CopyButton>
    </div>
    <p className="mt-3 text-sm/7 text-zinc-500">Install <code className="inline-code">react</code> and <code className="inline-code">motion</code>, copy the required files, then use the component. Styles are yours to add.{code.includes("@base-ui/react/") && <> This example also uses <code className="inline-code">@base-ui/react</code> for its controls; the animation itself only needs React and Motion.</>}</p>
    <p aria-live="polite" className="min-h-7 text-xs/7 text-brand-600">{notice}</p>
    <pre className="source-code rounded-xl bg-zinc-950" tabIndex={0} aria-label="Usage example"><code>{code}</code></pre>
  </section>;
}
