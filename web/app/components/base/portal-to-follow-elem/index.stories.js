"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SameWidthPanel = exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const TooltipCard = ({ title, description }) => (<div className="w-[220px] rounded-lg border border-divider-subtle bg-components-panel-bg px-3 py-2 text-sm text-text-secondary shadow-lg">
    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-text-tertiary">
      {title}
    </div>
    <p className="leading-5">{description}</p>
  </div>);
const PortalDemo = ({ placement = 'bottom', triggerPopupSameWidth = false, }) => {
    const [controlledOpen, setControlledOpen] = (0, react_1.useState)(false);
    return (<div className="flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="flex flex-wrap items-center gap-4">
        <_1.PortalToFollowElem placement={placement} triggerPopupSameWidth={triggerPopupSameWidth}>
          <_1.PortalToFollowElemTrigger className="rounded-md border border-divider-subtle bg-background-default px-3 py-2 text-sm text-text-secondary">
            Hover me
          </_1.PortalToFollowElemTrigger>
          <_1.PortalToFollowElemContent className="z-40">
            <TooltipCard title="Auto follow" description="The floating element repositions itself when the trigger moves, using Floating UI under the hood."/>
          </_1.PortalToFollowElemContent>
        </_1.PortalToFollowElem>

        <_1.PortalToFollowElem placement="bottom-start" triggerPopupSameWidth open={controlledOpen} onOpenChange={setControlledOpen}>
          <_1.PortalToFollowElemTrigger asChild>
            <button type="button" className="rounded-md border border-divider-subtle bg-background-default-subtle px-3 py-2 text-sm font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => setControlledOpen(prev => !prev)}>
              Controlled toggle
            </button>
          </_1.PortalToFollowElemTrigger>
          <_1.PortalToFollowElemContent className="z-40">
            <TooltipCard title="Controlled" description="This panel uses the controlled API via onOpenChange/open props, and matches the trigger width."/>
          </_1.PortalToFollowElemContent>
        </_1.PortalToFollowElem>
      </div>
    </div>);
};
const meta = {
    title: 'Base/Feedback/PortalToFollowElem',
    component: PortalDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Floating UI based portal that tracks trigger positioning. Demonstrates both hover-driven and controlled usage.',
            },
        },
    },
    argTypes: {
        placement: {
            control: 'select',
            options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
        },
        triggerPopupSameWidth: { control: 'boolean' },
    },
    args: {
        placement: 'bottom',
        triggerPopupSameWidth: false,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.SameWidthPanel = {
    args: {
        triggerPopupSameWidth: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFJVTtBQUVWLE1BQU0sV0FBVyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUEwQyxFQUFFLEVBQUUsQ0FBQyxDQUN0RixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEhBQTBILENBQ3ZJO0lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJFQUEyRSxDQUN4RjtNQUFBLENBQUMsS0FBSyxDQUNSO0lBQUEsRUFBRSxHQUFHLENBQ0w7SUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUMzQztFQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsRUFDbEIsU0FBUyxHQUFHLFFBQVEsRUFDcEIscUJBQXFCLEdBQUcsS0FBSyxHQUk5QixFQUFFLEVBQUU7SUFDSCxNQUFNLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTNELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEdBQTBHLENBQ3ZIO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUNoRDtRQUFBLENBQUMscUJBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUNyRjtVQUFBLENBQUMsNEJBQXlCLENBQUMsU0FBUyxDQUFDLHFHQUFxRyxDQUN4STs7VUFDRixFQUFFLDRCQUF5QixDQUMzQjtVQUFBLENBQUMsNEJBQXlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDekM7WUFBQSxDQUFDLFdBQVcsQ0FDVixLQUFLLENBQUMsYUFBYSxDQUNuQixXQUFXLENBQUMsbUdBQW1HLEVBRW5IO1VBQUEsRUFBRSw0QkFBeUIsQ0FDN0I7UUFBQSxFQUFFLHFCQUFrQixDQUVwQjs7UUFBQSxDQUFDLHFCQUFrQixDQUNqQixTQUFTLENBQUMsY0FBYyxDQUN4QixxQkFBcUIsQ0FDckIsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQ3JCLFlBQVksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBRWhDO1VBQUEsQ0FBQyw0QkFBeUIsQ0FBQyxPQUFPLENBQ2hDO1lBQUEsQ0FBQyxNQUFNLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FDYixTQUFTLENBQUMsa0pBQWtKLENBQzVKLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUVoRDs7WUFDRixFQUFFLE1BQU0sQ0FDVjtVQUFBLEVBQUUsNEJBQXlCLENBQzNCO1VBQUEsQ0FBQyw0QkFBeUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUN6QztZQUFBLENBQUMsV0FBVyxDQUNWLEtBQUssQ0FBQyxZQUFZLENBQ2xCLFdBQVcsQ0FBQyxnR0FBZ0csRUFFaEg7VUFBQSxFQUFFLDRCQUF5QixDQUM3QjtRQUFBLEVBQUUscUJBQWtCLENBQ3RCO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxrQ0FBa0M7SUFDekMsU0FBUyxFQUFFLFVBQVU7SUFDckIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxnSEFBZ0g7YUFDNUg7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsU0FBUyxFQUFFO1lBQ1QsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUM7U0FDakY7UUFDRCxxQkFBcUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7S0FDOUM7SUFDRCxJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsUUFBUTtRQUNuQixxQkFBcUIsRUFBRSxLQUFLO0tBQzdCO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ2UsQ0FBQTtBQUVuQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUE7QUFFdEIsUUFBQSxjQUFjLEdBQVU7SUFDbkMsSUFBSSxFQUFFO1FBQ0oscUJBQXFCLEVBQUUsSUFBSTtLQUM1QjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyLFxufSBmcm9tICcuJ1xuXG5jb25zdCBUb29sdGlwQ2FyZCA9ICh7IHRpdGxlLCBkZXNjcmlwdGlvbiB9OiB7IHRpdGxlOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcgfSkgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInctWzIyMHB4XSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBweC0zIHB5LTIgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5IHNoYWRvdy1sZ1wiPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMSB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE0ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAge3RpdGxlfVxuICAgIDwvZGl2PlxuICAgIDxwIGNsYXNzTmFtZT1cImxlYWRpbmctNVwiPntkZXNjcmlwdGlvbn08L3A+XG4gIDwvZGl2PlxuKVxuXG5jb25zdCBQb3J0YWxEZW1vID0gKHtcbiAgcGxhY2VtZW50ID0gJ2JvdHRvbScsXG4gIHRyaWdnZXJQb3B1cFNhbWVXaWR0aCA9IGZhbHNlLFxufToge1xuICBwbGFjZW1lbnQ/OiBQYXJhbWV0ZXJzPHR5cGVvZiBQb3J0YWxUb0ZvbGxvd0VsZW0+WzBdWydwbGFjZW1lbnQnXVxuICB0cmlnZ2VyUG9wdXBTYW1lV2lkdGg/OiBib29sZWFuXG59KSA9PiB7XG4gIGNvbnN0IFtjb250cm9sbGVkT3Blbiwgc2V0Q29udHJvbGxlZE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIG1heC13LTN4bCBmbGV4LWNvbCBnYXAtNiByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtIHBsYWNlbWVudD17cGxhY2VtZW50fSB0cmlnZ2VyUG9wdXBTYW1lV2lkdGg9e3RyaWdnZXJQb3B1cFNhbWVXaWR0aH0+XG4gICAgICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTIgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICBIb3ZlciBtZVxuICAgICAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcj5cbiAgICAgICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LTQwXCI+XG4gICAgICAgICAgICA8VG9vbHRpcENhcmRcbiAgICAgICAgICAgICAgdGl0bGU9XCJBdXRvIGZvbGxvd1wiXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uPVwiVGhlIGZsb2F0aW5nIGVsZW1lbnQgcmVwb3NpdGlvbnMgaXRzZWxmIHdoZW4gdGhlIHRyaWdnZXIgbW92ZXMsIHVzaW5nIEZsb2F0aW5nIFVJIHVuZGVyIHRoZSBob29kLlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW0+XG5cbiAgICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbVxuICAgICAgICAgIHBsYWNlbWVudD1cImJvdHRvbS1zdGFydFwiXG4gICAgICAgICAgdHJpZ2dlclBvcHVwU2FtZVdpZHRoXG4gICAgICAgICAgb3Blbj17Y29udHJvbGxlZE9wZW59XG4gICAgICAgICAgb25PcGVuQ2hhbmdlPXtzZXRDb250cm9sbGVkT3Blbn1cbiAgICAgICAgPlxuICAgICAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyIGFzQ2hpbGQ+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSBweC0zIHB5LTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb250cm9sbGVkT3BlbihwcmV2ID0+ICFwcmV2KX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQ29udHJvbGxlZCB0b2dnbGVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcj5cbiAgICAgICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LTQwXCI+XG4gICAgICAgICAgICA8VG9vbHRpcENhcmRcbiAgICAgICAgICAgICAgdGl0bGU9XCJDb250cm9sbGVkXCJcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb249XCJUaGlzIHBhbmVsIHVzZXMgdGhlIGNvbnRyb2xsZWQgQVBJIHZpYSBvbk9wZW5DaGFuZ2Uvb3BlbiBwcm9wcywgYW5kIG1hdGNoZXMgdGhlIHRyaWdnZXIgd2lkdGguXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50PlxuICAgICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Qb3J0YWxUb0ZvbGxvd0VsZW0nLFxuICBjb21wb25lbnQ6IFBvcnRhbERlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnRmxvYXRpbmcgVUkgYmFzZWQgcG9ydGFsIHRoYXQgdHJhY2tzIHRyaWdnZXIgcG9zaXRpb25pbmcuIERlbW9uc3RyYXRlcyBib3RoIGhvdmVyLWRyaXZlbiBhbmQgY29udHJvbGxlZCB1c2FnZS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIHBsYWNlbWVudDoge1xuICAgICAgY29udHJvbDogJ3NlbGVjdCcsXG4gICAgICBvcHRpb25zOiBbJ3RvcCcsICd0b3Atc3RhcnQnLCAndG9wLWVuZCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnXSxcbiAgICB9LFxuICAgIHRyaWdnZXJQb3B1cFNhbWVXaWR0aDogeyBjb250cm9sOiAnYm9vbGVhbicgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgdHJpZ2dlclBvcHVwU2FtZVdpZHRoOiBmYWxzZSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgUG9ydGFsRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgU2FtZVdpZHRoUGFuZWw6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgdHJpZ2dlclBvcHVwU2FtZVdpZHRoOiB0cnVlLFxuICB9LFxufVxuIl19