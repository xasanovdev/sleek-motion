# Forme agency template

Open `/experiments/agency` with the existing `bun dev` server.

An original, responsive agency homepage for branding, design, websites, and
development. Forme, its client names, and all project narratives are fictional.
The route is marked `noindex, nofollow` and is separate from the main registry.

## Editing the template

- `agency-content.ts`: project names, descriptions, disciplines, and services.
- `agency-page.tsx`: page sections, original project mockups, filters, case-study
  dialogs, mobile navigation, and inquiry form.
- `agency.module.css`: scoped typography, colors, layout, and responsive rules.
- `agency-sculpture.tsx`: lazily loaded procedural Three.js object. No model
  download is required. An inline vector supplies the WebGL fallback.
- `public/experiments/agency`: local photographs, fonts, and font license.

The inquiry form validates input and creates a downloadable text brief locally.
It does not submit to an API or send email. Connect a real delivery endpoint and
replace the demo copy before using this as an operational agency website.

Lenis is mounted only on this route and destroyed on unmount. Motion respects
the operating system's reduced-motion preference; visitors can also pause it
in the footer. The 3D scene skips rendering while offscreen, paused, or in a
background tab, caps pixel density, and disposes its GPU resources on unmount.
Dialogs use the existing Base UI dependency for keyboard and focus handling.

## Creative references

Representative homepage content was reviewed on September 6, 2026:

- [BASIC/DEPT](https://www.basicagency.com/): agency introduction followed by
  selected projects, engagements, and editorial content. Also inspected in a
  rendered browser; its project imagery was not reused.
- [Instrument](https://www.instrument.com/): recent work, connected brand and
  digital services, studio purpose, and contact paths.
- [COLLINS](https://wearecollins.com/): concise positioning, programs, and
  prominent case studies.

This was a focused structure study, not a full-site audit or an exact extraction
of those sites' responsive layouts, animation timing, or design tokens.

Our structure: studio navigation → typographic introduction and 3D sculpture →
filterable work → studio point of view → service accordions → project inquiry →
footer. Warm paper, tangerine, original client art direction, and locally hosted
Manrope give the template its own visual identity.

## Asset sources

Photographs are used under the [Unsplash license](https://unsplash.com/license).
They illustrate fictional concept projects and do not imply endorsements.

- `architecture.jpg`: [Tarun Hirapara on Unsplash](https://unsplash.com/photos/a-concrete-building-with-a-sky-in-the-background-CnzWTMAfOXE).
- `oranges.jpg`: [Kristina Fatina on Unsplash](https://unsplash.com/photos/a-yellow-bowl-filled-with-oranges-on-top-of-a-bed-PkztIn1e_Zk).
- Manrope: [Google Fonts](https://fonts.google.com/specimen/Manrope), SIL Open
  Font License; see `public/experiments/agency/manrope-license.txt`.
- Packaging, festival identity, workspace mockup, icons, and 3D sculpture were
  created in code for this template.

## Checks

`bun run typecheck` and focused ESLint cover the implementation. Browser checks
should cover desktop/tablet/mobile overflow, loaded media, category filters,
case-study open/close and focus restoration, service accordions, mobile menu
navigation, inquiry validation/download, and the motion pause control.
