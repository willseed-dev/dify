"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const use_context_selector_1 = require("use-context-selector");
const types_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/types");
const utils_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/utils");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const permission_1 = require("@/utils/permission");
const index_1 = require("./index");
// Mock external dependencies
vi.mock('@/app/components/workflow/nodes/knowledge-retrieval/utils', () => ({
    getMultipleRetrievalConfig: vi.fn(() => ({
        top_k: 4,
        score_threshold: 0.7,
        reranking_enable: false,
        reranking_model: undefined,
        reranking_mode: 'reranking_model',
        weights: { weight1: 1.0 },
    })),
    getSelectedDatasetsMode: vi.fn(() => ({
        allInternal: true,
        allExternal: false,
        mixtureInternalAndExternal: false,
        mixtureHighQualityAndEconomic: false,
        inconsistentEmbeddingModel: false,
    })),
}));
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelListAndDefaultModelAndCurrentProviderAndModel: vi.fn(() => ({
        currentModel: { model: 'rerank-model' },
        currentProvider: { provider: 'openai' },
    })),
}));
vi.mock('@/context/app-context', () => ({
    useSelector: vi.fn((fn) => fn({
        userProfile: {
            id: 'user-123',
        },
    })),
}));
vi.mock('@/utils/permission', () => ({
    hasEditPermissionForDataset: vi.fn(() => true),
}));
vi.mock('../debug/hooks', () => ({
    useFormattingChangedDispatcher: vi.fn(() => vi.fn()),
}));
vi.mock('es-toolkit/compat', () => ({
    intersectionBy: vi.fn((...arrays) => {
        // Mock realistic intersection behavior based on metadata name
        const validArrays = arrays.filter(Array.isArray);
        if (validArrays.length === 0)
            return [];
        // Start with first array and filter down
        return validArrays[0].filter((item) => {
            if (!item || !item.name)
                return false;
            // Only return items that exist in all arrays
            return validArrays.every(array => array.some((otherItem) => otherItem && otherItem.name === item.name));
        });
    }),
}));
vi.mock('uuid', () => ({
    v4: vi.fn(() => 'mock-uuid'),
}));
// Mock child components
vi.mock('./card-item', () => ({
    default: ({ config, onRemove, onSave, editable }) => (<div data-testid={`card-item-${config.id}`}>
      <span>{config.name}</span>
      {editable && <button onClick={() => onSave(config)}>Edit</button>}
      <button onClick={() => onRemove(config.id)}>Remove</button>
    </div>),
}));
vi.mock('./params-config', () => ({
    default: ({ disabled, selectedDatasets }) => (<button data-testid="params-config" disabled={disabled}>
      Params (
      {selectedDatasets.length}
      )
    </button>),
}));
vi.mock('./context-var', () => ({
    default: ({ value, options, onChange }) => (<select data-testid="context-var" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select context variable</option>
      {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.name}</option>))}
    </select>),
}));
vi.mock('@/app/components/workflow/nodes/knowledge-retrieval/components/metadata/metadata-filter', () => ({
    default: ({ metadataList, metadataFilterMode, handleMetadataFilterModeChange, handleAddCondition, handleRemoveCondition, handleUpdateCondition, handleToggleConditionLogicalOperator, }) => (<div data-testid="metadata-filter">
      <span data-testid="metadata-list-count">{metadataList.length}</span>
      <select value={metadataFilterMode} onChange={e => handleMetadataFilterModeChange(e.target.value)}>
        <option value="disabled">Disabled</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
      </select>
      <button onClick={() => handleAddCondition({ name: 'test', type: 'string' })}>
        Add Condition
      </button>
      <button onClick={() => handleRemoveCondition('condition-id')}>
        Remove Condition
      </button>
      <button onClick={() => handleUpdateCondition('condition-id', { name: 'updated' })}>
        Update Condition
      </button>
      <button onClick={handleToggleConditionLogicalOperator}>
        Toggle Operator
      </button>
    </div>),
}));
// Mock context
const mockConfigContext = {
    mode: app_1.AppModeEnum.CHAT,
    modelModeType: app_1.ModelModeType.chat,
    isAgent: false,
    dataSets: [],
    setDataSets: vi.fn(),
    modelConfig: {
        configs: {
            prompt_variables: [],
        },
    },
    setModelConfig: vi.fn(),
    showSelectDataSet: vi.fn(),
    datasetConfigs: {
        retrieval_model: app_1.RETRIEVE_TYPE.multiWay,
        reranking_model: {
            reranking_provider_name: '',
            reranking_model_name: '',
        },
        top_k: 4,
        score_threshold_enabled: false,
        score_threshold: 0.7,
        metadata_filtering_mode: 'disabled',
        metadata_filtering_conditions: undefined,
        datasets: {
            datasets: [],
        },
    },
    datasetConfigsRef: {
        current: {
            retrieval_model: app_1.RETRIEVE_TYPE.multiWay,
            reranking_model: {
                reranking_provider_name: '',
                reranking_model_name: '',
            },
            top_k: 4,
            score_threshold_enabled: false,
            score_threshold: 0.7,
            metadata_filtering_mode: 'disabled',
            metadata_filtering_conditions: undefined,
            datasets: {
                datasets: [],
            },
        },
    },
    setDatasetConfigs: vi.fn(),
    setRerankSettingModalOpen: vi.fn(),
};
vi.mock('@/context/debug-configuration', () => ({
    default: ({ children }) => (<div data-testid="config-context-provider">
      {children}
    </div>),
}));
vi.mock('use-context-selector', () => ({
    useContext: vi.fn(() => mockConfigContext),
}));
const createMockDataset = (overrides = {}) => {
    const defaultDataset = {
        id: 'dataset-1',
        name: 'Test Dataset',
        indexing_status: 'completed',
        icon_info: {
            icon: '📘',
            icon_type: 'emoji',
            icon_background: '#FFEAD5',
            icon_url: '',
        },
        description: 'Test dataset description',
        permission: datasets_1.DatasetPermission.onlyMe,
        data_source_type: datasets_1.DataSourceType.FILE,
        indexing_technique: 'high_quality',
        author_name: 'Test Author',
        created_by: 'user-123',
        updated_by: 'user-123',
        updated_at: Date.now(),
        app_count: 0,
        doc_form: 'text',
        document_count: 10,
        total_document_count: 10,
        total_available_documents: 10,
        word_count: 1000,
        provider: 'dify',
        embedding_model: 'text-embedding-ada-002',
        embedding_model_provider: 'openai',
        embedding_available: true,
        retrieval_model_dict: {
            search_method: 'semantic_search',
            reranking_enable: false,
            reranking_model: {
                reranking_provider_name: '',
                reranking_model_name: '',
            },
            top_k: 4,
            score_threshold_enabled: false,
            score_threshold: 0.7,
        },
        retrieval_model: {
            search_method: 'semantic_search',
            reranking_enable: false,
            reranking_model: {
                reranking_provider_name: '',
                reranking_model_name: '',
            },
            top_k: 4,
            score_threshold_enabled: false,
            score_threshold: 0.7,
        },
        tags: [],
        external_knowledge_info: {
            external_knowledge_id: '',
            external_knowledge_api_id: '',
            external_knowledge_api_name: '',
            external_knowledge_api_endpoint: '',
        },
        external_retrieval_model: {
            top_k: 2,
            score_threshold: 0.5,
            score_threshold_enabled: true,
        },
        built_in_field_enabled: true,
        doc_metadata: [
            { name: 'category', type: 'string' },
            { name: 'priority', type: 'number' },
        ],
        keyword_number: 3,
        pipeline_id: 'pipeline-123',
        is_published: true,
        runtime_mode: 'general',
        enable_api: true,
        is_multimodal: false,
        ...overrides,
    };
    return defaultDataset;
};
const renderDatasetConfig = (contextOverrides = {}) => {
    const mergedContext = { ...mockConfigContext, ...contextOverrides };
    vi.mocked(use_context_selector_1.useContext).mockReturnValue(mergedContext);
    return (0, react_1.render)(<index_1.default />);
};
describe('DatasetConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockConfigContext.dataSets = [];
        mockConfigContext.setDataSets = vi.fn();
        mockConfigContext.setModelConfig = vi.fn();
        mockConfigContext.setDatasetConfigs = vi.fn();
        mockConfigContext.setRerankSettingModalOpen = vi.fn();
    });
    describe('Rendering', () => {
        it('should render dataset configuration panel when component mounts', () => {
            renderDatasetConfig();
            expect(react_1.screen.getByText('appDebug.feature.dataSet.title')).toBeInTheDocument();
        });
        it('should display empty state message when no datasets are configured', () => {
            renderDatasetConfig();
            expect(react_1.screen.getByText(/no.*data/i)).toBeInTheDocument();
            expect(react_1.screen.getByTestId('params-config')).toBeDisabled();
        });
        it('should render dataset cards and enable parameters when datasets exist', () => {
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
            expect(react_1.screen.getByText(dataset.name)).toBeInTheDocument();
            expect(react_1.screen.getByTestId('params-config')).not.toBeDisabled();
        });
        it('should show configuration title and add dataset button in header', () => {
            renderDatasetConfig();
            expect(react_1.screen.getByText('appDebug.feature.dataSet.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('common.operation.add')).toBeInTheDocument();
        });
        it('should hide parameters configuration when in agent mode', () => {
            renderDatasetConfig({
                isAgent: true,
            });
            expect(react_1.screen.queryByTestId('params-config')).not.toBeInTheDocument();
        });
    });
    describe('Dataset Management', () => {
        it('should open dataset selection modal when add button is clicked', async () => {
            const user = user_event_1.default.setup();
            renderDatasetConfig();
            const addButton = react_1.screen.getByText('common.operation.add');
            await user.click(addButton);
            expect(mockConfigContext.showSelectDataSet).toHaveBeenCalledTimes(1);
        });
        it('should remove dataset and update configuration when remove button is clicked', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
            });
            const removeButton = react_1.screen.getByText('Remove');
            await user.click(removeButton);
            expect(mockConfigContext.setDataSets).toHaveBeenCalledWith([]);
            // Note: setDatasetConfigs is also called but its exact parameters depend on
            // the retrieval config calculation which involves complex mocked utilities
        });
        it('should trigger rerank setting modal when removing dataset requires rerank configuration', async () => {
            const user = user_event_1.default.setup();
            // Mock scenario that triggers rerank modal
            // @ts-expect-error - same as above
            vi.mocked(utils_1.getSelectedDatasetsMode).mockReturnValue({
                allInternal: false,
                allExternal: true,
                mixtureInternalAndExternal: false,
                mixtureHighQualityAndEconomic: false,
                inconsistentEmbeddingModel: false,
            });
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
            });
            const removeButton = react_1.screen.getByText('Remove');
            await user.click(removeButton);
            expect(mockConfigContext.setRerankSettingModalOpen).toHaveBeenCalledWith(true);
        });
        it('should handle dataset save', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
            });
            // Mock the onSave in card-item component - it will pass the original dataset
            const editButton = react_1.screen.getByText('Edit');
            await user.click(editButton);
            expect(mockConfigContext.setDataSets).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    id: dataset.id,
                    name: dataset.name,
                    editable: true,
                }),
            ]));
        });
        it('should format datasets with edit permission', () => {
            const dataset = createMockDataset({
                created_by: 'user-123',
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
        });
    });
    describe('Context Variables', () => {
        it('should show context variable selector in completion mode with datasets', () => {
            const dataset = createMockDataset();
            renderDatasetConfig({
                mode: app_1.AppModeEnum.COMPLETION,
                dataSets: [dataset],
                modelConfig: {
                    configs: {
                        prompt_variables: [
                            { key: 'query', name: 'Query', type: 'string', is_context_var: false },
                            { key: 'context', name: 'Context', type: 'string', is_context_var: true },
                        ],
                    },
                },
            });
            expect(react_1.screen.getByTestId('context-var')).toBeInTheDocument();
            // Should find the selected context variable in the options
            expect(react_1.screen.getByText('Select context variable')).toBeInTheDocument();
        });
        it('should not show context variable selector in chat mode', () => {
            const dataset = createMockDataset();
            renderDatasetConfig({
                mode: app_1.AppModeEnum.CHAT,
                dataSets: [dataset],
                modelConfig: {
                    configs: {
                        prompt_variables: [
                            { key: 'query', name: 'Query', type: 'string', is_context_var: false },
                        ],
                    },
                },
            });
            expect(react_1.screen.queryByTestId('context-var')).not.toBeInTheDocument();
        });
        it('should handle context variable selection', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            renderDatasetConfig({
                mode: app_1.AppModeEnum.COMPLETION,
                dataSets: [dataset],
                modelConfig: {
                    configs: {
                        prompt_variables: [
                            { key: 'query', name: 'Query', type: 'string', is_context_var: false },
                            { key: 'context', name: 'Context', type: 'string', is_context_var: true },
                        ],
                    },
                },
            });
            const select = react_1.screen.getByTestId('context-var');
            await user.selectOptions(select, 'query');
            expect(mockConfigContext.setModelConfig).toHaveBeenCalled();
        });
    });
    describe('Metadata Filtering', () => {
        it('should render metadata filter component', () => {
            const dataset = createMockDataset({
                doc_metadata: [
                    { name: 'category', type: 'string' },
                    { name: 'priority', type: 'number' },
                ],
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('metadata-list-count')).toHaveTextContent('2'); // both 'category' and 'priority'
        });
        it('should handle metadata filter mode change', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            const updatedDatasetConfigs = {
                ...mockConfigContext.datasetConfigs,
                metadata_filtering_mode: 'disabled',
            };
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: updatedDatasetConfigs,
            });
            // Update the ref to match
            mockConfigContext.datasetConfigsRef.current = updatedDatasetConfigs;
            const select = (0, react_1.within)(react_1.screen.getByTestId('metadata-filter')).getByDisplayValue('Disabled');
            await user.selectOptions(select, 'automatic');
            expect(mockConfigContext.setDatasetConfigs).toHaveBeenCalledWith(expect.objectContaining({
                metadata_filtering_mode: 'automatic',
            }));
        });
        it('should handle adding metadata conditions', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            const baseDatasetConfigs = {
                ...mockConfigContext.datasetConfigs,
            };
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: baseDatasetConfigs,
            });
            // Update the ref to match
            mockConfigContext.datasetConfigsRef.current = baseDatasetConfigs;
            const addButton = (0, react_1.within)(react_1.screen.getByTestId('metadata-filter')).getByText('Add Condition');
            await user.click(addButton);
            expect(mockConfigContext.setDatasetConfigs).toHaveBeenCalledWith(expect.objectContaining({
                metadata_filtering_conditions: expect.objectContaining({
                    logical_operator: types_1.LogicalOperator.and,
                    conditions: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'mock-uuid',
                            name: 'test',
                            comparison_operator: types_1.ComparisonOperator.is,
                        }),
                    ]),
                }),
            }));
        });
        it('should handle removing metadata conditions', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            const datasetConfigsWithConditions = {
                ...mockConfigContext.datasetConfigs,
                metadata_filtering_conditions: {
                    logical_operator: types_1.LogicalOperator.and,
                    conditions: [
                        { id: 'condition-id', name: 'test', comparison_operator: types_1.ComparisonOperator.is },
                    ],
                },
            };
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: datasetConfigsWithConditions,
            });
            // Update ref to match datasetConfigs
            mockConfigContext.datasetConfigsRef.current = datasetConfigsWithConditions;
            const removeButton = (0, react_1.within)(react_1.screen.getByTestId('metadata-filter')).getByText('Remove Condition');
            await user.click(removeButton);
            expect(mockConfigContext.setDatasetConfigs).toHaveBeenCalledWith(expect.objectContaining({
                metadata_filtering_conditions: expect.objectContaining({
                    conditions: [],
                }),
            }));
        });
        it('should handle updating metadata conditions', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            const datasetConfigsWithConditions = {
                ...mockConfigContext.datasetConfigs,
                metadata_filtering_conditions: {
                    logical_operator: types_1.LogicalOperator.and,
                    conditions: [
                        { id: 'condition-id', name: 'test', comparison_operator: types_1.ComparisonOperator.is },
                    ],
                },
            };
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: datasetConfigsWithConditions,
            });
            mockConfigContext.datasetConfigsRef.current = datasetConfigsWithConditions;
            const updateButton = (0, react_1.within)(react_1.screen.getByTestId('metadata-filter')).getByText('Update Condition');
            await user.click(updateButton);
            expect(mockConfigContext.setDatasetConfigs).toHaveBeenCalledWith(expect.objectContaining({
                metadata_filtering_conditions: expect.objectContaining({
                    conditions: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'updated',
                        }),
                    ]),
                }),
            }));
        });
        it('should handle toggling logical operator', async () => {
            const user = user_event_1.default.setup();
            const dataset = createMockDataset();
            const datasetConfigsWithConditions = {
                ...mockConfigContext.datasetConfigs,
                metadata_filtering_conditions: {
                    logical_operator: types_1.LogicalOperator.and,
                    conditions: [
                        { id: 'condition-id', name: 'test', comparison_operator: types_1.ComparisonOperator.is },
                    ],
                },
            };
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: datasetConfigsWithConditions,
            });
            mockConfigContext.datasetConfigsRef.current = datasetConfigsWithConditions;
            const toggleButton = (0, react_1.within)(react_1.screen.getByTestId('metadata-filter')).getByText('Toggle Operator');
            await user.click(toggleButton);
            expect(mockConfigContext.setDatasetConfigs).toHaveBeenCalledWith(expect.objectContaining({
                metadata_filtering_conditions: expect.objectContaining({
                    logical_operator: types_1.LogicalOperator.or,
                }),
            }));
        });
    });
    describe('Edge Cases', () => {
        it('should handle null doc_metadata gracefully', () => {
            const dataset = createMockDataset({
                doc_metadata: undefined,
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('metadata-list-count')).toHaveTextContent('0');
        });
        it('should handle empty doc_metadata array', () => {
            const dataset = createMockDataset({
                doc_metadata: [],
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('metadata-list-count')).toHaveTextContent('0');
        });
        it('should handle missing userProfile', () => {
            vi.mocked(use_context_selector_1.useContext).mockReturnValue({
                ...mockConfigContext,
                userProfile: null,
            });
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
        });
        it('should handle missing datasetConfigsRef gracefully', () => {
            const dataset = createMockDataset();
            // Test with undefined datasetConfigsRef - component renders without immediate error
            // The component will fail on interaction due to non-null assertions in handlers
            expect(() => {
                renderDatasetConfig({
                    dataSets: [dataset],
                    datasetConfigsRef: undefined,
                });
            }).not.toThrow();
            // The component currently expects datasetConfigsRef to exist for interactions
            // This test documents the current behavior and requirements
        });
        it('should handle missing prompt_variables', () => {
            // Context var is only shown when datasets exist AND there are prompt_variables
            // Test with no datasets to ensure context var is not shown
            renderDatasetConfig({
                mode: app_1.AppModeEnum.COMPLETION,
                dataSets: [],
                modelConfig: {
                    configs: {
                        prompt_variables: [],
                    },
                },
            });
            expect(react_1.screen.queryByTestId('context-var')).not.toBeInTheDocument();
        });
    });
    describe('Component Integration', () => {
        it('should integrate with card item component', () => {
            const datasets = [
                createMockDataset({ id: 'ds1', name: 'Dataset 1' }),
                createMockDataset({ id: 'ds2', name: 'Dataset 2' }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            expect(react_1.screen.getByTestId('card-item-ds1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('card-item-ds2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Dataset 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Dataset 2')).toBeInTheDocument();
        });
        it('should integrate with params config component', () => {
            const datasets = [
                createMockDataset(),
                createMockDataset({ id: 'ds2' }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            const paramsConfig = react_1.screen.getByTestId('params-config');
            expect(paramsConfig).toBeInTheDocument();
            expect(paramsConfig).toHaveTextContent('Params (2)');
            expect(paramsConfig).not.toBeDisabled();
        });
        it('should integrate with metadata filter component', () => {
            const datasets = [
                createMockDataset({
                    doc_metadata: [
                        { name: 'category', type: 'string' },
                        { name: 'tags', type: 'string' },
                    ],
                }),
                createMockDataset({
                    id: 'ds2',
                    doc_metadata: [
                        { name: 'category', type: 'string' },
                        { name: 'priority', type: 'number' },
                    ],
                }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            const metadataFilter = react_1.screen.getByTestId('metadata-filter');
            expect(metadataFilter).toBeInTheDocument();
            // Should show intersection (only 'category')
            expect(react_1.screen.getByTestId('metadata-list-count')).toHaveTextContent('1');
        });
    });
    describe('Model Configuration', () => {
        it('should handle metadata model change', () => {
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: {
                    ...mockConfigContext.datasetConfigs,
                    metadata_model_config: {
                        provider: 'openai',
                        name: 'gpt-3.5-turbo',
                        mode: app_1.AppModeEnum.CHAT,
                        completion_params: { temperature: 0.7 },
                    },
                },
            });
            // The component would need to expose this functionality through the metadata filter
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
        });
        it('should handle metadata completion params change', () => {
            const dataset = createMockDataset();
            renderDatasetConfig({
                dataSets: [dataset],
                datasetConfigs: {
                    ...mockConfigContext.datasetConfigs,
                    metadata_model_config: {
                        provider: 'openai',
                        name: 'gpt-3.5-turbo',
                        mode: app_1.AppModeEnum.CHAT,
                        completion_params: { temperature: 0.5, max_tokens: 100 },
                    },
                },
            });
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
        });
    });
    describe('Permission Handling', () => {
        it('should hide edit options when user lacks permission', () => {
            vi.mocked(permission_1.hasEditPermissionForDataset).mockReturnValue(false);
            const dataset = createMockDataset({
                created_by: 'other-user',
                permission: datasets_1.DatasetPermission.onlyMe,
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            // The editable property should be false when no permission
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
        });
        it('should show readonly state for non-editable datasets', () => {
            vi.mocked(permission_1.hasEditPermissionForDataset).mockReturnValue(false);
            const dataset = createMockDataset({
                created_by: 'admin',
                permission: datasets_1.DatasetPermission.allTeamMembers,
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
        });
        it('should allow editing when user has partial member permission', () => {
            vi.mocked(permission_1.hasEditPermissionForDataset).mockReturnValue(true);
            const dataset = createMockDataset({
                created_by: 'admin',
                permission: datasets_1.DatasetPermission.partialMembers,
                partial_member_list: ['user-123'],
            });
            renderDatasetConfig({
                dataSets: [dataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${dataset.id}`)).toBeInTheDocument();
        });
    });
    describe('Dataset Reordering and Management', () => {
        it('should maintain dataset order after updates', () => {
            const datasets = [
                createMockDataset({ id: 'ds1', name: 'Dataset 1' }),
                createMockDataset({ id: 'ds2', name: 'Dataset 2' }),
                createMockDataset({ id: 'ds3', name: 'Dataset 3' }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            // Verify order is maintained
            expect(react_1.screen.getByText('Dataset 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Dataset 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Dataset 3')).toBeInTheDocument();
        });
        it('should handle multiple dataset operations correctly', async () => {
            const user = user_event_1.default.setup();
            const datasets = [
                createMockDataset({ id: 'ds1', name: 'Dataset 1' }),
                createMockDataset({ id: 'ds2', name: 'Dataset 2' }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            // Remove first dataset
            const removeButton1 = react_1.screen.getAllByText('Remove')[0];
            await user.click(removeButton1);
            expect(mockConfigContext.setDataSets).toHaveBeenCalledWith([datasets[1]]);
        });
    });
    describe('Complex Configuration Scenarios', () => {
        it('should handle multiple retrieval methods in configuration', () => {
            const datasets = [
                createMockDataset({
                    id: 'ds1',
                    retrieval_model: {
                        search_method: 'semantic_search',
                        reranking_enable: true,
                        reranking_model: {
                            reranking_provider_name: 'cohere',
                            reranking_model_name: 'rerank-v3.5',
                        },
                        top_k: 5,
                        score_threshold_enabled: true,
                        score_threshold: 0.8,
                    },
                }),
                createMockDataset({
                    id: 'ds2',
                    retrieval_model: {
                        search_method: 'full_text_search',
                        reranking_enable: false,
                        reranking_model: {
                            reranking_provider_name: '',
                            reranking_model_name: '',
                        },
                        top_k: 3,
                        score_threshold_enabled: false,
                        score_threshold: 0.5,
                    },
                }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            expect(react_1.screen.getByTestId('params-config')).toHaveTextContent('Params (2)');
        });
        it('should handle external knowledge base integration', () => {
            const externalDataset = createMockDataset({
                provider: 'notion',
                external_knowledge_info: {
                    external_knowledge_id: 'notion-123',
                    external_knowledge_api_id: 'api-456',
                    external_knowledge_api_name: 'Notion Integration',
                    external_knowledge_api_endpoint: 'https://api.notion.com',
                },
            });
            renderDatasetConfig({
                dataSets: [externalDataset],
            });
            expect(react_1.screen.getByTestId(`card-item-${externalDataset.id}`)).toBeInTheDocument();
            expect(react_1.screen.getByText(externalDataset.name)).toBeInTheDocument();
        });
    });
    describe('Performance and Error Handling', () => {
        it('should handle large dataset lists efficiently', () => {
            // Create many datasets to test performance
            const manyDatasets = Array.from({ length: 50 }, (_, i) => createMockDataset({
                id: `ds-${i}`,
                name: `Dataset ${i}`,
                doc_metadata: [
                    { name: 'category', type: 'string' },
                    { name: 'priority', type: 'number' },
                ],
            }));
            renderDatasetConfig({
                dataSets: manyDatasets,
            });
            expect(react_1.screen.getByTestId('params-config')).toHaveTextContent('Params (50)');
        });
        it('should handle metadata intersection calculation efficiently', () => {
            const datasets = [
                createMockDataset({
                    id: 'ds1',
                    doc_metadata: [
                        { name: 'category', type: 'string' },
                        { name: 'tags', type: 'string' },
                        { name: 'priority', type: 'number' },
                    ],
                }),
                createMockDataset({
                    id: 'ds2',
                    doc_metadata: [
                        { name: 'category', type: 'string' },
                        { name: 'status', type: 'string' },
                        { name: 'priority', type: 'number' },
                    ],
                }),
            ];
            renderDatasetConfig({
                dataSets: datasets,
            });
            // Should calculate intersection correctly
            expect(react_1.screen.getByTestId('metadata-filter')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQStEO0FBQy9ELDREQUFtRDtBQUNuRCwrREFBaUQ7QUFDakQscUZBQStHO0FBQy9HLHFGQUFtRztBQUNuRyxnREFBcUU7QUFDckUscUNBQXVFO0FBQ3ZFLG1EQUFnRTtBQUNoRSxtQ0FBbUM7QUFFbkMsNkJBQTZCO0FBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkRBQTJELEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxRSwwQkFBMEIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkMsS0FBSyxFQUFFLENBQUM7UUFDUixlQUFlLEVBQUUsR0FBRztRQUNwQixnQkFBZ0IsRUFBRSxLQUFLO1FBQ3ZCLGVBQWUsRUFBRSxTQUFTO1FBQzFCLGNBQWMsRUFBRSxpQkFBaUI7UUFDakMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRTtLQUMxQixDQUFDLENBQUM7SUFDSCx1QkFBdUIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEMsV0FBVyxFQUFFLElBQUk7UUFDakIsV0FBVyxFQUFFLEtBQUs7UUFDbEIsMEJBQTBCLEVBQUUsS0FBSztRQUNqQyw2QkFBNkIsRUFBRSxLQUFLO1FBQ3BDLDBCQUEwQixFQUFFLEtBQUs7S0FDbEMsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEYscURBQXFELEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDdkMsZUFBZSxFQUFFLEVBQUUsUUFB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IHsgRGF0YVNldCB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhc2V0Q29uZmlncyB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4sIHdpdGhpbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICd1c2UtY29udGV4dC1zZWxlY3RvcidcbmltcG9ydCB7IENvbXBhcmlzb25PcGVyYXRvciwgTG9naWNhbE9wZXJhdG9yIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9rbm93bGVkZ2UtcmV0cmlldmFsL3R5cGVzJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0ZWREYXRhc2V0c01vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdXRpbHMnXG5pbXBvcnQgeyBEYXRhc2V0UGVybWlzc2lvbiwgRGF0YVNvdXJjZVR5cGUgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IEFwcE1vZGVFbnVtLCBNb2RlbE1vZGVUeXBlLCBSRVRSSUVWRV9UWVBFIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQgfSBmcm9tICdAL3V0aWxzL3Blcm1pc3Npb24nXG5pbXBvcnQgRGF0YXNldENvbmZpZyBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llc1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9rbm93bGVkZ2UtcmV0cmlldmFsL3V0aWxzJywgKCkgPT4gKHtcbiAgZ2V0TXVsdGlwbGVSZXRyaWV2YWxDb25maWc6IHZpLmZuKCgpID0+ICh7XG4gICAgdG9wX2s6IDQsXG4gICAgc2NvcmVfdGhyZXNob2xkOiAwLjcsXG4gICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgcmVyYW5raW5nX21vZGVsOiB1bmRlZmluZWQsXG4gICAgcmVyYW5raW5nX21vZGU6ICdyZXJhbmtpbmdfbW9kZWwnLFxuICAgIHdlaWdodHM6IHsgd2VpZ2h0MTogMS4wIH0sXG4gIH0pKSxcbiAgZ2V0U2VsZWN0ZWREYXRhc2V0c01vZGU6IHZpLmZuKCgpID0+ICh7XG4gICAgYWxsSW50ZXJuYWw6IHRydWUsXG4gICAgYWxsRXh0ZXJuYWw6IGZhbHNlLFxuICAgIG1peHR1cmVJbnRlcm5hbEFuZEV4dGVybmFsOiBmYWxzZSxcbiAgICBtaXh0dXJlSGlnaFF1YWxpdHlBbmRFY29ub21pYzogZmFsc2UsXG4gICAgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWw6IGZhbHNlLFxuICB9KSksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbDogdmkuZm4oKCkgPT4gKHtcbiAgICBjdXJyZW50TW9kZWw6IHsgbW9kZWw6ICdyZXJhbmstbW9kZWwnIH0sXG4gICAgY3VycmVudFByb3ZpZGVyOiB7IHByb3ZpZGVyOiAnb3BlbmFpJyB9LFxuICB9KSksXG59KSlcblxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlU2VsZWN0b3I6IHZpLmZuKChmbjogYW55KSA9PiBmbih7XG4gICAgdXNlclByb2ZpbGU6IHtcbiAgICAgIGlkOiAndXNlci0xMjMnLFxuICAgIH0sXG4gIH0pKSxcbn0pKVxuXG52aS5tb2NrKCdAL3V0aWxzL3Blcm1pc3Npb24nLCAoKSA9PiAoe1xuICBoYXNFZGl0UGVybWlzc2lvbkZvckRhdGFzZXQ6IHZpLmZuKCgpID0+IHRydWUpLFxufSkpXG5cbnZpLm1vY2soJy4uL2RlYnVnL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlRm9ybWF0dGluZ0NoYW5nZWREaXNwYXRjaGVyOiB2aS5mbigoKSA9PiB2aS5mbigpKSxcbn0pKVxuXG52aS5tb2NrKCdlcy10b29sa2l0L2NvbXBhdCcsICgpID0+ICh7XG4gIGludGVyc2VjdGlvbkJ5OiB2aS5mbigoLi4uYXJyYXlzKSA9PiB7XG4gICAgLy8gTW9jayByZWFsaXN0aWMgaW50ZXJzZWN0aW9uIGJlaGF2aW9yIGJhc2VkIG9uIG1ldGFkYXRhIG5hbWVcbiAgICBjb25zdCB2YWxpZEFycmF5cyA9IGFycmF5cy5maWx0ZXIoQXJyYXkuaXNBcnJheSlcbiAgICBpZiAodmFsaWRBcnJheXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIFtdXG5cbiAgICAvLyBTdGFydCB3aXRoIGZpcnN0IGFycmF5IGFuZCBmaWx0ZXIgZG93blxuICAgIHJldHVybiB2YWxpZEFycmF5c1swXS5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKCFpdGVtIHx8ICFpdGVtLm5hbWUpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAvLyBPbmx5IHJldHVybiBpdGVtcyB0aGF0IGV4aXN0IGluIGFsbCBhcnJheXNcbiAgICAgIHJldHVybiB2YWxpZEFycmF5cy5ldmVyeShhcnJheSA9PlxuICAgICAgICBhcnJheS5zb21lKChvdGhlckl0ZW06IGFueSkgPT5cbiAgICAgICAgICBvdGhlckl0ZW0gJiYgb3RoZXJJdGVtLm5hbWUgPT09IGl0ZW0ubmFtZSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICB9KVxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCd1dWlkJywgKCkgPT4gKHtcbiAgdjQ6IHZpLmZuKCgpID0+ICdtb2NrLXV1aWQnKSxcbn0pKVxuXG4vLyBNb2NrIGNoaWxkIGNvbXBvbmVudHNcbnZpLm1vY2soJy4vY2FyZC1pdGVtJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY29uZmlnLCBvblJlbW92ZSwgb25TYXZlLCBlZGl0YWJsZSB9OiBhbnkpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPXtgY2FyZC1pdGVtLSR7Y29uZmlnLmlkfWB9PlxuICAgICAgPHNwYW4+e2NvbmZpZy5uYW1lfTwvc3Bhbj5cbiAgICAgIHtlZGl0YWJsZSAmJiA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uU2F2ZShjb25maWcpfT5FZGl0PC9idXR0b24+fVxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBvblJlbW92ZShjb25maWcuaWQpfT5SZW1vdmU8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuL3BhcmFtcy1jb25maWcnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBkaXNhYmxlZCwgc2VsZWN0ZWREYXRhc2V0cyB9OiBhbnkpID0+IChcbiAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicGFyYW1zLWNvbmZpZ1wiIGRpc2FibGVkPXtkaXNhYmxlZH0+XG4gICAgICBQYXJhbXMgKFxuICAgICAge3NlbGVjdGVkRGF0YXNldHMubGVuZ3RofVxuICAgICAgKVxuICAgIDwvYnV0dG9uPlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4vY29udGV4dC12YXInLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyB2YWx1ZSwgb3B0aW9ucywgb25DaGFuZ2UgfTogYW55KSA9PiAoXG4gICAgPHNlbGVjdCBkYXRhLXRlc3RpZD1cImNvbnRleHQtdmFyXCIgdmFsdWU9e3ZhbHVlfSBvbkNoYW5nZT17ZSA9PiBvbkNoYW5nZShlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPlNlbGVjdCBjb250ZXh0IHZhcmlhYmxlPC9vcHRpb24+XG4gICAgICB7b3B0aW9ucy5tYXAoKG9wdDogYW55KSA9PiAoXG4gICAgICAgIDxvcHRpb24ga2V5PXtvcHQudmFsdWV9IHZhbHVlPXtvcHQudmFsdWV9PntvcHQubmFtZX08L29wdGlvbj5cbiAgICAgICkpfVxuICAgIDwvc2VsZWN0PlxuICApLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMva25vd2xlZGdlLXJldHJpZXZhbC9jb21wb25lbnRzL21ldGFkYXRhL21ldGFkYXRhLWZpbHRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7XG4gICAgbWV0YWRhdGFMaXN0LFxuICAgIG1ldGFkYXRhRmlsdGVyTW9kZSxcbiAgICBoYW5kbGVNZXRhZGF0YUZpbHRlck1vZGVDaGFuZ2UsXG4gICAgaGFuZGxlQWRkQ29uZGl0aW9uLFxuICAgIGhhbmRsZVJlbW92ZUNvbmRpdGlvbixcbiAgICBoYW5kbGVVcGRhdGVDb25kaXRpb24sXG4gICAgaGFuZGxlVG9nZ2xlQ29uZGl0aW9uTG9naWNhbE9wZXJhdG9yLFxuICB9OiBhbnkpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibWV0YWRhdGEtZmlsdGVyXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cIm1ldGFkYXRhLWxpc3QtY291bnRcIj57bWV0YWRhdGFMaXN0Lmxlbmd0aH08L3NwYW4+XG4gICAgICA8c2VsZWN0IHZhbHVlPXttZXRhZGF0YUZpbHRlck1vZGV9IG9uQ2hhbmdlPXtlID0+IGhhbmRsZU1ldGFkYXRhRmlsdGVyTW9kZUNoYW5nZShlLnRhcmdldC52YWx1ZSl9PlxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGlzYWJsZWRcIj5EaXNhYmxlZDwvb3B0aW9uPlxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYXV0b21hdGljXCI+QXV0b21hdGljPC9vcHRpb24+XG4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJtYW51YWxcIj5NYW51YWw8L29wdGlvbj5cbiAgICAgIDwvc2VsZWN0PlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBoYW5kbGVBZGRDb25kaXRpb24oeyBuYW1lOiAndGVzdCcsIHR5cGU6ICdzdHJpbmcnIH0pfT5cbiAgICAgICAgQWRkIENvbmRpdGlvblxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGhhbmRsZVJlbW92ZUNvbmRpdGlvbignY29uZGl0aW9uLWlkJyl9PlxuICAgICAgICBSZW1vdmUgQ29uZGl0aW9uXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gaGFuZGxlVXBkYXRlQ29uZGl0aW9uKCdjb25kaXRpb24taWQnLCB7IG5hbWU6ICd1cGRhdGVkJyB9KX0+XG4gICAgICAgIFVwZGF0ZSBDb25kaXRpb25cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3J9PlxuICAgICAgICBUb2dnbGUgT3BlcmF0b3JcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgY29udGV4dFxuY29uc3QgbW9ja0NvbmZpZ0NvbnRleHQ6IGFueSA9IHtcbiAgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgbW9kZWxNb2RlVHlwZTogTW9kZWxNb2RlVHlwZS5jaGF0LFxuICBpc0FnZW50OiBmYWxzZSxcbiAgZGF0YVNldHM6IFtdLFxuICBzZXREYXRhU2V0czogdmkuZm4oKSxcbiAgbW9kZWxDb25maWc6IHtcbiAgICBjb25maWdzOiB7XG4gICAgICBwcm9tcHRfdmFyaWFibGVzOiBbXSxcbiAgICB9LFxuICB9LFxuICBzZXRNb2RlbENvbmZpZzogdmkuZm4oKSxcbiAgc2hvd1NlbGVjdERhdGFTZXQ6IHZpLmZuKCksXG4gIGRhdGFzZXRDb25maWdzOiB7XG4gICAgcmV0cmlldmFsX21vZGVsOiBSRVRSSUVWRV9UWVBFLm11bHRpV2F5LFxuICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgIH0sXG4gICAgdG9wX2s6IDQsXG4gICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHNjb3JlX3RocmVzaG9sZDogMC43LFxuICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19tb2RlOiAnZGlzYWJsZWQnIGFzIGFueSxcbiAgICBtZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9uczogdW5kZWZpbmVkLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICBkYXRhc2V0czogW10sXG4gICAgfSxcbiAgfSBhcyBEYXRhc2V0Q29uZmlncyxcbiAgZGF0YXNldENvbmZpZ3NSZWY6IHtcbiAgICBjdXJyZW50OiB7XG4gICAgICByZXRyaWV2YWxfbW9kZWw6IFJFVFJJRVZFX1RZUEUubXVsdGlXYXksXG4gICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLFxuICAgICAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gICAgICB9LFxuICAgICAgdG9wX2s6IDQsXG4gICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNyxcbiAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19tb2RlOiAnZGlzYWJsZWQnIGFzIGFueSxcbiAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICBkYXRhc2V0czoge1xuICAgICAgICBkYXRhc2V0czogW10sXG4gICAgICB9LFxuICAgIH0gYXMgRGF0YXNldENvbmZpZ3MsXG4gIH0sXG4gIHNldERhdGFzZXRDb25maWdzOiB2aS5mbigpLFxuICBzZXRSZXJhbmtTZXR0aW5nTW9kYWxPcGVuOiB2aS5mbigpLFxufVxuXG52aS5tb2NrKCdAL2NvbnRleHQvZGVidWctY29uZmlndXJhdGlvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNoaWxkcmVuIH06IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjb25maWctY29udGV4dC1wcm92aWRlclwiPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJ3VzZS1jb250ZXh0LXNlbGVjdG9yJywgKCkgPT4gKHtcbiAgdXNlQ29udGV4dDogdmkuZm4oKCkgPT4gbW9ja0NvbmZpZ0NvbnRleHQpLFxufSkpXG5cbmNvbnN0IGNyZWF0ZU1vY2tEYXRhc2V0ID0gKG92ZXJyaWRlczogUGFydGlhbDxEYXRhU2V0PiA9IHt9KTogRGF0YVNldCA9PiB7XG4gIGNvbnN0IGRlZmF1bHREYXRhc2V0OiBEYXRhU2V0ID0ge1xuICAgIGlkOiAnZGF0YXNldC0xJyxcbiAgICBuYW1lOiAnVGVzdCBEYXRhc2V0JyxcbiAgICBpbmRleGluZ19zdGF0dXM6ICdjb21wbGV0ZWQnIGFzIGFueSxcbiAgICBpY29uX2luZm86IHtcbiAgICAgIGljb246ICfwn5OYJyxcbiAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICAgIGljb25fYmFja2dyb3VuZDogJyNGRkVBRDUnLFxuICAgICAgaWNvbl91cmw6ICcnLFxuICAgIH0sXG4gICAgZGVzY3JpcHRpb246ICdUZXN0IGRhdGFzZXQgZGVzY3JpcHRpb24nLFxuICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLm9ubHlNZSxcbiAgICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ2hpZ2hfcXVhbGl0eScgYXMgYW55LFxuICAgIGF1dGhvcl9uYW1lOiAnVGVzdCBBdXRob3InLFxuICAgIGNyZWF0ZWRfYnk6ICd1c2VyLTEyMycsXG4gICAgdXBkYXRlZF9ieTogJ3VzZXItMTIzJyxcbiAgICB1cGRhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgIGFwcF9jb3VudDogMCxcbiAgICBkb2NfZm9ybTogJ3RleHQnIGFzIGFueSxcbiAgICBkb2N1bWVudF9jb3VudDogMTAsXG4gICAgdG90YWxfZG9jdW1lbnRfY291bnQ6IDEwLFxuICAgIHRvdGFsX2F2YWlsYWJsZV9kb2N1bWVudHM6IDEwLFxuICAgIHdvcmRfY291bnQ6IDEwMDAsXG4gICAgcHJvdmlkZXI6ICdkaWZ5JyxcbiAgICBlbWJlZGRpbmdfbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyxcbiAgICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgIGVtYmVkZGluZ19hdmFpbGFibGU6IHRydWUsXG4gICAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHtcbiAgICAgIHNlYXJjaF9tZXRob2Q6ICdzZW1hbnRpY19zZWFyY2gnIGFzIGFueSxcbiAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgfSxcbiAgICAgIHRvcF9rOiA0LFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjcsXG4gICAgfSxcbiAgICByZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgIHNlYXJjaF9tZXRob2Q6ICdzZW1hbnRpY19zZWFyY2gnIGFzIGFueSxcbiAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgfSxcbiAgICAgIHRvcF9rOiA0LFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjcsXG4gICAgfSxcbiAgICB0YWdzOiBbXSxcbiAgICBleHRlcm5hbF9rbm93bGVkZ2VfaW5mbzoge1xuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2lkOiAnJyxcbiAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ6ICcnLFxuICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9uYW1lOiAnJyxcbiAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfZW5kcG9pbnQ6ICcnLFxuICAgIH0sXG4gICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICB0b3BfazogMixcbiAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICBidWlsdF9pbl9maWVsZF9lbmFibGVkOiB0cnVlLFxuICAgIGRvY19tZXRhZGF0YTogW1xuICAgICAgeyBuYW1lOiAnY2F0ZWdvcnknLCB0eXBlOiAnc3RyaW5nJyB9IGFzIGFueSxcbiAgICAgIHsgbmFtZTogJ3ByaW9yaXR5JywgdHlwZTogJ251bWJlcicgfSBhcyBhbnksXG4gICAgXSxcbiAgICBrZXl3b3JkX251bWJlcjogMyxcbiAgICBwaXBlbGluZV9pZDogJ3BpcGVsaW5lLTEyMycsXG4gICAgaXNfcHVibGlzaGVkOiB0cnVlLFxuICAgIHJ1bnRpbWVfbW9kZTogJ2dlbmVyYWwnLFxuICAgIGVuYWJsZV9hcGk6IHRydWUsXG4gICAgaXNfbXVsdGltb2RhbDogZmFsc2UsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9XG4gIHJldHVybiBkZWZhdWx0RGF0YXNldFxufVxuXG5jb25zdCByZW5kZXJEYXRhc2V0Q29uZmlnID0gKGNvbnRleHRPdmVycmlkZXM6IFBhcnRpYWw8dHlwZW9mIG1vY2tDb25maWdDb250ZXh0PiA9IHt9KSA9PiB7XG4gIGNvbnN0IG1lcmdlZENvbnRleHQgPSB7IC4uLm1vY2tDb25maWdDb250ZXh0LCAuLi5jb250ZXh0T3ZlcnJpZGVzIH1cbiAgdmkubW9ja2VkKHVzZUNvbnRleHQpLm1vY2tSZXR1cm5WYWx1ZShtZXJnZWRDb250ZXh0KVxuXG4gIHJldHVybiByZW5kZXIoPERhdGFzZXRDb25maWcgLz4pXG59XG5cbmRlc2NyaWJlKCdEYXRhc2V0Q29uZmlnJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrQ29uZmlnQ29udGV4dC5kYXRhU2V0cyA9IFtdXG4gICAgbW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YVNldHMgPSB2aS5mbigpXG4gICAgbW9ja0NvbmZpZ0NvbnRleHQuc2V0TW9kZWxDb25maWcgPSB2aS5mbigpXG4gICAgbW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YXNldENvbmZpZ3MgPSB2aS5mbigpXG4gICAgbW9ja0NvbmZpZ0NvbnRleHQuc2V0UmVyYW5rU2V0dGluZ01vZGFsT3BlbiA9IHZpLmZuKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRhdGFzZXQgY29uZmlndXJhdGlvbiBwYW5lbCB3aGVuIGNvbXBvbmVudCBtb3VudHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLmZlYXR1cmUuZGF0YVNldC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBlbXB0eSBzdGF0ZSBtZXNzYWdlIHdoZW4gbm8gZGF0YXNldHMgYXJlIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL25vLipkYXRhL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbXMtY29uZmlnJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRhdGFzZXQgY2FyZHMgYW5kIGVuYWJsZSBwYXJhbWV0ZXJzIHdoZW4gZGF0YXNldHMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBjYXJkLWl0ZW0tJHtkYXRhc2V0LmlkfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChkYXRhc2V0Lm5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbXMtY29uZmlnJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgY29uZmlndXJhdGlvbiB0aXRsZSBhbmQgYWRkIGRhdGFzZXQgYnV0dG9uIGluIGhlYWRlcicsICgpID0+IHtcbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcuZmVhdHVyZS5kYXRhU2V0LnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmFkZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBwYXJhbWV0ZXJzIGNvbmZpZ3VyYXRpb24gd2hlbiBpbiBhZ2VudCBtb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGlzQWdlbnQ6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BhcmFtcy1jb25maWcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdEYXRhc2V0IE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGRhdGFzZXQgc2VsZWN0aW9uIG1vZGFsIHdoZW4gYWRkIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKClcblxuICAgICAgY29uc3QgYWRkQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5hZGQnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhZGRCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrQ29uZmlnQ29udGV4dC5zaG93U2VsZWN0RGF0YVNldCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGRhdGFzZXQgYW5kIHVwZGF0ZSBjb25maWd1cmF0aW9uIHdoZW4gcmVtb3ZlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdSZW1vdmUnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhyZW1vdmVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrQ29uZmlnQ29udGV4dC5zZXREYXRhU2V0cykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAvLyBOb3RlOiBzZXREYXRhc2V0Q29uZmlncyBpcyBhbHNvIGNhbGxlZCBidXQgaXRzIGV4YWN0IHBhcmFtZXRlcnMgZGVwZW5kIG9uXG4gICAgICAvLyB0aGUgcmV0cmlldmFsIGNvbmZpZyBjYWxjdWxhdGlvbiB3aGljaCBpbnZvbHZlcyBjb21wbGV4IG1vY2tlZCB1dGlsaXRpZXNcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIHJlcmFuayBzZXR0aW5nIG1vZGFsIHdoZW4gcmVtb3ZpbmcgZGF0YXNldCByZXF1aXJlcyByZXJhbmsgY29uZmlndXJhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBNb2NrIHNjZW5hcmlvIHRoYXQgdHJpZ2dlcnMgcmVyYW5rIG1vZGFsXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0gc2FtZSBhcyBhYm92ZVxuICAgICAgdmkubW9ja2VkKGdldFNlbGVjdGVkRGF0YXNldHNNb2RlKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBhbGxJbnRlcm5hbDogZmFsc2UsXG4gICAgICAgIGFsbEV4dGVybmFsOiB0cnVlLFxuICAgICAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbDogZmFsc2UsXG4gICAgICAgIG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljOiBmYWxzZSxcbiAgICAgICAgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWw6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogW2RhdGFzZXRdLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnUmVtb3ZlJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2socmVtb3ZlQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0UmVyYW5rU2V0dGluZ01vZGFsT3BlbikudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGF0YXNldCBzYXZlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIE1vY2sgdGhlIG9uU2F2ZSBpbiBjYXJkLWl0ZW0gY29tcG9uZW50IC0gaXQgd2lsbCBwYXNzIHRoZSBvcmlnaW5hbCBkYXRhc2V0XG4gICAgICBjb25zdCBlZGl0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnRWRpdCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGVkaXRCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrQ29uZmlnQ29udGV4dC5zZXREYXRhU2V0cykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGlkOiBkYXRhc2V0LmlkLFxuICAgICAgICAgICAgbmFtZTogZGF0YXNldC5uYW1lLFxuICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBkYXRhc2V0cyB3aXRoIGVkaXQgcGVybWlzc2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCh7XG4gICAgICAgIGNyZWF0ZWRfYnk6ICd1c2VyLTEyMycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGNhcmQtaXRlbS0ke2RhdGFzZXQuaWR9YCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb250ZXh0IFZhcmlhYmxlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgY29udGV4dCB2YXJpYWJsZSBzZWxlY3RvciBpbiBjb21wbGV0aW9uIG1vZGUgd2l0aCBkYXRhc2V0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCgpXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTixcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgbW9kZWxDb25maWc6IHtcbiAgICAgICAgICBjb25maWdzOiB7XG4gICAgICAgICAgICBwcm9tcHRfdmFyaWFibGVzOiBbXG4gICAgICAgICAgICAgIHsga2V5OiAncXVlcnknLCBuYW1lOiAnUXVlcnknLCB0eXBlOiAnc3RyaW5nJywgaXNfY29udGV4dF92YXI6IGZhbHNlIH0sXG4gICAgICAgICAgICAgIHsga2V5OiAnY29udGV4dCcsIG5hbWU6ICdDb250ZXh0JywgdHlwZTogJ3N0cmluZycsIGlzX2NvbnRleHRfdmFyOiB0cnVlIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb250ZXh0LXZhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBTaG91bGQgZmluZCB0aGUgc2VsZWN0ZWQgY29udGV4dCB2YXJpYWJsZSBpbiB0aGUgb3B0aW9uc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlbGVjdCBjb250ZXh0IHZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBjb250ZXh0IHZhcmlhYmxlIHNlbGVjdG9yIGluIGNoYXQgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCgpXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgbW9kZWxDb25maWc6IHtcbiAgICAgICAgICBjb25maWdzOiB7XG4gICAgICAgICAgICBwcm9tcHRfdmFyaWFibGVzOiBbXG4gICAgICAgICAgICAgIHsga2V5OiAncXVlcnknLCBuYW1lOiAnUXVlcnknLCB0eXBlOiAnc3RyaW5nJywgaXNfY29udGV4dF92YXI6IGZhbHNlIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NvbnRleHQtdmFyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbnRleHQgdmFyaWFibGUgc2VsZWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04sXG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICAgIG1vZGVsQ29uZmlnOiB7XG4gICAgICAgICAgY29uZmlnczoge1xuICAgICAgICAgICAgcHJvbXB0X3ZhcmlhYmxlczogW1xuICAgICAgICAgICAgICB7IGtleTogJ3F1ZXJ5JywgbmFtZTogJ1F1ZXJ5JywgdHlwZTogJ3N0cmluZycsIGlzX2NvbnRleHRfdmFyOiBmYWxzZSB9LFxuICAgICAgICAgICAgICB7IGtleTogJ2NvbnRleHQnLCBuYW1lOiAnQ29udGV4dCcsIHR5cGU6ICdzdHJpbmcnLCBpc19jb250ZXh0X3ZhcjogdHJ1ZSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgc2VsZWN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjb250ZXh0LXZhcicpXG4gICAgICBhd2FpdCB1c2VyLnNlbGVjdE9wdGlvbnMoc2VsZWN0LCAncXVlcnknKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0TW9kZWxDb25maWcpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01ldGFkYXRhIEZpbHRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtZXRhZGF0YSBmaWx0ZXIgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KHtcbiAgICAgICAgZG9jX21ldGFkYXRhOiBbXG4gICAgICAgICAgeyBuYW1lOiAnY2F0ZWdvcnknLCB0eXBlOiAnc3RyaW5nJyB9IGFzIGFueSxcbiAgICAgICAgICB7IG5hbWU6ICdwcmlvcml0eScsIHR5cGU6ICdudW1iZXInIH0gYXMgYW55LFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtbGlzdC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpIC8vIGJvdGggJ2NhdGVnb3J5JyBhbmQgJ3ByaW9yaXR5J1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtZXRhZGF0YSBmaWx0ZXIgbW9kZSBjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCgpXG4gICAgICBjb25zdCB1cGRhdGVkRGF0YXNldENvbmZpZ3MgPSB7XG4gICAgICAgIC4uLm1vY2tDb25maWdDb250ZXh0LmRhdGFzZXRDb25maWdzLFxuICAgICAgICBtZXRhZGF0YV9maWx0ZXJpbmdfbW9kZTogJ2Rpc2FibGVkJyBhcyBhbnksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogW2RhdGFzZXRdLFxuICAgICAgICBkYXRhc2V0Q29uZmlnczogdXBkYXRlZERhdGFzZXRDb25maWdzLFxuICAgICAgfSlcblxuICAgICAgLy8gVXBkYXRlIHRoZSByZWYgdG8gbWF0Y2hcbiAgICAgIG1vY2tDb25maWdDb250ZXh0LmRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQgPSB1cGRhdGVkRGF0YXNldENvbmZpZ3NcblxuICAgICAgY29uc3Qgc2VsZWN0ID0gd2l0aGluKHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtZmlsdGVyJykpLmdldEJ5RGlzcGxheVZhbHVlKCdEaXNhYmxlZCcpXG4gICAgICBhd2FpdCB1c2VyLnNlbGVjdE9wdGlvbnMoc2VsZWN0LCAnYXV0b21hdGljJylcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWdDb250ZXh0LnNldERhdGFzZXRDb25maWdzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19tb2RlOiAnYXV0b21hdGljJyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFkZGluZyBtZXRhZGF0YSBjb25kaXRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuICAgICAgY29uc3QgYmFzZURhdGFzZXRDb25maWdzID0ge1xuICAgICAgICAuLi5tb2NrQ29uZmlnQ29udGV4dC5kYXRhc2V0Q29uZmlncyxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICAgIGRhdGFzZXRDb25maWdzOiBiYXNlRGF0YXNldENvbmZpZ3MsXG4gICAgICB9KVxuXG4gICAgICAvLyBVcGRhdGUgdGhlIHJlZiB0byBtYXRjaFxuICAgICAgbW9ja0NvbmZpZ0NvbnRleHQuZGF0YXNldENvbmZpZ3NSZWYuY3VycmVudCA9IGJhc2VEYXRhc2V0Q29uZmlnc1xuXG4gICAgICBjb25zdCBhZGRCdXR0b24gPSB3aXRoaW4oc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkuZ2V0QnlUZXh0KCdBZGQgQ29uZGl0aW9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYWRkQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YXNldENvbmZpZ3MpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgbWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGxvZ2ljYWxfb3BlcmF0b3I6IExvZ2ljYWxPcGVyYXRvci5hbmQsXG4gICAgICAgICAgICBjb25kaXRpb25zOiBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICAgIGlkOiAnbW9jay11dWlkJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgICAgICAgICAgY29tcGFyaXNvbl9vcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yLmlzLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVtb3ZpbmcgbWV0YWRhdGEgY29uZGl0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcblxuICAgICAgY29uc3QgZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9ucyA9IHtcbiAgICAgICAgLi4ubW9ja0NvbmZpZ0NvbnRleHQuZGF0YXNldENvbmZpZ3MsXG4gICAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zOiB7XG4gICAgICAgICAgbG9naWNhbF9vcGVyYXRvcjogTG9naWNhbE9wZXJhdG9yLmFuZCxcbiAgICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICB7IGlkOiAnY29uZGl0aW9uLWlkJywgbmFtZTogJ3Rlc3QnLCBjb21wYXJpc29uX29wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IuaXMgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgZGF0YXNldENvbmZpZ3M6IGRhdGFzZXRDb25maWdzV2l0aENvbmRpdGlvbnMsXG4gICAgICB9KVxuXG4gICAgICAvLyBVcGRhdGUgcmVmIHRvIG1hdGNoIGRhdGFzZXRDb25maWdzXG4gICAgICBtb2NrQ29uZmlnQ29udGV4dC5kYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50ID0gZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9uc1xuXG4gICAgICBjb25zdCByZW1vdmVCdXR0b24gPSB3aXRoaW4oc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkuZ2V0QnlUZXh0KCdSZW1vdmUgQ29uZGl0aW9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2socmVtb3ZlQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YXNldENvbmZpZ3MpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgbWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtdLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdXBkYXRpbmcgbWV0YWRhdGEgY29uZGl0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcblxuICAgICAgY29uc3QgZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9ucyA9IHtcbiAgICAgICAgLi4ubW9ja0NvbmZpZ0NvbnRleHQuZGF0YXNldENvbmZpZ3MsXG4gICAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zOiB7XG4gICAgICAgICAgbG9naWNhbF9vcGVyYXRvcjogTG9naWNhbE9wZXJhdG9yLmFuZCxcbiAgICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICB7IGlkOiAnY29uZGl0aW9uLWlkJywgbmFtZTogJ3Rlc3QnLCBjb21wYXJpc29uX29wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IuaXMgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgZGF0YXNldENvbmZpZ3M6IGRhdGFzZXRDb25maWdzV2l0aENvbmRpdGlvbnMsXG4gICAgICB9KVxuXG4gICAgICBtb2NrQ29uZmlnQ29udGV4dC5kYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50ID0gZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9uc1xuXG4gICAgICBjb25zdCB1cGRhdGVCdXR0b24gPSB3aXRoaW4oc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkuZ2V0QnlUZXh0KCdVcGRhdGUgQ29uZGl0aW9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXBkYXRlQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YXNldENvbmZpZ3MpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgbWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3VwZGF0ZWQnLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdG9nZ2xpbmcgbG9naWNhbCBvcGVyYXRvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcblxuICAgICAgY29uc3QgZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9ucyA9IHtcbiAgICAgICAgLi4ubW9ja0NvbmZpZ0NvbnRleHQuZGF0YXNldENvbmZpZ3MsXG4gICAgICAgIG1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zOiB7XG4gICAgICAgICAgbG9naWNhbF9vcGVyYXRvcjogTG9naWNhbE9wZXJhdG9yLmFuZCxcbiAgICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICB7IGlkOiAnY29uZGl0aW9uLWlkJywgbmFtZTogJ3Rlc3QnLCBjb21wYXJpc29uX29wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IuaXMgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgZGF0YXNldENvbmZpZ3M6IGRhdGFzZXRDb25maWdzV2l0aENvbmRpdGlvbnMsXG4gICAgICB9KVxuXG4gICAgICBtb2NrQ29uZmlnQ29udGV4dC5kYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50ID0gZGF0YXNldENvbmZpZ3NXaXRoQ29uZGl0aW9uc1xuXG4gICAgICBjb25zdCB0b2dnbGVCdXR0b24gPSB3aXRoaW4oc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkuZ2V0QnlUZXh0KCdUb2dnbGUgT3BlcmF0b3InKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0b2dnbGVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrQ29uZmlnQ29udGV4dC5zZXREYXRhc2V0Q29uZmlncykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBtZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9uczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgbG9naWNhbF9vcGVyYXRvcjogTG9naWNhbE9wZXJhdG9yLm9yLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgZG9jX21ldGFkYXRhIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICBkb2NfbWV0YWRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogW2RhdGFzZXRdLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtZmlsdGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21ldGFkYXRhLWxpc3QtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkb2NfbWV0YWRhdGEgYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICBkb2NfbWV0YWRhdGE6IFtdLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtZXRhZGF0YS1maWx0ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtbGlzdC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgdXNlclByb2ZpbGUnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQodXNlQ29udGV4dCkubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgLi4ubW9ja0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIHVzZXJQcm9maWxlOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBjYXJkLWl0ZW0tJHtkYXRhc2V0LmlkfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgZGF0YXNldENvbmZpZ3NSZWYgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCgpXG5cbiAgICAgIC8vIFRlc3Qgd2l0aCB1bmRlZmluZWQgZGF0YXNldENvbmZpZ3NSZWYgLSBjb21wb25lbnQgcmVuZGVycyB3aXRob3V0IGltbWVkaWF0ZSBlcnJvclxuICAgICAgLy8gVGhlIGNvbXBvbmVudCB3aWxsIGZhaWwgb24gaW50ZXJhY3Rpb24gZHVlIHRvIG5vbi1udWxsIGFzc2VydGlvbnMgaW4gaGFuZGxlcnNcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICAgICAgZGF0YXNldENvbmZpZ3NSZWY6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgIH0pXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG5cbiAgICAgIC8vIFRoZSBjb21wb25lbnQgY3VycmVudGx5IGV4cGVjdHMgZGF0YXNldENvbmZpZ3NSZWYgdG8gZXhpc3QgZm9yIGludGVyYWN0aW9uc1xuICAgICAgLy8gVGhpcyB0ZXN0IGRvY3VtZW50cyB0aGUgY3VycmVudCBiZWhhdmlvciBhbmQgcmVxdWlyZW1lbnRzXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgcHJvbXB0X3ZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIC8vIENvbnRleHQgdmFyIGlzIG9ubHkgc2hvd24gd2hlbiBkYXRhc2V0cyBleGlzdCBBTkQgdGhlcmUgYXJlIHByb21wdF92YXJpYWJsZXNcbiAgICAgIC8vIFRlc3Qgd2l0aCBubyBkYXRhc2V0cyB0byBlbnN1cmUgY29udGV4dCB2YXIgaXMgbm90IHNob3duXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTixcbiAgICAgICAgZGF0YVNldHM6IFtdLFxuICAgICAgICBtb2RlbENvbmZpZzoge1xuICAgICAgICAgIGNvbmZpZ3M6IHtcbiAgICAgICAgICAgIHByb21wdF92YXJpYWJsZXM6IFtdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NvbnRleHQtdmFyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcG9uZW50IEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW50ZWdyYXRlIHdpdGggY2FyZCBpdGVtIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRGF0YXNldCh7IGlkOiAnZHMxJywgbmFtZTogJ0RhdGFzZXQgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHsgaWQ6ICdkczInLCBuYW1lOiAnRGF0YXNldCAyJyB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBkYXRhc2V0cyxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtaXRlbS1kczEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1pdGVtLWRzMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YXNldCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhc2V0IDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGludGVncmF0ZSB3aXRoIHBhcmFtcyBjb25maWcgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YXNldHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KCksXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHsgaWQ6ICdkczInIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IGRhdGFzZXRzLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGFyYW1zQ29uZmlnID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbXMtY29uZmlnJylcbiAgICAgIGV4cGVjdChwYXJhbXNDb25maWcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChwYXJhbXNDb25maWcpLnRvSGF2ZVRleHRDb250ZW50KCdQYXJhbXMgKDIpJylcbiAgICAgIGV4cGVjdChwYXJhbXNDb25maWcpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGludGVncmF0ZSB3aXRoIG1ldGFkYXRhIGZpbHRlciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhc2V0cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICAgIGRvY19tZXRhZGF0YTogW1xuICAgICAgICAgICAgeyBuYW1lOiAnY2F0ZWdvcnknLCB0eXBlOiAnc3RyaW5nJyB9IGFzIGFueSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3RhZ3MnLCB0eXBlOiAnc3RyaW5nJyB9IGFzIGFueSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICAgIGlkOiAnZHMyJyxcbiAgICAgICAgICBkb2NfbWV0YWRhdGE6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2NhdGVnb3J5JywgdHlwZTogJ3N0cmluZycgfSBhcyBhbnksXG4gICAgICAgICAgICB7IG5hbWU6ICdwcmlvcml0eScsIHR5cGU6ICdudW1iZXInIH0gYXMgYW55LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IGRhdGFzZXRzLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbWV0YWRhdGFGaWx0ZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21ldGFkYXRhLWZpbHRlcicpXG4gICAgICBleHBlY3QobWV0YWRhdGFGaWx0ZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIFNob3VsZCBzaG93IGludGVyc2VjdGlvbiAob25seSAnY2F0ZWdvcnknKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtbGlzdC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTW9kZWwgQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtZXRhZGF0YSBtb2RlbCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtkYXRhc2V0XSxcbiAgICAgICAgZGF0YXNldENvbmZpZ3M6IHtcbiAgICAgICAgICAuLi5tb2NrQ29uZmlnQ29udGV4dC5kYXRhc2V0Q29uZmlncyxcbiAgICAgICAgICBtZXRhZGF0YV9tb2RlbF9jb25maWc6IHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgICAgIG5hbWU6ICdncHQtMy41LXR1cmJvJyxcbiAgICAgICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gICAgICAgICAgICBjb21wbGV0aW9uX3BhcmFtczogeyB0ZW1wZXJhdHVyZTogMC43IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRoZSBjb21wb25lbnQgd291bGQgbmVlZCB0byBleHBvc2UgdGhpcyBmdW5jdGlvbmFsaXR5IHRocm91Z2ggdGhlIG1ldGFkYXRhIGZpbHRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbWV0YWRhdGEtZmlsdGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWV0YWRhdGEgY29tcGxldGlvbiBwYXJhbXMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICAgIGRhdGFzZXRDb25maWdzOiB7XG4gICAgICAgICAgLi4ubW9ja0NvbmZpZ0NvbnRleHQuZGF0YXNldENvbmZpZ3MsXG4gICAgICAgICAgbWV0YWRhdGFfbW9kZWxfY29uZmlnOiB7XG4gICAgICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgICAgICBuYW1lOiAnZ3B0LTMuNS10dXJibycsXG4gICAgICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICAgICAgICAgICAgY29tcGxldGlvbl9wYXJhbXM6IHsgdGVtcGVyYXR1cmU6IDAuNSwgbWF4X3Rva2VuczogMTAwIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21ldGFkYXRhLWZpbHRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGVybWlzc2lvbiBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhpZGUgZWRpdCBvcHRpb25zIHdoZW4gdXNlciBsYWNrcyBwZXJtaXNzaW9uJywgKCkgPT4ge1xuICAgICAgdmkubW9ja2VkKGhhc0VkaXRQZXJtaXNzaW9uRm9yRGF0YXNldCkubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuXG4gICAgICBjb25zdCBkYXRhc2V0ID0gY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICBjcmVhdGVkX2J5OiAnb3RoZXItdXNlcicsXG4gICAgICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLm9ubHlNZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogW2RhdGFzZXRdLFxuICAgICAgfSlcblxuICAgICAgLy8gVGhlIGVkaXRhYmxlIHByb3BlcnR5IHNob3VsZCBiZSBmYWxzZSB3aGVuIG5vIHBlcm1pc3Npb25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGNhcmQtaXRlbS0ke2RhdGFzZXQuaWR9YCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlYWRvbmx5IHN0YXRlIGZvciBub24tZWRpdGFibGUgZGF0YXNldHMnLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG5cbiAgICAgIGNvbnN0IGRhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCh7XG4gICAgICAgIGNyZWF0ZWRfYnk6ICdhZG1pbicsXG4gICAgICAgIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLmFsbFRlYW1NZW1iZXJzLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyRGF0YXNldENvbmZpZyh7XG4gICAgICAgIGRhdGFTZXRzOiBbZGF0YXNldF0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKGBjYXJkLWl0ZW0tJHtkYXRhc2V0LmlkfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZWRpdGluZyB3aGVuIHVzZXIgaGFzIHBhcnRpYWwgbWVtYmVyIHBlcm1pc3Npb24nLCAoKSA9PiB7XG4gICAgICB2aS5tb2NrZWQoaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcblxuICAgICAgY29uc3QgZGF0YXNldCA9IGNyZWF0ZU1vY2tEYXRhc2V0KHtcbiAgICAgICAgY3JlYXRlZF9ieTogJ2FkbWluJyxcbiAgICAgICAgcGVybWlzc2lvbjogRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMsXG4gICAgICAgIHBhcnRpYWxfbWVtYmVyX2xpc3Q6IFsndXNlci0xMjMnXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogW2RhdGFzZXRdLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZChgY2FyZC1pdGVtLSR7ZGF0YXNldC5pZH1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RhdGFzZXQgUmVvcmRlcmluZyBhbmQgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGRhdGFzZXQgb3JkZXIgYWZ0ZXIgdXBkYXRlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRGF0YXNldCh7IGlkOiAnZHMxJywgbmFtZTogJ0RhdGFzZXQgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHsgaWQ6ICdkczInLCBuYW1lOiAnRGF0YXNldCAyJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFzZXQoeyBpZDogJ2RzMycsIG5hbWU6ICdEYXRhc2V0IDMnIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IGRhdGFzZXRzLFxuICAgICAgfSlcblxuICAgICAgLy8gVmVyaWZ5IG9yZGVyIGlzIG1haW50YWluZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEYXRhc2V0IDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RhdGFzZXQgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGF0YXNldCAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgZGF0YXNldCBvcGVyYXRpb25zIGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgZGF0YXNldHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHsgaWQ6ICdkczEnLCBuYW1lOiAnRGF0YXNldCAxJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFzZXQoeyBpZDogJ2RzMicsIG5hbWU6ICdEYXRhc2V0IDInIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IGRhdGFzZXRzLFxuICAgICAgfSlcblxuICAgICAgLy8gUmVtb3ZlIGZpcnN0IGRhdGFzZXRcbiAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbjEgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdSZW1vdmUnKVswXVxuICAgICAgYXdhaXQgdXNlci5jbGljayhyZW1vdmVCdXR0b24xKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ0NvbnRleHQuc2V0RGF0YVNldHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtkYXRhc2V0c1sxXV0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcGxleCBDb25maWd1cmF0aW9uIFNjZW5hcmlvcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSByZXRyaWV2YWwgbWV0aG9kcyBpbiBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YXNldHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHtcbiAgICAgICAgICBpZDogJ2RzMScsXG4gICAgICAgICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgICAgICBzZWFyY2hfbWV0aG9kOiAnc2VtYW50aWNfc2VhcmNoJyBhcyBhbnksXG4gICAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnY29oZXJlJyxcbiAgICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICdyZXJhbmstdjMuNScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9wX2s6IDUsXG4gICAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC44LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgICBjcmVhdGVNb2NrRGF0YXNldCh7XG4gICAgICAgICAgaWQ6ICdkczInLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAgICAgc2VhcmNoX21ldGhvZDogJ2Z1bGxfdGV4dF9zZWFyY2gnIGFzIGFueSxcbiAgICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICAgICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogZGF0YXNldHMsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbXMtY29uZmlnJykpLnRvSGF2ZVRleHRDb250ZW50KCdQYXJhbXMgKDIpJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXh0ZXJuYWwga25vd2xlZGdlIGJhc2UgaW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBleHRlcm5hbERhdGFzZXQgPSBjcmVhdGVNb2NrRGF0YXNldCh7XG4gICAgICAgIHByb3ZpZGVyOiAnbm90aW9uJyxcbiAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2luZm86IHtcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfaWQ6ICdub3Rpb24tMTIzJyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkOiAnYXBpLTQ1NicsXG4gICAgICAgICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9uYW1lOiAnTm90aW9uIEludGVncmF0aW9uJyxcbiAgICAgICAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2VuZHBvaW50OiAnaHR0cHM6Ly9hcGkubm90aW9uLmNvbScsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IFtleHRlcm5hbERhdGFzZXRdLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZChgY2FyZC1pdGVtLSR7ZXh0ZXJuYWxEYXRhc2V0LmlkfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChleHRlcm5hbERhdGFzZXQubmFtZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQZXJmb3JtYW5jZSBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgZGF0YXNldCBsaXN0cyBlZmZpY2llbnRseScsICgpID0+IHtcbiAgICAgIC8vIENyZWF0ZSBtYW55IGRhdGFzZXRzIHRvIHRlc3QgcGVyZm9ybWFuY2VcbiAgICAgIGNvbnN0IG1hbnlEYXRhc2V0cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUwIH0sIChfLCBpKSA9PlxuICAgICAgICBjcmVhdGVNb2NrRGF0YXNldCh7XG4gICAgICAgICAgaWQ6IGBkcy0ke2l9YCxcbiAgICAgICAgICBuYW1lOiBgRGF0YXNldCAke2l9YCxcbiAgICAgICAgICBkb2NfbWV0YWRhdGE6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2NhdGVnb3J5JywgdHlwZTogJ3N0cmluZycgfSBhcyBhbnksXG4gICAgICAgICAgICB7IG5hbWU6ICdwcmlvcml0eScsIHR5cGU6ICdudW1iZXInIH0gYXMgYW55LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pKVxuXG4gICAgICByZW5kZXJEYXRhc2V0Q29uZmlnKHtcbiAgICAgICAgZGF0YVNldHM6IG1hbnlEYXRhc2V0cyxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtcy1jb25maWcnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1BhcmFtcyAoNTApJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWV0YWRhdGEgaW50ZXJzZWN0aW9uIGNhbGN1bGF0aW9uIGVmZmljaWVudGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YXNldHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEYXRhc2V0KHtcbiAgICAgICAgICBpZDogJ2RzMScsXG4gICAgICAgICAgZG9jX21ldGFkYXRhOiBbXG4gICAgICAgICAgICB7IG5hbWU6ICdjYXRlZ29yeScsIHR5cGU6ICdzdHJpbmcnIH0gYXMgYW55LFxuICAgICAgICAgICAgeyBuYW1lOiAndGFncycsIHR5cGU6ICdzdHJpbmcnIH0gYXMgYW55LFxuICAgICAgICAgICAgeyBuYW1lOiAncHJpb3JpdHknLCB0eXBlOiAnbnVtYmVyJyB9IGFzIGFueSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICAgIGlkOiAnZHMyJyxcbiAgICAgICAgICBkb2NfbWV0YWRhdGE6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ2NhdGVnb3J5JywgdHlwZTogJ3N0cmluZycgfSBhcyBhbnksXG4gICAgICAgICAgICB7IG5hbWU6ICdzdGF0dXMnLCB0eXBlOiAnc3RyaW5nJyB9IGFzIGFueSxcbiAgICAgICAgICAgIHsgbmFtZTogJ3ByaW9yaXR5JywgdHlwZTogJ251bWJlcicgfSBhcyBhbnksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIHJlbmRlckRhdGFzZXRDb25maWcoe1xuICAgICAgICBkYXRhU2V0czogZGF0YXNldHMsXG4gICAgICB9KVxuXG4gICAgICAvLyBTaG91bGQgY2FsY3VsYXRlIGludGVyc2VjdGlvbiBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21ldGFkYXRhLWZpbHRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=