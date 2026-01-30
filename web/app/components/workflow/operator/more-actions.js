"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const html_to_image_1 = require("html-to-image");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const shallow_1 = require("zustand/react/shallow");
const store_1 = require("@/app/components/app/store");
const image_preview_1 = require("@/app/components/base/image-uploader/image-preview");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const store_2 = require("@/app/components/workflow/store");
const classnames_1 = require("@/utils/classnames");
const hooks_1 = require("../hooks");
const tip_popup_1 = require("./tip-popup");
const MoreActions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { getNodesReadOnly } = (0, hooks_1.useNodesReadOnly)();
    const reactFlow = (0, reactflow_1.useReactFlow)();
    const [open, setOpen] = (0, react_2.useState)(false);
    const [previewUrl, setPreviewUrl] = (0, react_2.useState)('');
    const [previewTitle, setPreviewTitle] = (0, react_2.useState)('');
    const knowledgeName = (0, store_2.useStore)(s => s.knowledgeName);
    const appName = (0, store_2.useStore)(s => s.appName);
    const maximizeCanvas = (0, store_2.useStore)(s => s.maximizeCanvas);
    const { appSidebarExpand } = (0, store_1.useStore)((0, shallow_1.useShallow)(state => ({
        appSidebarExpand: state.appSidebarExpand,
    })));
    const crossAxisOffset = (0, react_2.useMemo)(() => {
        if (maximizeCanvas)
            return 40;
        return appSidebarExpand === 'expand' ? 188 : 40;
    }, [appSidebarExpand, maximizeCanvas]);
    const handleExportImage = (0, react_2.useCallback)(async (type, currentWorkflow = false) => {
        if (!appName && !knowledgeName)
            return;
        if (getNodesReadOnly())
            return;
        setOpen(false);
        const flowElement = document.querySelector('.react-flow__viewport');
        if (!flowElement)
            return;
        try {
            let filename = appName || knowledgeName;
            const filter = (node) => {
                if (node instanceof HTMLImageElement)
                    return node.complete && node.naturalHeight !== 0;
                return true;
            };
            let dataUrl;
            if (currentWorkflow) {
                const nodes = reactFlow.getNodes();
                const nodesBounds = (0, reactflow_1.getNodesBounds)(nodes);
                const currentViewport = reactFlow.getViewport();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const zoom = Math.min(viewportWidth / (nodesBounds.width + 100), viewportHeight / (nodesBounds.height + 100), 1);
                const centerX = nodesBounds.x + nodesBounds.width / 2;
                const centerY = nodesBounds.y + nodesBounds.height / 2;
                reactFlow.setViewport({
                    x: viewportWidth / 2 - centerX * zoom,
                    y: viewportHeight / 2 - centerY * zoom,
                    zoom,
                });
                await new Promise(resolve => setTimeout(resolve, 300));
                const padding = 50;
                const contentWidth = nodesBounds.width + padding * 2;
                const contentHeight = nodesBounds.height + padding * 2;
                const exportOptions = {
                    filter,
                    backgroundColor: '#1a1a1a',
                    pixelRatio: 2,
                    width: contentWidth,
                    height: contentHeight,
                    style: {
                        width: `${contentWidth}px`,
                        height: `${contentHeight}px`,
                        transform: `translate(${padding - nodesBounds.x}px, ${padding - nodesBounds.y}px)`,
                        transformOrigin: 'top left',
                    },
                };
                switch (type) {
                    case 'png':
                        dataUrl = await (0, html_to_image_1.toPng)(flowElement, exportOptions);
                        break;
                    case 'jpeg':
                        dataUrl = await (0, html_to_image_1.toJpeg)(flowElement, exportOptions);
                        break;
                    case 'svg':
                        dataUrl = await (0, html_to_image_1.toSvg)(flowElement, { filter });
                        break;
                    default:
                        dataUrl = await (0, html_to_image_1.toPng)(flowElement, exportOptions);
                }
                filename += '-whole-workflow';
                setTimeout(() => {
                    reactFlow.setViewport(currentViewport);
                }, 500);
            }
            else {
                // Current viewport export (existing functionality)
                switch (type) {
                    case 'png':
                        dataUrl = await (0, html_to_image_1.toPng)(flowElement, { filter });
                        break;
                    case 'jpeg':
                        dataUrl = await (0, html_to_image_1.toJpeg)(flowElement, { filter });
                        break;
                    case 'svg':
                        dataUrl = await (0, html_to_image_1.toSvg)(flowElement, { filter });
                        break;
                    default:
                        dataUrl = await (0, html_to_image_1.toPng)(flowElement, { filter });
                }
            }
            if (currentWorkflow) {
                setPreviewUrl(dataUrl);
                setPreviewTitle(`${filename}.${type}`);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${filename}.${type}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else {
                // For current view, just download
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${filename}.${type}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        catch (error) {
            console.error('Export image failed:', error);
        }
    }, [getNodesReadOnly, appName, reactFlow, knowledgeName]);
    const handleTrigger = (0, react_2.useCallback)(() => {
        if (getNodesReadOnly())
            return;
        setOpen(v => !v);
    }, [getNodesReadOnly]);
    return (<>
      <portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={setOpen} placement="bottom-end" offset={{
            mainAxis: -200,
            crossAxis: crossAxisOffset,
        }}>
        <portal_to_follow_elem_1.PortalToFollowElemTrigger>
          <tip_popup_1.default title={t('common.moreActions', { ns: 'workflow' })}>
            <div className={(0, classnames_1.cn)('flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover hover:text-text-secondary', `${getNodesReadOnly() && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'}`)} onClick={handleTrigger}>
              <react_1.RiMoreFill className="h-4 w-4"/>
            </div>
          </tip_popup_1.default>
        </portal_to_follow_elem_1.PortalToFollowElemTrigger>
        <portal_to_follow_elem_1.PortalToFollowElemContent className="z-10">
          <div className="min-w-[180px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur text-text-secondary shadow-lg">
            <div className="p-1">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-text-tertiary">
                <react_1.RiExportLine className="h-3 w-3"/>
                {t('common.exportImage', { ns: 'workflow' })}
              </div>
              <div className="px-2 py-1 text-xs font-medium text-text-tertiary">
                {t('common.currentView', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('png')}>
                {t('common.exportPNG', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('jpeg')}>
                {t('common.exportJPEG', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('svg')}>
                {t('common.exportSVG', { ns: 'workflow' })}
              </div>

              <div className="border-border-divider mx-2 my-1 border-t"/>

              <div className="px-2 py-1 text-xs font-medium text-text-tertiary">
                {t('common.currentWorkflow', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('png', true)}>
                {t('common.exportPNG', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('jpeg', true)}>
                {t('common.exportJPEG', { ns: 'workflow' })}
              </div>
              <div className="system-md-regular flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover" onClick={() => handleExportImage('svg', true)}>
                {t('common.exportSVG', { ns: 'workflow' })}
              </div>
            </div>
          </div>
        </portal_to_follow_elem_1.PortalToFollowElemContent>
      </portal_to_follow_elem_1.PortalToFollowElem>

      {previewUrl && (<image_preview_1.default url={previewUrl} title={previewTitle} onCancel={() => setPreviewUrl('')}/>)}
    </>);
};
exports.default = (0, react_2.memo)(MoreActions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9yZS1hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9yZS1hY3Rpb25zLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyRDtBQUMzRCxpREFBb0Q7QUFDcEQsaUNBS2M7QUFDZCxpREFBOEM7QUFDOUMseUNBQXdEO0FBQ3hELG1EQUFrRDtBQUNsRCxzREFBb0U7QUFDcEUsc0ZBQTZFO0FBQzdFLHVGQUlvRDtBQUNwRCwyREFBMEQ7QUFDMUQsbURBQXVDO0FBQ3ZDLG9DQUEyQztBQUMzQywyQ0FBa0M7QUFFbEMsTUFBTSxXQUFXLEdBQU8sR0FBRyxFQUFFO0lBQzNCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDL0MsTUFBTSxTQUFTLEdBQUcsSUFBQSx3QkFBWSxHQUFFLENBQUE7SUFFaEMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkMsTUFBTSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDaEQsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEQsTUFBTSxhQUFhLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN4QyxNQUFNLGNBQWMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENB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QU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUUvQztnQkFBQSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUM3QztjQUFBLEVBQUUsR0FBRyxDQUNMO2NBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLGtHQUFrRyxDQUM1RyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FFOUM7Z0JBQUEsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDNUM7Y0FBQSxFQUFFLEdBQUcsQ0FDUDtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLGlEQUF5QixDQUM3QjtNQUFBLEVBQUUsMENBQWtCLENBRXBCOztNQUFBLENBQUMsVUFBVSxJQUFJLENBQ2IsQ0FBQyx1QkFBWSxDQUNYLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNoQixLQUFLLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDcEIsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ2xDLENBQ0gsQ0FDSDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsV0FBVyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSaUV4cG9ydExpbmUsIFJpTW9yZUZpbGwgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdG9KcGVnLCB0b1BuZywgdG9TdmcgfSBmcm9tICdodG1sLXRvLWltYWdlJ1xuaW1wb3J0IHtcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZU1lbW8sXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IGdldE5vZGVzQm91bmRzLCB1c2VSZWFjdEZsb3cgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB1c2VTaGFsbG93IH0gZnJvbSAnenVzdGFuZC9yZWFjdC9zaGFsbG93J1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlQXBwU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9zdG9yZSdcbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ltYWdlLXVwbG9hZGVyL2ltYWdlLXByZXZpZXcnXG5pbXBvcnQge1xuICBQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IHVzZU5vZGVzUmVhZE9ubHkgfSBmcm9tICcuLi9ob29rcydcbmltcG9ydCBUaXBQb3B1cCBmcm9tICcuL3RpcC1wb3B1cCdcblxuY29uc3QgTW9yZUFjdGlvbnM6IEZDID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBnZXROb2Rlc1JlYWRPbmx5IH0gPSB1c2VOb2Rlc1JlYWRPbmx5KClcbiAgY29uc3QgcmVhY3RGbG93ID0gdXNlUmVhY3RGbG93KClcblxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3ByZXZpZXdVcmwsIHNldFByZXZpZXdVcmxdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtwcmV2aWV3VGl0bGUsIHNldFByZXZpZXdUaXRsZV0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3Qga25vd2xlZGdlTmFtZSA9IHVzZVN0b3JlKHMgPT4gcy5rbm93bGVkZ2VOYW1lKVxuICBjb25zdCBhcHBOYW1lID0gdXNlU3RvcmUocyA9PiBzLmFwcE5hbWUpXG4gIGNvbnN0IG1heGltaXplQ2FudmFzID0gdXNlU3RvcmUocyA9PiBzLm1heGltaXplQ2FudmFzKVxuICBjb25zdCB7IGFwcFNpZGViYXJFeHBhbmQgfSA9IHVzZUFwcFN0b3JlKHVzZVNoYWxsb3coc3RhdGUgPT4gKHtcbiAgICBhcHBTaWRlYmFyRXhwYW5kOiBzdGF0ZS5hcHBTaWRlYmFyRXhwYW5kLFxuICB9KSkpXG5cbiAgY29uc3QgY3Jvc3NBeGlzT2Zmc2V0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKG1heGltaXplQ2FudmFzKVxuICAgICAgcmV0dXJuIDQwXG4gICAgcmV0dXJuIGFwcFNpZGViYXJFeHBhbmQgPT09ICdleHBhbmQnID8gMTg4IDogNDBcbiAgfSwgW2FwcFNpZGViYXJFeHBhbmQsIG1heGltaXplQ2FudmFzXSlcblxuICBjb25zdCBoYW5kbGVFeHBvcnRJbWFnZSA9IHVzZUNhbGxiYWNrKGFzeW5jICh0eXBlOiAncG5nJyB8ICdqcGVnJyB8ICdzdmcnLCBjdXJyZW50V29ya2Zsb3cgPSBmYWxzZSkgPT4ge1xuICAgIGlmICghYXBwTmFtZSAmJiAha25vd2xlZGdlTmFtZSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuXG4gICAgc2V0T3BlbihmYWxzZSlcbiAgICBjb25zdCBmbG93RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWFjdC1mbG93X192aWV3cG9ydCcpIGFzIEhUTUxFbGVtZW50XG4gICAgaWYgKCFmbG93RWxlbWVudClcbiAgICAgIHJldHVyblxuXG4gICAgdHJ5IHtcbiAgICAgIGxldCBmaWxlbmFtZSA9IGFwcE5hbWUgfHwga25vd2xlZGdlTmFtZVxuICAgICAgY29uc3QgZmlsdGVyID0gKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudClcbiAgICAgICAgICByZXR1cm4gbm9kZS5jb21wbGV0ZSAmJiBub2RlLm5hdHVyYWxIZWlnaHQgIT09IDBcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YVVybFxuXG4gICAgICBpZiAoY3VycmVudFdvcmtmbG93KSB7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gcmVhY3RGbG93LmdldE5vZGVzKClcbiAgICAgICAgY29uc3Qgbm9kZXNCb3VuZHMgPSBnZXROb2Rlc0JvdW5kcyhub2RlcylcblxuICAgICAgICBjb25zdCBjdXJyZW50Vmlld3BvcnQgPSByZWFjdEZsb3cuZ2V0Vmlld3BvcnQoKVxuXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICBjb25zdCB6b29tID0gTWF0aC5taW4oXG4gICAgICAgICAgdmlld3BvcnRXaWR0aCAvIChub2Rlc0JvdW5kcy53aWR0aCArIDEwMCksXG4gICAgICAgICAgdmlld3BvcnRIZWlnaHQgLyAobm9kZXNCb3VuZHMuaGVpZ2h0ICsgMTAwKSxcbiAgICAgICAgICAxLFxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgY2VudGVyWCA9IG5vZGVzQm91bmRzLnggKyBub2Rlc0JvdW5kcy53aWR0aCAvIDJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IG5vZGVzQm91bmRzLnkgKyBub2Rlc0JvdW5kcy5oZWlnaHQgLyAyXG5cbiAgICAgICAgcmVhY3RGbG93LnNldFZpZXdwb3J0KHtcbiAgICAgICAgICB4OiB2aWV3cG9ydFdpZHRoIC8gMiAtIGNlbnRlclggKiB6b29tLFxuICAgICAgICAgIHk6IHZpZXdwb3J0SGVpZ2h0IC8gMiAtIGNlbnRlclkgKiB6b29tLFxuICAgICAgICAgIHpvb20sXG4gICAgICAgIH0pXG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCkpXG5cbiAgICAgICAgY29uc3QgcGFkZGluZyA9IDUwXG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IG5vZGVzQm91bmRzLndpZHRoICsgcGFkZGluZyAqIDJcbiAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IG5vZGVzQm91bmRzLmhlaWdodCArIHBhZGRpbmcgKiAyXG5cbiAgICAgICAgY29uc3QgZXhwb3J0T3B0aW9ucyA9IHtcbiAgICAgICAgICBmaWx0ZXIsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzFhMWExYScsXG4gICAgICAgICAgcGl4ZWxSYXRpbzogMixcbiAgICAgICAgICB3aWR0aDogY29udGVudFdpZHRoLFxuICAgICAgICAgIGhlaWdodDogY29udGVudEhlaWdodCxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgd2lkdGg6IGAke2NvbnRlbnRXaWR0aH1weGAsXG4gICAgICAgICAgICBoZWlnaHQ6IGAke2NvbnRlbnRIZWlnaHR9cHhgLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7cGFkZGluZyAtIG5vZGVzQm91bmRzLnh9cHgsICR7cGFkZGluZyAtIG5vZGVzQm91bmRzLnl9cHgpYCxcbiAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ3RvcCBsZWZ0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSAncG5nJzpcbiAgICAgICAgICAgIGRhdGFVcmwgPSBhd2FpdCB0b1BuZyhmbG93RWxlbWVudCwgZXhwb3J0T3B0aW9ucylcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnanBlZyc6XG4gICAgICAgICAgICBkYXRhVXJsID0gYXdhaXQgdG9KcGVnKGZsb3dFbGVtZW50LCBleHBvcnRPcHRpb25zKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdzdmcnOlxuICAgICAgICAgICAgZGF0YVVybCA9IGF3YWl0IHRvU3ZnKGZsb3dFbGVtZW50LCB7IGZpbHRlciB9KVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZGF0YVVybCA9IGF3YWl0IHRvUG5nKGZsb3dFbGVtZW50LCBleHBvcnRPcHRpb25zKVxuICAgICAgICB9XG5cbiAgICAgICAgZmlsZW5hbWUgKz0gJy13aG9sZS13b3JrZmxvdydcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZWFjdEZsb3cuc2V0Vmlld3BvcnQoY3VycmVudFZpZXdwb3J0KVxuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gQ3VycmVudCB2aWV3cG9ydCBleHBvcnQgKGV4aXN0aW5nIGZ1bmN0aW9uYWxpdHkpXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgJ3BuZyc6XG4gICAgICAgICAgICBkYXRhVXJsID0gYXdhaXQgdG9QbmcoZmxvd0VsZW1lbnQsIHsgZmlsdGVyIH0pXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ2pwZWcnOlxuICAgICAgICAgICAgZGF0YVVybCA9IGF3YWl0IHRvSnBlZyhmbG93RWxlbWVudCwgeyBmaWx0ZXIgfSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgY2FzZSAnc3ZnJzpcbiAgICAgICAgICAgIGRhdGFVcmwgPSBhd2FpdCB0b1N2ZyhmbG93RWxlbWVudCwgeyBmaWx0ZXIgfSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGRhdGFVcmwgPSBhd2FpdCB0b1BuZyhmbG93RWxlbWVudCwgeyBmaWx0ZXIgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFdvcmtmbG93KSB7XG4gICAgICAgIHNldFByZXZpZXdVcmwoZGF0YVVybClcbiAgICAgICAgc2V0UHJldmlld1RpdGxlKGAke2ZpbGVuYW1lfS4ke3R5cGV9YClcblxuICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVcmxcbiAgICAgICAgbGluay5kb3dubG9hZCA9IGAke2ZpbGVuYW1lfS4ke3R5cGV9YFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspXG4gICAgICAgIGxpbmsuY2xpY2soKVxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gRm9yIGN1cnJlbnQgdmlldywganVzdCBkb3dubG9hZFxuICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICAgICAgIGxpbmsuaHJlZiA9IGRhdGFVcmxcbiAgICAgICAgbGluay5kb3dubG9hZCA9IGAke2ZpbGVuYW1lfS4ke3R5cGV9YFxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspXG4gICAgICAgIGxpbmsuY2xpY2soKVxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspXG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXhwb3J0IGltYWdlIGZhaWxlZDonLCBlcnJvcilcbiAgICB9XG4gIH0sIFtnZXROb2Rlc1JlYWRPbmx5LCBhcHBOYW1lLCByZWFjdEZsb3csIGtub3dsZWRnZU5hbWVdKVxuXG4gIGNvbnN0IGhhbmRsZVRyaWdnZXIgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuXG4gICAgc2V0T3Blbih2ID0+ICF2KVxuICB9LCBbZ2V0Tm9kZXNSZWFkT25seV0pXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbVxuICAgICAgICBvcGVuPXtvcGVufVxuICAgICAgICBvbk9wZW5DaGFuZ2U9e3NldE9wZW59XG4gICAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1lbmRcIlxuICAgICAgICBvZmZzZXQ9e3tcbiAgICAgICAgICBtYWluQXhpczogLTIwMCxcbiAgICAgICAgICBjcm9zc0F4aXM6IGNyb3NzQXhpc09mZnNldCxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICAgICAgPFRpcFBvcHVwIHRpdGxlPXt0KCdjb21tb24ubW9yZUFjdGlvbnMnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgICAnZmxleCBoLTggdy04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWxnIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXIgaG92ZXI6dGV4dC10ZXh0LXNlY29uZGFyeScsXG4gICAgICAgICAgICAgICAgYCR7Z2V0Tm9kZXNSZWFkT25seSgpICYmICdjdXJzb3Itbm90LWFsbG93ZWQgdGV4dC10ZXh0LWRpc2FibGVkIGhvdmVyOmJnLXRyYW5zcGFyZW50IGhvdmVyOnRleHQtdGV4dC1kaXNhYmxlZCd9YCxcbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlVHJpZ2dlcn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFJpTW9yZUZpbGwgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1RpcFBvcHVwPlxuICAgICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50IGNsYXNzTmFtZT1cInotMTBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi13LVsxODBweF0gcm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHRleHQtdGV4dC1zZWNvbmRhcnkgc2hhZG93LWxnXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHB4LTIgcHktMSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgIDxSaUV4cG9ydExpbmUgY2xhc3NOYW1lPVwiaC0zIHctM1wiIC8+XG4gICAgICAgICAgICAgICAge3QoJ2NvbW1vbi5leHBvcnRJbWFnZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTIgcHktMSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgIHt0KCdjb21tb24uY3VycmVudFZpZXcnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIGZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIHB4LTIgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRXhwb3J0SW1hZ2UoJ3BuZycpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ2NvbW1vbi5leHBvcnRQTkcnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIGZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIHB4LTIgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRXhwb3J0SW1hZ2UoJ2pwZWcnKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdjb21tb24uZXhwb3J0SlBFRycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgcHgtMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVFeHBvcnRJbWFnZSgnc3ZnJyl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnY29tbW9uLmV4cG9ydFNWRycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLWJvcmRlci1kaXZpZGVyIG14LTIgbXktMSBib3JkZXItdFwiIC8+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC0yIHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICB7dCgnY29tbW9uLmN1cnJlbnRXb3JrZmxvdycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgcHgtMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVFeHBvcnRJbWFnZSgncG5nJywgdHJ1ZSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgnY29tbW9uLmV4cG9ydFBORycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgcHgtMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVFeHBvcnRJbWFnZSgnanBlZycsIHRydWUpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3QoJ2NvbW1vbi5leHBvcnRKUEVHJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgcm91bmRlZC1sZyBweC0yIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZUV4cG9ydEltYWdlKCdzdmcnLCB0cnVlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdjb21tb24uZXhwb3J0U1ZHJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50PlxuICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG5cbiAgICAgIHtwcmV2aWV3VXJsICYmIChcbiAgICAgICAgPEltYWdlUHJldmlld1xuICAgICAgICAgIHVybD17cHJldmlld1VybH1cbiAgICAgICAgICB0aXRsZT17cHJldmlld1RpdGxlfVxuICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRQcmV2aWV3VXJsKCcnKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgPC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhNb3JlQWN0aW9ucylcbiJdfQ==