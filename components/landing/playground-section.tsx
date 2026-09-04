import clsx from "clsx";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

import type { LandingCopy, Locale } from "./landing.types";
import { MotionPlayground } from "./playground/motion-playground";

export function PlaygroundSection({
  className,
  copy,
  locale,
}: {
  className?: string;
  copy: LandingCopy;
  locale: Locale;
}) {
  return (
    <section
      id="playground"
      className={clsx("border-t border-zinc-950/8 py-20 sm:py-28", className)}
    >
      <Container className="mx-auto">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow={copy.playgroundEyebrow}
            title={copy.playgroundTitle}
            description={copy.playgroundDescription}
            className="lg:sticky lg:top-10"
          />
          <div className="min-w-0">
            <MotionPlayground locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  );
}
