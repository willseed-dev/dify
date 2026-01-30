"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const app_sidebar_1 = require("@/app/components/app-sidebar");
const store_1 = require("@/app/components/app/store");
const pipeline_1 = require("@/app/components/base/icons/src/vender/pipeline");
const loading_1 = require("@/app/components/base/loading");
const extra_info_1 = require("@/app/components/datasets/extra-info");
const app_context_1 = require("@/context/app-context");
const dataset_detail_1 = require("@/context/dataset-detail");
const event_emitter_1 = require("@/context/event-emitter");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const use_document_title_1 = require("@/hooks/use-document-title");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const classnames_1 = require("@/utils/classnames");
const DatasetDetailLayout = (props) => {
    const { children, params: { datasetId }, } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const pathname = (0, navigation_1.usePathname)();
    const hideSideBar = pathname.endsWith('documents/create') || pathname.endsWith('documents/create-from-pipeline');
    const isPipelineCanvas = pathname.endsWith('/pipeline');
    const workflowCanvasMaximize = localStorage.getItem('workflow-canvas-maximize') === 'true';
    const [hideHeader, setHideHeader] = (0, react_2.useState)(workflowCanvasMaximize);
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    eventEmitter?.useSubscription((v) => {
        if (v?.type === 'workflow-canvas-maximize')
            setHideHeader(v.payload);
    });
    const { isCurrentWorkspaceDatasetOperator } = (0, app_context_1.useAppContext)();
    const media = (0, use_breakpoints_1.default)();
    const isMobile = media === use_breakpoints_1.MediaType.mobile;
    const { data: datasetRes, error, refetch: mutateDatasetRes } = (0, use_dataset_1.useDatasetDetail)(datasetId);
    const { data: relatedApps } = (0, use_dataset_1.useDatasetRelatedApps)(datasetId);
    const isButtonDisabledWithPipeline = (0, react_2.useMemo)(() => {
        if (!datasetRes)
            return true;
        if (datasetRes.provider === 'external')
            return false;
        if (datasetRes.runtime_mode === 'general')
            return false;
        return !datasetRes.is_published;
    }, [datasetRes]);
    const navigation = (0, react_2.useMemo)(() => {
        const baseNavigation = [
            {
                name: t('datasetMenus.hitTesting', { ns: 'common' }),
                href: `/datasets/${datasetId}/hitTesting`,
                icon: react_1.RiFocus2Line,
                selectedIcon: react_1.RiFocus2Fill,
                disabled: isButtonDisabledWithPipeline,
            },
            {
                name: t('datasetMenus.settings', { ns: 'common' }),
                href: `/datasets/${datasetId}/settings`,
                icon: react_1.RiEqualizer2Line,
                selectedIcon: react_1.RiEqualizer2Fill,
                disabled: false,
            },
        ];
        if (datasetRes?.provider !== 'external') {
            baseNavigation.unshift({
                name: t('datasetMenus.pipeline', { ns: 'common' }),
                href: `/datasets/${datasetId}/pipeline`,
                icon: pipeline_1.PipelineLine,
                selectedIcon: pipeline_1.PipelineFill,
                disabled: false,
            });
            baseNavigation.unshift({
                name: t('datasetMenus.documents', { ns: 'common' }),
                href: `/datasets/${datasetId}/documents`,
                icon: react_1.RiFileTextLine,
                selectedIcon: react_1.RiFileTextFill,
                disabled: isButtonDisabledWithPipeline,
            });
        }
        return baseNavigation;
    }, [t, datasetId, isButtonDisabledWithPipeline, datasetRes?.provider]);
    (0, use_document_title_1.default)(datasetRes?.name || t('menus.datasets', { ns: 'common' }));
    const setAppSidebarExpand = (0, store_1.useStore)(state => state.setAppSidebarExpand);
    (0, react_2.useEffect)(() => {
        const localeMode = localStorage.getItem('app-detail-collapse-or-expand') || 'expand';
        const mode = isMobile ? 'collapse' : 'expand';
        setAppSidebarExpand(isMobile ? mode : localeMode);
    }, [isMobile, setAppSidebarExpand]);
    if (!datasetRes && !error)
        return <loading_1.default type="app"/>;
    return (<div className={(0, classnames_1.cn)('flex grow overflow-hidden', hideHeader && isPipelineCanvas ? '' : 'rounded-t-2xl')}>
      <dataset_detail_1.default.Provider value={{
            indexingTechnique: datasetRes?.indexing_technique,
            dataset: datasetRes,
            mutateDatasetRes,
        }}>
        {!hideSideBar && (<app_sidebar_1.default navigation={navigation} extraInfo={!isCurrentWorkspaceDatasetOperator
                ? mode => <extra_info_1.default relatedApps={relatedApps} expand={mode === 'expand'} documentCount={datasetRes?.document_count}/>
                : undefined} iconType="dataset"/>)}
        <div className="grow overflow-hidden bg-background-default-subtle">{children}</div>
      </dataset_detail_1.default.Provider>
    </div>);
};
exports.default = React.memo(DatasetDetailLayout);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYXlvdXQtbWFpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiw0Q0FPeUI7QUFDekIsZ0RBQTZDO0FBQzdDLCtCQUE4QjtBQUM5QixpQ0FBb0Q7QUFDcEQsaURBQThDO0FBQzlDLDhEQUFxRDtBQUNyRCxzREFBcUQ7QUFDckQsOEVBQTRGO0FBQzVGLDJEQUFtRDtBQUNuRCxxRUFBNEQ7QUFDNUQsdURBQXFEO0FBQ3JELDZEQUEyRDtBQUMzRCwyREFBdUU7QUFDdkUsNkRBQW1FO0FBQ25FLG1FQUF5RDtBQUN6RCxpRUFBeUY7QUFDekYsbURBQXVDO0FBT3ZDLE1BQU0sbUJBQW1CLEdBQThCLENBQUMsS0FBSyxFQUFFLEVBQUU7SUFDL0QsTUFBTSxFQUNKLFFBQVEsRUFDUixNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsR0FDdEIsR0FBRyxLQUFLLENBQUE7SUFDVCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBQSx3QkFBVyxHQUFFLENBQUE7SUFDOUIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtJQUNoSCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDdkQsTUFBTSxzQkFBc0IsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLEtBQUssTUFBTSxDQUFBO0lBQzFGLE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLHNCQUFzQixDQUFDLENBQUE7SUFDcEUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUEsNkNBQTZCLEdBQUUsQ0FB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Q3ZCLFNBQVMsQ0FBQyxDQUNSLENBQUMsaUNBQWlDO2dCQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsRUFBRztnQkFDdkgsQ0FBQyxDQUFDLFNBQ04sQ0FBQyxDQUNELFFBQVEsQ0FBQyxTQUFTLEVBQ2xCLENBQ0gsQ0FDRDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FDcEY7TUFBQSxFQUFFLHdCQUFvQixDQUFDLFFBQVEsQ0FDakM7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgUmVtaXhpY29uQ29tcG9uZW50VHlwZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBSaUVxdWFsaXplcjJGaWxsLFxuICBSaUVxdWFsaXplcjJMaW5lLFxuICBSaUZpbGVUZXh0RmlsbCxcbiAgUmlGaWxlVGV4dExpbmUsXG4gIFJpRm9jdXMyRmlsbCxcbiAgUmlGb2N1czJMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlUGF0aG5hbWUgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBcHBTaWRlQmFyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwLXNpZGViYXInXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IHsgUGlwZWxpbmVGaWxsLCBQaXBlbGluZUxpbmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9waXBlbGluZSdcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IEV4dHJhSW5mbyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2V4dHJhLWluZm8nXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IERhdGFzZXREZXRhaWxDb250ZXh0IGZyb20gJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCdcbmltcG9ydCB7IHVzZUV2ZW50RW1pdHRlckNvbnRleHRDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgdXNlQnJlYWtwb2ludHMsIHsgTWVkaWFUeXBlIH0gZnJvbSAnQC9ob29rcy91c2UtYnJlYWtwb2ludHMnXG5pbXBvcnQgdXNlRG9jdW1lbnRUaXRsZSBmcm9tICdAL2hvb2tzL3VzZS1kb2N1bWVudC10aXRsZSdcbmltcG9ydCB7IHVzZURhdGFzZXREZXRhaWwsIHVzZURhdGFzZXRSZWxhdGVkQXBwcyB9IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRhdGFzZXQnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxuZXhwb3J0IHR5cGUgSUFwcERldGFpbExheW91dFByb3BzID0ge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gIHBhcmFtczogeyBkYXRhc2V0SWQ6IHN0cmluZyB9XG59XG5cbmNvbnN0IERhdGFzZXREZXRhaWxMYXlvdXQ6IEZDPElBcHBEZXRhaWxMYXlvdXRQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3Qge1xuICAgIGNoaWxkcmVuLFxuICAgIHBhcmFtczogeyBkYXRhc2V0SWQgfSxcbiAgfSA9IHByb3BzXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBwYXRobmFtZSA9IHVzZVBhdGhuYW1lKClcbiAgY29uc3QgaGlkZVNpZGVCYXIgPSBwYXRobmFtZS5lbmRzV2l0aCgnZG9jdW1lbnRzL2NyZWF0ZScpIHx8IHBhdGhuYW1lLmVuZHNXaXRoKCdkb2N1bWVudHMvY3JlYXRlLWZyb20tcGlwZWxpbmUnKVxuICBjb25zdCBpc1BpcGVsaW5lQ2FudmFzID0gcGF0aG5hbWUuZW5kc1dpdGgoJy9waXBlbGluZScpXG4gIGNvbnN0IHdvcmtmbG93Q2FudmFzTWF4aW1pemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd29ya2Zsb3ctY2FudmFzLW1heGltaXplJykgPT09ICd0cnVlJ1xuICBjb25zdCBbaGlkZUhlYWRlciwgc2V0SGlkZUhlYWRlcl0gPSB1c2VTdGF0ZSh3b3JrZmxvd0NhbnZhc01heGltaXplKVxuICBjb25zdCB7IGV2ZW50RW1pdHRlciB9ID0gdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQoKVxuXG4gIGV2ZW50RW1pdHRlcj8udXNlU3Vic2NyaXB0aW9uKCh2OiBhbnkpID0+IHtcbiAgICBpZiAodj8udHlwZSA9PT0gJ3dvcmtmbG93LWNhbnZhcy1tYXhpbWl6ZScpXG4gICAgICBzZXRIaWRlSGVhZGVyKHYucGF5bG9hZClcbiAgfSlcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3IgfSA9IHVzZUFwcENvbnRleHQoKVxuXG4gIGNvbnN0IG1lZGlhID0gdXNlQnJlYWtwb2ludHMoKVxuICBjb25zdCBpc01vYmlsZSA9IG1lZGlhID09PSBNZWRpYVR5cGUubW9iaWxlXG5cbiAgY29uc3QgeyBkYXRhOiBkYXRhc2V0UmVzLCBlcnJvciwgcmVmZXRjaDogbXV0YXRlRGF0YXNldFJlcyB9ID0gdXNlRGF0YXNldERldGFpbChkYXRhc2V0SWQpXG5cbiAgY29uc3QgeyBkYXRhOiByZWxhdGVkQXBwcyB9ID0gdXNlRGF0YXNldFJlbGF0ZWRBcHBzKGRhdGFzZXRJZClcblxuICBjb25zdCBpc0J1dHRvbkRpc2FibGVkV2l0aFBpcGVsaW5lID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFkYXRhc2V0UmVzKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICBpZiAoZGF0YXNldFJlcy5wcm92aWRlciA9PT0gJ2V4dGVybmFsJylcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIChkYXRhc2V0UmVzLnJ1bnRpbWVfbW9kZSA9PT0gJ2dlbmVyYWwnKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuICFkYXRhc2V0UmVzLmlzX3B1Ymxpc2hlZFxuICB9LCBbZGF0YXNldFJlc10pXG5cbiAgY29uc3QgbmF2aWdhdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGJhc2VOYXZpZ2F0aW9uID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiB0KCdkYXRhc2V0TWVudXMuaGl0VGVzdGluZycsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgICAgICBocmVmOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9oaXRUZXN0aW5nYCxcbiAgICAgICAgaWNvbjogUmlGb2N1czJMaW5lLFxuICAgICAgICBzZWxlY3RlZEljb246IFJpRm9jdXMyRmlsbCxcbiAgICAgICAgZGlzYWJsZWQ6IGlzQnV0dG9uRGlzYWJsZWRXaXRoUGlwZWxpbmUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiB0KCdkYXRhc2V0TWVudXMuc2V0dGluZ3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgICAgaHJlZjogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vc2V0dGluZ3NgLFxuICAgICAgICBpY29uOiBSaUVxdWFsaXplcjJMaW5lLFxuICAgICAgICBzZWxlY3RlZEljb246IFJpRXF1YWxpemVyMkZpbGwsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgaWYgKGRhdGFzZXRSZXM/LnByb3ZpZGVyICE9PSAnZXh0ZXJuYWwnKSB7XG4gICAgICBiYXNlTmF2aWdhdGlvbi51bnNoaWZ0KHtcbiAgICAgICAgbmFtZTogdCgnZGF0YXNldE1lbnVzLnBpcGVsaW5lJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICAgIGhyZWY6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3BpcGVsaW5lYCxcbiAgICAgICAgaWNvbjogUGlwZWxpbmVMaW5lIGFzIFJlbWl4aWNvbkNvbXBvbmVudFR5cGUsXG4gICAgICAgIHNlbGVjdGVkSWNvbjogUGlwZWxpbmVGaWxsIGFzIFJlbWl4aWNvbkNvbXBvbmVudFR5cGUsXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBiYXNlTmF2aWdhdGlvbi51bnNoaWZ0KHtcbiAgICAgICAgbmFtZTogdCgnZGF0YXNldE1lbnVzLmRvY3VtZW50cycsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgICAgICBocmVmOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHNgLFxuICAgICAgICBpY29uOiBSaUZpbGVUZXh0TGluZSxcbiAgICAgICAgc2VsZWN0ZWRJY29uOiBSaUZpbGVUZXh0RmlsbCxcbiAgICAgICAgZGlzYWJsZWQ6IGlzQnV0dG9uRGlzYWJsZWRXaXRoUGlwZWxpbmUsXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBiYXNlTmF2aWdhdGlvblxuICB9LCBbdCwgZGF0YXNldElkLCBpc0J1dHRvbkRpc2FibGVkV2l0aFBpcGVsaW5lLCBkYXRhc2V0UmVzPy5wcm92aWRlcl0pXG5cbiAgdXNlRG9jdW1lbnRUaXRsZShkYXRhc2V0UmVzPy5uYW1lIHx8IHQoJ21lbnVzLmRhdGFzZXRzJywgeyBuczogJ2NvbW1vbicgfSkpXG5cbiAgY29uc3Qgc2V0QXBwU2lkZWJhckV4cGFuZCA9IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLnNldEFwcFNpZGViYXJFeHBhbmQpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBsb2NhbGVNb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FwcC1kZXRhaWwtY29sbGFwc2Utb3ItZXhwYW5kJykgfHwgJ2V4cGFuZCdcbiAgICBjb25zdCBtb2RlID0gaXNNb2JpbGUgPyAnY29sbGFwc2UnIDogJ2V4cGFuZCdcbiAgICBzZXRBcHBTaWRlYmFyRXhwYW5kKGlzTW9iaWxlID8gbW9kZSA6IGxvY2FsZU1vZGUpXG4gIH0sIFtpc01vYmlsZSwgc2V0QXBwU2lkZWJhckV4cGFuZF0pXG5cbiAgaWYgKCFkYXRhc2V0UmVzICYmICFlcnJvcilcbiAgICByZXR1cm4gPExvYWRpbmcgdHlwZT1cImFwcFwiIC8+XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAnZmxleCBncm93IG92ZXJmbG93LWhpZGRlbicsXG4gICAgICAgIGhpZGVIZWFkZXIgJiYgaXNQaXBlbGluZUNhbnZhcyA/ICcnIDogJ3JvdW5kZWQtdC0yeGwnLFxuICAgICAgKX1cbiAgICA+XG4gICAgICA8RGF0YXNldERldGFpbENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3tcbiAgICAgICAgaW5kZXhpbmdUZWNobmlxdWU6IGRhdGFzZXRSZXM/LmluZGV4aW5nX3RlY2huaXF1ZSxcbiAgICAgICAgZGF0YXNldDogZGF0YXNldFJlcyxcbiAgICAgICAgbXV0YXRlRGF0YXNldFJlcyxcbiAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHshaGlkZVNpZGVCYXIgJiYgKFxuICAgICAgICAgIDxBcHBTaWRlQmFyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uPXtuYXZpZ2F0aW9ufVxuICAgICAgICAgICAgZXh0cmFJbmZvPXtcbiAgICAgICAgICAgICAgIWlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvclxuICAgICAgICAgICAgICAgID8gbW9kZSA9PiA8RXh0cmFJbmZvIHJlbGF0ZWRBcHBzPXtyZWxhdGVkQXBwc30gZXhwYW5kPXttb2RlID09PSAnZXhwYW5kJ30gZG9jdW1lbnRDb3VudD17ZGF0YXNldFJlcz8uZG9jdW1lbnRfY291bnR9IC8+XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGljb25UeXBlPVwiZGF0YXNldFwiXG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93IG92ZXJmbG93LWhpZGRlbiBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlXCI+e2NoaWxkcmVufTwvZGl2PlxuICAgICAgPC9EYXRhc2V0RGV0YWlsQ29udGV4dC5Qcm92aWRlcj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhEYXRhc2V0RGV0YWlsTGF5b3V0KVxuIl19