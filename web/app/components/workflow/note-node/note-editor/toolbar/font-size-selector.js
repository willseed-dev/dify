"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const general_1 = require("@/app/components/base/icons/src/vender/line/general");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const classnames_1 = require("@/utils/classnames");
const hooks_1 = require("./hooks");
const FontSizeSelector = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const FONT_SIZE_LIST = [
        {
            key: '12px',
            value: t('nodes.note.editor.small', { ns: 'workflow' }),
        },
        {
            key: '14px',
            value: t('nodes.note.editor.medium', { ns: 'workflow' }),
        },
        {
            key: '16px',
            value: t('nodes.note.editor.large', { ns: 'workflow' }),
        },
    ];
    const { fontSizeSelectorShow, handleOpenFontSizeSelector, fontSize, handleFontSize, } = (0, hooks_1.useFontSize)();
    return (<portal_to_follow_elem_1.PortalToFollowElem open={fontSizeSelectorShow} onOpenChange={handleOpenFontSizeSelector} placement="bottom-start" offset={2}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => handleOpenFontSizeSelector(!fontSizeSelectorShow)}>
        <div className={(0, classnames_1.cn)('flex h-8 cursor-pointer items-center rounded-md pl-2 pr-1.5 text-[13px] font-medium text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary', fontSizeSelectorShow && 'bg-state-base-hover text-text-secondary')}>
          <react_1.RiFontSize className="mr-1 h-4 w-4"/>
          {FONT_SIZE_LIST.find(font => font.key === fontSize)?.value || t('nodes.note.editor.small', { ns: 'workflow' })}
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent>
        <div className="w-[120px] rounded-md border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 text-text-secondary shadow-xl">
          {FONT_SIZE_LIST.map(font => (<div key={font.key} className="flex h-8 cursor-pointer items-center justify-between rounded-md pl-3 pr-2 hover:bg-state-base-hover" onClick={(e) => {
                e.stopPropagation();
                handleFontSize(font.key);
                handleOpenFontSizeSelector(false);
            }}>
                <div style={{ fontSize: font.key }}>
                  {font.value}
                </div>
                {fontSize === font.key && (<general_1.Check className="h-4 w-4 text-text-accent"/>)}
              </div>))}
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = (0, react_2.memo)(FontSizeSelector);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9udC1zaXplLXNlbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9udC1zaXplLXNlbGVjdG9yLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUE2QztBQUM3QyxpQ0FBNEI7QUFDNUIsaURBQThDO0FBQzlDLGlGQUEyRTtBQUMzRSx1RkFJb0Q7QUFDcEQsbURBQXVDO0FBQ3ZDLG1DQUFxQztBQUVyQyxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtJQUM1QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxjQUFjLEdBQUc7UUFDckI7WUFDRSxHQUFHLEVBQUUsTUFBTTtZQUNYLEtBQUssRUFBRSxDQUFDLENBQUMseUJBQXlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7U0FDeEQ7UUFDRDtZQUNFLEdBQUcsRUFBRSxNQUFNO1lBQ1gsS0FBSyxFQUFFLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUN6RDtRQUNEO1lBQ0UsR0FBRyxFQUFFLE1BQU07WUFDWCxLQUFLLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO1NBQ3hEO0tBQ0YsQ0FBQTtJQUNELE1BQU0sRUFDSixvQkFBb0IsRUFDcEIsMEJBQTBCLEVBQzFCLFFBQVEsRUFDUixjQUFjLEdBQ2YsR0FBRyxJQUFBLG1CQUFXLEdBQUUsQ0FBQTtJQUVqQixPQUFPLENBQ0wsQ0FBQywwQ0FBa0IsQ0FDakIsSUFBSSxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FDM0IsWUFBWSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FDekMsU0FBUyxDQUFDLGNBQWMsQ0FDeEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBRVY7TUFBQSxDQUFDLGlEQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUMxRjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNoQiw0SkFBNEosRUFDNUosb0JBQW9CLElBQUkseUNBQXlDLENBQ2xFLENBQUMsQ0FFQTtVQUFBLENBQUMsa0JBQVUsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUNwQztVQUFBLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUNoSDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxpREFBeUIsQ0FDM0I7TUFBQSxDQUFDLGlEQUF5QixDQUN4QjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrSUFBa0ksQ0FDL0k7VUFBQSxDQUNFLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUN6QixDQUFDLEdBQUcsQ0FDRixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQ2QsU0FBUyxDQUFDLHFHQUFxRyxDQUMvRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNiLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDeEIsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbkMsQ0FBQyxDQUFDLENBRUY7Z0JBQUEsQ0FBQyxHQUFHLENBQ0YsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBRTlCO2tCQUFBLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FDYjtnQkFBQSxFQUFFLEdBQUcsQ0FDTDtnQkFBQSxDQUNFLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQ3ZCLENBQUMsZUFBSyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsRUFBRyxDQUVsRCxDQUNGO2NBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNILENBQ0Y7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsaURBQXlCLENBQzdCO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsSUFBQSxZQUFJLEVBQUMsZ0JBQWdCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJpRm9udFNpemUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgbWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgQ2hlY2sgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2dlbmVyYWwnXG5pbXBvcnQge1xuICBQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IHVzZUZvbnRTaXplIH0gZnJvbSAnLi9ob29rcydcblxuY29uc3QgRm9udFNpemVTZWxlY3RvciA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IEZPTlRfU0laRV9MSVNUID0gW1xuICAgIHtcbiAgICAgIGtleTogJzEycHgnLFxuICAgICAgdmFsdWU6IHQoJ25vZGVzLm5vdGUuZWRpdG9yLnNtYWxsJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogJzE0cHgnLFxuICAgICAgdmFsdWU6IHQoJ25vZGVzLm5vdGUuZWRpdG9yLm1lZGl1bScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICcxNnB4JyxcbiAgICAgIHZhbHVlOiB0KCdub2Rlcy5ub3RlLmVkaXRvci5sYXJnZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgfSxcbiAgXVxuICBjb25zdCB7XG4gICAgZm9udFNpemVTZWxlY3RvclNob3csXG4gICAgaGFuZGxlT3BlbkZvbnRTaXplU2VsZWN0b3IsXG4gICAgZm9udFNpemUsXG4gICAgaGFuZGxlRm9udFNpemUsXG4gIH0gPSB1c2VGb250U2l6ZSgpXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtXG4gICAgICBvcGVuPXtmb250U2l6ZVNlbGVjdG9yU2hvd31cbiAgICAgIG9uT3BlbkNoYW5nZT17aGFuZGxlT3BlbkZvbnRTaXplU2VsZWN0b3J9XG4gICAgICBwbGFjZW1lbnQ9XCJib3R0b20tc3RhcnRcIlxuICAgICAgb2Zmc2V0PXsyfVxuICAgID5cbiAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyIG9uQ2xpY2s9eygpID0+IGhhbmRsZU9wZW5Gb250U2l6ZVNlbGVjdG9yKCFmb250U2l6ZVNlbGVjdG9yU2hvdyl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgJ2ZsZXggaC04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciByb3VuZGVkLW1kIHBsLTIgcHItMS41IHRleHQtWzEzcHhdIGZvbnQtbWVkaXVtIHRleHQtdGV4dC10ZXJ0aWFyeSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyIGhvdmVyOnRleHQtdGV4dC1zZWNvbmRhcnknLFxuICAgICAgICAgIGZvbnRTaXplU2VsZWN0b3JTaG93ICYmICdiZy1zdGF0ZS1iYXNlLWhvdmVyIHRleHQtdGV4dC1zZWNvbmRhcnknLFxuICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAgPFJpRm9udFNpemUgY2xhc3NOYW1lPVwibXItMSBoLTQgdy00XCIgLz5cbiAgICAgICAgICB7Rk9OVF9TSVpFX0xJU1QuZmluZChmb250ID0+IGZvbnQua2V5ID09PSBmb250U2l6ZSk/LnZhbHVlIHx8IHQoJ25vZGVzLm5vdGUuZWRpdG9yLnNtYWxsJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVsxMjBweF0gcm91bmRlZC1tZCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHAtMSB0ZXh0LXRleHQtc2Vjb25kYXJ5IHNoYWRvdy14bFwiPlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEZPTlRfU0laRV9MSVNULm1hcChmb250ID0+IChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGtleT17Zm9udC5rZXl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBoLTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiByb3VuZGVkLW1kIHBsLTMgcHItMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICAgICAgaGFuZGxlRm9udFNpemUoZm9udC5rZXkpXG4gICAgICAgICAgICAgICAgICBoYW5kbGVPcGVuRm9udFNpemVTZWxlY3RvcihmYWxzZSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IGZvbnQua2V5IH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2ZvbnQudmFsdWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgZm9udFNpemUgPT09IGZvbnQua2V5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgPENoZWNrIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LWFjY2VudFwiIC8+XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpXG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKEZvbnRTaXplU2VsZWN0b3IpXG4iXX0=