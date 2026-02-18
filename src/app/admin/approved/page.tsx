"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mosque, TaraweehSession } from "@/types";
import { Button } from "@/components/ui/button";

interface MosqueWithSessions extends Mosque {
  taraweeh_sessions: TaraweehSession[];
}

export default function ApprovedMasjids() {
  const [mosques, setMosques] = useState<MosqueWithSessions[]>([]);

  useEffect(() => {
    const fetchMosques = async () => {
      const { data: mosquesData } = await supabase.from("approved_mosques").select("*");
      
      if (mosquesData) {
        const mosquesWithSessions = await Promise.all(
          mosquesData.map(async (mosque) => {
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
            <th className="p-3">Taraweeh Dates</th>
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
              <td className="p-3">
                {m.taraweeh_sessions?.length > 0 ? (
                  <div className="text-sm">
                    {m.taraweeh_sessions.map((session, idx) => (
                      <div key={session.id}>
                        Session {session.session_number}: {new Date(session.taraweeh_end_date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  "No dates set"
                )}
              </td>
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
