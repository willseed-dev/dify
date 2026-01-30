"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const divider_1 = require("@/app/components/base/divider");
const classnames_1 = require("@/utils/classnames");
const IconMap = {
    success: {
        Icon: react_1.RiCheckboxCircleFill,
        color: 'text-text-success',
    },
    error: {
        Icon: react_1.RiErrorWarningFill,
        color: 'text-text-destructive',
    },
    warning: {
        Icon: react_1.RiAlertFill,
        color: 'text-text-warning-secondary',
    },
    info: {
        Icon: react_1.RiInformation2Fill,
        color: 'text-text-accent',
    },
};
const getIcon = (type) => {
    return IconMap[type];
};
const StatusAction = ({ type = 'info', description, actionText, onAction, disabled, }) => {
    const { Icon, color } = getIcon(type);
    return (<div className="relative flex h-[34px] items-center rounded-lg border border-components-panel-border bg-components-panel-bg-blur pl-2 pr-3 shadow-xs">
      <div className={`absolute inset-0 rounded-lg opacity-40 ${(type === 'success' && 'bg-[linear-gradient(92deg,rgba(23,178,106,0.25)_0%,rgba(255,255,255,0.00)_100%)]')
            || (type === 'warning' && 'bg-[linear-gradient(92deg,rgba(247,144,9,0.25)_0%,rgba(255,255,255,0.00)_100%)]')
            || (type === 'error' && 'bg-[linear-gradient(92deg,rgba(240,68,56,0.25)_0%,rgba(255,255,255,0.00)_100%)]')
            || (type === 'info' && 'bg-[linear-gradient(92deg,rgba(11,165,236,0.25)_0%,rgba(255,255,255,0.00)_100%)]')}`}/>
      <div className="relative z-10 flex h-full items-center space-x-2">
        <Icon className={(0, classnames_1.cn)('h-4 w-4', color)}/>
        <div className="text-[13px] font-normal text-text-secondary">{description}</div>
        {onAction && (<>
            <divider_1.default type="vertical" className="!h-4"/>
            <div onClick={onAction} className={(0, classnames_1.cn)('cursor-pointer text-[13px] font-semibold text-text-accent', disabled && 'cursor-not-allowed text-text-disabled')}>{actionText}</div>
          </>)}
      </div>
    </div>);
};
exports.default = React.memo(StatusAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLXdpdGgtYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdHVzLXdpdGgtYWN0aW9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLDRDQUE0RztBQUM1RywrQkFBOEI7QUFDOUIsMkRBQW1EO0FBQ25ELG1EQUF1QztBQVd2QyxNQUFNLE9BQU8sR0FBRztJQUNkLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSw0QkFBb0I7UUFDMUIsS0FBSyxFQUFFLG1CQUFtQjtLQUMzQjtJQUNELEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSwwQkFBa0I7UUFDeEIsS0FBSyxFQUFFLHVCQUF1QjtLQUMvQjtJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxtQkFBVztRQUNqQixLQUFLLEVBQUUsNkJBQTZCO0tBQ3JDO0lBQ0QsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLDBCQUFrQjtRQUN4QixLQUFLLEVBQUUsa0JBQWtCO0tBQzFCO0NBQ0YsQ0FBQTtBQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUU7SUFDL0IsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxZQUFZLEdBQWMsQ0FBQyxFQUMvQixJQUFJLEdBQUcsTUFBTSxFQUNiLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFFBQVEsR0FDVCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNyQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNJQUFzSSxDQUNuSjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNiLDBDQUEwQyxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksa0ZBQWtGLENBQUM7ZUFDakosQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLGlGQUFpRixDQUFDO2VBQ3pHLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxpRkFBaUYsQ0FBQztlQUN2RyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksa0ZBQWtGLENBQ3pHLEVBQ0YsQ0FBQyxFQUVEO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtEQUFrRCxDQUMvRDtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUN0QztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FDL0U7UUFBQSxDQUFDLFFBQVEsSUFBSSxDQUNYLEVBQ0U7WUFBQSxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUN6QztZQUFBLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDJEQUEyRCxFQUFFLFFBQVEsSUFBSSx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLENBQzVLO1VBQUEsR0FBRyxDQUNKLENBQ0g7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFJpQWxlcnRGaWxsLCBSaUNoZWNrYm94Q2lyY2xlRmlsbCwgUmlFcnJvcldhcm5pbmdGaWxsLCBSaUluZm9ybWF0aW9uMkZpbGwgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG50eXBlIFN0YXR1cyA9ICdzdWNjZXNzJyB8ICdlcnJvcicgfCAnd2FybmluZycgfCAnaW5mbydcbnR5cGUgUHJvcHMgPSB7XG4gIHR5cGU/OiBTdGF0dXNcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xuICBhY3Rpb25UZXh0Pzogc3RyaW5nXG4gIG9uQWN0aW9uPzogKCkgPT4gdm9pZFxuICBkaXNhYmxlZD86IGJvb2xlYW5cbn1cblxuY29uc3QgSWNvbk1hcCA9IHtcbiAgc3VjY2Vzczoge1xuICAgIEljb246IFJpQ2hlY2tib3hDaXJjbGVGaWxsLFxuICAgIGNvbG9yOiAndGV4dC10ZXh0LXN1Y2Nlc3MnLFxuICB9LFxuICBlcnJvcjoge1xuICAgIEljb246IFJpRXJyb3JXYXJuaW5nRmlsbCxcbiAgICBjb2xvcjogJ3RleHQtdGV4dC1kZXN0cnVjdGl2ZScsXG4gIH0sXG4gIHdhcm5pbmc6IHtcbiAgICBJY29uOiBSaUFsZXJ0RmlsbCxcbiAgICBjb2xvcjogJ3RleHQtdGV4dC13YXJuaW5nLXNlY29uZGFyeScsXG4gIH0sXG4gIGluZm86IHtcbiAgICBJY29uOiBSaUluZm9ybWF0aW9uMkZpbGwsXG4gICAgY29sb3I6ICd0ZXh0LXRleHQtYWNjZW50JyxcbiAgfSxcbn1cblxuY29uc3QgZ2V0SWNvbiA9ICh0eXBlOiBTdGF0dXMpID0+IHtcbiAgcmV0dXJuIEljb25NYXBbdHlwZV1cbn1cblxuY29uc3QgU3RhdHVzQWN0aW9uOiBGQzxQcm9wcz4gPSAoe1xuICB0eXBlID0gJ2luZm8nLFxuICBkZXNjcmlwdGlvbixcbiAgYWN0aW9uVGV4dCxcbiAgb25BY3Rpb24sXG4gIGRpc2FibGVkLFxufSkgPT4ge1xuICBjb25zdCB7IEljb24sIGNvbG9yIH0gPSBnZXRJY29uKHR5cGUpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGgtWzM0cHhdIGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHBsLTIgcHItMyBzaGFkb3cteHNcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtcbiAgICAgICAgYGFic29sdXRlIGluc2V0LTAgcm91bmRlZC1sZyBvcGFjaXR5LTQwICR7KHR5cGUgPT09ICdzdWNjZXNzJyAmJiAnYmctW2xpbmVhci1ncmFkaWVudCg5MmRlZyxyZ2JhKDIzLDE3OCwxMDYsMC4yNSlfMCUscmdiYSgyNTUsMjU1LDI1NSwwLjAwKV8xMDAlKV0nKVxuICAgICAgICB8fCAodHlwZSA9PT0gJ3dhcm5pbmcnICYmICdiZy1bbGluZWFyLWdyYWRpZW50KDkyZGVnLHJnYmEoMjQ3LDE0NCw5LDAuMjUpXzAlLHJnYmEoMjU1LDI1NSwyNTUsMC4wMClfMTAwJSldJylcbiAgICAgICAgfHwgKHR5cGUgPT09ICdlcnJvcicgJiYgJ2JnLVtsaW5lYXItZ3JhZGllbnQoOTJkZWcscmdiYSgyNDAsNjgsNTYsMC4yNSlfMCUscmdiYSgyNTUsMjU1LDI1NSwwLjAwKV8xMDAlKV0nKVxuICAgICAgICB8fCAodHlwZSA9PT0gJ2luZm8nICYmICdiZy1bbGluZWFyLWdyYWRpZW50KDkyZGVnLHJnYmEoMTEsMTY1LDIzNiwwLjI1KV8wJSxyZ2JhKDI1NSwyNTUsMjU1LDAuMDApXzEwMCUpXScpXG4gICAgICAgIH1gXG4gICAgICB9XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIGZsZXggaC1mdWxsIGl0ZW1zLWNlbnRlciBzcGFjZS14LTJcIj5cbiAgICAgICAgPEljb24gY2xhc3NOYW1lPXtjbignaC00IHctNCcsIGNvbG9yKX0gLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxM3B4XSBmb250LW5vcm1hbCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e2Rlc2NyaXB0aW9ufTwvZGl2PlxuICAgICAgICB7b25BY3Rpb24gJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8RGl2aWRlciB0eXBlPVwidmVydGljYWxcIiBjbGFzc05hbWU9XCIhaC00XCIgLz5cbiAgICAgICAgICAgIDxkaXYgb25DbGljaz17b25BY3Rpb259IGNsYXNzTmFtZT17Y24oJ2N1cnNvci1wb2ludGVyIHRleHQtWzEzcHhdIGZvbnQtc2VtaWJvbGQgdGV4dC10ZXh0LWFjY2VudCcsIGRpc2FibGVkICYmICdjdXJzb3Itbm90LWFsbG93ZWQgdGV4dC10ZXh0LWRpc2FibGVkJyl9PnthY3Rpb25UZXh0fTwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oU3RhdHVzQWN0aW9uKVxuIl19