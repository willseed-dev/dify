"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IntegrationsPage;
const link_1 = require("next/link");
const react_i18next_1 = require("react-i18next");
const use_common_1 = require("@/service/use-common");
const classnames_1 = require("@/utils/classnames");
const index_module_css_1 = require("./index.module.css");
const titleClassName = `
  mb-2 text-sm font-medium text-gray-900
`;
function IntegrationsPage() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const integrateMap = {
        google: {
            name: t('integrations.google', { ns: 'common' }),
            description: t('integrations.googleAccount', { ns: 'common' }),
        },
        github: {
            name: t('integrations.github', { ns: 'common' }),
            description: t('integrations.githubAccount', { ns: 'common' }),
        },
    };
    const { data } = (0, use_common_1.useAccountIntegrates)();
    const integrates = data?.data ?? [];
    return (<>
      <div className="mb-8">
        <div className={titleClassName}>{t('integrations.connected', { ns: 'common' })}</div>
        {integrates.map((integrate) => {
            const info = integrateMap[integrate.provider];
            if (!info)
                return null;
            return (<div key={integrate.provider} className="mb-2 flex items-center rounded-lg border-[0.5px] border-gray-200 bg-gray-50 px-3 py-2">
                <div className={(0, classnames_1.cn)('mr-3 h-8 w-8 rounded-lg border border-gray-100 bg-white', index_module_css_1.default[`${integrate.provider}-icon`])}/>
                <div className="grow">
                  <div className="text-sm font-medium leading-[21px] text-gray-800">{info.name}</div>
                  <div className="text-xs font-normal leading-[18px] text-gray-500">{info.description}</div>
                </div>
                {!integrate.is_bound && (<link_1.default className="flex h-8 cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-[7px] text-xs font-medium text-gray-700" href={integrate.link} target="_blank" rel="noopener noreferrer">
                      {t('integrations.connect', { ns: 'common' })}
                    </link_1.default>)}
              </div>);
        })}
      </div>
      {/* <div className='mb-8'>
          <div className={titleClassName}>Add a service </div>
          {
            services.map(service => (
              <div key={service.key} className='mb-2 flex items-center px-3 py-2 bg-gray-50 border-[0.5px] border-gray-200 rounded-lg'>
                <div className={classNames('w-8 h-8 mr-3 bg-white rounded-lg border border-gray-100', s[`${service.key}-icon`])} />
                <div className='grow'>
                  <div className='leading-[21px] text-sm font-medium text-gray-800'>{service.name}</div>
                  <div className='leading-[18px] text-xs font-normal text-gray-500'>{service.description}</div>
                </div>
                <Button className='text-xs font-medium text-gray-800'>Connect</Button>
              </div>
            ))
          }
        </div> */}
    </>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFZWixtQ0FtRUM7QUE3RUQsb0NBQTRCO0FBQzVCLGlEQUE4QztBQUM5QyxxREFBMkQ7QUFDM0QsbURBQXVDO0FBQ3ZDLHlEQUFrQztBQUVsQyxNQUFNLGNBQWMsR0FBRzs7Q0FFdEIsQ0FBQTtBQUVELFNBQXdCLGdCQUFnQjtJQUN0QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsTUFBTSxZQUFZLEdBQUc7UUFDbkIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUNoRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1NBQy9EO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUNoRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLDRCQUE0QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1NBQy9EO0tBQ0YsQ0FBQTtJQUVELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFBLGlDQUFvQixHQUFFLENBQUE7SUFDdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUE7SUFFbkMsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuQjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3BGO1FBQUEsQ0FDRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QyxJQUFJLENBQUMsSUFBSTtnQkFDUCxPQUFPLElBQUksQ0FBQTtZQUNiLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLHVGQUF1RixDQUM3SDtnQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx5REFBeUQsRUFBRSwwQkFBQyxDQUFDLEdBQUcsU0FBUyxDQUFDLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUMvRztnQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuQjtrQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUNsRjtrQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUMzRjtnQkFBQSxFQUFFLEdBQUcsQ0FDTDtnQkFBQSxDQUNFLENBQUMsU0FBUyxDQUFDLFFBQVEsSUFBSSxDQUNyQixDQUFDLGNBQUksQ0FDSCxTQUFTLENBQUMsNEhBQTRILENBQ3RJLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FDckIsTUFBTSxDQUFDLFFBQVEsQ0FDZixHQUFHLENBQUMscUJBQXFCLENBRXpCO3NCQUFBLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzlDO29CQUFBLEVBQUUsY0FBSSxDQUFDLENBRVgsQ0FDRjtjQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtRQUNILENBQUMsQ0FDSCxDQUNGO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDOzs7Ozs7Ozs7Ozs7OztpQkFjUSxDQUNYO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluaydcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUFjY291bnRJbnRlZ3JhdGVzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1jb21tb24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBzIGZyb20gJy4vaW5kZXgubW9kdWxlLmNzcydcblxuY29uc3QgdGl0bGVDbGFzc05hbWUgPSBgXG4gIG1iLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXG5gXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEludGVncmF0aW9uc1BhZ2UoKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IGludGVncmF0ZU1hcCA9IHtcbiAgICBnb29nbGU6IHtcbiAgICAgIG5hbWU6IHQoJ2ludGVncmF0aW9ucy5nb29nbGUnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0KCdpbnRlZ3JhdGlvbnMuZ29vZ2xlQWNjb3VudCcsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgIH0sXG4gICAgZ2l0aHViOiB7XG4gICAgICBuYW1lOiB0KCdpbnRlZ3JhdGlvbnMuZ2l0aHViJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICBkZXNjcmlwdGlvbjogdCgnaW50ZWdyYXRpb25zLmdpdGh1YkFjY291bnQnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICB9LFxuICB9XG5cbiAgY29uc3QgeyBkYXRhIH0gPSB1c2VBY2NvdW50SW50ZWdyYXRlcygpXG4gIGNvbnN0IGludGVncmF0ZXMgPSBkYXRhPy5kYXRhID8/IFtdXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi04XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aXRsZUNsYXNzTmFtZX0+e3QoJ2ludGVncmF0aW9ucy5jb25uZWN0ZWQnLCB7IG5zOiAnY29tbW9uJyB9KX08L2Rpdj5cbiAgICAgICAge1xuICAgICAgICAgIGludGVncmF0ZXMubWFwKChpbnRlZ3JhdGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBpbnRlZ3JhdGVNYXBbaW50ZWdyYXRlLnByb3ZpZGVyXVxuICAgICAgICAgICAgaWYgKCFpbmZvKVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2ludGVncmF0ZS5wcm92aWRlcn0gY2xhc3NOYW1lPVwibWItMiBmbGV4IGl0ZW1zLWNlbnRlciByb3VuZGVkLWxnIGJvcmRlci1bMC41cHhdIGJvcmRlci1ncmF5LTIwMCBiZy1ncmF5LTUwIHB4LTMgcHktMlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignbXItMyBoLTggdy04IHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTEwMCBiZy13aGl0ZScsIHNbYCR7aW50ZWdyYXRlLnByb3ZpZGVyfS1pY29uYF0pfSAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3Jvd1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIGxlYWRpbmctWzIxcHhdIHRleHQtZ3JheS04MDBcIj57aW5mby5uYW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbm9ybWFsIGxlYWRpbmctWzE4cHhdIHRleHQtZ3JheS01MDBcIj57aW5mby5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAhaW50ZWdyYXRlLmlzX2JvdW5kICYmIChcbiAgICAgICAgICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGgtOCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHB4LVs3cHhdIHRleHQteHMgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgaHJlZj17aW50ZWdyYXRlLmxpbmt9XG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt0KCdpbnRlZ3JhdGlvbnMuY29ubmVjdCcsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICAgICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiA8ZGl2IGNsYXNzTmFtZT0nbWItOCc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aXRsZUNsYXNzTmFtZX0+QWRkIGEgc2VydmljZSA8L2Rpdj5cbiAgICAgICAge1xuICAgICAgICAgIHNlcnZpY2VzLm1hcChzZXJ2aWNlID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtzZXJ2aWNlLmtleX0gY2xhc3NOYW1lPSdtYi0yIGZsZXggaXRlbXMtY2VudGVyIHB4LTMgcHktMiBiZy1ncmF5LTUwIGJvcmRlci1bMC41cHhdIGJvcmRlci1ncmF5LTIwMCByb3VuZGVkLWxnJz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ3ctOCBoLTggbXItMyBiZy13aGl0ZSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0xMDAnLCBzW2Ake3NlcnZpY2Uua2V5fS1pY29uYF0pfSAvPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZ3Jvdyc+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xlYWRpbmctWzIxcHhdIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTgwMCc+e3NlcnZpY2UubmFtZX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGVhZGluZy1bMThweF0gdGV4dC14cyBmb250LW5vcm1hbCB0ZXh0LWdyYXktNTAwJz57c2VydmljZS5kZXNjcmlwdGlvbn08L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPSd0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtZ3JheS04MDAnPkNvbm5lY3Q8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PiAqL31cbiAgICA8Lz5cbiAgKVxufVxuIl19