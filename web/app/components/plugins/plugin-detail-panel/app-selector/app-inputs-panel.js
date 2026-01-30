"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const loading_1 = require("@/app/components/base/loading");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const app_inputs_form_1 = require("@/app/components/plugins/plugin-detail-panel/app-selector/app-inputs-form");
const types_1 = require("@/app/components/workflow/types");
const use_apps_1 = require("@/service/use-apps");
const use_common_1 = require("@/service/use-common");
const use_workflow_1 = require("@/service/use-workflow");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const AppInputsPanel = ({ value, appDetail, onFormChange, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const inputsRef = (0, react_1.useRef)(value?.inputs || {});
    const isBasicApp = appDetail.mode !== app_1.AppModeEnum.ADVANCED_CHAT && appDetail.mode !== app_1.AppModeEnum.WORKFLOW;
    const { data: fileUploadConfig } = (0, use_common_1.useFileUploadConfig)();
    const { data: currentApp, isFetching: isAppLoading } = (0, use_apps_1.useAppDetail)(appDetail.id);
    const { data: currentWorkflow, isFetching: isWorkflowLoading } = (0, use_workflow_1.useAppWorkflow)(isBasicApp ? '' : appDetail.id);
    const isLoading = isAppLoading || isWorkflowLoading;
    const basicAppFileConfig = (0, react_1.useMemo)(() => {
        let fileConfig;
        if (isBasicApp)
            fileConfig = currentApp?.model_config?.file_upload;
        else
            fileConfig = currentWorkflow?.features?.file_upload;
        return {
            image: {
                detail: fileConfig?.image?.detail || app_1.Resolution.high,
                enabled: !!fileConfig?.image?.enabled,
                number_limits: fileConfig?.image?.number_limits || 3,
                transfer_methods: fileConfig?.image?.transfer_methods || ['local_file', 'remote_url'],
            },
            enabled: !!(fileConfig?.enabled || fileConfig?.image?.enabled),
            allowed_file_types: fileConfig?.allowed_file_types || [types_1.SupportUploadFileTypes.image],
            allowed_file_extensions: fileConfig?.allowed_file_extensions || [...constants_1.FILE_EXTS[types_1.SupportUploadFileTypes.image]].map(ext => `.${ext}`),
            allowed_file_upload_methods: fileConfig?.allowed_file_upload_methods || fileConfig?.image?.transfer_methods || ['local_file', 'remote_url'],
            number_limits: fileConfig?.number_limits || fileConfig?.image?.number_limits || 3,
        };
    }, [currentApp?.model_config?.file_upload, currentWorkflow?.features?.file_upload, isBasicApp]);
    const inputFormSchema = (0, react_1.useMemo)(() => {
        if (!currentApp)
            return [];
        let inputFormSchema = [];
        if (isBasicApp) {
            inputFormSchema = currentApp.model_config?.user_input_form?.filter((item) => !item.external_data_tool).map((item) => {
                if (item.paragraph) {
                    return {
                        ...item.paragraph,
                        type: 'paragraph',
                        required: false,
                    };
                }
                if (item.number) {
                    return {
                        ...item.number,
                        type: 'number',
                        required: false,
                    };
                }
                if (item.checkbox) {
                    return {
                        ...item.checkbox,
                        type: 'checkbox',
                        required: false,
                    };
                }
                if (item.select) {
                    return {
                        ...item.select,
                        type: 'select',
                        required: false,
                    };
                }
                if (item['file-list']) {
                    return {
                        ...item['file-list'],
                        type: 'file-list',
                        required: false,
                        fileUploadConfig,
                    };
                }
                if (item.file) {
                    return {
                        ...item.file,
                        type: 'file',
                        required: false,
                        fileUploadConfig,
                    };
                }
                if (item.json_object) {
                    return {
                        ...item.json_object,
                        type: 'json_object',
                    };
                }
                return {
                    ...item['text-input'],
                    type: 'text-input',
                    required: false,
                };
            }) || [];
        }
        else {
            const startNode = currentWorkflow?.graph?.nodes.find(node => node.data.type === types_1.BlockEnum.Start);
            inputFormSchema = startNode?.data.variables.map((variable) => {
                if (variable.type === types_1.InputVarType.multiFiles) {
                    return {
                        ...variable,
                        required: false,
                        fileUploadConfig,
                    };
                }
                if (variable.type === types_1.InputVarType.singleFile) {
                    return {
                        ...variable,
                        required: false,
                        fileUploadConfig,
                    };
                }
                return {
                    ...variable,
                    required: false,
                };
            }) || [];
        }
        if ((currentApp.mode === app_1.AppModeEnum.COMPLETION || currentApp.mode === app_1.AppModeEnum.WORKFLOW) && basicAppFileConfig.enabled) {
            inputFormSchema.push({
                label: 'Image Upload',
                variable: '#image#',
                type: types_1.InputVarType.singleFile,
                required: false,
                ...basicAppFileConfig,
                fileUploadConfig,
            });
        }
        return inputFormSchema || [];
    }, [basicAppFileConfig, currentApp, currentWorkflow, fileUploadConfig, isBasicApp]);
    const handleFormChange = (value) => {
        inputsRef.current = value;
        onFormChange(value);
    };
    return (<div className={(0, classnames_1.cn)('flex max-h-[240px] flex-col rounded-b-2xl border-t border-divider-subtle pb-4')}>
      {isLoading && <div className="pt-3"><loading_1.default type="app"/></div>}
      {!isLoading && (<div className="system-sm-semibold mb-2 mt-3 flex h-6 shrink-0 items-center px-4 text-text-secondary">{t('appSelector.params', { ns: 'app' })}</div>)}
      {!isLoading && !inputFormSchema.length && (<div className="flex h-16 flex-col items-center justify-center">
          <div className="system-sm-regular text-text-tertiary">{t('appSelector.noParams', { ns: 'app' })}</div>
        </div>)}
      {!isLoading && !!inputFormSchema.length && (<div className="grow overflow-y-auto">
          <app_inputs_form_1.default inputs={value?.inputs || {}} inputsRef={inputsRef} inputsForms={inputFormSchema} onFormChange={handleFormChange}/>
        </div>)}
    </div>);
};
exports.default = AppInputsPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWlucHV0cy1wYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC1pbnB1dHMtcGFuZWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBR1osK0JBQThCO0FBQzlCLGlDQUF1QztBQUN2QyxpREFBOEM7QUFDOUMsMkRBQW1EO0FBQ25ELDZFQUF5RTtBQUN6RSwrR0FBcUc7QUFDckcsMkRBQWlHO0FBQ2pHLGlEQUFpRDtBQUNqRCxxREFBMEQ7QUFDMUQseURBQXVEO0FBQ3ZELHFDQUFxRDtBQUVyRCxtREFBdUM7QUFXdkMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUN0QixLQUFLLEVBQ0wsU0FBUyxFQUNULFlBQVksR0FDTixFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBQSxjQUFNLEVBQU0sS0FBSyxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNsRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxLQUFLLGlCQUFXLENBQUMsYUFBYSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssaUJBQVcsQ0FBQyxRQUFRLENBQUE7SUFDMUcsTUFBTSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUEsZ0NBQW1CLEdBQUUsQ0FBQTtJQUN4RCxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBQSx1QkFBWSxFQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNqRixNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFBLDZCQUFjLEVBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMv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O1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZpbGVVcGxvYWQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEFwcCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VNZW1vLCB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IHsgRklMRV9FWFRTIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IEFwcElucHV0c0Zvcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3BsdWdpbi1kZXRhaWwtcGFuZWwvYXBwLXNlbGVjdG9yL2FwcC1pbnB1dHMtZm9ybSdcbmltcG9ydCB7IEJsb2NrRW51bSwgSW5wdXRWYXJUeXBlLCBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUFwcERldGFpbCB9IGZyb20gJ0Avc2VydmljZS91c2UtYXBwcydcbmltcG9ydCB7IHVzZUZpbGVVcGxvYWRDb25maWcgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IHVzZUFwcFdvcmtmbG93IH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdydcbmltcG9ydCB7IEFwcE1vZGVFbnVtLCBSZXNvbHV0aW9uIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5cbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG50eXBlIFByb3BzID0ge1xuICB2YWx1ZT86IHtcbiAgICBhcHBfaWQ6IHN0cmluZ1xuICAgIGlucHV0czogUmVjb3JkPHN0cmluZywgYW55PlxuICB9XG4gIGFwcERldGFpbDogQXBwXG4gIG9uRm9ybUNoYW5nZTogKHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB2b2lkXG59XG5cbmNvbnN0IEFwcElucHV0c1BhbmVsID0gKHtcbiAgdmFsdWUsXG4gIGFwcERldGFpbCxcbiAgb25Gb3JtQ2hhbmdlLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGlucHV0c1JlZiA9IHVzZVJlZjxhbnk+KHZhbHVlPy5pbnB1dHMgfHwge30pXG4gIGNvbnN0IGlzQmFzaWNBcHAgPSBhcHBEZXRhaWwubW9kZSAhPT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCAmJiBhcHBEZXRhaWwubW9kZSAhPT0gQXBwTW9kZUVudW0uV09SS0ZMT1dcbiAgY29uc3QgeyBkYXRhOiBmaWxlVXBsb2FkQ29uZmlnIH0gPSB1c2VGaWxlVXBsb2FkQ29uZmlnKClcbiAgY29uc3QgeyBkYXRhOiBjdXJyZW50QXBwLCBpc0ZldGNoaW5nOiBpc0FwcExvYWRpbmcgfSA9IHVzZUFwcERldGFpbChhcHBEZXRhaWwuaWQpXG4gIGNvbnN0IHsgZGF0YTogY3VycmVudFdvcmtmbG93LCBpc0ZldGNoaW5nOiBpc1dvcmtmbG93TG9hZGluZyB9ID0gdXNlQXBwV29ya2Zsb3coaXNCYXNpY0FwcCA/ICcnIDogYXBwRGV0YWlsLmlkKVxuICBjb25zdCBpc0xvYWRpbmcgPSBpc0FwcExvYWRpbmcgfHwgaXNXb3JrZmxvd0xvYWRpbmdcblxuICBjb25zdCBiYXNpY0FwcEZpbGVDb25maWcgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBsZXQgZmlsZUNvbmZpZzogRmlsZVVwbG9hZFxuICAgIGlmIChpc0Jhc2ljQXBwKVxuICAgICAgZmlsZUNvbmZpZyA9IGN1cnJlbnRBcHA/Lm1vZGVsX2NvbmZpZz8uZmlsZV91cGxvYWQgYXMgRmlsZVVwbG9hZFxuICAgIGVsc2VcbiAgICAgIGZpbGVDb25maWcgPSBjdXJyZW50V29ya2Zsb3c/LmZlYXR1cmVzPy5maWxlX3VwbG9hZCBhcyBGaWxlVXBsb2FkXG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlOiB7XG4gICAgICAgIGRldGFpbDogZmlsZUNvbmZpZz8uaW1hZ2U/LmRldGFpbCB8fCBSZXNvbHV0aW9uLmhpZ2gsXG4gICAgICAgIGVuYWJsZWQ6ICEhZmlsZUNvbmZpZz8uaW1hZ2U/LmVuYWJsZWQsXG4gICAgICAgIG51bWJlcl9saW1pdHM6IGZpbGVDb25maWc/LmltYWdlPy5udW1iZXJfbGltaXRzIHx8IDMsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZHM6IGZpbGVDb25maWc/LmltYWdlPy50cmFuc2Zlcl9tZXRob2RzIHx8IFsnbG9jYWxfZmlsZScsICdyZW1vdGVfdXJsJ10sXG4gICAgICB9LFxuICAgICAgZW5hYmxlZDogISEoZmlsZUNvbmZpZz8uZW5hYmxlZCB8fCBmaWxlQ29uZmlnPy5pbWFnZT8uZW5hYmxlZCksXG4gICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IGZpbGVDb25maWc/LmFsbG93ZWRfZmlsZV90eXBlcyB8fCBbU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZV0sXG4gICAgICBhbGxvd2VkX2ZpbGVfZXh0ZW5zaW9uczogZmlsZUNvbmZpZz8uYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMgfHwgWy4uLkZJTEVfRVhUU1tTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmltYWdlXV0ubWFwKGV4dCA9PiBgLiR7ZXh0fWApLFxuICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBmaWxlQ29uZmlnPy5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMgfHwgZmlsZUNvbmZpZz8uaW1hZ2U/LnRyYW5zZmVyX21ldGhvZHMgfHwgWydsb2NhbF9maWxlJywgJ3JlbW90ZV91cmwnXSxcbiAgICAgIG51bWJlcl9saW1pdHM6IGZpbGVDb25maWc/Lm51bWJlcl9saW1pdHMgfHwgZmlsZUNvbmZpZz8uaW1hZ2U/Lm51bWJlcl9saW1pdHMgfHwgMyxcbiAgICB9XG4gIH0sIFtjdXJyZW50QXBwPy5tb2RlbF9jb25maWc/LmZpbGVfdXBsb2FkLCBjdXJyZW50V29ya2Zsb3c/LmZlYXR1cmVzPy5maWxlX3VwbG9hZCwgaXNCYXNpY0FwcF0pXG5cbiAgY29uc3QgaW5wdXRGb3JtU2NoZW1hID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFjdXJyZW50QXBwKVxuICAgICAgcmV0dXJuIFtdXG4gICAgbGV0IGlucHV0Rm9ybVNjaGVtYSA9IFtdXG4gICAgaWYgKGlzQmFzaWNBcHApIHtcbiAgICAgIGlucHV0Rm9ybVNjaGVtYSA9IGN1cnJlbnRBcHAubW9kZWxfY29uZmlnPy51c2VyX2lucHV0X2Zvcm0/LmZpbHRlcigoaXRlbTogYW55KSA9PiAhaXRlbS5leHRlcm5hbF9kYXRhX3Rvb2wpLm1hcCgoaXRlbTogYW55KSA9PiB7XG4gICAgICAgIGlmIChpdGVtLnBhcmFncmFwaCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pdGVtLnBhcmFncmFwaCxcbiAgICAgICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5udW1iZXIpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbS5udW1iZXIsXG4gICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0uY2hlY2tib3gpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbS5jaGVja2JveCxcbiAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnNlbGVjdCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pdGVtLnNlbGVjdCxcbiAgICAgICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtWydmaWxlLWxpc3QnXSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pdGVtWydmaWxlLWxpc3QnXSxcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlLWxpc3QnLFxuICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZmlsZVVwbG9hZENvbmZpZyxcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5maWxlKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0uZmlsZSxcbiAgICAgICAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGZpbGVVcGxvYWRDb25maWcsXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uanNvbl9vYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4uaXRlbS5qc29uX29iamVjdCxcbiAgICAgICAgICAgIHR5cGU6ICdqc29uX29iamVjdCcsXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5pdGVtWyd0ZXh0LWlucHV0J10sXG4gICAgICAgICAgdHlwZTogJ3RleHQtaW5wdXQnLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgfVxuICAgICAgfSkgfHwgW11cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zdCBzdGFydE5vZGUgPSBjdXJyZW50V29ya2Zsb3c/LmdyYXBoPy5ub2Rlcy5maW5kKG5vZGUgPT4gbm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydCkgYXMgYW55XG4gICAgICBpbnB1dEZvcm1TY2hlbWEgPSBzdGFydE5vZGU/LmRhdGEudmFyaWFibGVzLm1hcCgodmFyaWFibGU6IGFueSkgPT4ge1xuICAgICAgICBpZiAodmFyaWFibGUudHlwZSA9PT0gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4udmFyaWFibGUsXG4gICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICBmaWxlVXBsb2FkQ29uZmlnLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YXJpYWJsZS50eXBlID09PSBJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi52YXJpYWJsZSxcbiAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgIGZpbGVVcGxvYWRDb25maWcsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4udmFyaWFibGUsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICB9KSB8fCBbXVxuICAgIH1cbiAgICBpZiAoKGN1cnJlbnRBcHAubW9kZSA9PT0gQXBwTW9kZUVudW0uQ09NUExFVElPTiB8fCBjdXJyZW50QXBwLm1vZGUgPT09IEFwcE1vZGVFbnVtLldPUktGTE9XKSAmJiBiYXNpY0FwcEZpbGVDb25maWcuZW5hYmxlZCkge1xuICAgICAgaW5wdXRGb3JtU2NoZW1hLnB1c2goe1xuICAgICAgICBsYWJlbDogJ0ltYWdlIFVwbG9hZCcsXG4gICAgICAgIHZhcmlhYmxlOiAnI2ltYWdlIycsXG4gICAgICAgIHR5cGU6IElucHV0VmFyVHlwZS5zaW5nbGVGaWxlLFxuICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIC4uLmJhc2ljQXBwRmlsZUNvbmZpZyxcbiAgICAgICAgZmlsZVVwbG9hZENvbmZpZyxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBpbnB1dEZvcm1TY2hlbWEgfHwgW11cbiAgfSwgW2Jhc2ljQXBwRmlsZUNvbmZpZywgY3VycmVudEFwcCwgY3VycmVudFdvcmtmbG93LCBmaWxlVXBsb2FkQ29uZmlnLCBpc0Jhc2ljQXBwXSlcblxuICBjb25zdCBoYW5kbGVGb3JtQ2hhbmdlID0gKHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgaW5wdXRzUmVmLmN1cnJlbnQgPSB2YWx1ZVxuICAgIG9uRm9ybUNoYW5nZSh2YWx1ZSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IG1heC1oLVsyNDBweF0gZmxleC1jb2wgcm91bmRlZC1iLTJ4bCBib3JkZXItdCBib3JkZXItZGl2aWRlci1zdWJ0bGUgcGItNCcpfT5cbiAgICAgIHtpc0xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwdC0zXCI+PExvYWRpbmcgdHlwZT1cImFwcFwiIC8+PC9kaXY+fVxuICAgICAgeyFpc0xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBtYi0yIG10LTMgZmxleCBoLTYgc2hyaW5rLTAgaXRlbXMtY2VudGVyIHB4LTQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdhcHBTZWxlY3Rvci5wYXJhbXMnLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICl9XG4gICAgICB7IWlzTG9hZGluZyAmJiAhaW5wdXRGb3JtU2NoZW1hLmxlbmd0aCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTE2IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3QoJ2FwcFNlbGVjdG9yLm5vUGFyYW1zJywgeyBuczogJ2FwcCcgfSl9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHshaXNMb2FkaW5nICYmICEhaW5wdXRGb3JtU2NoZW1hLmxlbmd0aCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdyBvdmVyZmxvdy15LWF1dG9cIj5cbiAgICAgICAgICA8QXBwSW5wdXRzRm9ybVxuICAgICAgICAgICAgaW5wdXRzPXt2YWx1ZT8uaW5wdXRzIHx8IHt9fVxuICAgICAgICAgICAgaW5wdXRzUmVmPXtpbnB1dHNSZWZ9XG4gICAgICAgICAgICBpbnB1dHNGb3Jtcz17aW5wdXRGb3JtU2NoZW1hfVxuICAgICAgICAgICAgb25Gb3JtQ2hhbmdlPXtoYW5kbGVGb3JtQ2hhbmdlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBJbnB1dHNQYW5lbFxuIl19