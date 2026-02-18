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

  const handleUpvote = async () => {
    if (upvoted) return;
    setUpvoted(true);
    onUpvote(mosque.id);
    await supabase.rpc("increment_upvotes", { mosque_id: mosque.id });
  };

  const handleView = () => {
    onView(mosque.id);
    supabase.rpc("increment_views", { mosque_id: mosque.id });
  };

  return (
    <Card className="bg-[var(--card)] shadow-xl rounded-xl p-4 mb-4 flex flex-col gap-2" onClick={handleView}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">{mosque.name}</h2>
        <Button onClick={handleUpvote} disabled={upvoted} className="bg-[var(--primary)] text-black rounded-xl shadow-glow">
          👍 {mosque.upvotes}
        </Button>
      </div>
      <div className="text-sm text-gray-300">{mosque.address}</div>
      <div className="flex gap-2 text-xs text-gray-400">
        <span>{mosque.city}, {mosque.state}</span>
        <span>• Ends: {mosque.taraweeh_end_date}</span>
        <span>• Sweets: {mosque.sweet_type}</span>
      </div>
      <div className="text-xs text-gray-500">Views: {mosque.views}</div>
    </Card>
  );
}
