# Sleekmation Product Specification

- **Status:** Draft, product direction approved
- **Version:** 0.1
- **Date:** 2026-09-03
- **License:** MIT

## 1. Summary

Sleekmation is a copy-first collection of production-ready animation primitives
and UI motion recipes for React applications.

It provides:

- reusable React animation components;
- live, interactive examples;
- source code that can be copied directly into an application;
- exact GitHub links for every implementation;
- accessible reduced-motion behavior;
- guidance about when an animation should and should not be used.

The initial product is not an npm component package and does not include a CLI.
Stable primitives may be published as an optional npm package in a later phase.

## 2. Product goals

1. Make common frontend motion patterns reusable without hiding how they work.
2. Provide motion that is appropriate for real product interfaces, not only
   decorative demos.
3. Keep copied components small, typed, editable, and independent of the
   showcase design system.
4. Establish consistent timing, easing, accessibility, and performance rules.
5. Let developers evaluate every animation visually before copying it.

## 3. Non-goals

Sleekmation V1 will not:

- replace an accessible UI library;
- recreate dialog focus management, menu navigation, or focus trapping;
- require Tailwind CSS in copied animation components;
- ship a command-line installer;
- provide a general animation timeline editor;
- include decorative animation merely to make the catalog larger;
- publish every registry entry as an npm component.

## 4. Approved product decisions

### 4.1 Distribution

- The registry is copy-first.
- Every animation page provides **Copy code**.
- Every animation page provides an exact **View on GitHub** source link.
- V1 has no CLI.
- An optional npm package may be introduced after the APIs are stable.

### 4.2 Component styling

- Registry components are style-agnostic.
- Core components do not depend on Tailwind CSS.
- Components accept `className`, `style`, a forwarded ref, and appropriate DOM
  props.
- Colors, typography, shadows, radii, and product-specific spacing belong to
  the consumer.
- Tailwind CSS may be used by the showcase application only.

### 4.3 Public API shape

- Common use cases have small, explicitly named components.
- Sleekmation will not expose one large `Animation` component controlled by a
  growing `preset` string.
- Shared tokens and helpers are reused internally.
- Each primitive uses a polymorphic `as` prop, defaulting to `div` where
  appropriate.
- Each primitive exports its variants for advanced composition without an
  additional wrapper.
- V1 will not implement `asChild` or require a Slot dependency.

Example:

```tsx
<Fade as="li" show={isVisible}>
  <ListItem />
</Fade>

<motion.li variants={fadeVariants}>
  <ListItem />
</motion.li>
```

### 4.4 Framework compatibility

Registry components are framework-agnostic React components and must work in:

- Next.js App Router;
- Vite React;
- Remix or React Router applications;
- Astro React islands.

Files that require client-side React may include `"use client"`, but core
animation behavior must not depend on a Next.js router or server API.

### 4.5 Dependencies

Core copied components may depend only on:

- `react`;
- `motion`.

Radix, Base UI, routing frameworks, class-name helpers, and other packages may
appear in separate integration recipes but are not core dependencies.

The website uses `@base-ui/react` as its interactive UI foundation. Base UI owns
control semantics, focus, keyboard interaction, dismissal and overlay placement;
Sleekmation owns visual styling and animation. Copied examples that use Base UI
must disclose it separately from the React + Motion registry dependencies.

Motion is installed from the `motion` package and React APIs are imported from
`motion/react`. Sleekmation does not use the older `react-motion` package.

### 4.6 Motion personality

The default motion character is **crisp, restrained, and premium**.

- Common UI motion generally lasts 160–240ms.
- Positional entrances use small distances, generally 8–16px.
- Entrances and exits use a strong ease-out curve.
- Visible bounce is not a default.
- Springs are reserved for layout continuity, shared elements, interruptible
  movement, and gestures.
- Playful behavior is opt-in rather than the default.

### 4.7 Localization

- `/` is the English landing page.
- `/uz` is the O‘zbek landing page.
- Animation names, API documentation, source code, and code comments are in
  English.
- Technical catalog pages are English in V1.
- The two landing pages must use correct canonical and `hreflang` metadata.

### 4.8 Repository shape

V1 uses a single Next.js application. It is not a monorepo.

```text
src/
  app/
  components/
    showcase/
  content/
  registry/
    motion-tokens.ts
    animations/
    recipes/
```

The `registry` directory must not import from the showcase application. This
keeps it extractable into a future package without requiring a rewrite.

## 5. Technical foundation

- Next.js App Router for the website and showcase
- React and TypeScript
- Bun and one `bun.lock`
- Tailwind CSS for showcase presentation only
- Motion for React for presence, layout, gesture, and dynamic animation
- CSS for simple predetermined visual transitions where it is the smaller and
  more appropriate tool

Relevant Motion capabilities:

- [`motion` components](https://motion.dev/docs/react)
- [`AnimatePresence`](https://motion.dev/docs/react-animate-presence)
- [Layout animation and `layoutId`](https://motion.dev/docs/react-layout-animations)
- [Gesture animation](https://motion.dev/docs/react-gestures)
- [Scroll animation](https://motion.dev/docs/react-scroll-animations)
- [Reduced-motion support](https://motion.dev/docs/react-accessibility)
- [`LazyMotion` bundle optimization](https://motion.dev/docs/react-reduce-bundle-size)

## 6. Motion vocabulary

Sleekmation uses consistent names for commonly confused effects:

- **Crossfade** — One element fades out as another fades in, in the same spot.
- **Direction-aware transition** — Content slides one way going forward and
  the opposite way going back, so navigation has a sense of direction.
- **Enter / Exit** — The animation an element plays when it is added to or
  removed from the screen.
- **Accordion / Collapse** — A section smoothly expands and collapses its
  height to show or hide content.
- **Origin-aware animation** — An element animates out of its trigger, such as
  a popover growing from the button that opened it.
- **Layout animation** — When an element's size or position changes, it
  animates to the new spot instead of snapping.
- **Page transition** — An animation that plays when navigating from one page
  or route to another.
- **Skeleton / Shimmer** — A placeholder with a moving sheen shown while
  content loads.

## 7. Registry architecture

### 7.1 Shared files

Registry components use a shared `motion-tokens.ts` file instead of duplicating
curves and durations in every component.

Each catalog page must expose:

- **Copy component**;
- **Copy required files**;
- a visible list of required files and package dependencies.

### 7.2 Default tokens

Initial values:

```ts
export const motionEasing = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const;

export const motionDuration = {
  press: 0.16,
  tooltip: 0.16,
  dropdown: 0.2,
  standard: 0.24,
} as const;

export const motionDistance = {
  subtle: 8,
  standard: 16,
} as const;
```

The final implementation may add purpose-specific tokens, but it must not add
near-duplicate values without a documented reason.

### 7.3 Provider policy

No provider is required for registry components.

- Every component works after copying its own file and required shared files.
- Reduced-motion behavior is implemented by the component or shared helper.
- A global `MotionConfig` setup may be documented later as an optional recipe.
- `MotionProvider` is not part of the first milestone.

## 8. Animation catalog

### 8.1 Presence

| Item        | Purpose                                       | Priority         |
| ----------- | --------------------------------------------- | ---------------- |
| `Fade`      | Smooth appearance without spatial movement    | Foundation       |
| `ScaleFade` | Surface entrance and exit with subtle depth   | Foundation       |
| `SlideFade` | Explain the direction an element entered from | Foundation       |
| `Reveal`    | Uncover content using a clipped edge          | V1               |
| `Presence`  | Advanced configurable presence wrapper        | Later evaluation |
| `Stagger`   | Coordinate occasional group entrances         | V1               |

### 8.2 Content and state transitions

| Item                     | Purpose                                           | Priority   |
| ------------------------ | ------------------------------------------------- | ---------- |
| `ContentSwap`            | Crossfade keyed content                           | Foundation |
| `DirectionalContentSwap` | Preserve forward/back spatial direction           | Foundation |
| `SequentialContent`      | Present wizard or onboarding steps sequentially   | V1         |
| `SharedIndicator`        | Move one indicator between tabs or options        | V1         |
| `SharedElement`          | Preserve element identity across states           | V1         |
| `AnimatedList`           | Bridge list insertion, removal, and layout change | V1         |

### 8.3 Expand and layout

| Item             | Purpose                                       | Priority   |
| ---------------- | --------------------------------------------- | ---------- |
| `Collapse`       | Expand and collapse content without snapping  | Foundation |
| `AutoHeight`     | Animate changing content height               | V1         |
| `LayoutShift`    | Animate position or size changes              | V1         |
| `ReorderList`    | Drag items while surrounding items make space | Later      |
| `ExpandableCard` | Connect a summary card to expanded content    | Later      |

### 8.4 Overlay recipes

These are motion integrations, not replacements for accessible UI primitives.

| Item             | Purpose                                       | Priority |
| ---------------- | --------------------------------------------- | -------- |
| `Backdrop`       | Support overlay appearance without a hard cut | V1       |
| `ModalMotion`    | Centered modal entrance and exit              | V1       |
| `PopoverMotion`  | Trigger-origin popover motion                 | V1       |
| `DropdownMotion` | Short trigger-origin menu motion              | V1       |
| `DrawerMotion`   | Preserve the edge a drawer came from          | V1       |
| `SheetMotion`    | Touch-friendly drawer with drag dismissal     | Later    |
| `ToastMotion`    | Same-edge entrance, exit, and stack movement  | V1       |
| `LoadingOverlay` | Bridge a blocking loading state               | V1       |

### 8.5 Interaction feedback

| Item             | Purpose                                          | Priority |
| ---------------- | ------------------------------------------------ | -------- |
| `Pressable`      | Confirm a pointer press physically               | V1       |
| `AsyncButton`    | Connect idle, loading, success, and error states | V1       |
| `IconSwapButton` | Transition between icon states                   | V1       |
| `CopyButton`     | Confirm a successful copy action                 | V1       |
| `HoldToConfirm`  | Prevent accidental destructive actions           | Later    |
| `Shake`          | Indicate an error or rejected action             | V1       |
| `ToggleMotion`   | Preserve the toggle thumb across states          | V1       |
| `CheckboxMotion` | Make checked-state change legible                | V1       |

### 8.6 Loading and progress

| Item               | Purpose                                           | Priority |
| ------------------ | ------------------------------------------------- | -------- |
| `Spinner`          | Communicate indeterminate loading                 | V1       |
| `DotsLoader`       | Compact indeterminate loading                     | V1       |
| `PulseLoader`      | Subtle ambient loading indication                 | V1       |
| `Skeleton`         | Preserve content structure while loading          | V1       |
| `Shimmer`          | Add a restrained loading sheen                    | V1       |
| `ProgressBar`      | Communicate determinate or indeterminate progress | V1       |
| `CircularProgress` | Compact determinate progress                      | V1       |
| `LoadingSwap`      | Bridge loading content to resolved content        | V1       |

### 8.7 Navigation and viewport

| Item                        | Purpose                                        | Priority         |
| --------------------------- | ---------------------------------------------- | ---------------- |
| `PageTransition`            | Bridge route content changes                   | V1               |
| `DirectionalPageTransition` | Preserve forward/back route direction          | Later            |
| `ScrollReveal`              | Introduce occasional content on viewport entry | V1               |
| `ScrollStagger`             | Coordinate an occasional group reveal          | Later            |
| `ScrollProgress`            | Show reading or page progress                  | V1               |
| `Parallax`                  | Create scroll-linked depth                     | Advanced, opt-in |
| `ViewTransitionAdapter`     | Integrate native view transitions              | Later            |

## 9. Foundation milestone

The first implementation milestone contains:

1. `motion-tokens.ts`
2. `Fade`
3. `ScaleFade`
4. `SlideFade`
5. `ContentSwap`
6. `DirectionalContentSwap`
7. `Collapse`

No overlays, buttons, loaders, page transitions, public showcase, CLI, or npm
package are included in this milestone.

An internal development surface may be used to visually verify these
components before the public showcase is built.

## 10. Foundation API contracts

### 10.1 Presence primitives

`Fade`, `ScaleFade`, and `SlideFade` use a self-contained controlled API:

```tsx
<Fade show={isVisible}>
  <Content />
</Fade>
```

Requirements:

- `show` controls both enter and exit.
- The component owns the required `AnimatePresence` setup.
- Exit completes before the DOM node is removed.
- `as` selects the rendered semantic element.
- The implementation forwards its ref.
- The component exports its variant object for advanced composition.
- Movement is removed under reduced motion while useful opacity feedback stays.

### 10.2 Content swap

```tsx
<ContentSwap contentKey={status}>
  <StatusView status={status} />
</ContentSwap>
```

Requirements:

- `contentKey` identifies a new content state.
- The default transition is a short crossfade.
- Default presence mode is `wait`.
- `mode` accepts `sync`, `wait`, or `popLayout`.
- It does not require a render function.
- Rapid content changes must not leave stale content mounted.

### 10.3 Directional content swap

```tsx
<DirectionalContentSwap
  contentKey={step}
  direction={step > previousStep ? 1 : -1}
>
  <StepContent step={step} />
</DirectionalContentSwap>
```

Requirements:

- `direction` accepts `1 | -1`.
- Enter and exit use opposite directions.
- Direction is passed safely to exiting content.
- Default distance uses the shared standard distance token.
- The transform is removed under reduced motion.
- RTL behavior is demonstrated and documented.

### 10.4 Collapse

```tsx
<Collapse open={isOpen}>
  <PanelContent />
</Collapse>
```

Requirements:

- `open` controls expansion and collapse.
- Closed content unmounts after its exit completes by default.
- `keepMounted` is an opt-in alternative.
- Height follows dynamic content rather than a fixed maximum.
- Opacity completes slightly before the size collapse.
- Content is clipped during the size transition.
- Rapid open/close interaction continues from the current visual state.
- Hidden kept-mounted content must not remain keyboard-focusable or exposed as
  visible content to assistive technology.

### 10.5 Sequential content

`SequentialContent` accepts `step={stepIndex}` and otherwise shares the
directional content swap API. Increasing/decreasing a finite numeric index
infers forward/back travel, including skipped steps; `dir="rtl"` reverses
horizontal travel. Same-step updates preserve content identity. The consumer
owns navigation, validation, progress labels, announcements and focus.

### 10.6 Async button

`AsyncButton` uses controlled `status="idle" | "loading" | "success" | "error"`.
Idle content comes from `children`; `loadingContent`, `successContent` and
`errorContent` customize the other states. It composes `Pressable` with a short
in-place crossfade. While loading it remains focusable, exposes busy/disabled
semantics, and prevents duplicate click handlers and button-triggered submits.
The consumer owns requests, resetting status, and other form submission paths.

### 10.7 Icon swap button

`IconSwapButton` accepts `iconKey`, icon children and a required `aria-label`.
It preserves the button node and focus while crossfading decorative icon states.
The consumer owns the click behavior and `aria-pressed` when it is a toggle.

### 10.8 Copy button

`CopyButton` accepts `text`, copies from the activation gesture, and owns
loading/success/error feedback. Success is shown only after the Clipboard API
resolves; failures remain visible for retry. `resetAfter` defaults to two seconds
and resets success. Pending duplicate clicks are ignored. Source changes and
unmounts invalidate old completions and timers, but cannot cancel a clipboard
write already in progress. `onCopySuccess` and `onCopyError` report outcomes.
It always renders a native `type="button"` and requires a supported secure context.

### 10.9 Loading overlay

`LoadingOverlay` is an overlay recipe composing `Fade`, controlled by `loading`.
It defaults to a labeled, polite status region and unmounts after exit. The
consumer owns positioning, blocking the busy region, busy semantics on that
region, and focus handling. It does not implement modal focus or scroll locking.

## 11. Motion quality gate

Every catalog entry must pass all four questions:

1. **Frequency:** How often does the user encounter it?
2. **Purpose:** Is it feedback, spatial consistency, state indication,
   explanation, or prevention of a jarring change?
3. **Speed:** Can it remain within the appropriate UI duration budget?
4. **Function:** Does motion help the user understand or operate the UI?

Implementation rules:

- Do not animate keyboard-initiated, very high-frequency actions.
- Do not use `scale(0)` for UI entrances.
- Do not use `ease-in` as the primary response curve for UI motion.
- Do not use `transition: all`.
- Prefer transform and opacity.
- Any animation of layout-dependent values must be justified by the interaction
  and checked under load.
- Rapidly reversible animation must be interruptible.
- Popovers, dropdowns, and tooltips animate from their trigger origin.
- Modals remain centered.
- Hover motion must not create sticky touch behavior.
- Large transforms, parallax, and autoplay motion are removed or replaced for
  users who prefer reduced motion.
- Repeated animation must pause when it is not useful or visible where
  practical.
- Decorative stagger must not block interaction.

## 12. Deferred and rejected catalog candidates

- **Command-palette entrance:** rejected because it is keyboard-initiated and
  can occur hundreds of times per day.
- **Decorative animation on every card hover:** rejected because its frequency
  is high and its functional purpose is weak.
- **Animated data charts by default:** rejected because moving readable data
  for decoration can hinder comprehension.
- **Global parallax system:** deferred because it needs product-specific tuning
  and stronger reduced-motion handling.
- **Confetti and celebrations:** deferred to rare, high-emotion recipes.
- **Typewriter, marquee, orbit, and floating decoration:** deferred because
  they are primarily marketing patterns rather than common application UI.
- **Full carousel:** excluded from core because it is a complete interaction
  system rather than a focused animation primitive.

## 13. Showcase specification

### 13.1 Catalog page

The catalog must provide:

- category navigation;
- search;
- animation title and one-sentence purpose;
- a clear foundation, V1, later, or advanced label;
- direct links to each animation page.

### 13.2 Animation detail page

Every detail page provides:

- a live preview;
- controls for all meaningful states;
- a restart action for deterministic previews;
- playback speed controls for timed motion; native spring/scroll behavior remains unscaled;
- reduced-motion preview;
- RTL preview when direction matters;
- **When to use** guidance;
- **When not to use** guidance;
- accessibility notes;
- performance notes;
- public API documentation;
- a minimal usage example;
- full component source;
- **Copy component**;
- **Copy required files**;
- dependency list;
- exact GitHub file references on the repository's main branch;
- **Copy prompt** with a short agentic integration guide, complete source closure and working example;
- manual prompt selection and retry when clipboard/network access fails;
- mobile interaction preview where relevant.

Suggested routes:

```text
/animations
/animations/fade
/animations/content-swap
/animations/directional-content-swap
/animations/collapse
/animations/modal-motion
/animations/pressable
/animations/skeleton
```

## 14. Verification strategy

Each animation requires:

### Mechanical checks

- TypeScript type checking
- linting
- focused component tests
- production build

### Behavioral checks

- enter path
- exit path
- rapid repeated interaction
- dynamic child size where relevant
- correct cleanup after exit
- ref forwarding
- polymorphic element rendering

### Visual and accessibility checks

- normal-speed feel check
- slow-motion or frame-by-frame review
- reduced-motion behavior
- keyboard navigation
- pointer and touch behavior where relevant
- RTL behavior for directional motion
- no initial hydration flash
- no obvious frame drop under representative page load

## 15. Definition of done

An animation is complete only when:

1. Its purpose and frequency tier are documented.
2. Its TypeScript API is stable for the milestone.
3. Enter and exit are both implemented when applicable.
4. Rapid interaction does not jump or restart incorrectly.
5. Reduced-motion behavior is verified.
6. Keyboard, pointer, and touch behavior remain accessible.
7. The source is independently copyable with its required files listed.
8. The live example demonstrates a real UI use case.
9. GitHub links identify exact source paths. Embedded prompt snapshots are complete and authoritative.
10. The animation passes the motion review quality gate.

## 16. Delivery phases

### Phase 1 — Foundation specification and primitives

- finalize the foundation component contracts;
- implement shared motion tokens;
- implement the six foundation primitives;
- add focused tests and an internal visual test surface.

### Phase 2 — V1 component families

- layout and list transitions;
- overlay recipes;
- interaction feedback;
- loaders and progress;
- navigation and viewport patterns.

### Phase 3 — Public showcase

- English landing at `/`;
- O‘zbek landing at `/uz`;
- searchable animation catalog;
- interactive detail pages;
- 39 interactive previews, complete prompt copying, file copying and GitHub references.

### Phase 4 — Stabilization

- run a full motion audit;
- review every animation against the quality gate;
- remove or simplify low-value motion;
- evaluate an optional npm package and CLI only after usage patterns are clear.

## 17. Remaining decisions

The repository is `xasanovdev/sleek-motion`; the showcase uses the existing white, ink and blue identity. Verification uses TypeScript, ESLint, independent Bun bundles and Playwright Chromium.

Still deferred: hosting/deployment, a broader browser/device support matrix, and an optional npm package. These do not block using the complete copied sources.

The current showcase includes all 39 registry entries in seven categories. Its primary flow is preview → Copy prompt → integration by the user’s coding agent. Motion review evidence and explicit exceptions are recorded in `plans/motion-audit.md`.
