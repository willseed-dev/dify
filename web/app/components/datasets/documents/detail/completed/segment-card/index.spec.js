"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/models/datasets");
const index_1 = require("./index");
// Mock react-i18next - external dependency
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            if (key === 'segment.characters')
                return options?.count === 1 ? 'character' : 'characters';
            if (key === 'segment.childChunks')
                return options?.count === 1 ? 'child chunk' : 'child chunks';
            const prefix = options?.ns ? `${options.ns}.` : '';
            return `${prefix}${key}`;
        },
    }),
}));
// ============================================================================
// Context Mocks - need to control test scenarios
// ============================================================================
const mockDocForm = { current: datasets_1.ChunkingMode.text };
const mockParentMode = { current: 'paragraph' };
vi.mock('../../context', () => ({
    useDocumentContext: (selector) => {
        const value = {
            datasetId: 'test-dataset-id',
            documentId: 'test-document-id',
            docForm: mockDocForm.current,
            parentMode: mockParentMode.current,
        };
        return selector(value);
    },
}));
const mockIsCollapsed = { current: true };
vi.mock('../index', () => ({
    useSegmentListContext: (selector) => {
        const value = {
            isCollapsed: mockIsCollapsed.current,
            fullScreen: false,
            toggleFullScreen: vi.fn(),
            currSegment: { showModal: false },
            currChildChunk: { showModal: false },
        };
        return selector(value);
    },
}));
// ============================================================================
// Component Mocks - components with complex dependencies
// ============================================================================
// StatusItem uses React Query hooks which require QueryClientProvider
vi.mock('../../../status-item', () => ({
    default: ({ status, reverse, textCls }) => (<div data-testid="status-item" data-status={status} data-reverse={reverse} className={textCls}>
      Status:
      {' '}
      {status}
    </div>),
}));
// ImageList has deep dependency: FileThumb → file-uploader → react-pdf-highlighter (ESM)
vi.mock('@/app/components/datasets/common/image-list', () => ({
    default: ({ images, size, className }) => (<div data-testid="image-list" data-image-count={images.length} data-size={size} className={className}>
      {images.map((img, idx) => (<img key={idx} src={img.sourceUrl} alt={img.name}/>))}
    </div>),
}));
// Markdown uses next/dynamic and react-syntax-highlighter (ESM)
vi.mock('@/app/components/base/markdown', () => ({
    Markdown: ({ content, className }) => (<div data-testid="markdown" className={`markdown-body ${className || ''}`}>{content}</div>),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createMockAttachment = (overrides = {}) => ({
    id: 'attachment-1',
    name: 'test-image.png',
    size: 1024,
    extension: 'png',
    mime_type: 'image/png',
    source_url: 'https://example.com/test-image.png',
    ...overrides,
});
const createMockChildChunk = (overrides = {}) => ({
    id: 'child-chunk-1',
    position: 1,
    segment_id: 'segment-1',
    content: 'Child chunk content',
    word_count: 100,
    created_at: 1700000000,
    updated_at: 1700000000,
    type: 'automatic',
    ...overrides,
});
const createMockSegmentDetail = (overrides = {}) => ({
    id: 'segment-1',
    position: 1,
    document_id: 'doc-1',
    content: 'Test segment content',
    sign_content: 'Test signed content',
    word_count: 100,
    tokens: 50,
    keywords: ['keyword1', 'keyword2'],
    index_node_id: 'index-1',
    index_node_hash: 'hash-1',
    hit_count: 10,
    enabled: true,
    disabled_at: 0,
    disabled_by: '',
    status: 'completed',
    created_by: 'user-1',
    created_at: 1700000000,
    indexing_at: 1700000100,
    completed_at: 1700000200,
    error: null,
    stopped_at: 0,
    updated_at: 1700000000,
    attachments: [],
    child_chunks: [],
    document: { name: 'Test Document' },
    ...overrides,
});
const defaultFocused = { segmentIndex: false, segmentContent: false };
// ============================================================================
// Tests
// ============================================================================
describe('SegmentCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDocForm.current = datasets_1.ChunkingMode.text;
        mockParentMode.current = 'paragraph';
        mockIsCollapsed.current = true;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render loading skeleton when loading is true', () => {
            (0, react_1.render)(<index_1.default loading={true} focused={defaultFocused}/>);
            // ParentChunkCardSkeleton should render
            expect(react_1.screen.getByTestId('parent-chunk-card-skeleton')).toBeInTheDocument();
        });
        it('should render segment card content when loading is false', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // ChunkContent shows sign_content first, then content
            expect(react_1.screen.getByText('Test signed content')).toBeInTheDocument();
        });
        it('should render segment index tag with correct position', () => {
            const detail = createMockSegmentDetail({ position: 5 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk-05/i)).toBeInTheDocument();
        });
        it('should render word count text', () => {
            const detail = createMockSegmentDetail({ word_count: 250 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('250 characters')).toBeInTheDocument();
        });
        it('should render hit count text', () => {
            const detail = createMockSegmentDetail({ hit_count: 42 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('42 datasetDocuments.segment.hitCount')).toBeInTheDocument();
        });
        it('should apply custom className', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} className="custom-class" focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            expect(card).toHaveClass('custom-class');
        });
    });
    // --------------------------------------------------------------------------
    // Props Tests
    // --------------------------------------------------------------------------
    describe('Props', () => {
        it('should use default empty object when detail is undefined', () => {
            (0, react_1.render)(<index_1.default loading={false} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk/i)).toBeInTheDocument();
        });
        it('should handle archived prop correctly - switch should be disabled', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} archived={true} embeddingAvailable={true} focused={defaultFocused}/>);
            const switchElement = react_1.screen.getByRole('switch');
            expect(switchElement).toHaveClass('!cursor-not-allowed');
        });
        it('should show action buttons when embeddingAvailable is true', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            expect(react_1.screen.getByTestId('segment-edit-button')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('segment-delete-button')).toBeInTheDocument();
            expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
        });
        it('should not show action buttons when embeddingAvailable is false', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={false} focused={defaultFocused}/>);
            expect(react_1.screen.queryByRole('switch')).not.toBeInTheDocument();
        });
        it('should apply focused styles when segmentContent is focused', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={{ segmentIndex: false, segmentContent: true }}/>);
            const card = react_1.screen.getByTestId('segment-card');
            expect(card).toHaveClass('bg-dataset-chunk-detail-card-hover-bg');
        });
    });
    // --------------------------------------------------------------------------
    // State Management Tests
    // --------------------------------------------------------------------------
    describe('State Management', () => {
        it('should toggle delete confirmation modal when delete button clicked', async () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            const deleteButton = react_1.screen.getByTestId('segment-delete-button');
            react_1.fireEvent.click(deleteButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetDocuments.segment.delete')).toBeInTheDocument();
            });
        });
        it('should close delete confirmation modal when cancel is clicked', async () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            const deleteButton = react_1.screen.getByTestId('segment-delete-button');
            react_1.fireEvent.click(deleteButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetDocuments.segment.delete')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('datasetDocuments.segment.delete')).not.toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Callback Tests
    // --------------------------------------------------------------------------
    describe('Callbacks', () => {
        it('should call onClick when card is clicked in general mode', () => {
            const onClick = vi.fn();
            const detail = createMockSegmentDetail();
            mockDocForm.current = datasets_1.ChunkingMode.text;
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={onClick} focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            react_1.fireEvent.click(card);
            expect(onClick).toHaveBeenCalledTimes(1);
        });
        it('should not call onClick when card is clicked in full-doc mode', () => {
            const onClick = vi.fn();
            const detail = createMockSegmentDetail();
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={onClick} focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            react_1.fireEvent.click(card);
            expect(onClick).not.toHaveBeenCalled();
        });
        it('should call onClick when view more button is clicked in full-doc mode', () => {
            const onClick = vi.fn();
            const detail = createMockSegmentDetail();
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={onClick} focused={defaultFocused}/>);
            const viewMoreButton = react_1.screen.getByRole('button', { name: /viewMore/i });
            react_1.fireEvent.click(viewMoreButton);
            expect(onClick).toHaveBeenCalledTimes(1);
        });
        it('should call onClickEdit when edit button is clicked', () => {
            const onClickEdit = vi.fn();
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClickEdit={onClickEdit} embeddingAvailable={true} focused={defaultFocused}/>);
            const editButton = react_1.screen.getByTestId('segment-edit-button');
            react_1.fireEvent.click(editButton);
            expect(onClickEdit).toHaveBeenCalledTimes(1);
        });
        it('should call onDelete when confirm delete is clicked', async () => {
            const onDelete = vi.fn().mockResolvedValue(undefined);
            const detail = createMockSegmentDetail({ id: 'test-segment-id' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onDelete={onDelete} embeddingAvailable={true} focused={defaultFocused}/>);
            const deleteButton = react_1.screen.getByTestId('segment-delete-button');
            react_1.fireEvent.click(deleteButton);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('datasetDocuments.segment.delete')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.sure'));
            await (0, react_1.waitFor)(() => {
                expect(onDelete).toHaveBeenCalledWith('test-segment-id');
            });
        });
        it('should call onChangeSwitch when switch is toggled', async () => {
            const onChangeSwitch = vi.fn().mockResolvedValue(undefined);
            const detail = createMockSegmentDetail({ id: 'test-segment-id', enabled: true, status: 'completed' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onChangeSwitch={onChangeSwitch} embeddingAvailable={true} focused={defaultFocused}/>);
            const switchElement = react_1.screen.getByRole('switch');
            react_1.fireEvent.click(switchElement);
            await (0, react_1.waitFor)(() => {
                expect(onChangeSwitch).toHaveBeenCalledWith(false, 'test-segment-id');
            });
        });
        it('should stop propagation when edit button is clicked', () => {
            const onClick = vi.fn();
            const onClickEdit = vi.fn();
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={onClick} onClickEdit={onClickEdit} embeddingAvailable={true} focused={defaultFocused}/>);
            const editButton = react_1.screen.getByTestId('segment-edit-button');
            react_1.fireEvent.click(editButton);
            expect(onClickEdit).toHaveBeenCalledTimes(1);
            expect(onClick).not.toHaveBeenCalled();
        });
        it('should stop propagation when switch area is clicked', () => {
            const onClick = vi.fn();
            const detail = createMockSegmentDetail({ status: 'completed' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={onClick} embeddingAvailable={true} focused={defaultFocused}/>);
            const switchElement = react_1.screen.getByRole('switch');
            const switchContainer = switchElement.parentElement;
            react_1.fireEvent.click(switchContainer);
            expect(onClick).not.toHaveBeenCalled();
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Logic Tests
    // --------------------------------------------------------------------------
    describe('Memoization Logic', () => {
        it('should compute isGeneralMode correctly for text mode - show keywords', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({ keywords: ['testkeyword'] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('testkeyword')).toBeInTheDocument();
        });
        it('should compute isGeneralMode correctly for non-text mode - hide keywords', () => {
            mockDocForm.current = datasets_1.ChunkingMode.qa;
            const detail = createMockSegmentDetail({ keywords: ['testkeyword'] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText('testkeyword')).not.toBeInTheDocument();
        });
        it('should compute isParentChildMode correctly - show parent chunk prefix', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/datasetDocuments\.segment\.parentChunk/i)).toBeInTheDocument();
        });
        it('should compute isFullDocMode correctly - show view more button', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('common.operation.viewMore')).toBeInTheDocument();
        });
        it('should compute isParagraphMode correctly and show child chunks', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'paragraph';
            const childChunks = [createMockChildChunk()];
            const detail = createMockSegmentDetail({ child_chunks: childChunks });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // ChildSegmentList should render
            expect(react_1.screen.getByText(/child chunk/i)).toBeInTheDocument();
        });
        it('should compute chunkEdited correctly when updated_at > created_at', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({
                created_at: 1700000000,
                updated_at: 1700000001,
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('datasetDocuments.segment.edited')).toBeInTheDocument();
        });
        it('should not show edited badge when timestamps are equal', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({
                created_at: 1700000000,
                updated_at: 1700000000,
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText('datasetDocuments.segment.edited')).not.toBeInTheDocument();
        });
        it('should not show edited badge in full-doc mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const detail = createMockSegmentDetail({
                created_at: 1700000000,
                updated_at: 1700000001,
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText('datasetDocuments.segment.edited')).not.toBeInTheDocument();
        });
        it('should compute contentOpacity correctly when enabled', () => {
            const detail = createMockSegmentDetail({ enabled: true });
            const { container } = (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const wordCount = container.querySelector('.system-xs-medium.text-text-tertiary');
            expect(wordCount).not.toHaveClass('opacity-50');
        });
        it('should compute contentOpacity correctly when disabled', () => {
            const detail = createMockSegmentDetail({ enabled: false });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // ChunkContent receives opacity class when disabled
            const markdown = react_1.screen.getByTestId('markdown');
            expect(markdown).toHaveClass('opacity-50');
        });
        it('should not apply opacity when disabled but focused', () => {
            const detail = createMockSegmentDetail({ enabled: false });
            const { container } = (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={{ segmentIndex: false, segmentContent: true }}/>);
            const wordCount = container.querySelector('.system-xs-medium.text-text-tertiary');
            expect(wordCount).not.toHaveClass('opacity-50');
        });
        it('should compute wordCountText with correct format for singular', () => {
            const detail = createMockSegmentDetail({ word_count: 1 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('1 character')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Mode-specific Rendering Tests
    // --------------------------------------------------------------------------
    describe('Mode-specific Rendering', () => {
        it('should render without padding classes in full-doc mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            expect(card).not.toHaveClass('pb-2');
            expect(card).not.toHaveClass('pt-2.5');
        });
        it('should render with hover classes in non full-doc mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            expect(card).toHaveClass('pb-2');
            expect(card).toHaveClass('pt-2.5');
        });
        it('should not render status item in full-doc mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // In full-doc mode, status item should not render
            expect(react_1.screen.queryByText('Status:')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Child Segment List Tests
    // --------------------------------------------------------------------------
    describe('Child Segment List', () => {
        it('should render ChildSegmentList when in paragraph mode with child chunks', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'paragraph';
            const childChunks = [createMockChildChunk(), createMockChildChunk({ id: 'child-2', position: 2 })];
            const detail = createMockSegmentDetail({ child_chunks: childChunks });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/2 child chunks/i)).toBeInTheDocument();
        });
        it('should not render ChildSegmentList when child_chunks is empty', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'paragraph';
            const detail = createMockSegmentDetail({ child_chunks: [] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText(/child chunk/i)).not.toBeInTheDocument();
        });
        it('should not render ChildSegmentList in full-doc mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const childChunks = [createMockChildChunk()];
            const detail = createMockSegmentDetail({ child_chunks: childChunks });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // In full-doc mode, ChildSegmentList should not render
            expect(react_1.screen.queryByText(/1 child chunk$/i)).not.toBeInTheDocument();
        });
        it('should call handleAddNewChildChunk when add button is clicked', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'paragraph';
            const handleAddNewChildChunk = vi.fn();
            const childChunks = [createMockChildChunk()];
            const detail = createMockSegmentDetail({ id: 'parent-id', child_chunks: childChunks });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} handleAddNewChildChunk={handleAddNewChildChunk} focused={defaultFocused}/>);
            const addButton = react_1.screen.getByText('common.operation.add');
            react_1.fireEvent.click(addButton);
            expect(handleAddNewChildChunk).toHaveBeenCalledWith('parent-id');
        });
    });
    // --------------------------------------------------------------------------
    // Keywords Display Tests
    // --------------------------------------------------------------------------
    describe('Keywords Display', () => {
        it('should render keywords with # prefix in general mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({ keywords: ['keyword1', 'keyword2'] });
            const { container } = (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('keyword1')).toBeInTheDocument();
            expect(react_1.screen.getByText('keyword2')).toBeInTheDocument();
            // Tag component shows # prefix
            const hashtags = container.querySelectorAll('.text-text-quaternary');
            expect(hashtags.length).toBeGreaterThan(0);
        });
        it('should not render keywords in QA mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.qa;
            const detail = createMockSegmentDetail({ keywords: ['keyword1'] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText('keyword1')).not.toBeInTheDocument();
        });
        it('should not render keywords in parent-child mode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            const detail = createMockSegmentDetail({ keywords: ['keyword1'] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByText('keyword1')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Images Display Tests
    // --------------------------------------------------------------------------
    describe('Images Display', () => {
        it('should render ImageList when attachments exist', () => {
            const attachments = [createMockAttachment()];
            const detail = createMockSegmentDetail({ attachments });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // ImageList uses FileThumb which renders images
            expect(react_1.screen.getByAltText('test-image.png')).toBeInTheDocument();
        });
        it('should not render ImageList when attachments is empty', () => {
            const detail = createMockSegmentDetail({ attachments: [] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.queryByAltText('test-image.png')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases and Error Handling Tests
    // --------------------------------------------------------------------------
    describe('Edge Cases and Error Handling', () => {
        it('should handle undefined detail gracefully', () => {
            (0, react_1.render)(<index_1.default loading={false} detail={undefined} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk/i)).toBeInTheDocument();
        });
        it('should handle empty detail object gracefully', () => {
            (0, react_1.render)(<index_1.default loading={false} detail={{}} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk/i)).toBeInTheDocument();
        });
        it('should handle missing callback functions gracefully', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={undefined} onChangeSwitch={undefined} onDelete={undefined} onClickEdit={undefined} embeddingAvailable={true} focused={defaultFocused}/>);
            const card = react_1.screen.getByTestId('segment-card');
            expect(() => react_1.fireEvent.click(card)).not.toThrow();
        });
        it('should handle switch being disabled when status is not completed', () => {
            const detail = createMockSegmentDetail({ status: 'indexing' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            // The Switch component uses CSS classes for disabled state, not the native disabled attribute
            const switchElement = react_1.screen.getByRole('switch');
            expect(switchElement).toHaveClass('!cursor-not-allowed', '!opacity-50');
        });
        it('should handle zero word count', () => {
            const detail = createMockSegmentDetail({ word_count: 0 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('0 characters')).toBeInTheDocument();
        });
        it('should handle zero hit count', () => {
            const detail = createMockSegmentDetail({ hit_count: 0 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('0 datasetDocuments.segment.hitCount')).toBeInTheDocument();
        });
        it('should handle very long content', () => {
            const longContent = 'A'.repeat(10000);
            // ChunkContent shows sign_content first, so set it to the long content
            const detail = createMockSegmentDetail({ sign_content: longContent });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(longContent)).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Component Integration Tests
    // --------------------------------------------------------------------------
    describe('Component Integration', () => {
        it('should render real Tag component with hashtag styling', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({ keywords: ['testkeyword'] });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('testkeyword')).toBeInTheDocument();
        });
        it('should render real Divider component', () => {
            const detail = createMockSegmentDetail();
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            const dividers = document.querySelectorAll('.bg-divider-regular');
            expect(dividers.length).toBeGreaterThan(0);
        });
        it('should render real Badge component when edited', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            const detail = createMockSegmentDetail({
                created_at: 1700000000,
                updated_at: 1700000001,
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const editedBadge = react_1.screen.getByText('datasetDocuments.segment.edited');
            expect(editedBadge).toHaveClass('system-2xs-medium-uppercase');
        });
        it('should render real Switch component with correct enabled state', () => {
            const detail = createMockSegmentDetail({ enabled: true, status: 'completed' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            const switchElement = react_1.screen.getByRole('switch');
            expect(switchElement).toHaveClass('bg-components-toggle-bg');
        });
        it('should render real Switch component with unchecked state', () => {
            const detail = createMockSegmentDetail({ enabled: false, status: 'completed' });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} embeddingAvailable={true} focused={defaultFocused}/>);
            const switchElement = react_1.screen.getByRole('switch');
            expect(switchElement).toHaveClass('bg-components-toggle-bg-unchecked');
        });
        it('should render real SegmentIndexTag with position formatting', () => {
            const detail = createMockSegmentDetail({ position: 1 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk-01/i)).toBeInTheDocument();
        });
        it('should render real SegmentIndexTag with double digit position', () => {
            const detail = createMockSegmentDetail({ position: 12 });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText(/Chunk-12/i)).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // All Props Variations Tests
    // --------------------------------------------------------------------------
    describe('All Props Variations', () => {
        it('should render correctly with all props provided', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'paragraph';
            const childChunks = [createMockChildChunk()];
            const attachments = [createMockAttachment()];
            const detail = createMockSegmentDetail({
                id: 'full-props-segment',
                position: 10,
                sign_content: 'Full signed content',
                content: 'Full content',
                word_count: 500,
                hit_count: 25,
                enabled: true,
                keywords: ['key1', 'key2'],
                child_chunks: childChunks,
                attachments,
                created_at: 1700000000,
                updated_at: 1700000001,
                status: 'completed',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} onClick={vi.fn()} onChangeSwitch={vi.fn()} onDelete={vi.fn()} onDeleteChildChunk={vi.fn()} handleAddNewChildChunk={vi.fn()} onClickSlice={vi.fn()} onClickEdit={vi.fn()} className="full-props-class" archived={false} embeddingAvailable={true} focused={{ segmentIndex: true, segmentContent: true }}/>);
            // ChunkContent shows sign_content first
            expect(react_1.screen.getByText('Full signed content')).toBeInTheDocument();
            expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
        });
        it('should render correctly with minimal props', () => {
            (0, react_1.render)(<index_1.default loading={true} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('common.operation.viewMore')).toBeInTheDocument();
        });
        it('should handle loading transition correctly', () => {
            const detail = createMockSegmentDetail();
            const { rerender } = (0, react_1.render)(<index_1.default loading={true} detail={detail} focused={defaultFocused}/>);
            // When loading, content should not be visible
            expect(react_1.screen.queryByText('Test signed content')).not.toBeInTheDocument();
            rerender(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // ChunkContent shows sign_content first
            expect(react_1.screen.getByText('Test signed content')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // ChunkContent QA Mode Tests - cover lines 25-49
    // --------------------------------------------------------------------------
    describe('ChunkContent QA Mode', () => {
        it('should render Q and A sections when answer is provided', () => {
            const detail = createMockSegmentDetail({
                content: 'This is the question content',
                answer: 'This is the answer content',
                sign_content: '',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // Should render Q label
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            // Should render A label
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
            // Should render question content
            expect(react_1.screen.getByText('This is the question content')).toBeInTheDocument();
            // Should render answer content
            expect(react_1.screen.getByText('This is the answer content')).toBeInTheDocument();
        });
        it('should apply line-clamp-2 class when isCollapsed is true in QA mode', () => {
            mockIsCollapsed.current = true;
            const detail = createMockSegmentDetail({
                content: 'Question content',
                answer: 'Answer content',
                sign_content: '',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // Markdown components should have line-clamp-2 class when collapsed
            const markdowns = react_1.screen.getAllByTestId('markdown');
            markdowns.forEach((markdown) => {
                expect(markdown).toHaveClass('line-clamp-2');
            });
        });
        it('should apply line-clamp-20 class when isCollapsed is false in QA mode', () => {
            mockIsCollapsed.current = false;
            const detail = createMockSegmentDetail({
                content: 'Question content',
                answer: 'Answer content',
                sign_content: '',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // Markdown components should have line-clamp-20 class when not collapsed
            const markdowns = react_1.screen.getAllByTestId('markdown');
            markdowns.forEach((markdown) => {
                expect(markdown).toHaveClass('line-clamp-20');
            });
        });
        it('should render QA mode with className applied to wrapper', () => {
            const detail = createMockSegmentDetail({
                content: 'Question',
                answer: 'Answer',
                sign_content: '',
                enabled: false,
            });
            const { container } = (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // The ChunkContent wrapper should have opacity class when disabled
            const qaWrapper = container.querySelector('.flex.gap-x-1');
            expect(qaWrapper).toBeInTheDocument();
        });
        it('should not render QA mode when answer is empty string', () => {
            const detail = createMockSegmentDetail({
                content: 'Regular content',
                answer: '',
                sign_content: 'Signed content',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // Should not render Q and A labels
            expect(react_1.screen.queryByText('Q')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('A')).not.toBeInTheDocument();
            // Should render signed content instead
            expect(react_1.screen.getByText('Signed content')).toBeInTheDocument();
        });
        it('should not render QA mode when answer is undefined', () => {
            const detail = createMockSegmentDetail({
                content: 'Regular content',
                answer: undefined,
                sign_content: 'Signed content',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            // Should not render Q and A labels
            expect(react_1.screen.queryByText('Q')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('A')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // ChunkContent Non-QA Mode Tests - ensure full coverage
    // --------------------------------------------------------------------------
    describe('ChunkContent Non-QA Mode', () => {
        it('should apply line-clamp-3 in fullDocMode', () => {
            mockDocForm.current = datasets_1.ChunkingMode.parentChild;
            mockParentMode.current = 'full-doc';
            const detail = createMockSegmentDetail({
                sign_content: 'Content in full doc mode',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const markdown = react_1.screen.getByTestId('markdown');
            expect(markdown).toHaveClass('line-clamp-3');
        });
        it('should apply line-clamp-2 when not fullDocMode and isCollapsed is true', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            mockIsCollapsed.current = true;
            const detail = createMockSegmentDetail({
                sign_content: 'Collapsed content',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const markdown = react_1.screen.getByTestId('markdown');
            expect(markdown).toHaveClass('line-clamp-2');
        });
        it('should apply line-clamp-20 when not fullDocMode and isCollapsed is false', () => {
            mockDocForm.current = datasets_1.ChunkingMode.text;
            mockIsCollapsed.current = false;
            const detail = createMockSegmentDetail({
                sign_content: 'Expanded content',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const markdown = react_1.screen.getByTestId('markdown');
            expect(markdown).toHaveClass('line-clamp-20');
        });
        it('should fall back to content when sign_content is empty', () => {
            const detail = createMockSegmentDetail({
                content: 'Fallback content',
                sign_content: '',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            expect(react_1.screen.getByText('Fallback content')).toBeInTheDocument();
        });
        it('should render empty string when both sign_content and content are empty', () => {
            const detail = createMockSegmentDetail({
                content: '',
                sign_content: '',
            });
            (0, react_1.render)(<index_1.default loading={false} detail={detail} focused={defaultFocused}/>);
            const markdown = react_1.screen.getByTestId('markdown');
            expect(markdown).toHaveTextContent('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixnREFBZ0Q7QUFDaEQsbUNBQWlDO0FBRWpDLDJDQUEyQztBQUMzQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QyxFQUFFLEVBQUU7WUFDNUQsSUFBSSxHQUFHLEtBQUssb0JBQW9CO2dCQUM5QixPQUFPLE9BQU8sRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQTtZQUMxRCxJQUFJLEdBQUcsS0FBSyxxQkFBcUI7Z0JBQy9CLE9BQU8sT0FBTyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1lBQzlELE1BQU0sTUFBTSxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDbEQsT0FBTyxHQUFHLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUMxQixDQUFDO0tBQ0YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLGlEQUFpRDtBQUNqRCwrRUFBK0U7QUFFL0UsTUFBTSxXQUFXLEdBQUcsRUFBRSxPQUFPLEVBQUUsdUJBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNsRCxNQUFNLGNBQWMsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUF5QixFQUFFLENBQUE7QUFFN0QsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUs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VyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVoRixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNlZ21lbnRMaXN0Q29udGV4dFZhbHVlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvZGV0YWlsL2NvbXBsZXRlZCdcbmltcG9ydCB0eXBlIHsgRG9jdW1lbnRDb250ZXh0VmFsdWUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9kZXRhaWwvY29udGV4dCdcbmltcG9ydCB0eXBlIHsgQXR0YWNobWVudCwgQ2hpbGRDaHVua0RldGFpbCwgUGFyZW50TW9kZSwgU2VnbWVudERldGFpbE1vZGVsIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgU2VnbWVudENhcmQgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayByZWFjdC1pMThuZXh0IC0gZXh0ZXJuYWwgZGVwZW5kZW5jeVxudmkubW9jaygncmVhY3QtaTE4bmV4dCcsICgpID0+ICh7XG4gIHVzZVRyYW5zbGF0aW9uOiAoKSA9PiAoe1xuICAgIHQ6IChrZXk6IHN0cmluZywgb3B0aW9ucz86IHsgY291bnQ/OiBudW1iZXIsIG5zPzogc3RyaW5nIH0pID0+IHtcbiAgICAgIGlmIChrZXkgPT09ICdzZWdtZW50LmNoYXJhY3RlcnMnKVxuICAgICAgICByZXR1cm4gb3B0aW9ucz8uY291bnQgPT09IDEgPyAnY2hhcmFjdGVyJyA6ICdjaGFyYWN0ZXJzJ1xuICAgICAgaWYgKGtleSA9PT0gJ3NlZ21lbnQuY2hpbGRDaHVua3MnKVxuICAgICAgICByZXR1cm4gb3B0aW9ucz8uY291bnQgPT09IDEgPyAnY2hpbGQgY2h1bmsnIDogJ2NoaWxkIGNodW5rcydcbiAgICAgIGNvbnN0IHByZWZpeCA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uYCA6ICcnXG4gICAgICByZXR1cm4gYCR7cHJlZml4fSR7a2V5fWBcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDb250ZXh0IE1vY2tzIC0gbmVlZCB0byBjb250cm9sIHRlc3Qgc2NlbmFyaW9zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IG1vY2tEb2NGb3JtID0geyBjdXJyZW50OiBDaHVua2luZ01vZGUudGV4dCB9XG5jb25zdCBtb2NrUGFyZW50TW9kZSA9IHsgY3VycmVudDogJ3BhcmFncmFwaCcgYXMgUGFyZW50TW9kZSB9XG5cbnZpLm1vY2soJy4uLy4uL2NvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VEb2N1bWVudENvbnRleHQ6IChzZWxlY3RvcjogKHZhbHVlOiBEb2N1bWVudENvbnRleHRWYWx1ZSkgPT4gdW5rbm93bikgPT4ge1xuICAgIGNvbnN0IHZhbHVlOiBEb2N1bWVudENvbnRleHRWYWx1ZSA9IHtcbiAgICAgIGRhdGFzZXRJZDogJ3Rlc3QtZGF0YXNldC1pZCcsXG4gICAgICBkb2N1bWVudElkOiAndGVzdC1kb2N1bWVudC1pZCcsXG4gICAgICBkb2NGb3JtOiBtb2NrRG9jRm9ybS5jdXJyZW50LFxuICAgICAgcGFyZW50TW9kZTogbW9ja1BhcmVudE1vZGUuY3VycmVudCxcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yKHZhbHVlKVxuICB9LFxufSkpXG5cbmNvbnN0IG1vY2tJc0NvbGxhcHNlZCA9IHsgY3VycmVudDogdHJ1ZSB9XG52aS5tb2NrKCcuLi9pbmRleCcsICgpID0+ICh7XG4gIHVzZVNlZ21lbnRMaXN0Q29udGV4dDogKHNlbGVjdG9yOiAodmFsdWU6IFNlZ21lbnRMaXN0Q29udGV4dFZhbHVlKSA9PiB1bmtub3duKSA9PiB7XG4gICAgY29uc3QgdmFsdWU6IFNlZ21lbnRMaXN0Q29udGV4dFZhbHVlID0ge1xuICAgICAgaXNDb2xsYXBzZWQ6IG1vY2tJc0NvbGxhcHNlZC5jdXJyZW50LFxuICAgICAgZnVsbFNjcmVlbjogZmFsc2UsXG4gICAgICB0b2dnbGVGdWxsU2NyZWVuOiB2aS5mbigpLFxuICAgICAgY3VyclNlZ21lbnQ6IHsgc2hvd01vZGFsOiBmYWxzZSB9LFxuICAgICAgY3VyckNoaWxkQ2h1bms6IHsgc2hvd01vZGFsOiBmYWxzZSB9LFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IodmFsdWUpXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ29tcG9uZW50IE1vY2tzIC0gY29tcG9uZW50cyB3aXRoIGNvbXBsZXggZGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIFN0YXR1c0l0ZW0gdXNlcyBSZWFjdCBRdWVyeSBob29rcyB3aGljaCByZXF1aXJlIFF1ZXJ5Q2xpZW50UHJvdmlkZXJcbnZpLm1vY2soJy4uLy4uLy4uL3N0YXR1cy1pdGVtJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgc3RhdHVzLCByZXZlcnNlLCB0ZXh0Q2xzIH06IHsgc3RhdHVzOiBzdHJpbmcsIHJldmVyc2U/OiBib29sZWFuLCB0ZXh0Q2xzPzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic3RhdHVzLWl0ZW1cIiBkYXRhLXN0YXR1cz17c3RhdHVzfSBkYXRhLXJldmVyc2U9e3JldmVyc2V9IGNsYXNzTmFtZT17dGV4dENsc30+XG4gICAgICBTdGF0dXM6XG4gICAgICB7JyAnfVxuICAgICAge3N0YXR1c31cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBJbWFnZUxpc3QgaGFzIGRlZXAgZGVwZW5kZW5jeTogRmlsZVRodW1iIOKGkiBmaWxlLXVwbG9hZGVyIOKGkiByZWFjdC1wZGYtaGlnaGxpZ2h0ZXIgKEVTTSlcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2ltYWdlLWxpc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBpbWFnZXMsIHNpemUsIGNsYXNzTmFtZSB9OiB7IGltYWdlczogQXJyYXk8eyBzb3VyY2VVcmw6IHN0cmluZywgbmFtZTogc3RyaW5nIH0+LCBzaXplPzogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbWFnZS1saXN0XCIgZGF0YS1pbWFnZS1jb3VudD17aW1hZ2VzLmxlbmd0aH0gZGF0YS1zaXplPXtzaXplfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICB7aW1hZ2VzLm1hcCgoaW1nLCBpZHg6IG51bWJlcikgPT4gKFxuICAgICAgICA8aW1nIGtleT17aWR4fSBzcmM9e2ltZy5zb3VyY2VVcmx9IGFsdD17aW1nLm5hbWV9IC8+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNYXJrZG93biB1c2VzIG5leHQvZHluYW1pYyBhbmQgcmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyIChFU00pXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbWFya2Rvd24nLCAoKSA9PiAoe1xuICBNYXJrZG93bjogKHsgY29udGVudCwgY2xhc3NOYW1lIH06IHsgY29udGVudDogc3RyaW5nLCBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtYXJrZG93blwiIGNsYXNzTmFtZT17YG1hcmtkb3duLWJvZHkgJHtjbGFzc05hbWUgfHwgJyd9YH0+e2NvbnRlbnR9PC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrQXR0YWNobWVudCA9IChvdmVycmlkZXM6IFBhcnRpYWw8QXR0YWNobWVudD4gPSB7fSk6IEF0dGFjaG1lbnQgPT4gKHtcbiAgaWQ6ICdhdHRhY2htZW50LTEnLFxuICBuYW1lOiAndGVzdC1pbWFnZS5wbmcnLFxuICBzaXplOiAxMDI0LFxuICBleHRlbnNpb246ICdwbmcnLFxuICBtaW1lX3R5cGU6ICdpbWFnZS9wbmcnLFxuICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS90ZXN0LWltYWdlLnBuZycsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tDaGlsZENodW5rID0gKG92ZXJyaWRlczogUGFydGlhbDxDaGlsZENodW5rRGV0YWlsPiA9IHt9KTogQ2hpbGRDaHVua0RldGFpbCA9PiAoe1xuICBpZDogJ2NoaWxkLWNodW5rLTEnLFxuICBwb3NpdGlvbjogMSxcbiAgc2VnbWVudF9pZDogJ3NlZ21lbnQtMScsXG4gIGNvbnRlbnQ6ICdDaGlsZCBjaHVuayBjb250ZW50JyxcbiAgd29yZF9jb3VudDogMTAwLFxuICBjcmVhdGVkX2F0OiAxNzAwMDAwMDAwLFxuICB1cGRhdGVkX2F0OiAxNzAwMDAwMDAwLFxuICB0eXBlOiAnYXV0b21hdGljJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFNlZ21lbnREZXRhaWxNb2RlbCAmIHsgZG9jdW1lbnQ/OiB7IG5hbWU6IHN0cmluZyB9IH0+ID0ge30pOiBTZWdtZW50RGV0YWlsTW9kZWwgJiB7IGRvY3VtZW50PzogeyBuYW1lOiBzdHJpbmcgfSB9ID0+ICh7XG4gIGlkOiAnc2VnbWVudC0xJyxcbiAgcG9zaXRpb246IDEsXG4gIGRvY3VtZW50X2lkOiAnZG9jLTEnLFxuICBjb250ZW50OiAnVGVzdCBzZWdtZW50IGNvbnRlbnQnLFxuICBzaWduX2NvbnRlbnQ6ICdUZXN0IHNpZ25lZCBjb250ZW50JyxcbiAgd29yZF9jb3VudDogMTAwLFxuICB0b2tlbnM6IDUwLFxuICBrZXl3b3JkczogWydrZXl3b3JkMScsICdrZXl3b3JkMiddLFxuICBpbmRleF9ub2RlX2lkOiAnaW5kZXgtMScsXG4gIGluZGV4X25vZGVfaGFzaDogJ2hhc2gtMScsXG4gIGhpdF9jb3VudDogMTAsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIGRpc2FibGVkX2F0OiAwLFxuICBkaXNhYmxlZF9ieTogJycsXG4gIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gIGNyZWF0ZWRfYnk6ICd1c2VyLTEnLFxuICBjcmVhdGVkX2F0OiAxNzAwMDAwMDAwLFxuICBpbmRleGluZ19hdDogMTcwMDAwMDEwMCxcbiAgY29tcGxldGVkX2F0OiAxNzAwMDAwMjAwLFxuICBlcnJvcjogbnVsbCxcbiAgc3RvcHBlZF9hdDogMCxcbiAgdXBkYXRlZF9hdDogMTcwMDAwMDAwMCxcbiAgYXR0YWNobWVudHM6IFtdLFxuICBjaGlsZF9jaHVua3M6IFtdLFxuICBkb2N1bWVudDogeyBuYW1lOiAnVGVzdCBEb2N1bWVudCcgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgZGVmYXVsdEZvY3VzZWQgPSB7IHNlZ21lbnRJbmRleDogZmFsc2UsIHNlZ21lbnRDb250ZW50OiBmYWxzZSB9XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdTZWdtZW50Q2FyZCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS50ZXh0XG4gICAgbW9ja1BhcmVudE1vZGUuY3VycmVudCA9ICdwYXJhZ3JhcGgnXG4gICAgbW9ja0lzQ29sbGFwc2VkLmN1cnJlbnQgPSB0cnVlXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBza2VsZXRvbiB3aGVuIGxvYWRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17dHJ1ZX0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICAvLyBQYXJlbnRDaHVua0NhcmRTa2VsZXRvbiBzaG91bGQgcmVuZGVyXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJlbnQtY2h1bmstY2FyZC1za2VsZXRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlZ21lbnQgY2FyZCBjb250ZW50IHdoZW4gbG9hZGluZyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gQ2h1bmtDb250ZW50IHNob3dzIHNpZ25fY29udGVudCBmaXJzdCwgdGhlbiBjb250ZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBzaWduZWQgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlZ21lbnQgaW5kZXggdGFnIHdpdGggY29ycmVjdCBwb3NpdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgcG9zaXRpb246IDUgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTA1L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdvcmQgY291bnQgdGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgd29yZF9jb3VudDogMjUwIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyNTAgY2hhcmFjdGVycycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGhpdCBjb3VudCB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBoaXRfY291bnQ6IDQyIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc0MiBkYXRhc2V0RG9jdW1lbnRzLnNlZ21lbnQuaGl0Q291bnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWdtZW50LWNhcmQnKVxuICAgICAgZXhwZWN0KGNhcmQpLnRvSGF2ZUNsYXNzKCdjdXN0b20tY2xhc3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgZW1wdHkgb2JqZWN0IHdoZW4gZGV0YWlsIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFyY2hpdmVkIHByb3AgY29ycmVjdGx5IC0gc3dpdGNoIHNob3VsZCBiZSBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VnbWVudENhcmRcbiAgICAgICAgICBsb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBhcmNoaXZlZD17dHJ1ZX1cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzd2l0Y2hFbGVtZW50ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGV4cGVjdChzd2l0Y2hFbGVtZW50KS50b0hhdmVDbGFzcygnIWN1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBhY3Rpb24gYnV0dG9ucyB3aGVuIGVtYmVkZGluZ0F2YWlsYWJsZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17dHJ1ZX1cbiAgICAgICAgICBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlZ21lbnQtZWRpdC1idXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1kZWxldGUtYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGFjdGlvbiBidXR0b25zIHdoZW4gZW1iZWRkaW5nQXZhaWxhYmxlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17ZmFsc2V9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdzd2l0Y2gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBmb2N1c2VkIHN0eWxlcyB3aGVuIHNlZ21lbnRDb250ZW50IGlzIGZvY3VzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgZm9jdXNlZD17eyBzZWdtZW50SW5kZXg6IGZhbHNlLCBzZWdtZW50Q29udGVudDogdHJ1ZSB9fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgY2FyZCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1jYXJkJylcbiAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygnYmctZGF0YXNldC1jaHVuay1kZXRhaWwtY2FyZC1ob3Zlci1iZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdG9nZ2xlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgd2hlbiBkZWxldGUgYnV0dG9uIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgZW1iZWRkaW5nQXZhaWxhYmxlPXt0cnVlfVxuICAgICAgICAgIGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgZGVsZXRlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWdtZW50LWRlbGV0ZS1idXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGRlbGV0ZUJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0RG9jdW1lbnRzLnNlZ21lbnQuZGVsZXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCB3aGVuIGNhbmNlbCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17dHJ1ZX1cbiAgICAgICAgICBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1kZWxldGUtYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhkZWxldGVCdXR0b24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5zZWdtZW50LmRlbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuc2VnbWVudC5kZWxldGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDYWxsYmFjayBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsaWNrIHdoZW4gY2FyZCBpcyBjbGlja2VkIGluIGdlbmVyYWwgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBvbkNsaWNrPXtvbkNsaWNrfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlZ21lbnQtY2FyZCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2FyZClcblxuICAgICAgZXhwZWN0KG9uQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2xpY2sgd2hlbiBjYXJkIGlzIGNsaWNrZWQgaW4gZnVsbC1kb2MgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBtb2NrUGFyZW50TW9kZS5jdXJyZW50ID0gJ2Z1bGwtZG9jJ1xuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IG9uQ2xpY2s9e29uQ2xpY2t9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgY2FyZCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1jYXJkJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjYXJkKVxuXG4gICAgICBleHBlY3Qob25DbGljaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGljayB3aGVuIHZpZXcgbW9yZSBidXR0b24gaXMgY2xpY2tlZCBpbiBmdWxsLWRvYyBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgICAgIG1vY2tQYXJlbnRNb2RlLmN1cnJlbnQgPSAnZnVsbC1kb2MnXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBvbkNsaWNrPXtvbkNsaWNrfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGNvbnN0IHZpZXdNb3JlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvdmlld01vcmUvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHZpZXdNb3JlQnV0dG9uKVxuXG4gICAgICBleHBlY3Qob25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsaWNrRWRpdCB3aGVuIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsaWNrRWRpdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VnbWVudENhcmRcbiAgICAgICAgICBsb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17b25DbGlja0VkaXR9XG4gICAgICAgICAgZW1iZWRkaW5nQXZhaWxhYmxlPXt0cnVlfVxuICAgICAgICAgIGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1lZGl0LWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZWRpdEJ1dHRvbilcblxuICAgICAgZXhwZWN0KG9uQ2xpY2tFZGl0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRGVsZXRlIHdoZW4gY29uZmlybSBkZWxldGUgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uRGVsZXRlID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGlkOiAndGVzdC1zZWdtZW50LWlkJyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIG9uRGVsZXRlPXtvbkRlbGV0ZX1cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBkZWxldGVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlZ21lbnQtZGVsZXRlLWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZGVsZXRlQnV0dG9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuc2VnbWVudC5kZWxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc3VyZScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRGVsZXRlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgndGVzdC1zZWdtZW50LWlkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZVN3aXRjaCB3aGVuIHN3aXRjaCBpcyB0b2dnbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2VTd2l0Y2ggPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgaWQ6ICd0ZXN0LXNlZ21lbnQtaWQnLCBlbmFibGVkOiB0cnVlLCBzdGF0dXM6ICdjb21wbGV0ZWQnIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgb25DaGFuZ2VTd2l0Y2g9e29uQ2hhbmdlU3dpdGNofVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17dHJ1ZX1cbiAgICAgICAgICBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHN3aXRjaEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaEVsZW1lbnQpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DaGFuZ2VTd2l0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlLCAndGVzdC1zZWdtZW50LWlkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBwcm9wYWdhdGlvbiB3aGVuIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25DbGlja0VkaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICBvbkNsaWNrRWRpdD17b25DbGlja0VkaXR9XG4gICAgICAgICAgZW1iZWRkaW5nQXZhaWxhYmxlPXt0cnVlfVxuICAgICAgICAgIGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1lZGl0LWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZWRpdEJ1dHRvbilcblxuICAgICAgZXhwZWN0KG9uQ2xpY2tFZGl0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkNsaWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBwcm9wYWdhdGlvbiB3aGVuIHN3aXRjaCBhcmVhIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBzdGF0dXM6ICdjb21wbGV0ZWQnIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgb25DbGljaz17b25DbGlja31cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzd2l0Y2hFbGVtZW50ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGNvbnN0IHN3aXRjaENvbnRhaW5lciA9IHN3aXRjaEVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHN3aXRjaENvbnRhaW5lciEpXG5cbiAgICAgIGV4cGVjdChvbkNsaWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNZW1vaXphdGlvbiBMb2dpYyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGlzR2VuZXJhbE1vZGUgY29ycmVjdGx5IGZvciB0ZXh0IG1vZGUgLSBzaG93IGtleXdvcmRzJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS50ZXh0XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGtleXdvcmRzOiBbJ3Rlc3RrZXl3b3JkJ10gfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3RrZXl3b3JkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGlzR2VuZXJhbE1vZGUgY29ycmVjdGx5IGZvciBub24tdGV4dCBtb2RlIC0gaGlkZSBrZXl3b3JkcycsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucWFcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsga2V5d29yZHM6IFsndGVzdGtleXdvcmQnXSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCd0ZXN0a2V5d29yZCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgaXNQYXJlbnRDaGlsZE1vZGUgY29ycmVjdGx5IC0gc2hvdyBwYXJlbnQgY2h1bmsgcHJlZml4JywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZFxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldERvY3VtZW50c1xcLnNlZ21lbnRcXC5wYXJlbnRDaHVuay9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgaXNGdWxsRG9jTW9kZSBjb3JyZWN0bHkgLSBzaG93IHZpZXcgbW9yZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBtb2NrUGFyZW50TW9kZS5jdXJyZW50ID0gJ2Z1bGwtZG9jJ1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi52aWV3TW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29tcHV0ZSBpc1BhcmFncmFwaE1vZGUgY29ycmVjdGx5IGFuZCBzaG93IGNoaWxkIGNodW5rcycsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgICAgIG1vY2tQYXJlbnRNb2RlLmN1cnJlbnQgPSAncGFyYWdyYXBoJ1xuICAgICAgY29uc3QgY2hpbGRDaHVua3MgPSBbY3JlYXRlTW9ja0NoaWxkQ2h1bmsoKV1cbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgY2hpbGRfY2h1bmtzOiBjaGlsZENodW5rcyB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICAvLyBDaGlsZFNlZ21lbnRMaXN0IHNob3VsZCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGlsZCBjaHVuay9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgY2h1bmtFZGl0ZWQgY29ycmVjdGx5IHdoZW4gdXBkYXRlZF9hdCA+IGNyZWF0ZWRfYXQnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgY3JlYXRlZF9hdDogMTcwMDAwMDAwMCxcbiAgICAgICAgdXBkYXRlZF9hdDogMTcwMDAwMDAwMSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0RG9jdW1lbnRzLnNlZ21lbnQuZWRpdGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBlZGl0ZWQgYmFkZ2Ugd2hlbiB0aW1lc3RhbXBzIGFyZSBlcXVhbCcsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUudGV4dFxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoe1xuICAgICAgICBjcmVhdGVkX2F0OiAxNzAwMDAwMDAwLFxuICAgICAgICB1cGRhdGVkX2F0OiAxNzAwMDAwMDAwLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5zZWdtZW50LmVkaXRlZCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGVkaXRlZCBiYWRnZSBpbiBmdWxsLWRvYyBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZFxuICAgICAgbW9ja1BhcmVudE1vZGUuY3VycmVudCA9ICdmdWxsLWRvYydcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgY3JlYXRlZF9hdDogMTcwMDAwMDAwMCxcbiAgICAgICAgdXBkYXRlZF9hdDogMTcwMDAwMDAwMSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuc2VnbWVudC5lZGl0ZWQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGNvbnRlbnRPcGFjaXR5IGNvcnJlY3RseSB3aGVuIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGVuYWJsZWQ6IHRydWUgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGNvbnN0IHdvcmRDb3VudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3lzdGVtLXhzLW1lZGl1bS50ZXh0LXRleHQtdGVydGlhcnknKVxuICAgICAgZXhwZWN0KHdvcmRDb3VudCkubm90LnRvSGF2ZUNsYXNzKCdvcGFjaXR5LTUwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGNvbnRlbnRPcGFjaXR5IGNvcnJlY3RseSB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBlbmFibGVkOiBmYWxzZSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICAvLyBDaHVua0NvbnRlbnQgcmVjZWl2ZXMgb3BhY2l0eSBjbGFzcyB3aGVuIGRpc2FibGVkXG4gICAgICBjb25zdCBtYXJrZG93biA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbWFya2Rvd24nKVxuICAgICAgZXhwZWN0KG1hcmtkb3duKS50b0hhdmVDbGFzcygnb3BhY2l0eS01MCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGFwcGx5IG9wYWNpdHkgd2hlbiBkaXNhYmxlZCBidXQgZm9jdXNlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgZW5hYmxlZDogZmFsc2UgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgZm9jdXNlZD17eyBzZWdtZW50SW5kZXg6IGZhbHNlLCBzZWdtZW50Q29udGVudDogdHJ1ZSB9fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgd29yZENvdW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zeXN0ZW0teHMtbWVkaXVtLnRleHQtdGV4dC10ZXJ0aWFyeScpXG4gICAgICBleHBlY3Qod29yZENvdW50KS5ub3QudG9IYXZlQ2xhc3MoJ29wYWNpdHktNTAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgd29yZENvdW50VGV4dCB3aXRoIGNvcnJlY3QgZm9ybWF0IGZvciBzaW5ndWxhcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgd29yZF9jb3VudDogMSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMSBjaGFyYWN0ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTW9kZS1zcGVjaWZpYyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01vZGUtc3BlY2lmaWMgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgcGFkZGluZyBjbGFzc2VzIGluIGZ1bGwtZG9jIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBtb2NrUGFyZW50TW9kZS5jdXJyZW50ID0gJ2Z1bGwtZG9jJ1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBjb25zdCBjYXJkID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWdtZW50LWNhcmQnKVxuICAgICAgZXhwZWN0KGNhcmQpLm5vdC50b0hhdmVDbGFzcygncGItMicpXG4gICAgICBleHBlY3QoY2FyZCkubm90LnRvSGF2ZUNsYXNzKCdwdC0yLjUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGhvdmVyIGNsYXNzZXMgaW4gbm9uIGZ1bGwtZG9jIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgY29uc3QgY2FyZCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VnbWVudC1jYXJkJylcbiAgICAgIGV4cGVjdChjYXJkKS50b0hhdmVDbGFzcygncGItMicpXG4gICAgICBleHBlY3QoY2FyZCkudG9IYXZlQ2xhc3MoJ3B0LTIuNScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzdGF0dXMgaXRlbSBpbiBmdWxsLWRvYyBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZFxuICAgICAgbW9ja1BhcmVudE1vZGUuY3VycmVudCA9ICdmdWxsLWRvYydcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKClcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gSW4gZnVsbC1kb2MgbW9kZSwgc3RhdHVzIGl0ZW0gc2hvdWxkIG5vdCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1N0YXR1czonKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENoaWxkIFNlZ21lbnQgTGlzdCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ2hpbGQgU2VnbWVudCBMaXN0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIENoaWxkU2VnbWVudExpc3Qgd2hlbiBpbiBwYXJhZ3JhcGggbW9kZSB3aXRoIGNoaWxkIGNodW5rcycsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgICAgIG1vY2tQYXJlbnRNb2RlLmN1cnJlbnQgPSAncGFyYWdyYXBoJ1xuICAgICAgY29uc3QgY2hpbGRDaHVua3MgPSBbY3JlYXRlTW9ja0NoaWxkQ2h1bmsoKSwgY3JlYXRlTW9ja0NoaWxkQ2h1bmsoeyBpZDogJ2NoaWxkLTInLCBwb3NpdGlvbjogMiB9KV1cbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgY2hpbGRfY2h1bmtzOiBjaGlsZENodW5rcyB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMiBjaGlsZCBjaHVua3MvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIENoaWxkU2VnbWVudExpc3Qgd2hlbiBjaGlsZF9jaHVua3MgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBtb2NrUGFyZW50TW9kZS5jdXJyZW50ID0gJ3BhcmFncmFwaCdcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgY2hpbGRfY2h1bmtzOiBbXSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9jaGlsZCBjaHVuay9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIENoaWxkU2VnbWVudExpc3QgaW4gZnVsbC1kb2MgbW9kZScsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgICAgIG1vY2tQYXJlbnRNb2RlLmN1cnJlbnQgPSAnZnVsbC1kb2MnXG4gICAgICBjb25zdCBjaGlsZENodW5rcyA9IFtjcmVhdGVNb2NrQ2hpbGRDaHVuaygpXVxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBjaGlsZF9jaHVua3M6IGNoaWxkQ2h1bmtzIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIC8vIEluIGZ1bGwtZG9jIG1vZGUsIENoaWxkU2VnbWVudExpc3Qgc2hvdWxkIG5vdCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoLzEgY2hpbGQgY2h1bmskL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlQWRkTmV3Q2hpbGRDaHVuayB3aGVuIGFkZCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucGFyZW50Q2hpbGRcbiAgICAgIG1vY2tQYXJlbnRNb2RlLmN1cnJlbnQgPSAncGFyYWdyYXBoJ1xuICAgICAgY29uc3QgaGFuZGxlQWRkTmV3Q2hpbGRDaHVuayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGNoaWxkQ2h1bmtzID0gW2NyZWF0ZU1vY2tDaGlsZENodW5rKCldXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGlkOiAncGFyZW50LWlkJywgY2hpbGRfY2h1bmtzOiBjaGlsZENodW5rcyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIGhhbmRsZUFkZE5ld0NoaWxkQ2h1bms9e2hhbmRsZUFkZE5ld0NoaWxkQ2h1bmt9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBhZGRCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmFkZCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYWRkQnV0dG9uKVxuXG4gICAgICBleHBlY3QoaGFuZGxlQWRkTmV3Q2hpbGRDaHVuaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3BhcmVudC1pZCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBLZXl3b3JkcyBEaXNwbGF5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdLZXl3b3JkcyBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGtleXdvcmRzIHdpdGggIyBwcmVmaXggaW4gZ2VuZXJhbCBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS50ZXh0XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGtleXdvcmRzOiBbJ2tleXdvcmQxJywgJ2tleXdvcmQyJ10gfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdrZXl3b3JkMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgna2V5d29yZDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gVGFnIGNvbXBvbmVudCBzaG93cyAjIHByZWZpeFxuICAgICAgY29uc3QgaGFzaHRhZ3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnRleHQtdGV4dC1xdWF0ZXJuYXJ5JylcbiAgICAgIGV4cGVjdChoYXNodGFncy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIga2V5d29yZHMgaW4gUUEgbW9kZScsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLmN1cnJlbnQgPSBDaHVua2luZ01vZGUucWFcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsga2V5d29yZHM6IFsna2V5d29yZDEnXSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdrZXl3b3JkMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIga2V5d29yZHMgaW4gcGFyZW50LWNoaWxkIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGtleXdvcmRzOiBbJ2tleXdvcmQxJ10gfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgna2V5d29yZDEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEltYWdlcyBEaXNwbGF5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbWFnZXMgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbWFnZUxpc3Qgd2hlbiBhdHRhY2htZW50cyBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGF0dGFjaG1lbnRzID0gW2NyZWF0ZU1vY2tBdHRhY2htZW50KCldXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGF0dGFjaG1lbnRzIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIC8vIEltYWdlTGlzdCB1c2VzIEZpbGVUaHVtYiB3aGljaCByZW5kZXJzIGltYWdlc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeUFsdFRleHQoJ3Rlc3QtaW1hZ2UucG5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIEltYWdlTGlzdCB3aGVuIGF0dGFjaG1lbnRzIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBhdHRhY2htZW50czogW10gfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5QWx0VGV4dCgndGVzdC1pbWFnZS5wbmcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgZGV0YWlsIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e3VuZGVmaW5lZH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmsvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZGV0YWlsIG9iamVjdCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXt7fSBhcyBTZWdtZW50RGV0YWlsTW9kZWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgY2FsbGJhY2sgZnVuY3Rpb25zIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgb25DbGljaz17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uQ2hhbmdlU3dpdGNoPXt1bmRlZmluZWR9XG4gICAgICAgICAgb25EZWxldGU9e3VuZGVmaW5lZH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dW5kZWZpbmVkfVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17dHJ1ZX1cbiAgICAgICAgICBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlZ21lbnQtY2FyZCcpXG4gICAgICBleHBlY3QoKCkgPT4gZmlyZUV2ZW50LmNsaWNrKGNhcmQpKS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN3aXRjaCBiZWluZyBkaXNhYmxlZCB3aGVuIHN0YXR1cyBpcyBub3QgY29tcGxldGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBzdGF0dXM6ICdpbmRleGluZycgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VnbWVudENhcmRcbiAgICAgICAgICBsb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBUaGUgU3dpdGNoIGNvbXBvbmVudCB1c2VzIENTUyBjbGFzc2VzIGZvciBkaXNhYmxlZCBzdGF0ZSwgbm90IHRoZSBuYXRpdmUgZGlzYWJsZWQgYXR0cmlidXRlXG4gICAgICBjb25zdCBzd2l0Y2hFbGVtZW50ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGV4cGVjdChzd2l0Y2hFbGVtZW50KS50b0hhdmVDbGFzcygnIWN1cnNvci1ub3QtYWxsb3dlZCcsICchb3BhY2l0eS01MCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHplcm8gd29yZCBjb3VudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgd29yZF9jb3VudDogMCB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMCBjaGFyYWN0ZXJzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBoaXQgY291bnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGhpdF9jb3VudDogMCB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMCBkYXRhc2V0RG9jdW1lbnRzLnNlZ21lbnQuaGl0Q291bnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgY29udGVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdDb250ZW50ID0gJ0EnLnJlcGVhdCgxMDAwMClcbiAgICAgIC8vIENodW5rQ29udGVudCBzaG93cyBzaWduX2NvbnRlbnQgZmlyc3QsIHNvIHNldCBpdCB0byB0aGUgbG9uZyBjb250ZW50XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IHNpZ25fY29udGVudDogbG9uZ0NvbnRlbnQgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0NvbnRlbnQpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFsIFRhZyBjb21wb25lbnQgd2l0aCBoYXNodGFnIHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsga2V5d29yZHM6IFsndGVzdGtleXdvcmQnXSB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGVzdGtleXdvcmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFsIERpdmlkZXIgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIGVtYmVkZGluZ0F2YWlsYWJsZT17dHJ1ZX1cbiAgICAgICAgICBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRpdmlkZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJnLWRpdmlkZXItcmVndWxhcicpXG4gICAgICBleHBlY3QoZGl2aWRlcnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmVhbCBCYWRnZSBjb21wb25lbnQgd2hlbiBlZGl0ZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgY3JlYXRlZF9hdDogMTcwMDAwMDAwMCxcbiAgICAgICAgdXBkYXRlZF9hdDogMTcwMDAwMDAwMSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGNvbnN0IGVkaXRlZEJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5zZWdtZW50LmVkaXRlZCcpXG4gICAgICBleHBlY3QoZWRpdGVkQmFkZ2UpLnRvSGF2ZUNsYXNzKCdzeXN0ZW0tMnhzLW1lZGl1bS11cHBlcmNhc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFsIFN3aXRjaCBjb21wb25lbnQgd2l0aCBjb3JyZWN0IGVuYWJsZWQgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGVuYWJsZWQ6IHRydWUsIHN0YXR1czogJ2NvbXBsZXRlZCcgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8U2VnbWVudENhcmRcbiAgICAgICAgICBsb2FkaW5nPXtmYWxzZX1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzd2l0Y2hFbGVtZW50ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJylcbiAgICAgIGV4cGVjdChzd2l0Y2hFbGVtZW50KS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy10b2dnbGUtYmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFsIFN3aXRjaCBjb21wb25lbnQgd2l0aCB1bmNoZWNrZWQgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7IGVuYWJsZWQ6IGZhbHNlLCBzdGF0dXM6ICdjb21wbGV0ZWQnIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFNlZ21lbnRDYXJkXG4gICAgICAgICAgbG9hZGluZz17ZmFsc2V9XG4gICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgZW1iZWRkaW5nQXZhaWxhYmxlPXt0cnVlfVxuICAgICAgICAgIGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgc3dpdGNoRWxlbWVudCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpXG4gICAgICBleHBlY3Qoc3dpdGNoRWxlbWVudCkudG9IYXZlQ2xhc3MoJ2JnLWNvbXBvbmVudHMtdG9nZ2xlLWJnLXVuY2hlY2tlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlYWwgU2VnbWVudEluZGV4VGFnIHdpdGggcG9zaXRpb24gZm9ybWF0dGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHsgcG9zaXRpb246IDEgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTAxL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlYWwgU2VnbWVudEluZGV4VGFnIHdpdGggZG91YmxlIGRpZ2l0IHBvc2l0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoeyBwb3NpdGlvbjogMTIgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTEyL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBBbGwgUHJvcHMgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWxsIFByb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggYWxsIHByb3BzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZFxuICAgICAgbW9ja1BhcmVudE1vZGUuY3VycmVudCA9ICdwYXJhZ3JhcGgnXG4gICAgICBjb25zdCBjaGlsZENodW5rcyA9IFtjcmVhdGVNb2NrQ2hpbGRDaHVuaygpXVxuICAgICAgY29uc3QgYXR0YWNobWVudHMgPSBbY3JlYXRlTW9ja0F0dGFjaG1lbnQoKV1cbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgaWQ6ICdmdWxsLXByb3BzLXNlZ21lbnQnLFxuICAgICAgICBwb3NpdGlvbjogMTAsXG4gICAgICAgIHNpZ25fY29udGVudDogJ0Z1bGwgc2lnbmVkIGNvbnRlbnQnLFxuICAgICAgICBjb250ZW50OiAnRnVsbCBjb250ZW50JyxcbiAgICAgICAgd29yZF9jb3VudDogNTAwLFxuICAgICAgICBoaXRfY291bnQ6IDI1LFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogWydrZXkxJywgJ2tleTInXSxcbiAgICAgICAgY2hpbGRfY2h1bmtzOiBjaGlsZENodW5rcyxcbiAgICAgICAgYXR0YWNobWVudHMsXG4gICAgICAgIGNyZWF0ZWRfYXQ6IDE3MDAwMDAwMDAsXG4gICAgICAgIHVwZGF0ZWRfYXQ6IDE3MDAwMDAwMDEsXG4gICAgICAgIHN0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTZWdtZW50Q2FyZFxuICAgICAgICAgIGxvYWRpbmc9e2ZhbHNlfVxuICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgIG9uQ2xpY2s9e3ZpLmZuKCl9XG4gICAgICAgICAgb25DaGFuZ2VTd2l0Y2g9e3ZpLmZuKCl9XG4gICAgICAgICAgb25EZWxldGU9e3ZpLmZuKCl9XG4gICAgICAgICAgb25EZWxldGVDaGlsZENodW5rPXt2aS5mbigpfVxuICAgICAgICAgIGhhbmRsZUFkZE5ld0NoaWxkQ2h1bms9e3ZpLmZuKCl9XG4gICAgICAgICAgb25DbGlja1NsaWNlPXt2aS5mbigpfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImZ1bGwtcHJvcHMtY2xhc3NcIlxuICAgICAgICAgIGFyY2hpdmVkPXtmYWxzZX1cbiAgICAgICAgICBlbWJlZGRpbmdBdmFpbGFibGU9e3RydWV9XG4gICAgICAgICAgZm9jdXNlZD17eyBzZWdtZW50SW5kZXg6IHRydWUsIHNlZ21lbnRDb250ZW50OiB0cnVlIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDaHVua0NvbnRlbnQgc2hvd3Mgc2lnbl9jb250ZW50IGZpcnN0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRnVsbCBzaWduZWQgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3dpdGNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggbWluaW1hbCBwcm9wcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17dHJ1ZX0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi52aWV3TW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxvYWRpbmcgdHJhbnNpdGlvbiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCgpXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17dHJ1ZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gV2hlbiBsb2FkaW5nLCBjb250ZW50IHNob3VsZCBub3QgYmUgdmlzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnVGVzdCBzaWduZWQgY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIC8vIENodW5rQ29udGVudCBzaG93cyBzaWduX2NvbnRlbnQgZmlyc3RcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IHNpZ25lZCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENodW5rQ29udGVudCBRQSBNb2RlIFRlc3RzIC0gY292ZXIgbGluZXMgMjUtNDlcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NodW5rQ29udGVudCBRQSBNb2RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFEgYW5kIEEgc2VjdGlvbnMgd2hlbiBhbnN3ZXIgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7XG4gICAgICAgIGNvbnRlbnQ6ICdUaGlzIGlzIHRoZSBxdWVzdGlvbiBjb250ZW50JyxcbiAgICAgICAgYW5zd2VyOiAnVGhpcyBpcyB0aGUgYW5zd2VyIGNvbnRlbnQnLFxuICAgICAgICBzaWduX2NvbnRlbnQ6ICcnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBRIGxhYmVsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIEEgbGFiZWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIFNob3VsZCByZW5kZXIgcXVlc3Rpb24gY29udGVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgdGhlIHF1ZXN0aW9uIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBhbnN3ZXIgY29udGVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgdGhlIGFuc3dlciBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBsaW5lLWNsYW1wLTIgY2xhc3Mgd2hlbiBpc0NvbGxhcHNlZCBpcyB0cnVlIGluIFFBIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNDb2xsYXBzZWQuY3VycmVudCA9IHRydWVcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgY29udGVudDogJ1F1ZXN0aW9uIGNvbnRlbnQnLFxuICAgICAgICBhbnN3ZXI6ICdBbnN3ZXIgY29udGVudCcsXG4gICAgICAgIHNpZ25fY29udGVudDogJycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICAvLyBNYXJrZG93biBjb21wb25lbnRzIHNob3VsZCBoYXZlIGxpbmUtY2xhbXAtMiBjbGFzcyB3aGVuIGNvbGxhcHNlZFxuICAgICAgY29uc3QgbWFya2Rvd25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdtYXJrZG93bicpXG4gICAgICBtYXJrZG93bnMuZm9yRWFjaCgobWFya2Rvd24pID0+IHtcbiAgICAgICAgZXhwZWN0KG1hcmtkb3duKS50b0hhdmVDbGFzcygnbGluZS1jbGFtcC0yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgbGluZS1jbGFtcC0yMCBjbGFzcyB3aGVuIGlzQ29sbGFwc2VkIGlzIGZhbHNlIGluIFFBIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNDb2xsYXBzZWQuY3VycmVudCA9IGZhbHNlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7XG4gICAgICAgIGNvbnRlbnQ6ICdRdWVzdGlvbiBjb250ZW50JyxcbiAgICAgICAgYW5zd2VyOiAnQW5zd2VyIGNvbnRlbnQnLFxuICAgICAgICBzaWduX2NvbnRlbnQ6ICcnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gTWFya2Rvd24gY29tcG9uZW50cyBzaG91bGQgaGF2ZSBsaW5lLWNsYW1wLTIwIGNsYXNzIHdoZW4gbm90IGNvbGxhcHNlZFxuICAgICAgY29uc3QgbWFya2Rvd25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdtYXJrZG93bicpXG4gICAgICBtYXJrZG93bnMuZm9yRWFjaCgobWFya2Rvd24pID0+IHtcbiAgICAgICAgZXhwZWN0KG1hcmtkb3duKS50b0hhdmVDbGFzcygnbGluZS1jbGFtcC0yMCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBRQSBtb2RlIHdpdGggY2xhc3NOYW1lIGFwcGxpZWQgdG8gd3JhcHBlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgY29udGVudDogJ1F1ZXN0aW9uJyxcbiAgICAgICAgYW5zd2VyOiAnQW5zd2VyJyxcbiAgICAgICAgc2lnbl9jb250ZW50OiAnJyxcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gVGhlIENodW5rQ29udGVudCB3cmFwcGVyIHNob3VsZCBoYXZlIG9wYWNpdHkgY2xhc3Mgd2hlbiBkaXNhYmxlZFxuICAgICAgY29uc3QgcWFXcmFwcGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mbGV4LmdhcC14LTEnKVxuICAgICAgZXhwZWN0KHFhV3JhcHBlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgUUEgbW9kZSB3aGVuIGFuc3dlciBpcyBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7XG4gICAgICAgIGNvbnRlbnQ6ICdSZWd1bGFyIGNvbnRlbnQnLFxuICAgICAgICBhbnN3ZXI6ICcnLFxuICAgICAgICBzaWduX2NvbnRlbnQ6ICdTaWduZWQgY29udGVudCcsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICAvLyBTaG91bGQgbm90IHJlbmRlciBRIGFuZCBBIGxhYmVsc1xuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnUScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnQScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBzaWduZWQgY29udGVudCBpbnN0ZWFkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2lnbmVkIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgUUEgbW9kZSB3aGVuIGFuc3dlciBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7XG4gICAgICAgIGNvbnRlbnQ6ICdSZWd1bGFyIGNvbnRlbnQnLFxuICAgICAgICBhbnN3ZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgc2lnbl9jb250ZW50OiAnU2lnbmVkIGNvbnRlbnQnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgLy8gU2hvdWxkIG5vdCByZW5kZXIgUSBhbmQgQSBsYWJlbHNcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1EnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0EnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENodW5rQ29udGVudCBOb24tUUEgTW9kZSBUZXN0cyAtIGVuc3VyZSBmdWxsIGNvdmVyYWdlXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDaHVua0NvbnRlbnQgTm9uLVFBIE1vZGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBsaW5lLWNsYW1wLTMgaW4gZnVsbERvY01vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkXG4gICAgICBtb2NrUGFyZW50TW9kZS5jdXJyZW50ID0gJ2Z1bGwtZG9jJ1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoe1xuICAgICAgICBzaWduX2NvbnRlbnQ6ICdDb250ZW50IGluIGZ1bGwgZG9jIG1vZGUnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgY29uc3QgbWFya2Rvd24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21hcmtkb3duJylcbiAgICAgIGV4cGVjdChtYXJrZG93bikudG9IYXZlQ2xhc3MoJ2xpbmUtY2xhbXAtMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgbGluZS1jbGFtcC0yIHdoZW4gbm90IGZ1bGxEb2NNb2RlIGFuZCBpc0NvbGxhcHNlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0uY3VycmVudCA9IENodW5raW5nTW9kZS50ZXh0XG4gICAgICBtb2NrSXNDb2xsYXBzZWQuY3VycmVudCA9IHRydWVcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgc2lnbl9jb250ZW50OiAnQ29sbGFwc2VkIGNvbnRlbnQnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxTZWdtZW50Q2FyZCBsb2FkaW5nPXtmYWxzZX0gZGV0YWlsPXtkZXRhaWx9IGZvY3VzZWQ9e2RlZmF1bHRGb2N1c2VkfSAvPilcblxuICAgICAgY29uc3QgbWFya2Rvd24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21hcmtkb3duJylcbiAgICAgIGV4cGVjdChtYXJrZG93bikudG9IYXZlQ2xhc3MoJ2xpbmUtY2xhbXAtMicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgbGluZS1jbGFtcC0yMCB3aGVuIG5vdCBmdWxsRG9jTW9kZSBhbmQgaXNDb2xsYXBzZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5jdXJyZW50ID0gQ2h1bmtpbmdNb2RlLnRleHRcbiAgICAgIG1vY2tJc0NvbGxhcHNlZC5jdXJyZW50ID0gZmFsc2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tTZWdtZW50RGV0YWlsKHtcbiAgICAgICAgc2lnbl9jb250ZW50OiAnRXhwYW5kZWQgY29udGVudCcsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFNlZ21lbnRDYXJkIGxvYWRpbmc9e2ZhbHNlfSBkZXRhaWw9e2RldGFpbH0gZm9jdXNlZD17ZGVmYXVsdEZvY3VzZWR9IC8+KVxuXG4gICAgICBjb25zdCBtYXJrZG93biA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbWFya2Rvd24nKVxuICAgICAgZXhwZWN0KG1hcmtkb3duKS50b0hhdmVDbGFzcygnbGluZS1jbGFtcC0yMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmFsbCBiYWNrIHRvIGNvbnRlbnQgd2hlbiBzaWduX2NvbnRlbnQgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrU2VnbWVudERldGFpbCh7XG4gICAgICAgIGNvbnRlbnQ6ICdGYWxsYmFjayBjb250ZW50JyxcbiAgICAgICAgc2lnbl9jb250ZW50OiAnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGYWxsYmFjayBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgc3RyaW5nIHdoZW4gYm90aCBzaWduX2NvbnRlbnQgYW5kIGNvbnRlbnQgYXJlIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja1NlZ21lbnREZXRhaWwoe1xuICAgICAgICBjb250ZW50OiAnJyxcbiAgICAgICAgc2lnbl9jb250ZW50OiAnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8U2VnbWVudENhcmQgbG9hZGluZz17ZmFsc2V9IGRldGFpbD17ZGV0YWlsfSBmb2N1c2VkPXtkZWZhdWx0Rm9jdXNlZH0gLz4pXG5cbiAgICAgIGNvbnN0IG1hcmtkb3duID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtYXJrZG93bicpXG4gICAgICBleHBlY3QobWFya2Rvd24pLnRvSGF2ZVRleHRDb250ZW50KCcnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19