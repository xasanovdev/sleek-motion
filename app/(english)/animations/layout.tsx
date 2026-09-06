import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/ui/brand";
import { CatalogNavigation } from "@/components/showcase/navigation";
import { repositoryUrl } from "@/registry/manifest";
import "./showcase.css";
import "@/components/showcase/preview-studio.css";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return <div className="catalog-shell">
    <a className="catalog-skip" href="#catalog-main">Skip to content</a>
    <header className="catalog-header"><Brand locale="en" className="catalog-brand" /><div className="flex items-center gap-6 text-sm"><Link href="/animations" className="font-medium text-brand-600">Library</Link><a className="text-zinc-500 hover:text-zinc-950" href={repositoryUrl} target="_blank" rel="noreferrer">GitHub ↗</a></div></header>
    <div className="catalog-body"><CatalogNavigation /><main id="catalog-main" className="catalog-main" tabIndex={-1}>{children}<footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 py-8 text-xs text-zinc-400"><span>Purposeful motion. Readable source.</span><Link href="/" className="hover:text-brand-500">Back to Sleekmation ↗</Link></footer></main></div>
  </div>;
}
