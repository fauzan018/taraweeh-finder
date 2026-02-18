"use client";
import { Mosque } from "../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface MosqueCardProps {
  mosque: Mosque;
  onUpvote: (id: string) => void;
  onView: (id: string) => void;
}

export function MosqueCard({ mosque, onUpvote, onView }: MosqueCardProps) {
  const [upvoted, setUpvoted] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted) return;
    setUpvoted(true);
    onUpvote(mosque.id);
    await supabase.rpc("increment_upvotes", { mosque_id: mosque.id });
  };

  const handleView = () => {
    onView(mosque.id);
    supabase.rpc("increment_views", { mosque_id: mosque.id });
  };

  const taraweehDates = (mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 0)
    ? mosque.taraweeh_sessions.map((s) => new Date(s.taraweeh_end_date).toLocaleDateString()).join(", ")
    : "TBA";

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-[var(--card)] to-[#1a1a2e] border border-[var(--card)]/50 hover:border-[var(--primary)]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/20 cursor-pointer"
      onClick={handleView}
    >
      {/* Background gradient effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/0 group-hover:from-[var(--primary)]/5 group-hover:to-[var(--primary)]/10 transition-all duration-300" />
      
      <div className="relative z-10">
        {/* Header with mosque name and upvote button */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2">
              {mosque.name}
            </h2>
            {/* Badge for multiple sessions */}
            {mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 1 && (
              <div className="mt-2 inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-3 py-1">
                <span className="text-orange-400 text-xs font-semibold">
                  🎊 {mosque.taraweeh_sessions.length} Sessions
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={handleUpvote} 
            disabled={upvoted}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              upvoted
                ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/50'
                : 'bg-[var(--primary)] hover:bg-orange-500 text-black border border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/50'
            }`}
          >
            <span>👍</span>
            <span className="font-bold">{mosque.upvotes}</span>
          </button>
        </div>

        {/* Location info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--primary)]">📍</span>
            <p className="text-gray-300">{mosque.address}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{mosque.city}, {mosque.state}</span>
          </div>
        </div>

        {/* Taraweeh dates */}
        <div className="mb-4 bg-[var(--background)]/50 backdrop-blur-sm border border-[var(--card)]/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[var(--primary)] font-semibold text-sm">⏰ Taraweeh Ends:</span>
          </div>
          <p className="text-gray-200 text-sm font-medium">
            {taraweehDates}
          </p>
        </div>

        {/* Sweets info */}
        {mosque.sweet_type && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍯</span>
              <div>
                <p className="text-gray-400 text-xs">Sweet Type</p>
                <p className="text-emerald-400 font-semibold">{mosque.sweet_type}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--card)]/30">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span>👁️</span>
              <span>{mosque.views} views</span>
            </span>
            {mosque.crowd_level && (
              <span className="flex items-center gap-1">
                <span>👥</span>
                <span className="capitalize">{mosque.crowd_level} crowd</span>
              </span>
            )}
          </div>
          <div className="text-xs font-medium text-[var(--primary)]/70 group-hover:text-[var(--primary)] transition-colors">
            Click to learn more →
          </div>
        </div>
      </div>
    </Card>
  );
}
