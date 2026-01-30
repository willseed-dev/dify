"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const development_1 = require("@/app/components/base/icons/src/vender/line/development");
const tooltip_1 = require("@/app/components/base/tooltip");
const classnames_1 = require("@/utils/classnames");
const var_picker_1 = require("./var-picker");
const ContextVar = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { value, options } = props;
    const currItem = options.find(item => item.value === value);
    const notSetVar = !currItem;
    return (<div className={(0, classnames_1.cn)(notSetVar ? 'rounded-bl-xl rounded-br-xl border-[#FEF0C7] bg-[#FEF0C7]' : 'border-components-panel-border-subtle', 'flex h-12 items-center justify-between border-t px-3 ')}>
      <div className="flex shrink-0 items-center space-x-1">
        <div className="p-1">
          <development_1.BracketsX className="h-4 w-4 text-text-accent"/>
        </div>
        <div className="mr-1 text-sm font-medium text-text-secondary">{t('feature.dataSet.queryVariable.title', { ns: 'appDebug' })}</div>
        <tooltip_1.default popupContent={(<div className="w-[180px]">
              {t('feature.dataSet.queryVariable.tip', { ns: 'appDebug' })}
            </div>)}/>
      </div>

      <var_picker_1.default {...props}/>
    </div>);
};
exports.default = React.memo(ContextVar);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHlGQUFtRjtBQUNuRiwyREFBbUQ7QUFDbkQsbURBQXVDO0FBQ3ZDLDZDQUFvQztBQUVwQyxNQUFNLFVBQVUsR0FBYyxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3RDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQTtJQUNoQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQTtJQUMzRCxNQUFNLFNBQVMsR0FBRyxDQUFDLFFBQVEsQ0FBQTtJQUMzQixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywyREFBMkQsQ0FBQyxDQUFDLENBQUMsdUNBQXVDLEVBQUUsdURBQXVELENBQUMsQ0FBQyxDQUM3TDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDbkQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUNsQjtVQUFBLENBQUMsdUJBQVMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLEVBQ2pEO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDLENBQUMscUNBQXFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FDakk7UUFBQSxDQUFDLGlCQUFPLENBQ04sWUFBWSxDQUFDLENBQUMsQ0FDWixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUN4QjtjQUFBLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQzdEO1lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLEVBRU47TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLG9CQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDdkI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFByb3BzIH0gZnJvbSAnLi92YXItcGlja2VyJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBCcmFja2V0c1ggfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2RldmVsb3BtZW50J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Rvb2x0aXAnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBWYXJQaWNrZXIgZnJvbSAnLi92YXItcGlja2VyJ1xuXG5jb25zdCBDb250ZXh0VmFyOiBGQzxQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdmFsdWUsIG9wdGlvbnMgfSA9IHByb3BzXG4gIGNvbnN0IGN1cnJJdGVtID0gb3B0aW9ucy5maW5kKGl0ZW0gPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUpXG4gIGNvbnN0IG5vdFNldFZhciA9ICFjdXJySXRlbVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbihub3RTZXRWYXIgPyAncm91bmRlZC1ibC14bCByb3VuZGVkLWJyLXhsIGJvcmRlci1bI0ZFRjBDN10gYmctWyNGRUYwQzddJyA6ICdib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlJywgJ2ZsZXggaC0xMiBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGJvcmRlci10IHB4LTMgJyl9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlciBzcGFjZS14LTFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTFcIj5cbiAgICAgICAgICA8QnJhY2tldHNYIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LWFjY2VudFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1yLTEgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2ZlYXR1cmUuZGF0YVNldC5xdWVyeVZhcmlhYmxlLnRpdGxlJywgeyBuczogJ2FwcERlYnVnJyB9KX08L2Rpdj5cbiAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICBwb3B1cENvbnRlbnQ9eyhcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1bMTgwcHhdXCI+XG4gICAgICAgICAgICAgIHt0KCdmZWF0dXJlLmRhdGFTZXQucXVlcnlWYXJpYWJsZS50aXAnLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8VmFyUGlja2VyIHsuLi5wcm9wc30gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKENvbnRleHRWYXIpXG4iXX0=