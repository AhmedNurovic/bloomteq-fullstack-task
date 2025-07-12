import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTitle = (title?: string) => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = 'TimeTrack';
    
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      // Set default titles based on route
      switch (location.pathname) {
        case '/':
          document.title = `${baseTitle} - Work Hours Management`;
          break;
        case '/login':
          document.title = `Login | ${baseTitle}`;
          break;
        case '/register':
          document.title = `Register | ${baseTitle}`;
          break;
        case '/dashboard':
          document.title = `Dashboard | ${baseTitle}`;
          break;
        default:
          document.title = baseTitle;
      }
    }
  }, [location.pathname, title]);
}; 