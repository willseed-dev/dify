"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const predicate_1 = require("es-toolkit/predicate");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const input_1 = require("@/app/components/base/input");
const textarea_1 = require("@/app/components/base/textarea");
const toast_1 = require("@/app/components/base/toast");
const check_rerank_model_1 = require("@/app/components/datasets/common/check-rerank-model");
const step_two_1 = require("@/app/components/datasets/create/step-two");
const index_method_1 = require("@/app/components/datasets/settings/index-method");
const permission_selector_1 = require("@/app/components/datasets/settings/permission-selector");
const utils_1 = require("@/app/components/datasets/settings/utils");
const constants_1 = require("@/app/components/header/account-setting/constants");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const model_selector_1 = require("@/app/components/header/account-setting/model-provider-page/model-selector");
const app_context_1 = require("@/context/app-context");
const i18n_1 = require("@/context/i18n");
const modal_context_1 = require("@/context/modal-context");
const datasets_1 = require("@/models/datasets");
const datasets_2 = require("@/service/datasets");
const use_common_1 = require("@/service/use-common");
const classnames_1 = require("@/utils/classnames");
const retrieval_section_1 = require("./retrieval-section");
const rowClass = `
  flex justify-between py-4 flex-wrap gap-y-2
`;
const labelClass = `
  flex w-[168px] shrink-0
`;
const SettingsModal = ({ currentDataset, onCancel, onSave, }) => {
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: rerankModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.rerank);
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const { notify } = (0, toast_1.useToastContext)();
    const ref = (0, react_2.useRef)(null);
    const isExternal = currentDataset.provider === 'external';
    const { setShowAccountSettingModal } = (0, modal_context_1.useModalContext)();
    const [loading, setLoading] = (0, react_2.useState)(false);
    const { isCurrentWorkspaceDatasetOperator } = (0, app_context_1.useAppContext)();
    const [localeCurrentDataset, setLocaleCurrentDataset] = (0, react_2.useState)({ ...currentDataset });
    const [topK, setTopK] = (0, react_2.useState)(localeCurrentDataset?.external_retrieval_model.top_k ?? 2);
    const [scoreThreshold, setScoreThreshold] = (0, react_2.useState)(localeCurrentDataset?.external_retrieval_model.score_threshold ?? 0.5);
    const [scoreThresholdEnabled, setScoreThresholdEnabled] = (0, react_2.useState)(localeCurrentDataset?.external_retrieval_model.score_threshold_enabled ?? false);
    const [selectedMemberIDs, setSelectedMemberIDs] = (0, react_2.useState)(currentDataset.partial_member_list || []);
    const [memberList, setMemberList] = (0, react_2.useState)([]);
    const { data: membersData } = (0, use_common_1.useMembers)();
    const [indexMethod, setIndexMethod] = (0, react_2.useState)(currentDataset.indexing_technique);
    const [retrievalConfig, setRetrievalConfig] = (0, react_2.useState)(localeCurrentDataset?.retrieval_model_dict);
    const [keywordNumber, setKeywordNumber] = (0, react_2.useState)(currentDataset.keyword_number ?? 10);
    const handleValueChange = (type, value) => {
        setLocaleCurrentDataset({ ...localeCurrentDataset, [type]: value });
    };
    const [isHideChangedTip, setIsHideChangedTip] = (0, react_2.useState)(false);
    const isRetrievalChanged = !(0, predicate_1.isEqual)(retrievalConfig, localeCurrentDataset?.retrieval_model_dict) || indexMethod !== localeCurrentDataset?.indexing_technique;
    const handleSettingsChange = (data) => {
        if (data.top_k !== undefined)
            setTopK(data.top_k);
        if (data.score_threshold !== undefined)
            setScoreThreshold(data.score_threshold);
        if (data.score_threshold_enabled !== undefined)
            setScoreThresholdEnabled(data.score_threshold_enabled);
        setLocaleCurrentDataset({
            ...localeCurrentDataset,
            external_retrieval_model: {
                ...localeCurrentDataset?.external_retrieval_model,
                ...data,
            },
        });
    };
    const handleSave = async () => {
        if (loading)
            return;
        if (!localeCurrentDataset.name?.trim()) {
            notify({ type: 'error', message: t('form.nameError', { ns: 'datasetSettings' }) });
            return;
        }
        if (!(0, check_rerank_model_1.isReRankModelSelected)({
            rerankModelList,
            retrievalConfig,
            indexMethod,
        })) {
            notify({ type: 'error', message: t('datasetConfig.rerankModelRequired', { ns: 'appDebug' }) });
            return;
        }
        try {
            setLoading(true);
            const { id, name, description, permission } = localeCurrentDataset;
            const requestParams = {
                datasetId: id,
                body: {
                    name,
                    description,
                    permission,
                    indexing_technique: indexMethod,
                    keyword_number: keywordNumber,
                    retrieval_model: {
                        ...retrievalConfig,
                        score_threshold: retrievalConfig.score_threshold_enabled ? retrievalConfig.score_threshold : 0,
                    },
                    embedding_model: localeCurrentDataset.embedding_model,
                    embedding_model_provider: localeCurrentDataset.embedding_model_provider,
                    ...(isExternal && {
                        external_knowledge_id: currentDataset.external_knowledge_info.external_knowledge_id,
                        external_knowledge_api_id: currentDataset.external_knowledge_info.external_knowledge_api_id,
                        external_retrieval_model: {
                            top_k: topK,
                            score_threshold: scoreThreshold,
                            score_threshold_enabled: scoreThresholdEnabled,
                        },
                    }),
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
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            onSave({
                ...localeCurrentDataset,
                indexing_technique: indexMethod,
                retrieval_model_dict: retrievalConfig,
            });
        }
        catch {
            notify({ type: 'error', message: t('actionMsg.modifiedUnsuccessfully', { ns: 'common' }) });
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_2.useEffect)(() => {
        if (!membersData?.accounts)
            setMemberList([]);
        else
            setMemberList(membersData.accounts);
    }, [membersData]);
    const showMultiModalTip = (0, react_2.useMemo)(() => {
        return (0, utils_1.checkShowMultiModalTip)({
            embeddingModel: {
                provider: localeCurrentDataset.embedding_model_provider,
                model: localeCurrentDataset.embedding_model,
            },
            rerankingEnable: retrievalConfig.reranking_enable,
            rerankModel: {
                rerankingProviderName: retrievalConfig.reranking_model.reranking_provider_name,
                rerankingModelName: retrievalConfig.reranking_model.reranking_model_name,
            },
            indexMethod,
            embeddingModelList,
            rerankModelList,
        });
    }, [localeCurrentDataset.embedding_model, localeCurrentDataset.embedding_model_provider, retrievalConfig.reranking_enable, retrievalConfig.reranking_model, indexMethod, embeddingModelList, rerankModelList]);
    return (<div className="flex w-full flex-col overflow-hidden rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-xl" style={{
            height: 'calc(100vh - 72px)',
        }} ref={ref}>
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-divider-regular pl-6 pr-5">
        <div className="flex flex-col text-base font-semibold text-text-primary">
          <div className="leading-6">{t('title', { ns: 'datasetSettings' })}</div>
        </div>
        <div className="flex items-center">
          <div onClick={onCancel} className="flex h-6 w-6 cursor-pointer items-center justify-center">
            <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="overflow-y-auto border-b border-divider-regular p-6 pb-[68px] pt-5">
        <div className={(0, classnames_1.cn)(rowClass, 'items-center')}>
          <div className={labelClass}>
            <div className="system-sm-semibold text-text-secondary">{t('form.name', { ns: 'datasetSettings' })}</div>
          </div>
          <input_1.default value={localeCurrentDataset.name} onChange={e => handleValueChange('name', e.target.value)} className="block h-9" placeholder={t('form.namePlaceholder', { ns: 'datasetSettings' }) || ''}/>
        </div>
        <div className={(0, classnames_1.cn)(rowClass)}>
          <div className={labelClass}>
            <div className="system-sm-semibold text-text-secondary">{t('form.desc', { ns: 'datasetSettings' })}</div>
          </div>
          <div className="w-full">
            <textarea_1.default value={localeCurrentDataset.description || ''} onChange={e => handleValueChange('description', e.target.value)} className="resize-none" placeholder={t('form.descPlaceholder', { ns: 'datasetSettings' }) || ''}/>
          </div>
        </div>
        <div className={rowClass}>
          <div className={labelClass}>
            <div className="system-sm-semibold text-text-secondary">{t('form.permissions', { ns: 'datasetSettings' })}</div>
          </div>
          <div className="w-full">
            <permission_selector_1.default disabled={!localeCurrentDataset?.embedding_available || isCurrentWorkspaceDatasetOperator} permission={localeCurrentDataset.permission} value={selectedMemberIDs} onChange={v => handleValueChange('permission', v)} onMemberSelect={setSelectedMemberIDs} memberList={memberList}/>
          </div>
        </div>
        {currentDataset && currentDataset.indexing_technique && (<div className={(0, classnames_1.cn)(rowClass)}>
            <div className={labelClass}>
              <div className="system-sm-semibold text-text-secondary">{t('form.indexMethod', { ns: 'datasetSettings' })}</div>
            </div>
            <div className="grow">
              <index_method_1.default disabled={!localeCurrentDataset?.embedding_available} value={indexMethod} onChange={setIndexMethod} currentValue={currentDataset.indexing_technique} keywordNumber={keywordNumber} onKeywordNumberChange={setKeywordNumber}/>
            </div>
          </div>)}
        {indexMethod === step_two_1.IndexingType.QUALIFIED && (<div className={(0, classnames_1.cn)(rowClass)}>
            <div className={labelClass}>
              <div className="system-sm-semibold text-text-secondary">{t('form.embeddingModel', { ns: 'datasetSettings' })}</div>
            </div>
            <div className="w-full">
              <div className="h-8 w-full rounded-lg bg-components-input-bg-normal opacity-60">
                <model_selector_1.default readonly defaultModel={{
                provider: localeCurrentDataset.embedding_model_provider,
                model: localeCurrentDataset.embedding_model,
            }} modelList={embeddingModelList}/>
              </div>
              <div className="mt-2 w-full text-xs leading-6 text-text-tertiary">
                {t('form.embeddingModelTip', { ns: 'datasetSettings' })}
                <span className="cursor-pointer text-text-accent" onClick={() => setShowAccountSettingModal({ payload: constants_1.ACCOUNT_SETTING_TAB.PROVIDER })}>{t('form.embeddingModelTipLink', { ns: 'datasetSettings' })}</span>
              </div>
            </div>
          </div>)}

        {/* Retrieval Method Config */}
        {isExternal
            ? (<retrieval_section_1.RetrievalSection isExternal rowClass={rowClass} labelClass={labelClass} t={t} topK={topK} scoreThreshold={scoreThreshold} scoreThresholdEnabled={scoreThresholdEnabled} onExternalSettingChange={handleSettingsChange} currentDataset={currentDataset}/>)
            : (<retrieval_section_1.RetrievalSection isExternal={false} rowClass={rowClass} labelClass={labelClass} t={t} indexMethod={indexMethod} retrievalConfig={retrievalConfig} showMultiModalTip={showMultiModalTip} onRetrievalConfigChange={setRetrievalConfig} docLink={docLink}/>)}
      </div>
      <retrieval_section_1.RetrievalChangeTip visible={isRetrievalChanged && !isHideChangedTip} message={t('datasetConfig.retrieveChangeTip', { ns: 'appDebug' })} onDismiss={() => setIsHideChangedTip(true)}/>

      <div className="sticky bottom-0 z-[5] flex w-full justify-end border-t border-divider-regular bg-background-section px-6 py-4">
        <button_1.default onClick={onCancel} className="mr-2">
          {t('operation.cancel', { ns: 'common' })}
        </button_1.default>
        <button_1.default variant="primary" disabled={loading} onClick={handleSave}>
          {t('operation.save', { ns: 'common' })}
        </button_1.default>
      </div>
    </div>);
};
exports.default = SettingsModal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSw0Q0FBOEM7QUFDOUMsb0RBQThDO0FBQzlDLGlDQUE0RDtBQUM1RCxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELHVEQUErQztBQUMvQyw2REFBcUQ7QUFDckQsdURBQTZEO0FBQzdELDRGQUEyRjtBQUMzRix3RUFBd0U7QUFDeEUsa0ZBQXlFO0FBQ3pFLGdHQUF1RjtBQUN2RixvRUFBaUY7QUFDakYsaUZBQXVGO0FBQ3ZGLDJHQUF3RztBQUN4Ryw2RkFBZ0c7QUFDaEcsK0dBQXNHO0FBQ3RHLHVEQUFxRDtBQUNyRCx5Q0FBMkM7QUFDM0MsMkRBQXlEO0FBQ3pELGdEQUFxRDtBQUNyRCxpREFBeUQ7QUFDekQscURBQWlEO0FBQ2pELG1EQUF1QztBQUN2QywyREFBMEU7QUFRMUUsTUFBTSxRQUFRLEdBQUc7O0NBRWhCLENBQUE7QUFFRCxNQUFNLFVBQVUsR0FBRzs7Q0FFbEIsQ0FBQTtBQUVELE1BQU0sYUFBYSxHQUEyQixDQUFDLEVBQzdDLGNBQWMsRUFDZCxRQUFRLEVBQ1IsTUFBTSxHQUNQLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxJQUFBLG9CQUFZLEVBQUMsNEJBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM5RSxNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUEsb0JBQVksRUFBQyw0QkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3BFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFVLEdBQUUsQ0FBQTtJQUM1QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBQSxjQUFN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RUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDeEM7UUFBQSxFQUFFLGdCQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgTWVtYmVyIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IFJldHJpZXZhbENvbmZpZyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgUmlDbG9zZUxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gJ2VzLXRvb2xraXQvcHJlZGljYXRlJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgSW5wdXQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2lucHV0J1xuaW1wb3J0IFRleHRhcmVhIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90ZXh0YXJlYSdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IGlzUmVSYW5rTW9kZWxTZWxlY3RlZCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2NoZWNrLXJlcmFuay1tb2RlbCdcbmltcG9ydCB7IEluZGV4aW5nVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY3JlYXRlL3N0ZXAtdHdvJ1xuaW1wb3J0IEluZGV4TWV0aG9kIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvc2V0dGluZ3MvaW5kZXgtbWV0aG9kJ1xuaW1wb3J0IFBlcm1pc3Npb25TZWxlY3RvciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL3NldHRpbmdzL3Blcm1pc3Npb24tc2VsZWN0b3InXG5pbXBvcnQgeyBjaGVja1Nob3dNdWx0aU1vZGFsVGlwIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9zZXR0aW5ncy91dGlscydcbmltcG9ydCB7IEFDQ09VTlRfU0VUVElOR19UQUIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvY29uc3RhbnRzJ1xuaW1wb3J0IHsgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZU1vZGVsTGlzdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IE1vZGVsU2VsZWN0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvbW9kZWwtc2VsZWN0b3InXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlRG9jTGluayB9IGZyb20gJ0AvY29udGV4dC9pMThuJ1xuaW1wb3J0IHsgdXNlTW9kYWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyBEYXRhc2V0UGVybWlzc2lvbiB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgdXBkYXRlRGF0YXNldFNldHRpbmcgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5pbXBvcnQgeyB1c2VNZW1iZXJzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IFJldHJpZXZhbENoYW5nZVRpcCwgUmV0cmlldmFsU2VjdGlvbiB9IGZyb20gJy4vcmV0cmlldmFsLXNlY3Rpb24nXG5cbnR5cGUgU2V0dGluZ3NNb2RhbFByb3BzID0ge1xuICBjdXJyZW50RGF0YXNldDogRGF0YVNldFxuICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICBvblNhdmU6IChuZXdEYXRhc2V0OiBEYXRhU2V0KSA9PiB2b2lkXG59XG5cbmNvbnN0IHJvd0NsYXNzID0gYFxuICBmbGV4IGp1c3RpZnktYmV0d2VlbiBweS00IGZsZXgtd3JhcCBnYXAteS0yXG5gXG5cbmNvbnN0IGxhYmVsQ2xhc3MgPSBgXG4gIGZsZXggdy1bMTY4cHhdIHNocmluay0wXG5gXG5cbmNvbnN0IFNldHRpbmdzTW9kYWw6IEZDPFNldHRpbmdzTW9kYWxQcm9wcz4gPSAoe1xuICBjdXJyZW50RGF0YXNldCxcbiAgb25DYW5jZWwsXG4gIG9uU2F2ZSxcbn0pID0+IHtcbiAgY29uc3QgeyBkYXRhOiBlbWJlZGRpbmdNb2RlbExpc3QgfSA9IHVzZU1vZGVsTGlzdChNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmcpXG4gIGNvbnN0IHsgZGF0YTogcmVyYW5rTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS5yZXJhbmspXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBkb2NMaW5rID0gdXNlRG9jTGluaygpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCByZWYgPSB1c2VSZWYobnVsbClcbiAgY29uc3QgaXNFeHRlcm5hbCA9IGN1cnJlbnREYXRhc2V0LnByb3ZpZGVyID09PSAnZXh0ZXJuYWwnXG4gIGNvbnN0IHsgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgfSA9IHVzZU1vZGFsQ29udGV4dCgpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvciB9ID0gdXNlQXBwQ29udGV4dCgpXG4gIGNvbnN0IFtsb2NhbGVDdXJyZW50RGF0YXNldCwgc2V0TG9jYWxlQ3VycmVudERhdGFzZXRdID0gdXNlU3RhdGUoeyAuLi5jdXJyZW50RGF0YXNldCB9KVxuICBjb25zdCBbdG9wSywgc2V0VG9wS10gPSB1c2VTdGF0ZShsb2NhbGVDdXJyZW50RGF0YXNldD8uZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLnRvcF9rID8/IDIpXG4gIGNvbnN0IFtzY29yZVRocmVzaG9sZCwgc2V0U2NvcmVUaHJlc2hvbGRdID0gdXNlU3RhdGUobG9jYWxlQ3VycmVudERhdGFzZXQ/LmV4dGVybmFsX3JldHJpZXZhbF9tb2RlbC5zY29yZV90aHJlc2hvbGQgPz8gMC41KVxuICBjb25zdCBbc2NvcmVUaHJlc2hvbGRFbmFibGVkLCBzZXRTY29yZVRocmVzaG9sZEVuYWJsZWRdID0gdXNlU3RhdGUobG9jYWxlQ3VycmVudERhdGFzZXQ/LmV4dGVybmFsX3JldHJpZXZhbF9tb2RlbC5zY29yZV90aHJlc2hvbGRfZW5hYmxlZCA/PyBmYWxzZSlcbiAgY29uc3QgW3NlbGVjdGVkTWVtYmVySURzLCBzZXRTZWxlY3RlZE1lbWJlcklEc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oY3VycmVudERhdGFzZXQucGFydGlhbF9tZW1iZXJfbGlzdCB8fCBbXSlcbiAgY29uc3QgW21lbWJlckxpc3QsIHNldE1lbWJlckxpc3RdID0gdXNlU3RhdGU8TWVtYmVyW10+KFtdKVxuICBjb25zdCB7IGRhdGE6IG1lbWJlcnNEYXRhIH0gPSB1c2VNZW1iZXJzKClcblxuICBjb25zdCBbaW5kZXhNZXRob2QsIHNldEluZGV4TWV0aG9kXSA9IHVzZVN0YXRlKGN1cnJlbnREYXRhc2V0LmluZGV4aW5nX3RlY2huaXF1ZSlcbiAgY29uc3QgW3JldHJpZXZhbENvbmZpZywgc2V0UmV0cmlldmFsQ29uZmlnXSA9IHVzZVN0YXRlKGxvY2FsZUN1cnJlbnREYXRhc2V0Py5yZXRyaWV2YWxfbW9kZWxfZGljdCBhcyBSZXRyaWV2YWxDb25maWcpXG4gIGNvbnN0IFtrZXl3b3JkTnVtYmVyLCBzZXRLZXl3b3JkTnVtYmVyXSA9IHVzZVN0YXRlKGN1cnJlbnREYXRhc2V0LmtleXdvcmRfbnVtYmVyID8/IDEwKVxuXG4gIGNvbnN0IGhhbmRsZVZhbHVlQ2hhbmdlID0gKHR5cGU6IHN0cmluZywgdmFsdWU6IHN0cmluZykgPT4ge1xuICAgIHNldExvY2FsZUN1cnJlbnREYXRhc2V0KHsgLi4ubG9jYWxlQ3VycmVudERhdGFzZXQsIFt0eXBlXTogdmFsdWUgfSlcbiAgfVxuICBjb25zdCBbaXNIaWRlQ2hhbmdlZFRpcCwgc2V0SXNIaWRlQ2hhbmdlZFRpcF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgaXNSZXRyaWV2YWxDaGFuZ2VkID0gIWlzRXF1YWwocmV0cmlldmFsQ29uZmlnLCBsb2NhbGVDdXJyZW50RGF0YXNldD8ucmV0cmlldmFsX21vZGVsX2RpY3QpIHx8IGluZGV4TWV0aG9kICE9PSBsb2NhbGVDdXJyZW50RGF0YXNldD8uaW5kZXhpbmdfdGVjaG5pcXVlXG5cbiAgY29uc3QgaGFuZGxlU2V0dGluZ3NDaGFuZ2UgPSAoZGF0YTogeyB0b3Bfaz86IG51bWJlciwgc2NvcmVfdGhyZXNob2xkPzogbnVtYmVyLCBzY29yZV90aHJlc2hvbGRfZW5hYmxlZD86IGJvb2xlYW4gfSkgPT4ge1xuICAgIGlmIChkYXRhLnRvcF9rICE9PSB1bmRlZmluZWQpXG4gICAgICBzZXRUb3BLKGRhdGEudG9wX2spXG4gICAgaWYgKGRhdGEuc2NvcmVfdGhyZXNob2xkICE9PSB1bmRlZmluZWQpXG4gICAgICBzZXRTY29yZVRocmVzaG9sZChkYXRhLnNjb3JlX3RocmVzaG9sZClcbiAgICBpZiAoZGF0YS5zY29yZV90aHJlc2hvbGRfZW5hYmxlZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgc2V0U2NvcmVUaHJlc2hvbGRFbmFibGVkKGRhdGEuc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQpXG5cbiAgICBzZXRMb2NhbGVDdXJyZW50RGF0YXNldCh7XG4gICAgICAuLi5sb2NhbGVDdXJyZW50RGF0YXNldCxcbiAgICAgIGV4dGVybmFsX3JldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAuLi5sb2NhbGVDdXJyZW50RGF0YXNldD8uZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAobG9hZGluZylcbiAgICAgIHJldHVyblxuICAgIGlmICghbG9jYWxlQ3VycmVudERhdGFzZXQubmFtZT8udHJpbSgpKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdmb3JtLm5hbWVFcnJvcicsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKFxuICAgICAgIWlzUmVSYW5rTW9kZWxTZWxlY3RlZCh7XG4gICAgICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnLFxuICAgICAgICBpbmRleE1ldGhvZCxcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdkYXRhc2V0Q29uZmlnLnJlcmFua01vZGVsUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICAgIGNvbnN0IHsgaWQsIG5hbWUsIGRlc2NyaXB0aW9uLCBwZXJtaXNzaW9uIH0gPSBsb2NhbGVDdXJyZW50RGF0YXNldFxuICAgICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHtcbiAgICAgICAgZGF0YXNldElkOiBpZCxcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgcGVybWlzc2lvbixcbiAgICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6IGluZGV4TWV0aG9kLFxuICAgICAgICAgIGtleXdvcmRfbnVtYmVyOiBrZXl3b3JkTnVtYmVyLFxuICAgICAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAgICAgLi4ucmV0cmlldmFsQ29uZmlnLFxuICAgICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiByZXRyaWV2YWxDb25maWcuc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQgPyByZXRyaWV2YWxDb25maWcuc2NvcmVfdGhyZXNob2xkIDogMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbDogbG9jYWxlQ3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsLFxuICAgICAgICAgIGVtYmVkZGluZ19tb2RlbF9wcm92aWRlcjogbG9jYWxlQ3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyLFxuICAgICAgICAgIC4uLihpc0V4dGVybmFsICYmIHtcbiAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9pZDogY3VycmVudERhdGFzZXQhLmV4dGVybmFsX2tub3dsZWRnZV9pbmZvLmV4dGVybmFsX2tub3dsZWRnZV9pZCxcbiAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ6IGN1cnJlbnREYXRhc2V0IS5leHRlcm5hbF9rbm93bGVkZ2VfaW5mby5leHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkLFxuICAgICAgICAgICAgZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgICAgICAgIHRvcF9rOiB0b3BLLFxuICAgICAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IHNjb3JlVGhyZXNob2xkLFxuICAgICAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogc2NvcmVUaHJlc2hvbGRFbmFibGVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgYW55XG4gICAgICBpZiAocGVybWlzc2lvbiA9PT0gRGF0YXNldFBlcm1pc3Npb24ucGFydGlhbE1lbWJlcnMpIHtcbiAgICAgICAgcmVxdWVzdFBhcmFtcy5ib2R5LnBhcnRpYWxfbWVtYmVyX2xpc3QgPSBzZWxlY3RlZE1lbWJlcklEcy5tYXAoKGlkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVzZXJfaWQ6IGlkLFxuICAgICAgICAgICAgcm9sZTogbWVtYmVyTGlzdC5maW5kKG1lbWJlciA9PiBtZW1iZXIuaWQgPT09IGlkKT8ucm9sZSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBhd2FpdCB1cGRhdGVEYXRhc2V0U2V0dGluZyhyZXF1ZXN0UGFyYW1zKVxuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgb25TYXZlKHtcbiAgICAgICAgLi4ubG9jYWxlQ3VycmVudERhdGFzZXQsXG4gICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogaW5kZXhNZXRob2QsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbF9kaWN0OiByZXRyaWV2YWxDb25maWcsXG4gICAgICB9KVxuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRVbnN1Y2Nlc3NmdWxseScsIHsgbnM6ICdjb21tb24nIH0pIH0pXG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWVtYmVyc0RhdGE/LmFjY291bnRzKVxuICAgICAgc2V0TWVtYmVyTGlzdChbXSlcbiAgICBlbHNlXG4gICAgICBzZXRNZW1iZXJMaXN0KG1lbWJlcnNEYXRhLmFjY291bnRzKVxuICB9LCBbbWVtYmVyc0RhdGFdKVxuXG4gIGNvbnN0IHNob3dNdWx0aU1vZGFsVGlwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGNoZWNrU2hvd011bHRpTW9kYWxUaXAoe1xuICAgICAgZW1iZWRkaW5nTW9kZWw6IHtcbiAgICAgICAgcHJvdmlkZXI6IGxvY2FsZUN1cnJlbnREYXRhc2V0LmVtYmVkZGluZ19tb2RlbF9wcm92aWRlcixcbiAgICAgICAgbW9kZWw6IGxvY2FsZUN1cnJlbnREYXRhc2V0LmVtYmVkZGluZ19tb2RlbCxcbiAgICAgIH0sXG4gICAgICByZXJhbmtpbmdFbmFibGU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLFxuICAgICAgcmVyYW5rTW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nUHJvdmlkZXJOYW1lOiByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICByZXJhbmtpbmdNb2RlbE5hbWU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX21vZGVsX25hbWUsXG4gICAgICB9LFxuICAgICAgaW5kZXhNZXRob2QsXG4gICAgICBlbWJlZGRpbmdNb2RlbExpc3QsXG4gICAgICByZXJhbmtNb2RlbExpc3QsXG4gICAgfSlcbiAgfSwgW2xvY2FsZUN1cnJlbnREYXRhc2V0LmVtYmVkZGluZ19tb2RlbCwgbG9jYWxlQ3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyLCByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX2VuYWJsZSwgcmV0cmlldmFsQ29uZmlnLnJlcmFua2luZ19tb2RlbCwgaW5kZXhNZXRob2QsIGVtYmVkZGluZ01vZGVsTGlzdCwgcmVyYW5rTW9kZWxMaXN0XSlcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIGZsZXgtY29sIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHNoYWRvdy14bFwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBoZWlnaHQ6ICdjYWxjKDEwMHZoIC0gNzJweCknLFxuICAgICAgfX1cbiAgICAgIHJlZj17cmVmfVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTE0IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYm9yZGVyLWIgYm9yZGVyLWRpdmlkZXItcmVndWxhciBwbC02IHByLTVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHRleHQtYmFzZSBmb250LXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZWFkaW5nLTZcIj57dCgndGl0bGUnLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaC02IHctNiBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7LyogQm9keSAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3ZlcmZsb3cteS1hdXRvIGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXIgcC02IHBiLVs2OHB4XSBwdC01XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbihyb3dDbGFzcywgJ2l0ZW1zLWNlbnRlcicpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17bGFiZWxDbGFzc30+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2Zvcm0ubmFtZScsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2xvY2FsZUN1cnJlbnREYXRhc2V0Lm5hbWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBoYW5kbGVWYWx1ZUNoYW5nZSgnbmFtZScsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJsb2NrIGgtOVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj17dCgnZm9ybS5uYW1lUGxhY2Vob2xkZXInLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KSB8fCAnJ31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKHJvd0NsYXNzKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2xhYmVsQ2xhc3N9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdmb3JtLmRlc2MnLCB7IG5zOiAnZGF0YXNldFNldHRpbmdzJyB9KX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbFwiPlxuICAgICAgICAgICAgPFRleHRhcmVhXG4gICAgICAgICAgICAgIHZhbHVlPXtsb2NhbGVDdXJyZW50RGF0YXNldC5kZXNjcmlwdGlvbiB8fCAnJ31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlVmFsdWVDaGFuZ2UoJ2Rlc2NyaXB0aW9uJywgZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZXNpemUtbm9uZVwiXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPXt0KCdmb3JtLmRlc2NQbGFjZWhvbGRlcicsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pIHx8ICcnfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtyb3dDbGFzc30+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2xhYmVsQ2xhc3N9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdmb3JtLnBlcm1pc3Npb25zJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGxcIj5cbiAgICAgICAgICAgIDxQZXJtaXNzaW9uU2VsZWN0b3JcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsb2NhbGVDdXJyZW50RGF0YXNldD8uZW1iZWRkaW5nX2F2YWlsYWJsZSB8fCBpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3J9XG4gICAgICAgICAgICAgIHBlcm1pc3Npb249e2xvY2FsZUN1cnJlbnREYXRhc2V0LnBlcm1pc3Npb259XG4gICAgICAgICAgICAgIHZhbHVlPXtzZWxlY3RlZE1lbWJlcklEc31cbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gaGFuZGxlVmFsdWVDaGFuZ2UoJ3Blcm1pc3Npb24nLCB2ISl9XG4gICAgICAgICAgICAgIG9uTWVtYmVyU2VsZWN0PXtzZXRTZWxlY3RlZE1lbWJlcklEc31cbiAgICAgICAgICAgICAgbWVtYmVyTGlzdD17bWVtYmVyTGlzdH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7Y3VycmVudERhdGFzZXQgJiYgY3VycmVudERhdGFzZXQuaW5kZXhpbmdfdGVjaG5pcXVlICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24ocm93Q2xhc3MpfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtsYWJlbENsYXNzfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdmb3JtLmluZGV4TWV0aG9kJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgICAgICA8SW5kZXhNZXRob2RcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWxvY2FsZUN1cnJlbnREYXRhc2V0Py5lbWJlZGRpbmdfYXZhaWxhYmxlfVxuICAgICAgICAgICAgICAgIHZhbHVlPXtpbmRleE1ldGhvZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0SW5kZXhNZXRob2R9XG4gICAgICAgICAgICAgICAgY3VycmVudFZhbHVlPXtjdXJyZW50RGF0YXNldC5pbmRleGluZ190ZWNobmlxdWV9XG4gICAgICAgICAgICAgICAga2V5d29yZE51bWJlcj17a2V5d29yZE51bWJlcn1cbiAgICAgICAgICAgICAgICBvbktleXdvcmROdW1iZXJDaGFuZ2U9e3NldEtleXdvcmROdW1iZXJ9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge2luZGV4TWV0aG9kID09PSBJbmRleGluZ1R5cGUuUVVBTElGSUVEICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24ocm93Q2xhc3MpfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtsYWJlbENsYXNzfT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KCdmb3JtLmVtYmVkZGluZ01vZGVsJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC04IHctZnVsbCByb3VuZGVkLWxnIGJnLWNvbXBvbmVudHMtaW5wdXQtYmctbm9ybWFsIG9wYWNpdHktNjBcIj5cbiAgICAgICAgICAgICAgICA8TW9kZWxTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgcmVhZG9ubHlcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRNb2RlbD17e1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcjogbG9jYWxlQ3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyLFxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogbG9jYWxlQ3VycmVudERhdGFzZXQuZW1iZWRkaW5nX21vZGVsLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIG1vZGVsTGlzdD17ZW1iZWRkaW5nTW9kZWxMaXN0fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgdy1mdWxsIHRleHQteHMgbGVhZGluZy02IHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgIHt0KCdmb3JtLmVtYmVkZGluZ01vZGVsVGlwJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiY3Vyc29yLXBvaW50ZXIgdGV4dC10ZXh0LWFjY2VudFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsKHsgcGF5bG9hZDogQUNDT1VOVF9TRVRUSU5HX1RBQi5QUk9WSURFUiB9KX0+e3QoJ2Zvcm0uZW1iZWRkaW5nTW9kZWxUaXBMaW5rJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBSZXRyaWV2YWwgTWV0aG9kIENvbmZpZyAqL31cbiAgICAgICAge2lzRXh0ZXJuYWxcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPFJldHJpZXZhbFNlY3Rpb25cbiAgICAgICAgICAgICAgICBpc0V4dGVybmFsXG4gICAgICAgICAgICAgICAgcm93Q2xhc3M9e3Jvd0NsYXNzfVxuICAgICAgICAgICAgICAgIGxhYmVsQ2xhc3M9e2xhYmVsQ2xhc3N9XG4gICAgICAgICAgICAgICAgdD17dCBhcyBhbnl9XG4gICAgICAgICAgICAgICAgdG9wSz17dG9wS31cbiAgICAgICAgICAgICAgICBzY29yZVRocmVzaG9sZD17c2NvcmVUaHJlc2hvbGR9XG4gICAgICAgICAgICAgICAgc2NvcmVUaHJlc2hvbGRFbmFibGVkPXtzY29yZVRocmVzaG9sZEVuYWJsZWR9XG4gICAgICAgICAgICAgICAgb25FeHRlcm5hbFNldHRpbmdDaGFuZ2U9e2hhbmRsZVNldHRpbmdzQ2hhbmdlfVxuICAgICAgICAgICAgICAgIGN1cnJlbnREYXRhc2V0PXtjdXJyZW50RGF0YXNldH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgPFJldHJpZXZhbFNlY3Rpb25cbiAgICAgICAgICAgICAgICBpc0V4dGVybmFsPXtmYWxzZX1cbiAgICAgICAgICAgICAgICByb3dDbGFzcz17cm93Q2xhc3N9XG4gICAgICAgICAgICAgICAgbGFiZWxDbGFzcz17bGFiZWxDbGFzc31cbiAgICAgICAgICAgICAgICB0PXt0IGFzIGFueX1cbiAgICAgICAgICAgICAgICBpbmRleE1ldGhvZD17aW5kZXhNZXRob2R9XG4gICAgICAgICAgICAgICAgcmV0cmlldmFsQ29uZmlnPXtyZXRyaWV2YWxDb25maWd9XG4gICAgICAgICAgICAgICAgc2hvd011bHRpTW9kYWxUaXA9e3Nob3dNdWx0aU1vZGFsVGlwfVxuICAgICAgICAgICAgICAgIG9uUmV0cmlldmFsQ29uZmlnQ2hhbmdlPXtzZXRSZXRyaWV2YWxDb25maWd9XG4gICAgICAgICAgICAgICAgZG9jTGluaz17ZG9jTGlua31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxSZXRyaWV2YWxDaGFuZ2VUaXBcbiAgICAgICAgdmlzaWJsZT17aXNSZXRyaWV2YWxDaGFuZ2VkICYmICFpc0hpZGVDaGFuZ2VkVGlwfVxuICAgICAgICBtZXNzYWdlPXt0KCdkYXRhc2V0Q29uZmlnLnJldHJpZXZlQ2hhbmdlVGlwJywgeyBuczogJ2FwcERlYnVnJyB9KX1cbiAgICAgICAgb25EaXNtaXNzPXsoKSA9PiBzZXRJc0hpZGVDaGFuZ2VkVGlwKHRydWUpfVxuICAgICAgLz5cblxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJzdGlja3kgYm90dG9tLTAgei1bNV0gZmxleCB3LWZ1bGwganVzdGlmeS1lbmQgYm9yZGVyLXQgYm9yZGVyLWRpdmlkZXItcmVndWxhciBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24gcHgtNiBweS00XCJcbiAgICAgID5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2FuY2VsfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTJcIlxuICAgICAgICA+XG4gICAgICAgICAge3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlU2F2ZX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0KCdvcGVyYXRpb24uc2F2ZScsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNldHRpbmdzTW9kYWxcbiJdfQ==