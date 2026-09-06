"use client";

import { useEffect, useRef, useState } from "react";
import { ClipboardDocumentIcon, CodeBracketIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { AsyncButton } from "@/registry/animations/feedback/async-button";

const cache = new Map<string, Promise<string>>();
function prepare(slug: string) {
  let promise = cache.get(slug);
  if (!promise) {
    promise = fetch(`/animations/${slug}/prompt`).then(async (response) => {
      if (!response.ok) throw new Error("Prompt could not be loaded");
      return response.text();
    }).catch((error) => { cache.delete(slug); throw error; });
    cache.set(slug, promise);
  }
  return promise;
}

export function PromptCopy({ slug, prompt, primary = false }: { slug: string; prompt?: string; primary?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [manual, setManual] = useState("");
  const [notice, setNotice] = useState("");
  const active = useRef(true);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { active.current = true; return () => { active.current = false; clearTimeout(timer.current); }; }, []);
  function warm() { if (!prompt) void prepare(slug).catch(() => {}); }
  async function copy() {
    if (busy.current) return;
    busy.current = true;
    setStatus("loading"); setNotice(""); clearTimeout(timer.current);
    const payload = prompt ? Promise.resolve(prompt) : prepare(slug);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      // Start the clipboard operation inside the click gesture, including Safari.
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": payload.then((text) => new Blob([text], { type: "text/plain" })) })]);
      } else {
        await navigator.clipboard.writeText(await payload);
      }
      if (!active.current) return;
      setStatus("success"); setManual(""); setNotice("Prompt copied. Paste it into your coding agent.");
      timer.current = setTimeout(() => { setStatus("idle"); setNotice(""); }, 2400);
    } catch {
      const text = await payload.catch(() => "");
      if (!active.current) return;
      setStatus("error"); setManual(text);
      setNotice(text ? "Clipboard unavailable. Try again or select the prompt below." : "Could not load the prompt. Check your connection and try again.");
    } finally { busy.current = false; }
  }
  return <div className="prompt-copy" onPointerEnter={warm} onFocus={warm}>
    <AsyncButton className={`catalog-control ${primary ? "catalog-control-primary" : ""}`} status={status} loadingContent="Preparing…" successContent="Prompt copied" errorContent="Try copy again" onClick={() => void copy()}><span className="prompt-button-content">{primary && <ClipboardDocumentIcon className="size-4 shrink-0" aria-hidden="true" />}Copy prompt</span></AsyncButton>
    <p role="status" className="copy-notice">{notice}</p>
    {manual && <textarea name="manual-prompt" className="manual-prompt" aria-label="Prompt for manual copying" value={manual} readOnly onFocus={(event) => event.currentTarget.select()} />}
  </div>;
}

export function PromptPanel({ prompt }: { prompt: string }) {
  return <details id="prompt" className="prompt-disclosure">
    <summary><CodeBracketIcon className="size-4 shrink-0" aria-hidden="true" /><span><strong>Everything your agent needs</strong><small>Integration instructions, example and complete source</small></span><ChevronDownIcon className="prompt-disclosure-chevron size-4 shrink-0" aria-hidden="true" /></summary>
    <div className="prompt-disclosure-content"><p>This is the exact prompt copied by the button above. Paste it into your coding agent to adapt the animation to your project.</p><pre tabIndex={0} aria-label="Integration prompt">{prompt}</pre></div>
  </details>;
}
