"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePluginAuthAction = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const use_credential_1 = require("../hooks/use-credential");
const usePluginAuthAction = (pluginPayload, onUpdate) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const pendingOperationCredentialId = (0, react_1.useRef)(null);
    const [deleteCredentialId, setDeleteCredentialId] = (0, react_1.useState)(null);
    const { mutateAsync: deletePluginCredential } = (0, use_credential_1.useDeletePluginCredentialHook)(pluginPayload);
    const openConfirm = (0, react_1.useCallback)((credentialId) => {
        if (credentialId)
            pendingOperationCredentialId.current = credentialId;
        setDeleteCredentialId(pendingOperationCredentialId.current);
    }, []);
    const closeConfirm = (0, react_1.useCallback)(() => {
        setDeleteCredentialId(null);
        pendingOperationCredentialId.current = null;
    }, []);
    const [doingAction, setDoingAction] = (0, react_1.useState)(false);
    const doingActionRef = (0, react_1.useRef)(doingAction);
    const handleSetDoingAction = (0, react_1.useCallback)((doing) => {
        doingActionRef.current = doing;
        setDoingAction(doing);
    }, []);
    const [editValues, setEditValues] = (0, react_1.useState)(null);
    const handleConfirm = (0, react_1.useCallback)(async () => {
        if (doingActionRef.current)
            return;
        if (!pendingOperationCredentialId.current) {
            setDeleteCredentialId(null);
            return;
        }
        try {
            handleSetDoingAction(true);
            await deletePluginCredential({ credential_id: pendingOperationCredentialId.current });
            notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
            onUpdate?.();
            setDeleteCredentialId(null);
            pendingOperationCredentialId.current = null;
            setEditValues(null);
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [deletePluginCredential, onUpdate, notify, t, handleSetDoingAction]);
    const handleEdit = (0, react_1.useCallback)((id, values) => {
        pendingOperationCredentialId.current = id;
        setEditValues(values);
    }, []);
    const handleRemove = (0, react_1.useCallback)(() => {
        setDeleteCredentialId(pendingOperationCredentialId.current);
    }, []);
    const { mutateAsync: setPluginDefaultCredential } = (0, use_credential_1.useSetPluginDefaultCredentialHook)(pluginPayload);
    const handleSetDefault = (0, react_1.useCallback)(async (id) => {
        if (doingActionRef.current)
            return;
        try {
            handleSetDoingAction(true);
            await setPluginDefaultCredential(id);
            notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
            onUpdate?.();
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [setPluginDefaultCredential, onUpdate, notify, t, handleSetDoingAction]);
    const { mutateAsync: updatePluginCredential } = (0, use_credential_1.useUpdatePluginCredentialHook)(pluginPayload);
    const handleRename = (0, react_1.useCallback)(async (payload) => {
        if (doingActionRef.current)
            return;
        try {
            handleSetDoingAction(true);
            await updatePluginCredential(payload);
            notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
            onUpdate?.();
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [updatePluginCredential, notify, t, handleSetDoingAction, onUpdate]);
    return {
        doingAction,
        handleSetDoingAction,
        openConfirm,
        closeConfirm,
        deleteCredentialId,
        setDeleteCredentialId,
        handleConfirm,
        editValues,
        setEditValues,
        handleEdit,
        handleRemove,
        handleSetDefault,
        handleRename,
        pendingOperationCredentialId,
    };
};
exports.usePluginAuthAction = usePluginAuthAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBsdWdpbi1hdXRoLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1wbHVnaW4tYXV0aC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBSWM7QUFDZCxpREFBOEM7QUFDOUMsdURBQTZEO0FBQzdELDREQUlnQztBQUV6QixNQUFNLG1CQUFtQixHQUFHLENBQ2pDLGFBQTRCLEVBQzVCLFFBQXFCLEVBQ3JCLEVBQUU7SUFDRixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWUsR0FBRSxDQUFBO0lBQ3BDLE1BQU0sNEJBQTRCLEdBQUcsSUFBQSxjQUFNLEVBQWdCLElBQUksQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZ0IsSUFBSSxDQUFDLENBQUE7SUFDakYsTUFBTSxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxHQUFHLElBQUEsOENBQTZCLEVBQUMsYUFBYSxDQUFDLENBQUE7SUFDNUYsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsWUFBcUIsRUFBRSxFQUFFO1FBQ3hELElBQUksWUFBWTtZQUNkLDRCQUE0QixDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUE7UUFFckQscUJBQXFCLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDN0QsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ04sTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNwQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQiw0QkFBNEIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0lBQzdDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNOLE1BQU0sQ0FBQyxXQUFX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Li4vdHlwZXMnXG5pbXBvcnQge1xuICB1c2VDYWxsYmFjayxcbiAgdXNlUmVmLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQge1xuICB1c2VEZWxldGVQbHVnaW5DcmVkZW50aWFsSG9vayxcbiAgdXNlU2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWxIb29rLFxuICB1c2VVcGRhdGVQbHVnaW5DcmVkZW50aWFsSG9vayxcbn0gZnJvbSAnLi4vaG9va3MvdXNlLWNyZWRlbnRpYWwnXG5cbmV4cG9ydCBjb25zdCB1c2VQbHVnaW5BdXRoQWN0aW9uID0gKFxuICBwbHVnaW5QYXlsb2FkOiBQbHVnaW5QYXlsb2FkLFxuICBvblVwZGF0ZT86ICgpID0+IHZvaWQsXG4pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCBwZW5kaW5nT3BlcmF0aW9uQ3JlZGVudGlhbElkID0gdXNlUmVmPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtkZWxldGVDcmVkZW50aWFsSWQsIHNldERlbGV0ZUNyZWRlbnRpYWxJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBkZWxldGVQbHVnaW5DcmVkZW50aWFsIH0gPSB1c2VEZWxldGVQbHVnaW5DcmVkZW50aWFsSG9vayhwbHVnaW5QYXlsb2FkKVxuICBjb25zdCBvcGVuQ29uZmlybSA9IHVzZUNhbGxiYWNrKChjcmVkZW50aWFsSWQ/OiBzdHJpbmcpID0+IHtcbiAgICBpZiAoY3JlZGVudGlhbElkKVxuICAgICAgcGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50ID0gY3JlZGVudGlhbElkXG5cbiAgICBzZXREZWxldGVDcmVkZW50aWFsSWQocGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50KVxuICB9LCBbXSlcbiAgY29uc3QgY2xvc2VDb25maXJtID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldERlbGV0ZUNyZWRlbnRpYWxJZChudWxsKVxuICAgIHBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQuY3VycmVudCA9IG51bGxcbiAgfSwgW10pXG4gIGNvbnN0IFtkb2luZ0FjdGlvbiwgc2V0RG9pbmdBY3Rpb25dID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGRvaW5nQWN0aW9uUmVmID0gdXNlUmVmKGRvaW5nQWN0aW9uKVxuICBjb25zdCBoYW5kbGVTZXREb2luZ0FjdGlvbiA9IHVzZUNhbGxiYWNrKChkb2luZzogYm9vbGVhbikgPT4ge1xuICAgIGRvaW5nQWN0aW9uUmVmLmN1cnJlbnQgPSBkb2luZ1xuICAgIHNldERvaW5nQWN0aW9uKGRvaW5nKVxuICB9LCBbXSlcbiAgY29uc3QgW2VkaXRWYWx1ZXMsIHNldEVkaXRWYWx1ZXNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw+KG51bGwpXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm0gPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKGRvaW5nQWN0aW9uUmVmLmN1cnJlbnQpXG4gICAgICByZXR1cm5cbiAgICBpZiAoIXBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQuY3VycmVudCkge1xuICAgICAgc2V0RGVsZXRlQ3JlZGVudGlhbElkKG51bGwpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZVNldERvaW5nQWN0aW9uKHRydWUpXG4gICAgICBhd2FpdCBkZWxldGVQbHVnaW5DcmVkZW50aWFsKHsgY3JlZGVudGlhbF9pZDogcGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50IH0pXG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2FwaS5hY3Rpb25TdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICB9KVxuICAgICAgb25VcGRhdGU/LigpXG4gICAgICBzZXREZWxldGVDcmVkZW50aWFsSWQobnVsbClcbiAgICAgIHBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQuY3VycmVudCA9IG51bGxcbiAgICAgIHNldEVkaXRWYWx1ZXMobnVsbClcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBoYW5kbGVTZXREb2luZ0FjdGlvbihmYWxzZSlcbiAgICB9XG4gIH0sIFtkZWxldGVQbHVnaW5DcmVkZW50aWFsLCBvblVwZGF0ZSwgbm90aWZ5LCB0LCBoYW5kbGVTZXREb2luZ0FjdGlvbl0pXG4gIGNvbnN0IGhhbmRsZUVkaXQgPSB1c2VDYWxsYmFjaygoaWQ6IHN0cmluZywgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgcGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50ID0gaWRcbiAgICBzZXRFZGl0VmFsdWVzKHZhbHVlcylcbiAgfSwgW10pXG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXREZWxldGVDcmVkZW50aWFsSWQocGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50KVxuICB9LCBbXSlcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogc2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwgfSA9IHVzZVNldFBsdWdpbkRlZmF1bHRDcmVkZW50aWFsSG9vayhwbHVnaW5QYXlsb2FkKVxuICBjb25zdCBoYW5kbGVTZXREZWZhdWx0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKGlkOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoZG9pbmdBY3Rpb25SZWYuY3VycmVudClcbiAgICAgIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBoYW5kbGVTZXREb2luZ0FjdGlvbih0cnVlKVxuICAgICAgYXdhaXQgc2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwoaWQpXG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2FwaS5hY3Rpb25TdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICB9KVxuICAgICAgb25VcGRhdGU/LigpXG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgaGFuZGxlU2V0RG9pbmdBY3Rpb24oZmFsc2UpXG4gICAgfVxuICB9LCBbc2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwsIG9uVXBkYXRlLCBub3RpZnksIHQsIGhhbmRsZVNldERvaW5nQWN0aW9uXSlcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogdXBkYXRlUGx1Z2luQ3JlZGVudGlhbCB9ID0gdXNlVXBkYXRlUGx1Z2luQ3JlZGVudGlhbEhvb2socGx1Z2luUGF5bG9hZClcbiAgY29uc3QgaGFuZGxlUmVuYW1lID0gdXNlQ2FsbGJhY2soYXN5bmMgKHBheWxvYWQ6IHtcbiAgICBjcmVkZW50aWFsX2lkOiBzdHJpbmdcbiAgICBuYW1lOiBzdHJpbmdcbiAgfSkgPT4ge1xuICAgIGlmIChkb2luZ0FjdGlvblJlZi5jdXJyZW50KVxuICAgICAgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZVNldERvaW5nQWN0aW9uKHRydWUpXG4gICAgICBhd2FpdCB1cGRhdGVQbHVnaW5DcmVkZW50aWFsKHBheWxvYWQpXG4gICAgICBub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2FwaS5hY3Rpb25TdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICB9KVxuICAgICAgb25VcGRhdGU/LigpXG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgaGFuZGxlU2V0RG9pbmdBY3Rpb24oZmFsc2UpXG4gICAgfVxuICB9LCBbdXBkYXRlUGx1Z2luQ3JlZGVudGlhbCwgbm90aWZ5LCB0LCBoYW5kbGVTZXREb2luZ0FjdGlvbiwgb25VcGRhdGVdKVxuXG4gIHJldHVybiB7XG4gICAgZG9pbmdBY3Rpb24sXG4gICAgaGFuZGxlU2V0RG9pbmdBY3Rpb24sXG4gICAgb3BlbkNvbmZpcm0sXG4gICAgY2xvc2VDb25maXJtLFxuICAgIGRlbGV0ZUNyZWRlbnRpYWxJZCxcbiAgICBzZXREZWxldGVDcmVkZW50aWFsSWQsXG4gICAgaGFuZGxlQ29uZmlybSxcbiAgICBlZGl0VmFsdWVzLFxuICAgIHNldEVkaXRWYWx1ZXMsXG4gICAgaGFuZGxlRWRpdCxcbiAgICBoYW5kbGVSZW1vdmUsXG4gICAgaGFuZGxlU2V0RGVmYXVsdCxcbiAgICBoYW5kbGVSZW5hbWUsXG4gICAgcGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZCxcbiAgfVxufVxuIl19