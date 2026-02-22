import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

let cached: FeatureCollection<Geometry> | null = null;

export async function getWorldData(): Promise<FeatureCollection<Geometry>> {
  if (cached) return cached;

  // Try static import first, fall back to CDN
  let topology: Topology;
  try {
    topology = (await import("world-atlas/countries-110m.json" as string))
      .default as unknown as Topology;
  } catch {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    );
    topology = (await res.json()) as Topology;
  }

  const countries = topology.objects.countries as GeometryCollection;
  cached = feature(topology, countries) as FeatureCollection<Geometry>;
  return cached;
}
