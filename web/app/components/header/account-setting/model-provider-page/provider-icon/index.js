"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const llm_1 = require("@/app/components/base/icons/src/public/llm");
const other_1 = require("@/app/components/base/icons/src/vender/other");
const use_theme_1 = require("@/hooks/use-theme");
const i18n_config_1 = require("@/i18n-config");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const hooks_1 = require("../hooks");
const ProviderIcon = ({ provider, className, }) => {
    const { theme } = (0, use_theme_1.default)();
    const language = (0, hooks_1.useLanguage)();
    if (provider.provider === 'langgenius/anthropic/anthropic') {
        return (<div className="mb-2 py-[7px]">
        {theme === app_1.Theme.dark && <llm_1.AnthropicLight className="h-2.5 w-[90px]"/>}
        {theme === app_1.Theme.light && <llm_1.AnthropicDark className="h-2.5 w-[90px]"/>}
      </div>);
    }
    if (provider.provider === 'langgenius/openai/openai') {
        return (<div className="mb-2">
        <other_1.Openai className="h-6 w-auto text-text-inverted-dimmed"/>
      </div>);
    }
    return (<div className={(0, classnames_1.cn)('inline-flex items-center gap-2', className)}>
      <img alt="provider-icon" src={(0, i18n_config_1.renderI18nObject)(theme === app_1.Theme.dark && provider.icon_small_dark
            ? provider.icon_small_dark
            : provider.icon_small, language)} className="h-6 w-6"/>
      <div className="system-md-semibold text-text-primary">
        {(0, i18n_config_1.renderI18nObject)(provider.label, language)}
      </div>
    </div>);
};
exports.default = ProviderIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvRUFBMEY7QUFDMUYsd0VBQXFFO0FBQ3JFLGlEQUF3QztBQUN4QywrQ0FBZ0Q7QUFDaEQscUNBQW1DO0FBQ25DLG1EQUF1QztBQUN2QyxvQ0FBc0M7QUFNdEMsTUFBTSxZQUFZLEdBQTBCLENBQUMsRUFDM0MsUUFBUSxFQUNSLFNBQVMsR0FDVixFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSxtQkFBUSxHQUFFLENBQUE7SUFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBQSxtQkFBVyxHQUFFLENBQUE7SUFFOUIsSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLGdDQUFnQyxFQUFFLENBQUM7UUFDM0QsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQzVCO1FBQUEsQ0FBQyxLQUFLLEtBQUssV0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFjLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFHLENBQ3RFO1FBQUEsQ0FBQyxLQUFLLEtBQUssV0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLG1CQUFhLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFHLENBQ3hFO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksUUFBUSxDQUFDLFFBQVEsS0FBSywwQkFBMEIsRUFBRSxDQUFDO1FBQ3JELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuQjtRQUFBLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFDMUQ7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLGdDQUFnQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQzlEO01BQUEsQ0FBQyxHQUFHLENBQ0YsR0FBRyxDQUFDLGVBQWUsQ0FDbkIsR0FBRyxDQUFDLENBQUMsSUFBQSw4QkFBZ0IsRUFDbkIsS0FBSyxLQUFLLFdBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLGVBQWU7WUFDOUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlO1lBQzFCLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUN2QixRQUFRLENBQ1QsQ0FBQyxDQUNGLFNBQVMsQ0FBQyxTQUFTLEVBRXJCO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtRQUFBLENBQUMsSUFBQSw4QkFBZ0IsRUFBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUM3QztNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBNb2RlbFByb3ZpZGVyIH0gZnJvbSAnLi4vZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgQW50aHJvcGljRGFyaywgQW50aHJvcGljTGlnaHQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3B1YmxpYy9sbG0nXG5pbXBvcnQgeyBPcGVuYWkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9vdGhlcidcbmltcG9ydCB1c2VUaGVtZSBmcm9tICdAL2hvb2tzL3VzZS10aGVtZSdcbmltcG9ydCB7IHJlbmRlckkxOG5PYmplY3QgfSBmcm9tICdAL2kxOG4tY29uZmlnJ1xuaW1wb3J0IHsgVGhlbWUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgdXNlTGFuZ3VhZ2UgfSBmcm9tICcuLi9ob29rcydcblxudHlwZSBQcm92aWRlckljb25Qcm9wcyA9IHtcbiAgcHJvdmlkZXI6IE1vZGVsUHJvdmlkZXJcbiAgY2xhc3NOYW1lPzogc3RyaW5nXG59XG5jb25zdCBQcm92aWRlckljb246IEZDPFByb3ZpZGVySWNvblByb3BzPiA9ICh7XG4gIHByb3ZpZGVyLFxuICBjbGFzc05hbWUsXG59KSA9PiB7XG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3QgbGFuZ3VhZ2UgPSB1c2VMYW5ndWFnZSgpXG5cbiAgaWYgKHByb3ZpZGVyLnByb3ZpZGVyID09PSAnbGFuZ2dlbml1cy9hbnRocm9waWMvYW50aHJvcGljJykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgcHktWzdweF1cIj5cbiAgICAgICAge3RoZW1lID09PSBUaGVtZS5kYXJrICYmIDxBbnRocm9waWNMaWdodCBjbGFzc05hbWU9XCJoLTIuNSB3LVs5MHB4XVwiIC8+fVxuICAgICAgICB7dGhlbWUgPT09IFRoZW1lLmxpZ2h0ICYmIDxBbnRocm9waWNEYXJrIGNsYXNzTmFtZT1cImgtMi41IHctWzkwcHhdXCIgLz59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBpZiAocHJvdmlkZXIucHJvdmlkZXIgPT09ICdsYW5nZ2VuaXVzL29wZW5haS9vcGVuYWknKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMlwiPlxuICAgICAgICA8T3BlbmFpIGNsYXNzTmFtZT1cImgtNiB3LWF1dG8gdGV4dC10ZXh0LWludmVydGVkLWRpbW1lZFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbignaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0yJywgY2xhc3NOYW1lKX0+XG4gICAgICA8aW1nXG4gICAgICAgIGFsdD1cInByb3ZpZGVyLWljb25cIlxuICAgICAgICBzcmM9e3JlbmRlckkxOG5PYmplY3QoXG4gICAgICAgICAgdGhlbWUgPT09IFRoZW1lLmRhcmsgJiYgcHJvdmlkZXIuaWNvbl9zbWFsbF9kYXJrXG4gICAgICAgICAgICA/IHByb3ZpZGVyLmljb25fc21hbGxfZGFya1xuICAgICAgICAgICAgOiBwcm92aWRlci5pY29uX3NtYWxsLFxuICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICApfVxuICAgICAgICBjbGFzc05hbWU9XCJoLTYgdy02XCJcbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICB7cmVuZGVySTE4bk9iamVjdChwcm92aWRlci5sYWJlbCwgbGFuZ3VhZ2UpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXJJY29uXG4iXX0=