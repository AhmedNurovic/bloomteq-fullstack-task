// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.vercel.app' // Replace with your actual backend URL
  : 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  ENTRIES: {
    LIST: `${API_BASE_URL}/entries/`,
    CREATE: `${API_BASE_URL}/entries/`,
    UPDATE: (id: number) => `${API_BASE_URL}/entries/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/entries/${id}`,
    STATISTICS: `${API_BASE_URL}/entries/statistics`,
  },
};

export default API_BASE_URL; 