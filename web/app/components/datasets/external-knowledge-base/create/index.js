"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const divider_1 = require("@/app/components/base/divider");
const i18n_1 = require("@/context/i18n");
const ExternalApiSelection_1 = require("./ExternalApiSelection");
const InfoPanel_1 = require("./InfoPanel");
const KnowledgeBaseInfo_1 = require("./KnowledgeBaseInfo");
const RetrievalSettings_1 = require("./RetrievalSettings");
const ExternalKnowledgeBaseCreate = ({ onConnect, loading }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const router = (0, navigation_1.useRouter)();
    const [formData, setFormData] = (0, react_2.useState)({
        name: '',
        description: '',
        external_knowledge_api_id: '',
        external_knowledge_id: '',
        external_retrieval_model: {
            top_k: 4,
            score_threshold: 0.5,
            score_threshold_enabled: false,
        },
        provider: 'external',
    });
    const navBackHandle = (0, react_2.useCallback)(() => {
        router.replace('/datasets');
    }, [router]);
    const handleFormChange = (newData) => {
        setFormData(newData);
    };
    const isFormValid = formData.name.trim() !== ''
        && formData.external_knowledge_api_id !== ''
        && formData.external_knowledge_id !== ''
        && formData.external_retrieval_model.top_k !== undefined
        && formData.external_retrieval_model.score_threshold !== undefined;
    return (<div className="flex grow flex-col self-stretch rounded-t-2xl border-t border-effects-highlight bg-components-panel-bg">
      <div className="flex grow justify-center self-stretch">
        <div className="flex w-full max-w-[960px] flex-col items-center px-14 py-0">
          <div className="flex w-full max-w-[640px] grow flex-col items-center gap-4 pb-8 pt-6">
            <div className="relative flex flex-col items-center gap-[2px] self-stretch py-2">
              <div className="system-xl-semibold grow self-stretch text-text-primary">{t('connectDataset', { ns: 'dataset' })}</div>
              <p className="system-sm-regular text-text-tertiary">
                <span>{t('connectHelper.helper1', { ns: 'dataset' })}</span>
                <span className="system-sm-medium text-text-secondary">{t('connectHelper.helper2', { ns: 'dataset' })}</span>
                <span>{t('connectHelper.helper3', { ns: 'dataset' })}</span>
                <a className="system-sm-regular self-stretch text-text-accent" href={docLink('/guides/knowledge-base/connect-external-knowledge-base')} target="_blank" rel="noopener noreferrer">
                  {t('connectHelper.helper4', { ns: 'dataset' })}
                </a>
                <span>
                  {t('connectHelper.helper5', { ns: 'dataset' })}
                  {' '}
                </span>
              </p>
              <button_1.default className="absolute left-[-44px] top-1 flex h-8 w-8 items-center justify-center rounded-full p-2" variant="tertiary" onClick={navBackHandle}>
                <react_1.RiArrowLeftLine className="h-4 w-4 text-text-tertiary"/>
              </button_1.default>
            </div>
            <KnowledgeBaseInfo_1.default name={formData.name} description={formData.description ?? ''} onChange={data => handleFormChange({
            ...formData,
            ...data,
        })}/>
            <divider_1.default />
            <ExternalApiSelection_1.default external_knowledge_api_id={formData.external_knowledge_api_id} external_knowledge_id={formData.external_knowledge_id} onChange={data => handleFormChange({
            ...formData,
            ...data,
        })}/>
            <RetrievalSettings_1.default topK={formData.external_retrieval_model.top_k} scoreThreshold={formData.external_retrieval_model.score_threshold} scoreThresholdEnabled={formData.external_retrieval_model.score_threshold_enabled} onChange={data => handleFormChange({
            ...formData,
            external_retrieval_model: {
                ...formData.external_retrieval_model,
                ...data,
            },
        })}/>
            <div className="flex items-center justify-end gap-2 self-stretch py-2">
              <button_1.default variant="secondary" onClick={navBackHandle}>
                <div className="system-sm-medium text-components-button-secondary-text">{t('externalKnowledgeForm.cancel', { ns: 'dataset' })}</div>
              </button_1.default>
              <button_1.default variant="primary" onClick={() => {
            onConnect(formData);
        }} disabled={!isFormValid} loading={loading}>
                <div className="system-sm-medium text-components-button-primary-text">{t('externalKnowledgeForm.connect', { ns: 'dataset' })}</div>
                <react_1.RiArrowRightLine className="h-4 w-4 text-components-button-primary-text"/>
              </button_1.default>
            </div>
          </div>
        </div>
        <InfoPanel_1.default />
      </div>
    </div>);
};
exports.default = ExternalKnowledgeBaseCreate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiw0Q0FBb0U7QUFDcEUsZ0RBQTJDO0FBQzNDLGlDQUE2QztBQUM3QyxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELDJEQUFtRDtBQUNuRCx5Q0FBMkM7QUFDM0MsaUVBQXlEO0FBQ3pELDJDQUFtQztBQUNuQywyREFBbUQ7QUFDbkQsMkRBQW1EO0FBT25ELE1BQU0sMkJBQTJCLEdBQStDLENBQUMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTtJQUN6RyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBVSxHQUFFLENBQUE7SUFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFDMUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQXlCO1FBQy9ELElBQUksRUFBRSxFQUFFO1FBQ1IsV0FBVyxFQUFFLEVBQUU7UUFDZix5QkFBeUIsRUFBRSxFQUFFO1FBQzdCLHFCQUFxQixFQUFFLEVBQUU7UUFDekIsd0JBQXdCLEVBQUU7WUFDeEIsS0FBSyxFQUFFLENBQUM7WUFDUixlQUFlLEVBQUUsR0FBRztZQUNwQix1QkFBdUIsRUFBRSxLQUFLO1NBQy9CO1FBQ0QsUUFBUSxFQUFFLFVBQVU7S0FFckIsQ0FBQyxDQUFBO0lBRUYsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzdCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFFWixNQUFNLGdCQUFnQixHQUFHLENBQUMsT0FBK0IsRUFBRSxFQUFFO1FBQzNELFdB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QUMsQ0FBQyxXQUFXLENBQUMsQ0FDdkIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBRWpCO2dCQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNsSTtnQkFBQSxDQUFDLHdCQUFnQixDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsRUFDM0U7Y0FBQSxFQUFFLGdCQUFNLENBQ1Y7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLG1CQUFTLENBQUMsQUFBRCxFQUNaO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSwyQkFBMkIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgdHlwZSB7IENyZWF0ZUtub3dsZWRnZUJhc2VSZXEgfSBmcm9tICcuL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IFJpQXJyb3dMZWZ0TGluZSwgUmlBcnJvd1JpZ2h0TGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCBEaXZpZGVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9kaXZpZGVyJ1xuaW1wb3J0IHsgdXNlRG9jTGluayB9IGZyb20gJ0AvY29udGV4dC9pMThuJ1xuaW1wb3J0IEV4dGVybmFsQXBpU2VsZWN0aW9uIGZyb20gJy4vRXh0ZXJuYWxBcGlTZWxlY3Rpb24nXG5pbXBvcnQgSW5mb1BhbmVsIGZyb20gJy4vSW5mb1BhbmVsJ1xuaW1wb3J0IEtub3dsZWRnZUJhc2VJbmZvIGZyb20gJy4vS25vd2xlZGdlQmFzZUluZm8nXG5pbXBvcnQgUmV0cmlldmFsU2V0dGluZ3MgZnJvbSAnLi9SZXRyaWV2YWxTZXR0aW5ncydcblxudHlwZSBFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGVQcm9wcyA9IHtcbiAgb25Db25uZWN0OiAoZm9ybVZhbHVlOiBDcmVhdGVLbm93bGVkZ2VCYXNlUmVxKSA9PiB2b2lkXG4gIGxvYWRpbmc6IGJvb2xlYW5cbn1cblxuY29uc3QgRXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlOiBSZWFjdC5GQzxFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGVQcm9wcz4gPSAoeyBvbkNvbm5lY3QsIGxvYWRpbmcgfSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZG9jTGluayA9IHVzZURvY0xpbmsoKVxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlPENyZWF0ZUtub3dsZWRnZUJhc2VSZXE+KHtcbiAgICBuYW1lOiAnJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgZXh0ZXJuYWxfa25vd2xlZGdlX2FwaV9pZDogJycsXG4gICAgZXh0ZXJuYWxfa25vd2xlZGdlX2lkOiAnJyxcbiAgICBleHRlcm5hbF9yZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgIHRvcF9rOiA0LFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgfSxcbiAgICBwcm92aWRlcjogJ2V4dGVybmFsJyxcblxuICB9KVxuXG4gIGNvbnN0IG5hdkJhY2tIYW5kbGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgcm91dGVyLnJlcGxhY2UoJy9kYXRhc2V0cycpXG4gIH0sIFtyb3V0ZXJdKVxuXG4gIGNvbnN0IGhhbmRsZUZvcm1DaGFuZ2UgPSAobmV3RGF0YTogQ3JlYXRlS25vd2xlZGdlQmFzZVJlcSkgPT4ge1xuICAgIHNldEZvcm1EYXRhKG5ld0RhdGEpXG4gIH1cblxuICBjb25zdCBpc0Zvcm1WYWxpZCA9IGZvcm1EYXRhLm5hbWUudHJpbSgpICE9PSAnJ1xuICAgICYmIGZvcm1EYXRhLmV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQgIT09ICcnXG4gICAgJiYgZm9ybURhdGEuZXh0ZXJuYWxfa25vd2xlZGdlX2lkICE9PSAnJ1xuICAgICYmIGZvcm1EYXRhLmV4dGVybmFsX3JldHJpZXZhbF9tb2RlbC50b3BfayAhPT0gdW5kZWZpbmVkXG4gICAgJiYgZm9ybURhdGEuZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLnNjb3JlX3RocmVzaG9sZCAhPT0gdW5kZWZpbmVkXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ3JvdyBmbGV4LWNvbCBzZWxmLXN0cmV0Y2ggcm91bmRlZC10LTJ4bCBib3JkZXItdCBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctY29tcG9uZW50cy1wYW5lbC1iZ1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cganVzdGlmeS1jZW50ZXIgc2VsZi1zdHJldGNoXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctWzk2MHB4XSBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgcHgtMTQgcHktMFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctWzY0MHB4XSBncm93IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtNCBwYi04IHB0LTZcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLVsycHhdIHNlbGYtc3RyZXRjaCBweS0yXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhsLXNlbWlib2xkIGdyb3cgc2VsZi1zdHJldGNoIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ2Nvbm5lY3REYXRhc2V0JywgeyBuczogJ2RhdGFzZXQnIH0pfTwvZGl2PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICA8c3Bhbj57dCgnY29ubmVjdEhlbHBlci5oZWxwZXIxJywgeyBuczogJ2RhdGFzZXQnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnY29ubmVjdEhlbHBlci5oZWxwZXIyJywgeyBuczogJ2RhdGFzZXQnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj57dCgnY29ubmVjdEhlbHBlci5oZWxwZXIzJywgeyBuczogJ2RhdGFzZXQnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciBzZWxmLXN0cmV0Y2ggdGV4dC10ZXh0LWFjY2VudFwiIGhyZWY9e2RvY0xpbmsoJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvY29ubmVjdC1leHRlcm5hbC1rbm93bGVkZ2UtYmFzZScpfSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCI+XG4gICAgICAgICAgICAgICAgICB7dCgnY29ubmVjdEhlbHBlci5oZWxwZXI0JywgeyBuczogJ2RhdGFzZXQnIH0pfVxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgIHt0KCdjb25uZWN0SGVscGVyLmhlbHBlcjUnLCB7IG5zOiAnZGF0YXNldCcgfSl9XG4gICAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC1bLTQ0cHhdIHRvcC0xIGZsZXggaC04IHctOCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIHAtMlwiXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cInRlcnRpYXJ5XCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtuYXZCYWNrSGFuZGxlfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFJpQXJyb3dMZWZ0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8S25vd2xlZGdlQmFzZUluZm9cbiAgICAgICAgICAgICAgbmFtZT17Zm9ybURhdGEubmFtZX1cbiAgICAgICAgICAgICAgZGVzY3JpcHRpb249e2Zvcm1EYXRhLmRlc2NyaXB0aW9uID8/ICcnfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZGF0YSA9PiBoYW5kbGVGb3JtQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAuLi5mb3JtRGF0YSxcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8RGl2aWRlciAvPlxuICAgICAgICAgICAgPEV4dGVybmFsQXBpU2VsZWN0aW9uXG4gICAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWQ9e2Zvcm1EYXRhLmV4dGVybmFsX2tub3dsZWRnZV9hcGlfaWR9XG4gICAgICAgICAgICAgIGV4dGVybmFsX2tub3dsZWRnZV9pZD17Zm9ybURhdGEuZXh0ZXJuYWxfa25vd2xlZGdlX2lkfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZGF0YSA9PiBoYW5kbGVGb3JtQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAuLi5mb3JtRGF0YSxcbiAgICAgICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8UmV0cmlldmFsU2V0dGluZ3NcbiAgICAgICAgICAgICAgdG9wSz17Zm9ybURhdGEuZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLnRvcF9rfVxuICAgICAgICAgICAgICBzY29yZVRocmVzaG9sZD17Zm9ybURhdGEuZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLnNjb3JlX3RocmVzaG9sZH1cbiAgICAgICAgICAgICAgc2NvcmVUaHJlc2hvbGRFbmFibGVkPXtmb3JtRGF0YS5leHRlcm5hbF9yZXRyaWV2YWxfbW9kZWwuc2NvcmVfdGhyZXNob2xkX2VuYWJsZWR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtkYXRhID0+IGhhbmRsZUZvcm1DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgIC4uLmZvcm1EYXRhLFxuICAgICAgICAgICAgICAgIGV4dGVybmFsX3JldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAgICAgICAgICAgLi4uZm9ybURhdGEuZXh0ZXJuYWxfcmV0cmlldmFsX21vZGVsLFxuICAgICAgICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIHNlbGYtc3RyZXRjaCBweS0yXCI+XG4gICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInNlY29uZGFyeVwiIG9uQ2xpY2s9e25hdkJhY2tIYW5kbGV9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXNlY29uZGFyeS10ZXh0XCI+e3QoJ2V4dGVybmFsS25vd2xlZGdlRm9ybS5jYW5jZWwnLCB7IG5zOiAnZGF0YXNldCcgfSl9PC9kaXY+XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIG9uQ29ubmVjdChmb3JtRGF0YSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXshaXNGb3JtVmFsaWR9XG4gICAgICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXByaW1hcnktdGV4dFwiPnt0KCdleHRlcm5hbEtub3dsZWRnZUZvcm0uY29ubmVjdCcsIHsgbnM6ICdkYXRhc2V0JyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8UmlBcnJvd1JpZ2h0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtY29tcG9uZW50cy1idXR0b24tcHJpbWFyeS10ZXh0XCIgLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxJbmZvUGFuZWwgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVybmFsS25vd2xlZGdlQmFzZUNyZWF0ZVxuIl19