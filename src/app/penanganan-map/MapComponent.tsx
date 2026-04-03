// src/app/penanganan-map/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any).getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface MapComponentProps {
    userLocation: [number, number] | null;
}

export default function MapComponent({ userLocation }: MapComponentProps) {
    return (
        <MapContainer
            center={[-6.2088, 106.8456]}
            zoom={5}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {userLocation && (
                <Marker position={userLocation}>
                    <Popup>Lokasi Anda</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}