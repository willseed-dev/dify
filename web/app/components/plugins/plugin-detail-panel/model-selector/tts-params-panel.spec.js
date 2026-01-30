"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// Import component after mocks
const tts_params_panel_1 = require("./tts-params-panel");
// ==================== Mock Setup ====================
// All vi.mock() calls are hoisted, so inline all mock data
// Mock languages data with inline definition
vitest_1.vi.mock('@/i18n-config/language', () => ({
    languages: [
        { value: 'en-US', name: 'English (United States)', supported: true },
        { value: 'zh-Hans', name: '简体中文', supported: true },
        { value: 'ja-JP', name: '日本語', supported: true },
        { value: 'unsupported-lang', name: 'Unsupported Language', supported: false },
    ],
}));
// Mock PortalSelect component
vitest_1.vi.mock('@/app/components/base/select', () => ({
    PortalSelect: ({ value, items, onSelect, triggerClassName, popupClassName, popupInnerClassName, }) => (<div data-testid="portal-select" data-value={value} data-trigger-class={triggerClassName} data-popup-class={popupClassName} data-popup-inner-class={popupInnerClassName}>
      <span data-testid="selected-value">{value}</span>
      <div data-testid="items-container">
        {items.map(item => (<button key={item.value} data-testid={`select-item-${item.value}`} onClick={() => onSelect({ value: item.value })}>
            {item.name}
          </button>))}
      </div>
    </div>),
}));
// ==================== Test Utilities ====================
/**
 * Factory function to create a voice item
 */
const createVoiceItem = (overrides = {}) => ({
    mode: 'alloy',
    name: 'Alloy',
    ...overrides,
});
/**
 * Factory function to create a currentModel with voices
 */
const createCurrentModel = (voices = []) => ({
    model_properties: {
        voices,
    },
});
/**
 * Factory function to create default props
 */
const createDefaultProps = (overrides = {}) => ({
    currentModel: createCurrentModel([
        createVoiceItem({ mode: 'alloy', name: 'Alloy' }),
        createVoiceItem({ mode: 'echo', name: 'Echo' }),
        createVoiceItem({ mode: 'fable', name: 'Fable' }),
    ]),
    language: 'en-US',
    voice: 'alloy',
    onChange: vitest_1.vi.fn(),
    ...overrides,
});
// ==================== Tests ====================
(0, vitest_1.describe)('TTSParamsPanel', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render language label', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('appDebug.voice.voiceSettings.language')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render voice label', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('appDebug.voice.voiceSettings.voice')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render two PortalSelect components', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects).toHaveLength(2);
        });
        (0, vitest_1.it)('should render language select with correct value', () => {
            // Arrange
            const props = createDefaultProps({ language: 'zh-Hans' });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-value', 'zh-Hans');
        });
        (0, vitest_1.it)('should render voice select with correct value', () => {
            // Arrange
            const props = createDefaultProps({ voice: 'echo' });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-value', 'echo');
        });
        (0, vitest_1.it)('should only show supported languages in language select', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-en-US')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-zh-Hans')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-ja-JP')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-unsupported-lang')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render voice items from currentModel', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-alloy')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-echo')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-fable')).toBeInTheDocument();
        });
    });
    // ==================== Props Testing ====================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply trigger className to PortalSelect', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-trigger-class', 'h-8');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-trigger-class', 'h-8');
        });
        (0, vitest_1.it)('should apply popup className to PortalSelect', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-popup-class', 'z-[1000]');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-popup-class', 'z-[1000]');
        });
        (0, vitest_1.it)('should apply popup inner className to PortalSelect', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-popup-inner-class', 'w-[354px]');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-popup-inner-class', 'w-[354px]');
        });
    });
    // ==================== Event Handlers ====================
    (0, vitest_1.describe)('Event Handlers', () => {
        (0, vitest_1.describe)('setLanguage', () => {
            (0, vitest_1.it)('should call onChange with new language and current voice', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'en-US',
                    voice: 'alloy',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-zh-Hans'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('zh-Hans', 'alloy');
            });
            (0, vitest_1.it)('should call onChange with different languages', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'en-US',
                    voice: 'echo',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-ja-JP'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('ja-JP', 'echo');
            });
            (0, vitest_1.it)('should preserve voice when changing language', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'en-US',
                    voice: 'fable',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-zh-Hans'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('zh-Hans', 'fable');
            });
        });
        (0, vitest_1.describe)('setVoice', () => {
            (0, vitest_1.it)('should call onChange with current language and new voice', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'en-US',
                    voice: 'alloy',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-echo'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('en-US', 'echo');
            });
            (0, vitest_1.it)('should call onChange with different voices', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'zh-Hans',
                    voice: 'alloy',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-fable'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('zh-Hans', 'fable');
            });
            (0, vitest_1.it)('should preserve language when changing voice', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const props = createDefaultProps({
                    onChange,
                    language: 'ja-JP',
                    voice: 'alloy',
                });
                // Act
                (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('select-item-echo'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('ja-JP', 'echo');
            });
        });
    });
    // ==================== Memoization ====================
    (0, vitest_1.describe)('Memoization - voiceList', () => {
        (0, vitest_1.it)('should return empty array when currentModel is null', () => {
            // Arrange
            const props = createDefaultProps({ currentModel: null });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert - no voice items should be rendered
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-alloy')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-echo')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should return empty array when currentModel is undefined', () => {
            // Arrange
            const props = {
                currentModel: undefined,
                language: 'en-US',
                voice: 'alloy',
                onChange: vitest_1.vi.fn(),
            };
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-alloy')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should map voices with mode as value', () => {
            // Arrange
            const props = createDefaultProps({
                currentModel: createCurrentModel([
                    { mode: 'voice-1', name: 'Voice One' },
                    { mode: 'voice-2', name: 'Voice Two' },
                ]),
            });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-voice-1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-voice-2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle currentModel with empty voices array', () => {
            // Arrange
            const props = createDefaultProps({
                currentModel: createCurrentModel([]),
            });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert - no voice items (except language items)
            const voiceSelects = react_1.screen.getAllByTestId('portal-select');
            // Second select is voice select, should have no voice items in items-container
            const voiceItemsContainer = voiceSelects[1].querySelector('[data-testid="items-container"]');
            (0, vitest_1.expect)(voiceItemsContainer?.children).toHaveLength(0);
        });
        (0, vitest_1.it)('should handle currentModel with single voice', () => {
            // Arrange
            const props = createDefaultProps({
                currentModel: createCurrentModel([
                    { mode: 'single-voice', name: 'Single Voice' },
                ]),
            });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-single-voice')).toBeInTheDocument();
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty language value', () => {
            // Arrange
            const props = createDefaultProps({ language: '' });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-value', '');
        });
        (0, vitest_1.it)('should handle empty voice value', () => {
            // Arrange
            const props = createDefaultProps({ voice: '' });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-value', '');
        });
        (0, vitest_1.it)('should handle many voices', () => {
            // Arrange
            const manyVoices = Array.from({ length: 20 }, (_, i) => ({
                mode: `voice-${i}`,
                name: `Voice ${i}`,
            }));
            const props = createDefaultProps({
                currentModel: createCurrentModel(manyVoices),
            });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-voice-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-voice-19')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle voice with special characters in mode', () => {
            // Arrange
            const props = createDefaultProps({
                currentModel: createCurrentModel([
                    { mode: 'voice-with_special.chars', name: 'Special Voice' },
                ]),
            });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-voice-with_special.chars')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle onChange not being called multiple times', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            const props = createDefaultProps({ onChange });
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-item-echo'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledTimes(1);
        });
    });
    // ==================== Re-render Behavior ====================
    (0, vitest_1.describe)('Re-render Behavior', () => {
        (0, vitest_1.it)('should update when language prop changes', () => {
            // Arrange
            const props = createDefaultProps({ language: 'en-US' });
            // Act
            const { rerender } = (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[0]).toHaveAttribute('data-value', 'en-US');
            rerender(<tts_params_panel_1.default {...props} language="zh-Hans"/>);
            // Assert
            const updatedSelects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(updatedSelects[0]).toHaveAttribute('data-value', 'zh-Hans');
        });
        (0, vitest_1.it)('should update when voice prop changes', () => {
            // Arrange
            const props = createDefaultProps({ voice: 'alloy' });
            // Act
            const { rerender } = (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            const selects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(selects[1]).toHaveAttribute('data-value', 'alloy');
            rerender(<tts_params_panel_1.default {...props} voice="echo"/>);
            // Assert
            const updatedSelects = react_1.screen.getAllByTestId('portal-select');
            (0, vitest_1.expect)(updatedSelects[1]).toHaveAttribute('data-value', 'echo');
        });
        (0, vitest_1.it)('should update voice list when currentModel changes', () => {
            // Arrange
            const initialModel = createCurrentModel([
                { mode: 'alloy', name: 'Alloy' },
            ]);
            const props = createDefaultProps({ currentModel: initialModel });
            // Act
            const { rerender } = (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-alloy')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-nova')).not.toBeInTheDocument();
            const newModel = createCurrentModel([
                { mode: 'alloy', name: 'Alloy' },
                { mode: 'nova', name: 'Nova' },
            ]);
            rerender(<tts_params_panel_1.default {...props} currentModel={newModel}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-alloy')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-nova')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle currentModel becoming null', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-item-alloy')).toBeInTheDocument();
            rerender(<tts_params_panel_1.default {...props} currentModel={null}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('select-item-alloy')).not.toBeInTheDocument();
        });
    });
    // ==================== Component Type ====================
    (0, vitest_1.describe)('Component Type', () => {
        (0, vitest_1.it)('should be a functional component', () => {
            // Assert
            (0, vitest_1.expect)(typeof tts_params_panel_1.default).toBe('function');
        });
        (0, vitest_1.it)('should accept all required props', () => {
            // Arrange
            const props = createDefaultProps();
            // Act & Assert
            (0, vitest_1.expect)(() => (0, react_1.render)(<tts_params_panel_1.default {...props}/>)).not.toThrow();
        });
    });
    // ==================== Accessibility ====================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have proper label structure for language select', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const languageLabel = react_1.screen.getByText('appDebug.voice.voiceSettings.language');
            (0, vitest_1.expect)(languageLabel).toHaveClass('system-sm-semibold');
        });
        (0, vitest_1.it)('should have proper label structure for voice select', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<tts_params_panel_1.default {...props}/>);
            // Assert
            const voiceLabel = react_1.screen.getByText('appDebug.voice.voiceSettings.voice');
            (0, vitest_1.expect)(voiceLabel).toHaveClass('system-sm-semibold');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHRzLXBhcmFtcy1wYW5lbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidHRzLXBhcmFtcy1wYW5lbC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFrRTtBQUNsRSxtQ0FBNkQ7QUFFN0QsK0JBQStCO0FBQy9CLHlEQUErQztBQUUvQyx1REFBdUQ7QUFDdkQsMkRBQTJEO0FBRTNELDZDQUE2QztBQUM3QyxXQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsU0FBUyxFQUFFO1FBQ1QsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFO1FBQ3BFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUU7UUFDbkQsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtRQUNoRCxFQUFFLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRTtLQUM5RTtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsOEJBQThCO0FBQzlCLFdBQUUsQ0FBQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3QyxZQUFZLEVBQUUsQ0FBQyxFQUNiLEtBQUssRUFDTCxLQUFLLEVBQ0wsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsbUJBQW1CLEdBUXBCLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQ0YsV0FBVyxDQUFDLGVBQWUsQ0FDM0IsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2xCLGtCQUFrQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDckMsZ0JBQWdCLENB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QTtRQUNuRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsMERBQTBEO0lBQzFELElBQUEsaUJBQVEsRUFBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLElBQUEsV0FBRSxFQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQywwQkFBYyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXJDLFNBQVM7WUFDVCxNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7WUFDL0UsSUFBQSxlQUFNLEVBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDekQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsMEJBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyQyxTQUFTO1lBQ1QsTUFBTSxVQUFVLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO1lBQ3pFLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuXG4vLyBJbXBvcnQgY29tcG9uZW50IGFmdGVyIG1vY2tzXG5pbXBvcnQgVFRTUGFyYW1zUGFuZWwgZnJvbSAnLi90dHMtcGFyYW1zLXBhbmVsJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBNb2NrIFNldHVwID09PT09PT09PT09PT09PT09PT09XG4vLyBBbGwgdmkubW9jaygpIGNhbGxzIGFyZSBob2lzdGVkLCBzbyBpbmxpbmUgYWxsIG1vY2sgZGF0YVxuXG4vLyBNb2NrIGxhbmd1YWdlcyBkYXRhIHdpdGggaW5saW5lIGRlZmluaXRpb25cbnZpLm1vY2soJ0AvaTE4bi1jb25maWcvbGFuZ3VhZ2UnLCAoKSA9PiAoe1xuICBsYW5ndWFnZXM6IFtcbiAgICB7IHZhbHVlOiAnZW4tVVMnLCBuYW1lOiAnRW5nbGlzaCAoVW5pdGVkIFN0YXRlcyknLCBzdXBwb3J0ZWQ6IHRydWUgfSxcbiAgICB7IHZhbHVlOiAnemgtSGFucycsIG5hbWU6ICfnroDkvZPkuK3mlocnLCBzdXBwb3J0ZWQ6IHRydWUgfSxcbiAgICB7IHZhbHVlOiAnamEtSlAnLCBuYW1lOiAn5pel5pys6KqeJywgc3VwcG9ydGVkOiB0cnVlIH0sXG4gICAgeyB2YWx1ZTogJ3Vuc3VwcG9ydGVkLWxhbmcnLCBuYW1lOiAnVW5zdXBwb3J0ZWQgTGFuZ3VhZ2UnLCBzdXBwb3J0ZWQ6IGZhbHNlIH0sXG4gIF0sXG59KSlcblxuLy8gTW9jayBQb3J0YWxTZWxlY3QgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0JywgKCkgPT4gKHtcbiAgUG9ydGFsU2VsZWN0OiAoe1xuICAgIHZhbHVlLFxuICAgIGl0ZW1zLFxuICAgIG9uU2VsZWN0LFxuICAgIHRyaWdnZXJDbGFzc05hbWUsXG4gICAgcG9wdXBDbGFzc05hbWUsXG4gICAgcG9wdXBJbm5lckNsYXNzTmFtZSxcbiAgfToge1xuICAgIHZhbHVlOiBzdHJpbmdcbiAgICBpdGVtczogQXJyYXk8eyB2YWx1ZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfT5cbiAgICBvblNlbGVjdDogKGl0ZW06IHsgdmFsdWU6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgdHJpZ2dlckNsYXNzTmFtZT86IHN0cmluZ1xuICAgIHBvcHVwQ2xhc3NOYW1lPzogc3RyaW5nXG4gICAgcG9wdXBJbm5lckNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtc2VsZWN0XCJcbiAgICAgIGRhdGEtdmFsdWU9e3ZhbHVlfVxuICAgICAgZGF0YS10cmlnZ2VyLWNsYXNzPXt0cmlnZ2VyQ2xhc3NOYW1lfVxuICAgICAgZGF0YS1wb3B1cC1jbGFzcz17cG9wdXBDbGFzc05hbWV9XG4gICAgICBkYXRhLXBvcHVwLWlubmVyLWNsYXNzPXtwb3B1cElubmVyQ2xhc3NOYW1lfVxuICAgID5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwic2VsZWN0ZWQtdmFsdWVcIj57dmFsdWV9PC9zcGFuPlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIml0ZW1zLWNvbnRhaW5lclwiPlxuICAgICAgICB7aXRlbXMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGtleT17aXRlbS52YWx1ZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgc2VsZWN0LWl0ZW0tJHtpdGVtLnZhbHVlfWB9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdCh7IHZhbHVlOiBpdGVtLnZhbHVlIH0pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtpdGVtLm5hbWV9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdCBVdGlsaXRpZXMgPT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHZvaWNlIGl0ZW1cbiAqL1xuY29uc3QgY3JlYXRlVm9pY2VJdGVtID0gKG92ZXJyaWRlczogUGFydGlhbDx7IG1vZGU6IHN0cmluZywgbmFtZTogc3RyaW5nIH0+ID0ge30pID0+ICh7XG4gIG1vZGU6ICdhbGxveScsXG4gIG5hbWU6ICdBbGxveScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBjdXJyZW50TW9kZWwgd2l0aCB2b2ljZXNcbiAqL1xuY29uc3QgY3JlYXRlQ3VycmVudE1vZGVsID0gKHZvaWNlczogQXJyYXk8eyBtb2RlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9PiA9IFtdKSA9PiAoe1xuICBtb2RlbF9wcm9wZXJ0aWVzOiB7XG4gICAgdm9pY2VzLFxuICB9LFxufSlcblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBkZWZhdWx0IHByb3BzXG4gKi9cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8e1xuICBjdXJyZW50TW9kZWw6IHsgbW9kZWxfcHJvcGVydGllczogeyB2b2ljZXM6IEFycmF5PHsgbW9kZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfT4gfSB9IHwgbnVsbFxuICBsYW5ndWFnZTogc3RyaW5nXG4gIHZvaWNlOiBzdHJpbmdcbiAgb25DaGFuZ2U6IChsYW5ndWFnZTogc3RyaW5nLCB2b2ljZTogc3RyaW5nKSA9PiB2b2lkXG59PiA9IHt9KSA9PiAoe1xuICBjdXJyZW50TW9kZWw6IGNyZWF0ZUN1cnJlbnRNb2RlbChbXG4gICAgY3JlYXRlVm9pY2VJdGVtKHsgbW9kZTogJ2FsbG95JywgbmFtZTogJ0FsbG95JyB9KSxcbiAgICBjcmVhdGVWb2ljZUl0ZW0oeyBtb2RlOiAnZWNobycsIG5hbWU6ICdFY2hvJyB9KSxcbiAgICBjcmVhdGVWb2ljZUl0ZW0oeyBtb2RlOiAnZmFibGUnLCBuYW1lOiAnRmFibGUnIH0pLFxuICBdKSxcbiAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gIHZvaWNlOiAnYWxsb3knLFxuICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1RUU1BhcmFtc1BhbmVsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZW5kZXJpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsYW5ndWFnZSBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLnZvaWNlLnZvaWNlU2V0dGluZ3MubGFuZ3VhZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB2b2ljZSBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcERlYnVnLnZvaWNlLnZvaWNlU2V0dGluZ3Mudm9pY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0d28gUG9ydGFsU2VsZWN0IGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsYW5ndWFnZSBzZWxlY3Qgd2l0aCBjb3JyZWN0IHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBsYW5ndWFnZTogJ3poLUhhbnMnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsICd6aC1IYW5zJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdm9pY2Ugc2VsZWN0IHdpdGggY29ycmVjdCB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdm9pY2U6ICdlY2hvJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzZWxlY3RzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtc2VsZWN0JylcbiAgICAgIGV4cGVjdChzZWxlY3RzWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnLCAnZWNobycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb25seSBzaG93IHN1cHBvcnRlZCBsYW5ndWFnZXMgaW4gbGFuZ3VhZ2Ugc2VsZWN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS1lbi1VUycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS16aC1IYW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLWphLUpQJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tdW5zdXBwb3J0ZWQtbGFuZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB2b2ljZSBpdGVtcyBmcm9tIGN1cnJlbnRNb2RlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tYWxsb3knKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tZWNobycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS1mYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBQcm9wcyBUZXN0aW5nID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IHRyaWdnZXIgY2xhc3NOYW1lIHRvIFBvcnRhbFNlbGVjdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2VsZWN0cyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncG9ydGFsLXNlbGVjdCcpXG4gICAgICBleHBlY3Qoc2VsZWN0c1swXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXRyaWdnZXItY2xhc3MnLCAnaC04JylcbiAgICAgIGV4cGVjdChzZWxlY3RzWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtdHJpZ2dlci1jbGFzcycsICdoLTgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHBvcHVwIGNsYXNzTmFtZSB0byBQb3J0YWxTZWxlY3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1wb3B1cC1jbGFzcycsICd6LVsxMDAwXScpXG4gICAgICBleHBlY3Qoc2VsZWN0c1sxXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXBvcHVwLWNsYXNzJywgJ3otWzEwMDBdJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBwb3B1cCBpbm5lciBjbGFzc05hbWUgdG8gUG9ydGFsU2VsZWN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzZWxlY3RzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtc2VsZWN0JylcbiAgICAgIGV4cGVjdChzZWxlY3RzWzBdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcG9wdXAtaW5uZXItY2xhc3MnLCAndy1bMzU0cHhdJylcbiAgICAgIGV4cGVjdChzZWxlY3RzWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcG9wdXAtaW5uZXItY2xhc3MnLCAndy1bMzU0cHhdJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEV2ZW50IEhhbmRsZXJzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFdmVudCBIYW5kbGVycycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnc2V0TGFuZ3VhZ2UnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBuZXcgbGFuZ3VhZ2UgYW5kIGN1cnJlbnQgdm9pY2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICB2b2ljZTogJ2FsbG95JyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS16aC1IYW5zJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3poLUhhbnMnLCAnYWxsb3knKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZGlmZmVyZW50IGxhbmd1YWdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG9uQ2hhbmdlLFxuICAgICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICAgIHZvaWNlOiAnZWNobycsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tamEtSlAnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnamEtSlAnLCAnZWNobycpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHZvaWNlIHdoZW4gY2hhbmdpbmcgbGFuZ3VhZ2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgICAgICB2b2ljZTogJ2ZhYmxlJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS16aC1IYW5zJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3poLUhhbnMnLCAnZmFibGUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3NldFZvaWNlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggY3VycmVudCBsYW5ndWFnZSBhbmQgbmV3IHZvaWNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICAgICAgdm9pY2U6ICdhbGxveScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tZWNobycpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdlbi1VUycsICdlY2hvJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIGRpZmZlcmVudCB2b2ljZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNoYW5nZSxcbiAgICAgICAgICBsYW5ndWFnZTogJ3poLUhhbnMnLFxuICAgICAgICAgIHZvaWNlOiAnYWxsb3knLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLWZhYmxlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3poLUhhbnMnLCAnZmFibGUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBsYW5ndWFnZSB3aGVuIGNoYW5naW5nIHZvaWNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgb25DaGFuZ2UsXG4gICAgICAgICAgbGFuZ3VhZ2U6ICdqYS1KUCcsXG4gICAgICAgICAgdm9pY2U6ICdhbGxveScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tZWNobycpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdqYS1KUCcsICdlY2hvJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNZW1vaXphdGlvbiA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSB2b2ljZUxpc3QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBjdXJyZW50TW9kZWwgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudE1vZGVsOiBudWxsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBubyB2b2ljZSBpdGVtcyBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tYWxsb3knKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tZWNobycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBhcnJheSB3aGVuIGN1cnJlbnRNb2RlbCBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgY3VycmVudE1vZGVsOiB1bmRlZmluZWQsXG4gICAgICAgIGxhbmd1YWdlOiAnZW4tVVMnLFxuICAgICAgICB2b2ljZTogJ2FsbG95JyxcbiAgICAgICAgb25DaGFuZ2U6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tYWxsb3knKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYXAgdm9pY2VzIHdpdGggbW9kZSBhcyB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3VycmVudE1vZGVsOiBjcmVhdGVDdXJyZW50TW9kZWwoW1xuICAgICAgICAgIHsgbW9kZTogJ3ZvaWNlLTEnLCBuYW1lOiAnVm9pY2UgT25lJyB9LFxuICAgICAgICAgIHsgbW9kZTogJ3ZvaWNlLTInLCBuYW1lOiAnVm9pY2UgVHdvJyB9LFxuICAgICAgICBdKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLXZvaWNlLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tdm9pY2UtMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGN1cnJlbnRNb2RlbCB3aXRoIGVtcHR5IHZvaWNlcyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3VycmVudE1vZGVsOiBjcmVhdGVDdXJyZW50TW9kZWwoW10pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIG5vIHZvaWNlIGl0ZW1zIChleGNlcHQgbGFuZ3VhZ2UgaXRlbXMpXG4gICAgICBjb25zdCB2b2ljZVNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgLy8gU2Vjb25kIHNlbGVjdCBpcyB2b2ljZSBzZWxlY3QsIHNob3VsZCBoYXZlIG5vIHZvaWNlIGl0ZW1zIGluIGl0ZW1zLWNvbnRhaW5lclxuICAgICAgY29uc3Qgdm9pY2VJdGVtc0NvbnRhaW5lciA9IHZvaWNlU2VsZWN0c1sxXS5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWQ9XCJpdGVtcy1jb250YWluZXJcIl0nKVxuICAgICAgZXhwZWN0KHZvaWNlSXRlbXNDb250YWluZXI/LmNoaWxkcmVuKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3VycmVudE1vZGVsIHdpdGggc2luZ2xlIHZvaWNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjdXJyZW50TW9kZWw6IGNyZWF0ZUN1cnJlbnRNb2RlbChbXG4gICAgICAgICAgeyBtb2RlOiAnc2luZ2xlLXZvaWNlJywgbmFtZTogJ1NpbmdsZSBWb2ljZScgfSxcbiAgICAgICAgXSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS1zaW5nbGUtdm9pY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsYW5ndWFnZSB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbGFuZ3VhZ2U6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsICcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB2b2ljZSB2YWx1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdm9pY2U6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsICcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtYW55IHZvaWNlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1hbnlWb2ljZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyMCB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgbW9kZTogYHZvaWNlLSR7aX1gLFxuICAgICAgICBuYW1lOiBgVm9pY2UgJHtpfWAsXG4gICAgICB9KSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3VycmVudE1vZGVsOiBjcmVhdGVDdXJyZW50TW9kZWwobWFueVZvaWNlcyksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS12b2ljZS0wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLXZvaWNlLTE5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdm9pY2Ugd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3VycmVudE1vZGVsOiBjcmVhdGVDdXJyZW50TW9kZWwoW1xuICAgICAgICAgIHsgbW9kZTogJ3ZvaWNlLXdpdGhfc3BlY2lhbC5jaGFycycsIG5hbWU6ICdTcGVjaWFsIFZvaWNlJyB9LFxuICAgICAgICBdKSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLXZvaWNlLXdpdGhfc3BlY2lhbC5jaGFycycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uQ2hhbmdlIG5vdCBiZWluZyBjYWxsZWQgbXVsdGlwbGUgdGltZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtaXRlbS1lY2hvJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFJlLXJlbmRlciBCZWhhdmlvciA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmUtcmVuZGVyIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHdoZW4gbGFuZ3VhZ2UgcHJvcCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBsYW5ndWFnZTogJ2VuLVVTJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IHNlbGVjdHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC1zZWxlY3QnKVxuICAgICAgZXhwZWN0KHNlbGVjdHNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsICdlbi1VUycpXG5cbiAgICAgIHJlcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IGxhbmd1YWdlPVwiemgtSGFuc1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHVwZGF0ZWRTZWxlY3RzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtc2VsZWN0JylcbiAgICAgIGV4cGVjdCh1cGRhdGVkU2VsZWN0c1swXSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXZhbHVlJywgJ3poLUhhbnMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIHZvaWNlIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdm9pY2U6ICdhbGxveScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBzZWxlY3RzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtc2VsZWN0JylcbiAgICAgIGV4cGVjdChzZWxlY3RzWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnLCAnYWxsb3knKVxuXG4gICAgICByZXJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSB2b2ljZT1cImVjaG9cIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB1cGRhdGVkU2VsZWN0cyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncG9ydGFsLXNlbGVjdCcpXG4gICAgICBleHBlY3QodXBkYXRlZFNlbGVjdHNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsICdlY2hvJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdm9pY2UgbGlzdCB3aGVuIGN1cnJlbnRNb2RlbCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5pdGlhbE1vZGVsID0gY3JlYXRlQ3VycmVudE1vZGVsKFtcbiAgICAgICAgeyBtb2RlOiAnYWxsb3knLCBuYW1lOiAnQWxsb3knIH0sXG4gICAgICBdKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50TW9kZWw6IGluaXRpYWxNb2RlbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLWFsbG95JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tbm92YScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBjb25zdCBuZXdNb2RlbCA9IGNyZWF0ZUN1cnJlbnRNb2RlbChbXG4gICAgICAgIHsgbW9kZTogJ2FsbG95JywgbmFtZTogJ0FsbG95JyB9LFxuICAgICAgICB7IG1vZGU6ICdub3ZhJywgbmFtZTogJ05vdmEnIH0sXG4gICAgICBdKVxuICAgICAgcmVyZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gY3VycmVudE1vZGVsPXtuZXdNb2RlbH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tYWxsb3knKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LWl0ZW0tbm92YScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGN1cnJlbnRNb2RlbCBiZWNvbWluZyBudWxsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLWFsbG95JykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgcmVyZW5kZXIoPFRUU1BhcmFtc1BhbmVsIHsuLi5wcm9wc30gY3VycmVudE1vZGVsPXtudWxsfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3NlbGVjdC1pdGVtLWFsbG95JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDb21wb25lbnQgVHlwZSA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IFR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBhIGZ1bmN0aW9uYWwgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodHlwZW9mIFRUU1BhcmFtc1BhbmVsKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGFsbCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gQWNjZXNzaWJpbGl0eSA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGxhYmVsIHN0cnVjdHVyZSBmb3IgbGFuZ3VhZ2Ugc2VsZWN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VFRTUGFyYW1zUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYW5ndWFnZUxhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcudm9pY2Uudm9pY2VTZXR0aW5ncy5sYW5ndWFnZScpXG4gICAgICBleHBlY3QobGFuZ3VhZ2VMYWJlbCkudG9IYXZlQ2xhc3MoJ3N5c3RlbS1zbS1zZW1pYm9sZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgbGFiZWwgc3RydWN0dXJlIGZvciB2b2ljZSBzZWxlY3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxUVFNQYXJhbXNQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHZvaWNlTGFiZWwgPSBzY3JlZW4uZ2V0QnlUZXh0KCdhcHBEZWJ1Zy52b2ljZS52b2ljZVNldHRpbmdzLnZvaWNlJylcbiAgICAgIGV4cGVjdCh2b2ljZUxhYmVsKS50b0hhdmVDbGFzcygnc3lzdGVtLXNtLXNlbWlib2xkJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==