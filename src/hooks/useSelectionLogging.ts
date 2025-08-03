import { useCallback } from 'react';
import { MovingObject } from '../types/MovingObject';

interface UseSelectionLoggingProps {
  movingObjects: MovingObject[];
  selectionCountsRef: React.MutableRefObject<Map<string, number>>;
}

interface UseSelectionLoggingReturn {
  logSelection: (selected: MovingObject) => void;
}

/**
 * Custom hook to handle console logging of selection statistics
 * @param movingObjects Array of all available moving objects
 * @param selectionCountsRef Reference to the selection counts map
 * @returns Object with logSelection function
 */
export function useSelectionLogging({
  movingObjects,
  selectionCountsRef,
}: UseSelectionLoggingProps): UseSelectionLoggingReturn {
  const logSelection = useCallback(
    (selected: MovingObject) => {
      // Update selection count
      const currentCount = selectionCountsRef.current.get(selected.image) || 0;
      const newCount = currentCount + 1;
      selectionCountsRef.current.set(selected.image, newCount);

      // Log individual selection
      const imageName = selected.image.split('/').pop() || 'unknown';
      const effectiveWeight = (selected.weight || 1) / newCount;

      console.log(
        `🎯 Selected: ${imageName} (count: ${newCount}, effective weight: ${effectiveWeight.toFixed(2)})`,
      );

      // Show all current counts every 5 selections
      const totalSelections = Array.from(
        selectionCountsRef.current.values(),
      ).reduce((sum, count) => sum + count, 0);

      if (totalSelections % 5 === 0) {
        console.log('\n📊 Current Selection Counts:');
        const allCounts = Array.from(selectionCountsRef.current.entries()).map(
          ([image, count]) => ({
            image: image.split('/').pop() || 'unknown',
            count,
            effectiveWeight:
              (movingObjects.find((obj) => obj.image === image)?.weight || 1) /
              (count + 1),
          }),
        );
        console.table(allCounts);
        console.log(`Total selections: ${totalSelections}\n`);
      }
    },
    [movingObjects, selectionCountsRef],
  );

  return { logSelection };
}
