import { MovingObject } from '../types/MovingObject';

/**
 * Selects a random item from a weighted array using accumulated weights
 * @param items Array of items with weights
 * @returns A randomly selected item based on weights
 */
export function selectWeightedRandom(items: MovingObject[]): MovingObject {
  if (items.length === 0) {
    throw new Error('Cannot select from empty array');
  }

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);

  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than 0');
  }

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Find the selected item by accumulating weights
  for (const item of items) {
    random -= item.weight || 1;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback (shouldn't reach here with valid inputs)
  return items[items.length - 1];
}
