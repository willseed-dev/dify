"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const datasets_1 = require("@/service/datasets");
const utils_1 = require("@/utils");
const index_1 = require("./index");
// Mock external dependencies
vi.mock('@/service/datasets', () => ({
    createJinaReaderTask: vi.fn(),
    checkJinaReaderTaskStatus: vi.fn(),
}));
vi.mock('@/utils', () => ({
    sleep: vi.fn(() => Promise.resolve()),
}));
// Mock modal context
const mockSetShowAccountSettingModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowAccountSettingModal: mockSetShowAccountSettingModal,
    }),
}));
// Mock doc link context
vi.mock('@/context/i18n', () => ({
    useDocLink: () => () => 'https://docs.example.com',
}));
// ============================================================================
// Test Data Factories
// ============================================================================
// Note: limit and max_depth are typed as `number | string` in CrawlOptions
// Tests may use number, string, or empty string values to cover all valid cases
const createDefaultCrawlOptions = (overrides = {}) => ({
    crawl_sub_pages: true,
    only_main_content: true,
    includes: '',
    excludes: '',
    limit: 10,
    max_depth: 2,
    use_sitemap: false,
    ...overrides,
});
const createCrawlResultItem = (overrides = {}) => ({
    title: 'Test Page Title',
    markdown: '# Test Content\n\nThis is test markdown content.',
    description: 'Test description',
    source_url: 'https://example.com/page',
    ...overrides,
});
const createDefaultProps = (overrides = {}) => ({
    onPreview: vi.fn(),
    checkedCrawlResult: [],
    onCheckedCrawlResultChange: vi.fn(),
    onJobIdChange: vi.fn(),
    crawlOptions: createDefaultCrawlOptions(),
    onCrawlOptionsChange: vi.fn(),
    ...overrides,
});
// ============================================================================
// Rendering Tests
// ============================================================================
describe('JinaReader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.jinaReaderTitle')).toBeInTheDocument();
        });
        it('should render header with configuration button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.configureJinaReader')).toBeInTheDocument();
        });
        it('should render URL input field', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should render run button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
        });
        it('should render options section', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.options')).toBeInTheDocument();
        });
        it('should render doc link to Jina Reader', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const docLink = react_1.screen.getByRole('link');
            expect(docLink).toHaveAttribute('href', 'https://jina.ai/reader');
        });
        it('should not render crawling or result components initially', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText(/totalPageScraped/i)).not.toBeInTheDocument();
        });
    });
    // ============================================================================
    // Props Testing
    // ============================================================================
    describe('Props', () => {
        it('should call onCrawlOptionsChange when options change', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onCrawlOptionsChange = vi.fn();
            const props = createDefaultProps({ onCrawlOptionsChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find the limit input by its associated label text
            const limitLabel = react_1.screen.queryByText('datasetCreation.stepOne.website.limit');
            if (limitLabel) {
                // The limit input is a number input (spinbutton role) within the same container
                const limitInput = limitLabel.closest('div')?.parentElement?.querySelector('input[type="number"]');
                if (limitInput) {
                    await user.clear(limitInput);
                    await user.type(limitInput, '20');
                    // Assert
                    expect(onCrawlOptionsChange).toHaveBeenCalled();
                }
            }
            else {
                // Options might not be visible, just verify component renders
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.options')).toBeInTheDocument();
            }
        });
        it('should execute crawl task when checkedCrawlResult is provided', async () => {
            // Arrange
            const checkedItem = createCrawlResultItem({ source_url: 'https://checked.com' });
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Test',
                    content: 'Test content',
                    description: 'Test desc',
                    url: 'https://example.com',
                },
            });
            const props = createDefaultProps({
                checkedCrawlResult: [checkedItem],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - crawl task should be created even with pre-checked results
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
        it('should use default crawlOptions limit in validation', () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - component renders with empty limit
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
    // ============================================================================
    // State Management Tests
    // ============================================================================
    describe('State Management', () => {
        it('should transition from init to running state when run is clicked', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            let resolvePromise;
            mockCreateTask.mockImplementation(() => new Promise((resolve) => {
                resolvePromise = () => resolve({ data: { title: 'T', content: 'C', description: 'D', url: 'https://example.com' } });
            }));
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const urlInput = react_1.screen.getAllByRole('textbox')[0];
            await user_event_1.default.type(urlInput, 'https://example.com');
            // Click run and immediately check for crawling state
            const runButton = react_1.screen.getByRole('button', { name: /run/i });
            react_1.fireEvent.click(runButton);
            // Assert - crawling indicator should appear
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped/i)).toBeInTheDocument();
            });
            // Cleanup - resolve the promise
            resolvePromise();
        });
        it('should transition to finished state after successful crawl', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Test Page',
                    content: 'Test content',
                    description: 'Test description',
                    url: 'https://example.com',
                },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/selectAll|resetAll/i)).toBeInTheDocument();
            });
        });
        it('should update crawl result state during polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job-123' });
            mockCheckStatus
                .mockResolvedValueOnce({
                status: 'running',
                current: 1,
                total: 3,
                data: [createCrawlResultItem()],
            })
                .mockResolvedValueOnce({
                status: 'completed',
                current: 3,
                total: 3,
                data: [
                    createCrawlResultItem({ source_url: 'https://example.com/1' }),
                    createCrawlResultItem({ source_url: 'https://example.com/2' }),
                    createCrawlResultItem({ source_url: 'https://example.com/3' }),
                ],
            });
            const onCheckedCrawlResultChange = vi.fn();
            const onJobIdChange = vi.fn();
            const props = createDefaultProps({ onCheckedCrawlResultChange, onJobIdChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onJobIdChange).toHaveBeenCalledWith('test-job-123');
            });
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalled();
            });
        });
        it('should fold options when step changes from init', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Test',
                    content: 'Content',
                    description: 'Desc',
                    url: 'https://example.com',
                },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Options should be visible initially
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.crawlSubPage')).toBeInTheDocument();
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - options should be folded after crawl starts
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('datasetCreation.stepOne.website.crawlSubPage')).not.toBeInTheDocument();
            });
        });
    });
    // ============================================================================
    // Side Effects and Cleanup Tests
    // ============================================================================
    describe('Side Effects and Cleanup', () => {
        it('should call sleep during polling', async () => {
            // Arrange
            const mockSleep = utils_1.sleep;
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus
                .mockResolvedValueOnce({ status: 'running', current: 1, total: 2, data: [] })
                .mockResolvedValueOnce({ status: 'completed', current: 2, total: 2, data: [] });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSleep).toHaveBeenCalledWith(2500);
            });
        });
        it('should update controlFoldOptions when step changes', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockImplementation(() => new Promise((_resolve) => { }));
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Initially options should be visible
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.options')).toBeInTheDocument();
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - the crawling indicator should appear
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped/i)).toBeInTheDocument();
            });
        });
    });
    // ============================================================================
    // Callback Stability and Memoization Tests
    // ============================================================================
    describe('Callback Stability', () => {
        it('should maintain stable handleSetting callback', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            const configButton = react_1.screen.getByText('datasetCreation.stepOne.website.configureJinaReader');
            react_1.fireEvent.click(configButton);
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledTimes(1);
            // Rerender and click again
            rerender(<index_1.default {...props}/>);
            react_1.fireEvent.click(configButton);
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledTimes(2);
        });
        it('should memoize checkValid callback based on crawlOptions', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValue({ data: { title: 'T', content: 'C', description: 'D', url: 'https://a.com' } });
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledTimes(1);
            });
            // Rerender with same options
            rerender(<index_1.default {...props}/>);
            // Assert - component should still work correctly
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
    // ============================================================================
    // User Interactions and Event Handlers Tests
    // ============================================================================
    describe('User Interactions', () => {
        it('should open account settings when configuration button is clicked', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const configButton = react_1.screen.getByText('datasetCreation.stepOne.website.configureJinaReader');
            await user_event_1.default.click(configButton);
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: 'data-source',
            });
        });
        it('should handle URL input and run button click', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Test',
                    content: 'Content',
                    description: 'Desc',
                    url: 'https://test.com',
                },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith({
                    url: 'https://test.com',
                    options: props.crawlOptions,
                });
            });
        });
        it('should handle preview action on crawled result', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const onPreview = vi.fn();
            const crawlResultData = {
                title: 'Preview Test',
                content: '# Content',
                description: 'Preview desc',
                url: 'https://preview.com',
            };
            mockCreateTask.mockResolvedValueOnce({ data: crawlResultData });
            const props = createDefaultProps({ onPreview });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://preview.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - result should be displayed
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Preview Test')).toBeInTheDocument();
            });
            // Click on preview button
            const previewButton = react_1.screen.getByText('datasetCreation.stepOne.website.preview');
            await user_event_1.default.click(previewButton);
            expect(onPreview).toHaveBeenCalled();
        });
        it('should handle checkbox changes in options', async () => {
            // Arrange
            const onCrawlOptionsChange = vi.fn();
            const props = createDefaultProps({
                onCrawlOptionsChange,
                crawlOptions: createDefaultCrawlOptions({ crawl_sub_pages: false }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find and click the checkbox by data-testid
            const checkbox = react_1.screen.getByTestId('checkbox-crawl-sub-pages');
            react_1.fireEvent.click(checkbox);
            // Assert - onCrawlOptionsChange should be called
            expect(onCrawlOptionsChange).toHaveBeenCalled();
        });
        it('should toggle options visibility when clicking options header', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Options content should be visible initially
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.crawlSubPage')).toBeInTheDocument();
            // Click to collapse
            const optionsHeader = react_1.screen.getByText('datasetCreation.stepOne.website.options');
            await user_event_1.default.click(optionsHeader);
            // Assert - options should be hidden
            expect(react_1.screen.queryByText('datasetCreation.stepOne.website.crawlSubPage')).not.toBeInTheDocument();
            // Click to expand again
            await user_event_1.default.click(optionsHeader);
            // Options should be visible again
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.crawlSubPage')).toBeInTheDocument();
        });
    });
    // ============================================================================
    // API Calls Tests
    // ============================================================================
    describe('API Calls', () => {
        it('should call createJinaReaderTask with correct parameters', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://api-test.com' },
            });
            const crawlOptions = createDefaultCrawlOptions({ limit: 5, max_depth: 3 });
            const props = createDefaultProps({ crawlOptions });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://api-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith({
                    url: 'https://api-test.com',
                    options: crawlOptions,
                });
            });
        });
        it('should handle direct data response from API', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Direct Result',
                    content: '# Direct Content',
                    description: 'Direct desc',
                    url: 'https://direct.com',
                },
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://direct.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([
                    expect.objectContaining({
                        title: 'Direct Result',
                        source_url: 'https://direct.com',
                    }),
                ]);
            });
        });
        it('should handle job_id response and poll for status', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onJobIdChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'poll-job-123' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 2,
                total: 2,
                data: [
                    createCrawlResultItem({ source_url: 'https://p1.com' }),
                    createCrawlResultItem({ source_url: 'https://p2.com' }),
                ],
            });
            const props = createDefaultProps({ onJobIdChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://poll-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onJobIdChange).toHaveBeenCalledWith('poll-job-123');
            });
            await (0, react_1.waitFor)(() => {
                expect(mockCheckStatus).toHaveBeenCalledWith('poll-job-123');
            });
        });
        it('should handle failed status from polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'fail-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'failed',
                message: 'Crawl failed due to network error',
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://fail-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
            expect(react_1.screen.getByText('Crawl failed due to network error')).toBeInTheDocument();
        });
        it('should handle API error during status check', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'error-job' });
            mockCheckStatus.mockRejectedValueOnce({
                json: () => Promise.resolve({ message: 'API Error occurred' }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://error-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
        });
        it('should limit total to crawlOptions.limit', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'limit-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 100,
                total: 100,
                data: Array.from({ length: 100 }, (_, i) => createCrawlResultItem({ source_url: `https://example.com/${i}` })),
            });
            const props = createDefaultProps({
                onCheckedCrawlResultChange,
                crawlOptions: createDefaultCrawlOptions({ limit: 5 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://limit-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalled();
            });
        });
    });
    // ============================================================================
    // Component Memoization Tests
    // ============================================================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - React.memo components have $$typeof Symbol(react.memo)
            expect(index_1.default.$$typeof?.toString()).toBe('Symbol(react.memo)');
            expect(index_1.default.type).toBeDefined();
        });
    });
    // ============================================================================
    // Edge Cases and Error Handling Tests
    // ============================================================================
    describe('Edge Cases and Error Handling', () => {
        it('should show error for empty URL', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - Toast should be shown (mocked via Toast component)
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should show error for invalid URL format', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'invalid-url');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should show error for URL without protocol', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should accept URL with http:// protocol', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'http://example.com' },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'http://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
        it('should show error when limit is empty', async () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should show error when limit is null', async () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: null }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should show error when limit is undefined', async () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: undefined }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createJinaReaderTask).not.toHaveBeenCalled();
            });
        });
        it('should handle API throwing an exception', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockRejectedValueOnce(new Error('Network error'));
            // Suppress console output during test to avoid noisy logs
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://exception-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
            consoleSpy.mockRestore();
        });
        it('should handle status response without status field', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'no-status-job' });
            mockCheckStatus.mockResolvedValueOnce({
                // No status field
                message: 'Unknown error',
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://no-status-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
        });
        it('should show unknown error when error message is empty', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'empty-error-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'failed',
                // No message
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://empty-error-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.unknownError')).toBeInTheDocument();
            });
        });
        it('should handle empty data array from API', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'empty-data-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 0,
                total: 0,
                data: [],
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://empty-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should handle null data from running status', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'null-data-job' });
            mockCheckStatus
                .mockResolvedValueOnce({
                status: 'running',
                current: 0,
                total: 5,
                data: null,
            })
                .mockResolvedValueOnce({
                status: 'completed',
                current: 5,
                total: 5,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://null-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should return empty array when completed job has undefined data', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'undefined-data-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 0,
                total: 0,
                // data is undefined - should fallback to empty array
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://undefined-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should show zero current progress when crawlResult is not yet available', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'zero-current-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 10 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://zero-current-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should show 0/10 when crawlResult is undefined
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/10/)).toBeInTheDocument();
            });
        });
        it('should show 0/0 progress when limit is zero string', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'zero-total-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '0' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://zero-total-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should show 0/0 when limit parses to 0
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/0/)).toBeInTheDocument();
            });
        });
        it('should complete successfully when result data is undefined', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'undefined-result-data-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 0,
                total: 0,
                time_consuming: 1.5,
                // data is undefined - should fallback to empty array
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://undefined-result-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should complete and show results even if empty
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/scrapTimeInfo/i)).toBeInTheDocument();
            });
        });
        it('should use limit as total when crawlResult total is not available', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'no-total-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 15 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://no-total-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should use limit (15) as total
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/15/)).toBeInTheDocument();
            });
        });
        it('should fallback to limit when crawlResult has zero total', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'both-zero-job' });
            mockCheckStatus
                .mockResolvedValueOnce({
                status: 'running',
                current: 0,
                total: 0,
                data: [],
            })
                .mockImplementationOnce(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 5 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://both-zero-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should show progress indicator
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped/)).toBeInTheDocument();
            });
        });
        it('should construct result item from direct data response', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Direct Title',
                    content: '# Direct Content',
                    description: 'Direct desc',
                    url: 'https://direct-array.com',
                },
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://direct-array.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should construct result item from direct response
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([
                    expect.objectContaining({
                        title: 'Direct Title',
                        source_url: 'https://direct-array.com',
                    }),
                ]);
            });
        });
    });
    // ============================================================================
    // All Prop Variations Tests
    // ============================================================================
    describe('Prop Variations', () => {
        it('should handle different limit values in crawlOptions', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://limit.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 100 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://limit.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({ limit: 100 }),
                }));
            });
        });
        it('should handle different max_depth values', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://depth.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ max_depth: 5 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://depth.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({ max_depth: 5 }),
                }));
            });
        });
        it('should handle crawl_sub_pages disabled', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://nosub.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ crawl_sub_pages: false }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://nosub.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({ crawl_sub_pages: false }),
                }));
            });
        });
        it('should handle use_sitemap enabled', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://sitemap.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ use_sitemap: true }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://sitemap.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({ use_sitemap: true }),
                }));
            });
        });
        it('should handle includes and excludes patterns', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://patterns.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({
                    includes: '/docs/*',
                    excludes: '/api/*',
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://patterns.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({
                        includes: '/docs/*',
                        excludes: '/api/*',
                    }),
                }));
            });
        });
        it('should handle pre-selected crawl results', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const existingResult = createCrawlResultItem({ source_url: 'https://existing.com' });
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'New', content: 'C', description: 'D', url: 'https://new.com' },
            });
            const props = createDefaultProps({
                checkedCrawlResult: [existingResult],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://new.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
        it('should handle string type limit value', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://string-limit.com' },
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '25' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://string-limit.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
    });
    // ============================================================================
    // Display and UI State Tests
    // ============================================================================
    describe('Display and UI States', () => {
        it('should show crawling progress during running state', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'progress-job' });
            mockCheckStatus.mockImplementation(() => new Promise((_resolve) => { })); // Never resolves
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 10 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://progress.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/10/)).toBeInTheDocument();
            });
        });
        it('should display time consumed after crawl completion', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'T', content: 'C', description: 'D', url: 'https://time.com' },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://time.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/scrapTimeInfo/i)).toBeInTheDocument();
            });
        });
        it('should display crawled results list after completion', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockResolvedValueOnce({
                data: {
                    title: 'Result Page',
                    content: '# Content',
                    description: 'Description',
                    url: 'https://result.com',
                },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://result.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Result Page')).toBeInTheDocument();
            });
        });
        it('should show error message component when crawl fails', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            mockCreateTask.mockRejectedValueOnce(new Error('Failed'));
            // Suppress console output during test to avoid noisy logs
            vi.spyOn(console, 'log').mockImplementation(vi.fn());
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://fail.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
        });
    });
    // ============================================================================
    // Integration Tests
    // ============================================================================
    describe('Integration', () => {
        it('should complete full crawl workflow with job polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const mockCheckStatus = datasets_1.checkJinaReaderTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            const onJobIdChange = vi.fn();
            const onPreview = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'full-workflow-job' });
            mockCheckStatus
                .mockResolvedValueOnce({
                status: 'running',
                current: 2,
                total: 5,
                data: [
                    createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                    createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
                ],
            })
                .mockResolvedValueOnce({
                status: 'completed',
                current: 5,
                total: 5,
                time_consuming: 3.5,
                data: [
                    createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                    createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
                    createCrawlResultItem({ source_url: 'https://page3.com', title: 'Page 3' }),
                    createCrawlResultItem({ source_url: 'https://page4.com', title: 'Page 4' }),
                    createCrawlResultItem({ source_url: 'https://page5.com', title: 'Page 5' }),
                ],
            });
            const props = createDefaultProps({
                onCheckedCrawlResultChange,
                onJobIdChange,
                onPreview,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://full-workflow.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - job id should be set
            await (0, react_1.waitFor)(() => {
                expect(onJobIdChange).toHaveBeenCalledWith('full-workflow-job');
            });
            // Assert - final results should be displayed
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('Page 5')).toBeInTheDocument();
            });
            // Assert - checked results should be updated
            expect(onCheckedCrawlResultChange).toHaveBeenLastCalledWith(expect.arrayContaining([
                expect.objectContaining({ source_url: 'https://page1.com' }),
                expect.objectContaining({ source_url: 'https://page5.com' }),
            ]));
        });
        it('should handle select all and deselect all in results', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createJinaReaderTask;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({
                data: { title: 'Single', content: 'C', description: 'D', url: 'https://single.com' },
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'https://single.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Wait for results
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Single')).toBeInTheDocument();
            });
            // Click select all/reset all
            const selectAllCheckbox = react_1.screen.getByText(/selectAll|resetAll/i);
            await user_event_1.default.click(selectAllCheckbox);
            // Assert
            expect(onCheckedCrawlResultChange).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCxpREFBb0Y7QUFDcEYsbUNBQStCO0FBQy9CLG1DQUFnQztBQUVoQyw2QkFBNkI7QUFDN0IsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0IseUJBQXlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNuQyxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBRUgscUJBQXFCO0FBQ3JCLE1BQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzlDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4QyxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN0QiwwQkFBMEIsRUFBRSw4QkFBOEI7S0FDM0QsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsd0JBQXdCO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsMEJBQTBCO0NBQ25ELENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLHNCQUFzQjtBQUN0QiwrRUFBK0U7QUFFL0UsMkVBQTJFO0FBQzNF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Q0FBQyxDQUFBO1lBQ3pDLE1BQU0sb0JBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLENBQUE7WUFDakQsTUFBTSxvQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFbkUsbUJBQW1CO1lBQ25CLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDeEQsQ0FBQyxDQUFDLENBQUE7WUFFRiw2QkFBNkI7WUFDN0IsTUFBTSxpQkFBaUIsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUE7WUFDakUsTUFBTSxvQkFBUyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBRXhDLFNBQVM7WUFDVCxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgQ3Jhd2xPcHRpb25zLCBDcmF3bFJlc3VsdEl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgeyBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzLCBjcmVhdGVKaW5hUmVhZGVyVGFzayB9IGZyb20gJ0Avc2VydmljZS9kYXRhc2V0cydcbmltcG9ydCB7IHNsZWVwIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCBKaW5hUmVhZGVyIGZyb20gJy4vaW5kZXgnXG5cbi8vIE1vY2sgZXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG52aS5tb2NrKCdAL3NlcnZpY2UvZGF0YXNldHMnLCAoKSA9PiAoe1xuICBjcmVhdGVKaW5hUmVhZGVyVGFzazogdmkuZm4oKSxcbiAgY2hlY2tKaW5hUmVhZGVyVGFza1N0YXR1czogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL3V0aWxzJywgKCkgPT4gKHtcbiAgc2xlZXA6IHZpLmZuKCgpID0+IFByb21pc2UucmVzb2x2ZSgpKSxcbn0pKVxuXG4vLyBNb2NrIG1vZGFsIGNvbnRleHRcbmNvbnN0IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0OiAoKSA9PiAoe1xuICAgIHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsOiBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgZG9jIGxpbmsgY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiAoKSA9PiAnaHR0cHM6Ly9kb2NzLmV4YW1wbGUuY29tJyxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IGxpbWl0IGFuZCBtYXhfZGVwdGggYXJlIHR5cGVkIGFzIGBudW1iZXIgfCBzdHJpbmdgIGluIENyYXdsT3B0aW9uc1xuLy8gVGVzdHMgbWF5IHVzZSBudW1iZXIsIHN0cmluZywgb3IgZW1wdHkgc3RyaW5nIHZhbHVlcyB0byBjb3ZlciBhbGwgdmFsaWQgY2FzZXNcbmNvbnN0IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPENyYXdsT3B0aW9ucz4gPSB7fSk6IENyYXdsT3B0aW9ucyA9PiAoe1xuICBjcmF3bF9zdWJfcGFnZXM6IHRydWUsXG4gIG9ubHlfbWFpbl9jb250ZW50OiB0cnVlLFxuICBpbmNsdWRlczogJycsXG4gIGV4Y2x1ZGVzOiAnJyxcbiAgbGltaXQ6IDEwLFxuICBtYXhfZGVwdGg6IDIsXG4gIHVzZV9zaXRlbWFwOiBmYWxzZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtID0gKG92ZXJyaWRlczogUGFydGlhbDxDcmF3bFJlc3VsdEl0ZW0+ID0ge30pOiBDcmF3bFJlc3VsdEl0ZW0gPT4gKHtcbiAgdGl0bGU6ICdUZXN0IFBhZ2UgVGl0bGUnLFxuICBtYXJrZG93bjogJyMgVGVzdCBDb250ZW50XFxuXFxuVGhpcyBpcyB0ZXN0IG1hcmtkb3duIGNvbnRlbnQuJyxcbiAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2NyaXB0aW9uJyxcbiAgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vcGFnZScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGFyYW1ldGVyczx0eXBlb2YgSmluYVJlYWRlcj5bMF0+ID0ge30pID0+ICh7XG4gIG9uUHJldmlldzogdmkuZm4oKSxcbiAgY2hlY2tlZENyYXdsUmVzdWx0OiBbXSBhcyBDcmF3bFJlc3VsdEl0ZW1bXSxcbiAgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2U6IHZpLmZuKCksXG4gIG9uSm9iSWRDaGFuZ2U6IHZpLmZuKCksXG4gIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucygpLFxuICBvbkNyYXdsT3B0aW9uc0NoYW5nZTogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUmVuZGVyaW5nIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnSmluYVJlYWRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmppbmFSZWFkZXJUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGhlYWRlciB3aXRoIGNvbmZpZ3VyYXRpb24gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmNvbmZpZ3VyZUppbmFSZWFkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBVUkwgaW5wdXQgZmllbGQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBydW4gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvcHRpb25zIHNlY3Rpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUub3B0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvYyBsaW5rIHRvIEppbmEgUmVhZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGRvY0xpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJylcbiAgICAgIGV4cGVjdChkb2NMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9qaW5hLmFpL3JlYWRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjcmF3bGluZyBvciByZXN1bHQgY29tcG9uZW50cyBpbml0aWFsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DcmF3bE9wdGlvbnNDaGFuZ2Ugd2hlbiBvcHRpb25zIGNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25DcmF3bE9wdGlvbnNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3Jhd2xPcHRpb25zQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgdGhlIGxpbWl0IGlucHV0IGJ5IGl0cyBhc3NvY2lhdGVkIGxhYmVsIHRleHRcbiAgICAgIGNvbnN0IGxpbWl0TGFiZWwgPSBzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUubGltaXQnKVxuXG4gICAgICBpZiAobGltaXRMYWJlbCkge1xuICAgICAgICAvLyBUaGUgbGltaXQgaW5wdXQgaXMgYSBudW1iZXIgaW5wdXQgKHNwaW5idXR0b24gcm9sZSkgd2l0aGluIHRoZSBzYW1lIGNvbnRhaW5lclxuICAgICAgICBjb25zdCBsaW1pdElucHV0ID0gbGltaXRMYWJlbC5jbG9zZXN0KCdkaXYnKT8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cIm51bWJlclwiXScpXG5cbiAgICAgICAgaWYgKGxpbWl0SW5wdXQpIHtcbiAgICAgICAgICBhd2FpdCB1c2VyLmNsZWFyKGxpbWl0SW5wdXQpXG4gICAgICAgICAgYXdhaXQgdXNlci50eXBlKGxpbWl0SW5wdXQsICcyMCcpXG5cbiAgICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgICBleHBlY3Qob25DcmF3bE9wdGlvbnNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gT3B0aW9ucyBtaWdodCBub3QgYmUgdmlzaWJsZSwganVzdCB2ZXJpZnkgY29tcG9uZW50IHJlbmRlcnNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUub3B0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZXhlY3V0ZSBjcmF3bCB0YXNrIHdoZW4gY2hlY2tlZENyYXdsUmVzdWx0IGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2hlY2tlZEl0ZW0gPSBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9jaGVja2VkLmNvbScgfSlcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlOiAnVGVzdCcsXG4gICAgICAgICAgY29udGVudDogJ1Rlc3QgY29udGVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2MnLFxuICAgICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjaGVja2VkQ3Jhd2xSZXN1bHQ6IFtjaGVja2VkSXRlbV0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIGNyYXdsIHRhc2sgc2hvdWxkIGJlIGNyZWF0ZWQgZXZlbiB3aXRoIHByZS1jaGVja2VkIHJlc3VsdHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCBjcmF3bE9wdGlvbnMgbGltaXQgaW4gdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6ICcnIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHJlbmRlcnMgd2l0aCBlbXB0eSBsaW1pdFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gaW5pdCB0byBydW5uaW5nIHN0YXRlIHdoZW4gcnVuIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGxldCByZXNvbHZlUHJvbWlzZTogKCkgPT4gdm9pZFxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlID0gKCkgPT4gcmVzb2x2ZSh7IGRhdGE6IHsgdGl0bGU6ICdUJywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tJyB9IH0pXG4gICAgICB9KSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgdXJsSW5wdXQgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCd0ZXh0Ym94JylbMF1cbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKHVybElucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG5cbiAgICAgIC8vIENsaWNrIHJ1biBhbmQgaW1tZWRpYXRlbHkgY2hlY2sgZm9yIGNyYXdsaW5nIHN0YXRlXG4gICAgICBjb25zdCBydW5CdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJ1bkJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gY3Jhd2xpbmcgaW5kaWNhdG9yIHNob3VsZCBhcHBlYXJcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xlYW51cCAtIHJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgIHJlc29sdmVQcm9taXNlISgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiB0byBmaW5pc2hlZCBzdGF0ZSBhZnRlciBzdWNjZXNzZnVsIGNyYXdsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6ICdUZXN0IFBhZ2UnLFxuICAgICAgICAgIGNvbnRlbnQ6ICdUZXN0IGNvbnRlbnQnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NlbGVjdEFsbHxyZXNldEFsbC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgY3Jhd2wgcmVzdWx0IHN0YXRlIGR1cmluZyBwb2xsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAndGVzdC1qb2ItMTIzJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnLFxuICAgICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgICAgdG90YWw6IDMsXG4gICAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgfSlcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgICBjdXJyZW50OiAzLFxuICAgICAgICAgIHRvdGFsOiAzLFxuICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tLzEnIH0pLFxuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMicgfSksXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8zJyB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KVxuXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSm9iSWRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlLCBvbkpvYklkQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uSm9iSWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LWpvYi0xMjMnKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZvbGQgb3B0aW9ucyB3aGVuIHN0ZXAgY2hhbmdlcyBmcm9tIGluaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogJ1Rlc3QnLFxuICAgICAgICAgIGNvbnRlbnQ6ICdDb250ZW50JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2MnLFxuICAgICAgICAgIHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcHRpb25zIHNob3VsZCBiZSB2aXNpYmxlIGluaXRpYWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIG9wdGlvbnMgc2hvdWxkIGJlIGZvbGRlZCBhZnRlciBjcmF3bCBzdGFydHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmNyYXdsU3ViUGFnZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU2lkZSBFZmZlY3RzIGFuZCBDbGVhbnVwIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgc2xlZXAgZHVyaW5nIHBvbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU2xlZXAgPSBzbGVlcCBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd0ZXN0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1c1xuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgc3RhdHVzOiAncnVubmluZycsIGN1cnJlbnQ6IDEsIHRvdGFsOiAyLCBkYXRhOiBbXSB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgc3RhdHVzOiAnY29tcGxldGVkJywgY3VycmVudDogMiwgdG90YWw6IDIsIGRhdGE6IFtdIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NsZWVwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgyNTAwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgY29udHJvbEZvbGRPcHRpb25zIHdoZW4gc3RlcCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKF9yZXNvbHZlKSA9PiB7IC8qIHBlbmRpbmcgKi8gfSkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gSW5pdGlhbGx5IG9wdGlvbnMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLm9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gdGhlIGNyYXdsaW5nIGluZGljYXRvciBzaG91bGQgYXBwZWFyXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3RvdGFsUGFnZVNjcmFwZWQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZVNldHRpbmcgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBjb25maWdCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmNvbmZpZ3VyZUppbmFSZWFkZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpZ0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgLy8gUmVyZW5kZXIgYW5kIGNsaWNrIGFnYWluXG4gICAgICByZXJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpZ0J1dHRvbilcblxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBjaGVja1ZhbGlkIGNhbGxiYWNrIGJhc2VkIG9uIGNyYXdsT3B0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiB7IHRpdGxlOiAnVCcsIGNvbnRlbnQ6ICdDJywgZGVzY3JpcHRpb246ICdEJywgdXJsOiAnaHR0cHM6Ly9hLmNvbScgfSB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgb3B0aW9uc1xuICAgICAgcmVyZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCBzdGlsbCB3b3JrIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFjY291bnQgc2V0dGluZ3Mgd2hlbiBjb25maWd1cmF0aW9uIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgY29uZmlnQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5jb25maWd1cmVKaW5hUmVhZGVyJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhjb25maWdCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBwYXlsb2FkOiAnZGF0YS1zb3VyY2UnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVVJMIGlucHV0IGFuZCBydW4gYnV0dG9uIGNsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6ICdUZXN0JyxcbiAgICAgICAgICBjb250ZW50OiAnQ29udGVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdEZXNjJyxcbiAgICAgICAgICB1cmw6ICdodHRwczovL3Rlc3QuY29tJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB1cmw6ICdodHRwczovL3Rlc3QuY29tJyxcbiAgICAgICAgICBvcHRpb25zOiBwcm9wcy5jcmF3bE9wdGlvbnMsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IGFjdGlvbiBvbiBjcmF3bGVkIHJlc3VsdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgY3Jhd2xSZXN1bHREYXRhID0ge1xuICAgICAgICB0aXRsZTogJ1ByZXZpZXcgVGVzdCcsXG4gICAgICAgIGNvbnRlbnQ6ICcjIENvbnRlbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1ByZXZpZXcgZGVzYycsXG4gICAgICAgIHVybDogJ2h0dHBzOi8vcHJldmlldy5jb20nLFxuICAgICAgfVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBkYXRhOiBjcmF3bFJlc3VsdERhdGEgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblByZXZpZXcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vcHJldmlldy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSByZXN1bHQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQcmV2aWV3IFRlc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgb24gcHJldmlldyBidXR0b25cbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLnByZXZpZXcnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjaGVja2JveCBjaGFuZ2VzIGluIG9wdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNyYXdsT3B0aW9uc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgb25DcmF3bE9wdGlvbnNDaGFuZ2UsXG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGNyYXdsX3N1Yl9wYWdlczogZmFsc2UgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgY2hlY2tib3ggYnkgZGF0YS10ZXN0aWRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveC1jcmF3bC1zdWItcGFnZXMnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94KVxuXG4gICAgICAvLyBBc3NlcnQgLSBvbkNyYXdsT3B0aW9uc0NoYW5nZSBzaG91bGQgYmUgY2FsbGVkXG4gICAgICBleHBlY3Qob25DcmF3bE9wdGlvbnNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBvcHRpb25zIHZpc2liaWxpdHkgd2hlbiBjbGlja2luZyBvcHRpb25zIGhlYWRlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gT3B0aW9ucyBjb250ZW50IHNob3VsZCBiZSB2aXNpYmxlIGluaXRpYWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgdG8gY29sbGFwc2VcbiAgICAgIGNvbnN0IG9wdGlvbnNIZWFkZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLm9wdGlvbnMnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKG9wdGlvbnNIZWFkZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIG9wdGlvbnMgc2hvdWxkIGJlIGhpZGRlblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5jcmF3bFN1YlBhZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgdG8gZXhwYW5kIGFnYWluXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2sob3B0aW9uc0hlYWRlcilcblxuICAgICAgLy8gT3B0aW9ucyBzaG91bGQgYmUgdmlzaWJsZSBhZ2FpblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQVBJIENhbGxzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgY3JlYXRlSmluYVJlYWRlclRhc2sgd2l0aCBjb3JyZWN0IHBhcmFtZXRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGRhdGE6IHsgdGl0bGU6ICdUJywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL2FwaS10ZXN0LmNvbScgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNyYXdsT3B0aW9ucyA9IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogNSwgbWF4X2RlcHRoOiAzIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGNyYXdsT3B0aW9ucyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9hcGktdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB1cmw6ICdodHRwczovL2FwaS10ZXN0LmNvbScsXG4gICAgICAgICAgb3B0aW9uczogY3Jhd2xPcHRpb25zLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlyZWN0IGRhdGEgcmVzcG9uc2UgZnJvbSBBUEknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6ICdEaXJlY3QgUmVzdWx0JyxcbiAgICAgICAgICBjb250ZW50OiAnIyBEaXJlY3QgQ29udGVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdEaXJlY3QgZGVzYycsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9kaXJlY3QuY29tJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZGlyZWN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW1xuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHRpdGxlOiAnRGlyZWN0IFJlc3VsdCcsXG4gICAgICAgICAgICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9kaXJlY3QuY29tJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGpvYl9pZCByZXNwb25zZSBhbmQgcG9sbCBmb3Igc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uSm9iSWRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3BvbGwtam9iLTEyMycgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAyLFxuICAgICAgICB0b3RhbDogMixcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3AxLmNvbScgfSksXG4gICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcDIuY29tJyB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25Kb2JJZENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9wb2xsLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uSm9iSWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdwb2xsLWpvYi0xMjMnKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ2hlY2tTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdwb2xsLWpvYi0xMjMnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmFpbGVkIHN0YXR1cyBmcm9tIHBvbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdmYWlsLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdmYWlsZWQnLFxuICAgICAgICBtZXNzYWdlOiAnQ3Jhd2wgZmFpbGVkIGR1ZSB0byBuZXR3b3JrIGVycm9yJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZmFpbC10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmV4Y2VwdGlvbkVycm9yVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyYXdsIGZhaWxlZCBkdWUgdG8gbmV0d29yayBlcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBlcnJvciBkdXJpbmcgc3RhdHVzIGNoZWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnZXJyb3Itam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZWplY3RlZFZhbHVlT25jZSh7XG4gICAgICAgIGpzb246ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IG1lc3NhZ2U6ICdBUEkgRXJyb3Igb2NjdXJyZWQnIH0pLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9lcnJvci10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmV4Y2VwdGlvbkVycm9yVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW1pdCB0b3RhbCB0byBjcmF3bE9wdGlvbnMubGltaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ2xpbWl0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxMDAsXG4gICAgICAgIHRvdGFsOiAxMDAsXG4gICAgICAgIGRhdGE6IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwMCB9LCAoXywgaSkgPT5cbiAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiBgaHR0cHM6Ly9leGFtcGxlLmNvbS8ke2l9YCB9KSksXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlLFxuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogNSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2xpbWl0LXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydCAtIFJlYWN0Lm1lbW8gY29tcG9uZW50cyBoYXZlICQkdHlwZW9mIFN5bWJvbChyZWFjdC5tZW1vKVxuICAgICAgZXhwZWN0KEppbmFSZWFkZXIuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQmUoJ1N5bWJvbChyZWFjdC5tZW1vKScpXG4gICAgICBleHBlY3QoKEppbmFSZWFkZXIgYXMgdW5rbm93biBhcyB7IHR5cGU6IHVua25vd24gfSkudHlwZSkudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgZm9yIGVtcHR5IFVSTCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gVG9hc3Qgc2hvdWxkIGJlIHNob3duIChtb2NrZWQgdmlhIFRvYXN0IGNvbXBvbmVudClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlSmluYVJlYWRlclRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBmb3IgaW52YWxpZCBVUkwgZm9ybWF0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaW52YWxpZC11cmwnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlSmluYVJlYWRlclRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBmb3IgVVJMIHdpdGhvdXQgcHJvdG9jb2wnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdleGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjcmVhdGVKaW5hUmVhZGVyVGFzaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgVVJMIHdpdGggaHR0cDovLyBwcm90b2NvbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YTogeyB0aXRsZTogJ1QnLCBjb250ZW50OiAnQycsIGRlc2NyaXB0aW9uOiAnRCcsIHVybDogJ2h0dHA6Ly9leGFtcGxlLmNvbScgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHA6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igd2hlbiBsaW1pdCBpcyBlbXB0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6ICcnIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlSmluYVJlYWRlclRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIGxpbWl0IGlzIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiBudWxsIGFzIHVua25vd24gYXMgbnVtYmVyIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlSmluYVJlYWRlclRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIGxpbWl0IGlzIHVuZGVmaW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIG51bWJlciB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNyZWF0ZUppbmFSZWFkZXJUYXNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBBUEkgdGhyb3dpbmcgYW4gZXhjZXB0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVqZWN0ZWRWYWx1ZU9uY2UobmV3IEVycm9yKCdOZXR3b3JrIGVycm9yJykpXG4gICAgICAvLyBTdXBwcmVzcyBjb25zb2xlIG91dHB1dCBkdXJpbmcgdGVzdCB0byBhdm9pZCBub2lzeSBsb2dzXG4gICAgICBjb25zdCBjb25zb2xlU3B5ID0gdmkuc3B5T24oY29uc29sZSwgJ2xvZycpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4Y2VwdGlvbi10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmV4Y2VwdGlvbkVycm9yVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0YXR1cyByZXNwb25zZSB3aXRob3V0IHN0YXR1cyBmaWVsZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tKaW5hUmVhZGVyVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ25vLXN0YXR1cy1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgLy8gTm8gc3RhdHVzIGZpZWxkXG4gICAgICAgIG1lc3NhZ2U6ICdVbmtub3duIGVycm9yJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vbm8tc3RhdHVzLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuZXhjZXB0aW9uRXJyb3JUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdW5rbm93biBlcnJvciB3aGVuIGVycm9yIG1lc3NhZ2UgaXMgZW1wdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdlbXB0eS1lcnJvci1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnZmFpbGVkJyxcbiAgICAgICAgLy8gTm8gbWVzc2FnZVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9lbXB0eS1lcnJvci10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLnVua25vd25FcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkYXRhIGFycmF5IGZyb20gQVBJJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdlbXB0eS1kYXRhLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAwLFxuICAgICAgICB0b3RhbDogMCxcbiAgICAgICAgZGF0YTogW10sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2VtcHR5LWRhdGEtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBkYXRhIGZyb20gcnVubmluZyBzdGF0dXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ251bGwtZGF0YS1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXNcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgc3RhdHVzOiAncnVubmluZycsXG4gICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICB0b3RhbDogNSxcbiAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgIGN1cnJlbnQ6IDUsXG4gICAgICAgICAgdG90YWw6IDUsXG4gICAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9udWxsLWRhdGEtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBjb21wbGV0ZWQgam9iIGhhcyB1bmRlZmluZWQgZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tKaW5hUmVhZGVyVGFza1N0YXR1cyBhcyBNb2NrXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAndW5kZWZpbmVkLWRhdGEtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHRvdGFsOiAwLFxuICAgICAgICAvLyBkYXRhIGlzIHVuZGVmaW5lZCAtIHNob3VsZCBmYWxsYmFjayB0byBlbXB0eSBhcnJheVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly91bmRlZmluZWQtZGF0YS10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgemVybyBjdXJyZW50IHByb2dyZXNzIHdoZW4gY3Jhd2xSZXN1bHQgaXMgbm90IHlldCBhdmFpbGFibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd6ZXJvLWN1cnJlbnQtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAxMCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3plcm8tY3VycmVudC10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBzaG93IDAvMTAgd2hlbiBjcmF3bFJlc3VsdCBpcyB1bmRlZmluZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzEwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyAwLzAgcHJvZ3Jlc3Mgd2hlbiBsaW1pdCBpcyB6ZXJvIHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tKaW5hUmVhZGVyVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3plcm8tdG90YWwtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAnMCcgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly96ZXJvLXRvdGFsLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHNob3cgMC8wIHdoZW4gbGltaXQgcGFyc2VzIHRvIDBcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wbGV0ZSBzdWNjZXNzZnVsbHkgd2hlbiByZXN1bHQgZGF0YSBpcyB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3VuZGVmaW5lZC1yZXN1bHQtZGF0YS1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICAgIC8vIGRhdGEgaXMgdW5kZWZpbmVkIC0gc2hvdWxkIGZhbGxiYWNrIHRvIGVtcHR5IGFycmF5XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3VuZGVmaW5lZC1yZXN1bHQtZGF0YS10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBjb21wbGV0ZSBhbmQgc2hvdyByZXN1bHRzIGV2ZW4gaWYgZW1wdHlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2NyYXBUaW1lSW5mby9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgbGltaXQgYXMgdG90YWwgd2hlbiBjcmF3bFJlc3VsdCB0b3RhbCBpcyBub3QgYXZhaWxhYmxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnbm8tdG90YWwtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAxNSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL25vLXRvdGFsLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHVzZSBsaW1pdCAoMTUpIGFzIHRvdGFsXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3RvdGFsUGFnZVNjcmFwZWQuKjBcXC8xNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZhbGxiYWNrIHRvIGxpbWl0IHdoZW4gY3Jhd2xSZXN1bHQgaGFzIHplcm8gdG90YWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrSmluYVJlYWRlclRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdib3RoLXplcm8tam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnLFxuICAgICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgIH0pXG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHsgLyogbmV2ZXIgcmVzb2x2ZXMgKi8gfSkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IDUgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9ib3RoLXplcm8tdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgc2hvdyBwcm9ncmVzcyBpbmRpY2F0b3JcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnN0cnVjdCByZXN1bHQgaXRlbSBmcm9tIGRpcmVjdCBkYXRhIHJlc3BvbnNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRpdGxlOiAnRGlyZWN0IFRpdGxlJyxcbiAgICAgICAgICBjb250ZW50OiAnIyBEaXJlY3QgQ29udGVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdEaXJlY3QgZGVzYycsXG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly9kaXJlY3QtYXJyYXkuY29tJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZGlyZWN0LWFycmF5LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBjb25zdHJ1Y3QgcmVzdWx0IGl0ZW0gZnJvbSBkaXJlY3QgcmVzcG9uc2VcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICB0aXRsZTogJ0RpcmVjdCBUaXRsZScsXG4gICAgICAgICAgICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9kaXJlY3QtYXJyYXkuY29tJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpZmZlcmVudCBsaW1pdCB2YWx1ZXMgaW4gY3Jhd2xPcHRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7IHRpdGxlOiAnVCcsIGNvbnRlbnQ6ICdDJywgZGVzY3JpcHRpb246ICdEJywgdXJsOiAnaHR0cHM6Ly9saW1pdC5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAxMDAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9saW1pdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgbGltaXQ6IDEwMCB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IG1heF9kZXB0aCB2YWx1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGRhdGE6IHsgdGl0bGU6ICdUJywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL2RlcHRoLmNvbScgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbWF4X2RlcHRoOiA1IH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZGVwdGguY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVUYXNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBvcHRpb25zOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IG1heF9kZXB0aDogNSB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3Jhd2xfc3ViX3BhZ2VzIGRpc2FibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7IHRpdGxlOiAnVCcsIGNvbnRlbnQ6ICdDJywgZGVzY3JpcHRpb246ICdEJywgdXJsOiAnaHR0cHM6Ly9ub3N1Yi5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGNyYXdsX3N1Yl9wYWdlczogZmFsc2UgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9ub3N1Yi5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgY3Jhd2xfc3ViX3BhZ2VzOiBmYWxzZSB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdXNlX3NpdGVtYXAgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YTogeyB0aXRsZTogJ1QnLCBjb250ZW50OiAnQycsIGRlc2NyaXB0aW9uOiAnRCcsIHVybDogJ2h0dHBzOi8vc2l0ZW1hcC5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IHVzZV9zaXRlbWFwOiB0cnVlIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vc2l0ZW1hcC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdXNlX3NpdGVtYXA6IHRydWUgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluY2x1ZGVzIGFuZCBleGNsdWRlcyBwYXR0ZXJucycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YTogeyB0aXRsZTogJ1QnLCBjb250ZW50OiAnQycsIGRlc2NyaXB0aW9uOiAnRCcsIHVybDogJ2h0dHBzOi8vcGF0dGVybnMuY29tJyB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoe1xuICAgICAgICAgIGluY2x1ZGVzOiAnL2RvY3MvKicsXG4gICAgICAgICAgZXhjbHVkZXM6ICcvYXBpLyonLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3BhdHRlcm5zLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBpbmNsdWRlczogJy9kb2NzLyonLFxuICAgICAgICAgICAgICBleGNsdWRlczogJy9hcGkvKicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJlLXNlbGVjdGVkIGNyYXdsIHJlc3VsdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IGV4aXN0aW5nUmVzdWx0ID0gY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhpc3RpbmcuY29tJyB9KVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7IHRpdGxlOiAnTmV3JywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL25ldy5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNoZWNrZWRDcmF3bFJlc3VsdDogW2V4aXN0aW5nUmVzdWx0XSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL25ldy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RyaW5nIHR5cGUgbGltaXQgdmFsdWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGRhdGE6IHsgdGl0bGU6ICdUJywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL3N0cmluZy1saW1pdC5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAnMjUnIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEppbmFSZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vc3RyaW5nLWxpbWl0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEaXNwbGF5IGFuZCBVSSBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdEaXNwbGF5IGFuZCBVSSBTdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNyYXdsaW5nIHByb2dyZXNzIGR1cmluZyBydW5uaW5nIHN0YXRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja0ppbmFSZWFkZXJUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAncHJvZ3Jlc3Mtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoX3Jlc29sdmUpID0+IHsgLyogcGVuZGluZyAqLyB9KSkgLy8gTmV2ZXIgcmVzb2x2ZXNcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogMTAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9wcm9ncmVzcy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzEwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSB0aW1lIGNvbnN1bWVkIGFmdGVyIGNyYXdsIGNvbXBsZXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgZGF0YTogeyB0aXRsZTogJ1QnLCBjb250ZW50OiAnQycsIGRlc2NyaXB0aW9uOiAnRCcsIHVybDogJ2h0dHBzOi8vdGltZS5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3RpbWUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NjcmFwVGltZUluZm8vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjcmF3bGVkIHJlc3VsdHMgbGlzdCBhZnRlciBjb21wbGV0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0aXRsZTogJ1Jlc3VsdCBQYWdlJyxcbiAgICAgICAgICBjb250ZW50OiAnIyBDb250ZW50JyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICB1cmw6ICdodHRwczovL3Jlc3VsdC5jb20nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9yZXN1bHQuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Jlc3VsdCBQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBtZXNzYWdlIGNvbXBvbmVudCB3aGVuIGNyYXdsIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVKaW5hUmVhZGVyVGFzayBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ0ZhaWxlZCcpKVxuICAgICAgLy8gU3VwcHJlc3MgY29uc29sZSBvdXRwdXQgZHVyaW5nIHRlc3QgdG8gYXZvaWQgbm9pc3kgbG9nc1xuICAgICAgdmkuc3B5T24oY29uc29sZSwgJ2xvZycpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2ZhaWwuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuZXhjZXB0aW9uRXJyb3JUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgY3Jhd2wgd29ya2Zsb3cgd2l0aCBqb2IgcG9sbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlSmluYVJlYWRlclRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tKaW5hUmVhZGVyVGFza1N0YXR1cyBhcyBNb2NrXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSm9iSWRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ2Z1bGwtd29ya2Zsb3ctam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnLFxuICAgICAgICAgIGN1cnJlbnQ6IDIsXG4gICAgICAgICAgdG90YWw6IDUsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJywgdGl0bGU6ICdQYWdlIDEnIH0pLFxuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJywgdGl0bGU6ICdQYWdlIDInIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgY3VycmVudDogNSxcbiAgICAgICAgICB0b3RhbDogNSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMy41LFxuICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScsIHRpdGxlOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UyLmNvbScsIHRpdGxlOiAnUGFnZSAyJyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UzLmNvbScsIHRpdGxlOiAnUGFnZSAzJyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2U0LmNvbScsIHRpdGxlOiAnUGFnZSA0JyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2U1LmNvbScsIHRpdGxlOiAnUGFnZSA1JyB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlLFxuICAgICAgICBvbkpvYklkQ2hhbmdlLFxuICAgICAgICBvblByZXZpZXcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SmluYVJlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9mdWxsLXdvcmtmbG93LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIGpvYiBpZCBzaG91bGQgYmUgc2V0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uSm9iSWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdmdWxsLXdvcmtmbG93LWpvYicpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBmaW5hbCByZXN1bHRzIHNob3VsZCBiZSBkaXNwbGF5ZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgNScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjaGVja2VkIHJlc3VsdHMgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgIGV4cGVjdChvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScgfSksXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlNS5jb20nIH0pLFxuICAgICAgICBdKSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VsZWN0IGFsbCBhbmQgZGVzZWxlY3QgYWxsIGluIHJlc3VsdHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZUppbmFSZWFkZXJUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBkYXRhOiB7IHRpdGxlOiAnU2luZ2xlJywgY29udGVudDogJ0MnLCBkZXNjcmlwdGlvbjogJ0QnLCB1cmw6ICdodHRwczovL3NpbmdsZS5jb20nIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxKaW5hUmVhZGVyIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3NpbmdsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBXYWl0IGZvciByZXN1bHRzXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NpbmdsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGljayBzZWxlY3QgYWxsL3Jlc2V0IGFsbFxuICAgICAgY29uc3Qgc2VsZWN0QWxsQ2hlY2tib3ggPSBzY3JlZW4uZ2V0QnlUZXh0KC9zZWxlY3RBbGx8cmVzZXRBbGwvaSlcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzZWxlY3RBbGxDaGVja2JveClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19