"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Mosque } from "@/types";

const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";

const glowingMarker = L.divIcon({
  html: `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0) 70%);
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
      "></div>
      <div style="
        position: absolute;
        width: 24px;
        height: 24px;
        top: 4px;
        left: 4px;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border-radius: 50%;
        border: 2px solid rgba(34, 197, 94, 0.8);
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        🕌
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  className: "custom-marker",
});

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function MapView({ mosques, center, onMarkerClick }: { 
  mosques: Mosque[]; 
  center: [number, number];
  onMarkerClick?: (mosque: Mosque) => void;
}) {
  return (
    <div className="w-full h-full rounded-none md:rounded-xl overflow-hidden shadow-xl md:mb-6 relative">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom 
        className="w-full h-full"
        style={{ zIndex: 10 }}
      >
        <MapCenterUpdater center={center} />
        <TileLayer 
          url={darkTiles}
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
        />
        {mosques.map((m) => (
          <Marker 
            key={m.id} 
            position={[m.latitude, m.longitude]} 
            icon={glowingMarker}
            eventHandlers={{
              click: () => onMarkerClick?.(m),
            }}
          >
            <Popup className="custom-popup" autoPanPadding={[24, 24]}>
              <div className="text-text-primary">
                <strong className="text-base">{m.name}</strong>
                <br className="my-1" />
                <span className="text-xs text-text-secondary">{m.address}</span>
                <br />
                <span className="text-xs text-text-secondary">{m.city}, {m.state}</span>
                <br className="my-1" />
                <span className="text-xs text-primary font-medium">
                  {m.taraweeh_sessions && m.taraweeh_sessions.length > 0
                    ? `Ends: ${m.taraweeh_sessions.map((s) => new Date(s.taraweeh_end_date).toLocaleDateString()).join(", ")}`
                    : "No taraweeh dates set"}
                </span>
                <br />
                <span className="text-xs">🍯 {m.sweet_type || 'N/A'}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
