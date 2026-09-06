import { animationDocs, getAnimationDoc } from "@/content/animations";
import { getAnimationPrompt } from "@/lib/animation-prompt";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return animationDocs.map(({ slug }) => ({ slug })); }
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getAnimationDoc(slug)) return new Response("Animation not found", { status: 404 });
  return new Response(getAnimationPrompt(slug), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
