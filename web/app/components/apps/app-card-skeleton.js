"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCardSkeleton = void 0;
const React = require("react");
const skeleton_1 = require("@/app/components/base/skeleton");
/**
 * Skeleton placeholder for App cards during loading states.
 * Matches the visual layout of AppCard component.
 */
exports.AppCardSkeleton = React.memo(({ count = 6 }) => {
    return (<>
      {Array.from({ length: count }).map((_, index) => (<div key={index} className="h-[160px] rounded-xl border-[0.5px] border-components-card-border bg-components-card-bg p-4">
          <skeleton_1.SkeletonContainer className="h-full">
            <skeleton_1.SkeletonRow>
              <skeleton_1.SkeletonRectangle className="h-10 w-10 rounded-lg"/>
              <div className="flex flex-1 flex-col gap-1">
                <skeleton_1.SkeletonRectangle className="h-4 w-2/3"/>
                <skeleton_1.SkeletonRectangle className="h-3 w-1/3"/>
              </div>
            </skeleton_1.SkeletonRow>
            <div className="mt-4 flex flex-col gap-2">
              <skeleton_1.SkeletonRectangle className="h-3 w-full"/>
              <skeleton_1.SkeletonRectangle className="h-3 w-4/5"/>
            </div>
          </skeleton_1.SkeletonContainer>
        </div>))}
    </>);
});
exports.AppCardSkeleton.displayName = 'AppCardSkeleton';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNhcmQtc2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtY2FyZC1za2VsZXRvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBRVosK0JBQThCO0FBQzlCLDZEQUFrRztBQU1sRzs7O0dBR0c7QUFDVSxRQUFBLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUF3QixFQUFFLEVBQUU7SUFDaEYsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUMvQyxDQUFDLEdBQUcsQ0FDRixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDWCxTQUFTLENBQUMsNkZBQTZGLENBRXZHO1VBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNuQztZQUFBLENBQUMsc0JBQVcsQ0FDVjtjQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUNuRDtjQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FDekM7Z0JBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUN4QztnQkFBQSxDQUFDLDRCQUFpQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQzFDO2NBQUEsRUFBRSxHQUFHLENBQ1A7WUFBQSxFQUFFLHNCQUFXLENBQ2I7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQ3ZDO2NBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUN6QztjQUFBLENBQUMsNEJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFDMUM7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsNEJBQWlCLENBQ3JCO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLENBQ0o7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQyxDQUFBO0FBRUYsdUJBQWUsQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBTa2VsZXRvbkNvbnRhaW5lciwgU2tlbGV0b25SZWN0YW5nbGUsIFNrZWxldG9uUm93IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3NrZWxldG9uJ1xuXG50eXBlIEFwcENhcmRTa2VsZXRvblByb3BzID0ge1xuICBjb3VudD86IG51bWJlclxufVxuXG4vKipcbiAqIFNrZWxldG9uIHBsYWNlaG9sZGVyIGZvciBBcHAgY2FyZHMgZHVyaW5nIGxvYWRpbmcgc3RhdGVzLlxuICogTWF0Y2hlcyB0aGUgdmlzdWFsIGxheW91dCBvZiBBcHBDYXJkIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNvbnN0IEFwcENhcmRTa2VsZXRvbiA9IFJlYWN0Lm1lbW8oKHsgY291bnQgPSA2IH06IEFwcENhcmRTa2VsZXRvblByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9KS5tYXAoKF8sIGluZGV4KSA9PiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIGNsYXNzTmFtZT1cImgtWzE2MHB4XSByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLWNhcmQtYm9yZGVyIGJnLWNvbXBvbmVudHMtY2FyZC1iZyBwLTRcIlxuICAgICAgICA+XG4gICAgICAgICAgPFNrZWxldG9uQ29udGFpbmVyIGNsYXNzTmFtZT1cImgtZnVsbFwiPlxuICAgICAgICAgICAgPFNrZWxldG9uUm93PlxuICAgICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC0xMCB3LTEwIHJvdW5kZWQtbGdcIiAvPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC0xIGZsZXgtY29sIGdhcC0xXCI+XG4gICAgICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cImgtNCB3LTIvM1wiIC8+XG4gICAgICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cImgtMyB3LTEvM1wiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBmbGV4IGZsZXgtY29sIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJoLTMgdy1mdWxsXCIgLz5cbiAgICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cImgtMyB3LTQvNVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkpfVxuICAgIDwvPlxuICApXG59KVxuXG5BcHBDYXJkU2tlbGV0b24uZGlzcGxheU5hbWUgPSAnQXBwQ2FyZFNrZWxldG9uJ1xuIl19