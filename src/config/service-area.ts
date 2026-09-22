/**
 * Service area configuration — single source of truth for served
 * cities, ZIP codes, map coordinates, and the availability checker.
 * No geocoding calls; the map is a visualization layer only.
 */

export const SERVED_CITIES = [
  "San Francisco",
  "Oakland",
  "Berkeley",
  "Emeryville",
  "Piedmont",
  "Alameda",
  "Richmond",
  "El Cerrito",
] as const;

export const SERVED_ZIPS = [
  "94102",
  "94103",
  "94105",
  "94107",
  "94108",
  "94109",
  "94110",
  "94111",
  "94112",
  "94114",
  "94115",
  "94117",
  "94121",
  "94122",
  "94123",
  "94124",
  "94127",
  "94129",
  "94131",
  "94601",
  "94602",
  "94603",
  "94607",
  "94608",
  "94609",
  "94610",
  "94611",
  "94612",
  "94702",
  "94703",
  "94704",
  "94705",
  "94706",
  "94707",
  "94708",
  "94709",
  "94710",
  "94801",
  "94804",
  "94805",
] as const;

export type ServedCity = (typeof SERVED_CITIES)[number];
export type ServedZip = (typeof SERVED_ZIPS)[number];

export interface MapRegion {
  name: string;
  lon: number;
  lat: number;
}

/**
 * Served locations with real geographic coordinates for map markers.
 */
export const SERVED_LOCATIONS: readonly MapRegion[] = [
  { name: "San Francisco", lon: -122.4194, lat: 37.7749 },
  { name: "Oakland", lon: -122.2712, lat: 37.8044 },
  { name: "Berkeley", lon: -122.273, lat: 37.8715 },
  { name: "Emeryville", lon: -122.2852, lat: 37.8349 },
  { name: "Piedmont", lon: -122.2325, lat: 37.8244 },
  { name: "Alameda", lon: -122.2822, lat: 37.7799 },
  { name: "Richmond", lon: -122.3477, lat: 37.9358 },
  { name: "El Cerrito", lon: -122.3033, lat: 37.9175 },
];

/** Initial map camera: regional focus on the served area. */
export const SERVICE_AREA_INITIAL_CENTER: [number, number] = [
  -122.2899,
  37.8358,
];

export const SERVICE_AREA_INITIAL_ZOOM = 10;

/**
 * Deterministic service-area availability check.
 *
 * Input is normalized (trimmed, uppercased for ZIP, case-insensitive for city).
 * Returns the match type when the query matches a configured served city or
 * ZIP. Config-driven only — no external lookups.
 */
export function checkAvailability(input: string): {
  available: boolean;
  reason: "city" | "zip" | "none";
} {
  const raw = input.trim();
  if (raw.length === 0) {
    return { available: false, reason: "none" };
  }

  // ZIP check (handles 5-digit ZIPs or ZIP+4 by taking first 5)
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length >= 5) {
    const zip5 = digits.slice(0, 5) as ServedZip;
    if ((SERVED_ZIPS as readonly string[]).includes(zip5)) {
      return { available: true, reason: "zip" };
    }
  }

  // City check (case-insensitive)
  const normalizedCity = raw.replace(/\s+/g, " ").trim();
  const cityKey = normalizedCity.toLowerCase();
  for (const c of SERVED_CITIES) {
    if (c.toLowerCase() === cityKey) {
      return { available: true, reason: "city" };
    }
  }

  return { available: false, reason: "none" };
}
