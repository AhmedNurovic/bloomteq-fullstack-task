// API Configuration
// Support both Vite (import.meta.env) and Jest/Node (process.env)
import { getViteApiBaseUrl } from './viteEnv';

export function getApiBaseUrl() {
  return getViteApiBaseUrl();
}

export const API_ENDPOINTS = {
  REGISTER: () => `${getApiBaseUrl()}/auth/register`,
  LOGIN: () => `${getApiBaseUrl()}/auth/login`,
  PROFILE: () => `${getApiBaseUrl()}/auth/profile`,
  ENTRIES: () => `${getApiBaseUrl()}/entries/`,
  ENTRY: (id: number) => `${getApiBaseUrl()}/entries/${id}`,
  STATISTICS: () => `${getApiBaseUrl()}/entries/statistics`,
}; 