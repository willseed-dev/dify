"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const drawer_1 = require("@/app/components/base/drawer");
const types_1 = require("@/app/components/plugins/types");
const classnames_1 = require("@/utils/classnames");
const entrance_1 = require("../readme-panel/entrance");
const action_list_1 = require("./action-list");
const agent_strategy_list_1 = require("./agent-strategy-list");
const datasource_action_list_1 = require("./datasource-action-list");
const detail_header_1 = require("./detail-header");
const endpoint_list_1 = require("./endpoint-list");
const model_list_1 = require("./model-list");
const store_1 = require("./store");
const subscription_list_1 = require("./subscription-list");
const event_list_1 = require("./trigger/event-list");
const PluginDetailPanel = ({ detail, onUpdate, onHide, }) => {
    const handleUpdate = (0, react_1.useCallback)((isDelete = false) => {
        if (isDelete)
            onHide();
        onUpdate();
    }, [onHide, onUpdate]);
    const { setDetail } = (0, store_1.usePluginStore)();
    (0, react_1.useEffect)(() => {
        setDetail(!detail
            ? undefined
            : {
                plugin_id: detail.plugin_id,
                provider: `${detail.plugin_id}/${detail.declaration.name}`,
                plugin_unique_identifier: detail.plugin_unique_identifier || '',
                declaration: detail.declaration,
                name: detail.name,
                id: detail.id,
            });
    }, [detail, setDetail]);
    if (!detail)
        return null;
    return (<drawer_1.default isOpen={!!detail} clickOutsideNotOpen={false} onClose={onHide} footer={null} mask={false} positionCenter={false} panelClassName={(0, classnames_1.cn)('mb-2 mr-2 mt-[64px] !w-[420px] !max-w-[420px] justify-start rounded-2xl border-[0.5px] border-components-panel-border !bg-components-panel-bg !p-0 shadow-xl')}>
      {detail && (<>
          <detail_header_1.default detail={detail} onUpdate={handleUpdate} onHide={onHide}/>
          <div className="grow overflow-y-auto">
            <div className="flex min-h-full flex-col">
              <div className="flex-1">
                {detail.declaration.category === types_1.PluginCategoryEnum.trigger && (<>
                    <subscription_list_1.SubscriptionList pluginDetail={detail}/>
                    <event_list_1.TriggerEventsList />
                  </>)}
                {!!detail.declaration.tool && <action_list_1.default detail={detail}/>}
                {!!detail.declaration.agent_strategy && <agent_strategy_list_1.default detail={detail}/>}
                {!!detail.declaration.endpoint && <endpoint_list_1.default detail={detail}/>}
                {!!detail.declaration.model && <model_list_1.default detail={detail}/>}
                {!!detail.declaration.datasource && <datasource_action_list_1.default detail={detail}/>}
              </div>
              <entrance_1.ReadmeEntrance pluginDetail={detail} className="mt-auto"/>
            </div>
          </div>
        </>)}
    </drawer_1.default>);
};
exports.default = PluginDetailPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWixpQ0FBOEM7QUFDOUMseURBQWlEO0FBQ2pELDBEQUFtRTtBQUNuRSxtREFBdUM7QUFDdkMsdURBQXlEO0FBQ3pELCtDQUFzQztBQUN0QywrREFBcUQ7QUFDckQscUVBQTJEO0FBQzNELG1EQUEwQztBQUMxQyxtREFBMEM7QUFDMUMsNkNBQW9DO0FBQ3BDLG1DQUF3QztBQUN4QywyREFBc0Q7QUFDdEQscURBQXdEO0FBUXhELE1BQU0saUJBQWlCLEdBQWMsQ0FBQyxFQUNwQyxNQUFNLEVBQ04sUUFBUSxFQUNSLE1BQU0sR0FDUCxFQUFFLEVBQUU7SUFDSCxNQUFNLFlBQVksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxFQUFFLEVBQUU7UUFDcEQsSUFBSSxRQUFRO1lBQ1YsTUFBTSxFQUFFLENBQUE7UUFDVixRQUFRLEVBQUUsQ0FBQTtJQUNaLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRXRCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHNCQUFjLEdBQUUsQ0FBQTtJQUV0QyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsU0FBUyxDQUFDLENBQUMsTUFBTTtZQUNmLENBQUMsQ0FBQyxTQUFTO1lBQ1gsQ0FBQyxDQUFDO2dCQUNFLFNBQVMsRUFBRSxNQUFNLENBQUMsU0FBUztnQkFDM0IsUUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRTtnQkFDMUQsd0JBQXdCLEVBQUUsTUFBTSxDQUFDLHdCQUF3QixJQUFJLEVBQUU7Z0JBQy9ELFdBQVcsRUFBRSxNQUFNLENBQUMsV0FBVztnQkFDL0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO2dCQUNqQixFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUU7YUFDZCxDQUFDLENBQUE7SUFDUixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUV2QixJQUFJLENBQUMsTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsZ0JBQU0sQ0FDTCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2pCLG1CQUFtQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQzNCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNoQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDYixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWixjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDdEIsY0FBYyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsOEpBQThKLENBQUMsQ0FBQyxDQUVuTDtNQUFBLENBQUMsTUFBTSxJQUFJLENBQ1QsRUFDRTtVQUFBLENBQUMsdUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDckU7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUN2QztjQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQ3JCO2dCQUFBLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssMEJBQWtCLENBQUMsT0FBTyxJQUFJLENBQzdELEVBQ0U7b0JBQUEsQ0FBQyxvQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFDdkM7b0JBQUEsQ0FBQyw4QkFBaUIsQ0FBQyxBQUFELEVBQ3BCO2tCQUFBLEdBQUcsQ0FDSixDQUNEO2dCQUFBLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMscUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUM1RDtnQkFBQSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsSUFBSSxDQUFDLDZCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFHLENBQzdFO2dCQUFBLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxJQUFJLENBQUMsdUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUNsRTtnQkFBQSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxDQUFDLG9CQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUcsQ0FDNUQ7Z0JBQUEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLElBQUksQ0FBQyxnQ0FBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRyxDQUM5RTtjQUFBLEVBQUUsR0FBRyxDQUNMO2NBQUEsQ0FBQyx5QkFBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQzNEO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEdBQUcsQ0FDSixDQUNIO0lBQUEsRUFBRSxnQkFBTSxDQUFDLENBQ1YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGlCQUFpQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFBsdWdpbkRldGFpbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBEcmF3ZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2RyYXdlcidcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgUmVhZG1lRW50cmFuY2UgfSBmcm9tICcuLi9yZWFkbWUtcGFuZWwvZW50cmFuY2UnXG5pbXBvcnQgQWN0aW9uTGlzdCBmcm9tICcuL2FjdGlvbi1saXN0J1xuaW1wb3J0IEFnZW50U3RyYXRlZ3lMaXN0IGZyb20gJy4vYWdlbnQtc3RyYXRlZ3ktbGlzdCdcbmltcG9ydCBEYXRhc291cmNlQWN0aW9uTGlzdCBmcm9tICcuL2RhdGFzb3VyY2UtYWN0aW9uLWxpc3QnXG5pbXBvcnQgRGV0YWlsSGVhZGVyIGZyb20gJy4vZGV0YWlsLWhlYWRlcidcbmltcG9ydCBFbmRwb2ludExpc3QgZnJvbSAnLi9lbmRwb2ludC1saXN0J1xuaW1wb3J0IE1vZGVsTGlzdCBmcm9tICcuL21vZGVsLWxpc3QnXG5pbXBvcnQgeyB1c2VQbHVnaW5TdG9yZSB9IGZyb20gJy4vc3RvcmUnXG5pbXBvcnQgeyBTdWJzY3JpcHRpb25MaXN0IH0gZnJvbSAnLi9zdWJzY3JpcHRpb24tbGlzdCdcbmltcG9ydCB7IFRyaWdnZXJFdmVudHNMaXN0IH0gZnJvbSAnLi90cmlnZ2VyL2V2ZW50LWxpc3QnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIGRldGFpbD86IFBsdWdpbkRldGFpbFxuICBvblVwZGF0ZTogKCkgPT4gdm9pZFxuICBvbkhpZGU6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgUGx1Z2luRGV0YWlsUGFuZWw6IEZDPFByb3BzPiA9ICh7XG4gIGRldGFpbCxcbiAgb25VcGRhdGUsXG4gIG9uSGlkZSxcbn0pID0+IHtcbiAgY29uc3QgaGFuZGxlVXBkYXRlID0gdXNlQ2FsbGJhY2soKGlzRGVsZXRlID0gZmFsc2UpID0+IHtcbiAgICBpZiAoaXNEZWxldGUpXG4gICAgICBvbkhpZGUoKVxuICAgIG9uVXBkYXRlKClcbiAgfSwgW29uSGlkZSwgb25VcGRhdGVdKVxuXG4gIGNvbnN0IHsgc2V0RGV0YWlsIH0gPSB1c2VQbHVnaW5TdG9yZSgpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXREZXRhaWwoIWRldGFpbFxuICAgICAgPyB1bmRlZmluZWRcbiAgICAgIDoge1xuICAgICAgICAgIHBsdWdpbl9pZDogZGV0YWlsLnBsdWdpbl9pZCxcbiAgICAgICAgICBwcm92aWRlcjogYCR7ZGV0YWlsLnBsdWdpbl9pZH0vJHtkZXRhaWwuZGVjbGFyYXRpb24ubmFtZX1gLFxuICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogZGV0YWlsLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllciB8fCAnJyxcbiAgICAgICAgICBkZWNsYXJhdGlvbjogZGV0YWlsLmRlY2xhcmF0aW9uLFxuICAgICAgICAgIG5hbWU6IGRldGFpbC5uYW1lLFxuICAgICAgICAgIGlkOiBkZXRhaWwuaWQsXG4gICAgICAgIH0pXG4gIH0sIFtkZXRhaWwsIHNldERldGFpbF0pXG5cbiAgaWYgKCFkZXRhaWwpXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxEcmF3ZXJcbiAgICAgIGlzT3Blbj17ISFkZXRhaWx9XG4gICAgICBjbGlja091dHNpZGVOb3RPcGVuPXtmYWxzZX1cbiAgICAgIG9uQ2xvc2U9e29uSGlkZX1cbiAgICAgIGZvb3Rlcj17bnVsbH1cbiAgICAgIG1hc2s9e2ZhbHNlfVxuICAgICAgcG9zaXRpb25DZW50ZXI9e2ZhbHNlfVxuICAgICAgcGFuZWxDbGFzc05hbWU9e2NuKCdtYi0yIG1yLTIgbXQtWzY0cHhdICF3LVs0MjBweF0gIW1heC13LVs0MjBweF0ganVzdGlmeS1zdGFydCByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgIWJnLWNvbXBvbmVudHMtcGFuZWwtYmcgIXAtMCBzaGFkb3cteGwnKX1cbiAgICA+XG4gICAgICB7ZGV0YWlsICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICA8RGV0YWlsSGVhZGVyIGRldGFpbD17ZGV0YWlsfSBvblVwZGF0ZT17aGFuZGxlVXBkYXRlfSBvbkhpZGU9e29uSGlkZX0gLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3cgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLWgtZnVsbCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxuICAgICAgICAgICAgICAgIHtkZXRhaWwuZGVjbGFyYXRpb24uY2F0ZWdvcnkgPT09IFBsdWdpbkNhdGVnb3J5RW51bS50cmlnZ2VyICYmIChcbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIDxTdWJzY3JpcHRpb25MaXN0IHBsdWdpbkRldGFpbD17ZGV0YWlsfSAvPlxuICAgICAgICAgICAgICAgICAgICA8VHJpZ2dlckV2ZW50c0xpc3QgLz5cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgeyEhZGV0YWlsLmRlY2xhcmF0aW9uLnRvb2wgJiYgPEFjdGlvbkxpc3QgZGV0YWlsPXtkZXRhaWx9IC8+fVxuICAgICAgICAgICAgICAgIHshIWRldGFpbC5kZWNsYXJhdGlvbi5hZ2VudF9zdHJhdGVneSAmJiA8QWdlbnRTdHJhdGVneUxpc3QgZGV0YWlsPXtkZXRhaWx9IC8+fVxuICAgICAgICAgICAgICAgIHshIWRldGFpbC5kZWNsYXJhdGlvbi5lbmRwb2ludCAmJiA8RW5kcG9pbnRMaXN0IGRldGFpbD17ZGV0YWlsfSAvPn1cbiAgICAgICAgICAgICAgICB7ISFkZXRhaWwuZGVjbGFyYXRpb24ubW9kZWwgJiYgPE1vZGVsTGlzdCBkZXRhaWw9e2RldGFpbH0gLz59XG4gICAgICAgICAgICAgICAgeyEhZGV0YWlsLmRlY2xhcmF0aW9uLmRhdGFzb3VyY2UgJiYgPERhdGFzb3VyY2VBY3Rpb25MaXN0IGRldGFpbD17ZGV0YWlsfSAvPn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxSZWFkbWVFbnRyYW5jZSBwbHVnaW5EZXRhaWw9e2RldGFpbH0gY2xhc3NOYW1lPVwibXQtYXV0b1wiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgIDwvRHJhd2VyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsdWdpbkRldGFpbFBhbmVsXG4iXX0=