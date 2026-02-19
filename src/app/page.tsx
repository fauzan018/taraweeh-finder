"use client";

import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";
import { LocationProvider, useLocation } from "@/components/LocationProvider";
import { Navigation } from "@/components/Navigation";
import { MosqueList } from "@/components/MosqueListView";
import { MosqueDetailPanel } from "@/components/MosqueDetailPanel";
import { DEFAULT_CENTER, STATE_COORDINATES } from "@/lib/constants";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";

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

function HomeContent() {
  const { location } = useLocation();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [sorted, setSorted] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  // Fetch all mosques
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

  // Sort and filter mosques
  useEffect(() => {
    let filtered = mosques;

    // Filter by state if selected
    if (selectedState) {
      filtered = filtered.filter((m) => m.state === selectedState);
      setMapCenter(STATE_COORDINATES[selectedState] || DEFAULT_CENTER);
    } else {
      setMapCenter(DEFAULT_CENTER);
    }

    // Sort by distance if location available
    if (location) {
      const { latitude, longitude } = location.coords;
      filtered = [...filtered].sort((a, b) => {
        const d1 = distance(latitude, longitude, a.latitude, a.longitude);
        const d2 = distance(latitude, longitude, b.latitude, b.longitude);
        return d1 - d2;
      });
    }

    setSorted(filtered);
  }, [location, mosques, selectedState]);

  const handleLocationChange = (state: string) => {
    setSelectedState(state);
  };

  const handleUpvote = async (mosqueName: string, newUpvotes: number) => {
    // TODO: Update in database
    setMosques((prev) =>
      prev.map((m) =>
        m.name === mosqueName ? { ...m, upvotes: newUpvotes } : m
      )
    );
  };

  const handleSelectMosque = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    // Increment views
    setMosques((prev) =>
      prev.map((m) =>
        m.id === mosque.id ? { ...m, views: (m.views || 0) + 1 } : m
      )
    );
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Navigation Bar */}
      <Navigation
        onLocationChange={handleLocationChange}
        selectedLocation={selectedState}
      />

      {/* Main Content */}
      <main className="bg-background pt-24 min-h-screen">
        {/* Hero Section with Map */}
        <div className="relative w-full h-[60vh] md:h-[60vh] overflow-hidden rounded-3xl shadow-xl mb-12">
          {mounted && (
            <MapView
              mosques={sorted}
              center={mapCenter}
              onMarkerClick={handleSelectMosque}
            />
          )}

          {/* View Mode Toggle */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-surface/80 backdrop-blur-md border border-border rounded-xl px-2 py-2 flex gap-2 shadow-lg">
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  viewMode === 'map'
                    ? 'bg-primary text-surface-light shadow-md'
                    : 'text-text-primary hover:bg-white/10'
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-primary text-surface-light shadow-md'
                    : 'text-text-primary hover:bg-white/10'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          {viewMode === 'map' && (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
              <ArrowDown className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* List View Section */}
        {viewMode === 'list' && (
          <section className="max-w-5xl mx-auto px-4 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-extrabold text-text-primary mb-3 tracking-tight">
                {loading ? "Loading Mosques..." : `${sorted.length} Mosques Found`}
              </h2>
              <p className="text-lg text-text-secondary font-medium">
                {sorted.length > 0
                  ? selectedState
                    ? `Showing mosques in ${selectedState}`
                    : "Sorted by distance from you"
                  : "No mosques available in this area"}
              </p>
            </div>

            <MosqueList
              mosques={sorted}
              onSelectMosque={handleSelectMosque}
              isLoading={loading}
              onUpvote={handleUpvote}
            />
          </section>
        )}

        {/* Submit Mosque CTA */}
        <section className="border-t border-border mt-16">
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

        {/* Footer */}
        <footer className="border-t border-border bg-surface/60 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Branding */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🕌</span>
                  <h2 className="text-xl font-bold text-text-primary tracking-tight">Taraweeh Finder</h2>
                </div>
                <p className="text-text-secondary text-base">
                  Discover taraweeh sessions at nearby masjids during Ramadan.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-bold text-text-primary mb-5 tracking-tight">Quick Links</h3>
                <ul className="space-y-3 text-base text-text-secondary">
                  <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link href="/submit" className="hover:text-primary transition-colors">Submit Mosque</Link></li>
                  <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link></li>
                </ul>
              </div>

              {/* Info */}
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

      {/* Mosque Detail Panel */}
      <MosqueDetailPanel mosque={selectedMosque} onClose={() => setSelectedMosque(null)} />
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