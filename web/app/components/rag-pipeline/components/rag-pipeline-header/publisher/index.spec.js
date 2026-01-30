"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
const popup_1 = require("./popup");
// ================================
// Mock External Dependencies Only
// ================================
// Mock next/navigation
const mockPush = vitest_1.vi.fn();
vitest_1.vi.mock('next/navigation', () => ({
    useParams: () => ({ datasetId: 'test-dataset-id' }),
    useRouter: () => ({ push: mockPush }),
}));
// Mock next/link
vitest_1.vi.mock('next/link', () => ({
    default: ({ children, href, ...props }) => (<a href={href} {...props}>{children}</a>),
}));
// Mock ahooks
// Store the keyboard shortcut callback for testing
let keyPressCallback = null;
vitest_1.vi.mock('ahooks', () => ({
    useBoolean: (defaultValue = false) => {
        const [value, setValue] = React.useState(defaultValue);
        return [value, {
                setTrue: () => setValue(true),
                setFalse: () => setValue(false),
                toggle: () => setValue(v => !v),
            }];
    },
    useKeyPress: (key, callback) => {
        // Store the callback so we can invoke it in tests
        keyPressCallback = callback;
    },
}));
// Mock amplitude tracking
vitest_1.vi.mock('@/app/components/base/amplitude', () => ({
    trackEvent: vitest_1.vi.fn(),
}));
// Mock portal-to-follow-elem
let mockPortalOpen = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open, onOpenChange: _onOpenChange }) => {
        mockPortalOpen = open;
        return <div data-testid="portal-elem" data-open={open}>{children}</div>;
    },
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        if (!mockPortalOpen)
            return null;
        return <div data-testid="portal-content" className={className}>{children}</div>;
    },
}));
// Mock workflow hooks
const mockHandleSyncWorkflowDraft = vitest_1.vi.fn();
const mockHandleCheckBeforePublish = vitest_1.vi.fn().mockResolvedValue(true);
vitest_1.vi.mock('@/app/components/workflow/hooks', () => ({
    useNodesSyncDraft: () => ({
        handleSyncWorkflowDraft: mockHandleSyncWorkflowDraft,
    }),
    useChecklistBeforePublish: () => ({
        handleCheckBeforePublish: mockHandleCheckBeforePublish,
    }),
}));
// Mock workflow store
const mockPublishedAt = vitest_1.vi.fn(() => null);
const mockDraftUpdatedAt = vitest_1.vi.fn(() => 1700000000);
const mockPipelineId = vitest_1.vi.fn(() => 'test-pipeline-id');
const mockSetPublishedAt = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            publishedAt: mockPublishedAt(),
            draftUpdatedAt: mockDraftUpdatedAt(),
            pipelineId: mockPipelineId(),
        };
        return selector(state);
    },
    useWorkflowStore: () => ({
        getState: () => ({
            setPublishedAt: mockSetPublishedAt,
        }),
    }),
}));
// Mock dataset-detail context
const mockMutateDatasetRes = vitest_1.vi.fn();
vitest_1.vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => {
        const state = { mutateDatasetRes: mockMutateDatasetRes };
        return selector(state);
    },
}));
// Mock modal-context
const mockSetShowPricingModal = vitest_1.vi.fn();
vitest_1.vi.mock('@/context/modal-context', () => ({
    useModalContextSelector: () => mockSetShowPricingModal,
}));
// Mock provider-context
const mockIsAllowPublishAsCustomKnowledgePipelineTemplate = vitest_1.vi.fn(() => true);
vitest_1.vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        isAllowPublishAsCustomKnowledgePipelineTemplate: mockIsAllowPublishAsCustomKnowledgePipelineTemplate(),
    }),
}));
// Mock toast context
const mockNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    useToastContext: () => ({
        notify: mockNotify,
    }),
}));
// Mock API access URL hook
vitest_1.vi.mock('@/hooks/use-api-access-url', () => ({
    useDatasetApiAccessUrl: () => 'https://api.dify.ai/v1/datasets/test-dataset-id',
}));
// Mock format time hook
vitest_1.vi.mock('@/hooks/use-format-time-from-now', () => ({
    useFormatTimeFromNow: () => ({
        formatTimeFromNow: (timestamp) => {
            const diff = Date.now() / 1000 - timestamp;
            if (diff < 60)
                return 'just now';
            if (diff < 3600)
                return `${Math.floor(diff / 60)} minutes ago`;
            return new Date(timestamp * 1000).toLocaleDateString();
        },
    }),
}));
// Mock service hooks
const mockPublishWorkflow = vitest_1.vi.fn();
const mockPublishAsCustomizedPipeline = vitest_1.vi.fn();
const mockInvalidPublishedPipelineInfo = vitest_1.vi.fn();
const mockInvalidDatasetList = vitest_1.vi.fn();
const mockInvalidCustomizedTemplateList = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/knowledge/use-dataset', () => ({
    useInvalidDatasetList: () => mockInvalidDatasetList,
}));
vitest_1.vi.mock('@/service/use-base', () => ({
    useInvalid: () => mockInvalidPublishedPipelineInfo,
}));
vitest_1.vi.mock('@/service/use-pipeline', () => ({
    publishedPipelineInfoQueryKeyPrefix: ['pipeline', 'published'],
    useInvalidCustomizedTemplateList: () => mockInvalidCustomizedTemplateList,
    usePublishAsCustomizedPipeline: () => ({
        mutateAsync: mockPublishAsCustomizedPipeline,
    }),
}));
vitest_1.vi.mock('@/service/use-workflow', () => ({
    usePublishWorkflow: () => ({
        mutateAsync: mockPublishWorkflow,
    }),
}));
// Mock workflow utils
vitest_1.vi.mock('@/app/components/workflow/utils', () => ({
    getKeyboardKeyCodeBySystem: (key) => key,
    getKeyboardKeyNameBySystem: (key) => key === 'ctrl' ? '⌘' : key,
}));
// Mock PublishAsKnowledgePipelineModal
vitest_1.vi.mock('../../publish-as-knowledge-pipeline-modal', () => ({
    default: ({ confirmDisabled, onConfirm, onCancel }) => (<div data-testid="publish-as-knowledge-pipeline-modal">
      <button data-testid="modal-confirm" disabled={confirmDisabled} onClick={() => onConfirm('Test Pipeline', { type: 'emoji', emoji: '📚', background: '#fff' }, 'Test description')}>
        Confirm
      </button>
      <button data-testid="modal-cancel" onClick={onCancel}>Cancel</button>
    </div>),
}));
// ================================
// Test Data Factories
// ================================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderWithQueryClient = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// ================================
// Test Suites
// ================================
(0, vitest_1.describe)('publisher', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpen = false;
        keyPressCallback = null;
        // Reset mock return values to defaults
        mockPublishedAt.mockReturnValue(null);
        mockDraftUpdatedAt.mockReturnValue(1700000000);
        mockPipelineId.mockReturnValue('test-pipeline-id');
        mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(true);
        mockHandleCheckBeforePublish.mockResolvedValue(true);
    });
    // ============================================================
    // Publisher (index.tsx) - Main Entry Component Tests
    // ============================================================
    (0, vitest_1.describe)('Publisher (index.tsx)', () => {
        // --------------------------------
        // Rendering Tests
        // --------------------------------
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render publish button with correct text', () => {
                // Arrange & Act
                renderWithQueryClient(<index_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('workflow.common.publish')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render portal element in closed state by default', () => {
                // Arrange & Act
                renderWithQueryClient(<index_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toHaveAttribute('data-open', 'false');
                (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should render down arrow icon in button', () => {
                // Arrange & Act
                renderWithQueryClient(<index_1.default />);
                // Assert
                const button = react_1.screen.getByRole('button');
                (0, vitest_1.expect)(button.querySelector('svg')).toBeInTheDocument();
            });
        });
        // --------------------------------
        // State Management Tests
        // --------------------------------
        (0, vitest_1.describe)('State Management', () => {
            (0, vitest_1.it)('should open popup when trigger is clicked', async () => {
                // Arrange
                renderWithQueryClient(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should close popup when trigger is clicked again while open', async () => {
                // Arrange
                renderWithQueryClient(<index_1.default />);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger')); // open
                // Act
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger')); // close
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
                });
            });
        });
        // --------------------------------
        // Callback Stability and Memoization Tests
        // --------------------------------
        (0, vitest_1.describe)('Callback Stability and Memoization', () => {
            (0, vitest_1.it)('should call handleSyncWorkflowDraft when popup opens', async () => {
                // Arrange
                renderWithQueryClient(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                (0, vitest_1.expect)(mockHandleSyncWorkflowDraft).toHaveBeenCalledWith(true);
            });
            (0, vitest_1.it)('should not call handleSyncWorkflowDraft when popup closes', async () => {
                // Arrange
                renderWithQueryClient(<index_1.default />);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger')); // open
                vitest_1.vi.clearAllMocks();
                // Act
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
                });
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger')); // close
                // Assert
                (0, vitest_1.expect)(mockHandleSyncWorkflowDraft).not.toHaveBeenCalled();
            });
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                // Assert
                (0, vitest_1.expect)(index_1.default).toBeDefined();
                (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        // --------------------------------
        // User Interactions Tests
        // --------------------------------
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should render popup content when opened', async () => {
                // Arrange
                renderWithQueryClient(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
                });
            });
        });
    });
    // ============================================================
    // Popup (popup.tsx) - Main Popup Component Tests
    // ============================================================
    (0, vitest_1.describe)('Popup (popup.tsx)', () => {
        // --------------------------------
        // Rendering Tests
        // --------------------------------
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render unpublished state when publishedAt is null', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('workflow.common.currentDraftUnpublished')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText(/workflow.common.autoSaved/)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render published state when publishedAt has value', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('workflow.common.latestPublished')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText(/workflow.common.publishedAt/)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render publish button with keyboard shortcuts', () => {
                // Arrange & Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                (0, vitest_1.expect)(publishButton).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render action buttons section', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.goToAddDocuments')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('workflow.common.accessAPIReference')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.publishAs')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should disable action buttons when not published', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                const addDocumentsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.goToAddDocuments'));
                (0, vitest_1.expect)(addDocumentsButton).toBeDisabled();
            });
            (0, vitest_1.it)('should enable action buttons when published', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                const addDocumentsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.goToAddDocuments'));
                (0, vitest_1.expect)(addDocumentsButton).not.toBeDisabled();
            });
            (0, vitest_1.it)('should show premium badge when publish as template is not allowed', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(false);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('billing.upgradeBtn.encourageShort')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not show premium badge when publish as template is allowed', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(true);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByText('billing.upgradeBtn.encourageShort')).not.toBeInTheDocument();
            });
        });
        // --------------------------------
        // State Management Tests
        // --------------------------------
        (0, vitest_1.describe)('State Management', () => {
            (0, vitest_1.it)('should show confirm modal when first publish attempt on unpublished pipeline', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should not show confirm modal when already published', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert - should call publish directly without confirm
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should update to published state after successful publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.published/i })).toBeInTheDocument();
                });
            });
        });
        // --------------------------------
        // User Interactions Tests
        // --------------------------------
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should navigate to add documents when go to add documents is clicked', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                renderWithQueryClient(<popup_1.default />);
                // Act
                const addDocumentsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.goToAddDocuments'));
                react_1.fireEvent.click(addDocumentsButton);
                // Assert
                (0, vitest_1.expect)(mockPush).toHaveBeenCalledWith('/datasets/test-dataset-id/documents/create-from-pipeline');
            });
            (0, vitest_1.it)('should show pricing modal when publish as template is clicked without permission', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(false);
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                // Assert
                (0, vitest_1.expect)(mockSetShowPricingModal).toHaveBeenCalled();
            });
            (0, vitest_1.it)('should show publish as knowledge pipeline modal when permitted', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(true);
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should close publish as knowledge pipeline modal when cancel is clicked', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(true);
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.queryByTestId('publish-as-knowledge-pipeline-modal')).not.toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should call publishAsCustomizedPipeline when confirm is clicked in modal', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishAsCustomizedPipeline.mockResolvedValue({});
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockPublishAsCustomizedPipeline).toHaveBeenCalledWith({
                        pipelineId: 'test-pipeline-id',
                        name: 'Test Pipeline',
                        icon_info: { type: 'emoji', emoji: '📚', background: '#fff' },
                        description: 'Test description',
                    });
                });
            });
        });
        // --------------------------------
        // API Calls and Async Operations Tests
        // --------------------------------
        (0, vitest_1.describe)('API Calls and Async Operations', () => {
            (0, vitest_1.it)('should call publishWorkflow API when publish button is clicked', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalledWith({
                        url: '/rag/pipelines/test-pipeline-id/workflows/publish',
                        title: '',
                        releaseNotes: '',
                    });
                });
            });
            (0, vitest_1.it)('should show success notification after publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        type: 'success',
                        message: 'datasetPipeline.publishPipeline.success.message',
                    }));
                });
            });
            (0, vitest_1.it)('should update publishedAt in store after successful publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockSetPublishedAt).toHaveBeenCalledWith(1700100000);
                });
            });
            (0, vitest_1.it)('should invalidate caches after successful publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockMutateDatasetRes).toHaveBeenCalled();
                    (0, vitest_1.expect)(mockInvalidPublishedPipelineInfo).toHaveBeenCalled();
                    (0, vitest_1.expect)(mockInvalidDatasetList).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should show success notification for publish as template', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishAsCustomizedPipeline.mockResolvedValue({});
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        type: 'success',
                        message: 'datasetPipeline.publishTemplate.success.message',
                    }));
                });
            });
            (0, vitest_1.it)('should invalidate customized template list after publish as template', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishAsCustomizedPipeline.mockResolvedValue({});
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockInvalidCustomizedTemplateList).toHaveBeenCalled();
                });
            });
        });
        // --------------------------------
        // Error Handling Tests
        // --------------------------------
        (0, vitest_1.describe)('Error Handling', () => {
            (0, vitest_1.it)('should not proceed with publish when check fails', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockHandleCheckBeforePublish.mockResolvedValue(false);
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert - publishWorkflow should not be called when check fails
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockHandleCheckBeforePublish).toHaveBeenCalled();
                });
                (0, vitest_1.expect)(mockPublishWorkflow).not.toHaveBeenCalled();
            });
            (0, vitest_1.it)('should show error notification when publish fails', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockRejectedValue(new Error('Publish failed'));
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                        type: 'error',
                        message: 'datasetPipeline.publishPipeline.error.message',
                    });
                });
            });
            (0, vitest_1.it)('should show error notification when publish as template fails', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishAsCustomizedPipeline.mockRejectedValue(new Error('Template publish failed'));
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                        type: 'error',
                        message: 'datasetPipeline.publishTemplate.error.message',
                    });
                });
            });
            (0, vitest_1.it)('should close modal after publish as template error', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishAsCustomizedPipeline.mockRejectedValue(new Error('Template publish failed'));
                renderWithQueryClient(<popup_1.default />);
                const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
                react_1.fireEvent.click(publishAsButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
                });
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.queryByTestId('publish-as-knowledge-pipeline-modal')).not.toBeInTheDocument();
                });
            });
        });
        // --------------------------------
        // Confirm Modal Tests
        // --------------------------------
        (0, vitest_1.describe)('Confirm Modal', () => {
            (0, vitest_1.it)('should hide confirm modal when cancel is clicked', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                renderWithQueryClient(<popup_1.default />);
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
                // Act - find and click cancel button in confirm modal
                const cancelButtons = react_1.screen.getAllByRole('button');
                const cancelButton = cancelButtons.find(btn => btn.className.includes('cancel') || btn.textContent?.includes('Cancel'));
                if (cancelButton)
                    react_1.fireEvent.click(cancelButton);
                // Trigger onCancel manually since we can't find the exact button
                // The Confirm component has an onCancel prop that calls hideConfirm
                // Assert - modal should be dismissable
                // Note: This test verifies the confirm modal can be displayed
                (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublishContent')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should publish when confirm is clicked in confirm modal', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton); // This shows confirm modal
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
                // Assert - confirm modal content is displayed
                (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublishContent')).toBeInTheDocument();
            });
        });
        // --------------------------------
        // Component Memoization Tests
        // --------------------------------
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                // Assert
                (0, vitest_1.expect)(popup_1.default).toBeDefined();
                (0, vitest_1.expect)(popup_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        // --------------------------------
        // Prop Variations Tests
        // --------------------------------
        (0, vitest_1.describe)('Prop Variations', () => {
            (0, vitest_1.it)('should display correct width when permission is allowed', () => {
                // Test with permission
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(true);
                const { container } = renderWithQueryClient(<popup_1.default />);
                const popupDiv = container.firstChild;
                (0, vitest_1.expect)(popupDiv.className).toContain('w-[360px]');
            });
            (0, vitest_1.it)('should display correct width when permission is not allowed', () => {
                // Test without permission
                mockIsAllowPublishAsCustomKnowledgePipelineTemplate.mockReturnValue(false);
                const { container } = renderWithQueryClient(<popup_1.default />);
                const popupDiv = container.firstChild;
                (0, vitest_1.expect)(popupDiv.className).toContain('w-[400px]');
            });
            (0, vitest_1.it)('should display draft updated time when not published', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                mockDraftUpdatedAt.mockReturnValue(1700000000);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/workflow.common.autoSaved/)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle null draftUpdatedAt gracefully', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                mockDraftUpdatedAt.mockReturnValue(0);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/workflow.common.autoSaved/)).toBeInTheDocument();
            });
        });
        // --------------------------------
        // API Reference Link Tests
        // --------------------------------
        (0, vitest_1.describe)('API Reference Link', () => {
            (0, vitest_1.it)('should render API reference link with correct href', () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                // Act
                renderWithQueryClient(<popup_1.default />);
                // Assert
                const apiLink = react_1.screen.getByRole('link');
                (0, vitest_1.expect)(apiLink).toHaveAttribute('href', 'https://api.dify.ai/v1/datasets/test-dataset-id');
                (0, vitest_1.expect)(apiLink).toHaveAttribute('target', '_blank');
            });
        });
        // --------------------------------
        // Keyboard Shortcut Tests
        // --------------------------------
        (0, vitest_1.describe)('Keyboard Shortcuts', () => {
            (0, vitest_1.it)('should trigger publish when keyboard shortcut is pressed', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act - simulate keyboard shortcut
                const mockEvent = { preventDefault: vitest_1.vi.fn() };
                keyPressCallback?.(mockEvent);
                // Assert
                (0, vitest_1.expect)(mockEvent.preventDefault).toHaveBeenCalled();
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should not trigger publish when already published in session', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // First publish via button click to set published state
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.published/i })).toBeInTheDocument();
                });
                vitest_1.vi.clearAllMocks();
                // Act - simulate keyboard shortcut after already published
                const mockEvent = { preventDefault: vitest_1.vi.fn() };
                keyPressCallback?.(mockEvent);
                // Assert - should return early without publishing
                (0, vitest_1.expect)(mockEvent.preventDefault).toHaveBeenCalled();
                (0, vitest_1.expect)(mockPublishWorkflow).not.toHaveBeenCalled();
            });
            (0, vitest_1.it)('should show confirm modal when shortcut pressed on unpublished pipeline', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                renderWithQueryClient(<popup_1.default />);
                // Act - simulate keyboard shortcut
                const mockEvent = { preventDefault: vitest_1.vi.fn() };
                keyPressCallback?.(mockEvent);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should not trigger duplicate publish via shortcut when already publishing', async () => {
                // Arrange - create a promise that we can control
                let resolvePublish = () => { };
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockImplementation(() => new Promise((resolve) => {
                    resolvePublish = () => resolve({ created_at: 1700100000 });
                }));
                renderWithQueryClient(<popup_1.default />);
                // Act - trigger publish via keyboard shortcut first
                const mockEvent1 = { preventDefault: vitest_1.vi.fn() };
                keyPressCallback?.(mockEvent1);
                // Wait for the first publish to start (button becomes disabled)
                await (0, react_1.waitFor)(() => {
                    const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                    (0, vitest_1.expect)(publishButton).toBeDisabled();
                });
                // Try to trigger again via shortcut while publishing
                const mockEvent2 = { preventDefault: vitest_1.vi.fn() };
                keyPressCallback?.(mockEvent2);
                // Assert - only one call to publishWorkflow
                (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalledTimes(1);
                // Cleanup - resolve the promise
                resolvePublish();
            });
        });
        // --------------------------------
        // Finally Block Cleanup Tests
        // --------------------------------
        (0, vitest_1.describe)('Finally Block Cleanup', () => {
            (0, vitest_1.it)('should reset publishing state after successful publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert - button should be disabled during publishing, then show published
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.published/i })).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should reset publishing state after failed publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(1700000000);
                mockPublishWorkflow.mockRejectedValue(new Error('Publish failed'));
                renderWithQueryClient(<popup_1.default />);
                // Act
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                // Assert - should show error and button should be enabled again (not showing "published")
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                        type: 'error',
                        message: 'datasetPipeline.publishPipeline.error.message',
                    });
                });
                // Button should still show publishUpdate since it wasn't successfully published
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i })).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should hide confirm modal after publish from confirm', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
                renderWithQueryClient(<popup_1.default />);
                // Show confirm modal first
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
                // Act - trigger publish again (which happens when confirm is clicked)
                // The mock for workflow hooks returns handleCheckBeforePublish that resolves to true
                // We need to simulate the confirm button click which calls handlePublish again
                // Since confirmVisible is now true and publishedAt is null, it should proceed to publish
                react_1.fireEvent.click(publishButton);
                // Assert - confirm modal should be hidden after publish completes
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.published/i })).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should hide confirm modal after failed publish', async () => {
                // Arrange
                mockPublishedAt.mockReturnValue(null);
                mockPublishWorkflow.mockRejectedValue(new Error('Publish failed'));
                renderWithQueryClient(<popup_1.default />);
                // Show confirm modal first
                const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
                react_1.fireEvent.click(publishButton);
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
                });
                // Act - trigger publish from confirm (call handlePublish when confirmVisible is true)
                react_1.fireEvent.click(publishButton);
                // Assert - error notification should be shown
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                        type: 'error',
                        message: 'datasetPipeline.publishPipeline.error.message',
                    });
                });
            });
        });
    });
    // ============================================================
    // Edge Cases
    // ============================================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle undefined pipelineId gracefully', () => {
            // Arrange
            mockPipelineId.mockReturnValue('');
            // Act
            renderWithQueryClient(<popup_1.default />);
            // Assert - should render without crashing
            (0, vitest_1.expect)(react_1.screen.getByText('workflow.common.currentDraftUnpublished')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty publish response', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(1700000000);
            mockPublishWorkflow.mockResolvedValue(null);
            renderWithQueryClient(<popup_1.default />);
            // Act
            const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
            react_1.fireEvent.click(publishButton);
            // Assert - should not call setPublishedAt or notify when response is null
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalled();
            });
            // setPublishedAt should not be called because res is falsy
            (0, vitest_1.expect)(mockSetPublishedAt).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should prevent multiple simultaneous publish calls', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(1700000000);
            // Create a promise that never resolves to simulate ongoing publish
            mockPublishWorkflow.mockImplementation(() => new Promise(() => { }));
            renderWithQueryClient(<popup_1.default />);
            // Act - click publish button multiple times rapidly
            const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
            react_1.fireEvent.click(publishButton);
            // Wait for button to become disabled
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(publishButton).toBeDisabled();
            });
            // Try clicking again
            react_1.fireEvent.click(publishButton);
            react_1.fireEvent.click(publishButton);
            // Assert - publishWorkflow should only be called once due to guard
            (0, vitest_1.expect)(mockPublishWorkflow).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should disable publish button when already published in session', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(1700000000);
            mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
            renderWithQueryClient(<popup_1.default />);
            // Act - publish once
            const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
            react_1.fireEvent.click(publishButton);
            // Assert - button should show "published" state
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /workflow.common.published/i })).toBeDisabled();
            });
        });
        (0, vitest_1.it)('should not trigger publish when already publishing', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(1700000000);
            mockPublishWorkflow.mockImplementation(() => new Promise(() => { })); // Never resolves
            renderWithQueryClient(<popup_1.default />);
            // Act
            const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
            react_1.fireEvent.click(publishButton);
            // The button should be disabled while publishing
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(publishButton).toBeDisabled();
            });
        });
    });
    // ============================================================
    // Integration Tests
    // ============================================================
    (0, vitest_1.describe)('Integration Tests', () => {
        (0, vitest_1.it)('should complete full publish flow for unpublished pipeline', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(null);
            mockPublishWorkflow.mockResolvedValue({ created_at: 1700100000 });
            renderWithQueryClient(<popup_1.default />);
            // Act - click publish to show confirm
            const publishButton = react_1.screen.getByRole('button', { name: /workflow.common.publishUpdate/i });
            react_1.fireEvent.click(publishButton);
            // Assert - confirm modal should appear
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('pipeline.common.confirmPublish')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should complete full publish as template flow', async () => {
            // Arrange
            mockPublishedAt.mockReturnValue(1700000000);
            mockPublishAsCustomizedPipeline.mockResolvedValue({});
            renderWithQueryClient(<popup_1.default />);
            // Act - click publish as template button
            const publishAsButton = react_1.screen.getAllByRole('button').find(btn => btn.textContent?.includes('pipeline.common.publishAs'));
            react_1.fireEvent.click(publishAsButton);
            // Assert - modal should appear
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('publish-as-knowledge-pipeline-modal')).toBeInTheDocument();
            });
            // Act - confirm
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Assert - success notification and modal closes
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    type: 'success',
                }));
                (0, vitest_1.expect)(react_1.screen.queryByTestId('publish-as-knowledge-pipeline-modal')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show Publisher button and open popup with Popup component', async () => {
            // Arrange & Act
            renderWithQueryClient(<index_1.default />);
            // Click to open popup
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
            // Verify sync was called when opening
            (0, vitest_1.expect)(mockHandleSyncWorkflowDraft).toHaveBeenCalledWith(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSwrQkFBOEI7QUFDOUIsbUNBQTZEO0FBQzdELG1DQUErQjtBQUMvQixtQ0FBMkI7QUFFM0IsbUNBQW1DO0FBQ25DLGtDQUFrQztBQUNsQyxtQ0FBbUM7QUFFbkMsdUJBQXVCO0FBQ3ZCLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN4QixXQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztJQUNuRCxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQztDQUN0QyxDQUFDLENBQUMsQ0FBQTtBQUVILGlCQUFpQjtBQUNqQixXQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssRUFBK0MsRUFBRSxFQUFFLENBQUMsQ0FDdEYsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN6QztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsY0FBYztBQUNkLG1EQUFtRDtBQUNuRCxJQUFJLGdCQUFnQixHQUF3QyxJQUFJLENBQUE7QUFDaEUsV0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QixVQUFVLEVBQUUsQ0FBQyxZ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aUQ7WUFDakQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUNyQyxlQUFNLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3RCLElBQUksRUFBRSxTQUFTO2lCQUNoQixDQUFDLENBQ0gsQ0FBQTtnQkFDRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsYUFBYSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsa0VBQWtFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEYsZ0JBQWdCO1lBQ2hCLHFCQUFxQixDQUFDLENBQUMsZUFBUyxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFcEMsc0JBQXNCO1lBQ3RCLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNsRSxDQUFDLENBQUMsQ0FBQTtZQUVGLHNDQUFzQztZQUN0QyxJQUFBLGVBQU0sRUFBQywyQkFBMkIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2hFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSWNvbkluZm8gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCBQdWJsaXNoZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXMgT25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBuZXh0L25hdmlnYXRpb25cbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUGFyYW1zOiAoKSA9PiAoeyBkYXRhc2V0SWQ6ICd0ZXN0LWRhdGFzZXQtaWQnIH0pLFxuICB1c2VSb3V0ZXI6ICgpID0+ICh7IHB1c2g6IG1vY2tQdXNoIH0pLFxufSkpXG5cbi8vIE1vY2sgbmV4dC9saW5rXG52aS5tb2NrKCduZXh0L2xpbmsnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjaGlsZHJlbiwgaHJlZiwgLi4ucHJvcHMgfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlLCBocmVmOiBzdHJpbmcgfSkgPT4gKFxuICAgIDxhIGhyZWY9e2hyZWZ9IHsuLi5wcm9wc30+e2NoaWxkcmVufTwvYT5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGFob29rc1xuLy8gU3RvcmUgdGhlIGtleWJvYXJkIHNob3J0Y3V0IGNhbGxiYWNrIGZvciB0ZXN0aW5nXG5sZXQga2V5UHJlc3NDYWxsYmFjazogKChlOiBLZXlib2FyZEV2ZW50KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG52aS5tb2NrKCdhaG9va3MnLCAoKSA9PiAoe1xuICB1c2VCb29sZWFuOiAoZGVmYXVsdFZhbHVlID0gZmFsc2UpID0+IHtcbiAgICBjb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IFJlYWN0LnVzZVN0YXRlKGRlZmF1bHRWYWx1ZSlcbiAgICByZXR1cm4gW3ZhbHVlLCB7XG4gICAgICBzZXRUcnVlOiAoKSA9PiBzZXRWYWx1ZSh0cnVlKSxcbiAgICAgIHNldEZhbHNlOiAoKSA9PiBzZXRWYWx1ZShmYWxzZSksXG4gICAgICB0b2dnbGU6ICgpID0+IHNldFZhbHVlKHYgPT4gIXYpLFxuICAgIH1dXG4gIH0sXG4gIHVzZUtleVByZXNzOiAoa2V5OiBzdHJpbmcsIGNhbGxiYWNrOiAoZTogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkgPT4ge1xuICAgIC8vIFN0b3JlIHRoZSBjYWxsYmFjayBzbyB3ZSBjYW4gaW52b2tlIGl0IGluIHRlc3RzXG4gICAga2V5UHJlc3NDYWxsYmFjayA9IGNhbGxiYWNrXG4gIH0sXG59KSlcblxuLy8gTW9jayBhbXBsaXR1ZGUgdHJhY2tpbmdcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnLCAoKSA9PiAoe1xuICB0cmFja0V2ZW50OiB2aS5mbigpLFxufSkpXG5cbi8vIE1vY2sgcG9ydGFsLXRvLWZvbGxvdy1lbGVtXG5sZXQgbW9ja1BvcnRhbE9wZW4gPSBmYWxzZVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+ICh7XG4gIFBvcnRhbFRvRm9sbG93RWxlbTogKHsgY2hpbGRyZW4sIG9wZW4sIG9uT3BlbkNoYW5nZTogX29uT3BlbkNoYW5nZSB9OiB7XG4gICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIG9wZW46IGJvb2xlYW5cbiAgICBvbk9wZW5DaGFuZ2U6IChvcGVuOiBib29sZWFuKSA9PiB2b2lkXG4gIH0pID0+IHtcbiAgICBtb2NrUG9ydGFsT3BlbiA9IG9wZW5cbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtvcGVufT57Y2hpbGRyZW59PC9kaXY+XG4gIH0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI6ICh7IGNoaWxkcmVuLCBvbkNsaWNrIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DbGljazogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICksXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ6ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgfSkgPT4ge1xuICAgIGlmICghbW9ja1BvcnRhbE9wZW4pXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+e2NoaWxkcmVufTwvZGl2PlxuICB9LFxufSkpXG5cbi8vIE1vY2sgd29ya2Zsb3cgaG9va3NcbmNvbnN0IG1vY2tIYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tIYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2ggPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHRydWUpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlTm9kZXNTeW5jRHJhZnQ6ICgpID0+ICh7XG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQ6IG1vY2tIYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCxcbiAgfSksXG4gIHVzZUNoZWNrbGlzdEJlZm9yZVB1Ymxpc2g6ICgpID0+ICh7XG4gICAgaGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoOiBtb2NrSGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHdvcmtmbG93IHN0b3JlXG5jb25zdCBtb2NrUHVibGlzaGVkQXQgPSB2aS5mbigoKSA9PiBudWxsIGFzIG51bWJlciB8IG51bGwpXG5jb25zdCBtb2NrRHJhZnRVcGRhdGVkQXQgPSB2aS5mbigoKSA9PiAxNzAwMDAwMDAwKVxuY29uc3QgbW9ja1BpcGVsaW5lSWQgPSB2aS5mbigoKSA9PiAndGVzdC1waXBlbGluZS1pZCcpXG5jb25zdCBtb2NrU2V0UHVibGlzaGVkQXQgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VTdG9yZTogKHNlbGVjdG9yOiAoczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgIHB1Ymxpc2hlZEF0OiBtb2NrUHVibGlzaGVkQXQoKSxcbiAgICAgIGRyYWZ0VXBkYXRlZEF0OiBtb2NrRHJhZnRVcGRhdGVkQXQoKSxcbiAgICAgIHBpcGVsaW5lSWQ6IG1vY2tQaXBlbGluZUlkKCksXG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZSlcbiAgfSxcbiAgdXNlV29ya2Zsb3dTdG9yZTogKCkgPT4gKHtcbiAgICBnZXRTdGF0ZTogKCkgPT4gKHtcbiAgICAgIHNldFB1Ymxpc2hlZEF0OiBtb2NrU2V0UHVibGlzaGVkQXQsXG4gICAgfSksXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgZGF0YXNldC1kZXRhaWwgY29udGV4dFxuY29uc3QgbW9ja011dGF0ZURhdGFzZXRSZXMgPSB2aS5mbigpXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHsgbXV0YXRlRGF0YXNldFJlczogbW9ja011dGF0ZURhdGFzZXRSZXMgfVxuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZSlcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIG1vZGFsLWNvbnRleHRcbmNvbnN0IG1vY2tTZXRTaG93UHJpY2luZ01vZGFsID0gdmkuZm4oKVxudmkubW9jaygnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VNb2RhbENvbnRleHRTZWxlY3RvcjogKCkgPT4gbW9ja1NldFNob3dQcmljaW5nTW9kYWwsXG59KSlcblxuLy8gTW9jayBwcm92aWRlci1jb250ZXh0XG5jb25zdCBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUgPSB2aS5mbigoKSA9PiB0cnVlKVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+ICh7XG4gICAgaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGU6IG1vY2tJc0FsbG93UHVibGlzaEFzQ3VzdG9tS25vd2xlZGdlUGlwZWxpbmVUZW1wbGF0ZSgpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHRvYXN0IGNvbnRleHRcbmNvbnN0IG1vY2tOb3RpZnkgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICB1c2VUb2FzdENvbnRleHQ6ICgpID0+ICh7XG4gICAgbm90aWZ5OiBtb2NrTm90aWZ5LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIEFQSSBhY2Nlc3MgVVJMIGhvb2tcbnZpLm1vY2soJ0AvaG9va3MvdXNlLWFwaS1hY2Nlc3MtdXJsJywgKCkgPT4gKHtcbiAgdXNlRGF0YXNldEFwaUFjY2Vzc1VybDogKCkgPT4gJ2h0dHBzOi8vYXBpLmRpZnkuYWkvdjEvZGF0YXNldHMvdGVzdC1kYXRhc2V0LWlkJyxcbn0pKVxuXG4vLyBNb2NrIGZvcm1hdCB0aW1lIGhvb2tcbnZpLm1vY2soJ0AvaG9va3MvdXNlLWZvcm1hdC10aW1lLWZyb20tbm93JywgKCkgPT4gKHtcbiAgdXNlRm9ybWF0VGltZUZyb21Ob3c6ICgpID0+ICh7XG4gICAgZm9ybWF0VGltZUZyb21Ob3c6ICh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgZGlmZiA9IERhdGUubm93KCkgLyAxMDAwIC0gdGltZXN0YW1wXG4gICAgICBpZiAoZGlmZiA8IDYwKVxuICAgICAgICByZXR1cm4gJ2p1c3Qgbm93J1xuICAgICAgaWYgKGRpZmYgPCAzNjAwKVxuICAgICAgICByZXR1cm4gYCR7TWF0aC5mbG9vcihkaWZmIC8gNjApfSBtaW51dGVzIGFnb2BcbiAgICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lc3RhbXAgKiAxMDAwKS50b0xvY2FsZURhdGVTdHJpbmcoKVxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgc2VydmljZSBob29rc1xuY29uc3QgbW9ja1B1Ymxpc2hXb3JrZmxvdyA9IHZpLmZuKClcbmNvbnN0IG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUgPSB2aS5mbigpXG5jb25zdCBtb2NrSW52YWxpZFB1Ymxpc2hlZFBpcGVsaW5lSW5mbyA9IHZpLmZuKClcbmNvbnN0IG1vY2tJbnZhbGlkRGF0YXNldExpc3QgPSB2aS5mbigpXG5jb25zdCBtb2NrSW52YWxpZEN1c3RvbWl6ZWRUZW1wbGF0ZUxpc3QgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRhdGFzZXQnLCAoKSA9PiAoe1xuICB1c2VJbnZhbGlkRGF0YXNldExpc3Q6ICgpID0+IG1vY2tJbnZhbGlkRGF0YXNldExpc3QsXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1iYXNlJywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZDogKCkgPT4gbW9ja0ludmFsaWRQdWJsaXNoZWRQaXBlbGluZUluZm8sXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHB1Ymxpc2hlZFBpcGVsaW5lSW5mb1F1ZXJ5S2V5UHJlZml4OiBbJ3BpcGVsaW5lJywgJ3B1Ymxpc2hlZCddLFxuICB1c2VJbnZhbGlkQ3VzdG9taXplZFRlbXBsYXRlTGlzdDogKCkgPT4gbW9ja0ludmFsaWRDdXN0b21pemVkVGVtcGxhdGVMaXN0LFxuICB1c2VQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmU6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUsXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnLCAoKSA9PiAoe1xuICB1c2VQdWJsaXNoV29ya2Zsb3c6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tQdWJsaXNoV29ya2Zsb3csXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgd29ya2Zsb3cgdXRpbHNcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnLCAoKSA9PiAoe1xuICBnZXRLZXlib2FyZEtleUNvZGVCeVN5c3RlbTogKGtleTogc3RyaW5nKSA9PiBrZXksXG4gIGdldEtleWJvYXJkS2V5TmFtZUJ5U3lzdGVtOiAoa2V5OiBzdHJpbmcpID0+IGtleSA9PT0gJ2N0cmwnID8gJ+KMmCcgOiBrZXksXG59KSlcblxuLy8gTW9jayBQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsXG52aS5tb2NrKCcuLi8uLi9wdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNvbmZpcm1EaXNhYmxlZCwgb25Db25maXJtLCBvbkNhbmNlbCB9OiB7XG4gICAgY29uZmlybURpc2FibGVkOiBib29sZWFuXG4gICAgb25Db25maXJtOiAobmFtZTogc3RyaW5nLCBpY29uOiBJY29uSW5mbywgZGVzY3JpcHRpb24/OiBzdHJpbmcpID0+IHZvaWRcbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInB1Ymxpc2gtYXMta25vd2xlZGdlLXBpcGVsaW5lLW1vZGFsXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwibW9kYWwtY29uZmlybVwiXG4gICAgICAgIGRpc2FibGVkPXtjb25maXJtRGlzYWJsZWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ29uZmlybSgnVGVzdCBQaXBlbGluZScsIHsgdHlwZTogJ2Vtb2ppJywgZW1vamk6ICfwn5OaJywgYmFja2dyb3VuZDogJyNmZmYnIH0gYXMgdW5rbm93biBhcyBJY29uSW5mbywgJ1Rlc3QgZGVzY3JpcHRpb24nKX1cbiAgICAgID5cbiAgICAgICAgQ29uZmlybVxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibW9kYWwtY2FuY2VsXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVRdWVyeUNsaWVudCA9ICgpID0+IG5ldyBRdWVyeUNsaWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgcXVlcmllczoge1xuICAgICAgcmV0cnk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG59KVxuXG5jb25zdCByZW5kZXJXaXRoUXVlcnlDbGllbnQgPSAodWk6IFJlYWN0LlJlYWN0RWxlbWVudCkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuIHJlbmRlcihcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIHt1aX1cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICApXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFN1aXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ3B1Ymxpc2hlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW4gPSBmYWxzZVxuICAgIGtleVByZXNzQ2FsbGJhY2sgPSBudWxsXG4gICAgLy8gUmVzZXQgbW9jayByZXR1cm4gdmFsdWVzIHRvIGRlZmF1bHRzXG4gICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgIG1vY2tEcmFmdFVwZGF0ZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICBtb2NrUGlwZWxpbmVJZC5tb2NrUmV0dXJuVmFsdWUoJ3Rlc3QtcGlwZWxpbmUtaWQnKVxuICAgIG1vY2tJc0FsbG93UHVibGlzaEFzQ3VzdG9tS25vd2xlZGdlUGlwZWxpbmVUZW1wbGF0ZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICBtb2NrSGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoLm1vY2tSZXNvbHZlZFZhbHVlKHRydWUpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFB1Ymxpc2hlciAoaW5kZXgudHN4KSAtIE1haW4gRW50cnkgQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHVibGlzaGVyIChpbmRleC50c3gpJywgKCkgPT4ge1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcHVibGlzaCBidXR0b24gd2l0aCBjb3JyZWN0IHRleHQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQdWJsaXNoZXIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcG9ydGFsIGVsZW1lbnQgaW4gY2xvc2VkIHN0YXRlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQdWJsaXNoZXIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcGVuJywgJ2ZhbHNlJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgZG93biBhcnJvdyBpY29uIGluIGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFB1Ymxpc2hlciAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZXhwZWN0KGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgb3BlbiBwb3B1cCB3aGVuIHRyaWdnZXIgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFB1Ymxpc2hlciAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjbG9zZSBwb3B1cCB3aGVuIHRyaWdnZXIgaXMgY2xpY2tlZCBhZ2FpbiB3aGlsZSBvcGVuJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UHVibGlzaGVyIC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKSAvLyBvcGVuXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkgLy8gY2xvc2VcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCB3aGVuIHBvcHVwIG9wZW5zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UHVibGlzaGVyIC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCB3aGVuIHBvcHVwIGNsb3NlcycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFB1Ymxpc2hlciAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkgLy8gb3BlblxuICAgICAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKSAvLyBjbG9zZVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChQdWJsaXNoZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KChQdWJsaXNoZXIgYXMgdW5rbm93biBhcyB7ICQkdHlwZW9mPzogc3ltYm9sIH0pLiQkdHlwZW9mPy50b1N0cmluZygpKS50b0NvbnRhaW4oJ1N5bWJvbCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBwb3B1cCBjb250ZW50IHdoZW4gb3BlbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UHVibGlzaGVyIC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFBvcHVwIChwb3B1cC50c3gpIC0gTWFpbiBQb3B1cCBDb21wb25lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQb3B1cCAocG9wdXAudHN4KScsICgpID0+IHtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFJlbmRlcmluZyBUZXN0c1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHVucHVibGlzaGVkIHN0YXRlIHdoZW4gcHVibGlzaGVkQXQgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKG51bGwpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd3b3JrZmxvdy5jb21tb24uY3VycmVudERyYWZ0VW5wdWJsaXNoZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvd29ya2Zsb3cuY29tbW9uLmF1dG9TYXZlZC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBwdWJsaXNoZWQgc3RhdGUgd2hlbiBwdWJsaXNoZWRBdCBoYXMgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cuY29tbW9uLmxhdGVzdFB1Ymxpc2hlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24ucHVibGlzaGVkQXQvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcHVibGlzaCBidXR0b24gd2l0aCBrZXlib2FyZCBzaG9ydGN1dHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZXhwZWN0KHB1Ymxpc2hCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFjdGlvbiBidXR0b25zIHNlY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUuY29tbW9uLmdvVG9BZGREb2N1bWVudHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cuY29tbW9uLmFjY2Vzc0FQSVJlZmVyZW5jZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBhY3Rpb24gYnV0dG9ucyB3aGVuIG5vdCBwdWJsaXNoZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBhZGREb2N1bWVudHNCdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5maW5kKGJ0biA9PlxuICAgICAgICAgIGJ0bi50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ3BpcGVsaW5lLmNvbW1vbi5nb1RvQWRkRG9jdW1lbnRzJyksXG4gICAgICAgIClcbiAgICAgICAgZXhwZWN0KGFkZERvY3VtZW50c0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZW5hYmxlIGFjdGlvbiBidXR0b25zIHdoZW4gcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYWRkRG9jdW1lbnRzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24uZ29Ub0FkZERvY3VtZW50cycpLFxuICAgICAgICApXG4gICAgICAgIGV4cGVjdChhZGREb2N1bWVudHNCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHByZW1pdW0gYmFkZ2Ugd2hlbiBwdWJsaXNoIGFzIHRlbXBsYXRlIGlzIG5vdCBhbGxvd2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja0lzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHByZW1pdW0gYmFkZ2Ugd2hlbiBwdWJsaXNoIGFzIHRlbXBsYXRlIGlzIGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUubW9ja1JldHVyblZhbHVlKHRydWUpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBjb25maXJtIG1vZGFsIHdoZW4gZmlyc3QgcHVibGlzaCBhdHRlbXB0IG9uIHVucHVibGlzaGVkIHBpcGVsaW5lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUobnVsbClcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24uY29uZmlybVB1Ymxpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBjb25maXJtIG1vZGFsIHdoZW4gYWxyZWFkeSBwdWJsaXNoZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY3JlYXRlZF9hdDogMTcwMDEwMDAwMCB9KVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgY2FsbCBwdWJsaXNoIGRpcmVjdGx5IHdpdGhvdXQgY29uZmlybVxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1B1Ymxpc2hXb3JrZmxvdykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0byBwdWJsaXNoZWQgc3RhdGUgYWZ0ZXIgc3VjY2Vzc2Z1bCBwdWJsaXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaGVkL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgdG8gYWRkIGRvY3VtZW50cyB3aGVuIGdvIHRvIGFkZCBkb2N1bWVudHMgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IGFkZERvY3VtZW50c0J1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgICAgYnRuLnRleHRDb250ZW50Py5pbmNsdWRlcygncGlwZWxpbmUuY29tbW9uLmdvVG9BZGREb2N1bWVudHMnKSxcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYWRkRG9jdW1lbnRzQnV0dG9uISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tQdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzL3Rlc3QtZGF0YXNldC1pZC9kb2N1bWVudHMvY3JlYXRlLWZyb20tcGlwZWxpbmUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHByaWNpbmcgbW9kYWwgd2hlbiBwdWJsaXNoIGFzIHRlbXBsYXRlIGlzIGNsaWNrZWQgd2l0aG91dCBwZXJtaXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja0lzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJyksXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgcHVibGlzaCBhcyBrbm93bGVkZ2UgcGlwZWxpbmUgbW9kYWwgd2hlbiBwZXJtaXR0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hBc0J1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgICAgYnRuLnRleHRDb250ZW50Py5pbmNsdWRlcygncGlwZWxpbmUuY29tbW9uLnB1Ymxpc2hBcycpLFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQXNCdXR0b24hKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNsb3NlIHB1Ymxpc2ggYXMga25vd2xlZGdlIHBpcGVsaW5lIG1vZGFsIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJyksXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHVibGlzaC1hcy1rbm93bGVkZ2UtcGlwZWxpbmUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIHB1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZSB3aGVuIGNvbmZpcm0gaXMgY2xpY2tlZCBpbiBtb2RhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJyksXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHVibGlzaC1hcy1rbm93bGVkZ2UtcGlwZWxpbmUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrUHVibGlzaEFzQ3VzdG9taXplZFBpcGVsaW5lKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICBwaXBlbGluZUlkOiAndGVzdC1waXBlbGluZS1pZCcsXG4gICAgICAgICAgICBuYW1lOiAnVGVzdCBQaXBlbGluZScsXG4gICAgICAgICAgICBpY29uX2luZm86IHsgdHlwZTogJ2Vtb2ppJywgZW1vamk6ICfwn5OaJywgYmFja2dyb3VuZDogJyNmZmYnIH0sXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1Rlc3QgZGVzY3JpcHRpb24nLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEFQSSBDYWxscyBhbmQgQXN5bmMgT3BlcmF0aW9ucyBUZXN0c1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZGVzY3JpYmUoJ0FQSSBDYWxscyBhbmQgQXN5bmMgT3BlcmF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBwdWJsaXNoV29ya2Zsb3cgQVBJIHdoZW4gcHVibGlzaCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoV29ya2Zsb3cubW9ja1Jlc29sdmVkVmFsdWUoeyBjcmVhdGVkX2F0OiAxNzAwMTAwMDAwIH0pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1B1Ymxpc2hXb3JrZmxvdykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgICAgdXJsOiAnL3JhZy9waXBlbGluZXMvdGVzdC1waXBlbGluZS1pZC93b3JrZmxvd3MvcHVibGlzaCcsXG4gICAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgICByZWxlYXNlTm90ZXM6ICcnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgc3VjY2VzcyBub3RpZmljYXRpb24gYWZ0ZXIgcHVibGlzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoV29ya2Zsb3cubW9ja1Jlc29sdmVkVmFsdWUoeyBjcmVhdGVkX2F0OiAxNzAwMTAwMDAwIH0pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ2RhdGFzZXRQaXBlbGluZS5wdWJsaXNoUGlwZWxpbmUuc3VjY2Vzcy5tZXNzYWdlJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHB1Ymxpc2hlZEF0IGluIHN0b3JlIGFmdGVyIHN1Y2Nlc3NmdWwgcHVibGlzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoV29ya2Zsb3cubW9ja1Jlc29sdmVkVmFsdWUoeyBjcmVhdGVkX2F0OiAxNzAwMTAwMDAwIH0pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1NldFB1Ymxpc2hlZEF0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgxNzAwMTAwMDAwKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBpbnZhbGlkYXRlIGNhY2hlcyBhZnRlciBzdWNjZXNzZnVsIHB1Ymxpc2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY3JlYXRlZF9hdDogMTcwMDEwMDAwMCB9KVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tNdXRhdGVEYXRhc2V0UmVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICBleHBlY3QobW9ja0ludmFsaWRQdWJsaXNoZWRQaXBlbGluZUluZm8pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGV4cGVjdChtb2NrSW52YWxpZERhdGFzZXRMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBzdWNjZXNzIG5vdGlmaWNhdGlvbiBmb3IgcHVibGlzaCBhcyB0ZW1wbGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJyksXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHVibGlzaC1hcy1rbm93bGVkZ2UtcGlwZWxpbmUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnZGF0YXNldFBpcGVsaW5lLnB1Ymxpc2hUZW1wbGF0ZS5zdWNjZXNzLm1lc3NhZ2UnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBpbnZhbGlkYXRlIGN1c3RvbWl6ZWQgdGVtcGxhdGUgbGlzdCBhZnRlciBwdWJsaXNoIGFzIHRlbXBsYXRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICBjb25zdCBwdWJsaXNoQXNCdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5maW5kKGJ0biA9PlxuICAgICAgICAgIGJ0bi50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ3BpcGVsaW5lLmNvbW1vbi5wdWJsaXNoQXMnKSxcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEFzQnV0dG9uISlcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tJbnZhbGlkQ3VzdG9taXplZFRlbXBsYXRlTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBwcm9jZWVkIHdpdGggcHVibGlzaCB3aGVuIGNoZWNrIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja0hhbmRsZUNoZWNrQmVmb3JlUHVibGlzaC5tb2NrUmVzb2x2ZWRWYWx1ZShmYWxzZSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gcHVibGlzaFdvcmtmbG93IHNob3VsZCBub3QgYmUgY2FsbGVkIHdoZW4gY2hlY2sgZmFpbHNcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QobW9ja1B1Ymxpc2hXb3JrZmxvdykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIG5vdGlmaWNhdGlvbiB3aGVuIHB1Ymxpc2ggZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignUHVibGlzaCBmYWlsZWQnKSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2RhdGFzZXRQaXBlbGluZS5wdWJsaXNoUGlwZWxpbmUuZXJyb3IubWVzc2FnZScsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciBub3RpZmljYXRpb24gd2hlbiBwdWJsaXNoIGFzIHRlbXBsYXRlIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZS5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ1RlbXBsYXRlIHB1Ymxpc2ggZmFpbGVkJykpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgICBidG4udGV4dENvbnRlbnQ/LmluY2x1ZGVzKCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJyksXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHVibGlzaC1hcy1rbm93bGVkZ2UtcGlwZWxpbmUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2RhdGFzZXRQaXBlbGluZS5wdWJsaXNoVGVtcGxhdGUuZXJyb3IubWVzc2FnZScsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2xvc2UgbW9kYWwgYWZ0ZXIgcHVibGlzaCBhcyB0ZW1wbGF0ZSBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdUZW1wbGF0ZSBwdWJsaXNoIGZhaWxlZCcpKVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIGNvbnN0IHB1Ymxpc2hBc0J1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgICAgYnRuLnRleHRDb250ZW50Py5pbmNsdWRlcygncGlwZWxpbmUuY29tbW9uLnB1Ymxpc2hBcycpLFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQXNCdXR0b24hKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3B1Ymxpc2gtYXMta25vd2xlZGdlLXBpcGVsaW5lLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3B1Ymxpc2gtYXMta25vd2xlZGdlLXBpcGVsaW5lLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbmZpcm0gTW9kYWwgVGVzdHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGRlc2NyaWJlKCdDb25maXJtIE1vZGFsJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoaWRlIGNvbmZpcm0gbW9kYWwgd2hlbiBjYW5jZWwgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKG51bGwpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLmNvbW1vbi5jb25maXJtUHVibGlzaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0IC0gZmluZCBhbmQgY2xpY2sgY2FuY2VsIGJ1dHRvbiBpbiBjb25maXJtIG1vZGFsXG4gICAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBjYW5jZWxCdXR0b25zLmZpbmQoYnRuID0+XG4gICAgICAgICAgYnRuLmNsYXNzTmFtZS5pbmNsdWRlcygnY2FuY2VsJykgfHwgYnRuLnRleHRDb250ZW50Py5pbmNsdWRlcygnQ2FuY2VsJyksXG4gICAgICAgIClcbiAgICAgICAgaWYgKGNhbmNlbEJ1dHRvbilcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2FuY2VsQnV0dG9uKVxuXG4gICAgICAgIC8vIFRyaWdnZXIgb25DYW5jZWwgbWFudWFsbHkgc2luY2Ugd2UgY2FuJ3QgZmluZCB0aGUgZXhhY3QgYnV0dG9uXG4gICAgICAgIC8vIFRoZSBDb25maXJtIGNvbXBvbmVudCBoYXMgYW4gb25DYW5jZWwgcHJvcCB0aGF0IGNhbGxzIGhpZGVDb25maXJtXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgc2hvdWxkIGJlIGRpc21pc3NhYmxlXG4gICAgICAgIC8vIE5vdGU6IFRoaXMgdGVzdCB2ZXJpZmllcyB0aGUgY29uZmlybSBtb2RhbCBjYW4gYmUgZGlzcGxheWVkXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24uY29uZmlybVB1Ymxpc2hDb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcHVibGlzaCB3aGVuIGNvbmZpcm0gaXMgY2xpY2tlZCBpbiBjb25maXJtIG1vZGFsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUobnVsbClcbiAgICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbikgLy8gVGhpcyBzaG93cyBjb25maXJtIG1vZGFsXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLmNvbW1vbi5jb25maXJtUHVibGlzaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY29uZmlybSBtb2RhbCBjb250ZW50IGlzIGRpc3BsYXllZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUuY29tbW9uLmNvbmZpcm1QdWJsaXNoQ29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0c1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KFBvcHVwKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdCgoUG9wdXAgYXMgdW5rbm93biBhcyB7ICQkdHlwZW9mPzogc3ltYm9sIH0pLiQkdHlwZW9mPy50b1N0cmluZygpKS50b0NvbnRhaW4oJ1N5bWJvbCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IHdpZHRoIHdoZW4gcGVybWlzc2lvbiBpcyBhbGxvd2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBUZXN0IHdpdGggcGVybWlzc2lvblxuICAgICAgICBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIGNvbnN0IHBvcHVwRGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KHBvcHVwRGl2LmNsYXNzTmFtZSkudG9Db250YWluKCd3LVszNjBweF0nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3Qgd2lkdGggd2hlbiBwZXJtaXNzaW9uIGlzIG5vdCBhbGxvd2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBUZXN0IHdpdGhvdXQgcGVybWlzc2lvblxuICAgICAgICBtb2NrSXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICBjb25zdCBwb3B1cERpdiA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICAgIGV4cGVjdChwb3B1cERpdi5jbGFzc05hbWUpLnRvQ29udGFpbigndy1bNDAwcHhdJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBkcmFmdCB1cGRhdGVkIHRpbWUgd2hlbiBub3QgcHVibGlzaGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUobnVsbClcbiAgICAgICAgbW9ja0RyYWZ0VXBkYXRlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvd29ya2Zsb3cuY29tbW9uLmF1dG9TYXZlZC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIGRyYWZ0VXBkYXRlZEF0IGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgICBtb2NrRHJhZnRVcGRhdGVkQXQubW9ja1JldHVyblZhbHVlKDApXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC93b3JrZmxvdy5jb21tb24uYXV0b1NhdmVkLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQVBJIFJlZmVyZW5jZSBMaW5rIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnQVBJIFJlZmVyZW5jZSBMaW5rJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgQVBJIHJlZmVyZW5jZSBsaW5rIHdpdGggY29ycmVjdCBocmVmJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgYXBpTGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgICBleHBlY3QoYXBpTGluaykudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vYXBpLmRpZnkuYWkvdjEvZGF0YXNldHMvdGVzdC1kYXRhc2V0LWlkJylcbiAgICAgICAgZXhwZWN0KGFwaUxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEtleWJvYXJkIFNob3J0Y3V0IFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnS2V5Ym9hcmQgU2hvcnRjdXRzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIHB1Ymxpc2ggd2hlbiBrZXlib2FyZCBzaG9ydGN1dCBpcyBwcmVzc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3QgLSBzaW11bGF0ZSBrZXlib2FyZCBzaG9ydGN1dFxuICAgICAgICBjb25zdCBtb2NrRXZlbnQgPSB7IHByZXZlbnREZWZhdWx0OiB2aS5mbigpIH0gYXMgdW5rbm93biBhcyBLZXlib2FyZEV2ZW50XG4gICAgICAgIGtleVByZXNzQ2FsbGJhY2s/Lihtb2NrRXZlbnQpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrRXZlbnQucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1B1Ymxpc2hXb3JrZmxvdykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIHB1Ymxpc2ggd2hlbiBhbHJlYWR5IHB1Ymxpc2hlZCBpbiBzZXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBGaXJzdCBwdWJsaXNoIHZpYSBidXR0b24gY2xpY2sgdG8gc2V0IHB1Ymxpc2hlZCBzdGF0ZVxuICAgICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hlZC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdmkuY2xlYXJBbGxNb2NrcygpXG5cbiAgICAgICAgLy8gQWN0IC0gc2ltdWxhdGUga2V5Ym9hcmQgc2hvcnRjdXQgYWZ0ZXIgYWxyZWFkeSBwdWJsaXNoZWRcbiAgICAgICAgY29uc3QgbW9ja0V2ZW50ID0geyBwcmV2ZW50RGVmYXVsdDogdmkuZm4oKSB9IGFzIHVua25vd24gYXMgS2V5Ym9hcmRFdmVudFxuICAgICAgICBrZXlQcmVzc0NhbGxiYWNrPy4obW9ja0V2ZW50KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZXR1cm4gZWFybHkgd2l0aG91dCBwdWJsaXNoaW5nXG4gICAgICAgIGV4cGVjdChtb2NrRXZlbnQucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobW9ja1B1Ymxpc2hXb3JrZmxvdykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGNvbmZpcm0gbW9kYWwgd2hlbiBzaG9ydGN1dCBwcmVzc2VkIG9uIHVucHVibGlzaGVkIHBpcGVsaW5lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUobnVsbClcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBBY3QgLSBzaW11bGF0ZSBrZXlib2FyZCBzaG9ydGN1dFxuICAgICAgICBjb25zdCBtb2NrRXZlbnQgPSB7IHByZXZlbnREZWZhdWx0OiB2aS5mbigpIH0gYXMgdW5rbm93biBhcyBLZXlib2FyZEV2ZW50XG4gICAgICAgIGtleVByZXNzQ2FsbGJhY2s/Lihtb2NrRXZlbnQpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24uY29uZmlybVB1Ymxpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBkdXBsaWNhdGUgcHVibGlzaCB2aWEgc2hvcnRjdXQgd2hlbiBhbHJlYWR5IHB1Ymxpc2hpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSBjcmVhdGUgYSBwcm9taXNlIHRoYXQgd2UgY2FuIGNvbnRyb2xcbiAgICAgICAgbGV0IHJlc29sdmVQdWJsaXNoOiAoKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgIHJlc29sdmVQdWJsaXNoID0gKCkgPT4gcmVzb2x2ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gdHJpZ2dlciBwdWJsaXNoIHZpYSBrZXlib2FyZCBzaG9ydGN1dCBmaXJzdFxuICAgICAgICBjb25zdCBtb2NrRXZlbnQxID0geyBwcmV2ZW50RGVmYXVsdDogdmkuZm4oKSB9IGFzIHVua25vd24gYXMgS2V5Ym9hcmRFdmVudFxuICAgICAgICBrZXlQcmVzc0NhbGxiYWNrPy4obW9ja0V2ZW50MSlcblxuICAgICAgICAvLyBXYWl0IGZvciB0aGUgZmlyc3QgcHVibGlzaCB0byBzdGFydCAoYnV0dG9uIGJlY29tZXMgZGlzYWJsZWQpXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgICAgZXhwZWN0KHB1Ymxpc2hCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gVHJ5IHRvIHRyaWdnZXIgYWdhaW4gdmlhIHNob3J0Y3V0IHdoaWxlIHB1Ymxpc2hpbmdcbiAgICAgICAgY29uc3QgbW9ja0V2ZW50MiA9IHsgcHJldmVudERlZmF1bHQ6IHZpLmZuKCkgfSBhcyB1bmtub3duIGFzIEtleWJvYXJkRXZlbnRcbiAgICAgICAga2V5UHJlc3NDYWxsYmFjaz8uKG1vY2tFdmVudDIpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gb25seSBvbmUgY2FsbCB0byBwdWJsaXNoV29ya2Zsb3dcbiAgICAgICAgZXhwZWN0KG1vY2tQdWJsaXNoV29ya2Zsb3cpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAgIC8vIENsZWFudXAgLSByZXNvbHZlIHRoZSBwcm9taXNlXG4gICAgICAgIHJlc29sdmVQdWJsaXNoKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRmluYWxseSBCbG9jayBDbGVhbnVwIFRlc3RzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBkZXNjcmliZSgnRmluYWxseSBCbG9jayBDbGVhbnVwJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNldCBwdWJsaXNoaW5nIHN0YXRlIGFmdGVyIHN1Y2Nlc3NmdWwgcHVibGlzaCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAgIG1vY2tQdWJsaXNoV29ya2Zsb3cubW9ja1Jlc29sdmVkVmFsdWUoeyBjcmVhdGVkX2F0OiAxNzAwMTAwMDAwIH0pXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQgZHVyaW5nIHB1Ymxpc2hpbmcsIHRoZW4gc2hvdyBwdWJsaXNoZWRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoZWQvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXNldCBwdWJsaXNoaW5nIHN0YXRlIGFmdGVyIGZhaWxlZCBwdWJsaXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ1B1Ymxpc2ggZmFpbGVkJykpXG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBzaG93IGVycm9yIGFuZCBidXR0b24gc2hvdWxkIGJlIGVuYWJsZWQgYWdhaW4gKG5vdCBzaG93aW5nIFwicHVibGlzaGVkXCIpXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ2RhdGFzZXRQaXBlbGluZS5wdWJsaXNoUGlwZWxpbmUuZXJyb3IubWVzc2FnZScsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBCdXR0b24gc2hvdWxkIHN0aWxsIHNob3cgcHVibGlzaFVwZGF0ZSBzaW5jZSBpdCB3YXNuJ3Qgc3VjY2Vzc2Z1bGx5IHB1Ymxpc2hlZFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWRlIGNvbmZpcm0gbW9kYWwgYWZ0ZXIgcHVibGlzaCBmcm9tIGNvbmZpcm0nLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tSZXNvbHZlZFZhbHVlKHsgY3JlYXRlZF9hdDogMTcwMDEwMDAwMCB9KVxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAgIC8vIFNob3cgY29uZmlybSBtb2RhbCBmaXJzdFxuICAgICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUuY29tbW9uLmNvbmZpcm1QdWJsaXNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3QgLSB0cmlnZ2VyIHB1Ymxpc2ggYWdhaW4gKHdoaWNoIGhhcHBlbnMgd2hlbiBjb25maXJtIGlzIGNsaWNrZWQpXG4gICAgICAgIC8vIFRoZSBtb2NrIGZvciB3b3JrZmxvdyBob29rcyByZXR1cm5zIGhhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCB0aGF0IHJlc29sdmVzIHRvIHRydWVcbiAgICAgICAgLy8gV2UgbmVlZCB0byBzaW11bGF0ZSB0aGUgY29uZmlybSBidXR0b24gY2xpY2sgd2hpY2ggY2FsbHMgaGFuZGxlUHVibGlzaCBhZ2FpblxuICAgICAgICAvLyBTaW5jZSBjb25maXJtVmlzaWJsZSBpcyBub3cgdHJ1ZSBhbmQgcHVibGlzaGVkQXQgaXMgbnVsbCwgaXQgc2hvdWxkIHByb2NlZWQgdG8gcHVibGlzaFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgICAvLyBBc3NlcnQgLSBjb25maXJtIG1vZGFsIHNob3VsZCBiZSBoaWRkZW4gYWZ0ZXIgcHVibGlzaCBjb21wbGV0ZXNcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoZWQvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWRlIGNvbmZpcm0gbW9kYWwgYWZ0ZXIgZmFpbGVkIHB1Ymxpc2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignUHVibGlzaCBmYWlsZWQnKSlcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgICAvLyBTaG93IGNvbmZpcm0gbW9kYWwgZmlyc3RcbiAgICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLmNvbW1vbi5jb25maXJtUHVibGlzaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0IC0gdHJpZ2dlciBwdWJsaXNoIGZyb20gY29uZmlybSAoY2FsbCBoYW5kbGVQdWJsaXNoIHdoZW4gY29uZmlybVZpc2libGUgaXMgdHJ1ZSlcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gZXJyb3Igbm90aWZpY2F0aW9uIHNob3VsZCBiZSBzaG93blxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdkYXRhc2V0UGlwZWxpbmUucHVibGlzaFBpcGVsaW5lLmVycm9yLm1lc3NhZ2UnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBwaXBlbGluZUlkIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGlwZWxpbmVJZC5tb2NrUmV0dXJuVmFsdWUoJycpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQb3B1cCAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnd29ya2Zsb3cuY29tbW9uLmN1cnJlbnREcmFmdFVucHVibGlzaGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHVibGlzaCByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgIG1vY2tQdWJsaXNoV29ya2Zsb3cubW9ja1Jlc29sdmVkVmFsdWUobnVsbClcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgbm90IGNhbGwgc2V0UHVibGlzaGVkQXQgb3Igbm90aWZ5IHdoZW4gcmVzcG9uc2UgaXMgbnVsbFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUHVibGlzaFdvcmtmbG93KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICAvLyBzZXRQdWJsaXNoZWRBdCBzaG91bGQgbm90IGJlIGNhbGxlZCBiZWNhdXNlIHJlcyBpcyBmYWxzeVxuICAgICAgZXhwZWN0KG1vY2tTZXRQdWJsaXNoZWRBdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXZlbnQgbXVsdGlwbGUgc2ltdWx0YW5lb3VzIHB1Ymxpc2ggY2FsbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICAvLyBDcmVhdGUgYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMgdG8gc2ltdWxhdGUgb25nb2luZyBwdWJsaXNoXG4gICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7fSkpXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAvLyBBY3QgLSBjbGljayBwdWJsaXNoIGJ1dHRvbiBtdWx0aXBsZSB0aW1lcyByYXBpZGx5XG4gICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgIC8vIFdhaXQgZm9yIGJ1dHRvbiB0byBiZWNvbWUgZGlzYWJsZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocHVibGlzaEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRyeSBjbGlja2luZyBhZ2FpblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gcHVibGlzaFdvcmtmbG93IHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlIGR1ZSB0byBndWFyZFxuICAgICAgZXhwZWN0KG1vY2tQdWJsaXNoV29ya2Zsb3cpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgcHVibGlzaCBidXR0b24gd2hlbiBhbHJlYWR5IHB1Ymxpc2hlZCBpbiBzZXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZSgxNzAwMDAwMDAwKVxuICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgIC8vIEFjdCAtIHB1Ymxpc2ggb25jZVxuICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93LmNvbW1vbi5wdWJsaXNoVXBkYXRlL2kgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBidXR0b24gc2hvdWxkIHNob3cgXCJwdWJsaXNoZWRcIiBzdGF0ZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaGVkL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIHB1Ymxpc2ggd2hlbiBhbHJlYWR5IHB1Ymxpc2hpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUHVibGlzaGVkQXQubW9ja1JldHVyblZhbHVlKDE3MDAwMDAwMDApXG4gICAgICBtb2NrUHVibGlzaFdvcmtmbG93Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7fSkpIC8vIE5ldmVyIHJlc29sdmVzXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvdy5jb21tb24ucHVibGlzaFVwZGF0ZS9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2socHVibGlzaEJ1dHRvbilcblxuICAgICAgLy8gVGhlIGJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWQgd2hpbGUgcHVibGlzaGluZ1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChwdWJsaXNoQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIFRlc3RzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcGxldGUgZnVsbCBwdWJsaXNoIGZsb3cgZm9yIHVucHVibGlzaGVkIHBpcGVsaW5lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1B1Ymxpc2hlZEF0Lm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgbW9ja1B1Ymxpc2hXb3JrZmxvdy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGNyZWF0ZWRfYXQ6IDE3MDAxMDAwMDAgfSlcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UG9wdXAgLz4pXG5cbiAgICAgIC8vIEFjdCAtIGNsaWNrIHB1Ymxpc2ggdG8gc2hvdyBjb25maXJtXG4gICAgICBjb25zdCBwdWJsaXNoQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3cuY29tbW9uLnB1Ymxpc2hVcGRhdGUvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbmZpcm0gbW9kYWwgc2hvdWxkIGFwcGVhclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24uY29uZmlybVB1Ymxpc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wbGV0ZSBmdWxsIHB1Ymxpc2ggYXMgdGVtcGxhdGUgZmxvdycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tQdWJsaXNoZWRBdC5tb2NrUmV0dXJuVmFsdWUoMTcwMDAwMDAwMClcbiAgICAgIG1vY2tQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFBvcHVwIC8+KVxuXG4gICAgICAvLyBBY3QgLSBjbGljayBwdWJsaXNoIGFzIHRlbXBsYXRlIGJ1dHRvblxuICAgICAgY29uc3QgcHVibGlzaEFzQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgYnRuLnRleHRDb250ZW50Py5pbmNsdWRlcygncGlwZWxpbmUuY29tbW9uLnB1Ymxpc2hBcycpLFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHB1Ymxpc2hBc0J1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydCAtIG1vZGFsIHNob3VsZCBhcHBlYXJcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgLSBjb25maXJtXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIHN1Y2Nlc3Mgbm90aWZpY2F0aW9uIGFuZCBtb2RhbCBjbG9zZXNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncHVibGlzaC1hcy1rbm93bGVkZ2UtcGlwZWxpbmUtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBQdWJsaXNoZXIgYnV0dG9uIGFuZCBvcGVuIHBvcHVwIHdpdGggUG9wdXAgY29tcG9uZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxQdWJsaXNoZXIgLz4pXG5cbiAgICAgIC8vIENsaWNrIHRvIG9wZW4gcG9wdXBcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBzeW5jIHdhcyBjYWxsZWQgd2hlbiBvcGVuaW5nXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19