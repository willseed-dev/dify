"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const checkbox_1 = require("@/app/components/base/checkbox");
const placeholder_1 = require("@/app/components/plugins/card/base/placeholder");
const other_1 = require("../../../base/icons/src/vender/other");
const LoadingError = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex items-center space-x-2">
      <checkbox_1.default className="shrink-0" checked={false} disabled/>
      <div className="hover-bg-components-panel-on-panel-item-bg relative grow rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-on-panel-item-bg p-4 pb-3 shadow-xs">
        <div className="flex">
          <div className="relative flex h-10 w-10 items-center justify-center gap-2 rounded-[10px] border-[0.5px]
              border-state-destructive-border bg-state-destructive-hover p-1 backdrop-blur-sm">
            <div className="flex h-5 w-5 items-center justify-center">
              <other_1.Group className="text-text-quaternary"/>
            </div>
            <div className="absolute bottom-[-4px] right-[-4px] rounded-full border-[2px] border-components-panel-bg bg-state-destructive-solid">
              <react_1.RiCloseLine className="h-3 w-3 text-text-primary-on-surface"/>
            </div>
          </div>
          <div className="ml-3 grow">
            <div className="system-md-semibold flex h-5 items-center text-text-destructive">
              {t('installModal.pluginLoadError', { ns: 'plugin' })}
            </div>
            <div className="system-xs-regular mt-0.5 text-text-tertiary">
              {t('installModal.pluginLoadErrorDesc', { ns: 'plugin' })}
            </div>
          </div>
        </div>
        <placeholder_1.LoadingPlaceholder className="mt-3 w-[420px]"/>
      </div>
    </div>);
};
exports.default = React.memo(LoadingError);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1lcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvYWRpbmctZXJyb3IudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBQThDO0FBQzlDLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMsNkRBQXFEO0FBQ3JELGdGQUFtRjtBQUNuRixnRUFBNEQ7QUFFNUQsTUFBTSxZQUFZLEdBQU8sR0FBRyxFQUFFO0lBQzVCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMxQztNQUFBLENBQUMsa0JBQVEsQ0FDUCxTQUFTLENBQUMsVUFBVSxDQUNwQixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDZixRQUFRLEVBRVY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMktBQTJLLENBQ3hMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDbkI7VUFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUM7OEZBQ3dFLENBRWxGO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUN2RDtjQUFBLENBQUMsYUFBSyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsRUFDekM7WUFBQSxFQUFFLEdBQUcsQ0FDTDtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxSEFBcUgsQ0FDbEk7Y0FBQSxDQUFDLG1CQUFXLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUMvRDtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUN4QjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnRUFBZ0UsQ0FDN0U7Y0FBQSxDQUFDLENBQUMsQ0FBQyw4QkFBOEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUN0RDtZQUFBLEVBQUUsR0FBRyxDQUNMO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUMxRDtjQUFBLENBQUMsQ0FBQyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzFEO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxnQ0FBa0IsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQ2hEO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBDaGVja2JveCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hlY2tib3gnXG5pbXBvcnQgeyBMb2FkaW5nUGxhY2Vob2xkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvY2FyZC9iYXNlL3BsYWNlaG9sZGVyJ1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tICcuLi8uLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvb3RoZXInXG5cbmNvbnN0IExvYWRpbmdFcnJvcjogRkMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yXCI+XG4gICAgICA8Q2hlY2tib3hcbiAgICAgICAgY2xhc3NOYW1lPVwic2hyaW5rLTBcIlxuICAgICAgICBjaGVja2VkPXtmYWxzZX1cbiAgICAgICAgZGlzYWJsZWRcbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvdmVyLWJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyByZWxhdGl2ZSBncm93IHJvdW5kZWQteGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtb24tcGFuZWwtaXRlbS1iZyBwLTQgcGItMyBzaGFkb3cteHNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLTEwIHctMTAgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHJvdW5kZWQtWzEwcHhdIGJvcmRlci1bMC41cHhdXG4gICAgICAgICAgICAgIGJvcmRlci1zdGF0ZS1kZXN0cnVjdGl2ZS1ib3JkZXIgYmctc3RhdGUtZGVzdHJ1Y3RpdmUtaG92ZXIgcC0xIGJhY2tkcm9wLWJsdXItc21cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTUgdy01IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICA8R3JvdXAgY2xhc3NOYW1lPVwidGV4dC10ZXh0LXF1YXRlcm5hcnlcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS1bLTRweF0gcmlnaHQtWy00cHhdIHJvdW5kZWQtZnVsbCBib3JkZXItWzJweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYmcgYmctc3RhdGUtZGVzdHJ1Y3RpdmUtc29saWRcIj5cbiAgICAgICAgICAgICAgPFJpQ2xvc2VMaW5lIGNsYXNzTmFtZT1cImgtMyB3LTMgdGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLTMgZ3Jvd1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgZmxleCBoLTUgaXRlbXMtY2VudGVyIHRleHQtdGV4dC1kZXN0cnVjdGl2ZVwiPlxuICAgICAgICAgICAgICB7dCgnaW5zdGFsbE1vZGFsLnBsdWdpbkxvYWRFcnJvcicsIHsgbnM6ICdwbHVnaW4nIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIG10LTAuNSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAge3QoJ2luc3RhbGxNb2RhbC5wbHVnaW5Mb2FkRXJyb3JEZXNjJywgeyBuczogJ3BsdWdpbicgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxMb2FkaW5nUGxhY2Vob2xkZXIgY2xhc3NOYW1lPVwibXQtMyB3LVs0MjBweF1cIiAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oTG9hZGluZ0Vycm9yKVxuIl19