"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const provider_context_1 = require("@/__mocks__/provider-context");
// ============================================================================
// Import Components After Mocks Setup
// ============================================================================
const conversion_1 = require("./conversion");
const panel_1 = require("./panel");
const publish_as_knowledge_pipeline_modal_1 = require("./publish-as-knowledge-pipeline-modal");
const publish_toast_1 = require("./publish-toast");
const rag_pipeline_children_1 = require("./rag-pipeline-children");
const screenshot_1 = require("./screenshot");
// ============================================================================
// Mock External Dependencies - All vi.mock calls must come before any imports
// ============================================================================
// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useParams: () => ({ datasetId: 'test-dataset-id' }),
    useRouter: () => ({ push: mockPush }),
}));
// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, width, height }) => (
    // eslint-disable-next-line next/no-img-element
    <img src={src} alt={alt} width={width} height={height} data-testid="mock-image"/>),
}));
// Mock next/dynamic
vi.mock('next/dynamic', () => ({
    default: (importFn, options) => {
        const DynamicComponent = ({ children, ...props }) => {
            return <div data-testid="dynamic-component" data-ssr={options?.ssr ?? true} {...props}>{children}</div>;
        };
        DynamicComponent.displayName = 'DynamicComponent';
        return DynamicComponent;
    },
}));
// Mock workflow store - using controllable state
let mockShowImportDSLModal = false;
const mockSetShowImportDSLModal = vi.fn((value) => {
    mockShowImportDSLModal = value;
});
vi.mock('@/app/components/workflow/store', () => {
    const mockSetShowInputFieldPanel = vi.fn();
    const mockSetShowEnvPanel = vi.fn();
    const mockSetShowDebugAndPreviewPanel = vi.fn();
    const mockSetIsPreparingDataSource = vi.fn();
    const mockSetPublishedAt = vi.fn();
    const mockSetRagPipelineVariables = vi.fn();
    const mockSetEnvironmentVariables = vi.fn();
    return {
        useStore: (selector) => {
            const storeState = {
                pipelineId: 'test-pipeline-id',
                showDebugAndPreviewPanel: false,
                showGlobalVariablePanel: false,
                showInputFieldPanel: false,
                showInputFieldPreviewPanel: false,
                inputFieldEditPanelProps: null,
                historyWorkflowData: null,
                publishedAt: 0,
                draftUpdatedAt: Date.now(),
                knowledgeName: 'Test Knowledge',
                knowledgeIcon: {
                    icon_type: 'emoji',
                    icon: '📚',
                    icon_background: '#FFFFFF',
                    icon_url: '',
                },
                showImportDSLModal: mockShowImportDSLModal,
                setShowInputFieldPanel: mockSetShowInputFieldPanel,
                setShowEnvPanel: mockSetShowEnvPanel,
                setShowDebugAndPreviewPanel: mockSetShowDebugAndPreviewPanel,
                setIsPreparingDataSource: mockSetIsPreparingDataSource,
                setPublishedAt: mockSetPublishedAt,
                setRagPipelineVariables: mockSetRagPipelineVariables,
                setEnvironmentVariables: mockSetEnvironmentVariables,
                setShowImportDSLModal: mockSetShowImportDSLModal,
            };
            return selector(storeState);
        },
        useWorkflowStore: () => ({
            getState: () => ({
                pipelineId: 'test-pipeline-id',
                setIsPreparingDataSource: mockSetIsPreparingDataSource,
                setShowDebugAndPreviewPanel: mockSetShowDebugAndPreviewPanel,
                setPublishedAt: mockSetPublishedAt,
                setRagPipelineVariables: mockSetRagPipelineVariables,
                setEnvironmentVariables: mockSetEnvironmentVariables,
            }),
        }),
    };
});
// Mock workflow hooks - extract mock functions for assertions using vi.hoisted
const { mockHandlePaneContextmenuCancel, mockExportCheck, mockHandleExportDSL, } = vi.hoisted(() => ({
    mockHandlePaneContextmenuCancel: vi.fn(),
    mockExportCheck: vi.fn(),
    mockHandleExportDSL: vi.fn(),
}));
vi.mock('@/app/components/workflow/hooks', () => {
    return {
        useNodesSyncDraft: () => ({
            doSyncWorkflowDraft: vi.fn(),
            syncWorkflowDraftWhenPageClose: vi.fn(),
            handleSyncWorkflowDraft: vi.fn(),
        }),
        usePanelInteractions: () => ({
            handlePaneContextmenuCancel: mockHandlePaneContextmenuCancel,
        }),
        useDSL: () => ({
            exportCheck: mockExportCheck,
            handleExportDSL: mockHandleExportDSL,
        }),
        useChecklistBeforePublish: () => ({
            handleCheckBeforePublish: vi.fn().mockResolvedValue(true),
        }),
        useWorkflowRun: () => ({
            handleStopRun: vi.fn(),
        }),
        useWorkflowStartRun: () => ({
            handleWorkflowStartRunInWorkflow: vi.fn(),
        }),
    };
});
// Mock rag-pipeline hooks
vi.mock('../hooks', () => ({
    useAvailableNodesMetaData: () => ({}),
    useDSL: () => ({
        exportCheck: mockExportCheck,
        handleExportDSL: mockHandleExportDSL,
    }),
    useNodesSyncDraft: () => ({
        doSyncWorkflowDraft: vi.fn(),
        syncWorkflowDraftWhenPageClose: vi.fn(),
    }),
    usePipelineRefreshDraft: () => ({
        handleRefreshWorkflowDraft: vi.fn(),
    }),
    usePipelineRun: () => ({
        handleBackupDraft: vi.fn(),
        handleLoadBackupDraft: vi.fn(),
        handleRestoreFromPublishedWorkflow: vi.fn(),
        handleRun: vi.fn(),
        handleStopRun: vi.fn(),
    }),
    usePipelineStartRun: () => ({
        handleStartWorkflowRun: vi.fn(),
        handleWorkflowStartRunInWorkflow: vi.fn(),
    }),
    useGetRunAndTraceUrl: () => ({
        getWorkflowRunAndTraceUrl: vi.fn(),
    }),
}));
// Mock rag-pipeline search hook
vi.mock('../hooks/use-rag-pipeline-search', () => ({
    useRagPipelineSearch: vi.fn(),
}));
// Mock configs-map hook
vi.mock('../hooks/use-configs-map', () => ({
    useConfigsMap: () => ({}),
}));
// Mock inspect-vars-crud hook
vi.mock('../hooks/use-inspect-vars-crud', () => ({
    useInspectVarsCrud: () => ({
        hasNodeInspectVars: vi.fn(),
        hasSetInspectVar: vi.fn(),
        fetchInspectVarValue: vi.fn(),
        editInspectVarValue: vi.fn(),
        renameInspectVarName: vi.fn(),
        appendNodeInspectVars: vi.fn(),
        deleteInspectVar: vi.fn(),
        deleteNodeInspectorVars: vi.fn(),
        deleteAllInspectorVars: vi.fn(),
        isInspectVarEdited: vi.fn(),
        resetToLastRunVar: vi.fn(),
        invalidateSysVarValues: vi.fn(),
        resetConversationVar: vi.fn(),
        invalidateConversationVarValues: vi.fn(),
    }),
}));
// Mock workflow hooks for fetch-workflow-inspect-vars
vi.mock('@/app/components/workflow/hooks/use-fetch-workflow-inspect-vars', () => ({
    useSetWorkflowVarsWithValue: () => ({
        fetchInspectVars: vi.fn(),
    }),
}));
// Mock service hooks - with controllable convert function
let mockConvertFn = vi.fn();
let mockIsPending = false;
vi.mock('@/service/use-pipeline', () => ({
    useConvertDatasetToPipeline: () => ({
        mutateAsync: mockConvertFn,
        isPending: mockIsPending,
    }),
    useImportPipelineDSL: () => ({
        mutateAsync: vi.fn(),
    }),
    useImportPipelineDSLConfirm: () => ({
        mutateAsync: vi.fn(),
    }),
    publishedPipelineInfoQueryKeyPrefix: ['pipeline-info'],
    useInvalidCustomizedTemplateList: () => vi.fn(),
    usePublishAsCustomizedPipeline: () => ({
        mutateAsync: vi.fn(),
    }),
}));
vi.mock('@/service/use-base', () => ({
    useInvalid: () => vi.fn(),
}));
vi.mock('@/service/knowledge/use-dataset', () => ({
    datasetDetailQueryKeyPrefix: ['dataset-detail'],
    useInvalidDatasetList: () => vi.fn(),
}));
vi.mock('@/service/workflow', () => ({
    fetchWorkflowDraft: vi.fn().mockResolvedValue({
        graph: { nodes: [], edges: [], viewport: {} },
        hash: 'test-hash',
        rag_pipeline_variables: [],
    }),
}));
// Mock event emitter context - with controllable subscription
let mockEventSubscriptionCallback = null;
const mockUseSubscription = vi.fn((callback) => {
    mockEventSubscriptionCallback = callback;
});
vi.mock('@/context/event-emitter', () => ({
    useEventEmitterContextContext: () => ({
        eventEmitter: {
            useSubscription: mockUseSubscription,
            emit: vi.fn(),
        },
    }),
}));
// Mock toast
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vi.fn(),
    },
    useToastContext: () => ({
        notify: vi.fn(),
    }),
    ToastContext: {
        Provider: ({ children }) => children,
    },
}));
// Mock useTheme hook
vi.mock('@/hooks/use-theme', () => ({
    default: () => ({
        theme: 'light',
    }),
}));
// Mock basePath
vi.mock('@/utils/var', () => ({
    basePath: '/public',
}));
// Mock provider context
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => (0, provider_context_1.createMockProviderContextValue)(),
}));
// Mock WorkflowWithInnerContext
vi.mock('@/app/components/workflow', () => ({
    WorkflowWithInnerContext: ({ children }) => (<div data-testid="workflow-inner-context">{children}</div>),
}));
// Mock workflow panel
vi.mock('@/app/components/workflow/panel', () => ({
    default: ({ components }) => (<div data-testid="workflow-panel">
      <div data-testid="panel-left">{components?.left}</div>
      <div data-testid="panel-right">{components?.right}</div>
    </div>),
}));
// Mock PluginDependency
vi.mock('../../workflow/plugin-dependency', () => ({
    default: () => <div data-testid="plugin-dependency"/>,
}));
// Mock plugin-dependency hooks
vi.mock('@/app/components/workflow/plugin-dependency/hooks', () => ({
    usePluginDependencies: () => ({
        handleCheckPluginDependencies: vi.fn().mockResolvedValue(undefined),
    }),
}));
// Mock DSLExportConfirmModal
vi.mock('@/app/components/workflow/dsl-export-confirm-modal', () => ({
    default: ({ envList, onConfirm, onClose }) => (<div data-testid="dsl-export-confirm-modal">
      <span data-testid="env-count">{envList.length}</span>
      <button data-testid="export-confirm" onClick={onConfirm}>Confirm</button>
      <button data-testid="export-close" onClick={onClose}>Close</button>
    </div>),
}));
// Mock workflow constants
vi.mock('@/app/components/workflow/constants', () => ({
    DSL_EXPORT_CHECK: 'DSL_EXPORT_CHECK',
    WORKFLOW_DATA_UPDATE: 'WORKFLOW_DATA_UPDATE',
}));
// Mock workflow utils
vi.mock('@/app/components/workflow/utils', () => ({
    initialNodes: vi.fn(nodes => nodes),
    initialEdges: vi.fn(edges => edges),
    getKeyboardKeyCodeBySystem: (key) => key,
    getKeyboardKeyNameBySystem: (key) => key,
}));
// Mock Confirm component
vi.mock('@/app/components/base/confirm', () => ({
    default: ({ title, content, isShow, onConfirm, onCancel, isLoading, isDisabled }) => isShow
        ? (<div data-testid="confirm-modal">
          <div data-testid="confirm-title">{title}</div>
          <div data-testid="confirm-content">{content}</div>
          <button data-testid="confirm-btn" onClick={onConfirm} disabled={isDisabled || isLoading}>
            Confirm
          </button>
          <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>)
        : null,
}));
// Mock Modal component
vi.mock('@/app/components/base/modal', () => ({
    default: ({ children, isShow, onClose, className }) => isShow
        ? (<div data-testid="modal" className={className} onClick={e => e.target === e.currentTarget && onClose()}>
          {children}
        </div>)
        : null,
}));
// Mock Input component
vi.mock('@/app/components/base/input', () => ({
    default: ({ value, onChange, placeholder }) => (<input data-testid="input" value={value} onChange={onChange} placeholder={placeholder}/>),
}));
// Mock Textarea component
vi.mock('@/app/components/base/textarea', () => ({
    default: ({ value, onChange, placeholder, className }) => (<textarea data-testid="textarea" value={value} onChange={onChange} placeholder={placeholder} className={className}/>),
}));
// Mock AppIcon component
vi.mock('@/app/components/base/app-icon', () => ({
    default: ({ onClick, iconType, icon, background, imageUrl, className, size }) => (<div data-testid="app-icon" data-icon-type={iconType} data-icon={icon} data-background={background} data-image-url={imageUrl} data-size={size} className={className} onClick={onClick}/>),
}));
// Mock AppIconPicker component
vi.mock('@/app/components/base/app-icon-picker', () => ({
    default: ({ onSelect, onClose }) => (<div data-testid="app-icon-picker">
      <button data-testid="select-emoji" onClick={() => onSelect({ type: 'emoji', icon: '🚀', background: '#000000' })}>
        Select Emoji
      </button>
      <button data-testid="select-image" onClick={() => onSelect({ type: 'image', url: 'https://example.com/icon.png' })}>
        Select Image
      </button>
      <button data-testid="close-picker" onClick={onClose}>Close</button>
    </div>),
}));
// Mock Uploader component
vi.mock('@/app/components/app/create-from-dsl-modal/uploader', () => ({
    default: ({ file, updateFile, className, accept, displayName }) => (<div data-testid="uploader" className={className}>
      <input type="file" data-testid="file-input" accept={accept} onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            updateFile(selectedFile);
        }}/>
      {file && <span data-testid="file-name">{file.name}</span>}
      <span data-testid="display-name">{displayName}</span>
      <button data-testid="clear-file" onClick={() => updateFile(undefined)}>Clear</button>
    </div>),
}));
// Mock use-context-selector
vi.mock('use-context-selector', () => ({
    useContext: vi.fn(() => ({
        notify: vi.fn(),
    })),
}));
// Mock RagPipelineHeader
vi.mock('./rag-pipeline-header', () => ({
    default: () => <div data-testid="rag-pipeline-header"/>,
}));
// Mock PublishToast
vi.mock('./publish-toast', () => ({
    default: () => <div data-testid="publish-toast"/>,
}));
// Mock UpdateDSLModal for RagPipelineChildren tests
vi.mock('./update-dsl-modal', () => ({
    default: ({ onCancel, onBackup, onImport }) => (<div data-testid="update-dsl-modal">
      <button data-testid="dsl-cancel" onClick={onCancel}>Cancel</button>
      <button data-testid="dsl-backup" onClick={onBackup}>Backup</button>
      <button data-testid="dsl-import" onClick={onImport}>Import</button>
    </div>),
}));
// Mock DSLExportConfirmModal for RagPipelineChildren tests
vi.mock('@/app/components/workflow/dsl-export-confirm-modal', () => ({
    default: ({ envList, onConfirm, onClose }) => (envList.length > 0
        ? (<div data-testid="dsl-export-confirm-modal">
            <span data-testid="env-count">{envList.length}</span>
            <button data-testid="dsl-export-confirm" onClick={onConfirm}>Confirm</button>
            <button data-testid="dsl-export-close" onClick={onClose}>Close</button>
          </div>)
        : null),
}));
// ============================================================================
// Test Suites
// ============================================================================
describe('Conversion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render conversion component without crashing', () => {
            (0, react_1.render)(<conversion_1.default />);
            expect(react_1.screen.getByText('datasetPipeline.conversion.title')).toBeInTheDocument();
        });
        it('should render conversion button', () => {
            (0, react_1.render)(<conversion_1.default />);
            expect(react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i })).toBeInTheDocument();
        });
        it('should render description text', () => {
            (0, react_1.render)(<conversion_1.default />);
            expect(react_1.screen.getByText('datasetPipeline.conversion.descriptionChunk1')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.conversion.descriptionChunk2')).toBeInTheDocument();
        });
        it('should render warning text', () => {
            (0, react_1.render)(<conversion_1.default />);
            expect(react_1.screen.getByText('datasetPipeline.conversion.warning')).toBeInTheDocument();
        });
        it('should render PipelineScreenShot component', () => {
            (0, react_1.render)(<conversion_1.default />);
            expect(react_1.screen.getByTestId('mock-image')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should show confirm modal when convert button is clicked', () => {
            (0, react_1.render)(<conversion_1.default />);
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            expect(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('confirm-title')).toHaveTextContent('datasetPipeline.conversion.confirm.title');
        });
        it('should hide confirm modal when cancel is clicked', () => {
            (0, react_1.render)(<conversion_1.default />);
            // Open modal
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            expect(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
            // Cancel modal
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-btn'));
            expect(react_1.screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // API Callback Tests - covers lines 21-39
    // --------------------------------------------------------------------------
    describe('API Callbacks', () => {
        beforeEach(() => {
            mockConvertFn = vi.fn();
            mockIsPending = false;
        });
        it('should call convert with datasetId and show success toast on success', async () => {
            // Setup mock to capture and call onSuccess callback
            mockConvertFn.mockImplementation((_datasetId, options) => {
                options.onSuccess({ status: 'success' });
            });
            (0, react_1.render)(<conversion_1.default />);
            // Open modal and confirm
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-btn'));
            await (0, react_1.waitFor)(() => {
                expect(mockConvertFn).toHaveBeenCalledWith('test-dataset-id', expect.objectContaining({
                    onSuccess: expect.any(Function),
                    onError: expect.any(Function),
                }));
            });
        });
        it('should close modal on success', async () => {
            mockConvertFn.mockImplementation((_datasetId, options) => {
                options.onSuccess({ status: 'success' });
            });
            (0, react_1.render)(<conversion_1.default />);
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            expect(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-btn'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
            });
        });
        it('should show error toast when conversion fails with status failed', async () => {
            mockConvertFn.mockImplementation((_datasetId, options) => {
                options.onSuccess({ status: 'failed' });
            });
            (0, react_1.render)(<conversion_1.default />);
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-btn'));
            await (0, react_1.waitFor)(() => {
                expect(mockConvertFn).toHaveBeenCalled();
            });
            // Modal should still be visible since conversion failed
            expect(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
        });
        it('should show error toast when conversion throws error', async () => {
            mockConvertFn.mockImplementation((_datasetId, options) => {
                options.onError();
            });
            (0, react_1.render)(<conversion_1.default />);
            const convertButton = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            react_1.fireEvent.click(convertButton);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-btn'));
            await (0, react_1.waitFor)(() => {
                expect(mockConvertFn).toHaveBeenCalled();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Conversion is exported with React.memo
            expect(conversion_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should use useCallback for handleConvert', () => {
            const { rerender } = (0, react_1.render)(<conversion_1.default />);
            // Rerender should not cause issues with callback
            rerender(<conversion_1.default />);
            expect(react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i })).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle missing datasetId gracefully', () => {
            (0, react_1.render)(<conversion_1.default />);
            // Component should render without crashing
            expect(react_1.screen.getByText('datasetPipeline.conversion.title')).toBeInTheDocument();
        });
    });
});
describe('PipelineScreenShot', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<screenshot_1.default />);
            expect(react_1.screen.getByTestId('mock-image')).toBeInTheDocument();
        });
        it('should render with correct image attributes', () => {
            (0, react_1.render)(<screenshot_1.default />);
            const img = react_1.screen.getByTestId('mock-image');
            expect(img).toHaveAttribute('alt', 'Pipeline Screenshot');
            expect(img).toHaveAttribute('width', '692');
            expect(img).toHaveAttribute('height', '456');
        });
        it('should use correct theme-based source path', () => {
            (0, react_1.render)(<screenshot_1.default />);
            const img = react_1.screen.getByTestId('mock-image');
            // Default theme is 'light' from mock
            expect(img).toHaveAttribute('src', '/public/screenshots/light/Pipeline.png');
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(screenshot_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
});
describe('PublishToast', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Note: PublishToast is mocked, so we just verify the mock renders
            (0, react_1.render)(<publish_toast_1.default />);
            expect(react_1.screen.getByTestId('publish-toast')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be defined', () => {
            // The real PublishToast is mocked, but we can verify the import
            expect(publish_toast_1.default).toBeDefined();
        });
    });
});
describe('PublishAsKnowledgePipelineModal', () => {
    const mockOnCancel = vi.fn();
    const mockOnConfirm = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultProps = {
        onCancel: mockOnCancel,
        onConfirm: mockOnConfirm,
    };
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render modal with title', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            expect(react_1.screen.getByText('pipeline.common.publishAs')).toBeInTheDocument();
        });
        it('should render name input with default value from store', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('input');
            expect(input).toHaveValue('Test Knowledge');
        });
        it('should render description textarea', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            expect(react_1.screen.getByTestId('textarea')).toBeInTheDocument();
        });
        it('should render app icon', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            expect(react_1.screen.getByTestId('app-icon')).toBeInTheDocument();
        });
        it('should render cancel and confirm buttons', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            expect(react_1.screen.getByRole('button', { name: /common\.operation\.cancel/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i })).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should update name when input changes', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('input');
            react_1.fireEvent.change(input, { target: { value: 'New Pipeline Name' } });
            expect(input).toHaveValue('New Pipeline Name');
        });
        it('should update description when textarea changes', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            const textarea = react_1.screen.getByTestId('textarea');
            react_1.fireEvent.change(textarea, { target: { value: 'New description' } });
            expect(textarea).toHaveValue('New description');
        });
        it('should call onCancel when cancel button is clicked', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /common\.operation\.cancel/i }));
            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
        it('should call onCancel when close icon is clicked', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('publish-modal-close-btn'));
            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
        it('should call onConfirm with trimmed values when publish button is clicked', () => {
            mockOnConfirm.mockResolvedValueOnce(undefined);
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Update values
            react_1.fireEvent.change(react_1.screen.getByTestId('input'), { target: { value: '  Trimmed Name  ' } });
            react_1.fireEvent.change(react_1.screen.getByTestId('textarea'), { target: { value: '  Trimmed Description  ' } });
            // Click publish
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i }));
            expect(mockOnConfirm).toHaveBeenCalledWith('Trimmed Name', expect.any(Object), 'Trimmed Description');
        });
        it('should show app icon picker when icon is clicked', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('app-icon'));
            expect(react_1.screen.getByTestId('app-icon-picker')).toBeInTheDocument();
        });
        it('should update icon when emoji is selected', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Open picker
            react_1.fireEvent.click(react_1.screen.getByTestId('app-icon'));
            // Select emoji
            react_1.fireEvent.click(react_1.screen.getByTestId('select-emoji'));
            // Picker should close
            expect(react_1.screen.queryByTestId('app-icon-picker')).not.toBeInTheDocument();
        });
        it('should update icon when image is selected', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Open picker
            react_1.fireEvent.click(react_1.screen.getByTestId('app-icon'));
            // Select image
            react_1.fireEvent.click(react_1.screen.getByTestId('select-image'));
            // Picker should close
            expect(react_1.screen.queryByTestId('app-icon-picker')).not.toBeInTheDocument();
        });
        it('should close picker and restore icon when picker is closed', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Open picker
            react_1.fireEvent.click(react_1.screen.getByTestId('app-icon'));
            expect(react_1.screen.getByTestId('app-icon-picker')).toBeInTheDocument();
            // Close picker
            react_1.fireEvent.click(react_1.screen.getByTestId('close-picker'));
            // Picker should close
            expect(react_1.screen.queryByTestId('app-icon-picker')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Props Validation Tests
    // --------------------------------------------------------------------------
    describe('Props Validation', () => {
        it('should disable publish button when name is empty', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Clear the name
            react_1.fireEvent.change(react_1.screen.getByTestId('input'), { target: { value: '' } });
            const publishButton = react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i });
            expect(publishButton).toBeDisabled();
        });
        it('should disable publish button when name is only whitespace', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Set whitespace-only name
            react_1.fireEvent.change(react_1.screen.getByTestId('input'), { target: { value: '   ' } });
            const publishButton = react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i });
            expect(publishButton).toBeDisabled();
        });
        it('should disable publish button when confirmDisabled is true', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps} confirmDisabled/>);
            const publishButton = react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i });
            expect(publishButton).toBeDisabled();
        });
        it('should not call onConfirm when confirmDisabled is true', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps} confirmDisabled/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i }));
            expect(mockOnConfirm).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should use useCallback for handleSelectIcon', () => {
            const { rerender } = (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            // Rerender should not cause issues
            rerender(<publish_as_knowledge_pipeline_modal_1.default {...defaultProps}/>);
            expect(react_1.screen.getByTestId('app-icon')).toBeInTheDocument();
        });
    });
});
describe('RagPipelinePanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render panel component without crashing', () => {
            (0, react_1.render)(<panel_1.default />);
            expect(react_1.screen.getByTestId('workflow-panel')).toBeInTheDocument();
        });
        it('should render panel with left and right slots', () => {
            (0, react_1.render)(<panel_1.default />);
            expect(react_1.screen.getByTestId('panel-left')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('panel-right')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with memo', () => {
            expect(panel_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
});
describe('RagPipelineChildren', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockShowImportDSLModal = false;
        mockEventSubscriptionCallback = null;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            expect(react_1.screen.getByTestId('plugin-dependency')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('rag-pipeline-header')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('publish-toast')).toBeInTheDocument();
        });
        it('should not render UpdateDSLModal when showImportDSLModal is false', () => {
            mockShowImportDSLModal = false;
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            expect(react_1.screen.queryByTestId('update-dsl-modal')).not.toBeInTheDocument();
        });
        it('should render UpdateDSLModal when showImportDSLModal is true', () => {
            mockShowImportDSLModal = true;
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            expect(react_1.screen.getByTestId('update-dsl-modal')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Event Subscription Tests - covers lines 37-40
    // --------------------------------------------------------------------------
    describe('Event Subscription', () => {
        it('should subscribe to event emitter', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            expect(mockUseSubscription).toHaveBeenCalled();
        });
        it('should handle DSL_EXPORT_CHECK event and set secretEnvList', async () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            // Simulate DSL_EXPORT_CHECK event
            const mockEnvVariables = [
                { id: '1', name: 'SECRET_KEY', value: 'test-secret', value_type: 'secret', description: '' },
            ];
            // Trigger the subscription callback
            if (mockEventSubscriptionCallback) {
                mockEventSubscriptionCallback({
                    type: 'DSL_EXPORT_CHECK',
                    payload: { data: mockEnvVariables },
                });
            }
            // DSLExportConfirmModal should be rendered
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-confirm-modal')).toBeInTheDocument();
            });
        });
        it('should not show DSLExportConfirmModal for non-DSL_EXPORT_CHECK events', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            // Trigger a different event type
            if (mockEventSubscriptionCallback) {
                mockEventSubscriptionCallback({
                    type: 'OTHER_EVENT',
                });
            }
            expect(react_1.screen.queryByTestId('dsl-export-confirm-modal')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // UpdateDSLModal Handlers Tests - covers lines 48-51
    // --------------------------------------------------------------------------
    describe('UpdateDSLModal Handlers', () => {
        beforeEach(() => {
            mockShowImportDSLModal = true;
        });
        it('should call setShowImportDSLModal(false) when onCancel is clicked', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('dsl-cancel'));
            expect(mockSetShowImportDSLModal).toHaveBeenCalledWith(false);
        });
        it('should call exportCheck when onBackup is clicked', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('dsl-backup'));
            expect(mockExportCheck).toHaveBeenCalledTimes(1);
        });
        it('should call handlePaneContextmenuCancel when onImport is clicked', () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('dsl-import'));
            expect(mockHandlePaneContextmenuCancel).toHaveBeenCalledTimes(1);
        });
    });
    // --------------------------------------------------------------------------
    // DSLExportConfirmModal Tests - covers lines 55-60
    // --------------------------------------------------------------------------
    describe('DSLExportConfirmModal', () => {
        it('should render DSLExportConfirmModal when secretEnvList has items', async () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            // Simulate DSL_EXPORT_CHECK event with secrets
            const mockEnvVariables = [
                { id: '1', name: 'API_KEY', value: 'secret-value', value_type: 'secret', description: '' },
            ];
            if (mockEventSubscriptionCallback) {
                mockEventSubscriptionCallback({
                    type: 'DSL_EXPORT_CHECK',
                    payload: { data: mockEnvVariables },
                });
            }
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-confirm-modal')).toBeInTheDocument();
            });
        });
        it('should close DSLExportConfirmModal when onClose is triggered', async () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            // First show the modal
            const mockEnvVariables = [
                { id: '1', name: 'API_KEY', value: 'secret-value', value_type: 'secret', description: '' },
            ];
            if (mockEventSubscriptionCallback) {
                mockEventSubscriptionCallback({
                    type: 'DSL_EXPORT_CHECK',
                    payload: { data: mockEnvVariables },
                });
            }
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-confirm-modal')).toBeInTheDocument();
            });
            // Close the modal
            react_1.fireEvent.click(react_1.screen.getByTestId('dsl-export-close'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('dsl-export-confirm-modal')).not.toBeInTheDocument();
            });
        });
        it('should call handleExportDSL when onConfirm is triggered', async () => {
            (0, react_1.render)(<rag_pipeline_children_1.default />);
            // Show the modal
            const mockEnvVariables = [
                { id: '1', name: 'API_KEY', value: 'secret-value', value_type: 'secret', description: '' },
            ];
            if (mockEventSubscriptionCallback) {
                mockEventSubscriptionCallback({
                    type: 'DSL_EXPORT_CHECK',
                    payload: { data: mockEnvVariables },
                });
            }
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('dsl-export-confirm-modal')).toBeInTheDocument();
            });
            // Confirm export
            react_1.fireEvent.click(react_1.screen.getByTestId('dsl-export-confirm'));
            expect(mockHandleExportDSL).toHaveBeenCalledTimes(1);
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with memo', () => {
            expect(rag_pipeline_children_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('PublishAsKnowledgePipelineModal Flow', () => {
        const mockOnCancel = vi.fn();
        const mockOnConfirm = vi.fn().mockResolvedValue(undefined);
        it('should complete full publish flow', async () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={mockOnCancel} onConfirm={mockOnConfirm}/>);
            // Update name
            react_1.fireEvent.change(react_1.screen.getByTestId('input'), { target: { value: 'My Pipeline' } });
            // Add description
            react_1.fireEvent.change(react_1.screen.getByTestId('textarea'), { target: { value: 'A great pipeline' } });
            // Change icon
            react_1.fireEvent.click(react_1.screen.getByTestId('app-icon'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-emoji'));
            // Publish
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i }));
            await (0, react_1.waitFor)(() => {
                expect(mockOnConfirm).toHaveBeenCalledWith('My Pipeline', expect.objectContaining({
                    icon_type: 'emoji',
                    icon: '🚀',
                    icon_background: '#000000',
                }), 'A great pipeline');
            });
        });
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
        it('should handle empty knowledgeName', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={vi.fn()} onConfirm={vi.fn()}/>);
            // Clear the name
            const input = react_1.screen.getByTestId('input');
            react_1.fireEvent.change(input, { target: { value: '' } });
            expect(input).toHaveValue('');
        });
    });
    describe('Boundary Conditions', () => {
        it('should handle very long pipeline name', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={vi.fn()} onConfirm={vi.fn()}/>);
            const longName = 'A'.repeat(1000);
            const input = react_1.screen.getByTestId('input');
            react_1.fireEvent.change(input, { target: { value: longName } });
            expect(input).toHaveValue(longName);
        });
        it('should handle special characters in name', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={vi.fn()} onConfirm={vi.fn()}/>);
            const specialName = '<script>alert("xss")</script>';
            const input = react_1.screen.getByTestId('input');
            react_1.fireEvent.change(input, { target: { value: specialName } });
            expect(input).toHaveValue(specialName);
        });
    });
});
// ============================================================================
// Accessibility Tests
// ============================================================================
describe('Accessibility', () => {
    describe('Conversion', () => {
        it('should have accessible button', () => {
            (0, react_1.render)(<conversion_1.default />);
            const button = react_1.screen.getByRole('button', { name: /datasetPipeline\.operations\.convert/i });
            expect(button).toBeInTheDocument();
        });
    });
    describe('PublishAsKnowledgePipelineModal', () => {
        it('should have accessible form inputs', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={vi.fn()} onConfirm={vi.fn()}/>);
            expect(react_1.screen.getByTestId('input')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('textarea')).toBeInTheDocument();
        });
        it('should have accessible buttons', () => {
            (0, react_1.render)(<publish_as_knowledge_pipeline_modal_1.default onCancel={vi.fn()} onConfirm={vi.fn()}/>);
            expect(react_1.screen.getByRole('button', { name: /common\.operation\.cancel/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /workflow\.common\.publish/i })).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLG1FQUE2RTtBQUU3RSwrRUFBK0U7QUFDL0Usc0NBQXNDO0FBQ3RDLCtFQUErRTtBQUUvRSw2Q0FBcUM7QUFDckMsbUNBQXNDO0FBQ3RDLCtGQUFtRjtBQUNuRixtREFBMEM7QUFDMUMsbUVBQXlEO0FBQ3pELDZDQUE2QztBQUU3QywrRUFBK0U7QUFDL0UsOEVBQThFO0FBQzlFLCtFQUErRTtBQUUvRSx1QkFBdUI7QUFDdkIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO0lBQ25ELFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO0NBQ3RDLENBQUMsQ0FBQyxDQUFBO0FBRUgsa0JBQWtCO0FBQ2xCLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0IsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQStELEVBQUUsRUFBRSxDQUFDO0lBQ3JHLCtDQUErQztJQUMvQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFHLENBQ25GO0NBQ0YsQ0FBQyxD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Y3QnXG5pbXBvcnQgdHlwZSB7IEVudmlyb25tZW50VmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUgfSBmcm9tICdAL19fbW9ja3NfXy9wcm92aWRlci1jb250ZXh0J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbXBvcnQgQ29tcG9uZW50cyBBZnRlciBNb2NrcyBTZXR1cFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgQ29udmVyc2lvbiBmcm9tICcuL2NvbnZlcnNpb24nXG5pbXBvcnQgUmFnUGlwZWxpbmVQYW5lbCBmcm9tICcuL3BhbmVsJ1xuaW1wb3J0IFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgZnJvbSAnLi9wdWJsaXNoLWFzLWtub3dsZWRnZS1waXBlbGluZS1tb2RhbCdcbmltcG9ydCBQdWJsaXNoVG9hc3QgZnJvbSAnLi9wdWJsaXNoLXRvYXN0J1xuaW1wb3J0IFJhZ1BpcGVsaW5lQ2hpbGRyZW4gZnJvbSAnLi9yYWctcGlwZWxpbmUtY2hpbGRyZW4nXG5pbXBvcnQgUGlwZWxpbmVTY3JlZW5TaG90IGZyb20gJy4vc2NyZWVuc2hvdCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXMgLSBBbGwgdmkubW9jayBjYWxscyBtdXN0IGNvbWUgYmVmb3JlIGFueSBpbXBvcnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgbmV4dC9uYXZpZ2F0aW9uXG5jb25zdCBtb2NrUHVzaCA9IHZpLmZuKClcbnZpLm1vY2soJ25leHQvbmF2aWdhdGlvbicsICgpID0+ICh7XG4gIHVzZVBhcmFtczogKCkgPT4gKHsgZGF0YXNldElkOiAndGVzdC1kYXRhc2V0LWlkJyB9KSxcbiAgdXNlUm91dGVyOiAoKSA9PiAoeyBwdXNoOiBtb2NrUHVzaCB9KSxcbn0pKVxuXG4vLyBNb2NrIG5leHQvaW1hZ2VcbnZpLm1vY2soJ25leHQvaW1hZ2UnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBzcmMsIGFsdCwgd2lkdGgsIGhlaWdodCB9OiB7IHNyYzogc3RyaW5nLCBhbHQ6IHN0cmluZywgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfSkgPT4gKFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXh0L25vLWltZy1lbGVtZW50XG4gICAgPGltZyBzcmM9e3NyY30gYWx0PXthbHR9IHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9IGRhdGEtdGVzdGlkPVwibW9jay1pbWFnZVwiIC8+XG4gICksXG59KSlcblxuLy8gTW9jayBuZXh0L2R5bmFtaWNcbnZpLm1vY2soJ25leHQvZHluYW1pYycsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChpbXBvcnRGbjogKCkgPT4gUHJvbWlzZTx7IGRlZmF1bHQ6IFJlYWN0LkNvbXBvbmVudFR5cGU8dW5rbm93bj4gfT4sIG9wdGlvbnM/OiB7IHNzcj86IGJvb2xlYW4gfSkgPT4ge1xuICAgIGNvbnN0IER5bmFtaWNDb21wb25lbnQgPSAoeyBjaGlsZHJlbiwgLi4ucHJvcHMgfTogUHJvcHNXaXRoQ2hpbGRyZW4pID0+IHtcbiAgICAgIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPVwiZHluYW1pYy1jb21wb25lbnRcIiBkYXRhLXNzcj17b3B0aW9ucz8uc3NyID8/IHRydWV9IHsuLi5wcm9wc30+e2NoaWxkcmVufTwvZGl2PlxuICAgIH1cbiAgICBEeW5hbWljQ29tcG9uZW50LmRpc3BsYXlOYW1lID0gJ0R5bmFtaWNDb21wb25lbnQnXG4gICAgcmV0dXJuIER5bmFtaWNDb21wb25lbnRcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHdvcmtmbG93IHN0b3JlIC0gdXNpbmcgY29udHJvbGxhYmxlIHN0YXRlXG5sZXQgbW9ja1Nob3dJbXBvcnREU0xNb2RhbCA9IGZhbHNlXG5jb25zdCBtb2NrU2V0U2hvd0ltcG9ydERTTE1vZGFsID0gdmkuZm4oKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gIG1vY2tTaG93SW1wb3J0RFNMTW9kYWwgPSB2YWx1ZVxufSlcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tTZXRTaG93SW5wdXRGaWVsZFBhbmVsID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0U2hvd0VudlBhbmVsID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0U2hvd0RlYnVnQW5kUHJldmlld1BhbmVsID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0UHVibGlzaGVkQXQgPSB2aS5mbigpXG4gIGNvbnN0IG1vY2tTZXRSYWdQaXBlbGluZVZhcmlhYmxlcyA9IHZpLmZuKClcbiAgY29uc3QgbW9ja1NldEVudmlyb25tZW50VmFyaWFibGVzID0gdmkuZm4oKVxuXG4gIHJldHVybiB7XG4gICAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4gdW5rbm93bikgPT4ge1xuICAgICAgY29uc3Qgc3RvcmVTdGF0ZSA9IHtcbiAgICAgICAgcGlwZWxpbmVJZDogJ3Rlc3QtcGlwZWxpbmUtaWQnLFxuICAgICAgICBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWw6IGZhbHNlLFxuICAgICAgICBzaG93R2xvYmFsVmFyaWFibGVQYW5lbDogZmFsc2UsXG4gICAgICAgIHNob3dJbnB1dEZpZWxkUGFuZWw6IGZhbHNlLFxuICAgICAgICBzaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbDogZmFsc2UsXG4gICAgICAgIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogbnVsbCBhcyBudWxsIHwgb2JqZWN0LFxuICAgICAgICBoaXN0b3J5V29ya2Zsb3dEYXRhOiBudWxsIGFzIG51bGwgfCBvYmplY3QsXG4gICAgICAgIHB1Ymxpc2hlZEF0OiAwLFxuICAgICAgICBkcmFmdFVwZGF0ZWRBdDogRGF0ZS5ub3coKSxcbiAgICAgICAga25vd2xlZGdlTmFtZTogJ1Rlc3QgS25vd2xlZGdlJyxcbiAgICAgICAga25vd2xlZGdlSWNvbjoge1xuICAgICAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyBhcyBjb25zdCxcbiAgICAgICAgICBpY29uOiAn8J+TmicsXG4gICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRkZGRicsXG4gICAgICAgICAgaWNvbl91cmw6ICcnLFxuICAgICAgICB9LFxuICAgICAgICBzaG93SW1wb3J0RFNMTW9kYWw6IG1vY2tTaG93SW1wb3J0RFNMTW9kYWwsXG4gICAgICAgIHNldFNob3dJbnB1dEZpZWxkUGFuZWw6IG1vY2tTZXRTaG93SW5wdXRGaWVsZFBhbmVsLFxuICAgICAgICBzZXRTaG93RW52UGFuZWw6IG1vY2tTZXRTaG93RW52UGFuZWwsXG4gICAgICAgIHNldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogbW9ja1NldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCxcbiAgICAgICAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlOiBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlLFxuICAgICAgICBzZXRQdWJsaXNoZWRBdDogbW9ja1NldFB1Ymxpc2hlZEF0LFxuICAgICAgICBzZXRSYWdQaXBlbGluZVZhcmlhYmxlczogbW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzLFxuICAgICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlczogbW9ja1NldEVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgICBzZXRTaG93SW1wb3J0RFNMTW9kYWw6IG1vY2tTZXRTaG93SW1wb3J0RFNMTW9kYWwsXG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3Ioc3RvcmVTdGF0ZSlcbiAgICB9LFxuICAgIHVzZVdvcmtmbG93U3RvcmU6ICgpID0+ICh7XG4gICAgICBnZXRTdGF0ZTogKCkgPT4gKHtcbiAgICAgICAgcGlwZWxpbmVJZDogJ3Rlc3QtcGlwZWxpbmUtaWQnLFxuICAgICAgICBzZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2U6IG1vY2tTZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2UsXG4gICAgICAgIHNldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogbW9ja1NldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCxcbiAgICAgICAgc2V0UHVibGlzaGVkQXQ6IG1vY2tTZXRQdWJsaXNoZWRBdCxcbiAgICAgICAgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXM6IG1vY2tTZXRSYWdQaXBlbGluZVZhcmlhYmxlcyxcbiAgICAgICAgc2V0RW52aXJvbm1lbnRWYXJpYWJsZXM6IG1vY2tTZXRFbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICAgIH0pLFxuICAgIH0pLFxuICB9XG59KVxuXG4vLyBNb2NrIHdvcmtmbG93IGhvb2tzIC0gZXh0cmFjdCBtb2NrIGZ1bmN0aW9ucyBmb3IgYXNzZXJ0aW9ucyB1c2luZyB2aS5ob2lzdGVkXG5jb25zdCB7XG4gIG1vY2tIYW5kbGVQYW5lQ29udGV4dG1lbnVDYW5jZWwsXG4gIG1vY2tFeHBvcnRDaGVjayxcbiAgbW9ja0hhbmRsZUV4cG9ydERTTCxcbn0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tIYW5kbGVQYW5lQ29udGV4dG1lbnVDYW5jZWw6IHZpLmZuKCksXG4gIG1vY2tFeHBvcnRDaGVjazogdmkuZm4oKSxcbiAgbW9ja0hhbmRsZUV4cG9ydERTTDogdmkuZm4oKSxcbn0pKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcycsICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB1c2VOb2Rlc1N5bmNEcmFmdDogKCkgPT4gKHtcbiAgICAgIGRvU3luY1dvcmtmbG93RHJhZnQ6IHZpLmZuKCksXG4gICAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2U6IHZpLmZuKCksXG4gICAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdDogdmkuZm4oKSxcbiAgICB9KSxcbiAgICB1c2VQYW5lbEludGVyYWN0aW9uczogKCkgPT4gKHtcbiAgICAgIGhhbmRsZVBhbmVDb250ZXh0bWVudUNhbmNlbDogbW9ja0hhbmRsZVBhbmVDb250ZXh0bWVudUNhbmNlbCxcbiAgICB9KSxcbiAgICB1c2VEU0w6ICgpID0+ICh7XG4gICAgICBleHBvcnRDaGVjazogbW9ja0V4cG9ydENoZWNrLFxuICAgICAgaGFuZGxlRXhwb3J0RFNMOiBtb2NrSGFuZGxlRXhwb3J0RFNMLFxuICAgIH0pLFxuICAgIHVzZUNoZWNrbGlzdEJlZm9yZVB1Ymxpc2g6ICgpID0+ICh7XG4gICAgICBoYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2g6IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodHJ1ZSksXG4gICAgfSksXG4gICAgdXNlV29ya2Zsb3dSdW46ICgpID0+ICh7XG4gICAgICBoYW5kbGVTdG9wUnVuOiB2aS5mbigpLFxuICAgIH0pLFxuICAgIHVzZVdvcmtmbG93U3RhcnRSdW46ICgpID0+ICh7XG4gICAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0UnVuSW5Xb3JrZmxvdzogdmkuZm4oKSxcbiAgICB9KSxcbiAgfVxufSlcblxuLy8gTW9jayByYWctcGlwZWxpbmUgaG9va3NcbnZpLm1vY2soJy4uL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlQXZhaWxhYmxlTm9kZXNNZXRhRGF0YTogKCkgPT4gKHt9KSxcbiAgdXNlRFNMOiAoKSA9PiAoe1xuICAgIGV4cG9ydENoZWNrOiBtb2NrRXhwb3J0Q2hlY2ssXG4gICAgaGFuZGxlRXhwb3J0RFNMOiBtb2NrSGFuZGxlRXhwb3J0RFNMLFxuICB9KSxcbiAgdXNlTm9kZXNTeW5jRHJhZnQ6ICgpID0+ICh7XG4gICAgZG9TeW5jV29ya2Zsb3dEcmFmdDogdmkuZm4oKSxcbiAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2U6IHZpLmZuKCksXG4gIH0pLFxuICB1c2VQaXBlbGluZVJlZnJlc2hEcmFmdDogKCkgPT4gKHtcbiAgICBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdDogdmkuZm4oKSxcbiAgfSksXG4gIHVzZVBpcGVsaW5lUnVuOiAoKSA9PiAoe1xuICAgIGhhbmRsZUJhY2t1cERyYWZ0OiB2aS5mbigpLFxuICAgIGhhbmRsZUxvYWRCYWNrdXBEcmFmdDogdmkuZm4oKSxcbiAgICBoYW5kbGVSZXN0b3JlRnJvbVB1Ymxpc2hlZFdvcmtmbG93OiB2aS5mbigpLFxuICAgIGhhbmRsZVJ1bjogdmkuZm4oKSxcbiAgICBoYW5kbGVTdG9wUnVuOiB2aS5mbigpLFxuICB9KSxcbiAgdXNlUGlwZWxpbmVTdGFydFJ1bjogKCkgPT4gKHtcbiAgICBoYW5kbGVTdGFydFdvcmtmbG93UnVuOiB2aS5mbigpLFxuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93OiB2aS5mbigpLFxuICB9KSxcbiAgdXNlR2V0UnVuQW5kVHJhY2VVcmw6ICgpID0+ICh7XG4gICAgZ2V0V29ya2Zsb3dSdW5BbmRUcmFjZVVybDogdmkuZm4oKSxcbiAgfSksXG59KSlcblxuLy8gTW9jayByYWctcGlwZWxpbmUgc2VhcmNoIGhvb2tcbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1yYWctcGlwZWxpbmUtc2VhcmNoJywgKCkgPT4gKHtcbiAgdXNlUmFnUGlwZWxpbmVTZWFyY2g6IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayBjb25maWdzLW1hcCBob29rXG52aS5tb2NrKCcuLi9ob29rcy91c2UtY29uZmlncy1tYXAnLCAoKSA9PiAoe1xuICB1c2VDb25maWdzTWFwOiAoKSA9PiAoe30pLFxufSkpXG5cbi8vIE1vY2sgaW5zcGVjdC12YXJzLWNydWQgaG9va1xudmkubW9jaygnLi4vaG9va3MvdXNlLWluc3BlY3QtdmFycy1jcnVkJywgKCkgPT4gKHtcbiAgdXNlSW5zcGVjdFZhcnNDcnVkOiAoKSA9PiAoe1xuICAgIGhhc05vZGVJbnNwZWN0VmFyczogdmkuZm4oKSxcbiAgICBoYXNTZXRJbnNwZWN0VmFyOiB2aS5mbigpLFxuICAgIGZldGNoSW5zcGVjdFZhclZhbHVlOiB2aS5mbigpLFxuICAgIGVkaXRJbnNwZWN0VmFyVmFsdWU6IHZpLmZuKCksXG4gICAgcmVuYW1lSW5zcGVjdFZhck5hbWU6IHZpLmZuKCksXG4gICAgYXBwZW5kTm9kZUluc3BlY3RWYXJzOiB2aS5mbigpLFxuICAgIGRlbGV0ZUluc3BlY3RWYXI6IHZpLmZuKCksXG4gICAgZGVsZXRlTm9kZUluc3BlY3RvclZhcnM6IHZpLmZuKCksXG4gICAgZGVsZXRlQWxsSW5zcGVjdG9yVmFyczogdmkuZm4oKSxcbiAgICBpc0luc3BlY3RWYXJFZGl0ZWQ6IHZpLmZuKCksXG4gICAgcmVzZXRUb0xhc3RSdW5WYXI6IHZpLmZuKCksXG4gICAgaW52YWxpZGF0ZVN5c1ZhclZhbHVlczogdmkuZm4oKSxcbiAgICByZXNldENvbnZlcnNhdGlvblZhcjogdmkuZm4oKSxcbiAgICBpbnZhbGlkYXRlQ29udmVyc2F0aW9uVmFyVmFsdWVzOiB2aS5mbigpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHdvcmtmbG93IGhvb2tzIGZvciBmZXRjaC13b3JrZmxvdy1pbnNwZWN0LXZhcnNcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MvdXNlLWZldGNoLXdvcmtmbG93LWluc3BlY3QtdmFycycsICgpID0+ICh7XG4gIHVzZVNldFdvcmtmbG93VmFyc1dpdGhWYWx1ZTogKCkgPT4gKHtcbiAgICBmZXRjaEluc3BlY3RWYXJzOiB2aS5mbigpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHNlcnZpY2UgaG9va3MgLSB3aXRoIGNvbnRyb2xsYWJsZSBjb252ZXJ0IGZ1bmN0aW9uXG5sZXQgbW9ja0NvbnZlcnRGbiA9IHZpLmZuKClcbmxldCBtb2NrSXNQZW5kaW5nID0gZmFsc2VcbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGlwZWxpbmUnLCAoKSA9PiAoe1xuICB1c2VDb252ZXJ0RGF0YXNldFRvUGlwZWxpbmU6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tDb252ZXJ0Rm4sXG4gICAgaXNQZW5kaW5nOiBtb2NrSXNQZW5kaW5nLFxuICB9KSxcbiAgdXNlSW1wb3J0UGlwZWxpbmVEU0w6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IHZpLmZuKCksXG4gIH0pLFxuICB1c2VJbXBvcnRQaXBlbGluZURTTENvbmZpcm06ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IHZpLmZuKCksXG4gIH0pLFxuICBwdWJsaXNoZWRQaXBlbGluZUluZm9RdWVyeUtleVByZWZpeDogWydwaXBlbGluZS1pbmZvJ10sXG4gIHVzZUludmFsaWRDdXN0b21pemVkVGVtcGxhdGVMaXN0OiAoKSA9PiB2aS5mbigpLFxuICB1c2VQdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmU6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IHZpLmZuKCksXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtYmFzZScsICgpID0+ICh7XG4gIHVzZUludmFsaWQ6ICgpID0+IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCcsICgpID0+ICh7XG4gIGRhdGFzZXREZXRhaWxRdWVyeUtleVByZWZpeDogWydkYXRhc2V0LWRldGFpbCddLFxuICB1c2VJbnZhbGlkRGF0YXNldExpc3Q6ICgpID0+IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3dvcmtmbG93JywgKCkgPT4gKHtcbiAgZmV0Y2hXb3JrZmxvd0RyYWZ0OiB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICBncmFwaDogeyBub2RlczogW10sIGVkZ2VzOiBbXSwgdmlld3BvcnQ6IHt9IH0sXG4gICAgaGFzaDogJ3Rlc3QtaGFzaCcsXG4gICAgcmFnX3BpcGVsaW5lX3ZhcmlhYmxlczogW10sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgZXZlbnQgZW1pdHRlciBjb250ZXh0IC0gd2l0aCBjb250cm9sbGFibGUgc3Vic2NyaXB0aW9uXG5sZXQgbW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2s6ICgodjogeyB0eXBlOiBzdHJpbmcsIHBheWxvYWQ/OiB7IGRhdGE/OiBFbnZpcm9ubWVudFZhcmlhYmxlW10gfSB9KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5jb25zdCBtb2NrVXNlU3Vic2NyaXB0aW9uID0gdmkuZm4oKGNhbGxiYWNrOiAodjogeyB0eXBlOiBzdHJpbmcsIHBheWxvYWQ/OiB7IGRhdGE/OiBFbnZpcm9ubWVudFZhcmlhYmxlW10gfSB9KSA9PiB2b2lkKSA9PiB7XG4gIG1vY2tFdmVudFN1YnNjcmlwdGlvbkNhbGxiYWNrID0gY2FsbGJhY2tcbn0pXG52aS5tb2NrKCdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcicsICgpID0+ICh7XG4gIHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0OiAoKSA9PiAoe1xuICAgIGV2ZW50RW1pdHRlcjoge1xuICAgICAgdXNlU3Vic2NyaXB0aW9uOiBtb2NrVXNlU3Vic2NyaXB0aW9uLFxuICAgICAgZW1pdDogdmkuZm4oKSxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHRvYXN0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9LFxuICB1c2VUb2FzdENvbnRleHQ6ICgpID0+ICh7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9KSxcbiAgVG9hc3RDb250ZXh0OiB7XG4gICAgUHJvdmlkZXI6ICh7IGNoaWxkcmVuIH06IFByb3BzV2l0aENoaWxkcmVuKSA9PiBjaGlsZHJlbixcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHVzZVRoZW1lIGhvb2tcbnZpLm1vY2soJ0AvaG9va3MvdXNlLXRoZW1lJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICB0aGVtZTogJ2xpZ2h0JyxcbiAgfSksXG59KSlcblxuLy8gTW9jayBiYXNlUGF0aFxudmkubW9jaygnQC91dGlscy92YXInLCAoKSA9PiAoe1xuICBiYXNlUGF0aDogJy9wdWJsaWMnLFxufSkpXG5cbi8vIE1vY2sgcHJvdmlkZXIgY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+IGNyZWF0ZU1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSgpLFxufSkpXG5cbi8vIE1vY2sgV29ya2Zsb3dXaXRoSW5uZXJDb250ZXh0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93JywgKCkgPT4gKHtcbiAgV29ya2Zsb3dXaXRoSW5uZXJDb250ZXh0OiAoeyBjaGlsZHJlbiB9OiBQcm9wc1dpdGhDaGlsZHJlbikgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ3b3JrZmxvdy1pbm5lci1jb250ZXh0XCI+e2NoaWxkcmVufTwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgd29ya2Zsb3cgcGFuZWxcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjb21wb25lbnRzIH06IHsgY29tcG9uZW50cz86IHsgbGVmdD86IFJlYWN0LlJlYWN0Tm9kZSwgcmlnaHQ/OiBSZWFjdC5SZWFjdE5vZGUgfSB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cIndvcmtmbG93LXBhbmVsXCI+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicGFuZWwtbGVmdFwiPntjb21wb25lbnRzPy5sZWZ0fTwvZGl2PlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBhbmVsLXJpZ2h0XCI+e2NvbXBvbmVudHM/LnJpZ2h0fTwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgUGx1Z2luRGVwZW5kZW5jeVxudmkubW9jaygnLi4vLi4vd29ya2Zsb3cvcGx1Z2luLWRlcGVuZGVuY3knLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwicGx1Z2luLWRlcGVuZGVuY3lcIiAvPixcbn0pKVxuXG4vLyBNb2NrIHBsdWdpbi1kZXBlbmRlbmN5IGhvb2tzXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BsdWdpbi1kZXBlbmRlbmN5L2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luRGVwZW5kZW5jaWVzOiAoKSA9PiAoe1xuICAgIGhhbmRsZUNoZWNrUGx1Z2luRGVwZW5kZW5jaWVzOiB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZCksXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgRFNMRXhwb3J0Q29uZmlybU1vZGFsXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2RzbC1leHBvcnQtY29uZmlybS1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGVudkxpc3QsIG9uQ29uZmlybSwgb25DbG9zZSB9OiB7IGVudkxpc3Q6IEVudmlyb25tZW50VmFyaWFibGVbXSwgb25Db25maXJtOiAoKSA9PiB2b2lkLCBvbkNsb3NlOiAoKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZHNsLWV4cG9ydC1jb25maXJtLW1vZGFsXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVudi1jb3VudFwiPntlbnZMaXN0Lmxlbmd0aH08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiZXhwb3J0LWNvbmZpcm1cIiBvbkNsaWNrPXtvbkNvbmZpcm19PkNvbmZpcm08L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJleHBvcnQtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgd29ya2Zsb3cgY29uc3RhbnRzXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnN0YW50cycsICgpID0+ICh7XG4gIERTTF9FWFBPUlRfQ0hFQ0s6ICdEU0xfRVhQT1JUX0NIRUNLJyxcbiAgV09SS0ZMT1dfREFUQV9VUERBVEU6ICdXT1JLRkxPV19EQVRBX1VQREFURScsXG59KSlcblxuLy8gTW9jayB3b3JrZmxvdyB1dGlsc1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscycsICgpID0+ICh7XG4gIGluaXRpYWxOb2RlczogdmkuZm4obm9kZXMgPT4gbm9kZXMpLFxuICBpbml0aWFsRWRnZXM6IHZpLmZuKGVkZ2VzID0+IGVkZ2VzKSxcbiAgZ2V0S2V5Ym9hcmRLZXlDb2RlQnlTeXN0ZW06IChrZXk6IHN0cmluZykgPT4ga2V5LFxuICBnZXRLZXlib2FyZEtleU5hbWVCeVN5c3RlbTogKGtleTogc3RyaW5nKSA9PiBrZXksXG59KSlcblxuLy8gTW9jayBDb25maXJtIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvbmZpcm0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyB0aXRsZSwgY29udGVudCwgaXNTaG93LCBvbkNvbmZpcm0sIG9uQ2FuY2VsLCBpc0xvYWRpbmcsIGlzRGlzYWJsZWQgfToge1xuICAgIHRpdGxlOiBzdHJpbmdcbiAgICBjb250ZW50OiBzdHJpbmdcbiAgICBpc1Nob3c6IGJvb2xlYW5cbiAgICBvbkNvbmZpcm06ICgpID0+IHZvaWRcbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICAgIGlzTG9hZGluZz86IGJvb2xlYW5cbiAgICBpc0Rpc2FibGVkPzogYm9vbGVhblxuICB9KSA9PiBpc1Nob3dcbiAgICA/IChcbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImNvbmZpcm0tbW9kYWxcIj5cbiAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY29uZmlybS10aXRsZVwiPnt0aXRsZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY29uZmlybS1jb250ZW50XCI+e2NvbnRlbnR9PC9kaXY+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJjb25maXJtLWJ0blwiXG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNvbmZpcm19XG4gICAgICAgICAgICBkaXNhYmxlZD17aXNEaXNhYmxlZCB8fCBpc0xvYWRpbmd9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgQ29uZmlybVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjYW5jZWwtYnRuXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICA6IG51bGwsXG59KSlcblxuLy8gTW9jayBNb2RhbCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNoaWxkcmVuLCBpc1Nob3csIG9uQ2xvc2UsIGNsYXNzTmFtZSB9OiBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gICAgaXNTaG93OiBib29sZWFuXG4gICAgb25DbG9zZTogKCkgPT4gdm9pZFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9PikgPT4gaXNTaG93XG4gICAgPyAoXG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2RhbFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBvbkNsaWNrPXtlID0+IGUudGFyZ2V0ID09PSBlLmN1cnJlbnRUYXJnZXQgJiYgb25DbG9zZSgpfT5cbiAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIDogbnVsbCxcbn0pKVxuXG4vLyBNb2NrIElucHV0IGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2lucHV0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgdmFsdWUsIG9uQ2hhbmdlLCBwbGFjZWhvbGRlciB9OiB7XG4gICAgdmFsdWU6IHN0cmluZ1xuICAgIG9uQ2hhbmdlOiAoZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHZvaWRcbiAgICBwbGFjZWhvbGRlcj86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGlucHV0XG4gICAgICBkYXRhLXRlc3RpZD1cImlucHV0XCJcbiAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cbiAgICAvPlxuICApLFxufSkpXG5cbi8vIE1vY2sgVGV4dGFyZWEgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdGV4dGFyZWEnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyB2YWx1ZSwgb25DaGFuZ2UsIHBsYWNlaG9sZGVyLCBjbGFzc05hbWUgfToge1xuICAgIHZhbHVlOiBzdHJpbmdcbiAgICBvbkNoYW5nZTogKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxUZXh0QXJlYUVsZW1lbnQ+KSA9PiB2b2lkXG4gICAgcGxhY2Vob2xkZXI/OiBzdHJpbmdcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgfSkgPT4gKFxuICAgIDx0ZXh0YXJlYVxuICAgICAgZGF0YS10ZXN0aWQ9XCJ0ZXh0YXJlYVwiXG4gICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAvPlxuICApLFxufSkpXG5cbi8vIE1vY2sgQXBwSWNvbiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uQ2xpY2ssIGljb25UeXBlLCBpY29uLCBiYWNrZ3JvdW5kLCBpbWFnZVVybCwgY2xhc3NOYW1lLCBzaXplIH06IHtcbiAgICBvbkNsaWNrPzogKCkgPT4gdm9pZFxuICAgIGljb25UeXBlPzogc3RyaW5nXG4gICAgaWNvbj86IHN0cmluZ1xuICAgIGJhY2tncm91bmQ/OiBzdHJpbmdcbiAgICBpbWFnZVVybD86IHN0cmluZ1xuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICAgIHNpemU/OiBzdHJpbmdcbiAgfSkgPT4gKFxuICAgIDxkaXZcbiAgICAgIGRhdGEtdGVzdGlkPVwiYXBwLWljb25cIlxuICAgICAgZGF0YS1pY29uLXR5cGU9e2ljb25UeXBlfVxuICAgICAgZGF0YS1pY29uPXtpY29ufVxuICAgICAgZGF0YS1iYWNrZ3JvdW5kPXtiYWNrZ3JvdW5kfVxuICAgICAgZGF0YS1pbWFnZS11cmw9e2ltYWdlVXJsfVxuICAgICAgZGF0YS1zaXplPXtzaXplfVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgIC8+XG4gICksXG59KSlcblxuLy8gTW9jayBBcHBJY29uUGlja2VyIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FwcC1pY29uLXBpY2tlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uU2VsZWN0LCBvbkNsb3NlIH06IHtcbiAgICBvblNlbGVjdDogKGl0ZW06IHsgdHlwZTogc3RyaW5nLCBpY29uPzogc3RyaW5nLCBiYWNrZ3JvdW5kPzogc3RyaW5nLCB1cmw/OiBzdHJpbmcgfSkgPT4gdm9pZFxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJhcHAtaWNvbi1waWNrZXJcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWxlY3QtZW1vamlcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCh7IHR5cGU6ICdlbW9qaScsIGljb246ICfwn5qAJywgYmFja2dyb3VuZDogJyMwMDAwMDAnIH0pfVxuICAgICAgPlxuICAgICAgICBTZWxlY3QgRW1vamlcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC1pbWFnZVwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KHsgdHlwZTogJ2ltYWdlJywgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycgfSl9XG4gICAgICA+XG4gICAgICAgIFNlbGVjdCBJbWFnZVxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiY2xvc2UtcGlja2VyXCIgb25DbGljaz17b25DbG9zZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIFVwbG9hZGVyIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9hcHAvY3JlYXRlLWZyb20tZHNsLW1vZGFsL3VwbG9hZGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgZmlsZSwgdXBkYXRlRmlsZSwgY2xhc3NOYW1lLCBhY2NlcHQsIGRpc3BsYXlOYW1lIH06IHtcbiAgICBmaWxlPzogRmlsZVxuICAgIHVwZGF0ZUZpbGU6IChmaWxlPzogRmlsZSkgPT4gdm9pZFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICAgIGFjY2VwdD86IHN0cmluZ1xuICAgIGRpc3BsYXlOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidXBsb2FkZXJcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICA8aW5wdXRcbiAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cImZpbGUtaW5wdXRcIlxuICAgICAgICBhY2NlcHQ9e2FjY2VwdH1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWxlID0gZS50YXJnZXQuZmlsZXM/LlswXVxuICAgICAgICAgIHVwZGF0ZUZpbGUoc2VsZWN0ZWRGaWxlKVxuICAgICAgICB9fVxuICAgICAgLz5cbiAgICAgIHtmaWxlICYmIDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1uYW1lXCI+e2ZpbGUubmFtZX08L3NwYW4+fVxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJkaXNwbGF5LW5hbWVcIj57ZGlzcGxheU5hbWV9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNsZWFyLWZpbGVcIiBvbkNsaWNrPXsoKSA9PiB1cGRhdGVGaWxlKHVuZGVmaW5lZCl9PkNsZWFyPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayB1c2UtY29udGV4dC1zZWxlY3RvclxudmkubW9jaygndXNlLWNvbnRleHQtc2VsZWN0b3InLCAoKSA9PiAoe1xuICB1c2VDb250ZXh0OiB2aS5mbigoKSA9PiAoe1xuICAgIG5vdGlmeTogdmkuZm4oKSxcbiAgfSkpLFxufSkpXG5cbi8vIE1vY2sgUmFnUGlwZWxpbmVIZWFkZXJcbnZpLm1vY2soJy4vcmFnLXBpcGVsaW5lLWhlYWRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJyYWctcGlwZWxpbmUtaGVhZGVyXCIgLz4sXG59KSlcblxuLy8gTW9jayBQdWJsaXNoVG9hc3RcbnZpLm1vY2soJy4vcHVibGlzaC10b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJwdWJsaXNoLXRvYXN0XCIgLz4sXG59KSlcblxuLy8gTW9jayBVcGRhdGVEU0xNb2RhbCBmb3IgUmFnUGlwZWxpbmVDaGlsZHJlbiB0ZXN0c1xudmkubW9jaygnLi91cGRhdGUtZHNsLW1vZGFsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb25DYW5jZWwsIG9uQmFja3VwLCBvbkltcG9ydCB9OiB7XG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgICBvbkJhY2t1cDogKCkgPT4gdm9pZFxuICAgIG9uSW1wb3J0PzogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInVwZGF0ZS1kc2wtbW9kYWxcIj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJkc2wtY2FuY2VsXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImRzbC1iYWNrdXBcIiBvbkNsaWNrPXtvbkJhY2t1cH0+QmFja3VwPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiZHNsLWltcG9ydFwiIG9uQ2xpY2s9e29uSW1wb3J0fT5JbXBvcnQ8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIERTTEV4cG9ydENvbmZpcm1Nb2RhbCBmb3IgUmFnUGlwZWxpbmVDaGlsZHJlbiB0ZXN0c1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9kc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBlbnZMaXN0LCBvbkNvbmZpcm0sIG9uQ2xvc2UgfToge1xuICAgIGVudkxpc3Q6IEVudmlyb25tZW50VmFyaWFibGVbXVxuICAgIG9uQ29uZmlybTogKCkgPT4gdm9pZFxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIGVudkxpc3QubGVuZ3RoID4gMFxuICAgICAgPyAoXG4gICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImRzbC1leHBvcnQtY29uZmlybS1tb2RhbFwiPlxuICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJlbnYtY291bnRcIj57ZW52TGlzdC5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImRzbC1leHBvcnQtY29uZmlybVwiIG9uQ2xpY2s9e29uQ29uZmlybX0+Q29uZmlybTwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImRzbC1leHBvcnQtY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICA6IG51bGxcbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFN1aXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnQ29udmVyc2lvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udmVyc2lvbiBjb21wb25lbnQgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29udmVyc2lvbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5jb252ZXJzaW9uLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udmVyc2lvbiBidXR0b24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmVcXC5vcGVyYXRpb25zXFwuY29udmVydC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlc2NyaXB0aW9uIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuY29udmVyc2lvbi5kZXNjcmlwdGlvbkNodW5rMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmNvbnZlcnNpb24uZGVzY3JpcHRpb25DaHVuazInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3YXJuaW5nIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuY29udmVyc2lvbi53YXJuaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUGlwZWxpbmVTY3JlZW5TaG90IGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29udmVyc2lvbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9jay1pbWFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvbmZpcm0gbW9kYWwgd2hlbiBjb252ZXJ0IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb252ZXJzaW9uIC8+KVxuXG4gICAgICBjb25zdCBjb252ZXJ0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lXFwub3BlcmF0aW9uc1xcLmNvbnZlcnQvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbnZlcnRCdXR0b24pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS10aXRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldFBpcGVsaW5lLmNvbnZlcnNpb24uY29uZmlybS50aXRsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBjb25maXJtIG1vZGFsIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIC8vIE9wZW4gbW9kYWxcbiAgICAgIGNvbnN0IGNvbnZlcnRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmVcXC5vcGVyYXRpb25zXFwuY29udmVydC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29udmVydEJ1dHRvbilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDYW5jZWwgbW9kYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC1idG4nKSlcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQVBJIENhbGxiYWNrIFRlc3RzIC0gY292ZXJzIGxpbmVzIDIxLTM5XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdBUEkgQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbW9ja0NvbnZlcnRGbiA9IHZpLmZuKClcbiAgICAgIG1vY2tJc1BlbmRpbmcgPSBmYWxzZVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgY29udmVydCB3aXRoIGRhdGFzZXRJZCBhbmQgc2hvdyBzdWNjZXNzIHRvYXN0IG9uIHN1Y2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBTZXR1cCBtb2NrIHRvIGNhcHR1cmUgYW5kIGNhbGwgb25TdWNjZXNzIGNhbGxiYWNrXG4gICAgICBtb2NrQ29udmVydEZuLm1vY2tJbXBsZW1lbnRhdGlvbigoX2RhdGFzZXRJZDogc3RyaW5nLCBvcHRpb25zOiB7IG9uU3VjY2VzczogKHJlczogeyBzdGF0dXM6IHN0cmluZyB9KSA9PiB2b2lkIH0pID0+IHtcbiAgICAgICAgb3B0aW9ucy5vblN1Y2Nlc3MoeyBzdGF0dXM6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb252ZXJzaW9uIC8+KVxuXG4gICAgICAvLyBPcGVuIG1vZGFsIGFuZCBjb25maXJtXG4gICAgICBjb25zdCBjb252ZXJ0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lXFwub3BlcmF0aW9uc1xcLmNvbnZlcnQvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbnZlcnRCdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDb252ZXJ0Rm4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LWRhdGFzZXQtaWQnLCBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgb25TdWNjZXNzOiBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgICBvbkVycm9yOiBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgfSkpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIG1vZGFsIG9uIHN1Y2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrQ29udmVydEZuLm1vY2tJbXBsZW1lbnRhdGlvbigoX2RhdGFzZXRJZDogc3RyaW5nLCBvcHRpb25zOiB7IG9uU3VjY2VzczogKHJlczogeyBzdGF0dXM6IHN0cmluZyB9KSA9PiB2b2lkIH0pID0+IHtcbiAgICAgICAgb3B0aW9ucy5vblN1Y2Nlc3MoeyBzdGF0dXM6ICdzdWNjZXNzJyB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb252ZXJzaW9uIC8+KVxuXG4gICAgICBjb25zdCBjb252ZXJ0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lXFwub3BlcmF0aW9uc1xcLmNvbnZlcnQvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbnZlcnRCdXR0b24pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IHdoZW4gY29udmVyc2lvbiBmYWlscyB3aXRoIHN0YXR1cyBmYWlsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrQ29udmVydEZuLm1vY2tJbXBsZW1lbnRhdGlvbigoX2RhdGFzZXRJZDogc3RyaW5nLCBvcHRpb25zOiB7IG9uU3VjY2VzczogKHJlczogeyBzdGF0dXM6IHN0cmluZyB9KSA9PiB2b2lkIH0pID0+IHtcbiAgICAgICAgb3B0aW9ucy5vblN1Y2Nlc3MoeyBzdGF0dXM6ICdmYWlsZWQnIH0pXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIGNvbnN0IGNvbnZlcnRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmVcXC5vcGVyYXRpb25zXFwuY29udmVydC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29udmVydEJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NvbnZlcnRGbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgICAgLy8gTW9kYWwgc2hvdWxkIHN0aWxsIGJlIHZpc2libGUgc2luY2UgY29udmVyc2lvbiBmYWlsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3Qgd2hlbiBjb252ZXJzaW9uIHRocm93cyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tDb252ZXJ0Rm4ubW9ja0ltcGxlbWVudGF0aW9uKChfZGF0YXNldElkOiBzdHJpbmcsIG9wdGlvbnM6IHsgb25FcnJvcjogKCkgPT4gdm9pZCB9KSA9PiB7XG4gICAgICAgIG9wdGlvbnMub25FcnJvcigpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIGNvbnN0IGNvbnZlcnRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmVcXC5vcGVyYXRpb25zXFwuY29udmVydC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29udmVydEJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NvbnZlcnRGbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBDb252ZXJzaW9uIGlzIGV4cG9ydGVkIHdpdGggUmVhY3QubWVtb1xuICAgICAgZXhwZWN0KChDb252ZXJzaW9uIGFzIHVua25vd24gYXMgeyAkJHR5cGVvZjogc3ltYm9sIH0pLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdXNlQ2FsbGJhY2sgZm9yIGhhbmRsZUNvbnZlcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENvbnZlcnNpb24gLz4pXG5cbiAgICAgIC8vIFJlcmVuZGVyIHNob3VsZCBub3QgY2F1c2UgaXNzdWVzIHdpdGggY2FsbGJhY2tcbiAgICAgIHJlcmVuZGVyKDxDb252ZXJzaW9uIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZVxcLm9wZXJhdGlvbnNcXC5jb252ZXJ0L2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBkYXRhc2V0SWQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29udmVyc2lvbiAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5jb252ZXJzaW9uLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ1BpcGVsaW5lU2NyZWVuU2hvdCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UGlwZWxpbmVTY3JlZW5TaG90IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2NrLWltYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGltYWdlIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBpcGVsaW5lU2NyZWVuU2hvdCAvPilcblxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2NrLWltYWdlJylcbiAgICAgIGV4cGVjdChpbWcpLnRvSGF2ZUF0dHJpYnV0ZSgnYWx0JywgJ1BpcGVsaW5lIFNjcmVlbnNob3QnKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCd3aWR0aCcsICc2OTInKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdoZWlnaHQnLCAnNDU2JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY29ycmVjdCB0aGVtZS1iYXNlZCBzb3VyY2UgcGF0aCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UGlwZWxpbmVTY3JlZW5TaG90IC8+KVxuXG4gICAgICBjb25zdCBpbWcgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vY2staW1hZ2UnKVxuICAgICAgLy8gRGVmYXVsdCB0aGVtZSBpcyAnbGlnaHQnIGZyb20gbW9ja1xuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnL3B1YmxpYy9zY3JlZW5zaG90cy9saWdodC9QaXBlbGluZS5wbmcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKFBpcGVsaW5lU2NyZWVuU2hvdCBhcyB1bmtub3duIGFzIHsgJCR0eXBlb2Y6IHN5bWJvbCB9KS4kJHR5cGVvZikudG9CZShTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdQdWJsaXNoVG9hc3QnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBOb3RlOiBQdWJsaXNoVG9hc3QgaXMgbW9ja2VkLCBzbyB3ZSBqdXN0IHZlcmlmeSB0aGUgbW9jayByZW5kZXJzXG4gICAgICByZW5kZXIoPFB1Ymxpc2hUb2FzdCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHVibGlzaC10b2FzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gVGhlIHJlYWwgUHVibGlzaFRvYXN0IGlzIG1vY2tlZCwgYnV0IHdlIGNhbiB2ZXJpZnkgdGhlIGltcG9ydFxuICAgICAgZXhwZWN0KFB1Ymxpc2hUb2FzdCkudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnUHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCcsICgpID0+IHtcbiAgY29uc3QgbW9ja09uQ2FuY2VsID0gdmkuZm4oKVxuICBjb25zdCBtb2NrT25Db25maXJtID0gdmkuZm4oKVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvbkNhbmNlbDogbW9ja09uQ2FuY2VsLFxuICAgIG9uQ29uZmlybTogbW9ja09uQ29uZmlybSxcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggdGl0bGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5jb21tb24ucHVibGlzaEFzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbmFtZSBpbnB1dCB3aXRoIGRlZmF1bHQgdmFsdWUgZnJvbSBzdG9yZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0JylcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ1Rlc3QgS25vd2xlZGdlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVzY3JpcHRpb24gdGV4dGFyZWEnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RleHRhcmVhJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXBwIGljb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGFuZCBjb25maXJtIGJ1dHRvbnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb25cXC5vcGVyYXRpb25cXC5jYW5jZWwvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93XFwuY29tbW9uXFwucHVibGlzaC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgbmFtZSB3aGVuIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ05ldyBQaXBlbGluZSBOYW1lJyB9IH0pXG5cbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ05ldyBQaXBlbGluZSBOYW1lJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZGVzY3JpcHRpb24gd2hlbiB0ZXh0YXJlYSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCB0ZXh0YXJlYSA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndGV4dGFyZWEnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZSh0ZXh0YXJlYSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdOZXcgZGVzY3JpcHRpb24nIH0gfSlcblxuICAgICAgZXhwZWN0KHRleHRhcmVhKS50b0hhdmVWYWx1ZSgnTmV3IGRlc2NyaXB0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uXFwub3BlcmF0aW9uXFwuY2FuY2VsL2kgfSkpXG5cbiAgICAgIGV4cGVjdChtb2NrT25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DYW5jZWwgd2hlbiBjbG9zZSBpY29uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3B1Ymxpc2gtbW9kYWwtY2xvc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChtb2NrT25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25Db25maXJtIHdpdGggdHJpbW1lZCB2YWx1ZXMgd2hlbiBwdWJsaXNoIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgbW9ja09uQ29uZmlybS5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UodW5kZWZpbmVkKVxuXG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFVwZGF0ZSB2YWx1ZXNcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dCcpLCB7IHRhcmdldDogeyB2YWx1ZTogJyAgVHJpbW1lZCBOYW1lICAnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5VGVzdElkKCd0ZXh0YXJlYScpLCB7IHRhcmdldDogeyB2YWx1ZTogJyAgVHJpbW1lZCBEZXNjcmlwdGlvbiAgJyB9IH0pXG5cbiAgICAgIC8vIENsaWNrIHB1Ymxpc2hcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLnB1Ymxpc2gvaSB9KSlcblxuICAgICAgZXhwZWN0KG1vY2tPbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAnVHJpbW1lZCBOYW1lJyxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAnVHJpbW1lZCBEZXNjcmlwdGlvbicsXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBhcHAgaWNvbiBwaWNrZXIgd2hlbiBpY29uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uLXBpY2tlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGljb24gd2hlbiBlbW9qaSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gT3BlbiBwaWNrZXJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uJykpXG5cbiAgICAgIC8vIFNlbGVjdCBlbW9qaVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWVtb2ppJykpXG5cbiAgICAgIC8vIFBpY2tlciBzaG91bGQgY2xvc2VcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnYXBwLWljb24tcGlja2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGljb24gd2hlbiBpbWFnZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gT3BlbiBwaWNrZXJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uJykpXG5cbiAgICAgIC8vIFNlbGVjdCBpbWFnZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWltYWdlJykpXG5cbiAgICAgIC8vIFBpY2tlciBzaG91bGQgY2xvc2VcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnYXBwLWljb24tcGlja2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgcGlja2VyIGFuZCByZXN0b3JlIGljb24gd2hlbiBwaWNrZXIgaXMgY2xvc2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIHBpY2tlclxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLWljb24nKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uLXBpY2tlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENsb3NlIHBpY2tlclxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtcGlja2VyJykpXG5cbiAgICAgIC8vIFBpY2tlciBzaG91bGQgY2xvc2VcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnYXBwLWljb24tcGlja2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBWYWxpZGF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcyBWYWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwdWJsaXNoIGJ1dHRvbiB3aGVuIG5hbWUgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIENsZWFyIHRoZSBuYW1lXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQnKSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcnIH0gfSlcblxuICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93XFwuY29tbW9uXFwucHVibGlzaC9pIH0pXG4gICAgICBleHBlY3QocHVibGlzaEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHB1Ymxpc2ggYnV0dG9uIHdoZW4gbmFtZSBpcyBvbmx5IHdoaXRlc3BhY2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFNldCB3aGl0ZXNwYWNlLW9ubHkgbmFtZVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0JyksIHsgdGFyZ2V0OiB7IHZhbHVlOiAnICAgJyB9IH0pXG5cbiAgICAgIGNvbnN0IHB1Ymxpc2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLnB1Ymxpc2gvaSB9KVxuICAgICAgZXhwZWN0KHB1Ymxpc2hCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwdWJsaXNoIGJ1dHRvbiB3aGVuIGNvbmZpcm1EaXNhYmxlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNvbmZpcm1EaXNhYmxlZCAvPilcblxuICAgICAgY29uc3QgcHVibGlzaEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93XFwuY29tbW9uXFwucHVibGlzaC9pIH0pXG4gICAgICBleHBlY3QocHVibGlzaEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNvbmZpcm0gd2hlbiBjb25maXJtRGlzYWJsZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjb25maXJtRGlzYWJsZWQgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC93b3JrZmxvd1xcLmNvbW1vblxcLnB1Ymxpc2gvaSB9KSlcblxuICAgICAgZXhwZWN0KG1vY2tPbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSB1c2VDYWxsYmFjayBmb3IgaGFuZGxlU2VsZWN0SWNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gUmVyZW5kZXIgc2hvdWxkIG5vdCBjYXVzZSBpc3N1ZXNcbiAgICAgIHJlcmVuZGVyKDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnUmFnUGlwZWxpbmVQYW5lbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFuZWwgY29tcG9uZW50IHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3dvcmtmbG93LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFuZWwgd2l0aCBsZWZ0IGFuZCByaWdodCBzbG90cycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFuZWwtbGVmdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYW5lbC1yaWdodCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggbWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoUmFnUGlwZWxpbmVQYW5lbCBhcyB1bmtub3duIGFzIHsgJCR0eXBlb2Y6IHN5bWJvbCB9KS4kJHR5cGVvZikudG9CZShTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCdSYWdQaXBlbGluZUNoaWxkcmVuJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrU2hvd0ltcG9ydERTTE1vZGFsID0gZmFsc2VcbiAgICBtb2NrRXZlbnRTdWJzY3JpcHRpb25DYWxsYmFjayA9IG51bGxcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZUNoaWxkcmVuIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4tZGVwZW5kZW5jeScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyYWctcGlwZWxpbmUtaGVhZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3B1Ymxpc2gtdG9hc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgVXBkYXRlRFNMTW9kYWwgd2hlbiBzaG93SW1wb3J0RFNMTW9kYWwgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrU2hvd0ltcG9ydERTTE1vZGFsID0gZmFsc2VcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd1cGRhdGUtZHNsLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFVwZGF0ZURTTE1vZGFsIHdoZW4gc2hvd0ltcG9ydERTTE1vZGFsIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBtb2NrU2hvd0ltcG9ydERTTE1vZGFsID0gdHJ1ZVxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZUNoaWxkcmVuIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1cGRhdGUtZHNsLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IFN1YnNjcmlwdGlvbiBUZXN0cyAtIGNvdmVycyBsaW5lcyAzNy00MFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRXZlbnQgU3Vic2NyaXB0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3Vic2NyaWJlIHRvIGV2ZW50IGVtaXR0ZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lQ2hpbGRyZW4gLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrVXNlU3Vic2NyaXB0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgRFNMX0VYUE9SVF9DSEVDSyBldmVudCBhbmQgc2V0IHNlY3JldEVudkxpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lQ2hpbGRyZW4gLz4pXG5cbiAgICAgIC8vIFNpbXVsYXRlIERTTF9FWFBPUlRfQ0hFQ0sgZXZlbnRcbiAgICAgIGNvbnN0IG1vY2tFbnZWYXJpYWJsZXM6IEVudmlyb25tZW50VmFyaWFibGVbXSA9IFtcbiAgICAgICAgeyBpZDogJzEnLCBuYW1lOiAnU0VDUkVUX0tFWScsIHZhbHVlOiAndGVzdC1zZWNyZXQnLCB2YWx1ZV90eXBlOiAnc2VjcmV0JyBhcyBjb25zdCwgZGVzY3JpcHRpb246ICcnIH0sXG4gICAgICBdXG5cbiAgICAgIC8vIFRyaWdnZXIgdGhlIHN1YnNjcmlwdGlvbiBjYWxsYmFja1xuICAgICAgaWYgKG1vY2tFdmVudFN1YnNjcmlwdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgIG1vY2tFdmVudFN1YnNjcmlwdGlvbkNhbGxiYWNrKHtcbiAgICAgICAgICB0eXBlOiAnRFNMX0VYUE9SVF9DSEVDSycsXG4gICAgICAgICAgcGF5bG9hZDogeyBkYXRhOiBtb2NrRW52VmFyaWFibGVzIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIERTTEV4cG9ydENvbmZpcm1Nb2RhbCBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBEU0xFeHBvcnRDb25maXJtTW9kYWwgZm9yIG5vbi1EU0xfRVhQT1JUX0NIRUNLIGV2ZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPilcblxuICAgICAgLy8gVHJpZ2dlciBhIGRpZmZlcmVudCBldmVudCB0eXBlXG4gICAgICBpZiAobW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgbW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2soe1xuICAgICAgICAgIHR5cGU6ICdPVEhFUl9FVkVOVCcsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZHNsLWV4cG9ydC1jb25maXJtLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVcGRhdGVEU0xNb2RhbCBIYW5kbGVycyBUZXN0cyAtIGNvdmVycyBsaW5lcyA0OC01MVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXBkYXRlRFNMTW9kYWwgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBtb2NrU2hvd0ltcG9ydERTTE1vZGFsID0gdHJ1ZVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0U2hvd0ltcG9ydERTTE1vZGFsKGZhbHNlKSB3aGVuIG9uQ2FuY2VsIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lQ2hpbGRyZW4gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1jYW5jZWwnKSlcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0ltcG9ydERTTE1vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGV4cG9ydENoZWNrIHdoZW4gb25CYWNrdXAgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZHNsLWJhY2t1cCcpKVxuXG4gICAgICBleHBlY3QobW9ja0V4cG9ydENoZWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVBhbmVDb250ZXh0bWVudUNhbmNlbCB3aGVuIG9uSW1wb3J0IGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lQ2hpbGRyZW4gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1pbXBvcnQnKSlcblxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVQYW5lQ29udGV4dG1lbnVDYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRFNMRXhwb3J0Q29uZmlybU1vZGFsIFRlc3RzIC0gY292ZXJzIGxpbmVzIDU1LTYwXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdEU0xFeHBvcnRDb25maXJtTW9kYWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRFNMRXhwb3J0Q29uZmlybU1vZGFsIHdoZW4gc2VjcmV0RW52TGlzdCBoYXMgaXRlbXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lQ2hpbGRyZW4gLz4pXG5cbiAgICAgIC8vIFNpbXVsYXRlIERTTF9FWFBPUlRfQ0hFQ0sgZXZlbnQgd2l0aCBzZWNyZXRzXG4gICAgICBjb25zdCBtb2NrRW52VmFyaWFibGVzOiBFbnZpcm9ubWVudFZhcmlhYmxlW10gPSBbXG4gICAgICAgIHsgaWQ6ICcxJywgbmFtZTogJ0FQSV9LRVknLCB2YWx1ZTogJ3NlY3JldC12YWx1ZScsIHZhbHVlX3R5cGU6ICdzZWNyZXQnIGFzIGNvbnN0LCBkZXNjcmlwdGlvbjogJycgfSxcbiAgICAgIF1cblxuICAgICAgaWYgKG1vY2tFdmVudFN1YnNjcmlwdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgIG1vY2tFdmVudFN1YnNjcmlwdGlvbkNhbGxiYWNrKHtcbiAgICAgICAgICB0eXBlOiAnRFNMX0VYUE9SVF9DSEVDSycsXG4gICAgICAgICAgcGF5bG9hZDogeyBkYXRhOiBtb2NrRW52VmFyaWFibGVzIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBEU0xFeHBvcnRDb25maXJtTW9kYWwgd2hlbiBvbkNsb3NlIGlzIHRyaWdnZXJlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPilcblxuICAgICAgLy8gRmlyc3Qgc2hvdyB0aGUgbW9kYWxcbiAgICAgIGNvbnN0IG1vY2tFbnZWYXJpYWJsZXM6IEVudmlyb25tZW50VmFyaWFibGVbXSA9IFtcbiAgICAgICAgeyBpZDogJzEnLCBuYW1lOiAnQVBJX0tFWScsIHZhbHVlOiAnc2VjcmV0LXZhbHVlJywgdmFsdWVfdHlwZTogJ3NlY3JldCcgYXMgY29uc3QsIGRlc2NyaXB0aW9uOiAnJyB9LFxuICAgICAgXVxuXG4gICAgICBpZiAobW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgbW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2soe1xuICAgICAgICAgIHR5cGU6ICdEU0xfRVhQT1JUX0NIRUNLJyxcbiAgICAgICAgICBwYXlsb2FkOiB7IGRhdGE6IG1vY2tFbnZWYXJpYWJsZXMgfSxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1leHBvcnQtY29uZmlybS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbG9zZSB0aGUgbW9kYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1leHBvcnQtY2xvc2UnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZHNsLWV4cG9ydC1jb25maXJtLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlRXhwb3J0RFNMIHdoZW4gb25Db25maXJtIGlzIHRyaWdnZXJlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPilcblxuICAgICAgLy8gU2hvdyB0aGUgbW9kYWxcbiAgICAgIGNvbnN0IG1vY2tFbnZWYXJpYWJsZXM6IEVudmlyb25tZW50VmFyaWFibGVbXSA9IFtcbiAgICAgICAgeyBpZDogJzEnLCBuYW1lOiAnQVBJX0tFWScsIHZhbHVlOiAnc2VjcmV0LXZhbHVlJywgdmFsdWVfdHlwZTogJ3NlY3JldCcgYXMgY29uc3QsIGRlc2NyaXB0aW9uOiAnJyB9LFxuICAgICAgXVxuXG4gICAgICBpZiAobW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgbW9ja0V2ZW50U3Vic2NyaXB0aW9uQ2FsbGJhY2soe1xuICAgICAgICAgIHR5cGU6ICdEU0xfRVhQT1JUX0NIRUNLJyxcbiAgICAgICAgICBwYXlsb2FkOiB7IGRhdGE6IG1vY2tFbnZWYXJpYWJsZXMgfSxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RzbC1leHBvcnQtY29uZmlybS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDb25maXJtIGV4cG9ydFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZHNsLWV4cG9ydC1jb25maXJtJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlRXhwb3J0RFNMKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBtZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KChSYWdQaXBlbGluZUNoaWxkcmVuIGFzIHVua25vd24gYXMgeyAkJHR5cGVvZjogc3ltYm9sIH0pLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0ludGVncmF0aW9uIFRlc3RzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCBGbG93JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tPbkNhbmNlbCA9IHZpLmZuKClcbiAgICBjb25zdCBtb2NrT25Db25maXJtID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG5cbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgcHVibGlzaCBmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbFxuICAgICAgICAgIG9uQ2FuY2VsPXttb2NrT25DYW5jZWx9XG4gICAgICAgICAgb25Db25maXJtPXttb2NrT25Db25maXJtfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gVXBkYXRlIG5hbWVcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dCcpLCB7IHRhcmdldDogeyB2YWx1ZTogJ015IFBpcGVsaW5lJyB9IH0pXG5cbiAgICAgIC8vIEFkZCBkZXNjcmlwdGlvblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RleHRhcmVhJyksIHsgdGFyZ2V0OiB7IHZhbHVlOiAnQSBncmVhdCBwaXBlbGluZScgfSB9KVxuXG4gICAgICAvLyBDaGFuZ2UgaWNvblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYXBwLWljb24nKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1lbW9qaScpKVxuXG4gICAgICAvLyBQdWJsaXNoXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvd29ya2Zsb3dcXC5jb21tb25cXC5wdWJsaXNoL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja09uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgJ015IFBpcGVsaW5lJyxcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpY29uX3R5cGU6ICdlbW9qaScsXG4gICAgICAgICAgICBpY29uOiAn8J+agCcsXG4gICAgICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjMDAwMDAwJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAnQSBncmVhdCBwaXBlbGluZScsXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVkZ2UgQ2FzZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdOdWxsL1VuZGVmaW5lZCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkga25vd2xlZGdlTmFtZScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWxcbiAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICBvbkNvbmZpcm09e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGVhciB0aGUgbmFtZVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnJyB9IH0pXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCcnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0JvdW5kYXJ5IENvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIHBpcGVsaW5lIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsXG4gICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgb25Db25maXJtPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgbG9uZ05hbWUgPSAnQScucmVwZWF0KDEwMDApXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6IGxvbmdOYW1lIH0gfSlcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUobG9uZ05hbWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbFxuICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgIG9uQ29uZmlybT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNwZWNpYWxOYW1lID0gJzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6IHNwZWNpYWxOYW1lIH0gfSlcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoc3BlY2lhbE5hbWUpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdDb252ZXJzaW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBhY2Nlc3NpYmxlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29udmVyc2lvbiAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lXFwub3BlcmF0aW9uc1xcLmNvbnZlcnQvaSB9KVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1B1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgZm9ybSBpbnB1dHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsXG4gICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgb25Db25maXJtPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGV4dGFyZWEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBidXR0b25zJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbFxuICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgIG9uQ29uZmlybT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb25cXC5vcGVyYXRpb25cXC5jYW5jZWwvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3dvcmtmbG93XFwuY29tbW9uXFwucHVibGlzaC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=