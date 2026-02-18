"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    views: 0,
    upvotes: 0,
    recent: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: approved } = await supabase.from("approved_mosques").select("*");
      const { data: pending } = await supabase.from("pending_mosques").select("*");
      setStats({
        approved: approved?.length || 0,
        pending: pending?.length || 0,
        views: approved?.reduce((a, m) => a + (m.views || 0), 0) || 0,
        upvotes: approved?.reduce((a, m) => a + (m.upvotes || 0), 0) || 0,
        recent: approved?.slice(-5).reverse() || [],
      });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--card)] rounded-xl p-4 text-center text-white shadow-xl">
          <div className="text-lg font-semibold">Approved</div>
          <div className="text-2xl font-bold">{stats.approved}</div>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center text-white shadow-xl">
          <div className="text-lg font-semibold">Pending</div>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center text-white shadow-xl">
          <div className="text-lg font-semibold">Total Views</div>
          <div className="text-2xl font-bold">{stats.views}</div>
        </div>
        <div className="bg-[var(--card)] rounded-xl p-4 text-center text-white shadow-xl">
          <div className="text-lg font-semibold">Total Upvotes</div>
          <div className="text-2xl font-bold">{stats.upvotes}</div>
        </div>
      </div>
      <div className="bg-[var(--surface)] rounded-xl p-4 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2">Recent Activity</h2>
        <ul className="text-white text-sm">
          {stats.recent.map((m, i) => (
            <li key={m.id} className="py-1 border-b border-[var(--card)] last:border-none">
              {m.name} ({m.city}, {m.state}) – {m.taraweeh_end_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
