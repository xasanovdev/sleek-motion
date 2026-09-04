"use client";

import { ArrowUpRightIcon, Bars3Icon, GlobeAltIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

import entrance from "./hero-entrance.module.css";
import type { LandingCopy, Locale } from "./landing.types";

export function SiteHeader({
  className,
  copy,
  locale,
}: {
  className?: string;
  copy: LandingCopy;
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={clsx(
        "site-header sticky top-0 z-30",
        entrance.header,
        className,
      )}
    >
      <Container className="site-header-content mx-auto flex h-20 items-center gap-4">
        <div className="flex flex-1 items-center text-xl">
          <Brand locale={locale} />
        </div>

        <nav aria-label="Primary navigation" className="hidden lg:flex">
          <div className="flex items-center gap-8 text-xs/6">
            {copy.nav.map(([label, href]) => (
              <a key={href} href={href} className="rounded font-medium tracking-wide text-zinc-600 uppercase hover:text-brand-500">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex items-center justify-end gap-2 text-sm/6 lg:flex-1">
          <Link
            href={copy.localeHref}
            hrefLang={locale === "en" ? "uz" : "en"}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 py-2 font-medium text-zinc-600 hover:text-brand-500 sm:px-2.5"
          >
            <GlobeAltIcon aria-hidden="true" className="hidden size-4 shrink-0 sm:block" />
            {copy.localeLabel}
          </Link>
          <div className="hidden lg:block">
            <ButtonLink href="#playground" variant="primary" className="rounded-full">
              {copy.navAction}
              <ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0" />
            </ButtonLink>
          </div>
          <MobileNavigation copy={copy} />
        </div>
      </Container>
    </header>
  );
}

function MobileNavigation({ copy }: { copy: LandingCopy }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) {
        detailsRef.current?.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <details
      ref={detailsRef}
      className="group relative lg:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          detailsRef.current?.removeAttribute("open");
          detailsRef.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary
        aria-label={copy.menu}
        className="pressable relative grid size-10 cursor-pointer list-none place-items-center rounded-lg text-zinc-700 ring-1 ring-zinc-950/10 marker:hidden hover:bg-white"
      >
        <span
          aria-hidden="true"
          className="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2"
        />
        <Bars3Icon className="size-4 h-lh shrink-0 fill-current" />
      </summary>
      <nav
        aria-label="Mobile navigation"
        className="absolute top-12 right-0 w-64 rounded-2xl bg-white p-2 shadow-xl shadow-zinc-950/10 ring-1 ring-zinc-950/10"
      >
        <div className="flex flex-col text-base/7">
          {copy.nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => detailsRef.current?.removeAttribute("open")}
              className="rounded-xl px-3 py-3 font-medium text-zinc-600 hover:bg-zinc-950/5 hover:text-zinc-950"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </details>
  );
}
