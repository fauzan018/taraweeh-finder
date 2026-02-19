"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mosque } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, ThumbsUp, Zap, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"views" | "upvotes">("views");

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        const { data } = await supabase.from("approved_mosques").select("*");
        setMosques(data || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMosques();
  }, []);

  const sorted = [...mosques].sort((a, b) => (sort === "views" ? b.views - a.views : b.upvotes - a.upvotes));
  const totalViews = mosques.reduce((sum, m) => sum + (m.views || 0), 0);
  const totalUpvotes = mosques.reduce((sum, m) => sum + (m.upvotes || 0), 0);
  const averageViews = mosques.length > 0 ? Math.round(totalViews / mosques.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Analytics</h1>
        <p className="text-text-secondary">Monitor mosque engagement and community activity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-2">Total Views</p>
              <p className="text-4xl font-bold text-primary">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-text-secondary/70 mt-2">Across all mosques</p>
            </div>
            <Eye className="w-8 h-8 text-primary/30" />
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-2">Total Upvotes</p>
              <p className="text-4xl font-bold text-primary">{totalUpvotes.toLocaleString()}</p>
              <p className="text-xs text-text-secondary/70 mt-2">Community engagement</p>
            </div>
            <ThumbsUp className="w-8 h-8 text-primary/30" />
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-2">Avg. Views</p>
              <p className="text-4xl font-bold text-primary">{averageViews.toLocaleString()}</p>
              <p className="text-xs text-text-secondary/70 mt-2">Per mosque</p>
            </div>
            <Zap className="w-8 h-8 text-primary/30" />
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card variant="elevated" padding="lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Top Performing Mosques
          </h2>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <Button
              variant={sort === "views" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSort("views")}
            >
              <Eye className="w-4 h-4" />
              Most Viewed
            </Button>
            <Button
              variant={sort === "upvotes" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSort("upvotes")}
            >
              <ThumbsUp className="w-4 h-4" />
              Most Upvoted
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && mosques.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Data Available</h3>
            <p className="text-text-secondary">Mosques will appear here as they receive views and upvotes</p>
          </div>
        )}

        {/* Table */}
        {!loading && mosques.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Mosque</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">City</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3" /> Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center justify-end gap-1">
                    <ThumbsUp className="w-3 h-3" /> Upvotes
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((mosque, idx) => (
                  <tr key={mosque.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 font-semibold text-primary text-sm">
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-text-primary">{mosque.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-secondary text-sm">{mosque.city}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-semibold text-text-primary">{mosque.views || 0}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-semibold text-primary">{mosque.upvotes || 0}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
