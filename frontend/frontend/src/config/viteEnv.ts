export function getViteApiBaseUrl() {
  return import.meta.env.PROD
    ? 'https://your-backend-url.vercel.app' // Replace with your actual backend URL
    : 'http://localhost:5000';
} 