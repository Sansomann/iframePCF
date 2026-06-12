# Aeronova — Luxury Private Jet Landing Page

A premium, one-page private jet charter website built with Vite + React + TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis smooth scroll, and a cobe 3D globe.

## Stack

| Tool | Role |
|------|------|
| Vite 5 + React 18 | Build & UI |
| TypeScript | Type safety |
| Tailwind CSS 3 | Utility-first styling |
| GSAP + ScrollTrigger | Scroll animations, parallax, pinned scroll |
| Lenis | Buttery smooth scroll |
| cobe | WebGL rotating globe |

## Getting Started

```bash
cd jet-landing
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Customising Content

All copy, images, statistics, fleet data, brand colours, and contact details live in a **single file**:

```
jet-landing/src/content.ts
```

Edit that file and the whole page updates automatically. Search for `// TODO` comments for items that need your real assets or credentials.

## Sections

| Section | Component | Description |
|---------|-----------|-------------|
| Navigation | `Nav.tsx` | Fixed top bar, scroll-aware blur |
| Hero | `Hero.tsx` | Full-screen parallax hero with staggered headline |
| About | `About.tsx` | Word-by-word paragraph reveal + animated counters |
| Values | `Values.tsx` | 4-column card grid on a parallax sky background |
| Fleet | `Fleet.tsx` | Aircraft showcase with spec table + cabin blueprint |
| Advantages | `Advantages.tsx` | Horizontally pinned scroll section (desktop) |
| Global | `GlobalSection.tsx` | cobe WebGL globe + destination marquee + live clocks |
| Stats | `Stats.tsx` | Full-width stat statement with giant watermark number |
| Footer | `Footer.tsx` | CTA band + nav links + copyright |
| Booking | `BookingModal.tsx` | Accessible modal form, wires to any HTTP endpoint |

## Replacing Images

All images are currently Unsplash placeholders. Replace the URLs in `src/content.ts` (hero, fleet) and in the component files (values, advantages). Look for `// TODO` comments.

## Wiring the Booking Form

Set `BOOKING.formEndpoint` in `src/content.ts` to any HTTP POST endpoint (e.g. [Formspree](https://formspree.io), [Resend](https://resend.com), your own API).

## Deploying to GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy-jet-landing.yml`. It:

1. Triggers on pushes to `master` that touch `jet-landing/**`
2. Runs `npm ci && npm run build` with `VITE_BASE_URL=/iframePCF/jet-landing/`
3. Deploys the `dist/` folder to the `gh-pages` branch

Enable GitHub Pages in your repo settings (source: `gh-pages` branch, root `/`).

The live URL will be: `https://sansomann.github.io/iframePCF/jet-landing/`

## Performance Notes

- All images are lazy-loaded except the hero background (`loading="eager"`)
- Animations are disabled when `prefers-reduced-motion: reduce` is set
- The cobe globe renders at `min(devicePixelRatio, 2)` for battery efficiency
