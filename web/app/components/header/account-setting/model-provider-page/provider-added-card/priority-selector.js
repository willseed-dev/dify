"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@headlessui/react");
const react_2 = require("@remixicon/react");
const react_3 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const classnames_1 = require("@/utils/classnames");
const declarations_1 = require("../declarations");
const Selector = ({ value, onSelect, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const options = [
        {
            key: declarations_1.PreferredProviderTypeEnum.custom,
            text: t('modelProvider.apiKey', { ns: 'common' }),
        },
        {
            key: declarations_1.PreferredProviderTypeEnum.system,
            text: t('modelProvider.quota', { ns: 'common' }),
        },
    ];
    return (<react_1.Popover className="relative">
      <react_1.PopoverButton as="div">
        {({ open }) => (<button_1.default className={(0, classnames_1.cn)('h-6 w-6 rounded-md px-0', open && 'bg-components-button-secondary-bg-hover')}>
              <react_2.RiMoreFill className="h-3 w-3"/>
            </button_1.default>)}
      </react_1.PopoverButton>
      <react_1.Transition as={react_3.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
        <react_1.PopoverPanel className="absolute right-0 top-7 z-10 w-[144px] rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg shadow-lg">
          <div className="p-1">
            <div className="px-3 pb-1 pt-2 text-sm font-medium text-text-secondary">{t('modelProvider.card.priorityUse', { ns: 'common' })}</div>
            {options.map(option => (<react_1.PopoverButton as={react_3.Fragment} key={option.key}>
                  <div className="flex h-9 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-text-secondary hover:bg-components-panel-on-panel-item-bg-hover" onClick={() => onSelect(option.key)}>
                    <div className="grow">{option.text}</div>
                    {value === option.key && <react_2.RiCheckLine className="h-4 w-4 text-text-accent"/>}
                  </div>
                </react_1.PopoverButton>))}
          </div>
        </react_1.PopoverPanel>
      </react_1.Transition>
    </react_1.Popover>);
};
exports.default = Selector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpb3JpdHktc2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmlvcml0eS1zZWxlY3Rvci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBb0Y7QUFDcEYsNENBR3lCO0FBQ3pCLGlDQUFnQztBQUNoQyxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELG1EQUF1QztBQUN2QyxrREFBMkQ7QUFNM0QsTUFBTSxRQUFRLEdBQXNCLENBQUMsRUFDbkMsS0FBSyxFQUNMLFFBQVEsR0FDVCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUc7UUFDZDtZQUNFLEdBQUcsRUFBRSx3Q0FBeUIsQ0FBQyxNQUFNO1lBQ3JDLElBQUksRUFBRSxDQUFDLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7U0FDbEQ7UUFDRDtZQUNFLEdBQUcsRUFBRSx3Q0FBeUIsQ0FBQyxNQUFNO1lBQ3JDLElBQUksRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7U0FDakQ7S0FDRixDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsZUFBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQzNCO01BQUEsQ0FBQyxxQkFBYSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQ3JCO1FBQUEsQ0FDRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQ1osQ0FBQyxnQkFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNuQix5QkFBeUIsRUFDekIsSUFBSSxJQUFJLHlDQUF5QyxDQUNsRCxDQUFDLENBRUE7Y0FBQSxDQUFDLGtCQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDakM7WUFBQSxFQUFFLGdCQUFNLENBQUMsQ0FFYixDQUNGO01BQUEsRUFBRSxxQkFBYSxDQUNmO01BQUEsQ0FBQyxrQkFBVSxDQUNULEVBQUUsQ0FBQyxDQUFDLGdCQUFRLENBQUMsQ0FDYixLQUFLLENBQUMsaUNBQWlDLENBQ3ZDLFNBQVMsQ0FBQyxhQUFhLENBQ3ZCLE9BQU8sQ0FBQyxXQUFXLENBRW5CO1FBQUEsQ0FBQyxvQkFBWSxDQUFDLFNBQVMsQ0FBQyxpSUFBaUksQ0FDdko7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUNsQjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNwSTtZQUFBLENBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQ3BCLENBQUMscUJBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUMzQztrQkFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsbUpBQW1KLENBQzdKLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FFcEM7b0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQ3hDO29CQUFBLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsRUFBRyxDQUMvRTtrQkFBQSxFQUFFLEdBQUcsQ0FDUDtnQkFBQSxFQUFFLHFCQUFhLENBQUMsQ0FDakIsQ0FDSCxDQUNGO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLG9CQUFZLENBQ2hCO01BQUEsRUFBRSxrQkFBVSxDQUNkO0lBQUEsRUFBRSxlQUFPLENBQUMsQ0FDWCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgUG9wb3ZlciwgUG9wb3ZlckJ1dHRvbiwgUG9wb3ZlclBhbmVsLCBUcmFuc2l0aW9uIH0gZnJvbSAnQGhlYWRsZXNzdWkvcmVhY3QnXG5pbXBvcnQge1xuICBSaUNoZWNrTGluZSxcbiAgUmlNb3JlRmlsbCxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IFByZWZlcnJlZFByb3ZpZGVyVHlwZUVudW0gfSBmcm9tICcuLi9kZWNsYXJhdGlvbnMnXG5cbnR5cGUgU2VsZWN0b3JQcm9wcyA9IHtcbiAgdmFsdWU/OiBzdHJpbmdcbiAgb25TZWxlY3Q6IChrZXk6IFByZWZlcnJlZFByb3ZpZGVyVHlwZUVudW0pID0+IHZvaWRcbn1cbmNvbnN0IFNlbGVjdG9yOiBGQzxTZWxlY3RvclByb3BzPiA9ICh7XG4gIHZhbHVlLFxuICBvblNlbGVjdCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IG9wdGlvbnMgPSBbXG4gICAge1xuICAgICAga2V5OiBQcmVmZXJyZWRQcm92aWRlclR5cGVFbnVtLmN1c3RvbSxcbiAgICAgIHRleHQ6IHQoJ21vZGVsUHJvdmlkZXIuYXBpS2V5JywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6IFByZWZlcnJlZFByb3ZpZGVyVHlwZUVudW0uc3lzdGVtLFxuICAgICAgdGV4dDogdCgnbW9kZWxQcm92aWRlci5xdW90YScsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgIH0sXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxQb3BvdmVyIGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICA8UG9wb3ZlckJ1dHRvbiBhcz1cImRpdlwiPlxuICAgICAgICB7XG4gICAgICAgICAgKHsgb3BlbiB9KSA9PiAoXG4gICAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICdoLTYgdy02IHJvdW5kZWQtbWQgcHgtMCcsXG4gICAgICAgICAgICAgIG9wZW4gJiYgJ2JnLWNvbXBvbmVudHMtYnV0dG9uLXNlY29uZGFyeS1iZy1ob3ZlcicsXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UmlNb3JlRmlsbCBjbGFzc05hbWU9XCJoLTMgdy0zXCIgLz5cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9Qb3BvdmVyQnV0dG9uPlxuICAgICAgPFRyYW5zaXRpb25cbiAgICAgICAgYXM9e0ZyYWdtZW50fVxuICAgICAgICBsZWF2ZT1cInRyYW5zaXRpb24gZWFzZS1pbiBkdXJhdGlvbi0xMDBcIlxuICAgICAgICBsZWF2ZUZyb209XCJvcGFjaXR5LTEwMFwiXG4gICAgICAgIGxlYXZlVG89XCJvcGFjaXR5LTBcIlxuICAgICAgPlxuICAgICAgICA8UG9wb3ZlclBhbmVsIGNsYXNzTmFtZT1cImFic29sdXRlIHJpZ2h0LTAgdG9wLTcgei0xMCB3LVsxNDRweF0gcm91bmRlZC1sZyBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3ctbGdcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC0zIHBiLTEgcHQtMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnbW9kZWxQcm92aWRlci5jYXJkLnByaW9yaXR5VXNlJywgeyBuczogJ2NvbW1vbicgfSl9PC9kaXY+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG9wdGlvbnMubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgICAgICAgPFBvcG92ZXJCdXR0b24gYXM9e0ZyYWdtZW50fSBrZXk9e29wdGlvbi5rZXl9PlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtOSBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgcHgtMyB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6YmctY29tcG9uZW50cy1wYW5lbC1vbi1wYW5lbC1pdGVtLWJnLWhvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Qob3B0aW9uLmtleSl9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPntvcHRpb24udGV4dH08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge3ZhbHVlID09PSBvcHRpb24ua2V5ICYmIDxSaUNoZWNrTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC1hY2NlbnRcIiAvPn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvUG9wb3ZlckJ1dHRvbj5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Qb3BvdmVyUGFuZWw+XG4gICAgICA8L1RyYW5zaXRpb24+XG4gICAgPC9Qb3BvdmVyPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdG9yXG4iXX0=