This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Animation components

Reusable components live in `registry/animations`, grouped by presence, content, layout, feedback, loading and viewport. Overlay motion recipes live in `registry/recipes/overlays`. See [the registry guide](registry/README.md) for the catalog, APIs, copy dependencies and verification commands.

## Landing playground

- `/` is the English landing; `/uz` is the Uzbek landing.
- The main screen contains one playground with Fade, Content swap, and Collapse demos.
- Animation badges move right-to-left. Hover, keyboard focus, or the pause control stops the movement; reduced-motion preferences show stationary, horizontally scrollable choices.
- The header gently fades down on initial load, then stays at the top and smoothly changes to a compact surface while scrolling. Reduced-motion preferences skip its entrance.
- The hero has a one-time staggered entrance: text gently rises into focus, followed by the badges and playground. Reduced-motion preferences skip the entrance; scrolling, focus changes, and demo changes do not replay it.
- The palette is white, black, and `#0072CE`. Landing sections and playground controls live in `components/landing`.
- These are interactive previews, not published registry components. Copy code and GitHub source are still planned.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# sleek-motion
