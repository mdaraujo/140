import { MovingObject } from '../types/MovingObject';

/**
 * Selects a random item from a weighted array using accumulated weights
 * @param items Array of items with weights
 * @param selectionCounts Optional map of how many times each item has been selected
 * @returns A randomly selected item based on weights
 */
export function selectWeightedRandom(
  items: MovingObject[],
  selectionCounts?: Map<string, number>,
): MovingObject {
  if (items.length === 0) {
    throw new Error('Cannot select from empty array');
  }

  // Calculate effective weights (diminishing based on selection count)
  const effectiveWeights = items.map((item) => {
    const baseWeight = item.weight || 1;
    const selectionCount = selectionCounts?.get(item.image) || 0;
    // Diminishing formula: weight / (selectionCount + 1)
    // This ensures weight never reaches 0 but gets progressively smaller
    return baseWeight / (selectionCount + 1);
  });

  const totalWeight = effectiveWeights.reduce((sum, weight) => sum + weight, 0);

  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than 0');
  }

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Find the selected item by accumulating weights
  for (let i = 0; i < items.length; i++) {
    random -= effectiveWeights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  // Fallback (shouldn't reach here with valid inputs)
  return items[items.length - 1];
}
