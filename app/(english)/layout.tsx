import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RootDocument } from "@/components/root-document";
import { createSiteMetadata } from "@/lib/site-metadata";

import "../globals.css";

export const metadata: Metadata = createSiteMetadata("en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
