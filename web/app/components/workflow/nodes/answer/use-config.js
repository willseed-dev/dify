"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const types_1 = require("../../types");
const use_var_list_1 = require("../_base/hooks/use-var-list");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_1.useNodesReadOnly)();
    const { inputs, setInputs } = (0, use_node_crud_1.default)(id, payload);
    // variables
    const { handleVarListChange, handleAddVariable } = (0, use_var_list_1.default)({
        inputs,
        setInputs,
    });
    const handleAnswerChange = (0, react_1.useCallback)((value) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.answer = value;
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const filterVar = (0, react_1.useCallback)((varPayload) => {
        return varPayload.type !== types_1.VarType.arrayObject;
    }, []);
    return {
        readOnly,
        inputs,
        handleVarListChange,
        handleAddVariable,
        handleAnswerChange,
        filterVar,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLDJEQUV3QztBQUN4Qyw2RkFBbUY7QUFDbkYsdUNBQXFDO0FBQ3JDLDhEQUFvRDtBQUVwRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQVUsRUFBRSxPQUF1QixFQUFFLEVBQUU7SUFDeEQsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDdEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVCQUFXLEVBQWlCLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN0RSxZQUFZO0lBQ1osTUFBTSxFQUFFLG1CQUFtQixFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBQSxzQkFBVSxFQUFpQjtRQUM1RSxNQUFNO1FBQ04sU0FBUztLQUNWLENBQUMsQ0FBQTtJQUVGLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBQSxlQUFPLEVBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDMUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7UUFDdEIsQ0FBQyxDQUFDLENBQUE7UUFDRixTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFdkIsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDaEQsT0FBTyxVQUFVLENBQUMsSUFBSSxLQUFLLGVBQU8sQ0FBQyxXQUFXLENBQUE7SUFDaEQsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ04sT0FBTztRQUNMLFFBQVE7UUFDUixNQUFNO1FBQ04sbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixrQkFBa0I7UUFDbEIsU0FBUztLQUNWLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZhciB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBBbnN3ZXJOb2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgdXNlTm9kZXNSZWFkT25seSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB1c2VOb2RlQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2hvb2tzL3VzZS1ub2RlLWNydWQnXG5pbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdXNlVmFyTGlzdCBmcm9tICcuLi9fYmFzZS9ob29rcy91c2UtdmFyLWxpc3QnXG5cbmNvbnN0IHVzZUNvbmZpZyA9IChpZDogc3RyaW5nLCBwYXlsb2FkOiBBbnN3ZXJOb2RlVHlwZSkgPT4ge1xuICBjb25zdCB7IG5vZGVzUmVhZE9ubHk6IHJlYWRPbmx5IH0gPSB1c2VOb2Rlc1JlYWRPbmx5KClcbiAgY29uc3QgeyBpbnB1dHMsIHNldElucHV0cyB9ID0gdXNlTm9kZUNydWQ8QW5zd2VyTm9kZVR5cGU+KGlkLCBwYXlsb2FkKVxuICAvLyB2YXJpYWJsZXNcbiAgY29uc3QgeyBoYW5kbGVWYXJMaXN0Q2hhbmdlLCBoYW5kbGVBZGRWYXJpYWJsZSB9ID0gdXNlVmFyTGlzdDxBbnN3ZXJOb2RlVHlwZT4oe1xuICAgIGlucHV0cyxcbiAgICBzZXRJbnB1dHMsXG4gIH0pXG5cbiAgY29uc3QgaGFuZGxlQW5zd2VyQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5hbnN3ZXIgPSB2YWx1ZVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW2lucHV0cywgc2V0SW5wdXRzXSlcblxuICBjb25zdCBmaWx0ZXJWYXIgPSB1c2VDYWxsYmFjaygodmFyUGF5bG9hZDogVmFyKSA9PiB7XG4gICAgcmV0dXJuIHZhclBheWxvYWQudHlwZSAhPT0gVmFyVHlwZS5hcnJheU9iamVjdFxuICB9LCBbXSlcbiAgcmV0dXJuIHtcbiAgICByZWFkT25seSxcbiAgICBpbnB1dHMsXG4gICAgaGFuZGxlVmFyTGlzdENoYW5nZSxcbiAgICBoYW5kbGVBZGRWYXJpYWJsZSxcbiAgICBoYW5kbGVBbnN3ZXJDaGFuZ2UsXG4gICAgZmlsdGVyVmFyLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUNvbmZpZ1xuIl19