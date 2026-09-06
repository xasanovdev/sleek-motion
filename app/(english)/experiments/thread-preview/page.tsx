import type { Metadata } from "next";
import { ThreadPreviewStudy } from "@/components/experiments/thread-preview/thread-preview-study";

export const metadata: Metadata = {
  title: "ThreadPreview — A portfolio study",
  description: "An interactive portfolio introduction. Follow a word into the work behind it.",
  robots: { index: false, follow: false },
};

export default function ThreadPreviewPage() {
  return <ThreadPreviewStudy />;
}
