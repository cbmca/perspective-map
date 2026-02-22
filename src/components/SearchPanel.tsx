"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
import type { GeocodingResult } from "@/types";

interface Props {
  onSelect: (result: GeocodingResult) => void;
}

export default function SearchPanel({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;

    interface NominatimResult {
      display_name: string;
      lat: string;
      lon: string;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&limit=5`,
      { headers: { "User-Agent": "PerspectiveMap/1.0" } }
    )
      .then((r) => r.json())
      .then((raw: NominatimResult[]) => {
        const data: GeocodingResult[] = raw.map((r) => ({
          label: r.display_name,
          longitude: parseFloat(r.lon),
          latitude: parseFloat(r.lat),
        }));
        return data;
      })
      .then((data: GeocodingResult[]) => {
        if (!cancelled) {
          setResults(data);
          setOpen(data.length > 0);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.label);
    setOpen(false);
    onSelect(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
  };

  return (
    <div className="max-w-md">
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a city, country, or place to re-center the maps..."
          className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1 bg-zinc-900/95 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
          {results.map((r, i) => (
            <li key={i}>
              <button
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
