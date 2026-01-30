"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const others_1 = require("@/app/components/base/icons/src/vender/line/others");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const hooks_1 = require("@/app/components/workflow/hooks");
const types_1 = require("@/app/components/workflow/types");
const Connect = ({ nodeData, onSetting, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const toolIcon = (0, hooks_1.useToolIcon)(nodeData);
    return (<div className="flex flex-col items-start gap-y-2 rounded-xl bg-workflow-process-bg p-6">
      <div className="flex size-12 items-center justify-center rounded-[10px] border-[0.5px] border-components-card-border bg-components-card-bg p-1 shadow-lg shadow-shadow-shadow-5">
        <block_icon_1.default type={types_1.BlockEnum.DataSource} toolIcon={toolIcon} size="md"/>
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-col gap-y-1 pb-3 pt-1">
          <div className="system-md-semibold text-text-secondary">
            <span className="relative">
              {t('onlineDrive.notConnected', { ns: 'datasetPipeline', name: nodeData.title })}
              <others_1.Icon3Dots className="absolute -right-2.5 -top-1.5 size-4 text-text-secondary"/>
            </span>
          </div>
          <div className="system-sm-regular text-text-tertiary">
            {t('onlineDrive.notConnectedTip', { ns: 'datasetPipeline', name: nodeData.title })}
          </div>
        </div>
        <button_1.default className="w-fit" variant="primary" onClick={onSetting}>
          {t('stepOne.connect', { ns: 'datasetCreation' })}
        </button_1.default>
      </div>
    </div>);
};
exports.default = Connect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELCtFQUE4RTtBQUM5RSxxRUFBNEQ7QUFDNUQsMkRBQTZEO0FBQzdELDJEQUEyRDtBQU8zRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEVBQ2YsUUFBUSxFQUNSLFNBQVMsR0FDSSxFQUFFLEVBQUU7SUFDakIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQVcsRUFBQyxRQUFRLENBQUMsQ0FBQTtJQUV0QyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlFQUF5RSxDQUN0RjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpS0FBaUssQ0FDOUs7UUFBQSxDQUFDLG9CQUFTLENBQ1IsSUFBSSxDQUFDLENBQUMsaUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FDM0IsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ25CLElBQUksQ0FBQyxJQUFJLEVBRWI7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDcEM7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQzlDO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdDQUF3QyxDQUNyRDtZQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQ3hCO2NBQUEsQ0FBQyxDQUFDLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUMvRTtjQUFBLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUMseURBQXlELEVBQ2hGO1lBQUEsRUFBRSxJQUFJLENBQ1I7VUFBQSxFQUFFLEdBQUcsQ0FDTDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDbkQ7WUFBQSxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQ3BGO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsZ0JBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQzdEO1VBQUEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUNsRDtRQUFBLEVBQUUsZ0JBQU0sQ0FDVjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHsgSWNvbjNEb3RzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvbGluZS9vdGhlcnMnXG5pbXBvcnQgQmxvY2tJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2staWNvbidcbmltcG9ydCB7IHVzZVRvb2xJY29uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5cbnR5cGUgQ29ubmVjdFByb3BzID0ge1xuICBub2RlRGF0YTogRGF0YVNvdXJjZU5vZGVUeXBlXG4gIG9uU2V0dGluZzogKCkgPT4gdm9pZFxufVxuXG5jb25zdCBDb25uZWN0ID0gKHtcbiAgbm9kZURhdGEsXG4gIG9uU2V0dGluZyxcbn06IENvbm5lY3RQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgdG9vbEljb24gPSB1c2VUb29sSWNvbihub2RlRGF0YSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAteS0yIHJvdW5kZWQteGwgYmctd29ya2Zsb3ctcHJvY2Vzcy1iZyBwLTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaXplLTEyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLVsxMHB4XSBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1jYXJkLWJvcmRlciBiZy1jb21wb25lbnRzLWNhcmQtYmcgcC0xIHNoYWRvdy1sZyBzaGFkb3ctc2hhZG93LXNoYWRvdy01XCI+XG4gICAgICAgIDxCbG9ja0ljb25cbiAgICAgICAgICB0eXBlPXtCbG9ja0VudW0uRGF0YVNvdXJjZX1cbiAgICAgICAgICB0b29sSWNvbj17dG9vbEljb259XG4gICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC15LTFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC15LTEgcGItMyBwdC0xXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAge3QoJ29ubGluZURyaXZlLm5vdENvbm5lY3RlZCcsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnLCBuYW1lOiBub2RlRGF0YS50aXRsZSB9KX1cbiAgICAgICAgICAgICAgPEljb24zRG90cyBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtcmlnaHQtMi41IC10b3AtMS41IHNpemUtNCB0ZXh0LXRleHQtc2Vjb25kYXJ5XCIgLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAge3QoJ29ubGluZURyaXZlLm5vdENvbm5lY3RlZFRpcCcsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnLCBuYW1lOiBub2RlRGF0YS50aXRsZSB9KX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwidy1maXRcIiB2YXJpYW50PVwicHJpbWFyeVwiIG9uQ2xpY2s9e29uU2V0dGluZ30+XG4gICAgICAgICAge3QoJ3N0ZXBPbmUuY29ubmVjdCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbm5lY3RcbiJdfQ==