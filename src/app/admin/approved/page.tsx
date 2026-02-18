"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";
import { Button } from "@/components/ui/button";

export default function ApprovedMasjids() {
  const [mosques, setMosques] = useState<Mosque[]>([]);

  useEffect(() => {
    const fetchMosques = async () => {
      const { data } = await supabase.from("approved_mosques").select("*");
      setMosques(data || []);
    };
    fetchMosques();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("approved_mosques").delete().eq("id", id);
    setMosques((prev) => prev.filter((m) => m.id !== id));
  };

  // Edit logic would be similar, omitted for brevity

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Approved Masjids</h1>
      <table className="w-full bg-[var(--surface)] rounded-xl shadow-xl">
        <thead>
          <tr className="text-left text-white">
            <th className="p-3">Name</th>
            <th className="p-3">City</th>
            <th className="p-3">End Date</th>
            <th className="p-3">Views</th>
            <th className="p-3">Upvotes</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mosques.map((m) => (
            <tr key={m.id} className="border-b border-[var(--card)] text-white">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.city}</td>
              <td className="p-3">{m.taraweeh_end_date}</td>
              <td className="p-3">{m.views}</td>
              <td className="p-3">{m.upvotes}</td>
              <td className="p-3 flex gap-2">
                <Button className="bg-[var(--primary)] text-black rounded-xl">Edit</Button>
                <Button onClick={() => handleDelete(m.id)} className="bg-red-500 text-white rounded-xl">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
