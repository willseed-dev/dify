"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("@/app/components/workflow/hooks");
const useNodeCrud = (id, data) => {
    const { handleNodeDataUpdateWithSyncDraft } = (0, hooks_1.useNodeDataUpdate)();
    const setInputs = (newInputs) => {
        handleNodeDataUpdateWithSyncDraft({
            id,
            data: newInputs,
        });
    };
    return {
        inputs: data,
        setInputs,
    };
};
exports.default = useNodeCrud;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGUtY3J1ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1ub2RlLWNydWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFBbUU7QUFFbkUsTUFBTSxXQUFXLEdBQUcsQ0FBSSxFQUFVLEVBQUUsSUFBdUIsRUFBRSxFQUFFO0lBQzdELE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLElBQUEseUJBQWlCLEdBQUUsQ0FBQTtJQUVqRSxNQUFNLFNBQVMsR0FBRyxDQUFDLFNBQTRCLEVBQUUsRUFBRTtRQUNqRCxpQ0FBaUMsQ0FBQztZQUNoQyxFQUFFO1lBQ0YsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFBO0lBRUQsT0FBTztRQUNMLE1BQU0sRUFBRSxJQUFJO1FBQ1osU0FBUztLQUNWLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbW1vbk5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZU5vZGVEYXRhVXBkYXRlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcblxuY29uc3QgdXNlTm9kZUNydWQgPSA8VD4oaWQ6IHN0cmluZywgZGF0YTogQ29tbW9uTm9kZVR5cGU8VD4pID0+IHtcbiAgY29uc3QgeyBoYW5kbGVOb2RlRGF0YVVwZGF0ZVdpdGhTeW5jRHJhZnQgfSA9IHVzZU5vZGVEYXRhVXBkYXRlKClcblxuICBjb25zdCBzZXRJbnB1dHMgPSAobmV3SW5wdXRzOiBDb21tb25Ob2RlVHlwZTxUPikgPT4ge1xuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdCh7XG4gICAgICBpZCxcbiAgICAgIGRhdGE6IG5ld0lucHV0cyxcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbnB1dHM6IGRhdGEsXG4gICAgc2V0SW5wdXRzLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZU5vZGVDcnVkXG4iXX0=