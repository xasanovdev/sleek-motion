"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/registry/manifest";
import { animationDocs } from "@/content/animations";
import { NavigationSheet, ScrollRegion } from "@/components/ui/navigation-sheet";

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return <nav aria-label="Animation library" className="catalog-navigation">
    <Link href="/animations" aria-current={path === "/animations" ? "page" : undefined} onClick={onNavigate}>Overview <span>{animationDocs.length}</span></Link>
    <Accordion.Root multiple defaultValue={[...categories]}>
      {categories.map((category) => <Accordion.Item key={category} value={category}>
        <Accordion.Header><Accordion.Trigger className="catalog-group-trigger">{category}<ChevronDownIcon aria-hidden="true" className="size-3.5" /></Accordion.Trigger></Accordion.Header>
        <Accordion.Panel>
          {animationDocs.filter((entry) => entry.category === category).map((entry) => <Link href={`/animations/${entry.slug}`} key={entry.slug} aria-current={path === `/animations/${entry.slug}` ? "page" : undefined} onClick={onNavigate}>{entry.name}</Link>)}
        </Accordion.Panel>
      </Accordion.Item>)}
    </Accordion.Root>
  </nav>;
}

export function CatalogNavigation() {
  return <>
    <aside className="catalog-sidebar"><ScrollRegion><NavigationLinks /></ScrollRegion><p className="catalog-sidebar-note">Small, editable source.<br />React + Motion. Yours to shape.</p></aside>
    <div className="catalog-mobile-nav"><NavigationSheet label="Browse animations" title="Animation library" className="catalog-mobile-trigger" trigger={<><Bars3Icon className="size-5" aria-hidden="true" />Browse animations<span>{animationDocs.length}</span></>}>
      {(close) => <NavigationLinks onNavigate={close} />}
    </NavigationSheet></div>
  </>;
}
