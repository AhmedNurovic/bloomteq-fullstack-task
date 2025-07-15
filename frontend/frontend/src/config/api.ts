// API Configuration
// Support both Vite (import.meta.env) and Jest/Node (process.env)
import { getViteApiBaseUrl } from './viteEnv';

export function getApiBaseUrl() {
  return getViteApiBaseUrl();
}

export const API_ENDPOINTS = {
  REGISTER: () => `${getApiBaseUrl()}/api/auth/register`,
  LOGIN: () => `${getApiBaseUrl()}/api/auth/login`,
  PROFILE: () => `${getApiBaseUrl()}/api/auth/profile`,
  ENTRIES: () => `${getApiBaseUrl()}/api/entries/`,
  ENTRY: (id: number) => `${getApiBaseUrl()}/api/entries/${id}`,
  STATISTICS: () => `${getApiBaseUrl()}/api/entries/statistics`,
}; 