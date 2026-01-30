"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHiddenConfigurations = exports.useConfigurations = exports.useHiddenFieldNames = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("@/app/components/base/file-uploader/hooks");
const types_1 = require("@/app/components/base/form/form-scenarios/input-field/types");
const constants_1 = require("@/app/components/workflow/constants");
const config_1 = require("@/config");
const pipeline_1 = require("@/models/pipeline");
const use_common_1 = require("@/service/use-common");
const format_1 = require("@/utils/format");
const schema_1 = require("./schema");
const useHiddenFieldNames = (type) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hiddenFieldNames = (0, react_1.useMemo)(() => {
        let fieldNames = [];
        switch (type) {
            case pipeline_1.PipelineInputVarType.textInput:
            case pipeline_1.PipelineInputVarType.paragraph:
                fieldNames = [
                    t('variableConfig.defaultValue', { ns: 'appDebug' }),
                    t('variableConfig.placeholder', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            case pipeline_1.PipelineInputVarType.number:
                fieldNames = [
                    t('variableConfig.defaultValue', { ns: 'appDebug' }),
                    t('variableConfig.unit', { ns: 'appDebug' }),
                    t('variableConfig.placeholder', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            case pipeline_1.PipelineInputVarType.select:
                fieldNames = [
                    t('variableConfig.defaultValue', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            case pipeline_1.PipelineInputVarType.singleFile:
                fieldNames = [
                    t('variableConfig.uploadMethod', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            case pipeline_1.PipelineInputVarType.multiFiles:
                fieldNames = [
                    t('variableConfig.uploadMethod', { ns: 'appDebug' }),
                    t('variableConfig.maxNumberOfUploads', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            case pipeline_1.PipelineInputVarType.checkbox:
                fieldNames = [
                    t('variableConfig.startChecked', { ns: 'appDebug' }),
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
                break;
            default:
                fieldNames = [
                    t('variableConfig.tooltips', { ns: 'appDebug' }),
                ];
        }
        return fieldNames.map(name => name.toLowerCase()).join(', ');
    }, [type, t]);
    return hiddenFieldNames;
};
exports.useHiddenFieldNames = useHiddenFieldNames;
const useConfigurations = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getFieldValue, setFieldValue, supportFile } = props;
    const handleTypeChange = (0, react_1.useCallback)((type) => {
        if ([pipeline_1.PipelineInputVarType.singleFile, pipeline_1.PipelineInputVarType.multiFiles].includes(type)) {
            setFieldValue('allowedFileUploadMethods', constants_1.DEFAULT_FILE_UPLOAD_SETTING.allowed_file_upload_methods);
            setFieldValue('allowedTypesAndExtensions', {
                allowedFileTypes: constants_1.DEFAULT_FILE_UPLOAD_SETTING.allowed_file_types,
                allowedFileExtensions: constants_1.DEFAULT_FILE_UPLOAD_SETTING.allowed_file_extensions,
            });
            if (type === pipeline_1.PipelineInputVarType.multiFiles)
                setFieldValue('maxLength', constants_1.DEFAULT_FILE_UPLOAD_SETTING.max_length);
        }
        if (type === pipeline_1.PipelineInputVarType.paragraph)
            setFieldValue('maxLength', config_1.DEFAULT_VALUE_MAX_LEN);
    }, [setFieldValue]);
    const handleVariableNameBlur = (0, react_1.useCallback)((value) => {
        const label = getFieldValue('label');
        if (!value || label)
            return;
        setFieldValue('label', value);
    }, [getFieldValue, setFieldValue]);
    const handleDisplayNameBlur = (0, react_1.useCallback)((value) => {
        if (!value)
            setFieldValue('label', getFieldValue('variable'));
    }, [getFieldValue, setFieldValue]);
    const initialConfigurations = (0, react_1.useMemo)(() => {
        return [{
                type: types_1.InputFieldType.inputTypeSelect,
                label: t('variableConfig.fieldType', { ns: 'appDebug' }),
                variable: 'type',
                required: true,
                showConditions: [],
                listeners: {
                    onChange: ({ value }) => handleTypeChange(value),
                },
                supportFile,
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.varName', { ns: 'appDebug' }),
                variable: 'variable',
                placeholder: t('variableConfig.inputPlaceholder', { ns: 'appDebug' }),
                required: true,
                listeners: {
                    onBlur: ({ value }) => handleVariableNameBlur(value),
                },
                showConditions: [],
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.displayName', { ns: 'appDebug' }),
                variable: 'label',
                placeholder: t('variableConfig.inputPlaceholder', { ns: 'appDebug' }),
                required: false,
                listeners: {
                    onBlur: ({ value }) => handleDisplayNameBlur(value),
                },
                showConditions: [],
            }, {
                type: types_1.InputFieldType.numberInput,
                label: t('variableConfig.maxLength', { ns: 'appDebug' }),
                variable: 'maxLength',
                placeholder: t('variableConfig.inputPlaceholder', { ns: 'appDebug' }),
                required: true,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.textInput,
                    }],
                min: 1,
                max: schema_1.TEXT_MAX_LENGTH,
            }, {
                type: types_1.InputFieldType.options,
                label: t('variableConfig.options', { ns: 'appDebug' }),
                variable: 'options',
                required: true,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.select,
                    }],
            }, {
                type: types_1.InputFieldType.fileTypes,
                label: t('variableConfig.file.supportFileTypes', { ns: 'appDebug' }),
                variable: 'allowedTypesAndExtensions',
                required: true,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.singleFile,
                    }],
            }, {
                type: types_1.InputFieldType.fileTypes,
                label: t('variableConfig.file.supportFileTypes', { ns: 'appDebug' }),
                variable: 'allowedTypesAndExtensions',
                required: true,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.multiFiles,
                    }],
            }, {
                type: types_1.InputFieldType.checkbox,
                label: t('variableConfig.required', { ns: 'appDebug' }),
                variable: 'required',
                required: true,
                showConditions: [],
            }];
    }, [t, supportFile, handleTypeChange, handleVariableNameBlur, handleDisplayNameBlur]);
    return initialConfigurations;
};
exports.useConfigurations = useConfigurations;
const useHiddenConfigurations = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { options } = props;
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const { imgSizeLimit, docSizeLimit, audioSizeLimit, videoSizeLimit, } = (0, hooks_1.useFileSizeLimit)(fileUploadConfigResponse);
    const defaultSelectOptions = (0, react_1.useMemo)(() => {
        if (options) {
            const defaultOptions = [
                {
                    value: '',
                    label: t('variableConfig.noDefaultSelected', { ns: 'appDebug' }),
                },
            ];
            const otherOptions = options.map((option) => ({
                value: option,
                label: option,
            }));
            return [...defaultOptions, ...otherOptions];
        }
        return [];
    }, [options, t]);
    const hiddenConfigurations = (0, react_1.useMemo)(() => {
        return [{
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.defaultValue', { ns: 'appDebug' }),
                variable: 'default',
                placeholder: t('variableConfig.defaultValuePlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.textInput,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.defaultValue', { ns: 'appDebug' }),
                variable: 'default',
                placeholder: t('variableConfig.defaultValuePlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.paragraph,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.numberInput,
                label: t('variableConfig.defaultValue', { ns: 'appDebug' }),
                variable: 'default',
                placeholder: t('variableConfig.defaultValuePlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.number,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.select,
                label: t('variableConfig.startSelectedOption', { ns: 'appDebug' }),
                variable: 'default',
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.select,
                    }],
                showOptional: true,
                options: defaultSelectOptions,
                popupProps: {
                    wrapperClassName: 'z-40',
                },
            }, {
                type: types_1.InputFieldType.checkbox,
                label: t('variableConfig.startChecked', { ns: 'appDebug' }),
                variable: 'default',
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.checkbox,
                    }],
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.placeholder', { ns: 'appDebug' }),
                variable: 'placeholder',
                placeholder: t('variableConfig.placeholderPlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.textInput,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.placeholder', { ns: 'appDebug' }),
                variable: 'placeholder',
                placeholder: t('variableConfig.placeholderPlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.paragraph,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.unit', { ns: 'appDebug' }),
                variable: 'unit',
                placeholder: t('variableConfig.unitPlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.number,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.placeholder', { ns: 'appDebug' }),
                variable: 'placeholder',
                placeholder: t('variableConfig.placeholderPlaceholder', { ns: 'appDebug' }),
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.number,
                    }],
                showOptional: true,
            }, {
                type: types_1.InputFieldType.uploadMethod,
                label: t('variableConfig.uploadFileTypes', { ns: 'appDebug' }),
                variable: 'allowedFileUploadMethods',
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.singleFile,
                    }],
            }, {
                type: types_1.InputFieldType.uploadMethod,
                label: t('variableConfig.uploadFileTypes', { ns: 'appDebug' }),
                variable: 'allowedFileUploadMethods',
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.multiFiles,
                    }],
            }, {
                type: types_1.InputFieldType.numberSlider,
                label: t('variableConfig.maxNumberOfUploads', { ns: 'appDebug' }),
                variable: 'maxLength',
                required: false,
                showConditions: [{
                        variable: 'type',
                        value: pipeline_1.PipelineInputVarType.multiFiles,
                    }],
                description: t('variableConfig.maxNumberTip', {
                    ns: 'appDebug',
                    imgLimit: (0, format_1.formatFileSize)(imgSizeLimit),
                    docLimit: (0, format_1.formatFileSize)(docSizeLimit),
                    audioLimit: (0, format_1.formatFileSize)(audioSizeLimit),
                    videoLimit: (0, format_1.formatFileSize)(videoSizeLimit),
                }),
            }, {
                type: types_1.InputFieldType.textInput,
                label: t('variableConfig.tooltips', { ns: 'appDebug' }),
                variable: 'tooltips',
                required: false,
                showConditions: [],
                showOptional: true,
            }];
    }, [defaultSelectOptions, imgSizeLimit, docSizeLimit, audioSizeLimit, videoSizeLimit, t]);
    return hiddenConfigurations;
};
exports.useHiddenConfigurations = useHiddenConfigurations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxpQ0FBNEM7QUFDNUMsaURBQThDO0FBQzlDLHFFQUE0RTtBQUM1RSx1RkFBNEY7QUFDNUYsbUVBQWlGO0FBQ2pGLHFDQUFnRDtBQUNoRCxnREFBd0Q7QUFDeEQscURBQTBEO0FBQzFELDJDQUErQztBQUMvQyxxQ0FBMEM7QUFFbkMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLElBQTBCLEVBQUUsRUFBRTtJQUNoRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDcEMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO1FBQ25CLFFBQVEsSUFBSSxFQUFFLENBQUM7WUFDYixLQUFLLCtCQUFvQixDQUFDLFNBQVMsQ0FBQztZQUNwQyxLQUFLLCtCQUFvQixDQUFDLFNBQVM7Z0JBQ2pDLFVBQVUsR0FBRztvQkFDWCxDQUFDLENBQUMsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7b0JBQ3BELENBQUMsQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztvQkFDbkQsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO2lCQUNqRCxDQUFBO2dCQUNELE1BQUs7WUFDUCxLQUFLLCtCQUFvQixDQUFDLE1BQU07Z0JBQzlCLFVBQVUsR0FBRztvQkFDWCxDQUFDLENBQUMsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7b0JBQ3BELENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztvQkFDNUMsQ0FBQyxDQUFDLDRCQUE0QixFQUFFLEVBQUUsRUFB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ZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGVlcEtleXMgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtZm9ybSdcbmltcG9ydCB0eXBlIHsgRm9ybURhdGEgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dEZpZWxkQ29uZmlndXJhdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2Zvcm0tc2NlbmFyaW9zL2lucHV0LWZpZWxkL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUZpbGVTaXplTGltaXQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci9ob29rcydcbmltcG9ydCB7IElucHV0RmllbGRUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vZm9ybS1zY2VuYXJpb3MvaW5wdXQtZmllbGQvdHlwZXMnXG5pbXBvcnQgeyBERUZBVUxUX0ZJTEVfVVBMT0FEX1NFVFRJTkcgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnN0YW50cydcbmltcG9ydCB7IERFRkFVTFRfVkFMVUVfTUFYX0xFTiB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgUGlwZWxpbmVJbnB1dFZhclR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IHVzZUZpbGVVcGxvYWRDb25maWcgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IGZvcm1hdEZpbGVTaXplIH0gZnJvbSAnQC91dGlscy9mb3JtYXQnXG5pbXBvcnQgeyBURVhUX01BWF9MRU5HVEggfSBmcm9tICcuL3NjaGVtYSdcblxuZXhwb3J0IGNvbnN0IHVzZUhpZGRlbkZpZWxkTmFtZXMgPSAodHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGhpZGRlbkZpZWxkTmFtZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBsZXQgZmllbGROYW1lcyA9IFtdXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dDpcbiAgICAgIGNhc2UgUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoOlxuICAgICAgICBmaWVsZE5hbWVzID0gW1xuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICAgICAgdCgndmFyaWFibGVDb25maWcucGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXI6XG4gICAgICAgIGZpZWxkTmFtZXMgPSBbXG4gICAgICAgICAgdCgndmFyaWFibGVDb25maWcuZGVmYXVsdFZhbHVlJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy51bml0JywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICAgICAgdCgndmFyaWFibGVDb25maWcudG9vbHRpcHMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICBdXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdDpcbiAgICAgICAgZmllbGROYW1lcyA9IFtcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlOlxuICAgICAgICBmaWVsZE5hbWVzID0gW1xuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLnVwbG9hZE1ldGhvZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICAgICAgdCgndmFyaWFibGVDb25maWcudG9vbHRpcHMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICBdXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXM6XG4gICAgICAgIGZpZWxkTmFtZXMgPSBbXG4gICAgICAgICAgdCgndmFyaWFibGVDb25maWcudXBsb2FkTWV0aG9kJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy5tYXhOdW1iZXJPZlVwbG9hZHMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveDpcbiAgICAgICAgZmllbGROYW1lcyA9IFtcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy5zdGFydENoZWNrZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICAgIHQoJ3ZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZmllbGROYW1lcyA9IFtcbiAgICAgICAgICB0KCd2YXJpYWJsZUNvbmZpZy50b29sdGlwcycsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICAgIF1cbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkTmFtZXMubWFwKG5hbWUgPT4gbmFtZS50b0xvd2VyQ2FzZSgpKS5qb2luKCcsICcpXG4gIH0sIFt0eXBlLCB0XSlcblxuICByZXR1cm4gaGlkZGVuRmllbGROYW1lc1xufVxuXG5leHBvcnQgY29uc3QgdXNlQ29uZmlndXJhdGlvbnMgPSAocHJvcHM6IHtcbiAgZ2V0RmllbGRWYWx1ZTogKGZpZWxkTmFtZTogRGVlcEtleXM8Rm9ybURhdGE+KSA9PiBhbnlcbiAgc2V0RmllbGRWYWx1ZTogKGZpZWxkTmFtZTogRGVlcEtleXM8Rm9ybURhdGE+LCB2YWx1ZTogYW55KSA9PiB2b2lkXG4gIHN1cHBvcnRGaWxlOiBib29sZWFuXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGdldEZpZWxkVmFsdWUsIHNldEZpZWxkVmFsdWUsIHN1cHBvcnRGaWxlIH0gPSBwcm9wc1xuXG4gIGNvbnN0IGhhbmRsZVR5cGVDaGFuZ2UgPSB1c2VDYWxsYmFjaygodHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUpID0+IHtcbiAgICBpZiAoW1BpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUsIFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXNdLmluY2x1ZGVzKHR5cGUpKSB7XG4gICAgICBzZXRGaWVsZFZhbHVlKCdhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHMnLCBERUZBVUxUX0ZJTEVfVVBMT0FEX1NFVFRJTkcuYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzKVxuICAgICAgc2V0RmllbGRWYWx1ZSgnYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9ucycsIHtcbiAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogREVGQVVMVF9GSUxFX1VQTE9BRF9TRVRUSU5HLmFsbG93ZWRfZmlsZV90eXBlcyxcbiAgICAgICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBERUZBVUxUX0ZJTEVfVVBMT0FEX1NFVFRJTkcuYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMsXG4gICAgICB9KVxuICAgICAgaWYgKHR5cGUgPT09IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpXG4gICAgICAgIHNldEZpZWxkVmFsdWUoJ21heExlbmd0aCcsIERFRkFVTFRfRklMRV9VUExPQURfU0VUVElORy5tYXhfbGVuZ3RoKVxuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoKVxuICAgICAgc2V0RmllbGRWYWx1ZSgnbWF4TGVuZ3RoJywgREVGQVVMVF9WQUxVRV9NQVhfTEVOKVxuICB9LCBbc2V0RmllbGRWYWx1ZV0pXG5cbiAgY29uc3QgaGFuZGxlVmFyaWFibGVOYW1lQmx1ciA9IHVzZUNhbGxiYWNrKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbGFiZWwgPSBnZXRGaWVsZFZhbHVlKCdsYWJlbCcpXG4gICAgaWYgKCF2YWx1ZSB8fCBsYWJlbClcbiAgICAgIHJldHVyblxuICAgIHNldEZpZWxkVmFsdWUoJ2xhYmVsJywgdmFsdWUpXG4gIH0sIFtnZXRGaWVsZFZhbHVlLCBzZXRGaWVsZFZhbHVlXSlcblxuICBjb25zdCBoYW5kbGVEaXNwbGF5TmFtZUJsdXIgPSB1c2VDYWxsYmFjaygodmFsdWU6IHN0cmluZykgPT4ge1xuICAgIGlmICghdmFsdWUpXG4gICAgICBzZXRGaWVsZFZhbHVlKCdsYWJlbCcsIGdldEZpZWxkVmFsdWUoJ3ZhcmlhYmxlJykpXG4gIH0sIFtnZXRGaWVsZFZhbHVlLCBzZXRGaWVsZFZhbHVlXSlcblxuICBjb25zdCBpbml0aWFsQ29uZmlndXJhdGlvbnMgPSB1c2VNZW1vKCgpOiBJbnB1dEZpZWxkQ29uZmlndXJhdGlvbltdID0+IHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLmlucHV0VHlwZVNlbGVjdCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5maWVsZFR5cGUnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICAgICAgbGlzdGVuZXJzOiB7XG4gICAgICAgIG9uQ2hhbmdlOiAoeyB2YWx1ZSB9KSA9PiBoYW5kbGVUeXBlQ2hhbmdlKHZhbHVlKSxcbiAgICAgIH0sXG4gICAgICBzdXBwb3J0RmlsZSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS50ZXh0SW5wdXQsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcudmFyTmFtZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ3ZhcmlhYmxlJyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy5pbnB1dFBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgbGlzdGVuZXJzOiB7XG4gICAgICAgIG9uQmx1cjogKHsgdmFsdWUgfSkgPT4gaGFuZGxlVmFyaWFibGVOYW1lQmx1cih2YWx1ZSksXG4gICAgICB9LFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5kaXNwbGF5TmFtZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ2xhYmVsJyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy5pbnB1dFBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIGxpc3RlbmVyczoge1xuICAgICAgICBvbkJsdXI6ICh7IHZhbHVlIH0pID0+IGhhbmRsZURpc3BsYXlOYW1lQmx1cih2YWx1ZSksXG4gICAgICB9LFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLm51bWJlcklucHV0LFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLm1heExlbmd0aCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ21heExlbmd0aCcsXG4gICAgICBwbGFjZWhvbGRlcjogdCgndmFyaWFibGVDb25maWcuaW5wdXRQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgfV0sXG4gICAgICBtaW46IDEsXG4gICAgICBtYXg6IFRFWFRfTUFYX0xFTkdUSCxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS5vcHRpb25zLFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLm9wdGlvbnMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdvcHRpb25zJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFt7XG4gICAgICAgIHZhcmlhYmxlOiAndHlwZScsXG4gICAgICAgIHZhbHVlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zZWxlY3QsXG4gICAgICB9XSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS5maWxlVHlwZXMsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcuZmlsZS5zdXBwb3J0RmlsZVR5cGVzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHZhcmlhYmxlOiAnYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9ucycsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSxcbiAgICAgIH1dLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLmZpbGVUeXBlcyxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5maWxlLnN1cHBvcnRGaWxlVHlwZXMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFt7XG4gICAgICAgIHZhcmlhYmxlOiAndHlwZScsXG4gICAgICAgIHZhbHVlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5tdWx0aUZpbGVzLFxuICAgICAgfV0sXG4gICAgfSwge1xuICAgICAgdHlwZTogSW5wdXRGaWVsZFR5cGUuY2hlY2tib3gsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcucmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdyZXF1aXJlZCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbXSxcbiAgICB9XVxuICB9LCBbdCwgc3VwcG9ydEZpbGUsIGhhbmRsZVR5cGVDaGFuZ2UsIGhhbmRsZVZhcmlhYmxlTmFtZUJsdXIsIGhhbmRsZURpc3BsYXlOYW1lQmx1cl0pXG5cbiAgcmV0dXJuIGluaXRpYWxDb25maWd1cmF0aW9uc1xufVxuXG5leHBvcnQgY29uc3QgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMgPSAocHJvcHM6IHtcbiAgb3B0aW9uczogc3RyaW5nW10gfCB1bmRlZmluZWRcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgeyBvcHRpb25zIH0gPSBwcm9wc1xuXG4gIGNvbnN0IHsgZGF0YTogZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlIH0gPSB1c2VGaWxlVXBsb2FkQ29uZmlnKClcbiAgY29uc3Qge1xuICAgIGltZ1NpemVMaW1pdCxcbiAgICBkb2NTaXplTGltaXQsXG4gICAgYXVkaW9TaXplTGltaXQsXG4gICAgdmlkZW9TaXplTGltaXQsXG4gIH0gPSB1c2VGaWxlU2l6ZUxpbWl0KGZpbGVVcGxvYWRDb25maWdSZXNwb25zZSlcblxuICBjb25zdCBkZWZhdWx0U2VsZWN0T3B0aW9ucyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcubm9EZWZhdWx0U2VsZWN0ZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICB9LFxuICAgICAgXVxuICAgICAgY29uc3Qgb3RoZXJPcHRpb25zID0gb3B0aW9ucy5tYXAoKG9wdGlvbjogc3RyaW5nKSA9PiAoe1xuICAgICAgICB2YWx1ZTogb3B0aW9uLFxuICAgICAgICBsYWJlbDogb3B0aW9uLFxuICAgICAgfSkpXG4gICAgICByZXR1cm4gWy4uLmRlZmF1bHRPcHRpb25zLCAuLi5vdGhlck9wdGlvbnNdXG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9LCBbb3B0aW9ucywgdF0pXG5cbiAgY29uc3QgaGlkZGVuQ29uZmlndXJhdGlvbnMgPSB1c2VNZW1vKCgpOiBJbnB1dEZpZWxkQ29uZmlndXJhdGlvbltdID0+IHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdkZWZhdWx0JyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWVQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW3tcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgIH1dLFxuICAgICAgc2hvd09wdGlvbmFsOiB0cnVlLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdkZWZhdWx0JyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWVQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW3tcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnBhcmFncmFwaCxcbiAgICAgIH1dLFxuICAgICAgc2hvd09wdGlvbmFsOiB0cnVlLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLm51bWJlcklucHV0LFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ2RlZmF1bHQnLFxuICAgICAgcGxhY2Vob2xkZXI6IHQoJ3ZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZVBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgfV0sXG4gICAgICBzaG93T3B0aW9uYWw6IHRydWUsXG4gICAgfSwge1xuICAgICAgdHlwZTogSW5wdXRGaWVsZFR5cGUuc2VsZWN0LFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLnN0YXJ0U2VsZWN0ZWRPcHRpb24nLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdkZWZhdWx0JyxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgfV0sXG4gICAgICBzaG93T3B0aW9uYWw6IHRydWUsXG4gICAgICBvcHRpb25zOiBkZWZhdWx0U2VsZWN0T3B0aW9ucyxcbiAgICAgIHBvcHVwUHJvcHM6IHtcbiAgICAgICAgd3JhcHBlckNsYXNzTmFtZTogJ3otNDAnLFxuICAgICAgfSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS5jaGVja2JveCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5zdGFydENoZWNrZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdkZWZhdWx0JyxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuY2hlY2tib3gsXG4gICAgICB9XSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS50ZXh0SW5wdXQsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcucGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdwbGFjZWhvbGRlcicsXG4gICAgICBwbGFjZWhvbGRlcjogdCgndmFyaWFibGVDb25maWcucGxhY2Vob2xkZXJQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW3tcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgIH1dLFxuICAgICAgc2hvd09wdGlvbmFsOiB0cnVlLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ3BsYWNlaG9sZGVyJyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlclBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLFxuICAgICAgfV0sXG4gICAgICBzaG93T3B0aW9uYWw6IHRydWUsXG4gICAgfSwge1xuICAgICAgdHlwZTogSW5wdXRGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLnVuaXQnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICd1bml0JyxcbiAgICAgIHBsYWNlaG9sZGVyOiB0KCd2YXJpYWJsZUNvbmZpZy51bml0UGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFt7XG4gICAgICAgIHZhcmlhYmxlOiAndHlwZScsXG4gICAgICAgIHZhbHVlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsXG4gICAgICB9XSxcbiAgICAgIHNob3dPcHRpb25hbDogdHJ1ZSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS50ZXh0SW5wdXQsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcucGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdwbGFjZWhvbGRlcicsXG4gICAgICBwbGFjZWhvbGRlcjogdCgndmFyaWFibGVDb25maWcucGxhY2Vob2xkZXJQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW3tcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlcixcbiAgICAgIH1dLFxuICAgICAgc2hvd09wdGlvbmFsOiB0cnVlLFxuICAgIH0sIHtcbiAgICAgIHR5cGU6IElucHV0RmllbGRUeXBlLnVwbG9hZE1ldGhvZCxcbiAgICAgIGxhYmVsOiB0KCd2YXJpYWJsZUNvbmZpZy51cGxvYWRGaWxlVHlwZXMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICdhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHMnLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgc2hvd0NvbmRpdGlvbnM6IFt7XG4gICAgICAgIHZhcmlhYmxlOiAndHlwZScsXG4gICAgICAgIHZhbHVlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlLFxuICAgICAgfV0sXG4gICAgfSwge1xuICAgICAgdHlwZTogSW5wdXRGaWVsZFR5cGUudXBsb2FkTWV0aG9kLFxuICAgICAgbGFiZWw6IHQoJ3ZhcmlhYmxlQ29uZmlnLnVwbG9hZEZpbGVUeXBlcycsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YXJpYWJsZTogJ2FsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcycsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW3tcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICB9XSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS5udW1iZXJTbGlkZXIsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcubWF4TnVtYmVyT2ZVcGxvYWRzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHZhcmlhYmxlOiAnbWF4TGVuZ3RoJyxcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIHNob3dDb25kaXRpb25zOiBbe1xuICAgICAgICB2YXJpYWJsZTogJ3R5cGUnLFxuICAgICAgICB2YWx1ZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubXVsdGlGaWxlcyxcbiAgICAgIH1dLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ3ZhcmlhYmxlQ29uZmlnLm1heE51bWJlclRpcCcsIHtcbiAgICAgICAgbnM6ICdhcHBEZWJ1ZycsXG4gICAgICAgIGltZ0xpbWl0OiBmb3JtYXRGaWxlU2l6ZShpbWdTaXplTGltaXQpLFxuICAgICAgICBkb2NMaW1pdDogZm9ybWF0RmlsZVNpemUoZG9jU2l6ZUxpbWl0KSxcbiAgICAgICAgYXVkaW9MaW1pdDogZm9ybWF0RmlsZVNpemUoYXVkaW9TaXplTGltaXQpLFxuICAgICAgICB2aWRlb0xpbWl0OiBmb3JtYXRGaWxlU2l6ZSh2aWRlb1NpemVMaW1pdCksXG4gICAgICB9KSxcbiAgICB9LCB7XG4gICAgICB0eXBlOiBJbnB1dEZpZWxkVHlwZS50ZXh0SW5wdXQsXG4gICAgICBsYWJlbDogdCgndmFyaWFibGVDb25maWcudG9vbHRpcHMnLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgdmFyaWFibGU6ICd0b29sdGlwcycsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBzaG93Q29uZGl0aW9uczogW10sXG4gICAgICBzaG93T3B0aW9uYWw6IHRydWUsXG4gICAgfV1cbiAgfSwgW2RlZmF1bHRTZWxlY3RPcHRpb25zLCBpbWdTaXplTGltaXQsIGRvY1NpemVMaW1pdCwgYXVkaW9TaXplTGltaXQsIHZpZGVvU2l6ZUxpbWl0LCB0XSlcblxuICByZXR1cm4gaGlkZGVuQ29uZmlndXJhdGlvbnNcbn1cbiJdfQ==