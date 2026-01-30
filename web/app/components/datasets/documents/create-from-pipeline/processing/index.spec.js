"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock useDocLink - returns a function that generates doc URLs
// Strips leading slash from path to match actual implementation behavior
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => {
        const normalizedPath = path?.startsWith('/') ? path.slice(1) : (path || '');
        return `https://docs.dify.ai/en-US/${normalizedPath}`;
    },
}));
// Mock dataset detail context
let mockDataset;
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => {
        return selector({ dataset: mockDataset });
    },
}));
// Mock the EmbeddingProcess component to track props
let embeddingProcessProps = {};
vi.mock('./embedding-process', () => ({
    default: (props) => {
        embeddingProcessProps = props;
        return (<div data-testid="embedding-process">
        <span data-testid="ep-dataset-id">{props.datasetId}</span>
        <span data-testid="ep-batch-id">{props.batchId}</span>
        <span data-testid="ep-documents-count">{props.documents?.length ?? 0}</span>
        <span data-testid="ep-indexing-type">{props.indexingType || 'undefined'}</span>
        <span data-testid="ep-retrieval-method">{props.retrievalMethod || 'undefined'}</span>
      </div>);
    },
}));
// ==========================================
// Test Data Factory Functions
// ==========================================
/**
 * Creates a mock InitialDocumentDetail for testing
 * Uses deterministic counter-based IDs to avoid flaky tests
 */
let documentIdCounter = 0;
const createMockDocument = (overrides = {}) => ({
    id: overrides.id ?? `doc-${++documentIdCounter}`,
    name: 'test-document.txt',
    data_source_type: pipeline_1.DatasourceType.localFile,
    data_source_info: {},
    enable: true,
    error: '',
    indexing_status: 'waiting',
    position: 0,
    ...overrides,
});
/**
 * Creates a list of mock documents
 */
const createMockDocuments = (count) => Array.from({ length: count }, (_, index) => createMockDocument({
    id: `doc-${index + 1}`,
    name: `document-${index + 1}.txt`,
    position: index,
}));
// ==========================================
// Test Suite
// ==========================================
describe('Processing', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        embeddingProcessProps = {};
        // Reset deterministic ID counter for reproducible tests
        documentIdCounter = 0;
        // Reset mock dataset with default values
        mockDataset = {
            id: 'dataset-123',
            indexing_technique: 'high_quality',
            retrieval_model_dict: { search_method: 'semantic_search' },
        };
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        // Tests basic rendering functionality
        it('should render without crashing', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(2),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should render the EmbeddingProcess component', () => {
            // Arrange
            const props = {
                batchId: 'batch-456',
                documents: createMockDocuments(3),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should render the side tip section with correct content', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - verify translation keys are rendered
            expect(react_1.screen.getByText('datasetCreation.stepThree.sideTipTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.sideTipContent')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepThree.learnMore')).toBeInTheDocument();
        });
        it('should render the documentation link with correct attributes', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link', { name: 'datasetPipeline.addDocuments.stepThree.learnMore' });
            expect(link).toHaveAttribute('href', 'https://docs.dify.ai/en-US/guides/knowledge-base/integrate-knowledge-within-application');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noreferrer noopener');
        });
        it('should render the book icon in the side tip', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - check for icon container with shadow styling
            const iconContainer = container.querySelector('.shadow-lg.shadow-shadow-shadow-5');
            expect(iconContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        // Tests that props are correctly passed to child components
        it('should pass batchId to EmbeddingProcess', () => {
            // Arrange
            const testBatchId = 'test-batch-id-789';
            const props = {
                batchId: testBatchId,
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent(testBatchId);
            expect(embeddingProcessProps.batchId).toBe(testBatchId);
        });
        it('should pass documents to EmbeddingProcess', () => {
            // Arrange
            const documents = createMockDocuments(5);
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('5');
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should pass datasetId from context to EmbeddingProcess', () => {
            // Arrange
            mockDataset = {
                id: 'context-dataset-id',
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('context-dataset-id');
            expect(embeddingProcessProps.datasetId).toBe('context-dataset-id');
        });
        it('should pass indexingType from context to EmbeddingProcess', () => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: 'economy',
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-indexing-type')).toHaveTextContent('economy');
            expect(embeddingProcessProps.indexingType).toBe('economy');
        });
        it('should pass retrievalMethod from context to EmbeddingProcess', () => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: 'keyword_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-retrieval-method')).toHaveTextContent('keyword_search');
            expect(embeddingProcessProps.retrievalMethod).toBe('keyword_search');
        });
        it('should handle different document types', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-local',
                    name: 'local-file.pdf',
                    data_source_type: pipeline_1.DatasourceType.localFile,
                }),
                createMockDocument({
                    id: 'doc-online',
                    name: 'online-doc',
                    data_source_type: pipeline_1.DatasourceType.onlineDocument,
                }),
                createMockDocument({
                    id: 'doc-website',
                    name: 'website-page',
                    data_source_type: pipeline_1.DatasourceType.websiteCrawl,
                }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('3');
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
    });
    // ==========================================
    // Edge Cases
    // ==========================================
    describe('Edge Cases', () => {
        // Tests for boundary conditions and unusual inputs
        it('should handle empty documents array', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: [],
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('0');
            expect(embeddingProcessProps.documents).toEqual([]);
        });
        it('should handle empty batchId', () => {
            // Arrange
            const props = {
                batchId: '',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('');
        });
        it('should handle undefined dataset from context', () => {
            // Arrange
            mockDataset = undefined;
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.datasetId).toBeUndefined();
            expect(embeddingProcessProps.indexingType).toBeUndefined();
            expect(embeddingProcessProps.retrievalMethod).toBeUndefined();
        });
        it('should handle dataset with undefined id', () => {
            // Arrange
            mockDataset = {
                id: undefined,
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.datasetId).toBeUndefined();
        });
        it('should handle dataset with undefined indexing_technique', () => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: undefined,
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.indexingType).toBeUndefined();
        });
        it('should handle dataset with undefined retrieval_model_dict', () => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: 'high_quality',
                retrieval_model_dict: undefined,
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.retrievalMethod).toBeUndefined();
        });
        it('should handle dataset with empty retrieval_model_dict', () => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: 'high_quality',
                retrieval_model_dict: {},
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.retrievalMethod).toBeUndefined();
        });
        it('should handle large number of documents', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(100),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('100');
        });
        it('should handle documents with error status', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-error',
                    name: 'error-doc.txt',
                    error: 'Processing failed',
                    indexing_status: 'error',
                }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should handle documents with special characters in names', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-special',
                    name: 'document with spaces & special-chars_测试.pdf',
                }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should handle batchId with special characters', () => {
            // Arrange
            const props = {
                batchId: 'batch-123-abc_xyz:456',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('batch-123-abc_xyz:456');
        });
    });
    // ==========================================
    // Context Integration Tests
    // ==========================================
    describe('Context Integration', () => {
        // Tests for proper context usage
        it('should correctly use context selectors for all dataset properties', () => {
            // Arrange
            mockDataset = {
                id: 'full-dataset-id',
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: 'hybrid_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(embeddingProcessProps.datasetId).toBe('full-dataset-id');
            expect(embeddingProcessProps.indexingType).toBe('high_quality');
            expect(embeddingProcessProps.retrievalMethod).toBe('hybrid_search');
        });
        it('should handle context changes with different indexing techniques', () => {
            // Arrange - Test with economy indexing
            mockDataset = {
                id: 'dataset-economy',
                indexing_technique: 'economy',
                retrieval_model_dict: { search_method: 'keyword_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert economy indexing
            expect(embeddingProcessProps.indexingType).toBe('economy');
            // Arrange - Update to high_quality
            mockDataset = {
                id: 'dataset-hq',
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            // Act - Rerender with new context
            rerender(<index_1.default {...props}/>);
            // Assert high_quality indexing
            expect(embeddingProcessProps.indexingType).toBe('high_quality');
        });
    });
    // ==========================================
    // Layout Tests
    // ==========================================
    describe('Layout', () => {
        // Tests for proper layout and structure
        it('should render with correct layout structure', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check for flex layout with proper widths
            const mainContainer = container.querySelector('.flex.h-full.w-full.justify-center');
            expect(mainContainer).toBeInTheDocument();
            // Check for left panel (3/5 width)
            const leftPanel = container.querySelector('.w-3\\/5');
            expect(leftPanel).toBeInTheDocument();
            // Check for right panel (2/5 width)
            const rightPanel = container.querySelector('.w-2\\/5');
            expect(rightPanel).toBeInTheDocument();
        });
        it('should render side tip card with correct styling', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Check for card container with rounded corners and background
            const sideTipCard = container.querySelector('.rounded-xl.bg-background-section');
            expect(sideTipCard).toBeInTheDocument();
        });
        it('should constrain max-width for EmbeddingProcess container', () => {
            // Arrange
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const maxWidthContainer = container.querySelector('.max-w-\\[640px\\]');
            expect(maxWidthContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // Document Variations Tests
    // ==========================================
    describe('Document Variations', () => {
        // Tests for different document configurations
        it('should handle documents with all indexing statuses', () => {
            // Arrange
            const statuses = [
                'waiting',
                'parsing',
                'cleaning',
                'splitting',
                'indexing',
                'paused',
                'error',
                'completed',
            ];
            const documents = statuses.map((status, index) => createMockDocument({
                id: `doc-${status}`,
                name: `${status}-doc.txt`,
                indexing_status: status,
                position: index,
            }));
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent(String(statuses.length));
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should handle documents with enabled and disabled states', () => {
            // Arrange
            const documents = [
                createMockDocument({ id: 'doc-enabled', enable: true }),
                createMockDocument({ id: 'doc-disabled', enable: false }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('2');
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should handle documents from online drive source', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-drive',
                    name: 'google-drive-doc',
                    data_source_type: pipeline_1.DatasourceType.onlineDrive,
                    data_source_info: { provider: 'google_drive' },
                }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
        it('should handle documents with complex data_source_info', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-notion',
                    name: 'Notion Page',
                    data_source_type: pipeline_1.DatasourceType.onlineDocument,
                    data_source_info: {
                        notion_page_icon: { type: 'emoji', emoji: '📄' },
                        notion_workspace_id: 'ws-123',
                        notion_page_id: 'page-456',
                    },
                }),
            ];
            const props = {
                batchId: 'batch-123',
                documents,
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(embeddingProcessProps.documents).toEqual(documents);
        });
    });
    // ==========================================
    // Retrieval Method Variations
    // ==========================================
    describe('Retrieval Method Variations', () => {
        // Tests for different retrieval methods
        const retrievalMethods = ['semantic_search', 'keyword_search', 'hybrid_search', 'full_text_search'];
        it.each(retrievalMethods)('should handle %s retrieval method', (method) => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: 'high_quality',
                retrieval_model_dict: { search_method: method },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(embeddingProcessProps.retrievalMethod).toBe(method);
        });
    });
    // ==========================================
    // Indexing Technique Variations
    // ==========================================
    describe('Indexing Technique Variations', () => {
        // Tests for different indexing techniques
        const indexingTechniques = ['high_quality', 'economy'];
        it.each(indexingTechniques)('should handle %s indexing technique', (technique) => {
            // Arrange
            mockDataset = {
                id: 'dataset-123',
                indexing_technique: technique,
                retrieval_model_dict: { search_method: 'semantic_search' },
            };
            const props = {
                batchId: 'batch-123',
                documents: createMockDocuments(1),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(embeddingProcessProps.indexingType).toBe(technique);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5QixnREFBa0Q7QUFDbEQsbUNBQWdDO0FBRWhDLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsNkNBQTZDO0FBRTdDLCtEQUErRDtBQUMvRCx5RUFBeUU7QUFDekUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQWEsRUFBRSxFQUFFO1FBQ2xDLE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLE9BQU8sOEJBQThCLGNBQWMsRUFBRSxDQUFBO0lBQ3ZELENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDhCQUE4QjtBQUM5QixJQUFJLFdBSVMsQ0FBQTtBQUViLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QyxtQ0FBbUMsRUFBRSxDQUFLLFFBQXdELEVBQUssRUFBRTtRQUN2RyxPQUFPLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0lBQzNDLENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHFEQUFxRDtBQUNyRCxJQUFJLHFCQUFxQixHQUE0QixFQUFFLENBQUE7QUFDdkQsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sRUFBRSxDQUFDLEtBQThCLEVBQUUsRUFBRTtRQUMxQyxx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QUFVLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFakMsU0FBUztZQUNULE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztJQUM3QyxnQ0FBZ0M7SUFDaEMsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDN0MsMENBQTBDO1FBQzFDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFFdEQsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLHFDQUFxQyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDL0UsVUFBVTtZQUNWLFdBQVcsR0FBRztnQkFDWixFQUFFLEVBQUUsYUFBYTtnQkFDakIsa0JBQWtCLEVBQUUsU0FBUztnQkFDN0Isb0JBQW9CLEVBQUUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUU7YUFDM0QsQ0FBQTtZQUNELE1BQU0sS0FBSyxHQUFHO2dCQUNaLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2FBQ2xDLENBQUE7WUFFRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFakMsU0FBUztZQUNULE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEb2N1bWVudEluZGV4aW5nU3RhdHVzIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IEluaXRpYWxEb2N1bWVudERldGFpbCB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBEYXRhc291cmNlVHlwZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IFByb2Nlc3NpbmcgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgdXNlRG9jTGluayAtIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGdlbmVyYXRlcyBkb2MgVVJMc1xuLy8gU3RyaXBzIGxlYWRpbmcgc2xhc2ggZnJvbSBwYXRoIHRvIG1hdGNoIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBiZWhhdmlvclxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiAocGF0aD86IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRQYXRoID0gcGF0aD8uc3RhcnRzV2l0aCgnLycpID8gcGF0aC5zbGljZSgxKSA6IChwYXRoIHx8ICcnKVxuICAgIHJldHVybiBgaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4tVVMvJHtub3JtYWxpemVkUGF0aH1gXG4gIH0sXG59KSlcblxuLy8gTW9jayBkYXRhc2V0IGRldGFpbCBjb250ZXh0XG5sZXQgbW9ja0RhdGFzZXQ6IHtcbiAgaWQ/OiBzdHJpbmdcbiAgaW5kZXhpbmdfdGVjaG5pcXVlPzogc3RyaW5nXG4gIHJldHJpZXZhbF9tb2RlbF9kaWN0PzogeyBzZWFyY2hfbWV0aG9kPzogc3RyaW5nIH1cbn0gfCB1bmRlZmluZWRcblxudmkubW9jaygnQC9jb250ZXh0L2RhdGFzZXQtZGV0YWlsJywgKCkgPT4gKHtcbiAgdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3I6IDxULD4oc2VsZWN0b3I6IChzdGF0ZTogeyBkYXRhc2V0PzogdHlwZW9mIG1vY2tEYXRhc2V0IH0pID0+IFQpOiBUID0+IHtcbiAgICByZXR1cm4gc2VsZWN0b3IoeyBkYXRhc2V0OiBtb2NrRGF0YXNldCB9KVxuICB9LFxufSkpXG5cbi8vIE1vY2sgdGhlIEVtYmVkZGluZ1Byb2Nlc3MgY29tcG9uZW50IHRvIHRyYWNrIHByb3BzXG5sZXQgZW1iZWRkaW5nUHJvY2Vzc1Byb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9XG52aS5tb2NrKCcuL2VtYmVkZGluZy1wcm9jZXNzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgIGVtYmVkZGluZ1Byb2Nlc3NQcm9wcyA9IHByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJlbWJlZGRpbmctcHJvY2Vzc1wiPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVwLWRhdGFzZXQtaWRcIj57cHJvcHMuZGF0YXNldElkIGFzIHN0cmluZ308L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZXAtYmF0Y2gtaWRcIj57cHJvcHMuYmF0Y2hJZCBhcyBzdHJpbmd9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVwLWRvY3VtZW50cy1jb3VudFwiPnsocHJvcHMuZG9jdW1lbnRzIGFzIHVua25vd25bXSk/Lmxlbmd0aCA/PyAwfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJlcC1pbmRleGluZy10eXBlXCI+e3Byb3BzLmluZGV4aW5nVHlwZSBhcyBzdHJpbmcgfHwgJ3VuZGVmaW5lZCd9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVwLXJldHJpZXZhbC1tZXRob2RcIj57cHJvcHMucmV0cmlldmFsTWV0aG9kIGFzIHN0cmluZyB8fCAndW5kZWZpbmVkJ308L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yeSBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrIEluaXRpYWxEb2N1bWVudERldGFpbCBmb3IgdGVzdGluZ1xuICogVXNlcyBkZXRlcm1pbmlzdGljIGNvdW50ZXItYmFzZWQgSURzIHRvIGF2b2lkIGZsYWt5IHRlc3RzXG4gKi9cbmxldCBkb2N1bWVudElkQ291bnRlciA9IDBcbmNvbnN0IGNyZWF0ZU1vY2tEb2N1bWVudCA9IChvdmVycmlkZXM6IFBhcnRpYWw8SW5pdGlhbERvY3VtZW50RGV0YWlsPiA9IHt9KTogSW5pdGlhbERvY3VtZW50RGV0YWlsID0+ICh7XG4gIGlkOiBvdmVycmlkZXMuaWQgPz8gYGRvYy0keysrZG9jdW1lbnRJZENvdW50ZXJ9YCxcbiAgbmFtZTogJ3Rlc3QtZG9jdW1lbnQudHh0JyxcbiAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICBkYXRhX3NvdXJjZV9pbmZvOiB7fSxcbiAgZW5hYmxlOiB0cnVlLFxuICBlcnJvcjogJycsXG4gIGluZGV4aW5nX3N0YXR1czogJ3dhaXRpbmcnIGFzIERvY3VtZW50SW5kZXhpbmdTdGF0dXMsXG4gIHBvc2l0aW9uOiAwLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIENyZWF0ZXMgYSBsaXN0IG9mIG1vY2sgZG9jdW1lbnRzXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tEb2N1bWVudHMgPSAoY291bnQ6IG51bWJlcik6IEluaXRpYWxEb2N1bWVudERldGFpbFtdID0+XG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpbmRleCkgPT5cbiAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgaWQ6IGBkb2MtJHtpbmRleCArIDF9YCxcbiAgICAgIG5hbWU6IGBkb2N1bWVudC0ke2luZGV4ICsgMX0udHh0YCxcbiAgICAgIHBvc2l0aW9uOiBpbmRleCxcbiAgICB9KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFN1aXRlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1Byb2Nlc3NpbmcnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIGVtYmVkZGluZ1Byb2Nlc3NQcm9wcyA9IHt9XG4gICAgLy8gUmVzZXQgZGV0ZXJtaW5pc3RpYyBJRCBjb3VudGVyIGZvciByZXByb2R1Y2libGUgdGVzdHNcbiAgICBkb2N1bWVudElkQ291bnRlciA9IDBcbiAgICAvLyBSZXNldCBtb2NrIGRhdGFzZXQgd2l0aCBkZWZhdWx0IHZhbHVlc1xuICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgaWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICBpbmRleGluZ190ZWNobmlxdWU6ICdoaWdoX3F1YWxpdHknLFxuICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHsgc2VhcmNoX21ldGhvZDogJ3NlbWFudGljX3NlYXJjaCcgfSxcbiAgICB9XG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAvLyBUZXN0cyBiYXNpYyByZW5kZXJpbmcgZnVuY3Rpb25hbGl0eVxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygyKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBFbWJlZGRpbmdQcm9jZXNzIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtNDU2JyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDMpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtYmVkZGluZy1wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIHNpZGUgdGlwIHNlY3Rpb24gd2l0aCBjb3JyZWN0IGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gdmVyaWZ5IHRyYW5zbGF0aW9uIGtleXMgYXJlIHJlbmRlcmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5zaWRlVGlwVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuc2lkZVRpcENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFRocmVlLmxlYXJuTW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBkb2N1bWVudGF0aW9uIGxpbmsgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFRocmVlLmxlYXJuTW9yZScgfSlcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4tVVMvZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2ludGVncmF0ZS1rbm93bGVkZ2Utd2l0aGluLWFwcGxpY2F0aW9uJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vcmVmZXJyZXIgbm9vcGVuZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aGUgYm9vayBpY29uIGluIHRoZSBzaWRlIHRpcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY2hlY2sgZm9yIGljb24gY29udGFpbmVyIHdpdGggc2hhZG93IHN0eWxpbmdcbiAgICAgIGNvbnN0IGljb25Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNoYWRvdy1sZy5zaGFkb3ctc2hhZG93LXNoYWRvdy01JylcbiAgICAgIGV4cGVjdChpY29uQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIHRoYXQgcHJvcHMgYXJlIGNvcnJlY3RseSBwYXNzZWQgdG8gY2hpbGQgY29tcG9uZW50c1xuICAgIGl0KCdzaG91bGQgcGFzcyBiYXRjaElkIHRvIEVtYmVkZGluZ1Byb2Nlc3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0ZXN0QmF0Y2hJZCA9ICd0ZXN0LWJhdGNoLWlkLTc4OSdcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiB0ZXN0QmF0Y2hJZCxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VwLWJhdGNoLWlkJykpLnRvSGF2ZVRleHRDb250ZW50KHRlc3RCYXRjaElkKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5iYXRjaElkKS50b0JlKHRlc3RCYXRjaElkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgZG9jdW1lbnRzIHRvIEVtYmVkZGluZ1Byb2Nlc3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2N1bWVudHMgPSBjcmVhdGVNb2NrRG9jdW1lbnRzKDUpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50cyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kb2N1bWVudHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzUnKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoZG9jdW1lbnRzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgZGF0YXNldElkIGZyb20gY29udGV4dCB0byBFbWJlZGRpbmdQcm9jZXNzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXQgPSB7XG4gICAgICAgIGlkOiAnY29udGV4dC1kYXRhc2V0LWlkJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHsgc2VhcmNoX21ldGhvZDogJ3NlbWFudGljX3NlYXJjaCcgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VwLWRhdGFzZXQtaWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2NvbnRleHQtZGF0YXNldC1pZCcpXG4gICAgICBleHBlY3QoZW1iZWRkaW5nUHJvY2Vzc1Byb3BzLmRhdGFzZXRJZCkudG9CZSgnY29udGV4dC1kYXRhc2V0LWlkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGluZGV4aW5nVHlwZSBmcm9tIGNvbnRleHQgdG8gRW1iZWRkaW5nUHJvY2VzcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgICBpZDogJ2RhdGFzZXQtMTIzJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnZWNvbm9teScsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7IHNlYXJjaF9tZXRob2Q6ICdzZW1hbnRpY19zZWFyY2gnIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1pbmRleGluZy10eXBlJykpLnRvSGF2ZVRleHRDb250ZW50KCdlY29ub215JylcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlKCdlY29ub215JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHJldHJpZXZhbE1ldGhvZCBmcm9tIGNvbnRleHQgdG8gRW1iZWRkaW5nUHJvY2VzcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgICBpZDogJ2RhdGFzZXQtMTIzJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHsgc2VhcmNoX21ldGhvZDogJ2tleXdvcmRfc2VhcmNoJyB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgna2V5d29yZF9zZWFyY2gnKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5yZXRyaWV2YWxNZXRob2QpLnRvQmUoJ2tleXdvcmRfc2VhcmNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGRvY3VtZW50IHR5cGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLWxvY2FsJyxcbiAgICAgICAgICBuYW1lOiAnbG9jYWwtZmlsZS5wZGYnLFxuICAgICAgICAgIGRhdGFfc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgICAgaWQ6ICdkb2Mtb25saW5lJyxcbiAgICAgICAgICBuYW1lOiAnb25saW5lLWRvYycsXG4gICAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQsXG4gICAgICAgIH0pLFxuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLXdlYnNpdGUnLFxuICAgICAgICAgIG5hbWU6ICd3ZWJzaXRlLXBhZ2UnLFxuICAgICAgICAgIGRhdGFfc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bCxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50cyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kb2N1bWVudHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzMnKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoZG9jdW1lbnRzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBib3VuZGFyeSBjb25kaXRpb25zIGFuZCB1bnVzdWFsIGlucHV0c1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRvY3VtZW50cyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBbXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kb2N1bWVudHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGJhdGNoSWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1iYXRjaC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGRhdGFzZXQgZnJvbSBjb250ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXQgPSB1bmRlZmluZWRcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtYmVkZGluZy1wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuZGF0YXNldElkKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMucmV0cmlldmFsTWV0aG9kKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGF0YXNldCB3aXRoIHVuZGVmaW5lZCBpZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgICBpZDogdW5kZWZpbmVkLFxuICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6ICdoaWdoX3F1YWxpdHknLFxuICAgICAgICByZXRyaWV2YWxfbW9kZWxfZGljdDogeyBzZWFyY2hfbWV0aG9kOiAnc2VtYW50aWNfc2VhcmNoJyB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1iZWRkaW5nLXByb2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kYXRhc2V0SWQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkYXRhc2V0IHdpdGggdW5kZWZpbmVkIGluZGV4aW5nX3RlY2huaXF1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgICBpZDogJ2RhdGFzZXQtMTIzJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiB1bmRlZmluZWQsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7IHNlYXJjaF9tZXRob2Q6ICdzZW1hbnRpY19zZWFyY2gnIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoZW1iZWRkaW5nUHJvY2Vzc1Byb3BzLmluZGV4aW5nVHlwZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRhdGFzZXQgd2l0aCB1bmRlZmluZWQgcmV0cmlldmFsX21vZGVsX2RpY3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNldCA9IHtcbiAgICAgICAgaWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ2hpZ2hfcXVhbGl0eScsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB1bmRlZmluZWQsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoZW1iZWRkaW5nUHJvY2Vzc1Byb3BzLnJldHJpZXZhbE1ldGhvZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRhdGFzZXQgd2l0aCBlbXB0eSByZXRyaWV2YWxfbW9kZWxfZGljdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0ID0ge1xuICAgICAgICBpZDogJ2RhdGFzZXQtMTIzJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHt9LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1iZWRkaW5nLXByb2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5yZXRyaWV2YWxNZXRob2QpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBudW1iZXIgb2YgZG9jdW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMTAwKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kb2N1bWVudHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzEwMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRvY3VtZW50cyB3aXRoIGVycm9yIHN0YXR1cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgICBpZDogJ2RvYy1lcnJvcicsXG4gICAgICAgICAgbmFtZTogJ2Vycm9yLWRvYy50eHQnLFxuICAgICAgICAgIGVycm9yOiAnUHJvY2Vzc2luZyBmYWlsZWQnLFxuICAgICAgICAgIGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJyBhcyBEb2N1bWVudEluZGV4aW5nU3RhdHVzLFxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtYmVkZGluZy1wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuZG9jdW1lbnRzKS50b0VxdWFsKGRvY3VtZW50cylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnRzIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLXNwZWNpYWwnLFxuICAgICAgICAgIG5hbWU6ICdkb2N1bWVudCB3aXRoIHNwYWNlcyAmIHNwZWNpYWwtY2hhcnNf5rWL6K+VLnBkZicsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHMsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1iZWRkaW5nLXByb2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoZG9jdW1lbnRzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBiYXRjaElkIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMtYWJjX3h5ejo0NTYnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtYmF0Y2gtaWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2JhdGNoLTEyMy1hYmNfeHl6OjQ1NicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29udGV4dCBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbnRleHQgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIHByb3BlciBjb250ZXh0IHVzYWdlXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgdXNlIGNvbnRleHQgc2VsZWN0b3JzIGZvciBhbGwgZGF0YXNldCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXQgPSB7XG4gICAgICAgIGlkOiAnZnVsbC1kYXRhc2V0LWlkJyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHsgc2VhcmNoX21ldGhvZDogJ2h5YnJpZF9zZWFyY2gnIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZW1iZWRkaW5nUHJvY2Vzc1Byb3BzLmRhdGFzZXRJZCkudG9CZSgnZnVsbC1kYXRhc2V0LWlkJylcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlKCdoaWdoX3F1YWxpdHknKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5yZXRyaWV2YWxNZXRob2QpLnRvQmUoJ2h5YnJpZF9zZWFyY2gnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb250ZXh0IGNoYW5nZXMgd2l0aCBkaWZmZXJlbnQgaW5kZXhpbmcgdGVjaG5pcXVlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBUZXN0IHdpdGggZWNvbm9teSBpbmRleGluZ1xuICAgICAgbW9ja0RhdGFzZXQgPSB7XG4gICAgICAgIGlkOiAnZGF0YXNldC1lY29ub215JyxcbiAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnZWNvbm9teScsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7IHNlYXJjaF9tZXRob2Q6ICdrZXl3b3JkX3NlYXJjaCcgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgZWNvbm9teSBpbmRleGluZ1xuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5pbmRleGluZ1R5cGUpLnRvQmUoJ2Vjb25vbXknKVxuXG4gICAgICAvLyBBcnJhbmdlIC0gVXBkYXRlIHRvIGhpZ2hfcXVhbGl0eVxuICAgICAgbW9ja0RhdGFzZXQgPSB7XG4gICAgICAgIGlkOiAnZGF0YXNldC1ocScsXG4gICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ2hpZ2hfcXVhbGl0eScsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7IHNlYXJjaF9tZXRob2Q6ICdzZW1hbnRpY19zZWFyY2gnIH0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdCAtIFJlcmVuZGVyIHdpdGggbmV3IGNvbnRleHRcbiAgICAgIHJlcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCBoaWdoX3F1YWxpdHkgaW5kZXhpbmdcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlKCdoaWdoX3F1YWxpdHknKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIExheW91dCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xheW91dCcsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgcHJvcGVyIGxheW91dCBhbmQgc3RydWN0dXJlXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGxheW91dCBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50czogY3JlYXRlTW9ja0RvY3VtZW50cygxKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciBmbGV4IGxheW91dCB3aXRoIHByb3BlciB3aWR0aHNcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZsZXguaC1mdWxsLnctZnVsbC5qdXN0aWZ5LWNlbnRlcicpXG4gICAgICBleHBlY3QobWFpbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGVjayBmb3IgbGVmdCBwYW5lbCAoMy81IHdpZHRoKVxuICAgICAgY29uc3QgbGVmdFBhbmVsID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LTNcXFxcLzUnKVxuICAgICAgZXhwZWN0KGxlZnRQYW5lbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGVjayBmb3IgcmlnaHQgcGFuZWwgKDIvNSB3aWR0aClcbiAgICAgIGNvbnN0IHJpZ2h0UGFuZWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnctMlxcXFwvNScpXG4gICAgICBleHBlY3QocmlnaHRQYW5lbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzaWRlIHRpcCBjYXJkIHdpdGggY29ycmVjdCBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBmb3IgY2FyZCBjb250YWluZXIgd2l0aCByb3VuZGVkIGNvcm5lcnMgYW5kIGJhY2tncm91bmRcbiAgICAgIGNvbnN0IHNpZGVUaXBDYXJkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5yb3VuZGVkLXhsLmJnLWJhY2tncm91bmQtc2VjdGlvbicpXG4gICAgICBleHBlY3Qoc2lkZVRpcENhcmQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb25zdHJhaW4gbWF4LXdpZHRoIGZvciBFbWJlZGRpbmdQcm9jZXNzIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBtYXhXaWR0aENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubWF4LXctXFxcXFs2NDBweFxcXFxdJylcbiAgICAgIGV4cGVjdChtYXhXaWR0aENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIERvY3VtZW50IFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdEb2N1bWVudCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBkaWZmZXJlbnQgZG9jdW1lbnQgY29uZmlndXJhdGlvbnNcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkb2N1bWVudHMgd2l0aCBhbGwgaW5kZXhpbmcgc3RhdHVzZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGF0dXNlczogRG9jdW1lbnRJbmRleGluZ1N0YXR1c1tdID0gW1xuICAgICAgICAnd2FpdGluZycsXG4gICAgICAgICdwYXJzaW5nJyxcbiAgICAgICAgJ2NsZWFuaW5nJyxcbiAgICAgICAgJ3NwbGl0dGluZycsXG4gICAgICAgICdpbmRleGluZycsXG4gICAgICAgICdwYXVzZWQnLFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICAnY29tcGxldGVkJyxcbiAgICAgIF1cbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IHN0YXR1c2VzLm1hcCgoc3RhdHVzLCBpbmRleCkgPT5cbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgICBpZDogYGRvYy0ke3N0YXR1c31gLFxuICAgICAgICAgIG5hbWU6IGAke3N0YXR1c30tZG9jLnR4dGAsXG4gICAgICAgICAgaW5kZXhpbmdfc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgcG9zaXRpb246IGluZGV4LFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VwLWRvY3VtZW50cy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudChTdHJpbmcoc3RhdHVzZXMubGVuZ3RoKSlcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuZG9jdW1lbnRzKS50b0VxdWFsKGRvY3VtZW50cylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnRzIHdpdGggZW5hYmxlZCBhbmQgZGlzYWJsZWQgc3RhdGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy1lbmFibGVkJywgZW5hYmxlOiB0cnVlIH0pLFxuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy1kaXNhYmxlZCcsIGVuYWJsZTogZmFsc2UgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50cyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kb2N1bWVudHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoZG9jdW1lbnRzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkb2N1bWVudHMgZnJvbSBvbmxpbmUgZHJpdmUgc291cmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLWRyaXZlJyxcbiAgICAgICAgICBuYW1lOiAnZ29vZ2xlLWRyaXZlLWRvYycsXG4gICAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUsXG4gICAgICAgICAgZGF0YV9zb3VyY2VfaW5mbzogeyBwcm92aWRlcjogJ2dvb2dsZV9kcml2ZScgfSxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEyMycsXG4gICAgICAgIGRvY3VtZW50cyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3Npbmcgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoZW1iZWRkaW5nUHJvY2Vzc1Byb3BzLmRvY3VtZW50cykudG9FcXVhbChkb2N1bWVudHMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRvY3VtZW50cyB3aXRoIGNvbXBsZXggZGF0YV9zb3VyY2VfaW5mbycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgICBpZDogJ2RvYy1ub3Rpb24nLFxuICAgICAgICAgIG5hbWU6ICdOb3Rpb24gUGFnZScsXG4gICAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQsXG4gICAgICAgICAgZGF0YV9zb3VyY2VfaW5mbzoge1xuICAgICAgICAgICAgbm90aW9uX3BhZ2VfaWNvbjogeyB0eXBlOiAnZW1vamknLCBlbW9qaTogJ/Cfk4QnIH0sXG4gICAgICAgICAgICBub3Rpb25fd29ya3NwYWNlX2lkOiAnd3MtMTIzJyxcbiAgICAgICAgICAgIG5vdGlvbl9wYWdlX2lkOiAncGFnZS00NTYnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHMsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5kb2N1bWVudHMpLnRvRXF1YWwoZG9jdW1lbnRzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJldHJpZXZhbCBNZXRob2QgVmFyaWF0aW9uc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JldHJpZXZhbCBNZXRob2QgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgZGlmZmVyZW50IHJldHJpZXZhbCBtZXRob2RzXG4gICAgY29uc3QgcmV0cmlldmFsTWV0aG9kcyA9IFsnc2VtYW50aWNfc2VhcmNoJywgJ2tleXdvcmRfc2VhcmNoJywgJ2h5YnJpZF9zZWFyY2gnLCAnZnVsbF90ZXh0X3NlYXJjaCddXG5cbiAgICBpdC5lYWNoKHJldHJpZXZhbE1ldGhvZHMpKCdzaG91bGQgaGFuZGxlICVzIHJldHJpZXZhbCBtZXRob2QnLCAobWV0aG9kKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNldCA9IHtcbiAgICAgICAgaWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ2hpZ2hfcXVhbGl0eScsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7IHNlYXJjaF9tZXRob2Q6IG1ldGhvZCB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGJhdGNoSWQ6ICdiYXRjaC0xMjMnLFxuICAgICAgICBkb2N1bWVudHM6IGNyZWF0ZU1vY2tEb2N1bWVudHMoMSksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzaW5nIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGVtYmVkZGluZ1Byb2Nlc3NQcm9wcy5yZXRyaWV2YWxNZXRob2QpLnRvQmUobWV0aG9kKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEluZGV4aW5nIFRlY2huaXF1ZSBWYXJpYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5kZXhpbmcgVGVjaG5pcXVlIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGRpZmZlcmVudCBpbmRleGluZyB0ZWNobmlxdWVzXG4gICAgY29uc3QgaW5kZXhpbmdUZWNobmlxdWVzID0gWydoaWdoX3F1YWxpdHknLCAnZWNvbm9teSddXG5cbiAgICBpdC5lYWNoKGluZGV4aW5nVGVjaG5pcXVlcykoJ3Nob3VsZCBoYW5kbGUgJXMgaW5kZXhpbmcgdGVjaG5pcXVlJywgKHRlY2huaXF1ZSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXQgPSB7XG4gICAgICAgIGlkOiAnZGF0YXNldC0xMjMnLFxuICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6IHRlY2huaXF1ZSxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHsgc2VhcmNoX21ldGhvZDogJ3NlbWFudGljX3NlYXJjaCcgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBiYXRjaElkOiAnYmF0Y2gtMTIzJyxcbiAgICAgICAgZG9jdW1lbnRzOiBjcmVhdGVNb2NrRG9jdW1lbnRzKDEpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc2luZyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChlbWJlZGRpbmdQcm9jZXNzUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlKHRlY2huaXF1ZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==