"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckInputsForms = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const app_1 = require("@/types/app");
const useCheckInputsForms = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const checkInputsForm = (0, react_1.useCallback)((inputs, inputsForm) => {
        let hasEmptyInput = '';
        let fileIsUploading = false;
        const requiredVars = inputsForm.filter(({ required, type }) => required && type !== types_1.InputVarType.checkbox); // boolean can be not checked
        if (requiredVars?.length) {
            requiredVars.forEach(({ variable, label, type }) => {
                if (hasEmptyInput)
                    return;
                if (fileIsUploading)
                    return;
                if (!inputs[variable])
                    hasEmptyInput = label;
                if ((type === types_1.InputVarType.singleFile || type === types_1.InputVarType.multiFiles) && inputs[variable]) {
                    const files = inputs[variable];
                    if (Array.isArray(files))
                        fileIsUploading = files.find(item => item.transferMethod === app_1.TransferMethod.local_file && !item.uploadedId);
                    else
                        fileIsUploading = files.transferMethod === app_1.TransferMethod.local_file && !files.uploadedId;
                }
            });
        }
        if (hasEmptyInput) {
            notify({ type: 'error', message: t('errorMessage.valueOfVarRequired', { ns: 'appDebug', key: hasEmptyInput }) });
            return false;
        }
        if (fileIsUploading) {
            notify({ type: 'info', message: t('errorMessage.waitForFileUpload', { ns: 'appDebug' }) });
            return;
        }
        return true;
    }, [notify, t]);
    return {
        checkInputsForm,
    };
};
exports.useCheckInputsForms = useCheckInputsForms;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2staW5wdXQtZm9ybXMtaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGVjay1pbnB1dC1mb3Jtcy1ob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLHVEQUE2RDtBQUM3RCwyREFBOEQ7QUFDOUQscUNBQTRDO0FBRXJDLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxFQUFFO0lBQ3RDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFFcEMsTUFBTSxlQUFlLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBMkIsRUFBRSxVQUF1QixFQUFFLEVBQUU7UUFDM0YsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFBO1FBQ3RCLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQTtRQUMzQixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsSUFBSSxJQUFJLEtBQUssb0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQSxDQUFDLDZCQUE2QjtRQUV4SSxJQUFJLFlBQVksRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUN6QixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7Z0JBQ2pELElBQUksYUFBYTtvQkFDZixPQUFNO2dCQUVSLElBQUksZUFBZTtvQkFDakIsT0FBTTtnQkFFUixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztvQkFDbkIsYUFBYSxHQUFHLEtBQWUsQ0FBQTtnQkFFakMsSUFBSSxDQUFDLElBQUksS0FBSyxvQkFBWSxDQUFDLFVBQVUsSUFBSSxJQUFJLEtBQUssb0JBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztvQkFDL0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO29CQUM5QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUN0QixlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssb0JBQWMsQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7O3dCQUUzRyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsS0FBSyxvQkFBYyxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7Z0JBQzdGLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2hILE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztRQUVELElBQUksZUFBZSxFQUFFLENBQUM7WUFDcEIsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzFGLE9BQU07UUFDUixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVmLE9BQU87UUFDTCxlQUFlO0tBQ2hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUE5Q1ksUUFBQSxtQkFBbUIsdUJBOEMvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSW5wdXRGb3JtIH0gZnJvbSAnLi90eXBlJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuXG5leHBvcnQgY29uc3QgdXNlQ2hlY2tJbnB1dHNGb3JtcyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuXG4gIGNvbnN0IGNoZWNrSW5wdXRzRm9ybSA9IHVzZUNhbGxiYWNrKChpbnB1dHM6IFJlY29yZDxzdHJpbmcsIGFueT4sIGlucHV0c0Zvcm06IElucHV0Rm9ybVtdKSA9PiB7XG4gICAgbGV0IGhhc0VtcHR5SW5wdXQgPSAnJ1xuICAgIGxldCBmaWxlSXNVcGxvYWRpbmcgPSBmYWxzZVxuICAgIGNvbnN0IHJlcXVpcmVkVmFycyA9IGlucHV0c0Zvcm0uZmlsdGVyKCh7IHJlcXVpcmVkLCB0eXBlIH0pID0+IHJlcXVpcmVkICYmIHR5cGUgIT09IElucHV0VmFyVHlwZS5jaGVja2JveCkgLy8gYm9vbGVhbiBjYW4gYmUgbm90IGNoZWNrZWRcblxuICAgIGlmIChyZXF1aXJlZFZhcnM/Lmxlbmd0aCkge1xuICAgICAgcmVxdWlyZWRWYXJzLmZvckVhY2goKHsgdmFyaWFibGUsIGxhYmVsLCB0eXBlIH0pID0+IHtcbiAgICAgICAgaWYgKGhhc0VtcHR5SW5wdXQpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgKGZpbGVJc1VwbG9hZGluZylcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAoIWlucHV0c1t2YXJpYWJsZV0pXG4gICAgICAgICAgaGFzRW1wdHlJbnB1dCA9IGxhYmVsIGFzIHN0cmluZ1xuXG4gICAgICAgIGlmICgodHlwZSA9PT0gSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUgfHwgdHlwZSA9PT0gSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpICYmIGlucHV0c1t2YXJpYWJsZV0pIHtcbiAgICAgICAgICBjb25zdCBmaWxlcyA9IGlucHV0c1t2YXJpYWJsZV1cbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmaWxlcykpXG4gICAgICAgICAgICBmaWxlSXNVcGxvYWRpbmcgPSBmaWxlcy5maW5kKGl0ZW0gPT4gaXRlbS50cmFuc2Zlck1ldGhvZCA9PT0gVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSAmJiAhaXRlbS51cGxvYWRlZElkKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVJc1VwbG9hZGluZyA9IGZpbGVzLnRyYW5zZmVyTWV0aG9kID09PSBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlICYmICFmaWxlcy51cGxvYWRlZElkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGhhc0VtcHR5SW5wdXQpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2Vycm9yTWVzc2FnZS52YWx1ZU9mVmFyUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnLCBrZXk6IGhhc0VtcHR5SW5wdXQgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChmaWxlSXNVcGxvYWRpbmcpIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdpbmZvJywgbWVzc2FnZTogdCgnZXJyb3JNZXNzYWdlLndhaXRGb3JGaWxlVXBsb2FkJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW25vdGlmeSwgdF0pXG5cbiAgcmV0dXJuIHtcbiAgICBjaGVja0lucHV0c0Zvcm0sXG4gIH1cbn1cbiJdfQ==