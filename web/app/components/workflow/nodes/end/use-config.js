"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("@/app/components/workflow/hooks");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const use_var_list_1 = require("../_base/hooks/use-var-list");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_1.useNodesReadOnly)();
    const { inputs, setInputs } = (0, use_node_crud_1.default)(id, payload);
    const { handleVarListChange, handleAddVariable } = (0, use_var_list_1.default)({
        inputs,
        setInputs: (newInputs) => {
            setInputs(newInputs);
        },
        varKey: 'outputs',
    });
    return {
        readOnly,
        inputs,
        handleVarListChange,
        handleAddVariable,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFFd0M7QUFDeEMsNkZBQW1GO0FBQ25GLDhEQUFvRDtBQUVwRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQVUsRUFBRSxPQUFvQixFQUFFLEVBQUU7SUFDckQsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDdEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVCQUFXLEVBQWMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBRW5FLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLElBQUEsc0JBQVUsRUFBYztRQUN6RSxNQUFNO1FBQ04sU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDdkIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3RCLENBQUM7UUFDRCxNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDLENBQUE7SUFFRixPQUFPO1FBQ0wsUUFBUTtRQUNSLE1BQU07UUFDTixtQkFBbUI7UUFDbkIsaUJBQWlCO0tBQ2xCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVuZE5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7XG4gIHVzZU5vZGVzUmVhZE9ubHksXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnXG5pbXBvcnQgdXNlTm9kZUNydWQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9ob29rcy91c2Utbm9kZS1jcnVkJ1xuaW1wb3J0IHVzZVZhckxpc3QgZnJvbSAnLi4vX2Jhc2UvaG9va3MvdXNlLXZhci1saXN0J1xuXG5jb25zdCB1c2VDb25maWcgPSAoaWQ6IHN0cmluZywgcGF5bG9hZDogRW5kTm9kZVR5cGUpID0+IHtcbiAgY29uc3QgeyBub2Rlc1JlYWRPbmx5OiByZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG4gIGNvbnN0IHsgaW5wdXRzLCBzZXRJbnB1dHMgfSA9IHVzZU5vZGVDcnVkPEVuZE5vZGVUeXBlPihpZCwgcGF5bG9hZClcblxuICBjb25zdCB7IGhhbmRsZVZhckxpc3RDaGFuZ2UsIGhhbmRsZUFkZFZhcmlhYmxlIH0gPSB1c2VWYXJMaXN0PEVuZE5vZGVUeXBlPih7XG4gICAgaW5wdXRzLFxuICAgIHNldElucHV0czogKG5ld0lucHV0cykgPT4ge1xuICAgICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgICB9LFxuICAgIHZhcktleTogJ291dHB1dHMnLFxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgcmVhZE9ubHksXG4gICAgaW5wdXRzLFxuICAgIGhhbmRsZVZhckxpc3RDaGFuZ2UsXG4gICAgaGFuZGxlQWRkVmFyaWFibGUsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQ29uZmlnXG4iXX0=