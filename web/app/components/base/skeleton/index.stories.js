"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const _1 = require(".");
const SkeletonDemo = () => {
    return (<div className="flex w-full max-w-xl flex-col gap-6 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Loading skeletons</div>
      <div className="space-y-4 rounded-xl border border-divider-subtle bg-background-default-subtle p-4">
        <_1.SkeletonContainer>
          <_1.SkeletonRow>
            <_1.SkeletonRectangle className="h-4 w-32 rounded-md"/>
            <_1.SkeletonPoint />
            <_1.SkeletonRectangle className="h-4 w-20 rounded-md"/>
          </_1.SkeletonRow>
          <_1.SkeletonRow>
            <_1.SkeletonRectangle className="h-3 w-full"/>
          </_1.SkeletonRow>
          <_1.SkeletonRow>
            <_1.SkeletonRectangle className="h-3 w-5/6"/>
          </_1.SkeletonRow>
        </_1.SkeletonContainer>
      </div>
      <div className="space-y-3 rounded-xl border border-divider-subtle bg-background-default-subtle p-4">
        <_1.SkeletonRow className="items-start">
          <_1.SkeletonRectangle className="mr-4 h-10 w-10 rounded-full"/>
          <_1.SkeletonContainer className="w-full">
            <_1.SkeletonRectangle className="h-3 w-1/3"/>
            <_1.SkeletonRectangle className="h-3 w-full"/>
            <_1.SkeletonRectangle className="h-3 w-3/4"/>
          </_1.SkeletonContainer>
        </_1.SkeletonRow>
      </div>
    </div>);
};
const meta = {
    title: 'Base/Feedback/Skeleton',
    component: SkeletonDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Composable skeleton primitives (container, row, rectangle, point) to sketch loading states for panels and lists.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUtVO0FBRVYsTUFBTSxZQUFZLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUdBQXlHLENBQ3RIO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FDOUY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0ZBQW9GLENBQ2pHO1FBQUEsQ0FBQyxvQkFBaUIsQ0FDaEI7VUFBQSxDQUFDLGNBQVcsQ0FDVjtZQUFBLENBQUMsb0JBQWlCLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUNsRDtZQUFBLENBQUMsZ0JBQWEsQ0FBQyxBQUFELEVBQ2Q7WUFBQSxDQUFDLG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFDcEQ7VUFBQSxFQUFFLGNBQVcsQ0FDYjtVQUFBLENBQUMsY0FBVyxDQUNWO1lBQUEsQ0FBQyxvQkFBaUIsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUMzQztVQUFBLEVBQUUsY0FBVyxDQUNiO1VBQUEsQ0FBQyxjQUFXLENBQ1Y7WUFBQSxDQUFDLG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQzFDO1VBQUEsRUFBRSxjQUFXLENBQ2Y7UUFBQSxFQUFFLG9CQUFpQixDQUNyQjtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9GQUFvRixDQUNqRztRQUFBLENBQUMsY0FBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQ2xDO1VBQUEsQ0FBQyxvQkFBaUIsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLEVBQzFEO1VBQUEsQ0FBQyxvQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUNuQztZQUFBLENBQUMsb0JBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFDeEM7WUFBQSxDQUFDLG9CQUFpQixDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQ3pDO1lBQUEsQ0FBQyxvQkFBaUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUMxQztVQUFBLEVBQUUsb0JBQWlCLENBQ3JCO1FBQUEsRUFBRSxjQUFXLENBQ2Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHdCQUF3QjtJQUMvQixTQUFTLEVBQUUsWUFBWTtJQUN2QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLGtIQUFrSDthQUM5SDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDaUIsQ0FBQTtBQUVyQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQge1xuICBTa2VsZXRvbkNvbnRhaW5lcixcbiAgU2tlbGV0b25Qb2ludCxcbiAgU2tlbGV0b25SZWN0YW5nbGUsXG4gIFNrZWxldG9uUm93LFxufSBmcm9tICcuJ1xuXG5jb25zdCBTa2VsZXRvbkRlbW8gPSAoKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy14bCBmbGV4LWNvbCBnYXAtNiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPkxvYWRpbmcgc2tlbGV0b25zPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSBwLTRcIj5cbiAgICAgICAgPFNrZWxldG9uQ29udGFpbmVyPlxuICAgICAgICAgIDxTa2VsZXRvblJvdz5cbiAgICAgICAgICAgIDxTa2VsZXRvblJlY3RhbmdsZSBjbGFzc05hbWU9XCJoLTQgdy0zMiByb3VuZGVkLW1kXCIgLz5cbiAgICAgICAgICAgIDxTa2VsZXRvblBvaW50IC8+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC00IHctMjAgcm91bmRlZC1tZFwiIC8+XG4gICAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgICA8U2tlbGV0b25Sb3c+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC0zIHctZnVsbFwiIC8+XG4gICAgICAgICAgPC9Ta2VsZXRvblJvdz5cbiAgICAgICAgICA8U2tlbGV0b25Sb3c+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC0zIHctNS82XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMyByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSBwLTRcIj5cbiAgICAgICAgPFNrZWxldG9uUm93IGNsYXNzTmFtZT1cIml0ZW1zLXN0YXJ0XCI+XG4gICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cIm1yLTQgaC0xMCB3LTEwIHJvdW5kZWQtZnVsbFwiIC8+XG4gICAgICAgICAgPFNrZWxldG9uQ29udGFpbmVyIGNsYXNzTmFtZT1cInctZnVsbFwiPlxuICAgICAgICAgICAgPFNrZWxldG9uUmVjdGFuZ2xlIGNsYXNzTmFtZT1cImgtMyB3LTEvM1wiIC8+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC0zIHctZnVsbFwiIC8+XG4gICAgICAgICAgICA8U2tlbGV0b25SZWN0YW5nbGUgY2xhc3NOYW1lPVwiaC0zIHctMy80XCIgLz5cbiAgICAgICAgICA8L1NrZWxldG9uQ29udGFpbmVyPlxuICAgICAgICA8L1NrZWxldG9uUm93PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL1NrZWxldG9uJyxcbiAgY29tcG9uZW50OiBTa2VsZXRvbkRlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQ29tcG9zYWJsZSBza2VsZXRvbiBwcmltaXRpdmVzIChjb250YWluZXIsIHJvdywgcmVjdGFuZ2xlLCBwb2ludCkgdG8gc2tldGNoIGxvYWRpbmcgc3RhdGVzIGZvciBwYW5lbHMgYW5kIGxpc3RzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFNrZWxldG9uRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuIl19