"use client";
import { useEffect, useState } from "react";

// Set the start date of Ramadan for 2026 (approximate)
const RAMADAN_START = new Date("2026-02-18T00:00:00+05:30");
const RAMADAN_DAYS = 30;

export default function RamadanCounter() {
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - RAMADAN_START.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 0 && diff <= RAMADAN_DAYS) setDay(diff);
    else setDay(null);
  }, []);

  return (
    <div className="rounded-xl bg-[var(--surface)] px-4 py-2 text-white font-semibold shadow-glow text-center mb-4">
      {day ? `Ramadan Day ${day}` : "Ramadan not started"}
    </div>
  );
}
