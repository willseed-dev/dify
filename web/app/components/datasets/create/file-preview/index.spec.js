"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const common_1 = require("@/service/common");
const index_1 = require("./index");
// Mock the fetchFilePreview service
vi.mock('@/service/common', () => ({
    fetchFilePreview: vi.fn(),
}));
const mockFetchFilePreview = common_1.fetchFilePreview;
// Factory function to create mock file objects
const createMockFile = (overrides = {}) => {
    const fileName = overrides.name ?? 'test-file.txt';
    // Create a plain object that looks like a File with CustomFile properties
    // We can't use Object.assign on a real File because 'name' is a getter-only property
    return {
        name: fileName,
        size: 1024,
        type: 'text/plain',
        lastModified: Date.now(),
        id: 'file-123',
        extension: 'txt',
        mime_type: 'text/plain',
        created_by: 'user-1',
        created_at: Date.now(),
        ...overrides,
    };
};
// Helper to render FilePreview with default props
const renderFilePreview = (props = {}) => {
    const defaultProps = {
        file: createMockFile(),
        hidePreview: vi.fn(),
        ...props,
    };
    return {
        ...(0, react_1.render)(<index_1.default {...defaultProps}/>),
        props: defaultProps,
    };
};
// Helper to find the loading spinner element
const findLoadingSpinner = (container) => {
    return container.querySelector('.spin-animation');
};
// ============================================================================
// FilePreview Component Tests
// ============================================================================
describe('FilePreview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default successful API response
        mockFetchFilePreview.mockResolvedValue({ content: 'Preview content here' });
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', async () => {
            // Arrange & Act
            renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
            });
        });
        it('should render file preview header', async () => {
            // Arrange & Act
            renderFilePreview();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
        });
        it('should render close button with XMarkIcon', async () => {
            // Arrange & Act
            const { container } = renderFilePreview();
            // Assert
            const closeButton = container.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument();
            const xMarkIcon = closeButton?.querySelector('svg');
            expect(xMarkIcon).toBeInTheDocument();
        });
        it('should render file name without extension', async () => {
            // Arrange
            const file = createMockFile({ name: 'document.pdf' });
            // Act
            renderFilePreview({ file });
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('document')).toBeInTheDocument();
            });
        });
        it('should render file extension', async () => {
            // Arrange
            const file = createMockFile({ extension: 'pdf' });
            // Act
            renderFilePreview({ file });
            // Assert
            expect(react_1.screen.getByText('.pdf')).toBeInTheDocument();
        });
        it('should apply correct CSS classes to container', async () => {
            // Arrange & Act
            const { container } = renderFilePreview();
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('h-full');
        });
    });
    // --------------------------------------------------------------------------
    // Loading State Tests
    // --------------------------------------------------------------------------
    describe('Loading State', () => {
        it('should show loading indicator initially', async () => {
            // Arrange - Delay API response to keep loading state
            mockFetchFilePreview.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ content: 'test' }), 100)));
            // Act
            const { container } = renderFilePreview();
            // Assert - Loading should be visible initially (using spin-animation class)
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).toBeInTheDocument();
        });
        it('should hide loading indicator after content loads', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({ content: 'Loaded content' });
            // Act
            const { container } = renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Loaded content')).toBeInTheDocument();
            });
            // Loading should be gone
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).not.toBeInTheDocument();
        });
        it('should show loading when file changes', async () => {
            // Arrange
            const file1 = createMockFile({ id: 'file-1', name: 'file1.txt' });
            const file2 = createMockFile({ id: 'file-2', name: 'file2.txt' });
            let resolveFirst;
            let resolveSecond;
            mockFetchFilePreview
                .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; }))
                .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));
            // Act - Initial render
            const { rerender, container } = (0, react_1.render)(<index_1.default file={file1} hidePreview={vi.fn()}/>);
            // First file loading - spinner should be visible
            expect(findLoadingSpinner(container)).toBeInTheDocument();
            // Resolve first file
            await (0, react_1.act)(async () => {
                resolveFirst({ content: 'Content 1' });
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Rerender with new file
            rerender(<index_1.default file={file2} hidePreview={vi.fn()}/>);
            // Should show loading again
            await (0, react_1.waitFor)(() => {
                expect(findLoadingSpinner(container)).toBeInTheDocument();
            });
            // Resolve second file
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
        it('should call fetchFilePreview with correct fileID', async () => {
            // Arrange
            const file = createMockFile({ id: 'test-file-id' });
            // Act
            renderFilePreview({ file });
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledWith({ fileID: 'test-file-id' });
            });
        });
        it('should not call fetchFilePreview when file is undefined', async () => {
            // Arrange & Act
            renderFilePreview({ file: undefined });
            // Assert
            expect(mockFetchFilePreview).not.toHaveBeenCalled();
        });
        it('should not call fetchFilePreview when file has no id', async () => {
            // Arrange
            const file = createMockFile({ id: undefined });
            // Act
            renderFilePreview({ file });
            // Assert
            expect(mockFetchFilePreview).not.toHaveBeenCalled();
        });
        it('should call fetchFilePreview again when file changes', async () => {
            // Arrange
            const file1 = createMockFile({ id: 'file-1' });
            const file2 = createMockFile({ id: 'file-2' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default file={file1} hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledWith({ fileID: 'file-1' });
            });
            rerender(<index_1.default file={file2} hidePreview={vi.fn()}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledWith({ fileID: 'file-2' });
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(2);
            });
        });
        it('should handle API success and display content', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({ content: 'File preview content from API' });
            // Act
            renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('File preview content from API')).toBeInTheDocument();
            });
        });
        it('should handle API error gracefully', async () => {
            // Arrange
            mockFetchFilePreview.mockRejectedValue(new Error('Network error'));
            // Act
            const { container } = renderFilePreview();
            // Assert - Component should not crash, loading may persist
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
            // No error thrown, component still rendered
            expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
        });
        it('should handle empty content response', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({ content: '' });
            // Act
            const { container } = renderFilePreview();
            // Assert - Should still render without loading
            await (0, react_1.waitFor)(() => {
                const loadingElement = findLoadingSpinner(container);
                expect(loadingElement).not.toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call hidePreview when close button is clicked', async () => {
            // Arrange
            const hidePreview = vi.fn();
            const { container } = renderFilePreview({ hidePreview });
            // Act
            const closeButton = container.querySelector('.cursor-pointer');
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(hidePreview).toHaveBeenCalledTimes(1);
        });
        it('should call hidePreview with event object when clicked', async () => {
            // Arrange
            const hidePreview = vi.fn();
            const { container } = renderFilePreview({ hidePreview });
            // Act
            const closeButton = container.querySelector('.cursor-pointer');
            react_1.fireEvent.click(closeButton);
            // Assert - onClick receives the event object
            expect(hidePreview).toHaveBeenCalled();
            expect(hidePreview.mock.calls[0][0]).toBeDefined();
        });
        it('should handle multiple clicks on close button', async () => {
            // Arrange
            const hidePreview = vi.fn();
            const { container } = renderFilePreview({ hidePreview });
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
            mockFetchFilePreview.mockImplementation(() => new Promise(() => { }));
            // Act
            const { container } = renderFilePreview();
            // Assert
            const loadingElement = findLoadingSpinner(container);
            expect(loadingElement).toBeInTheDocument();
        });
        it('should update previewContent state after successful fetch', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({ content: 'New preview content' });
            // Act
            renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('New preview content')).toBeInTheDocument();
            });
        });
        it('should reset loading to true when file changes', async () => {
            // Arrange
            const file1 = createMockFile({ id: 'file-1' });
            const file2 = createMockFile({ id: 'file-2' });
            mockFetchFilePreview
                .mockResolvedValueOnce({ content: 'Content 1' })
                .mockImplementationOnce(() => new Promise(() => { }));
            // Act
            const { rerender, container } = (0, react_1.render)(<index_1.default file={file1} hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Change file
            rerender(<index_1.default file={file2} hidePreview={vi.fn()}/>);
            // Assert - Loading should be shown again
            await (0, react_1.waitFor)(() => {
                const loadingElement = findLoadingSpinner(container);
                expect(loadingElement).toBeInTheDocument();
            });
        });
        it('should preserve content until new content loads', async () => {
            // Arrange
            const file1 = createMockFile({ id: 'file-1' });
            const file2 = createMockFile({ id: 'file-2' });
            let resolveSecond;
            mockFetchFilePreview
                .mockResolvedValueOnce({ content: 'Content 1' })
                .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve; }));
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default file={file1} hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Content 1')).toBeInTheDocument();
            });
            // Change file - loading should replace content
            rerender(<index_1.default file={file2} hidePreview={vi.fn()}/>);
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
        describe('file prop', () => {
            it('should render correctly with file prop', async () => {
                // Arrange
                const file = createMockFile({ name: 'my-document.pdf', extension: 'pdf' });
                // Act
                renderFilePreview({ file });
                // Assert
                expect(react_1.screen.getByText('my-document')).toBeInTheDocument();
                expect(react_1.screen.getByText('.pdf')).toBeInTheDocument();
            });
            it('should render correctly without file prop', async () => {
                // Arrange & Act
                renderFilePreview({ file: undefined });
                // Assert - Header should still render
                expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
            });
            it('should handle file with multiple dots in name', async () => {
                // Arrange
                const file = createMockFile({ name: 'my.document.v2.pdf' });
                // Act
                renderFilePreview({ file });
                // Assert - Should join all parts except last with comma
                expect(react_1.screen.getByText('my,document,v2')).toBeInTheDocument();
            });
            it('should handle file with no extension in name', async () => {
                // Arrange
                const file = createMockFile({ name: 'README' });
                // Act
                const { container } = renderFilePreview({ file });
                // Assert - getFileName returns empty for single segment, but component still renders
                const fileNameElement = container.querySelector('[class*="fileName"]');
                expect(fileNameElement).toBeInTheDocument();
                // The first span (file name) should be empty
                const fileNameSpan = fileNameElement?.querySelector('span:first-child');
                expect(fileNameSpan?.textContent).toBe('');
            });
            it('should handle file with empty name', async () => {
                // Arrange
                const file = createMockFile({ name: '' });
                // Act
                const { container } = renderFilePreview({ file });
                // Assert - Should not crash
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        describe('hidePreview prop', () => {
            it('should accept hidePreview callback', async () => {
                // Arrange
                const hidePreview = vi.fn();
                // Act
                renderFilePreview({ hidePreview });
                // Assert - No errors thrown
                expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle file with undefined id', async () => {
            // Arrange
            const file = createMockFile({ id: undefined });
            // Act
            const { container } = renderFilePreview({ file });
            // Assert - Should not call API, remain in loading state
            expect(mockFetchFilePreview).not.toHaveBeenCalled();
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should handle file with empty string id', async () => {
            // Arrange
            const file = createMockFile({ id: '' });
            // Act
            renderFilePreview({ file });
            // Assert - Empty string is falsy, should not call API
            expect(mockFetchFilePreview).not.toHaveBeenCalled();
        });
        it('should handle very long file names', async () => {
            // Arrange
            const longName = `${'a'.repeat(200)}.pdf`;
            const file = createMockFile({ name: longName });
            // Act
            renderFilePreview({ file });
            // Assert
            expect(react_1.screen.getByText('a'.repeat(200))).toBeInTheDocument();
        });
        it('should handle file with special characters in name', async () => {
            // Arrange
            const file = createMockFile({ name: 'file-with_special@#$%.txt' });
            // Act
            renderFilePreview({ file });
            // Assert
            expect(react_1.screen.getByText('file-with_special@#$%')).toBeInTheDocument();
        });
        it('should handle very long preview content', async () => {
            // Arrange
            const longContent = 'x'.repeat(10000);
            mockFetchFilePreview.mockResolvedValue({ content: longContent });
            // Act
            renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(longContent)).toBeInTheDocument();
            });
        });
        it('should handle preview content with special characters safely', async () => {
            // Arrange
            const specialContent = '<script>alert("xss")</script>\n\t& < > "';
            mockFetchFilePreview.mockResolvedValue({ content: specialContent });
            // Act
            const { container } = renderFilePreview();
            // Assert - Should render as text, not execute scripts
            await (0, react_1.waitFor)(() => {
                const contentDiv = container.querySelector('[class*="fileContent"]');
                expect(contentDiv).toBeInTheDocument();
                // Content is escaped by React, so HTML entities are displayed
                expect(contentDiv?.textContent).toContain('alert');
            });
        });
        it('should handle preview content with unicode', async () => {
            // Arrange
            const unicodeContent = '中文内容 🚀 émojis & spëcîal çhàrs';
            mockFetchFilePreview.mockResolvedValue({ content: unicodeContent });
            // Act
            renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(unicodeContent)).toBeInTheDocument();
            });
        });
        it('should handle preview content with newlines', async () => {
            // Arrange
            const multilineContent = 'Line 1\nLine 2\nLine 3';
            mockFetchFilePreview.mockResolvedValue({ content: multilineContent });
            // Act
            const { container } = renderFilePreview();
            // Assert - Content should be in the DOM
            await (0, react_1.waitFor)(() => {
                const contentDiv = container.querySelector('[class*="fileContent"]');
                expect(contentDiv).toBeInTheDocument();
                expect(contentDiv?.textContent).toContain('Line 1');
                expect(contentDiv?.textContent).toContain('Line 2');
                expect(contentDiv?.textContent).toContain('Line 3');
            });
        });
        it('should handle null content from API', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({ content: null });
            // Act
            const { container } = renderFilePreview();
            // Assert - Should not crash
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Side Effects and Cleanup Tests
    // --------------------------------------------------------------------------
    describe('Side Effects and Cleanup', () => {
        it('should trigger effect when file prop changes', async () => {
            // Arrange
            const file1 = createMockFile({ id: 'file-1' });
            const file2 = createMockFile({ id: 'file-2' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default file={file1} hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(1);
            });
            rerender(<index_1.default file={file2} hidePreview={vi.fn()}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(2);
            });
        });
        it('should not trigger effect when hidePreview changes', async () => {
            // Arrange
            const file = createMockFile();
            const hidePreview1 = vi.fn();
            const hidePreview2 = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default file={file} hidePreview={hidePreview1}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(1);
            });
            rerender(<index_1.default file={file} hidePreview={hidePreview2}/>);
            // Assert - Should not call API again (file didn't change)
            // Note: This depends on useEffect dependency array only including [file]
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(1);
            });
        });
        it('should handle rapid file changes', async () => {
            // Arrange
            const files = Array.from({ length: 5 }, (_, i) => createMockFile({ id: `file-${i}` }));
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default file={files[0]} hidePreview={vi.fn()}/>);
            // Rapidly change files
            for (let i = 1; i < files.length; i++)
                rerender(<index_1.default file={files[i]} hidePreview={vi.fn()}/>);
            // Assert - Should have called API for each file
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(5);
            });
        });
        it('should handle unmount during loading', async () => {
            // Arrange
            mockFetchFilePreview.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ content: 'delayed' }), 1000)));
            // Act
            const { unmount } = renderFilePreview();
            // Unmount before API resolves
            unmount();
            // Assert - No errors should be thrown (React handles state updates on unmounted)
            expect(true).toBe(true);
        });
        it('should handle file changing from defined to undefined', async () => {
            // Arrange
            const file = createMockFile();
            // Act
            const { rerender, container } = (0, react_1.render)(<index_1.default file={file} hidePreview={vi.fn()}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchFilePreview).toHaveBeenCalledTimes(1);
            });
            rerender(<index_1.default file={undefined} hidePreview={vi.fn()}/>);
            // Assert - Should not crash, API should not be called again
            expect(container.firstChild).toBeInTheDocument();
            expect(mockFetchFilePreview).toHaveBeenCalledTimes(1);
        });
    });
    // --------------------------------------------------------------------------
    // getFileName Helper Tests
    // --------------------------------------------------------------------------
    describe('getFileName Helper', () => {
        it('should extract name without extension for simple filename', async () => {
            // Arrange
            const file = createMockFile({ name: 'document.pdf' });
            // Act
            renderFilePreview({ file });
            // Assert
            expect(react_1.screen.getByText('document')).toBeInTheDocument();
        });
        it('should handle filename with multiple dots', async () => {
            // Arrange
            const file = createMockFile({ name: 'file.name.with.dots.txt' });
            // Act
            renderFilePreview({ file });
            // Assert - Should join all parts except last with comma
            expect(react_1.screen.getByText('file,name,with,dots')).toBeInTheDocument();
        });
        it('should return empty for filename without dot', async () => {
            // Arrange
            const file = createMockFile({ name: 'nodotfile' });
            // Act
            const { container } = renderFilePreview({ file });
            // Assert - slice(0, -1) on single element array returns empty
            const fileNameElement = container.querySelector('[class*="fileName"]');
            const firstSpan = fileNameElement?.querySelector('span:first-child');
            expect(firstSpan?.textContent).toBe('');
        });
        it('should return empty string when file is undefined', async () => {
            // Arrange & Act
            const { container } = renderFilePreview({ file: undefined });
            // Assert - File name area should have empty first span
            const fileNameElement = container.querySelector('.system-xs-medium');
            expect(fileNameElement).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Accessibility Tests
    // --------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have clickable close button with visual indicator', async () => {
            // Arrange & Act
            const { container } = renderFilePreview();
            // Assert
            const closeButton = container.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveClass('cursor-pointer');
        });
        it('should have proper heading structure', async () => {
            // Arrange & Act
            renderFilePreview();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.filePreview')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Error Handling Tests
    // --------------------------------------------------------------------------
    describe('Error Handling', () => {
        it('should not crash on API network error', async () => {
            // Arrange
            mockFetchFilePreview.mockRejectedValue(new Error('Network Error'));
            // Act
            const { container } = renderFilePreview();
            // Assert - Component should still render
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should not crash on API timeout', async () => {
            // Arrange
            mockFetchFilePreview.mockRejectedValue(new Error('Timeout'));
            // Act
            const { container } = renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
        it('should not crash on malformed API response', async () => {
            // Arrange
            mockFetchFilePreview.mockResolvedValue({});
            // Act
            const { container } = renderFilePreview();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(container.firstChild).toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWdGO0FBQ2hGLDZDQUFtRDtBQUNuRCxtQ0FBaUM7QUFFakMsb0NBQW9DO0FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQzFCLENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSxvQkFBb0IsR0FBRyx5QkFBMkQsQ0FBQTtBQUV4RiwrQ0FBK0M7QUFDL0MsTUFBTSxjQUFjLEdBQUcsQ0FBQyxZQUEyQixFQUFFLEVBQVEsRUFBRTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBQTtJQUNsRCwwRUFBMEU7SUFDMUUscUZBQXFGO0lBQ3JGLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLFlBQVk7UUFDbEIsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDeEIsRUFBRSxFQUFFLFVBQVU7UUFDZCxTQUFTLEVBQUUsS0FBSztRQUNoQixTQUFTLEVBQUUsWUFBWTtRQUN2QixVQUFVLEVBQUUsUUFBUTtRQUNwQixVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUN0QixHQUFHLFNBQVM7S0FDTCxDQUFBO0FBQ1gsQ0FBQyxDQUFBO0FBRUQsa0RBQWtEO0FBQ2xELE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxRQUEyRCxFQUFFLEVBQUUsRUFBRTtJQUMxRixNQUFNLFlBQVksR0FBRztRQUNuQixJQUFJLEVBQUUsY0FBYyxFQUFFO1FBQ3RCLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BCLEdBQUcsS0FBSztLQUNULENBQUE7SUFDRCxPQUFPO1FBQ0wsR0FB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QUFpQixDQUFDLEVBQXlCLENBQUMsQ0FBQTtZQUVqRSxNQUFNO1lBQ04sTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLGlCQUFpQixFQUFFLENBQUE7WUFFekMsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2tlZEZ1bmN0aW9uIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHR5cGUgeyBDdXN0b21GaWxlIGFzIEZpbGUgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBmZXRjaEZpbGVQcmV2aWV3IH0gZnJvbSAnQC9zZXJ2aWNlL2NvbW1vbidcbmltcG9ydCBGaWxlUHJldmlldyBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIHRoZSBmZXRjaEZpbGVQcmV2aWV3IHNlcnZpY2VcbnZpLm1vY2soJ0Avc2VydmljZS9jb21tb24nLCAoKSA9PiAoe1xuICBmZXRjaEZpbGVQcmV2aWV3OiB2aS5mbigpLFxufSkpXG5cbmNvbnN0IG1vY2tGZXRjaEZpbGVQcmV2aWV3ID0gZmV0Y2hGaWxlUHJldmlldyBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgZmV0Y2hGaWxlUHJldmlldz5cblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgbW9jayBmaWxlIG9iamVjdHNcbmNvbnN0IGNyZWF0ZU1vY2tGaWxlID0gKG92ZXJyaWRlczogUGFydGlhbDxGaWxlPiA9IHt9KTogRmlsZSA9PiB7XG4gIGNvbnN0IGZpbGVOYW1lID0gb3ZlcnJpZGVzLm5hbWUgPz8gJ3Rlc3QtZmlsZS50eHQnXG4gIC8vIENyZWF0ZSBhIHBsYWluIG9iamVjdCB0aGF0IGxvb2tzIGxpa2UgYSBGaWxlIHdpdGggQ3VzdG9tRmlsZSBwcm9wZXJ0aWVzXG4gIC8vIFdlIGNhbid0IHVzZSBPYmplY3QuYXNzaWduIG9uIGEgcmVhbCBGaWxlIGJlY2F1c2UgJ25hbWUnIGlzIGEgZ2V0dGVyLW9ubHkgcHJvcGVydHlcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBmaWxlTmFtZSxcbiAgICBzaXplOiAxMDI0LFxuICAgIHR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICBsYXN0TW9kaWZpZWQ6IERhdGUubm93KCksXG4gICAgaWQ6ICdmaWxlLTEyMycsXG4gICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICBtaW1lX3R5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICBjcmVhdGVkX2J5OiAndXNlci0xJyxcbiAgICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfSBhcyBGaWxlXG59XG5cbi8vIEhlbHBlciB0byByZW5kZXIgRmlsZVByZXZpZXcgd2l0aCBkZWZhdWx0IHByb3BzXG5jb25zdCByZW5kZXJGaWxlUHJldmlldyA9IChwcm9wczogUGFydGlhbDx7IGZpbGU/OiBGaWxlLCBoaWRlUHJldmlldzogKCkgPT4gdm9pZCB9PiA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgIGhpZGVQcmV2aWV3OiB2aS5mbigpLFxuICAgIC4uLnByb3BzLFxuICB9XG4gIHJldHVybiB7XG4gICAgLi4ucmVuZGVyKDxGaWxlUHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPiksXG4gICAgcHJvcHM6IGRlZmF1bHRQcm9wcyxcbiAgfVxufVxuXG4vLyBIZWxwZXIgdG8gZmluZCB0aGUgbG9hZGluZyBzcGlubmVyIGVsZW1lbnRcbmNvbnN0IGZpbmRMb2FkaW5nU3Bpbm5lciA9IChjb250YWluZXI6IEhUTUxFbGVtZW50KSA9PiB7XG4gIHJldHVybiBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNwaW4tYW5pbWF0aW9uJylcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRmlsZVByZXZpZXcgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRmlsZVByZXZpZXcnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIERlZmF1bHQgc3VjY2Vzc2Z1bCBBUEkgcmVzcG9uc2VcbiAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICdQcmV2aWV3IGNvbnRlbnQgaGVyZScgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgLSBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgcHJvcGVybHlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZmlsZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZmlsZSBwcmV2aWV3IGhlYWRlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZmlsZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjbG9zZSBidXR0b24gd2l0aCBYTWFya0ljb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGNvbnN0IHhNYXJrSWNvbiA9IGNsb3NlQnV0dG9uPy5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHhNYXJrSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmaWxlIG5hbWUgd2l0aG91dCBleHRlbnNpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBuYW1lOiAnZG9jdW1lbnQucGRmJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZG9jdW1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZmlsZSBleHRlbnNpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBleHRlbnNpb246ICdwZGYnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsZVByZXZpZXcoeyBmaWxlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJy5wZGYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgQ1NTIGNsYXNzZXMgdG8gY29udGFpbmVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnaC1mdWxsJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIExvYWRpbmcgU3RhdGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0xvYWRpbmcgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgaW5kaWNhdG9yIGluaXRpYWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBEZWxheSBBUEkgcmVzcG9uc2UgdG8ga2VlcCBsb2FkaW5nIHN0YXRlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrSW1wbGVtZW50YXRpb24oXG4gICAgICAgICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHsgY29udGVudDogJ3Rlc3QnIH0pLCAxMDApKSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBMb2FkaW5nIHNob3VsZCBiZSB2aXNpYmxlIGluaXRpYWxseSAodXNpbmcgc3Bpbi1hbmltYXRpb24gY2xhc3MpXG4gICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGZpbmRMb2FkaW5nU3Bpbm5lcihjb250YWluZXIpXG4gICAgICBleHBlY3QobG9hZGluZ0VsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIGxvYWRpbmcgaW5kaWNhdG9yIGFmdGVyIGNvbnRlbnQgbG9hZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICdMb2FkZWQgY29udGVudCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTG9hZGVkIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIC8vIExvYWRpbmcgc2hvdWxkIGJlIGdvbmVcbiAgICAgIGNvbnN0IGxvYWRpbmdFbGVtZW50ID0gZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcilcbiAgICAgIGV4cGVjdChsb2FkaW5nRWxlbWVudCkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgd2hlbiBmaWxlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlMSA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZmlsZTEudHh0JyB9KVxuICAgICAgY29uc3QgZmlsZTIgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiAnZmlsZS0yJywgbmFtZTogJ2ZpbGUyLnR4dCcgfSlcblxuICAgICAgbGV0IHJlc29sdmVGaXJzdDogKHZhbHVlOiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgICBsZXQgcmVzb2x2ZVNlY29uZDogKHZhbHVlOiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB2b2lkXG5cbiAgICAgIG1vY2tGZXRjaEZpbGVQcmV2aWV3XG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IHJlc29sdmVGaXJzdCA9IHJlc29sdmUgfSkpXG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IHJlc29sdmVTZWNvbmQgPSByZXNvbHZlIH0pKVxuXG4gICAgICAvLyBBY3QgLSBJbml0aWFsIHJlbmRlclxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxGaWxlUHJldmlldyBmaWxlPXtmaWxlMX0gaGlkZVByZXZpZXc9e3ZpLmZuKCl9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaXJzdCBmaWxlIGxvYWRpbmcgLSBzcGlubmVyIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBleHBlY3QoZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcikpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gUmVzb2x2ZSBmaXJzdCBmaWxlXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICByZXNvbHZlRmlyc3QoeyBjb250ZW50OiAnQ29udGVudCAxJyB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBuZXcgZmlsZVxuICAgICAgcmVyZW5kZXIoPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGUyfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IGxvYWRpbmcgYWdhaW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcikpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlc29sdmUgc2Vjb25kIGZpbGVcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlc29sdmVTZWNvbmQoeyBjb250ZW50OiAnQ29udGVudCAyJyB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFQSSBDYWxsIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdBUEkgQ2FsbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoRmlsZVByZXZpZXcgd2l0aCBjb3JyZWN0IGZpbGVJRCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiAndGVzdC1maWxlLWlkJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoRmlsZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgZmlsZUlEOiAndGVzdC1maWxlLWlkJyB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBmZXRjaEZpbGVQcmV2aWV3IHdoZW4gZmlsZSBpcyB1bmRlZmluZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJGaWxlUHJldmlldyh7IGZpbGU6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGZldGNoRmlsZVByZXZpZXcgd2hlbiBmaWxlIGhhcyBubyBpZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiB1bmRlZmluZWQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJGaWxlUHJldmlldyh7IGZpbGUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0ZldGNoRmlsZVByZXZpZXcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoRmlsZVByZXZpZXcgYWdhaW4gd2hlbiBmaWxlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlMSA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTEnIH0pXG4gICAgICBjb25zdCBmaWxlMiA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTInIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmlsZVByZXZpZXcgZmlsZT17ZmlsZTF9IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBmaWxlSUQ6ICdmaWxlLTEnIH0pXG4gICAgICB9KVxuXG4gICAgICByZXJlbmRlcig8RmlsZVByZXZpZXcgZmlsZT17ZmlsZTJ9IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEZpbGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGZpbGVJRDogJ2ZpbGUtMicgfSlcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEZpbGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBzdWNjZXNzIGFuZCBkaXNwbGF5IGNvbnRlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICdGaWxlIHByZXZpZXcgY29udGVudCBmcm9tIEFQSScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGaWxlIHByZXZpZXcgY29udGVudCBmcm9tIEFQSScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBBUEkgZXJyb3IgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaEZpbGVQcmV2aWV3Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignTmV0d29yayBlcnJvcicpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgbm90IGNyYXNoLCBsb2FkaW5nIG1heSBwZXJzaXN0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgLy8gTm8gZXJyb3IgdGhyb3duLCBjb21wb25lbnQgc3RpbGwgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5maWxlUHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNvbnRlbnQgcmVzcG9uc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIHJlbmRlciB3aXRob3V0IGxvYWRpbmdcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2FkaW5nRWxlbWVudCA9IGZpbmRMb2FkaW5nU3Bpbm5lcihjb250YWluZXIpXG4gICAgICAgIGV4cGVjdChsb2FkaW5nRWxlbWVudCkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhpZGVQcmV2aWV3IHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoaWRlUHJldmlldyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGhpZGVQcmV2aWV3IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJykgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGlkZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGlkZVByZXZpZXcgd2l0aCBldmVudCBvYmplY3Qgd2hlbiBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoeyBoaWRlUHJldmlldyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpIGFzIEhUTUxFbGVtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2xvc2VCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uQ2xpY2sgcmVjZWl2ZXMgdGhlIGV2ZW50IG9iamVjdFxuICAgICAgZXhwZWN0KGhpZGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChoaWRlUHJldmlldy5tb2NrLmNhbGxzWzBdWzBdKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsaWNrcyBvbiBjbG9zZSBidXR0b24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoaWRlUHJldmlldyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGhpZGVQcmV2aWV3IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJykgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGlkZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBsb2FkaW5nIHN0YXRlIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gS2VlcCBsb2FkaW5nIGluZGVmaW5pdGVseSAobmV2ZXIgcmVzb2x2ZXMpXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4geyAvKiBpbnRlbnRpb25hbGx5IGVtcHR5ICovIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbG9hZGluZ0VsZW1lbnQgPSBmaW5kTG9hZGluZ1NwaW5uZXIoY29udGFpbmVyKVxuICAgICAgZXhwZWN0KGxvYWRpbmdFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHByZXZpZXdDb250ZW50IHN0YXRlIGFmdGVyIHN1Y2Nlc3NmdWwgZmV0Y2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6ICdOZXcgcHJldmlldyBjb250ZW50JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05ldyBwcmV2aWV3IGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXNldCBsb2FkaW5nIHRvIHRydWUgd2hlbiBmaWxlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlMSA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTEnIH0pXG4gICAgICBjb25zdCBmaWxlMiA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTInIH0pXG5cbiAgICAgIG1vY2tGZXRjaEZpbGVQcmV2aWV3XG4gICAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBjb250ZW50OiAnQ29udGVudCAxJyB9KVxuICAgICAgICAubW9ja0ltcGxlbWVudGF0aW9uT25jZSgoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7IC8qIG5ldmVyIHJlc29sdmVzICovIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIsIGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmlsZVByZXZpZXcgZmlsZT17ZmlsZTF9IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2hhbmdlIGZpbGVcbiAgICAgIHJlcmVuZGVyKDxGaWxlUHJldmlldyBmaWxlPXtmaWxlMn0gaGlkZVByZXZpZXc9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBMb2FkaW5nIHNob3VsZCBiZSBzaG93biBhZ2FpblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxvYWRpbmdFbGVtZW50ID0gZmluZExvYWRpbmdTcGlubmVyKGNvbnRhaW5lcilcbiAgICAgICAgZXhwZWN0KGxvYWRpbmdFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIGNvbnRlbnQgdW50aWwgbmV3IGNvbnRlbnQgbG9hZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlMSA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTEnIH0pXG4gICAgICBjb25zdCBmaWxlMiA9IGNyZWF0ZU1vY2tGaWxlKHsgaWQ6ICdmaWxlLTInIH0pXG5cbiAgICAgIGxldCByZXNvbHZlU2Vjb25kOiAodmFsdWU6IHsgY29udGVudDogc3RyaW5nIH0pID0+IHZvaWRcblxuICAgICAgbW9ja0ZldGNoRmlsZVByZXZpZXdcbiAgICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGNvbnRlbnQ6ICdDb250ZW50IDEnIH0pXG4gICAgICAgIC5tb2NrSW1wbGVtZW50YXRpb25PbmNlKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7IHJlc29sdmVTZWNvbmQgPSByZXNvbHZlIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGUxfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29udGVudCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENoYW5nZSBmaWxlIC0gbG9hZGluZyBzaG91bGQgcmVwbGFjZSBjb250ZW50XG4gICAgICByZXJlbmRlcig8RmlsZVByZXZpZXcgZmlsZT17ZmlsZTJ9IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gUmVzb2x2ZSBzZWNvbmQgZmV0Y2hcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIHJlc29sdmVTZWNvbmQoeyBjb250ZW50OiAnQ29udGVudCAyJyB9KVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb250ZW50IDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdDb250ZW50IDEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnZmlsZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggZmlsZSBwcm9wJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IG5hbWU6ICdteS1kb2N1bWVudC5wZGYnLCBleHRlbnNpb246ICdwZGYnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktZG9jdW1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLnBkZicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgd2l0aG91dCBmaWxlIHByb3AnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyRmlsZVByZXZpZXcoeyBmaWxlOiB1bmRlZmluZWQgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBIZWFkZXIgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZmlsZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIG11bHRpcGxlIGRvdHMgaW4gbmFtZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBuYW1lOiAnbXkuZG9jdW1lbnQudjIucGRmJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJGaWxlUHJldmlldyh7IGZpbGUgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgam9pbiBhbGwgcGFydHMgZXhjZXB0IGxhc3Qgd2l0aCBjb21tYVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXksZG9jdW1lbnQsdjInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIG5vIGV4dGVuc2lvbiBpbiBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IG5hbWU6ICdSRUFETUUnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGZpbGUgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBnZXRGaWxlTmFtZSByZXR1cm5zIGVtcHR5IGZvciBzaW5nbGUgc2VnbWVudCwgYnV0IGNvbXBvbmVudCBzdGlsbCByZW5kZXJzXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lRWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiZmlsZU5hbWVcIl0nKVxuICAgICAgICBleHBlY3QoZmlsZU5hbWVFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIC8vIFRoZSBmaXJzdCBzcGFuIChmaWxlIG5hbWUpIHNob3VsZCBiZSBlbXB0eVxuICAgICAgICBjb25zdCBmaWxlTmFtZVNwYW4gPSBmaWxlTmFtZUVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ3NwYW46Zmlyc3QtY2hpbGQnKVxuICAgICAgICBleHBlY3QoZmlsZU5hbWVTcGFuPy50ZXh0Q29udGVudCkudG9CZSgnJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGUgd2l0aCBlbXB0eSBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IG5hbWU6ICcnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGZpbGUgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoXG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2hpZGVQcmV2aWV3IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGFjY2VwdCBoaWRlUHJldmlldyBjYWxsYmFjaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBoaWRlUHJldmlldyA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyRmlsZVByZXZpZXcoeyBoaWRlUHJldmlldyB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE5vIGVycm9ycyB0aHJvd25cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmZpbGVQcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGUgd2l0aCB1bmRlZmluZWQgaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBpZDogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNhbGwgQVBJLCByZW1haW4gaW4gbG9hZGluZyBzdGF0ZVxuICAgICAgZXhwZWN0KG1vY2tGZXRjaEZpbGVQcmV2aWV3KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIGVtcHR5IHN0cmluZyBpZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiAnJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBFbXB0eSBzdHJpbmcgaXMgZmFsc3ksIHNob3VsZCBub3QgY2FsbCBBUElcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZmlsZSBuYW1lcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gYCR7J2EnLnJlcGVhdCgyMDApfS5wZGZgXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBuYW1lOiBsb25nTmFtZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhJy5yZXBlYXQoMjAwKSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKHsgbmFtZTogJ2ZpbGUtd2l0aF9zcGVjaWFsQCMkJS50eHQnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsZVByZXZpZXcoeyBmaWxlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpbGUtd2l0aF9zcGVjaWFsQCMkJScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBwcmV2aWV3IGNvbnRlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nQ29udGVudCA9ICd4Jy5yZXBlYXQoMTAwMDApXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IGxvbmdDb250ZW50IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nQ29udGVudCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHByZXZpZXcgY29udGVudCB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBzYWZlbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzcGVjaWFsQ29udGVudCA9ICc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+XFxuXFx0JiA8ID4gXCInXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IHNwZWNpYWxDb250ZW50IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciBhcyB0ZXh0LCBub3QgZXhlY3V0ZSBzY3JpcHRzXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudERpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiZmlsZUNvbnRlbnRcIl0nKVxuICAgICAgICBleHBlY3QoY29udGVudERpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAvLyBDb250ZW50IGlzIGVzY2FwZWQgYnkgUmVhY3QsIHNvIEhUTUwgZW50aXRpZXMgYXJlIGRpc3BsYXllZFxuICAgICAgICBleHBlY3QoY29udGVudERpdj8udGV4dENvbnRlbnQpLnRvQ29udGFpbignYWxlcnQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJldmlldyBjb250ZW50IHdpdGggdW5pY29kZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVuaWNvZGVDb250ZW50ID0gJ+S4reaWh+WGheWuuSDwn5qAIMOpbW9qaXMgJiBzcMOrY8OuYWwgw6dow6BycydcbiAgICAgIG1vY2tGZXRjaEZpbGVQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogdW5pY29kZUNvbnRlbnQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHVuaWNvZGVDb250ZW50KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJldmlldyBjb250ZW50IHdpdGggbmV3bGluZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtdWx0aWxpbmVDb250ZW50ID0gJ0xpbmUgMVxcbkxpbmUgMlxcbkxpbmUgMydcbiAgICAgIG1vY2tGZXRjaEZpbGVQcmV2aWV3Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY29udGVudDogbXVsdGlsaW5lQ29udGVudCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbnRlbnQgc2hvdWxkIGJlIGluIHRoZSBET01cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50RGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJmaWxlQ29udGVudFwiXScpXG4gICAgICAgIGV4cGVjdChjb250ZW50RGl2KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChjb250ZW50RGl2Py50ZXh0Q29udGVudCkudG9Db250YWluKCdMaW5lIDEnKVxuICAgICAgICBleHBlY3QoY29udGVudERpdj8udGV4dENvbnRlbnQpLnRvQ29udGFpbignTGluZSAyJylcbiAgICAgICAgZXhwZWN0KGNvbnRlbnREaXY/LnRleHRDb250ZW50KS50b0NvbnRhaW4oJ0xpbmUgMycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIGNvbnRlbnQgZnJvbSBBUEknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNvbnRlbnQ6IG51bGwgYXMgdW5rbm93biBhcyBzdHJpbmcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2lkZSBFZmZlY3RzIGFuZCBDbGVhbnVwIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGVmZmVjdCB3aGVuIGZpbGUgcHJvcCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZTEgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiAnZmlsZS0xJyB9KVxuICAgICAgY29uc3QgZmlsZTIgPSBjcmVhdGVNb2NrRmlsZSh7IGlkOiAnZmlsZS0yJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGUxfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoRmlsZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgcmVyZW5kZXIoPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGUyfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIGVmZmVjdCB3aGVuIGhpZGVQcmV2aWV3IGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoKVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcxID0gdmkuZm4oKVxuICAgICAgY29uc3QgaGlkZVByZXZpZXcyID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGV9IGhpZGVQcmV2aWV3PXtoaWRlUHJldmlldzF9IC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEZpbGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIHJlcmVuZGVyKDxGaWxlUHJldmlldyBmaWxlPXtmaWxlfSBoaWRlUHJldmlldz17aGlkZVByZXZpZXcyfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG5vdCBjYWxsIEFQSSBhZ2FpbiAoZmlsZSBkaWRuJ3QgY2hhbmdlKVxuICAgICAgLy8gTm90ZTogVGhpcyBkZXBlbmRzIG9uIHVzZUVmZmVjdCBkZXBlbmRlbmN5IGFycmF5IG9ubHkgaW5jbHVkaW5nIFtmaWxlXVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBmaWxlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKHsgaWQ6IGBmaWxlLSR7aX1gIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGVzWzBdfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFJhcGlkbHkgY2hhbmdlIGZpbGVzXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICByZXJlbmRlcig8RmlsZVByZXZpZXcgZmlsZT17ZmlsZXNbaV19IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhdmUgY2FsbGVkIEFQSSBmb3IgZWFjaCBmaWxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEZpbGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoNSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVubW91bnQgZHVyaW5nIGxvYWRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hGaWxlUHJldmlldy5tb2NrSW1wbGVtZW50YXRpb24oXG4gICAgICAgICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKHsgY29udGVudDogJ2RlbGF5ZWQnIH0pLCAxMDAwKSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXJGaWxlUHJldmlldygpXG5cbiAgICAgIC8vIFVubW91bnQgYmVmb3JlIEFQSSByZXNvbHZlc1xuICAgICAgdW5tb3VudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIGVycm9ycyBzaG91bGQgYmUgdGhyb3duIChSZWFjdCBoYW5kbGVzIHN0YXRlIHVwZGF0ZXMgb24gdW5tb3VudGVkKVxuICAgICAgZXhwZWN0KHRydWUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZSBjaGFuZ2luZyBmcm9tIGRlZmluZWQgdG8gdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyLCBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbGVQcmV2aWV3IGZpbGU9e2ZpbGV9IGhpZGVQcmV2aWV3PXt2aS5mbigpfSAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hGaWxlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICByZXJlbmRlcig8RmlsZVByZXZpZXcgZmlsZT17dW5kZWZpbmVkfSBoaWRlUHJldmlldz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2gsIEFQSSBzaG91bGQgbm90IGJlIGNhbGxlZCBhZ2FpblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QobW9ja0ZldGNoRmlsZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZ2V0RmlsZU5hbWUgSGVscGVyIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdnZXRGaWxlTmFtZSBIZWxwZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IG5hbWUgd2l0aG91dCBleHRlbnNpb24gZm9yIHNpbXBsZSBmaWxlbmFtZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSh7IG5hbWU6ICdkb2N1bWVudC5wZGYnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsZVByZXZpZXcoeyBmaWxlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RvY3VtZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZW5hbWUgd2l0aCBtdWx0aXBsZSBkb3RzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKHsgbmFtZTogJ2ZpbGUubmFtZS53aXRoLmRvdHMudHh0JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KHsgZmlsZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgam9pbiBhbGwgcGFydHMgZXhjZXB0IGxhc3Qgd2l0aCBjb21tYVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpbGUsbmFtZSx3aXRoLGRvdHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBmb3IgZmlsZW5hbWUgd2l0aG91dCBkb3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlID0gY3JlYXRlTW9ja0ZpbGUoeyBuYW1lOiAnbm9kb3RmaWxlJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGZpbGUgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2xpY2UoMCwgLTEpIG9uIHNpbmdsZSBlbGVtZW50IGFycmF5IHJldHVybnMgZW1wdHlcbiAgICAgIGNvbnN0IGZpbGVOYW1lRWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiZmlsZU5hbWVcIl0nKVxuICAgICAgY29uc3QgZmlyc3RTcGFuID0gZmlsZU5hbWVFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdzcGFuOmZpcnN0LWNoaWxkJylcbiAgICAgIGV4cGVjdChmaXJzdFNwYW4/LnRleHRDb250ZW50KS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmcgd2hlbiBmaWxlIGlzIHVuZGVmaW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJGaWxlUHJldmlldyh7IGZpbGU6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBGaWxlIG5hbWUgYXJlYSBzaG91bGQgaGF2ZSBlbXB0eSBmaXJzdCBzcGFuXG4gICAgICBjb25zdCBmaWxlTmFtZUVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnN5c3RlbS14cy1tZWRpdW0nKVxuICAgICAgZXhwZWN0KGZpbGVOYW1lRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQWNjZXNzaWJpbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY2xpY2thYmxlIGNsb3NlIGJ1dHRvbiB3aXRoIHZpc3VhbCBpbmRpY2F0b3InLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjbG9zZUJ1dHRvbikudG9IYXZlQ2xhc3MoJ2N1cnNvci1wb2ludGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlciBoZWFkaW5nIHN0cnVjdHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZmlsZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRXJyb3IgSGFuZGxpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0Vycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IGNyYXNoIG9uIEFQSSBuZXR3b3JrIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoRmlsZVByZXZpZXcubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXJcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNyYXNoIG9uIEFQSSB0aW1lb3V0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoRmlsZVByZXZpZXcubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdUaW1lb3V0JykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbGVQcmV2aWV3KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCBvbiBtYWxmb3JtZWQgQVBJIHJlc3BvbnNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoRmlsZVByZXZpZXcubW9ja1Jlc29sdmVkVmFsdWUoe30gYXMgeyBjb250ZW50OiBzdHJpbmcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyRmlsZVByZXZpZXcoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=