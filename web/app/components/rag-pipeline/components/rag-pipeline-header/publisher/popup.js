"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const link_1 = require("next/link");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const button_1 = require("@/app/components/base/button");
const confirm_1 = require("@/app/components/base/confirm");
const divider_1 = require("@/app/components/base/divider");
const common_1 = require("@/app/components/base/icons/src/public/common");
const premium_badge_1 = require("@/app/components/base/premium-badge");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const utils_1 = require("@/app/components/workflow/utils");
const dataset_detail_1 = require("@/context/dataset-detail");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const use_api_access_url_1 = require("@/hooks/use-api-access-url");
const use_format_time_from_now_1 = require("@/hooks/use-format-time-from-now");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const use_base_1 = require("@/service/use-base");
const use_pipeline_1 = require("@/service/use-pipeline");
const use_workflow_1 = require("@/service/use-workflow");
const classnames_1 = require("@/utils/classnames");
const publish_as_knowledge_pipeline_modal_1 = require("../../publish-as-knowledge-pipeline-modal");
const PUBLISH_SHORTCUT = ['ctrl', '⇧', 'P'];
const Popup = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { datasetId } = (0, navigation_1.useParams)();
    const { push } = (0, navigation_1.useRouter)();
    const publishedAt = (0, store_1.useStore)(s => s.publishedAt);
    const draftUpdatedAt = (0, store_1.useStore)(s => s.draftUpdatedAt);
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const mutateDatasetRes = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.mutateDatasetRes);
    const [published, setPublished] = (0, react_2.useState)(false);
    const { formatTimeFromNow } = (0, use_format_time_from_now_1.useFormatTimeFromNow)();
    const { handleCheckBeforePublish } = (0, hooks_1.useChecklistBeforePublish)();
    const { mutateAsync: publishWorkflow } = (0, use_workflow_1.usePublishWorkflow)();
    const { notify } = (0, toast_1.useToastContext)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { isAllowPublishAsCustomKnowledgePipelineTemplate } = (0, provider_context_1.useProviderContext)();
    const setShowPricingModal = (0, modal_context_1.useModalContextSelector)(s => s.setShowPricingModal);
    const apiReferenceUrl = (0, use_api_access_url_1.useDatasetApiAccessUrl)();
    const [confirmVisible, { setFalse: hideConfirm, setTrue: showConfirm, }] = (0, ahooks_1.useBoolean)(false);
    const [publishing, { setFalse: hidePublishing, setTrue: showPublishing, }] = (0, ahooks_1.useBoolean)(false);
    const { mutateAsync: publishAsCustomizedPipeline, } = (0, use_pipeline_1.usePublishAsCustomizedPipeline)();
    const [showPublishAsKnowledgePipelineModal, { setFalse: hidePublishAsKnowledgePipelineModal, setTrue: setShowPublishAsKnowledgePipelineModal, }] = (0, ahooks_1.useBoolean)(false);
    const [isPublishingAsCustomizedPipeline, { setFalse: hidePublishingAsCustomizedPipeline, setTrue: showPublishingAsCustomizedPipeline, }] = (0, ahooks_1.useBoolean)(false);
    const invalidPublishedPipelineInfo = (0, use_base_1.useInvalid)([...use_pipeline_1.publishedPipelineInfoQueryKeyPrefix, pipelineId]);
    const invalidDatasetList = (0, use_dataset_1.useInvalidDatasetList)();
    const handlePublish = (0, react_2.useCallback)(async (params) => {
        if (publishing)
            return;
        try {
            const checked = await handleCheckBeforePublish();
            if (checked) {
                if (!publishedAt && !confirmVisible) {
                    showConfirm();
                    return;
                }
                showPublishing();
                const res = await publishWorkflow({
                    url: `/rag/pipelines/${pipelineId}/workflows/publish`,
                    title: params?.title || '',
                    releaseNotes: params?.releaseNotes || '',
                });
                setPublished(true);
                (0, amplitude_1.trackEvent)('app_published_time', { action_mode: 'pipeline', app_id: datasetId, app_name: params?.title || '' });
                if (res) {
                    notify({
                        type: 'success',
                        message: t('publishPipeline.success.message', { ns: 'datasetPipeline' }),
                        children: (<div className="system-xs-regular text-text-secondary">
                <react_i18next_1.Trans i18nKey="publishPipeline.success.tip" ns="datasetPipeline" components={{
                                CustomLink: (<link_1.default className="system-xs-medium text-text-accent" href={`/datasets/${datasetId}/documents`}>
                      </link_1.default>),
                            }}/>
              </div>),
                    });
                    workflowStore.getState().setPublishedAt(res.created_at);
                    mutateDatasetRes?.();
                    invalidPublishedPipelineInfo();
                    invalidDatasetList();
                }
            }
        }
        catch {
            notify({ type: 'error', message: t('publishPipeline.error.message', { ns: 'datasetPipeline' }) });
        }
        finally {
            if (publishing)
                hidePublishing();
            if (confirmVisible)
                hideConfirm();
        }
    }, [handleCheckBeforePublish, publishWorkflow, pipelineId, notify, t, workflowStore, mutateDatasetRes, invalidPublishedPipelineInfo, showConfirm, publishedAt, confirmVisible, hidePublishing, showPublishing, hideConfirm, publishing]);
    (0, ahooks_1.useKeyPress)(`${(0, utils_1.getKeyboardKeyCodeBySystem)('ctrl')}.shift.p`, (e) => {
        e.preventDefault();
        if (published)
            return;
        handlePublish();
    }, { exactMatch: true, useCapture: true });
    const goToAddDocuments = (0, react_2.useCallback)(() => {
        push(`/datasets/${datasetId}/documents/create-from-pipeline`);
    }, [datasetId, push]);
    const invalidCustomizedTemplateList = (0, use_pipeline_1.useInvalidCustomizedTemplateList)();
    const handlePublishAsKnowledgePipeline = (0, react_2.useCallback)(async (name, icon, description) => {
        try {
            showPublishingAsCustomizedPipeline();
            await publishAsCustomizedPipeline({
                pipelineId: pipelineId || '',
                name,
                icon_info: icon,
                description,
            });
            notify({
                type: 'success',
                message: t('publishTemplate.success.message', { ns: 'datasetPipeline' }),
                children: (<div className="flex flex-col gap-y-1">
            <span className="system-xs-regular text-text-secondary">
              {t('publishTemplate.success.tip', { ns: 'datasetPipeline' })}
            </span>
            <link_1.default href="https://docs.dify.ai" target="_blank" className="system-xs-medium-uppercase inline-block text-text-accent">
              {t('publishTemplate.success.learnMore', { ns: 'datasetPipeline' })}
            </link_1.default>
          </div>),
            });
            invalidCustomizedTemplateList();
        }
        catch {
            notify({ type: 'error', message: t('publishTemplate.error.message', { ns: 'datasetPipeline' }) });
        }
        finally {
            hidePublishingAsCustomizedPipeline();
            hidePublishAsKnowledgePipelineModal();
        }
    }, [
        pipelineId,
        publishAsCustomizedPipeline,
        showPublishingAsCustomizedPipeline,
        hidePublishingAsCustomizedPipeline,
        hidePublishAsKnowledgePipelineModal,
        notify,
        t,
    ]);
    const handleClickPublishAsKnowledgePipeline = (0, react_2.useCallback)(() => {
        if (!isAllowPublishAsCustomKnowledgePipelineTemplate)
            setShowPricingModal();
        else
            setShowPublishAsKnowledgePipelineModal();
    }, [isAllowPublishAsCustomKnowledgePipelineTemplate, setShowPublishAsKnowledgePipelineModal, setShowPricingModal]);
    return (<div className={(0, classnames_1.cn)('rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-xl shadow-shadow-shadow-5', isAllowPublishAsCustomKnowledgePipelineTemplate ? 'w-[360px]' : 'w-[400px]')}>
      <div className="p-4 pt-3">
        <div className="system-xs-medium-uppercase flex h-6 items-center text-text-tertiary">
          {publishedAt ? t('common.latestPublished', { ns: 'workflow' }) : t('common.currentDraftUnpublished', { ns: 'workflow' })}
        </div>
        {publishedAt
            ? (<div className="flex items-center justify-between">
                  <div className="system-sm-medium flex items-center text-text-secondary">
                    {t('common.publishedAt', { ns: 'workflow' })}
                    {' '}
                    {formatTimeFromNow(publishedAt)}
                  </div>
                </div>)
            : (<div className="system-sm-medium flex items-center text-text-secondary">
                  {t('common.autoSaved', { ns: 'workflow' })}
                  {' '}
                  ·
                  {Boolean(draftUpdatedAt) && formatTimeFromNow(draftUpdatedAt)}
                </div>)}
        <button_1.default variant="primary" className="mt-3 w-full" onClick={() => handlePublish()} disabled={published || publishing}>
          {published
            ? t('common.published', { ns: 'workflow' })
            : (<div className="flex gap-1">
                    <span>{t('common.publishUpdate', { ns: 'workflow' })}</span>
                    <div className="flex gap-0.5">
                      {PUBLISH_SHORTCUT.map(key => (<span key={key} className="system-kbd h-4 w-4 rounded-[4px] bg-components-kbd-bg-white text-text-primary-on-surface">
                          {(0, utils_1.getKeyboardKeyNameBySystem)(key)}
                        </span>))}
                    </div>
                  </div>)}
        </button_1.default>
      </div>
      <div className="border-t-[0.5px] border-t-divider-regular p-4 pt-3">
        <button_1.default className="mb-1 w-full hover:bg-state-accent-hover hover:text-text-accent" variant="tertiary" onClick={goToAddDocuments} disabled={!publishedAt}>
          <div className="flex grow items-center">
            <react_1.RiPlayCircleLine className="mr-2 h-4 w-4"/>
            {t('common.goToAddDocuments', { ns: 'pipeline' })}
          </div>
          <react_1.RiArrowRightUpLine className="ml-2 h-4 w-4 shrink-0"/>
        </button_1.default>
        <link_1.default href={apiReferenceUrl} target="_blank" rel="noopener noreferrer">
          <button_1.default className="w-full hover:bg-state-accent-hover hover:text-text-accent" variant="tertiary" disabled={!publishedAt}>
            <div className="flex grow items-center">
              <react_1.RiTerminalBoxLine className="mr-2 h-4 w-4"/>
              {t('common.accessAPIReference', { ns: 'workflow' })}
            </div>
            <react_1.RiArrowRightUpLine className="ml-2 h-4 w-4 shrink-0"/>
          </button_1.default>
        </link_1.default>
        <divider_1.default className="my-2"/>
        <button_1.default className="w-full hover:bg-state-accent-hover hover:text-text-accent" variant="tertiary" onClick={handleClickPublishAsKnowledgePipeline} disabled={!publishedAt || isPublishingAsCustomizedPipeline}>
          <div className="flex grow items-center gap-x-2 overflow-hidden">
            <react_1.RiHammerLine className="h-4 w-4 shrink-0"/>
            <span className="grow truncate text-left" title={t('common.publishAs', { ns: 'pipeline' })}>
              {t('common.publishAs', { ns: 'pipeline' })}
            </span>
            {!isAllowPublishAsCustomKnowledgePipelineTemplate && (<premium_badge_1.default className="shrink-0 cursor-pointer select-none" size="s" color="indigo">
                <common_1.SparklesSoft className="flex size-3 items-center text-components-premium-badge-indigo-text-stop-0"/>
                <span className="system-2xs-medium p-0.5">
                  {t('upgradeBtn.encourageShort', { ns: 'billing' })}
                </span>
              </premium_badge_1.default>)}
          </div>
        </button_1.default>
      </div>
      {confirmVisible && (<confirm_1.default isShow={confirmVisible} title={t('common.confirmPublish', { ns: 'pipeline' })} content={t('common.confirmPublishContent', { ns: 'pipeline' })} onCancel={hideConfirm} onConfirm={handlePublish} isDisabled={publishing}/>)}
      {showPublishAsKnowledgePipelineModal && (<publish_as_knowledge_pipeline_modal_1.default confirmDisabled={isPublishingAsCustomizedPipeline} onConfirm={handlePublishAsKnowledgePipeline} onCancel={hidePublishAsKnowledgePipelineModal}/>)}
    </div>);
};
exports.default = (0, react_2.memo)(Popup);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3B1cC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FLeUI7QUFDekIsbUNBR2U7QUFDZixvQ0FBNEI7QUFDNUIsZ0RBQXNEO0FBQ3RELGlDQUljO0FBQ2QsaURBQXFEO0FBQ3JELCtEQUE0RDtBQUM1RCx5REFBaUQ7QUFDakQsMkRBQW1EO0FBQ25ELDJEQUFtRDtBQUNuRCwwRUFBNEU7QUFDNUUsdUVBQThEO0FBQzlELHVEQUE2RDtBQUM3RCwyREFFd0M7QUFDeEMsMkRBR3dDO0FBQ3hDLDJEQUF3RztBQUN4Ryw2REFBOEU7QUFDOUUsMkRBQWlFO0FBQ2pFLGlFQUErRDtBQUMvRCxtRUFBbUU7QUFDbkUsK0VBQXVFO0FBQ3ZFLGlFQUF1RTtBQUN2RSxpREFBK0M7QUFDL0MseURBSStCO0FBQy9CLHlEQUEyRDtBQUMzRCxtREFBdUM7QUFDdkMsbUdBQXVGO0FBRXZGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBRTNDLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtJQUNqQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFBO0lBQ2pDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDaEQsTUFBTSxjQUFjLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENB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RUFBRSxHQUFHLENBQ0w7TUFBQSxDQUNFLGNBQWMsSUFBSSxDQUNoQixDQUFDLGlCQUFPLENBQ04sTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQ3ZCLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQ3RELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQy9ELFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUN0QixTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDekIsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQ3ZCLENBRU4sQ0FDQTtNQUFBLENBQ0UsbUNBQW1DLElBQUksQ0FDckMsQ0FBQyw2Q0FBK0IsQ0FDOUIsZUFBZSxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FDbEQsU0FBUyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FDNUMsUUFBUSxDQUFDLENBQUMsbUNBQW1DLENBQUMsRUFDOUMsQ0FFTixDQUNGO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsS0FBSyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEljb25JbmZvIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IFB1Ymxpc2hXb3JrZmxvd1BhcmFtcyB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQge1xuICBSaUFycm93UmlnaHRVcExpbmUsXG4gIFJpSGFtbWVyTGluZSxcbiAgUmlQbGF5Q2lyY2xlTGluZSxcbiAgUmlUZXJtaW5hbEJveExpbmUsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQge1xuICB1c2VCb29sZWFuLFxuICB1c2VLZXlQcmVzcyxcbn0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJ1xuaW1wb3J0IHsgdXNlUGFyYW1zLCB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQge1xuICBtZW1vLFxuICB1c2VDYWxsYmFjayxcbiAgdXNlU3RhdGUsXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgVHJhbnMsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHRyYWNrRXZlbnQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IENvbmZpcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvbmZpcm0nXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7IFNwYXJrbGVzU29mdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvcHVibGljL2NvbW1vbidcbmltcG9ydCBQcmVtaXVtQmFkZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3ByZW1pdW0tYmFkZ2UnXG5pbXBvcnQgeyB1c2VUb2FzdENvbnRleHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQge1xuICB1c2VDaGVja2xpc3RCZWZvcmVQdWJsaXNoLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJ1xuaW1wb3J0IHtcbiAgdXNlU3RvcmUsXG4gIHVzZVdvcmtmbG93U3RvcmUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBnZXRLZXlib2FyZEtleUNvZGVCeVN5c3RlbSwgZ2V0S2V5Ym9hcmRLZXlOYW1lQnlTeXN0ZW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3IgfSBmcm9tICdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnXG5pbXBvcnQgeyB1c2VNb2RhbENvbnRleHRTZWxlY3RvciB9IGZyb20gJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VEYXRhc2V0QXBpQWNjZXNzVXJsIH0gZnJvbSAnQC9ob29rcy91c2UtYXBpLWFjY2Vzcy11cmwnXG5pbXBvcnQgeyB1c2VGb3JtYXRUaW1lRnJvbU5vdyB9IGZyb20gJ0AvaG9va3MvdXNlLWZvcm1hdC10aW1lLWZyb20tbm93J1xuaW1wb3J0IHsgdXNlSW52YWxpZERhdGFzZXRMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCdcbmltcG9ydCB7IHVzZUludmFsaWQgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWJhc2UnXG5pbXBvcnQge1xuICBwdWJsaXNoZWRQaXBlbGluZUluZm9RdWVyeUtleVByZWZpeCxcbiAgdXNlSW52YWxpZEN1c3RvbWl6ZWRUZW1wbGF0ZUxpc3QsXG4gIHVzZVB1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZSxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1waXBlbGluZSdcbmltcG9ydCB7IHVzZVB1Ymxpc2hXb3JrZmxvdyB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsIGZyb20gJy4uLy4uL3B1Ymxpc2gtYXMta25vd2xlZGdlLXBpcGVsaW5lLW1vZGFsJ1xuXG5jb25zdCBQVUJMSVNIX1NIT1JUQ1VUID0gWydjdHJsJywgJ+KHpycsICdQJ11cblxuY29uc3QgUG9wdXAgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGRhdGFzZXRJZCB9ID0gdXNlUGFyYW1zKClcbiAgY29uc3QgeyBwdXNoIH0gPSB1c2VSb3V0ZXIoKVxuICBjb25zdCBwdWJsaXNoZWRBdCA9IHVzZVN0b3JlKHMgPT4gcy5wdWJsaXNoZWRBdClcbiAgY29uc3QgZHJhZnRVcGRhdGVkQXQgPSB1c2VTdG9yZShzID0+IHMuZHJhZnRVcGRhdGVkQXQpXG4gIGNvbnN0IHBpcGVsaW5lSWQgPSB1c2VTdG9yZShzID0+IHMucGlwZWxpbmVJZClcbiAgY29uc3QgbXV0YXRlRGF0YXNldFJlcyA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yKHMgPT4gcy5tdXRhdGVEYXRhc2V0UmVzKVxuICBjb25zdCBbcHVibGlzaGVkLCBzZXRQdWJsaXNoZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IHsgZm9ybWF0VGltZUZyb21Ob3cgfSA9IHVzZUZvcm1hdFRpbWVGcm9tTm93KClcbiAgY29uc3QgeyBoYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2ggfSA9IHVzZUNoZWNrbGlzdEJlZm9yZVB1Ymxpc2goKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBwdWJsaXNoV29ya2Zsb3cgfSA9IHVzZVB1Ymxpc2hXb3JrZmxvdygpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHsgaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUgfSA9IHVzZVByb3ZpZGVyQ29udGV4dCgpXG4gIGNvbnN0IHNldFNob3dQcmljaW5nTW9kYWwgPSB1c2VNb2RhbENvbnRleHRTZWxlY3RvcihzID0+IHMuc2V0U2hvd1ByaWNpbmdNb2RhbClcbiAgY29uc3QgYXBpUmVmZXJlbmNlVXJsID0gdXNlRGF0YXNldEFwaUFjY2Vzc1VybCgpXG5cbiAgY29uc3QgW2NvbmZpcm1WaXNpYmxlLCB7XG4gICAgc2V0RmFsc2U6IGhpZGVDb25maXJtLFxuICAgIHNldFRydWU6IHNob3dDb25maXJtLFxuICB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IFtwdWJsaXNoaW5nLCB7XG4gICAgc2V0RmFsc2U6IGhpZGVQdWJsaXNoaW5nLFxuICAgIHNldFRydWU6IHNob3dQdWJsaXNoaW5nLFxuICB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IHtcbiAgICBtdXRhdGVBc3luYzogcHVibGlzaEFzQ3VzdG9taXplZFBpcGVsaW5lLFxuICB9ID0gdXNlUHVibGlzaEFzQ3VzdG9taXplZFBpcGVsaW5lKClcbiAgY29uc3QgW3Nob3dQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsLCB7XG4gICAgc2V0RmFsc2U6IGhpZGVQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsLFxuICAgIHNldFRydWU6IHNldFNob3dQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsLFxuICB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IFtpc1B1Ymxpc2hpbmdBc0N1c3RvbWl6ZWRQaXBlbGluZSwge1xuICAgIHNldEZhbHNlOiBoaWRlUHVibGlzaGluZ0FzQ3VzdG9taXplZFBpcGVsaW5lLFxuICAgIHNldFRydWU6IHNob3dQdWJsaXNoaW5nQXNDdXN0b21pemVkUGlwZWxpbmUsXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcblxuICBjb25zdCBpbnZhbGlkUHVibGlzaGVkUGlwZWxpbmVJbmZvID0gdXNlSW52YWxpZChbLi4ucHVibGlzaGVkUGlwZWxpbmVJbmZvUXVlcnlLZXlQcmVmaXgsIHBpcGVsaW5lSWRdKVxuICBjb25zdCBpbnZhbGlkRGF0YXNldExpc3QgPSB1c2VJbnZhbGlkRGF0YXNldExpc3QoKVxuXG4gIGNvbnN0IGhhbmRsZVB1Ymxpc2ggPSB1c2VDYWxsYmFjayhhc3luYyAocGFyYW1zPzogUHVibGlzaFdvcmtmbG93UGFyYW1zKSA9PiB7XG4gICAgaWYgKHB1Ymxpc2hpbmcpXG4gICAgICByZXR1cm5cbiAgICB0cnkge1xuICAgICAgY29uc3QgY2hlY2tlZCA9IGF3YWl0IGhhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCgpXG5cbiAgICAgIGlmIChjaGVja2VkKSB7XG4gICAgICAgIGlmICghcHVibGlzaGVkQXQgJiYgIWNvbmZpcm1WaXNpYmxlKSB7XG4gICAgICAgICAgc2hvd0NvbmZpcm0oKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHNob3dQdWJsaXNoaW5nKClcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgcHVibGlzaFdvcmtmbG93KHtcbiAgICAgICAgICB1cmw6IGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93cy9wdWJsaXNoYCxcbiAgICAgICAgICB0aXRsZTogcGFyYW1zPy50aXRsZSB8fCAnJyxcbiAgICAgICAgICByZWxlYXNlTm90ZXM6IHBhcmFtcz8ucmVsZWFzZU5vdGVzIHx8ICcnLFxuICAgICAgICB9KVxuICAgICAgICBzZXRQdWJsaXNoZWQodHJ1ZSlcbiAgICAgICAgdHJhY2tFdmVudCgnYXBwX3B1Ymxpc2hlZF90aW1lJywgeyBhY3Rpb25fbW9kZTogJ3BpcGVsaW5lJywgYXBwX2lkOiBkYXRhc2V0SWQsIGFwcF9uYW1lOiBwYXJhbXM/LnRpdGxlIHx8ICcnIH0pXG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICBub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgbWVzc2FnZTogdCgncHVibGlzaFBpcGVsaW5lLnN1Y2Nlc3MubWVzc2FnZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pLFxuICAgICAgICAgICAgY2hpbGRyZW46IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgPFRyYW5zXG4gICAgICAgICAgICAgICAgICBpMThuS2V5PVwicHVibGlzaFBpcGVsaW5lLnN1Y2Nlc3MudGlwXCJcbiAgICAgICAgICAgICAgICAgIG5zPVwiZGF0YXNldFBpcGVsaW5lXCJcbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHM9e3tcbiAgICAgICAgICAgICAgICAgICAgQ3VzdG9tTGluazogKFxuICAgICAgICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtIHRleHQtdGV4dC1hY2NlbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17YC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzYH1cbiAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICksXG4gICAgICAgICAgfSlcbiAgICAgICAgICB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKCkuc2V0UHVibGlzaGVkQXQocmVzLmNyZWF0ZWRfYXQpXG4gICAgICAgICAgbXV0YXRlRGF0YXNldFJlcz8uKClcbiAgICAgICAgICBpbnZhbGlkUHVibGlzaGVkUGlwZWxpbmVJbmZvKClcbiAgICAgICAgICBpbnZhbGlkRGF0YXNldExpc3QoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3B1Ymxpc2hQaXBlbGluZS5lcnJvci5tZXNzYWdlJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSkgfSlcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBpZiAocHVibGlzaGluZylcbiAgICAgICAgaGlkZVB1Ymxpc2hpbmcoKVxuICAgICAgaWYgKGNvbmZpcm1WaXNpYmxlKVxuICAgICAgICBoaWRlQ29uZmlybSgpXG4gICAgfVxuICB9LCBbaGFuZGxlQ2hlY2tCZWZvcmVQdWJsaXNoLCBwdWJsaXNoV29ya2Zsb3csIHBpcGVsaW5lSWQsIG5vdGlmeSwgdCwgd29ya2Zsb3dTdG9yZSwgbXV0YXRlRGF0YXNldFJlcywgaW52YWxpZFB1Ymxpc2hlZFBpcGVsaW5lSW5mbywgc2hvd0NvbmZpcm0sIHB1Ymxpc2hlZEF0LCBjb25maXJtVmlzaWJsZSwgaGlkZVB1Ymxpc2hpbmcsIHNob3dQdWJsaXNoaW5nLCBoaWRlQ29uZmlybSwgcHVibGlzaGluZ10pXG5cbiAgdXNlS2V5UHJlc3MoYCR7Z2V0S2V5Ym9hcmRLZXlDb2RlQnlTeXN0ZW0oJ2N0cmwnKX0uc2hpZnQucGAsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKHB1Ymxpc2hlZClcbiAgICAgIHJldHVyblxuICAgIGhhbmRsZVB1Ymxpc2goKVxuICB9LCB7IGV4YWN0TWF0Y2g6IHRydWUsIHVzZUNhcHR1cmU6IHRydWUgfSlcblxuICBjb25zdCBnb1RvQWRkRG9jdW1lbnRzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHB1c2goYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzL2NyZWF0ZS1mcm9tLXBpcGVsaW5lYClcbiAgfSwgW2RhdGFzZXRJZCwgcHVzaF0pXG5cbiAgY29uc3QgaW52YWxpZEN1c3RvbWl6ZWRUZW1wbGF0ZUxpc3QgPSB1c2VJbnZhbGlkQ3VzdG9taXplZFRlbXBsYXRlTGlzdCgpXG5cbiAgY29uc3QgaGFuZGxlUHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmUgPSB1c2VDYWxsYmFjayhhc3luYyAoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGljb246IEljb25JbmZvLFxuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nLFxuICApID0+IHtcbiAgICB0cnkge1xuICAgICAgc2hvd1B1Ymxpc2hpbmdBc0N1c3RvbWl6ZWRQaXBlbGluZSgpXG4gICAgICBhd2FpdCBwdWJsaXNoQXNDdXN0b21pemVkUGlwZWxpbmUoe1xuICAgICAgICBwaXBlbGluZUlkOiBwaXBlbGluZUlkIHx8ICcnLFxuICAgICAgICBuYW1lLFxuICAgICAgICBpY29uX2luZm86IGljb24sXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgfSlcbiAgICAgIG5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgncHVibGlzaFRlbXBsYXRlLnN1Y2Nlc3MubWVzc2FnZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pLFxuICAgICAgICBjaGlsZHJlbjogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAteS0xXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgIHt0KCdwdWJsaXNoVGVtcGxhdGUuc3VjY2Vzcy50aXAnLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL2RvY3MuZGlmeS5haVwiXG4gICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIGlubGluZS1ibG9jayB0ZXh0LXRleHQtYWNjZW50XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ3B1Ymxpc2hUZW1wbGF0ZS5zdWNjZXNzLmxlYXJuTW9yZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfVxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApLFxuICAgICAgfSlcbiAgICAgIGludmFsaWRDdXN0b21pemVkVGVtcGxhdGVMaXN0KClcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgncHVibGlzaFRlbXBsYXRlLmVycm9yLm1lc3NhZ2UnLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KSB9KVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIGhpZGVQdWJsaXNoaW5nQXNDdXN0b21pemVkUGlwZWxpbmUoKVxuICAgICAgaGlkZVB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwoKVxuICAgIH1cbiAgfSwgW1xuICAgIHBpcGVsaW5lSWQsXG4gICAgcHVibGlzaEFzQ3VzdG9taXplZFBpcGVsaW5lLFxuICAgIHNob3dQdWJsaXNoaW5nQXNDdXN0b21pemVkUGlwZWxpbmUsXG4gICAgaGlkZVB1Ymxpc2hpbmdBc0N1c3RvbWl6ZWRQaXBlbGluZSxcbiAgICBoaWRlUHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCxcbiAgICBub3RpZnksXG4gICAgdCxcbiAgXSlcblxuICBjb25zdCBoYW5kbGVDbGlja1B1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUpXG4gICAgICBzZXRTaG93UHJpY2luZ01vZGFsKClcbiAgICBlbHNlXG4gICAgICBzZXRTaG93UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbCgpXG4gIH0sIFtpc0FsbG93UHVibGlzaEFzQ3VzdG9tS25vd2xlZGdlUGlwZWxpbmVUZW1wbGF0ZSwgc2V0U2hvd1B1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWwsIHNldFNob3dQcmljaW5nTW9kYWxdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKCdyb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3cteGwgc2hhZG93LXNoYWRvdy1zaGFkb3ctNScsIGlzQWxsb3dQdWJsaXNoQXNDdXN0b21Lbm93bGVkZ2VQaXBlbGluZVRlbXBsYXRlID8gJ3ctWzM2MHB4XScgOiAndy1bNDAwcHhdJyl9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcHQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIGZsZXggaC02IGl0ZW1zLWNlbnRlciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICB7cHVibGlzaGVkQXQgPyB0KCdjb21tb24ubGF0ZXN0UHVibGlzaGVkJywgeyBuczogJ3dvcmtmbG93JyB9KSA6IHQoJ2NvbW1vbi5jdXJyZW50RHJhZnRVbnB1Ymxpc2hlZCcsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7XG4gICAgICAgICAgcHVibGlzaGVkQXRcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gZmxleCBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAgICB7dCgnY29tbW9uLnB1Ymxpc2hlZEF0JywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICAgICAge2Zvcm1hdFRpbWVGcm9tTm93KHB1Ymxpc2hlZEF0KX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gZmxleCBpdGVtcy1jZW50ZXIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgICAgICAge3QoJ2NvbW1vbi5hdXRvU2F2ZWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgICAgICAgIMK3XG4gICAgICAgICAgICAgICAgICB7Qm9vbGVhbihkcmFmdFVwZGF0ZWRBdCkgJiYgZm9ybWF0VGltZUZyb21Ob3coZHJhZnRVcGRhdGVkQXQhKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwibXQtMyB3LWZ1bGxcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZVB1Ymxpc2goKX1cbiAgICAgICAgICBkaXNhYmxlZD17cHVibGlzaGVkIHx8IHB1Ymxpc2hpbmd9XG4gICAgICAgID5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBwdWJsaXNoZWRcbiAgICAgICAgICAgICAgPyB0KCdjb21tb24ucHVibGlzaGVkJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57dCgnY29tbW9uLnB1Ymxpc2hVcGRhdGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7UFVCTElTSF9TSE9SVENVVC5tYXAoa2V5ID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17a2V5fSBjbGFzc05hbWU9XCJzeXN0ZW0ta2JkIGgtNCB3LTQgcm91bmRlZC1bNHB4XSBiZy1jb21wb25lbnRzLWtiZC1iZy13aGl0ZSB0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtnZXRLZXlib2FyZEtleU5hbWVCeVN5c3RlbShrZXkpfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10LVswLjVweF0gYm9yZGVyLXQtZGl2aWRlci1yZWd1bGFyIHAtNCBwdC0zXCI+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJtYi0xIHctZnVsbCBob3ZlcjpiZy1zdGF0ZS1hY2NlbnQtaG92ZXIgaG92ZXI6dGV4dC10ZXh0LWFjY2VudFwiXG4gICAgICAgICAgdmFyaWFudD1cInRlcnRpYXJ5XCJcbiAgICAgICAgICBvbkNsaWNrPXtnb1RvQWRkRG9jdW1lbnRzfVxuICAgICAgICAgIGRpc2FibGVkPXshcHVibGlzaGVkQXR9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ3JvdyBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxSaVBsYXlDaXJjbGVMaW5lIGNsYXNzTmFtZT1cIm1yLTIgaC00IHctNFwiIC8+XG4gICAgICAgICAgICB7dCgnY29tbW9uLmdvVG9BZGREb2N1bWVudHMnLCB7IG5zOiAncGlwZWxpbmUnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxSaUFycm93UmlnaHRVcExpbmUgY2xhc3NOYW1lPVwibWwtMiBoLTQgdy00IHNocmluay0wXCIgLz5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxMaW5rXG4gICAgICAgICAgaHJlZj17YXBpUmVmZXJlbmNlVXJsfVxuICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgID5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaG92ZXI6Ymctc3RhdGUtYWNjZW50LWhvdmVyIGhvdmVyOnRleHQtdGV4dC1hY2NlbnRcIlxuICAgICAgICAgICAgdmFyaWFudD1cInRlcnRpYXJ5XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshcHVibGlzaGVkQXR9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxSaVRlcm1pbmFsQm94TGluZSBjbGFzc05hbWU9XCJtci0yIGgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICB7dCgnY29tbW9uLmFjY2Vzc0FQSVJlZmVyZW5jZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxSaUFycm93UmlnaHRVcExpbmUgY2xhc3NOYW1lPVwibWwtMiBoLTQgdy00IHNocmluay0wXCIgLz5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9MaW5rPlxuICAgICAgICA8RGl2aWRlciBjbGFzc05hbWU9XCJteS0yXCIgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBob3ZlcjpiZy1zdGF0ZS1hY2NlbnQtaG92ZXIgaG92ZXI6dGV4dC10ZXh0LWFjY2VudFwiXG4gICAgICAgICAgdmFyaWFudD1cInRlcnRpYXJ5XCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja1B1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lfVxuICAgICAgICAgIGRpc2FibGVkPXshcHVibGlzaGVkQXQgfHwgaXNQdWJsaXNoaW5nQXNDdXN0b21pemVkUGlwZWxpbmV9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ3JvdyBpdGVtcy1jZW50ZXIgZ2FwLXgtMiBvdmVyZmxvdy1oaWRkZW5cIj5cbiAgICAgICAgICAgIDxSaUhhbW1lckxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCBzaHJpbmstMFwiIC8+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJncm93IHRydW5jYXRlIHRleHQtbGVmdFwiIHRpdGxlPXt0KCdjb21tb24ucHVibGlzaEFzJywgeyBuczogJ3BpcGVsaW5lJyB9KX0+XG4gICAgICAgICAgICAgIHt0KCdjb21tb24ucHVibGlzaEFzJywgeyBuczogJ3BpcGVsaW5lJyB9KX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHshaXNBbGxvd1B1Ymxpc2hBc0N1c3RvbUtub3dsZWRnZVBpcGVsaW5lVGVtcGxhdGUgJiYgKFxuICAgICAgICAgICAgICA8UHJlbWl1bUJhZGdlIGNsYXNzTmFtZT1cInNocmluay0wIGN1cnNvci1wb2ludGVyIHNlbGVjdC1ub25lXCIgc2l6ZT1cInNcIiBjb2xvcj1cImluZGlnb1wiPlxuICAgICAgICAgICAgICAgIDxTcGFya2xlc1NvZnQgY2xhc3NOYW1lPVwiZmxleCBzaXplLTMgaXRlbXMtY2VudGVyIHRleHQtY29tcG9uZW50cy1wcmVtaXVtLWJhZGdlLWluZGlnby10ZXh0LXN0b3AtMFwiIC8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1tZWRpdW0gcC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgIHt0KCd1cGdyYWRlQnRuLmVuY291cmFnZVNob3J0JywgeyBuczogJ2JpbGxpbmcnIH0pfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9QcmVtaXVtQmFkZ2U+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAge1xuICAgICAgICBjb25maXJtVmlzaWJsZSAmJiAoXG4gICAgICAgICAgPENvbmZpcm1cbiAgICAgICAgICAgIGlzU2hvdz17Y29uZmlybVZpc2libGV9XG4gICAgICAgICAgICB0aXRsZT17dCgnY29tbW9uLmNvbmZpcm1QdWJsaXNoJywgeyBuczogJ3BpcGVsaW5lJyB9KX1cbiAgICAgICAgICAgIGNvbnRlbnQ9e3QoJ2NvbW1vbi5jb25maXJtUHVibGlzaENvbnRlbnQnLCB7IG5zOiAncGlwZWxpbmUnIH0pfVxuICAgICAgICAgICAgb25DYW5jZWw9e2hpZGVDb25maXJtfVxuICAgICAgICAgICAgb25Db25maXJtPXtoYW5kbGVQdWJsaXNofVxuICAgICAgICAgICAgaXNEaXNhYmxlZD17cHVibGlzaGluZ31cbiAgICAgICAgICAvPlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIHNob3dQdWJsaXNoQXNLbm93bGVkZ2VQaXBlbGluZU1vZGFsICYmIChcbiAgICAgICAgICA8UHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmVNb2RhbFxuICAgICAgICAgICAgY29uZmlybURpc2FibGVkPXtpc1B1Ymxpc2hpbmdBc0N1c3RvbWl6ZWRQaXBlbGluZX1cbiAgICAgICAgICAgIG9uQ29uZmlybT17aGFuZGxlUHVibGlzaEFzS25vd2xlZGdlUGlwZWxpbmV9XG4gICAgICAgICAgICBvbkNhbmNlbD17aGlkZVB1Ymxpc2hBc0tub3dsZWRnZVBpcGVsaW5lTW9kYWx9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oUG9wdXApXG4iXX0=