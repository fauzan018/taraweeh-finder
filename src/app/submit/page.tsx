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
    taraweeh_end_date: "",
    sweet_type: "",
    distribution_time: "",
    crowd_level: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("pending_mosques").insert([{ ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) }]);
    setLoading(false);
    setSuccess(true);
    setForm({
      name: "",
      address: "",
      state: "",
      city: "",
      latitude: "",
      longitude: "",
      taraweeh_end_date: "",
      sweet_type: "",
      distribution_time: "",
      crowd_level: "",
    });
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
        <input required name="taraweeh_end_date" value={form.taraweeh_end_date} onChange={handleChange} placeholder="Taraweeh End Date (YYYY-MM-DD)" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input name="sweet_type" value={form.sweet_type} onChange={handleChange} placeholder="Sweet Type" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input name="distribution_time" value={form.distribution_time} onChange={handleChange} placeholder="Distribution Time" className="rounded p-2 bg-[var(--surface)] text-white" />
        <input name="crowd_level" value={form.crowd_level} onChange={handleChange} placeholder="Crowd Level" className="rounded p-2 bg-[var(--surface)] text-white" />
        <Button type="submit" className="bg-[var(--primary)] text-black rounded-xl mt-2" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
        {success && <div className="text-green-400 mt-2">Submission received! Thank you.</div>}
      </form>
    </main>
  );
}
