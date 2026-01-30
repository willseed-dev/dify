"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const _1 = require(".");
const TooltipGrid = () => {
    return (<div className="flex w-full max-w-xl flex-col gap-6 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Hover tooltips</div>
      <div className="flex flex-wrap gap-4">
        <_1.default popupContent="Helpful hint explaining the setting.">
          <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1 text-xs font-medium text-text-secondary hover:bg-state-base-hover">
            Hover me
          </button>
        </_1.default>
        <_1.default popupContent="Placement can vary." position="right">
          <span className="rounded-md bg-background-default px-3 py-1 text-xs text-text-secondary">
            Right tooltip
          </span>
        </_1.default>
      </div>
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Click tooltips</div>
      <div className="flex flex-wrap gap-4">
        <_1.default popupContent="Click again to close." triggerMethod="click" position="bottom-start">
          <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1 text-xs font-medium text-text-secondary hover:bg-state-base-hover">
            Click trigger
          </button>
        </_1.default>
        <_1.default popupContent="Decoration disabled" triggerMethod="click" noDecoration>
          <span className="rounded-md border border-dashed border-divider-regular px-3 py-1 text-xs text-text-secondary">
            Plain content
          </span>
        </_1.default>
      </div>
    </div>);
};
const meta = {
    title: 'Base/Feedback/Tooltip',
    component: TooltipGrid,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Portal-based tooltip component supporting hover and click triggers, custom placements, and decorated content.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF1QjtBQUV2QixNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5R0FBeUcsQ0FDdEg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FDM0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO1FBQUEsQ0FBQyxVQUFPLENBQUMsWUFBWSxDQUFDLHNDQUFzQyxDQUMxRDtVQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLDJJQUEySSxDQUVySjs7VUFDRixFQUFFLE1BQU0sQ0FDVjtRQUFBLEVBQUUsVUFBTyxDQUNUO1FBQUEsQ0FBQyxVQUFPLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQzFEO1VBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHdFQUF3RSxDQUN0Rjs7VUFDRixFQUFFLElBQUksQ0FDUjtRQUFBLEVBQUUsVUFBTyxDQUNYO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FDM0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQ25DO1FBQUEsQ0FBQyxVQUFPLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FDekY7VUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQywySUFBMkksQ0FFcko7O1VBQ0YsRUFBRSxNQUFNLENBQ1Y7UUFBQSxFQUFFLFVBQU8sQ0FDVDtRQUFBLENBQUMsVUFBTyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FDNUU7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsOEZBQThGLENBQzVHOztVQUNGLEVBQUUsSUFBSSxDQUNSO1FBQUEsRUFBRSxVQUFPLENBQ1g7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHVCQUF1QjtJQUM5QixTQUFTLEVBQUUsV0FBVztJQUN0QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLCtHQUErRzthQUMzSDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDZ0IsQ0FBQTtBQUVwQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuJ1xuXG5jb25zdCBUb29sdGlwR3JpZCA9ICgpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIG1heC13LXhsIGZsZXgtY29sIGdhcC02IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+SG92ZXIgdG9vbHRpcHM8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgZ2FwLTRcIj5cbiAgICAgICAgPFRvb2x0aXAgcG9wdXBDb250ZW50PVwiSGVscGZ1bCBoaW50IGV4cGxhaW5pbmcgdGhlIHNldHRpbmcuXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0IHB4LTMgcHktMSB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgSG92ZXIgbWVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICA8VG9vbHRpcCBwb3B1cENvbnRlbnQ9XCJQbGFjZW1lbnQgY2FuIHZhcnkuXCIgcG9zaXRpb249XCJyaWdodFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctYmFja2dyb3VuZC1kZWZhdWx0IHB4LTMgcHktMSB0ZXh0LXhzIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIFJpZ2h0IHRvb2x0aXBcbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvVG9vbHRpcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5DbGljayB0b29sdGlwczwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBnYXAtNFwiPlxuICAgICAgICA8VG9vbHRpcCBwb3B1cENvbnRlbnQ9XCJDbGljayBhZ2FpbiB0byBjbG9zZS5cIiB0cmlnZ2VyTWV0aG9kPVwiY2xpY2tcIiBwb3NpdGlvbj1cImJvdHRvbS1zdGFydFwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIENsaWNrIHRyaWdnZXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICA8VG9vbHRpcCBwb3B1cENvbnRlbnQ9XCJEZWNvcmF0aW9uIGRpc2FibGVkXCIgdHJpZ2dlck1ldGhvZD1cImNsaWNrXCIgbm9EZWNvcmF0aW9uPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLWRpdmlkZXItcmVndWxhciBweC0zIHB5LTEgdGV4dC14cyB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICBQbGFpbiBjb250ZW50XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svVG9vbHRpcCcsXG4gIGNvbXBvbmVudDogVG9vbHRpcEdyaWQsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnUG9ydGFsLWJhc2VkIHRvb2x0aXAgY29tcG9uZW50IHN1cHBvcnRpbmcgaG92ZXIgYW5kIGNsaWNrIHRyaWdnZXJzLCBjdXN0b20gcGxhY2VtZW50cywgYW5kIGRlY29yYXRlZCBjb250ZW50LicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFRvb2x0aXBHcmlkPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHt9XG4iXX0=