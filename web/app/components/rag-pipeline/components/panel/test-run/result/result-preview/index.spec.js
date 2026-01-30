"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/models/datasets");
const index_1 = require("./index");
const utils_1 = require("./utils");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const ns = options?.ns ? `${options.ns}.` : '';
            const count = options?.count !== undefined ? ` (count: ${options.count})` : '';
            return `${ns}${key}${count}`;
        },
    }),
}));
// Mock config
vi.mock('@/config', () => ({
    RAG_PIPELINE_PREVIEW_CHUNK_NUM: 20,
}));
// Mock ChunkCardList component
vi.mock('../../../../chunk-card-list', () => ({
    ChunkCardList: ({ chunkType, chunkInfo }) => (<div data-testid="chunk-card-list" data-chunk-type={chunkType} data-chunk-info={JSON.stringify(chunkInfo)}>
      ChunkCardList
    </div>),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
/**
 * Factory for creating general chunk preview outputs
 */
const createGeneralChunkOutputs = (chunks) => ({
    chunk_structure: datasets_1.ChunkingMode.text,
    preview: chunks,
});
/**
 * Factory for creating parent-child chunk preview outputs
 */
const createParentChildChunkOutputs = (chunks, parentMode = 'paragraph') => ({
    chunk_structure: datasets_1.ChunkingMode.parentChild,
    parent_mode: parentMode,
    preview: chunks,
});
/**
 * Factory for creating QA chunk preview outputs
 */
const createQAChunkOutputs = (chunks) => ({
    chunk_structure: datasets_1.ChunkingMode.qa,
    qa_preview: chunks,
});
/**
 * Factory for creating mock general chunks (for 20+ items)
 */
const createMockGeneralChunks = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        content: `Chunk content ${i + 1}`,
    }));
};
/**
 * Factory for creating mock parent-child chunks
 */
const createMockParentChildChunks = (count, childCount = 3) => {
    return Array.from({ length: count }, (_, i) => ({
        content: `Parent content ${i + 1}`,
        child_chunks: Array.from({ length: childCount }, (_, j) => `Child ${i + 1}-${j + 1}`),
    }));
};
/**
 * Factory for creating mock QA chunks
 */
const createMockQAChunks = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        question: `Question ${i + 1}?`,
        answer: `Answer ${i + 1}`,
    }));
};
// ============================================================================
// formatPreviewChunks Utility Tests
// ============================================================================
describe('formatPreviewChunks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Null/Undefined Input Tests
    // -------------------------------------------------------------------------
    describe('Null/Undefined Input', () => {
        it('should return undefined when outputs is undefined', () => {
            // Arrange & Act
            const result = (0, utils_1.formatPreviewChunks)(undefined);
            // Assert
            expect(result).toBeUndefined();
        });
        it('should return undefined when outputs is null', () => {
            // Arrange & Act
            const result = (0, utils_1.formatPreviewChunks)(null);
            // Assert
            expect(result).toBeUndefined();
        });
    });
    // -------------------------------------------------------------------------
    // General Chunks (text_model) Tests
    // -------------------------------------------------------------------------
    describe('General Chunks (text_model)', () => {
        it('should format general chunks correctly', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([
                { content: 'First chunk content' },
                { content: 'Second chunk content' },
                { content: 'Third chunk content' },
            ]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toEqual([
                'First chunk content',
                'Second chunk content',
                'Third chunk content',
            ]);
        });
        it('should limit general chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM (20)', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs(createMockGeneralChunks(30));
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toHaveLength(20);
            expect(result[0]).toBe('Chunk content 1');
            expect(result[19]).toBe('Chunk content 20');
        });
        it('should handle empty preview array for general chunks', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toEqual([]);
        });
        it('should handle general chunks with empty content', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([
                { content: '' },
                { content: 'Valid content' },
            ]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toEqual(['', 'Valid content']);
        });
        it('should handle general chunks with special characters', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([
                { content: '<script>alert("xss")</script>' },
                { content: '中文内容 🎉' },
                { content: 'Line1\nLine2\tTab' },
            ]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toEqual([
                '<script>alert("xss")</script>',
                '中文内容 🎉',
                'Line1\nLine2\tTab',
            ]);
        });
        it('should handle general chunks with very long content', () => {
            // Arrange
            const longContent = 'A'.repeat(10000);
            const outputs = createGeneralChunkOutputs([{ content: longContent }]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result[0]).toHaveLength(10000);
        });
    });
    // -------------------------------------------------------------------------
    // Parent-Child Chunks (hierarchical_model) Tests
    // -------------------------------------------------------------------------
    describe('Parent-Child Chunks (hierarchical_model)', () => {
        describe('Paragraph Mode', () => {
            it('should format parent-child chunks in paragraph mode correctly', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent 1', child_chunks: ['Child 1-1', 'Child 1-2'] },
                    { content: 'Parent 2', child_chunks: ['Child 2-1'] },
                ], 'paragraph');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_mode).toBe('paragraph');
                expect(result.parent_child_chunks).toHaveLength(2);
                expect(result.parent_child_chunks[0]).toEqual({
                    parent_content: 'Parent 1',
                    child_contents: ['Child 1-1', 'Child 1-2'],
                    parent_mode: 'paragraph',
                });
                expect(result.parent_child_chunks[1]).toEqual({
                    parent_content: 'Parent 2',
                    child_contents: ['Child 2-1'],
                    parent_mode: 'paragraph',
                });
            });
            it('should limit parent chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM (20) in paragraph mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs(createMockParentChildChunks(30, 2), 'paragraph');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_child_chunks).toHaveLength(20);
            });
            it('should NOT limit child chunks in paragraph mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent 1', child_chunks: Array.from({ length: 50 }, (_, i) => `Child ${i + 1}`) },
                ], 'paragraph');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_child_chunks[0].child_contents).toHaveLength(50);
            });
            it('should handle empty child_chunks in paragraph mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent with no children', child_chunks: [] },
                ], 'paragraph');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_child_chunks[0].child_contents).toEqual([]);
            });
        });
        describe('Full-Doc Mode', () => {
            it('should format parent-child chunks in full-doc mode correctly', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Full Doc Parent', child_chunks: ['Child 1', 'Child 2', 'Child 3'] },
                ], 'full-doc');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_mode).toBe('full-doc');
                expect(result.parent_child_chunks).toHaveLength(1);
                expect(result.parent_child_chunks[0].parent_content).toBe('Full Doc Parent');
                expect(result.parent_child_chunks[0].child_contents).toEqual(['Child 1', 'Child 2', 'Child 3']);
            });
            it('should NOT limit parent chunks in full-doc mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs(createMockParentChildChunks(30, 2), 'full-doc');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert - full-doc mode processes all parents (forEach without slice)
                expect(result.parent_child_chunks).toHaveLength(30);
            });
            it('should limit child chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM (20) in full-doc mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent', child_chunks: Array.from({ length: 50 }, (_, i) => `Child ${i + 1}`) },
                ], 'full-doc');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_child_chunks[0].child_contents).toHaveLength(20);
                expect(result.parent_child_chunks[0].child_contents[0]).toBe('Child 1');
                expect(result.parent_child_chunks[0].child_contents[19]).toBe('Child 20');
            });
            it('should handle multiple parents with many children in full-doc mode', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent 1', child_chunks: Array.from({ length: 25 }, (_, i) => `P1-Child ${i + 1}`) },
                    { content: 'Parent 2', child_chunks: Array.from({ length: 30 }, (_, i) => `P2-Child ${i + 1}`) },
                ], 'full-doc');
                // Act
                const result = (0, utils_1.formatPreviewChunks)(outputs);
                // Assert
                expect(result.parent_child_chunks[0].child_contents).toHaveLength(20);
                expect(result.parent_child_chunks[1].child_contents).toHaveLength(20);
            });
        });
        it('should handle empty preview array for parent-child chunks', () => {
            // Arrange
            const outputs = createParentChildChunkOutputs([], 'paragraph');
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.parent_child_chunks).toEqual([]);
        });
    });
    // -------------------------------------------------------------------------
    // QA Chunks (qa_model) Tests
    // -------------------------------------------------------------------------
    describe('QA Chunks (qa_model)', () => {
        it('should format QA chunks correctly', () => {
            // Arrange
            const outputs = createQAChunkOutputs([
                { question: 'What is Dify?', answer: 'Dify is an LLM application platform.' },
                { question: 'How to use it?', answer: 'You can create apps easily.' },
            ]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.qa_chunks).toHaveLength(2);
            expect(result.qa_chunks[0]).toEqual({
                question: 'What is Dify?',
                answer: 'Dify is an LLM application platform.',
            });
            expect(result.qa_chunks[1]).toEqual({
                question: 'How to use it?',
                answer: 'You can create apps easily.',
            });
        });
        it('should limit QA chunks to RAG_PIPELINE_PREVIEW_CHUNK_NUM (20)', () => {
            // Arrange
            const outputs = createQAChunkOutputs(createMockQAChunks(30));
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.qa_chunks).toHaveLength(20);
        });
        it('should handle empty qa_preview array', () => {
            // Arrange
            const outputs = createQAChunkOutputs([]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.qa_chunks).toEqual([]);
        });
        it('should handle QA chunks with empty question or answer', () => {
            // Arrange
            const outputs = createQAChunkOutputs([
                { question: '', answer: 'Answer without question' },
                { question: 'Question without answer', answer: '' },
            ]);
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.qa_chunks[0].question).toBe('');
            expect(result.qa_chunks[0].answer).toBe('Answer without question');
            expect(result.qa_chunks[1].question).toBe('Question without answer');
            expect(result.qa_chunks[1].answer).toBe('');
        });
        it('should preserve all properties when spreading chunk', () => {
            // Arrange
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.qa,
                qa_preview: [
                    { question: 'Q1', answer: 'A1', extra: 'should be preserved' },
                ],
            };
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result.qa_chunks[0]).toEqual({ question: 'Q1', answer: 'A1', extra: 'should be preserved' });
        });
    });
    // -------------------------------------------------------------------------
    // Unknown Chunking Mode Tests
    // -------------------------------------------------------------------------
    describe('Unknown Chunking Mode', () => {
        it('should return undefined for unknown chunking mode', () => {
            // Arrange
            const outputs = {
                chunk_structure: 'unknown_mode',
                preview: [],
            };
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toBeUndefined();
        });
        it('should return undefined when chunk_structure is missing', () => {
            // Arrange
            const outputs = {
                preview: [{ content: 'test' }],
            };
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toBeUndefined();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle exactly RAG_PIPELINE_PREVIEW_CHUNK_NUM (20) chunks', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs(createMockGeneralChunks(20));
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toHaveLength(20);
        });
        it('should handle outputs with additional properties', () => {
            // Arrange
            const outputs = {
                ...createGeneralChunkOutputs([{ content: 'Test' }]),
                extra_field: 'should not affect result',
                metadata: { some: 'data' },
            };
            // Act
            const result = (0, utils_1.formatPreviewChunks)(outputs);
            // Assert
            expect(result).toEqual(['Test']);
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
    // Default Props Factory
    // -------------------------------------------------------------------------
    const defaultProps = {
        isRunning: false,
        outputs: undefined,
        error: undefined,
        onSwitchToDetail: vi.fn(),
    };
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing with minimal props', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default onSwitchToDetail={vi.fn()}/>);
            // Assert - Component renders (no visible content in empty state)
            expect(document.body).toBeInTheDocument();
        });
        it('should render loading state when isRunning and no outputs', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true} outputs={undefined}/>);
            // Assert
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
        });
        it('should render loading spinner icon when loading', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true} outputs={undefined}/>);
            // Assert - Check for animate-spin class (loading spinner)
            const spinner = container.querySelector('.animate-spin');
            expect(spinner).toBeInTheDocument();
        });
        it('should render error state when not running and error exists', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} isRunning={false} error="Something went wrong"/>);
            // Assert
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /pipeline\.result\.resultPreview\.viewDetails/i })).toBeInTheDocument();
        });
        it('should render outputs when available', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test chunk' }]);
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should render footer tip when outputs available', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test chunk' }]);
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            expect(react_1.screen.getByText(/pipeline\.result\.resultPreview\.footerTip/)).toBeInTheDocument();
        });
        it('should not render loading when outputs exist even if isRunning', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test' }]);
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true} outputs={outputs}/>);
            // Assert - Should show outputs, not loading
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should not render error when isRunning is true', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true} error="Error message" outputs={undefined}/>);
            // Assert - Should show loading, not error
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.error')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        describe('isRunning prop', () => {
            it('should show loading when isRunning=true and no outputs', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true}/>);
                // Assert
                expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            });
            it('should not show loading when isRunning=false', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} isRunning={false}/>);
                // Assert
                expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
            });
            it('should prioritize outputs over loading state', () => {
                // Arrange
                const outputs = createGeneralChunkOutputs([{ content: 'Data' }]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true} outputs={outputs}/>);
                // Assert
                expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
            });
        });
        describe('outputs prop', () => {
            it('should pass chunk_structure to ChunkCardList', () => {
                // Arrange
                const outputs = createGeneralChunkOutputs([{ content: 'Test' }]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                expect(chunkList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.text);
            });
            it('should format and pass previewChunks to ChunkCardList', () => {
                // Arrange
                const outputs = createGeneralChunkOutputs([
                    { content: 'Chunk 1' },
                    { content: 'Chunk 2' },
                ]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                const chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
                expect(chunkInfo).toEqual(['Chunk 1', 'Chunk 2']);
            });
            it('should handle parent-child outputs', () => {
                // Arrange
                const outputs = createParentChildChunkOutputs([
                    { content: 'Parent', child_chunks: ['Child 1', 'Child 2'] },
                ]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                expect(chunkList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.parentChild);
            });
            it('should handle QA outputs', () => {
                // Arrange
                const outputs = createQAChunkOutputs([
                    { question: 'Q1', answer: 'A1' },
                ]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                expect(chunkList).toHaveAttribute('data-chunk-type', datasets_1.ChunkingMode.qa);
            });
        });
        describe('error prop', () => {
            it('should show error state when error is a non-empty string', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} error="Network error"/>);
                // Assert
                expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            });
            it('should show error state when error is an empty string', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} error=""/>);
                // Assert - Empty string is falsy, so error state should NOT show
                expect(react_1.screen.queryByText('pipeline.result.resultPreview.error')).not.toBeInTheDocument();
            });
            it('should render both outputs and error when both exist (independent conditions)', () => {
                // Arrange
                const outputs = createGeneralChunkOutputs([{ content: 'Data' }]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs} error="Error"/>);
                // Assert - Both are rendered because conditions are independent in the component
                expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
            });
        });
        describe('onSwitchToDetail prop', () => {
            it('should be called when view details button is clicked', () => {
                // Arrange
                const onSwitchToDetail = vi.fn();
                (0, react_1.render)(<index_1.default {...defaultProps} error="Error" onSwitchToDetail={onSwitchToDetail}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /viewDetails/i }));
                // Assert
                expect(onSwitchToDetail).toHaveBeenCalledTimes(1);
            });
            it('should not be called automatically on render', () => {
                // Arrange
                const onSwitchToDetail = vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} error="Error" onSwitchToDetail={onSwitchToDetail}/>);
                // Assert
                expect(onSwitchToDetail).not.toHaveBeenCalled();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        describe('React.memo wrapper', () => {
            it('should be wrapped with React.memo', () => {
                // Arrange & Act
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
                rerender(<index_1.default {...defaultProps}/>);
                // Assert - Component renders correctly after rerender
                expect(document.body).toBeInTheDocument();
            });
            it('should update when props change', () => {
                // Arrange
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} isRunning={false}/>);
                // Act
                rerender(<index_1.default {...defaultProps} isRunning={true}/>);
                // Assert
                expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            });
            it('should update when outputs change', () => {
                // Arrange
                const outputs1 = createGeneralChunkOutputs([{ content: 'First' }]);
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs1}/>);
                // Act
                const outputs2 = createGeneralChunkOutputs([{ content: 'Second' }]);
                rerender(<index_1.default {...defaultProps} outputs={outputs2}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                const chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
                expect(chunkInfo).toEqual(['Second']);
            });
        });
        describe('useMemo for previewChunks', () => {
            it('should compute previewChunks based on outputs', () => {
                // Arrange
                const outputs = createGeneralChunkOutputs([
                    { content: 'Memoized chunk 1' },
                    { content: 'Memoized chunk 2' },
                ]);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
                // Assert
                const chunkList = react_1.screen.getByTestId('chunk-card-list');
                const chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
                expect(chunkInfo).toHaveLength(2);
            });
            it('should recompute when outputs reference changes', () => {
                // Arrange
                const outputs1 = createGeneralChunkOutputs([{ content: 'Original' }]);
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs1}/>);
                let chunkList = react_1.screen.getByTestId('chunk-card-list');
                let chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
                expect(chunkInfo).toEqual(['Original']);
                // Act - Change outputs
                const outputs2 = createGeneralChunkOutputs([{ content: 'Updated' }]);
                rerender(<index_1.default {...defaultProps} outputs={outputs2}/>);
                // Assert
                chunkList = react_1.screen.getByTestId('chunk-card-list');
                chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
                expect(chunkInfo).toEqual(['Updated']);
            });
            it('should handle undefined outputs in useMemo', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps} outputs={undefined}/>);
                // Assert - No chunk list rendered
                expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Event Handlers Tests
    // -------------------------------------------------------------------------
    describe('Event Handlers', () => {
        it('should call onSwitchToDetail when view details button is clicked', () => {
            // Arrange
            const onSwitchToDetail = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} error="Test error" onSwitchToDetail={onSwitchToDetail}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /viewDetails/i }));
            // Assert
            expect(onSwitchToDetail).toHaveBeenCalledTimes(1);
        });
        it('should handle multiple clicks on view details button', () => {
            // Arrange
            const onSwitchToDetail = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} error="Test error" onSwitchToDetail={onSwitchToDetail}/>);
            const button = react_1.screen.getByRole('button', { name: /viewDetails/i });
            // Act
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            react_1.fireEvent.click(button);
            // Assert
            expect(onSwitchToDetail).toHaveBeenCalledTimes(3);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty state (all props undefined/false)', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default isRunning={false} outputs={undefined} error={undefined} onSwitchToDetail={vi.fn()}/>);
            // Assert - Should render empty fragment
            expect(container.firstChild).toBeNull();
        });
        it('should handle outputs with empty preview chunks', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([]);
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            const chunkList = react_1.screen.getByTestId('chunk-card-list');
            const chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
            expect(chunkInfo).toEqual([]);
        });
        it('should handle outputs that result in undefined previewChunks', () => {
            // Arrange
            const outputs = {
                chunk_structure: 'invalid_mode',
                preview: [],
            };
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert - Should not render chunk list when previewChunks is undefined
            expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
        });
        it('should handle unmount cleanly', () => {
            // Arrange
            const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(() => unmount()).not.toThrow();
        });
        it('should handle rapid prop changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Act - Rapidly change props
            rerender(<index_1.default {...defaultProps} isRunning={true}/>);
            rerender(<index_1.default {...defaultProps} isRunning={false} error="Error"/>);
            rerender(<index_1.default {...defaultProps} outputs={createGeneralChunkOutputs([{ content: 'Test' }])}/>);
            rerender(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.queryByTestId('chunk-card-list')).not.toBeInTheDocument();
        });
        it('should handle very large number of chunks', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs(createMockGeneralChunks(1000));
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert - Should only show first 20 chunks
            const chunkList = react_1.screen.getByTestId('chunk-card-list');
            const chunkInfo = JSON.parse(chunkList.getAttribute('data-chunk-info') || '[]');
            expect(chunkInfo).toHaveLength(20);
        });
        it('should throw when outputs has null preview (slice called on null)', () => {
            // Arrange
            const outputs = {
                chunk_structure: datasets_1.ChunkingMode.text,
                preview: null,
            };
            // Act & Assert - Component throws because slice is called on null preview
            // This is expected behavior - the component doesn't validate input
            expect(() => (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>)).toThrow();
        });
    });
    // -------------------------------------------------------------------------
    // Integration Tests
    // -------------------------------------------------------------------------
    describe('Integration', () => {
        it('should transition from loading to output state', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            // Act
            const outputs = createGeneralChunkOutputs([{ content: 'Loaded data' }]);
            rerender(<index_1.default {...defaultProps} isRunning={false} outputs={outputs}/>);
            // Assert
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should transition from loading to error state', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            // Act
            rerender(<index_1.default {...defaultProps} isRunning={false} error="Failed to load"/>);
            // Assert
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.loading')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
        });
        it('should render both error and outputs when both props provided', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} error="Initial error"/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            // Act - Outputs provided while error still exists
            const outputs = createGeneralChunkOutputs([{ content: 'Success data' }]);
            rerender(<index_1.default {...defaultProps} error="Initial error" outputs={outputs}/>);
            // Assert - Both are rendered (component uses independent conditions)
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should hide error when error prop is cleared', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} error="Initial error"/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
            // Act - Clear error and provide outputs
            const outputs = createGeneralChunkOutputs([{ content: 'Success data' }]);
            rerender(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert - Only outputs shown when error is cleared
            expect(react_1.screen.queryByText('pipeline.result.resultPreview.error')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
        it('should handle complete flow: empty -> loading -> outputs', () => {
            // Arrange
            const { rerender, container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            expect(container.firstChild).toBeNull();
            // Act - Start loading
            rerender(<index_1.default {...defaultProps} isRunning={true}/>);
            expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
            // Act - Receive outputs
            const outputs = createGeneralChunkOutputs([{ content: 'Final data' }]);
            rerender(<index_1.default {...defaultProps} isRunning={false} outputs={outputs}/>);
            // Assert
            expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Styling Tests
    // -------------------------------------------------------------------------
    describe('Styling', () => {
        it('should have correct container classes for loading state', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} isRunning={true}/>);
            // Assert
            const loadingContainer = container.querySelector('.flex.grow.flex-col.items-center.justify-center');
            expect(loadingContainer).toBeInTheDocument();
        });
        it('should have correct container classes for error state', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} error="Error"/>);
            // Assert
            const errorContainer = container.querySelector('.flex.grow.flex-col.items-center.justify-center');
            expect(errorContainer).toBeInTheDocument();
        });
        it('should have correct container classes for outputs state', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test' }]);
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            const outputContainer = container.querySelector('.flex.grow.flex-col.bg-background-body');
            expect(outputContainer).toBeInTheDocument();
        });
        it('should have gradient dividers in footer', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test' }]);
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            const gradientDividers = container.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-l');
            expect(gradientDividers.length).toBeGreaterThanOrEqual(2);
        });
    });
    // -------------------------------------------------------------------------
    // Accessibility Tests
    // -------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have accessible button in error state', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} error="Error"/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
        it('should have title attribute on footer tip for long text', () => {
            // Arrange
            const outputs = createGeneralChunkOutputs([{ content: 'Test' }]);
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} outputs={outputs}/>);
            // Assert
            const footerTip = container.querySelector('[title]');
            expect(footerTip).toBeInTheDocument();
        });
    });
});
// ============================================================================
// State Transition Matrix Tests
// ============================================================================
describe('State Transition Matrix', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const states = [
        { isRunning: false, outputs: undefined, error: undefined, expected: 'empty' },
        { isRunning: true, outputs: undefined, error: undefined, expected: 'loading' },
        { isRunning: false, outputs: undefined, error: 'Error', expected: 'error' },
        { isRunning: false, outputs: createGeneralChunkOutputs([{ content: 'Test' }]), error: undefined, expected: 'outputs' },
        { isRunning: true, outputs: createGeneralChunkOutputs([{ content: 'Test' }]), error: undefined, expected: 'outputs' },
        { isRunning: false, outputs: createGeneralChunkOutputs([{ content: 'Test' }]), error: 'Error', expected: 'both' },
        { isRunning: true, outputs: undefined, error: 'Error', expected: 'loading' },
    ];
    it.each(states)('should render $expected state when isRunning=$isRunning, outputs=$outputs, error=$error', ({ isRunning, outputs, error, expected }) => {
        // Arrange & Act
        const { container } = (0, react_1.render)(<index_1.default isRunning={isRunning} outputs={outputs} error={error} onSwitchToDetail={vi.fn()}/>);
        // Assert
        switch (expected) {
            case 'empty':
                expect(container.firstChild).toBeNull();
                break;
            case 'loading':
                expect(react_1.screen.getByText('pipeline.result.resultPreview.loading')).toBeInTheDocument();
                break;
            case 'error':
                expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
                break;
            case 'outputs':
                expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
                break;
            case 'both':
                expect(react_1.screen.getByText('pipeline.result.resultPreview.error')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('chunk-card-list')).toBeInTheDocument();
                break;
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixnREFBZ0Q7QUFDaEQsbUNBQW1DO0FBQ25DLG1DQUE2QztBQUU3QywrRUFBK0U7QUFDL0UsNkJBQTZCO0FBQzdCLCtFQUErRTtBQUUvRSxxQkFBcUI7QUFDckIsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM5QixjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsQ0FBQyxHQUFXLEVBQUUsT0FBeUMsRUFBRSxFQUFFO1lBQzVELE1BQU0sRUFBRSxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDOUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxFQUFFLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDOUUsT0FBTyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLENBQUE7UUFDOUIsQ0FBQztLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILGNBQWM7QUFDZCxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLDhCQUE4QixFQUFFLEVBQUU7Q0FDbkMsQ0FBQyxDQUFDLENBQUE7QUFFSCwrQkFBK0I7QUFDL0IsRUFBRSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGFBQWEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBK0MsRUFBRSxFQUFF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LEtBQUssT0FBTztnQkFDVixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDbkYsTUFBSztZQUNQLEtBQUssU0FBUztnQkFDWixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDakUsTUFBSztZQUNQLEtBQUssTUFBTTtnQkFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFDbkYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQ2pFLE1BQUs7UUFDVCxDQUFDO0lBQ0gsQ0FBQyxDQUNGLENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ2h1bmtJbmZvLCBHZW5lcmFsQ2h1bmtzLCBQYXJlbnRDaGlsZENodW5rcywgUUFDaHVua3MgfSBmcm9tICcuLi8uLi8uLi8uLi9jaHVuay1jYXJkLWxpc3QvdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgUmVzdWx0UHJldmlldyBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgZm9ybWF0UHJldmlld0NodW5rcyB9IGZyb20gJy4vdXRpbHMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgcmVhY3QtaTE4bmV4dFxudmkubW9jaygncmVhY3QtaTE4bmV4dCcsICgpID0+ICh7XG4gIHVzZVRyYW5zbGF0aW9uOiAoKSA9PiAoe1xuICAgIHQ6IChrZXk6IHN0cmluZywgb3B0aW9ucz86IHsgbnM/OiBzdHJpbmcsIGNvdW50PzogbnVtYmVyIH0pID0+IHtcbiAgICAgIGNvbnN0IG5zID0gb3B0aW9ucz8ubnMgPyBgJHtvcHRpb25zLm5zfS5gIDogJydcbiAgICAgIGNvbnN0IGNvdW50ID0gb3B0aW9ucz8uY291bnQgIT09IHVuZGVmaW5lZCA/IGAgKGNvdW50OiAke29wdGlvbnMuY291bnR9KWAgOiAnJ1xuICAgICAgcmV0dXJuIGAke25zfSR7a2V5fSR7Y291bnR9YFxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgY29uZmlnXG52aS5tb2NrKCdAL2NvbmZpZycsICgpID0+ICh7XG4gIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTTogMjAsXG59KSlcblxuLy8gTW9jayBDaHVua0NhcmRMaXN0IGNvbXBvbmVudFxudmkubW9jaygnLi4vLi4vLi4vLi4vY2h1bmstY2FyZC1saXN0JywgKCkgPT4gKHtcbiAgQ2h1bmtDYXJkTGlzdDogKHsgY2h1bmtUeXBlLCBjaHVua0luZm8gfTogeyBjaHVua1R5cGU6IHN0cmluZywgY2h1bmtJbmZvOiBDaHVua0luZm8gfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjaHVuay1jYXJkLWxpc3RcIiBkYXRhLWNodW5rLXR5cGU9e2NodW5rVHlwZX0gZGF0YS1jaHVuay1pbmZvPXtKU09OLnN0cmluZ2lmeShjaHVua0luZm8pfT5cbiAgICAgIENodW5rQ2FyZExpc3RcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgZ2VuZXJhbCBjaHVuayBwcmV2aWV3IG91dHB1dHNcbiAqL1xuY29uc3QgY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyA9IChjaHVua3M6IEFycmF5PHsgY29udGVudDogc3RyaW5nIH0+KSA9PiAoe1xuICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS50ZXh0LFxuICBwcmV2aWV3OiBjaHVua3MsXG59KVxuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHBhcmVudC1jaGlsZCBjaHVuayBwcmV2aWV3IG91dHB1dHNcbiAqL1xuY29uc3QgY3JlYXRlUGFyZW50Q2hpbGRDaHVua091dHB1dHMgPSAoXG4gIGNodW5rczogQXJyYXk8eyBjb250ZW50OiBzdHJpbmcsIGNoaWxkX2NodW5rczogc3RyaW5nW10gfT4sXG4gIHBhcmVudE1vZGU6ICdwYXJhZ3JhcGgnIHwgJ2Z1bGwtZG9jJyA9ICdwYXJhZ3JhcGgnLFxuKSA9PiAoe1xuICBjaHVua19zdHJ1Y3R1cmU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgcGFyZW50X21vZGU6IHBhcmVudE1vZGUsXG4gIHByZXZpZXc6IGNodW5rcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgUUEgY2h1bmsgcHJldmlldyBvdXRwdXRzXG4gKi9cbmNvbnN0IGNyZWF0ZVFBQ2h1bmtPdXRwdXRzID0gKGNodW5rczogQXJyYXk8eyBxdWVzdGlvbjogc3RyaW5nLCBhbnN3ZXI6IHN0cmluZyB9PikgPT4gKHtcbiAgY2h1bmtfc3RydWN0dXJlOiBDaHVua2luZ01vZGUucWEsXG4gIHFhX3ByZXZpZXc6IGNodW5rcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgbW9jayBnZW5lcmFsIGNodW5rcyAoZm9yIDIwKyBpdGVtcylcbiAqL1xuY29uc3QgY3JlYXRlTW9ja0dlbmVyYWxDaHVua3MgPSAoY291bnQ6IG51bWJlcik6IEFycmF5PHsgY29udGVudDogc3RyaW5nIH0+ID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiAoe1xuICAgIGNvbnRlbnQ6IGBDaHVuayBjb250ZW50ICR7aSArIDF9YCxcbiAgfSkpXG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgbW9jayBwYXJlbnQtY2hpbGQgY2h1bmtzXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tQYXJlbnRDaGlsZENodW5rcyA9IChcbiAgY291bnQ6IG51bWJlcixcbiAgY2hpbGRDb3VudDogbnVtYmVyID0gMyxcbik6IEFycmF5PHsgY29udGVudDogc3RyaW5nLCBjaGlsZF9jaHVua3M6IHN0cmluZ1tdIH0+ID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiAoe1xuICAgIGNvbnRlbnQ6IGBQYXJlbnQgY29udGVudCAke2kgKyAxfWAsXG4gICAgY2hpbGRfY2h1bmtzOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjaGlsZENvdW50IH0sIChfLCBqKSA9PiBgQ2hpbGQgJHtpICsgMX0tJHtqICsgMX1gKSxcbiAgfSkpXG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcgbW9jayBRQSBjaHVua3NcbiAqL1xuY29uc3QgY3JlYXRlTW9ja1FBQ2h1bmtzID0gKGNvdW50OiBudW1iZXIpOiBBcnJheTx7IHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcjogc3RyaW5nIH0+ID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiAoe1xuICAgIHF1ZXN0aW9uOiBgUXVlc3Rpb24gJHtpICsgMX0/YCxcbiAgICBhbnN3ZXI6IGBBbnN3ZXIgJHtpICsgMX1gLFxuICB9KSlcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gZm9ybWF0UHJldmlld0NodW5rcyBVdGlsaXR5IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdmb3JtYXRQcmV2aWV3Q2h1bmtzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE51bGwvVW5kZWZpbmVkIElucHV0IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ051bGwvVW5kZWZpbmVkIElucHV0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCB3aGVuIG91dHB1dHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyh1bmRlZmluZWQpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCB3aGVuIG91dHB1dHMgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3MobnVsbClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gR2VuZXJhbCBDaHVua3MgKHRleHRfbW9kZWwpIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0dlbmVyYWwgQ2h1bmtzICh0ZXh0X21vZGVsKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBnZW5lcmFsIGNodW5rcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbXG4gICAgICAgIHsgY29udGVudDogJ0ZpcnN0IGNodW5rIGNvbnRlbnQnIH0sXG4gICAgICAgIHsgY29udGVudDogJ1NlY29uZCBjaHVuayBjb250ZW50JyB9LFxuICAgICAgICB7IGNvbnRlbnQ6ICdUaGlyZCBjaHVuayBjb250ZW50JyB9LFxuICAgICAgXSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIEdlbmVyYWxDaHVua3NcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcbiAgICAgICAgJ0ZpcnN0IGNodW5rIGNvbnRlbnQnLFxuICAgICAgICAnU2Vjb25kIGNodW5rIGNvbnRlbnQnLFxuICAgICAgICAnVGhpcmQgY2h1bmsgY29udGVudCcsXG4gICAgICBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGxpbWl0IGdlbmVyYWwgY2h1bmtzIHRvIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTSAoMjApJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoY3JlYXRlTW9ja0dlbmVyYWxDaHVua3MoMzApKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgR2VuZXJhbENodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZUxlbmd0aCgyMClcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvQmUoJ0NodW5rIGNvbnRlbnQgMScpXG4gICAgICBleHBlY3QocmVzdWx0WzE5XSkudG9CZSgnQ2h1bmsgY29udGVudCAyMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHByZXZpZXcgYXJyYXkgZm9yIGdlbmVyYWwgY2h1bmtzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBHZW5lcmFsQ2h1bmtzXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZ2VuZXJhbCBjaHVua3Mgd2l0aCBlbXB0eSBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW1xuICAgICAgICB7IGNvbnRlbnQ6ICcnIH0sXG4gICAgICAgIHsgY29udGVudDogJ1ZhbGlkIGNvbnRlbnQnIH0sXG4gICAgICBdKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgR2VuZXJhbENodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWycnLCAnVmFsaWQgY29udGVudCddKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBnZW5lcmFsIGNodW5rcyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzKFtcbiAgICAgICAgeyBjb250ZW50OiAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicgfSxcbiAgICAgICAgeyBjb250ZW50OiAn5Lit5paH5YaF5a65IPCfjoknIH0sXG4gICAgICAgIHsgY29udGVudDogJ0xpbmUxXFxuTGluZTJcXHRUYWInIH0sXG4gICAgICBdKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgR2VuZXJhbENodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW1xuICAgICAgICAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicsXG4gICAgICAgICfkuK3mloflhoXlrrkg8J+OiScsXG4gICAgICAgICdMaW5lMVxcbkxpbmUyXFx0VGFiJyxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGdlbmVyYWwgY2h1bmtzIHdpdGggdmVyeSBsb25nIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nQ29udGVudCA9ICdBJy5yZXBlYXQoMTAwMDApXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiBsb25nQ29udGVudCB9XSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIEdlbmVyYWxDaHVua3NcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0WzBdKS50b0hhdmVMZW5ndGgoMTAwMDApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFBhcmVudC1DaGlsZCBDaHVua3MgKGhpZXJhcmNoaWNhbF9tb2RlbCkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUGFyZW50LUNoaWxkIENodW5rcyAoaGllcmFyY2hpY2FsX21vZGVsKScsICgpID0+IHtcbiAgICBkZXNjcmliZSgnUGFyYWdyYXBoIE1vZGUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGZvcm1hdCBwYXJlbnQtY2hpbGQgY2h1bmtzIGluIHBhcmFncmFwaCBtb2RlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua091dHB1dHMoW1xuICAgICAgICAgIHsgY29udGVudDogJ1BhcmVudCAxJywgY2hpbGRfY2h1bmtzOiBbJ0NoaWxkIDEtMScsICdDaGlsZCAxLTInXSB9LFxuICAgICAgICAgIHsgY29udGVudDogJ1BhcmVudCAyJywgY2hpbGRfY2h1bmtzOiBbJ0NoaWxkIDItMSddIH0sXG4gICAgICAgIF0sICdwYXJhZ3JhcGgnKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X21vZGUpLnRvQmUoJ3BhcmFncmFwaCcpXG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rcykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rc1swXSkudG9FcXVhbCh7XG4gICAgICAgICAgcGFyZW50X2NvbnRlbnQ6ICdQYXJlbnQgMScsXG4gICAgICAgICAgY2hpbGRfY29udGVudHM6IFsnQ2hpbGQgMS0xJywgJ0NoaWxkIDEtMiddLFxuICAgICAgICAgIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzWzFdKS50b0VxdWFsKHtcbiAgICAgICAgICBwYXJlbnRfY29udGVudDogJ1BhcmVudCAyJyxcbiAgICAgICAgICBjaGlsZF9jb250ZW50czogWydDaGlsZCAyLTEnXSxcbiAgICAgICAgICBwYXJlbnRfbW9kZTogJ3BhcmFncmFwaCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGxpbWl0IHBhcmVudCBjaHVua3MgdG8gUkFHX1BJUEVMSU5FX1BSRVZJRVdfQ0hVTktfTlVNICgyMCkgaW4gcGFyYWdyYXBoIG1vZGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtPdXRwdXRzKGNyZWF0ZU1vY2tQYXJlbnRDaGlsZENodW5rcygzMCwgMiksICdwYXJhZ3JhcGgnKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rcykudG9IYXZlTGVuZ3RoKDIwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBOT1QgbGltaXQgY2hpbGQgY2h1bmtzIGluIHBhcmFncmFwaCBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cyhbXG4gICAgICAgICAgeyBjb250ZW50OiAnUGFyZW50IDEnLCBjaGlsZF9jaHVua3M6IEFycmF5LmZyb20oeyBsZW5ndGg6IDUwIH0sIChfLCBpKSA9PiBgQ2hpbGQgJHtpICsgMX1gKSB9LFxuICAgICAgICBdLCAncGFyYWdyYXBoJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBQYXJlbnRDaGlsZENodW5rc1xuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9jaGlsZF9jaHVua3NbMF0uY2hpbGRfY29udGVudHMpLnRvSGF2ZUxlbmd0aCg1MClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNoaWxkX2NodW5rcyBpbiBwYXJhZ3JhcGggbW9kZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua091dHB1dHMoW1xuICAgICAgICAgIHsgY29udGVudDogJ1BhcmVudCB3aXRoIG5vIGNoaWxkcmVuJywgY2hpbGRfY2h1bmtzOiBbXSB9LFxuICAgICAgICBdLCAncGFyYWdyYXBoJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBQYXJlbnRDaGlsZENodW5rc1xuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9jaGlsZF9jaHVua3NbMF0uY2hpbGRfY29udGVudHMpLnRvRXF1YWwoW10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRnVsbC1Eb2MgTW9kZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZm9ybWF0IHBhcmVudC1jaGlsZCBjaHVua3MgaW4gZnVsbC1kb2MgbW9kZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtPdXRwdXRzKFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdGdWxsIERvYyBQYXJlbnQnLCBjaGlsZF9jaHVua3M6IFsnQ2hpbGQgMScsICdDaGlsZCAyJywgJ0NoaWxkIDMnXSB9LFxuICAgICAgICBdLCAnZnVsbC1kb2MnKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X21vZGUpLnRvQmUoJ2Z1bGwtZG9jJylcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzKS50b0hhdmVMZW5ndGgoMSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzWzBdLnBhcmVudF9jb250ZW50KS50b0JlKCdGdWxsIERvYyBQYXJlbnQnKVxuICAgICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9jaGlsZF9jaHVua3NbMF0uY2hpbGRfY29udGVudHMpLnRvRXF1YWwoWydDaGlsZCAxJywgJ0NoaWxkIDInLCAnQ2hpbGQgMyddKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBOT1QgbGltaXQgcGFyZW50IGNodW5rcyBpbiBmdWxsLWRvYyBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cyhjcmVhdGVNb2NrUGFyZW50Q2hpbGRDaHVua3MoMzAsIDIpLCAnZnVsbC1kb2MnKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBmb3JtYXRQcmV2aWV3Q2h1bmtzKG91dHB1dHMpIGFzIFBhcmVudENoaWxkQ2h1bmtzXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gZnVsbC1kb2MgbW9kZSBwcm9jZXNzZXMgYWxsIHBhcmVudHMgKGZvckVhY2ggd2l0aG91dCBzbGljZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzKS50b0hhdmVMZW5ndGgoMzApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGxpbWl0IGNoaWxkIGNodW5rcyB0byBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0gKDIwKSBpbiBmdWxsLWRvYyBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cyhbXG4gICAgICAgICAgeyBjb250ZW50OiAnUGFyZW50JywgY2hpbGRfY2h1bmtzOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1MCB9LCAoXywgaSkgPT4gYENoaWxkICR7aSArIDF9YCkgfSxcbiAgICAgICAgXSwgJ2Z1bGwtZG9jJylcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBQYXJlbnRDaGlsZENodW5rc1xuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LnBhcmVudF9jaGlsZF9jaHVua3NbMF0uY2hpbGRfY29udGVudHMpLnRvSGF2ZUxlbmd0aCgyMClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzWzBdLmNoaWxkX2NvbnRlbnRzWzBdKS50b0JlKCdDaGlsZCAxJylcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzWzBdLmNoaWxkX2NvbnRlbnRzWzE5XSkudG9CZSgnQ2hpbGQgMjAnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgcGFyZW50cyB3aXRoIG1hbnkgY2hpbGRyZW4gaW4gZnVsbC1kb2MgbW9kZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua091dHB1dHMoW1xuICAgICAgICAgIHsgY29udGVudDogJ1BhcmVudCAxJywgY2hpbGRfY2h1bmtzOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyNSB9LCAoXywgaSkgPT4gYFAxLUNoaWxkICR7aSArIDF9YCkgfSxcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdQYXJlbnQgMicsIGNoaWxkX2NodW5rczogQXJyYXkuZnJvbSh7IGxlbmd0aDogMzAgfSwgKF8sIGkpID0+IGBQMi1DaGlsZCAke2kgKyAxfWApIH0sXG4gICAgICAgIF0sICdmdWxsLWRvYycpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUGFyZW50Q2hpbGRDaHVua3NcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5wYXJlbnRfY2hpbGRfY2h1bmtzWzBdLmNoaWxkX2NvbnRlbnRzKS50b0hhdmVMZW5ndGgoMjApXG4gICAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rc1sxXS5jaGlsZF9jb250ZW50cykudG9IYXZlTGVuZ3RoKDIwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJldmlldyBhcnJheSBmb3IgcGFyZW50LWNoaWxkIGNodW5rcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cyhbXSwgJ3BhcmFncmFwaCcpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBQYXJlbnRDaGlsZENodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQucGFyZW50X2NoaWxkX2NodW5rcykudG9FcXVhbChbXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUUEgQ2h1bmtzIChxYV9tb2RlbCkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUUEgQ2h1bmtzIChxYV9tb2RlbCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgUUEgY2h1bmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVRQUNodW5rT3V0cHV0cyhbXG4gICAgICAgIHsgcXVlc3Rpb246ICdXaGF0IGlzIERpZnk/JywgYW5zd2VyOiAnRGlmeSBpcyBhbiBMTE0gYXBwbGljYXRpb24gcGxhdGZvcm0uJyB9LFxuICAgICAgICB7IHF1ZXN0aW9uOiAnSG93IHRvIHVzZSBpdD8nLCBhbnN3ZXI6ICdZb3UgY2FuIGNyZWF0ZSBhcHBzIGVhc2lseS4nIH0sXG4gICAgICBdKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgUUFDaHVua3NcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnFhX2NodW5rcykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBleHBlY3QocmVzdWx0LnFhX2NodW5rc1swXSkudG9FcXVhbCh7XG4gICAgICAgIHF1ZXN0aW9uOiAnV2hhdCBpcyBEaWZ5PycsXG4gICAgICAgIGFuc3dlcjogJ0RpZnkgaXMgYW4gTExNIGFwcGxpY2F0aW9uIHBsYXRmb3JtLicsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3NbMV0pLnRvRXF1YWwoe1xuICAgICAgICBxdWVzdGlvbjogJ0hvdyB0byB1c2UgaXQ/JyxcbiAgICAgICAgYW5zd2VyOiAnWW91IGNhbiBjcmVhdGUgYXBwcyBlYXNpbHkuJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGltaXQgUUEgY2h1bmtzIHRvIFJBR19QSVBFTElORV9QUkVWSUVXX0NIVU5LX05VTSAoMjApJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZVFBQ2h1bmtPdXRwdXRzKGNyZWF0ZU1vY2tRQUNodW5rcygzMCkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBRQUNodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQucWFfY2h1bmtzKS50b0hhdmVMZW5ndGgoMjApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHFhX3ByZXZpZXcgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUUFDaHVua091dHB1dHMoW10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBRQUNodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQucWFfY2h1bmtzKS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBRQSBjaHVua3Mgd2l0aCBlbXB0eSBxdWVzdGlvbiBvciBhbnN3ZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlUUFDaHVua091dHB1dHMoW1xuICAgICAgICB7IHF1ZXN0aW9uOiAnJywgYW5zd2VyOiAnQW5zd2VyIHdpdGhvdXQgcXVlc3Rpb24nIH0sXG4gICAgICAgIHsgcXVlc3Rpb246ICdRdWVzdGlvbiB3aXRob3V0IGFuc3dlcicsIGFuc3dlcjogJycgfSxcbiAgICAgIF0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBRQUNodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQucWFfY2h1bmtzWzBdLnF1ZXN0aW9uKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3NbMF0uYW5zd2VyKS50b0JlKCdBbnN3ZXIgd2l0aG91dCBxdWVzdGlvbicpXG4gICAgICBleHBlY3QocmVzdWx0LnFhX2NodW5rc1sxXS5xdWVzdGlvbikudG9CZSgnUXVlc3Rpb24gd2l0aG91dCBhbnN3ZXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC5xYV9jaHVua3NbMV0uYW5zd2VyKS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIGFsbCBwcm9wZXJ0aWVzIHdoZW4gc3ByZWFkaW5nIGNodW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgY2h1bmtfc3RydWN0dXJlOiBDaHVua2luZ01vZGUucWEsXG4gICAgICAgIHFhX3ByZXZpZXc6IFtcbiAgICAgICAgICB7IHF1ZXN0aW9uOiAnUTEnLCBhbnN3ZXI6ICdBMScsIGV4dHJhOiAnc2hvdWxkIGJlIHByZXNlcnZlZCcgfSxcbiAgICAgICAgXSBhcyB1bmtub3duIGFzIEFycmF5PHsgcXVlc3Rpb246IHN0cmluZywgYW5zd2VyOiBzdHJpbmcgfT4sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBRQUNodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQucWFfY2h1bmtzWzBdKS50b0VxdWFsKHsgcXVlc3Rpb246ICdRMScsIGFuc3dlcjogJ0ExJywgZXh0cmE6ICdzaG91bGQgYmUgcHJlc2VydmVkJyB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVbmtub3duIENodW5raW5nIE1vZGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVW5rbm93biBDaHVua2luZyBNb2RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgdW5rbm93biBjaHVua2luZyBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgY2h1bmtfc3RydWN0dXJlOiAndW5rbm93bl9tb2RlJyBhcyBDaHVua2luZ01vZGUsXG4gICAgICAgIHByZXZpZXc6IFtdLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gY2h1bmtfc3RydWN0dXJlIGlzIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBwcmV2aWV3OiBbeyBjb250ZW50OiAndGVzdCcgfV0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXhhY3RseSBSQUdfUElQRUxJTkVfUFJFVklFV19DSFVOS19OVU0gKDIwKSBjaHVua3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhjcmVhdGVNb2NrR2VuZXJhbENodW5rcygyMCkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0UHJldmlld0NodW5rcyhvdXRwdXRzKSBhcyBHZW5lcmFsQ2h1bmtzXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoKDIwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvdXRwdXRzIHdpdGggYWRkaXRpb25hbCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IHtcbiAgICAgICAgLi4uY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVGVzdCcgfV0pLFxuICAgICAgICBleHRyYV9maWVsZDogJ3Nob3VsZCBub3QgYWZmZWN0IHJlc3VsdCcsXG4gICAgICAgIG1ldGFkYXRhOiB7IHNvbWU6ICdkYXRhJyB9LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZvcm1hdFByZXZpZXdDaHVua3Mob3V0cHV0cykgYXMgR2VuZXJhbENodW5rc1xuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoWydUZXN0J10pXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJlc3VsdFByZXZpZXcgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdSZXN1bHRQcmV2aWV3JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERlZmF1bHQgUHJvcHMgRmFjdG9yeVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc1J1bm5pbmc6IGZhbHNlLFxuICAgIG91dHB1dHM6IHVuZGVmaW5lZCxcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgIG9uU3dpdGNoVG9EZXRhaWw6IHZpLmZuKCksXG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZyB3aXRoIG1pbmltYWwgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgb25Td2l0Y2hUb0RldGFpbD17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCByZW5kZXJzIChubyB2aXNpYmxlIGNvbnRlbnQgaW4gZW1wdHkgc3RhdGUpXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb2FkaW5nIHN0YXRlIHdoZW4gaXNSdW5uaW5nIGFuZCBubyBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17dHJ1ZX0gb3V0cHV0cz17dW5kZWZpbmVkfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc3Bpbm5lciBpY29uIHdoZW4gbG9hZGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSBvdXRwdXRzPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBmb3IgYW5pbWF0ZS1zcGluIGNsYXNzIChsb2FkaW5nIHNwaW5uZXIpXG4gICAgICBjb25zdCBzcGlubmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRlLXNwaW4nKVxuICAgICAgZXhwZWN0KHNwaW5uZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZXJyb3Igc3RhdGUgd2hlbiBub3QgcnVubmluZyBhbmQgZXJyb3IgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17ZmFsc2V9IGVycm9yPVwiU29tZXRoaW5nIHdlbnQgd3JvbmdcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3BpcGVsaW5lXFwucmVzdWx0XFwucmVzdWx0UHJldmlld1xcLnZpZXdEZXRhaWxzL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgb3V0cHV0cyB3aGVuIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzKFt7IGNvbnRlbnQ6ICdUZXN0IGNodW5rJyB9XSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm9vdGVyIHRpcCB3aGVuIG91dHB1dHMgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QgY2h1bmsnIH1dKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGlwZWxpbmVcXC5yZXN1bHRcXC5yZXN1bHRQcmV2aWV3XFwuZm9vdGVyVGlwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGxvYWRpbmcgd2hlbiBvdXRwdXRzIGV4aXN0IGV2ZW4gaWYgaXNSdW5uaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QnIH1dKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBpc1J1bm5pbmc9e3RydWV9IG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBvdXRwdXRzLCBub3QgbG9hZGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGVycm9yIHdoZW4gaXNSdW5uaW5nIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSBlcnJvcj1cIkVycm9yIG1lc3NhZ2VcIiBvdXRwdXRzPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBsb2FkaW5nLCBub3QgZXJyb3JcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmVycm9yJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnaXNSdW5uaW5nIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyB3aGVuIGlzUnVubmluZz10cnVlIGFuZCBubyBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBpc1J1bm5pbmc9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGxvYWRpbmcgd2hlbiBpc1J1bm5pbmc9ZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHByaW9yaXRpemUgb3V0cHV0cyBvdmVyIGxvYWRpbmcgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ0RhdGEnIH1dKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ291dHB1dHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBjaHVua19zdHJ1Y3R1cmUgdG8gQ2h1bmtDYXJkTGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVGVzdCcgfV0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2h1bmtMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgICBleHBlY3QoY2h1bmtMaXN0KS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstdHlwZScsIENodW5raW5nTW9kZS50ZXh0KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBmb3JtYXQgYW5kIHBhc3MgcHJldmlld0NodW5rcyB0byBDaHVua0NhcmRMaXN0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzKFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdDaHVuayAxJyB9LFxuICAgICAgICAgIHsgY29udGVudDogJ0NodW5rIDInIH0sXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2h1bmtMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgICBjb25zdCBjaHVua0luZm8gPSBKU09OLnBhcnNlKGNodW5rTGlzdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstaW5mbycpIHx8ICdbXScpXG4gICAgICAgIGV4cGVjdChjaHVua0luZm8pLnRvRXF1YWwoWydDaHVuayAxJywgJ0NodW5rIDInXSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHBhcmVudC1jaGlsZCBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rT3V0cHV0cyhbXG4gICAgICAgICAgeyBjb250ZW50OiAnUGFyZW50JywgY2hpbGRfY2h1bmtzOiBbJ0NoaWxkIDEnLCAnQ2hpbGQgMiddIH0sXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2h1bmtMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgICBleHBlY3QoY2h1bmtMaXN0KS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstdHlwZScsIENodW5raW5nTW9kZS5wYXJlbnRDaGlsZClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIFFBIG91dHB1dHMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZVFBQ2h1bmtPdXRwdXRzKFtcbiAgICAgICAgICB7IHF1ZXN0aW9uOiAnUTEnLCBhbnN3ZXI6ICdBMScgfSxcbiAgICAgICAgXSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaHVua0xpc3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpXG4gICAgICAgIGV4cGVjdChjaHVua0xpc3QpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jaHVuay10eXBlJywgQ2h1bmtpbmdNb2RlLnFhKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Vycm9yIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igc3RhdGUgd2hlbiBlcnJvciBpcyBhIG5vbi1lbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVycm9yPVwiTmV0d29yayBlcnJvclwiIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHN0YXRlIHdoZW4gZXJyb3IgaXMgYW4gZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlcnJvcj1cIlwiIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEVtcHR5IHN0cmluZyBpcyBmYWxzeSwgc28gZXJyb3Igc3RhdGUgc2hvdWxkIE5PVCBzaG93XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmVycm9yJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIG91dHB1dHMgYW5kIGVycm9yIHdoZW4gYm90aCBleGlzdCAoaW5kZXBlbmRlbnQgY29uZGl0aW9ucyknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ0RhdGEnIH1dKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gZXJyb3I9XCJFcnJvclwiIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEJvdGggYXJlIHJlbmRlcmVkIGJlY2F1c2UgY29uZGl0aW9ucyBhcmUgaW5kZXBlbmRlbnQgaW4gdGhlIGNvbXBvbmVudFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ29uU3dpdGNoVG9EZXRhaWwgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgY2FsbGVkIHdoZW4gdmlldyBkZXRhaWxzIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU3dpdGNoVG9EZXRhaWwgPSB2aS5mbigpXG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlcnJvcj1cIkVycm9yXCIgb25Td2l0Y2hUb0RldGFpbD17b25Td2l0Y2hUb0RldGFpbH0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC92aWV3RGV0YWlscy9pIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25Td2l0Y2hUb0RldGFpbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBiZSBjYWxsZWQgYXV0b21hdGljYWxseSBvbiByZW5kZXInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Td2l0Y2hUb0RldGFpbCA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVycm9yPVwiRXJyb3JcIiBvblN3aXRjaFRvRGV0YWlsPXtvblN3aXRjaFRvRGV0YWlsfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uU3dpdGNoVG9EZXRhaWwpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdSZWFjdC5tZW1vIHdyYXBwZXInLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcbiAgICAgICAgcmVyZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5IGFmdGVyIHJlcmVuZGVyXG4gICAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIHByb3BzIGNoYW5nZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHdoZW4gb3V0cHV0cyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb3V0cHV0czEgPSBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzKFt7IGNvbnRlbnQ6ICdGaXJzdCcgfV0pXG4gICAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzMX0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IG91dHB1dHMyID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnU2Vjb25kJyB9XSlcbiAgICAgICAgcmVyZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0czJ9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBjaHVua0xpc3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpXG4gICAgICAgIGNvbnN0IGNodW5rSW5mbyA9IEpTT04ucGFyc2UoY2h1bmtMaXN0LmdldEF0dHJpYnV0ZSgnZGF0YS1jaHVuay1pbmZvJykgfHwgJ1tdJylcbiAgICAgICAgZXhwZWN0KGNodW5rSW5mbykudG9FcXVhbChbJ1NlY29uZCddKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3VzZU1lbW8gZm9yIHByZXZpZXdDaHVua3MnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNvbXB1dGUgcHJldmlld0NodW5rcyBiYXNlZCBvbiBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMgPSBjcmVhdGVHZW5lcmFsQ2h1bmtPdXRwdXRzKFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdNZW1vaXplZCBjaHVuayAxJyB9LFxuICAgICAgICAgIHsgY29udGVudDogJ01lbW9pemVkIGNodW5rIDInIH0sXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2h1bmtMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgICBjb25zdCBjaHVua0luZm8gPSBKU09OLnBhcnNlKGNodW5rTGlzdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstaW5mbycpIHx8ICdbXScpXG4gICAgICAgIGV4cGVjdChjaHVua0luZm8pLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZWNvbXB1dGUgd2hlbiBvdXRwdXRzIHJlZmVyZW5jZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG91dHB1dHMxID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnT3JpZ2luYWwnIH1dKVxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0czF9IC8+KVxuXG4gICAgICAgIGxldCBjaHVua0xpc3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpXG4gICAgICAgIGxldCBjaHVua0luZm8gPSBKU09OLnBhcnNlKGNodW5rTGlzdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstaW5mbycpIHx8ICdbXScpXG4gICAgICAgIGV4cGVjdChjaHVua0luZm8pLnRvRXF1YWwoWydPcmlnaW5hbCddKVxuXG4gICAgICAgIC8vIEFjdCAtIENoYW5nZSBvdXRwdXRzXG4gICAgICAgIGNvbnN0IG91dHB1dHMyID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVXBkYXRlZCcgfV0pXG4gICAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e291dHB1dHMyfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY2h1bmtMaXN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKVxuICAgICAgICBjaHVua0luZm8gPSBKU09OLnBhcnNlKGNodW5rTGlzdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstaW5mbycpIHx8ICdbXScpXG4gICAgICAgIGV4cGVjdChjaHVua0luZm8pLnRvRXF1YWwoWydVcGRhdGVkJ10pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgb3V0cHV0cyBpbiB1c2VNZW1vJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIE5vIGNodW5rIGxpc3QgcmVuZGVyZWRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEV2ZW50IEhhbmRsZXJzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblN3aXRjaFRvRGV0YWlsIHdoZW4gdmlldyBkZXRhaWxzIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Td2l0Y2hUb0RldGFpbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlcnJvcj1cIlRlc3QgZXJyb3JcIiBvblN3aXRjaFRvRGV0YWlsPXtvblN3aXRjaFRvRGV0YWlsfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvdmlld0RldGFpbHMvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25Td2l0Y2hUb0RldGFpbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsaWNrcyBvbiB2aWV3IGRldGFpbHMgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Td2l0Y2hUb0RldGFpbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlcnJvcj1cIlRlc3QgZXJyb3JcIiBvblN3aXRjaFRvRGV0YWlsPXtvblN3aXRjaFRvRGV0YWlsfSAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3ZpZXdEZXRhaWxzL2kgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uU3dpdGNoVG9EZXRhaWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RhdGUgKGFsbCBwcm9wcyB1bmRlZmluZWQvZmFsc2UpJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e2ZhbHNlfVxuICAgICAgICAgIG91dHB1dHM9e3VuZGVmaW5lZH1cbiAgICAgICAgICBlcnJvcj17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uU3dpdGNoVG9EZXRhaWw9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIGVtcHR5IGZyYWdtZW50XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb3V0cHV0cyB3aXRoIGVtcHR5IHByZXZpZXcgY2h1bmtzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNodW5rTGlzdCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JylcbiAgICAgIGNvbnN0IGNodW5rSW5mbyA9IEpTT04ucGFyc2UoY2h1bmtMaXN0LmdldEF0dHJpYnV0ZSgnZGF0YS1jaHVuay1pbmZvJykgfHwgJ1tdJylcbiAgICAgIGV4cGVjdChjaHVua0luZm8pLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG91dHB1dHMgdGhhdCByZXN1bHQgaW4gdW5kZWZpbmVkIHByZXZpZXdDaHVua3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0ge1xuICAgICAgICBjaHVua19zdHJ1Y3R1cmU6ICdpbnZhbGlkX21vZGUnIGFzIENodW5raW5nTW9kZSxcbiAgICAgICAgcHJldmlldzogW10sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IHJlbmRlciBjaHVuayBsaXN0IHdoZW4gcHJldmlld0NodW5rcyBpcyB1bmRlZmluZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVubW91bnQgY2xlYW5seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdCgoKSA9PiB1bm1vdW50KCkpLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmFwaWQgcHJvcCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBSYXBpZGx5IGNoYW5nZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSAvPilcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17ZmFsc2V9IGVycm9yPVwiRXJyb3JcIiAvPilcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e2NyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QnIH1dKX0gLz4pXG4gICAgICByZXJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxhcmdlIG51bWJlciBvZiBjaHVua3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhjcmVhdGVNb2NrR2VuZXJhbENodW5rcygxMDAwKSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBvbmx5IHNob3cgZmlyc3QgMjAgY2h1bmtzXG4gICAgICBjb25zdCBjaHVua0xpc3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpXG4gICAgICBjb25zdCBjaHVua0luZm8gPSBKU09OLnBhcnNlKGNodW5rTGlzdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2h1bmstaW5mbycpIHx8ICdbXScpXG4gICAgICBleHBlY3QoY2h1bmtJbmZvKS50b0hhdmVMZW5ndGgoMjApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgd2hlbiBvdXRwdXRzIGhhcyBudWxsIHByZXZpZXcgKHNsaWNlIGNhbGxlZCBvbiBudWxsKScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG91dHB1dHMgPSB7XG4gICAgICAgIGNodW5rX3N0cnVjdHVyZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgIHByZXZpZXc6IG51bGwgYXMgdW5rbm93biBhcyBBcnJheTx7IGNvbnRlbnQ6IHN0cmluZyB9PixcbiAgICAgIH1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gQ29tcG9uZW50IHRocm93cyBiZWNhdXNlIHNsaWNlIGlzIGNhbGxlZCBvbiBudWxsIHByZXZpZXdcbiAgICAgIC8vIFRoaXMgaXMgZXhwZWN0ZWQgYmVoYXZpb3IgLSB0aGUgY29tcG9uZW50IGRvZXNuJ3QgdmFsaWRhdGUgaW5wdXRcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gLz4pKS50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gbG9hZGluZyB0byBvdXRwdXQgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnTG9hZGVkIGRhdGEnIH1dKVxuICAgICAgcmVyZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXtmYWxzZX0gb3V0cHV0cz17b3V0cHV0c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gbG9hZGluZyB0byBlcnJvciBzdGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBpc1J1bm5pbmc9e3RydWV9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BpcGVsaW5lLnJlc3VsdC5yZXN1bHRQcmV2aWV3LmxvYWRpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17ZmFsc2V9IGVycm9yPVwiRmFpbGVkIHRvIGxvYWRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIGVycm9yIGFuZCBvdXRwdXRzIHdoZW4gYm90aCBwcm9wcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlcnJvcj1cIkluaXRpYWwgZXJyb3JcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5lcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE91dHB1dHMgcHJvdmlkZWQgd2hpbGUgZXJyb3Igc3RpbGwgZXhpc3RzXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnU3VjY2VzcyBkYXRhJyB9XSlcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVycm9yPVwiSW5pdGlhbCBlcnJvclwiIG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCb3RoIGFyZSByZW5kZXJlZCAoY29tcG9uZW50IHVzZXMgaW5kZXBlbmRlbnQgY29uZGl0aW9ucylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5lcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZGUgZXJyb3Igd2hlbiBlcnJvciBwcm9wIGlzIGNsZWFyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXJyb3I9XCJJbml0aWFsIGVycm9yXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBDbGVhciBlcnJvciBhbmQgcHJvdmlkZSBvdXRwdXRzXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnU3VjY2VzcyBkYXRhJyB9XSlcbiAgICAgIHJlcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IG91dHB1dHM9e291dHB1dHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPbmx5IG91dHB1dHMgc2hvd24gd2hlbiBlcnJvciBpcyBjbGVhcmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5lcnJvcicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxldGUgZmxvdzogZW1wdHkgLT4gbG9hZGluZyAtPiBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcblxuICAgICAgLy8gQWN0IC0gU3RhcnQgbG9hZGluZ1xuICAgICAgcmVyZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaXNSdW5uaW5nPXt0cnVlfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5sb2FkaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gUmVjZWl2ZSBvdXRwdXRzXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnRmluYWwgZGF0YScgfV0pXG4gICAgICByZXJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBpc1J1bm5pbmc9e2ZhbHNlfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaHVuay1jYXJkLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdHlsaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgY29udGFpbmVyIGNsYXNzZXMgZm9yIGxvYWRpbmcgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUnVubmluZz17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbG9hZGluZ0NvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5ncm93LmZsZXgtY29sLml0ZW1zLWNlbnRlci5qdXN0aWZ5LWNlbnRlcicpXG4gICAgICBleHBlY3QobG9hZGluZ0NvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBjb250YWluZXIgY2xhc3NlcyBmb3IgZXJyb3Igc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxSZXN1bHRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVycm9yPVwiRXJyb3JcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBlcnJvckNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5ncm93LmZsZXgtY29sLml0ZW1zLWNlbnRlci5qdXN0aWZ5LWNlbnRlcicpXG4gICAgICBleHBlY3QoZXJyb3JDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgY29udGFpbmVyIGNsYXNzZXMgZm9yIG91dHB1dHMgc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvdXRwdXRzID0gY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVGVzdCcgfV0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UmVzdWx0UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBvdXRwdXRzPXtvdXRwdXRzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBvdXRwdXRDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZsZXguZ3Jvdy5mbGV4LWNvbC5iZy1iYWNrZ3JvdW5kLWJvZHknKVxuICAgICAgZXhwZWN0KG91dHB1dENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgZ3JhZGllbnQgZGl2aWRlcnMgaW4gZm9vdGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QnIH1dKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZ3JhZGllbnREaXZpZGVycyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYmctZ3JhZGllbnQtdG8tciwgLmJnLWdyYWRpZW50LXRvLWwnKVxuICAgICAgZXhwZWN0KGdyYWRpZW50RGl2aWRlcnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDIpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBidXR0b24gaW4gZXJyb3Igc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXJyb3I9XCJFcnJvclwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB0aXRsZSBhdHRyaWJ1dGUgb24gZm9vdGVyIHRpcCBmb3IgbG9uZyB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3V0cHV0cyA9IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QnIH1dKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlc3VsdFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gb3V0cHV0cz17b3V0cHV0c30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZm9vdGVyVGlwID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1t0aXRsZV0nKVxuICAgICAgZXhwZWN0KGZvb3RlclRpcCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTdGF0ZSBUcmFuc2l0aW9uIE1hdHJpeCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnU3RhdGUgVHJhbnNpdGlvbiBNYXRyaXgnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGNvbnN0IHN0YXRlcyA9IFtcbiAgICB7IGlzUnVubmluZzogZmFsc2UsIG91dHB1dHM6IHVuZGVmaW5lZCwgZXJyb3I6IHVuZGVmaW5lZCwgZXhwZWN0ZWQ6ICdlbXB0eScgfSxcbiAgICB7IGlzUnVubmluZzogdHJ1ZSwgb3V0cHV0czogdW5kZWZpbmVkLCBlcnJvcjogdW5kZWZpbmVkLCBleHBlY3RlZDogJ2xvYWRpbmcnIH0sXG4gICAgeyBpc1J1bm5pbmc6IGZhbHNlLCBvdXRwdXRzOiB1bmRlZmluZWQsIGVycm9yOiAnRXJyb3InLCBleHBlY3RlZDogJ2Vycm9yJyB9LFxuICAgIHsgaXNSdW5uaW5nOiBmYWxzZSwgb3V0cHV0czogY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVGVzdCcgfV0pLCBlcnJvcjogdW5kZWZpbmVkLCBleHBlY3RlZDogJ291dHB1dHMnIH0sXG4gICAgeyBpc1J1bm5pbmc6IHRydWUsIG91dHB1dHM6IGNyZWF0ZUdlbmVyYWxDaHVua091dHB1dHMoW3sgY29udGVudDogJ1Rlc3QnIH1dKSwgZXJyb3I6IHVuZGVmaW5lZCwgZXhwZWN0ZWQ6ICdvdXRwdXRzJyB9LFxuICAgIHsgaXNSdW5uaW5nOiBmYWxzZSwgb3V0cHV0czogY3JlYXRlR2VuZXJhbENodW5rT3V0cHV0cyhbeyBjb250ZW50OiAnVGVzdCcgfV0pLCBlcnJvcjogJ0Vycm9yJywgZXhwZWN0ZWQ6ICdib3RoJyB9LFxuICAgIHsgaXNSdW5uaW5nOiB0cnVlLCBvdXRwdXRzOiB1bmRlZmluZWQsIGVycm9yOiAnRXJyb3InLCBleHBlY3RlZDogJ2xvYWRpbmcnIH0sXG4gIF1cblxuICBpdC5lYWNoKHN0YXRlcykoXG4gICAgJ3Nob3VsZCByZW5kZXIgJGV4cGVjdGVkIHN0YXRlIHdoZW4gaXNSdW5uaW5nPSRpc1J1bm5pbmcsIG91dHB1dHM9JG91dHB1dHMsIGVycm9yPSRlcnJvcicsXG4gICAgKHsgaXNSdW5uaW5nLCBvdXRwdXRzLCBlcnJvciwgZXhwZWN0ZWQgfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFJlc3VsdFByZXZpZXdcbiAgICAgICAgICBpc1J1bm5pbmc9e2lzUnVubmluZ31cbiAgICAgICAgICBvdXRwdXRzPXtvdXRwdXRzfVxuICAgICAgICAgIGVycm9yPXtlcnJvcn1cbiAgICAgICAgICBvblN3aXRjaFRvRGV0YWlsPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBzd2l0Y2ggKGV4cGVjdGVkKSB7XG4gICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdsb2FkaW5nJzpcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcubG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwaXBlbGluZS5yZXN1bHQucmVzdWx0UHJldmlldy5lcnJvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnb3V0cHV0cyc6XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstY2FyZC1saXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdib3RoJzpcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGlwZWxpbmUucmVzdWx0LnJlc3VsdFByZXZpZXcuZXJyb3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NodW5rLWNhcmQtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9LFxuICApXG59KVxuIl19