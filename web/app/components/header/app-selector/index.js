"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppSelector;
const react_1 = require("@headlessui/react");
const solid_1 = require("@heroicons/react/24/solid");
const function_1 = require("es-toolkit/function");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const create_app_dialog_1 = require("@/app/components/app/create-app-dialog");
const app_icon_1 = require("@/app/components/base/app-icon");
const app_context_1 = require("@/context/app-context");
const indicator_1 = require("../indicator");
function AppSelector({ appItems, curApp }) {
    const router = (0, navigation_1.useRouter)();
    const { isCurrentWorkspaceEditor } = (0, app_context_1.useAppContext)();
    const [showNewAppDialog, setShowNewAppDialog] = (0, react_2.useState)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    const itemClassName = `
    flex items-center w-full h-10 px-3 text-gray-700 text-[14px]
    rounded-lg font-normal hover:bg-gray-100 cursor-pointer
  `;
    return (<div className="">
      <react_1.Menu as="div" className="relative inline-block text-left">
        <div>
          <react_1.MenuButton className="
              inline-flex h-7 w-full items-center justify-center
              rounded-[10px] pl-2 pr-2.5 text-[14px] font-semibold
              text-[#1C64F2] hover:bg-[#EBF5FF]
            ">
            {curApp?.name}
            <solid_1.ChevronDownIcon className="ml-1 h-3 w-3" aria-hidden="true"/>
          </react_1.MenuButton>
        </div>
        <react_1.Transition as={react_2.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
          <react_1.MenuItems className="
              absolute -left-11 right-0 mt-1.5 w-60 max-w-80
              origin-top-right divide-y divide-gray-100 rounded-lg bg-white
              shadow-lg
            ">
            {!!appItems.length && (<div className="overflow-auto px-1 py-1" style={{ maxHeight: '50vh' }}>
                {appItems.map((app) => (<react_1.MenuItem key={app.id}>
                      <div className={itemClassName} onClick={() => router.push(`/app/${app.id}/${isCurrentWorkspaceEditor ? 'configuration' : 'overview'}`)}>
                        <div className="relative mr-2 h-6 w-6 rounded-[6px] bg-[#D5F5F6]">
                          <app_icon_1.default size="tiny"/>
                          <div className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded bg-white">
                            <indicator_1.default />
                          </div>
                        </div>
                        {app.name}
                      </div>
                    </react_1.MenuItem>))}
              </div>)}
            {isCurrentWorkspaceEditor && (<react_1.MenuItem>
                <div className="p-1" onClick={() => setShowNewAppDialog(true)}>
                  <div className="flex h-12 cursor-pointer items-center rounded-lg hover:bg-gray-100">
                    <div className="
                      ml-4 mr-2 flex
                      h-6 w-6 items-center justify-center rounded-[6px] border-[0.5px]
                      border-dashed border-gray-200 bg-gray-100
                    ">
                      <solid_1.PlusIcon className="h-4 w-4 text-gray-500"/>
                    </div>
                    <div className="text-[14px] font-normal text-gray-700">{t('menus.newApp', { ns: 'common' })}</div>
                  </div>
                </div>
              </react_1.MenuItem>)}
          </react_1.MenuItems>
        </react_1.Transition>
      </react_1.Menu>
      <create_app_dialog_1.default show={showNewAppDialog} onClose={() => setShowNewAppDialog(false)} onSuccess={function_1.noop}/>
    </div>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFrQlosOEJBa0dDO0FBbEhELDZDQUFxRjtBQUNyRixxREFBcUU7QUFDckUsa0RBQTBDO0FBQzFDLGdEQUEyQztBQUMzQyxpQ0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLDhFQUFvRTtBQUNwRSw2REFBb0Q7QUFDcEQsdURBQXFEO0FBQ3JELDRDQUFvQztBQU9wQyxTQUF3QixXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFxQjtJQUN6RSxNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUMxQixNQUFNLEVBQUUsd0JBQXdCLEVBQUUsR0FBRyxJQUFBLDJCQUFhLEdBQUUsQ0FBQTtJQUNwRCxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0QsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE1BQU0sYUFBYSxHQUFHOzs7R0FHckIsQ0FBQTtJQUVELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUNmO01BQUEsQ0FBQyxZQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQ3hEO1FBQUEsQ0FBQyxHQUFHLENBQ0Y7VUFBQSxDQUFDLGtCQUFVLENBQ1QsU0FBUyxDQUFDOzs7O2FBSVQsQ0FFRDtZQUFBLENBQUMsTUFBTSxFQUFFLElBQUksQ0FDYjtZQUFBLENBQUMsdUJBQWUsQ0FDZCxTQUFTLENBQUMsY0FBYyxDQUN4QixXQUFXLENBQUMsTUFBTSxFQUV0QjtVQUFBLEVBQUUsa0JBQVUsQ0FDZDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxrQkFBVSxDQUNULEVBQUUsQ0FBQyxDQUFDLGdCQUFRLENBQUMsQ0FDYixLQUFLLENBQUMsa0NBQWtDLENBQ3hDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FDeEMsT0FBTyxDQUFDLGlDQUFpQyxDQUN6QyxLQUFLLENBQUMsZ0NBQWdDLENBQ3RDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FDM0MsT0FBTyxDQUFDLDhCQUE4QixDQUV0QztVQUFBLENBQUMsaUJBQVMsQ0FDUixTQUFTLENBQUM7Ozs7YUFJVCxDQUVEO1lBQUEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUNwQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FDcEU7Z0JBQUEsQ0FDRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBc0IsRUFBRSxFQUFFLENBQUMsQ0FDdkMsQ0FBQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FDcEI7c0JBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQ3pCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxJQUFJLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FFM0Y7d0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtEQUFrRCxDQUMvRDswQkFBQSxDQUFDLGtCQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFDcEI7MEJBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLCtGQUErRixDQUM1Rzs0QkFBQSxDQUFDLG1CQUFTLENBQUMsQUFBRCxFQUNaOzBCQUFBLEVBQUUsR0FBRyxDQUNQO3dCQUFBLEVBQUUsR0FBRyxDQUNMO3dCQUFBLENBQUMsR0FBRyxDQUFDLElBQUksQ0FDWDtzQkFBQSxFQUFFLEdBQUcsQ0FDUDtvQkFBQSxFQUFFLGdCQUFRLENBQUMsQ0FDWixDQUNILENBQ0Y7Y0FBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0Q7WUFBQSxDQUFDLHdCQUF3QixJQUFJLENBQzNCLENBQUMsZ0JBQVEsQ0FDUDtnQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQzVEO2tCQUFBLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxvRUFBb0UsQ0FFOUU7b0JBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDOzs7O3FCQUlYLENBRUM7c0JBQUEsQ0FBQyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsRUFDN0M7b0JBQUEsRUFBRSxHQUFHLENBQ0w7b0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNuRztrQkFBQSxFQUFFLEdBQUcsQ0FDUDtnQkFBQSxFQUFFLEdBQUcsQ0FDUDtjQUFBLEVBQUUsZ0JBQVEsQ0FBQyxDQUNaLENBQ0g7VUFBQSxFQUFFLGlCQUFTLENBQ2I7UUFBQSxFQUFFLGtCQUFVLENBQ2Q7TUFBQSxFQUFFLFlBQUksQ0FDTjtNQUFBLENBQUMsMkJBQWUsQ0FDZCxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUN2QixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMxQyxTQUFTLENBQUMsQ0FBQyxlQUFJLENBQUMsRUFFcEI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEFwcERldGFpbFJlc3BvbnNlIH0gZnJvbSAnQC9tb2RlbHMvYXBwJ1xuaW1wb3J0IHsgTWVudSwgTWVudUJ1dHRvbiwgTWVudUl0ZW0sIE1lbnVJdGVtcywgVHJhbnNpdGlvbiB9IGZyb20gJ0BoZWFkbGVzc3VpL3JlYWN0J1xuaW1wb3J0IHsgQ2hldnJvbkRvd25JY29uLCBQbHVzSWNvbiB9IGZyb20gJ0BoZXJvaWNvbnMvcmVhY3QvMjQvc29saWQnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7IEZyYWdtZW50LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IENyZWF0ZUFwcERpYWxvZyBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9jcmVhdGUtYXBwLWRpYWxvZydcbmltcG9ydCBBcHBJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbidcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgSW5kaWNhdG9yIGZyb20gJy4uL2luZGljYXRvcidcblxudHlwZSBJQXBwU2VsZWN0b3JQcm9wcyA9IHtcbiAgYXBwSXRlbXM6IEFwcERldGFpbFJlc3BvbnNlW11cbiAgY3VyQXBwOiBBcHBEZXRhaWxSZXNwb25zZVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHBTZWxlY3Rvcih7IGFwcEl0ZW1zLCBjdXJBcHAgfTogSUFwcFNlbGVjdG9yUHJvcHMpIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCBbc2hvd05ld0FwcERpYWxvZywgc2V0U2hvd05ld0FwcERpYWxvZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgaXRlbUNsYXNzTmFtZSA9IGBcbiAgICBmbGV4IGl0ZW1zLWNlbnRlciB3LWZ1bGwgaC0xMCBweC0zIHRleHQtZ3JheS03MDAgdGV4dC1bMTRweF1cbiAgICByb3VuZGVkLWxnIGZvbnQtbm9ybWFsIGhvdmVyOmJnLWdyYXktMTAwIGN1cnNvci1wb2ludGVyXG4gIGBcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICA8TWVudSBhcz1cImRpdlwiIGNsYXNzTmFtZT1cInJlbGF0aXZlIGlubGluZS1ibG9jayB0ZXh0LWxlZnRcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TWVudUJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiXG4gICAgICAgICAgICAgIGlubGluZS1mbGV4IGgtNyB3LWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXG4gICAgICAgICAgICAgIHJvdW5kZWQtWzEwcHhdIHBsLTIgcHItMi41IHRleHQtWzE0cHhdIGZvbnQtc2VtaWJvbGRcbiAgICAgICAgICAgICAgdGV4dC1bIzFDNjRGMl0gaG92ZXI6YmctWyNFQkY1RkZdXG4gICAgICAgICAgICBcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtjdXJBcHA/Lm5hbWV9XG4gICAgICAgICAgICA8Q2hldnJvbkRvd25JY29uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1sLTEgaC0zIHctM1wiXG4gICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTWVudUJ1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxUcmFuc2l0aW9uXG4gICAgICAgICAgYXM9e0ZyYWdtZW50fVxuICAgICAgICAgIGVudGVyPVwidHJhbnNpdGlvbiBlYXNlLW91dCBkdXJhdGlvbi0xMDBcIlxuICAgICAgICAgIGVudGVyRnJvbT1cInRyYW5zZm9ybSBvcGFjaXR5LTAgc2NhbGUtOTVcIlxuICAgICAgICAgIGVudGVyVG89XCJ0cmFuc2Zvcm0gb3BhY2l0eS0xMDAgc2NhbGUtMTAwXCJcbiAgICAgICAgICBsZWF2ZT1cInRyYW5zaXRpb24gZWFzZS1pbiBkdXJhdGlvbi03NVwiXG4gICAgICAgICAgbGVhdmVGcm9tPVwidHJhbnNmb3JtIG9wYWNpdHktMTAwIHNjYWxlLTEwMFwiXG4gICAgICAgICAgbGVhdmVUbz1cInRyYW5zZm9ybSBvcGFjaXR5LTAgc2NhbGUtOTVcIlxuICAgICAgICA+XG4gICAgICAgICAgPE1lbnVJdGVtc1xuICAgICAgICAgICAgY2xhc3NOYW1lPVwiXG4gICAgICAgICAgICAgIGFic29sdXRlIC1sZWZ0LTExIHJpZ2h0LTAgbXQtMS41IHctNjAgbWF4LXctODBcbiAgICAgICAgICAgICAgb3JpZ2luLXRvcC1yaWdodCBkaXZpZGUteSBkaXZpZGUtZ3JheS0xMDAgcm91bmRlZC1sZyBiZy13aGl0ZVxuICAgICAgICAgICAgICBzaGFkb3ctbGdcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgeyEhYXBwSXRlbXMubGVuZ3RoICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvdmVyZmxvdy1hdXRvIHB4LTEgcHktMVwiIHN0eWxlPXt7IG1heEhlaWdodDogJzUwdmgnIH19PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGFwcEl0ZW1zLm1hcCgoYXBwOiBBcHBEZXRhaWxSZXNwb25zZSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8TWVudUl0ZW0ga2V5PXthcHAuaWR9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17aXRlbUNsYXNzTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wdXNoKGAvYXBwLyR7YXBwLmlkfS8ke2lzQ3VycmVudFdvcmtzcGFjZUVkaXRvciA/ICdjb25maWd1cmF0aW9uJyA6ICdvdmVydmlldyd9YCl9XG4gICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtci0yIGgtNiB3LTYgcm91bmRlZC1bNnB4XSBiZy1bI0Q1RjVGNl1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPEFwcEljb24gc2l6ZT1cInRpbnlcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC1ib3R0b20tMC41IC1yaWdodC0wLjUgZmxleCBoLTIuNSB3LTIuNSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZCBiZy13aGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJbmRpY2F0b3IgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHthcHAubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7aXNDdXJyZW50V29ya3NwYWNlRWRpdG9yICYmIChcbiAgICAgICAgICAgICAgPE1lbnVJdGVtPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xXCIgb25DbGljaz17KCkgPT4gc2V0U2hvd05ld0FwcERpYWxvZyh0cnVlKX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaC0xMiBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgcm91bmRlZC1sZyBob3ZlcjpiZy1ncmF5LTEwMFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJcbiAgICAgICAgICAgICAgICAgICAgICBtbC00IG1yLTIgZmxleFxuICAgICAgICAgICAgICAgICAgICAgIGgtNiB3LTYgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtWzZweF0gYm9yZGVyLVswLjVweF1cbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXItZGFzaGVkIGJvcmRlci1ncmF5LTIwMCBiZy1ncmF5LTEwMFxuICAgICAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPFBsdXNJY29uIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC1ncmF5LTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzE0cHhdIGZvbnQtbm9ybWFsIHRleHQtZ3JheS03MDBcIj57dCgnbWVudXMubmV3QXBwJywgeyBuczogJ2NvbW1vbicgfSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9NZW51SXRlbT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9NZW51SXRlbXM+XG4gICAgICAgIDwvVHJhbnNpdGlvbj5cbiAgICAgIDwvTWVudT5cbiAgICAgIDxDcmVhdGVBcHBEaWFsb2dcbiAgICAgICAgc2hvdz17c2hvd05ld0FwcERpYWxvZ31cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2hvd05ld0FwcERpYWxvZyhmYWxzZSl9XG4gICAgICAgIG9uU3VjY2Vzcz17bm9vcH1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cbiJdfQ==