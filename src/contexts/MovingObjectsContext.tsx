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
  selectionCounts: Map<string, number>;

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

  // Selection tracking
  logSelection: (movingObject: MovingObject) => void;
  getSelectionCounts: () => Map<string, number>;

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
  const selectionCountsRef = useRef<Map<string, number>>(new Map());

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

  // Selection tracking actions
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
              (initialMovingObjects.find((obj) => obj.image === image)
                ?.weight || 1) /
              (count + 1),
          }),
        );
        console.table(allCounts);
        console.log(`Total selections: ${totalSelections}\n`);
      }
    },
    [initialMovingObjects],
  );

  const getSelectionCounts = useCallback(() => selectionCountsRef.current, []);

  // Context value
  const contextValue: MovingObjectsContextType = {
    // State
    movingObjectCount,
    objectPositions: objectPositionsRef.current,
    selectionCounts: selectionCountsRef.current,
    restrictedAreas,
    responsiveConfig,

    // Actions
    setMovingObjectCount,
    updateObjectPosition,
    removeObjectPosition,
    logSelection,
    getSelectionCounts,
    setRestrictedAreas,
    setResponsiveConfig,
  };

  return (
    <MovingObjectsContext.Provider value={contextValue}>
      {children}
    </MovingObjectsContext.Provider>
  );
}
