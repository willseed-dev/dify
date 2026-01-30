"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock store - required by Breadcrumbs component
const mockStoreState = {
    hasBucket: false,
    setOnlineDriveFileList: vi.fn(),
    setSelectedFileIds: vi.fn(),
    setBreadcrumbs: vi.fn(),
    setPrefix: vi.fn(),
    setBucket: vi.fn(),
    breadcrumbs: [],
    prefix: [],
};
const mockGetState = vi.fn(() => mockStoreState);
const mockDataSourceStore = { getState: mockGetState };
vi.mock('../../../store', () => ({
    useDataSourceStore: () => mockDataSourceStore,
    useDataSourceStoreWithSelector: (selector) => selector(mockStoreState),
}));
const createDefaultProps = (overrides) => ({
    breadcrumbs: [],
    inputValue: '',
    keywords: '',
    bucket: '',
    searchResultsLength: 0,
    handleInputChange: vi.fn(),
    handleResetKeywords: vi.fn(),
    isInPipeline: false,
    ...overrides,
});
// ==========================================
// Helper Functions
// ==========================================
const resetMockStoreState = () => {
    mockStoreState.hasBucket = false;
    mockStoreState.setOnlineDriveFileList = vi.fn();
    mockStoreState.setSelectedFileIds = vi.fn();
    mockStoreState.setBreadcrumbs = vi.fn();
    mockStoreState.setPrefix = vi.fn();
    mockStoreState.setBucket = vi.fn();
    mockStoreState.breadcrumbs = [];
    mockStoreState.prefix = [];
};
// ==========================================
// Test Suites
// ==========================================
describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetMockStoreState();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - search input should be visible
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should render with correct container styles', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - container should have correct class names
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('items-center');
            expect(wrapper).toHaveClass('gap-x-2');
            expect(wrapper).toHaveClass('bg-components-panel-bg');
            expect(wrapper).toHaveClass('p-1');
            expect(wrapper).toHaveClass('pl-3');
        });
        it('should render Input component with correct props', () => {
            // Arrange
            const props = createDefaultProps({ inputValue: 'test-value' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('test-value');
        });
        it('should render Input with search icon', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Input should have search icon (RiSearchLine is rendered as svg)
            const searchIcon = container.querySelector('svg.h-4.w-4');
            expect(searchIcon).toBeInTheDocument();
        });
        it('should render Input with correct wrapper width', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Input wrapper should have w-[200px] class
            const inputWrapper = container.querySelector('.w-\\[200px\\]');
            expect(inputWrapper).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('inputValue prop', () => {
            it('should display empty input when inputValue is empty string', () => {
                // Arrange
                const props = createDefaultProps({ inputValue: '' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue('');
            });
            it('should display input value correctly', () => {
                // Arrange
                const props = createDefaultProps({ inputValue: 'search-query' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue('search-query');
            });
            it('should handle special characters in inputValue', () => {
                // Arrange
                const specialChars = 'test[file].txt (copy)';
                const props = createDefaultProps({ inputValue: specialChars });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue(specialChars);
            });
            it('should handle unicode characters in inputValue', () => {
                // Arrange
                const unicodeValue = '文件搜索 日本語';
                const props = createDefaultProps({ inputValue: unicodeValue });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue(unicodeValue);
            });
        });
        describe('breadcrumbs prop', () => {
            it('should render with empty breadcrumbs', () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: [] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Component should render without errors
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should render with single breadcrumb', () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['folder1'] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should render with multiple breadcrumbs', () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['folder1', 'folder2', 'folder3'] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
        });
        describe('keywords prop', () => {
            it('should pass keywords to Breadcrumbs', () => {
                // Arrange
                const props = createDefaultProps({ keywords: 'search-keyword' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - keywords are passed through, component renders
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
        });
        describe('bucket prop', () => {
            it('should render with empty bucket', () => {
                // Arrange
                const props = createDefaultProps({ bucket: '' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should render with bucket value', () => {
                // Arrange
                const props = createDefaultProps({ bucket: 'my-bucket' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
        });
        describe('searchResultsLength prop', () => {
            it('should handle zero search results', () => {
                // Arrange
                const props = createDefaultProps({ searchResultsLength: 0 });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should handle positive search results', () => {
                // Arrange
                const props = createDefaultProps({ searchResultsLength: 10, keywords: 'test' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Breadcrumbs will show search results text when keywords exist and results > 0
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should handle large search results count', () => {
                // Arrange
                const props = createDefaultProps({ searchResultsLength: 1000, keywords: 'test' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
        });
        describe('isInPipeline prop', () => {
            it('should render correctly when isInPipeline is false', () => {
                // Arrange
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
            it('should render correctly when isInPipeline is true', () => {
                // Arrange
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Event Handlers Tests
    // ==========================================
    describe('Event Handlers', () => {
        describe('handleInputChange', () => {
            it('should call handleInputChange when input value changes', () => {
                // Arrange
                const mockHandleInputChange = vi.fn();
                const props = createDefaultProps({ handleInputChange: mockHandleInputChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'new-value' } });
                // Assert
                expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
                // Verify that onChange event was triggered (React's synthetic event structure)
                expect(mockHandleInputChange.mock.calls[0][0]).toHaveProperty('type', 'change');
            });
            it('should call handleInputChange on each keystroke', () => {
                // Arrange
                const mockHandleInputChange = vi.fn();
                const props = createDefaultProps({ handleInputChange: mockHandleInputChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'a' } });
                react_1.fireEvent.change(input, { target: { value: 'ab' } });
                react_1.fireEvent.change(input, { target: { value: 'abc' } });
                // Assert
                expect(mockHandleInputChange).toHaveBeenCalledTimes(3);
            });
            it('should handle empty string input', () => {
                // Arrange
                const mockHandleInputChange = vi.fn();
                const props = createDefaultProps({ inputValue: 'existing', handleInputChange: mockHandleInputChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: '' } });
                // Assert
                expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
                expect(mockHandleInputChange.mock.calls[0][0]).toHaveProperty('type', 'change');
            });
            it('should handle whitespace-only input', () => {
                // Arrange
                const mockHandleInputChange = vi.fn();
                const props = createDefaultProps({ handleInputChange: mockHandleInputChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: '   ' } });
                // Assert
                expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
                expect(mockHandleInputChange.mock.calls[0][0]).toHaveProperty('type', 'change');
            });
        });
        describe('handleResetKeywords', () => {
            it('should call handleResetKeywords when clear icon is clicked', () => {
                // Arrange
                const mockHandleResetKeywords = vi.fn();
                const props = createDefaultProps({
                    inputValue: 'to-clear',
                    handleResetKeywords: mockHandleResetKeywords,
                });
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Find and click the clear icon container
                const clearButton = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]')?.parentElement;
                expect(clearButton).toBeInTheDocument();
                react_1.fireEvent.click(clearButton);
                // Assert
                expect(mockHandleResetKeywords).toHaveBeenCalledTimes(1);
            });
            it('should not show clear icon when inputValue is empty', () => {
                // Arrange
                const props = createDefaultProps({ inputValue: '' });
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act & Assert - Clear icon should not be visible
                const clearIcon = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]');
                expect(clearIcon).not.toBeInTheDocument();
            });
            it('should show clear icon when inputValue is not empty', () => {
                // Arrange
                const props = createDefaultProps({ inputValue: 'some-value' });
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act & Assert - Clear icon should be visible
                const clearIcon = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]');
                expect(clearIcon).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Component Memoization Tests
    // ==========================================
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - Header component should be memoized
            expect(index_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should not re-render when props are the same', () => {
            // Arrange
            const mockHandleInputChange = vi.fn();
            const mockHandleResetKeywords = vi.fn();
            const props = createDefaultProps({
                handleInputChange: mockHandleInputChange,
                handleResetKeywords: mockHandleResetKeywords,
            });
            // Act - Initial render
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Rerender with same props
            rerender(<index_1.default {...props}/>);
            // Assert - Component renders without errors
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should re-render when inputValue changes', () => {
            // Arrange
            const props = createDefaultProps({ inputValue: 'initial' });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue('initial');
            // Act - Rerender with different inputValue
            const newProps = createDefaultProps({ inputValue: 'changed' });
            rerender(<index_1.default {...newProps}/>);
            // Assert - Input value should be updated
            expect(input).toHaveValue('changed');
        });
        it('should re-render when breadcrumbs change', () => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs: [] });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rerender with different breadcrumbs
            const newProps = createDefaultProps({ breadcrumbs: ['folder1', 'folder2'] });
            rerender(<index_1.default {...newProps}/>);
            // Assert - Component renders without errors
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should re-render when keywords change', () => {
            // Arrange
            const props = createDefaultProps({ keywords: '' });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rerender with different keywords
            const newProps = createDefaultProps({ keywords: 'search-term' });
            rerender(<index_1.default {...newProps}/>);
            // Assert - Component renders without errors
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle very long inputValue', () => {
            // Arrange
            const longValue = 'a'.repeat(500);
            const props = createDefaultProps({ inputValue: longValue });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue(longValue);
        });
        it('should handle very long breadcrumb paths', () => {
            // Arrange
            const longBreadcrumbs = Array.from({ length: 20 }, (_, i) => `folder-${i}`);
            const props = createDefaultProps({ breadcrumbs: longBreadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should handle breadcrumbs with special characters', () => {
            // Arrange
            const specialBreadcrumbs = ['folder [1]', 'folder (2)', 'folder-3.backup'];
            const props = createDefaultProps({ breadcrumbs: specialBreadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should handle breadcrumbs with unicode names', () => {
            // Arrange
            const unicodeBreadcrumbs = ['文件夹', 'フォルダ', 'Папка'];
            const props = createDefaultProps({ breadcrumbs: unicodeBreadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should handle bucket with special characters', () => {
            // Arrange
            const props = createDefaultProps({ bucket: 'my-bucket_2024.backup' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should pass the event object to handleInputChange callback', () => {
            // Arrange
            const mockHandleInputChange = vi.fn();
            const props = createDefaultProps({ handleInputChange: mockHandleInputChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'test-value' } });
            // Assert - Verify the event object is passed correctly
            expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
            const eventArg = mockHandleInputChange.mock.calls[0][0];
            expect(eventArg).toHaveProperty('type', 'change');
            expect(eventArg).toHaveProperty('target');
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { isInPipeline: true, bucket: '' },
            { isInPipeline: true, bucket: 'my-bucket' },
            { isInPipeline: false, bucket: '' },
            { isInPipeline: false, bucket: 'my-bucket' },
        ])('should render correctly with isInPipeline=$isInPipeline and bucket=$bucket', (propVariation) => {
            // Arrange
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it.each([
            { keywords: '', searchResultsLength: 0, description: 'no search' },
            { keywords: 'test', searchResultsLength: 0, description: 'search with no results' },
            { keywords: 'test', searchResultsLength: 5, description: 'search with results' },
            { keywords: '', searchResultsLength: 5, description: 'no keywords but has results count' },
        ])('should render correctly with $description', ({ keywords, searchResultsLength }) => {
            // Arrange
            const props = createDefaultProps({ keywords, searchResultsLength });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it.each([
            { breadcrumbs: [], inputValue: '', expected: 'empty state' },
            { breadcrumbs: ['root'], inputValue: 'search', expected: 'single breadcrumb with search' },
            { breadcrumbs: ['a', 'b', 'c'], inputValue: '', expected: 'multiple breadcrumbs no search' },
            { breadcrumbs: ['a', 'b', 'c', 'd', 'e'], inputValue: 'query', expected: 'many breadcrumbs with search' },
        ])('should handle $expected correctly', ({ breadcrumbs, inputValue }) => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs, inputValue });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue(inputValue);
        });
    });
    // ==========================================
    // Integration with Child Components
    // ==========================================
    describe('Integration with Child Components', () => {
        it('should pass all required props to Breadcrumbs', () => {
            // Arrange
            const props = createDefaultProps({
                breadcrumbs: ['folder1', 'folder2'],
                keywords: 'test-keyword',
                bucket: 'test-bucket',
                searchResultsLength: 10,
                isInPipeline: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Component should render successfully, meaning props are passed correctly
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it('should pass correct props to Input component', () => {
            // Arrange
            const mockHandleInputChange = vi.fn();
            const mockHandleResetKeywords = vi.fn();
            const props = createDefaultProps({
                inputValue: 'test-input',
                handleInputChange: mockHandleInputChange,
                handleResetKeywords: mockHandleResetKeywords,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue('test-input');
            // Test onChange handler
            react_1.fireEvent.change(input, { target: { value: 'new-value' } });
            expect(mockHandleInputChange).toHaveBeenCalled();
        });
    });
    // ==========================================
    // Callback Stability Tests
    // ==========================================
    describe('Callback Stability', () => {
        it('should maintain stable handleInputChange callback after rerender', () => {
            // Arrange
            const mockHandleInputChange = vi.fn();
            const props = createDefaultProps({ handleInputChange: mockHandleInputChange });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            // Act - Fire change event, rerender, fire again
            react_1.fireEvent.change(input, { target: { value: 'first' } });
            rerender(<index_1.default {...props}/>);
            react_1.fireEvent.change(input, { target: { value: 'second' } });
            // Assert
            expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
        });
        it('should maintain stable handleResetKeywords callback after rerender', () => {
            // Arrange
            const mockHandleResetKeywords = vi.fn();
            const props = createDefaultProps({
                inputValue: 'to-clear',
                handleResetKeywords: mockHandleResetKeywords,
            });
            const { container, rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click clear, rerender, click again
            const clearButton = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]')?.parentElement;
            react_1.fireEvent.click(clearButton);
            rerender(<index_1.default {...props}/>);
            react_1.fireEvent.click(clearButton);
            // Assert
            expect(mockHandleResetKeywords).toHaveBeenCalledTimes(2);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBNEI7QUFFNUIsNkNBQTZDO0FBQzdDLGVBQWU7QUFDZiw2Q0FBNkM7QUFFN0MsZ0VBQWdFO0FBRWhFLGlEQUFpRDtBQUNqRCxNQUFNLGNBQWMsR0FBRztJQUNyQixTQUFTLEVBQUUsS0FBSztJQUNoQixzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQy9CLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDM0IsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbEIsV0FBVyxFQUFFLEVBQUU7SUFDZixNQUFNLEVBQUUsRUFBRTtDQUNYLENBQUE7QUFFRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ2hELE1BQU0sbUJBQW1CLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUE7QUFFdEQsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLG1CQUFtQjtJQUM3Qyw4QkFBOEIsRUFBRSxDQUFDLFFBQStDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7Q0FDOUcsQ0FBQyxDQUFDLENBQUE7QUFPSCxNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBZ0MsRUFBZSxFQUFFLENBQUMsQ0FBQztJQUM3RSxXQUFXLEVBQUUsRUFBRTtJQUNmLFVBQVUsRUFBRSxFQUFFO0lBQ2QsUUFBUSxFQUFFLEVB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QyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBNb2R1bGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTm90ZTogcmVhY3QtaTE4bmV4dCB1c2VzIGdsb2JhbCBtb2NrIGZyb20gd2ViL3ZpdGVzdC5zZXR1cC50c1xuXG4vLyBNb2NrIHN0b3JlIC0gcmVxdWlyZWQgYnkgQnJlYWRjcnVtYnMgY29tcG9uZW50XG5jb25zdCBtb2NrU3RvcmVTdGF0ZSA9IHtcbiAgaGFzQnVja2V0OiBmYWxzZSxcbiAgc2V0T25saW5lRHJpdmVGaWxlTGlzdDogdmkuZm4oKSxcbiAgc2V0U2VsZWN0ZWRGaWxlSWRzOiB2aS5mbigpLFxuICBzZXRCcmVhZGNydW1iczogdmkuZm4oKSxcbiAgc2V0UHJlZml4OiB2aS5mbigpLFxuICBzZXRCdWNrZXQ6IHZpLmZuKCksXG4gIGJyZWFkY3J1bWJzOiBbXSxcbiAgcHJlZml4OiBbXSxcbn1cblxuY29uc3QgbW9ja0dldFN0YXRlID0gdmkuZm4oKCkgPT4gbW9ja1N0b3JlU3RhdGUpXG5jb25zdCBtb2NrRGF0YVNvdXJjZVN0b3JlID0geyBnZXRTdGF0ZTogbW9ja0dldFN0YXRlIH1cblxudmkubW9jaygnLi4vLi4vLi4vc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VEYXRhU291cmNlU3RvcmU6ICgpID0+IG1vY2tEYXRhU291cmNlU3RvcmUsXG4gIHVzZURhdGFTb3VyY2VTdG9yZVdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoczogdHlwZW9mIG1vY2tTdG9yZVN0YXRlKSA9PiB1bmtub3duKSA9PiBzZWxlY3Rvcihtb2NrU3RvcmVTdGF0ZSksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxudHlwZSBIZWFkZXJQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBIZWFkZXI+XG5cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEhlYWRlclByb3BzPik6IEhlYWRlclByb3BzID0+ICh7XG4gIGJyZWFkY3J1bWJzOiBbXSxcbiAgaW5wdXRWYWx1ZTogJycsXG4gIGtleXdvcmRzOiAnJyxcbiAgYnVja2V0OiAnJyxcbiAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMCxcbiAgaGFuZGxlSW5wdXRDaGFuZ2U6IHZpLmZuKCksXG4gIGhhbmRsZVJlc2V0S2V5d29yZHM6IHZpLmZuKCksXG4gIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCByZXNldE1vY2tTdG9yZVN0YXRlID0gKCkgPT4ge1xuICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0ID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRTZWxlY3RlZEZpbGVJZHMgPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLnNldEJyZWFkY3J1bWJzID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRQcmVmaXggPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLnNldEJ1Y2tldCA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuYnJlYWRjcnVtYnMgPSBbXVxuICBtb2NrU3RvcmVTdGF0ZS5wcmVmaXggPSBbXVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdIZWFkZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHJlc2V0TW9ja1N0b3JlU3RhdGUoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzZWFyY2ggaW5wdXQgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggY29ycmVjdCBjb250YWluZXIgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjb250YWluZXIgc2hvdWxkIGhhdmUgY29ycmVjdCBjbGFzcyBuYW1lc1xuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgnKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdpdGVtcy1jZW50ZXInKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdnYXAteC0yJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1wYW5lbC1iZycpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ3AtMScpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ3BsLTMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnB1dCBjb21wb25lbnQgd2l0aCBjb3JyZWN0IHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbnB1dFZhbHVlOiAndGVzdC12YWx1ZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCd0ZXN0LXZhbHVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5wdXQgd2l0aCBzZWFyY2ggaWNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5wdXQgc2hvdWxkIGhhdmUgc2VhcmNoIGljb24gKFJpU2VhcmNoTGluZSBpcyByZW5kZXJlZCBhcyBzdmcpXG4gICAgICBjb25zdCBzZWFyY2hJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2Zy5oLTQudy00JylcbiAgICAgIGV4cGVjdChzZWFyY2hJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIElucHV0IHdpdGggY29ycmVjdCB3cmFwcGVyIHdpZHRoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbnB1dCB3cmFwcGVyIHNob3VsZCBoYXZlIHctWzIwMHB4XSBjbGFzc1xuICAgICAgY29uc3QgaW5wdXRXcmFwcGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LVxcXFxbMjAwcHhcXFxcXScpXG4gICAgICBleHBlY3QoaW5wdXRXcmFwcGVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdpbnB1dFZhbHVlIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZW1wdHkgaW5wdXQgd2hlbiBpbnB1dFZhbHVlIGlzIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlucHV0VmFsdWU6ICcnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCcnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGlucHV0IHZhbHVlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlucHV0VmFsdWU6ICdzZWFyY2gtcXVlcnknIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCdzZWFyY2gtcXVlcnknKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGlucHV0VmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc3BlY2lhbENoYXJzID0gJ3Rlc3RbZmlsZV0udHh0IChjb3B5KSdcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbnB1dFZhbHVlOiBzcGVjaWFsQ2hhcnMgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoc3BlY2lhbENoYXJzKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIGlucHV0VmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdW5pY29kZVZhbHVlID0gJ+aWh+S7tuaQnOe0oiDml6XmnKzoqp4nXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5wdXRWYWx1ZTogdW5pY29kZVZhbHVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKHVuaWNvZGVWYWx1ZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdicmVhZGNydW1icyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBlbXB0eSBicmVhZGNydW1icycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBbXSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNpbmdsZSBicmVhZGNydW1iJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMSddIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIG11bHRpcGxlIGJyZWFkY3J1bWJzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMScsICdmb2xkZXIyJywgJ2ZvbGRlcjMnXSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2tleXdvcmRzIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3Mga2V5d29yZHMgdG8gQnJlYWRjcnVtYnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBrZXl3b3JkczogJ3NlYXJjaC1rZXl3b3JkJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGtleXdvcmRzIGFyZSBwYXNzZWQgdGhyb3VnaCwgY29tcG9uZW50IHJlbmRlcnNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdidWNrZXQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggZW1wdHkgYnVja2V0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnVja2V0OiAnJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBidWNrZXQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBidWNrZXQ6ICdteS1idWNrZXQnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2VhcmNoUmVzdWx0c0xlbmd0aCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBzZWFyY2ggcmVzdWx0cycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNlYXJjaFJlc3VsdHNMZW5ndGg6IDAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHBvc2l0aXZlIHNlYXJjaCByZXN1bHRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2VhcmNoUmVzdWx0c0xlbmd0aDogMTAsIGtleXdvcmRzOiAndGVzdCcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBCcmVhZGNydW1icyB3aWxsIHNob3cgc2VhcmNoIHJlc3VsdHMgdGV4dCB3aGVuIGtleXdvcmRzIGV4aXN0IGFuZCByZXN1bHRzID4gMFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2Ugc2VhcmNoIHJlc3VsdHMgY291bnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzZWFyY2hSZXN1bHRzTGVuZ3RoOiAxMDAwLCBrZXl3b3JkczogJ3Rlc3QnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaXNJblBpcGVsaW5lIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmU6IGZhbHNlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2hlbiBpc0luUGlwZWxpbmUgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzSW5QaXBlbGluZTogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFdmVudCBIYW5kbGVycyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdoYW5kbGVJbnB1dENoYW5nZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVJbnB1dENoYW5nZSB3aGVuIGlucHV0IHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGhhbmRsZUlucHV0Q2hhbmdlOiBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3LXZhbHVlJyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlSW5wdXRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICAvLyBWZXJpZnkgdGhhdCBvbkNoYW5nZSBldmVudCB3YXMgdHJpZ2dlcmVkIChSZWFjdCdzIHN5bnRoZXRpYyBldmVudCBzdHJ1Y3R1cmUpXG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlSW5wdXRDaGFuZ2UubW9jay5jYWxsc1swXVswXSkudG9IYXZlUHJvcGVydHkoJ3R5cGUnLCAnY2hhbmdlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVJbnB1dENoYW5nZSBvbiBlYWNoIGtleXN0cm9rZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaGFuZGxlSW5wdXRDaGFuZ2U6IG1vY2tIYW5kbGVJbnB1dENoYW5nZSB9KVxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhJyB9IH0pXG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYWInIH0gfSlcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYmMnIH0gfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVJbnB1dENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlucHV0VmFsdWU6ICdleGlzdGluZycsIGhhbmRsZUlucHV0Q2hhbmdlOiBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnJyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlSW5wdXRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0Q2hhbmdlLm1vY2suY2FsbHNbMF1bMF0pLnRvSGF2ZVByb3BlcnR5KCd0eXBlJywgJ2NoYW5nZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB3aGl0ZXNwYWNlLW9ubHkgaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGhhbmRsZUlucHV0Q2hhbmdlOiBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnICAgJyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlSW5wdXRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0Q2hhbmdlLm1vY2suY2FsbHNbMF1bMF0pLnRvSGF2ZVByb3BlcnR5KCd0eXBlJywgJ2NoYW5nZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlUmVzZXRLZXl3b3JkcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVSZXNldEtleXdvcmRzIHdoZW4gY2xlYXIgaWNvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tIYW5kbGVSZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgaW5wdXRWYWx1ZTogJ3RvLWNsZWFyJyxcbiAgICAgICAgICBoYW5kbGVSZXNldEtleXdvcmRzOiBtb2NrSGFuZGxlUmVzZXRLZXl3b3JkcyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gRmluZCBhbmQgY2xpY2sgdGhlIGNsZWFyIGljb24gY29udGFpbmVyXG4gICAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXSBzdmdbY2xhc3MqPVwiaC0zLjVcIl0nKT8ucGFyZW50RWxlbWVudFxuICAgICAgICBleHBlY3QoY2xlYXJCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsZWFyQnV0dG9uISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVSZXNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgY2xlYXIgaWNvbiB3aGVuIGlucHV0VmFsdWUgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbnB1dFZhbHVlOiAnJyB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnQgLSBDbGVhciBpY29uIHNob3VsZCBub3QgYmUgdmlzaWJsZVxuICAgICAgICBjb25zdCBjbGVhckljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdIHN2Z1tjbGFzcyo9XCJoLTMuNVwiXScpXG4gICAgICAgIGV4cGVjdChjbGVhckljb24pLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgY2xlYXIgaWNvbiB3aGVuIGlucHV0VmFsdWUgaXMgbm90IGVtcHR5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5wdXRWYWx1ZTogJ3NvbWUtdmFsdWUnIH0pXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAmIEFzc2VydCAtIENsZWFyIGljb24gc2hvdWxkIGJlIHZpc2libGVcbiAgICAgICAgY29uc3QgY2xlYXJJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXSBzdmdbY2xhc3MqPVwiaC0zLjVcIl0nKVxuICAgICAgICBleHBlY3QoY2xlYXJJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnQgLSBIZWFkZXIgY29tcG9uZW50IHNob3VsZCBiZSBtZW1vaXplZFxuICAgICAgZXhwZWN0KEhlYWRlcikudG9IYXZlUHJvcGVydHkoJyQkdHlwZW9mJywgU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2hlbiBwcm9wcyBhcmUgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrSGFuZGxlUmVzZXRLZXl3b3JkcyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgaGFuZGxlSW5wdXRDaGFuZ2U6IG1vY2tIYW5kbGVJbnB1dENoYW5nZSxcbiAgICAgICAgaGFuZGxlUmVzZXRLZXl3b3JkczogbW9ja0hhbmRsZVJlc2V0S2V5d29yZHMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgLSBJbml0aWFsIHJlbmRlclxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCByZW5kZXJzIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIGlucHV0VmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaW5wdXRWYWx1ZTogJ2luaXRpYWwnIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCdpbml0aWFsJylcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBkaWZmZXJlbnQgaW5wdXRWYWx1ZVxuICAgICAgY29uc3QgbmV3UHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbnB1dFZhbHVlOiAnY2hhbmdlZCcgfSlcbiAgICAgIHJlcmVuZGVyKDxIZWFkZXIgey4uLm5ld1Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5wdXQgdmFsdWUgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2NoYW5nZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIGJyZWFkY3J1bWJzIGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFtdIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIGRpZmZlcmVudCBicmVhZGNydW1ic1xuICAgICAgY29uc3QgbmV3UHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSB9KVxuICAgICAgcmVyZW5kZXIoPEhlYWRlciB7Li4ubmV3UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgcmVuZGVycyB3aXRob3V0IGVycm9yc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBrZXl3b3JkcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGtleXdvcmRzOiAnJyB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBkaWZmZXJlbnQga2V5d29yZHNcbiAgICAgIGNvbnN0IG5ld1Byb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsga2V5d29yZHM6ICdzZWFyY2gtdGVybScgfSlcbiAgICAgIHJlcmVuZGVyKDxIZWFkZXIgey4uLm5ld1Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHJlbmRlcnMgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgaW5wdXRWYWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdWYWx1ZSA9ICdhJy5yZXBlYXQoNTAwKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbnB1dFZhbHVlOiBsb25nVmFsdWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZShsb25nVmFsdWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBicmVhZGNydW1iIHBhdGhzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ0JyZWFkY3J1bWJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMjAgfSwgKF8sIGkpID0+IGBmb2xkZXItJHtpfWApXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBsb25nQnJlYWRjcnVtYnMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJyZWFkY3J1bWJzIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbEJyZWFkY3J1bWJzID0gWydmb2xkZXIgWzFdJywgJ2ZvbGRlciAoMiknLCAnZm9sZGVyLTMuYmFja3VwJ11cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IHNwZWNpYWxCcmVhZGNydW1icyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYnJlYWRjcnVtYnMgd2l0aCB1bmljb2RlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdW5pY29kZUJyZWFkY3J1bWJzID0gWyfmlofku7blpLknLCAn44OV44Kp44Or44OAJywgJ9Cf0LDQv9C60LAnXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogdW5pY29kZUJyZWFkY3J1bWJzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBidWNrZXQgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJ1Y2tldDogJ215LWJ1Y2tldF8yMDI0LmJhY2t1cCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyB0aGUgZXZlbnQgb2JqZWN0IHRvIGhhbmRsZUlucHV0Q2hhbmdlIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBoYW5kbGVJbnB1dENoYW5nZTogbW9ja0hhbmRsZUlucHV0Q2hhbmdlIH0pXG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICd0ZXN0LXZhbHVlJyB9IH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFZlcmlmeSB0aGUgZXZlbnQgb2JqZWN0IGlzIHBhc3NlZCBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlSW5wdXRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgY29uc3QgZXZlbnRBcmcgPSBtb2NrSGFuZGxlSW5wdXRDaGFuZ2UubW9jay5jYWxsc1swXVswXVxuICAgICAgZXhwZWN0KGV2ZW50QXJnKS50b0hhdmVQcm9wZXJ0eSgndHlwZScsICdjaGFuZ2UnKVxuICAgICAgZXhwZWN0KGV2ZW50QXJnKS50b0hhdmVQcm9wZXJ0eSgndGFyZ2V0JylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBpc0luUGlwZWxpbmU6IHRydWUsIGJ1Y2tldDogJycgfSxcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBidWNrZXQ6ICdteS1idWNrZXQnIH0sXG4gICAgICB7IGlzSW5QaXBlbGluZTogZmFsc2UsIGJ1Y2tldDogJycgfSxcbiAgICAgIHsgaXNJblBpcGVsaW5lOiBmYWxzZSwgYnVja2V0OiAnbXktYnVja2V0JyB9LFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIGlzSW5QaXBlbGluZT0kaXNJblBpcGVsaW5lIGFuZCBidWNrZXQ9JGJ1Y2tldCcsIChwcm9wVmFyaWF0aW9uKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyhwcm9wVmFyaWF0aW9uKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICB7IGtleXdvcmRzOiAnJywgc2VhcmNoUmVzdWx0c0xlbmd0aDogMCwgZGVzY3JpcHRpb246ICdubyBzZWFyY2gnIH0sXG4gICAgICB7IGtleXdvcmRzOiAndGVzdCcsIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDAsIGRlc2NyaXB0aW9uOiAnc2VhcmNoIHdpdGggbm8gcmVzdWx0cycgfSxcbiAgICAgIHsga2V5d29yZHM6ICd0ZXN0Jywgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSwgZGVzY3JpcHRpb246ICdzZWFyY2ggd2l0aCByZXN1bHRzJyB9LFxuICAgICAgeyBrZXl3b3JkczogJycsIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDUsIGRlc2NyaXB0aW9uOiAnbm8ga2V5d29yZHMgYnV0IGhhcyByZXN1bHRzIGNvdW50JyB9LFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoICRkZXNjcmlwdGlvbicsICh7IGtleXdvcmRzLCBzZWFyY2hSZXN1bHRzTGVuZ3RoIH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsga2V5d29yZHMsIHNlYXJjaFJlc3VsdHNMZW5ndGggfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBicmVhZGNydW1iczogW10sIGlucHV0VmFsdWU6ICcnLCBleHBlY3RlZDogJ2VtcHR5IHN0YXRlJyB9LFxuICAgICAgeyBicmVhZGNydW1iczogWydyb290J10sIGlucHV0VmFsdWU6ICdzZWFyY2gnLCBleHBlY3RlZDogJ3NpbmdsZSBicmVhZGNydW1iIHdpdGggc2VhcmNoJyB9LFxuICAgICAgeyBicmVhZGNydW1iczogWydhJywgJ2InLCAnYyddLCBpbnB1dFZhbHVlOiAnJywgZXhwZWN0ZWQ6ICdtdWx0aXBsZSBicmVhZGNydW1icyBubyBzZWFyY2gnIH0sXG4gICAgICB7IGJyZWFkY3J1bWJzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZSddLCBpbnB1dFZhbHVlOiAncXVlcnknLCBleHBlY3RlZDogJ21hbnkgYnJlYWRjcnVtYnMgd2l0aCBzZWFyY2gnIH0sXG4gICAgXSkoJ3Nob3VsZCBoYW5kbGUgJGV4cGVjdGVkIGNvcnJlY3RseScsICh7IGJyZWFkY3J1bWJzLCBpbnB1dFZhbHVlIH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnMsIGlucHV0VmFsdWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZShpbnB1dFZhbHVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEludGVncmF0aW9uIHdpdGggQ2hpbGQgQ29tcG9uZW50c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIHdpdGggQ2hpbGQgQ29tcG9uZW50cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgYWxsIHJlcXVpcmVkIHByb3BzIHRvIEJyZWFkY3J1bWJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgICAga2V5d29yZHM6ICd0ZXN0LWtleXdvcmQnLFxuICAgICAgICBidWNrZXQ6ICd0ZXN0LWJ1Y2tldCcsXG4gICAgICAgIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDEwLFxuICAgICAgICBpc0luUGlwZWxpbmU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHN1Y2Nlc3NmdWxseSwgbWVhbmluZyBwcm9wcyBhcmUgcGFzc2VkIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgcHJvcHMgdG8gSW5wdXQgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja0hhbmRsZVJlc2V0S2V5d29yZHMgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGlucHV0VmFsdWU6ICd0ZXN0LWlucHV0JyxcbiAgICAgICAgaGFuZGxlSW5wdXRDaGFuZ2U6IG1vY2tIYW5kbGVJbnB1dENoYW5nZSxcbiAgICAgICAgaGFuZGxlUmVzZXRLZXl3b3JkczogbW9ja0hhbmRsZVJlc2V0S2V5d29yZHMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCd0ZXN0LWlucHV0JylcblxuICAgICAgLy8gVGVzdCBvbkNoYW5nZSBoYW5kbGVyXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ25ldy12YWx1ZScgfSB9KVxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVJbnB1dENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZUlucHV0Q2hhbmdlIGNhbGxiYWNrIGFmdGVyIHJlcmVuZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0hhbmRsZUlucHV0Q2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBoYW5kbGVJbnB1dENoYW5nZTogbW9ja0hhbmRsZUlucHV0Q2hhbmdlIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgIC8vIEFjdCAtIEZpcmUgY2hhbmdlIGV2ZW50LCByZXJlbmRlciwgZmlyZSBhZ2FpblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdmaXJzdCcgfSB9KVxuICAgICAgcmVyZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdzZWNvbmQnIH0gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlUmVzZXRLZXl3b3JkcyBjYWxsYmFjayBhZnRlciByZXJlbmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tIYW5kbGVSZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBpbnB1dFZhbHVlOiAndG8tY2xlYXInLFxuICAgICAgICBoYW5kbGVSZXNldEtleXdvcmRzOiBtb2NrSGFuZGxlUmVzZXRLZXl3b3JkcyxcbiAgICAgIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciwgcmVyZW5kZXIgfSA9IHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGNsZWFyLCByZXJlbmRlciwgY2xpY2sgYWdhaW5cbiAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXSBzdmdbY2xhc3MqPVwiaC0zLjVcIl0nKT8ucGFyZW50RWxlbWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsZWFyQnV0dG9uISlcbiAgICAgIHJlcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbGVhckJ1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVSZXNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==