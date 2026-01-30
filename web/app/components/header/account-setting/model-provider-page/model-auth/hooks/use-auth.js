"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const use_models_1 = require("@/service/use-models");
const use_auth_service_1 = require("./use-auth-service");
const useAuth = (provider, configurationMethod, currentCustomConfigurationModelFixedFields, extra = {}) => {
    const { isModelCredential, onUpdate, onRemove, mode, } = extra;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const { getDeleteCredentialService, getActiveCredentialService, getEditCredentialService, getAddCredentialService, } = (0, use_auth_service_1.useAuthService)(provider.provider);
    const { mutateAsync: deleteModelService } = (0, use_models_1.useDeleteModel)(provider.provider);
    const handleOpenModelModal = (0, hooks_1.useModelModalHandler)();
    const { handleRefreshModel } = (0, hooks_1.useRefreshModel)();
    const pendingOperationCredentialId = (0, react_1.useRef)(null);
    const [deleteCredentialId, setDeleteCredentialId] = (0, react_1.useState)(null);
    const handleSetDeleteCredentialId = (0, react_1.useCallback)((credentialId) => {
        setDeleteCredentialId(credentialId);
        pendingOperationCredentialId.current = credentialId;
    }, []);
    const pendingOperationModel = (0, react_1.useRef)(null);
    const [deleteModel, setDeleteModel] = (0, react_1.useState)(null);
    const handleSetDeleteModel = (0, react_1.useCallback)((model) => {
        setDeleteModel(model);
        pendingOperationModel.current = model;
    }, []);
    const openConfirmDelete = (0, react_1.useCallback)((credential, model) => {
        if (credential)
            handleSetDeleteCredentialId(credential.credential_id);
        if (model)
            handleSetDeleteModel(model);
    }, []);
    const closeConfirmDelete = (0, react_1.useCallback)(() => {
        handleSetDeleteCredentialId(null);
        handleSetDeleteModel(null);
    }, []);
    const [doingAction, setDoingAction] = (0, react_1.useState)(false);
    const doingActionRef = (0, react_1.useRef)(doingAction);
    const handleSetDoingAction = (0, react_1.useCallback)((doing) => {
        doingActionRef.current = doing;
        setDoingAction(doing);
    }, []);
    const handleActiveCredential = (0, react_1.useCallback)(async (credential, model) => {
        if (doingActionRef.current)
            return;
        try {
            handleSetDoingAction(true);
            await getActiveCredentialService(!!model)({
                credential_id: credential.credential_id,
                model: model?.model,
                model_type: model?.model_type,
            });
            notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
            handleRefreshModel(provider, undefined, true);
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [getActiveCredentialService, notify, t, handleSetDoingAction]);
    const handleConfirmDelete = (0, react_1.useCallback)(async () => {
        if (doingActionRef.current)
            return;
        if (!pendingOperationCredentialId.current && !pendingOperationModel.current) {
            closeConfirmDelete();
            return;
        }
        try {
            handleSetDoingAction(true);
            let payload = {};
            if (pendingOperationCredentialId.current) {
                payload = {
                    credential_id: pendingOperationCredentialId.current,
                    model: pendingOperationModel.current?.model,
                    model_type: pendingOperationModel.current?.model_type,
                };
                await getDeleteCredentialService(!!isModelCredential)(payload);
            }
            if (!pendingOperationCredentialId.current && pendingOperationModel.current) {
                payload = {
                    model: pendingOperationModel.current.model,
                    model_type: pendingOperationModel.current.model_type,
                };
                await deleteModelService(payload);
            }
            notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
            handleRefreshModel(provider, undefined, true);
            onRemove?.(pendingOperationCredentialId.current ?? '');
            closeConfirmDelete();
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [notify, t, handleSetDoingAction, getDeleteCredentialService, isModelCredential, closeConfirmDelete, handleRefreshModel, provider, configurationMethod, deleteModelService]);
    const handleSaveCredential = (0, react_1.useCallback)(async (payload) => {
        if (doingActionRef.current)
            return;
        try {
            handleSetDoingAction(true);
            let res = {};
            if (payload.credential_id)
                res = await getEditCredentialService(!!isModelCredential)(payload);
            else
                res = await getAddCredentialService(!!isModelCredential)(payload);
            if (res.result === 'success') {
                notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
                handleRefreshModel(provider, undefined, !payload.credential_id);
            }
        }
        finally {
            handleSetDoingAction(false);
        }
    }, [notify, t, handleSetDoingAction, getEditCredentialService, getAddCredentialService]);
    const handleOpenModal = (0, react_1.useCallback)((credential, model) => {
        handleOpenModelModal(provider, configurationMethod, currentCustomConfigurationModelFixedFields, {
            isModelCredential,
            credential,
            model,
            onUpdate,
            mode,
        });
    }, [
        handleOpenModelModal,
        provider,
        configurationMethod,
        currentCustomConfigurationModelFixedFields,
        isModelCredential,
        onUpdate,
        mode,
    ]);
    return {
        pendingOperationCredentialId,
        pendingOperationModel,
        openConfirmDelete,
        closeConfirmDelete,
        doingAction,
        handleActiveCredential,
        handleConfirmDelete,
        deleteCredentialId,
        deleteModel,
        handleSaveCredential,
        handleOpenModal,
    };
};
exports.useAuth = useAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxpQ0FJYztBQUNkLGlEQUE4QztBQUM5Qyx1REFBNkQ7QUFDN0QsNkZBRzBFO0FBQzFFLHFEQUFxRDtBQUNyRCx5REFBbUQ7QUFFNUMsTUFBTSxPQUFPLEdBQUcsQ0FDckIsUUFBdUIsRUFDdkIsbUJBQTRDLEVBQzVDLDBDQUFnRixFQUNoRixRQUtJLEVBQUUsRUFDTixFQUFFO0lBQ0YsTUFBTSxFQUNKLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsUUFBUSxFQUNSLElBQUksR0FDTCxHQUFHLEtBQUssQ0FBQTtJQUNULE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDcEMsTUFBTSxFQUNKLDBCQUEwQixFQUMxQiwwQkFBMEIsRUFDMUIsd0JBQXdCLEVBQ3hCLHVCQUF1QixHQUN4QixHQUFHLElBQUEsaUNBQWMsRUFBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDckMsTUFBTSxFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUEsMkJBQWMsRUFBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDN0UsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLDRCQUFvQixHQUFFLENBQUE7SUFDbkQsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDaEQsTUFBTSw0QkFBNEIsR0FBRyxJQUFBLGNBQU0sRUFBZ0IsSUFBSSxDQUFDLENBQUE7SUFDaEUsTUFBTSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFnQixJQUFJLENBQUMsQ0FBQTtJQUNqRixNQUFNLDJCQUEyQixHQUFHLElBQUEsbUJBQVcs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LE1BQU0sRUFBRSxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsd0JBQXdCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFBO0lBQ3hGLE1BQU0sZUFBZSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLFVBQXVCLEVBQUUsS0FBbUIsRUFBRSxFQUFFO1FBQ25GLG9CQUFvQixDQUNsQixRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLDBDQUEwQyxFQUMxQztZQUNFLGlCQUFpQjtZQUNqQixVQUFVO1lBQ1YsS0FBSztZQUNMLFFBQVE7WUFDUixJQUFJO1NBQ0wsQ0FDRixDQUFBO0lBQ0gsQ0FBQyxFQUFFO1FBQ0Qsb0JBQW9CO1FBQ3BCLFFBQVE7UUFDUixtQkFBbUI7UUFDbkIsMENBQTBDO1FBQzFDLGlCQUFpQjtRQUNqQixRQUFRO1FBQ1IsSUFBSTtLQUNMLENBQUMsQ0FBQTtJQUVGLE9BQU87UUFDTCw0QkFBNEI7UUFDNUIscUJBQXFCO1FBQ3JCLGlCQUFpQjtRQUNqQixrQkFBa0I7UUFDbEIsV0FBVztRQUNYLHNCQUFzQjtRQUN0QixtQkFBbUI7UUFDbkIsa0JBQWtCO1FBQ2xCLFdBQVc7UUFDWCxvQkFBb0I7UUFDcEIsZUFBZTtLQUNoQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBMUtZLFFBQUEsT0FBTyxXQTBLbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLFxuICBDcmVkZW50aWFsLFxuICBDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcyxcbiAgQ3VzdG9tTW9kZWwsXG4gIE1vZGVsTW9kYWxNb2RlRW51bSxcbiAgTW9kZWxQcm92aWRlcixcbn0gZnJvbSAnLi4vLi4vZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZVJlZixcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHtcbiAgdXNlTW9kZWxNb2RhbEhhbmRsZXIsXG4gIHVzZVJlZnJlc2hNb2RlbCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnXG5pbXBvcnQgeyB1c2VEZWxldGVNb2RlbCB9IGZyb20gJ0Avc2VydmljZS91c2UtbW9kZWxzJ1xuaW1wb3J0IHsgdXNlQXV0aFNlcnZpY2UgfSBmcm9tICcuL3VzZS1hdXRoLXNlcnZpY2UnXG5cbmV4cG9ydCBjb25zdCB1c2VBdXRoID0gKFxuICBwcm92aWRlcjogTW9kZWxQcm92aWRlcixcbiAgY29uZmlndXJhdGlvbk1ldGhvZDogQ29uZmlndXJhdGlvbk1ldGhvZEVudW0sXG4gIGN1cnJlbnRDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcz86IEN1c3RvbUNvbmZpZ3VyYXRpb25Nb2RlbEZpeGVkRmllbGRzLFxuICBleHRyYToge1xuICAgIGlzTW9kZWxDcmVkZW50aWFsPzogYm9vbGVhblxuICAgIG9uVXBkYXRlPzogKG5ld1BheWxvYWQ/OiBhbnksIGZvcm1WYWx1ZXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB2b2lkXG4gICAgb25SZW1vdmU/OiAoY3JlZGVudGlhbElkOiBzdHJpbmcpID0+IHZvaWRcbiAgICBtb2RlPzogTW9kZWxNb2RhbE1vZGVFbnVtXG4gIH0gPSB7fSxcbikgPT4ge1xuICBjb25zdCB7XG4gICAgaXNNb2RlbENyZWRlbnRpYWwsXG4gICAgb25VcGRhdGUsXG4gICAgb25SZW1vdmUsXG4gICAgbW9kZSxcbiAgfSA9IGV4dHJhXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcbiAgY29uc3Qge1xuICAgIGdldERlbGV0ZUNyZWRlbnRpYWxTZXJ2aWNlLFxuICAgIGdldEFjdGl2ZUNyZWRlbnRpYWxTZXJ2aWNlLFxuICAgIGdldEVkaXRDcmVkZW50aWFsU2VydmljZSxcbiAgICBnZXRBZGRDcmVkZW50aWFsU2VydmljZSxcbiAgfSA9IHVzZUF1dGhTZXJ2aWNlKHByb3ZpZGVyLnByb3ZpZGVyKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBkZWxldGVNb2RlbFNlcnZpY2UgfSA9IHVzZURlbGV0ZU1vZGVsKHByb3ZpZGVyLnByb3ZpZGVyKVxuICBjb25zdCBoYW5kbGVPcGVuTW9kZWxNb2RhbCA9IHVzZU1vZGVsTW9kYWxIYW5kbGVyKClcbiAgY29uc3QgeyBoYW5kbGVSZWZyZXNoTW9kZWwgfSA9IHVzZVJlZnJlc2hNb2RlbCgpXG4gIGNvbnN0IHBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQgPSB1c2VSZWY8c3RyaW5nIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW2RlbGV0ZUNyZWRlbnRpYWxJZCwgc2V0RGVsZXRlQ3JlZGVudGlhbElkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IGhhbmRsZVNldERlbGV0ZUNyZWRlbnRpYWxJZCA9IHVzZUNhbGxiYWNrKChjcmVkZW50aWFsSWQ6IHN0cmluZyB8IG51bGwpID0+IHtcbiAgICBzZXREZWxldGVDcmVkZW50aWFsSWQoY3JlZGVudGlhbElkKVxuICAgIHBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQuY3VycmVudCA9IGNyZWRlbnRpYWxJZFxuICB9LCBbXSlcbiAgY29uc3QgcGVuZGluZ09wZXJhdGlvbk1vZGVsID0gdXNlUmVmPEN1c3RvbU1vZGVsIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW2RlbGV0ZU1vZGVsLCBzZXREZWxldGVNb2RlbF0gPSB1c2VTdGF0ZTxDdXN0b21Nb2RlbCB8IG51bGw+KG51bGwpXG4gIGNvbnN0IGhhbmRsZVNldERlbGV0ZU1vZGVsID0gdXNlQ2FsbGJhY2soKG1vZGVsOiBDdXN0b21Nb2RlbCB8IG51bGwpID0+IHtcbiAgICBzZXREZWxldGVNb2RlbChtb2RlbClcbiAgICBwZW5kaW5nT3BlcmF0aW9uTW9kZWwuY3VycmVudCA9IG1vZGVsXG4gIH0sIFtdKVxuICBjb25zdCBvcGVuQ29uZmlybURlbGV0ZSA9IHVzZUNhbGxiYWNrKChjcmVkZW50aWFsPzogQ3JlZGVudGlhbCwgbW9kZWw/OiBDdXN0b21Nb2RlbCkgPT4ge1xuICAgIGlmIChjcmVkZW50aWFsKVxuICAgICAgaGFuZGxlU2V0RGVsZXRlQ3JlZGVudGlhbElkKGNyZWRlbnRpYWwuY3JlZGVudGlhbF9pZClcbiAgICBpZiAobW9kZWwpXG4gICAgICBoYW5kbGVTZXREZWxldGVNb2RlbChtb2RlbClcbiAgfSwgW10pXG4gIGNvbnN0IGNsb3NlQ29uZmlybURlbGV0ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBoYW5kbGVTZXREZWxldGVDcmVkZW50aWFsSWQobnVsbClcbiAgICBoYW5kbGVTZXREZWxldGVNb2RlbChudWxsKVxuICB9LCBbXSlcbiAgY29uc3QgW2RvaW5nQWN0aW9uLCBzZXREb2luZ0FjdGlvbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgZG9pbmdBY3Rpb25SZWYgPSB1c2VSZWYoZG9pbmdBY3Rpb24pXG4gIGNvbnN0IGhhbmRsZVNldERvaW5nQWN0aW9uID0gdXNlQ2FsbGJhY2soKGRvaW5nOiBib29sZWFuKSA9PiB7XG4gICAgZG9pbmdBY3Rpb25SZWYuY3VycmVudCA9IGRvaW5nXG4gICAgc2V0RG9pbmdBY3Rpb24oZG9pbmcpXG4gIH0sIFtdKVxuICBjb25zdCBoYW5kbGVBY3RpdmVDcmVkZW50aWFsID0gdXNlQ2FsbGJhY2soYXN5bmMgKGNyZWRlbnRpYWw6IENyZWRlbnRpYWwsIG1vZGVsPzogQ3VzdG9tTW9kZWwpID0+IHtcbiAgICBpZiAoZG9pbmdBY3Rpb25SZWYuY3VycmVudClcbiAgICAgIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBoYW5kbGVTZXREb2luZ0FjdGlvbih0cnVlKVxuICAgICAgYXdhaXQgZ2V0QWN0aXZlQ3JlZGVudGlhbFNlcnZpY2UoISFtb2RlbCkoe1xuICAgICAgICBjcmVkZW50aWFsX2lkOiBjcmVkZW50aWFsLmNyZWRlbnRpYWxfaWQsXG4gICAgICAgIG1vZGVsOiBtb2RlbD8ubW9kZWwsXG4gICAgICAgIG1vZGVsX3R5cGU6IG1vZGVsPy5tb2RlbF90eXBlLFxuICAgICAgfSlcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnYXBpLmFjdGlvblN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIH0pXG4gICAgICBoYW5kbGVSZWZyZXNoTW9kZWwocHJvdmlkZXIsIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBoYW5kbGVTZXREb2luZ0FjdGlvbihmYWxzZSlcbiAgICB9XG4gIH0sIFtnZXRBY3RpdmVDcmVkZW50aWFsU2VydmljZSwgbm90aWZ5LCB0LCBoYW5kbGVTZXREb2luZ0FjdGlvbl0pXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm1EZWxldGUgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgaWYgKGRvaW5nQWN0aW9uUmVmLmN1cnJlbnQpXG4gICAgICByZXR1cm5cbiAgICBpZiAoIXBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQuY3VycmVudCAmJiAhcGVuZGluZ09wZXJhdGlvbk1vZGVsLmN1cnJlbnQpIHtcbiAgICAgIGNsb3NlQ29uZmlybURlbGV0ZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZVNldERvaW5nQWN0aW9uKHRydWUpXG4gICAgICBsZXQgcGF5bG9hZDogYW55ID0ge31cbiAgICAgIGlmIChwZW5kaW5nT3BlcmF0aW9uQ3JlZGVudGlhbElkLmN1cnJlbnQpIHtcbiAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICBjcmVkZW50aWFsX2lkOiBwZW5kaW5nT3BlcmF0aW9uQ3JlZGVudGlhbElkLmN1cnJlbnQsXG4gICAgICAgICAgbW9kZWw6IHBlbmRpbmdPcGVyYXRpb25Nb2RlbC5jdXJyZW50Py5tb2RlbCxcbiAgICAgICAgICBtb2RlbF90eXBlOiBwZW5kaW5nT3BlcmF0aW9uTW9kZWwuY3VycmVudD8ubW9kZWxfdHlwZSxcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBnZXREZWxldGVDcmVkZW50aWFsU2VydmljZSghIWlzTW9kZWxDcmVkZW50aWFsKShwYXlsb2FkKVxuICAgICAgfVxuICAgICAgaWYgKCFwZW5kaW5nT3BlcmF0aW9uQ3JlZGVudGlhbElkLmN1cnJlbnQgJiYgcGVuZGluZ09wZXJhdGlvbk1vZGVsLmN1cnJlbnQpIHtcbiAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICBtb2RlbDogcGVuZGluZ09wZXJhdGlvbk1vZGVsLmN1cnJlbnQubW9kZWwsXG4gICAgICAgICAgbW9kZWxfdHlwZTogcGVuZGluZ09wZXJhdGlvbk1vZGVsLmN1cnJlbnQubW9kZWxfdHlwZSxcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBkZWxldGVNb2RlbFNlcnZpY2UocGF5bG9hZClcbiAgICAgIH1cbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnYXBpLmFjdGlvblN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIH0pXG4gICAgICBoYW5kbGVSZWZyZXNoTW9kZWwocHJvdmlkZXIsIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICAgIG9uUmVtb3ZlPy4ocGVuZGluZ09wZXJhdGlvbkNyZWRlbnRpYWxJZC5jdXJyZW50ID8/ICcnKVxuICAgICAgY2xvc2VDb25maXJtRGVsZXRlKClcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBoYW5kbGVTZXREb2luZ0FjdGlvbihmYWxzZSlcbiAgICB9XG4gIH0sIFtub3RpZnksIHQsIGhhbmRsZVNldERvaW5nQWN0aW9uLCBnZXREZWxldGVDcmVkZW50aWFsU2VydmljZSwgaXNNb2RlbENyZWRlbnRpYWwsIGNsb3NlQ29uZmlybURlbGV0ZSwgaGFuZGxlUmVmcmVzaE1vZGVsLCBwcm92aWRlciwgY29uZmlndXJhdGlvbk1ldGhvZCwgZGVsZXRlTW9kZWxTZXJ2aWNlXSlcbiAgY29uc3QgaGFuZGxlU2F2ZUNyZWRlbnRpYWwgPSB1c2VDYWxsYmFjayhhc3luYyAocGF5bG9hZDogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGlmIChkb2luZ0FjdGlvblJlZi5jdXJyZW50KVxuICAgICAgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZVNldERvaW5nQWN0aW9uKHRydWUpXG5cbiAgICAgIGxldCByZXM6IHsgcmVzdWx0Pzogc3RyaW5nIH0gPSB7fVxuICAgICAgaWYgKHBheWxvYWQuY3JlZGVudGlhbF9pZClcbiAgICAgICAgcmVzID0gYXdhaXQgZ2V0RWRpdENyZWRlbnRpYWxTZXJ2aWNlKCEhaXNNb2RlbENyZWRlbnRpYWwpKHBheWxvYWQgYXMgYW55KVxuICAgICAgZWxzZVxuICAgICAgICByZXMgPSBhd2FpdCBnZXRBZGRDcmVkZW50aWFsU2VydmljZSghIWlzTW9kZWxDcmVkZW50aWFsKShwYXlsb2FkIGFzIGFueSlcblxuICAgICAgaWYgKHJlcy5yZXN1bHQgPT09ICdzdWNjZXNzJykge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6IHQoJ2FjdGlvbk1zZy5tb2RpZmllZFN1Y2Nlc3NmdWxseScsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgICAgIGhhbmRsZVJlZnJlc2hNb2RlbChwcm92aWRlciwgdW5kZWZpbmVkLCAhcGF5bG9hZC5jcmVkZW50aWFsX2lkKVxuICAgICAgfVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIGhhbmRsZVNldERvaW5nQWN0aW9uKGZhbHNlKVxuICAgIH1cbiAgfSwgW25vdGlmeSwgdCwgaGFuZGxlU2V0RG9pbmdBY3Rpb24sIGdldEVkaXRDcmVkZW50aWFsU2VydmljZSwgZ2V0QWRkQ3JlZGVudGlhbFNlcnZpY2VdKVxuICBjb25zdCBoYW5kbGVPcGVuTW9kYWwgPSB1c2VDYWxsYmFjaygoY3JlZGVudGlhbD86IENyZWRlbnRpYWwsIG1vZGVsPzogQ3VzdG9tTW9kZWwpID0+IHtcbiAgICBoYW5kbGVPcGVuTW9kZWxNb2RhbChcbiAgICAgIHByb3ZpZGVyLFxuICAgICAgY29uZmlndXJhdGlvbk1ldGhvZCxcbiAgICAgIGN1cnJlbnRDdXN0b21Db25maWd1cmF0aW9uTW9kZWxGaXhlZEZpZWxkcyxcbiAgICAgIHtcbiAgICAgICAgaXNNb2RlbENyZWRlbnRpYWwsXG4gICAgICAgIGNyZWRlbnRpYWwsXG4gICAgICAgIG1vZGVsLFxuICAgICAgICBvblVwZGF0ZSxcbiAgICAgICAgbW9kZSxcbiAgICAgIH0sXG4gICAgKVxuICB9LCBbXG4gICAgaGFuZGxlT3Blbk1vZGVsTW9kYWwsXG4gICAgcHJvdmlkZXIsXG4gICAgY29uZmlndXJhdGlvbk1ldGhvZCxcbiAgICBjdXJyZW50Q3VzdG9tQ29uZmlndXJhdGlvbk1vZGVsRml4ZWRGaWVsZHMsXG4gICAgaXNNb2RlbENyZWRlbnRpYWwsXG4gICAgb25VcGRhdGUsXG4gICAgbW9kZSxcbiAgXSlcblxuICByZXR1cm4ge1xuICAgIHBlbmRpbmdPcGVyYXRpb25DcmVkZW50aWFsSWQsXG4gICAgcGVuZGluZ09wZXJhdGlvbk1vZGVsLFxuICAgIG9wZW5Db25maXJtRGVsZXRlLFxuICAgIGNsb3NlQ29uZmlybURlbGV0ZSxcbiAgICBkb2luZ0FjdGlvbixcbiAgICBoYW5kbGVBY3RpdmVDcmVkZW50aWFsLFxuICAgIGhhbmRsZUNvbmZpcm1EZWxldGUsXG4gICAgZGVsZXRlQ3JlZGVudGlhbElkLFxuICAgIGRlbGV0ZU1vZGVsLFxuICAgIGhhbmRsZVNhdmVDcmVkZW50aWFsLFxuICAgIGhhbmRsZU9wZW5Nb2RhbCxcbiAgfVxufVxuIl19