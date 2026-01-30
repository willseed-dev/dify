"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const copy_to_clipboard_1 = require("copy-to-clipboard");
const React = require("react");
const react_2 = require("react");
const types_1 = require("@/app/components/tools/types");
const config_1 = require("@/config");
const debug_configuration_1 = require("@/context/debug-configuration");
const app_1 = require("@/types/app");
const index_1 = require("./index");
const formattingDispatcherMock = vi.fn();
vi.mock('@/app/components/app/configuration/debug/hooks', () => ({
    useFormattingChangedDispatcher: () => formattingDispatcherMock,
}));
let pluginInstallHandler = null;
const subscribeMock = vi.fn((event, handler) => {
    if (event === 'plugin:install:success')
        pluginInstallHandler = handler;
});
vi.mock('@/context/mitt-context', () => ({
    useMittContextSelector: (selector) => selector({
        useSubscribe: subscribeMock,
    }),
}));
let builtInTools = [];
let customTools = [];
let workflowTools = [];
let mcpTools = [];
vi.mock('@/service/use-tools', () => ({
    useAllBuiltInTools: () => ({ data: builtInTools }),
    useAllCustomTools: () => ({ data: customTools }),
    useAllWorkflowTools: () => ({ data: workflowTools }),
    useAllMCPTools: () => ({ data: mcpTools }),
}));
let singleToolSelection = null;
let multipleToolSelection = [];
const ToolPickerMock = (props) => (<div data-testid="tool-picker">
    <div>{props.trigger}</div>
    <button type="button" onClick={() => singleToolSelection && props.onSelect(singleToolSelection)}>
      pick-single
    </button>
    <button type="button" onClick={() => props.onSelectMultiple(multipleToolSelection)}>
      pick-multiple
    </button>
  </div>);
vi.mock('@/app/components/workflow/block-selector/tool-picker', () => ({
    default: (props) => <ToolPickerMock {...props}/>,
}));
let latestSettingPanelProps = null;
let settingPanelSavePayload = {};
let settingPanelCredentialId = 'credential-from-panel';
const SettingBuiltInToolMock = (props) => {
    latestSettingPanelProps = props;
    return (<div data-testid="setting-built-in-tool">
      <span>{props.toolName}</span>
      <button type="button" onClick={() => props.onSave?.(settingPanelSavePayload)}>save-from-panel</button>
      <button type="button" onClick={() => props.onAuthorizationItemClick?.(settingPanelCredentialId)}>auth-from-panel</button>
      <button type="button" onClick={props.onHide}>close-panel</button>
    </div>);
};
vi.mock('./setting-built-in-tool', () => ({
    default: (props) => <SettingBuiltInToolMock {...props}/>,
}));
vi.mock('copy-to-clipboard');
const copyMock = copy_to_clipboard_1.default;
const createToolParameter = (overrides) => ({
    name: 'api_key',
    label: {
        en_US: 'API Key',
        zh_Hans: 'API Key',
    },
    human_description: {
        en_US: 'desc',
        zh_Hans: 'desc',
    },
    type: 'string',
    form: 'config',
    llm_description: '',
    required: true,
    multiple: false,
    default: 'default',
    ...overrides,
});
const createToolDefinition = (overrides) => ({
    name: 'search',
    author: 'tester',
    label: {
        en_US: 'Search',
        zh_Hans: 'Search',
    },
    description: {
        en_US: 'desc',
        zh_Hans: 'desc',
    },
    parameters: [createToolParameter()],
    labels: [],
    output_schema: {},
    ...overrides,
});
const createCollection = (overrides) => ({
    id: overrides?.id || 'provider-1',
    name: overrides?.name || 'vendor/provider-1',
    author: 'tester',
    description: {
        en_US: 'desc',
        zh_Hans: 'desc',
    },
    icon: 'https://example.com/icon.png',
    label: {
        en_US: 'Provider Label',
        zh_Hans: 'Provider Label',
    },
    type: overrides?.type || types_1.CollectionType.builtIn,
    team_credentials: {},
    is_team_authorization: true,
    allow_delete: true,
    labels: [],
    tools: overrides?.tools || [createToolDefinition()],
    meta: {
        version: '1.0.0',
    },
    ...overrides,
});
const createAgentTool = (overrides) => ({
    provider_id: overrides?.provider_id || 'provider-1',
    provider_type: overrides?.provider_type || types_1.CollectionType.builtIn,
    provider_name: overrides?.provider_name || 'vendor/provider-1',
    tool_name: overrides?.tool_name || 'search',
    tool_label: overrides?.tool_label || 'Search Tool',
    tool_parameters: overrides?.tool_parameters || { api_key: 'key' },
    enabled: overrides?.enabled ?? true,
    ...overrides,
});
const createModelConfig = (tools) => ({
    provider: 'OPENAI',
    model_id: 'gpt-3.5-turbo',
    mode: app_1.ModelModeType.chat,
    configs: {
        prompt_template: '',
        prompt_variables: [],
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
    agentConfig: {
        ...config_1.DEFAULT_AGENT_SETTING,
        tools,
    },
});
const renderAgentTools = (initialTools) => {
    const tools = initialTools ?? [createAgentTool()];
    const modelConfigRef = { current: createModelConfig(tools) };
    const Wrapper = ({ children }) => {
        const [modelConfig, setModelConfig] = (0, react_2.useState)(modelConfigRef.current);
        (0, react_2.useEffect)(() => {
            modelConfigRef.current = modelConfig;
        }, [modelConfig]);
        const value = (0, react_2.useMemo)(() => ({
            modelConfig,
            setModelConfig,
        }), [modelConfig]);
        return (<debug_configuration_1.default.Provider value={value}>
        {children}
      </debug_configuration_1.default.Provider>);
    };
    const renderResult = (0, react_1.render)(<Wrapper>
      <index_1.default />
    </Wrapper>);
    return {
        ...renderResult,
        getModelConfig: () => modelConfigRef.current,
    };
};
const hoverInfoIcon = async (rowIndex = 0) => {
    const rows = document.querySelectorAll('.group');
    const infoTrigger = rows.item(rowIndex)?.querySelector('[data-testid="tool-info-tooltip"]');
    if (!infoTrigger)
        throw new Error('Info trigger not found');
    await user_event_1.default.hover(infoTrigger);
};
describe('AgentTools', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        builtInTools = [
            createCollection(),
            createCollection({
                id: 'provider-2',
                name: 'vendor/provider-2',
                tools: [createToolDefinition({
                        name: 'translate',
                        label: {
                            en_US: 'Translate',
                            zh_Hans: 'Translate',
                        },
                    })],
            }),
            createCollection({
                id: 'provider-3',
                name: 'vendor/provider-3',
                tools: [createToolDefinition({
                        name: 'summarize',
                        label: {
                            en_US: 'Summary',
                            zh_Hans: 'Summary',
                        },
                    })],
            }),
        ];
        customTools = [];
        workflowTools = [];
        mcpTools = [];
        singleToolSelection = {
            provider_id: 'provider-3',
            provider_type: types_1.CollectionType.builtIn,
            provider_name: 'vendor/provider-3',
            tool_name: 'summarize',
            tool_label: 'Summary Tool',
            tool_description: 'desc',
            title: 'Summary Tool',
            is_team_authorization: true,
            params: { api_key: 'picker-value' },
            paramSchemas: [],
            output_schema: {},
        };
        multipleToolSelection = [
            {
                provider_id: 'provider-2',
                provider_type: types_1.CollectionType.builtIn,
                provider_name: 'vendor/provider-2',
                tool_name: 'translate',
                tool_label: 'Translate Tool',
                tool_description: 'desc',
                title: 'Translate Tool',
                is_team_authorization: true,
                params: { api_key: 'multi-a' },
                paramSchemas: [],
                output_schema: {},
            },
            {
                provider_id: 'provider-3',
                provider_type: types_1.CollectionType.builtIn,
                provider_name: 'vendor/provider-3',
                tool_name: 'summarize',
                tool_label: 'Summary Tool',
                tool_description: 'desc',
                title: 'Summary Tool',
                is_team_authorization: true,
                params: { api_key: 'multi-b' },
                paramSchemas: [],
                output_schema: {},
            },
        ];
        latestSettingPanelProps = null;
        settingPanelSavePayload = {};
        settingPanelCredentialId = 'credential-from-panel';
        pluginInstallHandler = null;
    });
    it('should show enabled count and provider information', () => {
        renderAgentTools([
            createAgentTool(),
            createAgentTool({
                provider_id: 'provider-2',
                provider_name: 'vendor/provider-2',
                tool_name: 'translate',
                tool_label: 'Translate Tool',
                enabled: false,
            }),
        ]);
        const enabledText = react_1.screen.getByText(content => content.includes('appDebug.agent.tools.enabled'));
        expect(enabledText).toHaveTextContent('1/2');
        expect(react_1.screen.getByText('provider-1')).toBeInTheDocument();
        expect(react_1.screen.getByText('Translate Tool')).toBeInTheDocument();
    });
    it('should copy tool name from tooltip action', async () => {
        renderAgentTools();
        await hoverInfoIcon();
        const copyButton = await react_1.screen.findByText('tools.copyToolName');
        await user_event_1.default.click(copyButton);
        expect(copyMock).toHaveBeenCalledWith('search');
    });
    it('should toggle tool enabled state via switch', async () => {
        const { getModelConfig } = renderAgentTools();
        const switchButton = react_1.screen.getByRole('switch');
        await user_event_1.default.click(switchButton);
        await (0, react_1.waitFor)(() => {
            const tools = getModelConfig().agentConfig.tools;
            const toggledTool = tools.find(tool => tool.tool_name === 'search');
            expect(toggledTool?.enabled).toBe(false);
        });
        expect(formattingDispatcherMock).toHaveBeenCalled();
    });
    it('should remove tool when delete action is clicked', async () => {
        const { getModelConfig } = renderAgentTools();
        const deleteButton = react_1.screen.getByTestId('delete-removed-tool');
        if (!deleteButton)
            throw new Error('Delete button not found');
        await user_event_1.default.click(deleteButton);
        await (0, react_1.waitFor)(() => {
            expect(getModelConfig().agentConfig.tools).toHaveLength(0);
        });
        expect(formattingDispatcherMock).toHaveBeenCalled();
    });
    it('should add a tool when ToolPicker selects one', async () => {
        const { getModelConfig } = renderAgentTools([]);
        const addSingleButton = react_1.screen.getByRole('button', { name: 'pick-single' });
        await user_event_1.default.click(addSingleButton);
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('Summary Tool')).toBeInTheDocument();
        });
        expect(getModelConfig().agentConfig.tools).toHaveLength(1);
    });
    it('should append multiple selected tools at once', async () => {
        const { getModelConfig } = renderAgentTools([]);
        await user_event_1.default.click(react_1.screen.getByRole('button', { name: 'pick-multiple' }));
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('Translate Tool')).toBeInTheDocument();
            expect(react_1.screen.getAllByText('Summary Tool')).toHaveLength(1);
        });
        expect(getModelConfig().agentConfig.tools).toHaveLength(2);
    });
    it('should open settings panel for not authorized tool', async () => {
        renderAgentTools([
            createAgentTool({
                notAuthor: true,
            }),
        ]);
        const notAuthorizedButton = react_1.screen.getByRole('button', { name: /tools.notAuthorized/ });
        await user_event_1.default.click(notAuthorizedButton);
        expect(react_1.screen.getByTestId('setting-built-in-tool')).toBeInTheDocument();
        expect(latestSettingPanelProps?.toolName).toBe('search');
    });
    it('should persist tool parameters when SettingBuiltInTool saves values', async () => {
        const { getModelConfig } = renderAgentTools([
            createAgentTool({
                notAuthor: true,
            }),
        ]);
        await user_event_1.default.click(react_1.screen.getByRole('button', { name: /tools.notAuthorized/ }));
        settingPanelSavePayload = { api_key: 'updated' };
        await user_event_1.default.click(react_1.screen.getByRole('button', { name: 'save-from-panel' }));
        await (0, react_1.waitFor)(() => {
            expect(getModelConfig().agentConfig.tools[0].tool_parameters).toEqual({ api_key: 'updated' });
        });
    });
    it('should update credential id when authorization selection changes', async () => {
        const { getModelConfig } = renderAgentTools([
            createAgentTool({
                notAuthor: true,
            }),
        ]);
        await user_event_1.default.click(react_1.screen.getByRole('button', { name: /tools.notAuthorized/ }));
        settingPanelCredentialId = 'credential-123';
        await user_event_1.default.click(react_1.screen.getByRole('button', { name: 'auth-from-panel' }));
        await (0, react_1.waitFor)(() => {
            expect(getModelConfig().agentConfig.tools[0].credential_id).toBe('credential-123');
        });
        expect(formattingDispatcherMock).toHaveBeenCalled();
    });
    it('should reinstate deleted tools after plugin install success event', async () => {
        const { getModelConfig } = renderAgentTools([
            createAgentTool({
                provider_id: 'provider-1',
                provider_name: 'vendor/provider-1',
                tool_name: 'search',
                tool_label: 'Search Tool',
                isDeleted: true,
            }),
        ]);
        if (!pluginInstallHandler)
            throw new Error('Plugin handler not registered');
        await (0, react_1.act)(async () => {
            pluginInstallHandler?.(['provider-1']);
        });
        await (0, react_1.waitFor)(() => {
            expect(getModelConfig().agentConfig.tools[0].isDeleted).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0Esa0RBQXFFO0FBQ3JFLDREQUFtRDtBQUNuRCx5REFBb0M7QUFDcEMsK0JBQThCO0FBQzlCLGlDQUljO0FBQ2Qsd0RBQTZEO0FBQzdELHFDQUlpQjtBQUNqQix1RUFBeUQ7QUFDekQscUNBQTJDO0FBQzNDLG1DQUFnQztBQUVoQyxNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN4QyxFQUFFLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0QsOEJBQThCLEVBQUUsR0FBRyxFQUFFLENBQUMsd0JBQXdCO0NBQy9ELENBQUMsQ0FBQyxDQUFBO0FBRUgsSUFBSSxvQkFBb0IsR0FBdUMsSUFBSSxDQUFBO0FBQ25FLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFhLEVBQUUsT0FBWSxFQUFFLEVBQUU7SUFDMUQsSUFBSSxLQUFLLEtBQUssd0JBQXdCO1FBQ3BDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQTtBQUNsQyxDQUFDLENBQUMsQ0FBQTtBQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QyxzQkFBc0IsRUFBRSxDQUFDLFFBQWEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ2xELFlBQVksRUFBRSxhQUFhO0tBQzVCLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksWUFBWSxHQUF1QixFQUFFLENBQUE7QUFDekMsSUFBSSxXQUFXLEdBQXVCLEVBQUUsQ0FBQTtBQUN4QyxJQUFJLGFBQWEsR0FBdUIsRUFBRSxDQUFBO0FBQzFDLElBQUksUUFBUSxHQUF1QixFQUFFLENBQUE7QUFDckMsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFB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RUFBRTtRQUNqRixNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7WUFDMUMsZUFBZSxDQUFDO2dCQUNkLFdBQVcsRUFBRSxZQUFZO2dCQUN6QixhQUFhLEVBQUUsbUJBQW1CO2dCQUNsQyxTQUFTLEVBQUUsUUFBUTtnQkFDbkIsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCLENBQUM7U0FDSCxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsb0JBQW9CO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUVsRCxNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO1lBQ25CLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7WUFDakIsTUFBTSxDQUFFLGNBQWMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNqRyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIFByb3BzV2l0aENoaWxkcmVuLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIFNldHRpbmdCdWlsdEluVG9vbFR5cGUgZnJvbSAnLi9zZXR0aW5nLWJ1aWx0LWluLXRvb2wnXG5pbXBvcnQgdHlwZSB7IFRvb2wsIFRvb2xQYXJhbWV0ZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHR5cGUgVG9vbFBpY2tlclR5cGUgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90b29sLXBpY2tlcidcbmltcG9ydCB0eXBlIHsgVG9vbERlZmF1bHRWYWx1ZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFRvb2xXaXRoUHJvdmlkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBNb2RlbENvbmZpZyB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuaW1wb3J0IHR5cGUgeyBBZ2VudFRvb2wgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGFjdCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgY29weSBmcm9tICdjb3B5LXRvLWNsaXBib2FyZCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgdXNlRWZmZWN0LFxuICB1c2VNZW1vLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDb2xsZWN0aW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQge1xuICBERUZBVUxUX0FHRU5UX1NFVFRJTkcsXG4gIERFRkFVTFRfQ0hBVF9QUk9NUFRfQ09ORklHLFxuICBERUZBVUxUX0NPTVBMRVRJT05fUFJPTVBUX0NPTkZJRyxcbn0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgQ29uZmlnQ29udGV4dCBmcm9tICdAL2NvbnRleHQvZGVidWctY29uZmlndXJhdGlvbidcbmltcG9ydCB7IE1vZGVsTW9kZVR5cGUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBBZ2VudFRvb2xzIGZyb20gJy4vaW5kZXgnXG5cbmNvbnN0IGZvcm1hdHRpbmdEaXNwYXRjaGVyTW9jayA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vZGVidWcvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VGb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXI6ICgpID0+IGZvcm1hdHRpbmdEaXNwYXRjaGVyTW9jayxcbn0pKVxuXG5sZXQgcGx1Z2luSW5zdGFsbEhhbmRsZXI6ICgobmFtZXM6IHN0cmluZ1tdKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5jb25zdCBzdWJzY3JpYmVNb2NrID0gdmkuZm4oKGV2ZW50OiBzdHJpbmcsIGhhbmRsZXI6IGFueSkgPT4ge1xuICBpZiAoZXZlbnQgPT09ICdwbHVnaW46aW5zdGFsbDpzdWNjZXNzJylcbiAgICBwbHVnaW5JbnN0YWxsSGFuZGxlciA9IGhhbmRsZXJcbn0pXG52aS5tb2NrKCdAL2NvbnRleHQvbWl0dC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTWl0dENvbnRleHRTZWxlY3RvcjogKHNlbGVjdG9yOiBhbnkpID0+IHNlbGVjdG9yKHtcbiAgICB1c2VTdWJzY3JpYmU6IHN1YnNjcmliZU1vY2ssXG4gIH0pLFxufSkpXG5cbmxldCBidWlsdEluVG9vbHM6IFRvb2xXaXRoUHJvdmlkZXJbXSA9IFtdXG5sZXQgY3VzdG9tVG9vbHM6IFRvb2xXaXRoUHJvdmlkZXJbXSA9IFtdXG5sZXQgd29ya2Zsb3dUb29sczogVG9vbFdpdGhQcm92aWRlcltdID0gW11cbmxldCBtY3BUb29sczogVG9vbFdpdGhQcm92aWRlcltdID0gW11cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdG9vbHMnLCAoKSA9PiAoe1xuICB1c2VBbGxCdWlsdEluVG9vbHM6ICgpID0+ICh7IGRhdGE6IGJ1aWx0SW5Ub29scyB9KSxcbiAgdXNlQWxsQ3VzdG9tVG9vbHM6ICgpID0+ICh7IGRhdGE6IGN1c3RvbVRvb2xzIH0pLFxuICB1c2VBbGxXb3JrZmxvd1Rvb2xzOiAoKSA9PiAoeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0pLFxuICB1c2VBbGxNQ1BUb29sczogKCkgPT4gKHsgZGF0YTogbWNwVG9vbHMgfSksXG59KSlcblxudHlwZSBUb29sUGlja2VyUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgVG9vbFBpY2tlclR5cGU+XG5sZXQgc2luZ2xlVG9vbFNlbGVjdGlvbjogVG9vbERlZmF1bHRWYWx1ZSB8IG51bGwgPSBudWxsXG5sZXQgbXVsdGlwbGVUb29sU2VsZWN0aW9uOiBUb29sRGVmYXVsdFZhbHVlW10gPSBbXVxuY29uc3QgVG9vbFBpY2tlck1vY2sgPSAocHJvcHM6IFRvb2xQaWNrZXJQcm9wcykgPT4gKFxuICA8ZGl2IGRhdGEtdGVzdGlkPVwidG9vbC1waWNrZXJcIj5cbiAgICA8ZGl2Pntwcm9wcy50cmlnZ2VyfTwvZGl2PlxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17KCkgPT4gc2luZ2xlVG9vbFNlbGVjdGlvbiAmJiBwcm9wcy5vblNlbGVjdChzaW5nbGVUb29sU2VsZWN0aW9uKX1cbiAgICA+XG4gICAgICBwaWNrLXNpbmdsZVxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b25cbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMub25TZWxlY3RNdWx0aXBsZShtdWx0aXBsZVRvb2xTZWxlY3Rpb24pfVxuICAgID5cbiAgICAgIHBpY2stbXVsdGlwbGVcbiAgICA8L2J1dHRvbj5cbiAgPC9kaXY+XG4pXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3Rvb2wtcGlja2VyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBUb29sUGlja2VyUHJvcHMpID0+IDxUb29sUGlja2VyTW9jayB7Li4ucHJvcHN9IC8+LFxufSkpXG5cbnR5cGUgU2V0dGluZ0J1aWx0SW5Ub29sUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgU2V0dGluZ0J1aWx0SW5Ub29sVHlwZT5cbmxldCBsYXRlc3RTZXR0aW5nUGFuZWxQcm9wczogU2V0dGluZ0J1aWx0SW5Ub29sUHJvcHMgfCBudWxsID0gbnVsbFxubGV0IHNldHRpbmdQYW5lbFNhdmVQYXlsb2FkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbmxldCBzZXR0aW5nUGFuZWxDcmVkZW50aWFsSWQgPSAnY3JlZGVudGlhbC1mcm9tLXBhbmVsJ1xuY29uc3QgU2V0dGluZ0J1aWx0SW5Ub29sTW9jayA9IChwcm9wczogU2V0dGluZ0J1aWx0SW5Ub29sUHJvcHMpID0+IHtcbiAgbGF0ZXN0U2V0dGluZ1BhbmVsUHJvcHMgPSBwcm9wc1xuICByZXR1cm4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXR0aW5nLWJ1aWx0LWluLXRvb2xcIj5cbiAgICAgIDxzcGFuPntwcm9wcy50b29sTmFtZX08L3NwYW4+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5vblNhdmU/LihzZXR0aW5nUGFuZWxTYXZlUGF5bG9hZCl9PnNhdmUtZnJvbS1wYW5lbDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gcHJvcHMub25BdXRob3JpemF0aW9uSXRlbUNsaWNrPy4oc2V0dGluZ1BhbmVsQ3JlZGVudGlhbElkKX0+YXV0aC1mcm9tLXBhbmVsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtwcm9wcy5vbkhpZGV9PmNsb3NlLXBhbmVsPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cbnZpLm1vY2soJy4vc2V0dGluZy1idWlsdC1pbi10b29sJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBTZXR0aW5nQnVpbHRJblRvb2xQcm9wcykgPT4gPFNldHRpbmdCdWlsdEluVG9vbE1vY2sgey4uLnByb3BzfSAvPixcbn0pKVxuXG52aS5tb2NrKCdjb3B5LXRvLWNsaXBib2FyZCcpXG5cbmNvbnN0IGNvcHlNb2NrID0gY29weSBhcyBNb2NrXG5cbmNvbnN0IGNyZWF0ZVRvb2xQYXJhbWV0ZXIgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxUb29sUGFyYW1ldGVyPik6IFRvb2xQYXJhbWV0ZXIgPT4gKHtcbiAgbmFtZTogJ2FwaV9rZXknLFxuICBsYWJlbDoge1xuICAgIGVuX1VTOiAnQVBJIEtleScsXG4gICAgemhfSGFuczogJ0FQSSBLZXknLFxuICB9LFxuICBodW1hbl9kZXNjcmlwdGlvbjoge1xuICAgIGVuX1VTOiAnZGVzYycsXG4gICAgemhfSGFuczogJ2Rlc2MnLFxuICB9LFxuICB0eXBlOiAnc3RyaW5nJyxcbiAgZm9ybTogJ2NvbmZpZycsXG4gIGxsbV9kZXNjcmlwdGlvbjogJycsXG4gIHJlcXVpcmVkOiB0cnVlLFxuICBtdWx0aXBsZTogZmFsc2UsXG4gIGRlZmF1bHQ6ICdkZWZhdWx0JyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlVG9vbERlZmluaXRpb24gPSAob3ZlcnJpZGVzPzogUGFydGlhbDxUb29sPik6IFRvb2wgPT4gKHtcbiAgbmFtZTogJ3NlYXJjaCcsXG4gIGF1dGhvcjogJ3Rlc3RlcicsXG4gIGxhYmVsOiB7XG4gICAgZW5fVVM6ICdTZWFyY2gnLFxuICAgIHpoX0hhbnM6ICdTZWFyY2gnLFxuICB9LFxuICBkZXNjcmlwdGlvbjoge1xuICAgIGVuX1VTOiAnZGVzYycsXG4gICAgemhfSGFuczogJ2Rlc2MnLFxuICB9LFxuICBwYXJhbWV0ZXJzOiBbY3JlYXRlVG9vbFBhcmFtZXRlcigpXSxcbiAgbGFiZWxzOiBbXSxcbiAgb3V0cHV0X3NjaGVtYToge30sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZUNvbGxlY3Rpb24gPSAob3ZlcnJpZGVzPzogUGFydGlhbDxUb29sV2l0aFByb3ZpZGVyPik6IFRvb2xXaXRoUHJvdmlkZXIgPT4gKHtcbiAgaWQ6IG92ZXJyaWRlcz8uaWQgfHwgJ3Byb3ZpZGVyLTEnLFxuICBuYW1lOiBvdmVycmlkZXM/Lm5hbWUgfHwgJ3ZlbmRvci9wcm92aWRlci0xJyxcbiAgYXV0aG9yOiAndGVzdGVyJyxcbiAgZGVzY3JpcHRpb246IHtcbiAgICBlbl9VUzogJ2Rlc2MnLFxuICAgIHpoX0hhbnM6ICdkZXNjJyxcbiAgfSxcbiAgaWNvbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmcnLFxuICBsYWJlbDoge1xuICAgIGVuX1VTOiAnUHJvdmlkZXIgTGFiZWwnLFxuICAgIHpoX0hhbnM6ICdQcm92aWRlciBMYWJlbCcsXG4gIH0sXG4gIHR5cGU6IG92ZXJyaWRlcz8udHlwZSB8fCBDb2xsZWN0aW9uVHlwZS5idWlsdEluLFxuICB0ZWFtX2NyZWRlbnRpYWxzOiB7fSxcbiAgaXNfdGVhbV9hdXRob3JpemF0aW9uOiB0cnVlLFxuICBhbGxvd19kZWxldGU6IHRydWUsXG4gIGxhYmVsczogW10sXG4gIHRvb2xzOiBvdmVycmlkZXM/LnRvb2xzIHx8IFtjcmVhdGVUb29sRGVmaW5pdGlvbigpXSxcbiAgbWV0YToge1xuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZUFnZW50VG9vbCA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEFnZW50VG9vbD4pOiBBZ2VudFRvb2wgPT4gKHtcbiAgcHJvdmlkZXJfaWQ6IG92ZXJyaWRlcz8ucHJvdmlkZXJfaWQgfHwgJ3Byb3ZpZGVyLTEnLFxuICBwcm92aWRlcl90eXBlOiBvdmVycmlkZXM/LnByb3ZpZGVyX3R5cGUgfHwgQ29sbGVjdGlvblR5cGUuYnVpbHRJbixcbiAgcHJvdmlkZXJfbmFtZTogb3ZlcnJpZGVzPy5wcm92aWRlcl9uYW1lIHx8ICd2ZW5kb3IvcHJvdmlkZXItMScsXG4gIHRvb2xfbmFtZTogb3ZlcnJpZGVzPy50b29sX25hbWUgfHwgJ3NlYXJjaCcsXG4gIHRvb2xfbGFiZWw6IG92ZXJyaWRlcz8udG9vbF9sYWJlbCB8fCAnU2VhcmNoIFRvb2wnLFxuICB0b29sX3BhcmFtZXRlcnM6IG92ZXJyaWRlcz8udG9vbF9wYXJhbWV0ZXJzIHx8IHsgYXBpX2tleTogJ2tleScgfSxcbiAgZW5hYmxlZDogb3ZlcnJpZGVzPy5lbmFibGVkID8/IHRydWUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vZGVsQ29uZmlnID0gKHRvb2xzOiBBZ2VudFRvb2xbXSk6IE1vZGVsQ29uZmlnID0+ICh7XG4gIHByb3ZpZGVyOiAnT1BFTkFJJyxcbiAgbW9kZWxfaWQ6ICdncHQtMy41LXR1cmJvJyxcbiAgbW9kZTogTW9kZWxNb2RlVHlwZS5jaGF0LFxuICBjb25maWdzOiB7XG4gICAgcHJvbXB0X3RlbXBsYXRlOiAnJyxcbiAgICBwcm9tcHRfdmFyaWFibGVzOiBbXSxcbiAgfSxcbiAgY2hhdF9wcm9tcHRfY29uZmlnOiBERUZBVUxUX0NIQVRfUFJPTVBUX0NPTkZJRyxcbiAgY29tcGxldGlvbl9wcm9tcHRfY29uZmlnOiBERUZBVUxUX0NPTVBMRVRJT05fUFJPTVBUX0NPTkZJRyxcbiAgb3BlbmluZ19zdGF0ZW1lbnQ6ICcnLFxuICBtb3JlX2xpa2VfdGhpczogbnVsbCxcbiAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogW10sXG4gIHN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyOiBudWxsLFxuICBzcGVlY2hfdG9fdGV4dDogbnVsbCxcbiAgdGV4dF90b19zcGVlY2g6IG51bGwsXG4gIGZpbGVfdXBsb2FkOiBudWxsLFxuICByZXRyaWV2ZXJfcmVzb3VyY2U6IG51bGwsXG4gIHNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZTogbnVsbCxcbiAgYW5ub3RhdGlvbl9yZXBseTogbnVsbCxcbiAgZXh0ZXJuYWxfZGF0YV90b29sczogW10sXG4gIHN5c3RlbV9wYXJhbWV0ZXJzOiB7XG4gICAgYXVkaW9fZmlsZV9zaXplX2xpbWl0OiAwLFxuICAgIGZpbGVfc2l6ZV9saW1pdDogMCxcbiAgICBpbWFnZV9maWxlX3NpemVfbGltaXQ6IDAsXG4gICAgdmlkZW9fZmlsZV9zaXplX2xpbWl0OiAwLFxuICAgIHdvcmtmbG93X2ZpbGVfdXBsb2FkX2xpbWl0OiAwLFxuICB9LFxuICBkYXRhU2V0czogW10sXG4gIGFnZW50Q29uZmlnOiB7XG4gICAgLi4uREVGQVVMVF9BR0VOVF9TRVRUSU5HLFxuICAgIHRvb2xzLFxuICB9LFxufSlcblxuY29uc3QgcmVuZGVyQWdlbnRUb29scyA9IChpbml0aWFsVG9vbHM/OiBBZ2VudFRvb2xbXSkgPT4ge1xuICBjb25zdCB0b29scyA9IGluaXRpYWxUb29scyA/PyBbY3JlYXRlQWdlbnRUb29sKCldXG4gIGNvbnN0IG1vZGVsQ29uZmlnUmVmID0geyBjdXJyZW50OiBjcmVhdGVNb2RlbENvbmZpZyh0b29scykgfVxuICBjb25zdCBXcmFwcGVyID0gKHsgY2hpbGRyZW4gfTogUHJvcHNXaXRoQ2hpbGRyZW4pID0+IHtcbiAgICBjb25zdCBbbW9kZWxDb25maWcsIHNldE1vZGVsQ29uZmlnXSA9IHVzZVN0YXRlPE1vZGVsQ29uZmlnPihtb2RlbENvbmZpZ1JlZi5jdXJyZW50KVxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBtb2RlbENvbmZpZ1JlZi5jdXJyZW50ID0gbW9kZWxDb25maWdcbiAgICB9LCBbbW9kZWxDb25maWddKVxuICAgIGNvbnN0IHZhbHVlID0gdXNlTWVtbygoKSA9PiAoe1xuICAgICAgbW9kZWxDb25maWcsXG4gICAgICBzZXRNb2RlbENvbmZpZyxcbiAgICB9KSwgW21vZGVsQ29uZmlnXSlcbiAgICByZXR1cm4gKFxuICAgICAgPENvbmZpZ0NvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlIGFzIGFueX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvQ29uZmlnQ29udGV4dC5Qcm92aWRlcj5cbiAgICApXG4gIH1cbiAgY29uc3QgcmVuZGVyUmVzdWx0ID0gcmVuZGVyKFxuICAgIDxXcmFwcGVyPlxuICAgICAgPEFnZW50VG9vbHMgLz5cbiAgICA8L1dyYXBwZXI+LFxuICApXG4gIHJldHVybiB7XG4gICAgLi4ucmVuZGVyUmVzdWx0LFxuICAgIGdldE1vZGVsQ29uZmlnOiAoKSA9PiBtb2RlbENvbmZpZ1JlZi5jdXJyZW50LFxuICB9XG59XG5cbmNvbnN0IGhvdmVySW5mb0ljb24gPSBhc3luYyAocm93SW5kZXggPSAwKSA9PiB7XG4gIGNvbnN0IHJvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JvdXAnKVxuICBjb25zdCBpbmZvVHJpZ2dlciA9IHJvd3MuaXRlbShyb3dJbmRleCk/LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZD1cInRvb2wtaW5mby10b29sdGlwXCJdJylcbiAgaWYgKCFpbmZvVHJpZ2dlcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZm8gdHJpZ2dlciBub3QgZm91bmQnKVxuICBhd2FpdCB1c2VyRXZlbnQuaG92ZXIoaW5mb1RyaWdnZXIgYXMgSFRNTEVsZW1lbnQpXG59XG5cbmRlc2NyaWJlKCdBZ2VudFRvb2xzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBidWlsdEluVG9vbHMgPSBbXG4gICAgICBjcmVhdGVDb2xsZWN0aW9uKCksXG4gICAgICBjcmVhdGVDb2xsZWN0aW9uKHtcbiAgICAgICAgaWQ6ICdwcm92aWRlci0yJyxcbiAgICAgICAgbmFtZTogJ3ZlbmRvci9wcm92aWRlci0yJyxcbiAgICAgICAgdG9vbHM6IFtjcmVhdGVUb29sRGVmaW5pdGlvbih7XG4gICAgICAgICAgbmFtZTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgIGVuX1VTOiAnVHJhbnNsYXRlJyxcbiAgICAgICAgICAgIHpoX0hhbnM6ICdUcmFuc2xhdGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXSxcbiAgICAgIH0pLFxuICAgICAgY3JlYXRlQ29sbGVjdGlvbih7XG4gICAgICAgIGlkOiAncHJvdmlkZXItMycsXG4gICAgICAgIG5hbWU6ICd2ZW5kb3IvcHJvdmlkZXItMycsXG4gICAgICAgIHRvb2xzOiBbY3JlYXRlVG9vbERlZmluaXRpb24oe1xuICAgICAgICAgIG5hbWU6ICdzdW1tYXJpemUnLFxuICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICBlbl9VUzogJ1N1bW1hcnknLFxuICAgICAgICAgICAgemhfSGFuczogJ1N1bW1hcnknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXSxcbiAgICAgIH0pLFxuICAgIF1cbiAgICBjdXN0b21Ub29scyA9IFtdXG4gICAgd29ya2Zsb3dUb29scyA9IFtdXG4gICAgbWNwVG9vbHMgPSBbXVxuICAgIHNpbmdsZVRvb2xTZWxlY3Rpb24gPSB7XG4gICAgICBwcm92aWRlcl9pZDogJ3Byb3ZpZGVyLTMnLFxuICAgICAgcHJvdmlkZXJfdHlwZTogQ29sbGVjdGlvblR5cGUuYnVpbHRJbixcbiAgICAgIHByb3ZpZGVyX25hbWU6ICd2ZW5kb3IvcHJvdmlkZXItMycsXG4gICAgICB0b29sX25hbWU6ICdzdW1tYXJpemUnLFxuICAgICAgdG9vbF9sYWJlbDogJ1N1bW1hcnkgVG9vbCcsXG4gICAgICB0b29sX2Rlc2NyaXB0aW9uOiAnZGVzYycsXG4gICAgICB0aXRsZTogJ1N1bW1hcnkgVG9vbCcsXG4gICAgICBpc190ZWFtX2F1dGhvcml6YXRpb246IHRydWUsXG4gICAgICBwYXJhbXM6IHsgYXBpX2tleTogJ3BpY2tlci12YWx1ZScgfSxcbiAgICAgIHBhcmFtU2NoZW1hczogW10sXG4gICAgICBvdXRwdXRfc2NoZW1hOiB7fSxcbiAgICB9XG4gICAgbXVsdGlwbGVUb29sU2VsZWN0aW9uID0gW1xuICAgICAge1xuICAgICAgICBwcm92aWRlcl9pZDogJ3Byb3ZpZGVyLTInLFxuICAgICAgICBwcm92aWRlcl90eXBlOiBDb2xsZWN0aW9uVHlwZS5idWlsdEluLFxuICAgICAgICBwcm92aWRlcl9uYW1lOiAndmVuZG9yL3Byb3ZpZGVyLTInLFxuICAgICAgICB0b29sX25hbWU6ICd0cmFuc2xhdGUnLFxuICAgICAgICB0b29sX2xhYmVsOiAnVHJhbnNsYXRlIFRvb2wnLFxuICAgICAgICB0b29sX2Rlc2NyaXB0aW9uOiAnZGVzYycsXG4gICAgICAgIHRpdGxlOiAnVHJhbnNsYXRlIFRvb2wnLFxuICAgICAgICBpc190ZWFtX2F1dGhvcml6YXRpb246IHRydWUsXG4gICAgICAgIHBhcmFtczogeyBhcGlfa2V5OiAnbXVsdGktYScgfSxcbiAgICAgICAgcGFyYW1TY2hlbWFzOiBbXSxcbiAgICAgICAgb3V0cHV0X3NjaGVtYToge30sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBwcm92aWRlcl9pZDogJ3Byb3ZpZGVyLTMnLFxuICAgICAgICBwcm92aWRlcl90eXBlOiBDb2xsZWN0aW9uVHlwZS5idWlsdEluLFxuICAgICAgICBwcm92aWRlcl9uYW1lOiAndmVuZG9yL3Byb3ZpZGVyLTMnLFxuICAgICAgICB0b29sX25hbWU6ICdzdW1tYXJpemUnLFxuICAgICAgICB0b29sX2xhYmVsOiAnU3VtbWFyeSBUb29sJyxcbiAgICAgICAgdG9vbF9kZXNjcmlwdGlvbjogJ2Rlc2MnLFxuICAgICAgICB0aXRsZTogJ1N1bW1hcnkgVG9vbCcsXG4gICAgICAgIGlzX3RlYW1fYXV0aG9yaXphdGlvbjogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7IGFwaV9rZXk6ICdtdWx0aS1iJyB9LFxuICAgICAgICBwYXJhbVNjaGVtYXM6IFtdLFxuICAgICAgICBvdXRwdXRfc2NoZW1hOiB7fSxcbiAgICAgIH0sXG4gICAgXVxuICAgIGxhdGVzdFNldHRpbmdQYW5lbFByb3BzID0gbnVsbFxuICAgIHNldHRpbmdQYW5lbFNhdmVQYXlsb2FkID0ge31cbiAgICBzZXR0aW5nUGFuZWxDcmVkZW50aWFsSWQgPSAnY3JlZGVudGlhbC1mcm9tLXBhbmVsJ1xuICAgIHBsdWdpbkluc3RhbGxIYW5kbGVyID0gbnVsbFxuICB9KVxuXG4gIGl0KCdzaG91bGQgc2hvdyBlbmFibGVkIGNvdW50IGFuZCBwcm92aWRlciBpbmZvcm1hdGlvbicsICgpID0+IHtcbiAgICByZW5kZXJBZ2VudFRvb2xzKFtcbiAgICAgIGNyZWF0ZUFnZW50VG9vbCgpLFxuICAgICAgY3JlYXRlQWdlbnRUb29sKHtcbiAgICAgICAgcHJvdmlkZXJfaWQ6ICdwcm92aWRlci0yJyxcbiAgICAgICAgcHJvdmlkZXJfbmFtZTogJ3ZlbmRvci9wcm92aWRlci0yJyxcbiAgICAgICAgdG9vbF9uYW1lOiAndHJhbnNsYXRlJyxcbiAgICAgICAgdG9vbF9sYWJlbDogJ1RyYW5zbGF0ZSBUb29sJyxcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICB9KSxcbiAgICBdKVxuXG4gICAgY29uc3QgZW5hYmxlZFRleHQgPSBzY3JlZW4uZ2V0QnlUZXh0KGNvbnRlbnQgPT4gY29udGVudC5pbmNsdWRlcygnYXBwRGVidWcuYWdlbnQudG9vbHMuZW5hYmxlZCcpKVxuICAgIGV4cGVjdChlbmFibGVkVGV4dCkudG9IYXZlVGV4dENvbnRlbnQoJzEvMicpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Byb3ZpZGVyLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUcmFuc2xhdGUgVG9vbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBjb3B5IHRvb2wgbmFtZSBmcm9tIHRvb2x0aXAgYWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgIHJlbmRlckFnZW50VG9vbHMoKVxuXG4gICAgYXdhaXQgaG92ZXJJbmZvSWNvbigpXG4gICAgY29uc3QgY29weUJ1dHRvbiA9IGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCd0b29scy5jb3B5VG9vbE5hbWUnKVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhjb3B5QnV0dG9uKVxuICAgIGV4cGVjdChjb3B5TW9jaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3NlYXJjaCcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCB0b2dnbGUgdG9vbCBlbmFibGVkIHN0YXRlIHZpYSBzd2l0Y2gnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBnZXRNb2RlbENvbmZpZyB9ID0gcmVuZGVyQWdlbnRUb29scygpXG5cbiAgICBjb25zdCBzd2l0Y2hCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzd2l0Y2hCdXR0b24pXG5cbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGNvbnN0IHRvb2xzID0gZ2V0TW9kZWxDb25maWcoKS5hZ2VudENvbmZpZy50b29scyBhcyBBcnJheTx7IHRvb2xfbmFtZT86IHN0cmluZywgZW5hYmxlZD86IGJvb2xlYW4gfT5cbiAgICAgIGNvbnN0IHRvZ2dsZWRUb29sID0gdG9vbHMuZmluZCh0b29sID0+IHRvb2wudG9vbF9uYW1lID09PSAnc2VhcmNoJylcbiAgICAgIGV4cGVjdCh0b2dnbGVkVG9vbD8uZW5hYmxlZCkudG9CZShmYWxzZSlcbiAgICB9KVxuICAgIGV4cGVjdChmb3JtYXR0aW5nRGlzcGF0Y2hlck1vY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVtb3ZlIHRvb2wgd2hlbiBkZWxldGUgYWN0aW9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyBnZXRNb2RlbENvbmZpZyB9ID0gcmVuZGVyQWdlbnRUb29scygpXG4gICAgY29uc3QgZGVsZXRlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdkZWxldGUtcmVtb3ZlZC10b29sJylcbiAgICBpZiAoIWRlbGV0ZUJ1dHRvbilcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGVsZXRlIGJ1dHRvbiBub3QgZm91bmQnKVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhkZWxldGVCdXR0b24pXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBleHBlY3QoZ2V0TW9kZWxDb25maWcoKS5hZ2VudENvbmZpZy50b29scykudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcbiAgICBleHBlY3QoZm9ybWF0dGluZ0Rpc3BhdGNoZXJNb2NrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGFkZCBhIHRvb2wgd2hlbiBUb29sUGlja2VyIHNlbGVjdHMgb25lJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgZ2V0TW9kZWxDb25maWcgfSA9IHJlbmRlckFnZW50VG9vbHMoW10pXG4gICAgY29uc3QgYWRkU2luZ2xlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGljay1zaW5nbGUnIH0pXG4gICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGFkZFNpbmdsZUJ1dHRvbilcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N1bW1hcnkgVG9vbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgICBleHBlY3QoZ2V0TW9kZWxDb25maWcoKS5hZ2VudENvbmZpZy50b29scykudG9IYXZlTGVuZ3RoKDEpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBhcHBlbmQgbXVsdGlwbGUgc2VsZWN0ZWQgdG9vbHMgYXQgb25jZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGdldE1vZGVsQ29uZmlnIH0gPSByZW5kZXJBZ2VudFRvb2xzKFtdKVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwaWNrLW11bHRpcGxlJyB9KSlcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RyYW5zbGF0ZSBUb29sJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXh0KCdTdW1tYXJ5IFRvb2wnKSkudG9IYXZlTGVuZ3RoKDEpXG4gICAgfSlcbiAgICBleHBlY3QoZ2V0TW9kZWxDb25maWcoKS5hZ2VudENvbmZpZy50b29scykudG9IYXZlTGVuZ3RoKDIpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBvcGVuIHNldHRpbmdzIHBhbmVsIGZvciBub3QgYXV0aG9yaXplZCB0b29sJywgYXN5bmMgKCkgPT4ge1xuICAgIHJlbmRlckFnZW50VG9vbHMoW1xuICAgICAgY3JlYXRlQWdlbnRUb29sKHtcbiAgICAgICAgbm90QXV0aG9yOiB0cnVlLFxuICAgICAgfSksXG4gICAgXSlcblxuICAgIGNvbnN0IG5vdEF1dGhvcml6ZWRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC90b29scy5ub3RBdXRob3JpemVkLyB9KVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhub3RBdXRob3JpemVkQnV0dG9uKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NldHRpbmctYnVpbHQtaW4tdG9vbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KGxhdGVzdFNldHRpbmdQYW5lbFByb3BzPy50b29sTmFtZSkudG9CZSgnc2VhcmNoJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIHBlcnNpc3QgdG9vbCBwYXJhbWV0ZXJzIHdoZW4gU2V0dGluZ0J1aWx0SW5Ub29sIHNhdmVzIHZhbHVlcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGdldE1vZGVsQ29uZmlnIH0gPSByZW5kZXJBZ2VudFRvb2xzKFtcbiAgICAgIGNyZWF0ZUFnZW50VG9vbCh7XG4gICAgICAgIG5vdEF1dGhvcjogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIF0pXG4gICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3Rvb2xzLm5vdEF1dGhvcml6ZWQvIH0pKVxuICAgIHNldHRpbmdQYW5lbFNhdmVQYXlsb2FkID0geyBhcGlfa2V5OiAndXBkYXRlZCcgfVxuICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdzYXZlLWZyb20tcGFuZWwnIH0pKVxuXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBleHBlY3QoKGdldE1vZGVsQ29uZmlnKCkuYWdlbnRDb25maWcudG9vbHNbMF0gYXMgeyB0b29sX3BhcmFtZXRlcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gfSkudG9vbF9wYXJhbWV0ZXJzKS50b0VxdWFsKHsgYXBpX2tleTogJ3VwZGF0ZWQnIH0pXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHVwZGF0ZSBjcmVkZW50aWFsIGlkIHdoZW4gYXV0aG9yaXphdGlvbiBzZWxlY3Rpb24gY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGdldE1vZGVsQ29uZmlnIH0gPSByZW5kZXJBZ2VudFRvb2xzKFtcbiAgICAgIGNyZWF0ZUFnZW50VG9vbCh7XG4gICAgICAgIG5vdEF1dGhvcjogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIF0pXG4gICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3Rvb2xzLm5vdEF1dGhvcml6ZWQvIH0pKVxuICAgIHNldHRpbmdQYW5lbENyZWRlbnRpYWxJZCA9ICdjcmVkZW50aWFsLTEyMydcbiAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnYXV0aC1mcm9tLXBhbmVsJyB9KSlcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgZXhwZWN0KChnZXRNb2RlbENvbmZpZygpLmFnZW50Q29uZmlnLnRvb2xzWzBdIGFzIHsgY3JlZGVudGlhbF9pZDogc3RyaW5nIH0pLmNyZWRlbnRpYWxfaWQpLnRvQmUoJ2NyZWRlbnRpYWwtMTIzJylcbiAgICB9KVxuICAgIGV4cGVjdChmb3JtYXR0aW5nRGlzcGF0Y2hlck1vY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVpbnN0YXRlIGRlbGV0ZWQgdG9vbHMgYWZ0ZXIgcGx1Z2luIGluc3RhbGwgc3VjY2VzcyBldmVudCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IGdldE1vZGVsQ29uZmlnIH0gPSByZW5kZXJBZ2VudFRvb2xzKFtcbiAgICAgIGNyZWF0ZUFnZW50VG9vbCh7XG4gICAgICAgIHByb3ZpZGVyX2lkOiAncHJvdmlkZXItMScsXG4gICAgICAgIHByb3ZpZGVyX25hbWU6ICd2ZW5kb3IvcHJvdmlkZXItMScsXG4gICAgICAgIHRvb2xfbmFtZTogJ3NlYXJjaCcsXG4gICAgICAgIHRvb2xfbGFiZWw6ICdTZWFyY2ggVG9vbCcsXG4gICAgICAgIGlzRGVsZXRlZDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIF0pXG4gICAgaWYgKCFwbHVnaW5JbnN0YWxsSGFuZGxlcilcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGx1Z2luIGhhbmRsZXIgbm90IHJlZ2lzdGVyZWQnKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIHBsdWdpbkluc3RhbGxIYW5kbGVyPy4oWydwcm92aWRlci0xJ10pXG4gICAgfSlcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgZXhwZWN0KChnZXRNb2RlbENvbmZpZygpLmFnZW50Q29uZmlnLnRvb2xzWzBdIGFzIHsgaXNEZWxldGVkOiBib29sZWFuIH0pLmlzRGVsZXRlZCkudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==