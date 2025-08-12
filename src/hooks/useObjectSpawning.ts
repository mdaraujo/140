import { useEffect } from 'react';
import { ResponsiveConfig } from '../types/ResponsiveConfig';

interface UseObjectSpawningProps {
  movingObjectCount: number;
  setMovingObjectCount: React.Dispatch<React.SetStateAction<number>>;
  responsiveConfig: ResponsiveConfig;
}

/**
 * Custom hook to handle the timing and spawning of new moving objects
 * @param movingObjectCount Current number of moving objects
 * @param setMovingObjectCount Function to update the moving object count
 * @param responsiveConfig Configuration for max objects and timing based on screen size
 */
export function useObjectSpawning({
  movingObjectCount,
  setMovingObjectCount,
  responsiveConfig,
}: UseObjectSpawningProps): void {
  useEffect(() => {
    if (movingObjectCount < responsiveConfig.maxMovingObjects) {
      // Make the first moving objects appear faster, then slow down
      let minInterval: number;
      let maxInterval: number;

      if (movingObjectCount < 2) {
        minInterval = 600; // 0.6s
        maxInterval = 1200; // 1.2s
      } else if (movingObjectCount < 4) {
        minInterval = responsiveConfig.animationInterval.min * 0.6; // Faster initial appearance
        maxInterval = responsiveConfig.animationInterval.max * 0.6;
      } else {
        minInterval = responsiveConfig.animationInterval.min;
        maxInterval = responsiveConfig.animationInterval.max;
      }

      const interval = setInterval(
        () => {
          setMovingObjectCount((count) =>
            Math.min(count + 1, responsiveConfig.maxMovingObjects),
          );
        },
        Math.random() * (maxInterval - minInterval) + minInterval,
      );

      return () => clearInterval(interval);
    }
  }, [movingObjectCount, responsiveConfig, setMovingObjectCount]);
}
