"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
const confirm_1 = require("@/app/components/base/confirm");
const development_1 = require("@/app/components/base/icons/src/vender/solid/development");
const external_knowledge_api_context_1 = require("@/context/external-knowledge-api-context");
const modal_context_1 = require("@/context/modal-context");
const datasets_1 = require("@/service/datasets");
const ExternalKnowledgeAPICard = ({ api }) => {
    const { setShowExternalKnowledgeAPIModal } = (0, modal_context_1.useModalContext)();
    const [showConfirm, setShowConfirm] = (0, react_2.useState)(false);
    const [isHovered, setIsHovered] = (0, react_2.useState)(false);
    const [usageCount, setUsageCount] = (0, react_2.useState)(0);
    const { mutateExternalKnowledgeApis } = (0, external_knowledge_api_context_1.useExternalKnowledgeApi)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleEditClick = async () => {
        try {
            const response = await (0, datasets_1.fetchExternalAPI)({ apiTemplateId: api.id });
            const formValue = {
                name: response.name,
                settings: {
                    endpoint: response.settings.endpoint,
                    api_key: response.settings.api_key,
                },
            };
            setShowExternalKnowledgeAPIModal({
                payload: formValue,
                onSaveCallback: () => {
                    mutateExternalKnowledgeApis();
                },
                onCancelCallback: () => {
                    mutateExternalKnowledgeApis();
                },
                isEditMode: true,
                datasetBindings: response.dataset_bindings,
                onEditCallback: async (updatedData) => {
                    try {
                        await (0, datasets_1.updateExternalAPI)({
                            apiTemplateId: api.id,
                            body: {
                                ...response,
                                name: updatedData.name,
                                settings: {
                                    ...response.settings,
                                    endpoint: updatedData.settings.endpoint,
                                    api_key: updatedData.settings.api_key,
                                },
                            },
                        });
                        mutateExternalKnowledgeApis();
                    }
                    catch (error) {
                        console.error('Error updating external knowledge API:', error);
                    }
                },
            });
        }
        catch (error) {
            console.error('Error fetching external knowledge API data:', error);
        }
    };
    const handleDeleteClick = async () => {
        try {
            const usage = await (0, datasets_1.checkUsageExternalAPI)({ apiTemplateId: api.id });
            if (usage.is_using)
                setUsageCount(usage.count);
            setShowConfirm(true);
        }
        catch (error) {
            console.error('Error checking external API usage:', error);
        }
    };
    const handleConfirmDelete = async () => {
        try {
            const response = await (0, datasets_1.deleteExternalAPI)({ apiTemplateId: api.id });
            if (response && response.result === 'success') {
                setShowConfirm(false);
                mutateExternalKnowledgeApis();
            }
            else {
                console.error('Failed to delete external API');
            }
        }
        catch (error) {
            console.error('Error deleting external knowledge API:', error);
        }
    };
    return (<>
      <div className={`shadows-shadow-xs flex items-start self-stretch rounded-lg border-[0.5px] border-components-panel-border-subtle
        bg-components-panel-on-panel-item-bg p-2
        pl-3 ${isHovered ? 'border-state-destructive-border bg-state-destructive-hover' : ''}`}>
        <div className="flex grow flex-col items-start justify-center gap-1.5 py-1">
          <div className="flex items-center gap-1 self-stretch text-text-secondary">
            <development_1.ApiConnectionMod className="h-4 w-4"/>
            <div className="system-sm-medium">{api.name}</div>
          </div>
          <div className="system-xs-regular self-stretch text-text-tertiary">{api.settings.endpoint}</div>
        </div>
        <div className="flex items-start gap-1">
          <action_button_1.default onClick={handleEditClick}>
            <react_1.RiEditLine className="h-4 w-4 text-text-tertiary hover:text-text-secondary"/>
          </action_button_1.default>
          <action_button_1.default className="hover:bg-state-destructive-hover" onClick={handleDeleteClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <react_1.RiDeleteBinLine className="h-4 w-4 text-text-tertiary hover:text-text-destructive"/>
          </action_button_1.default>
        </div>
      </div>
      {showConfirm && (<confirm_1.default isShow={showConfirm} title={`${t('deleteExternalAPIConfirmWarningContent.title.front', { ns: 'dataset' })} ${api.name}${t('deleteExternalAPIConfirmWarningContent.title.end', { ns: 'dataset' })}`} content={usageCount > 0
                ? `${t('deleteExternalAPIConfirmWarningContent.content.front', { ns: 'dataset' })} ${usageCount} ${t('deleteExternalAPIConfirmWarningContent.content.end', { ns: 'dataset' })}`
                : t('deleteExternalAPIConfirmWarningContent.noConnectionContent', { ns: 'dataset' })} type="warning" onConfirm={handleConfirmDelete} onCancel={() => setShowConfirm(false)}/>)}
    </>);
};
exports.default = ExternalKnowledgeAPICard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FHeUI7QUFDekIsK0JBQThCO0FBQzlCLGlDQUFnQztBQUNoQyxpREFBOEM7QUFDOUMsdUVBQThEO0FBQzlELDJEQUFtRDtBQUNuRCwwRkFBMkY7QUFDM0YsNkZBQWtGO0FBQ2xGLDJEQUF5RDtBQUN6RCxpREFBa0g7QUFNbEgsTUFBTSx3QkFBd0IsR0FBNEMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDcEYsTUFBTSxFQUFFLGdDQUFnQyxFQUFFLEdBQUcsSUFBQSwrQkFBZSxHQUFFLENBQUE7SUFDOUQsTUFBTSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDckQsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDakQsTUFBTSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDL0MsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsSUFBQSx3REFBdUIsR0FBRSxDQUFBO0lBRWpFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLGVBQWUsR0FBRyxLQUFLLElBQUksRUFBRTtRQUNqQyxJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsMkJBQWdCLEVBQUMsRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDbEUsTUFBTSxTQUFTLEdBQXlCO2dCQUN0QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FB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QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9EQUFvRCxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsa0RBQWtELEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQzlLLE9BQU8sQ0FBQyxDQUNOLFVBQVUsR0FBRyxDQUFDO2dCQUNaLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxzREFBc0QsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsb0RBQW9ELEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRTtnQkFDL0ssQ0FBQyxDQUFDLENBQUMsQ0FBQyw0REFBNEQsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FDdkYsQ0FBQyxDQUNELElBQUksQ0FBQyxTQUFTLENBQ2QsU0FBUyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FDL0IsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ3RDLENBQ0gsQ0FDSDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsd0JBQXdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENyZWF0ZUV4dGVybmFsQVBJUmVxIH0gZnJvbSAnLi4vZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBFeHRlcm5hbEFQSUl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7XG4gIFJpRGVsZXRlQmluTGluZSxcbiAgUmlFZGl0TGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5pbXBvcnQgQ29uZmlybSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY29uZmlybSdcbmltcG9ydCB7IEFwaUNvbm5lY3Rpb25Nb2QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9kZXZlbG9wbWVudCdcbmltcG9ydCB7IHVzZUV4dGVybmFsS25vd2xlZGdlQXBpIH0gZnJvbSAnQC9jb250ZXh0L2V4dGVybmFsLWtub3dsZWRnZS1hcGktY29udGV4dCdcbmltcG9ydCB7IHVzZU1vZGFsQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0J1xuaW1wb3J0IHsgY2hlY2tVc2FnZUV4dGVybmFsQVBJLCBkZWxldGVFeHRlcm5hbEFQSSwgZmV0Y2hFeHRlcm5hbEFQSSwgdXBkYXRlRXh0ZXJuYWxBUEkgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5cbnR5cGUgRXh0ZXJuYWxLbm93bGVkZ2VBUElDYXJkUHJvcHMgPSB7XG4gIGFwaTogRXh0ZXJuYWxBUElJdGVtXG59XG5cbmNvbnN0IEV4dGVybmFsS25vd2xlZGdlQVBJQ2FyZDogUmVhY3QuRkM8RXh0ZXJuYWxLbm93bGVkZ2VBUElDYXJkUHJvcHM+ID0gKHsgYXBpIH0pID0+IHtcbiAgY29uc3QgeyBzZXRTaG93RXh0ZXJuYWxLbm93bGVkZ2VBUElNb2RhbCB9ID0gdXNlTW9kYWxDb250ZXh0KClcbiAgY29uc3QgW3Nob3dDb25maXJtLCBzZXRTaG93Q29uZmlybV0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW2lzSG92ZXJlZCwgc2V0SXNIb3ZlcmVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbdXNhZ2VDb3VudCwgc2V0VXNhZ2VDb3VudF0gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCB7IG11dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpcyB9ID0gdXNlRXh0ZXJuYWxLbm93bGVkZ2VBcGkoKVxuXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IGhhbmRsZUVkaXRDbGljayA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaEV4dGVybmFsQVBJKHsgYXBpVGVtcGxhdGVJZDogYXBpLmlkIH0pXG4gICAgICBjb25zdCBmb3JtVmFsdWU6IENyZWF0ZUV4dGVybmFsQVBJUmVxID0ge1xuICAgICAgICBuYW1lOiByZXNwb25zZS5uYW1lLFxuICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgIGVuZHBvaW50OiByZXNwb25zZS5zZXR0aW5ncy5lbmRwb2ludCxcbiAgICAgICAgICBhcGlfa2V5OiByZXNwb25zZS5zZXR0aW5ncy5hcGlfa2V5LFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBzZXRTaG93RXh0ZXJuYWxLbm93bGVkZ2VBUElNb2RhbCh7XG4gICAgICAgIHBheWxvYWQ6IGZvcm1WYWx1ZSxcbiAgICAgICAgb25TYXZlQ2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICBtdXRhdGVFeHRlcm5hbEtub3dsZWRnZUFwaXMoKVxuICAgICAgICB9LFxuICAgICAgICBvbkNhbmNlbENhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgbXV0YXRlRXh0ZXJuYWxLbm93bGVkZ2VBcGlzKClcbiAgICAgICAgfSxcbiAgICAgICAgaXNFZGl0TW9kZTogdHJ1ZSxcbiAgICAgICAgZGF0YXNldEJpbmRpbmdzOiByZXNwb25zZS5kYXRhc2V0X2JpbmRpbmdzLFxuICAgICAgICBvbkVkaXRDYWxsYmFjazogYXN5bmMgKHVwZGF0ZWREYXRhOiBDcmVhdGVFeHRlcm5hbEFQSVJlcSkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVFeHRlcm5hbEFQSSh7XG4gICAgICAgICAgICAgIGFwaVRlbXBsYXRlSWQ6IGFwaS5pZCxcbiAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgIC4uLnJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIG5hbWU6IHVwZGF0ZWREYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgIC4uLnJlc3BvbnNlLnNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgZW5kcG9pbnQ6IHVwZGF0ZWREYXRhLnNldHRpbmdzLmVuZHBvaW50LFxuICAgICAgICAgICAgICAgICAgYXBpX2tleTogdXBkYXRlZERhdGEuc2V0dGluZ3MuYXBpX2tleSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIG11dGF0ZUV4dGVybmFsS25vd2xlZGdlQXBpcygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgZXh0ZXJuYWwga25vd2xlZGdlIEFQSTonLCBlcnJvcilcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGV4dGVybmFsIGtub3dsZWRnZSBBUEkgZGF0YTonLCBlcnJvcilcbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVEZWxldGVDbGljayA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdXNhZ2UgPSBhd2FpdCBjaGVja1VzYWdlRXh0ZXJuYWxBUEkoeyBhcGlUZW1wbGF0ZUlkOiBhcGkuaWQgfSlcbiAgICAgIGlmICh1c2FnZS5pc191c2luZylcbiAgICAgICAgc2V0VXNhZ2VDb3VudCh1c2FnZS5jb3VudClcblxuICAgICAgc2V0U2hvd0NvbmZpcm0odHJ1ZSlcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjaGVja2luZyBleHRlcm5hbCBBUEkgdXNhZ2U6JywgZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ29uZmlybURlbGV0ZSA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkZWxldGVFeHRlcm5hbEFQSSh7IGFwaVRlbXBsYXRlSWQ6IGFwaS5pZCB9KVxuICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLnJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgIHNldFNob3dDb25maXJtKGZhbHNlKVxuICAgICAgICBtdXRhdGVFeHRlcm5hbEtub3dsZWRnZUFwaXMoKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWxldGUgZXh0ZXJuYWwgQVBJJylcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBleHRlcm5hbCBrbm93bGVkZ2UgQVBJOicsIGVycm9yKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc2hhZG93cy1zaGFkb3cteHMgZmxleCBpdGVtcy1zdGFydCBzZWxmLXN0cmV0Y2ggcm91bmRlZC1sZyBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlXG4gICAgICAgIGJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyBwLTJcbiAgICAgICAgcGwtMyAke2lzSG92ZXJlZCA/ICdib3JkZXItc3RhdGUtZGVzdHJ1Y3RpdmUtYm9yZGVyIGJnLXN0YXRlLWRlc3RydWN0aXZlLWhvdmVyJyA6ICcnfWB9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGp1c3RpZnktY2VudGVyIGdhcC0xLjUgcHktMVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgc2VsZi1zdHJldGNoIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIDxBcGlDb25uZWN0aW9uTW9kIGNsYXNzTmFtZT1cImgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tbWVkaXVtXCI+e2FwaS5uYW1lfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgc2VsZi1zdHJldGNoIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnthcGkuc2V0dGluZ3MuZW5kcG9pbnR9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTFcIj5cbiAgICAgICAgICA8QWN0aW9uQnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUVkaXRDbGlja30+XG4gICAgICAgICAgICA8UmlFZGl0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeSBob3Zlcjp0ZXh0LXRleHQtc2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgICA8QWN0aW9uQnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJob3ZlcjpiZy1zdGF0ZS1kZXN0cnVjdGl2ZS1ob3ZlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVEZWxldGVDbGlja31cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SXNIb3ZlcmVkKHRydWUpfVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiBzZXRJc0hvdmVyZWQoZmFsc2UpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaURlbGV0ZUJpbkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnkgaG92ZXI6dGV4dC10ZXh0LWRlc3RydWN0aXZlXCIgLz5cbiAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtzaG93Q29uZmlybSAmJiAoXG4gICAgICAgIDxDb25maXJtXG4gICAgICAgICAgaXNTaG93PXtzaG93Q29uZmlybX1cbiAgICAgICAgICB0aXRsZT17YCR7dCgnZGVsZXRlRXh0ZXJuYWxBUElDb25maXJtV2FybmluZ0NvbnRlbnQudGl0bGUuZnJvbnQnLCB7IG5zOiAnZGF0YXNldCcgfSl9ICR7YXBpLm5hbWV9JHt0KCdkZWxldGVFeHRlcm5hbEFQSUNvbmZpcm1XYXJuaW5nQ29udGVudC50aXRsZS5lbmQnLCB7IG5zOiAnZGF0YXNldCcgfSl9YH1cbiAgICAgICAgICBjb250ZW50PXtcbiAgICAgICAgICAgIHVzYWdlQ291bnQgPiAwXG4gICAgICAgICAgICAgID8gYCR7dCgnZGVsZXRlRXh0ZXJuYWxBUElDb25maXJtV2FybmluZ0NvbnRlbnQuY29udGVudC5mcm9udCcsIHsgbnM6ICdkYXRhc2V0JyB9KX0gJHt1c2FnZUNvdW50fSAke3QoJ2RlbGV0ZUV4dGVybmFsQVBJQ29uZmlybVdhcm5pbmdDb250ZW50LmNvbnRlbnQuZW5kJywgeyBuczogJ2RhdGFzZXQnIH0pfWBcbiAgICAgICAgICAgICAgOiB0KCdkZWxldGVFeHRlcm5hbEFQSUNvbmZpcm1XYXJuaW5nQ29udGVudC5ub0Nvbm5lY3Rpb25Db250ZW50JywgeyBuczogJ2RhdGFzZXQnIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHR5cGU9XCJ3YXJuaW5nXCJcbiAgICAgICAgICBvbkNvbmZpcm09e2hhbmRsZUNvbmZpcm1EZWxldGV9XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldFNob3dDb25maXJtKGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRXh0ZXJuYWxLbm93bGVkZ2VBUElDYXJkXG4iXX0=