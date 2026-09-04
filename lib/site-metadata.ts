import type { Metadata } from "next";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

const content = {
  en: {
    title: "Sleekmation — Motion that feels right",
    description:
      "Production-ready React animation primitives you can preview, understand, and copy.",
    canonical: "/",
  },
  uz: {
    title: "Sleekmation — Tabiiy his qilinadigan animatsiyalar",
    description:
      "Ko‘rib, tushunib va loyihangizga ko‘chirib olishingiz mumkin bo‘lgan React animatsiya primitivlari.",
    canonical: "/uz",
  },
} as const;

export function createSiteMetadata(locale: keyof typeof content): Metadata {
  const page = content[locale];

  return {
    metadataBase: siteUrl,
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonical,
      languages: { en: "/", uz: "/uz" },
    },
  };
}
