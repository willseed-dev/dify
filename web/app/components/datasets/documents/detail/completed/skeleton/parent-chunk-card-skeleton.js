"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const skeleton_1 = require("@/app/components/base/skeleton");
const ParentChunkCardSkelton = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div data-testid="parent-chunk-card-skeleton" className="flex flex-col pb-2">
      <skeleton_1.SkeletonContainer className="gap-y-0 p-1 pb-0">
        <skeleton_1.SkeletonContainer className="gap-y-0.5 px-2 pt-1.5">
          <skeleton_1.SkeletonRow className="py-0.5">
            <skeleton_1.SkeletonRectangle className="w-[72px] bg-text-quaternary"/>
            <skeleton_1.SkeletonPoint className="opacity-20"/>
            <skeleton_1.SkeletonRectangle className="w-24 bg-text-quaternary"/>
            <skeleton_1.SkeletonPoint className="opacity-20"/>
            <skeleton_1.SkeletonRectangle className="w-24 bg-text-quaternary"/>
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
      </skeleton_1.SkeletonContainer>
      <div className="mt-0.5 flex items-center px-3">
        <button type="button" className="system-xs-semibold-uppercase pt-0.5 text-components-button-secondary-accent-text-disabled" disabled>
          {t('operation.viewMore', { ns: 'common' })}
        </button>
      </div>
    </div>);
};
ParentChunkCardSkelton.displayName = 'ParentChunkCardSkelton';
exports.default = React.memo(ParentChunkCardSkelton);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyZW50LWNodW5rLWNhcmQtc2tlbGV0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYXJlbnQtY2h1bmstY2FyZC1za2VsZXRvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLDZEQUt1QztBQUV2QyxNQUFNLHNCQUFzQixHQUFHLEdBQUcsRUFBRTtJQUNsQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQzFFO01BQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQzdDO1FBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQ2xEO1VBQUEsQ0FBQyxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQzdCO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLEVBQzFEO1lBQUEsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQ3JDO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQ3REO1lBQUEsQ0FBQyx3QkFBYSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQ3JDO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQ3hEO1VBQUEsRUFBRSxzQkFBVyxDQUNiO1VBQUEsQ0FBQyxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQzdCO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLEVBQzFEO1VBQUEsRUFBRSxzQkFBVyxDQUNiO1VBQUEsQ0FBQyxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQzdCO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLEVBQzFEO1VBQUEsRUFBRSxzQkFBVyxDQUNiO1VBQUEsQ0FBQyxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQzdCO1lBQUEsQ0FBQyw0QkFBaUIsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLEVBQ3pEO1VBQUEsRUFBRSxzQkFBVyxDQUNmO1FBQUEsRUFBRSw0QkFBaUIsQ0FDckI7TUFBQSxFQUFFLDRCQUFpQixDQUNuQjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FDNUM7UUFBQSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQywyRkFBMkYsQ0FBQyxRQUFRLENBQ2xJO1VBQUEsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDNUM7UUFBQSxFQUFFLE1BQU0sQ0FDVjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsc0JBQXNCLENBQUMsV0FBVyxHQUFHLHdCQUF3QixDQUFBO0FBRTdELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHtcbiAgU2tlbGV0b25Db250YWluZXIsXG4gIFNrZWxldG9uUG9pbnQsXG4gIFNrZWxldG9uUmVjdGFuZ2xlLFxuICBTa2VsZXRvblJvdyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3NrZWxldG9uJ1xuXG5jb25zdCBQYXJlbnRDaHVua0NhcmRTa2VsdG9uID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicGFyZW50LWNodW5rLWNhcmQtc2tlbGV0b25cIiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHBiLTJcIj5cbiAgICAgIDxTa2VsZXRvbkNvbnRhaW5lciBjbGFzc05hbWU9XCJnYXAteS0wIHAtMSBwYi0wXCI+XG4gICAgICAgIDxTa2VsZXRvbkNvbnRhaW5lciBjbGFzc05hbWU9XCJnYXAteS0wLjUgcHgtMiBwdC0xLjVcIj5cbiAgICAgICAgICA8U2tlbGV0b25Sb3cgY2xhc3NOYW1lPVwicHktMC41XCI+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwidy1bNzJweF0gYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICAgIDxTa2VsZXRvblBvaW50IGNsYXNzTmFtZT1cIm9wYWNpdHktMjBcIiAvPlxuICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctMjQgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICAgIDxTa2VsZXRvblBvaW50IGNsYXNzTmFtZT1cIm9wYWNpdHktMjBcIiAvPlxuICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cInctMjQgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgICAgIDxTa2VsZXRvblJvdyBjbGFzc05hbWU9XCJweS0wLjVcIj5cbiAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgICAgIDxTa2VsZXRvblJvdyBjbGFzc05hbWU9XCJweS0wLjVcIj5cbiAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctdGV4dC1xdWF0ZXJuYXJ5XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgICAgIDxTa2VsZXRvblJvdyBjbGFzc05hbWU9XCJweS0wLjVcIj5cbiAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJ3LTIvMyBiZy10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgIDwvU2tlbGV0b25Sb3c+XG4gICAgICAgIDwvU2tlbGV0b25Db250YWluZXI+XG4gICAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0wLjUgZmxleCBpdGVtcy1jZW50ZXIgcHgtM1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlIHB0LTAuNSB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXNlY29uZGFyeS1hY2NlbnQtdGV4dC1kaXNhYmxlZFwiIGRpc2FibGVkPlxuICAgICAgICAgIHt0KCdvcGVyYXRpb24udmlld01vcmUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5QYXJlbnRDaHVua0NhcmRTa2VsdG9uLmRpc3BsYXlOYW1lID0gJ1BhcmVudENodW5rQ2FyZFNrZWx0b24nXG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oUGFyZW50Q2h1bmtDYXJkU2tlbHRvbilcbiJdfQ==