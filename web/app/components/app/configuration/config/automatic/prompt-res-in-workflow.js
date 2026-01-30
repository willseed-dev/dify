"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const use_available_var_list_1 = require("@/app/components/workflow/nodes/_base/hooks/use-available-var-list");
const types_1 = require("@/app/components/workflow/nodes/llm/types");
const types_2 = require("@/app/components/workflow/types");
const prompt_res_1 = require("./prompt-res");
const PromptResInWorkflow = ({ value, nodeId, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { availableVars, availableNodes, } = (0, use_available_var_list_1.default)(nodeId, {
        onlyLeafNodeVar: false,
        filterVar: _payload => true,
    });
    return (<prompt_res_1.default value={value} workflowVariableBlock={{
            show: true,
            variables: availableVars || [],
            getVarType: () => types_1.Type.string,
            workflowNodesMap: availableNodes.reduce((acc, node) => {
                acc[node.id] = {
                    title: node.data.title,
                    type: node.data.type,
                    width: node.width,
                    height: node.height,
                    position: node.position,
                };
                if (node.data.type === types_2.BlockEnum.Start) {
                    acc.sys = {
                        title: t('blocks.start', { ns: 'workflow' }),
                        type: types_2.BlockEnum.Start,
                    };
                }
                return acc;
            }, {}),
        }}>
    </prompt_res_1.default>);
};
exports.default = React.memo(PromptResInWorkflow);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbXB0LXJlcy1pbi13b3JrZmxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb21wdC1yZXMtaW4td29ya2Zsb3cudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5QywrR0FBb0c7QUFDcEcscUVBQWdFO0FBQ2hFLDJEQUEyRDtBQUMzRCw2Q0FBb0M7QUFPcEMsTUFBTSxtQkFBbUIsR0FBYyxDQUFDLEVBQ3RDLEtBQUssRUFDTCxNQUFNLEdBQ1AsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFDSixhQUFhLEVBQ2IsY0FBYyxHQUNmLEdBQUcsSUFBQSxnQ0FBbUIsRUFBQyxNQUFNLEVBQUU7UUFDOUIsZUFBZSxFQUFFLEtBQUs7UUFDdEIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSTtLQUM1QixDQUFDLENBQUE7SUFDRixPQUFPLENBQ0wsQ0FBQyxvQkFBUyxDQUNSLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLHFCQUFxQixDQUFDLENBQUM7WUFDckIsSUFBSSxFQUFFLElBQUk7WUFDVixTQUFTLEVBQUUsYUFBYSxJQUFJLEVBQUU7WUFDOUIsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLFlBQUksQ0FBQyxNQUFNO1lBQzdCLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUc7b0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztvQkFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDeEIsQ0FBQTtnQkFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3ZDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7d0JBQ1IsS0FBSyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7d0JBQzVDLElBQUksRUFBRSxpQkFBUyxDQUFDLEtBQUs7cUJBQ3RCLENBQUE7Z0JBQ0gsQ0FBQztnQkFDRCxPQUFPLEdBQUcsQ0FBQTtZQUNaLENBQUMsRUFBRSxFQUFTLENBQUM7U0FDZCxDQUFDLENBRUo7SUFBQSxFQUFFLG9CQUFTLENBQUMsQ0FDYixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB1c2VBdmFpbGFibGVWYXJMaXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvaG9va3MvdXNlLWF2YWlsYWJsZS12YXItbGlzdCdcbmltcG9ydCB7IFR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2xsbS90eXBlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgUHJvbXB0UmVzIGZyb20gJy4vcHJvbXB0LXJlcydcblxudHlwZSBQcm9wcyA9IHtcbiAgdmFsdWU6IHN0cmluZ1xuICBub2RlSWQ6IHN0cmluZ1xufVxuXG5jb25zdCBQcm9tcHRSZXNJbldvcmtmbG93OiBGQzxQcm9wcz4gPSAoe1xuICB2YWx1ZSxcbiAgbm9kZUlkLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3Qge1xuICAgIGF2YWlsYWJsZVZhcnMsXG4gICAgYXZhaWxhYmxlTm9kZXMsXG4gIH0gPSB1c2VBdmFpbGFibGVWYXJMaXN0KG5vZGVJZCwge1xuICAgIG9ubHlMZWFmTm9kZVZhcjogZmFsc2UsXG4gICAgZmlsdGVyVmFyOiBfcGF5bG9hZCA9PiB0cnVlLFxuICB9KVxuICByZXR1cm4gKFxuICAgIDxQcm9tcHRSZXNcbiAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgIHdvcmtmbG93VmFyaWFibGVCbG9jaz17e1xuICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICB2YXJpYWJsZXM6IGF2YWlsYWJsZVZhcnMgfHwgW10sXG4gICAgICAgIGdldFZhclR5cGU6ICgpID0+IFR5cGUuc3RyaW5nLFxuICAgICAgICB3b3JrZmxvd05vZGVzTWFwOiBhdmFpbGFibGVOb2Rlcy5yZWR1Y2UoKGFjYywgbm9kZSkgPT4ge1xuICAgICAgICAgIGFjY1tub2RlLmlkXSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBub2RlLmRhdGEudGl0bGUsXG4gICAgICAgICAgICB0eXBlOiBub2RlLmRhdGEudHlwZSxcbiAgICAgICAgICAgIHdpZHRoOiBub2RlLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBub2RlLmhlaWdodCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBub2RlLnBvc2l0aW9uLFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5TdGFydCkge1xuICAgICAgICAgICAgYWNjLnN5cyA9IHtcbiAgICAgICAgICAgICAgdGl0bGU6IHQoJ2Jsb2Nrcy5zdGFydCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgICAgIHR5cGU6IEJsb2NrRW51bS5TdGFydCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICB9LCB7fSBhcyBhbnkpLFxuICAgICAgfX1cbiAgICA+XG4gICAgPC9Qcm9tcHRSZXM+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oUHJvbXB0UmVzSW5Xb3JrZmxvdylcbiJdfQ==