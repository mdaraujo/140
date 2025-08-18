import { useState, useEffect } from 'react';
import { ResponsiveConfig } from '../types/ResponsiveConfig';

/**
 * Hook to determine responsive configuration for moving objects based on screen size
 * @returns Configuration object with max objects and animation intervals
 */
export function useResponsiveMovingObjects(): ResponsiveConfig {
  const [config, setConfig] = useState<ResponsiveConfig>(() =>
    getConfigForScreenSize(window.innerWidth),
  );

  useEffect(() => {
    function handleResize() {
      const newConfig = getConfigForScreenSize(window.innerWidth);
      setConfig(newConfig);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return config;
}

/**
 * Determines configuration based on screen width
 * @param width Screen width in pixels
 * @returns Configuration object
 */
function getConfigForScreenSize(width: number): ResponsiveConfig {
  if (width < 480) {
    // Mobile phones
    return {
      maxMovingObjects: 10,
      animationInterval: { min: 5000, max: 8000 }, // More time between moves
    };
  } else if (width < 768) {
    // Large phones / small tablets
    return {
      maxMovingObjects: 14,
      animationInterval: { min: 4500, max: 7000 },
    };
  } else if (width < 1024) {
    // Tablets / small laptops
    return {
      maxMovingObjects: 18,
      animationInterval: { min: 4000, max: 6500 },
    };
  } else {
    // Desktop / large screens
    return {
      maxMovingObjects: 22,
      animationInterval: { min: 3500, max: 6000 },
    };
  }
}

/**
 * Get screen size category as string (useful for debugging)
 */
export function getScreenCategory(width: number = window.innerWidth): string {
  if (width < 480) return 'mobile';
  if (width < 768) return 'large-mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
