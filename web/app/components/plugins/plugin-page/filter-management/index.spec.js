"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// ==================== Imports (after mocks) ====================
const category_filter_1 = require("./category-filter");
// Import real components
const index_1 = require("./index");
const search_box_1 = require("./search-box");
const store_1 = require("./store");
const tag_filter_1 = require("./tag-filter");
// ==================== Mock Setup ====================
// Mock initial filters from context
let mockInitFilters = {
    categories: [],
    tags: [],
    searchQuery: '',
};
vitest_1.vi.mock('../context', () => ({
    usePluginPageContext: (selector) => selector({ filters: mockInitFilters }),
}));
// Mock categories data
const mockCategories = [
    { name: 'model', label: 'Models' },
    { name: 'tool', label: 'Tools' },
    { name: 'extension', label: 'Extensions' },
    { name: 'agent', label: 'Agents' },
];
const mockCategoriesMap = {
    model: { name: 'model', label: 'Models' },
    tool: { name: 'tool', label: 'Tools' },
    extension: { name: 'extension', label: 'Extensions' },
    agent: { name: 'agent', label: 'Agents' },
};
// Mock tags data
const mockTags = [
    { name: 'agent', label: 'Agent' },
    { name: 'rag', label: 'RAG' },
    { name: 'search', label: 'Search' },
    { name: 'image', label: 'Image' },
];
const mockTagsMap = {
    agent: { name: 'agent', label: 'Agent' },
    rag: { name: 'rag', label: 'RAG' },
    search: { name: 'search', label: 'Search' },
    image: { name: 'image', label: 'Image' },
};
vitest_1.vi.mock('../../hooks', () => ({
    useCategories: () => ({
        categories: mockCategories,
        categoriesMap: mockCategoriesMap,
    }),
    useTags: () => ({
        tags: mockTags,
        tagsMap: mockTagsMap,
        getTagLabel: (name) => mockTagsMap[name]?.label || name,
    }),
}));
// Track portal open state for testing
let mockPortalOpenState = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => {
        mockPortalOpenState = open;
        return <div data-testid="portal-container" data-open={open}>{children}</div>;
    },
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>{children}</div>),
    PortalToFollowElemContent: ({ children, className }) => {
        if (!mockPortalOpenState)
            return null;
        return <div data-testid="portal-content" className={className}>{children}</div>;
    },
}));
// ==================== Test Utilities ====================
const createFilterState = (overrides = {}) => ({
    categories: [],
    tags: [],
    searchQuery: '',
    ...overrides,
});
const renderFilterManagement = (onFilterChange = vitest_1.vi.fn()) => {
    const result = (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
    return { ...result, onFilterChange };
};
// ==================== constant.ts Tests ====================
(0, vitest_1.describe)('constant.ts - Type Definitions', () => {
    (0, vitest_1.it)('should define Tag type correctly', () => {
        // Arrange
        const tag = {
            id: 'test-id',
            name: 'test-tag',
            type: 'custom',
            binding_count: 5,
        };
        // Assert
        (0, vitest_1.expect)(tag.id).toBe('test-id');
        (0, vitest_1.expect)(tag.name).toBe('test-tag');
        (0, vitest_1.expect)(tag.type).toBe('custom');
        (0, vitest_1.expect)(tag.binding_count).toBe(5);
    });
    (0, vitest_1.it)('should define Category type correctly', () => {
        // Arrange
        const category = {
            name: 'model',
            binding_count: 10,
        };
        // Assert
        (0, vitest_1.expect)(category.name).toBe('model');
        (0, vitest_1.expect)(category.binding_count).toBe(10);
    });
    (0, vitest_1.it)('should enforce Category name as specific union type', () => {
        // Arrange - Valid category names
        const validNames = ['model', 'tool', 'extension', 'bundle'];
        // Assert
        validNames.forEach((name) => {
            const category = { name, binding_count: 0 };
            (0, vitest_1.expect)(['model', 'tool', 'extension', 'bundle']).toContain(category.name);
        });
    });
});
// ==================== store.ts Tests ====================
(0, vitest_1.describe)('store.ts - Zustand Store', () => {
    (0, vitest_1.beforeEach)(() => {
        // Reset store to initial state
        const { setState } = store_1.useStore;
        setState({
            tagList: [],
            categoryList: [],
            showTagManagementModal: false,
            showCategoryManagementModal: false,
        });
    });
    (0, vitest_1.describe)('Initial State', () => {
        (0, vitest_1.it)('should have empty tagList initially', () => {
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)(state => state.tagList));
            (0, vitest_1.expect)(result.current).toEqual([]);
        });
        (0, vitest_1.it)('should have empty categoryList initially', () => {
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)(state => state.categoryList));
            (0, vitest_1.expect)(result.current).toEqual([]);
        });
        (0, vitest_1.it)('should have showTagManagementModal false initially', () => {
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)(state => state.showTagManagementModal));
            (0, vitest_1.expect)(result.current).toBe(false);
        });
        (0, vitest_1.it)('should have showCategoryManagementModal false initially', () => {
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)(state => state.showCategoryManagementModal));
            (0, vitest_1.expect)(result.current).toBe(false);
        });
    });
    (0, vitest_1.describe)('setTagList', () => {
        (0, vitest_1.it)('should update tagList', () => {
            // Arrange
            const mockTagList = [
                { id: '1', name: 'tag1', type: 'custom', binding_count: 1 },
                { id: '2', name: 'tag2', type: 'custom', binding_count: 2 },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setTagList(mockTagList);
            });
            // Assert
            (0, vitest_1.expect)(result.current.tagList).toEqual(mockTagList);
        });
        (0, vitest_1.it)('should handle undefined tagList', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setTagList(undefined);
            });
            // Assert
            (0, vitest_1.expect)(result.current.tagList).toBeUndefined();
        });
        (0, vitest_1.it)('should handle empty tagList', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            // First set some tags
            (0, react_1.act)(() => {
                result.current.setTagList([{ id: '1', name: 'tag1', type: 'custom', binding_count: 1 }]);
            });
            // Act - Clear the list
            (0, react_1.act)(() => {
                result.current.setTagList([]);
            });
            // Assert
            (0, vitest_1.expect)(result.current.tagList).toEqual([]);
        });
    });
    (0, vitest_1.describe)('setCategoryList', () => {
        (0, vitest_1.it)('should update categoryList', () => {
            // Arrange
            const mockCategoryList = [
                { name: 'model', binding_count: 5 },
                { name: 'tool', binding_count: 10 },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setCategoryList(mockCategoryList);
            });
            // Assert
            (0, vitest_1.expect)(result.current.categoryList).toEqual(mockCategoryList);
        });
        (0, vitest_1.it)('should handle undefined categoryList', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setCategoryList(undefined);
            });
            // Assert
            (0, vitest_1.expect)(result.current.categoryList).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('setShowTagManagementModal', () => {
        (0, vitest_1.it)('should set showTagManagementModal to true', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setShowTagManagementModal(true);
            });
            // Assert
            (0, vitest_1.expect)(result.current.showTagManagementModal).toBe(true);
        });
        (0, vitest_1.it)('should set showTagManagementModal to false', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setShowTagManagementModal(true);
            });
            // Act
            (0, react_1.act)(() => {
                result.current.setShowTagManagementModal(false);
            });
            // Assert
            (0, vitest_1.expect)(result.current.showTagManagementModal).toBe(false);
        });
    });
    (0, vitest_1.describe)('setShowCategoryManagementModal', () => {
        (0, vitest_1.it)('should set showCategoryManagementModal to true', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setShowCategoryManagementModal(true);
            });
            // Assert
            (0, vitest_1.expect)(result.current.showCategoryManagementModal).toBe(true);
        });
        (0, vitest_1.it)('should set showCategoryManagementModal to false', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setShowCategoryManagementModal(true);
            });
            // Act
            (0, react_1.act)(() => {
                result.current.setShowCategoryManagementModal(false);
            });
            // Assert
            (0, vitest_1.expect)(result.current.showCategoryManagementModal).toBe(false);
        });
    });
    (0, vitest_1.describe)('Store Isolation', () => {
        (0, vitest_1.it)('should maintain separate state for each property', () => {
            // Arrange
            const mockTagList = [{ id: '1', name: 'tag1', type: 'custom', binding_count: 1 }];
            const mockCategoryList = [{ name: 'model', binding_count: 5 }];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, store_1.useStore)());
            (0, react_1.act)(() => {
                result.current.setTagList(mockTagList);
                result.current.setCategoryList(mockCategoryList);
                result.current.setShowTagManagementModal(true);
                result.current.setShowCategoryManagementModal(false);
            });
            // Assert - All states are independent
            (0, vitest_1.expect)(result.current.tagList).toEqual(mockTagList);
            (0, vitest_1.expect)(result.current.categoryList).toEqual(mockCategoryList);
            (0, vitest_1.expect)(result.current.showTagManagementModal).toBe(true);
            (0, vitest_1.expect)(result.current.showCategoryManagementModal).toBe(false);
        });
    });
});
// ==================== search-box.tsx Tests ====================
(0, vitest_1.describe)('SearchBox Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render input with correct placeholder', () => {
            // Arrange & Act
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.search')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with provided searchQuery value', () => {
            // Arrange & Act
            (0, react_1.render)(<search_box_1.default searchQuery="test query" onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByDisplayValue('test query')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render search icon', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<search_box_1.default searchQuery="" onChange={vitest_1.vi.fn()}/>);
            // Assert - Input should have showLeftIcon which renders search icon
            const wrapper = container.querySelector('.w-\\[200px\\]');
            (0, vitest_1.expect)(wrapper).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onChange when input value changes', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={handleChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: 'new search' },
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith('new search');
        });
        (0, vitest_1.it)('should call onChange with empty string when cleared', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<search_box_1.default searchQuery="existing" onChange={handleChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByDisplayValue('existing'), {
                target: { value: '' },
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith('');
        });
        (0, vitest_1.it)('should handle rapid typing', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={handleChange}/>);
            const input = react_1.screen.getByPlaceholderText('plugin.search');
            // Act
            react_1.fireEvent.change(input, { target: { value: 'a' } });
            react_1.fireEvent.change(input, { target: { value: 'ab' } });
            react_1.fireEvent.change(input, { target: { value: 'abc' } });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledTimes(3);
            (0, vitest_1.expect)(handleChange).toHaveBeenLastCalledWith('abc');
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle special characters', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={handleChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: '!@#$%^&*()' },
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith('!@#$%^&*()');
        });
        (0, vitest_1.it)('should handle unicode characters', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={handleChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: '中文搜索 🔍' },
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith('中文搜索 🔍');
        });
        (0, vitest_1.it)('should handle very long input', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            const longText = 'a'.repeat(500);
            (0, react_1.render)(<search_box_1.default searchQuery="" onChange={handleChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: longText },
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith(longText);
        });
    });
});
// ==================== category-filter.tsx Tests ====================
(0, vitest_1.describe)('CategoriesFilter Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render with "All Categories" text when no selection', () => {
            // Arrange & Act
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.allCategories')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render dropdown arrow when no selection', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Assert - Arrow icon should be visible
            const arrowIcon = container.querySelector('svg');
            (0, vitest_1.expect)(arrowIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render selected category labels', () => {
            // Arrange & Act
            (0, react_1.render)(<category_filter_1.default value={['model']} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show clear button when categories are selected', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<category_filter_1.default value={['model']} onChange={vitest_1.vi.fn()}/>);
            // Assert - Close icon should be visible
            const closeIcon = container.querySelector('[class*="cursor-pointer"]');
            (0, vitest_1.expect)(closeIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show count badge for more than 2 selections', () => {
            // Arrange & Act
            (0, react_1.render)(<category_filter_1.default value={['model', 'tool', 'extension']} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('+1')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Dropdown Behavior', () => {
        (0, vitest_1.it)('should open dropdown on trigger click', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should display category options in dropdown', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Tools')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Extensions')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Agents')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should have search input in dropdown', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.searchCategories')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Selection Behavior', () => {
        (0, vitest_1.it)('should call onChange when category is selected', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={handleChange}/>);
            // Act - Open dropdown and click category
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Models'));
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith(['model']);
        });
        (0, vitest_1.it)('should deselect when clicking selected category', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<category_filter_1.default value={['model']} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                // Multiple "Models" texts exist - one in trigger, one in dropdown
                const allModels = react_1.screen.getAllByText('Models');
                (0, vitest_1.expect)(allModels.length).toBeGreaterThan(1);
            });
            // Click the one in the dropdown (inside portal-content)
            const portalContent = react_1.screen.getByTestId('portal-content');
            const modelsInDropdown = portalContent.querySelector('.system-sm-medium');
            react_1.fireEvent.click(modelsInDropdown.parentElement);
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith([]);
        });
        (0, vitest_1.it)('should add to selection when clicking unselected category', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<category_filter_1.default value={['model']} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Tools')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Tools'));
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith(['model', 'tool']);
        });
        (0, vitest_1.it)('should clear all selections when clear button is clicked', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<category_filter_1.default value={['model', 'tool']} onChange={handleChange}/>);
            // Act - Find and click the close icon
            const closeIcon = container.querySelector('.text-text-quaternary');
            (0, vitest_1.expect)(closeIcon).toBeInTheDocument();
            react_1.fireEvent.click(closeIcon);
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith([]);
        });
    });
    (0, vitest_1.describe)('Search Functionality', () => {
        (0, vitest_1.it)('should filter categories based on search text', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.searchCategories')).toBeInTheDocument();
            });
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.searchCategories'), {
                target: { value: 'mod' },
            });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Extensions')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should be case insensitive', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.searchCategories')).toBeInTheDocument();
            });
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.searchCategories'), {
                target: { value: 'MOD' },
            });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Checkbox State', () => {
        (0, vitest_1.it)('should show checked checkbox for selected categories', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={['model']} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert - Check icon appears for checked state
            await (0, react_1.waitFor)(() => {
                const checkIcons = react_1.screen.getAllByTestId(/check-icon/);
                (0, vitest_1.expect)(checkIcons.length).toBeGreaterThan(0);
            });
        });
        (0, vitest_1.it)('should show unchecked checkbox for unselected categories', async () => {
            // Arrange
            (0, react_1.render)(<category_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert - No check icon for unchecked state
            await (0, react_1.waitFor)(() => {
                const checkIcons = react_1.screen.queryAllByTestId(/check-icon/);
                (0, vitest_1.expect)(checkIcons.length).toBe(0);
            });
        });
    });
});
// ==================== tag-filter.tsx Tests ====================
(0, vitest_1.describe)('TagFilter Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render with "All Tags" text when no selection', () => {
            // Arrange & Act
            (0, react_1.render)(<tag_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTags.allTags')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render selected tag labels', () => {
            // Arrange & Act
            (0, react_1.render)(<tag_filter_1.default value={['agent']} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show count badge for more than 2 selections', () => {
            // Arrange & Act
            (0, react_1.render)(<tag_filter_1.default value={['agent', 'rag', 'search']} onChange={vitest_1.vi.fn()}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('+1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show clear button when tags are selected', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<tag_filter_1.default value={['agent']} onChange={vitest_1.vi.fn()}/>);
            // Assert
            const closeIcon = container.querySelector('.text-text-quaternary');
            (0, vitest_1.expect)(closeIcon).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Dropdown Behavior', () => {
        (0, vitest_1.it)('should open dropdown on trigger click', async () => {
            // Arrange
            (0, react_1.render)(<tag_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should display tag options in dropdown', async () => {
            // Arrange
            (0, react_1.render)(<tag_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Search')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Image')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Selection Behavior', () => {
        (0, vitest_1.it)('should call onChange when tag is selected', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<tag_filter_1.default value={[]} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Agent'));
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith(['agent']);
        });
        (0, vitest_1.it)('should deselect when clicking selected tag', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<tag_filter_1.default value={['agent']} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                // Find the Agent option in dropdown
                const agentOptions = react_1.screen.getAllByText('Agent');
                react_1.fireEvent.click(agentOptions[agentOptions.length - 1]);
            });
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith([]);
        });
        (0, vitest_1.it)('should add to selection when clicking unselected tag', async () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            (0, react_1.render)(<tag_filter_1.default value={['agent']} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('RAG'));
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith(['agent', 'rag']);
        });
        (0, vitest_1.it)('should clear all selections when clear button is clicked', () => {
            // Arrange
            const handleChange = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<tag_filter_1.default value={['agent', 'rag']} onChange={handleChange}/>);
            // Act
            const closeIcon = container.querySelector('.text-text-quaternary');
            react_1.fireEvent.click(closeIcon);
            // Assert
            (0, vitest_1.expect)(handleChange).toHaveBeenCalledWith([]);
        });
    });
    (0, vitest_1.describe)('Search Functionality', () => {
        (0, vitest_1.it)('should filter tags based on search text', async () => {
            // Arrange
            (0, react_1.render)(<tag_filter_1.default value={[]} onChange={vitest_1.vi.fn()}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('pluginTags.searchTags')).toBeInTheDocument();
            });
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('pluginTags.searchTags'), {
                target: { value: 'rag' },
            });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Image')).not.toBeInTheDocument();
        });
    });
});
// ==================== index.tsx (FilterManagement) Tests ====================
(0, vitest_1.describe)('FilterManagement Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockInitFilters = createFilterState();
        mockPortalOpenState = false;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render all filter components', () => {
            // Arrange & Act
            renderFilterManagement();
            // Assert - All three filters should be present
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.allCategories')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTags.allTags')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.search')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with correct container classes', () => {
            // Arrange & Act
            const { container } = renderFilterManagement();
            // Assert
            const wrapper = container.firstChild;
            (0, vitest_1.expect)(wrapper).toHaveClass('flex', 'items-center', 'gap-2', 'self-stretch');
        });
    });
    (0, vitest_1.describe)('Initial State from Context', () => {
        (0, vitest_1.it)('should initialize with empty filters', () => {
            // Arrange
            mockInitFilters = createFilterState();
            // Act
            renderFilterManagement();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.allCategories')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTags.allTags')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('plugin.search')).toHaveValue('');
        });
        (0, vitest_1.it)('should initialize with pre-selected categories', () => {
            // Arrange
            mockInitFilters = createFilterState({ categories: ['model'] });
            // Act
            renderFilterManagement();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should initialize with pre-selected tags', () => {
            // Arrange
            mockInitFilters = createFilterState({ tags: ['agent'] });
            // Act
            renderFilterManagement();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should initialize with search query', () => {
            // Arrange
            mockInitFilters = createFilterState({ searchQuery: 'initial search' });
            // Act
            renderFilterManagement();
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByDisplayValue('initial search')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Filter Interactions', () => {
        (0, vitest_1.it)('should call onFilterChange when category is selected', async () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act - Open categories dropdown and select
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[0]); // Categories filter trigger
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Models'));
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledWith({
                categories: ['model'],
                tags: [],
                searchQuery: '',
            });
        });
        (0, vitest_1.it)('should call onFilterChange when tag is selected', async () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act - Open tags dropdown and select
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[1]); // Tags filter trigger
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Agent'));
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledWith({
                categories: [],
                tags: ['agent'],
                searchQuery: '',
            });
        });
        (0, vitest_1.it)('should call onFilterChange when search query changes', () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: 'test query' },
            });
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledWith({
                categories: [],
                tags: [],
                searchQuery: 'test query',
            });
        });
    });
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should accumulate filter changes', async () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act 1 - Select a category
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[0]);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Models'));
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith({
                categories: ['model'],
                tags: [],
                searchQuery: '',
            });
            // Close dropdown by clicking trigger again
            react_1.fireEvent.click(triggers[0]);
            // Act 2 - Select a tag (state should include previous category)
            react_1.fireEvent.click(triggers[1]);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Agent'));
            // Assert - Both category and tag should be in the state
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith({
                categories: ['model'],
                tags: ['agent'],
                searchQuery: '',
            });
        });
        (0, vitest_1.it)('should preserve other filters when updating one', () => {
            // Arrange
            mockInitFilters = createFilterState({
                categories: ['model'],
                tags: ['agent'],
            });
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act - Change only search query
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: 'new search' },
            });
            // Assert - Other filters should be preserved
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledWith({
                categories: ['model'],
                tags: ['agent'],
                searchQuery: 'new search',
            });
        });
    });
    (0, vitest_1.describe)('Integration Tests', () => {
        (0, vitest_1.it)('should handle complete filter workflow', async () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act 1 - Select categories
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[0]);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Models')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('Models'));
            react_1.fireEvent.click(triggers[0]); // Close
            // Act 2 - Select tags
            react_1.fireEvent.click(triggers[1]);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('RAG'));
            react_1.fireEvent.click(triggers[1]); // Close
            // Act 3 - Enter search
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: 'gpt' },
            });
            // Assert - Final state should include all filters
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith({
                categories: ['model'],
                tags: ['rag'],
                searchQuery: 'gpt',
            });
        });
        (0, vitest_1.it)('should handle filter clearing', async () => {
            // Arrange
            mockInitFilters = createFilterState({
                categories: ['model'],
                tags: ['agent'],
                searchQuery: 'test',
            });
            const onFilterChange = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act - Clear search
            react_1.fireEvent.change(react_1.screen.getByDisplayValue('test'), {
                target: { value: '' },
            });
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith({
                categories: ['model'],
                tags: ['agent'],
                searchQuery: '',
            });
            // Act - Clear categories (click clear button)
            const closeIcons = container.querySelectorAll('.text-text-quaternary');
            react_1.fireEvent.click(closeIcons[0]); // First close icon is for categories
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith({
                categories: [],
                tags: ['agent'],
                searchQuery: '',
            });
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty initial state', () => {
            // Arrange
            mockInitFilters = createFilterState();
            const onFilterChange = vitest_1.vi.fn();
            // Act
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Assert - Should render without errors
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.allCategories')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle multiple rapid filter changes', () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act - Rapid search input changes
            const searchInput = react_1.screen.getByPlaceholderText('plugin.search');
            react_1.fireEvent.change(searchInput, { target: { value: 'a' } });
            react_1.fireEvent.change(searchInput, { target: { value: 'ab' } });
            react_1.fireEvent.change(searchInput, { target: { value: 'abc' } });
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledTimes(3);
            (0, vitest_1.expect)(onFilterChange).toHaveBeenLastCalledWith(vitest_1.expect.objectContaining({ searchQuery: 'abc' }));
        });
        (0, vitest_1.it)('should handle special characters in search', () => {
            // Arrange
            const onFilterChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onFilterChange={onFilterChange}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('plugin.search'), {
                target: { value: '!@#$%^&*()' },
            });
            // Assert
            (0, vitest_1.expect)(onFilterChange).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ searchQuery: '!@#$%^&*()' }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTRGO0FBQzVGLG1DQUE2RDtBQUU3RCxrRUFBa0U7QUFFbEUsdURBQWdEO0FBQ2hELHlCQUF5QjtBQUN6QixtQ0FBc0M7QUFDdEMsNkNBQW9DO0FBQ3BDLG1DQUFrQztBQUNsQyw2Q0FBb0M7QUFFcEMsdURBQXVEO0FBRXZELG9DQUFvQztBQUNwQyxJQUFJLGVBQWUsR0FBZ0I7SUFDakMsVUFBVSxFQUFFLEVBQUU7SUFDZCxJQUFJLEVBQUUsRUFBRTtJQUNSLFdBQVcsRUFBRSxFQUFFO0NBQ2hCLENBQUE7QUFFRCxXQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLG9CQUFvQixFQUFFLENBQUMsUUFBc0QsRUFBRSxFQUFFLENBQy9FLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsQ0FBQztDQUN6QyxDQUFDLENBQUMsQ0FBQTtBQUVILHVCQUF1QjtBQUN2QixNQUFNLGNBQWMsR0FBRztJQUNyQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUNsQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUNoQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUMxQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtDQUNuQyxDQUFBO0FBRUQsTUFBTSxpQkFBaUIsR0FBb0Q7SUFDekUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ3pDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUN0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TSxDQUFDLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDN0QsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTthQUNoQyxDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBYyxDQUFDLENBQUMsb0JBQW9CLENBQ3pDLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUN2RCxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDYXRlZ29yeSwgVGFnIH0gZnJvbSAnLi9jb25zdGFudCdcbmltcG9ydCB0eXBlIHsgRmlsdGVyU3RhdGUgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgcmVuZGVySG9vaywgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gSW1wb3J0cyAoYWZ0ZXIgbW9ja3MpID09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCBDYXRlZ29yaWVzRmlsdGVyIGZyb20gJy4vY2F0ZWdvcnktZmlsdGVyJ1xuLy8gSW1wb3J0IHJlYWwgY29tcG9uZW50c1xuaW1wb3J0IEZpbHRlck1hbmFnZW1lbnQgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBTZWFyY2hCb3ggZnJvbSAnLi9zZWFyY2gtYm94J1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IFRhZ0ZpbHRlciBmcm9tICcuL3RhZy1maWx0ZXInXG5cbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgU2V0dXAgPT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBpbml0aWFsIGZpbHRlcnMgZnJvbSBjb250ZXh0XG5sZXQgbW9ja0luaXRGaWx0ZXJzOiBGaWx0ZXJTdGF0ZSA9IHtcbiAgY2F0ZWdvcmllczogW10sXG4gIHRhZ3M6IFtdLFxuICBzZWFyY2hRdWVyeTogJycsXG59XG5cbnZpLm1vY2soJy4uL2NvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQbHVnaW5QYWdlQ29udGV4dDogKHNlbGVjdG9yOiAodjogeyBmaWx0ZXJzOiBGaWx0ZXJTdGF0ZSB9KSA9PiBGaWx0ZXJTdGF0ZSkgPT5cbiAgICBzZWxlY3Rvcih7IGZpbHRlcnM6IG1vY2tJbml0RmlsdGVycyB9KSxcbn0pKVxuXG4vLyBNb2NrIGNhdGVnb3JpZXMgZGF0YVxuY29uc3QgbW9ja0NhdGVnb3JpZXMgPSBbXG4gIHsgbmFtZTogJ21vZGVsJywgbGFiZWw6ICdNb2RlbHMnIH0sXG4gIHsgbmFtZTogJ3Rvb2wnLCBsYWJlbDogJ1Rvb2xzJyB9LFxuICB7IG5hbWU6ICdleHRlbnNpb24nLCBsYWJlbDogJ0V4dGVuc2lvbnMnIH0sXG4gIHsgbmFtZTogJ2FnZW50JywgbGFiZWw6ICdBZ2VudHMnIH0sXG5dXG5cbmNvbnN0IG1vY2tDYXRlZ29yaWVzTWFwOiBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZywgbGFiZWw6IHN0cmluZyB9PiA9IHtcbiAgbW9kZWw6IHsgbmFtZTogJ21vZGVsJywgbGFiZWw6ICdNb2RlbHMnIH0sXG4gIHRvb2w6IHsgbmFtZTogJ3Rvb2wnLCBsYWJlbDogJ1Rvb2xzJyB9LFxuICBleHRlbnNpb246IHsgbmFtZTogJ2V4dGVuc2lvbicsIGxhYmVsOiAnRXh0ZW5zaW9ucycgfSxcbiAgYWdlbnQ6IHsgbmFtZTogJ2FnZW50JywgbGFiZWw6ICdBZ2VudHMnIH0sXG59XG5cbi8vIE1vY2sgdGFncyBkYXRhXG5jb25zdCBtb2NrVGFncyA9IFtcbiAgeyBuYW1lOiAnYWdlbnQnLCBsYWJlbDogJ0FnZW50JyB9LFxuICB7IG5hbWU6ICdyYWcnLCBsYWJlbDogJ1JBRycgfSxcbiAgeyBuYW1lOiAnc2VhcmNoJywgbGFiZWw6ICdTZWFyY2gnIH0sXG4gIHsgbmFtZTogJ2ltYWdlJywgbGFiZWw6ICdJbWFnZScgfSxcbl1cblxuY29uc3QgbW9ja1RhZ3NNYXA6IFJlY29yZDxzdHJpbmcsIHsgbmFtZTogc3RyaW5nLCBsYWJlbDogc3RyaW5nIH0+ID0ge1xuICBhZ2VudDogeyBuYW1lOiAnYWdlbnQnLCBsYWJlbDogJ0FnZW50JyB9LFxuICByYWc6IHsgbmFtZTogJ3JhZycsIGxhYmVsOiAnUkFHJyB9LFxuICBzZWFyY2g6IHsgbmFtZTogJ3NlYXJjaCcsIGxhYmVsOiAnU2VhcmNoJyB9LFxuICBpbWFnZTogeyBuYW1lOiAnaW1hZ2UnLCBsYWJlbDogJ0ltYWdlJyB9LFxufVxuXG52aS5tb2NrKCcuLi8uLi9ob29rcycsICgpID0+ICh7XG4gIHVzZUNhdGVnb3JpZXM6ICgpID0+ICh7XG4gICAgY2F0ZWdvcmllczogbW9ja0NhdGVnb3JpZXMsXG4gICAgY2F0ZWdvcmllc01hcDogbW9ja0NhdGVnb3JpZXNNYXAsXG4gIH0pLFxuICB1c2VUYWdzOiAoKSA9PiAoe1xuICAgIHRhZ3M6IG1vY2tUYWdzLFxuICAgIHRhZ3NNYXA6IG1vY2tUYWdzTWFwLFxuICAgIGdldFRhZ0xhYmVsOiAobmFtZTogc3RyaW5nKSA9PiBtb2NrVGFnc01hcFtuYW1lXT8ubGFiZWwgfHwgbmFtZSxcbiAgfSksXG59KSlcblxuLy8gVHJhY2sgcG9ydGFsIG9wZW4gc3RhdGUgZm9yIHRlc3RpbmdcbmxldCBtb2NrUG9ydGFsT3BlblN0YXRlID0gZmFsc2VcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+ICh7XG4gIFBvcnRhbFRvRm9sbG93RWxlbTogKHsgY2hpbGRyZW4sIG9wZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlLCBvcGVuOiBib29sZWFuIH0pID0+IHtcbiAgICBtb2NrUG9ydGFsT3BlblN0YXRlID0gb3BlblxuICAgIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRhaW5lclwiIGRhdGEtb3Blbj17b3Blbn0+e2NoaWxkcmVufTwvZGl2PlxuICB9LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyOiAoeyBjaGlsZHJlbiwgb25DbGljayB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIG9uQ2xpY2s6ICgpID0+IHZvaWQgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtdHJpZ2dlclwiIG9uQ2xpY2s9e29uQ2xpY2t9PntjaGlsZHJlbn08L2Rpdj5cbiAgKSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudDogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiB7XG4gICAgaWYgKCFtb2NrUG9ydGFsT3BlblN0YXRlKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1jb250ZW50XCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PntjaGlsZHJlbn08L2Rpdj5cbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBUZXN0IFV0aWxpdGllcyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVGaWx0ZXJTdGF0ZSA9IChvdmVycmlkZXM6IFBhcnRpYWw8RmlsdGVyU3RhdGU+ID0ge30pOiBGaWx0ZXJTdGF0ZSA9PiAoe1xuICBjYXRlZ29yaWVzOiBbXSxcbiAgdGFnczogW10sXG4gIHNlYXJjaFF1ZXJ5OiAnJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgcmVuZGVyRmlsdGVyTWFuYWdlbWVudCA9IChvbkZpbHRlckNoYW5nZSA9IHZpLmZuKCkpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gcmVuZGVyKDxGaWx0ZXJNYW5hZ2VtZW50IG9uRmlsdGVyQ2hhbmdlPXtvbkZpbHRlckNoYW5nZX0gLz4pXG4gIHJldHVybiB7IC4uLnJlc3VsdCwgb25GaWx0ZXJDaGFuZ2UgfVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBjb25zdGFudC50cyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ2NvbnN0YW50LnRzIC0gVHlwZSBEZWZpbml0aW9ucycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBkZWZpbmUgVGFnIHR5cGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCB0YWc6IFRhZyA9IHtcbiAgICAgIGlkOiAndGVzdC1pZCcsXG4gICAgICBuYW1lOiAndGVzdC10YWcnLFxuICAgICAgdHlwZTogJ2N1c3RvbScsXG4gICAgICBiaW5kaW5nX2NvdW50OiA1LFxuICAgIH1cblxuICAgIC8vIEFzc2VydFxuICAgIGV4cGVjdCh0YWcuaWQpLnRvQmUoJ3Rlc3QtaWQnKVxuICAgIGV4cGVjdCh0YWcubmFtZSkudG9CZSgndGVzdC10YWcnKVxuICAgIGV4cGVjdCh0YWcudHlwZSkudG9CZSgnY3VzdG9tJylcbiAgICBleHBlY3QodGFnLmJpbmRpbmdfY291bnQpLnRvQmUoNSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGRlZmluZSBDYXRlZ29yeSB0eXBlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3QgY2F0ZWdvcnk6IENhdGVnb3J5ID0ge1xuICAgICAgbmFtZTogJ21vZGVsJyxcbiAgICAgIGJpbmRpbmdfY291bnQ6IDEwLFxuICAgIH1cblxuICAgIC8vIEFzc2VydFxuICAgIGV4cGVjdChjYXRlZ29yeS5uYW1lKS50b0JlKCdtb2RlbCcpXG4gICAgZXhwZWN0KGNhdGVnb3J5LmJpbmRpbmdfY291bnQpLnRvQmUoMTApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBlbmZvcmNlIENhdGVnb3J5IG5hbWUgYXMgc3BlY2lmaWMgdW5pb24gdHlwZScsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlIC0gVmFsaWQgY2F0ZWdvcnkgbmFtZXNcbiAgICBjb25zdCB2YWxpZE5hbWVzOiBBcnJheTxDYXRlZ29yeVsnbmFtZSddPiA9IFsnbW9kZWwnLCAndG9vbCcsICdleHRlbnNpb24nLCAnYnVuZGxlJ11cblxuICAgIC8vIEFzc2VydFxuICAgIHZhbGlkTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgY2F0ZWdvcnk6IENhdGVnb3J5ID0geyBuYW1lLCBiaW5kaW5nX2NvdW50OiAwIH1cbiAgICAgIGV4cGVjdChbJ21vZGVsJywgJ3Rvb2wnLCAnZXh0ZW5zaW9uJywgJ2J1bmRsZSddKS50b0NvbnRhaW4oY2F0ZWdvcnkubmFtZSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gc3RvcmUudHMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdzdG9yZS50cyAtIFp1c3RhbmQgU3RvcmUnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIFJlc2V0IHN0b3JlIHRvIGluaXRpYWwgc3RhdGVcbiAgICBjb25zdCB7IHNldFN0YXRlIH0gPSB1c2VTdG9yZVxuICAgIHNldFN0YXRlKHtcbiAgICAgIHRhZ0xpc3Q6IFtdLFxuICAgICAgY2F0ZWdvcnlMaXN0OiBbXSxcbiAgICAgIHNob3dUYWdNYW5hZ2VtZW50TW9kYWw6IGZhbHNlLFxuICAgICAgc2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsOiBmYWxzZSxcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBlbXB0eSB0YWdMaXN0IGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLnRhZ0xpc3QpKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgZW1wdHkgY2F0ZWdvcnlMaXN0IGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLmNhdGVnb3J5TGlzdCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzaG93VGFnTWFuYWdlbWVudE1vZGFsIGZhbHNlIGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLnNob3dUYWdNYW5hZ2VtZW50TW9kYWwpKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsIGZhbHNlIGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLnNob3dDYXRlZ29yeU1hbmFnZW1lbnRNb2RhbCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2V0VGFnTGlzdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0YWdMaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1RhZ0xpc3Q6IFRhZ1tdID0gW1xuICAgICAgICB7IGlkOiAnMScsIG5hbWU6ICd0YWcxJywgdHlwZTogJ2N1c3RvbScsIGJpbmRpbmdfY291bnQ6IDEgfSxcbiAgICAgICAgeyBpZDogJzInLCBuYW1lOiAndGFnMicsIHR5cGU6ICdjdXN0b20nLCBiaW5kaW5nX2NvdW50OiAyIH0sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3RvcmUoKSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFRhZ0xpc3QobW9ja1RhZ0xpc3QpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC50YWdMaXN0KS50b0VxdWFsKG1vY2tUYWdMaXN0KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgdGFnTGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKCkpXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRUYWdMaXN0KHVuZGVmaW5lZClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnRhZ0xpc3QpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0YWdMaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3RvcmUoKSlcblxuICAgICAgLy8gRmlyc3Qgc2V0IHNvbWUgdGFnc1xuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0VGFnTGlzdChbeyBpZDogJzEnLCBuYW1lOiAndGFnMScsIHR5cGU6ICdjdXN0b20nLCBiaW5kaW5nX2NvdW50OiAxIH1dKVxuICAgICAgfSlcblxuICAgICAgLy8gQWN0IC0gQ2xlYXIgdGhlIGxpc3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFRhZ0xpc3QoW10pXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC50YWdMaXN0KS50b0VxdWFsKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3NldENhdGVnb3J5TGlzdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjYXRlZ29yeUxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ2F0ZWdvcnlMaXN0OiBDYXRlZ29yeVtdID0gW1xuICAgICAgICB7IG5hbWU6ICdtb2RlbCcsIGJpbmRpbmdfY291bnQ6IDUgfSxcbiAgICAgICAgeyBuYW1lOiAndG9vbCcsIGJpbmRpbmdfY291bnQ6IDEwIH0sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3RvcmUoKSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldENhdGVnb3J5TGlzdChtb2NrQ2F0ZWdvcnlMaXN0KVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY2F0ZWdvcnlMaXN0KS50b0VxdWFsKG1vY2tDYXRlZ29yeUxpc3QpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjYXRlZ29yeUxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTdG9yZSgpKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0Q2F0ZWdvcnlMaXN0KHVuZGVmaW5lZClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhdGVnb3J5TGlzdCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2V0U2hvd1RhZ01hbmFnZW1lbnRNb2RhbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCBzaG93VGFnTWFuYWdlbWVudE1vZGFsIHRvIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTdG9yZSgpKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2hvd1RhZ01hbmFnZW1lbnRNb2RhbCh0cnVlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd1RhZ01hbmFnZW1lbnRNb2RhbCkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBzaG93VGFnTWFuYWdlbWVudE1vZGFsIHRvIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3RvcmUoKSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFNob3dUYWdNYW5hZ2VtZW50TW9kYWwodHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2hvd1RhZ01hbmFnZW1lbnRNb2RhbChmYWxzZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnNob3dUYWdNYW5hZ2VtZW50TW9kYWwpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2V0U2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2V0IHNob3dDYXRlZ29yeU1hbmFnZW1lbnRNb2RhbCB0byB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3RvcmUoKSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFNob3dDYXRlZ29yeU1hbmFnZW1lbnRNb2RhbCh0cnVlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHNob3dDYXRlZ29yeU1hbmFnZW1lbnRNb2RhbCB0byBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVN0b3JlKCkpXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRTaG93Q2F0ZWdvcnlNYW5hZ2VtZW50TW9kYWwodHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsKGZhbHNlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0b3JlIElzb2xhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHNlcGFyYXRlIHN0YXRlIGZvciBlYWNoIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1RhZ0xpc3Q6IFRhZ1tdID0gW3sgaWQ6ICcxJywgbmFtZTogJ3RhZzEnLCB0eXBlOiAnY3VzdG9tJywgYmluZGluZ19jb3VudDogMSB9XVxuICAgICAgY29uc3QgbW9ja0NhdGVnb3J5TGlzdDogQ2F0ZWdvcnlbXSA9IFt7IG5hbWU6ICdtb2RlbCcsIGJpbmRpbmdfY291bnQ6IDUgfV1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTdG9yZSgpKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0VGFnTGlzdChtb2NrVGFnTGlzdClcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0Q2F0ZWdvcnlMaXN0KG1vY2tDYXRlZ29yeUxpc3QpXG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFNob3dUYWdNYW5hZ2VtZW50TW9kYWwodHJ1ZSlcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2hvd0NhdGVnb3J5TWFuYWdlbWVudE1vZGFsKGZhbHNlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIHN0YXRlcyBhcmUgaW5kZXBlbmRlbnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC50YWdMaXN0KS50b0VxdWFsKG1vY2tUYWdMaXN0KVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhdGVnb3J5TGlzdCkudG9FcXVhbChtb2NrQ2F0ZWdvcnlMaXN0KVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnNob3dUYWdNYW5hZ2VtZW50TW9kYWwpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zaG93Q2F0ZWdvcnlNYW5hZ2VtZW50TW9kYWwpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IHNlYXJjaC1ib3gudHN4IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnU2VhcmNoQm94IENvbXBvbmVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbnB1dCB3aXRoIGNvcnJlY3QgcGxhY2Vob2xkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFNlYXJjaEJveCBzZWFyY2hRdWVyeT1cIlwiIG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBwcm92aWRlZCBzZWFyY2hRdWVyeSB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHNlYXJjaFF1ZXJ5PVwidGVzdCBxdWVyeVwiIG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5RGlzcGxheVZhbHVlKCd0ZXN0IHF1ZXJ5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VhcmNoIGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTZWFyY2hCb3ggc2VhcmNoUXVlcnk9XCJcIiBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIElucHV0IHNob3VsZCBoYXZlIHNob3dMZWZ0SWNvbiB3aGljaCByZW5kZXJzIHNlYXJjaCBpY29uXG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LVxcXFxbMjAwcHhcXFxcXScpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIGlucHV0IHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFNlYXJjaEJveCBzZWFyY2hRdWVyeT1cIlwiIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoJyksIHtcbiAgICAgICAgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3IHNlYXJjaCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldyBzZWFyY2gnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBlbXB0eSBzdHJpbmcgd2hlbiBjbGVhcmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggc2VhcmNoUXVlcnk9XCJleGlzdGluZ1wiIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5RGlzcGxheVZhbHVlKCdleGlzdGluZycpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJycgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIHR5cGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHNlYXJjaFF1ZXJ5PVwiXCIgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gLz4pXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2FiJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2FiYycgfSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKCdhYmMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggc2VhcmNoUXVlcnk9XCJcIiBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJyFAIyQlXiYqKCknIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCchQCMkJV4mKigpJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggc2VhcmNoUXVlcnk9XCJcIiBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJ+S4reaWh+aQnOe0oiDwn5SNJyB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgn5Lit5paH5pCc57SiIPCflI0nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgaW5wdXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBsb25nVGV4dCA9ICdhJy5yZXBlYXQoNTAwKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggc2VhcmNoUXVlcnk9XCJcIiBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogbG9uZ1RleHQgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgobG9uZ1RleHQpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IGNhdGVnb3J5LWZpbHRlci50c3ggVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDYXRlZ29yaWVzRmlsdGVyIENvbXBvbmVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IGZhbHNlXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIFwiQWxsIENhdGVnb3JpZXNcIiB0ZXh0IHdoZW4gbm8gc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDYXRlZ29yaWVzRmlsdGVyIHZhbHVlPXtbXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYWxsQ2F0ZWdvcmllcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRyb3Bkb3duIGFycm93IHdoZW4gbm8gc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQXJyb3cgaWNvbiBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgY29uc3QgYXJyb3dJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3QoYXJyb3dJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlbGVjdGVkIGNhdGVnb3J5IGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17Wydtb2RlbCddfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGVscycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjbGVhciBidXR0b24gd2hlbiBjYXRlZ29yaWVzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENhdGVnb3JpZXNGaWx0ZXIgdmFsdWU9e1snbW9kZWwnXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDbG9zZSBpY29uIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBjb25zdCBjbG9zZUljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGV4cGVjdChjbG9zZUljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvdW50IGJhZGdlIGZvciBtb3JlIHRoYW4gMiBzZWxlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDYXRlZ29yaWVzRmlsdGVyIHZhbHVlPXtbJ21vZGVsJywgJ3Rvb2wnLCAnZXh0ZW5zaW9uJ119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnKzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Ryb3Bkb3duIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBkcm9wZG93biBvbiB0cmlnZ2VyIGNsaWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxDYXRlZ29yaWVzRmlsdGVyIHZhbHVlPXtbXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjYXRlZ29yeSBvcHRpb25zIGluIGRyb3Bkb3duJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxDYXRlZ29yaWVzRmlsdGVyIHZhbHVlPXtbXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVG9vbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRXh0ZW5zaW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNlYXJjaCBpbnB1dCBpbiBkcm9wZG93bicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoQ2F0ZWdvcmllcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlbGVjdGlvbiBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiBjYXRlZ29yeSBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBjbGljayBjYXRlZ29yeVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydtb2RlbCddKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlc2VsZWN0IHdoZW4gY2xpY2tpbmcgc2VsZWN0ZWQgY2F0ZWdvcnknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPENhdGVnb3JpZXNGaWx0ZXIgdmFsdWU9e1snbW9kZWwnXX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAvLyBNdWx0aXBsZSBcIk1vZGVsc1wiIHRleHRzIGV4aXN0IC0gb25lIGluIHRyaWdnZXIsIG9uZSBpbiBkcm9wZG93blxuICAgICAgICBjb25zdCBhbGxNb2RlbHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdNb2RlbHMnKVxuICAgICAgICBleHBlY3QoYWxsTW9kZWxzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDEpXG4gICAgICB9KVxuICAgICAgLy8gQ2xpY2sgdGhlIG9uZSBpbiB0aGUgZHJvcGRvd24gKGluc2lkZSBwb3J0YWwtY29udGVudClcbiAgICAgIGNvbnN0IHBvcnRhbENvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgIGNvbnN0IG1vZGVsc0luRHJvcGRvd24gPSBwb3J0YWxDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5zeXN0ZW0tc20tbWVkaXVtJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobW9kZWxzSW5Ecm9wZG93bi5wYXJlbnRFbGVtZW50ISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhZGQgdG8gc2VsZWN0aW9uIHdoZW4gY2xpY2tpbmcgdW5zZWxlY3RlZCBjYXRlZ29yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17Wydtb2RlbCddfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29scycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1Rvb2xzJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydtb2RlbCcsICd0b29sJ10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgYWxsIHNlbGVjdGlvbnMgd2hlbiBjbGVhciBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENhdGVnb3JpZXNGaWx0ZXIgdmFsdWU9e1snbW9kZWwnLCAndG9vbCddfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gRmluZCBhbmQgY2xpY2sgdGhlIGNsb3NlIGljb25cbiAgICAgIGNvbnN0IGNsb3NlSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZXhwZWN0KGNsb3NlSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlSWNvbiEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2VhcmNoIEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmaWx0ZXIgY2F0ZWdvcmllcyBiYXNlZCBvbiBzZWFyY2ggdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ3BsdWdpbi5zZWFyY2hDYXRlZ29yaWVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaENhdGVnb3JpZXMnKSwge1xuICAgICAgICB0YXJnZXQ6IHsgdmFsdWU6ICdtb2QnIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnRXh0ZW5zaW9ucycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJlIGNhc2UgaW5zZW5zaXRpdmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPENhdGVnb3JpZXNGaWx0ZXIgdmFsdWU9e1tdfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoQ2F0ZWdvcmllcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ3BsdWdpbi5zZWFyY2hDYXRlZ29yaWVzJyksIHtcbiAgICAgICAgdGFyZ2V0OiB7IHZhbHVlOiAnTU9EJyB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDaGVja2JveCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgY2hlY2tlZCBjaGVja2JveCBmb3Igc2VsZWN0ZWQgY2F0ZWdvcmllcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8Q2F0ZWdvcmllc0ZpbHRlciB2YWx1ZT17Wydtb2RlbCddfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgaWNvbiBhcHBlYXJzIGZvciBjaGVja2VkIHN0YXRlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tJY29ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgvY2hlY2staWNvbi8pXG4gICAgICAgIGV4cGVjdChjaGVja0ljb25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdW5jaGVja2VkIGNoZWNrYm94IGZvciB1bnNlbGVjdGVkIGNhdGVnb3JpZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPENhdGVnb3JpZXNGaWx0ZXIgdmFsdWU9e1tdfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTm8gY2hlY2sgaWNvbiBmb3IgdW5jaGVja2VkIHN0YXRlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2hlY2tJY29ucyA9IHNjcmVlbi5xdWVyeUFsbEJ5VGVzdElkKC9jaGVjay1pY29uLylcbiAgICAgICAgZXhwZWN0KGNoZWNrSWNvbnMubGVuZ3RoKS50b0JlKDApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSB0YWctZmlsdGVyLnRzeCBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1RhZ0ZpbHRlciBDb21wb25lbnQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBcIkFsbCBUYWdzXCIgdGV4dCB3aGVuIG5vIHNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8VGFnRmlsdGVyIHZhbHVlPXtbXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW5UYWdzLmFsbFRhZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWxlY3RlZCB0YWcgbGFiZWxzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxUYWdGaWx0ZXIgdmFsdWU9e1snYWdlbnQnXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjb3VudCBiYWRnZSBmb3IgbW9yZSB0aGFuIDIgc2VsZWN0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8VGFnRmlsdGVyIHZhbHVlPXtbJ2FnZW50JywgJ3JhZycsICdzZWFyY2gnXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcrMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjbGVhciBidXR0b24gd2hlbiB0YWdzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17WydhZ2VudCddfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY2xvc2VJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtcXVhdGVybmFyeScpXG4gICAgICBleHBlY3QoY2xvc2VJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRHJvcGRvd24gQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGRyb3Bkb3duIG9uIHRyaWdnZXIgY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgdGFnIG9wdGlvbnMgaW4gZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUkFHJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJbWFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlbGVjdGlvbiBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiB0YWcgaXMgc2VsZWN0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17W119IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2FnZW50J10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGVzZWxlY3Qgd2hlbiBjbGlja2luZyBzZWxlY3RlZCB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17WydhZ2VudCddfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIEZpbmQgdGhlIEFnZW50IG9wdGlvbiBpbiBkcm9wZG93blxuICAgICAgICBjb25zdCBhZ2VudE9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdBZ2VudCcpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhhZ2VudE9wdGlvbnNbYWdlbnRPcHRpb25zLmxlbmd0aCAtIDFdKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhZGQgdG8gc2VsZWN0aW9uIHdoZW4gY2xpY2tpbmcgdW5zZWxlY3RlZCB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFRhZ0ZpbHRlciB2YWx1ZT17WydhZ2VudCddfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdSQUcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdSQUcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2FnZW50JywgJ3JhZyddKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIGFsbCBzZWxlY3Rpb25zIHdoZW4gY2xlYXIgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxUYWdGaWx0ZXIgdmFsdWU9e1snYWdlbnQnLCAncmFnJ119IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNsb3NlSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlSWNvbiEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2VhcmNoIEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmaWx0ZXIgdGFncyBiYXNlZCBvbiBzZWFyY2ggdGV4dCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8VGFnRmlsdGVyIHZhbHVlPXtbXX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luVGFncy5zZWFyY2hUYWdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luVGFncy5zZWFyY2hUYWdzJyksIHtcbiAgICAgICAgdGFyZ2V0OiB7IHZhbHVlOiAncmFnJyB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUkFHJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0ltYWdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IGluZGV4LnRzeCAoRmlsdGVyTWFuYWdlbWVudCkgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdGaWx0ZXJNYW5hZ2VtZW50IENvbXBvbmVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0luaXRGaWx0ZXJzID0gY3JlYXRlRmlsdGVyU3RhdGUoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGZpbHRlciBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyRmlsdGVyTWFuYWdlbWVudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCB0aHJlZSBmaWx0ZXJzIHNob3VsZCBiZSBwcmVzZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmFsbENhdGVnb3JpZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpblRhZ3MuYWxsVGFncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGNvbnRhaW5lciBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckZpbHRlck1hbmFnZW1lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdmbGV4JywgJ2l0ZW1zLWNlbnRlcicsICdnYXAtMicsICdzZWxmLXN0cmV0Y2gnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0luaXRpYWwgU3RhdGUgZnJvbSBDb250ZXh0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGVtcHR5IGZpbHRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSW5pdEZpbHRlcnMgPSBjcmVhdGVGaWx0ZXJTdGF0ZSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsdGVyTWFuYWdlbWVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hbGxDYXRlZ29yaWVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW5UYWdzLmFsbFRhZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpKS50b0hhdmVWYWx1ZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggcHJlLXNlbGVjdGVkIGNhdGVnb3JpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSW5pdEZpbHRlcnMgPSBjcmVhdGVGaWx0ZXJTdGF0ZSh7IGNhdGVnb3JpZXM6IFsnbW9kZWwnXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbHRlck1hbmFnZW1lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwcmUtc2VsZWN0ZWQgdGFncycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJbml0RmlsdGVycyA9IGNyZWF0ZUZpbHRlclN0YXRlKHsgdGFnczogWydhZ2VudCddIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyRmlsdGVyTWFuYWdlbWVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggc2VhcmNoIHF1ZXJ5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0luaXRGaWx0ZXJzID0gY3JlYXRlRmlsdGVyU3RhdGUoeyBzZWFyY2hRdWVyeTogJ2luaXRpYWwgc2VhcmNoJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckZpbHRlck1hbmFnZW1lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlEaXNwbGF5VmFsdWUoJ2luaXRpYWwgc2VhcmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGaWx0ZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZpbHRlckNoYW5nZSB3aGVuIGNhdGVnb3J5IGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gT3BlbiBjYXRlZ29yaWVzIGRyb3Bkb3duIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXJzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcnNbMF0pIC8vIENhdGVnb3JpZXMgZmlsdGVyIHRyaWdnZXJcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbHMnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25GaWx0ZXJDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgY2F0ZWdvcmllczogWydtb2RlbCddLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICcnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmlsdGVyQ2hhbmdlIHdoZW4gdGFnIGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gT3BlbiB0YWdzIGRyb3Bkb3duIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXJzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcnNbMV0pIC8vIFRhZ3MgZmlsdGVyIHRyaWdnZXJcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uRmlsdGVyQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIGNhdGVnb3JpZXM6IFtdLFxuICAgICAgICB0YWdzOiBbJ2FnZW50J10sXG4gICAgICAgIHNlYXJjaFF1ZXJ5OiAnJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZpbHRlckNoYW5nZSB3aGVuIHNlYXJjaCBxdWVyeSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJ3Rlc3QgcXVlcnknIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkZpbHRlckNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBjYXRlZ29yaWVzOiBbXSxcbiAgICAgICAgdGFnczogW10sXG4gICAgICAgIHNlYXJjaFF1ZXJ5OiAndGVzdCBxdWVyeScsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhY2N1bXVsYXRlIGZpbHRlciBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IDEgLSBTZWxlY3QgYSBjYXRlZ29yeVxuICAgICAgY29uc3QgdHJpZ2dlcnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2Vyc1swXSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpXG5cbiAgICAgIGV4cGVjdChvbkZpbHRlckNoYW5nZSkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKHtcbiAgICAgICAgY2F0ZWdvcmllczogWydtb2RlbCddLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQ2xvc2UgZHJvcGRvd24gYnkgY2xpY2tpbmcgdHJpZ2dlciBhZ2FpblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXJzWzBdKVxuXG4gICAgICAvLyBBY3QgMiAtIFNlbGVjdCBhIHRhZyAoc3RhdGUgc2hvdWxkIGluY2x1ZGUgcHJldmlvdXMgY2F0ZWdvcnkpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcnNbMV0pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQm90aCBjYXRlZ29yeSBhbmQgdGFnIHNob3VsZCBiZSBpbiB0aGUgc3RhdGVcbiAgICAgIGV4cGVjdChvbkZpbHRlckNoYW5nZSkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKHtcbiAgICAgICAgY2F0ZWdvcmllczogWydtb2RlbCddLFxuICAgICAgICB0YWdzOiBbJ2FnZW50J10sXG4gICAgICAgIHNlYXJjaFF1ZXJ5OiAnJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgb3RoZXIgZmlsdGVycyB3aGVuIHVwZGF0aW5nIG9uZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJbml0RmlsdGVycyA9IGNyZWF0ZUZpbHRlclN0YXRlKHtcbiAgICAgICAgY2F0ZWdvcmllczogWydtb2RlbCddLFxuICAgICAgICB0YWdzOiBbJ2FnZW50J10sXG4gICAgICB9KVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIG9ubHkgc2VhcmNoIHF1ZXJ5XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJ25ldyBzZWFyY2gnIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPdGhlciBmaWx0ZXJzIHNob3VsZCBiZSBwcmVzZXJ2ZWRcbiAgICAgIGV4cGVjdChvbkZpbHRlckNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBjYXRlZ29yaWVzOiBbJ21vZGVsJ10sXG4gICAgICAgIHRhZ3M6IFsnYWdlbnQnXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICduZXcgc2VhcmNoJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24gVGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxldGUgZmlsdGVyIHdvcmtmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IDEgLSBTZWxlY3QgY2F0ZWdvcmllc1xuICAgICAgY29uc3QgdHJpZ2dlcnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2Vyc1swXSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWxzJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcnNbMF0pIC8vIENsb3NlXG5cbiAgICAgIC8vIEFjdCAyIC0gU2VsZWN0IHRhZ3NcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2Vyc1sxXSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUkFHJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnUkFHJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcnNbMV0pIC8vIENsb3NlXG5cbiAgICAgIC8vIEFjdCAzIC0gRW50ZXIgc2VhcmNoXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJ2dwdCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEZpbmFsIHN0YXRlIHNob3VsZCBpbmNsdWRlIGFsbCBmaWx0ZXJzXG4gICAgICBleHBlY3Qob25GaWx0ZXJDaGFuZ2UpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aCh7XG4gICAgICAgIGNhdGVnb3JpZXM6IFsnbW9kZWwnXSxcbiAgICAgICAgdGFnczogWydyYWcnXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICdncHQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsdGVyIGNsZWFyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0luaXRGaWx0ZXJzID0gY3JlYXRlRmlsdGVyU3RhdGUoe1xuICAgICAgICBjYXRlZ29yaWVzOiBbJ21vZGVsJ10sXG4gICAgICAgIHRhZ3M6IFsnYWdlbnQnXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICd0ZXN0JyxcbiAgICAgIH0pXG4gICAgICBjb25zdCBvbkZpbHRlckNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gQ2xlYXIgc2VhcmNoXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgndGVzdCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJycgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uRmlsdGVyQ2hhbmdlKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoe1xuICAgICAgICBjYXRlZ29yaWVzOiBbJ21vZGVsJ10sXG4gICAgICAgIHRhZ3M6IFsnYWdlbnQnXSxcbiAgICAgICAgc2VhcmNoUXVlcnk6ICcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0IC0gQ2xlYXIgY2F0ZWdvcmllcyAoY2xpY2sgY2xlYXIgYnV0dG9uKVxuICAgICAgY29uc3QgY2xvc2VJY29ucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlSWNvbnNbMF0pIC8vIEZpcnN0IGNsb3NlIGljb24gaXMgZm9yIGNhdGVnb3JpZXNcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25GaWx0ZXJDaGFuZ2UpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aCh7XG4gICAgICAgIGNhdGVnb3JpZXM6IFtdLFxuICAgICAgICB0YWdzOiBbJ2FnZW50J10sXG4gICAgICAgIHNlYXJjaFF1ZXJ5OiAnJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBpbml0aWFsIHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0luaXRGaWx0ZXJzID0gY3JlYXRlRmlsdGVyU3RhdGUoKVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGaWx0ZXJNYW5hZ2VtZW50IG9uRmlsdGVyQ2hhbmdlPXtvbkZpbHRlckNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYWxsQ2F0ZWdvcmllcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHJhcGlkIGZpbHRlciBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0IC0gUmFwaWQgc2VhcmNoIGlucHV0IGNoYW5nZXNcbiAgICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdwbHVnaW4uc2VhcmNoJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2VhcmNoSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYScgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzZWFyY2hJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzZWFyY2hJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYmMnIH0gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25GaWx0ZXJDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgICAgZXhwZWN0KG9uRmlsdGVyQ2hhbmdlKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgc2VhcmNoUXVlcnk6ICdhYmMnIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gc2VhcmNoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25GaWx0ZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEZpbHRlck1hbmFnZW1lbnQgb25GaWx0ZXJDaGFuZ2U9e29uRmlsdGVyQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgncGx1Z2luLnNlYXJjaCcpLCB7XG4gICAgICAgIHRhcmdldDogeyB2YWx1ZTogJyFAIyQlXiYqKCknIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkZpbHRlckNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgc2VhcmNoUXVlcnk6ICchQCMkJV4mKigpJyB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==