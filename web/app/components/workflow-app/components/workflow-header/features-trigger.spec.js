"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const toast_1 = require("@/app/components/base/toast");
const type_1 = require("@/app/components/billing/type");
const types_1 = require("@/app/components/workflow/types");
const features_trigger_1 = require("./features-trigger");
const mockUseIsChatMode = vi.fn();
const mockUseTheme = vi.fn();
const mockUseNodesReadOnly = vi.fn();
const mockUseChecklist = vi.fn();
const mockUseChecklistBeforePublish = vi.fn();
const mockUseNodesSyncDraft = vi.fn();
const mockUseFeatures = vi.fn();
const mockUseProviderContext = vi.fn();
const mockUseNodes = vi.fn();
const mockUseEdges = vi.fn();
const mockUseAppStoreSelector = vi.fn();
const mockNotify = vi.fn();
const mockHandleCheckBeforePublish = vi.fn();
const mockHandleSyncWorkflowDraft = vi.fn();
const mockPublishWorkflow = vi.fn();
const mockUpdatePublishedWorkflow = vi.fn();
const mockResetWorkflowVersionHistory = vi.fn();
const mockInvalidateAppTriggers = vi.fn();
const mockFetchAppDetail = vi.fn();
const mockSetAppDetail = vi.fn();
const mockSetPublishedAt = vi.fn();
const mockSetLastPublishedHasUserInput = vi.fn();
const mockWorkflowStoreSetState = vi.fn();
const mockWorkflowStoreSetShowFeaturesPanel = vi.fn();
let workflowStoreState = {
    showFeaturesPanel: false,
    isRestoring: false,
    setShowFeaturesPanel: mockWorkflowStoreSetShowFeaturesPanel,
    setPublishedAt: mockSetPublishedAt,
    setLastPublishedHasUserInput: mockSetLastPublishedHasUserInput,
};
const mockWorkflowStore = {
    getState: () => workflowStoreState,
    setState: mockWorkflowStoreSetState,
};
vi.mock('@/app/components/workflow/hooks', () => ({
    useChecklist: (...args) => mockUseChecklist(...args),
    useChecklistBeforePublish: () => mockUseChecklistBeforePublish(),
    useNodesReadOnly: () => mockUseNodesReadOnly(),
    useNodesSyncDraft: () => mockUseNodesSyncDraft(),
    useIsChatMode: () => mockUseIsChatMode(),
}));
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            publishedAt: null,
            draftUpdatedAt: null,
            toolPublished: false,
            lastPublishedHasUserInput: false,
        };
        return selector(state);
    },
    useWorkflowStore: () => mockWorkflowStore,
}));
vi.mock('@/app/components/base/features/hooks', () => ({
    useFeatures: (selector) => mockUseFeatures(selector),
}));
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => mockUseProviderContext(),
}));
vi.mock('@/app/components/workflow/store/workflow/use-nodes', () => ({
    default: () => mockUseNodes(),
}));
vi.mock('reactflow', () => ({
    useEdges: () => mockUseEdges(),
}));
vi.mock('@/app/components/app/app-publisher', () => ({
    default: (props) => {
        const inputs = props.inputs ?? [];
        return (<div data-testid="app-publisher" data-disabled={String(Boolean(props.disabled))} data-publish-disabled={String(Boolean(props.publishDisabled))} data-start-node-limit-exceeded={String(Boolean(props.startNodeLimitExceeded))} data-has-trigger-node={String(Boolean(props.hasTriggerNode))} data-inputs={JSON.stringify(inputs)}>
        <button type="button" onClick={() => { props.onRefreshData?.(); }}>
          publisher-refresh
        </button>
        <button type="button" onClick={() => { props.onToggle?.(true); }}>
          publisher-toggle-on
        </button>
        <button type="button" onClick={() => { props.onToggle?.(false); }}>
          publisher-toggle-off
        </button>
        <button type="button" onClick={() => { Promise.resolve(props.onPublish?.()).catch(() => undefined); }}>
          publisher-publish
        </button>
        <button type="button" onClick={() => { Promise.resolve(props.onPublish?.({ title: 'Test title', releaseNotes: 'Test notes' })).catch(() => undefined); }}>
          publisher-publish-with-params
        </button>
      </div>);
    },
}));
vi.mock('@/service/use-workflow', () => ({
    useInvalidateAppWorkflow: () => mockUpdatePublishedWorkflow,
    usePublishWorkflow: () => ({ mutateAsync: mockPublishWorkflow }),
    useResetWorkflowVersionHistory: () => mockResetWorkflowVersionHistory,
}));
vi.mock('@/service/use-tools', () => ({
    useInvalidateAppTriggers: () => mockInvalidateAppTriggers,
}));
vi.mock('@/service/apps', () => ({
    fetchAppDetail: (...args) => mockFetchAppDetail(...args),
}));
vi.mock('@/hooks/use-theme', () => ({
    default: () => mockUseTheme(),
}));
vi.mock('@/app/components/app/store', () => ({
    useStore: (selector) => mockUseAppStoreSelector(selector),
}));
const createProviderContext = ({ type = type_1.Plan.sandbox, isFetchedPlan = true, }) => ({
    plan: { type },
    isFetchedPlan,
});
const renderWithToast = (ui) => {
    return (0, react_1.render)(<toast_1.ToastContext.Provider value={{ notify: mockNotify, close: vi.fn() }}>
      {ui}
    </toast_1.ToastContext.Provider>);
};
describe('FeaturesTrigger', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        workflowStoreState = {
            showFeaturesPanel: false,
            isRestoring: false,
            setShowFeaturesPanel: mockWorkflowStoreSetShowFeaturesPanel,
            setPublishedAt: mockSetPublishedAt,
            setLastPublishedHasUserInput: mockSetLastPublishedHasUserInput,
        };
        mockUseTheme.mockReturnValue({ theme: 'light' });
        mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: false, getNodesReadOnly: () => false });
        mockUseChecklist.mockReturnValue([]);
        mockUseChecklistBeforePublish.mockReturnValue({ handleCheckBeforePublish: mockHandleCheckBeforePublish });
        mockHandleCheckBeforePublish.mockResolvedValue(true);
        mockUseNodesSyncDraft.mockReturnValue({ handleSyncWorkflowDraft: mockHandleSyncWorkflowDraft });
        mockUseFeatures.mockImplementation((selector) => selector({ features: { file: {} } }));
        mockUseProviderContext.mockReturnValue(createProviderContext({}));
        mockUseNodes.mockReturnValue([]);
        mockUseEdges.mockReturnValue([]);
        mockUseAppStoreSelector.mockImplementation(selector => selector({ appDetail: { id: 'app-id' }, setAppDetail: mockSetAppDetail }));
        mockFetchAppDetail.mockResolvedValue({ id: 'app-id' });
        mockPublishWorkflow.mockResolvedValue({ created_at: '2024-01-01T00:00:00Z' });
    });
    // Verifies the feature toggle button only appears in chatflow mode.
    describe('Rendering', () => {
        it('should not render the features button when not in chat mode', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(false);
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            expect(react_1.screen.queryByRole('button', { name: /workflow\.common\.features/i })).not.toBeInTheDocument();
        });
        it('should render the features button when in chat mode', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(true);
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /workflow\.common\.features/i })).toBeInTheDocument();
        });
        it('should apply dark theme styling when theme is dark', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(true);
            mockUseTheme.mockReturnValue({ theme: 'dark' });
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /workflow\.common\.features/i })).toHaveClass('rounded-lg');
        });
    });
    // Verifies user clicks toggle the features panel visibility.
    describe('User Interactions', () => {
        it('should toggle features panel when clicked and nodes are editable', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUseIsChatMode.mockReturnValue(true);
            mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: false, getNodesReadOnly: () => false });
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: /workflow\.common\.features/i }));
            // Assert
            expect(mockWorkflowStoreSetShowFeaturesPanel).toHaveBeenCalledWith(true);
        });
    });
    // Covers read-only gating that prevents toggling unless restoring.
    describe('Edge Cases', () => {
        it('should not toggle features panel when nodes are read-only and not restoring', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUseIsChatMode.mockReturnValue(true);
            mockUseNodesReadOnly.mockReturnValue({ nodesReadOnly: true, getNodesReadOnly: () => true });
            workflowStoreState = {
                ...workflowStoreState,
                isRestoring: false,
            };
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: /workflow\.common\.features/i }));
            // Assert
            expect(mockWorkflowStoreSetShowFeaturesPanel).not.toHaveBeenCalled();
        });
    });
    // Verifies the publisher reflects the presence of workflow nodes.
    describe('Props', () => {
        it('should disable AppPublisher when there are no workflow nodes', () => {
            // Arrange
            mockUseIsChatMode.mockReturnValue(false);
            mockUseNodes.mockReturnValue([]);
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('app-publisher')).toHaveAttribute('data-disabled', 'true');
        });
    });
    // Verifies derived props passed into AppPublisher (variables, limits, and triggers).
    describe('Computed Props', () => {
        it('should append image input when file image upload is enabled', () => {
            // Arrange
            mockUseFeatures.mockImplementation((selector) => selector({
                features: { file: { image: { enabled: true } } },
            }));
            mockUseNodes.mockReturnValue([
                { id: 'start', data: { type: types_1.BlockEnum.Start } },
            ]);
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            const inputs = JSON.parse(react_1.screen.getByTestId('app-publisher').getAttribute('data-inputs') ?? '[]');
            expect(inputs).toContainEqual({
                type: types_1.InputVarType.files,
                variable: '__image',
                required: false,
                label: 'files',
            });
        });
        it('should set startNodeLimitExceeded when sandbox entry limit is exceeded', () => {
            // Arrange
            mockUseNodes.mockReturnValue([
                { id: 'start', data: { type: types_1.BlockEnum.Start } },
                { id: 'trigger-1', data: { type: types_1.BlockEnum.TriggerWebhook } },
                { id: 'trigger-2', data: { type: types_1.BlockEnum.TriggerSchedule } },
                { id: 'end', data: { type: types_1.BlockEnum.End } },
            ]);
            // Act
            renderWithToast(<features_trigger_1.default />);
            // Assert
            const publisher = react_1.screen.getByTestId('app-publisher');
            expect(publisher).toHaveAttribute('data-start-node-limit-exceeded', 'true');
            expect(publisher).toHaveAttribute('data-publish-disabled', 'true');
            expect(publisher).toHaveAttribute('data-has-trigger-node', 'true');
        });
    });
    // Verifies callbacks wired from AppPublisher to stores and draft syncing.
    describe('Callbacks', () => {
        it('should set toolPublished when AppPublisher refreshes data', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-refresh' }));
            // Assert
            expect(mockWorkflowStoreSetState).toHaveBeenCalledWith({ toolPublished: true });
        });
        it('should sync workflow draft when AppPublisher toggles on', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-toggle-on' }));
            // Assert
            expect(mockHandleSyncWorkflowDraft).toHaveBeenCalledWith(true);
        });
        it('should not sync workflow draft when AppPublisher toggles off', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-toggle-off' }));
            // Assert
            expect(mockHandleSyncWorkflowDraft).not.toHaveBeenCalled();
        });
    });
    // Verifies publishing behavior across warnings, validation, and success.
    describe('Publishing', () => {
        it('should notify error and reject publish when checklist has warning nodes', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUseChecklist.mockReturnValue([{ id: 'warning' }]);
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-publish' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith({ type: 'error', message: 'workflow.panel.checklistTip' });
            });
            expect(mockPublishWorkflow).not.toHaveBeenCalled();
        });
        it('should reject publish when checklist before publish fails', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockHandleCheckBeforePublish.mockResolvedValue(false);
            renderWithToast(<features_trigger_1.default />);
            // Act & Assert
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-publish' }));
            await (0, react_1.waitFor)(() => {
                expect(mockHandleCheckBeforePublish).toHaveBeenCalled();
            });
            expect(mockPublishWorkflow).not.toHaveBeenCalled();
        });
        it('should publish workflow and update related stores when validation passes', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUseNodes.mockReturnValue([
                { id: 'start', data: { type: types_1.BlockEnum.Start } },
            ]);
            mockUseEdges.mockReturnValue([
                { source: 'start' },
            ]);
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-publish' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockPublishWorkflow).toHaveBeenCalledWith({
                    url: '/apps/app-id/workflows/publish',
                    title: '',
                    releaseNotes: '',
                });
                expect(mockUpdatePublishedWorkflow).toHaveBeenCalledWith('app-id');
                expect(mockInvalidateAppTriggers).toHaveBeenCalledWith('app-id');
                expect(mockSetPublishedAt).toHaveBeenCalledWith('2024-01-01T00:00:00Z');
                expect(mockSetLastPublishedHasUserInput).toHaveBeenCalledWith(true);
                expect(mockResetWorkflowVersionHistory).toHaveBeenCalled();
                expect(mockNotify).toHaveBeenCalledWith({ type: 'success', message: 'common.api.actionSuccess' });
                expect(mockFetchAppDetail).toHaveBeenCalledWith({ url: '/apps', id: 'app-id' });
                expect(mockSetAppDetail).toHaveBeenCalled();
            });
        });
        it('should pass publish params to workflow publish mutation', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-publish-with-params' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockPublishWorkflow).toHaveBeenCalledWith({
                    url: '/apps/app-id/workflows/publish',
                    title: 'Test title',
                    releaseNotes: 'Test notes',
                });
            });
        });
        it('should log error when app detail refresh fails after publish', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            mockFetchAppDetail.mockRejectedValue(new Error('fetch failed'));
            renderWithToast(<features_trigger_1.default />);
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'publisher-publish' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(consoleErrorSpy).toHaveBeenCalled();
            });
            consoleErrorSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZXMtdHJpZ2dlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmVhdHVyZXMtdHJpZ2dlci5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtEQUFnRTtBQUNoRSw0REFBbUQ7QUFDbkQsdURBQTBEO0FBQzFELHdEQUFvRDtBQUNwRCwyREFBeUU7QUFDekUseURBQWdEO0FBRWhELE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2pDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM1QixNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNwQyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNoQyxNQUFNLDZCQUE2QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM3QyxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNyQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDL0IsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDdEMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzVCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM1QixNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUV2QyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsTUFBTSw0QkFBNEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDNUMsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDM0MsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMs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WUFDRixlQUFlLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSZWFjdEVsZW1lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgQXBwUHVibGlzaGVyUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9hcHAtcHVibGlzaGVyJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgeyBUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBQbGFuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBCbG9ja0VudW0sIElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgRmVhdHVyZXNUcmlnZ2VyIGZyb20gJy4vZmVhdHVyZXMtdHJpZ2dlcidcblxuY29uc3QgbW9ja1VzZUlzQ2hhdE1vZGUgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlVGhlbWUgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlTm9kZXNSZWFkT25seSA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VDaGVja2xpc3QgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlQ2hlY2tsaXN0QmVmb3JlUHVibGlzaCA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VOb2Rlc1N5bmNEcmFmdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VGZWF0dXJlcyA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VQcm92aWRlckNvbnRleHQgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlTm9kZXMgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlRWRnZXMgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlQXBwU3RvcmVTZWxlY3RvciA9IHZpLmZuKClcblxuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbmNvbnN0IG1vY2tIYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2ggPSB2aS5mbigpXG5jb25zdCBtb2NrSGFuZGxlU3luY1dvcmtmbG93RHJhZnQgPSB2aS5mbigpXG5jb25zdCBtb2NrUHVibGlzaFdvcmtmbG93ID0gdmkuZm4oKVxuY29uc3QgbW9ja1VwZGF0ZVB1Ymxpc2hlZFdvcmtmbG93ID0gdmkuZm4oKVxuY29uc3QgbW9ja1Jlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSA9IHZpLmZuKClcbmNvbnN0IG1vY2tJbnZhbGlkYXRlQXBwVHJpZ2dlcnMgPSB2aS5mbigpXG5jb25zdCBtb2NrRmV0Y2hBcHBEZXRhaWwgPSB2aS5mbigpXG5jb25zdCBtb2NrU2V0QXBwRGV0YWlsID0gdmkuZm4oKVxuY29uc3QgbW9ja1NldFB1Ymxpc2hlZEF0ID0gdmkuZm4oKVxuY29uc3QgbW9ja1NldExhc3RQdWJsaXNoZWRIYXNVc2VySW5wdXQgPSB2aS5mbigpXG5cbmNvbnN0IG1vY2tXb3JrZmxvd1N0b3JlU2V0U3RhdGUgPSB2aS5mbigpXG5jb25zdCBtb2NrV29ya2Zsb3dTdG9yZVNldFNob3dGZWF0dXJlc1BhbmVsID0gdmkuZm4oKVxuXG5sZXQgd29ya2Zsb3dTdG9yZVN0YXRlID0ge1xuICBzaG93RmVhdHVyZXNQYW5lbDogZmFsc2UsXG4gIGlzUmVzdG9yaW5nOiBmYWxzZSxcbiAgc2V0U2hvd0ZlYXR1cmVzUGFuZWw6IG1vY2tXb3JrZmxvd1N0b3JlU2V0U2hvd0ZlYXR1cmVzUGFuZWwsXG4gIHNldFB1Ymxpc2hlZEF0OiBtb2NrU2V0UHVibGlzaGVkQXQsXG4gIHNldExhc3RQdWJsaXNoZWRIYXNVc2VySW5wdXQ6IG1vY2tTZXRMYXN0UHVibGlzaGVkSGFzVXNlcklucHV0LFxufVxuXG5jb25zdCBtb2NrV29ya2Zsb3dTdG9yZSA9IHtcbiAgZ2V0U3RhdGU6ICgpID0+IHdvcmtmbG93U3RvcmVTdGF0ZSxcbiAgc2V0U3RhdGU6IG1vY2tXb3JrZmxvd1N0b3JlU2V0U3RhdGUsXG59XG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VDaGVja2xpc3Q6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tVc2VDaGVja2xpc3QoLi4uYXJncyksXG4gIHVzZUNoZWNrbGlzdEJlZm9yZVB1Ymxpc2g6ICgpID0+IG1vY2tVc2VDaGVja2xpc3RCZWZvcmVQdWJsaXNoKCksXG4gIHVzZU5vZGVzUmVhZE9ubHk6ICgpID0+IG1vY2tVc2VOb2Rlc1JlYWRPbmx5KCksXG4gIHVzZU5vZGVzU3luY0RyYWZ0OiAoKSA9PiBtb2NrVXNlTm9kZXNTeW5jRHJhZnQoKSxcbiAgdXNlSXNDaGF0TW9kZTogKCkgPT4gbW9ja1VzZUlzQ2hhdE1vZGUoKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4gdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHtcbiAgICAgIHB1Ymxpc2hlZEF0OiBudWxsLFxuICAgICAgZHJhZnRVcGRhdGVkQXQ6IG51bGwsXG4gICAgICB0b29sUHVibGlzaGVkOiBmYWxzZSxcbiAgICAgIGxhc3RQdWJsaXNoZWRIYXNVc2VySW5wdXQ6IGZhbHNlLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG4gIHVzZVdvcmtmbG93U3RvcmU6ICgpID0+IG1vY2tXb3JrZmxvd1N0b3JlLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9ob29rcycsICgpID0+ICh7XG4gIHVzZUZlYXR1cmVzOiAoc2VsZWN0b3I6IChzdGF0ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHVua25vd24pID0+IG1vY2tVc2VGZWF0dXJlcyhzZWxlY3RvciksXG59KSlcblxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+IG1vY2tVc2VQcm92aWRlckNvbnRleHQoKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlL3dvcmtmbG93L3VzZS1ub2RlcycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IG1vY2tVc2VOb2RlcygpLFxufSkpXG5cbnZpLm1vY2soJ3JlYWN0ZmxvdycsICgpID0+ICh7XG4gIHVzZUVkZ2VzOiAoKSA9PiBtb2NrVXNlRWRnZXMoKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2FwcC9hcHAtcHVibGlzaGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBBcHBQdWJsaXNoZXJQcm9wcykgPT4ge1xuICAgIGNvbnN0IGlucHV0cyA9IHByb3BzLmlucHV0cyA/PyBbXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGRhdGEtdGVzdGlkPVwiYXBwLXB1Ymxpc2hlclwiXG4gICAgICAgIGRhdGEtZGlzYWJsZWQ9e1N0cmluZyhCb29sZWFuKHByb3BzLmRpc2FibGVkKSl9XG4gICAgICAgIGRhdGEtcHVibGlzaC1kaXNhYmxlZD17U3RyaW5nKEJvb2xlYW4ocHJvcHMucHVibGlzaERpc2FibGVkKSl9XG4gICAgICAgIGRhdGEtc3RhcnQtbm9kZS1saW1pdC1leGNlZWRlZD17U3RyaW5nKEJvb2xlYW4ocHJvcHMuc3RhcnROb2RlTGltaXRFeGNlZWRlZCkpfVxuICAgICAgICBkYXRhLWhhcy10cmlnZ2VyLW5vZGU9e1N0cmluZyhCb29sZWFuKHByb3BzLmhhc1RyaWdnZXJOb2RlKSl9XG4gICAgICAgIGRhdGEtaW5wdXRzPXtKU09OLnN0cmluZ2lmeShpbnB1dHMpfVxuICAgICAgPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB7IHByb3BzLm9uUmVmcmVzaERhdGE/LigpIH19PlxuICAgICAgICAgIHB1Ymxpc2hlci1yZWZyZXNoXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB7IHByb3BzLm9uVG9nZ2xlPy4odHJ1ZSkgfX0+XG4gICAgICAgICAgcHVibGlzaGVyLXRvZ2dsZS1vblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4geyBwcm9wcy5vblRvZ2dsZT8uKGZhbHNlKSB9fT5cbiAgICAgICAgICBwdWJsaXNoZXItdG9nZ2xlLW9mZlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4geyBQcm9taXNlLnJlc29sdmUocHJvcHMub25QdWJsaXNoPy4oKSkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSB9fT5cbiAgICAgICAgICBwdWJsaXNoZXItcHVibGlzaFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4geyBQcm9taXNlLnJlc29sdmUocHJvcHMub25QdWJsaXNoPy4oeyB0aXRsZTogJ1Rlc3QgdGl0bGUnLCByZWxlYXNlTm90ZXM6ICdUZXN0IG5vdGVzJyB9KSkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSB9fT5cbiAgICAgICAgICBwdWJsaXNoZXItcHVibGlzaC13aXRoLXBhcmFtc1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXdvcmtmbG93JywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZGF0ZUFwcFdvcmtmbG93OiAoKSA9PiBtb2NrVXBkYXRlUHVibGlzaGVkV29ya2Zsb3csXG4gIHVzZVB1Ymxpc2hXb3JrZmxvdzogKCkgPT4gKHsgbXV0YXRlQXN5bmM6IG1vY2tQdWJsaXNoV29ya2Zsb3cgfSksXG4gIHVzZVJlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeTogKCkgPT4gbW9ja1Jlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXRvb2xzJywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZGF0ZUFwcFRyaWdnZXJzOiAoKSA9PiBtb2NrSW52YWxpZGF0ZUFwcFRyaWdnZXJzLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9hcHBzJywgKCkgPT4gKHtcbiAgZmV0Y2hBcHBEZXRhaWw6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tGZXRjaEFwcERldGFpbCguLi5hcmdzKSxcbn0pKVxuXG52aS5tb2NrKCdAL2hvb2tzL3VzZS10aGVtZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IG1vY2tVc2VUaGVtZSgpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiB7IGFwcERldGFpbD86IHsgaWQ6IHN0cmluZyB9LCBzZXRBcHBEZXRhaWw6IHR5cGVvZiBtb2NrU2V0QXBwRGV0YWlsIH0pID0+IHVua25vd24pID0+IG1vY2tVc2VBcHBTdG9yZVNlbGVjdG9yKHNlbGVjdG9yKSxcbn0pKVxuXG5jb25zdCBjcmVhdGVQcm92aWRlckNvbnRleHQgPSAoe1xuICB0eXBlID0gUGxhbi5zYW5kYm94LFxuICBpc0ZldGNoZWRQbGFuID0gdHJ1ZSxcbn06IHtcbiAgdHlwZT86IFBsYW5cbiAgaXNGZXRjaGVkUGxhbj86IGJvb2xlYW5cbn0pID0+ICh7XG4gIHBsYW46IHsgdHlwZSB9LFxuICBpc0ZldGNoZWRQbGFuLFxufSlcblxuY29uc3QgcmVuZGVyV2l0aFRvYXN0ID0gKHVpOiBSZWFjdEVsZW1lbnQpID0+IHtcbiAgcmV0dXJuIHJlbmRlcihcbiAgICA8VG9hc3RDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IG5vdGlmeTogbW9ja05vdGlmeSwgY2xvc2U6IHZpLmZuKCkgfX0+XG4gICAgICB7dWl9XG4gICAgPC9Ub2FzdENvbnRleHQuUHJvdmlkZXI+LFxuICApXG59XG5cbmRlc2NyaWJlKCdGZWF0dXJlc1RyaWdnZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHdvcmtmbG93U3RvcmVTdGF0ZSA9IHtcbiAgICAgIHNob3dGZWF0dXJlc1BhbmVsOiBmYWxzZSxcbiAgICAgIGlzUmVzdG9yaW5nOiBmYWxzZSxcbiAgICAgIHNldFNob3dGZWF0dXJlc1BhbmVsOiBtb2NrV29ya2Zsb3dTdG9yZVNldFNob3dGZWF0dXJlc1BhbmVsLFxuICAgICAgc2V0UHVibGlzaGVkQXQ6IG1vY2tTZXRQdWJsaXNoZWRBdCxcbiAgICAgIHNldExhc3RQdWJsaXNoZWRIYXNVc2VySW5wdXQ6IG1vY2tTZXRMYXN0UHVibGlzaGVkSGFzVXNlcklucHV0LFxuICAgIH1cblxuICAgIG1vY2tVc2VUaGVtZS5tb2NrUmV0dXJuVmFsdWUoeyB0aGVtZTogJ2xpZ2h0JyB9KVxuICAgIG1vY2tVc2VOb2Rlc1JlYWRPbmx5Lm1vY2tSZXR1cm5WYWx1ZSh7IG5vZGVzUmVhZE9ubHk6IGZhbHNlLCBnZXROb2Rlc1JlYWRPbmx5OiAoKSA9PiBmYWxzZSB9KVxuICAgIG1vY2tVc2VDaGVja2xpc3QubW9ja1JldHVyblZhbHVlKFtdKVxuICAgIG1vY2tVc2VDaGVja2xpc3RCZWZvcmVQdWJsaXNoLm1vY2tSZXR1cm5WYWx1ZSh7IGhhbmRsZUNoZWNrQmVmb3JlUHVibGlzaDogbW9ja0hhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCB9KVxuICAgIG1vY2tIYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2gubW9ja1Jlc29sdmVkVmFsdWUodHJ1ZSlcbiAgICBtb2NrVXNlTm9kZXNTeW5jRHJhZnQubW9ja1JldHVyblZhbHVlKHsgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQ6IG1vY2tIYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCB9KVxuICAgIG1vY2tVc2VGZWF0dXJlcy5tb2NrSW1wbGVtZW50YXRpb24oKHNlbGVjdG9yOiAoc3RhdGU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB1bmtub3duKSA9PiBzZWxlY3Rvcih7IGZlYXR1cmVzOiB7IGZpbGU6IHt9IH0gfSkpXG4gICAgbW9ja1VzZVByb3ZpZGVyQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoY3JlYXRlUHJvdmlkZXJDb250ZXh0KHt9KSlcbiAgICBtb2NrVXNlTm9kZXMubW9ja1JldHVyblZhbHVlKFtdKVxuICAgIG1vY2tVc2VFZGdlcy5tb2NrUmV0dXJuVmFsdWUoW10pXG4gICAgbW9ja1VzZUFwcFN0b3JlU2VsZWN0b3IubW9ja0ltcGxlbWVudGF0aW9uKHNlbGVjdG9yID0+IHNlbGVjdG9yKHsgYXBwRGV0YWlsOiB7IGlkOiAnYXBwLWlkJyB9LCBzZXRBcHBEZXRhaWw6IG1vY2tTZXRBcHBEZXRhaWwgfSkpXG4gICAgbW9ja0ZldGNoQXBwRGV0YWlsLm1vY2tSZXNvbHZlZFZhbHVlKHsgaWQ6ICdhcHAtaWQnIH0pXG4gICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicgfSlcbiAgfSlcblxuICAvLyBWZXJpZmllcyB0aGUgZmVhdHVyZSB0b2dnbGUgYnV0dG9uIG9ubHkgYXBwZWFycyBpbiBjaGF0ZmxvdyBtb2RlLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB0aGUgZmVhdHVyZXMgYnV0dG9uIHdoZW4gbm90IGluIGNoYXQgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLmZlYXR1cmVzL2kgfSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBmZWF0dXJlcyBidXR0b24gd2hlbiBpbiBjaGF0IG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlSXNDaGF0TW9kZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3dcXC5jb21tb25cXC5mZWF0dXJlcy9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZGFyayB0aGVtZSBzdHlsaW5nIHdoZW4gdGhlbWUgaXMgZGFyaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja1VzZVRoZW1lLm1vY2tSZXR1cm5WYWx1ZSh7IHRoZW1lOiAnZGFyaycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3dcXC5jb21tb25cXC5mZWF0dXJlcy9pIH0pKS50b0hhdmVDbGFzcygncm91bmRlZC1sZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyBWZXJpZmllcyB1c2VyIGNsaWNrcyB0b2dnbGUgdGhlIGZlYXR1cmVzIHBhbmVsIHZpc2liaWxpdHkuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBmZWF0dXJlcyBwYW5lbCB3aGVuIGNsaWNrZWQgYW5kIG5vZGVzIGFyZSBlZGl0YWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgbW9ja1VzZUlzQ2hhdE1vZGUubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICBtb2NrVXNlTm9kZXNSZWFkT25seS5tb2NrUmV0dXJuVmFsdWUoeyBub2Rlc1JlYWRPbmx5OiBmYWxzZSwgZ2V0Tm9kZXNSZWFkT25seTogKCkgPT4gZmFsc2UgfSlcblxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLmZlYXR1cmVzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tXb3JrZmxvd1N0b3JlU2V0U2hvd0ZlYXR1cmVzUGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICAvLyBDb3ZlcnMgcmVhZC1vbmx5IGdhdGluZyB0aGF0IHByZXZlbnRzIHRvZ2dsaW5nIHVubGVzcyByZXN0b3JpbmcuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHRvZ2dsZSBmZWF0dXJlcyBwYW5lbCB3aGVuIG5vZGVzIGFyZSByZWFkLW9ubHkgYW5kIG5vdCByZXN0b3JpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja1VzZU5vZGVzUmVhZE9ubHkubW9ja1JldHVyblZhbHVlKHsgbm9kZXNSZWFkT25seTogdHJ1ZSwgZ2V0Tm9kZXNSZWFkT25seTogKCkgPT4gdHJ1ZSB9KVxuICAgICAgd29ya2Zsb3dTdG9yZVN0YXRlID0ge1xuICAgICAgICAuLi53b3JrZmxvd1N0b3JlU3RhdGUsXG4gICAgICAgIGlzUmVzdG9yaW5nOiBmYWxzZSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLmZlYXR1cmVzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tXb3JrZmxvd1N0b3JlU2V0U2hvd0ZlYXR1cmVzUGFuZWwpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZlcmlmaWVzIHRoZSBwdWJsaXNoZXIgcmVmbGVjdHMgdGhlIHByZXNlbmNlIG9mIHdvcmtmbG93IG5vZGVzLlxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIEFwcFB1Ymxpc2hlciB3aGVuIHRoZXJlIGFyZSBubyB3b3JrZmxvdyBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJc0NoYXRNb2RlLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcbiAgICAgIG1vY2tVc2VOb2Rlcy5tb2NrUmV0dXJuVmFsdWUoW10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLXB1Ymxpc2hlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBWZXJpZmllcyBkZXJpdmVkIHByb3BzIHBhc3NlZCBpbnRvIEFwcFB1Ymxpc2hlciAodmFyaWFibGVzLCBsaW1pdHMsIGFuZCB0cmlnZ2VycykuXG4gIGRlc2NyaWJlKCdDb21wdXRlZCBQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGVuZCBpbWFnZSBpbnB1dCB3aGVuIGZpbGUgaW1hZ2UgdXBsb2FkIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlRmVhdHVyZXMubW9ja0ltcGxlbWVudGF0aW9uKChzZWxlY3RvcjogKHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4gdW5rbm93bikgPT4gc2VsZWN0b3Ioe1xuICAgICAgICBmZWF0dXJlczogeyBmaWxlOiB7IGltYWdlOiB7IGVuYWJsZWQ6IHRydWUgfSB9IH0sXG4gICAgICB9KSlcbiAgICAgIG1vY2tVc2VOb2Rlcy5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICB7IGlkOiAnc3RhcnQnLCBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5TdGFydCB9IH0sXG4gICAgICBdKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhUb2FzdCg8RmVhdHVyZXNUcmlnZ2VyIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlucHV0cyA9IEpTT04ucGFyc2Uoc2NyZWVuLmdldEJ5VGVzdElkKCdhcHAtcHVibGlzaGVyJykuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0cycpID8/ICdbXScpIGFzIEFycmF5PHtcbiAgICAgICAgdHlwZT86IHN0cmluZ1xuICAgICAgICB2YXJpYWJsZT86IHN0cmluZ1xuICAgICAgICByZXF1aXJlZD86IGJvb2xlYW5cbiAgICAgICAgbGFiZWw/OiBzdHJpbmdcbiAgICAgIH0+XG4gICAgICBleHBlY3QoaW5wdXRzKS50b0NvbnRhaW5FcXVhbCh7XG4gICAgICAgIHR5cGU6IElucHV0VmFyVHlwZS5maWxlcyxcbiAgICAgICAgdmFyaWFibGU6ICdfX2ltYWdlJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICBsYWJlbDogJ2ZpbGVzJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHN0YXJ0Tm9kZUxpbWl0RXhjZWVkZWQgd2hlbiBzYW5kYm94IGVudHJ5IGxpbWl0IGlzIGV4Y2VlZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZU5vZGVzLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIHsgaWQ6ICdzdGFydCcsIGRhdGE6IHsgdHlwZTogQmxvY2tFbnVtLlN0YXJ0IH0gfSxcbiAgICAgICAgeyBpZDogJ3RyaWdnZXItMScsIGRhdGE6IHsgdHlwZTogQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rIH0gfSxcbiAgICAgICAgeyBpZDogJ3RyaWdnZXItMicsIGRhdGE6IHsgdHlwZTogQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSB9IH0sXG4gICAgICAgIHsgaWQ6ICdlbmQnLCBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5FbmQgfSB9LFxuICAgICAgXSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwdWJsaXNoZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1wdWJsaXNoZXInKVxuICAgICAgZXhwZWN0KHB1Ymxpc2hlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXJ0LW5vZGUtbGltaXQtZXhjZWVkZWQnLCAndHJ1ZScpXG4gICAgICBleHBlY3QocHVibGlzaGVyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcHVibGlzaC1kaXNhYmxlZCcsICd0cnVlJylcbiAgICAgIGV4cGVjdChwdWJsaXNoZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtdHJpZ2dlci1ub2RlJywgJ3RydWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVmVyaWZpZXMgY2FsbGJhY2tzIHdpcmVkIGZyb20gQXBwUHVibGlzaGVyIHRvIHN0b3JlcyBhbmQgZHJhZnQgc3luY2luZy5cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCB0b29sUHVibGlzaGVkIHdoZW4gQXBwUHVibGlzaGVyIHJlZnJlc2hlcyBkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3B1Ymxpc2hlci1yZWZyZXNoJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1dvcmtmbG93U3RvcmVTZXRTdGF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyB0b29sUHVibGlzaGVkOiB0cnVlIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3luYyB3b3JrZmxvdyBkcmFmdCB3aGVuIEFwcFB1Ymxpc2hlciB0b2dnbGVzIG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3B1Ymxpc2hlci10b2dnbGUtb24nIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU3luY1dvcmtmbG93RHJhZnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHN5bmMgd29ya2Zsb3cgZHJhZnQgd2hlbiBBcHBQdWJsaXNoZXIgdG9nZ2xlcyBvZmYnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcldpdGhUb2FzdCg8RmVhdHVyZXNUcmlnZ2VyIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncHVibGlzaGVyLXRvZ2dsZS1vZmYnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU3luY1dvcmtmbG93RHJhZnQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZlcmlmaWVzIHB1Ymxpc2hpbmcgYmVoYXZpb3IgYWNyb3NzIHdhcm5pbmdzLCB2YWxpZGF0aW9uLCBhbmQgc3VjY2Vzcy5cbiAgZGVzY3JpYmUoJ1B1Ymxpc2hpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3RpZnkgZXJyb3IgYW5kIHJlamVjdCBwdWJsaXNoIHdoZW4gY2hlY2tsaXN0IGhhcyB3YXJuaW5nIG5vZGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBtb2NrVXNlQ2hlY2tsaXN0Lm1vY2tSZXR1cm5WYWx1ZShbeyBpZDogJ3dhcm5pbmcnIH1dKVxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwdWJsaXNoZXItcHVibGlzaCcgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6ICd3b3JrZmxvdy5wYW5lbC5jaGVja2xpc3RUaXAnIH0pXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tQdWJsaXNoV29ya2Zsb3cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWplY3QgcHVibGlzaCB3aGVuIGNoZWNrbGlzdCBiZWZvcmUgcHVibGlzaCBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgbW9ja0hhbmRsZUNoZWNrQmVmb3JlUHVibGlzaC5tb2NrUmVzb2x2ZWRWYWx1ZShmYWxzZSlcbiAgICAgIHJlbmRlcldpdGhUb2FzdCg8RmVhdHVyZXNUcmlnZ2VyIC8+KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncHVibGlzaGVyLXB1Ymxpc2gnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrUHVibGlzaFdvcmtmbG93KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHVibGlzaCB3b3JrZmxvdyBhbmQgdXBkYXRlIHJlbGF0ZWQgc3RvcmVzIHdoZW4gdmFsaWRhdGlvbiBwYXNzZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIG1vY2tVc2VOb2Rlcy5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICB7IGlkOiAnc3RhcnQnLCBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5TdGFydCB9IH0sXG4gICAgICBdKVxuICAgICAgbW9ja1VzZUVkZ2VzLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIHsgc291cmNlOiAnc3RhcnQnIH0sXG4gICAgICBdKVxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwdWJsaXNoZXItcHVibGlzaCcgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUHVibGlzaFdvcmtmbG93KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdXJsOiAnL2FwcHMvYXBwLWlkL3dvcmtmbG93cy9wdWJsaXNoJyxcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgcmVsZWFzZU5vdGVzOiAnJyxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KG1vY2tVcGRhdGVQdWJsaXNoZWRXb3JrZmxvdykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2FwcC1pZCcpXG4gICAgICAgIGV4cGVjdChtb2NrSW52YWxpZGF0ZUFwcFRyaWdnZXJzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnYXBwLWlkJylcbiAgICAgICAgZXhwZWN0KG1vY2tTZXRQdWJsaXNoZWRBdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJzIwMjQtMDEtMDFUMDA6MDA6MDBaJylcbiAgICAgICAgZXhwZWN0KG1vY2tTZXRMYXN0UHVibGlzaGVkSGFzVXNlcklucHV0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgICAgICBleHBlY3QobW9ja1Jlc2V0V29ya2Zsb3dWZXJzaW9uSGlzdG9yeSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogJ2NvbW1vbi5hcGkuYWN0aW9uU3VjY2VzcycgfSlcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEFwcERldGFpbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyB1cmw6ICcvYXBwcycsIGlkOiAnYXBwLWlkJyB9KVxuICAgICAgICBleHBlY3QobW9ja1NldEFwcERldGFpbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgcHVibGlzaCBwYXJhbXMgdG8gd29ya2Zsb3cgcHVibGlzaCBtdXRhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyV2l0aFRvYXN0KDxGZWF0dXJlc1RyaWdnZXIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwdWJsaXNoZXItcHVibGlzaC13aXRoLXBhcmFtcycgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUHVibGlzaFdvcmtmbG93KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdXJsOiAnL2FwcHMvYXBwLWlkL3dvcmtmbG93cy9wdWJsaXNoJyxcbiAgICAgICAgICB0aXRsZTogJ1Rlc3QgdGl0bGUnLFxuICAgICAgICAgIHJlbGVhc2VOb3RlczogJ1Rlc3Qgbm90ZXMnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsb2cgZXJyb3Igd2hlbiBhcHAgZGV0YWlsIHJlZnJlc2ggZmFpbHMgYWZ0ZXIgcHVibGlzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgY29uc29sZUVycm9yU3B5ID0gdmkuc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHVuZGVmaW5lZClcbiAgICAgIG1vY2tGZXRjaEFwcERldGFpbC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ2ZldGNoIGZhaWxlZCcpKVxuXG4gICAgICByZW5kZXJXaXRoVG9hc3QoPEZlYXR1cmVzVHJpZ2dlciAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3B1Ymxpc2hlci1wdWJsaXNoJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNvbnNvbGVFcnJvclNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgICAgY29uc29sZUVycm9yU3B5Lm1vY2tSZXN0b3JlKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==