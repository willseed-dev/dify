"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const footer_tips_1 = require("./footer-tips");
const hooks_1 = require("./hooks");
const index_1 = require("./index");
const step_indicator_1 = require("./step-indicator");
// ============================================================================
// Pre-declare variables and functions used in mocks (hoisting)
// ============================================================================
// Mock Nodes for useDatasourceOptions - must be declared before vi.mock
let mockNodes = [];
// Test Data Factory - must be declared before vi.mock that uses it
const createNodeData = (overrides) => ({
    title: 'Test Node',
    desc: 'Test description',
    type: 'data-source',
    provider_type: pipeline_1.DatasourceType.localFile,
    provider_name: 'Local File',
    datasource_name: 'local_file',
    datasource_label: 'Local File',
    plugin_id: 'test-plugin',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const ns = options?.ns ? `${options.ns}.` : '';
            return `${ns}${key}`;
        },
    }),
}));
// Mock reactflow
vi.mock('reactflow', () => ({
    useNodes: () => mockNodes,
}));
// Mock zustand/react/shallow
vi.mock('zustand/react/shallow', () => ({
    useShallow: (fn) => fn,
}));
// Mock amplitude tracking
vi.mock('@/app/components/base/amplitude', () => ({
    trackEvent: vi.fn(),
}));
// ============================================================================
// Mock Data Source Store
// ============================================================================
let mockDataSourceStoreState = {
    localFileList: [],
    onlineDocuments: [],
    websitePages: [],
    selectedFileIds: [],
    currentCredentialId: '',
    currentNodeIdRef: { current: '' },
    bucket: '',
    onlineDriveFileList: [],
    setCurrentCredentialId: vi.fn(),
    setDocumentsData: vi.fn(),
    setSearchValue: vi.fn(),
    setSelectedPagesId: vi.fn(),
    setOnlineDocuments: vi.fn(),
    setCurrentDocument: vi.fn(),
    setStep: vi.fn(),
    setCrawlResult: vi.fn(),
    setWebsitePages: vi.fn(),
    setPreviewIndex: vi.fn(),
    setCurrentWebsite: vi.fn(),
    setOnlineDriveFileList: vi.fn(),
    setBucket: vi.fn(),
    setPrefix: vi.fn(),
    setKeywords: vi.fn(),
    setSelectedFileIds: vi.fn(),
};
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/store', () => ({
    useDataSourceStore: () => ({
        getState: () => mockDataSourceStoreState,
    }),
    useDataSourceStoreWithSelector: (selector) => selector(mockDataSourceStoreState),
}));
// ============================================================================
// Mock Workflow Store
// ============================================================================
let mockWorkflowStoreState = {
    setIsPreparingDataSource: vi.fn(),
    pipelineId: 'test-pipeline-id',
};
vi.mock('@/app/components/workflow/store', () => ({
    useWorkflowStore: () => ({
        getState: () => mockWorkflowStoreState,
    }),
    useStore: (selector) => selector(mockWorkflowStoreState),
}));
// ============================================================================
// Mock Workflow Hooks
// ============================================================================
const mockHandleRun = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useWorkflowRun: () => ({
        handleRun: mockHandleRun,
    }),
    useToolIcon: () => ({ type: 'icon', icon: 'test-icon' }),
}));
// ============================================================================
// Mock Child Components
// ============================================================================
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/local-file', () => ({
    default: ({ allowedExtensions, supportBatchUpload }) => (<div data-testid="local-file" data-extensions={JSON.stringify(allowedExtensions)} data-batch={supportBatchUpload}>
      LocalFile Component
    </div>),
}));
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/online-documents', () => ({
    default: ({ nodeId, isInPipeline, supportBatchUpload, onCredentialChange }) => (<div data-testid="online-documents" data-node-id={nodeId} data-in-pipeline={isInPipeline} data-batch={supportBatchUpload}>
      <button onClick={() => onCredentialChange?.('new-credential-id')}>Change Credential</button>
      OnlineDocuments Component
    </div>),
}));
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/website-crawl', () => ({
    default: ({ nodeId, isInPipeline, supportBatchUpload, onCredentialChange }) => (<div data-testid="website-crawl" data-node-id={nodeId} data-in-pipeline={isInPipeline} data-batch={supportBatchUpload}>
      <button onClick={() => onCredentialChange?.('new-credential-id')}>Change Credential</button>
      WebsiteCrawl Component
    </div>),
}));
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/online-drive', () => ({
    default: ({ nodeId, isInPipeline, supportBatchUpload, onCredentialChange }) => (<div data-testid="online-drive" data-node-id={nodeId} data-in-pipeline={isInPipeline} data-batch={supportBatchUpload}>
      <button onClick={() => onCredentialChange?.('new-credential-id')}>Change Credential</button>
      OnlineDrive Component
    </div>),
}));
vi.mock('./data-source-options', () => ({
    default: ({ dataSourceNodeId, onSelect }) => (<div data-testid="data-source-options" data-selected={dataSourceNodeId}>
      <button data-testid="select-local-file" onClick={() => onSelect({
            nodeId: 'local-file-node',
            nodeData: createNodeData({ provider_type: pipeline_1.DatasourceType.localFile, fileExtensions: ['txt', 'pdf'] }),
        })}>
        Select Local File
      </button>
      <button data-testid="select-online-document" onClick={() => onSelect({
            nodeId: 'online-doc-node',
            nodeData: createNodeData({ provider_type: pipeline_1.DatasourceType.onlineDocument }),
        })}>
        Select Online Document
      </button>
      <button data-testid="select-website-crawl" onClick={() => onSelect({
            nodeId: 'website-crawl-node',
            nodeData: createNodeData({ provider_type: pipeline_1.DatasourceType.websiteCrawl }),
        })}>
        Select Website Crawl
      </button>
      <button data-testid="select-online-drive" onClick={() => onSelect({
            nodeId: 'online-drive-node',
            nodeData: createNodeData({ provider_type: pipeline_1.DatasourceType.onlineDrive }),
        })}>
        Select Online Drive
      </button>
      <button data-testid="select-unknown-type" onClick={() => onSelect({
            nodeId: 'unknown-type-node',
            nodeData: createNodeData({ provider_type: 'unknown_type' }),
        })}>
        Select Unknown Type
      </button>
      DataSourceOptions
    </div>),
}));
vi.mock('./document-processing', () => ({
    default: ({ dataSourceNodeId, onProcess, onBack }) => (<div data-testid="document-processing" data-node-id={dataSourceNodeId}>
      <button data-testid="process-btn" onClick={() => onProcess({ field1: 'value1' })}>Process</button>
      <button data-testid="back-btn" onClick={onBack}>Back</button>
      DocumentProcessing
    </div>),
}));
// ============================================================================
// Helper to reset all mocks
// ============================================================================
const resetAllMocks = () => {
    mockDataSourceStoreState = {
        localFileList: [],
        onlineDocuments: [],
        websitePages: [],
        selectedFileIds: [],
        currentCredentialId: '',
        currentNodeIdRef: { current: '' },
        bucket: '',
        onlineDriveFileList: [],
        setCurrentCredentialId: vi.fn(),
        setDocumentsData: vi.fn(),
        setSearchValue: vi.fn(),
        setSelectedPagesId: vi.fn(),
        setOnlineDocuments: vi.fn(),
        setCurrentDocument: vi.fn(),
        setStep: vi.fn(),
        setCrawlResult: vi.fn(),
        setWebsitePages: vi.fn(),
        setPreviewIndex: vi.fn(),
        setCurrentWebsite: vi.fn(),
        setOnlineDriveFileList: vi.fn(),
        setBucket: vi.fn(),
        setPrefix: vi.fn(),
        setKeywords: vi.fn(),
        setSelectedFileIds: vi.fn(),
    };
    mockWorkflowStoreState = {
        setIsPreparingDataSource: vi.fn(),
        pipelineId: 'test-pipeline-id',
    };
    mockNodes = [];
    mockHandleRun.mockClear();
};
// ============================================================================
// StepIndicator Component Tests
// ============================================================================
describe('StepIndicator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultSteps = [
        { label: 'Step 1', value: 'step1' },
        { label: 'Step 2', value: 'step2' },
        { label: 'Step 3', value: 'step3' },
    ];
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('Step 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Step 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Step 3')).toBeInTheDocument();
        });
        it('should render all step labels', () => {
            // Arrange
            const steps = [
                { label: 'Data Source', value: 'dataSource' },
                { label: 'Processing', value: 'processing' },
            ];
            // Act
            (0, react_1.render)(<step_indicator_1.default steps={steps} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('Data Source')).toBeInTheDocument();
            expect(react_1.screen.getByText('Processing')).toBeInTheDocument();
        });
        it('should render container with correct classes', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper.className).toContain('flex');
            expect(wrapper.className).toContain('items-center');
            expect(wrapper.className).toContain('gap-x-2');
            expect(wrapper.className).toContain('px-4');
            expect(wrapper.className).toContain('pb-2');
        });
        it('should render divider between steps but not after last step', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert - Should have 2 dividers for 3 steps
            const dividers = container.querySelectorAll('.h-px.w-3');
            expect(dividers.length).toBe(2);
        });
        it('should not render divider when there is only one step', () => {
            // Arrange
            const singleStep = [{ label: 'Only Step', value: 'only' }];
            // Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={singleStep} currentStep={1}/>);
            // Assert
            const dividers = container.querySelectorAll('.h-px.w-3');
            expect(dividers.length).toBe(0);
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should highlight first step when currentStep is 1', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert - Check for accent indicator on first step
            const indicators = container.querySelectorAll('.bg-state-accent-solid');
            expect(indicators.length).toBe(1); // The dot indicator
        });
        it('should highlight second step when currentStep is 2', () => {
            // Arrange & Act
            (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={2}/>);
            // Assert
            const step2Container = react_1.screen.getByText('Step 2').parentElement;
            expect(step2Container?.className).toContain('text-state-accent-solid');
        });
        it('should highlight third step when currentStep is 3', () => {
            // Arrange & Act
            (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={3}/>);
            // Assert
            const step3Container = react_1.screen.getByText('Step 3').parentElement;
            expect(step3Container?.className).toContain('text-state-accent-solid');
        });
        it('should apply tertiary color to non-current steps', () => {
            // Arrange & Act
            (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert
            const step2Container = react_1.screen.getByText('Step 2').parentElement;
            expect(step2Container?.className).toContain('text-text-tertiary');
        });
        it('should show dot indicator only for current step', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={2}/>);
            // Assert - Only one dot should exist
            const dots = container.querySelectorAll('.size-1.rounded-full');
            expect(dots.length).toBe(1);
        });
        it('should handle empty steps array', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={[]} currentStep={1}/>);
            // Assert
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange & Act
            const { rerender } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Rerender with same props
            rerender(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert - Component should render correctly
            expect(react_1.screen.getByText('Step 1')).toBeInTheDocument();
        });
        it('should update when currentStep changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Assert initial state
            let step1Container = react_1.screen.getByText('Step 1').parentElement;
            expect(step1Container?.className).toContain('text-state-accent-solid');
            // Act - Change step
            rerender(<step_indicator_1.default steps={defaultSteps} currentStep={2}/>);
            // Assert
            step1Container = react_1.screen.getByText('Step 1').parentElement;
            expect(step1Container?.className).toContain('text-text-tertiary');
            const step2Container = react_1.screen.getByText('Step 2').parentElement;
            expect(step2Container?.className).toContain('text-state-accent-solid');
        });
        it('should update when steps array changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={1}/>);
            // Act
            const newSteps = [
                { label: 'New Step 1', value: 'new1' },
                { label: 'New Step 2', value: 'new2' },
            ];
            rerender(<step_indicator_1.default steps={newSteps} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('New Step 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('New Step 2')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Step 3')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle currentStep of 0', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={0}/>);
            // Assert - No step should be highlighted (currentStep - 1 = -1)
            const dots = container.querySelectorAll('.size-1.rounded-full');
            expect(dots.length).toBe(0);
        });
        it('should handle currentStep greater than steps length', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={10}/>);
            // Assert - No step should be highlighted
            const dots = container.querySelectorAll('.size-1.rounded-full');
            expect(dots.length).toBe(0);
        });
        it('should handle steps with empty labels', () => {
            // Arrange
            const stepsWithEmpty = [
                { label: '', value: 'empty' },
                { label: 'Valid', value: 'valid' },
            ];
            // Act
            (0, react_1.render)(<step_indicator_1.default steps={stepsWithEmpty} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('Valid')).toBeInTheDocument();
        });
        it('should handle steps with very long labels', () => {
            // Arrange
            const longLabel = 'A'.repeat(100);
            const stepsWithLong = [{ label: longLabel, value: 'long' }];
            // Act
            (0, react_1.render)(<step_indicator_1.default steps={stepsWithLong} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText(longLabel)).toBeInTheDocument();
        });
        it('should handle special characters in labels', () => {
            // Arrange
            const specialSteps = [{ label: '<Test> & "Label"', value: 'special' }];
            // Act
            (0, react_1.render)(<step_indicator_1.default steps={specialSteps} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('<Test> & "Label"')).toBeInTheDocument();
        });
        it('should handle unicode characters in labels', () => {
            // Arrange
            const unicodeSteps = [{ label: '数据源 🎉', value: 'unicode' }];
            // Act
            (0, react_1.render)(<step_indicator_1.default steps={unicodeSteps} currentStep={1}/>);
            // Assert
            expect(react_1.screen.getByText('数据源 🎉')).toBeInTheDocument();
        });
        it('should handle negative currentStep', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<step_indicator_1.default steps={defaultSteps} currentStep={-1}/>);
            // Assert - No step should be highlighted
            const dots = container.querySelectorAll('.size-1.rounded-full');
            expect(dots.length).toBe(0);
        });
    });
});
// ============================================================================
// FooterTips Component Tests
// ============================================================================
describe('FooterTips', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<footer_tips_1.default />);
            // Assert - Check for translated text
            expect(react_1.screen.getByText('datasetPipeline.testRun.tooltip')).toBeInTheDocument();
        });
        it('should render with correct container classes', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<footer_tips_1.default />);
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper.className).toContain('system-xs-regular');
            expect(wrapper.className).toContain('flex');
            expect(wrapper.className).toContain('grow');
            expect(wrapper.className).toContain('flex-col');
            expect(wrapper.className).toContain('justify-end');
            expect(wrapper.className).toContain('p-4');
            expect(wrapper.className).toContain('pt-2');
            expect(wrapper.className).toContain('text-text-tertiary');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange & Act
            const { rerender } = (0, react_1.render)(<footer_tips_1.default />);
            // Rerender
            rerender(<footer_tips_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.testRun.tooltip')).toBeInTheDocument();
        });
        it('should render consistently across multiple rerenders', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<footer_tips_1.default />);
            // Act - Multiple rerenders
            for (let i = 0; i < 5; i++)
                rerender(<footer_tips_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.testRun.tooltip')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle unmount cleanly', () => {
            // Arrange
            const { unmount } = (0, react_1.render)(<footer_tips_1.default />);
            // Assert
            expect(() => unmount()).not.toThrow();
        });
    });
});
// ============================================================================
// useTestRunSteps Hook Tests
// ============================================================================
describe('useTestRunSteps', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Initial State Tests
    // -------------------------------------------------------------------------
    describe('Initial State', () => {
        it('should initialize with currentStep as 1', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Assert
            expect(result.current.currentStep).toBe(1);
        });
        it('should provide steps array with data source and document processing steps', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Assert
            expect(result.current.steps).toHaveLength(2);
            expect(result.current.steps[0].value).toBe('dataSource');
            expect(result.current.steps[1].value).toBe('documentProcessing');
        });
        it('should provide translated step labels', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Assert
            expect(result.current.steps[0].label).toContain('testRun.steps.dataSource');
            expect(result.current.steps[1].label).toContain('testRun.steps.documentProcessing');
        });
    });
    // -------------------------------------------------------------------------
    // handleNextStep Tests
    // -------------------------------------------------------------------------
    describe('handleNextStep', () => {
        it('should increment currentStep by 1', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Act
            (0, react_1.act)(() => {
                result.current.handleNextStep();
            });
            // Assert
            expect(result.current.currentStep).toBe(2);
        });
        it('should continue incrementing on multiple calls', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Act
            (0, react_1.act)(() => {
                result.current.handleNextStep();
                result.current.handleNextStep();
                result.current.handleNextStep();
            });
            // Assert
            expect(result.current.currentStep).toBe(4);
        });
    });
    // -------------------------------------------------------------------------
    // handleBackStep Tests
    // -------------------------------------------------------------------------
    describe('handleBackStep', () => {
        it('should decrement currentStep by 1', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // First go to step 2
            (0, react_1.act)(() => {
                result.current.handleNextStep();
            });
            expect(result.current.currentStep).toBe(2);
            // Act
            (0, react_1.act)(() => {
                result.current.handleBackStep();
            });
            // Assert
            expect(result.current.currentStep).toBe(1);
        });
        it('should allow going to negative steps (no validation)', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Act
            (0, react_1.act)(() => {
                result.current.handleBackStep();
            });
            // Assert
            expect(result.current.currentStep).toBe(0);
        });
        it('should continue decrementing on multiple calls', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Go to step 5
            (0, react_1.act)(() => {
                for (let i = 0; i < 4; i++)
                    result.current.handleNextStep();
            });
            expect(result.current.currentStep).toBe(5);
            // Act - Go back 3 steps
            (0, react_1.act)(() => {
                result.current.handleBackStep();
                result.current.handleBackStep();
                result.current.handleBackStep();
            });
            // Assert
            expect(result.current.currentStep).toBe(2);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should return stable handleNextStep callback', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            const initialCallback = result.current.handleNextStep;
            // Act
            rerender();
            // Assert
            expect(result.current.handleNextStep).toBe(initialCallback);
        });
        it('should return stable handleBackStep callback', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            const initialCallback = result.current.handleBackStep;
            // Act
            rerender();
            // Assert
            expect(result.current.handleBackStep).toBe(initialCallback);
        });
    });
    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------
    describe('Integration', () => {
        it('should handle forward and backward navigation', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useTestRunSteps)());
            // Act & Assert - Navigate forward
            (0, react_1.act)(() => result.current.handleNextStep());
            expect(result.current.currentStep).toBe(2);
            (0, react_1.act)(() => result.current.handleNextStep());
            expect(result.current.currentStep).toBe(3);
            // Act & Assert - Navigate backward
            (0, react_1.act)(() => result.current.handleBackStep());
            expect(result.current.currentStep).toBe(2);
            (0, react_1.act)(() => result.current.handleBackStep());
            expect(result.current.currentStep).toBe(1);
        });
    });
});
// ============================================================================
// useDatasourceOptions Hook Tests
// ============================================================================
describe('useDatasourceOptions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // Basic Functionality Tests
    // -------------------------------------------------------------------------
    describe('Basic Functionality', () => {
        it('should return empty array when no nodes exist', () => {
            // Arrange
            mockNodes = [];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current).toEqual([]);
        });
        it('should return empty array when no DataSource nodes exist', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'node-1',
                    data: {
                        ...createNodeData(),
                        type: 'llm', // Not a DataSource type
                    },
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current).toEqual([]);
        });
        it('should return options for DataSource nodes only', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'datasource-1',
                    data: {
                        ...createNodeData({ title: 'Local File Source' }),
                        type: 'datasource',
                    },
                },
                {
                    id: 'llm-node',
                    data: {
                        ...createNodeData({ title: 'LLM Node' }),
                        type: 'llm',
                    },
                },
                {
                    id: 'datasource-2',
                    data: {
                        ...createNodeData({ title: 'Online Doc Source' }),
                        type: 'datasource',
                    },
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current).toHaveLength(2);
            expect(result.current[0]).toEqual({
                label: 'Local File Source',
                value: 'datasource-1',
                data: expect.objectContaining({ title: 'Local File Source' }),
            });
            expect(result.current[1]).toEqual({
                label: 'Online Doc Source',
                value: 'datasource-2',
                data: expect.objectContaining({ title: 'Online Doc Source' }),
            });
        });
        it('should map node id to option value', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'unique-node-id-123',
                    data: {
                        ...createNodeData({ title: 'Test Source' }),
                        type: 'datasource',
                    },
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current[0].value).toBe('unique-node-id-123');
        });
        it('should map node title to option label', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'node-1',
                    data: {
                        ...createNodeData({ title: 'Custom Data Source Title' }),
                        type: 'datasource',
                    },
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current[0].label).toBe('Custom Data Source Title');
        });
        it('should include full node data in option', () => {
            // Arrange
            const nodeData = {
                ...createNodeData({
                    title: 'Full Data Test',
                    provider_type: pipeline_1.DatasourceType.websiteCrawl,
                    provider_name: 'Website Crawler',
                }),
                type: 'datasource',
            };
            mockNodes = [
                {
                    id: 'node-1',
                    data: nodeData,
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current[0].data).toEqual(nodeData);
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should return same options reference when nodes do not change', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'node-1',
                    data: {
                        ...createNodeData({ title: 'Test' }),
                        type: 'datasource',
                    },
                },
            ];
            // Act
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            rerender();
            // Assert - Options should be memoized and still work correctly after rerender
            expect(result.current).toHaveLength(1);
            expect(result.current[0].label).toBe('Test');
        });
        it('should update options when nodes change', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'node-1',
                    data: {
                        ...createNodeData({ title: 'First' }),
                        type: 'datasource',
                    },
                },
            ];
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            expect(result.current).toHaveLength(1);
            expect(result.current[0].label).toBe('First');
            // Act - Change nodes
            mockNodes = [
                {
                    id: 'node-2',
                    data: {
                        ...createNodeData({ title: 'Second' }),
                        type: 'datasource',
                    },
                },
                {
                    id: 'node-3',
                    data: {
                        ...createNodeData({ title: 'Third' }),
                        type: 'datasource',
                    },
                },
            ];
            rerender();
            // Assert
            expect(result.current).toHaveLength(2);
            expect(result.current[0].label).toBe('Second');
            expect(result.current[1].label).toBe('Third');
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle nodes with empty title', () => {
            // Arrange
            mockNodes = [
                {
                    id: 'node-1',
                    data: {
                        ...createNodeData({ title: '' }),
                        type: 'datasource',
                    },
                },
            ];
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current[0].label).toBe('');
        });
        it('should handle multiple DataSource nodes', () => {
            // Arrange
            mockNodes = Array.from({ length: 10 }, (_, i) => ({
                id: `node-${i}`,
                data: {
                    ...createNodeData({ title: `Source ${i}` }),
                    type: 'datasource',
                },
            }));
            // Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDatasourceOptions)());
            // Assert
            expect(result.current).toHaveLength(10);
            result.current.forEach((option, i) => {
                expect(option.value).toBe(`node-${i}`);
                expect(option.label).toBe(`Source ${i}`);
            });
        });
    });
});
// ============================================================================
// useOnlineDocument Hook Tests
// ============================================================================
describe('useOnlineDocument', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // clearOnlineDocumentData Tests
    // -------------------------------------------------------------------------
    describe('clearOnlineDocumentData', () => {
        it('should clear all online document related data', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDocument)());
            // Act
            (0, react_1.act)(() => {
                result.current.clearOnlineDocumentData();
            });
            // Assert
            expect(mockDataSourceStoreState.setDocumentsData).toHaveBeenCalledWith([]);
            expect(mockDataSourceStoreState.setSearchValue).toHaveBeenCalledWith('');
            expect(mockDataSourceStoreState.setSelectedPagesId).toHaveBeenCalledWith(new Set());
            expect(mockDataSourceStoreState.setOnlineDocuments).toHaveBeenCalledWith([]);
            expect(mockDataSourceStoreState.setCurrentDocument).toHaveBeenCalledWith(undefined);
        });
        it('should call all clear functions in correct order', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDocument)());
            const callOrder = [];
            mockDataSourceStoreState.setDocumentsData = vi.fn(() => callOrder.push('setDocumentsData'));
            mockDataSourceStoreState.setSearchValue = vi.fn(() => callOrder.push('setSearchValue'));
            mockDataSourceStoreState.setSelectedPagesId = vi.fn(() => callOrder.push('setSelectedPagesId'));
            mockDataSourceStoreState.setOnlineDocuments = vi.fn(() => callOrder.push('setOnlineDocuments'));
            mockDataSourceStoreState.setCurrentDocument = vi.fn(() => callOrder.push('setCurrentDocument'));
            // Act
            (0, react_1.act)(() => {
                result.current.clearOnlineDocumentData();
            });
            // Assert
            expect(callOrder).toEqual([
                'setDocumentsData',
                'setSearchValue',
                'setSelectedPagesId',
                'setOnlineDocuments',
                'setCurrentDocument',
            ]);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain functional callback after rerender', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDocument)());
            // Act - First call
            (0, react_1.act)(() => {
                result.current.clearOnlineDocumentData();
            });
            const firstCallCount = mockDataSourceStoreState.setDocumentsData.mock.calls.length;
            // Rerender
            rerender();
            // Act - Second call after rerender
            (0, react_1.act)(() => {
                result.current.clearOnlineDocumentData();
            });
            // Assert - Callback should still work after rerender
            expect(mockDataSourceStoreState.setDocumentsData.mock.calls.length).toBe(firstCallCount + 1);
        });
    });
});
// ============================================================================
// useWebsiteCrawl Hook Tests
// ============================================================================
describe('useWebsiteCrawl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // clearWebsiteCrawlData Tests
    // -------------------------------------------------------------------------
    describe('clearWebsiteCrawlData', () => {
        it('should clear all website crawl related data', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useWebsiteCrawl)());
            // Act
            (0, react_1.act)(() => {
                result.current.clearWebsiteCrawlData();
            });
            // Assert
            expect(mockDataSourceStoreState.setStep).toHaveBeenCalledWith('init');
            expect(mockDataSourceStoreState.setCrawlResult).toHaveBeenCalledWith(undefined);
            expect(mockDataSourceStoreState.setCurrentWebsite).toHaveBeenCalledWith(undefined);
            expect(mockDataSourceStoreState.setWebsitePages).toHaveBeenCalledWith([]);
            expect(mockDataSourceStoreState.setPreviewIndex).toHaveBeenCalledWith(-1);
        });
        it('should call all clear functions in correct order', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useWebsiteCrawl)());
            const callOrder = [];
            mockDataSourceStoreState.setStep = vi.fn(() => callOrder.push('setStep'));
            mockDataSourceStoreState.setCrawlResult = vi.fn(() => callOrder.push('setCrawlResult'));
            mockDataSourceStoreState.setCurrentWebsite = vi.fn(() => callOrder.push('setCurrentWebsite'));
            mockDataSourceStoreState.setWebsitePages = vi.fn(() => callOrder.push('setWebsitePages'));
            mockDataSourceStoreState.setPreviewIndex = vi.fn(() => callOrder.push('setPreviewIndex'));
            // Act
            (0, react_1.act)(() => {
                result.current.clearWebsiteCrawlData();
            });
            // Assert
            expect(callOrder).toEqual([
                'setStep',
                'setCrawlResult',
                'setCurrentWebsite',
                'setWebsitePages',
                'setPreviewIndex',
            ]);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain functional callback after rerender', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useWebsiteCrawl)());
            // Act - First call
            (0, react_1.act)(() => {
                result.current.clearWebsiteCrawlData();
            });
            const firstCallCount = mockDataSourceStoreState.setStep.mock.calls.length;
            // Rerender
            rerender();
            // Act - Second call after rerender
            (0, react_1.act)(() => {
                result.current.clearWebsiteCrawlData();
            });
            // Assert - Callback should still work after rerender
            expect(mockDataSourceStoreState.setStep.mock.calls.length).toBe(firstCallCount + 1);
        });
    });
});
// ============================================================================
// useOnlineDrive Hook Tests
// ============================================================================
describe('useOnlineDrive', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // clearOnlineDriveData Tests
    // -------------------------------------------------------------------------
    describe('clearOnlineDriveData', () => {
        it('should clear all online drive related data', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDrive)());
            // Act
            (0, react_1.act)(() => {
                result.current.clearOnlineDriveData();
            });
            // Assert
            expect(mockDataSourceStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
            expect(mockDataSourceStoreState.setBucket).toHaveBeenCalledWith('');
            expect(mockDataSourceStoreState.setPrefix).toHaveBeenCalledWith([]);
            expect(mockDataSourceStoreState.setKeywords).toHaveBeenCalledWith('');
            expect(mockDataSourceStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
        });
        it('should call all clear functions in correct order', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDrive)());
            const callOrder = [];
            mockDataSourceStoreState.setOnlineDriveFileList = vi.fn(() => callOrder.push('setOnlineDriveFileList'));
            mockDataSourceStoreState.setBucket = vi.fn(() => callOrder.push('setBucket'));
            mockDataSourceStoreState.setPrefix = vi.fn(() => callOrder.push('setPrefix'));
            mockDataSourceStoreState.setKeywords = vi.fn(() => callOrder.push('setKeywords'));
            mockDataSourceStoreState.setSelectedFileIds = vi.fn(() => callOrder.push('setSelectedFileIds'));
            // Act
            (0, react_1.act)(() => {
                result.current.clearOnlineDriveData();
            });
            // Assert
            expect(callOrder).toEqual([
                'setOnlineDriveFileList',
                'setBucket',
                'setPrefix',
                'setKeywords',
                'setSelectedFileIds',
            ]);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain functional callback after rerender', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useOnlineDrive)());
            // Act - First call
            (0, react_1.act)(() => {
                result.current.clearOnlineDriveData();
            });
            const firstCallCount = mockDataSourceStoreState.setOnlineDriveFileList.mock.calls.length;
            // Rerender
            rerender();
            // Act - Second call after rerender
            (0, react_1.act)(() => {
                result.current.clearOnlineDriveData();
            });
            // Assert - Callback should still work after rerender
            expect(mockDataSourceStoreState.setOnlineDriveFileList.mock.calls.length).toBe(firstCallCount + 1);
        });
    });
});
// ============================================================================
// Preparation Component Tests
// ============================================================================
describe('Preparation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
        it('should render StepIndicator', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert - Check for step text
            expect(react_1.screen.getByText('datasetPipeline.testRun.steps.dataSource')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.testRun.steps.documentProcessing')).toBeInTheDocument();
        });
        it('should render DataSourceOptions on step 1', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
        it('should render Actions on step 1', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.button')).toBeInTheDocument();
        });
        it('should render FooterTips on step 1', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.testRun.tooltip')).toBeInTheDocument();
        });
        it('should not render DocumentProcessing on step 1', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.queryByTestId('document-processing')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Data Source Selection Tests
    // -------------------------------------------------------------------------
    describe('Data Source Selection', () => {
        it('should render LocalFile component when local file datasource is selected', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(react_1.screen.getByTestId('local-file')).toBeInTheDocument();
        });
        it('should render OnlineDocuments component when online document datasource is selected', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(react_1.screen.getByTestId('online-documents')).toBeInTheDocument();
        });
        it('should render WebsiteCrawl component when website crawl datasource is selected', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert
            expect(react_1.screen.getByTestId('website-crawl')).toBeInTheDocument();
        });
        it('should render OnlineDrive component when online drive datasource is selected', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Assert
            expect(react_1.screen.getByTestId('online-drive')).toBeInTheDocument();
        });
        it('should pass correct props to LocalFile component', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            const localFile = react_1.screen.getByTestId('local-file');
            expect(localFile).toHaveAttribute('data-extensions', '["txt","pdf"]');
            expect(localFile).toHaveAttribute('data-batch', 'false');
        });
        it('should pass isInPipeline=true to OnlineDocuments', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            const onlineDocs = react_1.screen.getByTestId('online-documents');
            expect(onlineDocs).toHaveAttribute('data-in-pipeline', 'true');
        });
        it('should pass supportBatchUpload=false to all data source components', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Select online document
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(react_1.screen.getByTestId('online-documents')).toHaveAttribute('data-batch', 'false');
        });
        it('should update dataSourceNodeId when selecting different datasources', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toHaveAttribute('data-selected', 'local-file-node');
            // Act - Select another
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toHaveAttribute('data-selected', 'online-doc-node');
        });
    });
    // -------------------------------------------------------------------------
    // Next Button Disabled State Tests
    // -------------------------------------------------------------------------
    describe('Next Button Disabled State', () => {
        it('should disable next button when no datasource is selected', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should disable next button for local file when file list is empty', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should disable next button for local file when file has no id', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: '', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should enable next button for local file when file has valid id', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should disable next button for online document when documents list is empty', () => {
            // Arrange
            mockDataSourceStoreState.onlineDocuments = [];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should enable next button for online document when documents exist', () => {
            // Arrange
            mockDataSourceStoreState.onlineDocuments = [{ workspace_id: 'ws-1', page_id: 'page-1' }];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should disable next button for website crawl when pages list is empty', () => {
            // Arrange
            mockDataSourceStoreState.websitePages = [];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should enable next button for website crawl when pages exist', () => {
            // Arrange
            mockDataSourceStoreState.websitePages = [{ url: 'https://example.com' }];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should disable next button for online drive when no files selected', () => {
            // Arrange
            mockDataSourceStoreState.selectedFileIds = [];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should enable next button for online drive when files are selected', () => {
            // Arrange
            mockDataSourceStoreState.selectedFileIds = ['file-1'];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
    });
    // -------------------------------------------------------------------------
    // Step Navigation Tests
    // -------------------------------------------------------------------------
    describe('Step Navigation', () => {
        it('should navigate to step 2 when next button is clicked with valid data', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act - Select datasource and click next
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(react_1.screen.getByTestId('document-processing')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('data-source-options')).not.toBeInTheDocument();
        });
        it('should pass correct dataSourceNodeId to DocumentProcessing', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(react_1.screen.getByTestId('document-processing')).toHaveAttribute('data-node-id', 'local-file-node');
        });
        it('should navigate back to step 1 when back button is clicked', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act - Go to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            expect(react_1.screen.getByTestId('document-processing')).toBeInTheDocument();
            // Act - Go back
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('document-processing')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // handleProcess Tests
    // -------------------------------------------------------------------------
    describe('handleProcess', () => {
        it('should call handleRun with correct params for local file', async () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    inputs: { field1: 'value1' },
                    start_node_id: 'local-file-node',
                    datasource_type: pipeline_1.DatasourceType.localFile,
                }));
            });
        });
        it('should call handleRun with correct params for online document', async () => {
            // Arrange
            mockDataSourceStoreState.onlineDocuments = [{ workspace_id: 'ws-1', page_id: 'page-1', title: 'Test Doc' }];
            mockDataSourceStoreState.currentCredentialId = 'cred-123';
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    inputs: { field1: 'value1' },
                    start_node_id: 'online-doc-node',
                    datasource_type: pipeline_1.DatasourceType.onlineDocument,
                }));
            });
        });
        it('should call handleRun with correct params for website crawl', async () => {
            // Arrange
            mockDataSourceStoreState.websitePages = [{ url: 'https://example.com', title: 'Example' }];
            mockDataSourceStoreState.currentCredentialId = 'cred-456';
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    inputs: { field1: 'value1' },
                    start_node_id: 'website-crawl-node',
                    datasource_type: pipeline_1.DatasourceType.websiteCrawl,
                }));
            });
        });
        it('should call handleRun with correct params for online drive', async () => {
            // Arrange
            mockDataSourceStoreState.selectedFileIds = ['file-1'];
            mockDataSourceStoreState.onlineDriveFileList = [{ id: 'file-1', name: 'data.csv', type: 'file' }];
            mockDataSourceStoreState.bucket = 'my-bucket';
            mockDataSourceStoreState.currentCredentialId = 'cred-789';
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    inputs: { field1: 'value1' },
                    start_node_id: 'online-drive-node',
                    datasource_type: pipeline_1.DatasourceType.onlineDrive,
                }));
            });
        });
        it('should call setIsPreparingDataSource(false) after processing', async () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockWorkflowStoreState.setIsPreparingDataSource).toHaveBeenCalledWith(false);
            });
        });
    });
    // -------------------------------------------------------------------------
    // clearDataSourceData Tests
    // -------------------------------------------------------------------------
    describe('clearDataSourceData', () => {
        it('should clear online document data when switching from online document', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Select online document first
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Then switch to local file
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(mockDataSourceStoreState.setDocumentsData).toHaveBeenCalled();
            expect(mockDataSourceStoreState.setOnlineDocuments).toHaveBeenCalled();
        });
        it('should clear website crawl data when switching from website crawl', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Select website crawl first
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Then switch to local file
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(mockDataSourceStoreState.setWebsitePages).toHaveBeenCalled();
            expect(mockDataSourceStoreState.setCrawlResult).toHaveBeenCalled();
        });
        it('should clear online drive data when switching from online drive', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Select online drive first
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Then switch to local file
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(mockDataSourceStoreState.setOnlineDriveFileList).toHaveBeenCalled();
            expect(mockDataSourceStoreState.setBucket).toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // handleCredentialChange Tests
    // -------------------------------------------------------------------------
    describe('handleCredentialChange', () => {
        it('should update credential and clear data when credential changes for online document', () => {
            // Arrange
            mockDataSourceStoreState.onlineDocuments = [{ workspace_id: 'ws-1' }];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            react_1.fireEvent.click(react_1.screen.getByText('Change Credential'));
            // Assert
            expect(mockDataSourceStoreState.setCurrentCredentialId).toHaveBeenCalledWith('new-credential-id');
        });
        it('should clear data when credential changes for website crawl', () => {
            // Arrange
            mockDataSourceStoreState.websitePages = [{ url: 'https://example.com' }];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            react_1.fireEvent.click(react_1.screen.getByText('Change Credential'));
            // Assert
            expect(mockDataSourceStoreState.setCurrentCredentialId).toHaveBeenCalledWith('new-credential-id');
            expect(mockDataSourceStoreState.setWebsitePages).toHaveBeenCalled();
        });
        it('should clear data when credential changes for online drive', () => {
            // Arrange
            mockDataSourceStoreState.selectedFileIds = ['file-1'];
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            react_1.fireEvent.click(react_1.screen.getByText('Change Credential'));
            // Assert
            expect(mockDataSourceStoreState.setCurrentCredentialId).toHaveBeenCalledWith('new-credential-id');
            expect(mockDataSourceStoreState.setOnlineDriveFileList).toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // handleSwitchDataSource Tests
    // -------------------------------------------------------------------------
    describe('handleSwitchDataSource', () => {
        it('should clear credential when switching datasource', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(mockDataSourceStoreState.setCurrentCredentialId).toHaveBeenCalledWith('');
        });
        it('should update currentNodeIdRef when switching datasource', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert
            expect(mockDataSourceStoreState.currentNodeIdRef.current).toBe('local-file-node');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange & Act
            const { rerender } = (0, react_1.render)(<index_1.default />);
            rerender(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
        it('should maintain state across rerenders', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Act - Select datasource and go to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Rerender
            rerender(<index_1.default />);
            // Assert - Should still be on step 2
            expect(react_1.screen.getByTestId('document-processing')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle unmount cleanly', () => {
            // Arrange
            const { unmount } = (0, react_1.render)(<index_1.default />);
            // Assert
            expect(() => unmount()).not.toThrow();
        });
        it('should enable next button for unknown datasource type (return false branch)', () => {
            // Arrange - This tests line 67: return false for unknown datasource types
            (0, react_1.render)(<index_1.default />);
            // Act - Select unknown type datasource
            react_1.fireEvent.click(react_1.screen.getByTestId('select-unknown-type'));
            // Assert - Button should NOT be disabled because unknown type returns false (not disabled)
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should handle handleProcess with unknown datasource type', async () => {
            // Arrange - This tests processing with unknown type, triggering default branch
            (0, react_1.render)(<index_1.default />);
            // Act - Select unknown type and go to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('select-unknown-type'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Process with unknown type
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert - handleRun should be called with empty datasource_info_list (no type matched)
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    start_node_id: 'unknown-type-node',
                    datasource_type: 'unknown_type',
                    datasource_info_list: [], // Empty because no type matched
                }));
            });
        });
        it('should handle rapid datasource switching', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Rapidly switch between datasources
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert - Should end up with local file selected
            expect(react_1.screen.getByTestId('local-file')).toBeInTheDocument();
        });
        it('should handle rapid step navigation', () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act - Select and navigate
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            // Assert - Should be back on step 1
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------
    describe('Integration', () => {
        it('should complete full flow: select datasource -> next -> process', async () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act - Step 1: Select datasource
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            expect(react_1.screen.getByTestId('local-file')).toBeInTheDocument();
            // Act - Step 1: Click next
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            expect(react_1.screen.getByTestId('document-processing')).toBeInTheDocument();
            // Act - Step 2: Process
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalled();
            });
        });
        it('should complete full flow with back navigation', async () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            mockDataSourceStoreState.onlineDocuments = [{ workspace_id: 'ws-1' }];
            (0, react_1.render)(<index_1.default />);
            // Act - Select local file and go to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            expect(react_1.screen.getByTestId('document-processing')).toBeInTheDocument();
            // Act - Go back and switch to online document
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            expect(react_1.screen.getByTestId('online-documents')).toBeInTheDocument();
            // Act - Go to step 2 again
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert - Should be on step 2 with online document
            expect(react_1.screen.getByTestId('document-processing')).toHaveAttribute('data-node-id', 'online-doc-node');
        });
    });
});
// ============================================================================
// Callback Dependencies Tests
// ============================================================================
describe('Callback Dependencies', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // nextBtnDisabled useMemo Dependencies
    // -------------------------------------------------------------------------
    describe('nextBtnDisabled Memoization', () => {
        it('should update when localFileList changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert - Initially disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
            // Act - Update localFileList
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'file-123', name: 'test.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            rerender(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            // Assert - Now enabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should update when onlineDocuments changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert - Initially disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
            // Act - Update onlineDocuments
            mockDataSourceStoreState.onlineDocuments = [{ workspace_id: 'ws-1' }];
            rerender(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert - Now enabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should update when websitePages changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert - Initially disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
            // Act - Update websitePages
            mockDataSourceStoreState.websitePages = [{ url: 'https://example.com' }];
            rerender(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert - Now enabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should update when selectedFileIds changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Assert - Initially disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
            // Act - Update selectedFileIds
            mockDataSourceStoreState.selectedFileIds = ['file-1'];
            rerender(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-drive'));
            // Assert - Now enabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
    });
    // -------------------------------------------------------------------------
    // handleProcess useCallback Dependencies
    // -------------------------------------------------------------------------
    describe('handleProcess Callback Dependencies', () => {
        it('should use latest store state when processing', async () => {
            // Arrange
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'initial-file', name: 'initial.txt', type: 'text/plain', size: 100, extension: 'txt', mime_type: 'text/plain' } },
            ];
            (0, react_1.render)(<index_1.default />);
            // Act - Select and navigate
            react_1.fireEvent.click(react_1.screen.getByTestId('select-local-file'));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Update store before processing
            mockDataSourceStoreState.localFileList = [
                { file: { id: 'updated-file', name: 'updated.txt', type: 'text/plain', size: 200, extension: 'txt', mime_type: 'text/plain' } },
            ];
            react_1.fireEvent.click(react_1.screen.getByTestId('process-btn'));
            // Assert - Should use latest file
            await (0, react_1.waitFor)(() => {
                expect(mockHandleRun).toHaveBeenCalledWith(expect.objectContaining({
                    datasource_info_list: expect.arrayContaining([
                        expect.objectContaining({ related_id: 'updated-file' }),
                    ]),
                }));
            });
        });
    });
    // -------------------------------------------------------------------------
    // clearDataSourceData useCallback Dependencies
    // -------------------------------------------------------------------------
    describe('clearDataSourceData Callback Dependencies', () => {
        it('should call correct clear function based on datasource type', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Select online document
            react_1.fireEvent.click(react_1.screen.getByTestId('select-online-document'));
            // Assert
            expect(mockDataSourceStoreState.setOnlineDocuments).toHaveBeenCalled();
            // Act - Switch to website crawl
            react_1.fireEvent.click(react_1.screen.getByTestId('select-website-crawl'));
            // Assert
            expect(mockDataSourceStoreState.setWebsitePages).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTRGO0FBQzVGLCtCQUE4QjtBQUM5QixnREFBa0Q7QUFDbEQsK0NBQXNDO0FBQ3RDLG1DQU1nQjtBQUNoQixtQ0FBaUM7QUFDakMscURBQTRDO0FBRTVDLCtFQUErRTtBQUMvRSwrREFBK0Q7QUFDL0QsK0VBQStFO0FBRS9FLHdFQUF3RTtBQUN4RSxJQUFJLFNBQVMsR0FBb0QsRUFBRSxDQUFBO0FBRW5FLG1FQUFtRTtBQUNuRSxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQXVDLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLEtBQUssRUFBRSxXQUFXO0lBQ2xCLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsYUFBYSxFQUFFLHlCQUFjLENBQUMsU0FBUztJQUN2QyxhQUFhLEVBQUUsWUFBWTtJQUMzQixlQUFlLEVBQUUsWUFBWTtJQUM3QixnQkFBZ0IsRUFBRSxZQUFZO0lBQzlCLFNBQVMsRUFBRSxhQUFhO0lBQ3hCLHFCQUFxQixFQUFFLEVBQUU7SUFDekIseUJBQXlCLEVBQUUsRUFBRTtJQUM3QixHQUFHLFNBQVM7Q0FDcUIsQ0FBQSxDQUFBO0FBRW5DLCtFQUErRTtBQUMvRSw2QkFBNkI7QUFDN0IsK0VBQStFO0FBRS9FLHFCQUFxQjtBQUNyQixFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDNUMsTUFBTSxFQUFFLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZ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TSxDQUFDLGVBQWUsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxDQUFDO3FCQUN4RCxDQUFDO2lCQUNILENBQUMsQ0FBQyxDQUFBO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNEVBQTRFO0lBQzVFLCtDQUErQztJQUMvQyw0RUFBNEU7SUFDNUUsUUFBUSxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsRUFBRTtRQUN6RCxFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLFVBQVU7WUFDVixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVcsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXZCLCtCQUErQjtZQUMvQixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtZQUU3RCxTQUFTO1lBQ1QsTUFBTSxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUV0RSxnQ0FBZ0M7WUFDaEMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7WUFFM0QsU0FBUztZQUNULE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3JFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGF0YXNvdXJjZSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgcmVuZGVySG9vaywgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRGF0YXNvdXJjZVR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBGb290ZXJUaXBzIGZyb20gJy4vZm9vdGVyLXRpcHMnXG5pbXBvcnQge1xuICB1c2VEYXRhc291cmNlT3B0aW9ucyxcbiAgdXNlT25saW5lRG9jdW1lbnQsXG4gIHVzZU9ubGluZURyaXZlLFxuICB1c2VUZXN0UnVuU3RlcHMsXG4gIHVzZVdlYnNpdGVDcmF3bCxcbn0gZnJvbSAnLi9ob29rcydcbmltcG9ydCBQcmVwYXJhdGlvbiBmcm9tICcuL2luZGV4J1xuaW1wb3J0IFN0ZXBJbmRpY2F0b3IgZnJvbSAnLi9zdGVwLWluZGljYXRvcidcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUHJlLWRlY2xhcmUgdmFyaWFibGVzIGFuZCBmdW5jdGlvbnMgdXNlZCBpbiBtb2NrcyAoaG9pc3RpbmcpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgTm9kZXMgZm9yIHVzZURhdGFzb3VyY2VPcHRpb25zIC0gbXVzdCBiZSBkZWNsYXJlZCBiZWZvcmUgdmkubW9ja1xubGV0IG1vY2tOb2RlczogQXJyYXk8eyBpZDogc3RyaW5nLCBkYXRhOiBEYXRhU291cmNlTm9kZVR5cGUgfT4gPSBbXVxuXG4vLyBUZXN0IERhdGEgRmFjdG9yeSAtIG11c3QgYmUgZGVjbGFyZWQgYmVmb3JlIHZpLm1vY2sgdGhhdCB1c2VzIGl0XG5jb25zdCBjcmVhdGVOb2RlRGF0YSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPERhdGFTb3VyY2VOb2RlVHlwZT4pOiBEYXRhU291cmNlTm9kZVR5cGUgPT4gKHtcbiAgdGl0bGU6ICdUZXN0IE5vZGUnLFxuICBkZXNjOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIHR5cGU6ICdkYXRhLXNvdXJjZScsXG4gIHByb3ZpZGVyX3R5cGU6IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSxcbiAgcHJvdmlkZXJfbmFtZTogJ0xvY2FsIEZpbGUnLFxuICBkYXRhc291cmNlX25hbWU6ICdsb2NhbF9maWxlJyxcbiAgZGF0YXNvdXJjZV9sYWJlbDogJ0xvY2FsIEZpbGUnLFxuICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbicsXG4gIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge30sXG4gIGRhdGFzb3VyY2VfY29uZmlndXJhdGlvbnM6IHt9LFxuICAuLi5vdmVycmlkZXMsXG59IGFzIHVua25vd24gYXMgRGF0YVNvdXJjZU5vZGVUeXBlKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHJlYWN0LWkxOG5leHRcbnZpLm1vY2soJ3JlYWN0LWkxOG5leHQnLCAoKSA9PiAoe1xuICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nIH0pID0+IHtcbiAgICAgIGNvbnN0IG5zID0gb3B0aW9ucz8ubnMgPyBgJHtvcHRpb25zLm5zfS5gIDogJydcbiAgICAgIHJldHVybiBgJHtuc30ke2tleX1gXG4gICAgfSxcbiAgfSksXG59KSlcblxuLy8gTW9jayByZWFjdGZsb3dcbnZpLm1vY2soJ3JlYWN0ZmxvdycsICgpID0+ICh7XG4gIHVzZU5vZGVzOiAoKSA9PiBtb2NrTm9kZXMsXG59KSlcblxuLy8gTW9jayB6dXN0YW5kL3JlYWN0L3NoYWxsb3dcbnZpLm1vY2soJ3p1c3RhbmQvcmVhY3Qvc2hhbGxvdycsICgpID0+ICh7XG4gIHVzZVNoYWxsb3c6IDxULD4oZm46IChzdGF0ZTogdW5rbm93bikgPT4gVCkgPT4gZm4sXG59KSlcblxuLy8gTW9jayBhbXBsaXR1ZGUgdHJhY2tpbmdcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnLCAoKSA9PiAoe1xuICB0cmFja0V2ZW50OiB2aS5mbigpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRGF0YSBTb3VyY2UgU3RvcmVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxubGV0IG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZSA9IHtcbiAgbG9jYWxGaWxlTGlzdDogW10gYXMgQXJyYXk8eyBmaWxlOiB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCBzaXplOiBudW1iZXIsIGV4dGVuc2lvbjogc3RyaW5nLCBtaW1lX3R5cGU6IHN0cmluZyB9IH0+LFxuICBvbmxpbmVEb2N1bWVudHM6IFtdIGFzIEFycmF5PHsgd29ya3NwYWNlX2lkOiBzdHJpbmcsIHBhZ2VfaWQ/OiBzdHJpbmcsIHRpdGxlPzogc3RyaW5nIH0+LFxuICB3ZWJzaXRlUGFnZXM6IFtdIGFzIEFycmF5PHsgdXJsPzogc3RyaW5nLCB0aXRsZT86IHN0cmluZyB9PixcbiAgc2VsZWN0ZWRGaWxlSWRzOiBbXSBhcyBzdHJpbmdbXSxcbiAgY3VycmVudENyZWRlbnRpYWxJZDogJycsXG4gIGN1cnJlbnROb2RlSWRSZWY6IHsgY3VycmVudDogJycgfSxcbiAgYnVja2V0OiAnJyxcbiAgb25saW5lRHJpdmVGaWxlTGlzdDogW10gYXMgQXJyYXk8eyBpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZyB9PixcbiAgc2V0Q3VycmVudENyZWRlbnRpYWxJZDogdmkuZm4oKSxcbiAgc2V0RG9jdW1lbnRzRGF0YTogdmkuZm4oKSxcbiAgc2V0U2VhcmNoVmFsdWU6IHZpLmZuKCksXG4gIHNldFNlbGVjdGVkUGFnZXNJZDogdmkuZm4oKSxcbiAgc2V0T25saW5lRG9jdW1lbnRzOiB2aS5mbigpLFxuICBzZXRDdXJyZW50RG9jdW1lbnQ6IHZpLmZuKCksXG4gIHNldFN0ZXA6IHZpLmZuKCksXG4gIHNldENyYXdsUmVzdWx0OiB2aS5mbigpLFxuICBzZXRXZWJzaXRlUGFnZXM6IHZpLmZuKCksXG4gIHNldFByZXZpZXdJbmRleDogdmkuZm4oKSxcbiAgc2V0Q3VycmVudFdlYnNpdGU6IHZpLmZuKCksXG4gIHNldE9ubGluZURyaXZlRmlsZUxpc3Q6IHZpLmZuKCksXG4gIHNldEJ1Y2tldDogdmkuZm4oKSxcbiAgc2V0UHJlZml4OiB2aS5mbigpLFxuICBzZXRLZXl3b3JkczogdmkuZm4oKSxcbiAgc2V0U2VsZWN0ZWRGaWxlSWRzOiB2aS5mbigpLFxufVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9zdG9yZScsICgpID0+ICh7XG4gIHVzZURhdGFTb3VyY2VTdG9yZTogKCkgPT4gKHtcbiAgICBnZXRTdGF0ZTogKCkgPT4gbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLFxuICB9KSxcbiAgdXNlRGF0YVNvdXJjZVN0b3JlV2l0aFNlbGVjdG9yOiA8VCw+KHNlbGVjdG9yOiAoc3RhdGU6IHR5cGVvZiBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUpID0+IFQpID0+IHNlbGVjdG9yKG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZSksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBXb3JrZmxvdyBTdG9yZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5sZXQgbW9ja1dvcmtmbG93U3RvcmVTdGF0ZSA9IHtcbiAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlOiB2aS5mbigpLFxuICBwaXBlbGluZUlkOiAndGVzdC1waXBlbGluZS1pZCcsXG59XG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VXb3JrZmxvd1N0b3JlOiAoKSA9PiAoe1xuICAgIGdldFN0YXRlOiAoKSA9PiBtb2NrV29ya2Zsb3dTdG9yZVN0YXRlLFxuICB9KSxcbiAgdXNlU3RvcmU6IDxULD4oc2VsZWN0b3I6IChzdGF0ZTogdHlwZW9mIG1vY2tXb3JrZmxvd1N0b3JlU3RhdGUpID0+IFQpID0+IHNlbGVjdG9yKG1vY2tXb3JrZmxvd1N0b3JlU3RhdGUpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgV29ya2Zsb3cgSG9va3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbW9ja0hhbmRsZVJ1biA9IHZpLmZuKClcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcycsICgpID0+ICh7XG4gIHVzZVdvcmtmbG93UnVuOiAoKSA9PiAoe1xuICAgIGhhbmRsZVJ1bjogbW9ja0hhbmRsZVJ1bixcbiAgfSksXG4gIHVzZVRvb2xJY29uOiAoKSA9PiAoeyB0eXBlOiAnaWNvbicsIGljb246ICd0ZXN0LWljb24nIH0pLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgQ2hpbGQgQ29tcG9uZW50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9sb2NhbC1maWxlJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgYWxsb3dlZEV4dGVuc2lvbnMsIHN1cHBvcnRCYXRjaFVwbG9hZCB9OiB7IGFsbG93ZWRFeHRlbnNpb25zOiBzdHJpbmdbXSwgc3VwcG9ydEJhdGNoVXBsb2FkOiBib29sZWFuIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibG9jYWwtZmlsZVwiIGRhdGEtZXh0ZW5zaW9ucz17SlNPTi5zdHJpbmdpZnkoYWxsb3dlZEV4dGVuc2lvbnMpfSBkYXRhLWJhdGNoPXtzdXBwb3J0QmF0Y2hVcGxvYWR9PlxuICAgICAgTG9jYWxGaWxlIENvbXBvbmVudFxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnR5cGUgTW9ja0RhdGFTb3VyY2VDb21wb25lbnRQcm9wcyA9IHtcbiAgbm9kZUlkOiBzdHJpbmdcbiAgbm9kZURhdGE/OiBEYXRhU291cmNlTm9kZVR5cGVcbiAgaXNJblBpcGVsaW5lPzogYm9vbGVhblxuICBzdXBwb3J0QmF0Y2hVcGxvYWQ/OiBib29sZWFuXG4gIG9uQ3JlZGVudGlhbENoYW5nZT86IChjcmVkZW50aWFsSWQ6IHN0cmluZykgPT4gdm9pZFxufVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9vbmxpbmUtZG9jdW1lbnRzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgbm9kZUlkLCBpc0luUGlwZWxpbmUsIHN1cHBvcnRCYXRjaFVwbG9hZCwgb25DcmVkZW50aWFsQ2hhbmdlIH06IE1vY2tEYXRhU291cmNlQ29tcG9uZW50UHJvcHMpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwib25saW5lLWRvY3VtZW50c1wiIGRhdGEtbm9kZS1pZD17bm9kZUlkfSBkYXRhLWluLXBpcGVsaW5lPXtpc0luUGlwZWxpbmV9IGRhdGEtYmF0Y2g9e3N1cHBvcnRCYXRjaFVwbG9hZH0+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uQ3JlZGVudGlhbENoYW5nZT8uKCduZXctY3JlZGVudGlhbC1pZCcpfT5DaGFuZ2UgQ3JlZGVudGlhbDwvYnV0dG9uPlxuICAgICAgT25saW5lRG9jdW1lbnRzIENvbXBvbmVudFxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvZG9jdW1lbnRzL2NyZWF0ZS1mcm9tLXBpcGVsaW5lL2RhdGEtc291cmNlL3dlYnNpdGUtY3Jhd2wnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBub2RlSWQsIGlzSW5QaXBlbGluZSwgc3VwcG9ydEJhdGNoVXBsb2FkLCBvbkNyZWRlbnRpYWxDaGFuZ2UgfTogTW9ja0RhdGFTb3VyY2VDb21wb25lbnRQcm9wcykgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ3ZWJzaXRlLWNyYXdsXCIgZGF0YS1ub2RlLWlkPXtub2RlSWR9IGRhdGEtaW4tcGlwZWxpbmU9e2lzSW5QaXBlbGluZX0gZGF0YS1iYXRjaD17c3VwcG9ydEJhdGNoVXBsb2FkfT5cbiAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gb25DcmVkZW50aWFsQ2hhbmdlPy4oJ25ldy1jcmVkZW50aWFsLWlkJyl9PkNoYW5nZSBDcmVkZW50aWFsPC9idXR0b24+XG4gICAgICBXZWJzaXRlQ3Jhd2wgQ29tcG9uZW50XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvY3JlYXRlLWZyb20tcGlwZWxpbmUvZGF0YS1zb3VyY2Uvb25saW5lLWRyaXZlJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgbm9kZUlkLCBpc0luUGlwZWxpbmUsIHN1cHBvcnRCYXRjaFVwbG9hZCwgb25DcmVkZW50aWFsQ2hhbmdlIH06IE1vY2tEYXRhU291cmNlQ29tcG9uZW50UHJvcHMpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwib25saW5lLWRyaXZlXCIgZGF0YS1ub2RlLWlkPXtub2RlSWR9IGRhdGEtaW4tcGlwZWxpbmU9e2lzSW5QaXBlbGluZX0gZGF0YS1iYXRjaD17c3VwcG9ydEJhdGNoVXBsb2FkfT5cbiAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gb25DcmVkZW50aWFsQ2hhbmdlPy4oJ25ldy1jcmVkZW50aWFsLWlkJyl9PkNoYW5nZSBDcmVkZW50aWFsPC9idXR0b24+XG4gICAgICBPbmxpbmVEcml2ZSBDb21wb25lbnRcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuL2RhdGEtc291cmNlLW9wdGlvbnMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBkYXRhU291cmNlTm9kZUlkLCBvblNlbGVjdCB9OiB7IGRhdGFTb3VyY2VOb2RlSWQ6IHN0cmluZywgb25TZWxlY3Q6IChkczogRGF0YXNvdXJjZSkgPT4gdm9pZCB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImRhdGEtc291cmNlLW9wdGlvbnNcIiBkYXRhLXNlbGVjdGVkPXtkYXRhU291cmNlTm9kZUlkfT5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWxlY3QtbG9jYWwtZmlsZVwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KHtcbiAgICAgICAgICBub2RlSWQ6ICdsb2NhbC1maWxlLW5vZGUnLFxuICAgICAgICAgIG5vZGVEYXRhOiBjcmVhdGVOb2RlRGF0YSh7IHByb3ZpZGVyX3R5cGU6IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSwgZmlsZUV4dGVuc2lvbnM6IFsndHh0JywgJ3BkZiddIH0pLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgU2VsZWN0IExvY2FsIEZpbGVcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC1vbmxpbmUtZG9jdW1lbnRcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCh7XG4gICAgICAgICAgbm9kZUlkOiAnb25saW5lLWRvYy1ub2RlJyxcbiAgICAgICAgICBub2RlRGF0YTogY3JlYXRlTm9kZURhdGEoeyBwcm92aWRlcl90eXBlOiBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudCB9KSxcbiAgICAgICAgfSl9XG4gICAgICA+XG4gICAgICAgIFNlbGVjdCBPbmxpbmUgRG9jdW1lbnRcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC13ZWJzaXRlLWNyYXdsXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Qoe1xuICAgICAgICAgIG5vZGVJZDogJ3dlYnNpdGUtY3Jhd2wtbm9kZScsXG4gICAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU5vZGVEYXRhKHsgcHJvdmlkZXJfdHlwZTogRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsIH0pLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgU2VsZWN0IFdlYnNpdGUgQ3Jhd2xcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC1vbmxpbmUtZHJpdmVcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCh7XG4gICAgICAgICAgbm9kZUlkOiAnb25saW5lLWRyaXZlLW5vZGUnLFxuICAgICAgICAgIG5vZGVEYXRhOiBjcmVhdGVOb2RlRGF0YSh7IHByb3ZpZGVyX3R5cGU6IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlIH0pLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgU2VsZWN0IE9ubGluZSBEcml2ZVxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2VsZWN0LXVua25vd24tdHlwZVwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KHtcbiAgICAgICAgICBub2RlSWQ6ICd1bmtub3duLXR5cGUtbm9kZScsXG4gICAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU5vZGVEYXRhKHsgcHJvdmlkZXJfdHlwZTogJ3Vua25vd25fdHlwZScgYXMgRGF0YXNvdXJjZVR5cGUgfSksXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICBTZWxlY3QgVW5rbm93biBUeXBlXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIERhdGFTb3VyY2VPcHRpb25zXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnLi9kb2N1bWVudC1wcm9jZXNzaW5nJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgZGF0YVNvdXJjZU5vZGVJZCwgb25Qcm9jZXNzLCBvbkJhY2sgfTogeyBkYXRhU291cmNlTm9kZUlkOiBzdHJpbmcsIG9uUHJvY2VzczogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB2b2lkLCBvbkJhY2s6ICgpID0+IHZvaWQgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJkb2N1bWVudC1wcm9jZXNzaW5nXCIgZGF0YS1ub2RlLWlkPXtkYXRhU291cmNlTm9kZUlkfT5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwcm9jZXNzLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uUHJvY2Vzcyh7IGZpZWxkMTogJ3ZhbHVlMScgfSl9PlByb2Nlc3M8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJiYWNrLWJ0blwiIG9uQ2xpY2s9e29uQmFja30+QmFjazwvYnV0dG9uPlxuICAgICAgRG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIHRvIHJlc2V0IGFsbCBtb2Nrc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCByZXNldEFsbE1vY2tzID0gKCkgPT4ge1xuICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUgPSB7XG4gICAgbG9jYWxGaWxlTGlzdDogW10sXG4gICAgb25saW5lRG9jdW1lbnRzOiBbXSxcbiAgICB3ZWJzaXRlUGFnZXM6IFtdLFxuICAgIHNlbGVjdGVkRmlsZUlkczogW10sXG4gICAgY3VycmVudENyZWRlbnRpYWxJZDogJycsXG4gICAgY3VycmVudE5vZGVJZFJlZjogeyBjdXJyZW50OiAnJyB9LFxuICAgIGJ1Y2tldDogJycsXG4gICAgb25saW5lRHJpdmVGaWxlTGlzdDogW10sXG4gICAgc2V0Q3VycmVudENyZWRlbnRpYWxJZDogdmkuZm4oKSxcbiAgICBzZXREb2N1bWVudHNEYXRhOiB2aS5mbigpLFxuICAgIHNldFNlYXJjaFZhbHVlOiB2aS5mbigpLFxuICAgIHNldFNlbGVjdGVkUGFnZXNJZDogdmkuZm4oKSxcbiAgICBzZXRPbmxpbmVEb2N1bWVudHM6IHZpLmZuKCksXG4gICAgc2V0Q3VycmVudERvY3VtZW50OiB2aS5mbigpLFxuICAgIHNldFN0ZXA6IHZpLmZuKCksXG4gICAgc2V0Q3Jhd2xSZXN1bHQ6IHZpLmZuKCksXG4gICAgc2V0V2Vic2l0ZVBhZ2VzOiB2aS5mbigpLFxuICAgIHNldFByZXZpZXdJbmRleDogdmkuZm4oKSxcbiAgICBzZXRDdXJyZW50V2Vic2l0ZTogdmkuZm4oKSxcbiAgICBzZXRPbmxpbmVEcml2ZUZpbGVMaXN0OiB2aS5mbigpLFxuICAgIHNldEJ1Y2tldDogdmkuZm4oKSxcbiAgICBzZXRQcmVmaXg6IHZpLmZuKCksXG4gICAgc2V0S2V5d29yZHM6IHZpLmZuKCksXG4gICAgc2V0U2VsZWN0ZWRGaWxlSWRzOiB2aS5mbigpLFxuICB9XG4gIG1vY2tXb3JrZmxvd1N0b3JlU3RhdGUgPSB7XG4gICAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlOiB2aS5mbigpLFxuICAgIHBpcGVsaW5lSWQ6ICd0ZXN0LXBpcGVsaW5lLWlkJyxcbiAgfVxuICBtb2NrTm9kZXMgPSBbXVxuICBtb2NrSGFuZGxlUnVuLm1vY2tDbGVhcigpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBJbmRpY2F0b3IgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdTdGVwSW5kaWNhdG9yJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBjb25zdCBkZWZhdWx0U3RlcHMgPSBbXG4gICAgeyBsYWJlbDogJ1N0ZXAgMScsIHZhbHVlOiAnc3RlcDEnIH0sXG4gICAgeyBsYWJlbDogJ1N0ZXAgMicsIHZhbHVlOiAnc3RlcDInIH0sXG4gICAgeyBsYWJlbDogJ1N0ZXAgMycsIHZhbHVlOiAnc3RlcDMnIH0sXG4gIF1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17ZGVmYXVsdFN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdGVwIDMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgc3RlcCBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGVwcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ0RhdGEgU291cmNlJywgdmFsdWU6ICdkYXRhU291cmNlJyB9LFxuICAgICAgICB7IGxhYmVsOiAnUHJvY2Vzc2luZycsIHZhbHVlOiAncHJvY2Vzc2luZycgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e3N0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGEgU291cmNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQcm9jZXNzaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udGFpbmVyIHdpdGggY29ycmVjdCBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17ZGVmYXVsdFN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbignZmxleCcpXG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbignaXRlbXMtY2VudGVyJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdnYXAteC0yJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdweC00JylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdwYi0yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZGl2aWRlciBiZXR3ZWVuIHN0ZXBzIGJ1dCBub3QgYWZ0ZXIgbGFzdCBzdGVwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17ZGVmYXVsdFN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBoYXZlIDIgZGl2aWRlcnMgZm9yIDMgc3RlcHNcbiAgICAgIGNvbnN0IGRpdmlkZXJzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5oLXB4LnctMycpXG4gICAgICBleHBlY3QoZGl2aWRlcnMubGVuZ3RoKS50b0JlKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBkaXZpZGVyIHdoZW4gdGhlcmUgaXMgb25seSBvbmUgc3RlcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNpbmdsZVN0ZXAgPSBbeyBsYWJlbDogJ09ubHkgU3RlcCcsIHZhbHVlOiAnb25seScgfV1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtzaW5nbGVTdGVwfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZGl2aWRlcnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmgtcHgudy0zJylcbiAgICAgIGV4cGVjdChkaXZpZGVycy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGlnaGxpZ2h0IGZpcnN0IHN0ZXAgd2hlbiBjdXJyZW50U3RlcCBpcyAxJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17ZGVmYXVsdFN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBhY2NlbnQgaW5kaWNhdG9yIG9uIGZpcnN0IHN0ZXBcbiAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmJnLXN0YXRlLWFjY2VudC1zb2xpZCcpXG4gICAgICBleHBlY3QoaW5kaWNhdG9ycy5sZW5ndGgpLnRvQmUoMSkgLy8gVGhlIGRvdCBpbmRpY2F0b3JcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgc2Vjb25kIHN0ZXAgd2hlbiBjdXJyZW50U3RlcCBpcyAyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsyfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzdGVwMkNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChzdGVwMkNvbnRhaW5lcj8uY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtc3RhdGUtYWNjZW50LXNvbGlkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgdGhpcmQgc3RlcCB3aGVuIGN1cnJlbnRTdGVwIGlzIDMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e2RlZmF1bHRTdGVwc30gY3VycmVudFN0ZXA9ezN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHN0ZXAzQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCAzJykucGFyZW50RWxlbWVudFxuICAgICAgZXhwZWN0KHN0ZXAzQ29udGFpbmVyPy5jbGFzc05hbWUpLnRvQ29udGFpbigndGV4dC1zdGF0ZS1hY2NlbnQtc29saWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHRlcnRpYXJ5IGNvbG9yIHRvIG5vbi1jdXJyZW50IHN0ZXBzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzdGVwMkNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChzdGVwMkNvbnRhaW5lcj8uY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBkb3QgaW5kaWNhdG9yIG9ubHkgZm9yIGN1cnJlbnQgc3RlcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e2RlZmF1bHRTdGVwc30gY3VycmVudFN0ZXA9ezJ9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPbmx5IG9uZSBkb3Qgc2hvdWxkIGV4aXN0XG4gICAgICBjb25zdCBkb3RzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXplLTEucm91bmRlZC1mdWxsJylcbiAgICAgIGV4cGVjdChkb3RzLmxlbmd0aCkudG9CZSgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdGVwcyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e1tdfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e2RlZmF1bHRTdGVwc30gY3VycmVudFN0ZXA9ezF9IC8+KVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgY29ycmVjdGx5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RlcCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBjdXJyZW50U3RlcCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsxfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWwgc3RhdGVcbiAgICAgIGxldCBzdGVwMUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMScpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChzdGVwMUNvbnRhaW5lcj8uY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtc3RhdGUtYWNjZW50LXNvbGlkJylcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIHN0ZXBcbiAgICAgIHJlcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsyfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBzdGVwMUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMScpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChzdGVwMUNvbnRhaW5lcj8uY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICBjb25zdCBzdGVwMkNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ1N0ZXAgMicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChzdGVwMkNvbnRhaW5lcj8uY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtc3RhdGUtYWNjZW50LXNvbGlkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBzdGVwcyBhcnJheSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsxfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBuZXdTdGVwcyA9IFtcbiAgICAgICAgeyBsYWJlbDogJ05ldyBTdGVwIDEnLCB2YWx1ZTogJ25ldzEnIH0sXG4gICAgICAgIHsgbGFiZWw6ICdOZXcgU3RlcCAyJywgdmFsdWU6ICduZXcyJyB9LFxuICAgICAgXVxuICAgICAgcmVyZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e25ld1N0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05ldyBTdGVwIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05ldyBTdGVwIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnU3RlcCAzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjdXJyZW50U3RlcCBvZiAwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17ZGVmYXVsdFN0ZXBzfSBjdXJyZW50U3RlcD17MH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHN0ZXAgc2hvdWxkIGJlIGhpZ2hsaWdodGVkIChjdXJyZW50U3RlcCAtIDEgPSAtMSlcbiAgICAgIGNvbnN0IGRvdHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnNpemUtMS5yb3VuZGVkLWZ1bGwnKVxuICAgICAgZXhwZWN0KGRvdHMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGN1cnJlbnRTdGVwIGdyZWF0ZXIgdGhhbiBzdGVwcyBsZW5ndGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXsxMH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHN0ZXAgc2hvdWxkIGJlIGhpZ2hsaWdodGVkXG4gICAgICBjb25zdCBkb3RzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXplLTEucm91bmRlZC1mdWxsJylcbiAgICAgIGV4cGVjdChkb3RzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGVwcyB3aXRoIGVtcHR5IGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHN0ZXBzV2l0aEVtcHR5ID0gW1xuICAgICAgICB7IGxhYmVsOiAnJywgdmFsdWU6ICdlbXB0eScgfSxcbiAgICAgICAgeyBsYWJlbDogJ1ZhbGlkJywgdmFsdWU6ICd2YWxpZCcgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFN0ZXBJbmRpY2F0b3Igc3RlcHM9e3N0ZXBzV2l0aEVtcHR5fSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1ZhbGlkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RlcHMgd2l0aCB2ZXJ5IGxvbmcgbGFiZWxzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ0xhYmVsID0gJ0EnLnJlcGVhdCgxMDApXG4gICAgICBjb25zdCBzdGVwc1dpdGhMb25nID0gW3sgbGFiZWw6IGxvbmdMYWJlbCwgdmFsdWU6ICdsb25nJyB9XVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17c3RlcHNXaXRoTG9uZ30gY3VycmVudFN0ZXA9ezF9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdMYWJlbCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNwZWNpYWxTdGVwcyA9IFt7IGxhYmVsOiAnPFRlc3Q+ICYgXCJMYWJlbFwiJywgdmFsdWU6ICdzcGVjaWFsJyB9XVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17c3BlY2lhbFN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzxUZXN0PiAmIFwiTGFiZWxcIicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1bmljb2RlU3RlcHMgPSBbeyBsYWJlbDogJ+aVsOaNrua6kCDwn46JJywgdmFsdWU6ICd1bmljb2RlJyB9XVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcEluZGljYXRvciBzdGVwcz17dW5pY29kZVN0ZXBzfSBjdXJyZW50U3RlcD17MX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ+aVsOaNrua6kCDwn46JJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVnYXRpdmUgY3VycmVudFN0ZXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdGVwSW5kaWNhdG9yIHN0ZXBzPXtkZWZhdWx0U3RlcHN9IGN1cnJlbnRTdGVwPXstMX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHN0ZXAgc2hvdWxkIGJlIGhpZ2hsaWdodGVkXG4gICAgICBjb25zdCBkb3RzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXplLTEucm91bmRlZC1mdWxsJylcbiAgICAgIGV4cGVjdChkb3RzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGb290ZXJUaXBzIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRm9vdGVyVGlwcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEZvb3RlclRpcHMgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciB0cmFuc2xhdGVkIHRleHRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUudGVzdFJ1bi50b29sdGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGNvbnRhaW5lciBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Rm9vdGVyVGlwcyAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdzeXN0ZW0teHMtcmVndWxhcicpXG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbignZmxleCcpXG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbignZ3JvdycpXG4gICAgICBleHBlY3Qod3JhcHBlci5jbGFzc05hbWUpLnRvQ29udGFpbignZmxleC1jb2wnKVxuICAgICAgZXhwZWN0KHdyYXBwZXIuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ2p1c3RpZnktZW5kJylcbiAgICAgIGV4cGVjdCh3cmFwcGVyLmNsYXNzTmFtZSkudG9Db250YWluKCdwLTQnKVxuICAgICAgZXhwZWN0KHdyYXBwZXIuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3B0LTInKVxuICAgICAgZXhwZWN0KHdyYXBwZXIuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEZvb3RlclRpcHMgLz4pXG5cbiAgICAgIC8vIFJlcmVuZGVyXG4gICAgICByZXJlbmRlcig8Rm9vdGVyVGlwcyAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLnRlc3RSdW4udG9vbHRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbnNpc3RlbnRseSBhY3Jvc3MgbXVsdGlwbGUgcmVyZW5kZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxGb290ZXJUaXBzIC8+KVxuXG4gICAgICAvLyBBY3QgLSBNdWx0aXBsZSByZXJlbmRlcnNcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKVxuICAgICAgICByZXJlbmRlcig8Rm9vdGVyVGlwcyAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLnRlc3RSdW4udG9vbHRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bm1vdW50IGNsZWFubHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8Rm9vdGVyVGlwcyAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoKCkgPT4gdW5tb3VudCgpKS5ub3QudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIHVzZVRlc3RSdW5TdGVwcyBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VUZXN0UnVuU3RlcHMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbCBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGN1cnJlbnRTdGVwIGFzIDEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0UnVuU3RlcHMoKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFN0ZXApLnRvQmUoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIHN0ZXBzIGFycmF5IHdpdGggZGF0YSBzb3VyY2UgYW5kIGRvY3VtZW50IHByb2Nlc3Npbmcgc3RlcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0UnVuU3RlcHMoKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc3RlcHMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnN0ZXBzWzBdLnZhbHVlKS50b0JlKCdkYXRhU291cmNlJylcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zdGVwc1sxXS52YWx1ZSkudG9CZSgnZG9jdW1lbnRQcm9jZXNzaW5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIHRyYW5zbGF0ZWQgc3RlcCBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0UnVuU3RlcHMoKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc3RlcHNbMF0ubGFiZWwpLnRvQ29udGFpbigndGVzdFJ1bi5zdGVwcy5kYXRhU291cmNlJylcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zdGVwc1sxXS5sYWJlbCkudG9Db250YWluKCd0ZXN0UnVuLnN0ZXBzLmRvY3VtZW50UHJvY2Vzc2luZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGhhbmRsZU5leHRTdGVwIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ2hhbmRsZU5leHRTdGVwJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5jcmVtZW50IGN1cnJlbnRTdGVwIGJ5IDEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0UnVuU3RlcHMoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVOZXh0U3RlcCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50U3RlcCkudG9CZSgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnRpbnVlIGluY3JlbWVudGluZyBvbiBtdWx0aXBsZSBjYWxscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RSdW5TdGVwcygpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmhhbmRsZU5leHRTdGVwKClcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlTmV4dFN0ZXAoKVxuICAgICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVOZXh0U3RlcCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50U3RlcCkudG9CZSg0KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBoYW5kbGVCYWNrU3RlcCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdoYW5kbGVCYWNrU3RlcCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRlY3JlbWVudCBjdXJyZW50U3RlcCBieSAxJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlVGVzdFJ1blN0ZXBzKCkpXG5cbiAgICAgIC8vIEZpcnN0IGdvIHRvIHN0ZXAgMlxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlTmV4dFN0ZXAoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50U3RlcCkudG9CZSgyKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmhhbmRsZUJhY2tTdGVwKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRTdGVwKS50b0JlKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZ29pbmcgdG8gbmVnYXRpdmUgc3RlcHMgKG5vIHZhbGlkYXRpb24pJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlVGVzdFJ1blN0ZXBzKCkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlQmFja1N0ZXAoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFN0ZXApLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb250aW51ZSBkZWNyZW1lbnRpbmcgb24gbXVsdGlwbGUgY2FsbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VUZXN0UnVuU3RlcHMoKSlcblxuICAgICAgLy8gR28gdG8gc3RlcCA1XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKylcbiAgICAgICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVOZXh0U3RlcCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRTdGVwKS50b0JlKDUpXG5cbiAgICAgIC8vIEFjdCAtIEdvIGJhY2sgMyBzdGVwc1xuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlQmFja1N0ZXAoKVxuICAgICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVCYWNrU3RlcCgpXG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmhhbmRsZUJhY2tTdGVwKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRTdGVwKS50b0JlKDIpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc3RhYmxlIGhhbmRsZU5leHRTdGVwIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RSdW5TdGVwcygpKVxuICAgICAgY29uc3QgaW5pdGlhbENhbGxiYWNrID0gcmVzdWx0LmN1cnJlbnQuaGFuZGxlTmV4dFN0ZXBcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmhhbmRsZU5leHRTdGVwKS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc3RhYmxlIGhhbmRsZUJhY2tTdGVwIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RSdW5TdGVwcygpKVxuICAgICAgY29uc3QgaW5pdGlhbENhbGxiYWNrID0gcmVzdWx0LmN1cnJlbnQuaGFuZGxlQmFja1N0ZXBcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcigpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmhhbmRsZUJhY2tTdGVwKS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZm9yd2FyZCBhbmQgYmFja3dhcmQgbmF2aWdhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVRlc3RSdW5TdGVwcygpKVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBOYXZpZ2F0ZSBmb3J3YXJkXG4gICAgICBhY3QoKCkgPT4gcmVzdWx0LmN1cnJlbnQuaGFuZGxlTmV4dFN0ZXAoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50U3RlcCkudG9CZSgyKVxuXG4gICAgICBhY3QoKCkgPT4gcmVzdWx0LmN1cnJlbnQuaGFuZGxlTmV4dFN0ZXAoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50U3RlcCkudG9CZSgzKVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBOYXZpZ2F0ZSBiYWNrd2FyZFxuICAgICAgYWN0KCgpID0+IHJlc3VsdC5jdXJyZW50LmhhbmRsZUJhY2tTdGVwKCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFN0ZXApLnRvQmUoMilcblxuICAgICAgYWN0KCgpID0+IHJlc3VsdC5jdXJyZW50LmhhbmRsZUJhY2tTdGVwKCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFN0ZXApLnRvQmUoMSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlRGF0YXNvdXJjZU9wdGlvbnMgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlRGF0YXNvdXJjZU9wdGlvbnMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHJlc2V0QWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQmFzaWMgRnVuY3Rpb25hbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdCYXNpYyBGdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IHdoZW4gbm8gbm9kZXMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTm9kZXMgPSBbXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURhdGFzb3VyY2VPcHRpb25zKCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIG5vIERhdGFTb3VyY2Ugbm9kZXMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTm9kZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ25vZGUtMScsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uY3JlYXRlTm9kZURhdGEoKSxcbiAgICAgICAgICAgIHR5cGU6ICdsbG0nLCAvLyBOb3QgYSBEYXRhU291cmNlIHR5cGVcbiAgICAgICAgICB9IGFzIERhdGFTb3VyY2VOb2RlVHlwZSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlT3B0aW9ucygpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gb3B0aW9ucyBmb3IgRGF0YVNvdXJjZSBub2RlcyBvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja05vZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdkYXRhc291cmNlLTEnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmNyZWF0ZU5vZGVEYXRhKHsgdGl0bGU6ICdMb2NhbCBGaWxlIFNvdXJjZScgfSksXG4gICAgICAgICAgICB0eXBlOiAnZGF0YXNvdXJjZScsXG4gICAgICAgICAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2xsbS1ub2RlJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7IHRpdGxlOiAnTExNIE5vZGUnIH0pLFxuICAgICAgICAgICAgdHlwZTogJ2xsbScsXG4gICAgICAgICAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2RhdGFzb3VyY2UtMicsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uY3JlYXRlTm9kZURhdGEoeyB0aXRsZTogJ09ubGluZSBEb2MgU291cmNlJyB9KSxcbiAgICAgICAgICAgIHR5cGU6ICdkYXRhc291cmNlJyxcbiAgICAgICAgICB9IGFzIERhdGFTb3VyY2VOb2RlVHlwZSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlT3B0aW9ucygpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnRbMF0pLnRvRXF1YWwoe1xuICAgICAgICBsYWJlbDogJ0xvY2FsIEZpbGUgU291cmNlJyxcbiAgICAgICAgdmFsdWU6ICdkYXRhc291cmNlLTEnLFxuICAgICAgICBkYXRhOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHRpdGxlOiAnTG9jYWwgRmlsZSBTb3VyY2UnIH0pLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudFsxXSkudG9FcXVhbCh7XG4gICAgICAgIGxhYmVsOiAnT25saW5lIERvYyBTb3VyY2UnLFxuICAgICAgICB2YWx1ZTogJ2RhdGFzb3VyY2UtMicsXG4gICAgICAgIGRhdGE6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdGl0bGU6ICdPbmxpbmUgRG9jIFNvdXJjZScgfSksXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1hcCBub2RlIGlkIHRvIG9wdGlvbiB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tOb2RlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAndW5pcXVlLW5vZGUtaWQtMTIzJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7IHRpdGxlOiAnVGVzdCBTb3VyY2UnIH0pLFxuICAgICAgICAgICAgdHlwZTogJ2RhdGFzb3VyY2UnLFxuICAgICAgICAgIH0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURhdGFzb3VyY2VPcHRpb25zKCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50WzBdLnZhbHVlKS50b0JlKCd1bmlxdWUtbm9kZS1pZC0xMjMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1hcCBub2RlIHRpdGxlIHRvIG9wdGlvbiBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tOb2RlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnbm9kZS0xJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7IHRpdGxlOiAnQ3VzdG9tIERhdGEgU291cmNlIFRpdGxlJyB9KSxcbiAgICAgICAgICAgIHR5cGU6ICdkYXRhc291cmNlJyxcbiAgICAgICAgICB9IGFzIERhdGFTb3VyY2VOb2RlVHlwZSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlT3B0aW9ucygpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudFswXS5sYWJlbCkudG9CZSgnQ3VzdG9tIERhdGEgU291cmNlIFRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIGZ1bGwgbm9kZSBkYXRhIGluIG9wdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0ge1xuICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7XG4gICAgICAgICAgdGl0bGU6ICdGdWxsIERhdGEgVGVzdCcsXG4gICAgICAgICAgcHJvdmlkZXJfdHlwZTogRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsLFxuICAgICAgICAgIHByb3ZpZGVyX25hbWU6ICdXZWJzaXRlIENyYXdsZXInLFxuICAgICAgICB9KSxcbiAgICAgICAgdHlwZTogJ2RhdGFzb3VyY2UnLFxuICAgICAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGVcblxuICAgICAgbW9ja05vZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdub2RlLTEnLFxuICAgICAgICAgIGRhdGE6IG5vZGVEYXRhLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURhdGFzb3VyY2VPcHRpb25zKCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50WzBdLmRhdGEpLnRvRXF1YWwobm9kZURhdGEpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHNhbWUgb3B0aW9ucyByZWZlcmVuY2Ugd2hlbiBub2RlcyBkbyBub3QgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja05vZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdub2RlLTEnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmNyZWF0ZU5vZGVEYXRhKHsgdGl0bGU6ICdUZXN0JyB9KSxcbiAgICAgICAgICAgIHR5cGU6ICdkYXRhc291cmNlJyxcbiAgICAgICAgICB9IGFzIERhdGFTb3VyY2VOb2RlVHlwZSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCwgcmVyZW5kZXIgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRGF0YXNvdXJjZU9wdGlvbnMoKSlcblxuICAgICAgcmVyZW5kZXIoKVxuXG4gICAgICAvLyBBc3NlcnQgLSBPcHRpb25zIHNob3VsZCBiZSBtZW1vaXplZCBhbmQgc3RpbGwgd29yayBjb3JyZWN0bHkgYWZ0ZXIgcmVyZW5kZXJcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9IYXZlTGVuZ3RoKDEpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnRbMF0ubGFiZWwpLnRvQmUoJ1Rlc3QnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBvcHRpb25zIHdoZW4gbm9kZXMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja05vZGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdub2RlLTEnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmNyZWF0ZU5vZGVEYXRhKHsgdGl0bGU6ICdGaXJzdCcgfSksXG4gICAgICAgICAgICB0eXBlOiAnZGF0YXNvdXJjZScsXG4gICAgICAgICAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEYXRhc291cmNlT3B0aW9ucygpKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0hhdmVMZW5ndGgoMSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudFswXS5sYWJlbCkudG9CZSgnRmlyc3QnKVxuXG4gICAgICAvLyBBY3QgLSBDaGFuZ2Ugbm9kZXNcbiAgICAgIG1vY2tOb2RlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnbm9kZS0yJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7IHRpdGxlOiAnU2Vjb25kJyB9KSxcbiAgICAgICAgICAgIHR5cGU6ICdkYXRhc291cmNlJyxcbiAgICAgICAgICB9IGFzIERhdGFTb3VyY2VOb2RlVHlwZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnbm9kZS0zJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5jcmVhdGVOb2RlRGF0YSh7IHRpdGxlOiAnVGhpcmQnIH0pLFxuICAgICAgICAgICAgdHlwZTogJ2RhdGFzb3VyY2UnLFxuICAgICAgICAgIH0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlLFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICAgcmVyZW5kZXIoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnRbMF0ubGFiZWwpLnRvQmUoJ1NlY29uZCcpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnRbMV0ubGFiZWwpLnRvQmUoJ1RoaXJkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG5vZGVzIHdpdGggZW1wdHkgdGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTm9kZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ25vZGUtMScsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLi4uY3JlYXRlTm9kZURhdGEoeyB0aXRsZTogJycgfSksXG4gICAgICAgICAgICB0eXBlOiAnZGF0YXNvdXJjZScsXG4gICAgICAgICAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRGF0YXNvdXJjZU9wdGlvbnMoKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnRbMF0ubGFiZWwpLnRvQmUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIERhdGFTb3VyY2Ugbm9kZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTm9kZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgaWQ6IGBub2RlLSR7aX1gLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uY3JlYXRlTm9kZURhdGEoeyB0aXRsZTogYFNvdXJjZSAke2l9YCB9KSxcbiAgICAgICAgICB0eXBlOiAnZGF0YXNvdXJjZScsXG4gICAgICAgIH0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlLFxuICAgICAgfSkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRGF0YXNvdXJjZU9wdGlvbnMoKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvSGF2ZUxlbmd0aCgxMClcbiAgICAgIHJlc3VsdC5jdXJyZW50LmZvckVhY2goKG9wdGlvbiwgaSkgPT4ge1xuICAgICAgICBleHBlY3Qob3B0aW9uLnZhbHVlKS50b0JlKGBub2RlLSR7aX1gKVxuICAgICAgICBleHBlY3Qob3B0aW9uLmxhYmVsKS50b0JlKGBTb3VyY2UgJHtpfWApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VPbmxpbmVEb2N1bWVudCBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VPbmxpbmVEb2N1bWVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcmVzZXRBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBjbGVhck9ubGluZURvY3VtZW50RGF0YSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdjbGVhck9ubGluZURvY3VtZW50RGF0YScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNsZWFyIGFsbCBvbmxpbmUgZG9jdW1lbnQgcmVsYXRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlT25saW5lRG9jdW1lbnQoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5jbGVhck9ubGluZURvY3VtZW50RGF0YSgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0RG9jdW1lbnRzRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFNlYXJjaFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnJylcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U2VsZWN0ZWRQYWdlc0lkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChuZXcgU2V0KCkpXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldE9ubGluZURvY3VtZW50cykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEN1cnJlbnREb2N1bWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodW5kZWZpbmVkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgYWxsIGNsZWFyIGZ1bmN0aW9ucyBpbiBjb3JyZWN0IG9yZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlT25saW5lRG9jdW1lbnQoKSlcbiAgICAgIGNvbnN0IGNhbGxPcmRlcjogc3RyaW5nW10gPSBbXVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEgPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnc2V0RG9jdW1lbnRzRGF0YScpKVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFNlYXJjaFZhbHVlID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldFNlYXJjaFZhbHVlJykpXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U2VsZWN0ZWRQYWdlc0lkID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldFNlbGVjdGVkUGFnZXNJZCcpKVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldE9ubGluZURvY3VtZW50cyA9IHZpLmZuKCgpID0+IGNhbGxPcmRlci5wdXNoKCdzZXRPbmxpbmVEb2N1bWVudHMnKSlcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRDdXJyZW50RG9jdW1lbnQgPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnc2V0Q3VycmVudERvY3VtZW50JykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuY2xlYXJPbmxpbmVEb2N1bWVudERhdGEoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY2FsbE9yZGVyKS50b0VxdWFsKFtcbiAgICAgICAgJ3NldERvY3VtZW50c0RhdGEnLFxuICAgICAgICAnc2V0U2VhcmNoVmFsdWUnLFxuICAgICAgICAnc2V0U2VsZWN0ZWRQYWdlc0lkJyxcbiAgICAgICAgJ3NldE9ubGluZURvY3VtZW50cycsXG4gICAgICAgICdzZXRDdXJyZW50RG9jdW1lbnQnLFxuICAgICAgXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGZ1bmN0aW9uYWwgY2FsbGJhY2sgYWZ0ZXIgcmVyZW5kZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgcmVyZW5kZXIgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlT25saW5lRG9jdW1lbnQoKSlcblxuICAgICAgLy8gQWN0IC0gRmlyc3QgY2FsbFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuY2xlYXJPbmxpbmVEb2N1bWVudERhdGEoKVxuICAgICAgfSlcbiAgICAgIGNvbnN0IGZpcnN0Q2FsbENvdW50ID0gbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEubW9jay5jYWxscy5sZW5ndGhcblxuICAgICAgLy8gUmVyZW5kZXJcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQWN0IC0gU2Vjb25kIGNhbGwgYWZ0ZXIgcmVyZW5kZXJcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmNsZWFyT25saW5lRG9jdW1lbnREYXRhKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIENhbGxiYWNrIHNob3VsZCBzdGlsbCB3b3JrIGFmdGVyIHJlcmVuZGVyXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEubW9jay5jYWxscy5sZW5ndGgpLnRvQmUoZmlyc3RDYWxsQ291bnQgKyAxKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VXZWJzaXRlQ3Jhd2wgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlV2Vic2l0ZUNyYXdsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICByZXNldEFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGNsZWFyV2Vic2l0ZUNyYXdsRGF0YSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdjbGVhcldlYnNpdGVDcmF3bERhdGEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjbGVhciBhbGwgd2Vic2l0ZSBjcmF3bCByZWxhdGVkIGRhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VXZWJzaXRlQ3Jhd2woKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5jbGVhcldlYnNpdGVDcmF3bERhdGEoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdpbml0JylcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0Q3Jhd2xSZXN1bHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0Q3VycmVudFdlYnNpdGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0V2Vic2l0ZVBhZ2VzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0UHJldmlld0luZGV4KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgtMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGFsbCBjbGVhciBmdW5jdGlvbnMgaW4gY29ycmVjdCBvcmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVdlYnNpdGVDcmF3bCgpKVxuICAgICAgY29uc3QgY2FsbE9yZGVyOiBzdHJpbmdbXSA9IFtdXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U3RlcCA9IHZpLmZuKCgpID0+IGNhbGxPcmRlci5wdXNoKCdzZXRTdGVwJykpXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0Q3Jhd2xSZXN1bHQgPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnc2V0Q3Jhd2xSZXN1bHQnKSlcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRDdXJyZW50V2Vic2l0ZSA9IHZpLmZuKCgpID0+IGNhbGxPcmRlci5wdXNoKCdzZXRDdXJyZW50V2Vic2l0ZScpKVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFdlYnNpdGVQYWdlcyA9IHZpLmZuKCgpID0+IGNhbGxPcmRlci5wdXNoKCdzZXRXZWJzaXRlUGFnZXMnKSlcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRQcmV2aWV3SW5kZXggPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnc2V0UHJldmlld0luZGV4JykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuY2xlYXJXZWJzaXRlQ3Jhd2xEYXRhKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNhbGxPcmRlcikudG9FcXVhbChbXG4gICAgICAgICdzZXRTdGVwJyxcbiAgICAgICAgJ3NldENyYXdsUmVzdWx0JyxcbiAgICAgICAgJ3NldEN1cnJlbnRXZWJzaXRlJyxcbiAgICAgICAgJ3NldFdlYnNpdGVQYWdlcycsXG4gICAgICAgICdzZXRQcmV2aWV3SW5kZXgnLFxuICAgICAgXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGZ1bmN0aW9uYWwgY2FsbGJhY2sgYWZ0ZXIgcmVyZW5kZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCwgcmVyZW5kZXIgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlV2Vic2l0ZUNyYXdsKCkpXG5cbiAgICAgIC8vIEFjdCAtIEZpcnN0IGNhbGxcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmNsZWFyV2Vic2l0ZUNyYXdsRGF0YSgpXG4gICAgICB9KVxuICAgICAgY29uc3QgZmlyc3RDYWxsQ291bnQgPSBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U3RlcC5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBSZXJlbmRlclxuICAgICAgcmVyZW5kZXIoKVxuXG4gICAgICAvLyBBY3QgLSBTZWNvbmQgY2FsbCBhZnRlciByZXJlbmRlclxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuY2xlYXJXZWJzaXRlQ3Jhd2xEYXRhKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIENhbGxiYWNrIHNob3VsZCBzdGlsbCB3b3JrIGFmdGVyIHJlcmVuZGVyXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFN0ZXAubW9jay5jYWxscy5sZW5ndGgpLnRvQmUoZmlyc3RDYWxsQ291bnQgKyAxKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VPbmxpbmVEcml2ZSBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VPbmxpbmVEcml2ZScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcmVzZXRBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBjbGVhck9ubGluZURyaXZlRGF0YSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdjbGVhck9ubGluZURyaXZlRGF0YScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNsZWFyIGFsbCBvbmxpbmUgZHJpdmUgcmVsYXRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlT25saW5lRHJpdmUoKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5jbGVhck9ubGluZURyaXZlRGF0YSgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEJ1Y2tldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFByZWZpeCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnJylcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGFsbCBjbGVhciBmdW5jdGlvbnMgaW4gY29ycmVjdCBvcmRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZU9ubGluZURyaXZlKCkpXG4gICAgICBjb25zdCBjYWxsT3JkZXI6IHN0cmluZ1tdID0gW11cbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0ID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldE9ubGluZURyaXZlRmlsZUxpc3QnKSlcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRCdWNrZXQgPSB2aS5mbigoKSA9PiBjYWxsT3JkZXIucHVzaCgnc2V0QnVja2V0JykpXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0UHJlZml4ID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldFByZWZpeCcpKVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEtleXdvcmRzID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldEtleXdvcmRzJykpXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzID0gdmkuZm4oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ3NldFNlbGVjdGVkRmlsZUlkcycpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmNsZWFyT25saW5lRHJpdmVEYXRhKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNhbGxPcmRlcikudG9FcXVhbChbXG4gICAgICAgICdzZXRPbmxpbmVEcml2ZUZpbGVMaXN0JyxcbiAgICAgICAgJ3NldEJ1Y2tldCcsXG4gICAgICAgICdzZXRQcmVmaXgnLFxuICAgICAgICAnc2V0S2V5d29yZHMnLFxuICAgICAgICAnc2V0U2VsZWN0ZWRGaWxlSWRzJyxcbiAgICAgIF0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBmdW5jdGlvbmFsIGNhbGxiYWNrIGFmdGVyIHJlcmVuZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZU9ubGluZURyaXZlKCkpXG5cbiAgICAgIC8vIEFjdCAtIEZpcnN0IGNhbGxcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmNsZWFyT25saW5lRHJpdmVEYXRhKClcbiAgICAgIH0pXG4gICAgICBjb25zdCBmaXJzdENhbGxDb3VudCA9IG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0Lm1vY2suY2FsbHMubGVuZ3RoXG5cbiAgICAgIC8vIFJlcmVuZGVyXG4gICAgICByZXJlbmRlcigpXG5cbiAgICAgIC8vIEFjdCAtIFNlY29uZCBjYWxsIGFmdGVyIHJlcmVuZGVyXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5jbGVhck9ubGluZURyaXZlRGF0YSgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDYWxsYmFjayBzaG91bGQgc3RpbGwgd29yayBhZnRlciByZXJlbmRlclxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0Lm1vY2suY2FsbHMubGVuZ3RoKS50b0JlKGZpcnN0Q2FsbENvdW50ICsgMSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUHJlcGFyYXRpb24gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdQcmVwYXJhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcmVzZXRBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTdGVwSW5kaWNhdG9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHN0ZXAgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS50ZXN0UnVuLnN0ZXBzLmRhdGFTb3VyY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS50ZXN0UnVuLnN0ZXBzLmRvY3VtZW50UHJvY2Vzc2luZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIERhdGFTb3VyY2VPcHRpb25zIG9uIHN0ZXAgMScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZGF0YS1zb3VyY2Utb3B0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEFjdGlvbnMgb24gc3RlcCAxJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRm9vdGVyVGlwcyBvbiBzdGVwIDEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUudGVzdFJ1bi50b29sdGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIERvY3VtZW50UHJvY2Vzc2luZyBvbiBzdGVwIDEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZG9jdW1lbnQtcHJvY2Vzc2luZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhIFNvdXJjZSBTZWxlY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRGF0YSBTb3VyY2UgU2VsZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIExvY2FsRmlsZSBjb21wb25lbnQgd2hlbiBsb2NhbCBmaWxlIGRhdGFzb3VyY2UgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9jYWwtZmlsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIE9ubGluZURvY3VtZW50cyBjb21wb25lbnQgd2hlbiBvbmxpbmUgZG9jdW1lbnQgZGF0YXNvdXJjZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kb2N1bWVudCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29ubGluZS1kb2N1bWVudHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBXZWJzaXRlQ3Jhd2wgY29tcG9uZW50IHdoZW4gd2Vic2l0ZSBjcmF3bCBkYXRhc291cmNlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3dlYnNpdGUtY3Jhd2wnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBPbmxpbmVEcml2ZSBjb21wb25lbnQgd2hlbiBvbmxpbmUgZHJpdmUgZGF0YXNvdXJjZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kcml2ZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29ubGluZS1kcml2ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHByb3BzIHRvIExvY2FsRmlsZSBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbG9jYWxGaWxlID0gc2NyZWVuLmdldEJ5VGVzdElkKCdsb2NhbC1maWxlJylcbiAgICAgIGV4cGVjdChsb2NhbEZpbGUpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1leHRlbnNpb25zJywgJ1tcInR4dFwiLFwicGRmXCJdJylcbiAgICAgIGV4cGVjdChsb2NhbEZpbGUpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1iYXRjaCcsICdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0luUGlwZWxpbmU9dHJ1ZSB0byBPbmxpbmVEb2N1bWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZG9jdW1lbnQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBvbmxpbmVEb2NzID0gc2NyZWVuLmdldEJ5VGVzdElkKCdvbmxpbmUtZG9jdW1lbnRzJylcbiAgICAgIGV4cGVjdChvbmxpbmVEb2NzKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtaW4tcGlwZWxpbmUnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBzdXBwb3J0QmF0Y2hVcGxvYWQ9ZmFsc2UgdG8gYWxsIGRhdGEgc291cmNlIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3Qgb25saW5lIGRvY3VtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb25saW5lLWRvY3VtZW50cycpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtYmF0Y2gnLCAnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBkYXRhU291cmNlTm9kZUlkIHdoZW4gc2VsZWN0aW5nIGRpZmZlcmVudCBkYXRhc291cmNlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkYXRhLXNvdXJjZS1vcHRpb25zJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zZWxlY3RlZCcsICdsb2NhbC1maWxlLW5vZGUnKVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3QgYW5vdGhlclxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kb2N1bWVudCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgJ29ubGluZS1kb2Mtbm9kZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE5leHQgQnV0dG9uIERpc2FibGVkIFN0YXRlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ05leHQgQnV0dG9uIERpc2FibGVkIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiB3aGVuIG5vIGRhdGFzb3VyY2UgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIG5leHQgYnV0dG9uIGZvciBsb2NhbCBmaWxlIHdoZW4gZmlsZSBsaXN0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtbG9jYWwtZmlsZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIG5leHQgYnV0dG9uIGZvciBsb2NhbCBmaWxlIHdoZW4gZmlsZSBoYXMgbm8gaWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAnJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIG5leHQgYnV0dG9uIGZvciBsb2NhbCBmaWxlIHdoZW4gZmlsZSBoYXMgdmFsaWQgaWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAnZmlsZS0xMjMnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiAndGV4dC9wbGFpbicsIHNpemU6IDEwMCwgZXh0ZW5zaW9uOiAndHh0JywgbWltZV90eXBlOiAndGV4dC9wbGFpbicgfSB9LFxuICAgICAgXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtbG9jYWwtZmlsZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiBmb3Igb25saW5lIGRvY3VtZW50IHdoZW4gZG9jdW1lbnRzIGxpc3QgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUub25saW5lRG9jdW1lbnRzID0gW11cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kb2N1bWVudCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlbmFibGUgbmV4dCBidXR0b24gZm9yIG9ubGluZSBkb2N1bWVudCB3aGVuIGRvY3VtZW50cyBleGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5vbmxpbmVEb2N1bWVudHMgPSBbeyB3b3Jrc3BhY2VfaWQ6ICd3cy0xJywgcGFnZV9pZDogJ3BhZ2UtMScgfV1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kb2N1bWVudCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiBmb3Igd2Vic2l0ZSBjcmF3bCB3aGVuIHBhZ2VzIGxpc3QgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUud2Vic2l0ZVBhZ2VzID0gW11cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXdlYnNpdGUtY3Jhd2wnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIG5leHQgYnV0dG9uIGZvciB3ZWJzaXRlIGNyYXdsIHdoZW4gcGFnZXMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUud2Vic2l0ZVBhZ2VzID0gW3sgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScgfV1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXdlYnNpdGUtY3Jhd2wnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgbmV4dCBidXR0b24gZm9yIG9ubGluZSBkcml2ZSB3aGVuIG5vIGZpbGVzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNlbGVjdGVkRmlsZUlkcyA9IFtdXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZHJpdmUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIG5leHQgYnV0dG9uIGZvciBvbmxpbmUgZHJpdmUgd2hlbiBmaWxlcyBhcmUgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2VsZWN0ZWRGaWxlSWRzID0gWydmaWxlLTEnXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRyaXZlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3RlcCBOYXZpZ2F0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0ZXAgTmF2aWdhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5hdmlnYXRlIHRvIHN0ZXAgMiB3aGVuIG5leHQgYnV0dG9uIGlzIGNsaWNrZWQgd2l0aCB2YWxpZCBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXG4gICAgICAgIHsgZmlsZTogeyBpZDogJ2ZpbGUtMTIzJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCBkYXRhc291cmNlIGFuZCBjbGljayBuZXh0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtbG9jYWwtZmlsZScpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RvY3VtZW50LXByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdkYXRhLXNvdXJjZS1vcHRpb25zJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IGRhdGFTb3VyY2VOb2RlSWQgdG8gRG9jdW1lbnRQcm9jZXNzaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXG4gICAgICAgIHsgZmlsZTogeyBpZDogJ2ZpbGUtMTIzJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb2N1bWVudC1wcm9jZXNzaW5nJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1ub2RlLWlkJywgJ2xvY2FsLWZpbGUtbm9kZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgYmFjayB0byBzdGVwIDEgd2hlbiBiYWNrIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXG4gICAgICAgIHsgZmlsZTogeyBpZDogJ2ZpbGUtMTIzJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIEdvIHRvIHN0ZXAgMlxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RvY3VtZW50LXByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBHbyBiYWNrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdkb2N1bWVudC1wcm9jZXNzaW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGhhbmRsZVByb2Nlc3MgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnaGFuZGxlUHJvY2VzcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlUnVuIHdpdGggY29ycmVjdCBwYXJhbXMgZm9yIGxvY2FsIGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAnZmlsZS0xMjMnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiAndGV4dC9wbGFpbicsIHNpemU6IDEwMCwgZXh0ZW5zaW9uOiAndHh0JywgbWltZV90eXBlOiAndGV4dC9wbGFpbicgfSB9LFxuICAgICAgXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtbG9jYWwtZmlsZScpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVSdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBpbnB1dHM6IHsgZmllbGQxOiAndmFsdWUxJyB9LFxuICAgICAgICAgIHN0YXJ0X25vZGVfaWQ6ICdsb2NhbC1maWxlLW5vZGUnLFxuICAgICAgICAgIGRhdGFzb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgICB9KSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVSdW4gd2l0aCBjb3JyZWN0IHBhcmFtcyBmb3Igb25saW5lIGRvY3VtZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLm9ubGluZURvY3VtZW50cyA9IFt7IHdvcmtzcGFjZV9pZDogJ3dzLTEnLCBwYWdlX2lkOiAncGFnZS0xJywgdGl0bGU6ICdUZXN0IERvYycgfV1cbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMTIzJ1xuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcm9jZXNzLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVJ1bikudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGlucHV0czogeyBmaWVsZDE6ICd2YWx1ZTEnIH0sXG4gICAgICAgICAgc3RhcnRfbm9kZV9pZDogJ29ubGluZS1kb2Mtbm9kZScsXG4gICAgICAgICAgZGF0YXNvdXJjZV90eXBlOiBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudCxcbiAgICAgICAgfSkpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlUnVuIHdpdGggY29ycmVjdCBwYXJhbXMgZm9yIHdlYnNpdGUgY3Jhd2wnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUud2Vic2l0ZVBhZ2VzID0gW3sgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIHRpdGxlOiAnRXhhbXBsZScgfV1cbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtNDU2J1xuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVSdW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBpbnB1dHM6IHsgZmllbGQxOiAndmFsdWUxJyB9LFxuICAgICAgICAgIHN0YXJ0X25vZGVfaWQ6ICd3ZWJzaXRlLWNyYXdsLW5vZGUnLFxuICAgICAgICAgIGRhdGFzb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsLFxuICAgICAgICB9KSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVSdW4gd2l0aCBjb3JyZWN0IHBhcmFtcyBmb3Igb25saW5lIGRyaXZlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNlbGVjdGVkRmlsZUlkcyA9IFsnZmlsZS0xJ11cbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW3sgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZGF0YS5jc3YnLCB0eXBlOiAnZmlsZScgfV1cbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5idWNrZXQgPSAnbXktYnVja2V0J1xuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC03ODknXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZHJpdmUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUnVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgaW5wdXRzOiB7IGZpZWxkMTogJ3ZhbHVlMScgfSxcbiAgICAgICAgICBzdGFydF9ub2RlX2lkOiAnb25saW5lLWRyaXZlLW5vZGUnLFxuICAgICAgICAgIGRhdGFzb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUsXG4gICAgICAgIH0pKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldElzUHJlcGFyaW5nRGF0YVNvdXJjZShmYWxzZSkgYWZ0ZXIgcHJvY2Vzc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5sb2NhbEZpbGVMaXN0ID0gW1xuICAgICAgICB7IGZpbGU6IHsgaWQ6ICdmaWxlLTEyMycsIG5hbWU6ICd0ZXN0LnR4dCcsIHR5cGU6ICd0ZXh0L3BsYWluJywgc2l6ZTogMTAwLCBleHRlbnNpb246ICd0eHQnLCBtaW1lX3R5cGU6ICd0ZXh0L3BsYWluJyB9IH0sXG4gICAgICBdXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcm9jZXNzLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1dvcmtmbG93U3RvcmVTdGF0ZS5zZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gY2xlYXJEYXRhU291cmNlRGF0YSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdjbGVhckRhdGFTb3VyY2VEYXRhJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2xlYXIgb25saW5lIGRvY3VtZW50IGRhdGEgd2hlbiBzd2l0Y2hpbmcgZnJvbSBvbmxpbmUgZG9jdW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3Qgb25saW5lIGRvY3VtZW50IGZpcnN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG4gICAgICAvLyBUaGVuIHN3aXRjaCB0byBsb2NhbCBmaWxlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtbG9jYWwtZmlsZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0RG9jdW1lbnRzRGF0YSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldE9ubGluZURvY3VtZW50cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgd2Vic2l0ZSBjcmF3bCBkYXRhIHdoZW4gc3dpdGNoaW5nIGZyb20gd2Vic2l0ZSBjcmF3bCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCB3ZWJzaXRlIGNyYXdsIGZpcnN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuICAgICAgLy8gVGhlbiBzd2l0Y2ggdG8gbG9jYWwgZmlsZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFdlYnNpdGVQYWdlcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldENyYXdsUmVzdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbGVhciBvbmxpbmUgZHJpdmUgZGF0YSB3aGVuIHN3aXRjaGluZyBmcm9tIG9ubGluZSBkcml2ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCBvbmxpbmUgZHJpdmUgZmlyc3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZHJpdmUnKSlcbiAgICAgIC8vIFRoZW4gc3dpdGNoIHRvIGxvY2FsIGZpbGVcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0QnVja2V0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gaGFuZGxlQ3JlZGVudGlhbENoYW5nZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdoYW5kbGVDcmVkZW50aWFsQ2hhbmdlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNyZWRlbnRpYWwgYW5kIGNsZWFyIGRhdGEgd2hlbiBjcmVkZW50aWFsIGNoYW5nZXMgZm9yIG9ubGluZSBkb2N1bWVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5vbmxpbmVEb2N1bWVudHMgPSBbeyB3b3Jrc3BhY2VfaWQ6ICd3cy0xJyB9XVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQ2hhbmdlIENyZWRlbnRpYWwnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEN1cnJlbnRDcmVkZW50aWFsSWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXctY3JlZGVudGlhbC1pZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgZGF0YSB3aGVuIGNyZWRlbnRpYWwgY2hhbmdlcyBmb3Igd2Vic2l0ZSBjcmF3bCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS53ZWJzaXRlUGFnZXMgPSBbeyB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tJyB9XVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0NoYW5nZSBDcmVkZW50aWFsJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRDdXJyZW50Q3JlZGVudGlhbElkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbmV3LWNyZWRlbnRpYWwtaWQnKVxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRXZWJzaXRlUGFnZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIGRhdGEgd2hlbiBjcmVkZW50aWFsIGNoYW5nZXMgZm9yIG9ubGluZSBkcml2ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZWxlY3RlZEZpbGVJZHMgPSBbJ2ZpbGUtMSddXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZHJpdmUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdDaGFuZ2UgQ3JlZGVudGlhbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0Q3VycmVudENyZWRlbnRpYWxJZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldy1jcmVkZW50aWFsLWlkJylcbiAgICAgIGV4cGVjdChtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGhhbmRsZVN3aXRjaERhdGFTb3VyY2UgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnaGFuZGxlU3dpdGNoRGF0YVNvdXJjZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNsZWFyIGNyZWRlbnRpYWwgd2hlbiBzd2l0Y2hpbmcgZGF0YXNvdXJjZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldEN1cnJlbnRDcmVkZW50aWFsSWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjdXJyZW50Tm9kZUlkUmVmIHdoZW4gc3dpdGNoaW5nIGRhdGFzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5jdXJyZW50Tm9kZUlkUmVmLmN1cnJlbnQpLnRvQmUoJ2xvY2FsLWZpbGUtbm9kZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuICAgICAgcmVyZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YXRlIGFjcm9zcyByZXJlbmRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAnZmlsZS0xMjMnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiAndGV4dC9wbGFpbicsIHNpemU6IDEwMCwgZXh0ZW5zaW9uOiAndHh0JywgbWltZV90eXBlOiAndGV4dC9wbGFpbicgfSB9LFxuICAgICAgXVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IGRhdGFzb3VyY2UgYW5kIGdvIHRvIHN0ZXAgMlxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gUmVyZW5kZXJcbiAgICAgIHJlcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIGJlIG9uIHN0ZXAgMlxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZG9jdW1lbnQtcHJvY2Vzc2luZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bm1vdW50IGNsZWFubHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHVubW91bnQoKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBuZXh0IGJ1dHRvbiBmb3IgdW5rbm93biBkYXRhc291cmNlIHR5cGUgKHJldHVybiBmYWxzZSBicmFuY2gpJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIFRoaXMgdGVzdHMgbGluZSA2NzogcmV0dXJuIGZhbHNlIGZvciB1bmtub3duIGRhdGFzb3VyY2UgdHlwZXNcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCB1bmtub3duIHR5cGUgZGF0YXNvdXJjZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXVua25vd24tdHlwZScpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIE5PVCBiZSBkaXNhYmxlZCBiZWNhdXNlIHVua25vd24gdHlwZSByZXR1cm5zIGZhbHNlIChub3QgZGlzYWJsZWQpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBoYW5kbGVQcm9jZXNzIHdpdGggdW5rbm93biBkYXRhc291cmNlIHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGhpcyB0ZXN0cyBwcm9jZXNzaW5nIHdpdGggdW5rbm93biB0eXBlLCB0cmlnZ2VyaW5nIGRlZmF1bHQgYnJhbmNoXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3QgdW5rbm93biB0eXBlIGFuZCBnbyB0byBzdGVwIDJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC11bmtub3duLXR5cGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gUHJvY2VzcyB3aXRoIHVua25vd24gdHlwZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gaGFuZGxlUnVuIHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlbXB0eSBkYXRhc291cmNlX2luZm9fbGlzdCAobm8gdHlwZSBtYXRjaGVkKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUnVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgc3RhcnRfbm9kZV9pZDogJ3Vua25vd24tdHlwZS1ub2RlJyxcbiAgICAgICAgICBkYXRhc291cmNlX3R5cGU6ICd1bmtub3duX3R5cGUnLFxuICAgICAgICAgIGRhdGFzb3VyY2VfaW5mb19saXN0OiBbXSwgLy8gRW1wdHkgYmVjYXVzZSBubyB0eXBlIG1hdGNoZWRcbiAgICAgICAgfSkpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBkYXRhc291cmNlIHN3aXRjaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFJhcGlkbHkgc3dpdGNoIGJldHdlZW4gZGF0YXNvdXJjZXNcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kcml2ZScpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGVuZCB1cCB3aXRoIGxvY2FsIGZpbGUgc2VsZWN0ZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvY2FsLWZpbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzdGVwIG5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAnZmlsZS0xMjMnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiAndGV4dC9wbGFpbicsIHNpemU6IDEwMCwgZXh0ZW5zaW9uOiAndHh0JywgbWltZV90eXBlOiAndGV4dC9wbGFpbicgfSB9LFxuICAgICAgXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IGFuZCBuYXZpZ2F0ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnRuJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgYmUgYmFjayBvbiBzdGVwIDFcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgZmxvdzogc2VsZWN0IGRhdGFzb3VyY2UgLT4gbmV4dCAtPiBwcm9jZXNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXG4gICAgICAgIHsgZmlsZTogeyBpZDogJ2ZpbGUtMTIzJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFN0ZXAgMTogU2VsZWN0IGRhdGFzb3VyY2VcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2NhbC1maWxlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU3RlcCAxOiBDbGljayBuZXh0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb2N1bWVudC1wcm9jZXNzaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU3RlcCAyOiBQcm9jZXNzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcm9jZXNzLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVJ1bikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgZmxvdyB3aXRoIGJhY2sgbmF2aWdhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5sb2NhbEZpbGVMaXN0ID0gW1xuICAgICAgICB7IGZpbGU6IHsgaWQ6ICdmaWxlLTEyMycsIG5hbWU6ICd0ZXN0LnR4dCcsIHR5cGU6ICd0ZXh0L3BsYWluJywgc2l6ZTogMTAwLCBleHRlbnNpb246ICd0eHQnLCBtaW1lX3R5cGU6ICd0ZXh0L3BsYWluJyB9IH0sXG4gICAgICBdXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUub25saW5lRG9jdW1lbnRzID0gW3sgd29ya3NwYWNlX2lkOiAnd3MtMScgfV1cbiAgICAgIHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCBsb2NhbCBmaWxlIGFuZCBnbyB0byBzdGVwIDJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb2N1bWVudC1wcm9jZXNzaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gR28gYmFjayBhbmQgc3dpdGNoIHRvIG9ubGluZSBkb2N1bWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1idG4nKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZG9jdW1lbnQnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29ubGluZS1kb2N1bWVudHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBHbyB0byBzdGVwIDIgYWdhaW5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGJlIG9uIHN0ZXAgMiB3aXRoIG9ubGluZSBkb2N1bWVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZG9jdW1lbnQtcHJvY2Vzc2luZycpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbm9kZS1pZCcsICdvbmxpbmUtZG9jLW5vZGUnKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDYWxsYmFjayBEZXBlbmRlbmNpZXMgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0NhbGxiYWNrIERlcGVuZGVuY2llcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgcmVzZXRBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBuZXh0QnRuRGlzYWJsZWQgdXNlTWVtbyBEZXBlbmRlbmNpZXNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnbmV4dEJ0bkRpc2FibGVkIE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHdoZW4gbG9jYWxGaWxlTGlzdCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBVcGRhdGUgbG9jYWxGaWxlTGlzdFxuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLmxvY2FsRmlsZUxpc3QgPSBbXG4gICAgICAgIHsgZmlsZTogeyBpZDogJ2ZpbGUtMTIzJywgbmFtZTogJ3Rlc3QudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAxMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cbiAgICAgIHJlcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1sb2NhbC1maWxlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vdyBlbmFibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIG9ubGluZURvY3VtZW50cyBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1vbmxpbmUtZG9jdW1lbnQnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbGx5IGRpc2FibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG5cbiAgICAgIC8vIEFjdCAtIFVwZGF0ZSBvbmxpbmVEb2N1bWVudHNcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5vbmxpbmVEb2N1bWVudHMgPSBbeyB3b3Jrc3BhY2VfaWQ6ICd3cy0xJyB9XVxuICAgICAgcmVyZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kb2N1bWVudCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBOb3cgZW5hYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiB3ZWJzaXRlUGFnZXMgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgZGlzYWJsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcblxuICAgICAgLy8gQWN0IC0gVXBkYXRlIHdlYnNpdGVQYWdlc1xuICAgICAgbW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLndlYnNpdGVQYWdlcyA9IFt7IHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nIH1dXG4gICAgICByZXJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtd2Vic2l0ZS1jcmF3bCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBOb3cgZW5hYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBzZWxlY3RlZEZpbGVJZHMgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHJlcGFyYXRpb24gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRyaXZlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBVcGRhdGUgc2VsZWN0ZWRGaWxlSWRzXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUuc2VsZWN0ZWRGaWxlSWRzID0gWydmaWxlLTEnXVxuICAgICAgcmVyZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LW9ubGluZS1kcml2ZScpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBOb3cgZW5hYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gaGFuZGxlUHJvY2VzcyB1c2VDYWxsYmFjayBEZXBlbmRlbmNpZXNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnaGFuZGxlUHJvY2VzcyBDYWxsYmFjayBEZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgbGF0ZXN0IHN0b3JlIHN0YXRlIHdoZW4gcHJvY2Vzc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5sb2NhbEZpbGVMaXN0ID0gW1xuICAgICAgICB7IGZpbGU6IHsgaWQ6ICdpbml0aWFsLWZpbGUnLCBuYW1lOiAnaW5pdGlhbC50eHQnLCB0eXBlOiAndGV4dC9wbGFpbicsIHNpemU6IDEwMCwgZXh0ZW5zaW9uOiAndHh0JywgbWltZV90eXBlOiAndGV4dC9wbGFpbicgfSB9LFxuICAgICAgXVxuICAgICAgcmVuZGVyKDxQcmVwYXJhdGlvbiAvPilcblxuICAgICAgLy8gQWN0IC0gU2VsZWN0IGFuZCBuYXZpZ2F0ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWxvY2FsLWZpbGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gVXBkYXRlIHN0b3JlIGJlZm9yZSBwcm9jZXNzaW5nXG4gICAgICBtb2NrRGF0YVNvdXJjZVN0b3JlU3RhdGUubG9jYWxGaWxlTGlzdCA9IFtcbiAgICAgICAgeyBmaWxlOiB7IGlkOiAndXBkYXRlZC1maWxlJywgbmFtZTogJ3VwZGF0ZWQudHh0JywgdHlwZTogJ3RleHQvcGxhaW4nLCBzaXplOiAyMDAsIGV4dGVuc2lvbjogJ3R4dCcsIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nIH0gfSxcbiAgICAgIF1cblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSBsYXRlc3QgZmlsZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUnVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgZGF0YXNvdXJjZV9pbmZvX2xpc3Q6IGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyByZWxhdGVkX2lkOiAndXBkYXRlZC1maWxlJyB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBjbGVhckRhdGFTb3VyY2VEYXRhIHVzZUNhbGxiYWNrIERlcGVuZGVuY2llc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdjbGVhckRhdGFTb3VyY2VEYXRhIENhbGxiYWNrIERlcGVuZGVuY2llcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgY29ycmVjdCBjbGVhciBmdW5jdGlvbiBiYXNlZCBvbiBkYXRhc291cmNlIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFByZXBhcmF0aW9uIC8+KVxuXG4gICAgICAvLyBBY3QgLSBTZWxlY3Qgb25saW5lIGRvY3VtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3Qtb25saW5lLWRvY3VtZW50JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tEYXRhU291cmNlU3RvcmVTdGF0ZS5zZXRPbmxpbmVEb2N1bWVudHMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBTd2l0Y2ggdG8gd2Vic2l0ZSBjcmF3bFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXdlYnNpdGUtY3Jhd2wnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RhdGFTb3VyY2VTdG9yZVN0YXRlLnNldFdlYnNpdGVQYWdlcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=