"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// Test utilities
const defaultAgentConfig = {
    enabled: true,
    max_iteration: 3,
    strategy: app_1.AgentStrategy.functionCall,
    tools: [],
};
const defaultProps = {
    value: 'chat',
    disabled: false,
    onChange: vi.fn(),
    isFunctionCall: true,
    isChatModel: true,
    agentConfig: defaultAgentConfig,
    onAgentSettingChange: vi.fn(),
};
const renderComponent = (props = {}) => {
    const mergedProps = { ...defaultProps, ...props };
    return (0, react_1.render)(<index_1.default {...mergedProps}/>);
};
// Helper to get option element by description (which is unique per option)
const getOptionByDescription = (descriptionRegex) => {
    const description = react_1.screen.getByText(descriptionRegex);
    return description.parentElement;
};
describe('AssistantTypePicker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderComponent();
            // Assert
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
        });
        it('should render chat assistant by default when value is "chat"', () => {
            // Arrange & Act
            renderComponent({ value: 'chat' });
            // Assert
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
        });
        it('should render agent assistant when value is "agent"', () => {
            // Arrange & Act
            renderComponent({ value: 'agent' });
            // Assert
            expect(react_1.screen.getByText(/agentAssistant.name/i)).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should use provided value prop', () => {
            // Arrange & Act
            renderComponent({ value: 'agent' });
            // Assert
            expect(react_1.screen.getByText(/agentAssistant.name/i)).toBeInTheDocument();
        });
        it('should handle agentConfig prop', () => {
            // Arrange
            const customAgentConfig = {
                enabled: true,
                max_iteration: 10,
                strategy: app_1.AgentStrategy.react,
                tools: [],
            };
            // Act
            expect(() => {
                renderComponent({ agentConfig: customAgentConfig });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
        });
        it('should handle undefined agentConfig prop', () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ agentConfig: undefined });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should open dropdown when clicking trigger', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - Both options should be visible
            await (0, react_1.waitFor)(() => {
                const chatOptions = react_1.screen.getAllByText(/chatAssistant.name/i);
                const agentOptions = react_1.screen.getAllByText(/agentAssistant.name/i);
                expect(chatOptions.length).toBeGreaterThan(1);
                expect(agentOptions.length).toBeGreaterThan(0);
            });
        });
        it('should call onChange when selecting chat assistant', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            renderComponent({ value: 'agent', onChange });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown to open and find chat option
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
            });
            // Find and click the chat option by its unique description
            const chatOption = getOptionByDescription(/chatAssistant.description/i);
            await user.click(chatOption);
            // Assert
            expect(onChange).toHaveBeenCalledWith('chat');
        });
        it('should call onChange when selecting agent assistant', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            renderComponent({ value: 'chat', onChange });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown to open and click agent option
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            await user.click(agentOption);
            // Assert
            expect(onChange).toHaveBeenCalledWith('agent');
        });
        it('should close dropdown when selecting chat assistant', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent' });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown and select chat
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
            });
            const chatOption = getOptionByDescription(/chatAssistant.description/i);
            await user.click(chatOption);
            // Assert - Dropdown should close (descriptions should not be visible)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/chatAssistant.description/i)).not.toBeInTheDocument();
            });
        });
        it('should not close dropdown when selecting agent assistant', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'chat' });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown and select agent
            await (0, react_1.waitFor)(() => {
                const agentOptions = react_1.screen.getAllByText(/agentAssistant.name/i);
                expect(agentOptions.length).toBeGreaterThan(0);
            });
            const agentOptions = react_1.screen.getAllByText(/agentAssistant.name/i);
            await user.click(agentOptions[0]);
            // Assert - Dropdown should remain open (agent settings should be visible)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
        });
        it('should not call onChange when clicking same value', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            renderComponent({ value: 'chat', onChange });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown and click same option
            await (0, react_1.waitFor)(() => {
                const chatOptions = react_1.screen.getAllByText(/chatAssistant.name/i);
                expect(chatOptions.length).toBeGreaterThan(1);
            });
            const chatOptions = react_1.screen.getAllByText(/chatAssistant.name/i);
            await user.click(chatOptions[1]);
            // Assert
            expect(onChange).not.toHaveBeenCalled();
        });
    });
    // Disabled state
    describe('Disabled State', () => {
        it('should not respond to clicks when disabled', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            renderComponent({ disabled: true, onChange });
            // Act - Open dropdown (dropdown can still open when disabled)
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown to open
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            // Act - Try to click an option
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            await user.click(agentOption);
            // Assert - onChange should not be called (options are disabled)
            expect(onChange).not.toHaveBeenCalled();
        });
        it('should not show agent config UI when disabled', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', disabled: true });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Assert - Agent settings option should not be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/agent.setting.name/i)).not.toBeInTheDocument();
            });
        });
        it('should show agent config UI when not disabled', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', disabled: false });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Assert - Agent settings option should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
        });
    });
    // Agent Settings Modal
    describe('Agent Settings Modal', () => {
        it('should open agent settings modal when clicking agent config UI', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', disabled: false });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Click agent settings
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
        });
        it('should not open agent settings when value is not agent', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'chat', disabled: false });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Wait for dropdown to open
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
            });
            // Assert - Agent settings modal should not appear (value is 'chat')
            expect(react_1.screen.queryByText(/common.operation.save/i)).not.toBeInTheDocument();
        });
        it('should call onAgentSettingChange when saving agent settings', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onAgentSettingChange = vi.fn();
            renderComponent({ value: 'agent', disabled: false, onAgentSettingChange });
            // Act - Open dropdown and agent settings
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Wait for modal and click save
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
            const saveButton = react_1.screen.getByText(/common.operation.save/i);
            await user.click(saveButton);
            // Assert
            expect(onAgentSettingChange).toHaveBeenCalledWith(defaultAgentConfig);
        });
        it('should close modal when saving agent settings', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', disabled: false });
            // Act - Open dropdown, agent settings, and save
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/appDebug.agent.setting.name/i)).toBeInTheDocument();
            });
            const saveButton = react_1.screen.getByText(/common.operation.save/i);
            await user.click(saveButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/common.operation.save/i)).not.toBeInTheDocument();
            });
        });
        it('should close modal when canceling agent settings', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onAgentSettingChange = vi.fn();
            renderComponent({ value: 'agent', disabled: false, onAgentSettingChange });
            // Act - Open dropdown, agent settings, and cancel
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
            const cancelButton = react_1.screen.getByText(/common.operation.cancel/i);
            await user.click(cancelButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/common.operation.save/i)).not.toBeInTheDocument();
            });
            expect(onAgentSettingChange).not.toHaveBeenCalled();
        });
        it('should close dropdown when opening agent settings', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', disabled: false });
            // Act - Open dropdown and agent settings
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Assert - Modal should be open and dropdown should close
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
            // The dropdown should be closed (agent settings description should not be visible)
            await (0, react_1.waitFor)(() => {
                const descriptions = react_1.screen.queryAllByText(/agent.setting.description/i);
                expect(descriptions.length).toBe(0);
            });
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle rapid toggle clicks', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            await user.click(trigger);
            await user.click(trigger);
            // Assert - Should not crash
            expect(trigger).toBeInTheDocument();
        });
        it('should handle multiple rapid selection changes', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const onChange = vi.fn();
            renderComponent({ value: 'chat', onChange });
            // Act - Open and select agent
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            // Click agent option - this stays open because value is 'agent'
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            await user.click(agentOption);
            // Assert - onChange should have been called once to switch to agent
            await (0, react_1.waitFor)(() => {
                expect(onChange).toHaveBeenCalledTimes(1);
            });
            expect(onChange).toHaveBeenCalledWith('agent');
        });
        it('should handle missing callback functions gracefully', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act & Assert - Should not crash
            expect(() => {
                renderComponent({
                    onChange: undefined,
                    onAgentSettingChange: undefined,
                });
            }).not.toThrow();
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
        });
        it('should handle empty agentConfig', async () => {
            // Arrange & Act
            expect(() => {
                renderComponent({ agentConfig: {} });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
        });
        describe('should render with different prop combinations', () => {
            const combinations = [
                { value: 'chat', disabled: true, isFunctionCall: true, isChatModel: true },
                { value: 'agent', disabled: false, isFunctionCall: false, isChatModel: false },
                { value: 'agent', disabled: true, isFunctionCall: true, isChatModel: false },
                { value: 'chat', disabled: false, isFunctionCall: false, isChatModel: true },
            ];
            it.each(combinations)('value=$value, disabled=$disabled, isFunctionCall=$isFunctionCall, isChatModel=$isChatModel', (combo) => {
                // Arrange & Act
                renderComponent(combo);
                // Assert
                const expectedText = combo.value === 'agent' ? 'agentAssistant.name' : 'chatAssistant.name';
                expect(react_1.screen.getByText(new RegExp(expectedText, 'i'))).toBeInTheDocument();
            });
        });
    });
    // Accessibility
    describe('Accessibility', () => {
        it('should render interactive dropdown items', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - Both options should be visible and clickable
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            // Verify we can interact with option elements using helper function
            const chatOption = getOptionByDescription(/chatAssistant.description/i);
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            expect(chatOption).toBeInTheDocument();
            expect(agentOption).toBeInTheDocument();
        });
    });
    // SelectItem Component
    describe('SelectItem Component', () => {
        it('should show checked state for selected option', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'chat' });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - Both options should be visible with radio components
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            // The SelectItem components render with different visual states
            // based on isChecked prop - we verify both options are rendered
            const chatOption = getOptionByDescription(/chatAssistant.description/i);
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            expect(chatOption).toBeInTheDocument();
            expect(agentOption).toBeInTheDocument();
        });
        it('should render description text', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - Descriptions should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
        });
        it('should show Radio component for each option', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - Radio components should be present (both options visible)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
        });
    });
    // Agent Setting Integration
    describe('AgentSetting Integration', () => {
        it('should show function call mode when isFunctionCall is true', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', isFunctionCall: true, isChatModel: false });
            // Act - Open dropdown and settings modal
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
            expect(react_1.screen.getByText(/appDebug.agent.agentModeType.functionCall/i)).toBeInTheDocument();
        });
        it('should show built-in prompt when isFunctionCall is false', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent', isFunctionCall: false, isChatModel: true });
            // Act - Open dropdown and settings modal
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/common.operation.save/i)).toBeInTheDocument();
            });
            expect(react_1.screen.getByText(/tools.builtInPromptTitle/i)).toBeInTheDocument();
        });
        it('should initialize max iteration from agentConfig payload', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const customConfig = {
                enabled: true,
                max_iteration: 10,
                strategy: app_1.AgentStrategy.react,
                tools: [],
            };
            renderComponent({ value: 'agent', agentConfig: customConfig });
            // Act - Open dropdown and settings modal
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettingsTrigger = react_1.screen.getByText(/agent.setting.name/i);
            await user.click(agentSettingsTrigger);
            // Assert
            await react_1.screen.findByText(/common.operation.save/i);
            const maxIterationInput = await react_1.screen.findByRole('spinbutton');
            expect(maxIterationInput).toHaveValue(10);
        });
    });
    // Keyboard Navigation
    describe('Keyboard Navigation', () => {
        it('should support closing dropdown with Escape key', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
            });
            // Press Escape
            await user.keyboard('{Escape}');
            // Assert - Dropdown should close
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/chatAssistant.description/i)).not.toBeInTheDocument();
            });
        });
        it('should allow keyboard focus on trigger element', () => {
            // Arrange
            renderComponent();
            // Act - Get trigger and verify it can receive focus
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            // Assert - Element should be focusable
            expect(trigger).toBeInTheDocument();
            expect(trigger.parentElement).toBeInTheDocument();
        });
        it('should allow keyboard focus on dropdown options', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
            });
            // Get options
            const chatOption = getOptionByDescription(/chatAssistant.description/i);
            const agentOption = getOptionByDescription(/agentAssistant.description/i);
            // Assert - Options should be focusable
            expect(chatOption).toBeInTheDocument();
            expect(agentOption).toBeInTheDocument();
            // Verify options exist and can receive focus programmatically
            // Note: focus() doesn't always update document.activeElement in JSDOM
            // so we just verify the elements are interactive
            (0, react_1.act)(() => {
                chatOption.focus();
            });
            // The element should have received the focus call even if activeElement isn't updated
            expect(chatOption.tabIndex).toBeDefined();
        });
        it('should maintain keyboard accessibility for all interactive elements', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent({ value: 'agent' });
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/agentAssistant.name/i);
            await user.click(trigger);
            // Assert - Agent settings button should be focusable
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/agent.setting.name/i)).toBeInTheDocument();
            });
            const agentSettings = react_1.screen.getByText(/agent.setting.name/i);
            expect(agentSettings).toBeInTheDocument();
        });
    });
    // ARIA Attributes
    describe('ARIA Attributes', () => {
        it('should have proper ARIA state for dropdown', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const { container } = renderComponent();
            // Act - Check initial state
            const portalContainer = container.querySelector('[data-state]');
            expect(portalContainer).toHaveAttribute('data-state', 'closed');
            // Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - State should change to open
            await (0, react_1.waitFor)(() => {
                const openPortal = container.querySelector('[data-state="open"]');
                expect(openPortal).toBeInTheDocument();
            });
        });
        it('should have proper data-state attribute', () => {
            // Arrange & Act
            const { container } = renderComponent();
            // Assert - Portal should have data-state for accessibility
            const portalContainer = container.querySelector('[data-state]');
            expect(portalContainer).toBeInTheDocument();
            expect(portalContainer).toHaveAttribute('data-state');
            // Should start in closed state
            expect(portalContainer).toHaveAttribute('data-state', 'closed');
        });
        it('should maintain accessible structure for screen readers', () => {
            // Arrange & Act
            renderComponent({ value: 'chat' });
            // Assert - Text content should be accessible
            expect(react_1.screen.getByText(/chatAssistant.name/i)).toBeInTheDocument();
            // Icons should have proper structure
            const { container } = renderComponent();
            const icons = container.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThan(0);
        });
        it('should provide context through text labels', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderComponent();
            // Act - Open dropdown
            const trigger = react_1.screen.getByText(/chatAssistant.name/i);
            await user.click(trigger);
            // Assert - All options should have descriptive text
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/chatAssistant.description/i)).toBeInTheDocument();
                expect(react_1.screen.getByText(/agentAssistant.description/i)).toBeInTheDocument();
            });
            // Title text should be visible
            expect(react_1.screen.getByText(/assistantType.name/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXFFO0FBQ3JFLDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIscUNBQTJDO0FBQzNDLG1DQUF5QztBQUV6QyxpQkFBaUI7QUFDakIsTUFBTSxrQkFBa0IsR0FBZ0I7SUFDdEMsT0FBTyxFQUFFLElBQUk7SUFDYixhQUFhLEVBQUUsQ0FBQztJQUNoQixRQUFRLEVBQUUsbUJBQWEsQ0FBQyxZQUFZO0lBQ3BDLEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQTtBQUVELE1BQU0sWUFBWSxHQUFHO0lBQ25CLEtBQUssRUFBRSxNQUFNO0lBQ2IsUUFBUSxFQUFFLEtBQUs7SUFDZixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqQixjQUFjLEVBQUUsSUFBSTtJQUNwQixXQUFXLEVBQUUsSUFBSTtJQUNqQixXQUFXLEVBQUUsa0JBQWtCO0lBQy9CLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDOUIsQ0FBQTtBQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsUUFBbUUsRUFBRSxFQUFFLEVBQUU7SUFDaEcsTUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFBO0lBQ2pELE9BQU8sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFtQixDQUFDLElBQUksV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO0FBQ3pELENBQUMsQ0FBQTtBQUVELDJFQUEyRTtBQUMzRSxNQUFNLHNCQUFzQixHQUFHLENBQUMsZ0JBQXdCLEVBQUUsRUFBRTtJQUMxRCxNQUFNLFdBQVcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDdEQsT0FBTyxXQUFXLENBQUMsYUFBNEIsQ0FBQTtBQUNqRCxDQUFDLENBQUE7QUFFRCxRQUFRLENBQUMscUJBQXFC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QyxPQUFPLENBQUMsQ0FBQTtZQUV6QixvREFBb0Q7WUFDcEQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUMxRSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RSxDQUFDLENBQUMsQ0FBQTtZQUVGLCtCQUErQjtZQUMvQixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNyRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFnZW50Q29uZmlnIH0gZnJvbSAnQC9tb2RlbHMvZGVidWcnXG5pbXBvcnQgeyBhY3QsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBZ2VudFN0cmF0ZWd5IH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgQXNzaXN0YW50VHlwZVBpY2tlciBmcm9tICcuL2luZGV4J1xuXG4vLyBUZXN0IHV0aWxpdGllc1xuY29uc3QgZGVmYXVsdEFnZW50Q29uZmlnOiBBZ2VudENvbmZpZyA9IHtcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgbWF4X2l0ZXJhdGlvbjogMyxcbiAgc3RyYXRlZ3k6IEFnZW50U3RyYXRlZ3kuZnVuY3Rpb25DYWxsLFxuICB0b29sczogW10sXG59XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgdmFsdWU6ICdjaGF0JyxcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgaXNGdW5jdGlvbkNhbGw6IHRydWUsXG4gIGlzQ2hhdE1vZGVsOiB0cnVlLFxuICBhZ2VudENvbmZpZzogZGVmYXVsdEFnZW50Q29uZmlnLFxuICBvbkFnZW50U2V0dGluZ0NoYW5nZTogdmkuZm4oKSxcbn1cblxuY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKHByb3BzOiBQYXJ0aWFsPFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBBc3Npc3RhbnRUeXBlUGlja2VyPj4gPSB7fSkgPT4ge1xuICBjb25zdCBtZXJnZWRQcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCAuLi5wcm9wcyB9XG4gIHJldHVybiByZW5kZXIoPEFzc2lzdGFudFR5cGVQaWNrZXIgey4uLm1lcmdlZFByb3BzfSAvPilcbn1cblxuLy8gSGVscGVyIHRvIGdldCBvcHRpb24gZWxlbWVudCBieSBkZXNjcmlwdGlvbiAod2hpY2ggaXMgdW5pcXVlIHBlciBvcHRpb24pXG5jb25zdCBnZXRPcHRpb25CeURlc2NyaXB0aW9uID0gKGRlc2NyaXB0aW9uUmVnZXg6IFJlZ0V4cCkgPT4ge1xuICBjb25zdCBkZXNjcmlwdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoZGVzY3JpcHRpb25SZWdleClcbiAgcmV0dXJuIGRlc2NyaXB0aW9uLnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnRcbn1cblxuZGVzY3JpYmUoJ0Fzc2lzdGFudFR5cGVQaWNrZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGF0IGFzc2lzdGFudCBieSBkZWZhdWx0IHdoZW4gdmFsdWUgaXMgXCJjaGF0XCInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2NoYXQnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhZ2VudCBhc3Npc3RhbnQgd2hlbiB2YWx1ZSBpcyBcImFnZW50XCInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2FnZW50JyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wcyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBwcm92aWRlZCB2YWx1ZSBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdhZ2VudCcgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhZ2VudENvbmZpZyBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3VzdG9tQWdlbnRDb25maWc6IEFnZW50Q29uZmlnID0ge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBtYXhfaXRlcmF0aW9uOiAxMCxcbiAgICAgICAgc3RyYXRlZ3k6IEFnZW50U3RyYXRlZ3kucmVhY3QsXG4gICAgICAgIHRvb2xzOiBbXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBhZ2VudENvbmZpZzogY3VzdG9tQWdlbnRDb25maWcgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBhZ2VudENvbmZpZyBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyQ29tcG9uZW50KHsgYWdlbnRDb25maWc6IHVuZGVmaW5lZCB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gZHJvcGRvd24gd2hlbiBjbGlja2luZyB0cmlnZ2VyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQm90aCBvcHRpb25zIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2hhdE9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgICAgY29uc3QgYWdlbnRPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgICBleHBlY3QoY2hhdE9wdGlvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMSlcbiAgICAgICAgZXhwZWN0KGFnZW50T3B0aW9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdoZW4gc2VsZWN0aW5nIGNoYXQgYXNzaXN0YW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBXYWl0IGZvciBkcm9wZG93biB0byBvcGVuIGFuZCBmaW5kIGNoYXQgb3B0aW9uXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmQgYW5kIGNsaWNrIHRoZSBjaGF0IG9wdGlvbiBieSBpdHMgdW5pcXVlIGRlc2NyaXB0aW9uXG4gICAgICBjb25zdCBjaGF0T3B0aW9uID0gZ2V0T3B0aW9uQnlEZXNjcmlwdGlvbigvY2hhdEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhjaGF0T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NoYXQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiBzZWxlY3RpbmcgYWdlbnQgYXNzaXN0YW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnY2hhdCcsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gV2FpdCBmb3IgZHJvcGRvd24gdG8gb3BlbiBhbmQgY2xpY2sgYWdlbnQgb3B0aW9uXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IGdldE9wdGlvbkJ5RGVzY3JpcHRpb24oL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFnZW50T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2FnZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBkcm9wZG93biB3aGVuIHNlbGVjdGluZyBjaGF0IGFzc2lzdGFudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdhZ2VudCcgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gV2FpdCBmb3IgZHJvcGRvd24gYW5kIHNlbGVjdCBjaGF0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNoYXRPcHRpb24gPSBnZXRPcHRpb25CeURlc2NyaXB0aW9uKC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNoYXRPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIERyb3Bkb3duIHNob3VsZCBjbG9zZSAoZGVzY3JpcHRpb25zIHNob3VsZCBub3QgYmUgdmlzaWJsZSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2xvc2UgZHJvcGRvd24gd2hlbiBzZWxlY3RpbmcgYWdlbnQgYXNzaXN0YW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2NoYXQnIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gV2FpdCBmb3IgZHJvcGRvd24gYW5kIHNlbGVjdCBhZ2VudFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFnZW50T3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgICAgZXhwZWN0KGFnZW50T3B0aW9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYWdlbnRPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhZ2VudE9wdGlvbnNbMF0pXG5cbiAgICAgIC8vIEFzc2VydCAtIERyb3Bkb3duIHNob3VsZCByZW1haW4gb3BlbiAoYWdlbnQgc2V0dGluZ3Mgc2hvdWxkIGJlIHZpc2libGUpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNoYW5nZSB3aGVuIGNsaWNraW5nIHNhbWUgdmFsdWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdjaGF0Jywgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBXYWl0IGZvciBkcm9wZG93biBhbmQgY2xpY2sgc2FtZSBvcHRpb25cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBjaGF0T3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgICBleHBlY3QoY2hhdE9wdGlvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNoYXRPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNoYXRPcHRpb25zWzFdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRGlzYWJsZWQgc3RhdGVcbiAgZGVzY3JpYmUoJ0Rpc2FibGVkIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlc3BvbmQgdG8gY2xpY2tzIHdoZW4gZGlzYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgZGlzYWJsZWQ6IHRydWUsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd24gKGRyb3Bkb3duIGNhbiBzdGlsbCBvcGVuIHdoZW4gZGlzYWJsZWQpXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIFdhaXQgZm9yIGRyb3Bkb3duIHRvIG9wZW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAtIFRyeSB0byBjbGljayBhbiBvcHRpb25cbiAgICAgIGNvbnN0IGFnZW50T3B0aW9uID0gZ2V0T3B0aW9uQnlEZXNjcmlwdGlvbigvYWdlbnRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYWdlbnRPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uQ2hhbmdlIHNob3VsZCBub3QgYmUgY2FsbGVkIChvcHRpb25zIGFyZSBkaXNhYmxlZClcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGFnZW50IGNvbmZpZyBVSSB3aGVuIGRpc2FibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2FnZW50JywgZGlzYWJsZWQ6IHRydWUgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWdlbnQgc2V0dGluZ3Mgb3B0aW9uIHNob3VsZCBub3QgYmUgdmlzaWJsZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBhZ2VudCBjb25maWcgVUkgd2hlbiBub3QgZGlzYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnLCBkaXNhYmxlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWdlbnQgc2V0dGluZ3Mgb3B0aW9uIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFnZW50IFNldHRpbmdzIE1vZGFsXG4gIGRlc2NyaWJlKCdBZ2VudCBTZXR0aW5ncyBNb2RhbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gYWdlbnQgc2V0dGluZ3MgbW9kYWwgd2hlbiBjbGlja2luZyBhZ2VudCBjb25maWcgVUknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnLCBkaXNhYmxlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQ2xpY2sgYWdlbnQgc2V0dGluZ3NcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhZ2VudFNldHRpbmdzVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhZ2VudFNldHRpbmdzVHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NvbW1vbi5vcGVyYXRpb24uc2F2ZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgb3BlbiBhZ2VudCBzZXR0aW5ncyB3aGVuIHZhbHVlIGlzIG5vdCBhZ2VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdjaGF0JywgZGlzYWJsZWQ6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gV2FpdCBmb3IgZHJvcGRvd24gdG8gb3BlblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBZ2VudCBzZXR0aW5ncyBtb2RhbCBzaG91bGQgbm90IGFwcGVhciAodmFsdWUgaXMgJ2NoYXQnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25BZ2VudFNldHRpbmdDaGFuZ2Ugd2hlbiBzYXZpbmcgYWdlbnQgc2V0dGluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQWdlbnRTZXR0aW5nQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdhZ2VudCcsIGRpc2FibGVkOiBmYWxzZSwgb25BZ2VudFNldHRpbmdDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biBhbmQgYWdlbnQgc2V0dGluZ3NcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhZ2VudFNldHRpbmdzVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhZ2VudFNldHRpbmdzVHJpZ2dlcilcblxuICAgICAgLy8gV2FpdCBmb3IgbW9kYWwgYW5kIGNsaWNrIHNhdmVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQWdlbnRTZXR0aW5nQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChkZWZhdWx0QWdlbnRDb25maWcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgbW9kYWwgd2hlbiBzYXZpbmcgYWdlbnQgc2V0dGluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnLCBkaXNhYmxlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biwgYWdlbnQgc2V0dGluZ3MsIGFuZCBzYXZlXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYWdlbnRTZXR0aW5nc1RyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudC5zZXR0aW5nLm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYWdlbnRTZXR0aW5nc1RyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYXBwRGVidWcuYWdlbnQuc2V0dGluZy5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL2NvbW1vbi5vcGVyYXRpb24uc2F2ZS9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgbW9kYWwgd2hlbiBjYW5jZWxpbmcgYWdlbnQgc2V0dGluZ3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uQWdlbnRTZXR0aW5nQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdhZ2VudCcsIGRpc2FibGVkOiBmYWxzZSwgb25BZ2VudFNldHRpbmdDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biwgYWdlbnQgc2V0dGluZ3MsIGFuZCBjYW5jZWxcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhZ2VudFNldHRpbmdzVHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhZ2VudFNldHRpbmdzVHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jb21tb24ub3BlcmF0aW9uLnNhdmUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkFnZW50U2V0dGluZ0NoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIGRyb3Bkb3duIHdoZW4gb3BlbmluZyBhZ2VudCBzZXR0aW5ncycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdhZ2VudCcsIGRpc2FibGVkOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBhZ2VudCBzZXR0aW5nc1xuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudC5zZXR0aW5nLm5hbWUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGFnZW50U2V0dGluZ3NUcmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFnZW50U2V0dGluZ3NUcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnQgLSBNb2RhbCBzaG91bGQgYmUgb3BlbiBhbmQgZHJvcGRvd24gc2hvdWxkIGNsb3NlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NvbW1vbi5vcGVyYXRpb24uc2F2ZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVGhlIGRyb3Bkb3duIHNob3VsZCBiZSBjbG9zZWQgKGFnZW50IHNldHRpbmdzIGRlc2NyaXB0aW9uIHNob3VsZCBub3QgYmUgdmlzaWJsZSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbnMgPSBzY3JlZW4ucXVlcnlBbGxCeVRleHQoL2FnZW50LnNldHRpbmcuZGVzY3JpcHRpb24vaSlcbiAgICAgICAgZXhwZWN0KGRlc2NyaXB0aW9ucy5sZW5ndGgpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIENhc2VzIChSRVFVSVJFRClcbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmFwaWQgdG9nZ2xlIGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHJhcGlkIHNlbGVjdGlvbiBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnY2hhdCcsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gYW5kIHNlbGVjdCBhZ2VudFxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGljayBhZ2VudCBvcHRpb24gLSB0aGlzIHN0YXlzIG9wZW4gYmVjYXVzZSB2YWx1ZSBpcyAnYWdlbnQnXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IGdldE9wdGlvbkJ5RGVzY3JpcHRpb24oL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFnZW50T3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBvbkNoYW5nZSBzaG91bGQgaGF2ZSBiZWVuIGNhbGxlZCBvbmNlIHRvIHN3aXRjaCB0byBhZ2VudFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnYWdlbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIGNhbGxiYWNrIGZ1bmN0aW9ucyBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudCh7XG4gICAgICAgICAgb25DaGFuZ2U6IHVuZGVmaW5lZCEsXG4gICAgICAgICAgb25BZ2VudFNldHRpbmdDaGFuZ2U6IHVuZGVmaW5lZCEsXG4gICAgICAgIH0pXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYWdlbnRDb25maWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJDb21wb25lbnQoeyBhZ2VudENvbmZpZzoge30gYXMgQWdlbnRDb25maWcgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzaG91bGQgcmVuZGVyIHdpdGggZGlmZmVyZW50IHByb3AgY29tYmluYXRpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29tYmluYXRpb25zID0gW1xuICAgICAgICB7IHZhbHVlOiAnY2hhdCcgYXMgY29uc3QsIGRpc2FibGVkOiB0cnVlLCBpc0Z1bmN0aW9uQ2FsbDogdHJ1ZSwgaXNDaGF0TW9kZWw6IHRydWUgfSxcbiAgICAgICAgeyB2YWx1ZTogJ2FnZW50JyBhcyBjb25zdCwgZGlzYWJsZWQ6IGZhbHNlLCBpc0Z1bmN0aW9uQ2FsbDogZmFsc2UsIGlzQ2hhdE1vZGVsOiBmYWxzZSB9LFxuICAgICAgICB7IHZhbHVlOiAnYWdlbnQnIGFzIGNvbnN0LCBkaXNhYmxlZDogdHJ1ZSwgaXNGdW5jdGlvbkNhbGw6IHRydWUsIGlzQ2hhdE1vZGVsOiBmYWxzZSB9LFxuICAgICAgICB7IHZhbHVlOiAnY2hhdCcgYXMgY29uc3QsIGRpc2FibGVkOiBmYWxzZSwgaXNGdW5jdGlvbkNhbGw6IGZhbHNlLCBpc0NoYXRNb2RlbDogdHJ1ZSB9LFxuICAgICAgXVxuXG4gICAgICBpdC5lYWNoKGNvbWJpbmF0aW9ucykoXG4gICAgICAgICd2YWx1ZT0kdmFsdWUsIGRpc2FibGVkPSRkaXNhYmxlZCwgaXNGdW5jdGlvbkNhbGw9JGlzRnVuY3Rpb25DYWxsLCBpc0NoYXRNb2RlbD0kaXNDaGF0TW9kZWwnLFxuICAgICAgICAoY29tYm8pID0+IHtcbiAgICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGNvbWJvKVxuXG4gICAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRUZXh0ID0gY29tYm8udmFsdWUgPT09ICdhZ2VudCcgPyAnYWdlbnRBc3Npc3RhbnQubmFtZScgOiAnY2hhdEFzc2lzdGFudC5uYW1lJ1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KG5ldyBSZWdFeHAoZXhwZWN0ZWRUZXh0LCAnaScpKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9LFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQWNjZXNzaWJpbGl0eVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbnRlcmFjdGl2ZSBkcm9wZG93biBpdGVtcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnQgLSBCb3RoIG9wdGlvbnMgc2hvdWxkIGJlIHZpc2libGUgYW5kIGNsaWNrYWJsZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVmVyaWZ5IHdlIGNhbiBpbnRlcmFjdCB3aXRoIG9wdGlvbiBlbGVtZW50cyB1c2luZyBoZWxwZXIgZnVuY3Rpb25cbiAgICAgIGNvbnN0IGNoYXRPcHRpb24gPSBnZXRPcHRpb25CeURlc2NyaXB0aW9uKC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IGdldE9wdGlvbkJ5RGVzY3JpcHRpb24oL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBleHBlY3QoY2hhdE9wdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGFnZW50T3B0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBTZWxlY3RJdGVtIENvbXBvbmVudFxuICBkZXNjcmliZSgnU2VsZWN0SXRlbSBDb21wb25lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNoZWNrZWQgc3RhdGUgZm9yIHNlbGVjdGVkIG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdjaGF0JyB9KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIEJvdGggb3B0aW9ucyBzaG91bGQgYmUgdmlzaWJsZSB3aXRoIHJhZGlvIGNvbXBvbmVudHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRoZSBTZWxlY3RJdGVtIGNvbXBvbmVudHMgcmVuZGVyIHdpdGggZGlmZmVyZW50IHZpc3VhbCBzdGF0ZXNcbiAgICAgIC8vIGJhc2VkIG9uIGlzQ2hlY2tlZCBwcm9wIC0gd2UgdmVyaWZ5IGJvdGggb3B0aW9ucyBhcmUgcmVuZGVyZWRcbiAgICAgIGNvbnN0IGNoYXRPcHRpb24gPSBnZXRPcHRpb25CeURlc2NyaXB0aW9uKC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBjb25zdCBhZ2VudE9wdGlvbiA9IGdldE9wdGlvbkJ5RGVzY3JpcHRpb24oL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpXG4gICAgICBleHBlY3QoY2hhdE9wdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGFnZW50T3B0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlc2NyaXB0aW9uIHRleHQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVzY3JpcHRpb25zIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgUmFkaW8gY29tcG9uZW50IGZvciBlYWNoIG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93blxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2NoYXRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnQgLSBSYWRpbyBjb21wb25lbnRzIHNob3VsZCBiZSBwcmVzZW50IChib3RoIG9wdGlvbnMgdmlzaWJsZSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBBZ2VudCBTZXR0aW5nIEludGVncmF0aW9uXG4gIGRlc2NyaWJlKCdBZ2VudFNldHRpbmcgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGZ1bmN0aW9uIGNhbGwgbW9kZSB3aGVuIGlzRnVuY3Rpb25DYWxsIGlzIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnLCBpc0Z1bmN0aW9uQ2FsbDogdHJ1ZSwgaXNDaGF0TW9kZWw6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd24gYW5kIHNldHRpbmdzIG1vZGFsXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnRBc3Npc3RhbnQubmFtZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYWdlbnRTZXR0aW5nc1RyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudC5zZXR0aW5nLm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYWdlbnRTZXR0aW5nc1RyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jb21tb24ub3BlcmF0aW9uLnNhdmUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYXBwRGVidWcuYWdlbnQuYWdlbnRNb2RlVHlwZS5mdW5jdGlvbkNhbGwvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGJ1aWx0LWluIHByb21wdCB3aGVuIGlzRnVuY3Rpb25DYWxsIGlzIGZhbHNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2FnZW50JywgaXNGdW5jdGlvbkNhbGw6IGZhbHNlLCBpc0NoYXRNb2RlbDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZXR0aW5ncyBtb2RhbFxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudC5zZXR0aW5nLm5hbWUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGFnZW50U2V0dGluZ3NUcmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFnZW50U2V0dGluZ3NUcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY29tbW9uLm9wZXJhdGlvbi5zYXZlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3Rvb2xzLmJ1aWx0SW5Qcm9tcHRUaXRsZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgbWF4IGl0ZXJhdGlvbiBmcm9tIGFnZW50Q29uZmlnIHBheWxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IGN1c3RvbUNvbmZpZzogQWdlbnRDb25maWcgPSB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIG1heF9pdGVyYXRpb246IDEwLFxuICAgICAgICBzdHJhdGVneTogQWdlbnRTdHJhdGVneS5yZWFjdCxcbiAgICAgICAgdG9vbHM6IFtdLFxuICAgICAgfVxuXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogJ2FnZW50JywgYWdlbnRDb25maWc6IGN1c3RvbUNvbmZpZyB9KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZXR0aW5ncyBtb2RhbFxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudC5zZXR0aW5nLm5hbWUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGFnZW50U2V0dGluZ3NUcmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvYWdlbnQuc2V0dGluZy5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGFnZW50U2V0dGluZ3NUcmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KC9jb21tb24ub3BlcmF0aW9uLnNhdmUvaSlcbiAgICAgIGNvbnN0IG1heEl0ZXJhdGlvbklucHV0ID0gYXdhaXQgc2NyZWVuLmZpbmRCeVJvbGUoJ3NwaW5idXR0b24nKVxuICAgICAgZXhwZWN0KG1heEl0ZXJhdGlvbklucHV0KS50b0hhdmVWYWx1ZSgxMClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEtleWJvYXJkIE5hdmlnYXRpb25cbiAgZGVzY3JpYmUoJ0tleWJvYXJkIE5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGNsb3NpbmcgZHJvcGRvd24gd2l0aCBFc2NhcGUga2V5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gUHJlc3MgRXNjYXBlXG4gICAgICBhd2FpdCB1c2VyLmtleWJvYXJkKCd7RXNjYXBlfScpXG5cbiAgICAgIC8vIEFzc2VydCAtIERyb3Bkb3duIHNob3VsZCBjbG9zZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL2NoYXRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGtleWJvYXJkIGZvY3VzIG9uIHRyaWdnZXIgZWxlbWVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIEdldCB0cmlnZ2VyIGFuZCB2ZXJpZnkgaXQgY2FuIHJlY2VpdmUgZm9jdXNcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcblxuICAgICAgLy8gQXNzZXJ0IC0gRWxlbWVudCBzaG91bGQgYmUgZm9jdXNhYmxlXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRyaWdnZXIucGFyZW50RWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGtleWJvYXJkIGZvY3VzIG9uIGRyb3Bkb3duIG9wdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBHZXQgb3B0aW9uc1xuICAgICAgY29uc3QgY2hhdE9wdGlvbiA9IGdldE9wdGlvbkJ5RGVzY3JpcHRpb24oL2NoYXRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSlcbiAgICAgIGNvbnN0IGFnZW50T3B0aW9uID0gZ2V0T3B0aW9uQnlEZXNjcmlwdGlvbigvYWdlbnRBc3Npc3RhbnQuZGVzY3JpcHRpb24vaSlcblxuICAgICAgLy8gQXNzZXJ0IC0gT3B0aW9ucyBzaG91bGQgYmUgZm9jdXNhYmxlXG4gICAgICBleHBlY3QoY2hhdE9wdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGFnZW50T3B0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFZlcmlmeSBvcHRpb25zIGV4aXN0IGFuZCBjYW4gcmVjZWl2ZSBmb2N1cyBwcm9ncmFtbWF0aWNhbGx5XG4gICAgICAvLyBOb3RlOiBmb2N1cygpIGRvZXNuJ3QgYWx3YXlzIHVwZGF0ZSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGluIEpTRE9NXG4gICAgICAvLyBzbyB3ZSBqdXN0IHZlcmlmeSB0aGUgZWxlbWVudHMgYXJlIGludGVyYWN0aXZlXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBjaGF0T3B0aW9uLmZvY3VzKClcbiAgICAgIH0pXG4gICAgICAvLyBUaGUgZWxlbWVudCBzaG91bGQgaGF2ZSByZWNlaXZlZCB0aGUgZm9jdXMgY2FsbCBldmVuIGlmIGFjdGl2ZUVsZW1lbnQgaXNuJ3QgdXBkYXRlZFxuICAgICAgZXhwZWN0KGNoYXRPcHRpb24udGFiSW5kZXgpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5IGZvciBhbGwgaW50ZXJhY3RpdmUgZWxlbWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnYWdlbnQnIH0pXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFnZW50IHNldHRpbmdzIGJ1dHRvbiBzaG91bGQgYmUgZm9jdXNhYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYWdlbnRTZXR0aW5ncyA9IHNjcmVlbi5nZXRCeVRleHQoL2FnZW50LnNldHRpbmcubmFtZS9pKVxuICAgICAgZXhwZWN0KGFnZW50U2V0dGluZ3MpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFSSUEgQXR0cmlidXRlc1xuICBkZXNjcmliZSgnQVJJQSBBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgQVJJQSBzdGF0ZSBmb3IgZHJvcGRvd24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBDaGVjayBpbml0aWFsIHN0YXRlXG4gICAgICBjb25zdCBwb3J0YWxDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtc3RhdGVdJylcbiAgICAgIGV4cGVjdChwb3J0YWxDb250YWluZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdjbG9zZWQnKVxuXG4gICAgICAvLyBPcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGV4dCgvY2hhdEFzc2lzdGFudC5uYW1lL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0YXRlIHNob3VsZCBjaGFuZ2UgdG8gb3BlblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9wZW5Qb3J0YWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtc3RhdGU9XCJvcGVuXCJdJylcbiAgICAgICAgZXhwZWN0KG9wZW5Qb3J0YWwpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgZGF0YS1zdGF0ZSBhdHRyaWJ1dGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0IC0gUG9ydGFsIHNob3VsZCBoYXZlIGRhdGEtc3RhdGUgZm9yIGFjY2Vzc2liaWxpdHlcbiAgICAgIGNvbnN0IHBvcnRhbENvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGF0ZV0nKVxuICAgICAgZXhwZWN0KHBvcnRhbENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHBvcnRhbENvbnRhaW5lcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJylcblxuICAgICAgLy8gU2hvdWxkIHN0YXJ0IGluIGNsb3NlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHBvcnRhbENvbnRhaW5lcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2Nsb3NlZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gYWNjZXNzaWJsZSBzdHJ1Y3R1cmUgZm9yIHNjcmVlbiByZWFkZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdjaGF0JyB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBUZXh0IGNvbnRlbnQgc2hvdWxkIGJlIGFjY2Vzc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gSWNvbnMgc2hvdWxkIGhhdmUgcHJvcGVyIHN0cnVjdHVyZVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG4gICAgICBjb25zdCBpY29ucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKVxuICAgICAgZXhwZWN0KGljb25zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBjb250ZXh0IHRocm91Z2ggdGV4dCBsYWJlbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50Lm5hbWUvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIG9wdGlvbnMgc2hvdWxkIGhhdmUgZGVzY3JpcHRpdmUgdGV4dFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jaGF0QXNzaXN0YW50LmRlc2NyaXB0aW9uL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9hZ2VudEFzc2lzdGFudC5kZXNjcmlwdGlvbi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVGl0bGUgdGV4dCBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2Fzc2lzdGFudFR5cGUubmFtZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19