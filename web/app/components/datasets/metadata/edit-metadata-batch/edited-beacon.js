"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const tooltip_1 = require("@/app/components/base/tooltip");
const EditedBeacon = ({ onReset, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const ref = (0, react_2.useRef)(null);
    const isHovering = (0, ahooks_1.useHover)(ref);
    return (<div ref={ref} className="size-4 cursor-pointer">
      {isHovering
            ? (<tooltip_1.default popupContent={t('operation.reset', { ns: 'common' })}>
              <div className="flex size-4 items-center justify-center rounded-full bg-text-accent-secondary" onClick={onReset}>
                <react_1.RiResetLeftLine className="size-[10px] text-text-primary-on-surface"/>
              </div>
            </tooltip_1.default>)
            : (<div className="flex size-4 items-center justify-center">
              <div className="size-1 rounded-full bg-text-accent-secondary"></div>
            </div>)}
    </div>);
};
exports.default = React.memo(EditedBeacon);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGVkLWJlYWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRlZC1iZWFjb24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBQWtEO0FBQ2xELG1DQUFpQztBQUNqQywrQkFBOEI7QUFDOUIsaUNBQThCO0FBQzlCLGlEQUE4QztBQUM5QywyREFBbUQ7QUFNbkQsTUFBTSxZQUFZLEdBQWMsQ0FBQyxFQUMvQixPQUFPLEdBQ1IsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hCLE1BQU0sVUFBVSxHQUFHLElBQUEsaUJBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQTtJQUVoQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUM5QztNQUFBLENBQUMsVUFBVTtZQUNULENBQUMsQ0FBQyxDQUNFLENBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUM1RDtjQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrRUFBK0UsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDOUc7Z0JBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsRUFDdkU7Y0FBQSxFQUFFLEdBQUcsQ0FDUDtZQUFBLEVBQUUsaUJBQU8sQ0FBQyxDQUNYO1lBQ0gsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlDQUF5QyxDQUN0RDtjQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw4Q0FBOEMsQ0FBQyxFQUFFLEdBQUcsQ0FDckU7WUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSaVJlc2V0TGVmdExpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlSG92ZXIgfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Rvb2x0aXAnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9uUmVzZXQ6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgRWRpdGVkQmVhY29uOiBGQzxQcm9wcz4gPSAoe1xuICBvblJlc2V0LFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgcmVmID0gdXNlUmVmKG51bGwpXG4gIGNvbnN0IGlzSG92ZXJpbmcgPSB1c2VIb3ZlcihyZWYpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJlZj17cmVmfSBjbGFzc05hbWU9XCJzaXplLTQgY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgIHtpc0hvdmVyaW5nXG4gICAgICAgID8gKFxuICAgICAgICAgICAgPFRvb2x0aXAgcG9wdXBDb250ZW50PXt0KCdvcGVyYXRpb24ucmVzZXQnLCB7IG5zOiAnY29tbW9uJyB9KX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaXplLTQgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtZnVsbCBiZy10ZXh0LWFjY2VudC1zZWNvbmRhcnlcIiBvbkNsaWNrPXtvblJlc2V0fT5cbiAgICAgICAgICAgICAgICA8UmlSZXNldExlZnRMaW5lIGNsYXNzTmFtZT1cInNpemUtWzEwcHhdIHRleHQtdGV4dC1wcmltYXJ5LW9uLXN1cmZhY2VcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgICApXG4gICAgICAgIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNpemUtNCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaXplLTEgcm91bmRlZC1mdWxsIGJnLXRleHQtYWNjZW50LXNlY29uZGFyeVwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhFZGl0ZWRCZWFjb24pXG4iXX0=