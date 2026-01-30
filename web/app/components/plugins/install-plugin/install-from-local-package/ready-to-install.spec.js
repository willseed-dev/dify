"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const ready_to_install_1 = require("./ready-to-install");
// Factory function for test data
const createMockManifest = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-uid',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    name: 'Test Plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { 'en-US': 'Test Plugin' },
    description: { 'en-US': 'A test plugin' },
    created_at: '2024-01-01T00:00:00Z',
    resource: {},
    plugins: [],
    verified: true,
    endpoint: { settings: [], endpoints: [] },
    model: null,
    tags: [],
    agent_strategy: null,
    meta: { version: '1.0.0' },
    trigger: {},
    ...overrides,
});
// Mock external dependencies
const mockRefreshPluginList = vitest_1.vi.fn();
vitest_1.vi.mock('../hooks/use-refresh-plugin-list', () => ({
    default: () => ({
        refreshPluginList: mockRefreshPluginList,
    }),
}));
// Mock Install component
let _installOnInstalled = null;
let _installOnFailed = null;
let _installOnCancel = null;
let _installOnStartToInstall = null;
vitest_1.vi.mock('./steps/install', () => ({
    default: ({ uniqueIdentifier, payload, onCancel, onStartToInstall, onInstalled, onFailed, }) => {
        _installOnInstalled = onInstalled;
        _installOnFailed = onFailed;
        _installOnCancel = onCancel;
        _installOnStartToInstall = onStartToInstall ?? null;
        return (<div data-testid="install-step">
        <span data-testid="install-uid">{uniqueIdentifier}</span>
        <span data-testid="install-payload-name">{payload.name}</span>
        <button data-testid="install-cancel-btn" onClick={onCancel}>Cancel</button>
        <button data-testid="install-start-btn" onClick={() => onStartToInstall?.()}>
          Start Install
        </button>
        <button data-testid="install-installed-btn" onClick={() => onInstalled()}>
          Installed
        </button>
        <button data-testid="install-installed-no-refresh-btn" onClick={() => onInstalled(true)}>
          Installed (No Refresh)
        </button>
        <button data-testid="install-failed-btn" onClick={() => onFailed()}>
          Failed
        </button>
        <button data-testid="install-failed-msg-btn" onClick={() => onFailed('Error message')}>
          Failed with Message
        </button>
      </div>);
    },
}));
// Mock Installed component
vitest_1.vi.mock('../base/installed', () => ({
    default: ({ payload, isFailed, errMsg, onCancel, }) => (<div data-testid="installed-step">
      <span data-testid="installed-payload-name">{payload?.name || 'null'}</span>
      <span data-testid="installed-is-failed">{isFailed ? 'true' : 'false'}</span>
      <span data-testid="installed-err-msg">{errMsg || 'null'}</span>
      <button data-testid="installed-cancel-btn" onClick={onCancel}>Close</button>
    </div>),
}));
(0, vitest_1.describe)('ReadyToInstall', () => {
    const defaultProps = {
        step: types_1.InstallStep.readyToInstall,
        onStepChange: vitest_1.vi.fn(),
        onStartToInstall: vitest_1.vi.fn(),
        setIsInstalling: vitest_1.vi.fn(),
        onClose: vitest_1.vi.fn(),
        uniqueIdentifier: 'test-unique-identifier',
        manifest: createMockManifest(),
        errorMsg: null,
        onError: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        _installOnInstalled = null;
        _installOnFailed = null;
        _installOnCancel = null;
        _installOnStartToInstall = null;
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render Install component when step is readyToInstall', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.readyToInstall}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('installed-step')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Installed component when step is uploadFailed', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.uploadFailed}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-step')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Installed component when step is installed', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-step')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Installed component when step is installFailed', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-step')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Passing Tests
    // ================================
    (0, vitest_1.describe)('Props Passing', () => {
        (0, vitest_1.it)('should pass uniqueIdentifier to Install component', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} uniqueIdentifier="custom-uid"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-uid')).toHaveTextContent('custom-uid');
        });
        (0, vitest_1.it)('should pass manifest to Install component', () => {
            const manifest = createMockManifest({ name: 'Custom Plugin' });
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-payload-name')).toHaveTextContent('Custom Plugin');
        });
        (0, vitest_1.it)('should pass manifest to Installed component', () => {
            const manifest = createMockManifest({ name: 'Installed Plugin' });
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-payload-name')).toHaveTextContent('Installed Plugin');
        });
        (0, vitest_1.it)('should pass errorMsg to Installed component', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed} errorMsg="Some error"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-err-msg')).toHaveTextContent('Some error');
        });
        (0, vitest_1.it)('should pass isFailed=true for uploadFailed step', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.uploadFailed}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-is-failed')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should pass isFailed=true for installFailed step', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-is-failed')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should pass isFailed=false for installed step', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-is-failed')).toHaveTextContent('false');
        });
    });
    // ================================
    // handleInstalled Callback Tests
    // ================================
    (0, vitest_1.describe)('handleInstalled Callback', () => {
        (0, vitest_1.it)('should call onStepChange with installed when handleInstalled is triggered', () => {
            const onStepChange = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installed);
        });
        (0, vitest_1.it)('should call refreshPluginList when handleInstalled is triggered without notRefresh', () => {
            const manifest = createMockManifest();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} manifest={manifest}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-btn'));
            (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith(manifest);
        });
        (0, vitest_1.it)('should not call refreshPluginList when handleInstalled is triggered with notRefresh=true', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-no-refresh-btn'));
            (0, vitest_1.expect)(mockRefreshPluginList).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when handleInstalled is triggered', () => {
            const setIsInstalling = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} setIsInstalling={setIsInstalling}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-btn'));
            (0, vitest_1.expect)(setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    // ================================
    // handleFailed Callback Tests
    // ================================
    (0, vitest_1.describe)('handleFailed Callback', () => {
        (0, vitest_1.it)('should call onStepChange with installFailed when handleFailed is triggered', () => {
            const onStepChange = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installFailed);
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when handleFailed is triggered', () => {
            const setIsInstalling = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} setIsInstalling={setIsInstalling}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-btn'));
            (0, vitest_1.expect)(setIsInstalling).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should call onError when handleFailed is triggered with error message', () => {
            const onError = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onError={onError}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-msg-btn'));
            (0, vitest_1.expect)(onError).toHaveBeenCalledWith('Error message');
        });
        (0, vitest_1.it)('should not call onError when handleFailed is triggered without error message', () => {
            const onError = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onError={onError}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-btn'));
            (0, vitest_1.expect)(onError).not.toHaveBeenCalled();
        });
    });
    // ================================
    // onClose Callback Tests
    // ================================
    (0, vitest_1.describe)('onClose Callback', () => {
        (0, vitest_1.it)('should call onClose when cancel is clicked in Install component', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onClose={onClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-cancel-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onClose when cancel is clicked in Installed component', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed} onClose={onClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('installed-cancel-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // onStartToInstall Callback Tests
    // ================================
    (0, vitest_1.describe)('onStartToInstall Callback', () => {
        (0, vitest_1.it)('should pass onStartToInstall to Install component', () => {
            const onStartToInstall = vitest_1.vi.fn();
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onStartToInstall={onStartToInstall}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-start-btn'));
            (0, vitest_1.expect)(onStartToInstall).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Step Transitions Tests
    // ================================
    (0, vitest_1.describe)('Step Transitions', () => {
        (0, vitest_1.it)('should handle transition from readyToInstall to installed', () => {
            const onStepChange = vitest_1.vi.fn();
            const { rerender } = (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.readyToInstall} onStepChange={onStepChange}/>);
            // Initially shows Install component
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            // Simulate successful installation
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installed);
            // Rerender with new step
            rerender(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed} onStepChange={onStepChange}/>);
            // Now shows Installed component
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle transition from readyToInstall to installFailed', () => {
            const onStepChange = vitest_1.vi.fn();
            const { rerender } = (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.readyToInstall} onStepChange={onStepChange}/>);
            // Initially shows Install component
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            // Simulate failed installation
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installFailed);
            // Rerender with new step
            rerender(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed} onStepChange={onStepChange}/>);
            // Now shows Installed component with failed state
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-is-failed')).toHaveTextContent('true');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle null manifest', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installed} manifest={null}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-payload-name')).toHaveTextContent('null');
        });
        (0, vitest_1.it)('should handle null errorMsg', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed} errorMsg={null}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-err-msg')).toHaveTextContent('null');
        });
        (0, vitest_1.it)('should handle empty string errorMsg', () => {
            (0, react_1.render)(<ready_to_install_1.default {...defaultProps} step={types_1.InstallStep.installFailed} errorMsg=""/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-err-msg')).toHaveTextContent('null');
        });
    });
    // ================================
    // Callback Stability Tests
    // ================================
    (0, vitest_1.describe)('Callback Stability', () => {
        (0, vitest_1.it)('should maintain stable handleInstalled callback across re-renders', () => {
            const onStepChange = vitest_1.vi.fn();
            const setIsInstalling = vitest_1.vi.fn();
            const { rerender } = (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange} setIsInstalling={setIsInstalling}/>);
            // Rerender with same props
            rerender(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange} setIsInstalling={setIsInstalling}/>);
            // Callback should still work
            react_1.fireEvent.click(react_1.screen.getByTestId('install-installed-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installed);
            (0, vitest_1.expect)(setIsInstalling).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should maintain stable handleFailed callback across re-renders', () => {
            const onStepChange = vitest_1.vi.fn();
            const setIsInstalling = vitest_1.vi.fn();
            const onError = vitest_1.vi.fn();
            const { rerender } = (0, react_1.render)(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange} setIsInstalling={setIsInstalling} onError={onError}/>);
            // Rerender with same props
            rerender(<ready_to_install_1.default {...defaultProps} onStepChange={onStepChange} setIsInstalling={setIsInstalling} onError={onError}/>);
            // Callback should still work
            react_1.fireEvent.click(react_1.screen.getByTestId('install-failed-msg-btn'));
            (0, vitest_1.expect)(onStepChange).toHaveBeenCalledWith(types_1.InstallStep.installFailed);
            (0, vitest_1.expect)(setIsInstalling).toHaveBeenCalledWith(false);
            (0, vitest_1.expect)(onError).toHaveBeenCalledWith('Error message');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHktdG8taW5zdGFsbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVhZHktdG8taW5zdGFsbC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFrRTtBQUNsRSxtQ0FBNkQ7QUFDN0QsdUNBQTZEO0FBQzdELHlEQUErQztBQUUvQyxpQ0FBaUM7QUFDakMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFlBQXdDLEVBQUUsRUFBcUIsRUFBRSxDQUFDLENBQUM7SUFDN0Ysd0JBQXdCLEVBQUUsaUJBQWlCO0lBQzNDLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxhQUFhO0lBQ25CLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO0lBQ2pDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWdDO0lBQy9ELFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQXNDO0lBQzdFLFVBQVUsRUFBRSxzQkFBc0I7SUFDbEMsUUFBUSxFQUFFLEVBQUU7SUFDWixPQUFPLEVBQUUsRUFBRTtJQUNYLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLEVBQUU7SUFDUixjQUFjLEVBQUUsSUFBSTtJQUNwQixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0lBQzFCLE9BQU8sRUFBRSxFQUFrQztJQUMzQyxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRiw2QkFBNkI7QUFDN0IsTUFBTSxxQkFBcUIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDckMsV0FBRSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pE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b0IsQ0FBQyxtQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ3BFLElBQUEsZUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ25ELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luRGVjbGFyYXRpb24gfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgSW5zdGFsbFN0ZXAsIFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IFJlYWR5VG9JbnN0YWxsIGZyb20gJy4vcmVhZHktdG8taW5zdGFsbCdcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiBmb3IgdGVzdCBkYXRhXG5jb25zdCBjcmVhdGVNb2NrTWFuaWZlc3QgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRlY2xhcmF0aW9uPiA9IHt9KTogUGx1Z2luRGVjbGFyYXRpb24gPT4gKHtcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4tdWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgYXV0aG9yOiAndGVzdC1hdXRob3InLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnQSB0ZXN0IHBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnZGVzY3JpcHRpb24nXSxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDFUMDA6MDA6MDBaJyxcbiAgcmVzb3VyY2U6IHt9LFxuICBwbHVnaW5zOiBbXSxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICBtb2RlbDogbnVsbCxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmNvbnN0IG1vY2tSZWZyZXNoUGx1Z2luTGlzdCA9IHZpLmZuKClcbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1yZWZyZXNoLXBsdWdpbi1saXN0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICByZWZyZXNoUGx1Z2luTGlzdDogbW9ja1JlZnJlc2hQbHVnaW5MaXN0LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIEluc3RhbGwgY29tcG9uZW50XG5sZXQgX2luc3RhbGxPbkluc3RhbGxlZDogKChub3RSZWZyZXNoPzogYm9vbGVhbikgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxubGV0IF9pbnN0YWxsT25GYWlsZWQ6ICgobWVzc2FnZT86IHN0cmluZykgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxubGV0IF9pbnN0YWxsT25DYW5jZWw6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5sZXQgX2luc3RhbGxPblN0YXJ0VG9JbnN0YWxsOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuXG52aS5tb2NrKCcuL3N0ZXBzL2luc3RhbGwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgcGF5bG9hZCxcbiAgICBvbkNhbmNlbCxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIG9uSW5zdGFsbGVkLFxuICAgIG9uRmFpbGVkLFxuICB9OiB7XG4gICAgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG4gICAgcGF5bG9hZDogUGx1Z2luRGVjbGFyYXRpb25cbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICAgIG9uU3RhcnRUb0luc3RhbGw/OiAoKSA9PiB2b2lkXG4gICAgb25JbnN0YWxsZWQ6IChub3RSZWZyZXNoPzogYm9vbGVhbikgPT4gdm9pZFxuICAgIG9uRmFpbGVkOiAobWVzc2FnZT86IHN0cmluZykgPT4gdm9pZFxuICB9KSA9PiB7XG4gICAgX2luc3RhbGxPbkluc3RhbGxlZCA9IG9uSW5zdGFsbGVkXG4gICAgX2luc3RhbGxPbkZhaWxlZCA9IG9uRmFpbGVkXG4gICAgX2luc3RhbGxPbkNhbmNlbCA9IG9uQ2FuY2VsXG4gICAgX2luc3RhbGxPblN0YXJ0VG9JbnN0YWxsID0gb25TdGFydFRvSW5zdGFsbCA/PyBudWxsXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLXN0ZXBcIj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLXVpZFwiPnt1bmlxdWVJZGVudGlmaWVyfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLXBheWxvYWQtbmFtZVwiPntwYXlsb2FkLm5hbWV9PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1jYW5jZWwtYnRuXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1zdGFydC1idG5cIiBvbkNsaWNrPXsoKSA9PiBvblN0YXJ0VG9JbnN0YWxsPy4oKX0+XG4gICAgICAgICAgU3RhcnQgSW5zdGFsbFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtaW5zdGFsbGVkLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uSW5zdGFsbGVkKCl9PlxuICAgICAgICAgIEluc3RhbGxlZFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtaW5zdGFsbGVkLW5vLXJlZnJlc2gtYnRuXCIgb25DbGljaz17KCkgPT4gb25JbnN0YWxsZWQodHJ1ZSl9PlxuICAgICAgICAgIEluc3RhbGxlZCAoTm8gUmVmcmVzaClcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLWZhaWxlZC1idG5cIiBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgpfT5cbiAgICAgICAgICBGYWlsZWRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLWZhaWxlZC1tc2ctYnRuXCIgb25DbGljaz17KCkgPT4gb25GYWlsZWQoJ0Vycm9yIG1lc3NhZ2UnKX0+XG4gICAgICAgICAgRmFpbGVkIHdpdGggTWVzc2FnZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIEluc3RhbGxlZCBjb21wb25lbnRcbnZpLm1vY2soJy4uL2Jhc2UvaW5zdGFsbGVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBwYXlsb2FkLFxuICAgIGlzRmFpbGVkLFxuICAgIGVyck1zZyxcbiAgICBvbkNhbmNlbCxcbiAgfToge1xuICAgIHBheWxvYWQ6IFBsdWdpbkRlY2xhcmF0aW9uIHwgbnVsbFxuICAgIGlzRmFpbGVkOiBib29sZWFuXG4gICAgZXJyTXNnOiBzdHJpbmcgfCBudWxsXG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbnN0YWxsZWQtc3RlcFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsZWQtcGF5bG9hZC1uYW1lXCI+e3BheWxvYWQ/Lm5hbWUgfHwgJ251bGwnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaW5zdGFsbGVkLWlzLWZhaWxlZFwiPntpc0ZhaWxlZCA/ICd0cnVlJyA6ICdmYWxzZSd9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsZWQtZXJyLW1zZ1wiPntlcnJNc2cgfHwgJ251bGwnfTwvc3Bhbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsZWQtY2FuY2VsLWJ0blwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5DbG9zZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbmRlc2NyaWJlKCdSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIHN0ZXA6IEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsLFxuICAgIG9uU3RlcENoYW5nZTogdmkuZm4oKSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsOiB2aS5mbigpLFxuICAgIHNldElzSW5zdGFsbGluZzogdmkuZm4oKSxcbiAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgICBtYW5pZmVzdDogY3JlYXRlTW9ja01hbmlmZXN0KCksXG4gICAgZXJyb3JNc2c6IG51bGwgYXMgc3RyaW5nIHwgbnVsbCxcbiAgICBvbkVycm9yOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgX2luc3RhbGxPbkluc3RhbGxlZCA9IG51bGxcbiAgICBfaW5zdGFsbE9uRmFpbGVkID0gbnVsbFxuICAgIF9pbnN0YWxsT25DYW5jZWwgPSBudWxsXG4gICAgX2luc3RhbGxPblN0YXJ0VG9JbnN0YWxsID0gbnVsbFxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGwgY29tcG9uZW50IHdoZW4gc3RlcCBpcyByZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAucmVhZHlUb0luc3RhbGx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnN0YWxsZWQgY29tcG9uZW50IHdoZW4gc3RlcCBpcyB1cGxvYWRGYWlsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHN0ZXA9e0luc3RhbGxTdGVwLnVwbG9hZEZhaWxlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGxlZCBjb21wb25lbnQgd2hlbiBzdGVwIGlzIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbGVkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbGVkIGNvbXBvbmVudCB3aGVuIHN0ZXAgaXMgaW5zdGFsbEZhaWxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbEZhaWxlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBQYXNzaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcyBQYXNzaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyB1bmlxdWVJZGVudGlmaWVyIHRvIEluc3RhbGwgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSB1bmlxdWVJZGVudGlmaWVyPVwiY3VzdG9tLXVpZFwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXVpZCcpKS50b0hhdmVUZXh0Q29udGVudCgnY3VzdG9tLXVpZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBtYW5pZmVzdCB0byBJbnN0YWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgbmFtZTogJ0N1c3RvbSBQbHVnaW4nIH0pXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG1hbmlmZXN0PXttYW5pZmVzdH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtcGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXN0b20gUGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIG1hbmlmZXN0IHRvIEluc3RhbGxlZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IG5hbWU6ICdJbnN0YWxsZWQgUGx1Z2luJyB9KVxuICAgICAgcmVuZGVyKDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBzdGVwPXtJbnN0YWxsU3RlcC5pbnN0YWxsZWR9IG1hbmlmZXN0PXttYW5pZmVzdH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1wYXlsb2FkLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0luc3RhbGxlZCBQbHVnaW4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgZXJyb3JNc2cgdG8gSW5zdGFsbGVkIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlYWR5VG9JbnN0YWxsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzdGVwPXtJbnN0YWxsU3RlcC5pbnN0YWxsRmFpbGVkfVxuICAgICAgICAgIGVycm9yTXNnPVwiU29tZSBlcnJvclwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtZXJyLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnU29tZSBlcnJvcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0ZhaWxlZD10cnVlIGZvciB1cGxvYWRGYWlsZWQgc3RlcCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAudXBsb2FkRmFpbGVkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLWlzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0ZhaWxlZD10cnVlIGZvciBpbnN0YWxsRmFpbGVkIHN0ZXAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHN0ZXA9e0luc3RhbGxTdGVwLmluc3RhbGxGYWlsZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGlzRmFpbGVkPWZhbHNlIGZvciBpbnN0YWxsZWQgc3RlcCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbGVkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLWlzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gaGFuZGxlSW5zdGFsbGVkIENhbGxiYWNrIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdoYW5kbGVJbnN0YWxsZWQgQ2FsbGJhY2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU3RlcENoYW5nZSB3aXRoIGluc3RhbGxlZCB3aGVuIGhhbmRsZUluc3RhbGxlZCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblN0ZXBDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGV4cGVjdChvblN0ZXBDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEluc3RhbGxTdGVwLmluc3RhbGxlZClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHJlZnJlc2hQbHVnaW5MaXN0IHdoZW4gaGFuZGxlSW5zdGFsbGVkIGlzIHRyaWdnZXJlZCB3aXRob3V0IG5vdFJlZnJlc2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCgpXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG1hbmlmZXN0PXttYW5pZmVzdH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja1JlZnJlc2hQbHVnaW5MaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtYW5pZmVzdClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCByZWZyZXNoUGx1Z2luTGlzdCB3aGVuIGhhbmRsZUluc3RhbGxlZCBpcyB0cmlnZ2VyZWQgd2l0aCBub3RSZWZyZXNoPXRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWluc3RhbGxlZC1uby1yZWZyZXNoLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja1JlZnJlc2hQbHVnaW5MaXN0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBzZXRJc0luc3RhbGxpbmcoZmFsc2UpIHdoZW4gaGFuZGxlSW5zdGFsbGVkIGlzIHRyaWdnZXJlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNldElzSW5zdGFsbGluZyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc2V0SXNJbnN0YWxsaW5nPXtzZXRJc0luc3RhbGxpbmd9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWluc3RhbGxlZC1idG4nKSlcblxuICAgICAgZXhwZWN0KHNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBoYW5kbGVGYWlsZWQgQ2FsbGJhY2sgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ2hhbmRsZUZhaWxlZCBDYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdGVwQ2hhbmdlIHdpdGggaW5zdGFsbEZhaWxlZCB3aGVuIGhhbmRsZUZhaWxlZCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblN0ZXBDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsZWQtYnRuJykpXG5cbiAgICAgIGV4cGVjdChvblN0ZXBDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEluc3RhbGxTdGVwLmluc3RhbGxGYWlsZWQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBzZXRJc0luc3RhbGxpbmcoZmFsc2UpIHdoZW4gaGFuZGxlRmFpbGVkIGlzIHRyaWdnZXJlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNldElzSW5zdGFsbGluZyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc2V0SXNJbnN0YWxsaW5nPXtzZXRJc0luc3RhbGxpbmd9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWxlZC1idG4nKSlcblxuICAgICAgZXhwZWN0KHNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkVycm9yIHdoZW4gaGFuZGxlRmFpbGVkIGlzIHRyaWdnZXJlZCB3aXRoIGVycm9yIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkVycm9yID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBvbkVycm9yPXtvbkVycm9yfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsZWQtbXNnLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25FcnJvcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ0Vycm9yIG1lc3NhZ2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uRXJyb3Igd2hlbiBoYW5kbGVGYWlsZWQgaXMgdHJpZ2dlcmVkIHdpdGhvdXQgZXJyb3IgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uRXJyb3IgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uRXJyb3I9e29uRXJyb3J9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWxlZC1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uRXJyb3IpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIG9uQ2xvc2UgQ2FsbGJhY2sgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ29uQ2xvc2UgQ2FsbGJhY2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjYW5jZWwgaXMgY2xpY2tlZCBpbiBJbnN0YWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uQ2xvc2U9e29uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWNhbmNlbC1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNhbmNlbCBpcyBjbGlja2VkIGluIEluc3RhbGxlZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBzdGVwPXtJbnN0YWxsU3RlcC5pbnN0YWxsZWR9IG9uQ2xvc2U9e29uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtY2FuY2VsLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBvblN0YXJ0VG9JbnN0YWxsIENhbGxiYWNrIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdvblN0YXJ0VG9JbnN0YWxsIENhbGxiYWNrJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBvblN0YXJ0VG9JbnN0YWxsIHRvIEluc3RhbGwgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TdGFydFRvSW5zdGFsbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gb25TdGFydFRvSW5zdGFsbD17b25TdGFydFRvSW5zdGFsbH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3RhcnQtYnRuJykpXG5cbiAgICAgIGV4cGVjdChvblN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0ZXAgVHJhbnNpdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0ZXAgVHJhbnNpdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdHJhbnNpdGlvbiBmcm9tIHJlYWR5VG9JbnN0YWxsIHRvIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU3RlcENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHN0ZXA9e0luc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsfSBvblN0ZXBDaGFuZ2U9e29uU3RlcENoYW5nZX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEluaXRpYWxseSBzaG93cyBJbnN0YWxsIGNvbXBvbmVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gU2ltdWxhdGUgc3VjY2Vzc2Z1bCBpbnN0YWxsYXRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25TdGVwQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChJbnN0YWxsU3RlcC5pbnN0YWxsZWQpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggbmV3IHN0ZXBcbiAgICAgIHJlcmVuZGVyKDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBzdGVwPXtJbnN0YWxsU3RlcC5pbnN0YWxsZWR9IG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfSAvPilcblxuICAgICAgLy8gTm93IHNob3dzIEluc3RhbGxlZCBjb21wb25lbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdHJhbnNpdGlvbiBmcm9tIHJlYWR5VG9JbnN0YWxsIHRvIGluc3RhbGxGYWlsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblN0ZXBDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxSZWFkeVRvSW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBzdGVwPXtJbnN0YWxsU3RlcC5yZWFkeVRvSW5zdGFsbH0gb25TdGVwQ2hhbmdlPXtvblN0ZXBDaGFuZ2V9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBJbml0aWFsbHkgc2hvd3MgSW5zdGFsbCBjb21wb25lbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFNpbXVsYXRlIGZhaWxlZCBpbnN0YWxsYXRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbGVkLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25TdGVwQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChJbnN0YWxsU3RlcC5pbnN0YWxsRmFpbGVkKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIG5ldyBzdGVwXG4gICAgICByZXJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbEZhaWxlZH0gb25TdGVwQ2hhbmdlPXtvblN0ZXBDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBOb3cgc2hvd3MgSW5zdGFsbGVkIGNvbXBvbmVudCB3aXRoIGZhaWxlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLWlzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgbWFuaWZlc3QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJlYWR5VG9JbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHN0ZXA9e0luc3RhbGxTdGVwLmluc3RhbGxlZH0gbWFuaWZlc3Q9e251bGx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtcGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdudWxsJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBlcnJvck1zZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbEZhaWxlZH0gZXJyb3JNc2c9e251bGx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtZXJyLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnbnVsbCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBlcnJvck1zZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVhZHlUb0luc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gc3RlcD17SW5zdGFsbFN0ZXAuaW5zdGFsbEZhaWxlZH0gZXJyb3JNc2c9XCJcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLWVyci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ251bGwnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlSW5zdGFsbGVkIGNhbGxiYWNrIGFjcm9zcyByZS1yZW5kZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TdGVwQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgc2V0SXNJbnN0YWxsaW5nID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8UmVhZHlUb0luc3RhbGxcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfVxuICAgICAgICAgIHNldElzSW5zdGFsbGluZz17c2V0SXNJbnN0YWxsaW5nfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFJlYWR5VG9JbnN0YWxsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvblN0ZXBDaGFuZ2U9e29uU3RlcENoYW5nZX1cbiAgICAgICAgICBzZXRJc0luc3RhbGxpbmc9e3NldElzSW5zdGFsbGluZ31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENhbGxiYWNrIHNob3VsZCBzdGlsbCB3b3JrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWluc3RhbGxlZC1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uU3RlcENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoSW5zdGFsbFN0ZXAuaW5zdGFsbGVkKVxuICAgICAgZXhwZWN0KHNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZUZhaWxlZCBjYWxsYmFjayBhY3Jvc3MgcmUtcmVuZGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU3RlcENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHNldElzSW5zdGFsbGluZyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uRXJyb3IgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxSZWFkeVRvSW5zdGFsbFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgb25TdGVwQ2hhbmdlPXtvblN0ZXBDaGFuZ2V9XG4gICAgICAgICAgc2V0SXNJbnN0YWxsaW5nPXtzZXRJc0luc3RhbGxpbmd9XG4gICAgICAgICAgb25FcnJvcj17b25FcnJvcn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxSZWFkeVRvSW5zdGFsbFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgb25TdGVwQ2hhbmdlPXtvblN0ZXBDaGFuZ2V9XG4gICAgICAgICAgc2V0SXNJbnN0YWxsaW5nPXtzZXRJc0luc3RhbGxpbmd9XG4gICAgICAgICAgb25FcnJvcj17b25FcnJvcn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENhbGxiYWNrIHNob3VsZCBzdGlsbCB3b3JrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWxlZC1tc2ctYnRuJykpXG5cbiAgICAgIGV4cGVjdChvblN0ZXBDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEluc3RhbGxTdGVwLmluc3RhbGxGYWlsZWQpXG4gICAgICBleHBlY3Qoc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICAgIGV4cGVjdChvbkVycm9yKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnRXJyb3IgbWVzc2FnZScpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=