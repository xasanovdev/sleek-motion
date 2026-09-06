import type { Metadata } from "next";
import { AnimationCatalog } from "@/components/showcase/catalog";
import { animationDocs } from "@/content/animations";

export const metadata: Metadata = {
  title: "Animation library — Sleekmation",
  description: "Explore 39 React animations. Try a live preview and copy a complete integration prompt with GitHub references and source files.",
  alternates: { canonical: "/animations", languages: {} },
};
export default function CatalogPage() {
  return <><div className="catalog-intro"><p className="doc-eyebrow">The motion library / {animationDocs.length} animations</p><h1 className="mt-5 text-4xl font-medium tracking-tight text-balance sm:text-6xl">Find your motion.<br /><span className="text-zinc-400">Make it yours.</span></h1><p className="catalog-lede">Try an animation. Copy its prompt. Let your coding agent bring it into your project, with the source and every detail included.</p><ol role="list" className="catalog-steps"><li><span>01</span> Try the preview</li><li><span>02</span> Copy prompt</li><li><span>03</span> Paste into your agent</li></ol></div><AnimationCatalog /></>;
}
