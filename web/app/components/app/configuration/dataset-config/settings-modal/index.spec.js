"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const toast_1 = require("@/app/components/base/toast");
const step_two_1 = require("@/app/components/datasets/create/step-two");
const constants_1 = require("@/app/components/header/account-setting/constants");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const datasets_1 = require("@/models/datasets");
const datasets_2 = require("@/service/datasets");
const use_common_1 = require("@/service/use-common");
const app_1 = require("@/types/app");
const index_1 = require("./index");
const mockNotify = vi.fn();
const mockOnCancel = vi.fn();
const mockOnSave = vi.fn();
const mockSetShowAccountSettingModal = vi.fn();
let mockIsWorkspaceDatasetOperator = false;
const mockUseModelList = vi.fn();
const mockUseModelListAndDefaultModel = vi.fn();
const mockUseModelListAndDefaultModelAndCurrentProviderAndModel = vi.fn();
const mockUseCurrentProviderAndModel = vi.fn();
const mockCheckShowMultiModalTip = vi.fn();
vi.mock('ky', () => {
    const ky = () => ky;
    ky.extend = () => ky;
    ky.create = () => ky;
    return { __esModule: true, default: ky };
});
vi.mock('@/app/components/datasets/create/step-two', () => ({
    IndexingType: {
        QUALIFIED: 'high_quality',
        ECONOMICAL: 'economy',
    },
}));
vi.mock('@/service/datasets', () => ({
    updateDatasetSetting: vi.fn(),
}));
vi.mock('@/service/use-common', async () => ({
    ...(await vi.importActual('@/service/use-common')),
    useMembers: vi.fn(),
}));
vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({ isCurrentWorkspaceDatasetOperator: mockIsWorkspaceDatasetOperator }),
    useSelector: (selector) => selector({
        userProfile: {
            id: 'user-1',
            name: 'User One',
            email: 'user@example.com',
            avatar_url: 'avatar.png',
        },
    }),
}));
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowAccountSettingModal: mockSetShowAccountSettingModal,
    }),
}));
vi.mock('@/context/i18n', () => ({
    useDocLink: () => (path) => `https://docs${path}`,
}));
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        modelProviders: [],
        textGenerationModelList: [],
        supportRetrievalMethods: [
            app_1.RETRIEVE_METHOD.semantic,
            app_1.RETRIEVE_METHOD.fullText,
            app_1.RETRIEVE_METHOD.hybrid,
            app_1.RETRIEVE_METHOD.keywordSearch,
        ],
    }),
}));
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelList: (...args) => mockUseModelList(...args),
    useModelListAndDefaultModel: (...args) => mockUseModelListAndDefaultModel(...args),
    useModelListAndDefaultModelAndCurrentProviderAndModel: (...args) => mockUseModelListAndDefaultModelAndCurrentProviderAndModel(...args),
    useCurrentProviderAndModel: (...args) => mockUseCurrentProviderAndModel(...args),
}));
vi.mock('@/app/components/header/account-setting/model-provider-page/model-selector', () => ({
    default: ({ defaultModel }) => (<div data-testid="model-selector">
      {defaultModel ? `${defaultModel.provider}/${defaultModel.model}` : 'no-model'}
    </div>),
}));
vi.mock('@/app/components/datasets/settings/utils', () => ({
    checkShowMultiModalTip: (...args) => mockCheckShowMultiModalTip(...args),
}));
const mockUpdateDatasetSetting = datasets_2.updateDatasetSetting;
const mockUseMembers = use_common_1.useMembers;
const createRetrievalConfig = (overrides = {}) => ({
    search_method: app_1.RETRIEVE_METHOD.semantic,
    reranking_enable: false,
    reranking_model: {
        reranking_provider_name: '',
        reranking_model_name: '',
    },
    top_k: 2,
    score_threshold_enabled: false,
    score_threshold: 0.5,
    reranking_mode: datasets_1.RerankingModeEnum.RerankingModel,
    ...overrides,
});
const createDataset = (overrides = {}, retrievalOverrides = {}) => {
    const retrievalConfig = createRetrievalConfig(retrievalOverrides);
    return {
        id: 'dataset-id',
        name: 'Test Dataset',
        indexing_status: 'completed',
        icon_info: {
            icon: 'icon',
            icon_type: 'emoji',
        },
        description: 'Description',
        permission: datasets_1.DatasetPermission.allTeamMembers,
        data_source_type: datasets_1.DataSourceType.FILE,
        indexing_technique: step_two_1.IndexingType.QUALIFIED,
        author_name: 'Author',
        created_by: 'creator',
        updated_by: 'updater',
        updated_at: 1700000000,
        app_count: 0,
        doc_form: datasets_1.ChunkingMode.text,
        document_count: 0,
        total_document_count: 0,
        total_available_documents: 0,
        word_count: 0,
        provider: 'internal',
        embedding_model: 'embed-model',
        embedding_model_provider: 'embed-provider',
        embedding_available: true,
        tags: [],
        partial_member_list: [],
        external_knowledge_info: {
            external_knowledge_id: 'ext-id',
            external_knowledge_api_id: 'ext-api-id',
            external_knowledge_api_name: 'External API',
            external_knowledge_api_endpoint: 'https://api.example.com',
        },
        external_retrieval_model: {
            top_k: 2,
            score_threshold: 0.5,
            score_threshold_enabled: false,
        },
        built_in_field_enabled: false,
        doc_metadata: [],
        keyword_number: 10,
        pipeline_id: 'pipeline-id',
        is_published: false,
        runtime_mode: 'general',
        enable_api: true,
        is_multimodal: false,
        ...overrides,
        retrieval_model_dict: {
            ...retrievalConfig,
            ...overrides.retrieval_model_dict,
        },
        retrieval_model: {
            ...retrievalConfig,
            ...overrides.retrieval_model,
        },
    };
};
const renderWithProviders = (dataset) => {
    return (0, react_1.render)(<toast_1.ToastContext.Provider value={{ notify: mockNotify, close: vi.fn() }}>
      <index_1.default currentDataset={dataset} onCancel={mockOnCancel} onSave={mockOnSave}/>
    </toast_1.ToastContext.Provider>);
};
const createMemberList = () => ([
    'member-2',
]);
const renderSettingsModal = async (dataset) => {
    renderWithProviders(dataset);
    await (0, react_1.waitFor)(() => expect(mockUseMembers).toHaveBeenCalled());
};
describe('SettingsModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsWorkspaceDatasetOperator = false;
        mockUseMembers.mockReturnValue({
            data: {
                accounts: [
                    {
                        id: 'user-1',
                        name: 'User One',
                        email: 'user@example.com',
                        avatar: 'avatar.png',
                        avatar_url: 'avatar.png',
                        status: 'active',
                        role: 'owner',
                    },
                    {
                        id: 'member-2',
                        name: 'Member Two',
                        email: 'member@example.com',
                        avatar: 'avatar.png',
                        avatar_url: 'avatar.png',
                        status: 'active',
                        role: 'editor',
                    },
                ],
            },
        });
        mockUseModelList.mockImplementation((type) => {
            if (type === declarations_1.ModelTypeEnum.rerank) {
                return {
                    data: [
                        {
                            provider: 'rerank-provider',
                            models: [{ model: 'rerank-model' }],
                        },
                    ],
                };
            }
            return { data: [{ provider: 'embed-provider', models: [{ model: 'embed-model' }] }] };
        });
        mockUseModelListAndDefaultModel.mockReturnValue({ modelList: [], defaultModel: null });
        mockUseModelListAndDefaultModelAndCurrentProviderAndModel.mockReturnValue({ defaultModel: null, currentModel: null });
        mockUseCurrentProviderAndModel.mockReturnValue({ currentProvider: null, currentModel: null });
        mockCheckShowMultiModalTip.mockReturnValue(false);
        mockUpdateDatasetSetting.mockResolvedValue(createDataset());
    });
    // Rendering and basic field bindings.
    describe('Rendering', () => {
        it('should render dataset details when dataset is provided', async () => {
            // Arrange
            const dataset = createDataset();
            // Act
            await renderSettingsModal(dataset);
            // Assert
            expect(react_1.screen.getByPlaceholderText('datasetSettings.form.namePlaceholder')).toHaveValue('Test Dataset');
            expect(react_1.screen.getByPlaceholderText('datasetSettings.form.descPlaceholder')).toHaveValue('Description');
        });
        it('should show external knowledge info when dataset is external', async () => {
            // Arrange
            const dataset = createDataset({
                provider: 'external',
                external_knowledge_info: {
                    external_knowledge_id: 'ext-id-123',
                    external_knowledge_api_id: 'ext-api-id-123',
                    external_knowledge_api_name: 'External Knowledge API',
                    external_knowledge_api_endpoint: 'https://api.external.com',
                },
            });
            // Act
            await renderSettingsModal(dataset);
            // Assert
            expect(react_1.screen.getByText('External Knowledge API')).toBeInTheDocument();
            expect(react_1.screen.getByText('https://api.external.com')).toBeInTheDocument();
            expect(react_1.screen.getByText('ext-id-123')).toBeInTheDocument();
        });
    });
    // User interactions that update visible state.
    describe('Interactions', () => {
        it('should call onCancel when cancel button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            await renderSettingsModal(createDataset());
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            // Assert
            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });
        it('should update name input when user types', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            await renderSettingsModal(createDataset());
            const nameInput = react_1.screen.getByPlaceholderText('datasetSettings.form.namePlaceholder');
            // Act
            await user.clear(nameInput);
            await user.type(nameInput, 'New Dataset Name');
            // Assert
            expect(nameInput).toHaveValue('New Dataset Name');
        });
        it('should update description input when user types', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            await renderSettingsModal(createDataset());
            const descriptionInput = react_1.screen.getByPlaceholderText('datasetSettings.form.descPlaceholder');
            // Act
            await user.clear(descriptionInput);
            await user.type(descriptionInput, 'New description');
            // Assert
            expect(descriptionInput).toHaveValue('New description');
        });
        it('should show and dismiss retrieval change tip when indexing method changes', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const dataset = createDataset({ indexing_technique: step_two_1.IndexingType.ECONOMICAL });
            // Act
            await renderSettingsModal(dataset);
            await user.click(react_1.screen.getByText('datasetCreation.stepTwo.qualified'));
            // Assert
            expect(await react_1.screen.findByText('appDebug.datasetConfig.retrieveChangeTip')).toBeInTheDocument();
            // Act
            await user.click(react_1.screen.getByLabelText('close-retrieval-change-tip'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('appDebug.datasetConfig.retrieveChangeTip')).not.toBeInTheDocument();
            });
        });
        it('should open account setting modal when embedding model tip is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            await renderSettingsModal(createDataset());
            await user.click(react_1.screen.getByText('datasetSettings.form.embeddingModelTipLink'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({ payload: constants_1.ACCOUNT_SETTING_TAB.PROVIDER });
        });
    });
    // Validation guardrails before saving.
    describe('Validation', () => {
        it('should block save when dataset name is empty', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            await renderSettingsModal(createDataset());
            const nameInput = react_1.screen.getByPlaceholderText('datasetSettings.form.namePlaceholder');
            // Act
            await user.clear(nameInput);
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                message: 'datasetSettings.form.nameError',
            }));
            expect(mockUpdateDatasetSetting).not.toHaveBeenCalled();
        });
        it('should block save when reranking is enabled without model', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUseModelList.mockReturnValue({ data: [] });
            const dataset = createDataset({}, createRetrievalConfig({
                reranking_enable: true,
                reranking_model: {
                    reranking_provider_name: '',
                    reranking_model_name: '',
                },
            }));
            // Act
            await renderSettingsModal(dataset);
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                message: 'appDebug.datasetConfig.rerankModelRequired',
            }));
            expect(mockUpdateDatasetSetting).not.toHaveBeenCalled();
        });
    });
    // Save flows and side effects.
    describe('Save', () => {
        it('should save internal dataset changes when form is valid', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const rerankRetrieval = createRetrievalConfig({
                reranking_enable: true,
                reranking_model: {
                    reranking_provider_name: 'rerank-provider',
                    reranking_model_name: 'rerank-model',
                },
            });
            const dataset = createDataset({
                retrieval_model: rerankRetrieval,
                retrieval_model_dict: rerankRetrieval,
            });
            // Act
            await renderSettingsModal(dataset);
            const nameInput = react_1.screen.getByPlaceholderText('datasetSettings.form.namePlaceholder');
            await user.clear(nameInput);
            await user.type(nameInput, 'Updated Internal Dataset');
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            await (0, react_1.waitFor)(() => expect(mockUpdateDatasetSetting).toHaveBeenCalled());
            expect(mockUpdateDatasetSetting).toHaveBeenCalledWith(expect.objectContaining({
                body: expect.objectContaining({
                    name: 'Updated Internal Dataset',
                    permission: datasets_1.DatasetPermission.allTeamMembers,
                }),
            }));
            expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
                type: 'success',
                message: 'common.actionMsg.modifiedSuccessfully',
            }));
            expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Updated Internal Dataset',
                retrieval_model_dict: expect.objectContaining({
                    reranking_enable: true,
                }),
            }));
        });
        it('should save external dataset changes when partial members configured', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const dataset = createDataset({
                provider: 'external',
                permission: datasets_1.DatasetPermission.partialMembers,
                partial_member_list: createMemberList(),
                external_retrieval_model: {
                    top_k: 5,
                    score_threshold: 0.3,
                    score_threshold_enabled: true,
                },
            }, {
                score_threshold_enabled: true,
                score_threshold: 0.8,
            });
            // Act
            await renderSettingsModal(dataset);
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            await (0, react_1.waitFor)(() => expect(mockUpdateDatasetSetting).toHaveBeenCalled());
            expect(mockUpdateDatasetSetting).toHaveBeenCalledWith(expect.objectContaining({
                body: expect.objectContaining({
                    permission: datasets_1.DatasetPermission.partialMembers,
                    external_retrieval_model: expect.objectContaining({
                        top_k: 5,
                    }),
                    partial_member_list: [
                        {
                            user_id: 'member-2',
                            role: 'editor',
                        },
                    ],
                }),
            }));
            expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
                retrieval_model_dict: expect.objectContaining({
                    score_threshold_enabled: true,
                    score_threshold: 0.8,
                }),
            }));
        });
        it('should disable save button while saving', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUpdateDatasetSetting.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            // Act
            await renderSettingsModal(createDataset());
            const saveButton = react_1.screen.getByRole('button', { name: 'common.operation.save' });
            await user.click(saveButton);
            // Assert
            expect(saveButton).toBeDisabled();
        });
        it('should show error toast when save fails', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockUpdateDatasetSetting.mockRejectedValue(new Error('API Error'));
            // Act
            await renderSettingsModal(createDataset());
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQWdFO0FBQ2hFLDREQUFtRDtBQUNuRCx1REFBMEQ7QUFDMUQsd0VBQXdFO0FBQ3hFLGlGQUF1RjtBQUN2RiwyR0FBd0c7QUFDeEcsZ0RBQXNHO0FBQ3RHLGlEQUF5RDtBQUN6RCxxREFBaUQ7QUFDakQscUNBQTZDO0FBQzdDLG1DQUFtQztBQUVuQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUIsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzVCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMxQixNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxJQUFJLDhCQUE4QixHQUFHLEtBQUssQ0FBQTtBQUUxQyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNoQyxNQUFNLCtCQUErQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMvQyxNQUFNLHlEQUF5RCxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN6RSxNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxNQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUUxQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDakIsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFBO0lBQ25CLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFBO0lBQ3BCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFB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QyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFL0UsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNyRixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9ja2VkRnVuY3Rpb24gfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgdHlwZSB7IERhdGFTZXQgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB0eXBlIHsgUmV0cmlldmFsQ29uZmlnIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCB7IFRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IEluZGV4aW5nVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY3JlYXRlL3N0ZXAtdHdvJ1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX1RBQiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQgeyBNb2RlbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlLCBEYXRhc2V0UGVybWlzc2lvbiwgRGF0YVNvdXJjZVR5cGUsIFJlcmFua2luZ01vZGVFbnVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyB1cGRhdGVEYXRhc2V0U2V0dGluZyB9IGZyb20gJ0Avc2VydmljZS9kYXRhc2V0cydcbmltcG9ydCB7IHVzZU1lbWJlcnMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IFJFVFJJRVZFX01FVEhPRCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IFNldHRpbmdzTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbmNvbnN0IG1vY2tPbkNhbmNlbCA9IHZpLmZuKClcbmNvbnN0IG1vY2tPblNhdmUgPSB2aS5mbigpXG5jb25zdCBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgPSB2aS5mbigpXG5sZXQgbW9ja0lzV29ya3NwYWNlRGF0YXNldE9wZXJhdG9yID0gZmFsc2VcblxuY29uc3QgbW9ja1VzZU1vZGVsTGlzdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWwgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgPSB2aS5mbigpXG5jb25zdCBtb2NrQ2hlY2tTaG93TXVsdGlNb2RhbFRpcCA9IHZpLmZuKClcblxudmkubW9jaygna3knLCAoKSA9PiB7XG4gIGNvbnN0IGt5ID0gKCkgPT4ga3lcbiAga3kuZXh0ZW5kID0gKCkgPT4ga3lcbiAga3kuY3JlYXRlID0gKCkgPT4ga3lcbiAgcmV0dXJuIHsgX19lc01vZHVsZTogdHJ1ZSwgZGVmYXVsdDoga3kgfVxufSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9jcmVhdGUvc3RlcC10d28nLCAoKSA9PiAoe1xuICBJbmRleGluZ1R5cGU6IHtcbiAgICBRVUFMSUZJRUQ6ICdoaWdoX3F1YWxpdHknLFxuICAgIEVDT05PTUlDQUw6ICdlY29ub215JyxcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvZGF0YXNldHMnLCAoKSA9PiAoe1xuICB1cGRhdGVEYXRhc2V0U2V0dGluZzogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLWNvbW1vbicsIGFzeW5jICgpID0+ICh7XG4gIC4uLihhd2FpdCB2aS5pbXBvcnRBY3R1YWwoJ0Avc2VydmljZS91c2UtY29tbW9uJykpLFxuICB1c2VNZW1iZXJzOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUFwcENvbnRleHQ6ICgpID0+ICh7IGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvcjogbW9ja0lzV29ya3NwYWNlRGF0YXNldE9wZXJhdG9yIH0pLFxuICB1c2VTZWxlY3RvcjogPFQsPihzZWxlY3RvcjogKHZhbHVlOiB7IHVzZXJQcm9maWxlOiB7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgZW1haWw6IHN0cmluZywgYXZhdGFyX3VybDogc3RyaW5nIH0gfSkgPT4gVCkgPT4gc2VsZWN0b3Ioe1xuICAgIHVzZXJQcm9maWxlOiB7XG4gICAgICBpZDogJ3VzZXItMScsXG4gICAgICBuYW1lOiAnVXNlciBPbmUnLFxuICAgICAgZW1haWw6ICd1c2VyQGV4YW1wbGUuY29tJyxcbiAgICAgIGF2YXRhcl91cmw6ICdhdmF0YXIucG5nJyxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dDogKCkgPT4gKHtcbiAgICBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbDogbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsLFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZURvY0xpbms6ICgpID0+IChwYXRoOiBzdHJpbmcpID0+IGBodHRwczovL2RvY3Mke3BhdGh9YCxcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVByb3ZpZGVyQ29udGV4dDogKCkgPT4gKHtcbiAgICBtb2RlbFByb3ZpZGVyczogW10sXG4gICAgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3Q6IFtdLFxuICAgIHN1cHBvcnRSZXRyaWV2YWxNZXRob2RzOiBbXG4gICAgICBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICBSRVRSSUVWRV9NRVRIT0QuaHlicmlkLFxuICAgICAgUkVUUklFVkVfTUVUSE9ELmtleXdvcmRTZWFyY2gsXG4gICAgXSxcbiAgfSksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VNb2RlbExpc3Q6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tVc2VNb2RlbExpc3QoLi4uYXJncyksXG4gIHVzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbDogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1VzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbCguLi5hcmdzKSxcbiAgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWw6ICguLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgbW9ja1VzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsKC4uLmFyZ3MpLFxuICB1c2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbDogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1VzZUN1cnJlbnRQcm92aWRlckFuZE1vZGVsKC4uLmFyZ3MpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL21vZGVsLXNlbGVjdG9yJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgZGVmYXVsdE1vZGVsIH06IHsgZGVmYXVsdE1vZGVsPzogeyBwcm92aWRlcjogc3RyaW5nLCBtb2RlbDogc3RyaW5nIH0gfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2RlbC1zZWxlY3RvclwiPlxuICAgICAge2RlZmF1bHRNb2RlbCA/IGAke2RlZmF1bHRNb2RlbC5wcm92aWRlcn0vJHtkZWZhdWx0TW9kZWwubW9kZWx9YCA6ICduby1tb2RlbCd9XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9zZXR0aW5ncy91dGlscycsICgpID0+ICh7XG4gIGNoZWNrU2hvd011bHRpTW9kYWxUaXA6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tDaGVja1Nob3dNdWx0aU1vZGFsVGlwKC4uLmFyZ3MpLFxufSkpXG5cbmNvbnN0IG1vY2tVcGRhdGVEYXRhc2V0U2V0dGluZyA9IHVwZGF0ZURhdGFzZXRTZXR0aW5nIGFzIE1vY2tlZEZ1bmN0aW9uPHR5cGVvZiB1cGRhdGVEYXRhc2V0U2V0dGluZz5cbmNvbnN0IG1vY2tVc2VNZW1iZXJzID0gdXNlTWVtYmVycyBhcyBNb2NrZWRGdW5jdGlvbjx0eXBlb2YgdXNlTWVtYmVycz5cblxuY29uc3QgY3JlYXRlUmV0cmlldmFsQ29uZmlnID0gKG92ZXJyaWRlczogUGFydGlhbDxSZXRyaWV2YWxDb25maWc+ID0ge30pOiBSZXRyaWV2YWxDb25maWcgPT4gKHtcbiAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyxcbiAgfSxcbiAgdG9wX2s6IDIsXG4gIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gIHJlcmFua2luZ19tb2RlOiBSZXJhbmtpbmdNb2RlRW51bS5SZXJhbmtpbmdNb2RlbCxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlRGF0YXNldCA9IChvdmVycmlkZXM6IFBhcnRpYWw8RGF0YVNldD4gPSB7fSwgcmV0cmlldmFsT3ZlcnJpZGVzOiBQYXJ0aWFsPFJldHJpZXZhbENvbmZpZz4gPSB7fSk6IERhdGFTZXQgPT4ge1xuICBjb25zdCByZXRyaWV2YWxDb25maWcgPSBjcmVhdGVSZXRyaWV2YWxDb25maWcocmV0cmlldmFsT3ZlcnJpZGVzKVxuICByZXR1cm4ge1xuICAgIGlkOiAnZGF0YXNldC1pZCcsXG4gICAgbmFtZTogJ1Rlc3QgRGF0YXNldCcsXG4gICAgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICBpY29uX2luZm86IHtcbiAgICAgIGljb246ICdpY29uJyxcbiAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiAnRGVzY3JpcHRpb24nLFxuICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLmFsbFRlYW1NZW1iZXJzLFxuICAgIGRhdGFfc291cmNlX3R5cGU6IERhdGFTb3VyY2VUeXBlLkZJTEUsXG4gICAgaW5kZXhpbmdfdGVjaG5pcXVlOiBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgIGF1dGhvcl9uYW1lOiAnQXV0aG9yJyxcbiAgICBjcmVhdGVkX2J5OiAnY3JlYXRvcicsXG4gICAgdXBkYXRlZF9ieTogJ3VwZGF0ZXInLFxuICAgIHVwZGF0ZWRfYXQ6IDE3MDAwMDAwMDAsXG4gICAgYXBwX2NvdW50OiAwLFxuICAgIGRvY19mb3JtOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICBkb2N1bWVudF9jb3VudDogMCxcbiAgICB0b3RhbF9kb2N1bWVudF9jb3VudDogMCxcbiAgICB0b3RhbF9hdmFpbGFibGVfZG9jdW1lbnRzOiAwLFxuICAgIHdvcmRfY291bnQ6IDAsXG4gICAgcHJvdmlkZXI6ICdpbnRlcm5hbCcsXG4gICAgZW1iZWRkaW5nX21vZGVsOiAnZW1iZWQtbW9kZWwnLFxuICAgIGVtYmVkZGluZ19tb2RlbF9wcm92aWRlcjogJ2VtYmVkLXByb3ZpZGVyJyxcbiAgICBlbWJlZGRpbmdfYXZhaWxhYmxlOiB0cnVlLFxuICAgIHRhZ3M6IFtdLFxuICAgIHBhcnRpYWxfbWVtYmVyX2xpc3Q6IFtdLFxuICAgIGV4dGVybmFsX2tub3dsZWRnZV9pbmZvOiB7XG4gICAgICBleHRlcm5hbF9rbm93bGVkZ2VfaWQ6ICdleHQtaWQnLFxuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9pZDogJ2V4dC1hcGktaWQnLFxuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9uYW1lOiAnRXh0ZXJuYWwgQVBJJyxcbiAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfZW5kcG9pbnQ6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbScsXG4gICAgfSxcbiAgICBleHRlcm5hbF9yZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgIHRvcF9rOiAyLFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgICBidWlsdF9pbl9maWVsZF9lbmFibGVkOiBmYWxzZSxcbiAgICBkb2NfbWV0YWRhdGE6IFtdLFxuICAgIGtleXdvcmRfbnVtYmVyOiAxMCxcbiAgICBwaXBlbGluZV9pZDogJ3BpcGVsaW5lLWlkJyxcbiAgICBpc19wdWJsaXNoZWQ6IGZhbHNlLFxuICAgIHJ1bnRpbWVfbW9kZTogJ2dlbmVyYWwnLFxuICAgIGVuYWJsZV9hcGk6IHRydWUsXG4gICAgaXNfbXVsdGltb2RhbDogZmFsc2UsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiB7XG4gICAgICAuLi5yZXRyaWV2YWxDb25maWcsXG4gICAgICAuLi5vdmVycmlkZXMucmV0cmlldmFsX21vZGVsX2RpY3QsXG4gICAgfSxcbiAgICByZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgIC4uLnJldHJpZXZhbENvbmZpZyxcbiAgICAgIC4uLm92ZXJyaWRlcy5yZXRyaWV2YWxfbW9kZWwsXG4gICAgfSxcbiAgfVxufVxuXG5jb25zdCByZW5kZXJXaXRoUHJvdmlkZXJzID0gKGRhdGFzZXQ6IERhdGFTZXQpID0+IHtcbiAgcmV0dXJuIHJlbmRlcihcbiAgICA8VG9hc3RDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IG5vdGlmeTogbW9ja05vdGlmeSwgY2xvc2U6IHZpLmZuKCkgfX0+XG4gICAgICA8U2V0dGluZ3NNb2RhbFxuICAgICAgICBjdXJyZW50RGF0YXNldD17ZGF0YXNldH1cbiAgICAgICAgb25DYW5jZWw9e21vY2tPbkNhbmNlbH1cbiAgICAgICAgb25TYXZlPXttb2NrT25TYXZlfVxuICAgICAgLz5cbiAgICA8L1RvYXN0Q29udGV4dC5Qcm92aWRlcj4sXG4gIClcbn1cblxuY29uc3QgY3JlYXRlTWVtYmVyTGlzdCA9ICgpOiBEYXRhU2V0WydwYXJ0aWFsX21lbWJlcl9saXN0J10gPT4gKFtcbiAgJ21lbWJlci0yJyxcbl0pXG5cbmNvbnN0IHJlbmRlclNldHRpbmdzTW9kYWwgPSBhc3luYyAoZGF0YXNldDogRGF0YVNldCkgPT4ge1xuICByZW5kZXJXaXRoUHJvdmlkZXJzKGRhdGFzZXQpXG4gIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG1vY2tVc2VNZW1iZXJzKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG59XG5cbmRlc2NyaWJlKCdTZXR0aW5nc01vZGFsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IgPSBmYWxzZVxuICAgIG1vY2tVc2VNZW1iZXJzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGFjY291bnRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICd1c2VyLTEnLFxuICAgICAgICAgICAgbmFtZTogJ1VzZXIgT25lJyxcbiAgICAgICAgICAgIGVtYWlsOiAndXNlckBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBhdmF0YXI6ICdhdmF0YXIucG5nJyxcbiAgICAgICAgICAgIGF2YXRhcl91cmw6ICdhdmF0YXIucG5nJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgICAgICByb2xlOiAnb3duZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdtZW1iZXItMicsXG4gICAgICAgICAgICBuYW1lOiAnTWVtYmVyIFR3bycsXG4gICAgICAgICAgICBlbWFpbDogJ21lbWJlckBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBhdmF0YXI6ICdhdmF0YXIucG5nJyxcbiAgICAgICAgICAgIGF2YXRhcl91cmw6ICdhdmF0YXIucG5nJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgICAgICByb2xlOiAnZWRpdG9yJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9IGFzIFJldHVyblR5cGU8dHlwZW9mIHVzZU1lbWJlcnM+KVxuICAgIG1vY2tVc2VNb2RlbExpc3QubW9ja0ltcGxlbWVudGF0aW9uKCh0eXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gICAgICBpZiAodHlwZSA9PT0gTW9kZWxUeXBlRW51bS5yZXJhbmspIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiAncmVyYW5rLXByb3ZpZGVyJyxcbiAgICAgICAgICAgICAgbW9kZWxzOiBbeyBtb2RlbDogJ3JlcmFuay1tb2RlbCcgfV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGRhdGE6IFt7IHByb3ZpZGVyOiAnZW1iZWQtcHJvdmlkZXInLCBtb2RlbHM6IFt7IG1vZGVsOiAnZW1iZWQtbW9kZWwnIH1dIH1dIH1cbiAgICB9KVxuICAgIG1vY2tVc2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWwubW9ja1JldHVyblZhbHVlKHsgbW9kZWxMaXN0OiBbXSwgZGVmYXVsdE1vZGVsOiBudWxsIH0pXG4gICAgbW9ja1VzZU1vZGVsTGlzdEFuZERlZmF1bHRNb2RlbEFuZEN1cnJlbnRQcm92aWRlckFuZE1vZGVsLm1vY2tSZXR1cm5WYWx1ZSh7IGRlZmF1bHRNb2RlbDogbnVsbCwgY3VycmVudE1vZGVsOiBudWxsIH0pXG4gICAgbW9ja1VzZUN1cnJlbnRQcm92aWRlckFuZE1vZGVsLm1vY2tSZXR1cm5WYWx1ZSh7IGN1cnJlbnRQcm92aWRlcjogbnVsbCwgY3VycmVudE1vZGVsOiBudWxsIH0pXG4gICAgbW9ja0NoZWNrU2hvd011bHRpTW9kYWxUaXAubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuICAgIG1vY2tVcGRhdGVEYXRhc2V0U2V0dGluZy5tb2NrUmVzb2x2ZWRWYWx1ZShjcmVhdGVEYXRhc2V0KCkpXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIGFuZCBiYXNpYyBmaWVsZCBiaW5kaW5ncy5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkYXRhc2V0IGRldGFpbHMgd2hlbiBkYXRhc2V0IGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZURhdGFzZXQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoZGF0YXNldClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0U2V0dGluZ3MuZm9ybS5uYW1lUGxhY2Vob2xkZXInKSkudG9IYXZlVmFsdWUoJ1Rlc3QgRGF0YXNldCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdkYXRhc2V0U2V0dGluZ3MuZm9ybS5kZXNjUGxhY2Vob2xkZXInKSkudG9IYXZlVmFsdWUoJ0Rlc2NyaXB0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGV4dGVybmFsIGtub3dsZWRnZSBpbmZvIHdoZW4gZGF0YXNldCBpcyBleHRlcm5hbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVEYXRhc2V0KHtcbiAgICAgICAgcHJvdmlkZXI6ICdleHRlcm5hbCcsXG4gICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9pbmZvOiB7XG4gICAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2lkOiAnZXh0LWlkLTEyMycsXG4gICAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9pZDogJ2V4dC1hcGktaWQtMTIzJyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX25hbWU6ICdFeHRlcm5hbCBLbm93bGVkZ2UgQVBJJyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2VuZHBvaW50OiAnaHR0cHM6Ly9hcGkuZXh0ZXJuYWwuY29tJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyU2V0dGluZ3NNb2RhbChkYXRhc2V0KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFeHRlcm5hbCBLbm93bGVkZ2UgQVBJJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2FwaS5leHRlcm5hbC5jb20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2V4dC1pZC0xMjMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBpbnRlcmFjdGlvbnMgdGhhdCB1cGRhdGUgdmlzaWJsZSBzdGF0ZS5cbiAgZGVzY3JpYmUoJ0ludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DYW5jZWwgd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJTZXR0aW5nc01vZGFsKGNyZWF0ZURhdGFzZXQoKSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBuYW1lIGlucHV0IHdoZW4gdXNlciB0eXBlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgYXdhaXQgcmVuZGVyU2V0dGluZ3NNb2RhbChjcmVhdGVEYXRhc2V0KCkpXG5cbiAgICAgIGNvbnN0IG5hbWVJbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnZGF0YXNldFNldHRpbmdzLmZvcm0ubmFtZVBsYWNlaG9sZGVyJylcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKG5hbWVJbnB1dClcbiAgICAgIGF3YWl0IHVzZXIudHlwZShuYW1lSW5wdXQsICdOZXcgRGF0YXNldCBOYW1lJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobmFtZUlucHV0KS50b0hhdmVWYWx1ZSgnTmV3IERhdGFzZXQgTmFtZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGRlc2NyaXB0aW9uIGlucHV0IHdoZW4gdXNlciB0eXBlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgYXdhaXQgcmVuZGVyU2V0dGluZ3NNb2RhbChjcmVhdGVEYXRhc2V0KCkpXG5cbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRTZXR0aW5ncy5mb3JtLmRlc2NQbGFjZWhvbGRlcicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGVhcihkZXNjcmlwdGlvbklucHV0KVxuICAgICAgYXdhaXQgdXNlci50eXBlKGRlc2NyaXB0aW9uSW5wdXQsICdOZXcgZGVzY3JpcHRpb24nKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbklucHV0KS50b0hhdmVWYWx1ZSgnTmV3IGRlc2NyaXB0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGFuZCBkaXNtaXNzIHJldHJpZXZhbCBjaGFuZ2UgdGlwIHdoZW4gaW5kZXhpbmcgbWV0aG9kIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVEYXRhc2V0KHsgaW5kZXhpbmdfdGVjaG5pcXVlOiBJbmRleGluZ1R5cGUuRUNPTk9NSUNBTCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoZGF0YXNldClcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUd28ucXVhbGlmaWVkJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdhcHBEZWJ1Zy5kYXRhc2V0Q29uZmlnLnJldHJpZXZlQ2hhbmdlVGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeUxhYmVsVGV4dCgnY2xvc2UtcmV0cmlldmFsLWNoYW5nZS10aXAnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwRGVidWcuZGF0YXNldENvbmZpZy5yZXRyaWV2ZUNoYW5nZVRpcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFjY291bnQgc2V0dGluZyBtb2RhbCB3aGVuIGVtYmVkZGluZyBtb2RlbCB0aXAgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoY3JlYXRlRGF0YXNldCgpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0U2V0dGluZ3MuZm9ybS5lbWJlZGRpbmdNb2RlbFRpcExpbmsnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHBheWxvYWQ6IEFDQ09VTlRfU0VUVElOR19UQUIuUFJPVklERVIgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFZhbGlkYXRpb24gZ3VhcmRyYWlscyBiZWZvcmUgc2F2aW5nLlxuICBkZXNjcmliZSgnVmFsaWRhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJsb2NrIHNhdmUgd2hlbiBkYXRhc2V0IG5hbWUgaXMgZW1wdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoY3JlYXRlRGF0YXNldCgpKVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRTZXR0aW5ncy5mb3JtLm5hbWVQbGFjZWhvbGRlcicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGVhcihuYW1lSW5wdXQpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ2RhdGFzZXRTZXR0aW5ncy5mb3JtLm5hbWVFcnJvcicsXG4gICAgICB9KSlcbiAgICAgIGV4cGVjdChtb2NrVXBkYXRlRGF0YXNldFNldHRpbmcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBibG9jayBzYXZlIHdoZW4gcmVyYW5raW5nIGlzIGVuYWJsZWQgd2l0aG91dCBtb2RlbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgbW9ja1VzZU1vZGVsTGlzdC5tb2NrUmV0dXJuVmFsdWUoeyBkYXRhOiBbXSB9KVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZURhdGFzZXQoe30sIGNyZWF0ZVJldHJpZXZhbENvbmZpZyh7XG4gICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gICAgICAgIH0sXG4gICAgICB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCByZW5kZXJTZXR0aW5nc01vZGFsKGRhdGFzZXQpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ2FwcERlYnVnLmRhdGFzZXRDb25maWcucmVyYW5rTW9kZWxSZXF1aXJlZCcsXG4gICAgICB9KSlcbiAgICAgIGV4cGVjdChtb2NrVXBkYXRlRGF0YXNldFNldHRpbmcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFNhdmUgZmxvd3MgYW5kIHNpZGUgZWZmZWN0cy5cbiAgZGVzY3JpYmUoJ1NhdmUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzYXZlIGludGVybmFsIGRhdGFzZXQgY2hhbmdlcyB3aGVuIGZvcm0gaXMgdmFsaWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IHJlcmFua1JldHJpZXZhbCA9IGNyZWF0ZVJldHJpZXZhbENvbmZpZyh7XG4gICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAncmVyYW5rLXByb3ZpZGVyJyxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJ3JlcmFuay1tb2RlbCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZURhdGFzZXQoe1xuICAgICAgICByZXRyaWV2YWxfbW9kZWw6IHJlcmFua1JldHJpZXZhbCxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHJlcmFua1JldHJpZXZhbCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyU2V0dGluZ3NNb2RhbChkYXRhc2V0KVxuXG4gICAgICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2RhdGFzZXRTZXR0aW5ncy5mb3JtLm5hbWVQbGFjZWhvbGRlcicpXG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKG5hbWVJbnB1dClcbiAgICAgIGF3YWl0IHVzZXIudHlwZShuYW1lSW5wdXQsICdVcGRhdGVkIEludGVybmFsIERhdGFzZXQnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG1vY2tVcGRhdGVEYXRhc2V0U2V0dGluZykudG9IYXZlQmVlbkNhbGxlZCgpKVxuXG4gICAgICBleHBlY3QobW9ja1VwZGF0ZURhdGFzZXRTZXR0aW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGJvZHk6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBuYW1lOiAnVXBkYXRlZCBJbnRlcm5hbCBEYXRhc2V0JyxcbiAgICAgICAgICBwZXJtaXNzaW9uOiBEYXRhc2V0UGVybWlzc2lvbi5hbGxUZWFtTWVtYmVycyxcbiAgICAgICAgfSksXG4gICAgICB9KSlcbiAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLFxuICAgICAgfSkpXG4gICAgICBleHBlY3QobW9ja09uU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBuYW1lOiAnVXBkYXRlZCBJbnRlcm5hbCBEYXRhc2V0JyxcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIH0pKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNhdmUgZXh0ZXJuYWwgZGF0YXNldCBjaGFuZ2VzIHdoZW4gcGFydGlhbCBtZW1iZXJzIGNvbmZpZ3VyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVEYXRhc2V0KHtcbiAgICAgICAgcHJvdmlkZXI6ICdleHRlcm5hbCcsXG4gICAgICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLnBhcnRpYWxNZW1iZXJzLFxuICAgICAgICBwYXJ0aWFsX21lbWJlcl9saXN0OiBjcmVhdGVNZW1iZXJMaXN0KCksXG4gICAgICAgIGV4dGVybmFsX3JldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAgIHRvcF9rOiA1LFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC4zLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjgsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoZGF0YXNldClcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IGV4cGVjdChtb2NrVXBkYXRlRGF0YXNldFNldHRpbmcpLnRvSGF2ZUJlZW5DYWxsZWQoKSlcblxuICAgICAgZXhwZWN0KG1vY2tVcGRhdGVEYXRhc2V0U2V0dGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBib2R5OiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICAgICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICB0b3BfazogNSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBwYXJ0aWFsX21lbWJlcl9saXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHVzZXJfaWQ6ICdtZW1iZXItMicsXG4gICAgICAgICAgICAgIHJvbGU6ICdlZGl0b3InLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0pKVxuICAgICAgZXhwZWN0KG1vY2tPblNhdmUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuOCxcbiAgICAgICAgfSksXG4gICAgICB9KSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHNhdmUgYnV0dG9uIHdoaWxlIHNhdmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgbW9ja1VwZGF0ZURhdGFzZXRTZXR0aW5nLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgcmVuZGVyU2V0dGluZ3NNb2RhbChjcmVhdGVEYXRhc2V0KCkpXG5cbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNhdmVCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCB3aGVuIHNhdmUgZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIG1vY2tVcGRhdGVEYXRhc2V0U2V0dGluZy5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHJlbmRlclNldHRpbmdzTW9kYWwoY3JlYXRlRGF0YXNldCgpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0eXBlOiAnZXJyb3InIH0pKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==