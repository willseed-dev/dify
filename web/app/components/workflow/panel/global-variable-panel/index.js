"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const store_1 = require("@/app/components/workflow/store");
const classnames_1 = require("@/utils/classnames");
const constants_1 = require("../../constants");
const hooks_1 = require("../../hooks");
const item_1 = require("./item");
const Panel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const setShowPanel = (0, store_1.useStore)(s => s.setShowGlobalVariablePanel);
    const isWorkflowPage = (0, constants_1.isInWorkflowPage)();
    const globalVariableList = [
        ...(isChatMode
            ? [{
                    name: 'conversation_id',
                    value_type: 'string',
                    description: t('globalVar.fieldsDescription.conversationId', { ns: 'workflow' }),
                }, {
                    name: 'dialog_count',
                    value_type: 'number',
                    description: t('globalVar.fieldsDescription.dialogCount', { ns: 'workflow' }),
                }]
            : []),
        {
            name: 'user_id',
            value_type: 'string',
            description: t('globalVar.fieldsDescription.userId', { ns: 'workflow' }),
        },
        {
            name: 'app_id',
            value_type: 'string',
            description: t('globalVar.fieldsDescription.appId', { ns: 'workflow' }),
        },
        {
            name: 'workflow_id',
            value_type: 'string',
            description: t('globalVar.fieldsDescription.workflowId', { ns: 'workflow' }),
        },
        {
            name: 'workflow_run_id',
            value_type: 'string',
            description: t('globalVar.fieldsDescription.workflowRunId', { ns: 'workflow' }),
        },
        // is workflow
        ...((isWorkflowPage && !isChatMode)
            ? [{
                    name: 'timestamp',
                    value_type: 'number',
                    description: t('globalVar.fieldsDescription.triggerTimestamp', { ns: 'workflow' }),
                }]
            : []),
    ];
    return (<div className={(0, classnames_1.cn)('relative flex h-full w-[420px] flex-col rounded-l-2xl border border-components-panel-border bg-components-panel-bg-alt')}>
      <div className="system-xl-semibold flex shrink-0 items-center justify-between p-4 pb-0 text-text-primary">
        {t('globalVar.title', { ns: 'workflow' })}
        <div className="flex items-center">
          <div className="flex h-6 w-6 cursor-pointer items-center justify-center" onClick={() => setShowPanel(false)}>
            <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
          </div>
        </div>
      </div>
      <div className="system-sm-regular shrink-0 px-4 py-1 text-text-tertiary">{t('globalVar.description', { ns: 'workflow' })}</div>

      <div className="mt-4 grow overflow-y-auto rounded-b-2xl px-4">
        {globalVariableList.map(item => (<item_1.default key={item.name} payload={item}/>))}
      </div>
    </div>);
};
exports.default = (0, react_2.memo)(Panel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FBOEM7QUFDOUMsaUNBRWM7QUFDZCxpREFBOEM7QUFDOUMsMkRBQTBEO0FBRTFELG1EQUF1QztBQUN2QywrQ0FBa0Q7QUFDbEQsdUNBQTJDO0FBQzNDLGlDQUF5QjtBQUV6QixNQUFNLEtBQUssR0FBRyxHQUFHLEVBQUU7SUFDakIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBQ2xDLE1BQU0sWUFBWSxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sY0FBYyxHQUFHLElBQUEsNEJBQWdCLEdBQUUsQ0FBQTtJQUV6QyxNQUFNLGtCQUFrQixHQUFxQjtRQUMzQyxHQUFHLENBQUMsVUFBVTtZQUNaLENBQUMsQ0FBQyxDQUFDO29CQUNDLElBQUksRUFBRSxpQkFBaUI7b0JBQ3ZCLFVBQVUsRUFBRSxRQUFpQjtvQkFDN0IsV0FBVyxFQUFFLENBQUMsQ0FBQyw0Q0FBNEMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztpQkFDakYsRUFBRTtvQkFDRCxJQUFJLEVBQUUsY0FBYztvQkFDcEIsVUFBVSxFQUFFLFFBQWlCO29CQUM3QixXQUFXLEVBQUUsQ0FBQyxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO2lCQUM5RSxDQUFDO1lBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNQO1lBQ0UsSUFBSSxFQUFFLFNBQVM7WUFDZixVQUFVLEVBQUUsUUFBUTtZQUNwQixXQUFXLEVBQUUsQ0FBQyxDQUFDLG9DQUFvQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO1NBQ3pFO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSxDQUFDLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDeEU7UUFDRDtZQUNFLElBQUksRUFBRSxhQUFhO1lBQ25CLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSxDQUFDLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDN0U7UUFDRDtZQUNFLElBQUksRUFBRSxpQkFBaUI7WUFDdkIsVUFBVSxFQUFFLFFBQVE7WUFDcEIsV0FBVyxFQUFFLENBQUMsQ0FBQywyQ0FBMkMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUNoRjtRQUNELGNBQWM7UUFDZCxHQUFHLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7b0JBQ0MsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFVBQVUsRUFBRSxRQUFpQjtvQkFDN0IsV0FBVyxFQUFFLENBQUMsQ0FBQyw4Q0FBOEMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztpQkFDbkYsQ0FBQztZQUNKLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDUixDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNYLHdIQUF3SCxDQUN6SCxDQUFDLENBRUY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEZBQTBGLENBQ3ZHO1FBQUEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDekM7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1VBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLHlEQUF5RCxDQUNuRSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FFbkM7WUFBQSxDQUFDLG1CQUFXLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUNyRDtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5REFBeUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUU5SDs7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOENBQThDLENBQzNEO1FBQUEsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUM5QixDQUFDLGNBQUksQ0FDSCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2YsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ2QsQ0FDSCxDQUFDLENBQ0o7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUEsWUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBHbG9iYWxWYXJpYWJsZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuXG5pbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQge1xuICBtZW1vLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcblxuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyBpc0luV29ya2Zsb3dQYWdlIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlSXNDaGF0TW9kZSB9IGZyb20gJy4uLy4uL2hvb2tzJ1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9pdGVtJ1xuXG5jb25zdCBQYW5lbCA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcbiAgY29uc3Qgc2V0U2hvd1BhbmVsID0gdXNlU3RvcmUocyA9PiBzLnNldFNob3dHbG9iYWxWYXJpYWJsZVBhbmVsKVxuICBjb25zdCBpc1dvcmtmbG93UGFnZSA9IGlzSW5Xb3JrZmxvd1BhZ2UoKVxuXG4gIGNvbnN0IGdsb2JhbFZhcmlhYmxlTGlzdDogR2xvYmFsVmFyaWFibGVbXSA9IFtcbiAgICAuLi4oaXNDaGF0TW9kZVxuICAgICAgPyBbe1xuICAgICAgICAgIG5hbWU6ICdjb252ZXJzYXRpb25faWQnLFxuICAgICAgICAgIHZhbHVlX3R5cGU6ICdzdHJpbmcnIGFzIGNvbnN0LFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiB0KCdnbG9iYWxWYXIuZmllbGRzRGVzY3JpcHRpb24uY29udmVyc2F0aW9uSWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogJ2RpYWxvZ19jb3VudCcsXG4gICAgICAgICAgdmFsdWVfdHlwZTogJ251bWJlcicgYXMgY29uc3QsXG4gICAgICAgICAgZGVzY3JpcHRpb246IHQoJ2dsb2JhbFZhci5maWVsZHNEZXNjcmlwdGlvbi5kaWFsb2dDb3VudCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH1dXG4gICAgICA6IFtdKSxcbiAgICB7XG4gICAgICBuYW1lOiAndXNlcl9pZCcsXG4gICAgICB2YWx1ZV90eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlc2NyaXB0aW9uOiB0KCdnbG9iYWxWYXIuZmllbGRzRGVzY3JpcHRpb24udXNlcklkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdhcHBfaWQnLFxuICAgICAgdmFsdWVfdHlwZTogJ3N0cmluZycsXG4gICAgICBkZXNjcmlwdGlvbjogdCgnZ2xvYmFsVmFyLmZpZWxkc0Rlc2NyaXB0aW9uLmFwcElkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICd3b3JrZmxvd19pZCcsXG4gICAgICB2YWx1ZV90eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlc2NyaXB0aW9uOiB0KCdnbG9iYWxWYXIuZmllbGRzRGVzY3JpcHRpb24ud29ya2Zsb3dJZCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnd29ya2Zsb3dfcnVuX2lkJyxcbiAgICAgIHZhbHVlX3R5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ2dsb2JhbFZhci5maWVsZHNEZXNjcmlwdGlvbi53b3JrZmxvd1J1bklkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICAgIC8vIGlzIHdvcmtmbG93XG4gICAgLi4uKChpc1dvcmtmbG93UGFnZSAmJiAhaXNDaGF0TW9kZSlcbiAgICAgID8gW3tcbiAgICAgICAgICBuYW1lOiAndGltZXN0YW1wJyxcbiAgICAgICAgICB2YWx1ZV90eXBlOiAnbnVtYmVyJyBhcyBjb25zdCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogdCgnZ2xvYmFsVmFyLmZpZWxkc0Rlc2NyaXB0aW9uLnRyaWdnZXJUaW1lc3RhbXAnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9XVxuICAgICAgOiBbXSksXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICdyZWxhdGl2ZSBmbGV4IGgtZnVsbCB3LVs0MjBweF0gZmxleC1jb2wgcm91bmRlZC1sLTJ4bCBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYWx0JyxcbiAgICAgICl9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teGwtc2VtaWJvbGQgZmxleCBzaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHAtNCBwYi0wIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgIHt0KCdnbG9iYWxWYXIudGl0bGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTYgdy02IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93UGFuZWwoZmFsc2UpfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHNocmluay0wIHB4LTQgcHktMSB0ZXh0LXRleHQtdGVydGlhcnlcIj57dCgnZ2xvYmFsVmFyLmRlc2NyaXB0aW9uJywgeyBuczogJ3dvcmtmbG93JyB9KX08L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGdyb3cgb3ZlcmZsb3cteS1hdXRvIHJvdW5kZWQtYi0yeGwgcHgtNFwiPlxuICAgICAgICB7Z2xvYmFsVmFyaWFibGVMaXN0Lm1hcChpdGVtID0+IChcbiAgICAgICAgICA8SXRlbVxuICAgICAgICAgICAga2V5PXtpdGVtLm5hbWV9XG4gICAgICAgICAgICBwYXlsb2FkPXtpdGVtfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhQYW5lbClcbiJdfQ==