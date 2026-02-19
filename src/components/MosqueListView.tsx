'use client';

import { ThumbsUp, Eye, MapPin, Zap } from 'lucide-react';
import { Mosque } from '@/types';
import { useState } from 'react';
import { Card } from '@/components/ui/UiCard';
import { Badge } from '@/components/ui/Badge';

interface MosqueListItemProps {
  mosque: Mosque;
  onSelect: (mosque: Mosque) => void;
  onUpvote?: (mosqueName: string, currentUpvotes: number) => Promise<void>;
}

export function MosqueListItem({ mosque, onSelect, onUpvote }: MosqueListItemProps) {
  const [upvotes, setUpvotes] = useState(mosque.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted || isUpvoting) return;

    setIsUpvoting(true);
    try {
      const newUpvotes = upvotes + 1;
      setUpvotes(newUpvotes);
      setHasUpvoted(true);
      
      if (onUpvote) {
        await onUpvote(mosque.name, newUpvotes);
      }
    } catch (error) {
      setUpvotes(upvotes);
      setHasUpvoted(false);
      console.error('Failed to upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const endDate = mosque.taraweeh_sessions?.[0]?.taraweeh_end_date;
  const daysRemaining = endDate ? Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const getCrowdColor = (level: string | undefined) => {
    switch (level) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card
      variant="elevated"
      padding="lg"
      interactive
      onClick={() => onSelect(mosque)}
      className="group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
              {mosque.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{mosque.city}, {mosque.state}</span>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={getCrowdColor(mosque.crowd_level)}
              size="sm"
            >
              <Zap className="w-3 h-3" />
              {mosque.crowd_level || 'Unknown'} crowd
            </Badge>

            {mosque.sweet_type && (
              <Badge variant="secondary" size="sm">
                🍯 {mosque.sweet_type}
              </Badge>
            )}

            {mosque.distribution_time && (
              <Badge variant="secondary" size="sm">
                After prayer @ {mosque.distribution_time}
              </Badge>
            )}
          </div>
        </div>

        {/* Right Content - Stats & Action */}
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-between sm:min-w-max">
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Eye className="w-4 h-4" />
                <span>{mosque.views || 0}</span>
              </div>
              {daysRemaining !== null && daysRemaining >= 0 && (
                <Badge variant="default" size="sm">
                  Day {Math.max(1, 30 - daysRemaining)} • {daysRemaining}d
                </Badge>
              )}
            </div>
          </div>

          {/* Upvote Button */}
          <button
            onClick={handleUpvote}
            disabled={hasUpvoted || isUpvoting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              hasUpvoted
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-light hover:bg-primary/10 text-text-secondary hover:text-primary active:scale-95'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${hasUpvoted ? 'fill-current' : ''}`} />
            <span>{upvotes}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

interface MosqueListProps {
  mosques: Mosque[];
  onSelectMosque: (mosque: Mosque) => void;
  isLoading?: boolean;
  onUpvote?: (mosqueName: string, currentUpvotes: number) => Promise<void>;
  emptyMessage?: string;
}

export function MosqueList({
  mosques,
  onSelectMosque,
  isLoading,
  onUpvote,
  emptyMessage = 'No mosques found in your area',
}: MosqueListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-light border border-border rounded-lg h-28 animate-pulse" />
        ))}
      </div>
    );
  }

  if (mosques.length === 0) {
    return (
      <Card variant="glass" padding="xl" className="text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Mosques Found</h3>
        <p className="text-text-secondary">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {mosques.map((mosque) => (
        <MosqueListItem
          key={mosque.id}
          mosque={mosque}
          onSelect={onSelectMosque}
          onUpvote={onUpvote}
        />
      ))}
    </div>
  );
}
