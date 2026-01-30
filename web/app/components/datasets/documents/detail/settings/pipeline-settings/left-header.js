"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const effect_1 = require("@/app/components/base/effect");
const LeftHeader = ({ title, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { back } = (0, navigation_1.useRouter)();
    const navigateBack = (0, react_2.useCallback)(() => {
        back();
    }, [back]);
    return (<div className="relative flex flex-col gap-y-0.5 pb-2 pt-4">
      <div className="system-2xs-semibold-uppercase bg-pipeline-add-documents-title-bg bg-clip-text text-transparent">
        {title}
      </div>
      <div className="system-md-semibold text-text-primary">
        {t('addDocuments.steps.processDocuments', { ns: 'datasetPipeline' })}
      </div>
      <button_1.default variant="secondary-accent" className="absolute -left-11 top-3.5 size-9 rounded-full p-0" onClick={navigateBack} aria-label={t('operation.back', { ns: 'common' })}>
        <react_1.RiArrowLeftLine className="size-5 "/>
      </button_1.default>
      <effect_1.default className="left-8 top-[-34px] opacity-20"/>
    </div>);
};
exports.default = React.memo(LeftHeader);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVmdC1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsZWZ0LWhlYWRlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBa0Q7QUFDbEQsZ0RBQTJDO0FBQzNDLCtCQUE4QjtBQUM5QixpQ0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCx5REFBaUQ7QUFNakQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUNsQixLQUFLLEdBQ1csRUFBRSxFQUFFO0lBQ3BCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBQSxzQkFBUyxHQUFFLENBQUE7SUFFNUIsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNwQyxJQUFJLEVBQUUsQ0FBQTtJQUNSLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFVixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRDQUE0QyxDQUN6RDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnR0FBZ0csQ0FDN0c7UUFBQSxDQUFDLEtBQUssQ0FDUjtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtRQUFBLENBQUMsQ0FBQyxDQUFDLHFDQUFxQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FDdEU7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsZ0JBQU0sQ0FDTCxPQUFPLENBQUMsa0JBQWtCLENBQzFCLFNBQVMsQ0FBQyxtREFBbUQsQ0FDN0QsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ3RCLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBRWxEO1FBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3RDO01BQUEsRUFBRSxnQkFBTSxDQUNSO01BQUEsQ0FBQyxnQkFBTSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsRUFDbkQ7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBcnJvd0xlZnRMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCBFZmZlY3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2VmZmVjdCdcblxudHlwZSBMZWZ0SGVhZGVyUHJvcHMgPSB7XG4gIHRpdGxlOiBzdHJpbmdcbn1cblxuY29uc3QgTGVmdEhlYWRlciA9ICh7XG4gIHRpdGxlLFxufTogTGVmdEhlYWRlclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGJhY2sgfSA9IHVzZVJvdXRlcigpXG5cbiAgY29uc3QgbmF2aWdhdGVCYWNrID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGJhY2soKVxuICB9LCBbYmFja10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggZmxleC1jb2wgZ2FwLXktMC41IHBiLTIgcHQtNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tMnhzLXNlbWlib2xkLXVwcGVyY2FzZSBiZy1waXBlbGluZS1hZGQtZG9jdW1lbnRzLXRpdGxlLWJnIGJnLWNsaXAtdGV4dCB0ZXh0LXRyYW5zcGFyZW50XCI+XG4gICAgICAgIHt0aXRsZX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAge3QoJ2FkZERvY3VtZW50cy5zdGVwcy5wcm9jZXNzRG9jdW1lbnRzJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxCdXR0b25cbiAgICAgICAgdmFyaWFudD1cInNlY29uZGFyeS1hY2NlbnRcIlxuICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtbGVmdC0xMSB0b3AtMy41IHNpemUtOSByb3VuZGVkLWZ1bGwgcC0wXCJcbiAgICAgICAgb25DbGljaz17bmF2aWdhdGVCYWNrfVxuICAgICAgICBhcmlhLWxhYmVsPXt0KCdvcGVyYXRpb24uYmFjaycsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgPlxuICAgICAgICA8UmlBcnJvd0xlZnRMaW5lIGNsYXNzTmFtZT1cInNpemUtNSBcIiAvPlxuICAgICAgPC9CdXR0b24+XG4gICAgICA8RWZmZWN0IGNsYXNzTmFtZT1cImxlZnQtOCB0b3AtWy0zNHB4XSBvcGFjaXR5LTIwXCIgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKExlZnRIZWFkZXIpXG4iXX0=