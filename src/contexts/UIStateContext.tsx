import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MovingObject } from '../types/MovingObject';
import { useMovingObjects } from './MovingObjectsContext';
import { trackCtaClick, trackModalOpen } from '../utils/analytics';
import { selectWeightedRandom } from '../utils/weightedSelection';

/**
 * UI State interface
 */
interface UIState {
  // Modal state
  showPopup: boolean;
  activeMovingObject: MovingObject | null;
}

/**
 * UI Actions interface
 */
interface UIActions {
  // Modal actions
  openPopup: (movingObject: MovingObject) => void;
  closePopup: () => void;

  // Convenience actions
  openHeaderPopup: () => void;
}

/**
 * Combined UI context interface
 */
interface UIStateContextType extends UIState, UIActions {}

/**
 * React Context for UI state
 */
const UIStateContext = createContext<UIStateContextType | null>(null);

/**
 * Hook to access UI state context
 * @throws Error if used outside of UIStateProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useUIState(): UIStateContextType {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}

/**
 * Props for UIStateProvider
 */
interface UIStateProviderProps {
  children: ReactNode;
  movingObjects: MovingObject[];
  headerMovingObject?: MovingObject | null;
}

/**
 * Provider component for UI state management
 */
export function UIStateProvider({
  children,
  movingObjects,
  headerMovingObject,
}: UIStateProviderProps): JSX.Element {
  // State management
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [activeMovingObject, setActiveMovingObject] = useState<MovingObject | null>(null);
  const { getRandomPickCounts } = useMovingObjects();

  // Actions
  const openPopup = useCallback((movingObject: MovingObject) => {
    setActiveMovingObject(movingObject);
    setShowPopup(true);
  }, []);

  const closePopup = useCallback(() => {
    setShowPopup(false);
    // Delay clearing the active object to allow for exit animations
    setTimeout(() => setActiveMovingObject(null), 300);
  }, []);

  const openHeaderPopup = useCallback(() => {
    if (headerMovingObject) {
      openPopup(headerMovingObject);
      trackModalOpen({
        context: 'header',
        objectImage: headerMovingObject.image,
        hasTickets: !!headerMovingObject.ticketsLink,
        hasLocation: !!headerMovingObject.location,
      });
      return;
    }
    const selectionCounts = getRandomPickCounts();
    const candidates = movingObjects && movingObjects.length > 0 ? movingObjects : [];
    if (candidates.length === 0) return;
    const chosen = selectWeightedRandom(candidates, selectionCounts);

    if (chosen.formLink) {
      const base = ((import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ||
        '/') as string;
      const socioPath = `${base}socio`;
      trackCtaClick({
        context: 'header',
        ctaType: 'form_link',
        linkUrl: socioPath,
      });
      window.location.assign(socioPath);
      return;
    }

    openPopup(chosen);
    trackModalOpen({
      context: 'header',
      objectImage: chosen.image,
      hasTickets: !!chosen.ticketsLink,
      hasLocation: !!chosen.location,
    });
  }, [getRandomPickCounts, movingObjects, openPopup, headerMovingObject]);

  // Context value
  const contextValue: UIStateContextType = {
    // State
    showPopup,
    activeMovingObject,

    // Actions
    openPopup,
    closePopup,
    openHeaderPopup,
  };

  return <UIStateContext.Provider value={contextValue}>{children}</UIStateContext.Provider>;
}
