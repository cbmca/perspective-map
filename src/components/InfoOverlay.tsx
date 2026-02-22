"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function InfoOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white/70 hover:bg-white/15 transition-colors"
      >
        <HelpCircle size={14} />
        Why do maps lie?
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {open && (
        <div className="mt-2 p-4 bg-zinc-900/95 border border-white/20 rounded-lg backdrop-blur-sm text-sm text-white/70 space-y-3">
          <p>
            You can&apos;t flatten a sphere without stretching something.
            Every flat map makes trade-offs.
          </p>
          <p>
            The <strong className="text-white/90">Mercator</strong> map
            (right) keeps shapes and angles accurate, but makes countries near
            the poles look enormous. On a Mercator map, Greenland looks as big
            as Africa &mdash; in reality, Africa is <strong className="text-white/90">14 times larger</strong>.
          </p>
          <p>
            The <strong className="text-white/90">Equal-Area</strong> map
            (left) keeps sizes honest. Every country is shown at its true
            relative size, though shapes get stretched toward the edges.
          </p>
          <p>
            Turn on{" "}
            <strong className="text-red-400">Size circles</strong> to see
            this clearly &mdash; each red circle covers the same amount of
            land. On the Equal-Area map they stay similar sizes; on Mercator
            they balloon near the poles.
          </p>
          <p className="text-white/50 text-xs">
            Tip: Click anywhere on either map or search for a place to re-center both views.
          </p>
        </div>
      )}
    </div>
  );
}
