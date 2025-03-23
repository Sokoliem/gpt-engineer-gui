import { useState, useEffect } from 'react';

export function useOnboarding() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('onboarding-completed') === 'true';
  });

  useEffect(() => {
    // Show welcome screen on first visit
    if (!hasCompletedOnboarding) {
      setShowWelcome(true);
    }
  }, [hasCompletedOnboarding]);

  const completeOnboarding = (apiKey?: string) => {
    localStorage.setItem('onboarding-completed', 'true');
    
    if (apiKey) {
      localStorage.setItem('openai-api-key', apiKey);
    }
    
    setHasCompletedOnboarding(true);
    setShowWelcome(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-completed');
    setHasCompletedOnboarding(false);
  };

  return {
    showWelcome,
    setShowWelcome,
    hasCompletedOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}