"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const ahooks_1 = require("ahooks");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const divider_1 = require("@/app/components/base/divider");
const loading_1 = require("@/app/components/base/loading");
const plan_upgrade_modal_1 = require("@/app/components/billing/plan-upgrade-modal");
const vector_space_full_1 = require("@/app/components/billing/vector-space-full");
const local_file_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/local-file");
const online_documents_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/online-documents");
const online_drive_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/online-drive");
const website_crawl_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/website-crawl");
const dataset_detail_1 = require("@/context/dataset-detail");
const provider_context_1 = require("@/context/provider-context");
const pipeline_1 = require("@/models/pipeline");
const use_common_1 = require("@/service/use-common");
const use_pipeline_1 = require("@/service/use-pipeline");
const app_1 = require("@/types/app");
const upgrade_card_1 = require("../../create/step-one/upgrade-card");
const actions_1 = require("./actions");
const data_source_options_1 = require("./data-source-options");
const store_1 = require("./data-source/store");
const provider_1 = require("./data-source/store/provider");
const hooks_1 = require("./hooks");
const left_header_1 = require("./left-header");
const chunk_preview_1 = require("./preview/chunk-preview");
const file_preview_1 = require("./preview/file-preview");
const online_document_preview_1 = require("./preview/online-document-preview");
const web_preview_1 = require("./preview/web-preview");
const process_documents_1 = require("./process-documents");
const processing_1 = require("./processing");
const CreateFormPipeline = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const plan = (0, provider_context_1.useProviderContextSelector)(state => state.plan);
    const enableBilling = (0, provider_context_1.useProviderContextSelector)(state => state.enableBilling);
    const pipelineId = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.dataset?.pipeline_id);
    const [datasource, setDatasource] = (0, react_1.useState)();
    const [estimateData, setEstimateData] = (0, react_1.useState)(undefined);
    const [batchId, setBatchId] = (0, react_1.useState)('');
    const [documents, setDocuments] = (0, react_1.useState)([]);
    const dataSourceStore = (0, store_1.useDataSourceStore)();
    const isPreview = (0, react_1.useRef)(false);
    const formRef = (0, react_1.useRef)(null);
    const { data: pipelineInfo, isFetching: isFetchingPipelineInfo } = (0, use_pipeline_1.usePublishedPipelineInfo)(pipelineId || '');
    const { data: fileUploadConfigResponse } = (0, use_common_1.useFileUploadConfig)();
    const { steps, currentStep, handleNextStep: doHandleNextStep, handleBackStep, } = (0, hooks_1.useAddDocumentsSteps)();
    const { localFileList, allFileLoaded, currentLocalFile, hidePreviewLocalFile, } = (0, hooks_1.useLocalFile)();
    const { currentWorkspace, onlineDocuments, currentDocument, PagesMapAndSelectedPagesId, hidePreviewOnlineDocument, clearOnlineDocumentData, } = (0, hooks_1.useOnlineDocument)();
    const { websitePages, currentWebsite, hideWebsitePreview, clearWebsiteCrawlData, } = (0, hooks_1.useWebsiteCrawl)();
    const { onlineDriveFileList, selectedFileIds, selectedOnlineDriveFileList, clearOnlineDriveData, } = (0, hooks_1.useOnlineDrive)();
    const datasourceType = (0, react_1.useMemo)(() => datasource?.nodeData.provider_type, [datasource]);
    const isVectorSpaceFull = plan.usage.vectorSpace >= plan.total.vectorSpace;
    const isShowVectorSpaceFull = (0, react_1.useMemo)(() => {
        if (!datasource)
            return false;
        if (datasourceType === pipeline_1.DatasourceType.localFile)
            return allFileLoaded && isVectorSpaceFull && enableBilling;
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return onlineDocuments.length > 0 && isVectorSpaceFull && enableBilling;
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl)
            return websitePages.length > 0 && isVectorSpaceFull && enableBilling;
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive)
            return onlineDriveFileList.length > 0 && isVectorSpaceFull && enableBilling;
        return false;
    }, [allFileLoaded, datasource, datasourceType, enableBilling, isVectorSpaceFull, onlineDocuments.length, onlineDriveFileList.length, websitePages.length]);
    const supportBatchUpload = !enableBilling || plan.type !== 'sandbox';
    const [isShowPlanUpgradeModal, { setTrue: showPlanUpgradeModal, setFalse: hidePlanUpgradeModal, }] = (0, ahooks_1.useBoolean)(false);
    const handleNextStep = (0, react_1.useCallback)(() => {
        if (!supportBatchUpload) {
            let isMultiple = false;
            if (datasourceType === pipeline_1.DatasourceType.localFile && localFileList.length > 1)
                isMultiple = true;
            if (datasourceType === pipeline_1.DatasourceType.onlineDocument && onlineDocuments.length > 1)
                isMultiple = true;
            if (datasourceType === pipeline_1.DatasourceType.websiteCrawl && websitePages.length > 1)
                isMultiple = true;
            if (datasourceType === pipeline_1.DatasourceType.onlineDrive && selectedFileIds.length > 1)
                isMultiple = true;
            if (isMultiple) {
                showPlanUpgradeModal();
                return;
            }
        }
        doHandleNextStep();
    }, [datasourceType, doHandleNextStep, localFileList.length, onlineDocuments.length, selectedFileIds.length, showPlanUpgradeModal, supportBatchUpload, websitePages.length]);
    const nextBtnDisabled = (0, react_1.useMemo)(() => {
        if (!datasource)
            return true;
        if (datasourceType === pipeline_1.DatasourceType.localFile)
            return isShowVectorSpaceFull || !localFileList.length || !allFileLoaded;
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return isShowVectorSpaceFull || !onlineDocuments.length;
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl)
            return isShowVectorSpaceFull || !websitePages.length;
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive)
            return isShowVectorSpaceFull || !selectedFileIds.length;
        return false;
    }, [datasource, datasourceType, isShowVectorSpaceFull, localFileList.length, allFileLoaded, onlineDocuments.length, websitePages.length, selectedFileIds.length]);
    const fileUploadConfig = (0, react_1.useMemo)(() => fileUploadConfigResponse ?? {
        file_size_limit: 15,
        batch_count_limit: 5,
    }, [fileUploadConfigResponse]);
    const showSelect = (0, react_1.useMemo)(() => {
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument) {
            const pagesCount = currentWorkspace?.pages.length ?? 0;
            return pagesCount > 0;
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            const isBucketList = onlineDriveFileList.some(file => file.type === 'bucket');
            return !isBucketList && onlineDriveFileList.filter((item) => {
                return item.type !== 'bucket';
            }).length > 0;
        }
        return false;
    }, [currentWorkspace?.pages.length, datasourceType, onlineDriveFileList]);
    const totalOptions = (0, react_1.useMemo)(() => {
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return currentWorkspace?.pages.length;
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            return onlineDriveFileList.filter((item) => {
                return item.type !== 'bucket';
            }).length;
        }
    }, [currentWorkspace?.pages.length, datasourceType, onlineDriveFileList]);
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return onlineDocuments.length;
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive)
            return selectedFileIds.length;
    }, [datasourceType, onlineDocuments.length, selectedFileIds.length]);
    const tip = (0, react_1.useMemo)(() => {
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return t('addDocuments.selectOnlineDocumentTip', { ns: 'datasetPipeline', count: 50 });
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            return t('addDocuments.selectOnlineDriveTip', {
                ns: 'datasetPipeline',
                count: fileUploadConfig.batch_count_limit,
                fileSize: fileUploadConfig.file_size_limit,
            });
        }
        return '';
    }, [datasourceType, fileUploadConfig.batch_count_limit, fileUploadConfig.file_size_limit, t]);
    const { mutateAsync: runPublishedPipeline, isIdle, isPending } = (0, use_pipeline_1.useRunPublishedPipeline)();
    const handlePreviewChunks = (0, react_1.useCallback)(async (data) => {
        if (!datasource)
            return;
        const { previewLocalFileRef, previewOnlineDocumentRef, previewWebsitePageRef, previewOnlineDriveFileRef, currentCredentialId, } = dataSourceStore.getState();
        const datasourceInfoList = [];
        if (datasourceType === pipeline_1.DatasourceType.localFile) {
            const { id, name, type, size, extension, mime_type } = previewLocalFileRef.current;
            const documentInfo = {
                related_id: id,
                name,
                type,
                size,
                extension,
                mime_type,
                url: '',
                transfer_method: app_1.TransferMethod.local_file,
                credential_id: currentCredentialId,
            };
            datasourceInfoList.push(documentInfo);
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument) {
            const { workspace_id, ...rest } = previewOnlineDocumentRef.current;
            const documentInfo = {
                workspace_id,
                page: rest,
                credential_id: currentCredentialId,
            };
            datasourceInfoList.push(documentInfo);
        }
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl) {
            datasourceInfoList.push({
                ...previewWebsitePageRef.current,
                credential_id: currentCredentialId,
            });
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            const { bucket } = dataSourceStore.getState();
            const { id, type, name } = previewOnlineDriveFileRef.current;
            datasourceInfoList.push({
                bucket,
                id,
                name,
                type,
                credential_id: currentCredentialId,
            });
        }
        await runPublishedPipeline({
            pipeline_id: pipelineId,
            inputs: data,
            start_node_id: datasource.nodeId,
            datasource_type: datasourceType,
            datasource_info_list: datasourceInfoList,
            is_preview: true,
        }, {
            onSuccess: (res) => {
                setEstimateData(res.data.outputs);
            },
        });
    }, [datasource, datasourceType, runPublishedPipeline, pipelineId, dataSourceStore]);
    const handleProcess = (0, react_1.useCallback)(async (data) => {
        if (!datasource)
            return;
        const { currentCredentialId } = dataSourceStore.getState();
        const datasourceInfoList = [];
        if (datasourceType === pipeline_1.DatasourceType.localFile) {
            const { localFileList, } = dataSourceStore.getState();
            localFileList.forEach((file) => {
                const { id, name, type, size, extension, mime_type } = file.file;
                const documentInfo = {
                    related_id: id,
                    name,
                    type,
                    size,
                    extension,
                    mime_type,
                    url: '',
                    transfer_method: app_1.TransferMethod.local_file,
                    credential_id: currentCredentialId,
                };
                datasourceInfoList.push(documentInfo);
            });
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument) {
            const { onlineDocuments, } = dataSourceStore.getState();
            onlineDocuments.forEach((page) => {
                const { workspace_id, ...rest } = page;
                const documentInfo = {
                    workspace_id,
                    page: rest,
                    credential_id: currentCredentialId,
                };
                datasourceInfoList.push(documentInfo);
            });
        }
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl) {
            const { websitePages, } = dataSourceStore.getState();
            websitePages.forEach((websitePage) => {
                datasourceInfoList.push({
                    ...websitePage,
                    credential_id: currentCredentialId,
                });
            });
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            const { bucket, selectedFileIds, onlineDriveFileList, } = dataSourceStore.getState();
            selectedFileIds.forEach((id) => {
                const file = onlineDriveFileList.find(file => file.id === id);
                datasourceInfoList.push({
                    bucket,
                    id: file?.id,
                    name: file?.name,
                    type: file?.type,
                    credential_id: currentCredentialId,
                });
            });
        }
        await runPublishedPipeline({
            pipeline_id: pipelineId,
            inputs: data,
            start_node_id: datasource.nodeId,
            datasource_type: datasourceType,
            datasource_info_list: datasourceInfoList,
            is_preview: false,
        }, {
            onSuccess: (res) => {
                setBatchId(res.batch || '');
                setDocuments(res.documents || []);
                handleNextStep();
                (0, amplitude_1.trackEvent)('dataset_document_added', {
                    data_source_type: datasourceType,
                    indexing_technique: 'pipeline',
                });
            },
        });
    }, [dataSourceStore, datasource, datasourceType, handleNextStep, pipelineId, runPublishedPipeline]);
    const onClickProcess = (0, react_1.useCallback)(() => {
        isPreview.current = false;
        formRef.current?.submit();
    }, []);
    const onClickPreview = (0, react_1.useCallback)(() => {
        isPreview.current = true;
        formRef.current?.submit();
    }, []);
    const handleSubmit = (0, react_1.useCallback)((data) => {
        if (isPreview.current)
            handlePreviewChunks(data);
        else
            handleProcess(data);
    }, [handlePreviewChunks, handleProcess]);
    const handlePreviewFileChange = (0, react_1.useCallback)((file) => {
        const { previewLocalFileRef } = dataSourceStore.getState();
        previewLocalFileRef.current = file;
        onClickPreview();
    }, [dataSourceStore, onClickPreview]);
    const handlePreviewOnlineDocumentChange = (0, react_1.useCallback)((page) => {
        const { previewOnlineDocumentRef } = dataSourceStore.getState();
        previewOnlineDocumentRef.current = page;
        onClickPreview();
    }, [dataSourceStore, onClickPreview]);
    const handlePreviewWebsiteChange = (0, react_1.useCallback)((website) => {
        const { previewWebsitePageRef } = dataSourceStore.getState();
        previewWebsitePageRef.current = website;
        onClickPreview();
    }, [dataSourceStore, onClickPreview]);
    const handlePreviewOnlineDriveFileChange = (0, react_1.useCallback)((file) => {
        const { previewOnlineDriveFileRef } = dataSourceStore.getState();
        previewOnlineDriveFileRef.current = file;
        onClickPreview();
    }, [dataSourceStore, onClickPreview]);
    const handleSelectAll = (0, react_1.useCallback)(() => {
        const { onlineDocuments, onlineDriveFileList, selectedFileIds, setOnlineDocuments, setSelectedFileIds, setSelectedPagesId, } = dataSourceStore.getState();
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument) {
            const allIds = currentWorkspace?.pages.map(page => page.page_id) || [];
            if (onlineDocuments.length < allIds.length) {
                const selectedPages = Array.from(allIds).map(pageId => PagesMapAndSelectedPagesId[pageId]);
                setOnlineDocuments(selectedPages);
                setSelectedPagesId(new Set(allIds));
            }
            else {
                setOnlineDocuments([]);
                setSelectedPagesId(new Set());
            }
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            const allKeys = onlineDriveFileList.filter((item) => {
                return item.type !== 'bucket';
            }).map(file => file.id);
            if (selectedFileIds.length < allKeys.length)
                setSelectedFileIds(allKeys);
            else
                setSelectedFileIds([]);
        }
    }, [PagesMapAndSelectedPagesId, currentWorkspace?.pages, dataSourceStore, datasourceType]);
    const clearDataSourceData = (0, react_1.useCallback)((dataSource) => {
        const providerType = dataSource.nodeData.provider_type;
        if (providerType === pipeline_1.DatasourceType.onlineDocument)
            clearOnlineDocumentData();
        else if (providerType === pipeline_1.DatasourceType.websiteCrawl)
            clearWebsiteCrawlData();
        else if (providerType === pipeline_1.DatasourceType.onlineDrive)
            clearOnlineDriveData();
    }, [clearOnlineDocumentData, clearOnlineDriveData, clearWebsiteCrawlData]);
    const handleSwitchDataSource = (0, react_1.useCallback)((dataSource) => {
        const { setCurrentCredentialId, currentNodeIdRef, } = dataSourceStore.getState();
        clearDataSourceData(dataSource);
        setCurrentCredentialId('');
        currentNodeIdRef.current = dataSource.nodeId;
        setDatasource(dataSource);
    }, [clearDataSourceData, dataSourceStore]);
    const handleCredentialChange = (0, react_1.useCallback)((credentialId) => {
        const { setCurrentCredentialId } = dataSourceStore.getState();
        clearDataSourceData(datasource);
        setCurrentCredentialId(credentialId);
    }, [clearDataSourceData, dataSourceStore, datasource]);
    if (isFetchingPipelineInfo) {
        return (<loading_1.default type="app"/>);
    }
    return (<div className="relative flex h-[calc(100vh-56px)] w-full min-w-[1024px] overflow-x-auto rounded-t-2xl border-t border-effects-highlight bg-background-default-subtle">
      <div className="h-full min-w-0 flex-1">
        <div className="flex h-full flex-col px-14">
          <left_header_1.default steps={steps} title={t('addDocuments.title', { ns: 'datasetPipeline' })} currentStep={currentStep}/>
          <div className="grow overflow-y-auto">
            {currentStep === 1 && (<div className="flex flex-col gap-y-5 pt-4">
                  <data_source_options_1.default datasourceNodeId={datasource?.nodeId || ''} onSelect={handleSwitchDataSource} pipelineNodes={(pipelineInfo?.graph.nodes || [])}/>
                  {datasourceType === pipeline_1.DatasourceType.localFile && (<local_file_1.default allowedExtensions={datasource.nodeData.fileExtensions || []} supportBatchUpload={supportBatchUpload}/>)}
                  {datasourceType === pipeline_1.DatasourceType.onlineDocument && (<online_documents_1.default nodeId={datasource.nodeId} nodeData={datasource.nodeData} onCredentialChange={handleCredentialChange}/>)}
                  {datasourceType === pipeline_1.DatasourceType.websiteCrawl && (<website_crawl_1.default nodeId={datasource.nodeId} nodeData={datasource.nodeData} onCredentialChange={handleCredentialChange}/>)}
                  {datasourceType === pipeline_1.DatasourceType.onlineDrive && (<online_drive_1.default nodeId={datasource.nodeId} nodeData={datasource.nodeData} onCredentialChange={handleCredentialChange}/>)}
                  {isShowVectorSpaceFull && (<vector_space_full_1.default />)}
                  <actions_1.default showSelect={showSelect} totalOptions={totalOptions} selectedOptions={selectedOptions} onSelectAll={handleSelectAll} disabled={nextBtnDisabled} handleNextStep={handleNextStep} tip={tip}/>
                  {!supportBatchUpload && datasourceType === pipeline_1.DatasourceType.localFile && localFileList.length > 0 && (<>
                        <divider_1.default type="horizontal" className="my-4 h-px bg-divider-subtle"/>
                        <upgrade_card_1.default />
                      </>)}
                </div>)}
            {currentStep === 2 && (<process_documents_1.default ref={formRef} dataSourceNodeId={datasource.nodeId} isRunning={isPending} onProcess={onClickProcess} onPreview={onClickPreview} onSubmit={handleSubmit} onBack={handleBackStep}/>)}
            {currentStep === 3 && (<processing_1.default batchId={batchId} documents={documents}/>)}
          </div>
        </div>
      </div>
      {/* Preview */}
      {currentStep === 1 && (<div className="h-full min-w-0 flex-1">
            <div className="flex h-full flex-col pl-2 pt-2">
              {currentLocalFile && (<file_preview_1.default file={currentLocalFile} hidePreview={hidePreviewLocalFile}/>)}
              {currentDocument && (<online_document_preview_1.default datasourceNodeId={datasource.nodeId} currentPage={currentDocument} hidePreview={hidePreviewOnlineDocument}/>)}
              {currentWebsite && (<web_preview_1.default currentWebsite={currentWebsite} hidePreview={hideWebsitePreview}/>)}
            </div>
          </div>)}
      {currentStep === 2 && (<div className="h-full min-w-0 flex-1">
            <div className="flex h-full flex-col pl-2 pt-2">
              <chunk_preview_1.default dataSourceType={datasourceType} localFiles={localFileList.map(file => file.file)} onlineDocuments={onlineDocuments} websitePages={websitePages} onlineDriveFiles={selectedOnlineDriveFileList} isIdle={isIdle} isPending={isPending && isPreview.current} estimateData={estimateData} onPreview={onClickPreview} handlePreviewFileChange={handlePreviewFileChange} handlePreviewOnlineDocumentChange={handlePreviewOnlineDocumentChange} handlePreviewWebsitePageChange={handlePreviewWebsiteChange} handlePreviewOnlineDriveFileChange={handlePreviewOnlineDriveFileChange}/>
            </div>
          </div>)}
      {isShowPlanUpgradeModal && (<plan_upgrade_modal_1.default show onClose={hidePlanUpgradeModal} title={t('upgrade.uploadMultiplePages.title', { ns: 'billing' })} description={t('upgrade.uploadMultiplePages.description', { ns: 'billing' })}/>)}
    </div>);
};
const CreateFormPipelineWrapper = () => {
    return (<provider_1.default>
      <CreateFormPipeline />
    </provider_1.default>);
};
exports.default = CreateFormPipelineWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFZWixtQ0FBbUM7QUFDbkMsaUNBQThEO0FBQzlELGlEQUE4QztBQUM5QywrREFBNEQ7QUFDNUQsMkRBQW1EO0FBQ25ELDJEQUFtRDtBQUNuRCxvRkFBMEU7QUFDMUUsa0ZBQXdFO0FBQ3hFLGdIQUF1RztBQUN2Ryw0SEFBbUg7QUFDbkgsb0hBQTJHO0FBQzNHLHNIQUE2RztBQUM3Ryw2REFBOEU7QUFDOUUsaUVBQXVFO0FBQ3ZFLGdEQUFrRDtBQUNsRCxxREFBMEQ7QUFDMUQseURBQTBGO0FBQzFGLHFDQUE0QztBQUM1QyxxRUFBNEQ7QUFDNUQsdUNBQStCO0FBQy9CLCtEQUFxRDtBQUNyRCwrQ0FBd0Q7QUFDeEQsMkRBQTZEO0FBQzdELG1DQUFnSDtBQUNoSCwrQ0FBc0M7QUFDdEMsMkRBQWtEO0FBQ2xELHlEQUFnRDtBQUNoRCwrRUFBcUU7QUFDckUsdURBQWtEO0FBQ2xELDJEQUFrRDtBQUNsRCw2Q0FBcUM7QUFFckMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7SUFDOUIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUEsNkNBQTBCLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDNUQsTUFBTSxhQUFhLEdBQUcsSUFBQSw2Q0FBMEIsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM5RSxNQUFNLFVBQVUsR0FBRyxJQUFBLG9EQUFtQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNuRixNQUFNLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsR0FBYyxDQUFBO0lBQzFELE1BQU0sQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUEyQyxTQUFTLENBQUMsQ0FBQTtJQUNyRyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUMxQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBMEIsRUFBRSxDQUFDLENBQUE7SUFDdkUsTUFBTSxlQUFlLEdBQUcsSUFBQSwwQkFBa0IsR0FBRSxDQUFBO0lBRTVDLE1BQU0sU0FBUyxHQUFHLElBQUEsY0FBTSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUEsY0FBTSxFQUFNLElBQUksQ0FBQyxDQUFBO0lBRWpDLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxzQkFBc0IsRUFBRSxHQUFHLElBQUEsdUNBQXdCLEVBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQzdHLE1BQU0sRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxJQUFBLGdDQUFtQixHQUFFLENBQUE7SUFFaEUsTUFBTSxFQUNKLEtBQUssRUFDTCxXQUFXLEVBQ1gsY0FBYyxFQUFFLGdCQUFnQixFQUNoQyxjQUFjLEdBQ2YsR0FBRyxJQUFBLDRCQUFvQixHQUFFLENBQUE7SUFDMUIsTUFBTSxFQUNKLGFBQWEsRUFDYixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLG9CQUFvQixHQUNyQixHQUFHLElBQUEsb0JBQVksR0FBRSxDQUFBO0lBQ2xCLE1BQU0sRUFDSixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGVBQWUsRUFDZiwwQkFBMEIsRUFDMUIseUJBQXlCLEVBQ3pCLHVCQUF1QixHQUN4QixHQUFHLElBQUEseUJBQWlCLEdBQUUsQ0FBQTtJQUN2QixNQUFNLEVBQ0osWUFBWSxFQUNaLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIscUJBQXFCLEdBQ3RCLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDckIsTUFBTSxFQUNKLG1CQUFtQixFQUNuQixlQUFlLEVBQ2YsMkJBQTJCLEVBQzNCLG9CQUFvQixHQUNyQixHQUFHLElBQUEsc0JBQWMsR0FBRSxDQUFBO0lBRXBCLE1BQU0sY0FBYyxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtJQUN0RixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFBO0lBQzFFLE1BQU0scUJBQXFCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ3pDLElBQUksQ0FBQyxVQUFVO1lBQ2IsT0FBTyxLQUFLLENBQUE7UUFDZCxJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFNBQVM7WUFDN0MsT0FBTyxhQUFhLElBQUksaUJBQWlCLElBQUksYUFBYSxDQUFBO1FBQzVELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYztZQUNsRCxPQUFPLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGlCQUFpQixJQUFJLGFBQWEsQ0FBQTtRQUN6RSxJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFlBQVk7WUFDaEQsT0FBTyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxpQkFBaUIsSUFBSSxhQUFhLENBQUE7UUFDdEUsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxXQUFXO1lBQy9DLE9BQU8sbUJBQW1CLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxpQkFBaUIsSUFBSSxhQUFhLENBQUE7UUFDN0UsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDMUosTUFBTSxrQkFBa0IsR0FBRyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQTtJQUVwRSxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFDN0IsT0FBTyxFQUFFLG9CQUFvQixFQUM3QixRQUFRLEVBQUUsb0JBQW9CLEdBQy9CLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEIsTUFBTSxjQUFjLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUE7WUFDdEIsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxTQUFTLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUN6RSxVQUFVLEdBQUcsSUFBSSxDQUFBO1lBRW5CLElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDaEYsVUFBVSxHQUFHLElBQUksQ0FBQTtZQUVuQixJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQzNFLFVBQVUsR0FBRyxJQUFJLENBQUE7WUFFbkIsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxXQUFXLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUM3RSxVQUFVLEdBQUcsSUFBSSxDQUFBO1lBRW5CLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQ2Ysb0JBQW9CLEVBQUUsQ0FBQTtnQkFDdEIsT0FBTTtZQUNSLENBQUM7UUFDSCxDQUFDO1FBQ0QsZ0JBQWdCLEVBQUUsQ0FBQTtJQUNwQixDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFM0ssTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25DLElBQUksQ0FBQyxVQUFVO1lBQ2IsT0FBTyxJQUFJLENBQUE7UUFDYixJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFNBQVM7WUFDN0MsT0FBTyxxQkFBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUE7UUFDekUsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxjQUFjO1lBQ2xELE9BQU8scUJBQXFCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFBO1FBQ3pELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsWUFBWTtZQUNoRCxPQUFPLHFCQUFxQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQTtRQUN0RCxJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFdBQVc7WUFDL0MsT0FBTyxxQkFBcUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUE7UUFDekQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUVqSyxNQUFNLGdCQUFnQixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixJQUFJO1FBQ2pFLGVBQWUsRUFBRSxFQUFFO1FBQ25CLGlCQUFpQixFQUFFLENBQUM7S0FDckIsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtJQUU5QixNQUFNLFVBQVUsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDOUIsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNyRCxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQTtZQUN0RCxPQUFPLFVBQVUsR0FBRyxDQUFDLENBQUE7UUFDdkIsQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsTUFBTSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQTtZQUM3RSxPQUFPLENBQUMsWUFBWSxJQUFJLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMxRCxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7UUFDZixDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7SUFFekUsTUFBTSxZQUFZLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ2hDLElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYztZQUNsRCxPQUFPLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUE7UUFDdkMsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsRCxPQUFPLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUN6QyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUNYLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7SUFFekUsTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25DLElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYztZQUNsRCxPQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUE7UUFDL0IsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxXQUFXO1lBQy9DLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQTtJQUNqQyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUVwRSxNQUFNLEdBQUcsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDdkIsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxjQUFjO1lBQ2xELE9BQU8sQ0FBQyxDQUFDLHNDQUFzQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3hGLElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsT0FBTyxDQUFDLENBQUMsbUNBQW1DLEVBQUU7Z0JBQzVDLEVBQUUsRUFBRSxpQkFBaUI7Z0JBQ3JCLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUI7Z0JBQ3pDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxlQUFlO2FBQzNDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU3RixNQUFNLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHNDQUF1QixHQUFFLENBQUE7SUFFMUYsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxFQUFFLElBQXlCLEVBQUUsRUFBRTtRQUMxRSxJQUFJLENBQUMsVUFBVTtZQUNiLE9BQU07UUFDUixNQUFNLEVBQ0osbUJBQW1CLEVBQ25CLHdCQUF3QixFQUN4QixxQkFBcUIsRUFDckIseUJBQXlCLEVBQ3pCLG1CQUFtQixHQUNwQixHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM5QixNQUFNLGtCQUFrQixHQUEwQixFQUFFLENBQUE7UUFDcEQsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoRCxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQyxPQUFlLENBQUE7WUFDMUYsTUFBTSxZQUFZLEdBQUc7Z0JBQ25CLFVBQVUsRUFBRSxFQUFFO2dCQUNkLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxHQUFHLEVBQUUsRUFBRTtnQkFDUCxlQUFlLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO2dCQUMxQyxhQUFhLEVBQUUsbUJBQW1CO2FBQ25DLENBQUE7WUFDRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDdkMsQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDckQsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksRUFBRSxHQUFHLHdCQUF3QixDQUFDLE9BQVEsQ0FBQTtZQUNuRSxNQUFNLFlBQVksR0FBRztnQkFDbkIsWUFBWTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixhQUFhLEVBQUUsbUJBQW1CO2FBQ25DLENBQUE7WUFDRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDdkMsQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkQsa0JBQWtCLENBQUMsSUFBSSxDQUFDO2dCQUN0QixHQUFHLHFCQUFxQixDQUFDLE9BQVE7Z0JBQ2pDLGFBQWEsRUFBRSxtQkFBbUI7YUFDbkMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUM3QyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyx5QkFBeUIsQ0FBQyxPQUFRLENBQUE7WUFDN0Qsa0JBQWtCLENBQUMsSUFBSSxDQUFDO2dCQUN0QixNQUFNO2dCQUNOLEVBQUU7Z0JBQ0YsSUFBSTtnQkFDSixJQUFJO2dCQUNKLGFBQWEsRUFBRSxtQkFBbUI7YUFDbkMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELE1BQU0sb0JBQW9CLENBQUM7WUFDekIsV0FBVyxFQUFFLFVBQVc7WUFDeEIsTUFBTSxFQUFFLElBQUk7WUFDWixhQUFhLEVBQUUsVUFBVSxDQUFDLE1BQU07WUFDaEMsZUFBZSxFQUFFLGNBQWdDO1lBQ2pELG9CQUFvQixFQUFFLGtCQUFrQjtZQUN4QyxVQUFVLEVBQUUsSUFBSTtTQUNqQixFQUFFO1lBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pCLGVBQWUsQ0FBRSxHQUEyQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM1RSxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUVuRixNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxFQUFFLElBQXlCLEVBQUUsRUFBRTtRQUNwRSxJQUFJLENBQUMsVUFBVTtZQUNiLE9BQU07UUFDUixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDMUQsTUFBTSxrQkFBa0IsR0FBMEIsRUFBRSxDQUFBO1FBQ3BELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDaEQsTUFBTSxFQUNKLGFBQWEsR0FDZCxHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUM5QixhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQzdCLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7Z0JBQ2hFLE1BQU0sWUFBWSxHQUFHO29CQUNuQixVQUFVLEVBQUUsRUFBRTtvQkFDZCxJQUFJO29CQUNKLElBQUk7b0JBQ0osSUFBSTtvQkFDSixTQUFTO29CQUNULFNBQVM7b0JBQ1QsR0FBRyxFQUFFLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLG9CQUFjLENBQUMsVUFBVTtvQkFDMUMsYUFBYSxFQUFFLG1CQUFtQjtpQkFDbkMsQ0FBQTtnQkFDRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsSUFBSSxjQUFjLEtBQUsseUJBQWMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNyRCxNQUFNLEVBQ0osZUFBZSxHQUNoQixHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUM5QixlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQy9CLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUE7Z0JBQ3RDLE1BQU0sWUFBWSxHQUFHO29CQUNuQixZQUFZO29CQUNaLElBQUksRUFBRSxJQUFJO29CQUNWLGFBQWEsRUFBRSxtQkFBbUI7aUJBQ25DLENBQUE7Z0JBQ0Qsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkQsTUFBTSxFQUNKLFlBQVksR0FDYixHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUM5QixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ25DLGtCQUFrQixDQUFDLElBQUksQ0FBQztvQkFDdEIsR0FBRyxXQUFXO29CQUNkLGFBQWEsRUFBRSxtQkFBbUI7aUJBQ25DLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEQsTUFBTSxFQUNKLE1BQU0sRUFDTixlQUFlLEVBQ2YsbUJBQW1CLEdBQ3BCLEdBQUcsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQzlCLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtnQkFDN0IsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQkFDN0Qsa0JBQWtCLENBQUMsSUFBSSxDQUFDO29CQUN0QixNQUFNO29CQUNOLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7b0JBQ2hCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtvQkFDaEIsYUFBYSxFQUFFLG1CQUFtQjtpQkFDbkMsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsTUFBTSxvQkFBb0IsQ0FBQztZQUN6QixXQUFXLEVBQUUsVUFBVztZQUN4QixNQUFNLEVBQUUsSUFBSTtZQUNaLGFBQWEsRUFBRSxVQUFVLENBQUMsTUFBTTtZQUNoQyxlQUFlLEVBQUUsY0FBZ0M7WUFDakQsb0JBQW9CLEVBQUUsa0JBQWtCO1lBQ3hDLFVBQVUsRUFBRSxLQUFLO1NBQ2xCLEVBQUU7WUFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDakIsVUFBVSxDQUFFLEdBQW9DLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUM3RCxZQUFZLENBQUUsR0FBb0MsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUE7Z0JBQ25FLGNBQWMsRUFBRSxDQUFBO2dCQUNoQixJQUFBLHNCQUFVLEVBQUMsd0JBQXdCLEVBQUU7b0JBQ25DLGdCQUFnQixFQUFFLGNBQWM7b0JBQ2hDLGtCQUFrQixFQUFFLFVBQVU7aUJBQy9CLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtJQUVuRyxNQUFNLGNBQWMsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3RDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1FBQ3pCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUE7SUFDM0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sTUFBTSxjQUFjLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUN0QyxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUN4QixPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFBO0lBQzNCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQXlCLEVBQUUsRUFBRTtRQUM3RCxJQUFJLFNBQVMsQ0FBQyxPQUFPO1lBQ25CLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFBOztZQUV6QixhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUV4QyxNQUFNLHVCQUF1QixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQWtCLEVBQUUsRUFBRTtRQUNqRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDMUQsbUJBQW1CLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUNsQyxjQUFjLEVBQUUsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVyQyxNQUFNLGlDQUFpQyxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQWdCLEVBQUUsRUFBRTtRQUN6RSxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDL0Qsd0JBQXdCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUN2QyxjQUFjLEVBQUUsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVyQyxNQUFNLDBCQUEwQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtRQUMxRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDNUQscUJBQXFCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN2QyxjQUFjLEVBQUUsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVyQyxNQUFNLGtDQUFrQyxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQXFCLEVBQUUsRUFBRTtRQUMvRSxNQUFNLEVBQUUseUJBQXlCLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDaEUseUJBQXlCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUN4QyxjQUFjLEVBQUUsQ0FBQTtJQUNsQixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVyQyxNQUFNLGVBQWUsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3ZDLE1BQU0sRUFDSixlQUFlLEVBQ2YsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLGtCQUFrQixHQUNuQixHQUFHLGVBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM5QixJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3JELE1BQU0sTUFBTSxHQUFHLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3RFLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNDLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtnQkFDMUYsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUE7Z0JBQ2pDLGtCQUFrQixDQUFDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDckMsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUN0QixrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUE7WUFDL0IsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xELE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNsRCxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN2QixJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07Z0JBQ3pDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFBOztnQkFFM0Isa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDMUIsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUUxRixNQUFNLG1CQUFtQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLFVBQXNCLEVBQUUsRUFBRTtRQUNqRSxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQTtRQUN0RCxJQUFJLFlBQVksS0FBSyx5QkFBYyxDQUFDLGNBQWM7WUFDaEQsdUJBQXVCLEVBQUUsQ0FBQTthQUN0QixJQUFJLFlBQVksS0FBSyx5QkFBYyxDQUFDLFlBQVk7WUFDbkQscUJBQXFCLEVBQUUsQ0FBQTthQUNwQixJQUFJLFlBQVksS0FBSyx5QkFBYyxDQUFDLFdBQVc7WUFDbEQsb0JBQW9CLEVBQUUsQ0FBQTtJQUMxQixDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxvQkFBb0IsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7SUFFMUUsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUU7UUFDcEUsTUFBTSxFQUNKLHNCQUFzQixFQUN0QixnQkFBZ0IsR0FDakIsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDOUIsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDL0Isc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDMUIsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUE7UUFDNUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzNCLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7SUFFMUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxZQUFvQixFQUFFLEVBQUU7UUFDbEUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsZUFBZSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzdELG1CQUFtQixDQUFDLFVBQVcsQ0FBQyxDQUFBO1FBQ2hDLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3RDLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBRXRELElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUMzQixPQUFPLENBQ0wsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUcsQ0FDdkIsQ0FBQTtJQUNILENBQUM7SUFFRCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLHVKQUF1SixDQUVqSztNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDcEM7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO1VBQUEsQ0FBQyxxQkFBVSxDQUNULEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FDMUQsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBRTNCO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUNuQztZQUFBLENBQ0UsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUNuQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO2tCQUFBLENBQUMsNkJBQWlCLENBQ2hCLGdCQUFnQixDQUFDLENBQUMsVUFBVSxFQUFFLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FDM0MsUUFBUSxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FDakMsYUFBYSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQStCLENBQUMsRUFFakY7a0JBQUEsQ0FBQyxjQUFjLEtBQUsseUJBQWMsQ0FBQyxTQUFTLElBQUksQ0FDOUMsQ0FBQyxvQkFBUyxDQUNSLGlCQUFpQixDQUFDLENBQUMsVUFBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQzdELGtCQUFrQixDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFDdkMsQ0FDSCxDQUNEO2tCQUFBLENBQUMsY0FBYyxLQUFLLHlCQUFjLENBQUMsY0FBYyxJQUFJLENBQ25ELENBQUMsMEJBQWUsQ0FDZCxNQUFNLENBQUMsQ0FBQyxVQUFXLENBQUMsTUFBTSxDQUFDLENBQzNCLFFBQVEsQ0FBQyxDQUFDLFVBQVcsQ0FBQyxRQUFRLENBQUMsQ0FDL0Isa0JBQWtCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUMzQyxDQUNILENBQ0Q7a0JBQUEsQ0FBQyxjQUFjLEtBQUsseUJBQWMsQ0FBQyxZQUFZLElBQUksQ0FDakQsQ0FBQyx1QkFBWSxDQUNYLE1BQU0sQ0FBQyxDQUFDLFVBQVcsQ0FBQyxNQUFNLENBQUMsQ0FDM0IsUUFBUSxDQUFDLENBQUMsVUFBVyxDQUFDLFFBQVEsQ0FBQyxDQUMvQixrQkFBa0IsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEVBQzNDLENBQ0gsQ0FDRDtrQkFBQSxDQUFDLGNBQWMsS0FBSyx5QkFBYyxDQUFDLFdBQVcsSUFBSSxDQUNoRCxDQUFDLHNCQUFXLENBQ1YsTUFBTSxDQUFDLENBQUMsVUFBVyxDQUFDLE1BQU0sQ0FBQyxDQUMzQixRQUFRLENBQUMsQ0FBQyxVQUFXLENBQUMsUUFBUSxDQUFDLENBQy9CLGtCQUFrQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDM0MsQ0FDSCxDQUNEO2tCQUFBLENBQUMscUJBQXFCLElBQUksQ0FDeEIsQ0FBQywyQkFBZSxDQUFDLEFBQUQsRUFBRyxDQUNwQixDQUNEO2tCQUFBLENBQUMsaUJBQU8sQ0FDTixVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FDdkIsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQzNCLGVBQWUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUNqQyxXQUFXLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FDN0IsUUFBUSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQzFCLGNBQWMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUMvQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFFWDtrQkFBQSxDQUNFLENBQUMsa0JBQWtCLElBQUksY0FBYyxLQUFLLHlCQUFjLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQ2hHLEVBQ0U7d0JBQUEsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUNsRTt3QkFBQSxDQUFDLHNCQUFXLENBQUMsQUFBRCxFQUNkO3NCQUFBLEdBQUcsQ0FFUCxDQUNGO2dCQUFBLEVBQUUsR0FBRyxDQUFDLENBRVYsQ0FDQTtZQUFBLENBQ0UsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUNuQixDQUFDLDJCQUFnQixDQUNmLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNiLGdCQUFnQixDQUFDLENBQUMsVUFBVyxDQUFDLE1BQU0sQ0FBQyxDQUNyQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDckIsU0FBUyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQzFCLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUMxQixRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDdkIsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQ3ZCLENBRU4sQ0FDQTtZQUFBLENBQ0UsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUNuQixDQUFDLG9CQUFVLENBQ1QsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUNyQixDQUVOLENBQ0Y7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLGFBQWEsQ0FDZDtNQUFBLENBQ0UsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUNuQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQ3BDO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUM3QztjQUFBLENBQUMsZ0JBQWdCLElBQUksQ0FDbkIsQ0FBQyxzQkFBVyxDQUNWLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQ3ZCLFdBQVcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQ2xDLENBQ0gsQ0FDRDtjQUFBLENBQUMsZUFBZSxJQUFJLENBQ2xCLENBQUMsaUNBQXFCLENBQ3BCLGdCQUFnQixDQUFDLENBQUMsVUFBVyxDQUFDLE1BQU0sQ0FBQyxDQUNyQyxXQUFXLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FDN0IsV0FBVyxDQUFDLENBQUMseUJBQXlCLENBQUMsRUFDdkMsQ0FDSCxDQUNEO2NBQUEsQ0FBQyxjQUFjLElBQUksQ0FDakIsQ0FBQyxxQkFBYyxDQUNiLGNBQWMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUMvQixXQUFXLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUNoQyxDQUNILENBQ0g7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUFDLENBRVYsQ0FDQTtNQUFBLENBQ0UsV0FBVyxLQUFLLENBQUMsSUFBSSxDQUNuQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQ3BDO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUM3QztjQUFBLENBQUMsdUJBQVksQ0FDWCxjQUFjLENBQUMsQ0FBQyxjQUFnQyxDQUFDLENBQ2pELFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDakQsZUFBZSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQ2pDLFlBQVksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUMzQixnQkFBZ0IsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQzlDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNmLFNBQVMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQzFDLFlBQVksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUMzQixTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FDMUIsdUJBQXVCLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUNqRCxpQ0FBaUMsQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQ3JFLDhCQUE4QixDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FDM0Qsa0NBQWtDLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUUzRTtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FFVixDQUNBO01BQUEsQ0FBQyxzQkFBc0IsSUFBSSxDQUN6QixDQUFDLDRCQUFnQixDQUNmLElBQUksQ0FDSixPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUM5QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsQ0FBQyxDQUNsRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMseUNBQXlDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUUsQ0FBQyxFQUM5RSxDQUNILENBQ0g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLHlCQUF5QixHQUFHLEdBQUcsRUFBRTtJQUNyQyxPQUFPLENBQ0wsQ0FBQyxrQkFBa0IsQ0FDakI7TUFBQSxDQUFDLGtCQUFrQixDQUFDLEFBQUQsRUFDckI7SUFBQSxFQUFFLGtCQUFrQixDQUFDLENBQ3RCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSx5QkFBeUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBEYXRhc291cmNlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvY29tcG9uZW50cy9wYW5lbC90ZXN0LXJ1bi90eXBlcydcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS90eXBlcydcbmltcG9ydCB0eXBlIHsgTm9kZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vdGlvblBhZ2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IENyYXdsUmVzdWx0SXRlbSwgRG9jdW1lbnRJdGVtLCBDdXN0b21GaWxlIGFzIEZpbGUsIEZpbGVJbmRleGluZ0VzdGltYXRlUmVzcG9uc2UgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB0eXBlIHtcbiAgSW5pdGlhbERvY3VtZW50RGV0YWlsLFxuICBPbmxpbmVEcml2ZUZpbGUsXG4gIFB1Ymxpc2hlZFBpcGVsaW5lUnVuUHJldmlld1Jlc3BvbnNlLFxuICBQdWJsaXNoZWRQaXBlbGluZVJ1blJlc3BvbnNlLFxufSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IHVzZUJvb2xlYW4gfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdHJhY2tFdmVudCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IFBsYW5VcGdyYWRlTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3BsYW4tdXBncmFkZS1tb2RhbCdcbmltcG9ydCBWZWN0b3JTcGFjZUZ1bGwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3ZlY3Rvci1zcGFjZS1mdWxsJ1xuaW1wb3J0IExvY2FsRmlsZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9sb2NhbC1maWxlJ1xuaW1wb3J0IE9ubGluZURvY3VtZW50cyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9vbmxpbmUtZG9jdW1lbnRzJ1xuaW1wb3J0IE9ubGluZURyaXZlIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvZG9jdW1lbnRzL2NyZWF0ZS1mcm9tLXBpcGVsaW5lL2RhdGEtc291cmNlL29ubGluZS1kcml2ZSdcbmltcG9ydCBXZWJzaXRlQ3Jhd2wgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvY3JlYXRlLWZyb20tcGlwZWxpbmUvZGF0YS1zb3VyY2Uvd2Vic2l0ZS1jcmF3bCdcbmltcG9ydCB7IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yIH0gZnJvbSAnQC9jb250ZXh0L2RhdGFzZXQtZGV0YWlsJ1xuaW1wb3J0IHsgdXNlUHJvdmlkZXJDb250ZXh0U2VsZWN0b3IgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyB1c2VGaWxlVXBsb2FkQ29uZmlnIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyB1c2VQdWJsaXNoZWRQaXBlbGluZUluZm8sIHVzZVJ1blB1Ymxpc2hlZFBpcGVsaW5lIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1waXBlbGluZSdcbmltcG9ydCB7IFRyYW5zZmVyTWV0aG9kIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgVXBncmFkZUNhcmQgZnJvbSAnLi4vLi4vY3JlYXRlL3N0ZXAtb25lL3VwZ3JhZGUtY2FyZCdcbmltcG9ydCBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucydcbmltcG9ydCBEYXRhU291cmNlT3B0aW9ucyBmcm9tICcuL2RhdGEtc291cmNlLW9wdGlvbnMnXG5pbXBvcnQgeyB1c2VEYXRhU291cmNlU3RvcmUgfSBmcm9tICcuL2RhdGEtc291cmNlL3N0b3JlJ1xuaW1wb3J0IERhdGFTb3VyY2VQcm92aWRlciBmcm9tICcuL2RhdGEtc291cmNlL3N0b3JlL3Byb3ZpZGVyJ1xuaW1wb3J0IHsgdXNlQWRkRG9jdW1lbnRzU3RlcHMsIHVzZUxvY2FsRmlsZSwgdXNlT25saW5lRG9jdW1lbnQsIHVzZU9ubGluZURyaXZlLCB1c2VXZWJzaXRlQ3Jhd2wgfSBmcm9tICcuL2hvb2tzJ1xuaW1wb3J0IExlZnRIZWFkZXIgZnJvbSAnLi9sZWZ0LWhlYWRlcidcbmltcG9ydCBDaHVua1ByZXZpZXcgZnJvbSAnLi9wcmV2aWV3L2NodW5rLXByZXZpZXcnXG5pbXBvcnQgRmlsZVByZXZpZXcgZnJvbSAnLi9wcmV2aWV3L2ZpbGUtcHJldmlldydcbmltcG9ydCBPbmxpbmVEb2N1bWVudFByZXZpZXcgZnJvbSAnLi9wcmV2aWV3L29ubGluZS1kb2N1bWVudC1wcmV2aWV3J1xuaW1wb3J0IFdlYnNpdGVQcmV2aWV3IGZyb20gJy4vcHJldmlldy93ZWItcHJldmlldydcbmltcG9ydCBQcm9jZXNzRG9jdW1lbnRzIGZyb20gJy4vcHJvY2Vzcy1kb2N1bWVudHMnXG5pbXBvcnQgUHJvY2Vzc2luZyBmcm9tICcuL3Byb2Nlc3NpbmcnXG5cbmNvbnN0IENyZWF0ZUZvcm1QaXBlbGluZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHBsYW4gPSB1c2VQcm92aWRlckNvbnRleHRTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5wbGFuKVxuICBjb25zdCBlbmFibGVCaWxsaW5nID0gdXNlUHJvdmlkZXJDb250ZXh0U2VsZWN0b3Ioc3RhdGUgPT4gc3RhdGUuZW5hYmxlQmlsbGluZylcbiAgY29uc3QgcGlwZWxpbmVJZCA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yKHMgPT4gcy5kYXRhc2V0Py5waXBlbGluZV9pZClcbiAgY29uc3QgW2RhdGFzb3VyY2UsIHNldERhdGFzb3VyY2VdID0gdXNlU3RhdGU8RGF0YXNvdXJjZT4oKVxuICBjb25zdCBbZXN0aW1hdGVEYXRhLCBzZXRFc3RpbWF0ZURhdGFdID0gdXNlU3RhdGU8RmlsZUluZGV4aW5nRXN0aW1hdGVSZXNwb25zZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuICBjb25zdCBbYmF0Y2hJZCwgc2V0QmF0Y2hJZF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2RvY3VtZW50cywgc2V0RG9jdW1lbnRzXSA9IHVzZVN0YXRlPEluaXRpYWxEb2N1bWVudERldGFpbFtdPihbXSlcbiAgY29uc3QgZGF0YVNvdXJjZVN0b3JlID0gdXNlRGF0YVNvdXJjZVN0b3JlKClcblxuICBjb25zdCBpc1ByZXZpZXcgPSB1c2VSZWYoZmFsc2UpXG4gIGNvbnN0IGZvcm1SZWYgPSB1c2VSZWY8YW55PihudWxsKVxuXG4gIGNvbnN0IHsgZGF0YTogcGlwZWxpbmVJbmZvLCBpc0ZldGNoaW5nOiBpc0ZldGNoaW5nUGlwZWxpbmVJbmZvIH0gPSB1c2VQdWJsaXNoZWRQaXBlbGluZUluZm8ocGlwZWxpbmVJZCB8fCAnJylcbiAgY29uc3QgeyBkYXRhOiBmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UgfSA9IHVzZUZpbGVVcGxvYWRDb25maWcoKVxuXG4gIGNvbnN0IHtcbiAgICBzdGVwcyxcbiAgICBjdXJyZW50U3RlcCxcbiAgICBoYW5kbGVOZXh0U3RlcDogZG9IYW5kbGVOZXh0U3RlcCxcbiAgICBoYW5kbGVCYWNrU3RlcCxcbiAgfSA9IHVzZUFkZERvY3VtZW50c1N0ZXBzKClcbiAgY29uc3Qge1xuICAgIGxvY2FsRmlsZUxpc3QsXG4gICAgYWxsRmlsZUxvYWRlZCxcbiAgICBjdXJyZW50TG9jYWxGaWxlLFxuICAgIGhpZGVQcmV2aWV3TG9jYWxGaWxlLFxuICB9ID0gdXNlTG9jYWxGaWxlKClcbiAgY29uc3Qge1xuICAgIGN1cnJlbnRXb3Jrc3BhY2UsXG4gICAgb25saW5lRG9jdW1lbnRzLFxuICAgIGN1cnJlbnREb2N1bWVudCxcbiAgICBQYWdlc01hcEFuZFNlbGVjdGVkUGFnZXNJZCxcbiAgICBoaWRlUHJldmlld09ubGluZURvY3VtZW50LFxuICAgIGNsZWFyT25saW5lRG9jdW1lbnREYXRhLFxuICB9ID0gdXNlT25saW5lRG9jdW1lbnQoKVxuICBjb25zdCB7XG4gICAgd2Vic2l0ZVBhZ2VzLFxuICAgIGN1cnJlbnRXZWJzaXRlLFxuICAgIGhpZGVXZWJzaXRlUHJldmlldyxcbiAgICBjbGVhcldlYnNpdGVDcmF3bERhdGEsXG4gIH0gPSB1c2VXZWJzaXRlQ3Jhd2woKVxuICBjb25zdCB7XG4gICAgb25saW5lRHJpdmVGaWxlTGlzdCxcbiAgICBzZWxlY3RlZEZpbGVJZHMsXG4gICAgc2VsZWN0ZWRPbmxpbmVEcml2ZUZpbGVMaXN0LFxuICAgIGNsZWFyT25saW5lRHJpdmVEYXRhLFxuICB9ID0gdXNlT25saW5lRHJpdmUoKVxuXG4gIGNvbnN0IGRhdGFzb3VyY2VUeXBlID0gdXNlTWVtbygoKSA9PiBkYXRhc291cmNlPy5ub2RlRGF0YS5wcm92aWRlcl90eXBlLCBbZGF0YXNvdXJjZV0pXG4gIGNvbnN0IGlzVmVjdG9yU3BhY2VGdWxsID0gcGxhbi51c2FnZS52ZWN0b3JTcGFjZSA+PSBwbGFuLnRvdGFsLnZlY3RvclNwYWNlXG4gIGNvbnN0IGlzU2hvd1ZlY3RvclNwYWNlRnVsbCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZGF0YXNvdXJjZSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlKVxuICAgICAgcmV0dXJuIGFsbEZpbGVMb2FkZWQgJiYgaXNWZWN0b3JTcGFjZUZ1bGwgJiYgZW5hYmxlQmlsbGluZ1xuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpXG4gICAgICByZXR1cm4gb25saW5lRG9jdW1lbnRzLmxlbmd0aCA+IDAgJiYgaXNWZWN0b3JTcGFjZUZ1bGwgJiYgZW5hYmxlQmlsbGluZ1xuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsKVxuICAgICAgcmV0dXJuIHdlYnNpdGVQYWdlcy5sZW5ndGggPiAwICYmIGlzVmVjdG9yU3BhY2VGdWxsICYmIGVuYWJsZUJpbGxpbmdcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlKVxuICAgICAgcmV0dXJuIG9ubGluZURyaXZlRmlsZUxpc3QubGVuZ3RoID4gMCAmJiBpc1ZlY3RvclNwYWNlRnVsbCAmJiBlbmFibGVCaWxsaW5nXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sIFthbGxGaWxlTG9hZGVkLCBkYXRhc291cmNlLCBkYXRhc291cmNlVHlwZSwgZW5hYmxlQmlsbGluZywgaXNWZWN0b3JTcGFjZUZ1bGwsIG9ubGluZURvY3VtZW50cy5sZW5ndGgsIG9ubGluZURyaXZlRmlsZUxpc3QubGVuZ3RoLCB3ZWJzaXRlUGFnZXMubGVuZ3RoXSlcbiAgY29uc3Qgc3VwcG9ydEJhdGNoVXBsb2FkID0gIWVuYWJsZUJpbGxpbmcgfHwgcGxhbi50eXBlICE9PSAnc2FuZGJveCdcblxuICBjb25zdCBbaXNTaG93UGxhblVwZ3JhZGVNb2RhbCwge1xuICAgIHNldFRydWU6IHNob3dQbGFuVXBncmFkZU1vZGFsLFxuICAgIHNldEZhbHNlOiBoaWRlUGxhblVwZ3JhZGVNb2RhbCxcbiAgfV0gPSB1c2VCb29sZWFuKGZhbHNlKVxuICBjb25zdCBoYW5kbGVOZXh0U3RlcCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoIXN1cHBvcnRCYXRjaFVwbG9hZCkge1xuICAgICAgbGV0IGlzTXVsdGlwbGUgPSBmYWxzZVxuICAgICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUgJiYgbG9jYWxGaWxlTGlzdC5sZW5ndGggPiAxKVxuICAgICAgICBpc011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50ICYmIG9ubGluZURvY3VtZW50cy5sZW5ndGggPiAxKVxuICAgICAgICBpc011bHRpcGxlID0gdHJ1ZVxuXG4gICAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bCAmJiB3ZWJzaXRlUGFnZXMubGVuZ3RoID4gMSlcbiAgICAgICAgaXNNdWx0aXBsZSA9IHRydWVcblxuICAgICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSAmJiBzZWxlY3RlZEZpbGVJZHMubGVuZ3RoID4gMSlcbiAgICAgICAgaXNNdWx0aXBsZSA9IHRydWVcblxuICAgICAgaWYgKGlzTXVsdGlwbGUpIHtcbiAgICAgICAgc2hvd1BsYW5VcGdyYWRlTW9kYWwoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgZG9IYW5kbGVOZXh0U3RlcCgpXG4gIH0sIFtkYXRhc291cmNlVHlwZSwgZG9IYW5kbGVOZXh0U3RlcCwgbG9jYWxGaWxlTGlzdC5sZW5ndGgsIG9ubGluZURvY3VtZW50cy5sZW5ndGgsIHNlbGVjdGVkRmlsZUlkcy5sZW5ndGgsIHNob3dQbGFuVXBncmFkZU1vZGFsLCBzdXBwb3J0QmF0Y2hVcGxvYWQsIHdlYnNpdGVQYWdlcy5sZW5ndGhdKVxuXG4gIGNvbnN0IG5leHRCdG5EaXNhYmxlZCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghZGF0YXNvdXJjZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUpXG4gICAgICByZXR1cm4gaXNTaG93VmVjdG9yU3BhY2VGdWxsIHx8ICFsb2NhbEZpbGVMaXN0Lmxlbmd0aCB8fCAhYWxsRmlsZUxvYWRlZFxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpXG4gICAgICByZXR1cm4gaXNTaG93VmVjdG9yU3BhY2VGdWxsIHx8ICFvbmxpbmVEb2N1bWVudHMubGVuZ3RoXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS53ZWJzaXRlQ3Jhd2wpXG4gICAgICByZXR1cm4gaXNTaG93VmVjdG9yU3BhY2VGdWxsIHx8ICF3ZWJzaXRlUGFnZXMubGVuZ3RoXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSlcbiAgICAgIHJldHVybiBpc1Nob3dWZWN0b3JTcGFjZUZ1bGwgfHwgIXNlbGVjdGVkRmlsZUlkcy5sZW5ndGhcbiAgICByZXR1cm4gZmFsc2VcbiAgfSwgW2RhdGFzb3VyY2UsIGRhdGFzb3VyY2VUeXBlLCBpc1Nob3dWZWN0b3JTcGFjZUZ1bGwsIGxvY2FsRmlsZUxpc3QubGVuZ3RoLCBhbGxGaWxlTG9hZGVkLCBvbmxpbmVEb2N1bWVudHMubGVuZ3RoLCB3ZWJzaXRlUGFnZXMubGVuZ3RoLCBzZWxlY3RlZEZpbGVJZHMubGVuZ3RoXSlcblxuICBjb25zdCBmaWxlVXBsb2FkQ29uZmlnID0gdXNlTWVtbygoKSA9PiBmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UgPz8ge1xuICAgIGZpbGVfc2l6ZV9saW1pdDogMTUsXG4gICAgYmF0Y2hfY291bnRfbGltaXQ6IDUsXG4gIH0sIFtmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2VdKVxuXG4gIGNvbnN0IHNob3dTZWxlY3QgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50KSB7XG4gICAgICBjb25zdCBwYWdlc0NvdW50ID0gY3VycmVudFdvcmtzcGFjZT8ucGFnZXMubGVuZ3RoID8/IDBcbiAgICAgIHJldHVybiBwYWdlc0NvdW50ID4gMFxuICAgIH1cbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlKSB7XG4gICAgICBjb25zdCBpc0J1Y2tldExpc3QgPSBvbmxpbmVEcml2ZUZpbGVMaXN0LnNvbWUoZmlsZSA9PiBmaWxlLnR5cGUgPT09ICdidWNrZXQnKVxuICAgICAgcmV0dXJuICFpc0J1Y2tldExpc3QgJiYgb25saW5lRHJpdmVGaWxlTGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSAhPT0gJ2J1Y2tldCdcbiAgICAgIH0pLmxlbmd0aCA+IDBcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sIFtjdXJyZW50V29ya3NwYWNlPy5wYWdlcy5sZW5ndGgsIGRhdGFzb3VyY2VUeXBlLCBvbmxpbmVEcml2ZUZpbGVMaXN0XSlcblxuICBjb25zdCB0b3RhbE9wdGlvbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50KVxuICAgICAgcmV0dXJuIGN1cnJlbnRXb3Jrc3BhY2U/LnBhZ2VzLmxlbmd0aFxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUpIHtcbiAgICAgIHJldHVybiBvbmxpbmVEcml2ZUZpbGVMaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gaXRlbS50eXBlICE9PSAnYnVja2V0J1xuICAgICAgfSkubGVuZ3RoXG4gICAgfVxuICB9LCBbY3VycmVudFdvcmtzcGFjZT8ucGFnZXMubGVuZ3RoLCBkYXRhc291cmNlVHlwZSwgb25saW5lRHJpdmVGaWxlTGlzdF0pXG5cbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudClcbiAgICAgIHJldHVybiBvbmxpbmVEb2N1bWVudHMubGVuZ3RoXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSlcbiAgICAgIHJldHVybiBzZWxlY3RlZEZpbGVJZHMubGVuZ3RoXG4gIH0sIFtkYXRhc291cmNlVHlwZSwgb25saW5lRG9jdW1lbnRzLmxlbmd0aCwgc2VsZWN0ZWRGaWxlSWRzLmxlbmd0aF0pXG5cbiAgY29uc3QgdGlwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudClcbiAgICAgIHJldHVybiB0KCdhZGREb2N1bWVudHMuc2VsZWN0T25saW5lRG9jdW1lbnRUaXAnLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJywgY291bnQ6IDUwIH0pXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSkge1xuICAgICAgcmV0dXJuIHQoJ2FkZERvY3VtZW50cy5zZWxlY3RPbmxpbmVEcml2ZVRpcCcsIHtcbiAgICAgICAgbnM6ICdkYXRhc2V0UGlwZWxpbmUnLFxuICAgICAgICBjb3VudDogZmlsZVVwbG9hZENvbmZpZy5iYXRjaF9jb3VudF9saW1pdCxcbiAgICAgICAgZmlsZVNpemU6IGZpbGVVcGxvYWRDb25maWcuZmlsZV9zaXplX2xpbWl0LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuICcnXG4gIH0sIFtkYXRhc291cmNlVHlwZSwgZmlsZVVwbG9hZENvbmZpZy5iYXRjaF9jb3VudF9saW1pdCwgZmlsZVVwbG9hZENvbmZpZy5maWxlX3NpemVfbGltaXQsIHRdKVxuXG4gIGNvbnN0IHsgbXV0YXRlQXN5bmM6IHJ1blB1Ymxpc2hlZFBpcGVsaW5lLCBpc0lkbGUsIGlzUGVuZGluZyB9ID0gdXNlUnVuUHVibGlzaGVkUGlwZWxpbmUoKVxuXG4gIGNvbnN0IGhhbmRsZVByZXZpZXdDaHVua3MgPSB1c2VDYWxsYmFjayhhc3luYyAoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGlmICghZGF0YXNvdXJjZSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHtcbiAgICAgIHByZXZpZXdMb2NhbEZpbGVSZWYsXG4gICAgICBwcmV2aWV3T25saW5lRG9jdW1lbnRSZWYsXG4gICAgICBwcmV2aWV3V2Vic2l0ZVBhZ2VSZWYsXG4gICAgICBwcmV2aWV3T25saW5lRHJpdmVGaWxlUmVmLFxuICAgICAgY3VycmVudENyZWRlbnRpYWxJZCxcbiAgICB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBkYXRhc291cmNlSW5mb0xpc3Q6IFJlY29yZDxzdHJpbmcsIGFueT5bXSA9IFtdXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUpIHtcbiAgICAgIGNvbnN0IHsgaWQsIG5hbWUsIHR5cGUsIHNpemUsIGV4dGVuc2lvbiwgbWltZV90eXBlIH0gPSBwcmV2aWV3TG9jYWxGaWxlUmVmLmN1cnJlbnQgYXMgRmlsZVxuICAgICAgY29uc3QgZG9jdW1lbnRJbmZvID0ge1xuICAgICAgICByZWxhdGVkX2lkOiBpZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgZXh0ZW5zaW9uLFxuICAgICAgICBtaW1lX3R5cGUsXG4gICAgICAgIHVybDogJycsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgICAgY3JlZGVudGlhbF9pZDogY3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgIH1cbiAgICAgIGRhdGFzb3VyY2VJbmZvTGlzdC5wdXNoKGRvY3VtZW50SW5mbylcbiAgICB9XG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudCkge1xuICAgICAgY29uc3QgeyB3b3Jrc3BhY2VfaWQsIC4uLnJlc3QgfSA9IHByZXZpZXdPbmxpbmVEb2N1bWVudFJlZi5jdXJyZW50IVxuICAgICAgY29uc3QgZG9jdW1lbnRJbmZvID0ge1xuICAgICAgICB3b3Jrc3BhY2VfaWQsXG4gICAgICAgIHBhZ2U6IHJlc3QsXG4gICAgICAgIGNyZWRlbnRpYWxfaWQ6IGN1cnJlbnRDcmVkZW50aWFsSWQsXG4gICAgICB9XG4gICAgICBkYXRhc291cmNlSW5mb0xpc3QucHVzaChkb2N1bWVudEluZm8pXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsKSB7XG4gICAgICBkYXRhc291cmNlSW5mb0xpc3QucHVzaCh7XG4gICAgICAgIC4uLnByZXZpZXdXZWJzaXRlUGFnZVJlZi5jdXJyZW50ISxcbiAgICAgICAgY3JlZGVudGlhbF9pZDogY3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUpIHtcbiAgICAgIGNvbnN0IHsgYnVja2V0IH0gPSBkYXRhU291cmNlU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyBpZCwgdHlwZSwgbmFtZSB9ID0gcHJldmlld09ubGluZURyaXZlRmlsZVJlZi5jdXJyZW50IVxuICAgICAgZGF0YXNvdXJjZUluZm9MaXN0LnB1c2goe1xuICAgICAgICBidWNrZXQsXG4gICAgICAgIGlkLFxuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlLFxuICAgICAgICBjcmVkZW50aWFsX2lkOiBjdXJyZW50Q3JlZGVudGlhbElkLFxuICAgICAgfSlcbiAgICB9XG4gICAgYXdhaXQgcnVuUHVibGlzaGVkUGlwZWxpbmUoe1xuICAgICAgcGlwZWxpbmVfaWQ6IHBpcGVsaW5lSWQhLFxuICAgICAgaW5wdXRzOiBkYXRhLFxuICAgICAgc3RhcnRfbm9kZV9pZDogZGF0YXNvdXJjZS5ub2RlSWQsXG4gICAgICBkYXRhc291cmNlX3R5cGU6IGRhdGFzb3VyY2VUeXBlIGFzIERhdGFzb3VyY2VUeXBlLFxuICAgICAgZGF0YXNvdXJjZV9pbmZvX2xpc3Q6IGRhdGFzb3VyY2VJbmZvTGlzdCxcbiAgICAgIGlzX3ByZXZpZXc6IHRydWUsXG4gICAgfSwge1xuICAgICAgb25TdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgIHNldEVzdGltYXRlRGF0YSgocmVzIGFzIFB1Ymxpc2hlZFBpcGVsaW5lUnVuUHJldmlld1Jlc3BvbnNlKS5kYXRhLm91dHB1dHMpXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtkYXRhc291cmNlLCBkYXRhc291cmNlVHlwZSwgcnVuUHVibGlzaGVkUGlwZWxpbmUsIHBpcGVsaW5lSWQsIGRhdGFTb3VyY2VTdG9yZV0pXG5cbiAgY29uc3QgaGFuZGxlUHJvY2VzcyA9IHVzZUNhbGxiYWNrKGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgaWYgKCFkYXRhc291cmNlKVxuICAgICAgcmV0dXJuXG4gICAgY29uc3QgeyBjdXJyZW50Q3JlZGVudGlhbElkIH0gPSBkYXRhU291cmNlU3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGRhdGFzb3VyY2VJbmZvTGlzdDogUmVjb3JkPHN0cmluZywgYW55PltdID0gW11cbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBsb2NhbEZpbGVMaXN0LFxuICAgICAgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBsb2NhbEZpbGVMaXN0LmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgeyBpZCwgbmFtZSwgdHlwZSwgc2l6ZSwgZXh0ZW5zaW9uLCBtaW1lX3R5cGUgfSA9IGZpbGUuZmlsZVxuICAgICAgICBjb25zdCBkb2N1bWVudEluZm8gPSB7XG4gICAgICAgICAgcmVsYXRlZF9pZDogaWQsXG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIHNpemUsXG4gICAgICAgICAgZXh0ZW5zaW9uLFxuICAgICAgICAgIG1pbWVfdHlwZSxcbiAgICAgICAgICB1cmw6ICcnLFxuICAgICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgICAgICBjcmVkZW50aWFsX2lkOiBjdXJyZW50Q3JlZGVudGlhbElkLFxuICAgICAgICB9XG4gICAgICAgIGRhdGFzb3VyY2VJbmZvTGlzdC5wdXNoKGRvY3VtZW50SW5mbylcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgb25saW5lRG9jdW1lbnRzLFxuICAgICAgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBvbmxpbmVEb2N1bWVudHMuZm9yRWFjaCgocGFnZSkgPT4ge1xuICAgICAgICBjb25zdCB7IHdvcmtzcGFjZV9pZCwgLi4ucmVzdCB9ID0gcGFnZVxuICAgICAgICBjb25zdCBkb2N1bWVudEluZm8gPSB7XG4gICAgICAgICAgd29ya3NwYWNlX2lkLFxuICAgICAgICAgIHBhZ2U6IHJlc3QsXG4gICAgICAgICAgY3JlZGVudGlhbF9pZDogY3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgICAgfVxuICAgICAgICBkYXRhc291cmNlSW5mb0xpc3QucHVzaChkb2N1bWVudEluZm8pXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICB3ZWJzaXRlUGFnZXMsXG4gICAgICB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICAgIHdlYnNpdGVQYWdlcy5mb3JFYWNoKCh3ZWJzaXRlUGFnZSkgPT4ge1xuICAgICAgICBkYXRhc291cmNlSW5mb0xpc3QucHVzaCh7XG4gICAgICAgICAgLi4ud2Vic2l0ZVBhZ2UsXG4gICAgICAgICAgY3JlZGVudGlhbF9pZDogY3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBzZWxlY3RlZEZpbGVJZHMsXG4gICAgICAgIG9ubGluZURyaXZlRmlsZUxpc3QsXG4gICAgICB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNlbGVjdGVkRmlsZUlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gb25saW5lRHJpdmVGaWxlTGlzdC5maW5kKGZpbGUgPT4gZmlsZS5pZCA9PT0gaWQpXG4gICAgICAgIGRhdGFzb3VyY2VJbmZvTGlzdC5wdXNoKHtcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgaWQ6IGZpbGU/LmlkLFxuICAgICAgICAgIG5hbWU6IGZpbGU/Lm5hbWUsXG4gICAgICAgICAgdHlwZTogZmlsZT8udHlwZSxcbiAgICAgICAgICBjcmVkZW50aWFsX2lkOiBjdXJyZW50Q3JlZGVudGlhbElkLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gICAgYXdhaXQgcnVuUHVibGlzaGVkUGlwZWxpbmUoe1xuICAgICAgcGlwZWxpbmVfaWQ6IHBpcGVsaW5lSWQhLFxuICAgICAgaW5wdXRzOiBkYXRhLFxuICAgICAgc3RhcnRfbm9kZV9pZDogZGF0YXNvdXJjZS5ub2RlSWQsXG4gICAgICBkYXRhc291cmNlX3R5cGU6IGRhdGFzb3VyY2VUeXBlIGFzIERhdGFzb3VyY2VUeXBlLFxuICAgICAgZGF0YXNvdXJjZV9pbmZvX2xpc3Q6IGRhdGFzb3VyY2VJbmZvTGlzdCxcbiAgICAgIGlzX3ByZXZpZXc6IGZhbHNlLFxuICAgIH0sIHtcbiAgICAgIG9uU3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICBzZXRCYXRjaElkKChyZXMgYXMgUHVibGlzaGVkUGlwZWxpbmVSdW5SZXNwb25zZSkuYmF0Y2ggfHwgJycpXG4gICAgICAgIHNldERvY3VtZW50cygocmVzIGFzIFB1Ymxpc2hlZFBpcGVsaW5lUnVuUmVzcG9uc2UpLmRvY3VtZW50cyB8fCBbXSlcbiAgICAgICAgaGFuZGxlTmV4dFN0ZXAoKVxuICAgICAgICB0cmFja0V2ZW50KCdkYXRhc2V0X2RvY3VtZW50X2FkZGVkJywge1xuICAgICAgICAgIGRhdGFfc291cmNlX3R5cGU6IGRhdGFzb3VyY2VUeXBlLFxuICAgICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogJ3BpcGVsaW5lJyxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcbiAgfSwgW2RhdGFTb3VyY2VTdG9yZSwgZGF0YXNvdXJjZSwgZGF0YXNvdXJjZVR5cGUsIGhhbmRsZU5leHRTdGVwLCBwaXBlbGluZUlkLCBydW5QdWJsaXNoZWRQaXBlbGluZV0pXG5cbiAgY29uc3Qgb25DbGlja1Byb2Nlc3MgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaXNQcmV2aWV3LmN1cnJlbnQgPSBmYWxzZVxuICAgIGZvcm1SZWYuY3VycmVudD8uc3VibWl0KClcbiAgfSwgW10pXG5cbiAgY29uc3Qgb25DbGlja1ByZXZpZXcgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaXNQcmV2aWV3LmN1cnJlbnQgPSB0cnVlXG4gICAgZm9ybVJlZi5jdXJyZW50Py5zdWJtaXQoKVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSB1c2VDYWxsYmFjaygoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGlmIChpc1ByZXZpZXcuY3VycmVudClcbiAgICAgIGhhbmRsZVByZXZpZXdDaHVua3MoZGF0YSlcbiAgICBlbHNlXG4gICAgICBoYW5kbGVQcm9jZXNzKGRhdGEpXG4gIH0sIFtoYW5kbGVQcmV2aWV3Q2h1bmtzLCBoYW5kbGVQcm9jZXNzXSlcblxuICBjb25zdCBoYW5kbGVQcmV2aWV3RmlsZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChmaWxlOiBEb2N1bWVudEl0ZW0pID0+IHtcbiAgICBjb25zdCB7IHByZXZpZXdMb2NhbEZpbGVSZWYgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgcHJldmlld0xvY2FsRmlsZVJlZi5jdXJyZW50ID0gZmlsZVxuICAgIG9uQ2xpY2tQcmV2aWV3KClcbiAgfSwgW2RhdGFTb3VyY2VTdG9yZSwgb25DbGlja1ByZXZpZXddKVxuXG4gIGNvbnN0IGhhbmRsZVByZXZpZXdPbmxpbmVEb2N1bWVudENoYW5nZSA9IHVzZUNhbGxiYWNrKChwYWdlOiBOb3Rpb25QYWdlKSA9PiB7XG4gICAgY29uc3QgeyBwcmV2aWV3T25saW5lRG9jdW1lbnRSZWYgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgcHJldmlld09ubGluZURvY3VtZW50UmVmLmN1cnJlbnQgPSBwYWdlXG4gICAgb25DbGlja1ByZXZpZXcoKVxuICB9LCBbZGF0YVNvdXJjZVN0b3JlLCBvbkNsaWNrUHJldmlld10pXG5cbiAgY29uc3QgaGFuZGxlUHJldmlld1dlYnNpdGVDaGFuZ2UgPSB1c2VDYWxsYmFjaygod2Vic2l0ZTogQ3Jhd2xSZXN1bHRJdGVtKSA9PiB7XG4gICAgY29uc3QgeyBwcmV2aWV3V2Vic2l0ZVBhZ2VSZWYgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgcHJldmlld1dlYnNpdGVQYWdlUmVmLmN1cnJlbnQgPSB3ZWJzaXRlXG4gICAgb25DbGlja1ByZXZpZXcoKVxuICB9LCBbZGF0YVNvdXJjZVN0b3JlLCBvbkNsaWNrUHJldmlld10pXG5cbiAgY29uc3QgaGFuZGxlUHJldmlld09ubGluZURyaXZlRmlsZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChmaWxlOiBPbmxpbmVEcml2ZUZpbGUpID0+IHtcbiAgICBjb25zdCB7IHByZXZpZXdPbmxpbmVEcml2ZUZpbGVSZWYgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgcHJldmlld09ubGluZURyaXZlRmlsZVJlZi5jdXJyZW50ID0gZmlsZVxuICAgIG9uQ2xpY2tQcmV2aWV3KClcbiAgfSwgW2RhdGFTb3VyY2VTdG9yZSwgb25DbGlja1ByZXZpZXddKVxuXG4gIGNvbnN0IGhhbmRsZVNlbGVjdEFsbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBvbmxpbmVEb2N1bWVudHMsXG4gICAgICBvbmxpbmVEcml2ZUZpbGVMaXN0LFxuICAgICAgc2VsZWN0ZWRGaWxlSWRzLFxuICAgICAgc2V0T25saW5lRG9jdW1lbnRzLFxuICAgICAgc2V0U2VsZWN0ZWRGaWxlSWRzLFxuICAgICAgc2V0U2VsZWN0ZWRQYWdlc0lkLFxuICAgIH0gPSBkYXRhU291cmNlU3RvcmUuZ2V0U3RhdGUoKVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpIHtcbiAgICAgIGNvbnN0IGFsbElkcyA9IGN1cnJlbnRXb3Jrc3BhY2U/LnBhZ2VzLm1hcChwYWdlID0+IHBhZ2UucGFnZV9pZCkgfHwgW11cbiAgICAgIGlmIChvbmxpbmVEb2N1bWVudHMubGVuZ3RoIDwgYWxsSWRzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZFBhZ2VzID0gQXJyYXkuZnJvbShhbGxJZHMpLm1hcChwYWdlSWQgPT4gUGFnZXNNYXBBbmRTZWxlY3RlZFBhZ2VzSWRbcGFnZUlkXSlcbiAgICAgICAgc2V0T25saW5lRG9jdW1lbnRzKHNlbGVjdGVkUGFnZXMpXG4gICAgICAgIHNldFNlbGVjdGVkUGFnZXNJZChuZXcgU2V0KGFsbElkcykpXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc2V0T25saW5lRG9jdW1lbnRzKFtdKVxuICAgICAgICBzZXRTZWxlY3RlZFBhZ2VzSWQobmV3IFNldCgpKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlKSB7XG4gICAgICBjb25zdCBhbGxLZXlzID0gb25saW5lRHJpdmVGaWxlTGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udHlwZSAhPT0gJ2J1Y2tldCdcbiAgICAgIH0pLm1hcChmaWxlID0+IGZpbGUuaWQpXG4gICAgICBpZiAoc2VsZWN0ZWRGaWxlSWRzLmxlbmd0aCA8IGFsbEtleXMubGVuZ3RoKVxuICAgICAgICBzZXRTZWxlY3RlZEZpbGVJZHMoYWxsS2V5cylcbiAgICAgIGVsc2VcbiAgICAgICAgc2V0U2VsZWN0ZWRGaWxlSWRzKFtdKVxuICAgIH1cbiAgfSwgW1BhZ2VzTWFwQW5kU2VsZWN0ZWRQYWdlc0lkLCBjdXJyZW50V29ya3NwYWNlPy5wYWdlcywgZGF0YVNvdXJjZVN0b3JlLCBkYXRhc291cmNlVHlwZV0pXG5cbiAgY29uc3QgY2xlYXJEYXRhU291cmNlRGF0YSA9IHVzZUNhbGxiYWNrKChkYXRhU291cmNlOiBEYXRhc291cmNlKSA9PiB7XG4gICAgY29uc3QgcHJvdmlkZXJUeXBlID0gZGF0YVNvdXJjZS5ub2RlRGF0YS5wcm92aWRlcl90eXBlXG4gICAgaWYgKHByb3ZpZGVyVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpXG4gICAgICBjbGVhck9ubGluZURvY3VtZW50RGF0YSgpXG4gICAgZWxzZSBpZiAocHJvdmlkZXJUeXBlID09PSBEYXRhc291cmNlVHlwZS53ZWJzaXRlQ3Jhd2wpXG4gICAgICBjbGVhcldlYnNpdGVDcmF3bERhdGEoKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUpXG4gICAgICBjbGVhck9ubGluZURyaXZlRGF0YSgpXG4gIH0sIFtjbGVhck9ubGluZURvY3VtZW50RGF0YSwgY2xlYXJPbmxpbmVEcml2ZURhdGEsIGNsZWFyV2Vic2l0ZUNyYXdsRGF0YV0pXG5cbiAgY29uc3QgaGFuZGxlU3dpdGNoRGF0YVNvdXJjZSA9IHVzZUNhbGxiYWNrKChkYXRhU291cmNlOiBEYXRhc291cmNlKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2V0Q3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgIGN1cnJlbnROb2RlSWRSZWYsXG4gICAgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY2xlYXJEYXRhU291cmNlRGF0YShkYXRhU291cmNlKVxuICAgIHNldEN1cnJlbnRDcmVkZW50aWFsSWQoJycpXG4gICAgY3VycmVudE5vZGVJZFJlZi5jdXJyZW50ID0gZGF0YVNvdXJjZS5ub2RlSWRcbiAgICBzZXREYXRhc291cmNlKGRhdGFTb3VyY2UpXG4gIH0sIFtjbGVhckRhdGFTb3VyY2VEYXRhLCBkYXRhU291cmNlU3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZUNyZWRlbnRpYWxDaGFuZ2UgPSB1c2VDYWxsYmFjaygoY3JlZGVudGlhbElkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IHNldEN1cnJlbnRDcmVkZW50aWFsSWQgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY2xlYXJEYXRhU291cmNlRGF0YShkYXRhc291cmNlISlcbiAgICBzZXRDdXJyZW50Q3JlZGVudGlhbElkKGNyZWRlbnRpYWxJZClcbiAgfSwgW2NsZWFyRGF0YVNvdXJjZURhdGEsIGRhdGFTb3VyY2VTdG9yZSwgZGF0YXNvdXJjZV0pXG5cbiAgaWYgKGlzRmV0Y2hpbmdQaXBlbGluZUluZm8pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPExvYWRpbmcgdHlwZT1cImFwcFwiIC8+XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGgtW2NhbGMoMTAwdmgtNTZweCldIHctZnVsbCBtaW4tdy1bMTAyNHB4XSBvdmVyZmxvdy14LWF1dG8gcm91bmRlZC10LTJ4bCBib3JkZXItdCBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLWZ1bGwgbWluLXctMCBmbGV4LTFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCBmbGV4LWNvbCBweC0xNFwiPlxuICAgICAgICAgIDxMZWZ0SGVhZGVyXG4gICAgICAgICAgICBzdGVwcz17c3RlcHN9XG4gICAgICAgICAgICB0aXRsZT17dCgnYWRkRG9jdW1lbnRzLnRpdGxlJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9XG4gICAgICAgICAgICBjdXJyZW50U3RlcD17Y3VycmVudFN0ZXB9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3cgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGVwID09PSAxICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLXktNSBwdC00XCI+XG4gICAgICAgICAgICAgICAgICA8RGF0YVNvdXJjZU9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgZGF0YXNvdXJjZU5vZGVJZD17ZGF0YXNvdXJjZT8ubm9kZUlkIHx8ICcnfVxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17aGFuZGxlU3dpdGNoRGF0YVNvdXJjZX1cbiAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmVOb2Rlcz17KHBpcGVsaW5lSW5mbz8uZ3JhcGgubm9kZXMgfHwgW10pIGFzIE5vZGU8RGF0YVNvdXJjZU5vZGVUeXBlPltdfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIHtkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlICYmIChcbiAgICAgICAgICAgICAgICAgICAgPExvY2FsRmlsZVxuICAgICAgICAgICAgICAgICAgICAgIGFsbG93ZWRFeHRlbnNpb25zPXtkYXRhc291cmNlIS5ub2RlRGF0YS5maWxlRXh0ZW5zaW9ucyB8fCBbXX1cbiAgICAgICAgICAgICAgICAgICAgICBzdXBwb3J0QmF0Y2hVcGxvYWQ9e3N1cHBvcnRCYXRjaFVwbG9hZH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICB7ZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50ICYmIChcbiAgICAgICAgICAgICAgICAgICAgPE9ubGluZURvY3VtZW50c1xuICAgICAgICAgICAgICAgICAgICAgIG5vZGVJZD17ZGF0YXNvdXJjZSEubm9kZUlkfVxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVEYXRhPXtkYXRhc291cmNlIS5ub2RlRGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNyZWRlbnRpYWxDaGFuZ2U9e2hhbmRsZUNyZWRlbnRpYWxDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAge2RhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS53ZWJzaXRlQ3Jhd2wgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8V2Vic2l0ZUNyYXdsXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZUlkPXtkYXRhc291cmNlIS5ub2RlSWR9XG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURhdGE9e2RhdGFzb3VyY2UhLm5vZGVEYXRhfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ3JlZGVudGlhbENoYW5nZT17aGFuZGxlQ3JlZGVudGlhbENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICB7ZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlICYmIChcbiAgICAgICAgICAgICAgICAgICAgPE9ubGluZURyaXZlXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZUlkPXtkYXRhc291cmNlIS5ub2RlSWR9XG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURhdGE9e2RhdGFzb3VyY2UhLm5vZGVEYXRhfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ3JlZGVudGlhbENoYW5nZT17aGFuZGxlQ3JlZGVudGlhbENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICB7aXNTaG93VmVjdG9yU3BhY2VGdWxsICYmIChcbiAgICAgICAgICAgICAgICAgICAgPFZlY3RvclNwYWNlRnVsbCAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIHNob3dTZWxlY3Q9e3Nob3dTZWxlY3R9XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsT3B0aW9ucz17dG90YWxPcHRpb25zfVxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZE9wdGlvbnM9e3NlbGVjdGVkT3B0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgb25TZWxlY3RBbGw9e2hhbmRsZVNlbGVjdEFsbH1cbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e25leHRCdG5EaXNhYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTmV4dFN0ZXA9e2hhbmRsZU5leHRTdGVwfVxuICAgICAgICAgICAgICAgICAgICB0aXA9e3RpcH1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICFzdXBwb3J0QmF0Y2hVcGxvYWQgJiYgZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSAmJiBsb2NhbEZpbGVMaXN0Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8RGl2aWRlciB0eXBlPVwiaG9yaXpvbnRhbFwiIGNsYXNzTmFtZT1cIm15LTQgaC1weCBiZy1kaXZpZGVyLXN1YnRsZVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8VXBncmFkZUNhcmQgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGVwID09PSAyICYmIChcbiAgICAgICAgICAgICAgICA8UHJvY2Vzc0RvY3VtZW50c1xuICAgICAgICAgICAgICAgICAgcmVmPXtmb3JtUmVmfVxuICAgICAgICAgICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZD17ZGF0YXNvdXJjZSEubm9kZUlkfVxuICAgICAgICAgICAgICAgICAgaXNSdW5uaW5nPXtpc1BlbmRpbmd9XG4gICAgICAgICAgICAgICAgICBvblByb2Nlc3M9e29uQ2xpY2tQcm9jZXNzfVxuICAgICAgICAgICAgICAgICAgb25QcmV2aWV3PXtvbkNsaWNrUHJldmlld31cbiAgICAgICAgICAgICAgICAgIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9XG4gICAgICAgICAgICAgICAgICBvbkJhY2s9e2hhbmRsZUJhY2tTdGVwfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY3VycmVudFN0ZXAgPT09IDMgJiYgKFxuICAgICAgICAgICAgICAgIDxQcm9jZXNzaW5nXG4gICAgICAgICAgICAgICAgICBiYXRjaElkPXtiYXRjaElkfVxuICAgICAgICAgICAgICAgICAgZG9jdW1lbnRzPXtkb2N1bWVudHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIFByZXZpZXcgKi99XG4gICAgICB7XG4gICAgICAgIGN1cnJlbnRTdGVwID09PSAxICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtZnVsbCBtaW4tdy0wIGZsZXgtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCBmbGV4LWNvbCBwbC0yIHB0LTJcIj5cbiAgICAgICAgICAgICAge2N1cnJlbnRMb2NhbEZpbGUgJiYgKFxuICAgICAgICAgICAgICAgIDxGaWxlUHJldmlld1xuICAgICAgICAgICAgICAgICAgZmlsZT17Y3VycmVudExvY2FsRmlsZX1cbiAgICAgICAgICAgICAgICAgIGhpZGVQcmV2aWV3PXtoaWRlUHJldmlld0xvY2FsRmlsZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICB7Y3VycmVudERvY3VtZW50ICYmIChcbiAgICAgICAgICAgICAgICA8T25saW5lRG9jdW1lbnRQcmV2aWV3XG4gICAgICAgICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPXtkYXRhc291cmNlIS5ub2RlSWR9XG4gICAgICAgICAgICAgICAgICBjdXJyZW50UGFnZT17Y3VycmVudERvY3VtZW50fVxuICAgICAgICAgICAgICAgICAgaGlkZVByZXZpZXc9e2hpZGVQcmV2aWV3T25saW5lRG9jdW1lbnR9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge2N1cnJlbnRXZWJzaXRlICYmIChcbiAgICAgICAgICAgICAgICA8V2Vic2l0ZVByZXZpZXdcbiAgICAgICAgICAgICAgICAgIGN1cnJlbnRXZWJzaXRlPXtjdXJyZW50V2Vic2l0ZX1cbiAgICAgICAgICAgICAgICAgIGhpZGVQcmV2aWV3PXtoaWRlV2Vic2l0ZVByZXZpZXd9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIGN1cnJlbnRTdGVwID09PSAyICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtZnVsbCBtaW4tdy0wIGZsZXgtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCBmbGV4LWNvbCBwbC0yIHB0LTJcIj5cbiAgICAgICAgICAgICAgPENodW5rUHJldmlld1xuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2VUeXBlPXtkYXRhc291cmNlVHlwZSBhcyBEYXRhc291cmNlVHlwZX1cbiAgICAgICAgICAgICAgICBsb2NhbEZpbGVzPXtsb2NhbEZpbGVMaXN0Lm1hcChmaWxlID0+IGZpbGUuZmlsZSl9XG4gICAgICAgICAgICAgICAgb25saW5lRG9jdW1lbnRzPXtvbmxpbmVEb2N1bWVudHN9XG4gICAgICAgICAgICAgICAgd2Vic2l0ZVBhZ2VzPXt3ZWJzaXRlUGFnZXN9XG4gICAgICAgICAgICAgICAgb25saW5lRHJpdmVGaWxlcz17c2VsZWN0ZWRPbmxpbmVEcml2ZUZpbGVMaXN0fVxuICAgICAgICAgICAgICAgIGlzSWRsZT17aXNJZGxlfVxuICAgICAgICAgICAgICAgIGlzUGVuZGluZz17aXNQZW5kaW5nICYmIGlzUHJldmlldy5jdXJyZW50fVxuICAgICAgICAgICAgICAgIGVzdGltYXRlRGF0YT17ZXN0aW1hdGVEYXRhfVxuICAgICAgICAgICAgICAgIG9uUHJldmlldz17b25DbGlja1ByZXZpZXd9XG4gICAgICAgICAgICAgICAgaGFuZGxlUHJldmlld0ZpbGVDaGFuZ2U9e2hhbmRsZVByZXZpZXdGaWxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgIGhhbmRsZVByZXZpZXdPbmxpbmVEb2N1bWVudENoYW5nZT17aGFuZGxlUHJldmlld09ubGluZURvY3VtZW50Q2hhbmdlfVxuICAgICAgICAgICAgICAgIGhhbmRsZVByZXZpZXdXZWJzaXRlUGFnZUNoYW5nZT17aGFuZGxlUHJldmlld1dlYnNpdGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgaGFuZGxlUHJldmlld09ubGluZURyaXZlRmlsZUNoYW5nZT17aGFuZGxlUHJldmlld09ubGluZURyaXZlRmlsZUNoYW5nZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB7aXNTaG93UGxhblVwZ3JhZGVNb2RhbCAmJiAoXG4gICAgICAgIDxQbGFuVXBncmFkZU1vZGFsXG4gICAgICAgICAgc2hvd1xuICAgICAgICAgIG9uQ2xvc2U9e2hpZGVQbGFuVXBncmFkZU1vZGFsfVxuICAgICAgICAgIHRpdGxlPXt0KCd1cGdyYWRlLnVwbG9hZE11bHRpcGxlUGFnZXMudGl0bGUnLCB7IG5zOiAnYmlsbGluZycgfSkhfVxuICAgICAgICAgIGRlc2NyaXB0aW9uPXt0KCd1cGdyYWRlLnVwbG9hZE11bHRpcGxlUGFnZXMuZGVzY3JpcHRpb24nLCB7IG5zOiAnYmlsbGluZycgfSkhfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBDcmVhdGVGb3JtUGlwZWxpbmVXcmFwcGVyID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxEYXRhU291cmNlUHJvdmlkZXI+XG4gICAgICA8Q3JlYXRlRm9ybVBpcGVsaW5lIC8+XG4gICAgPC9EYXRhU291cmNlUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ3JlYXRlRm9ybVBpcGVsaW5lV3JhcHBlclxuIl19