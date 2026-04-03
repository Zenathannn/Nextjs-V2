"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// ✅ import MapComponent secara dynamic, ssr: false
const MapComponent = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => <div className="h-[500px] flex items-center justify-center bg-gray-100">Memuat peta...</div>
});

export default function PenangananMap() {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getUserLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLoading(false);
                },
                (error) => {
                    alert("Error mendapatkan lokasi:" + error.message);
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation tidak didukung oleh browser ini.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Peta Sederhana</h1>

                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <button
                        onClick={getUserLocation}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Mendapatkan Lokasi..." : "Dapatkan Lokasi Saya"}
                    </button>

                    {userLocation && (
                        <p className="mt-2 text-gray-600">
                            Lokasi Anda: Latitude {userLocation[0].toFixed(4)}, Longitude {userLocation[1].toFixed(4)}
                        </p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <MapComponent userLocation={userLocation} /> {/* ✅ pakai dynamic component */}
                </div>
            </div>
        </div>
    );
}