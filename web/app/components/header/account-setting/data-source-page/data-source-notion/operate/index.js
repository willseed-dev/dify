"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Operate;
const react_1 = require("@headlessui/react");
const react_2 = require("@remixicon/react");
const react_3 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const common_1 = require("@/service/common");
const use_common_1 = require("@/service/use-common");
const classnames_1 = require("@/utils/classnames");
function Operate({ payload, onAuthAgain, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const invalidateDataSourceIntegrates = (0, use_common_1.useInvalidDataSourceIntegrates)();
    const updateIntegrates = () => {
        toast_1.default.notify({
            type: 'success',
            message: t('api.success', { ns: 'common' }),
        });
        invalidateDataSourceIntegrates();
    };
    const handleSync = async () => {
        await (0, common_1.syncDataSourceNotion)({ url: `/oauth/data-source/notion/${payload.id}/sync` });
        updateIntegrates();
    };
    const handleRemove = async () => {
        await (0, common_1.updateDataSourceNotionAction)({ url: `/data-source/integrates/${payload.id}/disable` });
        updateIntegrates();
    };
    return (<react_1.Menu as="div" className="relative inline-block text-left">
      {({ open }) => (<>
            <react_1.MenuButton className={(0, classnames_1.cn)('flex h-8 w-8 items-center justify-center rounded-lg hover:bg-state-base-hover', open && 'bg-state-base-hover')}>
              <react_2.RiMoreFill className="h-4 w-4 text-text-secondary"/>
            </react_1.MenuButton>
            <react_1.Transition as={react_3.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <react_1.MenuItems className="absolute right-0 top-9 w-60 max-w-80 origin-top-right rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-lg backdrop-blur-sm">
                <div className="px-1 py-1">
                  <react_1.MenuItem>
                    <div className="flex cursor-pointer rounded-lg px-3 py-2 hover:bg-state-base-hover" onClick={onAuthAgain}>
                      <react_2.RiStickyNoteAddLine className="mr-2 mt-[2px] h-4 w-4 text-text-tertiary"/>
                      <div>
                        <div className="system-sm-semibold text-text-secondary">{t('dataSource.notion.changeAuthorizedPages', { ns: 'common' })}</div>
                        <div className="system-xs-regular text-text-tertiary">
                          {payload.total}
                          {' '}
                          {t('dataSource.notion.pagesAuthorized', { ns: 'common' })}
                        </div>
                      </div>
                    </div>
                  </react_1.MenuItem>
                  <react_1.MenuItem>
                    <div className="flex cursor-pointer rounded-lg px-3 py-2 hover:bg-state-base-hover" onClick={handleSync}>
                      <react_2.RiLoopLeftLine className="mr-2 mt-[2px] h-4 w-4 text-text-tertiary"/>
                      <div className="system-sm-semibold text-text-secondary">{t('dataSource.notion.sync', { ns: 'common' })}</div>
                    </div>
                  </react_1.MenuItem>
                </div>
                <react_1.MenuItem>
                  <div className="border-t border-divider-subtle p-1">
                    <div className="flex cursor-pointer rounded-lg px-3 py-2 hover:bg-state-base-hover" onClick={handleRemove}>
                      <react_2.RiDeleteBinLine className="mr-2 mt-[2px] h-4 w-4 text-text-tertiary"/>
                      <div className="system-sm-semibold text-text-secondary">{t('dataSource.notion.remove', { ns: 'common' })}</div>
                    </div>
                  </div>
                </react_1.MenuItem>
              </react_1.MenuItems>
            </react_1.Transition>
          </>)}
    </react_1.Menu>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFzQlosMEJBZ0ZDO0FBckdELDZDQUFxRjtBQUNyRiw0Q0FLeUI7QUFDekIsaUNBQWdDO0FBQ2hDLGlEQUE4QztBQUM5Qyx1REFBK0M7QUFDL0MsNkNBQXFGO0FBQ3JGLHFEQUFxRTtBQUNyRSxtREFBdUM7QUFTdkMsU0FBd0IsT0FBTyxDQUFDLEVBQzlCLE9BQU8sRUFDUCxXQUFXLEdBQ0U7SUFDYixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSw4QkFBOEIsR0FBRyxJQUFBLDJDQUE4QixHQUFFLENBQUE7SUFFdkUsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7UUFDNUIsZUFBSyxDQUFDLE1BQU0sQ0FBQztZQUNYLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7U0FDNUMsQ0FBQyxDQUFBO1FBQ0YsOEJBQThCLEVBQUUsQ0FBQTtJQUNsQyxDQUFDLENBQUE7SUFDRCxNQUFNLFVBQVUsR0FBRyxLQUFLLElBQUksRUFBRTtRQUM1QixNQUFNLElBQUEsNkJBQW9CLEVBQUMsRUFBRSxHQUFHLEVBQUUsNkJBQTZCLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDbkYsZ0JBQWdCLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUE7SUFDRCxNQUFNLFlBQVksR0FBRyxLQUFLLElBQUksRUFBRTtRQUM5QixNQUFNLElBQUEscUNBQTRCLEVBQUMsRUFBRSxHQUFHLEVBQUUsMkJBQTJCLE9BQU8sQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDNUYsZ0JBQWdCLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUE7SUFFRCxPQUFPLENB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Q0FDYjtZQUFBLEVBQUUsa0JBQVUsQ0FDZDtVQUFBLEdBQUcsQ0FFUCxDQUNGO0lBQUEsRUFBRSxZQUFJLENBQUMsQ0FDUixDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgTWVudSwgTWVudUJ1dHRvbiwgTWVudUl0ZW0sIE1lbnVJdGVtcywgVHJhbnNpdGlvbiB9IGZyb20gJ0BoZWFkbGVzc3VpL3JlYWN0J1xuaW1wb3J0IHtcbiAgUmlEZWxldGVCaW5MaW5lLFxuICBSaUxvb3BMZWZ0TGluZSxcbiAgUmlNb3JlRmlsbCxcbiAgUmlTdGlja3lOb3RlQWRkTGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgc3luY0RhdGFTb3VyY2VOb3Rpb24sIHVwZGF0ZURhdGFTb3VyY2VOb3Rpb25BY3Rpb24gfSBmcm9tICdAL3NlcnZpY2UvY29tbW9uJ1xuaW1wb3J0IHsgdXNlSW52YWxpZERhdGFTb3VyY2VJbnRlZ3JhdGVzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxudHlwZSBPcGVyYXRlUHJvcHMgPSB7XG4gIHBheWxvYWQ6IHtcbiAgICBpZDogc3RyaW5nXG4gICAgdG90YWw6IG51bWJlclxuICB9XG4gIG9uQXV0aEFnYWluOiAoKSA9PiB2b2lkXG59XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBPcGVyYXRlKHtcbiAgcGF5bG9hZCxcbiAgb25BdXRoQWdhaW4sXG59OiBPcGVyYXRlUHJvcHMpIHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGludmFsaWRhdGVEYXRhU291cmNlSW50ZWdyYXRlcyA9IHVzZUludmFsaWREYXRhU291cmNlSW50ZWdyYXRlcygpXG5cbiAgY29uc3QgdXBkYXRlSW50ZWdyYXRlcyA9ICgpID0+IHtcbiAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgbWVzc2FnZTogdCgnYXBpLnN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICB9KVxuICAgIGludmFsaWRhdGVEYXRhU291cmNlSW50ZWdyYXRlcygpXG4gIH1cbiAgY29uc3QgaGFuZGxlU3luYyA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCBzeW5jRGF0YVNvdXJjZU5vdGlvbih7IHVybDogYC9vYXV0aC9kYXRhLXNvdXJjZS9ub3Rpb24vJHtwYXlsb2FkLmlkfS9zeW5jYCB9KVxuICAgIHVwZGF0ZUludGVncmF0ZXMoKVxuICB9XG4gIGNvbnN0IGhhbmRsZVJlbW92ZSA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB1cGRhdGVEYXRhU291cmNlTm90aW9uQWN0aW9uKHsgdXJsOiBgL2RhdGEtc291cmNlL2ludGVncmF0ZXMvJHtwYXlsb2FkLmlkfS9kaXNhYmxlYCB9KVxuICAgIHVwZGF0ZUludGVncmF0ZXMoKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8TWVudSBhcz1cImRpdlwiIGNsYXNzTmFtZT1cInJlbGF0aXZlIGlubGluZS1ibG9jayB0ZXh0LWxlZnRcIj5cbiAgICAgIHtcbiAgICAgICAgKHsgb3BlbiB9KSA9PiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxNZW51QnV0dG9uIGNsYXNzTmFtZT17Y24oJ2ZsZXggaC04IHctOCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1sZyBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyJywgb3BlbiAmJiAnYmctc3RhdGUtYmFzZS1ob3ZlcicpfT5cbiAgICAgICAgICAgICAgPFJpTW9yZUZpbGwgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgICAgIDwvTWVudUJ1dHRvbj5cbiAgICAgICAgICAgIDxUcmFuc2l0aW9uXG4gICAgICAgICAgICAgIGFzPXtGcmFnbWVudH1cbiAgICAgICAgICAgICAgZW50ZXI9XCJ0cmFuc2l0aW9uIGVhc2Utb3V0IGR1cmF0aW9uLTEwMFwiXG4gICAgICAgICAgICAgIGVudGVyRnJvbT1cInRyYW5zZm9ybSBvcGFjaXR5LTAgc2NhbGUtOTVcIlxuICAgICAgICAgICAgICBlbnRlclRvPVwidHJhbnNmb3JtIG9wYWNpdHktMTAwIHNjYWxlLTEwMFwiXG4gICAgICAgICAgICAgIGxlYXZlPVwidHJhbnNpdGlvbiBlYXNlLWluIGR1cmF0aW9uLTc1XCJcbiAgICAgICAgICAgICAgbGVhdmVGcm9tPVwidHJhbnNmb3JtIG9wYWNpdHktMTAwIHNjYWxlLTEwMFwiXG4gICAgICAgICAgICAgIGxlYXZlVG89XCJ0cmFuc2Zvcm0gb3BhY2l0eS0wIHNjYWxlLTk1XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPE1lbnVJdGVtcyBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC0wIHRvcC05IHctNjAgbWF4LXctODAgb3JpZ2luLXRvcC1yaWdodCByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgc2hhZG93LWxnIGJhY2tkcm9wLWJsdXItc21cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTEgcHktMVwiPlxuICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBjdXJzb3ItcG9pbnRlciByb3VuZGVkLWxnIHB4LTMgcHktMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkF1dGhBZ2Fpbn1cbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIDxSaVN0aWNreU5vdGVBZGRMaW5lIGNsYXNzTmFtZT1cIm1yLTIgbXQtWzJweF0gaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2RhdGFTb3VyY2Uubm90aW9uLmNoYW5nZUF1dGhvcml6ZWRQYWdlcycsIHsgbnM6ICdjb21tb24nIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3BheWxvYWQudG90YWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt0KCdkYXRhU291cmNlLm5vdGlvbi5wYWdlc0F1dGhvcml6ZWQnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICA8TWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBjdXJzb3ItcG9pbnRlciByb3VuZGVkLWxnIHB4LTMgcHktMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCIgb25DbGljaz17aGFuZGxlU3luY30+XG4gICAgICAgICAgICAgICAgICAgICAgPFJpTG9vcExlZnRMaW5lIGNsYXNzTmFtZT1cIm1yLTIgbXQtWzJweF0gaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXNlbWlib2xkIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZGF0YVNvdXJjZS5ub3Rpb24uc3luYycsIHsgbnM6ICdjb21tb24nIH0pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvTWVudUl0ZW0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPE1lbnVJdGVtPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib3JkZXItdCBib3JkZXItZGl2aWRlci1zdWJ0bGUgcC0xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBjdXJzb3ItcG9pbnRlciByb3VuZGVkLWxnIHB4LTMgcHktMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCIgb25DbGljaz17aGFuZGxlUmVtb3ZlfT5cbiAgICAgICAgICAgICAgICAgICAgICA8UmlEZWxldGVCaW5MaW5lIGNsYXNzTmFtZT1cIm1yLTIgbXQtWzJweF0gaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXNlbWlib2xkIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZGF0YVNvdXJjZS5ub3Rpb24ucmVtb3ZlJywgeyBuczogJ2NvbW1vbicgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICAgPC9NZW51SXRlbXM+XG4gICAgICAgICAgICA8L1RyYW5zaXRpb24+XG4gICAgICAgICAgPC8+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICA8L01lbnU+XG4gIClcbn1cbiJdfQ==