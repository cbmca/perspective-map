import * as d3 from "d3";
import type { Feature, Polygon } from "geojson";

export function generateTissotGrid(
  spacing = 20,
  radius = 4.5
): Feature<Polygon>[] {
  const circles: Feature<Polygon>[] = [];

  for (let lat = -80; lat <= 80; lat += spacing) {
    for (let lng = -180; lng < 180; lng += spacing) {
      const polygon = d3.geoCircle().center([lng, lat]).radius(radius)();
      circles.push({
        type: "Feature",
        geometry: polygon,
        properties: {},
      });
    }
  }

  return circles;
}
