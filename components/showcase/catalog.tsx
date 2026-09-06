"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { animationDocs } from "@/content/animations";
import { categories, foundationSlugs, type FoundationSlug } from "@/registry/manifest";
import type { examples } from "@/content/examples";
import { PromptCopy } from "./prompt-copy";

const FoundationPreview = dynamic(() => import("./preview").then((module) => module.AnimationPreview));
const ExtendedPreview = dynamic(() => import("./extended-preview").then((module) => module.ExtendedPreview));

export function AnimationCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<string | null>(null);
  const matches = animationDocs.filter((entry) => (category === "All" || entry.category === category) && `${entry.name} ${entry.purpose} ${entry.category} ${entry.term ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="catalog-filters">
      <label className="catalog-search"><span className="sr-only">Search animations</span><MagnifyingGlassIcon className="pointer-events-none size-4 shrink-0 fill-zinc-400" aria-hidden="true" /><input name="animation-search" className="catalog-input" placeholder="Search by name or effect…" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setActive(null); }} /></label>
      <p className="catalog-count" role="status">{matches.length} {matches.length === 1 ? "animation" : "animations"}</p>
      <div className="category-list" role="group" aria-label="Animation category">{["All", ...categories].map((item) => <button type="button" className="category-filter" key={item} aria-pressed={category === item} onClick={() => { setCategory(item); setActive(null); }}>{item}</button>)}</div>
    </div>
    <div className="catalog-grid">{matches.map((entry) => {
      const foundation = (foundationSlugs as readonly string[]).includes(entry.slug);
      return <article key={entry.slug} className="catalog-card" data-testid="catalog-card">
        {active === entry.slug ? <div className="card-live-preview">{foundation ? <FoundationPreview slug={entry.slug as FoundationSlug} /> : <ExtendedPreview slug={entry.slug as keyof typeof examples} />}</div> : <button type="button" className={`catalog-thumbnail paper-grid thumbnail-family-${entry.category.toLowerCase()}`} aria-label={`Play ${entry.name} preview`} onClick={() => setActive(entry.slug)}><span className="thumbnail-category">{entry.category}</span><div className={`thumbnail-object thumbnail-${entry.slug}`} aria-hidden="true"><span /><span /><span /></div><span className="thumbnail-play">Try animation ↗</span></button>}
        <div className="catalog-card-content"><div><h2><Link href={`/animations/${entry.slug}`}>{entry.name}</Link></h2><p>{entry.purpose}</p></div>
          <div className="catalog-card-actions"><PromptCopy slug={entry.slug} /><Link className="doc-link" href={`/animations/${entry.slug}`}>Details ↗</Link></div>
          {active === entry.slug && <button type="button" className="doc-link card-stop" onClick={() => setActive(null)}>Close preview</button>}
        </div>
      </article>;
    })}</div>
    {matches.length === 0 && <div className="catalog-empty"><h2>No matching animations</h2><p>Try another word or browse all 39 animations.</p><button type="button" className="catalog-control" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
  </>;
}
