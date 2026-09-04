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
| `animations/content`  | `ContentSwap`, `DirectionalContentSwap`, `AnimatedList`, `SharedElement`, `SharedIndicator`                     | State changes, list continuity and shared identity            |
| `animations/layout`   | `Collapse`, `AutoHeight`, `LayoutShift`                                                                         | Occasional expansion and content resizing                     |
| `animations/feedback` | `Pressable`, `Shake`, `ToggleMotion`, `CheckboxMotion`                                                          | Brief pointer feedback, explicit errors and control state     |
| `animations/loading`  | `Spinner`, `DotsLoader`, `PulseLoader`, `Skeleton`, `Shimmer`, `ProgressBar`, `CircularProgress`, `LoadingSwap` | Loading state and task progress, only while useful            |
| `animations/viewport` | `ScrollReveal`, `ScrollProgress`, `PageTransition`                                                              | Occasional viewport entry, reading progress and route content |
| `recipes/overlays`    | `Backdrop`, `ModalMotion`, `PopoverMotion`, `DropdownMotion`, `DrawerMotion`, `ToastMotion`                     | Motion adapters for accessible overlays                       |

Each component has a separate file except the paired `Stagger` / `StaggerItem`. Recipes have their own barrel at `registry/recipes/overlays`.

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

Pressable defaults to `type="button"`. Shake runs when `trigger` changes, not on mount, and needs a visible error message. Toggle/checkmark components are decorative parts of accessible controls: the consumer owns the real input, labels, state and keyboard behavior. Pass `dir="rtl"` explicitly for RTL thumb travel.

Looping loaders pause offscreen, while the document is hidden, on `paused`, or under reduced motion. Their duration is one cycle. Colors inherit `currentColor`; `Shimmer` needs consumer dimensions. Skeleton is decorative by default (`label=""`); announce loading once on its containing region. Other loaders default to `role="status"`. Progress uses `progressbar`, clamps values and omits `aria-valuenow` when indeterminate. Replace default English labels for localized applications. LoadingSwap only transitions fallback/content; it does not fetch data.

## Viewport and overlays

ScrollReveal uses `IntersectionObserver`, defaults to `once`, and keeps SSR / initially visible content visible. Below-fold content hides after observation and reveals on entry. `amount` is an intersection ratio; `margin` is a CSS root margin. Avoid `amount={1}` for content taller than its viewport.

ScrollProgress reads vertical page progress; `container`, `target`, `offset` scope it and `axis` selects the bar orientation. Supply dimensions and placement. PageTransition is a keyed fade: mount it above route content, pass `contentKey`, and manage focus, announcements and scroll restoration in the router integration.

Overlay recipes contain motion only. Integrate with accessible dialog/menu/popover/toast primitives that own portals, focus traps, dismissal, scroll locking and roles. Keep the motion surface mounted until exit ends (often `forceMount`). Supply position and appearance. Modal scales from center; popover/dropdown use `--transform-origin` or `style.transformOrigin`; drawer moves from a physical `edge` by its own size; toast enters/exits in the same direction.

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

## Verification

```sh
bunx tsc --noEmit --incremental false
bunx eslint registry tests/animations
node tests/animations/browser.mjs
bun run build
```

Browser tests need an available `playwright` package and Chromium. For a host-provided runtime, set `PLAYWRIGHT_MODULE` to its `index.mjs` and optionally `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The runner builds an isolated temporary fixture, starts a local server and cleans up; it adds no application route or production dependency.

The fixture covers SSR/hydration, semantic tags/ref forwarding, exits, rapid reversals/swaps, dynamic height, kept-mounted accessibility, RTL, lists, keyboard/pointer behavior, progress, live reduced-motion updates and viewport/loop pausing. Physical touch-device testing and a visual motion audit remain separate from automated Chromium checks.
