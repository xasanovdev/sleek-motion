import { CtaSection } from "./cta-section";
import { FoundationSection } from "./foundation-section";
import { HeroSection } from "./hero-section";
import { landingCopy } from "./landing.copy";
import type { Locale } from "./landing.types";
import { PrinciplesSection } from "./principles-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function LandingPage({ locale }: { locale: Locale }) {
  const copy = landingCopy[locale];

  return (
    <div className="min-h-dvh">
      <SiteHeader copy={copy} locale={locale} />
      <main className="isolate">
        <HeroSection copy={copy} locale={locale} />
        <FoundationSection copy={copy} />
        <PrinciplesSection copy={copy} />
        <CtaSection copy={copy} />
      </main>
      <SiteFooter copy={copy} locale={locale} />
    </div>
  );
}
