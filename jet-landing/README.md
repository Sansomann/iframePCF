# Aeronova — Luxury Private Jet Landing Page

A premium, one-page private jet charter website built with Vite + React + TypeScript, Tailwind CSS, GSAP ScrollTrigger, Lenis smooth scroll, and a cobe 3D rotating globe.

---

## Quick Start

```bash
cd jet-landing
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
# output is in dist/ — deploy to Vercel, Netlify, or GitHub Pages
```

---

## Where to Replace Images

All image placeholders are Unsplash URLs. Search for `// TODO: replace` in the source to find every one. The primary locations:

| File | What to replace |
|------|----------------|
| `src/content.ts` → `HERO.bgImage` | Hero background (jet window / aircraft exterior) |
| `src/content.ts` → `HERO.midImage` | Hero mid-layer (aircraft silhouette or framing) |
| `src/content.ts` → `FLEET[].image` | Main aircraft photo |
| `src/content.ts` → `FLEET[].blueprintImage` | Cabin floor plan / blueprint |
| `src/content.ts` → `VALUES[].image` | 4 value-prop card images |
| `src/content.ts` → `ADVANTAGES[].image` | 4 advantage card images |
| `public/favicon.svg` | Your real favicon / logo mark |
| `index.html` → `og:image` | Open Graph preview image |

Place your images in `public/` and reference them as `/your-image.jpg`, or import them from `src/assets/`.

---

## Changing Brand Name, Colors & Fonts

**Brand name / contact info** — edit `src/content.ts` → `BRAND` object. All text is data-driven from this file.

**Accent color (gold)** — open `tailwind.config.js` and change the `gold` / `gold-light` / `gold-dark` values:

```js
gold: '#c9a84c',        // main gold
'gold-light': '#e8c97a', // lighter tint
'gold-dark': '#a07830',  // darker shade
```

**Background** — change `#0a0a0a` in `tailwind.config.js` → `colors.black` and in `src/index.css` → `body`.

**Fonts** — swap the Google Fonts `<link>` in `index.html` and update `tailwind.config.js`:

```js
fontFamily: {
  serif: ['"Your Serif Font"', 'Georgia', 'serif'],
  sans: ['Your Sans Font', 'system-ui', 'sans-serif'],
},
```

---

## Connecting the Contact Form

The booking modal simulates a submission. To wire it to a real backend:

1. Open `src/components/BookingModal.tsx` and find the `// TODO: wire BOOKING.formEndpoint` comment.
2. Set `BOOKING.formEndpoint` in `src/content.ts` to your endpoint URL.
3. Uncomment the `fetch()` block in `handleSubmit()` and delete the simulated-success block.

**Formspree** (easiest):
```
formEndpoint: 'https://formspree.io/f/YOUR_FORM_ID'
```

**Resend / custom API** — replace the fetch call with whatever your endpoint expects.

---

## Adding a Second Aircraft

In `src/content.ts`, append to the `FLEET` array following the existing shape:

```ts
{
  id: 'global7500',
  name: 'Bombardier Global 7500',
  category: 'Ultra Long Range',
  description: '...',
  image: '/images/global7500.jpg',
  blueprintImage: '/images/global7500-blueprint.jpg',
  specs: [
    { label: 'Range', value: '14,260 km' },
    // ...
  ],
}
```

The Fleet section renders all entries automatically.

---

## Deployment

### Vercel / Netlify
Drop the repo in — both platforms auto-detect Vite. No configuration needed.

### GitHub Pages
Set `base: '/your-repo-name/'` in `vite.config.ts`, then:

```bash
npm run build
# push dist/ to gh-pages branch
```

Or use the [vite-plugin-gh-pages](https://github.com/nicktindall/vite-plugin-gh-pages) plugin.

---

## Tech Stack

| Library | Purpose |
|---------|---------|
| Vite + React + TypeScript | App scaffold |
| Tailwind CSS | Styling |
| GSAP + ScrollTrigger | Scroll animations, parallax, pin |
| Lenis | Smooth scroll |
| cobe | 3D rotating globe |
