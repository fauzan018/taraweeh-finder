"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";

export default function AnalyticsPage() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [sort, setSort] = useState<"views" | "upvotes">("views");

  useEffect(() => {
    const fetchMosques = async () => {
      const { data } = await supabase.from("approved_mosques").select("*");
      setMosques(data || []);
    };
    fetchMosques();
  }, []);

  const sorted = [...mosques].sort((a, b) => (sort === "views" ? b.views - a.views : b.upvotes - a.upvotes));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setSort("views")} className={`rounded-xl px-4 py-2 font-semibold ${sort === "views" ? "bg-[var(--primary)] text-black" : "bg-[var(--card)] text-white"}`}>Most Viewed</button>
        <button onClick={() => setSort("upvotes")} className={`rounded-xl px-4 py-2 font-semibold ${sort === "upvotes" ? "bg-[var(--primary)] text-black" : "bg-[var(--card)] text-white"}`}>Most Upvoted</button>
      </div>
      <table className="w-full bg-[var(--surface)] rounded-xl shadow-xl">
        <thead>
          <tr className="text-left text-white">
            <th className="p-3">Name</th>
            <th className="p-3">City</th>
            <th className="p-3">Views</th>
            <th className="p-3">Upvotes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => (
            <tr key={m.id} className="border-b border-[var(--card)] text-white">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.city}</td>
              <td className="p-3">{m.views}</td>
              <td className="p-3">{m.upvotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
