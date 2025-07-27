// User type
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// Context type
export interface Context {
  id: number;
  user_id: number;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// Activity type
export interface Activity {
  id: string; // UUID
  user_id: number;
  day_id: number | null;
  context_id: number | null;
  date: string;
  title: string;
  notes: string | null;
  status: string;
  time: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Relations
  context?: Context;
}

// Day type
export interface Day {
  id: number;
  user_id: number;
  date: string;
  summary: string | null;
  mood: number | null;
  energy: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  activities?: Activity[];
}
