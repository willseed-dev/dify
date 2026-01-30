"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = require("react");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const types_1 = require("@/app/components/tools/types");
const debug_1 = require("@/models/debug");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// ============================================================================
// Test Data Factories (Following testing.md guidelines)
// ============================================================================
/**
 * Factory function for creating mock ModelConfig with type safety
 */
function createMockModelConfig(overrides = {}) {
    return {
        provider: 'openai',
        model_id: 'gpt-3.5-turbo',
        mode: app_1.ModelModeType.chat,
        configs: {
            prompt_template: 'Test template',
            prompt_variables: [
                { key: 'var1', name: 'Variable 1', type: 'text', required: false },
            ],
        },
        chat_prompt_config: {
            prompt: [],
        },
        completion_prompt_config: {
            prompt: { text: '' },
            conversation_histories_role: {
                user_prefix: 'user',
                assistant_prefix: 'assistant',
            },
        },
        more_like_this: null,
        opening_statement: '',
        suggested_questions: [],
        sensitive_word_avoidance: null,
        speech_to_text: null,
        text_to_speech: null,
        file_upload: null,
        suggested_questions_after_answer: null,
        retriever_resource: null,
        annotation_reply: null,
        external_data_tools: [],
        system_parameters: {
            audio_file_size_limit: 0,
            file_size_limit: 0,
            image_file_size_limit: 0,
            video_file_size_limit: 0,
            workflow_file_upload_limit: 0,
        },
        dataSets: [],
        agentConfig: {
            enabled: false,
            max_iteration: 5,
            tools: [],
            strategy: app_1.AgentStrategy.react,
        },
        ...overrides,
    };
}
/**
 * Factory function for creating mock Collection list
 */
function createMockCollections(collections = []) {
    return collections.map((collection, index) => ({
        id: `collection-${index}`,
        name: `Collection ${index}`,
        icon: 'icon-url',
        type: 'tool',
        ...collection,
    }));
}
/**
 * Factory function for creating mock Provider Context
 */
function createMockProviderContext(overrides = {}) {
    return {
        textGenerationModelList: [
            {
                provider: 'openai',
                label: { en_US: 'OpenAI', zh_Hans: 'OpenAI' },
                icon_small: { en_US: 'icon', zh_Hans: 'icon' },
                status: declarations_1.ModelStatusEnum.active,
                models: [
                    {
                        model: 'gpt-3.5-turbo',
                        label: { en_US: 'GPT-3.5', zh_Hans: 'GPT-3.5' },
                        model_type: declarations_1.ModelTypeEnum.textGeneration,
                        features: [declarations_1.ModelFeatureEnum.vision],
                        fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
                        model_properties: {},
                        deprecated: false,
                    },
                ],
            },
        ],
        hasSettedApiKey: true,
        modelProviders: [],
        speech2textDefaultModel: null,
        ttsDefaultModel: null,
        agentThoughtDefaultModel: null,
        updateModelList: vi.fn(),
        onPlanInfoChanged: vi.fn(),
        refreshModelProviders: vi.fn(),
        refreshLicenseLimit: vi.fn(),
        ...overrides,
    };
}
// ============================================================================
// Mock External Dependencies ONLY (Following testing.md guidelines)
// ============================================================================
// Mock service layer (API calls)
const { mockSsePost } = vi.hoisted(() => ({
    mockSsePost: vi.fn(() => Promise.resolve()),
}));
vi.mock('@/service/base', () => ({
    ssePost: mockSsePost,
    post: vi.fn(() => Promise.resolve({ data: {} })),
    get: vi.fn(() => Promise.resolve({ data: {} })),
    del: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
}));
vi.mock('@/service/fetch', () => ({
    fetch: vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })),
}));
const { mockFetchConversationMessages, mockFetchSuggestedQuestions, mockStopChatMessageResponding } = vi.hoisted(() => ({
    mockFetchConversationMessages: vi.fn(),
    mockFetchSuggestedQuestions: vi.fn(),
    mockStopChatMessageResponding: vi.fn(),
}));
vi.mock('@/service/debug', () => ({
    fetchConversationMessages: mockFetchConversationMessages,
    fetchSuggestedQuestions: mockFetchSuggestedQuestions,
    stopChatMessageResponding: mockStopChatMessageResponding,
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/test',
    useParams: () => ({}),
}));
// Mock complex context providers
const mockDebugConfigContext = {
    appId: 'test-app-id',
    isAPIKeySet: true,
    isTrailFinished: false,
    mode: app_1.AppModeEnum.CHAT,
    modelModeType: app_1.ModelModeType.chat,
    promptMode: debug_1.PromptMode.simple,
    setPromptMode: vi.fn(),
    isAdvancedMode: false,
    isAgent: false,
    isFunctionCall: false,
    isOpenAI: true,
    collectionList: createMockCollections([
        { id: 'test-provider', name: 'Test Tool', icon: 'icon-url' },
    ]),
    canReturnToSimpleMode: false,
    setCanReturnToSimpleMode: vi.fn(),
    chatPromptConfig: {},
    completionPromptConfig: {},
    currentAdvancedPrompt: [],
    showHistoryModal: vi.fn(),
    conversationHistoriesRole: { user_prefix: 'user', assistant_prefix: 'assistant' },
    setConversationHistoriesRole: vi.fn(),
    setCurrentAdvancedPrompt: vi.fn(),
    hasSetBlockStatus: { context: false, history: false, query: false },
    conversationId: null,
    setConversationId: vi.fn(),
    introduction: '',
    setIntroduction: vi.fn(),
    suggestedQuestions: [],
    setSuggestedQuestions: vi.fn(),
    controlClearChatMessage: 0,
    setControlClearChatMessage: vi.fn(),
    prevPromptConfig: { prompt_template: '', prompt_variables: [] },
    setPrevPromptConfig: vi.fn(),
    moreLikeThisConfig: { enabled: false },
    setMoreLikeThisConfig: vi.fn(),
    suggestedQuestionsAfterAnswerConfig: { enabled: false },
    setSuggestedQuestionsAfterAnswerConfig: vi.fn(),
    speechToTextConfig: { enabled: false },
    setSpeechToTextConfig: vi.fn(),
    textToSpeechConfig: { enabled: false, voice: '', language: '' },
    setTextToSpeechConfig: vi.fn(),
    citationConfig: { enabled: false },
    setCitationConfig: vi.fn(),
    moderationConfig: { enabled: false },
    annotationConfig: { id: '', enabled: false, score_threshold: 0.7, embedding_model: { embedding_model_name: '', embedding_provider_name: '' } },
    setAnnotationConfig: vi.fn(),
    setModerationConfig: vi.fn(),
    externalDataToolsConfig: [],
    setExternalDataToolsConfig: vi.fn(),
    formattingChanged: false,
    setFormattingChanged: vi.fn(),
    inputs: { var1: 'test input' },
    setInputs: vi.fn(),
    query: '',
    setQuery: vi.fn(),
    completionParams: { max_tokens: 100, temperature: 0.7 },
    setCompletionParams: vi.fn(),
    modelConfig: createMockModelConfig({
        agentConfig: {
            enabled: false,
            max_iteration: 5,
            tools: [{
                    tool_name: 'test-tool',
                    provider_id: 'test-provider',
                    provider_type: types_1.CollectionType.builtIn,
                    provider_name: 'test-provider',
                    tool_label: 'Test Tool',
                    tool_parameters: {},
                    enabled: true,
                }],
            strategy: app_1.AgentStrategy.react,
        },
    }),
    setModelConfig: vi.fn(),
    dataSets: [],
    showSelectDataSet: vi.fn(),
    setDataSets: vi.fn(),
    datasetConfigs: {
        retrieval_model: 'single',
        reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
        top_k: 4,
        score_threshold_enabled: false,
        score_threshold: 0.7,
        datasets: { datasets: [] },
    },
    datasetConfigsRef: (0, react_2.createRef)(),
    setDatasetConfigs: vi.fn(),
    hasSetContextVar: false,
    isShowVisionConfig: false,
    visionConfig: { enabled: false, number_limits: 2, detail: app_1.Resolution.low, transfer_methods: [] },
    setVisionConfig: vi.fn(),
    isAllowVideoUpload: false,
    isShowDocumentConfig: false,
    isShowAudioConfig: false,
    rerankSettingModalOpen: false,
    setRerankSettingModalOpen: vi.fn(),
};
const { mockUseDebugConfigurationContext } = vi.hoisted(() => ({
    mockUseDebugConfigurationContext: vi.fn(),
}));
// Set up the default implementation after mockDebugConfigContext is defined
mockUseDebugConfigurationContext.mockReturnValue(mockDebugConfigContext);
vi.mock('@/context/debug-configuration', () => ({
    useDebugConfigurationContext: mockUseDebugConfigurationContext,
}));
const mockProviderContext = createMockProviderContext();
const { mockUseProviderContext } = vi.hoisted(() => ({
    mockUseProviderContext: vi.fn(),
}));
mockUseProviderContext.mockReturnValue(mockProviderContext);
vi.mock('@/context/provider-context', () => ({
    useProviderContext: mockUseProviderContext,
}));
const mockAppContext = {
    userProfile: {
        id: 'user-1',
        avatar_url: 'https://example.com/avatar.png',
        name: 'Test User',
        email: 'test@example.com',
    },
    isCurrentWorkspaceManager: false,
    isCurrentWorkspaceOwner: false,
    isCurrentWorkspaceDatasetOperator: false,
    mutateUserProfile: vi.fn(),
};
const { mockUseAppContext } = vi.hoisted(() => ({
    mockUseAppContext: vi.fn(),
}));
mockUseAppContext.mockReturnValue(mockAppContext);
vi.mock('@/context/app-context', () => ({
    useAppContext: mockUseAppContext,
}));
const defaultFeatures = {
    moreLikeThis: { enabled: false },
    opening: { enabled: false, opening_statement: '', suggested_questions: [] },
    moderation: { enabled: false },
    speech2text: { enabled: false },
    text2speech: { enabled: false },
    file: { enabled: false },
    suggested: { enabled: false },
    citation: { enabled: false },
    annotationReply: { enabled: false },
};
let mockFeaturesState = { ...defaultFeatures };
const { mockUseFeatures } = vi.hoisted(() => ({
    mockUseFeatures: vi.fn(),
}));
vi.mock('@/app/components/base/features/hooks', () => ({
    useFeatures: mockUseFeatures,
}));
const mockConfigFromDebugContext = {
    pre_prompt: 'Test prompt',
    prompt_type: 'simple',
    user_input_form: [],
    dataset_query_variable: '',
    opening_statement: '',
    more_like_this: { enabled: false },
    suggested_questions: [],
    suggested_questions_after_answer: { enabled: false },
    text_to_speech: { enabled: false },
    speech_to_text: { enabled: false },
    retriever_resource: { enabled: false },
    sensitive_word_avoidance: { enabled: false },
    agent_mode: {},
    dataset_configs: {},
    file_upload: { enabled: false },
    annotation_reply: { enabled: false },
    supportAnnotation: true,
    appId: 'test-app-id',
    supportCitationHitInfo: true,
};
const { mockUseConfigFromDebugContext, mockUseFormattingChangedSubscription } = vi.hoisted(() => ({
    mockUseConfigFromDebugContext: vi.fn(),
    mockUseFormattingChangedSubscription: vi.fn(),
}));
mockUseConfigFromDebugContext.mockReturnValue(mockConfigFromDebugContext);
vi.mock('../hooks', () => ({
    useConfigFromDebugContext: mockUseConfigFromDebugContext,
    useFormattingChangedSubscription: mockUseFormattingChangedSubscription,
}));
const mockSetShowAppConfigureFeaturesModal = vi.fn();
vi.mock('@/app/components/app/store', () => ({
    useStore: vi.fn((selector) => {
        if (typeof selector === 'function')
            return selector({ setShowAppConfigureFeaturesModal: mockSetShowAppConfigureFeaturesModal });
        return mockSetShowAppConfigureFeaturesModal;
    }),
}));
// Mock event emitter context
vi.mock('@/context/event-emitter', () => ({
    useEventEmitterContextContext: vi.fn(() => ({
        eventEmitter: null,
    })),
}));
// Mock toast context
vi.mock('@/app/components/base/toast', () => ({
    useToastContext: vi.fn(() => ({
        notify: vi.fn(),
    })),
}));
// Mock hooks/use-timestamp
vi.mock('@/hooks/use-timestamp', () => ({
    default: vi.fn(() => ({
        formatTime: vi.fn((timestamp) => new Date(timestamp).toLocaleString()),
    })),
}));
// Mock audio player manager
vi.mock('@/app/components/base/audio-btn/audio.player.manager', () => ({
    AudioPlayerManager: {
        getInstance: vi.fn(() => ({
            getAudioPlayer: vi.fn(),
            resetAudioPlayer: vi.fn(),
        })),
    },
}));
const mockFile = {
    id: 'file-1',
    name: 'test.png',
    size: 123,
    type: 'image/png',
    progress: 100,
    transferMethod: app_1.TransferMethod.local_file,
    supportFileType: 'image',
};
// Mock Chat component (complex with many dependencies)
// This is a pragmatic mock that tests the integration at DebugWithSingleModel level
vi.mock('@/app/components/base/chat/chat', () => ({
    default: function MockChat({ chatList, isResponding, onSend, onRegenerate, onStopResponding, suggestedQuestions, questionIcon, answerIcon, onAnnotationAdded, onAnnotationEdited, onAnnotationRemoved, switchSibling, onFeatureBarClick, }) {
        const items = chatList || [];
        const suggested = suggestedQuestions ?? [];
        return (<div data-testid="chat-component">
        <div data-testid="chat-list">
          {items.map((item) => (<div key={item.id} data-testid={`chat-item-${item.id}`}>
              {item.content}
            </div>))}
        </div>
        {questionIcon && <div data-testid="question-icon">{questionIcon}</div>}
        {answerIcon && <div data-testid="answer-icon">{answerIcon}</div>}
        <textarea data-testid="chat-input" placeholder="Type a message" onChange={() => {
                // Simulate input change
            }}/>
        <button data-testid="send-button" onClick={() => onSend?.('test message', [])} disabled={isResponding}>
          Send
        </button>
        <button data-testid="send-with-files" onClick={() => onSend?.('test message', [mockFile])} disabled={isResponding}>
          Send With Files
        </button>
        {isResponding && (<button data-testid="stop-button" onClick={onStopResponding}>
            Stop
          </button>)}
        {suggested.length > 0 && (<div data-testid="suggested-questions">
            {suggested.map((q, i) => (<button key={i} onClick={() => onSend?.(q, [])}>
                {q}
              </button>))}
          </div>)}
        {onRegenerate && (<button data-testid="regenerate-button" onClick={() => onRegenerate({
                    id: 'msg-1',
                    content: 'Question',
                    isAnswer: false,
                    message_files: [],
                    parentMessageId: 'msg-0',
                })}>
            Regenerate
          </button>)}
        {switchSibling && (<button data-testid="switch-sibling-button" onClick={() => switchSibling('sibling-1')}>
            Switch
          </button>)}
        {onFeatureBarClick && (<button data-testid="feature-bar-button" onClick={() => onFeatureBarClick(true)}>
            Features
          </button>)}
        {onAnnotationAdded && (<button data-testid="add-annotation-button" onClick={() => onAnnotationAdded('ann-1', 'user', 'q', 'a', 0)}>
            Add Annotation
          </button>)}
        {onAnnotationEdited && (<button data-testid="edit-annotation-button" onClick={() => onAnnotationEdited('q', 'a', 0)}>
            Edit Annotation
          </button>)}
        {onAnnotationRemoved && (<button data-testid="remove-annotation-button" onClick={() => onAnnotationRemoved(0)}>
            Remove Annotation
          </button>)}
      </div>);
    },
}));
// ============================================================================
// Tests
// ============================================================================
describe('DebugWithSingleModel', () => {
    let ref;
    beforeEach(() => {
        vi.clearAllMocks();
        ref = (0, react_2.createRef)();
        // Reset mock implementations using module-level mocks
        mockUseDebugConfigurationContext.mockReturnValue(mockDebugConfigContext);
        mockUseProviderContext.mockReturnValue(mockProviderContext);
        mockUseAppContext.mockReturnValue(mockAppContext);
        mockUseConfigFromDebugContext.mockReturnValue(mockConfigFromDebugContext);
        mockUseFormattingChangedSubscription.mockReturnValue(undefined);
        mockFeaturesState = { ...defaultFeatures };
        mockUseFeatures.mockImplementation((selector) => {
            if (typeof selector === 'function')
                return selector({ features: mockFeaturesState });
            return mockFeaturesState;
        });
        // Reset mock implementations
        mockFetchConversationMessages.mockResolvedValue({ data: [] });
        mockFetchSuggestedQuestions.mockResolvedValue({ data: [] });
        mockStopChatMessageResponding.mockResolvedValue({});
    });
    // Rendering Tests
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<index_1.default ref={ref}/>);
            // Verify Chat component is rendered
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('chat-input')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('send-button')).toBeInTheDocument();
        });
        it('should render with custom checkCanSend prop', () => {
            const checkCanSend = vi.fn(() => true);
            (0, react_1.render)(<index_1.default ref={ref} checkCanSend={checkCanSend}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });
    // Props Tests
    describe('Props', () => {
        it('should respect checkCanSend returning true', async () => {
            const checkCanSend = vi.fn(() => true);
            (0, react_1.render)(<index_1.default ref={ref} checkCanSend={checkCanSend}/>);
            const sendButton = react_1.screen.getByTestId('send-button');
            react_1.fireEvent.click(sendButton);
            await (0, react_1.waitFor)(() => {
                expect(checkCanSend).toHaveBeenCalled();
                expect(mockSsePost).toHaveBeenCalled();
            });
            expect(mockSsePost.mock.calls[0][0]).toBe('apps/test-app-id/chat-messages');
        });
        it('should prevent send when checkCanSend returns false', async () => {
            const checkCanSend = vi.fn(() => false);
            (0, react_1.render)(<index_1.default ref={ref} checkCanSend={checkCanSend}/>);
            const sendButton = react_1.screen.getByTestId('send-button');
            react_1.fireEvent.click(sendButton);
            await (0, react_1.waitFor)(() => {
                expect(checkCanSend).toHaveBeenCalled();
                expect(checkCanSend).toHaveReturnedWith(false);
            });
            expect(mockSsePost).not.toHaveBeenCalled();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should open feature configuration when feature bar is clicked', () => {
            (0, react_1.render)(<index_1.default ref={ref}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('feature-bar-button'));
            expect(mockSetShowAppConfigureFeaturesModal).toHaveBeenCalledWith(true);
        });
    });
    // Model Configuration Tests
    describe('Model Configuration', () => {
        it('should include opening features in request when enabled', async () => {
            mockFeaturesState = {
                ...defaultFeatures,
                opening: { enabled: true, opening_statement: 'Hello!', suggested_questions: ['Q1'] },
            };
            (0, react_1.render)(<index_1.default ref={ref}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('send-button'));
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
            const body = mockSsePost.mock.calls[0][1].body;
            expect(body.model_config.opening_statement).toBe('Hello!');
            expect(body.model_config.suggested_questions).toEqual(['Q1']);
        });
        it('should omit opening statement when feature is disabled', async () => {
            mockFeaturesState = {
                ...defaultFeatures,
                opening: { enabled: false, opening_statement: 'Should not appear', suggested_questions: ['Q1'] },
            };
            (0, react_1.render)(<index_1.default ref={ref}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('send-button'));
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
            const body = mockSsePost.mock.calls[0][1].body;
            expect(body.model_config.opening_statement).toBe('');
            expect(body.model_config.suggested_questions).toEqual([]);
        });
        it('should handle model without vision support', () => {
            mockUseProviderContext.mockReturnValue(createMockProviderContext({
                textGenerationModelList: [
                    {
                        provider: 'openai',
                        label: { en_US: 'OpenAI', zh_Hans: 'OpenAI' },
                        icon_small: { en_US: 'icon', zh_Hans: 'icon' },
                        status: declarations_1.ModelStatusEnum.active,
                        models: [
                            {
                                model: 'gpt-3.5-turbo',
                                label: { en_US: 'GPT-3.5', zh_Hans: 'GPT-3.5' },
                                model_type: declarations_1.ModelTypeEnum.textGeneration,
                                features: [], // No vision support
                                fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
                                model_properties: {},
                                deprecated: false,
                                status: declarations_1.ModelStatusEnum.active,
                                load_balancing_enabled: false,
                            },
                        ],
                    },
                ],
            }));
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle missing model in provider list', () => {
            mockUseProviderContext.mockReturnValue(createMockProviderContext({
                textGenerationModelList: [
                    {
                        provider: 'different-provider',
                        label: { en_US: 'Different Provider', zh_Hans: '不同提供商' },
                        icon_small: { en_US: 'icon', zh_Hans: 'icon' },
                        status: declarations_1.ModelStatusEnum.active,
                        models: [],
                    },
                ],
            }));
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });
    // Input Forms Tests
    describe('Input Forms', () => {
        it('should filter out api type prompt variables', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    configs: {
                        prompt_template: 'Test',
                        prompt_variables: [
                            { key: 'var1', name: 'Var 1', type: 'text', required: false },
                            { key: 'var2', name: 'Var 2', type: 'api', required: false },
                            { key: 'var3', name: 'Var 3', type: 'select', required: false },
                        ],
                    },
                }),
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            // Component should render successfully with filtered variables
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle empty prompt variables', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    configs: {
                        prompt_template: 'Test',
                        prompt_variables: [],
                    },
                }),
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });
    // Tool Icons Tests
    describe('Tool Icons', () => {
        it('should map tool icons from collection list', () => {
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle empty tools list', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    agentConfig: {
                        enabled: false,
                        max_iteration: 5,
                        tools: [],
                        strategy: app_1.AgentStrategy.react,
                    },
                }),
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle missing collection for tool', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    agentConfig: {
                        enabled: false,
                        max_iteration: 5,
                        tools: [{
                                tool_name: 'unknown-tool',
                                provider_id: 'unknown-provider',
                                provider_type: types_1.CollectionType.builtIn,
                                provider_name: 'unknown-provider',
                                tool_label: 'Unknown Tool',
                                tool_parameters: {},
                                enabled: true,
                            }],
                        strategy: app_1.AgentStrategy.react,
                    },
                }),
                collectionList: [],
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });
    // Edge Cases
    describe('Edge Cases', () => {
        it('should handle empty inputs', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                inputs: {},
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle missing user profile', () => {
            mockUseAppContext.mockReturnValue({
                ...mockAppContext,
                userProfile: {
                    id: '',
                    avatar_url: '',
                    name: '',
                    email: '',
                },
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
        it('should handle null completion params', () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                completionParams: {},
            });
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(react_1.screen.getByTestId('chat-component')).toBeInTheDocument();
        });
    });
    // Imperative Handle Tests
    describe('Imperative Handle', () => {
        it('should expose handleRestart method via ref', () => {
            (0, react_1.render)(<index_1.default ref={ref}/>);
            expect(ref.current).not.toBeNull();
            expect(ref.current?.handleRestart).toBeDefined();
            expect(typeof ref.current?.handleRestart).toBe('function');
        });
        it('should call handleRestart when invoked via ref', () => {
            (0, react_1.render)(<index_1.default ref={ref}/>);
            (0, react_1.act)(() => {
                ref.current?.handleRestart();
            });
        });
    });
    // File Upload Tests
    describe('File Upload', () => {
        it('should not include files when vision is not supported', async () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    model_id: 'gpt-3.5-turbo',
                }),
            });
            mockUseProviderContext.mockReturnValue(createMockProviderContext({
                textGenerationModelList: [
                    {
                        provider: 'openai',
                        label: { en_US: 'OpenAI', zh_Hans: 'OpenAI' },
                        icon_small: { en_US: 'icon', zh_Hans: 'icon' },
                        status: declarations_1.ModelStatusEnum.active,
                        models: [
                            {
                                model: 'gpt-3.5-turbo',
                                label: { en_US: 'GPT-3.5', zh_Hans: 'GPT-3.5' },
                                model_type: declarations_1.ModelTypeEnum.textGeneration,
                                features: [], // No vision
                                fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
                                model_properties: {},
                                deprecated: false,
                                status: declarations_1.ModelStatusEnum.active,
                                load_balancing_enabled: false,
                            },
                        ],
                    },
                ],
            }));
            mockFeaturesState = {
                ...defaultFeatures,
                file: { enabled: true },
            };
            (0, react_1.render)(<index_1.default ref={ref}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('send-with-files'));
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
            const body = mockSsePost.mock.calls[0][1].body;
            expect(body.files).toEqual([]);
        });
        it('should support files when vision is enabled', async () => {
            mockUseDebugConfigurationContext.mockReturnValue({
                ...mockDebugConfigContext,
                modelConfig: createMockModelConfig({
                    model_id: 'gpt-4-vision',
                }),
            });
            mockUseProviderContext.mockReturnValue(createMockProviderContext({
                textGenerationModelList: [
                    {
                        provider: 'openai',
                        label: { en_US: 'OpenAI', zh_Hans: 'OpenAI' },
                        icon_small: { en_US: 'icon', zh_Hans: 'icon' },
                        status: declarations_1.ModelStatusEnum.active,
                        models: [
                            {
                                model: 'gpt-4-vision',
                                label: { en_US: 'GPT-4 Vision', zh_Hans: 'GPT-4 Vision' },
                                model_type: declarations_1.ModelTypeEnum.textGeneration,
                                features: [declarations_1.ModelFeatureEnum.vision],
                                fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
                                model_properties: {},
                                deprecated: false,
                                status: declarations_1.ModelStatusEnum.active,
                                load_balancing_enabled: false,
                            },
                        ],
                    },
                ],
            }));
            mockFeaturesState = {
                ...defaultFeatures,
                file: { enabled: true },
            };
            (0, react_1.render)(<index_1.default ref={ref}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('send-with-files'));
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
            const body = mockSsePost.mock.calls[0][1].body;
            expect(body.files).toHaveLength(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0Esa0RBQWdGO0FBQ2hGLGlDQUFpQztBQUNqQywyR0FBb0s7QUFDcEssd0RBQTZEO0FBQzdELDBDQUEyQztBQUMzQyxxQ0FBbUc7QUFDbkcsbUNBQTBDO0FBRTFDLCtFQUErRTtBQUMvRSx3REFBd0Q7QUFDeEQsK0VBQStFO0FBRS9FOztHQUVHO0FBQ0gsU0FBUyxxQkFBcUIsQ0FBQyxZQUFrQyxFQUFFO0lBQ2pFLE9BQU87UUFDTCxRQUFRLEVBQUUsUUFBUTtRQUNsQixRQUFRLEVBQUUsZUFBZTtRQUN6QixJQUFJLEVBQUUsbUJBQWEsQ0FBQyxJQUFJO1FBQ3hCLE9BQU8sRUFBRTtZQUNQLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLGdCQUFnQixFQUFFO2dCQUNoQixFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7YUFDbkU7U0FDRjtRQUNELGtCQUFrQixFQUFFO1lBQ2xCLE1BQU0sRUFBRSxFQUFFO1NBQ1g7UUFDRCx3QkFBd0IsRUFBRTtZQUN4QixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3BCLDJCQUEyQixFQUFFO2dCQUMzQixXQUFXLEVBQUUsTUFBTTtnQkFDbkIsZ0JBQWdCLEVBQUUsV0FBVzthQUM5QjtTQUNGO1FBQ0QsY0FBYyxFQUFFLElBQUk7UUFDcEIsaUJBQWlCLEVBQUUsRUFBRTtRQUNyQixtQkFBbUIsRUFBRSxFQUFFO1FBQ3ZCLHdCQUF3QixFQUFFLElBQUk7UUFDOUIsY0FBYyxFQUFFLElBQUk7UUFDcEIsY0FBYyxFQUFFLElBQUk7UUFDcEIsV0FBVyxFQUFFLElBQUk7UUFDakIsZ0NBQWdDLEVBQUUsSUFBSTtRQUN0QyxrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLGdCQUFnQixFQUFFLElBQUk7UUFDdEIsbUJBQW1CLEVBQUUsRUFBRTtRQUN2QixpQkFBaUIsRUFBRTtZQUNqQixxQkFBcUIsRUFBRSxDQUFDO1lBQ3hCLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLHFCQUFxQixFQUFFLENBQUM7WUFDeEIscUJBQXFCLEVBQUUsQ0FBQztZQUN4QiwwQkFBMEIsRUFBRSxDQUFDO1NBQzlCO1FBQ0QsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUUsS0FBSztZQUNkLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLG1CQUFhLENBQUMsS0FBSztTQUM5QjtRQUNELEdBQUcsU0FBUztLQUNiLENBQUE7QUFDSCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLGNBQXFDLEVBQUU7SUFDcEUsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxFQUFFLEVBQUUsY0FBYyxLQUFLLEVBQUU7UUFDekIsSUFBSSxFQUFFLGNBQWMsS0FBSyxFQUFFO1FBQzNCLElBQUksRUFBRSxVQUFVO1FBQ2hCLElBQUksRUFBRSxNQUFNO1FBQ1osR0FBRyxVQUFVO0tBQ0MsQ0FBQSxDQUFDLENBQUE7QUFDbkIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyx5QkFBeUIsQ0FBQyxZQUEyQyxFQUFFO0lBQzlFLE9BQU87UUFDTCx1QkFBdUIsRUFBRTtZQUN2QjtnQkFDRSxRQUFRLEVBQUUsUUFBUTtnQkFDbEIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO2dCQUM3QyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQzlDLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU07Z0JBQzlCLE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxLQUFLLEVBQUUsZUFBZTt3QkFDdEIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO3dCQUMvQyxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjO3dCQUN4QyxRQUFRLEVBQUUsQ0FBQywrQkFBZ0IsQ0FBQyxNQUFNLENBQUM7d0JBQ25DLFVBQVUsRUFBRSxzQ0FBdUIsQ0FBQyxlQUFlO3dCQUNuRCxnQkFBZ0IsRUFBRSxFQUFFO3dCQUNwQixVQUFVLEVBQUUsS0FBSztxQkFDbEI7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsZUFBZSxFQUFFLElBQUk7UUFDckIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsdUJBQXVCLEVBQUUsSUFBSTtRQUM3QixlQUFlLEVBQUUsSUFBSTtRQUNyQix3QkFBd0IsRUFBRSxJQUFJO1FBQzlCLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3hCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIscUJBQXFCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5QixtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLEdBQUcsU0FBUztLQUNXLENBQUE7QUFDM0IsQ0FBQztBQUVELCtFQUErRTtBQUMvRSxvRUFBb0U7QUFDcEUsK0VBQStFO0FBRS9FLGlDQUFpQztBQUNqQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFvQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Q0FDL0UsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFFLFdBQVc7SUFDcEIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0MsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNoRCxDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDbkYsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLEVBQUUsNkJBQTZCLEVBQUUsMkJBQTJCLEVBQUUsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEgsNkJBQTZCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QywyQkFBMkIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3BDLDZCQUE2QixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDdkMsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMseUJBQXlCLEVBQUUsNkJBQTZCO0lBQ3hELHVCQUF1QixFQUFFLDJCQUEyQjtJQUNwRCx5QkFBeUIsRUFBRSw2QkFBNkI7Q0FDekQsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDcEMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU87SUFDMUIsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyxDQUFBO0FBRUgsaUNBQWlDO0FBQ2pDLE1BQU0sc0JBQXNCLEdBQUc7SUFDN0IsS0FBSyxFQUFFLGFBQWE7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsSUFBSSxFQUFFLGlCQUFXLENBQUMsSUFBSTtJQUN0QixhQUFhLEVBQUUsbUJBQWEsQ0FBQyxJQUFJO0lBQ2pDLFVBQVUsRUFBRSxrQkFBVSxDQUFDLE1BQU07SUFDN0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdEIsY0FBYyxFQUFFLEtBQUs7SUFDckIsT0FBTyxFQUFFLEtBQUs7SUFDZCxjQUFjLEVBQUUsS0FBSztJQUNyQixRQUFRLEVBQUUsSUFBSTtJQUNkLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQztRQUNwQyxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0tBQzdELENBQUM7SUFDRixxQkFBcUIsRUFBRSxLQUFLO0lBQzVCLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakMsZ0JBQWdCLEVBQUUsRUFBRTtJQUNwQixzQkFBc0IsRUFBRSxFQUFFO0lBQzFCLHFCQUFxQixFQUFFLEVBQUU7SUFDekIsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN6Qix5QkFBeUIsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFO0lBQ2pGLDRCQUE0QixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDckMsd0JBQXdCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqQyxpQkFBaUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ25FLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUIsWUFBWSxFQUFFLEVBQUU7SUFDaEIsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEIsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QixxQkFBcUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzlCLHVCQUF1QixFQUFFLENBQUM7SUFDMUIsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuQyxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO0lBQy9ELG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsa0JBQWtCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ3RDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUIsbUNBQW1DLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ3ZELHNDQUFzQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDL0Msa0JBQWtCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ3RDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUIsa0JBQWtCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtJQUMvRCxxQkFBcUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzlCLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDbEMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQixnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDcEMsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEVBQUU7SUFDOUksbUJBQW1CLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM1QixtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVCLHVCQUF1QixFQUFFLEVBQUU7SUFDM0IsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuQyxpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0IsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRTtJQUM5QixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsQixLQUFLLEVBQUUsRUFBRTtJQUNULFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2pCLGdCQUFnQixFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3ZELG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsV0FBVyxFQUFFLHFCQUFxQixDQUFDO1FBQ2pDLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxLQUFLO1lBQ2QsYUFBYSxFQUFFLENBQUM7WUFDaEIsS0FBSyxFQUFFLENBQUM7b0JBQ04sU0FBUyxFQUFFLFdBQVc7b0JBQ3RCLFdBQVcsRUFBRSxlQUFlO29CQUM1QixhQUFhLEVBQUUsc0JBQWMsQ0FBQyxPQUFPO29CQUNyQyxhQUFhLEVBQUUsZUFBZTtvQkFDOUIsVUFBVSxFQUFFLFdBQVc7b0JBQ3ZCLGVBQWUsRUFBRSxFQUFFO29CQUNuQixPQUFPLEVBQUUsSUFBSTtpQkFDZCxDQUFDO1lBQ0YsUUFBUSxFQUFFLG1CQUFhLENBQUMsS0FBSztTQUM5QjtLQUNGLENBQUM7SUFDRixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2QixRQUFRLEVBQUUsRUFBRTtJQUNaLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEIsY0FBYyxFQUFFO1FBQ2QsZUFBZSxFQUFFLFFBQVE7UUFDekIsZUFBZSxFQUFFLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsRUFBRTtRQUMxRSxLQUFLLEVBQUUsQ0FBQztRQUNSLHVCQUF1QixFQUFFLEtBQUs7UUFDOUIsZUFBZSxFQUFFLEdBQUc7UUFDcEIsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtLQUNUO0lBQ25CLGlCQUFpQixFQUFFLElBQUEsaUJBQVMsR0FBa0I7SUFDOUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQixnQkFBZ0IsRUFBRSxLQUFLO0lBQ3ZCLGtCQUFrQixFQUFFLEtBQUs7SUFDekIsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxnQkFBVSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7SUFDaEcsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEIsa0JBQWtCLEVBQUUsS0FBSztJQUN6QixvQkFBb0IsRUFBRSxLQUFLO0lBQzNCLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsc0JBQXNCLEVBQUUsS0FBSztJQUM3Qix5QkFBeUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ25DLENBQUE7QUFFRCxNQUFNLEVBQUUsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDN0QsZ0NBQWdDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUMxQyxDQUFDLENBQUMsQ0FBQTtBQUVILDRFQUE0RTtBQUM1RSxnQ0FBZ0MsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtBQUV4RSxFQUFFLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUMsNEJBQTRCLEVBQUUsZ0NBQWdDO0NBQy9ELENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSxtQkFBbUIsR0FBRyx5QkFBeUIsRUFBRSxDQUFBO0FBRXZELE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuRCxzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ2hDLENBQUMsQ0FBQyxDQUFBO0FBRUgsc0JBQXNCLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLENBQUE7QUFFM0QsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLGtCQUFrQixFQUFFLHNCQUFzQjtDQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sY0FBYyxHQUFHO0lBQ3JCLFdBQVcsRUFBRTtRQUNYLEVBQUUsRUFBRSxRQUFRO1FBQ1osVUFBVSxFQUFFLGdDQUFnQztRQUM1QyxJQUFJLEVBQUUsV0FBVztRQUNqQixLQUFLLEVBQUUsa0JBQWtCO0tBQzFCO0lBQ0QseUJBQXlCLEVBQUUsS0FBSztJQUNoQyx1QkFBdUIsRUFBRSxLQUFLO0lBQzlCLGlDQUFpQyxFQUFFLEtBQUs7SUFDeEMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUMzQixDQUFBO0FBRUQsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDM0IsQ0FBQyxDQUFDLENBQUE7QUFFSCxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUE7QUFFakQsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLGFBQWEsRUFBRSxpQkFBaUI7Q0FDakMsQ0FBQyxDQUFDLENBQUE7QUFjSCxNQUFNLGVBQWUsR0FBaUI7SUFDcEMsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUNoQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxFQUFFLEVBQUU7SUFDM0UsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUM5QixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQy9CLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDL0IsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUN4QixTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQzdCLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDNUIsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtDQUNwQyxDQUFBO0FBR0QsSUFBSSxpQkFBaUIsR0FBaUIsRUFBRSxHQUFHLGVBQWUsRUFBRSxDQUFBO0FBRTVELE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUMsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDekIsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckQsV0FBVyxFQUFFLGVBQWU7Q0FDN0IsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLDBCQUEwQixHQUFHO0lBQ2pDLFVBQVUsRUFBRSxhQUFhO0lBQ3pCLFdBQVcsRUFBRSxRQUFRO0lBQ3JCLGVBQWUsRUFBRSxFQUFFO0lBQ25CLHNCQUFzQixFQUFFLEVBQUU7SUFDMUIsaUJBQWlCLEVBQUUsRUFBRTtJQUNyQixjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ2xDLG1CQUFtQixFQUFFLEVBQUU7SUFDdkIsZ0NBQWdDLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQ3BELGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDbEMsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUNsQyxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDdEMsd0JBQXdCLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO0lBQzVDLFVBQVUsRUFBRSxFQUFFO0lBQ2QsZUFBZSxFQUFFLEVBQUU7SUFDbkIsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtJQUMvQixnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7SUFDcEMsaUJBQWlCLEVBQUUsSUFBSTtJQUN2QixLQUFLLEVBQUUsYUFBYTtJQUNwQixzQkFBc0IsRUFBRSxJQUFJO0NBQzdCLENBQUE7QUFFRCxNQUFNLEVBQUUsNkJBQTZCLEVBQUUsb0NBQW9DLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEcsNkJBQTZCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0QyxvQ0FBb0MsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQzlDLENBQUMsQ0FBQyxDQUFBO0FBRUgsNkJBQTZCLENBQUMsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFFekUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6Qix5QkFBeUIsRUFBRSw2QkFBNkI7SUFDeEQsZ0NBQWdDLEVBQUUsb0NBQW9DO0NBQ3ZFLENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSxvQ0FBb0MsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFcEQsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBZ0gsRUFBRSxFQUFFO1FBQ25JLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVTtZQUNoQyxPQUFPLFFBQVEsQ0FBQyxFQUFFLGdDQUFnQyxFQUFFLG9DQUFvQyxFQUFFLENBQUMsQ0FBQTtRQUM3RixPQUFPLG9DQUFvQyxDQUFBO0lBQzdDLENBQUMsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsNkJBQTZCO0FBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4Qyw2QkFBNkIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUMsWUFBWSxFQUFFLElBQUk7S0FDbkIsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDLENBQUE7QUFFSCxxQkFBcUI7QUFDckIsRUFBRSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7S0FDaEIsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDLENBQUE7QUFFSCwyQkFBMkI7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFpQixFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUMvRSxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMsQ0FBQTtBQUVILDRCQUE0QjtBQUM1QixFQUFFLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckUsa0JBQWtCLEVBQUU7UUFDbEIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN4QixjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QixnQkFBZ0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1NBQzFCLENBQUMsQ0FBQztLQUNKO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFrQkgsTUFBTSxRQUFRLEdBQWU7SUFDM0IsRUFBRSxFQUFFLFFBQVE7SUFDWixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxXQUFXO0lBQ2pCLFFBQVEsRUFBRSxHQUFHO0lBQ2IsY0FBYyxFQUFFLG9CQUFjLENBQUMsVUFBVTtJQUN6QyxlQUFlLEVBQUUsT0FBTztDQUN6QixDQUFBO0FBRUQsdURBQXVEO0FBQ3ZELG9GQUFvRjtBQUNwRixFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsT0FBTyxFQUFFLFNBQVMsUUFBUSxDQUFDLEVBQ3pCLFFBQVEsRUFDUixZQUFZLEVBQ1osTUFBTSxFQUNOLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsa0JBQWtCLEVBQ2xCLFlBQVksRUFDWixVQUFVLEVBQ1YsaUJBQWlCLEVBQ2pCLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIsYUFBYSxFQUNiLGlCQUFpQixHQUNIO1FBQ2QsTUFBTSxLQUFLLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQTtRQUM1QixNQUFNLFNBQVMsR0FBRyxrQkFBa0IsSUFBSSxFQUFFLENBQUE7UUFDMUMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FDL0I7UUFBQSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUMxQjtVQUFBLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQWMsRUFBRSxFQUFFLENBQUMsQ0FDN0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ3JEO2NBQUEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUNmO1lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLENBQ0o7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FDdEU7UUFBQSxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQ2hFO1FBQUEsQ0FBQyxRQUFRLENBQ1AsV0FBVyxDQUFDLFlBQVksQ0FDeEIsV0FBVyxDQUFDLGdCQUFnQixDQUM1QixRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2Isd0JBQXdCO1lBQzFCLENBQUMsQ0FBQyxFQUVKO1FBQUEsQ0FBQyxNQUFNLENBQ0wsV0FBVyxDQUFDLGFBQWEsQ0FDekIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzVDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUV2Qjs7UUFDRixFQUFFLE1BQU0sQ0FDUjtRQUFBLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyxpQkFBaUIsQ0FDN0IsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNwRCxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FFdkI7O1FBQ0YsRUFBRSxNQUFNLENBQ1I7UUFBQSxDQUFDLFlBQVksSUFBSSxDQUNmLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDMUQ7O1VBQ0YsRUFBRSxNQUFNLENBQUMsQ0FDVixDQUNEO1FBQUEsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUN2QixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQ3BDO1lBQUEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBUyxFQUFFLENBQVMsRUFBRSxFQUFFLENBQUMsQ0FDdkMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQzdDO2dCQUFBLENBQUMsQ0FBQyxDQUNKO2NBQUEsRUFBRSxNQUFNLENBQUMsQ0FDVixDQUFDLENBQ0o7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0Q7UUFBQSxDQUFDLFlBQVksSUFBSSxDQUNmLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyxtQkFBbUIsQ0FDL0IsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUMxQixFQUFFLEVBQUUsT0FBTztvQkFDWCxPQUFPLEVBQUUsVUFBVTtvQkFDbkIsUUFBUSxFQUFFLEtBQUs7b0JBQ2YsYUFBYSxFQUFFLEVBQUU7b0JBQ2pCLGVBQWUsRUFBRSxPQUFPO2lCQUN6QixDQUFDLENBQUMsQ0FFSDs7VUFDRixFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQ0Q7UUFBQSxDQUFDLGFBQWEsSUFBSSxDQUNoQixDQUFDLE1BQU0sQ0FDTCxXQUFXLENBQUMsdUJBQXVCLENBQ25DLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUUxQzs7VUFDRixFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQ0Q7UUFBQSxDQUFDLGlCQUFpQixJQUFJLENBQ3BCLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyxvQkFBb0IsQ0FDaEMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFdkM7O1VBQ0YsRUFBRSxNQUFNLENBQUMsQ0FDVixDQUNEO1FBQUEsQ0FBQyxpQkFBaUIsSUFBSSxDQUNwQixDQUFDLE1BQU0sQ0FDTCxXQUFXLENBQUMsdUJBQXVCLENBQ25DLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUUvRDs7VUFDRixFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQ0Q7UUFBQSxDQUFDLGtCQUFrQixJQUFJLENBQ3JCLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyx3QkFBd0IsQ0FDcEMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUUvQzs7VUFDRixFQUFFLE1BQU0sQ0FBQyxDQUNWLENBQ0Q7UUFBQSxDQUFDLG1CQUFtQixJQUFJLENBQ3RCLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQywwQkFBMEIsQ0FDdEMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FFdEM7O1VBQ0YsRUFBRSxNQUFNLENBQUMsQ0FDVixDQUNIO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLFFBQVE7QUFDUiwrRUFBK0U7QUFFL0UsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxJQUFJLEdBQWtELENBQUE7SUFFdEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixHQUFHLEdBQUcsSUFBQSxpQkFBUyxHQUFzQyxDQUFBO1FBRXJELHNEQUFzRDtRQUN0RCxnQ0FBZ0MsQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtRQUN4RSxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUMzRCxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDakQsNkJBQTZCLENBQUMsZUFBZSxDQUFDLDBCQUEwQixDQUFDLENBQUE7UUFDekUsb0NBQW9DLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQy9ELGlCQUFpQixHQUFHLEVBQUUsR0FBRyxlQUFlLEVBQUUsQ0FBQTtRQUMxQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUEwQixFQUFFLEVBQUU7WUFDaEUsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVO2dCQUNoQyxPQUFPLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUE7WUFDbEQsT0FBTyxpQkFBaUIsQ0FBQTtRQUMxQixDQUFDLENBQUMsQ0FBQTtRQUVGLDZCQUE2QjtRQUM3Qiw2QkFBNkIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzdELDJCQUEyQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDM0QsNkJBQTZCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFDLENBQUE7SUFFRixrQkFBa0I7SUFDbEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBNkMsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVwRixvQ0FBb0M7WUFDcEMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDaEUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzVELE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDckQsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUV0QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBNkMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVoSCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsY0FBYztJQUNkLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRXRDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWhILE1BQU0sVUFBVSxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDcEQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7WUFFM0IsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO2dCQUN2QyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUN4QyxDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO1FBQzdFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ25FLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7WUFFdkMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFaEgsTUFBTSxVQUFVLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUUzQixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7Z0JBQ3ZDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoRCxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsb0JBQW9CO0lBQ3BCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBNkMsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVwRixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtZQUV6RCxNQUFNLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN6RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNEJBQTRCO0lBQzVCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3ZFLGlCQUFpQixHQUFHO2dCQUNsQixHQUFHLGVBQWU7Z0JBQ2xCLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDckYsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtZQUVsRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDeEMsQ0FBQyxDQUFDLENBQUE7WUFFRixNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7WUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RFLGlCQUFpQixHQUFHO2dCQUNsQixHQUFHLGVBQWU7Z0JBQ2xCLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTthQUNqRyxDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1lBRWxELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUN4QyxDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsc0JBQXNCLENBQUMsZUFBZSxDQUFDLHlCQUF5QixDQUFDO2dCQUMvRCx1QkFBdUIsRUFBRTtvQkFDdkI7d0JBQ0UsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTt3QkFDN0MsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO3dCQUM5QyxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO3dCQUM5QixNQUFNLEVBQUU7NEJBQ047Z0NBQ0UsS0FBSyxFQUFFLGVBQWU7Z0NBQ3RCLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtnQ0FDL0MsVUFBVSxFQUFFLDRCQUFhLENBQUMsY0FBYztnQ0FDeEMsUUFBUSxFQUFFLEVBQUUsRUFBRSxvQkFBb0I7Z0NBQ2xDLFVBQVUsRUFBRSxzQ0FBdUIsQ0FBQyxlQUFlO2dDQUNuRCxnQkFBZ0IsRUFBRSxFQUFFO2dDQUNwQixVQUFVLEVBQUUsS0FBSztnQ0FDakIsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTTtnQ0FDOUIsc0JBQXNCLEVBQUUsS0FBSzs2QkFDOUI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQTtZQUVILElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxzQkFBc0IsQ0FBQyxlQUFlLENBQUMseUJBQXlCLENBQUM7Z0JBQy9ELHVCQUF1QixFQUFFO29CQUN2Qjt3QkFDRSxRQUFRLEVBQUUsb0JBQW9CO3dCQUM5QixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTt3QkFDeEQsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFO3dCQUM5QyxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO3dCQUM5QixNQUFNLEVBQUUsRUFBRTtxQkFDWDtpQkFDRjthQUNGLENBQUMsQ0FBQyxDQUFBO1lBRUgsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG9CQUFvQjtJQUNwQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQztvQkFDakMsT0FBTyxFQUFFO3dCQUNQLGVBQWUsRUFBRSxNQUFNO3dCQUN2QixnQkFBZ0IsRUFBRTs0QkFDaEIsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFOzRCQUM3RCxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7NEJBQzVELEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTt5QkFDaEU7cUJBQ0Y7aUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLCtEQUErRDtZQUMvRCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsZ0NBQWdDLENBQUMsZUFBZSxDQUFDO2dCQUMvQyxHQUFHLHNCQUFzQjtnQkFDekIsV0FBVyxFQUFFLHFCQUFxQixDQUFDO29CQUNqQyxPQUFPLEVBQUU7d0JBQ1AsZUFBZSxFQUFFLE1BQU07d0JBQ3ZCLGdCQUFnQixFQUFFLEVBQUU7cUJBQ3JCO2lCQUNGLENBQUM7YUFDSCxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBNkMsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVwRixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsbUJBQW1CO0lBQ25CLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQztvQkFDakMsV0FBVyxFQUFFO3dCQUNYLE9BQU8sRUFBRSxLQUFLO3dCQUNkLGFBQWEsRUFBRSxDQUFDO3dCQUNoQixLQUFLLEVBQUUsRUFBRTt3QkFDVCxRQUFRLEVBQUUsbUJBQWEsQ0FBQyxLQUFLO3FCQUM5QjtpQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQztvQkFDakMsV0FBVyxFQUFFO3dCQUNYLE9BQU8sRUFBRSxLQUFLO3dCQUNkLGFBQWEsRUFBRSxDQUFDO3dCQUNoQixLQUFLLEVBQUUsQ0FBQztnQ0FDTixTQUFTLEVBQUUsY0FBYztnQ0FDekIsV0FBVyxFQUFFLGtCQUFrQjtnQ0FDL0IsYUFBYSxFQUFFLHNCQUFjLENBQUMsT0FBTztnQ0FDckMsYUFBYSxFQUFFLGtCQUFrQjtnQ0FDakMsVUFBVSxFQUFFLGNBQWM7Z0NBQzFCLGVBQWUsRUFBRSxFQUFFO2dDQUNuQixPQUFPLEVBQUUsSUFBSTs2QkFDZCxDQUFDO3dCQUNGLFFBQVEsRUFBRSxtQkFBYSxDQUFDLEtBQUs7cUJBQzlCO2lCQUNGLENBQUM7Z0JBQ0YsY0FBYyxFQUFFLEVBQUU7YUFDbkIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLGFBQWE7SUFDYixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQ3BDLGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLE1BQU0sRUFBRSxFQUFTO2FBQ2xCLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtZQUM1QyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ2hDLEdBQUcsY0FBYztnQkFDakIsV0FBVyxFQUFFO29CQUNYLEVBQUUsRUFBRSxFQUFFO29CQUNOLFVBQVUsRUFBRSxFQUFFO29CQUNkLElBQUksRUFBRSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFFO2lCQUNWO2FBQ0YsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLGdCQUFnQixFQUFFLEVBQVM7YUFDNUIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDBCQUEwQjtJQUMxQixRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7WUFDaEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1lBQ3hELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFBO1lBQzlCLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG9CQUFvQjtJQUNwQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsdURBQXVELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDckUsZ0NBQWdDLENBQUMsZUFBZSxDQUFDO2dCQUMvQyxHQUFHLHNCQUFzQjtnQkFDekIsV0FBVyxFQUFFLHFCQUFxQixDQUFDO29CQUNqQyxRQUFRLEVBQUUsZUFBZTtpQkFDMUIsQ0FBQzthQUNILENBQUMsQ0FBQTtZQUVGLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDL0QsdUJBQXVCLEVBQUU7b0JBQ3ZCO3dCQUNFLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7d0JBQzdDLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTt3QkFDOUMsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTTt3QkFDOUIsTUFBTSxFQUFFOzRCQUNOO2dDQUNFLEtBQUssRUFBRSxlQUFlO2dDQUN0QixLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7Z0NBQy9DLFVBQVUsRUFBRSw0QkFBYSxDQUFDLGNBQWM7Z0NBQ3hDLFFBQVEsRUFBRSxFQUFFLEVBQUUsWUFBWTtnQ0FDMUIsVUFBVSxFQUFFLHNDQUF1QixDQUFDLGVBQWU7Z0NBQ25ELGdCQUFnQixFQUFFLEVBQUU7Z0NBQ3BCLFVBQVUsRUFBRSxLQUFLO2dDQUNqQixNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO2dDQUM5QixzQkFBc0IsRUFBRSxLQUFLOzZCQUM5Qjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQyxDQUFBO1lBRUgsaUJBQWlCLEdBQUc7Z0JBQ2xCLEdBQUcsZUFBZTtnQkFDbEIsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTthQUN4QixDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQTZDLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEYsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7WUFFdEQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQ3hDLENBQUMsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzNELGdDQUFnQyxDQUFDLGVBQWUsQ0FBQztnQkFDL0MsR0FBRyxzQkFBc0I7Z0JBQ3pCLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQztvQkFDakMsUUFBUSxFQUFFLGNBQWM7aUJBQ3pCLENBQUM7YUFDSCxDQUFDLENBQUE7WUFFRixzQkFBc0IsQ0FBQyxlQUFlLENBQUMseUJBQXlCLENBQUM7Z0JBQy9ELHVCQUF1QixFQUFFO29CQUN2Qjt3QkFDRSxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO3dCQUM3QyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7d0JBQzlDLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU07d0JBQzlCLE1BQU0sRUFBRTs0QkFDTjtnQ0FDRSxLQUFLLEVBQUUsY0FBYztnQ0FDckIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO2dDQUN6RCxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjO2dDQUN4QyxRQUFRLEVBQUUsQ0FBQywrQkFBZ0IsQ0FBQyxNQUFNLENBQUM7Z0NBQ25DLFVBQVUsRUFBRSxzQ0FBdUIsQ0FBQyxlQUFlO2dDQUNuRCxnQkFBZ0IsRUFBRSxFQUFFO2dDQUNwQixVQUFVLEVBQUUsS0FBSztnQ0FDakIsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTTtnQ0FDOUIsc0JBQXNCLEVBQUUsS0FBSzs2QkFDOUI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUMsQ0FBQTtZQUVILGlCQUFpQixHQUFHO2dCQUNsQixHQUFHLGVBQWU7Z0JBQ2xCLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7YUFDeEIsQ0FBQTtZQUVELElBQUEsY0FBTSxFQUFDLENBQUMsZUFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUE2QyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXBGLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO1lBRXRELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtZQUN4QyxDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSwgUmVmT2JqZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZSB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgdHlwZSB7IENoYXRJdGVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29sbGVjdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFByb3ZpZGVyQ29udGV4dFN0YXRlIH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgdHlwZSB7IERhdGFzZXRDb25maWdzLCBNb2RlbENvbmZpZyB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGNyZWF0ZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sIE1vZGVsRmVhdHVyZUVudW0sIE1vZGVsU3RhdHVzRW51bSwgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IENvbGxlY3Rpb25UeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy90eXBlcydcbmltcG9ydCB7IFByb21wdE1vZGUgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB7IEFnZW50U3RyYXRlZ3ksIEFwcE1vZGVFbnVtLCBNb2RlbE1vZGVUeXBlLCBSZXNvbHV0aW9uLCBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IERlYnVnV2l0aFNpbmdsZU1vZGVsIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXMgKEZvbGxvd2luZyB0ZXN0aW5nLm1kIGd1aWRlbGluZXMpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbW9jayBNb2RlbENvbmZpZyB3aXRoIHR5cGUgc2FmZXR5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tNb2RlbENvbmZpZyhvdmVycmlkZXM6IFBhcnRpYWw8TW9kZWxDb25maWc+ID0ge30pOiBNb2RlbENvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgIG1vZGVsX2lkOiAnZ3B0LTMuNS10dXJibycsXG4gICAgbW9kZTogTW9kZWxNb2RlVHlwZS5jaGF0LFxuICAgIGNvbmZpZ3M6IHtcbiAgICAgIHByb21wdF90ZW1wbGF0ZTogJ1Rlc3QgdGVtcGxhdGUnLFxuICAgICAgcHJvbXB0X3ZhcmlhYmxlczogW1xuICAgICAgICB7IGtleTogJ3ZhcjEnLCBuYW1lOiAnVmFyaWFibGUgMScsIHR5cGU6ICd0ZXh0JywgcmVxdWlyZWQ6IGZhbHNlIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgY2hhdF9wcm9tcHRfY29uZmlnOiB7XG4gICAgICBwcm9tcHQ6IFtdLFxuICAgIH0sXG4gICAgY29tcGxldGlvbl9wcm9tcHRfY29uZmlnOiB7XG4gICAgICBwcm9tcHQ6IHsgdGV4dDogJycgfSxcbiAgICAgIGNvbnZlcnNhdGlvbl9oaXN0b3JpZXNfcm9sZToge1xuICAgICAgICB1c2VyX3ByZWZpeDogJ3VzZXInLFxuICAgICAgICBhc3Npc3RhbnRfcHJlZml4OiAnYXNzaXN0YW50JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBtb3JlX2xpa2VfdGhpczogbnVsbCxcbiAgICBvcGVuaW5nX3N0YXRlbWVudDogJycsXG4gICAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogW10sXG4gICAgc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlOiBudWxsLFxuICAgIHNwZWVjaF90b190ZXh0OiBudWxsLFxuICAgIHRleHRfdG9fc3BlZWNoOiBudWxsLFxuICAgIGZpbGVfdXBsb2FkOiBudWxsLFxuICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyOiBudWxsLFxuICAgIHJldHJpZXZlcl9yZXNvdXJjZTogbnVsbCxcbiAgICBhbm5vdGF0aW9uX3JlcGx5OiBudWxsLFxuICAgIGV4dGVybmFsX2RhdGFfdG9vbHM6IFtdLFxuICAgIHN5c3RlbV9wYXJhbWV0ZXJzOiB7XG4gICAgICBhdWRpb19maWxlX3NpemVfbGltaXQ6IDAsXG4gICAgICBmaWxlX3NpemVfbGltaXQ6IDAsXG4gICAgICBpbWFnZV9maWxlX3NpemVfbGltaXQ6IDAsXG4gICAgICB2aWRlb19maWxlX3NpemVfbGltaXQ6IDAsXG4gICAgICB3b3JrZmxvd19maWxlX3VwbG9hZF9saW1pdDogMCxcbiAgICB9LFxuICAgIGRhdGFTZXRzOiBbXSxcbiAgICBhZ2VudENvbmZpZzoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBtYXhfaXRlcmF0aW9uOiA1LFxuICAgICAgdG9vbHM6IFtdLFxuICAgICAgc3RyYXRlZ3k6IEFnZW50U3RyYXRlZ3kucmVhY3QsXG4gICAgfSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBtb2NrIENvbGxlY3Rpb24gbGlzdFxuICovXG5mdW5jdGlvbiBjcmVhdGVNb2NrQ29sbGVjdGlvbnMoY29sbGVjdGlvbnM6IFBhcnRpYWw8Q29sbGVjdGlvbj5bXSA9IFtdKTogQ29sbGVjdGlvbltdIHtcbiAgcmV0dXJuIGNvbGxlY3Rpb25zLm1hcCgoY29sbGVjdGlvbiwgaW5kZXgpID0+ICh7XG4gICAgaWQ6IGBjb2xsZWN0aW9uLSR7aW5kZXh9YCxcbiAgICBuYW1lOiBgQ29sbGVjdGlvbiAke2luZGV4fWAsXG4gICAgaWNvbjogJ2ljb24tdXJsJyxcbiAgICB0eXBlOiAndG9vbCcsXG4gICAgLi4uY29sbGVjdGlvbixcbiAgfSBhcyBDb2xsZWN0aW9uKSlcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBtb2NrIFByb3ZpZGVyIENvbnRleHRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dChvdmVycmlkZXM6IFBhcnRpYWw8UHJvdmlkZXJDb250ZXh0U3RhdGU+ID0ge30pOiBQcm92aWRlckNvbnRleHRTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3Q6IFtcbiAgICAgIHtcbiAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICBsYWJlbDogeyBlbl9VUzogJ09wZW5BSScsIHpoX0hhbnM6ICdPcGVuQUknIH0sXG4gICAgICAgIGljb25fc21hbGw6IHsgZW5fVVM6ICdpY29uJywgemhfSGFuczogJ2ljb24nIH0sXG4gICAgICAgIHN0YXR1czogTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSxcbiAgICAgICAgbW9kZWxzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbW9kZWw6ICdncHQtMy41LXR1cmJvJyxcbiAgICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnR1BULTMuNScsIHpoX0hhbnM6ICdHUFQtMy41JyB9LFxuICAgICAgICAgICAgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bS50ZXh0R2VuZXJhdGlvbixcbiAgICAgICAgICAgIGZlYXR1cmVzOiBbTW9kZWxGZWF0dXJlRW51bS52aXNpb25dLFxuICAgICAgICAgICAgZmV0Y2hfZnJvbTogQ29uZmlndXJhdGlvbk1ldGhvZEVudW0ucHJlZGVmaW5lZE1vZGVsLFxuICAgICAgICAgICAgbW9kZWxfcHJvcGVydGllczoge30sXG4gICAgICAgICAgICBkZXByZWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICAgIGhhc1NldHRlZEFwaUtleTogdHJ1ZSxcbiAgICBtb2RlbFByb3ZpZGVyczogW10sXG4gICAgc3BlZWNoMnRleHREZWZhdWx0TW9kZWw6IG51bGwsXG4gICAgdHRzRGVmYXVsdE1vZGVsOiBudWxsLFxuICAgIGFnZW50VGhvdWdodERlZmF1bHRNb2RlbDogbnVsbCxcbiAgICB1cGRhdGVNb2RlbExpc3Q6IHZpLmZuKCksXG4gICAgb25QbGFuSW5mb0NoYW5nZWQ6IHZpLmZuKCksXG4gICAgcmVmcmVzaE1vZGVsUHJvdmlkZXJzOiB2aS5mbigpLFxuICAgIHJlZnJlc2hMaWNlbnNlTGltaXQ6IHZpLmZuKCksXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9IGFzIFByb3ZpZGVyQ29udGV4dFN0YXRlXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzIE9OTFkgKEZvbGxvd2luZyB0ZXN0aW5nLm1kIGd1aWRlbGluZXMpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgc2VydmljZSBsYXllciAoQVBJIGNhbGxzKVxuY29uc3QgeyBtb2NrU3NlUG9zdCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrU3NlUG9zdDogdmkuZm48KC4uLmFyZ3M6IGFueVtdKSA9PiBQcm9taXNlPHZvaWQ+PigoKSA9PiBQcm9taXNlLnJlc29sdmUoKSksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL2Jhc2UnLCAoKSA9PiAoe1xuICBzc2VQb3N0OiBtb2NrU3NlUG9zdCxcbiAgcG9zdDogdmkuZm4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgZGF0YToge30gfSkpLFxuICBnZXQ6IHZpLmZuKCgpID0+IFByb21pc2UucmVzb2x2ZSh7IGRhdGE6IHt9IH0pKSxcbiAgZGVsOiB2aS5mbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBkYXRhOiB7fSB9KSksXG4gIHBhdGNoOiB2aS5mbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBkYXRhOiB7fSB9KSksXG4gIHB1dDogdmkuZm4oKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgZGF0YToge30gfSkpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9mZXRjaCcsICgpID0+ICh7XG4gIGZldGNoOiB2aS5mbigoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBvazogdHJ1ZSwganNvbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHt9KSB9KSksXG59KSlcblxuY29uc3QgeyBtb2NrRmV0Y2hDb252ZXJzYXRpb25NZXNzYWdlcywgbW9ja0ZldGNoU3VnZ2VzdGVkUXVlc3Rpb25zLCBtb2NrU3RvcENoYXRNZXNzYWdlUmVzcG9uZGluZyB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrRmV0Y2hDb252ZXJzYXRpb25NZXNzYWdlczogdmkuZm4oKSxcbiAgbW9ja0ZldGNoU3VnZ2VzdGVkUXVlc3Rpb25zOiB2aS5mbigpLFxuICBtb2NrU3RvcENoYXRNZXNzYWdlUmVzcG9uZGluZzogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvZGVidWcnLCAoKSA9PiAoe1xuICBmZXRjaENvbnZlcnNhdGlvbk1lc3NhZ2VzOiBtb2NrRmV0Y2hDb252ZXJzYXRpb25NZXNzYWdlcyxcbiAgZmV0Y2hTdWdnZXN0ZWRRdWVzdGlvbnM6IG1vY2tGZXRjaFN1Z2dlc3RlZFF1ZXN0aW9ucyxcbiAgc3RvcENoYXRNZXNzYWdlUmVzcG9uZGluZzogbW9ja1N0b3BDaGF0TWVzc2FnZVJlc3BvbmRpbmcsXG59KSlcblxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiAoKSA9PiAoeyBwdXNoOiB2aS5mbigpIH0pLFxuICB1c2VQYXRobmFtZTogKCkgPT4gJy90ZXN0JyxcbiAgdXNlUGFyYW1zOiAoKSA9PiAoe30pLFxufSkpXG5cbi8vIE1vY2sgY29tcGxleCBjb250ZXh0IHByb3ZpZGVyc1xuY29uc3QgbW9ja0RlYnVnQ29uZmlnQ29udGV4dCA9IHtcbiAgYXBwSWQ6ICd0ZXN0LWFwcC1pZCcsXG4gIGlzQVBJS2V5U2V0OiB0cnVlLFxuICBpc1RyYWlsRmluaXNoZWQ6IGZhbHNlLFxuICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICBtb2RlbE1vZGVUeXBlOiBNb2RlbE1vZGVUeXBlLmNoYXQsXG4gIHByb21wdE1vZGU6IFByb21wdE1vZGUuc2ltcGxlLFxuICBzZXRQcm9tcHRNb2RlOiB2aS5mbigpLFxuICBpc0FkdmFuY2VkTW9kZTogZmFsc2UsXG4gIGlzQWdlbnQ6IGZhbHNlLFxuICBpc0Z1bmN0aW9uQ2FsbDogZmFsc2UsXG4gIGlzT3BlbkFJOiB0cnVlLFxuICBjb2xsZWN0aW9uTGlzdDogY3JlYXRlTW9ja0NvbGxlY3Rpb25zKFtcbiAgICB7IGlkOiAndGVzdC1wcm92aWRlcicsIG5hbWU6ICdUZXN0IFRvb2wnLCBpY29uOiAnaWNvbi11cmwnIH0sXG4gIF0pLFxuICBjYW5SZXR1cm5Ub1NpbXBsZU1vZGU6IGZhbHNlLFxuICBzZXRDYW5SZXR1cm5Ub1NpbXBsZU1vZGU6IHZpLmZuKCksXG4gIGNoYXRQcm9tcHRDb25maWc6IHt9LFxuICBjb21wbGV0aW9uUHJvbXB0Q29uZmlnOiB7fSxcbiAgY3VycmVudEFkdmFuY2VkUHJvbXB0OiBbXSxcbiAgc2hvd0hpc3RvcnlNb2RhbDogdmkuZm4oKSxcbiAgY29udmVyc2F0aW9uSGlzdG9yaWVzUm9sZTogeyB1c2VyX3ByZWZpeDogJ3VzZXInLCBhc3Npc3RhbnRfcHJlZml4OiAnYXNzaXN0YW50JyB9LFxuICBzZXRDb252ZXJzYXRpb25IaXN0b3JpZXNSb2xlOiB2aS5mbigpLFxuICBzZXRDdXJyZW50QWR2YW5jZWRQcm9tcHQ6IHZpLmZuKCksXG4gIGhhc1NldEJsb2NrU3RhdHVzOiB7IGNvbnRleHQ6IGZhbHNlLCBoaXN0b3J5OiBmYWxzZSwgcXVlcnk6IGZhbHNlIH0sXG4gIGNvbnZlcnNhdGlvbklkOiBudWxsLFxuICBzZXRDb252ZXJzYXRpb25JZDogdmkuZm4oKSxcbiAgaW50cm9kdWN0aW9uOiAnJyxcbiAgc2V0SW50cm9kdWN0aW9uOiB2aS5mbigpLFxuICBzdWdnZXN0ZWRRdWVzdGlvbnM6IFtdLFxuICBzZXRTdWdnZXN0ZWRRdWVzdGlvbnM6IHZpLmZuKCksXG4gIGNvbnRyb2xDbGVhckNoYXRNZXNzYWdlOiAwLFxuICBzZXRDb250cm9sQ2xlYXJDaGF0TWVzc2FnZTogdmkuZm4oKSxcbiAgcHJldlByb21wdENvbmZpZzogeyBwcm9tcHRfdGVtcGxhdGU6ICcnLCBwcm9tcHRfdmFyaWFibGVzOiBbXSB9LFxuICBzZXRQcmV2UHJvbXB0Q29uZmlnOiB2aS5mbigpLFxuICBtb3JlTGlrZVRoaXNDb25maWc6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgc2V0TW9yZUxpa2VUaGlzQ29uZmlnOiB2aS5mbigpLFxuICBzdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZzogeyBlbmFibGVkOiBmYWxzZSB9LFxuICBzZXRTdWdnZXN0ZWRRdWVzdGlvbnNBZnRlckFuc3dlckNvbmZpZzogdmkuZm4oKSxcbiAgc3BlZWNoVG9UZXh0Q29uZmlnOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHNldFNwZWVjaFRvVGV4dENvbmZpZzogdmkuZm4oKSxcbiAgdGV4dFRvU3BlZWNoQ29uZmlnOiB7IGVuYWJsZWQ6IGZhbHNlLCB2b2ljZTogJycsIGxhbmd1YWdlOiAnJyB9LFxuICBzZXRUZXh0VG9TcGVlY2hDb25maWc6IHZpLmZuKCksXG4gIGNpdGF0aW9uQ29uZmlnOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHNldENpdGF0aW9uQ29uZmlnOiB2aS5mbigpLFxuICBtb2RlcmF0aW9uQ29uZmlnOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIGFubm90YXRpb25Db25maWc6IHsgaWQ6ICcnLCBlbmFibGVkOiBmYWxzZSwgc2NvcmVfdGhyZXNob2xkOiAwLjcsIGVtYmVkZGluZ19tb2RlbDogeyBlbWJlZGRpbmdfbW9kZWxfbmFtZTogJycsIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiAnJyB9IH0sXG4gIHNldEFubm90YXRpb25Db25maWc6IHZpLmZuKCksXG4gIHNldE1vZGVyYXRpb25Db25maWc6IHZpLmZuKCksXG4gIGV4dGVybmFsRGF0YVRvb2xzQ29uZmlnOiBbXSxcbiAgc2V0RXh0ZXJuYWxEYXRhVG9vbHNDb25maWc6IHZpLmZuKCksXG4gIGZvcm1hdHRpbmdDaGFuZ2VkOiBmYWxzZSxcbiAgc2V0Rm9ybWF0dGluZ0NoYW5nZWQ6IHZpLmZuKCksXG4gIGlucHV0czogeyB2YXIxOiAndGVzdCBpbnB1dCcgfSxcbiAgc2V0SW5wdXRzOiB2aS5mbigpLFxuICBxdWVyeTogJycsXG4gIHNldFF1ZXJ5OiB2aS5mbigpLFxuICBjb21wbGV0aW9uUGFyYW1zOiB7IG1heF90b2tlbnM6IDEwMCwgdGVtcGVyYXR1cmU6IDAuNyB9LFxuICBzZXRDb21wbGV0aW9uUGFyYW1zOiB2aS5mbigpLFxuICBtb2RlbENvbmZpZzogY3JlYXRlTW9ja01vZGVsQ29uZmlnKHtcbiAgICBhZ2VudENvbmZpZzoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICBtYXhfaXRlcmF0aW9uOiA1LFxuICAgICAgdG9vbHM6IFt7XG4gICAgICAgIHRvb2xfbmFtZTogJ3Rlc3QtdG9vbCcsXG4gICAgICAgIHByb3ZpZGVyX2lkOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgIHByb3ZpZGVyX3R5cGU6IENvbGxlY3Rpb25UeXBlLmJ1aWx0SW4sXG4gICAgICAgIHByb3ZpZGVyX25hbWU6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgdG9vbF9sYWJlbDogJ1Rlc3QgVG9vbCcsXG4gICAgICAgIHRvb2xfcGFyYW1ldGVyczoge30sXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9XSxcbiAgICAgIHN0cmF0ZWd5OiBBZ2VudFN0cmF0ZWd5LnJlYWN0LFxuICAgIH0sXG4gIH0pLFxuICBzZXRNb2RlbENvbmZpZzogdmkuZm4oKSxcbiAgZGF0YVNldHM6IFtdLFxuICBzaG93U2VsZWN0RGF0YVNldDogdmkuZm4oKSxcbiAgc2V0RGF0YVNldHM6IHZpLmZuKCksXG4gIGRhdGFzZXRDb25maWdzOiB7XG4gICAgcmV0cmlldmFsX21vZGVsOiAnc2luZ2xlJyxcbiAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICB0b3BfazogNCxcbiAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgc2NvcmVfdGhyZXNob2xkOiAwLjcsXG4gICAgZGF0YXNldHM6IHsgZGF0YXNldHM6IFtdIH0sXG4gIH0gYXMgRGF0YXNldENvbmZpZ3MsXG4gIGRhdGFzZXRDb25maWdzUmVmOiBjcmVhdGVSZWY8RGF0YXNldENvbmZpZ3M+KCksXG4gIHNldERhdGFzZXRDb25maWdzOiB2aS5mbigpLFxuICBoYXNTZXRDb250ZXh0VmFyOiBmYWxzZSxcbiAgaXNTaG93VmlzaW9uQ29uZmlnOiBmYWxzZSxcbiAgdmlzaW9uQ29uZmlnOiB7IGVuYWJsZWQ6IGZhbHNlLCBudW1iZXJfbGltaXRzOiAyLCBkZXRhaWw6IFJlc29sdXRpb24ubG93LCB0cmFuc2Zlcl9tZXRob2RzOiBbXSB9LFxuICBzZXRWaXNpb25Db25maWc6IHZpLmZuKCksXG4gIGlzQWxsb3dWaWRlb1VwbG9hZDogZmFsc2UsXG4gIGlzU2hvd0RvY3VtZW50Q29uZmlnOiBmYWxzZSxcbiAgaXNTaG93QXVkaW9Db25maWc6IGZhbHNlLFxuICByZXJhbmtTZXR0aW5nTW9kYWxPcGVuOiBmYWxzZSxcbiAgc2V0UmVyYW5rU2V0dGluZ01vZGFsT3BlbjogdmkuZm4oKSxcbn1cblxuY29uc3QgeyBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dDogdmkuZm4oKSxcbn0pKVxuXG4vLyBTZXQgdXAgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gYWZ0ZXIgbW9ja0RlYnVnQ29uZmlnQ29udGV4dCBpcyBkZWZpbmVkXG5tb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUobW9ja0RlYnVnQ29uZmlnQ29udGV4dClcblxudmkubW9jaygnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nLCAoKSA9PiAoe1xuICB1c2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0OiBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dCxcbn0pKVxuXG5jb25zdCBtb2NrUHJvdmlkZXJDb250ZXh0ID0gY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dCgpXG5cbmNvbnN0IHsgbW9ja1VzZVByb3ZpZGVyQ29udGV4dCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlUHJvdmlkZXJDb250ZXh0OiB2aS5mbigpLFxufSkpXG5cbm1vY2tVc2VQcm92aWRlckNvbnRleHQubW9ja1JldHVyblZhbHVlKG1vY2tQcm92aWRlckNvbnRleHQpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUHJvdmlkZXJDb250ZXh0OiBtb2NrVXNlUHJvdmlkZXJDb250ZXh0LFxufSkpXG5cbmNvbnN0IG1vY2tBcHBDb250ZXh0ID0ge1xuICB1c2VyUHJvZmlsZToge1xuICAgIGlkOiAndXNlci0xJyxcbiAgICBhdmF0YXJfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nJyxcbiAgICBuYW1lOiAnVGVzdCBVc2VyJyxcbiAgICBlbWFpbDogJ3Rlc3RAZXhhbXBsZS5jb20nLFxuICB9LFxuICBpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyOiBmYWxzZSxcbiAgaXNDdXJyZW50V29ya3NwYWNlT3duZXI6IGZhbHNlLFxuICBpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3I6IGZhbHNlLFxuICBtdXRhdGVVc2VyUHJvZmlsZTogdmkuZm4oKSxcbn1cblxuY29uc3QgeyBtb2NrVXNlQXBwQ29udGV4dCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlQXBwQ29udGV4dDogdmkuZm4oKSxcbn0pKVxuXG5tb2NrVXNlQXBwQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUobW9ja0FwcENvbnRleHQpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUFwcENvbnRleHQ6IG1vY2tVc2VBcHBDb250ZXh0LFxufSkpXG5cbnR5cGUgRmVhdHVyZVN0YXRlID0ge1xuICBtb3JlTGlrZVRoaXM6IHsgZW5hYmxlZDogYm9vbGVhbiB9XG4gIG9wZW5pbmc6IHsgZW5hYmxlZDogYm9vbGVhbiwgb3BlbmluZ19zdGF0ZW1lbnQ6IHN0cmluZywgc3VnZ2VzdGVkX3F1ZXN0aW9uczogc3RyaW5nW10gfVxuICBtb2RlcmF0aW9uOiB7IGVuYWJsZWQ6IGJvb2xlYW4gfVxuICBzcGVlY2gydGV4dDogeyBlbmFibGVkOiBib29sZWFuIH1cbiAgdGV4dDJzcGVlY2g6IHsgZW5hYmxlZDogYm9vbGVhbiB9XG4gIGZpbGU6IHsgZW5hYmxlZDogYm9vbGVhbiB9XG4gIHN1Z2dlc3RlZDogeyBlbmFibGVkOiBib29sZWFuIH1cbiAgY2l0YXRpb246IHsgZW5hYmxlZDogYm9vbGVhbiB9XG4gIGFubm90YXRpb25SZXBseTogeyBlbmFibGVkOiBib29sZWFuIH1cbn1cblxuY29uc3QgZGVmYXVsdEZlYXR1cmVzOiBGZWF0dXJlU3RhdGUgPSB7XG4gIG1vcmVMaWtlVGhpczogeyBlbmFibGVkOiBmYWxzZSB9LFxuICBvcGVuaW5nOiB7IGVuYWJsZWQ6IGZhbHNlLCBvcGVuaW5nX3N0YXRlbWVudDogJycsIHN1Z2dlc3RlZF9xdWVzdGlvbnM6IFtdIH0sXG4gIG1vZGVyYXRpb246IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgc3BlZWNoMnRleHQ6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgdGV4dDJzcGVlY2g6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgZmlsZTogeyBlbmFibGVkOiBmYWxzZSB9LFxuICBzdWdnZXN0ZWQ6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgY2l0YXRpb246IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgYW5ub3RhdGlvblJlcGx5OiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG59XG50eXBlIEZlYXR1cmVTZWxlY3RvciA9IChzdGF0ZTogeyBmZWF0dXJlczogRmVhdHVyZVN0YXRlIH0pID0+IHVua25vd25cblxubGV0IG1vY2tGZWF0dXJlc1N0YXRlOiBGZWF0dXJlU3RhdGUgPSB7IC4uLmRlZmF1bHRGZWF0dXJlcyB9XG5cbmNvbnN0IHsgbW9ja1VzZUZlYXR1cmVzIH0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tVc2VGZWF0dXJlczogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VGZWF0dXJlczogbW9ja1VzZUZlYXR1cmVzLFxufSkpXG5cbmNvbnN0IG1vY2tDb25maWdGcm9tRGVidWdDb250ZXh0ID0ge1xuICBwcmVfcHJvbXB0OiAnVGVzdCBwcm9tcHQnLFxuICBwcm9tcHRfdHlwZTogJ3NpbXBsZScsXG4gIHVzZXJfaW5wdXRfZm9ybTogW10sXG4gIGRhdGFzZXRfcXVlcnlfdmFyaWFibGU6ICcnLFxuICBvcGVuaW5nX3N0YXRlbWVudDogJycsXG4gIG1vcmVfbGlrZV90aGlzOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHN1Z2dlc3RlZF9xdWVzdGlvbnM6IFtdLFxuICBzdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlcjogeyBlbmFibGVkOiBmYWxzZSB9LFxuICB0ZXh0X3RvX3NwZWVjaDogeyBlbmFibGVkOiBmYWxzZSB9LFxuICBzcGVlY2hfdG9fdGV4dDogeyBlbmFibGVkOiBmYWxzZSB9LFxuICByZXRyaWV2ZXJfcmVzb3VyY2U6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIGFnZW50X21vZGU6IHt9LFxuICBkYXRhc2V0X2NvbmZpZ3M6IHt9LFxuICBmaWxlX3VwbG9hZDogeyBlbmFibGVkOiBmYWxzZSB9LFxuICBhbm5vdGF0aW9uX3JlcGx5OiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gIHN1cHBvcnRBbm5vdGF0aW9uOiB0cnVlLFxuICBhcHBJZDogJ3Rlc3QtYXBwLWlkJyxcbiAgc3VwcG9ydENpdGF0aW9uSGl0SW5mbzogdHJ1ZSxcbn1cblxuY29uc3QgeyBtb2NrVXNlQ29uZmlnRnJvbURlYnVnQ29udGV4dCwgbW9ja1VzZUZvcm1hdHRpbmdDaGFuZ2VkU3Vic2NyaXB0aW9uIH0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tVc2VDb25maWdGcm9tRGVidWdDb250ZXh0OiB2aS5mbigpLFxuICBtb2NrVXNlRm9ybWF0dGluZ0NoYW5nZWRTdWJzY3JpcHRpb246IHZpLmZuKCksXG59KSlcblxubW9ja1VzZUNvbmZpZ0Zyb21EZWJ1Z0NvbnRleHQubW9ja1JldHVyblZhbHVlKG1vY2tDb25maWdGcm9tRGVidWdDb250ZXh0KVxuXG52aS5tb2NrKCcuLi9ob29rcycsICgpID0+ICh7XG4gIHVzZUNvbmZpZ0Zyb21EZWJ1Z0NvbnRleHQ6IG1vY2tVc2VDb25maWdGcm9tRGVidWdDb250ZXh0LFxuICB1c2VGb3JtYXR0aW5nQ2hhbmdlZFN1YnNjcmlwdGlvbjogbW9ja1VzZUZvcm1hdHRpbmdDaGFuZ2VkU3Vic2NyaXB0aW9uLFxufSkpXG5cbmNvbnN0IG1vY2tTZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCA9IHZpLmZuKClcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VTdG9yZTogdmkuZm4oKHNlbGVjdG9yPzogKHN0YXRlOiB7IHNldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsOiB0eXBlb2YgbW9ja1NldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsIH0pID0+IHVua25vd24pID0+IHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgcmV0dXJuIHNlbGVjdG9yKHsgc2V0U2hvd0FwcENvbmZpZ3VyZUZlYXR1cmVzTW9kYWw6IG1vY2tTZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCB9KVxuICAgIHJldHVybiBtb2NrU2V0U2hvd0FwcENvbmZpZ3VyZUZlYXR1cmVzTW9kYWxcbiAgfSksXG59KSlcblxuLy8gTW9jayBldmVudCBlbWl0dGVyIGNvbnRleHRcbnZpLm1vY2soJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJywgKCkgPT4gKHtcbiAgdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQ6IHZpLmZuKCgpID0+ICh7XG4gICAgZXZlbnRFbWl0dGVyOiBudWxsLFxuICB9KSksXG59KSlcblxuLy8gTW9jayB0b2FzdCBjb250ZXh0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICB1c2VUb2FzdENvbnRleHQ6IHZpLmZuKCgpID0+ICh7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9KSksXG59KSlcblxuLy8gTW9jayBob29rcy91c2UtdGltZXN0YW1wXG52aS5tb2NrKCdAL2hvb2tzL3VzZS10aW1lc3RhbXAnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB2aS5mbigoKSA9PiAoe1xuICAgIGZvcm1hdFRpbWU6IHZpLmZuKCh0aW1lc3RhbXA6IG51bWJlcikgPT4gbmV3IERhdGUodGltZXN0YW1wKS50b0xvY2FsZVN0cmluZygpKSxcbiAgfSkpLFxufSkpXG5cbi8vIE1vY2sgYXVkaW8gcGxheWVyIG1hbmFnZXJcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hdWRpby1idG4vYXVkaW8ucGxheWVyLm1hbmFnZXInLCAoKSA9PiAoe1xuICBBdWRpb1BsYXllck1hbmFnZXI6IHtcbiAgICBnZXRJbnN0YW5jZTogdmkuZm4oKCkgPT4gKHtcbiAgICAgIGdldEF1ZGlvUGxheWVyOiB2aS5mbigpLFxuICAgICAgcmVzZXRBdWRpb1BsYXllcjogdmkuZm4oKSxcbiAgICB9KSksXG4gIH0sXG59KSlcblxudHlwZSBNb2NrQ2hhdFByb3BzID0ge1xuICBjaGF0TGlzdD86IENoYXRJdGVtW11cbiAgaXNSZXNwb25kaW5nPzogYm9vbGVhblxuICBvblNlbmQ/OiAobWVzc2FnZTogc3RyaW5nLCBmaWxlcz86IEZpbGVFbnRpdHlbXSkgPT4gdm9pZFxuICBvblJlZ2VuZXJhdGU/OiAoY2hhdEl0ZW06IENoYXRJdGVtLCBlZGl0ZWRRdWVzdGlvbj86IHsgbWVzc2FnZTogc3RyaW5nLCBmaWxlcz86IEZpbGVFbnRpdHlbXSB9KSA9PiB2b2lkXG4gIG9uU3RvcFJlc3BvbmRpbmc/OiAoKSA9PiB2b2lkXG4gIHN1Z2dlc3RlZFF1ZXN0aW9ucz86IHN0cmluZ1tdXG4gIHF1ZXN0aW9uSWNvbj86IFJlYWN0Tm9kZVxuICBhbnN3ZXJJY29uPzogUmVhY3ROb2RlXG4gIG9uQW5ub3RhdGlvbkFkZGVkPzogKGFubm90YXRpb25JZDogc3RyaW5nLCBhdXRob3JOYW1lOiBzdHJpbmcsIHF1ZXN0aW9uOiBzdHJpbmcsIGFuc3dlcjogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB2b2lkXG4gIG9uQW5ub3RhdGlvbkVkaXRlZD86IChxdWVzdGlvbjogc3RyaW5nLCBhbnN3ZXI6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4gdm9pZFxuICBvbkFubm90YXRpb25SZW1vdmVkPzogKGluZGV4OiBudW1iZXIpID0+IHZvaWRcbiAgc3dpdGNoU2libGluZz86IChzaWJsaW5nTWVzc2FnZUlkOiBzdHJpbmcpID0+IHZvaWRcbiAgb25GZWF0dXJlQmFyQ2xpY2s/OiAoc3RhdGU6IGJvb2xlYW4pID0+IHZvaWRcbn1cblxuY29uc3QgbW9ja0ZpbGU6IEZpbGVFbnRpdHkgPSB7XG4gIGlkOiAnZmlsZS0xJyxcbiAgbmFtZTogJ3Rlc3QucG5nJyxcbiAgc2l6ZTogMTIzLFxuICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgcHJvZ3Jlc3M6IDEwMCxcbiAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gIHN1cHBvcnRGaWxlVHlwZTogJ2ltYWdlJyxcbn1cblxuLy8gTW9jayBDaGF0IGNvbXBvbmVudCAoY29tcGxleCB3aXRoIG1hbnkgZGVwZW5kZW5jaWVzKVxuLy8gVGhpcyBpcyBhIHByYWdtYXRpYyBtb2NrIHRoYXQgdGVzdHMgdGhlIGludGVncmF0aW9uIGF0IERlYnVnV2l0aFNpbmdsZU1vZGVsIGxldmVsXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogZnVuY3Rpb24gTW9ja0NoYXQoe1xuICAgIGNoYXRMaXN0LFxuICAgIGlzUmVzcG9uZGluZyxcbiAgICBvblNlbmQsXG4gICAgb25SZWdlbmVyYXRlLFxuICAgIG9uU3RvcFJlc3BvbmRpbmcsXG4gICAgc3VnZ2VzdGVkUXVlc3Rpb25zLFxuICAgIHF1ZXN0aW9uSWNvbixcbiAgICBhbnN3ZXJJY29uLFxuICAgIG9uQW5ub3RhdGlvbkFkZGVkLFxuICAgIG9uQW5ub3RhdGlvbkVkaXRlZCxcbiAgICBvbkFubm90YXRpb25SZW1vdmVkLFxuICAgIHN3aXRjaFNpYmxpbmcsXG4gICAgb25GZWF0dXJlQmFyQ2xpY2ssXG4gIH06IE1vY2tDaGF0UHJvcHMpIHtcbiAgICBjb25zdCBpdGVtcyA9IGNoYXRMaXN0IHx8IFtdXG4gICAgY29uc3Qgc3VnZ2VzdGVkID0gc3VnZ2VzdGVkUXVlc3Rpb25zID8/IFtdXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjaGF0LWNvbXBvbmVudFwiPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2hhdC1saXN0XCI+XG4gICAgICAgICAge2l0ZW1zLm1hcCgoaXRlbTogQ2hhdEl0ZW0pID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtLmlkfSBkYXRhLXRlc3RpZD17YGNoYXQtaXRlbS0ke2l0ZW0uaWR9YH0+XG4gICAgICAgICAgICAgIHtpdGVtLmNvbnRlbnR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtxdWVzdGlvbkljb24gJiYgPGRpdiBkYXRhLXRlc3RpZD1cInF1ZXN0aW9uLWljb25cIj57cXVlc3Rpb25JY29ufTwvZGl2Pn1cbiAgICAgICAge2Fuc3dlckljb24gJiYgPGRpdiBkYXRhLXRlc3RpZD1cImFuc3dlci1pY29uXCI+e2Fuc3dlckljb259PC9kaXY+fVxuICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImNoYXQtaW5wdXRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiVHlwZSBhIG1lc3NhZ2VcIlxuICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBTaW11bGF0ZSBpbnB1dCBjaGFuZ2VcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZW5kLWJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZW5kPy4oJ3Rlc3QgbWVzc2FnZScsIFtdKX1cbiAgICAgICAgICBkaXNhYmxlZD17aXNSZXNwb25kaW5nfVxuICAgICAgICA+XG4gICAgICAgICAgU2VuZFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic2VuZC13aXRoLWZpbGVzXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbmQ/LigndGVzdCBtZXNzYWdlJywgW21vY2tGaWxlXSl9XG4gICAgICAgICAgZGlzYWJsZWQ9e2lzUmVzcG9uZGluZ31cbiAgICAgICAgPlxuICAgICAgICAgIFNlbmQgV2l0aCBGaWxlc1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAge2lzUmVzcG9uZGluZyAmJiAoXG4gICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInN0b3AtYnV0dG9uXCIgb25DbGljaz17b25TdG9wUmVzcG9uZGluZ30+XG4gICAgICAgICAgICBTdG9wXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICl9XG4gICAgICAgIHtzdWdnZXN0ZWQubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInN1Z2dlc3RlZC1xdWVzdGlvbnNcIj5cbiAgICAgICAgICAgIHtzdWdnZXN0ZWQubWFwKChxOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT17aX0gb25DbGljaz17KCkgPT4gb25TZW5kPy4ocSwgW10pfT5cbiAgICAgICAgICAgICAgICB7cX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge29uUmVnZW5lcmF0ZSAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJyZWdlbmVyYXRlLWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblJlZ2VuZXJhdGUoe1xuICAgICAgICAgICAgICBpZDogJ21zZy0xJyxcbiAgICAgICAgICAgICAgY29udGVudDogJ1F1ZXN0aW9uJyxcbiAgICAgICAgICAgICAgaXNBbnN3ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBtZXNzYWdlX2ZpbGVzOiBbXSxcbiAgICAgICAgICAgICAgcGFyZW50TWVzc2FnZUlkOiAnbXNnLTAnLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUmVnZW5lcmF0ZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICB7c3dpdGNoU2libGluZyAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzd2l0Y2gtc2libGluZy1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc3dpdGNoU2libGluZygnc2libGluZy0xJyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgU3dpdGNoXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICl9XG4gICAgICAgIHtvbkZlYXR1cmVCYXJDbGljayAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJmZWF0dXJlLWJhci1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25GZWF0dXJlQmFyQ2xpY2sodHJ1ZSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgRmVhdHVyZXNcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAge29uQW5ub3RhdGlvbkFkZGVkICYmIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImFkZC1hbm5vdGF0aW9uLWJ1dHRvblwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkFubm90YXRpb25BZGRlZCgnYW5uLTEnLCAndXNlcicsICdxJywgJ2EnLCAwKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBBZGQgQW5ub3RhdGlvblxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICB7b25Bbm5vdGF0aW9uRWRpdGVkICYmIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cImVkaXQtYW5ub3RhdGlvbi1idXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25Bbm5vdGF0aW9uRWRpdGVkKCdxJywgJ2EnLCAwKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBFZGl0IEFubm90YXRpb25cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAge29uQW5ub3RhdGlvblJlbW92ZWQgJiYgKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwicmVtb3ZlLWFubm90YXRpb24tYnV0dG9uXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQW5ub3RhdGlvblJlbW92ZWQoMCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgUmVtb3ZlIEFubm90YXRpb25cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRGVidWdXaXRoU2luZ2xlTW9kZWwnLCAoKSA9PiB7XG4gIGxldCByZWY6IFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGUgfCBudWxsPlxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHJlZiA9IGNyZWF0ZVJlZjxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGUgfCBudWxsPigpXG5cbiAgICAvLyBSZXNldCBtb2NrIGltcGxlbWVudGF0aW9ucyB1c2luZyBtb2R1bGUtbGV2ZWwgbW9ja3NcbiAgICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUobW9ja0RlYnVnQ29uZmlnQ29udGV4dClcbiAgICBtb2NrVXNlUHJvdmlkZXJDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShtb2NrUHJvdmlkZXJDb250ZXh0KVxuICAgIG1vY2tVc2VBcHBDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShtb2NrQXBwQ29udGV4dClcbiAgICBtb2NrVXNlQ29uZmlnRnJvbURlYnVnQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUobW9ja0NvbmZpZ0Zyb21EZWJ1Z0NvbnRleHQpXG4gICAgbW9ja1VzZUZvcm1hdHRpbmdDaGFuZ2VkU3Vic2NyaXB0aW9uLm1vY2tSZXR1cm5WYWx1ZSh1bmRlZmluZWQpXG4gICAgbW9ja0ZlYXR1cmVzU3RhdGUgPSB7IC4uLmRlZmF1bHRGZWF0dXJlcyB9XG4gICAgbW9ja1VzZUZlYXR1cmVzLm1vY2tJbXBsZW1lbnRhdGlvbigoc2VsZWN0b3I/OiBGZWF0dXJlU2VsZWN0b3IpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiBzZWxlY3Rvcih7IGZlYXR1cmVzOiBtb2NrRmVhdHVyZXNTdGF0ZSB9KVxuICAgICAgcmV0dXJuIG1vY2tGZWF0dXJlc1N0YXRlXG4gICAgfSlcblxuICAgIC8vIFJlc2V0IG1vY2sgaW1wbGVtZW50YXRpb25zXG4gICAgbW9ja0ZldGNoQ29udmVyc2F0aW9uTWVzc2FnZXMubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuICAgIG1vY2tGZXRjaFN1Z2dlc3RlZFF1ZXN0aW9ucy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IFtdIH0pXG4gICAgbW9ja1N0b3BDaGF0TWVzc2FnZVJlc3BvbmRpbmcubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgQ2hhdCBjb21wb25lbnQgaXMgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtaW5wdXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VuZC1idXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGN1c3RvbSBjaGVja0NhblNlbmQgcHJvcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrQ2FuU2VuZCA9IHZpLmZuKCgpID0+IHRydWUpXG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IGNoZWNrQ2FuU2VuZD17Y2hlY2tDYW5TZW5kfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhdC1jb21wb25lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgVGVzdHNcbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVzcGVjdCBjaGVja0NhblNlbmQgcmV0dXJuaW5nIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGVja0NhblNlbmQgPSB2aS5mbigoKSA9PiB0cnVlKVxuXG4gICAgICByZW5kZXIoPERlYnVnV2l0aFNpbmdsZU1vZGVsIHJlZj17cmVmIGFzIFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGU+fSBjaGVja0NhblNlbmQ9e2NoZWNrQ2FuU2VuZH0gLz4pXG5cbiAgICAgIGNvbnN0IHNlbmRCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbmQtYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZW5kQnV0dG9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoZWNrQ2FuU2VuZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QubW9jay5jYWxsc1swXVswXSkudG9CZSgnYXBwcy90ZXN0LWFwcC1pZC9jaGF0LW1lc3NhZ2VzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IHNlbmQgd2hlbiBjaGVja0NhblNlbmQgcmV0dXJucyBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrQ2FuU2VuZCA9IHZpLmZuKCgpID0+IGZhbHNlKVxuXG4gICAgICByZW5kZXIoPERlYnVnV2l0aFNpbmdsZU1vZGVsIHJlZj17cmVmIGFzIFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGU+fSBjaGVja0NhblNlbmQ9e2NoZWNrQ2FuU2VuZH0gLz4pXG5cbiAgICAgIGNvbnN0IHNlbmRCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbmQtYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZW5kQnV0dG9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNoZWNrQ2FuU2VuZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChjaGVja0NhblNlbmQpLnRvSGF2ZVJldHVybmVkV2l0aChmYWxzZSlcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gZmVhdHVyZSBjb25maWd1cmF0aW9uIHdoZW4gZmVhdHVyZSBiYXIgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmZWF0dXJlLWJhci1idXR0b24nKSlcblxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIE1vZGVsIENvbmZpZ3VyYXRpb24gVGVzdHNcbiAgZGVzY3JpYmUoJ01vZGVsIENvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIG9wZW5pbmcgZmVhdHVyZXMgaW4gcmVxdWVzdCB3aGVuIGVuYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrRmVhdHVyZXNTdGF0ZSA9IHtcbiAgICAgICAgLi4uZGVmYXVsdEZlYXR1cmVzLFxuICAgICAgICBvcGVuaW5nOiB7IGVuYWJsZWQ6IHRydWUsIG9wZW5pbmdfc3RhdGVtZW50OiAnSGVsbG8hJywgc3VnZ2VzdGVkX3F1ZXN0aW9uczogWydRMSddIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZW5kLWJ1dHRvbicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGJvZHkgPSBtb2NrU3NlUG9zdC5tb2NrLmNhbGxzWzBdWzFdLmJvZHlcbiAgICAgIGV4cGVjdChib2R5Lm1vZGVsX2NvbmZpZy5vcGVuaW5nX3N0YXRlbWVudCkudG9CZSgnSGVsbG8hJylcbiAgICAgIGV4cGVjdChib2R5Lm1vZGVsX2NvbmZpZy5zdWdnZXN0ZWRfcXVlc3Rpb25zKS50b0VxdWFsKFsnUTEnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvbWl0IG9wZW5pbmcgc3RhdGVtZW50IHdoZW4gZmVhdHVyZSBpcyBkaXNhYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tGZWF0dXJlc1N0YXRlID0ge1xuICAgICAgICAuLi5kZWZhdWx0RmVhdHVyZXMsXG4gICAgICAgIG9wZW5pbmc6IHsgZW5hYmxlZDogZmFsc2UsIG9wZW5pbmdfc3RhdGVtZW50OiAnU2hvdWxkIG5vdCBhcHBlYXInLCBzdWdnZXN0ZWRfcXVlc3Rpb25zOiBbJ1ExJ10gfSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbCByZWY9e3JlZiBhcyBSZWZPYmplY3Q8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPn0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbmQtYnV0dG9uJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYm9keSA9IG1vY2tTc2VQb3N0Lm1vY2suY2FsbHNbMF1bMV0uYm9keVxuICAgICAgZXhwZWN0KGJvZHkubW9kZWxfY29uZmlnLm9wZW5pbmdfc3RhdGVtZW50KS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGJvZHkubW9kZWxfY29uZmlnLnN1Z2dlc3RlZF9xdWVzdGlvbnMpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1vZGVsIHdpdGhvdXQgdmlzaW9uIHN1cHBvcnQnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlUHJvdmlkZXJDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0KHtcbiAgICAgICAgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3Q6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgICAgICBsYWJlbDogeyBlbl9VUzogJ09wZW5BSScsIHpoX0hhbnM6ICdPcGVuQUknIH0sXG4gICAgICAgICAgICBpY29uX3NtYWxsOiB7IGVuX1VTOiAnaWNvbicsIHpoX0hhbnM6ICdpY29uJyB9LFxuICAgICAgICAgICAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxuICAgICAgICAgICAgbW9kZWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtb2RlbDogJ2dwdC0zLjUtdHVyYm8nLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnR1BULTMuNScsIHpoX0hhbnM6ICdHUFQtMy41JyB9LFxuICAgICAgICAgICAgICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sXG4gICAgICAgICAgICAgICAgZmVhdHVyZXM6IFtdLCAvLyBObyB2aXNpb24gc3VwcG9ydFxuICAgICAgICAgICAgICAgIGZldGNoX2Zyb206IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLnByZWRlZmluZWRNb2RlbCxcbiAgICAgICAgICAgICAgICBtb2RlbF9wcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgICAgICAgICAgbG9hZF9iYWxhbmNpbmdfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSlcblxuICAgICAgcmVuZGVyKDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbCByZWY9e3JlZiBhcyBSZWZPYmplY3Q8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBtb2RlbCBpbiBwcm92aWRlciBsaXN0JywgKCkgPT4ge1xuICAgICAgbW9ja1VzZVByb3ZpZGVyQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dCh7XG4gICAgICAgIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZXI6ICdkaWZmZXJlbnQtcHJvdmlkZXInLFxuICAgICAgICAgICAgbGFiZWw6IHsgZW5fVVM6ICdEaWZmZXJlbnQgUHJvdmlkZXInLCB6aF9IYW5zOiAn5LiN5ZCM5o+Q5L6b5ZWGJyB9LFxuICAgICAgICAgICAgaWNvbl9zbWFsbDogeyBlbl9VUzogJ2ljb24nLCB6aF9IYW5zOiAnaWNvbicgfSxcbiAgICAgICAgICAgIHN0YXR1czogTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSxcbiAgICAgICAgICAgIG1vZGVsczogW10sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pKVxuXG4gICAgICByZW5kZXIoPERlYnVnV2l0aFNpbmdsZU1vZGVsIHJlZj17cmVmIGFzIFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGU+fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhdC1jb21wb25lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSW5wdXQgRm9ybXMgVGVzdHNcbiAgZGVzY3JpYmUoJ0lucHV0IEZvcm1zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZmlsdGVyIG91dCBhcGkgdHlwZSBwcm9tcHQgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgLi4ubW9ja0RlYnVnQ29uZmlnQ29udGV4dCxcbiAgICAgICAgbW9kZWxDb25maWc6IGNyZWF0ZU1vY2tNb2RlbENvbmZpZyh7XG4gICAgICAgICAgY29uZmlnczoge1xuICAgICAgICAgICAgcHJvbXB0X3RlbXBsYXRlOiAnVGVzdCcsXG4gICAgICAgICAgICBwcm9tcHRfdmFyaWFibGVzOiBbXG4gICAgICAgICAgICAgIHsga2V5OiAndmFyMScsIG5hbWU6ICdWYXIgMScsIHR5cGU6ICd0ZXh0JywgcmVxdWlyZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICAgIHsga2V5OiAndmFyMicsIG5hbWU6ICdWYXIgMicsIHR5cGU6ICdhcGknLCByZXF1aXJlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgeyBrZXk6ICd2YXIzJywgbmFtZTogJ1ZhciAzJywgdHlwZTogJ3NlbGVjdCcsIHJlcXVpcmVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICAvLyBDb21wb25lbnQgc2hvdWxkIHJlbmRlciBzdWNjZXNzZnVsbHkgd2l0aCBmaWx0ZXJlZCB2YXJpYWJsZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJvbXB0IHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIC4uLm1vY2tEZWJ1Z0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIG1vZGVsQ29uZmlnOiBjcmVhdGVNb2NrTW9kZWxDb25maWcoe1xuICAgICAgICAgIGNvbmZpZ3M6IHtcbiAgICAgICAgICAgIHByb21wdF90ZW1wbGF0ZTogJ1Rlc3QnLFxuICAgICAgICAgICAgcHJvbXB0X3ZhcmlhYmxlczogW10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPERlYnVnV2l0aFNpbmdsZU1vZGVsIHJlZj17cmVmIGFzIFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGU+fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhdC1jb21wb25lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVG9vbCBJY29ucyBUZXN0c1xuICBkZXNjcmliZSgnVG9vbCBJY29ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1hcCB0b29sIGljb25zIGZyb20gY29sbGVjdGlvbiBsaXN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbCByZWY9e3JlZiBhcyBSZWZPYmplY3Q8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdG9vbHMgbGlzdCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIC4uLm1vY2tEZWJ1Z0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIG1vZGVsQ29uZmlnOiBjcmVhdGVNb2NrTW9kZWxDb25maWcoe1xuICAgICAgICAgIGFnZW50Q29uZmlnOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG1heF9pdGVyYXRpb246IDUsXG4gICAgICAgICAgICB0b29sczogW10sXG4gICAgICAgICAgICBzdHJhdGVneTogQWdlbnRTdHJhdGVneS5yZWFjdCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaGF0LWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgY29sbGVjdGlvbiBmb3IgdG9vbCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIC4uLm1vY2tEZWJ1Z0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIG1vZGVsQ29uZmlnOiBjcmVhdGVNb2NrTW9kZWxDb25maWcoe1xuICAgICAgICAgIGFnZW50Q29uZmlnOiB7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG1heF9pdGVyYXRpb246IDUsXG4gICAgICAgICAgICB0b29sczogW3tcbiAgICAgICAgICAgICAgdG9vbF9uYW1lOiAndW5rbm93bi10b29sJyxcbiAgICAgICAgICAgICAgcHJvdmlkZXJfaWQ6ICd1bmtub3duLXByb3ZpZGVyJyxcbiAgICAgICAgICAgICAgcHJvdmlkZXJfdHlwZTogQ29sbGVjdGlvblR5cGUuYnVpbHRJbixcbiAgICAgICAgICAgICAgcHJvdmlkZXJfbmFtZTogJ3Vua25vd24tcHJvdmlkZXInLFxuICAgICAgICAgICAgICB0b29sX2xhYmVsOiAnVW5rbm93biBUb29sJyxcbiAgICAgICAgICAgICAgdG9vbF9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgc3RyYXRlZ3k6IEFnZW50U3RyYXRlZ3kucmVhY3QsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIGNvbGxlY3Rpb25MaXN0OiBbXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaGF0LWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIENhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGlucHV0cycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIC4uLm1vY2tEZWJ1Z0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIGlucHV0czoge30gYXMgYW55LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbCByZWY9e3JlZiBhcyBSZWZPYmplY3Q8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyB1c2VyIHByb2ZpbGUnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlQXBwQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAuLi5tb2NrQXBwQ29udGV4dCxcbiAgICAgICAgdXNlclByb2ZpbGU6IHtcbiAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgYXZhdGFyX3VybDogJycsXG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgZW1haWw6ICcnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbCByZWY9e3JlZiBhcyBSZWZPYmplY3Q8RGVidWdXaXRoU2luZ2xlTW9kZWxSZWZUeXBlPn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBjb21wbGV0aW9uIHBhcmFtcycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIC4uLm1vY2tEZWJ1Z0NvbmZpZ0NvbnRleHQsXG4gICAgICAgIGNvbXBsZXRpb25QYXJhbXM6IHt9IGFzIGFueSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaGF0LWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBJbXBlcmF0aXZlIEhhbmRsZSBUZXN0c1xuICBkZXNjcmliZSgnSW1wZXJhdGl2ZSBIYW5kbGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHBvc2UgaGFuZGxlUmVzdGFydCBtZXRob2QgdmlhIHJlZicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBleHBlY3QocmVmLmN1cnJlbnQpLm5vdC50b0JlTnVsbCgpXG4gICAgICBleHBlY3QocmVmLmN1cnJlbnQ/LmhhbmRsZVJlc3RhcnQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVmLmN1cnJlbnQ/LmhhbmRsZVJlc3RhcnQpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVJlc3RhcnQgd2hlbiBpbnZva2VkIHZpYSByZWYnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlYnVnV2l0aFNpbmdsZU1vZGVsIHJlZj17cmVmIGFzIFJlZk9iamVjdDxEZWJ1Z1dpdGhTaW5nbGVNb2RlbFJlZlR5cGU+fSAvPilcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVmLmN1cnJlbnQ/LmhhbmRsZVJlc3RhcnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEZpbGUgVXBsb2FkIFRlc3RzXG4gIGRlc2NyaWJlKCdGaWxlIFVwbG9hZCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIGZpbGVzIHdoZW4gdmlzaW9uIGlzIG5vdCBzdXBwb3J0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAuLi5tb2NrRGVidWdDb25maWdDb250ZXh0LFxuICAgICAgICBtb2RlbENvbmZpZzogY3JlYXRlTW9ja01vZGVsQ29uZmlnKHtcbiAgICAgICAgICBtb2RlbF9pZDogJ2dwdC0zLjUtdHVyYm8nLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tVc2VQcm92aWRlckNvbnRleHQubW9ja1JldHVyblZhbHVlKGNyZWF0ZU1vY2tQcm92aWRlckNvbnRleHQoe1xuICAgICAgICB0ZXh0R2VuZXJhdGlvbk1vZGVsTGlzdDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnT3BlbkFJJywgemhfSGFuczogJ09wZW5BSScgfSxcbiAgICAgICAgICAgIGljb25fc21hbGw6IHsgZW5fVVM6ICdpY29uJywgemhfSGFuczogJ2ljb24nIH0sXG4gICAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgICAgICBtb2RlbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1vZGVsOiAnZ3B0LTMuNS10dXJibycsXG4gICAgICAgICAgICAgICAgbGFiZWw6IHsgZW5fVVM6ICdHUFQtMy41JywgemhfSGFuczogJ0dQVC0zLjUnIH0sXG4gICAgICAgICAgICAgICAgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bS50ZXh0R2VuZXJhdGlvbixcbiAgICAgICAgICAgICAgICBmZWF0dXJlczogW10sIC8vIE5vIHZpc2lvblxuICAgICAgICAgICAgICAgIGZldGNoX2Zyb206IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLnByZWRlZmluZWRNb2RlbCxcbiAgICAgICAgICAgICAgICBtb2RlbF9wcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgICAgICAgICAgbG9hZF9iYWxhbmNpbmdfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSlcblxuICAgICAgbW9ja0ZlYXR1cmVzU3RhdGUgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRGZWF0dXJlcyxcbiAgICAgICAgZmlsZTogeyBlbmFibGVkOiB0cnVlIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZW5kLXdpdGgtZmlsZXMnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBib2R5ID0gbW9ja1NzZVBvc3QubW9jay5jYWxsc1swXVsxXS5ib2R5XG4gICAgICBleHBlY3QoYm9keS5maWxlcykudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGZpbGVzIHdoZW4gdmlzaW9uIGlzIGVuYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAuLi5tb2NrRGVidWdDb25maWdDb250ZXh0LFxuICAgICAgICBtb2RlbENvbmZpZzogY3JlYXRlTW9ja01vZGVsQ29uZmlnKHtcbiAgICAgICAgICBtb2RlbF9pZDogJ2dwdC00LXZpc2lvbicsXG4gICAgICAgIH0pLFxuICAgICAgfSlcblxuICAgICAgbW9ja1VzZVByb3ZpZGVyQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dCh7XG4gICAgICAgIHRleHRHZW5lcmF0aW9uTW9kZWxMaXN0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgICAgbGFiZWw6IHsgZW5fVVM6ICdPcGVuQUknLCB6aF9IYW5zOiAnT3BlbkFJJyB9LFxuICAgICAgICAgICAgaWNvbl9zbWFsbDogeyBlbl9VUzogJ2ljb24nLCB6aF9IYW5zOiAnaWNvbicgfSxcbiAgICAgICAgICAgIHN0YXR1czogTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSxcbiAgICAgICAgICAgIG1vZGVsczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kZWw6ICdncHQtNC12aXNpb24nLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnR1BULTQgVmlzaW9uJywgemhfSGFuczogJ0dQVC00IFZpc2lvbicgfSxcbiAgICAgICAgICAgICAgICBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLFxuICAgICAgICAgICAgICAgIGZlYXR1cmVzOiBbTW9kZWxGZWF0dXJlRW51bS52aXNpb25dLFxuICAgICAgICAgICAgICAgIGZldGNoX2Zyb206IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLnByZWRlZmluZWRNb2RlbCxcbiAgICAgICAgICAgICAgICBtb2RlbF9wcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgICBkZXByZWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgICAgICAgICAgbG9hZF9iYWxhbmNpbmdfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSlcblxuICAgICAgbW9ja0ZlYXR1cmVzU3RhdGUgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRGZWF0dXJlcyxcbiAgICAgICAgZmlsZTogeyBlbmFibGVkOiB0cnVlIH0sXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8RGVidWdXaXRoU2luZ2xlTW9kZWwgcmVmPXtyZWYgYXMgUmVmT2JqZWN0PERlYnVnV2l0aFNpbmdsZU1vZGVsUmVmVHlwZT59IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZW5kLXdpdGgtZmlsZXMnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBib2R5ID0gbW9ja1NzZVBvc3QubW9jay5jYWxsc1swXVsxXS5ib2R5XG4gICAgICBleHBlY3QoYm9keS5maWxlcykudG9IYXZlTGVuZ3RoKDEpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=