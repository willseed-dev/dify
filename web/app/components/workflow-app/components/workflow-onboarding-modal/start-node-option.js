"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = require("@/utils/classnames");
const StartNodeOption = ({ icon, title, subtitle, description, onClick, }) => {
    return (<div onClick={onClick} className={(0, classnames_1.cn)('hover:border-components-panel-border-active flex h-40 w-[280px] cursor-pointer flex-col gap-2 rounded-xl border-[0.5px] border-components-option-card-option-border bg-components-panel-on-panel-item-bg p-4 shadow-sm transition-all hover:shadow-md')}>
      {/* Icon */}
      <div className="shrink-0">
        {icon}
      </div>

      {/* Text content */}
      <div className="flex h-[74px] flex-col gap-1 py-0.5">
        <div className="h-5 leading-5">
          <h3 className="system-md-semi-bold text-text-primary">
            {title}
            {subtitle && (<span className="system-md-regular text-text-quaternary">
                {' '}
                {subtitle}
              </span>)}
          </h3>
        </div>

        <div className="h-12 leading-4">
          <p className="system-xs-regular text-text-tertiary">
            {description}
          </p>
        </div>
      </div>
    </div>);
};
exports.default = StartNodeOption;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQtbm9kZS1vcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFydC1ub2RlLW9wdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWixtREFBdUM7QUFVdkMsTUFBTSxlQUFlLEdBQTZCLENBQUMsRUFDakQsSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEVBQ1IsV0FBVyxFQUNYLE9BQU8sR0FDUixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNYLHVQQUF1UCxDQUN4UCxDQUFDLENBRUY7TUFBQSxDQUFDLFVBQVUsQ0FDWDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQ3ZCO1FBQUEsQ0FBQyxJQUFJLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLGtCQUFrQixDQUNuQjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FDbEQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUM1QjtVQUFBLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FDbkQ7WUFBQSxDQUFDLEtBQUssQ0FDTjtZQUFBLENBQUMsUUFBUSxJQUFJLENBQ1gsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHdDQUF3QyxDQUN0RDtnQkFBQSxDQUFDLEdBQUcsQ0FDSjtnQkFBQSxDQUFDLFFBQVEsQ0FDWDtjQUFBLEVBQUUsSUFBSSxDQUFDLENBQ1IsQ0FDSDtVQUFBLEVBQUUsRUFBRSxDQUNOO1FBQUEsRUFBRSxHQUFHLENBRUw7O1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUM3QjtVQUFBLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDakQ7WUFBQSxDQUFDLFdBQVcsQ0FDZDtVQUFBLEVBQUUsQ0FBQyxDQUNMO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQywgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxudHlwZSBTdGFydE5vZGVPcHRpb25Qcm9wcyA9IHtcbiAgaWNvbjogUmVhY3ROb2RlXG4gIHRpdGxlOiBzdHJpbmdcbiAgc3VidGl0bGU/OiBzdHJpbmdcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IFN0YXJ0Tm9kZU9wdGlvbjogRkM8U3RhcnROb2RlT3B0aW9uUHJvcHM+ID0gKHtcbiAgaWNvbixcbiAgdGl0bGUsXG4gIHN1YnRpdGxlLFxuICBkZXNjcmlwdGlvbixcbiAgb25DbGljayxcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgJ2hvdmVyOmJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlci1hY3RpdmUgZmxleCBoLTQwIHctWzI4MHB4XSBjdXJzb3ItcG9pbnRlciBmbGV4LWNvbCBnYXAtMiByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLW9wdGlvbi1jYXJkLW9wdGlvbi1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1vbi1wYW5lbC1pdGVtLWJnIHAtNCBzaGFkb3ctc20gdHJhbnNpdGlvbi1hbGwgaG92ZXI6c2hhZG93LW1kJyxcbiAgICAgICl9XG4gICAgPlxuICAgICAgey8qIEljb24gKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wXCI+XG4gICAgICAgIHtpY29ufVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBUZXh0IGNvbnRlbnQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bNzRweF0gZmxleC1jb2wgZ2FwLTEgcHktMC41XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC01IGxlYWRpbmctNVwiPlxuICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaS1ib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICB7dGl0bGV9XG4gICAgICAgICAgICB7c3VidGl0bGUgJiYgKFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciB0ZXh0LXRleHQtcXVhdGVybmFyeVwiPlxuICAgICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgICAge3N1YnRpdGxlfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvaDM+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0xMiBsZWFkaW5nLTRcIj5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIHtkZXNjcmlwdGlvbn1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RhcnROb2RlT3B0aW9uXG4iXX0=