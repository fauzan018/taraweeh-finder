"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Mosque } from "@/types";

const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapView({ mosques, center }: { mosques: Mosque[]; center: [number, number] }) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl mb-6">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="w-full h-full">
        <TileLayer url={darkTiles} />
        {mosques.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]} icon={markerIcon}>
            <Popup>
              <div className="text-black">
                <strong>{m.name}</strong>
                <br />{m.address}
                <br />{m.city}, {m.state}
                <br />Ends: {m.taraweeh_end_date}
                <br />Sweets: {m.sweet_type}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
