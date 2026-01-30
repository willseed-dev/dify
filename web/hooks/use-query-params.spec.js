"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const testing_1 = require("nuqs/adapters/testing");
const constants_1 = require("@/app/components/header/account-setting/constants");
const use_query_params_1 = require("./use-query-params");
// Mock isServer to allow runtime control in tests
const mockIsServer = vi.hoisted(() => ({ value: false }));
vi.mock('@/utils/client', () => ({
    get isServer() { return mockIsServer.value; },
    get isClient() { return !mockIsServer.value; },
}));
const renderWithAdapter = (hook, searchParams = '') => {
    const onUrlUpdate = vi.fn();
    const wrapper = ({ children }) => (<testing_1.NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate}>
      {children}
    </testing_1.NuqsTestingAdapter>);
    const { result } = (0, react_1.renderHook)(hook, { wrapper });
    return { result, onUrlUpdate };
};
// Query param hooks: defaults, parsing, and URL sync behavior.
describe('useQueryParams hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Pricing modal query behavior.
    describe('usePricingModal', () => {
        it('should return closed state when query param is missing', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)());
            // Act
            const [isOpen] = result.current;
            // Assert
            expect(isOpen).toBe(false);
        });
        it('should return open state when query param matches open value', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)(), `?${use_query_params_1.PRICING_MODAL_QUERY_PARAM}=${use_query_params_1.PRICING_MODAL_QUERY_VALUE}`);
            // Act
            const [isOpen] = result.current;
            // Assert
            expect(isOpen).toBe(true);
        });
        it('should return closed state when query param has unexpected value', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)(), `?${use_query_params_1.PRICING_MODAL_QUERY_PARAM}=closed`);
            // Act
            const [isOpen] = result.current;
            // Assert
            expect(isOpen).toBe(false);
        });
        it('should set pricing param when opening', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)());
            // Act
            (0, react_1.act)(() => {
                result.current[1](true);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get(use_query_params_1.PRICING_MODAL_QUERY_PARAM)).toBe(use_query_params_1.PRICING_MODAL_QUERY_VALUE);
        });
        it('should use push history when opening', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)());
            // Act
            (0, react_1.act)(() => {
                result.current[1](true);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('push');
        });
        it('should clear pricing param when closing', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)(), `?${use_query_params_1.PRICING_MODAL_QUERY_PARAM}=${use_query_params_1.PRICING_MODAL_QUERY_VALUE}`);
            // Act
            (0, react_1.act)(() => {
                result.current[1](false);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.has(use_query_params_1.PRICING_MODAL_QUERY_PARAM)).toBe(false);
        });
        it('should use push history when closing', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)(), `?${use_query_params_1.PRICING_MODAL_QUERY_PARAM}=${use_query_params_1.PRICING_MODAL_QUERY_VALUE}`);
            // Act
            (0, react_1.act)(() => {
                result.current[1](false);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('push');
        });
        it('should respect explicit history options when provided', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePricingModal)());
            // Act
            (0, react_1.act)(() => {
                result.current[1](true, { history: 'replace' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('replace');
        });
    });
    // Account settings modal query behavior.
    describe('useAccountSettingModal', () => {
        it('should return closed state with null payload when query params are missing', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)());
            // Act
            const [state] = result.current;
            // Assert
            expect(state.isOpen).toBe(false);
            expect(state.payload).toBeNull();
        });
        it('should return open state when action matches', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), `?action=${constants_1.ACCOUNT_SETTING_MODAL_ACTION}&tab=billing`);
            // Act
            const [state] = result.current;
            // Assert
            expect(state.isOpen).toBe(true);
            expect(state.payload).toBe('billing');
        });
        it('should return closed state when action does not match', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), '?action=other&tab=billing');
            // Act
            const [state] = result.current;
            // Assert
            expect(state.isOpen).toBe(false);
            expect(state.payload).toBeNull();
        });
        it('should set action and tab when opening', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)());
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ payload: 'members' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get('action')).toBe(constants_1.ACCOUNT_SETTING_MODAL_ACTION);
            expect(update.searchParams.get('tab')).toBe('members');
        });
        it('should use push history when opening from closed state', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)());
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ payload: 'members' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('push');
        });
        it('should update tab when switching while open', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), `?action=${constants_1.ACCOUNT_SETTING_MODAL_ACTION}&tab=billing`);
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ payload: 'provider' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get('tab')).toBe('provider');
        });
        it('should use replace history when switching tabs while open', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), `?action=${constants_1.ACCOUNT_SETTING_MODAL_ACTION}&tab=billing`);
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ payload: 'provider' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('replace');
        });
        it('should clear action and tab when closing', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), `?action=${constants_1.ACCOUNT_SETTING_MODAL_ACTION}&tab=billing`);
            // Act
            (0, react_1.act)(() => {
                result.current[1](null);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.has('action')).toBe(false);
            expect(update.searchParams.has('tab')).toBe(false);
        });
        it('should use replace history when closing', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.useAccountSettingModal)(), `?action=${constants_1.ACCOUNT_SETTING_MODAL_ACTION}&tab=billing`);
            // Act
            (0, react_1.act)(() => {
                result.current[1](null);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.options.history).toBe('replace');
        });
    });
    // Plugin installation query behavior.
    describe('usePluginInstallation', () => {
        it('should parse package ids from JSON arrays', () => {
            // Arrange
            const bundleInfo = { org: 'org', name: 'bundle', version: '1.0.0' };
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)(), `?package-ids=%5B%22org%2Fplugin%22%5D&bundle-info=${encodeURIComponent(JSON.stringify(bundleInfo))}`);
            // Act
            const [state] = result.current;
            // Assert
            expect(state.packageId).toBe('org/plugin');
            expect(state.bundleInfo).toEqual(bundleInfo);
        });
        it('should return raw package id when JSON parsing fails', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)(), '?package-ids=org/plugin');
            // Act
            const [state] = result.current;
            // Assert
            expect(state.packageId).toBe('org/plugin');
        });
        it('should return raw package id when JSON is not an array', () => {
            // Arrange
            const { result } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)(), '?package-ids=%22org%2Fplugin%22');
            // Act
            const [state] = result.current;
            // Assert
            expect(state.packageId).toBe('"org/plugin"');
        });
        it('should write package ids as JSON arrays when setting packageId', async () => {
            // Arrange
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)());
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ packageId: 'org/plugin' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get('package-ids')).toBe('["org/plugin"]');
        });
        it('should set bundle info when provided', async () => {
            // Arrange
            const bundleInfo = { org: 'org', name: 'bundle', version: '1.0.0' };
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)());
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ bundleInfo });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get('bundle-info')).toBe(JSON.stringify(bundleInfo));
        });
        it('should clear installation params when state is null', async () => {
            // Arrange
            const bundleInfo = { org: 'org', name: 'bundle', version: '1.0.0' };
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)(), `?package-ids=%5B%22org%2Fplugin%22%5D&bundle-info=${encodeURIComponent(JSON.stringify(bundleInfo))}`);
            // Act
            (0, react_1.act)(() => {
                result.current[1](null);
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.has('package-ids')).toBe(false);
            expect(update.searchParams.has('bundle-info')).toBe(false);
        });
        it('should preserve bundle info when only packageId is updated', async () => {
            // Arrange
            const bundleInfo = { org: 'org', name: 'bundle', version: '1.0.0' };
            const { result, onUrlUpdate } = renderWithAdapter(() => (0, use_query_params_1.usePluginInstallation)(), `?bundle-info=${encodeURIComponent(JSON.stringify(bundleInfo))}`);
            // Act
            (0, react_1.act)(() => {
                result.current[1]({ packageId: 'org/plugin' });
            });
            // Assert
            await (0, react_1.waitFor)(() => expect(onUrlUpdate).toHaveBeenCalled());
            const update = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
            expect(update.searchParams.get('bundle-info')).toBe(JSON.stringify(bundleInfo));
        });
    });
});
// Utility to clear query params from the current URL.
describe('clearQueryParams', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.history.replaceState(null, '', '/');
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        mockIsServer.value = false;
    });
    it('should remove a single key when provided one key', () => {
        // Arrange
        const replaceSpy = vi.spyOn(window.history, 'replaceState');
        window.history.pushState(null, '', '/?foo=1&bar=2');
        // Act
        (0, use_query_params_1.clearQueryParams)('foo');
        // Assert
        expect(replaceSpy).toHaveBeenCalled();
        const params = new URLSearchParams(window.location.search);
        expect(params.has('foo')).toBe(false);
        expect(params.get('bar')).toBe('2');
        replaceSpy.mockRestore();
    });
    it('should remove multiple keys when provided an array', () => {
        // Arrange
        const replaceSpy = vi.spyOn(window.history, 'replaceState');
        window.history.pushState(null, '', '/?foo=1&bar=2&baz=3');
        // Act
        (0, use_query_params_1.clearQueryParams)(['foo', 'baz']);
        // Assert
        expect(replaceSpy).toHaveBeenCalled();
        const params = new URLSearchParams(window.location.search);
        expect(params.has('foo')).toBe(false);
        expect(params.has('baz')).toBe(false);
        expect(params.get('bar')).toBe('2');
        replaceSpy.mockRestore();
    });
    it('should no-op when running on server', () => {
        // Arrange
        const replaceSpy = vi.spyOn(window.history, 'replaceState');
        mockIsServer.value = true;
        // Act
        (0, use_query_params_1.clearQueryParams)('foo');
        // Assert
        expect(replaceSpy).not.toHaveBeenCalled();
        replaceSpy.mockRestore();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXF1ZXJ5LXBhcmFtcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXF1ZXJ5LXBhcmFtcy5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtEQUFpRTtBQUNqRSxtREFBMEQ7QUFDMUQsaUZBQWdHO0FBQ2hHLHlEQU8yQjtBQUUzQixrREFBa0Q7QUFDbEQsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN6RCxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsSUFBSSxRQUFRLEtBQUssT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztJQUM1QyxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7Q0FDOUMsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLGlCQUFpQixHQUFHLENBQUssSUFBYSxFQUFFLFlBQVksR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUNqRSxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFtQyxDQUFBO0lBQzVELE1BQU0sT0FBTyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQTJCLEVBQUUsRUFBRSxDQUFDLENBQ3pELENBQUMsNEJBQWtCLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQ3ZFO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLDRCQUFrQixDQUFDLENBQ3RCLENBQUE7SUFDRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDaEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxX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QTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBVcmxVcGRhdGVFdmVudCB9IGZyb20gJ251cXMvYWRhcHRlcnMvdGVzdGluZydcbmltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBhY3QsIHJlbmRlckhvb2ssIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgTnVxc1Rlc3RpbmdBZGFwdGVyIH0gZnJvbSAnbnVxcy9hZGFwdGVycy90ZXN0aW5nJ1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQge1xuICBjbGVhclF1ZXJ5UGFyYW1zLFxuICBQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNLFxuICBQUklDSU5HX01PREFMX1FVRVJZX1ZBTFVFLFxuICB1c2VBY2NvdW50U2V0dGluZ01vZGFsLFxuICB1c2VQbHVnaW5JbnN0YWxsYXRpb24sXG4gIHVzZVByaWNpbmdNb2RhbCxcbn0gZnJvbSAnLi91c2UtcXVlcnktcGFyYW1zJ1xuXG4vLyBNb2NrIGlzU2VydmVyIHRvIGFsbG93IHJ1bnRpbWUgY29udHJvbCBpbiB0ZXN0c1xuY29uc3QgbW9ja0lzU2VydmVyID0gdmkuaG9pc3RlZCgoKSA9PiAoeyB2YWx1ZTogZmFsc2UgfSkpXG52aS5tb2NrKCdAL3V0aWxzL2NsaWVudCcsICgpID0+ICh7XG4gIGdldCBpc1NlcnZlcigpIHsgcmV0dXJuIG1vY2tJc1NlcnZlci52YWx1ZSB9LFxuICBnZXQgaXNDbGllbnQoKSB7IHJldHVybiAhbW9ja0lzU2VydmVyLnZhbHVlIH0sXG59KSlcblxuY29uc3QgcmVuZGVyV2l0aEFkYXB0ZXIgPSA8VCw+KGhvb2s6ICgpID0+IFQsIHNlYXJjaFBhcmFtcyA9ICcnKSA9PiB7XG4gIGNvbnN0IG9uVXJsVXBkYXRlID0gdmkuZm48KGV2ZW50OiBVcmxVcGRhdGVFdmVudCkgPT4gdm9pZD4oKVxuICBjb25zdCB3cmFwcGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3ROb2RlIH0pID0+IChcbiAgICA8TnVxc1Rlc3RpbmdBZGFwdGVyIHNlYXJjaFBhcmFtcz17c2VhcmNoUGFyYW1zfSBvblVybFVwZGF0ZT17b25VcmxVcGRhdGV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvTnVxc1Rlc3RpbmdBZGFwdGVyPlxuICApXG4gIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKGhvb2ssIHsgd3JhcHBlciB9KVxuICByZXR1cm4geyByZXN1bHQsIG9uVXJsVXBkYXRlIH1cbn1cblxuLy8gUXVlcnkgcGFyYW0gaG9va3M6IGRlZmF1bHRzLCBwYXJzaW5nLCBhbmQgVVJMIHN5bmMgYmVoYXZpb3IuXG5kZXNjcmliZSgndXNlUXVlcnlQYXJhbXMgaG9va3MnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFByaWNpbmcgbW9kYWwgcXVlcnkgYmVoYXZpb3IuXG4gIGRlc2NyaWJlKCd1c2VQcmljaW5nTW9kYWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY2xvc2VkIHN0YXRlIHdoZW4gcXVlcnkgcGFyYW0gaXMgbWlzc2luZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJXaXRoQWRhcHRlcigoKSA9PiB1c2VQcmljaW5nTW9kYWwoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBbaXNPcGVuXSA9IHJlc3VsdC5jdXJyZW50XG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGlzT3BlbikudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gb3BlbiBzdGF0ZSB3aGVuIHF1ZXJ5IHBhcmFtIG1hdGNoZXMgb3BlbiB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJXaXRoQWRhcHRlcihcbiAgICAgICAgKCkgPT4gdXNlUHJpY2luZ01vZGFsKCksXG4gICAgICAgIGA/JHtQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNfT0ke1BSSUNJTkdfTU9EQUxfUVVFUllfVkFMVUV9YCxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBbaXNPcGVuXSA9IHJlc3VsdC5jdXJyZW50XG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGlzT3BlbikudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjbG9zZWQgc3RhdGUgd2hlbiBxdWVyeSBwYXJhbSBoYXMgdW5leHBlY3RlZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJXaXRoQWRhcHRlcihcbiAgICAgICAgKCkgPT4gdXNlUHJpY2luZ01vZGFsKCksXG4gICAgICAgIGA/JHtQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNfT1jbG9zZWRgLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IFtpc09wZW5dID0gcmVzdWx0LmN1cnJlbnRcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaXNPcGVuKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBwcmljaW5nIHBhcmFtIHdoZW4gb3BlbmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoKCkgPT4gdXNlUHJpY2luZ01vZGFsKCkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnRbMV0odHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiBleHBlY3Qob25VcmxVcGRhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKSlcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IG9uVXJsVXBkYXRlLm1vY2suY2FsbHNbb25VcmxVcGRhdGUubW9jay5jYWxscy5sZW5ndGggLSAxXVswXVxuICAgICAgZXhwZWN0KHVwZGF0ZS5zZWFyY2hQYXJhbXMuZ2V0KFBSSUNJTkdfTU9EQUxfUVVFUllfUEFSQU0pKS50b0JlKFBSSUNJTkdfTU9EQUxfUVVFUllfVkFMVUUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHB1c2ggaGlzdG9yeSB3aGVuIG9wZW5pbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgb25VcmxVcGRhdGUgfSA9IHJlbmRlcldpdGhBZGFwdGVyKCgpID0+IHVzZVByaWNpbmdNb2RhbCgpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50WzFdKHRydWUpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUub3B0aW9ucy5oaXN0b3J5KS50b0JlKCdwdXNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbGVhciBwcmljaW5nIHBhcmFtIHdoZW4gY2xvc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZVByaWNpbmdNb2RhbCgpLFxuICAgICAgICBgPyR7UFJJQ0lOR19NT0RBTF9RVUVSWV9QQVJBTX09JHtQUklDSU5HX01PREFMX1FVRVJZX1ZBTFVFfWAsXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnRbMV0oZmFsc2UpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUuc2VhcmNoUGFyYW1zLmhhcyhQUklDSU5HX01PREFMX1FVRVJZX1BBUkFNKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgcHVzaCBoaXN0b3J5IHdoZW4gY2xvc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZVByaWNpbmdNb2RhbCgpLFxuICAgICAgICBgPyR7UFJJQ0lOR19NT0RBTF9RVUVSWV9QQVJBTX09JHtQUklDSU5HX01PREFMX1FVRVJZX1ZBTFVFfWAsXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnRbMV0oZmFsc2UpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUub3B0aW9ucy5oaXN0b3J5KS50b0JlKCdwdXNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXNwZWN0IGV4cGxpY2l0IGhpc3Rvcnkgb3B0aW9ucyB3aGVuIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQsIG9uVXJsVXBkYXRlIH0gPSByZW5kZXJXaXRoQWRhcHRlcigoKSA9PiB1c2VQcmljaW5nTW9kYWwoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudFsxXSh0cnVlLCB7IGhpc3Rvcnk6ICdyZXBsYWNlJyB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLm9wdGlvbnMuaGlzdG9yeSkudG9CZSgncmVwbGFjZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBBY2NvdW50IHNldHRpbmdzIG1vZGFsIHF1ZXJ5IGJlaGF2aW9yLlxuICBkZXNjcmliZSgndXNlQWNjb3VudFNldHRpbmdNb2RhbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjbG9zZWQgc3RhdGUgd2l0aCBudWxsIHBheWxvYWQgd2hlbiBxdWVyeSBwYXJhbXMgYXJlIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoKCkgPT4gdXNlQWNjb3VudFNldHRpbmdNb2RhbCgpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IFtzdGF0ZV0gPSByZXN1bHQuY3VycmVudFxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdGF0ZS5pc09wZW4pLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3Qoc3RhdGUucGF5bG9hZCkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBvcGVuIHN0YXRlIHdoZW4gYWN0aW9uIG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZUFjY291bnRTZXR0aW5nTW9kYWwoKSxcbiAgICAgICAgYD9hY3Rpb249JHtBQ0NPVU5UX1NFVFRJTkdfTU9EQUxfQUNUSU9OfSZ0YWI9YmlsbGluZ2AsXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgW3N0YXRlXSA9IHJlc3VsdC5jdXJyZW50XG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0YXRlLmlzT3BlbikudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHN0YXRlLnBheWxvYWQpLnRvQmUoJ2JpbGxpbmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjbG9zZWQgc3RhdGUgd2hlbiBhY3Rpb24gZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZUFjY291bnRTZXR0aW5nTW9kYWwoKSxcbiAgICAgICAgJz9hY3Rpb249b3RoZXImdGFiPWJpbGxpbmcnLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IFtzdGF0ZV0gPSByZXN1bHQuY3VycmVudFxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdGF0ZS5pc09wZW4pLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3Qoc3RhdGUucGF5bG9hZCkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBhY3Rpb24gYW5kIHRhYiB3aGVuIG9wZW5pbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgb25VcmxVcGRhdGUgfSA9IHJlbmRlcldpdGhBZGFwdGVyKCgpID0+IHVzZUFjY291bnRTZXR0aW5nTW9kYWwoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudFsxXSh7IHBheWxvYWQ6ICdtZW1iZXJzJyB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLnNlYXJjaFBhcmFtcy5nZXQoJ2FjdGlvbicpKS50b0JlKEFDQ09VTlRfU0VUVElOR19NT0RBTF9BQ1RJT04pXG4gICAgICBleHBlY3QodXBkYXRlLnNlYXJjaFBhcmFtcy5nZXQoJ3RhYicpKS50b0JlKCdtZW1iZXJzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgcHVzaCBoaXN0b3J5IHdoZW4gb3BlbmluZyBmcm9tIGNsb3NlZCBzdGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoKCkgPT4gdXNlQWNjb3VudFNldHRpbmdNb2RhbCgpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50WzFdKHsgcGF5bG9hZDogJ21lbWJlcnMnIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUub3B0aW9ucy5oaXN0b3J5KS50b0JlKCdwdXNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdGFiIHdoZW4gc3dpdGNoaW5nIHdoaWxlIG9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgb25VcmxVcGRhdGUgfSA9IHJlbmRlcldpdGhBZGFwdGVyKFxuICAgICAgICAoKSA9PiB1c2VBY2NvdW50U2V0dGluZ01vZGFsKCksXG4gICAgICAgIGA/YWN0aW9uPSR7QUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTn0mdGFiPWJpbGxpbmdgLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50WzFdKHsgcGF5bG9hZDogJ3Byb3ZpZGVyJyB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLnNlYXJjaFBhcmFtcy5nZXQoJ3RhYicpKS50b0JlKCdwcm92aWRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHJlcGxhY2UgaGlzdG9yeSB3aGVuIHN3aXRjaGluZyB0YWJzIHdoaWxlIG9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgb25VcmxVcGRhdGUgfSA9IHJlbmRlcldpdGhBZGFwdGVyKFxuICAgICAgICAoKSA9PiB1c2VBY2NvdW50U2V0dGluZ01vZGFsKCksXG4gICAgICAgIGA/YWN0aW9uPSR7QUNDT1VOVF9TRVRUSU5HX01PREFMX0FDVElPTn0mdGFiPWJpbGxpbmdgLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50WzFdKHsgcGF5bG9hZDogJ3Byb3ZpZGVyJyB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLm9wdGlvbnMuaGlzdG9yeSkudG9CZSgncmVwbGFjZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgYWN0aW9uIGFuZCB0YWIgd2hlbiBjbG9zaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQsIG9uVXJsVXBkYXRlIH0gPSByZW5kZXJXaXRoQWRhcHRlcihcbiAgICAgICAgKCkgPT4gdXNlQWNjb3VudFNldHRpbmdNb2RhbCgpLFxuICAgICAgICBgP2FjdGlvbj0ke0FDQ09VTlRfU0VUVElOR19NT0RBTF9BQ1RJT059JnRhYj1iaWxsaW5nYCxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudFsxXShudWxsKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLnNlYXJjaFBhcmFtcy5oYXMoJ2FjdGlvbicpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KHVwZGF0ZS5zZWFyY2hQYXJhbXMuaGFzKCd0YWInKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgcmVwbGFjZSBoaXN0b3J5IHdoZW4gY2xvc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZUFjY291bnRTZXR0aW5nTW9kYWwoKSxcbiAgICAgICAgYD9hY3Rpb249JHtBQ0NPVU5UX1NFVFRJTkdfTU9EQUxfQUNUSU9OfSZ0YWI9YmlsbGluZ2AsXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnRbMV0obnVsbClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiBleHBlY3Qob25VcmxVcGRhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKSlcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IG9uVXJsVXBkYXRlLm1vY2suY2FsbHNbb25VcmxVcGRhdGUubW9jay5jYWxscy5sZW5ndGggLSAxXVswXVxuICAgICAgZXhwZWN0KHVwZGF0ZS5vcHRpb25zLmhpc3RvcnkpLnRvQmUoJ3JlcGxhY2UnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUGx1Z2luIGluc3RhbGxhdGlvbiBxdWVyeSBiZWhhdmlvci5cbiAgZGVzY3JpYmUoJ3VzZVBsdWdpbkluc3RhbGxhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIHBhY2thZ2UgaWRzIGZyb20gSlNPTiBhcnJheXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBidW5kbGVJbmZvID0geyBvcmc6ICdvcmcnLCBuYW1lOiAnYnVuZGxlJywgdmVyc2lvbjogJzEuMC4wJyB9XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoXG4gICAgICAgICgpID0+IHVzZVBsdWdpbkluc3RhbGxhdGlvbigpLFxuICAgICAgICBgP3BhY2thZ2UtaWRzPSU1QiUyMm9yZyUyRnBsdWdpbiUyMiU1RCZidW5kbGUtaW5mbz0ke2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShidW5kbGVJbmZvKSl9YCxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBbc3RhdGVdID0gcmVzdWx0LmN1cnJlbnRcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RhdGUucGFja2FnZUlkKS50b0JlKCdvcmcvcGx1Z2luJylcbiAgICAgIGV4cGVjdChzdGF0ZS5idW5kbGVJbmZvKS50b0VxdWFsKGJ1bmRsZUluZm8pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHJhdyBwYWNrYWdlIGlkIHdoZW4gSlNPTiBwYXJzaW5nIGZhaWxzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlcldpdGhBZGFwdGVyKFxuICAgICAgICAoKSA9PiB1c2VQbHVnaW5JbnN0YWxsYXRpb24oKSxcbiAgICAgICAgJz9wYWNrYWdlLWlkcz1vcmcvcGx1Z2luJyxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBbc3RhdGVdID0gcmVzdWx0LmN1cnJlbnRcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RhdGUucGFja2FnZUlkKS50b0JlKCdvcmcvcGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcmF3IHBhY2thZ2UgaWQgd2hlbiBKU09OIGlzIG5vdCBhbiBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJXaXRoQWRhcHRlcihcbiAgICAgICAgKCkgPT4gdXNlUGx1Z2luSW5zdGFsbGF0aW9uKCksXG4gICAgICAgICc/cGFja2FnZS1pZHM9JTIyb3JnJTJGcGx1Z2luJTIyJyxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBbc3RhdGVdID0gcmVzdWx0LmN1cnJlbnRcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RhdGUucGFja2FnZUlkKS50b0JlKCdcIm9yZy9wbHVnaW5cIicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd3JpdGUgcGFja2FnZSBpZHMgYXMgSlNPTiBhcnJheXMgd2hlbiBzZXR0aW5nIHBhY2thZ2VJZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCBvblVybFVwZGF0ZSB9ID0gcmVuZGVyV2l0aEFkYXB0ZXIoKCkgPT4gdXNlUGx1Z2luSW5zdGFsbGF0aW9uKCkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnRbMV0oeyBwYWNrYWdlSWQ6ICdvcmcvcGx1Z2luJyB9KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChvblVybFVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpKVxuICAgICAgY29uc3QgdXBkYXRlID0gb25VcmxVcGRhdGUubW9jay5jYWxsc1tvblVybFVwZGF0ZS5tb2NrLmNhbGxzLmxlbmd0aCAtIDFdWzBdXG4gICAgICBleHBlY3QodXBkYXRlLnNlYXJjaFBhcmFtcy5nZXQoJ3BhY2thZ2UtaWRzJykpLnRvQmUoJ1tcIm9yZy9wbHVnaW5cIl0nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBidW5kbGUgaW5mbyB3aGVuIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYnVuZGxlSW5mbyA9IHsgb3JnOiAnb3JnJywgbmFtZTogJ2J1bmRsZScsIHZlcnNpb246ICcxLjAuMCcgfVxuICAgICAgY29uc3QgeyByZXN1bHQsIG9uVXJsVXBkYXRlIH0gPSByZW5kZXJXaXRoQWRhcHRlcigoKSA9PiB1c2VQbHVnaW5JbnN0YWxsYXRpb24oKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudFsxXSh7IGJ1bmRsZUluZm8gfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiBleHBlY3Qob25VcmxVcGRhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKSlcbiAgICAgIGNvbnN0IHVwZGF0ZSA9IG9uVXJsVXBkYXRlLm1vY2suY2FsbHNbb25VcmxVcGRhdGUubW9jay5jYWxscy5sZW5ndGggLSAxXVswXVxuICAgICAgZXhwZWN0KHVwZGF0ZS5zZWFyY2hQYXJhbXMuZ2V0KCdidW5kbGUtaW5mbycpKS50b0JlKEpTT04uc3RyaW5naWZ5KGJ1bmRsZUluZm8pKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIGluc3RhbGxhdGlvbiBwYXJhbXMgd2hlbiBzdGF0ZSBpcyBudWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYnVuZGxlSW5mbyA9IHsgb3JnOiAnb3JnJywgbmFtZTogJ2J1bmRsZScsIHZlcnNpb246ICcxLjAuMCcgfVxuICAgICAgY29uc3QgeyByZXN1bHQsIG9uVXJsVXBkYXRlIH0gPSByZW5kZXJXaXRoQWRhcHRlcihcbiAgICAgICAgKCkgPT4gdXNlUGx1Z2luSW5zdGFsbGF0aW9uKCksXG4gICAgICAgIGA/cGFja2FnZS1pZHM9JTVCJTIyb3JnJTJGcGx1Z2luJTIyJTVEJmJ1bmRsZS1pbmZvPSR7ZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGJ1bmRsZUluZm8pKX1gLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50WzFdKG51bGwpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUuc2VhcmNoUGFyYW1zLmhhcygncGFja2FnZS1pZHMnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdCh1cGRhdGUuc2VhcmNoUGFyYW1zLmhhcygnYnVuZGxlLWluZm8nKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBidW5kbGUgaW5mbyB3aGVuIG9ubHkgcGFja2FnZUlkIGlzIHVwZGF0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBidW5kbGVJbmZvID0geyBvcmc6ICdvcmcnLCBuYW1lOiAnYnVuZGxlJywgdmVyc2lvbjogJzEuMC4wJyB9XG4gICAgICBjb25zdCB7IHJlc3VsdCwgb25VcmxVcGRhdGUgfSA9IHJlbmRlcldpdGhBZGFwdGVyKFxuICAgICAgICAoKSA9PiB1c2VQbHVnaW5JbnN0YWxsYXRpb24oKSxcbiAgICAgICAgYD9idW5kbGUtaW5mbz0ke2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShidW5kbGVJbmZvKSl9YCxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudFsxXSh7IHBhY2thZ2VJZDogJ29yZy9wbHVnaW4nIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG9uVXJsVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgICBjb25zdCB1cGRhdGUgPSBvblVybFVwZGF0ZS5tb2NrLmNhbGxzW29uVXJsVXBkYXRlLm1vY2suY2FsbHMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGV4cGVjdCh1cGRhdGUuc2VhcmNoUGFyYW1zLmdldCgnYnVuZGxlLWluZm8nKSkudG9CZShKU09OLnN0cmluZ2lmeShidW5kbGVJbmZvKSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gVXRpbGl0eSB0byBjbGVhciBxdWVyeSBwYXJhbXMgZnJvbSB0aGUgY3VycmVudCBVUkwuXG5kZXNjcmliZSgnY2xlYXJRdWVyeVBhcmFtcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCAnLycpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICB2aS51bnN0dWJBbGxHbG9iYWxzKClcbiAgICBtb2NrSXNTZXJ2ZXIudmFsdWUgPSBmYWxzZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVtb3ZlIGEgc2luZ2xlIGtleSB3aGVuIHByb3ZpZGVkIG9uZSBrZXknLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHJlcGxhY2VTcHkgPSB2aS5zcHlPbih3aW5kb3cuaGlzdG9yeSwgJ3JlcGxhY2VTdGF0ZScpXG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsICcnLCAnLz9mb289MSZiYXI9MicpXG5cbiAgICAvLyBBY3RcbiAgICBjbGVhclF1ZXJ5UGFyYW1zKCdmb28nKVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHJlcGxhY2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcbiAgICBleHBlY3QocGFyYW1zLmhhcygnZm9vJykpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHBhcmFtcy5nZXQoJ2JhcicpKS50b0JlKCcyJylcbiAgICByZXBsYWNlU3B5Lm1vY2tSZXN0b3JlKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbW92ZSBtdWx0aXBsZSBrZXlzIHdoZW4gcHJvdmlkZWQgYW4gYXJyYXknLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHJlcGxhY2VTcHkgPSB2aS5zcHlPbih3aW5kb3cuaGlzdG9yeSwgJ3JlcGxhY2VTdGF0ZScpXG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKG51bGwsICcnLCAnLz9mb289MSZiYXI9MiZiYXo9MycpXG5cbiAgICAvLyBBY3RcbiAgICBjbGVhclF1ZXJ5UGFyYW1zKFsnZm9vJywgJ2JheiddKVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHJlcGxhY2VTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaClcbiAgICBleHBlY3QocGFyYW1zLmhhcygnZm9vJykpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHBhcmFtcy5oYXMoJ2JheicpKS50b0JlKGZhbHNlKVxuICAgIGV4cGVjdChwYXJhbXMuZ2V0KCdiYXInKSkudG9CZSgnMicpXG4gICAgcmVwbGFjZVNweS5tb2NrUmVzdG9yZSgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBuby1vcCB3aGVuIHJ1bm5pbmcgb24gc2VydmVyJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCByZXBsYWNlU3B5ID0gdmkuc3B5T24od2luZG93Lmhpc3RvcnksICdyZXBsYWNlU3RhdGUnKVxuICAgIG1vY2tJc1NlcnZlci52YWx1ZSA9IHRydWVcblxuICAgIC8vIEFjdFxuICAgIGNsZWFyUXVlcnlQYXJhbXMoJ2ZvbycpXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVwbGFjZVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIHJlcGxhY2VTcHkubW9ja1Jlc3RvcmUoKVxuICB9KVxufSlcbiJdfQ==