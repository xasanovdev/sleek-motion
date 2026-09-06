export const repositoryUrl = "https://github.com/xasanovdev/sleek-motion";

export const foundationSlugs = [
  "fade", "scale-fade", "slide-fade", "content-swap", "directional-content-swap", "collapse",
] as const;
export type FoundationSlug = (typeof foundationSlugs)[number];

export const families = {
  "animations/presence": ["fade", "scale-fade", "slide-fade", "reveal", "stagger"],
  "animations/content": ["content-swap", "directional-content-swap", "sequential-content", "animated-list", "shared-element", "shared-indicator"],
  "animations/layout": ["collapse", "auto-height", "layout-shift"],
  "animations/feedback": ["pressable", "async-button", "icon-swap-button", "copy-button", "shake", "toggle-motion", "checkbox-motion"],
  "animations/loading": ["spinner", "dots-loader", "pulse-loader", "skeleton", "shimmer", "progress-bar", "circular-progress", "loading-swap"],
  "animations/viewport": ["page-transition", "scroll-reveal", "scroll-progress"],
  "recipes/overlays": ["backdrop", "modal-motion", "popover-motion", "dropdown-motion", "drawer-motion", "toast-motion", "loading-overlay"],
} as const;
export type RegistrySlug = (typeof families)[keyof typeof families][number];
export const categories = ["Presence", "Content", "Layout", "Feedback", "Loading", "Viewport", "Overlays"] as const;

/** Source metadata only. No showcase code is imported by the registry. */
export const registryManifest = Object.entries(families).flatMap(([family, slugs]) =>
  slugs.map((slug) => ({
    slug,
    name: slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(""),
    source: `registry/${family}/${slug}.tsx`,
    category: family.split("/")[1],
    phase: (foundationSlugs as readonly string[]).includes(slug) ? "Foundation" : "V1",
  })),
);

export function githubSourceUrl(path: string) {
  return `${repositoryUrl}/blob/main/${path.split("/").map(encodeURIComponent).join("/")}`;
}
