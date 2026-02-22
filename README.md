# PerspectiveMap

An interactive side-by-side comparison of two map projections — **Lambert Azimuthal Equal-Area** and **Mercator** — that lets you re-center the world on any location and see how every flat map distorts reality.

## Why is this interesting?

Every map you've ever seen is a lie. You can't flatten a sphere without stretching something. The Mercator projection — the one on Google Maps, in classrooms, and on most wall maps — preserves angles and shapes but makes countries near the poles look enormous. Greenland appears as large as Africa, when in reality Africa is **14 times larger**.

PerspectiveMap puts two projections side by side so you can see the trade-offs for yourself. Search for your hometown, click anywhere on the globe, and watch how the world reshapes depending on what's at the center. Toggle "Size circles" (Tissot indicatrices) to see equal-area circles balloon on Mercator while staying consistent on the Equal-Area view.

## Features

- **Side-by-side** Equal-Area globe and Mercator rectangular map
- **Click or search** to re-center both maps simultaneously with smooth animation
- **Tissot indicatrices** — toggle equal-area circles to visualize distortion
- **Graticule grid** — toggle latitude/longitude lines
- **Responsive** — both maps scale to fit the viewport
- **No API key required** — uses OpenStreetMap Nominatim for geocoding

## Tech Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **D3.js** (`d3-geo`) with imperative SVG rendering
- **world-atlas** (TopoJSON) + `topojson-client`
- **Nominatim** (OpenStreetMap) for geocoding
- **lucide-react** for icons

## How it was built

This project was built in a single session (~45 minutes) with Claude Code:

1. **Scaffolded** a Next.js app with TypeScript, Tailwind, and App Router
2. **Built the data layer** — TopoJSON world boundaries, Tissot circle generator using `d3.geoCircle()`, debounce hook
3. **Created the LAEA globe** — `d3.geoAzimuthalEqualArea()` with full-sphere rendering, SVG clip paths, click-to-center with animated rotation via `d3.timer` + cubic easing
4. **Created the Mercator map** — `d3.geoMercator()` rectangular view with the same interaction model
5. **Assembled the page** — side-by-side layout with shared state, search bar with Nominatim geocoding, toggle controls, and an educational info overlay
6. **Iterated on UX** — fixed projection rendering bugs, added plain-language explanations, made the interface self-documenting

## Known Issues

- **Equal-Area map occasionally turns all gray** — When re-centering the LAEA globe, the map sometimes renders as a solid gray field instead of showing the ocean and land correctly. This is a rendering bug related to how D3's azimuthal equal-area projection handles the full-sphere clip boundary (`clipAngle: 180`) during rotation animation. Clicking again or searching for a new location typically recovers the view.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Hosting Options

| Option | Cost | Setup | Best for |
|--------|------|-------|----------|
| **Vercel** | Free tier | `npx vercel` — zero config | Easiest, recommended |
| **GitHub Pages** | Free | Static export (see below) | Already using GH Pages |
| **Netlify** | Free tier | Connect repo, auto-deploys | Alternative to Vercel |
| **Cloudflare Pages** | Free tier | Connect repo, select Next.js | Edge performance |

### Deploy to Vercel (recommended)

```bash
npx vercel
```

That's it. Vercel is built for Next.js — it handles the API route, builds, and CDN automatically.

### Static export for GitHub Pages

To deploy on GitHub Pages, the geocoding API route needs to move client-side (Nominatim supports CORS). Add `output: 'export'` to `next.config.ts` and call Nominatim directly from the SearchPanel component instead of going through `/api/geocode`.
