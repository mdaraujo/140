export function isPositionDebugEnabled(): boolean {
  const meta = import.meta as unknown as { env?: { VITE_DEBUG_POSITION_LOGS?: string } };
  return meta?.env?.VITE_DEBUG_POSITION_LOGS === 'true';
}
