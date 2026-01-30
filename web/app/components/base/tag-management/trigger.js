"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const Trigger = ({ tags, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex w-full cursor-pointer items-center gap-1 overflow-hidden rounded-lg p-1 hover:bg-state-base-hover">
      {!tags.length
            ? (<div className="flex items-center gap-x-0.5 rounded-[5px] border border-dashed border-divider-deep bg-components-badge-bg-dimm px-[5px] py-[3px]">
              <react_1.RiPriceTag3Line className="h-3 w-3 shrink-0 text-text-quaternary"/>
              <div className="system-2xs-medium-uppercase text-nowrap text-text-tertiary">
                {t('tag.addTag', { ns: 'common' })}
              </div>
            </div>)
            : (<>
              {tags.map((content, index) => {
                    return (<div key={index} className="flex items-center gap-x-0.5 rounded-[5px] border border-divider-deep bg-components-badge-bg-dimm px-[5px] py-[3px]">
                      <react_1.RiPriceTag3Line className="h-3 w-3 shrink-0 text-text-quaternary"/>
                      <div className="system-2xs-medium-uppercase text-nowrap text-text-tertiary">
                        {content}
                      </div>
                    </div>);
                })}
            </>)}
    </div>);
};
exports.default = React.memo(Trigger);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyaWdnZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQWtEO0FBQ2xELCtCQUE4QjtBQUM5QixpREFBOEM7QUFNOUMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUNmLElBQUksR0FDUyxFQUFFLEVBQUU7SUFDakIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0dBQXdHLENBQ3JIO01BQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ1gsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtJQUFrSSxDQUMvSTtjQUFBLENBQUMsdUJBQWUsQ0FBQyxTQUFTLENBQUMsdUNBQXVDLEVBQ2xFO2NBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDREQUE0RCxDQUN6RTtnQkFBQSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDcEM7Y0FBQSxFQUFFLEdBQUcsQ0FDUDtZQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7WUFDSCxDQUFDLENBQUMsQ0FDRSxFQUNFO2NBQUEsQ0FDRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUMxQixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ1gsU0FBUyxDQUFDLG9IQUFvSCxDQUU5SDtzQkFBQSxDQUFDLHVCQUFlLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxFQUNsRTtzQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNERBQTRELENBQ3pFO3dCQUFBLENBQUMsT0FBTyxDQUNWO3NCQUFBLEVBQUUsR0FBRyxDQUNQO29CQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtnQkFDSCxDQUFDLENBQ0gsQ0FDRjtZQUFBLEdBQUcsQ0FDSixDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJpUHJpY2VUYWczTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcblxudHlwZSBUcmlnZ2VyUHJvcHMgPSB7XG4gIHRhZ3M6IHN0cmluZ1tdXG59XG5cbmNvbnN0IFRyaWdnZXIgPSAoe1xuICB0YWdzLFxufTogVHJpZ2dlclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTEgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtbGcgcC0xIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIj5cbiAgICAgIHshdGFncy5sZW5ndGhcbiAgICAgICAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LTAuNSByb3VuZGVkLVs1cHhdIGJvcmRlciBib3JkZXItZGFzaGVkIGJvcmRlci1kaXZpZGVyLWRlZXAgYmctY29tcG9uZW50cy1iYWRnZS1iZy1kaW1tIHB4LVs1cHhdIHB5LVszcHhdXCI+XG4gICAgICAgICAgICAgIDxSaVByaWNlVGFnM0xpbmUgY2xhc3NOYW1lPVwiaC0zIHctMyBzaHJpbmstMCB0ZXh0LXRleHQtcXVhdGVybmFyeVwiIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtbm93cmFwIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgIHt0KCd0YWcuYWRkVGFnJywgeyBuczogJ2NvbW1vbicgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICA6IChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0YWdzLm1hcCgoY29udGVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LTAuNSByb3VuZGVkLVs1cHhdIGJvcmRlciBib3JkZXItZGl2aWRlci1kZWVwIGJnLWNvbXBvbmVudHMtYmFkZ2UtYmctZGltbSBweC1bNXB4XSBweS1bM3B4XVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8UmlQcmljZVRhZzNMaW5lIGNsYXNzTmFtZT1cImgtMyB3LTMgc2hyaW5rLTAgdGV4dC10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtbm93cmFwIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbnRlbnR9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhUcmlnZ2VyKVxuIl19