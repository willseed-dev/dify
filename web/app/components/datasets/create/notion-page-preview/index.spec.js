"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const datasets_1 = require("@/service/datasets");
const index_1 = require("./index");
// Mock the fetchNotionPagePreview service
vi.mock('@/service/datasets', () => ({
    fetchNotionPagePreview: vi.fn(),
}));
const mockFetchNotionPagePreview = datasets_1.fetchNotionPagePreview;
// Factory function to create mock NotionPage objects
const createMockNotionPage = (overrides = {}) => {
    return {
        page_id: 'page-123',
        page_name: 'Test Page',
        page_icon: null,
        parent_id: 'parent-123',
        type: 'page',
        is_bound: false,
        workspace_id: 'workspace-123',
        ...overrides,
    };
};
// Factory function to create NotionPage with emoji icon
const createMockNotionPageWithEmojiIcon = (emoji, overrides = {}) => {
    return createMockNotionPage({
        page_icon: {
            type: 'emoji',
            url: null,
            emoji,
        },
        ...overrides,
    });
};
// Factory function to create NotionPage with URL icon
const createMockNotionPageWithUrlIcon = (url, overrides = {}) => {
    return createMockNotionPage({
        page_icon: {
            type: 'url',
            url,
            emoji: null,
        },
        ...overrides,
    });
};
// Helper to render NotionPagePreview with default props and wait for async updates
const renderNotionPagePreview = async (props = {}, waitForContent = true) => {
    const defaultProps = {
        currentPage: createMockNotionPage(),
        notionCredentialId: 'credential-123',
        hidePreview: vi.fn(),
        ...props,
    };
    const result = (0, react_1.render)(<index_1.default {...defaultProps}/>);
    // Wait for async state updates to complete if needed
    if (waitForContent && defaultProps.currentPage) {
        await (0, react_1.waitFor)(() => {
            // Wait for loading to finish
            expect(result.container.querySelector('.spin-animation')).not.toBeInTheDocument();
        });
    }
    return {
        ...result,
        props: defaultProps,
    };
};
// Helper to find the loading spinner element
const findLoadingSpinner = (container) => {
    return container.querySelector('.spin-animation');
};
// ============================================================================
// NotionPagePreview Component Tests
// ============================================================================
// Note: Branch coverage is ~88% because line 29 (`if (!currentPage) return`)
// is defensive code that cannot be reached - getPreviewContent is only called
// from useEffect when currentPage is truthy.
// ============================================================================
describe('NotionPagePreview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default successful API response
        mockFetchNotionPagePreview.mockResolvedValue({ content: 'Preview content here' });
    });
    afterEach(async () => {
        // Wait for any pending state updates to complete
        await (0, react_1.act)(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', async () => {
            // Arrange & Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
        });
        it('should render page preview header', async () => {
            // Arrange & Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
        });
        it('should render close button with XMarkIcon', async () => {
            // Arrange & Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const closeButton = container.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument();
            const xMarkIcon = closeButton?.querySelector('svg');
            expect(xMarkIcon).toBeInTheDocument();
        });
        it('should render page name', async () => {
            // Arrange
            const page = createMockNotionPage({ page_name: 'My Notion Page' });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(react_1.screen.getByText('My Notion Page')).toBeInTheDocument();
        });
        it('should apply correct CSS classes to container', async () => {
            // Arrange & Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('h-full');
        });
        it('should render NotionIcon component', async () => {
            // Arrange
            const page = createMockNotionPage();
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert - NotionIcon should be rendered (either as img or div or svg)
            const iconContainer = container.querySelector('.mr-1.shrink-0');
            expect(iconContainer).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // NotionIcon Rendering Tests
    // --------------------------------------------------------------------------
    describe('NotionIcon Rendering', () => {
        it('should render default icon when page_icon is null', async () => {
            // Arrange
            const page = createMockNotionPage({ page_icon: null });
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert - Should render RiFileTextLine icon (svg)
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
        });
        it('should render emoji icon when page_icon has emoji type', async () => {
            // Arrange
            const page = createMockNotionPageWithEmojiIcon('📝');
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(react_1.screen.getByText('📝')).toBeInTheDocument();
        });
        it('should render image icon when page_icon has url type', async () => {
            // Arrange
            const page = createMockNotionPageWithUrlIcon('https://example.com/icon.png');
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert
            const img = container.querySelector('img[alt="page icon"]');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'https://example.com/icon.png');
        });
    });
    // --------------------------------------------------------------------------
    // Loading State Tests
    // --------------------------------------------------------------------------
    describe('Loading State', () => {
        it('should show loading indicator initially', async () => {
            // Arrange - Delay API response to keep loading state
            mockFetchNotionPagePreview.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ content: 'test' }), 100)));
            // Act - Don't wait for content to load
            const { container } = await renderNotionPagePreview({}, false);
            // Assert - Loading should be visible initially
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).toBeInTheDocument();
        });
        it('should hide loading indicator after content loads', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: 'Loaded content' });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('Loaded content')).toBeInTheDocument();
            // Loading should be gone
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).not.toBeInTheDocument();
        });
        it('should show loading when currentPage changes', async () => {
            // Arrange
            const page1 = createMockNotionPage({ page_id: 'page-1', page_name: 'Page 1' });
            const page2 = createMockNotionPage({ page_id: 'page-2', page_name: 'Page 2' });
            let resolveFirst;
            let resolveSecond;
            mockFetchNotionPagePreview
                .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
                .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));
            // Act - Initial render
            const { rerender, container } = (0, react_1.render)(<index_1.default currentPage={page1} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            // First page loading - spinner should be visible
            expect(findLoadingSpinner(container)).toBeInTheDocument();
            // Resolve first page
            await (0, react_1.act)(async () => {
                resolveFirst({ content: 'Content 1' });
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Rerender with new page
            rerender(<index_1.default currentPage={page2} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            // Should show loading again
            await (0, react_1.waitFor)(() => {
                expect(findLoadingSpinner(container)).toBeInTheDocument();
            });
            // Resolve second page
            await (0, react_1.act)(async () => {
                resolveSecond({ content: 'Content 2' });
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 2')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // API Call Tests
    // --------------------------------------------------------------------------
    describe('API Calls', () => {
        it('should call fetchNotionPagePreview with correct parameters', async () => {
            // Arrange
            const page = createMockNotionPage({
                page_id: 'test-page-id',
                type: 'database',
            });
            // Act
            await renderNotionPagePreview({
                currentPage: page,
                notionCredentialId: 'test-credential-id',
            });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith({
                pageID: 'test-page-id',
                pageType: 'database',
                credentialID: 'test-credential-id',
            });
        });
        it('should not call fetchNotionPagePreview when currentPage is undefined', async () => {
            // Arrange & Act
            await renderNotionPagePreview({ currentPage: undefined }, false);
            // Assert
            expect(mockFetchNotionPagePreview).not.toHaveBeenCalled();
        });
        it('should call fetchNotionPagePreview again when currentPage changes', async () => {
            // Arrange
            const page1 = createMockNotionPage({ page_id: 'page-1' });
            const page2 = createMockNotionPage({ page_id: 'page-2' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={page1} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledWith({
                    pageID: 'page-1',
                    pageType: 'page',
                    credentialID: 'cred-123',
                });
            });
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page2} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            });
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledWith({
                    pageID: 'page-2',
                    pageType: 'page',
                    credentialID: 'cred-123',
                });
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(2);
            });
        });
        it('should handle API success and display content', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: 'Notion page preview content from API' });
            // Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('Notion page preview content from API')).toBeInTheDocument();
        });
        it('should handle API error gracefully', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('Network error'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert - Component should not crash
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
            // Header should still render
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
        });
        it('should handle empty content response', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: '' });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert - Should still render without loading
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call hidePreview when close button is clicked', async () => {
            // Arrange
            const hidePreview = vi.fn();
            const { container } = await renderNotionPagePreview({ hidePreview });
            // Act
            const closeButton = container.querySelector('.cursor-pointer');
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(hidePreview).toHaveBeenCalledTimes(1);
        });
        it('should handle multiple clicks on close button', async () => {
            // Arrange
            const hidePreview = vi.fn();
            const { container } = await renderNotionPagePreview({ hidePreview });
            // Act
            const closeButton = container.querySelector('.cursor-pointer');
            react_1.fireEvent.click(closeButton);
            react_1.fireEvent.click(closeButton);
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(hidePreview).toHaveBeenCalledTimes(3);
        });
    });
    // --------------------------------------------------------------------------
    // State Management Tests
    // --------------------------------------------------------------------------
    describe('State Management', () => {
        it('should initialize with loading state true', async () => {
            // Arrange - Keep loading indefinitely (never resolves)
            mockFetchNotionPagePreview.mockImplementation(() => new Promise(() => { }));
            // Act - Don't wait for content
            const { container } = await renderNotionPagePreview({}, false);
            // Assert
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).toBeInTheDocument();
        });
        it('should update previewContent state after successful fetch', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: 'New preview content' });
            // Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('New preview content')).toBeInTheDocument();
        });
        it('should reset loading to true when currentPage changes', async () => {
            // Arrange
            const page1 = createMockNotionPage({ page_id: 'page-1' });
            const page2 = createMockNotionPage({ page_id: 'page-2' });
            mockFetchNotionPagePreview
                .mockResolvedValueOnce({ content: 'Content 1' })
                .mockImplementationOnce(() => new Promise(() => { }));
            // Act
            const { rerender, container } = (0, react_1.render)(<index_1.default currentPage={page1} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Change page
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page2} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            });
            // Assert - Loading should be shown again
            await (0, react_1.waitFor)(() => {
                const loadingElement = findLoadingSpinner(container);
                expect(loadingElement).toBeInTheDocument();
            });
        });
        it('should replace old content with new content when page changes', async () => {
            // Arrange
            const page1 = createMockNotionPage({ page_id: 'page-1' });
            const page2 = createMockNotionPage({ page_id: 'page-2' });
            let resolveSecond;
            mockFetchNotionPagePreview
                .mockResolvedValueOnce({ content: 'Content 1' })
                .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={page1} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Change page
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page2} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            });
            // Resolve second fetch
            await (0, react_1.act)(async () => {
                resolveSecond({ content: 'Content 2' });
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 2')).toBeInTheDocument();
                expect(react_1.screen.queryByText('Content 1')).not.toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('currentPage prop', () => {
            it('should render correctly with currentPage prop', async () => {
                // Arrange
                const page = createMockNotionPage({ page_name: 'My Test Page' });
                // Act
                await renderNotionPagePreview({ currentPage: page });
                // Assert
                expect(react_1.screen.getByText('My Test Page')).toBeInTheDocument();
            });
            it('should render correctly without currentPage prop (undefined)', async () => {
                // Arrange & Act
                await renderNotionPagePreview({ currentPage: undefined }, false);
                // Assert - Header should still render
                expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
            });
            it('should handle page with empty name', async () => {
                // Arrange
                const page = createMockNotionPage({ page_name: '' });
                // Act
                const { container } = await renderNotionPagePreview({ currentPage: page });
                // Assert - Should not crash
                expect(container.firstChild).toBeInTheDocument();
            });
            it('should handle page with very long name', async () => {
                // Arrange
                const longName = 'a'.repeat(200);
                const page = createMockNotionPage({ page_name: longName });
                // Act
                await renderNotionPagePreview({ currentPage: page });
                // Assert
                expect(react_1.screen.getByText(longName)).toBeInTheDocument();
            });
            it('should handle page with special characters in name', async () => {
                // Arrange
                const page = createMockNotionPage({ page_name: 'Page with <special> & "chars"' });
                // Act
                await renderNotionPagePreview({ currentPage: page });
                // Assert
                expect(react_1.screen.getByText('Page with <special> & "chars"')).toBeInTheDocument();
            });
            it('should handle page with unicode characters in name', async () => {
                // Arrange
                const page = createMockNotionPage({ page_name: '中文页面名称 🚀 日本語' });
                // Act
                await renderNotionPagePreview({ currentPage: page });
                // Assert
                expect(react_1.screen.getByText('中文页面名称 🚀 日本語')).toBeInTheDocument();
            });
        });
        describe('notionCredentialId prop', () => {
            it('should pass notionCredentialId to API call', async () => {
                // Arrange
                const page = createMockNotionPage();
                // Act
                await renderNotionPagePreview({
                    currentPage: page,
                    notionCredentialId: 'my-credential-id',
                });
                // Assert
                expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ credentialID: 'my-credential-id' }));
            });
        });
        describe('hidePreview prop', () => {
            it('should accept hidePreview callback', async () => {
                // Arrange
                const hidePreview = vi.fn();
                // Act
                await renderNotionPagePreview({ hidePreview });
                // Assert - No errors thrown
                expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle page with undefined page_id', async () => {
            // Arrange
            const page = createMockNotionPage({ page_id: undefined });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert - API should still be called (with undefined pageID)
            expect(mockFetchNotionPagePreview).toHaveBeenCalled();
        });
        it('should handle page with empty string page_id', async () => {
            // Arrange
            const page = createMockNotionPage({ page_id: '' });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ pageID: '' }));
        });
        it('should handle very long preview content', async () => {
            // Arrange
            const longContent = 'x'.repeat(10000);
            mockFetchNotionPagePreview.mockResolvedValue({ content: longContent });
            // Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText(longContent)).toBeInTheDocument();
        });
        it('should handle preview content with special characters safely', async () => {
            // Arrange
            const specialContent = '<script>alert("xss")</script>\n\t& < > "';
            mockFetchNotionPagePreview.mockResolvedValue({ content: specialContent });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert - Should render as text, not execute scripts
            const contentDiv = container.querySelector('[class*="fileContent"]');
            expect(contentDiv).toBeInTheDocument();
            expect(contentDiv?.textContent).toContain('alert');
        });
        it('should handle preview content with unicode', async () => {
            // Arrange
            const unicodeContent = '中文内容 🚀 émojis & spëcîal çhàrs';
            mockFetchNotionPagePreview.mockResolvedValue({ content: unicodeContent });
            // Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText(unicodeContent)).toBeInTheDocument();
        });
        it('should handle preview content with newlines', async () => {
            // Arrange
            const multilineContent = 'Line 1\nLine 2\nLine 3';
            mockFetchNotionPagePreview.mockResolvedValue({ content: multilineContent });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const contentDiv = container.querySelector('[class*="fileContent"]');
            expect(contentDiv).toBeInTheDocument();
            expect(contentDiv?.textContent).toContain('Line 1');
            expect(contentDiv?.textContent).toContain('Line 2');
            expect(contentDiv?.textContent).toContain('Line 3');
        });
        it('should handle null content from API', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: null });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert - Should not crash
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle different page types', async () => {
            // Arrange
            const databasePage = createMockNotionPage({ type: 'database' });
            // Act
            await renderNotionPagePreview({ currentPage: databasePage });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ pageType: 'database' }));
        });
    });
    // --------------------------------------------------------------------------
    // Side Effects and Cleanup Tests
    // --------------------------------------------------------------------------
    describe('Side Effects and Cleanup', () => {
        it('should trigger effect when currentPage prop changes', async () => {
            // Arrange
            const page1 = createMockNotionPage({ page_id: 'page-1' });
            const page2 = createMockNotionPage({ page_id: 'page-2' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={page1} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
            });
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page2} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            });
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(2);
            });
        });
        it('should not trigger effect when hidePreview changes', async () => {
            // Arrange
            const page = createMockNotionPage();
            const hidePreview1 = vi.fn();
            const hidePreview2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={page} notionCredentialId="cred-123" hidePreview={hidePreview1}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
            });
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page} notionCredentialId="cred-123" hidePreview={hidePreview2}/>);
            });
            // Assert - Should not call API again (currentPage didn't change by reference)
            // Note: Since currentPage is the same object, effect should not re-run
            expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
        });
        it('should not trigger effect when notionCredentialId changes', async () => {
            // Arrange
            const page = createMockNotionPage();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={page} notionCredentialId="cred-1" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
            });
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={page} notionCredentialId="cred-2" hidePreview={vi.fn()}/>);
            });
            // Assert - Should not call API again (only currentPage is in dependency array)
            expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
        });
        it('should handle rapid page changes', async () => {
            // Arrange
            const pages = Array.from({ length: 5 }, (_, i) => createMockNotionPage({ page_id: `page-${i}` }));
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default currentPage={pages[0]} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            // Rapidly change pages
            for (let i = 1; i < pages.length; i++) {
                await (0, react_1.act)(async () => {
                    rerender(<index_1.default currentPage={pages[i]} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
                });
            }
            // Assert - Should have called API for each page
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(5);
            });
        });
        it('should handle unmount during loading', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ content: 'delayed' }), 1000)));
            // Act - Don't wait for content
            const { unmount } = await renderNotionPagePreview({}, false);
            // Unmount before API resolves
            unmount();
            // Assert - No errors should be thrown
            expect(true).toBe(true);
        });
        it('should handle page changing from defined to undefined', async () => {
            // Arrange
            const page = createMockNotionPage();
            // Act
            const { rerender, container } = (0, react_1.render)(<index_1.default currentPage={page} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
            });
            await (0, react_1.act)(async () => {
                rerender(<index_1.default currentPage={undefined} notionCredentialId="cred-123" hidePreview={vi.fn()}/>);
            });
            // Assert - Should not crash, API should not be called again
            expect(container.firstChild).toBeInTheDocument();
            expect(mockFetchNotionPagePreview).toHaveBeenCalledTimes(1);
        });
    });
    // --------------------------------------------------------------------------
    // Accessibility Tests
    // --------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have clickable close button with visual indicator', async () => {
            // Arrange & Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const closeButton = container.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('cursor-pointer');
        });
        it('should have proper heading structure', async () => {
            // Arrange & Act
            await renderNotionPagePreview();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Error Handling Tests
    // --------------------------------------------------------------------------
    describe('Error Handling', () => {
        it('should not crash on API network error', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('Network Error'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert - Component should still render
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should not crash on API timeout', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('Timeout'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should not crash on malformed API response', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({});
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle 404 error gracefully', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('404 Not Found'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should handle 500 error gracefully', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('500 Internal Server Error'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should handle authorization error gracefully', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockRejectedValue(new Error('401 Unauthorized'));
            // Act
            const { container } = await renderNotionPagePreview({}, false);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Page Type Variations Tests
    // --------------------------------------------------------------------------
    describe('Page Type Variations', () => {
        it('should handle page type', async () => {
            // Arrange
            const page = createMockNotionPage({ type: 'page' });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ pageType: 'page' }));
        });
        it('should handle database type', async () => {
            // Arrange
            const page = createMockNotionPage({ type: 'database' });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ pageType: 'database' }));
        });
        it('should handle unknown type', async () => {
            // Arrange
            const page = createMockNotionPage({ type: 'unknown_type' });
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(mockFetchNotionPagePreview).toHaveBeenCalledWith(expect.objectContaining({ pageType: 'unknown_type' }));
        });
    });
    // --------------------------------------------------------------------------
    // Icon Type Variations Tests
    // --------------------------------------------------------------------------
    describe('Icon Type Variations', () => {
        it('should handle page with null icon', async () => {
            // Arrange
            const page = createMockNotionPage({ page_icon: null });
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert - Should render default icon
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
        });
        it('should handle page with emoji icon object', async () => {
            // Arrange
            const page = createMockNotionPageWithEmojiIcon('📄');
            // Act
            await renderNotionPagePreview({ currentPage: page });
            // Assert
            expect(react_1.screen.getByText('📄')).toBeInTheDocument();
        });
        it('should handle page with url icon object', async () => {
            // Arrange
            const page = createMockNotionPageWithUrlIcon('https://example.com/custom-icon.png');
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert
            const img = container.querySelector('img[alt="page icon"]');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', 'https://example.com/custom-icon.png');
        });
        it('should handle page with icon object having null values', async () => {
            // Arrange
            const page = createMockNotionPage({
                page_icon: {
                    type: null,
                    url: null,
                    emoji: null,
                },
            });
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert - Should render, likely with default/fallback
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle page with icon object having empty url', async () => {
            // Arrange
            // Suppress console.error for this test as we're intentionally testing empty src edge case
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
            const page = createMockNotionPage({
                page_icon: {
                    type: 'url',
                    url: '',
                    emoji: null,
                },
            });
            // Act
            const { container } = await renderNotionPagePreview({ currentPage: page });
            // Assert - Component should not crash, may render img or fallback
            expect(container.firstChild).toBeInTheDocument();
            // NotionIcon renders img when type is 'url'
            const img = container.querySelector('img[alt="page icon"]');
            if (img)
                expect(img).toBeInTheDocument();
            // Restore console.error
            consoleErrorSpy.mockRestore();
        });
    });
    // --------------------------------------------------------------------------
    // Content Display Tests
    // --------------------------------------------------------------------------
    describe('Content Display', () => {
        it('should display content in fileContent div with correct class', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: 'Test content' });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const contentDiv = container.querySelector('[class*="fileContent"]');
            expect(contentDiv).toBeInTheDocument();
            expect(contentDiv).toHaveTextContent('Test content');
        });
        it('should preserve whitespace in content', async () => {
            // Arrange
            const contentWithWhitespace = '  indented content\n    more indent';
            mockFetchNotionPagePreview.mockResolvedValue({ content: contentWithWhitespace });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const contentDiv = container.querySelector('[class*="fileContent"]');
            expect(contentDiv).toBeInTheDocument();
            // The CSS class has white-space: pre-line
            expect(contentDiv?.textContent).toContain('indented content');
        });
        it('should display empty string content without loading', async () => {
            // Arrange
            mockFetchNotionPagePreview.mockResolvedValue({ content: '' });
            // Act
            const { container } = await renderNotionPagePreview();
            // Assert
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).not.toBeInTheDocument();
            const contentDiv = container.querySelector('[class*="fileContent"]');
            expect(contentDiv).toBeInTheDocument();
            expect(contentDiv?.textContent).toBe('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWdGO0FBQ2hGLGlEQUEyRDtBQUMzRCxtQ0FBdUM7QUFFdkMsMENBQTBDO0FBQzFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ2hDLENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSwwQkFBMEIsR0FBRyxpQ0FBdUUsQ0FBQTtBQUUxRyxxREFBcUQ7QUFDckQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFlBQWlDLEVBQUUsRUFBYyxFQUFFO0lBQy9FLE9BQU87UUFDTCxPQUFPLEVBQUUsVUFBVTtRQUNuQixTQUFTLEVBQUUsV0FBVztRQUN0QixTQUFTLEVBQUUsSUFBSTtRQUNmLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsZUFBZTtRQUM3QixHQUFHLFNBQVM7S0FDYixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsd0RBQXdEO0FBQ3hELE1BQU0saUNBQWlDLEdBQUcsQ0FBQyxLQUFhLEVBQUUsWUFBaUMsRUFBRSxFQUFjLEVBQUU7SUFDM0csT0FBTyxvQkFBb0IsQ0FBQztRQUMxQixTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsT0FBTztZQUNiLEdBQUcsRUFBRSxJQUFJO1lBQ1QsS0FBSztTQUNOO1FBQ0QsR0FBRyxTQUFTO0tBQ2IsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRUQsc0RBQXNEO0FBQ3RELE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxHQUFXLEVBQUUsWUFBaUMsRUFBRSxFQUFjLEVBQUU7SUFDdkcsT0FBTyxvQkFBb0IsQ0FBQztRQUMxQixTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUs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QU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9ja2VkRnVuY3Rpb24gfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgdHlwZSB7IE5vdGlvblBhZ2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgeyBhY3QsIGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgZmV0Y2hOb3Rpb25QYWdlUHJldmlldyB9IGZyb20gJ0Avc2VydmljZS9kYXRhc2V0cydcbmltcG9ydCBOb3Rpb25QYWdlUHJldmlldyBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIHRoZSBmZXRjaE5vdGlvblBhZ2VQcmV2aWV3IHNlcnZpY2VcbnZpLm1vY2soJ0Avc2VydmljZS9kYXRhc2V0cycsICgpID0+ICh7XG4gIGZldGNoTm90aW9uUGFnZVByZXZpZXc6IHZpLmZuKCksXG59KSlcblxuY29uc3QgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcgPSBmZXRjaE5vdGlvblBhZ2VQcmV2aWV3IGFzIE1vY2tlZEZ1bmN0aW9uPHR5cGVvZiBmZXRjaE5vdGlvblBhZ2VQcmV2aWV3PlxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIE5vdGlvblBhZ2Ugb2JqZWN0c1xuY29uc3QgY3JlYXRlTW9ja05vdGlvblBhZ2UgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPE5vdGlvblBhZ2U+ID0ge30pOiBOb3Rpb25QYWdlID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwYWdlX2lkOiAncGFnZS0xMjMnLFxuICAgIHBhZ2VfbmFtZTogJ1Rlc3QgUGFnZScsXG4gICAgcGFnZV9pY29uOiBudWxsLFxuICAgIHBhcmVudF9pZDogJ3BhcmVudC0xMjMnLFxuICAgIHR5cGU6ICdwYWdlJyxcbiAgICBpc19ib3VuZDogZmFsc2UsXG4gICAgd29ya3NwYWNlX2lkOiAnd29ya3NwYWNlLTEyMycsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9XG59XG5cbi8vIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIE5vdGlvblBhZ2Ugd2l0aCBlbW9qaSBpY29uXG5jb25zdCBjcmVhdGVNb2NrTm90aW9uUGFnZVdpdGhFbW9qaUljb24gPSAoZW1vamk6IHN0cmluZywgb3ZlcnJpZGVzOiBQYXJ0aWFsPE5vdGlvblBhZ2U+ID0ge30pOiBOb3Rpb25QYWdlID0+IHtcbiAgcmV0dXJuIGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHtcbiAgICBwYWdlX2ljb246IHtcbiAgICAgIHR5cGU6ICdlbW9qaScsXG4gICAgICB1cmw6IG51bGwsXG4gICAgICBlbW9qaSxcbiAgICB9LFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfSlcbn1cblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgTm90aW9uUGFnZSB3aXRoIFVSTCBpY29uXG5jb25zdCBjcmVhdGVNb2NrTm90aW9uUGFnZVdpdGhVcmxJY29uID0gKHVybDogc3RyaW5nLCBvdmVycmlkZXM6IFBhcnRpYWw8Tm90aW9uUGFnZT4gPSB7fSk6IE5vdGlvblBhZ2UgPT4ge1xuICByZXR1cm4gY3JlYXRlTW9ja05vdGlvblBhZ2Uoe1xuICAgIHBhZ2VfaWNvbjoge1xuICAgICAgdHlwZTogJ3VybCcsXG4gICAgICB1cmwsXG4gICAgICBlbW9qaTogbnVsbCxcbiAgICB9LFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfSlcbn1cblxuLy8gSGVscGVyIHRvIHJlbmRlciBOb3Rpb25QYWdlUHJldmlldyB3aXRoIGRlZmF1bHQgcHJvcHMgYW5kIHdhaXQgZm9yIGFzeW5jIHVwZGF0ZXNcbmNvbnN0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3ID0gYXN5bmMgKFxuICBwcm9wczogUGFydGlhbDx7XG4gICAgY3VycmVudFBhZ2U/OiBOb3Rpb25QYWdlXG4gICAgbm90aW9uQ3JlZGVudGlhbElkOiBzdHJpbmdcbiAgICBoaWRlUHJldmlldzogKCkgPT4gdm9pZFxuICB9PiA9IHt9LFxuICB3YWl0Rm9yQ29udGVudCA9IHRydWUsXG4pID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIGN1cnJlbnRQYWdlOiBjcmVhdGVNb2NrTm90aW9uUGFnZSgpLFxuICAgIG5vdGlvbkNyZWRlbnRpYWxJZDogJ2NyZWRlbnRpYWwtMTIzJyxcbiAgICBoaWRlUHJldmlldzogdmkuZm4oKSxcbiAgICAuLi5wcm9wcyxcbiAgfVxuICBjb25zdCByZXN1bHQgPSByZW5kZXIoPE5vdGlvblBhZ2VQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gIC8vIFdhaXQgZm9yIGFzeW5jIHN0YXRlIHVwZGF0ZXMgdG8gY29tcGxldGUgaWYgbmVlZGVkXG4gIGlmICh3YWl0Rm9yQ29udGVudCAmJiBkZWZhdWx0UHJvcHMuY3VycmVudFBhZ2UpIHtcbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIC8vIFdhaXQgZm9yIGxvYWRpbmcgdG8gZmluaXNoXG4gICAgICBleHBlY3QocmVzdWx0LmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3Bpbi1hbmltYXRpb24nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5yZXN1bHQsXG4gICAgcHJvcHM6IGRlZmF1bHRQcm9wcyxcbiAgfVxufVxuXG4vLyBIZWxwZXIgdG8gZmluZCB0aGUgbG9hZGluZyBzcGlubmVyIGVsZW1lbnRcbmNvbnN0IGZpbmRMb2FkaW5nU3Bpbm5lciA9IChjb250YWluZXI6IEhUTUxFbGVtZW50KSA9PiB7XG4gIHJldHVybiBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNwaW4tYW5pbWF0aW9uJylcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTm90aW9uUGFnZVByZXZpZXcgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBOb3RlOiBCcmFuY2ggY292ZXJhZ2UgaXMgfjg4JSBiZWNhdXNlIGxpbmUgMjkgKGBpZiAoIWN1cnJlbnRQYWdlKSByZXR1cm5gKVxuLy8gaXMgZGVmZW5zaXZlIGNvZGUgdGhhdCBjYW5ub3QgYmUgcmVhY2hlZCAtIGdldFByZXZpZXdDb250ZW50IGlzIG9ubHkgY2FsbGVkXG4vLyBmcm9tIHVzZUVmZmVjdCB3aGVuIGN1cnJlbnRQYWdlIGlzIHRydXRoeS5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdOb3Rpb25QYWdlUHJldmlldycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gRGVmYXVsdCBzdWNjZXNzZnVsIEFQSSByZXNwb25zZVxuICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogJ1ByZXZpZXcgY29udGVudCBoZXJlJyB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gICAgLy8gV2FpdCBmb3IgYW55IHBlbmRpbmcgc3RhdGUgdXBkYXRlcyB0byBjb21wbGV0ZVxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMCkpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgLSBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgcHJvcGVybHlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5wYWdlUHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhZ2UgcHJldmlldyBoZWFkZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLnBhZ2VQcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xvc2UgYnV0dG9uIHdpdGggWE1hcmtJY29uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBjb25zdCB4TWFya0ljb24gPSBjbG9zZUJ1dHRvbj8ucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdCh4TWFya0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFnZSBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9uYW1lOiAnTXkgTm90aW9uIFBhZ2UnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNeSBOb3Rpb24gUGFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBDU1MgY2xhc3NlcyB0byBjb250YWluZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdoLWZ1bGwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBOb3Rpb25JY29uIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHBhZ2UgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTm90aW9uSWNvbiBzaG91bGQgYmUgcmVuZGVyZWQgKGVpdGhlciBhcyBpbWcgb3IgZGl2IG9yIHN2ZylcbiAgICAgIGNvbnN0IGljb25Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm1yLTEuc2hyaW5rLTAnKVxuICAgICAgZXhwZWN0KGljb25Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE5vdGlvbkljb24gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdOb3Rpb25JY29uIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZWZhdWx0IGljb24gd2hlbiBwYWdlX2ljb24gaXMgbnVsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWNvbjogbnVsbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgUmlGaWxlVGV4dExpbmUgaWNvbiAoc3ZnKVxuICAgICAgY29uc3Qgc3ZnSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2Z0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1vamkgaWNvbiB3aGVuIHBhZ2VfaWNvbiBoYXMgZW1vamkgdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZVdpdGhFbW9qaUljb24oJ/Cfk50nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHBhZ2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn8J+TnScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGltYWdlIGljb24gd2hlbiBwYWdlX2ljb24gaGFzIHVybCB0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlV2l0aFVybEljb24oJ2h0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmcnKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW1nID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZ1thbHQ9XCJwYWdlIGljb25cIl0nKVxuICAgICAgZXhwZWN0KGltZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBMb2FkaW5nIFN0YXRlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIGluZGljYXRvciBpbml0aWFsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gRGVsYXkgQVBJIHJlc3BvbnNlIHRvIGtlZXAgbG9hZGluZyBzdGF0ZVxuICAgICAgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcubW9ja0ltcGxlbWVudGF0aW9uKFxuICAgICAgICAoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh7IGNvbnRlbnQ6ICd0ZXN0JyB9KSwgMTAwKSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIERvbid0IHdhaXQgZm9yIGNvbnRlbnQgdG8gbG9hZFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHt9LCBmYWxzZSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTG9hZGluZyBzaG91bGQgYmUgdmlzaWJsZSBpbml0aWFsbHlcbiAgICAgIGNvbnN0IGxvYWRpbmdFbGVtZW50ID0gZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcilcbiAgICAgIGV4cGVjdChsb2FkaW5nRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZGUgbG9hZGluZyBpbmRpY2F0b3IgYWZ0ZXIgY29udGVudCBsb2FkcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogJ0xvYWRlZCBjb250ZW50JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0xvYWRlZCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIExvYWRpbmcgc2hvdWxkIGJlIGdvbmVcbiAgICAgIGNvbnN0IGxvYWRpbmdFbGVtZW50ID0gZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcilcbiAgICAgIGV4cGVjdChsb2FkaW5nRWxlbWVudCkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgd2hlbiBjdXJyZW50UGFnZSBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZTEgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pXG4gICAgICBjb25zdCBwYWdlMiA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMicsIHBhZ2VfbmFtZTogJ1BhZ2UgMicgfSlcblxuICAgICAgbGV0IHJlc29sdmVGaXJzdDogKHZhbHVlOiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgICBsZXQgcmVzb2x2ZVNlY29uZDogKHZhbHVlOiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB2b2lkXG5cbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3XG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IHJlc29sdmVGaXJzdCA9IHJlc29sdmUgfSkpXG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IHJlc29sdmVTZWNvbmQgPSByZXNvbHZlIH0pKVxuXG4gICAgICAvLyBBY3QgLSBJbml0aWFsIHJlbmRlclxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxOb3Rpb25QYWdlUHJldmlldyBjdXJyZW50UGFnZT17cGFnZTF9IG5vdGlvbkNyZWRlbnRpYWxJZD1cImNyZWQtMTIzXCIgaGlkZVByZXZpZXc9e3ZpLmZuKCl9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaXJzdCBwYWdlIGxvYWRpbmcgLSBzcGlubmVyIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBleHBlY3QoZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcikpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gUmVzb2x2ZSBmaXJzdCBwYWdlXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXNvbHZlRmlyc3QoeyBjb250ZW50OiAnQ29udGVudCAxJyB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBuZXcgcGFnZVxuICAgICAgcmVyZW5kZXIoPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlMn0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IGxvYWRpbmcgYWdhaW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcikpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlc29sdmUgc2Vjb25kIHBhZ2VcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlc29sdmVTZWNvbmQoeyBjb250ZW50OiAnQ29udGVudCAyJyB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFQSSBDYWxsIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdBUEkgQ2FsbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoTm90aW9uUGFnZVByZXZpZXcgd2l0aCBjb3JyZWN0IHBhcmFtZXRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2Uoe1xuICAgICAgICBwYWdlX2lkOiAndGVzdC1wYWdlLWlkJyxcbiAgICAgICAgdHlwZTogJ2RhdGFiYXNlJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoe1xuICAgICAgICBjdXJyZW50UGFnZTogcGFnZSxcbiAgICAgICAgbm90aW9uQ3JlZGVudGlhbElkOiAndGVzdC1jcmVkZW50aWFsLWlkJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBhZ2VJRDogJ3Rlc3QtcGFnZS1pZCcsXG4gICAgICAgIHBhZ2VUeXBlOiAnZGF0YWJhc2UnLFxuICAgICAgICBjcmVkZW50aWFsSUQ6ICd0ZXN0LWNyZWRlbnRpYWwtaWQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBmZXRjaE5vdGlvblBhZ2VQcmV2aWV3IHdoZW4gY3VycmVudFBhZ2UgaXMgdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogdW5kZWZpbmVkIH0sIGZhbHNlKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgZmV0Y2hOb3Rpb25QYWdlUHJldmlldyBhZ2FpbiB3aGVuIGN1cnJlbnRQYWdlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlMSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScgfSlcbiAgICAgIGNvbnN0IHBhZ2UyID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlMX0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBwYWdlSUQ6ICdwYWdlLTEnLFxuICAgICAgICAgIHBhZ2VUeXBlOiAncGFnZScsXG4gICAgICAgICAgY3JlZGVudGlhbElEOiAnY3JlZC0xMjMnLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlMn0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBwYWdlSUQ6ICdwYWdlLTInLFxuICAgICAgICAgIHBhZ2VUeXBlOiAncGFnZScsXG4gICAgICAgICAgY3JlZGVudGlhbElEOiAnY3JlZC0xMjMnLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgQVBJIHN1Y2Nlc3MgYW5kIGRpc3BsYXkgY29udGVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogJ05vdGlvbiBwYWdlIHByZXZpZXcgY29udGVudCBmcm9tIEFQSScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05vdGlvbiBwYWdlIHByZXZpZXcgY29udGVudCBmcm9tIEFQSScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBlcnJvciBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIGVycm9yJykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHt9LCBmYWxzZSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICAvLyBIZWFkZXIgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLnBhZ2VQcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgY29udGVudCByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogJycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc3RpbGwgcmVuZGVyIHdpdGhvdXQgbG9hZGluZ1xuICAgICAgY29uc3QgbG9hZGluZ0VsZW1lbnQgPSBmaW5kTG9hZGluZ1NwaW5uZXIoY29udGFpbmVyKVxuICAgICAgZXhwZWN0KGxvYWRpbmdFbGVtZW50KS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBoaWRlUHJldmlldyB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBoaWRlUHJldmlldyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpIGFzIEhUTUxFbGVtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2xvc2VCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhpZGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgY2xpY2tzIG9uIGNsb3NlIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhpZGVQcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgaGlkZVByZXZpZXcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKSBhcyBIVE1MRWxlbWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoaWRlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGxvYWRpbmcgc3RhdGUgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBLZWVwIGxvYWRpbmcgaW5kZWZpbml0ZWx5IChuZXZlciByZXNvbHZlcylcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIGludGVudGlvbmFsbHkgZW1wdHkgKi8gfSkpXG5cbiAgICAgIC8vIEFjdCAtIERvbid0IHdhaXQgZm9yIGNvbnRlbnRcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7fSwgZmFsc2UpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbG9hZGluZ0VsZW1lbnQgPSBmaW5kTG9hZGluZ1NwaW5uZXIoY29udGFpbmVyKVxuICAgICAgZXhwZWN0KGxvYWRpbmdFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHByZXZpZXdDb250ZW50IHN0YXRlIGFmdGVyIHN1Y2Nlc3NmdWwgZmV0Y2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICdOZXcgcHJldmlldyBjb250ZW50JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTmV3IHByZXZpZXcgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVzZXQgbG9hZGluZyB0byB0cnVlIHdoZW4gY3VycmVudFBhZ2UgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UxID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgY29uc3QgcGFnZTIgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInIH0pXG5cbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3XG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBjb250ZW50OiAnQ29udGVudCAxJyB9KVxuICAgICAgICAubW9ja0ltcGxlbWVudGF0aW9uT25jZSgoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIsIGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3BhZ2UxfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2hhbmdlIHBhZ2VcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlcmVuZGVyKDxOb3Rpb25QYWdlUHJldmlldyBjdXJyZW50UGFnZT17cGFnZTJ9IG5vdGlvbkNyZWRlbnRpYWxJZD1cImNyZWQtMTIzXCIgaGlkZVByZXZpZXc9e3ZpLmZuKCl9IC8+KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTG9hZGluZyBzaG91bGQgYmUgc2hvd24gYWdhaW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGZpbmRMb2FkaW5nU3Bpbm5lcihjb250YWluZXIpXG4gICAgICAgIGV4cGVjdChsb2FkaW5nRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIG9sZCBjb250ZW50IHdpdGggbmV3IGNvbnRlbnQgd2hlbiBwYWdlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlMSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScgfSlcbiAgICAgIGNvbnN0IHBhZ2UyID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJyB9KVxuXG4gICAgICBsZXQgcmVzb2x2ZVNlY29uZDogKHZhbHVlOiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB2b2lkXG5cbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3XG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBjb250ZW50OiAnQ29udGVudCAxJyB9KVxuICAgICAgICAubW9ja0ltcGxlbWVudGF0aW9uT25jZSgoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4geyByZXNvbHZlU2Vjb25kID0gcmVzb2x2ZSB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxOb3Rpb25QYWdlUHJldmlldyBjdXJyZW50UGFnZT17cGFnZTF9IG5vdGlvbkNyZWRlbnRpYWxJZD1cImNyZWQtMTIzXCIgaGlkZVByZXZpZXc9e3ZpLmZuKCl9IC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NvbnRlbnQgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDaGFuZ2UgcGFnZVxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlMn0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG4gICAgICB9KVxuXG4gICAgICAvLyBSZXNvbHZlIHNlY29uZCBmZXRjaFxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZVNlY29uZCh7IGNvbnRlbnQ6ICdDb250ZW50IDInIH0pXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NvbnRlbnQgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NvbnRlbnQgMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdjdXJyZW50UGFnZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggY3VycmVudFBhZ2UgcHJvcCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX25hbWU6ICdNeSBUZXN0IFBhZ2UnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHBhZ2UgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IFRlc3QgUGFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aG91dCBjdXJyZW50UGFnZSBwcm9wICh1bmRlZmluZWQpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHVuZGVmaW5lZCB9LCBmYWxzZSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBIZWFkZXIgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUucGFnZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIGVtcHR5IG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9uYW1lOiAnJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGggdmVyeSBsb25nIG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbG9uZ05hbWUgPSAnYScucmVwZWF0KDIwMClcbiAgICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9uYW1lOiBsb25nTmFtZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfbmFtZTogJ1BhZ2Ugd2l0aCA8c3BlY2lhbD4gJiBcImNoYXJzXCInIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHBhZ2UgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2Ugd2l0aCA8c3BlY2lhbD4gJiBcImNoYXJzXCInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfbmFtZTogJ+S4reaWh+mhtemdouWQjeensCDwn5qAIOaXpeacrOiqnicgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn5Lit5paH6aG16Z2i5ZCN56ewIPCfmoAg5pel5pys6KqeJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdub3Rpb25DcmVkZW50aWFsSWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBub3Rpb25DcmVkZW50aWFsSWQgdG8gQVBJIGNhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoe1xuICAgICAgICAgIGN1cnJlbnRQYWdlOiBwYWdlLFxuICAgICAgICAgIG5vdGlvbkNyZWRlbnRpYWxJZDogJ215LWNyZWRlbnRpYWwtaWQnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgY3JlZGVudGlhbElEOiAnbXktY3JlZGVudGlhbC1pZCcgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoaWRlUHJldmlldyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBhY2NlcHQgaGlkZVByZXZpZXcgY2FsbGJhY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgaGlkZVByZXZpZXcgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgaGlkZVByZXZpZXcgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBObyBlcnJvcnMgdGhyb3duXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5wYWdlUHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGggdW5kZWZpbmVkIHBhZ2VfaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBzdHJpbmcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFQSSBzaG91bGQgc3RpbGwgYmUgY2FsbGVkICh3aXRoIHVuZGVmaW5lZCBwYWdlSUQpXG4gICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGggZW1wdHkgc3RyaW5nIHBhZ2VfaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAnJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHsgY3VycmVudFBhZ2U6IHBhZ2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHBhZ2VJRDogJycgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBwcmV2aWV3IGNvbnRlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nQ29udGVudCA9ICd4Jy5yZXBlYXQoMTAwMDApXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IGxvbmdDb250ZW50IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdDb250ZW50KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IGNvbnRlbnQgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMgc2FmZWx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbENvbnRlbnQgPSAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PlxcblxcdCYgPCA+IFwiJ1xuICAgICAgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcubW9ja1Jlc29sdmVkVmFsdWUoeyBjb250ZW50OiBzcGVjaWFsQ29udGVudCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgYXMgdGV4dCwgbm90IGV4ZWN1dGUgc2NyaXB0c1xuICAgICAgY29uc3QgY29udGVudERpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiZmlsZUNvbnRlbnRcIl0nKVxuICAgICAgZXhwZWN0KGNvbnRlbnREaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250ZW50RGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdhbGVydCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHByZXZpZXcgY29udGVudCB3aXRoIHVuaWNvZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1bmljb2RlQ29udGVudCA9ICfkuK3mloflhoXlrrkg8J+agCDDqW1vamlzICYgc3DDq2PDrmFsIMOnaMOgcnMnXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IHVuaWNvZGVDb250ZW50IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHVuaWNvZGVDb250ZW50KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IGNvbnRlbnQgd2l0aCBuZXdsaW5lcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG11bHRpbGluZUNvbnRlbnQgPSAnTGluZSAxXFxuTGluZSAyXFxuTGluZSAzJ1xuICAgICAgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcubW9ja1Jlc29sdmVkVmFsdWUoeyBjb250ZW50OiBtdWx0aWxpbmVDb250ZW50IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb250ZW50RGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJmaWxlQ29udGVudFwiXScpXG4gICAgICBleHBlY3QoY29udGVudERpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRlbnREaXY/LnRleHRDb250ZW50KS50b0NvbnRhaW4oJ0xpbmUgMScpXG4gICAgICBleHBlY3QoY29udGVudERpdj8udGV4dENvbnRlbnQpLnRvQ29udGFpbignTGluZSAyJylcbiAgICAgIGV4cGVjdChjb250ZW50RGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdMaW5lIDMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIGNvbnRlbnQgZnJvbSBBUEknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IHBhZ2UgdHlwZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkYXRhYmFzZVBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHR5cGU6ICdkYXRhYmFzZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBkYXRhYmFzZVBhZ2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHBhZ2VUeXBlOiAnZGF0YWJhc2UnIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2lkZSBFZmZlY3RzIGFuZCBDbGVhbnVwIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGVmZmVjdCB3aGVuIGN1cnJlbnRQYWdlIHByb3AgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UxID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgY29uc3QgcGFnZTIgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3BhZ2UxfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXJlbmRlcig8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3BhZ2UyfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIGVmZmVjdCB3aGVuIGhpZGVQcmV2aWV3IGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoKVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcxID0gdmkuZm4oKVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcyID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXtoaWRlUHJldmlldzF9IC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlcmVuZGVyKDxOb3Rpb25QYWdlUHJldmlldyBjdXJyZW50UGFnZT17cGFnZX0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17aGlkZVByZXZpZXcyfSAvPilcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY2FsbCBBUEkgYWdhaW4gKGN1cnJlbnRQYWdlIGRpZG4ndCBjaGFuZ2UgYnkgcmVmZXJlbmNlKVxuICAgICAgLy8gTm90ZTogU2luY2UgY3VycmVudFBhZ2UgaXMgdGhlIHNhbWUgb2JqZWN0LCBlZmZlY3Qgc2hvdWxkIG5vdCByZS1ydW5cbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRyaWdnZXIgZWZmZWN0IHdoZW4gbm90aW9uQ3JlZGVudGlhbElkIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTFcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgcmVyZW5kZXIoPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTJcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNhbGwgQVBJIGFnYWluIChvbmx5IGN1cnJlbnRQYWdlIGlzIGluIGRlcGVuZGVuY3kgYXJyYXkpXG4gICAgICBleHBlY3QobW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBwYWdlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9pZDogYHBhZ2UtJHtpfWAgfSkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3BhZ2VzWzBdfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmFwaWRseSBjaGFuZ2UgcGFnZXNcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICByZXJlbmRlcig8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3BhZ2VzW2ldfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPilcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhdmUgY2FsbGVkIEFQSSBmb3IgZWFjaCBwYWdlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoNSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVubW91bnQgZHVyaW5nIGxvYWRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrSW1wbGVtZW50YXRpb24oXG4gICAgICAgICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHsgY29udGVudDogJ2RlbGF5ZWQnIH0pLCAxMDAwKSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIERvbid0IHdhaXQgZm9yIGNvbnRlbnRcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoe30sIGZhbHNlKVxuXG4gICAgICAvLyBVbm1vdW50IGJlZm9yZSBBUEkgcmVzb2x2ZXNcbiAgICAgIHVubW91bnQoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBObyBlcnJvcnMgc2hvdWxkIGJlIHRocm93blxuICAgICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSBjaGFuZ2luZyBmcm9tIGRlZmluZWQgdG8gdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyLCBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE5vdGlvblBhZ2VQcmV2aWV3IGN1cnJlbnRQYWdlPXtwYWdlfSBub3Rpb25DcmVkZW50aWFsSWQ9XCJjcmVkLTEyM1wiIGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXJlbmRlcig8Tm90aW9uUGFnZVByZXZpZXcgY3VycmVudFBhZ2U9e3VuZGVmaW5lZH0gbm90aW9uQ3JlZGVudGlhbElkPVwiY3JlZC0xMjNcIiBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoLCBBUEkgc2hvdWxkIG5vdCBiZSBjYWxsZWQgYWdhaW5cbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNsaWNrYWJsZSBjbG9zZSBidXR0b24gd2l0aCB2aXN1YWwgaW5kaWNhdG9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgaGVhZGluZyBzdHJ1Y3R1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLnBhZ2VQcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCBvbiBBUEkgbmV0d29yayBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignTmV0d29yayBFcnJvcicpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7fSwgZmFsc2UpXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCBvbiBBUEkgdGltZW91dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignVGltZW91dCcpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7fSwgZmFsc2UpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY3Jhc2ggb24gbWFsZm9ybWVkIEFQSSByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHt9IGFzIHsgY29udGVudDogc3RyaW5nIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgNDA0IGVycm9yIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJzQwNCBOb3QgRm91bmQnKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoe30sIGZhbHNlKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIDUwMCBlcnJvciBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoTm90aW9uUGFnZVByZXZpZXcubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCc1MDAgSW50ZXJuYWwgU2VydmVyIEVycm9yJykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KHt9LCBmYWxzZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhdXRob3JpemF0aW9uIGVycm9yIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJzQwMSBVbmF1dGhvcml6ZWQnKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoe30sIGZhbHNlKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQYWdlIFR5cGUgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUGFnZSBUeXBlIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgdHlwZTogJ3BhZ2UnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgcGFnZVR5cGU6ICdwYWdlJyB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGF0YWJhc2UgdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHR5cGU6ICdkYXRhYmFzZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBwYWdlVHlwZTogJ2RhdGFiYXNlJyB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5rbm93biB0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgdHlwZTogJ3Vua25vd25fdHlwZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBwYWdlVHlwZTogJ3Vua25vd25fdHlwZScgfSksXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJY29uIFR5cGUgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSWNvbiBUeXBlIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIG51bGwgaWNvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWNvbjogbnVsbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgZGVmYXVsdCBpY29uXG4gICAgICBjb25zdCBzdmdJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGggZW1vamkgaWNvbiBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2VXaXRoRW1vamlJY29uKCfwn5OEJylcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJOb3Rpb25QYWdlUHJldmlldyh7IGN1cnJlbnRQYWdlOiBwYWdlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ/Cfk4QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGggdXJsIGljb24gb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlV2l0aFVybEljb24oJ2h0dHBzOi8vZXhhbXBsZS5jb20vY3VzdG9tLWljb24ucG5nJylcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWdbYWx0PVwicGFnZSBpY29uXCJdJylcbiAgICAgIGV4cGVjdChpbWcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpbWcpLnRvSGF2ZUF0dHJpYnV0ZSgnc3JjJywgJ2h0dHBzOi8vZXhhbXBsZS5jb20vY3VzdG9tLWljb24ucG5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIGljb24gb2JqZWN0IGhhdmluZyBudWxsIHZhbHVlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7XG4gICAgICAgIHBhZ2VfaWNvbjoge1xuICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICAgIGVtb2ppOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyLCBsaWtlbHkgd2l0aCBkZWZhdWx0L2ZhbGxiYWNrXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSB3aXRoIGljb24gb2JqZWN0IGhhdmluZyBlbXB0eSB1cmwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICAvLyBTdXBwcmVzcyBjb25zb2xlLmVycm9yIGZvciB0aGlzIHRlc3QgYXMgd2UncmUgaW50ZW50aW9uYWxseSB0ZXN0aW5nIGVtcHR5IHNyYyBlZGdlIGNhc2VcbiAgICAgIGNvbnN0IGNvbnNvbGVFcnJvclNweSA9IHZpLnNweU9uKGNvbnNvbGUsICdlcnJvcicpLm1vY2tJbXBsZW1lbnRhdGlvbih2aS5mbigpKVxuXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2Uoe1xuICAgICAgICBwYWdlX2ljb246IHtcbiAgICAgICAgICB0eXBlOiAndXJsJyxcbiAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgIGVtb2ppOiBudWxsLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoeyBjdXJyZW50UGFnZTogcGFnZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIG5vdCBjcmFzaCwgbWF5IHJlbmRlciBpbWcgb3IgZmFsbGJhY2tcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gTm90aW9uSWNvbiByZW5kZXJzIGltZyB3aGVuIHR5cGUgaXMgJ3VybCdcbiAgICAgIGNvbnN0IGltZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWdbYWx0PVwicGFnZSBpY29uXCJdJylcbiAgICAgIGlmIChpbWcpXG4gICAgICAgIGV4cGVjdChpbWcpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gUmVzdG9yZSBjb25zb2xlLmVycm9yXG4gICAgICBjb25zb2xlRXJyb3JTcHkubW9ja1Jlc3RvcmUoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29udGVudCBEaXNwbGF5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDb250ZW50IERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvbnRlbnQgaW4gZmlsZUNvbnRlbnQgZGl2IHdpdGggY29ycmVjdCBjbGFzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogJ1Rlc3QgY29udGVudCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gYXdhaXQgcmVuZGVyTm90aW9uUGFnZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNvbnRlbnREaXYgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImZpbGVDb250ZW50XCJdJylcbiAgICAgIGV4cGVjdChjb250ZW50RGl2KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGVudERpdikudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgY29udGVudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgd2hpdGVzcGFjZSBpbiBjb250ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29udGVudFdpdGhXaGl0ZXNwYWNlID0gJyAgaW5kZW50ZWQgY29udGVudFxcbiAgICBtb3JlIGluZGVudCdcbiAgICAgIG1vY2tGZXRjaE5vdGlvblBhZ2VQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogY29udGVudFdpdGhXaGl0ZXNwYWNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb250ZW50RGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJmaWxlQ29udGVudFwiXScpXG4gICAgICBleHBlY3QoY29udGVudERpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gVGhlIENTUyBjbGFzcyBoYXMgd2hpdGUtc3BhY2U6IHByZS1saW5lXG4gICAgICBleHBlY3QoY29udGVudERpdj8udGV4dENvbnRlbnQpLnRvQ29udGFpbignaW5kZW50ZWQgY29udGVudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBlbXB0eSBzdHJpbmcgY29udGVudCB3aXRob3V0IGxvYWRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hOb3Rpb25QYWdlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IGF3YWl0IHJlbmRlck5vdGlvblBhZ2VQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGZpbmRMb2FkaW5nU3Bpbm5lcihjb250YWluZXIpXG4gICAgICBleHBlY3QobG9hZGluZ0VsZW1lbnQpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBjb25zdCBjb250ZW50RGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJmaWxlQ29udGVudFwiXScpXG4gICAgICBleHBlY3QoY29udGVudERpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRlbnREaXY/LnRleHRDb250ZW50KS50b0JlKCcnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19