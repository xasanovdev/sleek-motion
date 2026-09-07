# Animation components

Reusable React 19 + Motion components. Core dependencies are `react` and `motion`; there are no Next.js, Tailwind, icon-library or application imports.

```tsx
import { Fade } from "@/registry/animations/presence/fade";
import { Collapse } from "@/registry/animations/layout/collapse";
// Family imports and @/registry are also available inside this repository.
```

## Catalog

| Folder                | Components                                                                                                      | Purpose / frequency                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `animations/presence` | `Fade`, `ScaleFade`, `SlideFade`, `Reveal`, `Stagger`, `StaggerItem`                                            | Occasional entrances, exits and grouped reveals               |
| `animations/content`  | `ContentSwap`, `DirectionalContentSwap`, `SequentialContent`, `AnimatedList`, `SharedElement`, `SharedIndicator` | State changes, list continuity and shared identity            |
| `animations/layout`   | `Collapse`, `AutoHeight`, `LayoutShift`                                                                         | Occasional expansion and content resizing                     |
| `animations/feedback` | `Pressable`, `AsyncButton`, `IconSwapButton`, `CopyButton`, `Shake`, `ToggleMotion`, `CheckboxMotion`              | Brief pointer feedback, explicit errors and control state     |
| `animations/loading`  | `Spinner`, `DotsLoader`, `PulseLoader`, `Skeleton`, `Shimmer`, `ProgressBar`, `CircularProgress`, `LoadingSwap` | Loading state and task progress, only while useful            |
| `animations/viewport` | `ScrollReveal`, `ScrollProgress`, `PageTransition`                                                              | Occasional viewport entry, reading progress and route content |
| `recipes/overlays`    | `Backdrop`, `ModalMotion`, `PopoverMotion`, `DropdownMotion`, `DrawerMotion`, `ToastMotion`, `LoadingOverlay`   | Motion adapters for accessible overlays                       |

All foundation and V1 entries from the specification now have implementations. All 39 entries have catalog pages at `/animations`, with working previews, usage/API guidance, complete integration prompts, source copying and GitHub references. The prompt carries an authoritative source snapshot. Base UI controls in integration examples are declared separately; the registry itself remains React + Motion only. Each component has a separate file except the paired `Stagger` / `StaggerItem`. Recipes have their own barrel at `registry/recipes/overlays`.

## Shared contract

- Most wrappers accept a typed intrinsic HTML `as`, `className`, `style`, Motion-compatible DOM handlers and a React 19 `ref` prop. Default: `div`. Exceptions: `AnimatedList` uses `ul`, indicators/thumbs/loaders use `span`, `Pressable` is a native `button`, checkmarks/circular progress use SVG.
- Timing is in **seconds**, distance in **pixels**. `motion-tokens.ts` defines 160–240ms timing, 12px movement, ease-out and a restrained layout spring.
- `reducedMotion` forces reduced motion. System preferences always apply and update live; false does not override the OS. The SSR snapshot prefers reduced motion until hydration completes.
- Presence uses `initial={false}` by default so visible SSR content stays visible. Set `initial` to opt into a mount entrance.
- Reduced motion removes movement but preserves useful fades. Size, toggle and progress updates become immediate. Reading progress tracks the actual scroll position without smoothing.
- Avoid spatial animation for very frequent keyboard actions. `Pressable` scales only on pointer input; consumers can pass `reducedMotion` for keyboard-driven control updates.
- Do not also control animation-owned transforms, opacity, height or clipping in consumer styles. Use another wrapper for independent transforms or layout constraints.
- Layout/shared components use transition presets instead of duration/delay. `ScrollProgress` has no timing options.

## Presence

```tsx
<Fade as="li" show={visible} ref={itemRef}>Result</Fade>
<ScaleFade show={open} scale={0.96}>Surface</ScaleFade>
<SlideFade show={visible} direction="up" distance={12}>Notice</SlideFade>
<Reveal show={visible} direction="right">Image</Reveal>
<Stagger show={visible} interval={0.04}>
  <StaggerItem>First</StaggerItem>
  <StaggerItem>Second</StaggerItem>
</Stagger>
```

Keep the wrapper mounted and change `show` (default true). Each wrapper owns presence and unmounts its child after exit; `onExitComplete` reports removal. Exiting content becomes inert and hidden from assistive technology immediately. `direction` describes physical entrance travel: `up` starts below its destination. Stagger is for occasional entrances and does not disable interaction; use `AnimatedList` for dynamic additions/removals.

## Content and layout

```tsx
<ContentSwap contentKey={status}>{statusLabel}</ContentSwap>
<DirectionalContentSwap contentKey={step} direction={direction} dir="rtl">
  <StepContent step={step} />
</DirectionalContentSwap>
<Collapse id="details" open={open} keepMounted>
  <div style={{ padding: 16 }}>Dynamic content</div>
</Collapse>
<AutoHeight><ContentThatCanResize /></AutoHeight>
<AnimatedList items={items} getKey={(item) => item.id}
  renderItem={(item) => <Row item={item} />} />
```

- Swaps require a stable `contentKey`. Default `mode="wait"`; `sync` and `popLayout` also work. `popLayout` needs a positioned ancestor. Directional swaps accept `1` / `-1`, `axis="x" | "y"`, and pass the latest direction to exiting content. Pass `dir="rtl"` explicitly to reverse horizontal travel; inherited page direction is not read.
- `SequentialContent` composes the directional swap with `step={stepIndex}`. Use a finite, ordered numeric index; increases travel forward and decreases travel backward, including skipped steps. Same-step updates preserve the mounted content. It accepts the same `mode`, `axis`, `distance`, `duration`, `initial`, `dir`, `as`, and ref options. Navigation, progress labels, validation, announcements and focus between steps belong to the consumer. Use it for occasional wizard/onboarding transitions, not high-frequency keyboard navigation.
- Collapse follows changing child height. Closed content unmounts unless `keepMounted` is set, which preserves state while applying `inert` and `aria-hidden`. Put padding/borders inside the child so closed height reaches zero. The consumer owns the trigger's `aria-expanded`, `aria-controls` and focus restoration. `onExitComplete` applies to removal, not a kept-mounted close.
- Height wrappers use `ResizeObserver` and a measured inner `div` with `display: flow-root`; choose an outer tag that permits a div child. Height animation intentionally preserves document flow. `AutoHeight` always stays mounted.
- Animated lists require unique stable keys. Defaults are `ul` / `li`; `renderItem` returns row contents. Customize `as`, `itemAs` and `itemClassName` together for other structures.
- `LayoutShift` defaults to position-only movement. `SharedElement` / `SharedIndicator` require `layoutId`; scope independent groups with Motion's `<LayoutGroup id="...">`. The indicator is decorative and consumer-positioned.

## Feedback and loading

```tsx
<Pressable onClick={save} disabled={saving}>Save</Pressable>
<Shake trigger={errorAttempt}><FieldWithVisibleError /></Shake>
<ToggleMotion checked={checked} distance={16} style={{ display: "block" }} />
<CheckboxMotion checked={checked} />
<Spinner label="Saving" />
<DotsLoader label="Searching" paused={paused} />
<Skeleton style={{ width: 200, height: 20 }} />
<ProgressBar value={completed} max={total} label="Upload" />
<ProgressBar label="Connecting" />
<CircularProgress value={percent} label="Upload" />
<LoadingSwap loading={loading} fallback={<Spinner />}>{result}</LoadingSwap>
```

Pressable defaults to `type="button"`. Pointer press uses 160ms by default and release is capped at 100ms; keyboard activation stays still. Shake runs when `trigger` changes, not on mount, and needs a visible error message. Toggle/checkmark components are decorative parts of accessible controls: the consumer owns the real input, labels, state and keyboard behavior. Pass `dir="rtl"` explicitly for RTL thumb travel.

### Stateful buttons

```tsx
<AsyncButton status={status} onClick={save}
  loadingContent="Saving…" successContent="Saved" errorContent="Retry save">
  Save changes
</AsyncButton>
<IconSwapButton iconKey={String(favorite)} aria-label="Favorite"
  aria-pressed={favorite} onClick={() => setFavorite(!favorite)}>
  {favorite ? <FilledStar /> : <Star />}
</IconSwapButton>
<CopyButton text={source} resetAfter={2}
  onCopySuccess={(copiedText) => reportCopied(copiedText)}
  onCopyError={(error) => reportCopyFailure(error)} />
```

- All three compose `Pressable` and `ContentSwap`, forward button refs and accept native button props. The content crossfades in place with `mode="sync"` and a default 160ms duration. Only pointer presses scale; reduced motion removes that scale. Content must be noninteractive phrasing content (text/icons/spans), never nested links or buttons. The consumer supplies appearance and adequate target size.
- `AsyncButton` is controlled: `status` is `idle | loading | success | error`; it never starts a request itself. `children` is idle content. Defaults are `Loading…`, `Done`, and `Try again`; override the three content props to localize them. Loading immediately sets `aria-busy` and `aria-disabled`, prevents click handlers and button-initiated form submission, and preserves keyboard focus. A consumer-provided native `disabled` remains supported. The consumer owns the status lifecycle and guards submission through other controls or form-level handlers. Pair important outcomes with a persistent visible status message; animated button content is not a live announcement region.
- `IconSwapButton` requires `iconKey` and a meaningful `aria-label`. Its icons are decorative and excluded from the accessibility tree. The consumer owns state and `aria-pressed` for toggles. Avoid repeatedly changing icons without an action or state change to explain.
- `CopyButton` owns `idle → loading → success/error`. It calls `navigator.clipboard.writeText(text)` directly from the activation gesture and reports success only after resolution. It always uses `type="button"`. The Clipboard API needs a supported secure context (HTTPS or localhost); absence or rejection shows a retryable error and calls `onCopyError`. No legacy clipboard fallback or permissions prompt is added.
- Copy defaults are `Copy`, `Copying…`, `Copied`, and `Copy failed. Retry`; customize `children` and the three content props. `resetAfter` is seconds, defaults to 2, and resets success to idle. Error feedback persists until retry or source change. Repeated pending clicks are ignored. Changing `text` resets feedback; obsolete results/timers and completions after unmount cannot update state or call completion callbacks. An already-started clipboard write itself cannot be canceled. `onClick(event.preventDefault())` cancels a copy before it starts. The native `onCopy` prop remains the DOM copy event; use `onCopySuccess` for completion.

Looping loaders pause offscreen, while the document is hidden, on `paused`, or under reduced motion. Their duration is one cycle. Colors inherit `currentColor`; `Shimmer` needs consumer dimensions. Skeleton is decorative by default (`label=""`); announce loading once on its containing region. Other loaders default to `role="status"`. Progress uses `progressbar`, clamps values and omits `aria-valuenow` when indeterminate. Replace default English labels for localized applications. LoadingSwap only transitions fallback/content; it does not fetch data.

## Viewport and overlays

ScrollReveal uses `IntersectionObserver`, defaults to `once`, and keeps SSR / initially visible content visible. Below-fold content hides after observation and reveals on entry. `amount` is an intersection ratio; `margin` is a CSS root margin. Avoid `amount={1}` for content taller than its viewport.

ScrollProgress reads vertical page progress; `container`, `target`, `offset` scope it and `axis` selects the bar orientation. Supply dimensions and placement. PageTransition is a keyed fade: mount it above route content, pass `contentKey`, and manage focus, announcements and scroll restoration in the router integration.

Overlay recipes contain motion only. Integrate with accessible dialog/menu/popover/toast primitives that own portals, focus traps, dismissal, scroll locking and roles. Keep the motion surface mounted until exit ends (often `forceMount`). Supply position and appearance. Modal scales from center; popover/dropdown use `--transform-origin` or `style.transformOrigin`; drawer moves from a physical `edge` by its own size; toast enters/exits in the same direction.

`LoadingOverlay` composes `Fade` with `loading={boolean}`, default `role="status"`, a polite live region, and `label="Loading…"`. `children` replaces the default label text with your own noninteractive loading content. It accepts the presence options except `show`, including `initial`, `onExitComplete`, duration, reduced motion, semantic tag and ref. It unmounts after exit and becomes inert while exiting. Use it for a briefly blocked region, not background fetching that permits continued interaction. The consumer positions the overlay, applies `aria-busy` and any required `inert` to the busy content (never to the overlay's ancestor), and manages focus before blocking content and when restoring it. It does not trap focus, lock scrolling, or prevent interaction with the rest of the page. Avoid nested loaders that announce the same status twice.

## Copying and advanced composition

Presence/content components export named variants; layout components export transition presets; loaders use `loading.module.css`. Direct variant users own presence, reduced motion, initial/animate/exit states and focus exclusion.

```tsx
<motion.li
  variants={slideFadeVariants}
  custom={{ direction: "up", distance: 12, reducedMotion }}
  initial="hidden"
  animate="visible"
  exit="hidden"
/>
```

Copy the component and all its relative imports, preserving directory relationships. A complete copy of `registry/` works without showcase code. For a smaller copy include referenced foundation components, `motion-tokens.ts`, referenced `internal/` helpers and (for loaders) `loading.module.css` / `types.ts`. `create-presence.tsx` centralizes lifecycle behavior; it is not a public preset component. Ref forwarding requires React 19 ref-as-prop support.

`manifest.ts` lists all 39 entry files (including the paired Stagger exports in one entry). `lib/registry-source.ts` is website-side code: it follows static relative imports at build time, restricts files to the registry, and rejects dependencies other than React/Motion. It does not ship with copied components. The detail-page **Copy required files** action copies the component and every supporting file, separated by `// --- file: registry/... ---` comments. Save each section to its named path; the bundle is not a single-file component. **Copy prompt** also includes the integration instructions, repository/file references and a complete usage example. A manual selection fallback is available if the clipboard is unavailable. **Copy component** and **Copy file** copy raw source individually. **Copy example** copies a self-contained React usage example with matching relative imports.

## Verification

```sh
bun run typecheck
bun run lint
bun run test:animations
bun run test:copy
bun run build
bun run test:catalog
```

Install development dependencies with `bun install --frozen-lockfile`, then install Chromium once with `bun run test:install`. Playwright is a pinned development dependency. For a host-provided runtime, set `PLAYWRIGHT_MODULE` to its `index.mjs` and optionally `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The runner builds an isolated temporary fixture, starts a local server and cleans up; it adds no application route or production dependency.

The fixture covers SSR/hydration, semantic tags/ref forwarding, exits, rapid reversals/swaps, dynamic height, kept-mounted accessibility, RTL, lists, keyboard/pointer behavior, progress, live reduced-motion updates and viewport/loop pausing. V1 checks also cover inferred step direction, async-button focus and duplicate-submit prevention, icon labels/toggles, clipboard failure/retry and stale-result cleanup, loading-overlay cleanup and dropdown origins with consumer styles. Clipboard outcomes are simulated deterministically; browser permission UI, physical touch-device testing and a visual motion audit remain separate from automated Chromium checks.
