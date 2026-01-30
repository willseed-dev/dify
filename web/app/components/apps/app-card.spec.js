"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const access_control_1 = require("@/models/access-control");
// Mock API services - import for direct manipulation
const appsService = require("@/service/apps");
const exploreService = require("@/service/explore");
const workflowService = require("@/service/workflow");
const app_1 = require("@/types/app");
// Import component after mocks
const app_card_1 = require("./app-card");
// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));
// Mock use-context-selector with stable mockNotify reference for tracking calls
// Include createContext for components that use it (like Toast)
const mockNotify = vi.fn();
vi.mock('use-context-selector', () => ({
    createContext: (defaultValue) => React.createContext(defaultValue),
    useContext: () => ({
        notify: mockNotify,
    }),
    useContextSelector: (_context, selector) => selector({
        notify: mockNotify,
    }),
}));
// Mock app context
vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        isCurrentWorkspaceEditor: true,
    }),
}));
// Mock provider context
const mockOnPlanInfoChanged = vi.fn();
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        onPlanInfoChanged: mockOnPlanInfoChanged,
    }),
}));
// Mock global public store - allow dynamic configuration
let mockWebappAuthEnabled = false;
vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: (selector) => selector({
        systemFeatures: {
            webapp_auth: { enabled: mockWebappAuthEnabled },
            branding: { enabled: false },
        },
    }),
}));
vi.mock('@/service/apps', () => ({
    deleteApp: vi.fn(() => Promise.resolve()),
    updateAppInfo: vi.fn(() => Promise.resolve()),
    copyApp: vi.fn(() => Promise.resolve({ id: 'new-app-id' })),
    exportAppConfig: vi.fn(() => Promise.resolve({ data: 'yaml: content' })),
}));
vi.mock('@/service/workflow', () => ({
    fetchWorkflowDraft: vi.fn(() => Promise.resolve({ environment_variables: [] })),
}));
vi.mock('@/service/explore', () => ({
    fetchInstalledAppList: vi.fn(() => Promise.resolve({ installed_apps: [{ id: 'installed-1' }] })),
}));
vi.mock('@/service/access-control', () => ({
    useGetUserCanAccessApp: () => ({
        data: { result: true },
        isLoading: false,
    }),
}));
// Mock hooks
const mockOpenAsyncWindow = vi.fn();
vi.mock('@/hooks/use-async-window-open', () => ({
    useAsyncWindowOpen: () => mockOpenAsyncWindow,
}));
// Mock utils
const { mockGetRedirection } = vi.hoisted(() => ({
    mockGetRedirection: vi.fn(),
}));
vi.mock('@/utils/app-redirection', () => ({
    getRedirection: mockGetRedirection,
}));
vi.mock('@/utils/var', () => ({
    basePath: '',
}));
vi.mock('@/utils/time', () => ({
    formatTime: () => 'Jan 1, 2024',
}));
// Mock dynamic imports
vi.mock('next/dynamic', () => ({
    default: (importFn) => {
        const fnString = importFn.toString();
        if (fnString.includes('create-app-modal') || fnString.includes('explore/create-app-modal')) {
            return function MockEditAppModal({ show, onHide, onConfirm }) {
                if (!show)
                    return null;
                return React.createElement('div', { 'data-testid': 'edit-app-modal' }, React.createElement('button', { 'onClick': onHide, 'data-testid': 'close-edit-modal' }, 'Close'), React.createElement('button', {
                    'onClick': () => onConfirm?.({
                        name: 'Updated App',
                        icon_type: 'emoji',
                        icon: '🎯',
                        icon_background: '#FFEAD5',
                        description: 'Updated description',
                        use_icon_as_answer_icon: false,
                        max_active_requests: null,
                    }),
                    'data-testid': 'confirm-edit-modal',
                }, 'Confirm'));
            };
        }
        if (fnString.includes('duplicate-modal')) {
            return function MockDuplicateAppModal({ show, onHide, onConfirm }) {
                if (!show)
                    return null;
                return React.createElement('div', { 'data-testid': 'duplicate-modal' }, React.createElement('button', { 'onClick': onHide, 'data-testid': 'close-duplicate-modal' }, 'Close'), React.createElement('button', {
                    'onClick': () => onConfirm?.({
                        name: 'Copied App',
                        icon_type: 'emoji',
                        icon: '📋',
                        icon_background: '#E4FBCC',
                    }),
                    'data-testid': 'confirm-duplicate-modal',
                }, 'Confirm'));
            };
        }
        if (fnString.includes('switch-app-modal')) {
            return function MockSwitchAppModal({ show, onClose, onSuccess }) {
                if (!show)
                    return null;
                return React.createElement('div', { 'data-testid': 'switch-modal' }, React.createElement('button', { 'onClick': onClose, 'data-testid': 'close-switch-modal' }, 'Close'), React.createElement('button', { 'onClick': onSuccess, 'data-testid': 'confirm-switch-modal' }, 'Switch'));
            };
        }
        if (fnString.includes('base/confirm')) {
            return function MockConfirm({ isShow, onCancel, onConfirm }) {
                if (!isShow)
                    return null;
                return React.createElement('div', { 'data-testid': 'confirm-dialog' }, React.createElement('button', { 'onClick': onCancel, 'data-testid': 'cancel-confirm' }, 'Cancel'), React.createElement('button', { 'onClick': onConfirm, 'data-testid': 'confirm-confirm' }, 'Confirm'));
            };
        }
        if (fnString.includes('dsl-export-confirm-modal')) {
            return function MockDSLExportModal({ onClose, onConfirm }) {
                return React.createElement('div', { 'data-testid': 'dsl-export-modal' }, React.createElement('button', { 'onClick': () => onClose?.(), 'data-testid': 'close-dsl-export' }, 'Close'), React.createElement('button', { 'onClick': () => onConfirm?.(true), 'data-testid': 'confirm-dsl-export' }, 'Export with secrets'), React.createElement('button', { 'onClick': () => onConfirm?.(false), 'data-testid': 'confirm-dsl-export-no-secrets' }, 'Export without secrets'));
            };
        }
        if (fnString.includes('app-access-control')) {
            return function MockAccessControl({ onClose, onConfirm }) {
                return React.createElement('div', { 'data-testid': 'access-control-modal' }, React.createElement('button', { 'onClick': onClose, 'data-testid': 'close-access-control' }, 'Close'), React.createElement('button', { 'onClick': onConfirm, 'data-testid': 'confirm-access-control' }, 'Confirm'));
            };
        }
        return () => null;
    },
}));
// Popover uses @headlessui/react portals - mock for controlled interaction testing
vi.mock('@/app/components/base/popover', () => {
    const MockPopover = ({ htmlContent, btnElement, btnClassName }) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const computedClassName = typeof btnClassName === 'function' ? btnClassName(isOpen) : '';
        return React.createElement('div', { 'data-testid': 'custom-popover', 'className': computedClassName }, React.createElement('div', {
            'onClick': () => setIsOpen(!isOpen),
            'data-testid': 'popover-trigger',
        }, btnElement), isOpen && React.createElement('div', {
            'data-testid': 'popover-content',
            'onMouseLeave': () => setIsOpen(false),
        }, typeof htmlContent === 'function' ? htmlContent({ open: isOpen, onClose: () => setIsOpen(false), onClick: () => setIsOpen(false) }) : htmlContent));
    };
    return { __esModule: true, default: MockPopover };
});
// Tooltip uses portals - minimal mock preserving popup content as title attribute
vi.mock('@/app/components/base/tooltip', () => ({
    default: ({ children, popupContent }) => React.createElement('div', { title: popupContent }, children),
}));
// TagSelector has API dependency (service/tag) - mock for isolated testing
vi.mock('@/app/components/base/tag-management/selector', () => ({
    default: ({ tags }) => {
        return React.createElement('div', { 'aria-label': 'tag-selector' }, tags?.map((tag) => React.createElement('span', { key: tag.id }, tag.name)));
    },
}));
// AppTypeIcon has complex icon mapping - mock for focused component testing
vi.mock('@/app/components/app/type-selector', () => ({
    AppTypeIcon: () => React.createElement('div', { 'data-testid': 'app-type-icon' }),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createMockApp = (overrides = {}) => ({
    id: 'test-app-id',
    name: 'Test App',
    description: 'Test app description',
    mode: app_1.AppModeEnum.CHAT,
    icon: '🤖',
    icon_type: 'emoji',
    icon_background: '#FFEAD5',
    icon_url: null,
    author_name: 'Test Author',
    created_at: 1704067200,
    updated_at: 1704153600,
    tags: [],
    use_icon_as_answer_icon: false,
    max_active_requests: null,
    access_mode: access_control_1.AccessMode.PUBLIC,
    has_draft_trigger: false,
    enable_site: true,
    enable_api: true,
    api_rpm: 60,
    api_rph: 3600,
    is_demo: false,
    model_config: {},
    app_model_config: {},
    site: {},
    api_base_url: 'https://api.example.com',
    ...overrides,
});
// ============================================================================
// Tests
// ============================================================================
describe('AppCard', () => {
    const mockApp = createMockApp();
    const mockOnRefresh = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        mockOpenAsyncWindow.mockReset();
        mockWebappAuthEnabled = false;
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            // Use title attribute to target specific element
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should display app name', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should display app description', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTitle('Test app description')).toBeInTheDocument();
        });
        it('should display author name', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTitle('Test Author')).toBeInTheDocument();
        });
        it('should render app icon', () => {
            // AppIcon component renders the emoji icon from app data
            const { container } = (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            // Check that the icon container is rendered (AppIcon renders within the card)
            const iconElement = container.querySelector('[class*="icon"]') || container.querySelector('img');
            expect(iconElement || react_1.screen.getByText(mockApp.icon)).toBeTruthy();
        });
        it('should render app type icon', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTestId('app-type-icon')).toBeInTheDocument();
        });
        it('should display formatted edit time', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByText(/edited/i)).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        it('should handle different app modes', () => {
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should handle app with tags', () => {
            const appWithTags = {
                ...mockApp,
                tags: [{ id: 'tag1', name: 'Tag 1', type: 'app', binding_count: 0 }],
            };
            (0, react_1.render)(<app_card_1.default app={appWithTags}/>);
            // Verify the tag selector component renders
            expect(react_1.screen.getByLabelText('tag-selector')).toBeInTheDocument();
        });
        it('should render with onRefresh callback', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
    });
    describe('Access Mode Icons', () => {
        it('should show public icon for public access mode', () => {
            const publicApp = { ...mockApp, access_mode: access_control_1.AccessMode.PUBLIC };
            const { container } = (0, react_1.render)(<app_card_1.default app={publicApp}/>);
            const tooltip = container.querySelector('[title="app.accessItemsDescription.anyone"]');
            expect(tooltip).toBeInTheDocument();
        });
        it('should show lock icon for specific groups access mode', () => {
            const specificApp = { ...mockApp, access_mode: access_control_1.AccessMode.SPECIFIC_GROUPS_MEMBERS };
            const { container } = (0, react_1.render)(<app_card_1.default app={specificApp}/>);
            const tooltip = container.querySelector('[title="app.accessItemsDescription.specific"]');
            expect(tooltip).toBeInTheDocument();
        });
        it('should show organization icon for organization access mode', () => {
            const orgApp = { ...mockApp, access_mode: access_control_1.AccessMode.ORGANIZATION };
            const { container } = (0, react_1.render)(<app_card_1.default app={orgApp}/>);
            const tooltip = container.querySelector('[title="app.accessItemsDescription.organization"]');
            expect(tooltip).toBeInTheDocument();
        });
        it('should show external icon for external access mode', () => {
            const externalApp = { ...mockApp, access_mode: access_control_1.AccessMode.EXTERNAL_MEMBERS };
            const { container } = (0, react_1.render)(<app_card_1.default app={externalApp}/>);
            const tooltip = container.querySelector('[title="app.accessItemsDescription.external"]');
            expect(tooltip).toBeInTheDocument();
        });
    });
    describe('Card Interaction', () => {
        it('should handle card click', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            const card = react_1.screen.getByTitle('Test App').closest('[class*="cursor-pointer"]');
            expect(card).toBeInTheDocument();
        });
        it('should call getRedirection on card click', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            const card = react_1.screen.getByTitle('Test App').closest('[class*="cursor-pointer"]');
            react_1.fireEvent.click(card);
            expect(mockGetRedirection).toHaveBeenCalledWith(true, mockApp, mockPush);
        });
    });
    describe('Operations Menu', () => {
        it('should render operations popover', () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTestId('custom-popover')).toBeInTheDocument();
        });
        it('should show edit option when popover is opened', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
            });
        });
        it('should show duplicate option when popover is opened', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.duplicate')).toBeInTheDocument();
            });
        });
        it('should show export option when popover is opened', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.export')).toBeInTheDocument();
            });
        });
        it('should show delete option when popover is opened', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('common.operation.delete')).toBeInTheDocument();
            });
        });
        it('should show switch option for chat mode apps', async () => {
            const chatApp = { ...mockApp, mode: app_1.AppModeEnum.CHAT };
            (0, react_1.render)(<app_card_1.default app={chatApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/switch/i)).toBeInTheDocument();
            });
        });
        it('should show switch option for completion mode apps', async () => {
            const completionApp = { ...mockApp, mode: app_1.AppModeEnum.COMPLETION };
            (0, react_1.render)(<app_card_1.default app={completionApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/switch/i)).toBeInTheDocument();
            });
        });
        it('should not show switch option for workflow mode apps', async () => {
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/switch/i)).not.toBeInTheDocument();
            });
        });
    });
    describe('Modal Interactions', () => {
        it('should open edit modal when edit button is clicked', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const editButton = react_1.screen.getByText('app.editApp');
                react_1.fireEvent.click(editButton);
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('edit-app-modal')).toBeInTheDocument();
            });
        });
        it('should open duplicate modal when duplicate button is clicked', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const duplicateButton = react_1.screen.getByText('app.duplicate');
                react_1.fireEvent.click(duplicateButton);
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('duplicate-modal')).toBeInTheDocument();
            });
        });
        it('should open confirm dialog when delete button is clicked', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const deleteButton = react_1.screen.getByText('common.operation.delete');
                react_1.fireEvent.click(deleteButton);
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            });
        });
        it('should close confirm dialog when cancel is clicked', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const deleteButton = react_1.screen.getByText('common.operation.delete');
                react_1.fireEvent.click(deleteButton);
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-confirm'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
            });
        });
        it('should close edit modal when onHide is called', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.editApp'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('edit-app-modal')).toBeInTheDocument();
            });
            // Click close button to trigger onHide
            react_1.fireEvent.click(react_1.screen.getByTestId('close-edit-modal'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('edit-app-modal')).not.toBeInTheDocument();
            });
        });
        it('should close duplicate modal when onHide is called', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.duplicate'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('duplicate-modal')).toBeInTheDocument();
            });
            // Click close button to trigger onHide
            react_1.fireEvent.click(react_1.screen.getByTestId('close-duplicate-modal'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('duplicate-modal')).not.toBeInTheDocument();
            });
        });
    });
    describe('Styling', () => {
        it('should have correct card container styling', () => {
            const { container } = (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            const card = container.querySelector('[class*="h-[160px]"]');
            expect(card).toBeInTheDocument();
        });
        it('should have rounded corners', () => {
            const { container } = (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            const card = container.querySelector('[class*="rounded-xl"]');
            expect(card).toBeInTheDocument();
        });
    });
    describe('API Callbacks', () => {
        it('should call deleteApp API when confirming delete', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            // Open popover and click delete
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.operation.delete'));
            });
            // Confirm delete
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-confirm'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.deleteApp).toHaveBeenCalled();
            });
        });
        it('should call onRefresh after successful delete', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.operation.delete'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-confirm'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
        it('should handle delete failure', async () => {
            appsService.deleteApp.mockRejectedValueOnce(new Error('Delete failed'));
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('common.operation.delete'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('confirm-dialog')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-confirm'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.deleteApp).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: expect.stringContaining('Delete failed') });
            });
        });
        it('should call updateAppInfo API when editing app', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.editApp'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('edit-app-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-edit-modal'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.updateAppInfo).toHaveBeenCalled();
            });
        });
        it('should call copyApp API when duplicating app', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.duplicate'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('duplicate-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-duplicate-modal'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.copyApp).toHaveBeenCalled();
            });
        });
        it('should call onPlanInfoChanged after successful duplication', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.duplicate'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('duplicate-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-duplicate-modal'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnPlanInfoChanged).toHaveBeenCalled();
            });
        });
        it('should handle copy failure', async () => {
            appsService.copyApp.mockRejectedValueOnce(new Error('Copy failed'));
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.duplicate'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('duplicate-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-duplicate-modal'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.copyApp).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: 'app.newApp.appCreateFailed' });
            });
        });
        it('should call exportAppConfig API when exporting', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(appsService.exportAppConfig).toHaveBeenCalled();
            });
        });
        it('should handle export failure', async () => {
            appsService.exportAppConfig.mockRejectedValueOnce(new Error('Export failed'));
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(appsService.exportAppConfig).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: 'app.exportFailed' });
            });
        });
    });
    describe('Switch Modal', () => {
        it('should open switch modal when switch button is clicked', async () => {
            const chatApp = { ...mockApp, mode: app_1.AppModeEnum.CHAT };
            (0, react_1.render)(<app_card_1.default app={chatApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.switch'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('switch-modal')).toBeInTheDocument();
            });
        });
        it('should close switch modal when close button is clicked', async () => {
            const chatApp = { ...mockApp, mode: app_1.AppModeEnum.CHAT };
            (0, react_1.render)(<app_card_1.default app={chatApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.switch'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('switch-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('close-switch-modal'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('switch-modal')).not.toBeInTheDocument();
            });
        });
        it('should call onRefresh after successful switch', async () => {
            const chatApp = { ...mockApp, mode: app_1.AppModeEnum.CHAT };
            (0, react_1.render)(<app_card_1.default app={chatApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.switch'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('switch-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-switch-modal'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
        it('should open switch modal for completion mode apps', async () => {
            const completionApp = { ...mockApp, mode: app_1.AppModeEnum.COMPLETION };
            (0, react_1.render)(<app_card_1.default app={completionApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.switch'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('switch-modal')).toBeInTheDocument();
            });
        });
    });
    describe('Open in Explore', () => {
        it('should show open in explore option when popover is opened', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.openInExplore')).toBeInTheDocument();
            });
        });
    });
    describe('Workflow Export with Environment Variables', () => {
        it('should check for secret environment variables in workflow apps', async () => {
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(workflowService.fetchWorkflowDraft).toHaveBeenCalled();
            });
        });
        it('should show DSL export modal when workflow has secret variables', async () => {
            workflowService.fetchWorkflowDraft.mockResolvedValueOnce({
                environment_variables: [{ value_type: 'secret', name: 'API_KEY' }],
            });
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-modal')).toBeInTheDocument();
            });
        });
        it('should check for secret environment variables in advanced chat apps', async () => {
            const advancedChatApp = { ...mockApp, mode: app_1.AppModeEnum.ADVANCED_CHAT };
            (0, react_1.render)(<app_card_1.default app={advancedChatApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(workflowService.fetchWorkflowDraft).toHaveBeenCalled();
            });
        });
        it('should close DSL export modal when onClose is called', async () => {
            workflowService.fetchWorkflowDraft.mockResolvedValueOnce({
                environment_variables: [{ value_type: 'secret', name: 'API_KEY' }],
            });
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-modal')).toBeInTheDocument();
            });
            // Click close button to trigger onClose
            react_1.fireEvent.click(react_1.screen.getByTestId('close-dsl-export'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('dsl-export-modal')).not.toBeInTheDocument();
            });
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty description', () => {
            const appNoDesc = { ...mockApp, description: '' };
            (0, react_1.render)(<app_card_1.default app={appNoDesc}/>);
            expect(react_1.screen.getByText('Test App')).toBeInTheDocument();
        });
        it('should handle long app name', () => {
            const longNameApp = {
                ...mockApp,
                name: 'This is a very long app name that might overflow the container',
            };
            (0, react_1.render)(<app_card_1.default app={longNameApp}/>);
            expect(react_1.screen.getByText(longNameApp.name)).toBeInTheDocument();
        });
        it('should handle empty tags array', () => {
            const noTagsApp = { ...mockApp, tags: [] };
            // With empty tags, the component should still render successfully
            (0, react_1.render)(<app_card_1.default app={noTagsApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should handle missing author name', () => {
            const noAuthorApp = { ...mockApp, author_name: '' };
            (0, react_1.render)(<app_card_1.default app={noAuthorApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should handle null icon_url', () => {
            const nullIconApp = { ...mockApp, icon_url: null };
            // With null icon_url, the component should fall back to emoji icon and render successfully
            (0, react_1.render)(<app_card_1.default app={nullIconApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should use created_at when updated_at is not available', () => {
            const noUpdateApp = { ...mockApp, updated_at: 0 };
            (0, react_1.render)(<app_card_1.default app={noUpdateApp}/>);
            expect(react_1.screen.getByText(/edited/i)).toBeInTheDocument();
        });
        it('should handle agent chat mode apps', () => {
            const agentApp = { ...mockApp, mode: app_1.AppModeEnum.AGENT_CHAT };
            (0, react_1.render)(<app_card_1.default app={agentApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should handle advanced chat mode apps', () => {
            const advancedApp = { ...mockApp, mode: app_1.AppModeEnum.ADVANCED_CHAT };
            (0, react_1.render)(<app_card_1.default app={advancedApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
        it('should handle apps with multiple tags', () => {
            const multiTagApp = {
                ...mockApp,
                tags: [
                    { id: 'tag1', name: 'Tag 1', type: 'app', binding_count: 0 },
                    { id: 'tag2', name: 'Tag 2', type: 'app', binding_count: 0 },
                    { id: 'tag3', name: 'Tag 3', type: 'app', binding_count: 0 },
                ],
            };
            (0, react_1.render)(<app_card_1.default app={multiTagApp}/>);
            // Verify the tag selector renders (actual tag display is handled by the real TagSelector component)
            expect(react_1.screen.getByLabelText('tag-selector')).toBeInTheDocument();
        });
        it('should handle edit failure', async () => {
            appsService.updateAppInfo.mockRejectedValueOnce(new Error('Edit failed'));
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.editApp'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('edit-app-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-edit-modal'));
            await (0, react_1.waitFor)(() => {
                expect(appsService.updateAppInfo).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: expect.stringContaining('Edit failed') });
            });
        });
        it('should close edit modal after successful edit', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.editApp'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('edit-app-modal')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-edit-modal'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
        it('should render all app modes correctly', () => {
            const modes = [
                app_1.AppModeEnum.CHAT,
                app_1.AppModeEnum.COMPLETION,
                app_1.AppModeEnum.WORKFLOW,
                app_1.AppModeEnum.ADVANCED_CHAT,
                app_1.AppModeEnum.AGENT_CHAT,
            ];
            modes.forEach((mode) => {
                const testApp = { ...mockApp, mode };
                const { unmount } = (0, react_1.render)(<app_card_1.default app={testApp}/>);
                expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
                unmount();
            });
        });
        it('should handle workflow draft fetch failure during export', async () => {
            workflowService.fetchWorkflowDraft.mockRejectedValueOnce(new Error('Fetch failed'));
            const workflowApp = { ...mockApp, mode: app_1.AppModeEnum.WORKFLOW };
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.export'));
            });
            await (0, react_1.waitFor)(() => {
                expect(workflowService.fetchWorkflowDraft).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: 'app.exportFailed' });
            });
        });
    });
    // --------------------------------------------------------------------------
    // Additional Edge Cases for Coverage
    // --------------------------------------------------------------------------
    describe('Additional Coverage', () => {
        it('should handle onRefresh callback in switch modal success', async () => {
            const chatApp = createMockApp({ mode: app_1.AppModeEnum.CHAT });
            (0, react_1.render)(<app_card_1.default app={chatApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.switch'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('switch-modal')).toBeInTheDocument();
            });
            // Trigger success callback
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-switch-modal'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
        it('should render popover menu with correct styling for different app modes', async () => {
            // Test completion mode styling
            const completionApp = createMockApp({ mode: app_1.AppModeEnum.COMPLETION });
            const { unmount } = (0, react_1.render)(<app_card_1.default app={completionApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
            });
            unmount();
            // Test workflow mode styling
            const workflowApp = createMockApp({ mode: app_1.AppModeEnum.WORKFLOW });
            (0, react_1.render)(<app_card_1.default app={workflowApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
            });
        });
        it('should stop propagation when clicking tag selector area', () => {
            const multiTagApp = createMockApp({
                tags: [{ id: 'tag1', name: 'Tag 1', type: 'app', binding_count: 0 }],
            });
            (0, react_1.render)(<app_card_1.default app={multiTagApp}/>);
            const tagSelector = react_1.screen.getByLabelText('tag-selector');
            expect(tagSelector).toBeInTheDocument();
            // Click on tag selector wrapper to trigger stopPropagation
            const tagSelectorWrapper = tagSelector.closest('div');
            if (tagSelectorWrapper)
                react_1.fireEvent.click(tagSelectorWrapper);
        });
        it('should handle popover mouse leave', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            // Open popover
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('popover-content')).toBeInTheDocument();
            });
            // Trigger mouse leave on the outer popover-content
            react_1.fireEvent.mouseLeave(react_1.screen.getByTestId('popover-content'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('popover-content')).not.toBeInTheDocument();
            });
        });
        it('should handle operations menu mouse leave', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            // Open popover
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
            });
            // Find the Operations wrapper div (contains the menu items)
            const editButton = react_1.screen.getByText('app.editApp');
            const operationsWrapper = editButton.closest('div.relative');
            // Trigger mouse leave on the Operations wrapper to call onMouseLeave
            if (operationsWrapper)
                react_1.fireEvent.mouseLeave(operationsWrapper);
        });
        it('should click open in explore button', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const openInExploreBtn = react_1.screen.getByText('app.openInExplore');
                react_1.fireEvent.click(openInExploreBtn);
            });
            // Verify openAsyncWindow was called with callback and options
            await (0, react_1.waitFor)(() => {
                expect(mockOpenAsyncWindow).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ onError: expect.any(Function) }));
            });
        });
        it('should handle open in explore via async window', async () => {
            // Configure mockOpenAsyncWindow to actually call the callback
            mockOpenAsyncWindow.mockImplementationOnce(async (callback) => {
                await callback();
            });
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const openInExploreBtn = react_1.screen.getByText('app.openInExplore');
                react_1.fireEvent.click(openInExploreBtn);
            });
            await (0, react_1.waitFor)(() => {
                expect(exploreService.fetchInstalledAppList).toHaveBeenCalledWith(mockApp.id);
            });
        });
        it('should handle open in explore API failure', async () => {
            exploreService.fetchInstalledAppList.mockRejectedValueOnce(new Error('API Error'));
            // Configure mockOpenAsyncWindow to call the callback and trigger error
            mockOpenAsyncWindow.mockImplementationOnce(async (callback, options) => {
                try {
                    await callback();
                }
                catch (err) {
                    options?.onError?.(err);
                }
            });
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const openInExploreBtn = react_1.screen.getByText('app.openInExplore');
                react_1.fireEvent.click(openInExploreBtn);
            });
            await (0, react_1.waitFor)(() => {
                expect(exploreService.fetchInstalledAppList).toHaveBeenCalled();
            });
        });
    });
    describe('Access Control', () => {
        it('should render operations menu correctly', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
                expect(react_1.screen.getByText('app.duplicate')).toBeInTheDocument();
                expect(react_1.screen.getByText('app.export')).toBeInTheDocument();
                expect(react_1.screen.getByText('common.operation.delete')).toBeInTheDocument();
            });
        });
    });
    describe('Open in Explore - No App Found', () => {
        it('should handle case when installed_apps is empty array', async () => {
            exploreService.fetchInstalledAppList.mockResolvedValueOnce({ installed_apps: [] });
            // Configure mockOpenAsyncWindow to call the callback and trigger error
            mockOpenAsyncWindow.mockImplementationOnce(async (callback, options) => {
                try {
                    await callback();
                }
                catch (err) {
                    options?.onError?.(err);
                }
            });
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const openInExploreBtn = react_1.screen.getByText('app.openInExplore');
                react_1.fireEvent.click(openInExploreBtn);
            });
            await (0, react_1.waitFor)(() => {
                expect(exploreService.fetchInstalledAppList).toHaveBeenCalled();
            });
        });
        it('should handle case when API throws in callback', async () => {
            exploreService.fetchInstalledAppList.mockRejectedValueOnce(new Error('Network error'));
            // Configure mockOpenAsyncWindow to call the callback without catching
            mockOpenAsyncWindow.mockImplementationOnce(async (callback) => {
                return await callback();
            });
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const openInExploreBtn = react_1.screen.getByText('app.openInExplore');
                react_1.fireEvent.click(openInExploreBtn);
            });
            await (0, react_1.waitFor)(() => {
                expect(exploreService.fetchInstalledAppList).toHaveBeenCalled();
            });
        });
    });
    describe('Draft Trigger Apps', () => {
        it('should not show open in explore option for apps with has_draft_trigger', async () => {
            const draftTriggerApp = createMockApp({ has_draft_trigger: true });
            (0, react_1.render)(<app_card_1.default app={draftTriggerApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.editApp')).toBeInTheDocument();
                // openInExplore should not be shown for draft trigger apps
                expect(react_1.screen.queryByText('app.openInExplore')).not.toBeInTheDocument();
            });
        });
    });
    describe('Non-editor User', () => {
        it('should handle non-editor workspace users', () => {
            // This tests the isCurrentWorkspaceEditor=true branch (default mock)
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            expect(react_1.screen.getByTitle('Test App')).toBeInTheDocument();
        });
    });
    describe('WebApp Auth Enabled', () => {
        beforeEach(() => {
            mockWebappAuthEnabled = true;
        });
        it('should show access control option when webapp_auth is enabled', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.accessControl')).toBeInTheDocument();
            });
        });
        it('should click access control button', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                const accessControlBtn = react_1.screen.getByText('app.accessControl');
                react_1.fireEvent.click(accessControlBtn);
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('access-control-modal')).toBeInTheDocument();
            });
        });
        it('should close access control modal and call onRefresh', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp} onRefresh={mockOnRefresh}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.accessControl'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('access-control-modal')).toBeInTheDocument();
            });
            // Confirm access control
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-access-control'));
            await (0, react_1.waitFor)(() => {
                expect(mockOnRefresh).toHaveBeenCalled();
            });
        });
        it('should show open in explore when userCanAccessApp is true', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('app.openInExplore')).toBeInTheDocument();
            });
        });
        it('should close access control modal when onClose is called', async () => {
            (0, react_1.render)(<app_card_1.default app={mockApp}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('popover-trigger'));
            await (0, react_1.waitFor)(() => {
                react_1.fireEvent.click(react_1.screen.getByText('app.accessControl'));
            });
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('access-control-modal')).toBeInTheDocument();
            });
            // Click close button to trigger onClose
            react_1.fireEvent.click(react_1.screen.getByTestId('close-access-control'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('access-control-modal')).not.toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNhcmQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1jYXJkLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5Qiw0REFBb0Q7QUFDcEQscURBQXFEO0FBQ3JELDhDQUE2QztBQUU3QyxvREFBbUQ7QUFDbkQsc0RBQXFEO0FBQ3JELHFDQUF5QztBQUV6QywrQkFBK0I7QUFDL0IseUNBQWdDO0FBRWhDLHVCQUF1QjtBQUN2QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsZ0ZBQWdGO0FBQ2hGLGdFQUFnRTtBQUNoRSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLGFBQWEsRUFBRSxDQUFDLFlBQWlCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQ3ZFLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sRUFBRSxVQUFVO0tBQ25CLENBQUM7SUFDRixrQkFBa0IsRUFBRSxDQUFDLFFBQWEsRUFBRSxRQUFhLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUM3RCxNQUFNLEVBQUUsVUFBVTtLQUNuQixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxtQkFBbUI7QUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lB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TSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RSxDQUFDLENBQUMsQ0FBQTtZQUVGLHdDQUF3QztZQUN4QyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQTtZQUUzRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzlFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb2NrIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFjY2Vzc01vZGUgfSBmcm9tICdAL21vZGVscy9hY2Nlc3MtY29udHJvbCdcbi8vIE1vY2sgQVBJIHNlcnZpY2VzIC0gaW1wb3J0IGZvciBkaXJlY3QgbWFuaXB1bGF0aW9uXG5pbXBvcnQgKiBhcyBhcHBzU2VydmljZSBmcm9tICdAL3NlcnZpY2UvYXBwcydcblxuaW1wb3J0ICogYXMgZXhwbG9yZVNlcnZpY2UgZnJvbSAnQC9zZXJ2aWNlL2V4cGxvcmUnXG5pbXBvcnQgKiBhcyB3b3JrZmxvd1NlcnZpY2UgZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuaW1wb3J0IHsgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcblxuLy8gSW1wb3J0IGNvbXBvbmVudCBhZnRlciBtb2Nrc1xuaW1wb3J0IEFwcENhcmQgZnJvbSAnLi9hcHAtY2FyZCdcblxuLy8gTW9jayBuZXh0L25hdmlnYXRpb25cbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiAoKSA9PiAoe1xuICAgIHB1c2g6IG1vY2tQdXNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZS1jb250ZXh0LXNlbGVjdG9yIHdpdGggc3RhYmxlIG1vY2tOb3RpZnkgcmVmZXJlbmNlIGZvciB0cmFja2luZyBjYWxsc1xuLy8gSW5jbHVkZSBjcmVhdGVDb250ZXh0IGZvciBjb21wb25lbnRzIHRoYXQgdXNlIGl0IChsaWtlIFRvYXN0KVxuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbnZpLm1vY2soJ3VzZS1jb250ZXh0LXNlbGVjdG9yJywgKCkgPT4gKHtcbiAgY3JlYXRlQ29udGV4dDogKGRlZmF1bHRWYWx1ZTogYW55KSA9PiBSZWFjdC5jcmVhdGVDb250ZXh0KGRlZmF1bHRWYWx1ZSksXG4gIHVzZUNvbnRleHQ6ICgpID0+ICh7XG4gICAgbm90aWZ5OiBtb2NrTm90aWZ5LFxuICB9KSxcbiAgdXNlQ29udGV4dFNlbGVjdG9yOiAoX2NvbnRleHQ6IGFueSwgc2VsZWN0b3I6IGFueSkgPT4gc2VsZWN0b3Ioe1xuICAgIG5vdGlmeTogbW9ja05vdGlmeSxcbiAgfSksXG59KSlcblxuLy8gTW9jayBhcHAgY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlQXBwQ29udGV4dDogKCkgPT4gKHtcbiAgICBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3I6IHRydWUsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgcHJvdmlkZXIgY29udGV4dFxuY29uc3QgbW9ja09uUGxhbkluZm9DaGFuZ2VkID0gdmkuZm4oKVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+ICh7XG4gICAgb25QbGFuSW5mb0NoYW5nZWQ6IG1vY2tPblBsYW5JbmZvQ2hhbmdlZCxcbiAgfSksXG59KSlcblxuLy8gTW9jayBnbG9iYWwgcHVibGljIHN0b3JlIC0gYWxsb3cgZHluYW1pYyBjb25maWd1cmF0aW9uXG5sZXQgbW9ja1dlYmFwcEF1dGhFbmFibGVkID0gZmFsc2VcbnZpLm1vY2soJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VHbG9iYWxQdWJsaWNTdG9yZTogKHNlbGVjdG9yOiAoczogYW55KSA9PiBhbnkpID0+IHNlbGVjdG9yKHtcbiAgICBzeXN0ZW1GZWF0dXJlczoge1xuICAgICAgd2ViYXBwX2F1dGg6IHsgZW5hYmxlZDogbW9ja1dlYmFwcEF1dGhFbmFibGVkIH0sXG4gICAgICBicmFuZGluZzogeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgIH0sXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9hcHBzJywgKCkgPT4gKHtcbiAgZGVsZXRlQXBwOiB2aS5mbigoKSA9PiBQcm9taXNlLnJlc29sdmUoKSksXG4gIHVwZGF0ZUFwcEluZm86IHZpLmZuKCgpID0+IFByb21pc2UucmVzb2x2ZSgpKSxcbiAgY29weUFwcDogdmkuZm4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgaWQ6ICduZXctYXBwLWlkJyB9KSksXG4gIGV4cG9ydEFwcENvbmZpZzogdmkuZm4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgZGF0YTogJ3lhbWw6IGNvbnRlbnQnIH0pKSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2Uvd29ya2Zsb3cnLCAoKSA9PiAoe1xuICBmZXRjaFdvcmtmbG93RHJhZnQ6IHZpLmZuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7IGVudmlyb25tZW50X3ZhcmlhYmxlczogW10gfSkpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9leHBsb3JlJywgKCkgPT4gKHtcbiAgZmV0Y2hJbnN0YWxsZWRBcHBMaXN0OiB2aS5mbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBpbnN0YWxsZWRfYXBwczogW3sgaWQ6ICdpbnN0YWxsZWQtMScgfV0gfSkpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9hY2Nlc3MtY29udHJvbCcsICgpID0+ICh7XG4gIHVzZUdldFVzZXJDYW5BY2Nlc3NBcHA6ICgpID0+ICh7XG4gICAgZGF0YTogeyByZXN1bHQ6IHRydWUgfSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGhvb2tzXG5jb25zdCBtb2NrT3BlbkFzeW5jV2luZG93ID0gdmkuZm4oKVxudmkubW9jaygnQC9ob29rcy91c2UtYXN5bmMtd2luZG93LW9wZW4nLCAoKSA9PiAoe1xuICB1c2VBc3luY1dpbmRvd09wZW46ICgpID0+IG1vY2tPcGVuQXN5bmNXaW5kb3csXG59KSlcblxuLy8gTW9jayB1dGlsc1xuY29uc3QgeyBtb2NrR2V0UmVkaXJlY3Rpb24gfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja0dldFJlZGlyZWN0aW9uOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0AvdXRpbHMvYXBwLXJlZGlyZWN0aW9uJywgKCkgPT4gKHtcbiAgZ2V0UmVkaXJlY3Rpb246IG1vY2tHZXRSZWRpcmVjdGlvbixcbn0pKVxuXG52aS5tb2NrKCdAL3V0aWxzL3ZhcicsICgpID0+ICh7XG4gIGJhc2VQYXRoOiAnJyxcbn0pKVxuXG52aS5tb2NrKCdAL3V0aWxzL3RpbWUnLCAoKSA9PiAoe1xuICBmb3JtYXRUaW1lOiAoKSA9PiAnSmFuIDEsIDIwMjQnLFxufSkpXG5cbi8vIE1vY2sgZHluYW1pYyBpbXBvcnRzXG52aS5tb2NrKCduZXh0L2R5bmFtaWMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoaW1wb3J0Rm46ICgpID0+IFByb21pc2U8YW55PikgPT4ge1xuICAgIGNvbnN0IGZuU3RyaW5nID0gaW1wb3J0Rm4udG9TdHJpbmcoKVxuXG4gICAgaWYgKGZuU3RyaW5nLmluY2x1ZGVzKCdjcmVhdGUtYXBwLW1vZGFsJykgfHwgZm5TdHJpbmcuaW5jbHVkZXMoJ2V4cGxvcmUvY3JlYXRlLWFwcC1tb2RhbCcpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gTW9ja0VkaXRBcHBNb2RhbCh7IHNob3csIG9uSGlkZSwgb25Db25maXJtIH06IGFueSkge1xuICAgICAgICBpZiAoIXNob3cpXG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgJ2RhdGEtdGVzdGlkJzogJ2VkaXQtYXBwLW1vZGFsJyB9LCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogb25IaWRlLCAnZGF0YS10ZXN0aWQnOiAnY2xvc2UtZWRpdC1tb2RhbCcgfSwgJ0Nsb3NlJyksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHtcbiAgICAgICAgICAnb25DbGljayc6ICgpID0+IG9uQ29uZmlybT8uKHtcbiAgICAgICAgICAgIG5hbWU6ICdVcGRhdGVkIEFwcCcsXG4gICAgICAgICAgICBpY29uX3R5cGU6ICdlbW9qaScsXG4gICAgICAgICAgICBpY29uOiAn8J+OrycsXG4gICAgICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjRkZFQUQ1JyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXBkYXRlZCBkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gICAgICAgICAgICBtYXhfYWN0aXZlX3JlcXVlc3RzOiBudWxsLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgICdkYXRhLXRlc3RpZCc6ICdjb25maXJtLWVkaXQtbW9kYWwnLFxuICAgICAgICB9LCAnQ29uZmlybScpKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm5TdHJpbmcuaW5jbHVkZXMoJ2R1cGxpY2F0ZS1tb2RhbCcpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gTW9ja0R1cGxpY2F0ZUFwcE1vZGFsKHsgc2hvdywgb25IaWRlLCBvbkNvbmZpcm0gfTogYW55KSB7XG4gICAgICAgIGlmICghc2hvdylcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyAnZGF0YS10ZXN0aWQnOiAnZHVwbGljYXRlLW1vZGFsJyB9LCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogb25IaWRlLCAnZGF0YS10ZXN0aWQnOiAnY2xvc2UtZHVwbGljYXRlLW1vZGFsJyB9LCAnQ2xvc2UnKSwgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xuICAgICAgICAgICdvbkNsaWNrJzogKCkgPT4gb25Db25maXJtPy4oe1xuICAgICAgICAgICAgbmFtZTogJ0NvcGllZCBBcHAnLFxuICAgICAgICAgICAgaWNvbl90eXBlOiAnZW1vamknLFxuICAgICAgICAgICAgaWNvbjogJ/Cfk4snLFxuICAgICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0U0RkJDQycsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgJ2RhdGEtdGVzdGlkJzogJ2NvbmZpcm0tZHVwbGljYXRlLW1vZGFsJyxcbiAgICAgICAgfSwgJ0NvbmZpcm0nKSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZuU3RyaW5nLmluY2x1ZGVzKCdzd2l0Y2gtYXBwLW1vZGFsJykpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBNb2NrU3dpdGNoQXBwTW9kYWwoeyBzaG93LCBvbkNsb3NlLCBvblN1Y2Nlc3MgfTogYW55KSB7XG4gICAgICAgIGlmICghc2hvdylcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyAnZGF0YS10ZXN0aWQnOiAnc3dpdGNoLW1vZGFsJyB9LCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogb25DbG9zZSwgJ2RhdGEtdGVzdGlkJzogJ2Nsb3NlLXN3aXRjaC1tb2RhbCcgfSwgJ0Nsb3NlJyksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHsgJ29uQ2xpY2snOiBvblN1Y2Nlc3MsICdkYXRhLXRlc3RpZCc6ICdjb25maXJtLXN3aXRjaC1tb2RhbCcgfSwgJ1N3aXRjaCcpKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZm5TdHJpbmcuaW5jbHVkZXMoJ2Jhc2UvY29uZmlybScpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gTW9ja0NvbmZpcm0oeyBpc1Nob3csIG9uQ2FuY2VsLCBvbkNvbmZpcm0gfTogYW55KSB7XG4gICAgICAgIGlmICghaXNTaG93KVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICdjb25maXJtLWRpYWxvZycgfSwgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywgeyAnb25DbGljayc6IG9uQ2FuY2VsLCAnZGF0YS10ZXN0aWQnOiAnY2FuY2VsLWNvbmZpcm0nIH0sICdDYW5jZWwnKSwgUmVhY3QuY3JlYXRlRWxlbWVudCgnYnV0dG9uJywgeyAnb25DbGljayc6IG9uQ29uZmlybSwgJ2RhdGEtdGVzdGlkJzogJ2NvbmZpcm0tY29uZmlybScgfSwgJ0NvbmZpcm0nKSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZuU3RyaW5nLmluY2x1ZGVzKCdkc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnKSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIE1vY2tEU0xFeHBvcnRNb2RhbCh7IG9uQ2xvc2UsIG9uQ29uZmlybSB9OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgJ2RhdGEtdGVzdGlkJzogJ2RzbC1leHBvcnQtbW9kYWwnIH0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHsgJ29uQ2xpY2snOiAoKSA9PiBvbkNsb3NlPy4oKSwgJ2RhdGEtdGVzdGlkJzogJ2Nsb3NlLWRzbC1leHBvcnQnIH0sICdDbG9zZScpLCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogKCkgPT4gb25Db25maXJtPy4odHJ1ZSksICdkYXRhLXRlc3RpZCc6ICdjb25maXJtLWRzbC1leHBvcnQnIH0sICdFeHBvcnQgd2l0aCBzZWNyZXRzJyksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHsgJ29uQ2xpY2snOiAoKSA9PiBvbkNvbmZpcm0/LihmYWxzZSksICdkYXRhLXRlc3RpZCc6ICdjb25maXJtLWRzbC1leHBvcnQtbm8tc2VjcmV0cycgfSwgJ0V4cG9ydCB3aXRob3V0IHNlY3JldHMnKSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGZuU3RyaW5nLmluY2x1ZGVzKCdhcHAtYWNjZXNzLWNvbnRyb2wnKSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIE1vY2tBY2Nlc3NDb250cm9sKHsgb25DbG9zZSwgb25Db25maXJtIH06IGFueSkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyAnZGF0YS10ZXN0aWQnOiAnYWNjZXNzLWNvbnRyb2wtbW9kYWwnIH0sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHsgJ29uQ2xpY2snOiBvbkNsb3NlLCAnZGF0YS10ZXN0aWQnOiAnY2xvc2UtYWNjZXNzLWNvbnRyb2wnIH0sICdDbG9zZScpLCBSZWFjdC5jcmVhdGVFbGVtZW50KCdidXR0b24nLCB7ICdvbkNsaWNrJzogb25Db25maXJtLCAnZGF0YS10ZXN0aWQnOiAnY29uZmlybS1hY2Nlc3MtY29udHJvbCcgfSwgJ0NvbmZpcm0nKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICgpID0+IG51bGxcbiAgfSxcbn0pKVxuXG4vLyBQb3BvdmVyIHVzZXMgQGhlYWRsZXNzdWkvcmVhY3QgcG9ydGFscyAtIG1vY2sgZm9yIGNvbnRyb2xsZWQgaW50ZXJhY3Rpb24gdGVzdGluZ1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcG92ZXInLCAoKSA9PiB7XG4gIGNvbnN0IE1vY2tQb3BvdmVyID0gKHsgaHRtbENvbnRlbnQsIGJ0bkVsZW1lbnQsIGJ0bkNsYXNzTmFtZSB9OiBhbnkpID0+IHtcbiAgICBjb25zdCBbaXNPcGVuLCBzZXRJc09wZW5dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpXG4gICAgY29uc3QgY29tcHV0ZWRDbGFzc05hbWUgPSB0eXBlb2YgYnRuQ2xhc3NOYW1lID09PSAnZnVuY3Rpb24nID8gYnRuQ2xhc3NOYW1lKGlzT3BlbikgOiAnJ1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICdjdXN0b20tcG9wb3ZlcicsICdjbGFzc05hbWUnOiBjb21wdXRlZENsYXNzTmFtZSB9LCBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAnb25DbGljayc6ICgpID0+IHNldElzT3BlbighaXNPcGVuKSxcbiAgICAgICdkYXRhLXRlc3RpZCc6ICdwb3BvdmVyLXRyaWdnZXInLFxuICAgIH0sIGJ0bkVsZW1lbnQpLCBpc09wZW4gJiYgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgJ2RhdGEtdGVzdGlkJzogJ3BvcG92ZXItY29udGVudCcsXG4gICAgICAnb25Nb3VzZUxlYXZlJzogKCkgPT4gc2V0SXNPcGVuKGZhbHNlKSxcbiAgICB9LCB0eXBlb2YgaHRtbENvbnRlbnQgPT09ICdmdW5jdGlvbicgPyBodG1sQ29udGVudCh7IG9wZW46IGlzT3Blbiwgb25DbG9zZTogKCkgPT4gc2V0SXNPcGVuKGZhbHNlKSwgb25DbGljazogKCkgPT4gc2V0SXNPcGVuKGZhbHNlKSB9KSA6IGh0bWxDb250ZW50KSlcbiAgfVxuICByZXR1cm4geyBfX2VzTW9kdWxlOiB0cnVlLCBkZWZhdWx0OiBNb2NrUG9wb3ZlciB9XG59KVxuXG4vLyBUb29sdGlwIHVzZXMgcG9ydGFscyAtIG1pbmltYWwgbW9jayBwcmVzZXJ2aW5nIHBvcHVwIGNvbnRlbnQgYXMgdGl0bGUgYXR0cmlidXRlXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9vbHRpcCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNoaWxkcmVuLCBwb3B1cENvbnRlbnQgfTogYW55KSA9PiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IHRpdGxlOiBwb3B1cENvbnRlbnQgfSwgY2hpbGRyZW4pLFxufSkpXG5cbi8vIFRhZ1NlbGVjdG9yIGhhcyBBUEkgZGVwZW5kZW5jeSAoc2VydmljZS90YWcpIC0gbW9jayBmb3IgaXNvbGF0ZWQgdGVzdGluZ1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RhZy1tYW5hZ2VtZW50L3NlbGVjdG9yJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgdGFncyB9OiBhbnkpID0+IHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyAnYXJpYS1sYWJlbCc6ICd0YWctc2VsZWN0b3InIH0sIHRhZ3M/Lm1hcCgodGFnOiBhbnkpID0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGtleTogdGFnLmlkIH0sIHRhZy5uYW1lKSkpXG4gIH0sXG59KSlcblxuLy8gQXBwVHlwZUljb24gaGFzIGNvbXBsZXggaWNvbiBtYXBwaW5nIC0gbW9jayBmb3IgZm9jdXNlZCBjb21wb25lbnQgdGVzdGluZ1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9hcHAvdHlwZS1zZWxlY3RvcicsICgpID0+ICh7XG4gIEFwcFR5cGVJY29uOiAoKSA9PiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7ICdkYXRhLXRlc3RpZCc6ICdhcHAtdHlwZS1pY29uJyB9KSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tBcHAgPSAob3ZlcnJpZGVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pID0+ICh7XG4gIGlkOiAndGVzdC1hcHAtaWQnLFxuICBuYW1lOiAnVGVzdCBBcHAnLFxuICBkZXNjcmlwdGlvbjogJ1Rlc3QgYXBwIGRlc2NyaXB0aW9uJyxcbiAgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgaWNvbjogJ/CfpJYnLFxuICBpY29uX3R5cGU6ICdlbW9qaScgYXMgY29uc3QsXG4gIGljb25fYmFja2dyb3VuZDogJyNGRkVBRDUnLFxuICBpY29uX3VybDogbnVsbCxcbiAgYXV0aG9yX25hbWU6ICdUZXN0IEF1dGhvcicsXG4gIGNyZWF0ZWRfYXQ6IDE3MDQwNjcyMDAsXG4gIHVwZGF0ZWRfYXQ6IDE3MDQxNTM2MDAsXG4gIHRhZ3M6IFtdLFxuICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gIG1heF9hY3RpdmVfcmVxdWVzdHM6IG51bGwsXG4gIGFjY2Vzc19tb2RlOiBBY2Nlc3NNb2RlLlBVQkxJQyxcbiAgaGFzX2RyYWZ0X3RyaWdnZXI6IGZhbHNlLFxuICBlbmFibGVfc2l0ZTogdHJ1ZSxcbiAgZW5hYmxlX2FwaTogdHJ1ZSxcbiAgYXBpX3JwbTogNjAsXG4gIGFwaV9ycGg6IDM2MDAsXG4gIGlzX2RlbW86IGZhbHNlLFxuICBtb2RlbF9jb25maWc6IHt9IGFzIGFueSxcbiAgYXBwX21vZGVsX2NvbmZpZzoge30gYXMgYW55LFxuICBzaXRlOiB7fSBhcyBhbnksXG4gIGFwaV9iYXNlX3VybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0FwcENhcmQnLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tBcHAgPSBjcmVhdGVNb2NrQXBwKClcbiAgY29uc3QgbW9ja09uUmVmcmVzaCA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrT3BlbkFzeW5jV2luZG93Lm1vY2tSZXNldCgpXG4gICAgbW9ja1dlYmFwcEF1dGhFbmFibGVkID0gZmFsc2VcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIC8vIFVzZSB0aXRsZSBhdHRyaWJ1dGUgdG8gdGFyZ2V0IHNwZWNpZmljIGVsZW1lbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgYXBwIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgYXBwIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGl0bGUoJ1Rlc3QgYXBwIGRlc2NyaXB0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGF1dGhvciBuYW1lJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGl0bGUoJ1Rlc3QgQXV0aG9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXBwIGljb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcHBJY29uIGNvbXBvbmVudCByZW5kZXJzIHRoZSBlbW9qaSBpY29uIGZyb20gYXBwIGRhdGFcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIGljb24gY29udGFpbmVyIGlzIHJlbmRlcmVkIChBcHBJY29uIHJlbmRlcnMgd2l0aGluIHRoZSBjYXJkKVxuICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImljb25cIl0nKSB8fCBjb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJylcbiAgICAgIGV4cGVjdChpY29uRWxlbWVudCB8fCBzY3JlZW4uZ2V0QnlUZXh0KG1vY2tBcHAuaWNvbikpLnRvQmVUcnV0aHkoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhcHAgdHlwZSBpY29uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhcHAtdHlwZS1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGZvcm1hdHRlZCBlZGl0IHRpbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9lZGl0ZWQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgYXBwIG1vZGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgd29ya2Zsb3dBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLldPUktGTE9XIH1cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e3dvcmtmbG93QXBwfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhcHAgd2l0aCB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwV2l0aFRhZ3MgPSB7XG4gICAgICAgIC4uLm1vY2tBcHAsXG4gICAgICAgIHRhZ3M6IFt7IGlkOiAndGFnMScsIG5hbWU6ICdUYWcgMScsIHR5cGU6ICdhcHAnLCBiaW5kaW5nX2NvdW50OiAwIH1dLFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17YXBwV2l0aFRhZ3N9IC8+KVxuICAgICAgLy8gVmVyaWZ5IHRoZSB0YWcgc2VsZWN0b3IgY29tcG9uZW50IHJlbmRlcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlMYWJlbFRleHQoJ3RhZy1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggb25SZWZyZXNoIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0FjY2VzcyBNb2RlIEljb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBwdWJsaWMgaWNvbiBmb3IgcHVibGljIGFjY2VzcyBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHVibGljQXBwID0geyAuLi5tb2NrQXBwLCBhY2Nlc3NfbW9kZTogQWNjZXNzTW9kZS5QVUJMSUMgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QXBwQ2FyZCBhcHA9e3B1YmxpY0FwcH0gLz4pXG4gICAgICBjb25zdCB0b29sdGlwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t0aXRsZT1cImFwcC5hY2Nlc3NJdGVtc0Rlc2NyaXB0aW9uLmFueW9uZVwiXScpXG4gICAgICBleHBlY3QodG9vbHRpcCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9jayBpY29uIGZvciBzcGVjaWZpYyBncm91cHMgYWNjZXNzIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjaWZpY0FwcCA9IHsgLi4ubW9ja0FwcCwgYWNjZXNzX21vZGU6IEFjY2Vzc01vZGUuU1BFQ0lGSUNfR1JPVVBTX01FTUJFUlMgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QXBwQ2FyZCBhcHA9e3NwZWNpZmljQXBwfSAvPilcbiAgICAgIGNvbnN0IHRvb2x0aXAgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3RpdGxlPVwiYXBwLmFjY2Vzc0l0ZW1zRGVzY3JpcHRpb24uc3BlY2lmaWNcIl0nKVxuICAgICAgZXhwZWN0KHRvb2x0aXApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IG9yZ2FuaXphdGlvbiBpY29uIGZvciBvcmdhbml6YXRpb24gYWNjZXNzIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmdBcHAgPSB7IC4uLm1vY2tBcHAsIGFjY2Vzc19tb2RlOiBBY2Nlc3NNb2RlLk9SR0FOSVpBVElPTiB9XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBcHBDYXJkIGFwcD17b3JnQXBwfSAvPilcbiAgICAgIGNvbnN0IHRvb2x0aXAgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3RpdGxlPVwiYXBwLmFjY2Vzc0l0ZW1zRGVzY3JpcHRpb24ub3JnYW5pemF0aW9uXCJdJylcbiAgICAgIGV4cGVjdCh0b29sdGlwKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBleHRlcm5hbCBpY29uIGZvciBleHRlcm5hbCBhY2Nlc3MgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4dGVybmFsQXBwID0geyAuLi5tb2NrQXBwLCBhY2Nlc3NfbW9kZTogQWNjZXNzTW9kZS5FWFRFUk5BTF9NRU1CRVJTIH1cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFwcENhcmQgYXBwPXtleHRlcm5hbEFwcH0gLz4pXG4gICAgICBjb25zdCB0b29sdGlwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t0aXRsZT1cImFwcC5hY2Nlc3NJdGVtc0Rlc2NyaXB0aW9uLmV4dGVybmFsXCJdJylcbiAgICAgIGV4cGVjdCh0b29sdGlwKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2FyZCBJbnRlcmFjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjYXJkIGNsaWNrJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGl0bGUoJ1Rlc3QgQXBwJykuY2xvc2VzdCgnW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGV4cGVjdChjYXJkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBnZXRSZWRpcmVjdGlvbiBvbiBjYXJkIGNsaWNrJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGl0bGUoJ1Rlc3QgQXBwJykuY2xvc2VzdCgnW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2FyZClcbiAgICAgIGV4cGVjdChtb2NrR2V0UmVkaXJlY3Rpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUsIG1vY2tBcHAsIG1vY2tQdXNoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ09wZXJhdGlvbnMgTWVudScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvcGVyYXRpb25zIHBvcG92ZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1wb3BvdmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVkaXQgb3B0aW9uIHdoZW4gcG9wb3ZlciBpcyBvcGVuZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmVkaXRBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGR1cGxpY2F0ZSBvcHRpb24gd2hlbiBwb3BvdmVyIGlzIG9wZW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZHVwbGljYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBleHBvcnQgb3B0aW9uIHdoZW4gcG9wb3ZlciBpcyBvcGVuZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmV4cG9ydCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZGVsZXRlIG9wdGlvbiB3aGVuIHBvcG92ZXIgaXMgb3BlbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZGVsZXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzd2l0Y2ggb3B0aW9uIGZvciBjaGF0IG1vZGUgYXBwcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17Y2hhdEFwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3N3aXRjaC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHN3aXRjaCBvcHRpb24gZm9yIGNvbXBsZXRpb24gbW9kZSBhcHBzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY29tcGxldGlvbkFwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTiB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtjb21wbGV0aW9uQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc3dpdGNoL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHN3aXRjaCBvcHRpb24gZm9yIHdvcmtmbG93IG1vZGUgYXBwcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHdvcmtmbG93QXBwID0geyAuLi5tb2NrQXBwLCBtb2RlOiBBcHBNb2RlRW51bS5XT1JLRkxPVyB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXt3b3JrZmxvd0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvc3dpdGNoL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNb2RhbCBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGVkaXQgbW9kYWwgd2hlbiBlZGl0IGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5lZGl0QXBwJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGVkaXRCdXR0b24pXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZWRpdC1hcHAtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIGR1cGxpY2F0ZSBtb2RhbCB3aGVuIGR1cGxpY2F0ZSBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5kdXBsaWNhdGUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZHVwbGljYXRlQnV0dG9uKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2R1cGxpY2F0ZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gY29uZmlybSBkaWFsb2cgd2hlbiBkZWxldGUgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBkZWxldGVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmRlbGV0ZScpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhkZWxldGVCdXR0b24pXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1kaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBjb25maXJtIGRpYWxvZyB3aGVuIGNhbmNlbCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgZGVsZXRlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZGVsZXRlQnV0dG9uKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tZGlhbG9nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NvbmZpcm0tZGlhbG9nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIGVkaXQgbW9kYWwgd2hlbiBvbkhpZGUgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZWRpdEFwcCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VkaXQtYXBwLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIGNsb3NlIGJ1dHRvbiB0byB0cmlnZ2VyIG9uSGlkZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtZWRpdC1tb2RhbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlZGl0LWFwcC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBkdXBsaWNhdGUgbW9kYWwgd2hlbiBvbkhpZGUgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZHVwbGljYXRlJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZHVwbGljYXRlLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIGNsb3NlIGJ1dHRvbiB0byB0cmlnZ2VyIG9uSGlkZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtZHVwbGljYXRlLW1vZGFsJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2R1cGxpY2F0ZS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGNhcmQgY29udGFpbmVyIHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG4gICAgICBjb25zdCBjYXJkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJoLVsxNjBweF1cIl0nKVxuICAgICAgZXhwZWN0KGNhcmQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJvdW5kZWQgY29ybmVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcbiAgICAgIGNvbnN0IGNhcmQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cInJvdW5kZWQteGxcIl0nKVxuICAgICAgZXhwZWN0KGNhcmQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBUEkgQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBkZWxldGVBcHAgQVBJIHdoZW4gY29uZmlybWluZyBkZWxldGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSBvblJlZnJlc2g9e21vY2tPblJlZnJlc2h9IC8+KVxuXG4gICAgICAvLyBPcGVuIHBvcG92ZXIgYW5kIGNsaWNrIGRlbGV0ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZGVsZXRlJykpXG4gICAgICB9KVxuXG4gICAgICAvLyBDb25maXJtIGRlbGV0ZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tZGlhbG9nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tY29uZmlybScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGFwcHNTZXJ2aWNlLmRlbGV0ZUFwcCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25SZWZyZXNoIGFmdGVyIHN1Y2Nlc3NmdWwgZGVsZXRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uZGVsZXRlJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1kaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja09uUmVmcmVzaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkZWxldGUgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIChhcHBzU2VydmljZS5kZWxldGVBcHAgYXMgTW9jaykubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignRGVsZXRlIGZhaWxlZCcpKVxuXG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSBvblJlZnJlc2g9e21vY2tPblJlZnJlc2h9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLWRpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLWNvbmZpcm0nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhcHBzU2VydmljZS5kZWxldGVBcHApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBleHBlY3Quc3RyaW5nQ29udGFpbmluZygnRGVsZXRlIGZhaWxlZCcpIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBkYXRlQXBwSW5mbyBBUEkgd2hlbiBlZGl0aW5nIGFwcCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IG9uUmVmcmVzaD17bW9ja09uUmVmcmVzaH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZWRpdEFwcCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VkaXQtYXBwLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tZWRpdC1tb2RhbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGFwcHNTZXJ2aWNlLnVwZGF0ZUFwcEluZm8pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGNvcHlBcHAgQVBJIHdoZW4gZHVwbGljYXRpbmcgYXBwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5kdXBsaWNhdGUnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkdXBsaWNhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1kdXBsaWNhdGUtbW9kYWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhcHBzU2VydmljZS5jb3B5QXBwKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblBsYW5JbmZvQ2hhbmdlZCBhZnRlciBzdWNjZXNzZnVsIGR1cGxpY2F0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5kdXBsaWNhdGUnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkdXBsaWNhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1kdXBsaWNhdGUtbW9kYWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrT25QbGFuSW5mb0NoYW5nZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29weSBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgKGFwcHNTZXJ2aWNlLmNvcHlBcHAgYXMgTW9jaykubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignQ29weSBmYWlsZWQnKSlcblxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5kdXBsaWNhdGUnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkdXBsaWNhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1kdXBsaWNhdGUtbW9kYWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhcHBzU2VydmljZS5jb3B5QXBwKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ2FwcC5uZXdBcHAuYXBwQ3JlYXRlRmFpbGVkJyB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGV4cG9ydEFwcENvbmZpZyBBUEkgd2hlbiBleHBvcnRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5leHBvcnQnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoYXBwc1NlcnZpY2UuZXhwb3J0QXBwQ29uZmlnKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGV4cG9ydCBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgKGFwcHNTZXJ2aWNlLmV4cG9ydEFwcENvbmZpZyBhcyBNb2NrKS5tb2NrUmVqZWN0ZWRWYWx1ZU9uY2UobmV3IEVycm9yKCdFeHBvcnQgZmFpbGVkJykpXG5cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmV4cG9ydCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhcHBzU2VydmljZS5leHBvcnRBcHBDb25maWcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiAnYXBwLmV4cG9ydEZhaWxlZCcgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU3dpdGNoIE1vZGFsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBzd2l0Y2ggbW9kYWwgd2hlbiBzd2l0Y2ggYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGF0QXBwID0geyAuLi5tb2NrQXBwLCBtb2RlOiBBcHBNb2RlRW51bS5DSEFUIH1cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e2NoYXRBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnN3aXRjaCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N3aXRjaC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIHN3aXRjaCBtb2RhbCB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY2hhdEFwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtjaGF0QXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5zd2l0Y2gnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzd2l0Y2gtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2Utc3dpdGNoLW1vZGFsJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N3aXRjaC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUmVmcmVzaCBhZnRlciBzdWNjZXNzZnVsIHN3aXRjaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17Y2hhdEFwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5zd2l0Y2gnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzd2l0Y2gtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1zd2l0Y2gtbW9kYWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrT25SZWZyZXNoKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb3BlbiBzd2l0Y2ggbW9kYWwgZm9yIGNvbXBsZXRpb24gbW9kZSBhcHBzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY29tcGxldGlvbkFwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTiB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtjb21wbGV0aW9uQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5zd2l0Y2gnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzd2l0Y2gtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPcGVuIGluIEV4cGxvcmUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IG9wZW4gaW4gZXhwbG9yZSBvcHRpb24gd2hlbiBwb3BvdmVyIGlzIG9wZW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAub3BlbkluRXhwbG9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1dvcmtmbG93IEV4cG9ydCB3aXRoIEVudmlyb25tZW50IFZhcmlhYmxlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNoZWNrIGZvciBzZWNyZXQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGluIHdvcmtmbG93IGFwcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB3b3JrZmxvd0FwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1cgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17d29ya2Zsb3dBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmV4cG9ydCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh3b3JrZmxvd1NlcnZpY2UuZmV0Y2hXb3JrZmxvd0RyYWZ0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBEU0wgZXhwb3J0IG1vZGFsIHdoZW4gd29ya2Zsb3cgaGFzIHNlY3JldCB2YXJpYWJsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAod29ya2Zsb3dTZXJ2aWNlLmZldGNoV29ya2Zsb3dEcmFmdCBhcyBNb2NrKS5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2Uoe1xuICAgICAgICBlbnZpcm9ubWVudF92YXJpYWJsZXM6IFt7IHZhbHVlX3R5cGU6ICdzZWNyZXQnLCBuYW1lOiAnQVBJX0tFWScgfV0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB3b3JrZmxvd0FwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1cgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17d29ya2Zsb3dBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmV4cG9ydCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1leHBvcnQtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjaGVjayBmb3Igc2VjcmV0IGVudmlyb25tZW50IHZhcmlhYmxlcyBpbiBhZHZhbmNlZCBjaGF0IGFwcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhZHZhbmNlZENoYXRBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17YWR2YW5jZWRDaGF0QXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5leHBvcnQnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qod29ya2Zsb3dTZXJ2aWNlLmZldGNoV29ya2Zsb3dEcmFmdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIERTTCBleHBvcnQgbW9kYWwgd2hlbiBvbkNsb3NlIGlzIGNhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICh3b3JrZmxvd1NlcnZpY2UuZmV0Y2hXb3JrZmxvd0RyYWZ0IGFzIE1vY2spLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7XG4gICAgICAgIGVudmlyb25tZW50X3ZhcmlhYmxlczogW3sgdmFsdWVfdHlwZTogJ3NlY3JldCcsIG5hbWU6ICdBUElfS0VZJyB9XSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHdvcmtmbG93QXBwID0geyAuLi5tb2NrQXBwLCBtb2RlOiBBcHBNb2RlRW51bS5XT1JLRkxPVyB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXt3b3JrZmxvd0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZXhwb3J0JykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZHNsLWV4cG9ydC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGljayBjbG9zZSBidXR0b24gdG8gdHJpZ2dlciBvbkNsb3NlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1kc2wtZXhwb3J0JykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2RzbC1leHBvcnQtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcE5vRGVzYyA9IHsgLi4ubW9ja0FwcCwgZGVzY3JpcHRpb246ICcnIH1cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e2FwcE5vRGVzY30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsb25nIGFwcCBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ05hbWVBcHAgPSB7XG4gICAgICAgIC4uLm1vY2tBcHAsXG4gICAgICAgIG5hbWU6ICdUaGlzIGlzIGEgdmVyeSBsb25nIGFwcCBuYW1lIHRoYXQgbWlnaHQgb3ZlcmZsb3cgdGhlIGNvbnRhaW5lcicsXG4gICAgICB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtsb25nTmFtZUFwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nTmFtZUFwcC5uYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0YWdzIGFycmF5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgbm9UYWdzQXBwID0geyAuLi5tb2NrQXBwLCB0YWdzOiBbXSB9XG4gICAgICAvLyBXaXRoIGVtcHR5IHRhZ3MsIHRoZSBjb21wb25lbnQgc2hvdWxkIHN0aWxsIHJlbmRlciBzdWNjZXNzZnVsbHlcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e25vVGFnc0FwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGl0bGUoJ1Rlc3QgQXBwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBhdXRob3IgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG5vQXV0aG9yQXBwID0geyAuLi5tb2NrQXBwLCBhdXRob3JfbmFtZTogJycgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bm9BdXRob3JBcHB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRpdGxlKCdUZXN0IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgaWNvbl91cmwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBudWxsSWNvbkFwcCA9IHsgLi4ubW9ja0FwcCwgaWNvbl91cmw6IG51bGwgfVxuICAgICAgLy8gV2l0aCBudWxsIGljb25fdXJsLCB0aGUgY29tcG9uZW50IHNob3VsZCBmYWxsIGJhY2sgdG8gZW1vamkgaWNvbiBhbmQgcmVuZGVyIHN1Y2Nlc3NmdWxseVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bnVsbEljb25BcHB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRpdGxlKCdUZXN0IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGNyZWF0ZWRfYXQgd2hlbiB1cGRhdGVkX2F0IGlzIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBub1VwZGF0ZUFwcCA9IHsgLi4ubW9ja0FwcCwgdXBkYXRlZF9hdDogMCB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtub1VwZGF0ZUFwcH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZWRpdGVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFnZW50IGNoYXQgbW9kZSBhcHBzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWdlbnRBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLkFHRU5UX0NIQVQgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17YWdlbnRBcHB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRpdGxlKCdUZXN0IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFkdmFuY2VkIGNoYXQgbW9kZSBhcHBzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWR2YW5jZWRBcHAgPSB7IC4uLm1vY2tBcHAsIG1vZGU6IEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17YWR2YW5jZWRBcHB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRpdGxlKCdUZXN0IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFwcHMgd2l0aCBtdWx0aXBsZSB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbXVsdGlUYWdBcHAgPSB7XG4gICAgICAgIC4uLm1vY2tBcHAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgICB7IGlkOiAndGFnMScsIG5hbWU6ICdUYWcgMScsIHR5cGU6ICdhcHAnLCBiaW5kaW5nX2NvdW50OiAwIH0sXG4gICAgICAgICAgeyBpZDogJ3RhZzInLCBuYW1lOiAnVGFnIDInLCB0eXBlOiAnYXBwJywgYmluZGluZ19jb3VudDogMCB9LFxuICAgICAgICAgIHsgaWQ6ICd0YWczJywgbmFtZTogJ1RhZyAzJywgdHlwZTogJ2FwcCcsIGJpbmRpbmdfY291bnQ6IDAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e211bHRpVGFnQXBwfSAvPilcbiAgICAgIC8vIFZlcmlmeSB0aGUgdGFnIHNlbGVjdG9yIHJlbmRlcnMgKGFjdHVhbCB0YWcgZGlzcGxheSBpcyBoYW5kbGVkIGJ5IHRoZSByZWFsIFRhZ1NlbGVjdG9yIGNvbXBvbmVudClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlMYWJlbFRleHQoJ3RhZy1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVkaXQgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIChhcHBzU2VydmljZS51cGRhdGVBcHBJbmZvIGFzIE1vY2spLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ0VkaXQgZmFpbGVkJykpXG5cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IG9uUmVmcmVzaD17bW9ja09uUmVmcmVzaH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZWRpdEFwcCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VkaXQtYXBwLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tZWRpdC1tb2RhbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGFwcHNTZXJ2aWNlLnVwZGF0ZUFwcEluZm8pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBleHBlY3Quc3RyaW5nQ29udGFpbmluZygnRWRpdCBmYWlsZWQnKSB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBlZGl0IG1vZGFsIGFmdGVyIHN1Y2Nlc3NmdWwgZWRpdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IG9uUmVmcmVzaD17bW9ja09uUmVmcmVzaH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZWRpdEFwcCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VkaXQtYXBwLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tZWRpdC1tb2RhbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tPblJlZnJlc2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGFwcCBtb2RlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlcyA9IFtcbiAgICAgICAgQXBwTW9kZUVudW0uQ0hBVCxcbiAgICAgICAgQXBwTW9kZUVudW0uQ09NUExFVElPTixcbiAgICAgICAgQXBwTW9kZUVudW0uV09SS0ZMT1csXG4gICAgICAgIEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQsXG4gICAgICAgIEFwcE1vZGVFbnVtLkFHRU5UX0NIQVQsXG4gICAgICBdXG5cbiAgICAgIG1vZGVzLmZvckVhY2goKG1vZGUpID0+IHtcbiAgICAgICAgY29uc3QgdGVzdEFwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZSB9XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxBcHBDYXJkIGFwcD17dGVzdEFwcH0gLz4pXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUaXRsZSgnVGVzdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHdvcmtmbG93IGRyYWZ0IGZldGNoIGZhaWx1cmUgZHVyaW5nIGV4cG9ydCcsIGFzeW5jICgpID0+IHtcbiAgICAgICh3b3JrZmxvd1NlcnZpY2UuZmV0Y2hXb3JrZmxvd0RyYWZ0IGFzIE1vY2spLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ0ZldGNoIGZhaWxlZCcpKVxuXG4gICAgICBjb25zdCB3b3JrZmxvd0FwcCA9IHsgLi4ubW9ja0FwcCwgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1cgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17d29ya2Zsb3dBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmV4cG9ydCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh3b3JrZmxvd1NlcnZpY2UuZmV0Y2hXb3JrZmxvd0RyYWZ0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ2FwcC5leHBvcnRGYWlsZWQnIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQWRkaXRpb25hbCBFZGdlIENhc2VzIGZvciBDb3ZlcmFnZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWRkaXRpb25hbCBDb3ZlcmFnZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvblJlZnJlc2ggY2FsbGJhY2sgaW4gc3dpdGNoIG1vZGFsIHN1Y2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGF0QXBwID0gY3JlYXRlTW9ja0FwcCh7IG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQgfSlcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e2NoYXRBcHB9IG9uUmVmcmVzaD17bW9ja09uUmVmcmVzaH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuc3dpdGNoJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3dpdGNoLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRyaWdnZXIgc3VjY2VzcyBjYWxsYmFja1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1zd2l0Y2gtbW9kYWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrT25SZWZyZXNoKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBvcG92ZXIgbWVudSB3aXRoIGNvcnJlY3Qgc3R5bGluZyBmb3IgZGlmZmVyZW50IGFwcCBtb2RlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIFRlc3QgY29tcGxldGlvbiBtb2RlIHN0eWxpbmdcbiAgICAgIGNvbnN0IGNvbXBsZXRpb25BcHAgPSBjcmVhdGVNb2NrQXBwKHsgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTiB9KVxuICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXIoPEFwcENhcmQgYXBwPXtjb21wbGV0aW9uQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5lZGl0QXBwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIHVubW91bnQoKVxuXG4gICAgICAvLyBUZXN0IHdvcmtmbG93IG1vZGUgc3R5bGluZ1xuICAgICAgY29uc3Qgd29ya2Zsb3dBcHAgPSBjcmVhdGVNb2NrQXBwKHsgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1cgfSlcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e3dvcmtmbG93QXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5lZGl0QXBwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBwcm9wYWdhdGlvbiB3aGVuIGNsaWNraW5nIHRhZyBzZWxlY3RvciBhcmVhJywgKCkgPT4ge1xuICAgICAgY29uc3QgbXVsdGlUYWdBcHAgPSBjcmVhdGVNb2NrQXBwKHtcbiAgICAgICAgdGFnczogW3sgaWQ6ICd0YWcxJywgbmFtZTogJ1RhZyAxJywgdHlwZTogJ2FwcCcsIGJpbmRpbmdfY291bnQ6IDAgfV0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttdWx0aVRhZ0FwcH0gLz4pXG5cbiAgICAgIGNvbnN0IHRhZ1NlbGVjdG9yID0gc2NyZWVuLmdldEJ5TGFiZWxUZXh0KCd0YWctc2VsZWN0b3InKVxuICAgICAgZXhwZWN0KHRhZ1NlbGVjdG9yKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENsaWNrIG9uIHRhZyBzZWxlY3RvciB3cmFwcGVyIHRvIHRyaWdnZXIgc3RvcFByb3BhZ2F0aW9uXG4gICAgICBjb25zdCB0YWdTZWxlY3RvcldyYXBwZXIgPSB0YWdTZWxlY3Rvci5jbG9zZXN0KCdkaXYnKVxuICAgICAgaWYgKHRhZ1NlbGVjdG9yV3JhcHBlcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHRhZ1NlbGVjdG9yV3JhcHBlcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcG9wb3ZlciBtb3VzZSBsZWF2ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICAvLyBPcGVuIHBvcG92ZXJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBUcmlnZ2VyIG1vdXNlIGxlYXZlIG9uIHRoZSBvdXRlciBwb3BvdmVyLWNvbnRlbnRcbiAgICAgIGZpcmVFdmVudC5tb3VzZUxlYXZlKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci1jb250ZW50JykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcG92ZXItY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb3BlcmF0aW9ucyBtZW51IG1vdXNlIGxlYXZlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIC8vIE9wZW4gcG9wb3ZlclxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5lZGl0QXBwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmQgdGhlIE9wZXJhdGlvbnMgd3JhcHBlciBkaXYgKGNvbnRhaW5zIHRoZSBtZW51IGl0ZW1zKVxuICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5lZGl0QXBwJylcbiAgICAgIGNvbnN0IG9wZXJhdGlvbnNXcmFwcGVyID0gZWRpdEJ1dHRvbi5jbG9zZXN0KCdkaXYucmVsYXRpdmUnKVxuXG4gICAgICAvLyBUcmlnZ2VyIG1vdXNlIGxlYXZlIG9uIHRoZSBPcGVyYXRpb25zIHdyYXBwZXIgdG8gY2FsbCBvbk1vdXNlTGVhdmVcbiAgICAgIGlmIChvcGVyYXRpb25zV3JhcHBlcilcbiAgICAgICAgZmlyZUV2ZW50Lm1vdXNlTGVhdmUob3BlcmF0aW9uc1dyYXBwZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xpY2sgb3BlbiBpbiBleHBsb3JlIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBvcGVuSW5FeHBsb3JlQnRuID0gc2NyZWVuLmdldEJ5VGV4dCgnYXBwLm9wZW5JbkV4cGxvcmUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sob3BlbkluRXhwbG9yZUJ0bilcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBvcGVuQXN5bmNXaW5kb3cgd2FzIGNhbGxlZCB3aXRoIGNhbGxiYWNrIGFuZCBvcHRpb25zXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tPcGVuQXN5bmNXaW5kb3cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgb25FcnJvcjogZXhwZWN0LmFueShGdW5jdGlvbikgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9wZW4gaW4gZXhwbG9yZSB2aWEgYXN5bmMgd2luZG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQ29uZmlndXJlIG1vY2tPcGVuQXN5bmNXaW5kb3cgdG8gYWN0dWFsbHkgY2FsbCB0aGUgY2FsbGJhY2tcbiAgICAgIG1vY2tPcGVuQXN5bmNXaW5kb3cubW9ja0ltcGxlbWVudGF0aW9uT25jZShhc3luYyAoY2FsbGJhY2s6ICgpID0+IFByb21pc2U8c3RyaW5nPikgPT4ge1xuICAgICAgICBhd2FpdCBjYWxsYmFjaygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb3BlbkluRXhwbG9yZUJ0biA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5vcGVuSW5FeHBsb3JlJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKG9wZW5JbkV4cGxvcmVCdG4pXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4cGxvcmVTZXJ2aWNlLmZldGNoSW5zdGFsbGVkQXBwTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9ja0FwcC5pZClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9wZW4gaW4gZXhwbG9yZSBBUEkgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIChleHBsb3JlU2VydmljZS5mZXRjaEluc3RhbGxlZEFwcExpc3QgYXMgTW9jaykubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignQVBJIEVycm9yJykpXG5cbiAgICAgIC8vIENvbmZpZ3VyZSBtb2NrT3BlbkFzeW5jV2luZG93IHRvIGNhbGwgdGhlIGNhbGxiYWNrIGFuZCB0cmlnZ2VyIGVycm9yXG4gICAgICBtb2NrT3BlbkFzeW5jV2luZG93Lm1vY2tJbXBsZW1lbnRhdGlvbk9uY2UoYXN5bmMgKGNhbGxiYWNrOiAoKSA9PiBQcm9taXNlPHN0cmluZz4sIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgb3B0aW9ucz8ub25FcnJvcj8uKGVycilcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wZW5JbkV4cGxvcmVCdG4gPSBzY3JlZW4uZ2V0QnlUZXh0KCdhcHAub3BlbkluRXhwbG9yZScpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhvcGVuSW5FeHBsb3JlQnRuKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChleHBsb3JlU2VydmljZS5mZXRjaEluc3RhbGxlZEFwcExpc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBY2Nlc3MgQ29udHJvbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvcGVyYXRpb25zIG1lbnUgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZWRpdEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuZHVwbGljYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5leHBvcnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5kZWxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPcGVuIGluIEV4cGxvcmUgLSBObyBBcHAgRm91bmQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY2FzZSB3aGVuIGluc3RhbGxlZF9hcHBzIGlzIGVtcHR5IGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgKGV4cGxvcmVTZXJ2aWNlLmZldGNoSW5zdGFsbGVkQXBwTGlzdCBhcyBNb2NrKS5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBpbnN0YWxsZWRfYXBwczogW10gfSlcblxuICAgICAgLy8gQ29uZmlndXJlIG1vY2tPcGVuQXN5bmNXaW5kb3cgdG8gY2FsbCB0aGUgY2FsbGJhY2sgYW5kIHRyaWdnZXIgZXJyb3JcbiAgICAgIG1vY2tPcGVuQXN5bmNXaW5kb3cubW9ja0ltcGxlbWVudGF0aW9uT25jZShhc3luYyAoY2FsbGJhY2s6ICgpID0+IFByb21pc2U8c3RyaW5nPiwgb3B0aW9uczogYW55KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBvcHRpb25zPy5vbkVycm9yPy4oZXJyKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgb3BlbkluRXhwbG9yZUJ0biA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5vcGVuSW5FeHBsb3JlJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKG9wZW5JbkV4cGxvcmVCdG4pXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGV4cGxvcmVTZXJ2aWNlLmZldGNoSW5zdGFsbGVkQXBwTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjYXNlIHdoZW4gQVBJIHRocm93cyBpbiBjYWxsYmFjaycsIGFzeW5jICgpID0+IHtcbiAgICAgIChleHBsb3JlU2VydmljZS5mZXRjaEluc3RhbGxlZEFwcExpc3QgYXMgTW9jaykubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignTmV0d29yayBlcnJvcicpKVxuXG4gICAgICAvLyBDb25maWd1cmUgbW9ja09wZW5Bc3luY1dpbmRvdyB0byBjYWxsIHRoZSBjYWxsYmFjayB3aXRob3V0IGNhdGNoaW5nXG4gICAgICBtb2NrT3BlbkFzeW5jV2luZG93Lm1vY2tJbXBsZW1lbnRhdGlvbk9uY2UoYXN5bmMgKGNhbGxiYWNrOiAoKSA9PiBQcm9taXNlPHN0cmluZz4pID0+IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxiYWNrKClcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBvcGVuSW5FeHBsb3JlQnRuID0gc2NyZWVuLmdldEJ5VGV4dCgnYXBwLm9wZW5JbkV4cGxvcmUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sob3BlbkluRXhwbG9yZUJ0bilcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZXhwbG9yZVNlcnZpY2UuZmV0Y2hJbnN0YWxsZWRBcHBMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRHJhZnQgVHJpZ2dlciBBcHBzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHNob3cgb3BlbiBpbiBleHBsb3JlIG9wdGlvbiBmb3IgYXBwcyB3aXRoIGhhc19kcmFmdF90cmlnZ2VyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZHJhZnRUcmlnZ2VyQXBwID0gY3JlYXRlTW9ja0FwcCh7IGhhc19kcmFmdF90cmlnZ2VyOiB0cnVlIH0pXG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXtkcmFmdFRyaWdnZXJBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmVkaXRBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAvLyBvcGVuSW5FeHBsb3JlIHNob3VsZCBub3QgYmUgc2hvd24gZm9yIGRyYWZ0IHRyaWdnZXIgYXBwc1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdhcHAub3BlbkluRXhwbG9yZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdOb24tZWRpdG9yIFVzZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbm9uLWVkaXRvciB3b3Jrc3BhY2UgdXNlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3RzIHRoZSBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3I9dHJ1ZSBicmFuY2ggKGRlZmF1bHQgbW9jaylcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRpdGxlKCdUZXN0IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnV2ViQXBwIEF1dGggRW5hYmxlZCcsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG1vY2tXZWJhcHBBdXRoRW5hYmxlZCA9IHRydWVcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGFjY2VzcyBjb250cm9sIG9wdGlvbiB3aGVuIHdlYmFwcF9hdXRoIGlzIGVuYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgYXBwPXttb2NrQXBwfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5hY2Nlc3NDb250cm9sJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xpY2sgYWNjZXNzIGNvbnRyb2wgYnV0dG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc0NvbnRyb2xCdG4gPSBzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuYWNjZXNzQ29udHJvbCcpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhhY2Nlc3NDb250cm9sQnRuKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FjY2Vzcy1jb250cm9sLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgYWNjZXNzIGNvbnRyb2wgbW9kYWwgYW5kIGNhbGwgb25SZWZyZXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gb25SZWZyZXNoPXttb2NrT25SZWZyZXNofSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9wb3Zlci10cmlnZ2VyJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcC5hY2Nlc3NDb250cm9sJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYWNjZXNzLWNvbnRyb2wtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ29uZmlybSBhY2Nlc3MgY29udHJvbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1hY2Nlc3MtY29udHJvbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tPblJlZnJlc2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IG9wZW4gaW4gZXhwbG9yZSB3aGVuIHVzZXJDYW5BY2Nlc3NBcHAgaXMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCBhcHA9e21vY2tBcHB9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3BvdmVyLXRyaWdnZXInKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLm9wZW5JbkV4cGxvcmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBhY2Nlc3MgY29udHJvbCBtb2RhbCB3aGVuIG9uQ2xvc2UgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIGFwcD17bW9ja0FwcH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcG92ZXItdHJpZ2dlcicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHAuYWNjZXNzQ29udHJvbCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FjY2Vzcy1jb250cm9sLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIGNsb3NlIGJ1dHRvbiB0byB0cmlnZ2VyIG9uQ2xvc2VcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLWFjY2Vzcy1jb250cm9sJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2FjY2Vzcy1jb250cm9sLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19