"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAvailableNodesMetaData = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const node_1 = require("@/app/components/workflow/constants/node");
const default_1 = require("@/app/components/workflow/nodes/answer/default");
const default_2 = require("@/app/components/workflow/nodes/end/default");
const default_3 = require("@/app/components/workflow/nodes/start/default");
const default_4 = require("@/app/components/workflow/nodes/trigger-plugin/default");
const default_5 = require("@/app/components/workflow/nodes/trigger-schedule/default");
const default_6 = require("@/app/components/workflow/nodes/trigger-webhook/default");
const types_1 = require("@/app/components/workflow/types");
const i18n_1 = require("@/context/i18n");
const use_is_chat_mode_1 = require("./use-is-chat-mode");
const useAvailableNodesMetaData = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isChatMode = (0, use_is_chat_mode_1.useIsChatMode)();
    const docLink = (0, i18n_1.useDocLink)();
    const startNodeMetaData = (0, react_1.useMemo)(() => ({
        ...default_3.default,
        metaData: {
            ...default_3.default.metaData,
            isUndeletable: isChatMode, // start node is undeletable in chat mode, @use-nodes-interactions: handleNodeDelete function
        },
    }), [isChatMode]);
    const mergedNodesMetaData = (0, react_1.useMemo)(() => [
        ...node_1.WORKFLOW_COMMON_NODES,
        startNodeMetaData,
        ...(isChatMode
            ? [default_1.default]
            : [
                default_2.default,
                default_6.default,
                default_5.default,
                default_4.default,
            ]),
    ], [isChatMode, startNodeMetaData]);
    const availableNodesMetaData = (0, react_1.useMemo)(() => mergedNodesMetaData.map((node) => {
        const { metaData } = node;
        const title = t(`blocks.${metaData.type}`, { ns: 'workflow' });
        const description = t(`blocksAbout.${metaData.type}`, { ns: 'workflow' });
        const helpLinkPath = `guides/workflow/node/${metaData.helpLinkUri}`;
        return {
            ...node,
            metaData: {
                ...metaData,
                title,
                description,
                helpLinkUri: docLink(helpLinkPath),
            },
            defaultValue: {
                ...node.defaultValue,
                type: metaData.type,
                title,
            },
        };
    }), [mergedNodesMetaData, t, docLink]);
    const availableNodesMetaDataMap = (0, react_1.useMemo)(() => availableNodesMetaData.reduce((acc, node) => {
        acc[node.metaData.type] = node;
        return acc;
    }, {}), [availableNodesMetaData]);
    return (0, react_1.useMemo)(() => {
        return {
            nodes: availableNodesMetaData,
            nodesMap: {
                ...availableNodesMetaDataMap,
                [types_1.BlockEnum.VariableAssigner]: availableNodesMetaDataMap?.[types_1.BlockEnum.VariableAggregator],
            },
        };
    }, [availableNodesMetaData, availableNodesMetaDataMap]);
};
exports.useAvailableNodesMetaData = useAvailableNodesMetaData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF2YWlsYWJsZS1ub2Rlcy1tZXRhLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYXZhaWxhYmxlLW5vZGVzLW1ldGEtZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaURBQThDO0FBQzlDLG1FQUFnRjtBQUNoRiw0RUFBMEU7QUFDMUUseUVBQW9FO0FBQ3BFLDJFQUF3RTtBQUN4RSxvRkFBeUY7QUFDekYsc0ZBQTZGO0FBQzdGLHFGQUEyRjtBQUMzRiwyREFBMkQ7QUFDM0QseUNBQTJDO0FBQzNDLHlEQUFrRDtBQUUzQyxNQUFNLHlCQUF5QixHQUFHLEdBQUcsRUFBRTtJQUM1QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQ0FBYSxHQUFFLENBQUE7SUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBVSxHQUFFLENBQUE7SUFFNUIsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsaUJBQVk7UUFDZixRQUFRLEVBQUU7WUFDUixHQUFHLGlCQUFZLENBQUMsUUFBUTtZQUN4QixhQUFhLEVBQUUsVUFBVSxFQUFFLDZGQUE2RjtTQUN6SDtLQUNGLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFFakIsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQztRQUN4QyxHQUFHLDRCQUFxQjtRQUN4QixpQkFBaUI7UUFDakIsR0FBRyxDQUNELFVBQVU7WUFDUixDQUFDLENBQUMsQ0FBQyxpQkFBYSxDQUFDO1lBQ2pCLENBQUMsQ0FBQztnQkFDRSxpQkFBVTtnQkFDVixpQkFBcUI7Z0JBQ3JCLGlCQUFzQjtnQkFDdEIsaUJBQW9CO2FBQ3JCLENBQ047S0FDRixFQUFFLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQTtJQUVuQyxNQUFNLHNCQUFzQixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzVFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDekIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFVBQVUsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDOUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLGVBQWUsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDekUsTUFBTSxZQUFZLEdBQUcsd0JBQXdCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNuRSxPQUFPO1lBQ0wsR0FBRyxJQUFJO1lBQ1AsUUFBUSxFQUFFO2dCQUNSLEdBQUcsUUFBUTtnQkFDWCxLQUFLO2dCQUNMLFdBQVc7Z0JBQ1gsV0FBVyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUM7YUFDbkM7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osR0FBRyxJQUFJLENBQUMsWUFBWTtnQkFDcEIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixLQUFLO2FBQ047U0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUV0QyxNQUFNLHlCQUF5QixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUMxRixHQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7UUFDL0IsT0FBTyxHQUFHLENBQUE7SUFDWixDQUFDLEVBQUUsRUFBd0MsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO0lBRXZFLE9BQU8sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ2xCLE9BQU87WUFDTCxLQUFLLEVBQUUsc0JBQXNCO1lBQzdCLFFBQVEsRUFBRTtnQkFDUixHQUFHLHlCQUF5QjtnQkFDNUIsQ0FBQyxpQkFBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxpQkFBUyxDQUFDLGtCQUFrQixDQUFDO2FBQ3hGO1NBQ0YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLHlCQUF5QixDQUFDLENBQUMsQ0FBQTtBQUN6RCxDQUFDLENBQUE7QUEvRFksUUFBQSx5QkFBeUIsNkJBK0RyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXZhaWxhYmxlTm9kZXNNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3Mtc3RvcmUvc3RvcmUnXG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBXT1JLRkxPV19DT01NT05fTk9ERVMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnN0YW50cy9ub2RlJ1xuaW1wb3J0IEFuc3dlckRlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9hbnN3ZXIvZGVmYXVsdCdcbmltcG9ydCBFbmREZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZW5kL2RlZmF1bHQnXG5pbXBvcnQgU3RhcnREZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvc3RhcnQvZGVmYXVsdCdcbmltcG9ydCBUcmlnZ2VyUGx1Z2luRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3RyaWdnZXItcGx1Z2luL2RlZmF1bHQnXG5pbXBvcnQgVHJpZ2dlclNjaGVkdWxlRGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3RyaWdnZXItc2NoZWR1bGUvZGVmYXVsdCdcbmltcG9ydCBUcmlnZ2VyV2ViaG9va0RlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy90cmlnZ2VyLXdlYmhvb2svZGVmYXVsdCdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VEb2NMaW5rIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5pbXBvcnQgeyB1c2VJc0NoYXRNb2RlIH0gZnJvbSAnLi91c2UtaXMtY2hhdC1tb2RlJ1xuXG5leHBvcnQgY29uc3QgdXNlQXZhaWxhYmxlTm9kZXNNZXRhRGF0YSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcbiAgY29uc3QgZG9jTGluayA9IHVzZURvY0xpbmsoKVxuXG4gIGNvbnN0IHN0YXJ0Tm9kZU1ldGFEYXRhID0gdXNlTWVtbygoKSA9PiAoe1xuICAgIC4uLlN0YXJ0RGVmYXVsdCxcbiAgICBtZXRhRGF0YToge1xuICAgICAgLi4uU3RhcnREZWZhdWx0Lm1ldGFEYXRhLFxuICAgICAgaXNVbmRlbGV0YWJsZTogaXNDaGF0TW9kZSwgLy8gc3RhcnQgbm9kZSBpcyB1bmRlbGV0YWJsZSBpbiBjaGF0IG1vZGUsIEB1c2Utbm9kZXMtaW50ZXJhY3Rpb25zOiBoYW5kbGVOb2RlRGVsZXRlIGZ1bmN0aW9uXG4gICAgfSxcbiAgfSksIFtpc0NoYXRNb2RlXSlcblxuICBjb25zdCBtZXJnZWROb2Rlc01ldGFEYXRhID0gdXNlTWVtbygoKSA9PiBbXG4gICAgLi4uV09SS0ZMT1dfQ09NTU9OX05PREVTLFxuICAgIHN0YXJ0Tm9kZU1ldGFEYXRhLFxuICAgIC4uLihcbiAgICAgIGlzQ2hhdE1vZGVcbiAgICAgICAgPyBbQW5zd2VyRGVmYXVsdF1cbiAgICAgICAgOiBbXG4gICAgICAgICAgICBFbmREZWZhdWx0LFxuICAgICAgICAgICAgVHJpZ2dlcldlYmhvb2tEZWZhdWx0LFxuICAgICAgICAgICAgVHJpZ2dlclNjaGVkdWxlRGVmYXVsdCxcbiAgICAgICAgICAgIFRyaWdnZXJQbHVnaW5EZWZhdWx0LFxuICAgICAgICAgIF1cbiAgICApLFxuICBdLCBbaXNDaGF0TW9kZSwgc3RhcnROb2RlTWV0YURhdGFdKVxuXG4gIGNvbnN0IGF2YWlsYWJsZU5vZGVzTWV0YURhdGEgPSB1c2VNZW1vKCgpID0+IG1lcmdlZE5vZGVzTWV0YURhdGEubWFwKChub2RlKSA9PiB7XG4gICAgY29uc3QgeyBtZXRhRGF0YSB9ID0gbm9kZVxuICAgIGNvbnN0IHRpdGxlID0gdChgYmxvY2tzLiR7bWV0YURhdGEudHlwZX1gLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSB0KGBibG9ja3NBYm91dC4ke21ldGFEYXRhLnR5cGV9YCwgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgIGNvbnN0IGhlbHBMaW5rUGF0aCA9IGBndWlkZXMvd29ya2Zsb3cvbm9kZS8ke21ldGFEYXRhLmhlbHBMaW5rVXJpfWBcbiAgICByZXR1cm4ge1xuICAgICAgLi4ubm9kZSxcbiAgICAgIG1ldGFEYXRhOiB7XG4gICAgICAgIC4uLm1ldGFEYXRhLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGhlbHBMaW5rVXJpOiBkb2NMaW5rKGhlbHBMaW5rUGF0aCksXG4gICAgICB9LFxuICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgIC4uLm5vZGUuZGVmYXVsdFZhbHVlLFxuICAgICAgICB0eXBlOiBtZXRhRGF0YS50eXBlLFxuICAgICAgICB0aXRsZSxcbiAgICAgIH0sXG4gICAgfVxuICB9KSwgW21lcmdlZE5vZGVzTWV0YURhdGEsIHQsIGRvY0xpbmtdKVxuXG4gIGNvbnN0IGF2YWlsYWJsZU5vZGVzTWV0YURhdGFNYXAgPSB1c2VNZW1vKCgpID0+IGF2YWlsYWJsZU5vZGVzTWV0YURhdGEucmVkdWNlKChhY2MsIG5vZGUpID0+IHtcbiAgICBhY2MhW25vZGUubWV0YURhdGEudHlwZV0gPSBub2RlXG4gICAgcmV0dXJuIGFjY1xuICB9LCB7fSBhcyBBdmFpbGFibGVOb2Rlc01ldGFEYXRhWydub2Rlc01hcCddKSwgW2F2YWlsYWJsZU5vZGVzTWV0YURhdGFdKVxuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbm9kZXM6IGF2YWlsYWJsZU5vZGVzTWV0YURhdGEsXG4gICAgICBub2Rlc01hcDoge1xuICAgICAgICAuLi5hdmFpbGFibGVOb2Rlc01ldGFEYXRhTWFwLFxuICAgICAgICBbQmxvY2tFbnVtLlZhcmlhYmxlQXNzaWduZXJdOiBhdmFpbGFibGVOb2Rlc01ldGFEYXRhTWFwPy5bQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcl0sXG4gICAgICB9LFxuICAgIH1cbiAgfSwgW2F2YWlsYWJsZU5vZGVzTWV0YURhdGEsIGF2YWlsYWJsZU5vZGVzTWV0YURhdGFNYXBdKVxufVxuIl19