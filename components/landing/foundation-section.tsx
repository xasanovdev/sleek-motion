import {
  BoltIcon,
  CodeBracketIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  RectangleGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import Link from "next/link";
import { foundationSlugs } from "@/registry/manifest";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

import type { LandingCopy } from "./landing.types";

const icons = [
  EyeIcon,
  RectangleGroupIcon,
  CursorArrowRaysIcon,
  CodeBracketIcon,
  BoltIcon,
  ShieldCheckIcon,
];

export function FoundationSection({
  className,
  copy,
}: {
  className?: string;
  copy: LandingCopy;
}) {
  return (
    <section
      id="library"
      className={clsx("border-t border-zinc-950/8 bg-white py-20 sm:py-28", className)}
    >
      <Container className="mx-auto">
        <SectionHeading
          eyebrow={copy.libraryEyebrow}
          title={copy.libraryTitle}
          description={copy.libraryDescription}
        />

        <dl className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {copy.items.map(([title, description], index) => {
            const Icon = icons[index];

            return (
              <div key={title} className="border-t border-zinc-950/10 py-7">
                <dt className="flex items-start gap-3 font-medium text-zinc-950">
                  <Icon className="size-4 h-lh shrink-0 fill-brand-500" />
                  <Link href={`/animations/${foundationSlugs[index]}`} className="hover:text-brand-500">{title} ↗</Link>
                </dt>
                <dd className="mt-2 max-w-[56ch] text-base/7 text-pretty text-zinc-600 sm:text-sm/6">
                  {description}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
