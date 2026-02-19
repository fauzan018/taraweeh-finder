"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Mosque, TaraweehSession } from "@/types";
import { LocationProvider, useLocation } from "@/components/LocationProvider";
import { Navigation } from "@/components/Navigation";
import { MosqueList } from "@/components/MosqueListView";
import { MosqueDetailPanel } from "@/components/MosqueDetailPanel";
import { DEFAULT_CENTER, STATE_COORDINATES } from "@/lib/constants";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface animate-pulse" />,
});

const UPVOTE_STORAGE_KEY = "taraweeh-upvoted-ids";

type MosqueWithSessions = Mosque & {
  taraweeh_sessions?: TaraweehSession[] | null;
};

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

function hasValidCoordinates(mosque: Mosque) {
  return Number.isFinite(mosque.latitude) && Number.isFinite(mosque.longitude);
}

function HomeContent() {
  const { location, error: locationError } = useLocation();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [upvotedMosqueIds, setUpvotedMosqueIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(UPVOTE_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as string[];
      setUpvotedMosqueIds(new Set(parsed));
    } catch {
      window.localStorage.removeItem(UPVOTE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const fetchMosques = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("approved_mosques")
          .select("*, taraweeh_sessions(*)");

        if (error) {
          throw error;
        }

        const normalized = (data || []).map((mosque) => {
          const typed = mosque as MosqueWithSessions;
          return {
            ...typed,
            latitude: Number(typed.latitude),
            longitude: Number(typed.longitude),
            upvotes: typed.upvotes || 0,
            views: typed.views || 0,
            taraweeh_sessions: (typed.taraweeh_sessions || []).sort(
              (a, b) => a.session_number - b.session_number
            ),
          } as Mosque;
        });

        setMosques(normalized);
      } catch (error) {
        console.error("Failed to fetch mosques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMosques();
  }, []);

  const availableCities = useMemo(() => {
    const source = selectedState
      ? mosques.filter((m) => m.state === selectedState)
      : mosques;

    return Array.from(new Set(source.map((m) => m.city).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [mosques, selectedState]);

  const filteredMosques = useMemo(() => {
    let filtered = mosques;

    if (selectedState) {
      filtered = filtered.filter((m) => m.state === selectedState);
    }

    if (selectedCity) {
      filtered = filtered.filter((m) => m.city === selectedCity);
    }

    if (location) {
      const { latitude, longitude } = location.coords;
      filtered = [...filtered].sort((a, b) => {
        const d1 = distance(latitude, longitude, a.latitude, a.longitude);
        const d2 = distance(latitude, longitude, b.latitude, b.longitude);
        return d1 - d2;
      });
    }

    return filtered;
  }, [location, mosques, selectedState, selectedCity]);

  const mapMosques = useMemo(
    () => filteredMosques.filter(hasValidCoordinates),
    [filteredMosques]
  );

  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedCity) {
      const cityMosque = mapMosques.find((m) => m.city === selectedCity);
      if (cityMosque) {
        return [cityMosque.latitude, cityMosque.longitude];
      }
    }

    if (selectedState) {
      return STATE_COORDINATES[selectedState] || DEFAULT_CENTER;
    }

    if (location) {
      return [location.coords.latitude, location.coords.longitude];
    }

    return DEFAULT_CENTER;
  }, [location, mapMosques, selectedCity, selectedState]);

  const persistUpvotedIds = (ids: Set<string>) => {
    setUpvotedMosqueIds(ids);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(UPVOTE_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    }
  };

  const handleLocationChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("");
  };

  const handleUpvote = async (mosque: Mosque) => {
    if (upvotedMosqueIds.has(mosque.id)) {
      return;
    }

    const optimisticIds = new Set(upvotedMosqueIds);
    optimisticIds.add(mosque.id);
    persistUpvotedIds(optimisticIds);

    setMosques((prev) =>
      prev.map((m) =>
        m.id === mosque.id ? { ...m, upvotes: (m.upvotes || 0) + 1 } : m
      )
    );

    setSelectedMosque((prev) =>
      prev && prev.id === mosque.id
        ? { ...prev, upvotes: (prev.upvotes || 0) + 1 }
        : prev
    );

    try {
      const response = await fetch(`/api/mosques/${mosque.id}/upvote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
    } catch (error) {
      console.error("Failed to upvote mosque:", error);

      const rollbackIds = new Set(optimisticIds);
      rollbackIds.delete(mosque.id);
      persistUpvotedIds(rollbackIds);

      setMosques((prev) =>
        prev.map((m) =>
          m.id === mosque.id ? { ...m, upvotes: Math.max(0, (m.upvotes || 1) - 1) } : m
        )
      );

      setSelectedMosque((prev) =>
        prev && prev.id === mosque.id
          ? { ...prev, upvotes: Math.max(0, (prev.upvotes || 1) - 1) }
          : prev
      );
    }
  };

  const handleSelectMosque = (mosque: Mosque) => {
    const nextSelectedMosque = { ...mosque, views: (mosque.views || 0) + 1 };
    setSelectedMosque(nextSelectedMosque);

    setMosques((prev) =>
      prev.map((m) =>
        m.id === mosque.id ? { ...m, views: (m.views || 0) + 1 } : m
      )
    );

    void fetch(`/api/mosques/${mosque.id}/view`, { method: "POST" }).catch((error) => {
      console.error("Failed to increment mosque view:", error);
    });
  };

  return (
    <>
      <Navigation
        onLocationChange={handleLocationChange}
        selectedLocation={selectedState}
        onCityChange={setSelectedCity}
        selectedCity={selectedCity}
        cities={availableCities}
      />

      <main className="bg-background min-h-screen pb-8">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-surface/80 backdrop-blur-md border border-border rounded-xl px-2 py-2 flex gap-2 shadow-lg">
              <button
                onClick={() => setViewMode("map")}
                className={`px-5 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  viewMode === "map"
                    ? "bg-primary text-surface-light shadow-md"
                    : "text-text-primary hover:bg-white/10"
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-5 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-primary text-surface-light shadow-md"
                    : "text-text-primary hover:bg-white/10"
                }`}
              >
                📋 List
              </button>
            </div>
          </div>

          {viewMode === "map" && (
            <div className="relative w-full h-[60vh] overflow-hidden rounded-3xl shadow-xl mb-12 border border-border">
              <MapView
                mosques={mapMosques}
                center={mapCenter}
                onMarkerClick={handleSelectMosque}
              />

              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <ArrowDown className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}

          {viewMode === "list" && (
            <section className="max-w-5xl mx-auto py-8">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-text-primary mb-3 tracking-tight">
                  {loading ? "Loading Mosques..." : `${filteredMosques.length} Mosques Found`}
                </h2>
                <p className="text-lg text-text-secondary font-medium">
                  {filteredMosques.length > 0
                    ? selectedCity
                      ? selectedState
                        ? `Showing mosques in ${selectedCity}, ${selectedState}`
                        : `Showing mosques in ${selectedCity}`
                      : selectedState
                        ? `Showing mosques in ${selectedState}`
                        : "Sorted by distance from you"
                    : "No mosques available for the selected filters"}
                </p>
                {locationError && (
                  <p className="text-sm text-warning mt-3">
                    Location access unavailable: {locationError}
                  </p>
                )}
              </div>

              <MosqueList
                mosques={filteredMosques}
                onSelectMosque={handleSelectMosque}
                isLoading={loading}
                onUpvote={handleUpvote}
                upvotedMosqueIds={upvotedMosqueIds}
              />
            </section>
          )}
        </section>

        <section className="border-t border-border mt-10">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-md border border-primary/20 rounded-2xl p-10 md:p-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative max-w-2xl mx-auto text-center">
                  <h3 className="text-4xl font-extrabold text-text-primary mb-4 tracking-tight">
                    Know a mosque offering Taraweeh?
                  </h3>
                  <p className="text-text-secondary text-lg mb-10 font-medium">
                    Help your community find prayer times and refreshments at local mosques during Ramadan.
                  </p>
                  <Link href="/submit">
                    <button className="px-10 py-4 bg-primary text-surface-light font-bold rounded-xl hover:bg-primary-hover transition-all duration-200 active:scale-95 shadow-lg hover:shadow-primary/30 text-lg">
                      Submit a Mosque →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-surface/60 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🕌</span>
                  <h2 className="text-xl font-bold text-text-primary tracking-tight">Taraweeh Finder</h2>
                </div>
                <p className="text-text-secondary text-base">
                  Discover taraweeh sessions at nearby masjids during Ramadan.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-5 tracking-tight">Quick Links</h3>
                <ul className="space-y-3 text-base text-text-secondary">
                  <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link href="/submit" className="hover:text-primary transition-colors">Submit Mosque</Link></li>
                  <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-5 tracking-tight">About</h3>
                <p className="text-text-secondary text-base">
                  Made with <span className="text-red-500">♥</span> by Fauzan
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8 text-center">
              <p className="text-text-secondary text-base">
                Made with <span className="text-red-500">♥</span> by Fauzan
              </p>
            </div>
          </div>
        </footer>
      </main>

      <MosqueDetailPanel
        mosque={selectedMosque}
        onClose={() => setSelectedMosque(null)}
        onUpvote={handleUpvote}
        hasUpvoted={selectedMosque ? upvotedMosqueIds.has(selectedMosque.id) : false}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <LocationProvider>
      <HomeContent />
    </LocationProvider>
  );
}
