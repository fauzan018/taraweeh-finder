"use client";
import { Mosque } from "../types";
import { Card } from "@/components/ui/card";
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
      className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:bg-white/8 cursor-pointer"
      onClick={handleView}
    >
      <div className="relative z-10">
        {/* Header with mosque name and upvote button */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors duration-300 line-clamp-2">
              {mosque.name}
            </h2>
            {mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 1 && (
              <div className="mt-2 inline-flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 text-xs">
                <span className="text-gray-400">
                  {mosque.taraweeh_sessions.length} Sessions
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={handleUpvote} 
            disabled={upvoted}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 overflow-hidden relative group/btn border ${
              upvoted
                ? 'bg-white/10 text-gray-400 border-white/10'
                : 'bg-white/15 text-white border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-md'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1">
              👍 {mosque.upvotes}
            </span>
            {!upvoted && (
              <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        </div>

        {/* Location info */}
        <div className="mb-4 space-y-1 text-sm">
          <p className="text-gray-400 line-clamp-1">{mosque.address}</p>
          <p className="text-gray-500">{mosque.city}, {mosque.state}</p>
        </div>

        {/* Taraweeh dates */}
        <div className="mb-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Taraweeh Ends</p>
          <p className="text-sm text-gray-200 font-medium">
            {taraweehDates}
          </p>
        </div>

        {/* Sweets info */}
        {mosque.sweet_type && (
          <div className="mb-3 bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Sweets</p>
            <p className="text-sm text-gray-200">{mosque.sweet_type}</p>
          </div>
        )}

        {/* Stats footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-600">
          <div className="flex gap-3">
            <span>👁️ {mosque.views}</span>
            {mosque.crowd_level && (
              <span className="capitalize">👥 {mosque.crowd_level}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
