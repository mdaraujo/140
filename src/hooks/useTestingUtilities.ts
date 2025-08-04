import { useEffect } from 'react';
import { MovingObject } from '../types/MovingObject';
import {
  logDiminishingWeightsTest,
  demonstrateDiminishingEffect,
} from '../utils/testDiminishingWeights';

/**
 * Custom hook to expose testing utilities to the browser console
 * @param movingObjects Array of moving objects to test with
 * @param selectionCountsRef Ref to the current selection counts
 */
export function useTestingUtilities(
  movingObjects: MovingObject[],
  selectionCountsRef: React.MutableRefObject<Map<string, number>>,
) {
  useEffect(() => {
    // @ts-expect-error - Adding to window for testing
    window.testDiminishingWeights = () =>
      logDiminishingWeightsTest(movingObjects, 100);
    // @ts-expect-error - Adding to window for testing
    window.demonstrateDiminishingEffect = () =>
      demonstrateDiminishingEffect(movingObjects);
    // @ts-expect-error - Adding current selection counts to window
    window.getCurrentSelectionCounts = () => {
      console.log('\n=== Current Selection Counts ===');
      const counts = Array.from(selectionCountsRef.current.entries()).map(
        ([image, count]) => ({
          image: image.split('/').pop() || 'unknown',
          count,
        }),
      );
      console.table(counts);
      console.log('================================\n');
      return selectionCountsRef.current;
    };
  }, [movingObjects, selectionCountsRef]);
}
