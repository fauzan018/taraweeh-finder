"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === process.env.ADMIN_PASSWORD) {
      localStorage.setItem("admin", "1");
      router.push("/admin");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <form onSubmit={handleLogin} className="bg-[var(--card)] rounded-xl p-8 shadow-xl flex flex-col gap-4 w-full max-w-xs">
        <h1 className="text-xl font-bold text-white">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="rounded p-2 bg-[var(--surface)] text-white"
        />
        <button type="submit" className="bg-[var(--primary)] text-black rounded-xl p-2 font-semibold">Login</button>
        {error && <div className="text-red-400">{error}</div>}
      </form>
    </main>
  );
}
