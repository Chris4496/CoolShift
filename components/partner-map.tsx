"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PartnerMap · a real slippy map (Leaflet + CARTO Positron, no API key).
// Locations live in lib/data.ts as real lat/lng, so moving a partner means
// editing data — nothing is baked into a drawing.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { homeLocation } from "@/lib/data";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  category: string;
  selected?: boolean;
};

// Label-free light basemap — the pins carry the meaning, the map stays quiet.
// CARTO Positron is the same look but now needs an API key, so this is the
// key-free equivalent. Note Esri serves tiles as {z}/{y}/{x}.
const TILES =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTR = "© Esri, © OpenStreetMap";

// Fixed framing: centred between the partners and held there, so the card
// always looks the same and never drifts.
// Centred on the midpoint of the partner locations; the card is tall enough
// that no marker — or its callout — touches an edge.
const VIEW_CENTRE: [number, number] = [22.3780, 114.1869];
const VIEW_ZOOM = 14;

// Lucide glyphs, inlined so they can live inside a Leaflet divIcon.
const ICONS: Record<string, string> = {
  "Food & Coffee":
    '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  Charging:
    '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  "Home Services":
    '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  Experiences:
    '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/>',
};

const FALLBACK_ICON =
  '<circle cx="12" cy="10" r="3"/><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/>';

const TEARDROP =
  "M16 43C16 43 30 25.5 30 16A14 14 0 1 0 2 16C2 25.5 16 43 16 43Z";

function markerHtml(pin: MapPin) {
  const glyph = ICONS[pin.category] ?? FALLBACK_ICON;
  return `
    <div class="map-marker${pin.selected ? " is-selected" : ""}">
      ${pin.selected ? `<span class="map-marker__callout">${pin.label}</span>` : ""}
      <svg class="map-marker__drop" viewBox="0 0 32 45" aria-hidden="true">
        <path d="${TEARDROP}" />
      </svg>
      <svg class="map-marker__glyph" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${glyph}
      </svg>
    </div>`;
}

export function PartnerMap({
  pins,
  onSelect,
}: {
  pins: MapPin[];
  onSelect?: (id: string) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  // Held in a ref so redrawing pins never has to rebuild the map.
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  const draw = useCallback((L: typeof import("leaflet"), next: MapPin[]) => {
    const layer = layerRef.current;
    if (!layer) return;

    layer.clearLayers();
    for (const pin of next) {
      L.marker([pin.lat, pin.lng], {
        icon: L.divIcon({
          className: "",
          html: markerHtml(pin),
          // A real box, or the marker has no hit area to tap.
          iconSize: [32, 45],
          iconAnchor: [16, 45],
        }),
        // Keep the selected pin and its callout above its neighbours.
        zIndexOffset: pin.selected ? 1000 : 0,
      })
        .on("click", () => selectRef.current?.(pin.id))
        .addTo(layer);
    }
  }, []);

  // Build the map once, at a fixed view.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;

    // Leaflet reaches for `window` at import time, so it loads client-side only.
    import("leaflet").then((mod) => {
      if (cancelled || !mountRef.current) return;
      const L = mod.default ?? mod;

      const map = L.map(mount, {
        center: VIEW_CENTRE,
        zoom: VIEW_ZOOM,
        zoomControl: false,
        // The framing is fixed on purpose: the card is a picture of the
        // neighbourhood, and wheel zoom would hijack the page scroll.
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        touchZoom: false,
        keyboard: false,
      });
      L.tileLayer(TILES, { maxZoom: 19, attribution: TILE_ATTR }).addTo(map);

      L.marker([homeLocation.lat, homeLocation.lng], {
        icon: L.divIcon({
          className: "",
          html: '<div class="map-home"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        keyboard: false,
      }).addTo(map);

      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);

      // The card fades in, so the map can measure itself a frame too early.
      setTimeout(() => {
        map.invalidateSize();
        map.setView(VIEW_CENTRE, VIEW_ZOOM, { animate: false });
      }, 200);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redraw whenever the category filter or the selection changes.
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    import("leaflet").then((mod) => {
      if (!cancelled) draw(mod.default ?? mod, pins);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, pins, draw]);

  return (
    <div
      ref={mountRef}
      className="h-80 w-full overflow-hidden rounded-card border border-hairline bg-[#eef0ec]"
    />
  );
}
