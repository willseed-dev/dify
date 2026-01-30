"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const app_1 = require("@/types/app");
// Import after mocks
const list_1 = require("./list");
// Mock next/navigation
const mockReplace = vi.fn();
const mockRouter = { replace: mockReplace };
vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => new URLSearchParams(''),
}));
// Mock app context
const mockIsCurrentWorkspaceEditor = vi.fn(() => true);
const mockIsCurrentWorkspaceDatasetOperator = vi.fn(() => false);
vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        isCurrentWorkspaceEditor: mockIsCurrentWorkspaceEditor(),
        isCurrentWorkspaceDatasetOperator: mockIsCurrentWorkspaceDatasetOperator(),
    }),
}));
// Mock global public store
vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: () => ({
        systemFeatures: {
            branding: { enabled: false },
        },
    }),
}));
// Mock custom hooks - allow dynamic query state
const mockSetQuery = vi.fn();
const mockQueryState = {
    tagIDs: [],
    keywords: '',
    isCreatedByMe: false,
};
vi.mock('./hooks/use-apps-query-state', () => ({
    default: () => ({
        query: mockQueryState,
        setQuery: mockSetQuery,
    }),
}));
// Store callback for testing DSL file drop
let mockOnDSLFileDropped = null;
let mockDragging = false;
vi.mock('./hooks/use-dsl-drag-drop', () => ({
    useDSLDragDrop: ({ onDSLFileDropped }) => {
        mockOnDSLFileDropped = onDSLFileDropped;
        return { dragging: mockDragging };
    },
}));
const mockSetActiveTab = vi.fn();
vi.mock('nuqs', () => ({
    useQueryState: () => ['all', mockSetActiveTab],
    parseAsString: {
        withDefault: () => ({
            withOptions: () => ({}),
        }),
    },
}));
// Mock service hooks - use object for mutable state (vi.mock is hoisted)
const mockRefetch = vi.fn();
const mockFetchNextPage = vi.fn();
const mockServiceState = {
    error: null,
    hasNextPage: false,
    isLoading: false,
    isFetchingNextPage: false,
};
const defaultAppData = {
    pages: [{
            data: [
                {
                    id: 'app-1',
                    name: 'Test App 1',
                    description: 'Description 1',
                    mode: app_1.AppModeEnum.CHAT,
                    icon: '🤖',
                    icon_type: 'emoji',
                    icon_background: '#FFEAD5',
                    tags: [],
                    author_name: 'Author 1',
                    created_at: 1704067200,
                    updated_at: 1704153600,
                },
                {
                    id: 'app-2',
                    name: 'Test App 2',
                    description: 'Description 2',
                    mode: app_1.AppModeEnum.WORKFLOW,
                    icon: '⚙️',
                    icon_type: 'emoji',
                    icon_background: '#E4FBCC',
                    tags: [],
                    author_name: 'Author 2',
                    created_at: 1704067200,
                    updated_at: 1704153600,
                },
            ],
            total: 2,
        }],
};
vi.mock('@/service/use-apps', () => ({
    useInfiniteAppList: () => ({
        data: defaultAppData,
        isLoading: mockServiceState.isLoading,
        isFetchingNextPage: mockServiceState.isFetchingNextPage,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: mockServiceState.hasNextPage,
        error: mockServiceState.error,
        refetch: mockRefetch,
    }),
}));
// Mock tag store
vi.mock('@/app/components/base/tag-management/store', () => ({
    useStore: (selector) => {
        const state = {
            tagList: [{ id: 'tag-1', name: 'Test Tag', type: 'app' }],
            setTagList: vi.fn(),
            showTagManagementModal: false,
            setShowTagManagementModal: vi.fn(),
        };
        return selector(state);
    },
}));
// Mock tag service to avoid API calls in TagFilter
vi.mock('@/service/tag', () => ({
    fetchTagList: vi.fn().mockResolvedValue([{ id: 'tag-1', name: 'Test Tag', type: 'app' }]),
}));
// Store TagFilter onChange callback for testing
let mockTagFilterOnChange = null;
vi.mock('@/app/components/base/tag-management/filter', () => ({
    default: ({ onChange }) => {
        mockTagFilterOnChange = onChange;
        return React.createElement('div', { 'data-testid': 'tag-filter' }, 'common.tag.placeholder');
    },
}));
// Mock config
vi.mock('@/config', () => ({
    NEED_REFRESH_APP_LIST_KEY: 'needRefreshAppList',
}));
// Mock pay hook
vi.mock('@/hooks/use-pay', () => ({
    CheckModal: () => null,
}));
// Mock ahooks - useMount only executes once on mount, not on fn change
vi.mock('ahooks', () => ({
    useDebounceFn: (fn) => ({ run: fn }),
    useMount: (fn) => {
        const fnRef = React.useRef(fn);
        fnRef.current = fn;
        React.useEffect(() => {
            fnRef.current();
        }, []);
    },
}));
// Mock dynamic imports
vi.mock('next/dynamic', () => ({
    default: (importFn) => {
        const fnString = importFn.toString();
        if (fnString.includes('tag-management')) {
            return function MockTagManagement() {
                return React.createElement('div', { 'data-testid': 'tag-management-modal' });
            };
        }
        if (fnString.includes('create-from-dsl-modal')) {
            return function MockCreateFromDSLModal({ show, onClose, onSuccess }) {
                if (!show)
                    return null;
                return React.createElement('div', { 'data-testid': 'create-dsl-modal' }, React.createElement('button', { 'onClick': onClose, 'data-testid': 'close-dsl-modal' }, 'Close'), React.createElement('button', { 'onClick': onSuccess, 'data-testid': 'success-dsl-modal' }, 'Success'));
            };
        }
        return () => null;
    },
}));
/**
 * Mock child components for focused List component testing.
 * These mocks isolate the List component's behavior from its children.
 * Each child component (AppCard, NewAppCard, Empty, Footer) has its own dedicated tests.
 */
vi.mock('./app-card', () => ({
    default: ({ app }) => {
        return React.createElement('div', { 'data-testid': `app-card-${app.id}`, 'role': 'article' }, app.name);
    },
}));
vi.mock('./new-app-card', () => ({
    default: React.forwardRef((_props, _ref) => {
        return React.createElement('div', { 'data-testid': 'new-app-card', 'role': 'button' }, 'New App Card');
    }),
}));
vi.mock('./empty', () => ({
    default: () => {
        return React.createElement('div', { 'data-testid': 'empty-state', 'role': 'status' }, 'No apps found');
    },
}));
vi.mock('./footer', () => ({
    default: () => {
        return React.createElement('footer', { 'data-testid': 'footer', 'role': 'contentinfo' }, 'Footer');
    },
}));
// Store IntersectionObserver callback
let intersectionCallback = null;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
// Mock IntersectionObserver
beforeAll(() => {
    globalThis.IntersectionObserver = class MockIntersectionObserver {
        constructor(callback) {
            this.observe = mockObserve;
            this.disconnect = mockDisconnect;
            this.unobserve = vi.fn();
            this.root = null;
            this.rootMargin = '';
            this.thresholds = [];
            this.takeRecords = () => [];
            intersectionCallback = callback;
        }
    };
});
describe('List', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsCurrentWorkspaceEditor.mockReturnValue(true);
        mockIsCurrentWorkspaceDatasetOperator.mockReturnValue(false);
        mockDragging = false;
        mockOnDSLFileDropped = null;
        mockTagFilterOnChange = null;
        mockServiceState.error = null;
        mockServiceState.hasNextPage = false;
        mockServiceState.isLoading = false;
        mockServiceState.isFetchingNextPage = false;
        mockQueryState.tagIDs = [];
        mockQueryState.keywords = '';
        mockQueryState.isCreatedByMe = false;
        intersectionCallback = null;
        localStorage.clear();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<list_1.default />);
            // Tab slider renders app type tabs
            expect(react_1.screen.getByText('app.types.all')).toBeInTheDocument();
        });
        it('should render tab slider with all app types', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.types.all')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.workflow')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.advanced')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.chatbot')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.agent')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.completion')).toBeInTheDocument();
        });
        it('should render search input', () => {
            (0, react_1.render)(<list_1.default />);
            // Input component renders a searchbox
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should render tag filter', () => {
            (0, react_1.render)(<list_1.default />);
            // Tag filter renders with placeholder text
            expect(react_1.screen.getByText('common.tag.placeholder')).toBeInTheDocument();
        });
        it('should render created by me checkbox', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.showMyCreatedAppsOnly')).toBeInTheDocument();
        });
        it('should render app cards when apps exist', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('app-card-app-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('app-card-app-2')).toBeInTheDocument();
        });
        it('should render new app card for editors', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('new-app-card')).toBeInTheDocument();
        });
        it('should render footer when branding is disabled', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('footer')).toBeInTheDocument();
        });
        it('should render drop DSL hint for editors', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.newApp.dropDSLToCreateApp')).toBeInTheDocument();
        });
    });
    describe('Tab Navigation', () => {
        it('should call setActiveTab when tab is clicked', () => {
            (0, react_1.render)(<list_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('app.types.workflow'));
            expect(mockSetActiveTab).toHaveBeenCalledWith(app_1.AppModeEnum.WORKFLOW);
        });
        it('should call setActiveTab for all tab', () => {
            (0, react_1.render)(<list_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('app.types.all'));
            expect(mockSetActiveTab).toHaveBeenCalledWith('all');
        });
    });
    describe('Search Functionality', () => {
        it('should render search input field', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should handle search input change', () => {
            (0, react_1.render)(<list_1.default />);
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'test search' } });
            expect(mockSetQuery).toHaveBeenCalled();
        });
        it('should handle search input interaction', () => {
            (0, react_1.render)(<list_1.default />);
            const input = react_1.screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
        });
        it('should handle search clear button click', () => {
            // Set initial keywords to make clear button visible
            mockQueryState.keywords = 'existing search';
            (0, react_1.render)(<list_1.default />);
            // Find and click clear button (Input component uses .group class for clear icon container)
            const clearButton = document.querySelector('.group');
            expect(clearButton).toBeInTheDocument();
            if (clearButton)
                react_1.fireEvent.click(clearButton);
            // handleKeywordsChange should be called with empty string
            expect(mockSetQuery).toHaveBeenCalled();
        });
    });
    describe('Tag Filter', () => {
        it('should render tag filter component', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('common.tag.placeholder')).toBeInTheDocument();
        });
        it('should render tag filter with placeholder', () => {
            (0, react_1.render)(<list_1.default />);
            // Tag filter is rendered
            expect(react_1.screen.getByText('common.tag.placeholder')).toBeInTheDocument();
        });
    });
    describe('Created By Me Filter', () => {
        it('should render checkbox with correct label', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.showMyCreatedAppsOnly')).toBeInTheDocument();
        });
        it('should handle checkbox change', () => {
            (0, react_1.render)(<list_1.default />);
            // Checkbox component uses data-testid="checkbox-{id}"
            // CheckboxWithLabel doesn't pass testId, so id is undefined
            const checkbox = react_1.screen.getByTestId('checkbox-undefined');
            react_1.fireEvent.click(checkbox);
            expect(mockSetQuery).toHaveBeenCalled();
        });
    });
    describe('Non-Editor User', () => {
        it('should not render new app card for non-editors', () => {
            mockIsCurrentWorkspaceEditor.mockReturnValue(false);
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.queryByTestId('new-app-card')).not.toBeInTheDocument();
        });
        it('should not render drop DSL hint for non-editors', () => {
            mockIsCurrentWorkspaceEditor.mockReturnValue(false);
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.queryByText(/drop dsl file to create app/i)).not.toBeInTheDocument();
        });
    });
    describe('Dataset Operator Redirect', () => {
        it('should redirect dataset operators to datasets page', () => {
            mockIsCurrentWorkspaceDatasetOperator.mockReturnValue(true);
            (0, react_1.render)(<list_1.default />);
            expect(mockReplace).toHaveBeenCalledWith('/datasets');
        });
    });
    describe('Local Storage Refresh', () => {
        it('should call refetch when refresh key is set in localStorage', () => {
            localStorage.setItem('needRefreshAppList', '1');
            (0, react_1.render)(<list_1.default />);
            expect(mockRefetch).toHaveBeenCalled();
            expect(localStorage.getItem('needRefreshAppList')).toBeNull();
        });
    });
    describe('Edge Cases', () => {
        it('should handle multiple renders without issues', () => {
            const { rerender } = (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.types.all')).toBeInTheDocument();
            rerender(<list_1.default />);
            expect(react_1.screen.getByText('app.types.all')).toBeInTheDocument();
        });
        it('should render app cards correctly', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('Test App 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test App 2')).toBeInTheDocument();
        });
        it('should render with all filter options visible', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByRole('textbox')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.tag.placeholder')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.showMyCreatedAppsOnly')).toBeInTheDocument();
        });
    });
    describe('Dragging State', () => {
        it('should show drop hint when DSL feature is enabled for editors', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.newApp.dropDSLToCreateApp')).toBeInTheDocument();
        });
    });
    describe('App Type Tabs', () => {
        it('should render all app type tabs', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.types.all')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.workflow')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.advanced')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.chatbot')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.agent')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.types.completion')).toBeInTheDocument();
        });
        it('should call setActiveTab for each app type', () => {
            (0, react_1.render)(<list_1.default />);
            const appTypeTexts = [
                { mode: app_1.AppModeEnum.WORKFLOW, text: 'app.types.workflow' },
                { mode: app_1.AppModeEnum.ADVANCED_CHAT, text: 'app.types.advanced' },
                { mode: app_1.AppModeEnum.CHAT, text: 'app.types.chatbot' },
                { mode: app_1.AppModeEnum.AGENT_CHAT, text: 'app.types.agent' },
                { mode: app_1.AppModeEnum.COMPLETION, text: 'app.types.completion' },
            ];
            appTypeTexts.forEach(({ mode, text }) => {
                react_1.fireEvent.click(react_1.screen.getByText(text));
                expect(mockSetActiveTab).toHaveBeenCalledWith(mode);
            });
        });
    });
    describe('Search and Filter Integration', () => {
        it('should display search input with correct attributes', () => {
            (0, react_1.render)(<list_1.default />);
            const input = react_1.screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('value', '');
        });
        it('should have tag filter component', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('common.tag.placeholder')).toBeInTheDocument();
        });
        it('should display created by me label', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('app.showMyCreatedAppsOnly')).toBeInTheDocument();
        });
    });
    describe('App List Display', () => {
        it('should display all app cards from data', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('app-card-app-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('app-card-app-2')).toBeInTheDocument();
        });
        it('should display app names correctly', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByText('Test App 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test App 2')).toBeInTheDocument();
        });
    });
    describe('Footer Visibility', () => {
        it('should render footer when branding is disabled', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('footer')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Additional Coverage Tests
    // --------------------------------------------------------------------------
    describe('Additional Coverage', () => {
        it('should render dragging state overlay when dragging', () => {
            mockDragging = true;
            const { container } = (0, react_1.render)(<list_1.default />);
            // Component should render successfully with dragging state
            expect(container).toBeInTheDocument();
        });
        it('should handle app mode filter in query params', () => {
            (0, react_1.render)(<list_1.default />);
            const workflowTab = react_1.screen.getByText('app.types.workflow');
            react_1.fireEvent.click(workflowTab);
            expect(mockSetActiveTab).toHaveBeenCalledWith(app_1.AppModeEnum.WORKFLOW);
        });
        it('should render new app card for editors', () => {
            (0, react_1.render)(<list_1.default />);
            expect(react_1.screen.getByTestId('new-app-card')).toBeInTheDocument();
        });
    });
    describe('DSL File Drop', () => {
        it('should handle DSL file drop and show modal', () => {
            (0, react_1.render)(<list_1.default />);
            // Simulate DSL file drop via the callback
            const mockFile = new File(['test content'], 'test.yml', { type: 'application/yaml' });
            (0, react_1.act)(() => {
                if (mockOnDSLFileDropped)
                    mockOnDSLFileDropped(mockFile);
            });
            // Modal should be shown
            expect(react_1.screen.getByTestId('create-dsl-modal')).toBeInTheDocument();
        });
        it('should close DSL modal when onClose is called', () => {
            (0, react_1.render)(<list_1.default />);
            // Open modal via DSL file drop
            const mockFile = new File(['test content'], 'test.yml', { type: 'application/yaml' });
            (0, react_1.act)(() => {
                if (mockOnDSLFileDropped)
                    mockOnDSLFileDropped(mockFile);
            });
            expect(react_1.screen.getByTestId('create-dsl-modal')).toBeInTheDocument();
            // Close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('close-dsl-modal'));
            expect(react_1.screen.queryByTestId('create-dsl-modal')).not.toBeInTheDocument();
        });
        it('should close DSL modal and refetch when onSuccess is called', () => {
            (0, react_1.render)(<list_1.default />);
            // Open modal via DSL file drop
            const mockFile = new File(['test content'], 'test.yml', { type: 'application/yaml' });
            (0, react_1.act)(() => {
                if (mockOnDSLFileDropped)
                    mockOnDSLFileDropped(mockFile);
            });
            expect(react_1.screen.getByTestId('create-dsl-modal')).toBeInTheDocument();
            // Click success button
            react_1.fireEvent.click(react_1.screen.getByTestId('success-dsl-modal'));
            // Modal should be closed and refetch should be called
            expect(react_1.screen.queryByTestId('create-dsl-modal')).not.toBeInTheDocument();
            expect(mockRefetch).toHaveBeenCalled();
        });
    });
    describe('Tag Filter Change', () => {
        it('should handle tag filter value change', () => {
            vi.useFakeTimers();
            (0, react_1.render)(<list_1.default />);
            // TagFilter component is rendered
            expect(react_1.screen.getByTestId('tag-filter')).toBeInTheDocument();
            // Trigger tag filter change via captured callback
            (0, react_1.act)(() => {
                if (mockTagFilterOnChange)
                    mockTagFilterOnChange(['tag-1', 'tag-2']);
            });
            // Advance timers to trigger debounced setTagIDs
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(500);
            });
            // setQuery should have been called with updated tagIDs
            expect(mockSetQuery).toHaveBeenCalled();
            vi.useRealTimers();
        });
        it('should handle empty tag filter selection', () => {
            vi.useFakeTimers();
            (0, react_1.render)(<list_1.default />);
            // Trigger tag filter change with empty array
            (0, react_1.act)(() => {
                if (mockTagFilterOnChange)
                    mockTagFilterOnChange([]);
            });
            // Advance timers
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(500);
            });
            expect(mockSetQuery).toHaveBeenCalled();
            vi.useRealTimers();
        });
    });
    describe('Infinite Scroll', () => {
        it('should call fetchNextPage when intersection observer triggers', () => {
            mockServiceState.hasNextPage = true;
            (0, react_1.render)(<list_1.default />);
            // Simulate intersection
            if (intersectionCallback) {
                (0, react_1.act)(() => {
                    intersectionCallback([{ isIntersecting: true }], {});
                });
            }
            expect(mockFetchNextPage).toHaveBeenCalled();
        });
        it('should not call fetchNextPage when not intersecting', () => {
            mockServiceState.hasNextPage = true;
            (0, react_1.render)(<list_1.default />);
            // Simulate non-intersection
            if (intersectionCallback) {
                (0, react_1.act)(() => {
                    intersectionCallback([{ isIntersecting: false }], {});
                });
            }
            expect(mockFetchNextPage).not.toHaveBeenCalled();
        });
        it('should not call fetchNextPage when loading', () => {
            mockServiceState.hasNextPage = true;
            mockServiceState.isLoading = true;
            (0, react_1.render)(<list_1.default />);
            if (intersectionCallback) {
                (0, react_1.act)(() => {
                    intersectionCallback([{ isIntersecting: true }], {});
                });
            }
            expect(mockFetchNextPage).not.toHaveBeenCalled();
        });
    });
    describe('Error State', () => {
        it('should handle error state in useEffect', () => {
            mockServiceState.error = new Error('Test error');
            const { container } = (0, react_1.render)(<list_1.default />);
            // Component should still render
            expect(container).toBeInTheDocument();
            // Disconnect should be called when there's an error (cleanup)
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGlzdC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUF1RTtBQUN2RSwrQkFBOEI7QUFDOUIscUNBQXlDO0FBRXpDLHFCQUFxQjtBQUNyQixpQ0FBeUI7QUFFekIsdUJBQXVCO0FBQ3ZCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMzQixNQUFNLFVBQVUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQTtBQUMzQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVU7SUFDM0IsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQztDQUMvQyxDQUFDLENBQUMsQ0FBQTtBQUVILG1CQUFtQjtBQUNuQixNQUFNLDRCQUE0QixHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEQsTUFBTSxxQ0FBcUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2hFLEVBQUUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0QyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwQix3QkFBd0IsRUFBRSw0QkFBNEIsRUFBRTtRQUN4RCxpQ0FBaUMsRUFBRSxxQ0FBcUMsRUFBRTtLQUMzRSxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCwyQkFBMkI7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELG9CQUFvQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7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QyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1lBQ2hELGdCQUFnQixDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNoRCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxjQUFJLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV0QyxnQ0FBZ0M7WUFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckMsOERBQThEO1FBQ2hFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5cbi8vIEltcG9ydCBhZnRlciBtb2Nrc1xuaW1wb3J0IExpc3QgZnJvbSAnLi9saXN0J1xuXG4vLyBNb2NrIG5leHQvbmF2aWdhdGlvblxuY29uc3QgbW9ja1JlcGxhY2UgPSB2aS5mbigpXG5jb25zdCBtb2NrUm91dGVyID0geyByZXBsYWNlOiBtb2NrUmVwbGFjZSB9XG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VSb3V0ZXI6ICgpID0+IG1vY2tSb3V0ZXIsXG4gIHVzZVNlYXJjaFBhcmFtczogKCkgPT4gbmV3IFVSTFNlYXJjaFBhcmFtcygnJyksXG59KSlcblxuLy8gTW9jayBhcHAgY29udGV4dFxuY29uc3QgbW9ja0lzQ3VycmVudFdvcmtzcGFjZUVkaXRvciA9IHZpLmZuKCgpID0+IHRydWUpXG5jb25zdCBtb2NrSXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yID0gdmkuZm4oKCkgPT4gZmFsc2UpXG52aS5tb2NrKCdAL2NvbnRleHQvYXBwLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VBcHBDb250ZXh0OiAoKSA9PiAoe1xuICAgIGlzQ3VycmVudFdvcmtzcGFjZUVkaXRvcjogbW9ja0lzQ3VycmVudFdvcmtzcGFjZUVkaXRvcigpLFxuICAgIGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvcjogbW9ja0lzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvcigpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGdsb2JhbCBwdWJsaWMgc3RvcmVcbnZpLm1vY2soJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VHbG9iYWxQdWJsaWNTdG9yZTogKCkgPT4gKHtcbiAgICBzeXN0ZW1GZWF0dXJlczoge1xuICAgICAgYnJhbmRpbmc6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGN1c3RvbSBob29rcyAtIGFsbG93IGR5bmFtaWMgcXVlcnkgc3RhdGVcbmNvbnN0IG1vY2tTZXRRdWVyeSA9IHZpLmZuKClcbmNvbnN0IG1vY2tRdWVyeVN0YXRlID0ge1xuICB0YWdJRHM6IFtdIGFzIHN0cmluZ1tdLFxuICBrZXl3b3JkczogJycsXG4gIGlzQ3JlYXRlZEJ5TWU6IGZhbHNlLFxufVxudmkubW9jaygnLi9ob29rcy91c2UtYXBwcy1xdWVyeS1zdGF0ZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7XG4gICAgcXVlcnk6IG1vY2tRdWVyeVN0YXRlLFxuICAgIHNldFF1ZXJ5OiBtb2NrU2V0UXVlcnksXG4gIH0pLFxufSkpXG5cbi8vIFN0b3JlIGNhbGxiYWNrIGZvciB0ZXN0aW5nIERTTCBmaWxlIGRyb3BcbmxldCBtb2NrT25EU0xGaWxlRHJvcHBlZDogKChmaWxlOiBGaWxlKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5sZXQgbW9ja0RyYWdnaW5nID0gZmFsc2VcbnZpLm1vY2soJy4vaG9va3MvdXNlLWRzbC1kcmFnLWRyb3AnLCAoKSA9PiAoe1xuICB1c2VEU0xEcmFnRHJvcDogKHsgb25EU0xGaWxlRHJvcHBlZCB9OiB7IG9uRFNMRmlsZURyb3BwZWQ6IChmaWxlOiBGaWxlKSA9PiB2b2lkIH0pID0+IHtcbiAgICBtb2NrT25EU0xGaWxlRHJvcHBlZCA9IG9uRFNMRmlsZURyb3BwZWRcbiAgICByZXR1cm4geyBkcmFnZ2luZzogbW9ja0RyYWdnaW5nIH1cbiAgfSxcbn0pKVxuXG5jb25zdCBtb2NrU2V0QWN0aXZlVGFiID0gdmkuZm4oKVxudmkubW9jaygnbnVxcycsICgpID0+ICh7XG4gIHVzZVF1ZXJ5U3RhdGU6ICgpID0+IFsnYWxsJywgbW9ja1NldEFjdGl2ZVRhYl0sXG4gIHBhcnNlQXNTdHJpbmc6IHtcbiAgICB3aXRoRGVmYXVsdDogKCkgPT4gKHtcbiAgICAgIHdpdGhPcHRpb25zOiAoKSA9PiAoe30pLFxuICAgIH0pLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgc2VydmljZSBob29rcyAtIHVzZSBvYmplY3QgZm9yIG11dGFibGUgc3RhdGUgKHZpLm1vY2sgaXMgaG9pc3RlZClcbmNvbnN0IG1vY2tSZWZldGNoID0gdmkuZm4oKVxuY29uc3QgbW9ja0ZldGNoTmV4dFBhZ2UgPSB2aS5mbigpXG5cbmNvbnN0IG1vY2tTZXJ2aWNlU3RhdGUgPSB7XG4gIGVycm9yOiBudWxsIGFzIEVycm9yIHwgbnVsbCxcbiAgaGFzTmV4dFBhZ2U6IGZhbHNlLFxuICBpc0xvYWRpbmc6IGZhbHNlLFxuICBpc0ZldGNoaW5nTmV4dFBhZ2U6IGZhbHNlLFxufVxuXG5jb25zdCBkZWZhdWx0QXBwRGF0YSA9IHtcbiAgcGFnZXM6IFt7XG4gICAgZGF0YTogW1xuICAgICAge1xuICAgICAgICBpZDogJ2FwcC0xJyxcbiAgICAgICAgbmFtZTogJ1Rlc3QgQXBwIDEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0Rlc2NyaXB0aW9uIDEnLFxuICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICAgICAgICBpY29uOiAn8J+klicsXG4gICAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBhdXRob3JfbmFtZTogJ0F1dGhvciAxJyxcbiAgICAgICAgY3JlYXRlZF9hdDogMTcwNDA2NzIwMCxcbiAgICAgICAgdXBkYXRlZF9hdDogMTcwNDE1MzYwMCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnYXBwLTInLFxuICAgICAgICBuYW1lOiAnVGVzdCBBcHAgMicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24gMicsXG4gICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLldPUktGTE9XLFxuICAgICAgICBpY29uOiAn4pqZ77iPJyxcbiAgICAgICAgaWNvbl90eXBlOiAnZW1vamknLFxuICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjRTRGQkNDJyxcbiAgICAgICAgdGFnczogW10sXG4gICAgICAgIGF1dGhvcl9uYW1lOiAnQXV0aG9yIDInLFxuICAgICAgICBjcmVhdGVkX2F0OiAxNzA0MDY3MjAwLFxuICAgICAgICB1cGRhdGVkX2F0OiAxNzA0MTUzNjAwLFxuICAgICAgfSxcbiAgICBdLFxuICAgIHRvdGFsOiAyLFxuICB9XSxcbn1cblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1hcHBzJywgKCkgPT4gKHtcbiAgdXNlSW5maW5pdGVBcHBMaXN0OiAoKSA9PiAoe1xuICAgIGRhdGE6IGRlZmF1bHRBcHBEYXRhLFxuICAgIGlzTG9hZGluZzogbW9ja1NlcnZpY2VTdGF0ZS5pc0xvYWRpbmcsXG4gICAgaXNGZXRjaGluZ05leHRQYWdlOiBtb2NrU2VydmljZVN0YXRlLmlzRmV0Y2hpbmdOZXh0UGFnZSxcbiAgICBmZXRjaE5leHRQYWdlOiBtb2NrRmV0Y2hOZXh0UGFnZSxcbiAgICBoYXNOZXh0UGFnZTogbW9ja1NlcnZpY2VTdGF0ZS5oYXNOZXh0UGFnZSxcbiAgICBlcnJvcjogbW9ja1NlcnZpY2VTdGF0ZS5lcnJvcixcbiAgICByZWZldGNoOiBtb2NrUmVmZXRjaCxcbiAgfSksXG59KSlcblxuLy8gTW9jayB0YWcgc3RvcmVcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90YWctbWFuYWdlbWVudC9zdG9yZScsICgpID0+ICh7XG4gIHVzZVN0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogeyB0YWdMaXN0OiBhbnlbXSwgc2V0VGFnTGlzdDogYW55LCBzaG93VGFnTWFuYWdlbWVudE1vZGFsOiBib29sZWFuLCBzZXRTaG93VGFnTWFuYWdlbWVudE1vZGFsOiBhbnkgfSkgPT4gYW55KSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICB0YWdMaXN0OiBbeyBpZDogJ3RhZy0xJywgbmFtZTogJ1Rlc3QgVGFnJywgdHlwZTogJ2FwcCcgfV0sXG4gICAgICBzZXRUYWdMaXN0OiB2aS5mbigpLFxuICAgICAgc2hvd1RhZ01hbmFnZW1lbnRNb2RhbDogZmFsc2UsXG4gICAgICBzZXRTaG93VGFnTWFuYWdlbWVudE1vZGFsOiB2aS5mbigpLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG59KSlcblxuLy8gTW9jayB0YWcgc2VydmljZSB0byBhdm9pZCBBUEkgY2FsbHMgaW4gVGFnRmlsdGVyXG52aS5tb2NrKCdAL3NlcnZpY2UvdGFnJywgKCkgPT4gKHtcbiAgZmV0Y2hUYWdMaXN0OiB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKFt7IGlkOiAndGFnLTEnLCBuYW1lOiAnVGVzdCBUYWcnLCB0eXBlOiAnYXBwJyB9XSksXG59KSlcblxuLy8gU3RvcmUgVGFnRmlsdGVyIG9uQ2hhbmdlIGNhbGxiYWNrIGZvciB0ZXN0aW5nXG5sZXQgbW9ja1RhZ0ZpbHRlck9uQ2hhbmdlOiAoKHZhbHVlOiBzdHJpbmdbXSkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RhZy1tYW5hZ2VtZW50L2ZpbHRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uQ2hhbmdlIH06IHsgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nW10pID0+IHZvaWQgfSkgPT4ge1xuICAgIG1vY2tUYWdGaWx0ZXJPbkNoYW5nZSA9IG9uQ2hhbmdlXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgJ2RhdGEtdGVzdGlkJzogJ3RhZy1maWx0ZXInIH0sICdjb21tb24udGFnLnBsYWNlaG9sZGVyJylcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGNvbmZpZ1xudmkubW9jaygnQC9jb25maWcnLCAoKSA9PiAoe1xuICBORUVEX1JFRlJFU0hfQVBQX0xJU1RfS0VZOiAnbmVlZFJlZnJlc2hBcHBMaXN0Jyxcbn0pKVxuXG4vLyBNb2NrIHBheSBob29rXG52aS5tb2NrKCdAL2hvb2tzL3VzZS1wYXknLCAoKSA9PiAoe1xuICBDaGVja01vZGFsOiAoKSA9PiBudWxsLFxufSkpXG5cbi8vIE1vY2sgYWhvb2tzIC0gdXNlTW91bnQgb25seSBleGVjdXRlcyBvbmNlIG9uIG1vdW50LCBub3Qgb24gZm4gY2hhbmdlXG52aS5tb2NrKCdhaG9va3MnLCAoKSA9PiAoe1xuICB1c2VEZWJvdW5jZUZuOiAoZm46ICgpID0+IHZvaWQpID0+ICh7IHJ1bjogZm4gfSksXG4gIHVzZU1vdW50OiAoZm46ICgpID0+IHZvaWQpID0+IHtcbiAgICBjb25zdCBmblJlZiA9IFJlYWN0LnVzZVJlZihmbilcbiAgICBmblJlZi5jdXJyZW50ID0gZm5cbiAgICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgZm5SZWYuY3VycmVudCgpXG4gICAgfSwgW10pXG4gIH0sXG59KSlcblxuLy8gTW9jayBkeW5hbWljIGltcG9ydHNcbnZpLm1vY2soJ25leHQvZHluYW1pYycsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChpbXBvcnRGbjogKCkgPT4gUHJvbWlzZTxhbnk+KSA9PiB7XG4gICAgY29uc3QgZm5TdHJpbmcgPSBpbXBvcnRGbi50b1N0cmluZygpXG5cbiAgICBpZiAoZm5TdHJpbmcuaW5jbHVkZXMoJ3RhZy1tYW5hZ2VtZW50JykpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBNb2NrVGFnTWFuYWdlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgJ2RhdGEtdGVzdGlkJzogJ3RhZy1tYW5hZ2VtZW50LW1vZGFsJyB9KVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm5TdHJpbmcuaW5jbHVkZXMoJ2NyZWF0ZS1mcm9tLWRzbC1tb2RhbCcpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gTW9ja0NyZWF0ZUZyb21EU0xNb2RhbCh7IHNob3csIG9uQ2xvc2UsIG9uU3VjY2VzcyB9OiBhbnkpIHtcbiAgICAgICAgaWYgKCFzaG93KVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICdjcmVhdGUtZHNsLW1vZGFsJyB9LCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogb25DbG9zZSwgJ2RhdGEtdGVzdGlkJzogJ2Nsb3NlLWRzbC1tb2RhbCcgfSwgJ0Nsb3NlJyksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHsgJ29uQ2xpY2snOiBvblN1Y2Nlc3MsICdkYXRhLXRlc3RpZCc6ICdzdWNjZXNzLWRzbC1tb2RhbCcgfSwgJ1N1Y2Nlc3MnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICgpID0+IG51bGxcbiAgfSxcbn0pKVxuXG4vKipcbiAqIE1vY2sgY2hpbGQgY29tcG9uZW50cyBmb3IgZm9jdXNlZCBMaXN0IGNvbXBvbmVudCB0ZXN0aW5nLlxuICogVGhlc2UgbW9ja3MgaXNvbGF0ZSB0aGUgTGlzdCBjb21wb25lbnQncyBiZWhhdmlvciBmcm9tIGl0cyBjaGlsZHJlbi5cbiAqIEVhY2ggY2hpbGQgY29tcG9uZW50IChBcHBDYXJkLCBOZXdBcHBDYXJkLCBFbXB0eSwgRm9vdGVyKSBoYXMgaXRzIG93biBkZWRpY2F0ZWQgdGVzdHMuXG4gKi9cbnZpLm1vY2soJy4vYXBwLWNhcmQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBhcHAgfTogYW55KSA9PiB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgJ2RhdGEtdGVzdGlkJzogYGFwcC1jYXJkLSR7YXBwLmlkfWAsICdyb2xlJzogJ2FydGljbGUnIH0sIGFwcC5uYW1lKVxuICB9LFxufSkpXG5cbnZpLm1vY2soJy4vbmV3LWFwcC1jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogUmVhY3QuZm9yd2FyZFJlZigoX3Byb3BzOiBhbnksIF9yZWY6IGFueSkgPT4ge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICduZXctYXBwLWNhcmQnLCAncm9sZSc6ICdidXR0b24nIH0sICdOZXcgQXBwIENhcmQnKVxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCcuL2VtcHR5JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4ge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICdlbXB0eS1zdGF0ZScsICdyb2xlJzogJ3N0YXR1cycgfSwgJ05vIGFwcHMgZm91bmQnKVxuICB9LFxufSkpXG5cbnZpLm1vY2soJy4vZm9vdGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4ge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdmb290ZXInLCB7ICdkYXRhLXRlc3RpZCc6ICdmb290ZXInLCAncm9sZSc6ICdjb250ZW50aW5mbycgfSwgJ0Zvb3RlcicpXG4gIH0sXG59KSlcblxuLy8gU3RvcmUgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgY2FsbGJhY2tcbmxldCBpbnRlcnNlY3Rpb25DYWxsYmFjazogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjayB8IG51bGwgPSBudWxsXG5jb25zdCBtb2NrT2JzZXJ2ZSA9IHZpLmZuKClcbmNvbnN0IG1vY2tEaXNjb25uZWN0ID0gdmkuZm4oKVxuXG4vLyBNb2NrIEludGVyc2VjdGlvbk9ic2VydmVyXG5iZWZvcmVBbGwoKCkgPT4ge1xuICBnbG9iYWxUaGlzLkludGVyc2VjdGlvbk9ic2VydmVyID0gY2xhc3MgTW9ja0ludGVyc2VjdGlvbk9ic2VydmVyIHtcbiAgICBjb25zdHJ1Y3RvcihjYWxsYmFjazogSW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjaykge1xuICAgICAgaW50ZXJzZWN0aW9uQ2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIH1cblxuICAgIG9ic2VydmUgPSBtb2NrT2JzZXJ2ZVxuICAgIGRpc2Nvbm5lY3QgPSBtb2NrRGlzY29ubmVjdFxuICAgIHVub2JzZXJ2ZSA9IHZpLmZuKClcbiAgICByb290ID0gbnVsbFxuICAgIHJvb3RNYXJnaW4gPSAnJ1xuICAgIHRocmVzaG9sZHMgPSBbXVxuICAgIHRha2VSZWNvcmRzID0gKCkgPT4gW11cbiAgfSBhcyB1bmtub3duIGFzIHR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlclxufSlcblxuZGVzY3JpYmUoJ0xpc3QnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tJc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvci5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgbW9ja0RyYWdnaW5nID0gZmFsc2VcbiAgICBtb2NrT25EU0xGaWxlRHJvcHBlZCA9IG51bGxcbiAgICBtb2NrVGFnRmlsdGVyT25DaGFuZ2UgPSBudWxsXG4gICAgbW9ja1NlcnZpY2VTdGF0ZS5lcnJvciA9IG51bGxcbiAgICBtb2NrU2VydmljZVN0YXRlLmhhc05leHRQYWdlID0gZmFsc2VcbiAgICBtb2NrU2VydmljZVN0YXRlLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgbW9ja1NlcnZpY2VTdGF0ZS5pc0ZldGNoaW5nTmV4dFBhZ2UgPSBmYWxzZVxuICAgIG1vY2tRdWVyeVN0YXRlLnRhZ0lEcyA9IFtdXG4gICAgbW9ja1F1ZXJ5U3RhdGUua2V5d29yZHMgPSAnJ1xuICAgIG1vY2tRdWVyeVN0YXRlLmlzQ3JlYXRlZEJ5TWUgPSBmYWxzZVxuICAgIGludGVyc2VjdGlvbkNhbGxiYWNrID0gbnVsbFxuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuICAgICAgLy8gVGFiIHNsaWRlciByZW5kZXJzIGFwcCB0eXBlIHRhYnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMuYWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFiIHNsaWRlciB3aXRoIGFsbCBhcHAgdHlwZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMuYWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMud29ya2Zsb3cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hZHZhbmNlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVzLmNoYXRib3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVzLmNvbXBsZXRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWFyY2ggaW5wdXQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG4gICAgICAvLyBJbnB1dCBjb21wb25lbnQgcmVuZGVycyBhIHNlYXJjaGJveFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0YWcgZmlsdGVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuICAgICAgLy8gVGFnIGZpbHRlciByZW5kZXJzIHdpdGggcGxhY2Vob2xkZXIgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi50YWcucGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjcmVhdGVkIGJ5IG1lIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5zaG93TXlDcmVhdGVkQXBwc09ubHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhcHAgY2FyZHMgd2hlbiBhcHBzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhcHAtY2FyZC1hcHAtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhcHAtY2FyZC1hcHAtMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5ldyBhcHAgY2FyZCBmb3IgZWRpdG9ycycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ25ldy1hcHAtY2FyZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB3aGVuIGJyYW5kaW5nIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9vdGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZHJvcCBEU0wgaGludCBmb3IgZWRpdG9ycycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAubmV3QXBwLmRyb3BEU0xUb0NyZWF0ZUFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVGFiIE5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldEFjdGl2ZVRhYiB3aGVuIHRhYiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVzLndvcmtmbG93JykpXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0QWN0aXZlVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChBcHBNb2RlRW51bS5XT1JLRkxPVylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldEFjdGl2ZVRhYiBmb3IgYWxsIHRhYicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hbGwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRBY3RpdmVUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdhbGwnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlYXJjaCBGdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlYXJjaCBpbnB1dCBmaWVsZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VhcmNoIGlucHV0IGNoYW5nZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAndGVzdCBzZWFyY2gnIH0gfSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRRdWVyeSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNlYXJjaCBpbnB1dCBpbnRlcmFjdGlvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGV4cGVjdChpbnB1dCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZWFyY2ggY2xlYXIgYnV0dG9uIGNsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gU2V0IGluaXRpYWwga2V5d29yZHMgdG8gbWFrZSBjbGVhciBidXR0b24gdmlzaWJsZVxuICAgICAgbW9ja1F1ZXJ5U3RhdGUua2V5d29yZHMgPSAnZXhpc3Rpbmcgc2VhcmNoJ1xuXG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIC8vIEZpbmQgYW5kIGNsaWNrIGNsZWFyIGJ1dHRvbiAoSW5wdXQgY29tcG9uZW50IHVzZXMgLmdyb3VwIGNsYXNzIGZvciBjbGVhciBpY29uIGNvbnRhaW5lcilcbiAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyb3VwJylcbiAgICAgIGV4cGVjdChjbGVhckJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgaWYgKGNsZWFyQnV0dG9uKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xlYXJCdXR0b24pXG5cbiAgICAgIC8vIGhhbmRsZUtleXdvcmRzQ2hhbmdlIHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlbXB0eSBzdHJpbmdcbiAgICAgIGV4cGVjdChtb2NrU2V0UXVlcnkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RhZyBGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFnIGZpbHRlciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLnRhZy5wbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRhZyBmaWx0ZXIgd2l0aCBwbGFjZWhvbGRlcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgLy8gVGFnIGZpbHRlciBpcyByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi50YWcucGxhY2Vob2xkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NyZWF0ZWQgQnkgTWUgRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94IHdpdGggY29ycmVjdCBsYWJlbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuc2hvd015Q3JlYXRlZEFwcHNPbmx5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY2hlY2tib3ggY2hhbmdlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBDaGVja2JveCBjb21wb25lbnQgdXNlcyBkYXRhLXRlc3RpZD1cImNoZWNrYm94LXtpZH1cIlxuICAgICAgLy8gQ2hlY2tib3hXaXRoTGFiZWwgZG9lc24ndCBwYXNzIHRlc3RJZCwgc28gaWQgaXMgdW5kZWZpbmVkXG4gICAgICBjb25zdCBjaGVja2JveCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gtdW5kZWZpbmVkJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjaGVja2JveClcblxuICAgICAgZXhwZWN0KG1vY2tTZXRRdWVyeSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTm9uLUVkaXRvciBVc2VyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBuZXcgYXBwIGNhcmQgZm9yIG5vbi1lZGl0b3JzJywgKCkgPT4ge1xuICAgICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZUVkaXRvci5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG5cbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCduZXctYXBwLWNhcmQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGRyb3AgRFNMIGhpbnQgZm9yIG5vbi1lZGl0b3JzJywgKCkgPT4ge1xuICAgICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZUVkaXRvci5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG5cbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvZHJvcCBkc2wgZmlsZSB0byBjcmVhdGUgYXBwL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RhdGFzZXQgT3BlcmF0b3IgUmVkaXJlY3QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBkYXRhc2V0IG9wZXJhdG9ycyB0byBkYXRhc2V0cyBwYWdlJywgKCkgPT4ge1xuICAgICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvci5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcblxuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBleHBlY3QobW9ja1JlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0xvY2FsIFN0b3JhZ2UgUmVmcmVzaCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgcmVmZXRjaCB3aGVuIHJlZnJlc2gga2V5IGlzIHNldCBpbiBsb2NhbFN0b3JhZ2UnLCAoKSA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbmVlZFJlZnJlc2hBcHBMaXN0JywgJzEnKVxuXG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrUmVmZXRjaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ25lZWRSZWZyZXNoQXBwTGlzdCcpKS50b0JlTnVsbCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSByZW5kZXJzIHdpdGhvdXQgaXNzdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMaXN0IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8TGlzdCAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMuYWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXBwIGNhcmRzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQXBwIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQXBwIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGFsbCBmaWx0ZXIgb3B0aW9ucyB2aXNpYmxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLnRhZy5wbGFjZWhvbGRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnNob3dNeUNyZWF0ZWRBcHBzT25seScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRHJhZ2dpbmcgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGRyb3AgaGludCB3aGVuIERTTCBmZWF0dXJlIGlzIGVuYWJsZWQgZm9yIGVkaXRvcnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLm5ld0FwcC5kcm9wRFNMVG9DcmVhdGVBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0FwcCBUeXBlIFRhYnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGFwcCB0eXBlIHRhYnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMuYWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAudHlwZXMud29ya2Zsb3cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hZHZhbmNlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVzLmNoYXRib3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy5hZ2VudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVzLmNvbXBsZXRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0QWN0aXZlVGFiIGZvciBlYWNoIGFwcCB0eXBlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBjb25zdCBhcHBUeXBlVGV4dHMgPSBbXG4gICAgICAgIHsgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1csIHRleHQ6ICdhcHAudHlwZXMud29ya2Zsb3cnIH0sXG4gICAgICAgIHsgbW9kZTogQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCwgdGV4dDogJ2FwcC50eXBlcy5hZHZhbmNlZCcgfSxcbiAgICAgICAgeyBtb2RlOiBBcHBNb2RlRW51bS5DSEFULCB0ZXh0OiAnYXBwLnR5cGVzLmNoYXRib3QnIH0sXG4gICAgICAgIHsgbW9kZTogQXBwTW9kZUVudW0uQUdFTlRfQ0hBVCwgdGV4dDogJ2FwcC50eXBlcy5hZ2VudCcgfSxcbiAgICAgICAgeyBtb2RlOiBBcHBNb2RlRW51bS5DT01QTEVUSU9OLCB0ZXh0OiAnYXBwLnR5cGVzLmNvbXBsZXRpb24nIH0sXG4gICAgICBdXG5cbiAgICAgIGFwcFR5cGVUZXh0cy5mb3JFYWNoKCh7IG1vZGUsIHRleHQgfSkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCh0ZXh0KSlcbiAgICAgICAgZXhwZWN0KG1vY2tTZXRBY3RpdmVUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1vZGUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlYXJjaCBhbmQgRmlsdGVyIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBzZWFyY2ggaW5wdXQgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlQXR0cmlidXRlKCd2YWx1ZScsICcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgdGFnIGZpbHRlciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24udGFnLnBsYWNlaG9sZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNyZWF0ZWQgYnkgbWUgbGFiZWwnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuc2hvd015Q3JlYXRlZEFwcHNPbmx5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBcHAgTGlzdCBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBhbGwgYXBwIGNhcmRzIGZyb20gZGF0YScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLWNhcmQtYXBwLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLWNhcmQtYXBwLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgYXBwIG5hbWVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQXBwIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQXBwIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Zvb3RlciBWaXNpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB3aGVuIGJyYW5kaW5nIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb290ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQWRkaXRpb25hbCBDb3ZlcmFnZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWRkaXRpb25hbCBDb3ZlcmFnZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkcmFnZ2luZyBzdGF0ZSBvdmVybGF5IHdoZW4gZHJhZ2dpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrRHJhZ2dpbmcgPSB0cnVlXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBDb21wb25lbnQgc2hvdWxkIHJlbmRlciBzdWNjZXNzZnVsbHkgd2l0aCBkcmFnZ2luZyBzdGF0ZVxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhcHAgbW9kZSBmaWx0ZXIgaW4gcXVlcnkgcGFyYW1zJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBjb25zdCB3b3JrZmxvd1RhYiA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC50eXBlcy53b3JrZmxvdycpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sod29ya2Zsb3dUYWIpXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0QWN0aXZlVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChBcHBNb2RlRW51bS5XT1JLRkxPVylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbmV3IGFwcCBjYXJkIGZvciBlZGl0b3JzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCduZXctYXBwLWNhcmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RTTCBGaWxlIERyb3AnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgRFNMIGZpbGUgZHJvcCBhbmQgc2hvdyBtb2RhbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgLy8gU2ltdWxhdGUgRFNMIGZpbGUgZHJvcCB2aWEgdGhlIGNhbGxiYWNrXG4gICAgICBjb25zdCBtb2NrRmlsZSA9IG5ldyBGaWxlKFsndGVzdCBjb250ZW50J10sICd0ZXN0LnltbCcsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL3lhbWwnIH0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBpZiAobW9ja09uRFNMRmlsZURyb3BwZWQpXG4gICAgICAgICAgbW9ja09uRFNMRmlsZURyb3BwZWQobW9ja0ZpbGUpXG4gICAgICB9KVxuXG4gICAgICAvLyBNb2RhbCBzaG91bGQgYmUgc2hvd25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyZWF0ZS1kc2wtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIERTTCBtb2RhbCB3aGVuIG9uQ2xvc2UgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBPcGVuIG1vZGFsIHZpYSBEU0wgZmlsZSBkcm9wXG4gICAgICBjb25zdCBtb2NrRmlsZSA9IG5ldyBGaWxlKFsndGVzdCBjb250ZW50J10sICd0ZXN0LnltbCcsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL3lhbWwnIH0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBpZiAobW9ja09uRFNMRmlsZURyb3BwZWQpXG4gICAgICAgICAgbW9ja09uRFNMRmlsZURyb3BwZWQobW9ja0ZpbGUpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmVhdGUtZHNsLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xvc2UgbW9kYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLWRzbC1tb2RhbCcpKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NyZWF0ZS1kc2wtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBEU0wgbW9kYWwgYW5kIHJlZmV0Y2ggd2hlbiBvblN1Y2Nlc3MgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBPcGVuIG1vZGFsIHZpYSBEU0wgZmlsZSBkcm9wXG4gICAgICBjb25zdCBtb2NrRmlsZSA9IG5ldyBGaWxlKFsndGVzdCBjb250ZW50J10sICd0ZXN0LnltbCcsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL3lhbWwnIH0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBpZiAobW9ja09uRFNMRmlsZURyb3BwZWQpXG4gICAgICAgICAgbW9ja09uRFNMRmlsZURyb3BwZWQobW9ja0ZpbGUpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmVhdGUtZHNsLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2xpY2sgc3VjY2VzcyBidXR0b25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N1Y2Nlc3MtZHNsLW1vZGFsJykpXG5cbiAgICAgIC8vIE1vZGFsIHNob3VsZCBiZSBjbG9zZWQgYW5kIHJlZmV0Y2ggc2hvdWxkIGJlIGNhbGxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjcmVhdGUtZHNsLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QobW9ja1JlZmV0Y2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RhZyBGaWx0ZXIgQ2hhbmdlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRhZyBmaWx0ZXIgdmFsdWUgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdmkudXNlRmFrZVRpbWVycygpXG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIC8vIFRhZ0ZpbHRlciBjb21wb25lbnQgaXMgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RhZy1maWx0ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBUcmlnZ2VyIHRhZyBmaWx0ZXIgY2hhbmdlIHZpYSBjYXB0dXJlZCBjYWxsYmFja1xuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgaWYgKG1vY2tUYWdGaWx0ZXJPbkNoYW5nZSlcbiAgICAgICAgICBtb2NrVGFnRmlsdGVyT25DaGFuZ2UoWyd0YWctMScsICd0YWctMiddKVxuICAgICAgfSlcblxuICAgICAgLy8gQWR2YW5jZSB0aW1lcnMgdG8gdHJpZ2dlciBkZWJvdW5jZWQgc2V0VGFnSURzXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDUwMClcbiAgICAgIH0pXG5cbiAgICAgIC8vIHNldFF1ZXJ5IHNob3VsZCBoYXZlIGJlZW4gY2FsbGVkIHdpdGggdXBkYXRlZCB0YWdJRHNcbiAgICAgIGV4cGVjdChtb2NrU2V0UXVlcnkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICB2aS51c2VSZWFsVGltZXJzKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGFnIGZpbHRlciBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgICAgIHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgLy8gVHJpZ2dlciB0YWcgZmlsdGVyIGNoYW5nZSB3aXRoIGVtcHR5IGFycmF5XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBpZiAobW9ja1RhZ0ZpbHRlck9uQ2hhbmdlKVxuICAgICAgICAgIG1vY2tUYWdGaWx0ZXJPbkNoYW5nZShbXSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFkdmFuY2UgdGltZXJzXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDUwMClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0UXVlcnkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICB2aS51c2VSZWFsVGltZXJzKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbmZpbml0ZSBTY3JvbGwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoTmV4dFBhZ2Ugd2hlbiBpbnRlcnNlY3Rpb24gb2JzZXJ2ZXIgdHJpZ2dlcnMnLCAoKSA9PiB7XG4gICAgICBtb2NrU2VydmljZVN0YXRlLmhhc05leHRQYWdlID0gdHJ1ZVxuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBTaW11bGF0ZSBpbnRlcnNlY3Rpb25cbiAgICAgIGlmIChpbnRlcnNlY3Rpb25DYWxsYmFjaykge1xuICAgICAgICBhY3QoKCkgPT4ge1xuICAgICAgICAgIGludGVyc2VjdGlvbkNhbGxiYWNrIShcbiAgICAgICAgICAgIFt7IGlzSW50ZXJzZWN0aW5nOiB0cnVlIH0gYXMgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeV0sXG4gICAgICAgICAgICB7fSBhcyBJbnRlcnNlY3Rpb25PYnNlcnZlcixcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hOZXh0UGFnZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZmV0Y2hOZXh0UGFnZSB3aGVuIG5vdCBpbnRlcnNlY3RpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrU2VydmljZVN0YXRlLmhhc05leHRQYWdlID0gdHJ1ZVxuICAgICAgcmVuZGVyKDxMaXN0IC8+KVxuXG4gICAgICAvLyBTaW11bGF0ZSBub24taW50ZXJzZWN0aW9uXG4gICAgICBpZiAoaW50ZXJzZWN0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgICBpbnRlcnNlY3Rpb25DYWxsYmFjayEoXG4gICAgICAgICAgICBbeyBpc0ludGVyc2VjdGluZzogZmFsc2UgfSBhcyBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5XSxcbiAgICAgICAgICAgIHt9IGFzIEludGVyc2VjdGlvbk9ic2VydmVyLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KG1vY2tGZXRjaE5leHRQYWdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZmV0Y2hOZXh0UGFnZSB3aGVuIGxvYWRpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrU2VydmljZVN0YXRlLmhhc05leHRQYWdlID0gdHJ1ZVxuICAgICAgbW9ja1NlcnZpY2VTdGF0ZS5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICByZW5kZXIoPExpc3QgLz4pXG5cbiAgICAgIGlmIChpbnRlcnNlY3Rpb25DYWxsYmFjaykge1xuICAgICAgICBhY3QoKCkgPT4ge1xuICAgICAgICAgIGludGVyc2VjdGlvbkNhbGxiYWNrIShcbiAgICAgICAgICAgIFt7IGlzSW50ZXJzZWN0aW5nOiB0cnVlIH0gYXMgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeV0sXG4gICAgICAgICAgICB7fSBhcyBJbnRlcnNlY3Rpb25PYnNlcnZlcixcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hOZXh0UGFnZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Vycm9yIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVycm9yIHN0YXRlIGluIHVzZUVmZmVjdCcsICgpID0+IHtcbiAgICAgIG1vY2tTZXJ2aWNlU3RhdGUuZXJyb3IgPSBuZXcgRXJyb3IoJ1Rlc3QgZXJyb3InKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGlzdCAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXJcbiAgICAgIGV4cGVjdChjb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIERpc2Nvbm5lY3Qgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZXJlJ3MgYW4gZXJyb3IgKGNsZWFudXApXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=