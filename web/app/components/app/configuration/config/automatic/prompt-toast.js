"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const markdown_1 = require("@/app/components/base/markdown");
const classnames_1 = require("@/utils/classnames");
const style_module_css_1 = require("./style.module.css");
const PromptToast = ({ message, className, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isFold, { toggle: toggleFold, }] = (0, ahooks_1.useBoolean)(false);
    // const message = `
    // list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1
    // # h1
    // **strong text**  ~~strikethrough~~
    // * list1list1list1list1list1list1list1list1list1list1list1list1list1list1list1
    // * list2
    // xxxx
    // ## h2
    // \`\`\`python
    // print('Hello, World!')
    // \`\`\`
    //   `
    return (<div className={(0, classnames_1.cn)('rounded-xl border-[0.5px] border-components-panel-border bg-background-section-burn pl-4 shadow-xs', className)}>
      <div className="my-3 flex h-4 items-center justify-between pr-3">
        <div className="flex items-center space-x-1">
          <react_1.RiSparklingFill className="size-3.5 text-components-input-border-active-prompt-1"/>
          <span className={(0, classnames_1.cn)(style_module_css_1.default.optimizationNoteText, 'system-xs-semibold-uppercase')}>{t('generate.optimizationNote', { ns: 'appDebug' })}</span>
        </div>
        <react_1.RiArrowDownSLine className={(0, classnames_1.cn)('size-4 cursor-pointer text-text-tertiary', isFold && 'rotate-[-90deg]')} onClick={toggleFold}/>
      </div>
      {!isFold && (<div className="pb-4 pr-4">
          <markdown_1.Markdown className="!text-sm" content={message}/>
        </div>)}
    </div>);
};
exports.default = PromptToast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbXB0LXRvYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvbXB0LXRvYXN0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFvRTtBQUNwRSxtQ0FBbUM7QUFDbkMsK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5Qyw2REFBeUQ7QUFDekQsbURBQXVDO0FBQ3ZDLHlEQUFrQztBQU1sQyxNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQ25CLE9BQU8sRUFDUCxTQUFTLEdBQ0gsRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFDYixNQUFNLEVBQUUsVUFBVSxHQUNuQixDQUFDLEdBQUcsSUFBQSxtQkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3RCLG9CQUFvQjtJQUNwQix5SkFBeUo7SUFDekosT0FBTztJQUNQLHFDQUFxQztJQUVyQyxnRkFBZ0Y7SUFDaEYsVUFBVTtJQUVWLE9BQU87SUFFUCxRQUFRO0lBQ1IsZUFBZTtJQUNmLHlCQUF5QjtJQUN6QixTQUFTO0lBQ1QsTUFBTTtJQUNOLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxvR0FBb0csRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUNsSTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpREFBaUQsQ0FDOUQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQzFDO1VBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQyx1REFBdUQsRUFDbEY7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwQkFBQyxDQUFDLG9CQUFvQixFQUFFLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUN6STtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyx3QkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwQ0FBMEMsRUFBRSxNQUFNLElBQUksaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUNoSTtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUNWLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO1VBQUEsQ0FBQyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQ2xEO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBcnJvd0Rvd25TTGluZSwgUmlTcGFya2xpbmdGaWxsIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZUJvb2xlYW4gfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IE1hcmtkb3duIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21hcmtkb3duJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgcyBmcm9tICcuL3N0eWxlLm1vZHVsZS5jc3MnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG1lc3NhZ2U6IHN0cmluZ1xuICBjbGFzc05hbWU/OiBzdHJpbmdcbn1cbmNvbnN0IFByb21wdFRvYXN0ID0gKHtcbiAgbWVzc2FnZSxcbiAgY2xhc3NOYW1lLFxufTogUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IFtpc0ZvbGQsIHtcbiAgICB0b2dnbGU6IHRvZ2dsZUZvbGQsXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgLy8gY29uc3QgbWVzc2FnZSA9IGBcbiAgLy8gbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxXG4gIC8vICMgaDFcbiAgLy8gKipzdHJvbmcgdGV4dCoqICB+fnN0cmlrZXRocm91Z2h+flxuXG4gIC8vICogbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxbGlzdDFsaXN0MWxpc3QxXG4gIC8vICogbGlzdDJcblxuICAvLyB4eHh4XG5cbiAgLy8gIyMgaDJcbiAgLy8gXFxgXFxgXFxgcHl0aG9uXG4gIC8vIHByaW50KCdIZWxsbywgV29ybGQhJylcbiAgLy8gXFxgXFxgXFxgXG4gIC8vICAgYFxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbigncm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcGwtNCBzaGFkb3cteHMnLCBjbGFzc05hbWUpfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXktMyBmbGV4IGgtNCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHByLTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTFcIj5cbiAgICAgICAgICA8UmlTcGFya2xpbmdGaWxsIGNsYXNzTmFtZT1cInNpemUtMy41IHRleHQtY29tcG9uZW50cy1pbnB1dC1ib3JkZXItYWN0aXZlLXByb21wdC0xXCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NuKHMub3B0aW1pemF0aW9uTm90ZVRleHQsICdzeXN0ZW0teHMtc2VtaWJvbGQtdXBwZXJjYXNlJyl9Pnt0KCdnZW5lcmF0ZS5vcHRpbWl6YXRpb25Ob3RlJywgeyBuczogJ2FwcERlYnVnJyB9KX08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8UmlBcnJvd0Rvd25TTGluZSBjbGFzc05hbWU9e2NuKCdzaXplLTQgY3Vyc29yLXBvaW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5JywgaXNGb2xkICYmICdyb3RhdGUtWy05MGRlZ10nKX0gb25DbGljaz17dG9nZ2xlRm9sZH0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgeyFpc0ZvbGQgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBiLTQgcHItNFwiPlxuICAgICAgICAgIDxNYXJrZG93biBjbGFzc05hbWU9XCIhdGV4dC1zbVwiIGNvbnRlbnQ9e21lc3NhZ2V9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9tcHRUb2FzdFxuIl19