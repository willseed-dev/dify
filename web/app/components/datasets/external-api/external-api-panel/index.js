"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
const button_1 = require("@/app/components/base/button");
const loading_1 = require("@/app/components/base/loading");
const external_knowledge_api_context_1 = require("@/context/external-knowledge-api-context");
const i18n_1 = require("@/context/i18n");
const modal_context_1 = require("@/context/modal-context");
const classnames_1 = require("@/utils/classnames");
const external_knowledge_api_card_1 = require("../external-knowledge-api-card");
const ExternalAPIPanel = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    const { setShowExternalKnowledgeAPIModal } = (0, modal_context_1.useModalContext)();
    const { externalKnowledgeApiList, mutateExternalKnowledgeApis, isLoading } = (0, external_knowledge_api_context_1.useExternalKnowledgeApi)();
    const handleOpenExternalAPIModal = () => {
        setShowExternalKnowledgeAPIModal({
            payload: { name: '', settings: { endpoint: '', api_key: '' } },
            datasetBindings: [],
            onSaveCallback: () => {
                mutateExternalKnowledgeApis();
            },
            onCancelCallback: () => {
                mutateExternalKnowledgeApis();
            },
            isEditMode: false,
        });
    };
    return (<div tabIndex={-1} className={(0, classnames_1.cn)('absolute bottom-2 right-0 top-14 z-10 flex outline-none')}>
      <div className={(0, classnames_1.cn)('relative flex h-full w-[420px] flex-col rounded-l-2xl border border-components-panel-border bg-components-panel-bg-alt')}>
        <div className="flex items-start self-stretch p-4 pb-0">
          <div className="flex grow flex-col items-start gap-1">
            <div className="system-xl-semibold self-stretch text-text-primary">{t('externalAPIPanelTitle', { ns: 'dataset' })}</div>
            <div className="body-xs-regular self-stretch text-text-tertiary">{t('externalAPIPanelDescription', { ns: 'dataset' })}</div>
            <a className="flex cursor-pointer items-center justify-center gap-1 self-stretch" href={docLink('/guides/knowledge-base/connect-external-knowledge-base')} target="_blank">
              <react_1.RiBookOpenLine className="h-3 w-3 text-text-accent"/>
              <div className="body-xs-regular grow text-text-accent">{t('externalAPIPanelDocumentation', { ns: 'dataset' })}</div>
            </a>
          </div>
          <div className="flex items-center">
            <action_button_1.default onClick={() => onClose()}>
              <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
            </action_button_1.default>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 self-stretch px-4 py-3">
          <button_1.default variant="primary" className="flex items-center justify-center gap-0.5 px-3 py-2" onClick={handleOpenExternalAPIModal}>
            <react_1.RiAddLine className="h-4 w-4 text-components-button-primary-text"/>
            <div className="system-sm-medium text-components-button-primary-text">{t('createExternalAPI', { ns: 'dataset' })}</div>
          </button_1.default>
        </div>
        <div className="flex grow flex-col items-start gap-1 self-stretch px-4 py-0">
          {isLoading
            ? (<loading_1.default />)
            : (externalKnowledgeApiList.map(api => (<external_knowledge_api_card_1.default key={api.id} api={api}/>)))}
        </div>
      </div>
    </div>);
};
exports.default = ExternalAPIPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FJeUI7QUFDekIsK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5Qyx1RUFBOEQ7QUFDOUQseURBQWlEO0FBQ2pELDJEQUFtRDtBQUNuRCw2RkFBa0Y7QUFDbEYseUNBQTJDO0FBQzNDLDJEQUF5RDtBQUN6RCxtREFBdUM7QUFDdkMsZ0ZBQXFFO0FBTXJFLE1BQU0sZ0JBQWdCLEdBQW9DLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO0lBQ3hFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFVLEdBQUUsQ0FBQTtJQUM1QixNQUFNLEVBQUUsZ0NBQWdDLEVBQUUsR0FBRyxJQUFBLCtCQUFlLEdBQUUsQ0FBQTtJQUM5RCxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsMkJBQTJCLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSx3REFBdUIsR0FBRSxDQUFBO0lBRXRHLE1BQU0sMEJBQTBCLEdBQUcsR0FBRyxFQUFFO1FBQ3RDLGdDQUFnQyxDQUFDO1lBQy9CLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUU7WUFDOUQsZUFBZSxFQUFFLEVBQUU7WUFDbkIsY0FBYyxFQUFFLEdBQUcsRUFBRTtnQkFDbkIsMkJBQTJCLEVBQUUsQ0FBQTtZQUMvQixDQUFDO1lBQ0QsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO2dCQUNyQiwyQkFBMkIsRUFBRSxDQUFBO1lBQy9CLENBQUM7WUFDRCxVQUFVLEVBQUUsS0FBSztTQUNsQixDQUFDLENBQUE7SUFDSixDQUFDLENBQUE7SUFFRCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsUUFBUSxD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ICBSaUJvb2tPcGVuTGluZSxcbiAgUmlDbG9zZUxpbmUsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgTG9hZGluZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9hZGluZydcbmltcG9ydCB7IHVzZUV4dGVybmFsS25vd2xlZGdlQXBpIH0gZnJvbSAnQC9jb250ZXh0L2V4dGVybmFsLWtub3dsZWRnZS1hcGktY29udGV4dCdcbmltcG9ydCB7IHVzZURvY0xpbmsgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcbmltcG9ydCB7IHVzZU1vZGFsQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgRXh0ZXJuYWxLbm93bGVkZ2VBUElDYXJkIGZyb20gJy4uL2V4dGVybmFsLWtub3dsZWRnZS1hcGktY2FyZCdcblxudHlwZSBFeHRlcm5hbEFQSVBhbmVsUHJvcHMgPSB7XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgRXh0ZXJuYWxBUElQYW5lbDogUmVhY3QuRkM8RXh0ZXJuYWxBUElQYW5lbFByb3BzPiA9ICh7IG9uQ2xvc2UgfSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZG9jTGluayA9IHVzZURvY0xpbmsoKVxuICBjb25zdCB7IHNldFNob3dFeHRlcm5hbEtub3dsZWRnZUFQSU1vZGFsIH0gPSB1c2VNb2RhbENvbnRleHQoKVxuICBjb25zdCB7IGV4dGVybmFsS25vd2xlZGdlQXBpTGlzdCwgbXV0YXRlRXh0ZXJuYWxLbm93bGVkZ2VBcGlzLCBpc0xvYWRpbmcgfSA9IHVzZUV4dGVybmFsS25vd2xlZGdlQXBpKClcblxuICBjb25zdCBoYW5kbGVPcGVuRXh0ZXJuYWxBUElNb2RhbCA9ICgpID0+IHtcbiAgICBzZXRTaG93RXh0ZXJuYWxLbm93bGVkZ2VBUElNb2RhbCh7XG4gICAgICBwYXlsb2FkOiB7IG5hbWU6ICcnLCBzZXR0aW5nczogeyBlbmRwb2ludDogJycsIGFwaV9rZXk6ICcnIH0gfSxcbiAgICAgIGRhdGFzZXRCaW5kaW5nczogW10sXG4gICAgICBvblNhdmVDYWxsYmFjazogKCkgPT4ge1xuICAgICAgICBtdXRhdGVFeHRlcm5hbEtub3dsZWRnZUFwaXMoKVxuICAgICAgfSxcbiAgICAgIG9uQ2FuY2VsQ2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgbXV0YXRlRXh0ZXJuYWxLbm93bGVkZ2VBcGlzKClcbiAgICAgIH0sXG4gICAgICBpc0VkaXRNb2RlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICB0YWJJbmRleD17LTF9XG4gICAgICBjbGFzc05hbWU9e2NuKCdhYnNvbHV0ZSBib3R0b20tMiByaWdodC0wIHRvcC0xNCB6LTEwIGZsZXggb3V0bGluZS1ub25lJyl9XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICdyZWxhdGl2ZSBmbGV4IGgtZnVsbCB3LVs0MjBweF0gZmxleC1jb2wgcm91bmRlZC1sLTJ4bCBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYWx0JyxcbiAgICAgICAgKX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IHNlbGYtc3RyZXRjaCBwLTQgcGItMFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGdhcC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14bC1zZW1pYm9sZCBzZWxmLXN0cmV0Y2ggdGV4dC10ZXh0LXByaW1hcnlcIj57dCgnZXh0ZXJuYWxBUElQYW5lbFRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2R5LXhzLXJlZ3VsYXIgc2VsZi1zdHJldGNoIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCdleHRlcm5hbEFQSVBhbmVsRGVzY3JpcHRpb24nLCB7IG5zOiAnZGF0YXNldCcgfSl9PC9kaXY+XG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMSBzZWxmLXN0cmV0Y2hcIlxuICAgICAgICAgICAgICBocmVmPXtkb2NMaW5rKCcvZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2Nvbm5lY3QtZXh0ZXJuYWwta25vd2xlZGdlLWJhc2UnKX1cbiAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFJpQm9va09wZW5MaW5lIGNsYXNzTmFtZT1cImgtMyB3LTMgdGV4dC10ZXh0LWFjY2VudFwiIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9keS14cy1yZWd1bGFyIGdyb3cgdGV4dC10ZXh0LWFjY2VudFwiPnt0KCdleHRlcm5hbEFQSVBhbmVsRG9jdW1lbnRhdGlvbicsIHsgbnM6ICdkYXRhc2V0JyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICA8QWN0aW9uQnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uQ2xvc2UoKX0+XG4gICAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBqdXN0aWZ5LWNlbnRlciBnYXAtMiBzZWxmLXN0cmV0Y2ggcHgtNCBweS0zXCI+XG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTAuNSBweC0zIHB5LTJcIlxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT3BlbkV4dGVybmFsQVBJTW9kYWx9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQWRkTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtY29tcG9uZW50cy1idXR0b24tcHJpbWFyeS10ZXh0XCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXByaW1hcnktdGV4dFwiPnt0KCdjcmVhdGVFeHRlcm5hbEFQSScsIHsgbnM6ICdkYXRhc2V0JyB9KX08L2Rpdj5cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGdhcC0xIHNlbGYtc3RyZXRjaCBweC00IHB5LTBcIj5cbiAgICAgICAgICB7aXNMb2FkaW5nXG4gICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICA8TG9hZGluZyAvPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICBleHRlcm5hbEtub3dsZWRnZUFwaUxpc3QubWFwKGFwaSA9PiAoXG4gICAgICAgICAgICAgICAgICA8RXh0ZXJuYWxLbm93bGVkZ2VBUElDYXJkIGtleT17YXBpLmlkfSBhcGk9e2FwaX0gLz5cbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV4dGVybmFsQVBJUGFuZWxcbiJdfQ==