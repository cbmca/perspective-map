# PerspectiveMap

**[Try it live](https://cbmca.github.io/perspective-map/)**

An interactive side-by-side comparison of two map projections — **Lambert Azimuthal Equal-Area** and **Mercator** — that lets you re-center the world on any location and see how every flat map distorts reality.

> This is a toy project / learning exercise, not a production application. It was built in a single afternoon to explore D3.js map projections and have some fun with geography. If you find it interesting, you're welcome to use it, learn from it, or build on it.

## Why is this interesting?

Every map you've ever seen is a lie. You can't flatten a sphere without stretching something. The Mercator projection — the one on Google Maps, in classrooms, and on most wall maps — preserves angles and shapes but makes countries near the poles look enormous. Greenland appears as large as Africa, when in reality Africa is **14 times larger**.

PerspectiveMap puts two projections side by side so you can see the trade-offs for yourself. Search for your hometown, click anywhere on the globe, and watch how the world reshapes depending on what's at the center. Toggle "Size circles" (Tissot indicatrices) to see equal-area circles balloon on Mercator while staying consistent on the Equal-Area view.

## Try It

**Live demo: [cbmca.github.io/perspective-map](https://cbmca.github.io/perspective-map/)**

No install needed — just open the link in any modern browser.

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

This project was built in a single session (~45 minutes) using [Claude Code](https://claude.ai/claude-code):

1. **Scaffolded** a Next.js app with TypeScript, Tailwind, and App Router
2. **Built the data layer** — TopoJSON world boundaries, Tissot circle generator using `d3.geoCircle()`, debounce hook
3. **Created the LAEA globe** — `d3.geoAzimuthalEqualArea()` with full-sphere rendering, SVG clip paths, click-to-center with animated rotation via `d3.timer` + cubic easing
4. **Created the Mercator map** — `d3.geoMercator()` rectangular view with the same interaction model
5. **Assembled the page** — side-by-side layout with shared state, search bar with Nominatim geocoding, toggle controls, and an educational info overlay
6. **Iterated on UX** — fixed projection rendering bugs, added plain-language explanations, made the interface self-documenting

## Ideas for Improvement

This project works but there's plenty of room to make it better. Here are some ideas if you're looking for something to work on:

1. **Fix the Equal-Area gray-out bug** — The LAEA globe sometimes renders as solid gray when re-centering. This is related to how D3 handles the full-sphere clip boundary (`clipAngle: 180`) during rotation animation. Investigating alternative clip strategies or switching to `clipAngle(90)` with a hemisphere view could solve it.

2. **Add more projections** — Robinson, Winkel Tripel, Mollweide, or orthographic. A dropdown to swap projections would make the comparison even richer and more educational.

3. **Mobile layout** — The side-by-side layout doesn't work well on small screens. A stacked or tabbed view for mobile would make it accessible to more people.

4. **Country highlighting and info** — Hover over a country to see its name and actual area vs. how large it appears in each projection. This would make the distortion tangible with real numbers.

5. **Drag-to-rotate** — Instead of just click-to-center, add click-and-drag rotation on the Equal-Area globe for a more tactile, exploratory feel.

## Known Issues

- **Equal-Area map occasionally turns all gray** — When re-centering the LAEA globe, the map sometimes renders as a solid gray field instead of showing the ocean and land correctly. This is a rendering bug related to how D3's azimuthal equal-area projection handles the full-sphere clip boundary (`clipAngle: 180`) during rotation animation. Clicking again or searching for a new location typically recovers the view.

## Contributing

Contributions are welcome! This is an open source project and a great starting point if you're learning D3.js, Next.js, or map projections.

**New to open source?** This project is intentionally small and approachable — a good first contribution could be as simple as fixing a typo, improving the mobile layout, or adding a new projection.

**Want to experiment on your own?** Fork the repo and make it your own. If you're learning to build things with D3, React, or geographic data, branching this project is a great way to get started with a working foundation instead of a blank page. No permission needed — that's what open source is for.

### How to contribute

1. **Fork** the repository
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/perspective-map.git
   cd perspective-map
   npm install
   npm run dev
   ```
3. **Create a branch** for your change
   ```bash
   git checkout -b my-feature
   ```
4. **Make your changes** and test locally at `http://localhost:3002`
5. **Commit** with a clear message describing what you changed and why
6. **Push** and open a Pull Request back to this repo

If you're not sure where to start, check the [Ideas for Improvement](#ideas-for-improvement) section above or open an issue to discuss your idea first.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## License

MIT — see [LICENSE](LICENSE) for details. Use it however you like.
