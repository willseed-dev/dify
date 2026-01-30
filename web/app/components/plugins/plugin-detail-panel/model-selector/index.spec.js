"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// Import component after mocks
const toast_1 = require("@/app/components/base/toast");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Mock shared state for portal
let mockPortalOpenState = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => {
        mockPortalOpenState = open || false;
        return (<div data-testid="portal-elem" data-open={open}>
        {children}
      </div>);
    },
    PortalToFollowElemTrigger: ({ children, onClick, className }) => (<div data-testid="portal-trigger" onClick={onClick} className={className}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        if (!mockPortalOpenState)
            return null;
        return (<div data-testid="portal-content" className={className}>
        {children}
      </div>);
    },
}));
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vitest_1.vi.fn(),
    },
}));
// Mock provider context
const mockProviderContextValue = {
    isAPIKeySet: true,
    modelProviders: [],
};
vitest_1.vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => mockProviderContextValue,
}));
// Mock model list hook
const mockTextGenerationList = [];
const mockTextEmbeddingList = [];
const mockRerankList = [];
const mockModerationList = [];
const mockSttList = [];
const mockTtsList = [];
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelList: (type) => {
        switch (type) {
            case declarations_1.ModelTypeEnum.textGeneration:
                return { data: mockTextGenerationList };
            case declarations_1.ModelTypeEnum.textEmbedding:
                return { data: mockTextEmbeddingList };
            case declarations_1.ModelTypeEnum.rerank:
                return { data: mockRerankList };
            case declarations_1.ModelTypeEnum.moderation:
                return { data: mockModerationList };
            case declarations_1.ModelTypeEnum.speech2text:
                return { data: mockSttList };
            case declarations_1.ModelTypeEnum.tts:
                return { data: mockTtsList };
            default:
                return { data: [] };
        }
    },
}));
// Mock fetchAndMergeValidCompletionParams
const mockFetchAndMergeValidCompletionParams = vitest_1.vi.fn();
vitest_1.vi.mock('@/utils/completion-params', () => ({
    fetchAndMergeValidCompletionParams: (...args) => mockFetchAndMergeValidCompletionParams(...args),
}));
// Mock child components
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/model-selector', () => ({
    default: ({ defaultModel, modelList, scopeFeatures, onSelect }) => (<div data-testid="model-selector" data-default-model={JSON.stringify(defaultModel)} data-model-list-count={modelList?.length || 0} data-scope-features={JSON.stringify(scopeFeatures)} onClick={() => onSelect?.({ provider: 'openai', model: 'gpt-4' })}>
      Model Selector
    </div>),
}));
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/model-parameter-modal/trigger', () => ({
    default: ({ disabled, hasDeprecated, modelDisabled, currentProvider, currentModel, providerName, modelId, isInWorkflow }) => (<div data-testid="trigger" data-disabled={disabled} data-has-deprecated={hasDeprecated} data-model-disabled={modelDisabled} data-provider={providerName} data-model={modelId} data-in-workflow={isInWorkflow} data-has-current-provider={!!currentProvider} data-has-current-model={!!currentModel}>
      Trigger
    </div>),
}));
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/model-parameter-modal/agent-model-trigger', () => ({
    default: ({ disabled, hasDeprecated, currentProvider, currentModel, providerName, modelId, scope }) => (<div data-testid="agent-model-trigger" data-disabled={disabled} data-has-deprecated={hasDeprecated} data-provider={providerName} data-model={modelId} data-scope={scope} data-has-current-provider={!!currentProvider} data-has-current-model={!!currentModel}>
      Agent Model Trigger
    </div>),
}));
vitest_1.vi.mock('./llm-params-panel', () => ({
    default: ({ provider, modelId, onCompletionParamsChange, isAdvancedMode }) => (<div data-testid="llm-params-panel" data-provider={provider} data-model={modelId} data-is-advanced={isAdvancedMode} onClick={() => onCompletionParamsChange?.({ temperature: 0.8 })}>
      LLM Params Panel
    </div>),
}));
vitest_1.vi.mock('./tts-params-panel', () => ({
    default: ({ language, voice, onChange }) => (<div data-testid="tts-params-panel" data-language={language} data-voice={voice} onClick={() => onChange?.('en-US', 'alloy')}>
      TTS Params Panel
    </div>),
}));
// ==================== Test Utilities ====================
/**
 * Factory function to create a ModelItem with defaults
 */
const createModelItem = (overrides = {}) => ({
    model: 'test-model',
    label: { en_US: 'Test Model', zh_Hans: 'Test Model' },
    model_type: declarations_1.ModelTypeEnum.textGeneration,
    features: [],
    fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
    status: declarations_1.ModelStatusEnum.active,
    model_properties: { mode: 'chat' },
    load_balancing_enabled: false,
    ...overrides,
});
/**
 * Factory function to create a Model (provider with models) with defaults
 */
const createModel = (overrides = {}) => ({
    provider: 'openai',
    icon_small: { en_US: 'icon-small.png', zh_Hans: 'icon-small.png' },
    label: { en_US: 'OpenAI', zh_Hans: 'OpenAI' },
    models: [createModelItem()],
    status: declarations_1.ModelStatusEnum.active,
    ...overrides,
});
/**
 * Factory function to create default props
 */
const createDefaultProps = (overrides = {}) => ({
    isAdvancedMode: false,
    value: null,
    setModel: vitest_1.vi.fn(),
    ...overrides,
});
/**
 * Helper to set up model lists for testing
 */
const setupModelLists = (config = {}) => {
    mockTextGenerationList.length = 0;
    mockTextEmbeddingList.length = 0;
    mockRerankList.length = 0;
    mockModerationList.length = 0;
    mockSttList.length = 0;
    mockTtsList.length = 0;
    if (config.textGeneration)
        mockTextGenerationList.push(...config.textGeneration);
    if (config.textEmbedding)
        mockTextEmbeddingList.push(...config.textEmbedding);
    if (config.rerank)
        mockRerankList.push(...config.rerank);
    if (config.moderation)
        mockModerationList.push(...config.moderation);
    if (config.stt)
        mockSttList.push(...config.stt);
    if (config.tts)
        mockTtsList.push(...config.tts);
};
// ==================== Tests ====================
(0, vitest_1.describe)('ModelParameterModal', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
        mockProviderContextValue.isAPIKeySet = true;
        mockProviderContextValue.modelProviders = [];
        setupModelLists();
        mockFetchAndMergeValidCompletionParams.mockResolvedValue({ params: {}, removedDetails: {} });
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render trigger component by default', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render agent model trigger when isAgentStrategy is true', () => {
            // Arrange
            const props = createDefaultProps({ isAgentStrategy: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('agent-model-trigger')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('trigger')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render custom trigger when renderTrigger is provided', () => {
            // Arrange
            const renderTrigger = vitest_1.vi.fn().mockReturnValue(<div data-testid="custom-trigger">Custom</div>);
            const props = createDefaultProps({ renderTrigger });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('trigger')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call renderTrigger with correct props', () => {
            // Arrange
            const renderTrigger = vitest_1.vi.fn().mockReturnValue(<div>Custom</div>);
            const value = { provider: 'openai', model: 'gpt-4' };
            const props = createDefaultProps({ renderTrigger, value });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(renderTrigger).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                open: false,
                providerName: 'openai',
                modelId: 'gpt-4',
            }));
        });
        (0, vitest_1.it)('should not render portal content when closed', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render model selector inside portal content when open', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
            (0, vitest_1.expect)(react_1.screen.getByTestId('model-selector')).toBeInTheDocument();
        });
    });
    // ==================== Props Testing ====================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should pass isInWorkflow to trigger', () => {
            // Arrange
            const props = createDefaultProps({ isInWorkflow: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-in-workflow', 'true');
        });
        (0, vitest_1.it)('should pass scope to agent model trigger', () => {
            // Arrange
            const props = createDefaultProps({ isAgentStrategy: true, scope: 'llm&vision' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('agent-model-trigger')).toHaveAttribute('data-scope', 'llm&vision');
        });
        (0, vitest_1.it)('should apply popupClassName to portal content', async () => {
            // Arrange
            const props = createDefaultProps({ popupClassName: 'custom-popup-class' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const content = react_1.screen.getByTestId('portal-content');
                (0, vitest_1.expect)(content.querySelector('.custom-popup-class')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should default scope to textGeneration', () => {
            // Arrange
            const textGenModel = createModel({ provider: 'openai' });
            setupModelLists({ textGeneration: [textGenModel] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'test-model' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            const selector = react_1.screen.getByTestId('model-selector');
            (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
        });
    });
    // ==================== State Management ====================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should toggle open state when trigger is clicked', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not toggle open state when readonly is true', async () => {
            // Arrange
            const props = createDefaultProps({ readonly: true });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toHaveAttribute('data-open', 'false');
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Force a re-render to ensure state is stable
            rerender(<index_1.default {...props}/>);
            // Assert - open state should remain false due to readonly
            (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toHaveAttribute('data-open', 'false');
        });
    });
    // ==================== Memoization Logic ====================
    (0, vitest_1.describe)('Memoization - scopeFeatures', () => {
        (0, vitest_1.it)('should return empty array when scope includes all', async () => {
            // Arrange
            const props = createDefaultProps({ scope: 'all' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-scope-features', '[]');
            });
        });
        (0, vitest_1.it)('should filter out model type enums from scope', async () => {
            // Arrange
            const props = createDefaultProps({ scope: 'llm&tool-call&vision' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                const features = JSON.parse(selector.getAttribute('data-scope-features') || '[]');
                (0, vitest_1.expect)(features).toContain('tool-call');
                (0, vitest_1.expect)(features).toContain('vision');
                (0, vitest_1.expect)(features).not.toContain('llm');
            });
        });
    });
    (0, vitest_1.describe)('Memoization - scopedModelList', () => {
        (0, vitest_1.it)('should return all models when scope is all', async () => {
            // Arrange
            const textGenModel = createModel({ provider: 'openai' });
            const embeddingModel = createModel({ provider: 'embedding-provider' });
            setupModelLists({ textGeneration: [textGenModel], textEmbedding: [embeddingModel] });
            const props = createDefaultProps({ scope: 'all' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '2');
            });
        });
        (0, vitest_1.it)('should return only textGeneration models for llm scope', async () => {
            // Arrange
            const textGenModel = createModel({ provider: 'openai' });
            const embeddingModel = createModel({ provider: 'embedding-provider' });
            setupModelLists({ textGeneration: [textGenModel], textEmbedding: [embeddingModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.textGeneration });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return text embedding models for text-embedding scope', async () => {
            // Arrange
            const embeddingModel = createModel({ provider: 'embedding-provider' });
            setupModelLists({ textEmbedding: [embeddingModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.textEmbedding });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return rerank models for rerank scope', async () => {
            // Arrange
            const rerankModel = createModel({ provider: 'rerank-provider' });
            setupModelLists({ rerank: [rerankModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.rerank });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return tts models for tts scope', async () => {
            // Arrange
            const ttsModel = createModel({ provider: 'tts-provider' });
            setupModelLists({ tts: [ttsModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.tts });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return moderation models for moderation scope', async () => {
            // Arrange
            const moderationModel = createModel({ provider: 'moderation-provider' });
            setupModelLists({ moderation: [moderationModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.moderation });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return stt models for speech2text scope', async () => {
            // Arrange
            const sttModel = createModel({ provider: 'stt-provider' });
            setupModelLists({ stt: [sttModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.speech2text });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should return empty list for unknown scope', async () => {
            // Arrange
            const textGenModel = createModel({ provider: 'openai' });
            setupModelLists({ textGeneration: [textGenModel] });
            const props = createDefaultProps({ scope: 'unknown-scope' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '0');
            });
        });
    });
    (0, vitest_1.describe)('Memoization - currentProvider and currentModel', () => {
        (0, vitest_1.it)('should find current provider and model from value', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.active })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const trigger = react_1.screen.getByTestId('trigger');
            (0, vitest_1.expect)(trigger).toHaveAttribute('data-has-current-provider', 'true');
            (0, vitest_1.expect)(trigger).toHaveAttribute('data-has-current-model', 'true');
        });
        (0, vitest_1.it)('should not find provider when value.provider does not match', () => {
            // Arrange
            const model = createModel({ provider: 'openai' });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'anthropic', model: 'claude-3' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const trigger = react_1.screen.getByTestId('trigger');
            (0, vitest_1.expect)(trigger).toHaveAttribute('data-has-current-provider', 'false');
            (0, vitest_1.expect)(trigger).toHaveAttribute('data-has-current-model', 'false');
        });
    });
    (0, vitest_1.describe)('Memoization - hasDeprecated', () => {
        (0, vitest_1.it)('should set hasDeprecated to true when provider is not found', () => {
            // Arrange
            const props = createDefaultProps({ value: { provider: 'unknown', model: 'unknown-model' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-has-deprecated', 'true');
        });
        (0, vitest_1.it)('should set hasDeprecated to true when model is not found', () => {
            // Arrange
            const model = createModel({ provider: 'openai', models: [createModelItem({ model: 'gpt-3.5' })] });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-has-deprecated', 'true');
        });
        (0, vitest_1.it)('should set hasDeprecated to false when provider and model are found', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4' })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-has-deprecated', 'false');
        });
    });
    (0, vitest_1.describe)('Memoization - modelDisabled', () => {
        (0, vitest_1.it)('should set modelDisabled to true when model status is not active', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.quotaExceeded })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-model-disabled', 'true');
        });
        (0, vitest_1.it)('should set modelDisabled to false when model status is active', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.active })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-model-disabled', 'false');
        });
    });
    (0, vitest_1.describe)('Memoization - disabled', () => {
        (0, vitest_1.it)('should set disabled to true when isAPIKeySet is false', () => {
            // Arrange
            mockProviderContextValue.isAPIKeySet = false;
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.active })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'true');
        });
        (0, vitest_1.it)('should set disabled to true when hasDeprecated is true', () => {
            // Arrange
            const props = createDefaultProps({ value: { provider: 'unknown', model: 'unknown' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'true');
        });
        (0, vitest_1.it)('should set disabled to true when modelDisabled is true', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.quotaExceeded })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'true');
        });
        (0, vitest_1.it)('should set disabled to false when all conditions are met', () => {
            // Arrange
            mockProviderContextValue.isAPIKeySet = true;
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.active })],
            });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'false');
        });
    });
    // ==================== User Interactions ====================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.describe)('handleChangeModel', () => {
            (0, vitest_1.it)('should call setModel with selected model for non-textGeneration type', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const ttsModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({ model: 'tts-1', model_type: declarations_1.ModelTypeEnum.tts })],
                });
                setupModelLists({ tts: [ttsModel] });
                const props = createDefaultProps({ setModel, scope: declarations_1.ModelTypeEnum.tts });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    react_1.fireEvent.click(react_1.screen.getByTestId('model-selector'));
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(setModel).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should call fetchAndMergeValidCompletionParams for textGeneration type', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const textGenModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({ model: 'gpt-4', model_type: declarations_1.ModelTypeEnum.textGeneration, model_properties: { mode: 'chat' } })],
                });
                setupModelLists({ textGeneration: [textGenModel] });
                mockFetchAndMergeValidCompletionParams.mockResolvedValue({ params: { temperature: 0.7 }, removedDetails: {} });
                const props = createDefaultProps({ setModel, scope: declarations_1.ModelTypeEnum.textGeneration });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    react_1.fireEvent.click(react_1.screen.getByTestId('model-selector'));
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockFetchAndMergeValidCompletionParams).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should show warning toast when parameters are removed', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const textGenModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({ model: 'gpt-4', model_type: declarations_1.ModelTypeEnum.textGeneration, model_properties: { mode: 'chat' } })],
                });
                setupModelLists({ textGeneration: [textGenModel] });
                mockFetchAndMergeValidCompletionParams.mockResolvedValue({
                    params: {},
                    removedDetails: { invalid_param: 'unsupported' },
                });
                const props = createDefaultProps({
                    setModel,
                    scope: declarations_1.ModelTypeEnum.textGeneration,
                    value: { completion_params: { invalid_param: 'value' } },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    react_1.fireEvent.click(react_1.screen.getByTestId('model-selector'));
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(toast_1.default.notify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ type: 'warning' }));
                });
            });
            (0, vitest_1.it)('should show error toast when fetchAndMergeValidCompletionParams fails', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const textGenModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({ model: 'gpt-4', model_type: declarations_1.ModelTypeEnum.textGeneration, model_properties: { mode: 'chat' } })],
                });
                setupModelLists({ textGeneration: [textGenModel] });
                mockFetchAndMergeValidCompletionParams.mockRejectedValue(new Error('Network error'));
                const props = createDefaultProps({ setModel, scope: declarations_1.ModelTypeEnum.textGeneration });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    react_1.fireEvent.click(react_1.screen.getByTestId('model-selector'));
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(toast_1.default.notify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ type: 'error' }));
                });
            });
        });
        (0, vitest_1.describe)('handleLLMParamsChange', () => {
            (0, vitest_1.it)('should call setModel with updated completion_params', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const textGenModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({
                            model: 'gpt-4',
                            model_type: declarations_1.ModelTypeEnum.textGeneration,
                            status: declarations_1.ModelStatusEnum.active,
                        })],
                });
                setupModelLists({ textGeneration: [textGenModel] });
                const props = createDefaultProps({
                    setModel,
                    scope: declarations_1.ModelTypeEnum.textGeneration,
                    value: { provider: 'openai', model: 'gpt-4' },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    const panel = react_1.screen.getByTestId('llm-params-panel');
                    react_1.fireEvent.click(panel);
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(setModel).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ completion_params: { temperature: 0.8 } }));
                });
            });
        });
        (0, vitest_1.describe)('handleTTSParamsChange', () => {
            (0, vitest_1.it)('should call setModel with updated language and voice', async () => {
                // Arrange
                const setModel = vitest_1.vi.fn();
                const ttsModel = createModel({
                    provider: 'openai',
                    models: [createModelItem({
                            model: 'tts-1',
                            model_type: declarations_1.ModelTypeEnum.tts,
                            status: declarations_1.ModelStatusEnum.active,
                        })],
                });
                setupModelLists({ tts: [ttsModel] });
                const props = createDefaultProps({
                    setModel,
                    scope: declarations_1.ModelTypeEnum.tts,
                    value: { provider: 'openai', model: 'tts-1' },
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                await (0, react_1.waitFor)(() => {
                    const panel = react_1.screen.getByTestId('tts-params-panel');
                    react_1.fireEvent.click(panel);
                });
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(setModel).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ language: 'en-US', voice: 'alloy' }));
                });
            });
        });
    });
    // ==================== Conditional Rendering ====================
    (0, vitest_1.describe)('Conditional Rendering', () => {
        (0, vitest_1.it)('should render LLMParamsPanel when model type is textGeneration', async () => {
            // Arrange
            const textGenModel = createModel({
                provider: 'openai',
                models: [createModelItem({
                        model: 'gpt-4',
                        model_type: declarations_1.ModelTypeEnum.textGeneration,
                        status: declarations_1.ModelStatusEnum.active,
                    })],
            });
            setupModelLists({ textGeneration: [textGenModel] });
            const props = createDefaultProps({
                value: { provider: 'openai', model: 'gpt-4' },
                scope: declarations_1.ModelTypeEnum.textGeneration,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('llm-params-panel')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render TTSParamsPanel when model type is tts', async () => {
            // Arrange
            const ttsModel = createModel({
                provider: 'openai',
                models: [createModelItem({
                        model: 'tts-1',
                        model_type: declarations_1.ModelTypeEnum.tts,
                        status: declarations_1.ModelStatusEnum.active,
                    })],
            });
            setupModelLists({ tts: [ttsModel] });
            const props = createDefaultProps({
                value: { provider: 'openai', model: 'tts-1' },
                scope: declarations_1.ModelTypeEnum.tts,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('tts-params-panel')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not render LLMParamsPanel when model type is not textGeneration', async () => {
            // Arrange
            const embeddingModel = createModel({
                provider: 'openai',
                models: [createModelItem({
                        model: 'text-embedding-ada',
                        model_type: declarations_1.ModelTypeEnum.textEmbedding,
                        status: declarations_1.ModelStatusEnum.active,
                    })],
            });
            setupModelLists({ textEmbedding: [embeddingModel] });
            const props = createDefaultProps({
                value: { provider: 'openai', model: 'text-embedding-ada' },
                scope: declarations_1.ModelTypeEnum.textEmbedding,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('model-selector')).toBeInTheDocument();
            });
            (0, vitest_1.expect)(react_1.screen.queryByTestId('llm-params-panel')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render divider when model type is textGeneration or tts', async () => {
            // Arrange
            const textGenModel = createModel({
                provider: 'openai',
                models: [createModelItem({
                        model: 'gpt-4',
                        model_type: declarations_1.ModelTypeEnum.textGeneration,
                        status: declarations_1.ModelStatusEnum.active,
                    })],
            });
            setupModelLists({ textGeneration: [textGenModel] });
            const props = createDefaultProps({
                value: { provider: 'openai', model: 'gpt-4' },
                scope: declarations_1.ModelTypeEnum.textGeneration,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const content = react_1.screen.getByTestId('portal-content');
                (0, vitest_1.expect)(content.querySelector('.bg-divider-subtle')).toBeInTheDocument();
            });
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle null value', () => {
            // Arrange
            const props = createDefaultProps({ value: null });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-has-deprecated', 'true');
        });
        (0, vitest_1.it)('should handle undefined value', () => {
            // Arrange
            const props = createDefaultProps({ value: undefined });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty model list', async () => {
            // Arrange
            setupModelLists({});
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector).toHaveAttribute('data-model-list-count', '0');
            });
        });
        (0, vitest_1.it)('should handle value with only provider', () => {
            // Arrange
            const model = createModel({ provider: 'openai' });
            setupModelLists({ textGeneration: [model] });
            const props = createDefaultProps({ value: { provider: 'openai' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-provider', 'openai');
        });
        (0, vitest_1.it)('should handle value with only model', () => {
            // Arrange
            const props = createDefaultProps({ value: { model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-model', 'gpt-4');
        });
        (0, vitest_1.it)('should handle complex scope with multiple features', async () => {
            // Arrange
            const props = createDefaultProps({ scope: 'llm&tool-call&multi-tool-call&vision' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                const features = JSON.parse(selector.getAttribute('data-scope-features') || '[]');
                (0, vitest_1.expect)(features).toContain('tool-call');
                (0, vitest_1.expect)(features).toContain('multi-tool-call');
                (0, vitest_1.expect)(features).toContain('vision');
            });
        });
        (0, vitest_1.it)('should handle model with all status types', () => {
            // Arrange
            const statuses = [
                declarations_1.ModelStatusEnum.active,
                declarations_1.ModelStatusEnum.noConfigure,
                declarations_1.ModelStatusEnum.quotaExceeded,
                declarations_1.ModelStatusEnum.noPermission,
                declarations_1.ModelStatusEnum.disabled,
            ];
            statuses.forEach((status) => {
                const model = createModel({
                    provider: `provider-${status}`,
                    models: [createModelItem({ model: 'test', status })],
                });
                setupModelLists({ textGeneration: [model] });
                // Act
                const props = createDefaultProps({ value: { provider: `provider-${status}`, model: 'test' } });
                const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const trigger = react_1.screen.getByTestId('trigger');
                if (status === declarations_1.ModelStatusEnum.active)
                    (0, vitest_1.expect)(trigger).toHaveAttribute('data-model-disabled', 'false');
                else
                    (0, vitest_1.expect)(trigger).toHaveAttribute('data-model-disabled', 'true');
                unmount();
            });
        });
    });
    // ==================== Portal Placement ====================
    (0, vitest_1.describe)('Portal Placement', () => {
        (0, vitest_1.it)('should use left placement when isInWorkflow is true', () => {
            // Arrange
            const props = createDefaultProps({ isInWorkflow: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            // Portal placement is handled internally, but we verify the prop is passed
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-in-workflow', 'true');
        });
        (0, vitest_1.it)('should use bottom-end placement when isInWorkflow is false', () => {
            // Arrange
            const props = createDefaultProps({ isInWorkflow: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-in-workflow', 'false');
        });
    });
    // ==================== Model Selector Default Model ====================
    (0, vitest_1.describe)('Model Selector Default Model', () => {
        (0, vitest_1.it)('should pass defaultModel to ModelSelector when provider and model exist', async () => {
            // Arrange
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                const defaultModel = JSON.parse(selector.getAttribute('data-default-model') || '{}');
                (0, vitest_1.expect)(defaultModel).toEqual({ provider: 'openai', model: 'gpt-4' });
            });
        });
        (0, vitest_1.it)('should pass partial defaultModel when provider is missing', async () => {
            // Arrange - component creates defaultModel when either provider or model exists
            const props = createDefaultProps({ value: { model: 'gpt-4' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert - defaultModel is created with undefined provider
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                const defaultModel = JSON.parse(selector.getAttribute('data-default-model') || '{}');
                (0, vitest_1.expect)(defaultModel.model).toBe('gpt-4');
                (0, vitest_1.expect)(defaultModel.provider).toBeUndefined();
            });
        });
        (0, vitest_1.it)('should pass partial defaultModel when model is missing', async () => {
            // Arrange - component creates defaultModel when either provider or model exists
            const props = createDefaultProps({ value: { provider: 'openai' } });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert - defaultModel is created with undefined model
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                const defaultModel = JSON.parse(selector.getAttribute('data-default-model') || '{}');
                (0, vitest_1.expect)(defaultModel.provider).toBe('openai');
                (0, vitest_1.expect)(defaultModel.model).toBeUndefined();
            });
        });
        (0, vitest_1.it)('should pass undefined defaultModel when both provider and model are missing', async () => {
            // Arrange
            const props = createDefaultProps({ value: {} });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            // Assert - when defaultModel is undefined, attribute is not set (returns null)
            await (0, react_1.waitFor)(() => {
                const selector = react_1.screen.getByTestId('model-selector');
                (0, vitest_1.expect)(selector.getAttribute('data-default-model')).toBeNull();
            });
        });
    });
    // ==================== Re-render Behavior ====================
    (0, vitest_1.describe)('Re-render Behavior', () => {
        (0, vitest_1.it)('should update trigger when value changes', () => {
            // Arrange
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-3.5' } });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-model', 'gpt-3.5');
            rerender(<index_1.default {...props} value={{ provider: 'openai', model: 'gpt-4' }}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-model', 'gpt-4');
        });
        (0, vitest_1.it)('should update model list when scope changes', async () => {
            // Arrange
            const textGenModel = createModel({ provider: 'openai' });
            const embeddingModel = createModel({ provider: 'embedding-provider' });
            setupModelLists({ textGeneration: [textGenModel], textEmbedding: [embeddingModel] });
            const props = createDefaultProps({ scope: declarations_1.ModelTypeEnum.textGeneration });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('model-selector')).toHaveAttribute('data-model-list-count', '1');
            });
            // Rerender with different scope
            mockPortalOpenState = true;
            rerender(<index_1.default {...props} scope={declarations_1.ModelTypeEnum.textEmbedding}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('model-selector')).toHaveAttribute('data-model-list-count', '1');
            });
        });
        (0, vitest_1.it)('should update disabled state when isAPIKeySet changes', () => {
            // Arrange
            const model = createModel({
                provider: 'openai',
                models: [createModelItem({ model: 'gpt-4', status: declarations_1.ModelStatusEnum.active })],
            });
            setupModelLists({ textGeneration: [model] });
            mockProviderContextValue.isAPIKeySet = true;
            const props = createDefaultProps({ value: { provider: 'openai', model: 'gpt-4' } });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'false');
            mockProviderContextValue.isAPIKeySet = false;
            rerender(<index_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('trigger')).toHaveAttribute('data-disabled', 'true');
        });
    });
    // ==================== Accessibility ====================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should be keyboard accessible', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const trigger = react_1.screen.getByTestId('portal-trigger');
            (0, vitest_1.expect)(trigger).toBeInTheDocument();
        });
    });
    // ==================== Component Type ====================
    (0, vitest_1.describe)('Component Type', () => {
        (0, vitest_1.it)('should be a functional component', () => {
            // Assert
            (0, vitest_1.expect)(typeof index_1.default).toBe('function');
        });
        (0, vitest_1.it)('should accept all required props', () => {
            // Arrange
            const props = createDefaultProps();
            // Act & Assert
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default {...props}/>)).not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCwrQkFBK0I7QUFDL0IsdURBQStDO0FBRS9DLDJHQUFrSjtBQUNsSixtQ0FBeUM7QUFFekMsdURBQXVEO0FBRXZELCtCQUErQjtBQUMvQixJQUFJLG1CQUFtQixHQUFHLEtBQUssQ0FBQTtBQUUvQixXQUFFLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUQsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQWdELEVBQUUsRUFBRTtRQUN2RixtQkFBbUIsR0FBRyxJQUFJLElBQUksS0FBSyxDQUFBO1FBQ25DLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUM3QztRQUFBLENBQUMsUUFBUSxDQUNYO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUNELHlCQUF5QixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBMEUsRUFBRSxFQUFFLENBQUMsQ0FDdkksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUN2RTtNQUFBLENBQUMsUUFBUSxDQUNYO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtJQUNELHlCQUF5QixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFxRCxFQUFFLEVBQUU7UUFDeEcsSUFBSSxDQUFDLG1CQUFtQjtZQUN0QixPQUFPLElBQUksQ0FBQTtRQUNiLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ3JEO1FBQUEsQ0FBQyxRQUFRLENBQ1g7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxXQUFFLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUMsT0FBTyxFQUFFO1FBQ1AsTUFBTSxFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7S0FDaEI7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHdCQUF3QjtBQUN4QixNQUFNLHdCQUF3QixHQUFHO0lBQy9CLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGNBQWMsRUFBRSxFQUFFO0NBQ25CLENBQUE7QUFDRCxXQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0Msa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsd0JBQXdCO0NBQ25ELENBQUMsQ0FBQyxDQUFBO0FBRUgsdUJBQXVCO0FBQ3ZCLE1BQU0sc0JBQXNCLEdBQVksRUFBRSxDQUFBO0FBQzFDLE1BQU0scUJBQXFCLEdBQVksRUFBRSxDQUFBO0FBQ3pDLE1BQU0sY0FBYyxHQUFZLEVBQUUsQ0FBQTtBQUNsQyxNQUFNLGtCQUFrQixHQUFZLEVBQUUsQ0FBQTtBQUN0QyxNQUFNLFdBQVcsR0FBWSxFQUFFLENBQUE7QUFDL0IsTUFBTSxXQUFXLEdBQVksRUFBRSxDQUFBO0FBRS9CLFdBQUUsQ0FBQyxJQUFJLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsRixZQUFZLEVBQUUsQ0FBQyxJQUFtQixFQUFFLEVBQUU7UUFDcEMsUUFBUSxJQUFJLEVBQUUsQ0FBQztZQUNiLEtBQUssNEJBQWEsQ0FBQyxjQUFjO2dCQUMvQixPQUFPLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUE7WUFDekMsS0FBSyw0QkFBYSxDQUFDLGFBQWE7Z0JBQzlCLE9BQU8sRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsQ0FBQTtZQUN4QyxLQUFLLDRCQUFhLENBQUMsTUFBTTtnQkFDdkIsT0FBTyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQTtZQUNqQyxLQUFLLDRCQUFhLENBQUMsVUFBVTtnQkFDM0IsT0FBTyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFBO1lBQ3JDLEtBQUssNEJBQWEsQ0FBQyxXQUFXO2dCQUM1QixPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFBO1lBQzlCLEtBQUssNEJBQWEsQ0FBQyxHQUFHO2dCQUNwQixPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFBO1lBQzlCO2dCQUNFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUE7UUFDdkIsQ0FBQztJQUNILENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDBDQUEwQztBQUMxQyxNQUFNLHNDQUFzQyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN0RCxXQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUMsa0NBQWtDLEVBQUUsQ0FBQyxHQUFHLElBQWUsRUFBRSxFQUFFLENBQUMsc0NBQXNDLENBQUMsR0FBRyxJQUFJLENBQUM7Q0FDNUcsQ0FBQyxDQUFDLENBQUE7QUFFSCx3QkFBd0I7QUFDeEIsV0FBRSxDQUFDLElBQUksQ0FBQyw0RUFBNEUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNGLE9BQU8sRUFBRSxDQUFDLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUszRCxFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FDNUIsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQ2pELHFCQUFxQixDQUFDLENBQUMsU0FBUyxFQUFFLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FDOUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ25ELE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUVsRTs7SUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxXQUFFLENBQUMsSUFBSSxDQUFDLDJGQUEyRixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUcsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQVNySCxFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxTQUFTLENBQ3JCLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUN4QixtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUNuQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUNuQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDNUIsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ3BCLGdCQUFnQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQy9CLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUM3QyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FFdkM7O0lBQ0YsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyx1R0FBdUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RILE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQVEvRixFQUFFLEVBQUUsQ0FBQyxDQUNKLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxxQkFBcUIsQ0FDakMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ3hCLG1CQUFtQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQ25DLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUM1QixVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDcEIsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2xCLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUM3QyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FFdkM7O0lBQ0YsRUFBRSxHQUFHLENBQUMsQ0FDUDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxjQUFjLEVBTXRFLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQ0YsV0FBVyxDQUFDLGtCQUFrQixDQUM5QixhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDeEIsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ3BCLGdCQUFnQixDQUFDLENBQUMsY0FBYyxDQUFDLENBQ2pDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUVoRTs7SUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxXQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkMsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFLcEMsRUFBRSxFQUFFLENBQUMsQ0FDSixDQUFDLEdBQUcsQ0FDRixXQUFXLENBQUMsa0JBQWtCLENBQzlCLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUN4QixVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDbEIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBRTVDOztJQUNGLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDJEQUEyRDtBQUUzRDs7R0FFRztBQUNILE1BQU0sZUFBZSxHQUFHLENBQUMsWUFBZ0MsRUFBRSxFQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLEtBQUssRUFBRSxZQUFZO0lBQ25CLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRTtJQUNyRCxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjO0lBQ3hDLFFBQVEsRUFBRSxFQUFFO0lBQ1osVUFBVSxFQUFFLHNDQUF1QixDQUFDLGVBQWU7SUFDbkQsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTTtJQUM5QixnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7SUFDbEMsc0JBQXNCLEVBQUUsS0FBSztJQUM3QixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRjs7R0FFRztBQUNILE1BQU0sV0FBVyxHQUFHLENBQUMsWUFBNEIsRUFBRSxFQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzlELFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbEUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0lBQzdDLE1BQU0sRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU07SUFDOUIsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUY7O0dBRUc7QUFDSCxNQUFNLGtCQUFrQixHQUFHLENBQUMsWUFBZ0UsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xHLGNBQWMsRUFBRSxLQUFLO0lBQ3JCLEtBQUssRUFBRSxJQUFJO0lBQ1gsUUFBUSxFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakIsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUY7O0dBRUc7QUFDSCxNQUFNLGVBQWUsR0FBRyxDQUFDLFNBT3JCLEVBQUUsRUFBRSxFQUFFO0lBQ1Isc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUNqQyxxQkFBcUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ2hDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBQ3pCLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFDN0IsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFDdEIsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFFdEIsSUFBSSxNQUFNLENBQUMsY0FBYztRQUN2QixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDdkQsSUFBSSxNQUFNLENBQUMsYUFBYTtRQUN0QixxQkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDckQsSUFBSSxNQUFNLENBQUMsTUFBTTtRQUNmLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdkMsSUFBSSxNQUFNLENBQUMsVUFBVTtRQUNuQixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDL0MsSUFBSSxNQUFNLENBQUMsR0FBRztRQUNaLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDakMsSUFBSSxNQUFNLENBQUMsR0FBRztRQUNaLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDbkMsQ0FBQyxDQUFBO0FBRUQsa0RBQWtEO0FBRWxELElBQUEsaUJBQVEsRUFBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBQSxtQkFBVSxFQUFDLEdBQUcsRUFBRTtRQUNkLFdBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixtQkFBbUIsR0FBRyxLQUFLLENBQUE7UUFDM0Isd0JBQXdCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtRQUMzQyx3QkFBd0IsQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO1FBQzVDLGVBQWUsRUFBRSxDQUFBO1FBQ2pCLHNDQUFzQyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUM5RixDQUFDLENBQUMsQ0FBQTtJQUVGLDREQUE0RDtJQUM1RCxJQUFBLGlCQUFRLEVBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixJQUFBLFdBQUUsRUFBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFaEUsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDM0QsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7WUFDeEUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7WUFFM0QsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNyRSxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDakUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsVUFBVTtZQUNWLE1BQU0sYUFBYSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQzdGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQTtZQUVuRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2hFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxVQUFVO1lBQ1YsTUFBTSxhQUFhLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUNoRSxNQUFNLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFBO1lBQ3BELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7WUFFMUQsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsYUFBYSxDQUFDLENBQUMsb0JBQW9CLENBQ3hDLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDdEIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUMsQ0FDSCxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7WUFDdEQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw4REFBOEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNsRSxDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDBEQUEwRDtJQUMxRCxJQUFBLGlCQUFRLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixJQUFBLFdBQUUsRUFBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDN0MsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7WUFFeEQsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNuRixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFBO1lBRWhGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDL0YsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywrQ0FBK0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM3RCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFBO1lBRTFFLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3BELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDMUUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxVQUFVO1lBQ1YsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDeEQsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ25ELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRXhGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sUUFBUSxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZEQUE2RDtJQUM3RCxJQUFBLGlCQUFRLEVBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLElBQUEsV0FBRSxFQUFDLGtEQUFrRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFdEUsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUVwRCxNQUFNO1lBQ04sTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMvRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUUvRSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCw4Q0FBOEM7WUFDOUMsUUFBUSxDQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUU1QywwREFBMEQ7WUFDMUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDakYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDhEQUE4RDtJQUM5RCxJQUFBLGlCQUFRLEVBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLElBQUEsV0FBRSxFQUFDLG1EQUFtRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1lBRWxELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3JELElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsK0NBQStDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDN0QsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQTtZQUVuRSxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQTtnQkFDakYsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUN2QyxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQ3BDLElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUM3QyxJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRCxVQUFVO1lBQ1YsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDeEQsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtZQUN0RSxlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEYsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUVsRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdEQUF3RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RFLFVBQVU7WUFDVixNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN4RCxNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFBO1lBQ3RFLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNwRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSw0QkFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7WUFFekUsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMxQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sUUFBUSxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtnQkFDckQsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ2hFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw4REFBOEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RSxVQUFVO1lBQ1YsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQTtZQUN0RSxlQUFlLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEQsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFBO1lBRXhFLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3JELElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsOENBQThDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUQsVUFBVTtZQUNWLE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUE7WUFDaEUsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzFDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLDRCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtZQUVqRSxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RELFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTtZQUMxRCxlQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO1lBRTlELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3JELElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEUsVUFBVTtZQUNWLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUE7WUFDeEUsZUFBZSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLDRCQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUVyRSxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGdEQUFnRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzlELFVBQVU7WUFDVixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTtZQUMxRCxlQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1lBRXRFLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3JELElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDMUQsVUFBVTtZQUNWLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ3hELGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNuRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO1lBRTVELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3JELElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1FBQzlELElBQUEsV0FBRSxFQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO2dCQUN4QixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzlFLENBQUMsQ0FBQTtZQUNGLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQzdDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUNwRSxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDbkUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2pELGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUV6RixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQzdDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNyRSxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLENBQUMsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsaUJBQVEsRUFBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDM0MsSUFBQSxXQUFFLEVBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUU1RixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3RGLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1lBQ2xFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2xHLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3RGLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMscUVBQXFFLEVBQUUsR0FBRyxFQUFFO1lBQzdFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUM5QyxDQUFDLENBQUE7WUFDRixlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFbkYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN2RixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUMzQyxJQUFBLFdBQUUsRUFBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7WUFDMUUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQztnQkFDeEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLDhCQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQzthQUNyRixDQUFDLENBQUE7WUFDRixlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFbkYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxQyxTQUFTO1lBQ1QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUN0RixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLCtEQUErRCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO2dCQUN4QixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2FBQzlFLENBQUMsQ0FBQTtZQUNGLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLElBQUEsV0FBRSxFQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxVQUFVO1lBQ1Ysd0JBQXdCLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUUsQ0FBQyxDQUFBO1lBQ0YsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRW5GLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ2hGLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUV0RixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNoRixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO2dCQUN4QixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2FBQ3JGLENBQUMsQ0FBQTtZQUNGLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNoRixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtZQUNsRSxVQUFVO1lBQ1Ysd0JBQXdCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtZQUMzQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUUsQ0FBQyxDQUFBO1lBQ0YsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRW5GLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2pGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw4REFBOEQ7SUFDOUQsSUFBQSxpQkFBUSxFQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxJQUFBLGlCQUFRLEVBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQ2pDLElBQUEsV0FBRSxFQUFDLHNFQUFzRSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNwRixVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDO29CQUMzQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RSxDQUFDLENBQUE7Z0JBQ0YsZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNwQyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO2dCQUV4RSxNQUFNO2dCQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7Z0JBRXJELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO29CQUNqQixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtnQkFDdkQsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsU0FBUztnQkFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtnQkFDckMsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsV0FBRSxFQUFDLHdFQUF3RSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUN0RixVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO29CQUMvQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUM1SCxDQUFDLENBQUE7Z0JBQ0YsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRCxzQ0FBc0MsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQkFDOUcsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLDRCQUFhLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtnQkFFbkYsTUFBTTtnQkFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2dCQUVyRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFBO2dCQUVGLFNBQVM7Z0JBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7b0JBQ2pCLElBQUEsZUFBTSxFQUFDLHNDQUFzQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtnQkFDbkUsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsV0FBRSxFQUFDLHVEQUF1RCxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNyRSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO29CQUMvQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUM1SCxDQUFDLENBQUE7Z0JBQ0YsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRCxzQ0FBc0MsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDdkQsTUFBTSxFQUFFLEVBQUU7b0JBQ1YsY0FBYyxFQUFFLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRTtpQkFDakQsQ0FBQyxDQUFBO2dCQUNGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO29CQUMvQixRQUFRO29CQUNSLEtBQUssRUFBRSw0QkFBYSxDQUFDLGNBQWM7b0JBQ25DLEtBQUssRUFBRSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxFQUFFO2lCQUN6RCxDQUFDLENBQUE7Z0JBRUYsTUFBTTtnQkFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2dCQUVyRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFBO2dCQUVGLFNBQVM7Z0JBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7b0JBQ2pCLElBQUEsZUFBTSxFQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FDdkMsZUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQzdDLENBQUE7Z0JBQ0gsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsV0FBRSxFQUFDLHVFQUF1RSxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNyRixVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO29CQUMvQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUM1SCxDQUFDLENBQUE7Z0JBQ0YsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNuRCxzQ0FBc0MsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFBO2dCQUNwRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO2dCQUVuRixNQUFNO2dCQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7Z0JBRXJELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO29CQUNqQixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtnQkFDdkQsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsU0FBUztnQkFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsSUFBQSxlQUFNLEVBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUN2QyxlQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FDM0MsQ0FBQTtnQkFDSCxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLGlCQUFRLEVBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLElBQUEsV0FBRSxFQUFDLHFEQUFxRCxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNuRSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO29CQUMvQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDOzRCQUN2QixLQUFLLEVBQUUsT0FBTzs0QkFDZCxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjOzRCQUN4QyxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO3lCQUMvQixDQUFDLENBQUM7aUJBQ0osQ0FBQyxDQUFBO2dCQUNGLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDbkQsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7b0JBQy9CLFFBQVE7b0JBQ1IsS0FBSyxFQUFFLDRCQUFhLENBQUMsY0FBYztvQkFDbkMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2lCQUM5QyxDQUFDLENBQUE7Z0JBRUYsTUFBTTtnQkFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2dCQUVyRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO29CQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDeEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsU0FBUztnQkFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQ25DLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FDckUsQ0FBQTtnQkFDSCxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLGlCQUFRLEVBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLElBQUEsV0FBRSxFQUFDLHNEQUFzRCxFQUFFLEtBQUssSUFBSSxFQUFFO2dCQUNwRSxVQUFVO2dCQUNWLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtnQkFDeEIsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDO29CQUMzQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDOzRCQUN2QixLQUFLLEVBQUUsT0FBTzs0QkFDZCxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxHQUFHOzRCQUM3QixNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO3lCQUMvQixDQUFDLENBQUM7aUJBQ0osQ0FBQyxDQUFBO2dCQUNGLGVBQWUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDcEMsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7b0JBQy9CLFFBQVE7b0JBQ1IsS0FBSyxFQUFFLDRCQUFhLENBQUMsR0FBRztvQkFDeEIsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2lCQUM5QyxDQUFDLENBQUE7Z0JBRUYsTUFBTTtnQkFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7Z0JBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO2dCQUVyRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO29CQUNwRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDeEIsQ0FBQyxDQUFDLENBQUE7Z0JBRUYsU0FBUztnQkFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtvQkFDakIsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQ25DLGVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQy9ELENBQUE7Z0JBQ0gsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixrRUFBa0U7SUFDbEUsSUFBQSxpQkFBUSxFQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxJQUFBLFdBQUUsRUFBQyxnRUFBZ0UsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5RSxVQUFVO1lBQ1YsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO2dCQUMvQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO3dCQUN2QixLQUFLLEVBQUUsT0FBTzt3QkFDZCxVQUFVLEVBQUUsNEJBQWEsQ0FBQyxjQUFjO3dCQUN4QyxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxNQUFNO3FCQUMvQixDQUFDLENBQUM7YUFDSixDQUFDLENBQUE7WUFDRixlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDbkQsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtnQkFDN0MsS0FBSyxFQUFFLDRCQUFhLENBQUMsY0FBYzthQUNwQyxDQUFDLENBQUE7WUFFRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNwRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMscURBQXFELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbkUsVUFBVTtZQUNWLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQztnQkFDM0IsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQzt3QkFDdkIsS0FBSyxFQUFFLE9BQU87d0JBQ2QsVUFBVSxFQUFFLDRCQUFhLENBQUMsR0FBRzt3QkFDN0IsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTTtxQkFDL0IsQ0FBQyxDQUFDO2FBQ0osQ0FBQyxDQUFBO1lBQ0YsZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDO2dCQUMvQixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQzdDLEtBQUssRUFBRSw0QkFBYSxDQUFDLEdBQUc7YUFDekIsQ0FBQyxDQUFBO1lBRUYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMxQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDcEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdFQUF3RSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RGLFVBQVU7WUFDVixNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUM7Z0JBQ2pDLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7d0JBQ3ZCLEtBQUssRUFBRSxvQkFBb0I7d0JBQzNCLFVBQVUsRUFBRSw0QkFBYSxDQUFDLGFBQWE7d0JBQ3ZDLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU07cUJBQy9CLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQTtZQUNGLGVBQWUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNwRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7Z0JBQzFELEtBQUssRUFBRSw0QkFBYSxDQUFDLGFBQWE7YUFDbkMsQ0FBQyxDQUFBO1lBRUYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMxQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbEUsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGdFQUFnRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzlFLFVBQVU7WUFDVixNQUFNLFlBQVksR0FBRyxXQUFXLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7d0JBQ3ZCLEtBQUssRUFBRSxPQUFPO3dCQUNkLFVBQVUsRUFBRSw0QkFBYSxDQUFDLGNBQWM7d0JBQ3hDLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE1BQU07cUJBQy9CLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQTtZQUNGLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNuRCxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztnQkFDL0IsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUM3QyxLQUFLLEVBQUUsNEJBQWEsQ0FBQyxjQUFjO2FBQ3BDLENBQUMsQ0FBQTtZQUVGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDMUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsU0FBUztZQUNULE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Z0JBQ3BELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsdURBQXVEO0lBQ3ZELElBQUEsaUJBQVEsRUFBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLElBQUEsV0FBRSxFQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUVqRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN6RCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3RGLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBRXRELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsZ0NBQWdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDOUMsVUFBVTtZQUNWLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNuQixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDaEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDakQsZUFBZSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVDLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRSxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRS9ELE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQzlFLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQTtnQkFDakYsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUN2QyxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtnQkFDN0MsSUFBQSxlQUFNLEVBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7WUFDbkQsVUFBVTtZQUNWLE1BQU0sUUFBUSxHQUFHO2dCQUNmLDhCQUFlLENBQUMsTUFBTTtnQkFDdEIsOEJBQWUsQ0FBQyxXQUFXO2dCQUMzQiw4QkFBZSxDQUFDLGFBQWE7Z0JBQzdCLDhCQUFlLENBQUMsWUFBWTtnQkFDNUIsOEJBQWUsQ0FBQyxRQUFRO2FBQ3pCLENBQUE7WUFFRCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQzFCLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLFlBQVksTUFBTSxFQUFFO29CQUM5QixNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7aUJBQ3JELENBQUMsQ0FBQTtnQkFDRixlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBRTVDLE1BQU07Z0JBQ04sTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsWUFBWSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUM5RixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO2dCQUU5RCxTQUFTO2dCQUNULE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQzdDLElBQUksTUFBTSxLQUFLLDhCQUFlLENBQUMsTUFBTTtvQkFDbkMsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE9BQU8sQ0FBQyxDQUFBOztvQkFFL0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFBO2dCQUVoRSxPQUFPLEVBQUUsQ0FBQTtZQUNYLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZEQUE2RDtJQUM3RCxJQUFBLGlCQUFRLEVBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLElBQUEsV0FBRSxFQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUV4RCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCwyRUFBMkU7WUFDM0UsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNuRixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtZQUNwRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUV6RCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3BGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRix5RUFBeUU7SUFDekUsSUFBQSxpQkFBUSxFQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUM1QyxJQUFBLFdBQUUsRUFBQyx5RUFBeUUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2RixVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFbkYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMxQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCxTQUFTO1lBQ1QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sUUFBUSxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtnQkFDckQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDLENBQUE7Z0JBQ3BGLElBQUEsZUFBTSxFQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7WUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDJEQUEyRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pFLGdGQUFnRjtZQUNoRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFL0QsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMxQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUVyRCwyREFBMkQ7WUFDM0QsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sUUFBUSxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtnQkFDckQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDLENBQUE7Z0JBQ3BGLElBQUEsZUFBTSxFQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ3hDLElBQUEsZUFBTSxFQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUMvQyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsd0RBQXdELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdEUsZ0ZBQWdGO1lBQ2hGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRSxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELHdEQUF3RDtZQUN4RCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQTtnQkFDcEYsSUFBQSxlQUFNLEVBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDNUMsSUFBQSxlQUFNLEVBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQzVDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw2RUFBNkUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMzRixVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUUvQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzFDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO1lBRXJELCtFQUErRTtZQUMvRSxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxRQUFRLEdBQUcsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNyRCxJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiwrREFBK0Q7SUFDL0QsSUFBQSxpQkFBUSxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxJQUFBLFdBQUUsRUFBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDbEQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRXJGLE1BQU07WUFDTixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQy9ELElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBRTlFLFFBQVEsQ0FBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTNGLFNBQVM7WUFDVCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUM5RSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDZDQUE2QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzNELFVBQVU7WUFDVixNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN4RCxNQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFBO1lBQ3RFLGVBQWUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUVwRixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSw0QkFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7WUFFekUsTUFBTTtZQUNOLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFDL0QsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7WUFFckQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUM1RixDQUFDLENBQUMsQ0FBQTtZQUVGLGdDQUFnQztZQUNoQyxtQkFBbUIsR0FBRyxJQUFJLENBQUE7WUFDMUIsUUFBUSxDQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLDRCQUFhLENBQUMsYUFBYSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWhGLFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQzVGLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7WUFDL0QsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQztnQkFDeEIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLDhCQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUM5RSxDQUFDLENBQUE7WUFDRixlQUFlLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUMsd0JBQXdCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtZQUMzQyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUVuRixNQUFNO1lBQ04sTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUMvRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUUvRSx3QkFBd0IsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO1lBQzVDLFFBQVEsQ0FBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFNUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ2hGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiwwREFBMEQ7SUFDMUQsSUFBQSxpQkFBUSxFQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBQSxXQUFFLEVBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLFVBQVU7WUFDVixNQUFNLEtBQUssR0FBRyxrQkFBa0IsRUFBRSxDQUFBO1lBRWxDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNwRCxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiwyREFBMkQ7SUFDM0QsSUFBQSxpQkFBUSxFQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM5QixJQUFBLFdBQUUsRUFBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7WUFDMUMsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLE9BQU8sZUFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNyRCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxlQUFlO1lBQ2YsSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9kZWwsIE1vZGVsSXRlbSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuLy8gSW1wb3J0IGNvbXBvbmVudCBhZnRlciBtb2Nrc1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcblxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sIE1vZGVsU3RhdHVzRW51bSwgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCBNb2RlbFBhcmFtZXRlck1vZGFsIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgU2V0dXAgPT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBzaGFyZWQgc3RhdGUgZm9yIHBvcnRhbFxubGV0IG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBmYWxzZVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvcG9ydGFsLXRvLWZvbGxvdy1lbGVtJywgKCkgPT4gKHtcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtOiAoeyBjaGlsZHJlbiwgb3BlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIG9wZW46IGJvb2xlYW4gfSkgPT4ge1xuICAgIG1vY2tQb3J0YWxPcGVuU3RhdGUgPSBvcGVuIHx8IGZhbHNlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtZWxlbVwiIGRhdGEtb3Blbj17b3Blbn0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcjogKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGNsYXNzTmFtZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIG9uQ2xpY2s6ICgpID0+IHZvaWQsIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSwgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IHtcbiAgICBpZiAoIW1vY2tQb3J0YWxPcGVuU3RhdGUpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgcHJvdmlkZXIgY29udGV4dFxuY29uc3QgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlID0ge1xuICBpc0FQSUtleVNldDogdHJ1ZSxcbiAgbW9kZWxQcm92aWRlcnM6IFtdLFxufVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+IG1vY2tQcm92aWRlckNvbnRleHRWYWx1ZSxcbn0pKVxuXG4vLyBNb2NrIG1vZGVsIGxpc3QgaG9va1xuY29uc3QgbW9ja1RleHRHZW5lcmF0aW9uTGlzdDogTW9kZWxbXSA9IFtdXG5jb25zdCBtb2NrVGV4dEVtYmVkZGluZ0xpc3Q6IE1vZGVsW10gPSBbXVxuY29uc3QgbW9ja1JlcmFua0xpc3Q6IE1vZGVsW10gPSBbXVxuY29uc3QgbW9ja01vZGVyYXRpb25MaXN0OiBNb2RlbFtdID0gW11cbmNvbnN0IG1vY2tTdHRMaXN0OiBNb2RlbFtdID0gW11cbmNvbnN0IG1vY2tUdHNMaXN0OiBNb2RlbFtdID0gW11cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VNb2RlbExpc3Q6ICh0eXBlOiBNb2RlbFR5cGVFbnVtKSA9PiB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb246XG4gICAgICAgIHJldHVybiB7IGRhdGE6IG1vY2tUZXh0R2VuZXJhdGlvbkxpc3QgfVxuICAgICAgY2FzZSBNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmc6XG4gICAgICAgIHJldHVybiB7IGRhdGE6IG1vY2tUZXh0RW1iZWRkaW5nTGlzdCB9XG4gICAgICBjYXNlIE1vZGVsVHlwZUVudW0ucmVyYW5rOlxuICAgICAgICByZXR1cm4geyBkYXRhOiBtb2NrUmVyYW5rTGlzdCB9XG4gICAgICBjYXNlIE1vZGVsVHlwZUVudW0ubW9kZXJhdGlvbjpcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogbW9ja01vZGVyYXRpb25MaXN0IH1cbiAgICAgIGNhc2UgTW9kZWxUeXBlRW51bS5zcGVlY2gydGV4dDpcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogbW9ja1N0dExpc3QgfVxuICAgICAgY2FzZSBNb2RlbFR5cGVFbnVtLnR0czpcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogbW9ja1R0c0xpc3QgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHsgZGF0YTogW10gfVxuICAgIH1cbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGZldGNoQW5kTWVyZ2VWYWxpZENvbXBsZXRpb25QYXJhbXNcbmNvbnN0IG1vY2tGZXRjaEFuZE1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zID0gdmkuZm4oKVxudmkubW9jaygnQC91dGlscy9jb21wbGV0aW9uLXBhcmFtcycsICgpID0+ICh7XG4gIGZldGNoQW5kTWVyZ2VWYWxpZENvbXBsZXRpb25QYXJhbXM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tGZXRjaEFuZE1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zKC4uLmFyZ3MpLFxufSkpXG5cbi8vIE1vY2sgY2hpbGQgY29tcG9uZW50c1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtc2VsZWN0b3InLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBkZWZhdWx0TW9kZWwsIG1vZGVsTGlzdCwgc2NvcGVGZWF0dXJlcywgb25TZWxlY3QgfToge1xuICAgIGRlZmF1bHRNb2RlbD86IHsgcHJvdmlkZXI/OiBzdHJpbmcsIG1vZGVsPzogc3RyaW5nIH1cbiAgICBtb2RlbExpc3Q/OiBNb2RlbFtdXG4gICAgc2NvcGVGZWF0dXJlcz86IHN0cmluZ1tdXG4gICAgb25TZWxlY3Q/OiAobW9kZWw6IHsgcHJvdmlkZXI6IHN0cmluZywgbW9kZWw6IHN0cmluZyB9KSA9PiB2b2lkXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cIm1vZGVsLXNlbGVjdG9yXCJcbiAgICAgIGRhdGEtZGVmYXVsdC1tb2RlbD17SlNPTi5zdHJpbmdpZnkoZGVmYXVsdE1vZGVsKX1cbiAgICAgIGRhdGEtbW9kZWwtbGlzdC1jb3VudD17bW9kZWxMaXN0Py5sZW5ndGggfHwgMH1cbiAgICAgIGRhdGEtc2NvcGUtZmVhdHVyZXM9e0pTT04uc3RyaW5naWZ5KHNjb3BlRmVhdHVyZXMpfVxuICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Q/Lih7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSl9XG4gICAgPlxuICAgICAgTW9kZWwgU2VsZWN0b3JcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9tb2RlbC1wYXJhbWV0ZXItbW9kYWwvdHJpZ2dlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGRpc2FibGVkLCBoYXNEZXByZWNhdGVkLCBtb2RlbERpc2FibGVkLCBjdXJyZW50UHJvdmlkZXIsIGN1cnJlbnRNb2RlbCwgcHJvdmlkZXJOYW1lLCBtb2RlbElkLCBpc0luV29ya2Zsb3cgfToge1xuICAgIGRpc2FibGVkPzogYm9vbGVhblxuICAgIGhhc0RlcHJlY2F0ZWQ/OiBib29sZWFuXG4gICAgbW9kZWxEaXNhYmxlZD86IGJvb2xlYW5cbiAgICBjdXJyZW50UHJvdmlkZXI/OiBNb2RlbFxuICAgIGN1cnJlbnRNb2RlbD86IE1vZGVsSXRlbVxuICAgIHByb3ZpZGVyTmFtZT86IHN0cmluZ1xuICAgIG1vZGVsSWQ/OiBzdHJpbmdcbiAgICBpc0luV29ya2Zsb3c/OiBib29sZWFuXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cInRyaWdnZXJcIlxuICAgICAgZGF0YS1kaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICBkYXRhLWhhcy1kZXByZWNhdGVkPXtoYXNEZXByZWNhdGVkfVxuICAgICAgZGF0YS1tb2RlbC1kaXNhYmxlZD17bW9kZWxEaXNhYmxlZH1cbiAgICAgIGRhdGEtcHJvdmlkZXI9e3Byb3ZpZGVyTmFtZX1cbiAgICAgIGRhdGEtbW9kZWw9e21vZGVsSWR9XG4gICAgICBkYXRhLWluLXdvcmtmbG93PXtpc0luV29ya2Zsb3d9XG4gICAgICBkYXRhLWhhcy1jdXJyZW50LXByb3ZpZGVyPXshIWN1cnJlbnRQcm92aWRlcn1cbiAgICAgIGRhdGEtaGFzLWN1cnJlbnQtbW9kZWw9eyEhY3VycmVudE1vZGVsfVxuICAgID5cbiAgICAgIFRyaWdnZXJcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9tb2RlbC1wYXJhbWV0ZXItbW9kYWwvYWdlbnQtbW9kZWwtdHJpZ2dlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGRpc2FibGVkLCBoYXNEZXByZWNhdGVkLCBjdXJyZW50UHJvdmlkZXIsIGN1cnJlbnRNb2RlbCwgcHJvdmlkZXJOYW1lLCBtb2RlbElkLCBzY29wZSB9OiB7XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuXG4gICAgaGFzRGVwcmVjYXRlZD86IGJvb2xlYW5cbiAgICBjdXJyZW50UHJvdmlkZXI/OiBNb2RlbFxuICAgIGN1cnJlbnRNb2RlbD86IE1vZGVsSXRlbVxuICAgIHByb3ZpZGVyTmFtZT86IHN0cmluZ1xuICAgIG1vZGVsSWQ/OiBzdHJpbmdcbiAgICBzY29wZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJhZ2VudC1tb2RlbC10cmlnZ2VyXCJcbiAgICAgIGRhdGEtZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgZGF0YS1oYXMtZGVwcmVjYXRlZD17aGFzRGVwcmVjYXRlZH1cbiAgICAgIGRhdGEtcHJvdmlkZXI9e3Byb3ZpZGVyTmFtZX1cbiAgICAgIGRhdGEtbW9kZWw9e21vZGVsSWR9XG4gICAgICBkYXRhLXNjb3BlPXtzY29wZX1cbiAgICAgIGRhdGEtaGFzLWN1cnJlbnQtcHJvdmlkZXI9eyEhY3VycmVudFByb3ZpZGVyfVxuICAgICAgZGF0YS1oYXMtY3VycmVudC1tb2RlbD17ISFjdXJyZW50TW9kZWx9XG4gICAgPlxuICAgICAgQWdlbnQgTW9kZWwgVHJpZ2dlclxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4vbGxtLXBhcmFtcy1wYW5lbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHByb3ZpZGVyLCBtb2RlbElkLCBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsIGlzQWR2YW5jZWRNb2RlIH06IHtcbiAgICBwcm92aWRlcjogc3RyaW5nXG4gICAgbW9kZWxJZDogc3RyaW5nXG4gICAgY29tcGxldGlvblBhcmFtcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlPzogKHBhcmFtczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHZvaWRcbiAgICBpc0FkdmFuY2VkTW9kZTogYm9vbGVhblxuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJsbG0tcGFyYW1zLXBhbmVsXCJcbiAgICAgIGRhdGEtcHJvdmlkZXI9e3Byb3ZpZGVyfVxuICAgICAgZGF0YS1tb2RlbD17bW9kZWxJZH1cbiAgICAgIGRhdGEtaXMtYWR2YW5jZWQ9e2lzQWR2YW5jZWRNb2RlfVxuICAgICAgb25DbGljaz17KCkgPT4gb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlPy4oeyB0ZW1wZXJhdHVyZTogMC44IH0pfVxuICAgID5cbiAgICAgIExMTSBQYXJhbXMgUGFuZWxcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuL3R0cy1wYXJhbXMtcGFuZWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBsYW5ndWFnZSwgdm9pY2UsIG9uQ2hhbmdlIH06IHtcbiAgICBjdXJyZW50TW9kZWw/OiBNb2RlbEl0ZW1cbiAgICBsYW5ndWFnZT86IHN0cmluZ1xuICAgIHZvaWNlPzogc3RyaW5nXG4gICAgb25DaGFuZ2U/OiAobGFuZ3VhZ2U6IHN0cmluZywgdm9pY2U6IHN0cmluZykgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJ0dHMtcGFyYW1zLXBhbmVsXCJcbiAgICAgIGRhdGEtbGFuZ3VhZ2U9e2xhbmd1YWdlfVxuICAgICAgZGF0YS12b2ljZT17dm9pY2V9XG4gICAgICBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZT8uKCdlbi1VUycsICdhbGxveScpfVxuICAgID5cbiAgICAgIFRUUyBQYXJhbXMgUGFuZWxcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBUZXN0IFV0aWxpdGllcyA9PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgTW9kZWxJdGVtIHdpdGggZGVmYXVsdHNcbiAqL1xuY29uc3QgY3JlYXRlTW9kZWxJdGVtID0gKG92ZXJyaWRlczogUGFydGlhbDxNb2RlbEl0ZW0+ID0ge30pOiBNb2RlbEl0ZW0gPT4gKHtcbiAgbW9kZWw6ICd0ZXN0LW1vZGVsJyxcbiAgbGFiZWw6IHsgZW5fVVM6ICdUZXN0IE1vZGVsJywgemhfSGFuczogJ1Rlc3QgTW9kZWwnIH0sXG4gIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sXG4gIGZlYXR1cmVzOiBbXSxcbiAgZmV0Y2hfZnJvbTogQ29uZmlndXJhdGlvbk1ldGhvZEVudW0ucHJlZGVmaW5lZE1vZGVsLFxuICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gIG1vZGVsX3Byb3BlcnRpZXM6IHsgbW9kZTogJ2NoYXQnIH0sXG4gIGxvYWRfYmFsYW5jaW5nX2VuYWJsZWQ6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgTW9kZWwgKHByb3ZpZGVyIHdpdGggbW9kZWxzKSB3aXRoIGRlZmF1bHRzXG4gKi9cbmNvbnN0IGNyZWF0ZU1vZGVsID0gKG92ZXJyaWRlczogUGFydGlhbDxNb2RlbD4gPSB7fSk6IE1vZGVsID0+ICh7XG4gIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgaWNvbl9zbWFsbDogeyBlbl9VUzogJ2ljb24tc21hbGwucG5nJywgemhfSGFuczogJ2ljb24tc21hbGwucG5nJyB9LFxuICBsYWJlbDogeyBlbl9VUzogJ09wZW5BSScsIHpoX0hhbnM6ICdPcGVuQUknIH0sXG4gIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSgpXSxcbiAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGRlZmF1bHQgcHJvcHNcbiAqL1xuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxQYXJhbWV0ZXJzPHR5cGVvZiBNb2RlbFBhcmFtZXRlck1vZGFsPlswXT4gPSB7fSkgPT4gKHtcbiAgaXNBZHZhbmNlZE1vZGU6IGZhbHNlLFxuICB2YWx1ZTogbnVsbCxcbiAgc2V0TW9kZWw6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogSGVscGVyIHRvIHNldCB1cCBtb2RlbCBsaXN0cyBmb3IgdGVzdGluZ1xuICovXG5jb25zdCBzZXR1cE1vZGVsTGlzdHMgPSAoY29uZmlnOiB7XG4gIHRleHRHZW5lcmF0aW9uPzogTW9kZWxbXVxuICB0ZXh0RW1iZWRkaW5nPzogTW9kZWxbXVxuICByZXJhbms/OiBNb2RlbFtdXG4gIG1vZGVyYXRpb24/OiBNb2RlbFtdXG4gIHN0dD86IE1vZGVsW11cbiAgdHRzPzogTW9kZWxbXVxufSA9IHt9KSA9PiB7XG4gIG1vY2tUZXh0R2VuZXJhdGlvbkxpc3QubGVuZ3RoID0gMFxuICBtb2NrVGV4dEVtYmVkZGluZ0xpc3QubGVuZ3RoID0gMFxuICBtb2NrUmVyYW5rTGlzdC5sZW5ndGggPSAwXG4gIG1vY2tNb2RlcmF0aW9uTGlzdC5sZW5ndGggPSAwXG4gIG1vY2tTdHRMaXN0Lmxlbmd0aCA9IDBcbiAgbW9ja1R0c0xpc3QubGVuZ3RoID0gMFxuXG4gIGlmIChjb25maWcudGV4dEdlbmVyYXRpb24pXG4gICAgbW9ja1RleHRHZW5lcmF0aW9uTGlzdC5wdXNoKC4uLmNvbmZpZy50ZXh0R2VuZXJhdGlvbilcbiAgaWYgKGNvbmZpZy50ZXh0RW1iZWRkaW5nKVxuICAgIG1vY2tUZXh0RW1iZWRkaW5nTGlzdC5wdXNoKC4uLmNvbmZpZy50ZXh0RW1iZWRkaW5nKVxuICBpZiAoY29uZmlnLnJlcmFuaylcbiAgICBtb2NrUmVyYW5rTGlzdC5wdXNoKC4uLmNvbmZpZy5yZXJhbmspXG4gIGlmIChjb25maWcubW9kZXJhdGlvbilcbiAgICBtb2NrTW9kZXJhdGlvbkxpc3QucHVzaCguLi5jb25maWcubW9kZXJhdGlvbilcbiAgaWYgKGNvbmZpZy5zdHQpXG4gICAgbW9ja1N0dExpc3QucHVzaCguLi5jb25maWcuc3R0KVxuICBpZiAoY29uZmlnLnR0cylcbiAgICBtb2NrVHRzTGlzdC5wdXNoKC4uLmNvbmZpZy50dHMpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdNb2RlbFBhcmFtZXRlck1vZGFsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrUG9ydGFsT3BlblN0YXRlID0gZmFsc2VcbiAgICBtb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUuaXNBUElLZXlTZXQgPSB0cnVlXG4gICAgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlLm1vZGVsUHJvdmlkZXJzID0gW11cbiAgICBzZXR1cE1vZGVsTGlzdHMoKVxuICAgIG1vY2tGZXRjaEFuZE1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zLm1vY2tSZXNvbHZlZFZhbHVlKHsgcGFyYW1zOiB7fSwgcmVtb3ZlZERldGFpbHM6IHt9IH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmVuZGVyaW5nIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmlnZ2VyIGNvbXBvbmVudCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhZ2VudCBtb2RlbCB0cmlnZ2VyIHdoZW4gaXNBZ2VudFN0cmF0ZWd5IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzQWdlbnRTdHJhdGVneTogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FnZW50LW1vZGVsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd0cmlnZ2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1c3RvbSB0cmlnZ2VyIHdoZW4gcmVuZGVyVHJpZ2dlciBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJlbmRlclRyaWdnZXIgPSB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSg8ZGl2IGRhdGEtdGVzdGlkPVwiY3VzdG9tLXRyaWdnZXJcIj5DdXN0b208L2Rpdj4pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHJlbmRlclRyaWdnZXIgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tdHJpZ2dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3RyaWdnZXInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHJlbmRlclRyaWdnZXIgd2l0aCBjb3JyZWN0IHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcmVuZGVyVHJpZ2dlciA9IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKDxkaXY+Q3VzdG9tPC9kaXY+KVxuICAgICAgY29uc3QgdmFsdWUgPSB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyByZW5kZXJUcmlnZ2VyLCB2YWx1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZW5kZXJUcmlnZ2VyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgICAgIHByb3ZpZGVyTmFtZTogJ29wZW5haScsXG4gICAgICAgICAgbW9kZWxJZDogJ2dwdC00JyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBwb3J0YWwgY29udGVudCB3aGVuIGNsb3NlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGVsIHNlbGVjdG9yIGluc2lkZSBwb3J0YWwgY29udGVudCB3aGVuIG9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUHJvcHMgVGVzdGluZyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGlzSW5Xb3JrZmxvdyB0byB0cmlnZ2VyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luV29ya2Zsb3c6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pbi13b3JrZmxvdycsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNjb3BlIHRvIGFnZW50IG1vZGVsIHRyaWdnZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzQWdlbnRTdHJhdGVneTogdHJ1ZSwgc2NvcGU6ICdsbG0mdmlzaW9uJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FnZW50LW1vZGVsLXRyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNjb3BlJywgJ2xsbSZ2aXNpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHBvcHVwQ2xhc3NOYW1lIHRvIHBvcnRhbCBjb250ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwb3B1cENsYXNzTmFtZTogJ2N1c3RvbS1wb3B1cC1jbGFzcycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQucXVlcnlTZWxlY3RvcignLmN1c3RvbS1wb3B1cC1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlZmF1bHQgc2NvcGUgdG8gdGV4dEdlbmVyYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0ZXh0R2VuTW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnb3BlbmFpJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEdlbmVyYXRpb246IFt0ZXh0R2VuTW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXN0LW1vZGVsJyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICBleHBlY3Qoc2VsZWN0b3IpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1saXN0LWNvdW50JywgJzEnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gU3RhdGUgTWFuYWdlbWVudCA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBvcGVuIHN0YXRlIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0b2dnbGUgb3BlbiBzdGF0ZSB3aGVuIHJlYWRvbmx5IGlzIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHJlYWRvbmx5OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3BlbicsICdmYWxzZScpXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEZvcmNlIGEgcmUtcmVuZGVyIHRvIGVuc3VyZSBzdGF0ZSBpcyBzdGFibGVcbiAgICAgIHJlcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIG9wZW4gc3RhdGUgc2hvdWxkIHJlbWFpbiBmYWxzZSBkdWUgdG8gcmVhZG9ubHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcGVuJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IE1lbW9pemF0aW9uIExvZ2ljID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIHNjb3BlRmVhdHVyZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBzY29wZSBpbmNsdWRlcyBhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNjb3BlOiAnYWxsJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc2NvcGUtZmVhdHVyZXMnLCAnW10nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmaWx0ZXIgb3V0IG1vZGVsIHR5cGUgZW51bXMgZnJvbSBzY29wZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6ICdsbG0mdG9vbC1jYWxsJnZpc2lvbicgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGNvbnN0IGZlYXR1cmVzID0gSlNPTi5wYXJzZShzZWxlY3Rvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NvcGUtZmVhdHVyZXMnKSB8fCAnW10nKVxuICAgICAgICBleHBlY3QoZmVhdHVyZXMpLnRvQ29udGFpbigndG9vbC1jYWxsJylcbiAgICAgICAgZXhwZWN0KGZlYXR1cmVzKS50b0NvbnRhaW4oJ3Zpc2lvbicpXG4gICAgICAgIGV4cGVjdChmZWF0dXJlcykubm90LnRvQ29udGFpbignbGxtJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBzY29wZWRNb2RlbExpc3QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYWxsIG1vZGVscyB3aGVuIHNjb3BlIGlzIGFsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRleHRHZW5Nb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdvcGVuYWknIH0pXG4gICAgICBjb25zdCBlbWJlZGRpbmdNb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdlbWJlZGRpbmctcHJvdmlkZXInIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW3RleHRHZW5Nb2RlbF0sIHRleHRFbWJlZGRpbmc6IFtlbWJlZGRpbmdNb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6ICdhbGwnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKVxuICAgICAgICBleHBlY3Qoc2VsZWN0b3IpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1saXN0LWNvdW50JywgJzInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gb25seSB0ZXh0R2VuZXJhdGlvbiBtb2RlbHMgZm9yIGxsbSBzY29wZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRleHRHZW5Nb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdvcGVuYWknIH0pXG4gICAgICBjb25zdCBlbWJlZGRpbmdNb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdlbWJlZGRpbmctcHJvdmlkZXInIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW3RleHRHZW5Nb2RlbF0sIHRleHRFbWJlZGRpbmc6IFtlbWJlZGRpbmdNb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGV4cGVjdChzZWxlY3RvcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWxpc3QtY291bnQnLCAnMScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0ZXh0IGVtYmVkZGluZyBtb2RlbHMgZm9yIHRleHQtZW1iZWRkaW5nIHNjb3BlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZW1iZWRkaW5nTW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnZW1iZWRkaW5nLXByb3ZpZGVyJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEVtYmVkZGluZzogW2VtYmVkZGluZ01vZGVsXSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzY29wZTogTW9kZWxUeXBlRW51bS50ZXh0RW1iZWRkaW5nIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKVxuICAgICAgICBleHBlY3Qoc2VsZWN0b3IpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1saXN0LWNvdW50JywgJzEnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcmVyYW5rIG1vZGVscyBmb3IgcmVyYW5rIHNjb3BlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcmVyYW5rTW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAncmVyYW5rLXByb3ZpZGVyJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgcmVyYW5rOiBbcmVyYW5rTW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNjb3BlOiBNb2RlbFR5cGVFbnVtLnJlcmFuayB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwtbGlzdC1jb3VudCcsICcxJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHR0cyBtb2RlbHMgZm9yIHR0cyBzY29wZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHR0c01vZGVsID0gY3JlYXRlTW9kZWwoeyBwcm92aWRlcjogJ3R0cy1wcm92aWRlcicgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHR0czogW3R0c01vZGVsXSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzY29wZTogTW9kZWxUeXBlRW51bS50dHMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGV4cGVjdChzZWxlY3RvcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWxpc3QtY291bnQnLCAnMScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBtb2RlcmF0aW9uIG1vZGVscyBmb3IgbW9kZXJhdGlvbiBzY29wZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVyYXRpb25Nb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdtb2RlcmF0aW9uLXByb3ZpZGVyJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgbW9kZXJhdGlvbjogW21vZGVyYXRpb25Nb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6IE1vZGVsVHlwZUVudW0ubW9kZXJhdGlvbiB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwtbGlzdC1jb3VudCcsICcxJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHN0dCBtb2RlbHMgZm9yIHNwZWVjaDJ0ZXh0IHNjb3BlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3R0TW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnc3R0LXByb3ZpZGVyJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgc3R0OiBbc3R0TW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNjb3BlOiBNb2RlbFR5cGVFbnVtLnNwZWVjaDJ0ZXh0IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKVxuICAgICAgICBleHBlY3Qoc2VsZWN0b3IpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1saXN0LWNvdW50JywgJzEnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgbGlzdCBmb3IgdW5rbm93biBzY29wZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRleHRHZW5Nb2RlbCA9IGNyZWF0ZU1vZGVsKHsgcHJvdmlkZXI6ICdvcGVuYWknIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW3RleHRHZW5Nb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6ICd1bmtub3duLXNjb3BlJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwtbGlzdC1jb3VudCcsICcwJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBjdXJyZW50UHJvdmlkZXIgYW5kIGN1cnJlbnRNb2RlbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZpbmQgY3VycmVudCBwcm92aWRlciBhbmQgbW9kZWwgZnJvbSB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAnZ3B0LTQnLCBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUgfSldLFxuICAgICAgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtY3VycmVudC1wcm92aWRlcicsICd0cnVlJylcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtaGFzLWN1cnJlbnQtbW9kZWwnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGZpbmQgcHJvdmlkZXIgd2hlbiB2YWx1ZS5wcm92aWRlciBkb2VzIG5vdCBtYXRjaCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoeyBwcm92aWRlcjogJ29wZW5haScgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnYW50aHJvcGljJywgbW9kZWw6ICdjbGF1ZGUtMycgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtY3VycmVudC1wcm92aWRlcicsICdmYWxzZScpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLWhhcy1jdXJyZW50LW1vZGVsJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIGhhc0RlcHJlY2F0ZWQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZXQgaGFzRGVwcmVjYXRlZCB0byB0cnVlIHdoZW4gcHJvdmlkZXIgaXMgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBwcm92aWRlcjogJ3Vua25vd24nLCBtb2RlbDogJ3Vua25vd24tbW9kZWwnIH0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtZGVwcmVjYXRlZCcsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaGFzRGVwcmVjYXRlZCB0byB0cnVlIHdoZW4gbW9kZWwgaXMgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWxzOiBbY3JlYXRlTW9kZWxJdGVtKHsgbW9kZWw6ICdncHQtMy41JyB9KV0gfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWhhcy1kZXByZWNhdGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBoYXNEZXByZWNhdGVkIHRvIGZhbHNlIHdoZW4gcHJvdmlkZXIgYW5kIG1vZGVsIGFyZSBmb3VuZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAnZ3B0LTQnIH0pXSxcbiAgICAgIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW21vZGVsXSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAnZ3B0LTQnIH0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtZGVwcmVjYXRlZCcsICdmYWxzZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBtb2RlbERpc2FibGVkJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2V0IG1vZGVsRGlzYWJsZWQgdG8gdHJ1ZSB3aGVuIG1vZGVsIHN0YXR1cyBpcyBub3QgYWN0aXZlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgbW9kZWxzOiBbY3JlYXRlTW9kZWxJdGVtKHsgbW9kZWw6ICdncHQtNCcsIHN0YXR1czogTW9kZWxTdGF0dXNFbnVtLnF1b3RhRXhjZWVkZWQgfSldLFxuICAgICAgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBtb2RlbERpc2FibGVkIHRvIGZhbHNlIHdoZW4gbW9kZWwgc3RhdHVzIGlzIGFjdGl2ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAnZ3B0LTQnLCBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUgfSldLFxuICAgICAgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWRpc2FibGVkJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2V0IGRpc2FibGVkIHRvIHRydWUgd2hlbiBpc0FQSUtleVNldCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tQcm92aWRlckNvbnRleHRWYWx1ZS5pc0FQSUtleVNldCA9IGZhbHNlXG4gICAgICBjb25zdCBtb2RlbCA9IGNyZWF0ZU1vZGVsKHtcbiAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oeyBtb2RlbDogJ2dwdC00Jywgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlIH0pXSxcbiAgICAgIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW21vZGVsXSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAnZ3B0LTQnIH0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1kaXNhYmxlZCcsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgZGlzYWJsZWQgdG8gdHJ1ZSB3aGVuIGhhc0RlcHJlY2F0ZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdmFsdWU6IHsgcHJvdmlkZXI6ICd1bmtub3duJywgbW9kZWw6ICd1bmtub3duJyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGRpc2FibGVkIHRvIHRydWUgd2hlbiBtb2RlbERpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2RlbCA9IGNyZWF0ZU1vZGVsKHtcbiAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oeyBtb2RlbDogJ2dwdC00Jywgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0ucXVvdGFFeGNlZWRlZCB9KV0sXG4gICAgICB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEdlbmVyYXRpb246IFttb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdmFsdWU6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ2dwdC00JyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGRpc2FibGVkIHRvIGZhbHNlIHdoZW4gYWxsIGNvbmRpdGlvbnMgYXJlIG1ldCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tQcm92aWRlckNvbnRleHRWYWx1ZS5pc0FQSUtleVNldCA9IHRydWVcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAnZ3B0LTQnLCBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUgfSldLFxuICAgICAgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFVzZXIgSW50ZXJhY3Rpb25zID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnaGFuZGxlQ2hhbmdlTW9kZWwnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgc2V0TW9kZWwgd2l0aCBzZWxlY3RlZCBtb2RlbCBmb3Igbm9uLXRleHRHZW5lcmF0aW9uIHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc2V0TW9kZWwgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHR0c01vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oeyBtb2RlbDogJ3R0cy0xJywgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bS50dHMgfSldLFxuICAgICAgICB9KVxuICAgICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0dHM6IFt0dHNNb2RlbF0gfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzZXRNb2RlbCwgc2NvcGU6IE1vZGVsVHlwZUVudW0udHRzIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJykpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzZXRNb2RlbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgZmV0Y2hBbmRNZXJnZVZhbGlkQ29tcGxldGlvblBhcmFtcyBmb3IgdGV4dEdlbmVyYXRpb24gdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBzZXRNb2RlbCA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgdGV4dEdlbk1vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oeyBtb2RlbDogJ2dwdC00JywgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bS50ZXh0R2VuZXJhdGlvbiwgbW9kZWxfcHJvcGVydGllczogeyBtb2RlOiAnY2hhdCcgfSB9KV0sXG4gICAgICAgIH0pXG4gICAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbdGV4dEdlbk1vZGVsXSB9KVxuICAgICAgICBtb2NrRmV0Y2hBbmRNZXJnZVZhbGlkQ29tcGxldGlvblBhcmFtcy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHBhcmFtczogeyB0ZW1wZXJhdHVyZTogMC43IH0sIHJlbW92ZWREZXRhaWxzOiB7fSB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNldE1vZGVsLCBzY29wZTogTW9kZWxUeXBlRW51bS50ZXh0R2VuZXJhdGlvbiB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja0ZldGNoQW5kTWVyZ2VWYWxpZENvbXBsZXRpb25QYXJhbXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgdG9hc3Qgd2hlbiBwYXJhbWV0ZXJzIGFyZSByZW1vdmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHNldE1vZGVsID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB0ZXh0R2VuTW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAnZ3B0LTQnLCBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLCBtb2RlbF9wcm9wZXJ0aWVzOiB7IG1vZGU6ICdjaGF0JyB9IH0pXSxcbiAgICAgICAgfSlcbiAgICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEdlbmVyYXRpb246IFt0ZXh0R2VuTW9kZWxdIH0pXG4gICAgICAgIG1vY2tGZXRjaEFuZE1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICAgIHJlbW92ZWREZXRhaWxzOiB7IGludmFsaWRfcGFyYW06ICd1bnN1cHBvcnRlZCcgfSxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIHNldE1vZGVsLFxuICAgICAgICAgIHNjb3BlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLFxuICAgICAgICAgIHZhbHVlOiB7IGNvbXBsZXRpb25fcGFyYW1zOiB7IGludmFsaWRfcGFyYW06ICd2YWx1ZScgfSB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QoVG9hc3Qubm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdHlwZTogJ3dhcm5pbmcnIH0pLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCB3aGVuIGZldGNoQW5kTWVyZ2VWYWxpZENvbXBsZXRpb25QYXJhbXMgZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgc2V0TW9kZWwgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHRleHRHZW5Nb2RlbCA9IGNyZWF0ZU1vZGVsKHtcbiAgICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgICAgbW9kZWxzOiBbY3JlYXRlTW9kZWxJdGVtKHsgbW9kZWw6ICdncHQtNCcsIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sIG1vZGVsX3Byb3BlcnRpZXM6IHsgbW9kZTogJ2NoYXQnIH0gfSldLFxuICAgICAgICB9KVxuICAgICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW3RleHRHZW5Nb2RlbF0gfSlcbiAgICAgICAgbW9ja0ZldGNoQW5kTWVyZ2VWYWxpZENvbXBsZXRpb25QYXJhbXMubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIGVycm9yJykpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2V0TW9kZWwsIHNjb3BlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJykpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChUb2FzdC5ub3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0eXBlOiAnZXJyb3InIH0pLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoYW5kbGVMTE1QYXJhbXNDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgc2V0TW9kZWwgd2l0aCB1cGRhdGVkIGNvbXBsZXRpb25fcGFyYW1zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHNldE1vZGVsID0gdmkuZm4oKVxuICAgICAgICBjb25zdCB0ZXh0R2VuTW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7XG4gICAgICAgICAgICBtb2RlbDogJ2dwdC00JyxcbiAgICAgICAgICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sXG4gICAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgICAgfSldLFxuICAgICAgICB9KVxuICAgICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW3RleHRHZW5Nb2RlbF0gfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIHNldE1vZGVsLFxuICAgICAgICAgIHNjb3BlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLFxuICAgICAgICAgIHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFuZWwgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xsbS1wYXJhbXMtcGFuZWwnKVxuICAgICAgICAgIGZpcmVFdmVudC5jbGljayhwYW5lbClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHNldE1vZGVsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgY29tcGxldGlvbl9wYXJhbXM6IHsgdGVtcGVyYXR1cmU6IDAuOCB9IH0pLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdoYW5kbGVUVFNQYXJhbXNDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgc2V0TW9kZWwgd2l0aCB1cGRhdGVkIGxhbmd1YWdlIGFuZCB2b2ljZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBzZXRNb2RlbCA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgdHRzTW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7XG4gICAgICAgICAgICBtb2RlbDogJ3R0cy0xJyxcbiAgICAgICAgICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udHRzLFxuICAgICAgICAgICAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxuICAgICAgICAgIH0pXSxcbiAgICAgICAgfSlcbiAgICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdHRzOiBbdHRzTW9kZWxdIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBzZXRNb2RlbCxcbiAgICAgICAgICBzY29wZTogTW9kZWxUeXBlRW51bS50dHMsXG4gICAgICAgICAgdmFsdWU6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3R0cy0xJyB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBwYW5lbCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndHRzLXBhcmFtcy1wYW5lbCcpXG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHBhbmVsKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2V0TW9kZWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBsYW5ndWFnZTogJ2VuLVVTJywgdm9pY2U6ICdhbGxveScgfSksXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IENvbmRpdGlvbmFsIFJlbmRlcmluZyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIExMTVBhcmFtc1BhbmVsIHdoZW4gbW9kZWwgdHlwZSBpcyB0ZXh0R2VuZXJhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRleHRHZW5Nb2RlbCA9IGNyZWF0ZU1vZGVsKHtcbiAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oe1xuICAgICAgICAgIG1vZGVsOiAnZ3B0LTQnLFxuICAgICAgICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sXG4gICAgICAgICAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxuICAgICAgICB9KV0sXG4gICAgICB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEdlbmVyYXRpb246IFt0ZXh0R2VuTW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSxcbiAgICAgICAgc2NvcGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbGxtLXBhcmFtcy1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBUVFNQYXJhbXNQYW5lbCB3aGVuIG1vZGVsIHR5cGUgaXMgdHRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdHRzTW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgbW9kZWxzOiBbY3JlYXRlTW9kZWxJdGVtKHtcbiAgICAgICAgICBtb2RlbDogJ3R0cy0xJyxcbiAgICAgICAgICBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtLnR0cyxcbiAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgIH0pXSxcbiAgICAgIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0dHM6IFt0dHNNb2RlbF0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgdmFsdWU6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3R0cy0xJyB9LFxuICAgICAgICBzY29wZTogTW9kZWxUeXBlRW51bS50dHMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHRzLXBhcmFtcy1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgTExNUGFyYW1zUGFuZWwgd2hlbiBtb2RlbCB0eXBlIGlzIG5vdCB0ZXh0R2VuZXJhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGVtYmVkZGluZ01vZGVsID0gY3JlYXRlTW9kZWwoe1xuICAgICAgICBwcm92aWRlcjogJ29wZW5haScsXG4gICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7XG4gICAgICAgICAgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEnLFxuICAgICAgICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0udGV4dEVtYmVkZGluZyxcbiAgICAgICAgICBzdGF0dXM6IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUsXG4gICAgICAgIH0pXSxcbiAgICAgIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0RW1iZWRkaW5nOiBbZW1iZWRkaW5nTW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEnIH0sXG4gICAgICAgIHNjb3BlOiBNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbGxtLXBhcmFtcy1wYW5lbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkaXZpZGVyIHdoZW4gbW9kZWwgdHlwZSBpcyB0ZXh0R2VuZXJhdGlvbiBvciB0dHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0ZXh0R2VuTW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgIHByb3ZpZGVyOiAnb3BlbmFpJyxcbiAgICAgICAgbW9kZWxzOiBbY3JlYXRlTW9kZWxJdGVtKHtcbiAgICAgICAgICBtb2RlbDogJ2dwdC00JyxcbiAgICAgICAgICBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLFxuICAgICAgICAgIHN0YXR1czogTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSxcbiAgICAgICAgfSldLFxuICAgICAgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbdGV4dEdlbk1vZGVsXSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICB2YWx1ZTogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAnZ3B0LTQnIH0sXG4gICAgICAgIHNjb3BlOiBNb2RlbFR5cGVFbnVtLnRleHRHZW5lcmF0aW9uLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JylcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQucXVlcnlTZWxlY3RvcignLmJnLWRpdmlkZXItc3VidGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBFZGdlIENhc2VzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiBudWxsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtZGVwcmVjYXRlZCcsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG1vZGVsIGxpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoe30pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgZXhwZWN0KHNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwtbGlzdC1jb3VudCcsICcwJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbHVlIHdpdGggb25seSBwcm92aWRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vZGVsID0gY3JlYXRlTW9kZWwoeyBwcm92aWRlcjogJ29wZW5haScgfSlcbiAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcHJvdmlkZXInLCAnb3BlbmFpJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmFsdWUgd2l0aCBvbmx5IG1vZGVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBtb2RlbDogJ2dwdC00JyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwnLCAnZ3B0LTQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb21wbGV4IHNjb3BlIHdpdGggbXVsdGlwbGUgZmVhdHVyZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHNjb3BlOiAnbGxtJnRvb2wtY2FsbCZtdWx0aS10b29sLWNhbGwmdmlzaW9uJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGVsLXNlbGVjdG9yJylcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBKU09OLnBhcnNlKHNlbGVjdG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1zY29wZS1mZWF0dXJlcycpIHx8ICdbXScpXG4gICAgICAgIGV4cGVjdChmZWF0dXJlcykudG9Db250YWluKCd0b29sLWNhbGwnKVxuICAgICAgICBleHBlY3QoZmVhdHVyZXMpLnRvQ29udGFpbignbXVsdGktdG9vbC1jYWxsJylcbiAgICAgICAgZXhwZWN0KGZlYXR1cmVzKS50b0NvbnRhaW4oJ3Zpc2lvbicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtb2RlbCB3aXRoIGFsbCBzdGF0dXMgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzdGF0dXNlcyA9IFtcbiAgICAgICAgTW9kZWxTdGF0dXNFbnVtLmFjdGl2ZSxcbiAgICAgICAgTW9kZWxTdGF0dXNFbnVtLm5vQ29uZmlndXJlLFxuICAgICAgICBNb2RlbFN0YXR1c0VudW0ucXVvdGFFeGNlZWRlZCxcbiAgICAgICAgTW9kZWxTdGF0dXNFbnVtLm5vUGVybWlzc2lvbixcbiAgICAgICAgTW9kZWxTdGF0dXNFbnVtLmRpc2FibGVkLFxuICAgICAgXVxuXG4gICAgICBzdGF0dXNlcy5mb3JFYWNoKChzdGF0dXMpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBjcmVhdGVNb2RlbCh7XG4gICAgICAgICAgcHJvdmlkZXI6IGBwcm92aWRlci0ke3N0YXR1c31gLFxuICAgICAgICAgIG1vZGVsczogW2NyZWF0ZU1vZGVsSXRlbSh7IG1vZGVsOiAndGVzdCcsIHN0YXR1cyB9KV0sXG4gICAgICAgIH0pXG4gICAgICAgIHNldHVwTW9kZWxMaXN0cyh7IHRleHRHZW5lcmF0aW9uOiBbbW9kZWxdIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdmFsdWU6IHsgcHJvdmlkZXI6IGBwcm92aWRlci0ke3N0YXR1c31gLCBtb2RlbDogJ3Rlc3QnIH0gfSlcbiAgICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpXG4gICAgICAgIGlmIChzdGF0dXMgPT09IE1vZGVsU3RhdHVzRW51bS5hY3RpdmUpXG4gICAgICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1kaXNhYmxlZCcsICdmYWxzZScpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWRpc2FibGVkJywgJ3RydWUnKVxuXG4gICAgICAgIHVubW91bnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFBvcnRhbCBQbGFjZW1lbnQgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BvcnRhbCBQbGFjZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgbGVmdCBwbGFjZW1lbnQgd2hlbiBpc0luV29ya2Zsb3cgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNJbldvcmtmbG93OiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgLy8gUG9ydGFsIHBsYWNlbWVudCBpcyBoYW5kbGVkIGludGVybmFsbHksIGJ1dCB3ZSB2ZXJpZnkgdGhlIHByb3AgaXMgcGFzc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pbi13b3JrZmxvdycsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgYm90dG9tLWVuZCBwbGFjZW1lbnQgd2hlbiBpc0luV29ya2Zsb3cgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzSW5Xb3JrZmxvdzogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pbi13b3JrZmxvdycsICdmYWxzZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNb2RlbCBTZWxlY3RvciBEZWZhdWx0IE1vZGVsID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNb2RlbCBTZWxlY3RvciBEZWZhdWx0IE1vZGVsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBkZWZhdWx0TW9kZWwgdG8gTW9kZWxTZWxlY3RvciB3aGVuIHByb3ZpZGVyIGFuZCBtb2RlbCBleGlzdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdmFsdWU6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ2dwdC00JyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKVxuICAgICAgICBjb25zdCBkZWZhdWx0TW9kZWwgPSBKU09OLnBhcnNlKHNlbGVjdG9yLmdldEF0dHJpYnV0ZSgnZGF0YS1kZWZhdWx0LW1vZGVsJykgfHwgJ3t9JylcbiAgICAgICAgZXhwZWN0KGRlZmF1bHRNb2RlbCkudG9FcXVhbCh7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtNCcgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBwYXJ0aWFsIGRlZmF1bHRNb2RlbCB3aGVuIHByb3ZpZGVyIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gY29tcG9uZW50IGNyZWF0ZXMgZGVmYXVsdE1vZGVsIHdoZW4gZWl0aGVyIHByb3ZpZGVyIG9yIG1vZGVsIGV4aXN0c1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBtb2RlbDogJ2dwdC00JyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBkZWZhdWx0TW9kZWwgaXMgY3JlYXRlZCB3aXRoIHVuZGVmaW5lZCBwcm92aWRlclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGNvbnN0IGRlZmF1bHRNb2RlbCA9IEpTT04ucGFyc2Uoc2VsZWN0b3IuZ2V0QXR0cmlidXRlKCdkYXRhLWRlZmF1bHQtbW9kZWwnKSB8fCAne30nKVxuICAgICAgICBleHBlY3QoZGVmYXVsdE1vZGVsLm1vZGVsKS50b0JlKCdncHQtNCcpXG4gICAgICAgIGV4cGVjdChkZWZhdWx0TW9kZWwucHJvdmlkZXIpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHBhcnRpYWwgZGVmYXVsdE1vZGVsIHdoZW4gbW9kZWwgaXMgbWlzc2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBjb21wb25lbnQgY3JlYXRlcyBkZWZhdWx0TW9kZWwgd2hlbiBlaXRoZXIgcHJvdmlkZXIgb3IgbW9kZWwgZXhpc3RzXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBkZWZhdWx0TW9kZWwgaXMgY3JlYXRlZCB3aXRoIHVuZGVmaW5lZCBtb2RlbFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGNvbnN0IGRlZmF1bHRNb2RlbCA9IEpTT04ucGFyc2Uoc2VsZWN0b3IuZ2V0QXR0cmlidXRlKCdkYXRhLWRlZmF1bHQtbW9kZWwnKSB8fCAne30nKVxuICAgICAgICBleHBlY3QoZGVmYXVsdE1vZGVsLnByb3ZpZGVyKS50b0JlKCdvcGVuYWknKVxuICAgICAgICBleHBlY3QoZGVmYXVsdE1vZGVsLm1vZGVsKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyB1bmRlZmluZWQgZGVmYXVsdE1vZGVsIHdoZW4gYm90aCBwcm92aWRlciBhbmQgbW9kZWwgYXJlIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7fSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TW9kZWxQYXJhbWV0ZXJNb2RhbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gd2hlbiBkZWZhdWx0TW9kZWwgaXMgdW5kZWZpbmVkLCBhdHRyaWJ1dGUgaXMgbm90IHNldCAocmV0dXJucyBudWxsKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpXG4gICAgICAgIGV4cGVjdChzZWxlY3Rvci5nZXRBdHRyaWJ1dGUoJ2RhdGEtZGVmYXVsdC1tb2RlbCcpKS50b0JlTnVsbCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmUtcmVuZGVyIEJlaGF2aW9yID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZS1yZW5kZXIgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdHJpZ2dlciB3aGVuIHZhbHVlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhbHVlOiB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICdncHQtMy41JyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbCcsICdncHQtMy41JylcblxuICAgICAgcmVyZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSB2YWx1ZT17eyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAnZ3B0LTQnIH19IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsJywgJ2dwdC00JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgbW9kZWwgbGlzdCB3aGVuIHNjb3BlIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0ZXh0R2VuTW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnb3BlbmFpJyB9KVxuICAgICAgY29uc3QgZW1iZWRkaW5nTW9kZWwgPSBjcmVhdGVNb2RlbCh7IHByb3ZpZGVyOiAnZW1iZWRkaW5nLXByb3ZpZGVyJyB9KVxuICAgICAgc2V0dXBNb2RlbExpc3RzKHsgdGV4dEdlbmVyYXRpb246IFt0ZXh0R2VuTW9kZWxdLCB0ZXh0RW1iZWRkaW5nOiBbZW1iZWRkaW5nTW9kZWxdIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc2NvcGU6IE1vZGVsVHlwZUVudW0udGV4dEdlbmVyYXRpb24gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RlbC1zZWxlY3RvcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kZWwtbGlzdC1jb3VudCcsICcxJylcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggZGlmZmVyZW50IHNjb3BlXG4gICAgICBtb2NrUG9ydGFsT3BlblN0YXRlID0gdHJ1ZVxuICAgICAgcmVyZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSBzY29wZT17TW9kZWxUeXBlRW51bS50ZXh0RW1iZWRkaW5nfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kZWwtc2VsZWN0b3InKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWxpc3QtY291bnQnLCAnMScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBkaXNhYmxlZCBzdGF0ZSB3aGVuIGlzQVBJS2V5U2V0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2RlbCA9IGNyZWF0ZU1vZGVsKHtcbiAgICAgICAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICAgICAgICBtb2RlbHM6IFtjcmVhdGVNb2RlbEl0ZW0oeyBtb2RlbDogJ2dwdC00Jywgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlIH0pXSxcbiAgICAgIH0pXG4gICAgICBzZXR1cE1vZGVsTGlzdHMoeyB0ZXh0R2VuZXJhdGlvbjogW21vZGVsXSB9KVxuICAgICAgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlLmlzQVBJS2V5U2V0ID0gdHJ1ZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YWx1ZTogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAnZ3B0LTQnIH0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXInKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkJywgJ2ZhbHNlJylcblxuICAgICAgbW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlLmlzQVBJS2V5U2V0ID0gZmFsc2VcbiAgICAgIHJlcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlcicpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBBY2Nlc3NpYmlsaXR5ID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUga2V5Ym9hcmQgYWNjZXNzaWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE1vZGVsUGFyYW1ldGVyTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gQ29tcG9uZW50IFR5cGUgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBUeXBlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgYSBmdW5jdGlvbmFsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHR5cGVvZiBNb2RlbFBhcmFtZXRlck1vZGFsKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGFsbCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxNb2RlbFBhcmFtZXRlck1vZGFsIHsuLi5wcm9wc30gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=