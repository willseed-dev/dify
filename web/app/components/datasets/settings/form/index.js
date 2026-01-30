"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const app_icon_1 = require("@/app/components/base/app-icon");
const app_icon_picker_1 = require("@/app/components/base/app-icon-picker");
const button_1 = require("@/app/components/base/button");
const divider_1 = require("@/app/components/base/divider");
const development_1 = require("@/app/components/base/icons/src/vender/solid/development");
const input_1 = require("@/app/components/base/input");
const textarea_1 = require("@/app/components/base/textarea");
const toast_1 = require("@/app/components/base/toast");
const check_rerank_model_1 = require("@/app/components/datasets/common/check-rerank-model");
const economical_retrieval_method_config_1 = require("@/app/components/datasets/common/economical-retrieval-method-config");
const retrieval_method_config_1 = require("@/app/components/datasets/common/retrieval-method-config");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const model_selector_1 = require("@/app/components/header/account-setting/model-provider-page/model-selector");
const app_context_1 = require("@/context/app-context");
const dataset_detail_1 = require("@/context/dataset-detail");
const i18n_1 = require("@/context/i18n");
const datasets_1 = require("@/models/datasets");
const datasets_2 = require("@/service/datasets");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const use_common_1 = require("@/service/use-common");
const step_two_1 = require("../../create/step-two");
const RetrievalSettings_1 = require("../../external-knowledge-base/create/RetrievalSettings");
const chunk_structure_1 = require("../chunk-structure");
const index_method_1 = require("../index-method");
const permission_selector_1 = require("../permission-selector");
const utils_1 = require("../utils");
const rowClass = 'flex gap-x-1';
const labelClass = 'flex items-center shrink-0 w-[180px] h-7 pt-1';
const DEFAULT_APP_ICON = {
    icon_type: 'emoji',
    icon: '📙',
    icon_background: '#FFF4ED',
    icon_url: '',
};
const Form = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const isCurrentWorkspaceDatasetOperator = (0, app_context_1.useSelector)(state => state.isCurrentWorkspaceDatasetOperator);
    const currentDataset = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(state => state.dataset);
    const mutateDatasets = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(state => state.mutateDatasetRes);
    const [loading, setLoading] = (0, react_2.useState)(false);
    const [name, setName] = (0, react_2.useState)(currentDataset?.name ?? '');
    const [iconInfo, setIconInfo] = (0, react_2.useState)(currentDataset?.icon_info || DEFAULT_APP_ICON);
    const [showAppIconPicker, setShowAppIconPicker] = (0, react_2.useState)(false);
    const [description, setDescription] = (0, react_2.useState)(currentDataset?.description ?? '');
    const [permission, setPermission] = (0, react_2.useState)(currentDataset?.permission);
    const [topK, setTopK] = (0, react_2.useState)(currentDataset?.external_retrieval_model.top_k ?? 2);
    const [scoreThreshold, setScoreThreshold] = (0, react_2.useState)(currentDataset?.external_retrieval_model.score_threshold ?? 0.5);
    const [scoreThresholdEnabled, setScoreThresholdEnabled] = (0, react_2.useState)(currentDataset?.external_retrieval_model.score_threshold_enabled ?? false);
    const [selectedMemberIDs, setSelectedMemberIDs] = (0, react_2.useState)(currentDataset?.partial_member_list || []);
    const [memberList, setMemberList] = (0, react_2.useState)([]);
    const [indexMethod, setIndexMethod] = (0, react_2.useState)(currentDataset?.indexing_technique);
    const [keywordNumber, setKeywordNumber] = (0, react_2.useState)(currentDataset?.keyword_number ?? 10);
    const [retrievalConfig, setRetrievalConfig] = (0, react_2.useState)(currentDataset?.retrieval_model_dict);
    const [embeddingModel, setEmbeddingModel] = (0, react_2.useState)(currentDataset?.embedding_model
        ? {
            provider: currentDataset.embedding_model_provider,
            model: currentDataset.embedding_model,
        }
        : {
            provider: '',
            model: '',
        });
    const { data: rerankModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.rerank);
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: membersData } = (0, use_common_1.useMembers)();
    const previousAppIcon = (0, react_2.useRef)(DEFAULT_APP_ICON);
    const handleOpenAppIconPicker = (0, react_2.useCallback)(() => {
        setShowAppIconPicker(true);
        previousAppIcon.current = iconInfo;
    }, [iconInfo]);
    const handleSelectAppIcon = (0, react_2.useCallback)((icon) => {
        const iconInfo = {
            icon_type: icon.type,
            icon: icon.type === 'emoji' ? icon.icon : icon.fileId,
            icon_background: icon.type === 'emoji' ? icon.background : undefined,
            icon_url: icon.type === 'emoji' ? undefined : icon.url,
        };
        setIconInfo(iconInfo);
        setShowAppIconPicker(false);
    }, []);
    const handleCloseAppIconPicker = (0, react_2.useCallback)(() => {
        setIconInfo(previousAppIcon.current);
        setShowAppIconPicker(false);
    }, []);
    const handleSettingsChange = (0, react_2.useCallback)((data) => {
        if (data.top_k !== undefined)
            setTopK(data.top_k);
        if (data.score_threshold !== undefined)
            setScoreThreshold(data.score_threshold);
        if (data.score_threshold_enabled !== undefined)
            setScoreThresholdEnabled(data.score_threshold_enabled);
    }, []);
    (0, react_2.useEffect)(() => {
        if (!membersData?.accounts)
            setMemberList([]);
        else
            setMemberList(membersData.accounts);
    }, [membersData]);
    const invalidDatasetList = (0, use_dataset_1.useInvalidDatasetList)();
    const handleSave = async () => {
        if (loading)
            return;
        if (!name?.trim()) {
            toast_1.default.notify({ type: 'error', message: t('form.nameError', { ns: 'datasetSettings' }) });
            return;
        }
        if (!(0, check_rerank_model_1.isReRankModelSelected)({
            rerankModelList,
            retrievalConfig,
            indexMethod,
        })) {
            toast_1.default.notify({ type: 'error', message: t('datasetConfig.rerankModelRequired', { ns: 'appDebug' }) });
            return;
        }
        if (retrievalConfig.weights) {
            retrievalConfig.weights.vector_setting.embedding_provider_name = embeddingModel.provider || '';
            retrievalConfig.weights.vector_setting.embedding_model_name = embeddingModel.model || '';
        }
        try {
            setLoading(true);
            const requestParams = {
                datasetId: currentDataset.id,
                body: {
                    name,
                    icon_info: iconInfo,
                    doc_form: currentDataset?.doc_form,
                    description,
                    permission,
                    indexing_technique: indexMethod,
                    retrieval_model: {
                        ...retrievalConfig,
                        score_threshold: retrievalConfig.score_threshold_enabled ? retrievalConfig.score_threshold : 0,
                    },
                    embedding_model: embeddingModel.model,
                    embedding_model_provider: embeddingModel.provider,
                    ...(currentDataset.provider === 'external' && {
                        external_knowledge_id: currentDataset.external_knowledge_info.external_knowledge_id,
                        external_knowledge_api_id: currentDataset.external_knowledge_info.external_knowledge_api_id,
                        external_retrieval_model: {
                            top_k: topK,
                            score_threshold: scoreThreshold,
                            score_threshold_enabled: scoreThresholdEnabled,
                        },
                    }),
                    keyword_number: keywordNumber,
                },
            };
            if (permission === datasets_1.DatasetPermission.partialMembers) {
                requestParams.body.partial_member_list = selectedMemberIDs.map((id) => {
                    return {
                        user_id: id,
                        role: memberList.find(member => member.id === id)?.role,
                    };
                });
            }
            await (0, datasets_2.updateDatasetSetting)(requestParams);
            toast_1.default.notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            if (mutateDatasets) {
                await mutateDatasets();
                invalidDatasetList();
            }
        }
        catch {
            toast_1.default.notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
        }
        finally {
            setLoading(false);
        }
    };
    const isShowIndexMethod = currentDataset && currentDataset.doc_form !== datasets_1.ChunkingMode.parentChild && currentDataset.indexing_technique && indexMethod;
    const showMultiModalTip = (0, react_2.useMemo)(() => {
        return (0, utils_1.checkShowMultiModalTip)({
            embeddingModel,
            rerankingEnable: retrievalConfig.reranking_enable,
            rerankModel: {
                rerankingProviderName: retrievalConfig.reranking_model.reranking_provider_name,
                rerankingModelName: retrievalConfig.reranking_model.reranking_model_name,
            },
            indexMethod,
            embeddingModelList,
            rerankModelList,
        });
    }, [embeddingModel, rerankModelList, retrievalConfig.reranking_enable, retrievalConfig.reranking_model, embeddingModelList, indexMethod]);
    return (<div className="flex w-full flex-col gap-y-4 px-20 py-8 sm:w-[960px]">
      {/* Dataset name and icon */}
      <div className={rowClass}>
        <div className={labelClass}>
          <div className="system-sm-semibold text-text-secondary">{t('form.nameAndIcon', { ns: 'datasetSettings' })}</div>
        </div>
        <div className="flex grow items-center gap-x-2">
          <app_icon_1.default size="small" onClick={handleOpenAppIconPicker} className="cursor-pointer" iconType={iconInfo.icon_type} icon={iconInfo.icon} background={iconInfo.icon_background} imageUrl={iconInfo.icon_url} showEditIcon/>
          <input_1.default disabled={!currentDataset?.embedding_available} value={name} onChange={e => setName(e.target.value)}/>
        </div>
      </div>
      {/* Dataset description */}
      <div className={rowClass}>
        <div className={labelClass}>
          <div className="system-sm-semibold text-text-secondary">{t('form.desc', { ns: 'datasetSettings' })}</div>
        </div>
        <div className="grow">
          <textarea_1.default disabled={!currentDataset?.embedding_available} className="resize-none" placeholder={t('form.descPlaceholder', { ns: 'datasetSettings' }) || ''} value={description} onChange={e => setDescription(e.target.value)}/>
        </div>
      </div>
      {/* Permissions */}
      <div className={rowClass}>
        <div className={labelClass}>
          <div className="system-sm-semibold text-text-secondary">{t('form.permissions', { ns: 'datasetSettings' })}</div>
        </div>
        <div className="grow">
          <permission_selector_1.default disabled={!currentDataset?.embedding_available || isCurrentWorkspaceDatasetOperator} permission={permission} value={selectedMemberIDs} onChange={v => setPermission(v)} onMemberSelect={setSelectedMemberIDs} memberList={memberList}/>
        </div>
      </div>
      {currentDataset?.doc_form && (<>
            <divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>
            {/* Chunk Structure */}
            <div className={rowClass}>
              <div className="flex w-[180px] shrink-0 flex-col">
                <div className="system-sm-semibold flex h-8 items-center text-text-secondary">
                  {t('form.chunkStructure.title', { ns: 'datasetSettings' })}
                </div>
                <div className="body-xs-regular text-text-tertiary">
                  <a target="_blank" rel="noopener noreferrer" href={docLink('/guides/knowledge-base/create-knowledge-and-upload-documents/chunking-and-cleaning-text')} className="text-text-accent">
                    {t('form.chunkStructure.learnMore', { ns: 'datasetSettings' })}
                  </a>
                  {t('form.chunkStructure.description', { ns: 'datasetSettings' })}
                </div>
              </div>
              <div className="grow">
                <chunk_structure_1.default chunkStructure={currentDataset?.doc_form}/>
              </div>
            </div>
          </>)}
      {(isShowIndexMethod || indexMethod === 'high_quality') && (<divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>)}
      {isShowIndexMethod && (<div className={rowClass}>
          <div className={labelClass}>
            <div className="system-sm-semibold text-text-secondary">{t('form.indexMethod', { ns: 'datasetSettings' })}</div>
          </div>
          <div className="grow">
            <index_method_1.default value={indexMethod} disabled={!currentDataset?.embedding_available} onChange={v => setIndexMethod(v)} currentValue={currentDataset.indexing_technique} keywordNumber={keywordNumber} onKeywordNumberChange={setKeywordNumber}/>
            {currentDataset.indexing_technique === step_two_1.IndexingType.ECONOMICAL && indexMethod === step_two_1.IndexingType.QUALIFIED && (<div className="relative mt-2 flex h-10 items-center gap-x-0.5 overflow-hidden rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur px-2 shadow-xs shadow-shadow-shadow-3">
                <div className="absolute left-0 top-0 flex h-full w-full items-center bg-toast-warning-bg opacity-40"/>
                <div className="p-1">
                  <react_1.RiAlertFill className="size-4 text-text-warning-secondary"/>
                </div>
                <span className="system-xs-medium text-text-primary">
                  {t('form.upgradeHighQualityTip', { ns: 'datasetSettings' })}
                </span>
              </div>)}
          </div>
        </div>)}
      {indexMethod === step_two_1.IndexingType.QUALIFIED && (<div className={rowClass}>
          <div className={labelClass}>
            <div className="system-sm-semibold text-text-secondary">
              {t('form.embeddingModel', { ns: 'datasetSettings' })}
            </div>
          </div>
          <div className="grow">
            <model_selector_1.default defaultModel={embeddingModel} modelList={embeddingModelList} onSelect={setEmbeddingModel}/>
          </div>
        </div>)}
      {/* Retrieval Method Config */}
      {currentDataset?.provider === 'external'
            ? (<>
              <divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>
              <div className={rowClass}>
                <div className={labelClass}>
                  <div className="system-sm-semibold text-text-secondary">{t('form.retrievalSetting.title', { ns: 'datasetSettings' })}</div>
                </div>
                <RetrievalSettings_1.default topK={topK} scoreThreshold={scoreThreshold} scoreThresholdEnabled={scoreThresholdEnabled} onChange={handleSettingsChange} isInRetrievalSetting={true}/>
              </div>
              <divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>
              <div className={rowClass}>
                <div className={labelClass}>
                  <div className="system-sm-semibold text-text-secondary">{t('form.externalKnowledgeAPI', { ns: 'datasetSettings' })}</div>
                </div>
                <div className="w-full">
                  <div className="flex h-full items-center gap-1 rounded-lg bg-components-input-bg-normal px-3 py-2">
                    <development_1.ApiConnectionMod className="h-4 w-4 text-text-secondary"/>
                    <div className="system-sm-medium overflow-hidden text-ellipsis text-text-secondary">
                      {currentDataset?.external_knowledge_info.external_knowledge_api_name}
                    </div>
                    <div className="system-xs-regular text-text-tertiary">·</div>
                    <div className="system-xs-regular text-text-tertiary">
                      {currentDataset?.external_knowledge_info.external_knowledge_api_endpoint}
                    </div>
                  </div>
                </div>
              </div>
              <div className={rowClass}>
                <div className={labelClass}>
                  <div className="system-sm-semibold text-text-secondary">{t('form.externalKnowledgeID', { ns: 'datasetSettings' })}</div>
                </div>
                <div className="w-full">
                  <div className="flex h-full items-center gap-1 rounded-lg bg-components-input-bg-normal px-3 py-2">
                    <div className="system-xs-regular text-text-tertiary">
                      {currentDataset?.external_knowledge_info.external_knowledge_id}
                    </div>
                  </div>
                </div>
              </div>
            </>)
            // eslint-disable-next-line sonarjs/no-nested-conditional
            : indexMethod
                ? (<>
                <divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>
                <div className={rowClass}>
                  <div className={labelClass}>
                    <div className="flex w-[180px] shrink-0 flex-col">
                      <div className="system-sm-semibold flex h-7 items-center pt-1 text-text-secondary">
                        {t('form.retrievalSetting.title', { ns: 'datasetSettings' })}
                      </div>
                      <div className="body-xs-regular text-text-tertiary">
                        <a target="_blank" rel="noopener noreferrer" href={docLink('/guides/knowledge-base/create-knowledge-and-upload-documents/setting-indexing-methods#setting-the-retrieval-setting', {
                        'zh-Hans': '/guides/knowledge-base/create-knowledge-and-upload-documents/setting-indexing-methods#指定检索方式',
                        'ja-JP': '/guides/knowledge-base/create-knowledge-and-upload-documents/setting-indexing-methods#検索方法の指定',
                    })} className="text-text-accent">
                          {t('form.retrievalSetting.learnMore', { ns: 'datasetSettings' })}
                        </a>
                        {t('form.retrievalSetting.description', { ns: 'datasetSettings' })}
                      </div>
                    </div>
                  </div>
                  <div className="grow">
                    {indexMethod === step_two_1.IndexingType.QUALIFIED
                        ? (<retrieval_method_config_1.default value={retrievalConfig} onChange={setRetrievalConfig} showMultiModalTip={showMultiModalTip}/>)
                        : (<economical_retrieval_method_config_1.default value={retrievalConfig} onChange={setRetrievalConfig}/>)}
                  </div>
                </div>
              </>)
                : null}
      <divider_1.default type="horizontal" className="my-1 h-px bg-divider-subtle"/>
      <div className={rowClass}>
        <div className={labelClass}/>
        <div className="grow">
          <button_1.default className="min-w-24" variant="primary" loading={loading} disabled={loading} onClick={handleSave}>
            {t('form.save', { ns: 'datasetSettings' })}
          </button_1.default>
        </div>
      </div>
      {showAppIconPicker && (<app_icon_picker_1.default onSelect={handleSelectAppIcon} onClose={handleCloseAppIconPicker}/>)}
    </div>);
};
exports.default = Form;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFNWiw0Q0FBOEM7QUFDOUMsaUNBQXlFO0FBQ3pFLGlEQUE4QztBQUM5Qyw2REFBb0Q7QUFDcEQsMkVBQWlFO0FBQ2pFLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFDbkQsMEZBQTJGO0FBQzNGLHVEQUErQztBQUMvQyw2REFBcUQ7QUFDckQsdURBQStDO0FBQy9DLDRGQUEyRjtBQUMzRiw0SEFBaUg7QUFDakgsc0dBQTRGO0FBQzVGLDJHQUF3RztBQUN4Ryw2RkFBZ0c7QUFDaEcsK0dBQXNHO0FBQ3RHLHVEQUFnRjtBQUNoRiw2REFBOEU7QUFDOUUseUNBQTJDO0FBQzNDLGdEQUFtRTtBQUNuRSxpREFBeUQ7QUFDekQsaUVBQXVFO0FBQ3ZFLHFEQUFpRDtBQUNqRCxvREFBb0Q7QUFDcEQsOEZBQXNGO0FBQ3RGLHdEQUErQztBQUMvQyxrREFBeUM7QUFDekMsZ0VBQXVEO0FBQ3ZELG9DQUFpRDtBQUVqRCxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUE7QUFDL0IsTUFBTSxVQUFVLEdBQUcsK0NBQStDLENBQUE7QUFFbEUsTUFBTSxnQkFBZ0IsR0FBYTtJQUNqQyxTQUFTLEVBQUUsT0FBTztJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLGVBQWUsRUFBRSxTQUFTO0lBQzFCLFFBQVEsRUFBRSxFQUFFO0NBQ2IsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtJQUNoQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBVSxHQUFFLENBQUE7SUFDNUIsTUFBTSxpQ0FBaUMsR0FBRyxJQUFBLHlCQUF5QixFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7SUFDckgsTUFB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TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsaUJBQWlCLElBQUksQ0FDcEIsQ0FBQyx5QkFBYSxDQUNaLFFBQVEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQzlCLE9BQU8sQ0FBQyxDQUFDLHdCQUF3QixDQUFDLEVBQ2xDLENBQ0gsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBBcHBJY29uU2VsZWN0aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FwcC1pY29uLXBpY2tlcidcbmltcG9ydCB0eXBlIHsgRGVmYXVsdE1vZGVsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBNZW1iZXIgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IEljb25JbmZvIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IEFwcEljb25UeXBlLCBSZXRyaWV2YWxDb25maWcgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IFJpQWxlcnRGaWxsIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBcHBJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbidcbmltcG9ydCBBcHBJY29uUGlja2VyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbi1waWNrZXInXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7IEFwaUNvbm5lY3Rpb25Nb2QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9kZXZlbG9wbWVudCdcbmltcG9ydCBJbnB1dCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaW5wdXQnXG5pbXBvcnQgVGV4dGFyZWEgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RleHRhcmVhJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IGlzUmVSYW5rTW9kZWxTZWxlY3RlZCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2NoZWNrLXJlcmFuay1tb2RlbCdcbmltcG9ydCBFY29ub21pY2FsUmV0cmlldmFsTWV0aG9kQ29uZmlnIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2Vjb25vbWljYWwtcmV0cmlldmFsLW1ldGhvZC1jb25maWcnXG5pbXBvcnQgUmV0cmlldmFsTWV0aG9kQ29uZmlnIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL3JldHJpZXZhbC1tZXRob2QtY29uZmlnJ1xuaW1wb3J0IHsgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZU1vZGVsTGlzdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IE1vZGVsU2VsZWN0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtc2VsZWN0b3InXG5pbXBvcnQgeyB1c2VTZWxlY3RvciBhcyB1c2VBcHBDb250ZXh0V2l0aFNlbGVjdG9yIH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3IgfSBmcm9tICdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnXG5pbXBvcnQgeyB1c2VEb2NMaW5rIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5pbXBvcnQgeyBDaHVua2luZ01vZGUsIERhdGFzZXRQZXJtaXNzaW9uIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyB1cGRhdGVEYXRhc2V0U2V0dGluZyB9IGZyb20gJ0Avc2VydmljZS9kYXRhc2V0cydcbmltcG9ydCB7IHVzZUludmFsaWREYXRhc2V0TGlzdCB9IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRhdGFzZXQnXG5pbXBvcnQgeyB1c2VNZW1iZXJzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBJbmRleGluZ1R5cGUgfSBmcm9tICcuLi8uLi9jcmVhdGUvc3RlcC10d28nXG5pbXBvcnQgUmV0cmlldmFsU2V0dGluZ3MgZnJvbSAnLi4vLi4vZXh0ZXJuYWwta25vd2xlZGdlLWJhc2UvY3JlYXRlL1JldHJpZXZhbFNldHRpbmdzJ1xuaW1wb3J0IENodW5rU3RydWN0dXJlIGZyb20gJy4uL2NodW5rLXN0cnVjdHVyZSdcbmltcG9ydCBJbmRleE1ldGhvZCBmcm9tICcuLi9pbmRleC1tZXRob2QnXG5pbXBvcnQgUGVybWlzc2lvblNlbGVjdG9yIGZyb20gJy4uL3Blcm1pc3Npb24tc2VsZWN0b3InXG5pbXBvcnQgeyBjaGVja1Nob3dNdWx0aU1vZGFsVGlwIH0gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IHJvd0NsYXNzID0gJ2ZsZXggZ2FwLXgtMSdcbmNvbnN0IGxhYmVsQ2xhc3MgPSAnZmxleCBpdGVtcy1jZW50ZXIgc2hyaW5rLTAgdy1bMTgwcHhdIGgtNyBwdC0xJ1xuXG5jb25zdCBERUZBVUxUX0FQUF9JQ09OOiBJY29uSW5mbyA9IHtcbiAgaWNvbl90eXBlOiAnZW1vamknLFxuICBpY29uOiAn8J+TmScsXG4gIGljb25fYmFja2dyb3VuZDogJyNGRkY0RUQnLFxuICBpY29uX3VybDogJycsXG59XG5cbmNvbnN0IEZvcm0gPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBkb2NMaW5rID0gdXNlRG9jTGluaygpXG4gIGNvbnN0IGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvciA9IHVzZUFwcENvbnRleHRXaXRoU2VsZWN0b3Ioc3RhdGUgPT4gc3RhdGUuaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yKVxuICBjb25zdCBjdXJyZW50RGF0YXNldCA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yKHN0YXRlID0+IHN0YXRlLmRhdGFzZXQpXG4gIGNvbnN0IG11dGF0ZURhdGFzZXRzID0gdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3Ioc3RhdGUgPT4gc3RhdGUubXV0YXRlRGF0YXNldFJlcylcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IHVzZVN0YXRlKGN1cnJlbnREYXRhc2V0Py5uYW1lID8/ICcnKVxuICBjb25zdCBbaWNvbkluZm8sIHNldEljb25JbmZvXSA9IHVzZVN0YXRlKGN1cnJlbnREYXRhc2V0Py5pY29uX2luZm8gfHwgREVGQVVMVF9BUFBfSUNPTilcbiAgY29uc3QgW3Nob3dBcHBJY29uUGlja2VyLCBzZXRTaG93QXBwSWNvblBpY2tlcl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2Rlc2NyaXB0aW9uLCBzZXREZXNjcmlwdGlvbl0gPSB1c2VTdGF0ZShjdXJyZW50RGF0YXNldD8uZGVzY3JpcHRpb24gPz8gJycpXG4gIGNvbnN0IFtwZXJtaXNzaW9uLCBzZXRQZXJtaXNzaW9uXSA9IHVzZVN0YXRlKGN1cnJlbnREYXRhc2V0Py5wZXJtaXNzaW9uKVxuICBjb25zdCBbdG9wSywgc2V0VG9wS10gPSB1c2VTdGF0ZShjdXJyZW50RGF0YXNldD8uZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLnRvcF9rID8/IDIpXG4gIGNvbnN0IFtzY29yZVRocmVzaG9sZCwgc2V0U2NvcmVUaHJlc2hvbGRdID0gdXNlU3RhdGUoY3VycmVudERhdGFzZXQ/LmV4dGVybmFsX3JldHJpZXZhbF9tb2RlbC5zY29yZV90aHJlc2hvbGQgPz8gMC41KVxuICBjb25zdCBbc2NvcmVUaHJlc2hvbGRFbmFibGVkLCBzZXRTY29yZVRocmVzaG9sZEVuYWJsZWRdID0gdXNlU3RhdGUoY3VycmVudERhdGFzZXQ/LmV4dGVybmFsX3JldHJpZXZhbF9tb2RlbC5zY29yZV90aHJlc2hvbGRfZW5hYmxlZCA/PyBmYWxzZSlcbiAgY29uc3QgW3NlbGVjdGVkTWVtYmVySURzLCBzZXRTZWxlY3RlZE1lbWJlcklEc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oY3VycmVudERhdGFzZXQ/LnBhcnRpYWxfbWVtYmVyX2xpc3QgfHwgW10pXG4gIGNvbnN0IFttZW1iZXJMaXN0LCBzZXRNZW1iZXJMaXN0XSA9IHVzZVN0YXRlPE1lbWJlcltdPihbXSlcbiAgY29uc3QgW2luZGV4TWV0aG9kLCBzZXRJbmRleE1ldGhvZF0gPSB1c2VTdGF0ZShjdXJyZW50RGF0YXNldD8uaW5kZXhpbmdfdGVjaG5pcXVlKVxuICBjb25zdCBba2V5d29yZE51bWJlciwgc2V0S2V5d29yZE51bWJlcl0gPSB1c2VTdGF0ZShjdXJyZW50RGF0YXNldD8ua2V5d29yZF9udW1iZXIgPz8gMTApXG4gIGNvbnN0IFtyZXRyaWV2YWxDb25maWcsIHNldFJldHJpZXZhbENvbmZpZ10gPSB1c2VTdGF0ZShjdXJyZW50RGF0YXNldD8ucmV0cmlldmFsX21vZGVsX2RpY3QgYXMgUmV0cmlldmFsQ29uZmlnKVxuICBjb25zdCBbZW1iZWRkaW5nTW9kZWwsIHNldEVtYmVkZGluZ01vZGVsXSA9IHVzZVN0YXRlPERlZmF1bHRNb2RlbD4oXG4gICAgY3VycmVudERhdGFzZXQ/LmVtYmVkZGluZ19tb2RlbFxuICAgICAgPyB7XG4gICAgICAgICAgcHJvdmlkZXI6IGN1cnJlbnREYXRhc2V0LmVtYmVkZGluZ19tb2RlbF9wcm92aWRlcixcbiAgICAgICAgICBtb2RlbDogY3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsLFxuICAgICAgICB9XG4gICAgICA6IHtcbiAgICAgICAgICBwcm92aWRlcjogJycsXG4gICAgICAgICAgbW9kZWw6ICcnLFxuICAgICAgICB9LFxuICApXG4gIGNvbnN0IHsgZGF0YTogcmVyYW5rTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS5yZXJhbmspXG4gIGNvbnN0IHsgZGF0YTogZW1iZWRkaW5nTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS50ZXh0RW1iZWRkaW5nKVxuICBjb25zdCB7IGRhdGE6IG1lbWJlcnNEYXRhIH0gPSB1c2VNZW1iZXJzKClcbiAgY29uc3QgcHJldmlvdXNBcHBJY29uID0gdXNlUmVmKERFRkFVTFRfQVBQX0lDT04pXG5cbiAgY29uc3QgaGFuZGxlT3BlbkFwcEljb25QaWNrZXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0U2hvd0FwcEljb25QaWNrZXIodHJ1ZSlcbiAgICBwcmV2aW91c0FwcEljb24uY3VycmVudCA9IGljb25JbmZvXG4gIH0sIFtpY29uSW5mb10pXG5cbiAgY29uc3QgaGFuZGxlU2VsZWN0QXBwSWNvbiA9IHVzZUNhbGxiYWNrKChpY29uOiBBcHBJY29uU2VsZWN0aW9uKSA9PiB7XG4gICAgY29uc3QgaWNvbkluZm86IEljb25JbmZvID0ge1xuICAgICAgaWNvbl90eXBlOiBpY29uLnR5cGUsXG4gICAgICBpY29uOiBpY29uLnR5cGUgPT09ICdlbW9qaScgPyBpY29uLmljb24gOiBpY29uLmZpbGVJZCxcbiAgICAgIGljb25fYmFja2dyb3VuZDogaWNvbi50eXBlID09PSAnZW1vamknID8gaWNvbi5iYWNrZ3JvdW5kIDogdW5kZWZpbmVkLFxuICAgICAgaWNvbl91cmw6IGljb24udHlwZSA9PT0gJ2Vtb2ppJyA/IHVuZGVmaW5lZCA6IGljb24udXJsLFxuICAgIH1cbiAgICBzZXRJY29uSW5mbyhpY29uSW5mbylcbiAgICBzZXRTaG93QXBwSWNvblBpY2tlcihmYWxzZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQ2xvc2VBcHBJY29uUGlja2VyID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEljb25JbmZvKHByZXZpb3VzQXBwSWNvbi5jdXJyZW50KVxuICAgIHNldFNob3dBcHBJY29uUGlja2VyKGZhbHNlKVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVTZXR0aW5nc0NoYW5nZSA9IHVzZUNhbGxiYWNrKChkYXRhOiB7IHRvcF9rPzogbnVtYmVyLCBzY29yZV90aHJlc2hvbGQ/OiBudW1iZXIsIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkPzogYm9vbGVhbiB9KSA9PiB7XG4gICAgaWYgKGRhdGEudG9wX2sgIT09IHVuZGVmaW5lZClcbiAgICAgIHNldFRvcEsoZGF0YS50b3BfaylcbiAgICBpZiAoZGF0YS5zY29yZV90aHJlc2hvbGQgIT09IHVuZGVmaW5lZClcbiAgICAgIHNldFNjb3JlVGhyZXNob2xkKGRhdGEuc2NvcmVfdGhyZXNob2xkKVxuICAgIGlmIChkYXRhLnNjb3JlX3RocmVzaG9sZF9lbmFibGVkICE9PSB1bmRlZmluZWQpXG4gICAgICBzZXRTY29yZVRocmVzaG9sZEVuYWJsZWQoZGF0YS5zY29yZV90aHJlc2hvbGRfZW5hYmxlZClcbiAgfSwgW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1lbWJlcnNEYXRhPy5hY2NvdW50cylcbiAgICAgIHNldE1lbWJlckxpc3QoW10pXG4gICAgZWxzZVxuICAgICAgc2V0TWVtYmVyTGlzdChtZW1iZXJzRGF0YS5hY2NvdW50cylcbiAgfSwgW21lbWJlcnNEYXRhXSlcblxuICBjb25zdCBpbnZhbGlkRGF0YXNldExpc3QgPSB1c2VJbnZhbGlkRGF0YXNldExpc3QoKVxuICBjb25zdCBoYW5kbGVTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChsb2FkaW5nKVxuICAgICAgcmV0dXJuXG4gICAgaWYgKCFuYW1lPy50cmltKCkpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2Zvcm0ubmFtZUVycm9yJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSkgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoXG4gICAgICAhaXNSZVJhbmtNb2RlbFNlbGVjdGVkKHtcbiAgICAgICAgcmVyYW5rTW9kZWxMaXN0LFxuICAgICAgICByZXRyaWV2YWxDb25maWcsXG4gICAgICAgIGluZGV4TWV0aG9kLFxuICAgICAgfSlcbiAgICApIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2RhdGFzZXRDb25maWcucmVyYW5rTW9kZWxSZXF1aXJlZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSkgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocmV0cmlldmFsQ29uZmlnLndlaWdodHMpIHtcbiAgICAgIHJldHJpZXZhbENvbmZpZy53ZWlnaHRzLnZlY3Rvcl9zZXR0aW5nLmVtYmVkZGluZ19wcm92aWRlcl9uYW1lID0gZW1iZWRkaW5nTW9kZWwucHJvdmlkZXIgfHwgJydcbiAgICAgIHJldHJpZXZhbENvbmZpZy53ZWlnaHRzLnZlY3Rvcl9zZXR0aW5nLmVtYmVkZGluZ19tb2RlbF9uYW1lID0gZW1iZWRkaW5nTW9kZWwubW9kZWwgfHwgJydcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICAgIGNvbnN0IHJlcXVlc3RQYXJhbXMgPSB7XG4gICAgICAgIGRhdGFzZXRJZDogY3VycmVudERhdGFzZXQhLmlkLFxuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBpY29uX2luZm86IGljb25JbmZvLFxuICAgICAgICAgIGRvY19mb3JtOiBjdXJyZW50RGF0YXNldD8uZG9jX2Zvcm0sXG4gICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgcGVybWlzc2lvbixcbiAgICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6IGluZGV4TWV0aG9kLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAgICAgLi4ucmV0cmlldmFsQ29uZmlnLFxuICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiByZXRyaWV2YWxDb25maWcuc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQgPyByZXRyaWV2YWxDb25maWcuc2NvcmVfdGhyZXNob2xkIDogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbDogZW1iZWRkaW5nTW9kZWwubW9kZWwsXG4gICAgICAgICAgZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyOiBlbWJlZGRpbmdNb2RlbC5wcm92aWRlcixcbiAgICAgICAgICAuLi4oY3VycmVudERhdGFzZXQhLnByb3ZpZGVyID09PSAnZXh0ZXJuYWwnICYmIHtcbiAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9pZDogY3VycmVudERhdGFzZXQhLmV4dGVybmFsX2tub3dsZWRnZV9pbmZvLmV4dGVybmFsX2tub3dsZWRnZV9pZCxcbiAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ6IGN1cnJlbnREYXRhc2V0IS5leHRlcm5hbF9rbm93bGVkZ2VfaW5mby5leHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkLFxuICAgICAgICAgICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgICAgICAgIHRvcF9rOiB0b3BLLFxuICAgICAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IHNjb3JlVGhyZXNob2xkLFxuICAgICAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogc2NvcmVUaHJlc2hvbGRFbmFibGVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBrZXl3b3JkX251bWJlcjoga2V5d29yZE51bWJlcixcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgYW55XG4gICAgICBpZiAocGVybWlzc2lvbiA9PT0gRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMpIHtcbiAgICAgICAgcmVxdWVzdFBhcmFtcy5ib2R5LnBhcnRpYWxfbWVtYmVyX2xpc3QgPSBzZWxlY3RlZE1lbWJlcklEcy5tYXAoKGlkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXJfaWQ6IGlkLFxuICAgICAgICAgICAgcm9sZTogbWVtYmVyTGlzdC5maW5kKG1lbWJlciA9PiBtZW1iZXIuaWQgPT09IGlkKT8ucm9sZSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBhd2FpdCB1cGRhdGVEYXRhc2V0U2V0dGluZyhyZXF1ZXN0UGFyYW1zKVxuICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgaWYgKG11dGF0ZURhdGFzZXRzKSB7XG4gICAgICAgIGF3YWl0IG11dGF0ZURhdGFzZXRzKClcbiAgICAgICAgaW52YWxpZERhdGFzZXRMaXN0KClcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnYWN0aW9uTXNnLm1vZGlmaWVkVW5zdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaXNTaG93SW5kZXhNZXRob2QgPSBjdXJyZW50RGF0YXNldCAmJiBjdXJyZW50RGF0YXNldC5kb2NfZm9ybSAhPT0gQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkICYmIGN1cnJlbnREYXRhc2V0LmluZGV4aW5nX3RlY2huaXF1ZSAmJiBpbmRleE1ldGhvZFxuXG4gIGNvbnN0IHNob3dNdWx0aU1vZGFsVGlwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGNoZWNrU2hvd011bHRpTW9kYWxUaXAoe1xuICAgICAgZW1iZWRkaW5nTW9kZWwsXG4gICAgICByZXJhbmtpbmdFbmFibGU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLFxuICAgICAgcmVyYW5rTW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nUHJvdmlkZXJOYW1lOiByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICByZXJhbmtpbmdNb2RlbE5hbWU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX21vZGVsX25hbWUsXG4gICAgICB9LFxuICAgICAgaW5kZXhNZXRob2QsXG4gICAgICBlbWJlZGRpbmdNb2RlbExpc3QsXG4gICAgICByZXJhbmtNb2RlbExpc3QsXG4gICAgfSlcbiAgfSwgW2VtYmVkZGluZ01vZGVsLCByZXJhbmtNb2RlbExpc3QsIHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLCByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLCBlbWJlZGRpbmdNb2RlbExpc3QsIGluZGV4TWV0aG9kXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgZmxleC1jb2wgZ2FwLXktNCBweC0yMCBweS04IHNtOnctWzk2MHB4XVwiPlxuICAgICAgey8qIERhdGFzZXQgbmFtZSBhbmQgaWNvbiAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtsYWJlbENsYXNzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0ubmFtZUFuZEljb24nLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGl0ZW1zLWNlbnRlciBnYXAteC0yXCI+XG4gICAgICAgICAgPEFwcEljb25cbiAgICAgICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVPcGVuQXBwSWNvblBpY2tlcn1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgIGljb25UeXBlPXtpY29uSW5mby5pY29uX3R5cGUgYXMgQXBwSWNvblR5cGV9XG4gICAgICAgICAgICBpY29uPXtpY29uSW5mby5pY29ufVxuICAgICAgICAgICAgYmFja2dyb3VuZD17aWNvbkluZm8uaWNvbl9iYWNrZ3JvdW5kfVxuICAgICAgICAgICAgaW1hZ2VVcmw9e2ljb25JbmZvLmljb25fdXJsfVxuICAgICAgICAgICAgc2hvd0VkaXRJY29uXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudERhdGFzZXQ/LmVtYmVkZGluZ19hdmFpbGFibGV9XG4gICAgICAgICAgICB2YWx1ZT17bmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldE5hbWUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogRGF0YXNldCBkZXNjcmlwdGlvbiAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtsYWJlbENsYXNzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0uZGVzYycsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgPFRleHRhcmVhXG4gICAgICAgICAgICBkaXNhYmxlZD17IWN1cnJlbnREYXRhc2V0Py5lbWJlZGRpbmdfYXZhaWxhYmxlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVzaXplLW5vbmVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoJ2Zvcm0uZGVzY1BsYWNlaG9sZGVyJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSkgfHwgJyd9XG4gICAgICAgICAgICB2YWx1ZT17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXREZXNjcmlwdGlvbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBQZXJtaXNzaW9ucyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtsYWJlbENsYXNzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0ucGVybWlzc2lvbnMnLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgIDxQZXJtaXNzaW9uU2VsZWN0b3JcbiAgICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudERhdGFzZXQ/LmVtYmVkZGluZ19hdmFpbGFibGUgfHwgaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yfVxuICAgICAgICAgICAgcGVybWlzc2lvbj17cGVybWlzc2lvbn1cbiAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZE1lbWJlcklEc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldFBlcm1pc3Npb24odil9XG4gICAgICAgICAgICBvbk1lbWJlclNlbGVjdD17c2V0U2VsZWN0ZWRNZW1iZXJJRHN9XG4gICAgICAgICAgICBtZW1iZXJMaXN0PXttZW1iZXJMaXN0fVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7XG4gICAgICAgIGN1cnJlbnREYXRhc2V0Py5kb2NfZm9ybSAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgICAgIHR5cGU9XCJob3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXktMSBoLXB4IGJnLWRpdmlkZXItc3VidGxlXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7LyogQ2h1bmsgU3RydWN0dXJlICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvd0NsYXNzfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctWzE4MHB4XSBzaHJpbmstMCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXNlbWlib2xkIGZsZXggaC04IGl0ZW1zLWNlbnRlciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7dCgnZm9ybS5jaHVua1N0cnVjdHVyZS50aXRsZScsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9keS14cy1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICAgIGhyZWY9e2RvY0xpbmsoJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvY3JlYXRlLWtub3dsZWRnZS1hbmQtdXBsb2FkLWRvY3VtZW50cy9jaHVua2luZy1hbmQtY2xlYW5pbmctdGV4dCcpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXRleHQtYWNjZW50XCJcbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3QoJ2Zvcm0uY2h1bmtTdHJ1Y3R1cmUubGVhcm5Nb3JlJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9XG4gICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICB7dCgnZm9ybS5jaHVua1N0cnVjdHVyZS5kZXNjcmlwdGlvbicsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgICAgICAgPENodW5rU3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICBjaHVua1N0cnVjdHVyZT17Y3VycmVudERhdGFzZXQ/LmRvY19mb3JtfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHsoaXNTaG93SW5kZXhNZXRob2QgfHwgaW5kZXhNZXRob2QgPT09ICdoaWdoX3F1YWxpdHknKSAmJiAoXG4gICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgdHlwZT1cImhvcml6b250YWxcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm15LTEgaC1weCBiZy1kaXZpZGVyLXN1YnRsZVwiXG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge2lzU2hvd0luZGV4TWV0aG9kICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvd0NsYXNzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0uaW5kZXhNZXRob2QnLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3dcIj5cbiAgICAgICAgICAgIDxJbmRleE1ldGhvZFxuICAgICAgICAgICAgICB2YWx1ZT17aW5kZXhNZXRob2R9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshY3VycmVudERhdGFzZXQ/LmVtYmVkZGluZ19hdmFpbGFibGV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEluZGV4TWV0aG9kKHYhKX1cbiAgICAgICAgICAgICAgY3VycmVudFZhbHVlPXtjdXJyZW50RGF0YXNldC5pbmRleGluZ190ZWNobmlxdWV9XG4gICAgICAgICAgICAgIGtleXdvcmROdW1iZXI9e2tleXdvcmROdW1iZXJ9XG4gICAgICAgICAgICAgIG9uS2V5d29yZE51bWJlckNoYW5nZT17c2V0S2V5d29yZE51bWJlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7Y3VycmVudERhdGFzZXQuaW5kZXhpbmdfdGVjaG5pcXVlID09PSBJbmRleGluZ1R5cGUuRUNPTk9NSUNBTCAmJiBpbmRleE1ldGhvZCA9PT0gSW5kZXhpbmdUeXBlLlFVQUxJRklFRCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXQtMiBmbGV4IGgtMTAgaXRlbXMtY2VudGVyIGdhcC14LTAuNSBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHB4LTIgc2hhZG93LXhzIHNoYWRvdy1zaGFkb3ctc2hhZG93LTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMCB0b3AtMCBmbGV4IGgtZnVsbCB3LWZ1bGwgaXRlbXMtY2VudGVyIGJnLXRvYXN0LXdhcm5pbmctYmcgb3BhY2l0eS00MFwiIC8+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTFcIj5cbiAgICAgICAgICAgICAgICAgIDxSaUFsZXJ0RmlsbCBjbGFzc05hbWU9XCJzaXplLTQgdGV4dC10ZXh0LXdhcm5pbmctc2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICAgICAgICB7dCgnZm9ybS51cGdyYWRlSGlnaFF1YWxpdHlUaXAnLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2luZGV4TWV0aG9kID09PSBJbmRleGluZ1R5cGUuUVVBTElGSUVEICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvd0NsYXNzfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgIHt0KCdmb3JtLmVtYmVkZGluZ01vZGVsJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3dcIj5cbiAgICAgICAgICAgIDxNb2RlbFNlbGVjdG9yXG4gICAgICAgICAgICAgIGRlZmF1bHRNb2RlbD17ZW1iZWRkaW5nTW9kZWx9XG4gICAgICAgICAgICAgIG1vZGVsTGlzdD17ZW1iZWRkaW5nTW9kZWxMaXN0fVxuICAgICAgICAgICAgICBvblNlbGVjdD17c2V0RW1iZWRkaW5nTW9kZWx9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7LyogUmV0cmlldmFsIE1ldGhvZCBDb25maWcgKi99XG4gICAgICB7Y3VycmVudERhdGFzZXQ/LnByb3ZpZGVyID09PSAnZXh0ZXJuYWwnXG4gICAgICAgID8gKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPERpdmlkZXJcbiAgICAgICAgICAgICAgICB0eXBlPVwiaG9yaXpvbnRhbFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXktMSBoLXB4IGJnLWRpdmlkZXItc3VidGxlXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvd0NsYXNzfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0ucmV0cmlldmFsU2V0dGluZy50aXRsZScsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxSZXRyaWV2YWxTZXR0aW5nc1xuICAgICAgICAgICAgICAgICAgdG9wSz17dG9wS31cbiAgICAgICAgICAgICAgICAgIHNjb3JlVGhyZXNob2xkPXtzY29yZVRocmVzaG9sZH1cbiAgICAgICAgICAgICAgICAgIHNjb3JlVGhyZXNob2xkRW5hYmxlZD17c2NvcmVUaHJlc2hvbGRFbmFibGVkfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVNldHRpbmdzQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgaXNJblJldHJpZXZhbFNldHRpbmc9e3RydWV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxEaXZpZGVyXG4gICAgICAgICAgICAgICAgdHlwZT1cImhvcml6b250YWxcIlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm15LTEgaC1weCBiZy1kaXZpZGVyLXN1YnRsZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2xhYmVsQ2xhc3N9PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdmb3JtLmV4dGVybmFsS25vd2xlZGdlQVBJJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgaXRlbXMtY2VudGVyIGdhcC0xIHJvdW5kZWQtbGcgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcHgtMyBweS0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxBcGlDb25uZWN0aW9uTW9kIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXNlY29uZGFyeVwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBvdmVyZmxvdy1oaWRkZW4gdGV4dC1lbGxpcHNpcyB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAge2N1cnJlbnREYXRhc2V0Py5leHRlcm5hbF9rbm93bGVkZ2VfaW5mby5leHRlcm5hbF9rbm93bGVkZ2VfYXBpX25hbWV9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPsK3PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAge2N1cnJlbnREYXRhc2V0Py5leHRlcm5hbF9rbm93bGVkZ2VfaW5mby5leHRlcm5hbF9rbm93bGVkZ2VfYXBpX2VuZHBvaW50fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3Jvd0NsYXNzfT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0uZXh0ZXJuYWxLbm93bGVkZ2VJRCcsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1mdWxsIGl0ZW1zLWNlbnRlciBnYXAtMSByb3VuZGVkLWxnIGJnLWNvbXBvbmVudHMtaW5wdXQtYmctbm9ybWFsIHB4LTMgcHktMlwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtjdXJyZW50RGF0YXNldD8uZXh0ZXJuYWxfa25vd2xlZGdlX2luZm8uZXh0ZXJuYWxfa25vd2xlZGdlX2lkfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgIClcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvbmFyanMvbm8tbmVzdGVkLWNvbmRpdGlvbmFsXG4gICAgICAgIDogaW5kZXhNZXRob2RcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8RGl2aWRlclxuICAgICAgICAgICAgICAgICAgdHlwZT1cImhvcml6b250YWxcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXktMSBoLXB4IGJnLWRpdmlkZXItc3VidGxlXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LVsxODBweF0gc2hyaW5rLTAgZmxleC1jb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBmbGV4IGgtNyBpdGVtcy1jZW50ZXIgcHQtMSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7dCgnZm9ybS5yZXRyaWV2YWxTZXR0aW5nLnRpdGxlJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2R5LXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17ZG9jTGluaygnL2d1aWRlcy9rbm93bGVkZ2UtYmFzZS9jcmVhdGUta25vd2xlZGdlLWFuZC11cGxvYWQtZG9jdW1lbnRzL3NldHRpbmctaW5kZXhpbmctbWV0aG9kcyNzZXR0aW5nLXRoZS1yZXRyaWV2YWwtc2V0dGluZycsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnemgtSGFucyc6ICcvZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2NyZWF0ZS1rbm93bGVkZ2UtYW5kLXVwbG9hZC1kb2N1bWVudHMvc2V0dGluZy1pbmRleGluZy1tZXRob2RzI+aMh+WumuajgOe0ouaWueW8jycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2phLUpQJzogJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvY3JlYXRlLWtub3dsZWRnZS1hbmQtdXBsb2FkLWRvY3VtZW50cy9zZXR0aW5nLWluZGV4aW5nLW1ldGhvZHMj5qSc57Si5pa55rOV44Gu5oyH5a6aJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtdGV4dC1hY2NlbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7dCgnZm9ybS5yZXRyaWV2YWxTZXR0aW5nLmxlYXJuTW9yZScsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAge3QoJ2Zvcm0ucmV0cmlldmFsU2V0dGluZy5kZXNjcmlwdGlvbicsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgICAgICAgICAgIHtpbmRleE1ldGhvZCA9PT0gSW5kZXhpbmdUeXBlLlFVQUxJRklFRFxuICAgICAgICAgICAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8UmV0cmlldmFsTWV0aG9kQ29uZmlnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3JldHJpZXZhbENvbmZpZ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0UmV0cmlldmFsQ29uZmlnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dNdWx0aU1vZGFsVGlwPXtzaG93TXVsdGlNb2RhbFRpcH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEVjb25vbWljYWxSZXRyaWV2YWxNZXRob2RDb25maWdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17cmV0cmlldmFsQ29uZmlnfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRSZXRyaWV2YWxDb25maWd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgIDxEaXZpZGVyXG4gICAgICAgIHR5cGU9XCJob3Jpem9udGFsXCJcbiAgICAgICAgY2xhc3NOYW1lPVwibXktMSBoLXB4IGJnLWRpdmlkZXItc3VidGxlXCJcbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17cm93Q2xhc3N9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30gLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibWluLXctMjRcIlxuICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nfVxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU2F2ZX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dCgnZm9ybS5zYXZlJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7c2hvd0FwcEljb25QaWNrZXIgJiYgKFxuICAgICAgICA8QXBwSWNvblBpY2tlclxuICAgICAgICAgIG9uU2VsZWN0PXtoYW5kbGVTZWxlY3RBcHBJY29ufVxuICAgICAgICAgIG9uQ2xvc2U9e2hhbmRsZUNsb3NlQXBwSWNvblBpY2tlcn1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9ybVxuIl19