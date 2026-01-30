import type { ReactNode } from 'react';
import * as React from 'react';
/**
 * Hook to use the GotoAnything context
 */
export declare const useGotoAnythingContext: () => any;
type GotoAnythingProviderProps = {
    children: ReactNode;
};
/**
 * Provider component for GotoAnything context
 */
export declare const GotoAnythingProvider: React.FC<GotoAnythingProviderProps>;
export {};
