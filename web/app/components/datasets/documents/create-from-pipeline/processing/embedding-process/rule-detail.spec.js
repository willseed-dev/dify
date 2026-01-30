"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const step_two_1 = require("@/app/components/datasets/create/step-two");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const rule_detail_1 = require("./rule-detail");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock next/image (using img element for simplicity in tests)
vi.mock('next/image', () => ({
    default: function MockImage({ src, alt, className }) {
        // eslint-disable-next-line next/no-img-element
        return <img src={src} alt={alt} className={className} data-testid="next-image"/>;
    },
}));
// Mock FieldInfo component
vi.mock('@/app/components/datasets/documents/detail/metadata', () => ({
    FieldInfo: ({ label, displayedValue, valueIcon }) => (<div data-testid="field-info" data-label={label}>
      <span data-testid="field-label">{label}</span>
      <span data-testid="field-value">{displayedValue}</span>
      {valueIcon && <span data-testid="field-icon">{valueIcon}</span>}
    </div>),
}));
// Mock icons - provides simple string paths for testing instead of Next.js static import objects
vi.mock('@/app/components/datasets/create/icons', () => ({
    indexMethodIcon: {
        economical: '/icons/economical.svg',
        high_quality: '/icons/high_quality.svg',
    },
    retrievalIcon: {
        fullText: '/icons/fullText.svg',
        hybrid: '/icons/hybrid.svg',
        vector: '/icons/vector.svg',
    },
}));
// ==========================================
// Test Data Factory Functions
// ==========================================
/**
 * Creates a mock ProcessRuleResponse for testing
 */
const createMockProcessRule = (overrides = {}) => ({
    mode: datasets_1.ProcessMode.general,
    rules: {
        pre_processing_rules: [],
        segmentation: {
            separator: '\n',
            max_tokens: 500,
            chunk_overlap: 50,
        },
        parent_mode: 'paragraph',
        subchunk_segmentation: {
            separator: '\n',
            max_tokens: 200,
            chunk_overlap: 20,
        },
    },
    limits: {
        indexing_max_segmentation_tokens_length: 1000,
    },
    ...overrides,
});
// ==========================================
// Test Suite
// ==========================================
describe('RuleDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            const fieldInfos = react_1.screen.getAllByTestId('field-info');
            expect(fieldInfos).toHaveLength(3);
        });
        it('should render three FieldInfo components', () => {
            // Arrange
            const sourceData = createMockProcessRule();
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData} indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const fieldInfos = react_1.screen.getAllByTestId('field-info');
            expect(fieldInfos).toHaveLength(3);
        });
        it('should render mode field with correct label', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert - first field-info is for mode
            const fieldInfos = react_1.screen.getAllByTestId('field-info');
            expect(fieldInfos[0]).toHaveAttribute('data-label', 'datasetDocuments.embedding.mode');
        });
    });
    // ==========================================
    // Mode Value Tests
    // ==========================================
    describe('Mode Value', () => {
        it('should show "-" when sourceData is undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('-');
        });
        it('should show "-" when sourceData.mode is undefined', () => {
            // Arrange
            const sourceData = { ...createMockProcessRule(), mode: undefined };
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('-');
        });
        it('should show custom mode text when mode is general', () => {
            // Arrange
            const sourceData = createMockProcessRule({ mode: datasets_1.ProcessMode.general });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('datasetDocuments.embedding.custom');
        });
        it('should show hierarchical mode with paragraph parent mode', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.parentChild,
                rules: {
                    pre_processing_rules: [],
                    segmentation: { separator: '\n', max_tokens: 500, chunk_overlap: 50 },
                    parent_mode: 'paragraph',
                    subchunk_segmentation: { separator: '\n', max_tokens: 200, chunk_overlap: 20 },
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('datasetDocuments.embedding.hierarchical · dataset.parentMode.paragraph');
        });
        it('should show hierarchical mode with full-doc parent mode', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.parentChild,
                rules: {
                    pre_processing_rules: [],
                    segmentation: { separator: '\n', max_tokens: 500, chunk_overlap: 50 },
                    parent_mode: 'full-doc',
                    subchunk_segmentation: { separator: '\n', max_tokens: 200, chunk_overlap: 20 },
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('datasetDocuments.embedding.hierarchical · dataset.parentMode.fullDoc');
        });
    });
    // ==========================================
    // Indexing Type Tests
    // ==========================================
    describe('Indexing Type', () => {
        it('should show qualified indexing type', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED}/>);
            // Assert
            const fieldInfos = react_1.screen.getAllByTestId('field-info');
            expect(fieldInfos[1]).toHaveAttribute('data-label', 'datasetCreation.stepTwo.indexMode');
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[1]).toHaveTextContent('datasetCreation.stepTwo.qualified');
        });
        it('should show economical indexing type', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.ECONOMICAL}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[1]).toHaveTextContent('datasetCreation.stepTwo.economical');
        });
        it('should show high_quality icon for qualified indexing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images[0]).toHaveAttribute('src', '/icons/high_quality.svg');
        });
        it('should show economical icon for economical indexing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.ECONOMICAL}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images[0]).toHaveAttribute('src', '/icons/economical.svg');
        });
    });
    // ==========================================
    // Retrieval Method Tests
    // ==========================================
    describe('Retrieval Method', () => {
        it('should show retrieval setting label', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const fieldInfos = react_1.screen.getAllByTestId('field-info');
            expect(fieldInfos[2]).toHaveAttribute('data-label', 'datasetSettings.form.retrievalSetting.title');
        });
        it('should show semantic search title for qualified indexing with semantic method', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.semantic_search.title');
        });
        it('should show full text search title for fullText method', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.fullText}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.full_text_search.title');
        });
        it('should show hybrid search title for hybrid method', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.hybrid}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.hybrid_search.title');
        });
        it('should force keyword_search for economical indexing type', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.ECONOMICAL} retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.keyword_search.title');
        });
        it('should show vector icon for semantic search', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images[1]).toHaveAttribute('src', '/icons/vector.svg');
        });
        it('should show fullText icon for full text search', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.fullText}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images[1]).toHaveAttribute('src', '/icons/fullText.svg');
        });
        it('should show hybrid icon for hybrid search', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.hybrid}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images[1]).toHaveAttribute('src', '/icons/hybrid.svg');
        });
    });
    // ==========================================
    // Edge Cases
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle all props undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            expect(react_1.screen.getAllByTestId('field-info')).toHaveLength(3);
        });
        it('should handle undefined indexingType with defined retrievalMethod', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default retrievalMethod={app_1.RETRIEVE_METHOD.hybrid}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            // When indexingType is undefined, it's treated as qualified
            expect(fieldValues[1]).toHaveTextContent('datasetCreation.stepTwo.qualified');
        });
        it('should handle undefined retrievalMethod with defined indexingType', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType={step_two_1.IndexingType.QUALIFIED}/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            // When retrievalMethod is undefined, vector icon is used as default
            expect(images[1]).toHaveAttribute('src', '/icons/vector.svg');
        });
        it('should handle sourceData with null rules', () => {
            // Arrange
            const sourceData = {
                ...createMockProcessRule(),
                mode: datasets_1.ProcessMode.parentChild,
                rules: null,
            };
            // Act & Assert - should not crash
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            expect(react_1.screen.getAllByTestId('field-info')).toHaveLength(3);
        });
    });
    // ==========================================
    // Props Variations Tests
    // ==========================================
    describe('Props Variations', () => {
        it('should render correctly with all props provided', () => {
            // Arrange
            const sourceData = createMockProcessRule({ mode: datasets_1.ProcessMode.general });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData} indexingType={step_two_1.IndexingType.QUALIFIED} retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[0]).toHaveTextContent('datasetDocuments.embedding.custom');
            expect(fieldValues[1]).toHaveTextContent('datasetCreation.stepTwo.qualified');
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.semantic_search.title');
        });
        it('should render correctly for economical mode with full settings', () => {
            // Arrange
            const sourceData = createMockProcessRule({ mode: datasets_1.ProcessMode.parentChild });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData} indexingType={step_two_1.IndexingType.ECONOMICAL} retrievalMethod={app_1.RETRIEVE_METHOD.fullText}/>);
            // Assert
            const fieldValues = react_1.screen.getAllByTestId('field-value');
            expect(fieldValues[1]).toHaveTextContent('datasetCreation.stepTwo.economical');
            // Economical always uses keyword_search regardless of retrievalMethod
            expect(fieldValues[2]).toHaveTextContent('dataset.retrieval.keyword_search.title');
        });
    });
    // ==========================================
    // Memoization Tests
    // ==========================================
    describe('Memoization', () => {
        it('should be wrapped in React.memo', () => {
            // Assert - RuleDetail should be a memoized component
            expect(rule_detail_1.default).toHaveProperty('$$typeof', Symbol.for('react.memo'));
        });
        it('should not re-render with same props', () => {
            // Arrange
            const sourceData = createMockProcessRule();
            const props = {
                sourceData,
                indexingType: step_two_1.IndexingType.QUALIFIED,
                retrievalMethod: app_1.RETRIEVE_METHOD.semantic,
            };
            // Act
            const { rerender } = (0, react_1.render)(<rule_detail_1.default {...props}/>);
            rerender(<rule_detail_1.default {...props}/>);
            // Assert - component renders correctly after rerender
            expect(react_1.screen.getAllByTestId('field-info')).toHaveLength(3);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS1kZXRhaWwuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bGUtZGV0YWlsLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5Qix3RUFBd0U7QUFDeEUsZ0RBQStDO0FBQy9DLHFDQUE2QztBQUM3QywrQ0FBc0M7QUFFdEMsNkNBQTZDO0FBQzdDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MsOERBQThEO0FBQzlELEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0IsT0FBTyxFQUFFLFNBQVMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQW9EO1FBQ25HLCtDQUErQztRQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUcsQ0FBQTtJQUNuRixDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCwyQkFBMkI7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLFNBQVMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQTBFLEVBQUUsRUFBRSxDQUFDLENBQzNILENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQzlDO01BQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FDN0M7TUFBQSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUs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Q0FBQyxDQUFDLHFCQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkMsc0RBQXNEO1lBQ3RELE1BQU0sQ0FBQyxjQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUHJvY2Vzc1J1bGVSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBJbmRleGluZ1R5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2NyZWF0ZS9zdGVwLXR3bydcbmltcG9ydCB7IFByb2Nlc3NNb2RlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBSdWxlRGV0YWlsIGZyb20gJy4vcnVsZS1kZXRhaWwnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIG5leHQvaW1hZ2UgKHVzaW5nIGltZyBlbGVtZW50IGZvciBzaW1wbGljaXR5IGluIHRlc3RzKVxudmkubW9jaygnbmV4dC9pbWFnZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIE1vY2tJbWFnZSh7IHNyYywgYWx0LCBjbGFzc05hbWUgfTogeyBzcmM6IHN0cmluZywgYWx0OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyB9KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5leHQvbm8taW1nLWVsZW1lbnRcbiAgICByZXR1cm4gPGltZyBzcmM9e3NyY30gYWx0PXthbHR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkYXRhLXRlc3RpZD1cIm5leHQtaW1hZ2VcIiAvPlxuICB9LFxufSkpXG5cbi8vIE1vY2sgRmllbGRJbmZvIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvZGV0YWlsL21ldGFkYXRhJywgKCkgPT4gKHtcbiAgRmllbGRJbmZvOiAoeyBsYWJlbCwgZGlzcGxheWVkVmFsdWUsIHZhbHVlSWNvbiB9OiB7IGxhYmVsOiBzdHJpbmcsIGRpc3BsYXllZFZhbHVlOiBzdHJpbmcsIHZhbHVlSWNvbj86IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImZpZWxkLWluZm9cIiBkYXRhLWxhYmVsPXtsYWJlbH0+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZpZWxkLWxhYmVsXCI+e2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZmllbGQtdmFsdWVcIj57ZGlzcGxheWVkVmFsdWV9PC9zcGFuPlxuICAgICAge3ZhbHVlSWNvbiAmJiA8c3BhbiBkYXRhLXRlc3RpZD1cImZpZWxkLWljb25cIj57dmFsdWVJY29ufTwvc3Bhbj59XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBpY29ucyAtIHByb3ZpZGVzIHNpbXBsZSBzdHJpbmcgcGF0aHMgZm9yIHRlc3RpbmcgaW5zdGVhZCBvZiBOZXh0LmpzIHN0YXRpYyBpbXBvcnQgb2JqZWN0c1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9jcmVhdGUvaWNvbnMnLCAoKSA9PiAoe1xuICBpbmRleE1ldGhvZEljb246IHtcbiAgICBlY29ub21pY2FsOiAnL2ljb25zL2Vjb25vbWljYWwuc3ZnJyxcbiAgICBoaWdoX3F1YWxpdHk6ICcvaWNvbnMvaGlnaF9xdWFsaXR5LnN2ZycsXG4gIH0sXG4gIHJldHJpZXZhbEljb246IHtcbiAgICBmdWxsVGV4dDogJy9pY29ucy9mdWxsVGV4dC5zdmcnLFxuICAgIGh5YnJpZDogJy9pY29ucy9oeWJyaWQuc3ZnJyxcbiAgICB2ZWN0b3I6ICcvaWNvbnMvdmVjdG9yLnN2ZycsXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yeSBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrIFByb2Nlc3NSdWxlUmVzcG9uc2UgZm9yIHRlc3RpbmdcbiAqL1xuY29uc3QgY3JlYXRlTW9ja1Byb2Nlc3NSdWxlID0gKG92ZXJyaWRlczogUGFydGlhbDxQcm9jZXNzUnVsZVJlc3BvbnNlPiA9IHt9KTogUHJvY2Vzc1J1bGVSZXNwb25zZSA9PiAoe1xuICBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLFxuICBydWxlczoge1xuICAgIHByZV9wcm9jZXNzaW5nX3J1bGVzOiBbXSxcbiAgICBzZWdtZW50YXRpb246IHtcbiAgICAgIHNlcGFyYXRvcjogJ1xcbicsXG4gICAgICBtYXhfdG9rZW5zOiA1MDAsXG4gICAgICBjaHVua19vdmVybGFwOiA1MCxcbiAgICB9LFxuICAgIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgICBzdWJjaHVua19zZWdtZW50YXRpb246IHtcbiAgICAgIHNlcGFyYXRvcjogJ1xcbicsXG4gICAgICBtYXhfdG9rZW5zOiAyMDAsXG4gICAgICBjaHVua19vdmVybGFwOiAyMCxcbiAgICB9LFxuICB9LFxuICBsaW1pdHM6IHtcbiAgICBpbmRleGluZ19tYXhfc2VnbWVudGF0aW9uX3Rva2Vuc19sZW5ndGg6IDEwMDAsXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdSdWxlRGV0YWlsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZmllbGRJbmZvcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtaW5mbycpXG4gICAgICBleHBlY3QoZmllbGRJbmZvcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRocmVlIEZpZWxkSW5mbyBjb21wb25lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlRGF0YSA9IGNyZWF0ZU1vY2tQcm9jZXNzUnVsZSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UnVsZURldGFpbFxuICAgICAgICAgIHNvdXJjZURhdGE9e3NvdXJjZURhdGF9XG4gICAgICAgICAgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuUVVBTElGSUVEfVxuICAgICAgICAgIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELnNlbWFudGljfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZEluZm9zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC1pbmZvJylcbiAgICAgIGV4cGVjdChmaWVsZEluZm9zKS50b0hhdmVMZW5ndGgoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kZSBmaWVsZCB3aXRoIGNvcnJlY3QgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGZpcnN0IGZpZWxkLWluZm8gaXMgZm9yIG1vZGVcbiAgICAgIGNvbnN0IGZpZWxkSW5mb3MgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLWluZm8nKVxuICAgICAgZXhwZWN0KGZpZWxkSW5mb3NbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1sYWJlbCcsICdkYXRhc2V0RG9jdW1lbnRzLmVtYmVkZGluZy5tb2RlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNb2RlIFZhbHVlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTW9kZSBWYWx1ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgXCItXCIgd2hlbiBzb3VyY2VEYXRhIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzBdKS50b0hhdmVUZXh0Q29udGVudCgnLScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBcIi1cIiB3aGVuIHNvdXJjZURhdGEubW9kZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzb3VyY2VEYXRhID0geyAuLi5jcmVhdGVNb2NrUHJvY2Vzc1J1bGUoKSwgbW9kZTogdW5kZWZpbmVkIGFzIHVua25vd24gYXMgUHJvY2Vzc01vZGUgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCBzb3VyY2VEYXRhPXtzb3VyY2VEYXRhfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzBdKS50b0hhdmVUZXh0Q29udGVudCgnLScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjdXN0b20gbW9kZSB0ZXh0IHdoZW4gbW9kZSBpcyBnZW5lcmFsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlRGF0YSA9IGNyZWF0ZU1vY2tQcm9jZXNzUnVsZSh7IG1vZGU6IFByb2Nlc3NNb2RlLmdlbmVyYWwgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgc291cmNlRGF0YT17c291cmNlRGF0YX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZmllbGRWYWx1ZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLXZhbHVlJylcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1swXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLmN1c3RvbScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBoaWVyYXJjaGljYWwgbW9kZSB3aXRoIHBhcmFncmFwaCBwYXJlbnQgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUoe1xuICAgICAgICBtb2RlOiBQcm9jZXNzTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICBwcmVfcHJvY2Vzc2luZ19ydWxlczogW10sXG4gICAgICAgICAgc2VnbWVudGF0aW9uOiB7IHNlcGFyYXRvcjogJ1xcbicsIG1heF90b2tlbnM6IDUwMCwgY2h1bmtfb3ZlcmxhcDogNTAgfSxcbiAgICAgICAgICBwYXJlbnRfbW9kZTogJ3BhcmFncmFwaCcsXG4gICAgICAgICAgc3ViY2h1bmtfc2VnbWVudGF0aW9uOiB7IHNlcGFyYXRvcjogJ1xcbicsIG1heF90b2tlbnM6IDIwMCwgY2h1bmtfb3ZlcmxhcDogMjAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIHNvdXJjZURhdGE9e3NvdXJjZURhdGF9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGZpZWxkVmFsdWVzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC12YWx1ZScpXG4gICAgICBleHBlY3QoZmllbGRWYWx1ZXNbMF0pLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0RG9jdW1lbnRzLmVtYmVkZGluZy5oaWVyYXJjaGljYWwgwrcgZGF0YXNldC5wYXJlbnRNb2RlLnBhcmFncmFwaCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBoaWVyYXJjaGljYWwgbW9kZSB3aXRoIGZ1bGwtZG9jIHBhcmVudCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlRGF0YSA9IGNyZWF0ZU1vY2tQcm9jZXNzUnVsZSh7XG4gICAgICAgIG1vZGU6IFByb2Nlc3NNb2RlLnBhcmVudENoaWxkLFxuICAgICAgICBydWxlczoge1xuICAgICAgICAgIHByZV9wcm9jZXNzaW5nX3J1bGVzOiBbXSxcbiAgICAgICAgICBzZWdtZW50YXRpb246IHsgc2VwYXJhdG9yOiAnXFxuJywgbWF4X3Rva2VuczogNTAwLCBjaHVua19vdmVybGFwOiA1MCB9LFxuICAgICAgICAgIHBhcmVudF9tb2RlOiAnZnVsbC1kb2MnLFxuICAgICAgICAgIHN1YmNodW5rX3NlZ21lbnRhdGlvbjogeyBzZXBhcmF0b3I6ICdcXG4nLCBtYXhfdG9rZW5zOiAyMDAsIGNodW5rX292ZXJsYXA6IDIwIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCBzb3VyY2VEYXRhPXtzb3VyY2VEYXRhfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzBdKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcuaGllcmFyY2hpY2FsIMK3IGRhdGFzZXQucGFyZW50TW9kZS5mdWxsRG9jJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbmRleGluZyBUeXBlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5kZXhpbmcgVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgcXVhbGlmaWVkIGluZGV4aW5nIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuUVVBTElGSUVEfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZEluZm9zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC1pbmZvJylcbiAgICAgIGV4cGVjdChmaWVsZEluZm9zWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnLCAnZGF0YXNldENyZWF0aW9uLnN0ZXBUd28uaW5kZXhNb2RlJylcblxuICAgICAgY29uc3QgZmllbGRWYWx1ZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLXZhbHVlJylcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1sxXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLnF1YWxpZmllZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlY29ub21pY2FsIGluZGV4aW5nIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuRUNPTk9NSUNBTH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZmllbGRWYWx1ZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLXZhbHVlJylcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1sxXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLmVjb25vbWljYWwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgaGlnaF9xdWFsaXR5IGljb24gZm9yIHF1YWxpZmllZCBpbmRleGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5RVUFMSUZJRUR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltYWdlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnbmV4dC1pbWFnZScpXG4gICAgICBleHBlY3QoaW1hZ2VzWzBdKS50b0hhdmVBdHRyaWJ1dGUoJ3NyYycsICcvaWNvbnMvaGlnaF9xdWFsaXR5LnN2ZycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlY29ub21pY2FsIGljb24gZm9yIGVjb25vbWljYWwgaW5kZXhpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuRUNPTk9NSUNBTH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW1hZ2VzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCduZXh0LWltYWdlJylcbiAgICAgIGV4cGVjdChpbWFnZXNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3JjJywgJy9pY29ucy9lY29ub21pY2FsLnN2ZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmV0cmlldmFsIE1ldGhvZCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JldHJpZXZhbCBNZXRob2QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHJldHJpZXZhbCBzZXR0aW5nIGxhYmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELnNlbWFudGljfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZEluZm9zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC1pbmZvJylcbiAgICAgIGV4cGVjdChmaWVsZEluZm9zWzJdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnLCAnZGF0YXNldFNldHRpbmdzLmZvcm0ucmV0cmlldmFsU2V0dGluZy50aXRsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzZW1hbnRpYyBzZWFyY2ggdGl0bGUgZm9yIHF1YWxpZmllZCBpbmRleGluZyB3aXRoIHNlbWFudGljIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJ1bGVEZXRhaWxcbiAgICAgICAgICBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5RVUFMSUZJRUR9XG4gICAgICAgICAgcmV0cmlldmFsTWV0aG9kPXtSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGZpZWxkVmFsdWVzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC12YWx1ZScpXG4gICAgICBleHBlY3QoZmllbGRWYWx1ZXNbMl0pLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0LnJldHJpZXZhbC5zZW1hbnRpY19zZWFyY2gudGl0bGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZnVsbCB0ZXh0IHNlYXJjaCB0aXRsZSBmb3IgZnVsbFRleHQgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UnVsZURldGFpbFxuICAgICAgICAgIGluZGV4aW5nVHlwZT17SW5kZXhpbmdUeXBlLlFVQUxJRklFRH1cbiAgICAgICAgICByZXRyaWV2YWxNZXRob2Q9e1JFVFJJRVZFX01FVEhPRC5mdWxsVGV4dH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZmllbGRWYWx1ZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLXZhbHVlJylcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1syXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXQucmV0cmlldmFsLmZ1bGxfdGV4dF9zZWFyY2gudGl0bGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgaHlicmlkIHNlYXJjaCB0aXRsZSBmb3IgaHlicmlkIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJ1bGVEZXRhaWxcbiAgICAgICAgICBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5RVUFMSUZJRUR9XG4gICAgICAgICAgcmV0cmlldmFsTWV0aG9kPXtSRVRSSUVWRV9NRVRIT0QuaHlicmlkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzJdKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZm9yY2Uga2V5d29yZF9zZWFyY2ggZm9yIGVjb25vbWljYWwgaW5kZXhpbmcgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJ1bGVEZXRhaWxcbiAgICAgICAgICBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5FQ09OT01JQ0FMfVxuICAgICAgICAgIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELnNlbWFudGljfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzJdKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldC5yZXRyaWV2YWwua2V5d29yZF9zZWFyY2gudGl0bGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdmVjdG9yIGljb24gZm9yIHNlbWFudGljIHNlYXJjaCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFJ1bGVEZXRhaWxcbiAgICAgICAgICBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5RVUFMSUZJRUR9XG4gICAgICAgICAgcmV0cmlldmFsTWV0aG9kPXtSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltYWdlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnbmV4dC1pbWFnZScpXG4gICAgICBleHBlY3QoaW1hZ2VzWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ3NyYycsICcvaWNvbnMvdmVjdG9yLnN2ZycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBmdWxsVGV4dCBpY29uIGZvciBmdWxsIHRleHQgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UnVsZURldGFpbFxuICAgICAgICAgIGluZGV4aW5nVHlwZT17SW5kZXhpbmdUeXBlLlFVQUxJRklFRH1cbiAgICAgICAgICByZXRyaWV2YWxNZXRob2Q9e1JFVFJJRVZFX01FVEhPRC5mdWxsVGV4dH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW1hZ2VzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCduZXh0LWltYWdlJylcbiAgICAgIGV4cGVjdChpbWFnZXNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3JjJywgJy9pY29ucy9mdWxsVGV4dC5zdmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgaHlicmlkIGljb24gZm9yIGh5YnJpZCBzZWFyY2gnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSdWxlRGV0YWlsXG4gICAgICAgICAgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuUVVBTElGSUVEfVxuICAgICAgICAgIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELmh5YnJpZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW1hZ2VzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCduZXh0LWltYWdlJylcbiAgICAgIGV4cGVjdChpbWFnZXNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3JjJywgJy9pY29ucy9oeWJyaWQuc3ZnJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgcHJvcHMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2ZpZWxkLWluZm8nKSkudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBpbmRleGluZ1R5cGUgd2l0aCBkZWZpbmVkIHJldHJpZXZhbE1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCByZXRyaWV2YWxNZXRob2Q9e1JFVFJJRVZFX01FVEhPRC5oeWJyaWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGZpZWxkVmFsdWVzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC12YWx1ZScpXG4gICAgICAvLyBXaGVuIGluZGV4aW5nVHlwZSBpcyB1bmRlZmluZWQsIGl0J3MgdHJlYXRlZCBhcyBxdWFsaWZpZWRcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1sxXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLnF1YWxpZmllZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCByZXRyaWV2YWxNZXRob2Qgd2l0aCBkZWZpbmVkIGluZGV4aW5nVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5RVUFMSUZJRUR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltYWdlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnbmV4dC1pbWFnZScpXG4gICAgICAvLyBXaGVuIHJldHJpZXZhbE1ldGhvZCBpcyB1bmRlZmluZWQsIHZlY3RvciBpY29uIGlzIHVzZWQgYXMgZGVmYXVsdFxuICAgICAgZXhwZWN0KGltYWdlc1sxXSkudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnL2ljb25zL3ZlY3Rvci5zdmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzb3VyY2VEYXRhIHdpdGggbnVsbCBydWxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSB7XG4gICAgICAgIC4uLmNyZWF0ZU1vY2tQcm9jZXNzUnVsZSgpLFxuICAgICAgICBtb2RlOiBQcm9jZXNzTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgcnVsZXM6IG51bGwgYXMgdW5rbm93biBhcyBQcm9jZXNzUnVsZVJlc3BvbnNlWydydWxlcyddLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBzaG91bGQgbm90IGNyYXNoXG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgc291cmNlRGF0YT17c291cmNlRGF0YX0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdmaWVsZC1pbmZvJykpLnRvSGF2ZUxlbmd0aCgzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIGFsbCBwcm9wcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUoeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UnVsZURldGFpbFxuICAgICAgICAgIHNvdXJjZURhdGE9e3NvdXJjZURhdGF9XG4gICAgICAgICAgaW5kZXhpbmdUeXBlPXtJbmRleGluZ1R5cGUuUVVBTElGSUVEfVxuICAgICAgICAgIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELnNlbWFudGljfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzBdKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcuY3VzdG9tJylcbiAgICAgIGV4cGVjdChmaWVsZFZhbHVlc1sxXSkudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLnF1YWxpZmllZCcpXG4gICAgICBleHBlY3QoZmllbGRWYWx1ZXNbMl0pLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0LnJldHJpZXZhbC5zZW1hbnRpY19zZWFyY2gudGl0bGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0bHkgZm9yIGVjb25vbWljYWwgbW9kZSB3aXRoIGZ1bGwgc2V0dGluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzb3VyY2VEYXRhID0gY3JlYXRlTW9ja1Byb2Nlc3NSdWxlKHsgbW9kZTogUHJvY2Vzc01vZGUucGFyZW50Q2hpbGQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSdWxlRGV0YWlsXG4gICAgICAgICAgc291cmNlRGF0YT17c291cmNlRGF0YX1cbiAgICAgICAgICBpbmRleGluZ1R5cGU9e0luZGV4aW5nVHlwZS5FQ09OT01JQ0FMfVxuICAgICAgICAgIHJldHJpZXZhbE1ldGhvZD17UkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZFZhbHVlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtdmFsdWUnKVxuICAgICAgZXhwZWN0KGZpZWxkVmFsdWVzWzFdKS50b0hhdmVUZXh0Q29udGVudCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUd28uZWNvbm9taWNhbCcpXG4gICAgICAvLyBFY29ub21pY2FsIGFsd2F5cyB1c2VzIGtleXdvcmRfc2VhcmNoIHJlZ2FyZGxlc3Mgb2YgcmV0cmlldmFsTWV0aG9kXG4gICAgICBleHBlY3QoZmllbGRWYWx1ZXNbMl0pLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0LnJldHJpZXZhbC5rZXl3b3JkX3NlYXJjaC50aXRsZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgaW4gUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydCAtIFJ1bGVEZXRhaWwgc2hvdWxkIGJlIGEgbWVtb2l6ZWQgY29tcG9uZW50XG4gICAgICBleHBlY3QoUnVsZURldGFpbCkudG9IYXZlUHJvcGVydHkoJyQkdHlwZW9mJywgU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlRGF0YSA9IGNyZWF0ZU1vY2tQcm9jZXNzUnVsZSgpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgc291cmNlRGF0YSxcbiAgICAgICAgaW5kZXhpbmdUeXBlOiBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgICByZXRyaWV2YWxNZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJ1bGVEZXRhaWwgey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKDxSdWxlRGV0YWlsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCByZW5kZXJzIGNvcnJlY3RseSBhZnRlciByZXJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZmllbGQtaW5mbycpKS50b0hhdmVMZW5ndGgoMylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==