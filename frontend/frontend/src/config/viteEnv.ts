export function getViteApiBaseUrl() {
  return import.meta.env.PROD
    ? 'https://your-vercel-backend-url.vercel.app' // Replace with your actual Vercel backend URL
    : 'http://localhost:5000';
} 