
"use client";
import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";
import { MosqueCard } from "@/components/MosqueCard";
import { LocationProvider, useLocation } from "@/components/LocationProvider";
import RamadanCounter from "@/components/RamadanCounter";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Haversine formula
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomePage() {
  const { location } = useLocation();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [sorted, setSorted] = useState<Mosque[]>([]);

  useEffect(() => {
    const fetchMosques = async () => {
      const { data } = await supabase.from("approved_mosques").select("*");
      
      if (data && data.length > 0) {
        // Fetch taraweeh sessions for each mosque
        const mosquesWithSessions = await Promise.all(
          data.map(async (mosque) => {
            const { data: sessions } = await supabase
              .from("taraweeh_sessions")
              .select("*")
              .eq("mosque_id", mosque.id)
              .order("session_number", { ascending: true });
            
            return {
              ...mosque,
              taraweeh_sessions: sessions || [],
            };
          })
        );
        setMosques(mosquesWithSessions);
      }
    };
    fetchMosques();
  }, []);

  useEffect(() => {
    if (!location || mosques.length === 0) {
      setSorted(mosques);
      return;
    }
    const { latitude, longitude } = location.coords;
    const sortedMosques = [...mosques].sort((a, b) => {
      const d1 = distance(latitude, longitude, a.latitude, a.longitude);
      const d2 = distance(latitude, longitude, b.latitude, b.longitude);
      return d1 - d2;
    });
    setSorted(sortedMosques);
  }, [location, mosques]);

  const handleUpvote = (id: string) => {
    setMosques((prev) =>
      prev.map((m) => (m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m))
    );
  };
  const handleView = (id: string) => {
    setMosques((prev) =>
      prev.map((m) => (m.id === id ? { ...m, views: m.views + 1 } : m))
    );
  };

  return (
    <LocationProvider>
      <main className="min-h-screen bg-[var(--background)] p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Taraweeh Finder</h1>
          <RamadanCounter />
          
          <div className="my-6">
            <MapView
              mosques={sorted}
              center={location ? [location.coords.latitude, location.coords.longitude] : [22.9734, 78.6569]}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {sorted.length > 0 ? `Found ${sorted.length} Mosques` : "Loading mosques..."}
            </h2>
            <div className="flex flex-col gap-4">
              {sorted.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No mosques found or still loading data...</p>
                </div>
              ) : (
                sorted.map((mosque) => (
                  <MosqueCard
                    key={mosque.id}
                    mosque={mosque}
                    onUpvote={handleUpvote}
                    onView={handleView}
                  />
                ))
              )}
            </div>
          </div>

          <footer className="w-full text-center mt-8 py-6 border-t border-[var(--card)]">
            <span className="font-extrabold text-lg tracking-wide text-[var(--primary)] drop-shadow-lg" style={{ fontFamily: 'Geist, Inter, sans-serif' }}>
              Made with <span role="img" aria-label="heart">❤️</span> by Fauzan
            </span>
          </footer>
        </div>
      </main>
    </LocationProvider>
  );
}
