import clsx from "clsx";

import { Container } from "@/components/ui/container";

import entrance from "./hero-entrance.module.css";
import type { LandingCopy, Locale } from "./landing.types";
import { MotionPlayground } from "./playground/motion-playground";

export function HeroSection({
  className,
  copy,
  locale,
}: {
  className?: string;
  copy: LandingCopy;
  locale: Locale;
}) {
  return (
    <section className={clsx("relative pt-14 pb-20 sm:pt-16 sm:pb-28", entrance.hero, className)}>
      <Container className="mx-auto">
        <div className="flex flex-col items-center text-center">
          <p className={clsx("text-xs font-medium tracking-[0.12em] text-zinc-500 uppercase", entrance.eyebrow)}>
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-medium tracking-[-0.06em] text-balance min-[375px]:text-4xl sm:text-6xl lg:text-7xl">
            <span className={clsx("block text-zinc-400", entrance.titleIntro)}>{copy.titleIntro}</span>
            <span className={clsx("block text-zinc-950", entrance.title)}>{copy.title}</span>
          </h1>
          <p className={clsx("mt-5 max-w-[48ch] text-base/7 text-pretty text-zinc-500 sm:text-lg/7", entrance.description)}>
            {copy.description}
          </p>
        </div>

        <MotionPlayground locale={locale} className="mx-auto mt-10 max-w-6xl sm:mt-12" />

        <p className={clsx("mt-6 text-center text-base/7 text-zinc-500 sm:text-sm/6", entrance.note)}>
          <span className="text-brand-500">03</span>
          <span className="mx-2 text-zinc-300" aria-hidden="true">/</span>
          {copy.previewNote}
        </p>
      </Container>
    </section>
  );
}
