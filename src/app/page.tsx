"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SearchPanel from "@/components/SearchPanel";
import Controls from "@/components/Controls";
import InfoOverlay from "@/components/InfoOverlay";
import type { MapCenter, MapControls, GeocodingResult } from "@/types";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
});
const MercatorMap = dynamic(() => import("@/components/MercatorMap"), {
  ssr: false,
});

export default function Home() {
  const [center, setCenter] = useState<MapCenter>({
    longitude: 0,
    latitude: 0,
  });
  const [controls, setControls] = useState<MapControls>({
    showTissot: false,
    showGraticule: true,
  });

  const handleSearchSelect = (result: GeocodingResult) => {
    setCenter({
      longitude: result.longitude,
      latitude: result.latitude,
      label: result.label,
    });
  };

  const hasCustomCenter = center.label || center.longitude !== 0 || center.latitude !== 0;

  return (
    <div className="flex flex-col w-screen h-[100dvh] bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-white">
              PerspectiveMap
            </h1>
            <p className="text-sm text-white/50 mt-0.5">
              {hasCustomCenter ? (
                <>
                  Showing the world centered on{" "}
                  <span className="text-white/80 font-medium">
                    {center.label || `${center.latitude.toFixed(1)}, ${center.longitude.toFixed(1)}`}
                  </span>
                  {" "}&mdash; notice how countries change size and shape between the two projections.
                </>
              ) : (
                <>
                  Every flat map distorts the Earth. Search for a place or click
                  the globe to re-center both maps and see how the world looks
                  different depending on what&apos;s at the center.
                </>
              )}
            </p>
          </div>
          <Controls controls={controls} onChange={setControls} />
        </div>

        {/* Search */}
        <div className="mt-3">
          <SearchPanel onSelect={handleSearchSelect} />
        </div>
      </div>

      {/* Maps */}
      <div className="flex flex-1 min-h-0 gap-4 px-4 pt-2 pb-4">
        {/* LAEA Globe */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2 px-1">
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Equal-Area
            </div>
            <div className="text-[11px] text-white/40">
              True sizes, shapes distorted at edges
            </div>
          </div>
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10">
            <MapCanvas
              center={center}
              controls={controls}
              onCenterChange={setCenter}
            />
          </div>
        </div>

        {/* Mercator */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-2 px-1">
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Mercator
            </div>
            <div className="text-[11px] text-white/40">
              True angles, sizes distorted near poles
            </div>
          </div>
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-white/10">
            <MercatorMap
              center={center}
              controls={controls}
              onCenterChange={setCenter}
            />
          </div>
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <InfoOverlay />
      </div>
    </div>
  );
}
