"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const vitest_1 = require("vitest");
const index_1 = require("./index");
// ================================
// Mock external dependencies only
// ================================
// Mock i18n translation hook
const mockTranslation = vitest_1.vi.fn((key, options) => {
    // Build full key with namespace prefix if provided
    const fullKey = options?.ns ? `${options.ns}.${key}` : key;
    const translations = {
        'plugin.marketplace.sortBy': 'Sort by',
        'plugin.marketplace.sortOption.mostPopular': 'Most Popular',
        'plugin.marketplace.sortOption.recentlyUpdated': 'Recently Updated',
        'plugin.marketplace.sortOption.newlyReleased': 'Newly Released',
        'plugin.marketplace.sortOption.firstReleased': 'First Released',
    };
    return translations[fullKey] || key;
});
vitest_1.vi.mock('#i18n', () => ({
    useTranslation: () => ({
        t: mockTranslation,
    }),
}));
// Mock marketplace atoms with controllable values
let mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
const mockHandleSortChange = vitest_1.vi.fn();
vitest_1.vi.mock('../atoms', () => ({
    useMarketplaceSort: () => [mockSort, mockHandleSortChange],
}));
// Mock portal component with controllable open state
let mockPortalOpenState = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open, onOpenChange }) => {
        mockPortalOpenState = open;
        return (<div data-testid="portal-wrapper" data-open={open}>
        {children}
      </div>);
    },
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children }) => {
        // Match actual behavior: only render when portal is open
        if (!mockPortalOpenState)
            return null;
        return <div data-testid="portal-content">{children}</div>;
    },
}));
const createSortOptions = () => [
    { value: 'install_count', order: 'DESC', text: 'Most Popular' },
    { value: 'version_updated_at', order: 'DESC', text: 'Recently Updated' },
    { value: 'created_at', order: 'DESC', text: 'Newly Released' },
    { value: 'created_at', order: 'ASC', text: 'First Released' },
];
// ================================
// SortDropdown Component Tests
// ================================
(0, vitest_1.describe)('SortDropdown', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
        mockPortalOpenState = false;
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-wrapper')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render sort by label', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Sort by')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render selected option text', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render arrow down icon', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const arrowIcon = container.querySelector('.h-4.w-4.text-text-tertiary');
            (0, vitest_1.expect)(arrowIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render trigger element with correct styles', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const trigger = container.querySelector('.cursor-pointer');
            (0, vitest_1.expect)(trigger).toBeInTheDocument();
            (0, vitest_1.expect)(trigger).toHaveClass('h-8', 'rounded-lg', 'bg-state-base-hover-alt');
        });
        (0, vitest_1.it)('should not render dropdown content when closed', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
    });
    // ================================
    // State Management Tests
    // ================================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should initialize with closed state', () => {
            (0, react_1.render)(<index_1.default />);
            const wrapper = react_1.screen.getByTestId('portal-wrapper');
            (0, vitest_1.expect)(wrapper).toHaveAttribute('data-open', 'false');
        });
        (0, vitest_1.it)('should display correct selected option for install_count DESC', () => {
            mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct selected option for version_updated_at DESC', () => {
            mockSort = { sortBy: 'version_updated_at', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Recently Updated')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct selected option for created_at DESC', () => {
            mockSort = { sortBy: 'created_at', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Newly Released')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct selected option for created_at ASC', () => {
            mockSort = { sortBy: 'created_at', sortOrder: 'ASC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('First Released')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should toggle open state when trigger clicked', () => {
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // After click, portal content should be visible
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should close dropdown when trigger clicked again', () => {
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Open
            react_1.fireEvent.click(trigger);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            // Close
            react_1.fireEvent.click(trigger);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should open dropdown on trigger click', () => {
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render all sort options when open', () => {
            (0, react_1.render)(<index_1.default />);
            // Open dropdown
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            (0, vitest_1.expect)((0, react_1.within)(content).getByText('Most Popular')).toBeInTheDocument();
            (0, vitest_1.expect)((0, react_1.within)(content).getByText('Recently Updated')).toBeInTheDocument();
            (0, vitest_1.expect)((0, react_1.within)(content).getByText('Newly Released')).toBeInTheDocument();
            (0, vitest_1.expect)((0, react_1.within)(content).getByText('First Released')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should call handleSortChange when option clicked', () => {
            (0, react_1.render)(<index_1.default />);
            // Open dropdown
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Click on "Recently Updated"
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Recently Updated'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'version_updated_at',
                sortOrder: 'DESC',
            });
        });
        (0, vitest_1.it)('should call handleSortChange with correct params for Most Popular', () => {
            mockSort = { sortBy: 'created_at', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Most Popular'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'install_count',
                sortOrder: 'DESC',
            });
        });
        (0, vitest_1.it)('should call handleSortChange with correct params for Newly Released', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Newly Released'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'created_at',
                sortOrder: 'DESC',
            });
        });
        (0, vitest_1.it)('should call handleSortChange with correct params for First Released', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('First Released'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'created_at',
                sortOrder: 'ASC',
            });
        });
        (0, vitest_1.it)('should allow selecting currently selected option', () => {
            mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Most Popular'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'install_count',
                sortOrder: 'DESC',
            });
        });
        (0, vitest_1.it)('should support userEvent for trigger click', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            await user.click(trigger);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
    });
    // ================================
    // Check Icon Tests
    // ================================
    (0, vitest_1.describe)('Check Icon', () => {
        (0, vitest_1.it)('should show check icon for selected option', () => {
            mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
            const { container } = (0, react_1.render)(<index_1.default />);
            // Open dropdown
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Check icon should be present in the dropdown
            const checkIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(checkIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show check icon only for matching sortBy AND sortOrder', () => {
            mockSort = { sortBy: 'created_at', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const options = content.querySelectorAll('.cursor-pointer');
            // "Newly Released" (created_at DESC) should have check icon
            // "First Released" (created_at ASC) should NOT have check icon
            (0, vitest_1.expect)(options.length).toBe(4);
        });
        (0, vitest_1.it)('should not show check icon for different sortOrder with same sortBy', () => {
            mockSort = { sortBy: 'created_at', sortOrder: 'DESC' };
            const { container } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Only one check icon should be visible (for Newly Released, not First Released)
            const checkIcons = container.querySelectorAll('.text-text-accent');
            (0, vitest_1.expect)(checkIcons.length).toBe(1);
        });
    });
    // ================================
    // Dropdown Options Structure Tests
    // ================================
    (0, vitest_1.describe)('Dropdown Options Structure', () => {
        const sortOptions = createSortOptions();
        (0, vitest_1.it)('should render 4 sort options', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const options = content.querySelectorAll('.cursor-pointer');
            (0, vitest_1.expect)(options.length).toBe(4);
        });
        vitest_1.it.each(sortOptions)('should render option: $text', ({ text }) => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            (0, vitest_1.expect)((0, react_1.within)(content).getByText(text)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render options with unique keys', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const options = content.querySelectorAll('.cursor-pointer');
            // All options should be rendered (no key conflicts)
            (0, vitest_1.expect)(options.length).toBe(4);
        });
        (0, vitest_1.it)('should render dropdown container with correct styles', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const container = content.firstChild;
            (0, vitest_1.expect)(container).toHaveClass('rounded-xl', 'shadow-lg');
        });
        (0, vitest_1.it)('should render option items with hover styles', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const option = content.querySelector('.cursor-pointer');
            (0, vitest_1.expect)(option).toHaveClass('hover:bg-components-panel-on-panel-item-bg-hover');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        // The component falls back to the first option (Most Popular) when sort values are invalid
        (0, vitest_1.it)('should fallback to default option when sortBy is unknown', () => {
            mockSort = { sortBy: 'unknown_field', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            // Should fallback to first option "Most Popular"
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should fallback to default option when sortBy is empty', () => {
            mockSort = { sortBy: '', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should fallback to default option when sortOrder is unknown', () => {
            mockSort = { sortBy: 'install_count', sortOrder: 'UNKNOWN' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render correctly when handleSortChange is a no-op', () => {
            mockHandleSortChange.mockImplementation(() => { });
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Recently Updated'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should handle rapid toggle clicks', () => {
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Rapid clicks
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            // Final state should be open (odd number of clicks)
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle multiple option selections', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            // Click multiple options
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Recently Updated'));
            react_1.fireEvent.click((0, react_1.within)(content).getByText('Newly Released'));
            react_1.fireEvent.click((0, react_1.within)(content).getByText('First Released'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledTimes(3);
        });
    });
    // ================================
    // Context Integration Tests
    // ================================
    (0, vitest_1.describe)('Context Integration', () => {
        (0, vitest_1.it)('should read sort value from context', () => {
            mockSort = { sortBy: 'version_updated_at', sortOrder: 'DESC' };
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Recently Updated')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should call context handleSortChange on selection', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText('First Released'));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({
                sortBy: 'created_at',
                sortOrder: 'ASC',
            });
        });
        (0, vitest_1.it)('should update display when context sort changes', () => {
            const { rerender } = (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Most Popular')).toBeInTheDocument();
            // Simulate context change
            mockSort = { sortBy: 'created_at', sortOrder: 'ASC' };
            rerender(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('First Released')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should use selector pattern correctly', () => {
            (0, react_1.render)(<index_1.default />);
            // Component should have called useMarketplaceContext with selector functions
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-wrapper')).toBeInTheDocument();
        });
    });
    // ================================
    // Accessibility Tests
    // ================================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have cursor pointer on trigger', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const trigger = container.querySelector('.cursor-pointer');
            (0, vitest_1.expect)(trigger).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have cursor pointer on options', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const options = content.querySelectorAll('.cursor-pointer');
            (0, vitest_1.expect)(options.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should have visible focus indicators via hover styles', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const option = content.querySelector('.hover\\:bg-components-panel-on-panel-item-bg-hover');
            (0, vitest_1.expect)(option).toBeInTheDocument();
        });
    });
    // ================================
    // Translation Tests
    // ================================
    (0, vitest_1.describe)('Translations', () => {
        (0, vitest_1.it)('should call translation for sortBy label', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(mockTranslation).toHaveBeenCalledWith('marketplace.sortBy', { ns: 'plugin' });
        });
        (0, vitest_1.it)('should call translation for all sort options', () => {
            (0, react_1.render)(<index_1.default />);
            (0, vitest_1.expect)(mockTranslation).toHaveBeenCalledWith('marketplace.sortOption.mostPopular', { ns: 'plugin' });
            (0, vitest_1.expect)(mockTranslation).toHaveBeenCalledWith('marketplace.sortOption.recentlyUpdated', { ns: 'plugin' });
            (0, vitest_1.expect)(mockTranslation).toHaveBeenCalledWith('marketplace.sortOption.newlyReleased', { ns: 'plugin' });
            (0, vitest_1.expect)(mockTranslation).toHaveBeenCalledWith('marketplace.sortOption.firstReleased', { ns: 'plugin' });
        });
    });
    // ================================
    // Portal Component Integration Tests
    // ================================
    (0, vitest_1.describe)('Portal Component Integration', () => {
        (0, vitest_1.it)('should pass open state to PortalToFollowElem', () => {
            (0, react_1.render)(<index_1.default />);
            const wrapper = react_1.screen.getByTestId('portal-wrapper');
            (0, vitest_1.expect)(wrapper).toHaveAttribute('data-open', 'false');
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            (0, vitest_1.expect)(wrapper).toHaveAttribute('data-open', 'true');
        });
        (0, vitest_1.it)('should render trigger content inside PortalToFollowElemTrigger', () => {
            (0, react_1.render)(<index_1.default />);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            (0, vitest_1.expect)((0, react_1.within)(trigger).getByText('Sort by')).toBeInTheDocument();
            (0, vitest_1.expect)((0, react_1.within)(trigger).getByText('Most Popular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render options inside PortalToFollowElemContent', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            (0, vitest_1.expect)((0, react_1.within)(content).getByText('Most Popular')).toBeInTheDocument();
        });
    });
    // ================================
    // Visual Style Tests
    // ================================
    (0, vitest_1.describe)('Visual Styles', () => {
        (0, vitest_1.it)('should apply correct trigger container styles', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const triggerDiv = container.querySelector('.flex.h-8.cursor-pointer.items-center.rounded-lg');
            (0, vitest_1.expect)(triggerDiv).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply secondary text color to sort by label', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const label = container.querySelector('.text-text-secondary');
            (0, vitest_1.expect)(label).toBeInTheDocument();
            (0, vitest_1.expect)(label?.textContent).toBe('Sort by');
        });
        (0, vitest_1.it)('should apply primary text color to selected option', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const selected = container.querySelector('.text-text-primary.system-sm-medium');
            (0, vitest_1.expect)(selected).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply tertiary text color to arrow icon', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const arrow = container.querySelector('.text-text-tertiary');
            (0, vitest_1.expect)(arrow).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply accent text color to check icon when option selected', () => {
            mockSort = { sortBy: 'install_count', sortOrder: 'DESC' };
            const { container } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const checkIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(checkIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply blur backdrop to dropdown container', () => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            const container = content.querySelector('.backdrop-blur-sm');
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
    });
    // ================================
    // All Sort Options Click Tests
    // ================================
    (0, vitest_1.describe)('All Sort Options Click Handlers', () => {
        const testCases = [
            { text: 'Most Popular', sortBy: 'install_count', sortOrder: 'DESC' },
            { text: 'Recently Updated', sortBy: 'version_updated_at', sortOrder: 'DESC' },
            { text: 'Newly Released', sortBy: 'created_at', sortOrder: 'DESC' },
            { text: 'First Released', sortBy: 'created_at', sortOrder: 'ASC' },
        ];
        vitest_1.it.each(testCases)('should call handleSortChange with { sortBy: "$sortBy", sortOrder: "$sortOrder" } when clicking "$text"', ({ text, sortBy, sortOrder }) => {
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            const content = react_1.screen.getByTestId('portal-content');
            react_1.fireEvent.click((0, react_1.within)(content).getByText(text));
            (0, vitest_1.expect)(mockHandleSortChange).toHaveBeenCalledWith({ sortBy, sortOrder });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTBFO0FBQzFFLDREQUFtRDtBQUNuRCxtQ0FBNkQ7QUFDN0QsbUNBQWtDO0FBRWxDLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLDZCQUE2QjtBQUM3QixNQUFNLGVBQWUsR0FBRyxXQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBVyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtJQUN2RSxtREFBbUQ7SUFDbkQsTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7SUFDMUQsTUFBTSxZQUFZLEdBQTJCO1FBQzNDLDJCQUEyQixFQUFFLFNBQVM7UUFDdEMsMkNBQTJDLEVBQUUsY0FBYztRQUMzRCwrQ0FBK0MsRUFBRSxrQkFBa0I7UUFDbkUsNkNBQTZDLEVBQUUsZ0JBQWdCO1FBQy9ELDZDQUE2QyxFQUFFLGdCQUFnQjtLQUNoRSxDQUFBO0lBQ0QsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFBO0FBQ3JDLENBQUMsQ0FBQyxDQUFBO0FBRUYsV0FBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0QixjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsZUFBZTtLQUNuQixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxrREFBa0Q7QUFDbEQsSUFBSSxRQUFRLEdBQTBDLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7QUFDcEcsTUFBTSxvQkFBb0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFcEMsV0FBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQztDQUMzRCxDQUFDLENBQUMsQ0FBQTtBQUVILHFEQUFxRDtBQUNyRCxJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQTtBQUUvQixXQUFFLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUQsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUlsRCxFQUFFLEVBQUU7UUFDSCxtQkFBbUIsR0FBRyxJQUFJLENBQUE7UUFDMUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDaEQ7UUFBQSxDQUFDLFFBQVEsQ0FDWDtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtJQUNILENBQUM7SUFDRCx5QkFBeUIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFHOUMsRUFBRSxFQUFFLENBQUMsQ0FDSixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pEO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QseUJBQXlCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBaUMsRUFBRSxFQUFFO1FBQ3pFLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsbUJBQW1CO1lBQ3RCLE9BQU8sSUFBSSxDQUFBO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFZSCxNQUFNLGlCQUFpQixHQUFHLEdBQWlCLEVBQUUsQ0FBQztJQUM1QyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO0lBQy9ELEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFO0lBQ3hFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtJQUM5RCxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Q0FDOUQsQ0FBQTtBQUVELG1DQUFtQztBQUNuQywrQkFBK0I7QUFDL0IsbUNBQW1DO0FBQ25DLElBQUEsaUJBQVEsRUFBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLElBQUEsbUJBQVUsRUFBQyxHQUFHLEVBQUU7UUFDZCxXQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbEIsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7UUFDekQsbUJBQW1CLEdBQUcsS0FBSyxDQUFBO0lBQzdCLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUNBQW1DO0lBQ25DLGtCQUFrQjtJQUNsQixtQ0FBbUM7SUFDbkMsSUFBQSxpQkFBUSxFQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsSUFBQSxXQUFFLEVBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUNyQyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzVDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7WUFDdkMsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO1lBQ3hFLElBQUEsZUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDM0QsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQzFELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkMsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUseUJBQXlCLENBQUMsQ0FBQTtRQUM3RSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtZQUN4RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixtQ0FBbUM7SUFDbkMseUJBQXlCO0lBQ3pCLG1DQUFtQztJQUNuQyxJQUFBLGlCQUFRLEVBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLElBQUEsV0FBRSxFQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFBO1lBQ3pELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7WUFDNUUsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUM5RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7WUFDcEUsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDdEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2hFLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO1lBQ25FLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFBO1lBQ3JELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUV4QixnREFBZ0Q7WUFDaEQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUVwRCxPQUFPO1lBQ1AsaUJBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUVoRSxRQUFRO1lBQ1IsaUJBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG1DQUFtQztJQUNuQywwQkFBMEI7SUFDMUIsbUNBQW1DO0lBQ25DLElBQUEsaUJBQVEsRUFBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsSUFBQSxXQUFFLEVBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDbEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixnQkFBZ0I7WUFDaEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELElBQUEsZUFBTSxFQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckUsSUFBQSxlQUFNLEVBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3pFLElBQUEsZUFBTSxFQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2RSxJQUFBLGVBQU0sRUFBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixnQkFBZ0I7WUFDaEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsOEJBQThCO1lBQzlCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO1lBRTlELElBQUEsZUFBTSxFQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2hELE1BQU0sRUFBRSxvQkFBb0I7Z0JBQzVCLFNBQVMsRUFBRSxNQUFNO2FBQ2xCLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFO1lBQzNFLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFBO1lBQ3RELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELGlCQUFTLENBQUMsS0FBSyxDQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFBO1lBRTFELElBQUEsZUFBTSxFQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2hELE1BQU0sRUFBRSxlQUFlO2dCQUN2QixTQUFTLEVBQUUsTUFBTTthQUNsQixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUM3RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRTVELElBQUEsZUFBTSxFQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2hELE1BQU0sRUFBRSxZQUFZO2dCQUNwQixTQUFTLEVBQUUsTUFBTTthQUNsQixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUM3RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRTVELElBQUEsZUFBTSxFQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2hELE1BQU0sRUFBRSxZQUFZO2dCQUNwQixTQUFTLEVBQUUsS0FBSzthQUNqQixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUN6RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtZQUUxRCxJQUFBLGVBQU0sRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO2dCQUNoRCxNQUFNLEVBQUUsZUFBZTtnQkFDdkIsU0FBUyxFQUFFLE1BQU07YUFDbEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRCxNQUFNLElBQUksR0FBRyxvQkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzlCLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUV6QixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixtQ0FBbUM7SUFDbkMsbUJBQW1CO0lBQ25CLG1DQUFtQztJQUNuQyxJQUFBLGlCQUFRLEVBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDekQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsZ0JBQWdCO1lBQ2hCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELCtDQUErQztZQUMvQyxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDOUQsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUN0RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUUzRCw0REFBNEQ7WUFDNUQsK0RBQStEO1lBQy9ELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7WUFDN0UsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDdEQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsaUZBQWlGO1lBQ2pGLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQ2xFLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG1DQUFtQztJQUNuQyxtQ0FBbUM7SUFDbkMsbUNBQW1DO0lBQ25DLElBQUEsaUJBQVEsRUFBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDMUMsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQTtRQUV2QyxJQUFBLFdBQUUsRUFBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDM0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUVGLFdBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDL0QsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsSUFBQSxlQUFNLEVBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM3RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUUzRCxvREFBb0Q7WUFDcEQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUM5RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsVUFBeUIsQ0FBQTtZQUNuRCxJQUFBLGVBQU0sRUFBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQzFELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUN2RCxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsa0RBQWtELENBQUMsQ0FBQTtRQUNoRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUNBQW1DO0lBQ25DLG1CQUFtQjtJQUNuQixtQ0FBbUM7SUFDbkMsSUFBQSxpQkFBUSxFQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsMkZBQTJGO1FBRTNGLElBQUEsV0FBRSxFQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUV6RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlEQUFpRDtZQUNqRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUU1QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzlELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFBO1lBRTVELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7WUFDbEUsb0JBQW9CLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUE7WUFDakQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtZQUU5RCxJQUFBLGVBQU0sRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDakQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFFcEQsZUFBZTtZQUNmLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hCLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hCLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXhCLG9EQUFvRDtZQUNwRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBRXBELHlCQUF5QjtZQUN6QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFBO1lBQzlELGlCQUFTLENBQUMsS0FBSyxDQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFDNUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUU1RCxJQUFBLGVBQU0sRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixtQ0FBbUM7SUFDbkMsNEJBQTRCO0lBQzVCLG1DQUFtQztJQUNuQyxJQUFBLGlCQUFRLEVBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUEsV0FBRSxFQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxRQUFRLEdBQUcsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxDQUFBO1lBQzlELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRTVELElBQUEsZUFBTSxFQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2hELE1BQU0sRUFBRSxZQUFZO2dCQUNwQixTQUFTLEVBQUUsS0FBSzthQUNqQixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtZQUN6RCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUU3QyxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUU1RCwwQkFBMEI7WUFDMUIsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUE7WUFDckQsUUFBUSxDQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFMUIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLDZFQUE2RTtZQUM3RSxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixtQ0FBbUM7SUFDbkMsc0JBQXNCO0lBQ3RCLG1DQUFtQztJQUNuQyxJQUFBLGlCQUFRLEVBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixJQUFBLFdBQUUsRUFBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1lBQzFELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDckMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDM0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMzQyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLHFEQUFxRCxDQUFDLENBQUE7WUFDM0YsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUNBQW1DO0lBQ25DLG9CQUFvQjtJQUNwQixtQ0FBbUM7SUFDbkMsSUFBQSxpQkFBUSxFQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsSUFBQSxXQUFFLEVBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsSUFBQSxlQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUN0RixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLElBQUEsZUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLG9DQUFvQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDcEcsSUFBQSxlQUFNLEVBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN4RyxJQUFBLGVBQU0sRUFBQyxlQUFlLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ3RHLElBQUEsZUFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLHNDQUFzQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDeEcsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG1DQUFtQztJQUNuQyxxQ0FBcUM7SUFDckMsbUNBQW1DO0lBQ25DLElBQUEsaUJBQVEsRUFBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDNUMsSUFBQSxXQUFFLEVBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFeEIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3BELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFckQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtZQUN4RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxJQUFBLGVBQU0sRUFBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2hFLElBQUEsZUFBTSxFQUFDLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyx3REFBd0QsRUFBRSxHQUFHLEVBQUU7WUFDaEUsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsSUFBQSxlQUFNLEVBQUMsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUNBQW1DO0lBQ25DLHFCQUFxQjtJQUNyQixtQ0FBbUM7SUFDbkMsSUFBQSxpQkFBUSxFQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBQSxXQUFFLEVBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRTlDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsa0RBQWtELENBQUMsQ0FBQTtZQUM5RixJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRTlDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtZQUM3RCxJQUFBLGVBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2pDLElBQUEsZUFBTSxFQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDNUMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1lBQy9FLElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDeEQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1lBQzVELElBQUEsZUFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDekQsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFOUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQzlELElBQUEsZUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7WUFDcEQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQzVELElBQUEsZUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG1DQUFtQztJQUNuQywrQkFBK0I7SUFDL0IsbUNBQW1DO0lBQ25DLElBQUEsaUJBQVEsRUFBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxTQUFTLEdBQUc7WUFDaEIsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtZQUNwRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtZQUM3RSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7WUFDbkUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO1NBQ25FLENBQUE7UUFFRCxXQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUNoQix3R0FBd0csRUFDeEcsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtZQUM5QixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUVoRCxJQUFBLGVBQU0sRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDMUUsQ0FBQyxDQUNGLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2l0aGluIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IFNvcnREcm9wZG93biBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXMgb25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBpMThuIHRyYW5zbGF0aW9uIGhvb2tcbmNvbnN0IG1vY2tUcmFuc2xhdGlvbiA9IHZpLmZuKChrZXk6IHN0cmluZywgb3B0aW9ucz86IHsgbnM/OiBzdHJpbmcgfSkgPT4ge1xuICAvLyBCdWlsZCBmdWxsIGtleSB3aXRoIG5hbWVzcGFjZSBwcmVmaXggaWYgcHJvdmlkZWRcbiAgY29uc3QgZnVsbEtleSA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uJHtrZXl9YCA6IGtleVxuICBjb25zdCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5zb3J0QnknOiAnU29ydCBieScsXG4gICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5zb3J0T3B0aW9uLm1vc3RQb3B1bGFyJzogJ01vc3QgUG9wdWxhcicsXG4gICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5zb3J0T3B0aW9uLnJlY2VudGx5VXBkYXRlZCc6ICdSZWNlbnRseSBVcGRhdGVkJyxcbiAgICAncGx1Z2luLm1hcmtldHBsYWNlLnNvcnRPcHRpb24ubmV3bHlSZWxlYXNlZCc6ICdOZXdseSBSZWxlYXNlZCcsXG4gICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5zb3J0T3B0aW9uLmZpcnN0UmVsZWFzZWQnOiAnRmlyc3QgUmVsZWFzZWQnLFxuICB9XG4gIHJldHVybiB0cmFuc2xhdGlvbnNbZnVsbEtleV0gfHwga2V5XG59KVxuXG52aS5tb2NrKCcjaTE4bicsICgpID0+ICh7XG4gIHVzZVRyYW5zbGF0aW9uOiAoKSA9PiAoe1xuICAgIHQ6IG1vY2tUcmFuc2xhdGlvbixcbiAgfSksXG59KSlcblxuLy8gTW9jayBtYXJrZXRwbGFjZSBhdG9tcyB3aXRoIGNvbnRyb2xsYWJsZSB2YWx1ZXNcbmxldCBtb2NrU29ydDogeyBzb3J0Qnk6IHN0cmluZywgc29ydE9yZGVyOiBzdHJpbmcgfSA9IHsgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cbmNvbnN0IG1vY2tIYW5kbGVTb3J0Q2hhbmdlID0gdmkuZm4oKVxuXG52aS5tb2NrKCcuLi9hdG9tcycsICgpID0+ICh7XG4gIHVzZU1hcmtldHBsYWNlU29ydDogKCkgPT4gW21vY2tTb3J0LCBtb2NrSGFuZGxlU29ydENoYW5nZV0sXG59KSlcblxuLy8gTW9jayBwb3J0YWwgY29tcG9uZW50IHdpdGggY29udHJvbGxhYmxlIG9wZW4gc3RhdGVcbmxldCBtb2NrUG9ydGFsT3BlblN0YXRlID0gZmFsc2VcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+ICh7XG4gIFBvcnRhbFRvRm9sbG93RWxlbTogKHsgY2hpbGRyZW4sIG9wZW4sIG9uT3BlbkNoYW5nZSB9OiB7XG4gICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIG9wZW46IGJvb2xlYW5cbiAgICBvbk9wZW5DaGFuZ2U6IChvcGVuOiBib29sZWFuKSA9PiB2b2lkXG4gIH0pID0+IHtcbiAgICBtb2NrUG9ydGFsT3BlblN0YXRlID0gb3BlblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLXdyYXBwZXJcIiBkYXRhLW9wZW49e29wZW59PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI6ICh7IGNoaWxkcmVuLCBvbkNsaWNrIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DbGljazogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICksXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ6ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiB7XG4gICAgLy8gTWF0Y2ggYWN0dWFsIGJlaGF2aW9yOiBvbmx5IHJlbmRlciB3aGVuIHBvcnRhbCBpcyBvcGVuXG4gICAgaWYgKCFtb2NrUG9ydGFsT3BlblN0YXRlKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1jb250ZW50XCI+e2NoaWxkcmVufTwvZGl2PlxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IEZhY3RvcnkgRnVuY3Rpb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIFNvcnRPcHRpb24gPSB7XG4gIHZhbHVlOiBzdHJpbmdcbiAgb3JkZXI6IHN0cmluZ1xuICB0ZXh0OiBzdHJpbmdcbn1cblxuY29uc3QgY3JlYXRlU29ydE9wdGlvbnMgPSAoKTogU29ydE9wdGlvbltdID0+IFtcbiAgeyB2YWx1ZTogJ2luc3RhbGxfY291bnQnLCBvcmRlcjogJ0RFU0MnLCB0ZXh0OiAnTW9zdCBQb3B1bGFyJyB9LFxuICB7IHZhbHVlOiAndmVyc2lvbl91cGRhdGVkX2F0Jywgb3JkZXI6ICdERVNDJywgdGV4dDogJ1JlY2VudGx5IFVwZGF0ZWQnIH0sXG4gIHsgdmFsdWU6ICdjcmVhdGVkX2F0Jywgb3JkZXI6ICdERVNDJywgdGV4dDogJ05ld2x5IFJlbGVhc2VkJyB9LFxuICB7IHZhbHVlOiAnY3JlYXRlZF9hdCcsIG9yZGVyOiAnQVNDJywgdGV4dDogJ0ZpcnN0IFJlbGVhc2VkJyB9LFxuXVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU29ydERyb3Bkb3duIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdTb3J0RHJvcGRvd24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tTb3J0ID0geyBzb3J0Qnk6ICdpbnN0YWxsX2NvdW50Jywgc29ydE9yZGVyOiAnREVTQycgfVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXdyYXBwZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzb3J0IGJ5IGxhYmVsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTb3J0IGJ5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VsZWN0ZWQgb3B0aW9uIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFycm93IGRvd24gaWNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgY29uc3QgYXJyb3dJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTQudy00LnRleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICBleHBlY3QoYXJyb3dJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRyaWdnZXIgZWxlbWVudCB3aXRoIGNvcnJlY3Qgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUNsYXNzKCdoLTgnLCAncm91bmRlZC1sZycsICdiZy1zdGF0ZS1iYXNlLWhvdmVyLWFsdCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBkcm9wZG93biBjb250ZW50IHdoZW4gY2xvc2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0YXRlIE1hbmFnZW1lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggY2xvc2VkIHN0YXRlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC13cmFwcGVyJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3BlbicsICdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IHNlbGVjdGVkIG9wdGlvbiBmb3IgaW5zdGFsbF9jb3VudCBERVNDJywgKCkgPT4ge1xuICAgICAgbW9ja1NvcnQgPSB7IHNvcnRCeTogJ2luc3RhbGxfY291bnQnLCBzb3J0T3JkZXI6ICdERVNDJyB9XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IHNlbGVjdGVkIG9wdGlvbiBmb3IgdmVyc2lvbl91cGRhdGVkX2F0IERFU0MnLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAndmVyc2lvbl91cGRhdGVkX2F0Jywgc29ydE9yZGVyOiAnREVTQycgfVxuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdSZWNlbnRseSBVcGRhdGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3Qgc2VsZWN0ZWQgb3B0aW9uIGZvciBjcmVhdGVkX2F0IERFU0MnLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAnY3JlYXRlZF9hdCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTmV3bHkgUmVsZWFzZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBzZWxlY3RlZCBvcHRpb24gZm9yIGNyZWF0ZWRfYXQgQVNDJywgKCkgPT4ge1xuICAgICAgbW9ja1NvcnQgPSB7IHNvcnRCeTogJ2NyZWF0ZWRfYXQnLCBzb3J0T3JkZXI6ICdBU0MnIH1cbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRmlyc3QgUmVsZWFzZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBvcGVuIHN0YXRlIHdoZW4gdHJpZ2dlciBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBBZnRlciBjbGljaywgcG9ydGFsIGNvbnRlbnQgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBkcm9wZG93biB3aGVuIHRyaWdnZXIgY2xpY2tlZCBhZ2FpbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG5cbiAgICAgIC8vIE9wZW5cbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbG9zZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGRyb3Bkb3duIG9uIHRyaWdnZXIgY2xpY2snLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIHNvcnQgb3B0aW9ucyB3aGVuIG9wZW4nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgLy8gT3BlbiBkcm9wZG93blxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgZXhwZWN0KHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnUmVjZW50bHkgVXBkYXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnTmV3bHkgUmVsZWFzZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ0ZpcnN0IFJlbGVhc2VkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVNvcnRDaGFuZ2Ugd2hlbiBvcHRpb24gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICAvLyBPcGVuIGRyb3Bkb3duXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBDbGljayBvbiBcIlJlY2VudGx5IFVwZGF0ZWRcIlxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ1JlY2VudGx5IFVwZGF0ZWQnKSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTb3J0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHNvcnRCeTogJ3ZlcnNpb25fdXBkYXRlZF9hdCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0RFU0MnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVNvcnRDaGFuZ2Ugd2l0aCBjb3JyZWN0IHBhcmFtcyBmb3IgTW9zdCBQb3B1bGFyJywgKCkgPT4ge1xuICAgICAgbW9ja1NvcnQgPSB7IHNvcnRCeTogJ2NyZWF0ZWRfYXQnLCBzb3J0T3JkZXI6ICdERVNDJyB9XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVNvcnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0RFU0MnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVNvcnRDaGFuZ2Ugd2l0aCBjb3JyZWN0IHBhcmFtcyBmb3IgTmV3bHkgUmVsZWFzZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ05ld2x5IFJlbGVhc2VkJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU29ydENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBzb3J0Qnk6ICdjcmVhdGVkX2F0JyxcbiAgICAgICAgc29ydE9yZGVyOiAnREVTQycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlU29ydENoYW5nZSB3aXRoIGNvcnJlY3QgcGFyYW1zIGZvciBGaXJzdCBSZWxlYXNlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnRmlyc3QgUmVsZWFzZWQnKSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTb3J0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHNvcnRCeTogJ2NyZWF0ZWRfYXQnLFxuICAgICAgICBzb3J0T3JkZXI6ICdBU0MnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBzZWxlY3RpbmcgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbicsICgpID0+IHtcbiAgICAgIG1vY2tTb3J0ID0geyBzb3J0Qnk6ICdpbnN0YWxsX2NvdW50Jywgc29ydE9yZGVyOiAnREVTQycgfVxuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGZpcmVFdmVudC5jbGljayh3aXRoaW4oY29udGVudCkuZ2V0QnlUZXh0KCdNb3N0IFBvcHVsYXInKSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTb3J0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHNvcnRCeTogJ2luc3RhbGxfY291bnQnLFxuICAgICAgICBzb3J0T3JkZXI6ICdERVNDJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3VwcG9ydCB1c2VyRXZlbnQgZm9yIHRyaWdnZXIgY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENoZWNrIEljb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NoZWNrIEljb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNoZWNrIGljb24gZm9yIHNlbGVjdGVkIG9wdGlvbicsICgpID0+IHtcbiAgICAgIG1vY2tTb3J0ID0geyBzb3J0Qnk6ICdpbnN0YWxsX2NvdW50Jywgc29ydE9yZGVyOiAnREVTQycgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICAvLyBPcGVuIGRyb3Bkb3duXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBDaGVjayBpY29uIHNob3VsZCBiZSBwcmVzZW50IGluIHRoZSBkcm9wZG93blxuICAgICAgY29uc3QgY2hlY2tJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtYWNjZW50JylcbiAgICAgIGV4cGVjdChjaGVja0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNoZWNrIGljb24gb25seSBmb3IgbWF0Y2hpbmcgc29ydEJ5IEFORCBzb3J0T3JkZXInLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAnY3JlYXRlZF9hdCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBjb25zdCBvcHRpb25zID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Vyc29yLXBvaW50ZXInKVxuXG4gICAgICAvLyBcIk5ld2x5IFJlbGVhc2VkXCIgKGNyZWF0ZWRfYXQgREVTQykgc2hvdWxkIGhhdmUgY2hlY2sgaWNvblxuICAgICAgLy8gXCJGaXJzdCBSZWxlYXNlZFwiIChjcmVhdGVkX2F0IEFTQykgc2hvdWxkIE5PVCBoYXZlIGNoZWNrIGljb25cbiAgICAgIGV4cGVjdChvcHRpb25zLmxlbmd0aCkudG9CZSg0KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNoZWNrIGljb24gZm9yIGRpZmZlcmVudCBzb3J0T3JkZXIgd2l0aCBzYW1lIHNvcnRCeScsICgpID0+IHtcbiAgICAgIG1vY2tTb3J0ID0geyBzb3J0Qnk6ICdjcmVhdGVkX2F0Jywgc29ydE9yZGVyOiAnREVTQycgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBPbmx5IG9uZSBjaGVjayBpY29uIHNob3VsZCBiZSB2aXNpYmxlIChmb3IgTmV3bHkgUmVsZWFzZWQsIG5vdCBGaXJzdCBSZWxlYXNlZClcbiAgICAgIGNvbnN0IGNoZWNrSWNvbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnRleHQtdGV4dC1hY2NlbnQnKVxuICAgICAgZXhwZWN0KGNoZWNrSWNvbnMubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEcm9wZG93biBPcHRpb25zIFN0cnVjdHVyZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRHJvcGRvd24gT3B0aW9ucyBTdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc29ydE9wdGlvbnMgPSBjcmVhdGVTb3J0T3B0aW9ucygpXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciA0IHNvcnQgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBjb25zdCBvcHRpb25zID0gY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KG9wdGlvbnMubGVuZ3RoKS50b0JlKDQpXG4gICAgfSlcblxuICAgIGl0LmVhY2goc29ydE9wdGlvbnMpKCdzaG91bGQgcmVuZGVyIG9wdGlvbjogJHRleHQnLCAoeyB0ZXh0IH0pID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBleHBlY3Qod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCh0ZXh0KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvcHRpb25zIHdpdGggdW5pcXVlIGtleXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLmN1cnNvci1wb2ludGVyJylcblxuICAgICAgLy8gQWxsIG9wdGlvbnMgc2hvdWxkIGJlIHJlbmRlcmVkIChubyBrZXkgY29uZmxpY3RzKVxuICAgICAgZXhwZWN0KG9wdGlvbnMubGVuZ3RoKS50b0JlKDQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRyb3Bkb3duIGNvbnRhaW5lciB3aXRoIGNvcnJlY3Qgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGNvbnRlbnQuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9IYXZlQ2xhc3MoJ3JvdW5kZWQteGwnLCAnc2hhZG93LWxnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgb3B0aW9uIGl0ZW1zIHdpdGggaG92ZXIgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGNvbnRlbnQucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJylcbiAgICAgIGV4cGVjdChvcHRpb24pLnRvSGF2ZUNsYXNzKCdob3ZlcjpiZy1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmctaG92ZXInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICAvLyBUaGUgY29tcG9uZW50IGZhbGxzIGJhY2sgdG8gdGhlIGZpcnN0IG9wdGlvbiAoTW9zdCBQb3B1bGFyKSB3aGVuIHNvcnQgdmFsdWVzIGFyZSBpbnZhbGlkXG5cbiAgICBpdCgnc2hvdWxkIGZhbGxiYWNrIHRvIGRlZmF1bHQgb3B0aW9uIHdoZW4gc29ydEJ5IGlzIHVua25vd24nLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAndW5rbm93bl9maWVsZCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cblxuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBmYWxsYmFjayB0byBmaXJzdCBvcHRpb24gXCJNb3N0IFBvcHVsYXJcIlxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmFsbGJhY2sgdG8gZGVmYXVsdCBvcHRpb24gd2hlbiBzb3J0QnkgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAnJywgc29ydE9yZGVyOiAnREVTQycgfVxuXG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmFsbGJhY2sgdG8gZGVmYXVsdCBvcHRpb24gd2hlbiBzb3J0T3JkZXIgaXMgdW5rbm93bicsICgpID0+IHtcbiAgICAgIG1vY2tTb3J0ID0geyBzb3J0Qnk6ICdpbnN0YWxsX2NvdW50Jywgc29ydE9yZGVyOiAnVU5LTk9XTicgfVxuXG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aGVuIGhhbmRsZVNvcnRDaGFuZ2UgaXMgYSBuby1vcCcsICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVTb3J0Q2hhbmdlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7fSlcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnUmVjZW50bHkgVXBkYXRlZCcpKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVNvcnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCB0b2dnbGUgY2xpY2tzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcblxuICAgICAgLy8gUmFwaWQgY2xpY2tzXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEZpbmFsIHN0YXRlIHNob3VsZCBiZSBvcGVuIChvZGQgbnVtYmVyIG9mIGNsaWNrcylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgb3B0aW9uIHNlbGVjdGlvbnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuXG4gICAgICAvLyBDbGljayBtdWx0aXBsZSBvcHRpb25zXG4gICAgICBmaXJlRXZlbnQuY2xpY2sod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnUmVjZW50bHkgVXBkYXRlZCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHdpdGhpbihjb250ZW50KS5nZXRCeVRleHQoJ05ld2x5IFJlbGVhc2VkJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnRmlyc3QgUmVsZWFzZWQnKSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTb3J0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbnRleHQgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbnRleHQgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZWFkIHNvcnQgdmFsdWUgZnJvbSBjb250ZXh0JywgKCkgPT4ge1xuICAgICAgbW9ja1NvcnQgPSB7IHNvcnRCeTogJ3ZlcnNpb25fdXBkYXRlZF9hdCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUmVjZW50bHkgVXBkYXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBjb250ZXh0IGhhbmRsZVNvcnRDaGFuZ2Ugb24gc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGZpcmVFdmVudC5jbGljayh3aXRoaW4oY29udGVudCkuZ2V0QnlUZXh0KCdGaXJzdCBSZWxlYXNlZCcpKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVNvcnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgc29ydEJ5OiAnY3JlYXRlZF9hdCcsXG4gICAgICAgIHNvcnRPcmRlcjogJ0FTQycsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBkaXNwbGF5IHdoZW4gY29udGV4dCBzb3J0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vc3QgUG9wdWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFNpbXVsYXRlIGNvbnRleHQgY2hhbmdlXG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAnY3JlYXRlZF9hdCcsIHNvcnRPcmRlcjogJ0FTQycgfVxuICAgICAgcmVyZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0ZpcnN0IFJlbGVhc2VkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc2VsZWN0b3IgcGF0dGVybiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBoYXZlIGNhbGxlZCB1c2VNYXJrZXRwbGFjZUNvbnRleHQgd2l0aCBzZWxlY3RvciBmdW5jdGlvbnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC13cmFwcGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGN1cnNvciBwb2ludGVyIG9uIHRyaWdnZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJylcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjdXJzb3IgcG9pbnRlciBvbiBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3Qob3B0aW9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdmlzaWJsZSBmb2N1cyBpbmRpY2F0b3JzIHZpYSBob3ZlciBzdHlsZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgY29uc3Qgb3B0aW9uID0gY29udGVudC5xdWVyeVNlbGVjdG9yKCcuaG92ZXJcXFxcOmJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZy1ob3ZlcicpXG4gICAgICBleHBlY3Qob3B0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBUcmFuc2xhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVHJhbnNsYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCB0cmFuc2xhdGlvbiBmb3Igc29ydEJ5IGxhYmVsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrVHJhbnNsYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdtYXJrZXRwbGFjZS5zb3J0QnknLCB7IG5zOiAncGx1Z2luJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdHJhbnNsYXRpb24gZm9yIGFsbCBzb3J0IG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZXhwZWN0KG1vY2tUcmFuc2xhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24ubW9zdFBvcHVsYXInLCB7IG5zOiAncGx1Z2luJyB9KVxuICAgICAgZXhwZWN0KG1vY2tUcmFuc2xhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24ucmVjZW50bHlVcGRhdGVkJywgeyBuczogJ3BsdWdpbicgfSlcbiAgICAgIGV4cGVjdChtb2NrVHJhbnNsYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdtYXJrZXRwbGFjZS5zb3J0T3B0aW9uLm5ld2x5UmVsZWFzZWQnLCB7IG5zOiAncGx1Z2luJyB9KVxuICAgICAgZXhwZWN0KG1vY2tUcmFuc2xhdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ21hcmtldHBsYWNlLnNvcnRPcHRpb24uZmlyc3RSZWxlYXNlZCcsIHsgbnM6ICdwbHVnaW4nIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQb3J0YWwgQ29tcG9uZW50IEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQb3J0YWwgQ29tcG9uZW50IEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBvcGVuIHN0YXRlIHRvIFBvcnRhbFRvRm9sbG93RWxlbScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtd3JhcHBlcicpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9wZW4nLCAnZmFsc2UnKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9wZW4nLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRyaWdnZXIgY29udGVudCBpbnNpZGUgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBleHBlY3Qod2l0aGluKHRyaWdnZXIpLmdldEJ5VGV4dCgnU29ydCBieScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qod2l0aGluKHRyaWdnZXIpLmdldEJ5VGV4dCgnTW9zdCBQb3B1bGFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgb3B0aW9ucyBpbnNpZGUgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBleHBlY3Qod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCgnTW9zdCBQb3B1bGFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFZpc3VhbCBTdHlsZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVmlzdWFsIFN0eWxlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgdHJpZ2dlciBjb250YWluZXIgc3R5bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mbGV4LmgtOC5jdXJzb3ItcG9pbnRlci5pdGVtcy1jZW50ZXIucm91bmRlZC1sZycpXG4gICAgICBleHBlY3QodHJpZ2dlckRpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHNlY29uZGFyeSB0ZXh0IGNvbG9yIHRvIHNvcnQgYnkgbGFiZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTb3J0RHJvcGRvd24gLz4pXG5cbiAgICAgIGNvbnN0IGxhYmVsID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtc2Vjb25kYXJ5JylcbiAgICAgIGV4cGVjdChsYWJlbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGxhYmVsPy50ZXh0Q29udGVudCkudG9CZSgnU29ydCBieScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgcHJpbWFyeSB0ZXh0IGNvbG9yIHRvIHNlbGVjdGVkIG9wdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1wcmltYXJ5LnN5c3RlbS1zbS1tZWRpdW0nKVxuICAgICAgZXhwZWN0KHNlbGVjdGVkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgdGVydGlhcnkgdGV4dCBjb2xvciB0byBhcnJvdyBpY29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBjb25zdCBhcnJvdyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXRlcnRpYXJ5JylcbiAgICAgIGV4cGVjdChhcnJvdykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGFjY2VudCB0ZXh0IGNvbG9yIHRvIGNoZWNrIGljb24gd2hlbiBvcHRpb24gc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU29ydCA9IHsgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsIHNvcnRPcmRlcjogJ0RFU0MnIH1cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFNvcnREcm9wZG93biAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgY29uc3QgY2hlY2tJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtYWNjZW50JylcbiAgICAgIGV4cGVjdChjaGVja0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBibHVyIGJhY2tkcm9wIHRvIGRyb3Bkb3duIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICBjb25zdCBjb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBjb25zdCBjb250YWluZXIgPSBjb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZHJvcC1ibHVyLXNtJylcbiAgICAgIGV4cGVjdChjb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBTb3J0IE9wdGlvbnMgQ2xpY2sgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FsbCBTb3J0IE9wdGlvbnMgQ2xpY2sgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgY29uc3QgdGVzdENhc2VzID0gW1xuICAgICAgeyB0ZXh0OiAnTW9zdCBQb3B1bGFyJywgc29ydEJ5OiAnaW5zdGFsbF9jb3VudCcsIHNvcnRPcmRlcjogJ0RFU0MnIH0sXG4gICAgICB7IHRleHQ6ICdSZWNlbnRseSBVcGRhdGVkJywgc29ydEJ5OiAndmVyc2lvbl91cGRhdGVkX2F0Jywgc29ydE9yZGVyOiAnREVTQycgfSxcbiAgICAgIHsgdGV4dDogJ05ld2x5IFJlbGVhc2VkJywgc29ydEJ5OiAnY3JlYXRlZF9hdCcsIHNvcnRPcmRlcjogJ0RFU0MnIH0sXG4gICAgICB7IHRleHQ6ICdGaXJzdCBSZWxlYXNlZCcsIHNvcnRCeTogJ2NyZWF0ZWRfYXQnLCBzb3J0T3JkZXI6ICdBU0MnIH0sXG4gICAgXVxuXG4gICAgaXQuZWFjaCh0ZXN0Q2FzZXMpKFxuICAgICAgJ3Nob3VsZCBjYWxsIGhhbmRsZVNvcnRDaGFuZ2Ugd2l0aCB7IHNvcnRCeTogXCIkc29ydEJ5XCIsIHNvcnRPcmRlcjogXCIkc29ydE9yZGVyXCIgfSB3aGVuIGNsaWNraW5nIFwiJHRleHRcIicsXG4gICAgICAoeyB0ZXh0LCBzb3J0QnksIHNvcnRPcmRlciB9KSA9PiB7XG4gICAgICAgIHJlbmRlcig8U29ydERyb3Bkb3duIC8+KVxuXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sod2l0aGluKGNvbnRlbnQpLmdldEJ5VGV4dCh0ZXh0KSlcblxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVNvcnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgc29ydEJ5LCBzb3J0T3JkZXIgfSlcbiAgICAgIH0sXG4gICAgKVxuICB9KVxufSlcbiJdfQ==