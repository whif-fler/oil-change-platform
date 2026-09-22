"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkAvailability,
  SERVED_LOCATIONS,
  SERVICE_AREA_INITIAL_CENTER,
  SERVICE_AREA_INITIAL_ZOOM,
} from "@/config/service-area";
import type { Map as MapLibreMap } from "maplibre-gl";

/** Keyless demo style (OpenFreeMap / OpenMapTiles). Attribution required. */
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Label layers hidden to keep the map restrained. */
const HIDDEN_LABEL_LAYERS = [
  "label_other",
  "label_village",
  "highway-name-path",
  "highway-name-minor",
  "highway-shield-non-us",
  "highway-shield-us-interstate",
  "road_shield_us",
  "airport",
  "waterway_line_label",
] as const;

type CheckStatus = "idle" | "valid" | "invalid";

export function ServiceArea() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const result = useMemo(() => {
    if (status === "idle") return null;
    const r = checkAvailability(query);
    return r.available ? { type: r.reason } : null;
  }, [status, query]);

  const isValid = status === "valid" && result !== null;
  const isInvalid = status === "invalid" && result === null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = checkAvailability(query);
    setStatus(r.available ? "valid" : "invalid");
  }

  // Initialize MapLibre once, client-side only; clean up on unmount.
  useEffect(() => {
    let mapInstance: MapLibreMap | null = null;
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      try {
        const {
          Map: MapLibre,
          Marker,
          Popup,
          NavigationControl,
          setWorkerUrl,
        } = await import("maplibre-gl");

        // Next.js (Turbopack and webpack) does not emit MapLibre's worker
        // sibling file, so vector tiles never load. Serve the worker from
        // public/ instead; scripts/copy-maplibre-worker.mjs keeps it in
        // lockstep with the installed version.
        setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

        if (!isMounted || !mapContainerRef.current) return;

        mapInstance = new MapLibre({
          container: mapContainerRef.current,
          style: MAP_STYLE_URL,
          center: SERVICE_AREA_INITIAL_CENTER,
          zoom: SERVICE_AREA_INITIAL_ZOOM,
          // Restrained interaction: no 3D/rotation. Wheel + trackpad
          // zoom over the map; page scroll is unaffected off the map.
          scrollZoom: true,
          dragRotate: false,
          pitchWithRotate: false,
          maxPitch: 0,
          attributionControl: {},
        });

        const map = mapInstance;
        mapRef.current = map;

        map.addControl(new NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          if (!isMounted) return;

          // Mute the base style toward the FreshOil palette.
          if (map.getLayer("background")) {
            map.setPaintProperty("background", "background-color", "#F4F3EF");
          }
          if (map.getLayer("water")) {
            map.setPaintProperty("water", "fill-color", "#E2E7E1");
          }
          HIDDEN_LABEL_LAYERS.forEach((id) => {
            if (map.getLayer(id)) {
              map.setLayoutProperty(id, "visibility", "none");
            }
          });
          map.getStyle().layers.forEach((layer) => {
            if (layer.type === "symbol" && map.getLayer(layer.id)) {
              map.setPaintProperty(layer.id, "text-color", "#17241C");
              map.setPaintProperty(layer.id, "text-halo-color", "#F4F3EF");
              map.setPaintProperty(layer.id, "text-halo-width", 1.25);
            }
          });

          // Served-location markers: subtle lime dot, forest-green ring.
          SERVED_LOCATIONS.forEach((loc) => {
            const el = document.createElement("div");
            el.style.width = "12px";
            el.style.height = "12px";
            el.style.borderRadius = "9999px";
            el.style.background = "#D8FF34";
            el.style.border = "2px solid #17241C";
            el.style.cursor = "pointer";
            el.setAttribute("aria-label", loc.name);
            new Marker({ element: el, anchor: "center" })
              .setLngLat([loc.lon, loc.lat])
              .setPopup(new Popup({ offset: 12 }).setText(loc.name))
              .addTo(map);
          });
        });
      } catch (err) {
        console.error("Failed to initialize MapLibre", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch {
          // Map already destroyed — nothing to clean up.
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Optional: fly to a recognized served city. The checker remains
  // the authority; an unrecognized location leaves the map unchanged.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isValid || !query.trim()) return;
    const normalized = query.trim().toLowerCase();
    const match = SERVED_LOCATIONS.find(
      (loc) => loc.name.toLowerCase() === normalized,
    );
    if (!match) return;
    try {
      map.flyTo({
        center: [match.lon, match.lat],
        zoom: Math.max(SERVICE_AREA_INITIAL_ZOOM, 11.5),
        duration: 1000,
        essential: true,
      });
    } catch {
      // Map not ready yet — leave the current view unchanged.
    }
  }, [isValid, query]);

  return (
    <section
      id="service-area"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        <div className="grid items-start gap-8 concept:grid-cols-2 concept:gap-10">
          {/* Heading → explanation → checker → result */}
          <div>
            <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
              Service area
            </div>
            <h2
              className="mb-3.5 font-semibold text-text"
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              We come to your kitchen
            </h2>
            <p className="mb-6 max-w-xl leading-[1.6] text-text-muted">
              Onsite cooking-oil collection and replacement for restaurants and
              cafés. Check if we cover your location.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mb-4 space-y-3">
              <div>
                <Label htmlFor="sa-cityzip">City or ZIP code</Label>
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <Input
                    id="sa-cityzip"
                    name="cityZip"
                    placeholder="e.g. Oakland or 94601"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    className="sm:flex-1"
                  />
                  <button
                    type="submit"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "default",
                      className: "w-full sm:w-auto",
                    })}
                  >
                    Check coverage
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  Deterministic, config-driven check. No external geocoding.
                </p>
              </div>
            </form>

            {isValid && (
              <div
                role="status"
                className="mb-4 flex items-start gap-3 rounded-lg bg-success/10 p-4 text-sm text-success"
              >
                <CheckCircle
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">Service available in your area</p>
                  <p className="mt-1 text-success/90">
                    Matched by {result?.type === "zip" ? "ZIP" : "city"}.
                  </p>
                </div>
              </div>
            )}

            {isInvalid && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
              >
                <AlertCircle
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">
                    We don&apos;t currently service this area
                  </p>
                  <p className="mt-1 text-destructive/90">
                    We&apos;re expanding — reach out via our contact page.
                  </p>
                </div>
              </div>
            )}

            {/* Get a Quote CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3 concept:mt-10">
              <Link
                href="/quote"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                })}
              >
                Get a Quote
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Map */}
          <div className="mx-auto w-full">
            <div className="overflow-hidden rounded-[var(--radius-card-token)] bg-surface-raised ring-1 ring-border shadow-card">
              <div className="border-b border-border px-5 py-3">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="size-4" aria-hidden="true" />
                  <span>Service area coverage</span>
                </div>
              </div>
              <div
                ref={mapContainerRef}
                role="region"
                aria-label="Map of FreshOil service area"
                className="h-[260px] w-full concept:h-[380px] lg:h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
