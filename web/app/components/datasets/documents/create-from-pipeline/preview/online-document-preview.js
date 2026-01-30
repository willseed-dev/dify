"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const common_1 = require("@/app/components/base/icons/src/public/common");
const markdown_1 = require("@/app/components/base/markdown");
const toast_1 = require("@/app/components/base/toast");
const dataset_detail_1 = require("@/context/dataset-detail");
const use_pipeline_1 = require("@/service/use-pipeline");
const format_1 = require("@/utils/format");
const store_1 = require("../data-source/store");
const loading_1 = require("./loading");
const OnlineDocumentPreview = ({ currentPage, datasourceNodeId, hidePreview, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [content, setContent] = (0, react_2.useState)('');
    const pipelineId = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(state => state.dataset?.pipeline_id);
    const { mutateAsync: getOnlineDocumentContent, isPending } = (0, use_pipeline_1.usePreviewOnlineDocument)();
    const dataSourceStore = (0, store_1.useDataSourceStore)();
    (0, react_2.useEffect)(() => {
        const { currentCredentialId } = dataSourceStore.getState();
        getOnlineDocumentContent({
            workspaceID: currentPage.workspace_id,
            pageID: currentPage.page_id,
            pageType: currentPage.type,
            pipelineId: pipelineId || '',
            datasourceNodeId,
            credentialId: currentCredentialId,
        }, {
            onSuccess(data) {
                setContent(data.content);
            },
            onError(error) {
                toast_1.default.notify({
                    type: 'error',
                    message: error.message,
                });
            },
        });
    }, [currentPage.page_id]);
    return (<div className="flex h-full w-full flex-col rounded-t-xl border-l border-t border-components-panel-border bg-background-default-lighter shadow-md shadow-shadow-shadow-5">
      <div className="flex gap-x-2 border-b border-divider-subtle pb-3 pl-6 pr-4 pt-4">
        <div className="flex grow flex-col gap-y-1">
          <div className="system-2xs-semibold-uppercase text-text-accent">{t('addDocuments.stepOne.preview', { ns: 'datasetPipeline' })}</div>
          <div className="title-md-semi-bold text-tex-primary">{currentPage?.page_name}</div>
          <div className="system-xs-medium flex items-center gap-x-1 text-text-tertiary">
            <common_1.Notion className="size-3.5"/>
            <span>{currentPage.type}</span>
            <span>·</span>
            <span>{`${(0, format_1.formatNumberAbbreviated)(content.length)} ${t('addDocuments.characters', { ns: 'datasetPipeline' })}`}</span>
          </div>
        </div>
        <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center" onClick={hidePreview}>
          <react_1.RiCloseLine className="size-[18px]"/>
        </button>
      </div>
      {isPending && (<div className="grow">
          <loading_1.default />
        </div>)}
      {!isPending && content && (<div className="body-md-regular grow overflow-hidden px-6 py-5 text-text-secondary">
          <markdown_1.Markdown content={content}/>
        </div>)}
    </div>);
};
exports.default = OnlineDocumentPreview;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25saW5lLWRvY3VtZW50LXByZXZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvbmxpbmUtZG9jdW1lbnQtcHJldmlldy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FBOEM7QUFDOUMsK0JBQThCO0FBQzlCLGlDQUEyQztBQUMzQyxpREFBOEM7QUFDOUMsMEVBQXNFO0FBQ3RFLDZEQUF5RDtBQUN6RCx1REFBK0M7QUFDL0MsNkRBQThFO0FBQzlFLHlEQUFpRTtBQUNqRSwyQ0FBd0Q7QUFDeEQsZ0RBQXlEO0FBQ3pELHVDQUErQjtBQVEvQixNQUFNLHFCQUFxQixHQUFHLENBQUMsRUFDN0IsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixXQUFXLEdBQ2dCLEVBQUUsRUFBRTtJQUMvQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDMUMsTUFBTSxVQUFVLEdBQUcsSUFBQSxvREFBbUMsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDM0YsTUFBTSxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVDQUF3QixHQUFFLENBQUE7SUFDdkYsTUFBTSxlQUFlLEdBQUcsSUFBQSwwQkFBa0IsR0FBRSxDQUFBO0lBRTVDLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDMUQsd0JBQXdCLENBQUM7WUFDdkIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxZQUFZO1lBQ3JDLE1BQU0sRUFBRSxXQUFXLENBQUMsT0FBTztZQUMzQixRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUk7WUFDMUIsVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO1lBQzVCLGdCQUFnQjtZQUNoQixZQUFZLEVBQUUsbUJBQW1CO1NBQ2xDLEVBQUU7WUFDRCxTQUFTLENBQUMsSUFBSTtnQkFDWixVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzFCLENBQUM7WUFDRCxPQUFPLENBQUMsS0FBSztnQkFDWCxlQUFLLENBQUMsTUFBTSxDQUFDO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztpQkFDdkIsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXpCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEpBQTBKLENBQ3ZLO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlFQUFpRSxDQUM5RTtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FDekM7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNuSTtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsRUFBRSxHQUFHLENBQ2xGO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLCtEQUErRCxDQUM1RTtZQUFBLENBQUMsZUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQzVCO1lBQUEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUM5QjtZQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQ2I7WUFBQSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBQSxnQ0FBdUIsRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUN2SDtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyxtREFBbUQsQ0FDN0QsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBRXJCO1VBQUEsQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQ3RDO1FBQUEsRUFBRSxNQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsU0FBUyxJQUFJLENBQ1osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkI7VUFBQSxDQUFDLGlCQUFPLENBQUMsQUFBRCxFQUNWO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNEO01BQUEsQ0FBQyxDQUFDLFNBQVMsSUFBSSxPQUFPLElBQUksQ0FDeEIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9FQUFvRSxDQUNqRjtVQUFBLENBQUMsbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFDN0I7UUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxxQkFBcUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBOb3Rpb25QYWdlIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHsgUmlDbG9zZUxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBOb3Rpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3B1YmxpYy9jb21tb24nXG5pbXBvcnQgeyBNYXJrZG93biB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9tYXJrZG93bidcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvciB9IGZyb20gJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCdcbmltcG9ydCB7IHVzZVByZXZpZXdPbmxpbmVEb2N1bWVudCB9IGZyb20gJ0Avc2VydmljZS91c2UtcGlwZWxpbmUnXG5pbXBvcnQgeyBmb3JtYXROdW1iZXJBYmJyZXZpYXRlZCB9IGZyb20gJ0AvdXRpbHMvZm9ybWF0J1xuaW1wb3J0IHsgdXNlRGF0YVNvdXJjZVN0b3JlIH0gZnJvbSAnLi4vZGF0YS1zb3VyY2Uvc3RvcmUnXG5pbXBvcnQgTG9hZGluZyBmcm9tICcuL2xvYWRpbmcnXG5cbnR5cGUgT25saW5lRG9jdW1lbnRQcmV2aWV3UHJvcHMgPSB7XG4gIGN1cnJlbnRQYWdlOiBOb3Rpb25QYWdlXG4gIGRhdGFzb3VyY2VOb2RlSWQ6IHN0cmluZ1xuICBoaWRlUHJldmlldzogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBPbmxpbmVEb2N1bWVudFByZXZpZXcgPSAoe1xuICBjdXJyZW50UGFnZSxcbiAgZGF0YXNvdXJjZU5vZGVJZCxcbiAgaGlkZVByZXZpZXcsXG59OiBPbmxpbmVEb2N1bWVudFByZXZpZXdQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgW2NvbnRlbnQsIHNldENvbnRlbnRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IHBpcGVsaW5lSWQgPSB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcihzdGF0ZSA9PiBzdGF0ZS5kYXRhc2V0Py5waXBlbGluZV9pZClcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZ2V0T25saW5lRG9jdW1lbnRDb250ZW50LCBpc1BlbmRpbmcgfSA9IHVzZVByZXZpZXdPbmxpbmVEb2N1bWVudCgpXG4gIGNvbnN0IGRhdGFTb3VyY2VTdG9yZSA9IHVzZURhdGFTb3VyY2VTdG9yZSgpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB7IGN1cnJlbnRDcmVkZW50aWFsSWQgfSA9IGRhdGFTb3VyY2VTdG9yZS5nZXRTdGF0ZSgpXG4gICAgZ2V0T25saW5lRG9jdW1lbnRDb250ZW50KHtcbiAgICAgIHdvcmtzcGFjZUlEOiBjdXJyZW50UGFnZS53b3Jrc3BhY2VfaWQsXG4gICAgICBwYWdlSUQ6IGN1cnJlbnRQYWdlLnBhZ2VfaWQsXG4gICAgICBwYWdlVHlwZTogY3VycmVudFBhZ2UudHlwZSxcbiAgICAgIHBpcGVsaW5lSWQ6IHBpcGVsaW5lSWQgfHwgJycsXG4gICAgICBkYXRhc291cmNlTm9kZUlkLFxuICAgICAgY3JlZGVudGlhbElkOiBjdXJyZW50Q3JlZGVudGlhbElkLFxuICAgIH0sIHtcbiAgICAgIG9uU3VjY2VzcyhkYXRhKSB7XG4gICAgICAgIHNldENvbnRlbnQoZGF0YS5jb250ZW50KVxuICAgICAgfSxcbiAgICAgIG9uRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtjdXJyZW50UGFnZS5wYWdlX2lkXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgdy1mdWxsIGZsZXgtY29sIHJvdW5kZWQtdC14bCBib3JkZXItbCBib3JkZXItdCBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctYmFja2dyb3VuZC1kZWZhdWx0LWxpZ2h0ZXIgc2hhZG93LW1kIHNoYWRvdy1zaGFkb3ctc2hhZG93LTVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAteC0yIGJvcmRlci1iIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBwYi0zIHBsLTYgcHItNCBwdC00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sIGdhcC15LTFcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS0yeHMtc2VtaWJvbGQtdXBwZXJjYXNlIHRleHQtdGV4dC1hY2NlbnRcIj57dCgnYWRkRG9jdW1lbnRzLnN0ZXBPbmUucHJldmlldycsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGUtbWQtc2VtaS1ib2xkIHRleHQtdGV4LXByaW1hcnlcIj57Y3VycmVudFBhZ2U/LnBhZ2VfbmFtZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLXgtMSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIDxOb3Rpb24gY2xhc3NOYW1lPVwic2l6ZS0zLjVcIiAvPlxuICAgICAgICAgICAgPHNwYW4+e2N1cnJlbnRQYWdlLnR5cGV9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+wrc8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj57YCR7Zm9ybWF0TnVtYmVyQWJicmV2aWF0ZWQoY29udGVudC5sZW5ndGgpfSAke3QoJ2FkZERvY3VtZW50cy5jaGFyYWN0ZXJzJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9YH08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggdy04IHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgb25DbGljaz17aGlkZVByZXZpZXd9XG4gICAgICAgID5cbiAgICAgICAgICA8UmlDbG9zZUxpbmUgY2xhc3NOYW1lPVwic2l6ZS1bMThweF1cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAge2lzUGVuZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgIDxMb2FkaW5nIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHshaXNQZW5kaW5nICYmIGNvbnRlbnQgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvZHktbWQtcmVndWxhciBncm93IG92ZXJmbG93LWhpZGRlbiBweC02IHB5LTUgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIDxNYXJrZG93biBjb250ZW50PXtjb250ZW50fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgT25saW5lRG9jdW1lbnRQcmV2aWV3XG4iXX0=