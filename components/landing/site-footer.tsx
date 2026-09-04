import clsx from "clsx";

import { Brand } from "@/components/ui/brand";
import { Container } from "@/components/ui/container";

import type { LandingCopy, Locale } from "./landing.types";

export function SiteFooter({
  className,
  copy,
  locale,
}: {
  className?: string;
  copy: LandingCopy;
  locale: Locale;
}) {
  return (
    <footer className={clsx("bg-white py-10", className)}>
      <Container className="mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-lg">
          <Brand locale={locale} />
        </div>
        <p className="text-base/7 text-pretty text-zinc-500 sm:text-sm/6">
          {copy.footer}
        </p>
        <nav aria-label="Footer navigation" className="text-base/7 sm:text-sm/6">
          <div className="flex flex-wrap items-center gap-5">
            {copy.nav.slice(0, 2).map(([label, href]) => (
              <a key={href} href={href} className="font-normal text-zinc-500 hover:text-zinc-950">
                {label}
              </a>
            ))}
          </div>
        </nav>
      </Container>
    </footer>
  );
}
