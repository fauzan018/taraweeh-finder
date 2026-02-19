"use client";
import { useEffect, useState } from "react";

// Set the start date of Ramadan to TODAY (Feb 19, 2026 = Day 1)
const RAMADAN_START = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
const RAMADAN_DAYS = 30;

export default function RamadanCounter() {
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    const updateDay = () => {
      const now = new Date();
      
      // Reset to start of today for accurate calculation
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const ramadanStart = new Date(RAMADAN_START.getFullYear(), RAMADAN_START.getMonth(), RAMADAN_START.getDate());
      
      const diff = Math.floor((today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (diff > 0 && diff <= RAMADAN_DAYS) {
        setDay(diff);
      } else if (diff > RAMADAN_DAYS) {
        setDay(null);
      }

    };

    updateDay();
    const interval = setInterval(updateDay, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
      <div className="relative rounded-xl bg-white/8 backdrop-blur-xl border border-white/10 px-4 py-3 text-text-primary font-semibold text-center mb-4 hover:border-white/20 hover:bg-white/12 transition-all duration-300">
        {day ? (
          <div className="text-base font-bold tracking-tight">Ramadan Day {day}</div>
        ) : (
          "Ramadan not started"
        )}
      </div>
    </div>
  );
}
