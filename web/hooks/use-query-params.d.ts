/**
 * Modal State Query Parameters
 * Manages modal visibility and configuration via URL
 */
export declare const PRICING_MODAL_QUERY_PARAM = "pricing";
export declare const PRICING_MODAL_QUERY_VALUE = "open";
/**
 * Hook to manage pricing modal state via URL
 * @returns [isOpen, setIsOpen] - Tuple like useState
 *
 * @example
 * const [isOpen, setIsOpen] = usePricingModal()
 * setIsOpen(true) // Sets ?pricing=open
 * setIsOpen(false) // Removes ?pricing
 */
export declare function usePricingModal(): any;
/**
 * Hook to manage account setting modal state via URL
 * @returns [state, setState] - Object with isOpen + payload (tab) and setter
 *
 * @example
 * const [accountModalState, setAccountModalState] = useAccountSettingModal()
 * setAccountModalState({ payload: 'billing' }) // Sets ?action=showSettings&tab=billing
 * setAccountModalState(null) // Removes both params
 */
export declare function useAccountSettingModal<T extends string = string>(): readonly [{
    readonly isOpen: boolean;
    readonly payload: T | null;
}, any];
/**
 * Hook to manage plugin installation state via URL
 * @returns [installState, setInstallState] - installState includes parsed packageId and bundleInfo
 *
 * @example
 * const [installState, setInstallState] = usePluginInstallation()
 * setInstallState({ packageId: 'org/plugin' }) // Sets ?package-ids=["org/plugin"]
 * setInstallState({ bundleInfo: { org: 'org', name: 'bundle', version: '1.0.0' } }) // Sets ?bundle-info=...
 * setInstallState(null) // Clears installation params
 */
export declare function usePluginInstallation(): any;
/**
 * Utility to clear specific query parameters from URL
 * This is a client-side utility that should be called from client components
 *
 * @param keys - Single key or array of keys to remove from URL
 *
 * @example
 * // In a client component
 * clearQueryParams('param1')
 * clearQueryParams(['param1', 'param2'])
 */
export declare function clearQueryParams(keys: string | string[]): void;
