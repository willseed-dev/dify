"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_MODAL_QUERY_VALUE = exports.PRICING_MODAL_QUERY_PARAM = void 0;
exports.usePricingModal = usePricingModal;
exports.useAccountSettingModal = useAccountSettingModal;
exports.usePluginInstallation = usePluginInstallation;
exports.clearQueryParams = clearQueryParams;
/**
 * Centralized URL query parameter management hooks using nuqs
 *
 * This file provides type-safe, performant query parameter management
 * that doesn't trigger full page refreshes (shallow routing).
 *
 * Best practices from nuqs documentation:
 * - Use useQueryState for single parameters
 * - Use useQueryStates for multiple related parameters (atomic updates)
 * - Always provide parsers with defaults for type safety
 * - Use shallow routing to avoid unnecessary re-renders
 */
const nuqs_1 = require("nuqs");
const react_1 = require("react");
const constants_1 = require("@/app/components/header/account-setting/constants");
const client_1 = require("@/utils/client");
/**
 * Modal State Query Parameters
 * Manages modal visibility and configuration via URL
 */
exports.PRICING_MODAL_QUERY_PARAM = 'pricing';
exports.PRICING_MODAL_QUERY_VALUE = 'open';
const parseAsPricingModal = (0, nuqs_1.createParser)({
    parse: value => (value === exports.PRICING_MODAL_QUERY_VALUE ? true : null),
    serialize: value => (value ? exports.PRICING_MODAL_QUERY_VALUE : ''),
})
    .withDefault(false)
    .withOptions({ history: 'push' });
/**
 * Hook to manage pricing modal state via URL
 * @returns [isOpen, setIsOpen] - Tuple like useState
 *
 * @example
 * const [isOpen, setIsOpen] = usePricingModal()
 * setIsOpen(true) // Sets ?pricing=open
 * setIsOpen(false) // Removes ?pricing
 */
function usePricingModal() {
    return (0, nuqs_1.useQueryState)(exports.PRICING_MODAL_QUERY_PARAM, parseAsPricingModal);
}
/**
 * Hook to manage account setting modal state via URL
 * @returns [state, setState] - Object with isOpen + payload (tab) and setter
 *
 * @example
 * const [accountModalState, setAccountModalState] = useAccountSettingModal()
 * setAccountModalState({ payload: 'billing' }) // Sets ?action=showSettings&tab=billing
 * setAccountModalState(null) // Removes both params
 */
function useAccountSettingModal() {
    const [accountState, setAccountState] = (0, nuqs_1.useQueryStates)({
        action: nuqs_1.parseAsString,
        tab: nuqs_1.parseAsString,
    }, {
        history: 'replace',
    });
    const setState = (0, react_1.useCallback)((state) => {
        if (!state) {
            setAccountState({ action: null, tab: null }, { history: 'replace' });
            return;
        }
        const shouldPush = accountState.action !== constants_1.ACCOUNT_SETTING_MODAL_ACTION;
        setAccountState({ action: constants_1.ACCOUNT_SETTING_MODAL_ACTION, tab: state.payload }, { history: shouldPush ? 'push' : 'replace' });
    }, [accountState.action, setAccountState]);
    const isOpen = accountState.action === constants_1.ACCOUNT_SETTING_MODAL_ACTION;
    const currentTab = (isOpen ? accountState.tab : null);
    return [{ isOpen, payload: currentTab }, setState];
}
/**
 * Plugin Installation Query Parameters
 */
const PACKAGE_IDS_PARAM = 'package-ids';
const BUNDLE_INFO_PARAM = 'bundle-info';
const parseAsPackageId = (0, nuqs_1.createParser)({
    parse: (value) => {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                const first = parsed[0];
                return typeof first === 'string' ? first : null;
            }
            return value;
        }
        catch {
            return value;
        }
    },
    serialize: value => JSON.stringify([value]),
});
const parseAsBundleInfo = (0, nuqs_1.createParser)({
    parse: (value) => {
        try {
            const parsed = JSON.parse(value);
            if (parsed
                && typeof parsed.org === 'string'
                && typeof parsed.name === 'string'
                && typeof parsed.version === 'string') {
                return { org: parsed.org, name: parsed.name, version: parsed.version };
            }
        }
        catch {
            return null;
        }
        return null;
    },
    serialize: value => JSON.stringify(value),
});
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
function usePluginInstallation() {
    return (0, nuqs_1.useQueryStates)({
        packageId: parseAsPackageId,
        bundleInfo: parseAsBundleInfo,
    }, {
        urlKeys: {
            packageId: PACKAGE_IDS_PARAM,
            bundleInfo: BUNDLE_INFO_PARAM,
        },
    });
}
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
function clearQueryParams(keys) {
    if (client_1.isServer)
        return;
    const url = new URL(window.location.href);
    const keysArray = Array.isArray(keys) ? keys : [keys];
    keysArray.forEach(key => url.searchParams.delete(key));
    window.history.replaceState(null, '', url.toString());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXF1ZXJ5LXBhcmFtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1xdWVyeS1wYXJhbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBK0NaLDBDQUtDO0FBV0Qsd0RBOEJDO0FBMkRELHNEQWFDO0FBYUQsNENBVUM7QUExTEQ7Ozs7Ozs7Ozs7O0dBV0c7QUFFSCwrQkFLYTtBQUNiLGlDQUFtQztBQUNuQyxpRkFBZ0c7QUFDaEcsMkNBQXlDO0FBRXpDOzs7R0FHRztBQUNVLFFBQUEseUJBQXlCLEdBQUcsU0FBUyxDQUFBO0FBQ3JDLFFBQUEseUJBQXlCLEdBQUcsTUFBTSxDQUFBO0FBQy9DLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxtQkFBWSxFQUFVO0lBQ2hELEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLGlDQUF5QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNuRSxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUNBQXlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztDQUM3RCxDQUFDO0tBQ0MsV0FBVyxDQUFDLEtBQUssQ0FBQztLQUNsQixXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtBQUVuQzs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLGVBQWU7SUFDN0IsT0FBTyxJQUFBLG9CQUFhLEVBQ2xCLGlDQUF5QixFQUN6QixtQkFBbUIsQ0FDcEIsQ0FBQTtBQUNILENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLHNCQUFzQjtJQUNwQyxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLElBQUEscUJBQWMsRUFDcEQ7UUFDRSxNQUFNLEVBQUUsb0JBQWE7UUFDckIsR0FBRyxFQUFFLG9CQUFhO0tBQ25CLEVBQ0Q7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QTtJQUNiLENBQUM7SUFDRCxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztDQUMxQyxDQUFDLENBQUE7QUFFRjs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixxQkFBcUI7SUFDbkMsT0FBTyxJQUFBLHFCQUFjLEVBQ25CO1FBQ0UsU0FBUyxFQUFFLGdCQUFnQjtRQUMzQixVQUFVLEVBQUUsaUJBQWlCO0tBQzlCLEVBQ0Q7UUFDRSxPQUFPLEVBQUU7WUFDUCxTQUFTLEVBQUUsaUJBQWlCO1lBQzVCLFVBQVUsRUFBRSxpQkFBaUI7U0FDOUI7S0FDRixDQUNGLENBQUE7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLGdCQUFnQixDQUFDLElBQXVCO0lBQ3RELElBQUksaUJBQVE7UUFDVixPQUFNO0lBRVIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN6QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFckQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFdEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbi8qKlxuICogQ2VudHJhbGl6ZWQgVVJMIHF1ZXJ5IHBhcmFtZXRlciBtYW5hZ2VtZW50IGhvb2tzIHVzaW5nIG51cXNcbiAqXG4gKiBUaGlzIGZpbGUgcHJvdmlkZXMgdHlwZS1zYWZlLCBwZXJmb3JtYW50IHF1ZXJ5IHBhcmFtZXRlciBtYW5hZ2VtZW50XG4gKiB0aGF0IGRvZXNuJ3QgdHJpZ2dlciBmdWxsIHBhZ2UgcmVmcmVzaGVzIChzaGFsbG93IHJvdXRpbmcpLlxuICpcbiAqIEJlc3QgcHJhY3RpY2VzIGZyb20gbnVxcyBkb2N1bWVudGF0aW9uOlxuICogLSBVc2UgdXNlUXVlcnlTdGF0ZSBmb3Igc2luZ2xlIHBhcmFtZXRlcnNcbiAqIC0gVXNlIHVzZVF1ZXJ5U3RhdGVzIGZvciBtdWx0aXBsZSByZWxhdGVkIHBhcmFtZXRlcnMgKGF0b21pYyB1cGRhdGVzKVxuICogLSBBbHdheXMgcHJvdmlkZSBwYXJzZXJzIHdpdGggZGVmYXVsdHMgZm9yIHR5cGUgc2FmZXR5XG4gKiAtIFVzZSBzaGFsbG93IHJvdXRpbmcgdG8gYXZvaWQgdW5uZWNlc3NhcnkgcmUtcmVuZGVyc1xuICovXG5cbmltcG9ydCB7XG4gIGNyZWF0ZVBhcnNlcixcbiAgcGFyc2VBc1N0cmluZyxcbiAgdXNlUXVlcnlTdGF0ZSxcbiAgdXNlUXVlcnlTdGF0ZXMsXG59IGZyb20gJ251cXMnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQgeyBpc1NlcnZlciB9IGZyb20gJ0AvdXRpbHMvY2xpZW50J1xuXG4vKipcbiAqIE1vZGFsIFN0YXRlIFF1ZXJ5IFBhcmFtZXRlcnNcbiAqIE1hbmFnZXMgbW9kYWwgdmlzaWJpbGl0eSBhbmQgY29uZmlndXJhdGlvbiB2aWEgVVJMXG4gKi9cbmV4cG9ydCBjb25zdCBQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNID0gJ3ByaWNpbmcnXG5leHBvcnQgY29uc3QgUFJJQ0lOR19NT0RBTF9RVUVSWV9WQUxVRSA9ICdvcGVuJ1xuY29uc3QgcGFyc2VBc1ByaWNpbmdNb2RhbCA9IGNyZWF0ZVBhcnNlcjxib29sZWFuPih7XG4gIHBhcnNlOiB2YWx1ZSA9PiAodmFsdWUgPT09IFBSSUNJTkdfTU9EQUxfUVVFUllfVkFMVUUgPyB0cnVlIDogbnVsbCksXG4gIHNlcmlhbGl6ZTogdmFsdWUgPT4gKHZhbHVlID8gUFJJQ0lOR19NT0RBTF9RVUVSWV9WQUxVRSA6ICcnKSxcbn0pXG4gIC53aXRoRGVmYXVsdChmYWxzZSlcbiAgLndpdGhPcHRpb25zKHsgaGlzdG9yeTogJ3B1c2gnIH0pXG5cbi8qKlxuICogSG9vayB0byBtYW5hZ2UgcHJpY2luZyBtb2RhbCBzdGF0ZSB2aWEgVVJMXG4gKiBAcmV0dXJucyBbaXNPcGVuLCBzZXRJc09wZW5dIC0gVHVwbGUgbGlrZSB1c2VTdGF0ZVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gdXNlUHJpY2luZ01vZGFsKClcbiAqIHNldElzT3Blbih0cnVlKSAvLyBTZXRzID9wcmljaW5nPW9wZW5cbiAqIHNldElzT3BlbihmYWxzZSkgLy8gUmVtb3ZlcyA/cHJpY2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlUHJpY2luZ01vZGFsKCkge1xuICByZXR1cm4gdXNlUXVlcnlTdGF0ZShcbiAgICBQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNLFxuICAgIHBhcnNlQXNQcmljaW5nTW9kYWwsXG4gIClcbn1cblxuLyoqXG4gKiBIb29rIHRvIG1hbmFnZSBhY2NvdW50IHNldHRpbmcgbW9kYWwgc3RhdGUgdmlhIFVSTFxuICogQHJldHVybnMgW3N0YXRlLCBzZXRTdGF0ZV0gLSBPYmplY3Qgd2l0aCBpc09wZW4gKyBwYXlsb2FkICh0YWIpIGFuZCBzZXR0ZXJcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgW2FjY291bnRNb2RhbFN0YXRlLCBzZXRBY2NvdW50TW9kYWxTdGF0ZV0gPSB1c2VBY2NvdW50U2V0dGluZ01vZGFsKClcbiAqIHNldEFjY291bnRNb2RhbFN0YXRlKHsgcGF5bG9hZDogJ2JpbGxpbmcnIH0pIC8vIFNldHMgP2FjdGlvbj1zaG93U2V0dGluZ3MmdGFiPWJpbGxpbmdcbiAqIHNldEFjY291bnRNb2RhbFN0YXRlKG51bGwpIC8vIFJlbW92ZXMgYm90aCBwYXJhbXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFjY291bnRTZXR0aW5nTW9kYWw8VCBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4oKSB7XG4gIGNvbnN0IFthY2NvdW50U3RhdGUsIHNldEFjY291bnRTdGF0ZV0gPSB1c2VRdWVyeVN0YXRlcyhcbiAgICB7XG4gICAgICBhY3Rpb246IHBhcnNlQXNTdHJpbmcsXG4gICAgICB0YWI6IHBhcnNlQXNTdHJpbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICBoaXN0b3J5OiAncmVwbGFjZScsXG4gICAgfSxcbiAgKVxuXG4gIGNvbnN0IHNldFN0YXRlID0gdXNlQ2FsbGJhY2soXG4gICAgKHN0YXRlOiB7IHBheWxvYWQ6IFQgfSB8IG51bGwpID0+IHtcbiAgICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgc2V0QWNjb3VudFN0YXRlKHsgYWN0aW9uOiBudWxsLCB0YWI6IG51bGwgfSwgeyBoaXN0b3J5OiAncmVwbGFjZScgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBzaG91bGRQdXNoID0gYWNjb3VudFN0YXRlLmFjdGlvbiAhPT0gQUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTlxuICAgICAgc2V0QWNjb3VudFN0YXRlKFxuICAgICAgICB7IGFjdGlvbjogQUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTiwgdGFiOiBzdGF0ZS5wYXlsb2FkIH0sXG4gICAgICAgIHsgaGlzdG9yeTogc2hvdWxkUHVzaCA/ICdwdXNoJyA6ICdyZXBsYWNlJyB9LFxuICAgICAgKVxuICAgIH0sXG4gICAgW2FjY291bnRTdGF0ZS5hY3Rpb24sIHNldEFjY291bnRTdGF0ZV0sXG4gIClcblxuICBjb25zdCBpc09wZW4gPSBhY2NvdW50U3RhdGUuYWN0aW9uID09PSBBQ0NPVU5UX1NFVFRJTkdfTU9EQUxfQUNUSU9OXG4gIGNvbnN0IGN1cnJlbnRUYWIgPSAoaXNPcGVuID8gYWNjb3VudFN0YXRlLnRhYiA6IG51bGwpIGFzIFQgfCBudWxsXG5cbiAgcmV0dXJuIFt7IGlzT3BlbiwgcGF5bG9hZDogY3VycmVudFRhYiB9LCBzZXRTdGF0ZV0gYXMgY29uc3Rcbn1cblxuLyoqXG4gKiBQbHVnaW4gSW5zdGFsbGF0aW9uIFF1ZXJ5IFBhcmFtZXRlcnNcbiAqL1xuY29uc3QgUEFDS0FHRV9JRFNfUEFSQU0gPSAncGFja2FnZS1pZHMnXG5jb25zdCBCVU5ETEVfSU5GT19QQVJBTSA9ICdidW5kbGUtaW5mbydcbnR5cGUgQnVuZGxlSW5mb1F1ZXJ5ID0ge1xuICBvcmc6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgdmVyc2lvbjogc3RyaW5nXG59XG5cbmNvbnN0IHBhcnNlQXNQYWNrYWdlSWQgPSBjcmVhdGVQYXJzZXI8c3RyaW5nPih7XG4gIHBhcnNlOiAodmFsdWUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkpIHtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBwYXJzZWRbMF1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBmaXJzdCA9PT0gJ3N0cmluZycgPyBmaXJzdCA6IG51bGxcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH0sXG4gIHNlcmlhbGl6ZTogdmFsdWUgPT4gSlNPTi5zdHJpbmdpZnkoW3ZhbHVlXSksXG59KVxuXG5jb25zdCBwYXJzZUFzQnVuZGxlSW5mbyA9IGNyZWF0ZVBhcnNlcjxCdW5kbGVJbmZvUXVlcnk+KHtcbiAgcGFyc2U6ICh2YWx1ZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHZhbHVlKSBhcyBQYXJ0aWFsPEJ1bmRsZUluZm9RdWVyeT5cbiAgICAgIGlmIChwYXJzZWRcbiAgICAgICAgJiYgdHlwZW9mIHBhcnNlZC5vcmcgPT09ICdzdHJpbmcnXG4gICAgICAgICYmIHR5cGVvZiBwYXJzZWQubmFtZSA9PT0gJ3N0cmluZydcbiAgICAgICAgJiYgdHlwZW9mIHBhcnNlZC52ZXJzaW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4geyBvcmc6IHBhcnNlZC5vcmcsIG5hbWU6IHBhcnNlZC5uYW1lLCB2ZXJzaW9uOiBwYXJzZWQudmVyc2lvbiB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH0sXG4gIHNlcmlhbGl6ZTogdmFsdWUgPT4gSlNPTi5zdHJpbmdpZnkodmFsdWUpLFxufSlcblxuLyoqXG4gKiBIb29rIHRvIG1hbmFnZSBwbHVnaW4gaW5zdGFsbGF0aW9uIHN0YXRlIHZpYSBVUkxcbiAqIEByZXR1cm5zIFtpbnN0YWxsU3RhdGUsIHNldEluc3RhbGxTdGF0ZV0gLSBpbnN0YWxsU3RhdGUgaW5jbHVkZXMgcGFyc2VkIHBhY2thZ2VJZCBhbmQgYnVuZGxlSW5mb1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBbaW5zdGFsbFN0YXRlLCBzZXRJbnN0YWxsU3RhdGVdID0gdXNlUGx1Z2luSW5zdGFsbGF0aW9uKClcbiAqIHNldEluc3RhbGxTdGF0ZSh7IHBhY2thZ2VJZDogJ29yZy9wbHVnaW4nIH0pIC8vIFNldHMgP3BhY2thZ2UtaWRzPVtcIm9yZy9wbHVnaW5cIl1cbiAqIHNldEluc3RhbGxTdGF0ZSh7IGJ1bmRsZUluZm86IHsgb3JnOiAnb3JnJywgbmFtZTogJ2J1bmRsZScsIHZlcnNpb246ICcxLjAuMCcgfSB9KSAvLyBTZXRzID9idW5kbGUtaW5mbz0uLi5cbiAqIHNldEluc3RhbGxTdGF0ZShudWxsKSAvLyBDbGVhcnMgaW5zdGFsbGF0aW9uIHBhcmFtc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlUGx1Z2luSW5zdGFsbGF0aW9uKCkge1xuICByZXR1cm4gdXNlUXVlcnlTdGF0ZXMoXG4gICAge1xuICAgICAgcGFja2FnZUlkOiBwYXJzZUFzUGFja2FnZUlkLFxuICAgICAgYnVuZGxlSW5mbzogcGFyc2VBc0J1bmRsZUluZm8sXG4gICAgfSxcbiAgICB7XG4gICAgICB1cmxLZXlzOiB7XG4gICAgICAgIHBhY2thZ2VJZDogUEFDS0FHRV9JRFNfUEFSQU0sXG4gICAgICAgIGJ1bmRsZUluZm86IEJVTkRMRV9JTkZPX1BBUkFNLFxuICAgICAgfSxcbiAgICB9LFxuICApXG59XG5cbi8qKlxuICogVXRpbGl0eSB0byBjbGVhciBzcGVjaWZpYyBxdWVyeSBwYXJhbWV0ZXJzIGZyb20gVVJMXG4gKiBUaGlzIGlzIGEgY2xpZW50LXNpZGUgdXRpbGl0eSB0aGF0IHNob3VsZCBiZSBjYWxsZWQgZnJvbSBjbGllbnQgY29tcG9uZW50c1xuICpcbiAqIEBwYXJhbSBrZXlzIC0gU2luZ2xlIGtleSBvciBhcnJheSBvZiBrZXlzIHRvIHJlbW92ZSBmcm9tIFVSTFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBJbiBhIGNsaWVudCBjb21wb25lbnRcbiAqIGNsZWFyUXVlcnlQYXJhbXMoJ3BhcmFtMScpXG4gKiBjbGVhclF1ZXJ5UGFyYW1zKFsncGFyYW0xJywgJ3BhcmFtMiddKVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJRdWVyeVBhcmFtcyhrZXlzOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICBpZiAoaXNTZXJ2ZXIpXG4gICAgcmV0dXJuXG5cbiAgY29uc3QgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgY29uc3Qga2V5c0FycmF5ID0gQXJyYXkuaXNBcnJheShrZXlzKSA/IGtleXMgOiBba2V5c11cblxuICBrZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4gdXJsLnNlYXJjaFBhcmFtcy5kZWxldGUoa2V5KSlcblxuICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIHVybC50b1N0cmluZygpKVxufVxuIl19