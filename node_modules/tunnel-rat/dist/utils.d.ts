import React from 'react';
/**
 * An SSR-friendly useLayoutEffect.
 *
 * React currently throws a warning when using useLayoutEffect on the server.
 * To get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect elsewhere.
 *
 * @see https://github.com/facebook/react/issues/14927
 */
export declare const useIsomorphicLayoutEffect: typeof React.useLayoutEffect;
export declare function useMutableCallback<T>(fn: T): React.MutableRefObject<T>;
