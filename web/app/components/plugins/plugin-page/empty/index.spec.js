"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const feature_1 = require("@/types/feature");
// ==================== Imports (after mocks) ====================
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Use vi.hoisted to define ALL mock state and functions
const { mockSetActiveTab, mockUseInstalledPluginList, mockState, stableT, } = vitest_1.vi.hoisted(() => {
    const state = {
        filters: {
            categories: [],
            tags: [],
            searchQuery: '',
        },
        systemFeatures: {
            enable_marketplace: true,
            plugin_installation_permission: {
                plugin_installation_scope: 'all',
                restrict_to_marketplace_only: false,
            },
        },
        pluginList: { plugins: [] },
    };
    // Stable t function to prevent infinite re-renders
    // The component's useEffect and useMemo depend on t
    const t = (key) => key;
    return {
        mockSetActiveTab: vitest_1.vi.fn(),
        mockUseInstalledPluginList: vitest_1.vi.fn(() => ({ data: state.pluginList })),
        mockState: state,
        stableT: t,
    };
});
// Mock plugin page context
vitest_1.vi.mock('../context', () => ({
    usePluginPageContext: (selector) => {
        const contextValue = {
            filters: mockState.filters,
            setActiveTab: mockSetActiveTab,
        };
        return selector(contextValue);
    },
}));
// Mock global public store (Zustand store)
vitest_1.vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: (selector) => {
        return selector({
            systemFeatures: {
                ...feature_1.defaultSystemFeatures,
                ...mockState.systemFeatures,
            },
        });
    },
}));
// Mock useInstalledPluginList hook
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInstalledPluginList: () => mockUseInstalledPluginList(),
}));
// Mock InstallFromGitHub component
vitest_1.vi.mock('@/app/components/plugins/install-plugin/install-from-github', () => ({
    default: ({ onClose }) => (<div data-testid="install-from-github-modal">
      <button data-testid="github-modal-close" onClick={onClose}>Close</button>
      <button data-testid="github-modal-success">Success</button>
    </div>),
}));
// Mock InstallFromLocalPackage component
vitest_1.vi.mock('@/app/components/plugins/install-plugin/install-from-local-package', () => ({
    default: ({ file, onClose }) => (<div data-testid="install-from-local-modal" data-file-name={file.name}>
      <button data-testid="local-modal-close" onClick={onClose}>Close</button>
      <button data-testid="local-modal-success">Success</button>
    </div>),
}));
// Mock Line component
vitest_1.vi.mock('../../marketplace/empty/line', () => ({
    default: ({ className }) => <div data-testid="line-component" className={className}/>,
}));
// Override react-i18next with stable t function reference to prevent infinite re-renders
// The component's useEffect and useMemo depend on t, so it MUST be stable
vitest_1.vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: stableT,
        i18n: {
            language: 'en',
            changeLanguage: vitest_1.vi.fn(),
        },
    }),
}));
// ==================== Test Utilities ====================
const resetMockState = () => {
    mockState.filters = { categories: [], tags: [], searchQuery: '' };
    mockState.systemFeatures = {
        enable_marketplace: true,
        plugin_installation_permission: {
            plugin_installation_scope: feature_1.InstallationScope.ALL,
            restrict_to_marketplace_only: false,
        },
    };
    mockState.pluginList = { plugins: [] };
    mockUseInstalledPluginList.mockReturnValue({ data: mockState.pluginList });
};
const setMockFilters = (filters) => {
    mockState.filters = { ...mockState.filters, ...filters };
};
const setMockSystemFeatures = (features) => {
    mockState.systemFeatures = { ...mockState.systemFeatures, ...features };
};
const setMockPluginList = (list) => {
    mockState.pluginList = list;
    mockUseInstalledPluginList.mockReturnValue({ data: list });
};
const createMockFile = (name, type = 'application/octet-stream') => {
    return new File(['test'], name, { type });
};
// Helper to wait for useEffect to complete (single tick)
const flushEffects = async () => {
    await (0, react_1.act)(async () => { });
};
// ==================== Tests ====================
(0, vitest_1.describe)('Empty Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        resetMockState();
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render basic structure correctly', async () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert - file input
            const fileInput = document.querySelector('input[type="file"]');
            (0, vitest_1.expect)(fileInput).toBeInTheDocument();
            (0, vitest_1.expect)(fileInput.style.display).toBe('none');
            (0, vitest_1.expect)(fileInput.accept).toBe('.difypkg,.difybndl');
            // Assert - skeleton cards (20 in the grid + 1 icon container)
            const skeletonCards = container.querySelectorAll('.rounded-xl.bg-components-card-bg');
            (0, vitest_1.expect)(skeletonCards.length).toBeGreaterThanOrEqual(20);
            // Assert - group icon container
            const iconContainer = document.querySelector('.size-14');
            (0, vitest_1.expect)(iconContainer).toBeInTheDocument();
            // Assert - line components
            const lines = react_1.screen.getAllByTestId('line-component');
            (0, vitest_1.expect)(lines).toHaveLength(4);
        });
    });
    // ==================== Text Display Tests (useMemo) ====================
    (0, vitest_1.describe)('Text Display (useMemo)', () => {
        (0, vitest_1.it)('should display "noInstalled" text when plugin list is empty', async () => {
            // Arrange
            setMockPluginList({ plugins: [] });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('list.noInstalled')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display "notFound" text when filters are active with plugins', async () => {
            // Arrange
            setMockPluginList({ plugins: [{ id: 'plugin-1' }] });
            // Test categories filter
            setMockFilters({ categories: ['model'] });
            const { rerender } = (0, react_1.render)(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getByText('list.notFound')).toBeInTheDocument();
            // Test tags filter
            setMockFilters({ categories: [], tags: ['tag1'] });
            rerender(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getByText('list.notFound')).toBeInTheDocument();
            // Test searchQuery filter
            setMockFilters({ tags: [], searchQuery: 'test query' });
            rerender(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getByText('list.notFound')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should prioritize "noInstalled" over "notFound" when no plugins exist', async () => {
            // Arrange
            setMockFilters({ categories: ['model'], searchQuery: 'test' });
            setMockPluginList({ plugins: [] });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('list.noInstalled')).toBeInTheDocument();
        });
    });
    // ==================== Install Methods Tests (useEffect) ====================
    (0, vitest_1.describe)('Install Methods (useEffect)', () => {
        (0, vitest_1.it)('should render all three install methods when marketplace enabled and not restricted', async () => {
            // Arrange
            setMockSystemFeatures({
                enable_marketplace: true,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: false,
                },
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons).toHaveLength(3);
            (0, vitest_1.expect)(react_1.screen.getByText('source.marketplace')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('source.github')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('source.local')).toBeInTheDocument();
            // Verify button order
            const buttonTexts = buttons.map(btn => btn.textContent);
            (0, vitest_1.expect)(buttonTexts[0]).toContain('source.marketplace');
            (0, vitest_1.expect)(buttonTexts[1]).toContain('source.github');
            (0, vitest_1.expect)(buttonTexts[2]).toContain('source.local');
        });
        (0, vitest_1.it)('should render only marketplace method when restricted to marketplace only', async () => {
            // Arrange
            setMockSystemFeatures({
                enable_marketplace: true,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: true,
                },
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons).toHaveLength(1);
            (0, vitest_1.expect)(react_1.screen.getByText('source.marketplace')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('source.github')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('source.local')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render github and local methods when marketplace is disabled', async () => {
            // Arrange
            setMockSystemFeatures({
                enable_marketplace: false,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: false,
                },
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons).toHaveLength(2);
            (0, vitest_1.expect)(react_1.screen.queryByText('source.marketplace')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('source.github')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('source.local')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render no methods when marketplace disabled and restricted', async () => {
            // Arrange
            setMockSystemFeatures({
                enable_marketplace: false,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: true,
                },
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert
            const buttons = react_1.screen.queryAllByRole('button');
            (0, vitest_1.expect)(buttons).toHaveLength(0);
        });
    });
    // ==================== User Interactions Tests ====================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call setActiveTab with "discover" when marketplace button is clicked', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('source.marketplace'));
            // Assert
            (0, vitest_1.expect)(mockSetActiveTab).toHaveBeenCalledWith('discover');
        });
        (0, vitest_1.it)('should open and close GitHub modal correctly', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert - initially no modal
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-github-modal')).not.toBeInTheDocument();
            // Act - open modal
            react_1.fireEvent.click(react_1.screen.getByText('source.github'));
            // Assert - modal is open
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github-modal')).toBeInTheDocument();
            // Act - close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('github-modal-close'));
            // Assert - modal is closed
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-github-modal')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should trigger file input click when local button is clicked', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            const fileInput = document.querySelector('input[type="file"]');
            const clickSpy = vitest_1.vi.spyOn(fileInput, 'click');
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('source.local'));
            // Assert
            (0, vitest_1.expect)(clickSpy).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should open and close local modal when file is selected', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            const fileInput = document.querySelector('input[type="file"]');
            const mockFile = createMockFile('test-plugin.difypkg');
            // Assert - initially no modal
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
            // Act - select file
            Object.defineProperty(fileInput, 'files', { value: [mockFile], writable: true });
            react_1.fireEvent.change(fileInput);
            // Assert - modal is open with correct file
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-local-modal')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-local-modal')).toHaveAttribute('data-file-name', 'test-plugin.difypkg');
            // Act - close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('local-modal-close'));
            // Assert - modal is closed
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not open local modal when no file is selected', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            const fileInput = document.querySelector('input[type="file"]');
            // Act - trigger change with empty files
            Object.defineProperty(fileInput, 'files', { value: [], writable: true });
            react_1.fireEvent.change(fileInput);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
        });
    });
    // ==================== State Management Tests ====================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should maintain modal state correctly and allow reopening', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Act - Open, close, and reopen GitHub modal
            react_1.fireEvent.click(react_1.screen.getByText('source.github'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github-modal')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('github-modal-close'));
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-github-modal')).not.toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByText('source.github'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github-modal')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should update selectedFile state when file is selected', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            const fileInput = document.querySelector('input[type="file"]');
            // Act - select .difypkg file
            Object.defineProperty(fileInput, 'files', { value: [createMockFile('my-plugin.difypkg')], writable: true });
            react_1.fireEvent.change(fileInput);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-local-modal')).toHaveAttribute('data-file-name', 'my-plugin.difypkg');
            // Close and select .difybndl file
            react_1.fireEvent.click(react_1.screen.getByTestId('local-modal-close'));
            Object.defineProperty(fileInput, 'files', { value: [createMockFile('test-bundle.difybndl')], writable: true });
            react_1.fireEvent.change(fileInput);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-local-modal')).toHaveAttribute('data-file-name', 'test-bundle.difybndl');
        });
    });
    // ==================== Side Effects Tests ====================
    (0, vitest_1.describe)('Side Effects', () => {
        (0, vitest_1.it)('should render correct install methods based on system features', async () => {
            // Test 1: All methods when marketplace enabled and not restricted
            setMockSystemFeatures({
                enable_marketplace: true,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: false,
                },
            });
            const { unmount: unmount1 } = (0, react_1.render)(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getAllByRole('button')).toHaveLength(3);
            unmount1();
            // Test 2: Only marketplace when restricted
            setMockSystemFeatures({
                enable_marketplace: true,
                plugin_installation_permission: {
                    plugin_installation_scope: feature_1.InstallationScope.ALL,
                    restrict_to_marketplace_only: true,
                },
            });
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getAllByRole('button')).toHaveLength(1);
            (0, vitest_1.expect)(react_1.screen.getByText('source.marketplace')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render correct text based on plugin list and filters', async () => {
            // Test 1: noInstalled when plugin list is empty
            setMockPluginList({ plugins: [] });
            setMockFilters({ categories: [], tags: [], searchQuery: '' });
            const { unmount: unmount1 } = (0, react_1.render)(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getByText('list.noInstalled')).toBeInTheDocument();
            unmount1();
            // Test 2: notFound when filters are active with plugins
            setMockFilters({ categories: ['tool'] });
            setMockPluginList({ plugins: [{ id: 'plugin-1' }] });
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            (0, vitest_1.expect)(react_1.screen.getByText('list.notFound')).toBeInTheDocument();
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle undefined plugin data gracefully', () => {
            // Test undefined plugin list - component should render without error
            setMockPluginList(undefined);
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default />)).not.toThrow();
        });
        (0, vitest_1.it)('should handle file input edge cases', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            const fileInput = document.querySelector('input[type="file"]');
            // Test undefined files
            Object.defineProperty(fileInput, 'files', { value: undefined, writable: true });
            react_1.fireEvent.change(fileInput);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
        });
    });
    // ==================== React.memo Tests ====================
    (0, vitest_1.describe)('React.memo Behavior', () => {
        (0, vitest_1.it)('should be wrapped with React.memo and have displayName', () => {
            // Assert
            (0, vitest_1.expect)(index_1.default).toBeDefined();
            (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
            (0, vitest_1.expect)(index_1.default.displayName || index_1.default.type?.displayName).toBeDefined();
        });
    });
    // ==================== Modal Callbacks Tests ====================
    (0, vitest_1.describe)('Modal Callbacks', () => {
        (0, vitest_1.it)('should handle modal onSuccess callbacks (noop)', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Test GitHub modal onSuccess
            react_1.fireEvent.click(react_1.screen.getByText('source.github'));
            react_1.fireEvent.click(react_1.screen.getByTestId('github-modal-success'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github-modal')).toBeInTheDocument();
            // Close GitHub modal and test Local modal onSuccess
            react_1.fireEvent.click(react_1.screen.getByTestId('github-modal-close'));
            const fileInput = document.querySelector('input[type="file"]');
            Object.defineProperty(fileInput, 'files', { value: [createMockFile('test-plugin.difypkg')], writable: true });
            react_1.fireEvent.change(fileInput);
            react_1.fireEvent.click(react_1.screen.getByTestId('local-modal-success'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-local-modal')).toBeInTheDocument();
        });
    });
    // ==================== Conditional Modal Rendering ====================
    (0, vitest_1.describe)('Conditional Modal Rendering', () => {
        (0, vitest_1.it)('should only render one modal at a time and require file for local modal', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            await flushEffects();
            // Assert - no modals initially
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-github-modal')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
            // Open GitHub modal - only GitHub modal visible
            react_1.fireEvent.click(react_1.screen.getByText('source.github'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github-modal')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
            // Click local button - triggers file input, no modal yet (no file selected)
            react_1.fireEvent.click(react_1.screen.getByText('source.local'));
            // GitHub modal should still be visible, local modal requires file selection
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-local-modal')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQXVFO0FBQ3ZFLG1DQUE2RDtBQUM3RCw2Q0FBMEU7QUFFMUUsa0VBQWtFO0FBRWxFLG1DQUEyQjtBQUUzQix1REFBdUQ7QUFFdkQsd0RBQXdEO0FBQ3hELE1BQU0sRUFDSixnQkFBZ0IsRUFDaEIsMEJBQTBCLEVBQzFCLFNBQVMsRUFDVCxPQUFPLEdBQ1IsR0FBRyxXQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtJQUNsQixNQUFNLEtBQUssR0FBRztRQUNaLE9BQU8sRUFBRTtZQUNQLFVBQVUsRUFBRSxFQUFjO1lBQzFCLElBQUksRUFBRSxFQUFjO1lBQ3BCLFdBQVcsRUFBRSxFQUFFO1NBQ0Q7UUFDaEIsY0FBYyxFQUFFO1lBQ2Qsa0JBQWtCLEVBQUUsSUFBSTtZQUN4Qiw4QkFBOEIsRUFBRTtnQkFDOUIseUJBQXlCLEVBQUUsS0FBYztnQkFDekMsNEJBQTRCLEVBQUUsS0FBSzthQUNwQztTQUN5QjtRQUM1QixVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBMkIsRUFBb0Q7S0FDdkcsQ0FBQTtJQUNELG1EQUFtRDtJQUNuRCxvREFBb0Q7SUFDcEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQTtJQUM5QixPQUFPO1FBQ0wsZ0JBQWdCLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QiwwQkFBMEIsRUFBRSxXQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDckUsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLENBQUM7S0FDWCxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFRiwyQkFBMkI7QUFDM0IsV0FBRSxDQUFDLElB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QixFQUFFLENBQUE7WUFDakYsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFaEYsZ0RBQWdEO1lBQ2hELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUNsRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRWhGLDRFQUE0RTtZQUM1RSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7WUFDakQsNEVBQTRFO1lBQzVFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRmlsdGVyU3RhdGUgfSBmcm9tICcuLi9maWx0ZXItbWFuYWdlbWVudCdcbmltcG9ydCB0eXBlIHsgU3lzdGVtRmVhdHVyZXMgfSBmcm9tICdAL3R5cGVzL2ZlYXR1cmUnXG5pbXBvcnQgeyBhY3QsIGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgZGVmYXVsdFN5c3RlbUZlYXR1cmVzLCBJbnN0YWxsYXRpb25TY29wZSB9IGZyb20gJ0AvdHlwZXMvZmVhdHVyZSdcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gSW1wb3J0cyAoYWZ0ZXIgbW9ja3MpID09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCBFbXB0eSBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBNb2NrIFNldHVwID09PT09PT09PT09PT09PT09PT09XG5cbi8vIFVzZSB2aS5ob2lzdGVkIHRvIGRlZmluZSBBTEwgbW9jayBzdGF0ZSBhbmQgZnVuY3Rpb25zXG5jb25zdCB7XG4gIG1vY2tTZXRBY3RpdmVUYWIsXG4gIG1vY2tVc2VJbnN0YWxsZWRQbHVnaW5MaXN0LFxuICBtb2NrU3RhdGUsXG4gIHN0YWJsZVQsXG59ID0gdmkuaG9pc3RlZCgoKSA9PiB7XG4gIGNvbnN0IHN0YXRlID0ge1xuICAgIGZpbHRlcnM6IHtcbiAgICAgIGNhdGVnb3JpZXM6IFtdIGFzIHN0cmluZ1tdLFxuICAgICAgdGFnczogW10gYXMgc3RyaW5nW10sXG4gICAgICBzZWFyY2hRdWVyeTogJycsXG4gICAgfSBhcyBGaWx0ZXJTdGF0ZSxcbiAgICBzeXN0ZW1GZWF0dXJlczoge1xuICAgICAgZW5hYmxlX21hcmtldHBsYWNlOiB0cnVlLFxuICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9wZXJtaXNzaW9uOiB7XG4gICAgICAgIHBsdWdpbl9pbnN0YWxsYXRpb25fc2NvcGU6ICdhbGwnIGFzIGNvbnN0LFxuICAgICAgICByZXN0cmljdF90b19tYXJrZXRwbGFjZV9vbmx5OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSBhcyBQYXJ0aWFsPFN5c3RlbUZlYXR1cmVzPixcbiAgICBwbHVnaW5MaXN0OiB7IHBsdWdpbnM6IFtdIGFzIEFycmF5PHsgaWQ6IHN0cmluZyB9PiB9IGFzIHsgcGx1Z2luczogQXJyYXk8eyBpZDogc3RyaW5nIH0+IH0gfCB1bmRlZmluZWQsXG4gIH1cbiAgLy8gU3RhYmxlIHQgZnVuY3Rpb24gdG8gcHJldmVudCBpbmZpbml0ZSByZS1yZW5kZXJzXG4gIC8vIFRoZSBjb21wb25lbnQncyB1c2VFZmZlY3QgYW5kIHVzZU1lbW8gZGVwZW5kIG9uIHRcbiAgY29uc3QgdCA9IChrZXk6IHN0cmluZykgPT4ga2V5XG4gIHJldHVybiB7XG4gICAgbW9ja1NldEFjdGl2ZVRhYjogdmkuZm4oKSxcbiAgICBtb2NrVXNlSW5zdGFsbGVkUGx1Z2luTGlzdDogdmkuZm4oKCkgPT4gKHsgZGF0YTogc3RhdGUucGx1Z2luTGlzdCB9KSksXG4gICAgbW9ja1N0YXRlOiBzdGF0ZSxcbiAgICBzdGFibGVUOiB0LFxuICB9XG59KVxuXG4vLyBNb2NrIHBsdWdpbiBwYWdlIGNvbnRleHRcbnZpLm1vY2soJy4uL2NvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQbHVnaW5QYWdlQ29udGV4dDogKHNlbGVjdG9yOiAodmFsdWU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgY29uc3QgY29udGV4dFZhbHVlID0ge1xuICAgICAgZmlsdGVyczogbW9ja1N0YXRlLmZpbHRlcnMsXG4gICAgICBzZXRBY3RpdmVUYWI6IG1vY2tTZXRBY3RpdmVUYWIsXG4gICAgfVxuICAgIHJldHVybiBzZWxlY3Rvcihjb250ZXh0VmFsdWUpXG4gIH0sXG59KSlcblxuLy8gTW9jayBnbG9iYWwgcHVibGljIHN0b3JlIChadXN0YW5kIHN0b3JlKVxudmkubW9jaygnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUdsb2JhbFB1YmxpY1N0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogYW55KSA9PiBhbnkpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0b3Ioe1xuICAgICAgc3lzdGVtRmVhdHVyZXM6IHtcbiAgICAgICAgLi4uZGVmYXVsdFN5c3RlbUZlYXR1cmVzLFxuICAgICAgICAuLi5tb2NrU3RhdGUuc3lzdGVtRmVhdHVyZXMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0sXG59KSlcblxuLy8gTW9jayB1c2VJbnN0YWxsZWRQbHVnaW5MaXN0IGhvb2tcbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGx1Z2lucycsICgpID0+ICh7XG4gIHVzZUluc3RhbGxlZFBsdWdpbkxpc3Q6ICgpID0+IG1vY2tVc2VJbnN0YWxsZWRQbHVnaW5MaXN0KCksXG59KSlcblxuLy8gTW9jayBJbnN0YWxsRnJvbUdpdEh1YiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9pbnN0YWxsLXBsdWdpbi9pbnN0YWxsLWZyb20tZ2l0aHViJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb25DbG9zZSB9OiB7IG9uU3VjY2VzczogKCkgPT4gdm9pZCwgb25DbG9zZTogKCkgPT4gdm9pZCB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImluc3RhbGwtZnJvbS1naXRodWItbW9kYWxcIj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJnaXRodWItbW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImdpdGh1Yi1tb2RhbC1zdWNjZXNzXCI+U3VjY2VzczwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgSW5zdGFsbEZyb21Mb2NhbFBhY2thZ2UgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaW5zdGFsbC1mcm9tLWxvY2FsLXBhY2thZ2UnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBmaWxlLCBvbkNsb3NlIH06IHsgZmlsZTogRmlsZSwgb25TdWNjZXNzOiAoKSA9PiB2b2lkLCBvbkNsb3NlOiAoKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1mcm9tLWxvY2FsLW1vZGFsXCIgZGF0YS1maWxlLW5hbWU9e2ZpbGUubmFtZX0+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibG9jYWwtbW9kYWwtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImxvY2FsLW1vZGFsLXN1Y2Nlc3NcIj5TdWNjZXNzPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBMaW5lIGNvbXBvbmVudFxudmkubW9jaygnLi4vLi4vbWFya2V0cGxhY2UvZW1wdHkvbGluZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwibGluZS1jb21wb25lbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gLz4sXG59KSlcblxuLy8gT3ZlcnJpZGUgcmVhY3QtaTE4bmV4dCB3aXRoIHN0YWJsZSB0IGZ1bmN0aW9uIHJlZmVyZW5jZSB0byBwcmV2ZW50IGluZmluaXRlIHJlLXJlbmRlcnNcbi8vIFRoZSBjb21wb25lbnQncyB1c2VFZmZlY3QgYW5kIHVzZU1lbW8gZGVwZW5kIG9uIHQsIHNvIGl0IE1VU1QgYmUgc3RhYmxlXG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgKCkgPT4gKHtcbiAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgdDogc3RhYmxlVCxcbiAgICBpMThuOiB7XG4gICAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICAgIGNoYW5nZUxhbmd1YWdlOiB2aS5mbigpLFxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3QgVXRpbGl0aWVzID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IHJlc2V0TW9ja1N0YXRlID0gKCkgPT4ge1xuICBtb2NrU3RhdGUuZmlsdGVycyA9IHsgY2F0ZWdvcmllczogW10sIHRhZ3M6IFtdLCBzZWFyY2hRdWVyeTogJycgfVxuICBtb2NrU3RhdGUuc3lzdGVtRmVhdHVyZXMgPSB7XG4gICAgZW5hYmxlX21hcmtldHBsYWNlOiB0cnVlLFxuICAgIHBsdWdpbl9pbnN0YWxsYXRpb25fcGVybWlzc2lvbjoge1xuICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9zY29wZTogSW5zdGFsbGF0aW9uU2NvcGUuQUxMLFxuICAgICAgcmVzdHJpY3RfdG9fbWFya2V0cGxhY2Vfb25seTogZmFsc2UsXG4gICAgfSxcbiAgfVxuICBtb2NrU3RhdGUucGx1Z2luTGlzdCA9IHsgcGx1Z2luczogW10gfVxuICBtb2NrVXNlSW5zdGFsbGVkUGx1Z2luTGlzdC5tb2NrUmV0dXJuVmFsdWUoeyBkYXRhOiBtb2NrU3RhdGUucGx1Z2luTGlzdCB9KVxufVxuXG5jb25zdCBzZXRNb2NrRmlsdGVycyA9IChmaWx0ZXJzOiBQYXJ0aWFsPEZpbHRlclN0YXRlPikgPT4ge1xuICBtb2NrU3RhdGUuZmlsdGVycyA9IHsgLi4ubW9ja1N0YXRlLmZpbHRlcnMsIC4uLmZpbHRlcnMgfVxufVxuXG5jb25zdCBzZXRNb2NrU3lzdGVtRmVhdHVyZXMgPSAoZmVhdHVyZXM6IFBhcnRpYWw8U3lzdGVtRmVhdHVyZXM+KSA9PiB7XG4gIG1vY2tTdGF0ZS5zeXN0ZW1GZWF0dXJlcyA9IHsgLi4ubW9ja1N0YXRlLnN5c3RlbUZlYXR1cmVzLCAuLi5mZWF0dXJlcyB9XG59XG5cbmNvbnN0IHNldE1vY2tQbHVnaW5MaXN0ID0gKGxpc3Q6IHsgcGx1Z2luczogQXJyYXk8eyBpZDogc3RyaW5nIH0+IH0gfCB1bmRlZmluZWQpID0+IHtcbiAgbW9ja1N0YXRlLnBsdWdpbkxpc3QgPSBsaXN0XG4gIG1vY2tVc2VJbnN0YWxsZWRQbHVnaW5MaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7IGRhdGE6IGxpc3QgfSlcbn1cblxuY29uc3QgY3JlYXRlTW9ja0ZpbGUgPSAobmFtZTogc3RyaW5nLCB0eXBlID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpOiBGaWxlID0+IHtcbiAgcmV0dXJuIG5ldyBGaWxlKFsndGVzdCddLCBuYW1lLCB7IHR5cGUgfSlcbn1cblxuLy8gSGVscGVyIHRvIHdhaXQgZm9yIHVzZUVmZmVjdCB0byBjb21wbGV0ZSAoc2luZ2xlIHRpY2spXG5jb25zdCBmbHVzaEVmZmVjdHMgPSBhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7fSlcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0VtcHR5IENvbXBvbmVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcmVzZXRNb2NrU3RhdGUoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFJlbmRlcmluZyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJhc2ljIHN0cnVjdHVyZSBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG5cbiAgICAgIC8vIEFzc2VydCAtIGZpbGUgaW5wdXRcbiAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgZXhwZWN0KGZpbGVJbnB1dCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGZpbGVJbnB1dC5zdHlsZS5kaXNwbGF5KS50b0JlKCdub25lJylcbiAgICAgIGV4cGVjdChmaWxlSW5wdXQuYWNjZXB0KS50b0JlKCcuZGlmeXBrZywuZGlmeWJuZGwnKVxuXG4gICAgICAvLyBBc3NlcnQgLSBza2VsZXRvbiBjYXJkcyAoMjAgaW4gdGhlIGdyaWQgKyAxIGljb24gY29udGFpbmVyKVxuICAgICAgY29uc3Qgc2tlbGV0b25DYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucm91bmRlZC14bC5iZy1jb21wb25lbnRzLWNhcmQtYmcnKVxuICAgICAgZXhwZWN0KHNrZWxldG9uQ2FyZHMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDIwKVxuXG4gICAgICAvLyBBc3NlcnQgLSBncm91cCBpY29uIGNvbnRhaW5lclxuICAgICAgY29uc3QgaWNvbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaXplLTE0JylcbiAgICAgIGV4cGVjdChpY29uQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIGxpbmUgY29tcG9uZW50c1xuICAgICAgY29uc3QgbGluZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2xpbmUtY29tcG9uZW50JylcbiAgICAgIGV4cGVjdChsaW5lcykudG9IYXZlTGVuZ3RoKDQpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBUZXh0IERpc3BsYXkgVGVzdHMgKHVzZU1lbW8pID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUZXh0IERpc3BsYXkgKHVzZU1lbW8pJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBcIm5vSW5zdGFsbGVkXCIgdGV4dCB3aGVuIHBsdWdpbiBsaXN0IGlzIGVtcHR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0TW9ja1BsdWdpbkxpc3QoeyBwbHVnaW5zOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdsaXN0Lm5vSW5zdGFsbGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IFwibm90Rm91bmRcIiB0ZXh0IHdoZW4gZmlsdGVycyBhcmUgYWN0aXZlIHdpdGggcGx1Z2lucycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldE1vY2tQbHVnaW5MaXN0KHsgcGx1Z2luczogW3sgaWQ6ICdwbHVnaW4tMScgfV0gfSlcblxuICAgICAgLy8gVGVzdCBjYXRlZ29yaWVzIGZpbHRlclxuICAgICAgc2V0TW9ja0ZpbHRlcnMoeyBjYXRlZ29yaWVzOiBbJ21vZGVsJ10gfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2xpc3Qubm90Rm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBUZXN0IHRhZ3MgZmlsdGVyXG4gICAgICBzZXRNb2NrRmlsdGVycyh7IGNhdGVnb3JpZXM6IFtdLCB0YWdzOiBbJ3RhZzEnXSB9KVxuICAgICAgcmVyZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdsaXN0Lm5vdEZvdW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gVGVzdCBzZWFyY2hRdWVyeSBmaWx0ZXJcbiAgICAgIHNldE1vY2tGaWx0ZXJzKHsgdGFnczogW10sIHNlYXJjaFF1ZXJ5OiAndGVzdCBxdWVyeScgfSlcbiAgICAgIHJlcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbGlzdC5ub3RGb3VuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJpb3JpdGl6ZSBcIm5vSW5zdGFsbGVkXCIgb3ZlciBcIm5vdEZvdW5kXCIgd2hlbiBubyBwbHVnaW5zIGV4aXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0TW9ja0ZpbHRlcnMoeyBjYXRlZ29yaWVzOiBbJ21vZGVsJ10sIHNlYXJjaFF1ZXJ5OiAndGVzdCcgfSlcbiAgICAgIHNldE1vY2tQbHVnaW5MaXN0KHsgcGx1Z2luczogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbGlzdC5ub0luc3RhbGxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBJbnN0YWxsIE1ldGhvZHMgVGVzdHMgKHVzZUVmZmVjdCkgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0luc3RhbGwgTWV0aG9kcyAodXNlRWZmZWN0KScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgdGhyZWUgaW5zdGFsbCBtZXRob2RzIHdoZW4gbWFya2V0cGxhY2UgZW5hYmxlZCBhbmQgbm90IHJlc3RyaWN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXRNb2NrU3lzdGVtRmVhdHVyZXMoe1xuICAgICAgICBlbmFibGVfbWFya2V0cGxhY2U6IHRydWUsXG4gICAgICAgIHBsdWdpbl9pbnN0YWxsYXRpb25fcGVybWlzc2lvbjoge1xuICAgICAgICAgIHBsdWdpbl9pbnN0YWxsYXRpb25fc2NvcGU6IEluc3RhbGxhdGlvblNjb3BlLkFMTCxcbiAgICAgICAgICByZXN0cmljdF90b19tYXJrZXRwbGFjZV9vbmx5OiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLm1hcmtldHBsYWNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzb3VyY2UuZ2l0aHViJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzb3VyY2UubG9jYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBWZXJpZnkgYnV0dG9uIG9yZGVyXG4gICAgICBjb25zdCBidXR0b25UZXh0cyA9IGJ1dHRvbnMubWFwKGJ0biA9PiBidG4udGV4dENvbnRlbnQpXG4gICAgICBleHBlY3QoYnV0dG9uVGV4dHNbMF0pLnRvQ29udGFpbignc291cmNlLm1hcmtldHBsYWNlJylcbiAgICAgIGV4cGVjdChidXR0b25UZXh0c1sxXSkudG9Db250YWluKCdzb3VyY2UuZ2l0aHViJylcbiAgICAgIGV4cGVjdChidXR0b25UZXh0c1syXSkudG9Db250YWluKCdzb3VyY2UubG9jYWwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvbmx5IG1hcmtldHBsYWNlIG1ldGhvZCB3aGVuIHJlc3RyaWN0ZWQgdG8gbWFya2V0cGxhY2Ugb25seScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldE1vY2tTeXN0ZW1GZWF0dXJlcyh7XG4gICAgICAgIGVuYWJsZV9tYXJrZXRwbGFjZTogdHJ1ZSxcbiAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9wZXJtaXNzaW9uOiB7XG4gICAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9zY29wZTogSW5zdGFsbGF0aW9uU2NvcGUuQUxMLFxuICAgICAgICAgIHJlc3RyaWN0X3RvX21hcmtldHBsYWNlX29ubHk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3NvdXJjZS5tYXJrZXRwbGFjZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdzb3VyY2UuZ2l0aHViJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdzb3VyY2UubG9jYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZ2l0aHViIGFuZCBsb2NhbCBtZXRob2RzIHdoZW4gbWFya2V0cGxhY2UgaXMgZGlzYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXRNb2NrU3lzdGVtRmVhdHVyZXMoe1xuICAgICAgICBlbmFibGVfbWFya2V0cGxhY2U6IGZhbHNlLFxuICAgICAgICBwbHVnaW5faW5zdGFsbGF0aW9uX3Blcm1pc3Npb246IHtcbiAgICAgICAgICBwbHVnaW5faW5zdGFsbGF0aW9uX3Njb3BlOiBJbnN0YWxsYXRpb25TY29wZS5BTEwsXG4gICAgICAgICAgcmVzdHJpY3RfdG9fbWFya2V0cGxhY2Vfb25seTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnc291cmNlLm1hcmtldHBsYWNlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLmdpdGh1YicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLmxvY2FsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbm8gbWV0aG9kcyB3aGVuIG1hcmtldHBsYWNlIGRpc2FibGVkIGFuZCByZXN0cmljdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0TW9ja1N5c3RlbUZlYXR1cmVzKHtcbiAgICAgICAgZW5hYmxlX21hcmtldHBsYWNlOiBmYWxzZSxcbiAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9wZXJtaXNzaW9uOiB7XG4gICAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9zY29wZTogSW5zdGFsbGF0aW9uU2NvcGUuQUxMLFxuICAgICAgICAgIHJlc3RyaWN0X3RvX21hcmtldHBsYWNlX29ubHk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4ucXVlcnlBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucykudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBVc2VyIEludGVyYWN0aW9ucyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldEFjdGl2ZVRhYiB3aXRoIFwiZGlzY292ZXJcIiB3aGVuIG1hcmtldHBsYWNlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3NvdXJjZS5tYXJrZXRwbGFjZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0QWN0aXZlVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZGlzY292ZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gYW5kIGNsb3NlIEdpdEh1YiBtb2RhbCBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcblxuICAgICAgLy8gQXNzZXJ0IC0gaW5pdGlhbGx5IG5vIG1vZGFsXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWItbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gb3BlbiBtb2RhbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3NvdXJjZS5naXRodWInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgaXMgb3BlblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWdpdGh1Yi1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIGNsb3NlIG1vZGFsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdnaXRodWItbW9kYWwtY2xvc2UnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgaXMgY2xvc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWItbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGZpbGUgaW5wdXQgY2xpY2sgd2hlbiBsb2NhbCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImZpbGVcIl0nKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBjb25zdCBjbGlja1NweSA9IHZpLnNweU9uKGZpbGVJbnB1dCwgJ2NsaWNrJylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLmxvY2FsJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNsaWNrU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFuZCBjbG9zZSBsb2NhbCBtb2RhbCB3aGVuIGZpbGUgaXMgc2VsZWN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgY29uc3QgbW9ja0ZpbGUgPSBjcmVhdGVNb2NrRmlsZSgndGVzdC1wbHVnaW4uZGlmeXBrZycpXG5cbiAgICAgIC8vIEFzc2VydCAtIGluaXRpYWxseSBubyBtb2RhbFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsLWZyb20tbG9jYWwtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gc2VsZWN0IGZpbGVcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlSW5wdXQsICdmaWxlcycsIHsgdmFsdWU6IFttb2NrRmlsZV0sIHdyaXRhYmxlOiB0cnVlIH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGZpbGVJbnB1dClcblxuICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgaXMgb3BlbiB3aXRoIGNvcnJlY3QgZmlsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWxvY2FsLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZmlsZS1uYW1lJywgJ3Rlc3QtcGx1Z2luLmRpZnlwa2cnKVxuXG4gICAgICAvLyBBY3QgLSBjbG9zZSBtb2RhbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9jYWwtbW9kYWwtY2xvc2UnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgaXMgY2xvc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBvcGVuIGxvY2FsIG1vZGFsIHdoZW4gbm8gZmlsZSBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuICAgICAgY29uc3QgZmlsZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImZpbGVcIl0nKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cbiAgICAgIC8vIEFjdCAtIHRyaWdnZXIgY2hhbmdlIHdpdGggZW1wdHkgZmlsZXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlSW5wdXQsICdmaWxlcycsIHsgdmFsdWU6IFtdLCB3cml0YWJsZTogdHJ1ZSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShmaWxlSW5wdXQpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsLWZyb20tbG9jYWwtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFN0YXRlIE1hbmFnZW1lbnQgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBtb2RhbCBzdGF0ZSBjb3JyZWN0bHkgYW5kIGFsbG93IHJlb3BlbmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuLCBjbG9zZSwgYW5kIHJlb3BlbiBHaXRIdWIgbW9kYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdzb3VyY2UuZ2l0aHViJykpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZyb20tZ2l0aHViLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZ2l0aHViLW1vZGFsLWNsb3NlJykpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWItbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3NvdXJjZS5naXRodWInKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWItbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBzZWxlY3RlZEZpbGUgc3RhdGUgd2hlbiBmaWxlIGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG4gICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcblxuICAgICAgLy8gQWN0IC0gc2VsZWN0IC5kaWZ5cGtnIGZpbGVcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlSW5wdXQsICdmaWxlcycsIHsgdmFsdWU6IFtjcmVhdGVNb2NrRmlsZSgnbXktcGx1Z2luLmRpZnlwa2cnKV0sIHdyaXRhYmxlOiB0cnVlIH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGZpbGVJbnB1dClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZmlsZS1uYW1lJywgJ215LXBsdWdpbi5kaWZ5cGtnJylcblxuICAgICAgLy8gQ2xvc2UgYW5kIHNlbGVjdCAuZGlmeWJuZGwgZmlsZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9jYWwtbW9kYWwtY2xvc2UnKSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlSW5wdXQsICdmaWxlcycsIHsgdmFsdWU6IFtjcmVhdGVNb2NrRmlsZSgndGVzdC1idW5kbGUuZGlmeWJuZGwnKV0sIHdyaXRhYmxlOiB0cnVlIH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGZpbGVJbnB1dClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZmlsZS1uYW1lJywgJ3Rlc3QtYnVuZGxlLmRpZnlibmRsJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFNpZGUgRWZmZWN0cyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU2lkZSBFZmZlY3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3QgaW5zdGFsbCBtZXRob2RzIGJhc2VkIG9uIHN5c3RlbSBmZWF0dXJlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIFRlc3QgMTogQWxsIG1ldGhvZHMgd2hlbiBtYXJrZXRwbGFjZSBlbmFibGVkIGFuZCBub3QgcmVzdHJpY3RlZFxuICAgICAgc2V0TW9ja1N5c3RlbUZlYXR1cmVzKHtcbiAgICAgICAgZW5hYmxlX21hcmtldHBsYWNlOiB0cnVlLFxuICAgICAgICBwbHVnaW5faW5zdGFsbGF0aW9uX3Blcm1pc3Npb246IHtcbiAgICAgICAgICBwbHVnaW5faW5zdGFsbGF0aW9uX3Njb3BlOiBJbnN0YWxsYXRpb25TY29wZS5BTEwsXG4gICAgICAgICAgcmVzdHJpY3RfdG9fbWFya2V0cGxhY2Vfb25seTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHVubW91bnQ6IHVubW91bnQxIH0gPSByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKSkudG9IYXZlTGVuZ3RoKDMpXG4gICAgICB1bm1vdW50MSgpXG5cbiAgICAgIC8vIFRlc3QgMjogT25seSBtYXJrZXRwbGFjZSB3aGVuIHJlc3RyaWN0ZWRcbiAgICAgIHNldE1vY2tTeXN0ZW1GZWF0dXJlcyh7XG4gICAgICAgIGVuYWJsZV9tYXJrZXRwbGFjZTogdHJ1ZSxcbiAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9wZXJtaXNzaW9uOiB7XG4gICAgICAgICAgcGx1Z2luX2luc3RhbGxhdGlvbl9zY29wZTogSW5zdGFsbGF0aW9uU2NvcGUuQUxMLFxuICAgICAgICAgIHJlc3RyaWN0X3RvX21hcmtldHBsYWNlX29ubHk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKSkudG9IYXZlTGVuZ3RoKDEpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLm1hcmtldHBsYWNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdCB0ZXh0IGJhc2VkIG9uIHBsdWdpbiBsaXN0IGFuZCBmaWx0ZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gVGVzdCAxOiBub0luc3RhbGxlZCB3aGVuIHBsdWdpbiBsaXN0IGlzIGVtcHR5XG4gICAgICBzZXRNb2NrUGx1Z2luTGlzdCh7IHBsdWdpbnM6IFtdIH0pXG4gICAgICBzZXRNb2NrRmlsdGVycyh7IGNhdGVnb3JpZXM6IFtdLCB0YWdzOiBbXSwgc2VhcmNoUXVlcnk6ICcnIH0pXG5cbiAgICAgIGNvbnN0IHsgdW5tb3VudDogdW5tb3VudDEgfSA9IHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2xpc3Qubm9JbnN0YWxsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgdW5tb3VudDEoKVxuXG4gICAgICAvLyBUZXN0IDI6IG5vdEZvdW5kIHdoZW4gZmlsdGVycyBhcmUgYWN0aXZlIHdpdGggcGx1Z2luc1xuICAgICAgc2V0TW9ja0ZpbHRlcnMoeyBjYXRlZ29yaWVzOiBbJ3Rvb2wnXSB9KVxuICAgICAgc2V0TW9ja1BsdWdpbkxpc3QoeyBwbHVnaW5zOiBbeyBpZDogJ3BsdWdpbi0xJyB9XSB9KVxuXG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdsaXN0Lm5vdEZvdW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEVkZ2UgQ2FzZXMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBsdWdpbiBkYXRhIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IHVuZGVmaW5lZCBwbHVnaW4gbGlzdCAtIGNvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JcbiAgICAgIHNldE1vY2tQbHVnaW5MaXN0KHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPEVtcHR5IC8+KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlIGlucHV0IGVkZ2UgY2FzZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPEVtcHR5IC8+KVxuICAgICAgYXdhaXQgZmx1c2hFZmZlY3RzKClcbiAgICAgIGNvbnN0IGZpbGVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykgYXMgSFRNTElucHV0RWxlbWVudFxuXG4gICAgICAvLyBUZXN0IHVuZGVmaW5lZCBmaWxlc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZpbGVJbnB1dCwgJ2ZpbGVzJywgeyB2YWx1ZTogdW5kZWZpbmVkLCB3cml0YWJsZTogdHJ1ZSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShmaWxlSW5wdXQpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmVhY3QubWVtbyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVhY3QubWVtbyBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vIGFuZCBoYXZlIGRpc3BsYXlOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoRW1wdHkpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCgoRW1wdHkgYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgICAgZXhwZWN0KChFbXB0eSBhcyBhbnkpLmRpc3BsYXlOYW1lIHx8IChFbXB0eSBhcyBhbnkpLnR5cGU/LmRpc3BsYXlOYW1lKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNb2RhbCBDYWxsYmFja3MgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01vZGFsIENhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtb2RhbCBvblN1Y2Nlc3MgY2FsbGJhY2tzIChub29wKScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RW1wdHkgLz4pXG4gICAgICBhd2FpdCBmbHVzaEVmZmVjdHMoKVxuXG4gICAgICAvLyBUZXN0IEdpdEh1YiBtb2RhbCBvblN1Y2Nlc3NcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdzb3VyY2UuZ2l0aHViJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdnaXRodWItbW9kYWwtc3VjY2VzcycpKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWdpdGh1Yi1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENsb3NlIEdpdEh1YiBtb2RhbCBhbmQgdGVzdCBMb2NhbCBtb2RhbCBvblN1Y2Nlc3NcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dpdGh1Yi1tb2RhbC1jbG9zZScpKVxuXG4gICAgICBjb25zdCBmaWxlSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaWxlSW5wdXQsICdmaWxlcycsIHsgdmFsdWU6IFtjcmVhdGVNb2NrRmlsZSgndGVzdC1wbHVnaW4uZGlmeXBrZycpXSwgd3JpdGFibGU6IHRydWUgfSlcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoZmlsZUlucHV0KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdsb2NhbC1tb2RhbC1zdWNjZXNzJykpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZyb20tbG9jYWwtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gQ29uZGl0aW9uYWwgTW9kYWwgUmVuZGVyaW5nID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb25kaXRpb25hbCBNb2RhbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvbmx5IHJlbmRlciBvbmUgbW9kYWwgYXQgYSB0aW1lIGFuZCByZXF1aXJlIGZpbGUgZm9yIGxvY2FsIG1vZGFsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxFbXB0eSAvPilcbiAgICAgIGF3YWl0IGZsdXNoRWZmZWN0cygpXG5cbiAgICAgIC8vIEFzc2VydCAtIG5vIG1vZGFscyBpbml0aWFsbHlcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWdpdGh1Yi1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsLWZyb20tbG9jYWwtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gT3BlbiBHaXRIdWIgbW9kYWwgLSBvbmx5IEdpdEh1YiBtb2RhbCB2aXNpYmxlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLmdpdGh1YicpKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWdpdGh1Yi1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbGljayBsb2NhbCBidXR0b24gLSB0cmlnZ2VycyBmaWxlIGlucHV0LCBubyBtb2RhbCB5ZXQgKG5vIGZpbGUgc2VsZWN0ZWQpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnc291cmNlLmxvY2FsJykpXG4gICAgICAvLyBHaXRIdWIgbW9kYWwgc2hvdWxkIHN0aWxsIGJlIHZpc2libGUsIGxvY2FsIG1vZGFsIHJlcXVpcmVzIGZpbGUgc2VsZWN0aW9uXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1sb2NhbC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19