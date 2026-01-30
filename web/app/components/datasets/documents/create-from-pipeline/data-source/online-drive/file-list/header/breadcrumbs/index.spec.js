"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock store - context provider requires mocking
const mockStoreState = {
    hasBucket: false,
    breadcrumbs: [],
    prefix: [],
    setOnlineDriveFileList: vi.fn(),
    setSelectedFileIds: vi.fn(),
    setBreadcrumbs: vi.fn(),
    setPrefix: vi.fn(),
    setBucket: vi.fn(),
};
const mockGetState = vi.fn(() => mockStoreState);
const mockDataSourceStore = { getState: mockGetState };
vi.mock('../../../../store', () => ({
    useDataSourceStore: () => mockDataSourceStore,
    useDataSourceStoreWithSelector: (selector) => selector(mockStoreState),
}));
const createDefaultProps = (overrides) => ({
    breadcrumbs: [],
    keywords: '',
    bucket: '',
    searchResultsLength: 0,
    isInPipeline: false,
    ...overrides,
});
// ==========================================
// Helper Functions
// ==========================================
const resetMockStoreState = () => {
    mockStoreState.hasBucket = false;
    mockStoreState.breadcrumbs = [];
    mockStoreState.prefix = [];
    mockStoreState.setOnlineDriveFileList = vi.fn();
    mockStoreState.setSelectedFileIds = vi.fn();
    mockStoreState.setBreadcrumbs = vi.fn();
    mockStoreState.setPrefix = vi.fn();
    mockStoreState.setBucket = vi.fn();
};
// ==========================================
// Test Suites
// ==========================================
describe('Breadcrumbs', () => {
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
            // Assert - Container should be in the document
            const container = document.querySelector('.flex.grow');
            expect(container).toBeInTheDocument();
        });
        it('should render with correct container styles', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('grow');
            expect(wrapper).toHaveClass('items-center');
            expect(wrapper).toHaveClass('overflow-hidden');
        });
        describe('Search Results Display', () => {
            it('should show search results when keywords and searchResultsLength > 0', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 5,
                    breadcrumbs: ['folder1'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Search result text should be displayed
                expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.breadcrumbs\.searchResult/)).toBeInTheDocument();
            });
            it('should not show search results when keywords is empty', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: '',
                    searchResultsLength: 5,
                    breadcrumbs: ['folder1'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText(/searchResult/)).not.toBeInTheDocument();
            });
            it('should not show search results when searchResultsLength is 0', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 0,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText(/searchResult/)).not.toBeInTheDocument();
            });
            it('should use bucket as folderName when breadcrumbs is empty', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 5,
                    breadcrumbs: [],
                    bucket: 'my-bucket',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should use bucket name in search result
                expect(react_1.screen.getByText(/searchResult.*my-bucket/i)).toBeInTheDocument();
            });
            it('should use last breadcrumb as folderName when breadcrumbs exist', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 5,
                    breadcrumbs: ['folder1', 'folder2'],
                    bucket: 'my-bucket',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should use last breadcrumb in search result
                expect(react_1.screen.getByText(/searchResult.*folder2/i)).toBeInTheDocument();
            });
        });
        describe('All Buckets Title Display', () => {
            it('should show all buckets title when hasBucket=true, bucket is empty, and no breadcrumbs', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    breadcrumbs: [],
                    bucket: '',
                    keywords: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('datasetPipeline.onlineDrive.breadcrumbs.allBuckets')).toBeInTheDocument();
            });
            it('should not show all buckets title when breadcrumbs exist', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1'],
                    bucket: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText('datasetPipeline.onlineDrive.breadcrumbs.allBuckets')).not.toBeInTheDocument();
            });
            it('should not show all buckets title when bucket is set', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    breadcrumbs: [],
                    bucket: 'my-bucket',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should show bucket name instead
                expect(react_1.screen.queryByText('datasetPipeline.onlineDrive.breadcrumbs.allBuckets')).not.toBeInTheDocument();
            });
        });
        describe('Bucket Component Display', () => {
            it('should render Bucket component when hasBucket and bucket are set', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'test-bucket',
                    breadcrumbs: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Bucket name should be displayed
                expect(react_1.screen.getByText('test-bucket')).toBeInTheDocument();
            });
            it('should not render Bucket when hasBucket is false', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    bucket: 'test-bucket',
                    breadcrumbs: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Bucket should not be displayed, Drive should be shown instead
                expect(react_1.screen.queryByText('test-bucket')).not.toBeInTheDocument();
            });
        });
        describe('Drive Component Display', () => {
            it('should render Drive component when hasBucket is false', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - "All Files" should be displayed
                expect(react_1.screen.getByText('datasetPipeline.onlineDrive.breadcrumbs.allFiles')).toBeInTheDocument();
            });
            it('should not render Drive component when hasBucket is true', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'test-bucket',
                    breadcrumbs: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText('datasetPipeline.onlineDrive.breadcrumbs.allFiles')).not.toBeInTheDocument();
            });
        });
        describe('BreadcrumbItem Display', () => {
            it('should render all breadcrumbs when not collapsed', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2'],
                    isInPipeline: false,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
            });
            it('should render last breadcrumb as active', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Last breadcrumb should have active styles
                const lastBreadcrumb = react_1.screen.getByText('folder2');
                expect(lastBreadcrumb).toHaveClass('system-sm-medium');
                expect(lastBreadcrumb).toHaveClass('text-text-secondary');
            });
            it('should render non-last breadcrumbs with tertiary styles', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - First breadcrumb should have tertiary styles
                const firstBreadcrumb = react_1.screen.getByText('folder1');
                expect(firstBreadcrumb).toHaveClass('system-sm-regular');
                expect(firstBreadcrumb).toHaveClass('text-text-tertiary');
            });
        });
        describe('Collapsed Breadcrumbs (Dropdown)', () => {
            it('should show dropdown when breadcrumbs exceed displayBreadcrumbNum', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3', 'folder4'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Dropdown trigger (more button) should be present
                expect(react_1.screen.getByRole('button', { name: '' })).toBeInTheDocument();
            });
            it('should not show dropdown when breadcrumbs do not exceed displayBreadcrumbNum', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should not have dropdown, just regular breadcrumbs
                // All breadcrumbs should be directly visible
                expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
                // Count buttons - should be 3 (allFiles + folder1 + folder2)
                const buttons = container.querySelectorAll('button');
                expect(buttons.length).toBe(3);
            });
            it('should show prefix breadcrumbs and last breadcrumb when collapsed', async () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3', 'folder4', 'folder5'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - First breadcrumb and last breadcrumb should be visible
                expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder5')).toBeInTheDocument();
                // Middle breadcrumbs should be in dropdown
                expect(react_1.screen.queryByText('folder3')).not.toBeInTheDocument();
                expect(react_1.screen.queryByText('folder4')).not.toBeInTheDocument();
            });
            it('should show collapsed breadcrumbs in dropdown when clicked', async () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3', 'folder4', 'folder5'],
                    isInPipeline: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click on dropdown trigger (the ... button)
                const dropdownTrigger = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
                if (dropdownTrigger)
                    react_1.fireEvent.click(dropdownTrigger);
                // Assert - Collapsed breadcrumbs should be visible
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder3')).toBeInTheDocument();
                    expect(react_1.screen.getByText('folder4')).toBeInTheDocument();
                });
            });
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('breadcrumbs prop', () => {
            it('should handle empty breadcrumbs array', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({ breadcrumbs: [] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Only Drive should be visible
                expect(react_1.screen.getByText('datasetPipeline.onlineDrive.breadcrumbs.allFiles')).toBeInTheDocument();
            });
            it('should handle single breadcrumb', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({ breadcrumbs: ['single-folder'] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('single-folder')).toBeInTheDocument();
            });
            it('should handle breadcrumbs with special characters', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder [1]', 'folder (copy)'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('folder [1]')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder (copy)')).toBeInTheDocument();
            });
            it('should handle breadcrumbs with unicode characters', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['文件夹', 'フォルダ'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('文件夹')).toBeInTheDocument();
                expect(react_1.screen.getByText('フォルダ')).toBeInTheDocument();
            });
        });
        describe('keywords prop', () => {
            it('should show search results when keywords is non-empty with results', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'search-term',
                    searchResultsLength: 10,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/searchResult/)).toBeInTheDocument();
            });
            it('should handle whitespace keywords', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: '   ',
                    searchResultsLength: 5,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Whitespace is truthy, so should show search results
                expect(react_1.screen.getByText(/searchResult/)).toBeInTheDocument();
            });
        });
        describe('bucket prop', () => {
            it('should display bucket name when hasBucket and bucket are set', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'production-bucket',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('production-bucket')).toBeInTheDocument();
            });
            it('should handle bucket with special characters', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'bucket-v2.0_backup',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('bucket-v2.0_backup')).toBeInTheDocument();
            });
        });
        describe('searchResultsLength prop', () => {
            it('should handle zero searchResultsLength', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 0,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should not show search results
                expect(react_1.screen.queryByText(/searchResult/)).not.toBeInTheDocument();
            });
            it('should handle large searchResultsLength', () => {
                // Arrange
                const props = createDefaultProps({
                    keywords: 'test',
                    searchResultsLength: 10000,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/searchResult.*10000/)).toBeInTheDocument();
            });
        });
        describe('isInPipeline prop', () => {
            it('should use displayBreadcrumbNum=2 when isInPipeline is true', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3'],
                    isInPipeline: true, // displayBreadcrumbNum = 2
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should collapse because 3 > 2
                // Dropdown should be present
                const buttons = react_1.screen.getAllByRole('button');
                const hasDropdownTrigger = buttons.some(btn => btn.querySelector('svg'));
                expect(hasDropdownTrigger).toBe(true);
            });
            it('should use displayBreadcrumbNum=3 when isInPipeline is false', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should NOT collapse because 3 <= 3
                expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder3')).toBeInTheDocument();
            });
            it('should reduce displayBreadcrumbNum by 1 when bucket is set', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3'],
                    bucket: 'my-bucket',
                    isInPipeline: false, // displayBreadcrumbNum = 3 - 1 = 2
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should collapse because 3 > 2
                const buttons = react_1.screen.getAllByRole('button');
                const hasDropdownTrigger = buttons.some(btn => btn.querySelector('svg'));
                expect(hasDropdownTrigger).toBe(true);
            });
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies Tests
    // ==========================================
    describe('Memoization Logic and Dependencies', () => {
        describe('displayBreadcrumbNum useMemo', () => {
            it('should calculate correct value when isInPipeline=false and no bucket', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['a', 'b', 'c', 'd'],
                    isInPipeline: false,
                    bucket: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - displayBreadcrumbNum = 3, so 4 breadcrumbs should collapse
                // First 2 visible, dropdown, last 1 visible
                expect(react_1.screen.getByText('a')).toBeInTheDocument();
                expect(react_1.screen.getByText('b')).toBeInTheDocument();
                expect(react_1.screen.getByText('d')).toBeInTheDocument();
                expect(react_1.screen.queryByText('c')).not.toBeInTheDocument();
            });
            it('should calculate correct value when isInPipeline=true and no bucket', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['a', 'b', 'c'],
                    isInPipeline: true,
                    bucket: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - displayBreadcrumbNum = 2, so 3 breadcrumbs should collapse
                expect(react_1.screen.getByText('a')).toBeInTheDocument();
                expect(react_1.screen.getByText('c')).toBeInTheDocument();
                expect(react_1.screen.queryByText('b')).not.toBeInTheDocument();
            });
            it('should calculate correct value when isInPipeline=false and bucket exists', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    breadcrumbs: ['a', 'b', 'c'],
                    isInPipeline: false,
                    bucket: 'my-bucket',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - displayBreadcrumbNum = 3 - 1 = 2, so 3 breadcrumbs should collapse
                expect(react_1.screen.getByText('a')).toBeInTheDocument();
                expect(react_1.screen.getByText('c')).toBeInTheDocument();
                expect(react_1.screen.queryByText('b')).not.toBeInTheDocument();
            });
        });
        describe('breadcrumbsConfig useMemo', () => {
            it('should correctly split breadcrumbs when collapsed', async () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['f1', 'f2', 'f3', 'f4', 'f5'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click dropdown to see collapsed items
                const dropdownTrigger = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
                if (dropdownTrigger)
                    react_1.fireEvent.click(dropdownTrigger);
                // Assert
                // prefixBreadcrumbs = ['f1', 'f2']
                // collapsedBreadcrumbs = ['f3', 'f4']
                // lastBreadcrumb = 'f5'
                expect(react_1.screen.getByText('f1')).toBeInTheDocument();
                expect(react_1.screen.getByText('f2')).toBeInTheDocument();
                expect(react_1.screen.getByText('f5')).toBeInTheDocument();
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('f3')).toBeInTheDocument();
                    expect(react_1.screen.getByText('f4')).toBeInTheDocument();
                });
            });
            it('should not collapse when breadcrumbs.length <= displayBreadcrumbNum', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['f1', 'f2'],
                    isInPipeline: false, // displayBreadcrumbNum = 3
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - All breadcrumbs should be visible
                expect(react_1.screen.getByText('f1')).toBeInTheDocument();
                expect(react_1.screen.getByText('f2')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Callback Stability and Event Handlers Tests
    // ==========================================
    describe('Callback Stability and Event Handlers', () => {
        describe('handleBackToBucketList', () => {
            it('should reset store state when called', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'my-bucket',
                    breadcrumbs: [],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click bucket icon button (first button in Bucket component)
                const buttons = react_1.screen.getAllByRole('button');
                react_1.fireEvent.click(buttons[0]); // Bucket icon button
                // Assert
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBucket).toHaveBeenCalledWith('');
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith([]);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith([]);
            });
        });
        describe('handleClickBucketName', () => {
            it('should reset breadcrumbs and prefix when bucket name is clicked', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'my-bucket',
                    breadcrumbs: ['folder1'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click bucket name button
                const bucketButton = react_1.screen.getByText('my-bucket');
                react_1.fireEvent.click(bucketButton);
                // Assert
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith([]);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith([]);
            });
            it('should not call handler when bucket is disabled (no breadcrumbs)', () => {
                // Arrange
                mockStoreState.hasBucket = true;
                const props = createDefaultProps({
                    bucket: 'my-bucket',
                    breadcrumbs: [], // disabled when no breadcrumbs
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click bucket name button (should be disabled)
                const bucketButton = react_1.screen.getByText('my-bucket');
                react_1.fireEvent.click(bucketButton);
                // Assert - Store methods should NOT be called because button is disabled
                expect(mockStoreState.setOnlineDriveFileList).not.toHaveBeenCalled();
            });
        });
        describe('handleBackToRoot', () => {
            it('should reset state when Drive button is clicked', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click "All Files" button
                const driveButton = react_1.screen.getByText('datasetPipeline.onlineDrive.breadcrumbs.allFiles');
                react_1.fireEvent.click(driveButton);
                // Assert
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith([]);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith([]);
            });
        });
        describe('handleClickBreadcrumb', () => {
            it('should slice breadcrumbs and prefix when breadcrumb is clicked', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                mockStoreState.breadcrumbs = ['folder1', 'folder2', 'folder3'];
                mockStoreState.prefix = ['prefix1', 'prefix2', 'prefix3'];
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2', 'folder3'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click on first breadcrumb (index 0)
                const firstBreadcrumb = react_1.screen.getByText('folder1');
                react_1.fireEvent.click(firstBreadcrumb);
                // Assert - Should slice to index 0 + 1 = 1
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith(['folder1']);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith(['prefix1']);
            });
            it('should not call handler when last breadcrumb is clicked (disabled)', () => {
                // Arrange
                mockStoreState.hasBucket = false;
                const props = createDefaultProps({
                    breadcrumbs: ['folder1', 'folder2'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Click on last breadcrumb (should be disabled)
                const lastBreadcrumb = react_1.screen.getByText('folder2');
                react_1.fireEvent.click(lastBreadcrumb);
                // Assert - Store methods should NOT be called
                expect(mockStoreState.setBreadcrumbs).not.toHaveBeenCalled();
            });
            it('should handle click on collapsed breadcrumb from dropdown', async () => {
                // Arrange
                mockStoreState.hasBucket = false;
                mockStoreState.breadcrumbs = ['f1', 'f2', 'f3', 'f4', 'f5'];
                mockStoreState.prefix = ['p1', 'p2', 'p3', 'p4', 'p5'];
                const props = createDefaultProps({
                    breadcrumbs: ['f1', 'f2', 'f3', 'f4', 'f5'],
                    isInPipeline: false,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and click on collapsed breadcrumb (f3, index=2)
                const dropdownTrigger = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
                if (dropdownTrigger)
                    react_1.fireEvent.click(dropdownTrigger);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('f3')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText('f3'));
                // Assert - Should slice to index 2 + 1 = 3
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith(['f1', 'f2', 'f3']);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith(['p1', 'p2', 'p3']);
            });
        });
    });
    // ==========================================
    // Component Memoization Tests
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(index_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should not re-render when props are the same', () => {
            // Arrange
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rerender with same props
            rerender(<index_1.default {...props}/>);
            // Assert - Component should render without errors
            const container = document.querySelector('.flex.grow');
            expect(container).toBeInTheDocument();
        });
        it('should re-render when breadcrumbs change', () => {
            // Arrange
            mockStoreState.hasBucket = false;
            const props = createDefaultProps({ breadcrumbs: ['folder1'] });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
            // Act - Rerender with different breadcrumbs
            rerender(<index_1.default {...createDefaultProps({ breadcrumbs: ['folder2'] })}/>);
            // Assert
            expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases and Error Handling Tests
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle very long breadcrumb names', () => {
            // Arrange
            mockStoreState.hasBucket = false;
            const longName = 'a'.repeat(100);
            const props = createDefaultProps({
                breadcrumbs: [longName],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle many breadcrumbs', async () => {
            // Arrange
            mockStoreState.hasBucket = false;
            const manyBreadcrumbs = Array.from({ length: 20 }, (_, i) => `folder-${i}`);
            const props = createDefaultProps({
                breadcrumbs: manyBreadcrumbs,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open dropdown
            const dropdownTrigger = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            if (dropdownTrigger)
                react_1.fireEvent.click(dropdownTrigger);
            // Assert - First, last, and collapsed should be accessible
            expect(react_1.screen.getByText('folder-0')).toBeInTheDocument();
            expect(react_1.screen.getByText('folder-1')).toBeInTheDocument();
            expect(react_1.screen.getByText('folder-19')).toBeInTheDocument();
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder-2')).toBeInTheDocument();
            });
        });
        it('should handle empty bucket string', () => {
            // Arrange
            mockStoreState.hasBucket = true;
            const props = createDefaultProps({
                bucket: '',
                breadcrumbs: [],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show all buckets title
            expect(react_1.screen.getByText('datasetPipeline.onlineDrive.breadcrumbs.allBuckets')).toBeInTheDocument();
        });
        it('should handle breadcrumb with only whitespace', () => {
            // Arrange
            mockStoreState.hasBucket = false;
            const props = createDefaultProps({
                breadcrumbs: ['   ', 'normal-folder'],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Both should be rendered
            expect(react_1.screen.getByText('normal-folder')).toBeInTheDocument();
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { hasBucket: true, bucket: 'b1', breadcrumbs: [], expected: 'bucket visible' },
            { hasBucket: true, bucket: '', breadcrumbs: [], expected: 'all buckets title' },
            { hasBucket: false, bucket: '', breadcrumbs: [], expected: 'all files' },
            { hasBucket: false, bucket: '', breadcrumbs: ['f1'], expected: 'drive with breadcrumb' },
        ])('should render correctly for $expected', ({ hasBucket, bucket, breadcrumbs }) => {
            // Arrange
            mockStoreState.hasBucket = hasBucket;
            const props = createDefaultProps({ bucket, breadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Component should render without errors
            const container = document.querySelector('.flex.grow');
            expect(container).toBeInTheDocument();
        });
        it.each([
            { isInPipeline: true, bucket: '', expectedNum: 2 },
            { isInPipeline: false, bucket: '', expectedNum: 3 },
            { isInPipeline: true, bucket: 'b', expectedNum: 1 },
            { isInPipeline: false, bucket: 'b', expectedNum: 2 },
        ])('should calculate displayBreadcrumbNum=$expectedNum when isInPipeline=$isInPipeline and bucket=$bucket', ({ isInPipeline, bucket, expectedNum }) => {
            // Arrange
            mockStoreState.hasBucket = !!bucket;
            const breadcrumbs = Array.from({ length: expectedNum + 2 }, (_, i) => `f${i}`);
            const props = createDefaultProps({ isInPipeline, bucket, breadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should collapse because breadcrumbs.length > expectedNum
            const buttons = react_1.screen.getAllByRole('button');
            const hasDropdownTrigger = buttons.some(btn => btn.querySelector('svg'));
            expect(hasDropdownTrigger).toBe(true);
        });
    });
    // ==========================================
    // Integration Tests
    // ==========================================
    describe('Integration', () => {
        it('should handle full navigation flow: bucket -> folders -> navigation back', () => {
            // Arrange
            mockStoreState.hasBucket = true;
            mockStoreState.breadcrumbs = ['folder1', 'folder2'];
            mockStoreState.prefix = ['prefix1', 'prefix2'];
            const props = createDefaultProps({
                bucket: 'my-bucket',
                breadcrumbs: ['folder1', 'folder2'],
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click on first folder to navigate back
            const firstFolder = react_1.screen.getByText('folder1');
            react_1.fireEvent.click(firstFolder);
            // Assert
            expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith(['folder1']);
            expect(mockStoreState.setPrefix).toHaveBeenCalledWith(['prefix1']);
        });
        it('should handle search result display with navigation elements hidden', () => {
            // Arrange
            mockStoreState.hasBucket = true;
            const props = createDefaultProps({
                keywords: 'test',
                searchResultsLength: 5,
                bucket: 'my-bucket',
                breadcrumbs: ['folder1'],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Search result should be shown, navigation elements should be hidden
            expect(react_1.screen.getByText(/searchResult/)).toBeInTheDocument();
            expect(react_1.screen.queryByText('my-bucket')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixtQ0FBaUM7QUFFakMsNkNBQTZDO0FBQzdDLGVBQWU7QUFDZiw2Q0FBNkM7QUFFN0MsZ0VBQWdFO0FBRWhFLGlEQUFpRDtBQUNqRCxNQUFNLGNBQWMsR0FBRztJQUNyQixTQUFTLEVBQUUsS0FBSztJQUNoQixXQUFXLEVBQUUsRUFBYztJQUMzQixNQUFNLEVBQUUsRUFBYztJQUN0QixzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQy9CLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDM0IsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDbkIsQ0FBQTtBQUVELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDaEQsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQTtBQUV0RCxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsbUJBQW1CO0lBQzdDLDhCQUE4QixFQUFFLENBQUMsUUFBK0MsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztDQUM5RyxDQUFDLENBQUMsQ0FBQTtBQU9ILE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFxQyxFQUFvQixFQUFFLENBQUMsQ0FBQztJQUN2RixXQUFXLEVBQUUsRUFBRTtJQUNmLFFBQVEsRUFBRSxFQUFFO0lBQ1osTUFBTSxFQUFF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QVcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQy9DLGlCQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBRTVCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtZQUN2RSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7WUFDN0UsVUFBVTtZQUNWLGNBQWMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBO1lBQy9CLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUMvQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsbUJBQW1CLEVBQUUsQ0FBQztnQkFDdEIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUN6QixDQUFDLENBQUE7WUFFRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbEMsK0VBQStFO1lBQy9FLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM1RCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2pFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQnJlYWRjcnVtYnMgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIE1vZHVsZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBOb3RlOiByZWFjdC1pMThuZXh0IHVzZXMgZ2xvYmFsIG1vY2sgZnJvbSB3ZWIvdml0ZXN0LnNldHVwLnRzXG5cbi8vIE1vY2sgc3RvcmUgLSBjb250ZXh0IHByb3ZpZGVyIHJlcXVpcmVzIG1vY2tpbmdcbmNvbnN0IG1vY2tTdG9yZVN0YXRlID0ge1xuICBoYXNCdWNrZXQ6IGZhbHNlLFxuICBicmVhZGNydW1iczogW10gYXMgc3RyaW5nW10sXG4gIHByZWZpeDogW10gYXMgc3RyaW5nW10sXG4gIHNldE9ubGluZURyaXZlRmlsZUxpc3Q6IHZpLmZuKCksXG4gIHNldFNlbGVjdGVkRmlsZUlkczogdmkuZm4oKSxcbiAgc2V0QnJlYWRjcnVtYnM6IHZpLmZuKCksXG4gIHNldFByZWZpeDogdmkuZm4oKSxcbiAgc2V0QnVja2V0OiB2aS5mbigpLFxufVxuXG5jb25zdCBtb2NrR2V0U3RhdGUgPSB2aS5mbigoKSA9PiBtb2NrU3RvcmVTdGF0ZSlcbmNvbnN0IG1vY2tEYXRhU291cmNlU3RvcmUgPSB7IGdldFN0YXRlOiBtb2NrR2V0U3RhdGUgfVxuXG52aS5tb2NrKCcuLi8uLi8uLi8uLi9zdG9yZScsICgpID0+ICh7XG4gIHVzZURhdGFTb3VyY2VTdG9yZTogKCkgPT4gbW9ja0RhdGFTb3VyY2VTdG9yZSxcbiAgdXNlRGF0YVNvdXJjZVN0b3JlV2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzOiB0eXBlb2YgbW9ja1N0b3JlU3RhdGUpID0+IHVua25vd24pID0+IHNlbGVjdG9yKG1vY2tTdG9yZVN0YXRlKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBCdWlsZGVyc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG50eXBlIEJyZWFkY3J1bWJzUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgQnJlYWRjcnVtYnM+XG5cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEJyZWFkY3J1bWJzUHJvcHM+KTogQnJlYWRjcnVtYnNQcm9wcyA9PiAoe1xuICBicmVhZGNydW1iczogW10sXG4gIGtleXdvcmRzOiAnJyxcbiAgYnVja2V0OiAnJyxcbiAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMCxcbiAgaXNJblBpcGVsaW5lOiBmYWxzZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIZWxwZXIgRnVuY3Rpb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IHJlc2V0TW9ja1N0b3JlU3RhdGUgPSAoKSA9PiB7XG4gIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gIG1vY2tTdG9yZVN0YXRlLmJyZWFkY3J1bWJzID0gW11cbiAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gW11cbiAgbW9ja1N0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRCcmVhZGNydW1icyA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuc2V0UHJlZml4ID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRCdWNrZXQgPSB2aS5mbigpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0JyZWFkY3J1bWJzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICByZXNldE1vY2tTdG9yZVN0YXRlKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb250YWluZXIgc2hvdWxkIGJlIGluIHRoZSBkb2N1bWVudFxuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZsZXguZ3JvdycpXG4gICAgICBleHBlY3QoY29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggY29ycmVjdCBjb250YWluZXIgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgnKVxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdncm93JylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnaXRlbXMtY2VudGVyJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJylcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1NlYXJjaCBSZXN1bHRzIERpc3BsYXknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgc2VhcmNoIHJlc3VsdHMgd2hlbiBrZXl3b3JkcyBhbmQgc2VhcmNoUmVzdWx0c0xlbmd0aCA+IDAnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSxcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTZWFyY2ggcmVzdWx0IHRleHQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5icmVhZGNydW1ic1xcLnNlYXJjaFJlc3VsdC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHNlYXJjaCByZXN1bHRzIHdoZW4ga2V5d29yZHMgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAnJyxcbiAgICAgICAgICBzZWFyY2hSZXN1bHRzTGVuZ3RoOiA1LFxuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnXSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9zZWFyY2hSZXN1bHQvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgc2VhcmNoIHJlc3VsdHMgd2hlbiBzZWFyY2hSZXN1bHRzTGVuZ3RoIGlzIDAnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMCxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9zZWFyY2hSZXN1bHQvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGJ1Y2tldCBhcyBmb2xkZXJOYW1lIHdoZW4gYnJlYWRjcnVtYnMgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSxcbiAgICAgICAgICBicmVhZGNydW1iczogW10sXG4gICAgICAgICAgYnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCB1c2UgYnVja2V0IG5hbWUgaW4gc2VhcmNoIHJlc3VsdFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2VhcmNoUmVzdWx0LipteS1idWNrZXQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGxhc3QgYnJlYWRjcnVtYiBhcyBmb2xkZXJOYW1lIHdoZW4gYnJlYWRjcnVtYnMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSxcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSBsYXN0IGJyZWFkY3J1bWIgaW4gc2VhcmNoIHJlc3VsdFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2VhcmNoUmVzdWx0Lipmb2xkZXIyL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQWxsIEJ1Y2tldHMgVGl0bGUgRGlzcGxheScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBhbGwgYnVja2V0cyB0aXRsZSB3aGVuIGhhc0J1Y2tldD10cnVlLCBidWNrZXQgaXMgZW1wdHksIGFuZCBubyBicmVhZGNydW1icycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogW10sXG4gICAgICAgICAgYnVja2V0OiAnJyxcbiAgICAgICAgICBrZXl3b3JkczogJycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5hbGxCdWNrZXRzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgYWxsIGJ1Y2tldHMgdGl0bGUgd2hlbiBicmVhZGNydW1icyBleGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJ10sXG4gICAgICAgICAgYnVja2V0OiAnJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuYWxsQnVja2V0cycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBhbGwgYnVja2V0cyB0aXRsZSB3aGVuIGJ1Y2tldCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gdHJ1ZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFtdLFxuICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBidWNrZXQgbmFtZSBpbnN0ZWFkXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5hbGxCdWNrZXRzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQnVja2V0IENvbXBvbmVudCBEaXNwbGF5JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgQnVja2V0IGNvbXBvbmVudCB3aGVuIGhhc0J1Y2tldCBhbmQgYnVja2V0IGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gdHJ1ZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnVja2V0OiAndGVzdC1idWNrZXQnLFxuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbXSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEJ1Y2tldCBuYW1lIHNob3VsZCBiZSBkaXNwbGF5ZWRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QtYnVja2V0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBCdWNrZXQgd2hlbiBoYXNCdWNrZXQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJ1Y2tldDogJ3Rlc3QtYnVja2V0JyxcbiAgICAgICAgICBicmVhZGNydW1iczogW10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBCdWNrZXQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQsIERyaXZlIHNob3VsZCBiZSBzaG93biBpbnN0ZWFkXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3Rlc3QtYnVja2V0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRHJpdmUgQ29tcG9uZW50IERpc3BsYXknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBEcml2ZSBjb21wb25lbnQgd2hlbiBoYXNCdWNrZXQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbXSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFwiQWxsIEZpbGVzXCIgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLmFsbEZpbGVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBEcml2ZSBjb21wb25lbnQgd2hlbiBoYXNCdWNrZXQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBidWNrZXQ6ICd0ZXN0LWJ1Y2tldCcsXG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFtdLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5hbGxGaWxlcycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0JyZWFkY3J1bWJJdGVtIERpc3BsYXknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgYnJlYWRjcnVtYnMgd2hlbiBub3QgY29sbGFwc2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgICAgICBpc0luUGlwZWxpbmU6IGZhbHNlLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgbGFzdCBicmVhZGNydW1iIGFzIGFjdGl2ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMScsICdmb2xkZXIyJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBMYXN0IGJyZWFkY3J1bWIgc2hvdWxkIGhhdmUgYWN0aXZlIHN0eWxlc1xuICAgICAgICBjb25zdCBsYXN0QnJlYWRjcnVtYiA9IHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjInKVxuICAgICAgICBleHBlY3QobGFzdEJyZWFkY3J1bWIpLnRvSGF2ZUNsYXNzKCdzeXN0ZW0tc20tbWVkaXVtJylcbiAgICAgICAgZXhwZWN0KGxhc3RCcmVhZGNydW1iKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXNlY29uZGFyeScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBub24tbGFzdCBicmVhZGNydW1icyB3aXRoIHRlcnRpYXJ5IHN0eWxlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMScsICdmb2xkZXIyJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBGaXJzdCBicmVhZGNydW1iIHNob3VsZCBoYXZlIHRlcnRpYXJ5IHN0eWxlc1xuICAgICAgICBjb25zdCBmaXJzdEJyZWFkY3J1bWIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJylcbiAgICAgICAgZXhwZWN0KGZpcnN0QnJlYWRjcnVtYikudG9IYXZlQ2xhc3MoJ3N5c3RlbS1zbS1yZWd1bGFyJylcbiAgICAgICAgZXhwZWN0KGZpcnN0QnJlYWRjcnVtYikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29sbGFwc2VkIEJyZWFkY3J1bWJzIChEcm9wZG93biknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgZHJvcGRvd24gd2hlbiBicmVhZGNydW1icyBleGNlZWQgZGlzcGxheUJyZWFkY3J1bWJOdW0nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMicsICdmb2xkZXIzJywgJ2ZvbGRlcjQnXSxcbiAgICAgICAgICBpc0luUGlwZWxpbmU6IGZhbHNlLCAvLyBkaXNwbGF5QnJlYWRjcnVtYk51bSA9IDNcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIERyb3Bkb3duIHRyaWdnZXIgKG1vcmUgYnV0dG9uKSBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBkcm9wZG93biB3aGVuIGJyZWFkY3J1bWJzIGRvIG5vdCBleGNlZWQgZGlzcGxheUJyZWFkY3J1bWJOdW0nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMiddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsIC8vIGRpc3BsYXlCcmVhZGNydW1iTnVtID0gM1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgaGF2ZSBkcm9wZG93biwganVzdCByZWd1bGFyIGJyZWFkY3J1bWJzXG4gICAgICAgIC8vIEFsbCBicmVhZGNydW1icyBzaG91bGQgYmUgZGlyZWN0bHkgdmlzaWJsZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgLy8gQ291bnQgYnV0dG9ucyAtIHNob3VsZCBiZSAzIChhbGxGaWxlcyArIGZvbGRlcjEgKyBmb2xkZXIyKVxuICAgICAgICBjb25zdCBidXR0b25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChidXR0b25zLmxlbmd0aCkudG9CZSgzKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHByZWZpeCBicmVhZGNydW1icyBhbmQgbGFzdCBicmVhZGNydW1iIHdoZW4gY29sbGFwc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInLCAnZm9sZGVyMycsICdmb2xkZXI0JywgJ2ZvbGRlcjUnXSxcbiAgICAgICAgICBpc0luUGlwZWxpbmU6IGZhbHNlLCAvLyBkaXNwbGF5QnJlYWRjcnVtYk51bSA9IDNcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEZpcnN0IGJyZWFkY3J1bWIgYW5kIGxhc3QgYnJlYWRjcnVtYiBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAvLyBNaWRkbGUgYnJlYWRjcnVtYnMgc2hvdWxkIGJlIGluIGRyb3Bkb3duXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2ZvbGRlcjMnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZm9sZGVyNCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGNvbGxhcHNlZCBicmVhZGNydW1icyBpbiBkcm9wZG93biB3aGVuIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMicsICdmb2xkZXIzJywgJ2ZvbGRlcjQnLCAnZm9sZGVyNSddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBDbGljayBvbiBkcm9wZG93biB0cmlnZ2VyICh0aGUgLi4uIGJ1dHRvbilcbiAgICAgICAgY29uc3QgZHJvcGRvd25UcmlnZ2VyID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT4gYnRuLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKVxuICAgICAgICBpZiAoZHJvcGRvd25UcmlnZ2VyKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhkcm9wZG93blRyaWdnZXIpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ29sbGFwc2VkIGJyZWFkY3J1bWJzIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnYnJlYWRjcnVtYnMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGJyZWFkY3J1bWJzIGFycmF5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFtdIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBPbmx5IERyaXZlIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub25saW5lRHJpdmUuYnJlYWRjcnVtYnMuYWxsRmlsZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIGJyZWFkY3J1bWInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogWydzaW5nbGUtZm9sZGVyJ10gfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc2luZ2xlLWZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyIFsxXScsICdmb2xkZXIgKGNvcHkpJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlciBbMV0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyIChjb3B5KScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsn5paH5Lu25aS5JywgJ+ODleOCqeODq+ODgCddLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfmlofku7blpLknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn44OV44Kp44Or44OAJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdrZXl3b3JkcyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IHNlYXJjaCByZXN1bHRzIHdoZW4ga2V5d29yZHMgaXMgbm9uLWVtcHR5IHdpdGggcmVzdWx0cycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAga2V5d29yZHM6ICdzZWFyY2gtdGVybScsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMTAsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NlYXJjaFJlc3VsdC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB3aGl0ZXNwYWNlIGtleXdvcmRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBrZXl3b3JkczogJyAgICcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogNSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFdoaXRlc3BhY2UgaXMgdHJ1dGh5LCBzbyBzaG91bGQgc2hvdyBzZWFyY2ggcmVzdWx0c1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2VhcmNoUmVzdWx0LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdidWNrZXQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBidWNrZXQgbmFtZSB3aGVuIGhhc0J1Y2tldCBhbmQgYnVja2V0IGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gdHJ1ZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnVja2V0OiAncHJvZHVjdGlvbi1idWNrZXQnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwcm9kdWN0aW9uLWJ1Y2tldCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBidWNrZXQgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gdHJ1ZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnVja2V0OiAnYnVja2V0LXYyLjBfYmFja3VwJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYnVja2V0LXYyLjBfYmFja3VwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzZWFyY2hSZXN1bHRzTGVuZ3RoIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB6ZXJvIHNlYXJjaFJlc3VsdHNMZW5ndGgnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMCxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3Qgc2hvdyBzZWFyY2ggcmVzdWx0c1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9zZWFyY2hSZXN1bHQvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIHNlYXJjaFJlc3VsdHNMZW5ndGgnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgICAgc2VhcmNoUmVzdWx0c0xlbmd0aDogMTAwMDAsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NlYXJjaFJlc3VsdC4qMTAwMDAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2lzSW5QaXBlbGluZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgZGlzcGxheUJyZWFkY3J1bWJOdW09MiB3aGVuIGlzSW5QaXBlbGluZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInLCAnZm9sZGVyMyddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogdHJ1ZSwgLy8gZGlzcGxheUJyZWFkY3J1bWJOdW0gPSAyXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgY29sbGFwc2UgYmVjYXVzZSAzID4gMlxuICAgICAgICAvLyBEcm9wZG93biBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgY29uc3QgaGFzRHJvcGRvd25UcmlnZ2VyID0gYnV0dG9ucy5zb21lKGJ0biA9PiBidG4ucXVlcnlTZWxlY3Rvcignc3ZnJykpXG4gICAgICAgIGV4cGVjdChoYXNEcm9wZG93blRyaWdnZXIpLnRvQmUodHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGRpc3BsYXlCcmVhZGNydW1iTnVtPTMgd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMicsICdmb2xkZXIzJ10sXG4gICAgICAgICAgaXNJblBpcGVsaW5lOiBmYWxzZSwgLy8gZGlzcGxheUJyZWFkY3J1bWJOdW0gPSAzXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgTk9UIGNvbGxhcHNlIGJlY2F1c2UgMyA8PSAzXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlZHVjZSBkaXNwbGF5QnJlYWRjcnVtYk51bSBieSAxIHdoZW4gYnVja2V0IGlzIHNldCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInLCAnZm9sZGVyMyddLFxuICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgaXNJblBpcGVsaW5lOiBmYWxzZSwgLy8gZGlzcGxheUJyZWFkY3J1bWJOdW0gPSAzIC0gMSA9IDJcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBjb2xsYXBzZSBiZWNhdXNlIDMgPiAyXG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgICBjb25zdCBoYXNEcm9wZG93blRyaWdnZXIgPSBidXR0b25zLnNvbWUoYnRuID0+IGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSlcbiAgICAgICAgZXhwZWN0KGhhc0Ryb3Bkb3duVHJpZ2dlcikudG9CZSh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBMb2dpYyBhbmQgRGVwZW5kZW5jaWVzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gTG9naWMgYW5kIERlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnZGlzcGxheUJyZWFkY3J1bWJOdW0gdXNlTWVtbycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsY3VsYXRlIGNvcnJlY3QgdmFsdWUgd2hlbiBpc0luUGlwZWxpbmU9ZmFsc2UgYW5kIG5vIGJ1Y2tldCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnYScsICdiJywgJ2MnLCAnZCddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICAgICAgYnVja2V0OiAnJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGRpc3BsYXlCcmVhZGNydW1iTnVtID0gMywgc28gNCBicmVhZGNydW1icyBzaG91bGQgY29sbGFwc2VcbiAgICAgICAgLy8gRmlyc3QgMiB2aXNpYmxlLCBkcm9wZG93biwgbGFzdCAxIHZpc2libGVcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29ycmVjdCB2YWx1ZSB3aGVuIGlzSW5QaXBlbGluZT10cnVlIGFuZCBubyBidWNrZXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICAgICAgaXNJblBpcGVsaW5lOiB0cnVlLFxuICAgICAgICAgIGJ1Y2tldDogJycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBkaXNwbGF5QnJlYWRjcnVtYk51bSA9IDIsIHNvIDMgYnJlYWRjcnVtYnMgc2hvdWxkIGNvbGxhcHNlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGN1bGF0ZSBjb3JyZWN0IHZhbHVlIHdoZW4gaXNJblBpcGVsaW5lPWZhbHNlIGFuZCBidWNrZXQgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IHRydWVcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2EnLCAnYicsICdjJ10sXG4gICAgICAgICAgaXNJblBpcGVsaW5lOiBmYWxzZSxcbiAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gZGlzcGxheUJyZWFkY3J1bWJOdW0gPSAzIC0gMSA9IDIsIHNvIDMgYnJlYWRjcnVtYnMgc2hvdWxkIGNvbGxhcHNlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnYnJlYWRjcnVtYnNDb25maWcgdXNlTWVtbycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IHNwbGl0IGJyZWFkY3J1bWJzIHdoZW4gY29sbGFwc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmMScsICdmMicsICdmMycsICdmNCcsICdmNSddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsIC8vIGRpc3BsYXlCcmVhZGNydW1iTnVtID0gM1xuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gQ2xpY2sgZHJvcGRvd24gdG8gc2VlIGNvbGxhcHNlZCBpdGVtc1xuICAgICAgICBjb25zdCBkcm9wZG93blRyaWdnZXIgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5maW5kKGJ0biA9PiBidG4ucXVlcnlTZWxlY3Rvcignc3ZnJykpXG4gICAgICAgIGlmIChkcm9wZG93blRyaWdnZXIpXG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGRyb3Bkb3duVHJpZ2dlcilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgLy8gcHJlZml4QnJlYWRjcnVtYnMgPSBbJ2YxJywgJ2YyJ11cbiAgICAgICAgLy8gY29sbGFwc2VkQnJlYWRjcnVtYnMgPSBbJ2YzJywgJ2Y0J11cbiAgICAgICAgLy8gbGFzdEJyZWFkY3J1bWIgPSAnZjUnXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmNScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2Y0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGNvbGxhcHNlIHdoZW4gYnJlYWRjcnVtYnMubGVuZ3RoIDw9IGRpc3BsYXlCcmVhZGNydW1iTnVtJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmMScsICdmMiddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsIC8vIGRpc3BsYXlCcmVhZGNydW1iTnVtID0gM1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQWxsIGJyZWFkY3J1bWJzIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgRXZlbnQgSGFuZGxlcnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHkgYW5kIEV2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdoYW5kbGVCYWNrVG9CdWNrZXRMaXN0JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNldCBzdG9yZSBzdGF0ZSB3aGVuIGNhbGxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbXSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIGJ1Y2tldCBpY29uIGJ1dHRvbiAoZmlyc3QgYnV0dG9uIGluIEJ1Y2tldCBjb21wb25lbnQpXG4gICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSkgLy8gQnVja2V0IGljb24gYnV0dG9uXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlbGVjdGVkRmlsZUlkcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRCdWNrZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcnKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnJlYWRjcnVtYnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0UHJlZml4KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoYW5kbGVDbGlja0J1Y2tldE5hbWUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlc2V0IGJyZWFkY3J1bWJzIGFuZCBwcmVmaXggd2hlbiBidWNrZXQgbmFtZSBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IHRydWVcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMSddLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gQ2xpY2sgYnVja2V0IG5hbWUgYnV0dG9uXG4gICAgICAgIGNvbnN0IGJ1Y2tldEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ215LWJ1Y2tldCcpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidWNrZXRCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlbGVjdGVkRmlsZUlkcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRCcmVhZGNydW1icykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRQcmVmaXgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBoYW5kbGVyIHdoZW4gYnVja2V0IGlzIGRpc2FibGVkIChubyBicmVhZGNydW1icyknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gdHJ1ZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgICBicmVhZGNydW1iczogW10sIC8vIGRpc2FibGVkIHdoZW4gbm8gYnJlYWRjcnVtYnNcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIGJ1Y2tldCBuYW1lIGJ1dHRvbiAoc2hvdWxkIGJlIGRpc2FibGVkKVxuICAgICAgICBjb25zdCBidWNrZXRCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdteS1idWNrZXQnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYnVja2V0QnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFN0b3JlIG1ldGhvZHMgc2hvdWxkIE5PVCBiZSBjYWxsZWQgYmVjYXVzZSBidXR0b24gaXMgZGlzYWJsZWRcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldE9ubGluZURyaXZlRmlsZUxpc3QpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoYW5kbGVCYWNrVG9Sb290JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNldCBzdGF0ZSB3aGVuIERyaXZlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJ10sXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBDbGljayBcIkFsbCBGaWxlc1wiIGJ1dHRvblxuICAgICAgICBjb25zdCBkcml2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vbmxpbmVEcml2ZS5icmVhZGNydW1icy5hbGxGaWxlcycpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhkcml2ZUJ1dHRvbilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldE9ubGluZURyaXZlRmlsZUxpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEJyZWFkY3J1bWJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZWZpeCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlQ2xpY2tCcmVhZGNydW1iJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzbGljZSBicmVhZGNydW1icyBhbmQgcHJlZml4IHdoZW4gYnJlYWRjcnVtYiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmJyZWFkY3J1bWJzID0gWydmb2xkZXIxJywgJ2ZvbGRlcjInLCAnZm9sZGVyMyddXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLnByZWZpeCA9IFsncHJlZml4MScsICdwcmVmaXgyJywgJ3ByZWZpeDMnXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyMScsICdmb2xkZXIyJywgJ2ZvbGRlcjMnXSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIG9uIGZpcnN0IGJyZWFkY3J1bWIgKGluZGV4IDApXG4gICAgICAgIGNvbnN0IGZpcnN0QnJlYWRjcnVtYiA9IHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmlyc3RCcmVhZGNydW1iKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzbGljZSB0byBpbmRleCAwICsgMSA9IDFcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldE9ubGluZURyaXZlRmlsZUxpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEJyZWFkY3J1bWJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2ZvbGRlcjEnXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZWZpeCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydwcmVmaXgxJ10pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGhhbmRsZXIgd2hlbiBsYXN0IGJyZWFkY3J1bWIgaXMgY2xpY2tlZCAoZGlzYWJsZWQpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIG9uIGxhc3QgYnJlYWRjcnVtYiAoc2hvdWxkIGJlIGRpc2FibGVkKVxuICAgICAgICBjb25zdCBsYXN0QnJlYWRjcnVtYiA9IHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sobGFzdEJyZWFkY3J1bWIpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU3RvcmUgbWV0aG9kcyBzaG91bGQgTk9UIGJlIGNhbGxlZFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnJlYWRjcnVtYnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGNsaWNrIG9uIGNvbGxhcHNlZCBicmVhZGNydW1iIGZyb20gZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuYnJlYWRjcnVtYnMgPSBbJ2YxJywgJ2YyJywgJ2YzJywgJ2Y0JywgJ2Y1J11cbiAgICAgICAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gWydwMScsICdwMicsICdwMycsICdwNCcsICdwNSddXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmMScsICdmMicsICdmMycsICdmNCcsICdmNSddLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBjbGljayBvbiBjb2xsYXBzZWQgYnJlYWRjcnVtYiAoZjMsIGluZGV4PTIpXG4gICAgICAgIGNvbnN0IGRyb3Bkb3duVHJpZ2dlciA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+IGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSlcbiAgICAgICAgaWYgKGRyb3Bkb3duVHJpZ2dlcilcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soZHJvcGRvd25UcmlnZ2VyKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2YzJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNsaWNlIHRvIGluZGV4IDIgKyAxID0gM1xuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnJlYWRjcnVtYnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnZjEnLCAnZjInLCAnZjMnXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZWZpeCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydwMScsICdwMicsICdwMyddKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KEJyZWFkY3J1bWJzKS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGV4Lmdyb3cnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIGJyZWFkY3J1bWJzIGNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IGZhbHNlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnXSB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBSZXJlbmRlciB3aXRoIGRpZmZlcmVudCBicmVhZGNydW1ic1xuICAgICAgcmVyZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5jcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogWydmb2xkZXIyJ10gfSl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBicmVhZGNydW1iIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gJ2EnLnJlcGVhdCgxMDApXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGJyZWFkY3J1bWJzOiBbbG9uZ05hbWVdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ05hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1hbnkgYnJlYWRjcnVtYnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBmYWxzZVxuICAgICAgY29uc3QgbWFueUJyZWFkY3J1bWJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMjAgfSwgKF8sIGkpID0+IGBmb2xkZXItJHtpfWApXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGJyZWFkY3J1bWJzOiBtYW55QnJlYWRjcnVtYnMsXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCBkcm9wZG93blRyaWdnZXIgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5maW5kKGJ0biA9PiBidG4ucXVlcnlTZWxlY3Rvcignc3ZnJykpXG4gICAgICBpZiAoZHJvcGRvd25UcmlnZ2VyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZHJvcGRvd25UcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnQgLSBGaXJzdCwgbGFzdCwgYW5kIGNvbGxhcHNlZCBzaG91bGQgYmUgYWNjZXNzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlci0wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXItMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyLTE5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYnVja2V0IHN0cmluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IHRydWVcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnVja2V0OiAnJyxcbiAgICAgICAgYnJlYWRjcnVtYnM6IFtdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzaG93IGFsbCBidWNrZXRzIHRpdGxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9ubGluZURyaXZlLmJyZWFkY3J1bWJzLmFsbEJ1Y2tldHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1iIHdpdGggb25seSB3aGl0ZXNwYWNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gZmFsc2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnICAgJywgJ25vcm1hbC1mb2xkZXInXSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCb3RoIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ25vcm1hbC1mb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICB7IGhhc0J1Y2tldDogdHJ1ZSwgYnVja2V0OiAnYjEnLCBicmVhZGNydW1iczogW10sIGV4cGVjdGVkOiAnYnVja2V0IHZpc2libGUnIH0sXG4gICAgICB7IGhhc0J1Y2tldDogdHJ1ZSwgYnVja2V0OiAnJywgYnJlYWRjcnVtYnM6IFtdLCBleHBlY3RlZDogJ2FsbCBidWNrZXRzIHRpdGxlJyB9LFxuICAgICAgeyBoYXNCdWNrZXQ6IGZhbHNlLCBidWNrZXQ6ICcnLCBicmVhZGNydW1iczogW10sIGV4cGVjdGVkOiAnYWxsIGZpbGVzJyB9LFxuICAgICAgeyBoYXNCdWNrZXQ6IGZhbHNlLCBidWNrZXQ6ICcnLCBicmVhZGNydW1iczogWydmMSddLCBleHBlY3RlZDogJ2RyaXZlIHdpdGggYnJlYWRjcnVtYicgfSxcbiAgICBdKSgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgZm9yICRleHBlY3RlZCcsICh7IGhhc0J1Y2tldCwgYnVja2V0LCBicmVhZGNydW1icyB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSBoYXNCdWNrZXRcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnVja2V0LCBicmVhZGNydW1icyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QnJlYWRjcnVtYnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGV4Lmdyb3cnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBidWNrZXQ6ICcnLCBleHBlY3RlZE51bTogMiB9LFxuICAgICAgeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBidWNrZXQ6ICcnLCBleHBlY3RlZE51bTogMyB9LFxuICAgICAgeyBpc0luUGlwZWxpbmU6IHRydWUsIGJ1Y2tldDogJ2InLCBleHBlY3RlZE51bTogMSB9LFxuICAgICAgeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBidWNrZXQ6ICdiJywgZXhwZWN0ZWROdW06IDIgfSxcbiAgICBdKSgnc2hvdWxkIGNhbGN1bGF0ZSBkaXNwbGF5QnJlYWRjcnVtYk51bT0kZXhwZWN0ZWROdW0gd2hlbiBpc0luUGlwZWxpbmU9JGlzSW5QaXBlbGluZSBhbmQgYnVja2V0PSRidWNrZXQnLCAoeyBpc0luUGlwZWxpbmUsIGJ1Y2tldCwgZXhwZWN0ZWROdW0gfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuaGFzQnVja2V0ID0gISFidWNrZXRcbiAgICAgIGNvbnN0IGJyZWFkY3J1bWJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogZXhwZWN0ZWROdW0gKyAyIH0sIChfLCBpKSA9PiBgZiR7aX1gKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmUsIGJ1Y2tldCwgYnJlYWRjcnVtYnMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBjb2xsYXBzZSBiZWNhdXNlIGJyZWFkY3J1bWJzLmxlbmd0aCA+IGV4cGVjdGVkTnVtXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGNvbnN0IGhhc0Ryb3Bkb3duVHJpZ2dlciA9IGJ1dHRvbnMuc29tZShidG4gPT4gYnRuLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKVxuICAgICAgZXhwZWN0KGhhc0Ryb3Bkb3duVHJpZ2dlcikudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZnVsbCBuYXZpZ2F0aW9uIGZsb3c6IGJ1Y2tldCAtPiBmb2xkZXJzIC0+IG5hdmlnYXRpb24gYmFjaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmhhc0J1Y2tldCA9IHRydWVcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmJyZWFkY3J1bWJzID0gWydmb2xkZXIxJywgJ2ZvbGRlcjInXVxuICAgICAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gWydwcmVmaXgxJywgJ3ByZWZpeDInXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPEJyZWFkY3J1bWJzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIG9uIGZpcnN0IGZvbGRlciB0byBuYXZpZ2F0ZSBiYWNrXG4gICAgICBjb25zdCBmaXJzdEZvbGRlciA9IHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpcnN0Rm9sZGVyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRCcmVhZGNydW1icykudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydmb2xkZXIxJ10pXG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0UHJlZml4KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ3ByZWZpeDEnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VhcmNoIHJlc3VsdCBkaXNwbGF5IHdpdGggbmF2aWdhdGlvbiBlbGVtZW50cyBoaWRkZW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5oYXNCdWNrZXQgPSB0cnVlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGtleXdvcmRzOiAndGVzdCcsXG4gICAgICAgIHNlYXJjaFJlc3VsdHNMZW5ndGg6IDUsXG4gICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnXSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxCcmVhZGNydW1icyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTZWFyY2ggcmVzdWx0IHNob3VsZCBiZSBzaG93biwgbmF2aWdhdGlvbiBlbGVtZW50cyBzaG91bGQgYmUgaGlkZGVuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2VhcmNoUmVzdWx0LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ215LWJ1Y2tldCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19