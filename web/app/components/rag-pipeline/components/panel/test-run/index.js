"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const provider_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/store/provider");
const store_1 = require("@/app/components/workflow/store");
const header_1 = require("./header");
const preparation_1 = require("./preparation");
const result_1 = require("./result");
const TestRunPanel = () => {
    const isPreparingDataSource = (0, store_1.useStore)(state => state.isPreparingDataSource);
    return (<div className="relative flex h-full w-[480px] flex-col rounded-l-2xl border-y-[0.5px] border-l-[0.5px] border-components-panel-border bg-components-panel-bg shadow-xl shadow-shadow-shadow-1">
      <header_1.default />
      {isPreparingDataSource
            ? (<provider_1.default>
              <preparation_1.default />
            </provider_1.default>)
            : (<result_1.default />)}
    </div>);
};
exports.default = TestRunPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrSEFBb0g7QUFDcEgsMkRBQTBEO0FBQzFELHFDQUE2QjtBQUM3QiwrQ0FBdUM7QUFDdkMscUNBQTZCO0FBRTdCLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtJQUN4QixNQUFNLHFCQUFxQixHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBRTVFLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsZ0xBQWdMLENBRTFMO01BQUEsQ0FBQyxnQkFBTSxDQUFDLEFBQUQsRUFDUDtNQUFBLENBQUMscUJBQXFCO1lBQ3BCLENBQUMsQ0FBQyxDQUNFLENBQUMsa0JBQWtCLENBQ2pCO2NBQUEsQ0FBQyxxQkFBVyxDQUFDLEFBQUQsRUFDZDtZQUFBLEVBQUUsa0JBQWtCLENBQUMsQ0FDdEI7WUFDSCxDQUFDLENBQUMsQ0FDRSxDQUFDLGdCQUFNLENBQUMsQUFBRCxFQUFHLENBQ1gsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFlBQVksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEYXRhU291cmNlUHJvdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9kb2N1bWVudHMvY3JlYXRlLWZyb20tcGlwZWxpbmUvZGF0YS1zb3VyY2Uvc3RvcmUvcHJvdmlkZXInXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vaGVhZGVyJ1xuaW1wb3J0IFByZXBhcmF0aW9uIGZyb20gJy4vcHJlcGFyYXRpb24nXG5pbXBvcnQgUmVzdWx0IGZyb20gJy4vcmVzdWx0J1xuXG5jb25zdCBUZXN0UnVuUGFuZWwgPSAoKSA9PiB7XG4gIGNvbnN0IGlzUHJlcGFyaW5nRGF0YVNvdXJjZSA9IHVzZVN0b3JlKHN0YXRlID0+IHN0YXRlLmlzUHJlcGFyaW5nRGF0YVNvdXJjZSlcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggaC1mdWxsIHctWzQ4MHB4XSBmbGV4LWNvbCByb3VuZGVkLWwtMnhsIGJvcmRlci15LVswLjVweF0gYm9yZGVyLWwtWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZyBzaGFkb3cteGwgc2hhZG93LXNoYWRvdy1zaGFkb3ctMVwiXG4gICAgPlxuICAgICAgPEhlYWRlciAvPlxuICAgICAge2lzUHJlcGFyaW5nRGF0YVNvdXJjZVxuICAgICAgICA/IChcbiAgICAgICAgICAgIDxEYXRhU291cmNlUHJvdmlkZXI+XG4gICAgICAgICAgICAgIDxQcmVwYXJhdGlvbiAvPlxuICAgICAgICAgICAgPC9EYXRhU291cmNlUHJvdmlkZXI+XG4gICAgICAgICAgKVxuICAgICAgICA6IChcbiAgICAgICAgICAgIDxSZXN1bHQgLz5cbiAgICAgICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRlc3RSdW5QYW5lbFxuIl19