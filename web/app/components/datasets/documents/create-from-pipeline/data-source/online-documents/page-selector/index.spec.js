"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
const utils_1 = require("./utils");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock react-window FixedSizeList - renders items directly for testing
vi.mock('react-window', () => ({
    FixedSizeList: ({ children: ItemComponent, itemCount, itemData, itemKey }) => (<div data-testid="virtual-list">
      {Array.from({ length: itemCount }).map((_, index) => (<ItemComponent key={itemKey?.(index, itemData) || index} index={index} style={{ top: index * 28, left: 0, right: 0, width: '100%', position: 'absolute' }} data={itemData}/>))}
    </div>),
    areEqual: (prevProps, nextProps) => prevProps === nextProps,
}));
// Note: NotionIcon from @/app/components/base/ is NOT mocked - using real component per testing guidelines
// ==========================================
// Helper Functions for Base Components
// ==========================================
// Get checkbox element (uses data-testid pattern from base Checkbox component)
const getCheckbox = () => document.querySelector('[data-testid^="checkbox-"]');
const getAllCheckboxes = () => document.querySelectorAll('[data-testid^="checkbox-"]');
// Get radio element (uses size-4 rounded-full class pattern from base Radio component)
const getRadio = () => document.querySelector('.size-4.rounded-full');
const getAllRadios = () => document.querySelectorAll('.size-4.rounded-full');
// Check if checkbox is checked by looking for check icon
const isCheckboxChecked = (checkbox) => checkbox.querySelector('[data-testid^="check-icon-"]') !== null;
// Check if checkbox is disabled by looking for disabled class
const isCheckboxDisabled = (checkbox) => checkbox.classList.contains('cursor-not-allowed');
// ==========================================
// Test Data Builders
// ==========================================
const createMockPage = (overrides) => ({
    page_id: 'page-1',
    page_name: 'Test Page',
    page_icon: null,
    is_bound: false,
    parent_id: 'root',
    type: 'page',
    ...overrides,
});
const createMockPagesMap = (pages) => {
    return pages.reduce((acc, page) => {
        acc[page.page_id] = { ...page, workspace_id: 'workspace-1' };
        return acc;
    }, {});
};
const createDefaultProps = (overrides) => {
    const defaultList = [createMockPage()];
    return {
        checkedIds: new Set(),
        disabledValue: new Set(),
        searchValue: '',
        pagesMap: createMockPagesMap(defaultList),
        list: defaultList,
        onSelect: vi.fn(),
        canPreview: true,
        onPreview: vi.fn(),
        isMultipleChoice: true,
        currentCredentialId: 'cred-1',
        ...overrides,
    };
};
// Helper to create hierarchical page structure
const createHierarchicalPages = () => {
    const rootPage = createMockPage({ page_id: 'root-page', page_name: 'Root Page', parent_id: 'root' });
    const childPage1 = createMockPage({ page_id: 'child-1', page_name: 'Child 1', parent_id: 'root-page' });
    const childPage2 = createMockPage({ page_id: 'child-2', page_name: 'Child 2', parent_id: 'root-page' });
    const grandChild = createMockPage({ page_id: 'grandchild-1', page_name: 'Grandchild 1', parent_id: 'child-1' });
    const list = [rootPage, childPage1, childPage2, grandChild];
    const pagesMap = createMockPagesMap(list);
    return { list, pagesMap, rootPage, childPage1, childPage2, grandChild };
};
// ==========================================
// Test Suites
// ==========================================
describe('PageSelector', () => {
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
            // Assert
            expect(react_1.screen.getByTestId('virtual-list')).toBeInTheDocument();
        });
        it('should render empty state when list is empty', () => {
            // Arrange
            const props = createDefaultProps({
                list: [],
                pagesMap: {},
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('common.dataSource.notion.selector.noSearchResult')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('virtual-list')).not.toBeInTheDocument();
        });
        it('should render items using FixedSizeList', () => {
            // Arrange
            const pages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Page 2')).toBeInTheDocument();
        });
        it('should render checkboxes when isMultipleChoice is true', () => {
            // Arrange
            const props = createDefaultProps({ isMultipleChoice: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(getCheckbox()).toBeInTheDocument();
        });
        it('should render radio buttons when isMultipleChoice is false', () => {
            // Arrange
            const props = createDefaultProps({ isMultipleChoice: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(getRadio()).toBeInTheDocument();
        });
        it('should render preview button when canPreview is true', () => {
            // Arrange
            const props = createDefaultProps({ canPreview: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('common.dataSource.notion.selector.preview')).toBeInTheDocument();
        });
        it('should not render preview button when canPreview is false', () => {
            // Arrange
            const props = createDefaultProps({ canPreview: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('common.dataSource.notion.selector.preview')).not.toBeInTheDocument();
        });
        it('should render NotionIcon for each page', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - NotionIcon renders svg when page_icon is null
            const notionIcon = document.querySelector('.h-5.w-5');
            expect(notionIcon).toBeInTheDocument();
        });
        it('should render page name', () => {
            // Arrange
            const props = createDefaultProps({
                list: [createMockPage({ page_name: 'My Custom Page' })],
                pagesMap: createMockPagesMap([createMockPage({ page_name: 'My Custom Page' })]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('My Custom Page')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('checkedIds prop', () => {
            it('should mark checkbox as checked when page is in checkedIds', () => {
                // Arrange
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    checkedIds: new Set(['page-1']),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkbox = getCheckbox();
                expect(checkbox).toBeInTheDocument();
                expect(isCheckboxChecked(checkbox)).toBe(true);
            });
            it('should mark checkbox as unchecked when page is not in checkedIds', () => {
                // Arrange
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    checkedIds: new Set(),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkbox = getCheckbox();
                expect(checkbox).toBeInTheDocument();
                expect(isCheckboxChecked(checkbox)).toBe(false);
            });
            it('should handle empty checkedIds', () => {
                // Arrange
                const props = createDefaultProps({ checkedIds: new Set() });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkbox = getCheckbox();
                expect(checkbox).toBeInTheDocument();
                expect(isCheckboxChecked(checkbox)).toBe(false);
            });
            it('should handle multiple checked items', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                    createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
                    createMockPage({ page_id: 'page-3', page_name: 'Page 3' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    checkedIds: new Set(['page-1', 'page-3']),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkboxes = getAllCheckboxes();
                expect(isCheckboxChecked(checkboxes[0])).toBe(true);
                expect(isCheckboxChecked(checkboxes[1])).toBe(false);
                expect(isCheckboxChecked(checkboxes[2])).toBe(true);
            });
        });
        describe('disabledValue prop', () => {
            it('should disable checkbox when page is in disabledValue', () => {
                // Arrange
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    disabledValue: new Set(['page-1']),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkbox = getCheckbox();
                expect(checkbox).toBeInTheDocument();
                expect(isCheckboxDisabled(checkbox)).toBe(true);
            });
            it('should not disable checkbox when page is not in disabledValue', () => {
                // Arrange
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    disabledValue: new Set(),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkbox = getCheckbox();
                expect(checkbox).toBeInTheDocument();
                expect(isCheckboxDisabled(checkbox)).toBe(false);
            });
            it('should handle partial disabled items', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                    createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    disabledValue: new Set(['page-1']),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const checkboxes = getAllCheckboxes();
                expect(isCheckboxDisabled(checkboxes[0])).toBe(true);
                expect(isCheckboxDisabled(checkboxes[1])).toBe(false);
            });
        });
        describe('searchValue prop', () => {
            it('should filter pages by search value', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Apple Page' }),
                    createMockPage({ page_id: 'page-2', page_name: 'Banana Page' }),
                    createMockPage({ page_id: 'page-3', page_name: 'Apple Pie' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    searchValue: 'Apple',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Only pages containing "Apple" should be visible
                // Use getAllByText since the page name appears in both title div and breadcrumbs
                expect(react_1.screen.getAllByText('Apple Page').length).toBeGreaterThan(0);
                expect(react_1.screen.getAllByText('Apple Pie').length).toBeGreaterThan(0);
                // Banana Page is filtered out because it doesn't contain "Apple"
                expect(react_1.screen.queryByText('Banana Page')).not.toBeInTheDocument();
            });
            it('should show empty state when no pages match search', () => {
                // Arrange
                const pages = [createMockPage({ page_id: 'page-1', page_name: 'Test Page' })];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    searchValue: 'NonExistent',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('common.dataSource.notion.selector.noSearchResult')).toBeInTheDocument();
            });
            it('should show all pages when searchValue is empty', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                    createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    searchValue: '',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('Page 2')).toBeInTheDocument();
            });
            it('should show breadcrumbs when searchValue is present', () => {
                // Arrange
                const { list, pagesMap } = createHierarchicalPages();
                const props = createDefaultProps({
                    list,
                    pagesMap,
                    searchValue: 'Grandchild',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - page name should be visible
                expect(react_1.screen.getByText('Grandchild 1')).toBeInTheDocument();
            });
            it('should perform case-sensitive search', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Apple Page' }),
                    createMockPage({ page_id: 'page-2', page_name: 'apple page' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    searchValue: 'Apple',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Only 'Apple Page' should match (case-sensitive)
                // Use getAllByText since the page name appears in both title div and breadcrumbs
                expect(react_1.screen.getAllByText('Apple Page').length).toBeGreaterThan(0);
                expect(react_1.screen.queryByText('apple page')).not.toBeInTheDocument();
            });
        });
        describe('canPreview prop', () => {
            it('should show preview button when canPreview is true', () => {
                // Arrange
                const props = createDefaultProps({ canPreview: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('common.dataSource.notion.selector.preview')).toBeInTheDocument();
            });
            it('should hide preview button when canPreview is false', () => {
                // Arrange
                const props = createDefaultProps({ canPreview: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.queryByText('common.dataSource.notion.selector.preview')).not.toBeInTheDocument();
            });
            it('should use default value true when canPreview is not provided', () => {
                // Arrange
                const props = createDefaultProps();
                delete props.canPreview;
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('common.dataSource.notion.selector.preview')).toBeInTheDocument();
            });
        });
        describe('isMultipleChoice prop', () => {
            it('should render checkbox when isMultipleChoice is true', () => {
                // Arrange
                const props = createDefaultProps({ isMultipleChoice: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(getCheckbox()).toBeInTheDocument();
                expect(getRadio()).not.toBeInTheDocument();
            });
            it('should render radio when isMultipleChoice is false', () => {
                // Arrange
                const props = createDefaultProps({ isMultipleChoice: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(getRadio()).toBeInTheDocument();
                expect(getCheckbox()).not.toBeInTheDocument();
            });
            it('should use default value true when isMultipleChoice is not provided', () => {
                // Arrange
                const props = createDefaultProps();
                delete props.isMultipleChoice;
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(getCheckbox()).toBeInTheDocument();
            });
        });
        describe('onSelect prop', () => {
            it('should call onSelect when checkbox is clicked', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                const props = createDefaultProps({ onSelect: mockOnSelect });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(getCheckbox());
                // Assert
                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                expect(mockOnSelect).toHaveBeenCalledWith(expect.any(Set));
            });
            it('should pass updated set to onSelect', () => {
                // Arrange
                const mockOnSelect = vi.fn();
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    checkedIds: new Set(),
                    onSelect: mockOnSelect,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(getCheckbox());
                // Assert
                const calledSet = mockOnSelect.mock.calls[0][0];
                expect(calledSet.has('page-1')).toBe(true);
            });
        });
        describe('onPreview prop', () => {
            it('should call onPreview when preview button is clicked', () => {
                // Arrange
                const mockOnPreview = vi.fn();
                const page = createMockPage({ page_id: 'page-1' });
                const props = createDefaultProps({
                    list: [page],
                    pagesMap: createMockPagesMap([page]),
                    onPreview: mockOnPreview,
                    canPreview: true,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
                // Assert
                expect(mockOnPreview).toHaveBeenCalledWith('page-1');
            });
            it('should not throw when onPreview is undefined', () => {
                // Arrange
                const props = createDefaultProps({
                    onPreview: undefined,
                    canPreview: true,
                });
                // Act & Assert
                expect(() => {
                    (0, react_1.render)(<index_1.default {...props}/>);
                    react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
                }).not.toThrow();
            });
        });
        describe('currentCredentialId prop', () => {
            it('should reset dataList when currentCredentialId changes', () => {
                // Arrange
                const pages = [
                    createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                ];
                const props = createDefaultProps({
                    list: pages,
                    pagesMap: createMockPagesMap(pages),
                    currentCredentialId: 'cred-1',
                });
                // Act
                const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Initial render
                expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
                // Rerender with new credential
                rerender(<index_1.default {...props} currentCredentialId="cred-2"/>);
                // Assert - Should still show pages (reset and rebuild)
                expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // State Management and Updates
    // ==========================================
    describe('State Management and Updates', () => {
        it('should initialize dataList with root level pages', () => {
            // Arrange
            const { list, pagesMap, rootPage, childPage1 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Only root level page should be visible initially
            expect(react_1.screen.getByText(rootPage.page_name)).toBeInTheDocument();
            // Child pages should not be visible until expanded
            expect(react_1.screen.queryByText(childPage1.page_name)).not.toBeInTheDocument();
        });
        it('should update dataList when expanding a page with children', () => {
            // Arrange
            const { list, pagesMap, rootPage, childPage1, childPage2 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find and click the expand arrow (uses hover:bg-components-button-ghost-bg-hover class)
            const arrowButton = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            if (arrowButton)
                react_1.fireEvent.click(arrowButton);
            // Assert
            expect(react_1.screen.getByText(rootPage.page_name)).toBeInTheDocument();
            expect(react_1.screen.getByText(childPage1.page_name)).toBeInTheDocument();
            expect(react_1.screen.getByText(childPage2.page_name)).toBeInTheDocument();
        });
        it('should maintain currentPreviewPageId state', () => {
            // Arrange
            const mockOnPreview = vi.fn();
            const pages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
                onPreview: mockOnPreview,
                canPreview: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const previewButtons = react_1.screen.getAllByText('common.dataSource.notion.selector.preview');
            react_1.fireEvent.click(previewButtons[0]);
            // Assert
            expect(mockOnPreview).toHaveBeenCalledWith('page-1');
        });
        it('should use searchDataList when searchValue is present', () => {
            // Arrange
            const pages = [
                createMockPage({ page_id: 'page-1', page_name: 'Apple' }),
                createMockPage({ page_id: 'page-2', page_name: 'Banana' }),
            ];
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
                searchValue: 'Apple',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Only pages matching search should be visible
            // Use getAllByText since the page name appears in both title div and breadcrumbs
            expect(react_1.screen.getAllByText('Apple').length).toBeGreaterThan(0);
            expect(react_1.screen.queryByText('Banana')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Side Effects and Cleanup
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        it('should reinitialize dataList when currentCredentialId changes', () => {
            // Arrange
            const pages = [createMockPage({ page_id: 'page-1', page_name: 'Page 1' })];
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
                currentCredentialId: 'cred-1',
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            // Change credential
            rerender(<index_1.default {...props} currentCredentialId="cred-2"/>);
            // Assert - Component should still render correctly
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
        });
        it('should filter root pages correctly on initialization', () => {
            // Arrange
            const { list, pagesMap, rootPage, childPage1 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Only root level pages visible
            expect(react_1.screen.getByText(rootPage.page_name)).toBeInTheDocument();
            expect(react_1.screen.queryByText(childPage1.page_name)).not.toBeInTheDocument();
        });
        it('should include pages whose parent is not in pagesMap', () => {
            // Arrange
            const orphanPage = createMockPage({
                page_id: 'orphan-page',
                page_name: 'Orphan Page',
                parent_id: 'non-existent-parent',
            });
            const props = createDefaultProps({
                list: [orphanPage],
                pagesMap: createMockPagesMap([orphanPage]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Orphan page should be visible at root level
            expect(react_1.screen.getByText('Orphan Page')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Callback Stability and Memoization
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should have stable handleToggle that expands children', () => {
            // Arrange
            const { list, pagesMap, childPage1, childPage2 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find expand arrow for root page (has RiArrowRightSLine icon)
            const expandArrow = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            if (expandArrow)
                react_1.fireEvent.click(expandArrow);
            // Assert - Children should be visible
            expect(react_1.screen.getByText(childPage1.page_name)).toBeInTheDocument();
            expect(react_1.screen.getByText(childPage2.page_name)).toBeInTheDocument();
        });
        it('should have stable handleToggle that collapses descendants', () => {
            // Arrange
            const { list, pagesMap, childPage1, childPage2 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // First expand
            const expandArrow = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            if (expandArrow) {
                react_1.fireEvent.click(expandArrow);
                // Then collapse
                react_1.fireEvent.click(expandArrow);
            }
            // Assert - Children should be hidden again
            expect(react_1.screen.queryByText(childPage1.page_name)).not.toBeInTheDocument();
            expect(react_1.screen.queryByText(childPage2.page_name)).not.toBeInTheDocument();
        });
        it('should have stable handleCheck that adds page and descendants to selection', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
                onSelect: mockOnSelect,
                checkedIds: new Set(),
                isMultipleChoice: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Check the root page
            react_1.fireEvent.click(getCheckbox());
            // Assert - onSelect should be called with the page and its descendants
            expect(mockOnSelect).toHaveBeenCalled();
            const selectedSet = mockOnSelect.mock.calls[0][0];
            expect(selectedSet.has('root-page')).toBe(true);
        });
        it('should have stable handleCheck that removes page and descendants from selection', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
                onSelect: mockOnSelect,
                checkedIds: new Set(['root-page', 'child-1', 'child-2', 'grandchild-1']),
                isMultipleChoice: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Uncheck the root page
            react_1.fireEvent.click(getCheckbox());
            // Assert - onSelect should be called with empty/reduced set
            expect(mockOnSelect).toHaveBeenCalled();
        });
        it('should have stable handlePreview that updates currentPreviewPageId', () => {
            // Arrange
            const mockOnPreview = vi.fn();
            const page = createMockPage({ page_id: 'preview-page' });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
                onPreview: mockOnPreview,
                canPreview: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
            // Assert
            expect(mockOnPreview).toHaveBeenCalledWith('preview-page');
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies
    // ==========================================
    describe('Memoization Logic and Dependencies', () => {
        it('should compute listMapWithChildrenAndDescendants correctly', () => {
            // Arrange
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Tree structure should be built (verified by expand functionality)
            const expandArrow = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            expect(expandArrow).toBeInTheDocument(); // Root page has children
        });
        it('should recompute listMapWithChildrenAndDescendants when list changes', () => {
            // Arrange
            const initialList = [createMockPage({ page_id: 'page-1', page_name: 'Page 1' })];
            const props = createDefaultProps({
                list: initialList,
                pagesMap: createMockPagesMap(initialList),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            // Update with new list
            const newList = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            rerender(<index_1.default {...props} list={newList} pagesMap={createMockPagesMap(newList)}/>);
            // Assert
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            // Page 2 won't show because dataList state hasn't updated (only resets on credentialId change)
        });
        it('should recompute listMapWithChildrenAndDescendants when pagesMap changes', () => {
            // Arrange
            const initialList = [createMockPage({ page_id: 'page-1', page_name: 'Page 1' })];
            const props = createDefaultProps({
                list: initialList,
                pagesMap: createMockPagesMap(initialList),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Update pagesMap
            const newPagesMap = {
                ...createMockPagesMap(initialList),
                'page-2': { ...createMockPage({ page_id: 'page-2' }), workspace_id: 'ws-1' },
            };
            rerender(<index_1.default {...props} pagesMap={newPagesMap}/>);
            // Assert - Should not throw
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
        });
        it('should handle empty list in memoization', () => {
            // Arrange
            const props = createDefaultProps({
                list: [],
                pagesMap: {},
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('common.dataSource.notion.selector.noSearchResult')).toBeInTheDocument();
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions and Event Handlers', () => {
        it('should toggle expansion when clicking arrow button', () => {
            // Arrange
            const { list, pagesMap, childPage1 } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Initially children are hidden
            expect(react_1.screen.queryByText(childPage1.page_name)).not.toBeInTheDocument();
            // Click to expand
            const expandArrow = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            if (expandArrow)
                react_1.fireEvent.click(expandArrow);
            // Children become visible
            expect(react_1.screen.getByText(childPage1.page_name)).toBeInTheDocument();
        });
        it('should check/uncheck page when clicking checkbox', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({
                onSelect: mockOnSelect,
                checkedIds: new Set(),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(getCheckbox());
            // Assert
            expect(mockOnSelect).toHaveBeenCalled();
        });
        it('should select radio when clicking in single choice mode', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const props = createDefaultProps({
                onSelect: mockOnSelect,
                isMultipleChoice: false,
                checkedIds: new Set(),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(getRadio());
            // Assert
            expect(mockOnSelect).toHaveBeenCalled();
        });
        it('should clear previous selection in single choice mode', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const pages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
                onSelect: mockOnSelect,
                isMultipleChoice: false,
                checkedIds: new Set(['page-1']),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const radios = getAllRadios();
            react_1.fireEvent.click(radios[1]); // Click on page-2
            // Assert - Should clear page-1 and select page-2
            expect(mockOnSelect).toHaveBeenCalled();
            const selectedSet = mockOnSelect.mock.calls[0][0];
            expect(selectedSet.has('page-2')).toBe(true);
            expect(selectedSet.has('page-1')).toBe(false);
        });
        it('should trigger preview when clicking preview button', () => {
            // Arrange
            const mockOnPreview = vi.fn();
            const props = createDefaultProps({
                onPreview: mockOnPreview,
                canPreview: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
            // Assert
            expect(mockOnPreview).toHaveBeenCalledWith('page-1');
        });
        it('should not cascade selection in search mode', () => {
            // Arrange
            const mockOnSelect = vi.fn();
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
                onSelect: mockOnSelect,
                checkedIds: new Set(),
                searchValue: 'Root',
                isMultipleChoice: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(getCheckbox());
            // Assert - Only the clicked page should be selected (no descendants)
            expect(mockOnSelect).toHaveBeenCalled();
            const selectedSet = mockOnSelect.mock.calls[0][0];
            expect(selectedSet.size).toBe(1);
            expect(selectedSet.has('root-page')).toBe(true);
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty list', () => {
            // Arrange
            const props = createDefaultProps({
                list: [],
                pagesMap: {},
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('common.dataSource.notion.selector.noSearchResult')).toBeInTheDocument();
        });
        it('should handle null page_icon', () => {
            // Arrange
            const page = createMockPage({ page_icon: null });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - NotionIcon renders svg (RiFileTextLine) when page_icon is null
            const notionIcon = document.querySelector('.h-5.w-5');
            expect(notionIcon).toBeInTheDocument();
        });
        it('should handle page_icon with all properties', () => {
            // Arrange
            const page = createMockPage({
                page_icon: { type: 'emoji', url: null, emoji: '📄' },
            });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - NotionIcon renders the emoji
            expect(react_1.screen.getByText('📄')).toBeInTheDocument();
        });
        it('should handle empty searchValue correctly', () => {
            // Arrange
            const props = createDefaultProps({ searchValue: '' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('virtual-list')).toBeInTheDocument();
        });
        it('should handle special characters in page name', () => {
            // Arrange
            const page = createMockPage({ page_name: 'Test <script>alert("xss")</script>' });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Test <script>alert("xss")</script>')).toBeInTheDocument();
        });
        it('should handle unicode characters in page name', () => {
            // Arrange
            const page = createMockPage({ page_name: '测试页面 🔍 привет' });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('测试页面 🔍 привет')).toBeInTheDocument();
        });
        it('should handle very long page names', () => {
            // Arrange
            const longName = 'A'.repeat(500);
            const page = createMockPage({ page_name: longName });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle deeply nested hierarchy', () => {
            // Arrange - Create 5 levels deep
            const pages = [];
            let parentId = 'root';
            for (let i = 0; i < 5; i++) {
                const page = createMockPage({
                    page_id: `level-${i}`,
                    page_name: `Level ${i}`,
                    parent_id: parentId,
                });
                pages.push(page);
                parentId = page.page_id;
            }
            const props = createDefaultProps({
                list: pages,
                pagesMap: createMockPagesMap(pages),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Only root level visible
            expect(react_1.screen.getByText('Level 0')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Level 1')).not.toBeInTheDocument();
        });
        it('should handle page with missing parent reference gracefully', () => {
            // Arrange - Page whose parent doesn't exist in pagesMap (valid edge case)
            const orphanPage = createMockPage({
                page_id: 'orphan',
                page_name: 'Orphan Page',
                parent_id: 'non-existent-parent',
            });
            // Create pagesMap without the parent
            const pagesMap = createMockPagesMap([orphanPage]);
            const props = createDefaultProps({
                list: [orphanPage],
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render the orphan page at root level
            expect(react_1.screen.getByText('Orphan Page')).toBeInTheDocument();
        });
        it('should handle empty checkedIds Set', () => {
            // Arrange
            const props = createDefaultProps({ checkedIds: new Set() });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const checkbox = getCheckbox();
            expect(checkbox).toBeInTheDocument();
            expect(isCheckboxChecked(checkbox)).toBe(false);
        });
        it('should handle empty disabledValue Set', () => {
            // Arrange
            const props = createDefaultProps({ disabledValue: new Set() });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const checkbox = getCheckbox();
            expect(checkbox).toBeInTheDocument();
            expect(isCheckboxDisabled(checkbox)).toBe(false);
        });
        it('should handle undefined onPreview gracefully', () => {
            // Arrange
            const props = createDefaultProps({
                onPreview: undefined,
                canPreview: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Click should not throw
            expect(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
            }).not.toThrow();
        });
        it('should handle page without descendants correctly', () => {
            // Arrange
            const leafPage = createMockPage({ page_id: 'leaf', page_name: 'Leaf Page' });
            const props = createDefaultProps({
                list: [leafPage],
                pagesMap: createMockPagesMap([leafPage]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - No expand arrow for leaf pages
            const arrowButton = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            expect(arrowButton).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // All Prop Variations
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            [{ canPreview: true, isMultipleChoice: true }],
            [{ canPreview: true, isMultipleChoice: false }],
            [{ canPreview: false, isMultipleChoice: true }],
            [{ canPreview: false, isMultipleChoice: false }],
        ])('should render correctly with props %o', (propVariation) => {
            // Arrange
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('virtual-list')).toBeInTheDocument();
            if (propVariation.canPreview)
                expect(react_1.screen.getByText('common.dataSource.notion.selector.preview')).toBeInTheDocument();
            else
                expect(react_1.screen.queryByText('common.dataSource.notion.selector.preview')).not.toBeInTheDocument();
            if (propVariation.isMultipleChoice)
                expect(getCheckbox()).toBeInTheDocument();
            else
                expect(getRadio()).toBeInTheDocument();
        });
        it('should handle all default prop values', () => {
            // Arrange
            const minimalProps = {
                checkedIds: new Set(),
                disabledValue: new Set(),
                searchValue: '',
                pagesMap: createMockPagesMap([createMockPage()]),
                list: [createMockPage()],
                onSelect: vi.fn(),
                currentCredentialId: 'cred-1',
                // canPreview defaults to true
                // isMultipleChoice defaults to true
            };
            // Act
            (0, react_1.render)(<index_1.default {...minimalProps}/>);
            // Assert - Defaults should be applied
            expect(getCheckbox()).toBeInTheDocument();
            expect(react_1.screen.getByText('common.dataSource.notion.selector.preview')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Utils Function Tests
    // ==========================================
    describe('Utils - recursivePushInParentDescendants', () => {
        it('should build tree structure for simple parent-child relationship', () => {
            // Arrange
            const parent = createMockPage({ page_id: 'parent', page_name: 'Parent', parent_id: 'root' });
            const child = createMockPage({ page_id: 'child', page_name: 'Child', parent_id: 'parent' });
            const pagesMap = createMockPagesMap([parent, child]);
            const listTreeMap = {};
            // Create initial entry for child
            const childEntry = {
                ...child,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[child.page_id] = childEntry;
            // Act
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, childEntry, childEntry);
            // Assert
            expect(listTreeMap.parent).toBeDefined();
            expect(listTreeMap.parent.children.has('child')).toBe(true);
            expect(listTreeMap.parent.descendants.has('child')).toBe(true);
            expect(childEntry.depth).toBe(1);
            expect(childEntry.ancestors).toContain('Parent');
        });
        it('should handle root level pages', () => {
            // Arrange
            const rootPage = createMockPage({ page_id: 'root-page', parent_id: 'root' });
            const pagesMap = createMockPagesMap([rootPage]);
            const listTreeMap = {};
            const rootEntry = {
                ...rootPage,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[rootPage.page_id] = rootEntry;
            // Act
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, rootEntry, rootEntry);
            // Assert - No parent should be created for root level
            expect(Object.keys(listTreeMap)).toHaveLength(1);
            expect(rootEntry.depth).toBe(0);
            expect(rootEntry.ancestors).toHaveLength(0);
        });
        it('should handle missing parent in pagesMap', () => {
            // Arrange
            const orphan = createMockPage({ page_id: 'orphan', parent_id: 'missing-parent' });
            const pagesMap = createMockPagesMap([orphan]);
            const listTreeMap = {};
            const orphanEntry = {
                ...orphan,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[orphan.page_id] = orphanEntry;
            // Act
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, orphanEntry, orphanEntry);
            // Assert - Should not create parent entry for missing parent
            expect(listTreeMap['missing-parent']).toBeUndefined();
        });
        it('should handle null parent_id', () => {
            // Arrange
            const page = createMockPage({ page_id: 'page', parent_id: '' });
            const pagesMap = createMockPagesMap([page]);
            const listTreeMap = {};
            const pageEntry = {
                ...page,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[page.page_id] = pageEntry;
            // Act
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, pageEntry, pageEntry);
            // Assert - Early return, no changes
            expect(Object.keys(listTreeMap)).toHaveLength(1);
        });
        it('should accumulate depth for deeply nested pages', () => {
            // Arrange - 3 levels deep
            const level0 = createMockPage({ page_id: 'l0', page_name: 'Level 0', parent_id: 'root' });
            const level1 = createMockPage({ page_id: 'l1', page_name: 'Level 1', parent_id: 'l0' });
            const level2 = createMockPage({ page_id: 'l2', page_name: 'Level 2', parent_id: 'l1' });
            const pagesMap = createMockPagesMap([level0, level1, level2]);
            const listTreeMap = {};
            // Add all levels
            const l0Entry = {
                ...level0,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            const l1Entry = {
                ...level1,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            const l2Entry = {
                ...level2,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[level0.page_id] = l0Entry;
            listTreeMap[level1.page_id] = l1Entry;
            listTreeMap[level2.page_id] = l2Entry;
            // Act - Process from leaf to root
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, l2Entry, l2Entry);
            // Assert
            expect(l2Entry.depth).toBe(2);
            expect(l2Entry.ancestors).toEqual(['Level 0', 'Level 1']);
            expect(listTreeMap.l1.children.has('l2')).toBe(true);
            expect(listTreeMap.l0.descendants.has('l2')).toBe(true);
        });
        it('should update existing parent entry', () => {
            // Arrange
            const parent = createMockPage({ page_id: 'parent', page_name: 'Parent', parent_id: 'root' });
            const child1 = createMockPage({ page_id: 'child1', parent_id: 'parent' });
            const child2 = createMockPage({ page_id: 'child2', parent_id: 'parent' });
            const pagesMap = createMockPagesMap([parent, child1, child2]);
            const listTreeMap = {};
            // Pre-create parent entry
            listTreeMap.parent = {
                ...parent,
                children: new Set(['child1']),
                descendants: new Set(['child1']),
                depth: 0,
                ancestors: [],
            };
            const child2Entry = {
                ...child2,
                children: new Set(),
                descendants: new Set(),
                depth: 0,
                ancestors: [],
            };
            listTreeMap[child2.page_id] = child2Entry;
            // Act
            (0, utils_1.recursivePushInParentDescendants)(pagesMap, listTreeMap, child2Entry, child2Entry);
            // Assert - Should add child2 to existing parent
            expect(listTreeMap.parent.children.has('child1')).toBe(true);
            expect(listTreeMap.parent.children.has('child2')).toBe(true);
            expect(listTreeMap.parent.descendants.has('child1')).toBe(true);
            expect(listTreeMap.parent.descendants.has('child2')).toBe(true);
        });
    });
    // ==========================================
    // Item Component Integration Tests
    // ==========================================
    describe('Item Component Integration', () => {
        it('should render item with correct styling for preview state', () => {
            // Arrange
            const page = createMockPage({ page_id: 'page-1', page_name: 'Test Page' });
            const props = createDefaultProps({
                list: [page],
                pagesMap: createMockPagesMap([page]),
                canPreview: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Click preview to set currentPreviewPageId
            react_1.fireEvent.click(react_1.screen.getByText('common.dataSource.notion.selector.preview'));
            // Assert - Item should have preview styling class
            const itemContainer = react_1.screen.getByText('Test Page').closest('[class*="group"]');
            expect(itemContainer).toHaveClass('bg-state-base-hover');
        });
        it('should show arrow for pages with children', () => {
            // Arrange
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Root page should have expand arrow
            const arrowContainer = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            expect(arrowContainer).toBeInTheDocument();
        });
        it('should not show arrow for leaf pages', () => {
            // Arrange
            const leafPage = createMockPage({ page_id: 'leaf', page_name: 'Leaf' });
            const props = createDefaultProps({
                list: [leafPage],
                pagesMap: createMockPagesMap([leafPage]),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - No expand arrow for leaf pages
            const arrowContainer = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            expect(arrowContainer).not.toBeInTheDocument();
        });
        it('should hide arrows in search mode', () => {
            // Arrange
            const { list, pagesMap } = createHierarchicalPages();
            const props = createDefaultProps({
                list,
                pagesMap,
                searchValue: 'Root',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - No expand arrows in search mode (renderArrow returns null when searchValue)
            // The arrows are only shown when !searchValue
            const arrowContainer = document.querySelector('[class*="hover:bg-components-button-ghost-bg-hover"]');
            expect(arrowContainer).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBa0M7QUFDbEMsbUNBQTBEO0FBRTFELDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSx1RUFBdUU7QUFDdkUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3QixhQUFhLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQU8sRUFBRSxFQUFFLENBQUMsQ0FDakYsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FDN0I7TUFBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUNuRCxDQUFDLGFBQWEsQ0FDWixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLENBQ3pDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQ25GLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUNmLENBQ0gsQ0FBQyxDQUNKO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELFFBQVEsRUFBRSxDQUFDLFNBQWMsRUFBRSxTQUFjLEVBQUUsRUFBRSxDQUFD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QkFBdUIsRUFBRSxDQUFBO1lBQ3BELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUMvQixJQUFJO2dCQUNKLFFBQVE7Z0JBQ1IsV0FBVyxFQUFFLE1BQU07YUFDcEIsQ0FBQyxDQUFBO1lBRUYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5DLHVGQUF1RjtZQUN2Riw4Q0FBOEM7WUFDOUMsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1lBQ3JHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNoRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vdGlvblBhZ2VUcmVlSXRlbSwgTm90aW9uUGFnZVRyZWVNYXAgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm90aW9uUGFnZSwgRGF0YVNvdXJjZU5vdGlvblBhZ2VNYXAgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFBhZ2VTZWxlY3RvciBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgcmVjdXJzaXZlUHVzaEluUGFyZW50RGVzY2VuZGFudHMgfSBmcm9tICcuL3V0aWxzJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgTW9kdWxlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IHJlYWN0LWkxOG5leHQgdXNlcyBnbG9iYWwgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gTW9jayByZWFjdC13aW5kb3cgRml4ZWRTaXplTGlzdCAtIHJlbmRlcnMgaXRlbXMgZGlyZWN0bHkgZm9yIHRlc3RpbmdcbnZpLm1vY2soJ3JlYWN0LXdpbmRvdycsICgpID0+ICh7XG4gIEZpeGVkU2l6ZUxpc3Q6ICh7IGNoaWxkcmVuOiBJdGVtQ29tcG9uZW50LCBpdGVtQ291bnQsIGl0ZW1EYXRhLCBpdGVtS2V5IH06IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ2aXJ0dWFsLWxpc3RcIj5cbiAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBpdGVtQ291bnQgfSkubWFwKChfLCBpbmRleCkgPT4gKFxuICAgICAgICA8SXRlbUNvbXBvbmVudFxuICAgICAgICAgIGtleT17aXRlbUtleT8uKGluZGV4LCBpdGVtRGF0YSkgfHwgaW5kZXh9XG4gICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgIHN0eWxlPXt7IHRvcDogaW5kZXggKiAyOCwgbGVmdDogMCwgcmlnaHQ6IDAsIHdpZHRoOiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnIH19XG4gICAgICAgICAgZGF0YT17aXRlbURhdGF9XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKSxcbiAgYXJlRXF1YWw6IChwcmV2UHJvcHM6IGFueSwgbmV4dFByb3BzOiBhbnkpID0+IHByZXZQcm9wcyA9PT0gbmV4dFByb3BzLFxufSkpXG5cbi8vIE5vdGU6IE5vdGlvbkljb24gZnJvbSBAL2FwcC9jb21wb25lbnRzL2Jhc2UvIGlzIE5PVCBtb2NrZWQgLSB1c2luZyByZWFsIGNvbXBvbmVudCBwZXIgdGVzdGluZyBndWlkZWxpbmVzXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9ucyBmb3IgQmFzZSBDb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdldCBjaGVja2JveCBlbGVtZW50ICh1c2VzIGRhdGEtdGVzdGlkIHBhdHRlcm4gZnJvbSBiYXNlIENoZWNrYm94IGNvbXBvbmVudClcbmNvbnN0IGdldENoZWNrYm94ID0gKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94LVwiXScpIGFzIEhUTUxFbGVtZW50XG5jb25zdCBnZXRBbGxDaGVja2JveGVzID0gKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94LVwiXScpXG5cbi8vIEdldCByYWRpbyBlbGVtZW50ICh1c2VzIHNpemUtNCByb3VuZGVkLWZ1bGwgY2xhc3MgcGF0dGVybiBmcm9tIGJhc2UgUmFkaW8gY29tcG9uZW50KVxuY29uc3QgZ2V0UmFkaW8gPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2l6ZS00LnJvdW5kZWQtZnVsbCcpIGFzIEhUTUxFbGVtZW50XG5jb25zdCBnZXRBbGxSYWRpb3MgPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2l6ZS00LnJvdW5kZWQtZnVsbCcpXG5cbi8vIENoZWNrIGlmIGNoZWNrYm94IGlzIGNoZWNrZWQgYnkgbG9va2luZyBmb3IgY2hlY2sgaWNvblxuY29uc3QgaXNDaGVja2JveENoZWNrZWQgPSAoY2hlY2tib3g6IEVsZW1lbnQpID0+IGNoZWNrYm94LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVjay1pY29uLVwiXScpICE9PSBudWxsXG5cbi8vIENoZWNrIGlmIGNoZWNrYm94IGlzIGRpc2FibGVkIGJ5IGxvb2tpbmcgZm9yIGRpc2FibGVkIGNsYXNzXG5jb25zdCBpc0NoZWNrYm94RGlzYWJsZWQgPSAoY2hlY2tib3g6IEVsZW1lbnQpID0+IGNoZWNrYm94LmNsYXNzTGlzdC5jb250YWlucygnY3Vyc29yLW5vdC1hbGxvd2VkJylcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgY3JlYXRlTW9ja1BhZ2UgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm90aW9uUGFnZT4pOiBEYXRhU291cmNlTm90aW9uUGFnZSA9PiAoe1xuICBwYWdlX2lkOiAncGFnZS0xJyxcbiAgcGFnZV9uYW1lOiAnVGVzdCBQYWdlJyxcbiAgcGFnZV9pY29uOiBudWxsLFxuICBpc19ib3VuZDogZmFsc2UsXG4gIHBhcmVudF9pZDogJ3Jvb3QnLFxuICB0eXBlOiAncGFnZScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tQYWdlc01hcCA9IChwYWdlczogRGF0YVNvdXJjZU5vdGlvblBhZ2VbXSk6IERhdGFTb3VyY2VOb3Rpb25QYWdlTWFwID0+IHtcbiAgcmV0dXJuIHBhZ2VzLnJlZHVjZSgoYWNjLCBwYWdlKSA9PiB7XG4gICAgYWNjW3BhZ2UucGFnZV9pZF0gPSB7IC4uLnBhZ2UsIHdvcmtzcGFjZV9pZDogJ3dvcmtzcGFjZS0xJyB9XG4gICAgcmV0dXJuIGFjY1xuICB9LCB7fSBhcyBEYXRhU291cmNlTm90aW9uUGFnZU1hcClcbn1cblxudHlwZSBQYWdlU2VsZWN0b3JQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBQYWdlU2VsZWN0b3I+XG5cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPFBhZ2VTZWxlY3RvclByb3BzPik6IFBhZ2VTZWxlY3RvclByb3BzID0+IHtcbiAgY29uc3QgZGVmYXVsdExpc3QgPSBbY3JlYXRlTW9ja1BhZ2UoKV1cbiAgcmV0dXJuIHtcbiAgICBjaGVja2VkSWRzOiBuZXcgU2V0PHN0cmluZz4oKSxcbiAgICBkaXNhYmxlZFZhbHVlOiBuZXcgU2V0PHN0cmluZz4oKSxcbiAgICBzZWFyY2hWYWx1ZTogJycsXG4gICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChkZWZhdWx0TGlzdCksXG4gICAgbGlzdDogZGVmYXVsdExpc3QsXG4gICAgb25TZWxlY3Q6IHZpLmZuKCksXG4gICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSxcbiAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cbn1cblxuLy8gSGVscGVyIHRvIGNyZWF0ZSBoaWVyYXJjaGljYWwgcGFnZSBzdHJ1Y3R1cmVcbmNvbnN0IGNyZWF0ZUhpZXJhcmNoaWNhbFBhZ2VzID0gKCkgPT4ge1xuICBjb25zdCByb290UGFnZSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3Jvb3QtcGFnZScsIHBhZ2VfbmFtZTogJ1Jvb3QgUGFnZScsIHBhcmVudF9pZDogJ3Jvb3QnIH0pXG4gIGNvbnN0IGNoaWxkUGFnZTEgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdjaGlsZC0xJywgcGFnZV9uYW1lOiAnQ2hpbGQgMScsIHBhcmVudF9pZDogJ3Jvb3QtcGFnZScgfSlcbiAgY29uc3QgY2hpbGRQYWdlMiA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ2NoaWxkLTInLCBwYWdlX25hbWU6ICdDaGlsZCAyJywgcGFyZW50X2lkOiAncm9vdC1wYWdlJyB9KVxuICBjb25zdCBncmFuZENoaWxkID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAnZ3JhbmRjaGlsZC0xJywgcGFnZV9uYW1lOiAnR3JhbmRjaGlsZCAxJywgcGFyZW50X2lkOiAnY2hpbGQtMScgfSlcblxuICBjb25zdCBsaXN0ID0gW3Jvb3RQYWdlLCBjaGlsZFBhZ2UxLCBjaGlsZFBhZ2UyLCBncmFuZENoaWxkXVxuICBjb25zdCBwYWdlc01hcCA9IGNyZWF0ZU1vY2tQYWdlc01hcChsaXN0KVxuXG4gIHJldHVybiB7IGxpc3QsIHBhZ2VzTWFwLCByb290UGFnZSwgY2hpbGRQYWdlMSwgY2hpbGRQYWdlMiwgZ3JhbmRDaGlsZCB9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1BhZ2VTZWxlY3RvcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmlydHVhbC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgc3RhdGUgd2hlbiBsaXN0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBbXSxcbiAgICAgICAgcGFnZXNNYXA6IHt9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3Iubm9TZWFyY2hSZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd2aXJ0dWFsLWxpc3QnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaXRlbXMgdXNpbmcgRml4ZWRTaXplTGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2VzID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hlY2tib3hlcyB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmFkaW8gYnV0dG9ucyB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTXVsdGlwbGVDaG9pY2U6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZ2V0UmFkaW8oKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwcmV2aWV3IGJ1dHRvbiB3aGVuIGNhblByZXZpZXcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY2FuUHJldmlldzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5kYXRhU291cmNlLm5vdGlvbi5zZWxlY3Rvci5wcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHByZXZpZXcgYnV0dG9uIHdoZW4gY2FuUHJldmlldyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY2FuUHJldmlldzogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5kYXRhU291cmNlLm5vdGlvbi5zZWxlY3Rvci5wcmV2aWV3JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIE5vdGlvbkljb24gZm9yIGVhY2ggcGFnZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBOb3Rpb25JY29uIHJlbmRlcnMgc3ZnIHdoZW4gcGFnZV9pY29uIGlzIG51bGxcbiAgICAgIGNvbnN0IG5vdGlvbkljb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaC01LnctNScpXG4gICAgICBleHBlY3Qobm90aW9uSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYWdlIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3Q6IFtjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfbmFtZTogJ015IEN1c3RvbSBQYWdlJyB9KV0sXG4gICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW2NyZWF0ZU1vY2tQYWdlKHsgcGFnZV9uYW1lOiAnTXkgQ3VzdG9tIFBhZ2UnIH0pXSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IEN1c3RvbSBQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2NoZWNrZWRJZHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbWFyayBjaGVja2JveCBhcyBjaGVja2VkIHdoZW4gcGFnZSBpcyBpbiBjaGVja2VkSWRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBsaXN0OiBbcGFnZV0sXG4gICAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChbcGFnZV0pLFxuICAgICAgICAgIGNoZWNrZWRJZHM6IG5ldyBTZXQoWydwYWdlLTEnXSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0Q2hlY2tib3goKVxuICAgICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGlzQ2hlY2tib3hDaGVja2VkKGNoZWNrYm94KSkudG9CZSh0cnVlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBtYXJrIGNoZWNrYm94IGFzIHVuY2hlY2tlZCB3aGVuIHBhZ2UgaXMgbm90IGluIGNoZWNrZWRJZHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGxpc3Q6IFtwYWdlXSxcbiAgICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYWdlXSksXG4gICAgICAgICAgY2hlY2tlZElkczogbmV3IFNldCgpLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaGVja2JveCA9IGdldENoZWNrYm94KClcbiAgICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChpc0NoZWNrYm94Q2hlY2tlZChjaGVja2JveCkpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjaGVja2VkSWRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY2hlY2tlZElkczogbmV3IFNldCgpIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0Q2hlY2tib3goKVxuICAgICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGlzQ2hlY2tib3hDaGVja2VkKGNoZWNrYm94KSkudG9CZShmYWxzZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNoZWNrZWQgaXRlbXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZXMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMycsIHBhZ2VfbmFtZTogJ1BhZ2UgMycgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGxpc3Q6IHBhZ2VzLFxuICAgICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAocGFnZXMpLFxuICAgICAgICAgIGNoZWNrZWRJZHM6IG5ldyBTZXQoWydwYWdlLTEnLCAncGFnZS0zJ10pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaGVja2JveGVzID0gZ2V0QWxsQ2hlY2tib3hlcygpXG4gICAgICAgIGV4cGVjdChpc0NoZWNrYm94Q2hlY2tlZChjaGVja2JveGVzWzBdKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QoaXNDaGVja2JveENoZWNrZWQoY2hlY2tib3hlc1sxXSkpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChpc0NoZWNrYm94Q2hlY2tlZChjaGVja2JveGVzWzJdKSkudG9CZSh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rpc2FibGVkVmFsdWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBjaGVja2JveCB3aGVuIHBhZ2UgaXMgaW4gZGlzYWJsZWRWYWx1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW3BhZ2VdKSxcbiAgICAgICAgICBkaXNhYmxlZFZhbHVlOiBuZXcgU2V0KFsncGFnZS0xJ10pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaGVja2JveCA9IGdldENoZWNrYm94KClcbiAgICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChpc0NoZWNrYm94RGlzYWJsZWQoY2hlY2tib3gpKS50b0JlKHRydWUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBkaXNhYmxlIGNoZWNrYm94IHdoZW4gcGFnZSBpcyBub3QgaW4gZGlzYWJsZWRWYWx1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW3BhZ2VdKSxcbiAgICAgICAgICBkaXNhYmxlZFZhbHVlOiBuZXcgU2V0KCksXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0Q2hlY2tib3goKVxuICAgICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGlzQ2hlY2tib3hEaXNhYmxlZChjaGVja2JveCkpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYXJ0aWFsIGRpc2FibGVkIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBhZ2VzID0gW1xuICAgICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1BhZ2UgMScgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJywgcGFnZV9uYW1lOiAnUGFnZSAyJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdDogcGFnZXMsXG4gICAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICAgICAgZGlzYWJsZWRWYWx1ZTogbmV3IFNldChbJ3BhZ2UtMSddKSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2hlY2tib3hlcyA9IGdldEFsbENoZWNrYm94ZXMoKVxuICAgICAgICBleHBlY3QoaXNDaGVja2JveERpc2FibGVkKGNoZWNrYm94ZXNbMF0pKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChpc0NoZWNrYm94RGlzYWJsZWQoY2hlY2tib3hlc1sxXSkpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2VhcmNoVmFsdWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZmlsdGVyIHBhZ2VzIGJ5IHNlYXJjaCB2YWx1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYWdlcyA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdBcHBsZSBQYWdlJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdCYW5hbmEgUGFnZScgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0zJywgcGFnZV9uYW1lOiAnQXBwbGUgUGllJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdDogcGFnZXMsXG4gICAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICAgICAgc2VhcmNoVmFsdWU6ICdBcHBsZScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gT25seSBwYWdlcyBjb250YWluaW5nIFwiQXBwbGVcIiBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgICAvLyBVc2UgZ2V0QWxsQnlUZXh0IHNpbmNlIHRoZSBwYWdlIG5hbWUgYXBwZWFycyBpbiBib3RoIHRpdGxlIGRpdiBhbmQgYnJlYWRjcnVtYnNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FwcGxlIFBhZ2UnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnQXBwbGUgUGllJykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgICAgLy8gQmFuYW5hIFBhZ2UgaXMgZmlsdGVyZWQgb3V0IGJlY2F1c2UgaXQgZG9lc24ndCBjb250YWluIFwiQXBwbGVcIlxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdCYW5hbmEgUGFnZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGVtcHR5IHN0YXRlIHdoZW4gbm8gcGFnZXMgbWF0Y2ggc2VhcmNoJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBhZ2VzID0gW2NyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1Rlc3QgUGFnZScgfSldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKHBhZ2VzKSxcbiAgICAgICAgICBzZWFyY2hWYWx1ZTogJ05vbkV4aXN0ZW50JyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5kYXRhU291cmNlLm5vdGlvbi5zZWxlY3Rvci5ub1NlYXJjaFJlc3VsdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgYWxsIHBhZ2VzIHdoZW4gc2VhcmNoVmFsdWUgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZXMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgICBdXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKHBhZ2VzKSxcbiAgICAgICAgICBzZWFyY2hWYWx1ZTogJycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWdlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBicmVhZGNydW1icyB3aGVuIHNlYXJjaFZhbHVlIGlzIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCB9ID0gY3JlYXRlSGllcmFyY2hpY2FsUGFnZXMoKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdCxcbiAgICAgICAgICBwYWdlc01hcCxcbiAgICAgICAgICBzZWFyY2hWYWx1ZTogJ0dyYW5kY2hpbGQnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHBhZ2UgbmFtZSBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnR3JhbmRjaGlsZCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGVyZm9ybSBjYXNlLXNlbnNpdGl2ZSBzZWFyY2gnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFnZXMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnQXBwbGUgUGFnZScgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJywgcGFnZV9uYW1lOiAnYXBwbGUgcGFnZScgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIGxpc3Q6IHBhZ2VzLFxuICAgICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAocGFnZXMpLFxuICAgICAgICAgIHNlYXJjaFZhbHVlOiAnQXBwbGUnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE9ubHkgJ0FwcGxlIFBhZ2UnIHNob3VsZCBtYXRjaCAoY2FzZS1zZW5zaXRpdmUpXG4gICAgICAgIC8vIFVzZSBnZXRBbGxCeVRleHQgc2luY2UgdGhlIHBhZ2UgbmFtZSBhcHBlYXJzIGluIGJvdGggdGl0bGUgZGl2IGFuZCBicmVhZGNydW1ic1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnQXBwbGUgUGFnZScpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2FwcGxlIHBhZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjYW5QcmV2aWV3IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgcHJldmlldyBidXR0b24gd2hlbiBjYW5QcmV2aWV3IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjYW5QcmV2aWV3OiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhpZGUgcHJldmlldyBidXR0b24gd2hlbiBjYW5QcmV2aWV3IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY2FuUHJldmlldzogZmFsc2UgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLnByZXZpZXcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgdmFsdWUgdHJ1ZSB3aGVuIGNhblByZXZpZXcgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgZGVsZXRlIChwcm9wcyBhcyBhbnkpLmNhblByZXZpZXdcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5kYXRhU291cmNlLm5vdGlvbi5zZWxlY3Rvci5wcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpc011bHRpcGxlQ2hvaWNlIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVja2JveCB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzTXVsdGlwbGVDaG9pY2U6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGdldFJhZGlvKCkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciByYWRpbyB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc011bHRpcGxlQ2hvaWNlOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoZ2V0UmFkaW8oKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgdmFsdWUgdHJ1ZSB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgZGVsZXRlIChwcm9wcyBhcyBhbnkpLmlzTXVsdGlwbGVDaG9pY2VcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvblNlbGVjdCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0IHdoZW4gY2hlY2tib3ggaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25TZWxlY3Q6IG1vY2tPblNlbGVjdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0Q2hlY2tib3goKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5hbnkoU2V0KSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyB1cGRhdGVkIHNldCB0byBvblNlbGVjdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBsaXN0OiBbcGFnZV0sXG4gICAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChbcGFnZV0pLFxuICAgICAgICAgIGNoZWNrZWRJZHM6IG5ldyBTZXQoKSxcbiAgICAgICAgICBvblNlbGVjdDogbW9ja09uU2VsZWN0LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0Q2hlY2tib3goKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2FsbGVkU2V0ID0gbW9ja09uU2VsZWN0Lm1vY2suY2FsbHNbMF1bMF0gYXMgU2V0PHN0cmluZz5cbiAgICAgICAgZXhwZWN0KGNhbGxlZFNldC5oYXMoJ3BhZ2UtMScpKS50b0JlKHRydWUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25QcmV2aWV3IHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aWV3IHdoZW4gcHJldmlldyBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW3BhZ2VdKSxcbiAgICAgICAgICBvblByZXZpZXc6IG1vY2tPblByZXZpZXcsXG4gICAgICAgICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5kYXRhU291cmNlLm5vdGlvbi5zZWxlY3Rvci5wcmV2aWV3JykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncGFnZS0xJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHRocm93IHdoZW4gb25QcmV2aWV3IGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgb25QcmV2aWV3OiB1bmRlZmluZWQsXG4gICAgICAgICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKVxuICAgICAgICB9KS5ub3QudG9UaHJvdygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnY3VycmVudENyZWRlbnRpYWxJZCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNldCBkYXRhTGlzdCB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYWdlcyA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBdXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKHBhZ2VzKSxcbiAgICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBJbml0aWFsIHJlbmRlclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBSZXJlbmRlciB3aXRoIG5ldyBjcmVkZW50aWFsXG4gICAgICAgIHJlcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSBjdXJyZW50Q3JlZGVudGlhbElkPVwiY3JlZC0yXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIHNob3cgcGFnZXMgKHJlc2V0IGFuZCByZWJ1aWxkKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBhbmQgVXBkYXRlc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQgYW5kIFVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIGRhdGFMaXN0IHdpdGggcm9vdCBsZXZlbCBwYWdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgbGlzdCwgcGFnZXNNYXAsIHJvb3RQYWdlLCBjaGlsZFBhZ2UxIH0gPSBjcmVhdGVIaWVyYXJjaGljYWxQYWdlcygpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3QsXG4gICAgICAgIHBhZ2VzTWFwLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPbmx5IHJvb3QgbGV2ZWwgcGFnZSBzaG91bGQgYmUgdmlzaWJsZSBpbml0aWFsbHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHJvb3RQYWdlLnBhZ2VfbmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIENoaWxkIHBhZ2VzIHNob3VsZCBub3QgYmUgdmlzaWJsZSB1bnRpbCBleHBhbmRlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dChjaGlsZFBhZ2UxLnBhZ2VfbmFtZSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGRhdGFMaXN0IHdoZW4gZXhwYW5kaW5nIGEgcGFnZSB3aXRoIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCwgcm9vdFBhZ2UsIGNoaWxkUGFnZTEsIGNoaWxkUGFnZTIgfSA9IGNyZWF0ZUhpZXJhcmNoaWNhbFBhZ2VzKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcGFnZXNNYXAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgYW5kIGNsaWNrIHRoZSBleHBhbmQgYXJyb3cgKHVzZXMgaG92ZXI6YmctY29tcG9uZW50cy1idXR0b24tZ2hvc3QtYmctaG92ZXIgY2xhc3MpXG4gICAgICBjb25zdCBhcnJvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJob3ZlcjpiZy1jb21wb25lbnRzLWJ1dHRvbi1naG9zdC1iZy1ob3ZlclwiXScpXG4gICAgICBpZiAoYXJyb3dCdXR0b24pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhhcnJvd0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChyb290UGFnZS5wYWdlX25hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChjaGlsZFBhZ2UxLnBhZ2VfbmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGNoaWxkUGFnZTIucGFnZV9uYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGN1cnJlbnRQcmV2aWV3UGFnZUlkIHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uUHJldmlldyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBhZ2VzID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICAgIG9uUHJldmlldzogbW9ja09uUHJldmlldyxcbiAgICAgICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLnByZXZpZXcnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b25zWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncGFnZS0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc2VhcmNoRGF0YUxpc3Qgd2hlbiBzZWFyY2hWYWx1ZSBpcyBwcmVzZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ0FwcGxlJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJywgcGFnZV9uYW1lOiAnQmFuYW5hJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogcGFnZXMsXG4gICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAocGFnZXMpLFxuICAgICAgICBzZWFyY2hWYWx1ZTogJ0FwcGxlJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gT25seSBwYWdlcyBtYXRjaGluZyBzZWFyY2ggc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIC8vIFVzZSBnZXRBbGxCeVRleHQgc2luY2UgdGhlIHBhZ2UgbmFtZSBhcHBlYXJzIGluIGJvdGggdGl0bGUgZGl2IGFuZCBicmVhZGNydW1ic1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FwcGxlJykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0JhbmFuYScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFNpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlaW5pdGlhbGl6ZSBkYXRhTGlzdCB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2VzID0gW2NyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1BhZ2UgMScgfSldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3Q6IHBhZ2VzLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKHBhZ2VzKSxcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMScsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2hhbmdlIGNyZWRlbnRpYWxcbiAgICAgIHJlcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSBjdXJyZW50Q3JlZGVudGlhbElkPVwiY3JlZC0yXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmlsdGVyIHJvb3QgcGFnZXMgY29ycmVjdGx5IG9uIGluaXRpYWxpemF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCwgcm9vdFBhZ2UsIGNoaWxkUGFnZTEgfSA9IGNyZWF0ZUhpZXJhcmNoaWNhbFBhZ2VzKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcGFnZXNNYXAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE9ubHkgcm9vdCBsZXZlbCBwYWdlcyB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChyb290UGFnZS5wYWdlX25hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KGNoaWxkUGFnZTEucGFnZV9uYW1lKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIHBhZ2VzIHdob3NlIHBhcmVudCBpcyBub3QgaW4gcGFnZXNNYXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvcnBoYW5QYWdlID0gY3JlYXRlTW9ja1BhZ2Uoe1xuICAgICAgICBwYWdlX2lkOiAnb3JwaGFuLXBhZ2UnLFxuICAgICAgICBwYWdlX25hbWU6ICdPcnBoYW4gUGFnZScsXG4gICAgICAgIHBhcmVudF9pZDogJ25vbi1leGlzdGVudC1wYXJlbnQnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW29ycGhhblBhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtvcnBoYW5QYWdlXSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE9ycGhhbiBwYWdlIHNob3VsZCBiZSB2aXNpYmxlIGF0IHJvb3QgbGV2ZWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcnBoYW4gUGFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eSBhbmQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVUb2dnbGUgdGhhdCBleHBhbmRzIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCwgY2hpbGRQYWdlMSwgY2hpbGRQYWdlMiB9ID0gY3JlYXRlSGllcmFyY2hpY2FsUGFnZXMoKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0LFxuICAgICAgICBwYWdlc01hcCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRmluZCBleHBhbmQgYXJyb3cgZm9yIHJvb3QgcGFnZSAoaGFzIFJpQXJyb3dSaWdodFNMaW5lIGljb24pXG4gICAgICBjb25zdCBleHBhbmRBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJob3ZlcjpiZy1jb21wb25lbnRzLWJ1dHRvbi1naG9zdC1iZy1ob3ZlclwiXScpXG4gICAgICBpZiAoZXhwYW5kQXJyb3cpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhleHBhbmRBcnJvdylcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hpbGRyZW4gc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGNoaWxkUGFnZTEucGFnZV9uYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoY2hpbGRQYWdlMi5wYWdlX25hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzdGFibGUgaGFuZGxlVG9nZ2xlIHRoYXQgY29sbGFwc2VzIGRlc2NlbmRhbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCwgY2hpbGRQYWdlMSwgY2hpbGRQYWdlMiB9ID0gY3JlYXRlSGllcmFyY2hpY2FsUGFnZXMoKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0LFxuICAgICAgICBwYWdlc01hcCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRmlyc3QgZXhwYW5kXG4gICAgICBjb25zdCBleHBhbmRBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJob3ZlcjpiZy1jb21wb25lbnRzLWJ1dHRvbi1naG9zdC1iZy1ob3ZlclwiXScpXG4gICAgICBpZiAoZXhwYW5kQXJyb3cpIHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGV4cGFuZEFycm93KVxuICAgICAgICAvLyBUaGVuIGNvbGxhcHNlXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhleHBhbmRBcnJvdylcbiAgICAgIH1cblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hpbGRyZW4gc2hvdWxkIGJlIGhpZGRlbiBhZ2FpblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dChjaGlsZFBhZ2UxLnBhZ2VfbmFtZSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KGNoaWxkUGFnZTIucGFnZV9uYW1lKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVDaGVjayB0aGF0IGFkZHMgcGFnZSBhbmQgZGVzY2VuZGFudHMgdG8gc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCB9ID0gY3JlYXRlSGllcmFyY2hpY2FsUGFnZXMoKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0LFxuICAgICAgICBwYWdlc01hcCxcbiAgICAgICAgb25TZWxlY3Q6IG1vY2tPblNlbGVjdCxcbiAgICAgICAgY2hlY2tlZElkczogbmV3IFNldCgpLFxuICAgICAgICBpc011bHRpcGxlQ2hvaWNlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDaGVjayB0aGUgcm9vdCBwYWdlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0Q2hlY2tib3goKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gb25TZWxlY3Qgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIHRoZSBwYWdlIGFuZCBpdHMgZGVzY2VuZGFudHNcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgY29uc3Qgc2VsZWN0ZWRTZXQgPSBtb2NrT25TZWxlY3QubW9jay5jYWxsc1swXVswXSBhcyBTZXQ8c3RyaW5nPlxuICAgICAgZXhwZWN0KHNlbGVjdGVkU2V0Lmhhcygncm9vdC1wYWdlJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVDaGVjayB0aGF0IHJlbW92ZXMgcGFnZSBhbmQgZGVzY2VuZGFudHMgZnJvbSBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGxpc3QsIHBhZ2VzTWFwIH0gPSBjcmVhdGVIaWVyYXJjaGljYWxQYWdlcygpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3QsXG4gICAgICAgIHBhZ2VzTWFwLFxuICAgICAgICBvblNlbGVjdDogbW9ja09uU2VsZWN0LFxuICAgICAgICBjaGVja2VkSWRzOiBuZXcgU2V0KFsncm9vdC1wYWdlJywgJ2NoaWxkLTEnLCAnY2hpbGQtMicsICdncmFuZGNoaWxkLTEnXSksXG4gICAgICAgIGlzTXVsdGlwbGVDaG9pY2U6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFVuY2hlY2sgdGhlIHJvb3QgcGFnZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldENoZWNrYm94KCkpXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uU2VsZWN0IHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlbXB0eS9yZWR1Y2VkIHNldFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzdGFibGUgaGFuZGxlUHJldmlldyB0aGF0IHVwZGF0ZXMgY3VycmVudFByZXZpZXdQYWdlSWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3ByZXZpZXctcGFnZScgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYWdlXSksXG4gICAgICAgIG9uUHJldmlldzogbW9ja09uUHJldmlldyxcbiAgICAgICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncHJldmlldy1wYWdlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBMb2dpYyBhbmQgRGVwZW5kZW5jaWVzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gTG9naWMgYW5kIERlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgbGlzdE1hcFdpdGhDaGlsZHJlbkFuZERlc2NlbmRhbnRzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgbGlzdCwgcGFnZXNNYXAgfSA9IGNyZWF0ZUhpZXJhcmNoaWNhbFBhZ2VzKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcGFnZXNNYXAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRyZWUgc3RydWN0dXJlIHNob3VsZCBiZSBidWlsdCAodmVyaWZpZWQgYnkgZXhwYW5kIGZ1bmN0aW9uYWxpdHkpXG4gICAgICBjb25zdCBleHBhbmRBcnJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJob3ZlcjpiZy1jb21wb25lbnRzLWJ1dHRvbi1naG9zdC1iZy1ob3ZlclwiXScpXG4gICAgICBleHBlY3QoZXhwYW5kQXJyb3cpLnRvQmVJblRoZURvY3VtZW50KCkgLy8gUm9vdCBwYWdlIGhhcyBjaGlsZHJlblxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlY29tcHV0ZSBsaXN0TWFwV2l0aENoaWxkcmVuQW5kRGVzY2VuZGFudHMgd2hlbiBsaXN0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsTGlzdCA9IFtjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBpbml0aWFsTGlzdCxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChpbml0aWFsTGlzdCksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gVXBkYXRlIHdpdGggbmV3IGxpc3RcbiAgICAgIGNvbnN0IG5ld0xpc3QgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1BhZ2UgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMicsIHBhZ2VfbmFtZTogJ1BhZ2UgMicgfSksXG4gICAgICBdXG4gICAgICByZXJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gbGlzdD17bmV3TGlzdH0gcGFnZXNNYXA9e2NyZWF0ZU1vY2tQYWdlc01hcChuZXdMaXN0KX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBQYWdlIDIgd29uJ3Qgc2hvdyBiZWNhdXNlIGRhdGFMaXN0IHN0YXRlIGhhc24ndCB1cGRhdGVkIChvbmx5IHJlc2V0cyBvbiBjcmVkZW50aWFsSWQgY2hhbmdlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlY29tcHV0ZSBsaXN0TWFwV2l0aENoaWxkcmVuQW5kRGVzY2VuZGFudHMgd2hlbiBwYWdlc01hcCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5pdGlhbExpc3QgPSBbY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnUGFnZSAxJyB9KV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogaW5pdGlhbExpc3QsXG4gICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoaW5pdGlhbExpc3QpLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBVcGRhdGUgcGFnZXNNYXBcbiAgICAgIGNvbnN0IG5ld1BhZ2VzTWFwID0ge1xuICAgICAgICAuLi5jcmVhdGVNb2NrUGFnZXNNYXAoaW5pdGlhbExpc3QpLFxuICAgICAgICAncGFnZS0yJzogeyAuLi5jcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInIH0pLCB3b3Jrc3BhY2VfaWQ6ICd3cy0xJyB9LFxuICAgICAgfVxuICAgICAgcmVyZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IHBhZ2VzTWFwPXtuZXdQYWdlc01hcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWdlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsaXN0IGluIG1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBbXSxcbiAgICAgICAgcGFnZXNNYXA6IHt9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3Iubm9TZWFyY2hSZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVyc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBleHBhbnNpb24gd2hlbiBjbGlja2luZyBhcnJvdyBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IGxpc3QsIHBhZ2VzTWFwLCBjaGlsZFBhZ2UxIH0gPSBjcmVhdGVIaWVyYXJjaGljYWxQYWdlcygpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3QsXG4gICAgICAgIHBhZ2VzTWFwLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBJbml0aWFsbHkgY2hpbGRyZW4gYXJlIGhpZGRlblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dChjaGlsZFBhZ2UxLnBhZ2VfbmFtZSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENsaWNrIHRvIGV4cGFuZFxuICAgICAgY29uc3QgZXhwYW5kQXJyb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiaG92ZXI6YmctY29tcG9uZW50cy1idXR0b24tZ2hvc3QtYmctaG92ZXJcIl0nKVxuICAgICAgaWYgKGV4cGFuZEFycm93KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZXhwYW5kQXJyb3cpXG5cbiAgICAgIC8vIENoaWxkcmVuIGJlY29tZSB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChjaGlsZFBhZ2UxLnBhZ2VfbmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjaGVjay91bmNoZWNrIHBhZ2Ugd2hlbiBjbGlja2luZyBjaGVja2JveCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgb25TZWxlY3Q6IG1vY2tPblNlbGVjdCxcbiAgICAgICAgY2hlY2tlZElkczogbmV3IFNldCgpLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldENoZWNrYm94KCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VsZWN0IHJhZGlvIHdoZW4gY2xpY2tpbmcgaW4gc2luZ2xlIGNob2ljZSBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBvblNlbGVjdDogbW9ja09uU2VsZWN0LFxuICAgICAgICBpc011bHRpcGxlQ2hvaWNlOiBmYWxzZSxcbiAgICAgICAgY2hlY2tlZElkczogbmV3IFNldCgpLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldFJhZGlvKCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgcHJldmlvdXMgc2VsZWN0aW9uIGluIHNpbmdsZSBjaG9pY2UgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBhZ2VzID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICAgIG9uU2VsZWN0OiBtb2NrT25TZWxlY3QsXG4gICAgICAgIGlzTXVsdGlwbGVDaG9pY2U6IGZhbHNlLFxuICAgICAgICBjaGVja2VkSWRzOiBuZXcgU2V0KFsncGFnZS0xJ10pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgcmFkaW9zID0gZ2V0QWxsUmFkaW9zKClcbiAgICAgIGZpcmVFdmVudC5jbGljayhyYWRpb3NbMV0pIC8vIENsaWNrIG9uIHBhZ2UtMlxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgY2xlYXIgcGFnZS0xIGFuZCBzZWxlY3QgcGFnZS0yXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGNvbnN0IHNlbGVjdGVkU2V0ID0gbW9ja09uU2VsZWN0Lm1vY2suY2FsbHNbMF1bMF0gYXMgU2V0PHN0cmluZz5cbiAgICAgIGV4cGVjdChzZWxlY3RlZFNldC5oYXMoJ3BhZ2UtMicpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc2VsZWN0ZWRTZXQuaGFzKCdwYWdlLTEnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIHByZXZpZXcgd2hlbiBjbGlja2luZyBwcmV2aWV3IGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG9uUHJldmlldzogbW9ja09uUHJldmlldyxcbiAgICAgICAgY2FuUHJldmlldzogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncGFnZS0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FzY2FkZSBzZWxlY3Rpb24gaW4gc2VhcmNoIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGxpc3QsIHBhZ2VzTWFwIH0gPSBjcmVhdGVIaWVyYXJjaGljYWxQYWdlcygpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3QsXG4gICAgICAgIHBhZ2VzTWFwLFxuICAgICAgICBvblNlbGVjdDogbW9ja09uU2VsZWN0LFxuICAgICAgICBjaGVja2VkSWRzOiBuZXcgU2V0KCksXG4gICAgICAgIHNlYXJjaFZhbHVlOiAnUm9vdCcsXG4gICAgICAgIGlzTXVsdGlwbGVDaG9pY2U6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0Q2hlY2tib3goKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gT25seSB0aGUgY2xpY2tlZCBwYWdlIHNob3VsZCBiZSBzZWxlY3RlZCAobm8gZGVzY2VuZGFudHMpXG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGNvbnN0IHNlbGVjdGVkU2V0ID0gbW9ja09uU2VsZWN0Lm1vY2suY2FsbHNbMF1bMF0gYXMgU2V0PHN0cmluZz5cbiAgICAgIGV4cGVjdChzZWxlY3RlZFNldC5zaXplKS50b0JlKDEpXG4gICAgICBleHBlY3Qoc2VsZWN0ZWRTZXQuaGFzKCdyb290LXBhZ2UnKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgbGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW10sXG4gICAgICAgIHBhZ2VzTWFwOiB7fSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLm5vU2VhcmNoUmVzdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBwYWdlX2ljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2ljb246IG51bGwgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYWdlXSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdGlvbkljb24gcmVuZGVycyBzdmcgKFJpRmlsZVRleHRMaW5lKSB3aGVuIHBhZ2VfaWNvbiBpcyBudWxsXG4gICAgICBjb25zdCBub3Rpb25JY29uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmgtNS53LTUnKVxuICAgICAgZXhwZWN0KG5vdGlvbkljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZV9pY29uIHdpdGggYWxsIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2Uoe1xuICAgICAgICBwYWdlX2ljb246IHsgdHlwZTogJ2Vtb2ppJywgdXJsOiBudWxsLCBlbW9qaTogJ/Cfk4QnIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBbcGFnZV0sXG4gICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW3BhZ2VdKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm90aW9uSWNvbiByZW5kZXJzIHRoZSBlbW9qaVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ/Cfk4QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzZWFyY2hWYWx1ZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNlYXJjaFZhbHVlOiAnJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmlydHVhbC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHBhZ2UgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfbmFtZTogJ1Rlc3QgPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYWdlXSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBwYWdlIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX25hbWU6ICfmtYvor5XpobXpnaIg8J+UjSDQv9GA0LjQstC10YInIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3Q6IFtwYWdlXSxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChbcGFnZV0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfmtYvor5XpobXpnaIg8J+UjSDQv9GA0LjQstC10YInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgcGFnZSBuYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gJ0EnLnJlcGVhdCg1MDApXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX25hbWU6IGxvbmdOYW1lIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3Q6IFtwYWdlXSxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChbcGFnZV0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkZWVwbHkgbmVzdGVkIGhpZXJhcmNoeScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBDcmVhdGUgNSBsZXZlbHMgZGVlcFxuICAgICAgY29uc3QgcGFnZXM6IERhdGFTb3VyY2VOb3Rpb25QYWdlW10gPSBbXVxuICAgICAgbGV0IHBhcmVudElkID0gJ3Jvb3QnXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7XG4gICAgICAgICAgcGFnZV9pZDogYGxldmVsLSR7aX1gLFxuICAgICAgICAgIHBhZ2VfbmFtZTogYExldmVsICR7aX1gLFxuICAgICAgICAgIHBhcmVudF9pZDogcGFyZW50SWQsXG4gICAgICAgIH0pXG4gICAgICAgIHBhZ2VzLnB1c2gocGFnZSlcbiAgICAgICAgcGFyZW50SWQgPSBwYWdlLnBhZ2VfaWRcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBwYWdlcyxcbiAgICAgICAgcGFnZXNNYXA6IGNyZWF0ZU1vY2tQYWdlc01hcChwYWdlcyksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE9ubHkgcm9vdCBsZXZlbCB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTGV2ZWwgMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdMZXZlbCAxJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBhZ2Ugd2l0aCBtaXNzaW5nIHBhcmVudCByZWZlcmVuY2UgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBQYWdlIHdob3NlIHBhcmVudCBkb2Vzbid0IGV4aXN0IGluIHBhZ2VzTWFwICh2YWxpZCBlZGdlIGNhc2UpXG4gICAgICBjb25zdCBvcnBoYW5QYWdlID0gY3JlYXRlTW9ja1BhZ2Uoe1xuICAgICAgICBwYWdlX2lkOiAnb3JwaGFuJyxcbiAgICAgICAgcGFnZV9uYW1lOiAnT3JwaGFuIFBhZ2UnLFxuICAgICAgICBwYXJlbnRfaWQ6ICdub24tZXhpc3RlbnQtcGFyZW50JyxcbiAgICAgIH0pXG4gICAgICAvLyBDcmVhdGUgcGFnZXNNYXAgd2l0aG91dCB0aGUgcGFyZW50XG4gICAgICBjb25zdCBwYWdlc01hcCA9IGNyZWF0ZU1vY2tQYWdlc01hcChbb3JwaGFuUGFnZV0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGxpc3Q6IFtvcnBoYW5QYWdlXSxcbiAgICAgICAgcGFnZXNNYXAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgdGhlIG9ycGhhbiBwYWdlIGF0IHJvb3QgbGV2ZWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcnBoYW4gUGFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNoZWNrZWRJZHMgU2V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjaGVja2VkSWRzOiBuZXcgU2V0KCkgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gZ2V0Q2hlY2tib3goKVxuICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaXNDaGVja2JveENoZWNrZWQoY2hlY2tib3gpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkaXNhYmxlZFZhbHVlIFNldCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZGlzYWJsZWRWYWx1ZTogbmV3IFNldCgpIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjaGVja2JveCA9IGdldENoZWNrYm94KClcbiAgICAgIGV4cGVjdChjaGVja2JveCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGlzQ2hlY2tib3hEaXNhYmxlZChjaGVja2JveCkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvblByZXZpZXcgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgb25QcmV2aWV3OiB1bmRlZmluZWQsXG4gICAgICAgIGNhblByZXZpZXc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENsaWNrIHNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwYWdlIHdpdGhvdXQgZGVzY2VuZGFudHMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbGVhZlBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdsZWFmJywgcGFnZV9uYW1lOiAnTGVhZiBQYWdlJyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBbbGVhZlBhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtsZWFmUGFnZV0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBObyBleHBhbmQgYXJyb3cgZm9yIGxlYWYgcGFnZXNcbiAgICAgIGNvbnN0IGFycm93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImhvdmVyOmJnLWNvbXBvbmVudHMtYnV0dG9uLWdob3N0LWJnLWhvdmVyXCJdJylcbiAgICAgIGV4cGVjdChhcnJvd0J1dHRvbikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgW3sgY2FuUHJldmlldzogdHJ1ZSwgaXNNdWx0aXBsZUNob2ljZTogdHJ1ZSB9XSxcbiAgICAgIFt7IGNhblByZXZpZXc6IHRydWUsIGlzTXVsdGlwbGVDaG9pY2U6IGZhbHNlIH1dLFxuICAgICAgW3sgY2FuUHJldmlldzogZmFsc2UsIGlzTXVsdGlwbGVDaG9pY2U6IHRydWUgfV0sXG4gICAgICBbeyBjYW5QcmV2aWV3OiBmYWxzZSwgaXNNdWx0aXBsZUNob2ljZTogZmFsc2UgfV0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggcHJvcHMgJW8nLCAocHJvcFZhcmlhdGlvbikgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMocHJvcFZhcmlhdGlvbilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZpcnR1YWwtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBpZiAocHJvcFZhcmlhdGlvbi5jYW5QcmV2aWV3KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLnByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZWxzZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24uZGF0YVNvdXJjZS5ub3Rpb24uc2VsZWN0b3IucHJldmlldycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBpZiAocHJvcFZhcmlhdGlvbi5pc011bHRpcGxlQ2hvaWNlKVxuICAgICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZWxzZVxuICAgICAgICBleHBlY3QoZ2V0UmFkaW8oKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgZGVmYXVsdCBwcm9wIHZhbHVlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1pbmltYWxQcm9wczogUGFnZVNlbGVjdG9yUHJvcHMgPSB7XG4gICAgICAgIGNoZWNrZWRJZHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGlzYWJsZWRWYWx1ZTogbmV3IFNldCgpLFxuICAgICAgICBzZWFyY2hWYWx1ZTogJycsXG4gICAgICAgIHBhZ2VzTWFwOiBjcmVhdGVNb2NrUGFnZXNNYXAoW2NyZWF0ZU1vY2tQYWdlKCldKSxcbiAgICAgICAgbGlzdDogW2NyZWF0ZU1vY2tQYWdlKCldLFxuICAgICAgICBvblNlbGVjdDogdmkuZm4oKSxcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMScsXG4gICAgICAgIC8vIGNhblByZXZpZXcgZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAvLyBpc011bHRpcGxlQ2hvaWNlIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ubWluaW1hbFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVmYXVsdHMgc2hvdWxkIGJlIGFwcGxpZWRcbiAgICAgIGV4cGVjdChnZXRDaGVja2JveCgpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLnByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFV0aWxzIEZ1bmN0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXRpbHMgLSByZWN1cnNpdmVQdXNoSW5QYXJlbnREZXNjZW5kYW50cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJ1aWxkIHRyZWUgc3RydWN0dXJlIGZvciBzaW1wbGUgcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhcmVudCA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhcmVudCcsIHBhZ2VfbmFtZTogJ1BhcmVudCcsIHBhcmVudF9pZDogJ3Jvb3QnIH0pXG4gICAgICBjb25zdCBjaGlsZCA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ2NoaWxkJywgcGFnZV9uYW1lOiAnQ2hpbGQnLCBwYXJlbnRfaWQ6ICdwYXJlbnQnIH0pXG4gICAgICBjb25zdCBwYWdlc01hcCA9IGNyZWF0ZU1vY2tQYWdlc01hcChbcGFyZW50LCBjaGlsZF0pXG4gICAgICBjb25zdCBsaXN0VHJlZU1hcDogTm90aW9uUGFnZVRyZWVNYXAgPSB7fVxuXG4gICAgICAvLyBDcmVhdGUgaW5pdGlhbCBlbnRyeSBmb3IgY2hpbGRcbiAgICAgIGNvbnN0IGNoaWxkRW50cnk6IE5vdGlvblBhZ2VUcmVlSXRlbSA9IHtcbiAgICAgICAgLi4uY2hpbGQsXG4gICAgICAgIGNoaWxkcmVuOiBuZXcgU2V0KCksXG4gICAgICAgIGRlc2NlbmRhbnRzOiBuZXcgU2V0KCksXG4gICAgICAgIGRlcHRoOiAwLFxuICAgICAgICBhbmNlc3RvcnM6IFtdLFxuICAgICAgfVxuICAgICAgbGlzdFRyZWVNYXBbY2hpbGQucGFnZV9pZF0gPSBjaGlsZEVudHJ5XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVjdXJzaXZlUHVzaEluUGFyZW50RGVzY2VuZGFudHMocGFnZXNNYXAsIGxpc3RUcmVlTWFwLCBjaGlsZEVudHJ5LCBjaGlsZEVudHJ5KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChsaXN0VHJlZU1hcC5wYXJlbnQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChsaXN0VHJlZU1hcC5wYXJlbnQuY2hpbGRyZW4uaGFzKCdjaGlsZCcpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QobGlzdFRyZWVNYXAucGFyZW50LmRlc2NlbmRhbnRzLmhhcygnY2hpbGQnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGNoaWxkRW50cnkuZGVwdGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChjaGlsZEVudHJ5LmFuY2VzdG9ycykudG9Db250YWluKCdQYXJlbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByb290IGxldmVsIHBhZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgcm9vdFBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdyb290LXBhZ2UnLCBwYXJlbnRfaWQ6ICdyb290JyB9KVxuICAgICAgY29uc3QgcGFnZXNNYXAgPSBjcmVhdGVNb2NrUGFnZXNNYXAoW3Jvb3RQYWdlXSlcbiAgICAgIGNvbnN0IGxpc3RUcmVlTWFwOiBOb3Rpb25QYWdlVHJlZU1hcCA9IHt9XG5cbiAgICAgIGNvbnN0IHJvb3RFbnRyeTogTm90aW9uUGFnZVRyZWVJdGVtID0ge1xuICAgICAgICAuLi5yb290UGFnZSxcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoKSxcbiAgICAgICAgZGVzY2VuZGFudHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGFuY2VzdG9yczogW10sXG4gICAgICB9XG4gICAgICBsaXN0VHJlZU1hcFtyb290UGFnZS5wYWdlX2lkXSA9IHJvb3RFbnRyeVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlY3Vyc2l2ZVB1c2hJblBhcmVudERlc2NlbmRhbnRzKHBhZ2VzTWFwLCBsaXN0VHJlZU1hcCwgcm9vdEVudHJ5LCByb290RW50cnkpXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHBhcmVudCBzaG91bGQgYmUgY3JlYXRlZCBmb3Igcm9vdCBsZXZlbFxuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGxpc3RUcmVlTWFwKSkudG9IYXZlTGVuZ3RoKDEpXG4gICAgICBleHBlY3Qocm9vdEVudHJ5LmRlcHRoKS50b0JlKDApXG4gICAgICBleHBlY3Qocm9vdEVudHJ5LmFuY2VzdG9ycykudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgcGFyZW50IGluIHBhZ2VzTWFwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3JwaGFuID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAnb3JwaGFuJywgcGFyZW50X2lkOiAnbWlzc2luZy1wYXJlbnQnIH0pXG4gICAgICBjb25zdCBwYWdlc01hcCA9IGNyZWF0ZU1vY2tQYWdlc01hcChbb3JwaGFuXSlcbiAgICAgIGNvbnN0IGxpc3RUcmVlTWFwOiBOb3Rpb25QYWdlVHJlZU1hcCA9IHt9XG5cbiAgICAgIGNvbnN0IG9ycGhhbkVudHJ5OiBOb3Rpb25QYWdlVHJlZUl0ZW0gPSB7XG4gICAgICAgIC4uLm9ycGhhbixcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoKSxcbiAgICAgICAgZGVzY2VuZGFudHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGFuY2VzdG9yczogW10sXG4gICAgICB9XG4gICAgICBsaXN0VHJlZU1hcFtvcnBoYW4ucGFnZV9pZF0gPSBvcnBoYW5FbnRyeVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlY3Vyc2l2ZVB1c2hJblBhcmVudERlc2NlbmRhbnRzKHBhZ2VzTWFwLCBsaXN0VHJlZU1hcCwgb3JwaGFuRW50cnksIG9ycGhhbkVudHJ5KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyZWF0ZSBwYXJlbnQgZW50cnkgZm9yIG1pc3NpbmcgcGFyZW50XG4gICAgICBleHBlY3QobGlzdFRyZWVNYXBbJ21pc3NpbmctcGFyZW50J10pLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHBhcmVudF9pZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhZ2UgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlJywgcGFyZW50X2lkOiAnJyB9KVxuICAgICAgY29uc3QgcGFnZXNNYXAgPSBjcmVhdGVNb2NrUGFnZXNNYXAoW3BhZ2VdKVxuICAgICAgY29uc3QgbGlzdFRyZWVNYXA6IE5vdGlvblBhZ2VUcmVlTWFwID0ge31cblxuICAgICAgY29uc3QgcGFnZUVudHJ5OiBOb3Rpb25QYWdlVHJlZUl0ZW0gPSB7XG4gICAgICAgIC4uLnBhZ2UsXG4gICAgICAgIGNoaWxkcmVuOiBuZXcgU2V0KCksXG4gICAgICAgIGRlc2NlbmRhbnRzOiBuZXcgU2V0KCksXG4gICAgICAgIGRlcHRoOiAwLFxuICAgICAgICBhbmNlc3RvcnM6IFtdLFxuICAgICAgfVxuICAgICAgbGlzdFRyZWVNYXBbcGFnZS5wYWdlX2lkXSA9IHBhZ2VFbnRyeVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlY3Vyc2l2ZVB1c2hJblBhcmVudERlc2NlbmRhbnRzKHBhZ2VzTWFwLCBsaXN0VHJlZU1hcCwgcGFnZUVudHJ5LCBwYWdlRW50cnkpXG5cbiAgICAgIC8vIEFzc2VydCAtIEVhcmx5IHJldHVybiwgbm8gY2hhbmdlc1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGxpc3RUcmVlTWFwKSkudG9IYXZlTGVuZ3RoKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjdW11bGF0ZSBkZXB0aCBmb3IgZGVlcGx5IG5lc3RlZCBwYWdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSAzIGxldmVscyBkZWVwXG4gICAgICBjb25zdCBsZXZlbDAgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdsMCcsIHBhZ2VfbmFtZTogJ0xldmVsIDAnLCBwYXJlbnRfaWQ6ICdyb290JyB9KVxuICAgICAgY29uc3QgbGV2ZWwxID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAnbDEnLCBwYWdlX25hbWU6ICdMZXZlbCAxJywgcGFyZW50X2lkOiAnbDAnIH0pXG4gICAgICBjb25zdCBsZXZlbDIgPSBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdsMicsIHBhZ2VfbmFtZTogJ0xldmVsIDInLCBwYXJlbnRfaWQ6ICdsMScgfSlcbiAgICAgIGNvbnN0IHBhZ2VzTWFwID0gY3JlYXRlTW9ja1BhZ2VzTWFwKFtsZXZlbDAsIGxldmVsMSwgbGV2ZWwyXSlcbiAgICAgIGNvbnN0IGxpc3RUcmVlTWFwOiBOb3Rpb25QYWdlVHJlZU1hcCA9IHt9XG5cbiAgICAgIC8vIEFkZCBhbGwgbGV2ZWxzXG4gICAgICBjb25zdCBsMEVudHJ5OiBOb3Rpb25QYWdlVHJlZUl0ZW0gPSB7XG4gICAgICAgIC4uLmxldmVsMCxcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoKSxcbiAgICAgICAgZGVzY2VuZGFudHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGFuY2VzdG9yczogW10sXG4gICAgICB9XG4gICAgICBjb25zdCBsMUVudHJ5OiBOb3Rpb25QYWdlVHJlZUl0ZW0gPSB7XG4gICAgICAgIC4uLmxldmVsMSxcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoKSxcbiAgICAgICAgZGVzY2VuZGFudHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGFuY2VzdG9yczogW10sXG4gICAgICB9XG4gICAgICBjb25zdCBsMkVudHJ5OiBOb3Rpb25QYWdlVHJlZUl0ZW0gPSB7XG4gICAgICAgIC4uLmxldmVsMixcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoKSxcbiAgICAgICAgZGVzY2VuZGFudHM6IG5ldyBTZXQoKSxcbiAgICAgICAgZGVwdGg6IDAsXG4gICAgICAgIGFuY2VzdG9yczogW10sXG4gICAgICB9XG5cbiAgICAgIGxpc3RUcmVlTWFwW2xldmVsMC5wYWdlX2lkXSA9IGwwRW50cnlcbiAgICAgIGxpc3RUcmVlTWFwW2xldmVsMS5wYWdlX2lkXSA9IGwxRW50cnlcbiAgICAgIGxpc3RUcmVlTWFwW2xldmVsMi5wYWdlX2lkXSA9IGwyRW50cnlcblxuICAgICAgLy8gQWN0IC0gUHJvY2VzcyBmcm9tIGxlYWYgdG8gcm9vdFxuICAgICAgcmVjdXJzaXZlUHVzaEluUGFyZW50RGVzY2VuZGFudHMocGFnZXNNYXAsIGxpc3RUcmVlTWFwLCBsMkVudHJ5LCBsMkVudHJ5KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChsMkVudHJ5LmRlcHRoKS50b0JlKDIpXG4gICAgICBleHBlY3QobDJFbnRyeS5hbmNlc3RvcnMpLnRvRXF1YWwoWydMZXZlbCAwJywgJ0xldmVsIDEnXSlcbiAgICAgIGV4cGVjdChsaXN0VHJlZU1hcC5sMS5jaGlsZHJlbi5oYXMoJ2wyJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChsaXN0VHJlZU1hcC5sMC5kZXNjZW5kYW50cy5oYXMoJ2wyJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZXhpc3RpbmcgcGFyZW50IGVudHJ5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFyZW50ID0gY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFyZW50JywgcGFnZV9uYW1lOiAnUGFyZW50JywgcGFyZW50X2lkOiAncm9vdCcgfSlcbiAgICAgIGNvbnN0IGNoaWxkMSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ2NoaWxkMScsIHBhcmVudF9pZDogJ3BhcmVudCcgfSlcbiAgICAgIGNvbnN0IGNoaWxkMiA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ2NoaWxkMicsIHBhcmVudF9pZDogJ3BhcmVudCcgfSlcbiAgICAgIGNvbnN0IHBhZ2VzTWFwID0gY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYXJlbnQsIGNoaWxkMSwgY2hpbGQyXSlcbiAgICAgIGNvbnN0IGxpc3RUcmVlTWFwOiBOb3Rpb25QYWdlVHJlZU1hcCA9IHt9XG5cbiAgICAgIC8vIFByZS1jcmVhdGUgcGFyZW50IGVudHJ5XG4gICAgICBsaXN0VHJlZU1hcC5wYXJlbnQgPSB7XG4gICAgICAgIC4uLnBhcmVudCxcbiAgICAgICAgY2hpbGRyZW46IG5ldyBTZXQoWydjaGlsZDEnXSksXG4gICAgICAgIGRlc2NlbmRhbnRzOiBuZXcgU2V0KFsnY2hpbGQxJ10pLFxuICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgYW5jZXN0b3JzOiBbXSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGQyRW50cnk6IE5vdGlvblBhZ2VUcmVlSXRlbSA9IHtcbiAgICAgICAgLi4uY2hpbGQyLFxuICAgICAgICBjaGlsZHJlbjogbmV3IFNldCgpLFxuICAgICAgICBkZXNjZW5kYW50czogbmV3IFNldCgpLFxuICAgICAgICBkZXB0aDogMCxcbiAgICAgICAgYW5jZXN0b3JzOiBbXSxcbiAgICAgIH1cbiAgICAgIGxpc3RUcmVlTWFwW2NoaWxkMi5wYWdlX2lkXSA9IGNoaWxkMkVudHJ5XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVjdXJzaXZlUHVzaEluUGFyZW50RGVzY2VuZGFudHMocGFnZXNNYXAsIGxpc3RUcmVlTWFwLCBjaGlsZDJFbnRyeSwgY2hpbGQyRW50cnkpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBhZGQgY2hpbGQyIHRvIGV4aXN0aW5nIHBhcmVudFxuICAgICAgZXhwZWN0KGxpc3RUcmVlTWFwLnBhcmVudC5jaGlsZHJlbi5oYXMoJ2NoaWxkMScpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QobGlzdFRyZWVNYXAucGFyZW50LmNoaWxkcmVuLmhhcygnY2hpbGQyJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChsaXN0VHJlZU1hcC5wYXJlbnQuZGVzY2VuZGFudHMuaGFzKCdjaGlsZDEnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGxpc3RUcmVlTWFwLnBhcmVudC5kZXNjZW5kYW50cy5oYXMoJ2NoaWxkMicpKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSXRlbSBDb21wb25lbnQgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJdGVtIENvbXBvbmVudCBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpdGVtIHdpdGggY29ycmVjdCBzdHlsaW5nIGZvciBwcmV2aWV3IHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1Rlc3QgUGFnZScgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdDogW3BhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtwYWdlXSksXG4gICAgICAgIGNhblByZXZpZXc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENsaWNrIHByZXZpZXcgdG8gc2V0IGN1cnJlbnRQcmV2aWV3UGFnZUlkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLmRhdGFTb3VyY2Uubm90aW9uLnNlbGVjdG9yLnByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gSXRlbSBzaG91bGQgaGF2ZSBwcmV2aWV3IHN0eWxpbmcgY2xhc3NcbiAgICAgIGNvbnN0IGl0ZW1Db250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFBhZ2UnKS5jbG9zZXN0KCdbY2xhc3MqPVwiZ3JvdXBcIl0nKVxuICAgICAgZXhwZWN0KGl0ZW1Db250YWluZXIpLnRvSGF2ZUNsYXNzKCdiZy1zdGF0ZS1iYXNlLWhvdmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGFycm93IGZvciBwYWdlcyB3aXRoIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBsaXN0LCBwYWdlc01hcCB9ID0gY3JlYXRlSGllcmFyY2hpY2FsUGFnZXMoKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0LFxuICAgICAgICBwYWdlc01hcCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQYWdlU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUm9vdCBwYWdlIHNob3VsZCBoYXZlIGV4cGFuZCBhcnJvd1xuICAgICAgY29uc3QgYXJyb3dDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiaG92ZXI6YmctY29tcG9uZW50cy1idXR0b24tZ2hvc3QtYmctaG92ZXJcIl0nKVxuICAgICAgZXhwZWN0KGFycm93Q29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgYXJyb3cgZm9yIGxlYWYgcGFnZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsZWFmUGFnZSA9IGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ2xlYWYnLCBwYWdlX25hbWU6ICdMZWFmJyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBsaXN0OiBbbGVhZlBhZ2VdLFxuICAgICAgICBwYWdlc01hcDogY3JlYXRlTW9ja1BhZ2VzTWFwKFtsZWFmUGFnZV0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBhZ2VTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBObyBleHBhbmQgYXJyb3cgZm9yIGxlYWYgcGFnZXNcbiAgICAgIGNvbnN0IGFycm93Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImhvdmVyOmJnLWNvbXBvbmVudHMtYnV0dG9uLWdob3N0LWJnLWhvdmVyXCJdJylcbiAgICAgIGV4cGVjdChhcnJvd0NvbnRhaW5lcikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIGFycm93cyBpbiBzZWFyY2ggbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgbGlzdCwgcGFnZXNNYXAgfSA9IGNyZWF0ZUhpZXJhcmNoaWNhbFBhZ2VzKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbGlzdCxcbiAgICAgICAgcGFnZXNNYXAsXG4gICAgICAgIHNlYXJjaFZhbHVlOiAnUm9vdCcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGFnZVNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIGV4cGFuZCBhcnJvd3MgaW4gc2VhcmNoIG1vZGUgKHJlbmRlckFycm93IHJldHVybnMgbnVsbCB3aGVuIHNlYXJjaFZhbHVlKVxuICAgICAgLy8gVGhlIGFycm93cyBhcmUgb25seSBzaG93biB3aGVuICFzZWFyY2hWYWx1ZVxuICAgICAgY29uc3QgYXJyb3dDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiaG92ZXI6YmctY29tcG9uZW50cy1idXR0b24tZ2hvc3QtYmctaG92ZXJcIl0nKVxuICAgICAgZXhwZWN0KGFycm93Q29udGFpbmVyKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19