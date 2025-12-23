
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useBackButtonRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Apply only on landing pages (/lp01..lp07) and legacy (/lp-01..lp-07)
    const isLandingPath = /^\/lp-?(0[1-7])(\/|$)/.test(location.pathname);
    if (!isLandingPath) return;

    // Clear any existing lead submission flag for new visits
    if (!sessionStorage.getItem('visitStarted')) {
      localStorage.removeItem('leadSubmitted');
      sessionStorage.setItem('visitStarted', 'true');
    }

    // Add state to history to track if user is leaving
    const currentState = window.history.state;
    if (!currentState?.backInterceptor) {
      window.history.replaceState({ backInterceptor: true }, '', window.location.href);
    }

    // Add another history entry to detect back button
    window.history.pushState({ backInterceptor: true }, '', window.location.href);

    const handlePopState = (_event) => {
      console.log('PopState detected, checking lead submission status');
      
      // Check if user has submitted a lead
      const hasSubmittedLead = localStorage.getItem('leadSubmitted');
      
      if (!hasSubmittedLead) {
        // Prevent the actual back navigation by pushing state again
        window.history.pushState({ backInterceptor: true }, '', window.location.href);
        
        console.log('Redirecting to back-redirect page');
        // Small delay to ensure history state is set
        setTimeout(() => {
          navigate('/ultima-chance', { replace: true });
        }, 10);
      } else {
        console.log('Lead submitted, allowing normal navigation');
      }
    };

    const handleBeforeUnload = () => {
      // Clean up session storage when user actually leaves the site
      sessionStorage.removeItem('visitStarted');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, location.pathname]);
};
