import { selectWeightedRandom } from './weightedSelection';
import { MovingObject } from '../types/MovingObject';

/**
 * Test function to demonstrate diminishing weights behavior
 * @param items Array of moving objects with weights
 * @param iterations Number of selections to simulate
 * @returns Object with detailed selection statistics
 */
export function testDiminishingWeights(
  items: MovingObject[],
  iterations: number = 50,
) {
  const selectionCounts = new Map<string, number>();
  const selectionHistory: string[] = [];

  // Initialize counts
  items.forEach((item) => {
    selectionCounts.set(item.image, 0);
  });

  // Perform selections
  for (let i = 0; i < iterations; i++) {
    const selected = selectWeightedRandom(items, selectionCounts);
    const key = selected.image.split('/').pop() || 'unknown';

    // Update count and history
    const currentCount = selectionCounts.get(selected.image) || 0;
    selectionCounts.set(selected.image, currentCount + 1);
    selectionHistory.push(key);
  }

  // Calculate statistics
  const results = items.map((item) => {
    const key = item.image.split('/').pop() || 'unknown';
    const count = selectionCounts.get(item.image) || 0;
    const percentage = (count / iterations) * 100;

    return {
      image: key,
      originalWeight: item.weight || 1,
      timesSelected: count,
      percentage: percentage.toFixed(1),
      finalEffectiveWeight: (item.weight || 1) / (count + 1),
    };
  });

  return {
    iterations,
    selectionHistory,
    results,
    totalSelections: selectionHistory.length,
  };
}

/**
 * Console log the diminishing weights test results
 */
export function logDiminishingWeightsTest(
  items: MovingObject[],
  iterations: number = 50,
) {
  const testResults = testDiminishingWeights(items, iterations);

  console.log('\n=== Diminishing Weights Test ===');
  console.log(`Total Iterations: ${testResults.iterations}`);
  console.log('\nSelection Statistics:');
  console.table(testResults.results);

  console.log('\nSelection History (first 20):');
  console.log(testResults.selectionHistory.slice(0, 20).join(' → '));

  console.log('\n================================\n');

  return testResults;
}

/**
 * Simple function to demonstrate the effect over time
 */
export function demonstrateDiminishingEffect(items: MovingObject[]) {
  console.log('\n=== Diminishing Effect Demo ===');

  const selectionCounts = new Map<string, number>();
  items.forEach((item) => selectionCounts.set(item.image, 0));

  // Show effective weights after different selection counts
  for (let round = 0; round < 5; round++) {
    console.log(`\nRound ${round + 1}:`);

    items.forEach((item) => {
      const key = item.image.split('/').pop() || 'unknown';
      const baseWeight = item.weight || 1;
      const count = selectionCounts.get(item.image) || 0;
      const effectiveWeight = baseWeight / (count + 1);

      console.log(
        `  ${key}: ${effectiveWeight.toFixed(2)} (selected ${count} times)`,
      );
    });

    // Simulate a selection
    const selected = selectWeightedRandom(items, selectionCounts);
    const currentCount = selectionCounts.get(selected.image) || 0;
    selectionCounts.set(selected.image, currentCount + 1);

    const selectedKey = selected.image.split('/').pop() || 'unknown';
    console.log(`  → Selected: ${selectedKey}`);
  }

  console.log('\n===============================\n');
}
