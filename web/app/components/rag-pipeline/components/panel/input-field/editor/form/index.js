"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const divider_1 = require("@/app/components/base/divider");
const hooks_1 = require("@/app/components/base/file-uploader/hooks");
const form_1 = require("@/app/components/base/form");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const use_common_1 = require("@/service/use-common");
const hidden_fields_1 = require("./hidden-fields");
const initial_fields_1 = require("./initial-fields");
const schema_1 = require("./schema");
const show_all_settings_1 = require("./show-all-settings");
const InputFieldForm = ({ initialData, supportFile = false, onCancel, onSubmit, isEditMode = true, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const { maxFileUploadLimit, } = (0, hooks_1.useFileSizeLimit)(fileUploadConfigResponse);
    const inputFieldForm = (0, form_1.useAppForm)({
        defaultValues: initialData,
        validators: {
            onSubmit: ({ value }) => {
                const { type } = value;
                const schema = (0, schema_1.createInputFieldSchema)(type, t, { maxFileUploadLimit });
                const result = schema.safeParse(value);
                if (!result.success) {
                    const issues = result.error.issues;
                    const firstIssue = issues[0];
                    const errorMessage = `"${firstIssue.path.join('.')}" ${firstIssue.message}`;
                    toast_1.default.notify({
                        type: 'error',
                        message: errorMessage,
                    });
                    return errorMessage;
                }
                return undefined;
            },
        },
        onSubmit: ({ value }) => {
            let moreInfo;
            if (isEditMode && value.variable !== initialData?.variable) {
                moreInfo = {
                    type: types_1.ChangeType.changeVarName,
                    payload: { beforeKey: initialData?.variable || '', afterKey: value.variable },
                };
            }
            onSubmit(value, moreInfo);
        },
    });
    const [showAllSettings, setShowAllSettings] = (0, react_1.useState)(false);
    const InitialFieldsComp = (0, initial_fields_1.default)({
        initialData,
        supportFile,
    });
    const HiddenFieldsComp = (0, hidden_fields_1.default)({
        initialData,
    });
    const handleShowAllSettings = (0, react_1.useCallback)(() => {
        setShowAllSettings(true);
    }, []);
    const ShowAllSettingComp = (0, show_all_settings_1.default)({
        initialData,
        handleShowAllSettings,
    });
    return (<form className="w-full" onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputFieldForm.handleSubmit();
        }}>
      <div className="flex flex-col gap-4 px-4 py-2">
        <InitialFieldsComp form={inputFieldForm}/>
        <divider_1.default type="horizontal"/>
        {!showAllSettings && (<ShowAllSettingComp form={inputFieldForm}/>)}
        {showAllSettings && (<HiddenFieldsComp form={inputFieldForm}/>)}
      </div>
      <div className="flex items-center justify-end gap-x-2 p-4 pt-2">
        <button_1.default variant="secondary" onClick={onCancel}>
          {t('operation.cancel', { ns: 'common' })}
        </button_1.default>
        <inputFieldForm.AppForm>
          <inputFieldForm.Actions />
        </inputFieldForm.AppForm>
      </div>
    </form>);
};
exports.default = InputFieldForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBNkM7QUFDN0MsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFDbkQscUVBQTRFO0FBQzVFLHFEQUF1RDtBQUN2RCx1REFBK0M7QUFDL0MsMkRBQTREO0FBQzVELHFEQUEwRDtBQUMxRCxtREFBMEM7QUFDMUMscURBQTRDO0FBQzVDLHFDQUFpRDtBQUNqRCwyREFBaUQ7QUFFakQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUN0QixXQUFXLEVBQ1gsV0FBVyxHQUFHLEtBQUssRUFDbkIsUUFBUSxFQUNSLFFBQVEsRUFDUixVQUFVLEdBQUcsSUFBSSxHQUNHLEVBQUUsRUFBRTtJQUN4QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsTUFBTSxFQUFFLElBQUksRUFBRSx3QkFBd0IsRUFBRSxHQUFHLElBQUEsZ0NBQW1CLEdBQUUsQ0FBQTtJQUNoRSxNQUFNLEVBQ0osa0JBQWtCLEdBQ25CLEdBQUcsSUFBQSx3QkFBZ0IsRUFBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBRTlDLE1BQU0sY0FBYyxHQUFHLElBQUEsaUJBQVUsRUFBQztRQUNoQyxhQUFhLEVBQUUsV0FBVztRQUMxQixVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQ3RCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUE7Z0JBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUEsK0JBQXNCLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQTtnQkFDdEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVB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LEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzFDO1FBQUEsRUFBRSxnQkFBTSxDQUNSO1FBQUEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUNyQjtVQUFBLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxBQUFELEVBQ3pCO1FBQUEsRUFBRSxjQUFjLENBQUMsT0FBTyxDQUMxQjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGb3JtRGF0YSwgSW5wdXRGaWVsZEZvcm1Qcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE1vcmVJbmZvIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IERpdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RpdmlkZXInXG5pbXBvcnQgeyB1c2VGaWxlU2l6ZUxpbWl0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZpbGUtdXBsb2FkZXIvaG9va3MnXG5pbXBvcnQgeyB1c2VBcHBGb3JtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgQ2hhbmdlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VGaWxlVXBsb2FkQ29uZmlnIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgSGlkZGVuRmllbGRzIGZyb20gJy4vaGlkZGVuLWZpZWxkcydcbmltcG9ydCBJbml0aWFsRmllbGRzIGZyb20gJy4vaW5pdGlhbC1maWVsZHMnXG5pbXBvcnQgeyBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnXG5pbXBvcnQgU2hvd0FsbFNldHRpbmdzIGZyb20gJy4vc2hvdy1hbGwtc2V0dGluZ3MnXG5cbmNvbnN0IElucHV0RmllbGRGb3JtID0gKHtcbiAgaW5pdGlhbERhdGEsXG4gIHN1cHBvcnRGaWxlID0gZmFsc2UsXG4gIG9uQ2FuY2VsLFxuICBvblN1Ym1pdCxcbiAgaXNFZGl0TW9kZSA9IHRydWUsXG59OiBJbnB1dEZpZWxkRm9ybVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IHsgZGF0YTogZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlIH0gPSB1c2VGaWxlVXBsb2FkQ29uZmlnKClcbiAgY29uc3Qge1xuICAgIG1heEZpbGVVcGxvYWRMaW1pdCxcbiAgfSA9IHVzZUZpbGVTaXplTGltaXQoZmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlKVxuXG4gIGNvbnN0IGlucHV0RmllbGRGb3JtID0gdXNlQXBwRm9ybSh7XG4gICAgZGVmYXVsdFZhbHVlczogaW5pdGlhbERhdGEsXG4gICAgdmFsaWRhdG9yczoge1xuICAgICAgb25TdWJtaXQ6ICh7IHZhbHVlIH0pID0+IHtcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSB2YWx1ZVxuICAgICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKHR5cGUsIHQsIHsgbWF4RmlsZVVwbG9hZExpbWl0IH0pXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsdWUpXG4gICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBjb25zdCBpc3N1ZXMgPSByZXN1bHQuZXJyb3IuaXNzdWVzXG4gICAgICAgICAgY29uc3QgZmlyc3RJc3N1ZSA9IGlzc3Vlc1swXVxuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGBcIiR7Zmlyc3RJc3N1ZS5wYXRoLmpvaW4oJy4nKX1cIiAke2ZpcnN0SXNzdWUubWVzc2FnZX1gXG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gZXJyb3JNZXNzYWdlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9uU3VibWl0OiAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICBsZXQgbW9yZUluZm86IE1vcmVJbmZvIHwgdW5kZWZpbmVkXG4gICAgICBpZiAoaXNFZGl0TW9kZSAmJiB2YWx1ZS52YXJpYWJsZSAhPT0gaW5pdGlhbERhdGE/LnZhcmlhYmxlKSB7XG4gICAgICAgIG1vcmVJbmZvID0ge1xuICAgICAgICAgIHR5cGU6IENoYW5nZVR5cGUuY2hhbmdlVmFyTmFtZSxcbiAgICAgICAgICBwYXlsb2FkOiB7IGJlZm9yZUtleTogaW5pdGlhbERhdGE/LnZhcmlhYmxlIHx8ICcnLCBhZnRlcktleTogdmFsdWUudmFyaWFibGUgfSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb25TdWJtaXQodmFsdWUgYXMgRm9ybURhdGEsIG1vcmVJbmZvKVxuICAgIH0sXG4gIH0pXG5cbiAgY29uc3QgW3Nob3dBbGxTZXR0aW5ncywgc2V0U2hvd0FsbFNldHRpbmdzXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IEluaXRpYWxGaWVsZHNDb21wID0gSW5pdGlhbEZpZWxkcyh7XG4gICAgaW5pdGlhbERhdGEsXG4gICAgc3VwcG9ydEZpbGUsXG4gIH0pXG4gIGNvbnN0IEhpZGRlbkZpZWxkc0NvbXAgPSBIaWRkZW5GaWVsZHMoe1xuICAgIGluaXRpYWxEYXRhLFxuICB9KVxuXG4gIGNvbnN0IGhhbmRsZVNob3dBbGxTZXR0aW5ncyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRTaG93QWxsU2V0dGluZ3ModHJ1ZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgU2hvd0FsbFNldHRpbmdDb21wID0gU2hvd0FsbFNldHRpbmdzKHtcbiAgICBpbml0aWFsRGF0YSxcbiAgICBoYW5kbGVTaG93QWxsU2V0dGluZ3MsXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8Zm9ybVxuICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgIG9uU3VibWl0PXsoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBpbnB1dEZpZWxkRm9ybS5oYW5kbGVTdWJtaXQoKVxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTQgcHgtNCBweS0yXCI+XG4gICAgICAgIDxJbml0aWFsRmllbGRzQ29tcCBmb3JtPXtpbnB1dEZpZWxkRm9ybX0gLz5cbiAgICAgICAgPERpdmlkZXIgdHlwZT1cImhvcml6b250YWxcIiAvPlxuICAgICAgICB7IXNob3dBbGxTZXR0aW5ncyAmJiAoXG4gICAgICAgICAgPFNob3dBbGxTZXR0aW5nQ29tcCBmb3JtPXtpbnB1dEZpZWxkRm9ybX0gLz5cbiAgICAgICAgKX1cbiAgICAgICAge3Nob3dBbGxTZXR0aW5ncyAmJiAoXG4gICAgICAgICAgPEhpZGRlbkZpZWxkc0NvbXAgZm9ybT17aW5wdXRGaWVsZEZvcm19IC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLXgtMiBwLTQgcHQtMlwiPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiBvbkNsaWNrPXtvbkNhbmNlbH0+XG4gICAgICAgICAge3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxpbnB1dEZpZWxkRm9ybS5BcHBGb3JtPlxuICAgICAgICAgIDxpbnB1dEZpZWxkRm9ybS5BY3Rpb25zIC8+XG4gICAgICAgIDwvaW5wdXRGaWVsZEZvcm0uQXBwRm9ybT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnB1dEZpZWxkRm9ybVxuIl19