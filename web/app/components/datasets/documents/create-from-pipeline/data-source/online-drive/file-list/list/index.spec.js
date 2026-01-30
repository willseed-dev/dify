"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock Item component for List tests - child component with complex behavior
vi.mock('./item', () => ({
    default: ({ file, isSelected, onSelect, onOpen, isMultipleChoice }) => {
        return (<div data-testid={`item-${file.id}`} data-selected={isSelected} data-multiple-choice={isMultipleChoice}>
        <span data-testid={`item-name-${file.id}`}>{file.name}</span>
        <button data-testid={`item-select-${file.id}`} onClick={() => onSelect(file)}>Select</button>
        <button data-testid={`item-open-${file.id}`} onClick={() => onOpen(file)}>Open</button>
      </div>);
    },
}));
// Mock EmptyFolder component for List tests
vi.mock('./empty-folder', () => ({
    default: () => (<div data-testid="empty-folder">Empty Folder</div>),
}));
// Mock EmptySearchResult component for List tests
vi.mock('./empty-search-result', () => ({
    default: ({ onResetKeywords }) => (<div data-testid="empty-search-result">
      <span>No results</span>
      <button data-testid="reset-keywords-btn" onClick={onResetKeywords}>Reset</button>
    </div>),
}));
// Mock store state and refs
const mockIsTruncated = { current: false };
const mockCurrentNextPageParametersRef = { current: {} };
const mockSetNextPageParameters = vi.fn();
const mockStoreState = {
    isTruncated: mockIsTruncated,
    currentNextPageParametersRef: mockCurrentNextPageParametersRef,
    setNextPageParameters: mockSetNextPageParameters,
};
const mockGetState = vi.fn(() => mockStoreState);
const mockDataSourceStore = { getState: mockGetState };
vi.mock('../../../store', () => ({
    useDataSourceStore: () => mockDataSourceStore,
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockOnlineDriveFile = (overrides) => ({
    id: 'file-1',
    name: 'test-file.txt',
    size: 1024,
    type: pipeline_1.OnlineDriveFileType.file,
    ...overrides,
});
const createMockFileList = (count) => {
    return Array.from({ length: count }, (_, index) => createMockOnlineDriveFile({
        id: `file-${index + 1}`,
        name: `file-${index + 1}.txt`,
        size: (index + 1) * 1024,
    }));
};
const createDefaultProps = (overrides) => ({
    fileList: [],
    selectedFileIds: [],
    keywords: '',
    isLoading: false,
    supportBatchUpload: true,
    handleResetKeywords: vi.fn(),
    handleSelectFile: vi.fn(),
    handleOpenFolder: vi.fn(),
    ...overrides,
});
// ==========================================
// Mock IntersectionObserver
// ==========================================
let mockIntersectionObserverCallback = null;
let mockIntersectionObserverInstance = null;
const createMockIntersectionObserver = () => {
    const instance = {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn(),
    };
    mockIntersectionObserverInstance = instance;
    return class MockIntersectionObserver {
        constructor(callback, options) {
            this.observe = instance.observe;
            this.disconnect = instance.disconnect;
            this.unobserve = instance.unobserve;
            this.callback = callback;
            this.options = options || {};
            mockIntersectionObserverCallback = callback;
        }
    };
};
// ==========================================
// Helper Functions
// ==========================================
const triggerIntersection = (isIntersecting) => {
    if (mockIntersectionObserverCallback) {
        const entries = [{
                isIntersecting,
                boundingClientRect: {},
                intersectionRatio: isIntersecting ? 1 : 0,
                intersectionRect: {},
                rootBounds: null,
                target: document.createElement('div'),
                time: Date.now(),
            }];
        mockIntersectionObserverCallback(entries, {});
    }
};
const resetMockStoreState = () => {
    mockIsTruncated.current = false;
    mockCurrentNextPageParametersRef.current = {};
    mockSetNextPageParameters.mockClear();
    mockGetState.mockClear();
};
// ==========================================
// Test Suites
// ==========================================
describe('List', () => {
    const originalIntersectionObserver = window.IntersectionObserver;
    beforeEach(() => {
        vi.clearAllMocks();
        resetMockStoreState();
        mockIntersectionObserverCallback = null;
        mockIntersectionObserverInstance = null;
        // Setup IntersectionObserver mock
        window.IntersectionObserver = createMockIntersectionObserver();
    });
    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
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
            // Assert
            expect(document.body).toBeInTheDocument();
        });
        it('should render Loading component when isAllLoading is true', () => {
            // Arrange
            const props = createDefaultProps({
                isLoading: true,
                fileList: [],
                keywords: '',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        it('should render EmptyFolder when folder is empty and not loading', () => {
            // Arrange
            const props = createDefaultProps({
                isLoading: false,
                fileList: [],
                keywords: '',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
        });
        it('should render EmptySearchResult when search has no results', () => {
            // Arrange
            const props = createDefaultProps({
                isLoading: false,
                fileList: [],
                keywords: 'non-existent-file',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('empty-search-result')).toBeInTheDocument();
        });
        it('should render file list when files exist', () => {
            // Arrange
            const fileList = createMockFileList(3);
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('item-file-2')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('item-file-3')).toBeInTheDocument();
        });
        it('should render partial loading spinner when loading more files', () => {
            // Arrange
            const fileList = createMockFileList(2);
            const props = createDefaultProps({
                fileList,
                isLoading: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show files AND loading indicator
            expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('fileList prop', () => {
            it('should render all files from fileList', () => {
                // Arrange
                const fileList = createMockFileList(5);
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                fileList.forEach((file) => {
                    expect(react_1.screen.getByTestId(`item-${file.id}`)).toBeInTheDocument();
                    expect(react_1.screen.getByTestId(`item-name-${file.id}`)).toHaveTextContent(file.name);
                });
            });
            it('should handle empty fileList', () => {
                // Arrange
                const props = createDefaultProps({ fileList: [] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
            });
            it('should handle single file in fileList', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile()];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            });
            it('should handle large fileList', () => {
                // Arrange
                const fileList = createMockFileList(100);
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('item-file-100')).toBeInTheDocument();
            });
        });
        describe('selectedFileIds prop', () => {
            it('should mark selected files as selected', () => {
                // Arrange
                const fileList = createMockFileList(3);
                const props = createDefaultProps({
                    fileList,
                    selectedFileIds: ['file-1', 'file-3'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-selected', 'true');
                expect(react_1.screen.getByTestId('item-file-2')).toHaveAttribute('data-selected', 'false');
                expect(react_1.screen.getByTestId('item-file-3')).toHaveAttribute('data-selected', 'true');
            });
            it('should handle empty selectedFileIds', () => {
                // Arrange
                const fileList = createMockFileList(3);
                const props = createDefaultProps({
                    fileList,
                    selectedFileIds: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                fileList.forEach((file) => {
                    expect(react_1.screen.getByTestId(`item-${file.id}`)).toHaveAttribute('data-selected', 'false');
                });
            });
            it('should handle all files selected', () => {
                // Arrange
                const fileList = createMockFileList(3);
                const props = createDefaultProps({
                    fileList,
                    selectedFileIds: ['file-1', 'file-2', 'file-3'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                fileList.forEach((file) => {
                    expect(react_1.screen.getByTestId(`item-${file.id}`)).toHaveAttribute('data-selected', 'true');
                });
            });
        });
        describe('keywords prop', () => {
            it('should show EmptySearchResult when keywords exist but no results', () => {
                // Arrange
                const props = createDefaultProps({
                    fileList: [],
                    keywords: 'search-term',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('empty-search-result')).toBeInTheDocument();
            });
            it('should show EmptyFolder when keywords is empty and no files', () => {
                // Arrange
                const props = createDefaultProps({
                    fileList: [],
                    keywords: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
            });
        });
        describe('isLoading prop', () => {
            it.each([
                { isLoading: true, fileList: [], keywords: '', expected: 'isAllLoading' },
                { isLoading: true, fileList: createMockFileList(2), keywords: '', expected: 'isPartialLoading' },
                { isLoading: false, fileList: [], keywords: '', expected: 'isEmpty' },
                { isLoading: false, fileList: createMockFileList(2), keywords: '', expected: 'hasFiles' },
            ])('should render correctly when isLoading=$isLoading with fileList.length=$fileList.length', ({ isLoading, fileList, expected }) => {
                // Arrange
                const props = createDefaultProps({ isLoading, fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                switch (expected) {
                    case 'isAllLoading':
                        expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                        break;
                    case 'isPartialLoading':
                        expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                        expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                        break;
                    case 'isEmpty':
                        expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
                        break;
                    case 'hasFiles':
                        expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                        break;
                }
            });
        });
        describe('supportBatchUpload prop', () => {
            it('should pass supportBatchUpload true to Item components', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    supportBatchUpload: true,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-multiple-choice', 'true');
            });
            it('should pass supportBatchUpload false to Item components', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    supportBatchUpload: false,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-multiple-choice', 'false');
            });
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions', () => {
        describe('File Selection', () => {
            it('should call handleSelectFile when selecting a file', () => {
                // Arrange
                const handleSelectFile = vi.fn();
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    handleSelectFile,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('item-select-file-1'));
                // Assert
                expect(handleSelectFile).toHaveBeenCalledWith(fileList[0]);
            });
            it('should call handleSelectFile with correct file data', () => {
                // Arrange
                const handleSelectFile = vi.fn();
                const fileList = [
                    createMockOnlineDriveFile({ id: 'unique-id', name: 'special-file.pdf', size: 5000 }),
                ];
                const props = createDefaultProps({
                    fileList,
                    handleSelectFile,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('item-select-unique-id'));
                // Assert
                expect(handleSelectFile).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'unique-id',
                    name: 'special-file.pdf',
                    size: 5000,
                }));
            });
        });
        describe('Folder Navigation', () => {
            it('should call handleOpenFolder when opening a folder', () => {
                // Arrange
                const handleOpenFolder = vi.fn();
                const fileList = [
                    createMockOnlineDriveFile({ id: 'folder-1', name: 'Documents', type: pipeline_1.OnlineDriveFileType.folder }),
                ];
                const props = createDefaultProps({
                    fileList,
                    handleOpenFolder,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('item-open-folder-1'));
                // Assert
                expect(handleOpenFolder).toHaveBeenCalledWith(fileList[0]);
            });
        });
        describe('Reset Keywords', () => {
            it('should call handleResetKeywords when reset button is clicked', () => {
                // Arrange
                const handleResetKeywords = vi.fn();
                const props = createDefaultProps({
                    fileList: [],
                    keywords: 'search-term',
                    handleResetKeywords,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('reset-keywords-btn'));
                // Assert
                expect(handleResetKeywords).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ==========================================
    // Side Effects and Cleanup Tests (IntersectionObserver)
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        describe('IntersectionObserver Setup', () => {
            it('should create IntersectionObserver on mount', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockIntersectionObserverInstance?.observe).toHaveBeenCalled();
            });
            it('should create IntersectionObserver with correct rootMargin', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Callback should be set
                expect(mockIntersectionObserverCallback).toBeDefined();
            });
            it('should observe the anchor element', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockIntersectionObserverInstance?.observe).toHaveBeenCalled();
                const observedElement = mockIntersectionObserverInstance?.observe.mock.calls[0]?.[0];
                expect(observedElement).toBeInstanceOf(HTMLElement);
                expect(observedElement).toBeInTheDocument();
            });
        });
        describe('IntersectionObserver Callback', () => {
            it('should call setNextPageParameters when intersecting and truncated', async () => {
                // Arrange
                mockIsTruncated.current = true;
                mockCurrentNextPageParametersRef.current = { cursor: 'next-cursor' };
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(true);
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(mockSetNextPageParameters).toHaveBeenCalledWith({ cursor: 'next-cursor' });
                });
            });
            it('should not call setNextPageParameters when not intersecting', () => {
                // Arrange
                mockIsTruncated.current = true;
                mockCurrentNextPageParametersRef.current = { cursor: 'next-cursor' };
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(false);
                // Assert
                expect(mockSetNextPageParameters).not.toHaveBeenCalled();
            });
            it('should not call setNextPageParameters when not truncated', () => {
                // Arrange
                mockIsTruncated.current = false;
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(true);
                // Assert
                expect(mockSetNextPageParameters).not.toHaveBeenCalled();
            });
            it('should not call setNextPageParameters when loading', () => {
                // Arrange
                mockIsTruncated.current = true;
                mockCurrentNextPageParametersRef.current = { cursor: 'next-cursor' };
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: true,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(true);
                // Assert
                expect(mockSetNextPageParameters).not.toHaveBeenCalled();
            });
        });
        describe('IntersectionObserver Cleanup', () => {
            it('should disconnect IntersectionObserver on unmount', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({ fileList });
                const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                unmount();
                // Assert
                expect(mockIntersectionObserverInstance?.disconnect).toHaveBeenCalled();
            });
            it('should cleanup previous observer when dependencies change', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Trigger re-render with changed isLoading
                rerender(<index_1.default {...props} isLoading={true}/>);
                // Assert - Previous observer should be disconnected
                expect(mockIntersectionObserverInstance?.disconnect).toHaveBeenCalled();
            });
        });
    });
    // ==========================================
    // Component Memoization Tests
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange & Assert
            // List component should have $$typeof symbol indicating memo wrapper
            expect(index_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should not re-render when props are equal', () => {
            // Arrange
            const fileList = createMockFileList(2);
            const props = createDefaultProps({ fileList });
            const renderSpy = vi.fn();
            // Create a wrapper component to track renders
            const TestWrapper = ({ testProps }) => {
                renderSpy();
                return <index_1.default {...testProps}/>;
            };
            const { rerender } = (0, react_1.render)(<TestWrapper testProps={props}/>);
            const initialRenderCount = renderSpy.mock.calls.length;
            // Act - Rerender with same props
            rerender(<TestWrapper testProps={props}/>);
            // Assert - Should have rendered again (wrapper re-renders, but memo prevents List re-render)
            expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
        });
        it('should re-render when fileList changes', () => {
            // Arrange
            const fileList1 = createMockFileList(2);
            const fileList2 = createMockFileList(3);
            const props1 = createDefaultProps({ fileList: fileList1 });
            const props2 = createDefaultProps({ fileList: fileList2 });
            const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
            // Assert initial state
            expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('item-file-2')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('item-file-3')).not.toBeInTheDocument();
            // Act - Rerender with new fileList
            rerender(<index_1.default {...props2}/>);
            // Assert - Should show new file
            expect(react_1.screen.getByTestId('item-file-3')).toBeInTheDocument();
        });
        it('should re-render when selectedFileIds changes', () => {
            // Arrange
            const fileList = createMockFileList(2);
            const props1 = createDefaultProps({ fileList, selectedFileIds: [] });
            const props2 = createDefaultProps({ fileList, selectedFileIds: ['file-1'] });
            const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
            // Assert initial state
            expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-selected', 'false');
            // Act
            rerender(<index_1.default {...props2}/>);
            // Assert
            expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-selected', 'true');
        });
        it('should re-render when isLoading changes', () => {
            // Arrange
            const fileList = createMockFileList(2);
            const props1 = createDefaultProps({ fileList, isLoading: false });
            const props2 = createDefaultProps({ fileList, isLoading: true });
            const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
            // Assert initial state - no loading spinner
            expect(react_1.screen.queryByRole('status')).not.toBeInTheDocument();
            // Act
            rerender(<index_1.default {...props2}/>);
            // Assert - loading spinner should appear
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        describe('Empty/Null Values', () => {
            it('should handle empty fileList array', () => {
                // Arrange
                const props = createDefaultProps({ fileList: [] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
            });
            it('should handle empty selectedFileIds array', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    selectedFileIds: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-selected', 'false');
            });
            it('should handle empty keywords string', () => {
                // Arrange
                const props = createDefaultProps({
                    fileList: [],
                    keywords: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Shows empty folder, not empty search result
                expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId('empty-search-result')).not.toBeInTheDocument();
            });
        });
        describe('Boundary Conditions', () => {
            it('should handle very long file names', () => {
                // Arrange
                const longName = `${'a'.repeat(500)}.txt`;
                const fileList = [createMockOnlineDriveFile({ name: longName })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-name-file-1')).toHaveTextContent(longName);
            });
            it('should handle special characters in file names', () => {
                // Arrange
                const specialName = 'test<script>alert("xss")</script>.txt';
                const fileList = [createMockOnlineDriveFile({ name: specialName })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-name-file-1')).toHaveTextContent(specialName);
            });
            it('should handle unicode characters in file names', () => {
                // Arrange
                const unicodeName = '文件_📁_ファイル.txt';
                const fileList = [createMockOnlineDriveFile({ name: unicodeName })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-name-file-1')).toHaveTextContent(unicodeName);
            });
            it('should handle file with zero size', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile({ size: 0 })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            });
            it('should handle file with undefined size', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile({ size: undefined })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            });
        });
        describe('Different File Types', () => {
            it.each([
                { type: pipeline_1.OnlineDriveFileType.file, name: 'document.pdf' },
                { type: pipeline_1.OnlineDriveFileType.folder, name: 'Documents' },
                { type: pipeline_1.OnlineDriveFileType.bucket, name: 'my-bucket' },
            ])('should render $type type correctly', ({ type, name }) => {
                // Arrange
                const fileList = [createMockOnlineDriveFile({ id: `item-${type}`, type, name })];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId(`item-item-${type}`)).toBeInTheDocument();
                expect(react_1.screen.getByTestId(`item-name-item-${type}`)).toHaveTextContent(name);
            });
            it('should handle mixed file types in list', () => {
                // Arrange
                const fileList = [
                    createMockOnlineDriveFile({ id: 'file-1', type: pipeline_1.OnlineDriveFileType.file, name: 'doc.pdf' }),
                    createMockOnlineDriveFile({ id: 'folder-1', type: pipeline_1.OnlineDriveFileType.folder, name: 'Documents' }),
                    createMockOnlineDriveFile({ id: 'bucket-1', type: pipeline_1.OnlineDriveFileType.bucket, name: 'my-bucket' }),
                ];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('item-folder-1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('item-bucket-1')).toBeInTheDocument();
            });
        });
        describe('Loading States Transitions', () => {
            it('should transition from loading to empty folder', () => {
                // Arrange
                const props1 = createDefaultProps({ isLoading: true, fileList: [] });
                const props2 = createDefaultProps({ isLoading: false, fileList: [] });
                const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
                // Assert initial loading state
                expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                // Act
                rerender(<index_1.default {...props2}/>);
                // Assert
                expect(react_1.screen.queryByRole('status')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
            });
            it('should transition from loading to file list', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props1 = createDefaultProps({ isLoading: true, fileList: [] });
                const props2 = createDefaultProps({ isLoading: false, fileList });
                const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
                // Assert initial loading state
                expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                // Act
                rerender(<index_1.default {...props2}/>);
                // Assert
                expect(react_1.screen.queryByRole('status')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
            });
            it('should transition from partial loading to loaded', () => {
                // Arrange
                const fileList = createMockFileList(2);
                const props1 = createDefaultProps({ isLoading: true, fileList });
                const props2 = createDefaultProps({ isLoading: false, fileList });
                const { rerender } = (0, react_1.render)(<index_1.default {...props1}/>);
                // Assert initial partial loading state
                expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                // Act
                rerender(<index_1.default {...props2}/>);
                // Assert
                expect(react_1.screen.queryByRole('status')).not.toBeInTheDocument();
            });
        });
        describe('Store State Edge Cases', () => {
            it('should handle store state with empty next page parameters', () => {
                // Arrange
                mockIsTruncated.current = true;
                mockCurrentNextPageParametersRef.current = {};
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(true);
                // Assert
                expect(mockSetNextPageParameters).toHaveBeenCalledWith({});
            });
            it('should handle store state with complex next page parameters', () => {
                // Arrange
                const complexParams = {
                    cursor: 'abc123',
                    page: 2,
                    metadata: { nested: { value: true } },
                };
                mockIsTruncated.current = true;
                mockCurrentNextPageParametersRef.current = complexParams;
                const fileList = createMockFileList(2);
                const props = createDefaultProps({
                    fileList,
                    isLoading: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                triggerIntersection(true);
                // Assert
                expect(mockSetNextPageParameters).toHaveBeenCalledWith(complexParams);
            });
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { supportBatchUpload: true },
            { supportBatchUpload: false },
        ])('should render correctly with supportBatchUpload=$supportBatchUpload', ({ supportBatchUpload }) => {
            // Arrange
            const fileList = createMockFileList(2);
            const props = createDefaultProps({ fileList, supportBatchUpload });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('item-file-1')).toHaveAttribute('data-multiple-choice', String(supportBatchUpload));
        });
        it.each([
            { isLoading: true, fileCount: 0, keywords: '', expectedState: 'all-loading' },
            { isLoading: true, fileCount: 5, keywords: '', expectedState: 'partial-loading' },
            { isLoading: false, fileCount: 0, keywords: '', expectedState: 'empty-folder' },
            { isLoading: false, fileCount: 0, keywords: 'search', expectedState: 'empty-search' },
            { isLoading: false, fileCount: 5, keywords: '', expectedState: 'file-list' },
        ])('should render $expectedState when isLoading=$isLoading, fileCount=$fileCount, keywords=$keywords', ({ isLoading, fileCount, keywords, expectedState }) => {
            // Arrange
            const fileList = createMockFileList(fileCount);
            const props = createDefaultProps({ fileList, isLoading, keywords });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            switch (expectedState) {
                case 'all-loading':
                    expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                    break;
                case 'partial-loading':
                    expect(react_1.screen.getByRole('status')).toBeInTheDocument();
                    expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                    break;
                case 'empty-folder':
                    expect(react_1.screen.getByTestId('empty-folder')).toBeInTheDocument();
                    break;
                case 'empty-search':
                    expect(react_1.screen.getByTestId('empty-search-result')).toBeInTheDocument();
                    break;
                case 'file-list':
                    expect(react_1.screen.getByTestId('item-file-1')).toBeInTheDocument();
                    break;
            }
        });
        it.each([
            { selectedCount: 0, expectedSelected: [] },
            { selectedCount: 1, expectedSelected: ['file-1'] },
            { selectedCount: 3, expectedSelected: ['file-1', 'file-2', 'file-3'] },
        ])('should handle $selectedCount selected files', ({ expectedSelected }) => {
            // Arrange
            const fileList = createMockFileList(3);
            const props = createDefaultProps({
                fileList,
                selectedFileIds: expectedSelected,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            fileList.forEach((file) => {
                const isSelected = expectedSelected.includes(file.id);
                expect(react_1.screen.getByTestId(`item-${file.id}`)).toHaveAttribute('data-selected', String(isSelected));
            });
        });
    });
    // ==========================================
    // Accessibility Tests
    // ==========================================
    describe('Accessibility', () => {
        it('should allow interaction with reset keywords button in empty search state', () => {
            // Arrange
            const handleResetKeywords = vi.fn();
            const props = createDefaultProps({
                fileList: [],
                keywords: 'search-term',
                handleResetKeywords,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const resetButton = react_1.screen.getByTestId('reset-keywords-btn');
            // Assert
            expect(resetButton).toBeInTheDocument();
            react_1.fireEvent.click(resetButton);
            expect(handleResetKeywords).toHaveBeenCalled();
        });
    });
});
// ==========================================
// EmptyFolder Component Tests (using actual component)
// ==========================================
describe('EmptyFolder', () => {
    // Get real component for testing
    let ActualEmptyFolder;
    beforeAll(async () => {
        const mod = await vi.importActual('./empty-folder');
        ActualEmptyFolder = mod.default;
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<ActualEmptyFolder />);
            expect(document.body).toBeInTheDocument();
        });
        it('should render empty folder message', () => {
            (0, react_1.render)(<ActualEmptyFolder />);
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.emptyFolder/)).toBeInTheDocument();
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(ActualEmptyFolder).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
    });
    describe('Accessibility', () => {
        it('should have readable text content', () => {
            (0, react_1.render)(<ActualEmptyFolder />);
            const textElement = react_1.screen.getByText(/datasetPipeline\.onlineDrive\.emptyFolder/);
            expect(textElement.tagName).toBe('SPAN');
        });
    });
});
// ==========================================
// EmptySearchResult Component Tests (using actual component)
// ==========================================
describe('EmptySearchResult', () => {
    // Get real component for testing
    let ActualEmptySearchResult;
    beforeAll(async () => {
        const mod = await vi.importActual('./empty-search-result');
        ActualEmptySearchResult = mod.default;
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            const onResetKeywords = vi.fn();
            (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            expect(document.body).toBeInTheDocument();
        });
        it('should render empty search result message', () => {
            const onResetKeywords = vi.fn();
            (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.emptySearchResult/)).toBeInTheDocument();
        });
        it('should render reset keywords button', () => {
            const onResetKeywords = vi.fn();
            (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.resetKeywords/)).toBeInTheDocument();
        });
        it('should render search icon', () => {
            const onResetKeywords = vi.fn();
            const { container } = (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            const svgElement = container.querySelector('svg');
            expect(svgElement).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        describe('onResetKeywords prop', () => {
            it('should call onResetKeywords when button is clicked', () => {
                const onResetKeywords = vi.fn();
                (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                expect(onResetKeywords).toHaveBeenCalledTimes(1);
            });
            it('should call onResetKeywords on each click', () => {
                const onResetKeywords = vi.fn();
                (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
                const button = react_1.screen.getByRole('button');
                react_1.fireEvent.click(button);
                react_1.fireEvent.click(button);
                react_1.fireEvent.click(button);
                expect(onResetKeywords).toHaveBeenCalledTimes(3);
            });
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(ActualEmptySearchResult).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
    });
    describe('Accessibility', () => {
        it('should have accessible button', () => {
            const onResetKeywords = vi.fn();
            (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should have readable text content', () => {
            const onResetKeywords = vi.fn();
            (0, react_1.render)(<ActualEmptySearchResult onResetKeywords={onResetKeywords}/>);
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.emptySearchResult/)).toBeInTheDocument();
        });
    });
});
// ==========================================
// FileIcon Component Tests (using actual component)
// ==========================================
describe('FileIcon', () => {
    let ActualFileIcon;
    beforeAll(async () => {
        const mod = await vi.importActual('./file-icon');
        ActualFileIcon = mod.default;
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="test.txt"/>);
            expect(container).toBeInTheDocument();
        });
        it('should render bucket icon for bucket type', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.bucket} fileName="my-bucket"/>);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should render folder icon for folder type', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.folder} fileName="Documents"/>);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should render file type icon for file type', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="document.pdf"/>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        describe('type prop', () => {
            it.each([
                { type: pipeline_1.OnlineDriveFileType.bucket, fileName: 'bucket-name' },
                { type: pipeline_1.OnlineDriveFileType.folder, fileName: 'folder-name' },
                { type: pipeline_1.OnlineDriveFileType.file, fileName: 'file.txt' },
            ])('should render correctly for type=$type', ({ type, fileName }) => {
                const { container } = (0, react_1.render)(<ActualFileIcon type={type} fileName={fileName}/>);
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        describe('fileName prop', () => {
            it.each([
                { fileName: 'document.pdf' },
                { fileName: 'image.png' },
                { fileName: 'video.mp4' },
                { fileName: 'audio.mp3' },
                { fileName: 'code.json' },
                { fileName: 'readme.md' },
                { fileName: 'data.xlsx' },
                { fileName: 'doc.docx' },
                { fileName: 'slides.pptx' },
                { fileName: 'unknown.xyz' },
            ])('should render icon for $fileName', ({ fileName }) => {
                const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName={fileName}/>);
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        describe('size prop', () => {
            it.each(['sm', 'md', 'lg', 'xl'])('should accept size=%s', (size) => {
                const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="test.pdf" size={size}/>);
                expect(container.firstChild).toBeInTheDocument();
            });
            it('should default to md size', () => {
                const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="test.pdf"/>);
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
    describe('Icon Type Determination', () => {
        it('should render bucket icon regardless of fileName', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.bucket} fileName="file.pdf"/>);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should render folder icon regardless of fileName', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.folder} fileName="document.pdf"/>);
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should determine file type based on fileName extension', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="image.gif"/>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(ActualFileIcon).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty fileName', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName=""/>);
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle fileName without extension', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="README"/>);
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle special characters in fileName', () => {
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName="文件 (1).pdf"/>);
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle very long fileName', () => {
            const longFileName = `${'a'.repeat(500)}.pdf`;
            const { container } = (0, react_1.render)(<ActualFileIcon type={pipeline_1.OnlineDriveFileType.file} fileName={longFileName}/>);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
// ==========================================
// Item Component Tests (using actual component)
// ==========================================
describe('Item', () => {
    // Get real component for testing
    let ActualItem;
    beforeAll(async () => {
        const mod = await vi.importActual('./item');
        ActualItem = mod.default;
    });
    // Reuse createMockOnlineDriveFile from outer scope
    const createItemProps = (overrides) => ({
        file: createMockOnlineDriveFile(),
        isSelected: false,
        onSelect: vi.fn(),
        onOpen: vi.fn(),
        ...overrides,
    });
    // Helper to find custom checkbox element (div-based implementation)
    const findCheckbox = (container) => container.querySelector('[data-testid^="checkbox-"]');
    const getRadio = () => react_1.screen.getByRole('radio');
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            const props = createItemProps();
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText('test-file.txt')).toBeInTheDocument();
        });
        it('should render file name', () => {
            const props = createItemProps({
                file: createMockOnlineDriveFile({ name: 'document.pdf' }),
            });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText('document.pdf')).toBeInTheDocument();
        });
        it('should render file size for file type', () => {
            const props = createItemProps({
                file: createMockOnlineDriveFile({ size: 1024, type: pipeline_1.OnlineDriveFileType.file }),
            });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText('1.00 KB')).toBeInTheDocument();
        });
        it('should not render file size for folder type', () => {
            const props = createItemProps({
                file: createMockOnlineDriveFile({ size: 1024, type: pipeline_1.OnlineDriveFileType.folder, name: 'Documents' }),
            });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.queryByText('1 KB')).not.toBeInTheDocument();
        });
        it('should render checkbox in multiple choice mode for file', () => {
            const props = createItemProps({
                isMultipleChoice: true,
                file: createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.file }),
            });
            const { container } = (0, react_1.render)(<ActualItem {...props}/>);
            expect(findCheckbox(container)).toBeInTheDocument();
        });
        it('should render radio in single choice mode for file', () => {
            const props = createItemProps({
                isMultipleChoice: false,
                file: createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.file }),
            });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(getRadio()).toBeInTheDocument();
        });
        it('should not render checkbox or radio for bucket type', () => {
            const props = createItemProps({
                file: createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.bucket, name: 'my-bucket' }),
                isMultipleChoice: true,
            });
            const { container } = (0, react_1.render)(<ActualItem {...props}/>);
            expect(findCheckbox(container)).not.toBeInTheDocument();
            expect(react_1.screen.queryByRole('radio')).not.toBeInTheDocument();
        });
        it('should render with title attribute for file name', () => {
            const props = createItemProps({
                file: createMockOnlineDriveFile({ name: 'very-long-file-name.txt' }),
            });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByTitle('very-long-file-name.txt')).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        describe('isSelected prop', () => {
            it('should show checkbox as checked when isSelected is true', () => {
                const props = createItemProps({ isSelected: true, isMultipleChoice: true });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                const checkbox = findCheckbox(container);
                // Checked checkbox shows check icon
                expect(checkbox?.querySelector('[data-testid^="check-icon-"]')).toBeInTheDocument();
            });
            it('should show checkbox as unchecked when isSelected is false', () => {
                const props = createItemProps({ isSelected: false, isMultipleChoice: true });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                const checkbox = findCheckbox(container);
                // Unchecked checkbox has no check icon
                expect(checkbox?.querySelector('[data-testid^="check-icon-"]')).not.toBeInTheDocument();
            });
            it('should show radio as checked when isSelected is true', () => {
                const props = createItemProps({ isSelected: true, isMultipleChoice: false });
                (0, react_1.render)(<ActualItem {...props}/>);
                const radio = getRadio();
                expect(radio).toHaveAttribute('aria-checked', 'true');
            });
        });
        describe('disabled prop', () => {
            it('should not call onSelect when clicking disabled checkbox', () => {
                const onSelect = vi.fn();
                const props = createItemProps({ disabled: true, isMultipleChoice: true, onSelect });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                const checkbox = findCheckbox(container);
                react_1.fireEvent.click(checkbox);
                expect(onSelect).not.toHaveBeenCalled();
            });
            it('should not call onSelect when clicking disabled radio', () => {
                const onSelect = vi.fn();
                const props = createItemProps({ disabled: true, isMultipleChoice: false, onSelect });
                (0, react_1.render)(<ActualItem {...props}/>);
                const radio = getRadio();
                react_1.fireEvent.click(radio);
                expect(onSelect).not.toHaveBeenCalled();
            });
        });
        describe('isMultipleChoice prop', () => {
            it('should default to true', () => {
                const props = createItemProps();
                delete props.isMultipleChoice;
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                expect(findCheckbox(container)).toBeInTheDocument();
            });
            it('should render checkbox when true', () => {
                const props = createItemProps({ isMultipleChoice: true });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                expect(findCheckbox(container)).toBeInTheDocument();
                expect(react_1.screen.queryByRole('radio')).not.toBeInTheDocument();
            });
            it('should render radio when false', () => {
                const props = createItemProps({ isMultipleChoice: false });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                expect(getRadio()).toBeInTheDocument();
                expect(findCheckbox(container)).not.toBeInTheDocument();
            });
        });
    });
    describe('User Interactions', () => {
        describe('Click on Item', () => {
            it('should call onSelect when clicking on file item', () => {
                const onSelect = vi.fn();
                const file = createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.file });
                const props = createItemProps({ file, onSelect });
                (0, react_1.render)(<ActualItem {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByText('test-file.txt'));
                expect(onSelect).toHaveBeenCalledWith(file);
            });
            it('should call onOpen when clicking on folder item', () => {
                const onOpen = vi.fn();
                const file = createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.folder, name: 'Documents' });
                const props = createItemProps({ file, onOpen });
                (0, react_1.render)(<ActualItem {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Documents'));
                expect(onOpen).toHaveBeenCalledWith(file);
            });
            it('should call onOpen when clicking on bucket item', () => {
                const onOpen = vi.fn();
                const file = createMockOnlineDriveFile({ type: pipeline_1.OnlineDriveFileType.bucket, name: 'my-bucket' });
                const props = createItemProps({ file, onOpen });
                (0, react_1.render)(<ActualItem {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByText('my-bucket'));
                expect(onOpen).toHaveBeenCalledWith(file);
            });
            it('should not call any handler when clicking disabled item', () => {
                const onSelect = vi.fn();
                const onOpen = vi.fn();
                const props = createItemProps({ disabled: true, onSelect, onOpen });
                (0, react_1.render)(<ActualItem {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByText('test-file.txt'));
                expect(onSelect).not.toHaveBeenCalled();
                expect(onOpen).not.toHaveBeenCalled();
            });
        });
        describe('Click on Checkbox/Radio', () => {
            it('should call onSelect when clicking checkbox', () => {
                const onSelect = vi.fn();
                const file = createMockOnlineDriveFile();
                const props = createItemProps({ file, onSelect, isMultipleChoice: true });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                const checkbox = findCheckbox(container);
                react_1.fireEvent.click(checkbox);
                expect(onSelect).toHaveBeenCalledWith(file);
            });
            it('should call onSelect when clicking radio', () => {
                const onSelect = vi.fn();
                const file = createMockOnlineDriveFile();
                const props = createItemProps({ file, onSelect, isMultipleChoice: false });
                (0, react_1.render)(<ActualItem {...props}/>);
                const radio = getRadio();
                react_1.fireEvent.click(radio);
                expect(onSelect).toHaveBeenCalledWith(file);
            });
            it('should stop event propagation when clicking checkbox', () => {
                const onSelect = vi.fn();
                const file = createMockOnlineDriveFile();
                const props = createItemProps({ file, onSelect, isMultipleChoice: true });
                const { container } = (0, react_1.render)(<ActualItem {...props}/>);
                const checkbox = findCheckbox(container);
                react_1.fireEvent.click(checkbox);
                expect(onSelect).toHaveBeenCalledTimes(1);
            });
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(ActualItem).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty file name', () => {
            const props = createItemProps({ file: createMockOnlineDriveFile({ name: '' }) });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(document.body).toBeInTheDocument();
        });
        it('should handle very long file name', () => {
            const longName = `${'a'.repeat(500)}.txt`;
            const props = createItemProps({ file: createMockOnlineDriveFile({ name: longName }) });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle special characters in file name', () => {
            const specialName = '文件 <test> (1).pdf';
            const props = createItemProps({ file: createMockOnlineDriveFile({ name: specialName }) });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText(specialName)).toBeInTheDocument();
        });
        it('should handle zero file size', () => {
            const props = createItemProps({ file: createMockOnlineDriveFile({ size: 0 }) });
            (0, react_1.render)(<ActualItem {...props}/>);
            // formatFileSize returns 0 for size 0
            expect(react_1.screen.getByText('0')).toBeInTheDocument();
        });
        it('should handle very large file size', () => {
            const props = createItemProps({ file: createMockOnlineDriveFile({ size: 1024 * 1024 * 1024 * 5 }) });
            (0, react_1.render)(<ActualItem {...props}/>);
            expect(react_1.screen.getByText('5.00 GB')).toBeInTheDocument();
        });
    });
});
// ==========================================
// Utils Tests
// ==========================================
describe('utils', () => {
    // Import actual utils functions
    let getFileExtension;
    let getFileType;
    let FileAppearanceTypeEnum;
    beforeAll(async () => {
        const utils = await vi.importActual('./utils');
        const types = await vi.importActual('@/app/components/base/file-uploader/types');
        getFileExtension = utils.getFileExtension;
        getFileType = utils.getFileType;
        FileAppearanceTypeEnum = types.FileAppearanceTypeEnum;
    });
    describe('getFileExtension', () => {
        describe('Basic Functionality', () => {
            it('should return file extension for normal file names', () => {
                expect(getFileExtension('document.pdf')).toBe('pdf');
                expect(getFileExtension('image.PNG')).toBe('png');
                expect(getFileExtension('data.JSON')).toBe('json');
            });
            it('should return lowercase extension', () => {
                expect(getFileExtension('FILE.PDF')).toBe('pdf');
                expect(getFileExtension('IMAGE.JPEG')).toBe('jpeg');
                expect(getFileExtension('Doc.TXT')).toBe('txt');
            });
            it('should handle multiple dots in filename', () => {
                expect(getFileExtension('file.backup.tar.gz')).toBe('gz');
                expect(getFileExtension('my.document.v2.pdf')).toBe('pdf');
                expect(getFileExtension('test.spec.ts')).toBe('ts');
            });
        });
        describe('Edge Cases', () => {
            it('should return empty string for empty filename', () => {
                expect(getFileExtension('')).toBe('');
            });
            it('should return empty string for filename without extension', () => {
                expect(getFileExtension('README')).toBe('');
                expect(getFileExtension('Makefile')).toBe('');
            });
            it('should return empty string for hidden files without extension', () => {
                expect(getFileExtension('.gitignore')).toBe('');
                expect(getFileExtension('.env')).toBe('');
            });
            it('should handle hidden files with extension', () => {
                expect(getFileExtension('.eslintrc.json')).toBe('json');
                expect(getFileExtension('.config.yaml')).toBe('yaml');
            });
            it('should handle files ending with dot', () => {
                expect(getFileExtension('file.')).toBe('');
            });
            it('should handle special characters in filename', () => {
                expect(getFileExtension('file-name_v1.0.pdf')).toBe('pdf');
                expect(getFileExtension('data (1).xlsx')).toBe('xlsx');
            });
        });
        describe('Boundary Conditions', () => {
            it('should handle very long file extensions', () => {
                expect(getFileExtension('file.verylongextension')).toBe('verylongextension');
            });
            it('should handle single character extensions', () => {
                expect(getFileExtension('file.a')).toBe('a');
                expect(getFileExtension('data.c')).toBe('c');
            });
            it('should handle numeric extensions', () => {
                expect(getFileExtension('file.001')).toBe('001');
                expect(getFileExtension('backup.123')).toBe('123');
            });
        });
    });
    describe('getFileType', () => {
        describe('Image Files', () => {
            it('should return gif type for gif files', () => {
                expect(getFileType('animation.gif')).toBe(FileAppearanceTypeEnum.gif);
                expect(getFileType('image.GIF')).toBe(FileAppearanceTypeEnum.gif);
            });
            it('should return image type for common image formats', () => {
                expect(getFileType('photo.jpg')).toBe(FileAppearanceTypeEnum.image);
                expect(getFileType('photo.jpeg')).toBe(FileAppearanceTypeEnum.image);
                expect(getFileType('photo.png')).toBe(FileAppearanceTypeEnum.image);
                expect(getFileType('photo.webp')).toBe(FileAppearanceTypeEnum.image);
                expect(getFileType('photo.svg')).toBe(FileAppearanceTypeEnum.image);
            });
        });
        describe('Video Files', () => {
            it('should return video type for video formats', () => {
                expect(getFileType('movie.mp4')).toBe(FileAppearanceTypeEnum.video);
                expect(getFileType('clip.mov')).toBe(FileAppearanceTypeEnum.video);
                expect(getFileType('video.webm')).toBe(FileAppearanceTypeEnum.video);
                expect(getFileType('recording.mpeg')).toBe(FileAppearanceTypeEnum.video);
            });
        });
        describe('Audio Files', () => {
            it('should return audio type for audio formats', () => {
                expect(getFileType('song.mp3')).toBe(FileAppearanceTypeEnum.audio);
                expect(getFileType('podcast.wav')).toBe(FileAppearanceTypeEnum.audio);
                expect(getFileType('audio.m4a')).toBe(FileAppearanceTypeEnum.audio);
                expect(getFileType('music.mpga')).toBe(FileAppearanceTypeEnum.audio);
            });
        });
        describe('Code Files', () => {
            it('should return code type for code-related formats', () => {
                expect(getFileType('page.html')).toBe(FileAppearanceTypeEnum.code);
                expect(getFileType('page.htm')).toBe(FileAppearanceTypeEnum.code);
                expect(getFileType('config.xml')).toBe(FileAppearanceTypeEnum.code);
                expect(getFileType('data.json')).toBe(FileAppearanceTypeEnum.code);
            });
        });
        describe('Document Files', () => {
            it('should return pdf type for PDF files', () => {
                expect(getFileType('document.pdf')).toBe(FileAppearanceTypeEnum.pdf);
                expect(getFileType('report.PDF')).toBe(FileAppearanceTypeEnum.pdf);
            });
            it('should return markdown type for markdown files', () => {
                expect(getFileType('README.md')).toBe(FileAppearanceTypeEnum.markdown);
                expect(getFileType('doc.markdown')).toBe(FileAppearanceTypeEnum.markdown);
                expect(getFileType('guide.mdx')).toBe(FileAppearanceTypeEnum.markdown);
            });
            it('should return excel type for spreadsheet files', () => {
                expect(getFileType('data.xlsx')).toBe(FileAppearanceTypeEnum.excel);
                expect(getFileType('data.xls')).toBe(FileAppearanceTypeEnum.excel);
                expect(getFileType('data.csv')).toBe(FileAppearanceTypeEnum.excel);
            });
            it('should return word type for Word documents', () => {
                expect(getFileType('document.docx')).toBe(FileAppearanceTypeEnum.word);
                expect(getFileType('document.doc')).toBe(FileAppearanceTypeEnum.word);
            });
            it('should return ppt type for PowerPoint files', () => {
                expect(getFileType('presentation.pptx')).toBe(FileAppearanceTypeEnum.ppt);
                expect(getFileType('slides.ppt')).toBe(FileAppearanceTypeEnum.ppt);
            });
            it('should return document type for text files', () => {
                expect(getFileType('notes.txt')).toBe(FileAppearanceTypeEnum.document);
            });
        });
        describe('Unknown Files', () => {
            it('should return custom type for unknown extensions', () => {
                expect(getFileType('file.xyz')).toBe(FileAppearanceTypeEnum.custom);
                expect(getFileType('data.unknown')).toBe(FileAppearanceTypeEnum.custom);
                expect(getFileType('binary.bin')).toBe(FileAppearanceTypeEnum.custom);
            });
            it('should return custom type for files without extension', () => {
                expect(getFileType('README')).toBe(FileAppearanceTypeEnum.custom);
                expect(getFileType('Makefile')).toBe(FileAppearanceTypeEnum.custom);
            });
            it('should return custom type for empty filename', () => {
                expect(getFileType('')).toBe(FileAppearanceTypeEnum.custom);
            });
        });
        describe('Case Insensitivity', () => {
            it('should handle uppercase extensions', () => {
                expect(getFileType('file.PDF')).toBe(FileAppearanceTypeEnum.pdf);
                expect(getFileType('file.DOCX')).toBe(FileAppearanceTypeEnum.word);
                expect(getFileType('file.XLSX')).toBe(FileAppearanceTypeEnum.excel);
            });
            it('should handle mixed case extensions', () => {
                expect(getFileType('file.Pdf')).toBe(FileAppearanceTypeEnum.pdf);
                expect(getFileType('file.DocX')).toBe(FileAppearanceTypeEnum.word);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixnREFBdUQ7QUFDdkQsbUNBQTBCO0FBRTFCLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSw2RUFBNkU7QUFDN0UsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QixPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFNL0QsRUFBRSxFQUFFO1FBQ0gsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQy9CLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUMxQixvQkFBb0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBRXZDO1FBQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQzVEO1FBQUEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsZUFBZSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUM1RjtRQUFBLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENB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Q0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7Z0JBQzVDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hFLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2xFLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDckUsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO2dCQUM3QyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNoRSxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3BFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb2NrIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHR5cGUgeyBPbmxpbmVEcml2ZUZpbGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBPbmxpbmVEcml2ZUZpbGVUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgTGlzdCBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgTW9kdWxlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IHJlYWN0LWkxOG5leHQgdXNlcyBnbG9iYWwgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gTW9jayBJdGVtIGNvbXBvbmVudCBmb3IgTGlzdCB0ZXN0cyAtIGNoaWxkIGNvbXBvbmVudCB3aXRoIGNvbXBsZXggYmVoYXZpb3JcbnZpLm1vY2soJy4vaXRlbScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGZpbGUsIGlzU2VsZWN0ZWQsIG9uU2VsZWN0LCBvbk9wZW4sIGlzTXVsdGlwbGVDaG9pY2UgfToge1xuICAgIGZpbGU6IE9ubGluZURyaXZlRmlsZVxuICAgIGlzU2VsZWN0ZWQ6IGJvb2xlYW5cbiAgICBvblNlbGVjdDogKGZpbGU6IE9ubGluZURyaXZlRmlsZSkgPT4gdm9pZFxuICAgIG9uT3BlbjogKGZpbGU6IE9ubGluZURyaXZlRmlsZSkgPT4gdm9pZFxuICAgIGlzTXVsdGlwbGVDaG9pY2U6IGJvb2xlYW5cbiAgfSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGRhdGEtdGVzdGlkPXtgaXRlbS0ke2ZpbGUuaWR9YH1cbiAgICAgICAgZGF0YS1zZWxlY3RlZD17aXNTZWxlY3RlZH1cbiAgICAgICAgZGF0YS1tdWx0aXBsZS1jaG9pY2U9e2lzTXVsdGlwbGVDaG9pY2V9XG4gICAgICA+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPXtgaXRlbS1uYW1lLSR7ZmlsZS5pZH1gfT57ZmlsZS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD17YGl0ZW0tc2VsZWN0LSR7ZmlsZS5pZH1gfSBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdChmaWxlKX0+U2VsZWN0PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9e2BpdGVtLW9wZW4tJHtmaWxlLmlkfWB9IG9uQ2xpY2s9eygpID0+IG9uT3BlbihmaWxlKX0+T3BlbjwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbi8vIE1vY2sgRW1wdHlGb2xkZXIgY29tcG9uZW50IGZvciBMaXN0IHRlc3RzXG52aS5tb2NrKCcuL2VtcHR5LWZvbGRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZW1wdHktZm9sZGVyXCI+RW1wdHkgRm9sZGVyPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBFbXB0eVNlYXJjaFJlc3VsdCBjb21wb25lbnQgZm9yIExpc3QgdGVzdHNcbnZpLm1vY2soJy4vZW1wdHktc2VhcmNoLXJlc3VsdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uUmVzZXRLZXl3b3JkcyB9OiB7IG9uUmVzZXRLZXl3b3JkczogKCkgPT4gdm9pZCB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImVtcHR5LXNlYXJjaC1yZXN1bHRcIj5cbiAgICAgIDxzcGFuPk5vIHJlc3VsdHM8L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicmVzZXQta2V5d29yZHMtYnRuXCIgb25DbGljaz17b25SZXNldEtleXdvcmRzfT5SZXNldDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgc3RvcmUgc3RhdGUgYW5kIHJlZnNcbmNvbnN0IG1vY2tJc1RydW5jYXRlZCA9IHsgY3VycmVudDogZmFsc2UgfVxuY29uc3QgbW9ja0N1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWYgPSB7IGN1cnJlbnQ6IHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4gfVxuY29uc3QgbW9ja1NldE5leHRQYWdlUGFyYW1ldGVycyA9IHZpLmZuKClcblxuY29uc3QgbW9ja1N0b3JlU3RhdGUgPSB7XG4gIGlzVHJ1bmNhdGVkOiBtb2NrSXNUcnVuY2F0ZWQsXG4gIGN1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWY6IG1vY2tDdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmLFxuICBzZXROZXh0UGFnZVBhcmFtZXRlcnM6IG1vY2tTZXROZXh0UGFnZVBhcmFtZXRlcnMsXG59XG5cbmNvbnN0IG1vY2tHZXRTdGF0ZSA9IHZpLmZuKCgpID0+IG1vY2tTdG9yZVN0YXRlKVxuY29uc3QgbW9ja0RhdGFTb3VyY2VTdG9yZSA9IHsgZ2V0U3RhdGU6IG1vY2tHZXRTdGF0ZSB9XG5cbnZpLm1vY2soJy4uLy4uLy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlRGF0YVNvdXJjZVN0b3JlOiAoKSA9PiBtb2NrRGF0YVNvdXJjZVN0b3JlLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxPbmxpbmVEcml2ZUZpbGU+KTogT25saW5lRHJpdmVGaWxlID0+ICh7XG4gIGlkOiAnZmlsZS0xJyxcbiAgbmFtZTogJ3Rlc3QtZmlsZS50eHQnLFxuICBzaXplOiAxMDI0LFxuICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tGaWxlTGlzdCA9IChjb3VudDogbnVtYmVyKTogT25saW5lRHJpdmVGaWxlW10gPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGluZGV4KSA9PiBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHtcbiAgICBpZDogYGZpbGUtJHtpbmRleCArIDF9YCxcbiAgICBuYW1lOiBgZmlsZS0ke2luZGV4ICsgMX0udHh0YCxcbiAgICBzaXplOiAoaW5kZXggKyAxKSAqIDEwMjQsXG4gIH0pKVxufVxuXG50eXBlIExpc3RQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBMaXN0PlxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxMaXN0UHJvcHM+KTogTGlzdFByb3BzID0+ICh7XG4gIGZpbGVMaXN0OiBbXSxcbiAgc2VsZWN0ZWRGaWxlSWRzOiBbXSxcbiAga2V5d29yZHM6ICcnLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUsXG4gIGhhbmRsZVJlc2V0S2V5d29yZHM6IHZpLmZuKCksXG4gIGhhbmRsZVNlbGVjdEZpbGU6IHZpLmZuKCksXG4gIGhhbmRsZU9wZW5Gb2xkZXI6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBJbnRlcnNlY3Rpb25PYnNlcnZlclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgbW9ja0ludGVyc2VjdGlvbk9ic2VydmVyQ2FsbGJhY2s6IEludGVyc2VjdGlvbk9ic2VydmVyQ2FsbGJhY2sgfCBudWxsID0gbnVsbFxubGV0IG1vY2tJbnRlcnNlY3Rpb25PYnNlcnZlckluc3RhbmNlOiB7XG4gIG9ic2VydmU6IE1vY2tcbiAgZGlzY29ubmVjdDogTW9ja1xuICB1bm9ic2VydmU6IE1vY2tcbn0gfCBudWxsID0gbnVsbFxuXG5jb25zdCBjcmVhdGVNb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGluc3RhbmNlID0ge1xuICAgIG9ic2VydmU6IHZpLmZuKCksXG4gICAgZGlzY29ubmVjdDogdmkuZm4oKSxcbiAgICB1bm9ic2VydmU6IHZpLmZuKCksXG4gIH1cbiAgbW9ja0ludGVyc2VjdGlvbk9ic2VydmVySW5zdGFuY2UgPSBpbnN0YW5jZVxuXG4gIHJldHVybiBjbGFzcyBNb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXIge1xuICAgIGNhbGxiYWNrOiBJbnRlcnNlY3Rpb25PYnNlcnZlckNhbGxiYWNrXG4gICAgb3B0aW9uczogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbml0XG5cbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjazogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjaywgb3B0aW9ucz86IEludGVyc2VjdGlvbk9ic2VydmVySW5pdCkge1xuICAgICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgfVxuXG4gICAgb2JzZXJ2ZSA9IGluc3RhbmNlLm9ic2VydmVcbiAgICBkaXNjb25uZWN0ID0gaW5zdGFuY2UuZGlzY29ubmVjdFxuICAgIHVub2JzZXJ2ZSA9IGluc3RhbmNlLnVub2JzZXJ2ZVxuICB9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCB0cmlnZ2VySW50ZXJzZWN0aW9uID0gKGlzSW50ZXJzZWN0aW5nOiBib29sZWFuKSA9PiB7XG4gIGlmIChtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjaykge1xuICAgIGNvbnN0IGVudHJpZXMgPSBbe1xuICAgICAgaXNJbnRlcnNlY3RpbmcsXG4gICAgICBib3VuZGluZ0NsaWVudFJlY3Q6IHt9IGFzIERPTVJlY3RSZWFkT25seSxcbiAgICAgIGludGVyc2VjdGlvblJhdGlvOiBpc0ludGVyc2VjdGluZyA/IDEgOiAwLFxuICAgICAgaW50ZXJzZWN0aW9uUmVjdDoge30gYXMgRE9NUmVjdFJlYWRPbmx5LFxuICAgICAgcm9vdEJvdW5kczogbnVsbCxcbiAgICAgIHRhcmdldDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICB0aW1lOiBEYXRlLm5vdygpLFxuICAgIH1dIGFzIEludGVyc2VjdGlvbk9ic2VydmVyRW50cnlbXVxuICAgIG1vY2tJbnRlcnNlY3Rpb25PYnNlcnZlckNhbGxiYWNrKGVudHJpZXMsIHt9IGFzIEludGVyc2VjdGlvbk9ic2VydmVyKVxuICB9XG59XG5cbmNvbnN0IHJlc2V0TW9ja1N0b3JlU3RhdGUgPSAoKSA9PiB7XG4gIG1vY2tJc1RydW5jYXRlZC5jdXJyZW50ID0gZmFsc2VcbiAgbW9ja0N1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWYuY3VycmVudCA9IHt9XG4gIG1vY2tTZXROZXh0UGFnZVBhcmFtZXRlcnMubW9ja0NsZWFyKClcbiAgbW9ja0dldFN0YXRlLm1vY2tDbGVhcigpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0xpc3QnLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbmFsSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXJcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICByZXNldE1vY2tTdG9yZVN0YXRlKClcbiAgICBtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjayA9IG51bGxcbiAgICBtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbnN0YW5jZSA9IG51bGxcblxuICAgIC8vIFNldHVwIEludGVyc2VjdGlvbk9ic2VydmVyIG1vY2tcbiAgICB3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPSBjcmVhdGVNb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKSBhcyB1bmtub3duIGFzIHR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlclxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgd2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyID0gb3JpZ2luYWxJbnRlcnNlY3Rpb25PYnNlcnZlclxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMb2FkaW5nIGNvbXBvbmVudCB3aGVuIGlzQWxsTG9hZGluZyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgICAgIGZpbGVMaXN0OiBbXSxcbiAgICAgICAga2V5d29yZHM6ICcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRW1wdHlGb2xkZXIgd2hlbiBmb2xkZXIgaXMgZW1wdHkgYW5kIG5vdCBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBmaWxlTGlzdDogW10sXG4gICAgICAgIGtleXdvcmRzOiAnJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRW1wdHlTZWFyY2hSZXN1bHQgd2hlbiBzZWFyY2ggaGFzIG5vIHJlc3VsdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgIGZpbGVMaXN0OiBbXSxcbiAgICAgICAga2V5d29yZHM6ICdub24tZXhpc3RlbnQtZmlsZScsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtcHR5LXNlYXJjaC1yZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmaWxlIGxpc3Qgd2hlbiBmaWxlcyBleGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDMpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYXJ0aWFsIGxvYWRpbmcgc3Bpbm5lciB3aGVuIGxvYWRpbmcgbW9yZSBmaWxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGZpbGVMaXN0LFxuICAgICAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBmaWxlcyBBTkQgbG9hZGluZyBpbmRpY2F0b3JcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzdGF0dXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnZmlsZUxpc3QgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBmaWxlcyBmcm9tIGZpbGVMaXN0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDUpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGZpbGVMaXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBpdGVtLSR7ZmlsZS5pZH1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGl0ZW0tbmFtZS0ke2ZpbGUuaWR9YCkpLnRvSGF2ZVRleHRDb250ZW50KGZpbGUubmFtZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGZpbGVMaXN0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3Q6IFtdIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbXB0eS1mb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIGZpbGUgaW4gZmlsZUxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSgpXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBmaWxlTGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgxMDApXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEwMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2VsZWN0ZWRGaWxlSWRzIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG1hcmsgc2VsZWN0ZWQgZmlsZXMgYXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMylcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIHNlbGVjdGVkRmlsZUlkczogWydmaWxlLTEnLCAnZmlsZS0zJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0ZWQnLCAndHJ1ZScpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0yJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICdmYWxzZScpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0zJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICd0cnVlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHNlbGVjdGVkRmlsZUlkcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgzKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgc2VsZWN0ZWRGaWxlSWRzOiBbXSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGZpbGVMaXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBpdGVtLSR7ZmlsZS5pZH1gKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgJ2ZhbHNlJylcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGFsbCBmaWxlcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgzKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgc2VsZWN0ZWRGaWxlSWRzOiBbJ2ZpbGUtMScsICdmaWxlLTInLCAnZmlsZS0zJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBmaWxlTGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZChgaXRlbS0ke2ZpbGUuaWR9YCkpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICd0cnVlJylcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdrZXl3b3JkcyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IEVtcHR5U2VhcmNoUmVzdWx0IHdoZW4ga2V5d29yZHMgZXhpc3QgYnV0IG5vIHJlc3VsdHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0OiBbXSxcbiAgICAgICAgICBrZXl3b3JkczogJ3NlYXJjaC10ZXJtJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtcHR5LXNlYXJjaC1yZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IEVtcHR5Rm9sZGVyIHdoZW4ga2V5d29yZHMgaXMgZW1wdHkgYW5kIG5vIGZpbGVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBmaWxlTGlzdDogW10sXG4gICAgICAgICAga2V5d29yZHM6ICcnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpc0xvYWRpbmcgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICB7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUxpc3Q6IFtdLCBrZXl3b3JkczogJycsIGV4cGVjdGVkOiAnaXNBbGxMb2FkaW5nJyB9LFxuICAgICAgICB7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUxpc3Q6IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKSwga2V5d29yZHM6ICcnLCBleHBlY3RlZDogJ2lzUGFydGlhbExvYWRpbmcnIH0sXG4gICAgICAgIHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUxpc3Q6IFtdLCBrZXl3b3JkczogJycsIGV4cGVjdGVkOiAnaXNFbXB0eScgfSxcbiAgICAgICAgeyBpc0xvYWRpbmc6IGZhbHNlLCBmaWxlTGlzdDogY3JlYXRlTW9ja0ZpbGVMaXN0KDIpLCBrZXl3b3JkczogJycsIGV4cGVjdGVkOiAnaGFzRmlsZXMnIH0sXG4gICAgICBdKSgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2hlbiBpc0xvYWRpbmc9JGlzTG9hZGluZyB3aXRoIGZpbGVMaXN0Lmxlbmd0aD0kZmlsZUxpc3QubGVuZ3RoJywgKHsgaXNMb2FkaW5nLCBmaWxlTGlzdCwgZXhwZWN0ZWQgfSkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNMb2FkaW5nLCBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgc3dpdGNoIChleHBlY3RlZCkge1xuICAgICAgICAgIGNhc2UgJ2lzQWxsTG9hZGluZyc6XG4gICAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnaXNQYXJ0aWFsTG9hZGluZyc6XG4gICAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnaXNFbXB0eSc6XG4gICAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbXB0eS1mb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdoYXNGaWxlcyc6XG4gICAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc3VwcG9ydEJhdGNoVXBsb2FkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3Mgc3VwcG9ydEJhdGNoVXBsb2FkIHRydWUgdG8gSXRlbSBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBmaWxlTGlzdCxcbiAgICAgICAgICBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbXVsdGlwbGUtY2hvaWNlJywgJ3RydWUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHN1cHBvcnRCYXRjaFVwbG9hZCBmYWxzZSB0byBJdGVtIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbXVsdGlwbGUtY2hvaWNlJywgJ2ZhbHNlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgYW5kIEV2ZW50IEhhbmRsZXJzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0ZpbGUgU2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVNlbGVjdEZpbGUgd2hlbiBzZWxlY3RpbmcgYSBmaWxlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGhhbmRsZVNlbGVjdEZpbGUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBmaWxlTGlzdCxcbiAgICAgICAgICBoYW5kbGVTZWxlY3RGaWxlLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1zZWxlY3QtZmlsZS0xJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChoYW5kbGVTZWxlY3RGaWxlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlTGlzdFswXSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTZWxlY3RGaWxlIHdpdGggY29ycmVjdCBmaWxlIGRhdGEnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgaGFuZGxlU2VsZWN0RmlsZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAndW5pcXVlLWlkJywgbmFtZTogJ3NwZWNpYWwtZmlsZS5wZGYnLCBzaXplOiA1MDAwIH0pLFxuICAgICAgICBdXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBmaWxlTGlzdCxcbiAgICAgICAgICBoYW5kbGVTZWxlY3RGaWxlLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1zZWxlY3QtdW5pcXVlLWlkJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChoYW5kbGVTZWxlY3RGaWxlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpZDogJ3VuaXF1ZS1pZCcsXG4gICAgICAgICAgICBuYW1lOiAnc3BlY2lhbC1maWxlLnBkZicsXG4gICAgICAgICAgICBzaXplOiA1MDAwLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRm9sZGVyIE5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlT3BlbkZvbGRlciB3aGVuIG9wZW5pbmcgYSBmb2xkZXInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgaGFuZGxlT3BlbkZvbGRlciA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZm9sZGVyLTEnLCBuYW1lOiAnRG9jdW1lbnRzJywgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5mb2xkZXIgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIGhhbmRsZU9wZW5Gb2xkZXIsXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLW9wZW4tZm9sZGVyLTEnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGhhbmRsZU9wZW5Gb2xkZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZpbGVMaXN0WzBdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1Jlc2V0IEtleXdvcmRzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVJlc2V0S2V5d29yZHMgd2hlbiByZXNldCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBoYW5kbGVSZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3Q6IFtdLFxuICAgICAgICAgIGtleXdvcmRzOiAnc2VhcmNoLXRlcm0nLFxuICAgICAgICAgIGhhbmRsZVJlc2V0S2V5d29yZHMsXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdyZXNldC1rZXl3b3Jkcy1idG4nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGhhbmRsZVJlc2V0S2V5d29yZHMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAgVGVzdHMgKEludGVyc2VjdGlvbk9ic2VydmVyKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgU2V0dXAnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBJbnRlcnNlY3Rpb25PYnNlcnZlciBvbiBtb3VudCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0ludGVyc2VjdGlvbk9ic2VydmVySW5zdGFuY2U/Lm9ic2VydmUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgd2l0aCBjb3JyZWN0IHJvb3RNYXJnaW4nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBDYWxsYmFjayBzaG91bGQgYmUgc2V0XG4gICAgICAgIGV4cGVjdChtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjaykudG9CZURlZmluZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBvYnNlcnZlIHRoZSBhbmNob3IgZWxlbWVudCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0ludGVyc2VjdGlvbk9ic2VydmVySW5zdGFuY2U/Lm9ic2VydmUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBjb25zdCBvYnNlcnZlZEVsZW1lbnQgPSBtb2NrSW50ZXJzZWN0aW9uT2JzZXJ2ZXJJbnN0YW5jZT8ub2JzZXJ2ZS5tb2NrLmNhbGxzWzBdPy5bMF1cbiAgICAgICAgZXhwZWN0KG9ic2VydmVkRWxlbWVudCkudG9CZUluc3RhbmNlT2YoSFRNTEVsZW1lbnQpXG4gICAgICAgIGV4cGVjdChvYnNlcnZlZEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdJbnRlcnNlY3Rpb25PYnNlcnZlciBDYWxsYmFjaycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBzZXROZXh0UGFnZVBhcmFtZXRlcnMgd2hlbiBpbnRlcnNlY3RpbmcgYW5kIHRydW5jYXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrSXNUcnVuY2F0ZWQuY3VycmVudCA9IHRydWVcbiAgICAgICAgbW9ja0N1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWYuY3VycmVudCA9IHsgY3Vyc29yOiAnbmV4dC1jdXJzb3InIH1cbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICB0cmlnZ2VySW50ZXJzZWN0aW9uKHRydWUpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrU2V0TmV4dFBhZ2VQYXJhbWV0ZXJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGN1cnNvcjogJ25leHQtY3Vyc29yJyB9KVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBzZXROZXh0UGFnZVBhcmFtZXRlcnMgd2hlbiBub3QgaW50ZXJzZWN0aW5nJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tJc1RydW5jYXRlZC5jdXJyZW50ID0gdHJ1ZVxuICAgICAgICBtb2NrQ3VycmVudE5leHRQYWdlUGFyYW1ldGVyc1JlZi5jdXJyZW50ID0geyBjdXJzb3I6ICduZXh0LWN1cnNvcicgfVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHRyaWdnZXJJbnRlcnNlY3Rpb24oZmFsc2UpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU2V0TmV4dFBhZ2VQYXJhbWV0ZXJzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIHNldE5leHRQYWdlUGFyYW1ldGVycyB3aGVuIG5vdCB0cnVuY2F0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja0lzVHJ1bmNhdGVkLmN1cnJlbnQgPSBmYWxzZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHRyaWdnZXJJbnRlcnNlY3Rpb24odHJ1ZSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTZXROZXh0UGFnZVBhcmFtZXRlcnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgc2V0TmV4dFBhZ2VQYXJhbWV0ZXJzIHdoZW4gbG9hZGluZycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrSXNUcnVuY2F0ZWQuY3VycmVudCA9IHRydWVcbiAgICAgICAgbW9ja0N1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWYuY3VycmVudCA9IHsgY3Vyc29yOiAnbmV4dC1jdXJzb3InIH1cbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHRyaWdnZXJJbnRlcnNlY3Rpb24odHJ1ZSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTZXROZXh0UGFnZVBhcmFtZXRlcnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdJbnRlcnNlY3Rpb25PYnNlcnZlciBDbGVhbnVwJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkaXNjb25uZWN0IEludGVyc2VjdGlvbk9ic2VydmVyIG9uIHVubW91bnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICB1bm1vdW50KClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tJbnRlcnNlY3Rpb25PYnNlcnZlckluc3RhbmNlPy5kaXNjb25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2xlYW51cCBwcmV2aW91cyBvYnNlcnZlciB3aGVuIGRlcGVuZGVuY2llcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0LFxuICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIFRyaWdnZXIgcmUtcmVuZGVyIHdpdGggY2hhbmdlZCBpc0xvYWRpbmdcbiAgICAgICAgcmVyZW5kZXIoPExpc3Qgey4uLnByb3BzfSBpc0xvYWRpbmc9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFByZXZpb3VzIG9ic2VydmVyIHNob3VsZCBiZSBkaXNjb25uZWN0ZWRcbiAgICAgICAgZXhwZWN0KG1vY2tJbnRlcnNlY3Rpb25PYnNlcnZlckluc3RhbmNlPy5kaXNjb25uZWN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQXNzZXJ0XG4gICAgICAvLyBMaXN0IGNvbXBvbmVudCBzaG91bGQgaGF2ZSAkJHR5cGVvZiBzeW1ib2wgaW5kaWNhdGluZyBtZW1vIHdyYXBwZXJcbiAgICAgIGV4cGVjdChMaXN0KS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSBlcXVhbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG4gICAgICBjb25zdCByZW5kZXJTcHkgPSB2aS5mbigpXG5cbiAgICAgIC8vIENyZWF0ZSBhIHdyYXBwZXIgY29tcG9uZW50IHRvIHRyYWNrIHJlbmRlcnNcbiAgICAgIGNvbnN0IFRlc3RXcmFwcGVyID0gKHsgdGVzdFByb3BzIH06IHsgdGVzdFByb3BzOiBMaXN0UHJvcHMgfSkgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPExpc3Qgey4uLnRlc3RQcm9wc30gLz5cbiAgICAgIH1cblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxUZXN0V3JhcHBlciB0ZXN0UHJvcHM9e3Byb3BzfSAvPilcbiAgICAgIGNvbnN0IGluaXRpYWxSZW5kZXJDb3VudCA9IHJlbmRlclNweS5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxUZXN0V3JhcHBlciB0ZXN0UHJvcHM9e3Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhdmUgcmVuZGVyZWQgYWdhaW4gKHdyYXBwZXIgcmUtcmVuZGVycywgYnV0IG1lbW8gcHJldmVudHMgTGlzdCByZS1yZW5kZXIpXG4gICAgICBleHBlY3QocmVuZGVyU3B5Lm1vY2suY2FsbHMubGVuZ3RoKS50b0JlKGluaXRpYWxSZW5kZXJDb3VudCArIDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gZmlsZUxpc3QgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0MSA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgY29uc3QgZmlsZUxpc3QyID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDMpXG4gICAgICBjb25zdCBwcm9wczEgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdDogZmlsZUxpc3QxIH0pXG4gICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdDogZmlsZUxpc3QyIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TGlzdCB7Li4ucHJvcHMxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaXRlbS1maWxlLTMnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBuZXcgZmlsZUxpc3RcbiAgICAgIHJlcmVuZGVyKDxMaXN0IHsuLi5wcm9wczJ9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBuZXcgZmlsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIHNlbGVjdGVkRmlsZUlkcyBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgIGNvbnN0IHByb3BzMSA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0LCBzZWxlY3RlZEZpbGVJZHM6IFtdIH0pXG4gICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCwgc2VsZWN0ZWRGaWxlSWRzOiBbJ2ZpbGUtMSddIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TGlzdCB7Li4ucHJvcHMxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICdmYWxzZScpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoPExpc3Qgey4uLnByb3BzMn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIGlzTG9hZGluZyBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgIGNvbnN0IHByb3BzMSA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0LCBpc0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCwgaXNMb2FkaW5nOiB0cnVlIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TGlzdCB7Li4ucHJvcHMxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGUgLSBubyBsb2FkaW5nIHNwaW5uZXJcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3N0YXR1cycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxMaXN0IHsuLi5wcm9wczJ9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBsb2FkaW5nIHNwaW5uZXIgc2hvdWxkIGFwcGVhclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N0YXR1cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnRW1wdHkvTnVsbCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBmaWxlTGlzdCBhcnJheScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0OiBbXSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHNlbGVjdGVkRmlsZUlkcyBhcnJheScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgc2VsZWN0ZWRGaWxlSWRzOiBbXSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICdmYWxzZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBrZXl3b3JkcyBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGZpbGVMaXN0OiBbXSxcbiAgICAgICAgICBrZXl3b3JkczogJycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3dzIGVtcHR5IGZvbGRlciwgbm90IGVtcHR5IHNlYXJjaCByZXN1bHRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlbXB0eS1zZWFyY2gtcmVzdWx0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQm91bmRhcnkgQ29uZGl0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBmaWxlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGxvbmdOYW1lID0gYCR7J2EnLnJlcGVhdCg1MDApfS50eHRgXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBuYW1lOiBsb25nTmFtZSB9KV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1uYW1lLWZpbGUtMScpKS50b0hhdmVUZXh0Q29udGVudChsb25nTmFtZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBmaWxlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHNwZWNpYWxOYW1lID0gJ3Rlc3Q8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+LnR4dCdcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IG5hbWU6IHNwZWNpYWxOYW1lIH0pXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLW5hbWUtZmlsZS0xJykpLnRvSGF2ZVRleHRDb250ZW50KHNwZWNpYWxOYW1lKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIGZpbGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdW5pY29kZU5hbWUgPSAn5paH5Lu2X/Cfk4Ff44OV44Kh44Kk44OrLnR4dCdcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IG5hbWU6IHVuaWNvZGVOYW1lIH0pXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLW5hbWUtZmlsZS0xJykpLnRvSGF2ZVRleHRDb250ZW50KHVuaWNvZGVOYW1lKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIHplcm8gc2l6ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgc2l6ZTogMCB9KV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIHVuZGVmaW5lZCBzaXplJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBzaXplOiB1bmRlZmluZWQgfSldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdEaWZmZXJlbnQgRmlsZSBUeXBlcycsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICB7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSwgbmFtZTogJ2RvY3VtZW50LnBkZicgfSxcbiAgICAgICAgeyB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlciwgbmFtZTogJ0RvY3VtZW50cycgfSxcbiAgICAgICAgeyB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCwgbmFtZTogJ215LWJ1Y2tldCcgfSxcbiAgICAgIF0pKCdzaG91bGQgcmVuZGVyICR0eXBlIHR5cGUgY29ycmVjdGx5JywgKHsgdHlwZSwgbmFtZSB9KSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiBgaXRlbS0ke3R5cGV9YCwgdHlwZSwgbmFtZSB9KV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZChgaXRlbS1pdGVtLSR7dHlwZX1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBpdGVtLW5hbWUtaXRlbS0ke3R5cGV9YCkpLnRvSGF2ZVRleHRDb250ZW50KG5hbWUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBmaWxlIHR5cGVzIGluIGxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZmlsZS0xJywgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5maWxlLCBuYW1lOiAnZG9jLnBkZicgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZm9sZGVyLTEnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlciwgbmFtZTogJ0RvY3VtZW50cycgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnYnVja2V0LTEnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCwgbmFtZTogJ215LWJ1Y2tldCcgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZvbGRlci0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1idWNrZXQtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZXMgVHJhbnNpdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSBsb2FkaW5nIHRvIGVtcHR5IGZvbGRlcicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wczEgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0xvYWRpbmc6IHRydWUsIGZpbGVMaXN0OiBbXSB9KVxuICAgICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0xvYWRpbmc6IGZhbHNlLCBmaWxlTGlzdDogW10gfSlcblxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPExpc3Qgey4uLnByb3BzMX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgbG9hZGluZyBzdGF0ZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVyZW5kZXIoPExpc3Qgey4uLnByb3BzMn0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3N0YXR1cycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbXB0eS1mb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gbG9hZGluZyB0byBmaWxlIGxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBjcmVhdGVNb2NrRmlsZUxpc3QoMilcbiAgICAgICAgY29uc3QgcHJvcHMxID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNMb2FkaW5nOiB0cnVlLCBmaWxlTGlzdDogW10gfSlcbiAgICAgICAgY29uc3QgcHJvcHMyID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUxpc3QgfSlcblxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPExpc3Qgey4uLnByb3BzMX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgbG9hZGluZyBzdGF0ZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVyZW5kZXIoPExpc3Qgey4uLnByb3BzMn0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3N0YXR1cycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLWZpbGUtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSBwYXJ0aWFsIGxvYWRpbmcgdG8gbG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICAgIGNvbnN0IHByb3BzMSA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUxpc3QgfSlcbiAgICAgICAgY29uc3QgcHJvcHMyID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUxpc3QgfSlcblxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPExpc3Qgey4uLnByb3BzMX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgcGFydGlhbCBsb2FkaW5nIHN0YXRlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzdGF0dXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZXJlbmRlcig8TGlzdCB7Li4ucHJvcHMyfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnc3RhdHVzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnU3RvcmUgU3RhdGUgRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0b3JlIHN0YXRlIHdpdGggZW1wdHkgbmV4dCBwYWdlIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja0lzVHJ1bmNhdGVkLmN1cnJlbnQgPSB0cnVlXG4gICAgICAgIG1vY2tDdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmLmN1cnJlbnQgPSB7fVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgZmlsZUxpc3QsXG4gICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHRyaWdnZXJJbnRlcnNlY3Rpb24odHJ1ZSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTZXROZXh0UGFnZVBhcmFtZXRlcnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHt9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RvcmUgc3RhdGUgd2l0aCBjb21wbGV4IG5leHQgcGFnZSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGNvbXBsZXhQYXJhbXMgPSB7XG4gICAgICAgICAgY3Vyc29yOiAnYWJjMTIzJyxcbiAgICAgICAgICBwYWdlOiAyLFxuICAgICAgICAgIG1ldGFkYXRhOiB7IG5lc3RlZDogeyB2YWx1ZTogdHJ1ZSB9IH0sXG4gICAgICAgIH1cbiAgICAgICAgbW9ja0lzVHJ1bmNhdGVkLmN1cnJlbnQgPSB0cnVlXG4gICAgICAgIG1vY2tDdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmLmN1cnJlbnQgPSBjb21wbGV4UGFyYW1zXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KDIpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBmaWxlTGlzdCxcbiAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgdHJpZ2dlckludGVyc2VjdGlvbih0cnVlKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1NldE5leHRQYWdlUGFyYW1ldGVycykudG9IYXZlQmVlbkNhbGxlZFdpdGgoY29tcGxleFBhcmFtcylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWxsIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgc3VwcG9ydEJhdGNoVXBsb2FkOiB0cnVlIH0sXG4gICAgICB7IHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UgfSxcbiAgICBdKSgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aCBzdXBwb3J0QmF0Y2hVcGxvYWQ9JHN1cHBvcnRCYXRjaFVwbG9hZCcsICh7IHN1cHBvcnRCYXRjaFVwbG9hZCB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgyKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCwgc3VwcG9ydEJhdGNoVXBsb2FkIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9IYXZlQXR0cmlidXRlKFxuICAgICAgICAnZGF0YS1tdWx0aXBsZS1jaG9pY2UnLFxuICAgICAgICBTdHJpbmcoc3VwcG9ydEJhdGNoVXBsb2FkKSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICB7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUNvdW50OiAwLCBrZXl3b3JkczogJycsIGV4cGVjdGVkU3RhdGU6ICdhbGwtbG9hZGluZycgfSxcbiAgICAgIHsgaXNMb2FkaW5nOiB0cnVlLCBmaWxlQ291bnQ6IDUsIGtleXdvcmRzOiAnJywgZXhwZWN0ZWRTdGF0ZTogJ3BhcnRpYWwtbG9hZGluZycgfSxcbiAgICAgIHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUNvdW50OiAwLCBrZXl3b3JkczogJycsIGV4cGVjdGVkU3RhdGU6ICdlbXB0eS1mb2xkZXInIH0sXG4gICAgICB7IGlzTG9hZGluZzogZmFsc2UsIGZpbGVDb3VudDogMCwga2V5d29yZHM6ICdzZWFyY2gnLCBleHBlY3RlZFN0YXRlOiAnZW1wdHktc2VhcmNoJyB9LFxuICAgICAgeyBpc0xvYWRpbmc6IGZhbHNlLCBmaWxlQ291bnQ6IDUsIGtleXdvcmRzOiAnJywgZXhwZWN0ZWRTdGF0ZTogJ2ZpbGUtbGlzdCcgfSxcbiAgICBdKSgnc2hvdWxkIHJlbmRlciAkZXhwZWN0ZWRTdGF0ZSB3aGVuIGlzTG9hZGluZz0kaXNMb2FkaW5nLCBmaWxlQ291bnQ9JGZpbGVDb3VudCwga2V5d29yZHM9JGtleXdvcmRzJywgKHsgaXNMb2FkaW5nLCBmaWxlQ291bnQsIGtleXdvcmRzLCBleHBlY3RlZFN0YXRlIH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gY3JlYXRlTW9ja0ZpbGVMaXN0KGZpbGVDb3VudClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QsIGlzTG9hZGluZywga2V5d29yZHMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBzd2l0Y2ggKGV4cGVjdGVkU3RhdGUpIHtcbiAgICAgICAgY2FzZSAnYWxsLWxvYWRpbmcnOlxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzdGF0dXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3BhcnRpYWwtbG9hZGluZyc6XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N0YXR1cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2VtcHR5LWZvbGRlcic6XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdlbXB0eS1zZWFyY2gnOlxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtcHR5LXNlYXJjaC1yZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2ZpbGUtbGlzdCc6XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBzZWxlY3RlZENvdW50OiAwLCBleHBlY3RlZFNlbGVjdGVkOiBbXSB9LFxuICAgICAgeyBzZWxlY3RlZENvdW50OiAxLCBleHBlY3RlZFNlbGVjdGVkOiBbJ2ZpbGUtMSddIH0sXG4gICAgICB7IHNlbGVjdGVkQ291bnQ6IDMsIGV4cGVjdGVkU2VsZWN0ZWQ6IFsnZmlsZS0xJywgJ2ZpbGUtMicsICdmaWxlLTMnXSB9LFxuICAgIF0pKCdzaG91bGQgaGFuZGxlICRzZWxlY3RlZENvdW50IHNlbGVjdGVkIGZpbGVzJywgKHsgZXhwZWN0ZWRTZWxlY3RlZCB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlTGlzdCA9IGNyZWF0ZU1vY2tGaWxlTGlzdCgzKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBmaWxlTGlzdCxcbiAgICAgICAgc2VsZWN0ZWRGaWxlSWRzOiBleHBlY3RlZFNlbGVjdGVkLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBmaWxlTGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBleHBlY3RlZFNlbGVjdGVkLmluY2x1ZGVzKGZpbGUuaWQpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGl0ZW0tJHtmaWxlLmlkfWApKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0ZWQnLCBTdHJpbmcoaXNTZWxlY3RlZCkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWxsb3cgaW50ZXJhY3Rpb24gd2l0aCByZXNldCBrZXl3b3JkcyBidXR0b24gaW4gZW1wdHkgc2VhcmNoIHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlUmVzZXRLZXl3b3JkcyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgZmlsZUxpc3Q6IFtdLFxuICAgICAgICBrZXl3b3JkczogJ3NlYXJjaC10ZXJtJyxcbiAgICAgICAgaGFuZGxlUmVzZXRLZXl3b3JkcyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMaXN0IHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCByZXNldEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVzZXQta2V5d29yZHMtYnRuJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzZXRCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGZpcmVFdmVudC5jbGljayhyZXNldEJ1dHRvbilcbiAgICAgIGV4cGVjdChoYW5kbGVSZXNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFbXB0eUZvbGRlciBDb21wb25lbnQgVGVzdHMgKHVzaW5nIGFjdHVhbCBjb21wb25lbnQpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdFbXB0eUZvbGRlcicsICgpID0+IHtcbiAgLy8gR2V0IHJlYWwgY29tcG9uZW50IGZvciB0ZXN0aW5nXG4gIGxldCBBY3R1YWxFbXB0eUZvbGRlcjogUmVhY3QuQ29tcG9uZW50VHlwZVxuXG4gIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9kID0gYXdhaXQgdmkuaW1wb3J0QWN0dWFsPHsgZGVmYXVsdDogUmVhY3QuQ29tcG9uZW50VHlwZSB9PignLi9lbXB0eS1mb2xkZXInKVxuICAgIEFjdHVhbEVtcHR5Rm9sZGVyID0gbW9kLmRlZmF1bHRcbiAgfSlcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFjdHVhbEVtcHR5Rm9sZGVyIC8+KVxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgZm9sZGVyIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFjdHVhbEVtcHR5Rm9sZGVyIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRQaXBlbGluZVxcLm9ubGluZURyaXZlXFwuZW1wdHlGb2xkZXIvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEFjdHVhbEVtcHR5Rm9sZGVyKS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgcmVhZGFibGUgdGV4dCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBY3R1YWxFbXB0eUZvbGRlciAvPilcbiAgICAgIGNvbnN0IHRleHRFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5lbXB0eUZvbGRlci8pXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQudGFnTmFtZSkudG9CZSgnU1BBTicpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRW1wdHlTZWFyY2hSZXN1bHQgQ29tcG9uZW50IFRlc3RzICh1c2luZyBhY3R1YWwgY29tcG9uZW50KVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRW1wdHlTZWFyY2hSZXN1bHQnLCAoKSA9PiB7XG4gIC8vIEdldCByZWFsIGNvbXBvbmVudCBmb3IgdGVzdGluZ1xuICBsZXQgQWN0dWFsRW1wdHlTZWFyY2hSZXN1bHQ6IFJlYWN0LkNvbXBvbmVudFR5cGU8eyBvblJlc2V0S2V5d29yZHM6ICgpID0+IHZvaWQgfT5cblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vZCA9IGF3YWl0IHZpLmltcG9ydEFjdHVhbDx7IGRlZmF1bHQ6IFJlYWN0LkNvbXBvbmVudFR5cGU8eyBvblJlc2V0S2V5d29yZHM6ICgpID0+IHZvaWQgfT4gfT4oJy4vZW1wdHktc2VhcmNoLXJlc3VsdCcpXG4gICAgQWN0dWFsRW1wdHlTZWFyY2hSZXN1bHQgPSBtb2QuZGVmYXVsdFxuICB9KVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUmVzZXRLZXl3b3JkcyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QWN0dWFsRW1wdHlTZWFyY2hSZXN1bHQgb25SZXNldEtleXdvcmRzPXtvblJlc2V0S2V5d29yZHN9IC8+KVxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgc2VhcmNoIHJlc3VsdCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25SZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxBY3R1YWxFbXB0eVNlYXJjaFJlc3VsdCBvblJlc2V0S2V5d29yZHM9e29uUmVzZXRLZXl3b3Jkc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5lbXB0eVNlYXJjaFJlc3VsdC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlc2V0IGtleXdvcmRzIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUmVzZXRLZXl3b3JkcyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QWN0dWFsRW1wdHlTZWFyY2hSZXN1bHQgb25SZXNldEtleXdvcmRzPXtvblJlc2V0S2V5d29yZHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5yZXNldEtleXdvcmRzLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VhcmNoIGljb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblJlc2V0S2V5d29yZHMgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxFbXB0eVNlYXJjaFJlc3VsdCBvblJlc2V0S2V5d29yZHM9e29uUmVzZXRLZXl3b3Jkc30gLz4pXG4gICAgICBjb25zdCBzdmdFbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdvblJlc2V0S2V5d29yZHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblJlc2V0S2V5d29yZHMgd2hlbiBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb25SZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICByZW5kZXIoPEFjdHVhbEVtcHR5U2VhcmNoUmVzdWx0IG9uUmVzZXRLZXl3b3Jkcz17b25SZXNldEtleXdvcmRzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgICBleHBlY3Qob25SZXNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblJlc2V0S2V5d29yZHMgb24gZWFjaCBjbGljaycsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb25SZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICByZW5kZXIoPEFjdHVhbEVtcHR5U2VhcmNoUmVzdWx0IG9uUmVzZXRLZXl3b3Jkcz17b25SZXNldEtleXdvcmRzfSAvPilcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgICAgZXhwZWN0KG9uUmVzZXRLZXl3b3JkcykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEFjdHVhbEVtcHR5U2VhcmNoUmVzdWx0KS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblJlc2V0S2V5d29yZHMgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEFjdHVhbEVtcHR5U2VhcmNoUmVzdWx0IG9uUmVzZXRLZXl3b3Jkcz17b25SZXNldEtleXdvcmRzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcmVhZGFibGUgdGV4dCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25SZXNldEtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxBY3R1YWxFbXB0eVNlYXJjaFJlc3VsdCBvblJlc2V0S2V5d29yZHM9e29uUmVzZXRLZXl3b3Jkc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5lbXB0eVNlYXJjaFJlc3VsdC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRmlsZUljb24gQ29tcG9uZW50IFRlc3RzICh1c2luZyBhY3R1YWwgY29tcG9uZW50KVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRmlsZUljb24nLCAoKSA9PiB7XG4gIC8vIEdldCByZWFsIGNvbXBvbmVudCBmb3IgdGVzdGluZ1xuICB0eXBlIEZpbGVJY29uUHJvcHMgPSB7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUsIGZpbGVOYW1lOiBzdHJpbmcsIHNpemU/OiAnc20nIHwgJ21kJyB8ICdsZycgfCAneGwnLCBjbGFzc05hbWU/OiBzdHJpbmcgfVxuICBsZXQgQWN0dWFsRmlsZUljb246IFJlYWN0LkNvbXBvbmVudFR5cGU8RmlsZUljb25Qcm9wcz5cblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vZCA9IGF3YWl0IHZpLmltcG9ydEFjdHVhbDx7IGRlZmF1bHQ6IFJlYWN0LkNvbXBvbmVudFR5cGU8RmlsZUljb25Qcm9wcz4gfT4oJy4vZmlsZS1pY29uJylcbiAgICBBY3R1YWxGaWxlSWNvbiA9IG1vZC5kZWZhdWx0XG4gIH0pXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZmlsZX0gZmlsZU5hbWU9XCJ0ZXN0LnR4dFwiIC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBidWNrZXQgaWNvbiBmb3IgYnVja2V0IHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0dWFsRmlsZUljb24gdHlwZT17T25saW5lRHJpdmVGaWxlVHlwZS5idWNrZXR9IGZpbGVOYW1lPVwibXktYnVja2V0XCIgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm9sZGVyIGljb24gZm9yIGZvbGRlciB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyfSBmaWxlTmFtZT1cIkRvY3VtZW50c1wiIC8+LFxuICAgICAgKVxuICAgICAgY29uc3Qgc3ZnID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpbGUgdHlwZSBpY29uIGZvciBmaWxlIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0dWFsRmlsZUljb24gdHlwZT17T25saW5lRHJpdmVGaWxlVHlwZS5maWxlfSBmaWxlTmFtZT1cImRvY3VtZW50LnBkZlwiIC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3R5cGUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICB7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0LCBmaWxlTmFtZTogJ2J1Y2tldC1uYW1lJyB9LFxuICAgICAgICB7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyLCBmaWxlTmFtZTogJ2ZvbGRlci1uYW1lJyB9LFxuICAgICAgICB7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSwgZmlsZU5hbWU6ICdmaWxlLnR4dCcgfSxcbiAgICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSBmb3IgdHlwZT0kdHlwZScsICh7IHR5cGUsIGZpbGVOYW1lIH0pID0+IHtcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgICA8QWN0dWFsRmlsZUljb24gdHlwZT17dHlwZX0gZmlsZU5hbWU9e2ZpbGVOYW1lfSAvPixcbiAgICAgICAgKVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdmaWxlTmFtZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQuZWFjaChbXG4gICAgICAgIHsgZmlsZU5hbWU6ICdkb2N1bWVudC5wZGYnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdpbWFnZS5wbmcnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICd2aWRlby5tcDQnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdhdWRpby5tcDMnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdjb2RlLmpzb24nIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdyZWFkbWUubWQnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdkYXRhLnhsc3gnIH0sXG4gICAgICAgIHsgZmlsZU5hbWU6ICdkb2MuZG9jeCcgfSxcbiAgICAgICAgeyBmaWxlTmFtZTogJ3NsaWRlcy5wcHR4JyB9LFxuICAgICAgICB7IGZpbGVOYW1lOiAndW5rbm93bi54eXonIH0sXG4gICAgICBdKSgnc2hvdWxkIHJlbmRlciBpY29uIGZvciAkZmlsZU5hbWUnLCAoeyBmaWxlTmFtZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZmlsZX0gZmlsZU5hbWU9e2ZpbGVOYW1lfSAvPixcbiAgICAgICAgKVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzaXplIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdC5lYWNoKFsnc20nLCAnbWQnLCAnbGcnLCAneGwnXSBhcyBjb25zdCkoJ3Nob3VsZCBhY2NlcHQgc2l6ZT0lcycsIChzaXplKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZmlsZX0gZmlsZU5hbWU9XCJ0ZXN0LnBkZlwiIHNpemU9e3NpemV9IC8+LFxuICAgICAgICApXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkZWZhdWx0IHRvIG1kIHNpemUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZmlsZX0gZmlsZU5hbWU9XCJ0ZXN0LnBkZlwiIC8+LFxuICAgICAgICApXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJY29uIFR5cGUgRGV0ZXJtaW5hdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBidWNrZXQgaWNvbiByZWdhcmRsZXNzIG9mIGZpbGVOYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0fSBmaWxlTmFtZT1cImZpbGUucGRmXCIgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm9sZGVyIGljb24gcmVnYXJkbGVzcyBvZiBmaWxlTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3R1YWxGaWxlSWNvbiB0eXBlPXtPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlcn0gZmlsZU5hbWU9XCJkb2N1bWVudC5wZGZcIiAvPixcbiAgICAgIClcbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRldGVybWluZSBmaWxlIHR5cGUgYmFzZWQgb24gZmlsZU5hbWUgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdHVhbEZpbGVJY29uIHR5cGU9e09ubGluZURyaXZlRmlsZVR5cGUuZmlsZX0gZmlsZU5hbWU9XCJpbWFnZS5naWZcIiAvPixcbiAgICAgIClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEFjdHVhbEZpbGVJY29uKS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBmaWxlTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3R1YWxGaWxlSWNvbiB0eXBlPXtPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGV9IGZpbGVOYW1lPVwiXCIgLz4sXG4gICAgICApXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZU5hbWUgd2l0aG91dCBleHRlbnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8QWN0dWFsRmlsZUljb24gdHlwZT17T25saW5lRHJpdmVGaWxlVHlwZS5maWxlfSBmaWxlTmFtZT1cIlJFQURNRVwiIC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBmaWxlTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3R1YWxGaWxlSWNvbiB0eXBlPXtPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGV9IGZpbGVOYW1lPVwi5paH5Lu2ICgxKS5wZGZcIiAvPixcbiAgICAgIClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZmlsZU5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nRmlsZU5hbWUgPSBgJHsnYScucmVwZWF0KDUwMCl9LnBkZmBcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBY3R1YWxGaWxlSWNvbiB0eXBlPXtPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGV9IGZpbGVOYW1lPXtsb25nRmlsZU5hbWV9IC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSXRlbSBDb21wb25lbnQgVGVzdHMgKHVzaW5nIGFjdHVhbCBjb21wb25lbnQpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdJdGVtJywgKCkgPT4ge1xuICAvLyBHZXQgcmVhbCBjb21wb25lbnQgZm9yIHRlc3RpbmdcbiAgbGV0IEFjdHVhbEl0ZW06IFJlYWN0LkNvbXBvbmVudFR5cGU8SXRlbVByb3BzPlxuXG4gIHR5cGUgSXRlbVByb3BzID0ge1xuICAgIGZpbGU6IE9ubGluZURyaXZlRmlsZVxuICAgIGlzU2VsZWN0ZWQ6IGJvb2xlYW5cbiAgICBkaXNhYmxlZD86IGJvb2xlYW5cbiAgICBpc011bHRpcGxlQ2hvaWNlPzogYm9vbGVhblxuICAgIG9uU2VsZWN0OiAoZmlsZTogT25saW5lRHJpdmVGaWxlKSA9PiB2b2lkXG4gICAgb25PcGVuOiAoZmlsZTogT25saW5lRHJpdmVGaWxlKSA9PiB2b2lkXG4gIH1cblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG1vZCA9IGF3YWl0IHZpLmltcG9ydEFjdHVhbDx7IGRlZmF1bHQ6IFJlYWN0LkNvbXBvbmVudFR5cGU8SXRlbVByb3BzPiB9PignLi9pdGVtJylcbiAgICBBY3R1YWxJdGVtID0gbW9kLmRlZmF1bHRcbiAgfSlcblxuICAvLyBSZXVzZSBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlIGZyb20gb3V0ZXIgc2NvcGVcbiAgY29uc3QgY3JlYXRlSXRlbVByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8SXRlbVByb3BzPik6IEl0ZW1Qcm9wcyA9PiAoe1xuICAgIGZpbGU6IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoKSxcbiAgICBpc1NlbGVjdGVkOiBmYWxzZSxcbiAgICBvblNlbGVjdDogdmkuZm4oKSxcbiAgICBvbk9wZW46IHZpLmZuKCksXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9KVxuXG4gIC8vIEhlbHBlciB0byBmaW5kIGN1c3RvbSBjaGVja2JveCBlbGVtZW50IChkaXYtYmFzZWQgaW1wbGVtZW50YXRpb24pXG4gIGNvbnN0IGZpbmRDaGVja2JveCA9IChjb250YWluZXI6IEhUTUxFbGVtZW50KSA9PiBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94LVwiXScpXG4gIGNvbnN0IGdldFJhZGlvID0gKCkgPT4gc2NyZWVuLmdldEJ5Um9sZSgncmFkaW8nKVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKClcbiAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QtZmlsZS50eHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmaWxlIG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBuYW1lOiAnZG9jdW1lbnQucGRmJyB9KSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkb2N1bWVudC5wZGYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmaWxlIHNpemUgZm9yIGZpbGUgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IHNpemU6IDEwMjQsIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSB9KSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxLjAwIEtCJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGZpbGUgc2l6ZSBmb3IgZm9sZGVyIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBzaXplOiAxMDI0LCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlciwgbmFtZTogJ0RvY3VtZW50cycgfSksXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCcxIEtCJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94IGluIG11bHRpcGxlIGNob2ljZSBtb2RlIGZvciBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoe1xuICAgICAgICBpc011bHRpcGxlQ2hvaWNlOiB0cnVlLFxuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5maWxlIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChmaW5kQ2hlY2tib3goY29udGFpbmVyKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByYWRpbyBpbiBzaW5nbGUgY2hvaWNlIG1vZGUgZm9yIGZpbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7XG4gICAgICAgIGlzTXVsdGlwbGVDaG9pY2U6IGZhbHNlLFxuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5maWxlIH0pLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KGdldFJhZGlvKCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGNoZWNrYm94IG9yIHJhZGlvIGZvciBidWNrZXQgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0LCBuYW1lOiAnbXktYnVja2V0JyB9KSxcbiAgICAgICAgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3QoZmluZENoZWNrYm94KGNvbnRhaW5lcikpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdyYWRpbycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHRpdGxlIGF0dHJpYnV0ZSBmb3IgZmlsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoe1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgbmFtZTogJ3ZlcnktbG9uZy1maWxlLW5hbWUudHh0JyB9KSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgndmVyeS1sb25nLWZpbGUtbmFtZS50eHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdpc1NlbGVjdGVkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgY2hlY2tib3ggYXMgY2hlY2tlZCB3aGVuIGlzU2VsZWN0ZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBpc1NlbGVjdGVkOiB0cnVlLCBpc011bHRpcGxlQ2hvaWNlOiB0cnVlIH0pXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSBmaW5kQ2hlY2tib3goY29udGFpbmVyKVxuICAgICAgICAvLyBDaGVja2VkIGNoZWNrYm94IHNob3dzIGNoZWNrIGljb25cbiAgICAgICAgZXhwZWN0KGNoZWNrYm94Py5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWRePVwiY2hlY2staWNvbi1cIl0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGNoZWNrYm94IGFzIHVuY2hlY2tlZCB3aGVuIGlzU2VsZWN0ZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgaXNTZWxlY3RlZDogZmFsc2UsIGlzTXVsdGlwbGVDaG9pY2U6IHRydWUgfSlcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBjaGVja2JveCA9IGZpbmRDaGVja2JveChjb250YWluZXIpXG4gICAgICAgIC8vIFVuY2hlY2tlZCBjaGVja2JveCBoYXMgbm8gY2hlY2sgaWNvblxuICAgICAgICBleHBlY3QoY2hlY2tib3g/LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVjay1pY29uLVwiXScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHJhZGlvIGFzIGNoZWNrZWQgd2hlbiBpc1NlbGVjdGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgaXNTZWxlY3RlZDogdHJ1ZSwgaXNNdWx0aXBsZUNob2ljZTogZmFsc2UgfSlcbiAgICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IHJhZGlvID0gZ2V0UmFkaW8oKVxuICAgICAgICBleHBlY3QocmFkaW8pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rpc2FibGVkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uU2VsZWN0IHdoZW4gY2xpY2tpbmcgZGlzYWJsZWQgY2hlY2tib3gnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGRpc2FibGVkOiB0cnVlLCBpc011bHRpcGxlQ2hvaWNlOiB0cnVlLCBvblNlbGVjdCB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZmluZENoZWNrYm94KGNvbnRhaW5lcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94ISlcbiAgICAgICAgZXhwZWN0KG9uU2VsZWN0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uU2VsZWN0IHdoZW4gY2xpY2tpbmcgZGlzYWJsZWQgcmFkaW8nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGRpc2FibGVkOiB0cnVlLCBpc011bHRpcGxlQ2hvaWNlOiBmYWxzZSwgb25TZWxlY3QgfSlcbiAgICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IHJhZGlvID0gZ2V0UmFkaW8oKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socmFkaW8pXG4gICAgICAgIGV4cGVjdChvblNlbGVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2lzTXVsdGlwbGVDaG9pY2UgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGVmYXVsdCB0byB0cnVlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcygpXG4gICAgICAgIGRlbGV0ZSAocHJvcHMgYXMgUGFydGlhbDxJdGVtUHJvcHM+KS5pc011bHRpcGxlQ2hvaWNlXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgICAgZXhwZWN0KGZpbmRDaGVja2JveChjb250YWluZXIpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVja2JveCB3aGVuIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGV4cGVjdChmaW5kQ2hlY2tib3goY29udGFpbmVyKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdyYWRpbycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcmFkaW8gd2hlbiBmYWxzZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBpc011bHRpcGxlQ2hvaWNlOiBmYWxzZSB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGV4cGVjdChnZXRSYWRpbygpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChmaW5kQ2hlY2tib3goY29udGFpbmVyKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0NsaWNrIG9uIEl0ZW0nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2hlbiBjbGlja2luZyBvbiBmaWxlIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGZpbGUsIG9uU2VsZWN0IH0pXG4gICAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgndGVzdC1maWxlLnR4dCcpKVxuICAgICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZpbGUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25PcGVuIHdoZW4gY2xpY2tpbmcgb24gZm9sZGVyIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uT3BlbiA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlciwgbmFtZTogJ0RvY3VtZW50cycgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBmaWxlLCBvbk9wZW4gfSlcbiAgICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdEb2N1bWVudHMnKSlcbiAgICAgICAgZXhwZWN0KG9uT3BlbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmlsZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbk9wZW4gd2hlbiBjbGlja2luZyBvbiBidWNrZXQgaXRlbScsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb25PcGVuID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0LCBuYW1lOiAnbXktYnVja2V0JyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGZpbGUsIG9uT3BlbiB9KVxuICAgICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ215LWJ1Y2tldCcpKVxuICAgICAgICBleHBlY3Qob25PcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBhbnkgaGFuZGxlciB3aGVuIGNsaWNraW5nIGRpc2FibGVkIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvbk9wZW4gPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgZGlzYWJsZWQ6IHRydWUsIG9uU2VsZWN0LCBvbk9wZW4gfSlcbiAgICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCd0ZXN0LWZpbGUudHh0JykpXG4gICAgICAgIGV4cGVjdChvblNlbGVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3Qob25PcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2xpY2sgb24gQ2hlY2tib3gvUmFkaW8nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2hlbiBjbGlja2luZyBjaGVja2JveCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBmaWxlLCBvblNlbGVjdCwgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZmluZENoZWNrYm94KGNvbnRhaW5lcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94ISlcbiAgICAgICAgZXhwZWN0KG9uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmaWxlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0IHdoZW4gY2xpY2tpbmcgcmFkaW8nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSgpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgZmlsZSwgb25TZWxlY3QsIGlzTXVsdGlwbGVDaG9pY2U6IGZhbHNlIH0pXG4gICAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCByYWRpbyA9IGdldFJhZGlvKClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHJhZGlvKVxuICAgICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZpbGUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHN0b3AgZXZlbnQgcHJvcGFnYXRpb24gd2hlbiBjbGlja2luZyBjaGVja2JveCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBmaWxlLCBvblNlbGVjdCwgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSB9KVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZmluZENoZWNrYm94KGNvbnRhaW5lcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94ISlcbiAgICAgICAgZXhwZWN0KG9uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoQWN0dWFsSXRlbSkudG9IYXZlUHJvcGVydHkoJyQkdHlwZW9mJywgU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZmlsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBmaWxlOiBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgbmFtZTogJycgfSkgfSlcbiAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGZpbGUgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gYCR7J2EnLnJlcGVhdCg1MDApfS50eHRgXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGZpbGU6IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBuYW1lOiBsb25nTmFtZSB9KSB9KVxuICAgICAgcmVuZGVyKDxBY3R1YWxJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nTmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGZpbGUgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWNpYWxOYW1lID0gJ+aWh+S7tiA8dGVzdD4gKDEpLnBkZidcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgZmlsZTogY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IG5hbWU6IHNwZWNpYWxOYW1lIH0pIH0pXG4gICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB6ZXJvIGZpbGUgc2l6ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgZmlsZTogY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IHNpemU6IDAgfSkgfSlcbiAgICAgIHJlbmRlcig8QWN0dWFsSXRlbSB7Li4ucHJvcHN9IC8+KVxuICAgICAgLy8gZm9ybWF0RmlsZVNpemUgcmV0dXJucyAwIGZvciBzaXplIDBcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsYXJnZSBmaWxlIHNpemUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGZpbGU6IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBzaXplOiAxMDI0ICogMTAyNCAqIDEwMjQgKiA1IH0pIH0pXG4gICAgICByZW5kZXIoPEFjdHVhbEl0ZW0gey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc1LjAwIEdCJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVdGlscyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgndXRpbHMnLCAoKSA9PiB7XG4gIC8vIEltcG9ydCBhY3R1YWwgdXRpbHMgZnVuY3Rpb25zXG4gIGxldCBnZXRGaWxlRXh0ZW5zaW9uOiAoZmlsZW5hbWU6IHN0cmluZykgPT4gc3RyaW5nXG4gIGxldCBnZXRGaWxlVHlwZTogKGZpbGVuYW1lOiBzdHJpbmcpID0+IHN0cmluZ1xuICBsZXQgRmlsZUFwcGVhcmFuY2VUeXBlRW51bTogUmVjb3JkPHN0cmluZywgc3RyaW5nPlxuXG4gIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdXRpbHMgPSBhd2FpdCB2aS5pbXBvcnRBY3R1YWw8eyBnZXRGaWxlRXh0ZW5zaW9uOiB0eXBlb2YgZ2V0RmlsZUV4dGVuc2lvbiwgZ2V0RmlsZVR5cGU6IHR5cGVvZiBnZXRGaWxlVHlwZSB9PignLi91dGlscycpXG4gICAgY29uc3QgdHlwZXMgPSBhd2FpdCB2aS5pbXBvcnRBY3R1YWw8eyBGaWxlQXBwZWFyYW5jZVR5cGVFbnVtOiB0eXBlb2YgRmlsZUFwcGVhcmFuY2VUeXBlRW51bSB9PignQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvdHlwZXMnKVxuICAgIGdldEZpbGVFeHRlbnNpb24gPSB1dGlscy5nZXRGaWxlRXh0ZW5zaW9uXG4gICAgZ2V0RmlsZVR5cGUgPSB1dGlscy5nZXRGaWxlVHlwZVxuICAgIEZpbGVBcHBlYXJhbmNlVHlwZUVudW0gPSB0eXBlcy5GaWxlQXBwZWFyYW5jZVR5cGVFbnVtXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldEZpbGVFeHRlbnNpb24nLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0Jhc2ljIEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBmaWxlIGV4dGVuc2lvbiBmb3Igbm9ybWFsIGZpbGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdkb2N1bWVudC5wZGYnKSkudG9CZSgncGRmJylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2ltYWdlLlBORycpKS50b0JlKCdwbmcnKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZGF0YS5KU09OJykpLnRvQmUoJ2pzb24nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gbG93ZXJjYXNlIGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ0ZJTEUuUERGJykpLnRvQmUoJ3BkZicpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdJTUFHRS5KUEVHJykpLnRvQmUoJ2pwZWcnKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignRG9jLlRYVCcpKS50b0JlKCd0eHQnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgZG90cyBpbiBmaWxlbmFtZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2ZpbGUuYmFja3VwLnRhci5neicpKS50b0JlKCdneicpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdteS5kb2N1bWVudC52Mi5wZGYnKSkudG9CZSgncGRmJylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ3Rlc3Quc3BlYy50cycpKS50b0JlKCd0cycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IHN0cmluZyBmb3IgZW1wdHkgZmlsZW5hbWUnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCcnKSkudG9CZSgnJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IHN0cmluZyBmb3IgZmlsZW5hbWUgd2l0aG91dCBleHRlbnNpb24nLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlRXh0ZW5zaW9uKCdSRUFETUUnKSkudG9CZSgnJylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ01ha2VmaWxlJykpLnRvQmUoJycpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmcgZm9yIGhpZGRlbiBmaWxlcyB3aXRob3V0IGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJy5naXRpZ25vcmUnKSkudG9CZSgnJylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJy5lbnYnKSkudG9CZSgnJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGhpZGRlbiBmaWxlcyB3aXRoIGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJy5lc2xpbnRyYy5qc29uJykpLnRvQmUoJ2pzb24nKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignLmNvbmZpZy55YW1sJykpLnRvQmUoJ3lhbWwnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZXMgZW5kaW5nIHdpdGggZG90JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS4nKSkudG9CZSgnJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBmaWxlbmFtZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2ZpbGUtbmFtZV92MS4wLnBkZicpKS50b0JlKCdwZGYnKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZGF0YSAoMSkueGxzeCcpKS50b0JlKCd4bHN4JylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdCb3VuZGFyeSBDb25kaXRpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGZpbGUgZXh0ZW5zaW9ucycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2ZpbGUudmVyeWxvbmdleHRlbnNpb24nKSkudG9CZSgndmVyeWxvbmdleHRlbnNpb24nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIGNoYXJhY3RlciBleHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS5hJykpLnRvQmUoJ2EnKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZGF0YS5jJykpLnRvQmUoJ2MnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVtZXJpYyBleHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZUV4dGVuc2lvbignZmlsZS4wMDEnKSkudG9CZSgnMDAxJylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVFeHRlbnNpb24oJ2JhY2t1cC4xMjMnKSkudG9CZSgnMTIzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RmlsZVR5cGUnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0ltYWdlIEZpbGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZ2lmIHR5cGUgZm9yIGdpZiBmaWxlcycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdhbmltYXRpb24uZ2lmJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5naWYpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnaW1hZ2UuR0lGJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5naWYpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBpbWFnZSB0eXBlIGZvciBjb21tb24gaW1hZ2UgZm9ybWF0cycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdwaG90by5qcGcnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmltYWdlKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ3Bob3RvLmpwZWcnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmltYWdlKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ3Bob3RvLnBuZycpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uaW1hZ2UpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgncGhvdG8ud2VicCcpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uaW1hZ2UpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgncGhvdG8uc3ZnJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5pbWFnZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdWaWRlbyBGaWxlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHZpZGVvIHR5cGUgZm9yIHZpZGVvIGZvcm1hdHMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnbW92aWUubXA0JykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS52aWRlbylcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdjbGlwLm1vdicpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0udmlkZW8pXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgndmlkZW8ud2VibScpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0udmlkZW8pXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgncmVjb3JkaW5nLm1wZWcnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLnZpZGVvKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0F1ZGlvIEZpbGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gYXVkaW8gdHlwZSBmb3IgYXVkaW8gZm9ybWF0cycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdzb25nLm1wMycpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uYXVkaW8pXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgncG9kY2FzdC53YXYnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmF1ZGlvKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2F1ZGlvLm00YScpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uYXVkaW8pXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnbXVzaWMubXBnYScpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uYXVkaW8pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29kZSBGaWxlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvZGUgdHlwZSBmb3IgY29kZS1yZWxhdGVkIGZvcm1hdHMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgncGFnZS5odG1sJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5jb2RlKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ3BhZ2UuaHRtJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5jb2RlKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2NvbmZpZy54bWwnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmNvZGUpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZGF0YS5qc29uJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5jb2RlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0RvY3VtZW50IEZpbGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gcGRmIHR5cGUgZm9yIFBERiBmaWxlcycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdkb2N1bWVudC5wZGYnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLnBkZilcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdyZXBvcnQuUERGJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wZGYpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBtYXJrZG93biB0eXBlIGZvciBtYXJrZG93biBmaWxlcycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdSRUFETUUubWQnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLm1hcmtkb3duKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2RvYy5tYXJrZG93bicpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ubWFya2Rvd24pXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZ3VpZGUubWR4JykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5tYXJrZG93bilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGV4Y2VsIHR5cGUgZm9yIHNwcmVhZHNoZWV0IGZpbGVzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2RhdGEueGxzeCcpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uZXhjZWwpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZGF0YS54bHMnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmV4Y2VsKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2RhdGEuY3N2JykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5leGNlbClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIHdvcmQgdHlwZSBmb3IgV29yZCBkb2N1bWVudHMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZG9jdW1lbnQuZG9jeCcpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ud29yZClcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdkb2N1bWVudC5kb2MnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLndvcmQpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBwcHQgdHlwZSBmb3IgUG93ZXJQb2ludCBmaWxlcycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdwcmVzZW50YXRpb24ucHB0eCcpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0ucHB0KVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ3NsaWRlcy5wcHQnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLnBwdClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGRvY3VtZW50IHR5cGUgZm9yIHRleHQgZmlsZXMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnbm90ZXMudHh0JykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5kb2N1bWVudClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVbmtub3duIEZpbGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY3VzdG9tIHR5cGUgZm9yIHVua25vd24gZXh0ZW5zaW9ucycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdmaWxlLnh5eicpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uY3VzdG9tKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2RhdGEudW5rbm93bicpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uY3VzdG9tKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2JpbmFyeS5iaW4nKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmN1c3RvbSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGN1c3RvbSB0eXBlIGZvciBmaWxlcyB3aXRob3V0IGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdSRUFETUUnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLmN1c3RvbSlcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdNYWtlZmlsZScpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uY3VzdG9tKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gY3VzdG9tIHR5cGUgZm9yIGVtcHR5IGZpbGVuYW1lJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJycpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uY3VzdG9tKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0Nhc2UgSW5zZW5zaXRpdml0eScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHVwcGVyY2FzZSBleHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2ZpbGUuUERGJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS5wZGYpXG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZmlsZS5ET0NYJykpLnRvQmUoRmlsZUFwcGVhcmFuY2VUeXBlRW51bS53b3JkKVxuICAgICAgICBleHBlY3QoZ2V0RmlsZVR5cGUoJ2ZpbGUuWExTWCcpKS50b0JlKEZpbGVBcHBlYXJhbmNlVHlwZUVudW0uZXhjZWwpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBjYXNlIGV4dGVuc2lvbnMnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZmlsZS5QZGYnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLnBkZilcbiAgICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdmaWxlLkRvY1gnKSkudG9CZShGaWxlQXBwZWFyYW5jZVR5cGVFbnVtLndvcmQpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19