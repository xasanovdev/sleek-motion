# Motion review — September 5, 2026

Scope: all 39 registry entries, the catalog and both landing routes. Base commit:
`ef593d3`; reviewed together with the current uncommitted product changes.

The requested design, animation-vocabulary, improve-animations,
find-animation-opportunities and review-animations skills informed this pass.
Audit work was read-only; implementation followed the user's explicit request to
finish the prompt-first product. Existing registry contracts remain authoritative
where a general motion rule conflicts with a deliberate primitive, such as Fade
or measured height.

## Vetted audit and implemented changes

| Severity | Category | Location | Finding | Resolution |
| --- | --- | --- | --- | --- |
| Medium | Accessibility | `app/globals.css:136`, `components/landing/playground/animation-marquee.tsx:53` | Global active styling scaled keyboard presses; duplicate visible controls could receive focus while aria-hidden. | Removed generic active scaling. Pointer feedback belongs to Pressable. Every interactive visible duplicate is represented in the accessibility tree. |
| Medium | Accessibility / interruptibility | `components/landing/playground/motion-playground.tsx:74` | Raw exit wrappers kept outgoing demo controls active. | Reused ContentSwap in sync mode, 160ms, with overlapping grid placement. Exiting controls are inert and aria-hidden. |
| Medium | Timing | `registry/animations/feedback/pressable.tsx:42` | Pointer press and release used identical timing. | Preserve the 160ms default press; cap release at 100ms with the existing ease-out curve. |
| Medium | Physical placement | `content/examples/modal-motion.tsx:12`, `content/examples/drawer-motion.tsx:12` | Reset styles removed native dialog centering; the drawer did not attach to its declared edge. | Explicit centered margins for the modal and inline-start auto margin for the drawer. Browser tests check exact placement after entrance settles. |
| Medium | Copy integrity | `registry/manifest.ts:36`, `lib/animation-prompt.ts:16` | Five new entry paths are not yet published to main. Remote links alone cannot deliver these sources. | Every prompt embeds its complete source closure and usage example. Unpublished entry links open the repository. No deployment or remote publication is claimed. |

## Review: before / after / why

| Before | After | Why |
| --- | --- | --- |
| Generic `:active` → `scale(.97)` | Pointer-only registry feedback; keyboard stays still | Repeated keyboard use should remain immediate. |
| Raw 180ms outgoing demo wrapper | Inert, aria-hidden ContentSwap exit at 160ms | Fading content must not remain interactive or be announced twice. |
| Symmetric 160ms press/release | 160ms press, release capped at 100ms | System response settles faster than deliberate input. |
| Source links without a complete handoff | One prompt with guidance, references, example and all files | Integration works even when a referenced remote snapshot is older. |
| Unpositioned native dialog under a CSS reset | Explicit modal center / drawer edge | Motion has to begin and end in the correct place. |

## Opportunities selected

| Location | Previous state | Purpose | Frequency | Motion and decision |
| --- | --- | --- | --- | --- |
| `components/showcase/prompt-copy.tsx:19` | No agent handoff action | Feedback and state indication | Occasional copy | AsyncButton: opacity crossfade, 160ms, cubic-bezier(0.23, 1, 0.32, 1). Success only after the clipboard resolves; errors preserve a manual fallback. |
| `components/showcase/catalog.tsx` | Six static preview links | Explanation | User explicitly requests a preview | On-demand real component demos. Only the selected card mounts its preview; no autoplaying wall of 39 animations. |
| `content/examples/` | 33 components had no public interactive use case | Explanation / spatial consistency | User-triggered demo | Existing component tokens: 160–240ms, 12px travel, .96 scale, 40ms stagger, layout spring 500/40/1. Reduced motion uses each primitive's documented behavior. |

Rejected candidates:

- Search-result entrance or reordering: typing is frequent; moving results would hinder scanning.
- Sidebar/page navigation transitions: repeated navigation needs an immediate response.
- Card hover travel or continuous decorative loops: no state or spatial information is gained.
- Extra confetti after copying: an occasional but utilitarian action only needs concise confirmation.

## Coverage and intentional exceptions

| Family | Entries | Review considerations |
| --- | ---: | --- |
| Presence | 5 | Fade is intentionally opacity-only. Scale starts at .96; SlideFade travels 12px. Reveal intentionally uses clip-path. Stagger has a 40ms interval and does not block controls. |
| Content | 6 | Stable keys, direction reversals, LayoutGroup identity scope, inert outgoing states. Shared/layout motion uses a native spring rather than a false playback-rate override. |
| Layout | 3 | Measured height is a deliberate document-flow tradeoff. Reduced motion makes resizing immediate. Large lists still require profiling in the consuming product. |
| Feedback | 7 | Native controls, persistent focus, pointer-only press movement, async duplicate prevention, copy retries and lifecycle cleanup. Checkmark drawing is a deliberate SVG effect. |
| Loading | 8 | Activity can be paused and stops offscreen/background/reduced-motion. No invented progress. Circular progress intentionally changes the SVG stroke. Loop periods may exceed 300ms; they are not interaction latency. |
| Viewport | 3 | SSR content stays visible. IntersectionObserver handles below-fold entrances. Reading progress directly reflects scroll position without interpolation or decorative lag. |
| Overlays | 7 | Motion-only core; native dialog/disclosure semantics in examples. Trigger origin is explicit, drawer edge matches position, consumer controls busy regions and announcements. |

The existing occasional landing hero entrance is preserved. Slow playback is an
explicit demonstration control, not production timing. Keyboard-accessible demo
controls intentionally let users try the effect; integration guidance rejects
spatial motion on frequently repeated keyboard actions. No new gestures, springs
or motion dependencies were introduced.

## Validation and verdict

- TypeScript and ESLint pass.
- All 39 source closures build separately; all 39 usage examples type-check outside the app.
- Every integration prompt contains its tested example and every complete required file.
- The animation browser suite covers SSR/hydration, rapid changes, focus, RTL, reduced motion, loading, clipboard races and overlay origins.
- The catalog browser suite covers all 39 routes/prompts and distinct demo behaviors, clipboard text and ClipboardItem paths, manual fallback, request retry, in-card previews, 320/375px layouts, native dialog focus/Escape, and landing exit/keyboard behavior.
- Desktop catalog/detail and mobile modal/drawer screenshots are visually reviewed. Browser tests check final modal centering and drawer edge placement.

**Approve for the implemented local V1 flow.** This is source review, automated
Chromium interaction coverage and representative visual inspection, not a claim
of physical-device, Safari/Firefox, production-load or remote-deployment testing.
The consumer still owns integration semantics and performance under real content.

No implementation findings remain open in this pass. Remote publication,
hosting, a broader browser/device matrix and optional packaging remain separate
project decisions.
