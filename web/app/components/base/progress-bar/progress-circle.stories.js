"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearComplete = exports.Playground = void 0;
const react_1 = require("react");
const progress_circle_1 = require("./progress-circle");
const ProgressCircleDemo = ({ initialPercentage = 42, size = 24, }) => {
    const [percentage, setPercentage] = (0, react_1.useState)(initialPercentage);
    return (<div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-text-tertiary">
        <span>Upload progress</span>
        <span className="rounded-md border border-divider-subtle bg-background-default px-2 py-1 text-[11px] text-text-secondary">
          {percentage}
          %
        </span>
      </div>
      <div className="flex items-center gap-4">
        <progress_circle_1.default percentage={percentage} size={size} className="shrink-0"/>
        <input type="range" min={0} max={100} step={1} value={percentage} onChange={event => setPercentage(Number.parseInt(event.target.value, 10))} className="h-2 w-full cursor-pointer appearance-none rounded-full bg-divider-subtle accent-primary-600"/>
      </div>
      <div className="flex gap-3 text-xs text-text-tertiary">
        <label className="flex items-center gap-1">
          Size
          <input type="number" min={12} max={48} value={size} disabled className="h-7 w-16 rounded-md border border-divider-subtle bg-background-default px-2 text-xs"/>
        </label>
      </div>
      <div className="rounded-lg border border-divider-subtle bg-background-default-subtle p-3 text-[11px] leading-relaxed text-text-tertiary">
        ProgressCircle renders a deterministic SVG slice. Advance the slider to preview how the arc grows for upload indicators.
      </div>
    </div>);
};
const meta = {
    title: 'Base/Feedback/ProgressCircle',
    component: ProgressCircleDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Compact radial progress indicator wired to upload flows. The story provides a slider to scrub through percentages.',
            },
        },
    },
    argTypes: {
        initialPercentage: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
        },
        size: {
            control: { type: 'number', min: 12, max: 48, step: 2 },
        },
    },
    args: {
        initialPercentage: 42,
        size: 24,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.NearComplete = {
    args: {
        initialPercentage: 92,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtY2lyY2xlLnN0b3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9ncmVzcy1jaXJjbGUuc3Rvcmllcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQWdDO0FBQ2hDLHVEQUE4QztBQUU5QyxNQUFNLGtCQUFrQixHQUFHLENBQUMsRUFDMUIsaUJBQWlCLEdBQUcsRUFBRSxFQUN0QixJQUFJLEdBQUcsRUFBRSxHQUlWLEVBQUUsRUFBRTtJQUNILE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFL0QsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5R0FBeUcsQ0FDdEg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEZBQTBGLENBQ3ZHO1FBQUEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FDM0I7UUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUdBQXlHLENBQ3ZIO1VBQUEsQ0FBQyxVQUFVLENBQ1g7O1FBQ0YsRUFBRSxJQUFJLENBQ1I7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDdEM7UUFBQSxDQUFDLHlCQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFDeEU7UUFBQSxDQUFDLEtBQUssQ0FDSixJQUFJLENBQUMsT0FBTyxDQUNaLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNQLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNULElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNSLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNsQixRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDMUUsU0FBUyxDQUFDLDZGQUE2RixFQUUzRztNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUNwRDtRQUFBLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDeEM7O1VBQ0EsQ0FBQyxLQUFLLENBQ0osSUFBSSxDQUFDLFFBQVEsQ0FDYixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDUixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDWixRQUFRLENBQ1IsU0FBUyxDQUFDLHFGQUFxRixFQUVuRztRQUFBLEVBQUUsS0FBSyxDQUNUO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUhBQXlILENBQ3RJOztNQUNGLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsOEJBQThCO0lBQ3JDLFNBQVMsRUFBRSxrQkFBa0I7SUFDN0IsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxvSEFBb0g7YUFDaEk7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsaUJBQWlCLEVBQUU7WUFDakIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtTQUN0RDtRQUNELElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7U0FDdkQ7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsSUFBSSxFQUFFLEVBQUU7S0FDVDtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUN1QixDQUFBO0FBRTNDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQTtBQUV0QixRQUFBLFlBQVksR0FBVTtJQUNqQyxJQUFJLEVBQUU7UUFDSixpQkFBaUIsRUFBRSxFQUFFO0tBQ3RCO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUHJvZ3Jlc3NDaXJjbGUgZnJvbSAnLi9wcm9ncmVzcy1jaXJjbGUnXG5cbmNvbnN0IFByb2dyZXNzQ2lyY2xlRGVtbyA9ICh7XG4gIGluaXRpYWxQZXJjZW50YWdlID0gNDIsXG4gIHNpemUgPSAyNCxcbn06IHtcbiAgaW5pdGlhbFBlcmNlbnRhZ2U/OiBudW1iZXJcbiAgc2l6ZT86IG51bWJlclxufSkgPT4ge1xuICBjb25zdCBbcGVyY2VudGFnZSwgc2V0UGVyY2VudGFnZV0gPSB1c2VTdGF0ZShpbml0aWFsUGVyY2VudGFnZSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctbWQgZmxleC1jb2wgZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIDxzcGFuPlVwbG9hZCBwcm9ncmVzczwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0yIHB5LTEgdGV4dC1bMTFweF0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIHtwZXJjZW50YWdlfVxuICAgICAgICAgICVcbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgIDxQcm9ncmVzc0NpcmNsZSBwZXJjZW50YWdlPXtwZXJjZW50YWdlfSBzaXplPXtzaXplfSBjbGFzc05hbWU9XCJzaHJpbmstMFwiIC8+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgbWluPXswfVxuICAgICAgICAgIG1heD17MTAwfVxuICAgICAgICAgIHN0ZXA9ezF9XG4gICAgICAgICAgdmFsdWU9e3BlcmNlbnRhZ2V9XG4gICAgICAgICAgb25DaGFuZ2U9e2V2ZW50ID0+IHNldFBlcmNlbnRhZ2UoTnVtYmVyLnBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSwgMTApKX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJoLTIgdy1mdWxsIGN1cnNvci1wb2ludGVyIGFwcGVhcmFuY2Utbm9uZSByb3VuZGVkLWZ1bGwgYmctZGl2aWRlci1zdWJ0bGUgYWNjZW50LXByaW1hcnktNjAwXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0zIHRleHQteHMgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgIFNpemVcbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgbWluPXsxMn1cbiAgICAgICAgICAgIG1heD17NDh9XG4gICAgICAgICAgICB2YWx1ZT17c2l6ZX1cbiAgICAgICAgICAgIGRpc2FibGVkXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJoLTcgdy0xNiByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0IHB4LTIgdGV4dC14c1wiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSBwLTMgdGV4dC1bMTFweF0gbGVhZGluZy1yZWxheGVkIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICBQcm9ncmVzc0NpcmNsZSByZW5kZXJzIGEgZGV0ZXJtaW5pc3RpYyBTVkcgc2xpY2UuIEFkdmFuY2UgdGhlIHNsaWRlciB0byBwcmV2aWV3IGhvdyB0aGUgYXJjIGdyb3dzIGZvciB1cGxvYWQgaW5kaWNhdG9ycy5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Qcm9ncmVzc0NpcmNsZScsXG4gIGNvbXBvbmVudDogUHJvZ3Jlc3NDaXJjbGVEZW1vLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0NvbXBhY3QgcmFkaWFsIHByb2dyZXNzIGluZGljYXRvciB3aXJlZCB0byB1cGxvYWQgZmxvd3MuIFRoZSBzdG9yeSBwcm92aWRlcyBhIHNsaWRlciB0byBzY3J1YiB0aHJvdWdoIHBlcmNlbnRhZ2VzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgaW5pdGlhbFBlcmNlbnRhZ2U6IHtcbiAgICAgIGNvbnRyb2w6IHsgdHlwZTogJ3JhbmdlJywgbWluOiAwLCBtYXg6IDEwMCwgc3RlcDogMSB9LFxuICAgIH0sXG4gICAgc2l6ZToge1xuICAgICAgY29udHJvbDogeyB0eXBlOiAnbnVtYmVyJywgbWluOiAxMiwgbWF4OiA0OCwgc3RlcDogMiB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBpbml0aWFsUGVyY2VudGFnZTogNDIsXG4gICAgc2l6ZTogMjQsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFByb2dyZXNzQ2lyY2xlRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgTmVhckNvbXBsZXRlOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGluaXRpYWxQZXJjZW50YWdlOiA5MixcbiAgfSxcbn1cbiJdfQ==