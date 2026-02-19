'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, ThumbsUp, Building2, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/UiCard';
import { StatCard } from '@/components/StatCard';
import Link from 'next/link';
import { Button } from '@/components/ui/UiButton';
import { MosqueSubmissionForm } from '@/components/MosqueSubmissionForm';

interface DashboardStats {
  totalMosques: number;
  totalViews: number;
  totalUpvotes: number;
  pendingSubmissions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMosques: 0,
    totalViews: 0,
    totalUpvotes: 0,
    pendingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [topMosques, setTopMosques] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch approved mosques
        const { data: approved, error: approvedError } = await supabase
          .from('approved_mosques')
          .select('*, taraweeh_sessions(*)');

        // Fetch pending submissions
        const { data: pending, error: pendingError } = await supabase
          .from('mosque_submissions')
          .select('*')
          .eq('status', 'pending');

        if (approvedError || pendingError) throw new Error('Failed to fetch data');

        const totalMosques = approved?.length || 0;
        const totalViews = approved?.reduce((sum, m) => sum + (m.views || 0), 0) || 0;
        const totalUpvotes = approved?.reduce((sum, m) => sum + (m.upvotes || 0), 0) || 0;

        setStats({
          totalMosques,
          totalViews,
          totalUpvotes,
          pendingSubmissions: pending?.length || 0,
        });

        // Get top 5 mosques by views
        const sorted = (approved || [])
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        setTopMosques(sorted);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome to Taraweeh Finder Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🕌"
          label="Total Mosques"
          value={stats.totalMosques}
          description="Active directories"
        />
        <StatCard
          icon={<Eye className="w-6 h-6" />}
          label="Total Views"
          value={stats.totalViews.toLocaleString()}
          trend={`+12% this week`}
          trendPositive
          description="User engagements"
        />
        <StatCard
          icon={<ThumbsUp className="w-6 h-6" />}
          label="Total Upvotes"
          value={stats.totalUpvotes.toLocaleString()}
          description="Community votes"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Pending Review"
          value={stats.pendingSubmissions}
          trend={stats.pendingSubmissions > 0 ? 'Action needed' : 'All clear'}
          trendPositive={stats.pendingSubmissions === 0}
          description="Awaiting approval"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Mosques - Takes 2 columns */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Top Performing Mosques</h2>
              <p className="text-sm text-text-secondary mt-1">By views and engagement</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-surface rounded-lg animate-pulse" />
              ))}
            </div>
          ) : topMosques.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-12 h-12 text-text-secondary/40 mb-3" />
              <p className="text-text-secondary">No data available yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topMosques.map((mosque, index) => (
                <div
                  key={mosque.id}
                  className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface-light transition-colors border border-border"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-text-primary truncate">{mosque.name}</h3>
                      <p className="text-xs text-text-secondary">{mosque.city}, {mosque.state}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{mosque.views || 0}</p>
                        <p className="text-xs text-text-secondary">views</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{mosque.upvotes || 0}</p>
                        <p className="text-xs text-text-secondary">votes</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link href="/admin/analytics" className="inline-block mt-4">
            <Button variant="tertiary" size="sm">
              View All Analytics
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>

        {/* Sidebar Actions + Submission Form */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card variant="elevated" padding="lg" className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>

            <Link href="/admin/pending" className="block">
              <button className="w-full p-4 bg-surface rounded-lg border border-border hover:border-primary hover:bg-surface-light transition-all text-left group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                      Review Pending
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {stats.pendingSubmissions} mosque{stats.pendingSubmissions !== 1 ? 's' : ''} waiting
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-text-secondary flex-shrink-0 ml-2" />
                </div>
              </button>
            </Link>

            <Link href="/admin/add" className="block">
              <button className="w-full p-4 bg-surface rounded-lg border border-border hover:border-primary hover:bg-surface-light transition-all text-left group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                      Add New Mosque
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Create a new directory entry
                    </p>
                  </div>
                  <Building2 className="w-4 h-4 text-text-secondary flex-shrink-0 ml-2" />
                </div>
              </button>
            </Link>

            <Link href="/admin/approved" className="block">
              <button className="w-full p-4 bg-surface rounded-lg border border-border hover:border-primary hover:bg-surface-light transition-all text-left group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                      View All Mosques
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      Manage {stats.totalMosques} approved mosques
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-text-secondary flex-shrink-0 ml-2" />
                </div>
              </button>
            </Link>
          </Card>

          {/* Submission Form Card */}
          <MosqueSubmissionForm />

          {/* System Health */}
          <Card
            variant="glass"
            padding="lg"
            className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">System Health</h3>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
            </div>
            <p className="text-xs text-text-secondary">All systems operational and running smoothly</p>
            <div className="text-xs font-medium text-primary">Status: Live</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
