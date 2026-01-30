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
// Mock ahooks useDebounceFn - third-party library requires mocking
const mockDebounceFnRun = vi.fn();
vi.mock('ahooks', () => ({
    useDebounceFn: (fn) => {
        mockDebounceFnRun.mockImplementation(fn);
        return { run: mockDebounceFnRun };
    },
}));
// Mock store - context provider requires mocking
const mockStoreState = {
    setNextPageParameters: vi.fn(),
    currentNextPageParametersRef: { current: {} },
    isTruncated: { current: false },
    hasBucket: false,
    setOnlineDriveFileList: vi.fn(),
    setSelectedFileIds: vi.fn(),
    setBreadcrumbs: vi.fn(),
    setPrefix: vi.fn(),
    setBucket: vi.fn(),
};
const mockGetState = vi.fn(() => mockStoreState);
const mockDataSourceStore = { getState: mockGetState };
vi.mock('../../store', () => ({
    useDataSourceStore: () => mockDataSourceStore,
    useDataSourceStoreWithSelector: (selector) => selector(mockStoreState),
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
const createDefaultProps = (overrides) => ({
    fileList: [],
    selectedFileIds: [],
    breadcrumbs: [],
    keywords: '',
    bucket: '',
    isInPipeline: false,
    resetKeywords: vi.fn(),
    updateKeywords: vi.fn(),
    searchResultsLength: 0,
    handleSelectFile: vi.fn(),
    handleOpenFolder: vi.fn(),
    isLoading: false,
    supportBatchUpload: true,
    ...overrides,
});
// ==========================================
// Helper Functions
// ==========================================
const resetMockStoreState = () => {
    mockStoreState.setNextPageParameters = vi.fn();
    mockStoreState.currentNextPageParametersRef = { current: {} };
    mockStoreState.isTruncated = { current: false };
    mockStoreState.hasBucket = false;
    mockStoreState.setOnlineDriveFileList = vi.fn();
    mockStoreState.setSelectedFileIds = vi.fn();
    mockStoreState.setBreadcrumbs = vi.fn();
    mockStoreState.setPrefix = vi.fn();
    mockStoreState.setBucket = vi.fn();
};
// ==========================================
// Test Suites
// ==========================================
describe('FileList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetMockStoreState();
        mockDebounceFnRun.mockClear();
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
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('h-[400px]');
            expect(wrapper).toHaveClass('flex-col');
            expect(wrapper).toHaveClass('overflow-hidden');
            expect(wrapper).toHaveClass('rounded-xl');
        });
        it('should render Header component with search input', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toBeInTheDocument();
        });
        it('should render files when fileList has items', () => {
            // Arrange
            const fileList = [
                createMockOnlineDriveFile({ id: 'file-1', name: 'file1.txt' }),
                createMockOnlineDriveFile({ id: 'file-2', name: 'file2.txt' }),
            ];
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('file1.txt')).toBeInTheDocument();
            expect(react_1.screen.getByText('file2.txt')).toBeInTheDocument();
        });
        it('should show loading state when isLoading is true and fileList is empty', () => {
            // Arrange
            const props = createDefaultProps({ isLoading: true, fileList: [] });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Loading component should be rendered with spin-animation class
            expect(container.querySelector('.spin-animation')).toBeInTheDocument();
        });
        it('should show empty folder state when not loading and fileList is empty', () => {
            // Arrange
            const props = createDefaultProps({ isLoading: false, fileList: [], keywords: '' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.onlineDrive.emptyFolder')).toBeInTheDocument();
        });
        it('should show empty search result when not loading, fileList is empty, and keywords exist', () => {
            // Arrange
            const props = createDefaultProps({ isLoading: false, fileList: [], keywords: 'search-term' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.onlineDrive.emptySearchResult')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('fileList prop', () => {
            it('should render all files from fileList', () => {
                // Arrange
                const fileList = [
                    createMockOnlineDriveFile({ id: '1', name: 'a.txt' }),
                    createMockOnlineDriveFile({ id: '2', name: 'b.txt' }),
                    createMockOnlineDriveFile({ id: '3', name: 'c.txt' }),
                ];
                const props = createDefaultProps({ fileList });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('a.txt')).toBeInTheDocument();
                expect(react_1.screen.getByText('b.txt')).toBeInTheDocument();
                expect(react_1.screen.getByText('c.txt')).toBeInTheDocument();
            });
            it('should handle empty fileList', () => {
                // Arrange
                const props = createDefaultProps({ fileList: [] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show empty folder state
                expect(react_1.screen.getByText('datasetPipeline.onlineDrive.emptyFolder')).toBeInTheDocument();
            });
        });
        describe('selectedFileIds prop', () => {
            it('should mark files as selected based on selectedFileIds', () => {
                // Arrange
                const fileList = [
                    createMockOnlineDriveFile({ id: 'file-1', name: 'file1.txt' }),
                    createMockOnlineDriveFile({ id: 'file-2', name: 'file2.txt' }),
                ];
                const props = createDefaultProps({ fileList, selectedFileIds: ['file-1'] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - The checkbox for file-1 should be checked (check icon present)
                expect(react_1.screen.getByTestId('checkbox-file-1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('check-icon-file-1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('checkbox-file-2')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId('check-icon-file-2')).not.toBeInTheDocument();
            });
        });
        describe('keywords prop', () => {
            it('should initialize input with keywords value', () => {
                // Arrange
                const props = createDefaultProps({ keywords: 'my-search' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue('my-search');
            });
        });
        describe('isLoading prop', () => {
            it('should show loading when isLoading is true with empty list', () => {
                // Arrange
                const props = createDefaultProps({ isLoading: true, fileList: [] });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Loading component with spin-animation class
                expect(container.querySelector('.spin-animation')).toBeInTheDocument();
            });
            it('should show loading indicator at bottom when isLoading is true with files', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile()];
                const props = createDefaultProps({ isLoading: true, fileList });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show spinner icon at the bottom
                expect(container.querySelector('.animation-spin')).toBeInTheDocument();
            });
        });
        describe('supportBatchUpload prop', () => {
            it('should render checkboxes when supportBatchUpload is true', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile({ id: 'file-1', name: 'file1.txt' })];
                const props = createDefaultProps({ fileList, supportBatchUpload: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Checkbox component has data-testid="checkbox-{id}"
                expect(react_1.screen.getByTestId('checkbox-file-1')).toBeInTheDocument();
            });
            it('should render radio buttons when supportBatchUpload is false', () => {
                // Arrange
                const fileList = [createMockOnlineDriveFile({ id: 'file-1', name: 'file1.txt' })];
                const props = createDefaultProps({ fileList, supportBatchUpload: false });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Radio is rendered as a div with rounded-full class
                expect(container.querySelector('.rounded-full')).toBeInTheDocument();
                // And checkbox should not be present
                expect(react_1.screen.queryByTestId('checkbox-file-1')).not.toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // State Management Tests
    // ==========================================
    describe('State Management', () => {
        describe('inputValue state', () => {
            it('should initialize inputValue with keywords prop', () => {
                // Arrange
                const props = createDefaultProps({ keywords: 'initial-keyword' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                expect(input).toHaveValue('initial-keyword');
            });
            it('should update inputValue when input changes', () => {
                // Arrange
                const props = createDefaultProps({ keywords: '' });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'new-value' } });
                // Assert
                expect(input).toHaveValue('new-value');
            });
        });
        describe('debounced keywords update', () => {
            it('should call updateKeywords with debounce when input changes', () => {
                // Arrange
                const mockUpdateKeywords = vi.fn();
                const props = createDefaultProps({ updateKeywords: mockUpdateKeywords });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'debounced-value' } });
                // Assert
                expect(mockDebounceFnRun).toHaveBeenCalledWith('debounced-value');
            });
        });
    });
    // ==========================================
    // Event Handlers Tests
    // ==========================================
    describe('Event Handlers', () => {
        describe('handleInputChange', () => {
            it('should update inputValue on input change', () => {
                // Arrange
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'typed-text' } });
                // Assert
                expect(input).toHaveValue('typed-text');
            });
            it('should trigger debounced updateKeywords on input change', () => {
                // Arrange
                const mockUpdateKeywords = vi.fn();
                const props = createDefaultProps({ updateKeywords: mockUpdateKeywords });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'search-term' } });
                // Assert
                expect(mockDebounceFnRun).toHaveBeenCalledWith('search-term');
            });
            it('should handle multiple sequential input changes', () => {
                // Arrange
                const mockUpdateKeywords = vi.fn();
                const props = createDefaultProps({ updateKeywords: mockUpdateKeywords });
                (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                // Act
                react_1.fireEvent.change(input, { target: { value: 'a' } });
                react_1.fireEvent.change(input, { target: { value: 'ab' } });
                react_1.fireEvent.change(input, { target: { value: 'abc' } });
                // Assert
                expect(mockDebounceFnRun).toHaveBeenCalledTimes(3);
                expect(mockDebounceFnRun).toHaveBeenLastCalledWith('abc');
                expect(input).toHaveValue('abc');
            });
        });
        describe('handleResetKeywords', () => {
            it('should call resetKeywords prop when clear button is clicked', () => {
                // Arrange
                const mockResetKeywords = vi.fn();
                const props = createDefaultProps({ resetKeywords: mockResetKeywords, keywords: 'to-reset' });
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click the clear icon div (it contains RiCloseCircleFill icon)
                const clearButton = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]')?.parentElement;
                expect(clearButton).toBeInTheDocument();
                react_1.fireEvent.click(clearButton);
                // Assert
                expect(mockResetKeywords).toHaveBeenCalledTimes(1);
            });
            it('should reset inputValue to empty string when clear is clicked', () => {
                // Arrange
                const props = createDefaultProps({ keywords: 'to-be-reset' });
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
                react_1.fireEvent.change(input, { target: { value: 'some-search' } });
                // Act - Find and click the clear icon
                const clearButton = container.querySelector('[class*="cursor-pointer"] svg[class*="h-3.5"]')?.parentElement;
                expect(clearButton).toBeInTheDocument();
                react_1.fireEvent.click(clearButton);
                // Assert
                expect(input).toHaveValue('');
            });
        });
        describe('handleSelectFile', () => {
            it('should call handleSelectFile when file item is clicked', () => {
                // Arrange
                const mockHandleSelectFile = vi.fn();
                const fileList = [createMockOnlineDriveFile({ id: 'file-1', name: 'test.txt' })];
                const props = createDefaultProps({ handleSelectFile: mockHandleSelectFile, fileList });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click on the file item
                const fileItem = react_1.screen.getByText('test.txt');
                react_1.fireEvent.click(fileItem.closest('[class*="cursor-pointer"]'));
                // Assert
                expect(mockHandleSelectFile).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'file-1',
                    name: 'test.txt',
                    type: pipeline_1.OnlineDriveFileType.file,
                }));
            });
        });
        describe('handleOpenFolder', () => {
            it('should call handleOpenFolder when folder item is clicked', () => {
                // Arrange
                const mockHandleOpenFolder = vi.fn();
                const fileList = [createMockOnlineDriveFile({ id: 'folder-1', name: 'my-folder', type: pipeline_1.OnlineDriveFileType.folder })];
                const props = createDefaultProps({ handleOpenFolder: mockHandleOpenFolder, fileList });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click on the folder item
                const folderItem = react_1.screen.getByText('my-folder');
                react_1.fireEvent.click(folderItem.closest('[class*="cursor-pointer"]'));
                // Assert
                expect(mockHandleOpenFolder).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'folder-1',
                    name: 'my-folder',
                    type: pipeline_1.OnlineDriveFileType.folder,
                }));
            });
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty string keywords', () => {
            // Arrange
            const props = createDefaultProps({ keywords: '' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue('');
        });
        it('should handle special characters in keywords', () => {
            // Arrange
            const specialChars = 'test[file].txt (copy)';
            const props = createDefaultProps({ keywords: specialChars });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue(specialChars);
        });
        it('should handle unicode characters in keywords', () => {
            // Arrange
            const unicodeKeywords = '文件搜索 日本語';
            const props = createDefaultProps({ keywords: unicodeKeywords });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue(unicodeKeywords);
        });
        it('should handle very long file names in fileList', () => {
            // Arrange
            const longName = `${'a'.repeat(100)}.txt`;
            const fileList = [createMockOnlineDriveFile({ id: '1', name: longName })];
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle large number of files', () => {
            // Arrange
            const fileList = Array.from({ length: 50 }, (_, i) => createMockOnlineDriveFile({ id: `file-${i}`, name: `file-${i}.txt` }));
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check a few files exist
            expect(react_1.screen.getByText('file-0.txt')).toBeInTheDocument();
            expect(react_1.screen.getByText('file-49.txt')).toBeInTheDocument();
        });
        it('should handle whitespace-only keywords input', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            // Act
            react_1.fireEvent.change(input, { target: { value: '   ' } });
            // Assert
            expect(input).toHaveValue('   ');
            expect(mockDebounceFnRun).toHaveBeenCalledWith('   ');
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { isInPipeline: true, supportBatchUpload: true },
            { isInPipeline: true, supportBatchUpload: false },
            { isInPipeline: false, supportBatchUpload: true },
            { isInPipeline: false, supportBatchUpload: false },
        ])('should render correctly with isInPipeline=$isInPipeline and supportBatchUpload=$supportBatchUpload', (propVariation) => {
            // Arrange
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Component should render without crashing
            expect(react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder')).toBeInTheDocument();
        });
        it.each([
            { isLoading: true, fileCount: 0, description: 'loading state with no files' },
            { isLoading: false, fileCount: 0, description: 'not loading with no files' },
            { isLoading: false, fileCount: 3, description: 'not loading with files' },
        ])('should handle $description correctly', ({ isLoading, fileCount }) => {
            // Arrange
            const fileList = Array.from({ length: fileCount }, (_, i) => createMockOnlineDriveFile({ id: `file-${i}`, name: `file-${i}.txt` }));
            const props = createDefaultProps({ isLoading, fileList });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            if (isLoading && fileCount === 0)
                expect(container.querySelector('.spin-animation')).toBeInTheDocument();
            else if (!isLoading && fileCount === 0)
                expect(react_1.screen.getByText('datasetPipeline.onlineDrive.emptyFolder')).toBeInTheDocument();
            else
                expect(react_1.screen.getByText('file-0.txt')).toBeInTheDocument();
        });
        it.each([
            { keywords: '', searchResultsLength: 0 },
            { keywords: 'test', searchResultsLength: 5 },
            { keywords: 'not-found', searchResultsLength: 0 },
        ])('should render correctly with keywords="$keywords" and searchResultsLength=$searchResultsLength', ({ keywords, searchResultsLength }) => {
            // Arrange
            const props = createDefaultProps({ keywords, searchResultsLength });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByPlaceholderText('datasetPipeline.onlineDrive.breadcrumbs.searchPlaceholder');
            expect(input).toHaveValue(keywords);
        });
    });
    // ==========================================
    // File Type Variations
    // ==========================================
    describe('File Type Variations', () => {
        it('should render folder type correctly', () => {
            // Arrange
            const fileList = [createMockOnlineDriveFile({ id: 'folder-1', name: 'my-folder', type: pipeline_1.OnlineDriveFileType.folder })];
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('my-folder')).toBeInTheDocument();
        });
        it('should render bucket type correctly', () => {
            // Arrange
            const fileList = [createMockOnlineDriveFile({ id: 'bucket-1', name: 'my-bucket', type: pipeline_1.OnlineDriveFileType.bucket })];
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('my-bucket')).toBeInTheDocument();
        });
        it('should render file with size', () => {
            // Arrange
            const fileList = [createMockOnlineDriveFile({ id: 'file-1', name: 'test.txt', size: 1024 })];
            const props = createDefaultProps({ fileList });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('test.txt')).toBeInTheDocument();
            // formatFileSize returns '1.00 KB' for 1024 bytes
            expect(react_1.screen.getByText('1.00 KB')).toBeInTheDocument();
        });
        it('should not show checkbox for bucket type', () => {
            // Arrange
            const fileList = [createMockOnlineDriveFile({ id: 'bucket-1', name: 'my-bucket', type: pipeline_1.OnlineDriveFileType.bucket })];
            const props = createDefaultProps({ fileList, supportBatchUpload: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - No checkbox should be rendered for bucket
            expect(react_1.screen.queryByRole('checkbox')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Search Results Display
    // ==========================================
    describe('Search Results Display', () => {
        it('should show search results count when keywords and results exist', () => {
            // Arrange
            const props = createDefaultProps({
                keywords: 'test',
                searchResultsLength: 5,
                breadcrumbs: ['folder1'],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.breadcrumbs\.searchResult/)).toBeInTheDocument();
        });
    });
    // ==========================================
    // Callback Stability
    // ==========================================
    describe('Callback Stability', () => {
        it('should maintain stable handleSelectFile callback', () => {
            // Arrange
            const mockHandleSelectFile = vi.fn();
            const fileList = [createMockOnlineDriveFile({ id: 'file-1', name: 'test.txt' })];
            const props = createDefaultProps({ handleSelectFile: mockHandleSelectFile, fileList });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click once
            const fileItem = react_1.screen.getByText('test.txt');
            react_1.fireEvent.click(fileItem.closest('[class*="cursor-pointer"]'));
            // Rerender with same props
            rerender(<index_1.default {...props}/>);
            // Click again
            react_1.fireEvent.click(fileItem.closest('[class*="cursor-pointer"]'));
            // Assert
            expect(mockHandleSelectFile).toHaveBeenCalledTimes(2);
        });
        it('should maintain stable handleOpenFolder callback', () => {
            // Arrange
            const mockHandleOpenFolder = vi.fn();
            const fileList = [createMockOnlineDriveFile({ id: 'folder-1', name: 'my-folder', type: pipeline_1.OnlineDriveFileType.folder })];
            const props = createDefaultProps({ handleOpenFolder: mockHandleOpenFolder, fileList });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click once
            const folderItem = react_1.screen.getByText('my-folder');
            react_1.fireEvent.click(folderItem.closest('[class*="cursor-pointer"]'));
            // Rerender with same props
            rerender(<index_1.default {...props}/>);
            // Click again
            react_1.fireEvent.click(folderItem.closest('[class*="cursor-pointer"]'));
            // Assert
            expect(mockHandleOpenFolder).toHaveBeenCalledTimes(2);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixnREFBdUQ7QUFDdkQsbUNBQThCO0FBRTlCLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSxtRUFBbUU7QUFDbkUsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDakMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QixhQUFhLEVBQUUsQ0FBQyxFQUE0QixFQUFFLEVBQUU7UUFDOUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxDQUFBO0lBQ25DLENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILGlEQUFpRDtBQUNqRCxNQUFNLGNBQWMsR0FBRztJQUNyQixxQkFBcUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzlCLDRCQUE0QixFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtJQUM3QyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQy9CLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0Isa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMzQixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2QixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsQixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNuQixDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNoRCxNQUFNLG1CQUFtQixHQUFHLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFBO0FBRXRELEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUIsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsbUJBQW1CO0lBQzdDLDhCQUE4QixFQUFFLENBQUMsUUFBeUIsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztDQUN4RixDQUFDLENBQUMsQ0FBQTtBQUVILDZDQUE2QztBQUM3QyxxQkFBcUI7QUFDckIsNkNBQTZDO0FBQzdDLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxTQUFvQyxFQUFtQixFQUFFLENBQUMsQ0FBQztJQUM1RixFQUFFLEVBQUUsUUFBUTtJQUNaLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLDhCQUFtQixDQUFDLElBQUk7SUFDOUIsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBSUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQWtDLEVBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pGLFFBQVEsRUFBRSxFQUFFO0lBQ1osZUFBZSxFQUFFLEVBQUU7SUFDbkIsV0FBVyxFQUFFLEVBQUU7SUFDZixRQUFRLEVBQUUsRUFBRTtJQUNaLE1BQU0sRUFBRSxFQUFFO0lBQ1YsWUFBWSxFQUFFLEtBQUs7SUFDbkIsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdEIsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkIsbUJBQW1CLEVBQUUsQ0FBQztJQUN0QixnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3pCLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDekIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsa0JBQWtCLEVBQUUsSUFBSTtJQUN4QixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRiw2Q0FBNkM7QUFDN0MsbUJBQW1CO0FBQ25CLDZDQUE2QztBQUM3QyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUMvQixjQUFjLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBQzlDLGNBQWMsQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUM3RCxjQUFjLENBQUMsV0FBVyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO0lBQy9DLGNBQWMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO0lBQ2hDLGNBQWMsQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDL0MsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUMzQyxjQUFjLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUN2QyxjQUFjLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUNsQyxjQUFjLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNwQyxDQUFDLENBQUE7QUFFRCw2Q0FBNkM7QUFDN0MsY0FBYztBQUNkLDZDQUE2QztBQUM3QyxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLG1CQUFtQixFQUFFLENBQUE7UUFDckIsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUE7SUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0Msa0JBQWtCO0lBQ2xCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQiwwQ0FBMEM7WUFDMUMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN0SCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDckQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFVBQXlCLENBQUE7WUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1lBQzFELFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLG9CQUFvQixDQUFDLDJEQUEyRCxDQUFDLENBQUE7WUFDdEcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRztnQkFDZix5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDO2dCQUM5RCx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDO2FBQy9ELENBQUE7WUFDRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFOUMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtZQUNoRixVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRW5FLE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckQsMEVBQTBFO1lBQzFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtZQUMvRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFbEYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6RixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx5RkFBeUYsRUFBRSxHQUFHLEVBQUU7WUFDakcsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO1lBRTdGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsK0NBQStDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0YsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztJQUM3QyxnQkFBZ0I7SUFDaEIsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBQzdCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7Z0JBQy9DLFVBQVU7Z0JBQ1YsTUFBTSxRQUFRLEdBQUc7b0JBQ2YseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztvQkFDckQseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztvQkFDckQseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztpQkFDdEQsQ0FBQTtnQkFDRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBRTlDLE1BQU07Z0JBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBRS9CLFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUNyRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQ3JELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2RCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7Z0JBQ3RDLFVBQVU7Z0JBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQkFFbEQsTUFBTTtnQkFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFL0IsMENBQTBDO2dCQUMxQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN6RixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtZQUNwQyxFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO2dCQUNoRSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHO29CQUNmLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7b0JBQzlELHlCQUF5QixDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7aUJBQy9ELENBQUE7Z0JBQ0QsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUUzRSxNQUFNO2dCQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUUvQiwwRUFBMEU7Z0JBQzFFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUNqRSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDbkUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQ2pFLE1BQU0sQ0FBQyxjQUFNLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMzRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDN0IsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtnQkFDckQsVUFBVTtnQkFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO2dCQUUzRCxNQUFNO2dCQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUUvQixTQUFTO2dCQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO2dCQUN0RyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7Z0JBQ3BFLFVBQVU7Z0JBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUVuRSxNQUFNO2dCQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFckQsdURBQXVEO2dCQUN2RCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RSxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywyRUFBMkUsRUFBRSxHQUFHLEVBQUU7Z0JBQ25GLFVBQVU7Z0JBQ1YsTUFBTSxRQUFRLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUE7Z0JBQzlDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUUvRCxNQUFNO2dCQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFckQsa0RBQWtEO2dCQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtZQUN2QyxFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO2dCQUNsRSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ2pGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7Z0JBRXhFLE1BQU07Z0JBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBRS9CLDhEQUE4RDtnQkFDOUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO2dCQUN0RSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQ2pGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7Z0JBRXpFLE1BQU07Z0JBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUVyRCw4REFBOEQ7Z0JBQzlELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDcEUscUNBQXFDO2dCQUNyQyxNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLHlCQUF5QjtJQUN6Qiw2Q0FBNkM7SUFDN0MsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7Z0JBQ3pELFVBQVU7Z0JBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO2dCQUVqRSxNQUFNO2dCQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUUvQixTQUFTO2dCQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO2dCQUN0RyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDOUMsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO2dCQUNyRCxVQUFVO2dCQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQ2xELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUMvQixNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtnQkFFdEcsTUFBTTtnQkFDTixpQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUUzRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDeEMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDekMsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtnQkFDckUsVUFBVTtnQkFDVixNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDbEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFBO2dCQUN4RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFDL0IsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLG9CQUFvQixDQUFDLDJEQUEyRCxDQUFDLENBQUE7Z0JBRXRHLE1BQU07Z0JBQ04saUJBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUVqRSxTQUFTO2dCQUNULE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDbkUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLHVCQUF1QjtJQUN2Qiw2Q0FBNkM7SUFDN0MsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM5QixRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQ2pDLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xELFVBQVU7Z0JBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtnQkFDbEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQy9CLE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO2dCQUV0RyxNQUFNO2dCQUNOLGlCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBRTVELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUN6QyxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7Z0JBQ2pFLFVBQVU7Z0JBQ1YsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBQ2xDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtnQkFDeEUsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQy9CLE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO2dCQUV0RyxNQUFNO2dCQUNOLGlCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBRTdELFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDL0QsQ0FBQyxDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO2dCQUN6RCxVQUFVO2dCQUNWLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUNsQyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUE7Z0JBQ3hFLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUMvQixNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtnQkFFdEcsTUFBTTtnQkFDTixpQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRCxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUNwRCxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUVyRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNsRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDekQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtZQUNuQyxFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO2dCQUNyRSxVQUFVO2dCQUNWLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUNqQyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtnQkFDNUYsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUVyRCxzRUFBc0U7Z0JBQ3RFLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsK0NBQStDLENBQUMsRUFBRSxhQUFhLENBQUE7Z0JBQzNHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUN2QyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxXQUFZLENBQUMsQ0FBQTtnQkFFN0IsU0FBUztnQkFDVCxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwRCxDQUFDLENBQUMsQ0FBQTtZQUVGLEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7Z0JBQ3ZFLFVBQVU7Z0JBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQTtnQkFDN0QsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUNyRCxNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtnQkFDdEcsaUJBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQkFFN0Qsc0NBQXNDO2dCQUN0QyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLCtDQUErQyxDQUFDLEVBQUUsYUFBYSxDQUFBO2dCQUMzRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDdkMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsV0FBWSxDQUFDLENBQUE7Z0JBRTdCLFNBQVM7Z0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUMvQixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtZQUNoQyxFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO2dCQUNoRSxVQUFVO2dCQUNWLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO2dCQUNwQyxNQUFNLFFBQVEsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFBO2dCQUNoRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ3RGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUUvQiwrQkFBK0I7Z0JBQy9CLE1BQU0sUUFBUSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUUsQ0FBQyxDQUFBO2dCQUUvRCxTQUFTO2dCQUNULE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDeEUsRUFBRSxFQUFFLFFBQVE7b0JBQ1osSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLElBQUksRUFBRSw4QkFBbUIsQ0FBQyxJQUFJO2lCQUMvQixDQUFDLENBQUMsQ0FBQTtZQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xFLFVBQVU7Z0JBQ1YsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7Z0JBQ3BDLE1BQU0sUUFBUSxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLDhCQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDckgsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFFL0IsaUNBQWlDO2dCQUNqQyxNQUFNLFVBQVUsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUNoRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFFLENBQUMsQ0FBQTtnQkFFakUsU0FBUztnQkFDVCxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3hFLEVBQUUsRUFBRSxVQUFVO29CQUNkLElBQUksRUFBRSxXQUFXO29CQUNqQixJQUFJLEVBQUUsOEJBQW1CLENBQUMsTUFBTTtpQkFDakMsQ0FBQyxDQUFDLENBQUE7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsZ0NBQWdDO0lBQ2hDLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQzdDLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFbEQsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtZQUN0RyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQy9CLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxVQUFVO1lBQ1YsTUFBTSxZQUFZLEdBQUcsdUJBQXVCLENBQUE7WUFDNUMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQTtZQUU1RCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO1lBQ3RHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELFVBQVU7WUFDVixNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUE7WUFDbEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQTtZQUUvRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQywyREFBMkQsQ0FBQyxDQUFBO1lBQ3RHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1lBQ3hELFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQTtZQUN6QyxNQUFNLFFBQVEsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3pFLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUU5QyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsVUFBVTtZQUNWLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FDbkQseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN4RSxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFOUMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLG1DQUFtQztZQUNuQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDMUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUNsQyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMvQixNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtZQUV0RyxNQUFNO1lBQ04saUJBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLDRCQUE0QjtJQUM1Qiw2Q0FBNkM7SUFDN0MsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUMvQixFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ04sRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRTtZQUNoRCxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFO1lBQ2pELEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUU7WUFDakQsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRTtTQUNuRCxDQUFDLENBQUMsb0dBQW9HLEVBQUUsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN6SCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFL0MsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLG9EQUFvRDtZQUNwRCxNQUFNLENBQUMsY0FBTSxDQUFDLG9CQUFvQixDQUFDLDJEQUEyRCxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3RILENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLElBQUksQ0FBQztZQUNOLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSw2QkFBNkIsRUFBRTtZQUM3RSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUU7WUFDNUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLHdCQUF3QixFQUFFO1NBQzFFLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7WUFDdEUsVUFBVTtZQUNWLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FDMUQseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN4RSxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRXpELE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULElBQUksU0FBUyxJQUFJLFNBQVMsS0FBSyxDQUFDO2dCQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtpQkFFbkUsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEtBQUssQ0FBQztnQkFDcEMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7O2dCQUd2RixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsSUFBSSxDQUFDO1lBQ04sRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLG1CQUFtQixFQUFFLENBQUMsRUFBRTtZQUN4QyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFO1lBQzVDLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLEVBQUU7U0FDbEQsQ0FBQyxDQUFDLGdHQUFnRyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxFQUFFO1lBQ3pJLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUE7WUFFbkUsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkRBQTJELENBQUMsQ0FBQTtZQUN0RyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MsdUJBQXVCO0lBQ3ZCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsVUFBVTtZQUNWLE1BQU0sUUFBUSxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLDhCQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNySCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFOUMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQzdDLFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSw4QkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDckgsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTlDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxVQUFVO1lBQ1YsTUFBTSxRQUFRLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQzVGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUU5QyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RCxrREFBa0Q7WUFDbEQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxVQUFVO1lBQ1YsTUFBTSxRQUFRLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsOEJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ3JILE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7WUFFeEUsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRS9CLHFEQUFxRDtZQUNyRCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2hFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0MseUJBQXlCO0lBQ3pCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLEVBQUUsQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7WUFDMUUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUMvQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseURBQXlELENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekcsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztJQUM3QyxxQkFBcUI7SUFDckIsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxVQUFVO1lBQ1YsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7WUFDcEMsTUFBTSxRQUFRLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNoRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDdEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBELG1CQUFtQjtZQUNuQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUUsQ0FBQyxDQUFBO1lBRS9ELDJCQUEyQjtZQUMzQixRQUFRLENBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFakMsY0FBYztZQUNkLGlCQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUUsQ0FBQyxDQUFBO1lBRS9ELFNBQVM7WUFDVCxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsVUFBVTtZQUNWLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQ3BDLE1BQU0sUUFBUSxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLDhCQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNySCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDdEYsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBELG1CQUFtQjtZQUNuQixNQUFNLFVBQVUsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ2hELGlCQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUUsQ0FBQyxDQUFBO1lBRWpFLDJCQUEyQjtZQUMzQixRQUFRLENBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFakMsY0FBYztZQUNkLGlCQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUUsQ0FBQyxDQUFBO1lBRWpFLFNBQVM7WUFDVCxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE9ubGluZURyaXZlRmlsZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IE9ubGluZURyaXZlRmlsZVR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBGaWxlTGlzdCBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgTW9kdWxlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IHJlYWN0LWkxOG5leHQgdXNlcyBnbG9iYWwgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gTW9jayBhaG9va3MgdXNlRGVib3VuY2VGbiAtIHRoaXJkLXBhcnR5IGxpYnJhcnkgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgbW9ja0RlYm91bmNlRm5SdW4gPSB2aS5mbigpXG52aS5tb2NrKCdhaG9va3MnLCAoKSA9PiAoe1xuICB1c2VEZWJvdW5jZUZuOiAoZm46ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCkgPT4ge1xuICAgIG1vY2tEZWJvdW5jZUZuUnVuLm1vY2tJbXBsZW1lbnRhdGlvbihmbilcbiAgICByZXR1cm4geyBydW46IG1vY2tEZWJvdW5jZUZuUnVuIH1cbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHN0b3JlIC0gY29udGV4dCBwcm92aWRlciByZXF1aXJlcyBtb2NraW5nXG5jb25zdCBtb2NrU3RvcmVTdGF0ZSA9IHtcbiAgc2V0TmV4dFBhZ2VQYXJhbWV0ZXJzOiB2aS5mbigpLFxuICBjdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmOiB7IGN1cnJlbnQ6IHt9IH0sXG4gIGlzVHJ1bmNhdGVkOiB7IGN1cnJlbnQ6IGZhbHNlIH0sXG4gIGhhc0J1Y2tldDogZmFsc2UsXG4gIHNldE9ubGluZURyaXZlRmlsZUxpc3Q6IHZpLmZuKCksXG4gIHNldFNlbGVjdGVkRmlsZUlkczogdmkuZm4oKSxcbiAgc2V0QnJlYWRjcnVtYnM6IHZpLmZuKCksXG4gIHNldFByZWZpeDogdmkuZm4oKSxcbiAgc2V0QnVja2V0OiB2aS5mbigpLFxufVxuXG5jb25zdCBtb2NrR2V0U3RhdGUgPSB2aS5mbigoKSA9PiBtb2NrU3RvcmVTdGF0ZSlcbmNvbnN0IG1vY2tEYXRhU291cmNlU3RvcmUgPSB7IGdldFN0YXRlOiBtb2NrR2V0U3RhdGUgfVxuXG52aS5tb2NrKCcuLi8uLi9zdG9yZScsICgpID0+ICh7XG4gIHVzZURhdGFTb3VyY2VTdG9yZTogKCkgPT4gbW9ja0RhdGFTb3VyY2VTdG9yZSxcbiAgdXNlRGF0YVNvdXJjZVN0b3JlV2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzOiBhbnkpID0+IGFueSkgPT4gc2VsZWN0b3IobW9ja1N0b3JlU3RhdGUpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxPbmxpbmVEcml2ZUZpbGU+KTogT25saW5lRHJpdmVGaWxlID0+ICh7XG4gIGlkOiAnZmlsZS0xJyxcbiAgbmFtZTogJ3Rlc3QtZmlsZS50eHQnLFxuICBzaXplOiAxMDI0LFxuICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbnR5cGUgRmlsZUxpc3RQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBGaWxlTGlzdD5cblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8RmlsZUxpc3RQcm9wcz4pOiBGaWxlTGlzdFByb3BzID0+ICh7XG4gIGZpbGVMaXN0OiBbXSxcbiAgc2VsZWN0ZWRGaWxlSWRzOiBbXSxcbiAgYnJlYWRjcnVtYnM6IFtdLFxuICBrZXl3b3JkczogJycsXG4gIGJ1Y2tldDogJycsXG4gIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gIHJlc2V0S2V5d29yZHM6IHZpLmZuKCksXG4gIHVwZGF0ZUtleXdvcmRzOiB2aS5mbigpLFxuICBzZWFyY2hSZXN1bHRzTGVuZ3RoOiAwLFxuICBoYW5kbGVTZWxlY3RGaWxlOiB2aS5mbigpLFxuICBoYW5kbGVPcGVuRm9sZGVyOiB2aS5mbigpLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCByZXNldE1vY2tTdG9yZVN0YXRlID0gKCkgPT4ge1xuICBtb2NrU3RvcmVTdGF0ZS5zZXROZXh0UGFnZVBhcmFtZXRlcnMgPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWYgPSB7IGN1cnJlbnQ6IHt9IH1cbiAgbW9ja1N0b3JlU3RhdGUuaXNUcnVuY2F0ZWQgPSB7IGN1cnJlbnQ6IGZhbHNlIH1cbiAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgbW9ja1N0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRCcmVhZGNydW1icyA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuc2V0UHJlZml4ID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRCdWNrZXQgPSB2aS5mbigpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0ZpbGVMaXN0JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICByZXNldE1vY2tTdG9yZVN0YXRlKClcbiAgICBtb2NrRGVib3VuY2VGblJ1bi5tb2NrQ2xlYXIoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHNlYXJjaCBpbnB1dCBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGNvbnRhaW5lciBzdHlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2gtWzQwMHB4XScpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgtY29sJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygncm91bmRlZC14bCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEhlYWRlciBjb21wb25lbnQgd2l0aCBzZWFyY2ggaW5wdXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpbGVzIHdoZW4gZmlsZUxpc3QgaGFzIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaWxlMS50eHQnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmaWxlLTInLCBuYW1lOiAnZmlsZTIudHh0JyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpbGUxLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZmlsZTIudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgd2hlbiBpc0xvYWRpbmcgaXMgdHJ1ZSBhbmQgZmlsZUxpc3QgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUxpc3Q6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTG9hZGluZyBjb21wb25lbnQgc2hvdWxkIGJlIHJlbmRlcmVkIHdpdGggc3Bpbi1hbmltYXRpb24gY2xhc3NcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNwaW4tYW5pbWF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVtcHR5IGZvbGRlciBzdGF0ZSB3aGVuIG5vdCBsb2FkaW5nIGFuZCBmaWxlTGlzdCBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUxpc3Q6IFtdLCBrZXl3b3JkczogJycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5lbXB0eUZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlbXB0eSBzZWFyY2ggcmVzdWx0IHdoZW4gbm90IGxvYWRpbmcsIGZpbGVMaXN0IGlzIGVtcHR5LCBhbmQga2V5d29yZHMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTG9hZGluZzogZmFsc2UsIGZpbGVMaXN0OiBbXSwga2V5d29yZHM6ICdzZWFyY2gtdGVybScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5lbXB0eVNlYXJjaFJlc3VsdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdmaWxlTGlzdCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGZpbGVzIGZyb20gZmlsZUxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMScsIG5hbWU6ICdhLnR4dCcgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMicsIG5hbWU6ICdiLnR4dCcgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMycsIG5hbWU6ICdjLnR4dCcgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBmaWxlTGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0OiBbXSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgZW1wdHkgZm9sZGVyIHN0YXRlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuZW1wdHlGb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3NlbGVjdGVkRmlsZUlkcyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBtYXJrIGZpbGVzIGFzIHNlbGVjdGVkIGJhc2VkIG9uIHNlbGVjdGVkRmlsZUlkcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZmlsZTEudHh0JyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmaWxlLTInLCBuYW1lOiAnZmlsZTIudHh0JyB9KSxcbiAgICAgICAgXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGZpbGVMaXN0LCBzZWxlY3RlZEZpbGVJZHM6IFsnZmlsZS0xJ10gfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFRoZSBjaGVja2JveCBmb3IgZmlsZS0xIHNob3VsZCBiZSBjaGVja2VkIChjaGVjayBpY29uIHByZXNlbnQpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrYm94LWZpbGUtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrLWljb24tZmlsZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gtZmlsZS0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjaGVjay1pY29uLWZpbGUtMicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2tleXdvcmRzIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgaW5wdXQgd2l0aCBrZXl3b3JkcyB2YWx1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGtleXdvcmRzOiAnbXktc2VhcmNoJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuICAgICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCdteS1zZWFyY2gnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2lzTG9hZGluZyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgd2hlbiBpc0xvYWRpbmcgaXMgdHJ1ZSB3aXRoIGVtcHR5IGxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0xvYWRpbmc6IHRydWUsIGZpbGVMaXN0OiBbXSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIExvYWRpbmcgY29tcG9uZW50IHdpdGggc3Bpbi1hbmltYXRpb24gY2xhc3NcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3Bpbi1hbmltYXRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgaW5kaWNhdG9yIGF0IGJvdHRvbSB3aGVuIGlzTG9hZGluZyBpcyB0cnVlIHdpdGggZmlsZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSgpXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTG9hZGluZzogdHJ1ZSwgZmlsZUxpc3QgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBzcGlubmVyIGljb24gYXQgdGhlIGJvdHRvbVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRpb24tc3BpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc3VwcG9ydEJhdGNoVXBsb2FkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVja2JveGVzIHdoZW4gc3VwcG9ydEJhdGNoVXBsb2FkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUxLnR4dCcgfSldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QsIHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2tib3ggY29tcG9uZW50IGhhcyBkYXRhLXRlc3RpZD1cImNoZWNrYm94LXtpZH1cIlxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveC1maWxlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcmFkaW8gYnV0dG9ucyB3aGVuIHN1cHBvcnRCYXRjaFVwbG9hZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZmlsZTEudHh0JyB9KV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCwgc3VwcG9ydEJhdGNoVXBsb2FkOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFJhZGlvIGlzIHJlbmRlcmVkIGFzIGEgZGl2IHdpdGggcm91bmRlZC1mdWxsIGNsYXNzXG4gICAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnJvdW5kZWQtZnVsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIC8vIEFuZCBjaGVja2JveCBzaG91bGQgbm90IGJlIHByZXNlbnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjaGVja2JveC1maWxlLTEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2lucHV0VmFsdWUgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgaW5wdXRWYWx1ZSB3aXRoIGtleXdvcmRzIHByb3AnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBrZXl3b3JkczogJ2luaXRpYWwta2V5d29yZCcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcbiAgICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZSgnaW5pdGlhbC1rZXl3b3JkJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIGlucHV0VmFsdWUgd2hlbiBpbnB1dCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsga2V5d29yZHM6ICcnIH0pXG4gICAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3LXZhbHVlJyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ25ldy12YWx1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnZGVib3VuY2VkIGtleXdvcmRzIHVwZGF0ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCB1cGRhdGVLZXl3b3JkcyB3aXRoIGRlYm91bmNlIHdoZW4gaW5wdXQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrVXBkYXRlS2V5d29yZHMgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdXBkYXRlS2V5d29yZHM6IG1vY2tVcGRhdGVLZXl3b3JkcyB9KVxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2RlYm91bmNlZC12YWx1ZScgfSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0RlYm91bmNlRm5SdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdkZWJvdW5jZWQtdmFsdWUnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFdmVudCBIYW5kbGVycyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdoYW5kbGVJbnB1dENoYW5nZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIGlucHV0VmFsdWUgb24gaW5wdXQgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICd0eXBlZC10ZXh0JyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ3R5cGVkLXRleHQnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGRlYm91bmNlZCB1cGRhdGVLZXl3b3JkcyBvbiBpbnB1dCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1VwZGF0ZUtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHVwZGF0ZUtleXdvcmRzOiBtb2NrVXBkYXRlS2V5d29yZHMgfSlcbiAgICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdzZWFyY2gtdGVybScgfSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0RlYm91bmNlRm5SdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdzZWFyY2gtdGVybScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBzZXF1ZW50aWFsIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja1VwZGF0ZUtleXdvcmRzID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHVwZGF0ZUtleXdvcmRzOiBtb2NrVXBkYXRlS2V5d29yZHMgfSlcbiAgICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhJyB9IH0pXG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYWInIH0gfSlcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYmMnIH0gfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tEZWJvdW5jZUZuUnVuKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgICAgZXhwZWN0KG1vY2tEZWJvdW5jZUZuUnVuKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoJ2FiYycpXG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2FiYycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlUmVzZXRLZXl3b3JkcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCByZXNldEtleXdvcmRzIHByb3Agd2hlbiBjbGVhciBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrUmVzZXRLZXl3b3JkcyA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyByZXNldEtleXdvcmRzOiBtb2NrUmVzZXRLZXl3b3Jkcywga2V5d29yZHM6ICd0by1yZXNldCcgfSlcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBDbGljayB0aGUgY2xlYXIgaWNvbiBkaXYgKGl0IGNvbnRhaW5zIFJpQ2xvc2VDaXJjbGVGaWxsIGljb24pXG4gICAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXSBzdmdbY2xhc3MqPVwiaC0zLjVcIl0nKT8ucGFyZW50RWxlbWVudFxuICAgICAgICBleHBlY3QoY2xlYXJCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsZWFyQnV0dG9uISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tSZXNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVzZXQgaW5wdXRWYWx1ZSB0byBlbXB0eSBzdHJpbmcgd2hlbiBjbGVhciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsga2V5d29yZHM6ICd0by1iZS1yZXNldCcgfSlcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnc29tZS1zZWFyY2gnIH0gfSlcblxuICAgICAgICAvLyBBY3QgLSBGaW5kIGFuZCBjbGljayB0aGUgY2xlYXIgaWNvblxuICAgICAgICBjb25zdCBjbGVhckJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0gc3ZnW2NsYXNzKj1cImgtMy41XCJdJyk/LnBhcmVudEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KGNsZWFyQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjbGVhckJ1dHRvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlU2VsZWN0RmlsZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTZWxlY3RGaWxlIHdoZW4gZmlsZSBpdGVtIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja0hhbmRsZVNlbGVjdEZpbGUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICd0ZXN0LnR4dCcgfSldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaGFuZGxlU2VsZWN0RmlsZTogbW9ja0hhbmRsZVNlbGVjdEZpbGUsIGZpbGVMaXN0IH0pXG4gICAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBDbGljayBvbiB0aGUgZmlsZSBpdGVtXG4gICAgICAgIGNvbnN0IGZpbGVJdGVtID0gc2NyZWVuLmdldEJ5VGV4dCgndGVzdC50eHQnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmlsZUl0ZW0uY2xvc2VzdCgnW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJykhKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVNlbGVjdEZpbGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBpZDogJ2ZpbGUtMScsXG4gICAgICAgICAgbmFtZTogJ3Rlc3QudHh0JyxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUsXG4gICAgICAgIH0pKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2hhbmRsZU9wZW5Gb2xkZXInLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlT3BlbkZvbGRlciB3aGVuIGZvbGRlciBpdGVtIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja0hhbmRsZU9wZW5Gb2xkZXIgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IGZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJ2ZvbGRlci0xJywgbmFtZTogJ215LWZvbGRlcicsIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyIH0pXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGhhbmRsZU9wZW5Gb2xkZXI6IG1vY2tIYW5kbGVPcGVuRm9sZGVyLCBmaWxlTGlzdCB9KVxuICAgICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gQ2xpY2sgb24gdGhlIGZvbGRlciBpdGVtXG4gICAgICAgIGNvbnN0IGZvbGRlckl0ZW0gPSBzY3JlZW4uZ2V0QnlUZXh0KCdteS1mb2xkZXInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZm9sZGVySXRlbS5jbG9zZXN0KCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKSEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlT3BlbkZvbGRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGlkOiAnZm9sZGVyLTEnLFxuICAgICAgICAgIG5hbWU6ICdteS1mb2xkZXInLFxuICAgICAgICAgIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyLFxuICAgICAgICB9KSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcga2V5d29yZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGtleXdvcmRzOiAnJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBrZXl3b3JkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNwZWNpYWxDaGFycyA9ICd0ZXN0W2ZpbGVdLnR4dCAoY29weSknXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGtleXdvcmRzOiBzcGVjaWFsQ2hhcnMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKHNwZWNpYWxDaGFycylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIGtleXdvcmRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdW5pY29kZUtleXdvcmRzID0gJ+aWh+S7tuaQnOe0oiDml6XmnKzoqp4nXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGtleXdvcmRzOiB1bmljb2RlS2V5d29yZHMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5zZWFyY2hQbGFjZWhvbGRlcicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKHVuaWNvZGVLZXl3b3JkcylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGZpbGUgbmFtZXMgaW4gZmlsZUxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nTmFtZSA9IGAkeydhJy5yZXBlYXQoMTAwKX0udHh0YFxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMScsIG5hbWU6IGxvbmdOYW1lIH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nTmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVyIG9mIGZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1MCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiBgZmlsZS0ke2l9YCwgbmFtZTogYGZpbGUtJHtpfS50eHRgIH0pKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgYSBmZXcgZmlsZXMgZXhpc3RcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmaWxlLTAudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmaWxlLTQ5LnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHdoaXRlc3BhY2Utb25seSBrZXl3b3JkcyBpbnB1dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnICAgJyB9IH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZSgnICAgJylcbiAgICAgIGV4cGVjdChtb2NrRGVib3VuY2VGblJ1bikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJyAgICcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWxsIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfSxcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH0sXG4gICAgICB7IGlzSW5QaXBlbGluZTogZmFsc2UsIHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSB9LFxuICAgICAgeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggaXNJblBpcGVsaW5lPSRpc0luUGlwZWxpbmUgYW5kIHN1cHBvcnRCYXRjaFVwbG9hZD0kc3VwcG9ydEJhdGNoVXBsb2FkJywgKHByb3BWYXJpYXRpb24pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHByb3BWYXJpYXRpb24pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuc2VhcmNoUGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgaXNMb2FkaW5nOiB0cnVlLCBmaWxlQ291bnQ6IDAsIGRlc2NyaXB0aW9uOiAnbG9hZGluZyBzdGF0ZSB3aXRoIG5vIGZpbGVzJyB9LFxuICAgICAgeyBpc0xvYWRpbmc6IGZhbHNlLCBmaWxlQ291bnQ6IDAsIGRlc2NyaXB0aW9uOiAnbm90IGxvYWRpbmcgd2l0aCBubyBmaWxlcycgfSxcbiAgICAgIHsgaXNMb2FkaW5nOiBmYWxzZSwgZmlsZUNvdW50OiAzLCBkZXNjcmlwdGlvbjogJ25vdCBsb2FkaW5nIHdpdGggZmlsZXMnIH0sXG4gICAgXSkoJ3Nob3VsZCBoYW5kbGUgJGRlc2NyaXB0aW9uIGNvcnJlY3RseScsICh7IGlzTG9hZGluZywgZmlsZUNvdW50IH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogZmlsZUNvdW50IH0sIChfLCBpKSA9PlxuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6IGBmaWxlLSR7aX1gLCBuYW1lOiBgZmlsZS0ke2l9LnR4dGAgfSkpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTG9hZGluZywgZmlsZUxpc3QgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGlmIChpc0xvYWRpbmcgJiYgZmlsZUNvdW50ID09PSAwKVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zcGluLWFuaW1hdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIGVsc2UgaWYgKCFpc0xvYWRpbmcgJiYgZmlsZUNvdW50ID09PSAwKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmVtcHR5Rm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZWxzZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZmlsZS0wLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBrZXl3b3JkczogJycsIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDAgfSxcbiAgICAgIHsga2V5d29yZHM6ICd0ZXN0Jywgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSB9LFxuICAgICAgeyBrZXl3b3JkczogJ25vdC1mb3VuZCcsIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDAgfSxcbiAgICBdKSgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aCBrZXl3b3Jkcz1cIiRrZXl3b3Jkc1wiIGFuZCBzZWFyY2hSZXN1bHRzTGVuZ3RoPSRzZWFyY2hSZXN1bHRzTGVuZ3RoJywgKHsga2V5d29yZHMsIHNlYXJjaFJlc3VsdHNMZW5ndGggfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBrZXl3b3Jkcywgc2VhcmNoUmVzdWx0c0xlbmd0aCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLnNlYXJjaFBsYWNlaG9sZGVyJylcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoa2V5d29yZHMpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRmlsZSBUeXBlIFZhcmlhdGlvbnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdGaWxlIFR5cGUgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb2xkZXIgdHlwZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmb2xkZXItMScsIG5hbWU6ICdteS1mb2xkZXInLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZvbGRlciB9KV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LWZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJ1Y2tldCB0eXBlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJ2J1Y2tldC0xJywgbmFtZTogJ215LWJ1Y2tldCcsIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0IH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktYnVja2V0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZmlsZSB3aXRoIHNpemUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAndGVzdC50eHQnLCBzaXplOiAxMDI0IH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBmaWxlTGlzdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGVzdC50eHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gZm9ybWF0RmlsZVNpemUgcmV0dXJucyAnMS4wMCBLQicgZm9yIDEwMjQgYnl0ZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxLjAwIEtCJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBjaGVja2JveCBmb3IgYnVja2V0IHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdidWNrZXQtMScsIG5hbWU6ICdteS1idWNrZXQnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCB9KV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZmlsZUxpc3QsIHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm8gY2hlY2tib3ggc2hvdWxkIGJlIHJlbmRlcmVkIGZvciBidWNrZXRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2NoZWNrYm94JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU2VhcmNoIFJlc3VsdHMgRGlzcGxheVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NlYXJjaCBSZXN1bHRzIERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHNlYXJjaCByZXN1bHRzIGNvdW50IHdoZW4ga2V5d29yZHMgYW5kIHJlc3VsdHMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDUsXG4gICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnXSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0UGlwZWxpbmVcXC5vbmxpbmVEcml2ZVxcLmJyZWFkY3J1bWJzXFwuc2VhcmNoUmVzdWx0LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHlcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlU2VsZWN0RmlsZSBjYWxsYmFjaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tIYW5kbGVTZWxlY3RGaWxlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZmlsZS0xJywgbmFtZTogJ3Rlc3QudHh0JyB9KV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaGFuZGxlU2VsZWN0RmlsZTogbW9ja0hhbmRsZVNlbGVjdEZpbGUsIGZpbGVMaXN0IH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEZpbGVMaXN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIG9uY2VcbiAgICAgIGNvbnN0IGZpbGVJdGVtID0gc2NyZWVuLmdldEJ5VGV4dCgndGVzdC50eHQnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpbGVJdGVtLmNsb3Nlc3QoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgYWdhaW5cbiAgICAgIGZpcmVFdmVudC5jbGljayhmaWxlSXRlbS5jbG9zZXN0KCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKSEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTZWxlY3RGaWxlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlT3BlbkZvbGRlciBjYWxsYmFjaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tIYW5kbGVPcGVuRm9sZGVyID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZm9sZGVyLTEnLCBuYW1lOiAnbXktZm9sZGVyJywgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5mb2xkZXIgfSldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGhhbmRsZU9wZW5Gb2xkZXI6IG1vY2tIYW5kbGVPcGVuRm9sZGVyLCBmaWxlTGlzdCB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxGaWxlTGlzdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBvbmNlXG4gICAgICBjb25zdCBmb2xkZXJJdGVtID0gc2NyZWVuLmdldEJ5VGV4dCgnbXktZm9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhmb2xkZXJJdGVtLmNsb3Nlc3QoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcig8RmlsZUxpc3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgYWdhaW5cbiAgICAgIGZpcmVFdmVudC5jbGljayhmb2xkZXJJdGVtLmNsb3Nlc3QoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0hhbmRsZU9wZW5Gb2xkZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG59KVxuIl19