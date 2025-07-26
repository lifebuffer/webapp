export const authConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://api.lifebuffer.test',
  clientId: import.meta.env.VITE_CLIENT_ID || '9ebd8f82-e3fe-4205-87ad-bfe10e03cdd9',
  clientSecret: '', // Leave empty for public clients (PKCE flow)
  scopes: 'use-app', // Add appropriate scopes as needed
};
