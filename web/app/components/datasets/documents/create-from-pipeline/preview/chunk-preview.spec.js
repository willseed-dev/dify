"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/models/datasets");
const pipeline_1 = require("@/models/pipeline");
const chunk_preview_1 = require("./chunk-preview");
// Uses global react-i18next mock from web/vitest.setup.ts
// Mock dataset-detail context - needs mock to control return values
const mockDocForm = vi.fn();
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (_selector) => {
        return mockDocForm();
    },
}));
// Mock document picker - needs mock for simplified interaction testing
vi.mock('../../../common/document-picker/preview-document-picker', () => ({
    default: ({ files, onChange, value }) => (<div data-testid="document-picker">
      <span data-testid="picker-value">{value?.name || 'No selection'}</span>
      <select data-testid="picker-select" value={value?.id || ''} onChange={(e) => {
            const selected = files.find(f => f.id === e.target.value);
            if (selected)
                onChange(selected);
        }}>
        {files.map(f => (<option key={f.id} value={f.id}>{f.name}</option>))}
      </select>
    </div>),
}));
// Test data factories
const createMockLocalFile = (overrides) => ({
    id: 'file-1',
    name: 'test-file.pdf',
    size: 1024,
    type: 'application/pdf',
    extension: 'pdf',
    lastModified: Date.now(),
    webkitRelativePath: '',
    arrayBuffer: vi.fn(),
    bytes: vi.fn(),
    slice: vi.fn(),
    stream: vi.fn(),
    text: vi.fn(),
    ...overrides,
});
const createMockNotionPage = (overrides) => ({
    page_id: 'page-1',
    page_name: 'Test Page',
    workspace_id: 'workspace-1',
    type: 'page',
    page_icon: null,
    parent_id: 'parent-1',
    is_bound: true,
    ...overrides,
});
const createMockCrawlResult = (overrides) => ({
    title: 'Test Website',
    markdown: 'Test content',
    description: 'Test description',
    source_url: 'https://example.com',
    ...overrides,
});
const createMockOnlineDriveFile = (overrides) => ({
    id: 'drive-file-1',
    name: 'test-drive-file.docx',
    size: 2048,
    type: pipeline_1.OnlineDriveFileType.file,
    ...overrides,
});
const createMockEstimateData = (overrides) => ({
    total_nodes: 5,
    tokens: 1000,
    total_price: 0.01,
    currency: 'USD',
    total_segments: 10,
    preview: [
        { content: 'Chunk content 1', child_chunks: ['child 1', 'child 2'] },
        { content: 'Chunk content 2', child_chunks: ['child 3'] },
    ],
    qa_preview: [
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
    ],
    ...overrides,
});
const defaultProps = {
    dataSourceType: pipeline_1.DatasourceType.localFile,
    localFiles: [createMockLocalFile()],
    onlineDocuments: [createMockNotionPage()],
    websitePages: [createMockCrawlResult()],
    onlineDriveFiles: [createMockOnlineDriveFile()],
    isIdle: false,
    isPending: false,
    estimateData: undefined,
    onPreview: vi.fn(),
    handlePreviewFileChange: vi.fn(),
    handlePreviewOnlineDocumentChange: vi.fn(),
    handlePreviewWebsitePageChange: vi.fn(),
    handlePreviewOnlineDriveFileChange: vi.fn(),
};
describe('ChunkPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
    });
    describe('Rendering', () => {
        it('should render the component with preview container', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps}/>);
            // i18n mock returns key by default
            expect(react_1.screen.getByText('datasetCreation.stepTwo.preview')).toBeInTheDocument();
        });
        it('should render document picker for local files', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.localFile}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should render document picker for online documents', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDocument}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should render document picker for website pages', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.websiteCrawl}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should render document picker for online drive files', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDrive}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should render badge with chunk count for non-QA mode', () => {
            const estimateData = createMockEstimateData({ total_segments: 15 });
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            // Badge shows chunk count via i18n key with count option
            expect(react_1.screen.getByText(/previewChunkCount.*15/)).toBeInTheDocument();
        });
        it('should not render badge for QA mode', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.qa);
            const estimateData = createMockEstimateData();
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            // No badge with total_segments
            expect(react_1.screen.queryByText(/10/)).not.toBeInTheDocument();
        });
    });
    describe('Idle State', () => {
        it('should render idle state with preview tip and button', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} isIdle={true}/>);
            // i18n mock returns keys
            expect(react_1.screen.getByText('datasetCreation.stepTwo.previewChunkTip')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.previewChunks')).toBeInTheDocument();
        });
        it('should call onPreview when preview button is clicked', () => {
            const onPreview = vi.fn();
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} isIdle={true} onPreview={onPreview}/>);
            const button = react_1.screen.getByRole('button', { name: /previewChunks/i });
            react_1.fireEvent.click(button);
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
    });
    describe('Loading State', () => {
        it('should render skeleton loading when isPending is true', () => {
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} isPending={true}/>);
            // Skeleton loading renders multiple skeleton containers
            expect(document.querySelector('.space-y-6')).toBeInTheDocument();
        });
        it('should not render preview content when loading', () => {
            const estimateData = createMockEstimateData();
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} isPending={true} estimateData={estimateData}/>);
            expect(react_1.screen.queryByText('Chunk content 1')).not.toBeInTheDocument();
        });
    });
    describe('QA Mode Preview', () => {
        it('should render QA preview chunks when doc_form is qa', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.qa);
            const estimateData = createMockEstimateData({
                qa_preview: [
                    { question: 'Question 1?', answer: 'Answer 1' },
                    { question: 'Question 2?', answer: 'Answer 2' },
                ],
            });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.getByText('Question 1?')).toBeInTheDocument();
            expect(react_1.screen.getByText('Answer 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Question 2?')).toBeInTheDocument();
            expect(react_1.screen.getByText('Answer 2')).toBeInTheDocument();
        });
    });
    describe('Text Mode Preview', () => {
        it('should render text preview chunks when doc_form is text', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
            const estimateData = createMockEstimateData({
                preview: [
                    { content: 'Text chunk 1', child_chunks: [] },
                    { content: 'Text chunk 2', child_chunks: [] },
                ],
            });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.getByText('Text chunk 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Text chunk 2')).toBeInTheDocument();
        });
    });
    describe('Parent-Child Mode Preview', () => {
        it('should render parent-child preview chunks', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.parentChild);
            const estimateData = createMockEstimateData({
                preview: [
                    { content: 'Parent chunk 1', child_chunks: ['Child 1', 'Child 2'] },
                ],
            });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.getByText('Child 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Child 2')).toBeInTheDocument();
        });
    });
    describe('Document Selection', () => {
        it('should handle local file selection change', () => {
            const handlePreviewFileChange = vi.fn();
            const localFiles = [
                createMockLocalFile({ id: 'file-1', name: 'file1.pdf' }),
                createMockLocalFile({ id: 'file-2', name: 'file2.pdf' }),
            ];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.localFile} localFiles={localFiles} handlePreviewFileChange={handlePreviewFileChange}/>);
            const select = react_1.screen.getByTestId('picker-select');
            react_1.fireEvent.change(select, { target: { value: 'file-2' } });
            expect(handlePreviewFileChange).toHaveBeenCalled();
        });
        it('should handle online document selection change', () => {
            const handlePreviewOnlineDocumentChange = vi.fn();
            const onlineDocuments = [
                createMockNotionPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockNotionPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDocument} onlineDocuments={onlineDocuments} handlePreviewOnlineDocumentChange={handlePreviewOnlineDocumentChange}/>);
            const select = react_1.screen.getByTestId('picker-select');
            react_1.fireEvent.change(select, { target: { value: 'page-2' } });
            expect(handlePreviewOnlineDocumentChange).toHaveBeenCalled();
        });
        it('should handle website page selection change', () => {
            const handlePreviewWebsitePageChange = vi.fn();
            const websitePages = [
                createMockCrawlResult({ source_url: 'https://example1.com', title: 'Site 1' }),
                createMockCrawlResult({ source_url: 'https://example2.com', title: 'Site 2' }),
            ];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.websiteCrawl} websitePages={websitePages} handlePreviewWebsitePageChange={handlePreviewWebsitePageChange}/>);
            const select = react_1.screen.getByTestId('picker-select');
            react_1.fireEvent.change(select, { target: { value: 'https://example2.com' } });
            expect(handlePreviewWebsitePageChange).toHaveBeenCalled();
        });
        it('should handle online drive file selection change', () => {
            const handlePreviewOnlineDriveFileChange = vi.fn();
            const onlineDriveFiles = [
                createMockOnlineDriveFile({ id: 'drive-1', name: 'file1.docx' }),
                createMockOnlineDriveFile({ id: 'drive-2', name: 'file2.docx' }),
            ];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDrive} onlineDriveFiles={onlineDriveFiles} handlePreviewOnlineDriveFileChange={handlePreviewOnlineDriveFileChange}/>);
            const select = react_1.screen.getByTestId('picker-select');
            react_1.fireEvent.change(select, { target: { value: 'drive-2' } });
            expect(handlePreviewOnlineDriveFileChange).toHaveBeenCalled();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty estimate data', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={undefined}/>);
            expect(react_1.screen.queryByText('Chunk content')).not.toBeInTheDocument();
        });
        it('should handle empty preview array', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
            const estimateData = createMockEstimateData({ preview: [] });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.queryByText('Chunk content')).not.toBeInTheDocument();
        });
        it('should handle empty qa_preview array', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.qa);
            const estimateData = createMockEstimateData({ qa_preview: [] });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.queryByText('Q1')).not.toBeInTheDocument();
        });
        it('should handle empty child_chunks in parent-child mode', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.parentChild);
            const estimateData = createMockEstimateData({
                preview: [{ content: 'Parent', child_chunks: [] }],
            });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            expect(react_1.screen.queryByText('Child')).not.toBeInTheDocument();
        });
        it('should handle badge showing 0 chunks', () => {
            mockDocForm.mockReturnValue(datasets_1.ChunkingMode.text);
            const estimateData = createMockEstimateData({ total_segments: 0 });
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} estimateData={estimateData}/>);
            // Badge with 0
            expect(react_1.screen.getByText(/0/)).toBeInTheDocument();
        });
        it('should handle undefined online document properties', () => {
            const onlineDocuments = [createMockNotionPage({ page_id: '', page_name: '' })];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDocument} onlineDocuments={onlineDocuments}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should handle undefined website page properties', () => {
            const websitePages = [createMockCrawlResult({ source_url: '', title: '' })];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.websiteCrawl} websitePages={websitePages}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
        it('should handle undefined online drive file properties', () => {
            const onlineDriveFiles = [createMockOnlineDriveFile({ id: '', name: '' })];
            (0, react_1.render)(<chunk_preview_1.default {...defaultProps} dataSourceType={pipeline_1.DatasourceType.onlineDrive} onlineDriveFiles={onlineDriveFiles}/>);
            expect(react_1.screen.getByTestId('document-picker')).toBeInTheDocument();
        });
    });
    describe('Component Memoization', () => {
        it('should be exported as a memoized component', () => {
            // ChunkPreview is wrapped with React.memo
            // We verify this by checking the component type
            expect(typeof chunk_preview_1.default).toBe('object');
            expect(chunk_preview_1.default.$$typeof?.toString()).toBe('Symbol(react.memo)');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmstcHJldmlldy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2h1bmstcHJldmlldy5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtEQUFrRTtBQUNsRSwrQkFBOEI7QUFDOUIsZ0RBQWdEO0FBQ2hELGdEQUF1RTtBQUN2RSxtREFBMEM7QUFFMUMsMERBQTBEO0FBRTFELG9FQUFvRTtBQUNwRSxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLG1DQUFtQyxFQUFFLENBQUMsU0FBdUUsRUFBRSxFQUFFO1FBQy9HLE9BQU8sV0FBVyxFQUFFLENBQUE7SUFDdEIsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsdUVBQXVFO0FBQ3ZFLEVBQUUsQ0FBQyxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4RSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUlqQyxFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FDaEM7TUFBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxjQUFjLENBQUMsRUFBRSxJQUFJLENBQ3RFO01BQUEsQ0FBQyxNQUFNLENBQ0wsV0FBVyxDQUFDLGVBQWUsQ0FDM0IsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FDdkIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNkLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMs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QyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUN0RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vdGlvblBhZ2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IENyYXdsUmVzdWx0SXRlbSwgQ3VzdG9tRmlsZSwgRmlsZUluZGV4aW5nRXN0aW1hdGVSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHR5cGUgeyBPbmxpbmVEcml2ZUZpbGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDaHVua2luZ01vZGUgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlLCBPbmxpbmVEcml2ZUZpbGVUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgQ2h1bmtQcmV2aWV3IGZyb20gJy4vY2h1bmstcHJldmlldydcblxuLy8gVXNlcyBnbG9iYWwgcmVhY3QtaTE4bmV4dCBtb2NrIGZyb20gd2ViL3ZpdGVzdC5zZXR1cC50c1xuXG4vLyBNb2NrIGRhdGFzZXQtZGV0YWlsIGNvbnRleHQgLSBuZWVkcyBtb2NrIHRvIGNvbnRyb2wgcmV0dXJuIHZhbHVlc1xuY29uc3QgbW9ja0RvY0Zvcm0gPSB2aS5mbigpXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKF9zZWxlY3RvcjogKHM6IHsgZGF0YXNldDogeyBkb2NfZm9ybTogQ2h1bmtpbmdNb2RlIH0gfSkgPT4gQ2h1bmtpbmdNb2RlKSA9PiB7XG4gICAgcmV0dXJuIG1vY2tEb2NGb3JtKClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGRvY3VtZW50IHBpY2tlciAtIG5lZWRzIG1vY2sgZm9yIHNpbXBsaWZpZWQgaW50ZXJhY3Rpb24gdGVzdGluZ1xudmkubW9jaygnLi4vLi4vLi4vY29tbW9uL2RvY3VtZW50LXBpY2tlci9wcmV2aWV3LWRvY3VtZW50LXBpY2tlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGZpbGVzLCBvbkNoYW5nZSwgdmFsdWUgfToge1xuICAgIGZpbGVzOiBBcnJheTx7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcgfT5cbiAgICBvbkNoYW5nZTogKHNlbGVjdGVkOiB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcgfSkgPT4gdm9pZFxuICAgIHZhbHVlOiB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZXh0ZW5zaW9uOiBzdHJpbmcgfVxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImRvY3VtZW50LXBpY2tlclwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJwaWNrZXItdmFsdWVcIj57dmFsdWU/Lm5hbWUgfHwgJ05vIHNlbGVjdGlvbid9PC9zcGFuPlxuICAgICAgPHNlbGVjdFxuICAgICAgICBkYXRhLXRlc3RpZD1cInBpY2tlci1zZWxlY3RcIlxuICAgICAgICB2YWx1ZT17dmFsdWU/LmlkIHx8ICcnfVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IGZpbGVzLmZpbmQoZiA9PiBmLmlkID09PSBlLnRhcmdldC52YWx1ZSlcbiAgICAgICAgICBpZiAoc2VsZWN0ZWQpXG4gICAgICAgICAgICBvbkNoYW5nZShzZWxlY3RlZClcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge2ZpbGVzLm1hcChmID0+IChcbiAgICAgICAgICA8b3B0aW9uIGtleT17Zi5pZH0gdmFsdWU9e2YuaWR9PntmLm5hbWV9PC9vcHRpb24+XG4gICAgICAgICkpfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gVGVzdCBkYXRhIGZhY3Rvcmllc1xuY29uc3QgY3JlYXRlTW9ja0xvY2FsRmlsZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEN1c3RvbUZpbGU+KTogQ3VzdG9tRmlsZSA9PiAoe1xuICBpZDogJ2ZpbGUtMScsXG4gIG5hbWU6ICd0ZXN0LWZpbGUucGRmJyxcbiAgc2l6ZTogMTAyNCxcbiAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gIGV4dGVuc2lvbjogJ3BkZicsXG4gIGxhc3RNb2RpZmllZDogRGF0ZS5ub3coKSxcbiAgd2Via2l0UmVsYXRpdmVQYXRoOiAnJyxcbiAgYXJyYXlCdWZmZXI6IHZpLmZuKCkgYXMgKCkgPT4gUHJvbWlzZTxBcnJheUJ1ZmZlcj4sXG4gIGJ5dGVzOiB2aS5mbigpIGFzICgpID0+IFByb21pc2U8VWludDhBcnJheT4sXG4gIHNsaWNlOiB2aS5mbigpIGFzIChzdGFydD86IG51bWJlciwgZW5kPzogbnVtYmVyLCBjb250ZW50VHlwZT86IHN0cmluZykgPT4gQmxvYixcbiAgc3RyZWFtOiB2aS5mbigpIGFzICgpID0+IFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+LFxuICB0ZXh0OiB2aS5mbigpIGFzICgpID0+IFByb21pc2U8c3RyaW5nPixcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBDdXN0b21GaWxlKVxuXG5jb25zdCBjcmVhdGVNb2NrTm90aW9uUGFnZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPE5vdGlvblBhZ2U+KTogTm90aW9uUGFnZSA9PiAoe1xuICBwYWdlX2lkOiAncGFnZS0xJyxcbiAgcGFnZV9uYW1lOiAnVGVzdCBQYWdlJyxcbiAgd29ya3NwYWNlX2lkOiAnd29ya3NwYWNlLTEnLFxuICB0eXBlOiAncGFnZScsXG4gIHBhZ2VfaWNvbjogbnVsbCxcbiAgcGFyZW50X2lkOiAncGFyZW50LTEnLFxuICBpc19ib3VuZDogdHJ1ZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0NyYXdsUmVzdWx0ID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtPik6IENyYXdsUmVzdWx0SXRlbSA9PiAoe1xuICB0aXRsZTogJ1Rlc3QgV2Vic2l0ZScsXG4gIG1hcmtkb3duOiAnVGVzdCBjb250ZW50JyxcbiAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2NyaXB0aW9uJyxcbiAgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8T25saW5lRHJpdmVGaWxlPik6IE9ubGluZURyaXZlRmlsZSA9PiAoe1xuICBpZDogJ2RyaXZlLWZpbGUtMScsXG4gIG5hbWU6ICd0ZXN0LWRyaXZlLWZpbGUuZG9jeCcsXG4gIHNpemU6IDIwNDgsXG4gIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0VzdGltYXRlRGF0YSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEZpbGVJbmRleGluZ0VzdGltYXRlUmVzcG9uc2U+KTogRmlsZUluZGV4aW5nRXN0aW1hdGVSZXNwb25zZSA9PiAoe1xuICB0b3RhbF9ub2RlczogNSxcbiAgdG9rZW5zOiAxMDAwLFxuICB0b3RhbF9wcmljZTogMC4wMSxcbiAgY3VycmVuY3k6ICdVU0QnLFxuICB0b3RhbF9zZWdtZW50czogMTAsXG4gIHByZXZpZXc6IFtcbiAgICB7IGNvbnRlbnQ6ICdDaHVuayBjb250ZW50IDEnLCBjaGlsZF9jaHVua3M6IFsnY2hpbGQgMScsICdjaGlsZCAyJ10gfSxcbiAgICB7IGNvbnRlbnQ6ICdDaHVuayBjb250ZW50IDInLCBjaGlsZF9jaHVua3M6IFsnY2hpbGQgMyddIH0sXG4gIF0sXG4gIHFhX3ByZXZpZXc6IFtcbiAgICB7IHF1ZXN0aW9uOiAnUTEnLCBhbnN3ZXI6ICdBMScgfSxcbiAgICB7IHF1ZXN0aW9uOiAnUTInLCBhbnN3ZXI6ICdBMicgfSxcbiAgXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBkYXRhU291cmNlVHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICBsb2NhbEZpbGVzOiBbY3JlYXRlTW9ja0xvY2FsRmlsZSgpXSxcbiAgb25saW5lRG9jdW1lbnRzOiBbY3JlYXRlTW9ja05vdGlvblBhZ2UoKV0sXG4gIHdlYnNpdGVQYWdlczogW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdCgpXSxcbiAgb25saW5lRHJpdmVGaWxlczogW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoKV0sXG4gIGlzSWRsZTogZmFsc2UsXG4gIGlzUGVuZGluZzogZmFsc2UsXG4gIGVzdGltYXRlRGF0YTogdW5kZWZpbmVkLFxuICBvblByZXZpZXc6IHZpLmZuKCksXG4gIGhhbmRsZVByZXZpZXdGaWxlQ2hhbmdlOiB2aS5mbigpLFxuICBoYW5kbGVQcmV2aWV3T25saW5lRG9jdW1lbnRDaGFuZ2U6IHZpLmZuKCksXG4gIGhhbmRsZVByZXZpZXdXZWJzaXRlUGFnZUNoYW5nZTogdmkuZm4oKSxcbiAgaGFuZGxlUHJldmlld09ubGluZURyaXZlRmlsZUNoYW5nZTogdmkuZm4oKSxcbn1cblxuZGVzY3JpYmUoJ0NodW5rUHJldmlldycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS50ZXh0KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIGNvbXBvbmVudCB3aXRoIHByZXZpZXcgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIGkxOG4gbW9jayByZXR1cm5zIGtleSBieSBkZWZhdWx0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUd28ucHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvY3VtZW50IHBpY2tlciBmb3IgbG9jYWwgZmlsZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENodW5rUHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZG9jdW1lbnQtcGlja2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG9jdW1lbnQgcGlja2VyIGZvciBvbmxpbmUgZG9jdW1lbnRzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZGF0YVNvdXJjZVR5cGU9e0RhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZG9jdW1lbnQtcGlja2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG9jdW1lbnQgcGlja2VyIGZvciB3ZWJzaXRlIHBhZ2VzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZGF0YVNvdXJjZVR5cGU9e0RhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RvY3VtZW50LXBpY2tlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvY3VtZW50IHBpY2tlciBmb3Igb25saW5lIGRyaXZlIGZpbGVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZGF0YVNvdXJjZVR5cGU9e0RhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZG9jdW1lbnQtcGlja2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYmFkZ2Ugd2l0aCBjaHVuayBjb3VudCBmb3Igbm9uLVFBIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc3RpbWF0ZURhdGEgPSBjcmVhdGVNb2NrRXN0aW1hdGVEYXRhKHsgdG90YWxfc2VnbWVudHM6IDE1IH0pXG4gICAgICBtb2NrRG9jRm9ybS5tb2NrUmV0dXJuVmFsdWUoQ2h1bmtpbmdNb2RlLnRleHQpXG5cbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVzdGltYXRlRGF0YT17ZXN0aW1hdGVEYXRhfSAvPilcblxuICAgICAgLy8gQmFkZ2Ugc2hvd3MgY2h1bmsgY291bnQgdmlhIGkxOG4ga2V5IHdpdGggY291bnQgb3B0aW9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcHJldmlld0NodW5rQ291bnQuKjE1LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGJhZGdlIGZvciBRQSBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS5xYSlcbiAgICAgIGNvbnN0IGVzdGltYXRlRGF0YSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZURhdGEoKVxuXG4gICAgICByZW5kZXIoPENodW5rUHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlc3RpbWF0ZURhdGE9e2VzdGltYXRlRGF0YX0gLz4pXG5cbiAgICAgIC8vIE5vIGJhZGdlIHdpdGggdG90YWxfc2VnbWVudHNcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoLzEwLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnSWRsZSBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpZGxlIHN0YXRlIHdpdGggcHJldmlldyB0aXAgYW5kIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzSWRsZT17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIGkxOG4gbW9jayByZXR1cm5zIGtleXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFR3by5wcmV2aWV3Q2h1bmtUaXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUHJldmlldyB3aGVuIHByZXZpZXcgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzSWRsZT17dHJ1ZX0gb25QcmV2aWV3PXtvblByZXZpZXd9IC8+KVxuXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wcmV2aWV3Q2h1bmtzL2kgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICBleHBlY3Qob25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNrZWxldG9uIGxvYWRpbmcgd2hlbiBpc1BlbmRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUGVuZGluZz17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIFNrZWxldG9uIGxvYWRpbmcgcmVuZGVycyBtdWx0aXBsZSBza2VsZXRvbiBjb250YWluZXJzXG4gICAgICBleHBlY3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNwYWNlLXktNicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBwcmV2aWV3IGNvbnRlbnQgd2hlbiBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXN0aW1hdGVEYXRhID0gY3JlYXRlTW9ja0VzdGltYXRlRGF0YSgpXG5cbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGlzUGVuZGluZz17dHJ1ZX0gZXN0aW1hdGVEYXRhPXtlc3RpbWF0ZURhdGF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdDaHVuayBjb250ZW50IDEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdRQSBNb2RlIFByZXZpZXcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUUEgcHJldmlldyBjaHVua3Mgd2hlbiBkb2NfZm9ybSBpcyBxYScsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLm1vY2tSZXR1cm5WYWx1ZShDaHVua2luZ01vZGUucWEpXG4gICAgICBjb25zdCBlc3RpbWF0ZURhdGEgPSBjcmVhdGVNb2NrRXN0aW1hdGVEYXRhKHtcbiAgICAgICAgcWFfcHJldmlldzogW1xuICAgICAgICAgIHsgcXVlc3Rpb246ICdRdWVzdGlvbiAxPycsIGFuc3dlcjogJ0Fuc3dlciAxJyB9LFxuICAgICAgICAgIHsgcXVlc3Rpb246ICdRdWVzdGlvbiAyPycsIGFuc3dlcjogJ0Fuc3dlciAyJyB9LFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXN0aW1hdGVEYXRhPXtlc3RpbWF0ZURhdGF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUXVlc3Rpb24gMT8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0Fuc3dlciAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdRdWVzdGlvbiAyPycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQW5zd2VyIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RleHQgTW9kZSBQcmV2aWV3JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRleHQgcHJldmlldyBjaHVua3Mgd2hlbiBkb2NfZm9ybSBpcyB0ZXh0JywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS50ZXh0KVxuICAgICAgY29uc3QgZXN0aW1hdGVEYXRhID0gY3JlYXRlTW9ja0VzdGltYXRlRGF0YSh7XG4gICAgICAgIHByZXZpZXc6IFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdUZXh0IGNodW5rIDEnLCBjaGlsZF9jaHVua3M6IFtdIH0sXG4gICAgICAgICAgeyBjb250ZW50OiAnVGV4dCBjaHVuayAyJywgY2hpbGRfY2h1bmtzOiBbXSB9LFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXN0aW1hdGVEYXRhPXtlc3RpbWF0ZURhdGF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBjaHVuayAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXh0IGNodW5rIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1BhcmVudC1DaGlsZCBNb2RlIFByZXZpZXcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFyZW50LWNoaWxkIHByZXZpZXcgY2h1bmtzJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS5wYXJlbnRDaGlsZClcbiAgICAgIGNvbnN0IGVzdGltYXRlRGF0YSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZURhdGEoe1xuICAgICAgICBwcmV2aWV3OiBbXG4gICAgICAgICAgeyBjb250ZW50OiAnUGFyZW50IGNodW5rIDEnLCBjaGlsZF9jaHVua3M6IFsnQ2hpbGQgMScsICdDaGlsZCAyJ10gfSxcbiAgICAgICAgXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVzdGltYXRlRGF0YT17ZXN0aW1hdGVEYXRhfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaWxkIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaWxkIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RvY3VtZW50IFNlbGVjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsb2NhbCBmaWxlIHNlbGVjdGlvbiBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVQcmV2aWV3RmlsZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxvY2FsRmlsZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tMb2NhbEZpbGUoeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaWxlMS5wZGYnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrTG9jYWxGaWxlKHsgaWQ6ICdmaWxlLTInLCBuYW1lOiAnZmlsZTIucGRmJyB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtQcmV2aWV3XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhU291cmNlVHlwZT17RGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlfVxuICAgICAgICAgIGxvY2FsRmlsZXM9e2xvY2FsRmlsZXN9XG4gICAgICAgICAgaGFuZGxlUHJldmlld0ZpbGVDaGFuZ2U9e2hhbmRsZVByZXZpZXdGaWxlQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgc2VsZWN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwaWNrZXItc2VsZWN0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2VsZWN0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2ZpbGUtMicgfSB9KVxuXG4gICAgICBleHBlY3QoaGFuZGxlUHJldmlld0ZpbGVDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvbmxpbmUgZG9jdW1lbnQgc2VsZWN0aW9uIGNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZVByZXZpZXdPbmxpbmVEb2N1bWVudENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9ubGluZURvY3VtZW50cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJywgcGFnZV9uYW1lOiAnUGFnZSAyJyB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtQcmV2aWV3XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhU291cmNlVHlwZT17RGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnR9XG4gICAgICAgICAgb25saW5lRG9jdW1lbnRzPXtvbmxpbmVEb2N1bWVudHN9XG4gICAgICAgICAgaGFuZGxlUHJldmlld09ubGluZURvY3VtZW50Q2hhbmdlPXtoYW5kbGVQcmV2aWV3T25saW5lRG9jdW1lbnRDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BpY2tlci1zZWxlY3QnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzZWxlY3QsIHsgdGFyZ2V0OiB7IHZhbHVlOiAncGFnZS0yJyB9IH0pXG5cbiAgICAgIGV4cGVjdChoYW5kbGVQcmV2aWV3T25saW5lRG9jdW1lbnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB3ZWJzaXRlIHBhZ2Ugc2VsZWN0aW9uIGNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZVByZXZpZXdXZWJzaXRlUGFnZUNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdlYnNpdGVQYWdlcyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NyYXdsUmVzdWx0KHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZTEuY29tJywgdGl0bGU6ICdTaXRlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHQoeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlMi5jb20nLCB0aXRsZTogJ1NpdGUgMicgfSksXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rUHJldmlld1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU9e0RhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bH1cbiAgICAgICAgICB3ZWJzaXRlUGFnZXM9e3dlYnNpdGVQYWdlc31cbiAgICAgICAgICBoYW5kbGVQcmV2aWV3V2Vic2l0ZVBhZ2VDaGFuZ2U9e2hhbmRsZVByZXZpZXdXZWJzaXRlUGFnZUNoYW5nZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNlbGVjdCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncGlja2VyLXNlbGVjdCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNlbGVjdCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2V4YW1wbGUyLmNvbScgfSB9KVxuXG4gICAgICBleHBlY3QoaGFuZGxlUHJldmlld1dlYnNpdGVQYWdlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25saW5lIGRyaXZlIGZpbGUgc2VsZWN0aW9uIGNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGhhbmRsZVByZXZpZXdPbmxpbmVEcml2ZUZpbGVDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbmxpbmVEcml2ZUZpbGVzID0gW1xuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdkcml2ZS0xJywgbmFtZTogJ2ZpbGUxLmRvY3gnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICdkcml2ZS0yJywgbmFtZTogJ2ZpbGUyLmRvY3gnIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua1ByZXZpZXdcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlPXtEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZX1cbiAgICAgICAgICBvbmxpbmVEcml2ZUZpbGVzPXtvbmxpbmVEcml2ZUZpbGVzfVxuICAgICAgICAgIGhhbmRsZVByZXZpZXdPbmxpbmVEcml2ZUZpbGVDaGFuZ2U9e2hhbmRsZVByZXZpZXdPbmxpbmVEcml2ZUZpbGVDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBzZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BpY2tlci1zZWxlY3QnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzZWxlY3QsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnZHJpdmUtMicgfSB9KVxuXG4gICAgICBleHBlY3QoaGFuZGxlUHJldmlld09ubGluZURyaXZlRmlsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBlc3RpbWF0ZSBkYXRhJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS50ZXh0KVxuXG4gICAgICByZW5kZXIoPENodW5rUHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlc3RpbWF0ZURhdGE9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NodW5rIGNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJldmlldyBhcnJheScsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLm1vY2tSZXR1cm5WYWx1ZShDaHVua2luZ01vZGUudGV4dClcbiAgICAgIGNvbnN0IGVzdGltYXRlRGF0YSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZURhdGEoeyBwcmV2aWV3OiBbXSB9KVxuXG4gICAgICByZW5kZXIoPENodW5rUHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSBlc3RpbWF0ZURhdGE9e2VzdGltYXRlRGF0YX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NodW5rIGNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcWFfcHJldmlldyBhcnJheScsICgpID0+IHtcbiAgICAgIG1vY2tEb2NGb3JtLm1vY2tSZXR1cm5WYWx1ZShDaHVua2luZ01vZGUucWEpXG4gICAgICBjb25zdCBlc3RpbWF0ZURhdGEgPSBjcmVhdGVNb2NrRXN0aW1hdGVEYXRhKHsgcWFfcHJldmlldzogW10gfSlcblxuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXN0aW1hdGVEYXRhPXtlc3RpbWF0ZURhdGF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdRMScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjaGlsZF9jaHVua3MgaW4gcGFyZW50LWNoaWxkIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jRm9ybS5tb2NrUmV0dXJuVmFsdWUoQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkKVxuICAgICAgY29uc3QgZXN0aW1hdGVEYXRhID0gY3JlYXRlTW9ja0VzdGltYXRlRGF0YSh7XG4gICAgICAgIHByZXZpZXc6IFt7IGNvbnRlbnQ6ICdQYXJlbnQnLCBjaGlsZF9jaHVua3M6IFtdIH1dLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDaHVua1ByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gZXN0aW1hdGVEYXRhPXtlc3RpbWF0ZURhdGF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdDaGlsZCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBiYWRnZSBzaG93aW5nIDAgY2h1bmtzJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY0Zvcm0ubW9ja1JldHVyblZhbHVlKENodW5raW5nTW9kZS50ZXh0KVxuICAgICAgY29uc3QgZXN0aW1hdGVEYXRhID0gY3JlYXRlTW9ja0VzdGltYXRlRGF0YSh7IHRvdGFsX3NlZ21lbnRzOiAwIH0pXG5cbiAgICAgIHJlbmRlcig8Q2h1bmtQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IGVzdGltYXRlRGF0YT17ZXN0aW1hdGVEYXRhfSAvPilcblxuICAgICAgLy8gQmFkZ2Ugd2l0aCAwXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvbmxpbmUgZG9jdW1lbnQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9ubGluZURvY3VtZW50cyA9IFtjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfaWQ6ICcnLCBwYWdlX25hbWU6ICcnIH0pXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua1ByZXZpZXdcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlPXtEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudH1cbiAgICAgICAgICBvbmxpbmVEb2N1bWVudHM9e29ubGluZURvY3VtZW50c31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RvY3VtZW50LXBpY2tlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB3ZWJzaXRlIHBhZ2UgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHdlYnNpdGVQYWdlcyA9IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHQoeyBzb3VyY2VfdXJsOiAnJywgdGl0bGU6ICcnIH0pXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua1ByZXZpZXdcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlPXtEYXRhc291cmNlVHlwZS53ZWJzaXRlQ3Jhd2x9XG4gICAgICAgICAgd2Vic2l0ZVBhZ2VzPXt3ZWJzaXRlUGFnZXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb2N1bWVudC1waWNrZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgb25saW5lIGRyaXZlIGZpbGUgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9ubGluZURyaXZlRmlsZXMgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnJywgbmFtZTogJycgfSldXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rUHJldmlld1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU9e0RhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlfVxuICAgICAgICAgIG9ubGluZURyaXZlRmlsZXM9e29ubGluZURyaXZlRmlsZXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb2N1bWVudC1waWNrZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIGV4cG9ydGVkIGFzIGEgbWVtb2l6ZWQgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQ2h1bmtQcmV2aWV3IGlzIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vXG4gICAgICAvLyBXZSB2ZXJpZnkgdGhpcyBieSBjaGVja2luZyB0aGUgY29tcG9uZW50IHR5cGVcbiAgICAgIGV4cGVjdCh0eXBlb2YgQ2h1bmtQcmV2aWV3KS50b0JlKCdvYmplY3QnKVxuICAgICAgZXhwZWN0KENodW5rUHJldmlldy4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9CZSgnU3ltYm9sKHJlYWN0Lm1lbW8pJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==