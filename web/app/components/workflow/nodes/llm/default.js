"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/app/components/workflow/utils");
// import { RETRIEVAL_OUTPUT_STRUCT } from '../../constants'
const app_1 = require("@/types/app");
const types_1 = require("../../types");
const RETRIEVAL_OUTPUT_STRUCT = `{
  "content": "",
  "title": "",
  "url": "",
  "icon": "",
  "metadata": {
    "dataset_id": "",
    "dataset_name": "",
    "document_id": [],
    "document_name": "",
    "document_data_source_type": "",
    "segment_id": "",
    "segment_position": "",
    "segment_word_count": "",
    "segment_hit_count": "",
    "segment_index_node_hash": "",
    "score": ""
  }
}`;
const i18nPrefix = 'errorMsg';
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 1,
    type: types_1.BlockEnum.LLM,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        model: {
            provider: '',
            name: '',
            mode: app_1.AppModeEnum.CHAT,
            completion_params: {
                temperature: 0.7,
            },
        },
        prompt_template: [{
                role: types_1.PromptRole.system,
                text: '',
            }],
        context: {
            enabled: false,
            variable_selector: [],
        },
        vision: {
            enabled: false,
        },
    },
    defaultRunInputData: {
        '#context#': [RETRIEVAL_OUTPUT_STRUCT],
        '#files#': [],
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages && !payload.model.provider)
            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.model`, { ns: 'workflow' }) });
        if (!errorMessages && !payload.memory) {
            const isChatModel = payload.model.mode === app_1.AppModeEnum.CHAT;
            const isPromptEmpty = isChatModel
                ? !payload.prompt_template.some((t) => {
                    if (t.edition_type === types_1.EditionType.jinja2)
                        return t.jinja2_text !== '';
                    return t.text !== '';
                })
                : (payload.prompt_template.edition_type === types_1.EditionType.jinja2 ? payload.prompt_template.jinja2_text === '' : payload.prompt_template.text === '');
            if (isPromptEmpty)
                errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t('nodes.llm.prompt', { ns: 'workflow' }) });
        }
        if (!errorMessages && !!payload.memory) {
            const isChatModel = payload.model.mode === app_1.AppModeEnum.CHAT;
            // payload.memory.query_prompt_template not pass is default: {{#sys.query#}}
            if (isChatModel && !!payload.memory.query_prompt_template && !payload.memory.query_prompt_template.includes('{{#sys.query#}}'))
                errorMessages = t('nodes.llm.sysQueryInUser', { ns: 'workflow' });
        }
        if (!errorMessages) {
            const isChatModel = payload.model.mode === app_1.AppModeEnum.CHAT;
            const isShowVars = (() => {
                if (isChatModel)
                    return payload.prompt_template.some(item => item.edition_type === types_1.EditionType.jinja2);
                return payload.prompt_template.edition_type === types_1.EditionType.jinja2;
            })();
            if (isShowVars && payload.prompt_config?.jinja2_variables) {
                payload.prompt_config?.jinja2_variables.forEach((i) => {
                    if (!errorMessages && !i.variable)
                        errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.variable`, { ns: 'workflow' }) });
                    if (!errorMessages && !i.value_selector.length)
                        errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.variableValue`, { ns: 'workflow' }) });
                });
            }
        }
        if (!errorMessages && payload.vision?.enabled && !payload.vision.configs?.variable_selector?.length)
            errorMessages = t(`${i18nPrefix}.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}.fields.visionVariable`, { ns: 'workflow' }) });
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBaUU7QUFDakUsNERBQTREO0FBQzVELHFDQUF5QztBQUN6Qyx1Q0FBZ0U7QUFFaEUsTUFBTSx1QkFBdUIsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0I5QixDQUFBO0FBRUYsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBRTdCLE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWUsRUFBQztJQUMvQixJQUFJLEVBQUUsQ0FBQztJQUNQLElBQUksRUFBRSxpQkFBUyxDQUFDLEdBQUc7Q0FDcEIsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQTZCO0lBQzVDLFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWixLQUFLLEVBQUU7WUFDTCxRQUFRLEVBQUUsRUFBRTtZQUNaLElBQUksRUFBRSxFQUFFO1lBQ1IsSUFBSSxFQUFFLGlCQUFXLENBQUMsSUFBSTtZQUN0QixpQkFBaUIsRUFBRTtnQkFDakIsV0FBVyxFQUFFLEdBQUc7YUFDakI7U0FDRjtRQUNELGVBQWUsRUFBRSxDQUFDO2dCQUNoQixJQUFJLEVBQUUsa0JBQVUsQ0FBQyxNQUFNO2dCQUN2QixJQUFJLEVBQUUsRUFBRTthQUNULENBQUM7UUFDRixPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsS0FBSztZQUNkLGlCQUFpQixFQUFFLEVBQUU7U0FDdEI7UUFDRCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsS0FBSztTQUNmO0tBQ0Y7SUFDRCxtQkFBbUIsRUFBRTtRQUNuQixXQUFXLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztRQUN0QyxTQUFTLEVBQUUsRUFBRTtLQUNkO0lBQ0QsVUFBVSxDQUFDLE9BQW9CLEVBQUUsQ0FBTTtRQUNyQyxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENB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QUFDLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQ3JJLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU07d0JBQzVDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDNUksQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1FBQ0gsQ0FBQztRQUNELElBQUksQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNO1lBQ2pHLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzSSxPQUFPO1lBQ0wsT0FBTyxFQUFFLENBQUMsYUFBYTtZQUN2QixZQUFZLEVBQUUsYUFBYTtTQUM1QixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0LCBQcm9tcHRJdGVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExMTU5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG4vLyBpbXBvcnQgeyBSRVRSSUVWQUxfT1VUUFVUX1NUUlVDVCB9IGZyb20gJy4uLy4uL2NvbnN0YW50cydcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBCbG9ja0VudW0sIEVkaXRpb25UeXBlLCBQcm9tcHRSb2xlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmNvbnN0IFJFVFJJRVZBTF9PVVRQVVRfU1RSVUNUID0gYHtcbiAgXCJjb250ZW50XCI6IFwiXCIsXG4gIFwidGl0bGVcIjogXCJcIixcbiAgXCJ1cmxcIjogXCJcIixcbiAgXCJpY29uXCI6IFwiXCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiZGF0YXNldF9pZFwiOiBcIlwiLFxuICAgIFwiZGF0YXNldF9uYW1lXCI6IFwiXCIsXG4gICAgXCJkb2N1bWVudF9pZFwiOiBbXSxcbiAgICBcImRvY3VtZW50X25hbWVcIjogXCJcIixcbiAgICBcImRvY3VtZW50X2RhdGFfc291cmNlX3R5cGVcIjogXCJcIixcbiAgICBcInNlZ21lbnRfaWRcIjogXCJcIixcbiAgICBcInNlZ21lbnRfcG9zaXRpb25cIjogXCJcIixcbiAgICBcInNlZ21lbnRfd29yZF9jb3VudFwiOiBcIlwiLFxuICAgIFwic2VnbWVudF9oaXRfY291bnRcIjogXCJcIixcbiAgICBcInNlZ21lbnRfaW5kZXhfbm9kZV9oYXNoXCI6IFwiXCIsXG4gICAgXCJzY29yZVwiOiBcIlwiXG4gIH1cbn1gXG5cbmNvbnN0IGkxOG5QcmVmaXggPSAnZXJyb3JNc2cnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgc29ydDogMSxcbiAgdHlwZTogQmxvY2tFbnVtLkxMTSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8TExNTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgbW9kZWw6IHtcbiAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgbW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiB7XG4gICAgICAgIHRlbXBlcmF0dXJlOiAwLjcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJvbXB0X3RlbXBsYXRlOiBbe1xuICAgICAgcm9sZTogUHJvbXB0Um9sZS5zeXN0ZW0sXG4gICAgICB0ZXh0OiAnJyxcbiAgICB9XSxcbiAgICBjb250ZXh0OiB7XG4gICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgIHZhcmlhYmxlX3NlbGVjdG9yOiBbXSxcbiAgICB9LFxuICAgIHZpc2lvbjoge1xuICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgZGVmYXVsdFJ1bklucHV0RGF0YToge1xuICAgICcjY29udGV4dCMnOiBbUkVUUklFVkFMX09VVFBVVF9TVFJVQ1RdLFxuICAgICcjZmlsZXMjJzogW10sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZDogTExNTm9kZVR5cGUsIHQ6IGFueSkge1xuICAgIGxldCBlcnJvck1lc3NhZ2VzID0gJydcbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIXBheWxvYWQubW9kZWwucHJvdmlkZXIpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoYCR7aTE4blByZWZpeH0uZmllbGRzLm1vZGVsYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFwYXlsb2FkLm1lbW9yeSkge1xuICAgICAgY29uc3QgaXNDaGF0TW9kZWwgPSBwYXlsb2FkLm1vZGVsLm1vZGUgPT09IEFwcE1vZGVFbnVtLkNIQVRcbiAgICAgIGNvbnN0IGlzUHJvbXB0RW1wdHkgPSBpc0NoYXRNb2RlbFxuICAgICAgICA/ICEocGF5bG9hZC5wcm9tcHRfdGVtcGxhdGUgYXMgUHJvbXB0SXRlbVtdKS5zb21lKCh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodC5lZGl0aW9uX3R5cGUgPT09IEVkaXRpb25UeXBlLmppbmphMilcbiAgICAgICAgICAgICAgcmV0dXJuIHQuamluamEyX3RleHQgIT09ICcnXG5cbiAgICAgICAgICAgIHJldHVybiB0LnRleHQgIT09ICcnXG4gICAgICAgICAgfSlcbiAgICAgICAgOiAoKHBheWxvYWQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLmVkaXRpb25fdHlwZSA9PT0gRWRpdGlvblR5cGUuamluamEyID8gKHBheWxvYWQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW0pLmppbmphMl90ZXh0ID09PSAnJyA6IChwYXlsb2FkLnByb21wdF90ZW1wbGF0ZSBhcyBQcm9tcHRJdGVtKS50ZXh0ID09PSAnJylcbiAgICAgIGlmIChpc1Byb21wdEVtcHR5KVxuICAgICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fS5maWVsZFJlcXVpcmVkYCwgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmxsbS5wcm9tcHQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgfVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICEhcGF5bG9hZC5tZW1vcnkpIHtcbiAgICAgIGNvbnN0IGlzQ2hhdE1vZGVsID0gcGF5bG9hZC5tb2RlbC5tb2RlID09PSBBcHBNb2RlRW51bS5DSEFUXG4gICAgICAvLyBwYXlsb2FkLm1lbW9yeS5xdWVyeV9wcm9tcHRfdGVtcGxhdGUgbm90IHBhc3MgaXMgZGVmYXVsdDoge3sjc3lzLnF1ZXJ5I319XG4gICAgICBpZiAoaXNDaGF0TW9kZWwgJiYgISFwYXlsb2FkLm1lbW9yeS5xdWVyeV9wcm9tcHRfdGVtcGxhdGUgJiYgIXBheWxvYWQubWVtb3J5LnF1ZXJ5X3Byb21wdF90ZW1wbGF0ZS5pbmNsdWRlcygne3sjc3lzLnF1ZXJ5I319JykpXG4gICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KCdub2Rlcy5sbG0uc3lzUXVlcnlJblVzZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG4gICAgfVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzKSB7XG4gICAgICBjb25zdCBpc0NoYXRNb2RlbCA9IHBheWxvYWQubW9kZWwubW9kZSA9PT0gQXBwTW9kZUVudW0uQ0hBVFxuICAgICAgY29uc3QgaXNTaG93VmFycyA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChpc0NoYXRNb2RlbClcbiAgICAgICAgICByZXR1cm4gKHBheWxvYWQucHJvbXB0X3RlbXBsYXRlIGFzIFByb21wdEl0ZW1bXSkuc29tZShpdGVtID0+IGl0ZW0uZWRpdGlvbl90eXBlID09PSBFZGl0aW9uVHlwZS5qaW5qYTIpXG4gICAgICAgIHJldHVybiAocGF5bG9hZC5wcm9tcHRfdGVtcGxhdGUgYXMgUHJvbXB0SXRlbSkuZWRpdGlvbl90eXBlID09PSBFZGl0aW9uVHlwZS5qaW5qYTJcbiAgICAgIH0pKClcbiAgICAgIGlmIChpc1Nob3dWYXJzICYmIHBheWxvYWQucHJvbXB0X2NvbmZpZz8uamluamEyX3ZhcmlhYmxlcykge1xuICAgICAgICBwYXlsb2FkLnByb21wdF9jb25maWc/LmppbmphMl92YXJpYWJsZXMuZm9yRWFjaCgoaSkgPT4ge1xuICAgICAgICAgIGlmICghZXJyb3JNZXNzYWdlcyAmJiAhaS52YXJpYWJsZSlcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9LmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fS5maWVsZHMudmFyaWFibGVgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFpLnZhbHVlX3NlbGVjdG9yLmxlbmd0aClcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9LmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fS5maWVsZHMudmFyaWFibGVWYWx1ZWAsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmIHBheWxvYWQudmlzaW9uPy5lbmFibGVkICYmICFwYXlsb2FkLnZpc2lvbi5jb25maWdzPy52YXJpYWJsZV9zZWxlY3Rvcj8ubGVuZ3RoKVxuICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH0uZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9LmZpZWxkcy52aXNpb25WYXJpYWJsZWAsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19