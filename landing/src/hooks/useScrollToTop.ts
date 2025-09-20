import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top instantly when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);
}