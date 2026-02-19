'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mosque, TaraweehSession } from '@/types';
import { Eye, ThumbsUp, MapPin, Trash2, Search } from 'lucide-react';

interface MosqueWithSessions extends Mosque {
  taraweeh_sessions: TaraweehSession[];
}

export default function ApprovedMasjids() {
  const [mosques, setMosques] = useState<MosqueWithSessions[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMosques = async () => {
      setLoading(true);
      try {
        const { data: mosquesData, error } = await supabase.from('approved_mosques').select('*');
        
        if (error) throw error;
        
        if (mosquesData) {
          const mosquesWithSessions = await Promise.all(
            mosquesData.map(async (mosque) => {
              const { data: sessions } = await supabase
                .from('taraweeh_sessions')
                .select('*')
                .eq('mosque_id', mosque.id)
                .order('session_number', { ascending: true });
              
              return {
                ...mosque,
                taraweeh_sessions: sessions || [],
              };
            })
          );
          setMosques(mosquesWithSessions);
        }
      } catch (error) {
        console.error('Failed to fetch mosques:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMosques();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('approved_mosques').delete().eq('id', id);
      if (error) throw error;
      setMosques((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete mosque:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMosques = mosques.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Approved Mosques</h1>
        <p className="text-text-secondary">Manage all approved mosques in the directory</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by name, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-surface-light border border-border rounded-lg text-text-primary placeholder-text-secondary"
        />
      </div>

      {/* Mosques Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-surface-light border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredMosques.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Mosques Found</h3>
          <p className="text-text-secondary">{searchTerm ? 'Try adjusting your search' : 'No approved mosques yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMosques.map((mosque) => (
            <div key={mosque.id} className="card-elevated p-6 hover:shadow-lg transition-smooth flex flex-col">
              {/* Header */}
              <h3 className="text-lg font-semibold text-text-primary mb-3">{mosque.name}</h3>

              {/* Info */}
              <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-primary">{mosque.city}, {mosque.state}</p>
                    <p className="text-xs text-text-secondary">{mosque.address}</p>
                  </div>
                </div>

                {mosque.sweet_type && (
                  <div className="text-sm text-text-secondary">
                    🍯 {mosque.sweet_type}
                  </div>
                )}

                {mosque.crowd_level && (
                  <div className="text-sm text-text-secondary">
                    👥 {mosque.crowd_level} crowd
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Eye className="w-3 h-3" />
                    {mosque.views || 0}
                  </div>
                  <p className="text-xs text-text-secondary">Views</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <ThumbsUp className="w-3 h-3" />
                    {mosque.upvotes || 0}
                  </div>
                  <p className="text-xs text-text-secondary">Upvotes</p>
                </div>
              </div>

              {/* Sessions */}
              {mosque.taraweeh_sessions && mosque.taraweeh_sessions.length > 0 && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg text-xs">
                  <p className="text-text-secondary font-medium mb-2">Taraweeh Sessions</p>
                  <div className="space-y-1">
                    {mosque.taraweeh_sessions.slice(0, 2).map((session) => (
                      <div key={session.id} className="flex justify-between">
                        <span className="text-text-secondary">Session {session.session_number}</span>
                        <span className="text-primary">
                          {new Date(session.taraweeh_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(mosque.id)}
                disabled={deletingId === mosque.id}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 font-medium py-2 px-3 rounded-md transition-smooth disabled:opacity-75 flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === mosque.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
