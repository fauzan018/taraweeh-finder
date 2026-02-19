
"use client";
import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";
import { MosqueCard } from "@/components/MosqueCard";
import { LocationProvider, useLocation } from "@/components/LocationProvider";
import RamadanCounter from "@/components/RamadanCounter";
import { MosqueCardSkeleton, PageSkeletonGrid } from "@/components/Skeleton";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMosques = async () => {
      setLoading(true);
      const { data } = await supabase.from("approved_mosques").select("*");
      
      if (data && data.length > 0) {
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
      setLoading(false);
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
      <main className="min-h-screen bg-gradient-to-b from-[#05050f] via-[#0a0a14] to-[#05050f]">
        {/* Header Section */}
        <div className="border-b border-white/5 backdrop-blur-xl bg-white/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  Taraweeh Finder
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Discover Taraweeh near you</p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-300">
                  Submit Mosque
                </Link>
                <RamadanCounter />
              </div>
            </div>
            <div className="sm:hidden mt-4">
              <RamadanCounter />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Mosques List Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {loading ? "Loading..." : `${sorted.length} Mosques`}
                </h2>
                <p className="text-gray-600">
                  {sorted.length > 0 
                    ? "Sorted by distance" 
                    : "No mosques found"}
                </p>
              </div>
            </div>

            {loading ? (
              <PageSkeletonGrid />
            ) : sorted.length === 0 ? (
              <div className="text-center py-16 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
                <p className="text-gray-500 text-lg">No mosques available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((mosque, index) => (
                  <div 
                    key={mosque.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <MosqueCard
                      mosque={mosque}
                      onUpvote={handleUpvote}
                      onView={handleView}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="mb-12">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              {loading ? (
                <div className="w-full h-[400px] bg-white/5 backdrop-blur rounded-2xl animate-pulse" />
              ) : (
                <MapView
                  mosques={sorted}
                  center={location ? [location.coords.latitude, location.coords.longitude] : [22.9734, 78.6569]}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-white/5 pt-12 mt-16">
            <div className="text-center pb-8">
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <span>Taraweeh Finder</span>
                <span className="text-gray-700">•</span>
                <span>Ramadan 1447 AH</span>
              </p>
              <p className="text-gray-700 text-sm mt-2">Made with ❤️ by Fauzan</p>
            </div>
          </footer>
        </div>
      </main>
    </LocationProvider>
  );
}
