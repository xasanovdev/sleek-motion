import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/components/landing/landing.types";

export function Brand({
  className,
  locale,
}: {
  className?: string;
  locale: Locale;
}) {
  return (
    <Link
      href={locale === "en" ? "/" : "/uz"}
      aria-label={locale === "en" ? "Sleekmotion homepage" : "Sleekmotion bosh sahifa"}
      className={clsx(
        "inline-flex min-h-11 shrink-0 items-center rounded",
        className,
      )}
    >
      <Image
        src="/logo.svg"
        alt="Sleekmotion"
        width={752}
        height={88}
        className="h-auto w-40 sm:w-52"
      />
    </Link>
  );
}
