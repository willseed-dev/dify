"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const config_content_1 = require("./config-content");
vi.mock('@/app/components/header/account-setting/model-provider-page/model-selector', () => {
    const MockModelSelector = ({ defaultModel, onSelect }) => (<button type="button" onClick={() => onSelect?.(defaultModel ?? { provider: 'mock-provider', model: 'mock-model' })}>
      Mock ModelSelector
    </button>);
    return {
        default: MockModelSelector,
    };
});
vi.mock('@/app/components/header/account-setting/model-provider-page/model-parameter-modal', () => ({
    default: () => <div data-testid="model-parameter-modal"/>,
}));
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelListAndDefaultModelAndCurrentProviderAndModel: vi.fn(),
    useCurrentProviderAndModel: vi.fn(),
}));
const mockedUseModelListAndDefaultModelAndCurrentProviderAndModel = hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel;
const mockedUseCurrentProviderAndModel = hooks_1.useCurrentProviderAndModel;
let toastNotifySpy;
const baseRetrievalConfig = {
    search_method: app_1.RETRIEVE_METHOD.semantic,
    reranking_enable: false,
    reranking_model: {
        reranking_provider_name: 'provider',
        reranking_model_name: 'rerank-model',
    },
    top_k: 4,
    score_threshold_enabled: false,
    score_threshold: 0,
};
const defaultIndexingTechnique = 'high_quality';
const createDataset = (overrides = {}) => {
    const { retrieval_model, retrieval_model_dict, icon_info, ...restOverrides } = overrides;
    const resolvedRetrievalModelDict = {
        ...baseRetrievalConfig,
        ...retrieval_model_dict,
    };
    const resolvedRetrievalModel = {
        ...baseRetrievalConfig,
        ...(retrieval_model ?? retrieval_model_dict),
    };
    const defaultIconInfo = {
        icon: '📘',
        icon_type: 'emoji',
        icon_background: '#FFEAD5',
        icon_url: '',
    };
    const resolvedIconInfo = ('icon_info' in overrides)
        ? icon_info
        : defaultIconInfo;
    return {
        id: 'dataset-id',
        name: 'Dataset Name',
        indexing_status: 'completed',
        icon_info: resolvedIconInfo,
        description: 'A test dataset',
        permission: datasets_1.DatasetPermission.onlyMe,
        data_source_type: datasets_1.DataSourceType.FILE,
        indexing_technique: defaultIndexingTechnique,
        author_name: 'author',
        created_by: 'creator',
        updated_by: 'updater',
        updated_at: 0,
        app_count: 0,
        doc_form: datasets_1.ChunkingMode.text,
        document_count: 0,
        total_document_count: 0,
        total_available_documents: 0,
        word_count: 0,
        provider: 'dify',
        embedding_model: 'text-embedding',
        embedding_model_provider: 'openai',
        embedding_available: true,
        retrieval_model_dict: resolvedRetrievalModelDict,
        retrieval_model: resolvedRetrievalModel,
        tags: [],
        external_knowledge_info: {
            external_knowledge_id: 'external-id',
            external_knowledge_api_id: 'api-id',
            external_knowledge_api_name: 'api-name',
            external_knowledge_api_endpoint: 'https://endpoint',
        },
        external_retrieval_model: {
            top_k: 2,
            score_threshold: 0.5,
            score_threshold_enabled: true,
        },
        built_in_field_enabled: true,
        doc_metadata: [],
        keyword_number: 3,
        pipeline_id: 'pipeline-id',
        is_published: true,
        runtime_mode: 'general',
        enable_api: true,
        is_multimodal: false,
        ...restOverrides,
    };
};
const createDatasetConfigs = (overrides = {}) => {
    return {
        retrieval_model: app_1.RETRIEVE_TYPE.multiWay,
        reranking_model: {
            reranking_provider_name: '',
            reranking_model_name: '',
        },
        top_k: 4,
        score_threshold_enabled: false,
        score_threshold: 0,
        datasets: {
            datasets: [],
        },
        reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
        weights: {
            weight_type: datasets_1.WeightedScoreEnum.Customized,
            vector_setting: {
                vector_weight: 0.5,
                embedding_provider_name: 'openai',
                embedding_model_name: 'text-embedding',
            },
            keyword_setting: {
                keyword_weight: 0.5,
            },
        },
        reranking_enable: false,
        ...overrides,
    };
};
describe('ConfigContent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        toastNotifySpy = vi.spyOn(toast_1.default, 'notify').mockImplementation(() => ({}));
        mockedUseModelListAndDefaultModelAndCurrentProviderAndModel.mockReturnValue({
            modelList: [],
            defaultModel: undefined,
            currentProvider: undefined,
            currentModel: undefined,
        });
        mockedUseCurrentProviderAndModel.mockReturnValue({
            currentProvider: undefined,
            currentModel: undefined,
        });
    });
    afterEach(() => {
        toastNotifySpy.mockRestore();
    });
    // State management
    describe('Effects', () => {
        it('should normalize oneWay retrieval mode to multiWay', async () => {
            // Arrange
            const onChange = vi.fn();
            const datasetConfigs = createDatasetConfigs({ retrieval_model: app_1.RETRIEVE_TYPE.oneWay });
            // Act
            (0, react_1.render)(<config_content_1.default datasetConfigs={datasetConfigs} onChange={onChange}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onChange).toHaveBeenCalled();
            });
            const [nextConfigs] = onChange.mock.calls[0];
            expect(nextConfigs.retrieval_model).toBe(app_1.RETRIEVE_TYPE.multiWay);
        });
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render weighted score panel when datasets are high-quality and consistent', () => {
            // Arrange
            const onChange = vi.fn();
            const datasetConfigs = createDatasetConfigs({
                reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
            });
            const selectedDatasets = [
                createDataset({
                    indexing_technique: 'high_quality',
                    provider: 'dify',
                    embedding_model: 'text-embedding',
                    embedding_model_provider: 'openai',
                    retrieval_model_dict: {
                        ...baseRetrievalConfig,
                        search_method: app_1.RETRIEVE_METHOD.semantic,
                    },
                }),
            ];
            // Act
            (0, react_1.render)(<config_content_1.default datasetConfigs={datasetConfigs} onChange={onChange} selectedDatasets={selectedDatasets}/>);
            // Assert
            expect(react_1.screen.getByText('dataset.weightedScore.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.modelProvider.rerankModel.key')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.weightedScore.semantic')).toBeInTheDocument();
            expect(react_1.screen.getByText('dataset.weightedScore.keyword')).toBeInTheDocument();
        });
    });
    // User interactions
    describe('User Interactions', () => {
        it('should update weights when user changes weighted score slider', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            const datasetConfigs = createDatasetConfigs({
                reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
                weights: {
                    weight_type: datasets_1.WeightedScoreEnum.Customized,
                    vector_setting: {
                        vector_weight: 0.5,
                        embedding_provider_name: 'openai',
                        embedding_model_name: 'text-embedding',
                    },
                    keyword_setting: {
                        keyword_weight: 0.5,
                    },
                },
            });
            const selectedDatasets = [
                createDataset({
                    indexing_technique: 'high_quality',
                    provider: 'dify',
                    embedding_model: 'text-embedding',
                    embedding_model_provider: 'openai',
                    retrieval_model_dict: {
                        ...baseRetrievalConfig,
                        search_method: app_1.RETRIEVE_METHOD.semantic,
                    },
                }),
            ];
            // Act
            (0, react_1.render)(<config_content_1.default datasetConfigs={datasetConfigs} onChange={onChange} selectedDatasets={selectedDatasets}/>);
            const weightedScoreSlider = react_1.screen.getAllByRole('slider')
                .find(slider => slider.getAttribute('aria-valuemax') === '1');
            expect(weightedScoreSlider).toBeDefined();
            await user.click(weightedScoreSlider);
            const callsBefore = onChange.mock.calls.length;
            await user.keyboard('{ArrowRight}');
            // Assert
            expect(onChange.mock.calls.length).toBeGreaterThan(callsBefore);
            const [nextConfigs] = onChange.mock.calls.at(-1) ?? [];
            expect(nextConfigs?.weights?.vector_setting.vector_weight).toBeCloseTo(0.6, 5);
            expect(nextConfigs?.weights?.keyword_setting.keyword_weight).toBeCloseTo(0.4, 5);
        });
        it('should warn when switching to rerank model mode without a valid model', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            const datasetConfigs = createDatasetConfigs({
                reranking_mode: datasets_1.RerankingModeEnum.WeightedScore,
            });
            const selectedDatasets = [
                createDataset({
                    indexing_technique: 'high_quality',
                    provider: 'dify',
                    embedding_model: 'text-embedding',
                    embedding_model_provider: 'openai',
                    retrieval_model_dict: {
                        ...baseRetrievalConfig,
                        search_method: app_1.RETRIEVE_METHOD.semantic,
                    },
                }),
            ];
            // Act
            (0, react_1.render)(<config_content_1.default datasetConfigs={datasetConfigs} onChange={onChange} selectedDatasets={selectedDatasets}/>);
            await user.click(react_1.screen.getByText('common.modelProvider.rerankModel.key'));
            // Assert
            expect(toastNotifySpy).toHaveBeenCalledWith({
                type: 'error',
                message: 'workflow.errorMsg.rerankModelRequired',
            });
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_mode: datasets_1.RerankingModeEnum.RerankingModel,
            }));
        });
        it('should warn when enabling rerank without a valid model in manual toggle mode', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            const datasetConfigs = createDatasetConfigs({
                reranking_enable: false,
            });
            const selectedDatasets = [
                createDataset({
                    indexing_technique: 'economy',
                    provider: 'dify',
                    embedding_model: 'text-embedding',
                    embedding_model_provider: 'openai',
                    retrieval_model_dict: {
                        ...baseRetrievalConfig,
                        search_method: app_1.RETRIEVE_METHOD.semantic,
                    },
                }),
            ];
            // Act
            (0, react_1.render)(<config_content_1.default datasetConfigs={datasetConfigs} onChange={onChange} selectedDatasets={selectedDatasets}/>);
            await user.click(react_1.screen.getByRole('switch'));
            // Assert
            expect(toastNotifySpy).toHaveBeenCalledWith({
                type: 'error',
                message: 'workflow.errorMsg.rerankModelRequired',
            });
            expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
                reranking_enable: true,
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWNvbnRlbnQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZy1jb250ZW50LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esa0RBQWdFO0FBQ2hFLDREQUFtRDtBQUNuRCx1REFBK0M7QUFDL0MsNkZBRzBFO0FBQzFFLGdEQUF5SDtBQUN6SCxxQ0FBNEQ7QUFDNUQscURBQTRDO0FBRTVDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEVBQTRFLEVBQUUsR0FBRyxFQUFFO0lBTXpGLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQVMsRUFBRSxFQUFFLENBQUMsQ0FDL0QsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLElBQUksRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBRTlGOztJQUNGLEVBQUUsTUFBTSxDQUFDLENBQ1YsQ0FBQTtJQUVELE9BQU87UUFDTCxPQUFPLEVBQUUsaUJBQWlCO0tBQzNCLENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUZBQW1GLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsRyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHVCQUF1QixFQUFHO0NBQzNELENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xGLHFEQUFxRCxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUQsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNwQyxDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sMkRBQTJELEdB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QU0sY0FBYyxHQUFHLG9CQUFvQixDQUFDO2dCQUMxQyxnQkFBZ0IsRUFBRSxLQUFLO2FBQ3hCLENBQUMsQ0FBQTtZQUNGLE1BQU0sZ0JBQWdCLEdBQWM7Z0JBQ2xDLGFBQWEsQ0FBQztvQkFDWixrQkFBa0IsRUFBRSxTQUF5QjtvQkFDN0MsUUFBUSxFQUFFLE1BQU07b0JBQ2hCLGVBQWUsRUFBRSxnQkFBZ0I7b0JBQ2pDLHdCQUF3QixFQUFFLFFBQVE7b0JBQ2xDLG9CQUFvQixFQUFFO3dCQUNwQixHQUFHLG1CQUFtQjt3QkFDdEIsYUFBYSxFQUFFLHFCQUFlLENBQUMsUUFBUTtxQkFDeEM7aUJBQ0YsQ0FBQzthQUNILENBQUE7WUFFRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQ0osQ0FBQyx3QkFBYSxDQUNaLGNBQWMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUMvQixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsZ0JBQWdCLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUNuQyxDQUNILENBQUE7WUFDRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1lBRTVDLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQzFDLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSx1Q0FBdUM7YUFDakQsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUNuQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7YUFDdkIsQ0FBQyxDQUNILENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2tlZEZ1bmN0aW9uLCBNb2NrSW5zdGFuY2UgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgdHlwZSB7IEluZGV4aW5nVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY3JlYXRlL3N0ZXAtdHdvJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IERhdGFzZXRDb25maWdzIH0gZnJvbSAnQC9tb2RlbHMvZGVidWcnXG5pbXBvcnQgdHlwZSB7IFJldHJpZXZhbENvbmZpZyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHtcbiAgdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwsXG4gIHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCB7IENodW5raW5nTW9kZSwgRGF0YXNldFBlcm1pc3Npb24sIERhdGFTb3VyY2VUeXBlLCBSZXJhbmtpbmdNb2RlRW51bSwgV2VpZ2h0ZWRTY29yZUVudW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IFJFVFJJRVZFX01FVEhPRCwgUkVUUklFVkVfVFlQRSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IENvbmZpZ0NvbnRlbnQgZnJvbSAnLi9jb25maWctY29udGVudCdcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtc2VsZWN0b3InLCAoKSA9PiB7XG4gIHR5cGUgUHJvcHMgPSB7XG4gICAgZGVmYXVsdE1vZGVsPzogeyBwcm92aWRlcjogc3RyaW5nLCBtb2RlbDogc3RyaW5nIH1cbiAgICBvblNlbGVjdD86IChtb2RlbDogeyBwcm92aWRlcjogc3RyaW5nLCBtb2RlbDogc3RyaW5nIH0pID0+IHZvaWRcbiAgfVxuXG4gIGNvbnN0IE1vY2tNb2RlbFNlbGVjdG9yID0gKHsgZGVmYXVsdE1vZGVsLCBvblNlbGVjdCB9OiBQcm9wcykgPT4gKFxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Q/LihkZWZhdWx0TW9kZWwgPz8geyBwcm92aWRlcjogJ21vY2stcHJvdmlkZXInLCBtb2RlbDogJ21vY2stbW9kZWwnIH0pfVxuICAgID5cbiAgICAgIE1vY2sgTW9kZWxTZWxlY3RvclxuICAgIDwvYnV0dG9uPlxuICApXG5cbiAgcmV0dXJuIHtcbiAgICBkZWZhdWx0OiBNb2NrTW9kZWxTZWxlY3RvcixcbiAgfVxufSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtcGFyYW1ldGVyLW1vZGFsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cIm1vZGVsLXBhcmFtZXRlci1tb2RhbFwiIC8+LFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWw6IHZpLmZuKCksXG4gIHVzZUN1cnJlbnRQcm92aWRlckFuZE1vZGVsOiB2aS5mbigpLFxufSkpXG5cbmNvbnN0IG1vY2tlZFVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsID0gdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgYXMgTW9ja2VkRnVuY3Rpb248dHlwZW9mIHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsPlxuY29uc3QgbW9ja2VkVXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgPSB1c2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbCBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWw+XG5cbmxldCB0b2FzdE5vdGlmeVNweTogTW9ja0luc3RhbmNlXG5cbmNvbnN0IGJhc2VSZXRyaWV2YWxDb25maWc6IFJldHJpZXZhbENvbmZpZyA9IHtcbiAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICdwcm92aWRlcicsXG4gICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICdyZXJhbmstbW9kZWwnLFxuICB9LFxuICB0b3BfazogNCxcbiAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICBzY29yZV90aHJlc2hvbGQ6IDAsXG59XG5cbmNvbnN0IGRlZmF1bHRJbmRleGluZ1RlY2huaXF1ZTogSW5kZXhpbmdUeXBlID0gJ2hpZ2hfcXVhbGl0eScgYXMgSW5kZXhpbmdUeXBlXG5cbmNvbnN0IGNyZWF0ZURhdGFzZXQgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPERhdGFTZXQ+ID0ge30pOiBEYXRhU2V0ID0+IHtcbiAgY29uc3Qge1xuICAgIHJldHJpZXZhbF9tb2RlbCxcbiAgICByZXRyaWV2YWxfbW9kZWxfZGljdCxcbiAgICBpY29uX2luZm8sXG4gICAgLi4ucmVzdE92ZXJyaWRlc1xuICB9ID0gb3ZlcnJpZGVzXG5cbiAgY29uc3QgcmVzb2x2ZWRSZXRyaWV2YWxNb2RlbERpY3QgPSB7XG4gICAgLi4uYmFzZVJldHJpZXZhbENvbmZpZyxcbiAgICAuLi5yZXRyaWV2YWxfbW9kZWxfZGljdCxcbiAgfVxuICBjb25zdCByZXNvbHZlZFJldHJpZXZhbE1vZGVsID0ge1xuICAgIC4uLmJhc2VSZXRyaWV2YWxDb25maWcsXG4gICAgLi4uKHJldHJpZXZhbF9tb2RlbCA/PyByZXRyaWV2YWxfbW9kZWxfZGljdCksXG4gIH1cblxuICBjb25zdCBkZWZhdWx0SWNvbkluZm8gPSB7XG4gICAgaWNvbjogJ/Cfk5gnLFxuICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICBpY29uX2JhY2tncm91bmQ6ICcjRkZFQUQ1JyxcbiAgICBpY29uX3VybDogJycsXG4gIH1cblxuICBjb25zdCByZXNvbHZlZEljb25JbmZvID0gKCdpY29uX2luZm8nIGluIG92ZXJyaWRlcylcbiAgICA/IGljb25faW5mb1xuICAgIDogZGVmYXVsdEljb25JbmZvXG5cbiAgcmV0dXJuIHtcbiAgICBpZDogJ2RhdGFzZXQtaWQnLFxuICAgIG5hbWU6ICdEYXRhc2V0IE5hbWUnLFxuICAgIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgaWNvbl9pbmZvOiByZXNvbHZlZEljb25JbmZvIGFzIERhdGFTZXRbJ2ljb25faW5mbyddLFxuICAgIGRlc2NyaXB0aW9uOiAnQSB0ZXN0IGRhdGFzZXQnLFxuICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLm9ubHlNZSxcbiAgICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICAgIGluZGV4aW5nX3RlY2huaXF1ZTogZGVmYXVsdEluZGV4aW5nVGVjaG5pcXVlLFxuICAgIGF1dGhvcl9uYW1lOiAnYXV0aG9yJyxcbiAgICBjcmVhdGVkX2J5OiAnY3JlYXRvcicsXG4gICAgdXBkYXRlZF9ieTogJ3VwZGF0ZXInLFxuICAgIHVwZGF0ZWRfYXQ6IDAsXG4gICAgYXBwX2NvdW50OiAwLFxuICAgIGRvY19mb3JtOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICBkb2N1bWVudF9jb3VudDogMCxcbiAgICB0b3RhbF9kb2N1bWVudF9jb3VudDogMCxcbiAgICB0b3RhbF9hdmFpbGFibGVfZG9jdW1lbnRzOiAwLFxuICAgIHdvcmRfY291bnQ6IDAsXG4gICAgcHJvdmlkZXI6ICdkaWZ5JyxcbiAgICBlbWJlZGRpbmdfbW9kZWw6ICd0ZXh0LWVtYmVkZGluZycsXG4gICAgZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICBlbWJlZGRpbmdfYXZhaWxhYmxlOiB0cnVlLFxuICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiByZXNvbHZlZFJldHJpZXZhbE1vZGVsRGljdCxcbiAgICByZXRyaWV2YWxfbW9kZWw6IHJlc29sdmVkUmV0cmlldmFsTW9kZWwsXG4gICAgdGFnczogW10sXG4gICAgZXh0ZXJuYWxfa25vd2xlZGdlX2luZm86IHtcbiAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9pZDogJ2V4dGVybmFsLWlkJyxcbiAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ6ICdhcGktaWQnLFxuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9uYW1lOiAnYXBpLW5hbWUnLFxuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9lbmRwb2ludDogJ2h0dHBzOi8vZW5kcG9pbnQnLFxuICAgIH0sXG4gICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICB0b3BfazogMixcbiAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICBidWlsdF9pbl9maWVsZF9lbmFibGVkOiB0cnVlLFxuICAgIGRvY19tZXRhZGF0YTogW10sXG4gICAga2V5d29yZF9udW1iZXI6IDMsXG4gICAgcGlwZWxpbmVfaWQ6ICdwaXBlbGluZS1pZCcsXG4gICAgaXNfcHVibGlzaGVkOiB0cnVlLFxuICAgIHJ1bnRpbWVfbW9kZTogJ2dlbmVyYWwnLFxuICAgIGVuYWJsZV9hcGk6IHRydWUsXG4gICAgaXNfbXVsdGltb2RhbDogZmFsc2UsXG4gICAgLi4ucmVzdE92ZXJyaWRlcyxcbiAgfVxufVxuXG5jb25zdCBjcmVhdGVEYXRhc2V0Q29uZmlncyA9IChvdmVycmlkZXM6IFBhcnRpYWw8RGF0YXNldENvbmZpZ3M+ID0ge30pOiBEYXRhc2V0Q29uZmlncyA9PiB7XG4gIHJldHVybiB7XG4gICAgcmV0cmlldmFsX21vZGVsOiBSRVRSSUVWRV9UWVBFLm11bHRpV2F5LFxuICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgIH0sXG4gICAgdG9wX2s6IDQsXG4gICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHNjb3JlX3RocmVzaG9sZDogMCxcbiAgICBkYXRhc2V0czoge1xuICAgICAgZGF0YXNldHM6IFtdLFxuICAgIH0sXG4gICAgcmVyYW5raW5nX21vZGU6IFJlcmFua2luZ01vZGVFbnVtLldlaWdodGVkU2NvcmUsXG4gICAgd2VpZ2h0czoge1xuICAgICAgd2VpZ2h0X3R5cGU6IFdlaWdodGVkU2NvcmVFbnVtLkN1c3RvbWl6ZWQsXG4gICAgICB2ZWN0b3Jfc2V0dGluZzoge1xuICAgICAgICB2ZWN0b3Jfd2VpZ2h0OiAwLjUsXG4gICAgICAgIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiAnb3BlbmFpJyxcbiAgICAgICAgZW1iZWRkaW5nX21vZGVsX25hbWU6ICd0ZXh0LWVtYmVkZGluZycsXG4gICAgICB9LFxuICAgICAga2V5d29yZF9zZXR0aW5nOiB7XG4gICAgICAgIGtleXdvcmRfd2VpZ2h0OiAwLjUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9XG59XG5cbmRlc2NyaWJlKCdDb25maWdDb250ZW50JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICB0b2FzdE5vdGlmeVNweSA9IHZpLnNweU9uKFRvYXN0LCAnbm90aWZ5JykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+ICh7fSkpXG4gICAgbW9ja2VkVXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIG1vZGVsTGlzdDogW10sXG4gICAgICBkZWZhdWx0TW9kZWw6IHVuZGVmaW5lZCxcbiAgICAgIGN1cnJlbnRQcm92aWRlcjogdW5kZWZpbmVkLFxuICAgICAgY3VycmVudE1vZGVsOiB1bmRlZmluZWQsXG4gICAgfSlcbiAgICBtb2NrZWRVc2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3VycmVudFByb3ZpZGVyOiB1bmRlZmluZWQsXG4gICAgICBjdXJyZW50TW9kZWw6IHVuZGVmaW5lZCxcbiAgICB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgdG9hc3ROb3RpZnlTcHkubW9ja1Jlc3RvcmUoKVxuICB9KVxuXG4gIC8vIFN0YXRlIG1hbmFnZW1lbnRcbiAgZGVzY3JpYmUoJ0VmZmVjdHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgb25lV2F5IHJldHJpZXZhbCBtb2RlIHRvIG11bHRpV2F5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbjwoY29uZmlnczogRGF0YXNldENvbmZpZ3MsIGlzUmV0cmlldmFsTW9kZUNoYW5nZT86IGJvb2xlYW4pID0+IHZvaWQ+KClcbiAgICAgIGNvbnN0IGRhdGFzZXRDb25maWdzID0gY3JlYXRlRGF0YXNldENvbmZpZ3MoeyByZXRyaWV2YWxfbW9kZWw6IFJFVFJJRVZFX1RZUEUub25lV2F5IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDb25maWdDb250ZW50IGRhdGFzZXRDb25maWdzPXtkYXRhc2V0Q29uZmlnc30gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBjb25zdCBbbmV4dENvbmZpZ3NdID0gb25DaGFuZ2UubW9jay5jYWxsc1swXVxuICAgICAgZXhwZWN0KG5leHRDb25maWdzLnJldHJpZXZhbF9tb2RlbCkudG9CZShSRVRSSUVWRV9UWVBFLm11bHRpV2F5KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIHRlc3RzIChSRVFVSVJFRClcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3ZWlnaHRlZCBzY29yZSBwYW5lbCB3aGVuIGRhdGFzZXRzIGFyZSBoaWdoLXF1YWxpdHkgYW5kIGNvbnNpc3RlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuPChjb25maWdzOiBEYXRhc2V0Q29uZmlncywgaXNSZXRyaWV2YWxNb2RlQ2hhbmdlPzogYm9vbGVhbikgPT4gdm9pZD4oKVxuICAgICAgY29uc3QgZGF0YXNldENvbmZpZ3MgPSBjcmVhdGVEYXRhc2V0Q29uZmlncyh7XG4gICAgICAgIHJlcmFua2luZ19tb2RlOiBSZXJhbmtpbmdNb2RlRW51bS5XZWlnaHRlZFNjb3JlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGF0YXNldHM6IERhdGFTZXRbXSA9IFtcbiAgICAgICAgY3JlYXRlRGF0YXNldCh7XG4gICAgICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAnaGlnaF9xdWFsaXR5JyBhcyBJbmRleGluZ1R5cGUsXG4gICAgICAgICAgcHJvdmlkZXI6ICdkaWZ5JyxcbiAgICAgICAgICBlbWJlZGRpbmdfbW9kZWw6ICd0ZXh0LWVtYmVkZGluZycsXG4gICAgICAgICAgZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgICByZXRyaWV2YWxfbW9kZWxfZGljdDoge1xuICAgICAgICAgICAgLi4uYmFzZVJldHJpZXZhbENvbmZpZyxcbiAgICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDb25maWdDb250ZW50XG4gICAgICAgICAgZGF0YXNldENvbmZpZ3M9e2RhdGFzZXRDb25maWdzfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICBzZWxlY3RlZERhdGFzZXRzPXtzZWxlY3RlZERhdGFzZXRzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC53ZWlnaHRlZFNjb3JlLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ubW9kZWxQcm92aWRlci5yZXJhbmtNb2RlbC5rZXknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXQud2VpZ2h0ZWRTY29yZS5zZW1hbnRpYycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldC53ZWlnaHRlZFNjb3JlLmtleXdvcmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBpbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHdlaWdodHMgd2hlbiB1c2VyIGNoYW5nZXMgd2VpZ2h0ZWQgc2NvcmUgc2xpZGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuPChjb25maWdzOiBEYXRhc2V0Q29uZmlncywgaXNSZXRyaWV2YWxNb2RlQ2hhbmdlPzogYm9vbGVhbikgPT4gdm9pZD4oKVxuICAgICAgY29uc3QgZGF0YXNldENvbmZpZ3MgPSBjcmVhdGVEYXRhc2V0Q29uZmlncyh7XG4gICAgICAgIHJlcmFua2luZ19tb2RlOiBSZXJhbmtpbmdNb2RlRW51bS5XZWlnaHRlZFNjb3JlLFxuICAgICAgICB3ZWlnaHRzOiB7XG4gICAgICAgICAgd2VpZ2h0X3R5cGU6IFdlaWdodGVkU2NvcmVFbnVtLkN1c3RvbWl6ZWQsXG4gICAgICAgICAgdmVjdG9yX3NldHRpbmc6IHtcbiAgICAgICAgICAgIHZlY3Rvcl93ZWlnaHQ6IDAuNSxcbiAgICAgICAgICAgIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiAnb3BlbmFpJyxcbiAgICAgICAgICAgIGVtYmVkZGluZ19tb2RlbF9uYW1lOiAndGV4dC1lbWJlZGRpbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5d29yZF9zZXR0aW5nOiB7XG4gICAgICAgICAgICBrZXl3b3JkX3dlaWdodDogMC41LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhc2V0czogRGF0YVNldFtdID0gW1xuICAgICAgICBjcmVhdGVEYXRhc2V0KHtcbiAgICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6ICdoaWdoX3F1YWxpdHknIGFzIEluZGV4aW5nVHlwZSxcbiAgICAgICAgICBwcm92aWRlcjogJ2RpZnknLFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbDogJ3RleHQtZW1iZWRkaW5nJyxcbiAgICAgICAgICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7XG4gICAgICAgICAgICAuLi5iYXNlUmV0cmlldmFsQ29uZmlnLFxuICAgICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENvbmZpZ0NvbnRlbnRcbiAgICAgICAgICBkYXRhc2V0Q29uZmlncz17ZGF0YXNldENvbmZpZ3N9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHNlbGVjdGVkRGF0YXNldHM9e3NlbGVjdGVkRGF0YXNldHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB3ZWlnaHRlZFNjb3JlU2xpZGVyID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnc2xpZGVyJylcbiAgICAgICAgLmZpbmQoc2xpZGVyID0+IHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnKSA9PT0gJzEnKVxuICAgICAgZXhwZWN0KHdlaWdodGVkU2NvcmVTbGlkZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sod2VpZ2h0ZWRTY29yZVNsaWRlciEpXG4gICAgICBjb25zdCBjYWxsc0JlZm9yZSA9IG9uQ2hhbmdlLm1vY2suY2FsbHMubGVuZ3RoXG4gICAgICBhd2FpdCB1c2VyLmtleWJvYXJkKCd7QXJyb3dSaWdodH0nKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZS5tb2NrLmNhbGxzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKGNhbGxzQmVmb3JlKVxuICAgICAgY29uc3QgW25leHRDb25maWdzXSA9IG9uQ2hhbmdlLm1vY2suY2FsbHMuYXQoLTEpID8/IFtdXG4gICAgICBleHBlY3QobmV4dENvbmZpZ3M/LndlaWdodHM/LnZlY3Rvcl9zZXR0aW5nLnZlY3Rvcl93ZWlnaHQpLnRvQmVDbG9zZVRvKDAuNiwgNSlcbiAgICAgIGV4cGVjdChuZXh0Q29uZmlncz8ud2VpZ2h0cz8ua2V5d29yZF9zZXR0aW5nLmtleXdvcmRfd2VpZ2h0KS50b0JlQ2xvc2VUbygwLjQsIDUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd2FybiB3aGVuIHN3aXRjaGluZyB0byByZXJhbmsgbW9kZWwgbW9kZSB3aXRob3V0IGEgdmFsaWQgbW9kZWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm48KGNvbmZpZ3M6IERhdGFzZXRDb25maWdzLCBpc1JldHJpZXZhbE1vZGVDaGFuZ2U/OiBib29sZWFuKSA9PiB2b2lkPigpXG4gICAgICBjb25zdCBkYXRhc2V0Q29uZmlncyA9IGNyZWF0ZURhdGFzZXRDb25maWdzKHtcbiAgICAgICAgcmVyYW5raW5nX21vZGU6IFJlcmFua2luZ01vZGVFbnVtLldlaWdodGVkU2NvcmUsXG4gICAgICB9KVxuICAgICAgY29uc3Qgc2VsZWN0ZWREYXRhc2V0czogRGF0YVNldFtdID0gW1xuICAgICAgICBjcmVhdGVEYXRhc2V0KHtcbiAgICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6ICdoaWdoX3F1YWxpdHknIGFzIEluZGV4aW5nVHlwZSxcbiAgICAgICAgICBwcm92aWRlcjogJ2RpZnknLFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbDogJ3RleHQtZW1iZWRkaW5nJyxcbiAgICAgICAgICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7XG4gICAgICAgICAgICAuLi5iYXNlUmV0cmlldmFsQ29uZmlnLFxuICAgICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENvbmZpZ0NvbnRlbnRcbiAgICAgICAgICBkYXRhc2V0Q29uZmlncz17ZGF0YXNldENvbmZpZ3N9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHNlbGVjdGVkRGF0YXNldHM9e3NlbGVjdGVkRGF0YXNldHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ubW9kZWxQcm92aWRlci5yZXJhbmtNb2RlbC5rZXknKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ3dvcmtmbG93LmVycm9yTXNnLnJlcmFua01vZGVsUmVxdWlyZWQnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZTogUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWwsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHdhcm4gd2hlbiBlbmFibGluZyByZXJhbmsgd2l0aG91dCBhIHZhbGlkIG1vZGVsIGluIG1hbnVhbCB0b2dnbGUgbW9kZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbjwoY29uZmlnczogRGF0YXNldENvbmZpZ3MsIGlzUmV0cmlldmFsTW9kZUNoYW5nZT86IGJvb2xlYW4pID0+IHZvaWQ+KClcbiAgICAgIGNvbnN0IGRhdGFzZXRDb25maWdzID0gY3JlYXRlRGF0YXNldENvbmZpZ3Moe1xuICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBzZWxlY3RlZERhdGFzZXRzOiBEYXRhU2V0W10gPSBbXG4gICAgICAgIGNyZWF0ZURhdGFzZXQoe1xuICAgICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ2Vjb25vbXknIGFzIEluZGV4aW5nVHlwZSxcbiAgICAgICAgICBwcm92aWRlcjogJ2RpZnknLFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbDogJ3RleHQtZW1iZWRkaW5nJyxcbiAgICAgICAgICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7XG4gICAgICAgICAgICAuLi5iYXNlUmV0cmlldmFsQ29uZmlnLFxuICAgICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENvbmZpZ0NvbnRlbnRcbiAgICAgICAgICBkYXRhc2V0Q29uZmlncz17ZGF0YXNldENvbmZpZ3N9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHNlbGVjdGVkRGF0YXNldHM9e3NlbGVjdGVkRGF0YXNldHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ3dvcmtmbG93LmVycm9yTXNnLnJlcmFua01vZGVsUmVxdWlyZWQnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==