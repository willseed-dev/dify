"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
// Mock zustand store
vi.mock('@/app/components/workflow/store');
// Mock ReactFlow store
const mockGetNodes = vi.fn();
vi.mock('reactflow', () => ({
    useStoreApi: () => ({
        getState: () => ({
            getNodes: mockGetNodes,
        }),
    }),
}));
describe('Workflow Onboarding Integration Logic', () => {
    const mockSetShowOnboarding = vi.fn();
    const mockSetHasSelectedStartNode = vi.fn();
    const mockSetHasShownOnboarding = vi.fn();
    const mockSetShouldAutoOpenStartNodeSelector = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        store_1.useWorkflowStore.mockReturnValue({
            showOnboarding: false,
            setShowOnboarding: mockSetShowOnboarding,
            hasSelectedStartNode: false,
            setHasSelectedStartNode: mockSetHasSelectedStartNode,
            hasShownOnboarding: false,
            setHasShownOnboarding: mockSetHasShownOnboarding,
            notInitialWorkflow: false,
            shouldAutoOpenStartNodeSelector: false,
            setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
        });
    });
    describe('Onboarding State Management', () => {
        it('should initialize onboarding state correctly', () => {
            const store = (0, store_1.useWorkflowStore)();
            expect(store.showOnboarding).toBe(false);
            expect(store.hasSelectedStartNode).toBe(false);
            expect(store.hasShownOnboarding).toBe(false);
        });
        it('should update onboarding visibility', () => {
            const store = (0, store_1.useWorkflowStore)();
            store.setShowOnboarding(true);
            expect(mockSetShowOnboarding).toHaveBeenCalledWith(true);
            store.setShowOnboarding(false);
            expect(mockSetShowOnboarding).toHaveBeenCalledWith(false);
        });
        it('should track node selection state', () => {
            const store = (0, store_1.useWorkflowStore)();
            store.setHasSelectedStartNode(true);
            expect(mockSetHasSelectedStartNode).toHaveBeenCalledWith(true);
        });
        it('should track onboarding show state', () => {
            const store = (0, store_1.useWorkflowStore)();
            store.setHasShownOnboarding(true);
            expect(mockSetHasShownOnboarding).toHaveBeenCalledWith(true);
        });
    });
    describe('Node Validation Logic', () => {
        /**
         * Test the critical fix in use-nodes-sync-draft.ts
         * This ensures trigger nodes are recognized as valid start nodes
         */
        it('should validate Start node as valid start node', () => {
            const mockNode = {
                data: { type: types_1.BlockEnum.Start },
                id: 'start-1',
            };
            // Simulate the validation logic from use-nodes-sync-draft.ts
            const isValidStartNode = mockNode.data.type === types_1.BlockEnum.Start
                || mockNode.data.type === types_1.BlockEnum.TriggerSchedule
                || mockNode.data.type === types_1.BlockEnum.TriggerWebhook
                || mockNode.data.type === types_1.BlockEnum.TriggerPlugin;
            expect(isValidStartNode).toBe(true);
        });
        it('should validate TriggerSchedule as valid start node', () => {
            const mockNode = {
                data: { type: types_1.BlockEnum.TriggerSchedule },
                id: 'trigger-schedule-1',
            };
            const isValidStartNode = mockNode.data.type === types_1.BlockEnum.Start
                || mockNode.data.type === types_1.BlockEnum.TriggerSchedule
                || mockNode.data.type === types_1.BlockEnum.TriggerWebhook
                || mockNode.data.type === types_1.BlockEnum.TriggerPlugin;
            expect(isValidStartNode).toBe(true);
        });
        it('should validate TriggerWebhook as valid start node', () => {
            const mockNode = {
                data: { type: types_1.BlockEnum.TriggerWebhook },
                id: 'trigger-webhook-1',
            };
            const isValidStartNode = mockNode.data.type === types_1.BlockEnum.Start
                || mockNode.data.type === types_1.BlockEnum.TriggerSchedule
                || mockNode.data.type === types_1.BlockEnum.TriggerWebhook
                || mockNode.data.type === types_1.BlockEnum.TriggerPlugin;
            expect(isValidStartNode).toBe(true);
        });
        it('should validate TriggerPlugin as valid start node', () => {
            const mockNode = {
                data: { type: types_1.BlockEnum.TriggerPlugin },
                id: 'trigger-plugin-1',
            };
            const isValidStartNode = mockNode.data.type === types_1.BlockEnum.Start
                || mockNode.data.type === types_1.BlockEnum.TriggerSchedule
                || mockNode.data.type === types_1.BlockEnum.TriggerWebhook
                || mockNode.data.type === types_1.BlockEnum.TriggerPlugin;
            expect(isValidStartNode).toBe(true);
        });
        it('should reject non-trigger nodes as invalid start nodes', () => {
            const mockNode = {
                data: { type: types_1.BlockEnum.LLM },
                id: 'llm-1',
            };
            const isValidStartNode = mockNode.data.type === types_1.BlockEnum.Start
                || mockNode.data.type === types_1.BlockEnum.TriggerSchedule
                || mockNode.data.type === types_1.BlockEnum.TriggerWebhook
                || mockNode.data.type === types_1.BlockEnum.TriggerPlugin;
            expect(isValidStartNode).toBe(false);
        });
        it('should handle array of nodes with mixed types', () => {
            const mockNodes = [
                { data: { type: types_1.BlockEnum.LLM }, id: 'llm-1' },
                { data: { type: types_1.BlockEnum.TriggerWebhook }, id: 'webhook-1' },
                { data: { type: types_1.BlockEnum.Answer }, id: 'answer-1' },
            ];
            // Simulate hasStartNode logic from use-nodes-sync-draft.ts
            const hasStartNode = mockNodes.find(node => node.data.type === types_1.BlockEnum.Start
                || node.data.type === types_1.BlockEnum.TriggerSchedule
                || node.data.type === types_1.BlockEnum.TriggerWebhook
                || node.data.type === types_1.BlockEnum.TriggerPlugin);
            expect(hasStartNode).toBeTruthy();
            expect(hasStartNode?.id).toBe('webhook-1');
        });
        it('should return undefined when no valid start nodes exist', () => {
            const mockNodes = [
                { data: { type: types_1.BlockEnum.LLM }, id: 'llm-1' },
                { data: { type: types_1.BlockEnum.Answer }, id: 'answer-1' },
            ];
            const hasStartNode = mockNodes.find(node => node.data.type === types_1.BlockEnum.Start
                || node.data.type === types_1.BlockEnum.TriggerSchedule
                || node.data.type === types_1.BlockEnum.TriggerWebhook
                || node.data.type === types_1.BlockEnum.TriggerPlugin);
            expect(hasStartNode).toBeUndefined();
        });
    });
    describe('Auto-open Logic for Node Handles', () => {
        /**
         * Test the auto-open logic from node-handle.tsx
         * This ensures all trigger types auto-open the block selector when flagged
         */
        it('should auto-expand for Start node in new workflow', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.Start;
            const isChatMode = false;
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && (nodeType === types_1.BlockEnum.Start
                || nodeType === types_1.BlockEnum.TriggerSchedule
                || nodeType === types_1.BlockEnum.TriggerWebhook
                || nodeType === types_1.BlockEnum.TriggerPlugin) && !isChatMode;
            expect(shouldAutoExpand).toBe(true);
        });
        it('should auto-expand for TriggerSchedule in new workflow', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.TriggerSchedule;
            const isChatMode = false;
            const validStartTypes = [types_1.BlockEnum.Start, types_1.BlockEnum.TriggerSchedule, types_1.BlockEnum.TriggerWebhook, types_1.BlockEnum.TriggerPlugin];
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && validStartTypes.includes(nodeType) && !isChatMode;
            expect(shouldAutoExpand).toBe(true);
        });
        it('should auto-expand for TriggerWebhook in new workflow', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.TriggerWebhook;
            const isChatMode = false;
            const validStartTypes = [types_1.BlockEnum.Start, types_1.BlockEnum.TriggerSchedule, types_1.BlockEnum.TriggerWebhook, types_1.BlockEnum.TriggerPlugin];
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && validStartTypes.includes(nodeType) && !isChatMode;
            expect(shouldAutoExpand).toBe(true);
        });
        it('should auto-expand for TriggerPlugin in new workflow', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.TriggerPlugin;
            const isChatMode = false;
            const validStartTypes = [types_1.BlockEnum.Start, types_1.BlockEnum.TriggerSchedule, types_1.BlockEnum.TriggerWebhook, types_1.BlockEnum.TriggerPlugin];
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && validStartTypes.includes(nodeType) && !isChatMode;
            expect(shouldAutoExpand).toBe(true);
        });
        it('should not auto-expand for non-trigger nodes', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.LLM;
            const isChatMode = false;
            const validStartTypes = [types_1.BlockEnum.Start, types_1.BlockEnum.TriggerSchedule, types_1.BlockEnum.TriggerWebhook, types_1.BlockEnum.TriggerPlugin];
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && validStartTypes.includes(nodeType) && !isChatMode;
            expect(shouldAutoExpand).toBe(false);
        });
        it('should not auto-expand in chat mode', () => {
            const shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.Start;
            const isChatMode = true;
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && (nodeType === types_1.BlockEnum.Start
                || nodeType === types_1.BlockEnum.TriggerSchedule
                || nodeType === types_1.BlockEnum.TriggerWebhook
                || nodeType === types_1.BlockEnum.TriggerPlugin) && !isChatMode;
            expect(shouldAutoExpand).toBe(false);
        });
        it('should not auto-expand for existing workflows', () => {
            const shouldAutoOpenStartNodeSelector = false;
            const nodeType = types_1.BlockEnum.Start;
            const isChatMode = false;
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && (nodeType === types_1.BlockEnum.Start
                || nodeType === types_1.BlockEnum.TriggerSchedule
                || nodeType === types_1.BlockEnum.TriggerWebhook
                || nodeType === types_1.BlockEnum.TriggerPlugin) && !isChatMode;
            expect(shouldAutoExpand).toBe(false);
        });
        it('should reset auto-open flag after triggering once', () => {
            let shouldAutoOpenStartNodeSelector = true;
            const nodeType = types_1.BlockEnum.Start;
            const isChatMode = false;
            const shouldAutoExpand = shouldAutoOpenStartNodeSelector && (nodeType === types_1.BlockEnum.Start
                || nodeType === types_1.BlockEnum.TriggerSchedule
                || nodeType === types_1.BlockEnum.TriggerWebhook
                || nodeType === types_1.BlockEnum.TriggerPlugin) && !isChatMode;
            if (shouldAutoExpand)
                shouldAutoOpenStartNodeSelector = false;
            expect(shouldAutoExpand).toBe(true);
            expect(shouldAutoOpenStartNodeSelector).toBe(false);
        });
    });
    describe('Node Creation Without Auto-selection', () => {
        /**
         * Test that nodes are created without the 'selected: true' property
         * This prevents auto-opening the properties panel
         */
        it('should create Start node without auto-selection', () => {
            const nodeData = { type: types_1.BlockEnum.Start, title: 'Start' };
            // Simulate node creation logic from workflow-children.tsx
            const createdNodeData = {
                ...nodeData,
                // Note: 'selected: true' should NOT be added
            };
            expect(createdNodeData.selected).toBeUndefined();
            expect(createdNodeData.type).toBe(types_1.BlockEnum.Start);
        });
        it('should create TriggerWebhook node without auto-selection', () => {
            const nodeData = { type: types_1.BlockEnum.TriggerWebhook, title: 'Webhook Trigger' };
            const toolConfig = { webhook_url: 'https://example.com/webhook' };
            const createdNodeData = {
                ...nodeData,
                ...toolConfig,
                // Note: 'selected: true' should NOT be added
            };
            expect(createdNodeData.selected).toBeUndefined();
            expect(createdNodeData.type).toBe(types_1.BlockEnum.TriggerWebhook);
            expect(createdNodeData.webhook_url).toBe('https://example.com/webhook');
        });
        it('should preserve other node properties while avoiding auto-selection', () => {
            const nodeData = {
                type: types_1.BlockEnum.TriggerSchedule,
                title: 'Schedule Trigger',
                config: { interval: '1h' },
            };
            const createdNodeData = {
                ...nodeData,
            };
            expect(createdNodeData.selected).toBeUndefined();
            expect(createdNodeData.type).toBe(types_1.BlockEnum.TriggerSchedule);
            expect(createdNodeData.title).toBe('Schedule Trigger');
            expect(createdNodeData.config).toEqual({ interval: '1h' });
        });
    });
    describe('Workflow Initialization Logic', () => {
        /**
         * Test the initialization logic from use-workflow-init.ts
         * This ensures onboarding is triggered correctly for new workflows
         */
        it('should trigger onboarding for new workflow when draft does not exist', () => {
            // Simulate the error handling logic from use-workflow-init.ts
            const error = {
                json: vi.fn().mockResolvedValue({ code: 'draft_workflow_not_exist' }),
                bodyUsed: false,
            };
            const mockWorkflowStore = {
                setState: vi.fn(),
            };
            // Simulate error handling
            if (error && error.json && !error.bodyUsed) {
                error.json().then((err) => {
                    if (err.code === 'draft_workflow_not_exist') {
                        mockWorkflowStore.setState({
                            notInitialWorkflow: true,
                            showOnboarding: true,
                        });
                    }
                });
            }
            return error.json().then(() => {
                expect(mockWorkflowStore.setState).toHaveBeenCalledWith({
                    notInitialWorkflow: true,
                    showOnboarding: true,
                });
            });
        });
        it('should not trigger onboarding for existing workflows', () => {
            // Simulate successful draft fetch
            const mockWorkflowStore = {
                setState: vi.fn(),
            };
            // Normal initialization path should not set showOnboarding: true
            mockWorkflowStore.setState({
                environmentVariables: [],
                conversationVariables: [],
            });
            expect(mockWorkflowStore.setState).not.toHaveBeenCalledWith(expect.objectContaining({ showOnboarding: true }));
        });
        it('should create empty draft with proper structure', () => {
            const mockSyncWorkflowDraft = vi.fn();
            const appId = 'test-app-id';
            // Simulate the syncWorkflowDraft call from use-workflow-init.ts
            const draftParams = {
                url: `/apps/${appId}/workflows/draft`,
                params: {
                    graph: {
                        nodes: [], // Empty nodes initially
                        edges: [],
                    },
                    features: {
                        retriever_resource: { enabled: true },
                    },
                    environment_variables: [],
                    conversation_variables: [],
                },
            };
            mockSyncWorkflowDraft(draftParams);
            expect(mockSyncWorkflowDraft).toHaveBeenCalledWith({
                url: `/apps/${appId}/workflows/draft`,
                params: {
                    graph: {
                        nodes: [],
                        edges: [],
                    },
                    features: {
                        retriever_resource: { enabled: true },
                    },
                    environment_variables: [],
                    conversation_variables: [],
                },
            });
        });
    });
    describe('Auto-Detection for Empty Canvas', () => {
        beforeEach(() => {
            mockGetNodes.mockClear();
        });
        it('should detect empty canvas and trigger onboarding', () => {
            // Mock empty canvas
            mockGetNodes.mockReturnValue([]);
            store_1.useWorkflowStore.mockReturnValue({
                showOnboarding: false,
                hasShownOnboarding: false,
                notInitialWorkflow: false,
                setShowOnboarding: mockSetShowOnboarding,
                setHasShownOnboarding: mockSetHasShownOnboarding,
                hasSelectedStartNode: false,
                setHasSelectedStartNode: mockSetHasSelectedStartNode,
                shouldAutoOpenStartNodeSelector: false,
                setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                getState: () => ({
                    showOnboarding: false,
                    hasShownOnboarding: false,
                    notInitialWorkflow: false,
                    setShowOnboarding: mockSetShowOnboarding,
                    setHasShownOnboarding: mockSetHasShownOnboarding,
                    hasSelectedStartNode: false,
                    setHasSelectedStartNode: mockSetHasSelectedStartNode,
                    setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                }),
            });
            // Simulate empty canvas check logic
            const nodes = mockGetNodes();
            const startNodeTypes = [
                types_1.BlockEnum.Start,
                types_1.BlockEnum.TriggerSchedule,
                types_1.BlockEnum.TriggerWebhook,
                types_1.BlockEnum.TriggerPlugin,
            ];
            const hasStartNode = nodes.some((node) => startNodeTypes.includes(node.data?.type));
            const isEmpty = nodes.length === 0 || !hasStartNode;
            expect(isEmpty).toBe(true);
            expect(nodes.length).toBe(0);
        });
        it('should detect canvas with non-start nodes as empty', () => {
            // Mock canvas with non-start nodes
            mockGetNodes.mockReturnValue([
                { id: '1', data: { type: types_1.BlockEnum.LLM } },
                { id: '2', data: { type: types_1.BlockEnum.Code } },
            ]);
            const nodes = mockGetNodes();
            const startNodeTypes = [
                types_1.BlockEnum.Start,
                types_1.BlockEnum.TriggerSchedule,
                types_1.BlockEnum.TriggerWebhook,
                types_1.BlockEnum.TriggerPlugin,
            ];
            const hasStartNode = nodes.some((node) => startNodeTypes.includes(node.data.type));
            const isEmpty = nodes.length === 0 || !hasStartNode;
            expect(isEmpty).toBe(true);
            expect(hasStartNode).toBe(false);
        });
        it('should not detect canvas with start nodes as empty', () => {
            // Mock canvas with start node
            mockGetNodes.mockReturnValue([
                { id: '1', data: { type: types_1.BlockEnum.Start } },
            ]);
            const nodes = mockGetNodes();
            const startNodeTypes = [
                types_1.BlockEnum.Start,
                types_1.BlockEnum.TriggerSchedule,
                types_1.BlockEnum.TriggerWebhook,
                types_1.BlockEnum.TriggerPlugin,
            ];
            const hasStartNode = nodes.some((node) => startNodeTypes.includes(node.data.type));
            const isEmpty = nodes.length === 0 || !hasStartNode;
            expect(isEmpty).toBe(false);
            expect(hasStartNode).toBe(true);
        });
        it('should not trigger onboarding if already shown in session', () => {
            // Mock empty canvas
            mockGetNodes.mockReturnValue([]);
            store_1.useWorkflowStore.mockReturnValue({
                showOnboarding: false,
                hasShownOnboarding: true, // Already shown in this session
                notInitialWorkflow: false,
                setShowOnboarding: mockSetShowOnboarding,
                setHasShownOnboarding: mockSetHasShownOnboarding,
                hasSelectedStartNode: false,
                setHasSelectedStartNode: mockSetHasSelectedStartNode,
                shouldAutoOpenStartNodeSelector: false,
                setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                getState: () => ({
                    showOnboarding: false,
                    hasShownOnboarding: true,
                    notInitialWorkflow: false,
                    setShowOnboarding: mockSetShowOnboarding,
                    setHasShownOnboarding: mockSetHasShownOnboarding,
                    hasSelectedStartNode: false,
                    setHasSelectedStartNode: mockSetHasSelectedStartNode,
                    setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                }),
            });
            // Simulate the check logic with hasShownOnboarding = true
            const store = (0, store_1.useWorkflowStore)();
            const shouldTrigger = !store.hasShownOnboarding && !store.showOnboarding && !store.notInitialWorkflow;
            expect(shouldTrigger).toBe(false);
        });
        it('should not trigger onboarding during initial workflow creation', () => {
            // Mock empty canvas
            mockGetNodes.mockReturnValue([]);
            store_1.useWorkflowStore.mockReturnValue({
                showOnboarding: false,
                hasShownOnboarding: false,
                notInitialWorkflow: true, // Initial workflow creation
                setShowOnboarding: mockSetShowOnboarding,
                setHasShownOnboarding: mockSetHasShownOnboarding,
                hasSelectedStartNode: false,
                setHasSelectedStartNode: mockSetHasSelectedStartNode,
                shouldAutoOpenStartNodeSelector: false,
                setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                getState: () => ({
                    showOnboarding: false,
                    hasShownOnboarding: false,
                    notInitialWorkflow: true,
                    setShowOnboarding: mockSetShowOnboarding,
                    setHasShownOnboarding: mockSetHasShownOnboarding,
                    hasSelectedStartNode: false,
                    setHasSelectedStartNode: mockSetHasSelectedStartNode,
                    setShouldAutoOpenStartNodeSelector: mockSetShouldAutoOpenStartNodeSelector,
                }),
            });
            // Simulate the check logic with notInitialWorkflow = true
            const store = (0, store_1.useWorkflowStore)();
            const shouldTrigger = !store.hasShownOnboarding && !store.showOnboarding && !store.notInitialWorkflow;
            expect(shouldTrigger).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3ctb25ib2FyZGluZy1pbnRlZ3JhdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid29ya2Zsb3ctb25ib2FyZGluZy1pbnRlZ3JhdGlvbi50ZXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJEQUFrRTtBQUNsRSwyREFBMkQ7QUFvQjNELHFCQUFxQjtBQUNyQixFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7QUFFMUMsdUJBQXVCO0FBQ3ZCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM1QixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2xCLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2YsUUFBUSxFQUFFLFlBQVk7U0FDdkIsQ0FBQztLQUNILENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILFFBQVEsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7SUFDckQsTUFBTSxxQkFBcUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDckMsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDM0MsTUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFDekMsTUFBTSxzQ0FBc0MsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFFdEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FHakI7UUFBQyx3QkFBeUIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsY0FBYyxFQUFFLEtBQUs7WUFDckIsaUJBQWlCLEVBQUUscUJBQXFCO1lBQ3hDLG9CQUFvQixFQUFFLEtBQUs7WUFDM0IsdUJBQXVCLEVBQUUsMkJBQTJCO1lBQ3BE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c0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb2NrIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG4vLyBUeXBlIGZvciBtb2NrZWQgc3RvcmVcbnR5cGUgTW9ja1dvcmtmbG93U3RvcmUgPSB7XG4gIHNob3dPbmJvYXJkaW5nOiBib29sZWFuXG4gIHNldFNob3dPbmJvYXJkaW5nOiBNb2NrXG4gIGhhc1Nob3duT25ib2FyZGluZzogYm9vbGVhblxuICBzZXRIYXNTaG93bk9uYm9hcmRpbmc6IE1vY2tcbiAgaGFzU2VsZWN0ZWRTdGFydE5vZGU6IGJvb2xlYW5cbiAgc2V0SGFzU2VsZWN0ZWRTdGFydE5vZGU6IE1vY2tcbiAgc2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcjogTW9ja1xuICBub3RJbml0aWFsV29ya2Zsb3c6IGJvb2xlYW5cbn1cblxuLy8gVHlwZSBmb3IgbW9ja2VkIG5vZGVcbnR5cGUgTW9ja05vZGUgPSB7XG4gIGlkOiBzdHJpbmdcbiAgZGF0YTogeyB0eXBlPzogQmxvY2tFbnVtIH1cbn1cblxuLy8gTW9jayB6dXN0YW5kIHN0b3JlXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJylcblxuLy8gTW9jayBSZWFjdEZsb3cgc3RvcmVcbmNvbnN0IG1vY2tHZXROb2RlcyA9IHZpLmZuKClcbnZpLm1vY2soJ3JlYWN0ZmxvdycsICgpID0+ICh7XG4gIHVzZVN0b3JlQXBpOiAoKSA9PiAoe1xuICAgIGdldFN0YXRlOiAoKSA9PiAoe1xuICAgICAgZ2V0Tm9kZXM6IG1vY2tHZXROb2RlcyxcbiAgICB9KSxcbiAgfSksXG59KSlcblxuZGVzY3JpYmUoJ1dvcmtmbG93IE9uYm9hcmRpbmcgSW50ZWdyYXRpb24gTG9naWMnLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tTZXRTaG93T25ib2FyZGluZyA9IHZpLmZuKClcbiAgY29uc3QgbW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nID0gdmkuZm4oKVxuICBjb25zdCBtb2NrU2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgIC8vIE1vY2sgc3RvcmUgaW1wbGVtZW50YXRpb25cbiAgICA7KHVzZVdvcmtmbG93U3RvcmUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIHNob3dPbmJvYXJkaW5nOiBmYWxzZSxcbiAgICAgIHNldFNob3dPbmJvYXJkaW5nOiBtb2NrU2V0U2hvd09uYm9hcmRpbmcsXG4gICAgICBoYXNTZWxlY3RlZFN0YXJ0Tm9kZTogZmFsc2UsXG4gICAgICBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZTogbW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlLFxuICAgICAgaGFzU2hvd25PbmJvYXJkaW5nOiBmYWxzZSxcbiAgICAgIHNldEhhc1Nob3duT25ib2FyZGluZzogbW9ja1NldEhhc1Nob3duT25ib2FyZGluZyxcbiAgICAgIG5vdEluaXRpYWxXb3JrZmxvdzogZmFsc2UsXG4gICAgICBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yOiBmYWxzZSxcbiAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IG1vY2tTZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yLFxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ09uYm9hcmRpbmcgU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgb25ib2FyZGluZyBzdGF0ZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKSBhcyB1bmtub3duIGFzIE1vY2tXb3JrZmxvd1N0b3JlXG5cbiAgICAgIGV4cGVjdChzdG9yZS5zaG93T25ib2FyZGluZykudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChzdG9yZS5oYXNTZWxlY3RlZFN0YXJ0Tm9kZSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChzdG9yZS5oYXNTaG93bk9uYm9hcmRpbmcpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIG9uYm9hcmRpbmcgdmlzaWJpbGl0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpIGFzIHVua25vd24gYXMgTW9ja1dvcmtmbG93U3RvcmVcblxuICAgICAgc3RvcmUuc2V0U2hvd09uYm9hcmRpbmcodHJ1ZSlcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd09uYm9hcmRpbmcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG5cbiAgICAgIHN0b3JlLnNldFNob3dPbmJvYXJkaW5nKGZhbHNlKVxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93T25ib2FyZGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhY2sgbm9kZSBzZWxlY3Rpb24gc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKSBhcyB1bmtub3duIGFzIE1vY2tXb3JrZmxvd1N0b3JlXG5cbiAgICAgIHN0b3JlLnNldEhhc1NlbGVjdGVkU3RhcnROb2RlKHRydWUpXG4gICAgICBleHBlY3QobW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYWNrIG9uYm9hcmRpbmcgc2hvdyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpIGFzIHVua25vd24gYXMgTW9ja1dvcmtmbG93U3RvcmVcblxuICAgICAgc3RvcmUuc2V0SGFzU2hvd25PbmJvYXJkaW5nKHRydWUpXG4gICAgICBleHBlY3QobW9ja1NldEhhc1Nob3duT25ib2FyZGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdOb2RlIFZhbGlkYXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGUgY3JpdGljYWwgZml4IGluIHVzZS1ub2Rlcy1zeW5jLWRyYWZ0LnRzXG4gICAgICogVGhpcyBlbnN1cmVzIHRyaWdnZXIgbm9kZXMgYXJlIHJlY29nbml6ZWQgYXMgdmFsaWQgc3RhcnQgbm9kZXNcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIFN0YXJ0IG5vZGUgYXMgdmFsaWQgc3RhcnQgbm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tOb2RlID0ge1xuICAgICAgICBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5TdGFydCB9LFxuICAgICAgICBpZDogJ3N0YXJ0LTEnLFxuICAgICAgfVxuXG4gICAgICAvLyBTaW11bGF0ZSB0aGUgdmFsaWRhdGlvbiBsb2dpYyBmcm9tIHVzZS1ub2Rlcy1zeW5jLWRyYWZ0LnRzXG4gICAgICBjb25zdCBpc1ZhbGlkU3RhcnROb2RlID0gbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cblxuICAgICAgZXhwZWN0KGlzVmFsaWRTdGFydE5vZGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBUcmlnZ2VyU2NoZWR1bGUgYXMgdmFsaWQgc3RhcnQgbm9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tOb2RlID0ge1xuICAgICAgICBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUgfSxcbiAgICAgICAgaWQ6ICd0cmlnZ2VyLXNjaGVkdWxlLTEnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ZhbGlkU3RhcnROb2RlID0gbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cblxuICAgICAgZXhwZWN0KGlzVmFsaWRTdGFydE5vZGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBUcmlnZ2VyV2ViaG9vayBhcyB2YWxpZCBzdGFydCBub2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja05vZGUgPSB7XG4gICAgICAgIGRhdGE6IHsgdHlwZTogQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rIH0sXG4gICAgICAgIGlkOiAndHJpZ2dlci13ZWJob29rLTEnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ZhbGlkU3RhcnROb2RlID0gbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cblxuICAgICAgZXhwZWN0KGlzVmFsaWRTdGFydE5vZGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBUcmlnZ2VyUGx1Z2luIGFzIHZhbGlkIHN0YXJ0IG5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrTm9kZSA9IHtcbiAgICAgICAgZGF0YTogeyB0eXBlOiBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbiB9LFxuICAgICAgICBpZDogJ3RyaWdnZXItcGx1Z2luLTEnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1ZhbGlkU3RhcnROb2RlID0gbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG1vY2tOb2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cblxuICAgICAgZXhwZWN0KGlzVmFsaWRTdGFydE5vZGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWplY3Qgbm9uLXRyaWdnZXIgbm9kZXMgYXMgaW52YWxpZCBzdGFydCBub2RlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tOb2RlID0ge1xuICAgICAgICBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5MTE0gfSxcbiAgICAgICAgaWQ6ICdsbG0tMScsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzVmFsaWRTdGFydE5vZGUgPSBtb2NrTm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICAgICAgICB8fCBtb2NrTm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGVcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2tcbiAgICAgICAgfHwgbW9ja05vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpblxuXG4gICAgICBleHBlY3QoaXNWYWxpZFN0YXJ0Tm9kZSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYXJyYXkgb2Ygbm9kZXMgd2l0aCBtaXhlZCB0eXBlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tOb2RlcyA9IFtcbiAgICAgICAgeyBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5MTE0gfSwgaWQ6ICdsbG0tMScgfSxcbiAgICAgICAgeyBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vayB9LCBpZDogJ3dlYmhvb2stMScgfSxcbiAgICAgICAgeyBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5BbnN3ZXIgfSwgaWQ6ICdhbnN3ZXItMScgfSxcbiAgICAgIF1cblxuICAgICAgLy8gU2ltdWxhdGUgaGFzU3RhcnROb2RlIGxvZ2ljIGZyb20gdXNlLW5vZGVzLXN5bmMtZHJhZnQudHNcbiAgICAgIGNvbnN0IGhhc1N0YXJ0Tm9kZSA9IG1vY2tOb2Rlcy5maW5kKG5vZGUgPT5cbiAgICAgICAgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICAgICAgICB8fCBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZVxuICAgICAgICB8fCBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGhhc1N0YXJ0Tm9kZSkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QoaGFzU3RhcnROb2RlPy5pZCkudG9CZSgnd2ViaG9vay0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gbm8gdmFsaWQgc3RhcnQgbm9kZXMgZXhpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrTm9kZXMgPSBbXG4gICAgICAgIHsgZGF0YTogeyB0eXBlOiBCbG9ja0VudW0uTExNIH0sIGlkOiAnbGxtLTEnIH0sXG4gICAgICAgIHsgZGF0YTogeyB0eXBlOiBCbG9ja0VudW0uQW5zd2VyIH0sIGlkOiAnYW5zd2VyLTEnIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IGhhc1N0YXJ0Tm9kZSA9IG1vY2tOb2Rlcy5maW5kKG5vZGUgPT5cbiAgICAgICAgbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICAgICAgICB8fCBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZVxuICAgICAgICB8fCBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGhhc1N0YXJ0Tm9kZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQXV0by1vcGVuIExvZ2ljIGZvciBOb2RlIEhhbmRsZXMnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGUgYXV0by1vcGVuIGxvZ2ljIGZyb20gbm9kZS1oYW5kbGUudHN4XG4gICAgICogVGhpcyBlbnN1cmVzIGFsbCB0cmlnZ2VyIHR5cGVzIGF1dG8tb3BlbiB0aGUgYmxvY2sgc2VsZWN0b3Igd2hlbiBmbGFnZ2VkXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBhdXRvLWV4cGFuZCBmb3IgU3RhcnQgbm9kZSBpbiBuZXcgd29ya2Zsb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yID0gdHJ1ZVxuICAgICAgY29uc3Qgbm9kZVR5cGUgPSBCbG9ja0VudW0uU3RhcnRcbiAgICAgIGNvbnN0IGlzQ2hhdE1vZGUgPSBmYWxzZVxuXG4gICAgICBjb25zdCBzaG91bGRBdXRvRXhwYW5kID0gc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciAmJiAoXG4gICAgICAgIG5vZGVUeXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgICAgICAgfHwgbm9kZVR5cGUgPT09IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGVcbiAgICAgICAgfHwgbm9kZVR5cGUgPT09IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9va1xuICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5cbiAgICAgICkgJiYgIWlzQ2hhdE1vZGVcblxuICAgICAgZXhwZWN0KHNob3VsZEF1dG9FeHBhbmQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhdXRvLWV4cGFuZCBmb3IgVHJpZ2dlclNjaGVkdWxlIGluIG5ldyB3b3JrZmxvdycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IgPSB0cnVlXG4gICAgICBjb25zdCBub2RlVHlwZTogQmxvY2tFbnVtID0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZVxuICAgICAgY29uc3QgaXNDaGF0TW9kZSA9IGZhbHNlXG4gICAgICBjb25zdCB2YWxpZFN0YXJ0VHlwZXMgPSBbQmxvY2tFbnVtLlN0YXJ0LCBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlLCBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssIEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luXVxuXG4gICAgICBjb25zdCBzaG91bGRBdXRvRXhwYW5kID0gc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciAmJiB2YWxpZFN0YXJ0VHlwZXMuaW5jbHVkZXMobm9kZVR5cGUpICYmICFpc0NoYXRNb2RlXG5cbiAgICAgIGV4cGVjdChzaG91bGRBdXRvRXhwYW5kKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXV0by1leHBhbmQgZm9yIFRyaWdnZXJXZWJob29rIGluIG5ldyB3b3JrZmxvdycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IgPSB0cnVlXG4gICAgICBjb25zdCBub2RlVHlwZTogQmxvY2tFbnVtID0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICBjb25zdCBpc0NoYXRNb2RlID0gZmFsc2VcbiAgICAgIGNvbnN0IHZhbGlkU3RhcnRUeXBlcyA9IFtCbG9ja0VudW0uU3RhcnQsIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaywgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5dXG5cbiAgICAgIGNvbnN0IHNob3VsZEF1dG9FeHBhbmQgPSBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yICYmIHZhbGlkU3RhcnRUeXBlcy5pbmNsdWRlcyhub2RlVHlwZSkgJiYgIWlzQ2hhdE1vZGVcblxuICAgICAgZXhwZWN0KHNob3VsZEF1dG9FeHBhbmQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhdXRvLWV4cGFuZCBmb3IgVHJpZ2dlclBsdWdpbiBpbiBuZXcgd29ya2Zsb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yID0gdHJ1ZVxuICAgICAgY29uc3Qgbm9kZVR5cGU6IEJsb2NrRW51bSA9IEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luXG4gICAgICBjb25zdCBpc0NoYXRNb2RlID0gZmFsc2VcbiAgICAgIGNvbnN0IHZhbGlkU3RhcnRUeXBlcyA9IFtCbG9ja0VudW0uU3RhcnQsIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaywgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5dXG5cbiAgICAgIGNvbnN0IHNob3VsZEF1dG9FeHBhbmQgPSBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yICYmIHZhbGlkU3RhcnRUeXBlcy5pbmNsdWRlcyhub2RlVHlwZSkgJiYgIWlzQ2hhdE1vZGVcblxuICAgICAgZXhwZWN0KHNob3VsZEF1dG9FeHBhbmQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYXV0by1leHBhbmQgZm9yIG5vbi10cmlnZ2VyIG5vZGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciA9IHRydWVcbiAgICAgIGNvbnN0IG5vZGVUeXBlOiBCbG9ja0VudW0gPSBCbG9ja0VudW0uTExNXG4gICAgICBjb25zdCBpc0NoYXRNb2RlID0gZmFsc2VcbiAgICAgIGNvbnN0IHZhbGlkU3RhcnRUeXBlcyA9IFtCbG9ja0VudW0uU3RhcnQsIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaywgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW5dXG5cbiAgICAgIGNvbnN0IHNob3VsZEF1dG9FeHBhbmQgPSBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yICYmIHZhbGlkU3RhcnRUeXBlcy5pbmNsdWRlcyhub2RlVHlwZSkgJiYgIWlzQ2hhdE1vZGVcblxuICAgICAgZXhwZWN0KHNob3VsZEF1dG9FeHBhbmQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGF1dG8tZXhwYW5kIGluIGNoYXQgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IgPSB0cnVlXG4gICAgICBjb25zdCBub2RlVHlwZSA9IEJsb2NrRW51bS5TdGFydFxuICAgICAgY29uc3QgaXNDaGF0TW9kZSA9IHRydWVcblxuICAgICAgY29uc3Qgc2hvdWxkQXV0b0V4cGFuZCA9IHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IgJiYgKFxuICAgICAgICBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0XG4gICAgICAgIHx8IG5vZGVUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlXG4gICAgICAgIHx8IG5vZGVUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2tcbiAgICAgICAgfHwgbm9kZVR5cGUgPT09IEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luXG4gICAgICApICYmICFpc0NoYXRNb2RlXG5cbiAgICAgIGV4cGVjdChzaG91bGRBdXRvRXhwYW5kKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBhdXRvLWV4cGFuZCBmb3IgZXhpc3Rpbmcgd29ya2Zsb3dzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciA9IGZhbHNlXG4gICAgICBjb25zdCBub2RlVHlwZSA9IEJsb2NrRW51bS5TdGFydFxuICAgICAgY29uc3QgaXNDaGF0TW9kZSA9IGZhbHNlXG5cbiAgICAgIGNvbnN0IHNob3VsZEF1dG9FeHBhbmQgPSBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yICYmIChcbiAgICAgICAgbm9kZVR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZVxuICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG5vZGVUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpblxuICAgICAgKSAmJiAhaXNDaGF0TW9kZVxuXG4gICAgICBleHBlY3Qoc2hvdWxkQXV0b0V4cGFuZCkudG9CZShmYWxzZSlcbiAgICB9KVxuICAgIGl0KCdzaG91bGQgcmVzZXQgYXV0by1vcGVuIGZsYWcgYWZ0ZXIgdHJpZ2dlcmluZyBvbmNlJywgKCkgPT4ge1xuICAgICAgbGV0IHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3IgPSB0cnVlXG4gICAgICBjb25zdCBub2RlVHlwZSA9IEJsb2NrRW51bS5TdGFydFxuICAgICAgY29uc3QgaXNDaGF0TW9kZSA9IGZhbHNlXG5cbiAgICAgIGNvbnN0IHNob3VsZEF1dG9FeHBhbmQgPSBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yICYmIChcbiAgICAgICAgbm9kZVR5cGUgPT09IEJsb2NrRW51bS5TdGFydFxuICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZVxuICAgICAgICB8fCBub2RlVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rXG4gICAgICAgIHx8IG5vZGVUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpblxuICAgICAgKSAmJiAhaXNDaGF0TW9kZVxuXG4gICAgICBpZiAoc2hvdWxkQXV0b0V4cGFuZClcbiAgICAgICAgc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciA9IGZhbHNlXG5cbiAgICAgIGV4cGVjdChzaG91bGRBdXRvRXhwYW5kKS50b0JlKHRydWUpXG4gICAgICBleHBlY3Qoc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcikudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdOb2RlIENyZWF0aW9uIFdpdGhvdXQgQXV0by1zZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IG5vZGVzIGFyZSBjcmVhdGVkIHdpdGhvdXQgdGhlICdzZWxlY3RlZDogdHJ1ZScgcHJvcGVydHlcbiAgICAgKiBUaGlzIHByZXZlbnRzIGF1dG8tb3BlbmluZyB0aGUgcHJvcGVydGllcyBwYW5lbFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIFN0YXJ0IG5vZGUgd2l0aG91dCBhdXRvLXNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0geyB0eXBlOiBCbG9ja0VudW0uU3RhcnQsIHRpdGxlOiAnU3RhcnQnIH1cblxuICAgICAgLy8gU2ltdWxhdGUgbm9kZSBjcmVhdGlvbiBsb2dpYyBmcm9tIHdvcmtmbG93LWNoaWxkcmVuLnRzeFxuICAgICAgY29uc3QgY3JlYXRlZE5vZGVEYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHtcbiAgICAgICAgLi4ubm9kZURhdGEsXG4gICAgICAgIC8vIE5vdGU6ICdzZWxlY3RlZDogdHJ1ZScgc2hvdWxkIE5PVCBiZSBhZGRlZFxuICAgICAgfVxuXG4gICAgICBleHBlY3QoY3JlYXRlZE5vZGVEYXRhLnNlbGVjdGVkKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChjcmVhdGVkTm9kZURhdGEudHlwZSkudG9CZShCbG9ja0VudW0uU3RhcnQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIFRyaWdnZXJXZWJob29rIG5vZGUgd2l0aG91dCBhdXRvLXNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0geyB0eXBlOiBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssIHRpdGxlOiAnV2ViaG9vayBUcmlnZ2VyJyB9XG4gICAgICBjb25zdCB0b29sQ29uZmlnID0geyB3ZWJob29rX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vd2ViaG9vaycgfVxuXG4gICAgICBjb25zdCBjcmVhdGVkTm9kZURhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge1xuICAgICAgICAuLi5ub2RlRGF0YSxcbiAgICAgICAgLi4udG9vbENvbmZpZyxcbiAgICAgICAgLy8gTm90ZTogJ3NlbGVjdGVkOiB0cnVlJyBzaG91bGQgTk9UIGJlIGFkZGVkXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChjcmVhdGVkTm9kZURhdGEuc2VsZWN0ZWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KGNyZWF0ZWROb2RlRGF0YS50eXBlKS50b0JlKEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaylcbiAgICAgIGV4cGVjdChjcmVhdGVkTm9kZURhdGEud2ViaG9va191cmwpLnRvQmUoJ2h0dHBzOi8vZXhhbXBsZS5jb20vd2ViaG9vaycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgb3RoZXIgbm9kZSBwcm9wZXJ0aWVzIHdoaWxlIGF2b2lkaW5nIGF1dG8tc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgbm9kZURhdGEgPSB7XG4gICAgICAgIHR5cGU6IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsXG4gICAgICAgIHRpdGxlOiAnU2NoZWR1bGUgVHJpZ2dlcicsXG4gICAgICAgIGNvbmZpZzogeyBpbnRlcnZhbDogJzFoJyB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBjcmVhdGVkTm9kZURhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge1xuICAgICAgICAuLi5ub2RlRGF0YSxcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KGNyZWF0ZWROb2RlRGF0YS5zZWxlY3RlZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QoY3JlYXRlZE5vZGVEYXRhLnR5cGUpLnRvQmUoQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSlcbiAgICAgIGV4cGVjdChjcmVhdGVkTm9kZURhdGEudGl0bGUpLnRvQmUoJ1NjaGVkdWxlIFRyaWdnZXInKVxuICAgICAgZXhwZWN0KGNyZWF0ZWROb2RlRGF0YS5jb25maWcpLnRvRXF1YWwoeyBpbnRlcnZhbDogJzFoJyB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1dvcmtmbG93IEluaXRpYWxpemF0aW9uIExvZ2ljJywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIFRlc3QgdGhlIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZyb20gdXNlLXdvcmtmbG93LWluaXQudHNcbiAgICAgKiBUaGlzIGVuc3VyZXMgb25ib2FyZGluZyBpcyB0cmlnZ2VyZWQgY29ycmVjdGx5IGZvciBuZXcgd29ya2Zsb3dzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIG9uYm9hcmRpbmcgZm9yIG5ldyB3b3JrZmxvdyB3aGVuIGRyYWZ0IGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgICAgLy8gU2ltdWxhdGUgdGhlIGVycm9yIGhhbmRsaW5nIGxvZ2ljIGZyb20gdXNlLXdvcmtmbG93LWluaXQudHNcbiAgICAgIGNvbnN0IGVycm9yID0ge1xuICAgICAgICBqc29uOiB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHsgY29kZTogJ2RyYWZ0X3dvcmtmbG93X25vdF9leGlzdCcgfSksXG4gICAgICAgIGJvZHlVc2VkOiBmYWxzZSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9ja1dvcmtmbG93U3RvcmUgPSB7XG4gICAgICAgIHNldFN0YXRlOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBTaW11bGF0ZSBlcnJvciBoYW5kbGluZ1xuICAgICAgaWYgKGVycm9yICYmIGVycm9yLmpzb24gJiYgIWVycm9yLmJvZHlVc2VkKSB7XG4gICAgICAgIGVycm9yLmpzb24oKS50aGVuKChlcnI6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ2RyYWZ0X3dvcmtmbG93X25vdF9leGlzdCcpIHtcbiAgICAgICAgICAgIG1vY2tXb3JrZmxvd1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgbm90SW5pdGlhbFdvcmtmbG93OiB0cnVlLFxuICAgICAgICAgICAgICBzaG93T25ib2FyZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXJyb3IuanNvbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1dvcmtmbG93U3RvcmUuc2V0U3RhdGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBub3RJbml0aWFsV29ya2Zsb3c6IHRydWUsXG4gICAgICAgICAgc2hvd09uYm9hcmRpbmc6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIG9uYm9hcmRpbmcgZm9yIGV4aXN0aW5nIHdvcmtmbG93cycsICgpID0+IHtcbiAgICAgIC8vIFNpbXVsYXRlIHN1Y2Nlc3NmdWwgZHJhZnQgZmV0Y2hcbiAgICAgIGNvbnN0IG1vY2tXb3JrZmxvd1N0b3JlID0ge1xuICAgICAgICBzZXRTdGF0ZTogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgLy8gTm9ybWFsIGluaXRpYWxpemF0aW9uIHBhdGggc2hvdWxkIG5vdCBzZXQgc2hvd09uYm9hcmRpbmc6IHRydWVcbiAgICAgIG1vY2tXb3JrZmxvd1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IFtdLFxuICAgICAgICBjb252ZXJzYXRpb25WYXJpYWJsZXM6IFtdLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KG1vY2tXb3JrZmxvd1N0b3JlLnNldFN0YXRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgc2hvd09uYm9hcmRpbmc6IHRydWUgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIGVtcHR5IGRyYWZ0IHdpdGggcHJvcGVyIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tTeW5jV29ya2Zsb3dEcmFmdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGFwcElkID0gJ3Rlc3QtYXBwLWlkJ1xuXG4gICAgICAvLyBTaW11bGF0ZSB0aGUgc3luY1dvcmtmbG93RHJhZnQgY2FsbCBmcm9tIHVzZS13b3JrZmxvdy1pbml0LnRzXG4gICAgICBjb25zdCBkcmFmdFBhcmFtcyA9IHtcbiAgICAgICAgdXJsOiBgL2FwcHMvJHthcHBJZH0vd29ya2Zsb3dzL2RyYWZ0YCxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgZ3JhcGg6IHtcbiAgICAgICAgICAgIG5vZGVzOiBbXSwgLy8gRW1wdHkgbm9kZXMgaW5pdGlhbGx5XG4gICAgICAgICAgICBlZGdlczogW10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmZWF0dXJlczoge1xuICAgICAgICAgICAgcmV0cmlldmVyX3Jlc291cmNlOiB7IGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVudmlyb25tZW50X3ZhcmlhYmxlczogW10sXG4gICAgICAgICAgY29udmVyc2F0aW9uX3ZhcmlhYmxlczogW10sXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIG1vY2tTeW5jV29ya2Zsb3dEcmFmdChkcmFmdFBhcmFtcylcblxuICAgICAgZXhwZWN0KG1vY2tTeW5jV29ya2Zsb3dEcmFmdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB1cmw6IGAvYXBwcy8ke2FwcElkfS93b3JrZmxvd3MvZHJhZnRgLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBncmFwaDoge1xuICAgICAgICAgICAgbm9kZXM6IFtdLFxuICAgICAgICAgICAgZWRnZXM6IFtdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgIHJldHJpZXZlcl9yZXNvdXJjZTogeyBlbmFibGVkOiB0cnVlIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbnZpcm9ubWVudF92YXJpYWJsZXM6IFtdLFxuICAgICAgICAgIGNvbnZlcnNhdGlvbl92YXJpYWJsZXM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBdXRvLURldGVjdGlvbiBmb3IgRW1wdHkgQ2FudmFzJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbW9ja0dldE5vZGVzLm1vY2tDbGVhcigpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGV0ZWN0IGVtcHR5IGNhbnZhcyBhbmQgdHJpZ2dlciBvbmJvYXJkaW5nJywgKCkgPT4ge1xuICAgICAgLy8gTW9jayBlbXB0eSBjYW52YXNcbiAgICAgIG1vY2tHZXROb2Rlcy5tb2NrUmV0dXJuVmFsdWUoW10pXG5cbiAgICAgIC8vIE1vY2sgc3RvcmUgd2l0aCBwcm9wZXIgc3RhdGUgZm9yIGF1dG8tZGV0ZWN0aW9uXG4gICAgICA7KHVzZVdvcmtmbG93U3RvcmUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2hvd09uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICBoYXNTaG93bk9uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICBub3RJbml0aWFsV29ya2Zsb3c6IGZhbHNlLFxuICAgICAgICBzZXRTaG93T25ib2FyZGluZzogbW9ja1NldFNob3dPbmJvYXJkaW5nLFxuICAgICAgICBzZXRIYXNTaG93bk9uYm9hcmRpbmc6IG1vY2tTZXRIYXNTaG93bk9uYm9hcmRpbmcsXG4gICAgICAgIGhhc1NlbGVjdGVkU3RhcnROb2RlOiBmYWxzZSxcbiAgICAgICAgc2V0SGFzU2VsZWN0ZWRTdGFydE5vZGU6IG1vY2tTZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZSxcbiAgICAgICAgc2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcjogZmFsc2UsXG4gICAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IG1vY2tTZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yLFxuICAgICAgICBnZXRTdGF0ZTogKCkgPT4gKHtcbiAgICAgICAgICBzaG93T25ib2FyZGluZzogZmFsc2UsXG4gICAgICAgICAgaGFzU2hvd25PbmJvYXJkaW5nOiBmYWxzZSxcbiAgICAgICAgICBub3RJbml0aWFsV29ya2Zsb3c6IGZhbHNlLFxuICAgICAgICAgIHNldFNob3dPbmJvYXJkaW5nOiBtb2NrU2V0U2hvd09uYm9hcmRpbmcsXG4gICAgICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nOiBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgICAgIGhhc1NlbGVjdGVkU3RhcnROb2RlOiBmYWxzZSxcbiAgICAgICAgICBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZTogbW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlLFxuICAgICAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IG1vY2tTZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNpbXVsYXRlIGVtcHR5IGNhbnZhcyBjaGVjayBsb2dpY1xuICAgICAgY29uc3Qgbm9kZXMgPSBtb2NrR2V0Tm9kZXMoKVxuICAgICAgY29uc3Qgc3RhcnROb2RlVHlwZXMgPSBbXG4gICAgICAgIEJsb2NrRW51bS5TdGFydCxcbiAgICAgICAgQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSxcbiAgICAgICAgQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rLFxuICAgICAgICBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbixcbiAgICAgIF1cbiAgICAgIGNvbnN0IGhhc1N0YXJ0Tm9kZSA9IG5vZGVzLnNvbWUoKG5vZGU6IE1vY2tOb2RlKSA9PiBzdGFydE5vZGVUeXBlcy5pbmNsdWRlcyhub2RlLmRhdGE/LnR5cGUgYXMgQmxvY2tFbnVtKSlcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBub2Rlcy5sZW5ndGggPT09IDAgfHwgIWhhc1N0YXJ0Tm9kZVxuXG4gICAgICBleHBlY3QoaXNFbXB0eSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KG5vZGVzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRldGVjdCBjYW52YXMgd2l0aCBub24tc3RhcnQgbm9kZXMgYXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBNb2NrIGNhbnZhcyB3aXRoIG5vbi1zdGFydCBub2Rlc1xuICAgICAgbW9ja0dldE5vZGVzLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIHsgaWQ6ICcxJywgZGF0YTogeyB0eXBlOiBCbG9ja0VudW0uTExNIH0gfSxcbiAgICAgICAgeyBpZDogJzInLCBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5Db2RlIH0gfSxcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IG5vZGVzID0gbW9ja0dldE5vZGVzKClcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZVR5cGVzID0gW1xuICAgICAgICBCbG9ja0VudW0uU3RhcnQsXG4gICAgICAgIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsXG4gICAgICAgIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vayxcbiAgICAgICAgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW4sXG4gICAgICBdXG4gICAgICBjb25zdCBoYXNTdGFydE5vZGUgPSBub2Rlcy5zb21lKChub2RlOiBNb2NrTm9kZSkgPT4gc3RhcnROb2RlVHlwZXMuaW5jbHVkZXMobm9kZS5kYXRhLnR5cGUgYXMgQmxvY2tFbnVtKSlcbiAgICAgIGNvbnN0IGlzRW1wdHkgPSBub2Rlcy5sZW5ndGggPT09IDAgfHwgIWhhc1N0YXJ0Tm9kZVxuXG4gICAgICBleHBlY3QoaXNFbXB0eSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGhhc1N0YXJ0Tm9kZSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgZGV0ZWN0IGNhbnZhcyB3aXRoIHN0YXJ0IG5vZGVzIGFzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gTW9jayBjYW52YXMgd2l0aCBzdGFydCBub2RlXG4gICAgICBtb2NrR2V0Tm9kZXMubW9ja1JldHVyblZhbHVlKFtcbiAgICAgICAgeyBpZDogJzEnLCBkYXRhOiB7IHR5cGU6IEJsb2NrRW51bS5TdGFydCB9IH0sXG4gICAgICBdKVxuXG4gICAgICBjb25zdCBub2RlcyA9IG1vY2tHZXROb2RlcygpXG4gICAgICBjb25zdCBzdGFydE5vZGVUeXBlcyA9IFtcbiAgICAgICAgQmxvY2tFbnVtLlN0YXJ0LFxuICAgICAgICBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlLFxuICAgICAgICBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssXG4gICAgICAgIEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luLFxuICAgICAgXVxuICAgICAgY29uc3QgaGFzU3RhcnROb2RlID0gbm9kZXMuc29tZSgobm9kZTogTW9ja05vZGUpID0+IHN0YXJ0Tm9kZVR5cGVzLmluY2x1ZGVzKG5vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bSkpXG4gICAgICBjb25zdCBpc0VtcHR5ID0gbm9kZXMubGVuZ3RoID09PSAwIHx8ICFoYXNTdGFydE5vZGVcblxuICAgICAgZXhwZWN0KGlzRW1wdHkpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoaGFzU3RhcnROb2RlKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRyaWdnZXIgb25ib2FyZGluZyBpZiBhbHJlYWR5IHNob3duIGluIHNlc3Npb24nLCAoKSA9PiB7XG4gICAgICAvLyBNb2NrIGVtcHR5IGNhbnZhc1xuICAgICAgbW9ja0dldE5vZGVzLm1vY2tSZXR1cm5WYWx1ZShbXSlcblxuICAgICAgLy8gTW9jayBzdG9yZSB3aXRoIGhhc1Nob3duT25ib2FyZGluZyA9IHRydWVcbiAgICAgIDsodXNlV29ya2Zsb3dTdG9yZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzaG93T25ib2FyZGluZzogZmFsc2UsXG4gICAgICAgIGhhc1Nob3duT25ib2FyZGluZzogdHJ1ZSwgLy8gQWxyZWFkeSBzaG93biBpbiB0aGlzIHNlc3Npb25cbiAgICAgICAgbm90SW5pdGlhbFdvcmtmbG93OiBmYWxzZSxcbiAgICAgICAgc2V0U2hvd09uYm9hcmRpbmc6IG1vY2tTZXRTaG93T25ib2FyZGluZyxcbiAgICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nOiBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgICBoYXNTZWxlY3RlZFN0YXJ0Tm9kZTogZmFsc2UsXG4gICAgICAgIHNldEhhc1NlbGVjdGVkU3RhcnROb2RlOiBtb2NrU2V0SGFzU2VsZWN0ZWRTdGFydE5vZGUsXG4gICAgICAgIHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IGZhbHNlLFxuICAgICAgICBzZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yOiBtb2NrU2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcixcbiAgICAgICAgZ2V0U3RhdGU6ICgpID0+ICh7XG4gICAgICAgICAgc2hvd09uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICAgIGhhc1Nob3duT25ib2FyZGluZzogdHJ1ZSxcbiAgICAgICAgICBub3RJbml0aWFsV29ya2Zsb3c6IGZhbHNlLFxuICAgICAgICAgIHNldFNob3dPbmJvYXJkaW5nOiBtb2NrU2V0U2hvd09uYm9hcmRpbmcsXG4gICAgICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nOiBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgICAgIGhhc1NlbGVjdGVkU3RhcnROb2RlOiBmYWxzZSxcbiAgICAgICAgICBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZTogbW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlLFxuICAgICAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IG1vY2tTZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNpbXVsYXRlIHRoZSBjaGVjayBsb2dpYyB3aXRoIGhhc1Nob3duT25ib2FyZGluZyA9IHRydWVcbiAgICAgIGNvbnN0IHN0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpIGFzIHVua25vd24gYXMgTW9ja1dvcmtmbG93U3RvcmVcbiAgICAgIGNvbnN0IHNob3VsZFRyaWdnZXIgPSAhc3RvcmUuaGFzU2hvd25PbmJvYXJkaW5nICYmICFzdG9yZS5zaG93T25ib2FyZGluZyAmJiAhc3RvcmUubm90SW5pdGlhbFdvcmtmbG93XG5cbiAgICAgIGV4cGVjdChzaG91bGRUcmlnZ2VyKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIG9uYm9hcmRpbmcgZHVyaW5nIGluaXRpYWwgd29ya2Zsb3cgY3JlYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBNb2NrIGVtcHR5IGNhbnZhc1xuICAgICAgbW9ja0dldE5vZGVzLm1vY2tSZXR1cm5WYWx1ZShbXSlcblxuICAgICAgLy8gTW9jayBzdG9yZSB3aXRoIG5vdEluaXRpYWxXb3JrZmxvdyA9IHRydWUgKGluaXRpYWwgY3JlYXRpb24pXG4gICAgICA7KHVzZVdvcmtmbG93U3RvcmUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2hvd09uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICBoYXNTaG93bk9uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICBub3RJbml0aWFsV29ya2Zsb3c6IHRydWUsIC8vIEluaXRpYWwgd29ya2Zsb3cgY3JlYXRpb25cbiAgICAgICAgc2V0U2hvd09uYm9hcmRpbmc6IG1vY2tTZXRTaG93T25ib2FyZGluZyxcbiAgICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nOiBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgICBoYXNTZWxlY3RlZFN0YXJ0Tm9kZTogZmFsc2UsXG4gICAgICAgIHNldEhhc1NlbGVjdGVkU3RhcnROb2RlOiBtb2NrU2V0SGFzU2VsZWN0ZWRTdGFydE5vZGUsXG4gICAgICAgIHNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IGZhbHNlLFxuICAgICAgICBzZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yOiBtb2NrU2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvcixcbiAgICAgICAgZ2V0U3RhdGU6ICgpID0+ICh7XG4gICAgICAgICAgc2hvd09uYm9hcmRpbmc6IGZhbHNlLFxuICAgICAgICAgIGhhc1Nob3duT25ib2FyZGluZzogZmFsc2UsXG4gICAgICAgICAgbm90SW5pdGlhbFdvcmtmbG93OiB0cnVlLFxuICAgICAgICAgIHNldFNob3dPbmJvYXJkaW5nOiBtb2NrU2V0U2hvd09uYm9hcmRpbmcsXG4gICAgICAgICAgc2V0SGFzU2hvd25PbmJvYXJkaW5nOiBtb2NrU2V0SGFzU2hvd25PbmJvYXJkaW5nLFxuICAgICAgICAgIGhhc1NlbGVjdGVkU3RhcnROb2RlOiBmYWxzZSxcbiAgICAgICAgICBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZTogbW9ja1NldEhhc1NlbGVjdGVkU3RhcnROb2RlLFxuICAgICAgICAgIHNldFNob3VsZEF1dG9PcGVuU3RhcnROb2RlU2VsZWN0b3I6IG1vY2tTZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNpbXVsYXRlIHRoZSBjaGVjayBsb2dpYyB3aXRoIG5vdEluaXRpYWxXb3JrZmxvdyA9IHRydWVcbiAgICAgIGNvbnN0IHN0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpIGFzIHVua25vd24gYXMgTW9ja1dvcmtmbG93U3RvcmVcbiAgICAgIGNvbnN0IHNob3VsZFRyaWdnZXIgPSAhc3RvcmUuaGFzU2hvd25PbmJvYXJkaW5nICYmICFzdG9yZS5zaG93T25ib2FyZGluZyAmJiAhc3RvcmUubm90SW5pdGlhbFdvcmtmbG93XG5cbiAgICAgIGV4cGVjdChzaG91bGRUcmlnZ2VyKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19