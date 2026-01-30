"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const modal_1 = require("@/app/components/base/modal");
const visual_editor_1 = require("@/app/components/workflow/nodes/llm/components/json-schema-config-modal/visual-editor");
const context_1 = require("@/app/components/workflow/nodes/llm/components/json-schema-config-modal/visual-editor/context");
const SchemaModal = ({ isShow, schema, rootName, onClose, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<modal_1.default isShow={isShow} onClose={onClose} className="max-w-[960px] p-0" wrapperClassName="z-[9999]">
      <div className="pb-6">
        {/* Header */}
        <div className="relative flex p-6 pb-3 pr-14">
          <div className="title-2xl-semi-bold grow truncate text-text-primary">
            {t('nodes.agent.parameterSchema', { ns: 'workflow' })}
          </div>
          <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center p-1.5" onClick={onClose}>
            <react_1.RiCloseLine className="h-[18px] w-[18px] text-text-tertiary"/>
          </div>
        </div>
        {/* Content */}
        <div className="flex max-h-[700px] overflow-y-auto px-6 py-2">
          <context_1.MittProvider>
            <context_1.VisualEditorContextProvider>
              <visual_editor_1.default className="w-full" schema={schema} rootName={rootName} readOnly>
              </visual_editor_1.default>
            </context_1.VisualEditorContextProvider>
          </context_1.MittProvider>
        </div>
      </div>
    </modal_1.default>);
};
exports.default = React.memo(SchemaModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLW1vZGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NoZW1hLW1vZGFsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUdaLDRDQUE4QztBQUM5QywrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHVEQUErQztBQUMvQyx5SEFBZ0g7QUFDaEgsMkhBQXlKO0FBU3pKLE1BQU0sV0FBVyxHQUFjLENBQUMsRUFDOUIsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxHQUNSLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixPQUFPLENBQ0wsQ0FBQyxlQUFLLENBQ0osTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2YsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ2pCLFNBQVMsQ0FBQyxtQkFBbUIsQ0FDN0IsZ0JBQWdCLENBQUMsVUFBVSxDQUUzQjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ25CO1FBQUEsQ0FBQyxZQUFZLENBQ2I7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQzNDO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFEQUFxRCxDQUNsRTtZQUFBLENBQUMsQ0FBQyxDQUFDLDZCQUE2QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQ3ZEO1VBQUEsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUVBQXVFLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQ3RHO1lBQUEsQ0FBQyxtQkFBVyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFDL0Q7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxhQUFhLENBQ2Q7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOENBQThDLENBQzNEO1VBQUEsQ0FBQyxzQkFBWSxDQUNYO1lBQUEsQ0FBQyxxQ0FBMkIsQ0FDMUI7Y0FBQSxDQUFDLHVCQUFZLENBQ1gsU0FBUyxDQUFDLFFBQVEsQ0FDbEIsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQ2YsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ25CLFFBQVEsQ0FFVjtjQUFBLEVBQUUsdUJBQVksQ0FDaEI7WUFBQSxFQUFFLHFDQUEyQixDQUMvQjtVQUFBLEVBQUUsc0JBQVksQ0FDaEI7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxlQUFLLENBQUMsQ0FDVCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBTY2hlbWFSb290IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sbG0vdHlwZXMnXG5pbXBvcnQgeyBSaUNsb3NlTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBNb2RhbCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwnXG5pbXBvcnQgVmlzdWFsRWRpdG9yIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvbGxtL2NvbXBvbmVudHMvanNvbi1zY2hlbWEtY29uZmlnLW1vZGFsL3Zpc3VhbC1lZGl0b3InXG5pbXBvcnQgeyBNaXR0UHJvdmlkZXIsIFZpc3VhbEVkaXRvckNvbnRleHRQcm92aWRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvbGxtL2NvbXBvbmVudHMvanNvbi1zY2hlbWEtY29uZmlnLW1vZGFsL3Zpc3VhbC1lZGl0b3IvY29udGV4dCdcblxudHlwZSBQcm9wcyA9IHtcbiAgaXNTaG93OiBib29sZWFuXG4gIHNjaGVtYTogU2NoZW1hUm9vdFxuICByb290TmFtZTogc3RyaW5nXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgU2NoZW1hTW9kYWw6IEZDPFByb3BzPiA9ICh7XG4gIGlzU2hvdyxcbiAgc2NoZW1hLFxuICByb290TmFtZSxcbiAgb25DbG9zZSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIHJldHVybiAoXG4gICAgPE1vZGFsXG4gICAgICBpc1Nob3c9e2lzU2hvd31cbiAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICBjbGFzc05hbWU9XCJtYXgtdy1bOTYwcHhdIHAtMFwiXG4gICAgICB3cmFwcGVyQ2xhc3NOYW1lPVwiei1bOTk5OV1cIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGItNlwiPlxuICAgICAgICB7LyogSGVhZGVyICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggcC02IHBiLTMgcHItMTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlLTJ4bC1zZW1pLWJvbGQgZ3JvdyB0cnVuY2F0ZSB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAge3QoJ25vZGVzLmFnZW50LnBhcmFtZXRlclNjaGVtYScsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSByaWdodC01IHRvcC01IGZsZXggaC04IHctOCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC0xLjVcIiBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgICAgIDxSaUNsb3NlTGluZSBjbGFzc05hbWU9XCJoLVsxOHB4XSB3LVsxOHB4XSB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIENvbnRlbnQgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBtYXgtaC1bNzAwcHhdIG92ZXJmbG93LXktYXV0byBweC02IHB5LTJcIj5cbiAgICAgICAgICA8TWl0dFByb3ZpZGVyPlxuICAgICAgICAgICAgPFZpc3VhbEVkaXRvckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICAgICAgPFZpc3VhbEVkaXRvclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbFwiXG4gICAgICAgICAgICAgICAgc2NoZW1hPXtzY2hlbWF9XG4gICAgICAgICAgICAgICAgcm9vdE5hbWU9e3Jvb3ROYW1lfVxuICAgICAgICAgICAgICAgIHJlYWRPbmx5XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPC9WaXN1YWxFZGl0b3I+XG4gICAgICAgICAgICA8L1Zpc3VhbEVkaXRvckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICA8L01pdHRQcm92aWRlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L01vZGFsPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKFNjaGVtYU1vZGFsKVxuIl19