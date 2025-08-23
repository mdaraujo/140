import { ReactNode } from 'react';

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
  return <>{children}</>;
}
