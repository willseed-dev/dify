"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const use_context_selector_1 = require("use-context-selector");
const web_app_context_1 = require("@/context/web-app-context");
const access_control_1 = require("@/models/access-control");
const access_control_2 = require("@/service/access-control");
const use_explore_1 = require("@/service/use-explore");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// Mock external dependencies BEFORE imports
vi.mock('use-context-selector', () => ({
    useContext: vi.fn(),
    createContext: vi.fn(() => ({})),
}));
vi.mock('@/context/web-app-context', () => ({
    useWebAppStore: vi.fn(),
}));
vi.mock('@/service/access-control', () => ({
    useGetUserCanAccessApp: vi.fn(),
}));
vi.mock('@/service/use-explore', () => ({
    useGetInstalledAppAccessModeByAppId: vi.fn(),
    useGetInstalledAppParams: vi.fn(),
    useGetInstalledAppMeta: vi.fn(),
}));
/**
 * Mock child components for unit testing
 *
 * RATIONALE FOR MOCKING:
 * - TextGenerationApp: 648 lines, complex batch processing, task management, file uploads
 * - ChatWithHistory: 576-line custom hook, complex conversation/history management, 30+ context values
 *
 * These components are too complex to test as real components. Using real components would:
 * 1. Require mocking dozens of their dependencies (services, contexts, hooks)
 * 2. Make tests fragile and coupled to child component implementation details
 * 3. Violate the principle of testing one component in isolation
 *
 * For a container component like InstalledApp, its responsibility is to:
 * - Correctly route to the appropriate child component based on app mode
 * - Pass the correct props to child components
 * - Handle loading/error states before rendering children
 *
 * The internal logic of ChatWithHistory and TextGenerationApp should be tested
 * in their own dedicated test files.
 */
vi.mock('@/app/components/share/text-generation', () => ({
    default: ({ isInstalledApp, installedAppInfo, isWorkflow }) => (<div data-testid="text-generation-app">
      Text Generation App
      {isWorkflow && ' (Workflow)'}
      {isInstalledApp && ` - ${installedAppInfo?.id}`}
    </div>),
}));
vi.mock('@/app/components/base/chat/chat-with-history', () => ({
    default: ({ installedAppInfo, className }) => (<div data-testid="chat-with-history" className={className}>
      Chat With History -
      {' '}
      {installedAppInfo?.id}
    </div>),
}));
describe('InstalledApp', () => {
    const mockUpdateAppInfo = vi.fn();
    const mockUpdateWebAppAccessMode = vi.fn();
    const mockUpdateAppParams = vi.fn();
    const mockUpdateWebAppMeta = vi.fn();
    const mockUpdateUserCanAccessApp = vi.fn();
    const mockInstalledApp = {
        id: 'installed-app-123',
        app: {
            id: 'app-123',
            name: 'Test App',
            mode: app_1.AppModeEnum.CHAT,
            icon_type: 'emoji',
            icon: '🚀',
            icon_background: '#FFFFFF',
            icon_url: '',
            description: 'Test description',
            use_icon_as_answer_icon: false,
        },
        uninstallable: true,
        is_pinned: false,
    };
    const mockAppParams = {
        user_input_form: [],
        file_upload: { image: { enabled: false, number_limits: 0, transfer_methods: [] } },
        system_parameters: {},
    };
    const mockAppMeta = {
        tool_icons: {},
    };
    const mockWebAppAccessMode = {
        accessMode: access_control_1.AccessMode.PUBLIC,
    };
    const mockUserCanAccessApp = {
        result: true,
    };
    beforeEach(() => {
        vi.clearAllMocks();
        use_context_selector_1.useContext.mockReturnValue({
            installedApps: [mockInstalledApp],
            isFetchingInstalledApps: false,
        });
        web_app_context_1.useWebAppStore.mockImplementation((selector) => {
            const state = {
                updateAppInfo: mockUpdateAppInfo,
                updateWebAppAccessMode: mockUpdateWebAppAccessMode,
                updateAppParams: mockUpdateAppParams,
                updateWebAppMeta: mockUpdateWebAppMeta,
                updateUserCanAccessApp: mockUpdateUserCanAccessApp,
            };
            return selector(state);
        });
        use_explore_1.useGetInstalledAppAccessModeByAppId.mockReturnValue({
            isFetching: false,
            data: mockWebAppAccessMode,
            error: null,
        });
        use_explore_1.useGetInstalledAppParams.mockReturnValue({
            isFetching: false,
            data: mockAppParams,
            error: null,
        });
        use_explore_1.useGetInstalledAppMeta.mockReturnValue({
            isFetching: false,
            data: mockAppMeta,
            error: null,
        });
        access_control_2.useGetUserCanAccessApp.mockReturnValue({
            data: mockUserCanAccessApp,
            error: null,
        });
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Chat With History/i)).toBeInTheDocument();
        });
        it('should render loading state when fetching app params', () => {
            ;
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: true,
                data: null,
                error: null,
            });
            const { container } = (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            const svg = container.querySelector('svg.spin-animation');
            expect(svg).toBeInTheDocument();
        });
        it('should render loading state when fetching app meta', () => {
            ;
            use_explore_1.useGetInstalledAppMeta.mockReturnValue({
                isFetching: true,
                data: null,
                error: null,
            });
            const { container } = (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            const svg = container.querySelector('svg.spin-animation');
            expect(svg).toBeInTheDocument();
        });
        it('should render loading state when fetching web app access mode', () => {
            ;
            use_explore_1.useGetInstalledAppAccessModeByAppId.mockReturnValue({
                isFetching: true,
                data: null,
                error: null,
            });
            const { container } = (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            const svg = container.querySelector('svg.spin-animation');
            expect(svg).toBeInTheDocument();
        });
        it('should render loading state when fetching installed apps', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [mockInstalledApp],
                isFetchingInstalledApps: true,
            });
            const { container } = (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            const svg = container.querySelector('svg.spin-animation');
            expect(svg).toBeInTheDocument();
        });
        it('should render app not found (404) when installedApp does not exist', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="nonexistent-app"/>);
            expect(react_1.screen.getByText(/404/)).toBeInTheDocument();
        });
    });
    describe('Error States', () => {
        it('should render error when app params fails to load', () => {
            const error = new Error('Failed to load app params');
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: false,
                data: null,
                error,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Failed to load app params/)).toBeInTheDocument();
        });
        it('should render error when app meta fails to load', () => {
            const error = new Error('Failed to load app meta');
            use_explore_1.useGetInstalledAppMeta.mockReturnValue({
                isFetching: false,
                data: null,
                error,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Failed to load app meta/)).toBeInTheDocument();
        });
        it('should render error when web app access mode fails to load', () => {
            const error = new Error('Failed to load access mode');
            use_explore_1.useGetInstalledAppAccessModeByAppId.mockReturnValue({
                isFetching: false,
                data: null,
                error,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Failed to load access mode/)).toBeInTheDocument();
        });
        it('should render error when user access check fails', () => {
            const error = new Error('Failed to check user access');
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: null,
                error,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Failed to check user access/)).toBeInTheDocument();
        });
        it('should render no permission (403) when user cannot access app', () => {
            ;
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: { result: false },
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/403/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/no permission/i)).toBeInTheDocument();
        });
    });
    describe('App Mode Rendering', () => {
        it('should render ChatWithHistory for CHAT mode', () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Chat With History/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/Text Generation App/i)).not.toBeInTheDocument();
        });
        it('should render ChatWithHistory for ADVANCED_CHAT mode', () => {
            const advancedChatApp = {
                ...mockInstalledApp,
                app: {
                    ...mockInstalledApp.app,
                    mode: app_1.AppModeEnum.ADVANCED_CHAT,
                },
            };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [advancedChatApp],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Chat With History/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/Text Generation App/i)).not.toBeInTheDocument();
        });
        it('should render ChatWithHistory for AGENT_CHAT mode', () => {
            const agentChatApp = {
                ...mockInstalledApp,
                app: {
                    ...mockInstalledApp.app,
                    mode: app_1.AppModeEnum.AGENT_CHAT,
                },
            };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [agentChatApp],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Chat With History/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/Text Generation App/i)).not.toBeInTheDocument();
        });
        it('should render TextGenerationApp for COMPLETION mode', () => {
            const completionApp = {
                ...mockInstalledApp,
                app: {
                    ...mockInstalledApp.app,
                    mode: app_1.AppModeEnum.COMPLETION,
                },
            };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [completionApp],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Text Generation App/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/Workflow/)).not.toBeInTheDocument();
        });
        it('should render TextGenerationApp with workflow flag for WORKFLOW mode', () => {
            const workflowApp = {
                ...mockInstalledApp,
                app: {
                    ...mockInstalledApp.app,
                    mode: app_1.AppModeEnum.WORKFLOW,
                },
            };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [workflowApp],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/Text Generation App/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/Workflow/)).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        it('should use id prop to find installed app', () => {
            const app1 = { ...mockInstalledApp, id: 'app-1' };
            const app2 = { ...mockInstalledApp, id: 'app-2' };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [app1, app2],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="app-2"/>);
            expect(react_1.screen.getByText(/app-2/)).toBeInTheDocument();
        });
        it('should handle id that does not match any installed app', () => {
            (0, react_1.render)(<index_1.default id="nonexistent-id"/>);
            expect(react_1.screen.getByText(/404/)).toBeInTheDocument();
        });
    });
    describe('Effects', () => {
        it('should update app info when installedApp is available', async () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppInfo).toHaveBeenCalledWith(expect.objectContaining({
                    app_id: 'installed-app-123',
                    site: expect.objectContaining({
                        title: 'Test App',
                        icon_type: 'emoji',
                        icon: '🚀',
                        icon_background: '#FFFFFF',
                        icon_url: '',
                        prompt_public: false,
                        copyright: '',
                        show_workflow_steps: true,
                        use_icon_as_answer_icon: false,
                    }),
                    plan: 'basic',
                    custom_config: null,
                }));
            });
        });
        it('should update app info to null when installedApp is not found', async () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="nonexistent-app"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppInfo).toHaveBeenCalledWith(null);
            });
        });
        it('should update app params when data is available', async () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppParams).toHaveBeenCalledWith(mockAppParams);
            });
        });
        it('should update app meta when data is available', async () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateWebAppMeta).toHaveBeenCalledWith(mockAppMeta);
            });
        });
        it('should update web app access mode when data is available', async () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateWebAppAccessMode).toHaveBeenCalledWith(access_control_1.AccessMode.PUBLIC);
            });
        });
        it('should update user can access app when data is available', async () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateUserCanAccessApp).toHaveBeenCalledWith(true);
            });
        });
        it('should update user can access app to false when result is false', async () => {
            ;
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: { result: false },
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateUserCanAccessApp).toHaveBeenCalledWith(false);
            });
        });
        it('should update user can access app to false when data is null', async () => {
            ;
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: null,
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateUserCanAccessApp).toHaveBeenCalledWith(false);
            });
        });
        it('should not update app params when data is null', async () => {
            ;
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: false,
                data: null,
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppInfo).toHaveBeenCalled();
            });
            expect(mockUpdateAppParams).not.toHaveBeenCalled();
        });
        it('should not update app meta when data is null', async () => {
            ;
            use_explore_1.useGetInstalledAppMeta.mockReturnValue({
                isFetching: false,
                data: null,
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppInfo).toHaveBeenCalled();
            });
            expect(mockUpdateWebAppMeta).not.toHaveBeenCalled();
        });
        it('should not update access mode when data is null', async () => {
            ;
            use_explore_1.useGetInstalledAppAccessModeByAppId.mockReturnValue({
                isFetching: false,
                data: null,
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockUpdateAppInfo).toHaveBeenCalled();
            });
            expect(mockUpdateWebAppAccessMode).not.toHaveBeenCalled();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty installedApps array', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(react_1.screen.getByText(/404/)).toBeInTheDocument();
        });
        it('should handle multiple installed apps and find the correct one', () => {
            const otherApp = {
                ...mockInstalledApp,
                id: 'other-app-id',
                app: {
                    ...mockInstalledApp.app,
                    name: 'Other App',
                },
            };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [otherApp, mockInstalledApp],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            // Should find and render the correct app
            expect(react_1.screen.getByText(/Chat With History/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/installed-app-123/)).toBeInTheDocument();
        });
        it('should handle rapid id prop changes', async () => {
            const app1 = { ...mockInstalledApp, id: 'app-1' };
            const app2 = { ...mockInstalledApp, id: 'app-2' };
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [app1, app2],
                isFetchingInstalledApps: false,
            });
            const { rerender } = (0, react_1.render)(<index_1.default id="app-1"/>);
            expect(react_1.screen.getByText(/app-1/)).toBeInTheDocument();
            rerender(<index_1.default id="app-2"/>);
            expect(react_1.screen.getByText(/app-2/)).toBeInTheDocument();
        });
        it('should call service hooks with correct appId', () => {
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            expect(use_explore_1.useGetInstalledAppAccessModeByAppId).toHaveBeenCalledWith('installed-app-123');
            expect(use_explore_1.useGetInstalledAppParams).toHaveBeenCalledWith('installed-app-123');
            expect(use_explore_1.useGetInstalledAppMeta).toHaveBeenCalledWith('installed-app-123');
            expect(access_control_2.useGetUserCanAccessApp).toHaveBeenCalledWith({
                appId: 'app-123',
                isInstalledApp: true,
            });
        });
        it('should call service hooks with null when installedApp is not found', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            (0, react_1.render)(<index_1.default id="nonexistent-app"/>);
            expect(use_explore_1.useGetInstalledAppAccessModeByAppId).toHaveBeenCalledWith(null);
            expect(use_explore_1.useGetInstalledAppParams).toHaveBeenCalledWith(null);
            expect(use_explore_1.useGetInstalledAppMeta).toHaveBeenCalledWith(null);
            expect(access_control_2.useGetUserCanAccessApp).toHaveBeenCalledWith({
                appId: undefined,
                isInstalledApp: true,
            });
        });
    });
    describe('Render Priority', () => {
        it('should show error before loading state', () => {
            ;
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: true,
                data: null,
                error: new Error('Some error'),
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            // Error should take precedence over loading
            expect(react_1.screen.getByText(/Some error/)).toBeInTheDocument();
        });
        it('should show error before permission check', () => {
            ;
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: false,
                data: null,
                error: new Error('Params error'),
            });
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: { result: false },
                error: null,
            });
            (0, react_1.render)(<index_1.default id="installed-app-123"/>);
            // Error should take precedence over permission
            expect(react_1.screen.getByText(/Params error/)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/403/)).not.toBeInTheDocument();
        });
        it('should show permission error before 404', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            access_control_2.useGetUserCanAccessApp.mockReturnValue({
                data: { result: false },
                error: null,
            });
            (0, react_1.render)(<index_1.default id="nonexistent-app"/>);
            // Permission should take precedence over 404
            expect(react_1.screen.getByText(/403/)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/404/)).not.toBeInTheDocument();
        });
        it('should show loading before 404', () => {
            ;
            use_context_selector_1.useContext.mockReturnValue({
                installedApps: [],
                isFetchingInstalledApps: false,
            });
            use_explore_1.useGetInstalledAppParams.mockReturnValue({
                isFetching: true,
                data: null,
                error: null,
            });
            const { container } = (0, react_1.render)(<index_1.default id="nonexistent-app"/>);
            // Loading should take precedence over 404
            const svg = container.querySelector('svg.spin-animation');
            expect(svg).toBeInTheDocument();
            expect(react_1.screen.queryByText(/404/)).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWdFO0FBQ2hFLCtEQUFpRDtBQUVqRCwrREFBMEQ7QUFDMUQsNERBQW9EO0FBQ3BELDZEQUFpRTtBQUNqRSx1REFBNkg7QUFDN0gscUNBQXlDO0FBQ3pDLG1DQUFrQztBQUVsQyw0Q0FBNEM7QUFDNUMsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25CLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDakMsQ0FBQyxDQUFDLENBQUE7QUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDeEIsQ0FBQyxDQUFDLENBQUE7QUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNoQyxDQUFDLENBQUMsQ0FBQTtBQUNILEVBQUUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0QyxtQ0FBbUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNoQyxDQUFDLENBQUMsQ0FBQTtBQUVIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFJdkQsRUFBRSxFQUFFLENBQUMsQ0FDSixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQ3BDOztNQUNBLENBQUMsVUFBVSxJQUFJLGFBQWEsQ0FDNUI7TUFBQSxDQUFDLGNBQWMsSUFBSSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxDQUNqRDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3RCxPQUFPLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFHdEMsRUFBRSxFQUFFLENBQUMsQ0FDSixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ3hEOztNQUNBLENBQUMsR0FBRyxDQUNKO01BQUEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQ3ZCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDakMsTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDMUMsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDbkMsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDcEMsTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFFMUMsTUFBTSxnQkFBZ0IsR0FBRztRQUN2QixFQUFFLEVBQUUsbUJBQW1CO1FBQ3ZCLEdBQUcsRUFBRTtZQUNILEVBQUUsRUFBRSxTQUFTO1lBQ2IsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLGlCQUFXLENBQUMsSUFBSTtZQUN0QixTQUFTLEVBQUUsT0FBZ0I7WUFDM0IsSUFBSSxFQUFFLElBQUk7WUFDVixlQUFlLEVBQUUsU0FBUztZQUMxQixRQUFRLEVBQUUsRUFBRTtZQUNaLFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsdUJBQXVCLEVBQUUsS0FBSztTQUMvQjtRQUNELGFBQWEsRUFBRSxJQUFJO1FBQ25CLFNBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUE7SUFFRCxNQUFNLGFBQWEsR0FBRztRQUNwQixlQUFlLEVBQUUsRUFBRTtRQUNuQixXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUU7UUFDbEYsaUJBQWlCLEVBQUUsRUFBRTtLQUN0QixDQUFBO0lBRUQsTUFBTSxXQUFXLEdBQUc7UUFDbEIsVUFBVSxFQUFFLEVBQUU7S0FDZixDQUFBO0lBRUQsTUFBTSxvQkFBb0IsR0FBRztRQUMzQixVQUFVLEVBQUUsMkJBQVUsQ0FBQyxNQUFNO0tBQzlCLENBQUE7SUFFRCxNQUFNLG9CQUFvQixHQUFHO1FBQzNCLE1BQU0sRUFBRSxJQUFJO0tBQ2IsQ0FBQTtJQUVELFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBR2pCO1FBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO1lBQ3BDLGFBQWEsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pDLHVCQUF1QixFQUFFLEtBQUs7U0FDL0IsQ0FBQyxDQUdEO1FBQUMsZ0NBQWtDLENBQUMsa0JBQWtCLENBQUMsQ0FDdEQsUUFNYSxFQUNiLEVBQUU7WUFDRixNQUFNLEtBQUssR0FBRztnQkFDWixhQUFhLEVBQUUsaUJBQWlCO2dCQUNoQyxzQkFBc0IsRUFBRSwwQkFBMEI7Z0JBQ2xELGVBQWUsRUFBRSxtQkFBbUI7Z0JBQ3BDLGdCQUFnQixFQUFFLG9CQUFvQjtnQkFDdEMsc0JBQXNCLEVBQUUsMEJBQTBCO2FBQ25ELENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QixDQUFDLENBQUMsQ0FHRDtRQUFDLGlEQUE0QyxDQUFDLGVBQWUsQ0FBQztZQUM3RCxVQUFVLEVBQUUsS0FBSztZQUNqQixJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUVEO1FBQUMsc0NBQWlDLENBQUMsZUFBZSxDQUFDO1lBQ2xELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLElBQUksRUFBRSxhQUFhO1lBQ25CLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUVEO1FBQUMsb0NBQStCLENBQUMsZUFBZSxDQUFDO1lBQ2hELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLElBQUksRUFBRSxXQUFXO1lBQ2pCLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUVEO1FBQUMsdUNBQStCLENBQUMsZUFBZSxDQUFDO1lBQ2hELElBQUksRUFBRSxvQkFBb0I7WUFDMUIsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUMvQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsQ0FBQztZQUFDLHNDQUFpQyxDQUFDLGVBQWUsQ0FBQztnQkFDbEQsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFBO1lBRUYsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFDckUsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxDQUFDO1lBQUMsb0NBQStCLENBQUMsZUFBZSxDQUFDO2dCQUNoRCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7WUFFRixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUNyRSxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDakMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLENBQUM7WUFBQyxpREFBNEMsQ0FBQyxlQUFlLENBQUM7Z0JBQzdELFVBQVUsRUFBRSxJQUFJO2dCQUNoQixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtZQUN6RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7WUFDbEUsQ0FBQztZQUFDLGlDQUFtQixDQUFDLGVBQWUsQ0FBQztnQkFDcEMsYUFBYSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2pDLHVCQUF1QixFQUFFLElBQUk7YUFDOUIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFDckUsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2pDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtZQUM1RSxDQUFDO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsRUFBRTtnQkFDakIsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUcsQ0FBQyxDQUFBO1lBQzdDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNyRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUNuRDtZQUFDLHNDQUFpQyxDQUFDLGVBQWUsQ0FBQztnQkFDbEQsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUs7YUFDTixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtZQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUNqRDtZQUFDLG9DQUErQixDQUFDLGVBQWUsQ0FBQztnQkFDaEQsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUs7YUFDTixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3pFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtZQUNwRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUNwRDtZQUFDLGlEQUE0QyxDQUFDLGVBQWUsQ0FBQztnQkFDN0QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUs7YUFDTixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUNyRDtZQUFDLHVDQUErQixDQUFDLGVBQWUsQ0FBQztnQkFDaEQsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSzthQUNOLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDN0UsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLENBQUM7WUFBQyx1Q0FBK0IsQ0FBQyxlQUFlLENBQUM7Z0JBQ2hELElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0JBQ3ZCLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUMvQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsTUFBTSxlQUFlLEdBQUc7Z0JBQ3RCLEdBQUcsZ0JBQWdCO2dCQUNuQixHQUFHLEVBQUU7b0JBQ0gsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHO29CQUN2QixJQUFJLEVBQUUsaUJBQVcsQ0FBQyxhQUFhO2lCQUNoQzthQUNGLENBQ0E7WUFBQyxpQ0FBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLGFBQWEsRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFDaEMsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7WUFDM0QsTUFBTSxZQUFZLEdBQUc7Z0JBQ25CLEdBQUcsZ0JBQWdCO2dCQUNuQixHQUFHLEVBQUU7b0JBQ0gsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHO29CQUN2QixJQUFJLEVBQUUsaUJBQVcsQ0FBQyxVQUFVO2lCQUM3QjthQUNGLENBQ0E7WUFBQyxpQ0FBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLGFBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDN0IsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxhQUFhLEdBQUc7Z0JBQ3BCLEdBQUcsZ0JBQWdCO2dCQUNuQixHQUFHLEVBQUU7b0JBQ0gsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHO29CQUN2QixJQUFJLEVBQUUsaUJBQVcsQ0FBQyxVQUFVO2lCQUM3QjthQUNGLENBQ0E7WUFBQyxpQ0FBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLGFBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDOUIsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3BFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1lBQzlFLE1BQU0sV0FBVyxHQUFHO2dCQUNsQixHQUFHLGdCQUFnQjtnQkFDbkIsR0FBRyxFQUFFO29CQUNILEdBQUcsZ0JBQWdCLENBQUMsR0FBRztvQkFDdkIsSUFBSSxFQUFFLGlCQUFXLENBQUMsUUFBUTtpQkFDM0I7YUFDRixDQUNBO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUM7Z0JBQzVCLHVCQUF1QixFQUFFLEtBQUs7YUFDL0IsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUMvQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNwRSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDbEQsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQTtZQUNqRCxNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUNoRDtZQUFDLGlDQUFtQixDQUFDLGVBQWUsQ0FBQztnQkFDcEMsYUFBYSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztnQkFDM0IsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFHLENBQUMsQ0FBQTtZQUNuQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDLENBQUE7WUFDNUMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtRQUN2QixFQUFFLENBQUMsdURBQXVELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDckUsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsb0JBQW9CLENBQzVDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEIsTUFBTSxFQUFFLG1CQUFtQjtvQkFDM0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDNUIsS0FBSyxFQUFFLFVBQVU7d0JBQ2pCLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixJQUFJLEVBQUUsSUFBSTt3QkFDVixlQUFlLEVBQUUsU0FBUzt3QkFDMUIsUUFBUSxFQUFFLEVBQUU7d0JBQ1osYUFBYSxFQUFFLEtBQUs7d0JBQ3BCLFNBQVMsRUFBRSxFQUFFO3dCQUNiLG1CQUFtQixFQUFFLElBQUk7d0JBQ3pCLHVCQUF1QixFQUFFLEtBQUs7cUJBQy9CLENBQUM7b0JBQ0YsSUFBSSxFQUFFLE9BQU87b0JBQ2IsYUFBYSxFQUFFLElBQUk7aUJBQ3BCLENBQUMsQ0FDSCxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrREFBK0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM3RSxDQUFDO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsRUFBRTtnQkFDakIsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUcsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9ELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFFL0MsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ2pFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDN0QsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBRS9DLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQywyQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMERBQTBELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDeEUsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDL0QsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpRUFBaUUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMvRSxDQUFDO1lBQUMsdUNBQStCLENBQUMsZUFBZSxDQUFDO2dCQUNoRCxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQUN2QixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFFL0MsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOERBQThELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUUsQ0FBQztZQUFDLHVDQUErQixDQUFDLGVBQWUsQ0FBQztnQkFDaEQsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBRS9DLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGdEQUFnRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzlELENBQUM7WUFBQyxzQ0FBaUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xELFVBQVUsRUFBRSxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFFL0MsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDOUMsQ0FBQyxDQUFDLENBQUE7WUFFRixNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RCxDQUFDO1lBQUMsb0NBQStCLENBQUMsZUFBZSxDQUFDO2dCQUNoRCxVQUFVLEVBQUUsS0FBSztnQkFDakIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBRS9DLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQzlDLENBQUMsQ0FBQyxDQUFBO1lBRUYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDckQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDL0QsQ0FBQztZQUFDLGlEQUE0QyxDQUFDLGVBQWUsQ0FBQztnQkFDN0QsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2dCQUNWLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUM5QyxDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1lBQ2pELENBQUM7WUFBQyxpQ0FBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLGFBQWEsRUFBRSxFQUFFO2dCQUNqQix1QkFBdUIsRUFBRSxLQUFLO2FBQy9CLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRyxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtZQUN4RSxNQUFNLFFBQVEsR0FBRztnQkFDZixHQUFHLGdCQUFnQjtnQkFDbkIsRUFBRSxFQUFFLGNBQWM7Z0JBQ2xCLEdBQUcsRUFBRTtvQkFDSCxHQUFHLGdCQUFnQixDQUFDLEdBQUc7b0JBQ3ZCLElBQUksRUFBRSxXQUFXO2lCQUNsQjthQUNGLENBQ0E7WUFBQyxpQ0FBbUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDM0MsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLHlDQUF5QztZQUN6QyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNsRSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNuRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNuRCxNQUFNLElBQUksR0FBRyxFQUFFLEdBQUcsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFBO1lBQ2pELE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQ2hEO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dCQUMzQix1QkFBdUIsRUFBRSxLQUFLO2FBQy9CLENBQUMsQ0FBQTtZQUVGLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFHLENBQUMsQ0FBQTtZQUN4RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFckQsUUFBUSxDQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUcsQ0FBQyxDQUFBO1lBQ3JDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7WUFDdEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLENBQUMsaURBQW1DLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQ3JGLE1BQU0sQ0FBQyxzQ0FBd0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDMUUsTUFBTSxDQUFDLG9DQUFzQixDQUFDLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUN4RSxNQUFNLENBQUMsdUNBQXNCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDbEQsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLGNBQWMsRUFBRSxJQUFJO2FBQ3JCLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtZQUM1RSxDQUFDO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsRUFBRTtnQkFDakIsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUcsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sQ0FBQyxpREFBbUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3RFLE1BQU0sQ0FBQyxzQ0FBd0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzNELE1BQU0sQ0FBQyxvQ0FBc0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3pELE1BQU0sQ0FBQyx1Q0FBc0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO2dCQUNsRCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsY0FBYyxFQUFFLElBQUk7YUFDckIsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxDQUFDO1lBQUMsc0NBQWlDLENBQUMsZUFBZSxDQUFDO2dCQUNsRCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQzthQUMvQixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLDRDQUE0QztZQUM1QyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELENBQUM7WUFBQyxzQ0FBaUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xELFVBQVUsRUFBRSxLQUFLO2dCQUNqQixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDO2FBQ2pDLENBQUMsQ0FDRDtZQUFDLHVDQUErQixDQUFDLGVBQWUsQ0FBQztnQkFDaEQsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQkFDdkIsS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUcsQ0FBQyxDQUFBO1lBQy9DLCtDQUErQztZQUMvQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDNUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMzRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7WUFDakQsQ0FBQztZQUFDLGlDQUFtQixDQUFDLGVBQWUsQ0FBQztnQkFDcEMsYUFBYSxFQUFFLEVBQUU7Z0JBQ2pCLHVCQUF1QixFQUFFLEtBQUs7YUFDL0IsQ0FBQyxDQUNEO1lBQUMsdUNBQStCLENBQUMsZUFBZSxDQUFDO2dCQUNoRCxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQUN2QixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBWSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRyxDQUFDLENBQUE7WUFDN0MsNkNBQTZDO1lBQzdDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxDQUFDO1lBQUMsaUNBQW1CLENBQUMsZUFBZSxDQUFDO2dCQUNwQyxhQUFhLEVBQUUsRUFBRTtnQkFDakIsdUJBQXVCLEVBQUUsS0FBSzthQUMvQixDQUFDLENBQ0Q7WUFBQyxzQ0FBaUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xELFVBQVUsRUFBRSxJQUFJO2dCQUNoQixJQUFJLEVBQUUsSUFBSTtnQkFDVixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQTtZQUVGLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUcsQ0FBQyxDQUFBO1lBQ25FLDBDQUEwQztZQUMxQyxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0IsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2sgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgdHlwZSB7IEluc3RhbGxlZEFwcCBhcyBJbnN0YWxsZWRBcHBUeXBlIH0gZnJvbSAnQC9tb2RlbHMvZXhwbG9yZSdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICd1c2UtY29udGV4dC1zZWxlY3RvcidcblxuaW1wb3J0IHsgdXNlV2ViQXBwU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvd2ViLWFwcC1jb250ZXh0J1xuaW1wb3J0IHsgQWNjZXNzTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2FjY2Vzcy1jb250cm9sJ1xuaW1wb3J0IHsgdXNlR2V0VXNlckNhbkFjY2Vzc0FwcCB9IGZyb20gJ0Avc2VydmljZS9hY2Nlc3MtY29udHJvbCdcbmltcG9ydCB7IHVzZUdldEluc3RhbGxlZEFwcEFjY2Vzc01vZGVCeUFwcElkLCB1c2VHZXRJbnN0YWxsZWRBcHBNZXRhLCB1c2VHZXRJbnN0YWxsZWRBcHBQYXJhbXMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWV4cGxvcmUnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IEluc3RhbGxlZEFwcCBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llcyBCRUZPUkUgaW1wb3J0c1xudmkubW9jaygndXNlLWNvbnRleHQtc2VsZWN0b3InLCAoKSA9PiAoe1xuICB1c2VDb250ZXh0OiB2aS5mbigpLFxuICBjcmVhdGVDb250ZXh0OiB2aS5mbigoKSA9PiAoe30pKSxcbn0pKVxudmkubW9jaygnQC9jb250ZXh0L3dlYi1hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVdlYkFwcFN0b3JlOiB2aS5mbigpLFxufSkpXG52aS5tb2NrKCdAL3NlcnZpY2UvYWNjZXNzLWNvbnRyb2wnLCAoKSA9PiAoe1xuICB1c2VHZXRVc2VyQ2FuQWNjZXNzQXBwOiB2aS5mbigpLFxufSkpXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLWV4cGxvcmUnLCAoKSA9PiAoe1xuICB1c2VHZXRJbnN0YWxsZWRBcHBBY2Nlc3NNb2RlQnlBcHBJZDogdmkuZm4oKSxcbiAgdXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zOiB2aS5mbigpLFxuICB1c2VHZXRJbnN0YWxsZWRBcHBNZXRhOiB2aS5mbigpLFxufSkpXG5cbi8qKlxuICogTW9jayBjaGlsZCBjb21wb25lbnRzIGZvciB1bml0IHRlc3RpbmdcbiAqXG4gKiBSQVRJT05BTEUgRk9SIE1PQ0tJTkc6XG4gKiAtIFRleHRHZW5lcmF0aW9uQXBwOiA2NDggbGluZXMsIGNvbXBsZXggYmF0Y2ggcHJvY2Vzc2luZywgdGFzayBtYW5hZ2VtZW50LCBmaWxlIHVwbG9hZHNcbiAqIC0gQ2hhdFdpdGhIaXN0b3J5OiA1NzYtbGluZSBjdXN0b20gaG9vaywgY29tcGxleCBjb252ZXJzYXRpb24vaGlzdG9yeSBtYW5hZ2VtZW50LCAzMCsgY29udGV4dCB2YWx1ZXNcbiAqXG4gKiBUaGVzZSBjb21wb25lbnRzIGFyZSB0b28gY29tcGxleCB0byB0ZXN0IGFzIHJlYWwgY29tcG9uZW50cy4gVXNpbmcgcmVhbCBjb21wb25lbnRzIHdvdWxkOlxuICogMS4gUmVxdWlyZSBtb2NraW5nIGRvemVucyBvZiB0aGVpciBkZXBlbmRlbmNpZXMgKHNlcnZpY2VzLCBjb250ZXh0cywgaG9va3MpXG4gKiAyLiBNYWtlIHRlc3RzIGZyYWdpbGUgYW5kIGNvdXBsZWQgdG8gY2hpbGQgY29tcG9uZW50IGltcGxlbWVudGF0aW9uIGRldGFpbHNcbiAqIDMuIFZpb2xhdGUgdGhlIHByaW5jaXBsZSBvZiB0ZXN0aW5nIG9uZSBjb21wb25lbnQgaW4gaXNvbGF0aW9uXG4gKlxuICogRm9yIGEgY29udGFpbmVyIGNvbXBvbmVudCBsaWtlIEluc3RhbGxlZEFwcCwgaXRzIHJlc3BvbnNpYmlsaXR5IGlzIHRvOlxuICogLSBDb3JyZWN0bHkgcm91dGUgdG8gdGhlIGFwcHJvcHJpYXRlIGNoaWxkIGNvbXBvbmVudCBiYXNlZCBvbiBhcHAgbW9kZVxuICogLSBQYXNzIHRoZSBjb3JyZWN0IHByb3BzIHRvIGNoaWxkIGNvbXBvbmVudHNcbiAqIC0gSGFuZGxlIGxvYWRpbmcvZXJyb3Igc3RhdGVzIGJlZm9yZSByZW5kZXJpbmcgY2hpbGRyZW5cbiAqXG4gKiBUaGUgaW50ZXJuYWwgbG9naWMgb2YgQ2hhdFdpdGhIaXN0b3J5IGFuZCBUZXh0R2VuZXJhdGlvbkFwcCBzaG91bGQgYmUgdGVzdGVkXG4gKiBpbiB0aGVpciBvd24gZGVkaWNhdGVkIHRlc3QgZmlsZXMuXG4gKi9cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvc2hhcmUvdGV4dC1nZW5lcmF0aW9uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgaXNJbnN0YWxsZWRBcHAsIGluc3RhbGxlZEFwcEluZm8sIGlzV29ya2Zsb3cgfToge1xuICAgIGlzSW5zdGFsbGVkQXBwPzogYm9vbGVhblxuICAgIGluc3RhbGxlZEFwcEluZm8/OiBJbnN0YWxsZWRBcHBUeXBlXG4gICAgaXNXb3JrZmxvdz86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ0ZXh0LWdlbmVyYXRpb24tYXBwXCI+XG4gICAgICBUZXh0IEdlbmVyYXRpb24gQXBwXG4gICAgICB7aXNXb3JrZmxvdyAmJiAnIChXb3JrZmxvdyknfVxuICAgICAge2lzSW5zdGFsbGVkQXBwICYmIGAgLSAke2luc3RhbGxlZEFwcEluZm8/LmlkfWB9XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvY2hhdC13aXRoLWhpc3RvcnknLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBpbnN0YWxsZWRBcHBJbmZvLCBjbGFzc05hbWUgfToge1xuICAgIGluc3RhbGxlZEFwcEluZm8/OiBJbnN0YWxsZWRBcHBUeXBlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2hhdC13aXRoLWhpc3RvcnlcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICBDaGF0IFdpdGggSGlzdG9yeSAtXG4gICAgICB7JyAnfVxuICAgICAge2luc3RhbGxlZEFwcEluZm8/LmlkfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbmRlc2NyaWJlKCdJbnN0YWxsZWRBcHAnLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tVcGRhdGVBcHBJbmZvID0gdmkuZm4oKVxuICBjb25zdCBtb2NrVXBkYXRlV2ViQXBwQWNjZXNzTW9kZSA9IHZpLmZuKClcbiAgY29uc3QgbW9ja1VwZGF0ZUFwcFBhcmFtcyA9IHZpLmZuKClcbiAgY29uc3QgbW9ja1VwZGF0ZVdlYkFwcE1ldGEgPSB2aS5mbigpXG4gIGNvbnN0IG1vY2tVcGRhdGVVc2VyQ2FuQWNjZXNzQXBwID0gdmkuZm4oKVxuXG4gIGNvbnN0IG1vY2tJbnN0YWxsZWRBcHAgPSB7XG4gICAgaWQ6ICdpbnN0YWxsZWQtYXBwLTEyMycsXG4gICAgYXBwOiB7XG4gICAgICBpZDogJ2FwcC0xMjMnLFxuICAgICAgbmFtZTogJ1Rlc3QgQXBwJyxcbiAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gICAgICBpY29uX3R5cGU6ICdlbW9qaScgYXMgY29uc3QsXG4gICAgICBpY29uOiAn8J+agCcsXG4gICAgICBpY29uX2JhY2tncm91bmQ6ICcjRkZGRkZGJyxcbiAgICAgIGljb25fdXJsOiAnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gICAgICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gICAgfSxcbiAgICB1bmluc3RhbGxhYmxlOiB0cnVlLFxuICAgIGlzX3Bpbm5lZDogZmFsc2UsXG4gIH1cblxuICBjb25zdCBtb2NrQXBwUGFyYW1zID0ge1xuICAgIHVzZXJfaW5wdXRfZm9ybTogW10sXG4gICAgZmlsZV91cGxvYWQ6IHsgaW1hZ2U6IHsgZW5hYmxlZDogZmFsc2UsIG51bWJlcl9saW1pdHM6IDAsIHRyYW5zZmVyX21ldGhvZHM6IFtdIH0gfSxcbiAgICBzeXN0ZW1fcGFyYW1ldGVyczoge30sXG4gIH1cblxuICBjb25zdCBtb2NrQXBwTWV0YSA9IHtcbiAgICB0b29sX2ljb25zOiB7fSxcbiAgfVxuXG4gIGNvbnN0IG1vY2tXZWJBcHBBY2Nlc3NNb2RlID0ge1xuICAgIGFjY2Vzc01vZGU6IEFjY2Vzc01vZGUuUFVCTElDLFxuICB9XG5cbiAgY29uc3QgbW9ja1VzZXJDYW5BY2Nlc3NBcHAgPSB7XG4gICAgcmVzdWx0OiB0cnVlLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG5cbiAgICAvLyBNb2NrIHVzZUNvbnRleHRcbiAgICA7KHVzZUNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGluc3RhbGxlZEFwcHM6IFttb2NrSW5zdGFsbGVkQXBwXSxcbiAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgLy8gTW9jayB1c2VXZWJBcHBTdG9yZVxuICAgIDsodXNlV2ViQXBwU3RvcmUgYXMgdW5rbm93biBhcyBNb2NrKS5tb2NrSW1wbGVtZW50YXRpb24oKFxuICAgICAgc2VsZWN0b3I6IChzdGF0ZToge1xuICAgICAgICB1cGRhdGVBcHBJbmZvOiBNb2NrXG4gICAgICAgIHVwZGF0ZVdlYkFwcEFjY2Vzc01vZGU6IE1vY2tcbiAgICAgICAgdXBkYXRlQXBwUGFyYW1zOiBNb2NrXG4gICAgICAgIHVwZGF0ZVdlYkFwcE1ldGE6IE1vY2tcbiAgICAgICAgdXBkYXRlVXNlckNhbkFjY2Vzc0FwcDogTW9ja1xuICAgICAgfSkgPT4gdW5rbm93bixcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICB1cGRhdGVBcHBJbmZvOiBtb2NrVXBkYXRlQXBwSW5mbyxcbiAgICAgICAgdXBkYXRlV2ViQXBwQWNjZXNzTW9kZTogbW9ja1VwZGF0ZVdlYkFwcEFjY2Vzc01vZGUsXG4gICAgICAgIHVwZGF0ZUFwcFBhcmFtczogbW9ja1VwZGF0ZUFwcFBhcmFtcyxcbiAgICAgICAgdXBkYXRlV2ViQXBwTWV0YTogbW9ja1VwZGF0ZVdlYkFwcE1ldGEsXG4gICAgICAgIHVwZGF0ZVVzZXJDYW5BY2Nlc3NBcHA6IG1vY2tVcGRhdGVVc2VyQ2FuQWNjZXNzQXBwLFxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yKHN0YXRlKVxuICAgIH0pXG5cbiAgICAvLyBNb2NrIHNlcnZpY2UgaG9va3Mgd2l0aCBkZWZhdWx0IHN1Y2Nlc3Mgc3RhdGVzXG4gICAgOyh1c2VHZXRJbnN0YWxsZWRBcHBBY2Nlc3NNb2RlQnlBcHBJZCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICBkYXRhOiBtb2NrV2ViQXBwQWNjZXNzTW9kZSxcbiAgICAgIGVycm9yOiBudWxsLFxuICAgIH0pXG5cbiAgICA7KHVzZUdldEluc3RhbGxlZEFwcFBhcmFtcyBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICBkYXRhOiBtb2NrQXBwUGFyYW1zLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwTWV0YSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICBkYXRhOiBtb2NrQXBwTWV0YSxcbiAgICAgIGVycm9yOiBudWxsLFxuICAgIH0pXG5cbiAgICA7KHVzZUdldFVzZXJDYW5BY2Nlc3NBcHAgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGRhdGE6IG1vY2tVc2VyQ2FuQWNjZXNzQXBwLFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2hhdCBXaXRoIEhpc3RvcnkvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBzdGF0ZSB3aGVuIGZldGNoaW5nIGFwcCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICA7KHVzZUdldEluc3RhbGxlZEFwcFBhcmFtcyBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpc0ZldGNoaW5nOiB0cnVlLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBjb25zdCBzdmcgPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnLnNwaW4tYW5pbWF0aW9uJylcbiAgICAgIGV4cGVjdChzdmcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBzdGF0ZSB3aGVuIGZldGNoaW5nIGFwcCBtZXRhJywgKCkgPT4ge1xuICAgICAgOyh1c2VHZXRJbnN0YWxsZWRBcHBNZXRhIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcuc3Bpbi1hbmltYXRpb24nKVxuICAgICAgZXhwZWN0KHN2ZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb2FkaW5nIHN0YXRlIHdoZW4gZmV0Y2hpbmcgd2ViIGFwcCBhY2Nlc3MgbW9kZScsICgpID0+IHtcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwQWNjZXNzTW9kZUJ5QXBwSWQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNGZXRjaGluZzogdHJ1ZSxcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgY29uc3Qgc3ZnID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2Zy5zcGluLWFuaW1hdGlvbicpXG4gICAgICBleHBlY3Qoc3ZnKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc3RhdGUgd2hlbiBmZXRjaGluZyBpbnN0YWxsZWQgYXBwcycsICgpID0+IHtcbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbbW9ja0luc3RhbGxlZEFwcF0sXG4gICAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcuc3Bpbi1hbmltYXRpb24nKVxuICAgICAgZXhwZWN0KHN2ZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhcHAgbm90IGZvdW5kICg0MDQpIHdoZW4gaW5zdGFsbGVkQXBwIGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgOyh1c2VDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEFwcHM6IFtdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cIm5vbmV4aXN0ZW50LWFwcFwiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzQwNC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRXJyb3IgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGVycm9yIHdoZW4gYXBwIHBhcmFtcyBmYWlscyB0byBsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGFwcCBwYXJhbXMnKVxuICAgICAgOyh1c2VHZXRJbnN0YWxsZWRBcHBQYXJhbXMgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0ZhaWxlZCB0byBsb2FkIGFwcCBwYXJhbXMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlcnJvciB3aGVuIGFwcCBtZXRhIGZhaWxzIHRvIGxvYWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignRmFpbGVkIHRvIGxvYWQgYXBwIG1ldGEnKVxuICAgICAgOyh1c2VHZXRJbnN0YWxsZWRBcHBNZXRhIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcixcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9GYWlsZWQgdG8gbG9hZCBhcHAgbWV0YS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGVycm9yIHdoZW4gd2ViIGFwcCBhY2Nlc3MgbW9kZSBmYWlscyB0byBsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGFjY2VzcyBtb2RlJylcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwQWNjZXNzTW9kZUJ5QXBwSWQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0ZhaWxlZCB0byBsb2FkIGFjY2VzcyBtb2RlLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZXJyb3Igd2hlbiB1c2VyIGFjY2VzcyBjaGVjayBmYWlscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdGYWlsZWQgdG8gY2hlY2sgdXNlciBhY2Nlc3MnKVxuICAgICAgOyh1c2VHZXRVc2VyQ2FuQWNjZXNzQXBwIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0ZhaWxlZCB0byBjaGVjayB1c2VyIGFjY2Vzcy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5vIHBlcm1pc3Npb24gKDQwMykgd2hlbiB1c2VyIGNhbm5vdCBhY2Nlc3MgYXBwJywgKCkgPT4ge1xuICAgICAgOyh1c2VHZXRVc2VyQ2FuQWNjZXNzQXBwIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVzdWx0OiBmYWxzZSB9LFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC80MDMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL25vIHBlcm1pc3Npb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBcHAgTW9kZSBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgQ2hhdFdpdGhIaXN0b3J5IGZvciBDSEFUIG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2hhdCBXaXRoIEhpc3RvcnkvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL1RleHQgR2VuZXJhdGlvbiBBcHAvaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIENoYXRXaXRoSGlzdG9yeSBmb3IgQURWQU5DRURfQ0hBVCBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWR2YW5jZWRDaGF0QXBwID0ge1xuICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLmFwcCxcbiAgICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFULFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgOyh1c2VDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEFwcHM6IFthZHZhbmNlZENoYXRBcHBdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2hhdCBXaXRoIEhpc3RvcnkvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL1RleHQgR2VuZXJhdGlvbiBBcHAvaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIENoYXRXaXRoSGlzdG9yeSBmb3IgQUdFTlRfQ0hBVCBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYWdlbnRDaGF0QXBwID0ge1xuICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLmFwcCxcbiAgICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5BR0VOVF9DSEFULFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgOyh1c2VDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEFwcHM6IFthZ2VudENoYXRBcHBdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2hhdCBXaXRoIEhpc3RvcnkvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL1RleHQgR2VuZXJhdGlvbiBBcHAvaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRleHRHZW5lcmF0aW9uQXBwIGZvciBDT01QTEVUSU9OIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb21wbGV0aW9uQXBwID0ge1xuICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLmFwcCxcbiAgICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DT01QTEVUSU9OLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgOyh1c2VDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEFwcHM6IFtjb21wbGV0aW9uQXBwXSxcbiAgICAgICAgaXNGZXRjaGluZ0luc3RhbGxlZEFwcHM6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1RleHQgR2VuZXJhdGlvbiBBcHAvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL1dvcmtmbG93LykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRleHRHZW5lcmF0aW9uQXBwIHdpdGggd29ya2Zsb3cgZmxhZyBmb3IgV09SS0ZMT1cgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHdvcmtmbG93QXBwID0ge1xuICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLmFwcCxcbiAgICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5XT1JLRkxPVyxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbd29ya2Zsb3dBcHBdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvVGV4dCBHZW5lcmF0aW9uIEFwcC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1dvcmtmbG93LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBpZCBwcm9wIHRvIGZpbmQgaW5zdGFsbGVkIGFwcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcDEgPSB7IC4uLm1vY2tJbnN0YWxsZWRBcHAsIGlkOiAnYXBwLTEnIH1cbiAgICAgIGNvbnN0IGFwcDIgPSB7IC4uLm1vY2tJbnN0YWxsZWRBcHAsIGlkOiAnYXBwLTInIH1cbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbYXBwMSwgYXBwMl0sXG4gICAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiYXBwLTJcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hcHAtMi8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGlkIHRoYXQgZG9lcyBub3QgbWF0Y2ggYW55IGluc3RhbGxlZCBhcHAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cIm5vbmV4aXN0ZW50LWlkXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvNDA0LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZmZlY3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIGFwcCBpbmZvIHdoZW4gaW5zdGFsbGVkQXBwIGlzIGF2YWlsYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQXBwSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgYXBwX2lkOiAnaW5zdGFsbGVkLWFwcC0xMjMnLFxuICAgICAgICAgICAgc2l0ZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICB0aXRsZTogJ1Rlc3QgQXBwJyxcbiAgICAgICAgICAgICAgaWNvbl90eXBlOiAnZW1vamknLFxuICAgICAgICAgICAgICBpY29uOiAn8J+agCcsXG4gICAgICAgICAgICAgIGljb25fYmFja2dyb3VuZDogJyNGRkZGRkYnLFxuICAgICAgICAgICAgICBpY29uX3VybDogJycsXG4gICAgICAgICAgICAgIHByb21wdF9wdWJsaWM6IGZhbHNlLFxuICAgICAgICAgICAgICBjb3B5cmlnaHQ6ICcnLFxuICAgICAgICAgICAgICBzaG93X3dvcmtmbG93X3N0ZXBzOiB0cnVlLFxuICAgICAgICAgICAgICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHBsYW46ICdiYXNpYycsXG4gICAgICAgICAgICBjdXN0b21fY29uZmlnOiBudWxsLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBhcHAgaW5mbyB0byBudWxsIHdoZW4gaW5zdGFsbGVkQXBwIGlzIG5vdCBmb3VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbXSxcbiAgICAgICAgaXNGZXRjaGluZ0luc3RhbGxlZEFwcHM6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJub25leGlzdGVudC1hcHBcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQXBwSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGgobnVsbClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGFwcCBwYXJhbXMgd2hlbiBkYXRhIGlzIGF2YWlsYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQXBwUGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2NrQXBwUGFyYW1zKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgYXBwIG1ldGEgd2hlbiBkYXRhIGlzIGF2YWlsYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlV2ViQXBwTWV0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9ja0FwcE1ldGEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3ZWIgYXBwIGFjY2VzcyBtb2RlIHdoZW4gZGF0YSBpcyBhdmFpbGFibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VwZGF0ZVdlYkFwcEFjY2Vzc01vZGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEFjY2Vzc01vZGUuUFVCTElDKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdXNlciBjYW4gYWNjZXNzIGFwcCB3aGVuIGRhdGEgaXMgYXZhaWxhYmxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVcGRhdGVVc2VyQ2FuQWNjZXNzQXBwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdXNlciBjYW4gYWNjZXNzIGFwcCB0byBmYWxzZSB3aGVuIHJlc3VsdCBpcyBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIDsodXNlR2V0VXNlckNhbkFjY2Vzc0FwcCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlc3VsdDogZmFsc2UgfSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VwZGF0ZVVzZXJDYW5BY2Nlc3NBcHApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdXNlciBjYW4gYWNjZXNzIGFwcCB0byBmYWxzZSB3aGVuIGRhdGEgaXMgbnVsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIDsodXNlR2V0VXNlckNhbkFjY2Vzc0FwcCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlVXNlckNhbkFjY2Vzc0FwcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB1cGRhdGUgYXBwIHBhcmFtcyB3aGVuIGRhdGEgaXMgbnVsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQXBwSW5mbykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja1VwZGF0ZUFwcFBhcmFtcykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB1cGRhdGUgYXBwIG1ldGEgd2hlbiBkYXRhIGlzIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICA7KHVzZUdldEluc3RhbGxlZEFwcE1ldGEgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVcGRhdGVBcHBJbmZvKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrVXBkYXRlV2ViQXBwTWV0YSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB1cGRhdGUgYWNjZXNzIG1vZGUgd2hlbiBkYXRhIGlzIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICA7KHVzZUdldEluc3RhbGxlZEFwcEFjY2Vzc01vZGVCeUFwcElkIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQXBwSW5mbykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja1VwZGF0ZVdlYkFwcEFjY2Vzc01vZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGluc3RhbGxlZEFwcHMgYXJyYXknLCAoKSA9PiB7XG4gICAgICA7KHVzZUNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkQXBwczogW10sXG4gICAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC80MDQvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBpbnN0YWxsZWQgYXBwcyBhbmQgZmluZCB0aGUgY29ycmVjdCBvbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdGhlckFwcCA9IHtcbiAgICAgICAgLi4ubW9ja0luc3RhbGxlZEFwcCxcbiAgICAgICAgaWQ6ICdvdGhlci1hcHAtaWQnLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrSW5zdGFsbGVkQXBwLmFwcCxcbiAgICAgICAgICBuYW1lOiAnT3RoZXIgQXBwJyxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbb3RoZXJBcHAsIG1vY2tJbnN0YWxsZWRBcHBdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImluc3RhbGxlZC1hcHAtMTIzXCIgLz4pXG4gICAgICAvLyBTaG91bGQgZmluZCBhbmQgcmVuZGVyIHRoZSBjb3JyZWN0IGFwcFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NoYXQgV2l0aCBIaXN0b3J5L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvaW5zdGFsbGVkLWFwcC0xMjMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBpZCBwcm9wIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAxID0geyAuLi5tb2NrSW5zdGFsbGVkQXBwLCBpZDogJ2FwcC0xJyB9XG4gICAgICBjb25zdCBhcHAyID0geyAuLi5tb2NrSW5zdGFsbGVkQXBwLCBpZDogJ2FwcC0yJyB9XG4gICAgICA7KHVzZUNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkQXBwczogW2FwcDEsIGFwcDJdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cImFwcC0xXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYXBwLTEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiYXBwLTJcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hcHAtMi8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBzZXJ2aWNlIGhvb2tzIHdpdGggY29ycmVjdCBhcHBJZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcblxuICAgICAgZXhwZWN0KHVzZUdldEluc3RhbGxlZEFwcEFjY2Vzc01vZGVCeUFwcElkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaW5zdGFsbGVkLWFwcC0xMjMnKVxuICAgICAgZXhwZWN0KHVzZUdldEluc3RhbGxlZEFwcFBhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2luc3RhbGxlZC1hcHAtMTIzJylcbiAgICAgIGV4cGVjdCh1c2VHZXRJbnN0YWxsZWRBcHBNZXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaW5zdGFsbGVkLWFwcC0xMjMnKVxuICAgICAgZXhwZWN0KHVzZUdldFVzZXJDYW5BY2Nlc3NBcHApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgYXBwSWQ6ICdhcHAtMTIzJyxcbiAgICAgICAgaXNJbnN0YWxsZWRBcHA6IHRydWUsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2VydmljZSBob29rcyB3aXRoIG51bGwgd2hlbiBpbnN0YWxsZWRBcHAgaXMgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgOyh1c2VDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEFwcHM6IFtdLFxuICAgICAgICBpc0ZldGNoaW5nSW5zdGFsbGVkQXBwczogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxlZEFwcCBpZD1cIm5vbmV4aXN0ZW50LWFwcFwiIC8+KVxuXG4gICAgICBleHBlY3QodXNlR2V0SW5zdGFsbGVkQXBwQWNjZXNzTW9kZUJ5QXBwSWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG51bGwpXG4gICAgICBleHBlY3QodXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChudWxsKVxuICAgICAgZXhwZWN0KHVzZUdldEluc3RhbGxlZEFwcE1ldGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG51bGwpXG4gICAgICBleHBlY3QodXNlR2V0VXNlckNhbkFjY2Vzc0FwcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBhcHBJZDogdW5kZWZpbmVkLFxuICAgICAgICBpc0luc3RhbGxlZEFwcDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyIFByaW9yaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBiZWZvcmUgbG9hZGluZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yOiBuZXcgRXJyb3IoJ1NvbWUgZXJyb3InKSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwiaW5zdGFsbGVkLWFwcC0xMjNcIiAvPilcbiAgICAgIC8vIEVycm9yIHNob3VsZCB0YWtlIHByZWNlZGVuY2Ugb3ZlciBsb2FkaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvU29tZSBlcnJvci8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBiZWZvcmUgcGVybWlzc2lvbiBjaGVjaycsICgpID0+IHtcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICBlcnJvcjogbmV3IEVycm9yKCdQYXJhbXMgZXJyb3InKSxcbiAgICAgIH0pXG4gICAgICA7KHVzZUdldFVzZXJDYW5BY2Nlc3NBcHAgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyByZXN1bHQ6IGZhbHNlIH0sXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJpbnN0YWxsZWQtYXBwLTEyM1wiIC8+KVxuICAgICAgLy8gRXJyb3Igc2hvdWxkIHRha2UgcHJlY2VkZW5jZSBvdmVyIHBlcm1pc3Npb25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9QYXJhbXMgZXJyb3IvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvNDAzLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBwZXJtaXNzaW9uIGVycm9yIGJlZm9yZSA0MDQnLCAoKSA9PiB7XG4gICAgICA7KHVzZUNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkQXBwczogW10sXG4gICAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICA7KHVzZUdldFVzZXJDYW5BY2Nlc3NBcHAgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyByZXN1bHQ6IGZhbHNlIH0sXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWRBcHAgaWQ9XCJub25leGlzdGVudC1hcHBcIiAvPilcbiAgICAgIC8vIFBlcm1pc3Npb24gc2hvdWxkIHRha2UgcHJlY2VkZW5jZSBvdmVyIDQwNFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzQwMy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC80MDQvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgYmVmb3JlIDQwNCcsICgpID0+IHtcbiAgICAgIDsodXNlQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRBcHBzOiBbXSxcbiAgICAgICAgaXNGZXRjaGluZ0luc3RhbGxlZEFwcHM6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIDsodXNlR2V0SW5zdGFsbGVkQXBwUGFyYW1zIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SW5zdGFsbGVkQXBwIGlkPVwibm9uZXhpc3RlbnQtYXBwXCIgLz4pXG4gICAgICAvLyBMb2FkaW5nIHNob3VsZCB0YWtlIHByZWNlZGVuY2Ugb3ZlciA0MDRcbiAgICAgIGNvbnN0IHN2ZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcuc3Bpbi1hbmltYXRpb24nKVxuICAgICAgZXhwZWN0KHN2ZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvNDA0LykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=