import { authConfig } from '~/config/auth';
import type { Context, Activity, Day } from '~/utils/types';

const { apiBaseUrl: API_BASE_URL, clientId: CLIENT_ID, scopes: SCOPES } = authConfig;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          client_secret: '', // Empty for public clients
          scope: SCOPES,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Store new tokens
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('user');
  // Redirect to home page
  window.location.href = '/';
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  if (!accessToken) {
    throw new ApiError(401, 'No access token available');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && !isRetry) {
    try {
      // Try to refresh the token
      await refreshAccessToken();
      
      // Retry the request with the new token
      const newAccessToken = localStorage.getItem('access_token');
      if (newAccessToken) {
        return apiRequest<T>(endpoint, options, true);
      }
    } catch (error) {
      // Refresh failed, logout the user
      logout();
      throw new ApiError(401, 'Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, `API request failed: ${response.statusText}`);
  }

  return response.json();
}

export interface TodayResponse {
  day: Day;
  activities: Activity[];
  contexts: Context[];
}

export interface DayData {
  day: Day;
  activities: Activity[];
}

export interface RecentDaysResponse {
  days: DayData[];
  contexts: Context[];
}

export const api = {
  // Context API methods
  contexts: {
    list: (): Promise<Context[]> => apiRequest('/api/contexts'),
    get: (id: number): Promise<Context> => apiRequest(`/api/contexts/${id}`),
    create: (data: Omit<Context, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Context> =>
      apiRequest('/api/contexts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Omit<Context, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Context> =>
      apiRequest(`/api/contexts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number): Promise<void> =>
      apiRequest(`/api/contexts/${id}`, {
        method: 'DELETE',
      }),
  },
  
  // Today endpoint
  today: (): Promise<TodayResponse> => apiRequest('/api/today'),
  
  // Get data for specific date
  dayData: (date: string): Promise<TodayResponse> => apiRequest(`/api/today/${date}`),
  
  // Get recent days data
  recentDays: (): Promise<RecentDaysResponse> => apiRequest('/api/recent'),

  // Activity API methods
  activities: {
    update: (id: string, data: Partial<Omit<Activity, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>>): Promise<Activity> =>
      apiRequest(`/api/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Day API methods
  days: {
    update: (date: string, data: Partial<Omit<Day, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at' | 'deleted_at'>>): Promise<Day> =>
      apiRequest(`/api/days/${date}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // User profile management
  user: {
    getProfile: (): Promise<any> => apiRequest('/api/profile'),
    updateProfile: (data: { name: string; email: string; password?: string; password_confirmation?: string }): Promise<any> =>
      apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteAccount: (data: { password: string; confirmation: string }): Promise<{ message: string }> =>
      apiRequest('/api/account', {
        method: 'DELETE',
        body: JSON.stringify(data),
      }),
  },
};