# Sleekmation

A copy-first collection of React animation primitives and UI motion recipes.
The website uses Next.js, React, TypeScript and Bun. Copied components require
only React 19 and Motion; their appearance belongs to the consuming application.

## Animation registry

The foundation and V1 component families are implemented in `registry/animations`,
grouped by presence, content, layout, feedback, loading and viewport. Overlay
motion recipes live in `registry/recipes/overlays`.

See the [registry guide](registry/README.md) for APIs, usage, copy dependencies and
accessibility responsibilities, and the [product specification](SPECIFICATION.md)
for scope and quality requirements. `/animations` provides search and category
filters across seven categories and 39 interactive detail pages. Try a demo in a
card or open its page, then use **Copy prompt** to copy an integration guide, GitHub
references, a working example and all required source files. Direct component/file
copying and API guidance remain available. The project does not ship a component npm
package or installer CLI.

## Development

```sh
bun install --frozen-lockfile
bun run dev
```

Open [localhost:3000](http://localhost:3000). The English landing route lives in
`app/(english)` and the Uzbek route in `app/(uzbek)/uz`. Set
`NEXT_PUBLIC_SITE_URL` to the public site origin for production canonical and
language-alternate metadata; the development fallback is localhost.

## Verification

```sh
bun run test:install # Install Chromium once after dependencies
bun run typecheck
bun run lint
bun run test:animations
bun run test:copy
bun run build
bun run test:catalog # Requires the production build
```

The browser runner creates an isolated temporary fixture, verifies server
rendering/hydration and interactive behavior, then cleans up. It requires local
server and browser-launch permissions. See the registry guide for host-provided
browser overrides. `bun run build --webpack` is also available when the execution
environment cannot run Turbopack. Physical touch-device and visual motion checks
remain separate from the automated suite.

`registry/manifest.ts` identifies all 39 component entry files. The server-only
source reader follows relative imports to collect complete file bundles. Copy
tests build every bundle in isolation, type-check all 39 usage examples and check
that each prompt includes the full source closure.
Catalog tests start and stop a temporary production server and verify search,
copying, controls, metadata and mobile layouts. Technical catalog pages are English.

## Landing playground

- `/` is the English landing; `/uz` is the Uzbek landing.
- The landing previews use the actual `Fade`, `DirectionalContentSwap` and
  `Collapse` registry components. Both languages link to the English catalog.
- Animation badges pause on hover, keyboard focus or the pause control.
  Reduced-motion preferences show stationary, horizontally scrollable choices.
- The header and hero have restrained initial entrances with reduced-motion
  support. The header becomes compact while scrolling.
- The palette is white, black and `#0072CE`. Landing sections and controls live
  in `components/landing`.

## Prompt workflow

1. Open `/animations`, search by component name or motion term, and choose a category.
2. Use **Try animation** for an in-card demo, or open **Details** for controls and guidance.
3. Use **Copy prompt**, then paste the result into your coding agent in the target project.

The agent is instructed to inspect the target UI, preserve its styles, save every
included file, check React 19/Motion 13 compatibility, and verify accessibility.
Prompts are static text endpoints at `/animations/<slug>/prompt`; source bundles
are loaded on demand in catalog cards. On clipboard failure the full prompt is
available for manual selection, and failed requests can be retried.

GitHub links are references, not runtime dependencies. Embedded snapshots are
complete and authoritative, and include the MIT notice at `registry/LICENSE`.
Source links point to the corresponding files on GitHub's `main` branch.
Deploying the site is a separate operation.

The shared-layout demos use their native spring timing; scroll progress follows
the real position without a speed control. Other timed examples expose playback
speed. Direction-sensitive examples offer RTL, and every example offers reduced
motion and a compact preview. Detail pages pair the live example with a short
motion guide and **Copy prompt** action. **Read the prompt** reveals the full
integration text below the preview; guide and controls stack on smaller screens.
See `plans/motion-audit.md` for review findings,
accepted motion tradeoffs and validation limits.

## ThreadPreview study

`/experiments/thread-preview` is a portfolio prototype for reviewing one expressive
interaction before adding it to the registry. Hover or focus **interfaces** to
reveal the project, tap to pin it, and use Escape or the close control to dismiss.
The preview uses a local screenshot of Sleekmation. The page is marked `noindex`
and is not included in the animation catalog.

After a production build, run `node tests/thread-preview-browser.mjs` for the
focused interaction and responsive checks. Add `--capture-project` only when you
want to refresh its bundled screenshot from the local production homepage.
