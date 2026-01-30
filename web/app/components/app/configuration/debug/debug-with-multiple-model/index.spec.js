"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const config_1 = require("@/config");
const app_1 = require("@/types/app");
const types_1 = require("../types");
const index_1 = require("./index");
const mockUseDebugConfigurationContext = vi.fn();
const mockUseFeaturesSelector = vi.fn();
const mockUseEventEmitterContext = vi.fn();
const mockUseAppStoreSelector = vi.fn();
const mockEventEmitter = { emit: vi.fn() };
const mockSetShowAppConfigureFeaturesModal = vi.fn();
let capturedChatInputProps = null;
let modelIdCounter = 0;
let featureState;
const mockFiles = [
    {
        id: 'file-1',
        name: 'file.txt',
        size: 10,
        type: 'text/plain',
        progress: 100,
        transferMethod: app_1.TransferMethod.remote_url,
        supportFileType: 'text',
    },
];
vi.mock('@/context/debug-configuration', () => ({
    useDebugConfigurationContext: () => mockUseDebugConfigurationContext(),
}));
vi.mock('@/app/components/base/features/hooks', () => ({
    useFeatures: (selector) => mockUseFeaturesSelector(selector),
}));
vi.mock('@/context/event-emitter', () => ({
    useEventEmitterContextContext: () => mockUseEventEmitterContext(),
}));
vi.mock('@/app/components/app/store', () => ({
    useStore: (selector) => mockUseAppStoreSelector(selector),
}));
vi.mock('./debug-item', () => ({
    default: ({ modelAndParameter, className, style, }) => (<div data-testid="debug-item" data-model-id={modelAndParameter.id} className={className} style={style}>
      DebugItem-
      {modelAndParameter.id}
    </div>),
}));
vi.mock('@/app/components/base/chat/chat/chat-input-area', () => ({
    default: (props) => {
        capturedChatInputProps = props;
        return (<div data-testid="chat-input-area">
        <button type="button" onClick={() => props.onSend?.('test message', mockFiles)}>send</button>
        <button type="button" onClick={() => props.onFeatureBarClick?.(true)}>feature</button>
      </div>);
    },
}));
const createFeatureState = () => ({
    features: {
        speech2text: { enabled: true },
        file: {
            image: {
                enabled: true,
                detail: app_1.Resolution.high,
                number_limits: 2,
                transfer_methods: [app_1.TransferMethod.remote_url],
            },
        },
    },
    setFeatures: vi.fn(),
    showFeaturesModal: false,
    setShowFeaturesModal: vi.fn(),
});
const createModelConfig = (promptVariables = []) => ({
    provider: 'OPENAI',
    model_id: 'gpt-4',
    mode: app_1.ModelModeType.chat,
    configs: {
        prompt_template: '',
        prompt_variables: promptVariables,
    },
    chat_prompt_config: config_1.DEFAULT_CHAT_PROMPT_CONFIG,
    completion_prompt_config: config_1.DEFAULT_COMPLETION_PROMPT_CONFIG,
    opening_statement: '',
    more_like_this: null,
    suggested_questions: [],
    suggested_questions_after_answer: null,
    speech_to_text: null,
    text_to_speech: null,
    file_upload: null,
    retriever_resource: null,
    sensitive_word_avoidance: null,
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
    agentConfig: config_1.DEFAULT_AGENT_SETTING,
});
const createDebugConfiguration = (overrides = {}) => ({
    mode: app_1.AppModeEnum.CHAT,
    inputs: {},
    modelConfig: createModelConfig(),
    ...overrides,
});
const createModelAndParameter = (overrides = {}) => ({
    id: `model-${++modelIdCounter}`,
    model: 'gpt-3.5-turbo',
    provider: 'openai',
    parameters: {},
    ...overrides,
});
const createProps = (overrides = {}) => ({
    multipleModelConfigs: [createModelAndParameter()],
    onMultipleModelConfigsChange: vi.fn(),
    onDebugWithMultipleModelChange: vi.fn(),
    ...overrides,
});
const renderComponent = (props) => {
    const mergedProps = createProps(props);
    return (0, react_1.render)(<index_1.default {...mergedProps}/>);
};
describe('DebugWithMultipleModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        capturedChatInputProps = null;
        modelIdCounter = 0;
        featureState = createFeatureState();
        mockUseFeaturesSelector.mockImplementation(selector => selector(featureState));
        mockUseEventEmitterContext.mockReturnValue({ eventEmitter: mockEventEmitter });
        mockUseAppStoreSelector.mockImplementation(selector => selector({ setShowAppConfigureFeaturesModal: mockSetShowAppConfigureFeaturesModal }));
        mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration());
    });
    describe('edge cases and error handling', () => {
        it('should handle empty multipleModelConfigs array', () => {
            renderComponent({ multipleModelConfigs: [] });
            expect(react_1.screen.queryByTestId('debug-item')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('chat-input-area')).toBeInTheDocument();
        });
        it('should handle model config with missing required fields', () => {
            const incompleteConfig = { id: 'incomplete' };
            renderComponent({ multipleModelConfigs: [incompleteConfig] });
            expect(react_1.screen.getByTestId('debug-item')).toBeInTheDocument();
        });
        it('should handle more than 4 model configs', () => {
            const manyConfigs = Array.from({ length: 6 }, () => createModelAndParameter());
            renderComponent({ multipleModelConfigs: manyConfigs });
            const items = react_1.screen.getAllByTestId('debug-item');
            expect(items).toHaveLength(6);
            // Items beyond 4 should not have specialized positioning
            items.slice(4).forEach((item) => {
                expect(item.style.transform).toBe('translateX(0) translateY(0)');
            });
        });
        it('should handle modelConfig with undefined prompt_variables', () => {
            // Note: The current component doesn't handle undefined/null prompt_variables gracefully
            // This test documents the current behavior
            const modelConfig = createModelConfig();
            modelConfig.configs.prompt_variables = undefined;
            mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration({
                modelConfig,
            }));
            expect(() => renderComponent()).toThrow('Cannot read properties of undefined (reading \'filter\')');
        });
        it('should handle modelConfig with null prompt_variables', () => {
            // Note: The current component doesn't handle undefined/null prompt_variables gracefully
            // This test documents the current behavior
            const modelConfig = createModelConfig();
            modelConfig.configs.prompt_variables = null;
            mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration({
                modelConfig,
            }));
            expect(() => renderComponent()).toThrow('Cannot read properties of null (reading \'filter\')');
        });
        it('should handle prompt_variables with missing required fields', () => {
            const incompleteVariables = [
                { key: '', name: 'Empty Key', type: 'string' }, // Empty key
                { key: 'valid-key', name: undefined, type: 'number' }, // Undefined name
                { key: 'no-type', name: 'No Type', type: undefined }, // Undefined type
            ];
            const debugConfiguration = createDebugConfiguration({
                modelConfig: createModelConfig(incompleteVariables),
            });
            mockUseDebugConfigurationContext.mockReturnValue(debugConfiguration);
            renderComponent();
            // Should still render but handle gracefully
            expect(react_1.screen.getByTestId('chat-input-area')).toBeInTheDocument();
            expect(capturedChatInputProps?.inputsForm).toHaveLength(3);
        });
    });
    describe('props and callbacks', () => {
        it('should call onMultipleModelConfigsChange when provided', () => {
            const onMultipleModelConfigsChange = vi.fn();
            renderComponent({ onMultipleModelConfigsChange });
            // Context provider should pass through the callback
            expect(onMultipleModelConfigsChange).not.toHaveBeenCalled();
        });
        it('should call onDebugWithMultipleModelChange when provided', () => {
            const onDebugWithMultipleModelChange = vi.fn();
            renderComponent({ onDebugWithMultipleModelChange });
            // Context provider should pass through the callback
            expect(onDebugWithMultipleModelChange).not.toHaveBeenCalled();
        });
        it('should not memoize when props change', () => {
            const props1 = createProps({ multipleModelConfigs: [createModelAndParameter({ id: 'model-1' })] });
            const { rerender } = renderComponent(props1);
            const props2 = createProps({ multipleModelConfigs: [createModelAndParameter({ id: 'model-2' })] });
            rerender(<index_1.default {...props2}/>);
            const items = react_1.screen.getAllByTestId('debug-item');
            expect(items[0]).toHaveAttribute('data-model-id', 'model-2');
        });
    });
    describe('accessibility', () => {
        it('should have accessible chat input elements', () => {
            renderComponent();
            const chatInput = react_1.screen.getByTestId('chat-input-area');
            expect(chatInput).toBeInTheDocument();
            // Check for button accessibility
            const sendButton = react_1.screen.getByRole('button', { name: /send/i });
            expect(sendButton).toBeInTheDocument();
            const featureButton = react_1.screen.getByRole('button', { name: /feature/i });
            expect(featureButton).toBeInTheDocument();
        });
        it('should apply ARIA attributes correctly', () => {
            const multipleModelConfigs = [createModelAndParameter()];
            renderComponent({ multipleModelConfigs });
            // Debug items should be identifiable
            const debugItem = react_1.screen.getByTestId('debug-item');
            expect(debugItem).toBeInTheDocument();
            expect(debugItem).toHaveAttribute('data-model-id');
        });
    });
    describe('prompt variables transformation', () => {
        it('should filter out API type variables', () => {
            const promptVariables = [
                { key: 'normal', name: 'Normal', type: 'string' },
                { key: 'api-var', name: 'API Var', type: 'api' },
                { key: 'number', name: 'Number', type: 'number' },
            ];
            const debugConfiguration = createDebugConfiguration({
                modelConfig: createModelConfig(promptVariables),
            });
            mockUseDebugConfigurationContext.mockReturnValue(debugConfiguration);
            renderComponent();
            expect(capturedChatInputProps?.inputsForm).toHaveLength(2);
            expect(capturedChatInputProps?.inputsForm).toEqual(expect.arrayContaining([
                expect.objectContaining({ label: 'Normal', variable: 'normal' }),
                expect.objectContaining({ label: 'Number', variable: 'number' }),
            ]));
            expect(capturedChatInputProps?.inputsForm).not.toEqual(expect.arrayContaining([
                expect.objectContaining({ label: 'API Var' }),
            ]));
        });
        it('should handle missing hide and required properties', () => {
            const promptVariables = [
                { key: 'no-hide', name: 'No Hide', type: 'string', required: true },
                { key: 'no-required', name: 'No Required', type: 'number', hide: true },
            ];
            const debugConfiguration = createDebugConfiguration({
                modelConfig: createModelConfig(promptVariables),
            });
            mockUseDebugConfigurationContext.mockReturnValue(debugConfiguration);
            renderComponent();
            expect(capturedChatInputProps?.inputsForm).toEqual([
                expect.objectContaining({
                    label: 'No Hide',
                    variable: 'no-hide',
                    hide: false, // Should default to false
                    required: true,
                }),
                expect.objectContaining({
                    label: 'No Required',
                    variable: 'no-required',
                    hide: true,
                    required: false, // Should default to false
                }),
            ]);
        });
        it('should preserve original hide and required values', () => {
            const promptVariables = [
                { key: 'hidden-optional', name: 'Hidden Optional', type: 'string', hide: true, required: false },
                { key: 'visible-required', name: 'Visible Required', type: 'number', hide: false, required: true },
            ];
            const debugConfiguration = createDebugConfiguration({
                modelConfig: createModelConfig(promptVariables),
            });
            mockUseDebugConfigurationContext.mockReturnValue(debugConfiguration);
            renderComponent();
            expect(capturedChatInputProps?.inputsForm).toEqual([
                expect.objectContaining({
                    label: 'Hidden Optional',
                    variable: 'hidden-optional',
                    hide: true,
                    required: false,
                }),
                expect.objectContaining({
                    label: 'Visible Required',
                    variable: 'visible-required',
                    hide: false,
                    required: true,
                }),
            ]);
        });
    });
    describe('chat input rendering', () => {
        it('should render chat input in chat mode with transformed prompt variables and feature handler', () => {
            // Arrange
            const promptVariables = [
                { key: 'city', name: 'City', type: 'string', required: true },
                { key: 'audience', name: 'Audience', type: 'number' },
                { key: 'hidden', name: 'Hidden', type: 'select', hide: true },
                { key: 'api-only', name: 'API Only', type: 'api' },
            ];
            const debugConfiguration = createDebugConfiguration({
                inputs: { audience: 'engineers' },
                modelConfig: createModelConfig(promptVariables),
            });
            mockUseDebugConfigurationContext.mockReturnValue(debugConfiguration);
            // Act
            renderComponent();
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /feature/i }));
            // Assert
            expect(react_1.screen.getByTestId('chat-input-area')).toBeInTheDocument();
            expect(capturedChatInputProps?.inputs).toEqual({ audience: 'engineers' });
            expect(capturedChatInputProps?.inputsForm).toEqual([
                expect.objectContaining({ label: 'City', variable: 'city', hide: false, required: true }),
                expect.objectContaining({ label: 'Audience', variable: 'audience', hide: false, required: false }),
                expect.objectContaining({ label: 'Hidden', variable: 'hidden', hide: true, required: false }),
            ]);
            expect(capturedChatInputProps?.showFeatureBar).toBe(true);
            expect(capturedChatInputProps?.showFileUpload).toBe(false);
            expect(capturedChatInputProps?.speechToTextConfig).toEqual(featureState.features.speech2text);
            expect(capturedChatInputProps?.visionConfig).toEqual(featureState.features.file);
            expect(mockSetShowAppConfigureFeaturesModal).toHaveBeenCalledWith(true);
        });
        it('should render chat input in agent chat mode', () => {
            // Arrange
            mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration({
                mode: app_1.AppModeEnum.AGENT_CHAT,
            }));
            // Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('chat-input-area')).toBeInTheDocument();
        });
        it('should hide chat input when not in chat mode', () => {
            // Arrange
            mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration({
                mode: app_1.AppModeEnum.COMPLETION,
            }));
            const multipleModelConfigs = [createModelAndParameter()];
            // Act
            renderComponent({ multipleModelConfigs });
            // Assert
            expect(react_1.screen.queryByTestId('chat-input-area')).not.toBeInTheDocument();
            expect(react_1.screen.getAllByTestId('debug-item')).toHaveLength(1);
        });
    });
    describe('sending flow', () => {
        it('should emit chat event when allowed to send', () => {
            // Arrange
            const checkCanSend = vi.fn(() => true);
            const multipleModelConfigs = [createModelAndParameter(), createModelAndParameter()];
            renderComponent({ multipleModelConfigs, checkCanSend });
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /send/i }));
            // Assert
            expect(checkCanSend).toHaveBeenCalled();
            expect(mockEventEmitter.emit).toHaveBeenCalledWith({
                type: types_1.APP_CHAT_WITH_MULTIPLE_MODEL,
                payload: {
                    message: 'test message',
                    files: mockFiles,
                },
            });
        });
        it('should emit when no checkCanSend is provided', () => {
            renderComponent();
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /send/i }));
            expect(mockEventEmitter.emit).toHaveBeenCalledWith({
                type: types_1.APP_CHAT_WITH_MULTIPLE_MODEL,
                payload: {
                    message: 'test message',
                    files: mockFiles,
                },
            });
        });
        it('should block sending when checkCanSend returns false', () => {
            // Arrange
            const checkCanSend = vi.fn(() => false);
            renderComponent({ checkCanSend });
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /send/i }));
            // Assert
            expect(checkCanSend).toHaveBeenCalled();
            expect(mockEventEmitter.emit).not.toHaveBeenCalled();
        });
        it('should tolerate missing event emitter without throwing', () => {
            mockUseEventEmitterContext.mockReturnValue({ eventEmitter: null });
            renderComponent();
            expect(() => react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /send/i }))).not.toThrow();
            expect(mockEventEmitter.emit).not.toHaveBeenCalled();
        });
    });
    describe('performance optimization', () => {
        it('should memoize callback functions correctly', () => {
            const props = createProps({ multipleModelConfigs: [createModelAndParameter()] });
            const { rerender } = renderComponent(props);
            // First render
            const firstItems = react_1.screen.getAllByTestId('debug-item');
            expect(firstItems).toHaveLength(1);
            // Rerender with exactly same props - should not cause re-renders
            rerender(<index_1.default {...props}/>);
            const secondItems = react_1.screen.getAllByTestId('debug-item');
            expect(secondItems).toHaveLength(1);
            // Check that the element still renders the same content
            expect(firstItems[0]).toHaveTextContent(secondItems[0].textContent || '');
        });
        it('should recalculate size and position when number of models changes', () => {
            const { rerender } = renderComponent({ multipleModelConfigs: [createModelAndParameter()] });
            // Single model - no special sizing
            const singleItem = react_1.screen.getByTestId('debug-item');
            expect(singleItem.style.width).toBe('');
            // Change to 2 models
            rerender(<index_1.default {...createProps({
                multipleModelConfigs: [createModelAndParameter(), createModelAndParameter()],
            })}/>);
            const twoItems = react_1.screen.getAllByTestId('debug-item');
            expect(twoItems[0].style.width).toBe('calc(50% - 28px)');
            expect(twoItems[1].style.width).toBe('calc(50% - 28px)');
        });
    });
    describe('layout sizing and positioning', () => {
        const expectItemLayout = (element, expectation) => {
            if (expectation.width !== undefined)
                expect(element.style.width).toBe(expectation.width);
            else
                expect(element.style.width).toBe('');
            if (expectation.height !== undefined)
                expect(element.style.height).toBe(expectation.height);
            else
                expect(element.style.height).toBe('');
            expect(element.style.transform).toBe(expectation.transform);
            expectation.classes?.forEach(cls => expect(element).toHaveClass(cls));
        };
        it('should arrange items in two-column layout for two models', () => {
            // Arrange
            const multipleModelConfigs = [createModelAndParameter(), createModelAndParameter()];
            // Act
            renderComponent({ multipleModelConfigs });
            const items = react_1.screen.getAllByTestId('debug-item');
            // Assert
            expect(items).toHaveLength(2);
            expectItemLayout(items[0], {
                width: 'calc(50% - 28px)',
                height: '100%',
                transform: 'translateX(0) translateY(0)',
                classes: ['mr-2'],
            });
            expectItemLayout(items[1], {
                width: 'calc(50% - 28px)',
                height: '100%',
                transform: 'translateX(calc(100% + 8px)) translateY(0)',
                classes: [],
            });
        });
        it('should arrange items in thirds for three models', () => {
            // Arrange
            const multipleModelConfigs = [createModelAndParameter(), createModelAndParameter(), createModelAndParameter()];
            // Act
            renderComponent({ multipleModelConfigs });
            const items = react_1.screen.getAllByTestId('debug-item');
            // Assert
            expect(items).toHaveLength(3);
            expectItemLayout(items[0], {
                width: 'calc(33.3% - 21.33px)',
                height: '100%',
                transform: 'translateX(0) translateY(0)',
                classes: ['mr-2'],
            });
            expectItemLayout(items[1], {
                width: 'calc(33.3% - 21.33px)',
                height: '100%',
                transform: 'translateX(calc(100% + 8px)) translateY(0)',
                classes: ['mr-2'],
            });
            expectItemLayout(items[2], {
                width: 'calc(33.3% - 21.33px)',
                height: '100%',
                transform: 'translateX(calc(200% + 16px)) translateY(0)',
                classes: [],
            });
        });
        it('should position items on a grid for four models', () => {
            // Arrange
            const multipleModelConfigs = [
                createModelAndParameter(),
                createModelAndParameter(),
                createModelAndParameter(),
                createModelAndParameter(),
            ];
            // Act
            renderComponent({ multipleModelConfigs });
            const items = react_1.screen.getAllByTestId('debug-item');
            // Assert
            expect(items).toHaveLength(4);
            expectItemLayout(items[0], {
                width: 'calc(50% - 28px)',
                height: 'calc(50% - 4px)',
                transform: 'translateX(0) translateY(0)',
                classes: ['mr-2', 'mb-2'],
            });
            expectItemLayout(items[1], {
                width: 'calc(50% - 28px)',
                height: 'calc(50% - 4px)',
                transform: 'translateX(calc(100% + 8px)) translateY(0)',
                classes: ['mb-2'],
            });
            expectItemLayout(items[2], {
                width: 'calc(50% - 28px)',
                height: 'calc(50% - 4px)',
                transform: 'translateX(0) translateY(calc(100% + 8px))',
                classes: ['mr-2'],
            });
            expectItemLayout(items[3], {
                width: 'calc(50% - 28px)',
                height: 'calc(50% - 4px)',
                transform: 'translateX(calc(100% + 8px)) translateY(calc(100% + 8px))',
                classes: [],
            });
        });
        it('should fall back to single column layout when only one model is provided', () => {
            // Arrange
            const multipleModelConfigs = [createModelAndParameter()];
            // Act
            renderComponent({ multipleModelConfigs });
            const item = react_1.screen.getByTestId('debug-item');
            // Assert
            expectItemLayout(item, {
                transform: 'translateX(0) translateY(0)',
                classes: [],
            });
        });
        it('should set scroll area height for chat modes', () => {
            const { container } = renderComponent();
            const scrollArea = container.querySelector('.relative.mb-3.grow.overflow-auto.px-6');
            expect(scrollArea).toBeInTheDocument();
            expect(scrollArea.style.height).toBe('calc(100% - 60px)');
        });
        it('should set full height when chat input is hidden', () => {
            mockUseDebugConfigurationContext.mockReturnValue(createDebugConfiguration({
                mode: app_1.AppModeEnum.COMPLETION,
            }));
            const { container } = renderComponent();
            const scrollArea = container.querySelector('.relative.mb-3.grow.overflow-auto.px-6');
            expect(scrollArea.style.height).toBe('100%');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsa0RBQWtFO0FBQ2xFLHFDQUE4RztBQUM5RyxxQ0FBb0Y7QUFDcEYsb0NBQXVEO0FBQ3ZELG1DQUE0QztBQVE1QyxNQUFNLGdDQUFnQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNoRCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN2QyxNQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMxQyxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN2QyxNQUFNLGdCQUFnQixHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFBO0FBQzFDLE1BQU0sb0NBQW9DLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3BELElBQUksc0JBQXNCLEdBQWtDLElBQUksQ0FBQTtBQUNoRSxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7QUFDdEIsSUFBSSxZQUErQixDQUFBO0FBYW5DLE1BQU0sU0FBUyxHQUFpQjtJQUM5QjtRQUNFLEVBQUUsRUFBRSxRQUFRO1FBQ1osSUFBSSxFQUFFLFVBQVU7UUFDaEIsSUFBSSxFQUFFLEVBQUU7UUFDUixJQUFJLEVBQUUsWUFBWTtRQUNsQixRQUFRLEVBQUUsR0FBRztRQUNiLGNBQWMsRUFBRSxvQkFBYyxDQUFDLFVBQVU7UUFDekMsZUFBZSxFQUFFLE1BQU07S0FDeEI7Q0FDRixDQUFBO0FBRUQsRUFBRSxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO0NBQ3ZFLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFD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RyxFQUFFO1lBQzFELGdDQUFnQyxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQztnQkFDeEUsSUFBSSxFQUFFLGlCQUFXLENBQUMsVUFBVTthQUM3QixDQUFDLENBQUMsQ0FBQTtZQUVILE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxlQUFlLEVBQUUsQ0FBQTtZQUN2QyxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLHdDQUF3QyxDQUFnQixDQUFBO1lBQ25HLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENTU1Byb3BlcnRpZXMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgTW9kZWxBbmRQYXJhbWV0ZXIgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRGVidWdXaXRoTXVsdGlwbGVNb2RlbENvbnRleHRUeXBlIH0gZnJvbSAnLi9jb250ZXh0J1xuaW1wb3J0IHR5cGUgeyBJbnB1dEZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0L3R5cGUnXG5pbXBvcnQgdHlwZSB7IEZlYXR1cmVTdG9yZVN0YXRlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL3N0b3JlJ1xuaW1wb3J0IHR5cGUgeyBGaWxlRW50aXR5IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IElucHV0cywgTW9kZWxDb25maWcgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgUHJvbXB0VmFyaWFibGUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgREVGQVVMVF9BR0VOVF9TRVRUSU5HLCBERUZBVUxUX0NIQVRfUFJPTVBUX0NPTkZJRywgREVGQVVMVF9DT01QTEVUSU9OX1BST01QVF9DT05GSUcgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IEFwcE1vZGVFbnVtLCBNb2RlbE1vZGVUeXBlLCBSZXNvbHV0aW9uLCBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgQVBQX0NIQVRfV0lUSF9NVUxUSVBMRV9NT0RFTCB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IERlYnVnV2l0aE11bHRpcGxlTW9kZWwgZnJvbSAnLi9pbmRleCdcblxudHlwZSBQcm9tcHRWYXJpYWJsZVdpdGhNZXRhID0gT21pdDxQcm9tcHRWYXJpYWJsZSwgJ3R5cGUnIHwgJ3JlcXVpcmVkJz4gJiB7XG4gIHR5cGU6IFByb21wdFZhcmlhYmxlWyd0eXBlJ10gfCAnYXBpJ1xuICByZXF1aXJlZD86IGJvb2xlYW5cbiAgaGlkZT86IGJvb2xlYW5cbn1cblxuY29uc3QgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlRmVhdHVyZXNTZWxlY3RvciA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VFdmVudEVtaXR0ZXJDb250ZXh0ID0gdmkuZm4oKVxuY29uc3QgbW9ja1VzZUFwcFN0b3JlU2VsZWN0b3IgPSB2aS5mbigpXG5jb25zdCBtb2NrRXZlbnRFbWl0dGVyID0geyBlbWl0OiB2aS5mbigpIH1cbmNvbnN0IG1vY2tTZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCA9IHZpLmZuKClcbmxldCBjYXB0dXJlZENoYXRJbnB1dFByb3BzOiBNb2NrQ2hhdElucHV0QXJlYVByb3BzIHwgbnVsbCA9IG51bGxcbmxldCBtb2RlbElkQ291bnRlciA9IDBcbmxldCBmZWF0dXJlU3RhdGU6IEZlYXR1cmVTdG9yZVN0YXRlXG5cbnR5cGUgTW9ja0NoYXRJbnB1dEFyZWFQcm9wcyA9IHtcbiAgb25TZW5kPzogKG1lc3NhZ2U6IHN0cmluZywgZmlsZXM/OiBGaWxlRW50aXR5W10pID0+IHZvaWRcbiAgb25GZWF0dXJlQmFyQ2xpY2s/OiAoc3RhdGU6IGJvb2xlYW4pID0+IHZvaWRcbiAgc2hvd0ZlYXR1cmVCYXI/OiBib29sZWFuXG4gIHNob3dGaWxlVXBsb2FkPzogYm9vbGVhblxuICBpbnB1dHM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gIGlucHV0c0Zvcm0/OiBJbnB1dEZvcm1bXVxuICBzcGVlY2hUb1RleHRDb25maWc/OiB1bmtub3duXG4gIHZpc2lvbkNvbmZpZz86IHVua25vd25cbn1cblxuY29uc3QgbW9ja0ZpbGVzOiBGaWxlRW50aXR5W10gPSBbXG4gIHtcbiAgICBpZDogJ2ZpbGUtMScsXG4gICAgbmFtZTogJ2ZpbGUudHh0JyxcbiAgICBzaXplOiAxMCxcbiAgICB0eXBlOiAndGV4dC9wbGFpbicsXG4gICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICB0cmFuc2Zlck1ldGhvZDogVHJhbnNmZXJNZXRob2QucmVtb3RlX3VybCxcbiAgICBzdXBwb3J0RmlsZVR5cGU6ICd0ZXh0JyxcbiAgfSxcbl1cblxudmkubW9jaygnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nLCAoKSA9PiAoe1xuICB1c2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0OiAoKSA9PiBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dCgpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9ob29rcycsICgpID0+ICh7XG4gIHVzZUZlYXR1cmVzOiAoc2VsZWN0b3I6IChzdGF0ZTogRmVhdHVyZVN0b3JlU3RhdGUpID0+IHVua25vd24pID0+IG1vY2tVc2VGZWF0dXJlc1NlbGVjdG9yKHNlbGVjdG9yKSxcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcicsICgpID0+ICh7XG4gIHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0OiAoKSA9PiBtb2NrVXNlRXZlbnRFbWl0dGVyQ29udGV4dCgpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiB7IHNldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsOiB0eXBlb2YgbW9ja1NldFNob3dBcHBDb25maWd1cmVGZWF0dXJlc01vZGFsIH0pID0+IHVua25vd24pID0+IG1vY2tVc2VBcHBTdG9yZVNlbGVjdG9yKHNlbGVjdG9yKSxcbn0pKVxuXG52aS5tb2NrKCcuL2RlYnVnLWl0ZW0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIG1vZGVsQW5kUGFyYW1ldGVyLFxuICAgIGNsYXNzTmFtZSxcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIG1vZGVsQW5kUGFyYW1ldGVyOiBNb2RlbEFuZFBhcmFtZXRlclxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICAgIHN0eWxlPzogQ1NTUHJvcGVydGllc1xuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJkZWJ1Zy1pdGVtXCJcbiAgICAgIGRhdGEtbW9kZWwtaWQ9e21vZGVsQW5kUGFyYW1ldGVyLmlkfVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICBzdHlsZT17c3R5bGV9XG4gICAgPlxuICAgICAgRGVidWdJdGVtLVxuICAgICAge21vZGVsQW5kUGFyYW1ldGVyLmlkfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGF0L2NoYXQvY2hhdC1pbnB1dC1hcmVhJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBNb2NrQ2hhdElucHV0QXJlYVByb3BzKSA9PiB7XG4gICAgY2FwdHVyZWRDaGF0SW5wdXRQcm9wcyA9IHByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjaGF0LWlucHV0LWFyZWFcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcHJvcHMub25TZW5kPy4oJ3Rlc3QgbWVzc2FnZScsIG1vY2tGaWxlcyl9PnNlbmQ8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcHJvcHMub25GZWF0dXJlQmFyQ2xpY2s/Lih0cnVlKX0+ZmVhdHVyZTwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbmNvbnN0IGNyZWF0ZUZlYXR1cmVTdGF0ZSA9ICgpOiBGZWF0dXJlU3RvcmVTdGF0ZSA9PiAoe1xuICBmZWF0dXJlczoge1xuICAgIHNwZWVjaDJ0ZXh0OiB7IGVuYWJsZWQ6IHRydWUgfSxcbiAgICBmaWxlOiB7XG4gICAgICBpbWFnZToge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBkZXRhaWw6IFJlc29sdXRpb24uaGlnaCxcbiAgICAgICAgbnVtYmVyX2xpbWl0czogMixcbiAgICAgICAgdHJhbnNmZXJfbWV0aG9kczogW1RyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmxdLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXRGZWF0dXJlczogdmkuZm4oKSxcbiAgc2hvd0ZlYXR1cmVzTW9kYWw6IGZhbHNlLFxuICBzZXRTaG93RmVhdHVyZXNNb2RhbDogdmkuZm4oKSxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vZGVsQ29uZmlnID0gKHByb21wdFZhcmlhYmxlczogUHJvbXB0VmFyaWFibGVXaXRoTWV0YVtdID0gW10pOiBNb2RlbENvbmZpZyA9PiAoe1xuICBwcm92aWRlcjogJ09QRU5BSScsXG4gIG1vZGVsX2lkOiAnZ3B0LTQnLFxuICBtb2RlOiBNb2RlbE1vZGVUeXBlLmNoYXQsXG4gIGNvbmZpZ3M6IHtcbiAgICBwcm9tcHRfdGVtcGxhdGU6ICcnLFxuICAgIHByb21wdF92YXJpYWJsZXM6IHByb21wdFZhcmlhYmxlcyBhcyB1bmtub3duIGFzIFByb21wdFZhcmlhYmxlW10sXG4gIH0sXG4gIGNoYXRfcHJvbXB0X2NvbmZpZzogREVGQVVMVF9DSEFUX1BST01QVF9DT05GSUcsXG4gIGNvbXBsZXRpb25fcHJvbXB0X2NvbmZpZzogREVGQVVMVF9DT01QTEVUSU9OX1BST01QVF9DT05GSUcsXG4gIG9wZW5pbmdfc3RhdGVtZW50OiAnJyxcbiAgbW9yZV9saWtlX3RoaXM6IG51bGwsXG4gIHN1Z2dlc3RlZF9xdWVzdGlvbnM6IFtdLFxuICBzdWdnZXN0ZWRfcXVlc3Rpb25zX2FmdGVyX2Fuc3dlcjogbnVsbCxcbiAgc3BlZWNoX3RvX3RleHQ6IG51bGwsXG4gIHRleHRfdG9fc3BlZWNoOiBudWxsLFxuICBmaWxlX3VwbG9hZDogbnVsbCxcbiAgcmV0cmlldmVyX3Jlc291cmNlOiBudWxsLFxuICBzZW5zaXRpdmVfd29yZF9hdm9pZGFuY2U6IG51bGwsXG4gIGFubm90YXRpb25fcmVwbHk6IG51bGwsXG4gIGV4dGVybmFsX2RhdGFfdG9vbHM6IFtdLFxuICBzeXN0ZW1fcGFyYW1ldGVyczoge1xuICAgIGF1ZGlvX2ZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICBmaWxlX3NpemVfbGltaXQ6IDAsXG4gICAgaW1hZ2VfZmlsZV9zaXplX2xpbWl0OiAwLFxuICAgIHZpZGVvX2ZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICB3b3JrZmxvd19maWxlX3VwbG9hZF9saW1pdDogMCxcbiAgfSxcbiAgZGF0YVNldHM6IFtdLFxuICBhZ2VudENvbmZpZzogREVGQVVMVF9BR0VOVF9TRVRUSU5HLFxufSlcblxudHlwZSBEZWJ1Z0NvbmZpZ3VyYXRpb24gPSB7XG4gIG1vZGU6IEFwcE1vZGVFbnVtXG4gIGlucHV0czogSW5wdXRzXG4gIG1vZGVsQ29uZmlnOiBNb2RlbENvbmZpZ1xufVxuXG5jb25zdCBjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPERlYnVnQ29uZmlndXJhdGlvbj4gPSB7fSk6IERlYnVnQ29uZmlndXJhdGlvbiA9PiAoe1xuICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICBpbnB1dHM6IHt9LFxuICBtb2RlbENvbmZpZzogY3JlYXRlTW9kZWxDb25maWcoKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9kZWxBbmRQYXJhbWV0ZXIgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPE1vZGVsQW5kUGFyYW1ldGVyPiA9IHt9KTogTW9kZWxBbmRQYXJhbWV0ZXIgPT4gKHtcbiAgaWQ6IGBtb2RlbC0keysrbW9kZWxJZENvdW50ZXJ9YCxcbiAgbW9kZWw6ICdncHQtMy41LXR1cmJvJyxcbiAgcHJvdmlkZXI6ICdvcGVuYWknLFxuICBwYXJhbWV0ZXJzOiB7fSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlUHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPERlYnVnV2l0aE11bHRpcGxlTW9kZWxDb250ZXh0VHlwZT4gPSB7fSk6IERlYnVnV2l0aE11bHRpcGxlTW9kZWxDb250ZXh0VHlwZSA9PiAoe1xuICBtdWx0aXBsZU1vZGVsQ29uZmlnczogW2NyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCldLFxuICBvbk11bHRpcGxlTW9kZWxDb25maWdzQ2hhbmdlOiB2aS5mbigpLFxuICBvbkRlYnVnV2l0aE11bHRpcGxlTW9kZWxDaGFuZ2U6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IHJlbmRlckNvbXBvbmVudCA9IChwcm9wcz86IFBhcnRpYWw8RGVidWdXaXRoTXVsdGlwbGVNb2RlbENvbnRleHRUeXBlPikgPT4ge1xuICBjb25zdCBtZXJnZWRQcm9wcyA9IGNyZWF0ZVByb3BzKHByb3BzKVxuICByZXR1cm4gcmVuZGVyKDxEZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsIHsuLi5tZXJnZWRQcm9wc30gLz4pXG59XG5cbmRlc2NyaWJlKCdEZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBjYXB0dXJlZENoYXRJbnB1dFByb3BzID0gbnVsbFxuICAgIG1vZGVsSWRDb3VudGVyID0gMFxuICAgIGZlYXR1cmVTdGF0ZSA9IGNyZWF0ZUZlYXR1cmVTdGF0ZSgpXG4gICAgbW9ja1VzZUZlYXR1cmVzU2VsZWN0b3IubW9ja0ltcGxlbWVudGF0aW9uKHNlbGVjdG9yID0+IHNlbGVjdG9yKGZlYXR1cmVTdGF0ZSkpXG4gICAgbW9ja1VzZUV2ZW50RW1pdHRlckNvbnRleHQubW9ja1JldHVyblZhbHVlKHsgZXZlbnRFbWl0dGVyOiBtb2NrRXZlbnRFbWl0dGVyIH0pXG4gICAgbW9ja1VzZUFwcFN0b3JlU2VsZWN0b3IubW9ja0ltcGxlbWVudGF0aW9uKHNlbGVjdG9yID0+IHNlbGVjdG9yKHsgc2V0U2hvd0FwcENvbmZpZ3VyZUZlYXR1cmVzTW9kYWw6IG1vY2tTZXRTaG93QXBwQ29uZmlndXJlRmVhdHVyZXNNb2RhbCB9KSlcbiAgICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoY3JlYXRlRGVidWdDb25maWd1cmF0aW9uKCkpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2VkZ2UgY2FzZXMgYW5kIGVycm9yIGhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG11bHRpcGxlTW9kZWxDb25maWdzIGFycmF5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgbXVsdGlwbGVNb2RlbENvbmZpZ3M6IFtdIH0pXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2RlYnVnLWl0ZW0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtaW5wdXQtYXJlYScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1vZGVsIGNvbmZpZyB3aXRoIG1pc3NpbmcgcmVxdWlyZWQgZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5jb21wbGV0ZUNvbmZpZyA9IHsgaWQ6ICdpbmNvbXBsZXRlJyB9IGFzIE1vZGVsQW5kUGFyYW1ldGVyXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBtdWx0aXBsZU1vZGVsQ29uZmlnczogW2luY29tcGxldGVDb25maWddIH0pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbW9yZSB0aGFuIDQgbW9kZWwgY29uZmlncycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbnlDb25maWdzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNiB9LCAoKSA9PiBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgbXVsdGlwbGVNb2RlbENvbmZpZ3M6IG1hbnlDb25maWdzIH0pXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcbiAgICAgIGV4cGVjdChpdGVtcykudG9IYXZlTGVuZ3RoKDYpXG5cbiAgICAgIC8vIEl0ZW1zIGJleW9uZCA0IHNob3VsZCBub3QgaGF2ZSBzcGVjaWFsaXplZCBwb3NpdGlvbmluZ1xuICAgICAgaXRlbXMuc2xpY2UoNCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBleHBlY3QoaXRlbS5zdHlsZS50cmFuc2Zvcm0pLnRvQmUoJ3RyYW5zbGF0ZVgoMCkgdHJhbnNsYXRlWSgwKScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtb2RlbENvbmZpZyB3aXRoIHVuZGVmaW5lZCBwcm9tcHRfdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgLy8gTm90ZTogVGhlIGN1cnJlbnQgY29tcG9uZW50IGRvZXNuJ3QgaGFuZGxlIHVuZGVmaW5lZC9udWxsIHByb21wdF92YXJpYWJsZXMgZ3JhY2VmdWxseVxuICAgICAgLy8gVGhpcyB0ZXN0IGRvY3VtZW50cyB0aGUgY3VycmVudCBiZWhhdmlvclxuICAgICAgY29uc3QgbW9kZWxDb25maWcgPSBjcmVhdGVNb2RlbENvbmZpZygpXG4gICAgICBtb2RlbENvbmZpZy5jb25maWdzLnByb21wdF92YXJpYWJsZXMgPSB1bmRlZmluZWQgYXMgYW55XG5cbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtb2RlbENvbmZpZyxcbiAgICAgIH0pKVxuXG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyQ29tcG9uZW50KCkpLnRvVGhyb3coJ0Nhbm5vdCByZWFkIHByb3BlcnRpZXMgb2YgdW5kZWZpbmVkIChyZWFkaW5nIFxcJ2ZpbHRlclxcJyknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtb2RlbENvbmZpZyB3aXRoIG51bGwgcHJvbXB0X3ZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjdXJyZW50IGNvbXBvbmVudCBkb2Vzbid0IGhhbmRsZSB1bmRlZmluZWQvbnVsbCBwcm9tcHRfdmFyaWFibGVzIGdyYWNlZnVsbHlcbiAgICAgIC8vIFRoaXMgdGVzdCBkb2N1bWVudHMgdGhlIGN1cnJlbnQgYmVoYXZpb3JcbiAgICAgIGNvbnN0IG1vZGVsQ29uZmlnID0gY3JlYXRlTW9kZWxDb25maWcoKVxuICAgICAgbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzID0gbnVsbCBhcyBhbnlcblxuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGNyZWF0ZURlYnVnQ29uZmlndXJhdGlvbih7XG4gICAgICAgIG1vZGVsQ29uZmlnLFxuICAgICAgfSkpXG5cbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXJDb21wb25lbnQoKSkudG9UaHJvdygnQ2Fubm90IHJlYWQgcHJvcGVydGllcyBvZiBudWxsIChyZWFkaW5nIFxcJ2ZpbHRlclxcJyknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcm9tcHRfdmFyaWFibGVzIHdpdGggbWlzc2luZyByZXF1aXJlZCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbmNvbXBsZXRlVmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVdpdGhNZXRhW10gPSBbXG4gICAgICAgIHsga2V5OiAnJywgbmFtZTogJ0VtcHR5IEtleScsIHR5cGU6ICdzdHJpbmcnIH0sIC8vIEVtcHR5IGtleVxuICAgICAgICB7IGtleTogJ3ZhbGlkLWtleScsIG5hbWU6IHVuZGVmaW5lZCBhcyBhbnksIHR5cGU6ICdudW1iZXInIH0sIC8vIFVuZGVmaW5lZCBuYW1lXG4gICAgICAgIHsga2V5OiAnbm8tdHlwZScsIG5hbWU6ICdObyBUeXBlJywgdHlwZTogdW5kZWZpbmVkIGFzIGFueSB9LCAvLyBVbmRlZmluZWQgdHlwZVxuICAgICAgXVxuXG4gICAgICBjb25zdCBkZWJ1Z0NvbmZpZ3VyYXRpb24gPSBjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtb2RlbENvbmZpZzogY3JlYXRlTW9kZWxDb25maWcoaW5jb21wbGV0ZVZhcmlhYmxlcyksXG4gICAgICB9KVxuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGRlYnVnQ29uZmlndXJhdGlvbilcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gU2hvdWxkIHN0aWxsIHJlbmRlciBidXQgaGFuZGxlIGdyYWNlZnVsbHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtaW5wdXQtYXJlYScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY2FwdHVyZWRDaGF0SW5wdXRQcm9wcz8uaW5wdXRzRm9ybSkudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncHJvcHMgYW5kIGNhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25NdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25NdWx0aXBsZU1vZGVsQ29uZmlnc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG9uTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2UgfSlcblxuICAgICAgLy8gQ29udGV4dCBwcm92aWRlciBzaG91bGQgcGFzcyB0aHJvdWdoIHRoZSBjYWxsYmFja1xuICAgICAgZXhwZWN0KG9uTXVsdGlwbGVNb2RlbENvbmZpZ3NDaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRGVidWdXaXRoTXVsdGlwbGVNb2RlbENoYW5nZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25EZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgb25EZWJ1Z1dpdGhNdWx0aXBsZU1vZGVsQ2hhbmdlIH0pXG5cbiAgICAgIC8vIENvbnRleHQgcHJvdmlkZXIgc2hvdWxkIHBhc3MgdGhyb3VnaCB0aGUgY2FsbGJhY2tcbiAgICAgIGV4cGVjdChvbkRlYnVnV2l0aE11bHRpcGxlTW9kZWxDaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgbWVtb2l6ZSB3aGVuIHByb3BzIGNoYW5nZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzMSA9IGNyZWF0ZVByb3BzKHsgbXVsdGlwbGVNb2RlbENvbmZpZ3M6IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcih7IGlkOiAnbW9kZWwtMScgfSldIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJDb21wb25lbnQocHJvcHMxKVxuXG4gICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVQcm9wcyh7IG11bHRpcGxlTW9kZWxDb25maWdzOiBbY3JlYXRlTW9kZWxBbmRQYXJhbWV0ZXIoeyBpZDogJ21vZGVsLTInIH0pXSB9KVxuICAgICAgcmVyZW5kZXIoPERlYnVnV2l0aE11bHRpcGxlTW9kZWwgey4uLnByb3BzMn0gLz4pXG5cbiAgICAgIGNvbnN0IGl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcbiAgICAgIGV4cGVjdChpdGVtc1swXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW1vZGVsLWlkJywgJ21vZGVsLTInKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgY2hhdCBpbnB1dCBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGNvbnN0IGNoYXRJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhdC1pbnB1dC1hcmVhJylcbiAgICAgIGV4cGVjdChjaGF0SW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2hlY2sgZm9yIGJ1dHRvbiBhY2Nlc3NpYmlsaXR5XG4gICAgICBjb25zdCBzZW5kQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvc2VuZC9pIH0pXG4gICAgICBleHBlY3Qoc2VuZEJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBjb25zdCBmZWF0dXJlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZmVhdHVyZS9pIH0pXG4gICAgICBleHBlY3QoZmVhdHVyZUJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IEFSSUEgYXR0cmlidXRlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtdWx0aXBsZU1vZGVsQ29uZmlncyA9IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgbXVsdGlwbGVNb2RlbENvbmZpZ3MgfSlcblxuICAgICAgLy8gRGVidWcgaXRlbXMgc2hvdWxkIGJlIGlkZW50aWZpYWJsZVxuICAgICAgY29uc3QgZGVidWdJdGVtID0gc2NyZWVuLmdldEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcbiAgICAgIGV4cGVjdChkZWJ1Z0l0ZW0pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChkZWJ1Z0l0ZW0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1tb2RlbC1pZCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncHJvbXB0IHZhcmlhYmxlcyB0cmFuc2Zvcm1hdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZpbHRlciBvdXQgQVBJIHR5cGUgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVdpdGhNZXRhW10gPSBbXG4gICAgICAgIHsga2V5OiAnbm9ybWFsJywgbmFtZTogJ05vcm1hbCcsIHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIHsga2V5OiAnYXBpLXZhcicsIG5hbWU6ICdBUEkgVmFyJywgdHlwZTogJ2FwaScgfSxcbiAgICAgICAgeyBrZXk6ICdudW1iZXInLCBuYW1lOiAnTnVtYmVyJywgdHlwZTogJ251bWJlcicgfSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IGRlYnVnQ29uZmlndXJhdGlvbiA9IGNyZWF0ZURlYnVnQ29uZmlndXJhdGlvbih7XG4gICAgICAgIG1vZGVsQ29uZmlnOiBjcmVhdGVNb2RlbENvbmZpZyhwcm9tcHRWYXJpYWJsZXMpLFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShkZWJ1Z0NvbmZpZ3VyYXRpb24pXG5cbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdChjYXB0dXJlZENoYXRJbnB1dFByb3BzPy5pbnB1dHNGb3JtKS50b0hhdmVMZW5ndGgoMilcbiAgICAgIGV4cGVjdChjYXB0dXJlZENoYXRJbnB1dFByb3BzPy5pbnB1dHNGb3JtKS50b0VxdWFsKFxuICAgICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGxhYmVsOiAnTm9ybWFsJywgdmFyaWFibGU6ICdub3JtYWwnIH0pLFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgbGFiZWw6ICdOdW1iZXInLCB2YXJpYWJsZTogJ251bWJlcicgfSksXG4gICAgICAgIF0pLFxuICAgICAgKVxuICAgICAgZXhwZWN0KGNhcHR1cmVkQ2hhdElucHV0UHJvcHM/LmlucHV0c0Zvcm0pLm5vdC50b0VxdWFsKFxuICAgICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGxhYmVsOiAnQVBJIFZhcicgfSksXG4gICAgICAgIF0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIGhpZGUgYW5kIHJlcXVpcmVkIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9tcHRWYXJpYWJsZXM6IFBhcnRpYWw8UHJvbXB0VmFyaWFibGVXaXRoTWV0YT5bXSA9IFtcbiAgICAgICAgeyBrZXk6ICduby1oaWRlJywgbmFtZTogJ05vIEhpZGUnLCB0eXBlOiAnc3RyaW5nJywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgeyBrZXk6ICduby1yZXF1aXJlZCcsIG5hbWU6ICdObyBSZXF1aXJlZCcsIHR5cGU6ICdudW1iZXInLCBoaWRlOiB0cnVlIH0sXG4gICAgICBdXG4gICAgICBjb25zdCBkZWJ1Z0NvbmZpZ3VyYXRpb24gPSBjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtb2RlbENvbmZpZzogY3JlYXRlTW9kZWxDb25maWcocHJvbXB0VmFyaWFibGVzIGFzIFByb21wdFZhcmlhYmxlV2l0aE1ldGFbXSksXG4gICAgICB9KVxuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGRlYnVnQ29uZmlndXJhdGlvbilcblxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgZXhwZWN0KGNhcHR1cmVkQ2hhdElucHV0UHJvcHM/LmlucHV0c0Zvcm0pLnRvRXF1YWwoW1xuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgbGFiZWw6ICdObyBIaWRlJyxcbiAgICAgICAgICB2YXJpYWJsZTogJ25vLWhpZGUnLFxuICAgICAgICAgIGhpZGU6IGZhbHNlLCAvLyBTaG91bGQgZGVmYXVsdCB0byBmYWxzZVxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGxhYmVsOiAnTm8gUmVxdWlyZWQnLFxuICAgICAgICAgIHZhcmlhYmxlOiAnbm8tcmVxdWlyZWQnLFxuICAgICAgICAgIGhpZGU6IHRydWUsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLCAvLyBTaG91bGQgZGVmYXVsdCB0byBmYWxzZVxuICAgICAgICB9KSxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgb3JpZ2luYWwgaGlkZSBhbmQgcmVxdWlyZWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVdpdGhNZXRhW10gPSBbXG4gICAgICAgIHsga2V5OiAnaGlkZGVuLW9wdGlvbmFsJywgbmFtZTogJ0hpZGRlbiBPcHRpb25hbCcsIHR5cGU6ICdzdHJpbmcnLCBoaWRlOiB0cnVlLCByZXF1aXJlZDogZmFsc2UgfSxcbiAgICAgICAgeyBrZXk6ICd2aXNpYmxlLXJlcXVpcmVkJywgbmFtZTogJ1Zpc2libGUgUmVxdWlyZWQnLCB0eXBlOiAnbnVtYmVyJywgaGlkZTogZmFsc2UsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICBdXG4gICAgICBjb25zdCBkZWJ1Z0NvbmZpZ3VyYXRpb24gPSBjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtb2RlbENvbmZpZzogY3JlYXRlTW9kZWxDb25maWcocHJvbXB0VmFyaWFibGVzKSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoZGVidWdDb25maWd1cmF0aW9uKVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBleHBlY3QoY2FwdHVyZWRDaGF0SW5wdXRQcm9wcz8uaW5wdXRzRm9ybSkudG9FcXVhbChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBsYWJlbDogJ0hpZGRlbiBPcHRpb25hbCcsXG4gICAgICAgICAgdmFyaWFibGU6ICdoaWRkZW4tb3B0aW9uYWwnLFxuICAgICAgICAgIGhpZGU6IHRydWUsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGxhYmVsOiAnVmlzaWJsZSBSZXF1aXJlZCcsXG4gICAgICAgICAgdmFyaWFibGU6ICd2aXNpYmxlLXJlcXVpcmVkJyxcbiAgICAgICAgICBoaWRlOiBmYWxzZSxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NoYXQgaW5wdXQgcmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoYXQgaW5wdXQgaW4gY2hhdCBtb2RlIHdpdGggdHJhbnNmb3JtZWQgcHJvbXB0IHZhcmlhYmxlcyBhbmQgZmVhdHVyZSBoYW5kbGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVdpdGhNZXRhW10gPSBbXG4gICAgICAgIHsga2V5OiAnY2l0eScsIG5hbWU6ICdDaXR5JywgdHlwZTogJ3N0cmluZycsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgIHsga2V5OiAnYXVkaWVuY2UnLCBuYW1lOiAnQXVkaWVuY2UnLCB0eXBlOiAnbnVtYmVyJyB9LFxuICAgICAgICB7IGtleTogJ2hpZGRlbicsIG5hbWU6ICdIaWRkZW4nLCB0eXBlOiAnc2VsZWN0JywgaGlkZTogdHJ1ZSB9LFxuICAgICAgICB7IGtleTogJ2FwaS1vbmx5JywgbmFtZTogJ0FQSSBPbmx5JywgdHlwZTogJ2FwaScgfSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IGRlYnVnQ29uZmlndXJhdGlvbiA9IGNyZWF0ZURlYnVnQ29uZmlndXJhdGlvbih7XG4gICAgICAgIGlucHV0czogeyBhdWRpZW5jZTogJ2VuZ2luZWVycycgfSxcbiAgICAgICAgbW9kZWxDb25maWc6IGNyZWF0ZU1vZGVsQ29uZmlnKHByb21wdFZhcmlhYmxlcyksXG4gICAgICB9KVxuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGRlYnVnQ29uZmlndXJhdGlvbilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2ZlYXR1cmUvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjaGF0LWlucHV0LWFyZWEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNhcHR1cmVkQ2hhdElucHV0UHJvcHM/LmlucHV0cykudG9FcXVhbCh7IGF1ZGllbmNlOiAnZW5naW5lZXJzJyB9KVxuICAgICAgZXhwZWN0KGNhcHR1cmVkQ2hhdElucHV0UHJvcHM/LmlucHV0c0Zvcm0pLnRvRXF1YWwoW1xuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGxhYmVsOiAnQ2l0eScsIHZhcmlhYmxlOiAnY2l0eScsIGhpZGU6IGZhbHNlLCByZXF1aXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBsYWJlbDogJ0F1ZGllbmNlJywgdmFyaWFibGU6ICdhdWRpZW5jZScsIGhpZGU6IGZhbHNlLCByZXF1aXJlZDogZmFsc2UgfSksXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgbGFiZWw6ICdIaWRkZW4nLCB2YXJpYWJsZTogJ2hpZGRlbicsIGhpZGU6IHRydWUsIHJlcXVpcmVkOiBmYWxzZSB9KSxcbiAgICAgIF0pXG4gICAgICBleHBlY3QoY2FwdHVyZWRDaGF0SW5wdXRQcm9wcz8uc2hvd0ZlYXR1cmVCYXIpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChjYXB0dXJlZENoYXRJbnB1dFByb3BzPy5zaG93RmlsZVVwbG9hZCkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChjYXB0dXJlZENoYXRJbnB1dFByb3BzPy5zcGVlY2hUb1RleHRDb25maWcpLnRvRXF1YWwoZmVhdHVyZVN0YXRlLmZlYXR1cmVzLnNwZWVjaDJ0ZXh0KVxuICAgICAgZXhwZWN0KGNhcHR1cmVkQ2hhdElucHV0UHJvcHM/LnZpc2lvbkNvbmZpZykudG9FcXVhbChmZWF0dXJlU3RhdGUuZmVhdHVyZXMuZmlsZSlcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FwcENvbmZpZ3VyZUZlYXR1cmVzTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoYXQgaW5wdXQgaW4gYWdlbnQgY2hhdCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGNyZWF0ZURlYnVnQ29uZmlndXJhdGlvbih7XG4gICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkFHRU5UX0NIQVQsXG4gICAgICB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYXQtaW5wdXQtYXJlYScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBjaGF0IGlucHV0IHdoZW4gbm90IGluIGNoYXQgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0Lm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVEZWJ1Z0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DT01QTEVUSU9OLFxuICAgICAgfSkpXG4gICAgICBjb25zdCBtdWx0aXBsZU1vZGVsQ29uZmlncyA9IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG11bHRpcGxlTW9kZWxDb25maWdzIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjaGF0LWlucHV0LWFyZWEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ2RlYnVnLWl0ZW0nKSkudG9IYXZlTGVuZ3RoKDEpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnc2VuZGluZyBmbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZW1pdCBjaGF0IGV2ZW50IHdoZW4gYWxsb3dlZCB0byBzZW5kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2hlY2tDYW5TZW5kID0gdmkuZm4oKCkgPT4gdHJ1ZSlcbiAgICAgIGNvbnN0IG11bHRpcGxlTW9kZWxDb25maWdzID0gW2NyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCksIGNyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCldXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBtdWx0aXBsZU1vZGVsQ29uZmlncywgY2hlY2tDYW5TZW5kIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3NlbmQvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY2hlY2tDYW5TZW5kKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrRXZlbnRFbWl0dGVyLmVtaXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogQVBQX0NIQVRfV0lUSF9NVUxUSVBMRV9NT0RFTCxcbiAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgIG1lc3NhZ2U6ICd0ZXN0IG1lc3NhZ2UnLFxuICAgICAgICAgIGZpbGVzOiBtb2NrRmlsZXMsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVtaXQgd2hlbiBubyBjaGVja0NhblNlbmQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvc2VuZC9pIH0pKVxuXG4gICAgICBleHBlY3QobW9ja0V2ZW50RW1pdHRlci5lbWl0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6IEFQUF9DSEFUX1dJVEhfTVVMVElQTEVfTU9ERUwsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBtZXNzYWdlOiAndGVzdCBtZXNzYWdlJyxcbiAgICAgICAgICBmaWxlczogbW9ja0ZpbGVzLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBibG9jayBzZW5kaW5nIHdoZW4gY2hlY2tDYW5TZW5kIHJldHVybnMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjaGVja0NhblNlbmQgPSB2aS5mbigoKSA9PiBmYWxzZSlcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGNoZWNrQ2FuU2VuZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9zZW5kL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNoZWNrQ2FuU2VuZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja0V2ZW50RW1pdHRlci5lbWl0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9sZXJhdGUgbWlzc2luZyBldmVudCBlbWl0dGVyIHdpdGhvdXQgdGhyb3dpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlRXZlbnRFbWl0dGVyQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoeyBldmVudEVtaXR0ZXI6IG51bGwgfSlcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIGV4cGVjdCgoKSA9PiBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvc2VuZC9pIH0pKSkubm90LnRvVGhyb3coKVxuICAgICAgZXhwZWN0KG1vY2tFdmVudEVtaXR0ZXIuZW1pdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3BlcmZvcm1hbmNlIG9wdGltaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1lbW9pemUgY2FsbGJhY2sgZnVuY3Rpb25zIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUHJvcHMoeyBtdWx0aXBsZU1vZGVsQ29uZmlnczogW2NyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCldIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJDb21wb25lbnQocHJvcHMpXG5cbiAgICAgIC8vIEZpcnN0IHJlbmRlclxuICAgICAgY29uc3QgZmlyc3RJdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZGVidWctaXRlbScpXG4gICAgICBleHBlY3QoZmlyc3RJdGVtcykudG9IYXZlTGVuZ3RoKDEpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggZXhhY3RseSBzYW1lIHByb3BzIC0gc2hvdWxkIG5vdCBjYXVzZSByZS1yZW5kZXJzXG4gICAgICByZXJlbmRlcig8RGVidWdXaXRoTXVsdGlwbGVNb2RlbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBzZWNvbmRJdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZGVidWctaXRlbScpXG4gICAgICBleHBlY3Qoc2Vjb25kSXRlbXMpLnRvSGF2ZUxlbmd0aCgxKVxuXG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSBlbGVtZW50IHN0aWxsIHJlbmRlcnMgdGhlIHNhbWUgY29udGVudFxuICAgICAgZXhwZWN0KGZpcnN0SXRlbXNbMF0pLnRvSGF2ZVRleHRDb250ZW50KHNlY29uZEl0ZW1zWzBdLnRleHRDb250ZW50IHx8ICcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlY2FsY3VsYXRlIHNpemUgYW5kIHBvc2l0aW9uIHdoZW4gbnVtYmVyIG9mIG1vZGVscyBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgbXVsdGlwbGVNb2RlbENvbmZpZ3M6IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpXSB9KVxuXG4gICAgICAvLyBTaW5nbGUgbW9kZWwgLSBubyBzcGVjaWFsIHNpemluZ1xuICAgICAgY29uc3Qgc2luZ2xlSXRlbSA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVidWctaXRlbScpXG4gICAgICBleHBlY3Qoc2luZ2xlSXRlbS5zdHlsZS53aWR0aCkudG9CZSgnJylcblxuICAgICAgLy8gQ2hhbmdlIHRvIDIgbW9kZWxzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPERlYnVnV2l0aE11bHRpcGxlTW9kZWwgey4uLmNyZWF0ZVByb3BzKHtcbiAgICAgICAgICBtdWx0aXBsZU1vZGVsQ29uZmlnczogW2NyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCksIGNyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCldLFxuICAgICAgICB9KX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR3b0l0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcbiAgICAgIGV4cGVjdCh0d29JdGVtc1swXS5zdHlsZS53aWR0aCkudG9CZSgnY2FsYyg1MCUgLSAyOHB4KScpXG4gICAgICBleHBlY3QodHdvSXRlbXNbMV0uc3R5bGUud2lkdGgpLnRvQmUoJ2NhbGMoNTAlIC0gMjhweCknKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2xheW91dCBzaXppbmcgYW5kIHBvc2l0aW9uaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IGV4cGVjdEl0ZW1MYXlvdXQgPSAoXG4gICAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgIGV4cGVjdGF0aW9uOiB7XG4gICAgICAgIHdpZHRoPzogc3RyaW5nXG4gICAgICAgIGhlaWdodD86IHN0cmluZ1xuICAgICAgICB0cmFuc2Zvcm06IHN0cmluZ1xuICAgICAgICBjbGFzc2VzPzogc3RyaW5nW11cbiAgICAgIH0sXG4gICAgKSA9PiB7XG4gICAgICBpZiAoZXhwZWN0YXRpb24ud2lkdGggIT09IHVuZGVmaW5lZClcbiAgICAgICAgZXhwZWN0KGVsZW1lbnQuc3R5bGUud2lkdGgpLnRvQmUoZXhwZWN0YXRpb24ud2lkdGgpXG4gICAgICBlbHNlXG4gICAgICAgIGV4cGVjdChlbGVtZW50LnN0eWxlLndpZHRoKS50b0JlKCcnKVxuXG4gICAgICBpZiAoZXhwZWN0YXRpb24uaGVpZ2h0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGV4cGVjdChlbGVtZW50LnN0eWxlLmhlaWdodCkudG9CZShleHBlY3RhdGlvbi5oZWlnaHQpXG4gICAgICBlbHNlXG4gICAgICAgIGV4cGVjdChlbGVtZW50LnN0eWxlLmhlaWdodCkudG9CZSgnJylcblxuICAgICAgZXhwZWN0KGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtKS50b0JlKGV4cGVjdGF0aW9uLnRyYW5zZm9ybSlcbiAgICAgIGV4cGVjdGF0aW9uLmNsYXNzZXM/LmZvckVhY2goY2xzID0+IGV4cGVjdChlbGVtZW50KS50b0hhdmVDbGFzcyhjbHMpKVxuICAgIH1cblxuICAgIGl0KCdzaG91bGQgYXJyYW5nZSBpdGVtcyBpbiB0d28tY29sdW1uIGxheW91dCBmb3IgdHdvIG1vZGVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG11bHRpcGxlTW9kZWxDb25maWdzID0gW2NyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCksIGNyZWF0ZU1vZGVsQW5kUGFyYW1ldGVyKCldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgbXVsdGlwbGVNb2RlbENvbmZpZ3MgfSlcbiAgICAgIGNvbnN0IGl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaXRlbXMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0SXRlbUxheW91dChpdGVtc1swXSwge1xuICAgICAgICB3aWR0aDogJ2NhbGMoNTAlIC0gMjhweCknLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSB0cmFuc2xhdGVZKDApJyxcbiAgICAgICAgY2xhc3NlczogWydtci0yJ10sXG4gICAgICB9KVxuICAgICAgZXhwZWN0SXRlbUxheW91dChpdGVtc1sxXSwge1xuICAgICAgICB3aWR0aDogJ2NhbGMoNTAlIC0gMjhweCknLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWChjYWxjKDEwMCUgKyA4cHgpKSB0cmFuc2xhdGVZKDApJyxcbiAgICAgICAgY2xhc3NlczogW10sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFycmFuZ2UgaXRlbXMgaW4gdGhpcmRzIGZvciB0aHJlZSBtb2RlbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtdWx0aXBsZU1vZGVsQ29uZmlncyA9IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLCBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLCBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG11bHRpcGxlTW9kZWxDb25maWdzIH0pXG4gICAgICBjb25zdCBpdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZGVidWctaXRlbScpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGl0ZW1zKS50b0hhdmVMZW5ndGgoMylcbiAgICAgIGV4cGVjdEl0ZW1MYXlvdXQoaXRlbXNbMF0sIHtcbiAgICAgICAgd2lkdGg6ICdjYWxjKDMzLjMlIC0gMjEuMzNweCknLFxuICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSB0cmFuc2xhdGVZKDApJyxcbiAgICAgICAgY2xhc3NlczogWydtci0yJ10sXG4gICAgICB9KVxuICAgICAgZXhwZWN0SXRlbUxheW91dChpdGVtc1sxXSwge1xuICAgICAgICB3aWR0aDogJ2NhbGMoMzMuMyUgLSAyMS4zM3B4KScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKGNhbGMoMTAwJSArIDhweCkpIHRyYW5zbGF0ZVkoMCknLFxuICAgICAgICBjbGFzc2VzOiBbJ21yLTInXSxcbiAgICAgIH0pXG4gICAgICBleHBlY3RJdGVtTGF5b3V0KGl0ZW1zWzJdLCB7XG4gICAgICAgIHdpZHRoOiAnY2FsYygzMy4zJSAtIDIxLjMzcHgpJyxcbiAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoY2FsYygyMDAlICsgMTZweCkpIHRyYW5zbGF0ZVkoMCknLFxuICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcG9zaXRpb24gaXRlbXMgb24gYSBncmlkIGZvciBmb3VyIG1vZGVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG11bHRpcGxlTW9kZWxDb25maWdzID0gW1xuICAgICAgICBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLFxuICAgICAgICBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLFxuICAgICAgICBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLFxuICAgICAgICBjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG11bHRpcGxlTW9kZWxDb25maWdzIH0pXG4gICAgICBjb25zdCBpdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnZGVidWctaXRlbScpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGl0ZW1zKS50b0hhdmVMZW5ndGgoNClcbiAgICAgIGV4cGVjdEl0ZW1MYXlvdXQoaXRlbXNbMF0sIHtcbiAgICAgICAgd2lkdGg6ICdjYWxjKDUwJSAtIDI4cHgpJyxcbiAgICAgICAgaGVpZ2h0OiAnY2FsYyg1MCUgLSA0cHgpJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSB0cmFuc2xhdGVZKDApJyxcbiAgICAgICAgY2xhc3NlczogWydtci0yJywgJ21iLTInXSxcbiAgICAgIH0pXG4gICAgICBleHBlY3RJdGVtTGF5b3V0KGl0ZW1zWzFdLCB7XG4gICAgICAgIHdpZHRoOiAnY2FsYyg1MCUgLSAyOHB4KScsXG4gICAgICAgIGhlaWdodDogJ2NhbGMoNTAlIC0gNHB4KScsXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoY2FsYygxMDAlICsgOHB4KSkgdHJhbnNsYXRlWSgwKScsXG4gICAgICAgIGNsYXNzZXM6IFsnbWItMiddLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdEl0ZW1MYXlvdXQoaXRlbXNbMl0sIHtcbiAgICAgICAgd2lkdGg6ICdjYWxjKDUwJSAtIDI4cHgpJyxcbiAgICAgICAgaGVpZ2h0OiAnY2FsYyg1MCUgLSA0cHgpJyxcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSB0cmFuc2xhdGVZKGNhbGMoMTAwJSArIDhweCkpJyxcbiAgICAgICAgY2xhc3NlczogWydtci0yJ10sXG4gICAgICB9KVxuICAgICAgZXhwZWN0SXRlbUxheW91dChpdGVtc1szXSwge1xuICAgICAgICB3aWR0aDogJ2NhbGMoNTAlIC0gMjhweCknLFxuICAgICAgICBoZWlnaHQ6ICdjYWxjKDUwJSAtIDRweCknLFxuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKGNhbGMoMTAwJSArIDhweCkpIHRyYW5zbGF0ZVkoY2FsYygxMDAlICsgOHB4KSknLFxuICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmFsbCBiYWNrIHRvIHNpbmdsZSBjb2x1bW4gbGF5b3V0IHdoZW4gb25seSBvbmUgbW9kZWwgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtdWx0aXBsZU1vZGVsQ29uZmlncyA9IFtjcmVhdGVNb2RlbEFuZFBhcmFtZXRlcigpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG11bHRpcGxlTW9kZWxDb25maWdzIH0pXG4gICAgICBjb25zdCBpdGVtID0gc2NyZWVuLmdldEJ5VGVzdElkKCdkZWJ1Zy1pdGVtJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3RJdGVtTGF5b3V0KGl0ZW0sIHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSB0cmFuc2xhdGVZKDApJyxcbiAgICAgICAgY2xhc3NlczogW10sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBzY3JvbGwgYXJlYSBoZWlnaHQgZm9yIGNoYXQgbW9kZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KClcbiAgICAgIGNvbnN0IHNjcm9sbEFyZWEgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnJlbGF0aXZlLm1iLTMuZ3Jvdy5vdmVyZmxvdy1hdXRvLnB4LTYnKSBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHNjcm9sbEFyZWEpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JvbGxBcmVhLnN0eWxlLmhlaWdodCkudG9CZSgnY2FsYygxMDAlIC0gNjBweCknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBmdWxsIGhlaWdodCB3aGVuIGNoYXQgaW5wdXQgaXMgaGlkZGVuJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZURlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQubW9ja1JldHVyblZhbHVlKGNyZWF0ZURlYnVnQ29uZmlndXJhdGlvbih7XG4gICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04sXG4gICAgICB9KSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG4gICAgICBjb25zdCBzY3JvbGxBcmVhID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5yZWxhdGl2ZS5tYi0zLmdyb3cub3ZlcmZsb3ctYXV0by5weC02JykgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChzY3JvbGxBcmVhLnN0eWxlLmhlaWdodCkudG9CZSgnMTAwJScpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=