"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PremiumButton } from "@/components/PremiumButton";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const json = await response.json().catch(() => ({}));
        setError(json?.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05050f] via-[#0a0a14] to-[#05050f] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="relative">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--card)] to-[var(--surface)] rounded-2xl blur-3xl opacity-30" />
          
          <form
            onSubmit={handleLogin}
            className="relative bg-white/8 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-6 hover:border-white/30 transition-all duration-300"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Admin Access
              </h1>
              <p className="text-gray-500 text-sm">Secure authentication required</p>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg p-3 bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--card)] focus:border-[var(--card)] text-white placeholder-gray-500 focus:outline-none transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Login Button */}
            <PremiumButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full !px-0 !py-3 text-base font-semibold"
            >
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </PremiumButton>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm animate-slide-up">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
