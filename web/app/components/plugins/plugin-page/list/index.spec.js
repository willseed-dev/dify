"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
// ==================== Imports (after mocks) ====================
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Mock PluginItem component to avoid complex dependency chain
vitest_1.vi.mock('../../plugin-item', () => ({
    default: ({ plugin }) => (<div data-testid="plugin-item" data-plugin-id={plugin.plugin_id} data-plugin-name={plugin.name}>
      {plugin.name}
    </div>),
}));
// ==================== Test Utilities ====================
/**
 * Factory function to create a PluginDeclaration with defaults
 */
const createPluginDeclaration = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-id',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    icon_dark: 'test-icon-dark.png',
    name: 'test-plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { en_US: 'Test Plugin' },
    description: { en_US: 'Test plugin description' },
    created_at: '2024-01-01',
    resource: null,
    plugins: null,
    verified: false,
    endpoint: {},
    model: null,
    tags: [],
    agent_strategy: null,
    meta: {
        version: '1.0.0',
        minimum_dify_version: '0.5.0',
    },
    trigger: {},
    ...overrides,
});
/**
 * Factory function to create a PluginDetail with defaults
 */
const createPluginDetail = (overrides = {}) => ({
    id: 'plugin-1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    name: 'test-plugin',
    plugin_id: 'plugin-1',
    plugin_unique_identifier: 'test-author/test-plugin@1.0.0',
    declaration: createPluginDeclaration(),
    installation_id: 'install-1',
    tenant_id: 'tenant-1',
    endpoints_setups: 0,
    endpoints_active: 0,
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_unique_identifier: 'test-author/test-plugin@1.0.0',
    source: types_1.PluginSource.marketplace,
    meta: {
        repo: 'test-author/test-plugin',
        version: '1.0.0',
        package: 'test-plugin.difypkg',
    },
    status: 'active',
    deprecated_reason: '',
    alternative_plugin_id: '',
    ...overrides,
});
/**
 * Factory function to create a list of plugins
 */
const createPluginList = (count, baseOverrides = {}) => {
    return Array.from({ length: count }, (_, index) => createPluginDetail({
        id: `plugin-${index + 1}`,
        plugin_id: `plugin-${index + 1}`,
        name: `plugin-${index + 1}`,
        plugin_unique_identifier: `test-author/plugin-${index + 1}@1.0.0`,
        ...baseOverrides,
    }));
};
// ==================== Tests ====================
(0, vitest_1.describe)('PluginList', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            // Arrange
            const pluginList = [];
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render container with correct structure', () => {
            // Arrange
            const pluginList = [];
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const outerDiv = container.firstChild;
            (0, vitest_1.expect)(outerDiv).toHaveClass('pb-3');
            const gridDiv = outerDiv.firstChild;
            (0, vitest_1.expect)(gridDiv).toHaveClass('grid', 'grid-cols-2', 'gap-3');
        });
        (0, vitest_1.it)('should render single plugin correctly', () => {
            // Arrange
            const pluginList = [createPluginDetail({ name: 'single-plugin' })];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(1);
            (0, vitest_1.expect)(pluginItems[0]).toHaveAttribute('data-plugin-name', 'single-plugin');
        });
        (0, vitest_1.it)('should render multiple plugins correctly', () => {
            // Arrange
            const pluginList = createPluginList(5);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(5);
        });
        (0, vitest_1.it)('should render plugins in correct order', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({ plugin_id: 'first', name: 'First Plugin' }),
                createPluginDetail({ plugin_id: 'second', name: 'Second Plugin' }),
                createPluginDetail({ plugin_id: 'third', name: 'Third Plugin' }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems[0]).toHaveAttribute('data-plugin-id', 'first');
            (0, vitest_1.expect)(pluginItems[1]).toHaveAttribute('data-plugin-id', 'second');
            (0, vitest_1.expect)(pluginItems[2]).toHaveAttribute('data-plugin-id', 'third');
        });
        (0, vitest_1.it)('should pass plugin prop to each PluginItem', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({ plugin_id: 'plugin-a', name: 'Plugin A' }),
                createPluginDetail({ plugin_id: 'plugin-b', name: 'Plugin B' }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Plugin A')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Plugin B')).toBeInTheDocument();
        });
    });
    // ==================== Props Testing ====================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should accept empty pluginList array', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={[]}/>);
            // Assert
            const gridDiv = container.querySelector('.grid');
            (0, vitest_1.expect)(gridDiv).toBeEmptyDOMElement();
        });
        (0, vitest_1.it)('should handle pluginList with various categories', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    plugin_id: 'tool-plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
                }),
                createPluginDetail({
                    plugin_id: 'model-plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.model }),
                }),
                createPluginDetail({
                    plugin_id: 'extension-plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.extension }),
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(3);
        });
        (0, vitest_1.it)('should handle pluginList with various sources', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({ plugin_id: 'marketplace-plugin', source: types_1.PluginSource.marketplace }),
                createPluginDetail({ plugin_id: 'github-plugin', source: types_1.PluginSource.github }),
                createPluginDetail({ plugin_id: 'local-plugin', source: types_1.PluginSource.local }),
                createPluginDetail({ plugin_id: 'debugging-plugin', source: types_1.PluginSource.debugging }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(4);
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty array', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default pluginList={[]}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('plugin-item')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle large number of plugins', () => {
            // Arrange
            const pluginList = createPluginList(100);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(100);
        });
        (0, vitest_1.it)('should handle plugins with duplicate plugin_ids (key warning scenario)', () => {
            // Arrange - Testing that the component uses plugin_id as key
            const pluginList = [
                createPluginDetail({ plugin_id: 'unique-1', name: 'Plugin 1' }),
                createPluginDetail({ plugin_id: 'unique-2', name: 'Plugin 2' }),
            ];
            // Act & Assert - Should render without issues
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default pluginList={pluginList}/>)).not.toThrow();
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(2);
        });
        (0, vitest_1.it)('should handle plugins with special characters in names', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({ plugin_id: 'special-1', name: 'Plugin <with> "special" & chars' }),
                createPluginDetail({ plugin_id: 'special-2', name: '日本語プラグイン' }),
                createPluginDetail({ plugin_id: 'special-3', name: 'Emoji Plugin 🔌' }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const pluginItems = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(pluginItems).toHaveLength(3);
        });
        (0, vitest_1.it)('should handle plugins with very long names', () => {
            // Arrange
            const longName = 'A'.repeat(500);
            const pluginList = [createPluginDetail({ name: longName })];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle plugin with minimal data', () => {
            // Arrange
            const minimalPlugin = createPluginDetail({
                name: '',
                plugin_id: 'minimal',
            });
            // Act
            (0, react_1.render)(<index_1.default pluginList={[minimalPlugin]}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle plugins with undefined optional fields', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    plugin_id: 'no-meta',
                    meta: undefined,
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
    });
    // ==================== Grid Layout Tests ====================
    (0, vitest_1.describe)('Grid Layout', () => {
        (0, vitest_1.it)('should render with 2-column grid', () => {
            // Arrange
            const pluginList = createPluginList(4);
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const gridDiv = container.querySelector('.grid');
            (0, vitest_1.expect)(gridDiv).toHaveClass('grid-cols-2');
        });
        (0, vitest_1.it)('should have proper gap between items', () => {
            // Arrange
            const pluginList = createPluginList(4);
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const gridDiv = container.querySelector('.grid');
            (0, vitest_1.expect)(gridDiv).toHaveClass('gap-3');
        });
        (0, vitest_1.it)('should have bottom padding on container', () => {
            // Arrange
            const pluginList = createPluginList(2);
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            const outerDiv = container.firstChild;
            (0, vitest_1.expect)(outerDiv).toHaveClass('pb-3');
        });
    });
    // ==================== Re-render Tests ====================
    (0, vitest_1.describe)('Re-render Behavior', () => {
        (0, vitest_1.it)('should update when pluginList changes', () => {
            // Arrange
            const initialList = createPluginList(2);
            const updatedList = createPluginList(4);
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default pluginList={initialList}/>);
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(2);
            rerender(<index_1.default pluginList={updatedList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(4);
        });
        (0, vitest_1.it)('should handle pluginList update from non-empty to empty', () => {
            // Arrange
            const initialList = createPluginList(3);
            const emptyList = [];
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default pluginList={initialList}/>);
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(3);
            rerender(<index_1.default pluginList={emptyList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('plugin-item')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle pluginList update from empty to non-empty', () => {
            // Arrange
            const emptyList = [];
            const filledList = createPluginList(3);
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default pluginList={emptyList}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('plugin-item')).not.toBeInTheDocument();
            rerender(<index_1.default pluginList={filledList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(3);
        });
        (0, vitest_1.it)('should update individual plugin data on re-render', () => {
            // Arrange
            const initialList = [createPluginDetail({ plugin_id: 'plugin-1', name: 'Original Name' })];
            const updatedList = [createPluginDetail({ plugin_id: 'plugin-1', name: 'Updated Name' })];
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default pluginList={initialList}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Original Name')).toBeInTheDocument();
            rerender(<index_1.default pluginList={updatedList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Updated Name')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Original Name')).not.toBeInTheDocument();
        });
    });
    // ==================== Key Prop Tests ====================
    (0, vitest_1.describe)('Key Prop Behavior', () => {
        (0, vitest_1.it)('should use plugin_id as key for efficient re-renders', () => {
            // Arrange - Create plugins with unique plugin_ids
            const pluginList = [
                createPluginDetail({ plugin_id: 'stable-key-1', name: 'Plugin 1' }),
                createPluginDetail({ plugin_id: 'stable-key-2', name: 'Plugin 2' }),
                createPluginDetail({ plugin_id: 'stable-key-3', name: 'Plugin 3' }),
            ];
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Reorder the list
            const reorderedList = [pluginList[2], pluginList[0], pluginList[1]];
            rerender(<index_1.default pluginList={reorderedList}/>);
            // Assert - All items should still be present
            const items = react_1.screen.getAllByTestId('plugin-item');
            (0, vitest_1.expect)(items).toHaveLength(3);
            (0, vitest_1.expect)(items[0]).toHaveAttribute('data-plugin-id', 'stable-key-3');
            (0, vitest_1.expect)(items[1]).toHaveAttribute('data-plugin-id', 'stable-key-1');
            (0, vitest_1.expect)(items[2]).toHaveAttribute('data-plugin-id', 'stable-key-2');
        });
    });
    // ==================== Plugin Status Variations ====================
    (0, vitest_1.describe)('Plugin Status Variations', () => {
        (0, vitest_1.it)('should render active plugins', () => {
            // Arrange
            const pluginList = [createPluginDetail({ status: 'active' })];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render deleted/deprecated plugins', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    status: 'deleted',
                    deprecated_reason: 'No longer maintained',
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render mixed status plugins', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({ plugin_id: 'active-plugin', status: 'active' }),
                createPluginDetail({
                    plugin_id: 'deprecated-plugin',
                    status: 'deleted',
                    deprecated_reason: 'Deprecated',
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(2);
        });
    });
    // ==================== Version Variations ====================
    (0, vitest_1.describe)('Version Variations', () => {
        (0, vitest_1.it)('should render plugins with same version as latest', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    version: '1.0.0',
                    latest_version: '1.0.0',
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugins with outdated version', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    version: '1.0.0',
                    latest_version: '2.0.0',
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-item')).toBeInTheDocument();
        });
    });
    // ==================== Accessibility ====================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should render as a semantic container', () => {
            // Arrange
            const pluginList = createPluginList(2);
            // Act
            const { container } = (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert - The list is rendered as divs which is appropriate for a grid layout
            const outerDiv = container.firstChild;
            (0, vitest_1.expect)(outerDiv.tagName).toBe('DIV');
        });
    });
    // ==================== Component Type ====================
    (0, vitest_1.describe)('Component Type', () => {
        (0, vitest_1.it)('should be a functional component', () => {
            // Assert
            (0, vitest_1.expect)(typeof index_1.default).toBe('function');
        });
        (0, vitest_1.it)('should accept pluginList as required prop', () => {
            // Arrange & Act - TypeScript ensures this at compile time
            // but we verify runtime behavior
            const pluginList = createPluginList(1);
            // Assert
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default pluginList={pluginList}/>)).not.toThrow();
        });
    });
    // ==================== Mixed Content Tests ====================
    (0, vitest_1.describe)('Mixed Content', () => {
        (0, vitest_1.it)('should render plugins from different sources together', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    plugin_id: 'marketplace-1',
                    name: 'Marketplace Plugin',
                    source: types_1.PluginSource.marketplace,
                }),
                createPluginDetail({
                    plugin_id: 'github-1',
                    name: 'GitHub Plugin',
                    source: types_1.PluginSource.github,
                }),
                createPluginDetail({
                    plugin_id: 'local-1',
                    name: 'Local Plugin',
                    source: types_1.PluginSource.local,
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Marketplace Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('GitHub Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Local Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugins of different categories together', () => {
            // Arrange
            const pluginList = [
                createPluginDetail({
                    plugin_id: 'tool-1',
                    name: 'Tool Plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
                }),
                createPluginDetail({
                    plugin_id: 'model-1',
                    name: 'Model Plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.model }),
                }),
                createPluginDetail({
                    plugin_id: 'agent-1',
                    name: 'Agent Plugin',
                    declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.agent }),
                }),
            ];
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Tool Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Model Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Agent Plugin')).toBeInTheDocument();
        });
    });
    // ==================== Boundary Tests ====================
    (0, vitest_1.describe)('Boundary Tests', () => {
        (0, vitest_1.it)('should handle single item list', () => {
            // Arrange
            const pluginList = createPluginList(1);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(1);
        });
        (0, vitest_1.it)('should handle two items (fills one row)', () => {
            // Arrange
            const pluginList = createPluginList(2);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(2);
        });
        (0, vitest_1.it)('should handle three items (partial second row)', () => {
            // Arrange
            const pluginList = createPluginList(3);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(3);
        });
        (0, vitest_1.it)('should handle odd number of items', () => {
            // Arrange
            const pluginList = createPluginList(7);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(7);
        });
        (0, vitest_1.it)('should handle even number of items', () => {
            // Arrange
            const pluginList = createPluginList(8);
            // Act
            (0, react_1.render)(<index_1.default pluginList={pluginList}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-item')).toHaveLength(8);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELG1DQUE2RDtBQUM3RCx1Q0FBOEQ7QUFFOUQsa0VBQWtFO0FBRWxFLG1DQUFnQztBQUVoQyx1REFBdUQ7QUFFdkQsOERBQThEO0FBQzlELFdBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBNEIsRUFBRSxFQUFFLENBQUMsQ0FDakQsQ0FBQyxHQUFHLENBQ0YsV0FBVyxDQUFDLGFBQWEsQ0FDekIsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUNqQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FFOUI7TUFBQSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2Q7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCwyREFBMkQ7QUFFM0Q7O0dBRUc7QUFDSCxNQUFNLHVCQUF1QixHQUFHLENBQUMsWUFBd0MsRUFBRSxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUNsRyx3QkFBd0IsRUFBRSxnQkFBZ0I7SUFDMUMsT0FBTyxFQUFFLE9BQU87SUFDaEIsTUFBTSxFQUFFLGFBQWE7SUFDckIsSUFBSSxFQUFFLGVBQWU7SUFDckIsU0FBUyxFQUFFLG9CQUFvQjtJQUMvQixJQUFJLEVBQUUsYUFBYTtJQUNuQixRQUFRLEVBQUUsMEJBQWtCLENBQUMsSUFBSTtJQUNqQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFTO0lBQ3RDLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSx5QkFBeUIsRUFBUztJQUN4RCxVQUFVLEVBQUUsWUFBWTtJQUN4QixRQUFRLEVBQUUsSUFBSTtJQUNkLE9BQU8sRUFBRSxJQUFJ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TixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFOUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDNUMsVUFBVTtZQUNWLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXRDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFOUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQbHVnaW5EZWNsYXJhdGlvbiwgUGx1Z2luRGV0YWlsIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0sIFBsdWdpblNvdXJjZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBJbXBvcnRzIChhZnRlciBtb2NrcykgPT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IFBsdWdpbkxpc3QgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gTW9jayBTZXR1cCA9PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIFBsdWdpbkl0ZW0gY29tcG9uZW50IHRvIGF2b2lkIGNvbXBsZXggZGVwZW5kZW5jeSBjaGFpblxudmkubW9jaygnLi4vLi4vcGx1Z2luLWl0ZW0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBwbHVnaW4gfTogeyBwbHVnaW46IFBsdWdpbkRldGFpbCB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJwbHVnaW4taXRlbVwiXG4gICAgICBkYXRhLXBsdWdpbi1pZD17cGx1Z2luLnBsdWdpbl9pZH1cbiAgICAgIGRhdGEtcGx1Z2luLW5hbWU9e3BsdWdpbi5uYW1lfVxuICAgID5cbiAgICAgIHtwbHVnaW4ubmFtZX1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBUZXN0IFV0aWxpdGllcyA9PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgUGx1Z2luRGVjbGFyYXRpb24gd2l0aCBkZWZhdWx0c1xuICovXG5jb25zdCBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbiA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luRGVjbGFyYXRpb24+ID0ge30pOiBQbHVnaW5EZWNsYXJhdGlvbiA9PiAoe1xuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgaWNvbjogJ3Rlc3QtaWNvbi5wbmcnLFxuICBpY29uX2Rhcms6ICd0ZXN0LWljb24tZGFyay5wbmcnLFxuICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gIGxhYmVsOiB7IGVuX1VTOiAnVGVzdCBQbHVnaW4nIH0gYXMgYW55LFxuICBkZXNjcmlwdGlvbjogeyBlbl9VUzogJ1Rlc3QgcGx1Z2luIGRlc2NyaXB0aW9uJyB9IGFzIGFueSxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDEnLFxuICByZXNvdXJjZTogbnVsbCxcbiAgcGx1Z2luczogbnVsbCxcbiAgdmVyaWZpZWQ6IGZhbHNlLFxuICBlbmRwb2ludDoge30gYXMgYW55LFxuICBtb2RlbDogbnVsbCxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICBtZXRhOiB7XG4gICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICBtaW5pbXVtX2RpZnlfdmVyc2lvbjogJzAuNS4wJyxcbiAgfSxcbiAgdHJpZ2dlcjoge30gYXMgYW55LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgUGx1Z2luRGV0YWlsIHdpdGggZGVmYXVsdHNcbiAqL1xuY29uc3QgY3JlYXRlUGx1Z2luRGV0YWlsID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5EZXRhaWw+ID0ge30pOiBQbHVnaW5EZXRhaWwgPT4gKHtcbiAgaWQ6ICdwbHVnaW4tMScsXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgdXBkYXRlZF9hdDogJzIwMjQtMDEtMDEnLFxuICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMScsXG4gIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtYXV0aG9yL3Rlc3QtcGx1Z2luQDEuMC4wJyxcbiAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKCksXG4gIGluc3RhbGxhdGlvbl9pZDogJ2luc3RhbGwtMScsXG4gIHRlbmFudF9pZDogJ3RlbmFudC0xJyxcbiAgZW5kcG9pbnRzX3NldHVwczogMCxcbiAgZW5kcG9pbnRzX2FjdGl2ZTogMCxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtYXV0aG9yL3Rlc3QtcGx1Z2luQDEuMC4wJyxcbiAgc291cmNlOiBQbHVnaW5Tb3VyY2UubWFya2V0cGxhY2UsXG4gIG1ldGE6IHtcbiAgICByZXBvOiAndGVzdC1hdXRob3IvdGVzdC1wbHVnaW4nLFxuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgcGFja2FnZTogJ3Rlc3QtcGx1Z2luLmRpZnlwa2cnLFxuICB9LFxuICBzdGF0dXM6ICdhY3RpdmUnLFxuICBkZXByZWNhdGVkX3JlYXNvbjogJycsXG4gIGFsdGVybmF0aXZlX3BsdWdpbl9pZDogJycsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBsaXN0IG9mIHBsdWdpbnNcbiAqL1xuY29uc3QgY3JlYXRlUGx1Z2luTGlzdCA9IChjb3VudDogbnVtYmVyLCBiYXNlT3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRldGFpbD4gPSB7fSk6IFBsdWdpbkRldGFpbFtdID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpbmRleCkgPT4gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICBpZDogYHBsdWdpbi0ke2luZGV4ICsgMX1gLFxuICAgIHBsdWdpbl9pZDogYHBsdWdpbi0ke2luZGV4ICsgMX1gLFxuICAgIG5hbWU6IGBwbHVnaW4tJHtpbmRleCArIDF9YCxcbiAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IGB0ZXN0LWF1dGhvci9wbHVnaW4tJHtpbmRleCArIDF9QDEuMC4wYCxcbiAgICAuLi5iYXNlT3ZlcnJpZGVzLFxuICB9KSlcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1BsdWdpbkxpc3QnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFJlbmRlcmluZyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0OiBQbHVnaW5EZXRhaWxbXSA9IFtdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbnRhaW5lciB3aXRoIGNvcnJlY3Qgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdDogUGx1Z2luRGV0YWlsW10gPSBbXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgb3V0ZXJEaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVDbGFzcygncGItMycpXG5cbiAgICAgIGNvbnN0IGdyaWREaXYgPSBvdXRlckRpdi5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QoZ3JpZERpdikudG9IYXZlQ2xhc3MoJ2dyaWQnLCAnZ3JpZC1jb2xzLTInLCAnZ2FwLTMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzaW5nbGUgcGx1Z2luIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBbY3JlYXRlUGx1Z2luRGV0YWlsKHsgbmFtZTogJ3NpbmdsZS1wbHVnaW4nIH0pXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwbHVnaW5JdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKVxuICAgICAgZXhwZWN0KHBsdWdpbkl0ZW1zKS50b0hhdmVMZW5ndGgoMSlcbiAgICAgIGV4cGVjdChwbHVnaW5JdGVtc1swXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXBsdWdpbi1uYW1lJywgJ3NpbmdsZS1wbHVnaW4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtdWx0aXBsZSBwbHVnaW5zIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDUpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHBsdWdpbkl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpXG4gICAgICBleHBlY3QocGx1Z2luSXRlbXMpLnRvSGF2ZUxlbmd0aCg1KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW5zIGluIGNvcnJlY3Qgb3JkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICdmaXJzdCcsIG5hbWU6ICdGaXJzdCBQbHVnaW4nIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICdzZWNvbmQnLCBuYW1lOiAnU2Vjb25kIFBsdWdpbicgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ3RoaXJkJywgbmFtZTogJ1RoaXJkIFBsdWdpbicgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHBsdWdpbkl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpXG4gICAgICBleHBlY3QocGx1Z2luSXRlbXNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1wbHVnaW4taWQnLCAnZmlyc3QnKVxuICAgICAgZXhwZWN0KHBsdWdpbkl0ZW1zWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcGx1Z2luLWlkJywgJ3NlY29uZCcpXG4gICAgICBleHBlY3QocGx1Z2luSXRlbXNbMl0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1wbHVnaW4taWQnLCAndGhpcmQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgcGx1Z2luIHByb3AgdG8gZWFjaCBQbHVnaW5JdGVtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAncGx1Z2luLWEnLCBuYW1lOiAnUGx1Z2luIEEnIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICdwbHVnaW4tYicsIG5hbWU6ICdQbHVnaW4gQicgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQbHVnaW4gQScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGx1Z2luIEInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUHJvcHMgVGVzdGluZyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgZW1wdHkgcGx1Z2luTGlzdCBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17W119IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGdyaWREaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmdyaWQnKVxuICAgICAgZXhwZWN0KGdyaWREaXYpLnRvQmVFbXB0eURPTUVsZW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwbHVnaW5MaXN0IHdpdGggdmFyaW91cyBjYXRlZ29yaWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICd0b29sLXBsdWdpbicsXG4gICAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICdtb2RlbC1wbHVnaW4nLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwgfSksXG4gICAgICAgIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ2V4dGVuc2lvbi1wbHVnaW4nLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0uZXh0ZW5zaW9uIH0pLFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGx1Z2luSXRlbXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJylcbiAgICAgIGV4cGVjdChwbHVnaW5JdGVtcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBsdWdpbkxpc3Qgd2l0aCB2YXJpb3VzIHNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICdtYXJrZXRwbGFjZS1wbHVnaW4nLCBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSB9KSxcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnZ2l0aHViLXBsdWdpbicsIHNvdXJjZTogUGx1Z2luU291cmNlLmdpdGh1YiB9KSxcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnbG9jYWwtcGx1Z2luJywgc291cmNlOiBQbHVnaW5Tb3VyY2UubG9jYWwgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ2RlYnVnZ2luZy1wbHVnaW4nLCBzb3VyY2U6IFBsdWdpblNvdXJjZS5kZWJ1Z2dpbmcgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHBsdWdpbkl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpXG4gICAgICBleHBlY3QocGx1Z2luSXRlbXMpLnRvSGF2ZUxlbmd0aCg0KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtbXX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwbHVnaW4taXRlbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBudW1iZXIgb2YgcGx1Z2lucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDEwMClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGx1Z2luSXRlbXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJylcbiAgICAgIGV4cGVjdChwbHVnaW5JdGVtcykudG9IYXZlTGVuZ3RoKDEwMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGx1Z2lucyB3aXRoIGR1cGxpY2F0ZSBwbHVnaW5faWRzIChrZXkgd2FybmluZyBzY2VuYXJpbyknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGVzdGluZyB0aGF0IHRoZSBjb21wb25lbnQgdXNlcyBwbHVnaW5faWQgYXMga2V5XG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICd1bmlxdWUtMScsIG5hbWU6ICdQbHVnaW4gMScgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ3VuaXF1ZS0yJywgbmFtZTogJ1BsdWdpbiAyJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGlzc3Vlc1xuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPikpLm5vdC50b1Rocm93KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwbHVnaW5zIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnc3BlY2lhbC0xJywgbmFtZTogJ1BsdWdpbiA8d2l0aD4gXCJzcGVjaWFsXCIgJiBjaGFycycgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ3NwZWNpYWwtMicsIG5hbWU6ICfml6XmnKzoqp7jg5fjg6njgrDjgqTjg7MnIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICdzcGVjaWFsLTMnLCBuYW1lOiAnRW1vamkgUGx1Z2luIPCflIwnIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwbHVnaW5JdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKVxuICAgICAgZXhwZWN0KHBsdWdpbkl0ZW1zKS50b0hhdmVMZW5ndGgoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGx1Z2lucyB3aXRoIHZlcnkgbG9uZyBuYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gJ0EnLnJlcGVhdCg1MDApXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW2NyZWF0ZVBsdWdpbkRldGFpbCh7IG5hbWU6IGxvbmdOYW1lIH0pXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4taXRlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBsdWdpbiB3aXRoIG1pbmltYWwgZGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1pbmltYWxQbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgcGx1Z2luX2lkOiAnbWluaW1hbCcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtbbWluaW1hbFBsdWdpbl19IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGx1Z2lucyB3aXRoIHVuZGVmaW5lZCBvcHRpb25hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ25vLW1ldGEnLFxuICAgICAgICAgIG1ldGE6IHVuZGVmaW5lZCxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEdyaWQgTGF5b3V0IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdHcmlkIExheW91dCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIDItY29sdW1uIGdyaWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gY3JlYXRlUGx1Z2luTGlzdCg0KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZ3JpZERpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZ3JpZCcpXG4gICAgICBleHBlY3QoZ3JpZERpdikudG9IYXZlQ2xhc3MoJ2dyaWQtY29scy0yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlciBnYXAgYmV0d2VlbiBpdGVtcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDQpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBncmlkRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ncmlkJylcbiAgICAgIGV4cGVjdChncmlkRGl2KS50b0hhdmVDbGFzcygnZ2FwLTMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYm90dG9tIHBhZGRpbmcgb24gY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IGNyZWF0ZVBsdWdpbkxpc3QoMilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG91dGVyRGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChvdXRlckRpdikudG9IYXZlQ2xhc3MoJ3BiLTMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmUtcmVuZGVyIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZS1yZW5kZXIgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBwbHVnaW5MaXN0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsTGlzdCA9IGNyZWF0ZVBsdWdpbkxpc3QoMilcbiAgICAgIGNvbnN0IHVwZGF0ZWRMaXN0ID0gY3JlYXRlUGx1Z2luTGlzdCg0KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtpbml0aWFsTGlzdH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpKS50b0hhdmVMZW5ndGgoMilcblxuICAgICAgcmVyZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17dXBkYXRlZExpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCg0KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwbHVnaW5MaXN0IHVwZGF0ZSBmcm9tIG5vbi1lbXB0eSB0byBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxMaXN0ID0gY3JlYXRlUGx1Z2luTGlzdCgzKVxuICAgICAgY29uc3QgZW1wdHlMaXN0OiBQbHVnaW5EZXRhaWxbXSA9IFtdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e2luaXRpYWxMaXN0fSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCgzKVxuXG4gICAgICByZXJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtlbXB0eUxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGx1Z2luTGlzdCB1cGRhdGUgZnJvbSBlbXB0eSB0byBub24tZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBlbXB0eUxpc3Q6IFBsdWdpbkRldGFpbFtdID0gW11cbiAgICAgIGNvbnN0IGZpbGxlZExpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDMpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e2VtcHR5TGlzdH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e2ZpbGxlZExpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCgzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBpbmRpdmlkdWFsIHBsdWdpbiBkYXRhIG9uIHJlLXJlbmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxMaXN0ID0gW2NyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ3BsdWdpbi0xJywgbmFtZTogJ09yaWdpbmFsIE5hbWUnIH0pXVxuICAgICAgY29uc3QgdXBkYXRlZExpc3QgPSBbY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAncGx1Z2luLTEnLCBuYW1lOiAnVXBkYXRlZCBOYW1lJyB9KV1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17aW5pdGlhbExpc3R9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ09yaWdpbmFsIE5hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXt1cGRhdGVkTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZWQgTmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdPcmlnaW5hbCBOYW1lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBLZXkgUHJvcCBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnS2V5IFByb3AgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgcGx1Z2luX2lkIGFzIGtleSBmb3IgZWZmaWNpZW50IHJlLXJlbmRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gQ3JlYXRlIHBsdWdpbnMgd2l0aCB1bmlxdWUgcGx1Z2luX2lkc1xuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnc3RhYmxlLWtleS0xJywgbmFtZTogJ1BsdWdpbiAxJyB9KSxcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnc3RhYmxlLWtleS0yJywgbmFtZTogJ1BsdWdpbiAyJyB9KSxcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAnc3RhYmxlLWtleS0zJywgbmFtZTogJ1BsdWdpbiAzJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIFJlb3JkZXIgdGhlIGxpc3RcbiAgICAgIGNvbnN0IHJlb3JkZXJlZExpc3QgPSBbcGx1Z2luTGlzdFsyXSwgcGx1Z2luTGlzdFswXSwgcGx1Z2luTGlzdFsxXV1cbiAgICAgIHJlcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3Jlb3JkZXJlZExpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBbGwgaXRlbXMgc2hvdWxkIHN0aWxsIGJlIHByZXNlbnRcbiAgICAgIGNvbnN0IGl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpXG4gICAgICBleHBlY3QoaXRlbXMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgZXhwZWN0KGl0ZW1zWzBdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcGx1Z2luLWlkJywgJ3N0YWJsZS1rZXktMycpXG4gICAgICBleHBlY3QoaXRlbXNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1wbHVnaW4taWQnLCAnc3RhYmxlLWtleS0xJylcbiAgICAgIGV4cGVjdChpdGVtc1syXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXBsdWdpbi1pZCcsICdzdGFibGUta2V5LTInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUGx1Z2luIFN0YXR1cyBWYXJpYXRpb25zID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQbHVnaW4gU3RhdHVzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWN0aXZlIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW2NyZWF0ZVBsdWdpbkRldGFpbCh7IHN0YXR1czogJ2FjdGl2ZScgfSldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVsZXRlZC9kZXByZWNhdGVkIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHN0YXR1czogJ2RlbGV0ZWQnLFxuICAgICAgICAgIGRlcHJlY2F0ZWRfcmVhc29uOiAnTm8gbG9uZ2VyIG1haW50YWluZWQnLFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtaXhlZCBzdGF0dXMgcGx1Z2lucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7IHBsdWdpbl9pZDogJ2FjdGl2ZS1wbHVnaW4nLCBzdGF0dXM6ICdhY3RpdmUnIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ2RlcHJlY2F0ZWQtcGx1Z2luJyxcbiAgICAgICAgICBzdGF0dXM6ICdkZWxldGVkJyxcbiAgICAgICAgICBkZXByZWNhdGVkX3JlYXNvbjogJ0RlcHJlY2F0ZWQnLFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKSkudG9IYXZlTGVuZ3RoKDIpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBWZXJzaW9uIFZhcmlhdGlvbnMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZlcnNpb24gVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW5zIHdpdGggc2FtZSB2ZXJzaW9uIGFzIGxhdGVzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgICBsYXRlc3RfdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2lucyB3aXRoIG91dGRhdGVkIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gW1xuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgbGF0ZXN0X3ZlcnNpb246ICcyLjAuMCcsXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4taXRlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBBY2Nlc3NpYmlsaXR5ID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFzIGEgc2VtYW50aWMgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IGNyZWF0ZVBsdWdpbkxpc3QoMilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBUaGUgbGlzdCBpcyByZW5kZXJlZCBhcyBkaXZzIHdoaWNoIGlzIGFwcHJvcHJpYXRlIGZvciBhIGdyaWQgbGF5b3V0XG4gICAgICBjb25zdCBvdXRlckRpdiA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qob3V0ZXJEaXYudGFnTmFtZSkudG9CZSgnRElWJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IENvbXBvbmVudCBUeXBlID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIGEgZnVuY3Rpb25hbCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdCh0eXBlb2YgUGx1Z2luTGlzdCkudG9CZSgnZnVuY3Rpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFjY2VwdCBwbHVnaW5MaXN0IGFzIHJlcXVpcmVkIHByb3AnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0IC0gVHlwZVNjcmlwdCBlbnN1cmVzIHRoaXMgYXQgY29tcGlsZSB0aW1lXG4gICAgICAvLyBidXQgd2UgdmVyaWZ5IHJ1bnRpbWUgYmVoYXZpb3JcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IE1peGVkIENvbnRlbnQgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01peGVkIENvbnRlbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2lucyBmcm9tIGRpZmZlcmVudCBzb3VyY2VzIHRvZ2V0aGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICdtYXJrZXRwbGFjZS0xJyxcbiAgICAgICAgICBuYW1lOiAnTWFya2V0cGxhY2UgUGx1Z2luJyxcbiAgICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgICAgcGx1Z2luX2lkOiAnZ2l0aHViLTEnLFxuICAgICAgICAgIG5hbWU6ICdHaXRIdWIgUGx1Z2luJyxcbiAgICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5naXRodWIsXG4gICAgICAgIH0pLFxuICAgICAgICBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ2xvY2FsLTEnLFxuICAgICAgICAgIG5hbWU6ICdMb2NhbCBQbHVnaW4nLFxuICAgICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLmxvY2FsLFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01hcmtldHBsYWNlIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnR2l0SHViIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTG9jYWwgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2lucyBvZiBkaWZmZXJlbnQgY2F0ZWdvcmllcyB0b2dldGhlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgICAgcGx1Z2luX2lkOiAndG9vbC0xJyxcbiAgICAgICAgICBuYW1lOiAnVG9vbCBQbHVnaW4nLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCB9KSxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgICAgcGx1Z2luX2lkOiAnbW9kZWwtMScsXG4gICAgICAgICAgbmFtZTogJ01vZGVsIFBsdWdpbicsXG4gICAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCB9KSxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgICAgcGx1Z2luX2lkOiAnYWdlbnQtMScsXG4gICAgICAgICAgbmFtZTogJ0FnZW50IFBsdWdpbicsXG4gICAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5hZ2VudCB9KSxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29sIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWwgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gQm91bmRhcnkgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0JvdW5kYXJ5IFRlc3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSBpdGVtIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW5MaXN0ID0gY3JlYXRlUGx1Z2luTGlzdCgxKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luTGlzdCBwbHVnaW5MaXN0PXtwbHVnaW5MaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taXRlbScpKS50b0hhdmVMZW5ndGgoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdHdvIGl0ZW1zIChmaWxscyBvbmUgcm93KScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDIpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB0aHJlZSBpdGVtcyAocGFydGlhbCBzZWNvbmQgcm93KScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbkxpc3QgPSBjcmVhdGVQbHVnaW5MaXN0KDMpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5MaXN0IHBsdWdpbkxpc3Q9e3BsdWdpbkxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pdGVtJykpLnRvSGF2ZUxlbmd0aCgzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvZGQgbnVtYmVyIG9mIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IGNyZWF0ZVBsdWdpbkxpc3QoNylcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKSkudG9IYXZlTGVuZ3RoKDcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGV2ZW4gbnVtYmVyIG9mIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luTGlzdCA9IGNyZWF0ZVBsdWdpbkxpc3QoOClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkxpc3QgcGx1Z2luTGlzdD17cGx1Z2luTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWl0ZW0nKSkudG9IYXZlTGVuZ3RoKDgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=