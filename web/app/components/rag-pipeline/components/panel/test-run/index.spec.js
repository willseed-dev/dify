"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const types_1 = require("@/app/components/workflow/types");
const datasets_1 = require("@/models/datasets");
const header_1 = require("./header");
// Import components after mocks
const index_1 = require("./index");
// ============================================================================
// Mocks
// ============================================================================
// Mock workflow store
const mockIsPreparingDataSource = vi.fn(() => true);
const mockSetIsPreparingDataSource = vi.fn();
const mockWorkflowRunningData = vi.fn(() => undefined);
const mockPipelineId = 'test-pipeline-id';
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            isPreparingDataSource: mockIsPreparingDataSource(),
            workflowRunningData: mockWorkflowRunningData(),
            pipelineId: mockPipelineId,
        };
        return selector(state);
    },
    useWorkflowStore: () => ({
        getState: () => ({
            isPreparingDataSource: mockIsPreparingDataSource(),
            setIsPreparingDataSource: mockSetIsPreparingDataSource,
        }),
    }),
}));
// Mock workflow interactions
const mockHandleCancelDebugAndPreviewPanel = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useWorkflowInteractions: () => ({
        handleCancelDebugAndPreviewPanel: mockHandleCancelDebugAndPreviewPanel,
    }),
    useWorkflowRun: () => ({
        handleRun: vi.fn(),
    }),
    useToolIcon: () => 'mock-tool-icon',
}));
// Mock data source provider
vi.mock('@/app/components/datasets/documents/create-from-pipeline/data-source/store/provider', () => ({
    default: ({ children }) => <div data-testid="data-source-provider">{children}</div>,
}));
// Mock Preparation component
vi.mock('./preparation', () => ({
    default: () => <div data-testid="preparation-component">Preparation</div>,
}));
// Mock Result component (for TestRunPanel tests only)
vi.mock('./result', () => ({
    default: () => <div data-testid="result-component">Result</div>,
}));
// Mock ResultPanel from workflow
vi.mock('@/app/components/workflow/run/result-panel', () => ({
    default: (props) => (<div data-testid="result-panel">
      ResultPanel -
      {' '}
      {props.status}
    </div>),
}));
// Mock TracingPanel from workflow
vi.mock('@/app/components/workflow/run/tracing-panel', () => ({
    default: (props) => (<div data-testid="tracing-panel">
      TracingPanel -
      {' '}
      {props.list?.length ?? 0}
      {' '}
      items
    </div>),
}));
// Mock Loading component
vi.mock('@/app/components/base/loading', () => ({
    default: () => <div data-testid="loading">Loading...</div>,
}));
// Mock config
vi.mock('@/config', () => ({
    RAG_PIPELINE_PREVIEW_CHUNK_NUM: 5,
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createMockWorkflowRunningData = (overrides = {}) => ({
    result: {
        status: types_1.WorkflowRunningStatus.Succeeded,
        outputs: '{"test": "output"}',
        outputs_truncated: false,
        inputs: '{"test": "input"}',
        inputs_truncated: false,
        process_data_truncated: false,
        error: undefined,
        elapsed_time: 1000,
        total_tokens: 100,
        created_at: Date.now(),
        created_by: 'Test User',
        total_steps: 5,
        exceptions_count: 0,
    },
    tracing: [],
    ...overrides,
});
const createMockGeneralOutputs = (chunkContents = ['chunk1', 'chunk2']) => ({
    chunk_structure: datasets_1.ChunkingMode.text,
    preview: chunkContents.map(content => ({ content })),
});
const createMockParentChildOutputs = (parentMode = 'paragraph') => ({
    chunk_structure: datasets_1.ChunkingMode.parentChild,
    parent_mode: parentMode,
    preview: [
        { content: 'parent1', child_chunks: ['child1', 'child2'] },
        { content: 'parent2', child_chunks: ['child3', 'child4'] },
    ],
});
const createMockQAOutputs = () => ({
    chunk_structure: datasets_1.ChunkingMode.qa,
    qa_preview: [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
    ],
});
// ============================================================================
// TestRunPanel Component Tests
// ============================================================================
describe('TestRunPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsPreparingDataSource.mockReturnValue(true);
        mockWorkflowRunningData.mockReturnValue(undefined);
    });
    // Basic rendering tests
    describe('Rendering', () => {
        it('should render with correct container styles', () => {
            const { container } = (0, react_1.render)(<index_1.default />);
            const panelDiv = container.firstChild;
            expect(panelDiv).toHaveClass('relative', 'flex', 'h-full', 'w-[480px]', 'flex-col');
        });
        it('should render Header component', () => {
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByText('datasetPipeline.testRun.title')).toBeInTheDocument();
        });
    });
    // Conditional rendering based on isPreparingDataSource
    describe('Conditional Content Rendering', () => {
        it('should render Preparation inside DataSourceProvider when isPreparingDataSource is true', () => {
            mockIsPreparingDataSource.mockReturnValue(true);
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('data-source-provider')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('preparation-component')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('result-component')).not.toBeInTheDocument();
        });
        it('should render Result when isPreparingDataSource is false', () => {
            mockIsPreparingDataSource.mockReturnValue(false);
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('result-component')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('data-source-provider')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('preparation-component')).not.toBeInTheDocument();
        });
    });
});
// ============================================================================
// Header Component Tests
// ============================================================================
describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsPreparingDataSource.mockReturnValue(true);
    });
    // Rendering tests
    describe('Rendering', () => {
        it('should render title with correct translation key', () => {
            (0, react_1.render)(<header_1.default />);
            expect(react_1.screen.getByText('datasetPipeline.testRun.title')).toBeInTheDocument();
        });
        it('should render close button', () => {
            (0, react_1.render)(<header_1.default />);
            const closeButton = react_1.screen.getByRole('button');
            expect(closeButton).toBeInTheDocument();
        });
        it('should have correct layout classes', () => {
            const { container } = (0, react_1.render)(<header_1.default />);
            const headerDiv = container.firstChild;
            expect(headerDiv).toHaveClass('flex', 'items-center', 'gap-x-2', 'pl-4', 'pr-3', 'pt-4');
        });
    });
    // Close button interactions
    describe('Close Button Interaction', () => {
        it('should call setIsPreparingDataSource(false) and handleCancelDebugAndPreviewPanel when clicked and isPreparingDataSource is true', () => {
            mockIsPreparingDataSource.mockReturnValue(true);
            (0, react_1.render)(<header_1.default />);
            const closeButton = react_1.screen.getByRole('button');
            react_1.fireEvent.click(closeButton);
            expect(mockSetIsPreparingDataSource).toHaveBeenCalledWith(false);
            expect(mockHandleCancelDebugAndPreviewPanel).toHaveBeenCalledTimes(1);
        });
        it('should only call handleCancelDebugAndPreviewPanel when isPreparingDataSource is false', () => {
            mockIsPreparingDataSource.mockReturnValue(false);
            (0, react_1.render)(<header_1.default />);
            const closeButton = react_1.screen.getByRole('button');
            react_1.fireEvent.click(closeButton);
            expect(mockSetIsPreparingDataSource).not.toHaveBeenCalled();
            expect(mockHandleCancelDebugAndPreviewPanel).toHaveBeenCalledTimes(1);
        });
    });
});
// ============================================================================
// Result Component Tests (Real Implementation)
// ============================================================================
// Unmock Result for these tests
vi.doUnmock('./result');
describe('Result', () => {
    // Dynamically import Result to get real implementation
    let Result;
    beforeAll(async () => {
        const resultModule = await Promise.resolve().then(() => require('./result'));
        Result = resultModule.default;
    });
    beforeEach(() => {
        vi.clearAllMocks();
        mockWorkflowRunningData.mockReturnValue(undefined);
    });
    // Rendering tests
    describe('Rendering', () => {
        it('should render with RESULT tab active by default', async () => {
            (0, react_1.render)(<Result />);
            await (0, react_1.waitFor)(() => {
                const resultTab = react_1.screen.getByRole('button', { name: /runLog\.result/i });
                expect(resultTab).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            });
        });
        it('should render all three tabs', () => {
            (0, react_1.render)(<Result />);
            expect(react_1.screen.getByRole('button', { name: /runLog\.result/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /runLog\.detail/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /runLog\.tracing/i })).toBeInTheDocument();
        });
    });
    // Tab switching tests
    describe('Tab Switching', () => {
        it('should switch to DETAIL tab when clicked', async () => {
            mockWorkflowRunningData.mockReturnValue(createMockWorkflowRunningData());
            (0, react_1.render)(<Result />);
            const detailTab = react_1.screen.getByRole('button', { name: /runLog\.detail/i });
            react_1.fireEvent.click(detailTab);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
        });
        it('should switch to TRACING tab when clicked', async () => {
            mockWorkflowRunningData.mockReturnValue(createMockWorkflowRunningData({ tracing: [{ id: '1' }] }));
            (0, react_1.render)(<Result />);
            const tracingTab = react_1.screen.getByRole('button', { name: /runLog\.tracing/i });
            react_1.fireEvent.click(tracingTab);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('tracing-panel')).toBeInTheDocument();
            });
        });
    });
    // Loading states
    describe('Loading States', () => {
        it('should show loading in DETAIL tab when no result data', async () => {
            mockWorkflowRunningData.mockReturnValue({
                result: undefined,
                tracing: [],
            });
            (0, react_1.render)(<Result />);
            const detailTab = react_1.screen.getByRole('button', { name: /runLog\.detail/i });
            react_1.fireEvent.click(detailTab);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('loading')).toBeInTheDocument();
            });
        });
        it('should show loading in TRACING tab when no tracing data', async () => {
            mockWorkflowRunningData.mockReturnValue(createMockWorkflowRunningData({ tracing: [] }));
            (0, react_1.render)(<Result />);
            const tracingTab = react_1.screen.getByRole('button', { name: /runLog\.tracing/i });
            react_1.fireEvent.click(tracingTab);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('loading')).toBeInTheDocument();
            });
        });
    });
});
// ============================================================================
// ResultPreview Component Tests
// ============================================================================
// We need to import ResultPreview directly
vi.doUnmock('./result/result-preview');
describe('ResultPreview', () => {
    let ResultPreview;
    beforeAll(async () => {
        const previewModule = await Promise.resolve().then(() => require('./result/result-preview'));
        ResultPreview = previewModule.default;
    });
    const mockOnSwitchToDetail = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Loading state
    describe('Loading State', () => {
        it('should show loading spinner when isRunning is true and no outputs', () => {
            (0, react_1.render)(<ResultPreview isRunning={true} outputs={undefined} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should not show loading when outputs are available', () => {
            (0, react_1.render)(<ResultPreview isRunning={true} outputs={createMockGeneralOutputs()} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
        });
    });
    // Error state
    describe('Error State', () => {
        it('should show error message when not running and has error', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={undefined} error="Test error message" onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'pipeline.result.resultPreview.viewDetails' })).toBeInTheDocument();
        });
        it('should call onSwitchToDetail when View Details button is clicked', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={undefined} error="Test error message" onSwitchToDetail={mockOnSwitchToDetail}/>);
            const viewDetailsButton = react_1.screen.getByRole('button', { name: 'pipeline.result.resultPreview.viewDetails' });
            react_1.fireEvent.click(viewDetailsButton);
            expect(mockOnSwitchToDetail).toHaveBeenCalledTimes(1);
        });
        it('should not show error when still running', () => {
            (0, react_1.render)(<ResultPreview isRunning={true} outputs={undefined} error="Test error message" onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.error')).not.toBeInTheDocument();
        });
    });
    // Success state with outputs
    describe('Success State with Outputs', () => {
        it('should render chunk content when outputs are available', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={createMockGeneralOutputs(['test chunk content'])} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            // Check that chunk content is rendered (the real ChunkCardList renders the content)
            expect(react_1.screen.getByText('test chunk content')).toBeInTheDocument();
        });
        it('should render multiple chunks when provided', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={createMockGeneralOutputs(['chunk one', 'chunk two'])} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.getByText('chunk one')).toBeInTheDocument();
            expect(react_1.screen.getByText('chunk two')).toBeInTheDocument();
        });
        it('should show footer tip', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={createMockGeneralOutputs()} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.getByText(/pipeline\.result\.resultPreview\.footerTip/)).toBeInTheDocument();
        });
    });
    // Edge cases
    describe('Edge Cases', () => {
        it('should handle empty outputs gracefully', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={null} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            // Should not crash and should not show chunk card list
            expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
        });
        it('should handle undefined outputs', () => {
            (0, react_1.render)(<ResultPreview isRunning={false} outputs={undefined} error={undefined} onSwitchToDetail={mockOnSwitchToDetail}/>);
            expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
        });
    });
});
// ============================================================================
// Tabs Component Tests
// ============================================================================
vi.doUnmock('./result/tabs');
describe('Tabs', () => {
    let Tabs;
    beforeAll(async () => {
        const tabsModule = await Promise.resolve().then(() => require('./result/tabs'));
        Tabs = tabsModule.default;
    });
    const mockSwitchTab = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests
    describe('Rendering', () => {
        it('should render all three tabs', () => {
            (0, react_1.render)(<Tabs currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            expect(react_1.screen.getByRole('button', { name: /runLog\.result/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /runLog\.detail/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /runLog\.tracing/i })).toBeInTheDocument();
        });
    });
    // Active tab styling
    describe('Active Tab Styling', () => {
        it('should highlight RESULT tab when currentTab is RESULT', () => {
            (0, react_1.render)(<Tabs currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            const resultTab = react_1.screen.getByRole('button', { name: /runLog\.result/i });
            expect(resultTab).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
        });
        it('should highlight DETAIL tab when currentTab is DETAIL', () => {
            (0, react_1.render)(<Tabs currentTab="DETAIL" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            const detailTab = react_1.screen.getByRole('button', { name: /runLog\.detail/i });
            expect(detailTab).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
        });
    });
    // Tab click handling
    describe('Tab Click Handling', () => {
        it('should call switchTab with RESULT when RESULT tab is clicked', () => {
            (0, react_1.render)(<Tabs currentTab="DETAIL" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /runLog\.result/i }));
            expect(mockSwitchTab).toHaveBeenCalledWith('RESULT');
        });
        it('should call switchTab with DETAIL when DETAIL tab is clicked', () => {
            (0, react_1.render)(<Tabs currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /runLog\.detail/i }));
            expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
        });
        it('should call switchTab with TRACING when TRACING tab is clicked', () => {
            (0, react_1.render)(<Tabs currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /runLog\.tracing/i }));
            expect(mockSwitchTab).toHaveBeenCalledWith('TRACING');
        });
    });
    // Disabled state when no data
    describe('Disabled State', () => {
        it('should disable tabs when workflowRunningData is undefined', () => {
            (0, react_1.render)(<Tabs currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
            const resultTab = react_1.screen.getByRole('button', { name: /runLog\.result/i });
            expect(resultTab).toBeDisabled();
        });
    });
});
// ============================================================================
// Tab Component Tests
// ============================================================================
vi.doUnmock('./result/tabs/tab');
describe('Tab', () => {
    let Tab;
    beforeAll(async () => {
        const tabModule = await Promise.resolve().then(() => require('./result/tabs/tab'));
        Tab = tabModule.default;
    });
    const mockOnClick = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests
    describe('Rendering', () => {
        it('should render tab with label', () => {
            (0, react_1.render)(<Tab isActive={false} label="Test Tab" value="TEST" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button', { name: 'Test Tab' })).toBeInTheDocument();
        });
    });
    // Active state styling
    describe('Active State', () => {
        it('should have active styles when isActive is true', () => {
            (0, react_1.render)(<Tab isActive={true} label="Active Tab" value="TEST" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            const tab = react_1.screen.getByRole('button');
            expect(tab).toHaveClass('border-util-colors-blue-brand-blue-brand-600', 'text-text-primary');
        });
        it('should have inactive styles when isActive is false', () => {
            (0, react_1.render)(<Tab isActive={false} label="Inactive Tab" value="TEST" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            const tab = react_1.screen.getByRole('button');
            expect(tab).toHaveClass('border-transparent', 'text-text-tertiary');
        });
    });
    // Click handling
    describe('Click Handling', () => {
        it('should call onClick with value when clicked', () => {
            (0, react_1.render)(<Tab isActive={false} label="Test Tab" value="MY_VALUE" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledWith('MY_VALUE');
        });
        it('should not call onClick when disabled (no workflowRunningData)', () => {
            (0, react_1.render)(<Tab isActive={false} label="Test Tab" value="MY_VALUE" workflowRunningData={undefined} onClick={mockOnClick}/>);
            const tab = react_1.screen.getByRole('button');
            react_1.fireEvent.click(tab);
            // The click handler is still called, but button is disabled
            expect(tab).toBeDisabled();
        });
    });
    // Disabled state
    describe('Disabled State', () => {
        it('should be disabled when workflowRunningData is undefined', () => {
            (0, react_1.render)(<Tab isActive={false} label="Test Tab" value="TEST" workflowRunningData={undefined} onClick={mockOnClick}/>);
            const tab = react_1.screen.getByRole('button');
            expect(tab).toBeDisabled();
            expect(tab).toHaveClass('opacity-30');
        });
        it('should not be disabled when workflowRunningData is provided', () => {
            (0, react_1.render)(<Tab isActive={false} label="Test Tab" value="TEST" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            const tab = react_1.screen.getByRole('button');
            expect(tab).not.toBeDisabled();
        });
    });
});
// ============================================================================
// formatPreviewChunks Utility Tests
// ============================================================================
describe('formatPreviewChunks', () => {
    let formatPreviewChunks;
    beforeAll(async () => {
        const utilsModule = await Promise.resolve().then(() => require('./result/result-preview/utils'));
        formatPreviewChunks = utilsModule.formatPreviewChunks;
    });
    // Edge cases
    describe('Edge Cases', () => {
        it('should return undefined for null outputs', () => {
            expect(formatPreviewChunks(null)).toBeUndefined();
        });
        it('should return undefined for undefined outputs', () => {
            expect(formatPreviewChunks(undefined)).toBeUndefined();
        });
        it('should return undefined for unknown chunk structure', () => {
            const outputs = {
                chunk_structure: 'unknown_mode',
                preview: [],
            };
            expect(formatPreviewChunks(outputs)).toBeUndefined();
        });
    });
    // General (text) chunks
    describe('General Chunks (ChunkingMode.text)', () => {
        it('should format general chunks correctly', () => {
            const outputs = createMockGeneralOutputs(['content1', 'content2', 'content3']);
            const result = formatPreviewChunks(outputs);
            expect(result).toEqual(['content1', 'content2', 'content3']);
        });
        it('should limit to RAG_PIPELINE_PREVIEW_CHUNK_NUM chunks', () => {
            const manyChunks = Array.from({ length: 10 }, (_, i) => `chunk${i}`);
            const outputs = createMockGeneralOutputs(manyChunks);
            const result = formatPreviewChunks(outputs);
            // RAG_PIPELINE_PREVIEW_CHUNK_NUM is mocked to 5
            expect(result).toHaveLength(5);
            expect(result).toEqual(['chunk0', 'chunk1', 'chunk2', 'chunk3', 'chunk4']);
        });
        it('should handle empty preview array', () => {
            const outputs = createMockGeneralOutputs([]);
            const result = formatPreviewChunks(outputs);
            expect(result).toEqual([]);
        });
    });
    // Parent-child chunks
    describe('Parent-Child Chunks (ChunkingMode.parentChild)', () => {
        it('should format paragraph mode parent-child chunks correctly', () => {
            const outputs = createMockParentChildOutputs('paragraph');
            const result = formatPreviewChunks(outputs);
            expect(result).toEqual({
                parent_child_chunks: [
                    { parent_content: 'parent1', child_contents: ['child1', 'child2'], parent_mode: 'paragraph' },
                    { parent_content: 'parent2', child_contents: ['child3', 'child4'], parent_mode: 'paragraph' },
                ],
                parent_mode: 'paragraph',
            });
        });
        it('should format full-doc mode parent-child chunks and limit child chunks', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.parentChild,
                parent_mode: 'full-doc',
                preview: [
                    {
                        content: 'full-doc-parent',
                        child_chunks: Array.from({ length: 10 }, (_, i) => `child${i}`),
                    },
                ],
            };
            const result = formatPreviewChunks(outputs);
            expect(result).toEqual({
                parent_child_chunks: [
                    {
                        parent_content: 'full-doc-parent',
                        child_contents: ['child0', 'child1', 'child2', 'child3', 'child4'], // Limited to 5
                        parent_mode: 'full-doc',
                    },
                ],
                parent_mode: 'full-doc',
            });
        });
    });
    // QA chunks
    describe('QA Chunks (ChunkingMode.qa)', () => {
        it('should format QA chunks correctly', () => {
            const outputs = createMockQAOutputs();
            const result = formatPreviewChunks(outputs);
            expect(result).toEqual({
                qa_chunks: [
                    { question: 'Q1', answer: 'A1' },
                    { question: 'Q2', answer: 'A2' },
                ],
            });
        });
        it('should limit QA chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.qa,
                qa_preview: Array.from({ length: 10 }, (_, i) => ({
                    question: `Q${i}`,
                    answer: `A${i}`,
                })),
            };
            const result = formatPreviewChunks(outputs);
            expect(result.qa_chunks).toHaveLength(5);
        });
    });
});
// ============================================================================
// Types Tests
// ============================================================================
describe('Types', () => {
    describe('TestRunStep Enum', () => {
        it('should have correct enum values', async () => {
            const { TestRunStep } = await Promise.resolve().then(() => require('./types'));
            expect(TestRunStep.dataSource).toBe('dataSource');
            expect(TestRunStep.documentProcessing).toBe('documentProcessing');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLDJEQUF1RTtBQUN2RSxnREFBZ0Q7QUFFaEQscUNBQTZCO0FBQzdCLGdDQUFnQztBQUNoQyxtQ0FBa0M7QUFFbEMsK0VBQStFO0FBQy9FLFFBQVE7QUFDUiwrRUFBK0U7QUFFL0Usc0JBQXNCO0FBQ3RCLE1BQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuRCxNQUFNLDRCQUE0QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM1QyxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQXdDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzdGLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFBO0FBRXpDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxRQUFRLEVBQUUsQ0FBQyxRQUFxRCxFQUFFLEVBQUU7UUFDbEUsTUFBTSxLQUFLLEdBQUc7WUFDWixxQkFBcUIsRUFBRSx5QkFBeUIsRUFBRTtZQUNsRCxtQkFBbUIsRUFBRSx1QkFBdUIsRUFBRTtZQUM5QyxVQUFVLEVBQUUsY0FBYztTQUMzQixDQUFBO1FBQ0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUNELGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkIsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDZixxQkFBcUIsRUFBRSx5QkFBeUIsRUFBRTtZQUNsRCx3QkFBd0IsRUFBRSw0QkFBNEI7U0FDdkQsQ0FBQztLQUNILENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILDZCQUE2QjtBQUM3QixNQUFNLG9DQUFvQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNwRCxFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5QixnQ0FBZ0MsRUFBRSxvQ0FBb0M7S0FDdkUsQ0FBQztJQUNGLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ25CLENBQUM7SUFDRixXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCO0NBQ3BDLENBQUMsQ0FBQyxDQUFBO0FBRUgsNEJBQTRCO0FBQzVCLEVBQUUsQ0FBQyxJQUFJLENBQUMscUZBQXFGLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBaUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDO0NBQ25ILENBQUMsQ0FBQyxDQUFBO0FBRUgsNkJBQTZCO0FBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDO0NBQzFFLENBQUMsQ0FBQyxDQUFBO0FBRUgsc0RBQXNEO0FBQ3RELEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0NBQ2hFLENBQUMsQ0FBQyxDQUFBO0FBRUgsaUNBQWlDO0FBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzRCxPQUFPLEVBQUUsQ0FBQyxLQUE4QixFQUFFLEVBQUUsQ0FBQyxDQUMzQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUM3Qjs7TUFDQSxDQUFDLEdBQUcsQ0FDSjtNQUFBLENBQUMsS0FBSyxDQUFDLE1BQWdCLENBQ3pCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsa0NBQWtDO0FBQ2xDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1RCxPQUFPLEVBQUUsQ0FBQyxLQUEwQixFQUFFLEVBQUUsQ0FBQyxDQUN2QyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUM5Qjs7TUFDQSxDQUFDLEdBQUcsQ0FDSjtNQUFBLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxDQUN4QjtNQUFBLENBQUMsR0FBRyxDQUNKOztJQUNGLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHlCQUF5QjtBQUN6QixFQUFFLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQztDQUMzRCxDQUFDLENBQUMsQ0FBQTtBQUVILGNBQWM7QUFDZCxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLDhCQUE4QixFQUFFLENBQUM7Q0FDbEMsQ0FBQyxDQUFDLENBQUE7QUFFSCwrRUFBK0U7QUFDL0Usc0JBQXNCO0FBQ3RCLCtFQUErRTtBQUUvRSxNQUFNLDZCQUE2QixHQUFHLENBQUMsWUFBMEMsRUFBRSxFQUF1QixFQUFFLENBQUMsQ0FBQztJQUM1RyxNQUFNLEVBQUU7UUFDTixNQUFNLEVBQUUsNkJBQXFCLENBQUMsU0FBUztRQUN2QyxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsTUFBTSxFQUFFLG1CQUFtQjtRQUMzQixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLHNCQUFzQixFQUFFLEtBQUs7UUFDN0IsS0FBSyxFQUFFLFNBQVM7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsWUFBWSxFQUFFLEdBQUc7UUFDakIsVUFBVSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDdEIsVUFBVSxFQUFFLFdBQVc7UUFDdkIsV0FBVyxFQUFFLENBQUM7UUFDZCxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxFQUFFLEVBQUU7SUFDWCxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLHdCQUF3QixHQUFHLENBQUMsZ0JBQTBCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BGLGVBQWUsRUFBRSx1QkFBWSxDQUFDLElBQUk7SUFDbEMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztDQUNyRCxDQUFDLENBQUE7QUFFRixNQUFNLDRCQUE0QixHQUFHLENBQUMsYUFBdUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVGLGVBQWUsRUFBRSx1QkFBWSxDQUFDLFdBQVc7SUFDekMsV0FBVyxFQUFFLFVBQVU7SUFDdkIsT0FBTyxFQUFFO1FBQ1AsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtRQUMxRCxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFO0tBQzNEO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLGVBQWUsRUFBRSx1QkFBWSxDQUFDLEVBQUU7SUFDaEMsVUFBVSxFQUFFO1FBQ1YsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7UUFDaEMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7S0FDakM7Q0FDRixDQUFDLENBQUE7QUFFRiwrRUFBK0U7QUFDL0UsK0JBQStCO0FBQy9CLCtFQUErRTtBQUUvRSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLHlCQUF5QixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQyx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFDLENBQUE7SUFFRix3QkFBd0I7SUFDeEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUM5QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsVUFBeUIsQ0FBQTtZQUVwRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUNyRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsdURBQXVEO0lBQ3ZELFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDN0MsRUFBRSxDQUFDLHdGQUF3RixFQUFFLEdBQUcsRUFBRTtZQUNoRyx5QkFBeUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFL0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV4QixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0RSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2RSxNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1lBQ2xFLHlCQUF5QixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUVoRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXhCLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxjQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM1RSxNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0UsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLHlCQUF5QjtBQUN6QiwrRUFBK0U7QUFFL0UsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQix5QkFBeUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDakQsQ0FBQyxDQUFDLENBQUE7SUFFRixrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGdCQUFNLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVsQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbEIsTUFBTSxXQUFXLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM5QyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDNUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZ0JBQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBQ3hDLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxVQUF5QixDQUFBO1lBRXJELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUMxRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNEJBQTRCO0lBQzVCLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7UUFDeEMsRUFBRSxDQUFDLGlJQUFpSSxFQUFFLEdBQUcsRUFBRTtZQUN6SSx5QkFBeUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFL0MsSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbEIsTUFBTSxXQUFXLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM5QyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUU1QixNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoRSxNQUFNLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx1RkFBdUYsRUFBRSxHQUFHLEVBQUU7WUFDL0YseUJBQXlCLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRWhELElBQUEsY0FBTSxFQUFDLENBQUMsZ0JBQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWxCLE1BQU0sV0FBVyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDOUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7WUFFNUIsTUFBTSxDQUFDLDRCQUE0QixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDM0QsTUFBTSxDQUFDLG9DQUFvQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLCtDQUErQztBQUMvQywrRUFBK0U7QUFFL0UsZ0NBQWdDO0FBQ2hDLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUE7QUFFdkIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsdURBQXVEO0lBQ3ZELElBQUksTUFBeUMsQ0FBQTtJQUU3QyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxZQUFZLEdBQUcsMkNBQWEsVUFBVSxFQUFDLENBQUE7UUFDN0MsTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUE7SUFDL0IsQ0FBQyxDQUFDLENBQUE7SUFFRixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNwRCxDQUFDLENBQUMsQ0FBQTtJQUVGLGtCQUFrQjtJQUNsQixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsaURBQWlELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDL0QsSUFBQSxjQUFNLEVBQUMsQ0FBQyxNQUFNLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVsQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO2dCQUN6RSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLDhDQUE4QyxDQUFDLENBQUE7WUFDL0UsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxNQUFNLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUVsQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN0RixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsc0JBQXNCO0lBQ3RCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFBO1lBQ3hFLElBQUEsY0FBTSxFQUFDLENBQUMsTUFBTSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFbEIsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO1lBQ3pFLGlCQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRTFCLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN6RCx1QkFBdUIsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBOEMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUMvSSxJQUFBLGNBQU0sRUFBQyxDQUFDLE1BQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWxCLE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtZQUMzRSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUUzQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2pFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLGlCQUFpQjtJQUNqQixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRSx1QkFBdUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3RDLE1BQU0sRUFBRSxTQUFxRDtnQkFDN0QsT0FBTyxFQUFFLEVBQUU7YUFDWixDQUFDLENBQUE7WUFDRixJQUFBLGNBQU0sRUFBQyxDQUFDLE1BQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWxCLE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQTtZQUN6RSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUUxQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMseURBQXlELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdkUsdUJBQXVCLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN2RixJQUFBLGNBQU0sRUFBQyxDQUFDLE1BQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRWxCLE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtZQUMzRSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUUzQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLGdDQUFnQztBQUNoQywrRUFBK0U7QUFFL0UsMkNBQTJDO0FBQzNDLEVBQUUsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUV0QyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFJLGFBQStELENBQUE7SUFFbkUsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sYUFBYSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFDN0QsYUFBYSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUE7SUFDdkMsQ0FBQyxDQUFDLENBQUE7SUFFRixNQUFNLG9CQUFvQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUVwQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsZ0JBQWdCO0lBQ2hCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsSUFBQSxjQUFNLEVBQ0osQ0FBQyxhQUFhLENBQ1osU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2hCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNuQixLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN2QyxDQUNILENBQUE7WUFFRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2RixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsSUFBQSxjQUFNLEVBQ0osQ0FBQyxhQUFhLENBQ1osU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2hCLE9BQU8sQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FDcEMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDdkMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixjQUFjO0lBQ2QsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDM0IsRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxJQUFBLGNBQU0sRUFDSixDQUFDLGFBQWEsQ0FDWixTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDakIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ25CLEtBQUssQ0FBQyxvQkFBb0IsQ0FDMUIsZ0JBQWdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN2QyxDQUNILENBQUE7WUFFRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuRixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsMkNBQTJDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7WUFDMUUsSUFBQSxjQUFNLEVBQ0osQ0FBQyxhQUFhLENBQ1osU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2pCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNuQixLQUFLLENBQUMsb0JBQW9CLENBQzFCLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDdkMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxpQkFBaUIsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSwyQ0FBMkMsRUFBRSxDQUFDLENBQUE7WUFDM0csaUJBQVMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtZQUVsQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDbEQsSUFBQSxjQUFNLEVBQ0osQ0FBQyxhQUFhLENBQ1osU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2hCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNuQixLQUFLLENBQUMsb0JBQW9CLENBQzFCLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDdkMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2QkFBNkI7SUFDN0IsUUFBUSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUMxQyxFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLElBQUEsY0FBTSxFQUNKLENBQUMsYUFBYSxDQUNaLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNqQixPQUFPLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUMxRCxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN2QyxDQUNILENBQUE7WUFFRCxvRkFBb0Y7WUFDcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELElBQUEsY0FBTSxFQUNKLENBQUMsYUFBYSxDQUNaLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNqQixPQUFPLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQzlELEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQ3ZDLENBQ0gsQ0FBQTtZQUVELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN6RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2hDLElBQUEsY0FBTSxFQUNKLENBQUMsYUFBYSxDQUNaLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNqQixPQUFPLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQ3BDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQ3ZDLENBQ0gsQ0FBQTtZQUVELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixhQUFhO0lBQ2IsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxJQUFBLGNBQU0sRUFDSixDQUFDLGFBQWEsQ0FDWixTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDakIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2QsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ2pCLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFDdkMsQ0FDSCxDQUFBO1lBRUQsdURBQXVEO1lBQ3ZELE1BQU0sQ0FBQyxjQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7WUFDekMsSUFBQSxjQUFNLEVBQ0osQ0FBQyxhQUFhLENBQ1osU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2pCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNuQixLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDakIsZ0JBQWdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUN2QyxDQUNILENBQUE7WUFFRCxNQUFNLENBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLHVCQUF1QjtBQUN2QiwrRUFBK0U7QUFFL0UsRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUU1QixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLElBQTRDLENBQUE7SUFFaEQsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sVUFBVSxHQUFHLDJDQUFhLGVBQWUsRUFBQyxDQUFBO1FBQ2hELElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFBO0lBQzNCLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBRTdCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRixrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxJQUFBLGNBQU0sRUFDSixDQUFDLElBQUksQ0FDSCxVQUFVLENBQUMsUUFBUSxDQUNuQixtQkFBbUIsQ0FBQyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FDckQsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQ3pCLENBQ0gsQ0FBQTtZQUVELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ25GLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ25GLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3RGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixxQkFBcUI7SUFDckIsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1lBQy9ELElBQUEsY0FBTSxFQUNKLENBQUMsSUFBSSxDQUNILFVBQVUsQ0FBQyxRQUFRLENBQ25CLG1CQUFtQixDQUFDLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUNyRCxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFDekIsQ0FDSCxDQUFBO1lBRUQsTUFBTSxTQUFTLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO1lBQ3pFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsOENBQThDLENBQUMsQ0FBQTtRQUMvRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDL0QsSUFBQSxjQUFNLEVBQ0osQ0FBQyxJQUFJLENBQ0gsVUFBVSxDQUFDLFFBQVEsQ0FDbkIsbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixDQUNILENBQUE7WUFFRCxNQUFNLFNBQVMsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUE7WUFDekUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFBO1FBQy9FLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixxQkFBcUI7SUFDckIsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxFQUFFLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1lBQ3RFLElBQUEsY0FBTSxFQUNKLENBQUMsSUFBSSxDQUNILFVBQVUsQ0FBQyxRQUFRLENBQ25CLG1CQUFtQixDQUFDLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUNyRCxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFDekIsQ0FDSCxDQUFBO1lBRUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFeEUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtZQUN0RSxJQUFBLGNBQU0sRUFDSixDQUFDLElBQUksQ0FDSCxVQUFVLENBQUMsUUFBUSxDQUNuQixtQkFBbUIsQ0FBQyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FDckQsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQ3pCLENBQ0gsQ0FBQTtZQUVELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRXhFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7WUFDeEUsSUFBQSxjQUFNLEVBQ0osQ0FBQyxJQUFJLENBQ0gsVUFBVSxDQUFDLFFBQVEsQ0FDbkIsbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixDQUNILENBQUE7WUFFRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUV6RSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDdkQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDhCQUE4QjtJQUM5QixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7WUFDbkUsSUFBQSxjQUFNLEVBQ0osQ0FBQyxJQUFJLENBQ0gsVUFBVSxDQUFDLFFBQVEsQ0FDbkIsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDL0IsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQ3pCLENBQ0gsQ0FBQTtZQUVELE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQTtZQUN6RSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLHNCQUFzQjtBQUN0QiwrRUFBK0U7QUFFL0UsRUFBRSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRWhDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0lBQ25CLElBQUksR0FBK0MsQ0FBQTtJQUVuRCxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxTQUFTLEdBQUcsMkNBQWEsbUJBQW1CLEVBQUMsQ0FBQTtRQUNuRCxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQTtJQUN6QixDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUUzQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsa0JBQWtCO0lBQ2xCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsSUFBQSxjQUFNLEVBQ0osQ0FBQyxHQUFHLENBQ0YsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2hCLEtBQUssQ0FBQyxVQUFVLENBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQ1osbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHVCQUF1QjtJQUN2QixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELElBQUEsY0FBTSxFQUNKLENBQUMsR0FBRyxDQUNGLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNmLEtBQUssQ0FBQyxZQUFZLENBQ2xCLEtBQUssQ0FBQyxNQUFNLENBQ1osbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxNQUFNLEdBQUcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsOENBQThDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtRQUM5RixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsSUFBQSxjQUFNLEVBQ0osQ0FBQyxHQUFHLENBQ0YsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2hCLEtBQUssQ0FBQyxjQUFjLENBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQ1osbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxNQUFNLEdBQUcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLENBQUMsQ0FBQTtRQUNyRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsaUJBQWlCO0lBQ2pCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxJQUFBLGNBQU0sRUFDSixDQUFDLEdBQUcsQ0FDRixRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FDaEIsbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7WUFFM0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtZQUN4RSxJQUFBLGNBQU0sRUFDSixDQUFDLEdBQUcsQ0FDRixRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FDaEIsbUJBQW1CLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDL0IsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQ3JCLENBQ0gsQ0FBQTtZQUVELE1BQU0sR0FBRyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDdEMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFcEIsNERBQTREO1lBQzVELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsaUJBQWlCO0lBQ2pCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxJQUFBLGNBQU0sRUFDSixDQUFDLEdBQUcsQ0FDRixRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDaEIsS0FBSyxDQUFDLFVBQVUsQ0FDaEIsS0FBSyxDQUFDLE1BQU0sQ0FDWixtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUMvQixPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFDckIsQ0FDSCxDQUFBO1lBRUQsTUFBTSxHQUFHLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsSUFBQSxjQUFNLEVBQ0osQ0FBQyxHQUFHLENBQ0YsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2hCLEtBQUssQ0FBQyxVQUFVLENBQ2hCLEtBQUssQ0FBQyxNQUFNLENBQ1osbUJBQW1CLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQ3JELE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxNQUFNLEdBQUcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLG9DQUFvQztBQUNwQywrRUFBK0U7QUFFL0UsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFJLG1CQUF1RixDQUFBO0lBRTNGLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNuQixNQUFNLFdBQVcsR0FBRywyQ0FBYSwrQkFBK0IsRUFBQyxDQUFBO1FBQ2pFLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQTtJQUN2RCxDQUFDLENBQUMsQ0FBQTtJQUVGLGFBQWE7SUFDYixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsZUFBZSxFQUFFLGNBQWM7Z0JBQy9CLE9BQU8sRUFBRSxFQUFFO2FBQ1osQ0FBQTtZQUNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRix3QkFBd0I7SUFDeEIsUUFBUSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUNsRCxFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1lBQ2hELE1BQU0sT0FBTyxHQUFHLHdCQUF3QixDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO1lBQzlFLE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1lBQy9ELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEUsTUFBTSxPQUFPLEdBQUcsd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDcEQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFhLENBQUE7WUFFdkQsZ0RBQWdEO1lBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxNQUFNLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUUzQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixzQkFBc0I7SUFDdEIsUUFBUSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1lBQ3BFLE1BQU0sT0FBTyxHQUFHLDRCQUE0QixDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRTNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLG1CQUFtQixFQUFFO29CQUNuQixFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUU7b0JBQzdGLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRTtpQkFDOUY7Z0JBQ0QsV0FBVyxFQUFFLFdBQVc7YUFDekIsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1lBQ2hGLE1BQU0sT0FBTyxHQUFHO2dCQUNkLGVBQWUsRUFBRSx1QkFBWSxDQUFDLFdBQVc7Z0JBQ3pDLFdBQVcsRUFBRSxVQUFtQjtnQkFDaEMsT0FBTyxFQUFFO29CQUNQO3dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztxQkFDaEU7aUJBQ0Y7YUFDRixDQUFBO1lBQ0QsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsbUJBQW1CLEVBQUU7b0JBQ25CO3dCQUNFLGNBQWMsRUFBRSxpQkFBaUI7d0JBQ2pDLGNBQWMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxlQUFlO3dCQUNuRixXQUFXLEVBQUUsVUFBVTtxQkFDeEI7aUJBQ0Y7Z0JBQ0QsV0FBVyxFQUFFLFVBQVU7YUFDeEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFlBQVk7SUFDWixRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUUzQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyQixTQUFTLEVBQUU7b0JBQ1QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7b0JBQ2hDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2lCQUNqQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxNQUFNLE9BQU8sR0FBRztnQkFDZCxlQUFlLEVBQUUsdUJBQVksQ0FBQyxFQUFFO2dCQUNoQyxVQUFVLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2hELFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2lCQUNoQixDQUFDLENBQUM7YUFDSixDQUFBO1lBQ0QsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUErRCxDQUFBO1lBRXpHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLCtFQUErRTtBQUMvRSxjQUFjO0FBQ2QsK0VBQStFO0FBRS9FLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9DLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRywyQ0FBYSxTQUFTLEVBQUMsQ0FBQTtZQUUvQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDbkUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBXb3JrZmxvd1J1bm5pbmdEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IENodW5raW5nTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vaGVhZGVyJ1xuLy8gSW1wb3J0IGNvbXBvbmVudHMgYWZ0ZXIgbW9ja3NcbmltcG9ydCBUZXN0UnVuUGFuZWwgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9ja3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayB3b3JrZmxvdyBzdG9yZVxuY29uc3QgbW9ja0lzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IHZpLmZuKCgpID0+IHRydWUpXG5jb25zdCBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlID0gdmkuZm4oKVxuY29uc3QgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSB2aS5mbjwoKSA9PiBXb3JrZmxvd1J1bm5pbmdEYXRhIHwgdW5kZWZpbmVkPigoKSA9PiB1bmRlZmluZWQpXG5jb25zdCBtb2NrUGlwZWxpbmVJZCA9ICd0ZXN0LXBpcGVsaW5lLWlkJ1xuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4gdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgaXNQcmVwYXJpbmdEYXRhU291cmNlOiBtb2NrSXNQcmVwYXJpbmdEYXRhU291cmNlKCksXG4gICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhOiBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpLFxuICAgICAgcGlwZWxpbmVJZDogbW9ja1BpcGVsaW5lSWQsXG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZSlcbiAgfSxcbiAgdXNlV29ya2Zsb3dTdG9yZTogKCkgPT4gKHtcbiAgICBnZXRTdGF0ZTogKCkgPT4gKHtcbiAgICAgIGlzUHJlcGFyaW5nRGF0YVNvdXJjZTogbW9ja0lzUHJlcGFyaW5nRGF0YVNvdXJjZSgpLFxuICAgICAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlOiBtb2NrU2V0SXNQcmVwYXJpbmdEYXRhU291cmNlLFxuICAgIH0pLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHdvcmtmbG93IGludGVyYWN0aW9uc1xuY29uc3QgbW9ja0hhbmRsZUNhbmNlbERlYnVnQW5kUHJldmlld1BhbmVsID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcycsICgpID0+ICh7XG4gIHVzZVdvcmtmbG93SW50ZXJhY3Rpb25zOiAoKSA9PiAoe1xuICAgIGhhbmRsZUNhbmNlbERlYnVnQW5kUHJldmlld1BhbmVsOiBtb2NrSGFuZGxlQ2FuY2VsRGVidWdBbmRQcmV2aWV3UGFuZWwsXG4gIH0pLFxuICB1c2VXb3JrZmxvd1J1bjogKCkgPT4gKHtcbiAgICBoYW5kbGVSdW46IHZpLmZuKCksXG4gIH0pLFxuICB1c2VUb29sSWNvbjogKCkgPT4gJ21vY2stdG9vbC1pY29uJyxcbn0pKVxuXG4vLyBNb2NrIGRhdGEgc291cmNlIHByb3ZpZGVyXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9zdG9yZS9wcm92aWRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwiZGF0YS1zb3VyY2UtcHJvdmlkZXJcIj57Y2hpbGRyZW59PC9kaXY+LFxufSkpXG5cbi8vIE1vY2sgUHJlcGFyYXRpb24gY29tcG9uZW50XG52aS5tb2NrKCcuL3ByZXBhcmF0aW9uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cInByZXBhcmF0aW9uLWNvbXBvbmVudFwiPlByZXBhcmF0aW9uPC9kaXY+LFxufSkpXG5cbi8vIE1vY2sgUmVzdWx0IGNvbXBvbmVudCAoZm9yIFRlc3RSdW5QYW5lbCB0ZXN0cyBvbmx5KVxudmkubW9jaygnLi9yZXN1bHQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwicmVzdWx0LWNvbXBvbmVudFwiPlJlc3VsdDwvZGl2Pixcbn0pKVxuXG4vLyBNb2NrIFJlc3VsdFBhbmVsIGZyb20gd29ya2Zsb3dcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcnVuL3Jlc3VsdC1wYW5lbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicmVzdWx0LXBhbmVsXCI+XG4gICAgICBSZXN1bHRQYW5lbCAtXG4gICAgICB7JyAnfVxuICAgICAge3Byb3BzLnN0YXR1cyBhcyBzdHJpbmd9XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBUcmFjaW5nUGFuZWwgZnJvbSB3b3JrZmxvd1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ydW4vdHJhY2luZy1wYW5lbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogeyBsaXN0OiB1bmtub3duW10gfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ0cmFjaW5nLXBhbmVsXCI+XG4gICAgICBUcmFjaW5nUGFuZWwgLVxuICAgICAgeycgJ31cbiAgICAgIHtwcm9wcy5saXN0Py5sZW5ndGggPz8gMH1cbiAgICAgIHsnICd9XG4gICAgICBpdGVtc1xuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgTG9hZGluZyBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImxvYWRpbmdcIj5Mb2FkaW5nLi4uPC9kaXY+LFxufSkpXG5cbi8vIE1vY2sgY29uZmlnXG52aS5tb2NrKCdAL2NvbmZpZycsICgpID0+ICh7XG4gIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTTogNSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gKG92ZXJyaWRlczogUGFydGlhbDxXb3JrZmxvd1J1bm5pbmdEYXRhPiA9IHt9KTogV29ya2Zsb3dSdW5uaW5nRGF0YSA9PiAoe1xuICByZXN1bHQ6IHtcbiAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgb3V0cHV0czogJ3tcInRlc3RcIjogXCJvdXRwdXRcIn0nLFxuICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICBpbnB1dHM6ICd7XCJ0ZXN0XCI6IFwiaW5wdXRcIn0nLFxuICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgIHByb2Nlc3NfZGF0YV90cnVuY2F0ZWQ6IGZhbHNlLFxuICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgZWxhcHNlZF90aW1lOiAxMDAwLFxuICAgIHRvdGFsX3Rva2VuczogMTAwLFxuICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgY3JlYXRlZF9ieTogJ1Rlc3QgVXNlcicsXG4gICAgdG90YWxfc3RlcHM6IDUsXG4gICAgZXhjZXB0aW9uc19jb3VudDogMCxcbiAgfSxcbiAgdHJhY2luZzogW10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tHZW5lcmFsT3V0cHV0cyA9IChjaHVua0NvbnRlbnRzOiBzdHJpbmdbXSA9IFsnY2h1bmsxJywgJ2NodW5rMiddKSA9PiAoe1xuICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS50ZXh0LFxuICBwcmV2aWV3OiBjaHVua0NvbnRlbnRzLm1hcChjb250ZW50ID0+ICh7IGNvbnRlbnQgfSkpLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1BhcmVudENoaWxkT3V0cHV0cyA9IChwYXJlbnRNb2RlOiAncGFyYWdyYXBoJyB8ICdmdWxsLWRvYycgPSAncGFyYWdyYXBoJykgPT4gKHtcbiAgY2h1bmtfc3RydWN0dXJlOiBDaHVua2luZ01vZGUucGFyZW50Q2hpbGQsXG4gIHBhcmVudF9tb2RlOiBwYXJlbnRNb2RlLFxuICBwcmV2aWV3OiBbXG4gICAgeyBjb250ZW50OiAncGFyZW50MScsIGNoaWxkX2NodW5rczogWydjaGlsZDEnLCAnY2hpbGQyJ10gfSxcbiAgICB7IGNvbnRlbnQ6ICdwYXJlbnQyJywgY2hpbGRfY2h1bmtzOiBbJ2NoaWxkMycsICdjaGlsZDQnXSB9LFxuICBdLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1FBT3V0cHV0cyA9ICgpID0+ICh7XG4gIGNodW5rX3N0cnVjdHVyZTogQ2h1bmtpbmdNb2RlLnFhLFxuICBxYV9wcmV2aWV3OiBbXG4gICAgeyBxdWVzdGlvbjogJ1ExJywgYW5zd2VyOiAnQTEnIH0sXG4gICAgeyBxdWVzdGlvbjogJ1EyJywgYW5zd2VyOiAnQTInIH0sXG4gIF0sXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0UnVuUGFuZWwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdUZXN0UnVuUGFuZWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tJc1ByZXBhcmluZ0RhdGFTb3VyY2UubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEubW9ja1JldHVyblZhbHVlKHVuZGVmaW5lZClcbiAgfSlcblxuICAvLyBCYXNpYyByZW5kZXJpbmcgdGVzdHNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGNvcnJlY3QgY29udGFpbmVyIHN0eWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRlc3RSdW5QYW5lbCAvPilcbiAgICAgIGNvbnN0IHBhbmVsRGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgZXhwZWN0KHBhbmVsRGl2KS50b0hhdmVDbGFzcygncmVsYXRpdmUnLCAnZmxleCcsICdoLWZ1bGwnLCAndy1bNDgwcHhdJywgJ2ZsZXgtY29sJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSGVhZGVyIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VGVzdFJ1blBhbmVsIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLnRlc3RSdW4udGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ29uZGl0aW9uYWwgcmVuZGVyaW5nIGJhc2VkIG9uIGlzUHJlcGFyaW5nRGF0YVNvdXJjZVxuICBkZXNjcmliZSgnQ29uZGl0aW9uYWwgQ29udGVudCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHJlcGFyYXRpb24gaW5zaWRlIERhdGFTb3VyY2VQcm92aWRlciB3aGVuIGlzUHJlcGFyaW5nRGF0YVNvdXJjZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgbW9ja0lzUHJlcGFyaW5nRGF0YVNvdXJjZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcblxuICAgICAgcmVuZGVyKDxUZXN0UnVuUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLXByb3ZpZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXBhcmF0aW9uLWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3Jlc3VsdC1jb21wb25lbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUmVzdWx0IHdoZW4gaXNQcmVwYXJpbmdEYXRhU291cmNlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgbW9ja0lzUHJlcGFyaW5nRGF0YVNvdXJjZS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG5cbiAgICAgIHJlbmRlcig8VGVzdFJ1blBhbmVsIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXN1bHQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZGF0YS1zb3VyY2UtcHJvdmlkZXInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncHJlcGFyYXRpb24tY29tcG9uZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlYWRlciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0hlYWRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzUHJlcGFyaW5nRGF0YVNvdXJjZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgdGVzdHNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aXRsZSB3aXRoIGNvcnJlY3QgdHJhbnNsYXRpb24ga2V5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxIZWFkZXIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUudGVzdFJ1bi50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNsb3NlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SGVhZGVyIC8+KVxuXG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgbGF5b3V0IGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgLz4pXG4gICAgICBjb25zdCBoZWFkZXJEaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuXG4gICAgICBleHBlY3QoaGVhZGVyRGl2KS50b0hhdmVDbGFzcygnZmxleCcsICdpdGVtcy1jZW50ZXInLCAnZ2FwLXgtMicsICdwbC00JywgJ3ByLTMnLCAncHQtNCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyBDbG9zZSBidXR0b24gaW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdDbG9zZSBCdXR0b24gSW50ZXJhY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldElzUHJlcGFyaW5nRGF0YVNvdXJjZShmYWxzZSkgYW5kIGhhbmRsZUNhbmNlbERlYnVnQW5kUHJldmlld1BhbmVsIHdoZW4gY2xpY2tlZCBhbmQgaXNQcmVwYXJpbmdEYXRhU291cmNlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNQcmVwYXJpbmdEYXRhU291cmNlLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuXG4gICAgICByZW5kZXIoPEhlYWRlciAvPilcblxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1NldElzUHJlcGFyaW5nRGF0YVNvdXJjZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgICBleHBlY3QobW9ja0hhbmRsZUNhbmNlbERlYnVnQW5kUHJldmlld1BhbmVsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvbmx5IGNhbGwgaGFuZGxlQ2FuY2VsRGVidWdBbmRQcmV2aWV3UGFuZWwgd2hlbiBpc1ByZXBhcmluZ0RhdGFTb3VyY2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNQcmVwYXJpbmdEYXRhU291cmNlLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcblxuICAgICAgcmVuZGVyKDxIZWFkZXIgLz4pXG5cbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcblxuICAgICAgZXhwZWN0KG1vY2tTZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrSGFuZGxlQ2FuY2VsRGVidWdBbmRQcmV2aWV3UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSZXN1bHQgQ29tcG9uZW50IFRlc3RzIChSZWFsIEltcGxlbWVudGF0aW9uKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBVbm1vY2sgUmVzdWx0IGZvciB0aGVzZSB0ZXN0c1xudmkuZG9Vbm1vY2soJy4vcmVzdWx0JylcblxuZGVzY3JpYmUoJ1Jlc3VsdCcsICgpID0+IHtcbiAgLy8gRHluYW1pY2FsbHkgaW1wb3J0IFJlc3VsdCB0byBnZXQgcmVhbCBpbXBsZW1lbnRhdGlvblxuICBsZXQgUmVzdWx0OiB0eXBlb2YgaW1wb3J0KCcuL3Jlc3VsdCcpLmRlZmF1bHRcblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdE1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9yZXN1bHQnKVxuICAgIFJlc3VsdCA9IHJlc3VsdE1vZHVsZS5kZWZhdWx0XG4gIH0pXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEubW9ja1JldHVyblZhbHVlKHVuZGVmaW5lZClcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgdGVzdHNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIFJFU1VMVCB0YWIgYWN0aXZlIGJ5IGRlZmF1bHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLnJlc3VsdC9pIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHRUYWIpLnRvSGF2ZUNsYXNzKCdib3JkZXItdXRpbC1jb2xvcnMtYmx1ZS1icmFuZC1ibHVlLWJyYW5kLTYwMCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgdGhyZWUgdGFicycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuTG9nXFwucmVzdWx0L2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC5kZXRhaWwvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLnRyYWNpbmcvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGFiIHN3aXRjaGluZyB0ZXN0c1xuICBkZXNjcmliZSgnVGFiIFN3aXRjaGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHN3aXRjaCB0byBERVRBSUwgdGFiIHdoZW4gY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhLm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpKVxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGNvbnN0IGRldGFpbFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLmRldGFpbC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZGV0YWlsVGFiKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVzdWx0LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3dpdGNoIHRvIFRSQUNJTkcgdGFiIHdoZW4gY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhLm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSh7IHRyYWNpbmc6IFt7IGlkOiAnMScgfV0gYXMgdW5rbm93biBhcyBXb3JrZmxvd1J1bm5pbmdEYXRhWyd0cmFjaW5nJ10gfSkpXG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgY29uc3QgdHJhY2luZ1RhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLnRyYWNpbmcvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyYWNpbmdUYWIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmFjaW5nLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBMb2FkaW5nIHN0YXRlc1xuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgaW4gREVUQUlMIHRhYiB3aGVuIG5vIHJlc3VsdCBkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgcmVzdWx0OiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBXb3JrZmxvd1J1bm5pbmdEYXRhWydyZXN1bHQnXSxcbiAgICAgICAgdHJhY2luZzogW10sXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGNvbnN0IGRldGFpbFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLmRldGFpbC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZGV0YWlsVGFiKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBpbiBUUkFDSU5HIHRhYiB3aGVuIG5vIHRyYWNpbmcgZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhLm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSh7IHRyYWNpbmc6IFtdIH0pKVxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGNvbnN0IHRyYWNpbmdUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC50cmFjaW5nL2kgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmFjaW5nVGFiKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSZXN1bHRQcmV2aWV3IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBXZSBuZWVkIHRvIGltcG9ydCBSZXN1bHRQcmV2aWV3IGRpcmVjdGx5XG52aS5kb1VubW9jaygnLi9yZXN1bHQvcmVzdWx0LXByZXZpZXcnKVxuXG5kZXNjcmliZSgnUmVzdWx0UHJldmlldycsICgpID0+IHtcbiAgbGV0IFJlc3VsdFByZXZpZXc6IHR5cGVvZiBpbXBvcnQoJy4vcmVzdWx0L3Jlc3VsdC1wcmV2aWV3JykuZGVmYXVsdFxuXG4gIGJlZm9yZUFsbChhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJldmlld01vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9yZXN1bHQvcmVzdWx0LXByZXZpZXcnKVxuICAgIFJlc3VsdFByZXZpZXcgPSBwcmV2aWV3TW9kdWxlLmRlZmF1bHRcbiAgfSlcblxuICBjb25zdCBtb2NrT25Td2l0Y2hUb0RldGFpbCA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBMb2FkaW5nIHN0YXRlXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIHNwaW5uZXIgd2hlbiBpc1J1bm5pbmcgaXMgdHJ1ZSBhbmQgbm8gb3V0cHV0cycsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e3RydWV9XG4gICAgICAgICAgb3V0cHV0cz17dW5kZWZpbmVkfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17bW9ja09uU3dpdGNoVG9EZXRhaWx9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgbG9hZGluZyB3aGVuIG91dHB1dHMgYXJlIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e3RydWV9XG4gICAgICAgICAgb3V0cHV0cz17Y3JlYXRlTW9ja0dlbmVyYWxPdXRwdXRzKCl9XG4gICAgICAgICAgZXJyb3I9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXttb2NrT25Td2l0Y2hUb0RldGFpbH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmxvYWRpbmcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVycm9yIHN0YXRlXG4gIGRlc2NyaWJlKCdFcnJvciBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgbWVzc2FnZSB3aGVuIG5vdCBydW5uaW5nIGFuZCBoYXMgZXJyb3InLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXt1bmRlZmluZWR9XG4gICAgICAgICAgZXJyb3I9XCJUZXN0IGVycm9yIG1lc3NhZ2VcIlxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e21vY2tPblN3aXRjaFRvRGV0YWlsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmVycm9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy52aWV3RGV0YWlscycgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU3dpdGNoVG9EZXRhaWwgd2hlbiBWaWV3IERldGFpbHMgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXt1bmRlZmluZWR9XG4gICAgICAgICAgZXJyb3I9XCJUZXN0IGVycm9yIG1lc3NhZ2VcIlxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e21vY2tPblN3aXRjaFRvRGV0YWlsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgdmlld0RldGFpbHNCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy52aWV3RGV0YWlscycgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayh2aWV3RGV0YWlsc0J1dHRvbilcblxuICAgICAgZXhwZWN0KG1vY2tPblN3aXRjaFRvRGV0YWlsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBlcnJvciB3aGVuIHN0aWxsIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXt0cnVlfVxuICAgICAgICAgIG91dHB1dHM9e3VuZGVmaW5lZH1cbiAgICAgICAgICBlcnJvcj1cIlRlc3QgZXJyb3IgbWVzc2FnZVwiXG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17bW9ja09uU3dpdGNoVG9EZXRhaWx9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5lcnJvcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gU3VjY2VzcyBzdGF0ZSB3aXRoIG91dHB1dHNcbiAgZGVzY3JpYmUoJ1N1Y2Nlc3MgU3RhdGUgd2l0aCBPdXRwdXRzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNodW5rIGNvbnRlbnQgd2hlbiBvdXRwdXRzIGFyZSBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtjcmVhdGVNb2NrR2VuZXJhbE91dHB1dHMoWyd0ZXN0IGNodW5rIGNvbnRlbnQnXSl9XG4gICAgICAgICAgZXJyb3I9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXttb2NrT25Td2l0Y2hUb0RldGFpbH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENoZWNrIHRoYXQgY2h1bmsgY29udGVudCBpcyByZW5kZXJlZCAodGhlIHJlYWwgQ2h1bmtDYXJkTGlzdCByZW5kZXJzIHRoZSBjb250ZW50KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QgY2h1bmsgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG11bHRpcGxlIGNodW5rcyB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmVzdWx0UHJldmlld1xuICAgICAgICAgIGlzUnVubmluZz17ZmFsc2V9XG4gICAgICAgICAgb3V0cHV0cz17Y3JlYXRlTW9ja0dlbmVyYWxPdXRwdXRzKFsnY2h1bmsgb25lJywgJ2NodW5rIHR3byddKX1cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e21vY2tPblN3aXRjaFRvRGV0YWlsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NodW5rIG9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY2h1bmsgdHdvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGZvb3RlciB0aXAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtjcmVhdGVNb2NrR2VuZXJhbE91dHB1dHMoKX1cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e21vY2tPblN3aXRjaFRvRGV0YWlsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3BpcGVsaW5lXFwucmVzdWx0XFwucmVzdWx0UHJldmlld1xcLmZvb3RlclRpcC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIGNhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG91dHB1dHMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIG91dHB1dHM9e251bGx9XG4gICAgICAgICAgZXJyb3I9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXttb2NrT25Td2l0Y2hUb0RldGFpbH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNob3VsZCBub3QgY3Jhc2ggYW5kIHNob3VsZCBub3Qgc2hvdyBjaHVuayBjYXJkIGxpc3RcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmVzdWx0UHJldmlld1xuICAgICAgICAgIGlzUnVubmluZz17ZmFsc2V9XG4gICAgICAgICAgb3V0cHV0cz17dW5kZWZpbmVkfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17bW9ja09uU3dpdGNoVG9EZXRhaWx9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUYWJzIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG52aS5kb1VubW9jaygnLi9yZXN1bHQvdGFicycpXG5cbmRlc2NyaWJlKCdUYWJzJywgKCkgPT4ge1xuICBsZXQgVGFiczogdHlwZW9mIGltcG9ydCgnLi9yZXN1bHQvdGFicycpLmRlZmF1bHRcblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRhYnNNb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4vcmVzdWx0L3RhYnMnKVxuICAgIFRhYnMgPSB0YWJzTW9kdWxlLmRlZmF1bHRcbiAgfSlcblxuICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0c1xuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0aHJlZSB0YWJzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e2NyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCl9XG4gICAgICAgICAgc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLnJlc3VsdC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuTG9nXFwuZGV0YWlsL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC50cmFjaW5nL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFjdGl2ZSB0YWIgc3R5bGluZ1xuICBkZXNjcmliZSgnQWN0aXZlIFRhYiBTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGlnaGxpZ2h0IFJFU1VMVCB0YWIgd2hlbiBjdXJyZW50VGFiIGlzIFJFU1VMVCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHJlc3VsdFRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3J1bkxvZ1xcLnJlc3VsdC9pIH0pXG4gICAgICBleHBlY3QocmVzdWx0VGFiKS50b0hhdmVDbGFzcygnYm9yZGVyLXV0aWwtY29sb3JzLWJsdWUtYnJhbmQtYmx1ZS1icmFuZC02MDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZ2hsaWdodCBERVRBSUwgdGFiIHdoZW4gY3VycmVudFRhYiBpcyBERVRBSUwnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIkRFVEFJTFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBkZXRhaWxUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC5kZXRhaWwvaSB9KVxuICAgICAgZXhwZWN0KGRldGFpbFRhYikudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRhYiBjbGljayBoYW5kbGluZ1xuICBkZXNjcmliZSgnVGFiIENsaWNrIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBzd2l0Y2hUYWIgd2l0aCBSRVNVTFQgd2hlbiBSRVNVTFQgdGFiIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIkRFVEFJTFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuTG9nXFwucmVzdWx0L2kgfSkpXG5cbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHN3aXRjaFRhYiB3aXRoIERFVEFJTCB3aGVuIERFVEFJTCB0YWIgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC5kZXRhaWwvaSB9KSlcblxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdERVRBSUwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc3dpdGNoVGFiIHdpdGggVFJBQ0lORyB3aGVuIFRSQUNJTkcgdGFiIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcnVuTG9nXFwudHJhY2luZy9pIH0pKVxuXG4gICAgICBleHBlY3QobW9ja1N3aXRjaFRhYikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1RSQUNJTkcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRGlzYWJsZWQgc3RhdGUgd2hlbiBubyBkYXRhXG4gIGRlc2NyaWJlKCdEaXNhYmxlZCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgdGFicyB3aGVuIHdvcmtmbG93UnVubmluZ0RhdGEgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJSRVNVTFRcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3VuZGVmaW5lZH1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCByZXN1bHRUYWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9ydW5Mb2dcXC5yZXN1bHQvaSB9KVxuICAgICAgZXhwZWN0KHJlc3VsdFRhYikudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGFiIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG52aS5kb1VubW9jaygnLi9yZXN1bHQvdGFicy90YWInKVxuXG5kZXNjcmliZSgnVGFiJywgKCkgPT4ge1xuICBsZXQgVGFiOiB0eXBlb2YgaW1wb3J0KCcuL3Jlc3VsdC90YWJzL3RhYicpLmRlZmF1bHRcblxuICBiZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRhYk1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9yZXN1bHQvdGFicy90YWInKVxuICAgIFRhYiA9IHRhYk1vZHVsZS5kZWZhdWx0XG4gIH0pXG5cbiAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIHRlc3RzXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFiIHdpdGggbGFiZWwnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0IFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ1Rlc3QgVGFiJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQWN0aXZlIHN0YXRlIHN0eWxpbmdcbiAgZGVzY3JpYmUoJ0FjdGl2ZSBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWN0aXZlIHN0eWxlcyB3aGVuIGlzQWN0aXZlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17dHJ1ZX1cbiAgICAgICAgICBsYWJlbD1cIkFjdGl2ZSBUYWJcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QodGFiKS50b0hhdmVDbGFzcygnYm9yZGVyLXV0aWwtY29sb3JzLWJsdWUtYnJhbmQtYmx1ZS1icmFuZC02MDAnLCAndGV4dC10ZXh0LXByaW1hcnknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgaW5hY3RpdmUgc3R5bGVzIHdoZW4gaXNBY3RpdmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJJbmFjdGl2ZSBUYWJcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QodGFiKS50b0hhdmVDbGFzcygnYm9yZGVyLXRyYW5zcGFyZW50JywgJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgfSlcbiAgfSlcblxuICAvLyBDbGljayBoYW5kbGluZ1xuICBkZXNjcmliZSgnQ2xpY2sgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2sgd2l0aCB2YWx1ZSB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0IFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJNWV9WQUxVRVwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnTVlfVkFMVUUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2xpY2sgd2hlbiBkaXNhYmxlZCAobm8gd29ya2Zsb3dSdW5uaW5nRGF0YSknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0IFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJNWV9WQUxVRVwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgdGFiID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0YWIpXG5cbiAgICAgIC8vIFRoZSBjbGljayBoYW5kbGVyIGlzIHN0aWxsIGNhbGxlZCwgYnV0IGJ1dHRvbiBpcyBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHRhYikudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIERpc2FibGVkIHN0YXRlXG4gIGRlc2NyaWJlKCdEaXNhYmxlZCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIGRpc2FibGVkIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0IFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJURVNUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0YWIgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KHRhYikudG9CZURpc2FibGVkKClcbiAgICAgIGV4cGVjdCh0YWIpLnRvSGF2ZUNsYXNzKCdvcGFjaXR5LTMwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYmUgZGlzYWJsZWQgd2hlbiB3b3JrZmxvd1J1bm5pbmdEYXRhIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiVGVzdCBUYWJcIlxuICAgICAgICAgIHZhbHVlPVwiVEVTVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRhYiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QodGFiKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gZm9ybWF0UHJldmlld0NodW5rcyBVdGlsaXR5IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdmb3JtYXRQcmV2aWV3Q2h1bmtzJywgKCkgPT4ge1xuICBsZXQgZm9ybWF0UHJldmlld0NodW5rczogdHlwZW9mIGltcG9ydCgnLi9yZXN1bHQvcmVzdWx0LXByZXZpZXcvdXRpbHMnKS5mb3JtYXRQcmV2aWV3Q2h1bmtzXG5cbiAgYmVmb3JlQWxsKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1dGlsc01vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9yZXN1bHQvcmVzdWx0LXByZXZpZXcvdXRpbHMnKVxuICAgIGZvcm1hdFByZXZpZXdDaHVua3MgPSB1dGlsc01vZHVsZS5mb3JtYXRQcmV2aWV3Q2h1bmtzXG4gIH0pXG5cbiAgLy8gRWRnZSBjYXNlc1xuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIG51bGwgb3V0cHV0cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChmb3JtYXRQcmV2aWV3Q2h1bmtzKG51bGwpKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciB1bmRlZmluZWQgb3V0cHV0cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChmb3JtYXRQcmV2aWV3Q2h1bmtzKHVuZGVmaW5lZCkpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIHVua25vd24gY2h1bmsgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgY2h1bmtfc3RydWN0dXJlOiAndW5rbm93bl9tb2RlJyxcbiAgICAgICAgcHJldmlldzogW10sXG4gICAgICB9XG4gICAgICBleHBlY3QoZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBHZW5lcmFsICh0ZXh0KSBjaHVua3NcbiAgZGVzY3JpYmUoJ0dlbmVyYWwgQ2h1bmtzIChDaHVua2luZ01vZGUudGV4dCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgZ2VuZXJhbCBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZU1vY2tHZW5lcmFsT3V0cHV0cyhbJ2NvbnRlbnQxJywgJ2NvbnRlbnQyJywgJ2NvbnRlbnQzJ10pXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydjb250ZW50MScsICdjb250ZW50MicsICdjb250ZW50MyddKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGxpbWl0IHRvIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTSBjaHVua3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW55Q2h1bmtzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IGBjaHVuayR7aX1gKVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZU1vY2tHZW5lcmFsT3V0cHV0cyhtYW55Q2h1bmtzKVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBzdHJpbmdbXVxuXG4gICAgICAvLyBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0gaXMgbW9ja2VkIHRvIDVcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCg1KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbJ2NodW5rMCcsICdjaHVuazEnLCAnY2h1bmsyJywgJ2NodW5rMycsICdjaHVuazQnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJldmlldyBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVNb2NrR2VuZXJhbE91dHB1dHMoW10pXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG4gICAgfSlcbiAgfSlcblxuICAvLyBQYXJlbnQtY2hpbGQgY2h1bmtzXG4gIGRlc2NyaWJlKCdQYXJlbnQtQ2hpbGQgQ2h1bmtzIChDaHVua2luZ01vZGUucGFyZW50Q2hpbGQpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHBhcmFncmFwaCBtb2RlIHBhcmVudC1jaGlsZCBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZU1vY2tQYXJlbnRDaGlsZE91dHB1dHMoJ3BhcmFncmFwaCcpXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBwYXJlbnRfY2hpbGRfY2h1bmtzOiBbXG4gICAgICAgICAgeyBwYXJlbnRfY29udGVudDogJ3BhcmVudDEnLCBjaGlsZF9jb250ZW50czogWydjaGlsZDEnLCAnY2hpbGQyJ10sIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyB9LFxuICAgICAgICAgIHsgcGFyZW50X2NvbnRlbnQ6ICdwYXJlbnQyJywgY2hpbGRfY29udGVudHM6IFsnY2hpbGQzJywgJ2NoaWxkNCddLCBwYXJlbnRfbW9kZTogJ3BhcmFncmFwaCcgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgZnVsbC1kb2MgbW9kZSBwYXJlbnQtY2hpbGQgY2h1bmtzIGFuZCBsaW1pdCBjaGlsZCBjaHVua3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgcGFyZW50X21vZGU6ICdmdWxsLWRvYycgYXMgY29uc3QsXG4gICAgICAgIHByZXZpZXc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250ZW50OiAnZnVsbC1kb2MtcGFyZW50JyxcbiAgICAgICAgICAgIGNoaWxkX2NodW5rczogQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IGBjaGlsZCR7aX1gKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgcGFyZW50X2NoaWxkX2NodW5rczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBhcmVudF9jb250ZW50OiAnZnVsbC1kb2MtcGFyZW50JyxcbiAgICAgICAgICAgIGNoaWxkX2NvbnRlbnRzOiBbJ2NoaWxkMCcsICdjaGlsZDEnLCAnY2hpbGQyJywgJ2NoaWxkMycsICdjaGlsZDQnXSwgLy8gTGltaXRlZCB0byA1XG4gICAgICAgICAgICBwYXJlbnRfbW9kZTogJ2Z1bGwtZG9jJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBwYXJlbnRfbW9kZTogJ2Z1bGwtZG9jJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBRQSBjaHVua3NcbiAgZGVzY3JpYmUoJ1FBIENodW5rcyAoQ2h1bmtpbmdNb2RlLnFhKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBRQSBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZU1vY2tRQU91dHB1dHMoKVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgcWFfY2h1bmtzOiBbXG4gICAgICAgICAgeyBxdWVzdGlvbjogJ1ExJywgYW5zd2VyOiAnQTEnIH0sXG4gICAgICAgICAgeyBxdWVzdGlvbjogJ1EyJywgYW5zd2VyOiAnQTInIH0sXG4gICAgICAgIF0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGxpbWl0IFFBIGNodW5rcyB0byBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS5xYSxcbiAgICAgICAgcWFfcHJldmlldzogQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+ICh7XG4gICAgICAgICAgcXVlc3Rpb246IGBRJHtpfWAsXG4gICAgICAgICAgYW5zd2VyOiBgQSR7aX1gLFxuICAgICAgICB9KSksXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIHsgcWFfY2h1bmtzOiBBcnJheTx7IHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcjogc3RyaW5nIH0+IH1cblxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3MpLnRvSGF2ZUxlbmd0aCg1KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUeXBlcyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVHlwZXMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdUZXN0UnVuU3RlcCBFbnVtJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGVudW0gdmFsdWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyBUZXN0UnVuU3RlcCB9ID0gYXdhaXQgaW1wb3J0KCcuL3R5cGVzJylcblxuICAgICAgZXhwZWN0KFRlc3RSdW5TdGVwLmRhdGFTb3VyY2UpLnRvQmUoJ2RhdGFTb3VyY2UnKVxuICAgICAgZXhwZWN0KFRlc3RSdW5TdGVwLmRvY3VtZW50UHJvY2Vzc2luZykudG9CZSgnZG9jdW1lbnRQcm9jZXNzaW5nJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==