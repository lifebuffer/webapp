import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export function useHashNavigation() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation on page load or route change
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, location.pathname]);
}