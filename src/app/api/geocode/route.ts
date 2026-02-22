import { NextRequest, NextResponse } from "next/server";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json([], { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "PerspectiveMap/1.0",
    },
  });
  const data = (await res.json()) as NominatimResult[];

  const results = data.map((r) => ({
    label: r.display_name,
    longitude: parseFloat(r.lon),
    latitude: parseFloat(r.lat),
  }));

  return NextResponse.json(results);
}
