# PerspectiveMap

Interactive Lambert Azimuthal Equal-Area globe built with Next.js + D3.js.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- D3.js (`d3-geo`) with SVG rendering
- `world-atlas` (TopoJSON) + `topojson-client`
- Google Maps Geocoding API (proxied via `/api/geocode`)
- lucide-react icons

## Conventions
- All components in `src/components/`, lib utilities in `src/lib/`, types in `src/types/`
- MapCanvas uses imperative D3 via refs — no React SVG children
- MapCanvas is dynamically imported with `ssr: false` (uses browser APIs)
- API keys in `.env.local` only — never hardcode
- Dark theme: ocean `#1e3a5f`, land `#d4d4d8`, graticule subtle white, Tissot `#ef4444` at 15% opacity

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
