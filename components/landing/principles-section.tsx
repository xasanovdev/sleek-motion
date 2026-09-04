import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Container } from "@/components/ui/container";

import type { LandingCopy } from "./landing.types";

export function PrinciplesSection({
  className,
  copy,
}: {
  className?: string;
  copy: LandingCopy;
}) {
  return (
    <section
      id="principles"
      className={clsx("bg-zinc-950 py-20 text-white sm:py-28", className)}
    >
      <Container className="mx-auto">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-base/7 font-medium tracking-wide text-brand-400 sm:text-sm/6">
              {copy.principlesEyebrow}
            </p>
            <h2 className="mt-4 max-w-[24ch] text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              {copy.principlesTitle}
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg/8 text-pretty text-zinc-400">
              {copy.principlesDescription}
            </p>

            <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {copy.principles.map(([title, description]) => (
                <div key={title} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <dt className="font-medium text-white">{title}</dt>
                  <dd className="text-base/7 text-pretty text-zinc-400 sm:text-sm/6">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ApiPanel copy={copy} />
        </div>
      </Container>
    </section>
  );
}

function ApiPanel({ copy }: { copy: LandingCopy }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-white/10">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="font-medium text-white">{copy.codeLabel}</p>
        <p className="mt-2 max-w-[56ch] text-base/7 text-pretty text-zinc-400 sm:text-sm/6">
          {copy.codeDescription}
        </p>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-base/7 text-zinc-300 sm:p-6 sm:text-sm/6">
        <code>{`<DirectionalContentSwap
  contentKey={step}
  direction={direction}
  distance={16}
  mode="wait"
>
  <StepContent step={step} />
</DirectionalContentSwap>`}</code>
      </pre>
      <div className="border-t border-white/10 p-5 sm:p-6">
        <ul role="list" className="grid gap-3 text-base/7 text-zinc-300 sm:text-sm/6">
          {copy.details.map((detail) => (
            <li key={detail} className="flex items-start gap-3">
              <CheckIcon className="size-6 h-lh shrink-0 stroke-brand-400" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
