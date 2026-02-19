"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function SubmitMosquePage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
    sweet_type: "",
    distribution_time: "",
    crowd_level: "",
  });
  const [taraweehDates, setTaraweehDates] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTaraweehDateChange = (index: number, value: string) => {
    const newDates = [...taraweehDates];
    newDates[index] = value;
    setTaraweehDates(newDates);
  };

  const addTaraweehDate = () => {
    setTaraweehDates([...taraweehDates, ""]);
  };

  const removeTaraweehDate = (index: number) => {
    if (taraweehDates.length > 1) {
      setTaraweehDates(taraweehDates.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Insert mosque data
      const { data: mosqueData, error: mosqueError } = await supabase
        .from("pending_mosques")
        .insert([{ 
          ...form, 
          latitude: Number(form.latitude), 
          longitude: Number(form.longitude) 
        }])
        .select();

      if (mosqueError) throw mosqueError;

      const mosqueId = mosqueData?.[0]?.id;

      // Insert taraweeh sessions
      const validDates = taraweehDates.filter(date => date.trim() !== "");
      if (mosqueId && validDates.length > 0) {
        const sessions = validDates.map((date, index) => ({
          mosque_id: mosqueId,
          taraweeh_end_date: date,
          session_number: index + 1,
        }));

        const { error: sessionError } = await supabase
          .from("pending_taraweeh_sessions")
          .insert(sessions);

        if (sessionError) throw sessionError;
      }

      setLoading(false);
      setSuccess(true);
      setForm({
        name: "",
        address: "",
        state: "",
        city: "",
        latitude: "",
        longitude: "",
        sweet_type: "",
        distribution_time: "",
        crowd_level: "",
      });
      setTaraweehDates([""]);
    } catch (error) {
      console.error("Error submitting mosque:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-4">Submit a Mosque</h1>
      <form onSubmit={handleSubmit} className="bg-[var(--card)] rounded-xl p-6 w-full max-w-md flex flex-col gap-3 shadow-xl">
        <input required name="name" value={form.name} onChange={handleChange} placeholder="Mosque Name" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input required name="address" value={form.address} onChange={handleChange} placeholder="Address" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input required name="state" value={form.state} onChange={handleChange} placeholder="State" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input required name="city" value={form.city} onChange={handleChange} placeholder="City" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input required name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input required name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="rounded p-2 bg-[var(--surface)] text-white" />
        
        <div className="mt-4">
          <label className="text-white font-semibold mb-2 block">Taraweeh End Dates (Add multiple if there are multiple sessions)</label>
          {taraweehDates.map((date, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                required
                type="date"
                value={date}
                onChange={(e) => handleTaraweehDateChange(index, e.target.value)}
                placeholder="Taraweeh End Date (YYYY-MM-DD)"
                className="rounded p-2 bg-[var(--surface)] text-white flex-1"
              />
              {taraweehDates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTaraweehDate(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTaraweehDate}
            className="bg-[var(--primary)] text-white px-3 py-2 rounded mt-2 w-full"
          >
            + Add Another Taraweeh Date
          </button>
        </div>

        <input name="sweet_type" value={form.sweet_type} onChange={handleChange} placeholder="Sweet Type" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input name="distribution_time" value={form.distribution_time} onChange={handleChange} placeholder="Distribution Time" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input name="crowd_level" value={form.crowd_level} onChange={handleChange} placeholder="Crowd Level" className="rounded p-2 bg-[var(--surface)] text-white" />
        <Button type="submit" className="bg-[var(--primary)] text-white rounded-xl mt-2" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
        {success && <div className="text-green-400 mt-2">Submission received! Thank you.</div>}
      </form>
    </main>
  );
}
