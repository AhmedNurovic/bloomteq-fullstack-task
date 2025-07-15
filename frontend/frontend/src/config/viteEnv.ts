export function getViteApiBaseUrl() {
  return import.meta.env.PROD
    ? 'https://bloomteq-fullstack-task.vercel.app' // Updated to match deployed backend URL
    : 'http://localhost:5000';
} 