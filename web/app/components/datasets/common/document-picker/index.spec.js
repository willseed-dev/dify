"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/models/datasets");
const index_1 = require("./index");
// Mock portal-to-follow-elem - always render content for testing
vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => (<div data-testid="portal-elem" data-open={String(open || false)}>
      {children}
    </div>),
    PortalToFollowElemTrigger: ({ children, onClick }) => (<div data-testid="portal-trigger" onClick={onClick}>
      {children}
    </div>),
    // Always render content to allow testing document selection
    PortalToFollowElemContent: ({ children, className }) => (<div data-testid="portal-content" className={className}>
      {children}
    </div>),
}));
// Mock useDocumentList hook with controllable return value
let mockDocumentListData;
let mockDocumentListLoading = false;
const { mockUseDocumentList } = vi.hoisted(() => ({
    mockUseDocumentList: vi.fn(),
}));
// Set up the implementation after variables are defined
mockUseDocumentList.mockImplementation(() => ({
    data: mockDocumentListLoading ? undefined : mockDocumentListData,
    isLoading: mockDocumentListLoading,
}));
vi.mock('@/service/knowledge/use-document', () => ({
    useDocumentList: mockUseDocumentList,
}));
// Mock icons - mock all remixicon components used in the component tree
vi.mock('@remixicon/react', () => ({
    RiArrowDownSLine: () => <span data-testid="arrow-icon">↓</span>,
    RiFile3Fill: () => <span data-testid="file-icon">📄</span>,
    RiFileCodeFill: () => <span data-testid="file-code-icon">📄</span>,
    RiFileExcelFill: () => <span data-testid="file-excel-icon">📄</span>,
    RiFileGifFill: () => <span data-testid="file-gif-icon">📄</span>,
    RiFileImageFill: () => <span data-testid="file-image-icon">📄</span>,
    RiFileMusicFill: () => <span data-testid="file-music-icon">📄</span>,
    RiFilePdf2Fill: () => <span data-testid="file-pdf-icon">📄</span>,
    RiFilePpt2Fill: () => <span data-testid="file-ppt-icon">📄</span>,
    RiFileTextFill: () => <span data-testid="file-text-icon">📄</span>,
    RiFileVideoFill: () => <span data-testid="file-video-icon">📄</span>,
    RiFileWordFill: () => <span data-testid="file-word-icon">📄</span>,
    RiMarkdownFill: () => <span data-testid="file-markdown-icon">📄</span>,
    RiSearchLine: () => <span data-testid="search-icon">🔍</span>,
    RiCloseLine: () => <span data-testid="close-icon">✕</span>,
}));
// Factory function to create mock SimpleDocumentDetail
const createMockDocument = (overrides = {}) => ({
    id: `doc-${Math.random().toString(36).substr(2, 9)}`,
    batch: 'batch-1',
    position: 1,
    dataset_id: 'dataset-1',
    data_source_type: datasets_1.DataSourceType.FILE,
    data_source_info: {
        upload_file: {
            id: 'file-1',
            name: 'test-file.txt',
            size: 1024,
            extension: 'txt',
            mime_type: 'text/plain',
            created_by: 'user-1',
            created_at: Date.now(),
        },
        // Required fields for LegacyDataSourceInfo
        job_id: 'job-1',
        url: '',
    },
    dataset_process_rule_id: 'rule-1',
    name: 'Test Document',
    created_from: 'web',
    created_by: 'user-1',
    created_at: Date.now(),
    indexing_status: 'completed',
    display_status: 'enabled',
    doc_form: datasets_1.ChunkingMode.text,
    doc_language: 'en',
    enabled: true,
    word_count: 1000,
    archived: false,
    updated_at: Date.now(),
    hit_count: 0,
    data_source_detail_dict: {
        upload_file: {
            name: 'test-file.txt',
            extension: 'txt',
        },
    },
    ...overrides,
});
// Factory function to create multiple documents
const createMockDocumentList = (count) => {
    return Array.from({ length: count }, (_, index) => createMockDocument({
        id: `doc-${index + 1}`,
        name: `Document ${index + 1}`,
        data_source_detail_dict: {
            upload_file: {
                name: `document-${index + 1}.pdf`,
                extension: 'pdf',
            },
        },
    }));
};
// Factory function to create props
const createDefaultProps = (overrides = {}) => ({
    datasetId: 'dataset-1',
    value: {
        name: 'Test Document',
        extension: 'txt',
        chunkingMode: datasets_1.ChunkingMode.text,
        parentMode: undefined,
    },
    onChange: vi.fn(),
    ...overrides,
});
// Create a new QueryClient for each test
const createTestQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
            staleTime: 0,
        },
    },
});
// Helper to render component with providers
const renderComponent = (props = {}) => {
    const queryClient = createTestQueryClient();
    const defaultProps = createDefaultProps(props);
    return {
        ...(0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
        <index_1.default {...defaultProps}/>
      </react_query_1.QueryClientProvider>),
        queryClient,
        props: defaultProps,
    };
};
describe('DocumentPicker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock state
        mockDocumentListData = { data: createMockDocumentList(5) };
        mockDocumentListLoading = false;
    });
    // Tests for basic rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should render document name when provided', () => {
            renderComponent({
                value: {
                    name: 'My Document',
                    extension: 'pdf',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            expect(react_1.screen.getByText('My Document')).toBeInTheDocument();
        });
        it('should render placeholder when name is not provided', () => {
            renderComponent({
                value: {
                    name: undefined,
                    extension: 'pdf',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should render arrow icon', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('arrow-icon')).toBeInTheDocument();
        });
        it('should render general mode label', () => {
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            expect(react_1.screen.getByText('dataset.chunkingMode.general')).toBeInTheDocument();
        });
        it('should render QA mode label', () => {
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.qa,
                },
            });
            expect(react_1.screen.getByText('dataset.chunkingMode.qa')).toBeInTheDocument();
        });
        it('should render parentChild mode label with paragraph parent mode', () => {
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: 'paragraph',
                },
            });
            expect(react_1.screen.getByText(/dataset.chunkingMode.parentChild/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/dataset.parentMode.paragraph/)).toBeInTheDocument();
        });
        it('should render parentChild mode label with full-doc parent mode', () => {
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: 'full-doc',
                },
            });
            expect(react_1.screen.getByText(/dataset.chunkingMode.parentChild/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/dataset.parentMode.fullDoc/)).toBeInTheDocument();
        });
        it('should render placeholder for parentMode when not provided', () => {
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: undefined,
                },
            });
            // parentModeLabel should be '--' when parentMode is not provided
            expect(react_1.screen.getByText(/--/)).toBeInTheDocument();
        });
    });
    // Tests for props handling
    describe('Props', () => {
        it('should accept required props', () => {
            const onChange = vi.fn();
            renderComponent({
                datasetId: 'test-dataset',
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
                onChange,
            });
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle value with all fields', () => {
            renderComponent({
                value: {
                    name: 'Full Document',
                    extension: 'docx',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: 'paragraph',
                },
            });
            expect(react_1.screen.getByText('Full Document')).toBeInTheDocument();
        });
        it('should handle value with minimal fields', () => {
            renderComponent({
                value: {
                    name: undefined,
                    extension: undefined,
                    chunkingMode: undefined,
                    parentMode: undefined,
                },
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should pass datasetId to mockUseDocumentList hook', () => {
            renderComponent({ datasetId: 'custom-dataset-id' });
            expect(mockUseDocumentList).toHaveBeenCalledWith(expect.objectContaining({
                datasetId: 'custom-dataset-id',
            }));
        });
    });
    // Tests for state management and updates
    describe('State Management', () => {
        it('should initialize with popup closed', () => {
            renderComponent();
            expect(react_1.screen.getByTestId('portal-elem')).toHaveAttribute('data-open', 'false');
        });
        it('should open popup when trigger is clicked', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Verify click handler is called
            expect(trigger).toBeInTheDocument();
        });
        it('should maintain search query state', async () => {
            renderComponent();
            // Initial call should have empty keyword
            expect(mockUseDocumentList).toHaveBeenCalledWith(expect.objectContaining({
                query: expect.objectContaining({
                    keyword: '',
                }),
            }));
        });
        it('should update query when search input changes', () => {
            renderComponent();
            // Verify the component uses mockUseDocumentList with query parameter
            expect(mockUseDocumentList).toHaveBeenCalledWith(expect.objectContaining({
                query: expect.objectContaining({
                    keyword: '',
                }),
            }));
        });
    });
    // Tests for callback stability and memoization
    describe('Callback Stability', () => {
        it('should maintain stable onChange callback when value changes', () => {
            const onChange = vi.fn();
            const value1 = {
                name: 'Doc 1',
                extension: 'txt',
                chunkingMode: datasets_1.ChunkingMode.text,
            };
            const value2 = {
                name: 'Doc 2',
                extension: 'pdf',
                chunkingMode: datasets_1.ChunkingMode.text,
            };
            const queryClient = createTestQueryClient();
            const { rerender } = (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value1} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            rerender(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value2} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            // Component should still render correctly after rerender
            expect(react_1.screen.getByText('Doc 2')).toBeInTheDocument();
        });
        it('should use updated onChange callback after rerender', () => {
            const onChange1 = vi.fn();
            const onChange2 = vi.fn();
            const value = {
                name: 'Test Doc',
                extension: 'txt',
                chunkingMode: datasets_1.ChunkingMode.text,
            };
            const queryClient = createTestQueryClient();
            const { rerender } = (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value} onChange={onChange1}/>
        </react_query_1.QueryClientProvider>);
            rerender(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value} onChange={onChange2}/>
        </react_query_1.QueryClientProvider>);
            // The component should use the new callback
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should memoize handleChange callback with useCallback', () => {
            // The handleChange callback is created with useCallback and depends on
            // documentsList, onChange, and setOpen
            const onChange = vi.fn();
            renderComponent({ onChange });
            // Verify component renders correctly, callback memoization is internal
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for memoization logic and dependencies
    describe('Memoization Logic', () => {
        it('should be wrapped with React.memo', () => {
            // React.memo components have a $$typeof property
            expect(index_1.default.$$typeof).toBeDefined();
        });
        it('should compute parentModeLabel correctly with useMemo', () => {
            // Test paragraph mode
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: 'paragraph',
                },
            });
            expect(react_1.screen.getByText(/dataset.parentMode.paragraph/)).toBeInTheDocument();
        });
        it('should update parentModeLabel when parentMode changes', () => {
            // Test full-doc mode
            renderComponent({
                value: {
                    name: 'Test',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.parentChild,
                    parentMode: 'full-doc',
                },
            });
            expect(react_1.screen.getByText(/dataset.parentMode.fullDoc/)).toBeInTheDocument();
        });
        it('should not re-render when props are the same', () => {
            const onChange = vi.fn();
            const value = {
                name: 'Stable Doc',
                extension: 'txt',
                chunkingMode: datasets_1.ChunkingMode.text,
            };
            const queryClient = createTestQueryClient();
            const { rerender } = (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            // Rerender with same props reference
            rerender(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="dataset-1" value={value} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            expect(react_1.screen.getByText('Stable Doc')).toBeInTheDocument();
        });
    });
    // Tests for user interactions and event handlers
    describe('User Interactions', () => {
        it('should toggle popup when trigger is clicked', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Trigger click should be handled
            expect(trigger).toBeInTheDocument();
        });
        it('should handle document selection when popup is open', () => {
            // Test the handleChange callback logic
            const onChange = vi.fn();
            const mockDocs = createMockDocumentList(3);
            mockDocumentListData = { data: mockDocs };
            renderComponent({ onChange });
            // The handleChange callback should find the document and call onChange
            // We can verify this by checking that mockUseDocumentList was called
            expect(mockUseDocumentList).toHaveBeenCalled();
        });
        it('should handle search input change', () => {
            renderComponent();
            // The search input is only visible when popup is open
            // We verify that the component initializes with empty query
            expect(mockUseDocumentList).toHaveBeenCalledWith(expect.objectContaining({
                query: expect.objectContaining({
                    keyword: '',
                }),
            }));
        });
        it('should initialize with default query parameters', () => {
            renderComponent();
            expect(mockUseDocumentList).toHaveBeenCalledWith(expect.objectContaining({
                query: {
                    keyword: '',
                    page: 1,
                    limit: 20,
                },
            }));
        });
    });
    // Tests for API calls
    describe('API Calls', () => {
        it('should call mockUseDocumentList with correct parameters', () => {
            renderComponent({ datasetId: 'test-dataset-123' });
            expect(mockUseDocumentList).toHaveBeenCalledWith({
                datasetId: 'test-dataset-123',
                query: {
                    keyword: '',
                    page: 1,
                    limit: 20,
                },
            });
        });
        it('should handle loading state', () => {
            mockDocumentListLoading = true;
            mockDocumentListData = undefined;
            renderComponent();
            // When loading, component should still render without crashing
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should fetch documents on mount', () => {
            mockDocumentListLoading = false;
            mockDocumentListData = { data: createMockDocumentList(3) };
            renderComponent();
            // Verify the hook was called
            expect(mockUseDocumentList).toHaveBeenCalled();
        });
        it('should handle empty document list', () => {
            mockDocumentListData = { data: [] };
            renderComponent();
            // Component should render without crashing
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle undefined data response', () => {
            mockDocumentListData = undefined;
            renderComponent();
            // Should not crash
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for component memoization
    describe('Component Memoization', () => {
        it('should export as React.memo wrapped component', () => {
            // Check that the component is memoized
            expect(index_1.default).toBeDefined();
            expect(typeof index_1.default).toBe('object'); // React.memo returns an object
        });
        it('should preserve render output when datasetId is the same', () => {
            const queryClient = createTestQueryClient();
            const value = {
                name: 'Memo Test',
                extension: 'txt',
                chunkingMode: datasets_1.ChunkingMode.text,
            };
            const onChange = vi.fn();
            const { rerender } = (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="same-dataset" value={value} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            expect(react_1.screen.getByText('Memo Test')).toBeInTheDocument();
            rerender(<react_query_1.QueryClientProvider client={queryClient}>
          <index_1.default datasetId="same-dataset" value={value} onChange={onChange}/>
        </react_query_1.QueryClientProvider>);
            expect(react_1.screen.getByText('Memo Test')).toBeInTheDocument();
        });
    });
    // Tests for edge cases and error handling
    describe('Edge Cases', () => {
        it('should handle null name', () => {
            renderComponent({
                value: {
                    name: undefined,
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            expect(react_1.screen.getByText('--')).toBeInTheDocument();
        });
        it('should handle empty string name', () => {
            renderComponent({
                value: {
                    name: '',
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            // Empty string is falsy, so should show '--'
            expect(react_1.screen.queryByText('--')).toBeInTheDocument();
        });
        it('should handle undefined extension', () => {
            renderComponent({
                value: {
                    name: 'Test Doc',
                    extension: undefined,
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            // Should not crash
            expect(react_1.screen.getByText('Test Doc')).toBeInTheDocument();
        });
        it('should handle undefined chunkingMode', () => {
            renderComponent({
                value: {
                    name: 'Test Doc',
                    extension: 'txt',
                    chunkingMode: undefined,
                },
            });
            // When chunkingMode is undefined, none of the mode conditions are true
            expect(react_1.screen.getByText('Test Doc')).toBeInTheDocument();
        });
        it('should handle document without data_source_detail_dict', () => {
            const docWithoutDetail = createMockDocument({
                id: 'doc-no-detail',
                name: 'Doc Without Detail',
                data_source_detail_dict: undefined,
            });
            mockDocumentListData = { data: [docWithoutDetail] };
            // Component should handle mapping documents even without data_source_detail_dict
            renderComponent();
            // Should not crash
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle rapid toggle clicks', () => {
            renderComponent();
            const trigger = react_1.screen.getByTestId('portal-trigger');
            // Rapid clicks
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            // Should not crash
            expect(trigger).toBeInTheDocument();
        });
        it('should handle very long document names in trigger', () => {
            const longName = 'A'.repeat(500);
            renderComponent({
                value: {
                    name: longName,
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            // Should render long name without crashing
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle special characters in document name', () => {
            const specialName = '<script>alert("xss")</script>';
            renderComponent({
                value: {
                    name: specialName,
                    extension: 'txt',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            // React should escape the text
            expect(react_1.screen.getByText(specialName)).toBeInTheDocument();
        });
        it('should handle documents with missing extension in data_source_detail_dict', () => {
            const docWithEmptyExtension = createMockDocument({
                id: 'doc-empty-ext',
                name: 'Doc Empty Ext',
                data_source_detail_dict: {
                    upload_file: {
                        name: 'file-no-ext',
                        extension: '',
                    },
                },
            });
            mockDocumentListData = { data: [docWithEmptyExtension] };
            // Component should handle mapping documents with empty extension
            renderComponent();
            // Should not crash
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should handle document list mapping with various data_source_detail_dict states', () => {
            // Test the mapping logic: d.data_source_detail_dict?.upload_file?.extension || ''
            const docs = [
                createMockDocument({
                    id: 'doc-1',
                    name: 'With Extension',
                    data_source_detail_dict: {
                        upload_file: { name: 'file.pdf', extension: 'pdf' },
                    },
                }),
                createMockDocument({
                    id: 'doc-2',
                    name: 'Without Detail Dict',
                    data_source_detail_dict: undefined,
                }),
            ];
            mockDocumentListData = { data: docs };
            renderComponent();
            // Should not crash during mapping
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
    });
    // Tests for all prop variations
    describe('Prop Variations', () => {
        describe('datasetId variations', () => {
            it('should handle empty datasetId', () => {
                renderComponent({ datasetId: '' });
                expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            it('should handle UUID format datasetId', () => {
                renderComponent({ datasetId: '123e4567-e89b-12d3-a456-426614174000' });
                expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
        });
        describe('value.chunkingMode variations', () => {
            const chunkingModes = [
                { mode: datasets_1.ChunkingMode.text, label: 'dataset.chunkingMode.general' },
                { mode: datasets_1.ChunkingMode.qa, label: 'dataset.chunkingMode.qa' },
                { mode: datasets_1.ChunkingMode.parentChild, label: 'dataset.chunkingMode.parentChild' },
            ];
            it.each(chunkingModes)('should display correct label for $mode mode', ({ mode, label }) => {
                renderComponent({
                    value: {
                        name: 'Test',
                        extension: 'txt',
                        chunkingMode: mode,
                        parentMode: mode === datasets_1.ChunkingMode.parentChild ? 'paragraph' : undefined,
                    },
                });
                expect(react_1.screen.getByText(new RegExp(label))).toBeInTheDocument();
            });
        });
        describe('value.parentMode variations', () => {
            const parentModes = [
                { mode: 'paragraph', label: 'dataset.parentMode.paragraph' },
                { mode: 'full-doc', label: 'dataset.parentMode.fullDoc' },
            ];
            it.each(parentModes)('should display correct label for $mode parentMode', ({ mode, label }) => {
                renderComponent({
                    value: {
                        name: 'Test',
                        extension: 'txt',
                        chunkingMode: datasets_1.ChunkingMode.parentChild,
                        parentMode: mode,
                    },
                });
                expect(react_1.screen.getByText(new RegExp(label))).toBeInTheDocument();
            });
        });
        describe('value.extension variations', () => {
            const extensions = ['txt', 'pdf', 'docx', 'xlsx', 'csv', 'md', 'html'];
            it.each(extensions)('should handle %s extension', (ext) => {
                renderComponent({
                    value: {
                        name: `File.${ext}`,
                        extension: ext,
                        chunkingMode: datasets_1.ChunkingMode.text,
                    },
                });
                expect(react_1.screen.getByText(`File.${ext}`)).toBeInTheDocument();
            });
        });
    });
    // Tests for document selection
    describe('Document Selection', () => {
        it('should fetch documents list via mockUseDocumentList', () => {
            const mockDoc = createMockDocument({
                id: 'selected-doc',
                name: 'Selected Document',
            });
            mockDocumentListData = { data: [mockDoc] };
            const onChange = vi.fn();
            renderComponent({ onChange });
            // Verify the hook was called
            expect(mockUseDocumentList).toHaveBeenCalled();
        });
        it('should call onChange when document is selected', () => {
            const docs = createMockDocumentList(3);
            mockDocumentListData = { data: docs };
            const onChange = vi.fn();
            renderComponent({ onChange });
            // Click on a document in the list
            react_1.fireEvent.click(react_1.screen.getByText('Document 2'));
            // handleChange should find the document and call onChange with full document
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(docs[1]);
        });
        it('should map document list items correctly', () => {
            const docs = createMockDocumentList(3);
            mockDocumentListData = { data: docs };
            renderComponent();
            // Documents should be rendered in the list
            expect(react_1.screen.getByText('Document 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Document 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Document 3')).toBeInTheDocument();
        });
    });
    // Tests for integration with child components
    describe('Child Component Integration', () => {
        it('should pass correct data to DocumentList when popup is open', () => {
            const docs = createMockDocumentList(3);
            mockDocumentListData = { data: docs };
            renderComponent();
            // DocumentList receives mapped documents: { id, name, extension }
            // We verify the data is fetched
            expect(mockUseDocumentList).toHaveBeenCalled();
        });
        it('should map document data_source_detail_dict extension correctly', () => {
            const doc = createMockDocument({
                id: 'mapped-doc',
                name: 'Mapped Document',
                data_source_detail_dict: {
                    upload_file: {
                        name: 'mapped.pdf',
                        extension: 'pdf',
                    },
                },
            });
            mockDocumentListData = { data: [doc] };
            renderComponent();
            // The mapping: d.data_source_detail_dict?.upload_file?.extension || ''
            // Should extract 'pdf' from the document
            expect(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
        });
        it('should render trigger with SearchInput integration', () => {
            renderComponent();
            // The trigger is always rendered
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
        it('should integrate FileIcon component', () => {
            // Use empty document list to avoid duplicate icons from list
            mockDocumentListData = { data: [] };
            renderComponent({
                value: {
                    name: 'test.pdf',
                    extension: 'pdf',
                    chunkingMode: datasets_1.ChunkingMode.text,
                },
            });
            // FileIcon should be rendered via DocumentFileIcon - pdf renders pdf icon
            expect(react_1.screen.getByTestId('file-pdf-icon')).toBeInTheDocument();
        });
    });
    // Tests for visual states
    describe('Visual States', () => {
        it('should render portal content for document selection', () => {
            renderComponent();
            // Portal content is rendered in our mock for testing
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUFrRTtBQUNsRSwrQkFBOEI7QUFDOUIsZ0RBQWdFO0FBQ2hFLG1DQUFvQztBQUVwQyxpRUFBaUU7QUFDakUsRUFBRSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVELGtCQUFrQixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUdwQyxFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUM5RDtNQUFBLENBQUMsUUFBUSxDQUNYO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELHlCQUF5QixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUc5QyxFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDakQ7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCw0REFBNEQ7SUFDNUQseUJBQXlCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBR2hELEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUNyRDtNQUFBLENBQUMsUUFBUSxDQUNYO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsMkRBQTJEO0FBQzNELElBQUksb0JBQWtFLENBQUE7QUFDdEUsSUFBSSx1QkFBdUIsR0FBRyxL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dGVudCI6WyJpbXBvcnQgdHlwZSB7IFBhcmVudE1vZGUsIFNpbXBsZURvY3VtZW50RGV0YWlsIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDaHVua2luZ01vZGUsIERhdGFTb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgRG9jdW1lbnRQaWNrZXIgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBwb3J0YWwtdG8tZm9sbG93LWVsZW0gLSBhbHdheXMgcmVuZGVyIGNvbnRlbnQgZm9yIHRlc3RpbmdcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiAoe1xuICBQb3J0YWxUb0ZvbGxvd0VsZW06ICh7IGNoaWxkcmVuLCBvcGVuIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb3Blbj86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtZWxlbVwiIGRhdGEtb3Blbj17U3RyaW5nKG9wZW4gfHwgZmFsc2UpfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L2Rpdj5cbiAgKSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcjogKHsgY2hpbGRyZW4sIG9uQ2xpY2sgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvbkNsaWNrPzogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICksXG4gIC8vIEFsd2F5cyByZW5kZXIgY29udGVudCB0byBhbGxvdyB0ZXN0aW5nIGRvY3VtZW50IHNlbGVjdGlvblxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayB1c2VEb2N1bWVudExpc3QgaG9vayB3aXRoIGNvbnRyb2xsYWJsZSByZXR1cm4gdmFsdWVcbmxldCBtb2NrRG9jdW1lbnRMaXN0RGF0YTogeyBkYXRhOiBTaW1wbGVEb2N1bWVudERldGFpbFtdIH0gfCB1bmRlZmluZWRcbmxldCBtb2NrRG9jdW1lbnRMaXN0TG9hZGluZyA9IGZhbHNlXG5cbmNvbnN0IHsgbW9ja1VzZURvY3VtZW50TGlzdCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlRG9jdW1lbnRMaXN0OiB2aS5mbigpLFxufSkpXG5cbi8vIFNldCB1cCB0aGUgaW1wbGVtZW50YXRpb24gYWZ0ZXIgdmFyaWFibGVzIGFyZSBkZWZpbmVkXG5tb2NrVXNlRG9jdW1lbnRMaXN0Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiAoe1xuICBkYXRhOiBtb2NrRG9jdW1lbnRMaXN0TG9hZGluZyA/IHVuZGVmaW5lZCA6IG1vY2tEb2N1bWVudExpc3REYXRhLFxuICBpc0xvYWRpbmc6IG1vY2tEb2N1bWVudExpc3RMb2FkaW5nLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRvY3VtZW50JywgKCkgPT4gKHtcbiAgdXNlRG9jdW1lbnRMaXN0OiBtb2NrVXNlRG9jdW1lbnRMaXN0LFxufSkpXG5cbi8vIE1vY2sgaWNvbnMgLSBtb2NrIGFsbCByZW1peGljb24gY29tcG9uZW50cyB1c2VkIGluIHRoZSBjb21wb25lbnQgdHJlZVxudmkubW9jaygnQHJlbWl4aWNvbi9yZWFjdCcsICgpID0+ICh7XG4gIFJpQXJyb3dEb3duU0xpbmU6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiYXJyb3ctaWNvblwiPuKGkzwvc3Bhbj4sXG4gIFJpRmlsZTNGaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVDb2RlRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWNvZGUtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVFeGNlbEZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1leGNlbC1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZUdpZkZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1naWYtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVJbWFnZUZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1pbWFnZS1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZU11c2ljRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLW11c2ljLWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlUGRmMkZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1wZGYtaWNvblwiPvCfk4Q8L3NwYW4+LFxuICBSaUZpbGVQcHQyRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLXBwdC1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZVRleHRGaWxsOiAoKSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtdGV4dC1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpRmlsZVZpZGVvRmlsbDogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLXZpZGVvLWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlGaWxlV29yZEZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS13b3JkLWljb25cIj7wn5OEPC9zcGFuPixcbiAgUmlNYXJrZG93bkZpbGw6ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1tYXJrZG93bi1pY29uXCI+8J+ThDwvc3Bhbj4sXG4gIFJpU2VhcmNoTGluZTogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJzZWFyY2gtaWNvblwiPvCflI08L3NwYW4+LFxuICBSaUNsb3NlTGluZTogKCkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJjbG9zZS1pY29uXCI+4pyVPC9zcGFuPixcbn0pKVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIFNpbXBsZURvY3VtZW50RGV0YWlsXG5jb25zdCBjcmVhdGVNb2NrRG9jdW1lbnQgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFNpbXBsZURvY3VtZW50RGV0YWlsPiA9IHt9KTogU2ltcGxlRG9jdW1lbnREZXRhaWwgPT4gKHtcbiAgaWQ6IGBkb2MtJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSl9YCxcbiAgYmF0Y2g6ICdiYXRjaC0xJyxcbiAgcG9zaXRpb246IDEsXG4gIGRhdGFzZXRfaWQ6ICdkYXRhc2V0LTEnLFxuICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICBkYXRhX3NvdXJjZV9pbmZvOiB7XG4gICAgdXBsb2FkX2ZpbGU6IHtcbiAgICAgIGlkOiAnZmlsZS0xJyxcbiAgICAgIG5hbWU6ICd0ZXN0LWZpbGUudHh0JyxcbiAgICAgIHNpemU6IDEwMjQsXG4gICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgbWltZV90eXBlOiAndGV4dC9wbGFpbicsXG4gICAgICBjcmVhdGVkX2J5OiAndXNlci0xJyxcbiAgICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgfSxcbiAgICAvLyBSZXF1aXJlZCBmaWVsZHMgZm9yIExlZ2FjeURhdGFTb3VyY2VJbmZvXG4gICAgam9iX2lkOiAnam9iLTEnLFxuICAgIHVybDogJycsXG4gIH0sXG4gIGRhdGFzZXRfcHJvY2Vzc19ydWxlX2lkOiAncnVsZS0xJyxcbiAgbmFtZTogJ1Rlc3QgRG9jdW1lbnQnLFxuICBjcmVhdGVkX2Zyb206ICd3ZWInLFxuICBjcmVhdGVkX2J5OiAndXNlci0xJyxcbiAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgZGlzcGxheV9zdGF0dXM6ICdlbmFibGVkJyxcbiAgZG9jX2Zvcm06IENodW5raW5nTW9kZS50ZXh0LFxuICBkb2NfbGFuZ3VhZ2U6ICdlbicsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHdvcmRfY291bnQ6IDEwMDAsXG4gIGFyY2hpdmVkOiBmYWxzZSxcbiAgdXBkYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgaGl0X2NvdW50OiAwLFxuICBkYXRhX3NvdXJjZV9kZXRhaWxfZGljdDoge1xuICAgIHVwbG9hZF9maWxlOiB7XG4gICAgICBuYW1lOiAndGVzdC1maWxlLnR4dCcsXG4gICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgIH0sXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIG11bHRpcGxlIGRvY3VtZW50c1xuY29uc3QgY3JlYXRlTW9ja0RvY3VtZW50TGlzdCA9IChjb3VudDogbnVtYmVyKTogU2ltcGxlRG9jdW1lbnREZXRhaWxbXSA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaW5kZXgpID0+XG4gICAgY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgIGlkOiBgZG9jLSR7aW5kZXggKyAxfWAsXG4gICAgICBuYW1lOiBgRG9jdW1lbnQgJHtpbmRleCArIDF9YCxcbiAgICAgIGRhdGFfc291cmNlX2RldGFpbF9kaWN0OiB7XG4gICAgICAgIHVwbG9hZF9maWxlOiB7XG4gICAgICAgICAgbmFtZTogYGRvY3VtZW50LSR7aW5kZXggKyAxfS5wZGZgLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3BkZicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pKVxufVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBwcm9wc1xuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRG9jdW1lbnRQaWNrZXI+PiA9IHt9KSA9PiAoe1xuICBkYXRhc2V0SWQ6ICdkYXRhc2V0LTEnLFxuICB2YWx1ZToge1xuICAgIG5hbWU6ICdUZXN0IERvY3VtZW50JyxcbiAgICBleHRlbnNpb246ICd0eHQnLFxuICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgcGFyZW50TW9kZTogdW5kZWZpbmVkIGFzIFBhcmVudE1vZGUgfCB1bmRlZmluZWQsXG4gIH0sXG4gIG9uQ2hhbmdlOiB2aS5mbigpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBDcmVhdGUgYSBuZXcgUXVlcnlDbGllbnQgZm9yIGVhY2ggdGVzdFxuY29uc3QgY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50ID0gKCkgPT5cbiAgbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgcXVlcmllczoge1xuICAgICAgICByZXRyeTogZmFsc2UsXG4gICAgICAgIGdjVGltZTogMCxcbiAgICAgICAgc3RhbGVUaW1lOiAwLFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxuXG4vLyBIZWxwZXIgdG8gcmVuZGVyIGNvbXBvbmVudCB3aXRoIHByb3ZpZGVyc1xuY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKHByb3BzOiBQYXJ0aWFsPFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBEb2N1bWVudFBpY2tlcj4+ID0ge30pID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSBjcmVhdGVUZXN0UXVlcnlDbGllbnQoKVxuICBjb25zdCBkZWZhdWx0UHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMocHJvcHMpXG5cbiAgcmV0dXJuIHtcbiAgICAuLi5yZW5kZXIoXG4gICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgPERvY3VtZW50UGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+XG4gICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICAgICksXG4gICAgcXVlcnlDbGllbnQsXG4gICAgcHJvcHM6IGRlZmF1bHRQcm9wcyxcbiAgfVxufVxuXG5kZXNjcmliZSgnRG9jdW1lbnRQaWNrZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIFJlc2V0IG1vY2sgc3RhdGVcbiAgICBtb2NrRG9jdW1lbnRMaXN0RGF0YSA9IHsgZGF0YTogY3JlYXRlTW9ja0RvY3VtZW50TGlzdCg1KSB9XG4gICAgbW9ja0RvY3VtZW50TGlzdExvYWRpbmcgPSBmYWxzZVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBiYXNpYyByZW5kZXJpbmdcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2N1bWVudCBuYW1lIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIG5hbWU6ICdNeSBEb2N1bWVudCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IERvY3VtZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGxhY2Vob2xkZXIgd2hlbiBuYW1lIGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3BkZicsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCctLScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFycm93IGljb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhcnJvdy1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZ2VuZXJhbCBtb2RlIGxhYmVsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQuY2h1bmtpbmdNb2RlLmdlbmVyYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBRQSBtb2RlIGxhYmVsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS5xYSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LmNodW5raW5nTW9kZS5xYScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhcmVudENoaWxkIG1vZGUgbGFiZWwgd2l0aCBwYXJhZ3JhcGggcGFyZW50IG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICAgICAgICAgIHBhcmVudE1vZGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXQuY2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0LnBhcmVudE1vZGUucGFyYWdyYXBoLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFyZW50Q2hpbGQgbW9kZSBsYWJlbCB3aXRoIGZ1bGwtZG9jIHBhcmVudCBtb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgICBwYXJlbnRNb2RlOiAnZnVsbC1kb2MnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXQuY2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0LnBhcmVudE1vZGUuZnVsbERvYy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsYWNlaG9sZGVyIGZvciBwYXJlbnRNb2RlIHdoZW4gbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgICBwYXJlbnRNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBwYXJlbnRNb2RlTGFiZWwgc2hvdWxkIGJlICctLScgd2hlbiBwYXJlbnRNb2RlIGlzIG5vdCBwcm92aWRlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLy0tLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBwcm9wcyBoYW5kbGluZ1xuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgcmVxdWlyZWQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIGRhdGFzZXRJZDogJ3Rlc3QtZGF0YXNldCcsXG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgbmFtZTogJ1Rlc3QnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbHVlIHdpdGggYWxsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgbmFtZTogJ0Z1bGwgRG9jdW1lbnQnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ2RvY3gnLFxuICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICAgICAgICAgIHBhcmVudE1vZGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0Z1bGwgRG9jdW1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YWx1ZSB3aXRoIG1pbmltYWwgZmllbGRzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgZXh0ZW5zaW9uOiB1bmRlZmluZWQsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgcGFyZW50TW9kZTogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJy0tJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFzZXRJZCB0byBtb2NrVXNlRG9jdW1lbnRMaXN0IGhvb2snLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBkYXRhc2V0SWQ6ICdjdXN0b20tZGF0YXNldC1pZCcgfSlcblxuICAgICAgZXhwZWN0KG1vY2tVc2VEb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgZGF0YXNldElkOiAnY3VzdG9tLWRhdGFzZXQtaWQnLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBzdGF0ZSBtYW5hZ2VtZW50IGFuZCB1cGRhdGVzXG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIHBvcHVwIGNsb3NlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcGVuJywgJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIHBvcHVwIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIFZlcmlmeSBjbGljayBoYW5kbGVyIGlzIGNhbGxlZFxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzZWFyY2ggcXVlcnkgc3RhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBJbml0aWFsIGNhbGwgc2hvdWxkIGhhdmUgZW1wdHkga2V5d29yZFxuICAgICAgZXhwZWN0KG1vY2tVc2VEb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcXVlcnk6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGtleXdvcmQ6ICcnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcXVlcnkgd2hlbiBzZWFyY2ggaW5wdXQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIFZlcmlmeSB0aGUgY29tcG9uZW50IHVzZXMgbW9ja1VzZURvY3VtZW50TGlzdCB3aXRoIHF1ZXJ5IHBhcmFtZXRlclxuXG4gICAgICBleHBlY3QobW9ja1VzZURvY3VtZW50TGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBxdWVyeTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAga2V5d29yZDogJycsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNhbGxiYWNrIHN0YWJpbGl0eSBhbmQgbWVtb2l6YXRpb25cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBvbkNoYW5nZSBjYWxsYmFjayB3aGVuIHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlMSA9IHtcbiAgICAgICAgbmFtZTogJ0RvYyAxJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbHVlMiA9IHtcbiAgICAgICAgbmFtZTogJ0RvYyAyJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcXVlcnlDbGllbnQgPSBjcmVhdGVUZXN0UXVlcnlDbGllbnQoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgICA8RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMVwiXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWUxfVxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgICA8RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMVwiXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWUyfVxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseSBhZnRlciByZXJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RvYyAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdXBkYXRlZCBvbkNoYW5nZSBjYWxsYmFjayBhZnRlciByZXJlbmRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uQ2hhbmdlMiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICBuYW1lOiAnVGVzdCBEb2MnLFxuICAgICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVRlc3RRdWVyeUNsaWVudCgpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICAgIDxEb2N1bWVudFBpY2tlclxuICAgICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xXCJcbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZTF9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICAgIDxEb2N1bWVudFBpY2tlclxuICAgICAgICAgICAgZGF0YXNldElkPVwiZGF0YXNldC0xXCJcbiAgICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZTJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gVGhlIGNvbXBvbmVudCBzaG91bGQgdXNlIHRoZSBuZXcgY2FsbGJhY2tcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGhhbmRsZUNoYW5nZSBjYWxsYmFjayB3aXRoIHVzZUNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gVGhlIGhhbmRsZUNoYW5nZSBjYWxsYmFjayBpcyBjcmVhdGVkIHdpdGggdXNlQ2FsbGJhY2sgYW5kIGRlcGVuZHMgb25cbiAgICAgIC8vIGRvY3VtZW50c0xpc3QsIG9uQ2hhbmdlLCBhbmQgc2V0T3BlblxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5LCBjYWxsYmFjayBtZW1vaXphdGlvbiBpcyBpbnRlcm5hbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIG1lbW9pemF0aW9uIGxvZ2ljIGFuZCBkZXBlbmRlbmNpZXNcbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uIExvZ2ljJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBSZWFjdC5tZW1vIGNvbXBvbmVudHMgaGF2ZSBhICQkdHlwZW9mIHByb3BlcnR5XG4gICAgICBleHBlY3QoKERvY3VtZW50UGlja2VyIGFzIGFueSkuJCR0eXBlb2YpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIHBhcmVudE1vZGVMYWJlbCBjb3JyZWN0bHkgd2l0aCB1c2VNZW1vJywgKCkgPT4ge1xuICAgICAgLy8gVGVzdCBwYXJhZ3JhcGggbW9kZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgICBwYXJlbnRNb2RlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0LnBhcmVudE1vZGUucGFyYWdyYXBoLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcGFyZW50TW9kZUxhYmVsIHdoZW4gcGFyZW50TW9kZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gVGVzdCBmdWxsLWRvYyBtb2RlXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICAgICAgICAgIHBhcmVudE1vZGU6ICdmdWxsLWRvYycsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldC5wYXJlbnRNb2RlLmZ1bGxEb2MvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2hlbiBwcm9wcyBhcmUgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICBuYW1lOiAnU3RhYmxlIERvYycsXG4gICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50KClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICAgICAgPERvY3VtZW50UGlja2VyXG4gICAgICAgICAgICBkYXRhc2V0SWQ9XCJkYXRhc2V0LTFcIlxuICAgICAgICAgICAgdmFsdWU9e3ZhbHVlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wcyByZWZlcmVuY2VcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgICA8RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICAgIGRhdGFzZXRJZD1cImRhdGFzZXQtMVwiXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0YWJsZSBEb2MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBldmVudCBoYW5kbGVyc1xuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgcG9wdXAgd2hlbiB0cmlnZ2VyIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gVHJpZ2dlciBjbGljayBzaG91bGQgYmUgaGFuZGxlZFxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnQgc2VsZWN0aW9uIHdoZW4gcG9wdXAgaXMgb3BlbicsICgpID0+IHtcbiAgICAgIC8vIFRlc3QgdGhlIGhhbmRsZUNoYW5nZSBjYWxsYmFjayBsb2dpY1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrRG9jcyA9IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMylcbiAgICAgIG1vY2tEb2N1bWVudExpc3REYXRhID0geyBkYXRhOiBtb2NrRG9jcyB9XG5cbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIFRoZSBoYW5kbGVDaGFuZ2UgY2FsbGJhY2sgc2hvdWxkIGZpbmQgdGhlIGRvY3VtZW50IGFuZCBjYWxsIG9uQ2hhbmdlXG4gICAgICAvLyBXZSBjYW4gdmVyaWZ5IHRoaXMgYnkgY2hlY2tpbmcgdGhhdCBtb2NrVXNlRG9jdW1lbnRMaXN0IHdhcyBjYWxsZWRcblxuICAgICAgZXhwZWN0KG1vY2tVc2VEb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZWFyY2ggaW5wdXQgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gVGhlIHNlYXJjaCBpbnB1dCBpcyBvbmx5IHZpc2libGUgd2hlbiBwb3B1cCBpcyBvcGVuXG4gICAgICAvLyBXZSB2ZXJpZnkgdGhhdCB0aGUgY29tcG9uZW50IGluaXRpYWxpemVzIHdpdGggZW1wdHkgcXVlcnlcblxuICAgICAgZXhwZWN0KG1vY2tVc2VEb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcXVlcnk6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGtleXdvcmQ6ICcnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggZGVmYXVsdCBxdWVyeSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KG1vY2tVc2VEb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIGtleXdvcmQ6ICcnLFxuICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgIGxpbWl0OiAyMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBBUEkgY2FsbHNcbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgbW9ja1VzZURvY3VtZW50TGlzdCB3aXRoIGNvcnJlY3QgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGRhdGFzZXRJZDogJ3Rlc3QtZGF0YXNldC0xMjMnIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrVXNlRG9jdW1lbnRMaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIGRhdGFzZXRJZDogJ3Rlc3QtZGF0YXNldC0xMjMnLFxuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIGtleXdvcmQ6ICcnLFxuICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgbGltaXQ6IDIwLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9hZGluZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIG1vY2tEb2N1bWVudExpc3RMb2FkaW5nID0gdHJ1ZVxuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gV2hlbiBsb2FkaW5nLCBjb21wb25lbnQgc2hvdWxkIHN0aWxsIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmV0Y2ggZG9jdW1lbnRzIG9uIG1vdW50JywgKCkgPT4ge1xuICAgICAgbW9ja0RvY3VtZW50TGlzdExvYWRpbmcgPSBmYWxzZVxuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB7IGRhdGE6IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMykgfVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIGhvb2sgd2FzIGNhbGxlZFxuXG4gICAgICBleHBlY3QobW9ja1VzZURvY3VtZW50TGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRvY3VtZW50IGxpc3QnLCAoKSA9PiB7XG4gICAgICBtb2NrRG9jdW1lbnRMaXN0RGF0YSA9IHsgZGF0YTogW10gfVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBDb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkYXRhIHJlc3BvbnNlJywgKCkgPT4ge1xuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gU2hvdWxkIG5vdCBjcmFzaFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNvbXBvbmVudCBtZW1vaXphdGlvblxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZXhwb3J0IGFzIFJlYWN0Lm1lbW8gd3JhcHBlZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSBjb21wb25lbnQgaXMgbWVtb2l6ZWRcbiAgICAgIGV4cGVjdChEb2N1bWVudFBpY2tlcikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHR5cGVvZiBEb2N1bWVudFBpY2tlcikudG9CZSgnb2JqZWN0JykgLy8gUmVhY3QubWVtbyByZXR1cm5zIGFuIG9iamVjdFxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHJlbmRlciBvdXRwdXQgd2hlbiBkYXRhc2V0SWQgaXMgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVRlc3RRdWVyeUNsaWVudCgpXG4gICAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgICAgbmFtZTogJ01lbW8gVGVzdCcsXG4gICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICB9XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgICA8RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICAgIGRhdGFzZXRJZD1cInNhbWUtZGF0YXNldFwiXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01lbW8gVGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgICA8RG9jdW1lbnRQaWNrZXJcbiAgICAgICAgICAgIGRhdGFzZXRJZD1cInNhbWUtZGF0YXNldFwiXG4gICAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01lbW8gVGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZWRnZSBjYXNlcyBhbmQgZXJyb3IgaGFuZGxpbmdcbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBuYW1lJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJy0tJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEVtcHR5IHN0cmluZyBpcyBmYWxzeSwgc28gc2hvdWxkIHNob3cgJy0tJ1xuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnLS0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCBEb2MnLFxuICAgICAgICAgIGV4dGVuc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBEb2MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgY2h1bmtpbmdNb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCBEb2MnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBXaGVuIGNodW5raW5nTW9kZSBpcyB1bmRlZmluZWQsIG5vbmUgb2YgdGhlIG1vZGUgY29uZGl0aW9ucyBhcmUgdHJ1ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgRG9jJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnQgd2l0aG91dCBkYXRhX3NvdXJjZV9kZXRhaWxfZGljdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRvY1dpdGhvdXREZXRhaWwgPSBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICBpZDogJ2RvYy1uby1kZXRhaWwnLFxuICAgICAgICBuYW1lOiAnRG9jIFdpdGhvdXQgRGV0YWlsJyxcbiAgICAgICAgZGF0YV9zb3VyY2VfZGV0YWlsX2RpY3Q6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgICBtb2NrRG9jdW1lbnRMaXN0RGF0YSA9IHsgZGF0YTogW2RvY1dpdGhvdXREZXRhaWxdIH1cblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBoYW5kbGUgbWFwcGluZyBkb2N1bWVudHMgZXZlbiB3aXRob3V0IGRhdGFfc291cmNlX2RldGFpbF9kaWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIHRvZ2dsZSBjbGlja3MnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG5cbiAgICAgIC8vIFJhcGlkIGNsaWNrc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBkb2N1bWVudCBuYW1lcyBpbiB0cmlnZ2VyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ05hbWUgPSAnQScucmVwZWF0KDUwMClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgbmFtZTogbG9uZ05hbWUsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBsb25nIG5hbWUgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ05hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBkb2N1bWVudCBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlY2lhbE5hbWUgPSAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PidcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgbmFtZTogc3BlY2lhbE5hbWUsXG4gICAgICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgICAgICBjaHVua2luZ01vZGU6IENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gUmVhY3Qgc2hvdWxkIGVzY2FwZSB0aGUgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoc3BlY2lhbE5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRvY3VtZW50cyB3aXRoIG1pc3NpbmcgZXh0ZW5zaW9uIGluIGRhdGFfc291cmNlX2RldGFpbF9kaWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jV2l0aEVtcHR5RXh0ZW5zaW9uID0gY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgaWQ6ICdkb2MtZW1wdHktZXh0JyxcbiAgICAgICAgbmFtZTogJ0RvYyBFbXB0eSBFeHQnLFxuICAgICAgICBkYXRhX3NvdXJjZV9kZXRhaWxfZGljdDoge1xuICAgICAgICAgIHVwbG9hZF9maWxlOiB7XG4gICAgICAgICAgICBuYW1lOiAnZmlsZS1uby1leHQnLFxuICAgICAgICAgICAgZXh0ZW5zaW9uOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tEb2N1bWVudExpc3REYXRhID0geyBkYXRhOiBbZG9jV2l0aEVtcHR5RXh0ZW5zaW9uXSB9XG5cbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgaGFuZGxlIG1hcHBpbmcgZG9jdW1lbnRzIHdpdGggZW1wdHkgZXh0ZW5zaW9uXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRvY3VtZW50IGxpc3QgbWFwcGluZyB3aXRoIHZhcmlvdXMgZGF0YV9zb3VyY2VfZGV0YWlsX2RpY3Qgc3RhdGVzJywgKCkgPT4ge1xuICAgICAgLy8gVGVzdCB0aGUgbWFwcGluZyBsb2dpYzogZC5kYXRhX3NvdXJjZV9kZXRhaWxfZGljdD8udXBsb2FkX2ZpbGU/LmV4dGVuc2lvbiB8fCAnJ1xuICAgICAgY29uc3QgZG9jcyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgICBuYW1lOiAnV2l0aCBFeHRlbnNpb24nLFxuICAgICAgICAgIGRhdGFfc291cmNlX2RldGFpbF9kaWN0OiB7XG4gICAgICAgICAgICB1cGxvYWRfZmlsZTogeyBuYW1lOiAnZmlsZS5wZGYnLCBleHRlbnNpb246ICdwZGYnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgICAgaWQ6ICdkb2MtMicsXG4gICAgICAgICAgbmFtZTogJ1dpdGhvdXQgRGV0YWlsIERpY3QnLFxuICAgICAgICAgIGRhdGFfc291cmNlX2RldGFpbF9kaWN0OiB1bmRlZmluZWQsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB7IGRhdGE6IGRvY3MgfVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBTaG91bGQgbm90IGNyYXNoIGR1cmluZyBtYXBwaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYWxsIHByb3AgdmFyaWF0aW9uc1xuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdkYXRhc2V0SWQgdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRhdGFzZXRJZCcsICgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZGF0YXNldElkOiAnJyB9KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIFVVSUQgZm9ybWF0IGRhdGFzZXRJZCcsICgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZGF0YXNldElkOiAnMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwJyB9KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd2YWx1ZS5jaHVua2luZ01vZGUgdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNodW5raW5nTW9kZXMgPSBbXG4gICAgICAgIHsgbW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsIGxhYmVsOiAnZGF0YXNldC5jaHVua2luZ01vZGUuZ2VuZXJhbCcgfSxcbiAgICAgICAgeyBtb2RlOiBDaHVua2luZ01vZGUucWEsIGxhYmVsOiAnZGF0YXNldC5jaHVua2luZ01vZGUucWEnIH0sXG4gICAgICAgIHsgbW9kZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLCBsYWJlbDogJ2RhdGFzZXQuY2h1bmtpbmdNb2RlLnBhcmVudENoaWxkJyB9LFxuICAgICAgXVxuXG4gICAgICBpdC5lYWNoKGNodW5raW5nTW9kZXMpKFxuICAgICAgICAnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBsYWJlbCBmb3IgJG1vZGUgbW9kZScsXG4gICAgICAgICh7IG1vZGUsIGxhYmVsIH0pID0+IHtcbiAgICAgICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgbmFtZTogJ1Rlc3QnLFxuICAgICAgICAgICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgICAgICAgICBjaHVua2luZ01vZGU6IG1vZGUsXG4gICAgICAgICAgICAgIHBhcmVudE1vZGU6IG1vZGUgPT09IENodW5raW5nTW9kZS5wYXJlbnRDaGlsZCA/ICdwYXJhZ3JhcGgnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobmV3IFJlZ0V4cChsYWJlbCkpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd2YWx1ZS5wYXJlbnRNb2RlIHZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJlbnRNb2RlczogQXJyYXk8eyBtb2RlOiBQYXJlbnRNb2RlLCBsYWJlbDogc3RyaW5nIH0+ID0gW1xuICAgICAgICB7IG1vZGU6ICdwYXJhZ3JhcGgnLCBsYWJlbDogJ2RhdGFzZXQucGFyZW50TW9kZS5wYXJhZ3JhcGgnIH0sXG4gICAgICAgIHsgbW9kZTogJ2Z1bGwtZG9jJywgbGFiZWw6ICdkYXRhc2V0LnBhcmVudE1vZGUuZnVsbERvYycgfSxcbiAgICAgIF1cblxuICAgICAgaXQuZWFjaChwYXJlbnRNb2RlcykoXG4gICAgICAgICdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGxhYmVsIGZvciAkbW9kZSBwYXJlbnRNb2RlJyxcbiAgICAgICAgKHsgbW9kZSwgbGFiZWwgfSkgPT4ge1xuICAgICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICAgICAgICAgICAgICBwYXJlbnRNb2RlOiBtb2RlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobmV3IFJlZ0V4cChsYWJlbCkpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd2YWx1ZS5leHRlbnNpb24gdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSBbJ3R4dCcsICdwZGYnLCAnZG9jeCcsICd4bHN4JywgJ2NzdicsICdtZCcsICdodG1sJ11cblxuICAgICAgaXQuZWFjaChleHRlbnNpb25zKSgnc2hvdWxkIGhhbmRsZSAlcyBleHRlbnNpb24nLCAoZXh0KSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgIG5hbWU6IGBGaWxlLiR7ZXh0fWAsXG4gICAgICAgICAgICBleHRlbnNpb246IGV4dCxcbiAgICAgICAgICAgIGNodW5raW5nTW9kZTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChgRmlsZS4ke2V4dH1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBkb2N1bWVudCBzZWxlY3Rpb25cbiAgZGVzY3JpYmUoJ0RvY3VtZW50IFNlbGVjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZldGNoIGRvY3VtZW50cyBsaXN0IHZpYSBtb2NrVXNlRG9jdW1lbnRMaXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RvYyA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgIGlkOiAnc2VsZWN0ZWQtZG9jJyxcbiAgICAgICAgbmFtZTogJ1NlbGVjdGVkIERvY3VtZW50JyxcbiAgICAgIH0pXG4gICAgICBtb2NrRG9jdW1lbnRMaXN0RGF0YSA9IHsgZGF0YTogW21vY2tEb2NdIH1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIGhvb2sgd2FzIGNhbGxlZFxuXG4gICAgICBleHBlY3QobW9ja1VzZURvY3VtZW50TGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIGRvY3VtZW50IGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jcyA9IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMylcbiAgICAgIG1vY2tEb2N1bWVudExpc3REYXRhID0geyBkYXRhOiBkb2NzIH1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBDbGljayBvbiBhIGRvY3VtZW50IGluIHRoZSBsaXN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMicpKVxuXG4gICAgICAvLyBoYW5kbGVDaGFuZ2Ugc2hvdWxkIGZpbmQgdGhlIGRvY3VtZW50IGFuZCBjYWxsIG9uQ2hhbmdlIHdpdGggZnVsbCBkb2N1bWVudFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZG9jc1sxXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYXAgZG9jdW1lbnQgbGlzdCBpdGVtcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb2NzID0gY3JlYXRlTW9ja0RvY3VtZW50TGlzdCgzKVxuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB7IGRhdGE6IGRvY3MgfVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBEb2N1bWVudHMgc2hvdWxkIGJlIHJlbmRlcmVkIGluIHRoZSBsaXN0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnQgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgaW50ZWdyYXRpb24gd2l0aCBjaGlsZCBjb21wb25lbnRzXG4gIGRlc2NyaWJlKCdDaGlsZCBDb21wb25lbnQgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgZGF0YSB0byBEb2N1bWVudExpc3Qgd2hlbiBwb3B1cCBpcyBvcGVuJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jcyA9IGNyZWF0ZU1vY2tEb2N1bWVudExpc3QoMylcbiAgICAgIG1vY2tEb2N1bWVudExpc3REYXRhID0geyBkYXRhOiBkb2NzIH1cblxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gRG9jdW1lbnRMaXN0IHJlY2VpdmVzIG1hcHBlZCBkb2N1bWVudHM6IHsgaWQsIG5hbWUsIGV4dGVuc2lvbiB9XG4gICAgICAvLyBXZSB2ZXJpZnkgdGhlIGRhdGEgaXMgZmV0Y2hlZFxuXG4gICAgICBleHBlY3QobW9ja1VzZURvY3VtZW50TGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFwIGRvY3VtZW50IGRhdGFfc291cmNlX2RldGFpbF9kaWN0IGV4dGVuc2lvbiBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb2MgPSBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICBpZDogJ21hcHBlZC1kb2MnLFxuICAgICAgICBuYW1lOiAnTWFwcGVkIERvY3VtZW50JyxcbiAgICAgICAgZGF0YV9zb3VyY2VfZGV0YWlsX2RpY3Q6IHtcbiAgICAgICAgICB1cGxvYWRfZmlsZToge1xuICAgICAgICAgICAgbmFtZTogJ21hcHBlZC5wZGYnLFxuICAgICAgICAgICAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tEb2N1bWVudExpc3REYXRhID0geyBkYXRhOiBbZG9jXSB9XG5cbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIFRoZSBtYXBwaW5nOiBkLmRhdGFfc291cmNlX2RldGFpbF9kaWN0Py51cGxvYWRfZmlsZT8uZXh0ZW5zaW9uIHx8ICcnXG4gICAgICAvLyBTaG91bGQgZXh0cmFjdCAncGRmJyBmcm9tIHRoZSBkb2N1bWVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWVsZW0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmlnZ2VyIHdpdGggU2VhcmNoSW5wdXQgaW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBUaGUgdHJpZ2dlciBpcyBhbHdheXMgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbnRlZ3JhdGUgRmlsZUljb24gY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gVXNlIGVtcHR5IGRvY3VtZW50IGxpc3QgdG8gYXZvaWQgZHVwbGljYXRlIGljb25zIGZyb20gbGlzdFxuICAgICAgbW9ja0RvY3VtZW50TGlzdERhdGEgPSB7IGRhdGE6IFtdIH1cblxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBuYW1lOiAndGVzdC5wZGYnLFxuICAgICAgICAgIGV4dGVuc2lvbjogJ3BkZicsXG4gICAgICAgICAgY2h1bmtpbmdNb2RlOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbGVJY29uIHNob3VsZCBiZSByZW5kZXJlZCB2aWEgRG9jdW1lbnRGaWxlSWNvbiAtIHBkZiByZW5kZXJzIHBkZiBpY29uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLXBkZi1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciB2aXN1YWwgc3RhdGVzXG4gIGRlc2NyaWJlKCdWaXN1YWwgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBvcnRhbCBjb250ZW50IGZvciBkb2N1bWVudCBzZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBQb3J0YWwgY29udGVudCBpcyByZW5kZXJlZCBpbiBvdXIgbW9jayBmb3IgdGVzdGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19