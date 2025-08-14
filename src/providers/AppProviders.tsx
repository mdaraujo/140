import { ReactNode } from 'react';
import { MovingObjectsProvider } from '../contexts/MovingObjectsContext';
import { UIStateProvider } from '../contexts/UIStateContext';
import { movingObjects, eAgoraObject } from '../data/movingObjects';

/**
 * Props for AppProviders
 */
interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers component that wraps the entire application
 * with all necessary context providers
 */
export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <MovingObjectsProvider initialMovingObjects={movingObjects}>
      <UIStateProvider headerObject={eAgoraObject}>{children}</UIStateProvider>
    </MovingObjectsProvider>
  );
}
