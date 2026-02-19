'use client';

import { X, MapPin, Users, Cake, Clock, Eye, ThumbsUp } from 'lucide-react';
import { Mosque } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface MosqueDetailPanelProps {
  mosque: Mosque | null;
  onClose: () => void;
}

export function MosqueDetailPanel({ mosque, onClose }: MosqueDetailPanelProps) {
  const [hasUpvoted, setHasUpvoted] = useState(false);

  if (!mosque) return null;

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    // TODO: Update upvote in database
  };

  const endDate = mosque.taraweeh_sessions?.[0]?.taraweeh_end_date;
  const daysRemaining = endDate ? Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Mobile: Slide-up Panel */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 animate-slide-up">
        <Card variant="glass" padding="lg" className="rounded-t-2xl border-t border-border">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-text-primary mb-2">{mosque.name}</h2>
                <p className="text-text-secondary flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {mosque.address}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-smooth"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <DetailItem
                icon={<Users className="w-5 h-5" />}
                label="Crowd Level"
                value={mosque.crowd_level || 'Unknown'}
              />
              <DetailItem
                icon={<Cake className="w-5 h-5" />}
                label="Sweet Type"
                value={mosque.sweet_type || '-'}
              />
              <DetailItem
                icon={<Clock className="w-5 h-5" />}
                label="Distribution"
                value={mosque.distribution_time || '-'}
              />
              <DetailItem
                icon={<Eye className="w-5 h-5" />}
                label="Views"
                value={mosque.views?.toString() || '0'}
              />
            </div>

            {/* Sessions Info */}
            {mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 0 && (
              <Card variant="surface" padding="md" className="mb-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Taraweeh Sessions</h3>
                <div className="space-y-2">
                  {mosque.taraweeh_sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Session {session.session_number}</span>
                      <Badge variant={daysRemaining && daysRemaining >= 0 ? 'success' : 'default'}>
                        {daysRemaining && daysRemaining >= 0 ? `${daysRemaining} days left` : 'Ended'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant={hasUpvoted ? "secondary" : "primary"}
                size="md"
                fullWidth
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className="flex items-center justify-center gap-2"
              >
                <ThumbsUp className={`w-5 h-5 ${hasUpvoted ? 'fill-current' : ''}`} />
                {hasUpvoted ? 'Upvoted!' : 'Upvote This Mosque'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop: Side Panel */}
      <div className="hidden md:fixed right-0 top-0 bottom-0 z-50 md:flex md:w-96 animate-slide-up">
        <Card variant="glass" padding="lg" className="rounded-l-2xl border-l border-border w-full h-full overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <h2 className="text-3xl font-semibold text-text-primary mb-3">{mosque.name}</h2>
                <p className="text-text-secondary flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {mosque.address}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-smooth flex-shrink-0"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-4 mb-8">
              <DetailItem
                icon={<Users className="w-5 h-5" />}
                label="Crowd Level"
                value={mosque.crowd_level || 'Unknown'}
              />
              <DetailItem
                icon={<Cake className="w-5 h-5" />}
                label="Sweet Type"
                value={mosque.sweet_type || '-'}
              />
              <DetailItem
                icon={<Clock className="w-5 h-5" />}
                label="Distribution Time"
                value={mosque.distribution_time || '-'}
              />
              <DetailItem
                icon={<Eye className="w-5 h-5" />}
                label="Total Views"
                value={mosque.views?.toString() || '0'}
              />
            </div>

            {/* Sessions Info */}
            {mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 0 && (
              <Card variant="surface" padding="lg" className="mb-8">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Taraweeh Sessions</h3>
                <div className="space-y-3">
                  {mosque.taraweeh_sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between">
                      <span className="text-text-secondary">Session {session.session_number}</span>
                      <Badge variant={daysRemaining && daysRemaining >= 0 ? 'success' : 'default'}>
                        {daysRemaining && daysRemaining >= 0 ? `${daysRemaining} days left` : 'Ended'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant={hasUpvoted ? "secondary" : "primary"}
                size="md"
                fullWidth
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className="flex items-center justify-center gap-2"
              >
                <ThumbsUp className={`w-5 h-5 ${hasUpvoted ? 'fill-current' : ''}`} />
                {hasUpvoted ? 'Upvoted!' : 'Upvote This Mosque'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={onClose}
              >
                Close Panel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card variant="surface" padding="md" className="flex items-start gap-4">
      <div className="text-primary flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{label}</p>
        <p className="text-text-primary font-medium truncate">{value}</p>
      </div>
    </Card>
  );
}
