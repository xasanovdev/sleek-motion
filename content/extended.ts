import type { AnimationDoc, ApiRow } from "./animations";
import type { RegistrySlug } from "../registry/manifest";

type Category = AnimationDoc["category"];
const vocabulary = {
  reveal: ["Reveal", "Content is uncovered gradually, often by animating a clip-path or mask."],
  stagger: ["Stagger", "Animate several items one after another with a small delay between each, creating a cascade."],
  direction: ["Direction-aware transition", "Content slides one way going forward and the opposite way going back, so navigation has a sense of direction."],
  layout: ["Layout animation", "When an element's size or position changes, it animates to the new spot instead of snapping."],
  shared: ["Shared element transition", "An element travels and transforms from one position into another, like a thumbnail expanding into a card."],
  crossfade: ["Crossfade", "One element fades out as another fades in, in the same spot."],
  press: ["Press / Tap feedback", "A subtle scale-down when an element is clicked, so it feels physical."],
  shake: ["Shake / Wiggle", "A quick side-to-side jitter signaling an error or rejected input."],
  pulse: ["Pulse", "A gentle repeating scale or opacity change to draw attention."],
  skeleton: ["Skeleton / Shimmer", "A placeholder with a moving sheen shown while content loads."],
  scroll: ["Scroll reveal", "Elements fade or slide into place as they enter the viewport."],
  progress: ["Scroll-driven animation", "An animation whose progress is tied directly to scroll position."],
  page: ["Page transition", "An animation that plays when navigating from one page or route to another."],
  origin: ["Origin-aware animation", "An element animates out of its trigger, like a popover growing from the button that opened it instead of from its own center which is the default in CSS."],
  fade: ["Fade in / Fade out", "Element appears or disappears by changing opacity."],
  scale: ["Scale in", "Element grows from smaller to full size as it appears, often paired with a fade."],
  slide: ["Slide in", "Element enters by sliding in from off-screen (left, right, top, or bottom)."],
  scaleValue: ["Scale", "Make an element bigger or smaller."],
  rotate: ["Rotate", "Spin an element around a point."],
  line: ["Line drawing", "An SVG path that draws itself in, like an invisible pen tracing it."],
  translate: ["Translate", "Move an element along the X or Y axis."],
} as const;
function row(name: string, type: string, value: string, description: string): ApiRow { return { name, type, default: value, description }; }
const controlled = (name: string) => row(name, "boolean", "required", "The consumer controls this state.");
const show = row("show / initial", "boolean", "true / false", "Control visibility; opt into the first-render entrance with initial.");
const timing = row("duration / delay", "number (seconds)", "0.2 / 0", "Tune the transition; system reduced motion takes precedence.");
const style = row("className / style / ref", "DOM styling and ref props", "—", "Appearance belongs to the consumer. Keep animation-owned properties separate.");
const reduced = row("reducedMotion", "boolean", "false", "Force reduced motion; cannot override the operating system preference.");
const groupNotes: Record<Category, { avoid: string; accessibility: string; performance: string }> = {
  Presence: { avoid: "Avoid repeated entrances on frequently used controls. Never delay essential content or block interaction for a stagger.", accessibility: "Exiting content is inert and hidden from assistive technology. Restore focus before removing focused content. Reduced motion removes travel and clipping while preserving a fade.", performance: "Keep the group small. Stagger uses transform and opacity; Reveal intentionally animates clip-path, so test representative content under load." },
  Content: { avoid: "Avoid decorative movement during typing or frequent keyboard navigation. Keep durable state outside keyed content and use stable identities.", accessibility: "The consumer owns focus and announcements. Reduced motion removes travel and layout interpolation. Scope shared identities using LayoutGroup.", performance: "Keyed transitions connect related states. Layout and shared identity use a spring with stiffness 500, damping 40 and mass 1; avoid large simultaneously changing lists." },
  Layout: { avoid: "Avoid large batches of changing layout. Keep padding inside height wrappers and avoid collapsing a focused control.", accessibility: "Reduced motion makes size and position changes immediate. State and reading order remain the consumer's responsibility.", performance: "AutoHeight intentionally measures content with ResizeObserver and animates height to preserve document flow. LayoutShift uses Motion layout projection; profile representative content." },
  Feedback: { avoid: "Avoid decorative movement on frequent keyboard actions. Error feedback must explain what went wrong; a shake alone is insufficient.", accessibility: "Use native buttons and inputs. ToggleMotion and CheckboxMotion are decorative only; their consumers own checked state, labels and keyboard behavior. Spatial motion respects reduced motion.", performance: "Feedback is short and state driven. Keep focus on the persistent control and keep async side effects outside presentation components." },
  Loading: { avoid: "Do not invent progress or leave activity looping after completion. Avoid announcing every skeleton or every animation frame.", accessibility: "Provide one meaningful loading label. Loaders pause under reduced motion, when hidden or offscreen; progress values remain readable without interpolation.", performance: "Indeterminate loaders use CSS transform/opacity loops. CircularProgress deliberately changes an SVG stroke; the linear bar scales its fill. Stop activity when it is no longer useful." },
  Viewport: { avoid: "Do not hide initially visible or server-rendered content. Avoid decorative scroll lag and transitions on rapid navigation.", accessibility: "PageTransition does not implement routing, focus restoration or announcements. ScrollReveal respects reduced motion. ScrollProgress is decorative; pair it with readable content.", performance: "ScrollReveal uses IntersectionObserver. ScrollProgress directly reflects real scroll position; it does not smooth or add inertial movement." },
  Overlays: { avoid: "Do not treat motion wrappers as complete accessible overlays. Keep positioning, outside-click dismissal, focus and keyboard behavior in the consuming UI.", accessibility: "The examples compose Base UI Dialog, Popover, Menu and Toast with Sleekmation motion. Base UI owns focus, Escape, dismissal, menu keyboard navigation and announcements. Base UI owns the popup lifecycle; the examples apply exported motion variants so focus is not removed before dismissal completes.", performance: "These wrappers compose transform/opacity primitives. Drawer travel is relative to the surface size. Anchored surfaces need an explicit trigger-based transform origin." },
};
function doc(slug: RegistrySlug, category: Category, purpose: string, term: keyof typeof vocabulary, api: ApiRow[], notes: Partial<AnimationDoc> = {}): AnimationDoc {
  return { slug, name: slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(""), category, purpose, use: purpose, ...groupNotes[category], api: [...api, style, ...(slug === "scroll-progress" ? [] : [reduced])], example: "", term: vocabulary[term][0], termDescription: vocabulary[term][1], ...notes };
}
const loaderApi = (duration: string) => [row("label", "string", "Loading", "Accessible status label; Skeleton defaults to an empty decorative label."), row("paused", "boolean", "false", "Pause the CSS loop without removing the indicator."), row("duration", "number (seconds)", duration, "Length of one loop, not a UI transition.")];
const progressApi = [row("value / max", "number", "— / 100", "Completed amount and total. Values are clamped to the valid range."), row("label", "string", "Progress", "Accessible name for the progressbar."), row("duration", "number (seconds)", "0.2", "Interpolate changes; reduced motion makes them immediate.")];
const keyed = row("contentKey", "React.Key", "required", "Identifies the state; change it to replace the content.");
const mode = row("mode", '"wait" | "sync" | "popLayout"', '"wait"', "Sequence exits, crossfade, or pop exiting content out of layout.");
const origin = row("style.transformOrigin", "string", "CSS variable / fallback", "Set the origin where the surface meets its trigger, such as left top.");

export const extendedDocs: AnimationDoc[] = [
  doc("reveal", "Presence", "Uncover a featured image or panel from one edge.", "reveal", [show, row("direction", '"up" | "down" | "left" | "right"', '"up"', "Physical direction of the reveal."), timing]),
  doc("stagger", "Presence", "Introduce a small collection in a clear sequence.", "stagger", [show, row("interval", "number (seconds)", "0.04", "Time between StaggerItem entrances."), timing]),
  doc("sequential-content", "Content", "Move through ordered steps with automatic forward and backward direction.", "direction", [row("step", "number", "required", "A finite ordered index; changes determine direction."), mode, row("axis / distance / dir", '"x" | "y" / number / "ltr" | "rtl"', '"x" / 12 / —', "Control travel and explicitly reverse horizontal motion in RTL."), timing]),
  doc("animated-list", "Content", "Keep a task list readable as items arrive, leave or change position.", "layout", [row("items / getKey / renderItem", "array / function / function", "required", "Supply data, stable unique keys and row contents."), row("as / itemAs / itemClassName", "HTML tags / string", "ul / li / —", "Own list semantics and row appearance."), timing]),
  doc("shared-element", "Content", "Connect a compact preview to a larger view of the same object.", "shared", [row("layoutId", "string", "required", "Use the same ID for the connected elements; scope with LayoutGroup."), row("transition", "Motion Transition", "layout spring", "Override the layout spring; duration/delay are not standalone props.")]),
  doc("shared-indicator", "Content", "Move one selection marker between related options.", "shared", [row("layoutId", "string", "required", "A shared ID scoped by a LayoutGroup."), row("as", "HTML tag", "span", "The marker is decorative and consumer-positioned.")]),
  doc("auto-height", "Layout", "Let a summary panel grow naturally when its content gets longer.", "layout", [timing]),
  doc("layout-shift", "Layout", "Keep items connected to their previous positions during a layout change.", "layout", [row("layout", 'true | "position" | "size" | "preserve-aspect"', '"position"', "Choose the aspect of layout to interpolate."), row("transition", "Motion Transition", "layout spring", "Tune the spring; standalone duration/delay are not supported.")]),
  doc("pressable", "Feedback", "Give pointer presses a brief, physical response.", "press", [row("scale", "number", "0.97", "Scale while a pointer is pressing; keyboard stays still."), row("duration", "number (seconds)", "0.16", "Press timing; release is capped at 100ms."), row("type / disabled", "button type / boolean", "button / false", "Native button behavior.")]),
  doc("async-button", "Feedback", "Keep save, loading, success and retry states in one persistent button.", "crossfade", [row("status", '"idle" | "loading" | "success" | "error"', "required", "Caller-owned request state."), row("loadingContent / successContent / errorContent", "ReactNode", "Loading… / Done / Try again", "Customize each status label."), row("onClick", "event handler", "—", "Consumer starts work; loading blocks duplicate activation.")]),
  doc("icon-swap-button", "Feedback", "Change a favorite icon while keeping the button and focus stable.", "crossfade", [row("iconKey", "React.Key", "required", "Change when the icon state changes."), row("aria-label", "string", "required", "Accessible name; provide aria-pressed for toggles."), row("children", "ReactNode", "required", "The decorative icon to display.")]),
  doc("copy-button", "Feedback", "Copy text with clear success, error and retry feedback.", "crossfade", [row("text", "string", "required", "The exact clipboard payload."), row("resetAfter", "number (seconds)", "2", "Return to idle after success; zero resets immediately. Errors stay until retry."), row("onCopySuccess / onCopyError", "callbacks", "—", "Receive copied text or the clipboard error.")], { accessibility: "The native button keeps focus during copying and ignores duplicate pending clicks. Provide a live message and manual-copy fallback when clipboard access fails. Browser clipboard access requires a secure context." }),
  doc("shake", "Feedback", "Draw attention to a rejected action with a visible explanation.", "shake", [row("trigger", "React.Key", "required", "Change to replay the error response; does not shake on mount."), row("distance / duration", "number / seconds", "4 / 0.24", "Keep error movement small and brief.")]),
  doc("toggle-motion", "Feedback", "Move a switch thumb between two clearly labeled states.", "translate", [controlled("checked"), row("distance / dir", 'number / "ltr" | "rtl"', "16 / —", "Thumb travel in pixels and explicit text direction."), timing]),
  doc("checkbox-motion", "Feedback", "Draw the checkmark when a checkbox becomes selected.", "line", [controlled("checked"), row("duration", "number (seconds)", "0.2", "Checkmark drawing duration; reduced motion is immediate.")]),
  doc("spinner", "Loading", "Show that a short operation is still working.", "rotate", loaderApi("0.7")),
  doc("dots-loader", "Loading", "Show activity with a compact sequence of three dots.", "pulse", loaderApi("0.9")),
  doc("pulse-loader", "Loading", "Indicate background activity with a gentle repeating pulse.", "pulse", loaderApi("1.2")),
  doc("skeleton", "Loading", "Reserve space for content while its data is loading.", "skeleton", loaderApi("1.4")),
  doc("shimmer", "Loading", "Pass a soft sheen over a loading placeholder.", "skeleton", loaderApi("1.4")),
  doc("progress-bar", "Loading", "Show real completion progress along a horizontal track.", "scaleValue", progressApi, { use: "Use value and max for measurable work. Omit value for indeterminate activity; never invent completion percentages." }),
  doc("circular-progress", "Loading", "Show measurable progress in a compact circular indicator.", "line", progressApi),
  doc("loading-swap", "Loading", "Replace loading feedback with the resolved content in the same place.", "crossfade", [controlled("loading"), row("fallback / children", "ReactNode", "required", "Loading and resolved content."), timing]),
  doc("page-transition", "Viewport", "Connect related page content as the active view changes.", "page", [keyed, mode, timing]),
  doc("scroll-reveal", "Viewport", "Introduce below-fold content when it enters view.", "scroll", [row("once / amount / margin", "boolean / number / string", 'true / 0.2 / "0px"', "Repeat policy, visible fraction and IntersectionObserver root margin."), row("direction / distance", "direction / pixels", "up / 12", "Physical entrance travel."), timing]),
  doc("scroll-progress", "Viewport", "Show how far the reader has moved through the content.", "progress", [row("container / target / offset", "Motion useScroll options", "document scroll", "Choose the scroll container and measurement offsets."), row("axis", '"x" | "y"', '"x"', "Visual fill axis; the input always follows vertical scrolling.")]),
  doc("backdrop", "Overlays", "Dim the surrounding content as a surface takes focus.", "fade", [show, timing]),
  doc("modal-motion", "Overlays", "Bring an occasional centered dialog into focus.", "scale", [show, row("scale", "number", "0.96", "Hidden-state scale; origin stays centered."), timing]),
  doc("popover-motion", "Overlays", "Open a small contextual surface from its trigger.", "origin", [show, origin, row("scale", "number", "0.96", "Hidden-state scale."), timing]),
  doc("dropdown-motion", "Overlays", "Reveal a compact list of options from its trigger.", "origin", [show, origin, row("duration / scale", "seconds / number", "0.16 / 0.96", "Brief scale-and-fade response.")]),
  doc("drawer-motion", "Overlays", "Bring a supporting panel in from the edge of the screen.", "slide", [show, row("edge", '"top" | "right" | "bottom" | "left"', '"right"', "Position the consumer surface at the matching edge."), timing]),
  doc("toast-motion", "Overlays", "Announce a completed action with an occasional notification.", "translate", [show, row("direction / distance", "direction / pixels", "up / 12", "Physical entrance and exit travel."), timing]),
  doc("loading-overlay", "Overlays", "Show that an existing content region is being refreshed.", "fade", [controlled("loading"), row("label / children", "string / ReactNode", "Loading… / label", "Accessible loading status and optional content."), timing], { accessibility: "The consumer marks the busy region aria-busy and makes blocked controls inert, while keeping a persistent external trigger. The overlay defaults to a polite status; it does not trap focus." }),
];
