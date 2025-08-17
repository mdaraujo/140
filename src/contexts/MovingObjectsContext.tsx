import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { MovingObject } from '../types/MovingObject';
import { Position } from '../types/Position';
import { ResponsiveConfig } from '../types/ResponsiveConfig';

/**
 * State interface for moving objects management
 */
interface MovingObjectsState {
  // Object management
  movingObjectCount: number;
  objectPositions: Map<string, Position>;
  randomPickCounts: Map<string, number>;

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
interface MovingObjectsContextType
  extends MovingObjectsState,
    MovingObjectsActions {}

/**
 * React Context for moving objects state
 */
const MovingObjectsContext = createContext<MovingObjectsContextType | null>(
  null,
);

/**
 * Hook to access moving objects context
 * @throws Error if used outside of MovingObjectsProvider
 */
export function useMovingObjects(): MovingObjectsContextType {
  const context = useContext(MovingObjectsContext);
  if (!context) {
    throw new Error(
      'useMovingObjects must be used within a MovingObjectsProvider',
    );
  }
  return context;
}

/**
 * Props for MovingObjectsProvider
 */
interface MovingObjectsProviderProps {
  children: ReactNode;
  initialMovingObjects: MovingObject[];
}

/**
 * Provider component for moving objects state management
 */
export function MovingObjectsProvider({
  children,
  initialMovingObjects,
}: MovingObjectsProviderProps): JSX.Element {
  // State management
  const [movingObjectCount, setMovingObjectCount] = useState<number>(1);
  const [restrictedAreas, setRestrictedAreas] = useState<DOMRect[]>([]);
  const [responsiveConfig, setResponsiveConfig] =
    useState<ResponsiveConfig | null>(null);

  // Refs for performance (avoid re-renders on position updates)
  const objectPositionsRef = useRef<Map<string, Position>>(new Map());
  const randomPickCountsRef = useRef<Map<string, number>>(new Map());

  // Position management actions
  const updateObjectPosition = useCallback(
    (elementId: string, position: Position) => {
      objectPositionsRef.current.set(elementId, position);
    },
    [],
  );

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
      const effectiveWeight = (picked.weight || 1) / newCount;

      console.log(
        `🎲 Random Pick: ${imageName} (count: ${newCount}, effective weight: ${effectiveWeight.toFixed(2)})`,
      );

      // Show all current counts every 5 random picks
      const totalRandomPicks = Array.from(
        randomPickCountsRef.current.values(),
      ).reduce((sum, count) => sum + count, 0);

      if (totalRandomPicks % 5 === 0) {
        console.log('\n📊 Current Weighted Algorithm Stats:');
        const allCounts = Array.from(randomPickCountsRef.current.entries()).map(
          ([image, count]) => ({
            image: image.split('/').pop() || 'unknown',
            count,
            effectiveWeight:
              (initialMovingObjects.find((obj) => obj.image === image)
                ?.weight || 1) /
              (count + 1),
          }),
        );
        console.table(allCounts);
        console.log(`Total random picks: ${totalRandomPicks}\n`);
      }
    },
    [initialMovingObjects],
  );

  const getRandomPickCounts = useCallback(
    () => randomPickCountsRef.current,
    [],
  );

  // Context value
  const contextValue: MovingObjectsContextType = {
    // State
    movingObjectCount,
    objectPositions: objectPositionsRef.current,
    randomPickCounts: randomPickCountsRef.current,
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
  };

  return (
    <MovingObjectsContext.Provider value={contextValue}>
      {children}
    </MovingObjectsContext.Provider>
  );
}
