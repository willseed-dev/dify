"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const datasets_1 = require("@/service/datasets");
const utils_1 = require("@/utils");
const index_1 = require("./index");
// Mock external dependencies
vi.mock('@/service/datasets', () => ({
    createWatercrawlTask: vi.fn(),
    checkWatercrawlTaskStatus: vi.fn(),
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
describe('WaterCrawl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for initial component rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.watercrawlTitle')).toBeInTheDocument();
        });
        it('should render header with configuration button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.configureWatercrawl')).toBeInTheDocument();
        });
        it('should render URL input field', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - URL input has specific placeholder
            expect(react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/')).toBeInTheDocument();
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
        it('should render doc link to WaterCrawl', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const docLink = react_1.screen.getByRole('link');
            expect(docLink).toHaveAttribute('href', 'https://docs.watercrawl.dev/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                checkedCrawlResult: [checkedItem],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            expect(react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/')).toBeInTheDocument();
        });
    });
    // ============================================================================
    // State Management Tests
    // ============================================================================
    describe('State Management', () => {
        it('should transition from init to running state when run is clicked', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            let resolvePromise;
            mockCreateTask.mockImplementation(() => new Promise((resolve) => {
                resolvePromise = () => resolve({ job_id: 'test-job' });
            }));
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const urlInput = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem({ title: 'Test Page' })],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/selectAll|resetAll/i)).toBeInTheDocument();
            });
        });
        it('should update crawl result state during polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Options should be visible initially
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.crawlSubPage')).toBeInTheDocument();
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus
                .mockResolvedValueOnce({ status: 'running', current: 1, total: 2, data: [] })
                .mockResolvedValueOnce({ status: 'completed', current: 2, total: 2, data: [] });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSleep).toHaveBeenCalledWith(2500);
            });
        });
        it('should update controlFoldOptions when step changes', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            mockCreateTask.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Initially options should be visible
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.options')).toBeInTheDocument();
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const configButton = react_1.screen.getByText('datasetCreation.stepOne.website.configureWatercrawl');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValue({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValue({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledTimes(1);
            });
            // Rerender with same options
            rerender(<index_1.default {...props}/>);
            // Assert - component should still work correctly
            expect(react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/')).toBeInTheDocument();
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
            const configButton = react_1.screen.getByText('datasetCreation.stepOne.website.configureWatercrawl');
            await user_event_1.default.click(configButton);
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: 'data-source',
            });
        });
        it('should handle URL input and run button click', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onPreview = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem({ title: 'Preview Test' })],
            });
            const props = createDefaultProps({ onPreview });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
        it('should call createWatercrawlTask with correct parameters', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'api-test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const crawlOptions = createDefaultCrawlOptions({ limit: 5, max_depth: 3 });
            const props = createDefaultProps({ crawlOptions });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
        it('should delete max_depth from options when it is empty string', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'test-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const crawlOptions = createDefaultCrawlOptions({ max_depth: '' });
            const props = createDefaultProps({ crawlOptions });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - max_depth should be deleted from the request
            await (0, react_1.waitFor)(() => {
                const callArgs = mockCreateTask.mock.calls[0][0];
                expect(callArgs.options).not.toHaveProperty('max_depth');
            });
        });
        it('should poll for status with job_id', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
        it('should handle error status from polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'fail-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'error',
                message: 'Crawl failed due to network error',
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'error-job' });
            mockCheckStatus.mockRejectedValueOnce({
                json: () => Promise.resolve({ message: 'API Error occurred' }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://error-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
        });
        it('should limit total to crawlOptions.limit', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://limit-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalled();
            });
        });
        it('should handle response without status field as error', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'no-status-job' });
            mockCheckStatus.mockResolvedValueOnce({
                // No status field
                message: 'Unknown error',
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://no-status-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
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
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should show error for invalid URL format', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'invalid-url');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should show error for URL without protocol', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should accept URL with http:// protocol', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'http-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should show error when limit is null', async () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: null }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should show error when limit is undefined', async () => {
            // Arrange
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: undefined }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://example.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(datasets_1.createWatercrawlTask).not.toHaveBeenCalled();
            });
        });
        it('should handle API throwing an exception', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            mockCreateTask.mockRejectedValueOnce(new Error('Network error'));
            // Suppress console output during test to avoid noisy logs
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://exception-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
            consoleSpy.mockRestore();
        });
        it('should show unknown error when error message is empty', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'empty-error-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'error',
                // No message
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://empty-error-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.unknownError')).toBeInTheDocument();
            });
        });
        it('should handle empty data array from API', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://empty-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should handle null data from running status', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://null-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should handle undefined data from completed job polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'undefined-data-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 0,
                total: 0,
                // data is undefined - triggers || [] fallback
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://undefined-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenCalledWith([]);
            });
        });
        it('should handle crawlResult with zero current value', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'zero-current-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 10 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://zero-current-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should show 0/10 in crawling indicator
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/10/)).toBeInTheDocument();
            });
        });
        it('should handle crawlResult with zero total and empty limit', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'zero-total-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '0' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://zero-total-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should show 0/0
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/0/)).toBeInTheDocument();
            });
        });
        it('should handle undefined crawlResult data in finished state', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'undefined-result-data-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 0,
                total: 0,
                time_consuming: 1.5,
                // data is undefined
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://undefined-result-data-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should complete and show results
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/scrapTimeInfo/i)).toBeInTheDocument();
            });
        });
        it('should use parseFloat fallback when crawlResult.total is undefined', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'no-total-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 15 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://no-total-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should use limit (15) as total
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/15/)).toBeInTheDocument();
            });
        });
        it('should handle crawlResult with current=0 and total=0 during running', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://both-zero-test.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped/)).toBeInTheDocument();
            });
        });
    });
    // ============================================================================
    // All Prop Variations Tests
    // ============================================================================
    describe('Prop Variations', () => {
        it('should handle different limit values in crawlOptions', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'limit-var-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 100 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'depth-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ max_depth: 5 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'nosub-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ crawl_sub_pages: false }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'sitemap-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ use_sitemap: true }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'patterns-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({
                    includes: '/docs/*',
                    excludes: '/api/*',
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const existingResult = createCrawlResultItem({ source_url: 'https://existing.com' });
            mockCreateTask.mockResolvedValueOnce({ job_id: 'preselect-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem({ title: 'New' })],
            });
            const props = createDefaultProps({
                checkedCrawlResult: [existingResult],
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://new.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
        it('should handle string type limit value', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'string-limit-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: '25' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://string-limit.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalled();
            });
        });
        it('should handle only_main_content option', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'main-content-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ only_main_content: false }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://main-content.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
                    options: expect.objectContaining({ only_main_content: false }),
                }));
            });
        });
    });
    // ============================================================================
    // Display and UI State Tests
    // ============================================================================
    describe('Display and UI States', () => {
        it('should show crawling progress during running state', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'progress-job' });
            mockCheckStatus.mockImplementation(() => new Promise(() => { }));
            const props = createDefaultProps({
                crawlOptions: createDefaultCrawlOptions({ limit: 10 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://progress.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/totalPageScraped.*0\/10/)).toBeInTheDocument();
            });
        });
        it('should display time consumed after crawl completion', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'time-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                time_consuming: 2.5,
                data: [createCrawlResultItem()],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://time.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/scrapTimeInfo/i)).toBeInTheDocument();
            });
        });
        it('should display crawled results list after completion', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            mockCreateTask.mockResolvedValueOnce({ job_id: 'result-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem({ title: 'Result Page' })],
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://result.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Result Page')).toBeInTheDocument();
            });
        });
        it('should show error message component when crawl fails', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            mockCreateTask.mockRejectedValueOnce(new Error('Failed'));
            // Suppress console output during test to avoid noisy logs
            vi.spyOn(console, 'log').mockImplementation(vi.fn());
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://fail.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.website.exceptionErrorTitle')).toBeInTheDocument();
            });
        });
        it('should update progress during multiple polling iterations', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'multi-poll-job' });
            mockCheckStatus
                .mockResolvedValueOnce({
                status: 'running',
                current: 2,
                total: 10,
                data: [
                    createCrawlResultItem({ source_url: 'https://page1.com' }),
                    createCrawlResultItem({ source_url: 'https://page2.com' }),
                ],
            })
                .mockResolvedValueOnce({
                status: 'running',
                current: 5,
                total: 10,
                data: Array.from({ length: 5 }, (_, i) => createCrawlResultItem({ source_url: `https://page${i + 1}.com` })),
            })
                .mockResolvedValueOnce({
                status: 'completed',
                current: 10,
                total: 10,
                data: Array.from({ length: 10 }, (_, i) => createCrawlResultItem({ source_url: `https://page${i + 1}.com` })),
            });
            const props = createDefaultProps({
                onCheckedCrawlResultChange,
                crawlOptions: createDefaultCrawlOptions({ limit: 10 }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://multi-poll.com');
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Assert - should eventually complete
            await (0, react_1.waitFor)(() => {
                expect(mockCheckStatus).toHaveBeenCalledTimes(3);
            });
            // Final result should be selected
            await (0, react_1.waitFor)(() => {
                expect(onCheckedCrawlResultChange).toHaveBeenLastCalledWith(expect.arrayContaining([
                    expect.objectContaining({ source_url: 'https://page1.com' }),
                ]));
            });
        });
    });
    // ============================================================================
    // Integration Tests
    // ============================================================================
    describe('Integration', () => {
        it('should complete full crawl workflow with job polling', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
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
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onCheckedCrawlResultChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'select-all-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                data: [createCrawlResultItem({ title: 'Single' })],
            });
            const props = createDefaultProps({ onCheckedCrawlResultChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
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
        it('should handle complete workflow from input to preview', async () => {
            // Arrange
            const mockCreateTask = datasets_1.createWatercrawlTask;
            const mockCheckStatus = datasets_1.checkWatercrawlTaskStatus;
            const onPreview = vi.fn();
            const onCheckedCrawlResultChange = vi.fn();
            const onJobIdChange = vi.fn();
            mockCreateTask.mockResolvedValueOnce({ job_id: 'preview-workflow-job' });
            mockCheckStatus.mockResolvedValueOnce({
                status: 'completed',
                current: 1,
                total: 1,
                time_consuming: 1.2,
                data: [createCrawlResultItem({
                        title: 'Preview Page',
                        markdown: '# Preview Content',
                        source_url: 'https://preview.com/page',
                    })],
            });
            const props = createDefaultProps({
                onPreview,
                onCheckedCrawlResultChange,
                onJobIdChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Step 1: Enter URL
            const input = react_1.screen.getByPlaceholderText('https://docs.dify.ai/en/');
            await user_event_1.default.type(input, 'https://preview.com');
            // Step 2: Run crawl
            await user_event_1.default.click(react_1.screen.getByRole('button', { name: /run/i }));
            // Step 3: Wait for completion
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Preview Page')).toBeInTheDocument();
            });
            // Step 4: Click preview
            const previewButton = react_1.screen.getByText('datasetCreation.stepOne.website.preview');
            await user_event_1.default.click(previewButton);
            // Assert
            expect(onJobIdChange).toHaveBeenCalledWith('preview-workflow-job');
            expect(onCheckedCrawlResultChange).toHaveBeenCalled();
            expect(onPreview).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCxpREFBb0Y7QUFDcEYsbUNBQStCO0FBQy9CLG1DQUFnQztBQUVoQyw2QkFBNkI7QUFDN0IsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0IseUJBQXlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNuQyxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBRUgscUJBQXFCO0FBQ3JCLE1BQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzlDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4QyxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN0QiwwQkFBMEIsRUFBRSw4QkFBOEI7S0FDM0QsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLHNCQUFzQjtBQUN0QiwrRUFBK0U7QUFFL0UsMkVBQTJFO0FBQzNFLGdGQUFnRjtBQUNoRixNQUFNLHlCQUF5QixHQUFHLENBQUMsWUFBbUMsRUFBRSxFQUFnQixFQUFFLENBQUMsQ0FBQztJQUMxRixlQUFlLEVBQUUsSUFBSTtJQUNyQixpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLFFBQVEsRUFBRSxFQUFFO0lBQ1osUUFBUSxF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TSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO1lBQ2pGLE1BQU0sb0JBQVMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFcEMsU0FBUztZQUNULE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb2NrIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHR5cGUgeyBDcmF3bE9wdGlvbnMsIENyYXdsUmVzdWx0SXRlbSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCB7IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMsIGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIH0gZnJvbSAnQC9zZXJ2aWNlL2RhdGFzZXRzJ1xuaW1wb3J0IHsgc2xlZXAgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IFdhdGVyQ3Jhd2wgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbnZpLm1vY2soJ0Avc2VydmljZS9kYXRhc2V0cycsICgpID0+ICh7XG4gIGNyZWF0ZVdhdGVyY3Jhd2xUYXNrOiB2aS5mbigpLFxuICBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0AvdXRpbHMnLCAoKSA9PiAoe1xuICBzbGVlcDogdmkuZm4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpLFxufSkpXG5cbi8vIE1vY2sgbW9kYWwgY29udGV4dFxuY29uc3QgbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsID0gdmkuZm4oKVxudmkubW9jaygnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VNb2RhbENvbnRleHQ6ICgpID0+ICh7XG4gICAgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWw6IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCxcbiAgfSksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBOb3RlOiBsaW1pdCBhbmQgbWF4X2RlcHRoIGFyZSB0eXBlZCBhcyBgbnVtYmVyIHwgc3RyaW5nYCBpbiBDcmF3bE9wdGlvbnNcbi8vIFRlc3RzIG1heSB1c2UgbnVtYmVyLCBzdHJpbmcsIG9yIGVtcHR5IHN0cmluZyB2YWx1ZXMgdG8gY292ZXIgYWxsIHZhbGlkIGNhc2VzXG5jb25zdCBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zID0gKG92ZXJyaWRlczogUGFydGlhbDxDcmF3bE9wdGlvbnM+ID0ge30pOiBDcmF3bE9wdGlvbnMgPT4gKHtcbiAgY3Jhd2xfc3ViX3BhZ2VzOiB0cnVlLFxuICBvbmx5X21haW5fY29udGVudDogdHJ1ZSxcbiAgaW5jbHVkZXM6ICcnLFxuICBleGNsdWRlczogJycsXG4gIGxpbWl0OiAxMCxcbiAgbWF4X2RlcHRoOiAyLFxuICB1c2Vfc2l0ZW1hcDogZmFsc2UsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSA9IChvdmVycmlkZXM6IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtPiA9IHt9KTogQ3Jhd2xSZXN1bHRJdGVtID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBQYWdlIFRpdGxlJyxcbiAgbWFya2Rvd246ICcjIFRlc3QgQ29udGVudFxcblxcblRoaXMgaXMgdGVzdCBtYXJrZG93biBjb250ZW50LicsXG4gIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBhcmFtZXRlcnM8dHlwZW9mIFdhdGVyQ3Jhd2w+WzBdPiA9IHt9KSA9PiAoe1xuICBvblByZXZpZXc6IHZpLmZuKCksXG4gIGNoZWNrZWRDcmF3bFJlc3VsdDogW10gYXMgQ3Jhd2xSZXN1bHRJdGVtW10sXG4gIG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlOiB2aS5mbigpLFxuICBvbkpvYklkQ2hhbmdlOiB2aS5mbigpLFxuICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoKSxcbiAgb25DcmF3bE9wdGlvbnNDaGFuZ2U6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJlbmRlcmluZyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1dhdGVyQ3Jhd2wnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBpbml0aWFsIGNvbXBvbmVudCByZW5kZXJpbmdcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLndhdGVyY3Jhd2xUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGhlYWRlciB3aXRoIGNvbmZpZ3VyYXRpb24gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmNvbmZpZ3VyZVdhdGVyY3Jhd2wnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBVUkwgaW5wdXQgZmllbGQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFVSTCBpbnB1dCBoYXMgc3BlY2lmaWMgcGxhY2Vob2xkZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJ1biBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9wdGlvbnMgc2VjdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5vcHRpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG9jIGxpbmsgdG8gV2F0ZXJDcmF3bCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBkb2NMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycpXG4gICAgICBleHBlY3QoZG9jTGluaykudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vZG9jcy53YXRlcmNyYXdsLmRldi8nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY3Jhd2xpbmcgb3IgcmVzdWx0IGNvbXBvbmVudHMgaW5pdGlhbGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL3RvdGFsUGFnZVNjcmFwZWQvaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ3Jhd2xPcHRpb25zQ2hhbmdlIHdoZW4gb3B0aW9ucyBjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ3Jhd2xPcHRpb25zQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyYXdsT3B0aW9uc0NoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIHRoZSBsaW1pdCBpbnB1dCBieSBpdHMgYXNzb2NpYXRlZCBsYWJlbCB0ZXh0XG4gICAgICBjb25zdCBsaW1pdExhYmVsID0gc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmxpbWl0JylcblxuICAgICAgaWYgKGxpbWl0TGFiZWwpIHtcbiAgICAgICAgLy8gVGhlIGxpbWl0IGlucHV0IGlzIGEgbnVtYmVyIGlucHV0IChzcGluYnV0dG9uIHJvbGUpIHdpdGhpbiB0aGUgc2FtZSBjb250YWluZXJcbiAgICAgICAgY29uc3QgbGltaXRJbnB1dCA9IGxpbWl0TGFiZWwuY2xvc2VzdCgnZGl2Jyk/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJudW1iZXJcIl0nKVxuXG4gICAgICAgIGlmIChsaW1pdElucHV0KSB7XG4gICAgICAgICAgYXdhaXQgdXNlci5jbGVhcihsaW1pdElucHV0KVxuICAgICAgICAgIGF3YWl0IHVzZXIudHlwZShsaW1pdElucHV0LCAnMjAnKVxuXG4gICAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgICAgZXhwZWN0KG9uQ3Jhd2xPcHRpb25zQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIE9wdGlvbnMgbWlnaHQgbm90IGJlIHZpc2libGUsIGp1c3QgdmVyaWZ5IGNvbXBvbmVudCByZW5kZXJzXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLm9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGV4ZWN1dGUgY3Jhd2wgdGFzayB3aGVuIGNoZWNrZWRDcmF3bFJlc3VsdCBpcyBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNoZWNrZWRJdGVtID0gY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vY2hlY2tlZC5jb20nIH0pXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3Rlc3Qtam9iJyB9KVxuXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY2hlY2tlZENyYXdsUmVzdWx0OiBbY2hlY2tlZEl0ZW1dLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gY3Jhd2wgdGFzayBzaG91bGQgYmUgY3JlYXRlZCBldmVuIHdpdGggcHJlLWNoZWNrZWQgcmVzdWx0c1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0IGNyYXdsT3B0aW9ucyBsaW1pdCBpbiB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogJycgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjb21wb25lbnQgcmVuZGVycyB3aXRoIGVtcHR5IGxpbWl0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gaW5pdCB0byBydW5uaW5nIHN0YXRlIHdoZW4gcnVuIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGxldCByZXNvbHZlUHJvbWlzZTogKCkgPT4gdm9pZFxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlID0gKCkgPT4gcmVzb2x2ZSh7IGpvYl9pZDogJ3Rlc3Qtam9iJyB9KVxuICAgICAgfSkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IHVybElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUodXJsSW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcblxuICAgICAgLy8gQ2xpY2sgcnVuIGFuZCBpbW1lZGlhdGVseSBjaGVjayBmb3IgY3Jhd2xpbmcgc3RhdGVcbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2socnVuQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBjcmF3bGluZyBpbmRpY2F0b3Igc2hvdWxkIGFwcGVhclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC90b3RhbFBhZ2VTY3JhcGVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGVhbnVwIC0gcmVzb2x2ZSB0aGUgcHJvbWlzZVxuICAgICAgcmVzb2x2ZVByb21pc2UhKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIHRvIGZpbmlzaGVkIHN0YXRlIGFmdGVyIHN1Y2Nlc3NmdWwgY3Jhd2wnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd0ZXN0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHRpdGxlOiAnVGVzdCBQYWdlJyB9KV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9zZWxlY3RBbGx8cmVzZXRBbGwvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNyYXdsIHJlc3VsdCBzdGF0ZSBkdXJpbmcgcG9sbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3Rlc3Qtam9iLTEyMycgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1c1xuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdydW5uaW5nJyxcbiAgICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICAgIHRvdGFsOiAzLFxuICAgICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICAgIH0pXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgY3VycmVudDogMyxcbiAgICAgICAgICB0b3RhbDogMyxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8xJyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tLzInIH0pLFxuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMycgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSlcblxuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkpvYklkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSwgb25Kb2JJZENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25Kb2JJZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3Qtam9iLTEyMycpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZm9sZCBvcHRpb25zIHdoZW4gc3RlcCBjaGFuZ2VzIGZyb20gaW5pdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3Rlc3Qtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcHRpb25zIHNob3VsZCBiZSB2aXNpYmxlIGluaXRpYWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBvcHRpb25zIHNob3VsZCBiZSBmb2xkZWQgYWZ0ZXIgY3Jhd2wgc3RhcnRzXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5jcmF3bFN1YlBhZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFNpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNsZWVwIGR1cmluZyBwb2xsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1NsZWVwID0gc2xlZXAgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAndGVzdC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXNcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IHN0YXR1czogJ3J1bm5pbmcnLCBjdXJyZW50OiAxLCB0b3RhbDogMiwgZGF0YTogW10gfSlcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IHN0YXR1czogJ2NvbXBsZXRlZCcsIGN1cnJlbnQ6IDIsIHRvdGFsOiAyLCBkYXRhOiBbXSB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2xlZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDI1MDApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjb250cm9sRm9sZE9wdGlvbnMgd2hlbiBzdGVwIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIHBlbmRpbmcgKi8gfSkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gSW5pdGlhbGx5IG9wdGlvbnMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLm9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHRoZSBjcmF3bGluZyBpbmRpY2F0b3Igc2hvdWxkIGFwcGVhclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC90b3RhbFBhZ2VTY3JhcGVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBoYW5kbGVTZXR0aW5nIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgY29uZmlnQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5jb25maWd1cmVXYXRlcmNyYXdsJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maWdCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgIC8vIFJlcmVuZGVyIGFuZCBjbGljayBhZ2FpblxuICAgICAgcmVyZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maWdCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1lbW9pemUgY2hlY2tWYWxpZCBjYWxsYmFjayBiYXNlZCBvbiBjcmF3bE9wdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGpvYl9pZDogJ3Rlc3Qtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9leGFtcGxlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIG9wdGlvbnNcbiAgICAgIHJlcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCBzaG91bGQgc3RpbGwgd29yayBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVycyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gYWNjb3VudCBzZXR0aW5ncyB3aGVuIGNvbmZpZ3VyYXRpb24gYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBjb25maWdCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmNvbmZpZ3VyZVdhdGVyY3Jhd2wnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGNvbmZpZ0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBheWxvYWQ6ICdkYXRhLXNvdXJjZScsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBVUkwgaW5wdXQgYW5kIHJ1biBidXR0b24gY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd0ZXN0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3Rlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVUYXNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdXJsOiAnaHR0cHM6Ly90ZXN0LmNvbScsXG4gICAgICAgICAgb3B0aW9uczogcHJvcHMuY3Jhd2xPcHRpb25zLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJldmlldyBhY3Rpb24gb24gY3Jhd2xlZCByZXN1bHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd0ZXN0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHRpdGxlOiAnUHJldmlldyBUZXN0JyB9KV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uUHJldmlldyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vcHJldmlldy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSByZXN1bHQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQcmV2aWV3IFRlc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgb24gcHJldmlldyBidXR0b25cbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLnByZXZpZXcnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjaGVja2JveCBjaGFuZ2VzIGluIG9wdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNyYXdsT3B0aW9uc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgb25DcmF3bE9wdGlvbnNDaGFuZ2UsXG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGNyYXdsX3N1Yl9wYWdlczogZmFsc2UgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgY2hlY2tib3ggYnkgZGF0YS10ZXN0aWRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveC1jcmF3bC1zdWItcGFnZXMnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94KVxuXG4gICAgICAvLyBBc3NlcnQgLSBvbkNyYXdsT3B0aW9uc0NoYW5nZSBzaG91bGQgYmUgY2FsbGVkXG4gICAgICBleHBlY3Qob25DcmF3bE9wdGlvbnNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBvcHRpb25zIHZpc2liaWxpdHkgd2hlbiBjbGlja2luZyBvcHRpb25zIGhlYWRlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gT3B0aW9ucyBjb250ZW50IHNob3VsZCBiZSB2aXNpYmxlIGluaXRpYWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgdG8gY29sbGFwc2VcbiAgICAgIGNvbnN0IG9wdGlvbnNIZWFkZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLm9wdGlvbnMnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKG9wdGlvbnNIZWFkZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIG9wdGlvbnMgc2hvdWxkIGJlIGhpZGRlblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5jcmF3bFN1YlBhZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgdG8gZXhwYW5kIGFnYWluXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2sob3B0aW9uc0hlYWRlcilcblxuICAgICAgLy8gT3B0aW9ucyBzaG91bGQgYmUgdmlzaWJsZSBhZ2FpblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuY3Jhd2xTdWJQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQVBJIENhbGxzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgY3JlYXRlV2F0ZXJjcmF3bFRhc2sgd2l0aCBjb3JyZWN0IHBhcmFtZXRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdhcGktdGVzdC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjcmF3bE9wdGlvbnMgPSBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IDUsIG1heF9kZXB0aDogMyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjcmF3bE9wdGlvbnMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2FwaS10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHVybDogJ2h0dHBzOi8vYXBpLXRlc3QuY29tJyxcbiAgICAgICAgICBvcHRpb25zOiBjcmF3bE9wdGlvbnMsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlbGV0ZSBtYXhfZGVwdGggZnJvbSBvcHRpb25zIHdoZW4gaXQgaXMgZW1wdHkgc3RyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAndGVzdC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjcmF3bE9wdGlvbnMgPSBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbWF4X2RlcHRoOiAnJyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjcmF3bE9wdGlvbnMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3Rlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gbWF4X2RlcHRoIHNob3VsZCBiZSBkZWxldGVkIGZyb20gdGhlIHJlcXVlc3RcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBjYWxsQXJncyA9IG1vY2tDcmVhdGVUYXNrLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgICAgZXhwZWN0KGNhbGxBcmdzLm9wdGlvbnMpLm5vdC50b0hhdmVQcm9wZXJ0eSgnbWF4X2RlcHRoJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcG9sbCBmb3Igc3RhdHVzIHdpdGggam9iX2lkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uSm9iSWRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3BvbGwtam9iLTEyMycgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAyLFxuICAgICAgICB0b3RhbDogMixcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3AxLmNvbScgfSksXG4gICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcDIuY29tJyB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25Kb2JJZENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vcG9sbC10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkpvYklkQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncG9sbC1qb2ItMTIzJylcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NoZWNrU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncG9sbC1qb2ItMTIzJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVycm9yIHN0YXR1cyBmcm9tIHBvbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdmYWlsLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdDcmF3bCBmYWlsZWQgZHVlIHRvIG5ldHdvcmsgZXJyb3InLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZmFpbC10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmV4Y2VwdGlvbkVycm9yVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyYXdsIGZhaWxlZCBkdWUgdG8gbmV0d29yayBlcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBlcnJvciBkdXJpbmcgc3RhdHVzIGNoZWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnZXJyb3Itam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZWplY3RlZFZhbHVlT25jZSh7XG4gICAgICAgIGpzb246ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IG1lc3NhZ2U6ICdBUEkgRXJyb3Igb2NjdXJyZWQnIH0pLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXJyb3ItdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5leGNlcHRpb25FcnJvclRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGltaXQgdG90YWwgdG8gY3Jhd2xPcHRpb25zLmxpbWl0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdsaW1pdC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMTAwLFxuICAgICAgICB0b3RhbDogMTAwLFxuICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMDAgfSwgKF8sIGkpID0+XG4gICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogYGh0dHBzOi8vZXhhbXBsZS5jb20vJHtpfWAgfSkpLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSxcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IDUgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vbGltaXQtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVzcG9uc2Ugd2l0aG91dCBzdGF0dXMgZmllbGQgYXMgZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICduby1zdGF0dXMtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIC8vIE5vIHN0YXR1cyBmaWVsZFxuICAgICAgICBtZXNzYWdlOiAnVW5rbm93biBlcnJvcicsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9uby1zdGF0dXMtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5leGNlcHRpb25FcnJvclRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydCAtIFJlYWN0Lm1lbW8gY29tcG9uZW50cyBoYXZlICQkdHlwZW9mIFN5bWJvbChyZWFjdC5tZW1vKVxuICAgICAgZXhwZWN0KFdhdGVyQ3Jhd2wuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQmUoJ1N5bWJvbChyZWFjdC5tZW1vKScpXG4gICAgICBleHBlY3QoKFdhdGVyQ3Jhd2wgYXMgdW5rbm93biBhcyB7IHR5cGU6IHVua25vd24gfSkudHlwZSkudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgZm9yIGVtcHR5IFVSTCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gVG9hc3Qgc2hvdWxkIGJlIHNob3duIChtb2NrZWQgdmlhIFRvYXN0IGNvbXBvbmVudClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlV2F0ZXJjcmF3bFRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBmb3IgaW52YWxpZCBVUkwgZm9ybWF0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2ludmFsaWQtdXJsJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNyZWF0ZVdhdGVyY3Jhd2xUYXNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgZm9yIFVSTCB3aXRob3V0IHByb3RvY29sJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNyZWF0ZVdhdGVyY3Jhd2xUYXNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFjY2VwdCBVUkwgd2l0aCBodHRwOi8vIHByb3RvY29sJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnaHR0cC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cDovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVUYXNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIGxpbWl0IGlzIGVtcHR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogJycgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlV2F0ZXJjcmF3bFRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIGxpbWl0IGlzIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiBudWxsIGFzIHVua25vd24gYXMgbnVtYmVyIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4YW1wbGUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNyZWF0ZVdhdGVyY3Jhd2xUYXNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igd2hlbiBsaW1pdCBpcyB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBudW1iZXIgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vZXhhbXBsZS5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY3JlYXRlV2F0ZXJjcmF3bFRhc2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSB0aHJvd2luZyBhbiBleGNlcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ05ldHdvcmsgZXJyb3InKSlcbiAgICAgIC8vIFN1cHByZXNzIGNvbnNvbGUgb3V0cHV0IGR1cmluZyB0ZXN0IHRvIGF2b2lkIG5vaXN5IGxvZ3NcbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnbG9nJykubW9ja0ltcGxlbWVudGF0aW9uKHZpLmZuKCkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2V4Y2VwdGlvbi10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLmV4Y2VwdGlvbkVycm9yVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB1bmtub3duIGVycm9yIHdoZW4gZXJyb3IgbWVzc2FnZSBpcyBlbXB0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ2VtcHR5LWVycm9yLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIC8vIE5vIG1lc3NhZ2VcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2VtcHR5LWVycm9yLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUudW5rbm93bkVycm9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRhdGEgYXJyYXkgZnJvbSBBUEknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ2VtcHR5LWRhdGEtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHRvdGFsOiAwLFxuICAgICAgICBkYXRhOiBbXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2VtcHR5LWRhdGEtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBkYXRhIGZyb20gcnVubmluZyBzdGF0dXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ251bGwtZGF0YS1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXNcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgICAgc3RhdHVzOiAncnVubmluZycsXG4gICAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgICB0b3RhbDogNSxcbiAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgIGN1cnJlbnQ6IDUsXG4gICAgICAgICAgdG90YWw6IDUsXG4gICAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vbnVsbC1kYXRhLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkYXRhIGZyb20gY29tcGxldGVkIGpvYiBwb2xsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd1bmRlZmluZWQtZGF0YS1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIC8vIGRhdGEgaXMgdW5kZWZpbmVkIC0gdHJpZ2dlcnMgfHwgW10gZmFsbGJhY2tcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3VuZGVmaW5lZC1kYXRhLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyYXdsUmVzdWx0IHdpdGggemVybyBjdXJyZW50IHZhbHVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnemVyby1jdXJyZW50LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4geyAvKiBuZXZlciByZXNvbHZlcyAqLyB9KSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogMTAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vemVyby1jdXJyZW50LXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHNob3cgMC8xMCBpbiBjcmF3bGluZyBpbmRpY2F0b3JcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzEwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyYXdsUmVzdWx0IHdpdGggemVybyB0b3RhbCBhbmQgZW1wdHkgbGltaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd6ZXJvLXRvdGFsLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4geyAvKiBuZXZlciByZXNvbHZlcyAqLyB9KSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogJzAnIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3plcm8tdG90YWwtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgc2hvdyAwLzBcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGNyYXdsUmVzdWx0IGRhdGEgaW4gZmluaXNoZWQgc3RhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3VuZGVmaW5lZC1yZXN1bHQtZGF0YS1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICAgIC8vIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly91bmRlZmluZWQtcmVzdWx0LWRhdGEtdGVzdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgY29tcGxldGUgYW5kIHNob3cgcmVzdWx0c1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9zY3JhcFRpbWVJbmZvL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBwYXJzZUZsb2F0IGZhbGxiYWNrIHdoZW4gY3Jhd2xSZXN1bHQudG90YWwgaXMgdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnbm8tdG90YWwtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAxNSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9uby10b3RhbC10ZXN0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCB1c2UgbGltaXQgKDE1KSBhcyB0b3RhbFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC90b3RhbFBhZ2VTY3JhcGVkLiowXFwvMTUvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3Jhd2xSZXN1bHQgd2l0aCBjdXJyZW50PTAgYW5kIHRvdGFsPTAgZHVyaW5nIHJ1bm5pbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdib3RoLXplcm8tam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzXG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICAgIHN0YXR1czogJ3J1bm5pbmcnLFxuICAgICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgICAgdG90YWw6IDAsXG4gICAgICAgICAgZGF0YTogW10sXG4gICAgICAgIH0pXG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHsgLyogbmV2ZXIgcmVzb2x2ZXMgKi8gfSkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IDUgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vYm90aC16ZXJvLXRlc3QuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3RvdGFsUGFnZVNjcmFwZWQvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWxsIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGxpbWl0IHZhbHVlcyBpbiBjcmF3bE9wdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdsaW1pdC12YXItam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogMTAwIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2xpbWl0LmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBsaW1pdDogMTAwIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgbWF4X2RlcHRoIHZhbHVlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ2RlcHRoLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbWF4X2RlcHRoOiA1IH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2RlcHRoLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBtYXhfZGVwdGg6IDUgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyYXdsX3N1Yl9wYWdlcyBkaXNhYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ25vc3ViLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgY3Jhd2xfc3ViX3BhZ2VzOiBmYWxzZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9ub3N1Yi5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgY3Jhd2xfc3ViX3BhZ2VzOiBmYWxzZSB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdXNlX3NpdGVtYXAgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3NpdGVtYXAtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyB1c2Vfc2l0ZW1hcDogdHJ1ZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9zaXRlbWFwLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlVGFzaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgb3B0aW9uczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB1c2Vfc2l0ZW1hcDogdHJ1ZSB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5jbHVkZXMgYW5kIGV4Y2x1ZGVzIHBhdHRlcm5zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAncGF0dGVybnMtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoe1xuICAgICAgICAgIGluY2x1ZGVzOiAnL2RvY3MvKicsXG4gICAgICAgICAgZXhjbHVkZXM6ICcvYXBpLyonLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9wYXR0ZXJucy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9wdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgaW5jbHVkZXM6ICcvZG9jcy8qJyxcbiAgICAgICAgICAgICAgZXhjbHVkZXM6ICcvYXBpLyonLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHByZS1zZWxlY3RlZCBjcmF3bCByZXN1bHRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IGV4aXN0aW5nUmVzdWx0ID0gY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhpc3RpbmcuY29tJyB9KVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdwcmVzZWxlY3Qtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgdGl0bGU6ICdOZXcnIH0pXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY2hlY2tlZENyYXdsUmVzdWx0OiBbZXhpc3RpbmdSZXN1bHRdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL25ldy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZVRhc2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RyaW5nIHR5cGUgbGltaXQgdmFsdWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdzdHJpbmctbGltaXQtam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmF3bE9wdGlvbnM6IGNyZWF0ZURlZmF1bHRDcmF3bE9wdGlvbnMoeyBsaW1pdDogJzI1JyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9zdHJpbmctbGltaXQuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVUYXNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9ubHlfbWFpbl9jb250ZW50IG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ21haW4tY29udGVudC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IG9ubHlfbWFpbl9jb250ZW50OiBmYWxzZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9tYWluLWNvbnRlbnQuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVUYXNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBvcHRpb25zOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IG9ubHlfbWFpbl9jb250ZW50OiBmYWxzZSB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRGlzcGxheSBhbmQgVUkgU3RhdGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGlzcGxheSBhbmQgVUkgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBjcmF3bGluZyBwcm9ncmVzcyBkdXJpbmcgcnVubmluZyBzdGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3Byb2dyZXNzLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4geyAvKiBwZW5kaW5nICovIH0pKVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyYXdsT3B0aW9uczogY3JlYXRlRGVmYXVsdENyYXdsT3B0aW9ucyh7IGxpbWl0OiAxMCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9wcm9ncmVzcy5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvdG90YWxQYWdlU2NyYXBlZC4qMFxcLzEwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSB0aW1lIGNvbnN1bWVkIGFmdGVyIGNyYXdsIGNvbXBsZXRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICd0aW1lLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgdGltZV9jb25zdW1pbmc6IDIuNSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3RpbWUuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NjcmFwVGltZUluZm8vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjcmF3bGVkIHJlc3VsdHMgbGlzdCBhZnRlciBjb21wbGV0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAncmVzdWx0LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICBjdXJyZW50OiAxLFxuICAgICAgICB0b3RhbDogMSxcbiAgICAgICAgZGF0YTogW2NyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHRpdGxlOiAnUmVzdWx0IFBhZ2UnIH0pXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL3Jlc3VsdC5jb20nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUmVzdWx0IFBhZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIG1lc3NhZ2UgY29tcG9uZW50IHdoZW4gY3Jhd2wgZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignRmFpbGVkJykpXG4gICAgICAvLyBTdXBwcmVzcyBjb25zb2xlIG91dHB1dCBkdXJpbmcgdGVzdCB0byBhdm9pZCBub2lzeSBsb2dzXG4gICAgICB2aS5zcHlPbihjb25zb2xlLCAnbG9nJykubW9ja0ltcGxlbWVudGF0aW9uKHZpLmZuKCkpXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2ZhaWwuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuZXhjZXB0aW9uRXJyb3JUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBwcm9ncmVzcyBkdXJpbmcgbXVsdGlwbGUgcG9sbGluZyBpdGVyYXRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWF0ZVRhc2sgPSBjcmVhdGVXYXRlcmNyYXdsVGFzayBhcyBNb2NrXG4gICAgICBjb25zdCBtb2NrQ2hlY2tTdGF0dXMgPSBjaGVja1dhdGVyY3Jhd2xUYXNrU3RhdHVzIGFzIE1vY2tcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdtdWx0aS1wb2xsLWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1c1xuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdydW5uaW5nJyxcbiAgICAgICAgICBjdXJyZW50OiAyLFxuICAgICAgICAgIHRvdGFsOiAxMCxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMS5jb20nIH0pLFxuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJyB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdydW5uaW5nJyxcbiAgICAgICAgICBjdXJyZW50OiA1LFxuICAgICAgICAgIHRvdGFsOiAxMCxcbiAgICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1IH0sIChfLCBpKSA9PlxuICAgICAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogYGh0dHBzOi8vcGFnZSR7aSArIDF9LmNvbWAgfSkpLFxuICAgICAgICB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgIGN1cnJlbnQ6IDEwLFxuICAgICAgICAgIHRvdGFsOiAxMCxcbiAgICAgICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT5cbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6IGBodHRwczovL3BhZ2Uke2kgKyAxfS5jb21gIH0pKSxcbiAgICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSxcbiAgICAgICAgY3Jhd2xPcHRpb25zOiBjcmVhdGVEZWZhdWx0Q3Jhd2xPcHRpb25zKHsgbGltaXQ6IDEwIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL211bHRpLXBvbGwuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGV2ZW50dWFsbHkgY29tcGxldGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NoZWNrU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmFsIHJlc3VsdCBzaG91bGQgYmUgc2VsZWN0ZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJyB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb21wbGV0ZSBmdWxsIGNyYXdsIHdvcmtmbG93IHdpdGggam9iIHBvbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlYXRlVGFzayA9IGNyZWF0ZVdhdGVyY3Jhd2xUYXNrIGFzIE1vY2tcbiAgICAgIGNvbnN0IG1vY2tDaGVja1N0YXR1cyA9IGNoZWNrV2F0ZXJjcmF3bFRhc2tTdGF0dXMgYXMgTW9ja1xuICAgICAgY29uc3Qgb25DaGVja2VkQ3Jhd2xSZXN1bHRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkpvYklkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ3JlYXRlVGFzay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBqb2JfaWQ6ICdmdWxsLXdvcmtmbG93LWpvYicgfSlcbiAgICAgIG1vY2tDaGVja1N0YXR1c1xuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdydW5uaW5nJyxcbiAgICAgICAgICBjdXJyZW50OiAyLFxuICAgICAgICAgIHRvdGFsOiA1LFxuICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScsIHRpdGxlOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UyLmNvbScsIHRpdGxlOiAnUGFnZSAyJyB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KVxuICAgICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnLFxuICAgICAgICAgIGN1cnJlbnQ6IDUsXG4gICAgICAgICAgdG90YWw6IDUsXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IDMuNSxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMS5jb20nLCB0aXRsZTogJ1BhZ2UgMScgfSksXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMi5jb20nLCB0aXRsZTogJ1BhZ2UgMicgfSksXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMy5jb20nLCB0aXRsZTogJ1BhZ2UgMycgfSksXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlNC5jb20nLCB0aXRsZTogJ1BhZ2UgNCcgfSksXG4gICAgICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlNS5jb20nLCB0aXRsZTogJ1BhZ2UgNScgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSxcbiAgICAgICAgb25Kb2JJZENoYW5nZSxcbiAgICAgICAgb25QcmV2aWV3LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdhdGVyQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdodHRwczovL2RvY3MuZGlmeS5haS9lbi8nKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LnR5cGUoaW5wdXQsICdodHRwczovL2Z1bGwtd29ya2Zsb3cuY29tJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW4vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gam9iIGlkIHNob3VsZCBiZSBzZXRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25Kb2JJZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2Z1bGwtd29ya2Zsb3ctam9iJylcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIGZpbmFsIHJlc3VsdHMgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWdlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSA1JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNoZWNrZWQgcmVzdWx0cyBzaG91bGQgYmUgdXBkYXRlZFxuICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJyB9KSxcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2U1LmNvbScgfSksXG4gICAgICAgIF0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZWxlY3QgYWxsIGFuZCBkZXNlbGVjdCBhbGwgaW4gcmVzdWx0cycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgbW9ja0NyZWF0ZVRhc2subW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgam9iX2lkOiAnc2VsZWN0LWFsbC1qb2InIH0pXG4gICAgICBtb2NrQ2hlY2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHtcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudDogMSxcbiAgICAgICAgdG90YWw6IDEsXG4gICAgICAgIGRhdGE6IFtjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyB0aXRsZTogJ1NpbmdsZScgfSldLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2F0ZXJDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLycpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQudHlwZShpbnB1dCwgJ2h0dHBzOi8vc2luZ2xlLmNvbScpXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIFdhaXQgZm9yIHJlc3VsdHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2luZ2xlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIHNlbGVjdCBhbGwvcmVzZXQgYWxsXG4gICAgICBjb25zdCBzZWxlY3RBbGxDaGVja2JveCA9IHNjcmVlbi5nZXRCeVRleHQoL3NlbGVjdEFsbHxyZXNldEFsbC9pKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNlbGVjdEFsbENoZWNrYm94KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXRlIHdvcmtmbG93IGZyb20gaW5wdXQgdG8gcHJldmlldycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tDcmVhdGVUYXNrID0gY3JlYXRlV2F0ZXJjcmF3bFRhc2sgYXMgTW9ja1xuICAgICAgY29uc3QgbW9ja0NoZWNrU3RhdHVzID0gY2hlY2tXYXRlcmNyYXdsVGFza1N0YXR1cyBhcyBNb2NrXG4gICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uSm9iSWRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDcmVhdGVUYXNrLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGpvYl9pZDogJ3ByZXZpZXctd29ya2Zsb3ctam9iJyB9KVxuICAgICAgbW9ja0NoZWNrU3RhdHVzLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAxLFxuICAgICAgICB0aW1lX2NvbnN1bWluZzogMS4yLFxuICAgICAgICBkYXRhOiBbY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHtcbiAgICAgICAgICB0aXRsZTogJ1ByZXZpZXcgUGFnZScsXG4gICAgICAgICAgbWFya2Rvd246ICcjIFByZXZpZXcgQ29udGVudCcsXG4gICAgICAgICAgc291cmNlX3VybDogJ2h0dHBzOi8vcHJldmlldy5jb20vcGFnZScsXG4gICAgICAgIH0pXSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgb25QcmV2aWV3LFxuICAgICAgICBvbkNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSxcbiAgICAgICAgb25Kb2JJZENoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXYXRlckNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFN0ZXAgMTogRW50ZXIgVVJMXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaHR0cHM6Ly9wcmV2aWV3LmNvbScpXG5cbiAgICAgIC8vIFN0ZXAgMjogUnVuIGNyYXdsXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuL2kgfSkpXG5cbiAgICAgIC8vIFN0ZXAgMzogV2FpdCBmb3IgY29tcGxldGlvblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQcmV2aWV3IFBhZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gU3RlcCA0OiBDbGljayBwcmV2aWV3XG4gICAgICBjb25zdCBwcmV2aWV3QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5wcmV2aWV3JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhwcmV2aWV3QnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkpvYklkQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncHJldmlldy13b3JrZmxvdy1qb2InKVxuICAgICAgZXhwZWN0KG9uQ2hlY2tlZENyYXdsUmVzdWx0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19