"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const checkbox_1 = require("@/app/components/base/checkbox");
const divider_1 = require("@/app/components/base/divider");
const skeleton_1 = require("@/app/components/base/skeleton");
const CardSkelton = React.memo(() => {
    return (<skeleton_1.SkeletonContainer className="gap-y-0 p-1 pb-2">
      <skeleton_1.SkeletonContainer className="gap-y-0.5 px-2 pt-1.5">
        <skeleton_1.SkeletonRow className="py-0.5">
          <skeleton_1.SkeletonRectangle className="w-[72px] bg-text-quaternary"/>
          <skeleton_1.SkeletonPoint className="opacity-20"/>
          <skeleton_1.SkeletonRectangle className="w-24 bg-text-quaternary"/>
          <skeleton_1.SkeletonPoint className="opacity-20"/>
          <skeleton_1.SkeletonRectangle className="w-24 bg-text-quaternary"/>
          <skeleton_1.SkeletonRow className="grow justify-end gap-1">
            <skeleton_1.SkeletonRectangle className="w-12 bg-text-quaternary"/>
            <skeleton_1.SkeletonRectangle className="mx-1 w-2 bg-text-quaternary"/>
          </skeleton_1.SkeletonRow>
        </skeleton_1.SkeletonRow>
        <skeleton_1.SkeletonRow className="py-0.5">
          <skeleton_1.SkeletonRectangle className="w-full bg-text-quaternary"/>
        </skeleton_1.SkeletonRow>
        <skeleton_1.SkeletonRow className="py-0.5">
          <skeleton_1.SkeletonRectangle className="w-full bg-text-quaternary"/>
        </skeleton_1.SkeletonRow>
        <skeleton_1.SkeletonRow className="py-0.5">
          <skeleton_1.SkeletonRectangle className="w-2/3 bg-text-quaternary"/>
        </skeleton_1.SkeletonRow>
      </skeleton_1.SkeletonContainer>
      <skeleton_1.SkeletonContainer className="p-1 pb-2">
        <skeleton_1.SkeletonRow>
          <skeleton_1.SkeletonRow className="h-7 gap-x-0.5 rounded-lg bg-dataset-child-chunk-expand-btn-bg pl-1 pr-3">
            <react_1.RiArrowRightSLine className="h-4 w-4 text-text-secondary opacity-20"/>
            <skeleton_1.SkeletonRectangle className="w-32 bg-text-quaternary"/>
          </skeleton_1.SkeletonRow>
        </skeleton_1.SkeletonRow>
      </skeleton_1.SkeletonContainer>
    </skeleton_1.SkeletonContainer>);
});
CardSkelton.displayName = 'CardSkelton';
const ParagraphListSkeleton = () => {
    return (<div className="relative z-10 flex h-full flex-col overflow-y-hidden">
      <div className="absolute left-0 top-0 z-20 h-full w-full bg-dataset-chunk-list-mask-bg"/>
      {Array.from({ length: 10 }).map((_, index) => {
            return (<div key={index} className="flex items-start gap-x-2">
            <checkbox_1.default key={`${index}-checkbox`} className="mt-3.5 shrink-0" disabled/>
            <div className="grow">
              <CardSkelton />
              {index !== 9 && (<div className="w-full px-3">
                  <divider_1.default type="horizontal" className="my-1 bg-divider-subtle"/>
                </div>)}
            </div>
          </div>);
        })}
    </div>);
};
exports.default = React.memo(ParagraphListSkeleton);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyYWdyYXBoLWxpc3Qtc2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJhZ3JhcGgtbGlzdC1za2VsZXRvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBb0Q7QUFDcEQsK0JBQThCO0FBQzlCLDZEQUFxRDtBQUNyRCwyREFBbUQ7QUFDbkQsNkRBS3VDO0FBRXZDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0lBQ2xDLE9BQU8sQ0FDTCxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FDN0M7TUFBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDbEQ7UUFBQSxDQUFDLHNCQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FDN0I7VUFBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsRUFDMUQ7VUFBQSxDQUFDLHdCQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksRUFDckM7VUFBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsRUFDdEQ7VUFBQSxDQUFDLHdCQUFhLENBQUMsU0FBUyxDQUFDLFlBQVksRUFDckM7VUFBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsRUFDdEQ7VUFBQSxDQUFDLHNCQUFXLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUM3QztZQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLHlCQUF5QixFQUN0RDtZQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUM1RDtVQUFBLEVBQUUsc0JBQVcsQ0FDZjtRQUFBLEVBQUUsc0JBQVcsQ0FDYjtRQUFBLENBQUMsc0JBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM3QjtVQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLDJCQUEyQixFQUMxRDtRQUFBLEVBQUUsc0JBQVcsQ0FDYjtRQUFBLENBQUMsc0JBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM3QjtVQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLDJCQUEyQixFQUMxRDtRQUFBLEVBQUUsc0JBQVcsQ0FDYjtRQUFBLENBQUMsc0JBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM3QjtVQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLDBCQUEwQixFQUN6RDtRQUFBLEVBQUUsc0JBQVcsQ0FDZjtNQUFBLEVBQUUsNEJBQWlCLENBQ25CO01BQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUNyQztRQUFBLENBQUMsc0JBQVcsQ0FDVjtVQUFBLENBQUMsc0JBQVcsQ0FBQyxTQUFTLENBQUMseUVBQXlFLENBQzlGO1lBQUEsQ0FBQyx5QkFBaUIsQ0FBQyxTQUFTLENBQUMsd0NBQXdDLEVBQ3JFO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQ3hEO1VBQUEsRUFBRSxzQkFBVyxDQUNmO1FBQUEsRUFBRSxzQkFBVyxDQUNmO01BQUEsRUFBRSw0QkFBaUIsQ0FDckI7SUFBQSxFQUFFLDRCQUFpQixDQUFDLENBQ3JCLENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLFdBQVcsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFBO0FBRXZDLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxFQUFFO0lBQ2pDLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0RBQXNELENBQ25FO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdFQUF3RSxFQUN2RjtNQUFBLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMzQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUNuRDtZQUFBLENBQUMsa0JBQVEsQ0FDUCxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssV0FBVyxDQUFDLENBQ3pCLFNBQVMsQ0FBQyxpQkFBaUIsQ0FDM0IsUUFBUSxFQUVWO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkI7Y0FBQSxDQUFDLFdBQVcsQ0FBQyxBQUFELEVBQ1o7Y0FBQSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksQ0FDZCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUMxQjtrQkFBQSxDQUFDLGlCQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsd0JBQXdCLEVBQy9EO2dCQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQ0o7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSaUFycm93UmlnaHRTTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDaGVja2JveCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hlY2tib3gnXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7XG4gIFNrZWxldG9uQ29udGFpbmVyLFxuICBTa2VsZXRvblBvaW50LFxuICBTa2VsZXRvblJlY3RhbmdsZSxcbiAgU2tlbGV0b25Sb3csXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9za2VsZXRvbidcblxuY29uc3QgQ2FyZFNrZWx0b24gPSBSZWFjdC5tZW1vKCgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8U2tlbGV0b25Db250YWluZXIgY2xhc3NOYW1lPVwiZ2FwLXktMCBwLTEgcGItMlwiPlxuICAgICAgPFNrZWxldG9uQ29udGFpbmVyIGNsYXNzTmFtZT1cImdhcC15LTAuNSBweC0yIHB0LTEuNVwiPlxuICAgICAgICA8U2tlbGV0b25Sb3cgY2xhc3NOYW1lPVwicHktMC41XCI+XG4gICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctWzcycHhdIGJnLXRleHQtcXVhdGVybmFyeVwiIC8+XG4gICAgICAgICAgPFNrZWxldG9uUG9pbnQgY2xhc3NOYW1lPVwib3BhY2l0eS0yMFwiIC8+XG4gICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctMjQgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICA8U2tlbGV0b25Qb2ludCBjbGFzc05hbWU9XCJvcGFjaXR5LTIwXCIgLz5cbiAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwidy0yNCBiZy10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgIDxTa2VsZXRvblJvdyBjbGFzc05hbWU9XCJncm93IGp1c3RpZnktZW5kIGdhcC0xXCI+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwidy0xMiBiZy10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cIm14LTEgdy0yIGJnLXRleHQtcXVhdGVybmFyeVwiIC8+XG4gICAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgPFNrZWxldG9uUm93IGNsYXNzTmFtZT1cInB5LTAuNVwiPlxuICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgPFNrZWxldG9uUm93IGNsYXNzTmFtZT1cInB5LTAuNVwiPlxuICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgPFNrZWxldG9uUm93IGNsYXNzTmFtZT1cInB5LTAuNVwiPlxuICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LTIvMyBiZy10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgPC9Ta2VsZXRvbkNvbnRhaW5lcj5cbiAgICAgIDxTa2VsZXRvbkNvbnRhaW5lciBjbGFzc05hbWU9XCJwLTEgcGItMlwiPlxuICAgICAgICA8U2tlbGV0b25Sb3c+XG4gICAgICAgICAgPFNrZWxldG9uUm93IGNsYXNzTmFtZT1cImgtNyBnYXAteC0wLjUgcm91bmRlZC1sZyBiZy1kYXRhc2V0LWNoaWxkLWNodW5rLWV4cGFuZC1idG4tYmcgcGwtMSBwci0zXCI+XG4gICAgICAgICAgICA8UmlBcnJvd1JpZ2h0U0xpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtc2Vjb25kYXJ5IG9wYWNpdHktMjBcIiAvPlxuICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctMzIgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgPC9Ta2VsZXRvbkNvbnRhaW5lcj5cbiAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICApXG59KVxuXG5DYXJkU2tlbHRvbi5kaXNwbGF5TmFtZSA9ICdDYXJkU2tlbHRvbidcblxuY29uc3QgUGFyYWdyYXBoTGlzdFNrZWxldG9uID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBmbGV4IGgtZnVsbCBmbGV4LWNvbCBvdmVyZmxvdy15LWhpZGRlblwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgei0yMCBoLWZ1bGwgdy1mdWxsIGJnLWRhdGFzZXQtY2h1bmstbGlzdC1tYXNrLWJnXCIgLz5cbiAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9KS5tYXAoKF8sIGluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2luZGV4fSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGdhcC14LTJcIj5cbiAgICAgICAgICAgIDxDaGVja2JveFxuICAgICAgICAgICAgICBrZXk9e2Ake2luZGV4fS1jaGVja2JveGB9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LTMuNSBzaHJpbmstMFwiXG4gICAgICAgICAgICAgIGRpc2FibGVkXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncm93XCI+XG4gICAgICAgICAgICAgIDxDYXJkU2tlbHRvbiAvPlxuICAgICAgICAgICAgICB7aW5kZXggIT09IDkgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTNcIj5cbiAgICAgICAgICAgICAgICAgIDxEaXZpZGVyIHR5cGU9XCJob3Jpem9udGFsXCIgY2xhc3NOYW1lPVwibXktMSBiZy1kaXZpZGVyLXN1YnRsZVwiIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgfSl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhQYXJhZ3JhcGhMaXN0U2tlbGV0b24pXG4iXX0=