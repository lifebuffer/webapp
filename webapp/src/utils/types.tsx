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
  context_id: number | null;
  date: string;
  title: string;
  notes: string | null;
  status: 'new' | 'in_progress' | 'done';
  time: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Relations
  context?: Context;
}

// Day type
export interface Day {
  id: string; // UUID
  user_id: number;
  date: string;
  notes: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
