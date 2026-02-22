"use client";

import { useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import type { FeatureCollection, Geometry, Feature, Polygon } from "geojson";
import { getWorldData } from "@/lib/worldData";
import { generateTissotGrid } from "@/lib/tissot";
import type { MapCenter, MapControls } from "@/types";

interface Props {
  center: MapCenter;
  controls: MapControls;
  onCenterChange: (center: MapCenter) => void;
}

// For LAEA, the projected sphere boundary at clipAngle θ has radius:
//   r = 2 * scale * sin(θ/2)
// At clipAngle 180° → r = 2 * scale
// We use clipAngle 180 to show the full earth.
const CLIP_ANGLE = 180;
const BOUNDARY_FACTOR = 2 * Math.sin(((CLIP_ANGLE / 2) * Math.PI) / 180);

export default function MapCanvas({ center, controls, onCenterChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const worldRef = useRef<FeatureCollection<Geometry> | null>(null);
  const tissotRef = useRef<Feature<Polygon>[]>([]);
  const animatingRef = useRef(false);

  const render = useCallback(() => {
    const svg = svgRef.current;
    const projection = projectionRef.current;
    const world = worldRef.current;
    if (!svg || !projection || !world) return;

    const sel = d3.select(svg);
    const path = d3.geoPath(projection);
    const [cx, cy] = projection.translate();
    const r = projection.scale() * BOUNDARY_FACTOR;

    // Ocean fill circle
    sel
      .select<SVGCircleElement>(".ocean")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r);

    // Clip circle
    sel
      .select<SVGCircleElement>("#laea-clip circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r);

    // Land
    sel
      .select<SVGGElement>(".land")
      .selectAll<SVGPathElement, Feature<Geometry>>("path")
      .data(world.features)
      .join("path")
      .attr("d", (d) => path(d) || "")
      .attr("fill", "#d4d4d8")
      .attr("stroke", "#a1a1aa")
      .attr("stroke-width", 0.5);

    // Graticule
    const graticule = d3.geoGraticule10();
    sel
      .select<SVGPathElement>(".graticule")
      .datum(graticule)
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.15)")
      .attr("stroke-width", 0.5)
      .attr("display", controls.showGraticule ? null : "none");

    // Tissot
    sel
      .select<SVGGElement>(".tissot")
      .attr("display", controls.showTissot ? null : "none")
      .selectAll<SVGPathElement, Feature<Polygon>>("path")
      .data(tissotRef.current)
      .join("path")
      .attr("d", (d) => path(d) || "")
      .attr("fill", "rgba(239, 68, 68, 0.15)")
      .attr("stroke", "rgba(239, 68, 68, 0.4)")
      .attr("stroke-width", 0.5);

    // Outline
    sel
      .select<SVGCircleElement>(".outline")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r);
  }, [controls.showGraticule, controls.showTissot]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    // Scale so the full sphere disk (diameter = scale * BOUNDARY_FACTOR * 2)
    // fits within the container with some padding
    const scale = Math.min(width, height) / (BOUNDARY_FACTOR * 2.1);

    const projection = d3
      .geoAzimuthalEqualArea()
      .clipAngle(CLIP_ANGLE)
      .translate([width / 2, height / 2])
      .scale(scale)
      .rotate([-center.longitude, -center.latitude]);

    projectionRef.current = projection;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("cursor", "pointer");

    svgRef.current = svg.node();

    // Defs: clip path using a circle
    const defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", "laea-clip")
      .append("circle");

    // Ocean
    svg.append("circle").attr("class", "ocean").attr("fill", "#1e3a5f");

    // Clipped content group
    const clipped = svg.append("g").attr("clip-path", "url(#laea-clip)");
    clipped.append("g").attr("class", "land");
    clipped.append("path").attr("class", "graticule");
    clipped.append("g").attr("class", "tissot");

    // Outline
    svg
      .append("circle")
      .attr("class", "outline")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1.5);

    // Click
    svg.on("click", (event: MouseEvent) => {
      if (animatingRef.current) return;
      const [x, y] = d3.pointer(event);
      const coords = projection.invert?.([x, y]);
      if (coords) {
        onCenterChange({ longitude: coords[0], latitude: coords[1] });
      }
    });

    // Load data
    Promise.all([getWorldData(), Promise.resolve(generateTissotGrid())]).then(
      ([world, tissot]) => {
        worldRef.current = world;
        tissotRef.current = tissot;
        render();
      }
    );

    // Resize
    const ro = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      const s = Math.min(w, h) / (BOUNDARY_FACTOR * 2.1);
      svg.attr("width", w).attr("height", h);
      projection.translate([w / 2, h / 2]).scale(s);
      render();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      svg.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate rotation
  useEffect(() => {
    const projection = projectionRef.current;
    if (!projection || !worldRef.current) return;

    const current = projection.rotate();
    const target: [number, number, number] = [
      -center.longitude,
      -center.latitude,
      0,
    ];

    if (
      Math.abs(current[0] - target[0]) < 0.01 &&
      Math.abs(current[1] - target[1]) < 0.01
    )
      return;

    animatingRef.current = true;
    const interpolate = d3.interpolate(current, target);
    const duration = 800;

    const timer = d3.timer((elapsed) => {
      const t = Math.min(1, elapsed / duration);
      const eased =
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const r = interpolate(eased);
      projection.rotate(r as [number, number, number]);
      render();

      if (t >= 1) {
        timer.stop();
        animatingRef.current = false;
      }
    });

    return () => {
      timer.stop();
      animatingRef.current = false;
    };
  }, [center.longitude, center.latitude, render]);

  useEffect(() => {
    render();
  }, [controls.showTissot, controls.showGraticule, render]);

  return <div ref={containerRef} className="w-full h-full" />;
}
