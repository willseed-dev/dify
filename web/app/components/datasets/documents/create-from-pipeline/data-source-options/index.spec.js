"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/workflow/types");
const datasource_icon_1 = require("./datasource-icon");
const hooks_1 = require("./hooks");
const index_1 = require("./index");
const option_card_1 = require("./option-card");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock useDatasourceOptions hook from parent hooks
const mockUseDatasourceOptions = vi.fn();
vi.mock('../hooks', () => ({
    useDatasourceOptions: (nodes) => mockUseDatasourceOptions(nodes),
}));
// Mock useDataSourceList API hook
const mockUseDataSourceList = vi.fn();
vi.mock('@/service/use-pipeline', () => ({
    useDataSourceList: (enabled) => mockUseDataSourceList(enabled),
}));
// Mock transformDataSourceToTool utility
const mockTransformDataSourceToTool = vi.fn();
vi.mock('@/app/components/workflow/block-selector/utils', () => ({
    transformDataSourceToTool: (item) => mockTransformDataSourceToTool(item),
}));
// Mock basePath
vi.mock('@/utils/var', () => ({
    basePath: '/mock-base-path',
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockDataSourceNodeData = (overrides) => ({
    title: 'Test Data Source',
    desc: 'Test description',
    type: types_1.BlockEnum.DataSource,
    plugin_id: 'test-plugin-id',
    provider_type: 'local_file',
    provider_name: 'Test Provider',
    datasource_name: 'test-datasource',
    datasource_label: 'Test Datasource Label',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
const createMockPipelineNode = (overrides) => {
    const nodeData = createMockDataSourceNodeData(overrides?.data);
    return {
        id: `node-${Math.random().toString(36).slice(2, 9)}`,
        type: 'custom',
        position: { x: 0, y: 0 },
        data: nodeData,
        ...overrides,
    };
};
const createMockPipelineNodes = (count = 3) => {
    return Array.from({ length: count }, (_, i) => createMockPipelineNode({
        id: `node-${i + 1}`,
        data: createMockDataSourceNodeData({
            title: `Data Source ${i + 1}`,
            plugin_id: `plugin-${i + 1}`,
            datasource_name: `datasource-${i + 1}`,
        }),
    }));
};
const createMockDatasourceOption = (node) => ({
    label: node.data.title,
    value: node.id,
    data: node.data,
});
const createMockDataSourceListItem = (overrides) => ({
    declaration: {
        identity: {
            icon: '/icons/test-icon.png',
            name: 'test-datasource',
            label: { en_US: 'Test Datasource' },
        },
        provider: 'test-provider',
    },
    plugin_id: 'test-plugin-id',
    ...overrides,
});
// ==========================================
// Test Utilities
// ==========================================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});
const renderWithProviders = (ui, queryClient) => {
    const client = queryClient || createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={client}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
const createHookWrapper = () => {
    const queryClient = createQueryClient();
    return ({ children }) => (<react_query_1.QueryClientProvider client={queryClient}>
      {children}
    </react_query_1.QueryClientProvider>);
};
// ==========================================
// DatasourceIcon Tests
// ==========================================
describe('DatasourceIcon', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png"/>);
            // Assert
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should render icon with background image', () => {
            // Arrange
            const iconUrl = 'https://example.com/icon.png';
            // Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl={iconUrl}/>);
            // Assert
            const iconDiv = container.querySelector('[style*="background-image"]');
            expect(iconDiv).toHaveStyle({ backgroundImage: `url(${iconUrl})` });
        });
        it('should render with default size (sm)', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png"/>);
            // Assert - Default size is 'sm' which maps to 'w-5 h-5'
            expect(container.firstChild).toHaveClass('w-5');
            expect(container.firstChild).toHaveClass('h-5');
        });
    });
    describe('Props', () => {
        describe('size', () => {
            it('should render with xs size', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png" size="xs"/>);
                // Assert
                expect(container.firstChild).toHaveClass('w-4');
                expect(container.firstChild).toHaveClass('h-4');
                expect(container.firstChild).toHaveClass('rounded-[5px]');
            });
            it('should render with sm size', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png" size="sm"/>);
                // Assert
                expect(container.firstChild).toHaveClass('w-5');
                expect(container.firstChild).toHaveClass('h-5');
                expect(container.firstChild).toHaveClass('rounded-md');
            });
            it('should render with md size', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png" size="md"/>);
                // Assert
                expect(container.firstChild).toHaveClass('w-6');
                expect(container.firstChild).toHaveClass('h-6');
                expect(container.firstChild).toHaveClass('rounded-lg');
            });
        });
        describe('className', () => {
            it('should apply custom className', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png" className="custom-class"/>);
                // Assert
                expect(container.firstChild).toHaveClass('custom-class');
            });
            it('should merge custom className with default classes', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png" className="custom-class" size="sm"/>);
                // Assert
                expect(container.firstChild).toHaveClass('custom-class');
                expect(container.firstChild).toHaveClass('w-5');
                expect(container.firstChild).toHaveClass('h-5');
            });
        });
        describe('iconUrl', () => {
            it('should handle empty iconUrl', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl=""/>);
                // Assert
                const iconDiv = container.querySelector('[style*="background-image"]');
                expect(iconDiv).toHaveStyle({ backgroundImage: 'url()' });
            });
            it('should handle special characters in iconUrl', () => {
                // Arrange
                const iconUrl = 'https://example.com/icon.png?param=value&other=123';
                // Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl={iconUrl}/>);
                // Assert
                const iconDiv = container.querySelector('[style*="background-image"]');
                expect(iconDiv).toHaveStyle({ backgroundImage: `url(${iconUrl})` });
            });
            it('should handle data URL as iconUrl', () => {
                // Arrange
                const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                // Act
                const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl={dataUrl}/>);
                // Assert
                const iconDiv = container.querySelector('[style*="background-image"]');
                expect(iconDiv).toBeInTheDocument();
            });
        });
    });
    describe('Styling', () => {
        it('should have flex container classes', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png"/>);
            // Assert
            expect(container.firstChild).toHaveClass('flex');
            expect(container.firstChild).toHaveClass('items-center');
            expect(container.firstChild).toHaveClass('justify-center');
        });
        it('should have shadow-xs class from size map', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png"/>);
            // Assert - Default size 'sm' has shadow-xs
            expect(container.firstChild).toHaveClass('shadow-xs');
        });
        it('should have inner div with bg-cover class', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<datasource_icon_1.default iconUrl="https://example.com/icon.png"/>);
            // Assert
            const innerDiv = container.querySelector('.bg-cover');
            expect(innerDiv).toBeInTheDocument();
            expect(innerDiv).toHaveClass('bg-center');
            expect(innerDiv).toHaveClass('rounded-md');
        });
    });
});
// ==========================================
// useDatasourceIcon Hook Tests
// ==========================================
describe('useDatasourceIcon', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseDataSourceList.mockReturnValue({
            data: [],
            isSuccess: false,
        });
        mockTransformDataSourceToTool.mockImplementation(item => ({
            plugin_id: item.plugin_id,
            icon: item.declaration?.identity?.icon,
        }));
    });
    describe('Loading State', () => {
        it('should return undefined when data is not loaded', () => {
            // Arrange
            mockUseDataSourceList.mockReturnValue({
                data: undefined,
                isSuccess: false,
            });
            const nodeData = createMockDataSourceNodeData();
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert
            expect(result.current).toBeUndefined();
        });
        it('should call useDataSourceList with true', () => {
            // Arrange
            const nodeData = createMockDataSourceNodeData();
            // Act
            (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert
            expect(mockUseDataSourceList).toHaveBeenCalledWith(true);
        });
    });
    describe('Success State', () => {
        it('should return icon when data is loaded and plugin matches', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'test-plugin-id',
                    declaration: {
                        identity: {
                            icon: '/icons/test-icon.png',
                            name: 'test',
                            label: { en_US: 'Test' },
                        },
                    },
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            mockTransformDataSourceToTool.mockImplementation(item => ({
                plugin_id: item.plugin_id,
                icon: item.declaration?.identity?.icon,
            }));
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert - Icon should have basePath prepended
            expect(result.current).toBe('/mock-base-path/icons/test-icon.png');
        });
        it('should return undefined when plugin does not match', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'other-plugin-id',
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert
            expect(result.current).toBeUndefined();
        });
        it('should prepend basePath to icon when icon does not include basePath', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'test-plugin-id',
                    declaration: {
                        identity: {
                            icon: '/icons/test-icon.png',
                            name: 'test',
                            label: { en_US: 'Test' },
                        },
                    },
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            mockTransformDataSourceToTool.mockImplementation(item => ({
                plugin_id: item.plugin_id,
                icon: item.declaration?.identity?.icon,
            }));
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert - Icon should have basePath prepended
            expect(result.current).toBe('/mock-base-path/icons/test-icon.png');
        });
        it('should not prepend basePath when icon already includes basePath', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'test-plugin-id',
                    declaration: {
                        identity: {
                            icon: '/mock-base-path/icons/test-icon.png',
                            name: 'test',
                            label: { en_US: 'Test' },
                        },
                    },
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            mockTransformDataSourceToTool.mockImplementation(item => ({
                plugin_id: item.plugin_id,
                icon: item.declaration?.identity?.icon,
            }));
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert - Icon should not be modified
            expect(result.current).toBe('/mock-base-path/icons/test-icon.png');
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty dataSourceList', () => {
            // Arrange
            mockUseDataSourceList.mockReturnValue({
                data: [],
                isSuccess: true,
            });
            const nodeData = createMockDataSourceNodeData();
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert
            expect(result.current).toBeUndefined();
        });
        it('should handle null dataSourceList', () => {
            // Arrange
            mockUseDataSourceList.mockReturnValue({
                data: null,
                isSuccess: true,
            });
            const nodeData = createMockDataSourceNodeData();
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert
            expect(result.current).toBeUndefined();
        });
        it('should handle icon as non-string type', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'test-plugin-id',
                    declaration: {
                        identity: {
                            icon: { url: '/icons/test-icon.png' }, // Object instead of string
                            name: 'test',
                            label: { en_US: 'Test' },
                        },
                    },
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            mockTransformDataSourceToTool.mockImplementation(item => ({
                plugin_id: item.plugin_id,
                icon: item.declaration?.identity?.icon,
            }));
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            // Assert - Should return the icon object as-is since it's not a string
            expect(result.current).toEqual({ url: '/icons/test-icon.png' });
        });
        it('should memoize result based on plugin_id', () => {
            // Arrange
            const mockDataSourceList = [
                createMockDataSourceListItem({
                    plugin_id: 'test-plugin-id',
                }),
            ];
            mockUseDataSourceList.mockReturnValue({
                data: mockDataSourceList,
                isSuccess: true,
            });
            const nodeData = createMockDataSourceNodeData({ plugin_id: 'test-plugin-id' });
            // Act
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceIcon)(nodeData), {
                wrapper: createHookWrapper(),
            });
            const firstResult = result.current;
            // Rerender with same props
            rerender();
            // Assert - Should return the same memoized result
            expect(result.current).toBe(firstResult);
        });
    });
});
// ==========================================
// OptionCard Tests
// ==========================================
describe('OptionCard', () => {
    const defaultProps = {
        label: 'Test Option',
        selected: false,
        nodeData: createMockDataSourceNodeData(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock for useDatasourceIcon
        mockUseDataSourceList.mockReturnValue({
            data: [],
            isSuccess: true,
        });
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Test Option')).toBeInTheDocument();
        });
        it('should render label text', () => {
            // Arrange & Act
            renderWithProviders(<option_card_1.default {...defaultProps} label="Custom Label"/>);
            // Assert
            expect(react_1.screen.getByText('Custom Label')).toBeInTheDocument();
        });
        it('should render DatasourceIcon component', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert - DatasourceIcon container should exist
            const iconContainer = container.querySelector('.size-8');
            expect(iconContainer).toBeInTheDocument();
        });
        it('should set title attribute for label truncation', () => {
            // Arrange
            const longLabel = 'This is a very long label that might be truncated';
            // Act
            renderWithProviders(<option_card_1.default {...defaultProps} label={longLabel}/>);
            // Assert
            const labelElement = react_1.screen.getByText(longLabel);
            expect(labelElement).toHaveAttribute('title', longLabel);
        });
    });
    describe('Props', () => {
        describe('selected', () => {
            it('should apply selected styles when selected is true', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<option_card_1.default {...defaultProps} selected={true}/>);
                // Assert
                const card = container.firstChild;
                expect(card).toHaveClass('border-components-option-card-option-selected-border');
                expect(card).toHaveClass('bg-components-option-card-option-selected-bg');
            });
            it('should apply unselected styles when selected is false', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<option_card_1.default {...defaultProps} selected={false}/>);
                // Assert
                const card = container.firstChild;
                expect(card).toHaveClass('border-components-option-card-option-border');
                expect(card).toHaveClass('bg-components-option-card-option-bg');
            });
            it('should apply text-text-primary to label when selected', () => {
                // Arrange & Act
                renderWithProviders(<option_card_1.default {...defaultProps} selected={true}/>);
                // Assert
                const label = react_1.screen.getByText('Test Option');
                expect(label).toHaveClass('text-text-primary');
            });
            it('should apply text-text-secondary to label when not selected', () => {
                // Arrange & Act
                renderWithProviders(<option_card_1.default {...defaultProps} selected={false}/>);
                // Assert
                const label = react_1.screen.getByText('Test Option');
                expect(label).toHaveClass('text-text-secondary');
            });
        });
        describe('onClick', () => {
            it('should call onClick when card is clicked', () => {
                // Arrange
                const mockOnClick = vi.fn();
                renderWithProviders(<option_card_1.default {...defaultProps} onClick={mockOnClick}/>);
                // Act - Click on the label text's parent card
                const labelElement = react_1.screen.getByText('Test Option');
                const card = labelElement.closest('[class*="cursor-pointer"]');
                expect(card).toBeInTheDocument();
                react_1.fireEvent.click(card);
                // Assert
                expect(mockOnClick).toHaveBeenCalledTimes(1);
            });
            it('should not crash when onClick is not provided', () => {
                // Arrange & Act
                renderWithProviders(<option_card_1.default {...defaultProps} onClick={undefined}/>);
                // Act - Click on the label text's parent card should not throw
                const labelElement = react_1.screen.getByText('Test Option');
                const card = labelElement.closest('[class*="cursor-pointer"]');
                expect(card).toBeInTheDocument();
                react_1.fireEvent.click(card);
                // Assert - Component should still be rendered
                expect(react_1.screen.getByText('Test Option')).toBeInTheDocument();
            });
        });
        describe('nodeData', () => {
            it('should pass nodeData to useDatasourceIcon hook', () => {
                // Arrange
                const customNodeData = createMockDataSourceNodeData({ plugin_id: 'custom-plugin' });
                // Act
                renderWithProviders(<option_card_1.default {...defaultProps} nodeData={customNodeData}/>);
                // Assert - Hook should be called (via useDataSourceList mock)
                expect(mockUseDataSourceList).toHaveBeenCalled();
            });
        });
    });
    describe('Styling', () => {
        it('should have cursor-pointer class', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('cursor-pointer');
        });
        it('should have flex layout classes', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('flex');
            expect(container.firstChild).toHaveClass('items-center');
            expect(container.firstChild).toHaveClass('gap-2');
        });
        it('should have rounded-xl border', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('rounded-xl');
            expect(container.firstChild).toHaveClass('border');
        });
        it('should have padding p-3', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('p-3');
        });
        it('should have line-clamp-2 for label truncation', () => {
            // Arrange & Act
            renderWithProviders(<option_card_1.default {...defaultProps}/>);
            // Assert
            const label = react_1.screen.getByText('Test Option');
            expect(label).toHaveClass('line-clamp-2');
        });
    });
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - OptionCard should be a memoized component
            expect(option_card_1.default).toBeDefined();
            // React.memo wraps the component, so we check it renders correctly
            const { container } = renderWithProviders(<option_card_1.default {...defaultProps}/>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
// ==========================================
// DataSourceOptions Tests
// ==========================================
describe('DataSourceOptions', () => {
    const defaultNodes = createMockPipelineNodes(3);
    const defaultOptions = defaultNodes.map(createMockDatasourceOption);
    const defaultProps = {
        pipelineNodes: defaultNodes,
        datasourceNodeId: '',
        onSelect: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseDatasourceOptions.mockReturnValue(defaultOptions);
        mockUseDataSourceList.mockReturnValue({
            data: [],
            isSuccess: true,
        });
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Data Source 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Data Source 3')).toBeInTheDocument();
        });
        it('should render correct number of option cards', () => {
            // Arrange & Act
            renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Data Source 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Data Source 3')).toBeInTheDocument();
        });
        it('should render with grid layout', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            const gridContainer = container.firstChild;
            expect(gridContainer).toHaveClass('grid');
            expect(gridContainer).toHaveClass('w-full');
            expect(gridContainer).toHaveClass('grid-cols-4');
            expect(gridContainer).toHaveClass('gap-1');
        });
        it('should render no option cards when options is empty', () => {
            // Arrange
            mockUseDatasourceOptions.mockReturnValue([]);
            // Act
            const { container } = renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.queryByText('Data Source')).not.toBeInTheDocument();
            // Grid container should still exist
            expect(container.firstChild).toHaveClass('grid');
        });
        it('should render single option card when only one option exists', () => {
            // Arrange
            const singleOption = [createMockDatasourceOption(defaultNodes[0])];
            mockUseDatasourceOptions.mockReturnValue(singleOption);
            // Act
            renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Data Source 2')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Tests
    // ==========================================
    describe('Props', () => {
        describe('pipelineNodes', () => {
            it('should pass pipelineNodes to useDatasourceOptions hook', () => {
                // Arrange
                const customNodes = createMockPipelineNodes(2);
                mockUseDatasourceOptions.mockReturnValue(customNodes.map(createMockDatasourceOption));
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={customNodes}/>);
                // Assert
                expect(mockUseDatasourceOptions).toHaveBeenCalledWith(customNodes);
            });
            it('should handle empty pipelineNodes array', () => {
                // Arrange
                mockUseDatasourceOptions.mockReturnValue([]);
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={[]}/>);
                // Assert
                expect(mockUseDatasourceOptions).toHaveBeenCalledWith([]);
            });
        });
        describe('datasourceNodeId', () => {
            it('should mark corresponding option as selected', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-2"/>);
                // Assert - Check for selected styling on second card
                const cards = container.querySelectorAll('.rounded-xl.border');
                expect(cards[1]).toHaveClass('border-components-option-card-option-selected-border');
            });
            it('should show no selection when datasourceNodeId is empty', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId=""/>);
                // Assert - No card should have selected styling
                const selectedCards = container.querySelectorAll('.border-components-option-card-option-selected-border');
                expect(selectedCards).toHaveLength(0);
            });
            it('should show no selection when datasourceNodeId does not match any option', () => {
                // Arrange & Act
                const { container } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="non-existent-node"/>);
                // Assert
                const selectedCards = container.querySelectorAll('.border-components-option-card-option-selected-border');
                expect(selectedCards).toHaveLength(0);
            });
            it('should update selection when datasourceNodeId changes', () => {
                // Arrange
                const { container, rerender } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1"/>);
                // Assert initial selection
                let cards = container.querySelectorAll('.rounded-xl.border');
                expect(cards[0]).toHaveClass('border-components-option-card-option-selected-border');
                // Act - Change selection
                rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
            <index_1.default {...defaultProps} datasourceNodeId="node-2"/>
          </react_query_1.QueryClientProvider>);
                // Assert new selection
                cards = container.querySelectorAll('.rounded-xl.border');
                expect(cards[0]).not.toHaveClass('border-components-option-card-option-selected-border');
                expect(cards[1]).toHaveClass('border-components-option-card-option-selected-border');
            });
        });
        describe('onSelect', () => {
            it('should receive onSelect callback', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} onSelect={mockOnSelect}/>);
                // Assert - Component renders without error
                expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Side Effects and Cleanup Tests
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        describe('useEffect - Auto-select first option', () => {
            it('should auto-select first option when options exist and no datasourceNodeId', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="" onSelect={mockOnSelect}/>);
                // Assert - Should auto-select first option on mount
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                expect(mockOnSelect).toHaveBeenCalledWith({
                    nodeId: 'node-1',
                    nodeData: defaultOptions[0].data,
                });
            });
            it('should NOT auto-select when datasourceNodeId is provided', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-2" onSelect={mockOnSelect}/>);
                // Assert - Should not auto-select because datasourceNodeId is provided
                expect(mockOnSelect).not.toHaveBeenCalled();
            });
            it('should NOT auto-select when options array is empty', () => {
                // Arrange
                mockUseDatasourceOptions.mockReturnValue([]);
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={[]} datasourceNodeId="" onSelect={mockOnSelect}/>);
                // Assert
                expect(mockOnSelect).not.toHaveBeenCalled();
            });
            it('should only run useEffect once on initial mount', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                const { rerender } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="" onSelect={mockOnSelect}/>);
                // Assert - Called once on mount
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                // Act - Rerender with same props
                rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
            <index_1.default {...defaultProps} datasourceNodeId="" onSelect={mockOnSelect}/>
          </react_query_1.QueryClientProvider>);
                // Assert - Still called only once (useEffect has empty dependency array)
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ==========================================
    // Callback Stability and Memoization Tests
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should maintain callback reference stability across renders with same props', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const { rerender } = renderWithProviders(<index_1.default {...defaultProps} onSelect={mockOnSelect}/>);
            // Get initial click handlers
            expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            // Trigger clicks to test handlers work
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
            expect(mockOnSelect).toHaveBeenCalledTimes(2); // 1 auto-select + 1 click
            // Act - Rerender with same onSelect reference
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps} onSelect={mockOnSelect}/>
        </react_query_1.QueryClientProvider>);
            // Assert - Component still works after rerender
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
            expect(mockOnSelect).toHaveBeenCalledTimes(3);
        });
        it('should update callback when onSelect changes', () => {
            // Arrange
            const mockOnSelect1 = vi.fn();
            const mockOnSelect2 = vi.fn();
            const { rerender } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect1}/>);
            // Act - Click with first callback
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
            expect(mockOnSelect1).toHaveBeenCalledTimes(1);
            // Act - Change callback
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect2}/>
        </react_query_1.QueryClientProvider>);
            // Act - Click with new callback
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 3'));
            // Assert - New callback should be called
            expect(mockOnSelect2).toHaveBeenCalledTimes(1);
            expect(mockOnSelect2).toHaveBeenCalledWith({
                nodeId: 'node-3',
                nodeData: defaultOptions[2].data,
            });
        });
        it('should update callback when options change', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const { rerender } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
            // Act - Click first option
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
            expect(mockOnSelect).toHaveBeenCalledWith({
                nodeId: 'node-1',
                nodeData: defaultOptions[0].data,
            });
            // Act - Change options
            const newNodes = createMockPipelineNodes(2);
            const newOptions = newNodes.map(node => createMockDatasourceOption(node));
            mockUseDatasourceOptions.mockReturnValue(newOptions);
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default pipelineNodes={newNodes} datasourceNodeId="node-1" onSelect={mockOnSelect}/>
        </react_query_1.QueryClientProvider>);
            // Act - Click updated first option
            react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
            // Assert - Callback receives new option data
            expect(mockOnSelect).toHaveBeenLastCalledWith({
                nodeId: newOptions[0].value,
                nodeData: newOptions[0].data,
            });
        });
    });
    // ==========================================
    // User Interactions and Event Handlers Tests
    // ==========================================
    describe('User Interactions and Event Handlers', () => {
        describe('Option Selection', () => {
            it('should call onSelect with correct datasource when clicking an option', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Act - Click second option
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
                // Assert
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                expect(mockOnSelect).toHaveBeenCalledWith({
                    nodeId: 'node-2',
                    nodeData: defaultOptions[1].data,
                });
            });
            it('should allow selecting already selected option', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Act - Click already selected option
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                // Assert
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                expect(mockOnSelect).toHaveBeenCalledWith({
                    nodeId: 'node-1',
                    nodeData: defaultOptions[0].data,
                });
            });
            it('should allow multiple sequential selections', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Act - Click options sequentially
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 3'));
                // Assert
                expect(mockOnSelect).toHaveBeenCalledTimes(3);
                expect(mockOnSelect).toHaveBeenNthCalledWith(1, {
                    nodeId: 'node-1',
                    nodeData: defaultOptions[0].data,
                });
                expect(mockOnSelect).toHaveBeenNthCalledWith(2, {
                    nodeId: 'node-2',
                    nodeData: defaultOptions[1].data,
                });
                expect(mockOnSelect).toHaveBeenNthCalledWith(3, {
                    nodeId: 'node-3',
                    nodeData: defaultOptions[2].data,
                });
            });
        });
        describe('handelSelect Internal Logic', () => {
            it('should handle rapid successive clicks', async () => {
                // Arrange
                const mockOnSelect = vi.fn();
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Act - Rapid clicks
                await (0, react_1.act)(async () => {
                    react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                    react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
                    react_1.fireEvent.click(react_1.screen.getByText('Data Source 3'));
                    react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                    react_1.fireEvent.click(react_1.screen.getByText('Data Source 2'));
                });
                // Assert - All clicks should be registered
                expect(mockOnSelect).toHaveBeenCalledTimes(5);
            });
        });
    });
    // ==========================================
    // Edge Cases and Error Handling Tests
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        describe('Empty States', () => {
            it('should handle empty options array gracefully', () => {
                // Arrange
                mockUseDatasourceOptions.mockReturnValue([]);
                // Act
                const { container } = renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={[]}/>);
                // Assert
                expect(container.firstChild).toBeInTheDocument();
            });
            it('should not crash when datasourceNodeId is undefined', () => {
                // Arrange & Act
                renderWithProviders(<index_1.default pipelineNodes={defaultNodes} datasourceNodeId={undefined} onSelect={vi.fn()}/>);
                // Assert
                expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            });
        });
        describe('Null/Undefined Values', () => {
            it('should handle option with missing data properties', () => {
                // Arrange
                const optionWithMinimalData = [{
                        label: 'Minimal Option',
                        value: 'minimal-1',
                        data: {
                            title: 'Minimal',
                            desc: '',
                            type: types_1.BlockEnum.DataSource,
                            plugin_id: '',
                            provider_type: '',
                            provider_name: '',
                            datasource_name: '',
                            datasource_label: '',
                            datasource_parameters: {},
                            datasource_configurations: {},
                        },
                    }];
                mockUseDatasourceOptions.mockReturnValue(optionWithMinimalData);
                // Act
                renderWithProviders(<index_1.default {...defaultProps}/>);
                // Assert
                expect(react_1.screen.getByText('Minimal Option')).toBeInTheDocument();
            });
        });
        describe('Large Data Sets', () => {
            it('should handle large number of options', () => {
                // Arrange
                const manyNodes = createMockPipelineNodes(50);
                const manyOptions = manyNodes.map(createMockDatasourceOption);
                mockUseDatasourceOptions.mockReturnValue(manyOptions);
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={manyNodes}/>);
                // Assert
                expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('Data Source 50')).toBeInTheDocument();
            });
        });
        describe('Special Characters in Data', () => {
            it('should handle special characters in option labels', () => {
                // Arrange
                const specialNode = createMockPipelineNode({
                    id: 'special-node',
                    data: createMockDataSourceNodeData({
                        title: 'Data Source <script>alert("xss")</script>',
                    }),
                });
                const specialOptions = [createMockDatasourceOption(specialNode)];
                mockUseDatasourceOptions.mockReturnValue(specialOptions);
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={[specialNode]}/>);
                // Assert - Special characters should be escaped/rendered safely
                expect(react_1.screen.getByText('Data Source <script>alert("xss")</script>')).toBeInTheDocument();
            });
            it('should handle unicode characters in option labels', () => {
                // Arrange
                const unicodeNode = createMockPipelineNode({
                    id: 'unicode-node',
                    data: createMockDataSourceNodeData({
                        title: '数据源 📁 Source émoji',
                    }),
                });
                const unicodeOptions = [createMockDatasourceOption(unicodeNode)];
                mockUseDatasourceOptions.mockReturnValue(unicodeOptions);
                // Act
                renderWithProviders(<index_1.default {...defaultProps} pipelineNodes={[unicodeNode]}/>);
                // Assert
                expect(react_1.screen.getByText('数据源 📁 Source émoji')).toBeInTheDocument();
            });
            it('should handle empty string as option value', () => {
                // Arrange
                const emptyValueOption = [{
                        label: 'Empty Value Option',
                        value: '',
                        data: createMockDataSourceNodeData(),
                    }];
                mockUseDatasourceOptions.mockReturnValue(emptyValueOption);
                // Act
                renderWithProviders(<index_1.default {...defaultProps}/>);
                // Assert
                expect(react_1.screen.getByText('Empty Value Option')).toBeInTheDocument();
            });
        });
        describe('Boundary Conditions', () => {
            it('should handle single option selection correctly', () => {
                // Arrange
                const singleOption = [createMockDatasourceOption(defaultNodes[0])];
                mockUseDatasourceOptions.mockReturnValue(singleOption);
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Assert - Click should still work
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
            });
            it('should handle options with same labels but different values', () => {
                // Arrange
                const duplicateLabelOptions = [
                    {
                        label: 'Duplicate Label',
                        value: 'node-a',
                        data: createMockDataSourceNodeData({ plugin_id: 'plugin-a' }),
                    },
                    {
                        label: 'Duplicate Label',
                        value: 'node-b',
                        data: createMockDataSourceNodeData({ plugin_id: 'plugin-b' }),
                    },
                ];
                mockUseDatasourceOptions.mockReturnValue(duplicateLabelOptions);
                const mockOnSelect = vi.fn();
                // Act
                renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-a" onSelect={mockOnSelect}/>);
                // Assert - Both should render
                const labels = react_1.screen.getAllByText('Duplicate Label');
                expect(labels).toHaveLength(2);
                // Click second one
                react_1.fireEvent.click(labels[1]);
                expect(mockOnSelect).toHaveBeenCalledWith({
                    nodeId: 'node-b',
                    nodeData: expect.objectContaining({ plugin_id: 'plugin-b' }),
                });
            });
        });
        describe('Component Unmounting', () => {
            it('should handle unmounting without errors', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                const { unmount } = renderWithProviders(<index_1.default {...defaultProps} onSelect={mockOnSelect}/>);
                // Act
                unmount();
                // Assert - No errors thrown, component cleanly unmounted
                expect(react_1.screen.queryByText('Data Source 1')).not.toBeInTheDocument();
            });
            it('should handle unmounting during rapid interactions', async () => {
                // Arrange
                const mockOnSelect = vi.fn();
                const { unmount } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-1" onSelect={mockOnSelect}/>);
                // Act - Start interactions then unmount
                react_1.fireEvent.click(react_1.screen.getByText('Data Source 1'));
                // Unmount during/after interaction
                unmount();
                // Assert - Should not throw
                expect(react_1.screen.queryByText('Data Source 1')).not.toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Integration Tests
    // ==========================================
    describe('Integration', () => {
        it('should render OptionCard with correct props', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert - Verify real OptionCard components are rendered
            const cards = container.querySelectorAll('.rounded-xl.border');
            expect(cards).toHaveLength(3);
        });
        it('should correctly pass selected state to OptionCard', () => {
            // Arrange & Act
            const { container } = renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId="node-2"/>);
            // Assert
            const cards = container.querySelectorAll('.rounded-xl.border');
            expect(cards[0]).not.toHaveClass('border-components-option-card-option-selected-border');
            expect(cards[1]).toHaveClass('border-components-option-card-option-selected-border');
            expect(cards[2]).not.toHaveClass('border-components-option-card-option-selected-border');
        });
        it('should use option.value as key for React rendering', () => {
            // This test verifies that React doesn't throw duplicate key warnings
            // Arrange
            const uniqueValueOptions = createMockPipelineNodes(5).map(createMockDatasourceOption);
            mockUseDatasourceOptions.mockReturnValue(uniqueValueOptions);
            // Act - Should render without console warnings about duplicate keys
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
            renderWithProviders(<index_1.default {...defaultProps}/>);
            // Assert
            expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('key'));
            consoleSpy.mockRestore();
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('All Prop Variations', () => {
        it.each([
            { datasourceNodeId: '', description: 'empty string' },
            { datasourceNodeId: 'node-1', description: 'first node' },
            { datasourceNodeId: 'node-2', description: 'middle node' },
            { datasourceNodeId: 'node-3', description: 'last node' },
            { datasourceNodeId: 'non-existent', description: 'non-existent node' },
        ])('should handle datasourceNodeId as $description', ({ datasourceNodeId }) => {
            // Arrange & Act
            renderWithProviders(<index_1.default {...defaultProps} datasourceNodeId={datasourceNodeId}/>);
            // Assert
            expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
        });
        it.each([
            { count: 0, description: 'zero options' },
            { count: 1, description: 'single option' },
            { count: 3, description: 'few options' },
            { count: 10, description: 'many options' },
        ])('should render correctly with $description', ({ count }) => {
            // Arrange
            const nodes = createMockPipelineNodes(count);
            const options = nodes.map(createMockDatasourceOption);
            mockUseDatasourceOptions.mockReturnValue(options);
            // Act
            renderWithProviders(<index_1.default pipelineNodes={nodes} datasourceNodeId="" onSelect={vi.fn()}/>);
            // Assert
            if (count > 0)
                expect(react_1.screen.getByText('Data Source 1')).toBeInTheDocument();
            else
                expect(react_1.screen.queryByText('Data Source 1')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsdURBQXdFO0FBQ3hFLGtEQUFtRjtBQUNuRiwrQkFBOEI7QUFDOUIsMkRBQTJEO0FBQzNELHVEQUE4QztBQUM5QyxtQ0FBMkM7QUFDM0MsbUNBQXVDO0FBQ3ZDLCtDQUFzQztBQUV0Qyw2Q0FBNkM7QUFDN0MsNkJBQTZCO0FBQzdCLDZDQUE2QztBQUU3QyxtREFBbUQ7QUFDbkQsTUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixvQkFBb0IsRUFBRSxDQUFDLEtBQWlDLEVBQUUsRUFBRSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQztDQUM3RixDQUFDLENBQUMsQ0FBQTtBQUVILGtDQUFrQztBQUNsQyxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNyQyxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFnQixFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUM7Q0FDeEUsQ0FBQyxDQUFDLENBQUE7QUFFSCx5Q0FBeUM7QUFDekMsTUFBTSw2QkFBNkIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDN0MsRUFBRSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELHlCQUF5QixFQUFFLENBQUMsSUFBYSxFQUFFLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUM7Q0FDbEYsQ0FBQyxDQUFDLENBQUE7QUFFSCxnQkFBZ0I7QUFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QixRQUFRLEVBQUUsaUJBQWlCO0NBQzVCLENBQUMsQ0FBQyxDQUFBO0FBRUgsNkNBQTZDO0FBQzdDLHFCQUFxQjtBQUNyQiw2Q0FBNkM7QUFFN0MsTUFBTSw0QkFBNEIsR0FBRyxDQUFDLFNBQXVDLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ3JHLEtBQUssRUFBRSxrQkFBa0I7SUFDekIsSUFBSSxFQUFFLGtCQUFrQjtJQUN4QixJQUFJLEVBQUUsaUJBQVMsQ0FBQyxVQUFVO0lBQzFCLFNBQVMsRUFBRSxnQkFBZ0I7SUFDM0IsYUFBYSxFQUFFLFlBQVk7SUFDM0IsYUFBYSxFQUFFLGVBQWU7SUFDOUIsZUFBZSxFQUFFLGlCQUFpQjtJQUNsQyxnQkFBZ0IsRUFBRSx1QkFBdUI7SUFDekMscUJBQXFCLEVBQUUsRUFBRTtJQUN6Qix5QkFBeUIsRUFBRSxFQUFFO0lBQzdCLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxTQUE2QyxFQUE0QixFQUFFO0lBQ3pHLE1BQU0sUUFBUSxHQUFHLDRCQUE0QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM5RCxPQUFPO1FBQ0wsRUFBRSxFQUFFLFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO1FBQ3BELElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQ3hCLElBQUksRUFBRSxRQUFRO1FBQ2QsR0FBRyxTQUFTO0tBQ2IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUE4QixFQUFFO0lBQ3hFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUM1QyxzQkFBc0IsQ0FBQztRQUNyQixFQUFFLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLElBQUksRUFBRSw0QkFBNEIsQ0FBQztZQUNqQyxLQUFLLEVBQUUsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLFNBQVMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsZUFBZSxFQUFFLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtTQUN2QyxDQUFDO0tBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDUCxDQUFDLENBQUE7QUFFRCxNQUFNLDBCQUEwQixHQUFHLENBQ2pDLElBQThCLEVBQzlCLEVBQUUsQ0FBQyxDQUFDO0lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztJQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUU7SUFDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Q0FDaEIsQ0FBQyxDQUFBO0FBRUYsTUFBTSw0QkFBNEIsR0FBRyxDQUFDLFNBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0UsV0FBVyxFQUFFO1FBQ1gsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtTQUNwQztRQUNELFFBQVEsRUFBRSxlQUFlO0tBQzFCO0lBQ0QsU0FBUyxFQUFFLGdCQUFnQjtJQUMzQixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRiw2Q0FBNkM7QUFDN0MsaUJBQWlCO0FBQ2pCLDZDQUE2QztBQUU3QyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUkseUJBQVcsQ0FBQztJQUM5QyxjQUFjLEVBQUU7UUFDZCxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQ3pCLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7S0FDNUI7Q0FDRixDQUFDLENBQUE7QUFFRixNQUFNLG1CQUFtQixHQUFHLENBQzFCLEVBQXNCLEVBQ3RCLFdBQXlCLEVBQ3pCLEVBQUU7SUFDRixNQUFNLE1BQU0sR0FBRyxXQUFXLElBQUksaUJBQWlCLEVBQUUsQ0FBQTtJQUNqRCxPQUFPLElBQUEsY0FBTSxFQUNYLENBQUMsaUNBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2xDO01BQUEsQ0FBQyxFQUFFLENBQ0w7SUFBQSxFQUFFLGlDQUFtQixDQUFDLENBQ3ZCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUM3QixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3ZDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBaUMsRUFBRSxFQUFFLENBQUMsQ0FDdEQsQ0FBQyxpQ0FBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FDdkM7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsaUNBQW1CLENBQUMsQ0FDdkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELDZDQUE2QztBQUM3Qyx1QkFBdUI7QUFDdkIsNkNBQTZDO0FBQzdDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFHLENBQUMsQ0FBQTtZQUV2RixTQUFTO1lBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxVQUFVO1lBQ1YsTUFBTSxPQUFPLEdBQUcsOEJBQThCLENBQUE7WUFFOUMsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWxFLFNBQVM7WUFDVCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUE7WUFDdEUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGVBQWUsRUFBRSxPQUFPLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUNyRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFHLENBQUMsQ0FBQTtZQUV2Rix3REFBd0Q7WUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDakQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1lBQ3BCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3BDLGdCQUFnQjtnQkFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUMxQixDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FDcEUsQ0FBQTtnQkFFRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMvQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDM0QsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO2dCQUNwQyxnQkFBZ0I7Z0JBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDMUIsQ0FBQyx5QkFBYyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQ3BFLENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ3hELENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtnQkFDcEMsZ0JBQWdCO2dCQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQzFCLENBQUMseUJBQWMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRyxDQUNwRSxDQUFBO2dCQUVELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQy9DLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMvQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7WUFDekIsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtnQkFDdkMsZ0JBQWdCO2dCQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQzFCLENBQUMseUJBQWMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRyxDQUNuRixDQUFBO2dCQUVELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDMUQsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO2dCQUM1RCxnQkFBZ0I7Z0JBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDMUIsQ0FBQyx5QkFBYyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FDN0YsQ0FBQTtnQkFFRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUN4RCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDakQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JDLGdCQUFnQjtnQkFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMseUJBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFHLENBQUMsQ0FBQTtnQkFFM0QsU0FBUztnQkFDVCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUE7Z0JBQ3RFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtZQUMzRCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JELFVBQVU7Z0JBQ1YsTUFBTSxPQUFPLEdBQUcsb0RBQW9ELENBQUE7Z0JBRXBFLE1BQU07Z0JBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMseUJBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBRWxFLFNBQVM7Z0JBQ1QsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO2dCQUN0RSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsZUFBZSxFQUFFLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1lBQ3JFLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtnQkFDM0MsVUFBVTtnQkFDVixNQUFNLE9BQU8sR0FBRyx3SEFBd0gsQ0FBQTtnQkFFeEksTUFBTTtnQkFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyx5QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFbEUsU0FBUztnQkFDVCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUE7Z0JBQ3RFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDNUMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFHLENBQUMsQ0FBQTtZQUV2RixTQUFTO1lBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDaEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7WUFDbkQsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHlCQUFjLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFHLENBQUMsQ0FBQTtZQUV2RiwyQ0FBMkM7WUFDM0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDdkQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyx5QkFBYyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsRUFBRyxDQUFDLENBQUE7WUFFdkYsU0FBUztZQUNULE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDcEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQzVDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLDZDQUE2QztBQUM3QywrQkFBK0I7QUFDL0IsNkNBQTZDO0FBQzdDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixxQkFBcUIsQ0FBQyxlQUFlLENBQUM7WUFDcEMsSUFBSSxFQUFFLEVBQUU7WUFDUixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFDLENBQUE7UUFDRiw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEQsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJO1NBQ3ZDLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELFVBQVU7WUFDVixxQkFBcUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxTQUFTO2dCQUNmLFNBQVMsRUFBRSxLQUFLO2FBQ2pCLENBQUMsQ0FBQTtZQUNGLE1BQU0sUUFBUSxHQUFHLDRCQUE0QixFQUFFLENBQUE7WUFFL0MsTUFBTTtZQUNOLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxVQUFVO1lBQ1YsTUFBTSxRQUFRLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQTtZQUUvQyxNQUFNO1lBQ04sSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQWlCLEVBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzVDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7WUFDbkUsVUFBVTtZQUNWLE1BQU0sa0JBQWtCLEdBQUc7Z0JBQ3pCLDRCQUE0QixDQUFDO29CQUMzQixTQUFTLEVBQUUsZ0JBQWdCO29CQUMzQixXQUFXLEVBQUU7d0JBQ1gsUUFBUSxFQUFFOzRCQUNSLElBQUksRUFBRSxzQkFBc0I7NEJBQzVCLElBQUksRUFBRSxNQUFNOzRCQUNaLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7eUJBQ3pCO3FCQUNGO2lCQUNGLENBQUM7YUFDSCxDQUFBO1lBQ0QscUJBQXFCLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUE7WUFDRiw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUk7YUFDdkMsQ0FBQyxDQUFDLENBQUE7WUFDSCxNQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7WUFFOUUsTUFBTTtZQUNOLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLCtDQUErQztZQUMvQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1FBQ3BFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxVQUFVO1lBQ1YsTUFBTSxrQkFBa0IsR0FBRztnQkFDekIsNEJBQTRCLENBQUM7b0JBQzNCLFNBQVMsRUFBRSxpQkFBaUI7aUJBQzdCLENBQUM7YUFDSCxDQUFBO1lBQ0QscUJBQXFCLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUE7WUFDRixNQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7WUFFOUUsTUFBTTtZQUNOLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUM3RSxVQUFVO1lBQ1YsTUFBTSxrQkFBa0IsR0FBRztnQkFDekIsNEJBQTRCLENBQUM7b0JBQzNCLFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLFdBQVcsRUFBRTt3QkFDWCxRQUFRLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLHNCQUFzQjs0QkFDNUIsSUFBSSxFQUFFLE1BQU07NEJBQ1osS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTt5QkFDekI7cUJBQ0Y7aUJBQ0YsQ0FBQzthQUNILENBQUE7WUFDRCxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQTtZQUNGLDZCQUE2QixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEQsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSTthQUN2QyxDQUFDLENBQUMsQ0FBQTtZQUNILE1BQU0sUUFBUSxHQUFHLDRCQUE0QixDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtZQUU5RSxNQUFNO1lBQ04sTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFpQixFQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMvRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBRUYsK0NBQStDO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1lBQ3pFLFVBQVU7WUFDVixNQUFNLGtCQUFrQixHQUFHO2dCQUN6Qiw0QkFBNEIsQ0FBQztvQkFDM0IsU0FBUyxFQUFFLGdCQUFnQjtvQkFDM0IsV0FBVyxFQUFFO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixJQUFJLEVBQUUscUNBQXFDOzRCQUMzQyxJQUFJLEVBQUUsTUFBTTs0QkFDWixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO3lCQUN6QjtxQkFDRjtpQkFDRixDQUFDO2FBQ0gsQ0FBQTtZQUNELHFCQUFxQixDQUFDLGVBQWUsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsU0FBUyxFQUFFLElBQUk7YUFDaEIsQ0FBQyxDQUFBO1lBQ0YsNkJBQTZCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxJQUFJO2FBQ3ZDLENBQUMsQ0FBQyxDQUFBO1lBQ0gsTUFBTSxRQUFRLEdBQUcsNEJBQTRCLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFBO1lBRTlFLE1BQU07WUFDTixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQWlCLEVBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRix1Q0FBdUM7WUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQTtRQUNwRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxVQUFVO1lBQ1YscUJBQXFCLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsRUFBRTtnQkFDUixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUE7WUFDRixNQUFNLFFBQVEsR0FBRyw0QkFBNEIsRUFBRSxDQUFBO1lBRS9DLE1BQU07WUFDTixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEseUJBQWlCLEVBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsVUFBVTtZQUNWLHFCQUFxQixDQUFDLGVBQWUsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsU0FBUyxFQUFFLElBQUk7YUFDaEIsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxRQUFRLEdBQUcsNEJBQTRCLEVBQUUsQ0FBQTtZQUUvQyxNQUFNO1lBQ04sTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHlCQUFpQixFQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMvRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDeEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLFVBQVU7WUFDVixNQUFNLGtCQUFrQixHQUFHO2dCQUN6Qiw0QkFBNEIsQ0FBQztvQkFDM0IsU0FBUyxFQUFFLGdCQUFnQjtvQkFDM0IsV0FBVyxFQUFFO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSwyQkFBMkI7NEJBQ2xFLElBQUksRUFBRSxNQUFNOzRCQUNaLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7eUJBQ3pCO3FCQUNGO2lCQUNGLENBQUM7YUFDSCxDQUFBO1lBQ0QscUJBQXFCLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsa0JBQWtCO2dCQUN4QixTQUFTLEVBQUUsSUFBSTthQUNoQixDQUFDLENBQUE7WUFDRiw2QkFBNkIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUk7YUFDdkMsQ0FBQyxDQUFDLENBQUE7WUFDSCxNQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7WUFFOUUsTUFBTTtZQUNOLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLHVFQUF1RTtZQUN2RSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRSxDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELFVBQVU7WUFDVixNQUFNLGtCQUFrQixHQUFHO2dCQUN6Qiw0QkFBNEIsQ0FBQztvQkFDM0IsU0FBUyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQzthQUNILENBQUE7WUFDRCxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxrQkFBa0I7Z0JBQ3hCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQTtZQUNGLE1BQU0sUUFBUSxHQUFHLDRCQUE0QixDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtZQUU5RSxNQUFNO1lBQ04sTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx5QkFBaUIsRUFBQyxRQUFRLENBQUMsRUFBRTtnQkFDekUsT0FBTyxFQUFFLGlCQUFpQixFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUNGLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7WUFFbEMsMkJBQTJCO1lBQzNCLFFBQVEsRUFBRSxDQUFBO1lBRVYsa0RBQWtEO1lBQ2xELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLDZDQUE2QztBQUM3QyxtQkFBbUI7QUFDbkIsNkNBQTZDO0FBQzdDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE1BQU0sWUFBWSxHQUFHO1FBQ25CLEtBQUssRUFBRSxhQUFhO1FBQ3BCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLDRCQUE0QixFQUFFO0tBQ3pDLENBQUE7SUFFRCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDJDQUEyQztRQUMzQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7WUFDcEMsSUFBSSxFQUFFLEVBQUU7WUFDUixTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsZ0JBQWdCO1lBQ2hCLG1CQUFtQixDQUFDLENBQUMscUJBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxnQkFBZ0I7WUFDaEIsbUJBQW1CLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRyxDQUFDLENBQUE7WUFFMUUsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFM0UsaURBQWlEO1lBQ2pELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDeEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELFVBQVU7WUFDVixNQUFNLFNBQVMsR0FBRyxtREFBbUQsQ0FBQTtZQUVyRSxNQUFNO1lBQ04sbUJBQW1CLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXZFLFNBQVM7WUFDVCxNQUFNLFlBQVksR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQzFELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUN4QixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO2dCQUM1RCxnQkFBZ0I7Z0JBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FDdkMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FDakQsQ0FBQTtnQkFFRCxTQUFTO2dCQUNULE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUE7Z0JBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsc0RBQXNELENBQUMsQ0FBQTtnQkFDaEYsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFBO1lBQzFFLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtnQkFDL0QsZ0JBQWdCO2dCQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQ3ZDLENBQUMscUJBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFHLENBQ2xELENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFBO2dCQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLDZDQUE2QyxDQUFDLENBQUE7Z0JBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMscUNBQXFDLENBQUMsQ0FBQTtZQUNqRSxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7Z0JBQy9ELGdCQUFnQjtnQkFDaEIsbUJBQW1CLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUVyRSxTQUFTO2dCQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUNoRCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JFLGdCQUFnQjtnQkFDaEIsbUJBQW1CLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUV0RSxTQUFTO2dCQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQTtZQUNsRCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7WUFDdkIsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtnQkFDbEQsVUFBVTtnQkFDVixNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBQzNCLG1CQUFtQixDQUNqQixDQUFDLHFCQUFVLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUN2RCxDQUFBO2dCQUVELDhDQUE4QztnQkFDOUMsTUFBTSxZQUFZLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFDcEQsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO2dCQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDaEMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFDLENBQUE7Z0JBRXRCLFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlDLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtnQkFDdkQsZ0JBQWdCO2dCQUNoQixtQkFBbUIsQ0FDakIsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUcsQ0FDckQsQ0FBQTtnQkFFRCwrREFBK0Q7Z0JBQy9ELE1BQU0sWUFBWSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQ3BELE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtnQkFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQ2hDLGlCQUFTLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQyxDQUFBO2dCQUV0Qiw4Q0FBOEM7Z0JBQzlDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7WUFDeEIsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtnQkFDeEQsVUFBVTtnQkFDVixNQUFNLGNBQWMsR0FBRyw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO2dCQUVuRixNQUFNO2dCQUNOLG1CQUFtQixDQUFDLENBQUMscUJBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFL0UsOERBQThEO2dCQUM5RCxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQ2xELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFM0UsU0FBUztZQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQ3pDLGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxxQkFBVSxDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTNFLFNBQVM7WUFDVCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNoRCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUN4RCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7WUFDdkMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFM0UsU0FBUztZQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ3RELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUNqQyxnQkFBZ0I7WUFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLG1CQUFtQixDQUFDLENBQUMscUJBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUzRSxTQUFTO1lBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDakQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELGdCQUFnQjtZQUNoQixtQkFBbUIsQ0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUMzQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDM0IsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxxREFBcUQ7WUFDckQsTUFBTSxDQUFDLHFCQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUNoQyxtRUFBbUU7WUFDbkUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLG1CQUFtQixDQUFDLENBQUMscUJBQVUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMzRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsNkNBQTZDO0FBQzdDLDBCQUEwQjtBQUMxQiw2Q0FBNkM7QUFDN0MsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxNQUFNLFlBQVksR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMvQyxNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFFbkUsTUFBTSxZQUFZLEdBQUc7UUFDbkIsYUFBYSxFQUFFLFlBQVk7UUFDM0IsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNsQixDQUFBO0lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQix3QkFBd0IsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDeEQscUJBQXFCLENBQUMsZUFBZSxDQUFDO1lBQ3BDLElBQUksRUFBRSxFQUFFO1lBQ1IsU0FBUyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0Msa0JBQWtCO0lBQ2xCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLGdCQUFnQjtZQUNoQixtQkFBbUIsQ0FBQyxDQUFDLGVBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFNUQsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxnQkFBZ0I7WUFDaEIsbUJBQW1CLENBQUMsQ0FBQyxlQUFpQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTVELFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLGVBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbEYsU0FBUztZQUNULE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUE7WUFDMUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsVUFBVTtZQUNWLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUU1QyxNQUFNO1lBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLG1CQUFtQixDQUFDLENBQUMsZUFBaUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVsRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNqRSxvQ0FBb0M7WUFDcEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1lBQ3RFLFVBQVU7WUFDVixNQUFNLFlBQVksR0FBRyxDQUFDLDBCQUEwQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEUsd0JBQXdCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBRXRELE1BQU07WUFDTixtQkFBbUIsQ0FBQyxDQUFDLGVBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFNUQsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3JFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsY0FBYztJQUNkLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtZQUM3QixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO2dCQUNoRSxVQUFVO2dCQUNWLE1BQU0sV0FBVyxHQUFHLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUM5Qyx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUE7Z0JBRXJGLE1BQU07Z0JBQ04sbUJBQW1CLENBQ2pCLENBQUMsZUFBaUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQ3BFLENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNwRSxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pELFVBQVU7Z0JBQ1Ysd0JBQXdCLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUU1QyxNQUFNO2dCQUNOLG1CQUFtQixDQUNqQixDQUFDLGVBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRyxDQUMzRCxDQUFBO2dCQUVELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtnQkFDdEQsZ0JBQWdCO2dCQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQ3ZDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxFQUN6QixDQUNILENBQUE7Z0JBRUQscURBQXFEO2dCQUNyRCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtnQkFDOUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1lBQ3RGLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtnQkFDakUsZ0JBQWdCO2dCQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQ3ZDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsRUFBRSxFQUNuQixDQUNILENBQUE7Z0JBRUQsZ0RBQWdEO2dCQUNoRCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsdURBQXVELENBQUMsQ0FBQTtnQkFDekcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN2QyxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywwRUFBMEUsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xGLGdCQUFnQjtnQkFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLG1CQUFtQixDQUN2QyxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLG1CQUFtQixFQUNwQyxDQUNILENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsdURBQXVELENBQUMsQ0FBQTtnQkFDekcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN2QyxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7Z0JBQy9ELFVBQVU7Z0JBQ1YsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxtQkFBbUIsQ0FDakQsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxRQUFRLEVBQ3pCLENBQ0gsQ0FBQTtnQkFFRCwyQkFBMkI7Z0JBQzNCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO2dCQUM1RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLHNEQUFzRCxDQUFDLENBQUE7Z0JBRXBGLHlCQUF5QjtnQkFDekIsUUFBUSxDQUNOLENBQUMsaUNBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUMvQztZQUFBLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxFQUU3QjtVQUFBLEVBQUUsaUNBQW1CLENBQUMsQ0FDdkIsQ0FBQTtnQkFFRCx1QkFBdUI7Z0JBQ3ZCLEtBQUssR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtnQkFDeEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsc0RBQXNELENBQUMsQ0FBQTtnQkFDeEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1lBQ3RGLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtZQUN4QixFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO2dCQUMxQyxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFFNUIsTUFBTTtnQkFDTixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO2dCQUVELDJDQUEyQztnQkFDM0MsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9ELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztJQUM3QyxpQ0FBaUM7SUFDakMsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7UUFDeEMsUUFBUSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUNwRCxFQUFFLENBQUMsNEVBQTRFLEVBQUUsR0FBRyxFQUFFO2dCQUNwRixVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFFNUIsTUFBTTtnQkFDTixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLENBQ25CLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQsb0RBQW9EO2dCQUNwRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzdDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDeEMsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDWixDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO2dCQUNsRSxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFFNUIsTUFBTTtnQkFDTixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxRQUFRLENBQ3pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQsdUVBQXVFO2dCQUN2RSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDN0MsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO2dCQUM1RCxVQUFVO2dCQUNWLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDNUMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUU1QixNQUFNO2dCQUNOLG1CQUFtQixDQUNqQixDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNsQixnQkFBZ0IsQ0FBQyxFQUFFLENBQ25CLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDN0MsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO2dCQUN6RCxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDNUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLG1CQUFtQixDQUN0QyxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLEVBQUUsQ0FDbkIsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQ3ZCLENBQ0gsQ0FBQTtnQkFFRCxnQ0FBZ0M7Z0JBQ2hDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFN0MsaUNBQWlDO2dCQUNqQyxRQUFRLENBQ04sQ0FBQyxpQ0FBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQy9DO1lBQUEsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLENBQ25CLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUUzQjtVQUFBLEVBQUUsaUNBQW1CLENBQUMsQ0FDdkIsQ0FBQTtnQkFFRCx5RUFBeUU7Z0JBQ3pFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsMkNBQTJDO0lBQzNDLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELEVBQUUsQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7WUFDckYsVUFBVTtZQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUU1QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsbUJBQW1CLENBQ3RDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQ3ZCLENBQ0gsQ0FBQTtZQUVELDZCQUE2QjtZQUM3QixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFN0QsdUNBQXVDO1lBQ3ZDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQywwQkFBMEI7WUFFeEUsOENBQThDO1lBQzlDLFFBQVEsQ0FDTixDQUFDLGlDQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FDL0M7VUFBQSxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUUzQjtRQUFBLEVBQUUsaUNBQW1CLENBQUMsQ0FDdkIsQ0FBQTtZQUVELGdEQUFnRDtZQUNoRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxVQUFVO1lBQ1YsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQzdCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUU3QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsbUJBQW1CLENBQ3RDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFDeEIsQ0FDSCxDQUFBO1lBRUQsa0NBQWtDO1lBQ2xDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFOUMsd0JBQXdCO1lBQ3hCLFFBQVEsQ0FDTixDQUFDLGlDQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FDL0M7VUFBQSxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLFFBQVEsQ0FDekIsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBRTVCO1FBQUEsRUFBRSxpQ0FBbUIsQ0FBQyxDQUN2QixDQUFBO1lBRUQsZ0NBQWdDO1lBQ2hDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUVsRCx5Q0FBeUM7WUFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDekMsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUNqQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsVUFBVTtZQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUU1QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsbUJBQW1CLENBQ3RDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO1lBRUQsMkJBQTJCO1lBQzNCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3hDLE1BQU0sRUFBRSxRQUFRO2dCQUNoQixRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7YUFDakMsQ0FBQyxDQUFBO1lBRUYsdUJBQXVCO1lBQ3ZCLE1BQU0sUUFBUSxHQUFHLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ3pFLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUVwRCxRQUFRLENBQ04sQ0FBQyxpQ0FBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQy9DO1VBQUEsQ0FBQyxlQUFpQixDQUNoQixhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDeEIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFFM0I7UUFBQSxFQUFFLGlDQUFtQixDQUFDLENBQ3ZCLENBQUE7WUFFRCxtQ0FBbUM7WUFDbkMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO1lBRWxELDZDQUE2QztZQUM3QyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsd0JBQXdCLENBQUM7Z0JBQzVDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSztnQkFDM0IsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2FBQzdCLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsNkNBQTZDO0lBQzdDLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsRUFBRSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtnQkFDOUUsVUFBVTtnQkFDVixNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBQzVCLG1CQUFtQixDQUNqQixDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLFFBQVEsQ0FDekIsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQ3ZCLENBQ0gsQ0FBQTtnQkFFRCw0QkFBNEI7Z0JBQzVCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFFbEQsU0FBUztnQkFDVCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzdDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDeEMsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDWixDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO2dCQUN4RCxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDNUIsbUJBQW1CLENBQ2pCLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO2dCQUVELHNDQUFzQztnQkFDdEMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO2dCQUVsRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDN0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLG9CQUFvQixDQUFDO29CQUN4QyxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2lCQUNqQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7Z0JBQ3JELFVBQVU7Z0JBQ1YsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUM1QixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxRQUFRLENBQ3pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQsbUNBQW1DO2dCQUNuQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7Z0JBQ2xELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFDbEQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO2dCQUVsRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDN0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRTtvQkFDOUMsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDakMsQ0FBQyxDQUFBO2dCQUNGLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUU7b0JBQzlDLE1BQU0sRUFBRSxRQUFRO29CQUNoQixRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7aUJBQ2pDLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFO29CQUM5QyxNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2lCQUNqQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUMzQyxFQUFFLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3JELFVBQVU7Z0JBQ1YsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUM1QixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxRQUFRLENBQ3pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQscUJBQXFCO2dCQUNyQixNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO29CQUNuQixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7b0JBQ2xELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtvQkFDbEQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO29CQUNsRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7b0JBQ2xELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtnQkFDcEQsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsMkNBQTJDO2dCQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0MsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLHNDQUFzQztJQUN0Qyw2Q0FBNkM7SUFDN0MsUUFBUSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUM3QyxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtZQUM1QixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO2dCQUN0RCxVQUFVO2dCQUNWLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFFNUMsTUFBTTtnQkFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQ3ZDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ2xCLENBQ0gsQ0FBQTtnQkFFRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNsRCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7Z0JBQzdELGdCQUFnQjtnQkFDaEIsbUJBQW1CLENBQ2pCLENBQUMsZUFBaUIsQ0FDaEIsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQzVCLGdCQUFnQixDQUFDLENBQUMsU0FBOEIsQ0FBQyxDQUNqRCxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbEIsQ0FDSCxDQUFBO2dCQUVELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9ELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7Z0JBQzNELFVBQVU7Z0JBQ1YsTUFBTSxxQkFBcUIsR0FBRyxDQUFDO3dCQUM3QixLQUFLLEVBQUUsZ0JBQWdCO3dCQUN2QixLQUFLLEVBQUUsV0FBVzt3QkFDbEIsSUFBSSxFQUFFOzRCQUNKLEtBQUssRUFBRSxTQUFTOzRCQUNoQixJQUFJLEVBQUUsRUFBRTs0QkFDUixJQUFJLEVBQUUsaUJBQVMsQ0FBQyxVQUFVOzRCQUMxQixTQUFTLEVBQUUsRUFBRTs0QkFDYixhQUFhLEVBQUUsRUFBRTs0QkFDakIsYUFBYSxFQUFFLEVBQUU7NEJBQ2pCLGVBQWUsRUFBRSxFQUFFOzRCQUNuQixnQkFBZ0IsRUFBRSxFQUFFOzRCQUNwQixxQkFBcUIsRUFBRSxFQUFFOzRCQUN6Qix5QkFBeUIsRUFBRSxFQUFFO3lCQUNSO3FCQUN4QixDQUFDLENBQUE7Z0JBQ0Ysd0JBQXdCLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLENBQUE7Z0JBRS9ELE1BQU07Z0JBQ04sbUJBQW1CLENBQUMsQ0FBQyxlQUFpQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUU1RCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2hFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1lBQy9CLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7Z0JBQy9DLFVBQVU7Z0JBQ1YsTUFBTSxTQUFTLEdBQUcsdUJBQXVCLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQzdDLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtnQkFDN0Qsd0JBQXdCLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUVyRCxNQUFNO2dCQUNOLG1CQUFtQixDQUNqQixDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUN6QixDQUNILENBQUE7Z0JBRUQsU0FBUztnQkFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQzdELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2hFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQzFDLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7Z0JBQzNELFVBQVU7Z0JBQ1YsTUFBTSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7b0JBQ3pDLEVBQUUsRUFBRSxjQUFjO29CQUNsQixJQUFJLEVBQUUsNEJBQTRCLENBQUM7d0JBQ2pDLEtBQUssRUFBRSwyQ0FBMkM7cUJBQ25ELENBQUM7aUJBQ0gsQ0FBQyxDQUFBO2dCQUNGLE1BQU0sY0FBYyxHQUFHLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtnQkFDaEUsd0JBQXdCLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUV4RCxNQUFNO2dCQUNOLG1CQUFtQixDQUNqQixDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsRUFDN0IsQ0FDSCxDQUFBO2dCQUVELGdFQUFnRTtnQkFDaEUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDM0YsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO2dCQUMzRCxVQUFVO2dCQUNWLE1BQU0sV0FBVyxHQUFHLHNCQUFzQixDQUFDO29CQUN6QyxFQUFFLEVBQUUsY0FBYztvQkFDbEIsSUFBSSxFQUFFLDRCQUE0QixDQUFDO3dCQUNqQyxLQUFLLEVBQUUscUJBQXFCO3FCQUM3QixDQUFDO2lCQUNILENBQUMsQ0FBQTtnQkFDRixNQUFNLGNBQWMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7Z0JBQ2hFLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFFeEQsTUFBTTtnQkFDTixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQzdCLENBQ0gsQ0FBQTtnQkFFRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3JFLENBQUMsQ0FBQyxDQUFBO1lBRUYsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtnQkFDcEQsVUFBVTtnQkFDVixNQUFNLGdCQUFnQixHQUFHLENBQUM7d0JBQ3hCLEtBQUssRUFBRSxvQkFBb0I7d0JBQzNCLEtBQUssRUFBRSxFQUFFO3dCQUNULElBQUksRUFBRSw0QkFBNEIsRUFBRTtxQkFDckMsQ0FBQyxDQUFBO2dCQUNGLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUUxRCxNQUFNO2dCQUNOLG1CQUFtQixDQUFDLENBQUMsZUFBaUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFNUQsU0FBUztnQkFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtZQUNuQyxFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO2dCQUN6RCxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLENBQUMsMEJBQTBCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbEUsd0JBQXdCLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO2dCQUN0RCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBRTVCLE1BQU07Z0JBQ04sbUJBQW1CLENBQ2pCLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO2dCQUVELG1DQUFtQztnQkFDbkMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO2dCQUNsRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0MsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxVQUFVO2dCQUNWLE1BQU0scUJBQXFCLEdBQUc7b0JBQzVCO3dCQUNFLEtBQUssRUFBRSxpQkFBaUI7d0JBQ3hCLEtBQUssRUFBRSxRQUFRO3dCQUNmLElBQUksRUFBRSw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQztxQkFDOUQ7b0JBQ0Q7d0JBQ0UsS0FBSyxFQUFFLGlCQUFpQjt3QkFDeEIsS0FBSyxFQUFFLFFBQVE7d0JBQ2YsSUFBSSxFQUFFLDRCQUE0QixDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDO3FCQUM5RDtpQkFDRixDQUFBO2dCQUNELHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO2dCQUMvRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBRTVCLE1BQU07Z0JBQ04sbUJBQW1CLENBQ2pCLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO2dCQUVELDhCQUE4QjtnQkFDOUIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO2dCQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUU5QixtQkFBbUI7Z0JBQ25CLGlCQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMxQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsb0JBQW9CLENBQUM7b0JBQ3hDLE1BQU0sRUFBRSxRQUFRO29CQUNoQixRQUFRLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDO2lCQUM3RCxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO2dCQUNqRCxVQUFVO2dCQUNWLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDNUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLG1CQUFtQixDQUNyQyxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNILENBQUE7Z0JBRUQsTUFBTTtnQkFDTixPQUFPLEVBQUUsQ0FBQTtnQkFFVCx5REFBeUQ7Z0JBQ3pELE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckUsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xFLFVBQVU7Z0JBQ1YsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUM1QixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsbUJBQW1CLENBQ3JDLENBQUMsZUFBaUIsQ0FDaEIsSUFBSSxZQUFZLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsUUFBUSxDQUN6QixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFDdkIsQ0FDSCxDQUFBO2dCQUVELHdDQUF3QztnQkFDeEMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO2dCQUVsRCxtQ0FBbUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFBO2dCQUVULDRCQUE0QjtnQkFDNUIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNyRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0Msb0JBQW9CO0lBQ3BCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxlQUFpQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWxGLDBEQUEwRDtZQUMxRCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtZQUM5RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxnQkFBZ0I7WUFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLG1CQUFtQixDQUN2QyxDQUFDLGVBQWlCLENBQ2hCLElBQUksWUFBWSxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLFFBQVEsRUFDekIsQ0FDSCxDQUFBO1lBRUQsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1lBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHNEQUFzRCxDQUFDLENBQUE7WUFDeEYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1lBQ3BGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHNEQUFzRCxDQUFDLENBQUE7UUFDMUYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELHFFQUFxRTtZQUNyRSxVQUFVO1lBQ1YsTUFBTSxrQkFBa0IsR0FBRyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtZQUNyRix3QkFBd0IsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtZQUU1RCxvRUFBb0U7WUFDcEUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDekUsbUJBQW1CLENBQUMsQ0FBQyxlQUFpQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTVELFNBQVM7WUFDVCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUN6QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQy9CLENBQUE7WUFDRCxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztJQUM3Qyw0QkFBNEI7SUFDNUIsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNOLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUU7WUFDckQsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRTtZQUN6RCxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFO1lBQzFELEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUU7WUFDeEQsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFO1NBQ3ZFLENBQUMsQ0FBQyxnREFBZ0QsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1lBQzVFLGdCQUFnQjtZQUNoQixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEVBQ25DLENBQ0gsQ0FBQTtZQUVELFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ04sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUU7WUFDekMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUU7WUFDMUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUU7WUFDeEMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUU7U0FDM0MsQ0FBQyxDQUFDLDJDQUEyQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzVELFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM1QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUE7WUFDckQsd0JBQXdCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRWpELE1BQU07WUFDTixtQkFBbUIsQ0FDakIsQ0FBQyxlQUFpQixDQUNoQixhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDckIsZ0JBQWdCLENBQUMsRUFBRSxDQUNuQixRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbEIsQ0FDSCxDQUFBO1lBRUQsU0FBUztZQUNULElBQUksS0FBSyxHQUFHLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBOztnQkFFN0QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERhdGFzb3VyY2UgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3JhZy1waXBlbGluZS9jb21wb25lbnRzL3BhbmVsL3Rlc3QtcnVuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgcmVuZGVySG9vaywgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCBEYXRhc291cmNlSWNvbiBmcm9tICcuL2RhdGFzb3VyY2UtaWNvbidcbmltcG9ydCB7IHVzZURhdGFzb3VyY2VJY29uIH0gZnJvbSAnLi9ob29rcydcbmltcG9ydCBEYXRhU291cmNlT3B0aW9ucyBmcm9tICcuL2luZGV4J1xuaW1wb3J0IE9wdGlvbkNhcmQgZnJvbSAnLi9vcHRpb24tY2FyZCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgdXNlRGF0YXNvdXJjZU9wdGlvbnMgaG9vayBmcm9tIHBhcmVudCBob29rc1xuY29uc3QgbW9ja1VzZURhdGFzb3VyY2VPcHRpb25zID0gdmkuZm4oKVxudmkubW9jaygnLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VEYXRhc291cmNlT3B0aW9uczogKG5vZGVzOiBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT5bXSkgPT4gbW9ja1VzZURhdGFzb3VyY2VPcHRpb25zKG5vZGVzKSxcbn0pKVxuXG4vLyBNb2NrIHVzZURhdGFTb3VyY2VMaXN0IEFQSSBob29rXG5jb25zdCBtb2NrVXNlRGF0YVNvdXJjZUxpc3QgPSB2aS5mbigpXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJywgKCkgPT4gKHtcbiAgdXNlRGF0YVNvdXJjZUxpc3Q6IChlbmFibGVkOiBib29sZWFuKSA9PiBtb2NrVXNlRGF0YVNvdXJjZUxpc3QoZW5hYmxlZCksXG59KSlcblxuLy8gTW9jayB0cmFuc2Zvcm1EYXRhU291cmNlVG9Ub29sIHV0aWxpdHlcbmNvbnN0IG1vY2tUcmFuc2Zvcm1EYXRhU291cmNlVG9Ub29sID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci91dGlscycsICgpID0+ICh7XG4gIHRyYW5zZm9ybURhdGFTb3VyY2VUb1Rvb2w6IChpdGVtOiB1bmtub3duKSA9PiBtb2NrVHJhbnNmb3JtRGF0YVNvdXJjZVRvVG9vbChpdGVtKSxcbn0pKVxuXG4vLyBNb2NrIGJhc2VQYXRoXG52aS5tb2NrKCdAL3V0aWxzL3ZhcicsICgpID0+ICh7XG4gIGJhc2VQYXRoOiAnL21vY2stYmFzZS1wYXRoJyxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBCdWlsZGVyc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm9kZVR5cGU+KTogRGF0YVNvdXJjZU5vZGVUeXBlID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBEYXRhIFNvdXJjZScsXG4gIGRlc2M6ICdUZXN0IGRlc2NyaXB0aW9uJyxcbiAgdHlwZTogQmxvY2tFbnVtLkRhdGFTb3VyY2UsXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgcHJvdmlkZXJfdHlwZTogJ2xvY2FsX2ZpbGUnLFxuICBwcm92aWRlcl9uYW1lOiAnVGVzdCBQcm92aWRlcicsXG4gIGRhdGFzb3VyY2VfbmFtZTogJ3Rlc3QtZGF0YXNvdXJjZScsXG4gIGRhdGFzb3VyY2VfbGFiZWw6ICdUZXN0IERhdGFzb3VyY2UgTGFiZWwnLFxuICBkYXRhc291cmNlX3BhcmFtZXRlcnM6IHt9LFxuICBkYXRhc291cmNlX2NvbmZpZ3VyYXRpb25zOiB7fSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1BpcGVsaW5lTm9kZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPE5vZGU8RGF0YVNvdXJjZU5vZGVUeXBlPj4pOiBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT4gPT4ge1xuICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEob3ZlcnJpZGVzPy5kYXRhKVxuICByZXR1cm4ge1xuICAgIGlkOiBgbm9kZS0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDkpfWAsXG4gICAgdHlwZTogJ2N1c3RvbScsXG4gICAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9LFxuICAgIGRhdGE6IG5vZGVEYXRhLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfVxufVxuXG5jb25zdCBjcmVhdGVNb2NrUGlwZWxpbmVOb2RlcyA9IChjb3VudCA9IDMpOiBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT5bXSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT5cbiAgICBjcmVhdGVNb2NrUGlwZWxpbmVOb2RlKHtcbiAgICAgIGlkOiBgbm9kZS0ke2kgKyAxfWAsXG4gICAgICBkYXRhOiBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKHtcbiAgICAgICAgdGl0bGU6IGBEYXRhIFNvdXJjZSAke2kgKyAxfWAsXG4gICAgICAgIHBsdWdpbl9pZDogYHBsdWdpbi0ke2kgKyAxfWAsXG4gICAgICAgIGRhdGFzb3VyY2VfbmFtZTogYGRhdGFzb3VyY2UtJHtpICsgMX1gLFxuICAgICAgfSksXG4gICAgfSkpXG59XG5cbmNvbnN0IGNyZWF0ZU1vY2tEYXRhc291cmNlT3B0aW9uID0gKFxuICBub2RlOiBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT4sXG4pID0+ICh7XG4gIGxhYmVsOiBub2RlLmRhdGEudGl0bGUsXG4gIHZhbHVlOiBub2RlLmlkLFxuICBkYXRhOiBub2RlLmRhdGEsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrRGF0YVNvdXJjZUxpc3RJdGVtID0gKG92ZXJyaWRlcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiAoe1xuICBkZWNsYXJhdGlvbjoge1xuICAgIGlkZW50aXR5OiB7XG4gICAgICBpY29uOiAnL2ljb25zL3Rlc3QtaWNvbi5wbmcnLFxuICAgICAgbmFtZTogJ3Rlc3QtZGF0YXNvdXJjZScsXG4gICAgICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QgRGF0YXNvdXJjZScgfSxcbiAgICB9LFxuICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gIH0sXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFV0aWxpdGllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZVF1ZXJ5Q2xpZW50ID0gKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7IHJldHJ5OiBmYWxzZSB9LFxuICAgIG11dGF0aW9uczogeyByZXRyeTogZmFsc2UgfSxcbiAgfSxcbn0pXG5cbmNvbnN0IHJlbmRlcldpdGhQcm92aWRlcnMgPSAoXG4gIHVpOiBSZWFjdC5SZWFjdEVsZW1lbnQsXG4gIHF1ZXJ5Q2xpZW50PzogUXVlcnlDbGllbnQsXG4pID0+IHtcbiAgY29uc3QgY2xpZW50ID0gcXVlcnlDbGllbnQgfHwgY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y2xpZW50fT5cbiAgICAgIHt1aX1cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICApXG59XG5cbmNvbnN0IGNyZWF0ZUhvb2tXcmFwcGVyID0gKCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiAoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICApXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRGF0YXNvdXJjZUljb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0RhdGFzb3VyY2VJY29uJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEYXRhc291cmNlSWNvbiBpY29uVXJsPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpY29uIHdpdGggYmFja2dyb3VuZCBpbWFnZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGljb25VcmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZydcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEYXRhc291cmNlSWNvbiBpY29uVXJsPXtpY29uVXJsfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpY29uRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tzdHlsZSo9XCJiYWNrZ3JvdW5kLWltYWdlXCJdJylcbiAgICAgIGV4cGVjdChpY29uRGl2KS50b0hhdmVTdHlsZSh7IGJhY2tncm91bmRJbWFnZTogYHVybCgke2ljb25Vcmx9KWAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBkZWZhdWx0IHNpemUgKHNtKScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERhdGFzb3VyY2VJY29uIGljb25Vcmw9XCJodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIERlZmF1bHQgc2l6ZSBpcyAnc20nIHdoaWNoIG1hcHMgdG8gJ3ctNSBoLTUnXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCd3LTUnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnaC01JylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnc2l6ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggeHMgc2l6ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxEYXRhc291cmNlSWNvbiBpY29uVXJsPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZ1wiIHNpemU9XCJ4c1wiIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ3ctNCcpXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2gtNCcpXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ3JvdW5kZWQtWzVweF0nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBzbSBzaXplJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPERhdGFzb3VyY2VJY29uIGljb25Vcmw9XCJodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nXCIgc2l6ZT1cInNtXCIgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygndy01JylcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnaC01JylcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygncm91bmRlZC1tZCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIG1kIHNpemUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8RGF0YXNvdXJjZUljb24gaWNvblVybD1cImh0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmdcIiBzaXplPVwibWRcIiAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCd3LTYnKVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdoLTYnKVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLWxnJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8RGF0YXNvdXJjZUljb24gaWNvblVybD1cImh0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmdcIiBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdjdXN0b20tY2xhc3MnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBtZXJnZSBjdXN0b20gY2xhc3NOYW1lIHdpdGggZGVmYXVsdCBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPERhdGFzb3VyY2VJY29uIGljb25Vcmw9XCJodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nXCIgY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgc2l6ZT1cInNtXCIgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnY3VzdG9tLWNsYXNzJylcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygndy01JylcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnaC01JylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpY29uVXJsJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgaWNvblVybCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEYXRhc291cmNlSWNvbiBpY29uVXJsPVwiXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGljb25EaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3N0eWxlKj1cImJhY2tncm91bmQtaW1hZ2VcIl0nKVxuICAgICAgICBleHBlY3QoaWNvbkRpdikudG9IYXZlU3R5bGUoeyBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoKScgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBpY29uVXJsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGljb25VcmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZz9wYXJhbT12YWx1ZSZvdGhlcj0xMjMnXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERhdGFzb3VyY2VJY29uIGljb25Vcmw9e2ljb25Vcmx9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBpY29uRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tzdHlsZSo9XCJiYWNrZ3JvdW5kLWltYWdlXCJdJylcbiAgICAgICAgZXhwZWN0KGljb25EaXYpLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7aWNvblVybH0pYCB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGF0YSBVUkwgYXMgaWNvblVybCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkYXRhVXJsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZSNDJtTmsrTTlRRHdBRGhnR0FXalI5YXdBQUFBQkpSVTVFcmtKZ2dnPT0nXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERhdGFzb3VyY2VJY29uIGljb25Vcmw9e2RhdGFVcmx9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBpY29uRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tzdHlsZSo9XCJiYWNrZ3JvdW5kLWltYWdlXCJdJylcbiAgICAgICAgZXhwZWN0KGljb25EaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgZmxleCBjb250YWluZXIgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPERhdGFzb3VyY2VJY29uIGljb25Vcmw9XCJodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdpdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnanVzdGlmeS1jZW50ZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2hhZG93LXhzIGNsYXNzIGZyb20gc2l6ZSBtYXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEYXRhc291cmNlSWNvbiBpY29uVXJsPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBEZWZhdWx0IHNpemUgJ3NtJyBoYXMgc2hhZG93LXhzXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdzaGFkb3cteHMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgaW5uZXIgZGl2IHdpdGggYmctY292ZXIgY2xhc3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxEYXRhc291cmNlSWNvbiBpY29uVXJsPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlubmVyRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1jb3ZlcicpXG4gICAgICBleHBlY3QoaW5uZXJEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpbm5lckRpdikudG9IYXZlQ2xhc3MoJ2JnLWNlbnRlcicpXG4gICAgICBleHBlY3QoaW5uZXJEaXYpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLW1kJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VEYXRhc291cmNlSWNvbiBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCd1c2VEYXRhc291cmNlSWNvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZURhdGFTb3VyY2VMaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiBbXSxcbiAgICAgIGlzU3VjY2VzczogZmFsc2UsXG4gICAgfSlcbiAgICBtb2NrVHJhbnNmb3JtRGF0YVNvdXJjZVRvVG9vbC5tb2NrSW1wbGVtZW50YXRpb24oaXRlbSA9PiAoe1xuICAgICAgcGx1Z2luX2lkOiBpdGVtLnBsdWdpbl9pZCxcbiAgICAgIGljb246IGl0ZW0uZGVjbGFyYXRpb24/LmlkZW50aXR5Py5pY29uLFxuICAgIH0pKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCB3aGVuIGRhdGEgaXMgbm90IGxvYWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VEYXRhU291cmNlTGlzdC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGlzU3VjY2VzczogZmFsc2UsXG4gICAgICB9KVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHVzZURhdGFTb3VyY2VMaXN0IHdpdGggdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VEYXRhU291cmNlTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdWNjZXNzIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGljb24gd2hlbiBkYXRhIGlzIGxvYWRlZCBhbmQgcGx1Z2luIG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRGF0YVNvdXJjZUxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhU291cmNlTGlzdEl0ZW0oe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgICAgaWRlbnRpdHk6IHtcbiAgICAgICAgICAgICAgaWNvbjogJy9pY29ucy90ZXN0LWljb24ucG5nJyxcbiAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1VzZURhdGFTb3VyY2VMaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG1vY2tEYXRhU291cmNlTGlzdCxcbiAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIG1vY2tUcmFuc2Zvcm1EYXRhU291cmNlVG9Ub29sLm1vY2tJbXBsZW1lbnRhdGlvbihpdGVtID0+ICh7XG4gICAgICAgIHBsdWdpbl9pZDogaXRlbS5wbHVnaW5faWQsXG4gICAgICAgIGljb246IGl0ZW0uZGVjbGFyYXRpb24/LmlkZW50aXR5Py5pY29uLFxuICAgICAgfSkpXG4gICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEoeyBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEljb24gc2hvdWxkIGhhdmUgYmFzZVBhdGggcHJlcGVuZGVkXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoJy9tb2NrLWJhc2UtcGF0aC9pY29ucy90ZXN0LWljb24ucG5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gcGx1Z2luIGRvZXMgbm90IG1hdGNoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0RhdGFTb3VyY2VMaXN0ID0gW1xuICAgICAgICBjcmVhdGVNb2NrRGF0YVNvdXJjZUxpc3RJdGVtKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICdvdGhlci1wbHVnaW4taWQnLFxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tVc2VEYXRhU291cmNlTGlzdC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBtb2NrRGF0YVNvdXJjZUxpc3QsXG4gICAgICAgIGlzU3VjY2VzczogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEoeyBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVwZW5kIGJhc2VQYXRoIHRvIGljb24gd2hlbiBpY29uIGRvZXMgbm90IGluY2x1ZGUgYmFzZVBhdGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRGF0YVNvdXJjZUxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhU291cmNlTGlzdEl0ZW0oe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgICAgaWRlbnRpdHk6IHtcbiAgICAgICAgICAgICAgaWNvbjogJy9pY29ucy90ZXN0LWljb24ucG5nJyxcbiAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnLFxuICAgICAgICAgICAgICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1VzZURhdGFTb3VyY2VMaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG1vY2tEYXRhU291cmNlTGlzdCxcbiAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIG1vY2tUcmFuc2Zvcm1EYXRhU291cmNlVG9Ub29sLm1vY2tJbXBsZW1lbnRhdGlvbihpdGVtID0+ICh7XG4gICAgICAgIHBsdWdpbl9pZDogaXRlbS5wbHVnaW5faWQsXG4gICAgICAgIGljb246IGl0ZW0uZGVjbGFyYXRpb24/LmlkZW50aXR5Py5pY29uLFxuICAgICAgfSkpXG4gICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEoeyBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEljb24gc2hvdWxkIGhhdmUgYmFzZVBhdGggcHJlcGVuZGVkXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoJy9tb2NrLWJhc2UtcGF0aC9pY29ucy90ZXN0LWljb24ucG5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcHJlcGVuZCBiYXNlUGF0aCB3aGVuIGljb24gYWxyZWFkeSBpbmNsdWRlcyBiYXNlUGF0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tEYXRhU291cmNlTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFTb3VyY2VMaXN0SXRlbSh7XG4gICAgICAgICAgcGx1Z2luX2lkOiAndGVzdC1wbHVnaW4taWQnLFxuICAgICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgICBpZGVudGl0eToge1xuICAgICAgICAgICAgICBpY29uOiAnL21vY2stYmFzZS1wYXRoL2ljb25zL3Rlc3QtaWNvbi5wbmcnLFxuICAgICAgICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnVGVzdCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBtb2NrVXNlRGF0YVNvdXJjZUxpc3QubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogbW9ja0RhdGFTb3VyY2VMaXN0LFxuICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICB9KVxuICAgICAgbW9ja1RyYW5zZm9ybURhdGFTb3VyY2VUb1Rvb2wubW9ja0ltcGxlbWVudGF0aW9uKGl0ZW0gPT4gKHtcbiAgICAgICAgcGx1Z2luX2lkOiBpdGVtLnBsdWdpbl9pZCxcbiAgICAgICAgaWNvbjogaXRlbS5kZWNsYXJhdGlvbj8uaWRlbnRpdHk/Lmljb24sXG4gICAgICB9KSlcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7IHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURhdGFzb3VyY2VJY29uKG5vZGVEYXRhKSwge1xuICAgICAgICB3cmFwcGVyOiBjcmVhdGVIb29rV3JhcHBlcigpLFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gSWNvbiBzaG91bGQgbm90IGJlIG1vZGlmaWVkXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoJy9tb2NrLWJhc2UtcGF0aC9pY29ucy90ZXN0LWljb24ucG5nJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRhdGFTb3VyY2VMaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZURhdGFTb3VyY2VMaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IFtdLFxuICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICB9KVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBkYXRhU291cmNlTGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VEYXRhU291cmNlTGlzdC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgICB9KVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaWNvbiBhcyBub24tc3RyaW5nIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRGF0YVNvdXJjZUxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhU291cmNlTGlzdEl0ZW0oe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgICAgaWRlbnRpdHk6IHtcbiAgICAgICAgICAgICAgaWNvbjogeyB1cmw6ICcvaWNvbnMvdGVzdC1pY29uLnBuZycgfSwgLy8gT2JqZWN0IGluc3RlYWQgb2Ygc3RyaW5nXG4gICAgICAgICAgICAgIG5hbWU6ICd0ZXN0JyxcbiAgICAgICAgICAgICAgbGFiZWw6IHsgZW5fVVM6ICdUZXN0JyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tVc2VEYXRhU291cmNlTGlzdC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBtb2NrRGF0YVNvdXJjZUxpc3QsXG4gICAgICAgIGlzU3VjY2VzczogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICBtb2NrVHJhbnNmb3JtRGF0YVNvdXJjZVRvVG9vbC5tb2NrSW1wbGVtZW50YXRpb24oaXRlbSA9PiAoe1xuICAgICAgICBwbHVnaW5faWQ6IGl0ZW0ucGx1Z2luX2lkLFxuICAgICAgICBpY29uOiBpdGVtLmRlY2xhcmF0aW9uPy5pZGVudGl0eT8uaWNvbixcbiAgICAgIH0pKVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKHsgcGx1Z2luX2lkOiAndGVzdC1wbHVnaW4taWQnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRGF0YXNvdXJjZUljb24obm9kZURhdGEpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZUhvb2tXcmFwcGVyKCksXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmV0dXJuIHRoZSBpY29uIG9iamVjdCBhcy1pcyBzaW5jZSBpdCdzIG5vdCBhIHN0cmluZ1xuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0VxdWFsKHsgdXJsOiAnL2ljb25zL3Rlc3QtaWNvbi5wbmcnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSByZXN1bHQgYmFzZWQgb24gcGx1Z2luX2lkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0RhdGFTb3VyY2VMaXN0ID0gW1xuICAgICAgICBjcmVhdGVNb2NrRGF0YVNvdXJjZUxpc3RJdGVtKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1VzZURhdGFTb3VyY2VMaXN0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG1vY2tEYXRhU291cmNlTGlzdCxcbiAgICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7IHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlSWNvbihub2RlRGF0YSksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlSG9va1dyYXBwZXIoKSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBmaXJzdFJlc3VsdCA9IHJlc3VsdC5jdXJyZW50XG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmV0dXJuIHRoZSBzYW1lIG1lbW9pemVkIHJlc3VsdFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlKGZpcnN0UmVzdWx0KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE9wdGlvbkNhcmQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ09wdGlvbkNhcmQnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBsYWJlbDogJ1Rlc3QgT3B0aW9uJyxcbiAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tEYXRhU291cmNlTm9kZURhdGEoKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIFNldHVwIGRlZmF1bHQgbW9jayBmb3IgdXNlRGF0YXNvdXJjZUljb25cbiAgICBtb2NrVXNlRGF0YVNvdXJjZUxpc3QubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGRhdGE6IFtdLFxuICAgICAgaXNTdWNjZXNzOiB0cnVlLFxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBPcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsYWJlbCB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBsYWJlbD1cIkN1c3RvbSBMYWJlbFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gTGFiZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBEYXRhc291cmNlSWNvbiBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRGF0YXNvdXJjZUljb24gY29udGFpbmVyIHNob3VsZCBleGlzdFxuICAgICAgY29uc3QgaWNvbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2l6ZS04JylcbiAgICAgIGV4cGVjdChpY29uQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHRpdGxlIGF0dHJpYnV0ZSBmb3IgbGFiZWwgdHJ1bmNhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdMYWJlbCA9ICdUaGlzIGlzIGEgdmVyeSBsb25nIGxhYmVsIHRoYXQgbWlnaHQgYmUgdHJ1bmNhdGVkJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gbGFiZWw9e2xvbmdMYWJlbH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWxFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dChsb25nTGFiZWwpXG4gICAgICBleHBlY3QobGFiZWxFbGVtZW50KS50b0hhdmVBdHRyaWJ1dGUoJ3RpdGxlJywgbG9uZ0xhYmVsKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgc2VsZWN0ZWQgc3R5bGVzIHdoZW4gc2VsZWN0ZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBzZWxlY3RlZD17dHJ1ZX0gLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2FyZCA9IGNvbnRhaW5lci5maXJzdENoaWxkXG4gICAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygnYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLXNlbGVjdGVkLWJvcmRlcicpXG4gICAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYmcnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSB1bnNlbGVjdGVkIHN0eWxlcyB3aGVuIHNlbGVjdGVkIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxPcHRpb25DYXJkIHsuLi5kZWZhdWx0UHJvcHN9IHNlbGVjdGVkPXtmYWxzZX0gLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2FyZCA9IGNvbnRhaW5lci5maXJzdENoaWxkXG4gICAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygnYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLWJvcmRlcicpXG4gICAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tYmcnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSB0ZXh0LXRleHQtcHJpbWFyeSB0byBsYWJlbCB3aGVuIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gc2VsZWN0ZWQ9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBsYWJlbCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgT3B0aW9uJylcbiAgICAgICAgZXhwZWN0KGxhYmVsKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXByaW1hcnknKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSB0ZXh0LXRleHQtc2Vjb25kYXJ5IHRvIGxhYmVsIHdoZW4gbm90IHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gc2VsZWN0ZWQ9e2ZhbHNlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgbGFiZWwgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IE9wdGlvbicpXG4gICAgICAgIGV4cGVjdChsYWJlbCkudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1zZWNvbmRhcnknKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ29uQ2xpY2snLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGljayB3aGVuIGNhcmQgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBvbkNsaWNrPXttb2NrT25DbGlja30gLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBY3QgLSBDbGljayBvbiB0aGUgbGFiZWwgdGV4dCdzIHBhcmVudCBjYXJkXG4gICAgICAgIGNvbnN0IGxhYmVsRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgT3B0aW9uJylcbiAgICAgICAgY29uc3QgY2FyZCA9IGxhYmVsRWxlbWVudC5jbG9zZXN0KCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgICBleHBlY3QoY2FyZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2FyZCEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCB3aGVuIG9uQ2xpY2sgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gb25DbGljaz17dW5kZWZpbmVkfSAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIG9uIHRoZSBsYWJlbCB0ZXh0J3MgcGFyZW50IGNhcmQgc2hvdWxkIG5vdCB0aHJvd1xuICAgICAgICBjb25zdCBsYWJlbEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IE9wdGlvbicpXG4gICAgICAgIGNvbnN0IGNhcmQgPSBsYWJlbEVsZW1lbnQuY2xvc2VzdCgnW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgICAgZXhwZWN0KGNhcmQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhcmQhKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgc3RpbGwgYmUgcmVuZGVyZWRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgT3B0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdub2RlRGF0YScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBub2RlRGF0YSB0byB1c2VEYXRhc291cmNlSWNvbiBob29rJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGN1c3RvbU5vZGVEYXRhID0gY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7IHBsdWdpbl9pZDogJ2N1c3RvbS1wbHVnaW4nIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gbm9kZURhdGE9e2N1c3RvbU5vZGVEYXRhfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBIb29rIHNob3VsZCBiZSBjYWxsZWQgKHZpYSB1c2VEYXRhU291cmNlTGlzdCBtb2NrKVxuICAgICAgICBleHBlY3QobW9ja1VzZURhdGFTb3VyY2VMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY3Vyc29yLXBvaW50ZXIgY2xhc3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBmbGV4IGxheW91dCBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPE9wdGlvbkNhcmQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdpdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnZ2FwLTInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcm91bmRlZC14bCBib3JkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLXhsJylcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2JvcmRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwYWRkaW5nIHAtMycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxPcHRpb25DYXJkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ3AtMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBsaW5lLWNsYW1wLTIgZm9yIGxhYmVsIHRydW5jYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxPcHRpb25DYXJkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBPcHRpb24nKVxuICAgICAgZXhwZWN0KGxhYmVsKS50b0hhdmVDbGFzcygnbGluZS1jbGFtcC0yJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0IC0gT3B0aW9uQ2FyZCBzaG91bGQgYmUgYSBtZW1vaXplZCBjb21wb25lbnRcbiAgICAgIGV4cGVjdChPcHRpb25DYXJkKS50b0JlRGVmaW5lZCgpXG4gICAgICAvLyBSZWFjdC5tZW1vIHdyYXBzIHRoZSBjb21wb25lbnQsIHNvIHdlIGNoZWNrIGl0IHJlbmRlcnMgY29ycmVjdGx5XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8T3B0aW9uQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERhdGFTb3VyY2VPcHRpb25zIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdEYXRhU291cmNlT3B0aW9ucycsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdE5vZGVzID0gY3JlYXRlTW9ja1BpcGVsaW5lTm9kZXMoMylcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0Tm9kZXMubWFwKGNyZWF0ZU1vY2tEYXRhc291cmNlT3B0aW9uKVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBwaXBlbGluZU5vZGVzOiBkZWZhdWx0Tm9kZXMsXG4gICAgZGF0YXNvdXJjZU5vZGVJZDogJycsXG4gICAgb25TZWxlY3Q6IHZpLmZuKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKGRlZmF1bHRPcHRpb25zKVxuICAgIG1vY2tVc2VEYXRhU291cmNlTGlzdC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogW10sXG4gICAgICBpc1N1Y2Nlc3M6IHRydWUsXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxEYXRhU291cmNlT3B0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3QgbnVtYmVyIG9mIG9wdGlvbiBjYXJkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPERhdGFTb3VyY2VPcHRpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBncmlkIGxheW91dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxEYXRhU291cmNlT3B0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBncmlkQ29udGFpbmVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGRcbiAgICAgIGV4cGVjdChncmlkQ29udGFpbmVyKS50b0hhdmVDbGFzcygnZ3JpZCcpXG4gICAgICBleHBlY3QoZ3JpZENvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ3ctZnVsbCcpXG4gICAgICBleHBlY3QoZ3JpZENvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ2dyaWQtY29scy00JylcbiAgICAgIGV4cGVjdChncmlkQ29udGFpbmVyKS50b0hhdmVDbGFzcygnZ2FwLTEnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBubyBvcHRpb24gY2FyZHMgd2hlbiBvcHRpb25zIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZURhdGFzb3VyY2VPcHRpb25zLm1vY2tSZXR1cm5WYWx1ZShbXSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8RGF0YVNvdXJjZU9wdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnRGF0YSBTb3VyY2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIEdyaWQgY29udGFpbmVyIHNob3VsZCBzdGlsbCBleGlzdFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnZ3JpZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNpbmdsZSBvcHRpb24gY2FyZCB3aGVuIG9ubHkgb25lIG9wdGlvbiBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzaW5nbGVPcHRpb24gPSBbY3JlYXRlTW9ja0RhdGFzb3VyY2VPcHRpb24oZGVmYXVsdE5vZGVzWzBdKV1cbiAgICAgIG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucy5tb2NrUmV0dXJuVmFsdWUoc2luZ2xlT3B0aW9uKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPERhdGFTb3VyY2VPcHRpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0RhdGEgU291cmNlIDInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdwaXBlbGluZU5vZGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHBpcGVsaW5lTm9kZXMgdG8gdXNlRGF0YXNvdXJjZU9wdGlvbnMgaG9vaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBjdXN0b21Ob2RlcyA9IGNyZWF0ZU1vY2tQaXBlbGluZU5vZGVzKDIpXG4gICAgICAgIG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucy5tb2NrUmV0dXJuVmFsdWUoY3VzdG9tTm9kZXMubWFwKGNyZWF0ZU1vY2tEYXRhc291cmNlT3B0aW9uKSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gcGlwZWxpbmVOb2Rlcz17Y3VzdG9tTm9kZXN9IC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGN1c3RvbU5vZGVzKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcGlwZWxpbmVOb2RlcyBhcnJheScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9ucyB7Li4uZGVmYXVsdFByb3BzfSBwaXBlbGluZU5vZGVzPXtbXX0gLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGF0YXNvdXJjZU5vZGVJZCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbWFyayBjb3JyZXNwb25kaW5nIG9wdGlvbiBhcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0yXCJcbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBzZWxlY3RlZCBzdHlsaW5nIG9uIHNlY29uZCBjYXJkXG4gICAgICAgIGNvbnN0IGNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yb3VuZGVkLXhsLmJvcmRlcicpXG4gICAgICAgIGV4cGVjdChjYXJkc1sxXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci1jb21wb25lbnRzLW9wdGlvbi1jYXJkLW9wdGlvbi1zZWxlY3RlZC1ib3JkZXInKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IG5vIHNlbGVjdGlvbiB3aGVuIGRhdGFzb3VyY2VOb2RlSWQgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIlwiXG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBObyBjYXJkIHNob3VsZCBoYXZlIHNlbGVjdGVkIHN0eWxpbmdcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRDYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLXNlbGVjdGVkLWJvcmRlcicpXG4gICAgICAgIGV4cGVjdChzZWxlY3RlZENhcmRzKS50b0hhdmVMZW5ndGgoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBubyBzZWxlY3Rpb24gd2hlbiBkYXRhc291cmNlTm9kZUlkIGRvZXMgbm90IG1hdGNoIGFueSBvcHRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vbi1leGlzdGVudC1ub2RlXCJcbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBzZWxlY3RlZENhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdGVkQ2FyZHMpLnRvSGF2ZUxlbmd0aCgwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgc2VsZWN0aW9uIHdoZW4gZGF0YXNvdXJjZU5vZGVJZCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyLCByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCBpbml0aWFsIHNlbGVjdGlvblxuICAgICAgICBsZXQgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJvdW5kZWQteGwuYm9yZGVyJylcbiAgICAgICAgZXhwZWN0KGNhcmRzWzBdKS50b0hhdmVDbGFzcygnYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLXNlbGVjdGVkLWJvcmRlcicpXG5cbiAgICAgICAgLy8gQWN0IC0gQ2hhbmdlIHNlbGVjdGlvblxuICAgICAgICByZXJlbmRlcihcbiAgICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e2NyZWF0ZVF1ZXJ5Q2xpZW50KCl9PlxuICAgICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9XCJub2RlLTJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IG5ldyBzZWxlY3Rpb25cbiAgICAgICAgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnJvdW5kZWQteGwuYm9yZGVyJylcbiAgICAgICAgZXhwZWN0KGNhcmRzWzBdKS5ub3QudG9IYXZlQ2xhc3MoJ2JvcmRlci1jb21wb25lbnRzLW9wdGlvbi1jYXJkLW9wdGlvbi1zZWxlY3RlZC1ib3JkZXInKVxuICAgICAgICBleHBlY3QoY2FyZHNbMV0pLnRvSGF2ZUNsYXNzKCdib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvblNlbGVjdCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVjZWl2ZSBvblNlbGVjdCBjYWxsYmFjaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCByZW5kZXJzIHdpdGhvdXQgZXJyb3JcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3VzZUVmZmVjdCAtIEF1dG8tc2VsZWN0IGZpcnN0IG9wdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXV0by1zZWxlY3QgZmlyc3Qgb3B0aW9uIHdoZW4gb3B0aW9ucyBleGlzdCBhbmQgbm8gZGF0YXNvdXJjZU5vZGVJZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIlwiXG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGF1dG8tc2VsZWN0IGZpcnN0IG9wdGlvbiBvbiBtb3VudFxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIG5vZGVJZDogJ25vZGUtMScsXG4gICAgICAgICAgbm9kZURhdGE6IGRlZmF1bHRPcHRpb25zWzBdLmRhdGEsXG4gICAgICAgIH0gc2F0aXNmaWVzIERhdGFzb3VyY2UpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIE5PVCBhdXRvLXNlbGVjdCB3aGVuIGRhdGFzb3VyY2VOb2RlSWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9XCJub2RlLTJcIlxuICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgYXV0by1zZWxlY3QgYmVjYXVzZSBkYXRhc291cmNlTm9kZUlkIGlzIHByb3ZpZGVkXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgTk9UIGF1dG8tc2VsZWN0IHdoZW4gb3B0aW9ucyBhcnJheSBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgcGlwZWxpbmVOb2Rlcz17W119XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwiXCJcbiAgICAgICAgICAgIG9uU2VsZWN0PXttb2NrT25TZWxlY3R9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBvbmx5IHJ1biB1c2VFZmZlY3Qgb25jZSBvbiBpbml0aWFsIG1vdW50JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwiXCJcbiAgICAgICAgICAgIG9uU2VsZWN0PXttb2NrT25TZWxlY3R9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBDYWxsZWQgb25jZSBvbiBtb3VudFxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgICAgcmVyZW5kZXIoXG4gICAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtjcmVhdGVRdWVyeUNsaWVudCgpfT5cbiAgICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwiXCJcbiAgICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFN0aWxsIGNhbGxlZCBvbmx5IG9uY2UgKHVzZUVmZmVjdCBoYXMgZW1wdHkgZGVwZW5kZW5jeSBhcnJheSlcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gY2FsbGJhY2sgcmVmZXJlbmNlIHN0YWJpbGl0eSBhY3Jvc3MgcmVuZGVycyB3aXRoIHNhbWUgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEdldCBpbml0aWFsIGNsaWNrIGhhbmRsZXJzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFRyaWdnZXIgY2xpY2tzIHRvIHRlc3QgaGFuZGxlcnMgd29ya1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDEnKSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKSAvLyAxIGF1dG8tc2VsZWN0ICsgMSBjbGlja1xuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIHNhbWUgb25TZWxlY3QgcmVmZXJlbmNlXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtjcmVhdGVRdWVyeUNsaWVudCgpfT5cbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzdGlsbCB3b3JrcyBhZnRlciByZXJlbmRlclxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDInKSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjYWxsYmFjayB3aGVuIG9uU2VsZWN0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QxID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0MiA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIHdpdGggZmlyc3QgY2FsbGJhY2tcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAyJykpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0MSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBjYWxsYmFja1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y3JlYXRlUXVlcnlDbGllbnQoKX0+XG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0Mn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3QgLSBDbGljayB3aXRoIG5ldyBjYWxsYmFja1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDMnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTmV3IGNhbGxiYWNrIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIG5vZGVJZDogJ25vZGUtMycsXG4gICAgICAgIG5vZGVEYXRhOiBkZWZhdWx0T3B0aW9uc1syXS5kYXRhLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgY2FsbGJhY2sgd2hlbiBvcHRpb25zIGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgZmlyc3Qgb3B0aW9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKVxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBub2RlSWQ6ICdub2RlLTEnLFxuICAgICAgICBub2RlRGF0YTogZGVmYXVsdE9wdGlvbnNbMF0uZGF0YSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBvcHRpb25zXG4gICAgICBjb25zdCBuZXdOb2RlcyA9IGNyZWF0ZU1vY2tQaXBlbGluZU5vZGVzKDIpXG4gICAgICBjb25zdCBuZXdPcHRpb25zID0gbmV3Tm9kZXMubWFwKG5vZGUgPT4gY3JlYXRlTW9ja0RhdGFzb3VyY2VPcHRpb24obm9kZSkpXG4gICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKG5ld09wdGlvbnMpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e2NyZWF0ZVF1ZXJ5Q2xpZW50KCl9PlxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgcGlwZWxpbmVOb2Rlcz17bmV3Tm9kZXN9XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICAgIG9uU2VsZWN0PXttb2NrT25TZWxlY3R9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgdXBkYXRlZCBmaXJzdCBvcHRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIENhbGxiYWNrIHJlY2VpdmVzIG5ldyBvcHRpb24gZGF0YVxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKHtcbiAgICAgICAgbm9kZUlkOiBuZXdPcHRpb25zWzBdLnZhbHVlLFxuICAgICAgICBub2RlRGF0YTogbmV3T3B0aW9uc1swXS5kYXRhLFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ09wdGlvbiBTZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2l0aCBjb3JyZWN0IGRhdGFzb3VyY2Ugd2hlbiBjbGlja2luZyBhbiBvcHRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIHNlY29uZCBvcHRpb25cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDInKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBub2RlSWQ6ICdub2RlLTInLFxuICAgICAgICAgIG5vZGVEYXRhOiBkZWZhdWx0T3B0aW9uc1sxXS5kYXRhLFxuICAgICAgICB9IHNhdGlzZmllcyBEYXRhc291cmNlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhbGxvdyBzZWxlY3RpbmcgYWxyZWFkeSBzZWxlY3RlZCBvcHRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIGFscmVhZHkgc2VsZWN0ZWQgb3B0aW9uXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgbm9kZUlkOiAnbm9kZS0xJyxcbiAgICAgICAgICBub2RlRGF0YTogZGVmYXVsdE9wdGlvbnNbMF0uZGF0YSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYWxsb3cgbXVsdGlwbGUgc2VxdWVudGlhbCBzZWxlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICAgIG9uU2VsZWN0PXttb2NrT25TZWxlY3R9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBY3QgLSBDbGljayBvcHRpb25zIHNlcXVlbnRpYWxseVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMicpKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMycpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMSwge1xuICAgICAgICAgIG5vZGVJZDogJ25vZGUtMScsXG4gICAgICAgICAgbm9kZURhdGE6IGRlZmF1bHRPcHRpb25zWzBdLmRhdGEsXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5OdGhDYWxsZWRXaXRoKDIsIHtcbiAgICAgICAgICBub2RlSWQ6ICdub2RlLTInLFxuICAgICAgICAgIG5vZGVEYXRhOiBkZWZhdWx0T3B0aW9uc1sxXS5kYXRhLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgzLCB7XG4gICAgICAgICAgbm9kZUlkOiAnbm9kZS0zJyxcbiAgICAgICAgICBub2RlRGF0YTogZGVmYXVsdE9wdGlvbnNbMl0uZGF0YSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoYW5kZWxTZWxlY3QgSW50ZXJuYWwgTG9naWMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzdWNjZXNzaXZlIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQWN0IC0gUmFwaWQgY2xpY2tzXG4gICAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDEnKSlcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMicpKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAzJykpXG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDEnKSlcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMicpKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEFsbCBjbGlja3Mgc2hvdWxkIGJlIHJlZ2lzdGVyZWRcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0VtcHR5IFN0YXRlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG9wdGlvbnMgYXJyYXkgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBwaXBlbGluZU5vZGVzPXtbXX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGNyYXNoIHdoZW4gZGF0YXNvdXJjZU5vZGVJZCBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHBpcGVsaW5lTm9kZXM9e2RlZmF1bHROb2Rlc31cbiAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9e3VuZGVmaW5lZCBhcyB1bmtub3duIGFzIHN0cmluZ31cbiAgICAgICAgICAgIG9uU2VsZWN0PXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdOdWxsL1VuZGVmaW5lZCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBvcHRpb24gd2l0aCBtaXNzaW5nIGRhdGEgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvcHRpb25XaXRoTWluaW1hbERhdGEgPSBbe1xuICAgICAgICAgIGxhYmVsOiAnTWluaW1hbCBPcHRpb24nLFxuICAgICAgICAgIHZhbHVlOiAnbWluaW1hbC0xJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aXRsZTogJ01pbmltYWwnLFxuICAgICAgICAgICAgZGVzYzogJycsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja0VudW0uRGF0YVNvdXJjZSxcbiAgICAgICAgICAgIHBsdWdpbl9pZDogJycsXG4gICAgICAgICAgICBwcm92aWRlcl90eXBlOiAnJyxcbiAgICAgICAgICAgIHByb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgICAgICAgZGF0YXNvdXJjZV9uYW1lOiAnJyxcbiAgICAgICAgICAgIGRhdGFzb3VyY2VfbGFiZWw6ICcnLFxuICAgICAgICAgICAgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICAgIGRhdGFzb3VyY2VfY29uZmlndXJhdGlvbnM6IHt9LFxuICAgICAgICAgIH0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlLFxuICAgICAgICB9XVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKG9wdGlvbldpdGhNaW5pbWFsRGF0YSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8RGF0YVNvdXJjZU9wdGlvbnMgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNaW5pbWFsIE9wdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnTGFyZ2UgRGF0YSBTZXRzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVyIG9mIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbWFueU5vZGVzID0gY3JlYXRlTW9ja1BpcGVsaW5lTm9kZXMoNTApXG4gICAgICAgIGNvbnN0IG1hbnlPcHRpb25zID0gbWFueU5vZGVzLm1hcChjcmVhdGVNb2NrRGF0YXNvdXJjZU9wdGlvbilcbiAgICAgICAgbW9ja1VzZURhdGFzb3VyY2VPcHRpb25zLm1vY2tSZXR1cm5WYWx1ZShtYW55T3B0aW9ucylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBwaXBlbGluZU5vZGVzPXttYW55Tm9kZXN9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgNTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1NwZWNpYWwgQ2hhcmFjdGVycyBpbiBEYXRhJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG9wdGlvbiBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc3BlY2lhbE5vZGUgPSBjcmVhdGVNb2NrUGlwZWxpbmVOb2RlKHtcbiAgICAgICAgICBpZDogJ3NwZWNpYWwtbm9kZScsXG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7XG4gICAgICAgICAgICB0aXRsZTogJ0RhdGEgU291cmNlIDxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBzcGVjaWFsT3B0aW9ucyA9IFtjcmVhdGVNb2NrRGF0YXNvdXJjZU9wdGlvbihzcGVjaWFsTm9kZSldXG4gICAgICAgIG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucy5tb2NrUmV0dXJuVmFsdWUoc3BlY2lhbE9wdGlvbnMpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgcGlwZWxpbmVOb2Rlcz17W3NwZWNpYWxOb2RlXX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNwZWNpYWwgY2hhcmFjdGVycyBzaG91bGQgYmUgZXNjYXBlZC9yZW5kZXJlZCBzYWZlbHlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlIDxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIG9wdGlvbiBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdW5pY29kZU5vZGUgPSBjcmVhdGVNb2NrUGlwZWxpbmVOb2RlKHtcbiAgICAgICAgICBpZDogJ3VuaWNvZGUtbm9kZScsXG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7XG4gICAgICAgICAgICB0aXRsZTogJ+aVsOaNrua6kCDwn5OBIFNvdXJjZSDDqW1vamknLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCB1bmljb2RlT3B0aW9ucyA9IFtjcmVhdGVNb2NrRGF0YXNvdXJjZU9wdGlvbih1bmljb2RlTm9kZSldXG4gICAgICAgIG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucy5tb2NrUmV0dXJuVmFsdWUodW5pY29kZU9wdGlvbnMpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgcGlwZWxpbmVOb2Rlcz17W3VuaWNvZGVOb2RlXX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn5pWw5o2u5rqQIPCfk4EgU291cmNlIMOpbW9qaScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgYXMgb3B0aW9uIHZhbHVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGVtcHR5VmFsdWVPcHRpb24gPSBbe1xuICAgICAgICAgIGxhYmVsOiAnRW1wdHkgVmFsdWUgT3B0aW9uJyxcbiAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSgpLFxuICAgICAgICB9XVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKGVtcHR5VmFsdWVPcHRpb24pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPERhdGFTb3VyY2VPcHRpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRW1wdHkgVmFsdWUgT3B0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdCb3VuZGFyeSBDb25kaXRpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIG9wdGlvbiBzZWxlY3Rpb24gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHNpbmdsZU9wdGlvbiA9IFtjcmVhdGVNb2NrRGF0YXNvdXJjZU9wdGlvbihkZWZhdWx0Tm9kZXNbMF0pXVxuICAgICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKHNpbmdsZU9wdGlvbilcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgICAgb25TZWxlY3Q9e21vY2tPblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENsaWNrIHNob3VsZCBzdGlsbCB3b3JrXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgb3B0aW9ucyB3aXRoIHNhbWUgbGFiZWxzIGJ1dCBkaWZmZXJlbnQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZUxhYmVsT3B0aW9ucyA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0R1cGxpY2F0ZSBMYWJlbCcsXG4gICAgICAgICAgICB2YWx1ZTogJ25vZGUtYScsXG4gICAgICAgICAgICBkYXRhOiBjcmVhdGVNb2NrRGF0YVNvdXJjZU5vZGVEYXRhKHsgcGx1Z2luX2lkOiAncGx1Z2luLWEnIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEdXBsaWNhdGUgTGFiZWwnLFxuICAgICAgICAgICAgdmFsdWU6ICdub2RlLWInLFxuICAgICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0RhdGFTb3VyY2VOb2RlRGF0YSh7IHBsdWdpbl9pZDogJ3BsdWdpbi1iJyB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICAgIG1vY2tVc2VEYXRhc291cmNlT3B0aW9ucy5tb2NrUmV0dXJuVmFsdWUoZHVwbGljYXRlTGFiZWxPcHRpb25zKVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vZGUtYVwiXG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQm90aCBzaG91bGQgcmVuZGVyXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ0R1cGxpY2F0ZSBMYWJlbCcpXG4gICAgICAgIGV4cGVjdChsYWJlbHMpLnRvSGF2ZUxlbmd0aCgyKVxuXG4gICAgICAgIC8vIENsaWNrIHNlY29uZCBvbmVcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGxhYmVsc1sxXSlcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIG5vZGVJZDogJ25vZGUtYicsXG4gICAgICAgICAgbm9kZURhdGE6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgcGx1Z2luX2lkOiAncGx1Z2luLWInIH0pLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBVbm1vdW50aW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5tb3VudGluZyB3aXRob3V0IGVycm9ycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHVubW91bnQoKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE5vIGVycm9ycyB0aHJvd24sIGNvbXBvbmVudCBjbGVhbmx5IHVubW91bnRlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bm1vdW50aW5nIGR1cmluZyByYXBpZCBpbnRlcmFjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgICBvblNlbGVjdD17bW9ja09uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQWN0IC0gU3RhcnQgaW50ZXJhY3Rpb25zIHRoZW4gdW5tb3VudFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKVxuXG4gICAgICAgIC8vIFVubW91bnQgZHVyaW5nL2FmdGVyIGludGVyYWN0aW9uXG4gICAgICAgIHVubW91bnQoKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgdGhyb3dcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIE9wdGlvbkNhcmQgd2l0aCBjb3JyZWN0IHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPERhdGFTb3VyY2VPcHRpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBWZXJpZnkgcmVhbCBPcHRpb25DYXJkIGNvbXBvbmVudHMgYXJlIHJlbmRlcmVkXG4gICAgICBjb25zdCBjYXJkcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucm91bmRlZC14bC5ib3JkZXInKVxuICAgICAgZXhwZWN0KGNhcmRzKS50b0hhdmVMZW5ndGgoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgcGFzcyBzZWxlY3RlZCBzdGF0ZSB0byBPcHRpb25DYXJkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlT3B0aW9uc1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIm5vZGUtMlwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yb3VuZGVkLXhsLmJvcmRlcicpXG4gICAgICBleHBlY3QoY2FyZHNbMF0pLm5vdC50b0hhdmVDbGFzcygnYm9yZGVyLWNvbXBvbmVudHMtb3B0aW9uLWNhcmQtb3B0aW9uLXNlbGVjdGVkLWJvcmRlcicpXG4gICAgICBleHBlY3QoY2FyZHNbMV0pLnRvSGF2ZUNsYXNzKCdib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICAgIGV4cGVjdChjYXJkc1syXSkubm90LnRvSGF2ZUNsYXNzKCdib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugb3B0aW9uLnZhbHVlIGFzIGtleSBmb3IgUmVhY3QgcmVuZGVyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gVGhpcyB0ZXN0IHZlcmlmaWVzIHRoYXQgUmVhY3QgZG9lc24ndCB0aHJvdyBkdXBsaWNhdGUga2V5IHdhcm5pbmdzXG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZU9wdGlvbnMgPSBjcmVhdGVNb2NrUGlwZWxpbmVOb2Rlcyg1KS5tYXAoY3JlYXRlTW9ja0RhdGFzb3VyY2VPcHRpb24pXG4gICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKHVuaXF1ZVZhbHVlT3B0aW9ucylcblxuICAgICAgLy8gQWN0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNvbnNvbGUgd2FybmluZ3MgYWJvdXQgZHVwbGljYXRlIGtleXNcbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnZXJyb3InKS5tb2NrSW1wbGVtZW50YXRpb24odmkuZm4oKSlcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPERhdGFTb3VyY2VPcHRpb25zIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb25zb2xlU3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCdrZXknKSxcbiAgICAgIClcbiAgICAgIGNvbnNvbGVTcHkubW9ja1Jlc3RvcmUoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBbGwgUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBkYXRhc291cmNlTm9kZUlkOiAnJywgZGVzY3JpcHRpb246ICdlbXB0eSBzdHJpbmcnIH0sXG4gICAgICB7IGRhdGFzb3VyY2VOb2RlSWQ6ICdub2RlLTEnLCBkZXNjcmlwdGlvbjogJ2ZpcnN0IG5vZGUnIH0sXG4gICAgICB7IGRhdGFzb3VyY2VOb2RlSWQ6ICdub2RlLTInLCBkZXNjcmlwdGlvbjogJ21pZGRsZSBub2RlJyB9LFxuICAgICAgeyBkYXRhc291cmNlTm9kZUlkOiAnbm9kZS0zJywgZGVzY3JpcHRpb246ICdsYXN0IG5vZGUnIH0sXG4gICAgICB7IGRhdGFzb3VyY2VOb2RlSWQ6ICdub24tZXhpc3RlbnQnLCBkZXNjcmlwdGlvbjogJ25vbi1leGlzdGVudCBub2RlJyB9LFxuICAgIF0pKCdzaG91bGQgaGFuZGxlIGRhdGFzb3VyY2VOb2RlSWQgYXMgJGRlc2NyaXB0aW9uJywgKHsgZGF0YXNvdXJjZU5vZGVJZCB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGRhdGFzb3VyY2VOb2RlSWQ9e2RhdGFzb3VyY2VOb2RlSWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICB7IGNvdW50OiAwLCBkZXNjcmlwdGlvbjogJ3plcm8gb3B0aW9ucycgfSxcbiAgICAgIHsgY291bnQ6IDEsIGRlc2NyaXB0aW9uOiAnc2luZ2xlIG9wdGlvbicgfSxcbiAgICAgIHsgY291bnQ6IDMsIGRlc2NyaXB0aW9uOiAnZmV3IG9wdGlvbnMnIH0sXG4gICAgICB7IGNvdW50OiAxMCwgZGVzY3JpcHRpb246ICdtYW55IG9wdGlvbnMnIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggJGRlc2NyaXB0aW9uJywgKHsgY291bnQgfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZXMgPSBjcmVhdGVNb2NrUGlwZWxpbmVOb2Rlcyhjb3VudClcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBub2Rlcy5tYXAoY3JlYXRlTW9ja0RhdGFzb3VyY2VPcHRpb24pXG4gICAgICBtb2NrVXNlRGF0YXNvdXJjZU9wdGlvbnMubW9ja1JldHVyblZhbHVlKG9wdGlvbnMpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPERhdGFTb3VyY2VPcHRpb25zXG4gICAgICAgICAgcGlwZWxpbmVOb2Rlcz17bm9kZXN9XG4gICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD1cIlwiXG4gICAgICAgICAgb25TZWxlY3Q9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGlmIChjb3VudCA+IDApXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhIFNvdXJjZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGVsc2VcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnRGF0YSBTb3VyY2UgMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19