import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import { MovingObject } from '../types/MovingObject';
import { Position } from '../types/Position';
import { ResponsiveConfig } from '../types/ResponsiveConfig';
import { DECAY_FACTOR } from '../utils/weightedSelection';
import { selectWeightedRandom } from '../utils/weightedSelection';

/**
 * State interface for moving objects management
 */
interface MovingObjectsState {
  // Object management
  movingObjectCount: number;
  objectPositions: Map<string, Position>;
  randomPickCounts: Map<string, number>;
  totalUniqueObjects: number;
  isUniqueAssignmentEnabled: boolean;

  // UI state
  restrictedAreas: DOMRect[];

  // Configuration
  responsiveConfig: ResponsiveConfig | null;
}

/**
 * Actions interface for moving objects management
 */
interface MovingObjectsActions {
  // Object management
  setMovingObjectCount: (count: number) => void;
  updateObjectPosition: (elementId: string, position: Position) => void;
  removeObjectPosition: (elementId: string) => void;

  // Unique assignment of moving objects to on-screen elements
  assignUniqueMovingObject: (elementId: string, preferred?: MovingObject) => MovingObject | null;
  releaseAssignedMovingObject: (elementId: string) => void;

  setUniqueAssignmentEnabled: (enabled: boolean) => void;

  // Weighted random algorithm tracking
  logRandomPick: (movingObject: MovingObject) => void;
  getRandomPickCounts: () => Map<string, number>;

  // Configuration
  setRestrictedAreas: (areas: DOMRect[]) => void;
  setResponsiveConfig: (config: ResponsiveConfig) => void;
}

/**
 * Combined context interface
 */
interface MovingObjectsContextType extends MovingObjectsState, MovingObjectsActions {}

/**
 * React Context for moving objects state
 */
const MovingObjectsContext = createContext<MovingObjectsContextType | null>(null);

/**
 * Hook to access moving objects context
 * @throws Error if used outside of MovingObjectsProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMovingObjects(): MovingObjectsContextType {
  const context = useContext(MovingObjectsContext);
  if (!context) {
    throw new Error('useMovingObjects must be used within a MovingObjectsProvider');
  }
  return context;
}

/**
 * Props for MovingObjectsProvider
 */
interface MovingObjectsProviderProps {
  children: ReactNode;
  initialMovingObjects: MovingObject[];
  enforceUniqueAssignments?: boolean;
}

/**
 * Provider component for moving objects state management
 */
export function MovingObjectsProvider({
  children,
  initialMovingObjects,
  enforceUniqueAssignments = true,
}: MovingObjectsProviderProps): JSX.Element {
  // State management
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1);
  const [restrictedAreas, setRestrictedAreas] = useState<DOMRect[]>([]);
  const [responsiveConfig, setResponsiveConfig] = useState<ResponsiveConfig | null>(null);
  const [isUniqueAssignmentEnabled, setUniqueAssignmentEnabled] =
    useState<boolean>(enforceUniqueAssignments);

  // Refs for performance (avoid re-renders on position updates)
  const objectPositionsRef = useRef<Map<string, Position>>(new Map());
  const randomPickCountsRef = useRef<Map<string, number>>(new Map());
  const assignedImageByElementRef = useRef<Map<string, string>>(new Map());
  const assignedImagesRef = useRef<Set<string>>(new Set());

  // Position management actions
  const updateObjectPosition = useCallback((elementId: string, position: Position) => {
    objectPositionsRef.current.set(elementId, position);
  }, []);

  const removeObjectPosition = useCallback((elementId: string) => {
    objectPositionsRef.current.delete(elementId);
  }, []);

  // Weighted random algorithm tracking actions
  const logRandomPick = useCallback(
    (picked: MovingObject) => {
      // Update random pick count for diminishing weights algorithm
      const currentCount = randomPickCountsRef.current.get(picked.image) || 0;
      const newCount = currentCount + 1;
      randomPickCountsRef.current.set(picked.image, newCount);

      // Log individual random pick
      const imageName = picked.image.split('/').pop() || 'unknown';
      const effectiveWeight = (picked.weight || 1) * Math.pow(DECAY_FACTOR, newCount);

      console.log(
        `🎲 Random Pick: ${imageName} (count: ${newCount}, effective weight: ${effectiveWeight.toFixed(6)})`,
      );

      // Show all current counts every 5 random picks
      const totalRandomPicks = Array.from(randomPickCountsRef.current.values()).reduce(
        (sum, count) => sum + count,
        0,
      );

      if (totalRandomPicks % 5 === 0) {
        console.log('\n📊 Current Weighted Algorithm Stats:');
        const allCounts = Array.from(randomPickCountsRef.current.entries()).map(
          ([image, count]) => {
            const base = initialMovingObjects.find((obj) => obj.image === image)?.weight || 1;
            return {
              image: image.split('/').pop() || 'unknown',
              count,
              effectiveWeight: base * Math.pow(DECAY_FACTOR, count),
            };
          },
        );
        console.table(allCounts);
        console.log(`Total random picks: ${totalRandomPicks}\n`);
      }
    },
    [initialMovingObjects],
  );

  const getRandomPickCounts = useCallback(() => randomPickCountsRef.current, []);

  // Assign a unique moving object (no duplicates on screen). Optionally prefer a specific object.
  const assignUniqueMovingObject = useCallback(
    (elementId: string, preferred?: MovingObject): MovingObject | null => {
      const alreadyAssigned = assignedImageByElementRef.current.get(elementId);
      if (alreadyAssigned) {
        const existing = initialMovingObjects.find((obj) => obj.image === alreadyAssigned) || null;
        return existing;
      }

      if (preferred) {
        if (isUniqueAssignmentEnabled) {
          if (!assignedImagesRef.current.has(preferred.image)) {
            assignedImageByElementRef.current.set(elementId, preferred.image);
            assignedImagesRef.current.add(preferred.image);
            logRandomPick(preferred);
            return preferred;
          }
        } else {
          assignedImageByElementRef.current.set(elementId, preferred.image);
          logRandomPick(preferred);
          return preferred;
        }
      }

      const candidates = isUniqueAssignmentEnabled
        ? initialMovingObjects.filter((obj) => !assignedImagesRef.current.has(obj.image))
        : initialMovingObjects;
      if (candidates.length === 0) return null;

      let chosen: MovingObject;
      try {
        chosen = selectWeightedRandom(candidates, randomPickCountsRef.current);
      } catch {
        chosen = candidates[0];
      }

      assignedImageByElementRef.current.set(elementId, chosen.image);
      if (isUniqueAssignmentEnabled) assignedImagesRef.current.add(chosen.image);
      logRandomPick(chosen);
      return chosen;
    },
    [initialMovingObjects, isUniqueAssignmentEnabled, logRandomPick],
  );

  const releaseAssignedMovingObject = useCallback((elementId: string) => {
    const image = assignedImageByElementRef.current.get(elementId);
    if (!image) return;
    assignedImageByElementRef.current.delete(elementId);
    assignedImagesRef.current.delete(image);
  }, []);

  // Context value
  const contextValue: MovingObjectsContextType = {
    // State
    movingObjectCount,
    objectPositions: objectPositionsRef.current,
    randomPickCounts: randomPickCountsRef.current,
    totalUniqueObjects: initialMovingObjects.length,
    isUniqueAssignmentEnabled,
    restrictedAreas,
    responsiveConfig,

    // Actions
    setMovingObjectCount,
    updateObjectPosition,
    removeObjectPosition,
    logRandomPick,
    getRandomPickCounts,
    setRestrictedAreas,
    setResponsiveConfig,
    assignUniqueMovingObject,
    releaseAssignedMovingObject,
    setUniqueAssignmentEnabled,
  };

  return (
    <MovingObjectsContext.Provider value={contextValue}>{children}</MovingObjectsContext.Provider>
  );
}
