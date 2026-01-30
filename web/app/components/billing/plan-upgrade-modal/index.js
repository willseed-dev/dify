"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const modal_1 = require("@/app/components/base/modal");
const upgrade_btn_1 = require("@/app/components/billing/upgrade-btn");
const modal_context_1 = require("@/context/modal-context");
const other_1 = require("../../base/icons/src/vender/other");
const style_module_css_1 = require("./style.module.css");
const PlanUpgradeModal = ({ Icon = other_1.SquareChecklist, title, description, extraInfo, show, onClose, onUpgrade, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { setShowPricingModal } = (0, modal_context_1.useModalContext)();
    const handleUpgrade = (0, react_1.useCallback)(() => {
        onClose();
        if (onUpgrade)
            onUpgrade();
        else
            setShowPricingModal();
    }, [onClose, onUpgrade, setShowPricingModal]);
    return (<modal_1.default isShow={show} onClose={onClose} closable={false} clickOutsideNotClose className={`${style_module_css_1.default.surface} w-[580px] rounded-2xl !p-0`}>
      <div className="relative">
        <div aria-hidden className={`${style_module_css_1.default.heroOverlay} pointer-events-none absolute inset-0`}/>
        <div className="px-8 pt-8">
          <div className={`${style_module_css_1.default.icon} flex size-12 items-center justify-center rounded-xl shadow-lg backdrop-blur-[5px]`}>
            <Icon className="size-6 text-text-primary-on-surface"/>
          </div>
          <div className="mt-6 space-y-2">
            <div className={`${style_module_css_1.default.highlight} title-3xl-semi-bold`}>
              {title}
            </div>
            <div className="system-md-regular text-text-tertiary">
              {description}
            </div>
          </div>
          {extraInfo}
        </div>
      </div>

      <div className="mb-8 mt-10 flex justify-end space-x-2 px-8">
        <button_1.default onClick={onClose}>
          {t('triggerLimitModal.dismiss', { ns: 'billing' })}
        </button_1.default>
        <upgrade_btn_1.default size="custom" isShort onClick={handleUpgrade} className="!h-8 !rounded-lg px-2" labelKey="triggerLimitModal.upgrade" loc="trigger-events-limit-modal"/>
      </div>
    </modal_1.default>);
};
exports.default = React.memo(PlanUpgradeModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsdURBQStDO0FBQy9DLHNFQUE2RDtBQUM3RCwyREFBeUQ7QUFDekQsNkRBQW1FO0FBQ25FLHlEQUF1QztBQVl2QyxNQUFNLGdCQUFnQixHQUFjLENBQUMsRUFDbkMsSUFBSSxHQUFHLHVCQUFlLEVBQ3RCLEtBQUssRUFDTCxXQUFXLEVBQ1gsU0FBUyxFQUNULElBQUksRUFDSixPQUFPLEVBQ1AsU0FBUyxHQUNWLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxJQUFBLCtCQUFlLEdBQUUsQ0FBQTtJQUVqRCxNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3JDLE9BQU8sRUFBRSxDQUFBO1FBQ1QsSUFBSSxTQUFTO1lBQ1gsU0FBUyxFQUFFLENBQUE7O1lBRVgsbUJBQW1CLEVBQUUsQ0FBQTtJQUN6QixDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtJQUU3QyxPQUFPLENBQ0wsQ0FBQyxlQUFLLENBQ0osTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ2IsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNoQixvQkFBb0IsQ0FDcEIsU0FBUyxDQUFDLENBQUMsR0FBRywwQkFBTSxDQUFDLE9BQU8sNkJBQTZCLENBQUMsQ0FFMUQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUN2QjtRQUFBLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FDWCxTQUFTLENBQUMsQ0FBQyxHQUFHLDBCQUFNLENBQUMsV0FBVyx1Q0FBdUMsQ0FBQyxFQUUxRTtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRywwQkFBTSxDQUFDLElBQUksb0ZBQW9GLENBQUMsQ0FDakg7WUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUNBQXFDLEVBQ3ZEO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQzdCO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRywwQkFBTSxDQUFDLFNBQVMsc0JBQXNCLENBQUMsQ0FDeEQ7Y0FBQSxDQUFDLEtBQUssQ0FDUjtZQUFBLEVBQUUsR0FBRyxDQUNMO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtjQUFBLENBQUMsV0FBVyxDQUNkO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDTDtVQUFBLENBQUMsU0FBUyxDQUNaO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNENBQTRDLENBQ3pEO1FBQUEsQ0FBQyxnQkFBTSxDQUNMLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUVqQjtVQUFBLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQ3BEO1FBQUEsRUFBRSxnQkFBTSxDQUNSO1FBQUEsQ0FBQyxxQkFBVSxDQUNULElBQUksQ0FBQyxRQUFRLENBQ2IsT0FBTyxDQUNQLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUN2QixTQUFTLENBQUMsdUJBQXVCLENBQ2pDLFFBQVEsQ0FBQywyQkFBMkIsQ0FDcEMsR0FBRyxDQUFDLDRCQUE0QixFQUVwQztNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxlQUFLLENBQUMsQ0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21vZGFsJ1xuaW1wb3J0IFVwZ3JhZGVCdG4gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3VwZ3JhZGUtYnRuJ1xuaW1wb3J0IHsgdXNlTW9kYWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyBTcXVhcmVDaGVja2xpc3QgfSBmcm9tICcuLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvb3RoZXInXG5pbXBvcnQgc3R5bGVzIGZyb20gJy4vc3R5bGUubW9kdWxlLmNzcydcblxudHlwZSBQcm9wcyA9IHtcbiAgSWNvbj86IFJlYWN0LkNvbXBvbmVudFR5cGU8UmVhY3QuU1ZHUHJvcHM8U1ZHU1ZHRWxlbWVudD4+XG4gIHRpdGxlOiBzdHJpbmdcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xuICBleHRyYUluZm8/OiBSZWFjdC5SZWFjdE5vZGVcbiAgc2hvdzogYm9vbGVhblxuICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gIG9uVXBncmFkZT86ICgpID0+IHZvaWRcbn1cblxuY29uc3QgUGxhblVwZ3JhZGVNb2RhbDogRkM8UHJvcHM+ID0gKHtcbiAgSWNvbiA9IFNxdWFyZUNoZWNrbGlzdCxcbiAgdGl0bGUsXG4gIGRlc2NyaXB0aW9uLFxuICBleHRyYUluZm8sXG4gIHNob3csXG4gIG9uQ2xvc2UsXG4gIG9uVXBncmFkZSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgc2V0U2hvd1ByaWNpbmdNb2RhbCB9ID0gdXNlTW9kYWxDb250ZXh0KClcblxuICBjb25zdCBoYW5kbGVVcGdyYWRlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIG9uQ2xvc2UoKVxuICAgIGlmIChvblVwZ3JhZGUpXG4gICAgICBvblVwZ3JhZGUoKVxuICAgIGVsc2VcbiAgICAgIHNldFNob3dQcmljaW5nTW9kYWwoKVxuICB9LCBbb25DbG9zZSwgb25VcGdyYWRlLCBzZXRTaG93UHJpY2luZ01vZGFsXSlcblxuICByZXR1cm4gKFxuICAgIDxNb2RhbFxuICAgICAgaXNTaG93PXtzaG93fVxuICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgIGNsb3NhYmxlPXtmYWxzZX1cbiAgICAgIGNsaWNrT3V0c2lkZU5vdENsb3NlXG4gICAgICBjbGFzc05hbWU9e2Ake3N0eWxlcy5zdXJmYWNlfSB3LVs1ODBweF0gcm91bmRlZC0yeGwgIXAtMGB9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgYXJpYS1oaWRkZW5cbiAgICAgICAgICBjbGFzc05hbWU9e2Ake3N0eWxlcy5oZXJvT3ZlcmxheX0gcG9pbnRlci1ldmVudHMtbm9uZSBhYnNvbHV0ZSBpbnNldC0wYH1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC04IHB0LThcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7c3R5bGVzLmljb259IGZsZXggc2l6ZS0xMiBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC14bCBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1bNXB4XWB9PlxuICAgICAgICAgICAgPEljb24gY2xhc3NOYW1lPVwic2l6ZS02IHRleHQtdGV4dC1wcmltYXJ5LW9uLXN1cmZhY2VcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBzcGFjZS15LTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgJHtzdHlsZXMuaGlnaGxpZ2h0fSB0aXRsZS0zeGwtc2VtaS1ib2xkYH0+XG4gICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2V4dHJhSW5mb31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi04IG10LTEwIGZsZXgganVzdGlmeS1lbmQgc3BhY2UteC0yIHB4LThcIj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgID5cbiAgICAgICAgICB7dCgndHJpZ2dlckxpbWl0TW9kYWwuZGlzbWlzcycsIHsgbnM6ICdiaWxsaW5nJyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxVcGdyYWRlQnRuXG4gICAgICAgICAgc2l6ZT1cImN1c3RvbVwiXG4gICAgICAgICAgaXNTaG9ydFxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVVwZ3JhZGV9XG4gICAgICAgICAgY2xhc3NOYW1lPVwiIWgtOCAhcm91bmRlZC1sZyBweC0yXCJcbiAgICAgICAgICBsYWJlbEtleT1cInRyaWdnZXJMaW1pdE1vZGFsLnVwZ3JhZGVcIlxuICAgICAgICAgIGxvYz1cInRyaWdnZXItZXZlbnRzLWxpbWl0LW1vZGFsXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvTW9kYWw+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhQbGFuVXBncmFkZU1vZGFsKVxuIl19