"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const store_1 = require("@/app/components/app/store");
const checkbox_1 = require("@/app/components/base/checkbox");
const file_uploader_1 = require("@/app/components/base/file-uploader");
const input_1 = require("@/app/components/base/input");
const modal_1 = require("@/app/components/base/modal");
const select_1 = require("@/app/components/base/select");
const textarea_1 = require("@/app/components/base/textarea");
const toast_1 = require("@/app/components/base/toast");
const constants_1 = require("@/app/components/workflow/constants");
const code_editor_1 = require("@/app/components/workflow/nodes/_base/components/editor/code-editor");
const file_upload_setting_1 = require("@/app/components/workflow/nodes/_base/components/file-upload-setting");
const types_1 = require("@/app/components/workflow/nodes/code/types");
const types_2 = require("@/app/components/workflow/types");
const config_1 = require("@/config");
const debug_configuration_1 = require("@/context/debug-configuration");
const app_1 = require("@/types/app");
const var_1 = require("@/utils/var");
const config_select_1 = require("../config-select");
const config_string_1 = require("../config-string");
const modal_foot_1 = require("../modal-foot");
const config_2 = require("./config");
const field_1 = require("./field");
const type_select_1 = require("./type-select");
const TEXT_MAX_LENGTH = 256;
const CHECKBOX_DEFAULT_TRUE_VALUE = 'true';
const CHECKBOX_DEFAULT_FALSE_VALUE = 'false';
const getCheckboxDefaultSelectValue = (value) => {
    if (typeof value === 'boolean')
        return value ? CHECKBOX_DEFAULT_TRUE_VALUE : CHECKBOX_DEFAULT_FALSE_VALUE;
    if (typeof value === 'string')
        return value.toLowerCase() === CHECKBOX_DEFAULT_TRUE_VALUE ? CHECKBOX_DEFAULT_TRUE_VALUE : CHECKBOX_DEFAULT_FALSE_VALUE;
    return CHECKBOX_DEFAULT_FALSE_VALUE;
};
const parseCheckboxSelectValue = (value) => value === CHECKBOX_DEFAULT_TRUE_VALUE;
const normalizeSelectDefaultValue = (inputVar) => {
    if (inputVar.type === types_2.InputVarType.select && inputVar.default === '')
        return { ...inputVar, default: undefined };
    return inputVar;
};
const ConfigModal = ({ isCreate, payload, isShow, onClose, onConfirm, supportFile, }) => {
    const { modelConfig } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [tempPayload, setTempPayload] = (0, react_1.useState)(() => normalizeSelectDefaultValue(payload || (0, var_1.getNewVarInWorkflow)('')));
    const { type, label, variable, options, max_length } = tempPayload;
    const modalRef = (0, react_1.useRef)(null);
    const appDetail = (0, store_1.useStore)(state => state.appDetail);
    const isBasicApp = appDetail?.mode !== app_1.AppModeEnum.ADVANCED_CHAT && appDetail?.mode !== app_1.AppModeEnum.WORKFLOW;
    const jsonSchemaStr = (0, react_1.useMemo)(() => {
        const isJsonObject = type === types_2.InputVarType.jsonObject;
        if (!isJsonObject || !tempPayload.json_schema)
            return '';
        try {
            return tempPayload.json_schema;
        }
        catch {
            return '';
        }
    }, [tempPayload.json_schema]);
    (0, react_1.useEffect)(() => {
        // To fix the first input element auto focus, then directly close modal will raise error
        if (isShow)
            modalRef.current?.focus();
    }, [isShow]);
    const isStringInput = type === types_2.InputVarType.textInput || type === types_2.InputVarType.paragraph;
    const checkVariableName = (0, react_1.useCallback)((value, canBeEmpty) => {
        const { isValid, errorMessageKey } = (0, var_1.checkKeys)([value], canBeEmpty);
        if (!isValid) {
            toast_1.default.notify({
                type: 'error',
                message: t(`varKeyError.${errorMessageKey}`, { ns: 'appDebug', key: t('variableConfig.varName', { ns: 'appDebug' }) }),
            });
            return false;
        }
        return true;
    }, [t]);
    const handlePayloadChange = (0, react_1.useCallback)((key) => {
        return (value) => {
            setTempPayload((prev) => {
                const newPayload = {
                    ...prev,
                    [key]: value,
                };
                // Clear default value if modified options no longer include current default
                if (key === 'options' && prev.default) {
                    const optionsArray = Array.isArray(value) ? value : [];
                    if (!optionsArray.includes(prev.default))
                        newPayload.default = undefined;
                }
                return newPayload;
            });
        };
    }, []);
    const handleJSONSchemaChange = (0, react_1.useCallback)((value) => {
        const isEmpty = value == null || value.trim() === '';
        if (isEmpty) {
            handlePayloadChange('json_schema')(undefined);
            return null;
        }
        try {
            const v = JSON.parse(value);
            handlePayloadChange('json_schema')(JSON.stringify(v, null, 2));
        }
        catch {
            return null;
        }
    }, [handlePayloadChange]);
    const selectOptions = [
        {
            name: t('variableConfig.text-input', { ns: 'appDebug' }),
            value: types_2.InputVarType.textInput,
        },
        {
            name: t('variableConfig.paragraph', { ns: 'appDebug' }),
            value: types_2.InputVarType.paragraph,
        },
        {
            name: t('variableConfig.select', { ns: 'appDebug' }),
            value: types_2.InputVarType.select,
        },
        {
            name: t('variableConfig.number', { ns: 'appDebug' }),
            value: types_2.InputVarType.number,
        },
        {
            name: t('variableConfig.checkbox', { ns: 'appDebug' }),
            value: types_2.InputVarType.checkbox,
        },
        ...(supportFile
            ? [
                {
                    name: t('variableConfig.single-file', { ns: 'appDebug' }),
                    value: types_2.InputVarType.singleFile,
                },
                {
                    name: t('variableConfig.multi-files', { ns: 'appDebug' }),
                    value: types_2.InputVarType.multiFiles,
                },
            ]
            : []),
        ...((!isBasicApp)
            ? [{
                    name: t('variableConfig.json', { ns: 'appDebug' }),
                    value: types_2.InputVarType.jsonObject,
                }]
            : []),
    ];
    const handleTypeChange = (0, react_1.useCallback)((item) => {
        const type = item.value;
        const newPayload = (0, immer_1.produce)(tempPayload, (draft) => {
            draft.type = type;
            if (type === types_2.InputVarType.select)
                draft.default = undefined;
            if ([types_2.InputVarType.singleFile, types_2.InputVarType.multiFiles].includes(type)) {
                (Object.keys(constants_1.DEFAULT_FILE_UPLOAD_SETTING)).forEach((key) => {
                    if (key !== 'max_length')
                        draft[key] = constants_1.DEFAULT_FILE_UPLOAD_SETTING[key];
                });
                if (type === types_2.InputVarType.multiFiles)
                    draft.max_length = constants_1.DEFAULT_FILE_UPLOAD_SETTING.max_length;
            }
            if (type === types_2.InputVarType.paragraph)
                draft.max_length = config_1.DEFAULT_VALUE_MAX_LEN;
        });
        setTempPayload(newPayload);
    }, [tempPayload]);
    const handleVarKeyBlur = (0, react_1.useCallback)((e) => {
        const varName = e.target.value;
        if (!checkVariableName(varName, true) || tempPayload.label)
            return;
        setTempPayload((prev) => {
            return {
                ...prev,
                label: varName,
            };
        });
    }, [checkVariableName, tempPayload.label]);
    const handleVarNameChange = (0, react_1.useCallback)((e) => {
        (0, var_1.replaceSpaceWithUnderscoreInVarNameInput)(e.target);
        const value = e.target.value;
        const { isValid, errorKey, errorMessageKey } = (0, var_1.checkKeys)([value], true);
        if (!isValid) {
            toast_1.default.notify({
                type: 'error',
                message: t(`varKeyError.${errorMessageKey}`, { ns: 'appDebug', key: errorKey }),
            });
            return;
        }
        handlePayloadChange('variable')(e.target.value);
    }, [handlePayloadChange, t]);
    const checkboxDefaultSelectValue = (0, react_1.useMemo)(() => getCheckboxDefaultSelectValue(tempPayload.default), [tempPayload.default]);
    const isJsonSchemaEmpty = (value) => {
        if (value === null || value === undefined) {
            return true;
        }
        if (typeof value !== 'string') {
            return false;
        }
        const trimmed = value.trim();
        return trimmed === '';
    };
    const handleConfirm = () => {
        const jsonSchemaValue = tempPayload.json_schema;
        const isSchemaEmpty = isJsonSchemaEmpty(jsonSchemaValue);
        const normalizedJsonSchema = isSchemaEmpty ? undefined : jsonSchemaValue;
        // if the input type is jsonObject and the schema is empty as determined by `isJsonSchemaEmpty`,
        // remove the `json_schema` field from the payload by setting its value to `undefined`.
        const payloadToSave = tempPayload.type === types_2.InputVarType.jsonObject && isSchemaEmpty
            ? { ...tempPayload, json_schema: undefined }
            : tempPayload;
        const moreInfo = tempPayload.variable === payload?.variable
            ? undefined
            : {
                type: types_2.ChangeType.changeVarName,
                payload: { beforeKey: payload?.variable || '', afterKey: tempPayload.variable },
            };
        const isVariableNameValid = checkVariableName(tempPayload.variable);
        if (!isVariableNameValid)
            return;
        if (!tempPayload.label) {
            toast_1.default.notify({ type: 'error', message: t('variableConfig.errorMsg.labelNameRequired', { ns: 'appDebug' }) });
            return;
        }
        if (isStringInput || type === types_2.InputVarType.number) {
            onConfirm(payloadToSave, moreInfo);
        }
        else if (type === types_2.InputVarType.select) {
            if (options?.length === 0) {
                toast_1.default.notify({ type: 'error', message: t('variableConfig.errorMsg.atLeastOneOption', { ns: 'appDebug' }) });
                return;
            }
            const obj = {};
            let hasRepeatedItem = false;
            options?.forEach((o) => {
                if (obj[o]) {
                    hasRepeatedItem = true;
                    return;
                }
                obj[o] = true;
            });
            if (hasRepeatedItem) {
                toast_1.default.notify({ type: 'error', message: t('variableConfig.errorMsg.optionRepeat', { ns: 'appDebug' }) });
                return;
            }
            onConfirm(payloadToSave, moreInfo);
        }
        else if ([types_2.InputVarType.singleFile, types_2.InputVarType.multiFiles].includes(type)) {
            if (tempPayload.allowed_file_types?.length === 0) {
                const errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('variableConfig.file.supportFileTypes', { ns: 'appDebug' }) });
                toast_1.default.notify({ type: 'error', message: errorMessages });
                return;
            }
            if (tempPayload.allowed_file_types?.includes(types_2.SupportUploadFileTypes.custom) && !tempPayload.allowed_file_extensions?.length) {
                const errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('variableConfig.file.custom.name', { ns: 'appDebug' }) });
                toast_1.default.notify({ type: 'error', message: errorMessages });
                return;
            }
            onConfirm(payloadToSave, moreInfo);
        }
        else if (type === types_2.InputVarType.jsonObject) {
            if (!isSchemaEmpty && typeof normalizedJsonSchema === 'string') {
                try {
                    const schema = JSON.parse(normalizedJsonSchema);
                    if (schema?.type !== 'object') {
                        toast_1.default.notify({ type: 'error', message: t('variableConfig.errorMsg.jsonSchemaMustBeObject', { ns: 'appDebug' }) });
                        return;
                    }
                }
                catch {
                    toast_1.default.notify({ type: 'error', message: t('variableConfig.errorMsg.jsonSchemaInvalid', { ns: 'appDebug' }) });
                    return;
                }
            }
            onConfirm(payloadToSave, moreInfo);
        }
        else {
            onConfirm(payloadToSave, moreInfo);
        }
    };
    return (<modal_1.default title={t(`variableConfig.${isCreate ? 'addModalTitle' : 'editModalTitle'}`, { ns: 'appDebug' })} isShow={isShow} onClose={onClose}>
      <div className="mb-8" ref={modalRef} tabIndex={-1}>
        <div className="space-y-2">
          <field_1.default title={t('variableConfig.fieldType', { ns: 'appDebug' })}>
            <type_select_1.default value={type} items={selectOptions} onSelect={handleTypeChange}/>
          </field_1.default>

          <field_1.default title={t('variableConfig.varName', { ns: 'appDebug' })}>
            <input_1.default value={variable} onChange={handleVarNameChange} onBlur={handleVarKeyBlur} placeholder={t('variableConfig.inputPlaceholder', { ns: 'appDebug' })}/>
          </field_1.default>
          <field_1.default title={t('variableConfig.labelName', { ns: 'appDebug' })}>
            <input_1.default value={label} onChange={e => handlePayloadChange('label')(e.target.value)} placeholder={t('variableConfig.inputPlaceholder', { ns: 'appDebug' })}/>
          </field_1.default>

          {isStringInput && (<field_1.default title={t('variableConfig.maxLength', { ns: 'appDebug' })}>
              <config_string_1.default maxLength={type === types_2.InputVarType.textInput ? TEXT_MAX_LENGTH : Infinity} modelId={modelConfig.model_id} value={max_length} onChange={handlePayloadChange('max_length')}/>
            </field_1.default>)}

          {/* Default value for text input */}
          {type === types_2.InputVarType.textInput && (<field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
              <input_1.default value={tempPayload.default || ''} onChange={e => handlePayloadChange('default')(e.target.value || undefined)} placeholder={t('variableConfig.inputPlaceholder', { ns: 'appDebug' })}/>
            </field_1.default>)}

          {/* Default value for paragraph */}
          {type === types_2.InputVarType.paragraph && (<field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
              <textarea_1.default value={String(tempPayload.default ?? '')} onChange={e => handlePayloadChange('default')(e.target.value || undefined)} placeholder={t('variableConfig.inputPlaceholder', { ns: 'appDebug' })}/>
            </field_1.default>)}

          {/* Default value for number input */}
          {type === types_2.InputVarType.number && (<field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
              <input_1.default type="number" value={tempPayload.default || ''} onChange={e => handlePayloadChange('default')(e.target.value || undefined)} placeholder={t('variableConfig.inputPlaceholder', { ns: 'appDebug' })}/>
            </field_1.default>)}

          {type === types_2.InputVarType.checkbox && (<field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
              <select_1.SimpleSelect className="w-full" optionWrapClassName="max-h-[140px] overflow-y-auto" items={[
                { value: CHECKBOX_DEFAULT_TRUE_VALUE, name: t('variableConfig.startChecked', { ns: 'appDebug' }) },
                { value: CHECKBOX_DEFAULT_FALSE_VALUE, name: t('variableConfig.noDefaultSelected', { ns: 'appDebug' }) },
            ]} defaultValue={checkboxDefaultSelectValue} onSelect={item => handlePayloadChange('default')(parseCheckboxSelectValue(String(item.value)))} placeholder={t('variableConfig.selectDefaultValue', { ns: 'appDebug' })} allowSearch={false}/>
            </field_1.default>)}

          {type === types_2.InputVarType.select && (<>
              <field_1.default title={t('variableConfig.options', { ns: 'appDebug' })}>
                <config_select_1.default options={options || []} onChange={handlePayloadChange('options')}/>
              </field_1.default>
              {options && options.length > 0 && (<field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
                  <select_1.SimpleSelect key={`default-select-${options.join('-')}`} className="w-full" optionWrapClassName="max-h-[140px] overflow-y-auto" items={[
                    { value: '', name: t('variableConfig.noDefaultValue', { ns: 'appDebug' }) },
                    ...options.filter(opt => opt.trim() !== '').map(option => ({
                        value: option,
                        name: option,
                    })),
                ]} defaultValue={tempPayload.default || ''} onSelect={item => handlePayloadChange('default')(item.value === '' ? undefined : item.value)} placeholder={t('variableConfig.selectDefaultValue', { ns: 'appDebug' })} allowSearch={false}/>
                </field_1.default>)}
            </>)}

          {[types_2.InputVarType.singleFile, types_2.InputVarType.multiFiles].includes(type) && (<>
              <file_upload_setting_1.default payload={tempPayload} onChange={(p) => setTempPayload(p)} isMultiple={type === types_2.InputVarType.multiFiles}/>
              <field_1.default title={t('variableConfig.defaultValue', { ns: 'appDebug' })}>
                <file_uploader_1.FileUploaderInAttachmentWrapper value={(type === types_2.InputVarType.singleFile ? (tempPayload.default ? [tempPayload.default] : []) : (tempPayload.default || []))} onChange={(files) => {
                if (type === types_2.InputVarType.singleFile)
                    handlePayloadChange('default')(files?.[0] || undefined);
                else
                    handlePayloadChange('default')(files || undefined);
            }} fileConfig={{
                allowed_file_types: tempPayload.allowed_file_types || [types_2.SupportUploadFileTypes.document],
                allowed_file_extensions: tempPayload.allowed_file_extensions || [],
                allowed_file_upload_methods: tempPayload.allowed_file_upload_methods || [app_1.TransferMethod.remote_url],
                number_limits: type === types_2.InputVarType.singleFile ? 1 : tempPayload.max_length || 5,
            }}/>
              </field_1.default>
            </>)}

          {type === types_2.InputVarType.jsonObject && (<field_1.default title={t('variableConfig.jsonSchema', { ns: 'appDebug' })} isOptional>
              <code_editor_1.default language={types_1.CodeLanguage.json} value={jsonSchemaStr} onChange={handleJSONSchemaChange} noWrapper className="bg h-[80px] overflow-y-auto rounded-[10px] bg-components-input-bg-normal p-1" placeholder={<div className="whitespace-pre">{config_2.jsonConfigPlaceHolder}</div>}/>
            </field_1.default>)}

          <div className="!mt-5 flex h-6 items-center space-x-2">
            <checkbox_1.default checked={tempPayload.required} disabled={tempPayload.hide} onCheck={() => handlePayloadChange('required')(!tempPayload.required)}/>
            <span className="system-sm-semibold text-text-secondary">{t('variableConfig.required', { ns: 'appDebug' })}</span>
          </div>

          <div className="!mt-5 flex h-6 items-center space-x-2">
            <checkbox_1.default checked={tempPayload.hide} disabled={tempPayload.required} onCheck={() => handlePayloadChange('hide')(!tempPayload.hide)}/>
            <span className="system-sm-semibold text-text-secondary">{t('variableConfig.hide', { ns: 'appDebug' })}</span>
          </div>
        </div>
      </div>
      <modal_foot_1.default onConfirm={handleConfirm} onCancel={onClose}/>
    </modal_1.default>);
};
exports.default = React.memo(ConfigModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFLWixpQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLGlDQUF5RTtBQUN6RSxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELHNEQUFvRTtBQUNwRSw2REFBcUQ7QUFDckQsdUVBQXFGO0FBQ3JGLHVEQUErQztBQUMvQyx1REFBK0M7QUFDL0MseURBQTJEO0FBQzNELDZEQUFxRDtBQUNyRCx1REFBK0M7QUFDL0MsbUVBQWlGO0FBQ2pGLHFHQUE0RjtBQUM1Riw4R0FBb0c7QUFDcEcsc0VBQXlFO0FBQ3pFLDJEQUFrRztBQUNsRyxxQ0FBZ0Q7QUFDaEQsdUVBQXlEO0FBQ3pELHFDQUF5RDtBQUN6RCxxQ0FBc0c7QUFDdEcsb0RBQTJDO0FBQzNDLG9EQUEyQztBQUMzQyw4Q0FBcUM7QUFDckMscUNBQWdEO0FBQ2hELG1DQUEyQjtBQUMzQiwrQ0FBd0M7QUFFeEMsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFBO0FBQzNCLE1BQU0sMkJBQTJCLEdBQUcsTUFBTSxDQUFBO0FBQzFDLE1BQU0sNEJBQTRCLEdBQUcsT0FBTyxDQUFBO0FBRTVDLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxLQUEwQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxPQUFPLEtBQUssS0FBSyxTQUFTO1FBQzVCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUE7SUFDM0UsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO1FBQzNCLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLDJCQUEyQixDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUE7SUFDekgsT0FBTyw0QkFBNEIsQ0FBQTtBQUNyQyxDQUFDLENBQUE7QUFFRCxNQUFNLHdCQUF3QixHQUFHLENBQUMs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QUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgQ2hhbmdlRXZlbnQsIEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IEl0ZW0gYXMgU2VsZWN0SXRlbSB9IGZyb20gJy4vdHlwZS1zZWxlY3QnXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmlsZS11cGxvYWRlci90eXBlcydcbmltcG9ydCB0eXBlIHsgSW5wdXRWYXIsIE1vcmVJbmZvLCBVcGxvYWRGaWxlU2V0dGluZyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUNvbnRleHQgfSBmcm9tICd1c2UtY29udGV4dC1zZWxlY3RvcidcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoZWNrYm94J1xuaW1wb3J0IHsgRmlsZVVwbG9hZGVySW5BdHRhY2htZW50V3JhcHBlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9maWxlLXVwbG9hZGVyJ1xuaW1wb3J0IElucHV0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pbnB1dCdcbmltcG9ydCBNb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwnXG5pbXBvcnQgeyBTaW1wbGVTZWxlY3QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0J1xuaW1wb3J0IFRleHRhcmVhIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90ZXh0YXJlYSdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBERUZBVUxUX0ZJTEVfVVBMT0FEX1NFVFRJTkcgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnN0YW50cydcbmltcG9ydCBDb2RlRWRpdG9yIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvY29tcG9uZW50cy9lZGl0b3IvY29kZS1lZGl0b3InXG5pbXBvcnQgRmlsZVVwbG9hZFNldHRpbmcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2ZpbGUtdXBsb2FkLXNldHRpbmcnXG5pbXBvcnQgeyBDb2RlTGFuZ3VhZ2UgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2NvZGUvdHlwZXMnXG5pbXBvcnQgeyBDaGFuZ2VUeXBlLCBJbnB1dFZhclR5cGUsIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgREVGQVVMVF9WQUxVRV9NQVhfTEVOIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgQ29uZmlnQ29udGV4dCBmcm9tICdAL2NvbnRleHQvZGVidWctY29uZmlndXJhdGlvbidcbmltcG9ydCB7IEFwcE1vZGVFbnVtLCBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgY2hlY2tLZXlzLCBnZXROZXdWYXJJbldvcmtmbG93LCByZXBsYWNlU3BhY2VXaXRoVW5kZXJzY29yZUluVmFyTmFtZUlucHV0IH0gZnJvbSAnQC91dGlscy92YXInXG5pbXBvcnQgQ29uZmlnU2VsZWN0IGZyb20gJy4uL2NvbmZpZy1zZWxlY3QnXG5pbXBvcnQgQ29uZmlnU3RyaW5nIGZyb20gJy4uL2NvbmZpZy1zdHJpbmcnXG5pbXBvcnQgTW9kYWxGb290IGZyb20gJy4uL21vZGFsLWZvb3QnXG5pbXBvcnQgeyBqc29uQ29uZmlnUGxhY2VIb2xkZXIgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCBGaWVsZCBmcm9tICcuL2ZpZWxkJ1xuaW1wb3J0IFR5cGVTZWxlY3RvciBmcm9tICcuL3R5cGUtc2VsZWN0J1xuXG5jb25zdCBURVhUX01BWF9MRU5HVEggPSAyNTZcbmNvbnN0IENIRUNLQk9YX0RFRkFVTFRfVFJVRV9WQUxVRSA9ICd0cnVlJ1xuY29uc3QgQ0hFQ0tCT1hfREVGQVVMVF9GQUxTRV9WQUxVRSA9ICdmYWxzZSdcblxuY29uc3QgZ2V0Q2hlY2tib3hEZWZhdWx0U2VsZWN0VmFsdWUgPSAodmFsdWU6IElucHV0VmFyWydkZWZhdWx0J10pID0+IHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHJldHVybiB2YWx1ZSA/IENIRUNLQk9YX0RFRkFVTFRfVFJVRV9WQUxVRSA6IENIRUNLQk9YX0RFRkFVTFRfRkFMU0VfVkFMVUVcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IENIRUNLQk9YX0RFRkFVTFRfVFJVRV9WQUxVRSA/IENIRUNLQk9YX0RFRkFVTFRfVFJVRV9WQUxVRSA6IENIRUNLQk9YX0RFRkFVTFRfRkFMU0VfVkFMVUVcbiAgcmV0dXJuIENIRUNLQk9YX0RFRkFVTFRfRkFMU0VfVkFMVUVcbn1cblxuY29uc3QgcGFyc2VDaGVja2JveFNlbGVjdFZhbHVlID0gKHZhbHVlOiBzdHJpbmcpID0+XG4gIHZhbHVlID09PSBDSEVDS0JPWF9ERUZBVUxUX1RSVUVfVkFMVUVcblxuY29uc3Qgbm9ybWFsaXplU2VsZWN0RGVmYXVsdFZhbHVlID0gKGlucHV0VmFyOiBJbnB1dFZhcikgPT4ge1xuICBpZiAoaW5wdXRWYXIudHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNlbGVjdCAmJiBpbnB1dFZhci5kZWZhdWx0ID09PSAnJylcbiAgICByZXR1cm4geyAuLi5pbnB1dFZhciwgZGVmYXVsdDogdW5kZWZpbmVkIH1cbiAgcmV0dXJuIGlucHV0VmFyXG59XG5cbmV4cG9ydCB0eXBlIElDb25maWdNb2RhbFByb3BzID0ge1xuICBpc0NyZWF0ZT86IGJvb2xlYW5cbiAgcGF5bG9hZD86IElucHV0VmFyXG4gIGlzU2hvdzogYm9vbGVhblxuICB2YXJLZXlzPzogc3RyaW5nW11cbiAgb25DbG9zZTogKCkgPT4gdm9pZFxuICBvbkNvbmZpcm06IChuZXdWYWx1ZTogSW5wdXRWYXIsIG1vcmVJbmZvPzogTW9yZUluZm8pID0+IHZvaWRcbiAgc3VwcG9ydEZpbGU/OiBib29sZWFuXG59XG5cbmNvbnN0IENvbmZpZ01vZGFsOiBGQzxJQ29uZmlnTW9kYWxQcm9wcz4gPSAoe1xuICBpc0NyZWF0ZSxcbiAgcGF5bG9hZCxcbiAgaXNTaG93LFxuICBvbkNsb3NlLFxuICBvbkNvbmZpcm0sXG4gIHN1cHBvcnRGaWxlLFxufSkgPT4ge1xuICBjb25zdCB7IG1vZGVsQ29uZmlnIH0gPSB1c2VDb250ZXh0KENvbmZpZ0NvbnRleHQpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBbdGVtcFBheWxvYWQsIHNldFRlbXBQYXlsb2FkXSA9IHVzZVN0YXRlPElucHV0VmFyPigoKSA9PiBub3JtYWxpemVTZWxlY3REZWZhdWx0VmFsdWUocGF5bG9hZCB8fCBnZXROZXdWYXJJbldvcmtmbG93KCcnKSBhcyBhbnkpKVxuICBjb25zdCB7IHR5cGUsIGxhYmVsLCB2YXJpYWJsZSwgb3B0aW9ucywgbWF4X2xlbmd0aCB9ID0gdGVtcFBheWxvYWRcbiAgY29uc3QgbW9kYWxSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHN0YXRlID0+IHN0YXRlLmFwcERldGFpbClcbiAgY29uc3QgaXNCYXNpY0FwcCA9IGFwcERldGFpbD8ubW9kZSAhPT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCAmJiBhcHBEZXRhaWw/Lm1vZGUgIT09IEFwcE1vZGVFbnVtLldPUktGTE9XXG4gIGNvbnN0IGpzb25TY2hlbWFTdHIgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBpc0pzb25PYmplY3QgPSB0eXBlID09PSBJbnB1dFZhclR5cGUuanNvbk9iamVjdFxuICAgIGlmICghaXNKc29uT2JqZWN0IHx8ICF0ZW1wUGF5bG9hZC5qc29uX3NjaGVtYSlcbiAgICAgIHJldHVybiAnJ1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGVtcFBheWxvYWQuanNvbl9zY2hlbWFcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9LCBbdGVtcFBheWxvYWQuanNvbl9zY2hlbWFdKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFRvIGZpeCB0aGUgZmlyc3QgaW5wdXQgZWxlbWVudCBhdXRvIGZvY3VzLCB0aGVuIGRpcmVjdGx5IGNsb3NlIG1vZGFsIHdpbGwgcmFpc2UgZXJyb3JcbiAgICBpZiAoaXNTaG93KVxuICAgICAgbW9kYWxSZWYuY3VycmVudD8uZm9jdXMoKVxuICB9LCBbaXNTaG93XSlcblxuICBjb25zdCBpc1N0cmluZ0lucHV0ID0gdHlwZSA9PT0gSW5wdXRWYXJUeXBlLnRleHRJbnB1dCB8fCB0eXBlID09PSBJbnB1dFZhclR5cGUucGFyYWdyYXBoXG4gIGNvbnN0IGNoZWNrVmFyaWFibGVOYW1lID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBzdHJpbmcsIGNhbkJlRW1wdHk/OiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgeyBpc1ZhbGlkLCBlcnJvck1lc3NhZ2VLZXkgfSA9IGNoZWNrS2V5cyhbdmFsdWVdLCBjYW5CZUVtcHR5KVxuICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogdChgdmFyS2V5RXJyb3IuJHtlcnJvck1lc3NhZ2VLZXl9YCwgeyBuczogJ2FwcERlYnVnJywga2V5OiB0KCd2YXJpYWJsZUNvbmZpZy52YXJOYW1lJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KSxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW3RdKVxuICBjb25zdCBoYW5kbGVQYXlsb2FkQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGtleTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuICh2YWx1ZTogYW55KSA9PiB7XG4gICAgICBzZXRUZW1wUGF5bG9hZCgocHJldikgPT4ge1xuICAgICAgICBjb25zdCBuZXdQYXlsb2FkID0ge1xuICAgICAgICAgIC4uLnByZXYsXG4gICAgICAgICAgW2tleV06IHZhbHVlLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYXIgZGVmYXVsdCB2YWx1ZSBpZiBtb2RpZmllZCBvcHRpb25zIG5vIGxvbmdlciBpbmNsdWRlIGN1cnJlbnQgZGVmYXVsdFxuICAgICAgICBpZiAoa2V5ID09PSAnb3B0aW9ucycgJiYgcHJldi5kZWZhdWx0KSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uc0FycmF5ID0gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFtdXG4gICAgICAgICAgaWYgKCFvcHRpb25zQXJyYXkuaW5jbHVkZXMocHJldi5kZWZhdWx0KSlcbiAgICAgICAgICAgIG5ld1BheWxvYWQuZGVmYXVsdCA9IHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld1BheWxvYWRcbiAgICAgIH0pXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVKU09OU2NoZW1hQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBpc0VtcHR5ID0gdmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS50cmltKCkgPT09ICcnXG4gICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgIGhhbmRsZVBheWxvYWRDaGFuZ2UoJ2pzb25fc2NoZW1hJykodW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHYgPSBKU09OLnBhcnNlKHZhbHVlKVxuICAgICAgaGFuZGxlUGF5bG9hZENoYW5nZSgnanNvbl9zY2hlbWEnKShKU09OLnN0cmluZ2lmeSh2LCBudWxsLCAyKSlcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH0sIFtoYW5kbGVQYXlsb2FkQ2hhbmdlXSlcblxuICBjb25zdCBzZWxlY3RPcHRpb25zOiBTZWxlY3RJdGVtW10gPSBbXG4gICAge1xuICAgICAgbmFtZTogdCgndmFyaWFibGVDb25maWcudGV4dC1pbnB1dCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YWx1ZTogSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLnBhcmFncmFwaCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YWx1ZTogSW5wdXRWYXJUeXBlLnBhcmFncmFwaCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLnNlbGVjdCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YWx1ZTogSW5wdXRWYXJUeXBlLnNlbGVjdCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLm51bWJlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICB2YWx1ZTogSW5wdXRWYXJUeXBlLm51bWJlcixcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLmNoZWNrYm94JywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgIHZhbHVlOiBJbnB1dFZhclR5cGUuY2hlY2tib3gsXG4gICAgfSxcbiAgICAuLi4oc3VwcG9ydEZpbGVcbiAgICAgID8gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLnNpbmdsZS1maWxlJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgICAgIHZhbHVlOiBJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLm11bHRpLWZpbGVzJywgeyBuczogJ2FwcERlYnVnJyB9KSxcbiAgICAgICAgICAgIHZhbHVlOiBJbnB1dFZhclR5cGUubXVsdGlGaWxlcyxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG4gICAgICA6IFtdKSxcbiAgICAuLi4oKCFpc0Jhc2ljQXBwKVxuICAgICAgPyBbe1xuICAgICAgICAgIG5hbWU6IHQoJ3ZhcmlhYmxlQ29uZmlnLmpzb24nLCB7IG5zOiAnYXBwRGVidWcnIH0pLFxuICAgICAgICAgIHZhbHVlOiBJbnB1dFZhclR5cGUuanNvbk9iamVjdCxcbiAgICAgICAgfV1cbiAgICAgIDogW10pLFxuICBdXG5cbiAgY29uc3QgaGFuZGxlVHlwZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChpdGVtOiBTZWxlY3RJdGVtKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IGl0ZW0udmFsdWUgYXMgSW5wdXRWYXJUeXBlXG5cbiAgICBjb25zdCBuZXdQYXlsb2FkID0gcHJvZHVjZSh0ZW1wUGF5bG9hZCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC50eXBlID0gdHlwZVxuICAgICAgaWYgKHR5cGUgPT09IElucHV0VmFyVHlwZS5zZWxlY3QpXG4gICAgICAgIGRyYWZ0LmRlZmF1bHQgPSB1bmRlZmluZWRcbiAgICAgIGlmIChbSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUsIElucHV0VmFyVHlwZS5tdWx0aUZpbGVzXS5pbmNsdWRlcyh0eXBlKSkge1xuICAgICAgICAoT2JqZWN0LmtleXMoREVGQVVMVF9GSUxFX1VQTE9BRF9TRVRUSU5HKSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGtleSAhPT0gJ21heF9sZW5ndGgnKVxuICAgICAgICAgICAgKGRyYWZ0IGFzIGFueSlba2V5XSA9IChERUZBVUxUX0ZJTEVfVVBMT0FEX1NFVFRJTkcgYXMgYW55KVtrZXldXG4gICAgICAgIH0pXG4gICAgICAgIGlmICh0eXBlID09PSBJbnB1dFZhclR5cGUubXVsdGlGaWxlcylcbiAgICAgICAgICBkcmFmdC5tYXhfbGVuZ3RoID0gREVGQVVMVF9GSUxFX1VQTE9BRF9TRVRUSU5HLm1heF9sZW5ndGhcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSBJbnB1dFZhclR5cGUucGFyYWdyYXBoKVxuICAgICAgICBkcmFmdC5tYXhfbGVuZ3RoID0gREVGQVVMVF9WQUxVRV9NQVhfTEVOXG4gICAgfSlcbiAgICBzZXRUZW1wUGF5bG9hZChuZXdQYXlsb2FkKVxuICB9LCBbdGVtcFBheWxvYWRdKVxuXG4gIGNvbnN0IGhhbmRsZVZhcktleUJsdXIgPSB1c2VDYWxsYmFjaygoZTogYW55KSA9PiB7XG4gICAgY29uc3QgdmFyTmFtZSA9IGUudGFyZ2V0LnZhbHVlXG4gICAgaWYgKCFjaGVja1ZhcmlhYmxlTmFtZSh2YXJOYW1lLCB0cnVlKSB8fCB0ZW1wUGF5bG9hZC5sYWJlbClcbiAgICAgIHJldHVyblxuXG4gICAgc2V0VGVtcFBheWxvYWQoKHByZXYpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnByZXYsXG4gICAgICAgIGxhYmVsOiB2YXJOYW1lLFxuICAgICAgfVxuICAgIH0pXG4gIH0sIFtjaGVja1ZhcmlhYmxlTmFtZSwgdGVtcFBheWxvYWQubGFiZWxdKVxuXG4gIGNvbnN0IGhhbmRsZVZhck5hbWVDaGFuZ2UgPSB1c2VDYWxsYmFjaygoZTogQ2hhbmdlRXZlbnQ8YW55PikgPT4ge1xuICAgIHJlcGxhY2VTcGFjZVdpdGhVbmRlcnNjb3JlSW5WYXJOYW1lSW5wdXQoZS50YXJnZXQpXG4gICAgY29uc3QgdmFsdWUgPSBlLnRhcmdldC52YWx1ZVxuICAgIGNvbnN0IHsgaXNWYWxpZCwgZXJyb3JLZXksIGVycm9yTWVzc2FnZUtleSB9ID0gY2hlY2tLZXlzKFt2YWx1ZV0sIHRydWUpXG4gICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiB0KGB2YXJLZXlFcnJvci4ke2Vycm9yTWVzc2FnZUtleX1gLCB7IG5zOiAnYXBwRGVidWcnLCBrZXk6IGVycm9yS2V5IH0pLFxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVQYXlsb2FkQ2hhbmdlKCd2YXJpYWJsZScpKGUudGFyZ2V0LnZhbHVlKVxuICB9LCBbaGFuZGxlUGF5bG9hZENoYW5nZSwgdF0pXG5cbiAgY29uc3QgY2hlY2tib3hEZWZhdWx0U2VsZWN0VmFsdWUgPSB1c2VNZW1vKCgpID0+IGdldENoZWNrYm94RGVmYXVsdFNlbGVjdFZhbHVlKHRlbXBQYXlsb2FkLmRlZmF1bHQpLCBbdGVtcFBheWxvYWQuZGVmYXVsdF0pXG5cbiAgY29uc3QgaXNKc29uU2NoZW1hRW1wdHkgPSAodmFsdWU6IElucHV0VmFyWydqc29uX3NjaGVtYSddKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKVxuICAgIHJldHVybiB0cmltbWVkID09PSAnJ1xuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybSA9ICgpID0+IHtcbiAgICBjb25zdCBqc29uU2NoZW1hVmFsdWUgPSB0ZW1wUGF5bG9hZC5qc29uX3NjaGVtYVxuICAgIGNvbnN0IGlzU2NoZW1hRW1wdHkgPSBpc0pzb25TY2hlbWFFbXB0eShqc29uU2NoZW1hVmFsdWUpXG4gICAgY29uc3Qgbm9ybWFsaXplZEpzb25TY2hlbWEgPSBpc1NjaGVtYUVtcHR5ID8gdW5kZWZpbmVkIDoganNvblNjaGVtYVZhbHVlXG5cbiAgICAvLyBpZiB0aGUgaW5wdXQgdHlwZSBpcyBqc29uT2JqZWN0IGFuZCB0aGUgc2NoZW1hIGlzIGVtcHR5IGFzIGRldGVybWluZWQgYnkgYGlzSnNvblNjaGVtYUVtcHR5YCxcbiAgICAvLyByZW1vdmUgdGhlIGBqc29uX3NjaGVtYWAgZmllbGQgZnJvbSB0aGUgcGF5bG9hZCBieSBzZXR0aW5nIGl0cyB2YWx1ZSB0byBgdW5kZWZpbmVkYC5cbiAgICBjb25zdCBwYXlsb2FkVG9TYXZlID0gdGVtcFBheWxvYWQudHlwZSA9PT0gSW5wdXRWYXJUeXBlLmpzb25PYmplY3QgJiYgaXNTY2hlbWFFbXB0eVxuICAgICAgPyB7IC4uLnRlbXBQYXlsb2FkLCBqc29uX3NjaGVtYTogdW5kZWZpbmVkIH1cbiAgICAgIDogdGVtcFBheWxvYWRcblxuICAgIGNvbnN0IG1vcmVJbmZvID0gdGVtcFBheWxvYWQudmFyaWFibGUgPT09IHBheWxvYWQ/LnZhcmlhYmxlXG4gICAgICA/IHVuZGVmaW5lZFxuICAgICAgOiB7XG4gICAgICAgICAgdHlwZTogQ2hhbmdlVHlwZS5jaGFuZ2VWYXJOYW1lLFxuICAgICAgICAgIHBheWxvYWQ6IHsgYmVmb3JlS2V5OiBwYXlsb2FkPy52YXJpYWJsZSB8fCAnJywgYWZ0ZXJLZXk6IHRlbXBQYXlsb2FkLnZhcmlhYmxlIH0sXG4gICAgICAgIH1cblxuICAgIGNvbnN0IGlzVmFyaWFibGVOYW1lVmFsaWQgPSBjaGVja1ZhcmlhYmxlTmFtZSh0ZW1wUGF5bG9hZC52YXJpYWJsZSlcbiAgICBpZiAoIWlzVmFyaWFibGVOYW1lVmFsaWQpXG4gICAgICByZXR1cm5cblxuICAgIGlmICghdGVtcFBheWxvYWQubGFiZWwpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3ZhcmlhYmxlQ29uZmlnLmVycm9yTXNnLmxhYmVsTmFtZVJlcXVpcmVkJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChpc1N0cmluZ0lucHV0IHx8IHR5cGUgPT09IElucHV0VmFyVHlwZS5udW1iZXIpIHtcbiAgICAgIG9uQ29uZmlybShwYXlsb2FkVG9TYXZlLCBtb3JlSW5mbylcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNlbGVjdCkge1xuICAgICAgaWYgKG9wdGlvbnM/Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCd2YXJpYWJsZUNvbmZpZy5lcnJvck1zZy5hdExlYXN0T25lT3B0aW9uJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IG9iajogUmVjb3JkPHN0cmluZywgYm9vbGVhbj4gPSB7fVxuICAgICAgbGV0IGhhc1JlcGVhdGVkSXRlbSA9IGZhbHNlXG4gICAgICBvcHRpb25zPy5mb3JFYWNoKChvKSA9PiB7XG4gICAgICAgIGlmIChvYmpbb10pIHtcbiAgICAgICAgICBoYXNSZXBlYXRlZEl0ZW0gPSB0cnVlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgb2JqW29dID0gdHJ1ZVxuICAgICAgfSlcbiAgICAgIGlmIChoYXNSZXBlYXRlZEl0ZW0pIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgndmFyaWFibGVDb25maWcuZXJyb3JNc2cub3B0aW9uUmVwZWF0JywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIG9uQ29uZmlybShwYXlsb2FkVG9TYXZlLCBtb3JlSW5mbylcbiAgICB9XG4gICAgZWxzZSBpZiAoW0lucHV0VmFyVHlwZS5zaW5nbGVGaWxlLCBJbnB1dFZhclR5cGUubXVsdGlGaWxlc10uaW5jbHVkZXModHlwZSkpIHtcbiAgICAgIGlmICh0ZW1wUGF5bG9hZC5hbGxvd2VkX2ZpbGVfdHlwZXM/Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2VzID0gdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCd2YXJpYWJsZUNvbmZpZy5maWxlLnN1cHBvcnRGaWxlVHlwZXMnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZXMgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAodGVtcFBheWxvYWQuYWxsb3dlZF9maWxlX3R5cGVzPy5pbmNsdWRlcyhTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmN1c3RvbSkgJiYgIXRlbXBQYXlsb2FkLmFsbG93ZWRfZmlsZV9leHRlbnNpb25zPy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlcyA9IHQoJ2Vycm9yTXNnLmZpZWxkUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdCgndmFyaWFibGVDb25maWcuZmlsZS5jdXN0b20ubmFtZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogZXJyb3JNZXNzYWdlcyB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIG9uQ29uZmlybShwYXlsb2FkVG9TYXZlLCBtb3JlSW5mbylcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gSW5wdXRWYXJUeXBlLmpzb25PYmplY3QpIHtcbiAgICAgIGlmICghaXNTY2hlbWFFbXB0eSAmJiB0eXBlb2Ygbm9ybWFsaXplZEpzb25TY2hlbWEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgc2NoZW1hID0gSlNPTi5wYXJzZShub3JtYWxpemVkSnNvblNjaGVtYSlcbiAgICAgICAgICBpZiAoc2NoZW1hPy50eXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgndmFyaWFibGVDb25maWcuZXJyb3JNc2cuanNvblNjaGVtYU11c3RCZU9iamVjdCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgndmFyaWFibGVDb25maWcuZXJyb3JNc2cuanNvblNjaGVtYUludmFsaWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9uQ29uZmlybShwYXlsb2FkVG9TYXZlLCBtb3JlSW5mbylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBvbkNvbmZpcm0ocGF5bG9hZFRvU2F2ZSwgbW9yZUluZm8pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8TW9kYWxcbiAgICAgIHRpdGxlPXt0KGB2YXJpYWJsZUNvbmZpZy4ke2lzQ3JlYXRlID8gJ2FkZE1vZGFsVGl0bGUnIDogJ2VkaXRNb2RhbFRpdGxlJ31gLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgaXNTaG93PXtpc1Nob3d9XG4gICAgICBvbkNsb3NlPXtvbkNsb3NlfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItOFwiIHJlZj17bW9kYWxSZWZ9IHRhYkluZGV4PXstMX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy5maWVsZFR5cGUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgIDxUeXBlU2VsZWN0b3IgdmFsdWU9e3R5cGV9IGl0ZW1zPXtzZWxlY3RPcHRpb25zfSBvblNlbGVjdD17aGFuZGxlVHlwZUNoYW5nZX0gLz5cbiAgICAgICAgICA8L0ZpZWxkPlxuXG4gICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy52YXJOYW1lJywgeyBuczogJ2FwcERlYnVnJyB9KX0+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgdmFsdWU9e3ZhcmlhYmxlfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlVmFyTmFtZUNoYW5nZX1cbiAgICAgICAgICAgICAgb25CbHVyPXtoYW5kbGVWYXJLZXlCbHVyfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgndmFyaWFibGVDb25maWcuaW5wdXRQbGFjZWhvbGRlcicsIHsgbnM6ICdhcHBEZWJ1ZycgfSkhfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgIDxGaWVsZCB0aXRsZT17dCgndmFyaWFibGVDb25maWcubGFiZWxOYW1lJywgeyBuczogJ2FwcERlYnVnJyB9KX0+XG4gICAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgICAgdmFsdWU9e2xhYmVsIGFzIHN0cmluZ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgnbGFiZWwnKShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCd2YXJpYWJsZUNvbmZpZy5pbnB1dFBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSF9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRmllbGQ+XG5cbiAgICAgICAgICB7aXNTdHJpbmdJbnB1dCAmJiAoXG4gICAgICAgICAgICA8RmllbGQgdGl0bGU9e3QoJ3ZhcmlhYmxlQ29uZmlnLm1heExlbmd0aCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PlxuICAgICAgICAgICAgICA8Q29uZmlnU3RyaW5nIG1heExlbmd0aD17dHlwZSA9PT0gSW5wdXRWYXJUeXBlLnRleHRJbnB1dCA/IFRFWFRfTUFYX0xFTkdUSCA6IEluZmluaXR5fSBtb2RlbElkPXttb2RlbENvbmZpZy5tb2RlbF9pZH0gdmFsdWU9e21heF9sZW5ndGh9IG9uQ2hhbmdlPXtoYW5kbGVQYXlsb2FkQ2hhbmdlKCdtYXhfbGVuZ3RoJyl9IC8+XG4gICAgICAgICAgICA8L0ZpZWxkPlxuXG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBEZWZhdWx0IHZhbHVlIGZvciB0ZXh0IGlucHV0ICovfVxuICAgICAgICAgIHt0eXBlID09PSBJbnB1dFZhclR5cGUudGV4dElucHV0ICYmIChcbiAgICAgICAgICAgIDxGaWVsZCB0aXRsZT17dCgndmFyaWFibGVDb25maWcuZGVmYXVsdFZhbHVlJywgeyBuczogJ2FwcERlYnVnJyB9KX0+XG4gICAgICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgICAgIHZhbHVlPXt0ZW1wUGF5bG9hZC5kZWZhdWx0IHx8ICcnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGhhbmRsZVBheWxvYWRDaGFuZ2UoJ2RlZmF1bHQnKShlLnRhcmdldC52YWx1ZSB8fCB1bmRlZmluZWQpfVxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCd2YXJpYWJsZUNvbmZpZy5pbnB1dFBsYWNlaG9sZGVyJywgeyBuczogJ2FwcERlYnVnJyB9KSF9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7LyogRGVmYXVsdCB2YWx1ZSBmb3IgcGFyYWdyYXBoICovfVxuICAgICAgICAgIHt0eXBlID09PSBJbnB1dFZhclR5cGUucGFyYWdyYXBoICYmIChcbiAgICAgICAgICAgIDxGaWVsZCB0aXRsZT17dCgndmFyaWFibGVDb25maWcuZGVmYXVsdFZhbHVlJywgeyBuczogJ2FwcERlYnVnJyB9KX0+XG4gICAgICAgICAgICAgIDxUZXh0YXJlYVxuICAgICAgICAgICAgICAgIHZhbHVlPXtTdHJpbmcodGVtcFBheWxvYWQuZGVmYXVsdCA/PyAnJyl9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgnZGVmYXVsdCcpKGUudGFyZ2V0LnZhbHVlIHx8IHVuZGVmaW5lZCl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ3ZhcmlhYmxlQ29uZmlnLmlucHV0UGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pIX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBEZWZhdWx0IHZhbHVlIGZvciBudW1iZXIgaW5wdXQgKi99XG4gICAgICAgICAge3R5cGUgPT09IElucHV0VmFyVHlwZS5udW1iZXIgJiYgKFxuICAgICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cIm51bWJlclwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3RlbXBQYXlsb2FkLmRlZmF1bHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgnZGVmYXVsdCcpKGUudGFyZ2V0LnZhbHVlIHx8IHVuZGVmaW5lZCl9XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ3ZhcmlhYmxlQ29uZmlnLmlucHV0UGxhY2Vob2xkZXInLCB7IG5zOiAnYXBwRGVidWcnIH0pIX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHt0eXBlID09PSBJbnB1dFZhclR5cGUuY2hlY2tib3ggJiYgKFxuICAgICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgICAgPFNpbXBsZVNlbGVjdFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbFwiXG4gICAgICAgICAgICAgICAgb3B0aW9uV3JhcENsYXNzTmFtZT1cIm1heC1oLVsxNDBweF0gb3ZlcmZsb3cteS1hdXRvXCJcbiAgICAgICAgICAgICAgICBpdGVtcz17W1xuICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogQ0hFQ0tCT1hfREVGQVVMVF9UUlVFX1ZBTFVFLCBuYW1lOiB0KCd2YXJpYWJsZUNvbmZpZy5zdGFydENoZWNrZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0sXG4gICAgICAgICAgICAgICAgICB7IHZhbHVlOiBDSEVDS0JPWF9ERUZBVUxUX0ZBTFNFX1ZBTFVFLCBuYW1lOiB0KCd2YXJpYWJsZUNvbmZpZy5ub0RlZmF1bHRTZWxlY3RlZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSxcbiAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17Y2hlY2tib3hEZWZhdWx0U2VsZWN0VmFsdWV9XG4gICAgICAgICAgICAgICAgb25TZWxlY3Q9e2l0ZW0gPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgnZGVmYXVsdCcpKHBhcnNlQ2hlY2tib3hTZWxlY3RWYWx1ZShTdHJpbmcoaXRlbS52YWx1ZSkpKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgndmFyaWFibGVDb25maWcuc2VsZWN0RGVmYXVsdFZhbHVlJywgeyBuczogJ2FwcERlYnVnJyB9KX1cbiAgICAgICAgICAgICAgICBhbGxvd1NlYXJjaD17ZmFsc2V9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7dHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNlbGVjdCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8RmllbGQgdGl0bGU9e3QoJ3ZhcmlhYmxlQ29uZmlnLm9wdGlvbnMnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgICAgICA8Q29uZmlnU2VsZWN0IG9wdGlvbnM9e29wdGlvbnMgfHwgW119IG9uQ2hhbmdlPXtoYW5kbGVQYXlsb2FkQ2hhbmdlKCdvcHRpb25zJyl9IC8+XG4gICAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICAgIHtvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgICAgICAgIDxTaW1wbGVTZWxlY3RcbiAgICAgICAgICAgICAgICAgICAga2V5PXtgZGVmYXVsdC1zZWxlY3QtJHtvcHRpb25zLmpvaW4oJy0nKX1gfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgICBvcHRpb25XcmFwQ2xhc3NOYW1lPVwibWF4LWgtWzE0MHB4XSBvdmVyZmxvdy15LWF1dG9cIlxuICAgICAgICAgICAgICAgICAgICBpdGVtcz17W1xuICAgICAgICAgICAgICAgICAgICAgIHsgdmFsdWU6ICcnLCBuYW1lOiB0KCd2YXJpYWJsZUNvbmZpZy5ub0RlZmF1bHRWYWx1ZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAuLi5vcHRpb25zLmZpbHRlcihvcHQgPT4gb3B0LnRyaW0oKSAhPT0gJycpLm1hcChvcHRpb24gPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBvcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBvcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RlbXBQYXlsb2FkLmRlZmF1bHQgfHwgJyd9XG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtpdGVtID0+IGhhbmRsZVBheWxvYWRDaGFuZ2UoJ2RlZmF1bHQnKShpdGVtLnZhbHVlID09PSAnJyA/IHVuZGVmaW5lZCA6IGl0ZW0udmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgndmFyaWFibGVDb25maWcuc2VsZWN0RGVmYXVsdFZhbHVlJywgeyBuczogJ2FwcERlYnVnJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgYWxsb3dTZWFyY2g9e2ZhbHNlfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtbSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUsIElucHV0VmFyVHlwZS5tdWx0aUZpbGVzXS5pbmNsdWRlcyh0eXBlKSAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8RmlsZVVwbG9hZFNldHRpbmdcbiAgICAgICAgICAgICAgICBwYXlsb2FkPXt0ZW1wUGF5bG9hZCBhcyBVcGxvYWRGaWxlU2V0dGluZ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHA6IFVwbG9hZEZpbGVTZXR0aW5nKSA9PiBzZXRUZW1wUGF5bG9hZChwIGFzIElucHV0VmFyKX1cbiAgICAgICAgICAgICAgICBpc011bHRpcGxlPXt0eXBlID09PSBJbnB1dFZhclR5cGUubXVsdGlGaWxlc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPEZpZWxkIHRpdGxlPXt0KCd2YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfT5cbiAgICAgICAgICAgICAgICA8RmlsZVVwbG9hZGVySW5BdHRhY2htZW50V3JhcHBlclxuICAgICAgICAgICAgICAgICAgdmFsdWU9eyh0eXBlID09PSBJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSA/ICh0ZW1wUGF5bG9hZC5kZWZhdWx0ID8gW3RlbXBQYXlsb2FkLmRlZmF1bHRdIDogW10pIDogKHRlbXBQYXlsb2FkLmRlZmF1bHQgfHwgW10pKSBhcyB1bmtub3duIGFzIEZpbGVFbnRpdHlbXX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZmlsZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IElucHV0VmFyVHlwZS5zaW5nbGVGaWxlKVxuICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBheWxvYWRDaGFuZ2UoJ2RlZmF1bHQnKShmaWxlcz8uWzBdIHx8IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVBheWxvYWRDaGFuZ2UoJ2RlZmF1bHQnKShmaWxlcyB8fCB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgZmlsZUNvbmZpZz17e1xuICAgICAgICAgICAgICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IHRlbXBQYXlsb2FkLmFsbG93ZWRfZmlsZV90eXBlcyB8fCBbU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5kb2N1bWVudF0sXG4gICAgICAgICAgICAgICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiB0ZW1wUGF5bG9hZC5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucyB8fCBbXSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiB0ZW1wUGF5bG9hZC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMgfHwgW1RyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmxdLFxuICAgICAgICAgICAgICAgICAgICBudW1iZXJfbGltaXRzOiB0eXBlID09PSBJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSA/IDEgOiB0ZW1wUGF5bG9hZC5tYXhfbGVuZ3RoIHx8IDUsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3R5cGUgPT09IElucHV0VmFyVHlwZS5qc29uT2JqZWN0ICYmIChcbiAgICAgICAgICAgIDxGaWVsZCB0aXRsZT17dCgndmFyaWFibGVDb25maWcuanNvblNjaGVtYScsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9IGlzT3B0aW9uYWw+XG4gICAgICAgICAgICAgIDxDb2RlRWRpdG9yXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U9e0NvZGVMYW5ndWFnZS5qc29ufVxuICAgICAgICAgICAgICAgIHZhbHVlPXtqc29uU2NoZW1hU3RyfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVKU09OU2NoZW1hQ2hhbmdlfVxuICAgICAgICAgICAgICAgIG5vV3JhcHBlclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnIGgtWzgwcHhdIG92ZXJmbG93LXktYXV0byByb3VuZGVkLVsxMHB4XSBiZy1jb21wb25lbnRzLWlucHV0LWJnLW5vcm1hbCBwLTFcIlxuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXtcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2hpdGVzcGFjZS1wcmVcIj57anNvbkNvbmZpZ1BsYWNlSG9sZGVyfTwvZGl2PlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiIW10LTUgZmxleCBoLTYgaXRlbXMtY2VudGVyIHNwYWNlLXgtMlwiPlxuICAgICAgICAgICAgPENoZWNrYm94IGNoZWNrZWQ9e3RlbXBQYXlsb2FkLnJlcXVpcmVkfSBkaXNhYmxlZD17dGVtcFBheWxvYWQuaGlkZX0gb25DaGVjaz17KCkgPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgncmVxdWlyZWQnKSghdGVtcFBheWxvYWQucmVxdWlyZWQpfSAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXNtLXNlbWlib2xkIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgndmFyaWFibGVDb25maWcucmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiIW10LTUgZmxleCBoLTYgaXRlbXMtY2VudGVyIHNwYWNlLXgtMlwiPlxuICAgICAgICAgICAgPENoZWNrYm94IGNoZWNrZWQ9e3RlbXBQYXlsb2FkLmhpZGV9IGRpc2FibGVkPXt0ZW1wUGF5bG9hZC5yZXF1aXJlZH0gb25DaGVjaz17KCkgPT4gaGFuZGxlUGF5bG9hZENoYW5nZSgnaGlkZScpKCF0ZW1wUGF5bG9hZC5oaWRlKX0gLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ3ZhcmlhYmxlQ29uZmlnLmhpZGUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxNb2RhbEZvb3RcbiAgICAgICAgb25Db25maXJtPXtoYW5kbGVDb25maXJtfVxuICAgICAgICBvbkNhbmNlbD17b25DbG9zZX1cbiAgICAgIC8+XG4gICAgPC9Nb2RhbD5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhDb25maWdNb2RhbClcbiJdfQ==