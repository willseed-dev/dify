"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const toast_1 = require("@/app/components/base/toast");
const debug_configuration_1 = require("@/context/debug-configuration");
const app_1 = require("@/types/app");
const index_1 = require("./index");
const notifySpy = vitest_1.vi.spyOn(toast_1.default, 'notify').mockImplementation(vitest_1.vi.fn());
const setShowExternalDataToolModal = vitest_1.vi.fn();
let subscriptionCallback = null;
vitest_1.vi.mock('@/context/event-emitter', () => ({
    useEventEmitterContextContext: () => ({
        eventEmitter: {
            useSubscription: (callback) => {
                subscriptionCallback = callback;
            },
        },
    }),
}));
vitest_1.vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowExternalDataToolModal,
    }),
}));
let latestSortableProps = null;
vitest_1.vi.mock('react-sortablejs', () => ({
    ReactSortable: (props) => {
        latestSortableProps = props;
        return <div data-testid="sortable">{props.children}</div>;
    },
}));
const defaultDebugConfigValue = {
    mode: app_1.AppModeEnum.CHAT,
    dataSets: [],
    modelConfig: {
        model_id: 'test-model',
    },
};
const createDebugConfigValue = (overrides = {}) => ({
    ...defaultDebugConfigValue,
    ...overrides,
});
let variableIndex = 0;
const createPromptVariable = (overrides = {}) => {
    variableIndex += 1;
    return {
        key: `var_${variableIndex}`,
        name: `Variable ${variableIndex}`,
        type: 'string',
        required: false,
        ...overrides,
    };
};
const renderConfigVar = (props = {}, debugOverrides = {}) => {
    const defaultProps = {
        promptVariables: [],
        readonly: false,
        onPromptVariablesChange: vitest_1.vi.fn(),
    };
    const mergedProps = {
        ...defaultProps,
        ...props,
    };
    return (0, react_1.render)(<debug_configuration_1.default.Provider value={createDebugConfigValue(debugOverrides)}>
      <index_1.default {...mergedProps}/>
    </debug_configuration_1.default.Provider>);
};
describe('ConfigVar', () => {
    // Rendering behavior for empty and populated states.
    describe('ConfigVar Rendering', () => {
        beforeEach(() => {
            vitest_1.vi.clearAllMocks();
            latestSortableProps = null;
            subscriptionCallback = null;
            variableIndex = 0;
            notifySpy.mockClear();
        });
        it('should show empty state when no variables exist', () => {
            renderConfigVar({ promptVariables: [] });
            expect(react_1.screen.getByText('appDebug.notSetVar')).toBeInTheDocument();
        });
        it('should render variable items and allow reordering via sortable list', () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const firstVar = createPromptVariable({ key: 'first', name: 'First' });
            const secondVar = createPromptVariable({ key: 'second', name: 'Second' });
            renderConfigVar({
                promptVariables: [firstVar, secondVar],
                onPromptVariablesChange,
            });
            expect(react_1.screen.getByText('first')).toBeInTheDocument();
            expect(react_1.screen.getByText('second')).toBeInTheDocument();
            (0, react_1.act)(() => {
                latestSortableProps?.setList([
                    { id: 'second', variable: secondVar },
                    { id: 'first', variable: firstVar },
                ]);
            });
            expect(onPromptVariablesChange).toHaveBeenCalledWith([secondVar, firstVar]);
        });
    });
    // Variable creation flows using the add menu.
    describe('ConfigVar Add Variable', () => {
        beforeEach(() => {
            vitest_1.vi.clearAllMocks();
            latestSortableProps = null;
            subscriptionCallback = null;
            variableIndex = 0;
            notifySpy.mockClear();
        });
        it('should add a text variable when selecting the string option', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            renderConfigVar({ promptVariables: [], onPromptVariablesChange });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.add'));
            react_1.fireEvent.click(await react_1.screen.findByText('appDebug.variableConfig.string'));
            expect(onPromptVariablesChange).toHaveBeenCalledTimes(1);
            const [nextVariables] = onPromptVariablesChange.mock.calls[0];
            expect(nextVariables).toHaveLength(1);
            expect(nextVariables[0].type).toBe('string');
        });
        it('should open the external data tool modal when adding an api variable', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            renderConfigVar({ promptVariables: [], onPromptVariablesChange });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.add'));
            react_1.fireEvent.click(await react_1.screen.findByText('appDebug.variableConfig.apiBasedVar'));
            expect(onPromptVariablesChange).toHaveBeenCalledTimes(1);
            expect(setShowExternalDataToolModal).toHaveBeenCalledTimes(1);
            const modalState = setShowExternalDataToolModal.mock.calls[0][0];
            expect(modalState.payload.type).toBe('api');
            (0, react_1.act)(() => {
                modalState.onCancelCallback?.();
            });
            expect(onPromptVariablesChange).toHaveBeenLastCalledWith([]);
        });
        it('should restore previous variables when cancelling api variable with existing items', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const existingVar = createPromptVariable({ key: 'existing', name: 'Existing' });
            renderConfigVar({ promptVariables: [existingVar], onPromptVariablesChange });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.add'));
            react_1.fireEvent.click(await react_1.screen.findByText('appDebug.variableConfig.apiBasedVar'));
            const modalState = setShowExternalDataToolModal.mock.calls[0][0];
            (0, react_1.act)(() => {
                modalState.onCancelCallback?.();
            });
            expect(onPromptVariablesChange).toHaveBeenCalledTimes(2);
            const [addedVariables] = onPromptVariablesChange.mock.calls[0];
            expect(addedVariables).toHaveLength(2);
            expect(addedVariables[0]).toBe(existingVar);
            expect(addedVariables[1].type).toBe('api');
            expect(onPromptVariablesChange).toHaveBeenLastCalledWith([existingVar]);
        });
    });
    // Editing flows for variables through the modal.
    describe('ConfigVar Edit Variable', () => {
        beforeEach(() => {
            vitest_1.vi.clearAllMocks();
            latestSortableProps = null;
            subscriptionCallback = null;
            variableIndex = 0;
            notifySpy.mockClear();
        });
        it('should save updates when editing a basic variable', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const variable = createPromptVariable({ key: 'name', name: 'Name' });
            renderConfigVar({
                promptVariables: [variable],
                onPromptVariablesChange,
            });
            const item = react_1.screen.getByTitle('name · Name');
            const itemContainer = item.closest('div.group');
            expect(itemContainer).not.toBeNull();
            const actionButtons = itemContainer.querySelectorAll('div.h-6.w-6');
            expect(actionButtons).toHaveLength(2);
            react_1.fireEvent.click(actionButtons[0]);
            const saveButton = await react_1.screen.findByRole('button', { name: 'common.operation.save' });
            react_1.fireEvent.click(saveButton);
            expect(onPromptVariablesChange).toHaveBeenCalledTimes(1);
        });
        it('should show error when variable key is duplicated', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const firstVar = createPromptVariable({ key: 'first', name: 'First' });
            const secondVar = createPromptVariable({ key: 'second', name: 'Second' });
            renderConfigVar({
                promptVariables: [firstVar, secondVar],
                onPromptVariablesChange,
            });
            const item = react_1.screen.getByTitle('first · First');
            const itemContainer = item.closest('div.group');
            expect(itemContainer).not.toBeNull();
            const actionButtons = itemContainer.querySelectorAll('div.h-6.w-6');
            expect(actionButtons).toHaveLength(2);
            react_1.fireEvent.click(actionButtons[0]);
            const inputs = await react_1.screen.findAllByPlaceholderText('appDebug.variableConfig.inputPlaceholder');
            react_1.fireEvent.change(inputs[0], { target: { value: 'second' } });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            expect(toast_1.default.notify).toHaveBeenCalled();
            expect(onPromptVariablesChange).not.toHaveBeenCalled();
        });
        it('should show error when variable label is duplicated', async () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const firstVar = createPromptVariable({ key: 'first', name: 'First' });
            const secondVar = createPromptVariable({ key: 'second', name: 'Second' });
            renderConfigVar({
                promptVariables: [firstVar, secondVar],
                onPromptVariablesChange,
            });
            const item = react_1.screen.getByTitle('first · First');
            const itemContainer = item.closest('div.group');
            expect(itemContainer).not.toBeNull();
            const actionButtons = itemContainer.querySelectorAll('div.h-6.w-6');
            expect(actionButtons).toHaveLength(2);
            react_1.fireEvent.click(actionButtons[0]);
            const inputs = await react_1.screen.findAllByPlaceholderText('appDebug.variableConfig.inputPlaceholder');
            react_1.fireEvent.change(inputs[1], { target: { value: 'Second' } });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            expect(toast_1.default.notify).toHaveBeenCalled();
            expect(onPromptVariablesChange).not.toHaveBeenCalled();
        });
    });
    // Removal behavior including confirm modal branch.
    describe('ConfigVar Remove Variable', () => {
        beforeEach(() => {
            vitest_1.vi.clearAllMocks();
            latestSortableProps = null;
            subscriptionCallback = null;
            variableIndex = 0;
            notifySpy.mockClear();
        });
        it('should remove variable directly when context confirmation is not required', () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const variable = createPromptVariable({ key: 'name', name: 'Name' });
            renderConfigVar({
                promptVariables: [variable],
                onPromptVariablesChange,
            });
            const removeBtn = react_1.screen.getByTestId('var-item-delete-btn');
            react_1.fireEvent.click(removeBtn);
            expect(onPromptVariablesChange).toHaveBeenCalledWith([]);
        });
        it('should require confirmation when removing context variable with datasets in completion mode', () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            const variable = createPromptVariable({
                key: 'context',
                name: 'Context',
                is_context_var: true,
            });
            renderConfigVar({
                promptVariables: [variable],
                onPromptVariablesChange,
            }, {
                mode: app_1.AppModeEnum.COMPLETION,
                dataSets: [{ id: 'dataset-1' }],
            });
            const deleteBtn = react_1.screen.getByTestId('var-item-delete-btn');
            react_1.fireEvent.click(deleteBtn);
            // confirmation modal should show up
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.confirm' }));
            expect(onPromptVariablesChange).toHaveBeenCalledWith([]);
        });
    });
    // Event subscription support for external data tools.
    describe('ConfigVar External Data Tool Events', () => {
        beforeEach(() => {
            vitest_1.vi.clearAllMocks();
            latestSortableProps = null;
            subscriptionCallback = null;
            variableIndex = 0;
            notifySpy.mockClear();
        });
        it('should append external data tool variables from event emitter', () => {
            const onPromptVariablesChange = vitest_1.vi.fn();
            renderConfigVar({
                promptVariables: [],
                onPromptVariablesChange,
            });
            (0, react_1.act)(() => {
                subscriptionCallback?.({
                    type: index_1.ADD_EXTERNAL_DATA_TOOL,
                    payload: {
                        variable: 'api_var',
                        label: 'API Var',
                        enabled: true,
                        type: 'api',
                        config: {},
                        icon: 'icon',
                        icon_background: 'bg',
                    },
                });
            });
            expect(onPromptVariablesChange).toHaveBeenCalledWith([
                expect.objectContaining({
                    key: 'api_var',
                    name: 'API Var',
                    required: true,
                    type: 'api',
                }),
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsa0RBQXVFO0FBQ3ZFLCtCQUE4QjtBQUM5QixtQ0FBMkI7QUFDM0IsdURBQStDO0FBQy9DLHVFQUFxRTtBQUNyRSxxQ0FBeUM7QUFFekMsbUNBQTJEO0FBRTNELE1BQU0sU0FBUyxHQUFHLFdBQUUsQ0FBQyxLQUFLLENBQUMsZUFBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBRXZFLE1BQU0sNEJBQTRCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBTzVDLElBQUksb0JBQW9CLEdBQWdELElBQUksQ0FBQTtBQUU1RSxXQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwQyxZQUFZLEVBQUU7WUFDWixlQUFlLEVBQUUsQ0FBQyxRQUE0QyxFQUFFLEVBQUU7Z0JBQ2hFLG9CQUFvQixHQUFHLFFBQVEsQ0FBQTtZQUNqQyxDQUFDO1NBQ0Y7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxXQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdEIsNEJBQTRCO0tBQzdCLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQWFILElBQUksbUJBQW1CLEdBQXlCLElBQUksQ0FBQTtBQUVwRCxXQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsYUFBYSxFQUFFLENBQUMsS0FBb0IsRUFBRSxFQUFFO1FBQ3RDLG1CQUFtQixHQUFHLEtBQUssQ0FB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QUFlLEVBQUUsRUFBRTtnQkFDbkIsdUJBQXVCO2FBQ3hCLENBQUMsQ0FBQTtZQUVGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtnQkFDUCxvQkFBb0IsRUFBRSxDQUFDO29CQUNyQixJQUFJLEVBQUUsOEJBQXNCO29CQUM1QixPQUFPLEVBQUU7d0JBQ1AsUUFBUSxFQUFFLFNBQVM7d0JBQ25CLEtBQUssRUFBRSxTQUFTO3dCQUNoQixPQUFPLEVBQUUsSUFBSTt3QkFDYixJQUFJLEVBQUUsS0FBSzt3QkFDWCxNQUFNLEVBQUUsRUFBRTt3QkFDVixJQUFJLEVBQUUsTUFBTTt3QkFDWixlQUFlLEVBQUUsSUFBSTtxQkFDdEI7aUJBQ0YsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7WUFFRixNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDO29CQUN0QixHQUFHLEVBQUUsU0FBUztvQkFDZCxJQUFJLEVBQUUsU0FBUztvQkFDZixRQUFRLEVBQUUsSUFBSTtvQkFDZCxJQUFJLEVBQUUsS0FBSztpQkFDWixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgSUNvbmZpZ1ZhclByb3BzIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB0eXBlIHsgRXh0ZXJuYWxEYXRhVG9vbCB9IGZyb20gJ0AvbW9kZWxzL2NvbW1vbidcbmltcG9ydCB0eXBlIHsgUHJvbXB0VmFyaWFibGUgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBEZWJ1Z0NvbmZpZ3VyYXRpb25Db250ZXh0IGZyb20gJ0AvY29udGV4dC9kZWJ1Zy1jb25maWd1cmF0aW9uJ1xuaW1wb3J0IHsgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcblxuaW1wb3J0IENvbmZpZ1ZhciwgeyBBRERfRVhURVJOQUxfREFUQV9UT09MIH0gZnJvbSAnLi9pbmRleCdcblxuY29uc3Qgbm90aWZ5U3B5ID0gdmkuc3B5T24oVG9hc3QsICdub3RpZnknKS5tb2NrSW1wbGVtZW50YXRpb24odmkuZm4oKSlcblxuY29uc3Qgc2V0U2hvd0V4dGVybmFsRGF0YVRvb2xNb2RhbCA9IHZpLmZuKClcblxudHlwZSBTdWJzY3JpcHRpb25FdmVudCA9IHtcbiAgdHlwZTogc3RyaW5nXG4gIHBheWxvYWQ6IEV4dGVybmFsRGF0YVRvb2xcbn1cblxubGV0IHN1YnNjcmlwdGlvbkNhbGxiYWNrOiAoKGV2ZW50OiBTdWJzY3JpcHRpb25FdmVudCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuXG52aS5tb2NrKCdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcicsICgpID0+ICh7XG4gIHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0OiAoKSA9PiAoe1xuICAgIGV2ZW50RW1pdHRlcjoge1xuICAgICAgdXNlU3Vic2NyaXB0aW9uOiAoY2FsbGJhY2s6IChldmVudDogU3Vic2NyaXB0aW9uRXZlbnQpID0+IHZvaWQpID0+IHtcbiAgICAgICAgc3Vic2NyaXB0aW9uQ2FsbGJhY2sgPSBjYWxsYmFja1xuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dDogKCkgPT4gKHtcbiAgICBzZXRTaG93RXh0ZXJuYWxEYXRhVG9vbE1vZGFsLFxuICB9KSxcbn0pKVxuXG50eXBlIFNvcnRhYmxlSXRlbSA9IHtcbiAgaWQ6IHN0cmluZ1xuICB2YXJpYWJsZTogUHJvbXB0VmFyaWFibGVcbn1cblxudHlwZSBTb3J0YWJsZVByb3BzID0ge1xuICBsaXN0OiBTb3J0YWJsZUl0ZW1bXVxuICBzZXRMaXN0OiAobGlzdDogU29ydGFibGVJdGVtW10pID0+IHZvaWRcbiAgY2hpbGRyZW46IFJlYWN0Tm9kZVxufVxuXG5sZXQgbGF0ZXN0U29ydGFibGVQcm9wczogU29ydGFibGVQcm9wcyB8IG51bGwgPSBudWxsXG5cbnZpLm1vY2soJ3JlYWN0LXNvcnRhYmxlanMnLCAoKSA9PiAoe1xuICBSZWFjdFNvcnRhYmxlOiAocHJvcHM6IFNvcnRhYmxlUHJvcHMpID0+IHtcbiAgICBsYXRlc3RTb3J0YWJsZVByb3BzID0gcHJvcHNcbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInNvcnRhYmxlXCI+e3Byb3BzLmNoaWxkcmVufTwvZGl2PlxuICB9LFxufSkpXG5cbnR5cGUgRGVidWdDb25maWd1cmF0aW9uU3RhdGUgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5Qcm92aWRlcj5bJ3ZhbHVlJ11cblxuY29uc3QgZGVmYXVsdERlYnVnQ29uZmlnVmFsdWUgPSB7XG4gIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gIGRhdGFTZXRzOiBbXSxcbiAgbW9kZWxDb25maWc6IHtcbiAgICBtb2RlbF9pZDogJ3Rlc3QtbW9kZWwnLFxuICB9LFxufSBhcyB1bmtub3duIGFzIERlYnVnQ29uZmlndXJhdGlvblN0YXRlXG5cbmNvbnN0IGNyZWF0ZURlYnVnQ29uZmlnVmFsdWUgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPERlYnVnQ29uZmlndXJhdGlvblN0YXRlPiA9IHt9KTogRGVidWdDb25maWd1cmF0aW9uU3RhdGUgPT4gKHtcbiAgLi4uZGVmYXVsdERlYnVnQ29uZmlnVmFsdWUsXG4gIC4uLm92ZXJyaWRlcyxcbn0gYXMgdW5rbm93biBhcyBEZWJ1Z0NvbmZpZ3VyYXRpb25TdGF0ZSlcblxubGV0IHZhcmlhYmxlSW5kZXggPSAwXG5jb25zdCBjcmVhdGVQcm9tcHRWYXJpYWJsZSA9IChvdmVycmlkZXM6IFBhcnRpYWw8UHJvbXB0VmFyaWFibGU+ID0ge30pOiBQcm9tcHRWYXJpYWJsZSA9PiB7XG4gIHZhcmlhYmxlSW5kZXggKz0gMVxuICByZXR1cm4ge1xuICAgIGtleTogYHZhcl8ke3ZhcmlhYmxlSW5kZXh9YCxcbiAgICBuYW1lOiBgVmFyaWFibGUgJHt2YXJpYWJsZUluZGV4fWAsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfVxufVxuXG5jb25zdCByZW5kZXJDb25maWdWYXIgPSAocHJvcHM6IFBhcnRpYWw8SUNvbmZpZ1ZhclByb3BzPiA9IHt9LCBkZWJ1Z092ZXJyaWRlczogUGFydGlhbDxEZWJ1Z0NvbmZpZ3VyYXRpb25TdGF0ZT4gPSB7fSkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHM6IElDb25maWdWYXJQcm9wcyA9IHtcbiAgICBwcm9tcHRWYXJpYWJsZXM6IFtdLFxuICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgICBvblByb21wdFZhcmlhYmxlc0NoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIGNvbnN0IG1lcmdlZFByb3BzID0ge1xuICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAuLi5wcm9wcyxcbiAgfVxuXG4gIHJldHVybiByZW5kZXIoXG4gICAgPERlYnVnQ29uZmlndXJhdGlvbkNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e2NyZWF0ZURlYnVnQ29uZmlnVmFsdWUoZGVidWdPdmVycmlkZXMpfT5cbiAgICAgIDxDb25maWdWYXIgey4uLm1lcmdlZFByb3BzfSAvPlxuICAgIDwvRGVidWdDb25maWd1cmF0aW9uQ29udGV4dC5Qcm92aWRlcj4sXG4gIClcbn1cblxuZGVzY3JpYmUoJ0NvbmZpZ1ZhcicsICgpID0+IHtcbiAgLy8gUmVuZGVyaW5nIGJlaGF2aW9yIGZvciBlbXB0eSBhbmQgcG9wdWxhdGVkIHN0YXRlcy5cbiAgZGVzY3JpYmUoJ0NvbmZpZ1ZhciBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAgIGxhdGVzdFNvcnRhYmxlUHJvcHMgPSBudWxsXG4gICAgICBzdWJzY3JpcHRpb25DYWxsYmFjayA9IG51bGxcbiAgICAgIHZhcmlhYmxlSW5kZXggPSAwXG4gICAgICBub3RpZnlTcHkubW9ja0NsZWFyKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVtcHR5IHN0YXRlIHdoZW4gbm8gdmFyaWFibGVzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ29uZmlnVmFyKHsgcHJvbXB0VmFyaWFibGVzOiBbXSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwRGVidWcubm90U2V0VmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdmFyaWFibGUgaXRlbXMgYW5kIGFsbG93IHJlb3JkZXJpbmcgdmlhIHNvcnRhYmxlIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGZpcnN0VmFyID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoeyBrZXk6ICdmaXJzdCcsIG5hbWU6ICdGaXJzdCcgfSlcbiAgICAgIGNvbnN0IHNlY29uZFZhciA9IGNyZWF0ZVByb21wdFZhcmlhYmxlKHsga2V5OiAnc2Vjb25kJywgbmFtZTogJ1NlY29uZCcgfSlcblxuICAgICAgcmVuZGVyQ29uZmlnVmFyKHtcbiAgICAgICAgcHJvbXB0VmFyaWFibGVzOiBbZmlyc3RWYXIsIHNlY29uZFZhcl0sXG4gICAgICAgIG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpcnN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzZWNvbmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBsYXRlc3RTb3J0YWJsZVByb3BzPy5zZXRMaXN0KFtcbiAgICAgICAgICB7IGlkOiAnc2Vjb25kJywgdmFyaWFibGU6IHNlY29uZFZhciB9LFxuICAgICAgICAgIHsgaWQ6ICdmaXJzdCcsIHZhcmlhYmxlOiBmaXJzdFZhciB9LFxuICAgICAgICBdKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbc2Vjb25kVmFyLCBmaXJzdFZhcl0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBWYXJpYWJsZSBjcmVhdGlvbiBmbG93cyB1c2luZyB0aGUgYWRkIG1lbnUuXG4gIGRlc2NyaWJlKCdDb25maWdWYXIgQWRkIFZhcmlhYmxlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgICBsYXRlc3RTb3J0YWJsZVByb3BzID0gbnVsbFxuICAgICAgc3Vic2NyaXB0aW9uQ2FsbGJhY2sgPSBudWxsXG4gICAgICB2YXJpYWJsZUluZGV4ID0gMFxuICAgICAgbm90aWZ5U3B5Lm1vY2tDbGVhcigpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWRkIGEgdGV4dCB2YXJpYWJsZSB3aGVuIHNlbGVjdGluZyB0aGUgc3RyaW5nIG9wdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29uZmlnVmFyKHsgcHJvbXB0VmFyaWFibGVzOiBbXSwgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uYWRkJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLnN0cmluZycpKVxuXG4gICAgICBleHBlY3Qob25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgY29uc3QgW25leHRWYXJpYWJsZXNdID0gb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UubW9jay5jYWxsc1swXVxuICAgICAgZXhwZWN0KG5leHRWYXJpYWJsZXMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgZXhwZWN0KG5leHRWYXJpYWJsZXNbMF0udHlwZSkudG9CZSgnc3RyaW5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIHRoZSBleHRlcm5hbCBkYXRhIHRvb2wgbW9kYWwgd2hlbiBhZGRpbmcgYW4gYXBpIHZhcmlhYmxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb25maWdWYXIoeyBwcm9tcHRWYXJpYWJsZXM6IFtdLCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5hZGQnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnYXBwRGVidWcudmFyaWFibGVDb25maWcuYXBpQmFzZWRWYXInKSlcblxuICAgICAgZXhwZWN0KG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChzZXRTaG93RXh0ZXJuYWxEYXRhVG9vbE1vZGFsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgY29uc3QgbW9kYWxTdGF0ZSA9IHNldFNob3dFeHRlcm5hbERhdGFUb29sTW9kYWwubW9jay5jYWxsc1swXVswXVxuICAgICAgZXhwZWN0KG1vZGFsU3RhdGUucGF5bG9hZC50eXBlKS50b0JlKCdhcGknKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBtb2RhbFN0YXRlLm9uQ2FuY2VsQ2FsbGJhY2s/LigpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXN0b3JlIHByZXZpb3VzIHZhcmlhYmxlcyB3aGVuIGNhbmNlbGxpbmcgYXBpIHZhcmlhYmxlIHdpdGggZXhpc3RpbmcgaXRlbXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGV4aXN0aW5nVmFyID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoeyBrZXk6ICdleGlzdGluZycsIG5hbWU6ICdFeGlzdGluZycgfSlcblxuICAgICAgcmVuZGVyQ29uZmlnVmFyKHsgcHJvbXB0VmFyaWFibGVzOiBbZXhpc3RpbmdWYXJdLCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5hZGQnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnYXBwRGVidWcudmFyaWFibGVDb25maWcuYXBpQmFzZWRWYXInKSlcblxuICAgICAgY29uc3QgbW9kYWxTdGF0ZSA9IHNldFNob3dFeHRlcm5hbERhdGFUb29sTW9kYWwubW9jay5jYWxsc1swXVswXVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgbW9kYWxTdGF0ZS5vbkNhbmNlbENhbGxiYWNrPy4oKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICAgIGNvbnN0IFthZGRlZFZhcmlhYmxlc10gPSBvblByb21wdFZhcmlhYmxlc0NoYW5nZS5tb2NrLmNhbGxzWzBdXG4gICAgICBleHBlY3QoYWRkZWRWYXJpYWJsZXMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZXhwZWN0KGFkZGVkVmFyaWFibGVzWzBdKS50b0JlKGV4aXN0aW5nVmFyKVxuICAgICAgZXhwZWN0KGFkZGVkVmFyaWFibGVzWzFdLnR5cGUpLnRvQmUoJ2FwaScpXG4gICAgICBleHBlY3Qob25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aChbZXhpc3RpbmdWYXJdKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRpdGluZyBmbG93cyBmb3IgdmFyaWFibGVzIHRocm91Z2ggdGhlIG1vZGFsLlxuICBkZXNjcmliZSgnQ29uZmlnVmFyIEVkaXQgVmFyaWFibGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAgIGxhdGVzdFNvcnRhYmxlUHJvcHMgPSBudWxsXG4gICAgICBzdWJzY3JpcHRpb25DYWxsYmFjayA9IG51bGxcbiAgICAgIHZhcmlhYmxlSW5kZXggPSAwXG4gICAgICBub3RpZnlTcHkubW9ja0NsZWFyKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzYXZlIHVwZGF0ZXMgd2hlbiBlZGl0aW5nIGEgYmFzaWMgdmFyaWFibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoeyBrZXk6ICduYW1lJywgbmFtZTogJ05hbWUnIH0pXG5cbiAgICAgIHJlbmRlckNvbmZpZ1Zhcih7XG4gICAgICAgIHByb21wdFZhcmlhYmxlczogW3ZhcmlhYmxlXSxcbiAgICAgICAgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBpdGVtID0gc2NyZWVuLmdldEJ5VGl0bGUoJ25hbWUgwrcgTmFtZScpXG4gICAgICBjb25zdCBpdGVtQ29udGFpbmVyID0gaXRlbS5jbG9zZXN0KCdkaXYuZ3JvdXAnKVxuICAgICAgZXhwZWN0KGl0ZW1Db250YWluZXIpLm5vdC50b0JlTnVsbCgpXG4gICAgICBjb25zdCBhY3Rpb25CdXR0b25zID0gaXRlbUNvbnRhaW5lciEucXVlcnlTZWxlY3RvckFsbCgnZGl2LmgtNi53LTYnKVxuICAgICAgZXhwZWN0KGFjdGlvbkJ1dHRvbnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFjdGlvbkJ1dHRvbnNbMF0pXG5cbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBhd2FpdCBzY3JlZW4uZmluZEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvblByb21wdFZhcmlhYmxlc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIHZhcmlhYmxlIGtleSBpcyBkdXBsaWNhdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBmaXJzdFZhciA9IGNyZWF0ZVByb21wdFZhcmlhYmxlKHsga2V5OiAnZmlyc3QnLCBuYW1lOiAnRmlyc3QnIH0pXG4gICAgICBjb25zdCBzZWNvbmRWYXIgPSBjcmVhdGVQcm9tcHRWYXJpYWJsZSh7IGtleTogJ3NlY29uZCcsIG5hbWU6ICdTZWNvbmQnIH0pXG5cbiAgICAgIHJlbmRlckNvbmZpZ1Zhcih7XG4gICAgICAgIHByb21wdFZhcmlhYmxlczogW2ZpcnN0VmFyLCBzZWNvbmRWYXJdLFxuICAgICAgICBvblByb21wdFZhcmlhYmxlc0NoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBzY3JlZW4uZ2V0QnlUaXRsZSgnZmlyc3QgwrcgRmlyc3QnKVxuICAgICAgY29uc3QgaXRlbUNvbnRhaW5lciA9IGl0ZW0uY2xvc2VzdCgnZGl2Lmdyb3VwJylcbiAgICAgIGV4cGVjdChpdGVtQ29udGFpbmVyKS5ub3QudG9CZU51bGwoKVxuICAgICAgY29uc3QgYWN0aW9uQnV0dG9ucyA9IGl0ZW1Db250YWluZXIhLnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdi5oLTYudy02JylcbiAgICAgIGV4cGVjdChhY3Rpb25CdXR0b25zKS50b0hhdmVMZW5ndGgoMilcbiAgICAgIGZpcmVFdmVudC5jbGljayhhY3Rpb25CdXR0b25zWzBdKVxuXG4gICAgICBjb25zdCBpbnB1dHMgPSBhd2FpdCBzY3JlZW4uZmluZEFsbEJ5UGxhY2Vob2xkZXJUZXh0KCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5pbnB1dFBsYWNlaG9sZGVyJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXRzWzBdLCB7IHRhcmdldDogeyB2YWx1ZTogJ3NlY29uZCcgfSB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSlcblxuICAgICAgZXhwZWN0KFRvYXN0Lm5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHdoZW4gdmFyaWFibGUgbGFiZWwgaXMgZHVwbGljYXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlyc3RWYXIgPSBjcmVhdGVQcm9tcHRWYXJpYWJsZSh7IGtleTogJ2ZpcnN0JywgbmFtZTogJ0ZpcnN0JyB9KVxuICAgICAgY29uc3Qgc2Vjb25kVmFyID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoeyBrZXk6ICdzZWNvbmQnLCBuYW1lOiAnU2Vjb25kJyB9KVxuXG4gICAgICByZW5kZXJDb25maWdWYXIoe1xuICAgICAgICBwcm9tcHRWYXJpYWJsZXM6IFtmaXJzdFZhciwgc2Vjb25kVmFyXSxcbiAgICAgICAgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBpdGVtID0gc2NyZWVuLmdldEJ5VGl0bGUoJ2ZpcnN0IMK3IEZpcnN0JylcbiAgICAgIGNvbnN0IGl0ZW1Db250YWluZXIgPSBpdGVtLmNsb3Nlc3QoJ2Rpdi5ncm91cCcpXG4gICAgICBleHBlY3QoaXRlbUNvbnRhaW5lcikubm90LnRvQmVOdWxsKClcbiAgICAgIGNvbnN0IGFjdGlvbkJ1dHRvbnMgPSBpdGVtQ29udGFpbmVyIS5xdWVyeVNlbGVjdG9yQWxsKCdkaXYuaC02LnctNicpXG4gICAgICBleHBlY3QoYWN0aW9uQnV0dG9ucykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYWN0aW9uQnV0dG9uc1swXSlcblxuICAgICAgY29uc3QgaW5wdXRzID0gYXdhaXQgc2NyZWVuLmZpbmRBbGxCeVBsYWNlaG9sZGVyVGV4dCgnYXBwRGVidWcudmFyaWFibGVDb25maWcuaW5wdXRQbGFjZWhvbGRlcicpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0c1sxXSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdTZWNvbmQnIH0gfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG5cbiAgICAgIGV4cGVjdChUb2FzdC5ub3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBSZW1vdmFsIGJlaGF2aW9yIGluY2x1ZGluZyBjb25maXJtIG1vZGFsIGJyYW5jaC5cbiAgZGVzY3JpYmUoJ0NvbmZpZ1ZhciBSZW1vdmUgVmFyaWFibGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAgIGxhdGVzdFNvcnRhYmxlUHJvcHMgPSBudWxsXG4gICAgICBzdWJzY3JpcHRpb25DYWxsYmFjayA9IG51bGxcbiAgICAgIHZhcmlhYmxlSW5kZXggPSAwXG4gICAgICBub3RpZnlTcHkubW9ja0NsZWFyKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgdmFyaWFibGUgZGlyZWN0bHkgd2hlbiBjb250ZXh0IGNvbmZpcm1hdGlvbiBpcyBub3QgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoeyBrZXk6ICduYW1lJywgbmFtZTogJ05hbWUnIH0pXG5cbiAgICAgIHJlbmRlckNvbmZpZ1Zhcih7XG4gICAgICAgIHByb21wdFZhcmlhYmxlczogW3ZhcmlhYmxlXSxcbiAgICAgICAgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCByZW1vdmVCdG4gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Zhci1pdGVtLWRlbGV0ZS1idG4nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJlbW92ZUJ0bilcblxuICAgICAgZXhwZWN0KG9uUHJvbXB0VmFyaWFibGVzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXF1aXJlIGNvbmZpcm1hdGlvbiB3aGVuIHJlbW92aW5nIGNvbnRleHQgdmFyaWFibGUgd2l0aCBkYXRhc2V0cyBpbiBjb21wbGV0aW9uIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblByb21wdFZhcmlhYmxlc0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY3JlYXRlUHJvbXB0VmFyaWFibGUoe1xuICAgICAgICBrZXk6ICdjb250ZXh0JyxcbiAgICAgICAgbmFtZTogJ0NvbnRleHQnLFxuICAgICAgICBpc19jb250ZXh0X3ZhcjogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlckNvbmZpZ1ZhcihcbiAgICAgICAge1xuICAgICAgICAgIHByb21wdFZhcmlhYmxlczogW3ZhcmlhYmxlXSxcbiAgICAgICAgICBvblByb21wdFZhcmlhYmxlc0NoYW5nZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04sXG4gICAgICAgICAgZGF0YVNldHM6IFt7IGlkOiAnZGF0YXNldC0xJyB9IGFzIERlYnVnQ29uZmlndXJhdGlvblN0YXRlWydkYXRhU2V0cyddW251bWJlcl1dLFxuICAgICAgICB9LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBkZWxldGVCdG4gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Zhci1pdGVtLWRlbGV0ZS1idG4nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGRlbGV0ZUJ0bilcbiAgICAgIC8vIGNvbmZpcm1hdGlvbiBtb2RhbCBzaG91bGQgc2hvdyB1cFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScgfSkpXG5cbiAgICAgIGV4cGVjdChvblByb21wdFZhcmlhYmxlc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcbiAgfSlcblxuICAvLyBFdmVudCBzdWJzY3JpcHRpb24gc3VwcG9ydCBmb3IgZXh0ZXJuYWwgZGF0YSB0b29scy5cbiAgZGVzY3JpYmUoJ0NvbmZpZ1ZhciBFeHRlcm5hbCBEYXRhIFRvb2wgRXZlbnRzJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgICBsYXRlc3RTb3J0YWJsZVByb3BzID0gbnVsbFxuICAgICAgc3Vic2NyaXB0aW9uQ2FsbGJhY2sgPSBudWxsXG4gICAgICB2YXJpYWJsZUluZGV4ID0gMFxuICAgICAgbm90aWZ5U3B5Lm1vY2tDbGVhcigpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwZW5kIGV4dGVybmFsIGRhdGEgdG9vbCB2YXJpYWJsZXMgZnJvbSBldmVudCBlbWl0dGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb25maWdWYXIoe1xuICAgICAgICBwcm9tcHRWYXJpYWJsZXM6IFtdLFxuICAgICAgICBvblByb21wdFZhcmlhYmxlc0NoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHN1YnNjcmlwdGlvbkNhbGxiYWNrPy4oe1xuICAgICAgICAgIHR5cGU6IEFERF9FWFRFUk5BTF9EQVRBX1RPT0wsXG4gICAgICAgICAgcGF5bG9hZDoge1xuICAgICAgICAgICAgdmFyaWFibGU6ICdhcGlfdmFyJyxcbiAgICAgICAgICAgIGxhYmVsOiAnQVBJIFZhcicsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgdHlwZTogJ2FwaScsXG4gICAgICAgICAgICBjb25maWc6IHt9LFxuICAgICAgICAgICAgaWNvbjogJ2ljb24nLFxuICAgICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnYmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Qcm9tcHRWYXJpYWJsZXNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGtleTogJ2FwaV92YXInLFxuICAgICAgICAgIG5hbWU6ICdBUEkgVmFyJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnYXBpJyxcbiAgICAgICAgfSksXG4gICAgICBdKVxuICAgIH0pXG4gIH0pXG59KVxuIl19