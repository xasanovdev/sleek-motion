import type { Metadata } from "next";
import { AgencyPage } from "@/components/experiments/agency/agency-page";

export const metadata: Metadata = {
  title: "Forme® — Independent design & digital studio",
  description:
    "Different by design. A fictional independent studio shaping brands and building digital experiences.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AgencyPage />;
}
