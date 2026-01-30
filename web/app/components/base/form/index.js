"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.withForm = exports.useAppForm = exports.useFormContext = exports.formContext = exports.useFieldContext = exports.fieldContext = void 0;
const react_form_1 = require("@tanstack/react-form");
const checkbox_1 = require("./components/field/checkbox");
const custom_select_1 = require("./components/field/custom-select");
const file_types_1 = require("./components/field/file-types");
const file_uploader_1 = require("./components/field/file-uploader");
const input_type_select_1 = require("./components/field/input-type-select");
const number_input_1 = require("./components/field/number-input");
const number_slider_1 = require("./components/field/number-slider");
const options_1 = require("./components/field/options");
const select_1 = require("./components/field/select");
const text_1 = require("./components/field/text");
const text_area_1 = require("./components/field/text-area");
const upload_method_1 = require("./components/field/upload-method");
const variable_selector_1 = require("./components/field/variable-selector");
const actions_1 = require("./components/form/actions");
_a = (0, react_form_1.createFormHookContexts)(), exports.fieldContext = _a.fieldContext, exports.useFieldContext = _a.useFieldContext, exports.formContext = _a.formContext, exports.useFormContext = _a.useFormContext;
_b = (0, react_form_1.createFormHook)({
    fieldComponents: {
        TextField: text_1.default,
        TextAreaField: text_area_1.default,
        NumberInputField: number_input_1.default,
        CheckboxField: checkbox_1.default,
        SelectField: select_1.default,
        CustomSelectField: custom_select_1.default,
        OptionsField: options_1.default,
        InputTypeSelectField: input_type_select_1.default,
        FileTypesField: file_types_1.default,
        UploadMethodField: upload_method_1.default,
        NumberSliderField: number_slider_1.default,
        VariableOrConstantInputField: variable_selector_1.default,
        FileUploaderField: file_uploader_1.default,
    },
    formComponents: {
        Actions: actions_1.default,
    },
    fieldContext: exports.fieldContext,
    formContext: exports.formContext,
}), exports.useAppForm = _b.useAppForm, exports.withForm = _b.withForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLHFEQUE2RTtBQUM3RSwwREFBdUQ7QUFDdkQsb0VBQWdFO0FBQ2hFLDhEQUEwRDtBQUMxRCxvRUFBZ0U7QUFDaEUsNEVBQXVFO0FBQ3ZFLGtFQUE4RDtBQUM5RCxvRUFBZ0U7QUFDaEUsd0RBQXFEO0FBQ3JELHNEQUFtRDtBQUNuRCxrREFBK0M7QUFDL0MsNERBQXdEO0FBQ3hELG9FQUFnRTtBQUNoRSw0RUFBK0U7QUFDL0UsdURBQStDO0FBRWxDLEtBQ1QsSUFBQSxtQ0FBc0IsR0FBRSxFQURiLG9CQUFZLG9CQUFFLHVCQUFlLHVCQUFFLG1CQUFXLG1CQUFFLHNCQUFjLHFCQUM3QztBQUVmLEtBQTJCLElBQUEsMkJBQWMsRUFBQztJQUNyRCxlQUFlLEVBQUU7UUFDZixTQUFTLEVBQVQsY0FBUztRQUNULGFBQWEsRUFBYixtQkFBYTtRQUNiLGdCQUFnQixFQUFoQixzQkFBZ0I7UUFDaEIsYUFBYSxFQUFiLGtCQUFhO1FBQ2IsV0FBVyxFQUFYLGdCQUFXO1FBQ1gsaUJBQWlCLEVBQWpCLHVCQUFpQjtRQUNqQixZQUFZLEVBQVosaUJBQVk7UUFDWixvQkFBb0IsRUFBcEIsMkJBQW9CO1FBQ3BCLGNBQWMsRUFBZCxvQkFBYztRQUNkLGlCQUFpQixFQUFqQix1QkFBaUI7UUFDakIsaUJBQWlCLEVBQWpCLHVCQUFpQjtRQUNqQiw0QkFBNEIsRUFBNUIsMkJBQTRCO1FBQzVCLGlCQUFpQixFQUFqQix1QkFBaUI7S0FDbEI7SUFDRCxjQUFjLEVBQUU7UUFDZCxPQUFPLEVBQVAsaUJBQU87S0FDUjtJQUNELFlBQVksRUFBWixvQkFBWTtJQUNaLFdBQVcsRUFBWCxtQkFBVztDQUNaLENBQUMsRUFyQmEsa0JBQVUsa0JBQUUsZ0JBQVEsZUFxQmpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlRm9ybUhvb2ssIGNyZWF0ZUZvcm1Ib29rQ29udGV4dHMgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtZm9ybSdcbmltcG9ydCBDaGVja2JveEZpZWxkIGZyb20gJy4vY29tcG9uZW50cy9maWVsZC9jaGVja2JveCdcbmltcG9ydCBDdXN0b21TZWxlY3RGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvY3VzdG9tLXNlbGVjdCdcbmltcG9ydCBGaWxlVHlwZXNGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvZmlsZS10eXBlcydcbmltcG9ydCBGaWxlVXBsb2FkZXJGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvZmlsZS11cGxvYWRlcidcbmltcG9ydCBJbnB1dFR5cGVTZWxlY3RGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvaW5wdXQtdHlwZS1zZWxlY3QnXG5pbXBvcnQgTnVtYmVySW5wdXRGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvbnVtYmVyLWlucHV0J1xuaW1wb3J0IE51bWJlclNsaWRlckZpZWxkIGZyb20gJy4vY29tcG9uZW50cy9maWVsZC9udW1iZXItc2xpZGVyJ1xuaW1wb3J0IE9wdGlvbnNGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvb3B0aW9ucydcbmltcG9ydCBTZWxlY3RGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvc2VsZWN0J1xuaW1wb3J0IFRleHRGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvdGV4dCdcbmltcG9ydCBUZXh0QXJlYUZpZWxkIGZyb20gJy4vY29tcG9uZW50cy9maWVsZC90ZXh0LWFyZWEnXG5pbXBvcnQgVXBsb2FkTWV0aG9kRmllbGQgZnJvbSAnLi9jb21wb25lbnRzL2ZpZWxkL3VwbG9hZC1tZXRob2QnXG5pbXBvcnQgVmFyaWFibGVPckNvbnN0YW50SW5wdXRGaWVsZCBmcm9tICcuL2NvbXBvbmVudHMvZmllbGQvdmFyaWFibGUtc2VsZWN0b3InXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL2NvbXBvbmVudHMvZm9ybS9hY3Rpb25zJ1xuXG5leHBvcnQgY29uc3QgeyBmaWVsZENvbnRleHQsIHVzZUZpZWxkQ29udGV4dCwgZm9ybUNvbnRleHQsIHVzZUZvcm1Db250ZXh0IH1cbiAgPSBjcmVhdGVGb3JtSG9va0NvbnRleHRzKClcblxuZXhwb3J0IGNvbnN0IHsgdXNlQXBwRm9ybSwgd2l0aEZvcm0gfSA9IGNyZWF0ZUZvcm1Ib29rKHtcbiAgZmllbGRDb21wb25lbnRzOiB7XG4gICAgVGV4dEZpZWxkLFxuICAgIFRleHRBcmVhRmllbGQsXG4gICAgTnVtYmVySW5wdXRGaWVsZCxcbiAgICBDaGVja2JveEZpZWxkLFxuICAgIFNlbGVjdEZpZWxkLFxuICAgIEN1c3RvbVNlbGVjdEZpZWxkLFxuICAgIE9wdGlvbnNGaWVsZCxcbiAgICBJbnB1dFR5cGVTZWxlY3RGaWVsZCxcbiAgICBGaWxlVHlwZXNGaWVsZCxcbiAgICBVcGxvYWRNZXRob2RGaWVsZCxcbiAgICBOdW1iZXJTbGlkZXJGaWVsZCxcbiAgICBWYXJpYWJsZU9yQ29uc3RhbnRJbnB1dEZpZWxkLFxuICAgIEZpbGVVcGxvYWRlckZpZWxkLFxuICB9LFxuICBmb3JtQ29tcG9uZW50czoge1xuICAgIEFjdGlvbnMsXG4gIH0sXG4gIGZpZWxkQ29udGV4dCxcbiAgZm9ybUNvbnRleHQsXG59KVxuXG5leHBvcnQgdHlwZSBGb3JtVHlwZSA9IFJldHVyblR5cGU8dHlwZW9mIHVzZUZvcm1Db250ZXh0PlxuIl19