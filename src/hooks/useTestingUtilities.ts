import { useEffect } from 'react';
import { MovingObject } from '../types/MovingObject';
import {
  logDiminishingWeightsTest,
  demonstrateDiminishingEffect,
} from '../utils/testDiminishingWeights';

/**
 * Custom hook to expose testing utilities to the browser console
 * @param movingObjects Array of moving objects to test with
 * @param randomPickCountsRef Ref to the current weighted algorithm pick counts
 */
export function useTestingUtilities(
  movingObjects: MovingObject[],
  randomPickCountsRef: React.MutableRefObject<Map<string, number>>,
) {
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }
    // @ts-expect-error - Adding to window for testing
    window.testDiminishingWeights = () =>
      logDiminishingWeightsTest(movingObjects, 100);
    // @ts-expect-error - Adding to window for testing
    window.demonstrateDiminishingEffect = () =>
      demonstrateDiminishingEffect(movingObjects);
    // @ts-expect-error - Adding current random pick counts to window
    window.getCurrentRandomPickCounts = () => {
      console.log('\n=== Current Weighted Algorithm Stats ===');
      const counts = Array.from(randomPickCountsRef.current.entries()).map(
        ([image, count]) => ({
          image: image.split('/').pop() || 'unknown',
          count,
        }),
      );
      console.table(counts);
      console.log('================================\n');
      return randomPickCountsRef.current;
    };
  }, [movingObjects, randomPickCountsRef]);
}
