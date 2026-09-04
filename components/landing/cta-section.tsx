import clsx from "clsx";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

import type { LandingCopy } from "./landing.types";

export function CtaSection({
  className,
  copy,
}: {
  className?: string;
  copy: LandingCopy;
}) {
  return (
    <section
      className={clsx("border-b border-zinc-950/8 bg-brand-50 py-20 sm:py-28", className)}
    >
      <Container className="mx-auto">
        <SectionHeading
          align="center"
          eyebrow={copy.ctaEyebrow}
          title={copy.ctaTitle}
          description={copy.ctaDescription}
        />
        <div className="mt-8 text-center text-base/7 sm:text-sm/6">
          <ButtonLink
            href="#playground"
            variant="text"
            className="text-zinc-950 decoration-brand-400 decoration-2 hover:decoration-brand-600"
          >
            {copy.ctaAction}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
