import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { animationDocs, getAnimationDoc, sharedApi } from "@/content/animations";
import { AnimationPreview } from "@/components/showcase/preview";
import { SourcePanel, UsageExample } from "@/components/showcase/source-panel";
import { getRegistrySource } from "@/lib/registry-source";
import { getAnimationPrompt, getUsageExample } from "@/lib/animation-prompt";
import { PromptPanel } from "@/components/showcase/prompt-copy";
import { ExtendedPreview } from "@/components/showcase/extended-preview";
import { foundationSlugs, type FoundationSlug } from "@/registry/manifest";
import type { examples } from "@/content/examples";

export const dynamicParams = false;
export function generateStaticParams() { return animationDocs.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getAnimationDoc(slug);
  if (!doc) return {};
  return { title: `${doc.name} — Sleekmation`, description: doc.purpose, alternates: { canonical: `/animations/${slug}`, languages: {} } };
}

export default async function AnimationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getAnimationDoc(slug);
  if (!doc) notFound();
  const source = getRegistrySource(slug);
  const foundation = (foundationSlugs as readonly string[]).includes(slug);
  const prompt = getAnimationPrompt(slug);
  const usage = getUsageExample(slug);
  const next = animationDocs[(animationDocs.indexOf(doc) + 1) % animationDocs.length];
  return <>
    <div className="doc-breadcrumbs"><Link href="/animations" className="hover:text-brand-500">Library</Link><span>/</span><span>{doc.category}</span></div>
    <h1 className="animation-title">{doc.name}</h1>
    <p className="animation-description">{doc.purpose}</p>
    <nav aria-label="On this page" className="animation-page-nav"><a href="#preview">Preview</a><a href="#usage">Usage</a><a href="#source">Source</a><a href="#api">API</a></nav>
    <div id="preview">{foundation ? <AnimationPreview slug={doc.slug as FoundationSlug} prompt={prompt} /> : <ExtendedPreview slug={doc.slug as keyof typeof examples} prompt={prompt} />}</div>
    <PromptPanel prompt={prompt} />
    {doc.term && <p className="vocabulary-note"><strong>{doc.term}</strong> — {doc.termDescription}</p>}
    <div className="doc-guidance"><section><p className="doc-eyebrow text-brand-600">When to use</p><p>{doc.use}</p></section><section><p className="doc-eyebrow">When to skip it</p><p>{doc.avoid}</p></section></div>
    <UsageExample code={usage} />
    <SourcePanel source={source} />
    <section id="api" className="doc-section"><p className="doc-eyebrow">A small, explicit API</p><h2 className="doc-heading">Make it fit</h2><div className="api-table"><table><caption className="sr-only">{doc.name} props</caption><thead><tr><th>Prop</th><th>Type / default</th><th>Purpose</th></tr></thead><tbody>{[...doc.api, ...(foundation ? sharedApi : [])].map((row) => <tr key={row.name}><th scope="row"><code>{row.name}</code></th><td><code>{row.type}</code><span className="mt-1 block text-zinc-400">{row.default}</span></td><td>{row.description}</td></tr>)}</tbody></table></div></section>
    <div className="doc-guidance"><section><h2 className="text-sm font-medium">Accessibility</h2><p>{doc.accessibility}</p></section><section><h2 className="text-sm font-medium">Performance</h2><p>{doc.performance}</p></section></div>
    <Link className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-8" href={`/animations/${next.slug}`}><span className="text-xs text-zinc-400">Explore next</span><span className="text-sm font-medium text-brand-600">{next.name} →</span></Link>
  </>;
}
