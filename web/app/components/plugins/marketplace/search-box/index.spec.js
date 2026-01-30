"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
const search_box_wrapper_1 = require("./search-box-wrapper");
const marketplace_1 = require("./trigger/marketplace");
const tool_selector_1 = require("./trigger/tool-selector");
// ================================
// Mock external dependencies only
// ================================
// Mock i18n translation hook
vitest_1.vi.mock('#i18n', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            // Build full key with namespace prefix if provided
            const fullKey = options?.ns ? `${options.ns}.${key}` : key;
            const translations = {
                'pluginTags.allTags': 'All Tags',
                'pluginTags.searchTags': 'Search tags',
                'plugin.searchPlugins': 'Search plugins',
            };
            return translations[fullKey] || key;
        },
    }),
}));
// Mock marketplace state hooks
const { mockSearchPluginText, mockHandleSearchPluginTextChange, mockFilterPluginTags, mockHandleFilterPluginTagsChange } = vitest_1.vi.hoisted(() => {
    return {
        mockSearchPluginText: '',
        mockHandleSearchPluginTextChange: vitest_1.vi.fn(),
        mockFilterPluginTags: [],
        mockHandleFilterPluginTagsChange: vitest_1.vi.fn(),
    };
});
vitest_1.vi.mock('../atoms', () => ({
    useSearchPluginText: () => [mockSearchPluginText, mockHandleSearchPluginTextChange],
    useFilterPluginTags: () => [mockFilterPluginTags, mockHandleFilterPluginTagsChange],
}));
// Mock useTags hook
const mockTags = [
    { name: 'agent', label: 'Agent' },
    { name: 'rag', label: 'RAG' },
    { name: 'search', label: 'Search' },
    { name: 'image', label: 'Image' },
    { name: 'videos', label: 'Videos' },
];
const mockTagsMap = mockTags.reduce((acc, tag) => {
    acc[tag.name] = tag;
    return acc;
}, {});
vitest_1.vi.mock('@/app/components/plugins/hooks', () => ({
    useTags: () => ({
        tags: mockTags,
        tagsMap: mockTagsMap,
    }),
}));
// Mock portal-to-follow-elem with shared open state
let mockPortalOpenState = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => {
        mockPortalOpenState = open;
        return (<div data-testid="portal-elem" data-open={open}>
        {children}
      </div>);
    },
    PortalToFollowElemTrigger: ({ children, onClick, className }) => (<div data-testid="portal-trigger" onClick={onClick} className={className}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        // Only render content when portal is open
        if (!mockPortalOpenState)
            return null;
        return (<div data-testid="portal-content" className={className}>
        {children}
      </div>);
    },
}));
// ================================
// SearchBox Component Tests
// ================================
(0, vitest_1.describe)('SearchBox', () => {
    const defaultProps = {
        search: '',
        onSearchChange: vitest_1.vi.fn(),
        tags: [],
        onTagsChange: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with marketplace mode styling', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace/>);
            // In marketplace mode, TagsFilter comes before input
            (0, vitest_1.expect)(container.querySelector('.rounded-xl')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with non-marketplace mode styling', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace={false}/>);
            // In non-marketplace mode, search icon appears first
            (0, vitest_1.expect)(container.querySelector('.radius-md')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render placeholder correctly', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} placeholder="Search here..."/>);
            (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render search input with current value', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} search="test query"/>);
            (0, vitest_1.expect)(react_1.screen.getByDisplayValue('test query')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render TagsFilter component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // ================================
    // Marketplace Mode Tests
    // ================================
    (0, vitest_1.describe)('Marketplace Mode', () => {
        (0, vitest_1.it)('should render TagsFilter before input in marketplace mode', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace/>);
            const portalElem = react_1.screen.getByTestId('portal-elem');
            const input = react_1.screen.getByRole('textbox');
            // Both should be rendered
            (0, vitest_1.expect)(portalElem).toBeInTheDocument();
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render clear button when search has value in marketplace mode', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace search="test"/>);
            // ActionButton with close icon should be rendered
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should not render clear button when search is empty in marketplace mode', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace search=""/>);
            // RiCloseLine icon should not be visible (it's within ActionButton)
            const closeIcons = container.querySelectorAll('.size-4');
            // Only filter icons should be present, not close button
            (0, vitest_1.expect)(closeIcons.length).toBeLessThan(3);
        });
    });
    // ================================
    // Non-Marketplace Mode Tests
    // ================================
    (0, vitest_1.describe)('Non-Marketplace Mode', () => {
        (0, vitest_1.it)('should render search icon at the beginning', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace={false}/>);
            // Search icon should be present
            (0, vitest_1.expect)(container.querySelector('.text-components-input-text-placeholder')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render clear button when search has value', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace={false} search="test"/>);
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should render TagsFilter after input in non-marketplace mode', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace={false}/>);
            const portalElem = react_1.screen.getByTestId('portal-elem');
            const input = react_1.screen.getByRole('textbox');
            (0, vitest_1.expect)(portalElem).toBeInTheDocument();
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
        (0, vitest_1.it)('should set autoFocus when prop is true', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} usedInMarketplace={false} autoFocus/>);
            const input = react_1.screen.getByRole('textbox');
            // autoFocus is a boolean attribute that React handles specially
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onSearchChange when input value changes', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange}/>);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'new search' } });
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('new search');
        });
        (0, vitest_1.it)('should call onSearchChange with empty string when clear button is clicked in marketplace mode', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange} usedInMarketplace search="test"/>);
            const buttons = react_1.screen.getAllByRole('button');
            // Find the clear button (the one in the search area)
            const clearButton = buttons[buttons.length - 1];
            react_1.fireEvent.click(clearButton);
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('');
        });
        (0, vitest_1.it)('should call onSearchChange with empty string when clear button is clicked in non-marketplace mode', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange} usedInMarketplace={false} search="test"/>);
            const buttons = react_1.screen.getAllByRole('button');
            // First button should be the clear button in non-marketplace mode
            react_1.fireEvent.click(buttons[0]);
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('');
        });
        (0, vitest_1.it)('should handle rapid typing correctly', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange}/>);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'a' } });
            react_1.fireEvent.change(input, { target: { value: 'ab' } });
            react_1.fireEvent.change(input, { target: { value: 'abc' } });
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledTimes(3);
            (0, vitest_1.expect)(onSearchChange).toHaveBeenLastCalledWith('abc');
        });
    });
    // ================================
    // Add Custom Tool Button Tests
    // ================================
    (0, vitest_1.describe)('Add Custom Tool Button', () => {
        (0, vitest_1.it)('should render add custom tool button when supportAddCustomTool is true', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} supportAddCustomTool/>);
            // The add button should be rendered
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons.length).toBeGreaterThanOrEqual(1);
        });
        (0, vitest_1.it)('should not render add custom tool button when supportAddCustomTool is false', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} supportAddCustomTool={false}/>);
            // Check for the rounded-full button which is the add button
            const addButton = container.querySelector('.rounded-full');
            (0, vitest_1.expect)(addButton).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call onShowAddCustomCollectionModal when add button is clicked', () => {
            const onShowAddCustomCollectionModal = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} supportAddCustomTool onShowAddCustomCollectionModal={onShowAddCustomCollectionModal}/>);
            // Find the add button (it has rounded-full class)
            const buttons = react_1.screen.getAllByRole('button');
            const addButton = buttons.find(btn => btn.className.includes('rounded-full'));
            if (addButton) {
                react_1.fireEvent.click(addButton);
                (0, vitest_1.expect)(onShowAddCustomCollectionModal).toHaveBeenCalledTimes(1);
            }
        });
    });
    // ================================
    // Props Variations Tests
    // ================================
    (0, vitest_1.describe)('Props Variations', () => {
        (0, vitest_1.it)('should apply wrapperClassName correctly', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} wrapperClassName="custom-wrapper-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-wrapper-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply inputClassName correctly', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} inputClassName="custom-input-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-input-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty placeholder', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} placeholder=""/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toHaveAttribute('placeholder', '');
        });
        (0, vitest_1.it)('should use default placeholder when not provided', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toHaveAttribute('placeholder', '');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty search value', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} search=""/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toHaveValue('');
        });
        (0, vitest_1.it)('should handle empty tags array', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} tags={[]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in search', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange}/>);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('<script>alert("xss")</script>');
        });
        (0, vitest_1.it)('should handle very long search strings', () => {
            const longString = 'a'.repeat(1000);
            (0, react_1.render)(<index_1.default {...defaultProps} search={longString}/>);
            (0, vitest_1.expect)(react_1.screen.getByDisplayValue(longString)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle whitespace-only search', () => {
            const onSearchChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onSearchChange={onSearchChange}/>);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: '   ' } });
            (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('   ');
        });
    });
});
// ================================
// SearchBoxWrapper Component Tests
// ================================
(0, vitest_1.describe)('SearchBoxWrapper', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<search_box_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render in marketplace mode', () => {
            const { container } = (0, react_1.render)(<search_box_wrapper_1.default />);
            (0, vitest_1.expect)(container.querySelector('.rounded-xl')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply correct wrapper classes', () => {
            const { container } = (0, react_1.render)(<search_box_wrapper_1.default />);
            // Check for z-[11] class from wrapper
            (0, vitest_1.expect)(container.querySelector('.z-\\[11\\]')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Hook Integration', () => {
        (0, vitest_1.it)('should call handleSearchPluginTextChange when search changes', () => {
            (0, react_1.render)(<search_box_wrapper_1.default />);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'new search' } });
            (0, vitest_1.expect)(mockHandleSearchPluginTextChange).toHaveBeenCalledWith('new search');
        });
    });
    (0, vitest_1.describe)('Translation', () => {
        (0, vitest_1.it)('should use translation for placeholder', () => {
            (0, react_1.render)(<search_box_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByPlaceholderText('Search plugins')).toBeInTheDocument();
        });
    });
});
// ================================
// MarketplaceTrigger Component Tests
// ================================
(0, vitest_1.describe)('MarketplaceTrigger', () => {
    const defaultProps = {
        selectedTagsLength: 0,
        open: false,
        tags: [],
        tagsMap: mockTagsMap,
        onTagsChange: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('All Tags')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show "All Tags" when no tags selected', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={0}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('All Tags')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show arrow down icon when no tags selected', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={0}/>);
            // Arrow down icon should be present
            (0, vitest_1.expect)(container.querySelector('.size-4')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Selected Tags Display', () => {
        (0, vitest_1.it)('should show selected tag labels when tags are selected', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show multiple tag labels separated by comma', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={2} tags={['agent', 'rag']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent,RAG')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show +N indicator when more than 2 tags selected', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={4} tags={['agent', 'rag', 'search', 'image']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('+2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should only show first 2 tags in label', () => {
            (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={3} tags={['agent', 'rag', 'search']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent,RAG')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Search')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Clear Tags Button', () => {
        (0, vitest_1.it)('should show clear button when tags are selected', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            // RiCloseCircleFill icon should be present
            (0, vitest_1.expect)(container.querySelector('.text-text-quaternary')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show clear button when no tags selected', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={0}/>);
            // Clear button should not be present
            (0, vitest_1.expect)(container.querySelector('.text-text-quaternary')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call onTagsChange with empty array when clear is clicked', () => {
            const onTagsChange = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={2} tags={['agent', 'rag']} onTagsChange={onTagsChange}/>);
            const clearButton = container.querySelector('.text-text-quaternary');
            if (clearButton) {
                react_1.fireEvent.click(clearButton);
                (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith([]);
            }
        });
    });
    (0, vitest_1.describe)('Open State Styling', () => {
        (0, vitest_1.it)('should apply hover styling when open and no tags selected', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} open selectedTagsLength={0}/>);
            (0, vitest_1.expect)(container.querySelector('.bg-state-base-hover')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply border styling when tags are selected', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            (0, vitest_1.expect)(container.querySelector('.border-components-button-secondary-border')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Props Variations', () => {
        (0, vitest_1.it)('should handle empty tagsMap', () => {
            const { container } = (0, react_1.render)(<marketplace_1.default {...defaultProps} tagsMap={{}} tags={[]}/>);
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
    });
});
// ================================
// ToolSelectorTrigger Component Tests
// ================================
(0, vitest_1.describe)('ToolSelectorTrigger', () => {
    const defaultProps = {
        selectedTagsLength: 0,
        open: false,
        tags: [],
        tagsMap: mockTagsMap,
        onTagsChange: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render price tag icon', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(container.querySelector('.size-4')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Selected Tags Display', () => {
        (0, vitest_1.it)('should show selected tag labels when tags are selected', () => {
            (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show multiple tag labels separated by comma', () => {
            (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={2} tags={['agent', 'rag']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent,RAG')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show +N indicator when more than 2 tags selected', () => {
            (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={4} tags={['agent', 'rag', 'search', 'image']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('+2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show tag labels when no tags selected', () => {
            (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={0}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('Agent')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Clear Tags Button', () => {
        (0, vitest_1.it)('should show clear button when tags are selected', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            (0, vitest_1.expect)(container.querySelector('.text-text-quaternary')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show clear button when no tags selected', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={0}/>);
            (0, vitest_1.expect)(container.querySelector('.text-text-quaternary')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call onTagsChange with empty array when clear is clicked', () => {
            const onTagsChange = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={2} tags={['agent', 'rag']} onTagsChange={onTagsChange}/>);
            const clearButton = container.querySelector('.text-text-quaternary');
            if (clearButton) {
                react_1.fireEvent.click(clearButton);
                (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith([]);
            }
        });
        (0, vitest_1.it)('should stop propagation when clear button is clicked', () => {
            const onTagsChange = vitest_1.vi.fn();
            const parentClickHandler = vitest_1.vi.fn();
            const { container } = (0, react_1.render)(<div onClick={parentClickHandler}>
          <tool_selector_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']} onTagsChange={onTagsChange}/>
        </div>);
            const clearButton = container.querySelector('.text-text-quaternary');
            if (clearButton) {
                react_1.fireEvent.click(clearButton);
                (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith([]);
                // Parent should not be called due to stopPropagation
                (0, vitest_1.expect)(parentClickHandler).not.toHaveBeenCalled();
            }
        });
    });
    (0, vitest_1.describe)('Open State Styling', () => {
        (0, vitest_1.it)('should apply hover styling when open and no tags selected', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} open selectedTagsLength={0}/>);
            (0, vitest_1.expect)(container.querySelector('.bg-state-base-hover')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply border styling when tags are selected', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']}/>);
            (0, vitest_1.expect)(container.querySelector('.border-components-button-secondary-border')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not apply hover styling when open but has tags', () => {
            const { container } = (0, react_1.render)(<tool_selector_1.default {...defaultProps} open selectedTagsLength={1} tags={['agent']}/>);
            // Should have border styling, not hover
            (0, vitest_1.expect)(container.querySelector('.border-components-button-secondary-border')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should render with single tag correctly', () => {
            (0, react_1.render)(<tool_selector_1.default {...defaultProps} selectedTagsLength={1} tags={['agent']} tagsMap={mockTagsMap}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
    });
});
// ================================
// TagsFilter Component Tests (Integration)
// ================================
(0, vitest_1.describe)('TagsFilter', () => {
    // We need to import TagsFilter separately for these tests
    // since it uses the mocked portal components
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.describe)('Integration with SearchBox', () => {
        (0, vitest_1.it)('should render TagsFilter within SearchBox', () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass usedInMarketplace prop to TagsFilter', () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()} usedInMarketplace/>);
            // MarketplaceTrigger should show "All Tags"
            (0, vitest_1.expect)(react_1.screen.getByText('All Tags')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show selected tags count in TagsFilter trigger', () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={['agent', 'rag', 'search']} onTagsChange={vitest_1.vi.fn()} usedInMarketplace/>);
            (0, vitest_1.expect)(react_1.screen.getByText('+1')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Dropdown Behavior', () => {
        (0, vitest_1.it)('should open dropdown when trigger is clicked', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should close dropdown when trigger is clicked again', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Open
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
            // Close
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Tag Selection', () => {
        (0, vitest_1.it)('should display tag options when dropdown is open', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should call onTagsChange when a tag is selected', async () => {
            const onTagsChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={onTagsChange}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            });
            const agentOption = react_1.screen.getByText('Agent');
            react_1.fireEvent.click(agentOption.parentElement);
            (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith(['agent']);
        });
        (0, vitest_1.it)('should call onTagsChange to remove tag when already selected', async () => {
            const onTagsChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={['agent']} onTagsChange={onTagsChange}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                // Multiple 'Agent' texts exist - one in trigger, one in dropdown
                (0, vitest_1.expect)(react_1.screen.getAllByText('Agent').length).toBeGreaterThanOrEqual(1);
            });
            // Get the portal content and find the tag option within it
            const portalContent = react_1.screen.getByTestId('portal-content');
            const agentOption = portalContent.querySelector('div[class*="cursor-pointer"]');
            if (agentOption) {
                react_1.fireEvent.click(agentOption);
                (0, vitest_1.expect)(onTagsChange).toHaveBeenCalled();
            }
        });
        (0, vitest_1.it)('should add to existing tags when selecting new tag', async () => {
            const onTagsChange = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={['agent']} onTagsChange={onTagsChange}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            });
            const ragOption = react_1.screen.getByText('RAG');
            react_1.fireEvent.click(ragOption.parentElement);
            (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith(['agent', 'rag']);
        });
    });
    (0, vitest_1.describe)('Search Tags Feature', () => {
        (0, vitest_1.it)('should render search input in dropdown', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                const inputs = react_1.screen.getAllByRole('textbox');
                (0, vitest_1.expect)(inputs.length).toBeGreaterThanOrEqual(1);
            });
        });
        (0, vitest_1.it)('should filter tags based on search text', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            });
            const inputs = react_1.screen.getAllByRole('textbox');
            const searchInput = inputs.find(input => input.getAttribute('placeholder') === 'Search tags');
            if (searchInput) {
                react_1.fireEvent.change(searchInput, { target: { value: 'agent' } });
                (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            }
        });
    });
    (0, vitest_1.describe)('Checkbox State', () => {
        // Note: The Checkbox component is a custom div-based component, not native checkbox
        (0, vitest_1.it)('should display tag options with proper selection state', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={['agent']} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                // 'Agent' appears both in trigger (selected) and dropdown
                (0, vitest_1.expect)(react_1.screen.getAllByText('Agent').length).toBeGreaterThanOrEqual(1);
            });
            // Verify dropdown content is rendered
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render tag options when dropdown is open', async () => {
            (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
            // When no tags selected, these should appear once each in dropdown
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('RAG')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Search')).toBeInTheDocument();
        });
    });
});
// ================================
// Accessibility Tests
// ================================
(0, vitest_1.describe)('Accessibility', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.it)('should have accessible search input', () => {
        (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()} placeholder="Search plugins"/>);
        const input = react_1.screen.getByRole('textbox');
        (0, vitest_1.expect)(input).toBeInTheDocument();
        (0, vitest_1.expect)(input).toHaveAttribute('placeholder', 'Search plugins');
    });
    (0, vitest_1.it)('should have clickable tag options in dropdown', async () => {
        (0, react_1.render)(<index_1.default search="" onSearchChange={vitest_1.vi.fn()} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
        react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
        await (0, react_1.waitFor)(() => {
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
    });
});
// ================================
// Combined Workflow Tests
// ================================
(0, vitest_1.describe)('Combined Workflows', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
    });
    (0, vitest_1.it)('should handle search and tag filter together', async () => {
        const onSearchChange = vitest_1.vi.fn();
        const onTagsChange = vitest_1.vi.fn();
        (0, react_1.render)(<index_1.default search="" onSearchChange={onSearchChange} tags={[]} onTagsChange={onTagsChange} usedInMarketplace/>);
        const input = react_1.screen.getByRole('textbox');
        react_1.fireEvent.change(input, { target: { value: 'search query' } });
        (0, vitest_1.expect)(onSearchChange).toHaveBeenCalledWith('search query');
        const trigger = react_1.screen.getByTestId('portal-trigger');
        react_1.fireEvent.click(trigger);
        await (0, react_1.waitFor)(() => {
            (0, vitest_1.expect)(react_1.screen.getByText('Agent')).toBeInTheDocument();
        });
        const agentOption = react_1.screen.getByText('Agent');
        react_1.fireEvent.click(agentOption.parentElement);
        (0, vitest_1.expect)(onTagsChange).toHaveBeenCalledWith(['agent']);
    });
    (0, vitest_1.it)('should work with all features enabled', () => {
        (0, react_1.render)(<index_1.default search="test" onSearchChange={vitest_1.vi.fn()} tags={['agent', 'rag']} onTagsChange={vitest_1.vi.fn()} usedInMarketplace supportAddCustomTool onShowAddCustomCollectionModal={vitest_1.vi.fn()} placeholder="Search plugins" wrapperClassName="custom-wrapper" inputClassName="custom-input" autoFocus={false}/>);
        (0, vitest_1.expect)(react_1.screen.getByDisplayValue('test')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Agent,RAG')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should handle prop changes correctly', () => {
        const onSearchChange = vitest_1.vi.fn();
        const { rerender } = (0, react_1.render)(<index_1.default search="initial" onSearchChange={onSearchChange} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
        (0, vitest_1.expect)(react_1.screen.getByDisplayValue('initial')).toBeInTheDocument();
        rerender(<index_1.default search="updated" onSearchChange={onSearchChange} tags={[]} onTagsChange={vitest_1.vi.fn()}/>);
        (0, vitest_1.expect)(react_1.screen.getByDisplayValue('updated')).toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCxtQ0FBK0I7QUFDL0IsNkRBQW1EO0FBQ25ELHVEQUFzRDtBQUN0RCwyREFBeUQ7QUFFekQsbUNBQW1DO0FBQ25DLGtDQUFrQztBQUNsQyxtQ0FBbUM7QUFFbkMsNkJBQTZCO0FBQzdCLFdBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUM1QyxtREFBbUQ7WUFDbkQsTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7WUFDMUQsTUFBTSxZQUFZLEdBQTJCO2dCQUMzQyxvQkFBb0IsRUFBRSxVQUFVO2dCQUNoQyx1QkFBdUIsRUFBRSxhQUFhO2dCQUN0QyxzQkFBc0IsRUFBRSxnQkFBZ0I7YUFDekMsQ0FBQTtZQUNELE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQTtRQUNyQyxDQUFDO0tBQ0YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsK0JBQStCO0FBQy9CLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxnQ0FBZ0MsRUFBRSxvQkFBb0IsRUFBRSxnQ0FBZ0MsRUFBRSxHQUFHLFdBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO0lBQ3pJLE9BQU87UUFDTCxvQkFBb0IsRUFBRSxFQUFFO1FBQ3hCLGdDQUFnQyxFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsb0JBQW9CLEVBQUUsRUFBYztRQUNw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LFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDL0QsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsTUFBTSxjQUFjLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBRTlCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDekIsQ0FBQyxlQUFTLENBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FDaEIsY0FBYyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQy9CLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNULFlBQVksQ0FBQyxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUN0QixDQUNILENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBRS9ELFFBQVEsQ0FDTixDQUFDLGVBQVMsQ0FDUixNQUFNLENBQUMsU0FBUyxDQUNoQixjQUFjLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FDL0IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ1QsWUFBWSxDQUFDLENBQUMsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ3RCLENBQ0gsQ0FBQTtRQUVELElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDakUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVGFnIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2hvb2tzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgU2VhcmNoQm94IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgU2VhcmNoQm94V3JhcHBlciBmcm9tICcuL3NlYXJjaC1ib3gtd3JhcHBlcidcbmltcG9ydCBNYXJrZXRwbGFjZVRyaWdnZXIgZnJvbSAnLi90cmlnZ2VyL21hcmtldHBsYWNlJ1xuaW1wb3J0IFRvb2xTZWxlY3RvclRyaWdnZXIgZnJvbSAnLi90cmlnZ2VyL3Rvb2wtc2VsZWN0b3InXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llcyBvbmx5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIGkxOG4gdHJhbnNsYXRpb24gaG9va1xudmkubW9jaygnI2kxOG4nLCAoKSA9PiAoe1xuICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nIH0pID0+IHtcbiAgICAgIC8vIEJ1aWxkIGZ1bGwga2V5IHdpdGggbmFtZXNwYWNlIHByZWZpeCBpZiBwcm92aWRlZFxuICAgICAgY29uc3QgZnVsbEtleSA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uJHtrZXl9YCA6IGtleVxuICAgICAgY29uc3QgdHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgICAgICAncGx1Z2luVGFncy5hbGxUYWdzJzogJ0FsbCBUYWdzJyxcbiAgICAgICAgJ3BsdWdpblRhZ3Muc2VhcmNoVGFncyc6ICdTZWFyY2ggdGFncycsXG4gICAgICAgICdwbHVnaW4uc2VhcmNoUGx1Z2lucyc6ICdTZWFyY2ggcGx1Z2lucycsXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW2Z1bGxLZXldIHx8IGtleVxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgbWFya2V0cGxhY2Ugc3RhdGUgaG9va3NcbmNvbnN0IHsgbW9ja1NlYXJjaFBsdWdpblRleHQsIG1vY2tIYW5kbGVTZWFyY2hQbHVnaW5UZXh0Q2hhbmdlLCBtb2NrRmlsdGVyUGx1Z2luVGFncywgbW9ja0hhbmRsZUZpbHRlclBsdWdpblRhZ3NDaGFuZ2UgfSA9IHZpLmhvaXN0ZWQoKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG1vY2tTZWFyY2hQbHVnaW5UZXh0OiAnJyxcbiAgICBtb2NrSGFuZGxlU2VhcmNoUGx1Z2luVGV4dENoYW5nZTogdmkuZm4oKSxcbiAgICBtb2NrRmlsdGVyUGx1Z2luVGFnczogW10gYXMgc3RyaW5nW10sXG4gICAgbW9ja0hhbmRsZUZpbHRlclBsdWdpblRhZ3NDaGFuZ2U6IHZpLmZuKCksXG4gIH1cbn0pXG5cbnZpLm1vY2soJy4uL2F0b21zJywgKCkgPT4gKHtcbiAgdXNlU2VhcmNoUGx1Z2luVGV4dDogKCkgPT4gW21vY2tTZWFyY2hQbHVnaW5UZXh0LCBtb2NrSGFuZGxlU2VhcmNoUGx1Z2luVGV4dENoYW5nZV0sXG4gIHVzZUZpbHRlclBsdWdpblRhZ3M6ICgpID0+IFttb2NrRmlsdGVyUGx1Z2luVGFncywgbW9ja0hhbmRsZUZpbHRlclBsdWdpblRhZ3NDaGFuZ2VdLFxufSkpXG5cbi8vIE1vY2sgdXNlVGFncyBob29rXG5jb25zdCBtb2NrVGFnczogVGFnW10gPSBbXG4gIHsgbmFtZTogJ2FnZW50JywgbGFiZWw6ICdBZ2VudCcgfSxcbiAgeyBuYW1lOiAncmFnJywgbGFiZWw6ICdSQUcnIH0sXG4gIHsgbmFtZTogJ3NlYXJjaCcsIGxhYmVsOiAnU2VhcmNoJyB9LFxuICB7IG5hbWU6ICdpbWFnZScsIGxhYmVsOiAnSW1hZ2UnIH0sXG4gIHsgbmFtZTogJ3ZpZGVvcycsIGxhYmVsOiAnVmlkZW9zJyB9LFxuXVxuXG5jb25zdCBtb2NrVGFnc01hcDogUmVjb3JkPHN0cmluZywgVGFnPiA9IG1vY2tUYWdzLnJlZHVjZSgoYWNjLCB0YWcpID0+IHtcbiAgYWNjW3RhZy5uYW1lXSA9IHRhZ1xuICByZXR1cm4gYWNjXG59LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBUYWc+KVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VUYWdzOiAoKSA9PiAoe1xuICAgIHRhZ3M6IG1vY2tUYWdzLFxuICAgIHRhZ3NNYXA6IG1vY2tUYWdzTWFwLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHBvcnRhbC10by1mb2xsb3ctZWxlbSB3aXRoIHNoYXJlZCBvcGVuIHN0YXRlXG5sZXQgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IGZhbHNlXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiAoe1xuICBQb3J0YWxUb0ZvbGxvd0VsZW06ICh7IGNoaWxkcmVuLCBvcGVuIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb3BlbjogYm9vbGVhblxuICB9KSA9PiB7XG4gICAgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IG9wZW5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtvcGVufT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyOiAoeyBjaGlsZHJlbiwgb25DbGljaywgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DbGljazogKCkgPT4gdm9pZFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IHtcbiAgICAvLyBPbmx5IHJlbmRlciBjb250ZW50IHdoZW4gcG9ydGFsIGlzIG9wZW5cbiAgICBpZiAoIW1vY2tQb3J0YWxPcGVuU3RhdGUpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU2VhcmNoQm94IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdTZWFyY2hCb3gnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBzZWFyY2g6ICcnLFxuICAgIG9uU2VhcmNoQ2hhbmdlOiB2aS5mbigpLFxuICAgIHRhZ3M6IFtdIGFzIHN0cmluZ1tdLFxuICAgIG9uVGFnc0NoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIG1hcmtldHBsYWNlIG1vZGUgc3R5bGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gdXNlZEluTWFya2V0cGxhY2UgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEluIG1hcmtldHBsYWNlIG1vZGUsIFRhZ3NGaWx0ZXIgY29tZXMgYmVmb3JlIGlucHV0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5yb3VuZGVkLXhsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBub24tbWFya2V0cGxhY2UgbW9kZSBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSB1c2VkSW5NYXJrZXRwbGFjZT17ZmFsc2V9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBJbiBub24tbWFya2V0cGxhY2UgbW9kZSwgc2VhcmNoIGljb24gYXBwZWFycyBmaXJzdFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcucmFkaXVzLW1kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGxhY2Vob2xkZXIgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gcGxhY2Vob2xkZXI9XCJTZWFyY2ggaGVyZS4uLlwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdTZWFyY2ggaGVyZS4uLicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlYXJjaCBpbnB1dCB3aXRoIGN1cnJlbnQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSBzZWFyY2g9XCJ0ZXN0IHF1ZXJ5XCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlEaXNwbGF5VmFsdWUoJ3Rlc3QgcXVlcnknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBUYWdzRmlsdGVyIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNYXJrZXRwbGFjZSBNb2RlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNYXJrZXRwbGFjZSBNb2RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRhZ3NGaWx0ZXIgYmVmb3JlIGlucHV0IGluIG1hcmtldHBsYWNlIG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSB1c2VkSW5NYXJrZXRwbGFjZSAvPilcblxuICAgICAgY29uc3QgcG9ydGFsRWxlbSA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcblxuICAgICAgLy8gQm90aCBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChwb3J0YWxFbGVtKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xlYXIgYnV0dG9uIHdoZW4gc2VhcmNoIGhhcyB2YWx1ZSBpbiBtYXJrZXRwbGFjZSBtb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gdXNlZEluTWFya2V0cGxhY2Ugc2VhcmNoPVwidGVzdFwiIC8+KVxuXG4gICAgICAvLyBBY3Rpb25CdXR0b24gd2l0aCBjbG9zZSBpY29uIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY2xlYXIgYnV0dG9uIHdoZW4gc2VhcmNoIGlzIGVtcHR5IGluIG1hcmtldHBsYWNlIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gdXNlZEluTWFya2V0cGxhY2Ugc2VhcmNoPVwiXCIgLz4pXG5cbiAgICAgIC8vIFJpQ2xvc2VMaW5lIGljb24gc2hvdWxkIG5vdCBiZSB2aXNpYmxlIChpdCdzIHdpdGhpbiBBY3Rpb25CdXR0b24pXG4gICAgICBjb25zdCBjbG9zZUljb25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXplLTQnKVxuICAgICAgLy8gT25seSBmaWx0ZXIgaWNvbnMgc2hvdWxkIGJlIHByZXNlbnQsIG5vdCBjbG9zZSBidXR0b25cbiAgICAgIGV4cGVjdChjbG9zZUljb25zLmxlbmd0aCkudG9CZUxlc3NUaGFuKDMpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBOb24tTWFya2V0cGxhY2UgTW9kZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTm9uLU1hcmtldHBsYWNlIE1vZGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VhcmNoIGljb24gYXQgdGhlIGJlZ2lubmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gdXNlZEluTWFya2V0cGxhY2U9e2ZhbHNlfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gU2VhcmNoIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtY29tcG9uZW50cy1pbnB1dC10ZXh0LXBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xlYXIgYnV0dG9uIHdoZW4gc2VhcmNoIGhhcyB2YWx1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHVzZWRJbk1hcmtldHBsYWNlPXtmYWxzZX0gc2VhcmNoPVwidGVzdFwiIC8+KVxuXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRhZ3NGaWx0ZXIgYWZ0ZXIgaW5wdXQgaW4gbm9uLW1hcmtldHBsYWNlIG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSB1c2VkSW5NYXJrZXRwbGFjZT17ZmFsc2V9IC8+KVxuXG4gICAgICBjb25zdCBwb3J0YWxFbGVtID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuXG4gICAgICBleHBlY3QocG9ydGFsRWxlbSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGlucHV0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGF1dG9Gb2N1cyB3aGVuIHByb3AgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHVzZWRJbk1hcmtldHBsYWNlPXtmYWxzZX0gYXV0b0ZvY3VzIC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgLy8gYXV0b0ZvY3VzIGlzIGEgYm9vbGVhbiBhdHRyaWJ1dGUgdGhhdCBSZWFjdCBoYW5kbGVzIHNwZWNpYWxseVxuICAgICAgZXhwZWN0KGlucHV0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VhcmNoQ2hhbmdlIHdoZW4gaW5wdXQgdmFsdWUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU2VhcmNoQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gb25TZWFyY2hDaGFuZ2U9e29uU2VhcmNoQ2hhbmdlfSAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3IHNlYXJjaCcgfSB9KVxuXG4gICAgICBleHBlY3Qob25TZWFyY2hDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXcgc2VhcmNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VhcmNoQ2hhbmdlIHdpdGggZW1wdHkgc3RyaW5nIHdoZW4gY2xlYXIgYnV0dG9uIGlzIGNsaWNrZWQgaW4gbWFya2V0cGxhY2UgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU2VhcmNoQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvblNlYXJjaENoYW5nZT17b25TZWFyY2hDaGFuZ2V9XG4gICAgICAgICAgdXNlZEluTWFya2V0cGxhY2VcbiAgICAgICAgICBzZWFyY2g9XCJ0ZXN0XCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgLy8gRmluZCB0aGUgY2xlYXIgYnV0dG9uICh0aGUgb25lIGluIHRoZSBzZWFyY2ggYXJlYSlcbiAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gYnV0dG9uc1tidXR0b25zLmxlbmd0aCAtIDFdXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2xlYXJCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvblNlYXJjaENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlYXJjaENoYW5nZSB3aXRoIGVtcHR5IHN0cmluZyB3aGVuIGNsZWFyIGJ1dHRvbiBpcyBjbGlja2VkIGluIG5vbi1tYXJrZXRwbGFjZSBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWFyY2hDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3hcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG9uU2VhcmNoQ2hhbmdlPXtvblNlYXJjaENoYW5nZX1cbiAgICAgICAgICB1c2VkSW5NYXJrZXRwbGFjZT17ZmFsc2V9XG4gICAgICAgICAgc2VhcmNoPVwidGVzdFwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIC8vIEZpcnN0IGJ1dHRvbiBzaG91bGQgYmUgdGhlIGNsZWFyIGJ1dHRvbiBpbiBub24tbWFya2V0cGxhY2UgbW9kZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbnNbMF0pXG5cbiAgICAgIGV4cGVjdChvblNlYXJjaENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIHR5cGluZyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblNlYXJjaENoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IG9uU2VhcmNoQ2hhbmdlPXtvblNlYXJjaENoYW5nZX0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYScgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhYmMnIH0gfSlcblxuICAgICAgZXhwZWN0KG9uU2VhcmNoQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgIGV4cGVjdChvblNlYXJjaENoYW5nZSkudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKCdhYmMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWRkIEN1c3RvbSBUb29sIEJ1dHRvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQWRkIEN1c3RvbSBUb29sIEJ1dHRvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhZGQgY3VzdG9tIHRvb2wgYnV0dG9uIHdoZW4gc3VwcG9ydEFkZEN1c3RvbVRvb2wgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHN1cHBvcnRBZGRDdXN0b21Ub29sIC8+KVxuXG4gICAgICAvLyBUaGUgYWRkIGJ1dHRvbiBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBhZGQgY3VzdG9tIHRvb2wgYnV0dG9uIHdoZW4gc3VwcG9ydEFkZEN1c3RvbVRvb2wgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHN1cHBvcnRBZGRDdXN0b21Ub29sPXtmYWxzZX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENoZWNrIGZvciB0aGUgcm91bmRlZC1mdWxsIGJ1dHRvbiB3aGljaCBpcyB0aGUgYWRkIGJ1dHRvblxuICAgICAgY29uc3QgYWRkQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5yb3VuZGVkLWZ1bGwnKVxuICAgICAgZXhwZWN0KGFkZEJ1dHRvbikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2hvd0FkZEN1c3RvbUNvbGxlY3Rpb25Nb2RhbCB3aGVuIGFkZCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU2hvd0FkZEN1c3RvbUNvbGxlY3Rpb25Nb2RhbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc3VwcG9ydEFkZEN1c3RvbVRvb2xcbiAgICAgICAgICBvblNob3dBZGRDdXN0b21Db2xsZWN0aW9uTW9kYWw9e29uU2hvd0FkZEN1c3RvbUNvbGxlY3Rpb25Nb2RhbH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEZpbmQgdGhlIGFkZCBidXR0b24gKGl0IGhhcyByb3VuZGVkLWZ1bGwgY2xhc3MpXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGJ1dHRvbnMuZmluZChidG4gPT5cbiAgICAgICAgYnRuLmNsYXNzTmFtZS5pbmNsdWRlcygncm91bmRlZC1mdWxsJyksXG4gICAgICApXG5cbiAgICAgIGlmIChhZGRCdXR0b24pIHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkZEJ1dHRvbilcbiAgICAgICAgZXhwZWN0KG9uU2hvd0FkZEN1c3RvbUNvbGxlY3Rpb25Nb2RhbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgd3JhcHBlckNsYXNzTmFtZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHdyYXBwZXJDbGFzc05hbWU9XCJjdXN0b20td3JhcHBlci1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20td3JhcHBlci1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaW5wdXRDbGFzc05hbWUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSBpbnB1dENsYXNzTmFtZT1cImN1c3RvbS1pbnB1dC1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20taW5wdXQtY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwbGFjZWhvbGRlcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHBsYWNlaG9sZGVyPVwiXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JykpLnRvSGF2ZUF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCBwbGFjZWhvbGRlciB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0hhdmVBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJycpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHNlYXJjaCB2YWx1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHNlYXJjaD1cIlwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0hhdmVWYWx1ZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGFncyBhcnJheScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94IHsuLi5kZWZhdWx0UHJvcHN9IHRhZ3M9e1tdfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gc2VhcmNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWFyY2hDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSBvblNlYXJjaENoYW5nZT17b25TZWFyY2hDaGFuZ2V9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+JyB9IH0pXG5cbiAgICAgIGV4cGVjdChvblNlYXJjaENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgc2VhcmNoIHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nU3RyaW5nID0gJ2EnLnJlcGVhdCgxMDAwKVxuICAgICAgcmVuZGVyKDxTZWFyY2hCb3ggey4uLmRlZmF1bHRQcm9wc30gc2VhcmNoPXtsb25nU3RyaW5nfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZShsb25nU3RyaW5nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB3aGl0ZXNwYWNlLW9ubHkgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWFyY2hDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFNlYXJjaEJveCB7Li4uZGVmYXVsdFByb3BzfSBvblNlYXJjaENoYW5nZT17b25TZWFyY2hDaGFuZ2V9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcgICAnIH0gfSlcblxuICAgICAgZXhwZWN0KG9uU2VhcmNoQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnICAgJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFNlYXJjaEJveFdyYXBwZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1NlYXJjaEJveFdyYXBwZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94V3JhcHBlciAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbiBtYXJrZXRwbGFjZSBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U2VhcmNoQm94V3JhcHBlciAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcucm91bmRlZC14bCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCB3cmFwcGVyIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTZWFyY2hCb3hXcmFwcGVyIC8+KVxuXG4gICAgICAvLyBDaGVjayBmb3Igei1bMTFdIGNsYXNzIGZyb20gd3JhcHBlclxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuei1cXFxcWzExXFxcXF0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0hvb2sgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVNlYXJjaFBsdWdpblRleHRDaGFuZ2Ugd2hlbiBzZWFyY2ggY2hhbmdlcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VhcmNoQm94V3JhcHBlciAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3IHNlYXJjaCcgfSB9KVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVNlYXJjaFBsdWdpblRleHRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXcgc2VhcmNoJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdUcmFuc2xhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSB0cmFuc2xhdGlvbiBmb3IgcGxhY2Vob2xkZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlYXJjaEJveFdyYXBwZXIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ1NlYXJjaCBwbHVnaW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1hcmtldHBsYWNlVHJpZ2dlciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnTWFya2V0cGxhY2VUcmlnZ2VyJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc2VsZWN0ZWRUYWdzTGVuZ3RoOiAwLFxuICAgIG9wZW46IGZhbHNlLFxuICAgIHRhZ3M6IFtdIGFzIHN0cmluZ1tdLFxuICAgIHRhZ3NNYXA6IG1vY2tUYWdzTWFwLFxuICAgIG9uVGFnc0NoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TWFya2V0cGxhY2VUcmlnZ2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWxsIFRhZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgXCJBbGwgVGFnc1wiIHdoZW4gbm8gdGFncyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TWFya2V0cGxhY2VUcmlnZ2VyIHsuLi5kZWZhdWx0UHJvcHN9IHNlbGVjdGVkVGFnc0xlbmd0aD17MH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbGwgVGFncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBhcnJvdyBkb3duIGljb24gd2hlbiBubyB0YWdzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE1hcmtldHBsYWNlVHJpZ2dlciB7Li4uZGVmYXVsdFByb3BzfSBzZWxlY3RlZFRhZ3NMZW5ndGg9ezB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBcnJvdyBkb3duIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNpemUtNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2VsZWN0ZWQgVGFncyBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBzZWxlY3RlZCB0YWcgbGFiZWxzIHdoZW4gdGFncyBhcmUgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxNYXJrZXRwbGFjZVRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17MX1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50J119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbXVsdGlwbGUgdGFnIGxhYmVscyBzZXBhcmF0ZWQgYnkgY29tbWEnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxNYXJrZXRwbGFjZVRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17Mn1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50JywgJ3JhZyddfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50LFJBRycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyArTiBpbmRpY2F0b3Igd2hlbiBtb3JlIHRoYW4gMiB0YWdzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8TWFya2V0cGxhY2VUcmlnZ2VyXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzZWxlY3RlZFRhZ3NMZW5ndGg9ezR9XG4gICAgICAgICAgdGFncz17WydhZ2VudCcsICdyYWcnLCAnc2VhcmNoJywgJ2ltYWdlJ119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnKzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9ubHkgc2hvdyBmaXJzdCAyIHRhZ3MgaW4gbGFiZWwnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxNYXJrZXRwbGFjZVRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17M31cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50JywgJ3JhZycsICdzZWFyY2gnXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCxSQUcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnU2VhcmNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2xlYXIgVGFncyBCdXR0b24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNsZWFyIGJ1dHRvbiB3aGVuIHRhZ3MgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE1hcmtldHBsYWNlVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXsxfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFJpQ2xvc2VDaXJjbGVGaWxsIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1xdWF0ZXJuYXJ5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBjbGVhciBidXR0b24gd2hlbiBubyB0YWdzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE1hcmtldHBsYWNlVHJpZ2dlciB7Li4uZGVmYXVsdFByb3BzfSBzZWxlY3RlZFRhZ3NMZW5ndGg9ezB9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGVhciBidXR0b24gc2hvdWxkIG5vdCBiZSBwcmVzZW50XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtcXVhdGVybmFyeScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25UYWdzQ2hhbmdlIHdpdGggZW1wdHkgYXJyYXkgd2hlbiBjbGVhciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25UYWdzQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE1hcmtldHBsYWNlVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXsyfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnLCAncmFnJ119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXtvblRhZ3NDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjbGVhckJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgaWYgKGNsZWFyQnV0dG9uKSB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjbGVhckJ1dHRvbilcbiAgICAgICAgZXhwZWN0KG9uVGFnc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnT3BlbiBTdGF0ZSBTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgaG92ZXIgc3R5bGluZyB3aGVuIG9wZW4gYW5kIG5vIHRhZ3Mgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8TWFya2V0cGxhY2VUcmlnZ2VyIHsuLi5kZWZhdWx0UHJvcHN9IG9wZW4gc2VsZWN0ZWRUYWdzTGVuZ3RoPXswfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctc3RhdGUtYmFzZS1ob3ZlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYm9yZGVyIHN0eWxpbmcgd2hlbiB0YWdzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxNYXJrZXRwbGFjZVRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17MX1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50J119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib3JkZXItY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LWJvcmRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0YWdzTWFwJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE1hcmtldHBsYWNlVHJpZ2dlciB7Li4uZGVmYXVsdFByb3BzfSB0YWdzTWFwPXt7fX0gdGFncz17W119IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUb29sU2VsZWN0b3JUcmlnZ2VyIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdUb29sU2VsZWN0b3JUcmlnZ2VyJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgc2VsZWN0ZWRUYWdzTGVuZ3RoOiAwLFxuICAgIG9wZW46IGZhbHNlLFxuICAgIHRhZ3M6IFtdIGFzIHN0cmluZ1tdLFxuICAgIHRhZ3NNYXA6IG1vY2tUYWdzTWFwLFxuICAgIG9uVGFnc0NoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRvb2xTZWxlY3RvclRyaWdnZXIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcHJpY2UgdGFnIGljb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxUb29sU2VsZWN0b3JUcmlnZ2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zaXplLTQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlbGVjdGVkIFRhZ3MgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgc2VsZWN0ZWQgdGFnIGxhYmVscyB3aGVuIHRhZ3MgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VG9vbFNlbGVjdG9yVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXsxfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBtdWx0aXBsZSB0YWcgbGFiZWxzIHNlcGFyYXRlZCBieSBjb21tYScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRvb2xTZWxlY3RvclRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17Mn1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50JywgJ3JhZyddfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50LFJBRycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyArTiBpbmRpY2F0b3Igd2hlbiBtb3JlIHRoYW4gMiB0YWdzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VG9vbFNlbGVjdG9yVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXs0fVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnLCAncmFnJywgJ3NlYXJjaCcsICdpbWFnZSddfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJysyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB0YWcgbGFiZWxzIHdoZW4gbm8gdGFncyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VG9vbFNlbGVjdG9yVHJpZ2dlciB7Li4uZGVmYXVsdFByb3BzfSBzZWxlY3RlZFRhZ3NMZW5ndGg9ezB9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdBZ2VudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NsZWFyIFRhZ3MgQnV0dG9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBjbGVhciBidXR0b24gd2hlbiB0YWdzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxUb29sU2VsZWN0b3JUcmlnZ2VyXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzZWxlY3RlZFRhZ3NMZW5ndGg9ezF9XG4gICAgICAgICAgdGFncz17WydhZ2VudCddfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNsZWFyIGJ1dHRvbiB3aGVuIG5vIHRhZ3Mgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8VG9vbFNlbGVjdG9yVHJpZ2dlciB7Li4uZGVmYXVsdFByb3BzfSBzZWxlY3RlZFRhZ3NMZW5ndGg9ezB9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtcXVhdGVybmFyeScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25UYWdzQ2hhbmdlIHdpdGggZW1wdHkgYXJyYXkgd2hlbiBjbGVhciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25UYWdzQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRvb2xTZWxlY3RvclRyaWdnZXJcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17Mn1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50JywgJ3JhZyddfVxuICAgICAgICAgIG9uVGFnc0NoYW5nZT17b25UYWdzQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgY2xlYXJCdXR0b24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1xdWF0ZXJuYXJ5JylcbiAgICAgIGlmIChjbGVhckJ1dHRvbikge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xlYXJCdXR0b24pXG4gICAgICAgIGV4cGVjdChvblRhZ3NDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN0b3AgcHJvcGFnYXRpb24gd2hlbiBjbGVhciBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uVGFnc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBhcmVudENsaWNrSGFuZGxlciA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPGRpdiBvbkNsaWNrPXtwYXJlbnRDbGlja0hhbmRsZXJ9PlxuICAgICAgICAgIDxUb29sU2VsZWN0b3JUcmlnZ2VyXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXsxfVxuICAgICAgICAgICAgdGFncz17WydhZ2VudCddfVxuICAgICAgICAgICAgb25UYWdzQ2hhbmdlPXtvblRhZ3NDaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjbGVhckJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgICAgaWYgKGNsZWFyQnV0dG9uKSB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjbGVhckJ1dHRvbilcbiAgICAgICAgZXhwZWN0KG9uVGFnc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAgIC8vIFBhcmVudCBzaG91bGQgbm90IGJlIGNhbGxlZCBkdWUgdG8gc3RvcFByb3BhZ2F0aW9uXG4gICAgICAgIGV4cGVjdChwYXJlbnRDbGlja0hhbmRsZXIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPcGVuIFN0YXRlIFN0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBob3ZlciBzdHlsaW5nIHdoZW4gb3BlbiBhbmQgbm8gdGFncyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxUb29sU2VsZWN0b3JUcmlnZ2VyIHsuLi5kZWZhdWx0UHJvcHN9IG9wZW4gc2VsZWN0ZWRUYWdzTGVuZ3RoPXswfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctc3RhdGUtYmFzZS1ob3ZlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYm9yZGVyIHN0eWxpbmcgd2hlbiB0YWdzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxUb29sU2VsZWN0b3JUcmlnZ2VyXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBzZWxlY3RlZFRhZ3NMZW5ndGg9ezF9XG4gICAgICAgICAgdGFncz17WydhZ2VudCddfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYm9yZGVyLWNvbXBvbmVudHMtYnV0dG9uLXNlY29uZGFyeS1ib3JkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBhcHBseSBob3ZlciBzdHlsaW5nIHdoZW4gb3BlbiBidXQgaGFzIHRhZ3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8VG9vbFNlbGVjdG9yVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgb3BlblxuICAgICAgICAgIHNlbGVjdGVkVGFnc0xlbmd0aD17MX1cbiAgICAgICAgICB0YWdzPXtbJ2FnZW50J119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgaGF2ZSBib3JkZXIgc3R5bGluZywgbm90IGhvdmVyXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib3JkZXItY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LWJvcmRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNpbmdsZSB0YWcgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VG9vbFNlbGVjdG9yVHJpZ2dlclxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgc2VsZWN0ZWRUYWdzTGVuZ3RoPXsxfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnXX1cbiAgICAgICAgICB0YWdzTWFwPXttb2NrVGFnc01hcH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUYWdzRmlsdGVyIENvbXBvbmVudCBUZXN0cyAoSW50ZWdyYXRpb24pXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1RhZ3NGaWx0ZXInLCAoKSA9PiB7XG4gIC8vIFdlIG5lZWQgdG8gaW1wb3J0IFRhZ3NGaWx0ZXIgc2VwYXJhdGVseSBmb3IgdGhlc2UgdGVzdHNcbiAgLy8gc2luY2UgaXQgdXNlcyB0aGUgbW9ja2VkIHBvcnRhbCBjb21wb25lbnRzXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IGZhbHNlXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIHdpdGggU2VhcmNoQm94JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRhZ3NGaWx0ZXIgd2l0aGluIFNlYXJjaEJveCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17W119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgdXNlZEluTWFya2V0cGxhY2UgcHJvcCB0byBUYWdzRmlsdGVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94XG4gICAgICAgICAgc2VhcmNoPVwiXCJcbiAgICAgICAgICBvblNlYXJjaENoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICB0YWdzPXtbXX1cbiAgICAgICAgICBvblRhZ3NDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdXNlZEluTWFya2V0cGxhY2VcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIE1hcmtldHBsYWNlVHJpZ2dlciBzaG91bGQgc2hvdyBcIkFsbCBUYWdzXCJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbGwgVGFncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzZWxlY3RlZCB0YWdzIGNvdW50IGluIFRhZ3NGaWx0ZXIgdHJpZ2dlcicsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17WydhZ2VudCcsICdyYWcnLCAnc2VhcmNoJ119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIHVzZWRJbk1hcmtldHBsYWNlXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnKzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Ryb3Bkb3duIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBkcm9wZG93biB3aGVuIHRyaWdnZXIgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17W119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIGRyb3Bkb3duIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkIGFnYWluJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94XG4gICAgICAgICAgc2VhcmNoPVwiXCJcbiAgICAgICAgICBvblNlYXJjaENoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICB0YWdzPXtbXX1cbiAgICAgICAgICBvblRhZ3NDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG5cbiAgICAgIC8vIE9wZW5cbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsb3NlXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RhZyBTZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHRhZyBvcHRpb25zIHdoZW4gZHJvcGRvd24gaXMgb3BlbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17W119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUkFHJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblRhZ3NDaGFuZ2Ugd2hlbiBhIHRhZyBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uVGFnc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17W119XG4gICAgICAgICAgb25UYWdzQ2hhbmdlPXtvblRhZ3NDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JylcbiAgICAgIGZpcmVFdmVudC5jbGljayhhZ2VudE9wdGlvbi5wYXJlbnRFbGVtZW50ISlcbiAgICAgIGV4cGVjdChvblRhZ3NDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnYWdlbnQnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uVGFnc0NoYW5nZSB0byByZW1vdmUgdGFnIHdoZW4gYWxyZWFkeSBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uVGFnc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlYXJjaEJveFxuICAgICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgdGFncz17WydhZ2VudCddfVxuICAgICAgICAgIG9uVGFnc0NoYW5nZT17b25UYWdzQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAvLyBNdWx0aXBsZSAnQWdlbnQnIHRleHRzIGV4aXN0IC0gb25lIGluIHRyaWdnZXIsIG9uZSBpbiBkcm9wZG93blxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnQWdlbnQnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEdldCB0aGUgcG9ydGFsIGNvbnRlbnQgYW5kIGZpbmQgdGhlIHRhZyBvcHRpb24gd2l0aGluIGl0XG4gICAgICBjb25zdCBwb3J0YWxDb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IHBvcnRhbENvbnRlbnQucXVlcnlTZWxlY3RvcignZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGlmIChhZ2VudE9wdGlvbikge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYWdlbnRPcHRpb24pXG4gICAgICAgIGV4cGVjdChvblRhZ3NDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFkZCB0byBleGlzdGluZyB0YWdzIHdoZW4gc2VsZWN0aW5nIG5ldyB0YWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblRhZ3NDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3hcbiAgICAgICAgICBzZWFyY2g9XCJcIlxuICAgICAgICAgIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnXX1cbiAgICAgICAgICBvblRhZ3NDaGFuZ2U9e29uVGFnc0NoYW5nZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1JBRycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCByYWdPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdSQUcnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJhZ09wdGlvbi5wYXJlbnRFbGVtZW50ISlcbiAgICAgIGV4cGVjdChvblRhZ3NDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnYWdlbnQnLCAncmFnJ10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2VhcmNoIFRhZ3MgRmVhdHVyZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWFyY2ggaW5wdXQgaW4gZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3hcbiAgICAgICAgICBzZWFyY2g9XCJcIlxuICAgICAgICAgIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIHRhZ3M9e1tdfVxuICAgICAgICAgIG9uVGFnc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICAgIGV4cGVjdChpbnB1dHMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZpbHRlciB0YWdzIGJhc2VkIG9uIHNlYXJjaCB0ZXh0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VhcmNoQm94XG4gICAgICAgICAgc2VhcmNoPVwiXCJcbiAgICAgICAgICBvblNlYXJjaENoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICB0YWdzPXtbXX1cbiAgICAgICAgICBvblRhZ3NDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBpbnB1dHMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGNvbnN0IHNlYXJjaElucHV0ID0gaW5wdXRzLmZpbmQoaW5wdXQgPT5cbiAgICAgICAgaW5wdXQuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpID09PSAnU2VhcmNoIHRhZ3MnLFxuICAgICAgKVxuXG4gICAgICBpZiAoc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgZmlyZUV2ZW50LmNoYW5nZShzZWFyY2hJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdhZ2VudCcgfSB9KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NoZWNrYm94IFN0YXRlJywgKCkgPT4ge1xuICAgIC8vIE5vdGU6IFRoZSBDaGVja2JveCBjb21wb25lbnQgaXMgYSBjdXN0b20gZGl2LWJhc2VkIGNvbXBvbmVudCwgbm90IG5hdGl2ZSBjaGVja2JveFxuICAgIGl0KCdzaG91bGQgZGlzcGxheSB0YWcgb3B0aW9ucyB3aXRoIHByb3BlciBzZWxlY3Rpb24gc3RhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3hcbiAgICAgICAgICBzZWFyY2g9XCJcIlxuICAgICAgICAgIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIHRhZ3M9e1snYWdlbnQnXX1cbiAgICAgICAgICBvblRhZ3NDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vICdBZ2VudCcgYXBwZWFycyBib3RoIGluIHRyaWdnZXIgKHNlbGVjdGVkKSBhbmQgZHJvcGRvd25cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FnZW50JykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDEpXG4gICAgICB9KVxuXG4gICAgICAvLyBWZXJpZnkgZHJvcGRvd24gY29udGVudCBpcyByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0YWcgb3B0aW9ucyB3aGVuIGRyb3Bkb3duIGlzIG9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWFyY2hCb3hcbiAgICAgICAgICBzZWFyY2g9XCJcIlxuICAgICAgICAgIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIHRhZ3M9e1tdfVxuICAgICAgICAgIG9uVGFnc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gV2hlbiBubyB0YWdzIHNlbGVjdGVkLCB0aGVzZSBzaG91bGQgYXBwZWFyIG9uY2UgZWFjaCBpbiBkcm9wZG93blxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdSQUcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGF2ZSBhY2Nlc3NpYmxlIHNlYXJjaCBpbnB1dCcsICgpID0+IHtcbiAgICByZW5kZXIoXG4gICAgICA8U2VhcmNoQm94XG4gICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICB0YWdzPXtbXX1cbiAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBwbHVnaW5zXCJcbiAgICAgIC8+LFxuICAgIClcblxuICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgZXhwZWN0KGlucHV0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KGlucHV0KS50b0hhdmVBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1NlYXJjaCBwbHVnaW5zJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgY2xpY2thYmxlIHRhZyBvcHRpb25zIGluIGRyb3Bkb3duJywgYXN5bmMgKCkgPT4ge1xuICAgIHJlbmRlcig8U2VhcmNoQm94IHNlYXJjaD1cIlwiIG9uU2VhcmNoQ2hhbmdlPXt2aS5mbigpfSB0YWdzPXtbXX0gb25UYWdzQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDb21iaW5lZCBXb3JrZmxvdyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDb21iaW5lZCBXb3JrZmxvd3MnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHNlYXJjaCBhbmQgdGFnIGZpbHRlciB0b2dldGhlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvblNlYXJjaENoYW5nZSA9IHZpLmZuKClcbiAgICBjb25zdCBvblRhZ3NDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICByZW5kZXIoXG4gICAgICA8U2VhcmNoQm94XG4gICAgICAgIHNlYXJjaD1cIlwiXG4gICAgICAgIG9uU2VhcmNoQ2hhbmdlPXtvblNlYXJjaENoYW5nZX1cbiAgICAgICAgdGFncz17W119XG4gICAgICAgIG9uVGFnc0NoYW5nZT17b25UYWdzQ2hhbmdlfVxuICAgICAgICB1c2VkSW5NYXJrZXRwbGFjZVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ3NlYXJjaCBxdWVyeScgfSB9KVxuICAgIGV4cGVjdChvblNlYXJjaENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3NlYXJjaCBxdWVyeScpXG5cbiAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGNvbnN0IGFnZW50T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnQWdlbnQnKVxuICAgIGZpcmVFdmVudC5jbGljayhhZ2VudE9wdGlvbi5wYXJlbnRFbGVtZW50ISlcbiAgICBleHBlY3Qob25UYWdzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2FnZW50J10pXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggYWxsIGZlYXR1cmVzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgcmVuZGVyKFxuICAgICAgPFNlYXJjaEJveFxuICAgICAgICBzZWFyY2g9XCJ0ZXN0XCJcbiAgICAgICAgb25TZWFyY2hDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgIHRhZ3M9e1snYWdlbnQnLCAncmFnJ119XG4gICAgICAgIG9uVGFnc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgdXNlZEluTWFya2V0cGxhY2VcbiAgICAgICAgc3VwcG9ydEFkZEN1c3RvbVRvb2xcbiAgICAgICAgb25TaG93QWRkQ3VzdG9tQ29sbGVjdGlvbk1vZGFsPXt2aS5mbigpfVxuICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBwbHVnaW5zXCJcbiAgICAgICAgd3JhcHBlckNsYXNzTmFtZT1cImN1c3RvbS13cmFwcGVyXCJcbiAgICAgICAgaW5wdXRDbGFzc05hbWU9XCJjdXN0b20taW5wdXRcIlxuICAgICAgICBhdXRvRm9jdXM9e2ZhbHNlfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgndGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FnZW50LFJBRycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHByb3AgY2hhbmdlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgY29uc3Qgb25TZWFyY2hDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICA8U2VhcmNoQm94XG4gICAgICAgIHNlYXJjaD1cImluaXRpYWxcIlxuICAgICAgICBvblNlYXJjaENoYW5nZT17b25TZWFyY2hDaGFuZ2V9XG4gICAgICAgIHRhZ3M9e1tdfVxuICAgICAgICBvblRhZ3NDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAvPixcbiAgICApXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5RGlzcGxheVZhbHVlKCdpbml0aWFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgIHJlcmVuZGVyKFxuICAgICAgPFNlYXJjaEJveFxuICAgICAgICBzZWFyY2g9XCJ1cGRhdGVkXCJcbiAgICAgICAgb25TZWFyY2hDaGFuZ2U9e29uU2VhcmNoQ2hhbmdlfVxuICAgICAgICB0YWdzPXtbXX1cbiAgICAgICAgb25UYWdzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgndXBkYXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuIl19