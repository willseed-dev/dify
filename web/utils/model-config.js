"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBooleanInputs = exports.promptVariablesToUserInputsForm = exports.userInputsFormToPromptVariables = void 0;
const userInputsFormToPromptVariables = (useInputs, dataset_query_variable) => {
    if (!useInputs)
        return [];
    const promptVariables = [];
    useInputs.forEach((item) => {
        const isParagraph = !!item.paragraph;
        const [type, content] = (() => {
            if (isParagraph)
                return ['paragraph', item.paragraph];
            if (item['text-input'])
                return ['string', item['text-input']];
            if (item.number)
                return ['number', item.number];
            if (item.checkbox)
                return ['boolean', item.checkbox];
            if (item.file)
                return ['file', item.file];
            if (item['file-list'])
                return ['file-list', item['file-list']];
            if (item.external_data_tool)
                return [item.external_data_tool.type, item.external_data_tool];
            if (item.json_object)
                return ['json_object', item.json_object];
            return ['select', item.select || {}];
        })();
        const is_context_var = dataset_query_variable === content?.variable;
        if (type === 'string' || type === 'paragraph') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type,
                max_length: content.max_length,
                options: [],
                is_context_var,
                hide: content.hide,
                default: content.default,
            });
        }
        else if (type === 'number') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type,
                options: [],
                hide: content.hide,
                default: content.default,
            });
        }
        else if (type === 'boolean') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type: 'checkbox',
                options: [],
                hide: content.hide,
                default: content.default,
            });
        }
        else if (type === 'select') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type: 'select',
                options: content.options,
                is_context_var,
                hide: content.hide,
                default: content.default,
            });
        }
        else if (type === 'file') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type,
                config: {
                    allowed_file_types: content.allowed_file_types,
                    allowed_file_extensions: content.allowed_file_extensions,
                    allowed_file_upload_methods: content.allowed_file_upload_methods,
                    number_limits: 1,
                },
                hide: content.hide,
                default: content.default,
            });
        }
        else if (type === 'file-list') {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type,
                config: {
                    allowed_file_types: content.allowed_file_types,
                    allowed_file_extensions: content.allowed_file_extensions,
                    allowed_file_upload_methods: content.allowed_file_upload_methods,
                    number_limits: content.max_length,
                },
                hide: content.hide,
                default: content.default,
            });
        }
        else {
            promptVariables.push({
                key: content.variable,
                name: content.label,
                required: content.required,
                type: content.type,
                enabled: content.enabled,
                config: content.config,
                icon: content.icon,
                icon_background: content.icon_background,
                is_context_var,
                hide: content.hide,
            });
        }
    });
    return promptVariables;
};
exports.userInputsFormToPromptVariables = userInputsFormToPromptVariables;
const promptVariablesToUserInputsForm = (promptVariables) => {
    const userInputs = [];
    promptVariables.filter(({ key, name }) => {
        return key && key.trim() && name && name.trim();
    }).forEach((item) => {
        if (item.type === 'string' || item.type === 'paragraph') {
            userInputs.push({
                [item.type === 'string' ? 'text-input' : 'paragraph']: {
                    label: item.name,
                    variable: item.key,
                    required: item.required !== false, // default true
                    max_length: item.max_length,
                    default: '',
                    hide: item.hide,
                },
            });
            return;
        }
        if (item.type === 'number' || item.type === 'checkbox') {
            userInputs.push({
                [item.type]: {
                    label: item.name,
                    variable: item.key,
                    required: item.required !== false, // default true
                    default: '',
                    hide: item.hide,
                },
            });
        }
        else if (item.type === 'select') {
            userInputs.push({
                select: {
                    label: item.name,
                    variable: item.key,
                    required: item.required !== false, // default true
                    options: item.options,
                    default: item.default ?? '',
                    hide: item.hide,
                },
            });
        }
        else {
            userInputs.push({
                external_data_tool: {
                    label: item.name,
                    variable: item.key,
                    enabled: item.enabled,
                    type: item.type,
                    config: item.config,
                    required: item.required,
                    icon: item.icon,
                    icon_background: item.icon_background,
                    hide: item.hide,
                },
            });
        }
    });
    return userInputs;
};
exports.promptVariablesToUserInputsForm = promptVariablesToUserInputsForm;
const formatBooleanInputs = (useInputs, inputs) => {
    if (!useInputs)
        return inputs;
    const res = { ...inputs };
    useInputs.forEach((item) => {
        const isBooleanInput = item.type === 'checkbox';
        if (isBooleanInput) {
            // Convert boolean inputs to boolean type
            res[item.key] = !!res[item.key];
        }
    });
    return res;
};
exports.formatBooleanInputs = formatBooleanInputs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kZWwtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdPLE1BQU0sK0JBQStCLEdBQUcsQ0FBQyxTQUFxQyxFQUFFLHNCQUErQixFQUFFLEVBQUU7SUFDeEgsSUFBSSxDQUFDLFNBQVM7UUFDWixPQUFPLEVBQUUsQ0FBQTtJQUNYLE1BQU0sZUFBZSxHQUFxQixFQUFFLENBQUE7SUFDNUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1FBQzlCLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFBO1FBRXBDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDNUIsSUFBSSxXQUFXO2dCQUNiLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBRXRDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDcEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtZQUV2QyxJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUNiLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRWhDLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQ2YsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFbkMsSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFDWCxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUU1QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUE7WUFFekMsSUFBSSxJQUFJLENBQUMsa0JBQWtCO2dCQUN6QixP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aUJBQ2hCO2FBQ0ssQ0FBQyxDQUFBO1FBQ1gsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxVQUFVLENBQUE7QUFDbkIsQ0FBQyxDQUFBO0FBM0RZLFFBQUEsK0JBQStCLG1DQTJEM0M7QUFFTSxNQUFNLG1CQUFtQixHQUFHLENBQUMsU0FBbUMsRUFBRSxNQUFrRSxFQUFFLEVBQUU7SUFDN0ksSUFBSSxDQUFDLFNBQVM7UUFDWixPQUFPLE1BQU0sQ0FBQTtJQUNmLE1BQU0sR0FBRyxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQTtJQUN6QixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDekIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLENBQUE7UUFDL0MsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuQix5Q0FBeUM7WUFDekMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNqQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLEdBQUcsQ0FBQTtBQUNaLENBQUMsQ0FBQTtBQVpZLFFBQUEsbUJBQW1CLHVCQVkvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUHJvbXB0VmFyaWFibGUgfSBmcm9tICdAL21vZGVscy9kZWJ1ZydcbmltcG9ydCB0eXBlIHsgVXNlcklucHV0Rm9ybUl0ZW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcblxuZXhwb3J0IGNvbnN0IHVzZXJJbnB1dHNGb3JtVG9Qcm9tcHRWYXJpYWJsZXMgPSAodXNlSW5wdXRzOiBVc2VySW5wdXRGb3JtSXRlbVtdIHwgbnVsbCwgZGF0YXNldF9xdWVyeV92YXJpYWJsZT86IHN0cmluZykgPT4ge1xuICBpZiAoIXVzZUlucHV0cylcbiAgICByZXR1cm4gW11cbiAgY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVtdID0gW11cbiAgdXNlSW5wdXRzLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgIGNvbnN0IGlzUGFyYWdyYXBoID0gISFpdGVtLnBhcmFncmFwaFxuXG4gICAgY29uc3QgW3R5cGUsIGNvbnRlbnRdID0gKCgpID0+IHtcbiAgICAgIGlmIChpc1BhcmFncmFwaClcbiAgICAgICAgcmV0dXJuIFsncGFyYWdyYXBoJywgaXRlbS5wYXJhZ3JhcGhdXG5cbiAgICAgIGlmIChpdGVtWyd0ZXh0LWlucHV0J10pXG4gICAgICAgIHJldHVybiBbJ3N0cmluZycsIGl0ZW1bJ3RleHQtaW5wdXQnXV1cblxuICAgICAgaWYgKGl0ZW0ubnVtYmVyKVxuICAgICAgICByZXR1cm4gWydudW1iZXInLCBpdGVtLm51bWJlcl1cblxuICAgICAgaWYgKGl0ZW0uY2hlY2tib3gpXG4gICAgICAgIHJldHVybiBbJ2Jvb2xlYW4nLCBpdGVtLmNoZWNrYm94XVxuXG4gICAgICBpZiAoaXRlbS5maWxlKVxuICAgICAgICByZXR1cm4gWydmaWxlJywgaXRlbS5maWxlXVxuXG4gICAgICBpZiAoaXRlbVsnZmlsZS1saXN0J10pXG4gICAgICAgIHJldHVybiBbJ2ZpbGUtbGlzdCcsIGl0ZW1bJ2ZpbGUtbGlzdCddXVxuXG4gICAgICBpZiAoaXRlbS5leHRlcm5hbF9kYXRhX3Rvb2wpXG4gICAgICAgIHJldHVybiBbaXRlbS5leHRlcm5hbF9kYXRhX3Rvb2wudHlwZSwgaXRlbS5leHRlcm5hbF9kYXRhX3Rvb2xdXG5cbiAgICAgIGlmIChpdGVtLmpzb25fb2JqZWN0KVxuICAgICAgICByZXR1cm4gWydqc29uX29iamVjdCcsIGl0ZW0uanNvbl9vYmplY3RdXG5cbiAgICAgIHJldHVybiBbJ3NlbGVjdCcsIGl0ZW0uc2VsZWN0IHx8IHt9XVxuICAgIH0pKClcbiAgICBjb25zdCBpc19jb250ZXh0X3ZhciA9IGRhdGFzZXRfcXVlcnlfdmFyaWFibGUgPT09IGNvbnRlbnQ/LnZhcmlhYmxlXG5cbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgIHByb21wdFZhcmlhYmxlcy5wdXNoKHtcbiAgICAgICAga2V5OiBjb250ZW50LnZhcmlhYmxlLFxuICAgICAgICBuYW1lOiBjb250ZW50LmxhYmVsLFxuICAgICAgICByZXF1aXJlZDogY29udGVudC5yZXF1aXJlZCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgbWF4X2xlbmd0aDogY29udGVudC5tYXhfbGVuZ3RoLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgICAgaXNfY29udGV4dF92YXIsXG4gICAgICAgIGhpZGU6IGNvbnRlbnQuaGlkZSxcbiAgICAgICAgZGVmYXVsdDogY29udGVudC5kZWZhdWx0LFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByb21wdFZhcmlhYmxlcy5wdXNoKHtcbiAgICAgICAga2V5OiBjb250ZW50LnZhcmlhYmxlLFxuICAgICAgICBuYW1lOiBjb250ZW50LmxhYmVsLFxuICAgICAgICByZXF1aXJlZDogY29udGVudC5yZXF1aXJlZCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgb3B0aW9uczogW10sXG4gICAgICAgIGhpZGU6IGNvbnRlbnQuaGlkZSxcbiAgICAgICAgZGVmYXVsdDogY29udGVudC5kZWZhdWx0LFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcm9tcHRWYXJpYWJsZXMucHVzaCh7XG4gICAgICAgIGtleTogY29udGVudC52YXJpYWJsZSxcbiAgICAgICAgbmFtZTogY29udGVudC5sYWJlbCxcbiAgICAgICAgcmVxdWlyZWQ6IGNvbnRlbnQucmVxdWlyZWQsXG4gICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgIG9wdGlvbnM6IFtdLFxuICAgICAgICBoaWRlOiBjb250ZW50LmhpZGUsXG4gICAgICAgIGRlZmF1bHQ6IGNvbnRlbnQuZGVmYXVsdCxcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgICBwcm9tcHRWYXJpYWJsZXMucHVzaCh7XG4gICAgICAgIGtleTogY29udGVudC52YXJpYWJsZSxcbiAgICAgICAgbmFtZTogY29udGVudC5sYWJlbCxcbiAgICAgICAgcmVxdWlyZWQ6IGNvbnRlbnQucmVxdWlyZWQsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBjb250ZW50Lm9wdGlvbnMsXG4gICAgICAgIGlzX2NvbnRleHRfdmFyLFxuICAgICAgICBoaWRlOiBjb250ZW50LmhpZGUsXG4gICAgICAgIGRlZmF1bHQ6IGNvbnRlbnQuZGVmYXVsdCxcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdmaWxlJykge1xuICAgICAgcHJvbXB0VmFyaWFibGVzLnB1c2goe1xuICAgICAgICBrZXk6IGNvbnRlbnQudmFyaWFibGUsXG4gICAgICAgIG5hbWU6IGNvbnRlbnQubGFiZWwsXG4gICAgICAgIHJlcXVpcmVkOiBjb250ZW50LnJlcXVpcmVkLFxuICAgICAgICB0eXBlLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IGNvbnRlbnQuYWxsb3dlZF9maWxlX3R5cGVzLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBjb250ZW50LmFsbG93ZWRfZmlsZV9leHRlbnNpb25zLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogY29udGVudC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMsXG4gICAgICAgICAgbnVtYmVyX2xpbWl0czogMSxcbiAgICAgICAgfSxcbiAgICAgICAgaGlkZTogY29udGVudC5oaWRlLFxuICAgICAgICBkZWZhdWx0OiBjb250ZW50LmRlZmF1bHQsXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSAnZmlsZS1saXN0Jykge1xuICAgICAgcHJvbXB0VmFyaWFibGVzLnB1c2goe1xuICAgICAgICBrZXk6IGNvbnRlbnQudmFyaWFibGUsXG4gICAgICAgIG5hbWU6IGNvbnRlbnQubGFiZWwsXG4gICAgICAgIHJlcXVpcmVkOiBjb250ZW50LnJlcXVpcmVkLFxuICAgICAgICB0eXBlLFxuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IGNvbnRlbnQuYWxsb3dlZF9maWxlX3R5cGVzLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBjb250ZW50LmFsbG93ZWRfZmlsZV9leHRlbnNpb25zLFxuICAgICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogY29udGVudC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMsXG4gICAgICAgICAgbnVtYmVyX2xpbWl0czogY29udGVudC5tYXhfbGVuZ3RoLFxuICAgICAgICB9LFxuICAgICAgICBoaWRlOiBjb250ZW50LmhpZGUsXG4gICAgICAgIGRlZmF1bHQ6IGNvbnRlbnQuZGVmYXVsdCxcbiAgICAgIH0pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcHJvbXB0VmFyaWFibGVzLnB1c2goe1xuICAgICAgICBrZXk6IGNvbnRlbnQudmFyaWFibGUsXG4gICAgICAgIG5hbWU6IGNvbnRlbnQubGFiZWwsXG4gICAgICAgIHJlcXVpcmVkOiBjb250ZW50LnJlcXVpcmVkLFxuICAgICAgICB0eXBlOiBjb250ZW50LnR5cGUsXG4gICAgICAgIGVuYWJsZWQ6IGNvbnRlbnQuZW5hYmxlZCxcbiAgICAgICAgY29uZmlnOiBjb250ZW50LmNvbmZpZyxcbiAgICAgICAgaWNvbjogY29udGVudC5pY29uLFxuICAgICAgICBpY29uX2JhY2tncm91bmQ6IGNvbnRlbnQuaWNvbl9iYWNrZ3JvdW5kLFxuICAgICAgICBpc19jb250ZXh0X3ZhcixcbiAgICAgICAgaGlkZTogY29udGVudC5oaWRlLFxuICAgICAgfSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiBwcm9tcHRWYXJpYWJsZXNcbn1cblxuZXhwb3J0IGNvbnN0IHByb21wdFZhcmlhYmxlc1RvVXNlcklucHV0c0Zvcm0gPSAocHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVtdKSA9PiB7XG4gIGNvbnN0IHVzZXJJbnB1dHM6IFVzZXJJbnB1dEZvcm1JdGVtW10gPSBbXVxuICBwcm9tcHRWYXJpYWJsZXMuZmlsdGVyKCh7IGtleSwgbmFtZSB9KSA9PiB7XG4gICAgcmV0dXJuIGtleSAmJiBrZXkudHJpbSgpICYmIG5hbWUgJiYgbmFtZS50cmltKClcbiAgfSkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgaWYgKGl0ZW0udHlwZSA9PT0gJ3N0cmluZycgfHwgaXRlbS50eXBlID09PSAncGFyYWdyYXBoJykge1xuICAgICAgdXNlcklucHV0cy5wdXNoKHtcbiAgICAgICAgW2l0ZW0udHlwZSA9PT0gJ3N0cmluZycgPyAndGV4dC1pbnB1dCcgOiAncGFyYWdyYXBoJ106IHtcbiAgICAgICAgICBsYWJlbDogaXRlbS5uYW1lLFxuICAgICAgICAgIHZhcmlhYmxlOiBpdGVtLmtleSxcbiAgICAgICAgICByZXF1aXJlZDogaXRlbS5yZXF1aXJlZCAhPT0gZmFsc2UsIC8vIGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgIG1heF9sZW5ndGg6IGl0ZW0ubWF4X2xlbmd0aCxcbiAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICBoaWRlOiBpdGVtLmhpZGUsXG4gICAgICAgIH0sXG4gICAgICB9IGFzIGFueSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoaXRlbS50eXBlID09PSAnbnVtYmVyJyB8fCBpdGVtLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgIHVzZXJJbnB1dHMucHVzaCh7XG4gICAgICAgIFtpdGVtLnR5cGVdOiB7XG4gICAgICAgICAgbGFiZWw6IGl0ZW0ubmFtZSxcbiAgICAgICAgICB2YXJpYWJsZTogaXRlbS5rZXksXG4gICAgICAgICAgcmVxdWlyZWQ6IGl0ZW0ucmVxdWlyZWQgIT09IGZhbHNlLCAvLyBkZWZhdWx0IHRydWVcbiAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICBoaWRlOiBpdGVtLmhpZGUsXG4gICAgICAgIH0sXG4gICAgICB9IGFzIGFueSlcbiAgICB9XG4gICAgZWxzZSBpZiAoaXRlbS50eXBlID09PSAnc2VsZWN0Jykge1xuICAgICAgdXNlcklucHV0cy5wdXNoKHtcbiAgICAgICAgc2VsZWN0OiB7XG4gICAgICAgICAgbGFiZWw6IGl0ZW0ubmFtZSxcbiAgICAgICAgICB2YXJpYWJsZTogaXRlbS5rZXksXG4gICAgICAgICAgcmVxdWlyZWQ6IGl0ZW0ucmVxdWlyZWQgIT09IGZhbHNlLCAvLyBkZWZhdWx0IHRydWVcbiAgICAgICAgICBvcHRpb25zOiBpdGVtLm9wdGlvbnMsXG4gICAgICAgICAgZGVmYXVsdDogaXRlbS5kZWZhdWx0ID8/ICcnLFxuICAgICAgICAgIGhpZGU6IGl0ZW0uaGlkZSxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgYW55KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHVzZXJJbnB1dHMucHVzaCh7XG4gICAgICAgIGV4dGVybmFsX2RhdGFfdG9vbDoge1xuICAgICAgICAgIGxhYmVsOiBpdGVtLm5hbWUsXG4gICAgICAgICAgdmFyaWFibGU6IGl0ZW0ua2V5LFxuICAgICAgICAgIGVuYWJsZWQ6IGl0ZW0uZW5hYmxlZCxcbiAgICAgICAgICB0eXBlOiBpdGVtLnR5cGUsXG4gICAgICAgICAgY29uZmlnOiBpdGVtLmNvbmZpZyxcbiAgICAgICAgICByZXF1aXJlZDogaXRlbS5yZXF1aXJlZCxcbiAgICAgICAgICBpY29uOiBpdGVtLmljb24sXG4gICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiBpdGVtLmljb25fYmFja2dyb3VuZCxcbiAgICAgICAgICBoaWRlOiBpdGVtLmhpZGUsXG4gICAgICAgIH0sXG4gICAgICB9IGFzIGFueSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHVzZXJJbnB1dHNcbn1cblxuZXhwb3J0IGNvbnN0IGZvcm1hdEJvb2xlYW5JbnB1dHMgPSAodXNlSW5wdXRzPzogUHJvbXB0VmFyaWFibGVbXSB8IG51bGwsIGlucHV0cz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IG9iamVjdCB8IGJvb2xlYW4+IHwgbnVsbCkgPT4ge1xuICBpZiAoIXVzZUlucHV0cylcbiAgICByZXR1cm4gaW5wdXRzXG4gIGNvbnN0IHJlcyA9IHsgLi4uaW5wdXRzIH1cbiAgdXNlSW5wdXRzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICBjb25zdCBpc0Jvb2xlYW5JbnB1dCA9IGl0ZW0udHlwZSA9PT0gJ2NoZWNrYm94J1xuICAgIGlmIChpc0Jvb2xlYW5JbnB1dCkge1xuICAgICAgLy8gQ29udmVydCBib29sZWFuIGlucHV0cyB0byBib29sZWFuIHR5cGVcbiAgICAgIHJlc1tpdGVtLmtleV0gPSAhIXJlc1tpdGVtLmtleV1cbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cbiJdfQ==