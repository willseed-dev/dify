"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const react_1 = require("react");
const types_1 = require("../../types");
function useVarList({ inputs, setInputs, }) {
    const handleVarListChange = (0, react_1.useCallback)((newList) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.items = newList;
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleAddVariable = (0, react_1.useCallback)(() => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.items.push({
                variable_selector: [],
                input_type: types_1.AssignerNodeInputType.constant,
                operation: types_1.WriteMode.overwrite,
                value: '',
            });
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    return {
        handleVarListChange,
        handleAddVariable,
    };
}
exports.default = useVarList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXZhci1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXZhci1saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUNBQStCO0FBQy9CLGlDQUFtQztBQUNuQyx1Q0FBOEQ7QUFPOUQsU0FBUyxVQUFVLENBQUMsRUFDbEIsTUFBTSxFQUNOLFNBQVMsR0FDRjtJQUNQLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsT0FBZ0MsRUFBRSxFQUFFO1FBQzNFLE1BQU0sU0FBUyxHQUFHLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRXZCLE1BQU0saUJBQWlCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUN6QyxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDZixpQkFBaUIsRUFBRSxFQUFFO2dCQUNyQixVQUFVLEVBQUUsNkJBQXFCLENBQUMsUUFBUTtnQkFDMUMsU0FBUyxFQUFFLGlCQUFTLENBQUMsU0FBUztnQkFDOUIsS0FBSyxFQUFFLEVBQUU7YUFDVixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUNGLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0QixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUN2QixPQUFPO1FBQ0wsbUJBQW1CO1FBQ25CLGlCQUFpQjtLQUNsQixDQUFBO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFVBQVUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXNzaWduZXJOb2RlT3BlcmF0aW9uLCBBc3NpZ25lck5vZGVUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQXNzaWduZXJOb2RlSW5wdXRUeXBlLCBXcml0ZU1vZGUgfSBmcm9tICcuLi8uLi90eXBlcydcblxudHlwZSBQYXJhbXMgPSB7XG4gIGlkOiBzdHJpbmdcbiAgaW5wdXRzOiBBc3NpZ25lck5vZGVUeXBlXG4gIHNldElucHV0czogKG5ld0lucHV0czogQXNzaWduZXJOb2RlVHlwZSkgPT4gdm9pZFxufVxuZnVuY3Rpb24gdXNlVmFyTGlzdCh7XG4gIGlucHV0cyxcbiAgc2V0SW5wdXRzLFxufTogUGFyYW1zKSB7XG4gIGNvbnN0IGhhbmRsZVZhckxpc3RDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3TGlzdDogQXNzaWduZXJOb2RlT3BlcmF0aW9uW10pID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5pdGVtcyA9IG5ld0xpc3RcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlQWRkVmFyaWFibGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuaXRlbXMucHVzaCh7XG4gICAgICAgIHZhcmlhYmxlX3NlbGVjdG9yOiBbXSxcbiAgICAgICAgaW5wdXRfdHlwZTogQXNzaWduZXJOb2RlSW5wdXRUeXBlLmNvbnN0YW50LFxuICAgICAgICBvcGVyYXRpb246IFdyaXRlTW9kZS5vdmVyd3JpdGUsXG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuICByZXR1cm4ge1xuICAgIGhhbmRsZVZhckxpc3RDaGFuZ2UsXG4gICAgaGFuZGxlQWRkVmFyaWFibGUsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlVmFyTGlzdFxuIl19