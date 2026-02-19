'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, X, MapPin, Calendar, Cake } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  sweet_type: string;
  distribution_time: string;
  crowd_level: string;
  taraweeh_end_date: string;
  created_at: string;
}

export default function PendingSubmissions() {
  const [pending, setPending] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('mosque_submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPending(data || []);
      } catch (error) {
        console.error('Failed to fetch pending submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (submission: Submission) => {
    setApproving(submission.id);
    try {
      // Add to approved_mosques
      const { error: insertError } = await supabase.from('approved_mosques').insert([
        {
          name: submission.name,
          address: submission.address,
          city: submission.city,
          state: submission.state,
          latitude: submission.latitude,
          longitude: submission.longitude,
          sweet_type: submission.sweet_type,
          distribution_time: submission.distribution_time,
          crowd_level: submission.crowd_level,
          upvotes: 0,
          views: 0,
          approved_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      // Update submission status
      await supabase
        .from('mosque_submissions')
        .update({ status: 'approved' })
        .eq('id', submission.id);

      // Remove from pending
      setPending((prev) => prev.filter((m) => m.id !== submission.id));
    } catch (error) {
      console.error('Failed to approve submission:', error);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejecting(id);
    try {
      const { error } = await supabase
        .from('mosque_submissions')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      setPending((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to reject submission:', error);
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">Pending Submissions</h1>
        <p className="text-text-secondary">Review and moderate new mosque submissions</p>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-light border border-border rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div className="bg-gradient-to-br from-white/5 to-white/1 border border-primary/20 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-semibold text-text-primary mb-2">All Caught Up!</h3>
          <p className="text-text-secondary">No pending submissions. All submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-text-secondary font-medium">
            {pending.length} submission{pending.length !== 1 ? 's' : ''} pending review
          </div>
          {pending.map((submission) => (
            <div
              key={submission.id}
              className="bg-surface-light border border-border rounded-xl p-6 hover:border-border-light hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Content */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg flex-shrink-0">
                      🕌
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold text-text-primary truncate">{submission.name}</h3>
                      <p className="text-sm text-text-secondary mt-1">Submitted: {new Date(submission.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-text-primary truncate">{submission.address}</p>
                        <p className="text-text-secondary text-xs">{submission.city}, {submission.state}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {submission.sweet_type && (
                        <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-lg">
                          <Cake className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-text-secondary truncate">{submission.sweet_type}</span>
                        </div>
                      )}
                      {submission.distribution_time && (
                        <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-lg">
                          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-text-secondary truncate">{submission.distribution_time}</span>
                        </div>
                      )}
                    </div>

                    {submission.crowd_level && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-text-secondary uppercase font-medium mb-1">Expected Crowd</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            submission.crowd_level === 'Low' ? 'bg-primary' :
                            submission.crowd_level === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <p className="text-text-primary text-sm">{submission.crowd_level}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Content - Action Buttons */}
                <div className="flex flex-col gap-3 md:justify-between h-full">
                  <div className="hidden md:block text-xs text-text-secondary bg-white/5 rounded-lg p-3 text-center">
                    <p className="font-medium text-text-primary mb-1">Action Required</p>
                    <p>Review and approve or reject</p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleApprove(submission)}
                      disabled={approving === submission.id}
                      className="w-full bg-primary hover:bg-primary-hover disabled:opacity-75 disabled:cursor-not-allowed text-surface-light font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Check className="w-5 h-5" />
                      {approving === submission.id ? 'Approving...' : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleReject(submission.id)}
                      disabled={rejecting === submission.id}
                      className="w-full bg-red-500/15 hover:bg-red-500/25 disabled:opacity-75 disabled:cursor-not-allowed text-red-400 hover:text-red-300 border border-red-500/30 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                      {rejecting === submission.id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
