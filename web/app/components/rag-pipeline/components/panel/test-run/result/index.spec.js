"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/workflow/types");
const config_1 = require("@/config");
const datasets_1 = require("@/models/datasets");
const index_1 = require("./index");
const result_preview_1 = require("./result-preview");
const utils_1 = require("./result-preview/utils");
const tabs_1 = require("./tabs");
const tab_1 = require("./tabs/tab");
// ============================================================================
// Pre-declare variables used in mocks (hoisting)
// ============================================================================
let mockWorkflowRunningData;
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const ns = options?.ns ? `${options.ns}.` : '';
            if (options?.count !== undefined)
                return `${ns}${key} (count: ${options.count})`;
            return `${ns}${key}`;
        },
    }),
}));
// Mock workflow store
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => selector({ workflowRunningData: mockWorkflowRunningData }),
}));
// Mock child components
vi.mock('@/app/components/workflow/run/result-panel', () => ({
    default: ({ inputs, outputs, status, error, elapsed_time, total_tokens, created_at, created_by, steps, exceptionCounts, }) => (<div data-testid="result-panel" data-inputs={inputs} data-outputs={outputs} data-status={status} data-error={error} data-elapsed-time={elapsed_time} data-total-tokens={total_tokens} data-created-at={created_at} data-created-by={created_by} data-steps={steps} data-exception-counts={exceptionCounts}>
      ResultPanel
    </div>),
}));
vi.mock('@/app/components/workflow/run/tracing-panel', () => ({
    default: ({ className, list }) => (<div data-testid="tracing-panel" data-classname={className} data-list-length={list.length}>
      TracingPanel
    </div>),
}));
vi.mock('@/app/components/rag-pipeline/components/chunk-card-list', () => ({
    ChunkCardList: ({ chunkType, chunkInfo }) => (<div data-testid="chunk-card-list" data-chunk-type={chunkType} data-chunk-info={JSON.stringify(chunkInfo)}>
      ChunkCardList
    </div>),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createMockWorkflowRunningData = (overrides) => ({
    task_id: 'test-task-id',
    message_id: 'test-message-id',
    conversation_id: 'test-conversation-id',
    result: {
        workflow_id: 'test-workflow-id',
        inputs: '{"input": "test"}',
        inputs_truncated: false,
        process_data: '{}',
        process_data_truncated: false,
        outputs: '{"output": "test"}',
        outputs_truncated: false,
        status: types_1.WorkflowRunningStatus.Succeeded,
        elapsed_time: 1000,
        total_tokens: 100,
        created_at: Date.now(),
        created_by: 'test-user',
        total_steps: 5,
        exceptions_count: 0,
    },
    tracing: [
        {
            id: 'node-1',
            index: 1,
            predecessor_node_id: '',
            node_id: 'node-1',
            node_type: types_1.BlockEnum.Start,
            title: 'Start',
            inputs: {},
            inputs_truncated: false,
            process_data: {},
            process_data_truncated: false,
            outputs: {},
            outputs_truncated: false,
            status: 'succeeded',
            elapsed_time: 100,
            execution_metadata: {
                total_tokens: 0,
                total_price: 0,
                currency: 'USD',
            },
            metadata: {
                iterator_length: 0,
                iterator_index: 0,
                loop_length: 0,
                loop_index: 0,
            },
            created_at: Date.now(),
            created_by: {
                id: 'test-user-id',
                name: 'Test User',
                email: 'test@example.com',
            },
            finished_at: Date.now(),
        },
    ],
    ...overrides,
});
const createGeneralChunkOutputs = (chunkCount = 5) => ({
    chunk_structure: datasets_1.ChunkingMode.text,
    preview: Array.from({ length: chunkCount }, (_, i) => ({
        content: `General chunk content ${i + 1}`,
    })),
});
const createParentChildChunkOutputs = (parentMode, parentCount = 3) => ({
    chunk_structure: datasets_1.ChunkingMode.parentChild,
    parent_mode: parentMode,
    preview: Array.from({ length: parentCount }, (_, i) => ({
        content: `Parent content ${i + 1}`,
        child_chunks: [`Child 1 of parent ${i + 1}`, `Child 2 of parent ${i + 1}`],
    })),
});
const createQAChunkOutputs = (qaCount = 5) => ({
    chunk_structure: datasets_1.ChunkingMode.qa,
    qa_preview: Array.from({ length: qaCount }, (_, i) => ({
        question: `Question ${i + 1}`,
        answer: `Answer ${i + 1}`,
    })),
});
// ============================================================================
// Helper Functions
// ============================================================================
const resetAllMocks = () => {
    mockWorkflowRunningData = undefined;
};
// ============================================================================
// Tab Component Tests
// ============================================================================
describe('Tab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render tab with label', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={false} label="Test Tab" value="test" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button')).toHaveTextContent('Test Tab');
        });
        it('should apply active styles when isActive is true', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={true} label="Active Tab" value="active" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            expect(button).toHaveClass('text-text-primary');
        });
        it('should apply inactive styles when isActive is false', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={false} label="Inactive Tab" value="inactive" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('border-transparent');
            expect(button).toHaveClass('text-text-tertiary');
        });
        it('should apply disabled styles when workflowRunningData is undefined', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={false} label="Disabled Tab" value="disabled" workflowRunningData={undefined} onClick={mockOnClick}/>);
            const button = react_1.screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('opacity-30');
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onClick with value when clicked', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={false} label="Clickable Tab" value="click-value" workflowRunningData={createMockWorkflowRunningData()} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledTimes(1);
            expect(mockOnClick).toHaveBeenCalledWith('click-value');
        });
        it('should not call onClick when disabled', () => {
            const mockOnClick = vi.fn();
            (0, react_1.render)(<tab_1.default isActive={false} label="Disabled Tab" value="disabled-value" workflowRunningData={undefined} onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).not.toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should maintain stable handleClick callback reference', () => {
            const mockOnClick = vi.fn();
            const TestComponent = ({ onClick }) => (<tab_1.default isActive={false} label="Test" value="test" workflowRunningData={createMockWorkflowRunningData()} onClick={onClick}/>);
            const { rerender } = (0, react_1.render)(<TestComponent onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledTimes(1);
            rerender(<TestComponent onClick={mockOnClick}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            expect(mockOnClick).toHaveBeenCalledTimes(2);
        });
    });
    // -------------------------------------------------------------------------
    // Props Variation Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should render with all combinations of isActive and workflowRunningData', () => {
            const mockOnClick = vi.fn();
            const workflowData = createMockWorkflowRunningData();
            // Active with data
            const { rerender } = (0, react_1.render)(<tab_1.default isActive={true} label="Tab" value="tab" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            // Inactive with data
            rerender(<tab_1.default isActive={false} label="Tab" value="tab" workflowRunningData={workflowData} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            // Active without data
            rerender(<tab_1.default isActive={true} label="Tab" value="tab" workflowRunningData={undefined} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button')).toBeDisabled();
            // Inactive without data
            rerender(<tab_1.default isActive={false} label="Tab" value="tab" workflowRunningData={undefined} onClick={mockOnClick}/>);
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
    });
});
// ============================================================================
// Tabs Component Tests
// ============================================================================
describe('Tabs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render all three tabs', () => {
            (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={vi.fn()}/>);
            expect(react_1.screen.getByText('runLog.result')).toBeInTheDocument();
            expect(react_1.screen.getByText('runLog.detail')).toBeInTheDocument();
            expect(react_1.screen.getByText('runLog.tracing')).toBeInTheDocument();
        });
        it('should render tabs container with correct styling', () => {
            const { container } = (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={vi.fn()}/>);
            const tabsContainer = container.firstChild;
            expect(tabsContainer).toHaveClass('flex');
            expect(tabsContainer).toHaveClass('shrink-0');
            expect(tabsContainer).toHaveClass('border-b-[0.5px]');
        });
        it('should highlight the current tab', () => {
            (0, react_1.render)(<tabs_1.default currentTab="DETAIL" workflowRunningData={createMockWorkflowRunningData()} switchTab={vi.fn()}/>);
            const buttons = react_1.screen.getAllByRole('button');
            // RESULT tab
            expect(buttons[0]).toHaveClass('border-transparent');
            // DETAIL tab (active)
            expect(buttons[1]).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            // TRACING tab
            expect(buttons[2]).toHaveClass('border-transparent');
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call switchTab when RESULT tab is clicked', () => {
            const mockSwitchTab = vi.fn();
            (0, react_1.render)(<tabs_1.default currentTab="DETAIL" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.result'));
            expect(mockSwitchTab).toHaveBeenCalledWith('RESULT');
        });
        it('should call switchTab when DETAIL tab is clicked', () => {
            const mockSwitchTab = vi.fn();
            (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            expect(mockSwitchTab).toHaveBeenCalledWith('DETAIL');
        });
        it('should call switchTab when TRACING tab is clicked', () => {
            const mockSwitchTab = vi.fn();
            (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={createMockWorkflowRunningData()} switchTab={mockSwitchTab}/>);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.tracing'));
            expect(mockSwitchTab).toHaveBeenCalledWith('TRACING');
        });
        it('should disable all tabs when workflowRunningData is undefined', () => {
            const mockSwitchTab = vi.fn();
            (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={undefined} switchTab={mockSwitchTab}/>);
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toBeDisabled();
            });
            react_1.fireEvent.click(buttons[0]);
            expect(mockSwitchTab).not.toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Props Variation Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle all currentTab values', () => {
            const mockSwitchTab = vi.fn();
            const workflowData = createMockWorkflowRunningData();
            const { rerender } = (0, react_1.render)(<tabs_1.default currentTab="RESULT" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            let buttons = react_1.screen.getAllByRole('button');
            expect(buttons[0]).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            rerender(<tabs_1.default currentTab="DETAIL" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            buttons = react_1.screen.getAllByRole('button');
            expect(buttons[1]).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
            rerender(<tabs_1.default currentTab="TRACING" workflowRunningData={workflowData} switchTab={mockSwitchTab}/>);
            buttons = react_1.screen.getAllByRole('button');
            expect(buttons[2]).toHaveClass('border-util-colors-blue-brand-blue-brand-600');
        });
    });
});
// ============================================================================
// formatPreviewChunks Utility Tests
// ============================================================================
describe('formatPreviewChunks', () => {
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should return undefined when outputs is null', () => {
            expect((0, utils_1.formatPreviewChunks)(null)).toBeUndefined();
        });
        it('should return undefined when outputs is undefined', () => {
            expect((0, utils_1.formatPreviewChunks)(undefined)).toBeUndefined();
        });
        it('should return undefined for unknown chunk_structure', () => {
            const outputs = {
                chunk_structure: 'unknown_mode',
                preview: [],
            };
            expect((0, utils_1.formatPreviewChunks)(outputs)).toBeUndefined();
        });
    });
    // -------------------------------------------------------------------------
    // General Chunks Tests
    // -------------------------------------------------------------------------
    describe('General Chunks (text mode)', () => {
        it('should format general chunks correctly', () => {
            const outputs = createGeneralChunkOutputs(3);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result).toHaveLength(3);
            expect(result[0]).toBe('General chunk content 1');
            expect(result[1]).toBe('General chunk content 2');
            expect(result[2]).toBe('General chunk content 3');
        });
        it('should limit chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM', () => {
            const outputs = createGeneralChunkOutputs(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM + 10);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result).toHaveLength(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM);
        });
        it('should handle empty preview array', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.text,
                preview: [],
            };
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result).toHaveLength(0);
        });
    });
    // -------------------------------------------------------------------------
    // Parent-Child Chunks Tests
    // -------------------------------------------------------------------------
    describe('Parent-Child Chunks (hierarchical mode)', () => {
        it('should format paragraph mode chunks correctly', () => {
            const outputs = createParentChildChunkOutputs('paragraph', 3);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.parent_mode).toBe('paragraph');
            expect(result.parent_child_chunks).toHaveLength(3);
            expect(result.parent_child_chunks[0].parent_content).toBe('Parent content 1');
            expect(result.parent_child_chunks[0].child_contents).toEqual([
                'Child 1 of parent 1',
                'Child 2 of parent 1',
            ]);
        });
        it('should limit paragraph mode chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM', () => {
            const outputs = createParentChildChunkOutputs('paragraph', config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM + 5);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.parent_child_chunks).toHaveLength(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM);
        });
        it('should format full-doc mode chunks correctly', () => {
            const outputs = createParentChildChunkOutputs('full-doc', 2);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.parent_mode).toBe('full-doc');
            expect(result.parent_child_chunks).toHaveLength(2);
        });
        it('should limit full-doc mode child chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.parentChild,
                parent_mode: 'full-doc',
                preview: [
                    {
                        content: 'Parent content',
                        child_chunks: Array.from({ length: config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM + 10 }, (_, i) => `Child ${i + 1}`),
                    },
                ],
            };
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.parent_child_chunks[0].child_contents).toHaveLength(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM);
        });
        it('should handle empty preview array for parent-child mode', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.parentChild,
                parent_mode: 'paragraph',
                preview: [],
            };
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.parent_child_chunks).toHaveLength(0);
        });
    });
    // -------------------------------------------------------------------------
    // QA Chunks Tests
    // -------------------------------------------------------------------------
    describe('QA Chunks (qa mode)', () => {
        it('should format QA chunks correctly', () => {
            const outputs = createQAChunkOutputs(3);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.qa_chunks).toHaveLength(3);
            expect(result.qa_chunks[0].question).toBe('Question 1');
            expect(result.qa_chunks[0].answer).toBe('Answer 1');
        });
        it('should limit QA chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM', () => {
            const outputs = createQAChunkOutputs(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM + 10);
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.qa_chunks).toHaveLength(config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM);
        });
        it('should handle empty qa_preview array', () => {
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.qa,
                qa_preview: [],
            };
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            expect(result.qa_chunks).toHaveLength(0);
        });
    });
});
// ============================================================================
// ResultPreview Component Tests
// ============================================================================
describe('ResultPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render loading state when isRunning is true and no outputs', () => {
            (0, react_1.render)(<result_preview_1.default isRunning={true} outputs={undefined} error={undefined} onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should render error state when not running and has error', () => {
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={undefined} error="Something went wrong" onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            expect(react_1.screen.getByText('pipeline.result.resultPreview.viewDetails')).toBeInTheDocument();
        });
        it('should render ChunkCardList when outputs are available', () => {
            const outputs = createGeneralChunkOutputs(5);
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should render footer tip with correct count', () => {
            const outputs = createGeneralChunkOutputs(5);
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.getByText(`pipeline.result.resultPreview.footerTip (count: ${config_1.RAG_PIPELINE_PREVIEW_CHUNK_NUM})`)).toBeInTheDocument();
        });
        it('should not show loading when isRunning but outputs exist', () => {
            const outputs = createGeneralChunkOutputs(5);
            (0, react_1.render)(<result_preview_1.default isRunning={true} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onSwitchToDetail when view details button is clicked', () => {
            const mockOnSwitchToDetail = vi.fn();
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={undefined} error="Error occurred" onSwitchToDetail={mockOnSwitchToDetail}/>);
            react_1.fireEvent.click(react_1.screen.getByText('pipeline.result.resultPreview.viewDetails'));
            expect(mockOnSwitchToDetail).toHaveBeenCalledTimes(1);
        });
    });
    // -------------------------------------------------------------------------
    // Props Variation Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should render with general chunks output', () => {
            const outputs = createGeneralChunkOutputs(3);
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            const chunkCardList = react_1.screen.getByTestId('chunk-card-list');
            expect(chunkCardList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.text);
        });
        it('should render with parent-child chunks output', () => {
            const outputs = createParentChildChunkOutputs('paragraph', 3);
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            const chunkCardList = react_1.screen.getByTestId('chunk-card-list');
            expect(chunkCardList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.parentChild);
        });
        it('should render with QA chunks output', () => {
            const outputs = createQAChunkOutputs(3);
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            const chunkCardList = react_1.screen.getByTestId('chunk-card-list');
            expect(chunkCardList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.qa);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle outputs with no previewChunks result', () => {
            const outputs = {
                chunk_structure: 'unknown_mode',
                preview: [],
            };
            (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            // Should not render chunk card list when formatPreviewChunks returns undefined
            expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
        });
        it('should not render error section when running', () => {
            (0, react_1.render)(<result_preview_1.default isRunning={true} outputs={undefined} error="Error" onSwitchToDetail={vi.fn()}/>);
            // Error section should not render when isRunning is true
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.error')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should memoize previewChunks calculation', () => {
            const outputs = createGeneralChunkOutputs(3);
            const { rerender } = (0, react_1.render)(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            // Re-render with same outputs - should use memoized value
            rerender(<result_preview_1.default isRunning={false} outputs={outputs} error={undefined} onSwitchToDetail={vi.fn()}/>);
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Result Component Tests (Main Component)
// ============================================================================
describe('Result', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        resetAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render tabs and result preview by default', () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Running,
                    outputs: undefined,
                },
            });
            (0, react_1.render)(<index_1.default />);
            // Tabs should be rendered
            expect(react_1.screen.getByText('runLog.result')).toBeInTheDocument();
            expect(react_1.screen.getByText('runLog.detail')).toBeInTheDocument();
            expect(react_1.screen.getByText('runLog.tracing')).toBeInTheDocument();
        });
        it('should render loading state for RESULT tab when running without outputs', () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Running,
                    outputs: undefined,
                },
            });
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should render result preview when result has outputs', () => {
            const outputs = createGeneralChunkOutputs(3);
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Succeeded,
                    outputs: outputs,
                },
            });
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Tab Switching Tests
    // -------------------------------------------------------------------------
    describe('Tab Switching', () => {
        it('should switch to DETAIL tab when clicked', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData();
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
        });
        it('should switch to TRACING tab when clicked', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData();
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.tracing'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('tracing-panel')).toBeInTheDocument();
            });
        });
        it('should switch back to RESULT tab from other tabs', async () => {
            const outputs = createGeneralChunkOutputs(3);
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    outputs: outputs,
                },
            });
            (0, react_1.render)(<index_1.default />);
            // Switch to DETAIL
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
            // Switch back to RESULT
            react_1.fireEvent.click(react_1.screen.getByText('runLog.result'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // DETAIL Tab Content Tests
    // -------------------------------------------------------------------------
    describe('DETAIL Tab Content', () => {
        it('should render ResultPanel with correct props', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    inputs: '{"key": "value"}',
                    outputs: '{"result": "success"}',
                    status: types_1.WorkflowRunningStatus.Succeeded,
                    error: undefined,
                    elapsed_time: 1500,
                    total_tokens: 200,
                    created_at: 1700000000000,
                    created_by: { name: 'Test User' },
                    total_steps: 10,
                    exceptions_count: 2,
                },
            });
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            await (0, react_1.waitFor)(() => {
                const resultPanel = react_1.screen.getByTestId('result-panel');
                expect(resultPanel).toHaveAttribute('data-inputs', '{"key": "value"}');
                expect(resultPanel).toHaveAttribute('data-outputs', '{"result": "success"}');
                expect(resultPanel).toHaveAttribute('data-status', types_1.WorkflowRunningStatus.Succeeded);
                expect(resultPanel).toHaveAttribute('data-elapsed-time', '1500');
                expect(resultPanel).toHaveAttribute('data-total-tokens', '200');
                expect(resultPanel).toHaveAttribute('data-steps', '10');
                expect(resultPanel).toHaveAttribute('data-exception-counts', '2');
            });
        });
        it('should show loading when DETAIL tab is active but no result', async () => {
            mockWorkflowRunningData = {
                ...createMockWorkflowRunningData(),
                result: undefined,
            };
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // TRACING Tab Content Tests
    // -------------------------------------------------------------------------
    describe('TRACING Tab Content', () => {
        it('should render TracingPanel with tracing data', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData();
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.tracing'));
            await (0, react_1.waitFor)(() => {
                const tracingPanel = react_1.screen.getByTestId('tracing-panel');
                expect(tracingPanel).toHaveAttribute('data-list-length', '1');
                expect(tracingPanel).toHaveAttribute('data-classname', 'bg-background-section-burn');
            });
        });
        it('should show loading when TRACING tab is active but no tracing data', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                tracing: [],
            });
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('runLog.tracing'));
            await (0, react_1.waitFor)(() => {
                // Both TracingPanel and Loading should be rendered
                expect(react_1.screen.getByTestId('tracing-panel')).toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Switch to Detail from Result Preview Tests
    // -------------------------------------------------------------------------
    describe('Switch to Detail from Result Preview', () => {
        it('should switch to DETAIL tab when onSwitchToDetail is triggered from ResultPreview', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Failed,
                    error: 'Workflow failed',
                    outputs: undefined,
                },
            });
            (0, react_1.render)(<index_1.default />);
            // Click the view details button in error state
            react_1.fireEvent.click(react_1.screen.getByText('pipeline.result.resultPreview.viewDetails'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle undefined workflowRunningData', () => {
            mockWorkflowRunningData = undefined;
            (0, react_1.render)(<index_1.default />);
            // All tabs should be disabled
            const buttons = react_1.screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toBeDisabled();
            });
        });
        it('should handle workflowRunningData with no result', () => {
            mockWorkflowRunningData = {
                task_id: 'test-task',
                result: undefined,
                tracing: [],
            };
            (0, react_1.render)(<index_1.default />);
            // Should show loading in RESULT tab (isRunning condition)
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should handle result with Running status', () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Running,
                    outputs: undefined,
                },
            });
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should handle result with Stopped status', () => {
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Stopped,
                    outputs: undefined,
                    error: 'Workflow was stopped',
                },
            });
            (0, react_1.render)(<index_1.default />);
            // Should show error when stopped
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // State Management Tests
    // -------------------------------------------------------------------------
    describe('State Management', () => {
        it('should maintain tab state across re-renders', async () => {
            mockWorkflowRunningData = createMockWorkflowRunningData();
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Switch to DETAIL tab
            react_1.fireEvent.click(react_1.screen.getByText('runLog.detail'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
            });
            // Re-render component
            rerender(<index_1.default />);
            // Should still be on DETAIL tab
            expect(react_1.screen.getByTestId('result-panel')).toBeInTheDocument();
        });
        it('should render different states based on workflowRunningData', () => {
            // Test 1: Running state with no outputs
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Running,
                    outputs: undefined,
                },
            });
            const { unmount } = (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            unmount();
            // Test 2: Completed state with outputs
            const outputs = createGeneralChunkOutputs(3);
            mockWorkflowRunningData = createMockWorkflowRunningData({
                result: {
                    ...createMockWorkflowRunningData().result,
                    status: types_1.WorkflowRunningStatus.Succeeded,
                    outputs: outputs,
                },
            });
            (0, react_1.render)(<index_1.default />);
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be memoized', () => {
            mockWorkflowRunningData = createMockWorkflowRunningData();
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Re-render without changes
            rerender(<index_1.default />);
            // Component should still be rendered correctly
            expect(react_1.screen.getByText('runLog.result')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QiwyREFBa0Y7QUFDbEYscUNBQXlEO0FBQ3pELGdEQUFnRDtBQUNoRCxtQ0FBNEI7QUFDNUIscURBQTRDO0FBQzVDLGtEQUE0RDtBQUM1RCxpQ0FBeUI7QUFDekIsb0NBQTRCO0FBRTVCLCtFQUErRTtBQUMvRSxpREFBaUQ7QUFDakQsK0VBQStFO0FBRS9FLElBQUksdUJBQXdELENBQUE7QUFFNUQsK0VBQStFO0FBQy9FLDZCQUE2QjtBQUM3QiwrRUFBK0U7QUFFL0UscUJBQXFCO0FBQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE9BQXlDLEVBQUUsRUFBRTtZQUM1RCxNQUFNLEVBQUUsR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1lBQzlDLElBQUksT0FBTyxFQUFFLEtBQUssS0FBSyxTQUFTO2dCQUM5QixPQUFPLEdBQUcsRUFBRSxHQUFHLEdBQUcsWUFBWSxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUE7WUFDaEQsT0FBTyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUN0QixDQUFDO0tBQ0YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsc0JBQXNCO0FBQ3RCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxRQUFRLEVBQUUsQ0FBSyxRQUFnRixFQUFFLEVBQUUsQ0FDakcsUUFBUSxDQUFDLEVBQUUsbUJB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LENBQUE7SUFFRiw0RUFBNEU7SUFDNUUsb0JBQW9CO0lBQ3BCLDRFQUE0RTtJQUM1RSxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1lBQzVCLHVCQUF1QixHQUFHLDZCQUE2QixFQUFFLENBQUE7WUFFekQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBTSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFdkMsNEJBQTRCO1lBQzVCLFFBQVEsQ0FBQyxDQUFDLGVBQU0sQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXBCLCtDQUErQztZQUMvQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDaHVua0luZm8sIEdlbmVyYWxDaHVua3MsIFBhcmVudENoaWxkQ2h1bmtzLCBRQUNodW5rcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2NvbXBvbmVudHMvY2h1bmstY2FyZC1saXN0L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBXb3JrZmxvd1J1bm5pbmdEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCbG9ja0VudW0sIFdvcmtmbG93UnVubmluZ1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0gfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IENodW5raW5nTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IFJlc3VsdCBmcm9tICcuL2luZGV4J1xuaW1wb3J0IFJlc3VsdFByZXZpZXcgZnJvbSAnLi9yZXN1bHQtcHJldmlldydcbmltcG9ydCB7IGZvcm1hdFByZXZpZXdDaHVua3MgfSBmcm9tICcuL3Jlc3VsdC1wcmV2aWV3L3V0aWxzJ1xuaW1wb3J0IFRhYnMgZnJvbSAnLi90YWJzJ1xuaW1wb3J0IFRhYiBmcm9tICcuL3RhYnMvdGFiJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQcmUtZGVjbGFyZSB2YXJpYWJsZXMgdXNlZCBpbiBtb2NrcyAoaG9pc3RpbmcpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmxldCBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YTogV29ya2Zsb3dSdW5uaW5nRGF0YSB8IHVuZGVmaW5lZFxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHJlYWN0LWkxOG5leHRcbnZpLm1vY2soJ3JlYWN0LWkxOG5leHQnLCAoKSA9PiAoe1xuICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nLCBjb3VudD86IG51bWJlciB9KSA9PiB7XG4gICAgICBjb25zdCBucyA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uYCA6ICcnXG4gICAgICBpZiAob3B0aW9ucz8uY291bnQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIGAke25zfSR7a2V5fSAoY291bnQ6ICR7b3B0aW9ucy5jb3VudH0pYFxuICAgICAgcmV0dXJuIGAke25zfSR7a2V5fWBcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHdvcmtmbG93IHN0b3JlXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IDxULD4oc2VsZWN0b3I6IChzdGF0ZTogeyB3b3JrZmxvd1J1bm5pbmdEYXRhOiBXb3JrZmxvd1J1bm5pbmdEYXRhIHwgdW5kZWZpbmVkIH0pID0+IFQpID0+XG4gICAgc2VsZWN0b3IoeyB3b3JrZmxvd1J1bm5pbmdEYXRhOiBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSB9KSxcbn0pKVxuXG4vLyBNb2NrIGNoaWxkIGNvbXBvbmVudHNcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcnVuL3Jlc3VsdC1wYW5lbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7XG4gICAgaW5wdXRzLFxuICAgIG91dHB1dHMsXG4gICAgc3RhdHVzLFxuICAgIGVycm9yLFxuICAgIGVsYXBzZWRfdGltZSxcbiAgICB0b3RhbF90b2tlbnMsXG4gICAgY3JlYXRlZF9hdCxcbiAgICBjcmVhdGVkX2J5LFxuICAgIHN0ZXBzLFxuICAgIGV4Y2VwdGlvbkNvdW50cyxcbiAgfToge1xuICAgIGlucHV0cz86IHN0cmluZ1xuICAgIG91dHB1dHM/OiBzdHJpbmdcbiAgICBzdGF0dXM/OiBzdHJpbmdcbiAgICBlcnJvcj86IHN0cmluZ1xuICAgIGVsYXBzZWRfdGltZT86IG51bWJlclxuICAgIHRvdGFsX3Rva2Vucz86IG51bWJlclxuICAgIGNyZWF0ZWRfYXQ/OiBudW1iZXJcbiAgICBjcmVhdGVkX2J5Pzogc3RyaW5nXG4gICAgc3RlcHM/OiBudW1iZXJcbiAgICBleGNlcHRpb25Db3VudHM/OiBudW1iZXJcbiAgfSkgPT4gKFxuICAgIDxkaXZcbiAgICAgIGRhdGEtdGVzdGlkPVwicmVzdWx0LXBhbmVsXCJcbiAgICAgIGRhdGEtaW5wdXRzPXtpbnB1dHN9XG4gICAgICBkYXRhLW91dHB1dHM9e291dHB1dHN9XG4gICAgICBkYXRhLXN0YXR1cz17c3RhdHVzfVxuICAgICAgZGF0YS1lcnJvcj17ZXJyb3J9XG4gICAgICBkYXRhLWVsYXBzZWQtdGltZT17ZWxhcHNlZF90aW1lfVxuICAgICAgZGF0YS10b3RhbC10b2tlbnM9e3RvdGFsX3Rva2Vuc31cbiAgICAgIGRhdGEtY3JlYXRlZC1hdD17Y3JlYXRlZF9hdH1cbiAgICAgIGRhdGEtY3JlYXRlZC1ieT17Y3JlYXRlZF9ieX1cbiAgICAgIGRhdGEtc3RlcHM9e3N0ZXBzfVxuICAgICAgZGF0YS1leGNlcHRpb24tY291bnRzPXtleGNlcHRpb25Db3VudHN9XG4gICAgPlxuICAgICAgUmVzdWx0UGFuZWxcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3J1bi90cmFjaW5nLXBhbmVsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2xhc3NOYW1lLCBsaXN0IH06IHsgY2xhc3NOYW1lPzogc3RyaW5nLCBsaXN0OiB1bmtub3duW10gfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ0cmFjaW5nLXBhbmVsXCIgZGF0YS1jbGFzc25hbWU9e2NsYXNzTmFtZX0gZGF0YS1saXN0LWxlbmd0aD17bGlzdC5sZW5ndGh9PlxuICAgICAgVHJhY2luZ1BhbmVsXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvY29tcG9uZW50cy9jaHVuay1jYXJkLWxpc3QnLCAoKSA9PiAoe1xuICBDaHVua0NhcmRMaXN0OiAoeyBjaHVua1R5cGUsIGNodW5rSW5mbyB9OiB7IGNodW5rVHlwZT86IHN0cmluZywgY2h1bmtJbmZvPzogQ2h1bmtJbmZvIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cImNodW5rLWNhcmQtbGlzdFwiXG4gICAgICBkYXRhLWNodW5rLXR5cGU9e2NodW5rVHlwZX1cbiAgICAgIGRhdGEtY2h1bmstaW5mbz17SlNPTi5zdHJpbmdpZnkoY2h1bmtJbmZvKX1cbiAgICA+XG4gICAgICBDaHVua0NhcmRMaXN0XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IChcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxXb3JrZmxvd1J1bm5pbmdEYXRhPixcbik6IFdvcmtmbG93UnVubmluZ0RhdGEgPT4gKHtcbiAgdGFza19pZDogJ3Rlc3QtdGFzay1pZCcsXG4gIG1lc3NhZ2VfaWQ6ICd0ZXN0LW1lc3NhZ2UtaWQnLFxuICBjb252ZXJzYXRpb25faWQ6ICd0ZXN0LWNvbnZlcnNhdGlvbi1pZCcsXG4gIHJlc3VsdDoge1xuICAgIHdvcmtmbG93X2lkOiAndGVzdC13b3JrZmxvdy1pZCcsXG4gICAgaW5wdXRzOiAne1wiaW5wdXRcIjogXCJ0ZXN0XCJ9JyxcbiAgICBpbnB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICBwcm9jZXNzX2RhdGE6ICd7fScsXG4gICAgcHJvY2Vzc19kYXRhX3RydW5jYXRlZDogZmFsc2UsXG4gICAgb3V0cHV0czogJ3tcIm91dHB1dFwiOiBcInRlc3RcIn0nLFxuICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgZWxhcHNlZF90aW1lOiAxMDAwLFxuICAgIHRvdGFsX3Rva2VuczogMTAwLFxuICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgY3JlYXRlZF9ieTogJ3Rlc3QtdXNlcicsXG4gICAgdG90YWxfc3RlcHM6IDUsXG4gICAgZXhjZXB0aW9uc19jb3VudDogMCxcbiAgfSxcbiAgdHJhY2luZzogW1xuICAgIHtcbiAgICAgIGlkOiAnbm9kZS0xJyxcbiAgICAgIGluZGV4OiAxLFxuICAgICAgcHJlZGVjZXNzb3Jfbm9kZV9pZDogJycsXG4gICAgICBub2RlX2lkOiAnbm9kZS0xJyxcbiAgICAgIG5vZGVfdHlwZTogQmxvY2tFbnVtLlN0YXJ0LFxuICAgICAgdGl0bGU6ICdTdGFydCcsXG4gICAgICBpbnB1dHM6IHt9LFxuICAgICAgaW5wdXRzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICBwcm9jZXNzX2RhdGE6IHt9LFxuICAgICAgcHJvY2Vzc19kYXRhX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICBvdXRwdXRzOiB7fSxcbiAgICAgIG91dHB1dHNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgICBlbGFwc2VkX3RpbWU6IDEwMCxcbiAgICAgIGV4ZWN1dGlvbl9tZXRhZGF0YToge1xuICAgICAgICB0b3RhbF90b2tlbnM6IDAsXG4gICAgICAgIHRvdGFsX3ByaWNlOiAwLFxuICAgICAgICBjdXJyZW5jeTogJ1VTRCcsXG4gICAgICB9LFxuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgaXRlcmF0b3JfbGVuZ3RoOiAwLFxuICAgICAgICBpdGVyYXRvcl9pbmRleDogMCxcbiAgICAgICAgbG9vcF9sZW5ndGg6IDAsXG4gICAgICAgIGxvb3BfaW5kZXg6IDAsXG4gICAgICB9LFxuICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgICAgIGNyZWF0ZWRfYnk6IHtcbiAgICAgICAgaWQ6ICd0ZXN0LXVzZXItaWQnLFxuICAgICAgICBuYW1lOiAnVGVzdCBVc2VyJyxcbiAgICAgICAgZW1haWw6ICd0ZXN0QGV4YW1wbGUuY29tJyxcbiAgICAgIH0sXG4gICAgICBmaW5pc2hlZF9hdDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICBdLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzID0gKGNodW5rQ291bnQ6IG51bWJlciA9IDUpID0+ICh7XG4gIGNodW5rX3N0cnVjdHVyZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gIHByZXZpZXc6IEFycmF5LmZyb20oeyBsZW5ndGg6IGNodW5rQ291bnQgfSwgKF8sIGkpID0+ICh7XG4gICAgY29udGVudDogYEdlbmVyYWwgY2h1bmsgY29udGVudCAke2kgKyAxfWAsXG4gIH0pKSxcbn0pXG5cbmNvbnN0IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtPdXRwdXRzID0gKHBhcmVudE1vZGU6ICdwYXJhZ3JhcGgnIHwgJ2Z1bGwtZG9jJywgcGFyZW50Q291bnQ6IG51bWJlciA9IDMpID0+ICh7XG4gIGNodW5rX3N0cnVjdHVyZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICBwYXJlbnRfbW9kZTogcGFyZW50TW9kZSxcbiAgcHJldmlldzogQXJyYXkuZnJvbSh7IGxlbmd0aDogcGFyZW50Q291bnQgfSwgKF8sIGkpID0+ICh7XG4gICAgY29udGVudDogYFBhcmVudCBjb250ZW50ICR7aSArIDF9YCxcbiAgICBjaGlsZF9jaHVua3M6IFtgQ2hpbGQgMSBvZiBwYXJlbnQgJHtpICsgMX1gLCBgQ2hpbGQgMiBvZiBwYXJlbnQgJHtpICsgMX1gXSxcbiAgfSkpLFxufSlcblxuY29uc3QgY3JlYXRlUUFDaHVua091dHB1dHMgPSAocWFDb3VudDogbnVtYmVyID0gNSkgPT4gKHtcbiAgY2h1bmtfc3RydWN0dXJlOiBDaHVua2luZ01vZGUucWEsXG4gIHFhX3ByZXZpZXc6IEFycmF5LmZyb20oeyBsZW5ndGg6IHFhQ291bnQgfSwgKF8sIGkpID0+ICh7XG4gICAgcXVlc3Rpb246IGBRdWVzdGlvbiAke2kgKyAxfWAsXG4gICAgYW5zd2VyOiBgQW5zd2VyICR7aSArIDF9YCxcbiAgfSkpLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCByZXNldEFsbE1vY2tzID0gKCkgPT4ge1xuICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHVuZGVmaW5lZFxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUYWIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdUYWInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0YWIgd2l0aCBsYWJlbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJUZXN0IFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJ0ZXN0XCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBUYWInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGFjdGl2ZSBzdHlsZXMgd2hlbiBpc0FjdGl2ZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXt0cnVlfVxuICAgICAgICAgIGxhYmVsPVwiQWN0aXZlIFRhYlwiXG4gICAgICAgICAgdmFsdWU9XCJhY3RpdmVcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e2NyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCl9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaW5hY3RpdmUgc3R5bGVzIHdoZW4gaXNBY3RpdmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiSW5hY3RpdmUgVGFiXCJcbiAgICAgICAgICB2YWx1ZT1cImluYWN0aXZlXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdib3JkZXItdHJhbnNwYXJlbnQnKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZGlzYWJsZWQgc3R5bGVzIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFiXG4gICAgICAgICAgaXNBY3RpdmU9e2ZhbHNlfVxuICAgICAgICAgIGxhYmVsPVwiRGlzYWJsZWQgVGFiXCJcbiAgICAgICAgICB2YWx1ZT1cImRpc2FibGVkXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25DbGljaz17bW9ja09uQ2xpY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdvcGFjaXR5LTMwJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGljayB3aXRoIHZhbHVlIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJDbGlja2FibGUgVGFiXCJcbiAgICAgICAgICB2YWx1ZT1cImNsaWNrLXZhbHVlXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIG9uQ2xpY2s9e21vY2tPbkNsaWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY2xpY2stdmFsdWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2xpY2sgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJcbiAgICAgICAgICBpc0FjdGl2ZT17ZmFsc2V9XG4gICAgICAgICAgbGFiZWw9XCJEaXNhYmxlZCBUYWJcIlxuICAgICAgICAgIHZhbHVlPVwiZGlzYWJsZWQtdmFsdWVcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvbkNsaWNrPXttb2NrT25DbGlja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZUNsaWNrIGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsaWNrID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCBUZXN0Q29tcG9uZW50ID0gKHsgb25DbGljayB9OiB7IG9uQ2xpY2s6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkIH0pID0+IChcbiAgICAgICAgPFRhYlxuICAgICAgICAgIGlzQWN0aXZlPXtmYWxzZX1cbiAgICAgICAgICBsYWJlbD1cIlRlc3RcIlxuICAgICAgICAgIHZhbHVlPVwidGVzdFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICAvPlxuICAgICAgKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFRlc3RDb21wb25lbnQgb25DbGljaz17bW9ja09uQ2xpY2t9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICByZXJlbmRlcig8VGVzdENvbXBvbmVudCBvbkNsaWNrPXttb2NrT25DbGlja30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG4gICAgICBleHBlY3QobW9ja09uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBWYXJpYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGFsbCBjb21iaW5hdGlvbnMgb2YgaXNBY3RpdmUgYW5kIHdvcmtmbG93UnVubmluZ0RhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgLy8gQWN0aXZlIHdpdGggZGF0YVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8VGFiIGlzQWN0aXZlPXt0cnVlfSBsYWJlbD1cIlRhYlwiIHZhbHVlPVwidGFiXCIgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfSBvbkNsaWNrPXttb2NrT25DbGlja30gLz4sXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICAvLyBJbmFjdGl2ZSB3aXRoIGRhdGFcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGFiIGlzQWN0aXZlPXtmYWxzZX0gbGFiZWw9XCJUYWJcIiB2YWx1ZT1cInRhYlwiIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX0gb25DbGljaz17bW9ja09uQ2xpY2t9IC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZURpc2FibGVkKClcblxuICAgICAgLy8gQWN0aXZlIHdpdGhvdXQgZGF0YVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUYWIgaXNBY3RpdmU9e3RydWV9IGxhYmVsPVwiVGFiXCIgdmFsdWU9XCJ0YWJcIiB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9IG9uQ2xpY2s9e21vY2tPbkNsaWNrfSAvPixcbiAgICAgIClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcblxuICAgICAgLy8gSW5hY3RpdmUgd2l0aG91dCBkYXRhXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRhYiBpc0FjdGl2ZT17ZmFsc2V9IGxhYmVsPVwiVGFiXCIgdmFsdWU9XCJ0YWJcIiB3b3JrZmxvd1J1bm5pbmdEYXRhPXt1bmRlZmluZWR9IG9uQ2xpY2s9e21vY2tPbkNsaWNrfSAvPixcbiAgICAgIClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGFicyBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1RhYnMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgdGhyZWUgdGFicycsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cucmVzdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cuZGV0YWlsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cudHJhY2luZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRhYnMgY29udGFpbmVyIHdpdGggY29ycmVjdCBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHRhYnNDb250YWluZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHRhYnNDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdmbGV4JylcbiAgICAgIGV4cGVjdCh0YWJzQ29udGFpbmVyKS50b0hhdmVDbGFzcygnc2hyaW5rLTAnKVxuICAgICAgZXhwZWN0KHRhYnNDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdib3JkZXItYi1bMC41cHhdJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgdGhlIGN1cnJlbnQgdGFiJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8VGFic1xuICAgICAgICAgIGN1cnJlbnRUYWI9XCJERVRBSUxcIlxuICAgICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE9e2NyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCl9XG4gICAgICAgICAgc3dpdGNoVGFiPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAvLyBSRVNVTFQgdGFiXG4gICAgICBleHBlY3QoYnV0dG9uc1swXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci10cmFuc3BhcmVudCcpXG4gICAgICAvLyBERVRBSUwgdGFiIChhY3RpdmUpXG4gICAgICBleHBlY3QoYnV0dG9uc1sxXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcbiAgICAgIC8vIFRSQUNJTkcgdGFiXG4gICAgICBleHBlY3QoYnV0dG9uc1syXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci10cmFuc3BhcmVudCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHN3aXRjaFRhYiB3aGVuIFJFU1VMVCB0YWIgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiREVUQUlMXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cucmVzdWx0JykpXG5cbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnUkVTVUxUJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHN3aXRjaFRhYiB3aGVuIERFVEFJTCB0YWIgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tTd2l0Y2hUYWIgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFRhYnNcbiAgICAgICAgICBjdXJyZW50VGFiPVwiUkVTVUxUXCJcbiAgICAgICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhPXtjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cuZGV0YWlsJykpXG5cbiAgICAgIGV4cGVjdChtb2NrU3dpdGNoVGFiKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnREVUQUlMJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHN3aXRjaFRhYiB3aGVuIFRSQUNJTkcgdGFiIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17Y3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKX1cbiAgICAgICAgICBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncnVuTG9nLnRyYWNpbmcnKSlcblxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdUUkFDSU5HJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGFsbCB0YWJzIHdoZW4gd29ya2Zsb3dSdW5uaW5nRGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrU3dpdGNoVGFiID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxUYWJzXG4gICAgICAgICAgY3VycmVudFRhYj1cIlJFU1VMVFwiXG4gICAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YT17dW5kZWZpbmVkfVxuICAgICAgICAgIHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzBdKVxuICAgICAgZXhwZWN0KG1vY2tTd2l0Y2hUYWIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVmFyaWF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIGN1cnJlbnRUYWIgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja1N3aXRjaFRhYiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdvcmtmbG93RGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8VGFicyBjdXJyZW50VGFiPVwiUkVTVUxUXCIgd29ya2Zsb3dSdW5uaW5nRGF0YT17d29ya2Zsb3dEYXRhfSBzd2l0Y2hUYWI9e21vY2tTd2l0Y2hUYWJ9IC8+LFxuICAgICAgKVxuXG4gICAgICBsZXQgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uc1swXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcblxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUYWJzIGN1cnJlbnRUYWI9XCJERVRBSUxcIiB3b3JrZmxvd1J1bm5pbmdEYXRhPXt3b3JrZmxvd0RhdGF9IHN3aXRjaFRhYj17bW9ja1N3aXRjaFRhYn0gLz4sXG4gICAgICApXG5cbiAgICAgIGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMV0pLnRvSGF2ZUNsYXNzKCdib3JkZXItdXRpbC1jb2xvcnMtYmx1ZS1icmFuZC1ibHVlLWJyYW5kLTYwMCcpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGFicyBjdXJyZW50VGFiPVwiVFJBQ0lOR1wiIHdvcmtmbG93UnVubmluZ0RhdGE9e3dvcmtmbG93RGF0YX0gc3dpdGNoVGFiPXttb2NrU3dpdGNoVGFifSAvPixcbiAgICAgIClcblxuICAgICAgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uc1syXSkudG9IYXZlQ2xhc3MoJ2JvcmRlci11dGlsLWNvbG9ycy1ibHVlLWJyYW5kLWJsdWUtYnJhbmQtNjAwJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gZm9ybWF0UHJldmlld0NodW5rcyBVdGlsaXR5IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdmb3JtYXRQcmV2aWV3Q2h1bmtzJywgKCkgPT4ge1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgd2hlbiBvdXRwdXRzIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZm9ybWF0UHJldmlld0NodW5rcyhudWxsKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCB3aGVuIG91dHB1dHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGZvcm1hdFByZXZpZXdDaHVua3ModW5kZWZpbmVkKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgdW5rbm93biBjaHVua19zdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6ICd1bmtub3duX21vZGUnIGFzIENodW5raW5nTW9kZSxcbiAgICAgICAgcHJldmlldzogW10sXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gR2VuZXJhbCBDaHVua3MgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnR2VuZXJhbCBDaHVua3MgKHRleHQgbW9kZSknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgZ2VuZXJhbCBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoMylcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgR2VuZXJhbENodW5rc1xuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0hhdmVMZW5ndGgoMylcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvQmUoJ0dlbmVyYWwgY2h1bmsgY29udGVudCAxJylcbiAgICAgIGV4cGVjdChyZXN1bHRbMV0pLnRvQmUoJ0dlbmVyYWwgY2h1bmsgY29udGVudCAyJylcbiAgICAgIGV4cGVjdChyZXN1bHRbMl0pLnRvQmUoJ0dlbmVyYWwgY2h1bmsgY29udGVudCAzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW1pdCBjaHVua3MgdG8gUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNICsgMTApXG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIEdlbmVyYWxDaHVua3NcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoKFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJldmlldyBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSB7XG4gICAgICAgIGNodW5rX3N0cnVjdHVyZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgIHByZXZpZXc6IFtdLFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBHZW5lcmFsQ2h1bmtzXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCgwKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQYXJlbnQtQ2hpbGQgQ2h1bmtzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1BhcmVudC1DaGlsZCBDaHVua3MgKGhpZXJhcmNoaWNhbCBtb2RlKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBwYXJhZ3JhcGggbW9kZSBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtPdXRwdXRzKCdwYXJhZ3JhcGgnLCAzKVxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBQYXJlbnRDaGlsZENodW5rc1xuXG4gICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9tb2RlKS50b0JlKCdwYXJhZ3JhcGgnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzKS50b0hhdmVMZW5ndGgoMylcbiAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rc1swXS5wYXJlbnRfY29udGVudCkudG9CZSgnUGFyZW50IGNvbnRlbnQgMScpXG4gICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9jaGlsZF9jaHVua3NbMF0uY2hpbGRfY29udGVudHMpLnRvRXF1YWwoW1xuICAgICAgICAnQ2hpbGQgMSBvZiBwYXJlbnQgMScsXG4gICAgICAgICdDaGlsZCAyIG9mIHBhcmVudCAxJyxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGltaXQgcGFyYWdyYXBoIG1vZGUgY2h1bmtzIHRvIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cygncGFyYWdyYXBoJywgUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNICsgNSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUGFyZW50Q2hpbGRDaHVua3NcblxuICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzKS50b0hhdmVMZW5ndGgoUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBmdWxsLWRvYyBtb2RlIGNodW5rcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua091dHB1dHMoJ2Z1bGwtZG9jJywgMilcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUGFyZW50Q2hpbGRDaHVua3NcblxuICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfbW9kZSkudG9CZSgnZnVsbC1kb2MnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzKS50b0hhdmVMZW5ndGgoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW1pdCBmdWxsLWRvYyBtb2RlIGNoaWxkIGNodW5rcyB0byBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgcGFyZW50X21vZGU6ICdmdWxsLWRvYycsXG4gICAgICAgIHByZXZpZXc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250ZW50OiAnUGFyZW50IGNvbnRlbnQnLFxuICAgICAgICAgICAgY2hpbGRfY2h1bmtzOiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICB7IGxlbmd0aDogUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNICsgMTAgfSxcbiAgICAgICAgICAgICAgKF8sIGkpID0+IGBDaGlsZCAke2kgKyAxfWAsXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rc1swXS5jaGlsZF9jb250ZW50cykudG9IYXZlTGVuZ3RoKFxuICAgICAgICBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0sXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHByZXZpZXcgYXJyYXkgZm9yIHBhcmVudC1jaGlsZCBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgY2h1bmtfc3RydWN0dXJlOiBDaHVua2luZ01vZGUucGFyZW50Q2hpbGQsXG4gICAgICAgIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgcHJldmlldzogW10sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rcykudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFBIENodW5rcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdRQSBDaHVua3MgKHFhIG1vZGUpJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IFFBIGNodW5rcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUUFDaHVua091dHB1dHMoMylcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUUFDaHVua3NcblxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3MpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3NbMF0ucXVlc3Rpb24pLnRvQmUoJ1F1ZXN0aW9uIDEnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3NbMF0uYW5zd2VyKS50b0JlKCdBbnN3ZXIgMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGltaXQgUUEgY2h1bmtzIHRvIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVRQUNodW5rT3V0cHV0cyhSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0gKyAxMClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUUFDaHVua3NcblxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3MpLnRvSGF2ZUxlbmd0aChSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHFhX3ByZXZpZXcgYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS5xYSxcbiAgICAgICAgcWFfcHJldmlldzogW10sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFFBQ2h1bmtzXG5cbiAgICAgIGV4cGVjdChyZXN1bHQucWFfY2h1bmtzKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUmVzdWx0UHJldmlldyBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1Jlc3VsdFByZXZpZXcnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb2FkaW5nIHN0YXRlIHdoZW4gaXNSdW5uaW5nIGlzIHRydWUgYW5kIG5vIG91dHB1dHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXt0cnVlfVxuICAgICAgICAgIG91dHB1dHM9e3VuZGVmaW5lZH1cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGVycm9yIHN0YXRlIHdoZW4gbm90IHJ1bm5pbmcgYW5kIGhhcyBlcnJvcicsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIG91dHB1dHM9e3VuZGVmaW5lZH1cbiAgICAgICAgICBlcnJvcj1cIlNvbWV0aGluZyB3ZW50IHdyb25nXCJcbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmVycm9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy52aWV3RGV0YWlscycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIENodW5rQ2FyZExpc3Qgd2hlbiBvdXRwdXRzIGFyZSBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyg1KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtvdXRwdXRzfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB0aXAgd2l0aCBjb3JyZWN0IGNvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoNSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmVzdWx0UHJldmlld1xuICAgICAgICAgIGlzUnVubmluZz17ZmFsc2V9XG4gICAgICAgICAgb3V0cHV0cz17b3V0cHV0c31cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoYHBpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmZvb3RlclRpcCAoY291bnQ6ICR7UkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNfSlgKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGxvYWRpbmcgd2hlbiBpc1J1bm5pbmcgYnV0IG91dHB1dHMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyg1KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXt0cnVlfVxuICAgICAgICAgIG91dHB1dHM9e291dHB1dHN9XG4gICAgICAgICAgZXJyb3I9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25Td2l0Y2hUb0RldGFpbCB3aGVuIHZpZXcgZGV0YWlscyBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPblN3aXRjaFRvRGV0YWlsID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXt1bmRlZmluZWR9XG4gICAgICAgICAgZXJyb3I9XCJFcnJvciBvY2N1cnJlZFwiXG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17bW9ja09uU3dpdGNoVG9EZXRhaWx9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcudmlld0RldGFpbHMnKSlcblxuICAgICAgZXhwZWN0KG1vY2tPblN3aXRjaFRvRGV0YWlsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVmFyaWF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBnZW5lcmFsIGNodW5rcyBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cygzKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtvdXRwdXRzfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNodW5rQ2FyZExpc3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpXG4gICAgICBleHBlY3QoY2h1bmtDYXJkTGlzdCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNodW5rLXR5cGUnLCBDaHVua2luZ01vZGUudGV4dClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBwYXJlbnQtY2hpbGQgY2h1bmtzIG91dHB1dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cygncGFyYWdyYXBoJywgMylcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmVzdWx0UHJldmlld1xuICAgICAgICAgIGlzUnVubmluZz17ZmFsc2V9XG4gICAgICAgICAgb3V0cHV0cz17b3V0cHV0c31cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjaHVua0NhcmRMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgZXhwZWN0KGNodW5rQ2FyZExpc3QpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jaHVuay10eXBlJywgQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIFFBIGNodW5rcyBvdXRwdXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUUFDaHVua091dHB1dHMoMylcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UmVzdWx0UHJldmlld1xuICAgICAgICAgIGlzUnVubmluZz17ZmFsc2V9XG4gICAgICAgICAgb3V0cHV0cz17b3V0cHV0c31cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjaHVua0NhcmRMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgZXhwZWN0KGNodW5rQ2FyZExpc3QpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jaHVuay10eXBlJywgQ2h1bmtpbmdNb2RlLnFhKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb3V0cHV0cyB3aXRoIG5vIHByZXZpZXdDaHVua3MgcmVzdWx0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgY2h1bmtfc3RydWN0dXJlOiAndW5rbm93bl9tb2RlJyBhcyBDaHVua2luZ01vZGUsXG4gICAgICAgIHByZXZpZXc6IFtdLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtvdXRwdXRzfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNob3VsZCBub3QgcmVuZGVyIGNodW5rIGNhcmQgbGlzdCB3aGVuIGZvcm1hdFByZXZpZXdDaHVua3MgcmV0dXJucyB1bmRlZmluZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBlcnJvciBzZWN0aW9uIHdoZW4gcnVubmluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e3RydWV9XG4gICAgICAgICAgb3V0cHV0cz17dW5kZWZpbmVkfVxuICAgICAgICAgIGVycm9yPVwiRXJyb3JcIlxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBFcnJvciBzZWN0aW9uIHNob3VsZCBub3QgcmVuZGVyIHdoZW4gaXNSdW5uaW5nIGlzIHRydWVcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmVycm9yJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBwcmV2aWV3Q2h1bmtzIGNhbGN1bGF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoMylcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIG91dHB1dHM9e291dHB1dHN9XG4gICAgICAgICAgZXJyb3I9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmUtcmVuZGVyIHdpdGggc2FtZSBvdXRwdXRzIC0gc2hvdWxkIHVzZSBtZW1vaXplZCB2YWx1ZVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxSZXN1bHRQcmV2aWV3XG4gICAgICAgICAgaXNSdW5uaW5nPXtmYWxzZX1cbiAgICAgICAgICBvdXRwdXRzPXtvdXRwdXRzfVxuICAgICAgICAgIGVycm9yPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25Td2l0Y2hUb0RldGFpbD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJlc3VsdCBDb21wb25lbnQgVGVzdHMgKE1haW4gQ29tcG9uZW50KVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnUmVzdWx0JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICByZXNldEFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFicyBhbmQgcmVzdWx0IHByZXZpZXcgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAuLi5jcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpLnJlc3VsdCxcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgICAgIG91dHB1dHM6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuXG4gICAgICAvLyBUYWJzIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy5yZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy5kZXRhaWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy50cmFjaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBzdGF0ZSBmb3IgUkVTVUxUIHRhYiB3aGVuIHJ1bm5pbmcgd2l0aG91dCBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSBjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIC4uLmNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCkucmVzdWx0LFxuICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgb3V0cHV0czogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmVzdWx0IHByZXZpZXcgd2hlbiByZXN1bHQgaGFzIG91dHB1dHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cygzKVxuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSBjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIC4uLmNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCkucmVzdWx0LFxuICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCxcbiAgICAgICAgICBvdXRwdXRzOiBvdXRwdXRzIGFzIHVua25vd24gYXMgc3RyaW5nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFRhYiBTd2l0Y2hpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVGFiIFN3aXRjaGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHN3aXRjaCB0byBERVRBSUwgdGFiIHdoZW4gY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy5kZXRhaWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Jlc3VsdC1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN3aXRjaCB0byBUUkFDSU5HIHRhYiB3aGVuIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cudHJhY2luZycpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJhY2luZy1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN3aXRjaCBiYWNrIHRvIFJFU1VMVCB0YWIgZnJvbSBvdGhlciB0YWJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoMylcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAuLi5jcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpLnJlc3VsdCxcbiAgICAgICAgICBvdXRwdXRzOiBvdXRwdXRzIGFzIHVua25vd24gYXMgc3RyaW5nLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIC8vIFN3aXRjaCB0byBERVRBSUxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cuZGV0YWlsJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVzdWx0LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFN3aXRjaCBiYWNrIHRvIFJFU1VMVFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy5yZXN1bHQnKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gREVUQUlMIFRhYiBDb250ZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0RFVEFJTCBUYWIgQ29udGVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBSZXN1bHRQYW5lbCB3aXRoIGNvcnJlY3QgcHJvcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgLi4uY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKS5yZXN1bHQsXG4gICAgICAgICAgaW5wdXRzOiAne1wia2V5XCI6IFwidmFsdWVcIn0nLFxuICAgICAgICAgIG91dHB1dHM6ICd7XCJyZXN1bHRcIjogXCJzdWNjZXNzXCJ9JyxcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICBlbGFwc2VkX3RpbWU6IDE1MDAsXG4gICAgICAgICAgdG90YWxfdG9rZW5zOiAyMDAsXG4gICAgICAgICAgY3JlYXRlZF9hdDogMTcwMDAwMDAwMDAwMCxcbiAgICAgICAgICBjcmVhdGVkX2J5OiB7IG5hbWU6ICdUZXN0IFVzZXInIH0gYXMgdW5rbm93biBhcyBzdHJpbmcsXG4gICAgICAgICAgdG90YWxfc3RlcHM6IDEwLFxuICAgICAgICAgIGV4Y2VwdGlvbnNfY291bnQ6IDIsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy5kZXRhaWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdFBhbmVsID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXN1bHQtcGFuZWwnKVxuICAgICAgICBleHBlY3QocmVzdWx0UGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pbnB1dHMnLCAne1wia2V5XCI6IFwidmFsdWVcIn0nKVxuICAgICAgICBleHBlY3QocmVzdWx0UGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vdXRwdXRzJywgJ3tcInJlc3VsdFwiOiBcInN1Y2Nlc3NcIn0nKVxuICAgICAgICBleHBlY3QocmVzdWx0UGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGF0dXMnLCBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3VjY2VlZGVkKVxuICAgICAgICBleHBlY3QocmVzdWx0UGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1lbGFwc2VkLXRpbWUnLCAnMTUwMCcpXG4gICAgICAgIGV4cGVjdChyZXN1bHRQYW5lbCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXRvdGFsLXRva2VucycsICcyMDAnKVxuICAgICAgICBleHBlY3QocmVzdWx0UGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGVwcycsICcxMCcpXG4gICAgICAgIGV4cGVjdChyZXN1bHRQYW5lbCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWV4Y2VwdGlvbi1jb3VudHMnLCAnMicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyB3aGVuIERFVEFJTCB0YWIgaXMgYWN0aXZlIGJ1dCBubyByZXN1bHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgLi4uY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKSxcbiAgICAgICAgcmVzdWx0OiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBXb3JrZmxvd1J1bm5pbmdEYXRhWydyZXN1bHQnXSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cuZGV0YWlsJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXN1bHQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVFJBQ0lORyBUYWIgQ29udGVudCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdUUkFDSU5HIFRhYiBDb250ZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRyYWNpbmdQYW5lbCB3aXRoIHRyYWNpbmcgZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3J1bkxvZy50cmFjaW5nJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCB0cmFjaW5nUGFuZWwgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyYWNpbmctcGFuZWwnKVxuICAgICAgICBleHBlY3QodHJhY2luZ1BhbmVsKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbGlzdC1sZW5ndGgnLCAnMScpXG4gICAgICAgIGV4cGVjdCh0cmFjaW5nUGFuZWwpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jbGFzc25hbWUnLCAnYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgd2hlbiBUUkFDSU5HIHRhYiBpcyBhY3RpdmUgYnV0IG5vIHRyYWNpbmcgZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICB0cmFjaW5nOiBbXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncnVuTG9nLnRyYWNpbmcnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIEJvdGggVHJhY2luZ1BhbmVsIGFuZCBMb2FkaW5nIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmFjaW5nLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFN3aXRjaCB0byBEZXRhaWwgZnJvbSBSZXN1bHQgUHJldmlldyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTd2l0Y2ggdG8gRGV0YWlsIGZyb20gUmVzdWx0IFByZXZpZXcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzd2l0Y2ggdG8gREVUQUlMIHRhYiB3aGVuIG9uU3dpdGNoVG9EZXRhaWwgaXMgdHJpZ2dlcmVkIGZyb20gUmVzdWx0UHJldmlldycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAuLi5jcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpLnJlc3VsdCxcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgZXJyb3I6ICdXb3JrZmxvdyBmYWlsZWQnLFxuICAgICAgICAgIG91dHB1dHM6IHVuZGVmaW5lZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuXG4gICAgICAvLyBDbGljayB0aGUgdmlldyBkZXRhaWxzIGJ1dHRvbiBpbiBlcnJvciBzdGF0ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LnZpZXdEZXRhaWxzJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXN1bHQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB3b3JrZmxvd1J1bm5pbmdEYXRhJywgKCkgPT4ge1xuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIC8vIEFsbCB0YWJzIHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBleHBlY3QoYnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgd29ya2Zsb3dSdW5uaW5nRGF0YSB3aXRoIG5vIHJlc3VsdCcsICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0ge1xuICAgICAgICB0YXNrX2lkOiAndGVzdC10YXNrJyxcbiAgICAgICAgcmVzdWx0OiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBXb3JrZmxvd1J1bm5pbmdEYXRhWydyZXN1bHQnXSxcbiAgICAgICAgdHJhY2luZzogW10sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyBsb2FkaW5nIGluIFJFU1VMVCB0YWIgKGlzUnVubmluZyBjb25kaXRpb24pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlc3VsdCB3aXRoIFJ1bm5pbmcgc3RhdHVzJywgKCkgPT4ge1xuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSBjcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSh7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIC4uLmNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKCkucmVzdWx0LFxuICAgICAgICAgIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICAgICAgb3V0cHV0czogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVzdWx0IHdpdGggU3RvcHBlZCBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgLi4uY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKS5yZXN1bHQsXG4gICAgICAgICAgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuU3RvcHBlZCxcbiAgICAgICAgICBvdXRwdXRzOiB1bmRlZmluZWQsXG4gICAgICAgICAgZXJyb3I6ICdXb3JrZmxvdyB3YXMgc3RvcHBlZCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgLy8gU2hvdWxkIHNob3cgZXJyb3Igd2hlbiBzdG9wcGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiB0YWIgc3RhdGUgYWNyb3NzIHJlLXJlbmRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIC8vIFN3aXRjaCB0byBERVRBSUwgdGFiXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncnVuTG9nLmRldGFpbCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVzdWx0LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlLXJlbmRlciBjb21wb25lbnRcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHQgLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzdGlsbCBiZSBvbiBERVRBSUwgdGFiXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXN1bHQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkaWZmZXJlbnQgc3RhdGVzIGJhc2VkIG9uIHdvcmtmbG93UnVubmluZ0RhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IDE6IFJ1bm5pbmcgc3RhdGUgd2l0aCBubyBvdXRwdXRzXG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhKHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgLi4uY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKS5yZXN1bHQsXG4gICAgICAgICAgc3RhdHVzOiBXb3JrZmxvd1J1bm5pbmdTdGF0dXMuUnVubmluZyxcbiAgICAgICAgICBvdXRwdXRzOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8UmVzdWx0IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmxvYWRpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgdW5tb3VudCgpXG5cbiAgICAgIC8vIFRlc3QgMjogQ29tcGxldGVkIHN0YXRlIHdpdGggb3V0cHV0c1xuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoMylcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAuLi5jcmVhdGVNb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSgpLnJlc3VsdCxcbiAgICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgICAgICAgb3V0cHV0czogb3V0cHV0cyBhcyB1bmtub3duIGFzIHN0cmluZyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UmVzdWx0IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCcsICgpID0+IHtcbiAgICAgIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhID0gY3JlYXRlTW9ja1dvcmtmbG93UnVubmluZ0RhdGEoKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgLy8gUmUtcmVuZGVyIHdpdGhvdXQgY2hhbmdlc1xuICAgICAgcmVyZW5kZXIoPFJlc3VsdCAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBzdGlsbCBiZSByZW5kZXJlZCBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdydW5Mb2cucmVzdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==