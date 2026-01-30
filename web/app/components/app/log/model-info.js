"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const model_icon_1 = require("@/app/components/header/account-setting/model-provider-page/model-icon");
const model_name_1 = require("@/app/components/header/account-setting/model-provider-page/model-name");
const classnames_1 = require("@/utils/classnames");
const PARAM_MAP = {
    temperature: 'Temperature',
    top_p: 'Top P',
    presence_penalty: 'Presence Penalty',
    max_tokens: 'Max Token',
    stop: 'Stop',
    frequency_penalty: 'Frequency Penalty',
};
const ModelInfo = ({ model, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const modelName = model.name;
    const provideName = model.provider;
    const { currentModel, currentProvider, } = (0, hooks_1.useTextGenerationCurrentProviderAndModelAndModelList)({ provider: provideName, model: modelName });
    const [open, setOpen] = React.useState(false);
    const getParamValue = (param) => {
        const value = model.completion_params?.[param] || '-';
        if (param === 'stop') {
            if (Array.isArray(value))
                return value.join(',');
            else
                return '-';
        }
        return value;
    };
    return (<div className={(0, classnames_1.cn)('flex items-center rounded-lg')}>
      <div className="mr-px flex h-8 shrink-0 items-center gap-1 rounded-l-lg bg-components-input-bg-normal pl-1.5 pr-2">
        <model_icon_1.default className="!h-5 !w-5" provider={currentProvider} modelName={currentModel?.model}/>
        <model_name_1.default modelItem={currentModel} showMode/>
      </div>
      <portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={setOpen} placement="bottom-end" offset={4}>
        <div className="relative">
          <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => setOpen(v => !v)} className="block">
            <div className={(0, classnames_1.cn)('cursor-pointer rounded-r-lg bg-components-button-tertiary-bg p-2 hover:bg-components-button-tertiary-bg-hover', open && 'bg-components-button-tertiary-bg-hover')}>
              <react_1.RiInformation2Line className="h-4 w-4 text-text-tertiary"/>
            </div>
          </portal_to_follow_elem_1.PortalToFollowElemTrigger>
          <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[1002]">
            <div className="relative w-[280px] overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border bg-components-panel-bg px-4 pb-2 pt-3 shadow-xl">
              <div className="system-sm-semibold-uppercase mb-1 h-6 text-text-secondary">{t('detail.modelParams', { ns: 'appLog' })}</div>
              <div className="py-1">
                {['temperature', 'top_p', 'presence_penalty', 'max_tokens', 'stop'].map((param, index) => {
            return (<div className="flex justify-between py-1.5" key={index}>
                      <span className="system-xs-medium-uppercase text-text-tertiary">{PARAM_MAP[param]}</span>
                      <span className="system-xs-medium-uppercase text-text-secondary">{getParamValue(param)}</span>
                    </div>);
        })}
              </div>
            </div>
          </portal_to_follow_elem_1.PortalToFollowElemContent>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElem>
    </div>);
};
exports.default = React.memo(ModelInfo);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtaW5mby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGVsLWluZm8udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBRXlCO0FBQ3pCLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMsdUZBSW9EO0FBQ3BELDZGQUF3STtBQUN4SSx1R0FBOEY7QUFDOUYsdUdBQThGO0FBQzlGLG1EQUF1QztBQUV2QyxNQUFNLFNBQVMsR0FBRztJQUNoQixXQUFXLEVBQUUsYUFBYTtJQUMxQixLQUFLLEVBQUUsT0FBTztJQUNkLGdCQUFnQixFQUFFLGtCQUFrQjtJQUNwQyxVQUFVLEVBQUUsV0FBVztJQUN2QixJQUFJLEVBQUUsTUFBTTtJQUNaLGlCQUFpQixFQUFFLG1CQUFtQjtDQUN2QyxDQUFBO0FBTUQsTUFBTSxTQUFTLEdBQWMsQ0FBQyxFQUM1QixLQUFLLEdBQ04sRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUE7SUFDNUIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQWUsQ0FBQTtJQUN6QyxNQUFNLEVBQ0osWUFBWSxFQUNaLGVBQWUsR0FDaEIsR0FBRyxJQUFBLDREQUFvRCxFQUN0RCxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUM1QyxDQUFBO0lBRUQsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTdDLE1BQU0sYUFBYSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7UUFDdEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFBO1FBQ3JELElBQUksS0FBSyxLQUFLLE1B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QyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgUmlJbmZvcm1hdGlvbjJMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQge1xuICBQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nXG5pbXBvcnQgeyB1c2VUZXh0R2VuZXJhdGlvbkN1cnJlbnRQcm92aWRlckFuZE1vZGVsQW5kTW9kZWxMaXN0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnXG5pbXBvcnQgTW9kZWxJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL21vZGVsLWljb24nXG5pbXBvcnQgTW9kZWxOYW1lIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL21vZGVsLW5hbWUnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxuY29uc3QgUEFSQU1fTUFQID0ge1xuICB0ZW1wZXJhdHVyZTogJ1RlbXBlcmF0dXJlJyxcbiAgdG9wX3A6ICdUb3AgUCcsXG4gIHByZXNlbmNlX3BlbmFsdHk6ICdQcmVzZW5jZSBQZW5hbHR5JyxcbiAgbWF4X3Rva2VuczogJ01heCBUb2tlbicsXG4gIHN0b3A6ICdTdG9wJyxcbiAgZnJlcXVlbmN5X3BlbmFsdHk6ICdGcmVxdWVuY3kgUGVuYWx0eScsXG59XG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1vZGVsOiBhbnlcbn1cblxuY29uc3QgTW9kZWxJbmZvOiBGQzxQcm9wcz4gPSAoe1xuICBtb2RlbCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IG1vZGVsTmFtZSA9IG1vZGVsLm5hbWVcbiAgY29uc3QgcHJvdmlkZU5hbWUgPSBtb2RlbC5wcm92aWRlciBhcyBhbnlcbiAgY29uc3Qge1xuICAgIGN1cnJlbnRNb2RlbCxcbiAgICBjdXJyZW50UHJvdmlkZXIsXG4gIH0gPSB1c2VUZXh0R2VuZXJhdGlvbkN1cnJlbnRQcm92aWRlckFuZE1vZGVsQW5kTW9kZWxMaXN0KFxuICAgIHsgcHJvdmlkZXI6IHByb3ZpZGVOYW1lLCBtb2RlbDogbW9kZWxOYW1lIH0sXG4gIClcblxuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSlcblxuICBjb25zdCBnZXRQYXJhbVZhbHVlID0gKHBhcmFtOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB2YWx1ZSA9IG1vZGVsLmNvbXBsZXRpb25fcGFyYW1zPy5bcGFyYW1dIHx8ICctJ1xuICAgIGlmIChwYXJhbSA9PT0gJ3N0b3AnKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB2YWx1ZS5qb2luKCcsJylcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICctJ1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcnKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1yLXB4IGZsZXggaC04IHNocmluay0wIGl0ZW1zLWNlbnRlciBnYXAtMSByb3VuZGVkLWwtbGcgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcGwtMS41IHByLTJcIj5cbiAgICAgICAgPE1vZGVsSWNvblxuICAgICAgICAgIGNsYXNzTmFtZT1cIiFoLTUgIXctNVwiXG4gICAgICAgICAgcHJvdmlkZXI9e2N1cnJlbnRQcm92aWRlcn1cbiAgICAgICAgICBtb2RlbE5hbWU9e2N1cnJlbnRNb2RlbD8ubW9kZWx9XG4gICAgICAgIC8+XG4gICAgICAgIDxNb2RlbE5hbWVcbiAgICAgICAgICBtb2RlbEl0ZW09e2N1cnJlbnRNb2RlbCF9XG4gICAgICAgICAgc2hvd01vZGVcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbVxuICAgICAgICBvcGVuPXtvcGVufVxuICAgICAgICBvbk9wZW5DaGFuZ2U9e3NldE9wZW59XG4gICAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1lbmRcIlxuICAgICAgICBvZmZzZXQ9ezR9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbih2ID0+ICF2KX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImJsb2NrXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICdjdXJzb3ItcG9pbnRlciByb3VuZGVkLXItbGcgYmctY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktYmcgcC0yIGhvdmVyOmJnLWNvbXBvbmVudHMtYnV0dG9uLXRlcnRpYXJ5LWJnLWhvdmVyJyxcbiAgICAgICAgICAgICAgb3BlbiAmJiAnYmctY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktYmctaG92ZXInLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFJpSW5mb3JtYXRpb24yTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQgY2xhc3NOYW1lPVwiei1bMTAwMl1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgdy1bMjgwcHhdIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBweC00IHBiLTIgcHQtMyBzaGFkb3cteGxcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQtdXBwZXJjYXNlIG1iLTEgaC02IHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZGV0YWlsLm1vZGVsUGFyYW1zJywgeyBuczogJ2FwcExvZycgfSl9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHktMVwiPlxuICAgICAgICAgICAgICAgIHtbJ3RlbXBlcmF0dXJlJywgJ3RvcF9wJywgJ3ByZXNlbmNlX3BlbmFsdHknLCAnbWF4X3Rva2VucycsICdzdG9wJ10ubWFwKChwYXJhbTogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHB5LTEuNVwiIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPntQQVJBTV9NQVBbcGFyYW0gYXMga2V5b2YgdHlwZW9mIFBBUkFNX01BUF19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57Z2V0UGFyYW1WYWx1ZShwYXJhbSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oTW9kZWxJbmZvKVxuIl19