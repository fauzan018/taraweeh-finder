"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function PendingSubmissions() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase.from("pending_mosques").select("*");
      setPending(data || []);
    };
    fetchPending();
  }, []);

  const handleApprove = async (mosque: any) => {
    await supabase.from("approved_mosques").insert([{ ...mosque, upvotes: 0, views: 0, approved_at: new Date().toISOString() }]);
    await supabase.from("pending_mosques").delete().eq("id", mosque.id);
    setPending((prev) => prev.filter((m) => m.id !== mosque.id));
  };
  const handleReject = async (id: string) => {
    await supabase.from("pending_mosques").delete().eq("id", id);
    setPending((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Pending Submissions</h1>
      <div className="flex flex-col gap-4">
        {pending.map((m) => (
          <div key={m.id} className="bg-[var(--card)] rounded-xl p-4 shadow-xl">
            <div className="text-lg font-bold text-white mb-2">{m.name}</div>
            <div className="text-sm text-gray-300 mb-2">{m.address}, {m.city}, {m.state}</div>
            <div className="text-xs text-gray-400 mb-2">Ends: {m.taraweeh_end_date} | Sweets: {m.sweet_type}</div>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleApprove(m)} className="bg-[var(--primary)] text-black rounded-xl">Approve</Button>
              <Button onClick={() => handleReject(m.id)} className="bg-red-500 text-white rounded-xl">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
