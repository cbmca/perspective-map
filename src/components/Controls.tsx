"use client";

import { Circle, Grid3X3 } from "lucide-react";
import type { MapControls } from "@/types";

interface Props {
  controls: MapControls;
  onChange: (controls: MapControls) => void;
}

export default function Controls({ controls, onChange }: Props) {
  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() =>
          onChange({ ...controls, showTissot: !controls.showTissot })
        }
        title="Show equal-sized circles to reveal how each projection distorts area"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          controls.showTissot
            ? "bg-red-500/20 text-red-300 border border-red-500/40"
            : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/15"
        }`}
      >
        <Circle size={12} />
        Size circles
      </button>
      <button
        onClick={() =>
          onChange({ ...controls, showGraticule: !controls.showGraticule })
        }
        title="Show latitude and longitude grid lines"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          controls.showGraticule
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
            : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/15"
        }`}
      >
        <Grid3X3 size={12} />
        Grid lines
      </button>
    </div>
  );
}
