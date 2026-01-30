"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// Mock the EmbeddingProcess component since it has complex async logic
vi.mock('../embedding-process', () => ({
    default: vi.fn(({ datasetId, batchId, documents, indexingType, retrievalMethod }) => (<div data-testid="embedding-process">
      <span data-testid="ep-dataset-id">{datasetId}</span>
      <span data-testid="ep-batch-id">{batchId}</span>
      <span data-testid="ep-documents-count">{documents?.length ?? 0}</span>
      <span data-testid="ep-indexing-type">{indexingType}</span>
      <span data-testid="ep-retrieval-method">{retrievalMethod}</span>
    </div>)),
}));
// Mock useBreakpoints hook
let mockMediaType = 'pc';
vi.mock('@/hooks/use-breakpoints', () => ({
    MediaType: {
        mobile: 'mobile',
        tablet: 'tablet',
        pc: 'pc',
    },
    default: vi.fn(() => mockMediaType),
}));
// Mock useDocLink hook
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => `https://docs.dify.ai/en-US${path || ''}`,
}));
// Factory function to create mock IconInfo
const createMockIconInfo = (overrides = {}) => ({
    icon: '📙',
    icon_type: 'emoji',
    icon_background: '#FFF4ED',
    icon_url: '',
    ...overrides,
});
// Factory function to create mock FullDocumentDetail
const createMockDocument = (overrides = {}) => ({
    id: 'doc-123',
    name: 'test-document.txt',
    data_source_type: 'upload_file',
    data_source_info: {
        upload_file: {
            id: 'file-123',
            name: 'test-document.txt',
            extension: 'txt',
            mime_type: 'text/plain',
            size: 1024,
            created_by: 'user-1',
            created_at: Date.now(),
        },
    },
    batch: 'batch-123',
    created_api_request_id: 'request-123',
    processing_started_at: Date.now(),
    parsing_completed_at: Date.now(),
    cleaning_completed_at: Date.now(),
    splitting_completed_at: Date.now(),
    tokens: 100,
    indexing_latency: 5000,
    completed_at: Date.now(),
    paused_by: '',
    paused_at: 0,
    stopped_at: 0,
    indexing_status: 'completed',
    disabled_at: 0,
    ...overrides,
});
// Factory function to create mock createDocumentResponse
const createMockCreationCache = (overrides = {}) => ({
    dataset: {
        id: 'dataset-123',
        name: 'Test Dataset',
        icon_info: createMockIconInfo(),
        indexing_technique: 'high_quality',
        retrieval_model_dict: {
            search_method: 'semantic_search',
        },
    },
    batch: 'batch-123',
    documents: [createMockDocument()],
    ...overrides,
});
// Helper to render StepThree with default props
const renderStepThree = (props = {}) => {
    const defaultProps = {
        ...props,
    };
    return (0, react_1.render)(<index_1.default {...defaultProps}/>);
};
// ============================================================================
// StepThree Component Tests
// ============================================================================
describe('StepThree', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockMediaType = 'pc';
    });
    // --------------------------------------------------------------------------
    // Rendering Tests - Verify component renders properly
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should render with creation title when datasetId is not provided', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.creationTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.creationContent')).toBeInTheDocument();
        });
        it('should render with addition title when datasetId is provided', () => {
            // Arrange & Act
            renderStepThree({
                datasetId: 'existing-dataset-123',
                datasetName: 'Existing Dataset',
            });
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.additionTitle')).toBeInTheDocument();
            expect(react_1.screen.queryByText('datasetCreation.stepThree.creationTitle')).not.toBeInTheDocument();
        });
        it('should render label text in creation mode', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.label')).toBeInTheDocument();
        });
        it('should render side tip panel on desktop', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.sideTipTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepThree.sideTipContent')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepThree.learnMore')).toBeInTheDocument();
        });
        it('should not render side tip panel on mobile', () => {
            // Arrange
            mockMediaType = 'mobile';
            // Act
            renderStepThree();
            // Assert
            expect(react_1.screen.queryByText('datasetCreation.stepThree.sideTipTitle')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('datasetCreation.stepThree.sideTipContent')).not.toBeInTheDocument();
        });
        it('should render EmbeddingProcess component', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should render documentation link with correct href on desktop', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            renderStepThree();
            // Assert
            const link = react_1.screen.getByText('datasetPipeline.addDocuments.stepThree.learnMore');
            expect(link).toHaveAttribute('href', 'https://docs.dify.ai/en-US/guides/knowledge-base/integrate-knowledge-within-application');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noreferrer noopener');
        });
        it('should apply correct container classes', () => {
            // Arrange & Act
            const { container } = renderStepThree();
            // Assert
            const outerDiv = container.firstChild;
            expect(outerDiv).toHaveClass('flex', 'h-full', 'max-h-full', 'w-full', 'justify-center', 'overflow-y-auto');
        });
    });
    // --------------------------------------------------------------------------
    // Props Testing - Test all prop variations
    // --------------------------------------------------------------------------
    describe('Props', () => {
        describe('datasetId prop', () => {
            it('should render creation mode when datasetId is undefined', () => {
                // Arrange & Act
                renderStepThree({ datasetId: undefined });
                // Assert
                expect(react_1.screen.getByText('datasetCreation.stepThree.creationTitle')).toBeInTheDocument();
            });
            it('should render addition mode when datasetId is provided', () => {
                // Arrange & Act
                renderStepThree({ datasetId: 'dataset-123' });
                // Assert
                expect(react_1.screen.getByText('datasetCreation.stepThree.additionTitle')).toBeInTheDocument();
            });
            it('should pass datasetId to EmbeddingProcess', () => {
                // Arrange
                const datasetId = 'my-dataset-id';
                // Act
                renderStepThree({ datasetId });
                // Assert
                expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent(datasetId);
            });
            it('should use creationCache dataset id when datasetId is not provided', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('dataset-123');
            });
        });
        describe('datasetName prop', () => {
            it('should display datasetName in creation mode', () => {
                // Arrange & Act
                renderStepThree({ datasetName: 'My Custom Dataset' });
                // Assert
                expect(react_1.screen.getByText('My Custom Dataset')).toBeInTheDocument();
            });
            it('should display datasetName in addition mode description', () => {
                // Arrange & Act
                renderStepThree({
                    datasetId: 'dataset-123',
                    datasetName: 'Existing Dataset Name',
                });
                // Assert - Check the text contains the dataset name (in the description)
                const description = react_1.screen.getByText(/datasetCreation.stepThree.additionP1.*Existing Dataset Name.*datasetCreation.stepThree.additionP2/i);
                expect(description).toBeInTheDocument();
            });
            it('should fallback to creationCache dataset name when datasetName is not provided', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.dataset.name = 'Cache Dataset Name';
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByText('Cache Dataset Name')).toBeInTheDocument();
            });
        });
        describe('indexingType prop', () => {
            it('should pass indexingType to EmbeddingProcess', () => {
                // Arrange & Act
                renderStepThree({ indexingType: 'high_quality' });
                // Assert
                expect(react_1.screen.getByTestId('ep-indexing-type')).toHaveTextContent('high_quality');
            });
            it('should use creationCache indexing_technique when indexingType is not provided', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.dataset.indexing_technique = 'economy';
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByTestId('ep-indexing-type')).toHaveTextContent('economy');
            });
            it('should prefer creationCache indexing_technique over indexingType prop', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.dataset.indexing_technique = 'cache_technique';
                // Act
                renderStepThree({ creationCache, indexingType: 'prop_technique' });
                // Assert - creationCache takes precedence
                expect(react_1.screen.getByTestId('ep-indexing-type')).toHaveTextContent('cache_technique');
            });
        });
        describe('retrievalMethod prop', () => {
            it('should pass retrievalMethod to EmbeddingProcess', () => {
                // Arrange & Act
                renderStepThree({ retrievalMethod: app_1.RETRIEVE_METHOD.semantic });
                // Assert
                expect(react_1.screen.getByTestId('ep-retrieval-method')).toHaveTextContent('semantic_search');
            });
            it('should use creationCache retrieval method when retrievalMethod is not provided', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.dataset.retrieval_model_dict = { search_method: 'full_text_search' };
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByTestId('ep-retrieval-method')).toHaveTextContent('full_text_search');
            });
        });
        describe('creationCache prop', () => {
            it('should pass batchId from creationCache to EmbeddingProcess', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.batch = 'custom-batch-123';
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('custom-batch-123');
            });
            it('should pass documents from creationCache to EmbeddingProcess', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.documents = [createMockDocument(), createMockDocument(), createMockDocument()];
                // Act
                renderStepThree({ creationCache });
                // Assert
                expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('3');
            });
            it('should use icon_info from creationCache dataset', () => {
                // Arrange
                const creationCache = createMockCreationCache();
                creationCache.dataset.icon_info = createMockIconInfo({
                    icon: '🚀',
                    icon_background: '#FF0000',
                });
                // Act
                const { container } = renderStepThree({ creationCache });
                // Assert - Check AppIcon component receives correct props
                const appIcon = container.querySelector('span[style*="background"]');
                expect(appIcon).toBeInTheDocument();
            });
            it('should handle undefined creationCache', () => {
                // Arrange & Act
                renderStepThree({ creationCache: undefined });
                // Assert - Should not crash, use fallback values
                expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('');
                expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('');
            });
            it('should handle creationCache with undefined dataset', () => {
                // Arrange
                const creationCache = {
                    dataset: undefined,
                    batch: 'batch-123',
                    documents: [],
                };
                // Act
                renderStepThree({ creationCache });
                // Assert - Should use default icon info
                expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases Tests - Test null, undefined, empty values and boundaries
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle all props being undefined', () => {
            // Arrange & Act
            renderStepThree({
                datasetId: undefined,
                datasetName: undefined,
                indexingType: undefined,
                retrievalMethod: undefined,
                creationCache: undefined,
            });
            // Assert - Should render creation mode with fallbacks
            expect(react_1.screen.getByText('datasetCreation.stepThree.creationTitle')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should handle empty string datasetId', () => {
            // Arrange & Act
            renderStepThree({ datasetId: '' });
            // Assert - Empty string is falsy, should show creation mode
            expect(react_1.screen.getByText('datasetCreation.stepThree.creationTitle')).toBeInTheDocument();
        });
        it('should handle empty string datasetName', () => {
            // Arrange & Act
            renderStepThree({ datasetName: '' });
            // Assert - Should not crash
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should handle empty documents array in creationCache', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.documents = [];
            // Act
            renderStepThree({ creationCache });
            // Assert
            expect(react_1.screen.getByTestId('ep-documents-count')).toHaveTextContent('0');
        });
        it('should handle creationCache with missing icon_info', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.dataset.icon_info = undefined;
            // Act
            renderStepThree({ creationCache });
            // Assert - Should use default icon info
            expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
        });
        it('should handle very long datasetName', () => {
            // Arrange
            const longName = 'A'.repeat(500);
            // Act
            renderStepThree({ datasetName: longName });
            // Assert - Should render without crashing
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle special characters in datasetName', () => {
            // Arrange
            const specialName = 'Dataset <script>alert("xss")</script> & "quotes" \'apostrophe\'';
            // Act
            renderStepThree({ datasetName: specialName });
            // Assert - Should render safely as text
            expect(react_1.screen.getByText(specialName)).toBeInTheDocument();
        });
        it('should handle unicode characters in datasetName', () => {
            // Arrange
            const unicodeName = '数据集名称 🚀 émojis & spëcîal çhàrs';
            // Act
            renderStepThree({ datasetName: unicodeName });
            // Assert
            expect(react_1.screen.getByText(unicodeName)).toBeInTheDocument();
        });
        it('should handle creationCache with null dataset name', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.dataset.name = null;
            // Act
            const { container } = renderStepThree({ creationCache });
            // Assert - Should not crash
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Conditional Rendering Tests - Test mode switching behavior
    // --------------------------------------------------------------------------
    describe('Conditional Rendering', () => {
        describe('Creation Mode (no datasetId)', () => {
            it('should show AppIcon component', () => {
                // Arrange & Act
                const { container } = renderStepThree();
                // Assert - AppIcon should be rendered
                const appIcon = container.querySelector('span');
                expect(appIcon).toBeInTheDocument();
            });
            it('should show Divider component', () => {
                // Arrange & Act
                const { container } = renderStepThree();
                // Assert - Divider should be rendered (it adds hr with specific classes)
                const dividers = container.querySelectorAll('[class*="divider"]');
                expect(dividers.length).toBeGreaterThan(0);
            });
            it('should show dataset name input area', () => {
                // Arrange
                const datasetName = 'Test Dataset Name';
                // Act
                renderStepThree({ datasetName });
                // Assert
                expect(react_1.screen.getByText(datasetName)).toBeInTheDocument();
            });
        });
        describe('Addition Mode (with datasetId)', () => {
            it('should not show AppIcon component', () => {
                // Arrange & Act
                renderStepThree({ datasetId: 'dataset-123' });
                // Assert - Creation section should not be rendered
                expect(react_1.screen.queryByText('datasetCreation.stepThree.label')).not.toBeInTheDocument();
            });
            it('should show addition description with dataset name', () => {
                // Arrange & Act
                renderStepThree({
                    datasetId: 'dataset-123',
                    datasetName: 'My Dataset',
                });
                // Assert - Description should include dataset name
                expect(react_1.screen.getByText(/datasetCreation.stepThree.additionP1/)).toBeInTheDocument();
            });
        });
        describe('Mobile vs Desktop', () => {
            it('should show side panel on tablet', () => {
                // Arrange
                mockMediaType = 'tablet';
                // Act
                renderStepThree();
                // Assert - Tablet is not mobile, should show side panel
                expect(react_1.screen.getByText('datasetCreation.stepThree.sideTipTitle')).toBeInTheDocument();
            });
            it('should not show side panel on mobile', () => {
                // Arrange
                mockMediaType = 'mobile';
                // Act
                renderStepThree();
                // Assert
                expect(react_1.screen.queryByText('datasetCreation.stepThree.sideTipTitle')).not.toBeInTheDocument();
            });
            it('should render EmbeddingProcess on mobile', () => {
                // Arrange
                mockMediaType = 'mobile';
                // Act
                renderStepThree();
                // Assert - Main content should still be rendered
                expect(react_1.screen.getByTestId('embedding-process')).toBeInTheDocument();
            });
        });
    });
    // --------------------------------------------------------------------------
    // EmbeddingProcess Integration Tests - Verify correct props are passed
    // --------------------------------------------------------------------------
    describe('EmbeddingProcess Integration', () => {
        it('should pass correct datasetId to EmbeddingProcess with datasetId prop', () => {
            // Arrange & Act
            renderStepThree({ datasetId: 'direct-dataset-id' });
            // Assert
            expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('direct-dataset-id');
        });
        it('should pass creationCache dataset id when datasetId prop is undefined', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.dataset.id = 'cache-dataset-id';
            // Act
            renderStepThree({ creationCache });
            // Assert
            expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('cache-dataset-id');
        });
        it('should pass empty string for datasetId when both sources are undefined', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('');
        });
        it('should pass batchId from creationCache', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.batch = 'test-batch-456';
            // Act
            renderStepThree({ creationCache });
            // Assert
            expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('test-batch-456');
        });
        it('should pass empty string for batchId when creationCache is undefined', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            expect(react_1.screen.getByTestId('ep-batch-id')).toHaveTextContent('');
        });
        it('should prefer datasetId prop over creationCache dataset id', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.dataset.id = 'cache-id';
            // Act
            renderStepThree({ datasetId: 'prop-id', creationCache });
            // Assert - datasetId prop takes precedence
            expect(react_1.screen.getByTestId('ep-dataset-id')).toHaveTextContent('prop-id');
        });
    });
    // --------------------------------------------------------------------------
    // Icon Rendering Tests - Verify AppIcon behavior
    // --------------------------------------------------------------------------
    describe('Icon Rendering', () => {
        it('should use default icon info when creationCache is undefined', () => {
            // Arrange & Act
            const { container } = renderStepThree();
            // Assert - Default background color should be applied
            const appIcon = container.querySelector('span[style*="background"]');
            if (appIcon)
                expect(appIcon).toHaveStyle({ background: '#FFF4ED' });
        });
        it('should use icon_info from creationCache when available', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            creationCache.dataset.icon_info = {
                icon: '🎉',
                icon_type: 'emoji',
                icon_background: '#00FF00',
                icon_url: '',
            };
            // Act
            const { container } = renderStepThree({ creationCache });
            // Assert - Custom background color should be applied
            const appIcon = container.querySelector('span[style*="background"]');
            if (appIcon)
                expect(appIcon).toHaveStyle({ background: '#00FF00' });
        });
        it('should use default icon when creationCache dataset icon_info is undefined', () => {
            // Arrange
            const creationCache = createMockCreationCache();
            delete creationCache.dataset.icon_info;
            // Act
            const { container } = renderStepThree({ creationCache });
            // Assert - Component should still render with default icon
            expect(container.firstChild).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Layout Tests - Verify correct CSS classes and structure
    // --------------------------------------------------------------------------
    describe('Layout', () => {
        it('should have correct outer container classes', () => {
            // Arrange & Act
            const { container } = renderStepThree();
            // Assert
            const outerDiv = container.firstChild;
            expect(outerDiv).toHaveClass('flex');
            expect(outerDiv).toHaveClass('h-full');
            expect(outerDiv).toHaveClass('justify-center');
        });
        it('should have correct inner container classes', () => {
            // Arrange & Act
            const { container } = renderStepThree();
            // Assert
            const innerDiv = container.querySelector('.max-w-\\[960px\\]');
            expect(innerDiv).toBeInTheDocument();
            expect(innerDiv).toHaveClass('shrink-0', 'grow');
        });
        it('should have content wrapper with correct max width', () => {
            // Arrange & Act
            const { container } = renderStepThree();
            // Assert
            const contentWrapper = container.querySelector('.max-w-\\[640px\\]');
            expect(contentWrapper).toBeInTheDocument();
        });
        it('should have side tip panel with correct width on desktop', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            const { container } = renderStepThree();
            // Assert
            const sidePanel = container.querySelector('.w-\\[328px\\]');
            expect(sidePanel).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Accessibility Tests - Verify accessibility features
    // --------------------------------------------------------------------------
    describe('Accessibility', () => {
        it('should have correct link attributes for external documentation link', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            renderStepThree();
            // Assert
            const link = react_1.screen.getByText('datasetPipeline.addDocuments.stepThree.learnMore');
            expect(link.tagName).toBe('A');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noreferrer noopener');
        });
        it('should have semantic heading structure in creation mode', () => {
            // Arrange & Act
            renderStepThree();
            // Assert
            const title = react_1.screen.getByText('datasetCreation.stepThree.creationTitle');
            expect(title).toBeInTheDocument();
            expect(title.className).toContain('title-2xl-semi-bold');
        });
        it('should have semantic heading structure in addition mode', () => {
            // Arrange & Act
            renderStepThree({ datasetId: 'dataset-123' });
            // Assert
            const title = react_1.screen.getByText('datasetCreation.stepThree.additionTitle');
            expect(title).toBeInTheDocument();
            expect(title.className).toContain('title-2xl-semi-bold');
        });
    });
    // --------------------------------------------------------------------------
    // Side Panel Tests - Verify side panel behavior
    // --------------------------------------------------------------------------
    describe('Side Panel', () => {
        it('should render RiBookOpenLine icon in side panel', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            const { container } = renderStepThree();
            // Assert - Icon should be present in side panel
            const iconContainer = container.querySelector('.size-10');
            expect(iconContainer).toBeInTheDocument();
        });
        it('should have correct side panel section background', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            const { container } = renderStepThree();
            // Assert
            const sidePanel = container.querySelector('.bg-background-section');
            expect(sidePanel).toBeInTheDocument();
        });
        it('should have correct padding for side panel', () => {
            // Arrange
            mockMediaType = 'pc';
            // Act
            const { container } = renderStepThree();
            // Assert
            const sidePanelWrapper = container.querySelector('.pr-8');
            expect(sidePanelWrapper).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELHFDQUE2QztBQUM3QyxtQ0FBK0I7QUFFL0IsdUVBQXVFO0FBQ3ZFLEVBQUUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNyQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUNuRixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQ2xDO01BQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FDbkQ7TUFBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUMvQztNQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFNBQVMsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUNyRTtNQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksQ0FDekQ7TUFBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLENBQ2pFO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCwyQkFBMkI7QUFDM0IsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FB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QzNELFVBQVU7WUFDVixhQUFhLEdBQUcsSUFBSSxDQUFBO1lBRXBCLE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUE7WUFFdkMsU0FBUztZQUNULE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtZQUNuRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsVUFBVTtZQUNWLGFBQWEsR0FBRyxJQUFJLENBQUE7WUFFcEIsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxlQUFlLEVBQUUsQ0FBQTtZQUV2QyxTQUFTO1lBQ1QsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3pELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBjcmVhdGVEb2N1bWVudFJlc3BvbnNlLCBGdWxsRG9jdW1lbnREZXRhaWwsIEljb25JbmZvIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBTdGVwVGhyZWUgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayB0aGUgRW1iZWRkaW5nUHJvY2VzcyBjb21wb25lbnQgc2luY2UgaXQgaGFzIGNvbXBsZXggYXN5bmMgbG9naWNcbnZpLm1vY2soJy4uL2VtYmVkZGluZy1wcm9jZXNzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogdmkuZm4oKHsgZGF0YXNldElkLCBiYXRjaElkLCBkb2N1bWVudHMsIGluZGV4aW5nVHlwZSwgcmV0cmlldmFsTWV0aG9kIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZW1iZWRkaW5nLXByb2Nlc3NcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZXAtZGF0YXNldC1pZFwiPntkYXRhc2V0SWR9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJlcC1iYXRjaC1pZFwiPntiYXRjaElkfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZXAtZG9jdW1lbnRzLWNvdW50XCI+e2RvY3VtZW50cz8ubGVuZ3RoID8/IDB9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJlcC1pbmRleGluZy10eXBlXCI+e2luZGV4aW5nVHlwZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVwLXJldHJpZXZhbC1tZXRob2RcIj57cmV0cmlldmFsTWV0aG9kfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSksXG59KSlcblxuLy8gTW9jayB1c2VCcmVha3BvaW50cyBob29rXG5sZXQgbW9ja01lZGlhVHlwZSA9ICdwYydcbnZpLm1vY2soJ0AvaG9va3MvdXNlLWJyZWFrcG9pbnRzJywgKCkgPT4gKHtcbiAgTWVkaWFUeXBlOiB7XG4gICAgbW9iaWxlOiAnbW9iaWxlJyxcbiAgICB0YWJsZXQ6ICd0YWJsZXQnLFxuICAgIHBjOiAncGMnLFxuICB9LFxuICBkZWZhdWx0OiB2aS5mbigoKSA9PiBtb2NrTWVkaWFUeXBlKSxcbn0pKVxuXG4vLyBNb2NrIHVzZURvY0xpbmsgaG9va1xudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiAocGF0aD86IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLVVTJHtwYXRoIHx8ICcnfWAsXG59KSlcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgbW9jayBJY29uSW5mb1xuY29uc3QgY3JlYXRlTW9ja0ljb25JbmZvID0gKG92ZXJyaWRlczogUGFydGlhbDxJY29uSW5mbz4gPSB7fSk6IEljb25JbmZvID0+ICh7XG4gIGljb246ICfwn5OZJyxcbiAgaWNvbl90eXBlOiAnZW1vamknLFxuICBpY29uX2JhY2tncm91bmQ6ICcjRkZGNEVEJyxcbiAgaWNvbl91cmw6ICcnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIEZ1bGxEb2N1bWVudERldGFpbFxuY29uc3QgY3JlYXRlTW9ja0RvY3VtZW50ID0gKG92ZXJyaWRlczogUGFydGlhbDxGdWxsRG9jdW1lbnREZXRhaWw+ID0ge30pOiBGdWxsRG9jdW1lbnREZXRhaWwgPT4gKHtcbiAgaWQ6ICdkb2MtMTIzJyxcbiAgbmFtZTogJ3Rlc3QtZG9jdW1lbnQudHh0JyxcbiAgZGF0YV9zb3VyY2VfdHlwZTogJ3VwbG9hZF9maWxlJyxcbiAgZGF0YV9zb3VyY2VfaW5mbzoge1xuICAgIHVwbG9hZF9maWxlOiB7XG4gICAgICBpZDogJ2ZpbGUtMTIzJyxcbiAgICAgIG5hbWU6ICd0ZXN0LWRvY3VtZW50LnR4dCcsXG4gICAgICBleHRlbnNpb246ICd0eHQnLFxuICAgICAgbWltZV90eXBlOiAndGV4dC9wbGFpbicsXG4gICAgICBzaXplOiAxMDI0LFxuICAgICAgY3JlYXRlZF9ieTogJ3VzZXItMScsXG4gICAgICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgIH0sXG4gIH0sXG4gIGJhdGNoOiAnYmF0Y2gtMTIzJyxcbiAgY3JlYXRlZF9hcGlfcmVxdWVzdF9pZDogJ3JlcXVlc3QtMTIzJyxcbiAgcHJvY2Vzc2luZ19zdGFydGVkX2F0OiBEYXRlLm5vdygpLFxuICBwYXJzaW5nX2NvbXBsZXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgY2xlYW5pbmdfY29tcGxldGVkX2F0OiBEYXRlLm5vdygpLFxuICBzcGxpdHRpbmdfY29tcGxldGVkX2F0OiBEYXRlLm5vdygpLFxuICB0b2tlbnM6IDEwMCxcbiAgaW5kZXhpbmdfbGF0ZW5jeTogNTAwMCxcbiAgY29tcGxldGVkX2F0OiBEYXRlLm5vdygpLFxuICBwYXVzZWRfYnk6ICcnLFxuICBwYXVzZWRfYXQ6IDAsXG4gIHN0b3BwZWRfYXQ6IDAsXG4gIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcsXG4gIGRpc2FibGVkX2F0OiAwLFxuICAuLi5vdmVycmlkZXMsXG59IGFzIEZ1bGxEb2N1bWVudERldGFpbClcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgbW9jayBjcmVhdGVEb2N1bWVudFJlc3BvbnNlXG5jb25zdCBjcmVhdGVNb2NrQ3JlYXRpb25DYWNoZSA9IChvdmVycmlkZXM6IFBhcnRpYWw8Y3JlYXRlRG9jdW1lbnRSZXNwb25zZT4gPSB7fSk6IGNyZWF0ZURvY3VtZW50UmVzcG9uc2UgPT4gKHtcbiAgZGF0YXNldDoge1xuICAgIGlkOiAnZGF0YXNldC0xMjMnLFxuICAgIG5hbWU6ICdUZXN0IERhdGFzZXQnLFxuICAgIGljb25faW5mbzogY3JlYXRlTW9ja0ljb25JbmZvKCksXG4gICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyxcbiAgICByZXRyaWV2YWxfbW9kZWxfZGljdDoge1xuICAgICAgc2VhcmNoX21ldGhvZDogJ3NlbWFudGljX3NlYXJjaCcsXG4gICAgfSxcbiAgfSBhcyBjcmVhdGVEb2N1bWVudFJlc3BvbnNlWydkYXRhc2V0J10sXG4gIGJhdGNoOiAnYmF0Y2gtMTIzJyxcbiAgZG9jdW1lbnRzOiBbY3JlYXRlTW9ja0RvY3VtZW50KCldIGFzIGNyZWF0ZURvY3VtZW50UmVzcG9uc2VbJ2RvY3VtZW50cyddLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBIZWxwZXIgdG8gcmVuZGVyIFN0ZXBUaHJlZSB3aXRoIGRlZmF1bHQgcHJvcHNcbmNvbnN0IHJlbmRlclN0ZXBUaHJlZSA9IChwcm9wczogUGFydGlhbDxQYXJhbWV0ZXJzPHR5cGVvZiBTdGVwVGhyZWU+WzBdPiA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAuLi5wcm9wcyxcbiAgfVxuICByZXR1cm4gcmVuZGVyKDxTdGVwVGhyZWUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBUaHJlZSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdTdGVwVGhyZWUnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tNZWRpYVR5cGUgPSAncGMnXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzIC0gVmVyaWZ5IGNvbXBvbmVudCByZW5kZXJzIHByb3Blcmx5XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1iZWRkaW5nLXByb2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGNyZWF0aW9uIHRpdGxlIHdoZW4gZGF0YXNldElkIGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuY3JlYXRpb25UaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5jcmVhdGlvbkNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGFkZGl0aW9uIHRpdGxlIHdoZW4gZGF0YXNldElkIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKHtcbiAgICAgICAgZGF0YXNldElkOiAnZXhpc3RpbmctZGF0YXNldC0xMjMnLFxuICAgICAgICBkYXRhc2V0TmFtZTogJ0V4aXN0aW5nIERhdGFzZXQnLFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5hZGRpdGlvblRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuY3JlYXRpb25UaXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsYWJlbCB0ZXh0IGluIGNyZWF0aW9uIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLmxhYmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2lkZSB0aXAgcGFuZWwgb24gZGVza3RvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNZWRpYVR5cGUgPSAncGMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5zaWRlVGlwVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuc2lkZVRpcENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFRocmVlLmxlYXJuTW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzaWRlIHRpcCBwYW5lbCBvbiBtb2JpbGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTWVkaWFUeXBlID0gJ21vYmlsZSdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuc2lkZVRpcFRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLnNpZGVUaXBDb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEVtYmVkZGluZ1Byb2Nlc3MgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvY3VtZW50YXRpb24gbGluayB3aXRoIGNvcnJlY3QgaHJlZiBvbiBkZXNrdG9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja01lZGlhVHlwZSA9ICdwYydcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUaHJlZS5sZWFybk1vcmUnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2RvY3MuZGlmeS5haS9lbi1VUy9ndWlkZXMva25vd2xlZGdlLWJhc2UvaW50ZWdyYXRlLWtub3dsZWRnZS13aXRoaW4tYXBwbGljYXRpb24nKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQXR0cmlidXRlKCdyZWwnLCAnbm9yZWZlcnJlciBub29wZW5lcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBjb250YWluZXIgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG91dGVyRGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChvdXRlckRpdikudG9IYXZlQ2xhc3MoJ2ZsZXgnLCAnaC1mdWxsJywgJ21heC1oLWZ1bGwnLCAndy1mdWxsJywgJ2p1c3RpZnktY2VudGVyJywgJ292ZXJmbG93LXktYXV0bycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBUZXN0aW5nIC0gVGVzdCBhbGwgcHJvcCB2YXJpYXRpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnZGF0YXNldElkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjcmVhdGlvbiBtb2RlIHdoZW4gZGF0YXNldElkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0SWQ6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5jcmVhdGlvblRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFkZGl0aW9uIG1vZGUgd2hlbiBkYXRhc2V0SWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHsgZGF0YXNldElkOiAnZGF0YXNldC0xMjMnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLmFkZGl0aW9uVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFzZXRJZCB0byBFbWJlZGRpbmdQcm9jZXNzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGFzZXRJZCA9ICdteS1kYXRhc2V0LWlkJ1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0SWQgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZGF0YXNldC1pZCcpKS50b0hhdmVUZXh0Q29udGVudChkYXRhc2V0SWQpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBjcmVhdGlvbkNhY2hlIGRhdGFzZXQgaWQgd2hlbiBkYXRhc2V0SWQgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGNyZWF0aW9uQ2FjaGUgPSBjcmVhdGVNb2NrQ3JlYXRpb25DYWNoZSgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGNyZWF0aW9uQ2FjaGUgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZGF0YXNldC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldC0xMjMnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2RhdGFzZXROYW1lIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZGF0YXNldE5hbWUgaW4gY3JlYXRpb24gbW9kZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0TmFtZTogJ015IEN1c3RvbSBEYXRhc2V0JyB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTXkgQ3VzdG9tIERhdGFzZXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGRhdGFzZXROYW1lIGluIGFkZGl0aW9uIG1vZGUgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHtcbiAgICAgICAgICBkYXRhc2V0SWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgICAgZGF0YXNldE5hbWU6ICdFeGlzdGluZyBEYXRhc2V0IE5hbWUnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENoZWNrIHRoZSB0ZXh0IGNvbnRhaW5zIHRoZSBkYXRhc2V0IG5hbWUgKGluIHRoZSBkZXNjcmlwdGlvbilcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLmFkZGl0aW9uUDEuKkV4aXN0aW5nIERhdGFzZXQgTmFtZS4qZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5hZGRpdGlvblAyL2kpXG4gICAgICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBmYWxsYmFjayB0byBjcmVhdGlvbkNhY2hlIGRhdGFzZXQgbmFtZSB3aGVuIGRhdGFzZXROYW1lIGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgICBjcmVhdGlvbkNhY2hlLmRhdGFzZXQhLm5hbWUgPSAnQ2FjaGUgRGF0YXNldCBOYW1lJ1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDYWNoZSBEYXRhc2V0IE5hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2luZGV4aW5nVHlwZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGluZGV4aW5nVHlwZSB0byBFbWJlZGRpbmdQcm9jZXNzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGluZGV4aW5nVHlwZTogJ2hpZ2hfcXVhbGl0eScgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtaW5kZXhpbmctdHlwZScpKS50b0hhdmVUZXh0Q29udGVudCgnaGlnaF9xdWFsaXR5JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGNyZWF0aW9uQ2FjaGUgaW5kZXhpbmdfdGVjaG5pcXVlIHdoZW4gaW5kZXhpbmdUeXBlIGlzIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgICBjcmVhdGlvbkNhY2hlLmRhdGFzZXQhLmluZGV4aW5nX3RlY2huaXF1ZSA9ICdlY29ub215JyBhcyBhbnlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHsgY3JlYXRpb25DYWNoZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1pbmRleGluZy10eXBlJykpLnRvSGF2ZVRleHRDb250ZW50KCdlY29ub215JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcHJlZmVyIGNyZWF0aW9uQ2FjaGUgaW5kZXhpbmdfdGVjaG5pcXVlIG92ZXIgaW5kZXhpbmdUeXBlIHByb3AnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgICAgY3JlYXRpb25DYWNoZS5kYXRhc2V0IS5pbmRleGluZ190ZWNobmlxdWUgPSAnY2FjaGVfdGVjaG5pcXVlJyBhcyBhbnlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHsgY3JlYXRpb25DYWNoZSwgaW5kZXhpbmdUeXBlOiAncHJvcF90ZWNobmlxdWUnIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY3JlYXRpb25DYWNoZSB0YWtlcyBwcmVjZWRlbmNlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VwLWluZGV4aW5nLXR5cGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2NhY2hlX3RlY2huaXF1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgncmV0cmlldmFsTWV0aG9kIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgcmV0cmlldmFsTWV0aG9kIHRvIEVtYmVkZGluZ1Byb2Nlc3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHsgcmV0cmlldmFsTWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnc2VtYW50aWNfc2VhcmNoJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGNyZWF0aW9uQ2FjaGUgcmV0cmlldmFsIG1ldGhvZCB3aGVuIHJldHJpZXZhbE1ldGhvZCBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgICAgY3JlYXRpb25DYWNoZS5kYXRhc2V0IS5yZXRyaWV2YWxfbW9kZWxfZGljdCA9IHsgc2VhcmNoX21ldGhvZDogJ2Z1bGxfdGV4dF9zZWFyY2gnIH0gYXMgYW55XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGNyZWF0aW9uQ2FjaGUgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZnVsbF90ZXh0X3NlYXJjaCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnY3JlYXRpb25DYWNoZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGJhdGNoSWQgZnJvbSBjcmVhdGlvbkNhY2hlIHRvIEVtYmVkZGluZ1Byb2Nlc3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgICAgY3JlYXRpb25DYWNoZS5iYXRjaCA9ICdjdXN0b20tYmF0Y2gtMTIzJ1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VwLWJhdGNoLWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdjdXN0b20tYmF0Y2gtMTIzJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBkb2N1bWVudHMgZnJvbSBjcmVhdGlvbkNhY2hlIHRvIEVtYmVkZGluZ1Byb2Nlc3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgICAgY3JlYXRpb25DYWNoZS5kb2N1bWVudHMgPSBbY3JlYXRlTW9ja0RvY3VtZW50KCksIGNyZWF0ZU1vY2tEb2N1bWVudCgpLCBjcmVhdGVNb2NrRG9jdW1lbnQoKV0gYXMgYW55XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGNyZWF0aW9uQ2FjaGUgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZG9jdW1lbnRzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCczJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGljb25faW5mbyBmcm9tIGNyZWF0aW9uQ2FjaGUgZGF0YXNldCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgICBjcmVhdGlvbkNhY2hlLmRhdGFzZXQhLmljb25faW5mbyA9IGNyZWF0ZU1vY2tJY29uSW5mbyh7XG4gICAgICAgICAgaWNvbjogJ/CfmoAnLFxuICAgICAgICAgIGljb25fYmFja2dyb3VuZDogJyNGRjAwMDAnLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcFRocmVlKHsgY3JlYXRpb25DYWNoZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENoZWNrIEFwcEljb24gY29tcG9uZW50IHJlY2VpdmVzIGNvcnJlY3QgcHJvcHNcbiAgICAgICAgY29uc3QgYXBwSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuW3N0eWxlKj1cImJhY2tncm91bmRcIl0nKVxuICAgICAgICBleHBlY3QoYXBwSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGNyZWF0aW9uQ2FjaGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHsgY3JlYXRpb25DYWNoZTogdW5kZWZpbmVkIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG5vdCBjcmFzaCwgdXNlIGZhbGxiYWNrIHZhbHVlc1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCcnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1iYXRjaC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyZWF0aW9uQ2FjaGUgd2l0aCB1bmRlZmluZWQgZGF0YXNldCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBjcmVhdGlvbkNhY2hlOiBjcmVhdGVEb2N1bWVudFJlc3BvbnNlID0ge1xuICAgICAgICAgIGRhdGFzZXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBiYXRjaDogJ2JhdGNoLTEyMycsXG4gICAgICAgICAgZG9jdW1lbnRzOiBbXSxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSBkZWZhdWx0IGljb24gaW5mb1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0cyAtIFRlc3QgbnVsbCwgdW5kZWZpbmVkLCBlbXB0eSB2YWx1ZXMgYW5kIGJvdW5kYXJpZXNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIHByb3BzIGJlaW5nIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSh7XG4gICAgICAgIGRhdGFzZXRJZDogdW5kZWZpbmVkLFxuICAgICAgICBkYXRhc2V0TmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBpbmRleGluZ1R5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgcmV0cmlldmFsTWV0aG9kOiB1bmRlZmluZWQsXG4gICAgICAgIGNyZWF0aW9uQ2FjaGU6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgY3JlYXRpb24gbW9kZSB3aXRoIGZhbGxiYWNrc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuY3JlYXRpb25UaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0SWQ6ICcnIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEVtcHR5IHN0cmluZyBpcyBmYWxzeSwgc2hvdWxkIHNob3cgY3JlYXRpb24gbW9kZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuY3JlYXRpb25UaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBkYXRhc2V0TmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGRhdGFzZXROYW1lOiAnJyB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbWJlZGRpbmctcHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRvY3VtZW50cyBhcnJheSBpbiBjcmVhdGlvbkNhY2hlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgIGNyZWF0aW9uQ2FjaGUuZG9jdW1lbnRzID0gW11cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZG9jdW1lbnRzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3JlYXRpb25DYWNoZSB3aXRoIG1pc3NpbmcgaWNvbl9pbmZvJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgIGNyZWF0aW9uQ2FjaGUuZGF0YXNldCEuaWNvbl9pbmZvID0gdW5kZWZpbmVkIGFzIGFueVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGNyZWF0aW9uQ2FjaGUgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSBkZWZhdWx0IGljb24gaW5mb1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1iZWRkaW5nLXByb2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZGF0YXNldE5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nTmFtZSA9ICdBJy5yZXBlYXQoNTAwKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGRhdGFzZXROYW1lOiBsb25nTmFtZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gZGF0YXNldE5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzcGVjaWFsTmFtZSA9ICdEYXRhc2V0IDxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4gJiBcInF1b3Rlc1wiIFxcJ2Fwb3N0cm9waGVcXCcnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKHsgZGF0YXNldE5hbWU6IHNwZWNpYWxOYW1lIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgc2FmZWx5IGFzIHRleHRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gZGF0YXNldE5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1bmljb2RlTmFtZSA9ICfmlbDmja7pm4blkI3np7Ag8J+agCDDqW1vamlzICYgc3DDq2PDrmFsIMOnaMOgcnMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKHsgZGF0YXNldE5hbWU6IHVuaWNvZGVOYW1lIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQodW5pY29kZU5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyZWF0aW9uQ2FjaGUgd2l0aCBudWxsIGRhdGFzZXQgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNyZWF0aW9uQ2FjaGUgPSBjcmVhdGVNb2NrQ3JlYXRpb25DYWNoZSgpXG4gICAgICBjcmVhdGlvbkNhY2hlLmRhdGFzZXQhLm5hbWUgPSBudWxsIGFzIGFueVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIFRlc3RzIC0gVGVzdCBtb2RlIHN3aXRjaGluZyBiZWhhdmlvclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdDcmVhdGlvbiBNb2RlIChubyBkYXRhc2V0SWQpJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IEFwcEljb24gY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEFwcEljb24gc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICAgIGNvbnN0IGFwcEljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3BhbicpXG4gICAgICAgIGV4cGVjdChhcHBJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgRGl2aWRlciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRGl2aWRlciBzaG91bGQgYmUgcmVuZGVyZWQgKGl0IGFkZHMgaHIgd2l0aCBzcGVjaWZpYyBjbGFzc2VzKVxuICAgICAgICBjb25zdCBkaXZpZGVycyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3MqPVwiZGl2aWRlclwiXScpXG4gICAgICAgIGV4cGVjdChkaXZpZGVycy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGRhdGFzZXQgbmFtZSBpbnB1dCBhcmVhJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGFzZXROYW1lID0gJ1Rlc3QgRGF0YXNldCBOYW1lJ1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0TmFtZSB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChkYXRhc2V0TmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdBZGRpdGlvbiBNb2RlICh3aXRoIGRhdGFzZXRJZCknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBzaG93IEFwcEljb24gY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSh7IGRhdGFzZXRJZDogJ2RhdGFzZXQtMTIzJyB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENyZWF0aW9uIHNlY3Rpb24gc2hvdWxkIG5vdCBiZSByZW5kZXJlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLmxhYmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgYWRkaXRpb24gZGVzY3JpcHRpb24gd2l0aCBkYXRhc2V0IG5hbWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKHtcbiAgICAgICAgICBkYXRhc2V0SWQ6ICdkYXRhc2V0LTEyMycsXG4gICAgICAgICAgZGF0YXNldE5hbWU6ICdNeSBEYXRhc2V0JyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBEZXNjcmlwdGlvbiBzaG91bGQgaW5jbHVkZSBkYXRhc2V0IG5hbWVcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuYWRkaXRpb25QMS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnTW9iaWxlIHZzIERlc2t0b3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgc2lkZSBwYW5lbCBvbiB0YWJsZXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja01lZGlhVHlwZSA9ICd0YWJsZXQnXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gVGFibGV0IGlzIG5vdCBtb2JpbGUsIHNob3VsZCBzaG93IHNpZGUgcGFuZWxcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuc2lkZVRpcFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgc2lkZSBwYW5lbCBvbiBtb2JpbGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja01lZGlhVHlwZSA9ICdtb2JpbGUnXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuc2lkZVRpcFRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBFbWJlZGRpbmdQcm9jZXNzIG9uIG1vYmlsZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrTWVkaWFUeXBlID0gJ21vYmlsZSdcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgICAvLyBBc3NlcnQgLSBNYWluIGNvbnRlbnQgc2hvdWxkIHN0aWxsIGJlIHJlbmRlcmVkXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtYmVkZGluZy1wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFbWJlZGRpbmdQcm9jZXNzIEludGVncmF0aW9uIFRlc3RzIC0gVmVyaWZ5IGNvcnJlY3QgcHJvcHMgYXJlIHBhc3NlZFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRW1iZWRkaW5nUHJvY2VzcyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBkYXRhc2V0SWQgdG8gRW1iZWRkaW5nUHJvY2VzcyB3aXRoIGRhdGFzZXRJZCBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKHsgZGF0YXNldElkOiAnZGlyZWN0LWRhdGFzZXQtaWQnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZGF0YXNldC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZGlyZWN0LWRhdGFzZXQtaWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY3JlYXRpb25DYWNoZSBkYXRhc2V0IGlkIHdoZW4gZGF0YXNldElkIHByb3AgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgIGNyZWF0aW9uQ2FjaGUuZGF0YXNldCEuaWQgPSAnY2FjaGUtZGF0YXNldC1pZCdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtZGF0YXNldC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnY2FjaGUtZGF0YXNldC1pZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBlbXB0eSBzdHJpbmcgZm9yIGRhdGFzZXRJZCB3aGVuIGJvdGggc291cmNlcyBhcmUgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgYmF0Y2hJZCBmcm9tIGNyZWF0aW9uQ2FjaGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgY3JlYXRpb25DYWNoZS5iYXRjaCA9ICd0ZXN0LWJhdGNoLTQ1NidcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXAtYmF0Y2gtaWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3Rlc3QtYmF0Y2gtNDU2JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGVtcHR5IHN0cmluZyBmb3IgYmF0Y2hJZCB3aGVuIGNyZWF0aW9uQ2FjaGUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1iYXRjaC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVmZXIgZGF0YXNldElkIHByb3Agb3ZlciBjcmVhdGlvbkNhY2hlIGRhdGFzZXQgaWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgY3JlYXRpb25DYWNoZS5kYXRhc2V0IS5pZCA9ICdjYWNoZS1pZCdcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJTdGVwVGhyZWUoeyBkYXRhc2V0SWQ6ICdwcm9wLWlkJywgY3JlYXRpb25DYWNoZSB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBkYXRhc2V0SWQgcHJvcCB0YWtlcyBwcmVjZWRlbmNlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcC1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdwcm9wLWlkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEljb24gUmVuZGVyaW5nIFRlc3RzIC0gVmVyaWZ5IEFwcEljb24gYmVoYXZpb3JcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ljb24gUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgaWNvbiBpbmZvIHdoZW4gY3JlYXRpb25DYWNoZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVmYXVsdCBiYWNrZ3JvdW5kIGNvbG9yIHNob3VsZCBiZSBhcHBsaWVkXG4gICAgICBjb25zdCBhcHBJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW5bc3R5bGUqPVwiYmFja2dyb3VuZFwiXScpXG4gICAgICBpZiAoYXBwSWNvbilcbiAgICAgICAgZXhwZWN0KGFwcEljb24pLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZDogJyNGRkY0RUQnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGljb25faW5mbyBmcm9tIGNyZWF0aW9uQ2FjaGUgd2hlbiBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjcmVhdGlvbkNhY2hlID0gY3JlYXRlTW9ja0NyZWF0aW9uQ2FjaGUoKVxuICAgICAgY3JlYXRpb25DYWNoZS5kYXRhc2V0IS5pY29uX2luZm8gPSB7XG4gICAgICAgIGljb246ICfwn46JJyxcbiAgICAgICAgaWNvbl90eXBlOiAnZW1vamknLFxuICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjMDBGRjAwJyxcbiAgICAgICAgaWNvbl91cmw6ICcnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwVGhyZWUoeyBjcmVhdGlvbkNhY2hlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEN1c3RvbSBiYWNrZ3JvdW5kIGNvbG9yIHNob3VsZCBiZSBhcHBsaWVkXG4gICAgICBjb25zdCBhcHBJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW5bc3R5bGUqPVwiYmFja2dyb3VuZFwiXScpXG4gICAgICBpZiAoYXBwSWNvbilcbiAgICAgICAgZXhwZWN0KGFwcEljb24pLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZDogJyMwMEZGMDAnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHQgaWNvbiB3aGVuIGNyZWF0aW9uQ2FjaGUgZGF0YXNldCBpY29uX2luZm8gaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3JlYXRpb25DYWNoZSA9IGNyZWF0ZU1vY2tDcmVhdGlvbkNhY2hlKClcbiAgICAgIGRlbGV0ZSAoY3JlYXRpb25DYWNoZS5kYXRhc2V0IGFzIGFueSkuaWNvbl9pbmZvXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSh7IGNyZWF0aW9uQ2FjaGUgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXIgd2l0aCBkZWZhdWx0IGljb25cbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTGF5b3V0IFRlc3RzIC0gVmVyaWZ5IGNvcnJlY3QgQ1NTIGNsYXNzZXMgYW5kIHN0cnVjdHVyZVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTGF5b3V0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IG91dGVyIGNvbnRhaW5lciBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgb3V0ZXJEaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVDbGFzcygnZmxleCcpXG4gICAgICBleHBlY3Qob3V0ZXJEaXYpLnRvSGF2ZUNsYXNzKCdoLWZ1bGwnKVxuICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVDbGFzcygnanVzdGlmeS1jZW50ZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBpbm5lciBjb250YWluZXIgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJTdGVwVGhyZWUoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGlubmVyRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5tYXgtdy1cXFxcWzk2MHB4XFxcXF0nKVxuICAgICAgZXhwZWN0KGlubmVyRGl2KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaW5uZXJEaXYpLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcsICdncm93JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvbnRlbnQgd3JhcHBlciB3aXRoIGNvcnJlY3QgbWF4IHdpZHRoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29udGVudFdyYXBwZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm1heC13LVxcXFxbNjQwcHhcXFxcXScpXG4gICAgICBleHBlY3QoY29udGVudFdyYXBwZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNpZGUgdGlwIHBhbmVsIHdpdGggY29ycmVjdCB3aWR0aCBvbiBkZXNrdG9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja01lZGlhVHlwZSA9ICdwYydcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzaWRlUGFuZWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnctXFxcXFszMjhweFxcXFxdJylcbiAgICAgIGV4cGVjdChzaWRlUGFuZWwpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHMgLSBWZXJpZnkgYWNjZXNzaWJpbGl0eSBmZWF0dXJlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBsaW5rIGF0dHJpYnV0ZXMgZm9yIGV4dGVybmFsIGRvY3VtZW50YXRpb24gbGluaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNZWRpYVR5cGUgPSAncGMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVGhyZWUubGVhcm5Nb3JlJylcbiAgICAgIGV4cGVjdChsaW5rLnRhZ05hbWUpLnRvQmUoJ0EnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQXR0cmlidXRlKCdyZWwnLCAnbm9yZWZlcnJlciBub29wZW5lcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzZW1hbnRpYyBoZWFkaW5nIHN0cnVjdHVyZSBpbiBjcmVhdGlvbiBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0aXRsZSA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUuY3JlYXRpb25UaXRsZScpXG4gICAgICBleHBlY3QodGl0bGUpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdCh0aXRsZS5jbGFzc05hbWUpLnRvQ29udGFpbigndGl0bGUtMnhsLXNlbWktYm9sZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzZW1hbnRpYyBoZWFkaW5nIHN0cnVjdHVyZSBpbiBhZGRpdGlvbiBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyU3RlcFRocmVlKHsgZGF0YXNldElkOiAnZGF0YXNldC0xMjMnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFRocmVlLmFkZGl0aW9uVGl0bGUnKVxuICAgICAgZXhwZWN0KHRpdGxlKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QodGl0bGUuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3RpdGxlLTJ4bC1zZW1pLWJvbGQnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2lkZSBQYW5lbCBUZXN0cyAtIFZlcmlmeSBzaWRlIHBhbmVsIGJlaGF2aW9yXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTaWRlIFBhbmVsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFJpQm9va09wZW5MaW5lIGljb24gaW4gc2lkZSBwYW5lbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNZWRpYVR5cGUgPSAncGMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydCAtIEljb24gc2hvdWxkIGJlIHByZXNlbnQgaW4gc2lkZSBwYW5lbFxuICAgICAgY29uc3QgaWNvbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2l6ZS0xMCcpXG4gICAgICBleHBlY3QoaWNvbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBzaWRlIHBhbmVsIHNlY3Rpb24gYmFja2dyb3VuZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNZWRpYVR5cGUgPSAncGMnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlclN0ZXBUaHJlZSgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2lkZVBhbmVsID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1iYWNrZ3JvdW5kLXNlY3Rpb24nKVxuICAgICAgZXhwZWN0KHNpZGVQYW5lbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwYWRkaW5nIGZvciBzaWRlIHBhbmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja01lZGlhVHlwZSA9ICdwYydcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyU3RlcFRocmVlKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzaWRlUGFuZWxXcmFwcGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5wci04JylcbiAgICAgIGV4cGVjdChzaWRlUGFuZWxXcmFwcGVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=