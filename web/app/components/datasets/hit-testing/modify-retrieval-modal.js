"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const check_rerank_model_1 = require("@/app/components/datasets/common/check-rerank-model");
const economical_retrieval_method_config_1 = require("@/app/components/datasets/common/economical-retrieval-method-config");
const retrieval_method_config_1 = require("@/app/components/datasets/common/retrieval-method-config");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const dataset_detail_1 = require("@/context/dataset-detail");
const i18n_1 = require("@/context/i18n");
const toast_1 = require("../../base/toast");
const declarations_1 = require("../../header/account-setting/model-provider-page/declarations");
const utils_1 = require("../settings/utils");
const ModifyRetrievalModal = ({ indexMethod, value, isShow, onHide, onSave, }) => {
    const ref = (0, react_2.useRef)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const [retrievalConfig, setRetrievalConfig] = (0, react_2.useState)(value);
    const embeddingModel = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(state => state.dataset?.embedding_model);
    const embeddingModelProvider = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(state => state.dataset?.embedding_model_provider);
    // useClickAway(() => {
    //   if (ref)
    //     onHide()
    // }, ref)
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: rerankModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.rerank);
    const handleSave = () => {
        if (!(0, check_rerank_model_1.isReRankModelSelected)({
            rerankModelList,
            retrievalConfig,
            indexMethod,
        })) {
            toast_1.default.notify({ type: 'error', message: t('datasetConfig.rerankModelRequired', { ns: 'appDebug' }) });
            return;
        }
        onSave(retrievalConfig);
    };
    const showMultiModalTip = (0, react_2.useMemo)(() => {
        return (0, utils_1.checkShowMultiModalTip)({
            embeddingModel: {
                provider: embeddingModelProvider ?? '',
                model: embeddingModel ?? '',
            },
            rerankingEnable: retrievalConfig.reranking_enable,
            rerankModel: {
                rerankingProviderName: retrievalConfig.reranking_model.reranking_provider_name,
                rerankingModelName: retrievalConfig.reranking_model.reranking_model_name,
            },
            indexMethod: indexMethod,
            embeddingModelList,
            rerankModelList,
        });
    }, [embeddingModelProvider, embeddingModel, retrievalConfig.reranking_enable, retrievalConfig.reranking_model, indexMethod, embeddingModelList, rerankModelList]);
    if (!isShow)
        return null;
    return (<div className="flex w-full flex-col rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-2xl shadow-shadow-shadow-9" style={{
            height: 'calc(100vh - 72px)',
        }} ref={ref}>
      <div className="h-15 flex shrink-0 justify-between px-3 pb-1 pt-3.5">
        <div className="text-base font-semibold text-text-primary">
          <div>{t('form.retrievalSetting.title', { ns: 'datasetSettings' })}</div>
          <div className="text-xs font-normal leading-[18px] text-text-tertiary">
            <a target="_blank" rel="noopener noreferrer" href={docLink('/guides/knowledge-base/retrieval-test-and-citation#modify-text-retrieval-setting', {
            'zh-Hans': '/guides/knowledge-base/retrieval-test-and-citation#修改文本检索方式',
            'ja-JP': '/guides/knowledge-base/retrieval-test-and-citation',
        })} className="text-text-accent">
              {t('form.retrievalSetting.learnMore', { ns: 'datasetSettings' })}
            </a>
            {t('form.retrievalSetting.description', { ns: 'datasetSettings' })}
          </div>
        </div>
        <div className="flex">
          <div onClick={onHide} className="flex h-8 w-8 cursor-pointer items-center justify-center">
            <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="mb-1 text-[13px] font-semibold leading-6 text-text-secondary">
          {t('form.retrievalSetting.method', { ns: 'datasetSettings' })}
        </div>
        {indexMethod === 'high_quality'
            ? (<retrieval_method_config_1.default value={retrievalConfig} onChange={setRetrievalConfig} showMultiModalTip={showMultiModalTip}/>)
            : (<economical_retrieval_method_config_1.default value={retrievalConfig} onChange={setRetrievalConfig}/>)}
      </div>
      <div className="flex justify-end p-4 pt-2">
        <button_1.default className="mr-2 shrink-0" onClick={onHide}>{t('operation.cancel', { ns: 'common' })}</button_1.default>
        <button_1.default variant="primary" className="shrink-0" onClick={handleSave}>{t('operation.save', { ns: 'common' })}</button_1.default>
      </div>
    </div>);
};
exports.default = React.memo(ModifyRetrievalModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kaWZ5LXJldHJpZXZhbC1tb2RhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGlmeS1yZXRyaWV2YWwtbW9kYWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBSVosNENBQThDO0FBQzlDLCtCQUE4QjtBQUM5QixpQ0FBaUQ7QUFDakQsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCw0RkFBMkY7QUFDM0YsNEhBQWlIO0FBQ2pILHNHQUE0RjtBQUM1Riw2RkFBZ0c7QUFDaEcsNkRBQThFO0FBQzlFLHlDQUEyQztBQUMzQyw0Q0FBb0M7QUFDcEMsZ0dBQTZGO0FBQzdGLDZDQUEwRDtBQVUxRCxNQUFNLG9CQUFvQixHQUFjLENBQUMsRUFDdkMsV0FBVyxFQUNYLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sR0FDUCxFQUFFLEVBQUU7SUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFBLGNBQU0sRUFBQyxJQUFJLENBQUMsQ0FBQTtJQUN4QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBVSxHQUFFLENBQUE7SUFDNUIsTUFBTSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUM3RCxNQUFNLGNBQWMsR0FBRyxJQUFBLG9EQUFtQyxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQTtJQUNuRyxNQUFNLHNCQUFzQixHQUFHLElBQUEsb0RBQW1DLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLHdCQUF3QixDQUFDLENBQUE7SUFFcEgsdUJBQXVCO0lBQ3ZCLGFBQWE7SUFDYixlQUFlO0lBQ2YsVUFBVTtJQUVWLE1BQU0sRUFBRSxJQUFJLEVBQUUsa0JB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LFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxnQkFBTSxDQUNySDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IEluZGV4aW5nVHlwZSB9IGZyb20gJy4uL2NyZWF0ZS9zdGVwLXR3bydcbmltcG9ydCB0eXBlIHsgUmV0cmlldmFsQ29uZmlnIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZU1lbW8sIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB7IGlzUmVSYW5rTW9kZWxTZWxlY3RlZCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2NoZWNrLXJlcmFuay1tb2RlbCdcbmltcG9ydCBFY29ub21pY2FsUmV0cmlldmFsTWV0aG9kQ29uZmlnIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2Vjb25vbWljYWwtcmV0cmlldmFsLW1ldGhvZC1jb25maWcnXG5pbXBvcnQgUmV0cmlldmFsTWV0aG9kQ29uZmlnIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL3JldHJpZXZhbC1tZXRob2QtY29uZmlnJ1xuaW1wb3J0IHsgdXNlTW9kZWxMaXN0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnXG5pbXBvcnQgeyB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvciB9IGZyb20gJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCdcbmltcG9ydCB7IHVzZURvY0xpbmsgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCBUb2FzdCBmcm9tICcuLi8uLi9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgTW9kZWxUeXBlRW51bSB9IGZyb20gJy4uLy4uL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyBjaGVja1Nob3dNdWx0aU1vZGFsVGlwIH0gZnJvbSAnLi4vc2V0dGluZ3MvdXRpbHMnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIGluZGV4TWV0aG9kOiBzdHJpbmdcbiAgdmFsdWU6IFJldHJpZXZhbENvbmZpZ1xuICBpc1Nob3c6IGJvb2xlYW5cbiAgb25IaWRlOiAoKSA9PiB2b2lkXG4gIG9uU2F2ZTogKHZhbHVlOiBSZXRyaWV2YWxDb25maWcpID0+IHZvaWRcbn1cblxuY29uc3QgTW9kaWZ5UmV0cmlldmFsTW9kYWw6IEZDPFByb3BzPiA9ICh7XG4gIGluZGV4TWV0aG9kLFxuICB2YWx1ZSxcbiAgaXNTaG93LFxuICBvbkhpZGUsXG4gIG9uU2F2ZSxcbn0pID0+IHtcbiAgY29uc3QgcmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBkb2NMaW5rID0gdXNlRG9jTGluaygpXG4gIGNvbnN0IFtyZXRyaWV2YWxDb25maWcsIHNldFJldHJpZXZhbENvbmZpZ10gPSB1c2VTdGF0ZSh2YWx1ZSlcbiAgY29uc3QgZW1iZWRkaW5nTW9kZWwgPSB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5kYXRhc2V0Py5lbWJlZGRpbmdfbW9kZWwpXG4gIGNvbnN0IGVtYmVkZGluZ01vZGVsUHJvdmlkZXIgPSB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5kYXRhc2V0Py5lbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXIpXG5cbiAgLy8gdXNlQ2xpY2tBd2F5KCgpID0+IHtcbiAgLy8gICBpZiAocmVmKVxuICAvLyAgICAgb25IaWRlKClcbiAgLy8gfSwgcmVmKVxuXG4gIGNvbnN0IHsgZGF0YTogZW1iZWRkaW5nTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS50ZXh0RW1iZWRkaW5nKVxuICBjb25zdCB7IGRhdGE6IHJlcmFua01vZGVsTGlzdCB9ID0gdXNlTW9kZWxMaXN0KE1vZGVsVHlwZUVudW0ucmVyYW5rKVxuXG4gIGNvbnN0IGhhbmRsZVNhdmUgPSAoKSA9PiB7XG4gICAgaWYgKFxuICAgICAgIWlzUmVSYW5rTW9kZWxTZWxlY3RlZCh7XG4gICAgICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnLFxuICAgICAgICBpbmRleE1ldGhvZCxcbiAgICAgIH0pXG4gICAgKSB7XG4gICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdkYXRhc2V0Q29uZmlnLnJlcmFua01vZGVsUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgb25TYXZlKHJldHJpZXZhbENvbmZpZylcbiAgfVxuXG4gIGNvbnN0IHNob3dNdWx0aU1vZGFsVGlwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGNoZWNrU2hvd011bHRpTW9kYWxUaXAoe1xuICAgICAgZW1iZWRkaW5nTW9kZWw6IHtcbiAgICAgICAgcHJvdmlkZXI6IGVtYmVkZGluZ01vZGVsUHJvdmlkZXIgPz8gJycsXG4gICAgICAgIG1vZGVsOiBlbWJlZGRpbmdNb2RlbCA/PyAnJyxcbiAgICAgIH0sXG4gICAgICByZXJhbmtpbmdFbmFibGU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLFxuICAgICAgcmVyYW5rTW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nUHJvdmlkZXJOYW1lOiByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICByZXJhbmtpbmdNb2RlbE5hbWU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX21vZGVsX25hbWUsXG4gICAgICB9LFxuICAgICAgaW5kZXhNZXRob2Q6IGluZGV4TWV0aG9kIGFzIEluZGV4aW5nVHlwZSxcbiAgICAgIGVtYmVkZGluZ01vZGVsTGlzdCxcbiAgICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICB9KVxuICB9LCBbZW1iZWRkaW5nTW9kZWxQcm92aWRlciwgZW1iZWRkaW5nTW9kZWwsIHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLCByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLCBpbmRleE1ldGhvZCwgZW1iZWRkaW5nTW9kZWxMaXN0LCByZXJhbmtNb2RlbExpc3RdKVxuXG4gIGlmICghaXNTaG93KVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBmbGV4LWNvbCByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3ctMnhsIHNoYWRvdy1zaGFkb3ctc2hhZG93LTlcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDB2aCAtIDcycHgpJyxcbiAgICAgIH19XG4gICAgICByZWY9e3JlZn1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTUgZmxleCBzaHJpbmstMCBqdXN0aWZ5LWJldHdlZW4gcHgtMyBwYi0xIHB0LTMuNVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtYmFzZSBmb250LXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgPGRpdj57dCgnZm9ybS5yZXRyaWV2YWxTZXR0aW5nLnRpdGxlJywgeyBuczogJ2RhdGFzZXRTZXR0aW5ncycgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbm9ybWFsIGxlYWRpbmctWzE4cHhdIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgIGhyZWY9e2RvY0xpbmsoJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvcmV0cmlldmFsLXRlc3QtYW5kLWNpdGF0aW9uI21vZGlmeS10ZXh0LXJldHJpZXZhbC1zZXR0aW5nJywge1xuICAgICAgICAgICAgICAgICd6aC1IYW5zJzogJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvcmV0cmlldmFsLXRlc3QtYW5kLWNpdGF0aW9uI+S/ruaUueaWh+acrOajgOe0ouaWueW8jycsXG4gICAgICAgICAgICAgICAgJ2phLUpQJzogJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvcmV0cmlldmFsLXRlc3QtYW5kLWNpdGF0aW9uJyxcbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtdGV4dC1hY2NlbnRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dCgnZm9ybS5yZXRyaWV2YWxTZXR0aW5nLmxlYXJuTW9yZScsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAge3QoJ2Zvcm0ucmV0cmlldmFsU2V0dGluZy5kZXNjcmlwdGlvbicsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgb25DbGljaz17b25IaWRlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggdy04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQ2xvc2VMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHB5LTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xIHRleHQtWzEzcHhdIGZvbnQtc2VtaWJvbGQgbGVhZGluZy02IHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICB7dCgnZm9ybS5yZXRyaWV2YWxTZXR0aW5nLm1ldGhvZCcsIHsgbnM6ICdkYXRhc2V0U2V0dGluZ3MnIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2luZGV4TWV0aG9kID09PSAnaGlnaF9xdWFsaXR5J1xuICAgICAgICAgID8gKFxuICAgICAgICAgICAgICA8UmV0cmlldmFsTWV0aG9kQ29uZmlnXG4gICAgICAgICAgICAgICAgdmFsdWU9e3JldHJpZXZhbENvbmZpZ31cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0UmV0cmlldmFsQ29uZmlnfVxuICAgICAgICAgICAgICAgIHNob3dNdWx0aU1vZGFsVGlwPXtzaG93TXVsdGlNb2RhbFRpcH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgPEVjb25vbWljYWxSZXRyaWV2YWxNZXRob2RDb25maWdcbiAgICAgICAgICAgICAgICB2YWx1ZT17cmV0cmlldmFsQ29uZmlnfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRSZXRyaWV2YWxDb25maWd9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1lbmQgcC00IHB0LTJcIj5cbiAgICAgICAgPEJ1dHRvbiBjbGFzc05hbWU9XCJtci0yIHNocmluay0wXCIgb25DbGljaz17b25IaWRlfT57dCgnb3BlcmF0aW9uLmNhbmNlbCcsIHsgbnM6ICdjb21tb24nIH0pfTwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJwcmltYXJ5XCIgY2xhc3NOYW1lPVwic2hyaW5rLTBcIiBvbkNsaWNrPXtoYW5kbGVTYXZlfT57dCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX08L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKE1vZGlmeVJldHJpZXZhbE1vZGFsKVxuIl19