"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessedInputs = exports.processInputFileFromServer = exports.processOpeningStatement = void 0;
const utils_1 = require("@/app/components/base/file-uploader/utils");
const types_1 = require("@/app/components/workflow/types");
const processOpeningStatement = (openingStatement, inputs, inputsForm) => {
    if (!openingStatement)
        return openingStatement;
    return openingStatement.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const name = inputs[key];
        if (name) { // has set value
            return name;
        }
        const valueObj = inputsForm.find(v => v.variable === key);
        return valueObj ? `{{${valueObj.label}}}` : match;
    });
};
exports.processOpeningStatement = processOpeningStatement;
const processInputFileFromServer = (fileItem) => {
    return {
        type: fileItem.type,
        transfer_method: fileItem.transfer_method,
        url: fileItem.remote_url,
        upload_file_id: fileItem.related_id,
    };
};
exports.processInputFileFromServer = processInputFileFromServer;
const getProcessedInputs = (inputs, inputsForm) => {
    const processedInputs = { ...inputs };
    inputsForm.forEach((item) => {
        const inputValue = inputs[item.variable];
        // set boolean type default value
        if (item.type === types_1.InputVarType.checkbox) {
            processedInputs[item.variable] = !!inputValue;
            return;
        }
        if (inputValue == null)
            return;
        if (item.type === types_1.InputVarType.singleFile) {
            if ('transfer_method' in inputValue)
                processedInputs[item.variable] = (0, exports.processInputFileFromServer)(inputValue);
            else
                processedInputs[item.variable] = (0, utils_1.getProcessedFiles)([inputValue])[0];
        }
        else if (item.type === types_1.InputVarType.multiFiles) {
            if ('transfer_method' in inputValue[0])
                processedInputs[item.variable] = inputValue.map(exports.processInputFileFromServer);
            else
                processedInputs[item.variable] = (0, utils_1.getProcessedFiles)(inputValue);
        }
        else if (item.type === types_1.InputVarType.jsonObject) {
            // Prefer sending an object if the user entered valid JSON; otherwise keep the raw string.
            try {
                const v = typeof inputValue === 'string' ? JSON.parse(inputValue) : inputValue;
                if (v && typeof v === 'object' && !Array.isArray(v))
                    processedInputs[item.variable] = v;
                else
                    processedInputs[item.variable] = inputValue;
            }
            catch {
                // keep original string; backend will parse/validate
                processedInputs[item.variable] = inputValue;
            }
        }
    });
    return processedInputs;
};
exports.getProcessedInputs = getProcessedInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxRUFBNkU7QUFDN0UsMkRBQThEO0FBRXZELE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxnQkFBd0IsRUFBRSxNQUEyQixFQUFFLFVBQXVCLEVBQUUsRUFBRTtJQUN4SCxJQUFJLENBQUMsZ0JBQWdCO1FBQ25CLE9BQU8sZ0JBQWdCLENBQUE7SUFFekIsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDakUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hCLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7WUFDMUIsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssR0FBRyxDQUFDLENBQUE7UUFDekQsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7SUFDbkQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFiWSxRQUFBLHVCQUF1QiwyQkFhbkM7QUFFTSxNQUFNLDBCQUEwQixHQUFHLENBQUMsUUFBNkIsRUFBRSxFQUFFO0lBQzFFLE9BQU87UUFDTCxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7UUFDbkIsZUFBZSxFQUFFLFFBQVEsQ0FBQyxlQUFlO1FBQ3pDLEdBQUcsRUFBRSxRQUFRLENBQUMsVUFBVTtRQUN4QixjQUFjLEVBQUUsUUFBUSxDQUFDLFVBQVU7S0FDcEMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVBZLFFBQUEsMEJBQTBCLDhCQU90QztBQUVNLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUEyQixFQUFFLFVBQXVCLEVBQUUsRUFBRTtJQUN6RixNQUFNLGVBQWUsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUE7SUFFckMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzFCLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDeEMsaUNBQWlDO1FBQ2pDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtZQUM3QyxPQUFNO1FBQ1IsQ0FBQztRQUVELElBQUksVUFBVSxJQUFJLElBQUk7WUFDcEIsT0FBTTtRQUVSLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzFDLElBQUksaUJBQWlCLElBQUksVUFBVTtnQkFDakMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFBLGtDQUEwQixFQUFDLFVBQVUsQ0FBQyxDQUFBOztnQkFFdkUsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFBLHlCQUFpQixFQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RSxDQUFDO2FBQ0ksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG9CQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0MsSUFBSSxpQkFBaUIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsa0NBQTBCLENBQUMsQ0FBQTs7Z0JBRTNFLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBQSx5QkFBaUIsRUFBQyxVQUFVLENBQUMsQ0FBQTtRQUNsRSxDQUFDO2FBQ0ksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG9CQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDL0MsMEZBQTBGO1lBQzFGLElBQUksQ0FBQztnQkFDSCxNQUFNLENBQUMsR0FBRyxPQUFPLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtnQkFDOUUsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2pELGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBOztvQkFFbEMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUE7WUFDL0MsQ0FBQztZQUNELE1BQU0sQ0FBQztnQkFDTCxvREFBb0Q7Z0JBQ3BELGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFBO1lBQzdDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixPQUFPLGVBQWUsQ0FBQTtBQUN4QixDQUFDLENBQUE7QUEzQ1ksUUFBQSxrQkFBa0Isc0JBMkM5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSW5wdXRGb3JtIH0gZnJvbSAnLi90eXBlJ1xuaW1wb3J0IHsgZ2V0UHJvY2Vzc2VkRmlsZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci91dGlscydcbmltcG9ydCB7IElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBwcm9jZXNzT3BlbmluZ1N0YXRlbWVudCA9IChvcGVuaW5nU3RhdGVtZW50OiBzdHJpbmcsIGlucHV0czogUmVjb3JkPHN0cmluZywgYW55PiwgaW5wdXRzRm9ybTogSW5wdXRGb3JtW10pID0+IHtcbiAgaWYgKCFvcGVuaW5nU3RhdGVtZW50KVxuICAgIHJldHVybiBvcGVuaW5nU3RhdGVtZW50XG5cbiAgcmV0dXJuIG9wZW5pbmdTdGF0ZW1lbnQucmVwbGFjZSgvXFx7XFx7KFtefV0rKVxcfVxcfS9nLCAobWF0Y2gsIGtleSkgPT4ge1xuICAgIGNvbnN0IG5hbWUgPSBpbnB1dHNba2V5XVxuICAgIGlmIChuYW1lKSB7IC8vIGhhcyBzZXQgdmFsdWVcbiAgICAgIHJldHVybiBuYW1lXG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVPYmogPSBpbnB1dHNGb3JtLmZpbmQodiA9PiB2LnZhcmlhYmxlID09PSBrZXkpXG4gICAgcmV0dXJuIHZhbHVlT2JqID8gYHt7JHt2YWx1ZU9iai5sYWJlbH19fWAgOiBtYXRjaFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgcHJvY2Vzc0lucHV0RmlsZUZyb21TZXJ2ZXIgPSAoZmlsZUl0ZW06IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBmaWxlSXRlbS50eXBlLFxuICAgIHRyYW5zZmVyX21ldGhvZDogZmlsZUl0ZW0udHJhbnNmZXJfbWV0aG9kLFxuICAgIHVybDogZmlsZUl0ZW0ucmVtb3RlX3VybCxcbiAgICB1cGxvYWRfZmlsZV9pZDogZmlsZUl0ZW0ucmVsYXRlZF9pZCxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ2V0UHJvY2Vzc2VkSW5wdXRzID0gKGlucHV0czogUmVjb3JkPHN0cmluZywgYW55PiwgaW5wdXRzRm9ybTogSW5wdXRGb3JtW10pID0+IHtcbiAgY29uc3QgcHJvY2Vzc2VkSW5wdXRzID0geyAuLi5pbnB1dHMgfVxuXG4gIGlucHV0c0Zvcm0uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgIGNvbnN0IGlucHV0VmFsdWUgPSBpbnB1dHNbaXRlbS52YXJpYWJsZV1cbiAgICAvLyBzZXQgYm9vbGVhbiB0eXBlIGRlZmF1bHQgdmFsdWVcbiAgICBpZiAoaXRlbS50eXBlID09PSBJbnB1dFZhclR5cGUuY2hlY2tib3gpIHtcbiAgICAgIHByb2Nlc3NlZElucHV0c1tpdGVtLnZhcmlhYmxlXSA9ICEhaW5wdXRWYWx1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGlucHV0VmFsdWUgPT0gbnVsbClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKGl0ZW0udHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUpIHtcbiAgICAgIGlmICgndHJhbnNmZXJfbWV0aG9kJyBpbiBpbnB1dFZhbHVlKVxuICAgICAgICBwcm9jZXNzZWRJbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBwcm9jZXNzSW5wdXRGaWxlRnJvbVNlcnZlcihpbnB1dFZhbHVlKVxuICAgICAgZWxzZVxuICAgICAgICBwcm9jZXNzZWRJbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBnZXRQcm9jZXNzZWRGaWxlcyhbaW5wdXRWYWx1ZV0pWzBdXG4gICAgfVxuICAgIGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpIHtcbiAgICAgIGlmICgndHJhbnNmZXJfbWV0aG9kJyBpbiBpbnB1dFZhbHVlWzBdKVxuICAgICAgICBwcm9jZXNzZWRJbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBpbnB1dFZhbHVlLm1hcChwcm9jZXNzSW5wdXRGaWxlRnJvbVNlcnZlcilcbiAgICAgIGVsc2VcbiAgICAgICAgcHJvY2Vzc2VkSW5wdXRzW2l0ZW0udmFyaWFibGVdID0gZ2V0UHJvY2Vzc2VkRmlsZXMoaW5wdXRWYWx1ZSlcbiAgICB9XG4gICAgZWxzZSBpZiAoaXRlbS50eXBlID09PSBJbnB1dFZhclR5cGUuanNvbk9iamVjdCkge1xuICAgICAgLy8gUHJlZmVyIHNlbmRpbmcgYW4gb2JqZWN0IGlmIHRoZSB1c2VyIGVudGVyZWQgdmFsaWQgSlNPTjsgb3RoZXJ3aXNlIGtlZXAgdGhlIHJhdyBzdHJpbmcuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2ID0gdHlwZW9mIGlucHV0VmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShpbnB1dFZhbHVlKSA6IGlucHV0VmFsdWVcbiAgICAgICAgaWYgKHYgJiYgdHlwZW9mIHYgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHYpKVxuICAgICAgICAgIHByb2Nlc3NlZElucHV0c1tpdGVtLnZhcmlhYmxlXSA9IHZcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHByb2Nlc3NlZElucHV0c1tpdGVtLnZhcmlhYmxlXSA9IGlucHV0VmFsdWVcbiAgICAgIH1cbiAgICAgIGNhdGNoIHtcbiAgICAgICAgLy8ga2VlcCBvcmlnaW5hbCBzdHJpbmc7IGJhY2tlbmQgd2lsbCBwYXJzZS92YWxpZGF0ZVxuICAgICAgICBwcm9jZXNzZWRJbnB1dHNbaXRlbS52YXJpYWJsZV0gPSBpbnB1dFZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBwcm9jZXNzZWRJbnB1dHNcbn1cbiJdfQ==