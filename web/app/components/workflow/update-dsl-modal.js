"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const js_yaml_1 = require("js-yaml");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const uploader_1 = require("@/app/components/app/create-from-dsl-modal/uploader");
const store_1 = require("@/app/components/app/store");
const button_1 = require("@/app/components/base/button");
const modal_1 = require("@/app/components/base/modal");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/workflow/plugin-dependency/hooks");
const event_emitter_1 = require("@/context/event-emitter");
const app_1 = require("@/models/app");
const apps_1 = require("@/service/apps");
const workflow_1 = require("@/service/workflow");
const app_2 = require("@/types/app");
const constants_2 = require("./constants");
const types_1 = require("./types");
const utils_1 = require("./utils");
const UpdateDSLModal = ({ onCancel, onBackup, onImport, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, use_context_selector_1.useContext)(toast_1.ToastContext);
    const appDetail = (0, store_1.useStore)(s => s.appDetail);
    const [currentFile, setDSLFile] = (0, react_2.useState)();
    const [fileContent, setFileContent] = (0, react_2.useState)();
    const [loading, setLoading] = (0, react_2.useState)(false);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const [show, setShow] = (0, react_2.useState)(true);
    const [showErrorModal, setShowErrorModal] = (0, react_2.useState)(false);
    const [versions, setVersions] = (0, react_2.useState)();
    const [importId, setImportId] = (0, react_2.useState)();
    const { handleCheckPluginDependencies } = (0, hooks_1.usePluginDependencies)();
    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const content = event.target?.result;
            setFileContent(content);
        };
        reader.readAsText(file);
    };
    const handleFile = (file) => {
        setDSLFile(file);
        if (file)
            readFile(file);
        if (!file)
            setFileContent('');
    };
    const handleWorkflowUpdate = (0, react_2.useCallback)(async (app_id) => {
        const { graph, features, hash, conversation_variables, environment_variables, } = await (0, workflow_1.fetchWorkflowDraft)(`/apps/${app_id}/workflows/draft`);
        const { nodes, edges, viewport } = graph;
        const newFeatures = {
            file: {
                image: {
                    enabled: !!features.file_upload?.image?.enabled,
                    number_limits: features.file_upload?.image?.number_limits || 3,
                    transfer_methods: features.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
                },
                enabled: !!(features.file_upload?.enabled || features.file_upload?.image?.enabled),
                allowed_file_types: features.file_upload?.allowed_file_types || [types_1.SupportUploadFileTypes.image],
                allowed_file_extensions: features.file_upload?.allowed_file_extensions || constants_1.FILE_EXTS[types_1.SupportUploadFileTypes.image].map(ext => `.${ext}`),
                allowed_file_upload_methods: features.file_upload?.allowed_file_upload_methods || features.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
                number_limits: features.file_upload?.number_limits || features.file_upload?.image?.number_limits || 3,
            },
            opening: {
                enabled: !!features.opening_statement,
                opening_statement: features.opening_statement,
                suggested_questions: features.suggested_questions,
            },
            suggested: features.suggested_questions_after_answer || { enabled: false },
            speech2text: features.speech_to_text || { enabled: false },
            text2speech: features.text_to_speech || { enabled: false },
            citation: features.retriever_resource || { enabled: false },
            moderation: features.sensitive_word_avoidance || { enabled: false },
        };
        eventEmitter?.emit({
            type: constants_2.WORKFLOW_DATA_UPDATE,
            payload: {
                nodes: (0, utils_1.initialNodes)(nodes, edges),
                edges: (0, utils_1.initialEdges)(edges, nodes),
                viewport,
                features: newFeatures,
                hash,
                conversation_variables: conversation_variables || [],
                environment_variables: environment_variables || [],
            },
        });
    }, [eventEmitter]);
    const validateDSLContent = (content) => {
        try {
            const data = (0, js_yaml_1.load)(content);
            const nodes = data?.workflow?.graph?.nodes ?? [];
            const invalidNodes = appDetail?.mode === app_2.AppModeEnum.ADVANCED_CHAT
                ? [
                    types_1.BlockEnum.End,
                    types_1.BlockEnum.TriggerWebhook,
                    types_1.BlockEnum.TriggerSchedule,
                    types_1.BlockEnum.TriggerPlugin,
                ]
                : [types_1.BlockEnum.Answer];
            const hasInvalidNode = nodes.some((node) => {
                return invalidNodes.includes(node?.data?.type);
            });
            if (hasInvalidNode) {
                notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
                return false;
            }
            return true;
        }
        catch {
            notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
            return false;
        }
    };
    const isCreatingRef = (0, react_2.useRef)(false);
    const handleImport = (0, react_2.useCallback)(async () => {
        if (isCreatingRef.current)
            return;
        isCreatingRef.current = true;
        if (!currentFile)
            return;
        try {
            if (appDetail && fileContent && validateDSLContent(fileContent)) {
                setLoading(true);
                const response = await (0, apps_1.importDSL)({ mode: app_1.DSLImportMode.YAML_CONTENT, yaml_content: fileContent, app_id: appDetail.id });
                const { id, status, app_id, imported_dsl_version, current_dsl_version } = response;
                if (status === app_1.DSLImportStatus.COMPLETED || status === app_1.DSLImportStatus.COMPLETED_WITH_WARNINGS) {
                    if (!app_id) {
                        notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
                        return;
                    }
                    handleWorkflowUpdate(app_id);
                    if (onImport)
                        onImport();
                    notify({
                        type: status === app_1.DSLImportStatus.COMPLETED ? 'success' : 'warning',
                        message: t(status === app_1.DSLImportStatus.COMPLETED ? 'common.importSuccess' : 'common.importWarning', { ns: 'workflow' }),
                        children: status === app_1.DSLImportStatus.COMPLETED_WITH_WARNINGS && t('common.importWarningDetails', { ns: 'workflow' }),
                    });
                    await handleCheckPluginDependencies(app_id);
                    setLoading(false);
                    onCancel();
                }
                else if (status === app_1.DSLImportStatus.PENDING) {
                    setShow(false);
                    setTimeout(() => {
                        setShowErrorModal(true);
                    }, 300);
                    setVersions({
                        importedVersion: imported_dsl_version ?? '',
                        systemVersion: current_dsl_version ?? '',
                    });
                    setImportId(id);
                }
                else {
                    setLoading(false);
                    notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
                }
            }
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (e) {
            setLoading(false);
            notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
        }
        isCreatingRef.current = false;
    }, [currentFile, fileContent, onCancel, notify, t, appDetail, onImport, handleWorkflowUpdate, handleCheckPluginDependencies]);
    const onUpdateDSLConfirm = async () => {
        try {
            if (!importId)
                return;
            const response = await (0, apps_1.importDSLConfirm)({
                import_id: importId,
            });
            const { status, app_id } = response;
            if (status === app_1.DSLImportStatus.COMPLETED) {
                if (!app_id) {
                    notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
                    return;
                }
                handleWorkflowUpdate(app_id);
                await handleCheckPluginDependencies(app_id);
                if (onImport)
                    onImport();
                notify({ type: 'success', message: t('common.importSuccess', { ns: 'workflow' }) });
                setLoading(false);
                onCancel();
            }
            else if (status === app_1.DSLImportStatus.FAILED) {
                setLoading(false);
                notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
            }
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (e) {
            setLoading(false);
            notify({ type: 'error', message: t('common.importFailure', { ns: 'workflow' }) });
        }
    };
    return (<>
      <modal_1.default className="w-[520px] rounded-2xl p-6" isShow={show} onClose={onCancel}>
        <div className="mb-3 flex items-center justify-between">
          <div className="title-2xl-semi-bold text-text-primary">{t('common.importDSL', { ns: 'workflow' })}</div>
          <div className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center" onClick={onCancel}>
            <react_1.RiCloseLine className="h-[18px] w-[18px] text-text-tertiary"/>
          </div>
        </div>
        <div className="relative mb-2 flex grow gap-0.5 overflow-hidden rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-2 shadow-xs">
          <div className="absolute left-0 top-0 h-full w-full bg-toast-warning-bg opacity-40"/>
          <div className="flex items-start justify-center p-1">
            <react_1.RiAlertFill className="h-4 w-4 shrink-0 text-text-warning-secondary"/>
          </div>
          <div className="flex grow flex-col items-start gap-0.5 py-1">
            <div className="system-xs-medium whitespace-pre-line text-text-primary">{t('common.importDSLTip', { ns: 'workflow' })}</div>
            <div className="flex items-start gap-1 self-stretch pb-0.5 pt-1">
              <button_1.default size="small" variant="secondary" className="z-[1000]" onClick={onBackup}>
                <react_1.RiFileDownloadLine className="h-3.5 w-3.5 text-components-button-secondary-text"/>
                <div className="flex items-center justify-center gap-1 px-[3px]">
                  {t('common.backupCurrentDraft', { ns: 'workflow' })}
                </div>
              </button_1.default>
            </div>
          </div>
        </div>
        <div>
          <div className="system-md-semibold pt-2 text-text-primary">
            {t('common.chooseDSL', { ns: 'workflow' })}
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-4 self-stretch py-4">
            <uploader_1.default file={currentFile} updateFile={handleFile} className="!mt-0 w-full"/>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 self-stretch pt-5">
          <button_1.default onClick={onCancel}>{t('newApp.Cancel', { ns: 'app' })}</button_1.default>
          <button_1.default disabled={!currentFile || loading} variant="warning" onClick={handleImport} loading={loading}>
            {t('common.overwriteAndImport', { ns: 'workflow' })}
          </button_1.default>
        </div>
      </modal_1.default>
      <modal_1.default isShow={showErrorModal} onClose={() => setShowErrorModal(false)} className="w-[480px]">
        <div className="flex flex-col items-start gap-2 self-stretch pb-4">
          <div className="title-2xl-semi-bold text-text-primary">{t('newApp.appCreateDSLErrorTitle', { ns: 'app' })}</div>
          <div className="system-md-regular flex grow flex-col text-text-secondary">
            <div>{t('newApp.appCreateDSLErrorPart1', { ns: 'app' })}</div>
            <div>{t('newApp.appCreateDSLErrorPart2', { ns: 'app' })}</div>
            <br />
            <div>
              {t('newApp.appCreateDSLErrorPart3', { ns: 'app' })}
              <span className="system-md-medium">{versions?.importedVersion}</span>
            </div>
            <div>
              {t('newApp.appCreateDSLErrorPart4', { ns: 'app' })}
              <span className="system-md-medium">{versions?.systemVersion}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-end gap-2 self-stretch pt-6">
          <button_1.default variant="secondary" onClick={() => setShowErrorModal(false)}>{t('newApp.Cancel', { ns: 'app' })}</button_1.default>
          <button_1.default variant="primary" destructive onClick={onUpdateDSLConfirm}>{t('newApp.Confirm', { ns: 'app' })}</button_1.default>
        </div>
      </modal_1.default>
    </>);
};
exports.default = (0, react_2.memo)(UpdateDSLModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLWRzbC1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVwZGF0ZS1kc2wtbW9kYWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBT1osNENBSXlCO0FBQ3pCLHFDQUEwQztBQUMxQyxpQ0FLYztBQUNkLGlEQUE4QztBQUM5QywrREFBaUQ7QUFDakQsa0ZBQTBFO0FBQzFFLHNEQUFvRTtBQUNwRSx5REFBaUQ7QUFDakQsdURBQStDO0FBQy9DLDZFQUF5RTtBQUN6RSx1REFBMEQ7QUFDMUQsNkVBQXlGO0FBQ3pGLDJEQUF1RTtBQUN2RSxzQ0FHcUI7QUFDckIseUNBR3VCO0FBQ3ZCLGlEQUF1RDtBQUN2RCxxQ0FBeUM7QUFDekMsMkNBQWtEO0FBQ2xELG1DQUdnQjtBQUNoQixtQ0FHZ0I7QUFRaEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUN0QixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsR0FDWSxFQUFFLEVBQUU7SUFDeEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGlDQUFVLEVBQUMsb0JBQVksQ0FBQyxDQUFBO0lBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUEsZ0JBQVcsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMvQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsR0FBUSxDQUFBO0lBQ2xELE1BQU0sQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxHQUFVLENBQUE7SUFDeEQsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0MsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUEsNkNBQTZCLEdB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QUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNEQUFzRCxDQUNuRTtVQUFBLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBTSxDQUNoSDtVQUFBLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBTSxDQUNqSDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxlQUFLLENBQ1Q7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUEsWUFBSSxFQUFDLGNBQWMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgTW91c2VFdmVudEhhbmRsZXIgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHtcbiAgQ29tbW9uTm9kZVR5cGUsXG4gIE5vZGUsXG59IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQge1xuICBSaUFsZXJ0RmlsbCxcbiAgUmlDbG9zZUxpbmUsXG4gIFJpRmlsZURvd25sb2FkTGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IGxvYWQgYXMgeWFtbExvYWQgfSBmcm9tICdqcy15YW1sJ1xuaW1wb3J0IHtcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZVJlZixcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuaW1wb3J0IFVwbG9hZGVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2NyZWF0ZS1mcm9tLWRzbC1tb2RhbC91cGxvYWRlcidcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21vZGFsJ1xuaW1wb3J0IHsgRklMRV9FWFRTIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IHsgVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgdXNlUGx1Z2luRGVwZW5kZW5jaWVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wbHVnaW4tZGVwZW5kZW5jeS9ob29rcydcbmltcG9ydCB7IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQge1xuICBEU0xJbXBvcnRNb2RlLFxuICBEU0xJbXBvcnRTdGF0dXMsXG59IGZyb20gJ0AvbW9kZWxzL2FwcCdcbmltcG9ydCB7XG4gIGltcG9ydERTTCxcbiAgaW1wb3J0RFNMQ29uZmlybSxcbn0gZnJvbSAnQC9zZXJ2aWNlL2FwcHMnXG5pbXBvcnQgeyBmZXRjaFdvcmtmbG93RHJhZnQgfSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgV09SS0ZMT1dfREFUQV9VUERBVEUgfSBmcm9tICcuL2NvbnN0YW50cydcbmltcG9ydCB7XG4gIEJsb2NrRW51bSxcbiAgU3VwcG9ydFVwbG9hZEZpbGVUeXBlcyxcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7XG4gIGluaXRpYWxFZGdlcyxcbiAgaW5pdGlhbE5vZGVzLFxufSBmcm9tICcuL3V0aWxzJ1xuXG50eXBlIFVwZGF0ZURTTE1vZGFsUHJvcHMgPSB7XG4gIG9uQ2FuY2VsOiAoKSA9PiB2b2lkXG4gIG9uQmFja3VwOiAoKSA9PiB2b2lkXG4gIG9uSW1wb3J0PzogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBVcGRhdGVEU0xNb2RhbCA9ICh7XG4gIG9uQ2FuY2VsLFxuICBvbkJhY2t1cCxcbiAgb25JbXBvcnQsXG59OiBVcGRhdGVEU0xNb2RhbFByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlQ29udGV4dChUb2FzdENvbnRleHQpXG4gIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHMgPT4gcy5hcHBEZXRhaWwpXG4gIGNvbnN0IFtjdXJyZW50RmlsZSwgc2V0RFNMRmlsZV0gPSB1c2VTdGF0ZTxGaWxlPigpXG4gIGNvbnN0IFtmaWxlQ29udGVudCwgc2V0RmlsZUNvbnRlbnRdID0gdXNlU3RhdGU8c3RyaW5nPigpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IGV2ZW50RW1pdHRlciB9ID0gdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQoKVxuICBjb25zdCBbc2hvdywgc2V0U2hvd10gPSB1c2VTdGF0ZSh0cnVlKVxuICBjb25zdCBbc2hvd0Vycm9yTW9kYWwsIHNldFNob3dFcnJvck1vZGFsXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbdmVyc2lvbnMsIHNldFZlcnNpb25zXSA9IHVzZVN0YXRlPHsgaW1wb3J0ZWRWZXJzaW9uOiBzdHJpbmcsIHN5c3RlbVZlcnNpb246IHN0cmluZyB9PigpXG4gIGNvbnN0IFtpbXBvcnRJZCwgc2V0SW1wb3J0SWRdID0gdXNlU3RhdGU8c3RyaW5nPigpXG4gIGNvbnN0IHsgaGFuZGxlQ2hlY2tQbHVnaW5EZXBlbmRlbmNpZXMgfSA9IHVzZVBsdWdpbkRlcGVuZGVuY2llcygpXG5cbiAgY29uc3QgcmVhZEZpbGUgPSAoZmlsZTogRmlsZSkgPT4ge1xuICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBjb25zdCBjb250ZW50ID0gZXZlbnQudGFyZ2V0Py5yZXN1bHRcbiAgICAgIHNldEZpbGVDb250ZW50KGNvbnRlbnQgYXMgc3RyaW5nKVxuICAgIH1cbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlRmlsZSA9IChmaWxlPzogRmlsZSkgPT4ge1xuICAgIHNldERTTEZpbGUoZmlsZSlcbiAgICBpZiAoZmlsZSlcbiAgICAgIHJlYWRGaWxlKGZpbGUpXG4gICAgaWYgKCFmaWxlKVxuICAgICAgc2V0RmlsZUNvbnRlbnQoJycpXG4gIH1cblxuICBjb25zdCBoYW5kbGVXb3JrZmxvd1VwZGF0ZSA9IHVzZUNhbGxiYWNrKGFzeW5jIChhcHBfaWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGdyYXBoLFxuICAgICAgZmVhdHVyZXMsXG4gICAgICBoYXNoLFxuICAgICAgY29udmVyc2F0aW9uX3ZhcmlhYmxlcyxcbiAgICAgIGVudmlyb25tZW50X3ZhcmlhYmxlcyxcbiAgICB9ID0gYXdhaXQgZmV0Y2hXb3JrZmxvd0RyYWZ0KGAvYXBwcy8ke2FwcF9pZH0vd29ya2Zsb3dzL2RyYWZ0YClcblxuICAgIGNvbnN0IHsgbm9kZXMsIGVkZ2VzLCB2aWV3cG9ydCB9ID0gZ3JhcGhcbiAgICBjb25zdCBuZXdGZWF0dXJlcyA9IHtcbiAgICAgIGZpbGU6IHtcbiAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICBlbmFibGVkOiAhIWZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8uZW5hYmxlZCxcbiAgICAgICAgICBudW1iZXJfbGltaXRzOiBmZWF0dXJlcy5maWxlX3VwbG9hZD8uaW1hZ2U/Lm51bWJlcl9saW1pdHMgfHwgMyxcbiAgICAgICAgICB0cmFuc2Zlcl9tZXRob2RzOiBmZWF0dXJlcy5maWxlX3VwbG9hZD8uaW1hZ2U/LnRyYW5zZmVyX21ldGhvZHMgfHwgWydsb2NhbF9maWxlJywgJ3JlbW90ZV91cmwnXSxcbiAgICAgICAgfSxcbiAgICAgICAgZW5hYmxlZDogISEoZmVhdHVyZXMuZmlsZV91cGxvYWQ/LmVuYWJsZWQgfHwgZmVhdHVyZXMuZmlsZV91cGxvYWQ/LmltYWdlPy5lbmFibGVkKSxcbiAgICAgICAgYWxsb3dlZF9maWxlX3R5cGVzOiBmZWF0dXJlcy5maWxlX3VwbG9hZD8uYWxsb3dlZF9maWxlX3R5cGVzIHx8IFtTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmltYWdlXSxcbiAgICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucyB8fCBGSUxFX0VYVFNbU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZV0ubWFwKGV4dCA9PiBgLiR7ZXh0fWApLFxuICAgICAgICBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMgfHwgZmVhdHVyZXMuZmlsZV91cGxvYWQ/LmltYWdlPy50cmFuc2Zlcl9tZXRob2RzIHx8IFsnbG9jYWxfZmlsZScsICdyZW1vdGVfdXJsJ10sXG4gICAgICAgIG51bWJlcl9saW1pdHM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5udW1iZXJfbGltaXRzIHx8IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8ubnVtYmVyX2xpbWl0cyB8fCAzLFxuICAgICAgfSxcbiAgICAgIG9wZW5pbmc6IHtcbiAgICAgICAgZW5hYmxlZDogISFmZWF0dXJlcy5vcGVuaW5nX3N0YXRlbWVudCxcbiAgICAgICAgb3BlbmluZ19zdGF0ZW1lbnQ6IGZlYXR1cmVzLm9wZW5pbmdfc3RhdGVtZW50LFxuICAgICAgICBzdWdnZXN0ZWRfcXVlc3Rpb25zOiBmZWF0dXJlcy5zdWdnZXN0ZWRfcXVlc3Rpb25zLFxuICAgICAgfSxcbiAgICAgIHN1Z2dlc3RlZDogZmVhdHVyZXMuc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXIgfHwgeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgc3BlZWNoMnRleHQ6IGZlYXR1cmVzLnNwZWVjaF90b190ZXh0IHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgIHRleHQyc3BlZWNoOiBmZWF0dXJlcy50ZXh0X3RvX3NwZWVjaCB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICBjaXRhdGlvbjogZmVhdHVyZXMucmV0cmlldmVyX3Jlc291cmNlIHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgIG1vZGVyYXRpb246IGZlYXR1cmVzLnNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZSB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgfVxuXG4gICAgZXZlbnRFbWl0dGVyPy5lbWl0KHtcbiAgICAgIHR5cGU6IFdPUktGTE9XX0RBVEFfVVBEQVRFLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBub2RlczogaW5pdGlhbE5vZGVzKG5vZGVzLCBlZGdlcyksXG4gICAgICAgIGVkZ2VzOiBpbml0aWFsRWRnZXMoZWRnZXMsIG5vZGVzKSxcbiAgICAgICAgdmlld3BvcnQsXG4gICAgICAgIGZlYXR1cmVzOiBuZXdGZWF0dXJlcyxcbiAgICAgICAgaGFzaCxcbiAgICAgICAgY29udmVyc2F0aW9uX3ZhcmlhYmxlczogY29udmVyc2F0aW9uX3ZhcmlhYmxlcyB8fCBbXSxcbiAgICAgICAgZW52aXJvbm1lbnRfdmFyaWFibGVzOiBlbnZpcm9ubWVudF92YXJpYWJsZXMgfHwgW10sXG4gICAgICB9LFxuICAgIH0gYXMgYW55KVxuICB9LCBbZXZlbnRFbWl0dGVyXSlcblxuICBjb25zdCB2YWxpZGF0ZURTTENvbnRlbnQgPSAoY29udGVudDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRhdGEgPSB5YW1sTG9hZChjb250ZW50KSBhcyBhbnlcbiAgICAgIGNvbnN0IG5vZGVzID0gZGF0YT8ud29ya2Zsb3c/LmdyYXBoPy5ub2RlcyA/PyBbXVxuICAgICAgY29uc3QgaW52YWxpZE5vZGVzID0gYXBwRGV0YWlsPy5tb2RlID09PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUXG4gICAgICAgID8gW1xuICAgICAgICAgICAgQmxvY2tFbnVtLkVuZCxcbiAgICAgICAgICAgIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vayxcbiAgICAgICAgICAgIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsXG4gICAgICAgICAgICBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbixcbiAgICAgICAgICBdXG4gICAgICAgIDogW0Jsb2NrRW51bS5BbnN3ZXJdXG4gICAgICBjb25zdCBoYXNJbnZhbGlkTm9kZSA9IG5vZGVzLnNvbWUoKG5vZGU6IE5vZGU8Q29tbW9uTm9kZVR5cGU+KSA9PiB7XG4gICAgICAgIHJldHVybiBpbnZhbGlkTm9kZXMuaW5jbHVkZXMobm9kZT8uZGF0YT8udHlwZSlcbiAgICAgIH0pXG4gICAgICBpZiAoaGFzSW52YWxpZE5vZGUpIHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLmltcG9ydEZhaWx1cmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLmltcG9ydEZhaWx1cmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb25zdCBpc0NyZWF0aW5nUmVmID0gdXNlUmVmKGZhbHNlKVxuICBjb25zdCBoYW5kbGVJbXBvcnQ6IE1vdXNlRXZlbnRIYW5kbGVyID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmIChpc0NyZWF0aW5nUmVmLmN1cnJlbnQpXG4gICAgICByZXR1cm5cbiAgICBpc0NyZWF0aW5nUmVmLmN1cnJlbnQgPSB0cnVlXG4gICAgaWYgKCFjdXJyZW50RmlsZSlcbiAgICAgIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBpZiAoYXBwRGV0YWlsICYmIGZpbGVDb250ZW50ICYmIHZhbGlkYXRlRFNMQ29udGVudChmaWxlQ29udGVudCkpIHtcbiAgICAgICAgc2V0TG9hZGluZyh0cnVlKVxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGltcG9ydERTTCh7IG1vZGU6IERTTEltcG9ydE1vZGUuWUFNTF9DT05URU5ULCB5YW1sX2NvbnRlbnQ6IGZpbGVDb250ZW50LCBhcHBfaWQ6IGFwcERldGFpbC5pZCB9KVxuICAgICAgICBjb25zdCB7IGlkLCBzdGF0dXMsIGFwcF9pZCwgaW1wb3J0ZWRfZHNsX3ZlcnNpb24sIGN1cnJlbnRfZHNsX3ZlcnNpb24gfSA9IHJlc3BvbnNlXG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gRFNMSW1wb3J0U3RhdHVzLkNPTVBMRVRFRCB8fCBzdGF0dXMgPT09IERTTEltcG9ydFN0YXR1cy5DT01QTEVURURfV0lUSF9XQVJOSU5HUykge1xuICAgICAgICAgIGlmICghYXBwX2lkKSB7XG4gICAgICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdjb21tb24uaW1wb3J0RmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBoYW5kbGVXb3JrZmxvd1VwZGF0ZShhcHBfaWQpXG4gICAgICAgICAgaWYgKG9uSW1wb3J0KVxuICAgICAgICAgICAgb25JbXBvcnQoKVxuICAgICAgICAgIG5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiBzdGF0dXMgPT09IERTTEltcG9ydFN0YXR1cy5DT01QTEVURUQgPyAnc3VjY2VzcycgOiAnd2FybmluZycsXG4gICAgICAgICAgICBtZXNzYWdlOiB0KHN0YXR1cyA9PT0gRFNMSW1wb3J0U3RhdHVzLkNPTVBMRVRFRCA/ICdjb21tb24uaW1wb3J0U3VjY2VzcycgOiAnY29tbW9uLmltcG9ydFdhcm5pbmcnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICAgICAgY2hpbGRyZW46IHN0YXR1cyA9PT0gRFNMSW1wb3J0U3RhdHVzLkNPTVBMRVRFRF9XSVRIX1dBUk5JTkdTICYmIHQoJ2NvbW1vbi5pbXBvcnRXYXJuaW5nRGV0YWlscycsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgfSlcbiAgICAgICAgICBhd2FpdCBoYW5kbGVDaGVja1BsdWdpbkRlcGVuZGVuY2llcyhhcHBfaWQpXG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICAgICAgICBvbkNhbmNlbCgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhdHVzID09PSBEU0xJbXBvcnRTdGF0dXMuUEVORElORykge1xuICAgICAgICAgIHNldFNob3coZmFsc2UpXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZXRTaG93RXJyb3JNb2RhbCh0cnVlKVxuICAgICAgICAgIH0sIDMwMClcbiAgICAgICAgICBzZXRWZXJzaW9ucyh7XG4gICAgICAgICAgICBpbXBvcnRlZFZlcnNpb246IGltcG9ydGVkX2RzbF92ZXJzaW9uID8/ICcnLFxuICAgICAgICAgICAgc3lzdGVtVmVyc2lvbjogY3VycmVudF9kc2xfdmVyc2lvbiA/PyAnJyxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNldEltcG9ydElkKGlkKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLmltcG9ydEZhaWx1cmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVudXNlZC1pbXBvcnRzL25vLXVudXNlZC12YXJzXG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdjb21tb24uaW1wb3J0RmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICB9XG4gICAgaXNDcmVhdGluZ1JlZi5jdXJyZW50ID0gZmFsc2VcbiAgfSwgW2N1cnJlbnRGaWxlLCBmaWxlQ29udGVudCwgb25DYW5jZWwsIG5vdGlmeSwgdCwgYXBwRGV0YWlsLCBvbkltcG9ydCwgaGFuZGxlV29ya2Zsb3dVcGRhdGUsIGhhbmRsZUNoZWNrUGx1Z2luRGVwZW5kZW5jaWVzXSlcblxuICBjb25zdCBvblVwZGF0ZURTTENvbmZpcm06IE1vdXNlRXZlbnRIYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWltcG9ydElkKVxuICAgICAgICByZXR1cm5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW1wb3J0RFNMQ29uZmlybSh7XG4gICAgICAgIGltcG9ydF9pZDogaW1wb3J0SWQsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHN0YXR1cywgYXBwX2lkIH0gPSByZXNwb25zZVxuXG4gICAgICBpZiAoc3RhdHVzID09PSBEU0xJbXBvcnRTdGF0dXMuQ09NUExFVEVEKSB7XG4gICAgICAgIGlmICghYXBwX2lkKSB7XG4gICAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLmltcG9ydEZhaWx1cmUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlV29ya2Zsb3dVcGRhdGUoYXBwX2lkKVxuICAgICAgICBhd2FpdCBoYW5kbGVDaGVja1BsdWdpbkRlcGVuZGVuY2llcyhhcHBfaWQpXG4gICAgICAgIGlmIChvbkltcG9ydClcbiAgICAgICAgICBvbkltcG9ydCgpXG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogdCgnY29tbW9uLmltcG9ydFN1Y2Nlc3MnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgICAgIG9uQ2FuY2VsKClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHN0YXR1cyA9PT0gRFNMSW1wb3J0U3RhdHVzLkZBSUxFRCkge1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdjb21tb24uaW1wb3J0RmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHVudXNlZC1pbXBvcnRzL25vLXVudXNlZC12YXJzXG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdjb21tb24uaW1wb3J0RmFpbHVyZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8TW9kYWxcbiAgICAgICAgY2xhc3NOYW1lPVwidy1bNTIwcHhdIHJvdW5kZWQtMnhsIHAtNlwiXG4gICAgICAgIGlzU2hvdz17c2hvd31cbiAgICAgICAgb25DbG9zZT17b25DYW5jZWx9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlLTJ4bC1zZW1pLWJvbGQgdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnY29tbW9uLmltcG9ydERTTCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtWzIycHhdIHctWzIycHhdIGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5cbiAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLVsxOHB4XSB3LVsxOHB4XSB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtYi0yIGZsZXggZ3JvdyBnYXAtMC41IG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgcC0yIHNoYWRvdy14c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0wIHRvcC0wIGgtZnVsbCB3LWZ1bGwgYmctdG9hc3Qtd2FybmluZy1iZyBvcGFjaXR5LTQwXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1jZW50ZXIgcC0xXCI+XG4gICAgICAgICAgICA8UmlBbGVydEZpbGwgY2xhc3NOYW1lPVwiaC00IHctNCBzaHJpbmstMCB0ZXh0LXRleHQtd2FybmluZy1zZWNvbmRhcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGdhcC0wLjUgcHktMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtIHdoaXRlc3BhY2UtcHJlLWxpbmUgdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnY29tbW9uLmltcG9ydERTTFRpcCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTEgc2VsZi1zdHJldGNoIHBiLTAuNSBwdC0xXCI+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICBzaXplPVwic21hbGxcIlxuICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInotWzEwMDBdXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkJhY2t1cH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxSaUZpbGVEb3dubG9hZExpbmUgY2xhc3NOYW1lPVwiaC0zLjUgdy0zLjUgdGV4dC1jb21wb25lbnRzLWJ1dHRvbi1zZWNvbmRhcnktdGV4dFwiIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMSBweC1bM3B4XVwiPlxuICAgICAgICAgICAgICAgICAge3QoJ2NvbW1vbi5iYWNrdXBDdXJyZW50RHJhZnQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZCBwdC0yIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICB7dCgnY29tbW9uLmNob29zZURTTCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBmbGV4LWNvbCBpdGVtcy1zdGFydCBqdXN0aWZ5LWNlbnRlciBnYXAtNCBzZWxmLXN0cmV0Y2ggcHktNFwiPlxuICAgICAgICAgICAgPFVwbG9hZGVyXG4gICAgICAgICAgICAgIGZpbGU9e2N1cnJlbnRGaWxlfVxuICAgICAgICAgICAgICB1cGRhdGVGaWxlPXtoYW5kbGVGaWxlfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCIhbXQtMCB3LWZ1bGxcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgc2VsZi1zdHJldGNoIHB0LTVcIj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uQ2FuY2VsfT57dCgnbmV3QXBwLkNhbmNlbCcsIHsgbnM6ICdhcHAnIH0pfTwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudEZpbGUgfHwgbG9hZGluZ31cbiAgICAgICAgICAgIHZhcmlhbnQ9XCJ3YXJuaW5nXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUltcG9ydH1cbiAgICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3QoJ2NvbW1vbi5vdmVyd3JpdGVBbmRJbXBvcnQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvTW9kYWw+XG4gICAgICA8TW9kYWxcbiAgICAgICAgaXNTaG93PXtzaG93RXJyb3JNb2RhbH1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd0Vycm9yTW9kYWwoZmFsc2UpfVxuICAgICAgICBjbGFzc05hbWU9XCJ3LVs0ODBweF1cIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtc3RhcnQgZ2FwLTIgc2VsZi1zdHJldGNoIHBiLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlLTJ4bC1zZW1pLWJvbGQgdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnbmV3QXBwLmFwcENyZWF0ZURTTEVycm9yVGl0bGUnLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIGZsZXggZ3JvdyBmbGV4LWNvbCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICA8ZGl2Pnt0KCduZXdBcHAuYXBwQ3JlYXRlRFNMRXJyb3JQYXJ0MScsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdj57dCgnbmV3QXBwLmFwcENyZWF0ZURTTEVycm9yUGFydDInLCB7IG5zOiAnYXBwJyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAge3QoJ25ld0FwcC5hcHBDcmVhdGVEU0xFcnJvclBhcnQzJywgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1tZC1tZWRpdW1cIj57dmVyc2lvbnM/LmltcG9ydGVkVmVyc2lvbn08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHt0KCduZXdBcHAuYXBwQ3JlYXRlRFNMRXJyb3JQYXJ0NCcsIHsgbnM6ICdhcHAnIH0pfVxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtbWVkaXVtXCI+e3ZlcnNpb25zPy5zeXN0ZW1WZXJzaW9ufTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktZW5kIGdhcC0yIHNlbGYtc3RyZXRjaCBwdC02XCI+XG4gICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwic2Vjb25kYXJ5XCIgb25DbGljaz17KCkgPT4gc2V0U2hvd0Vycm9yTW9kYWwoZmFsc2UpfT57dCgnbmV3QXBwLkNhbmNlbCcsIHsgbnM6ICdhcHAnIH0pfTwvQnV0dG9uPlxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInByaW1hcnlcIiBkZXN0cnVjdGl2ZSBvbkNsaWNrPXtvblVwZGF0ZURTTENvbmZpcm19Pnt0KCduZXdBcHAuQ29uZmlybScsIHsgbnM6ICdhcHAnIH0pfTwvQnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvTW9kYWw+XG4gICAgPC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhVcGRhdGVEU0xNb2RhbClcbiJdfQ==