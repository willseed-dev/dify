"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
const createDefaultProps = (overrides) => ({
    startIndex: 0,
    breadcrumbs: ['folder1', 'folder2'],
    onBreadcrumbClick: vi.fn(),
    ...overrides,
});
// ==========================================
// Test Suites
// ==========================================
describe('Dropdown', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
            // Assert - Trigger button should be visible
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should render trigger button with more icon', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should have RiMoreFill icon (rendered as svg)
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
        it('should render separator after dropdown', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Separator "/" should be visible
            expect(react_1.screen.getByText('/')).toBeInTheDocument();
        });
        it('should render trigger button with correct default styles', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('flex');
            expect(button).toHaveClass('size-6');
            expect(button).toHaveClass('items-center');
            expect(button).toHaveClass('justify-center');
            expect(button).toHaveClass('rounded-md');
        });
        it('should not render menu content when closed', () => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs: ['visible-folder'] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Menu content should not be visible when dropdown is closed
            expect(react_1.screen.queryByText('visible-folder')).not.toBeInTheDocument();
        });
        it('should render menu content when opened', async () => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs: ['test-folder1', 'test-folder2'] });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open dropdown
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Menu items should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('test-folder1')).toBeInTheDocument();
                expect(react_1.screen.getByText('test-folder2')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('startIndex prop', () => {
            it('should pass startIndex to Menu component', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    startIndex: 5,
                    breadcrumbs: ['folder1'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and click on item
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText('folder1'));
                // Assert - Should be called with startIndex (5) + item index (0) = 5
                expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(5);
            });
            it('should calculate correct index for second item', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    startIndex: 3,
                    breadcrumbs: ['folder1', 'folder2'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and click on second item
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder2')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText('folder2'));
                // Assert - Should be called with startIndex (3) + item index (1) = 4
                expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(4);
            });
        });
        describe('breadcrumbs prop', () => {
            it('should render all breadcrumbs in menu', async () => {
                // Arrange
                const props = createDefaultProps({
                    breadcrumbs: ['folder-a', 'folder-b', 'folder-c'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder-a')).toBeInTheDocument();
                    expect(react_1.screen.getByText('folder-b')).toBeInTheDocument();
                    expect(react_1.screen.getByText('folder-c')).toBeInTheDocument();
                });
            });
            it('should handle single breadcrumb', async () => {
                // Arrange
                const props = createDefaultProps({
                    breadcrumbs: ['single-folder'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('single-folder')).toBeInTheDocument();
                });
            });
            it('should handle empty breadcrumbs array', async () => {
                // Arrange
                const props = createDefaultProps({
                    breadcrumbs: [],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert - Menu should be rendered but with no items
                await (0, react_1.waitFor)(() => {
                    // The menu container should exist but be empty
                    expect(react_1.screen.getByRole('button')).toBeInTheDocument();
                });
            });
            it('should handle breadcrumbs with special characters', async () => {
                // Arrange
                const props = createDefaultProps({
                    breadcrumbs: ['folder [1]', 'folder (copy)', 'folder-v2.0'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder [1]')).toBeInTheDocument();
                    expect(react_1.screen.getByText('folder (copy)')).toBeInTheDocument();
                    expect(react_1.screen.getByText('folder-v2.0')).toBeInTheDocument();
                });
            });
            it('should handle breadcrumbs with unicode characters', async () => {
                // Arrange
                const props = createDefaultProps({
                    breadcrumbs: ['文件夹', 'フォルダ', 'Папка'],
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('文件夹')).toBeInTheDocument();
                    expect(react_1.screen.getByText('フォルダ')).toBeInTheDocument();
                    expect(react_1.screen.getByText('Папка')).toBeInTheDocument();
                });
            });
        });
        describe('onBreadcrumbClick prop', () => {
            it('should call onBreadcrumbClick with correct index when item clicked', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    startIndex: 0,
                    breadcrumbs: ['folder1'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText('folder1'));
                // Assert
                expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(0);
                expect(mockOnBreadcrumbClick).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ==========================================
    // State Management Tests
    // ==========================================
    describe('State Management', () => {
        describe('open state', () => {
            it('should initialize with closed state', () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['test-folder'] });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Menu content should not be visible
                expect(react_1.screen.queryByText('test-folder')).not.toBeInTheDocument();
            });
            it('should toggle to open state when trigger is clicked', async () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['test-folder'] });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('test-folder')).toBeInTheDocument();
                });
            });
            it('should toggle to closed state when trigger is clicked again', async () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['test-folder'] });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open and then close
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('test-folder')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.queryByText('test-folder')).not.toBeInTheDocument();
                });
            });
            it('should close when breadcrumb item is clicked', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    breadcrumbs: ['test-folder'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('test-folder')).toBeInTheDocument();
                });
                // Click on breadcrumb item
                react_1.fireEvent.click(react_1.screen.getByText('test-folder'));
                // Assert - Menu should close
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.queryByText('test-folder')).not.toBeInTheDocument();
                });
            });
            it('should apply correct button styles based on open state', async () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['test-folder'] });
                (0, react_1.render)(<index_1.default {...props}/>);
                const button = react_1.screen.getByRole('button');
                // Assert - Initial state (closed): should have hover:bg-state-base-hover
                expect(button).toHaveClass('hover:bg-state-base-hover');
                // Act - Open dropdown
                react_1.fireEvent.click(button);
                // Assert - Open state: should have bg-state-base-hover
                await (0, react_1.waitFor)(() => {
                    expect(button).toHaveClass('bg-state-base-hover');
                });
            });
        });
    });
    // ==========================================
    // Event Handlers Tests
    // ==========================================
    describe('Event Handlers', () => {
        describe('handleTrigger', () => {
            it('should toggle open state when trigger is clicked', async () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['folder'] });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act & Assert - Initially closed
                expect(react_1.screen.queryByText('folder')).not.toBeInTheDocument();
                // Act - Click to open
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert - Now open
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder')).toBeInTheDocument();
                });
            });
            it('should toggle multiple times correctly', async () => {
                // Arrange
                const props = createDefaultProps({ breadcrumbs: ['folder'] });
                (0, react_1.render)(<index_1.default {...props}/>);
                const button = react_1.screen.getByRole('button');
                // Act & Assert - Toggle multiple times
                // 1st click - open
                react_1.fireEvent.click(button);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder')).toBeInTheDocument();
                });
                // 2nd click - close
                react_1.fireEvent.click(button);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.queryByText('folder')).not.toBeInTheDocument();
                });
                // 3rd click - open again
                react_1.fireEvent.click(button);
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder')).toBeInTheDocument();
                });
            });
        });
        describe('handleBreadCrumbClick', () => {
            it('should call onBreadcrumbClick and close menu', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    breadcrumbs: ['folder1'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                });
                // Click on breadcrumb
                react_1.fireEvent.click(react_1.screen.getByText('folder1'));
                // Assert
                expect(mockOnBreadcrumbClick).toHaveBeenCalledTimes(1);
                // Menu should close
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.queryByText('folder1')).not.toBeInTheDocument();
                });
            });
            it('should pass correct index to onBreadcrumbClick for each item', async () => {
                // Arrange
                const mockOnBreadcrumbClick = vi.fn();
                const props = createDefaultProps({
                    startIndex: 2,
                    breadcrumbs: ['folder1', 'folder2', 'folder3'],
                    onBreadcrumbClick: mockOnBreadcrumbClick,
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and click first item
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText('folder1')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText('folder1'));
                // Assert - Index should be startIndex (2) + item index (0) = 2
                expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(2);
            });
        });
    });
    // ==========================================
    // Callback Stability and Memoization Tests
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - Dropdown component should be memoized
            expect(index_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should maintain stable callback after rerender with same props', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                breadcrumbs: ['folder'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open and click
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Rerender with same props and click again
            rerender(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Assert
            expect(mockOnBreadcrumbClick).toHaveBeenCalledTimes(2);
        });
        it('should update callback when onBreadcrumbClick prop changes', async () => {
            // Arrange
            const mockOnBreadcrumbClick1 = vi.fn();
            const mockOnBreadcrumbClick2 = vi.fn();
            const props = createDefaultProps({
                breadcrumbs: ['folder'],
                onBreadcrumbClick: mockOnBreadcrumbClick1,
            });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open and click with first callback
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Rerender with different callback
            rerender(<index_1.default {...createDefaultProps({
                breadcrumbs: ['folder'],
                onBreadcrumbClick: mockOnBreadcrumbClick2,
            })}/>);
            // Open and click with second callback
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Assert
            expect(mockOnBreadcrumbClick1).toHaveBeenCalledTimes(1);
            expect(mockOnBreadcrumbClick2).toHaveBeenCalledTimes(1);
        });
        it('should not re-render when props are the same', () => {
            // Arrange
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rerender with same props
            rerender(<index_1.default {...props}/>);
            // Assert - Component should render without errors
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle rapid toggle clicks', async () => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs: ['folder'] });
            (0, react_1.render)(<index_1.default {...props}/>);
            const button = react_1.screen.getByRole('button');
            // Act - Rapid clicks
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            // Assert - Should handle gracefully (open after odd number of clicks)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
        });
        it('should handle very long folder names', async () => {
            // Arrange
            const longName = 'a'.repeat(100);
            const props = createDefaultProps({
                breadcrumbs: [longName],
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(longName)).toBeInTheDocument();
            });
        });
        it('should handle many breadcrumbs', async () => {
            // Arrange
            const manyBreadcrumbs = Array.from({ length: 20 }, (_, i) => `folder-${i}`);
            const props = createDefaultProps({
                breadcrumbs: manyBreadcrumbs,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - First and last items should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder-0')).toBeInTheDocument();
                expect(react_1.screen.getByText('folder-19')).toBeInTheDocument();
            });
        });
        it('should handle startIndex of 0', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                startIndex: 0,
                breadcrumbs: ['folder'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Assert
            expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(0);
        });
        it('should handle large startIndex values', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                startIndex: 999,
                breadcrumbs: ['folder'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('folder'));
            // Assert
            expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(999);
        });
        it('should handle breadcrumbs with whitespace-only names', async () => {
            // Arrange
            const props = createDefaultProps({
                breadcrumbs: ['   ', 'normal-folder'],
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('normal-folder')).toBeInTheDocument();
            });
        });
        it('should handle breadcrumbs with empty string', async () => {
            // Arrange
            const props = createDefaultProps({
                breadcrumbs: ['', 'folder'],
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('folder')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { startIndex: 0, breadcrumbs: ['a'], expectedIndex: 0 },
            { startIndex: 1, breadcrumbs: ['a'], expectedIndex: 1 },
            { startIndex: 5, breadcrumbs: ['a'], expectedIndex: 5 },
            { startIndex: 10, breadcrumbs: ['a', 'b'], expectedIndex: 10 },
        ])('should handle startIndex=$startIndex correctly', async ({ startIndex, breadcrumbs, expectedIndex }) => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                startIndex,
                breadcrumbs,
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(breadcrumbs[0])).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText(breadcrumbs[0]));
            // Assert
            expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(expectedIndex);
        });
        it.each([
            { breadcrumbs: [], description: 'empty array' },
            { breadcrumbs: ['single'], description: 'single item' },
            { breadcrumbs: ['a', 'b'], description: 'two items' },
            { breadcrumbs: ['a', 'b', 'c', 'd', 'e'], description: 'five items' },
        ])('should render correctly with $description breadcrumbs', async ({ breadcrumbs }) => {
            // Arrange
            const props = createDefaultProps({ breadcrumbs });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Should render without errors
            await (0, react_1.waitFor)(() => {
                if (breadcrumbs.length > 0)
                    expect(react_1.screen.getByText(breadcrumbs[0])).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Integration Tests (Menu and Item)
    // ==========================================
    describe('Integration with Menu and Item', () => {
        it('should render all menu items with correct content', async () => {
            // Arrange
            const props = createDefaultProps({
                breadcrumbs: ['Documents', 'Projects', 'Archive'],
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Documents')).toBeInTheDocument();
                expect(react_1.screen.getByText('Projects')).toBeInTheDocument();
                expect(react_1.screen.getByText('Archive')).toBeInTheDocument();
            });
        });
        it('should handle click on any menu item', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                startIndex: 0,
                breadcrumbs: ['first', 'second', 'third'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open and click on second item
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('second')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('second'));
            // Assert - Index should be 1 (second item)
            expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(1);
        });
        it('should close menu after any item click', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                breadcrumbs: ['item1', 'item2', 'item3'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open and click on middle item
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('item2')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('item2'));
            // Assert - Menu should close
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('item1')).not.toBeInTheDocument();
                expect(react_1.screen.queryByText('item2')).not.toBeInTheDocument();
                expect(react_1.screen.queryByText('item3')).not.toBeInTheDocument();
            });
        });
        it('should correctly calculate index for each item based on startIndex', async () => {
            // Arrange
            const mockOnBreadcrumbClick = vi.fn();
            const props = createDefaultProps({
                startIndex: 3,
                breadcrumbs: ['folder-a', 'folder-b', 'folder-c'],
                onBreadcrumbClick: mockOnBreadcrumbClick,
            });
            // Test clicking each item
            for (let i = 0; i < 3; i++) {
                mockOnBreadcrumbClick.mockClear();
                const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                await (0, react_1.waitFor)(() => {
                    expect(react_1.screen.getByText(`folder-${String.fromCharCode(97 + i)}`)).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByText(`folder-${String.fromCharCode(97 + i)}`));
                expect(mockOnBreadcrumbClick).toHaveBeenCalledWith(3 + i);
                unmount();
            }
        });
    });
    // ==========================================
    // Accessibility Tests
    // ==========================================
    describe('Accessibility', () => {
        it('should render trigger as button element', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(button.tagName).toBe('BUTTON');
        });
        it('should have type="button" attribute', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixtQ0FBOEI7QUFXOUIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQWtDLEVBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pGLFVBQVUsRUFBRSxDQUFDO0lBQ2IsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUNuQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzFCLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLDZDQUE2QztBQUM3QyxjQUFjO0FBQ2QsNkNBQTZDO0FBQzdDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRiw2Q0FBNkM7SUFDN0Msa0JBQWtCO0lBQ2xCLDZDQUE2QztJQUM3QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQiw0Q0FBNEM7WUFDNUMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUs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O1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQzdDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTm90ZTogcmVhY3QtaTE4bmV4dCB1c2VzIGdsb2JhbCBtb2NrIGZyb20gd2ViL3ZpdGVzdC5zZXR1cC50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnR5cGUgRHJvcGRvd25Qcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBEcm9wZG93bj5cblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8RHJvcGRvd25Qcm9wcz4pOiBEcm9wZG93blByb3BzID0+ICh7XG4gIHN0YXJ0SW5kZXg6IDAsXG4gIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMiddLFxuICBvbkJyZWFkY3J1bWJDbGljazogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFN1aXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRHJvcGRvd24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRyaWdnZXIgYnV0dG9uIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdHJpZ2dlciBidXR0b24gd2l0aCBtb3JlIGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBoYXZlIFJpTW9yZUZpbGwgaWNvbiAocmVuZGVyZWQgYXMgc3ZnKVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VwYXJhdG9yIGFmdGVyIGRyb3Bkb3duJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2VwYXJhdG9yIFwiL1wiIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRyaWdnZXIgYnV0dG9uIHdpdGggY29ycmVjdCBkZWZhdWx0IHN0eWxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdmbGV4JylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdzaXplLTYnKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ2l0ZW1zLWNlbnRlcicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygnanVzdGlmeS1jZW50ZXInKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ3JvdW5kZWQtbWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbWVudSBjb250ZW50IHdoZW4gY2xvc2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogWyd2aXNpYmxlLWZvbGRlciddIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBNZW51IGNvbnRlbnQgc2hvdWxkIG5vdCBiZSB2aXNpYmxlIHdoZW4gZHJvcGRvd24gaXMgY2xvc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCd2aXNpYmxlLWZvbGRlcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtZW51IGNvbnRlbnQgd2hlbiBvcGVuZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBbJ3Rlc3QtZm9sZGVyMScsICd0ZXN0LWZvbGRlcjInXSB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIE1lbnUgaXRlbXMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGVzdC1mb2xkZXIxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QtZm9sZGVyMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnc3RhcnRJbmRleCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHN0YXJ0SW5kZXggdG8gTWVudSBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQnJlYWRjcnVtYkNsaWNrID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgc3RhcnRJbmRleDogNSxcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJ10sXG4gICAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd24gYW5kIGNsaWNrIG9uIGl0ZW1cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMScpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBiZSBjYWxsZWQgd2l0aCBzdGFydEluZGV4ICg1KSArIGl0ZW0gaW5kZXggKDApID0gNVxuICAgICAgICBleHBlY3QobW9ja09uQnJlYWRjcnVtYkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg1KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29ycmVjdCBpbmRleCBmb3Igc2Vjb25kIGl0ZW0nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQnJlYWRjcnVtYkNsaWNrID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgc3RhcnRJbmRleDogMyxcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJywgJ2ZvbGRlcjInXSxcbiAgICAgICAgICBvbkJyZWFkY3J1bWJDbGljazogbW9ja09uQnJlYWRjcnVtYkNsaWNrLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biBhbmQgY2xpY2sgb24gc2Vjb25kIGl0ZW1cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMicpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBiZSBjYWxsZWQgd2l0aCBzdGFydEluZGV4ICgzKSArIGl0ZW0gaW5kZXggKDEpID0gNFxuICAgICAgICBleHBlY3QobW9ja09uQnJlYWRjcnVtYkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg0KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2JyZWFkY3J1bWJzIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgYnJlYWRjcnVtYnMgaW4gbWVudScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyLWEnLCAnZm9sZGVyLWInLCAnZm9sZGVyLWMnXSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXItYScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlci1iJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyLWMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIGJyZWFkY3J1bWInLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ3NpbmdsZS1mb2xkZXInXSxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzaW5nbGUtZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGJyZWFkY3J1bWJzIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogW10sXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE1lbnUgc2hvdWxkIGJlIHJlbmRlcmVkIGJ1dCB3aXRoIG5vIGl0ZW1zXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIC8vIFRoZSBtZW51IGNvbnRhaW5lciBzaG91bGQgZXhpc3QgYnV0IGJlIGVtcHR5XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyIFsxXScsICdmb2xkZXIgKGNvcHkpJywgJ2ZvbGRlci12Mi4wJ10sXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyIFsxXScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlciAoY29weSknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXItdjIuMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIHVuaWNvZGUgY2hhcmFjdGVycycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgYnJlYWRjcnVtYnM6IFsn5paH5Lu25aS5JywgJ+ODleOCqeODq+ODgCcsICfQn9Cw0L/QutCwJ10sXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn5paH5Lu25aS5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn44OV44Kp44Or44OAJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn0J/QsNC/0LrQsCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25CcmVhZGNydW1iQ2xpY2sgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkJyZWFkY3J1bWJDbGljayB3aXRoIGNvcnJlY3QgaW5kZXggd2hlbiBpdGVtIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQnJlYWRjcnVtYkNsaWNrID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgc3RhcnRJbmRleDogMCxcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXIxJ10sXG4gICAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25CcmVhZGNydW1iQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDApXG4gICAgICAgIGV4cGVjdChtb2NrT25CcmVhZGNydW1iQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnb3BlbiBzdGF0ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGNsb3NlZCBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBbJ3Rlc3QtZm9sZGVyJ10gfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE1lbnUgY29udGVudCBzaG91bGQgbm90IGJlIHZpc2libGVcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgndGVzdC1mb2xkZXInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdG9nZ2xlIHRvIG9wZW4gc3RhdGUgd2hlbiB0cmlnZ2VyIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1iczogWyd0ZXN0LWZvbGRlciddIH0pXG4gICAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGVzdC1mb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0b2dnbGUgdG8gY2xvc2VkIHN0YXRlIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkIGFnYWluJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsndGVzdC1mb2xkZXInXSB9KVxuICAgICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gT3BlbiBhbmQgdGhlbiBjbG9zZVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd0ZXN0LWZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCd0ZXN0LWZvbGRlcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjbG9zZSB3aGVuIGJyZWFkY3J1bWIgaXRlbSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ3Rlc3QtZm9sZGVyJ10sXG4gICAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd0ZXN0LWZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQ2xpY2sgb24gYnJlYWRjcnVtYiBpdGVtXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCd0ZXN0LWZvbGRlcicpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE1lbnUgc2hvdWxkIGNsb3NlXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3Rlc3QtZm9sZGVyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgYnV0dG9uIHN0eWxlcyBiYXNlZCBvbiBvcGVuIHN0YXRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsndGVzdC1mb2xkZXInXSB9KVxuICAgICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbCBzdGF0ZSAoY2xvc2VkKTogc2hvdWxkIGhhdmUgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclxuICAgICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygnaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlcicpXG5cbiAgICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE9wZW4gc3RhdGU6IHNob3VsZCBoYXZlIGJnLXN0YXRlLWJhc2UtaG92ZXJcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JnLXN0YXRlLWJhc2UtaG92ZXInKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFdmVudCBIYW5kbGVycyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdoYW5kbGVUcmlnZ2VyJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB0b2dnbGUgb3BlbiBzdGF0ZSB3aGVuIHRyaWdnZXIgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJyZWFkY3J1bWJzOiBbJ2ZvbGRlciddIH0pXG4gICAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnQgLSBJbml0aWFsbHkgY2xvc2VkXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2ZvbGRlcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAgIC8vIEFjdCAtIENsaWNrIHRvIG9wZW5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE5vdyBvcGVuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0b2dnbGUgbXVsdGlwbGUgdGltZXMgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsnZm9sZGVyJ10gfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuXG4gICAgICAgIC8vIEFjdCAmIEFzc2VydCAtIFRvZ2dsZSBtdWx0aXBsZSB0aW1lc1xuICAgICAgICAvLyAxc3QgY2xpY2sgLSBvcGVuXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIDJuZCBjbGljayAtIGNsb3NlXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2ZvbGRlcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIDNyZCBjbGljayAtIG9wZW4gYWdhaW5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlQnJlYWRDcnVtYkNsaWNrJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQnJlYWRjcnVtYkNsaWNrIGFuZCBjbG9zZSBtZW51JywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnXSxcbiAgICAgICAgICBvbkJyZWFkY3J1bWJDbGljazogbW9ja09uQnJlYWRjcnVtYkNsaWNrLFxuICAgICAgICB9KVxuICAgICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIENsaWNrIG9uIGJyZWFkY3J1bWJcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcjEnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkJyZWFkY3J1bWJDbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgICAgLy8gTWVudSBzaG91bGQgY2xvc2VcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZm9sZGVyMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgaW5kZXggdG8gb25CcmVhZGNydW1iQ2xpY2sgZm9yIGVhY2ggaXRlbScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25CcmVhZGNydW1iQ2xpY2sgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBzdGFydEluZGV4OiAyLFxuICAgICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZvbGRlcjEnLCAnZm9sZGVyMicsICdmb2xkZXIzJ10sXG4gICAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd24gYW5kIGNsaWNrIGZpcnN0IGl0ZW1cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXIxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyMScpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEluZGV4IHNob3VsZCBiZSBzdGFydEluZGV4ICgyKSArIGl0ZW0gaW5kZXggKDApID0gMlxuICAgICAgICBleHBlY3QobW9ja09uQnJlYWRjcnVtYkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgyKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0IC0gRHJvcGRvd24gY29tcG9uZW50IHNob3VsZCBiZSBtZW1vaXplZFxuICAgICAgZXhwZWN0KERyb3Bkb3duKS50b0hhdmVQcm9wZXJ0eSgnJCR0eXBlb2YnLCBTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGNhbGxiYWNrIGFmdGVyIHJlcmVuZGVyIHdpdGggc2FtZSBwcm9wcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyJ10sXG4gICAgICAgIG9uQnJlYWRjcnVtYkNsaWNrOiBtb2NrT25CcmVhZGNydW1iQ2xpY2ssXG4gICAgICB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGFuZCBjbGlja1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSlcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzIGFuZCBjbGljayBhZ2FpblxuICAgICAgcmVyZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25CcmVhZGNydW1iQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjYWxsYmFjayB3aGVuIG9uQnJlYWRjcnVtYkNsaWNrIHByb3AgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljazEgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrT25CcmVhZGNydW1iQ2xpY2syID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXInXSxcbiAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljazEsXG4gICAgICB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGFuZCBjbGljayB3aXRoIGZpcnN0IGNhbGxiYWNrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIGRpZmZlcmVudCBjYWxsYmFja1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxEcm9wZG93biB7Li4uY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBicmVhZGNydW1iczogWydmb2xkZXInXSxcbiAgICAgICAgICBvbkJyZWFkY3J1bWJDbGljazogbW9ja09uQnJlYWRjcnVtYkNsaWNrMixcbiAgICAgICAgfSl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBPcGVuIGFuZCBjbGljayB3aXRoIHNlY29uZCBjYWxsYmFja1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQnJlYWRjcnVtYkNsaWNrMSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja09uQnJlYWRjcnVtYkNsaWNrMikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmFwaWQgdG9nZ2xlIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnJlYWRjcnVtYnM6IFsnZm9sZGVyJ10gfSlcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG5cbiAgICAgIC8vIEFjdCAtIFJhcGlkIGNsaWNrc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgaGFuZGxlIGdyYWNlZnVsbHkgKG9wZW4gYWZ0ZXIgb2RkIG51bWJlciBvZiBjbGlja3MpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZm9sZGVyIG5hbWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ05hbWUgPSAnYScucmVwZWF0KDEwMClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFtsb25nTmFtZV0sXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ05hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtYW55IGJyZWFkY3J1bWJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbWFueUJyZWFkY3J1bWJzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMjAgfSwgKF8sIGkpID0+IGBmb2xkZXItJHtpfWApXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGJyZWFkY3J1bWJzOiBtYW55QnJlYWRjcnVtYnMsXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gRmlyc3QgYW5kIGxhc3QgaXRlbXMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyLTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyLTE5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0YXJ0SW5kZXggb2YgMCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgc3RhcnRJbmRleDogMCxcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyJ10sXG4gICAgICAgIG9uQnJlYWRjcnVtYkNsaWNrOiBtb2NrT25CcmVhZGNydW1iQ2xpY2ssXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkJyZWFkY3J1bWJDbGljaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2Ugc3RhcnRJbmRleCB2YWx1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25CcmVhZGNydW1iQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHN0YXJ0SW5kZXg6IDk5OSxcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyJ10sXG4gICAgICAgIG9uQnJlYWRjcnVtYkNsaWNrOiBtb2NrT25CcmVhZGNydW1iQ2xpY2ssXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZm9sZGVyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkJyZWFkY3J1bWJDbGljaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoOTk5KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIHdoaXRlc3BhY2Utb25seSBuYW1lcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnICAgJywgJ25vcm1hbC1mb2xkZXInXSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbm9ybWFsLWZvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBicmVhZGNydW1icyB3aXRoIGVtcHR5IHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnJywgJ2ZvbGRlciddLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmb2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgeyBzdGFydEluZGV4OiAwLCBicmVhZGNydW1iczogWydhJ10sIGV4cGVjdGVkSW5kZXg6IDAgfSxcbiAgICAgIHsgc3RhcnRJbmRleDogMSwgYnJlYWRjcnVtYnM6IFsnYSddLCBleHBlY3RlZEluZGV4OiAxIH0sXG4gICAgICB7IHN0YXJ0SW5kZXg6IDUsIGJyZWFkY3J1bWJzOiBbJ2EnXSwgZXhwZWN0ZWRJbmRleDogNSB9LFxuICAgICAgeyBzdGFydEluZGV4OiAxMCwgYnJlYWRjcnVtYnM6IFsnYScsICdiJ10sIGV4cGVjdGVkSW5kZXg6IDEwIH0sXG4gICAgXSkoJ3Nob3VsZCBoYW5kbGUgc3RhcnRJbmRleD0kc3RhcnRJbmRleCBjb3JyZWN0bHknLCBhc3luYyAoeyBzdGFydEluZGV4LCBicmVhZGNydW1icywgZXhwZWN0ZWRJbmRleCB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25CcmVhZGNydW1iQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHN0YXJ0SW5kZXgsXG4gICAgICAgIGJyZWFkY3J1bWJzLFxuICAgICAgICBvbkJyZWFkY3J1bWJDbGljazogbW9ja09uQnJlYWRjcnVtYkNsaWNrLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoYnJlYWRjcnVtYnNbMF0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoYnJlYWRjcnVtYnNbMF0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25CcmVhZGNydW1iQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdGVkSW5kZXgpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBicmVhZGNydW1iczogW10sIGRlc2NyaXB0aW9uOiAnZW1wdHkgYXJyYXknIH0sXG4gICAgICB7IGJyZWFkY3J1bWJzOiBbJ3NpbmdsZSddLCBkZXNjcmlwdGlvbjogJ3NpbmdsZSBpdGVtJyB9LFxuICAgICAgeyBicmVhZGNydW1iczogWydhJywgJ2InXSwgZGVzY3JpcHRpb246ICd0d28gaXRlbXMnIH0sXG4gICAgICB7IGJyZWFkY3J1bWJzOiBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZSddLCBkZXNjcmlwdGlvbjogJ2ZpdmUgaXRlbXMnIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggJGRlc2NyaXB0aW9uIGJyZWFkY3J1bWJzJywgYXN5bmMgKHsgYnJlYWRjcnVtYnMgfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBicmVhZGNydW1icyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGVycm9yc1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGlmIChicmVhZGNydW1icy5sZW5ndGggPiAwKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGJyZWFkY3J1bWJzWzBdKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0cyAoTWVudSBhbmQgSXRlbSlcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbiB3aXRoIE1lbnUgYW5kIEl0ZW0nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIG1lbnUgaXRlbXMgd2l0aCBjb3JyZWN0IGNvbnRlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGJyZWFkY3J1bWJzOiBbJ0RvY3VtZW50cycsICdQcm9qZWN0cycsICdBcmNoaXZlJ10sXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RvY3VtZW50cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQcm9qZWN0cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBcmNoaXZlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNsaWNrIG9uIGFueSBtZW51IGl0ZW0nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25CcmVhZGNydW1iQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHN0YXJ0SW5kZXg6IDAsXG4gICAgICAgIGJyZWFkY3J1bWJzOiBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCddLFxuICAgICAgICBvbkJyZWFkY3J1bWJDbGljazogbW9ja09uQnJlYWRjcnVtYkNsaWNrLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gT3BlbiBhbmQgY2xpY2sgb24gc2Vjb25kIGl0ZW1cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnc2Vjb25kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnc2Vjb25kJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEluZGV4IHNob3VsZCBiZSAxIChzZWNvbmQgaXRlbSlcbiAgICAgIGV4cGVjdChtb2NrT25CcmVhZGNydW1iQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgbWVudSBhZnRlciBhbnkgaXRlbSBjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnaXRlbTEnLCAnaXRlbTInLCAnaXRlbTMnXSxcbiAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gYW5kIGNsaWNrIG9uIG1pZGRsZSBpdGVtXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2l0ZW0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnaXRlbTInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTWVudSBzaG91bGQgY2xvc2VcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdpdGVtMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdpdGVtMicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdpdGVtMycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgY2FsY3VsYXRlIGluZGV4IGZvciBlYWNoIGl0ZW0gYmFzZWQgb24gc3RhcnRJbmRleCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJyZWFkY3J1bWJDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgc3RhcnRJbmRleDogMyxcbiAgICAgICAgYnJlYWRjcnVtYnM6IFsnZm9sZGVyLWEnLCAnZm9sZGVyLWInLCAnZm9sZGVyLWMnXSxcbiAgICAgICAgb25CcmVhZGNydW1iQ2xpY2s6IG1vY2tPbkJyZWFkY3J1bWJDbGljayxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRlc3QgY2xpY2tpbmcgZWFjaCBpdGVtXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBtb2NrT25CcmVhZGNydW1iQ2xpY2subW9ja0NsZWFyKClcbiAgICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXIoPERyb3Bkb3duIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChgZm9sZGVyLSR7U3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIGkpfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KGBmb2xkZXItJHtTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaSl9YCkpXG5cbiAgICAgICAgZXhwZWN0KG1vY2tPbkJyZWFkY3J1bWJDbGljaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoMyArIGkpXG4gICAgICAgIHVubW91bnQoKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRyaWdnZXIgYXMgYnV0dG9uIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEcm9wZG93biB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoYnV0dG9uLnRhZ05hbWUpLnRvQmUoJ0JVVFRPTicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB0eXBlPVwiYnV0dG9uXCIgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RHJvcGRvd24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=