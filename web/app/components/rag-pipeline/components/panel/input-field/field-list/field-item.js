"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
const badge_1 = require("@/app/components/base/badge");
const pipeline_1 = require("@/app/components/base/icons/src/vender/pipeline");
const input_var_type_icon_1 = require("@/app/components/workflow/nodes/_base/components/input-var-type-icon");
const classnames_1 = require("@/utils/classnames");
const FieldItem = ({ readonly, payload, index, onClickEdit, onRemove, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_2.useRef)(null);
    const isHovering = (0, ahooks_1.useHover)(ref);
    const handleOnClickEdit = (0, react_2.useCallback)((e) => {
        e.stopPropagation();
        if (readonly)
            return;
        onClickEdit(payload.variable);
    }, [onClickEdit, payload.variable, readonly]);
    const handleRemove = (0, react_2.useCallback)((e) => {
        e.stopPropagation();
        if (readonly)
            return;
        onRemove(index);
    }, [index, onRemove, readonly]);
    return (<div ref={ref} className={(0, classnames_1.cn)('handle flex h-8 cursor-pointer items-center justify-between gap-x-1 rounded-lg border border-components-panel-border-subtle bg-components-panel-on-panel-item-bg py-1 pl-2 shadow-xs hover:shadow-sm', (isHovering && !readonly) ? 'cursor-all-scroll pr-1' : 'pr-2.5', readonly && 'cursor-default')}>
      <div className="flex grow basis-0 items-center gap-x-1 overflow-hidden">
        {(isHovering && !readonly)
            ? <react_1.RiDraggable className="size-4 shrink-0 text-text-quaternary"/>
            : <pipeline_1.InputField className="size-4 shrink-0 text-text-accent"/>}
        <div title={payload.variable} className="system-sm-medium max-w-[130px] shrink-0 truncate text-text-secondary">
          {payload.variable}
        </div>
        {payload.label && (<>
            <div className="system-xs-regular shrink-0 text-text-quaternary">·</div>
            <div title={payload.label} className="system-xs-medium grow truncate text-text-tertiary">
              {payload.label}
            </div>
          </>)}
      </div>
      {(isHovering && !readonly)
            ? (<div className="flex shrink-0 items-center gap-x-1">
              <action_button_1.default className="mr-1" onClick={handleOnClickEdit}>
                <react_1.RiEditLine className="size-4 text-text-tertiary"/>
              </action_button_1.default>
              <action_button_1.default onClick={handleRemove}>
                <react_1.RiDeleteBinLine className="size-4 text-text-tertiary group-hover:text-text-destructive"/>
              </action_button_1.default>
            </div>)
            : (<div className="flex shrink-0 items-center gap-x-2">
              {payload.required && (<badge_1.default>{t('nodes.start.required', { ns: 'workflow' })}</badge_1.default>)}
              <input_var_type_icon_1.default type={payload.type} className="h-3 w-3 text-text-tertiary"/>
            </div>)}
    </div>);
};
exports.default = React.memo(FieldItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtaXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpZWxkLWl0ZW0udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBR1osNENBSXlCO0FBQ3pCLG1DQUFpQztBQUNqQywrQkFBOEI7QUFDOUIsaUNBQTJDO0FBQzNDLGlEQUE4QztBQUM5Qyx1RUFBOEQ7QUFDOUQsdURBQStDO0FBQy9DLDhFQUE0RTtBQUM1RSw4R0FBbUc7QUFDbkcsbURBQXVDO0FBVXZDLE1BQU0sU0FBUyxHQUFHLENBQUMsRUFDakIsUUFBUSxFQUNSLE9BQU8sRUFDUCxLQUFLLEVBQ0wsV0FBVyxFQUNYLFFBQVEsR0FDTyxFQUFFLEVBQUU7SUFDbkIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE1BQU0sR0FBRyxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hCLE1BQU0sVUFBVSxHQUFHLElBQUEsaUJBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQTtJQUVoQyxNQUFNLGlCQUFpQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQW1CLEVBQUUsRUFBRTtRQUM1RCxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDbkIsSUFBSSxRQUFRO1lBQ1YsT0FBTTtRQUNSLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDL0IsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUU3QyxNQUFNLFlBQVksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUFtQixFQUFFLEVBQUU7UUFDdkQsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQ25CLElBQUksUUFBUTtZQUNWLE9BQU07UUFDUixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDakIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRS9CLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDVCxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFDWCxzTUFBc00sRUFDdE0sQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDL0QsUUFBUSxJQUFJLGdCQUFnQixDQUM3QixDQUFDLENBR0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQ3JFO1FBQUEsQ0FDRSxDQUFDLFVBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2QixDQUFDLENBQUMsQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFBRztZQUNsRSxDQUFDLENBQUMsQ0FBQyxxQkFBVSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsRUFDOUQsQ0FDQTtRQUFBLENBQUMsR0FBRyxDQUNGLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FDeEIsU0FBUyxDQUFDLHNFQUFzRSxDQUVoRjtVQUFBLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FDbkI7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUNoQixFQUNFO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlEQUFpRCxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3ZFO1lBQUEsQ0FBQyxHQUFHLENBQ0YsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUNyQixTQUFTLENBQUMsbURBQW1ELENBRTdEO2NBQUEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNoQjtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsR0FBRyxDQUNKLENBQ0g7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxDQUNqRDtjQUFBLENBQUMsdUJBQVksQ0FDWCxTQUFTLENBQUMsTUFBTSxDQUNoQixPQUFPLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUUzQjtnQkFBQSxDQUFDLGtCQUFVLENBQUMsU0FBUyxDQUFDLDJCQUEyQixFQUNuRDtjQUFBLEVBQUUsdUJBQVksQ0FDZDtjQUFBLENBQUMsdUJBQVksQ0FDWCxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FFdEI7Z0JBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQyw2REFBNkQsRUFDMUY7Y0FBQSxFQUFFLHVCQUFZLENBQ2hCO1lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtZQUNILENBQUMsQ0FBQyxDQUNFLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FDakQ7Y0FBQSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FDbkIsQ0FBQyxlQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLGVBQUssQ0FBQyxDQUMvRCxDQUNEO2NBQUEsQ0FBQyw2QkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBK0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFDekc7WUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IElucHV0VmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IElucHV0VmFyIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQge1xuICBSaURlbGV0ZUJpbkxpbmUsXG4gIFJpRHJhZ2dhYmxlLFxuICBSaUVkaXRMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlSG92ZXIgfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5pbXBvcnQgQmFkZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2JhZGdlJ1xuaW1wb3J0IHsgSW5wdXRGaWVsZCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL3BpcGVsaW5lJ1xuaW1wb3J0IElucHV0VmFyVHlwZUljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2lucHV0LXZhci10eXBlLWljb24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxudHlwZSBGaWVsZEl0ZW1Qcm9wcyA9IHtcbiAgcmVhZG9ubHk/OiBib29sZWFuXG4gIHBheWxvYWQ6IElucHV0VmFyXG4gIGluZGV4OiBudW1iZXJcbiAgb25DbGlja0VkaXQ6IChpZDogc3RyaW5nKSA9PiB2b2lkXG4gIG9uUmVtb3ZlOiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZFxufVxuXG5jb25zdCBGaWVsZEl0ZW0gPSAoe1xuICByZWFkb25seSxcbiAgcGF5bG9hZCxcbiAgaW5kZXgsXG4gIG9uQ2xpY2tFZGl0LFxuICBvblJlbW92ZSxcbn06IEZpZWxkSXRlbVByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IHJlZiA9IHVzZVJlZihudWxsKVxuICBjb25zdCBpc0hvdmVyaW5nID0gdXNlSG92ZXIocmVmKVxuXG4gIGNvbnN0IGhhbmRsZU9uQ2xpY2tFZGl0ID0gdXNlQ2FsbGJhY2soKGU6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKHJlYWRvbmx5KVxuICAgICAgcmV0dXJuXG4gICAgb25DbGlja0VkaXQocGF5bG9hZC52YXJpYWJsZSlcbiAgfSwgW29uQ2xpY2tFZGl0LCBwYXlsb2FkLnZhcmlhYmxlLCByZWFkb25seV0pXG5cbiAgY29uc3QgaGFuZGxlUmVtb3ZlID0gdXNlQ2FsbGJhY2soKGU6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKHJlYWRvbmx5KVxuICAgICAgcmV0dXJuXG4gICAgb25SZW1vdmUoaW5kZXgpXG4gIH0sIFtpbmRleCwgb25SZW1vdmUsIHJlYWRvbmx5XSlcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIHJlZj17cmVmfVxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgJ2hhbmRsZSBmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC14LTEgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmcgcHktMSBwbC0yIHNoYWRvdy14cyBob3ZlcjpzaGFkb3ctc20nLFxuICAgICAgICAoaXNIb3ZlcmluZyAmJiAhcmVhZG9ubHkpID8gJ2N1cnNvci1hbGwtc2Nyb2xsIHByLTEnIDogJ3ByLTIuNScsXG4gICAgICAgIHJlYWRvbmx5ICYmICdjdXJzb3ItZGVmYXVsdCcsXG4gICAgICApfVxuICAgIC8vIG9uQ2xpY2s9e2hhbmRsZU9uQ2xpY2tFZGl0fVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGJhc2lzLTAgaXRlbXMtY2VudGVyIGdhcC14LTEgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgIHtcbiAgICAgICAgICAoaXNIb3ZlcmluZyAmJiAhcmVhZG9ubHkpXG4gICAgICAgICAgICA/IDxSaURyYWdnYWJsZSBjbGFzc05hbWU9XCJzaXplLTQgc2hyaW5rLTAgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgOiA8SW5wdXRGaWVsZCBjbGFzc05hbWU9XCJzaXplLTQgc2hyaW5rLTAgdGV4dC10ZXh0LWFjY2VudFwiIC8+XG4gICAgICAgIH1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHRpdGxlPXtwYXlsb2FkLnZhcmlhYmxlfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gbWF4LXctWzEzMHB4XSBzaHJpbmstMCB0cnVuY2F0ZSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCJcbiAgICAgICAgPlxuICAgICAgICAgIHtwYXlsb2FkLnZhcmlhYmxlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3BheWxvYWQubGFiZWwgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIHNocmluay0wIHRleHQtdGV4dC1xdWF0ZXJuYXJ5XCI+wrc8L2Rpdj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgdGl0bGU9e3BheWxvYWQubGFiZWx9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0gZ3JvdyB0cnVuY2F0ZSB0ZXh0LXRleHQtdGVydGlhcnlcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7cGF5bG9hZC5sYWJlbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICB7KGlzSG92ZXJpbmcgJiYgIXJlYWRvbmx5KVxuICAgICAgICA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaHJpbmstMCBpdGVtcy1jZW50ZXIgZ2FwLXgtMVwiPlxuICAgICAgICAgICAgICA8QWN0aW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXItMVwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlT25DbGlja0VkaXR9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8UmlFZGl0TGluZSBjbGFzc05hbWU9XCJzaXplLTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC9BY3Rpb25CdXR0b24+XG4gICAgICAgICAgICAgIDxBY3Rpb25CdXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSZW1vdmV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8UmlEZWxldGVCaW5MaW5lIGNsYXNzTmFtZT1cInNpemUtNCB0ZXh0LXRleHQtdGVydGlhcnkgZ3JvdXAtaG92ZXI6dGV4dC10ZXh0LWRlc3RydWN0aXZlXCIgLz5cbiAgICAgICAgICAgICAgPC9BY3Rpb25CdXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBnYXAteC0yXCI+XG4gICAgICAgICAgICAgIHtwYXlsb2FkLnJlcXVpcmVkICYmIChcbiAgICAgICAgICAgICAgICA8QmFkZ2U+e3QoJ25vZGVzLnN0YXJ0LnJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JyB9KX08L0JhZGdlPlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8SW5wdXRWYXJUeXBlSWNvbiB0eXBlPXtwYXlsb2FkLnR5cGUgYXMgdW5rbm93biBhcyBJbnB1dFZhclR5cGV9IGNsYXNzTmFtZT1cImgtMyB3LTMgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oRmllbGRJdGVtKVxuIl19