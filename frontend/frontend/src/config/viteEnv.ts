export function getViteApiBaseUrl() {
  return import.meta.env.PROD
    ? 'https://bloomteq-fullstack-task-mpbkdk86f-ahmednurovics-projects.vercel.app' // Updated to actual backend URL
    : 'http://localhost:5000';
} 