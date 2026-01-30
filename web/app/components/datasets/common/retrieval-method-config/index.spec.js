"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// Mock provider context with controllable supportRetrievalMethods
let mockSupportRetrievalMethods = [
    app_1.RETRIEVE_METHOD.semantic,
    app_1.RETRIEVE_METHOD.fullText,
    app_1.RETRIEVE_METHOD.hybrid,
];
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        supportRetrievalMethods: mockSupportRetrievalMethods,
    }),
}));
// Mock model hooks with controllable return values
let mockRerankDefaultModel = {
    provider: { provider: 'test-provider' },
    model: 'test-rerank-model',
};
let mockIsRerankDefaultModelValid = true;
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelListAndDefaultModelAndCurrentProviderAndModel: () => ({
        defaultModel: mockRerankDefaultModel,
        currentModel: mockIsRerankDefaultModelValid,
    }),
}));
// Mock child component RetrievalParamConfig to simplify testing
vi.mock('../retrieval-param-config', () => ({
    default: ({ type, value, onChange, showMultiModalTip }) => (<div data-testid={`retrieval-param-config-${type}`}>
      <span data-testid="param-config-type">{type}</span>
      <span data-testid="param-config-multimodal-tip">{String(showMultiModalTip)}</span>
      <button data-testid={`update-top-k-${type}`} onClick={() => onChange({ ...value, top_k: 10 })}>
        Update Top K
      </button>
    </div>),
}));
// Factory function to create mock RetrievalConfig
const createMockRetrievalConfig = (overrides = {}) => ({
    search_method: app_1.RETRIEVE_METHOD.semantic,
    reranking_enable: false,
    reranking_model: {
        reranking_provider_name: '',
        reranking_model_name: '',
    },
    top_k: 4,
    score_threshold_enabled: false,
    score_threshold: 0.5,
    ...overrides,
});
// Helper to render component with default props
const renderComponent = (props = {}) => {
    const defaultProps = {
        value: createMockRetrievalConfig(),
        onChange: vi.fn(),
    };
    return (0, react_1.render)(<index_1.default {...defaultProps} {...props}/>);
};
describe('RetrievalMethodConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock values to defaults
        mockSupportRetrievalMethods = [
            app_1.RETRIEVE_METHOD.semantic,
            app_1.RETRIEVE_METHOD.fullText,
            app_1.RETRIEVE_METHOD.hybrid,
        ];
        mockRerankDefaultModel = {
            provider: { provider: 'test-provider' },
            model: 'test-rerank-model',
        };
        mockIsRerankDefaultModelValid = true;
    });
    // Tests for basic rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
        });
        it('should render all three retrieval methods when all are supported', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.full_text_search.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.hybrid_search.title')).toBeInTheDocument();
        });
        it('should render descriptions for all retrieval methods', () => {
            renderComponent();
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.description')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.full_text_search.description')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.hybrid_search.description')).toBeInTheDocument();
        });
        it('should only render semantic search when only semantic is supported', () => {
            mockSupportRetrievalMethods = [app_1.RETRIEVE_METHOD.semantic];
            renderComponent();
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
            expect(react_1.screen.queryByText('dataset.retrieval.full_text_search.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('dataset.retrieval.hybrid_search.title')).not.toBeInTheDocument();
        });
        it('should only render fullText search when only fullText is supported', () => {
            mockSupportRetrievalMethods = [app_1.RETRIEVE_METHOD.fullText];
            renderComponent();
            expect(react_1.screen.queryByText('dataset.retrieval.semantic_search.title')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.full_text_search.title')).toBeInTheDocument();
            expect(react_1.screen.queryByText('dataset.retrieval.hybrid_search.title')).not.toBeInTheDocument();
        });
        it('should only render hybrid search when only hybrid is supported', () => {
            mockSupportRetrievalMethods = [app_1.RETRIEVE_METHOD.hybrid];
            renderComponent();
            expect(react_1.screen.queryByText('dataset.retrieval.semantic_search.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('dataset.retrieval.full_text_search.title')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.hybrid_search.title')).toBeInTheDocument();
        });
        it('should render nothing when no retrieval methods are supported', () => {
            mockSupportRetrievalMethods = [];
            const { container } = renderComponent();
            // Only the wrapper div should exist
            expect(container.firstChild?.childNodes.length).toBe(0);
        });
        it('should show RetrievalParamConfig for the active method', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
            });
            expect(react_1.screen.getByTestId('retrieval-param-config-semantic_search')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('retrieval-param-config-full_text_search')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('retrieval-param-config-hybrid_search')).not.toBeInTheDocument();
        });
        it('should show RetrievalParamConfig for fullText when active', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText }),
            });
            expect(react_1.screen.queryByTestId('retrieval-param-config-semantic_search')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('retrieval-param-config-full_text_search')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('retrieval-param-config-hybrid_search')).not.toBeInTheDocument();
        });
        it('should show RetrievalParamConfig for hybrid when active', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.hybrid }),
            });
            expect(react_1.screen.queryByTestId('retrieval-param-config-semantic_search')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('retrieval-param-config-full_text_search')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('retrieval-param-config-hybrid_search')).toBeInTheDocument();
        });
    });
    // Tests for props handling
    describe('Props', () => {
        it('should pass showMultiModalTip to RetrievalParamConfig', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                showMultiModalTip: true,
            });
            expect(react_1.screen.getByTestId('param-config-multimodal-tip')).toHaveTextContent('true');
        });
        it('should default showMultiModalTip to false', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
            });
            expect(react_1.screen.getByTestId('param-config-multimodal-tip')).toHaveTextContent('false');
        });
        it('should apply disabled state to option cards', () => {
            renderComponent({ disabled: true });
            // When disabled, clicking should not trigger onChange
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor"]');
            expect(semanticOption).toHaveClass('cursor-not-allowed');
        });
        it('should default disabled to false', () => {
            renderComponent();
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor"]');
            expect(semanticOption).not.toHaveClass('cursor-not-allowed');
        });
    });
    // Tests for user interactions and event handlers
    describe('User Interactions', () => {
        it('should call onChange when switching to semantic search', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: true,
            }));
        });
        it('should call onChange when switching to fullText search', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
            });
            const fullTextOption = react_1.screen.getByText('dataset.retrieval.full_text_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(fullTextOption);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                search_method: app_1.RETRIEVE_METHOD.fullText,
                reranking_enable: true,
            }));
        });
        it('should call onChange when switching to hybrid search', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_enable: true,
            }));
        });
        it('should not call onChange when clicking the already active method', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).not.toHaveBeenCalled();
        });
        it('should not call onChange when disabled', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
                disabled: true,
            });
            const fullTextOption = react_1.screen.getByText('dataset.retrieval.full_text_search.title').closest('div[class*="cursor"]');
            react_1.fireEvent.click(fullTextOption);
            expect(onChange).not.toHaveBeenCalled();
        });
        it('should propagate onChange from RetrievalParamConfig', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
            });
            const updateButton = react_1.screen.getByTestId('update-top-k-semantic_search');
            react_1.fireEvent.click(updateButton);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                top_k: 10,
            }));
        });
    });
    // Tests for reranking model configuration
    describe('Reranking Model Configuration', () => {
        it('should set reranking model when switching to semantic and model is valid', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_model: {
                    reranking_provider_name: 'test-provider',
                    reranking_model_name: 'test-rerank-model',
                },
                reranking_enable: true,
            }));
        });
        it('should preserve existing reranking model when switching', () => {
            const onChange = vi.fn();
            const existingModel = {
                reranking_provider_name: 'existing-provider',
                reranking_model_name: 'existing-model',
            };
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: existingModel,
                }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_model: existingModel,
                reranking_enable: true,
            }));
        });
        it('should set reranking_enable to false when no valid model', () => {
            mockIsRerankDefaultModelValid = false;
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_enable: false,
            }));
        });
        it('should set reranking_mode for hybrid search', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_mode: datasets_1.RerankingModeEnum.RerankingModel,
            }));
        });
        it('should set weighted score mode when no valid rerank model for hybrid', () => {
            mockIsRerankDefaultModelValid = false;
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
            }));
        });
        it('should set default weights for hybrid search when no existing weights', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    weights: undefined,
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                weights: {
                    weight_type: datasets_1.WeightedScoreEnum.Customized,
                    vector_setting: {
                        vector_weight: datasets_1.DEFAULT_WEIGHTED_SCORE.other.semantic,
                        embedding_provider_name: '',
                        embedding_model_name: '',
                    },
                    keyword_setting: {
                        keyword_weight: datasets_1.DEFAULT_WEIGHTED_SCORE.other.keyword,
                    },
                },
            }));
        });
        it('should preserve existing weights for hybrid search', () => {
            const existingWeights = {
                weight_type: datasets_1.WeightedScoreEnum.Customized,
                vector_setting: {
                    vector_weight: 0.8,
                    embedding_provider_name: 'test-embed-provider',
                    embedding_model_name: 'test-embed-model',
                },
                keyword_setting: {
                    keyword_weight: 0.2,
                },
            };
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    weights: existingWeights,
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                weights: existingWeights,
            }));
        });
        it('should use RerankingModel mode and enable reranking for hybrid when existing reranking model', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_model: {
                        reranking_provider_name: 'existing-provider',
                        reranking_model_name: 'existing-model',
                    },
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_enable: true,
                reranking_mode: datasets_1.RerankingModeEnum.RerankingModel,
            }));
        });
    });
    // Tests for callback stability and memoization
    describe('Callback Stability', () => {
        it('should maintain stable onSwitch callback when value changes', () => {
            const onChange = vi.fn();
            const value1 = createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText, top_k: 4 });
            const value2 = createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText, top_k: 8 });
            const { rerender } = (0, react_1.render)(<index_1.default value={value1} onChange={onChange}/>);
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledTimes(1);
            rerender(<index_1.default value={value2} onChange={onChange}/>);
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledTimes(2);
        });
        it('should use updated onChange callback after rerender', () => {
            const onChange1 = vi.fn();
            const onChange2 = vi.fn();
            const value = createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText });
            const { rerender } = (0, react_1.render)(<index_1.default value={value} onChange={onChange1}/>);
            rerender(<index_1.default value={value} onChange={onChange2}/>);
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange1).not.toHaveBeenCalled();
            expect(onChange2).toHaveBeenCalledTimes(1);
        });
    });
    // Tests for component memoization
    describe('Component Memoization', () => {
        it('should be memoized with React.memo', () => {
            // Verify the component is wrapped with React.memo by checking its displayName or type
            expect(index_1.default).toBeDefined();
            // React.memo components have a $$typeof property
            expect(index_1.default.$$typeof).toBeDefined();
        });
        it('should not re-render when props are the same', () => {
            const onChange = vi.fn();
            const value = createMockRetrievalConfig();
            const { rerender } = (0, react_1.render)(<index_1.default value={value} onChange={onChange}/>);
            // Rerender with same props reference
            rerender(<index_1.default value={value} onChange={onChange}/>);
            // Component should still be rendered correctly
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
        });
    });
    // Tests for edge cases and error handling
    describe('Edge Cases', () => {
        it('should handle undefined reranking_model', () => {
            const onChange = vi.fn();
            const value = createMockRetrievalConfig({
                search_method: app_1.RETRIEVE_METHOD.fullText,
            });
            // @ts-expect-error - Testing edge case
            value.reranking_model = undefined;
            renderComponent({
                value,
                onChange,
            });
            // Should not crash
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
        });
        it('should handle missing default model', () => {
            mockRerankDefaultModel = undefined;
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const semanticOption = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(semanticOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_model: {
                    reranking_provider_name: '',
                    reranking_model_name: '',
                },
            }));
        });
        it('should use fallback empty string when default model provider is undefined', () => {
            // @ts-expect-error - Testing edge case where provider is undefined
            mockRerankDefaultModel = { provider: undefined, model: 'test-model' };
            mockIsRerankDefaultModelValid = true;
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_model: {
                    reranking_provider_name: '',
                    reranking_model_name: 'test-model',
                },
            }));
        });
        it('should use fallback empty string when default model name is undefined', () => {
            // @ts-expect-error - Testing edge case where model is undefined
            mockRerankDefaultModel = { provider: { provider: 'test-provider' }, model: undefined };
            mockIsRerankDefaultModelValid = true;
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({
                    search_method: app_1.RETRIEVE_METHOD.fullText,
                    reranking_model: {
                        reranking_provider_name: '',
                        reranking_model_name: '',
                    },
                }),
                onChange,
            });
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            react_1.fireEvent.click(hybridOption);
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_model: {
                    reranking_provider_name: 'test-provider',
                    reranking_model_name: '',
                },
            }));
        });
        it('should handle rapid sequential clicks', () => {
            const onChange = vi.fn();
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                onChange,
            });
            const fullTextOption = react_1.screen.getByText('dataset.retrieval.full_text_search.title').closest('div[class*="cursor-pointer"]');
            const hybridOption = react_1.screen.getByText('dataset.retrieval.hybrid_search.title').closest('div[class*="cursor-pointer"]');
            // Rapid clicks
            react_1.fireEvent.click(fullTextOption);
            react_1.fireEvent.click(hybridOption);
            react_1.fireEvent.click(fullTextOption);
            expect(onChange).toHaveBeenCalledTimes(3);
        });
        it('should handle empty supportRetrievalMethods array', () => {
            mockSupportRetrievalMethods = [];
            const { container } = renderComponent();
            expect(container.querySelector('[class*="flex-col"]')?.childNodes.length).toBe(0);
        });
        it('should handle partial supportRetrievalMethods', () => {
            mockSupportRetrievalMethods = [app_1.RETRIEVE_METHOD.semantic, app_1.RETRIEVE_METHOD.hybrid];
            renderComponent();
            expect(react_1.screen.getByText('dataset.retrieval.semantic_search.title')).toBeInTheDocument();
            expect(react_1.screen.queryByText('dataset.retrieval.full_text_search.title')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.retrieval.hybrid_search.title')).toBeInTheDocument();
        });
        it('should handle value with all optional fields set', () => {
            const fullValue = createMockRetrievalConfig({
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_enable: true,
                reranking_model: {
                    reranking_provider_name: 'provider',
                    reranking_model_name: 'model',
                },
                top_k: 10,
                score_threshold_enabled: true,
                score_threshold: 0.8,
                reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
                weights: {
                    weight_type: datasets_1.WeightedScoreEnum.Customized,
                    vector_setting: {
                        vector_weight: 0.6,
                        embedding_provider_name: 'embed-provider',
                        embedding_model_name: 'embed-model',
                    },
                    keyword_setting: {
                        keyword_weight: 0.4,
                    },
                },
            });
            renderComponent({ value: fullValue });
            expect(react_1.screen.getByTestId('retrieval-param-config-hybrid_search')).toBeInTheDocument();
        });
    });
    // Tests for all prop variations
    describe('Prop Variations', () => {
        it('should render with minimum required props', () => {
            const { container } = (0, react_1.render)(<index_1.default value={createMockRetrievalConfig()} onChange={vi.fn()}/>);
            expect(container.firstChild).toBeInTheDocument();
        });
        it('should render with all props set', () => {
            renderComponent({
                disabled: true,
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.hybrid }),
                showMultiModalTip: true,
                onChange: vi.fn(),
            });
            expect(react_1.screen.getByText('dataset.retrieval.hybrid_search.title')).toBeInTheDocument();
        });
        describe('disabled prop variations', () => {
            it('should handle disabled=true', () => {
                renderComponent({ disabled: true });
                const option = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor"]');
                expect(option).toHaveClass('cursor-not-allowed');
            });
            it('should handle disabled=false', () => {
                renderComponent({ disabled: false });
                const option = react_1.screen.getByText('dataset.retrieval.semantic_search.title').closest('div[class*="cursor"]');
                expect(option).toHaveClass('cursor-pointer');
            });
        });
        describe('search_method variations', () => {
            const methods = [
                app_1.RETRIEVE_METHOD.semantic,
                app_1.RETRIEVE_METHOD.fullText,
                app_1.RETRIEVE_METHOD.hybrid,
            ];
            it.each(methods)('should correctly highlight %s when active', (method) => {
                renderComponent({
                    value: createMockRetrievalConfig({ search_method: method }),
                });
                // The active method should have its RetrievalParamConfig rendered
                expect(react_1.screen.getByTestId(`retrieval-param-config-${method}`)).toBeInTheDocument();
            });
        });
        describe('showMultiModalTip variations', () => {
            it('should pass true to child component', () => {
                renderComponent({
                    value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                    showMultiModalTip: true,
                });
                expect(react_1.screen.getByTestId('param-config-multimodal-tip')).toHaveTextContent('true');
            });
            it('should pass false to child component', () => {
                renderComponent({
                    value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
                    showMultiModalTip: false,
                });
                expect(react_1.screen.getByTestId('param-config-multimodal-tip')).toHaveTextContent('false');
            });
        });
    });
    // Tests for active state visual indication
    describe('Active State Visual Indication', () => {
        it('should show recommended badge only on hybrid search', () => {
            renderComponent();
            // The hybrid search option should have the recommended badge
            // This is verified by checking the isRecommended prop passed to OptionCard
            const hybridTitle = react_1.screen.getByText('dataset.retrieval.hybrid_search.title');
            const hybridCard = hybridTitle.closest('div[class*="cursor"]');
            // Should contain recommended badge from OptionCard
            expect(hybridCard?.querySelector('[class*="badge"]') || react_1.screen.queryByText('datasetCreation.stepTwo.recommend')).toBeTruthy();
        });
    });
    // Tests for integration with OptionCard
    describe('OptionCard Integration', () => {
        it('should pass correct props to OptionCard for semantic search', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.semantic }),
            });
            const semanticTitle = react_1.screen.getByText('dataset.retrieval.semantic_search.title');
            expect(semanticTitle).toBeInTheDocument();
            // Check description
            const semanticDesc = react_1.screen.getByText('dataset.retrieval.semantic_search.description');
            expect(semanticDesc).toBeInTheDocument();
        });
        it('should pass correct props to OptionCard for fullText search', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.fullText }),
            });
            const fullTextTitle = react_1.screen.getByText('dataset.retrieval.full_text_search.title');
            expect(fullTextTitle).toBeInTheDocument();
            const fullTextDesc = react_1.screen.getByText('dataset.retrieval.full_text_search.description');
            expect(fullTextDesc).toBeInTheDocument();
        });
        it('should pass correct props to OptionCard for hybrid search', () => {
            renderComponent({
                value: createMockRetrievalConfig({ search_method: app_1.RETRIEVE_METHOD.hybrid }),
            });
            const hybridTitle = react_1.screen.getByText('dataset.retrieval.hybrid_search.title');
            expect(hybridTitle).toBeInTheDocument();
            const hybridDesc = react_1.screen.getByText('dataset.retrieval.hybrid_search.description');
            expect(hybridDesc).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixnREFJMEI7QUFDMUIscUNBQTZDO0FBQzdDLG1DQUEyQztBQUUzQyxrRUFBa0U7QUFDbEUsSUFBSSwyQkFBMkIsR0FBc0I7SUFDbkQscUJBQWUsQ0FBQyxRQUFRO0lBQ3hCLHFCQUFlLENBQUMsUUFBUTtJQUN4QixxQkFBZSxDQUFDLE1BQU07Q0FDdkIsQ0FBQTtBQUVELEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLHVCQUF1QixFQUFFLDJCQUEyQjtLQUNyRCxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxtREFBbUQ7QUFDbkQsSUFBSSxzQkFBc0IsR0FBa0U7SUFDMUYsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRTtJQUN2QyxLQUFLLEVBQUUsbUJBQW1CO0NBQzNCLENBQUE7QUFDRCxJQUFJLDZCQUE2QixHQUF3QixJQUFJLENBQUE7QUFFN0QsRUFBRSxDQUFDLElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xGLHFEQUFxRCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUQsWUFBWSxFQUFFLHNCQUFzQjtRQUNwQyxZQUFZLEVBQUUsNkJBQTZCO0tBQzVDLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILGdFQUFnRTtBQUNoRSxFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFLbkQsRUFBRSxFQUFF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QTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLGVBQWUsQ0FBQztnQkFDZCxLQUFLLEVBQUUseUJBQXlCLENBQUMsRUFBRSxhQUFhLEVBQUUscUJBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUM5RSxDQUFDLENBQUE7WUFFRixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUFDLENBQUE7WUFDbEYsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFekMsTUFBTSxZQUFZLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO1lBQ3ZGLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtZQUNuRSxlQUFlLENBQUM7Z0JBQ2QsS0FBSyxFQUFFLHlCQUF5QixDQUFDLEVBQUUsYUFBYSxFQUFFLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDNUUsQ0FBQyxDQUFBO1lBRUYsTUFBTSxXQUFXLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRXZDLE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQTtZQUNsRixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJldHJpZXZhbENvbmZpZyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIERFRkFVTFRfV0VJR0hURURfU0NPUkUsXG4gIFJlcmFua2luZ01vZGVFbnVtLFxuICBXZWlnaHRlZFNjb3JlRW51bSxcbn0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBSZXRyaWV2YWxNZXRob2RDb25maWcgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBwcm92aWRlciBjb250ZXh0IHdpdGggY29udHJvbGxhYmxlIHN1cHBvcnRSZXRyaWV2YWxNZXRob2RzXG5sZXQgbW9ja1N1cHBvcnRSZXRyaWV2YWxNZXRob2RzOiBSRVRSSUVWRV9NRVRIT0RbXSA9IFtcbiAgUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gIFJFVFJJRVZFX01FVEhPRC5oeWJyaWQsXG5dXG5cbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUHJvdmlkZXJDb250ZXh0OiAoKSA9PiAoe1xuICAgIHN1cHBvcnRSZXRyaWV2YWxNZXRob2RzOiBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgbW9kZWwgaG9va3Mgd2l0aCBjb250cm9sbGFibGUgcmV0dXJuIHZhbHVlc1xubGV0IG1vY2tSZXJhbmtEZWZhdWx0TW9kZWw6IHsgcHJvdmlkZXI6IHsgcHJvdmlkZXI6IHN0cmluZyB9LCBtb2RlbDogc3RyaW5nIH0gfCB1bmRlZmluZWQgPSB7XG4gIHByb3ZpZGVyOiB7IHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicgfSxcbiAgbW9kZWw6ICd0ZXN0LXJlcmFuay1tb2RlbCcsXG59XG5sZXQgbW9ja0lzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSB0cnVlXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWw6ICgpID0+ICh7XG4gICAgZGVmYXVsdE1vZGVsOiBtb2NrUmVyYW5rRGVmYXVsdE1vZGVsLFxuICAgIGN1cnJlbnRNb2RlbDogbW9ja0lzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgY2hpbGQgY29tcG9uZW50IFJldHJpZXZhbFBhcmFtQ29uZmlnIHRvIHNpbXBsaWZ5IHRlc3RpbmdcbnZpLm1vY2soJy4uL3JldHJpZXZhbC1wYXJhbS1jb25maWcnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyB0eXBlLCB2YWx1ZSwgb25DaGFuZ2UsIHNob3dNdWx0aU1vZGFsVGlwIH06IHtcbiAgICB0eXBlOiBSRVRSSUVWRV9NRVRIT0RcbiAgICB2YWx1ZTogUmV0cmlldmFsQ29uZmlnXG4gICAgb25DaGFuZ2U6ICh2OiBSZXRyaWV2YWxDb25maWcpID0+IHZvaWRcbiAgICBzaG93TXVsdGlNb2RhbFRpcD86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9e2ByZXRyaWV2YWwtcGFyYW0tY29uZmlnLSR7dHlwZX1gfT5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFyYW0tY29uZmlnLXR5cGVcIj57dHlwZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInBhcmFtLWNvbmZpZy1tdWx0aW1vZGFsLXRpcFwiPntTdHJpbmcoc2hvd011bHRpTW9kYWxUaXApfTwvc3Bhbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9e2B1cGRhdGUtdG9wLWstJHt0eXBlfWB9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHsgLi4udmFsdWUsIHRvcF9rOiAxMCB9KX1cbiAgICAgID5cbiAgICAgICAgVXBkYXRlIFRvcCBLXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBtb2NrIFJldHJpZXZhbENvbmZpZ1xuY29uc3QgY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyA9IChvdmVycmlkZXM6IFBhcnRpYWw8UmV0cmlldmFsQ29uZmlnPiA9IHt9KTogUmV0cmlldmFsQ29uZmlnID0+ICh7XG4gIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gIHJlcmFua2luZ19tb2RlbDoge1xuICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gIH0sXG4gIHRvcF9rOiA0LFxuICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBIZWxwZXIgdG8gcmVuZGVyIGNvbXBvbmVudCB3aXRoIGRlZmF1bHQgcHJvcHNcbmNvbnN0IHJlbmRlckNvbXBvbmVudCA9IChwcm9wczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgUmV0cmlldmFsTWV0aG9kQ29uZmlnPj4gPSB7fSkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoKSxcbiAgICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgfVxuICByZXR1cm4gcmVuZGVyKDxSZXRyaWV2YWxNZXRob2RDb25maWcgey4uLmRlZmF1bHRQcm9wc30gey4uLnByb3BzfSAvPilcbn1cblxuZGVzY3JpYmUoJ1JldHJpZXZhbE1ldGhvZENvbmZpZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gUmVzZXQgbW9jayB2YWx1ZXMgdG8gZGVmYXVsdHNcbiAgICBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgPSBbXG4gICAgICBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICBSRVRSSUVWRV9NRVRIT0QuaHlicmlkLFxuICAgIF1cbiAgICBtb2NrUmVyYW5rRGVmYXVsdE1vZGVsID0ge1xuICAgICAgcHJvdmlkZXI6IHsgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyB9LFxuICAgICAgbW9kZWw6ICd0ZXN0LXJlcmFuay1tb2RlbCcsXG4gICAgfVxuICAgIG1vY2tJc1JlcmFua0RlZmF1bHRNb2RlbFZhbGlkID0gdHJ1ZVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBiYXNpYyByZW5kZXJpbmdcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0aHJlZSByZXRyaWV2YWwgbWV0aG9kcyB3aGVuIGFsbCBhcmUgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuZnVsbF90ZXh0X3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlc2NyaXB0aW9ucyBmb3IgYWxsIHJldHJpZXZhbCBtZXRob2RzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC5kZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuZnVsbF90ZXh0X3NlYXJjaC5kZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC5kZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb25seSByZW5kZXIgc2VtYW50aWMgc2VhcmNoIHdoZW4gb25seSBzZW1hbnRpYyBpcyBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgPSBbUkVUUklFVkVfTUVUSE9ELnNlbWFudGljXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb25seSByZW5kZXIgZnVsbFRleHQgc2VhcmNoIHdoZW4gb25seSBmdWxsVGV4dCBpcyBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgPSBbUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0XVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuZnVsbF90ZXh0X3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb25seSByZW5kZXIgaHlicmlkIHNlYXJjaCB3aGVuIG9ubHkgaHlicmlkIGlzIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAgIG1vY2tTdXBwb3J0UmV0cmlldmFsTWV0aG9kcyA9IFtSRVRSSUVWRV9NRVRIT0QuaHlicmlkXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5vdGhpbmcgd2hlbiBubyByZXRyaWV2YWwgbWV0aG9kcyBhcmUgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgbW9ja1N1cHBvcnRSZXRyaWV2YWxNZXRob2RzID0gW11cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBPbmx5IHRoZSB3cmFwcGVyIGRpdiBzaG91bGQgZXhpc3RcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZD8uY2hpbGROb2Rlcy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IFJldHJpZXZhbFBhcmFtQ29uZmlnIGZvciB0aGUgYWN0aXZlIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljIH0pLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmV0cmlldmFsLXBhcmFtLWNvbmZpZy1zZW1hbnRpY19zZWFyY2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyZXRyaWV2YWwtcGFyYW0tY29uZmlnLWZ1bGxfdGV4dF9zZWFyY2gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmV0cmlldmFsLXBhcmFtLWNvbmZpZy1oeWJyaWRfc2VhcmNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBSZXRyaWV2YWxQYXJhbUNvbmZpZyBmb3IgZnVsbFRleHQgd2hlbiBhY3RpdmUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmV0cmlldmFsLXBhcmFtLWNvbmZpZy1zZW1hbnRpY19zZWFyY2gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JldHJpZXZhbC1wYXJhbS1jb25maWctZnVsbF90ZXh0X3NlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3JldHJpZXZhbC1wYXJhbS1jb25maWctaHlicmlkX3NlYXJjaCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgUmV0cmlldmFsUGFyYW1Db25maWcgZm9yIGh5YnJpZCB3aGVuIGFjdGl2ZScsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmh5YnJpZCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmV0cmlldmFsLXBhcmFtLWNvbmZpZy1zZW1hbnRpY19zZWFyY2gnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmV0cmlldmFsLXBhcmFtLWNvbmZpZy1mdWxsX3RleHRfc2VhcmNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXRyaWV2YWwtcGFyYW0tY29uZmlnLWh5YnJpZF9zZWFyY2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHByb3BzIGhhbmRsaW5nXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2hvd011bHRpTW9kYWxUaXAgdG8gUmV0cmlldmFsUGFyYW1Db25maWcnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgc2hvd011bHRpTW9kYWxUaXA6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbS1jb25maWctbXVsdGltb2RhbC10aXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlZmF1bHQgc2hvd011bHRpTW9kYWxUaXAgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtLWNvbmZpZy1tdWx0aW1vZGFsLXRpcCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGRpc2FibGVkIHN0YXRlIHRvIG9wdGlvbiBjYXJkcycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGRpc2FibGVkOiB0cnVlIH0pXG5cbiAgICAgIC8vIFdoZW4gZGlzYWJsZWQsIGNsaWNraW5nIHNob3VsZCBub3QgdHJpZ2dlciBvbkNoYW5nZVxuICAgICAgY29uc3Qgc2VtYW50aWNPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5zZW1hbnRpY19zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yXCJdJylcbiAgICAgIGV4cGVjdChzZW1hbnRpY09wdGlvbikudG9IYXZlQ2xhc3MoJ2N1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGVmYXVsdCBkaXNhYmxlZCB0byBmYWxzZScsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGNvbnN0IHNlbWFudGljT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvclwiXScpXG4gICAgICBleHBlY3Qoc2VtYW50aWNPcHRpb24pLm5vdC50b0hhdmVDbGFzcygnY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXZlbnQgaGFuZGxlcnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIHN3aXRjaGluZyB0byBzZW1hbnRpYyBzZWFyY2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0IH0pLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHNlbWFudGljT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZW1hbnRpY09wdGlvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiBzd2l0Y2hpbmcgdG8gZnVsbFRleHQgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBmdWxsVGV4dE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLmZ1bGxfdGV4dF9zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZ1bGxUZXh0T3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIHN3aXRjaGluZyB0byBoeWJyaWQgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBoeWJyaWRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhoeWJyaWRPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5oeWJyaWQsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25DaGFuZ2Ugd2hlbiBjbGlja2luZyB0aGUgYWxyZWFkeSBhY3RpdmUgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBzZW1hbnRpY09wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2VtYW50aWNPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNoYW5nZSB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgIGRpc2FibGVkOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgZnVsbFRleHRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZnVsbFRleHRPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm9wYWdhdGUgb25DaGFuZ2UgZnJvbSBSZXRyaWV2YWxQYXJhbUNvbmZpZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoeyBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMgfSksXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgdXBkYXRlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCd1cGRhdGUtdG9wLWstc2VtYW50aWNfc2VhcmNoJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh1cGRhdGVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICB0b3BfazogMTAsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHJlcmFua2luZyBtb2RlbCBjb25maWd1cmF0aW9uXG4gIGRlc2NyaWJlKCdSZXJhbmtpbmcgTW9kZWwgQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCByZXJhbmtpbmcgbW9kZWwgd2hlbiBzd2l0Y2hpbmcgdG8gc2VtYW50aWMgYW5kIG1vZGVsIGlzIHZhbGlkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0LFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHNlbWFudGljT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZW1hbnRpY09wdGlvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJ3Rlc3QtcmVyYW5rLW1vZGVsJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIGV4aXN0aW5nIHJlcmFua2luZyBtb2RlbCB3aGVuIHN3aXRjaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZXhpc3RpbmdNb2RlbCA9IHtcbiAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICdleGlzdGluZy1wcm92aWRlcicsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnZXhpc3RpbmctbW9kZWwnLFxuICAgICAgfVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IGV4aXN0aW5nTW9kZWwsXG4gICAgICAgIH0pLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHNlbWFudGljT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZW1hbnRpY09wdGlvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IGV4aXN0aW5nTW9kZWwsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHJlcmFua2luZ19lbmFibGUgdG8gZmFsc2Ugd2hlbiBubyB2YWxpZCBtb2RlbCcsICgpID0+IHtcbiAgICAgIG1vY2tJc1JlcmFua0RlZmF1bHRNb2RlbFZhbGlkID0gZmFsc2VcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBzZW1hbnRpY09wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2VtYW50aWNPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCByZXJhbmtpbmdfbW9kZSBmb3IgaHlicmlkIHNlYXJjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBoeWJyaWRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhoeWJyaWRPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmh5YnJpZCxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZTogUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWwsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCB3ZWlnaHRlZCBzY29yZSBtb2RlIHdoZW4gbm8gdmFsaWQgcmVyYW5rIG1vZGVsIGZvciBoeWJyaWQnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNSZXJhbmtEZWZhdWx0TW9kZWxWYWxpZCA9IGZhbHNlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsXG4gICAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgaHlicmlkT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soaHlicmlkT3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHJlcmFua2luZ19tb2RlOiBSZXJhbmtpbmdNb2RlRW51bS5XZWlnaHRlZFNjb3JlLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgZGVmYXVsdCB3ZWlnaHRzIGZvciBoeWJyaWQgc2VhcmNoIHdoZW4gbm8gZXhpc3Rpbmcgd2VpZ2h0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICB3ZWlnaHRzOiB1bmRlZmluZWQsXG4gICAgICAgIH0pLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGh5YnJpZE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLmh5YnJpZF9zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGh5YnJpZE9wdGlvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICB3ZWlnaHRzOiB7XG4gICAgICAgICAgICB3ZWlnaHRfdHlwZTogV2VpZ2h0ZWRTY29yZUVudW0uQ3VzdG9taXplZCxcbiAgICAgICAgICAgIHZlY3Rvcl9zZXR0aW5nOiB7XG4gICAgICAgICAgICAgIHZlY3Rvcl93ZWlnaHQ6IERFRkFVTFRfV0VJR0hURURfU0NPUkUub3RoZXIuc2VtYW50aWMsXG4gICAgICAgICAgICAgIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgZW1iZWRkaW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGtleXdvcmRfc2V0dGluZzoge1xuICAgICAgICAgICAgICBrZXl3b3JkX3dlaWdodDogREVGQVVMVF9XRUlHSFRFRF9TQ09SRS5vdGhlci5rZXl3b3JkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBleGlzdGluZyB3ZWlnaHRzIGZvciBoeWJyaWQgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmdXZWlnaHRzID0ge1xuICAgICAgICB3ZWlnaHRfdHlwZTogV2VpZ2h0ZWRTY29yZUVudW0uQ3VzdG9taXplZCxcbiAgICAgICAgdmVjdG9yX3NldHRpbmc6IHtcbiAgICAgICAgICB2ZWN0b3Jfd2VpZ2h0OiAwLjgsXG4gICAgICAgICAgZW1iZWRkaW5nX3Byb3ZpZGVyX25hbWU6ICd0ZXN0LWVtYmVkLXByb3ZpZGVyJyxcbiAgICAgICAgICBlbWJlZGRpbmdfbW9kZWxfbmFtZTogJ3Rlc3QtZW1iZWQtbW9kZWwnLFxuICAgICAgICB9LFxuICAgICAgICBrZXl3b3JkX3NldHRpbmc6IHtcbiAgICAgICAgICBrZXl3b3JkX3dlaWdodDogMC4yLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHdlaWdodHM6IGV4aXN0aW5nV2VpZ2h0cyxcbiAgICAgICAgfSksXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgaHlicmlkT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soaHlicmlkT3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHdlaWdodHM6IGV4aXN0aW5nV2VpZ2h0cyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIFJlcmFua2luZ01vZGVsIG1vZGUgYW5kIGVuYWJsZSByZXJhbmtpbmcgZm9yIGh5YnJpZCB3aGVuIGV4aXN0aW5nIHJlcmFua2luZyBtb2RlbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnZXhpc3RpbmctcHJvdmlkZXInLFxuICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICdleGlzdGluZy1tb2RlbCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgaHlicmlkT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soaHlicmlkT3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5oeWJyaWQsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZTogUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWwsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNhbGxiYWNrIHN0YWJpbGl0eSBhbmQgbWVtb2l6YXRpb25cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBvblN3aXRjaCBjYWxsYmFjayB3aGVuIHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlMSA9IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoeyBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsIHRvcF9rOiA0IH0pXG4gICAgICBjb25zdCB2YWx1ZTIgPSBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0LCB0b3BfazogOCB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxSZXRyaWV2YWxNZXRob2RDb25maWcgdmFsdWU9e3ZhbHVlMX0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgc2VtYW50aWNPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5zZW1hbnRpY19zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNlbWFudGljT3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgcmVyZW5kZXIoPFJldHJpZXZhbE1ldGhvZENvbmZpZyB2YWx1ZT17dmFsdWUyfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2VtYW50aWNPcHRpb24hKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdXBkYXRlZCBvbkNoYW5nZSBjYWxsYmFjayBhZnRlciByZXJlbmRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uQ2hhbmdlMiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhbHVlID0gY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxSZXRyaWV2YWxNZXRob2RDb25maWcgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17b25DaGFuZ2UxfSAvPixcbiAgICAgIClcblxuICAgICAgcmVyZW5kZXIoPFJldHJpZXZhbE1ldGhvZENvbmZpZyB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtvbkNoYW5nZTJ9IC8+KVxuXG4gICAgICBjb25zdCBzZW1hbnRpY09wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2VtYW50aWNPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UxKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25DaGFuZ2UyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBjb21wb25lbnQgbWVtb2l6YXRpb25cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIFZlcmlmeSB0aGUgY29tcG9uZW50IGlzIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vIGJ5IGNoZWNraW5nIGl0cyBkaXNwbGF5TmFtZSBvciB0eXBlXG4gICAgICBleHBlY3QoUmV0cmlldmFsTWV0aG9kQ29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICAvLyBSZWFjdC5tZW1vIGNvbXBvbmVudHMgaGF2ZSBhICQkdHlwZW9mIHByb3BlcnR5XG4gICAgICBleHBlY3QoKFJldHJpZXZhbE1ldGhvZENvbmZpZyBhcyBhbnkpLiQkdHlwZW9mKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgdmFsdWUgPSBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8UmV0cmlldmFsTWV0aG9kQ29uZmlnIHZhbHVlPXt2YWx1ZX0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzIHJlZmVyZW5jZVxuICAgICAgcmVyZW5kZXIoPFJldHJpZXZhbE1ldGhvZENvbmZpZyB2YWx1ZT17dmFsdWV9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgc3RpbGwgYmUgcmVuZGVyZWQgY29ycmVjdGx5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBlZGdlIGNhc2VzIGFuZCBlcnJvciBoYW5kbGluZ1xuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcmVyYW5raW5nX21vZGVsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCB2YWx1ZSA9IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICB9KVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgZWRnZSBjYXNlXG4gICAgICB2YWx1ZS5yZXJhbmtpbmdfbW9kZWwgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIG9uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgLy8gU2hvdWxkIG5vdCBjcmFzaFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgZGVmYXVsdCBtb2RlbCcsICgpID0+IHtcbiAgICAgIG1vY2tSZXJhbmtEZWZhdWx0TW9kZWwgPSB1bmRlZmluZWRcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBzZW1hbnRpY09wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2VtYW50aWNPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsXG4gICAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGZhbGxiYWNrIGVtcHR5IHN0cmluZyB3aGVuIGRlZmF1bHQgbW9kZWwgcHJvdmlkZXIgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgZWRnZSBjYXNlIHdoZXJlIHByb3ZpZGVyIGlzIHVuZGVmaW5lZFxuICAgICAgbW9ja1JlcmFua0RlZmF1bHRNb2RlbCA9IHsgcHJvdmlkZXI6IHVuZGVmaW5lZCwgbW9kZWw6ICd0ZXN0LW1vZGVsJyB9XG4gICAgICBtb2NrSXNSZXJhbmtEZWZhdWx0TW9kZWxWYWxpZCA9IHRydWVcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoe1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dCxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBoeWJyaWRPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhoeWJyaWRPcHRpb24hKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsXG4gICAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJ3Rlc3QtbW9kZWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBmYWxsYmFjayBlbXB0eSBzdHJpbmcgd2hlbiBkZWZhdWx0IG1vZGVsIG5hbWUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgZWRnZSBjYXNlIHdoZXJlIG1vZGVsIGlzIHVuZGVmaW5lZFxuICAgICAgbW9ja1JlcmFua0RlZmF1bHRNb2RlbCA9IHsgcHJvdmlkZXI6IHsgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyB9LCBtb2RlbDogdW5kZWZpbmVkIH1cbiAgICAgIG1vY2tJc1JlcmFua0RlZmF1bHRNb2RlbFZhbGlkID0gdHJ1ZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0LFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBvbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGh5YnJpZE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLmh5YnJpZF9zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGh5YnJpZE9wdGlvbiEpXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIHNlcXVlbnRpYWwgY2xpY2tzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgb25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBmdWxsVGV4dE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLmZ1bGxfdGV4dF9zZWFyY2gudGl0bGUnKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgY29uc3QgaHlicmlkT3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG5cbiAgICAgIC8vIFJhcGlkIGNsaWNrc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZ1bGxUZXh0T3B0aW9uISlcbiAgICAgIGZpcmVFdmVudC5jbGljayhoeWJyaWRPcHRpb24hKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZ1bGxUZXh0T3B0aW9uISlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgYXJyYXknLCAoKSA9PiB7XG4gICAgICBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgPSBbXVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImZsZXgtY29sXCJdJyk/LmNoaWxkTm9kZXMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBhcnRpYWwgc3VwcG9ydFJldHJpZXZhbE1ldGhvZHMnLCAoKSA9PiB7XG4gICAgICBtb2NrU3VwcG9ydFJldHJpZXZhbE1ldGhvZHMgPSBbUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLCBSRVRSSUVWRV9NRVRIT0QuaHlicmlkXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbHVlIHdpdGggYWxsIG9wdGlvbmFsIGZpZWxkcyBzZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmdWxsVmFsdWUgPSBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHtcbiAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmh5YnJpZCxcbiAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICdwcm92aWRlcicsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICdtb2RlbCcsXG4gICAgICAgIH0sXG4gICAgICAgIHRvcF9rOiAxMCxcbiAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC44LFxuICAgICAgICByZXJhbmtpbmdfbW9kZTogUmVyYW5raW5nTW9kZUVudW0uV2VpZ2h0ZWRTY29yZSxcbiAgICAgICAgd2VpZ2h0czoge1xuICAgICAgICAgIHdlaWdodF90eXBlOiBXZWlnaHRlZFNjb3JlRW51bS5DdXN0b21pemVkLFxuICAgICAgICAgIHZlY3Rvcl9zZXR0aW5nOiB7XG4gICAgICAgICAgICB2ZWN0b3Jfd2VpZ2h0OiAwLjYsXG4gICAgICAgICAgICBlbWJlZGRpbmdfcHJvdmlkZXJfbmFtZTogJ2VtYmVkLXByb3ZpZGVyJyxcbiAgICAgICAgICAgIGVtYmVkZGluZ19tb2RlbF9uYW1lOiAnZW1iZWQtbW9kZWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5d29yZF9zZXR0aW5nOiB7XG4gICAgICAgICAgICBrZXl3b3JkX3dlaWdodDogMC40LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogZnVsbFZhbHVlIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JldHJpZXZhbC1wYXJhbS1jb25maWctaHlicmlkX3NlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYWxsIHByb3AgdmFyaWF0aW9uc1xuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggbWluaW11bSByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxSZXRyaWV2YWxNZXRob2RDb25maWdcbiAgICAgICAgICB2YWx1ZT17Y3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZygpfVxuICAgICAgICAgIG9uQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggYWxsIHByb3BzIHNldCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIGRpc2FibGVkOiB0cnVlLFxuICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5oeWJyaWQgfSksXG4gICAgICAgIHNob3dNdWx0aU1vZGFsVGlwOiB0cnVlLFxuICAgICAgICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Rpc2FibGVkIHByb3AgdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpc2FibGVkPXRydWUnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7IGRpc2FibGVkOiB0cnVlIH0pXG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3JcIl0nKVxuICAgICAgICBleHBlY3Qob3B0aW9uKS50b0hhdmVDbGFzcygnY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpc2FibGVkPWZhbHNlJywgKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBkaXNhYmxlZDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLnRpdGxlJykuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvclwiXScpXG4gICAgICAgIGV4cGVjdChvcHRpb24pLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2VhcmNoX21ldGhvZCB2YXJpYXRpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWV0aG9kcyA9IFtcbiAgICAgICAgUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICAgIFJFVFJJRVZFX01FVEhPRC5oeWJyaWQsXG4gICAgICBdXG5cbiAgICAgIGl0LmVhY2gobWV0aG9kcykoJ3Nob3VsZCBjb3JyZWN0bHkgaGlnaGxpZ2h0ICVzIHdoZW4gYWN0aXZlJywgKG1ldGhvZCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoe1xuICAgICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogbWV0aG9kIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIFRoZSBhY3RpdmUgbWV0aG9kIHNob3VsZCBoYXZlIGl0cyBSZXRyaWV2YWxQYXJhbUNvbmZpZyByZW5kZXJlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGByZXRyaWV2YWwtcGFyYW0tY29uZmlnLSR7bWV0aG9kfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc2hvd011bHRpTW9kYWxUaXAgdmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyB0cnVlIHRvIGNoaWxkIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgICB2YWx1ZTogY3JlYXRlTW9ja1JldHJpZXZhbENvbmZpZyh7IHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyB9KSxcbiAgICAgICAgICBzaG93TXVsdGlNb2RhbFRpcDogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW0tY29uZmlnLW11bHRpbW9kYWwtdGlwJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBmYWxzZSB0byBjaGlsZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoeyBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMgfSksXG4gICAgICAgICAgc2hvd011bHRpTW9kYWxUaXA6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbS1jb25maWctbXVsdGltb2RhbC10aXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYWN0aXZlIHN0YXRlIHZpc3VhbCBpbmRpY2F0aW9uXG4gIGRlc2NyaWJlKCdBY3RpdmUgU3RhdGUgVmlzdWFsIEluZGljYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlY29tbWVuZGVkIGJhZGdlIG9ubHkgb24gaHlicmlkIHNlYXJjaCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIFRoZSBoeWJyaWQgc2VhcmNoIG9wdGlvbiBzaG91bGQgaGF2ZSB0aGUgcmVjb21tZW5kZWQgYmFkZ2VcbiAgICAgIC8vIFRoaXMgaXMgdmVyaWZpZWQgYnkgY2hlY2tpbmcgdGhlIGlzUmVjb21tZW5kZWQgcHJvcCBwYXNzZWQgdG8gT3B0aW9uQ2FyZFxuICAgICAgY29uc3QgaHlicmlkVGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJylcbiAgICAgIGNvbnN0IGh5YnJpZENhcmQgPSBoeWJyaWRUaXRsZS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yXCJdJylcblxuICAgICAgLy8gU2hvdWxkIGNvbnRhaW4gcmVjb21tZW5kZWQgYmFkZ2UgZnJvbSBPcHRpb25DYXJkXG4gICAgICBleHBlY3QoaHlicmlkQ2FyZD8ucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImJhZGdlXCJdJykgfHwgc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcFR3by5yZWNvbW1lbmQnKSkudG9CZVRydXRoeSgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgaW50ZWdyYXRpb24gd2l0aCBPcHRpb25DYXJkXG4gIGRlc2NyaWJlKCdPcHRpb25DYXJkIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHByb3BzIHRvIE9wdGlvbkNhcmQgZm9yIHNlbWFudGljIHNlYXJjaCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljIH0pLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgc2VtYW50aWNUaXRsZSA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScpXG4gICAgICBleHBlY3Qoc2VtYW50aWNUaXRsZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGVjayBkZXNjcmlwdGlvblxuICAgICAgY29uc3Qgc2VtYW50aWNEZXNjID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLmRlc2NyaXB0aW9uJylcbiAgICAgIGV4cGVjdChzZW1hbnRpY0Rlc2MpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgcHJvcHMgdG8gT3B0aW9uQ2FyZCBmb3IgZnVsbFRleHQgc2VhcmNoJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHtcbiAgICAgICAgdmFsdWU6IGNyZWF0ZU1vY2tSZXRyaWV2YWxDb25maWcoeyBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQgfSksXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBmdWxsVGV4dFRpdGxlID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuZnVsbF90ZXh0X3NlYXJjaC50aXRsZScpXG4gICAgICBleHBlY3QoZnVsbFRleHRUaXRsZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBjb25zdCBmdWxsVGV4dERlc2MgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0LnJldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLmRlc2NyaXB0aW9uJylcbiAgICAgIGV4cGVjdChmdWxsVGV4dERlc2MpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgcHJvcHMgdG8gT3B0aW9uQ2FyZCBmb3IgaHlicmlkIHNlYXJjaCcsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgIHZhbHVlOiBjcmVhdGVNb2NrUmV0cmlldmFsQ29uZmlnKHsgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmh5YnJpZCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGh5YnJpZFRpdGxlID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC5yZXRyaWV2YWwuaHlicmlkX3NlYXJjaC50aXRsZScpXG4gICAgICBleHBlY3QoaHlicmlkVGl0bGUpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgY29uc3QgaHlicmlkRGVzYyA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQucmV0cmlldmFsLmh5YnJpZF9zZWFyY2guZGVzY3JpcHRpb24nKVxuICAgICAgZXhwZWN0KGh5YnJpZERlc2MpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==