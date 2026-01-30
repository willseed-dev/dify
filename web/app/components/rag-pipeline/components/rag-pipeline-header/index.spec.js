"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const provider_context_1 = require("@/__mocks__/provider-context");
const types_1 = require("@/app/components/workflow/types");
// ============================================================================
// Import Components After Mocks
// ============================================================================
const index_1 = require("./index");
const input_field_button_1 = require("./input-field-button");
const publisher_1 = require("./publisher");
const popup_1 = require("./publisher/popup");
const run_mode_1 = require("./run-mode");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock workflow store
const mockSetShowInputFieldPanel = vi.fn();
const mockSetShowEnvPanel = vi.fn();
const mockSetIsPreparingDataSource = vi.fn();
const mockSetShowDebugAndPreviewPanel = vi.fn();
const mockSetPublishedAt = vi.fn();
let mockStoreState = {
    pipelineId: 'test-pipeline-id',
    showDebugAndPreviewPanel: false,
    publishedAt: 0,
    draftUpdatedAt: Date.now(),
    workflowRunningData: null,
    isPreparingDataSource: false,
    setShowInputFieldPanel: mockSetShowInputFieldPanel,
    setShowEnvPanel: mockSetShowEnvPanel,
};
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => selector(mockStoreState),
    useWorkflowStore: () => ({
        getState: () => ({
            setIsPreparingDataSource: mockSetIsPreparingDataSource,
            setShowDebugAndPreviewPanel: mockSetShowDebugAndPreviewPanel,
            setPublishedAt: mockSetPublishedAt,
        }),
    }),
}));
// Mock workflow hooks
const mockHandleSyncWorkflowDraft = vi.fn();
const mockHandleCheckBeforePublish = vi.fn().mockResolvedValue(true);
const mockHandleStopRun = vi.fn();
const mockHandleWorkflowStartRunInWorkflow = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useNodesSyncDraft: () => ({
        handleSyncWorkflowDraft: mockHandleSyncWorkflowDraft,
    }),
    useChecklistBeforePublish: () => ({
        handleCheckBeforePublish: mockHandleCheckBeforePublish,
    }),
    useWorkflowRun: () => ({
        handleStopRun: mockHandleStopRun,
    }),
    useWorkflowStartRun: () => ({
        handleWorkflowStartRunInWorkflow: mockHandleWorkflowStartRunInWorkflow,
    }),
}));
// Mock Header component
vi.mock('@/app/components/workflow/header', () => ({
    default: ({ normal, viewHistory }) => (<div data-testid="workflow-header">
      <div data-testid="header-left">{normal?.components?.left}</div>
      <div data-testid="header-middle">{normal?.components?.middle}</div>
      <div data-testid="header-run-and-history">{JSON.stringify(normal?.runAndHistoryProps)}</div>
      <div data-testid="header-view-history">{JSON.stringify(viewHistory?.viewHistoryProps)}</div>
    </div>),
}));
// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useParams: () => ({ datasetId: 'test-dataset-id' }),
    useRouter: () => ({ push: mockPush }),
}));
// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }) => (<a href={href} {...props}>{children}</a>),
}));
// Mock service hooks
const mockPublishWorkflow = vi.fn().mockResolvedValue({ created_at: Date.now() });
const mockPublishAsCustomizedPipeline = vi.fn().mockResolvedValue({});
vi.mock('@/service/use-workflow', () => ({
    usePublishWorkflow: () => ({
        mutateAsync: mockPublishWorkflow,
    }),
}));
vi.mock('@/service/use-pipeline', () => ({
    publishedPipelineInfoQueryKeyPrefix: ['pipeline-info'],
    useInvalidCustomizedTemplateList: () => vi.fn(),
    usePublishAsCustomizedPipeline: () => ({
        mutateAsync: mockPublishAsCustomizedPipeline,
    }),
}));
vi.mock('@/service/use-base', () => ({
    useInvalid: () => vi.fn(),
}));
vi.mock('@/service/knowledge/use-dataset', () => ({
    useInvalidDatasetList: () => vi.fn(),
}));
// Mock context hooks
const mockMutateDatasetRes = vi.fn();
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: () => mockMutateDatasetRes,
}));
const mockSetShowPricingModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContextSelector: () => mockSetShowPricingModal,
}));
let mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)();
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => mockProviderContextValue,
}));
// Mock event emitter context
const mockEventEmitter = {
    useSubscription: vi.fn(),
};
let mockEventEmitterEnabled = true;
vi.mock('@/context/event-emitter', () => ({
    useEventEmitterContextContext: () => ({
        eventEmitter: mockEventEmitterEnabled ? mockEventEmitter : undefined,
    }),
}));
// Mock hooks
vi.mock('@/hooks/use-api-access-url', () => ({
    useDatasetApiAccessUrl: () => '/api/docs',
}));
vi.mock('@/hooks/use-format-time-from-now', () => ({
    useFormatTimeFromNow: () => ({
        formatTimeFromNow: (ts) => `${Math.floor((Date.now() - ts) / 1000)} seconds ago`,
    }),
}));
// Mock amplitude tracking
vi.mock('@/app/components/base/amplitude', () => ({
    trackEvent: vi.fn(),
}));
// Mock toast context
const mockNotify = vi.fn();
vi.mock('@/app/components/base/toast', () => ({
    useToastContext: () => ({
        notify: mockNotify,
    }),
}));
// Mock workflow utils
vi.mock('@/app/components/workflow/utils', () => ({
    getKeyboardKeyCodeBySystem: (key) => key,
    getKeyboardKeyNameBySystem: (key) => key,
}));
// Mock ahooks
vi.mock('ahooks', () => ({
    useBoolean: (initial) => {
        let value = initial;
        return [
            value,
            {
                setTrue: vi.fn(() => { value = true; }),
                setFalse: vi.fn(() => { value = false; }),
                toggle: vi.fn(() => { value = !value; }),
            },
        ];
    },
    useKeyPress: vi.fn(),
}));
// Mock portal components - keep actual behavior for open state
let portalOpenState = false;
vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open, onOpenChange: _onOpenChange }) => {
        portalOpenState = open;
        return <div data-testid="portal-elem" data-open={open}>{children}</div>;
    },
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>{children}</div>),
    PortalToFollowElemContent: ({ children }) => {
        if (!portalOpenState)
            return null;
        return <div data-testid="portal-content">{children}</div>;
    },
}));
// Mock PublishAsKnowledgePipelineModal
vi.mock('../../publish-as-knowledge-pipeline-modal', () => ({
    default: ({ onConfirm, onCancel }) => (<div data-testid="publish-as-pipeline-modal">
      <button data-testid="modal-confirm" onClick={() => onConfirm('test-name', { type: 'emoji', emoji: '📦' }, 'test-description')}>Confirm</button>
      <button data-testid="modal-cancel" onClick={onCancel}>Cancel</button>
    </div>),
}));
// ============================================================================
// Test Suites
// ============================================================================
describe('RagPipelineHeader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        portalOpenState = false;
        mockStoreState = {
            pipelineId: 'test-pipeline-id',
            showDebugAndPreviewPanel: false,
            publishedAt: 0,
            draftUpdatedAt: Date.now(),
            workflowRunningData: null,
            isPreparingDataSource: false,
            setShowInputFieldPanel: mockSetShowInputFieldPanel,
            setShowEnvPanel: mockSetShowEnvPanel,
        };
        mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('workflow-header')).toBeInTheDocument();
        });
        it('should render InputFieldButton in left slot', () => {
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('header-left')).toBeInTheDocument();
            expect(react_1.screen.getByText(/inputField/i)).toBeInTheDocument();
        });
        it('should render Publisher in middle slot', () => {
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('header-middle')).toBeInTheDocument();
        });
        it('should pass correct viewHistoryProps with pipelineId', () => {
            (0, react_1.render)(<index_1.default />);
            const viewHistoryContent = react_1.screen.getByTestId('header-view-history').textContent;
            expect(viewHistoryContent).toContain('/rag/pipelines/test-pipeline-id/workflow-runs');
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should compute viewHistoryProps based on pipelineId', () => {
            // Test with first pipelineId
            mockStoreState.pipelineId = 'pipeline-alpha';
            const { unmount } = (0, react_1.render)(<index_1.default />);
            let viewHistoryContent = react_1.screen.getByTestId('header-view-history').textContent;
            expect(viewHistoryContent).toContain('pipeline-alpha');
            unmount();
            // Test with different pipelineId
            mockStoreState.pipelineId = 'pipeline-beta';
            (0, react_1.render)(<index_1.default />);
            viewHistoryContent = react_1.screen.getByTestId('header-view-history').textContent;
            expect(viewHistoryContent).toContain('pipeline-beta');
        });
        it('should include showRunButton in runAndHistoryProps', () => {
            (0, react_1.render)(<index_1.default />);
            const runAndHistoryContent = react_1.screen.getByTestId('header-run-and-history').textContent;
            expect(runAndHistoryContent).toContain('"showRunButton":true');
        });
    });
});
describe('InputFieldButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.setShowInputFieldPanel = mockSetShowInputFieldPanel;
        mockStoreState.setShowEnvPanel = mockSetShowEnvPanel;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render button with correct text', () => {
            (0, react_1.render)(<input_field_button_1.default />);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText(/inputField/i)).toBeInTheDocument();
        });
        it('should render with secondary variant style', () => {
            (0, react_1.render)(<input_field_button_1.default />);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('flex', 'gap-x-0.5');
        });
    });
    // --------------------------------------------------------------------------
    // Event Handler Tests
    // --------------------------------------------------------------------------
    describe('Event Handlers', () => {
        it('should call setShowInputFieldPanel(true) when clicked', () => {
            (0, react_1.render)(<input_field_button_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockSetShowInputFieldPanel).toHaveBeenCalledWith(true);
        });
        it('should call setShowEnvPanel(false) when clicked', () => {
            (0, react_1.render)(<input_field_button_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockSetShowEnvPanel).toHaveBeenCalledWith(false);
        });
        it('should call both store methods in sequence when clicked', () => {
            (0, react_1.render)(<input_field_button_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockSetShowInputFieldPanel).toHaveBeenCalledTimes(1);
            expect(mockSetShowEnvPanel).toHaveBeenCalledTimes(1);
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle undefined setShowInputFieldPanel gracefully', () => {
            mockStoreState.setShowInputFieldPanel = undefined;
            (0, react_1.render)(<input_field_button_1.default />);
            // Should not throw when clicked
            expect(() => react_1.fireEvent.click(react_1.screen.getByRole('button'))).not.toThrow();
        });
    });
});
describe('Publisher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        portalOpenState = false;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render publish button', () => {
            (0, react_1.render)(<publisher_1.default />);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText(/workflow.common.publish/i)).toBeInTheDocument();
        });
        it('should render with primary variant', () => {
            (0, react_1.render)(<publisher_1.default />);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('px-2');
        });
        it('should render portal trigger element', () => {
            (0, react_1.render)(<publisher_1.default />);
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Interaction Tests
    // --------------------------------------------------------------------------
    describe('Interactions', () => {
        it('should call handleSyncWorkflowDraft when opening', () => {
            (0, react_1.render)(<publisher_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            expect(mockHandleSyncWorkflowDraft).toHaveBeenCalledWith(true);
        });
        it('should toggle open state when trigger clicked', () => {
            (0, react_1.render)(<publisher_1.default />);
            const portal = react_1.screen.getByTestId('portal-elem');
            expect(portal).toHaveAttribute('data-open', 'false');
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // After click, handleOpenChange should be called
            expect(mockHandleSyncWorkflowDraft).toHaveBeenCalled();
        });
    });
});
describe('Popup', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.publishedAt = 0;
        mockStoreState.draftUpdatedAt = Date.now();
        mockStoreState.pipelineId = 'test-pipeline-id';
        mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)({
            isAllowPublishAsCustomKnowledgePipelineTemplate: true,
        });
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render popup container', () => {
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.publishUpdate/i)).toBeInTheDocument();
        });
        it('should show unpublished state when publishedAt is 0', () => {
            mockStoreState.publishedAt = 0;
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.currentDraftUnpublished/i)).toBeInTheDocument();
        });
        it('should show published state when publishedAt is set', () => {
            mockStoreState.publishedAt = Date.now() - 60000;
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.latestPublished/i)).toBeInTheDocument();
        });
        it('should render keyboard shortcuts', () => {
            (0, react_1.render)(<popup_1.default />);
            // Should show the keyboard shortcut keys
            expect(react_1.screen.getByText('ctrl')).toBeInTheDocument();
            expect(react_1.screen.getByText('⇧')).toBeInTheDocument();
            expect(react_1.screen.getByText('P')).toBeInTheDocument();
        });
        it('should render goToAddDocuments button', () => {
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.goToAddDocuments/i)).toBeInTheDocument();
        });
        it('should render API reference link', () => {
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.accessAPIReference/i)).toBeInTheDocument();
        });
        it('should render publish as template button', () => {
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.publishAs/i)).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Button State Tests
    // --------------------------------------------------------------------------
    describe('Button States', () => {
        it('should disable goToAddDocuments when not published', () => {
            mockStoreState.publishedAt = 0;
            (0, react_1.render)(<popup_1.default />);
            const button = react_1.screen.getByText(/pipeline.common.goToAddDocuments/i).closest('button');
            expect(button).toBeDisabled();
        });
        it('should enable goToAddDocuments when published', () => {
            mockStoreState.publishedAt = Date.now();
            (0, react_1.render)(<popup_1.default />);
            const button = react_1.screen.getByText(/pipeline.common.goToAddDocuments/i).closest('button');
            expect(button).not.toBeDisabled();
        });
        it('should disable publish as template when not published', () => {
            mockStoreState.publishedAt = 0;
            (0, react_1.render)(<popup_1.default />);
            const button = react_1.screen.getByText(/pipeline.common.publishAs/i).closest('button');
            expect(button).toBeDisabled();
        });
    });
    // --------------------------------------------------------------------------
    // Premium Badge Tests
    // --------------------------------------------------------------------------
    describe('Premium Badge', () => {
        it('should show premium badge when not allowed to publish as template', () => {
            mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)({
                isAllowPublishAsCustomKnowledgePipelineTemplate: false,
            });
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/billing.upgradeBtn.encourageShort/i)).toBeInTheDocument();
        });
        it('should not show premium badge when allowed to publish as template', () => {
            mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)({
                isAllowPublishAsCustomKnowledgePipelineTemplate: true,
            });
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.queryByText(/billing.upgradeBtn.encourageShort/i)).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Interaction Tests
    // --------------------------------------------------------------------------
    describe('Interactions', () => {
        it('should call handleCheckBeforePublish when publish button clicked', async () => {
            (0, react_1.render)(<popup_1.default />);
            const publishButton = react_1.screen.getByText(/workflow.common.publishUpdate/i).closest('button');
            react_1.fireEvent.click(publishButton);
            await (0, react_1.waitFor)(() => {
                expect(mockHandleCheckBeforePublish).toHaveBeenCalled();
            });
        });
        it('should navigate to add documents when goToAddDocuments clicked', () => {
            mockStoreState.publishedAt = Date.now();
            (0, react_1.render)(<popup_1.default />);
            const button = react_1.screen.getByText(/pipeline.common.goToAddDocuments/i).closest('button');
            react_1.fireEvent.click(button);
            expect(mockPush).toHaveBeenCalledWith('/datasets/test-dataset-id/documents/create-from-pipeline');
        });
        it('should show pricing modal when clicking publish as template without permission', () => {
            mockStoreState.publishedAt = Date.now();
            mockProviderContextValue = (0, provider_context_1.createMockProviderContextValue)({
                isAllowPublishAsCustomKnowledgePipelineTemplate: false,
            });
            (0, react_1.render)(<popup_1.default />);
            const button = react_1.screen.getByText(/pipeline.common.publishAs/i).closest('button');
            react_1.fireEvent.click(button);
            expect(mockSetShowPricingModal).toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Auto-save Display Tests
    // --------------------------------------------------------------------------
    describe('Auto-save Display', () => {
        it('should show auto-saved time when not published', () => {
            mockStoreState.publishedAt = 0;
            mockStoreState.draftUpdatedAt = Date.now() - 5000;
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.autoSaved/i)).toBeInTheDocument();
        });
        it('should show published time when published', () => {
            mockStoreState.publishedAt = Date.now() - 60000;
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.publishedAt/i)).toBeInTheDocument();
        });
    });
});
describe('RunMode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStoreState.workflowRunningData = null;
        mockStoreState.isPreparingDataSource = false;
        mockEventEmitterEnabled = true;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render run button with default text', () => {
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText(/pipeline.common.testRun/i)).toBeInTheDocument();
        });
        it('should render with custom text prop', () => {
            (0, react_1.render)(<run_mode_1.default text="Custom Run"/>);
            expect(react_1.screen.getByText('Custom Run')).toBeInTheDocument();
        });
        it('should render keyboard shortcuts when not disabled', () => {
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText('alt')).toBeInTheDocument();
            expect(react_1.screen.getByText('R')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Running State Tests
    // --------------------------------------------------------------------------
    describe('Running States', () => {
        it('should show processing state when running', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.processing/i)).toBeInTheDocument();
        });
        it('should show stop button when running', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            // There should be two buttons: run button and stop button
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBe(2);
        });
        it('should show reRun text when workflow has run before', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Succeeded },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.reRun/i)).toBeInTheDocument();
        });
        it('should show preparing data source state', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.preparingDataSource/i)).toBeInTheDocument();
        });
        it('should show cancel button when preparing data source', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBe(2);
        });
        it('should show reRun text when workflow status is Failed', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Failed },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.reRun/i)).toBeInTheDocument();
        });
        it('should show reRun text when workflow status is Stopped', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Stopped },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.reRun/i)).toBeInTheDocument();
        });
        it('should show reRun text when workflow status is Waiting', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Waiting },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.reRun/i)).toBeInTheDocument();
        });
        it('should not show stop button when status is not Running', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Succeeded },
            };
            (0, react_1.render)(<run_mode_1.default />);
            // Should only have one button (run button)
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBe(1);
        });
        it('should enable button when status is Succeeded', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Succeeded },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getByRole('button');
            expect(runButton).not.toBeDisabled();
        });
        it('should enable button when status is Failed', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Failed },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getByRole('button');
            expect(runButton).not.toBeDisabled();
        });
    });
    // --------------------------------------------------------------------------
    // Disabled State Tests
    // --------------------------------------------------------------------------
    describe('Disabled States', () => {
        it('should be disabled when running', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toBeDisabled();
        });
        it('should be disabled when preparing data source', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toBeDisabled();
        });
        it('should not show keyboard shortcuts when disabled', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.queryByText('alt')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Interaction Tests
    // --------------------------------------------------------------------------
    describe('Interactions', () => {
        it('should call handleWorkflowStartRunInWorkflow when clicked', () => {
            (0, react_1.render)(<run_mode_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockHandleWorkflowStartRunInWorkflow).toHaveBeenCalled();
        });
        it('should call handleStopRun when stop button clicked', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            // Click the stop button (second button)
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]);
            expect(mockHandleStopRun).toHaveBeenCalledWith('task-123');
        });
        it('should cancel preparing data source when cancel clicked', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            // Click the cancel button (second button)
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]);
            expect(mockSetIsPreparingDataSource).toHaveBeenCalledWith(false);
            expect(mockSetShowDebugAndPreviewPanel).toHaveBeenCalledWith(false);
        });
        it('should call handleStopRun with empty string when task_id is undefined', () => {
            mockStoreState.workflowRunningData = {
                task_id: undefined,
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]); // Click stop button
            expect(mockHandleStopRun).toHaveBeenCalledWith('');
        });
        it('should not call handleWorkflowStartRunInWorkflow when disabled', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            react_1.fireEvent.click(runButton);
            // Should not be called because button is disabled
            expect(mockHandleWorkflowStartRunInWorkflow).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Event Emitter Tests
    // --------------------------------------------------------------------------
    describe('Event Emitter', () => {
        it('should subscribe to event emitter', () => {
            (0, react_1.render)(<run_mode_1.default />);
            expect(mockEventEmitter.useSubscription).toHaveBeenCalled();
        });
        it('should call handleStopRun when EVENT_WORKFLOW_STOP event is emitted', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-456',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            // Capture the subscription callback
            let subscriptionCallback = null;
            mockEventEmitter.useSubscription.mockImplementation((callback) => {
                subscriptionCallback = callback;
            });
            (0, react_1.render)(<run_mode_1.default />);
            // Simulate the EVENT_WORKFLOW_STOP event (actual value is 'WORKFLOW_STOP')
            expect(subscriptionCallback).not.toBeNull();
            subscriptionCallback({ type: 'WORKFLOW_STOP' });
            expect(mockHandleStopRun).toHaveBeenCalledWith('task-456');
        });
        it('should not call handleStopRun for other event types', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-789',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            let subscriptionCallback = null;
            mockEventEmitter.useSubscription.mockImplementation((callback) => {
                subscriptionCallback = callback;
            });
            (0, react_1.render)(<run_mode_1.default />);
            // Simulate a different event type
            subscriptionCallback({ type: 'some_other_event' });
            expect(mockHandleStopRun).not.toHaveBeenCalled();
        });
        it('should handle undefined eventEmitter gracefully', () => {
            mockEventEmitterEnabled = false;
            // Should not throw when eventEmitter is undefined
            expect(() => (0, react_1.render)(<run_mode_1.default />)).not.toThrow();
        });
        it('should not subscribe when eventEmitter is undefined', () => {
            mockEventEmitterEnabled = false;
            vi.clearAllMocks();
            (0, react_1.render)(<run_mode_1.default />);
            // useSubscription should not be called
            expect(mockEventEmitter.useSubscription).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Style Tests
    // --------------------------------------------------------------------------
    describe('Styles', () => {
        it('should have rounded-md class when not disabled', () => {
            (0, react_1.render)(<run_mode_1.default />);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('rounded-md');
        });
        it('should have rounded-l-md class when disabled', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toHaveClass('rounded-l-md');
        });
        it('should have cursor-not-allowed when disabled', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toHaveClass('cursor-not-allowed');
        });
        it('should have bg-state-accent-hover when disabled', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toHaveClass('bg-state-accent-hover');
        });
        it('should have bg-state-accent-active on stop button', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const stopButton = react_1.screen.getAllByRole('button')[1];
            expect(stopButton).toHaveClass('bg-state-accent-active');
        });
        it('should have rounded-r-md on stop button', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const stopButton = react_1.screen.getAllByRole('button')[1];
            expect(stopButton).toHaveClass('rounded-r-md');
        });
        it('should have size-7 on stop button', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            const stopButton = react_1.screen.getAllByRole('button')[1];
            expect(stopButton).toHaveClass('size-7');
        });
        it('should have correct base classes on run button', () => {
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getByRole('button');
            expect(runButton).toHaveClass('system-xs-medium');
            expect(runButton).toHaveClass('h-7');
            expect(runButton).toHaveClass('px-1.5');
            expect(runButton).toHaveClass('text-text-accent');
        });
        it('should have gap-x-px on container', () => {
            const { container } = (0, react_1.render)(<run_mode_1.default />);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('gap-x-px');
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('items-center');
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped in React.memo', () => {
            // RunMode is exported as default from run-mode.tsx with React.memo
            // We can verify it's memoized by checking the component's $$typeof symbol
            expect(run_mode_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        portalOpenState = false;
        mockStoreState = {
            pipelineId: 'test-pipeline-id',
            showDebugAndPreviewPanel: false,
            publishedAt: 0,
            draftUpdatedAt: Date.now(),
            workflowRunningData: null,
            isPreparingDataSource: false,
            setShowInputFieldPanel: mockSetShowInputFieldPanel,
            setShowEnvPanel: mockSetShowEnvPanel,
        };
    });
    it('should render all child components in RagPipelineHeader', () => {
        (0, react_1.render)(<index_1.default />);
        // InputFieldButton
        expect(react_1.screen.getByText(/inputField/i)).toBeInTheDocument();
        // Publisher (via header-middle slot)
        expect(react_1.screen.getByTestId('header-middle')).toBeInTheDocument();
    });
    it('should pass correct history URL based on pipelineId', () => {
        mockStoreState.pipelineId = 'custom-pipeline-123';
        (0, react_1.render)(<index_1.default />);
        const viewHistoryContent = react_1.screen.getByTestId('header-view-history').textContent;
        expect(viewHistoryContent).toContain('/rag/pipelines/custom-pipeline-123/workflow-runs');
    });
});
// ============================================================================
// Edge Cases
// ============================================================================
describe('Edge Cases', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Null/Undefined Values', () => {
        it('should handle null workflowRunningData', () => {
            mockStoreState.workflowRunningData = null;
            (0, react_1.render)(<run_mode_1.default />);
            expect(react_1.screen.getByText(/pipeline.common.testRun/i)).toBeInTheDocument();
        });
        it('should handle empty pipelineId', () => {
            mockStoreState.pipelineId = '';
            (0, react_1.render)(<index_1.default />);
            const viewHistoryContent = react_1.screen.getByTestId('header-view-history').textContent;
            expect(viewHistoryContent).toContain('/rag/pipelines//workflow-runs');
        });
        it('should throw when result is undefined in workflowRunningData', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: undefined,
            };
            // Component will crash when accessing result.status - this documents current behavior
            expect(() => (0, react_1.render)(<run_mode_1.default />)).toThrow();
        });
    });
    describe('RunMode Edge Cases', () => {
        beforeEach(() => {
            // Ensure clean state for each test
            mockStoreState.workflowRunningData = null;
            mockStoreState.isPreparingDataSource = false;
        });
        it('should handle both isPreparingDataSource and isRunning being true', () => {
            // This shouldn't happen in practice, but test the priority
            mockStoreState.isPreparingDataSource = true;
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            // Button should be disabled
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton).toBeDisabled();
        });
        it('should show testRun text when workflowRunningData is null', () => {
            mockStoreState.workflowRunningData = null;
            mockStoreState.isPreparingDataSource = false;
            (0, react_1.render)(<run_mode_1.default />);
            // Verify the button is enabled and shows testRun text
            const button = react_1.screen.getByRole('button');
            expect(button).not.toBeDisabled();
            expect(button.textContent).toContain('pipeline.common.testRun');
        });
        it('should use custom text when provided and workflowRunningData is null', () => {
            mockStoreState.workflowRunningData = null;
            mockStoreState.isPreparingDataSource = false;
            (0, react_1.render)(<run_mode_1.default text="Start Pipeline"/>);
            expect(react_1.screen.getByText('Start Pipeline')).toBeInTheDocument();
        });
        it('should show reRun instead of custom text when workflowRunningData exists', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Succeeded },
            };
            mockStoreState.isPreparingDataSource = false;
            (0, react_1.render)(<run_mode_1.default text="Start Pipeline"/>);
            // Should show reRun, not custom text
            const button = react_1.screen.getByRole('button');
            expect(button.textContent).toContain('pipeline.common.reRun');
            expect(react_1.screen.queryByText('Start Pipeline')).not.toBeInTheDocument();
        });
        it('should show keyboard shortcuts with correct styling', () => {
            mockStoreState.workflowRunningData = null;
            mockStoreState.isPreparingDataSource = false;
            (0, react_1.render)(<run_mode_1.default />);
            // Verify keyboard shortcut elements exist
            expect(react_1.screen.getByText('alt')).toBeInTheDocument();
            expect(react_1.screen.getByText('R')).toBeInTheDocument();
        });
        it('should have correct structure with play icon when not disabled', () => {
            mockStoreState.workflowRunningData = null;
            mockStoreState.isPreparingDataSource = false;
            (0, react_1.render)(<run_mode_1.default />);
            // Should have svg icon in the button
            const button = react_1.screen.getByRole('button');
            expect(button.querySelector('svg')).toBeInTheDocument();
        });
        it('should have correct structure with loader icon when running', () => {
            mockStoreState.workflowRunningData = {
                task_id: 'task-123',
                result: { status: types_1.WorkflowRunningStatus.Running },
            };
            (0, react_1.render)(<run_mode_1.default />);
            // Should have animate-spin class on the loader icon
            const runButton = react_1.screen.getAllByRole('button')[0];
            const spinningIcon = runButton.querySelector('.animate-spin');
            expect(spinningIcon).toBeInTheDocument();
        });
        it('should have correct structure with database icon when preparing data source', () => {
            mockStoreState.isPreparingDataSource = true;
            (0, react_1.render)(<run_mode_1.default />);
            const runButton = react_1.screen.getAllByRole('button')[0];
            expect(runButton.querySelector('svg')).toBeInTheDocument();
        });
    });
    describe('Boundary Conditions', () => {
        it('should handle zero draftUpdatedAt', () => {
            mockStoreState.publishedAt = 0;
            mockStoreState.draftUpdatedAt = 0;
            (0, react_1.render)(<popup_1.default />);
            // Should render without crashing
            expect(react_1.screen.getByText(/workflow.common.autoSaved/i)).toBeInTheDocument();
        });
        it('should handle very old publishedAt timestamp', () => {
            mockStoreState.publishedAt = 1;
            (0, react_1.render)(<popup_1.default />);
            expect(react_1.screen.getByText(/workflow.common.latestPublished/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1FQUE2RTtBQUM3RSwyREFBdUU7QUFFdkUsK0VBQStFO0FBQy9FLGdDQUFnQztBQUNoQywrRUFBK0U7QUFFL0UsbUNBQXVDO0FBQ3ZDLDZEQUFtRDtBQUNuRCwyQ0FBbUM7QUFDbkMsNkNBQXFDO0FBQ3JDLHlDQUFnQztBQUVoQywrRUFBK0U7QUFDL0UsNkJBQTZCO0FBQzdCLCtFQUErRTtBQUUvRSxzQkFBc0I7QUFDdEIsTUFBTSwwQkFBMEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUMsTUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDbkMsTUFBTSw0QkFBNEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDNUMsTUFBTSwrQkFBK0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDL0MsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFbEMsSUFBSSxjQUFjLEdBQUc7SUFDbkIsVUFBVSxFQUFFLGtCQUFrQjtJQUM5Qix3QkFBd0IsRUFBRSxLQUFLO0lBQy9CLFdBQVcsRUFBRSxDQUFDO0lBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDMUIsbUJBQW1CLEVBQUUsSUFHcEI7SUFDRCxxQkFBcUIsRUFBRSxLQUFLO0lBQzVCLHNCQUFzQixFQUFFLDBCQUEwQjtJQUNsRCxlQUFlLEVBQUUsbUJBQW1CO0NBQ3JDLENBQUE7QUFFRCxFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsUUFBUSxFQUFFLENBQUMsUUFBbUQsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztJQUMzRixnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2Ysd0JBQXdCLEVBQUUsNEJBQTRCO1lBQ3RELDJCQUEyQixFQUFFLCtCQUErQjtZQUM1RCxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DLENBQUM7S0FDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxzQkFBc0I7QUFDdEIsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDM0MsTUFBTSw0QkFBNEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDakMsTUFBTSxvQ0FBb0MsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFcEQsRUFBRSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEIsdUJBQXVCLEVBQUUsMkJBQTJCO0tBQ3JELENBQUM7SUFDRix5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLHdCQUF3QixFQUFFLDRCQUE0QjtLQUN2RCxDQUFDO0lBQ0YsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsYUFBYSxFQUFFLGlCQUFpQjtLQUNqQyxDQUFDO0lBQ0YsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQixnQ0FBZ0MsRUFBRSxvQ0FBb0M7S0FDdkUsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsd0JBQXdCO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBRzlCLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUNoQztNQUFBLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FDOUQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLENBQ2xFO01BQUEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FDM0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUM3RjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHVCQUF1QjtBQUN2QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLENBQUM7SUFDbkQsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7Q0FDdEMsQ0FBQyxDQUFDLENBQUE7QUFFSCxpQkFBaUI7QUFDakIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxQixPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLEVBQXVDLEVBQUUsRUFBRSxDQUFDLENBQzlFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHFCQUFxQjtBQUNyQixNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ2pGLE1BQU0sK0JBQStCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBRXJFLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLFdBQVcsRUFBRSxtQkFBbUI7S0FDakMsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLG1DQUFtQyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQ3RELGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0MsOEJBQThCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyQyxXQUFXLEVBQUUsK0JBQStCO0tBQzdDLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUMxQixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3JDLENBQUMsQ0FBQyxDQUFBO0FBRUgscUJBQXFCO0FBQ3JCLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0I7Q0FDaEUsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN2QyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsdUJBQXVCO0NBQ3ZELENBQUMsQ0FBQyxDQUFBO0FBRUgsSUFBSSx3QkFBd0IsR0FBRyxJQUFBLGlEQUE4QixHQUFFLENBQUE7QUFDL0QsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLHdCQUF3QjtDQUNuRCxDQUFDLENBQUMsQ0FBQTtBQUVILDZCQUE2QjtBQUM3QixNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3pCLENBQUE7QUFDRCxJQUFJLHVCQUF1QixHQUFHLElBQUksQ0FBQTtBQUNsQyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwQyxZQUFZLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ3JFLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILGFBQWE7QUFDYixFQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0Msc0JBQXNCLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVztDQUMxQyxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqRCxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLGlCQUFpQixFQUFFLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWM7S0FDekYsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsMEJBQTBCO0FBQzFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNwQixDQUFDLENBQUMsQ0FBQTtBQUVILHFCQUFxQjtBQUNyQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sRUFBRSxVQUFVO0tBQ25CLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILHNCQUFzQjtBQUN0QixFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsMEJBQTBCLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUc7SUFDaEQsMEJBQTBCLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUc7Q0FDakQsQ0FBQyxDQUFDLENBQUE7QUFFSCxjQUFjO0FBQ2QsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QixVQUFVLEVBQUUsQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFBO1FBQ25CLE9BQU87WUFDTCxLQUFLO1lBQ0w7Z0JBQ0UsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1NBQ0YsQ0FBQTtJQUNILENBQUM7SUFDRCxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNyQixDQUFDLENBQUMsQ0FBQTtBQUVILCtEQUErRDtBQUMvRCxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUE7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVELGtCQUFrQixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBS2hFLEVBQUUsRUFBRTtRQUNKLGVBQWUsR0FBRyxJQUFJLENBQUE7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDekUsQ0FBQztJQUNELHlCQUF5QixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUErQyxFQUFFLEVBQUUsQ0FBQyxDQUNqRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FDckU7SUFDRCx5QkFBeUIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFxQixFQUFFLEVBQUU7UUFDN0QsSUFBSSxDQUFDLGVBQWU7WUFDbEIsT0FBTyxJQUFJLENBQUE7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQzNELENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHVDQUF1QztBQUN2QyxFQUFFLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUQsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUk5QixFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsQ0FDMUM7TUFBQSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FDOUk7TUFBQSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQ3RFO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLGNBQWM7QUFDZCwrRUFBK0U7QUFFL0UsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGVBQWUsR0FBRyxLQUFLLENBQUE7UUFDdkIsY0FBYyxHQUFHO1lBQ2YsVUFBVSxFQUFFLGtCQUFrQjtZQUM5Qix3QkFBd0IsRUFBRSxLQUFLO1lBQy9CLFdBQVcsRUFBRSxDQUFDO1lBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDMUIsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixxQkFBcUIsRUFBRSxLQUFLO1lBQzVCLHNCQUFzQixFQUFFLDBCQUEwQjtZQUNsRCxlQUFlLEVBQUUsbUJBQW1CO1NBQ3JDLENBQUE7UUFDRCx3QkFBd0IsR0FBRyxJQUFBLGlEQUE4QixHQUFFLENBQUE7SUFDN0QsQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usa0JBQWtCO0lBQ2xCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBaUIsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQzdCLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ25FLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWlCLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUM3QixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWlCLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUM3QixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDakUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1lBQzlELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBaUIsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQzdCLE1BQU0sa0JBQWtCLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtZQUNoRixNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsK0NBQStDLENBQUMsQ0FBQTtRQUN2RixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLG9CQUFvQjtJQUNwQiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDM0IsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCw2QkFBNkI7WUFDN0IsY0FBYyxDQUFDLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQTtZQUM1QyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFpQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFDakQsSUFBSSxrQkFBa0IsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFBO1lBQzlFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3RELE9BQU8sRUFBRSxDQUFBO1lBRVQsaUNBQWlDO1lBQ2pDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFBO1lBQzNDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBaUIsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQzdCLGtCQUFrQixHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUE7WUFDMUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWlCLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUM3QixNQUFNLG9CQUFvQixHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxXQUFXLENBQUE7WUFDckYsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGNBQWMsQ0FBQyxzQkFBc0IsR0FBRywwQkFBMEIsQ0FBQTtRQUNsRSxjQUFjLENBQUMsZUFBZSxHQUFHLG1CQUFtQixDQUFBO0lBQ3RELENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLGtCQUFrQjtJQUNsQiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxJQUFBLGNBQU0sRUFBQyxDQUFDLDRCQUFnQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFDNUIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3RELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM3RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyw0QkFBZ0IsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQzVCLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDakQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxzQkFBc0I7SUFDdEIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxJQUFBLGNBQU0sRUFBQyxDQUFDLDRCQUFnQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFNUIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtZQUN6RCxJQUFBLGNBQU0sRUFBQyxDQUFDLDRCQUFnQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFNUIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtZQUNqRSxJQUFBLGNBQU0sRUFBQyxDQUFDLDRCQUFnQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFNUIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0UsYUFBYTtJQUNiLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFO1lBQ25FLGNBQWMsQ0FBQyxzQkFBc0IsR0FBRyxTQUF5RCxDQUFBO1lBRWpHLElBQUEsY0FBTSxFQUFDLENBQUMsNEJBQWdCLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUU1QixnQ0FBZ0M7WUFDaEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN6RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGVBQWUsR0FBRyxLQUFLLENBQUE7SUFDekIsQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usa0JBQWtCO0lBQ2xCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLElBQUEsY0FBTSxFQUFDLENBQUMsbUJBQVMsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQ3JCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDNUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxtQkFBUyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFDckIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUM5QyxJQUFBLGNBQU0sRUFBQyxDQUFDLG1CQUFTLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUNyQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLG9CQUFvQjtJQUNwQiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7UUFDNUIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxJQUFBLGNBQU0sRUFBQyxDQUFDLG1CQUFTLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVyQixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDdkQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxtQkFBUyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFckIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxpREFBaUQ7WUFDakQsTUFBTSxDQUFDLDJCQUEyQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGNBQWMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1FBQzlCLGNBQWMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQzFDLGNBQWMsQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLENBQUE7UUFDOUMsd0JBQXdCLEdBQUcsSUFBQSxpREFBOEIsRUFBQztZQUN4RCwrQ0FBK0MsRUFBRSxJQUFJO1NBQ3RELENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLGtCQUFrQjtJQUNsQiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtZQUN2QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2hGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCxjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtZQUU5QixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWpCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCxjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUE7WUFFL0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQix5Q0FBeUM7WUFDekMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3BELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNqRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzFDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDckYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDNUUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxxQkFBcUI7SUFDckIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsY0FBYyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7WUFFOUIsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQixNQUFNLE1BQU0sR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUMvQixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDdkQsY0FBYyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7WUFFdkMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQixNQUFNLE1BQU0sR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1lBQy9ELGNBQWMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1lBRTlCLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMvRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxzQkFBc0I7SUFDdEIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0Usd0JBQXdCLEdBQUcsSUFBQSxpREFBOEIsRUFBQztnQkFDeEQsK0NBQStDLEVBQUUsS0FBSzthQUN2RCxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWpCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3BGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRTtZQUMzRSx3QkFBd0IsR0FBRyxJQUFBLGlEQUE4QixFQUFDO2dCQUN4RCwrQ0FBK0MsRUFBRSxJQUFJO2FBQ3RELENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usb0JBQW9CO0lBQ3BCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsa0VBQWtFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBRSxDQUFBO1lBQzNGLGlCQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRTlCLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQ3pELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1lBQ3hFLGNBQWMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBRXZDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUUsQ0FBQTtZQUN2RixpQkFBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUV2QixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsMERBQTBELENBQUMsQ0FBQTtRQUNuRyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7WUFDeEYsY0FBYyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7WUFDdkMsd0JBQXdCLEdBQUcsSUFBQSxpREFBOEIsRUFBQztnQkFDeEQsK0NBQStDLEVBQUUsS0FBSzthQUN2RCxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWpCLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFFLENBQUE7WUFDaEYsaUJBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFdkIsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLDBCQUEwQjtJQUMxQiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1lBQ3hELGNBQWMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1lBQzlCLGNBQWMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQTtZQUVqRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWpCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtZQUNuRCxjQUFjLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUE7WUFFL0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVqQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM5RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7UUFDekMsY0FBYyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQTtRQUM1Qyx1QkFBdUIsR0FBRyxJQUFJLENBQUE7SUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usa0JBQWtCO0lBQ2xCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3BELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUcsQ0FBQyxDQUFBO1lBRXJDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ25ELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLHNCQUFzQjtJQUN0Qiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM5QixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUM5QyxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsNkJBQXFCLENBQUMsT0FBTyxFQUFFO2FBQ2xELENBQUE7WUFFRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQiwwREFBMEQ7WUFDMUQsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLFNBQVMsRUFBRTthQUNwRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1lBQ2pELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFFM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1lBQzlELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFFM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDL0QsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE1BQU0sRUFBRTthQUNqRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsNkJBQXFCLENBQUMsT0FBTyxFQUFFO2FBQ2xELENBQUE7WUFFRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxHQUFHLEVBQUU7WUFDaEUsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLFNBQVMsRUFBRTthQUNwRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsMkNBQTJDO1lBQzNDLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxTQUFTLEVBQUU7YUFDcEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDNUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUN0QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE1BQU0sRUFBRTthQUNqRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ3RDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0UsdUJBQXVCO0lBQ3ZCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7WUFDekMsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE9BQU8sRUFBRTthQUNsRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFFM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1lBQzFELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxvQkFBb0I7SUFDcEIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7WUFDbkUsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDakUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzVELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLHdDQUF3QztZQUN4QyxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTNCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtZQUNqRSxjQUFjLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFBO1lBRTNDLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLDBDQUEwQztZQUMxQyxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTNCLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hFLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtZQUMvRSxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxTQUE4QjtnQkFDdkMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE9BQU8sRUFBRTthQUNsRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxPQUFPLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLG9CQUFvQjtZQUVoRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7WUFDeEUsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE9BQU8sRUFBRTthQUNsRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUUxQixrREFBa0Q7WUFDbEQsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDckUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxzQkFBc0I7SUFDdEIsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDN0QsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscUVBQXFFLEVBQUUsR0FBRyxFQUFFO1lBQzdFLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELG9DQUFvQztZQUNwQyxJQUFJLG9CQUFvQixHQUEyQyxJQUFJLENBQUE7WUFDdkUsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBdUMsRUFBRSxFQUFFO2dCQUM5RixvQkFBb0IsR0FBRyxRQUFRLENBQUE7WUFDakMsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQiwyRUFBMkU7WUFDM0UsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQzNDLG9CQUFxQixDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUE7WUFFaEQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1lBQzdELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUksb0JBQW9CLEdBQTJDLElBQUksQ0FBQTtZQUN2RSxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUF1QyxFQUFFLEVBQUU7Z0JBQzlGLG9CQUFvQixHQUFHLFFBQVEsQ0FBQTtZQUNqQyxDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLGtDQUFrQztZQUNsQyxvQkFBcUIsQ0FBQyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUE7WUFFbkQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELHVCQUF1QixHQUFHLEtBQUssQ0FBQTtZQUUvQixrREFBa0Q7WUFDbEQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2pELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCx1QkFBdUIsR0FBRyxLQUFLLENBQUE7WUFDL0IsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBRWxCLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLHVDQUF1QztZQUN2QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7UUFDakUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZFQUE2RTtJQUM3RSxjQUFjO0lBQ2QsNkVBQTZFO0lBQzdFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDeEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsNkJBQXFCLENBQUMsT0FBTyxFQUFFO2FBQ2xELENBQUE7WUFFRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQixNQUFNLFNBQVMsR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDL0MsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFFM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDckQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFFM0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO1lBQzNELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBQzFELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsNkJBQXFCLENBQUMsT0FBTyxFQUFFO2FBQ2xELENBQUE7WUFFRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQixNQUFNLFVBQVUsR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ25ELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzNDLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxPQUFPLEVBQUU7YUFDbEQsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDeEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUE7WUFDakQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3ZDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXpDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxVQUF5QixDQUFBO1lBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2RUFBNkU7SUFDN0Usb0JBQW9CO0lBQ3BCLDZFQUE2RTtJQUM3RSxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQ3pDLG1FQUFtRTtZQUNuRSwwRUFBMEU7WUFDMUUsTUFBTSxDQUFFLGtCQUEyQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7UUFDOUYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLG9CQUFvQjtBQUNwQiwrRUFBK0U7QUFDL0UsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixlQUFlLEdBQUcsS0FBSyxDQUFBO1FBQ3ZCLGNBQWMsR0FBRztZQUNmLFVBQVUsRUFBRSxrQkFBa0I7WUFDOUIsd0JBQXdCLEVBQUUsS0FBSztZQUMvQixXQUFXLEVBQUUsQ0FBQztZQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzFCLG1CQUFtQixFQUFFLElBQUk7WUFDekIscUJBQXFCLEVBQUUsS0FBSztZQUM1QixzQkFBc0IsRUFBRSwwQkFBMEI7WUFDbEQsZUFBZSxFQUFFLG1CQUFtQjtTQUNyQyxDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ2pFLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBaUIsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1FBRTdCLG1CQUFtQjtRQUNuQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFFM0QscUNBQXFDO1FBQ3JDLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDN0QsY0FBYyxDQUFDLFVBQVUsR0FBRyxxQkFBcUIsQ0FBQTtRQUVqRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWlCLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtRQUU3QixNQUFNLGtCQUFrQixHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxXQUFXLENBQUE7UUFDaEYsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsU0FBUyxDQUFDLGtEQUFrRCxDQUFDLENBQUE7SUFDMUYsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLCtFQUErRTtBQUMvRSxhQUFhO0FBQ2IsK0VBQStFO0FBQy9FLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsY0FBYyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQTtZQUV6QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsY0FBYyxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUE7WUFFOUIsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFpQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFN0IsTUFBTSxrQkFBa0IsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUMsV0FBVyxDQUFBO1lBQ2hGLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBQ3ZFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtZQUN0RSxjQUFjLENBQUMsbUJBQW1CLEdBQUc7Z0JBQ25DLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixNQUFNLEVBQUUsU0FBeUQ7YUFDbEUsQ0FBQTtZQUVELHNGQUFzRjtZQUN0RixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsbUNBQW1DO1lBQ25DLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7WUFDekMsY0FBYyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQTtRQUM5QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsMkRBQTJEO1lBQzNELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUE7WUFDM0MsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE9BQU8sRUFBRTthQUNsRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsNEJBQTRCO1lBQzVCLE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ2xDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtZQUNuRSxjQUFjLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFBO1lBQ3pDLGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7WUFFNUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsc0RBQXNEO1lBQ3RELE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBQ2pFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtZQUM5RSxjQUFjLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFBO1lBQ3pDLGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7WUFFNUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDLENBQUE7WUFFekMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMEVBQTBFLEVBQUUsR0FBRyxFQUFFO1lBQ2xGLGNBQWMsQ0FBQyxtQkFBbUIsR0FBRztnQkFDbkMsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSw2QkFBcUIsQ0FBQyxTQUFTLEVBQUU7YUFDcEQsQ0FBQTtZQUNELGNBQWMsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7WUFFNUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDLENBQUE7WUFFekMscUNBQXFDO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtZQUM3RCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1lBQzdELGNBQWMsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7WUFDekMsY0FBYyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQTtZQUU1QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQiwwQ0FBMEM7WUFDMUMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ25ELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7WUFDeEUsY0FBYyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQTtZQUN6QyxjQUFjLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFBO1lBRTVDLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQU8sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRW5CLHFDQUFxQztZQUNyQyxNQUFNLE1BQU0sR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsY0FBYyxDQUFDLG1CQUFtQixHQUFHO2dCQUNuQyxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE9BQU8sRUFBRTthQUNsRCxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBTyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbkIsb0RBQW9EO1lBQ3BELE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUM3RCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7WUFDckYsY0FBYyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtZQUUzQyxJQUFBLGNBQU0sRUFBQyxDQUFDLGtCQUFPLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVuQixNQUFNLFNBQVMsR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUNuQyxFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1lBQzNDLGNBQWMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFBO1lBQzlCLGNBQWMsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFBO1lBRWpDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBSyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFakIsaUNBQWlDO1lBQ2pDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxjQUFjLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQTtZQUU5QixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQUssQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWpCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUgfSBmcm9tICdAL19fbW9ja3NfXy9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IHsgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW1wb3J0IENvbXBvbmVudHMgQWZ0ZXIgTW9ja3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuaW1wb3J0IFJhZ1BpcGVsaW5lSGVhZGVyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgSW5wdXRGaWVsZEJ1dHRvbiBmcm9tICcuL2lucHV0LWZpZWxkLWJ1dHRvbidcbmltcG9ydCBQdWJsaXNoZXIgZnJvbSAnLi9wdWJsaXNoZXInXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wdWJsaXNoZXIvcG9wdXAnXG5pbXBvcnQgUnVuTW9kZSBmcm9tICcuL3J1bi1tb2RlJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHdvcmtmbG93IHN0b3JlXG5jb25zdCBtb2NrU2V0U2hvd0lucHV0RmllbGRQYW5lbCA9IHZpLmZuKClcbmNvbnN0IG1vY2tTZXRTaG93RW52UGFuZWwgPSB2aS5mbigpXG5jb25zdCBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlID0gdmkuZm4oKVxuY29uc3QgbW9ja1NldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCA9IHZpLmZuKClcbmNvbnN0IG1vY2tTZXRQdWJsaXNoZWRBdCA9IHZpLmZuKClcblxubGV0IG1vY2tTdG9yZVN0YXRlID0ge1xuICBwaXBlbGluZUlkOiAndGVzdC1waXBlbGluZS1pZCcsXG4gIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogZmFsc2UsXG4gIHB1Ymxpc2hlZEF0OiAwLFxuICBkcmFmdFVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgd29ya2Zsb3dSdW5uaW5nRGF0YTogbnVsbCBhcyBudWxsIHwge1xuICAgIHRhc2tfaWQ6IHN0cmluZ1xuICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cyB9XG4gIH0sXG4gIGlzUHJlcGFyaW5nRGF0YVNvdXJjZTogZmFsc2UsXG4gIHNldFNob3dJbnB1dEZpZWxkUGFuZWw6IG1vY2tTZXRTaG93SW5wdXRGaWVsZFBhbmVsLFxuICBzZXRTaG93RW52UGFuZWw6IG1vY2tTZXRTaG93RW52UGFuZWwsXG59XG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VTdG9yZTogKHNlbGVjdG9yOiAoc3RhdGU6IHR5cGVvZiBtb2NrU3RvcmVTdGF0ZSkgPT4gdW5rbm93bikgPT4gc2VsZWN0b3IobW9ja1N0b3JlU3RhdGUpLFxuICB1c2VXb3JrZmxvd1N0b3JlOiAoKSA9PiAoe1xuICAgIGdldFN0YXRlOiAoKSA9PiAoe1xuICAgICAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlOiBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlLFxuICAgICAgc2V0U2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiBtb2NrU2V0U2hvd0RlYnVnQW5kUHJldmlld1BhbmVsLFxuICAgICAgc2V0UHVibGlzaGVkQXQ6IG1vY2tTZXRQdWJsaXNoZWRBdCxcbiAgICB9KSxcbiAgfSksXG59KSlcblxuLy8gTW9jayB3b3JrZmxvdyBob29rc1xuY29uc3QgbW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0ID0gdmkuZm4oKVxuY29uc3QgbW9ja0hhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodHJ1ZSlcbmNvbnN0IG1vY2tIYW5kbGVTdG9wUnVuID0gdmkuZm4oKVxuY29uc3QgbW9ja0hhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93ID0gdmkuZm4oKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlTm9kZXNTeW5jRHJhZnQ6ICgpID0+ICh7XG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQ6IG1vY2tIYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCxcbiAgfSksXG4gIHVzZUNoZWNrbGlzdEJlZm9yZVB1Ymxpc2g6ICgpID0+ICh7XG4gICAgaGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoOiBtb2NrSGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoLFxuICB9KSxcbiAgdXNlV29ya2Zsb3dSdW46ICgpID0+ICh7XG4gICAgaGFuZGxlU3RvcFJ1bjogbW9ja0hhbmRsZVN0b3BSdW4sXG4gIH0pLFxuICB1c2VXb3JrZmxvd1N0YXJ0UnVuOiAoKSA9PiAoe1xuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93OiBtb2NrSGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3csXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgSGVhZGVyIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9oZWFkZXInLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBub3JtYWwsIHZpZXdIaXN0b3J5IH06IHtcbiAgICBub3JtYWw/OiB7IGNvbXBvbmVudHM/OiB7IGxlZnQ/OiBSZWFjdE5vZGUsIG1pZGRsZT86IFJlYWN0Tm9kZSB9LCBydW5BbmRIaXN0b3J5UHJvcHM/OiB1bmtub3duIH1cbiAgICB2aWV3SGlzdG9yeT86IHsgdmlld0hpc3RvcnlQcm9wcz86IHVua25vd24gfVxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cIndvcmtmbG93LWhlYWRlclwiPlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImhlYWRlci1sZWZ0XCI+e25vcm1hbD8uY29tcG9uZW50cz8ubGVmdH08L2Rpdj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJoZWFkZXItbWlkZGxlXCI+e25vcm1hbD8uY29tcG9uZW50cz8ubWlkZGxlfTwvZGl2PlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImhlYWRlci1ydW4tYW5kLWhpc3RvcnlcIj57SlNPTi5zdHJpbmdpZnkobm9ybWFsPy5ydW5BbmRIaXN0b3J5UHJvcHMpfTwvZGl2PlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImhlYWRlci12aWV3LWhpc3RvcnlcIj57SlNPTi5zdHJpbmdpZnkodmlld0hpc3Rvcnk/LnZpZXdIaXN0b3J5UHJvcHMpfTwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgbmV4dC9uYXZpZ2F0aW9uXG5jb25zdCBtb2NrUHVzaCA9IHZpLmZuKClcbnZpLm1vY2soJ25leHQvbmF2aWdhdGlvbicsICgpID0+ICh7XG4gIHVzZVBhcmFtczogKCkgPT4gKHsgZGF0YXNldElkOiAndGVzdC1kYXRhc2V0LWlkJyB9KSxcbiAgdXNlUm91dGVyOiAoKSA9PiAoeyBwdXNoOiBtb2NrUHVzaCB9KSxcbn0pKVxuXG4vLyBNb2NrIG5leHQvbGlua1xudmkubW9jaygnbmV4dC9saW5rJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2hpbGRyZW4sIGhyZWYsIC4uLnByb3BzIH06IFByb3BzV2l0aENoaWxkcmVuPHsgaHJlZjogc3RyaW5nIH0+KSA9PiAoXG4gICAgPGEgaHJlZj17aHJlZn0gey4uLnByb3BzfT57Y2hpbGRyZW59PC9hPlxuICApLFxufSkpXG5cbi8vIE1vY2sgc2VydmljZSBob29rc1xuY29uc3QgbW9ja1B1Ymxpc2hXb3JrZmxvdyA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUoeyBjcmVhdGVkX2F0OiBEYXRlLm5vdygpIH0pXG5jb25zdCBtb2NrUHVibGlzaEFzQ3VzdG9taXplZFBpcGVsaW5lID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdycsICgpID0+ICh7XG4gIHVzZVB1Ymxpc2hXb3JrZmxvdzogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogbW9ja1B1Ymxpc2hXb3JrZmxvdyxcbiAgfSksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHB1Ymxpc2hlZFBpcGVsaW5lSW5mb1F1ZXJ5S2V5UHJlZml4OiBbJ3BpcGVsaW5lLWluZm8nXSxcbiAgdXNlSW52YWxpZEN1c3RvbWl6ZWRUZW1wbGF0ZUxpc3Q6ICgpID0+IHZpLmZuKCksXG4gIHVzZVB1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZTogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogbW9ja1B1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZSxcbiAgfSksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1iYXNlJywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZDogKCkgPT4gdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2Uva25vd2xlZGdlL3VzZS1kYXRhc2V0JywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZERhdGFzZXRMaXN0OiAoKSA9PiB2aS5mbigpLFxufSkpXG5cbi8vIE1vY2sgY29udGV4dCBob29rc1xuY29uc3QgbW9ja011dGF0ZURhdGFzZXRSZXMgPSB2aS5mbigpXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKCkgPT4gbW9ja011dGF0ZURhdGFzZXRSZXMsXG59KSlcblxuY29uc3QgbW9ja1NldFNob3dQcmljaW5nTW9kYWwgPSB2aS5mbigpXG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dFNlbGVjdG9yOiAoKSA9PiBtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCxcbn0pKVxuXG5sZXQgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlID0gY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlKClcbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUHJvdmlkZXJDb250ZXh0OiAoKSA9PiBtb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUsXG59KSlcblxuLy8gTW9jayBldmVudCBlbWl0dGVyIGNvbnRleHRcbmNvbnN0IG1vY2tFdmVudEVtaXR0ZXIgPSB7XG4gIHVzZVN1YnNjcmlwdGlvbjogdmkuZm4oKSxcbn1cbmxldCBtb2NrRXZlbnRFbWl0dGVyRW5hYmxlZCA9IHRydWVcbnZpLm1vY2soJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJywgKCkgPT4gKHtcbiAgdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQ6ICgpID0+ICh7XG4gICAgZXZlbnRFbWl0dGVyOiBtb2NrRXZlbnRFbWl0dGVyRW5hYmxlZCA/IG1vY2tFdmVudEVtaXR0ZXIgOiB1bmRlZmluZWQsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgaG9va3NcbnZpLm1vY2soJ0AvaG9va3MvdXNlLWFwaS1hY2Nlc3MtdXJsJywgKCkgPT4gKHtcbiAgdXNlRGF0YXNldEFwaUFjY2Vzc1VybDogKCkgPT4gJy9hcGkvZG9jcycsXG59KSlcblxudmkubW9jaygnQC9ob29rcy91c2UtZm9ybWF0LXRpbWUtZnJvbS1ub3cnLCAoKSA9PiAoe1xuICB1c2VGb3JtYXRUaW1lRnJvbU5vdzogKCkgPT4gKHtcbiAgICBmb3JtYXRUaW1lRnJvbU5vdzogKHRzOiBudW1iZXIpID0+IGAke01hdGguZmxvb3IoKERhdGUubm93KCkgLSB0cykgLyAxMDAwKX0gc2Vjb25kcyBhZ29gLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGFtcGxpdHVkZSB0cmFja2luZ1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZScsICgpID0+ICh7XG4gIHRyYWNrRXZlbnQ6IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayB0b2FzdCBjb250ZXh0XG5jb25zdCBtb2NrTm90aWZ5ID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0JywgKCkgPT4gKHtcbiAgdXNlVG9hc3RDb250ZXh0OiAoKSA9PiAoe1xuICAgIG5vdGlmeTogbW9ja05vdGlmeSxcbiAgfSksXG59KSlcblxuLy8gTW9jayB3b3JrZmxvdyB1dGlsc1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscycsICgpID0+ICh7XG4gIGdldEtleWJvYXJkS2V5Q29kZUJ5U3lzdGVtOiAoa2V5OiBzdHJpbmcpID0+IGtleSxcbiAgZ2V0S2V5Ym9hcmRLZXlOYW1lQnlTeXN0ZW06IChrZXk6IHN0cmluZykgPT4ga2V5LFxufSkpXG5cbi8vIE1vY2sgYWhvb2tzXG52aS5tb2NrKCdhaG9va3MnLCAoKSA9PiAoe1xuICB1c2VCb29sZWFuOiAoaW5pdGlhbDogYm9vbGVhbikgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGluaXRpYWxcbiAgICByZXR1cm4gW1xuICAgICAgdmFsdWUsXG4gICAgICB7XG4gICAgICAgIHNldFRydWU6IHZpLmZuKCgpID0+IHsgdmFsdWUgPSB0cnVlIH0pLFxuICAgICAgICBzZXRGYWxzZTogdmkuZm4oKCkgPT4geyB2YWx1ZSA9IGZhbHNlIH0pLFxuICAgICAgICB0b2dnbGU6IHZpLmZuKCgpID0+IHsgdmFsdWUgPSAhdmFsdWUgfSksXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbiAgdXNlS2V5UHJlc3M6IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayBwb3J0YWwgY29tcG9uZW50cyAtIGtlZXAgYWN0dWFsIGJlaGF2aW9yIGZvciBvcGVuIHN0YXRlXG5sZXQgcG9ydGFsT3BlblN0YXRlID0gZmFsc2VcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiAoe1xuICBQb3J0YWxUb0ZvbGxvd0VsZW06ICh7IGNoaWxkcmVuLCBvcGVuLCBvbk9wZW5DaGFuZ2U6IF9vbk9wZW5DaGFuZ2UgfTogUHJvcHNXaXRoQ2hpbGRyZW48e1xuICAgIG9wZW46IGJvb2xlYW5cbiAgICBvbk9wZW5DaGFuZ2U6IChvcGVuOiBib29sZWFuKSA9PiB2b2lkXG4gICAgcGxhY2VtZW50Pzogc3RyaW5nXG4gICAgb2Zmc2V0PzogdW5rbm93blxuICB9PikgPT4ge1xuICAgIHBvcnRhbE9wZW5TdGF0ZSA9IG9wZW5cbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtvcGVufT57Y2hpbGRyZW59PC9kaXY+XG4gIH0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI6ICh7IGNoaWxkcmVuLCBvbkNsaWNrIH06IFByb3BzV2l0aENoaWxkcmVuPHsgb25DbGljaz86ICgpID0+IHZvaWQgfT4pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLXRyaWdnZXJcIiBvbkNsaWNrPXtvbkNsaWNrfT57Y2hpbGRyZW59PC9kaXY+XG4gICksXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ6ICh7IGNoaWxkcmVuIH06IFByb3BzV2l0aENoaWxkcmVuKSA9PiB7XG4gICAgaWYgKCFwb3J0YWxPcGVuU3RhdGUpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIj57Y2hpbGRyZW59PC9kaXY+XG4gIH0sXG59KSlcblxuLy8gTW9jayBQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsXG52aS5tb2NrKCcuLi8uLi9wdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uQ29uZmlybSwgb25DYW5jZWwgfToge1xuICAgIG9uQ29uZmlybTogKG5hbWU6IHN0cmluZywgaWNvbjogdW5rbm93biwgZGVzY3JpcHRpb24/OiBzdHJpbmcpID0+IHZvaWRcbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICAgIGNvbmZpcm1EaXNhYmxlZD86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwdWJsaXNoLWFzLXBpcGVsaW5lLW1vZGFsXCI+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY29uZmlybVwiIG9uQ2xpY2s9eygpID0+IG9uQ29uZmlybSgndGVzdC1uYW1lJywgeyB0eXBlOiAnZW1vamknLCBlbW9qaTogJ/Cfk6YnIH0sICd0ZXN0LWRlc2NyaXB0aW9uJyl9PkNvbmZpcm08L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNhbmNlbH0+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1JhZ1BpcGVsaW5lSGVhZGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBwb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICAgIG1vY2tTdG9yZVN0YXRlID0ge1xuICAgICAgcGlwZWxpbmVJZDogJ3Rlc3QtcGlwZWxpbmUtaWQnLFxuICAgICAgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiBmYWxzZSxcbiAgICAgIHB1Ymxpc2hlZEF0OiAwLFxuICAgICAgZHJhZnRVcGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhOiBudWxsLFxuICAgICAgaXNQcmVwYXJpbmdEYXRhU291cmNlOiBmYWxzZSxcbiAgICAgIHNldFNob3dJbnB1dEZpZWxkUGFuZWw6IG1vY2tTZXRTaG93SW5wdXRGaWVsZFBhbmVsLFxuICAgICAgc2V0U2hvd0VudlBhbmVsOiBtb2NrU2V0U2hvd0VudlBhbmVsLFxuICAgIH1cbiAgICBtb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUgPSBjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lSGVhZGVyIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnd29ya2Zsb3ctaGVhZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5wdXRGaWVsZEJ1dHRvbiBpbiBsZWZ0IHNsb3QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lSGVhZGVyIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWxlZnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2lucHV0RmllbGQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHVibGlzaGVyIGluIG1pZGRsZSBzbG90JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZUhlYWRlciAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1taWRkbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCB2aWV3SGlzdG9yeVByb3BzIHdpdGggcGlwZWxpbmVJZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVIZWFkZXIgLz4pXG4gICAgICBjb25zdCB2aWV3SGlzdG9yeUNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci12aWV3LWhpc3RvcnknKS50ZXh0Q29udGVudFxuICAgICAgZXhwZWN0KHZpZXdIaXN0b3J5Q29udGVudCkudG9Db250YWluKCcvcmFnL3BpcGVsaW5lcy90ZXN0LXBpcGVsaW5lLWlkL3dvcmtmbG93LXJ1bnMnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcHV0ZSB2aWV3SGlzdG9yeVByb3BzIGJhc2VkIG9uIHBpcGVsaW5lSWQnLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IHdpdGggZmlyc3QgcGlwZWxpbmVJZFxuICAgICAgbW9ja1N0b3JlU3RhdGUucGlwZWxpbmVJZCA9ICdwaXBlbGluZS1hbHBoYSdcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxSYWdQaXBlbGluZUhlYWRlciAvPilcbiAgICAgIGxldCB2aWV3SGlzdG9yeUNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci12aWV3LWhpc3RvcnknKS50ZXh0Q29udGVudFxuICAgICAgZXhwZWN0KHZpZXdIaXN0b3J5Q29udGVudCkudG9Db250YWluKCdwaXBlbGluZS1hbHBoYScpXG4gICAgICB1bm1vdW50KClcblxuICAgICAgLy8gVGVzdCB3aXRoIGRpZmZlcmVudCBwaXBlbGluZUlkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5waXBlbGluZUlkID0gJ3BpcGVsaW5lLWJldGEnXG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lSGVhZGVyIC8+KVxuICAgICAgdmlld0hpc3RvcnlDb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItdmlldy1oaXN0b3J5JykudGV4dENvbnRlbnRcbiAgICAgIGV4cGVjdCh2aWV3SGlzdG9yeUNvbnRlbnQpLnRvQ29udGFpbigncGlwZWxpbmUtYmV0YScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBzaG93UnVuQnV0dG9uIGluIHJ1bkFuZEhpc3RvcnlQcm9wcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVIZWFkZXIgLz4pXG4gICAgICBjb25zdCBydW5BbmRIaXN0b3J5Q29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLXJ1bi1hbmQtaGlzdG9yeScpLnRleHRDb250ZW50XG4gICAgICBleHBlY3QocnVuQW5kSGlzdG9yeUNvbnRlbnQpLnRvQ29udGFpbignXCJzaG93UnVuQnV0dG9uXCI6dHJ1ZScpXG4gICAgfSlcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdJbnB1dEZpZWxkQnV0dG9uJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrU3RvcmVTdGF0ZS5zZXRTaG93SW5wdXRGaWVsZFBhbmVsID0gbW9ja1NldFNob3dJbnB1dEZpZWxkUGFuZWxcbiAgICBtb2NrU3RvcmVTdGF0ZS5zZXRTaG93RW52UGFuZWwgPSBtb2NrU2V0U2hvd0VudlBhbmVsXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYnV0dG9uIHdpdGggY29ycmVjdCB0ZXh0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkQnV0dG9uIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvaW5wdXRGaWVsZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNlY29uZGFyeSB2YXJpYW50IHN0eWxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkQnV0dG9uIC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdmbGV4JywgJ2dhcC14LTAuNScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFdmVudCBIYW5kbGVyIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFdmVudCBIYW5kbGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0U2hvd0lucHV0RmllbGRQYW5lbCh0cnVlKSB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPElucHV0RmllbGRCdXR0b24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93SW5wdXRGaWVsZFBhbmVsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0U2hvd0VudlBhbmVsKGZhbHNlKSB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPElucHV0RmllbGRCdXR0b24gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93RW52UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgYm90aCBzdG9yZSBtZXRob2RzIGluIHNlcXVlbmNlIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZEJ1dHRvbiAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBleHBlY3QobW9ja1NldFNob3dJbnB1dEZpZWxkUGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93RW52UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgc2V0U2hvd0lucHV0RmllbGRQYW5lbCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUuc2V0U2hvd0lucHV0RmllbGRQYW5lbCA9IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHR5cGVvZiBtb2NrU2V0U2hvd0lucHV0RmllbGRQYW5lbFxuXG4gICAgICByZW5kZXIoPElucHV0RmllbGRCdXR0b24gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgdGhyb3cgd2hlbiBjbGlja2VkXG4gICAgICBleHBlY3QoKCkgPT4gZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnUHVibGlzaGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBwb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHB1Ymxpc2ggYnV0dG9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoZXIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24ucHVibGlzaC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHByaW1hcnkgdmFyaWFudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaGVyIC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdweC0yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcG9ydGFsIHRyaWdnZXIgZWxlbWVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaGVyIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZXJhY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQgd2hlbiBvcGVuaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoZXIgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU3luY1dvcmtmbG93RHJhZnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9nZ2xlIG9wZW4gc3RhdGUgd2hlbiB0cmlnZ2VyIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hlciAvPilcblxuICAgICAgY29uc3QgcG9ydGFsID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpXG4gICAgICBleHBlY3QocG9ydGFsKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3BlbicsICdmYWxzZScpXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFmdGVyIGNsaWNrLCBoYW5kbGVPcGVuQ2hhbmdlIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU3luY1dvcmtmbG93RHJhZnQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnUG9wdXAnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tTdG9yZVN0YXRlLnB1Ymxpc2hlZEF0ID0gMFxuICAgIG1vY2tTdG9yZVN0YXRlLmRyYWZ0VXBkYXRlZEF0ID0gRGF0ZS5ub3coKVxuICAgIG1vY2tTdG9yZVN0YXRlLnBpcGVsaW5lSWQgPSAndGVzdC1waXBlbGluZS1pZCdcbiAgICBtb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUgPSBjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUoe1xuICAgICAgaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGU6IHRydWUsXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwb3B1cCBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBvcHVwIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB1bnB1Ymxpc2hlZCBzdGF0ZSB3aGVuIHB1Ymxpc2hlZEF0IGlzIDAnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5wdWJsaXNoZWRBdCA9IDBcblxuICAgICAgcmVuZGVyKDxQb3B1cCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3dvcmtmbG93LmNvbW1vbi5jdXJyZW50RHJhZnRVbnB1Ymxpc2hlZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgcHVibGlzaGVkIHN0YXRlIHdoZW4gcHVibGlzaGVkQXQgaXMgc2V0JywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHVibGlzaGVkQXQgPSBEYXRlLm5vdygpIC0gNjAwMDBcblxuICAgICAgcmVuZGVyKDxQb3B1cCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3dvcmtmbG93LmNvbW1vbi5sYXRlc3RQdWJsaXNoZWQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIga2V5Ym9hcmQgc2hvcnRjdXRzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQb3B1cCAvPilcblxuICAgICAgLy8gU2hvdWxkIHNob3cgdGhlIGtleWJvYXJkIHNob3J0Y3V0IGtleXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjdHJsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfih6cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1AnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBnb1RvQWRkRG9jdW1lbnRzIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9waXBlbGluZS5jb21tb24uZ29Ub0FkZERvY3VtZW50cy9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBBUEkgcmVmZXJlbmNlIGxpbmsnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBvcHVwIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvd29ya2Zsb3cuY29tbW9uLmFjY2Vzc0FQSVJlZmVyZW5jZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwdWJsaXNoIGFzIHRlbXBsYXRlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9waXBlbGluZS5jb21tb24ucHVibGlzaEFzL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCdXR0b24gU3RhdGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0J1dHRvbiBTdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGdvVG9BZGREb2N1bWVudHMgd2hlbiBub3QgcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHVibGlzaGVkQXQgPSAwXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5nb1RvQWRkRG9jdW1lbnRzL2kpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBnb1RvQWRkRG9jdW1lbnRzIHdoZW4gcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHVibGlzaGVkQXQgPSBEYXRlLm5vdygpXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5nb1RvQWRkRG9jdW1lbnRzL2kpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHB1Ymxpc2ggYXMgdGVtcGxhdGUgd2hlbiBub3QgcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHVibGlzaGVkQXQgPSAwXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5wdWJsaXNoQXMvaSkuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcmVtaXVtIEJhZGdlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcmVtaXVtIEJhZGdlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBwcmVtaXVtIGJhZGdlIHdoZW4gbm90IGFsbG93ZWQgdG8gcHVibGlzaCBhcyB0ZW1wbGF0ZScsICgpID0+IHtcbiAgICAgIG1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSA9IGNyZWF0ZU1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSh7XG4gICAgICAgIGlzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nLnVwZ3JhZGVCdG4uZW5jb3VyYWdlU2hvcnQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBwcmVtaXVtIGJhZGdlIHdoZW4gYWxsb3dlZCB0byBwdWJsaXNoIGFzIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgICAgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlID0gY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlKHtcbiAgICAgICAgaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBvcHVwIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9iaWxsaW5nLnVwZ3JhZGVCdG4uZW5jb3VyYWdlU2hvcnQvaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2ggd2hlbiBwdWJsaXNoIGJ1dHRvbiBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQb3B1cCAvPilcblxuICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kpLmNsb3Nlc3QoJ2J1dHRvbicpIVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5hdmlnYXRlIHRvIGFkZCBkb2N1bWVudHMgd2hlbiBnb1RvQWRkRG9jdW1lbnRzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5wdWJsaXNoZWRBdCA9IERhdGUubm93KClcblxuICAgICAgcmVuZGVyKDxQb3B1cCAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmUuY29tbW9uLmdvVG9BZGREb2N1bWVudHMvaSkuY2xvc2VzdCgnYnV0dG9uJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvdGVzdC1kYXRhc2V0LWlkL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBwcmljaW5nIG1vZGFsIHdoZW4gY2xpY2tpbmcgcHVibGlzaCBhcyB0ZW1wbGF0ZSB3aXRob3V0IHBlcm1pc3Npb24nLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5wdWJsaXNoZWRBdCA9IERhdGUubm93KClcbiAgICAgIG1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSA9IGNyZWF0ZU1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSh7XG4gICAgICAgIGlzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5wdWJsaXNoQXMvaSkuY2xvc2VzdCgnYnV0dG9uJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQXV0by1zYXZlIERpc3BsYXkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0F1dG8tc2F2ZSBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBhdXRvLXNhdmVkIHRpbWUgd2hlbiBub3QgcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHVibGlzaGVkQXQgPSAwXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kcmFmdFVwZGF0ZWRBdCA9IERhdGUubm93KCkgLSA1MDAwXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24uYXV0b1NhdmVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBwdWJsaXNoZWQgdGltZSB3aGVuIHB1Ymxpc2hlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnB1Ymxpc2hlZEF0ID0gRGF0ZS5ub3coKSAtIDYwMDAwXG5cbiAgICAgIHJlbmRlcig8UG9wdXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24ucHVibGlzaGVkQXQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ1J1bk1vZGUnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSBudWxsXG4gICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gZmFsc2VcbiAgICBtb2NrRXZlbnRFbWl0dGVyRW5hYmxlZCA9IHRydWVcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBydW4gYnV0dG9uIHdpdGggZGVmYXVsdCB0ZXh0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9waXBlbGluZS5jb21tb24udGVzdFJ1bi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGN1c3RvbSB0ZXh0IHByb3AnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJ1bk1vZGUgdGV4dD1cIkN1c3RvbSBSdW5cIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbSBSdW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBrZXlib2FyZCBzaG9ydGN1dHMgd2hlbiBub3QgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhbHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUnVubmluZyBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUnVubmluZyBTdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHByb2Nlc3Npbmcgc3RhdGUgd2hlbiBydW5uaW5nJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmUuY29tbW9uLnByb2Nlc3NpbmcvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHN0b3AgYnV0dG9uIHdoZW4gcnVubmluZycsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgLy8gVGhlcmUgc2hvdWxkIGJlIHR3byBidXR0b25zOiBydW4gYnV0dG9uIGFuZCBzdG9wIGJ1dHRvblxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9ucy5sZW5ndGgpLnRvQmUoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlUnVuIHRleHQgd2hlbiB3b3JrZmxvdyBoYXMgcnVuIGJlZm9yZScsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmUuY29tbW9uLnJlUnVuL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBwcmVwYXJpbmcgZGF0YSBzb3VyY2Ugc3RhdGUnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5pc1ByZXBhcmluZ0RhdGFTb3VyY2UgPSB0cnVlXG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5wcmVwYXJpbmdEYXRhU291cmNlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjYW5jZWwgYnV0dG9uIHdoZW4gcHJlcGFyaW5nIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gdHJ1ZVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyByZVJ1biB0ZXh0IHdoZW4gd29ya2Zsb3cgc3RhdHVzIGlzIEZhaWxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5GYWlsZWQgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmUuY29tbW9uLnJlUnVuL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyByZVJ1biB0ZXh0IHdoZW4gd29ya2Zsb3cgc3RhdHVzIGlzIFN0b3BwZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3RvcHBlZCB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9waXBlbGluZS5jb21tb24ucmVSdW4vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlUnVuIHRleHQgd2hlbiB3b3JrZmxvdyBzdGF0dXMgaXMgV2FpdGluZycsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5XYWl0aW5nIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lLmNvbW1vbi5yZVJ1bi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHN0b3AgYnV0dG9uIHdoZW4gc3RhdHVzIGlzIG5vdCBSdW5uaW5nJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIC8vIFNob3VsZCBvbmx5IGhhdmUgb25lIGJ1dHRvbiAocnVuIGJ1dHRvbilcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIGJ1dHRvbiB3aGVuIHN0YXR1cyBpcyBTdWNjZWVkZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3VjY2VlZGVkIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChydW5CdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBidXR0b24gd2hlbiBzdGF0dXMgaXMgRmFpbGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLkZhaWxlZCB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERpc2FibGVkIFN0YXRlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdEaXNhYmxlZCBTdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBkaXNhYmxlZCB3aGVuIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpWzBdXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJlIGRpc2FibGVkIHdoZW4gcHJlcGFyaW5nIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gdHJ1ZVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpWzBdXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGtleWJvYXJkIHNob3J0Y3V0cyB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdhbHQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEludGVyYWN0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93IHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVN0b3BSdW4gd2hlbiBzdG9wIGJ1dHRvbiBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyBDbGljayB0aGUgc3RvcCBidXR0b24gKHNlY29uZCBidXR0b24pXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzFdKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVN0b3BSdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0YXNrLTEyMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FuY2VsIHByZXBhcmluZyBkYXRhIHNvdXJjZSB3aGVuIGNhbmNlbCBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gdHJ1ZVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIC8vIENsaWNrIHRoZSBjYW5jZWwgYnV0dG9uIChzZWNvbmQgYnV0dG9uKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1sxXSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93RGVidWdBbmRQcmV2aWV3UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlU3RvcFJ1biB3aXRoIGVtcHR5IHN0cmluZyB3aGVuIHRhc2tfaWQgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogdW5kZWZpbmVkIGFzIHVua25vd24gYXMgc3RyaW5nLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbnNbMV0pIC8vIENsaWNrIHN0b3AgYnV0dG9uXG5cbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlU3RvcFJ1bikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3cgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylbMF1cbiAgICAgIGZpcmVFdmVudC5jbGljayhydW5CdXR0b24pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgYmUgY2FsbGVkIGJlY2F1c2UgYnV0dG9uIGlzIGRpc2FibGVkXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFdmVudCBFbWl0dGVyIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFdmVudCBFbWl0dGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3Vic2NyaWJlIHRvIGV2ZW50IGVtaXR0ZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrRXZlbnRFbWl0dGVyLnVzZVN1YnNjcmlwdGlvbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTdG9wUnVuIHdoZW4gRVZFTlRfV09SS0ZMT1dfU1RPUCBldmVudCBpcyBlbWl0dGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stNDU2JyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgLy8gQ2FwdHVyZSB0aGUgc3Vic2NyaXB0aW9uIGNhbGxiYWNrXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uQ2FsbGJhY2s6ICgodjogeyB0eXBlOiBzdHJpbmcgfSkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuICAgICAgbW9ja0V2ZW50RW1pdHRlci51c2VTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChjYWxsYmFjazogKHY6IHsgdHlwZTogc3RyaW5nIH0pID0+IHZvaWQpID0+IHtcbiAgICAgICAgc3Vic2NyaXB0aW9uQ2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyBTaW11bGF0ZSB0aGUgRVZFTlRfV09SS0ZMT1dfU1RPUCBldmVudCAoYWN0dWFsIHZhbHVlIGlzICdXT1JLRkxPV19TVE9QJylcbiAgICAgIGV4cGVjdChzdWJzY3JpcHRpb25DYWxsYmFjaykubm90LnRvQmVOdWxsKClcbiAgICAgIHN1YnNjcmlwdGlvbkNhbGxiYWNrISh7IHR5cGU6ICdXT1JLRkxPV19TVE9QJyB9KVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVN0b3BSdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0YXNrLTQ1NicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlU3RvcFJ1biBmb3Igb3RoZXIgZXZlbnQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay03ODknLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICBsZXQgc3Vic2NyaXB0aW9uQ2FsbGJhY2s6ICgodjogeyB0eXBlOiBzdHJpbmcgfSkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuICAgICAgbW9ja0V2ZW50RW1pdHRlci51c2VTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChjYWxsYmFjazogKHY6IHsgdHlwZTogc3RyaW5nIH0pID0+IHZvaWQpID0+IHtcbiAgICAgICAgc3Vic2NyaXB0aW9uQ2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyBTaW11bGF0ZSBhIGRpZmZlcmVudCBldmVudCB0eXBlXG4gICAgICBzdWJzY3JpcHRpb25DYWxsYmFjayEoeyB0eXBlOiAnc29tZV9vdGhlcl9ldmVudCcgfSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTdG9wUnVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBldmVudEVtaXR0ZXIgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIG1vY2tFdmVudEVtaXR0ZXJFbmFibGVkID0gZmFsc2VcblxuICAgICAgLy8gU2hvdWxkIG5vdCB0aHJvdyB3aGVuIGV2ZW50RW1pdHRlciBpcyB1bmRlZmluZWRcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPFJ1bk1vZGUgLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHN1YnNjcmliZSB3aGVuIGV2ZW50RW1pdHRlciBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrRXZlbnRFbWl0dGVyRW5hYmxlZCA9IGZhbHNlXG4gICAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyB1c2VTdWJzY3JpcHRpb24gc2hvdWxkIG5vdCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChtb2NrRXZlbnRFbWl0dGVyLnVzZVN1YnNjcmlwdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3R5bGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0eWxlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgcm91bmRlZC1tZCBjbGFzcyB3aGVuIG5vdCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLW1kJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJvdW5kZWQtbC1tZCBjbGFzcyB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBjb25zdCBydW5CdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVswXVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9IYXZlQ2xhc3MoJ3JvdW5kZWQtbC1tZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjdXJzb3Itbm90LWFsbG93ZWQgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IHRydWVcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBjb25zdCBydW5CdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVswXVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9IYXZlQ2xhc3MoJ2N1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBiZy1zdGF0ZS1hY2NlbnQtaG92ZXIgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IHRydWVcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBjb25zdCBydW5CdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVswXVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JnLXN0YXRlLWFjY2VudC1ob3ZlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBiZy1zdGF0ZS1hY2NlbnQtYWN0aXZlIG9uIHN0b3AgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBjb25zdCBzdG9wQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylbMV1cbiAgICAgIGV4cGVjdChzdG9wQnV0dG9uKS50b0hhdmVDbGFzcygnYmctc3RhdGUtYWNjZW50LWFjdGl2ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSByb3VuZGVkLXItbWQgb24gc3RvcCBidXR0b24nLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IHN0b3BCdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVsxXVxuICAgICAgZXhwZWN0KHN0b3BCdXR0b24pLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLXItbWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2l6ZS03IG9uIHN0b3AgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBjb25zdCBzdG9wQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylbMV1cbiAgICAgIGV4cGVjdChzdG9wQnV0dG9uKS50b0hhdmVDbGFzcygnc2l6ZS03JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgYmFzZSBjbGFzc2VzIG9uIHJ1biBidXR0b24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS50b0hhdmVDbGFzcygnc3lzdGVtLXhzLW1lZGl1bScpXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS50b0hhdmVDbGFzcygnaC03JylcbiAgICAgIGV4cGVjdChydW5CdXR0b24pLnRvSGF2ZUNsYXNzKCdweC0xLjUnKVxuICAgICAgZXhwZWN0KHJ1bkJ1dHRvbikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1hY2NlbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgZ2FwLXgtcHggb24gY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2dhcC14LXB4JylcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2l0ZW1zLWNlbnRlcicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIGluIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBSdW5Nb2RlIGlzIGV4cG9ydGVkIGFzIGRlZmF1bHQgZnJvbSBydW4tbW9kZS50c3ggd2l0aCBSZWFjdC5tZW1vXG4gICAgICAvLyBXZSBjYW4gdmVyaWZ5IGl0J3MgbWVtb2l6ZWQgYnkgY2hlY2tpbmcgdGhlIGNvbXBvbmVudCdzICQkdHlwZW9mIHN5bWJvbFxuICAgICAgZXhwZWN0KChSdW5Nb2RlIGFzIHVua25vd24gYXMgeyAkJHR5cGVvZjogc3ltYm9sIH0pLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcG9ydGFsT3BlblN0YXRlID0gZmFsc2VcbiAgICBtb2NrU3RvcmVTdGF0ZSA9IHtcbiAgICAgIHBpcGVsaW5lSWQ6ICd0ZXN0LXBpcGVsaW5lLWlkJyxcbiAgICAgIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogZmFsc2UsXG4gICAgICBwdWJsaXNoZWRBdDogMCxcbiAgICAgIGRyYWZ0VXBkYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YTogbnVsbCxcbiAgICAgIGlzUHJlcGFyaW5nRGF0YVNvdXJjZTogZmFsc2UsXG4gICAgICBzZXRTaG93SW5wdXRGaWVsZFBhbmVsOiBtb2NrU2V0U2hvd0lucHV0RmllbGRQYW5lbCxcbiAgICAgIHNldFNob3dFbnZQYW5lbDogbW9ja1NldFNob3dFbnZQYW5lbCxcbiAgICB9XG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGNoaWxkIGNvbXBvbmVudHMgaW4gUmFnUGlwZWxpbmVIZWFkZXInLCAoKSA9PiB7XG4gICAgcmVuZGVyKDxSYWdQaXBlbGluZUhlYWRlciAvPilcblxuICAgIC8vIElucHV0RmllbGRCdXR0b25cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvaW5wdXRGaWVsZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgLy8gUHVibGlzaGVyICh2aWEgaGVhZGVyLW1pZGRsZSBzbG90KVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1taWRkbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IGhpc3RvcnkgVVJMIGJhc2VkIG9uIHBpcGVsaW5lSWQnLCAoKSA9PiB7XG4gICAgbW9ja1N0b3JlU3RhdGUucGlwZWxpbmVJZCA9ICdjdXN0b20tcGlwZWxpbmUtMTIzJ1xuXG4gICAgcmVuZGVyKDxSYWdQaXBlbGluZUhlYWRlciAvPilcblxuICAgIGNvbnN0IHZpZXdIaXN0b3J5Q29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLXZpZXctaGlzdG9yeScpLnRleHRDb250ZW50XG4gICAgZXhwZWN0KHZpZXdIaXN0b3J5Q29udGVudCkudG9Db250YWluKCcvcmFnL3BpcGVsaW5lcy9jdXN0b20tcGlwZWxpbmUtMTIzL3dvcmtmbG93LXJ1bnMnKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRWRnZSBDYXNlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdOdWxsL1VuZGVmaW5lZCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCB3b3JrZmxvd1J1bm5pbmdEYXRhJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IG51bGxcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmUuY29tbW9uLnRlc3RSdW4vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcGlwZWxpbmVJZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnBpcGVsaW5lSWQgPSAnJ1xuXG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lSGVhZGVyIC8+KVxuXG4gICAgICBjb25zdCB2aWV3SGlzdG9yeUNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci12aWV3LWhpc3RvcnknKS50ZXh0Q29udGVudFxuICAgICAgZXhwZWN0KHZpZXdIaXN0b3J5Q29udGVudCkudG9Db250YWluKCcvcmFnL3BpcGVsaW5lcy8vd29ya2Zsb3ctcnVucycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgd2hlbiByZXN1bHQgaXMgdW5kZWZpbmVkIGluIHdvcmtmbG93UnVubmluZ0RhdGEnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMgfSxcbiAgICAgIH1cblxuICAgICAgLy8gQ29tcG9uZW50IHdpbGwgY3Jhc2ggd2hlbiBhY2Nlc3NpbmcgcmVzdWx0LnN0YXR1cyAtIHRoaXMgZG9jdW1lbnRzIGN1cnJlbnQgYmVoYXZpb3JcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPFJ1bk1vZGUgLz4pKS50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSdW5Nb2RlIEVkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAvLyBFbnN1cmUgY2xlYW4gc3RhdGUgZm9yIGVhY2ggdGVzdFxuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IG51bGxcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IGZhbHNlXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJvdGggaXNQcmVwYXJpbmdEYXRhU291cmNlIGFuZCBpc1J1bm5pbmcgYmVpbmcgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIFRoaXMgc2hvdWxkbid0IGhhcHBlbiBpbiBwcmFjdGljZSwgYnV0IHRlc3QgdGhlIHByaW9yaXR5XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5pc1ByZXBhcmluZ0RhdGFTb3VyY2UgPSB0cnVlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIC8vIEJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpWzBdXG4gICAgICBleHBlY3QocnVuQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdGVzdFJ1biB0ZXh0IHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyBudWxsJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IG51bGxcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IGZhbHNlXG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgLy8gVmVyaWZ5IHRoZSBidXR0b24gaXMgZW5hYmxlZCBhbmQgc2hvd3MgdGVzdFJ1biB0ZXh0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICBleHBlY3QoYnV0dG9uLnRleHRDb250ZW50KS50b0NvbnRhaW4oJ3BpcGVsaW5lLmNvbW1vbi50ZXN0UnVuJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY3VzdG9tIHRleHQgd2hlbiBwcm92aWRlZCBhbmQgd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyBudWxsJywgKCkgPT4ge1xuICAgICAgbW9ja1N0b3JlU3RhdGUud29ya2Zsb3dSdW5uaW5nRGF0YSA9IG51bGxcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IGZhbHNlXG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSB0ZXh0PVwiU3RhcnQgUGlwZWxpbmVcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0YXJ0IFBpcGVsaW5lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlUnVuIGluc3RlYWQgb2YgY3VzdG9tIHRleHQgd2hlbiB3b3JrZmxvd1J1bm5pbmdEYXRhIGV4aXN0cycsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLndvcmtmbG93UnVubmluZ0RhdGEgPSB7XG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIHJlc3VsdDogeyBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQgfSxcbiAgICAgIH1cbiAgICAgIG1vY2tTdG9yZVN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IGZhbHNlXG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSB0ZXh0PVwiU3RhcnQgUGlwZWxpbmVcIiAvPilcblxuICAgICAgLy8gU2hvdWxkIHNob3cgcmVSdW4sIG5vdCBjdXN0b20gdGV4dFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24udGV4dENvbnRlbnQpLnRvQ29udGFpbigncGlwZWxpbmUuY29tbW9uLnJlUnVuJylcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1N0YXJ0IFBpcGVsaW5lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBrZXlib2FyZCBzaG9ydGN1dHMgd2l0aCBjb3JyZWN0IHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0gbnVsbFxuICAgICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gZmFsc2VcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyBWZXJpZnkga2V5Ym9hcmQgc2hvcnRjdXQgZWxlbWVudHMgZXhpc3RcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhbHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBzdHJ1Y3R1cmUgd2l0aCBwbGF5IGljb24gd2hlbiBub3QgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0gbnVsbFxuICAgICAgbW9ja1N0b3JlU3RhdGUuaXNQcmVwYXJpbmdEYXRhU291cmNlID0gZmFsc2VcblxuICAgICAgcmVuZGVyKDxSdW5Nb2RlIC8+KVxuXG4gICAgICAvLyBTaG91bGQgaGF2ZSBzdmcgaWNvbiBpbiB0aGUgYnV0dG9uXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBzdHJ1Y3R1cmUgd2l0aCBsb2FkZXIgaWNvbiB3aGVuIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS53b3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICByZXN1bHQ6IHsgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPFJ1bk1vZGUgLz4pXG5cbiAgICAgIC8vIFNob3VsZCBoYXZlIGFuaW1hdGUtc3BpbiBjbGFzcyBvbiB0aGUgbG9hZGVyIGljb25cbiAgICAgIGNvbnN0IHJ1bkJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpWzBdXG4gICAgICBjb25zdCBzcGlubmluZ0ljb24gPSBydW5CdXR0b24ucXVlcnlTZWxlY3RvcignLmFuaW1hdGUtc3BpbicpXG4gICAgICBleHBlY3Qoc3Bpbm5pbmdJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHN0cnVjdHVyZSB3aXRoIGRhdGFiYXNlIGljb24gd2hlbiBwcmVwYXJpbmcgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5pc1ByZXBhcmluZ0RhdGFTb3VyY2UgPSB0cnVlXG5cbiAgICAgIHJlbmRlcig8UnVuTW9kZSAvPilcblxuICAgICAgY29uc3QgcnVuQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylbMF1cbiAgICAgIGV4cGVjdChydW5CdXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCb3VuZGFyeSBDb25kaXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHplcm8gZHJhZnRVcGRhdGVkQXQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5wdWJsaXNoZWRBdCA9IDBcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRyYWZ0VXBkYXRlZEF0ID0gMFxuXG4gICAgICByZW5kZXIoPFBvcHVwIC8+KVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24uYXV0b1NhdmVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgb2xkIHB1Ymxpc2hlZEF0IHRpbWVzdGFtcCcsICgpID0+IHtcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnB1Ymxpc2hlZEF0ID0gMVxuXG4gICAgICByZW5kZXIoPFBvcHVwIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvd29ya2Zsb3cuY29tbW9uLmxhdGVzdFB1Ymxpc2hlZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19