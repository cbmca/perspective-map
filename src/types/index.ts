export interface MapCenter {
  longitude: number;
  latitude: number;
  label?: string;
}

export interface GeocodingResult {
  label: string;
  longitude: number;
  latitude: number;
}

export interface MapControls {
  showTissot: boolean;
  showGraticule: boolean;
}
