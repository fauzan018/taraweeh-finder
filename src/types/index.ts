export interface TaraweehSession {
  id: string;
  mosque_id: string;
  taraweeh_end_date: string;
  session_number: number;
  created_at: string;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  sweet_type: string;
  distribution_time: string;
  crowd_level: string;
  upvotes: number;
  views: number;
  created_at: string;
  approved_at: string;
  taraweeh_sessions?: TaraweehSession[];
}
