"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowTemplate = void 0;
const react_i18next_1 = require("react-i18next");
const constants_1 = require("@/app/components/workflow/constants");
const default_1 = require("@/app/components/workflow/nodes/answer/default");
const default_2 = require("@/app/components/workflow/nodes/llm/default");
const default_3 = require("@/app/components/workflow/nodes/start/default");
const utils_1 = require("@/app/components/workflow/utils");
const use_is_chat_mode_1 = require("./use-is-chat-mode");
const useWorkflowTemplate = () => {
    const isChatMode = (0, use_is_chat_mode_1.useIsChatMode)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { newNode: startNode } = (0, utils_1.generateNewNode)({
        data: {
            ...default_3.default.defaultValue,
            type: default_3.default.metaData.type,
            title: t(`blocks.${default_3.default.metaData.type}`, { ns: 'workflow' }),
        },
        position: constants_1.START_INITIAL_POSITION,
    });
    if (isChatMode) {
        const { newNode: llmNode } = (0, utils_1.generateNewNode)({
            id: 'llm',
            data: {
                ...default_2.default.defaultValue,
                memory: {
                    window: { enabled: false, size: 10 },
                    query_prompt_template: '{{#sys.query#}}\n\n{{#sys.files#}}',
                },
                selected: true,
                type: default_2.default.metaData.type,
                title: t(`blocks.${default_2.default.metaData.type}`, { ns: 'workflow' }),
            },
            position: {
                x: constants_1.START_INITIAL_POSITION.x + constants_1.NODE_WIDTH_X_OFFSET,
                y: constants_1.START_INITIAL_POSITION.y,
            },
        });
        const { newNode: answerNode } = (0, utils_1.generateNewNode)({
            id: 'answer',
            data: {
                ...default_1.default.defaultValue,
                answer: `{{#${llmNode.id}.text#}}`,
                type: default_1.default.metaData.type,
                title: t(`blocks.${default_1.default.metaData.type}`, { ns: 'workflow' }),
            },
            position: {
                x: constants_1.START_INITIAL_POSITION.x + constants_1.NODE_WIDTH_X_OFFSET * 2,
                y: constants_1.START_INITIAL_POSITION.y,
            },
        });
        const startToLlmEdge = {
            id: `${startNode.id}-${llmNode.id}`,
            source: startNode.id,
            sourceHandle: 'source',
            target: llmNode.id,
            targetHandle: 'target',
        };
        const llmToAnswerEdge = {
            id: `${llmNode.id}-${answerNode.id}`,
            source: llmNode.id,
            sourceHandle: 'source',
            target: answerNode.id,
            targetHandle: 'target',
        };
        return {
            nodes: [startNode, llmNode, answerNode],
            edges: [startToLlmEdge, llmToAnswerEdge],
        };
    }
    else {
        return {
            nodes: [startNode],
            edges: [],
        };
    }
};
exports.useWorkflowTemplate = useWorkflowTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXdvcmtmbG93LXRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUE4QztBQUM5QyxtRUFHNEM7QUFDNUMsNEVBQTBFO0FBQzFFLHlFQUFvRTtBQUNwRSwyRUFBd0U7QUFDeEUsMkRBQWlFO0FBQ2pFLHlEQUFrRDtBQUUzQyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUN0QyxNQUFNLFVBQVUsR0FBRyxJQUFBLGdDQUFhLEdBQUUsQ0FBQTtJQUNsQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEVBQUM7UUFDN0MsSUFBSSxFQUFFO1lBQ0osR0FBRyxpQkFBWSxDQUFDLFlBQTZCO1lBQzdDLElBQUksRUFBRSxpQkFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1lBQ2hDLEtBQUssRUFBRSxDQUFDLENBQUMsVUFBVSxpQkFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUNyRTtRQUNELFFBQVEsRUFBRSxrQ0FBc0I7S0FDakMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUNmLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBQSx1QkFBZSxFQUFDO1lBQzNDLEVBQUUsRUFBRSxLQUFLO1lBQ1QsSUFBSSxFQUFFO2dCQUNKLEdBQUcsaUJBQVUsQ0FBQyxZQUFZO2dCQUMxQixNQUFNLEVBQUU7b0JBQ04sTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO29CQUNwQyxxQkFBcUIsRUFBRSxvQ0FBb0M7aUJBQzVEO2dCQUNELFFBQVEsRUFBRSxJQUFJO2dCQUNkLElBQUksRUFBRSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2dCQUM5QixLQUFLLEVBQUUsQ0FBQyxDQUFDLFVBQVUsaUJBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7YUFDbkU7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLGtDQUFzQixDQUFDLENBQUMsR0FBRywrQkFBbUI7Z0JBQ2pELENBQUMsRUFBRSxrQ0FBc0IsQ0FBQyxDQUFDO2FBQzVCO1NBQ0ssQ0FBQyxDQUFBO1FBRVQsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEVBQUM7WUFDOUMsRUFBRSxFQUFFLFFBQVE7WUFDWixJQUFJLEVBQUU7Z0JBQ0osR0FBRyxpQkFBYSxDQUFDLFlBQVk7Z0JBQzdCLE1BQU0sRUFBRSxNQUFNLE9BQU8sQ0FBQyxFQUFFLFVBQVU7Z0JBQ2xDLElBQUksRUFBRSxpQkFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJO2dCQUNqQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLFVBQVUsaUJBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7YUFDdEU7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLGtDQUFzQixDQUFDLENBQUMsR0FBRywrQkFBbUIsR0FBRyxDQUFDO2dCQUNyRCxDQUFDLEVBQUUsa0NBQXNCLENBQUMsQ0FBQzthQUM1QjtTQUNLLENBQUMsQ0FBQTtRQUVULE1BQU0sY0FBYyxHQUFHO1lBQ3JCLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRTtZQUNuQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUU7WUFDcEIsWUFBWSxFQUFFLFFBQVE7WUFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ2xCLFlBQVksRUFBRSxRQUFRO1NBQ3ZCLENBQUE7UUFFRCxNQUFNLGVBQWUsR0FBRztZQUN0QixFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ2xCLFlBQVksRUFBRSxRQUFRO1lBQ3RCLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFBRTtZQUNyQixZQUFZLEVBQUUsUUFBUTtTQUN2QixDQUFBO1FBRUQsT0FBTztZQUNMLEtBQUssRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUM7U0FDekMsQ0FBQTtJQUNILENBQUM7U0FDSSxDQUFDO1FBQ0osT0FBTztZQUNMLEtBQUssRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNWLENBQUE7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBekVZLFFBQUEsbUJBQW1CLHVCQXlFL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFN0YXJ0Tm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3N0YXJ0L3R5cGVzJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHtcbiAgTk9ERV9XSURUSF9YX09GRlNFVCxcbiAgU1RBUlRfSU5JVElBTF9QT1NJVElPTixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9jb25zdGFudHMnXG5pbXBvcnQgYW5zd2VyRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2Fuc3dlci9kZWZhdWx0J1xuaW1wb3J0IGxsbURlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sbG0vZGVmYXVsdCdcbmltcG9ydCBzdGFydERlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9zdGFydC9kZWZhdWx0J1xuaW1wb3J0IHsgZ2VuZXJhdGVOZXdOb2RlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscydcbmltcG9ydCB7IHVzZUlzQ2hhdE1vZGUgfSBmcm9tICcuL3VzZS1pcy1jaGF0LW1vZGUnXG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd1RlbXBsYXRlID0gKCkgPT4ge1xuICBjb25zdCBpc0NoYXRNb2RlID0gdXNlSXNDaGF0TW9kZSgpXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IHsgbmV3Tm9kZTogc3RhcnROb2RlIH0gPSBnZW5lcmF0ZU5ld05vZGUoe1xuICAgIGRhdGE6IHtcbiAgICAgIC4uLnN0YXJ0RGVmYXVsdC5kZWZhdWx0VmFsdWUgYXMgU3RhcnROb2RlVHlwZSxcbiAgICAgIHR5cGU6IHN0YXJ0RGVmYXVsdC5tZXRhRGF0YS50eXBlLFxuICAgICAgdGl0bGU6IHQoYGJsb2Nrcy4ke3N0YXJ0RGVmYXVsdC5tZXRhRGF0YS50eXBlfWAsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgfSxcbiAgICBwb3NpdGlvbjogU1RBUlRfSU5JVElBTF9QT1NJVElPTixcbiAgfSlcblxuICBpZiAoaXNDaGF0TW9kZSkge1xuICAgIGNvbnN0IHsgbmV3Tm9kZTogbGxtTm9kZSB9ID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgIGlkOiAnbGxtJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4ubGxtRGVmYXVsdC5kZWZhdWx0VmFsdWUsXG4gICAgICAgIG1lbW9yeToge1xuICAgICAgICAgIHdpbmRvdzogeyBlbmFibGVkOiBmYWxzZSwgc2l6ZTogMTAgfSxcbiAgICAgICAgICBxdWVyeV9wcm9tcHRfdGVtcGxhdGU6ICd7eyNzeXMucXVlcnkjfX1cXG5cXG57eyNzeXMuZmlsZXMjfX0nLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogbGxtRGVmYXVsdC5tZXRhRGF0YS50eXBlLFxuICAgICAgICB0aXRsZTogdChgYmxvY2tzLiR7bGxtRGVmYXVsdC5tZXRhRGF0YS50eXBlfWAsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgeDogU1RBUlRfSU5JVElBTF9QT1NJVElPTi54ICsgTk9ERV9XSURUSF9YX09GRlNFVCxcbiAgICAgICAgeTogU1RBUlRfSU5JVElBTF9QT1NJVElPTi55LFxuICAgICAgfSxcbiAgICB9IGFzIGFueSlcblxuICAgIGNvbnN0IHsgbmV3Tm9kZTogYW5zd2VyTm9kZSB9ID0gZ2VuZXJhdGVOZXdOb2RlKHtcbiAgICAgIGlkOiAnYW5zd2VyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uYW5zd2VyRGVmYXVsdC5kZWZhdWx0VmFsdWUsXG4gICAgICAgIGFuc3dlcjogYHt7IyR7bGxtTm9kZS5pZH0udGV4dCN9fWAsXG4gICAgICAgIHR5cGU6IGFuc3dlckRlZmF1bHQubWV0YURhdGEudHlwZSxcbiAgICAgICAgdGl0bGU6IHQoYGJsb2Nrcy4ke2Fuc3dlckRlZmF1bHQubWV0YURhdGEudHlwZX1gLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHg6IFNUQVJUX0lOSVRJQUxfUE9TSVRJT04ueCArIE5PREVfV0lEVEhfWF9PRkZTRVQgKiAyLFxuICAgICAgICB5OiBTVEFSVF9JTklUSUFMX1BPU0lUSU9OLnksXG4gICAgICB9LFxuICAgIH0gYXMgYW55KVxuXG4gICAgY29uc3Qgc3RhcnRUb0xsbUVkZ2UgPSB7XG4gICAgICBpZDogYCR7c3RhcnROb2RlLmlkfS0ke2xsbU5vZGUuaWR9YCxcbiAgICAgIHNvdXJjZTogc3RhcnROb2RlLmlkLFxuICAgICAgc291cmNlSGFuZGxlOiAnc291cmNlJyxcbiAgICAgIHRhcmdldDogbGxtTm9kZS5pZCxcbiAgICAgIHRhcmdldEhhbmRsZTogJ3RhcmdldCcsXG4gICAgfVxuXG4gICAgY29uc3QgbGxtVG9BbnN3ZXJFZGdlID0ge1xuICAgICAgaWQ6IGAke2xsbU5vZGUuaWR9LSR7YW5zd2VyTm9kZS5pZH1gLFxuICAgICAgc291cmNlOiBsbG1Ob2RlLmlkLFxuICAgICAgc291cmNlSGFuZGxlOiAnc291cmNlJyxcbiAgICAgIHRhcmdldDogYW5zd2VyTm9kZS5pZCxcbiAgICAgIHRhcmdldEhhbmRsZTogJ3RhcmdldCcsXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGVzOiBbc3RhcnROb2RlLCBsbG1Ob2RlLCBhbnN3ZXJOb2RlXSxcbiAgICAgIGVkZ2VzOiBbc3RhcnRUb0xsbUVkZ2UsIGxsbVRvQW5zd2VyRWRnZV0sXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlczogW3N0YXJ0Tm9kZV0sXG4gICAgICBlZGdlczogW10sXG4gICAgfVxuICB9XG59XG4iXX0=