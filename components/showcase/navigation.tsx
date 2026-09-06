"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { categories } from "@/registry/manifest";
import { animationDocs } from "@/content/animations";

export function CatalogNavigation() {
  const path = usePathname();
  const mobile = useRef<HTMLDetailsElement>(null);
  const links = <nav aria-label="Animation library" className="catalog-navigation">
    <Link href="/animations" aria-current={path === "/animations" ? "page" : undefined} onClick={() => mobile.current?.removeAttribute("open")}>Overview <span>{animationDocs.length}</span></Link>
    {categories.map((category) => <div key={category}><p>{category}</p>{animationDocs.filter((entry) => entry.category === category).map((entry) => <Link href={`/animations/${entry.slug}`} key={entry.slug} aria-current={path === `/animations/${entry.slug}` ? "page" : undefined} onClick={() => mobile.current?.removeAttribute("open")}>{entry.name}</Link>)}</div>)}
  </nav>;
  return <>
    <aside className="catalog-sidebar">{links}<p className="mt-10 border-t border-zinc-100 pt-5 text-xs/6 text-zinc-400">Small, editable source.<br />React + Motion. Yours to shape.</p></aside>
    <details className="catalog-mobile-nav" ref={mobile}><summary className="cursor-pointer py-4 text-sm font-medium">Browse animations</summary>{links}</details>
  </>;
}
