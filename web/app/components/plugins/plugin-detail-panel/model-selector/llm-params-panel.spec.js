"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// Import component after mocks
const llm_params_panel_1 = require("./llm-params-panel");
// ==================== Mock Setup ====================
// All vi.mock() calls are hoisted, so inline all mock data
// Mock useModelParameterRules hook
const mockUseModelParameterRules = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-common', () => ({
    useModelParameterRules: (provider, modelId) => mockUseModelParameterRules(provider, modelId),
}));
// Mock config constants with inline data
vitest_1.vi.mock('@/config', () => ({
    TONE_LIST: [
        {
            id: 1,
            name: 'Creative',
            config: {
                temperature: 0.8,
                top_p: 0.9,
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
            },
        },
        {
            id: 2,
            name: 'Balanced',
            config: {
                temperature: 0.5,
                top_p: 0.85,
                presence_penalty: 0.2,
                frequency_penalty: 0.3,
            },
        },
        {
            id: 3,
            name: 'Precise',
            config: {
                temperature: 0.2,
                top_p: 0.75,
                presence_penalty: 0.5,
                frequency_penalty: 0.5,
            },
        },
        {
            id: 4,
            name: 'Custom',
        },
    ],
    STOP_PARAMETER_RULE: {
        default: [],
        help: {
            en_US: 'Stop sequences help text',
            zh_Hans: '停止序列帮助文本',
        },
        label: {
            en_US: 'Stop sequences',
            zh_Hans: '停止序列',
        },
        name: 'stop',
        required: false,
        type: 'tag',
        tagPlaceholder: {
            en_US: 'Enter sequence and press Tab',
            zh_Hans: '输入序列并按 Tab 键',
        },
    },
    PROVIDER_WITH_PRESET_TONE: ['langgenius/openai/openai', 'langgenius/azure_openai/azure_openai'],
}));
// Mock PresetsParameter component
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/model-parameter-modal/presets-parameter', () => ({
    default: ({ onSelect }) => (<div data-testid="presets-parameter">
      <button data-testid="preset-creative" onClick={() => onSelect(1)}>Creative</button>
      <button data-testid="preset-balanced" onClick={() => onSelect(2)}>Balanced</button>
      <button data-testid="preset-precise" onClick={() => onSelect(3)}>Precise</button>
      <button data-testid="preset-custom" onClick={() => onSelect(4)}>Custom</button>
    </div>),
}));
// Mock ParameterItem component
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/model-parameter-modal/parameter-item', () => ({
    default: ({ parameterRule, value, onChange, onSwitch, isInWorkflow }) => (<div data-testid={`parameter-item-${parameterRule.name}`} data-value={JSON.stringify(value)} data-is-in-workflow={isInWorkflow}>
      <span>{parameterRule.label.en_US}</span>
      <button data-testid={`change-${parameterRule.name}`} onClick={() => onChange(0.5)}>Change</button>
      <button data-testid={`switch-on-${parameterRule.name}`} onClick={() => onSwitch(true, parameterRule.default)}>Switch On</button>
      <button data-testid={`switch-off-${parameterRule.name}`} onClick={() => onSwitch(false, parameterRule.default)}>Switch Off</button>
    </div>),
}));
// ==================== Test Utilities ====================
/**
 * Factory function to create a ModelParameterRule with defaults
 */
const createParameterRule = (overrides = {}) => ({
    name: 'temperature',
    label: { en_US: 'Temperature', zh_Hans: '温度' },
    type: 'float',
    default: 0.7,
    min: 0,
    max: 2,
    precision: 2,
    required: false,
    ...overrides,
});
/**
 * Factory function to create default props
 */
const createDefaultProps = (overrides = {}) => ({
    isAdvancedMode: false,
    provider: 'langgenius/openai/openai',
    modelId: 'gpt-4',
    completionParams: {},
    onCompletionParamsChange: vitest_1.vi.fn(),
    ...overrides,
});
/**
 * Setup mock for useModelParameterRules
 */
const setupModelParameterRulesMock = (config = {}) => {
    mockUseModelParameterRules.mockReturnValue({
        data: config.data ? { data: config.data } : undefined,
        isPending: config.isPending ?? false,
    });
};
// ==================== Tests ====================
(0, vitest_1.describe)('LLMParamsPanel', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        setupModelParameterRulesMock({ data: [], isPending: false });
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render loading state when isPending is true', () => {
            // Arrange
            setupModelParameterRulesMock({ isPending: true });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert - Loading component uses aria-label instead of visible text
            (0, vitest_1.expect)(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render parameters header', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('common.modelProvider.parameters')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render PresetsParameter for openai provider', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps({ provider: 'langgenius/openai/openai' });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('presets-parameter')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render PresetsParameter for azure_openai provider', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps({ provider: 'langgenius/azure_openai/azure_openai' });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('presets-parameter')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render PresetsParameter for non-preset providers', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps({ provider: 'anthropic/claude' });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('presets-parameter')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render parameter items when rules are available', () => {
            // Arrange
            const rules = [
                createParameterRule({ name: 'temperature' }),
                createParameterRule({ name: 'top_p', label: { en_US: 'Top P', zh_Hans: 'Top P' } }),
            ];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-top_p')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render parameter items when rules are empty', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('parameter-item-temperature')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should include stop parameter rule in advanced mode', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({ isAdvancedMode: true });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-stop')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not include stop parameter rule in non-advanced mode', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({ isAdvancedMode: false });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('parameter-item-stop')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass isInWorkflow=true to ParameterItem', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toHaveAttribute('data-is-in-workflow', 'true');
        });
    });
    // ==================== Props Testing ====================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should call useModelParameterRules with provider and modelId', () => {
            // Arrange
            const props = createDefaultProps({
                provider: 'test-provider',
                modelId: 'test-model',
            });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(mockUseModelParameterRules).toHaveBeenCalledWith('test-provider', 'test-model');
        });
        (0, vitest_1.it)('should pass completion params value to ParameterItem', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({
                completionParams: { temperature: 0.8 },
            });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toHaveAttribute('data-value', '0.8');
        });
        (0, vitest_1.it)('should handle undefined completion params value', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({
                completionParams: {},
            });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert - when value is undefined, JSON.stringify returns undefined string
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).not.toHaveAttribute('data-value');
        });
    });
    // ==================== Event Handlers ====================
    (0, vitest_1.describe)('Event Handlers', () => {
        (0, vitest_1.describe)('handleSelectPresetParameter', () => {
            (0, vitest_1.it)('should apply Creative preset config', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                setupModelParameterRulesMock({ data: [], isPending: false });
                const props = createDefaultProps({
                    provider: 'langgenius/openai/openai',
                    onCompletionParamsChange,
                    completionParams: { existing: 'value' },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('preset-creative'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    existing: 'value',
                    temperature: 0.8,
                    top_p: 0.9,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1,
                });
            });
            (0, vitest_1.it)('should apply Balanced preset config', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                setupModelParameterRulesMock({ data: [], isPending: false });
                const props = createDefaultProps({
                    provider: 'langgenius/openai/openai',
                    onCompletionParamsChange,
                    completionParams: {},
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('preset-balanced'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    temperature: 0.5,
                    top_p: 0.85,
                    presence_penalty: 0.2,
                    frequency_penalty: 0.3,
                });
            });
            (0, vitest_1.it)('should apply Precise preset config', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                setupModelParameterRulesMock({ data: [], isPending: false });
                const props = createDefaultProps({
                    provider: 'langgenius/openai/openai',
                    onCompletionParamsChange,
                    completionParams: {},
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('preset-precise'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    temperature: 0.2,
                    top_p: 0.75,
                    presence_penalty: 0.5,
                    frequency_penalty: 0.5,
                });
            });
            (0, vitest_1.it)('should apply empty config for Custom preset (spreads undefined)', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                setupModelParameterRulesMock({ data: [], isPending: false });
                const props = createDefaultProps({
                    provider: 'langgenius/openai/openai',
                    onCompletionParamsChange,
                    completionParams: { existing: 'value' },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('preset-custom'));
                // Assert - Custom preset has no config, so only existing params are kept
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({ existing: 'value' });
            });
        });
        (0, vitest_1.describe)('handleParamChange', () => {
            (0, vitest_1.it)('should call onCompletionParamsChange with updated param', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                const rules = [createParameterRule({ name: 'temperature' })];
                setupModelParameterRulesMock({ data: rules, isPending: false });
                const props = createDefaultProps({
                    onCompletionParamsChange,
                    completionParams: { existing: 'value' },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('change-temperature'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    existing: 'value',
                    temperature: 0.5,
                });
            });
            (0, vitest_1.it)('should override existing param value', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                const rules = [createParameterRule({ name: 'temperature' })];
                setupModelParameterRulesMock({ data: rules, isPending: false });
                const props = createDefaultProps({
                    onCompletionParamsChange,
                    completionParams: { temperature: 0.9 },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('change-temperature'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    temperature: 0.5,
                });
            });
        });
        (0, vitest_1.describe)('handleSwitch', () => {
            (0, vitest_1.it)('should add param when switch is turned on', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                const rules = [createParameterRule({ name: 'temperature', default: 0.7 })];
                setupModelParameterRulesMock({ data: rules, isPending: false });
                const props = createDefaultProps({
                    onCompletionParamsChange,
                    completionParams: { existing: 'value' },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('switch-on-temperature'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    existing: 'value',
                    temperature: 0.7,
                });
            });
            (0, vitest_1.it)('should remove param when switch is turned off', () => {
                // Arrange
                const onCompletionParamsChange = vitest_1.vi.fn();
                const rules = [createParameterRule({ name: 'temperature' })];
                setupModelParameterRulesMock({ data: rules, isPending: false });
                const props = createDefaultProps({
                    onCompletionParamsChange,
                    completionParams: { temperature: 0.8, other: 'value' },
                });
                // Act
                (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('switch-off-temperature'));
                // Assert
                (0, vitest_1.expect)(onCompletionParamsChange).toHaveBeenCalledWith({
                    other: 'value',
                });
            });
        });
    });
    // ==================== Memoization ====================
    (0, vitest_1.describe)('Memoization - parameterRules', () => {
        (0, vitest_1.it)('should return empty array when data is undefined', () => {
            // Arrange
            mockUseModelParameterRules.mockReturnValue({
                data: undefined,
                isPending: false,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert - no parameter items should be rendered
            (0, vitest_1.expect)(react_1.screen.queryByTestId(/parameter-item-/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should return empty array when data.data is undefined', () => {
            // Arrange
            mockUseModelParameterRules.mockReturnValue({
                data: { data: undefined },
                isPending: false,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId(/parameter-item-/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should use data.data when available', () => {
            // Arrange
            const rules = [
                createParameterRule({ name: 'temperature' }),
                createParameterRule({ name: 'top_p' }),
            ];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-top_p')).toBeInTheDocument();
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty completionParams', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({ completionParams: {} });
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle multiple parameter rules', () => {
            // Arrange
            const rules = [
                createParameterRule({ name: 'temperature' }),
                createParameterRule({ name: 'top_p' }),
                createParameterRule({ name: 'max_tokens', type: 'int' }),
                createParameterRule({ name: 'presence_penalty' }),
            ];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-top_p')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-max_tokens')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-presence_penalty')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should use unique keys for parameter items based on modelId and name', () => {
            // Arrange
            const rules = [
                createParameterRule({ name: 'temperature' }),
                createParameterRule({ name: 'top_p' }),
            ];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({ modelId: 'gpt-4' });
            // Act
            const { container } = (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            // Assert - verify both items are rendered (keys are internal but rendering proves uniqueness)
            const items = container.querySelectorAll('[data-testid^="parameter-item-"]');
            (0, vitest_1.expect)(items).toHaveLength(2);
        });
    });
    // ==================== Re-render Behavior ====================
    (0, vitest_1.describe)('Re-render Behavior', () => {
        (0, vitest_1.it)('should update parameter items when rules change', () => {
            // Arrange
            const initialRules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: initialRules, isPending: false });
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('parameter-item-top_p')).not.toBeInTheDocument();
            // Update mock
            const newRules = [
                createParameterRule({ name: 'temperature' }),
                createParameterRule({ name: 'top_p' }),
            ];
            setupModelParameterRulesMock({ data: newRules, isPending: false });
            rerender(<llm_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-top_p')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show loading when transitioning from loaded to loading', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-temperature')).toBeInTheDocument();
            // Update to loading
            setupModelParameterRulesMock({ isPending: true });
            rerender(<llm_params_panel_1.default {...props}/>);
            // Assert - Loading component uses role="status" with aria-label
            (0, vitest_1.expect)(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should update when isAdvancedMode changes', () => {
            // Arrange
            const rules = [createParameterRule({ name: 'temperature' })];
            setupModelParameterRulesMock({ data: rules, isPending: false });
            const props = createDefaultProps({ isAdvancedMode: false });
            // Act
            const { rerender } = (0, react_1.render)(<llm_params_panel_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('parameter-item-stop')).not.toBeInTheDocument();
            rerender(<llm_params_panel_1.default {...props} isAdvancedMode={true}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('parameter-item-stop')).toBeInTheDocument();
        });
    });
    // ==================== Component Type ====================
    (0, vitest_1.describe)('Component Type', () => {
        (0, vitest_1.it)('should be a functional component', () => {
            // Assert
            (0, vitest_1.expect)(typeof llm_params_panel_1.default).toBe('function');
        });
        (0, vitest_1.it)('should accept all required props', () => {
            // Arrange
            setupModelParameterRulesMock({ data: [], isPending: false });
            const props = createDefaultProps();
            // Act & Assert
            (0, vitest_1.expect)(() => (0, react_1.render)(<llm_params_panel_1.default {...props}/>)).not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGxtLXBhcmFtcy1wYW5lbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGxtLXBhcmFtcy1wYW5lbC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFrRTtBQUNsRSxtQ0FBNkQ7QUFFN0QsK0JBQStCO0FBQy9CLHlEQUErQztBQUUvQyx1REFBdUQ7QUFDdkQsMkRBQTJEO0FBRTNELG1DQUFtQztBQUNuQyxNQUFNLDBCQUEwQixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMxQyxXQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckMsc0JBQXNCLEVBQUUsQ0FBQyxRQUFnQixFQUFFLE9BQWUsRUFBRSxFQUFFLENBQUMsMEJBQTBCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztDQUM3RyxDQUFDLENBQUMsQ0FBQTtBQUVILHlDQUF5QztBQUN6QyxXQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLFNBQVMsRUFBRTtRQUNUO1lBQ0UsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLEtBQUssRUFBRSxHQUFHO2dCQUNWLGdCQUFnQixFQUFFLEdBQUc7Z0JBQ3JCLGlCQUFpQixFQUFFLEdBQUc7YUFDdkI7U0FDRjtRQUNEO1lBQ0UsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLEdBQUc7Z0JBQ2hCLEtBQUssRUFBRSxJQUFJO2dCQUNYLGdCQUFnQixFQUFFLEdBQUc7Z0JBQ3JCLGlCQUFpQixFQUFFLEdBQUc7YUFDdkI7U0FDRjtRQUNEO1lBQ0UsRUFBRSxFQUFFLENBQUM7WUFDTCxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRTtn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QyxDQUFBO1lBQzVELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsZUFBZTtZQUNmLElBQUEsZUFBTSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsY0FBTSxFQUFDLENBQUMsMEJBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNuRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZvcm1WYWx1ZSwgTW9kZWxQYXJhbWV0ZXJSdWxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5cbi8vIEltcG9ydCBjb21wb25lbnQgYWZ0ZXIgbW9ja3NcbmltcG9ydCBMTE1QYXJhbXNQYW5lbCBmcm9tICcuL2xsbS1wYXJhbXMtcGFuZWwnXG5cbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgU2V0dXAgPT09PT09PT09PT09PT09PT09PT1cbi8vIEFsbCB2aS5tb2NrKCkgY2FsbHMgYXJlIGhvaXN0ZWQsIHNvIGlubGluZSBhbGwgbW9jayBkYXRhXG5cbi8vIE1vY2sgdXNlTW9kZWxQYXJhbWV0ZXJSdWxlcyBob29rXG5jb25zdCBtb2NrVXNlTW9kZWxQYXJhbWV0ZXJSdWxlcyA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS91c2UtY29tbW9uJywgKCkgPT4gKHtcbiAgdXNlTW9kZWxQYXJhbWV0ZXJSdWxlczogKHByb3ZpZGVyOiBzdHJpbmcsIG1vZGVsSWQ6IHN0cmluZykgPT4gbW9ja1VzZU1vZGVsUGFyYW1ldGVyUnVsZXMocHJvdmlkZXIsIG1vZGVsSWQpLFxufSkpXG5cbi8vIE1vY2sgY29uZmlnIGNvbnN0YW50cyB3aXRoIGlubGluZSBkYXRhXG52aS5tb2NrKCdAL2NvbmZpZycsICgpID0+ICh7XG4gIFRPTkVfTElTVDogW1xuICAgIHtcbiAgICAgIGlkOiAxLFxuICAgICAgbmFtZTogJ0NyZWF0aXZlJyxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICB0ZW1wZXJhdHVyZTogMC44LFxuICAgICAgICB0b3BfcDogMC45LFxuICAgICAgICBwcmVzZW5jZV9wZW5hbHR5OiAwLjEsXG4gICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OiAwLjEsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDIsXG4gICAgICBuYW1lOiAnQmFsYW5jZWQnLFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIHRlbXBlcmF0dXJlOiAwLjUsXG4gICAgICAgIHRvcF9wOiAwLjg1LFxuICAgICAgICBwcmVzZW5jZV9wZW5hbHR5OiAwLjIsXG4gICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OiAwLjMsXG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDMsXG4gICAgICBuYW1lOiAnUHJlY2lzZScsXG4gICAgICBjb25maWc6IHtcbiAgICAgICAgdGVtcGVyYXR1cmU6IDAuMixcbiAgICAgICAgdG9wX3A6IDAuNzUsXG4gICAgICAgIHByZXNlbmNlX3BlbmFsdHk6IDAuNSxcbiAgICAgICAgZnJlcXVlbmN5X3BlbmFsdHk6IDAuNSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogNCxcbiAgICAgIG5hbWU6ICdDdXN0b20nLFxuICAgIH0sXG4gIF0sXG4gIFNUT1BfUEFSQU1FVEVSX1JVTEU6IHtcbiAgICBkZWZhdWx0OiBbXSxcbiAgICBoZWxwOiB7XG4gICAgICBlbl9VUzogJ1N0b3Agc2VxdWVuY2VzIGhlbHAgdGV4dCcsXG4gICAgICB6aF9IYW5zOiAn5YGc5q2i5bqP5YiX5biu5Yqp5paH5pysJyxcbiAgICB9LFxuICAgIGxhYmVsOiB7XG4gICAgICBlbl9VUzogJ1N0b3Agc2VxdWVuY2VzJyxcbiAgICAgIHpoX0hhbnM6ICflgZzmraLluo/liJcnLFxuICAgIH0sXG4gICAgbmFtZTogJ3N0b3AnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAndGFnJyxcbiAgICB0YWdQbGFjZWhvbGRlcjoge1xuICAgICAgZW5fVVM6ICdFbnRlciBzZXF1ZW5jZSBhbmQgcHJlc3MgVGFiJyxcbiAgICAgIHpoX0hhbnM6ICfovpPlhaXluo/liJflubbmjIkgVGFiIOmUricsXG4gICAgfSxcbiAgfSxcbiAgUFJPVklERVJfV0lUSF9QUkVTRVRfVE9ORTogWydsYW5nZ2VuaXVzL29wZW5haS9vcGVuYWknLCAnbGFuZ2dlbml1cy9henVyZV9vcGVuYWkvYXp1cmVfb3BlbmFpJ10sXG59KSlcblxuLy8gTW9jayBQcmVzZXRzUGFyYW1ldGVyIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtcGFyYW1ldGVyLW1vZGFsL3ByZXNldHMtcGFyYW1ldGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb25TZWxlY3QgfTogeyBvblNlbGVjdDogKHRvbmVJZDogbnVtYmVyKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicHJlc2V0cy1wYXJhbWV0ZXJcIj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwcmVzZXQtY3JlYXRpdmVcIiBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCgxKX0+Q3JlYXRpdmU8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwcmVzZXQtYmFsYW5jZWRcIiBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCgyKX0+QmFsYW5jZWQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJwcmVzZXQtcHJlY2lzZVwiIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KDMpfT5QcmVjaXNlPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHJlc2V0LWN1c3RvbVwiIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KDQpfT5DdXN0b208L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIFBhcmFtZXRlckl0ZW0gY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9tb2RlbC1wYXJhbWV0ZXItbW9kYWwvcGFyYW1ldGVyLWl0ZW0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBwYXJhbWV0ZXJSdWxlLCB2YWx1ZSwgb25DaGFuZ2UsIG9uU3dpdGNoLCBpc0luV29ya2Zsb3cgfToge1xuICAgIHBhcmFtZXRlclJ1bGU6IHsgbmFtZTogc3RyaW5nLCBsYWJlbDogeyBlbl9VUzogc3RyaW5nIH0sIGRlZmF1bHQ/OiB1bmtub3duIH1cbiAgICB2YWx1ZTogdW5rbm93blxuICAgIG9uQ2hhbmdlOiAodjogdW5rbm93bikgPT4gdm9pZFxuICAgIG9uU3dpdGNoOiAoY2hlY2tlZDogYm9vbGVhbiwgYXNzaWduVmFsdWU6IHVua25vd24pID0+IHZvaWRcbiAgICBpc0luV29ya2Zsb3c/OiBib29sZWFuXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD17YHBhcmFtZXRlci1pdGVtLSR7cGFyYW1ldGVyUnVsZS5uYW1lfWB9XG4gICAgICBkYXRhLXZhbHVlPXtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9XG4gICAgICBkYXRhLWlzLWluLXdvcmtmbG93PXtpc0luV29ya2Zsb3d9XG4gICAgPlxuICAgICAgPHNwYW4+e3BhcmFtZXRlclJ1bGUubGFiZWwuZW5fVVN9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD17YGNoYW5nZS0ke3BhcmFtZXRlclJ1bGUubmFtZX1gfSBvbkNsaWNrPXsoKSA9PiBvbkNoYW5nZSgwLjUpfT5DaGFuZ2U8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9e2Bzd2l0Y2gtb24tJHtwYXJhbWV0ZXJSdWxlLm5hbWV9YH0gb25DbGljaz17KCkgPT4gb25Td2l0Y2godHJ1ZSwgcGFyYW1ldGVyUnVsZS5kZWZhdWx0KX0+U3dpdGNoIE9uPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPXtgc3dpdGNoLW9mZi0ke3BhcmFtZXRlclJ1bGUubmFtZX1gfSBvbkNsaWNrPXsoKSA9PiBvblN3aXRjaChmYWxzZSwgcGFyYW1ldGVyUnVsZS5kZWZhdWx0KX0+U3dpdGNoIE9mZjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3QgVXRpbGl0aWVzID09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBNb2RlbFBhcmFtZXRlclJ1bGUgd2l0aCBkZWZhdWx0c1xuICovXG5jb25zdCBjcmVhdGVQYXJhbWV0ZXJSdWxlID0gKG92ZXJyaWRlczogUGFydGlhbDxNb2RlbFBhcmFtZXRlclJ1bGU+ID0ge30pOiBNb2RlbFBhcmFtZXRlclJ1bGUgPT4gKHtcbiAgbmFtZTogJ3RlbXBlcmF0dXJlJyxcbiAgbGFiZWw6IHsgZW5fVVM6ICdUZW1wZXJhdHVyZScsIHpoX0hhbnM6ICfmuKnluqYnIH0sXG4gIHR5cGU6ICdmbG9hdCcsXG4gIGRlZmF1bHQ6IDAuNyxcbiAgbWluOiAwLFxuICBtYXg6IDIsXG4gIHByZWNpc2lvbjogMixcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGRlZmF1bHQgcHJvcHNcbiAqL1xuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDx7XG4gIGlzQWR2YW5jZWRNb2RlOiBib29sZWFuXG4gIHByb3ZpZGVyOiBzdHJpbmdcbiAgbW9kZWxJZDogc3RyaW5nXG4gIGNvbXBsZXRpb25QYXJhbXM6IEZvcm1WYWx1ZVxuICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2U6IChuZXdQYXJhbXM6IEZvcm1WYWx1ZSkgPT4gdm9pZFxufT4gPSB7fSkgPT4gKHtcbiAgaXNBZHZhbmNlZE1vZGU6IGZhbHNlLFxuICBwcm92aWRlcjogJ2xhbmdnZW5pdXMvb3BlbmFpL29wZW5haScsXG4gIG1vZGVsSWQ6ICdncHQtNCcsXG4gIGNvbXBsZXRpb25QYXJhbXM6IHt9LFxuICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2U6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogU2V0dXAgbW9jayBmb3IgdXNlTW9kZWxQYXJhbWV0ZXJSdWxlc1xuICovXG5jb25zdCBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrID0gKGNvbmZpZzoge1xuICBkYXRhPzogTW9kZWxQYXJhbWV0ZXJSdWxlW11cbiAgaXNQZW5kaW5nPzogYm9vbGVhblxufSA9IHt9KSA9PiB7XG4gIG1vY2tVc2VNb2RlbFBhcmFtZXRlclJ1bGVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgZGF0YTogY29uZmlnLmRhdGEgPyB7IGRhdGE6IGNvbmZpZy5kYXRhIH0gOiB1bmRlZmluZWQsXG4gICAgaXNQZW5kaW5nOiBjb25maWcuaXNQZW5kaW5nID8/IGZhbHNlLFxuICB9KVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnTExNUGFyYW1zUGFuZWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBbXSwgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFJlbmRlcmluZyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc3RhdGUgd2hlbiBpc1BlbmRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBpc1BlbmRpbmc6IHRydWUgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIExvYWRpbmcgY29tcG9uZW50IHVzZXMgYXJpYS1sYWJlbCBpbnN0ZWFkIG9mIHZpc2libGUgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N0YXR1cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhcmFtZXRlcnMgaGVhZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IFtdLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ubW9kZWxQcm92aWRlci5wYXJhbWV0ZXJzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHJlc2V0c1BhcmFtZXRlciBmb3Igb3BlbmFpIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IFtdLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHByb3ZpZGVyOiAnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwcmVzZXRzLXBhcmFtZXRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFByZXNldHNQYXJhbWV0ZXIgZm9yIGF6dXJlX29wZW5haSBwcm92aWRlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBbXSwgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwcm92aWRlcjogJ2xhbmdnZW5pdXMvYXp1cmVfb3BlbmFpL2F6dXJlX29wZW5haScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHJlc2V0cy1wYXJhbWV0ZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgUHJlc2V0c1BhcmFtZXRlciBmb3Igbm9uLXByZXNldCBwcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogW10sIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcHJvdmlkZXI6ICdhbnRocm9waWMvY2xhdWRlJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3ByZXNldHMtcGFyYW1ldGVyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhcmFtZXRlciBpdGVtcyB3aGVuIHJ1bGVzIGFyZSBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBydWxlcyA9IFtcbiAgICAgICAgY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSksXG4gICAgICAgIGNyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndG9wX3AnLCBsYWJlbDogeyBlbl9VUzogJ1RvcCBQJywgemhfSGFuczogJ1RvcCBQJyB9IH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXRlbXBlcmF0dXJlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXRvcF9wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHBhcmFtZXRlciBpdGVtcyB3aGVuIHJ1bGVzIGFyZSBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBbXSwgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXRlbXBlcmF0dXJlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBzdG9wIHBhcmFtZXRlciBydWxlIGluIGFkdmFuY2VkIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBydWxlcyA9IFtjcmVhdGVQYXJhbWV0ZXJSdWxlKHsgbmFtZTogJ3RlbXBlcmF0dXJlJyB9KV1cbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBydWxlcywgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0FkdmFuY2VkTW9kZTogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS10ZW1wZXJhdHVyZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS1zdG9wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgaW5jbHVkZSBzdG9wIHBhcmFtZXRlciBydWxlIGluIG5vbi1hZHZhbmNlZCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSldXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNBZHZhbmNlZE1vZGU6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXRlbXBlcmF0dXJlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tc3RvcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNJbldvcmtmbG93PXRydWUgdG8gUGFyYW1ldGVySXRlbScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJ1bGVzID0gW2NyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pXVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXRlbXBlcmF0dXJlJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pcy1pbi13b3JrZmxvdycsICd0cnVlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFByb3BzIFRlc3RpbmcgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCB1c2VNb2RlbFBhcmFtZXRlclJ1bGVzIHdpdGggcHJvdmlkZXIgYW5kIG1vZGVsSWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgIG1vZGVsSWQ6ICd0ZXN0LW1vZGVsJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVXNlTW9kZWxQYXJhbWV0ZXJSdWxlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtcHJvdmlkZXInLCAndGVzdC1tb2RlbCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb21wbGV0aW9uIHBhcmFtcyB2YWx1ZSB0byBQYXJhbWV0ZXJJdGVtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSldXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY29tcGxldGlvblBhcmFtczogeyB0ZW1wZXJhdHVyZTogMC44IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS10ZW1wZXJhdHVyZScpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnLCAnMC44JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGNvbXBsZXRpb24gcGFyYW1zIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSldXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY29tcGxldGlvblBhcmFtczoge30sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gd2hlbiB2YWx1ZSBpcyB1bmRlZmluZWQsIEpTT04uc3RyaW5naWZ5IHJldHVybnMgdW5kZWZpbmVkIHN0cmluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkubm90LnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBFdmVudCBIYW5kbGVycyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2hhbmRsZVNlbGVjdFByZXNldFBhcmFtZXRlcicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgQ3JlYXRpdmUgcHJlc2V0IGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBbXSwgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgcHJvdmlkZXI6ICdsYW5nZ2VuaXVzL29wZW5haS9vcGVuYWknLFxuICAgICAgICAgIG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSxcbiAgICAgICAgICBjb21wbGV0aW9uUGFyYW1zOiB7IGV4aXN0aW5nOiAndmFsdWUnIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJlc2V0LWNyZWF0aXZlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBleGlzdGluZzogJ3ZhbHVlJyxcbiAgICAgICAgICB0ZW1wZXJhdHVyZTogMC44LFxuICAgICAgICAgIHRvcF9wOiAwLjksXG4gICAgICAgICAgcHJlc2VuY2VfcGVuYWx0eTogMC4xLFxuICAgICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OiAwLjEsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IEJhbGFuY2VkIHByZXNldCBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogW10sIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIHByb3ZpZGVyOiAnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJyxcbiAgICAgICAgICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgICAgICAgY29tcGxldGlvblBhcmFtczoge30sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJlc2V0LWJhbGFuY2VkJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0ZW1wZXJhdHVyZTogMC41LFxuICAgICAgICAgIHRvcF9wOiAwLjg1LFxuICAgICAgICAgIHByZXNlbmNlX3BlbmFsdHk6IDAuMixcbiAgICAgICAgICBmcmVxdWVuY3lfcGVuYWx0eTogMC4zLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSBQcmVjaXNlIHByZXNldCBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogW10sIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIHByb3ZpZGVyOiAnbGFuZ2dlbml1cy9vcGVuYWkvb3BlbmFpJyxcbiAgICAgICAgICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgICAgICAgY29tcGxldGlvblBhcmFtczoge30sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJlc2V0LXByZWNpc2UnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjIsXG4gICAgICAgICAgdG9wX3A6IDAuNzUsXG4gICAgICAgICAgcHJlc2VuY2VfcGVuYWx0eTogMC41LFxuICAgICAgICAgIGZyZXF1ZW5jeV9wZW5hbHR5OiAwLjUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IGVtcHR5IGNvbmZpZyBmb3IgQ3VzdG9tIHByZXNldCAoc3ByZWFkcyB1bmRlZmluZWQpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IFtdLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBwcm92aWRlcjogJ2xhbmdnZW5pdXMvb3BlbmFpL29wZW5haScsXG4gICAgICAgICAgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlLFxuICAgICAgICAgIGNvbXBsZXRpb25QYXJhbXM6IHsgZXhpc3Rpbmc6ICd2YWx1ZScgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcmVzZXQtY3VzdG9tJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQ3VzdG9tIHByZXNldCBoYXMgbm8gY29uZmlnLCBzbyBvbmx5IGV4aXN0aW5nIHBhcmFtcyBhcmUga2VwdFxuICAgICAgICBleHBlY3Qob25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGV4aXN0aW5nOiAndmFsdWUnIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlUGFyYW1DaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlIHdpdGggdXBkYXRlZCBwYXJhbScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHJ1bGVzID0gW2NyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pXVxuICAgICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSxcbiAgICAgICAgICBjb21wbGV0aW9uUGFyYW1zOiB7IGV4aXN0aW5nOiAndmFsdWUnIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRlbXBlcmF0dXJlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBleGlzdGluZzogJ3ZhbHVlJyxcbiAgICAgICAgICB0ZW1wZXJhdHVyZTogMC41LFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBvdmVycmlkZSBleGlzdGluZyBwYXJhbSB2YWx1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHJ1bGVzID0gW2NyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pXVxuICAgICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSxcbiAgICAgICAgICBjb21wbGV0aW9uUGFyYW1zOiB7IHRlbXBlcmF0dXJlOiAwLjkgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdGVtcGVyYXR1cmUnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLjUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFuZGxlU3dpdGNoJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBhZGQgcGFyYW0gd2hlbiBzd2l0Y2ggaXMgdHVybmVkIG9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScsIGRlZmF1bHQ6IDAuNyB9KV1cbiAgICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgICAgICAgY29tcGxldGlvblBhcmFtczogeyBleGlzdGluZzogJ3ZhbHVlJyB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N3aXRjaC1vbi10ZW1wZXJhdHVyZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgZXhpc3Rpbmc6ICd2YWx1ZScsXG4gICAgICAgICAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVtb3ZlIHBhcmFtIHdoZW4gc3dpdGNoIGlzIHR1cm5lZCBvZmYnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25Db21wbGV0aW9uUGFyYW1zQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBydWxlcyA9IFtjcmVhdGVQYXJhbWV0ZXJSdWxlKHsgbmFtZTogJ3RlbXBlcmF0dXJlJyB9KV1cbiAgICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgICAgICAgY29tcGxldGlvblBhcmFtczogeyB0ZW1wZXJhdHVyZTogMC44LCBvdGhlcjogJ3ZhbHVlJyB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N3aXRjaC1vZmYtdGVtcGVyYXR1cmUnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ29tcGxldGlvblBhcmFtc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIG90aGVyOiAndmFsdWUnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IE1lbW9pemF0aW9uID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIHBhcmFtZXRlclJ1bGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IHdoZW4gZGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlTW9kZWxQYXJhbWV0ZXJSdWxlcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGlzUGVuZGluZzogZmFsc2UsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gbm8gcGFyYW1ldGVyIGl0ZW1zIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKC9wYXJhbWV0ZXItaXRlbS0vKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBkYXRhLmRhdGEgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZU1vZGVsUGFyYW1ldGVyUnVsZXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyBkYXRhOiB1bmRlZmluZWQgfSxcbiAgICAgICAgaXNQZW5kaW5nOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgvcGFyYW1ldGVyLWl0ZW0tLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGRhdGEuZGF0YSB3aGVuIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJ1bGVzID0gW1xuICAgICAgICBjcmVhdGVQYXJhbWV0ZXJSdWxlKHsgbmFtZTogJ3RlbXBlcmF0dXJlJyB9KSxcbiAgICAgICAgY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0b3BfcCcgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdG9wX3AnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjb21wbGV0aW9uUGFyYW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSldXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogcnVsZXMsIGlzUGVuZGluZzogZmFsc2UgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY29tcGxldGlvblBhcmFtczoge30gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBwYXJhbWV0ZXIgcnVsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBydWxlcyA9IFtcbiAgICAgICAgY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSksXG4gICAgICAgIGNyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndG9wX3AnIH0pLFxuICAgICAgICBjcmVhdGVQYXJhbWV0ZXJSdWxlKHsgbmFtZTogJ21heF90b2tlbnMnLCB0eXBlOiAnaW50JyB9KSxcbiAgICAgICAgY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICdwcmVzZW5jZV9wZW5hbHR5JyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBydWxlcywgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS10ZW1wZXJhdHVyZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS10b3BfcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS1tYXhfdG9rZW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcmFtZXRlci1pdGVtLXByZXNlbmNlX3BlbmFsdHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSB1bmlxdWUga2V5cyBmb3IgcGFyYW1ldGVyIGl0ZW1zIGJhc2VkIG9uIG1vZGVsSWQgYW5kIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBydWxlcyA9IFtcbiAgICAgICAgY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSksXG4gICAgICAgIGNyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndG9wX3AnIH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG1vZGVsSWQ6ICdncHQtNCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSB2ZXJpZnkgYm90aCBpdGVtcyBhcmUgcmVuZGVyZWQgKGtleXMgYXJlIGludGVybmFsIGJ1dCByZW5kZXJpbmcgcHJvdmVzIHVuaXF1ZW5lc3MpXG4gICAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10ZXN0aWRePVwicGFyYW1ldGVyLWl0ZW0tXCJdJylcbiAgICAgIGV4cGVjdChpdGVtcykudG9IYXZlTGVuZ3RoKDIpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZS1yZW5kZXIgQmVoYXZpb3IgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlLXJlbmRlciBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBwYXJhbWV0ZXIgaXRlbXMgd2hlbiBydWxlcyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsUnVsZXMgPSBbY3JlYXRlUGFyYW1ldGVyUnVsZSh7IG5hbWU6ICd0ZW1wZXJhdHVyZScgfSldXG4gICAgICBzZXR1cE1vZGVsUGFyYW1ldGVyUnVsZXNNb2NrKHsgZGF0YTogaW5pdGlhbFJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwYXJhbWV0ZXItaXRlbS10b3BfcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBVcGRhdGUgbW9ja1xuICAgICAgY29uc3QgbmV3UnVsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pLFxuICAgICAgICBjcmVhdGVQYXJhbWV0ZXJSdWxlKHsgbmFtZTogJ3RvcF9wJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBuZXdSdWxlcywgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgcmVyZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdG9wX3AnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyB3aGVuIHRyYW5zaXRpb25pbmcgZnJvbSBsb2FkZWQgdG8gbG9hZGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJ1bGVzID0gW2NyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pXVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMTE1QYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tdGVtcGVyYXR1cmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBVcGRhdGUgdG8gbG9hZGluZ1xuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGlzUGVuZGluZzogdHJ1ZSB9KVxuICAgICAgcmVyZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIExvYWRpbmcgY29tcG9uZW50IHVzZXMgcm9sZT1cInN0YXR1c1wiIHdpdGggYXJpYS1sYWJlbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N0YXR1cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHdoZW4gaXNBZHZhbmNlZE1vZGUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJ1bGVzID0gW2NyZWF0ZVBhcmFtZXRlclJ1bGUoeyBuYW1lOiAndGVtcGVyYXR1cmUnIH0pXVxuICAgICAgc2V0dXBNb2RlbFBhcmFtZXRlclJ1bGVzTW9jayh7IGRhdGE6IHJ1bGVzLCBpc1BlbmRpbmc6IGZhbHNlIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzQWR2YW5jZWRNb2RlOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tc3RvcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8TExNUGFyYW1zUGFuZWwgey4uLnByb3BzfSBpc0FkdmFuY2VkTW9kZT17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFyYW1ldGVyLWl0ZW0tc3RvcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDb21wb25lbnQgVHlwZSA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IFR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uYWwgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodHlwZW9mIExMTVBhcmFtc1BhbmVsKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGFsbCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9kZWxQYXJhbWV0ZXJSdWxlc01vY2soeyBkYXRhOiBbXSwgaXNQZW5kaW5nOiBmYWxzZSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPExMTVBhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=