"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAvailableNodesMetaData = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const node_1 = require("@/app/components/workflow/constants/node");
const default_1 = require("@/app/components/workflow/nodes/data-source-empty/default");
const default_2 = require("@/app/components/workflow/nodes/data-source/default");
const default_3 = require("@/app/components/workflow/nodes/knowledge-base/default");
const types_1 = require("@/app/components/workflow/types");
const i18n_1 = require("@/context/i18n");
const useAvailableNodesMetaData = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const language = (0, i18n_1.useGetLanguage)();
    const mergedNodesMetaData = (0, react_1.useMemo)(() => [
        ...node_1.WORKFLOW_COMMON_NODES,
        {
            ...default_2.default,
            defaultValue: {
                ...default_2.default.defaultValue,
                _dataSourceStartToAdd: true,
            },
        },
        default_3.default,
        default_1.default,
    ], []);
    const helpLinkUri = (0, react_1.useMemo)(() => {
        if (language === 'zh_Hans')
            return 'https://docs.dify.ai/zh-hans/guides/knowledge-base/knowledge-pipeline/knowledge-pipeline-orchestration#%E6%AD%A5%E9%AA%A4%E4%B8%80%EF%BC%9A%E6%95%B0%E6%8D%AE%E6%BA%90%E9%85%8D%E7%BD%AE';
        if (language === 'ja_JP')
            return 'https://docs.dify.ai/ja-jp/guides/knowledge-base/knowledge-pipeline/knowledge-pipeline-orchestration#%E3%82%B9%E3%83%86%E3%83%83%E3%83%971%EF%BC%9A%E3%83%87%E3%83%BC%E3%82%BF%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AE%E8%A8%AD%E5%AE%9A';
        return 'https://docs.dify.ai/en/guides/knowledge-base/knowledge-pipeline/knowledge-pipeline-orchestration#step-1%3A-data-source';
    }, [language]);
    const availableNodesMetaData = (0, react_1.useMemo)(() => mergedNodesMetaData.map((node) => {
        const { metaData } = node;
        const title = t(`blocks.${metaData.type}`, { ns: 'workflow' });
        const description = t(`blocksAbout.${metaData.type}`, { ns: 'workflow' });
        return {
            ...node,
            metaData: {
                ...metaData,
                title,
                description,
                helpLinkUri,
            },
            defaultValue: {
                ...node.defaultValue,
                type: metaData.type,
                title,
            },
        };
    }), [mergedNodesMetaData, t]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF2YWlsYWJsZS1ub2Rlcy1tZXRhLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYXZhaWxhYmxlLW5vZGVzLW1ldGEtZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaURBQThDO0FBQzlDLG1FQUFnRjtBQUNoRix1RkFBOEY7QUFDOUYsaUZBQW1GO0FBQ25GLG9GQUF5RjtBQUN6RiwyREFBMkQ7QUFDM0QseUNBQStDO0FBRXhDLE1BQU0seUJBQXlCLEdBQUcsR0FBRyxFQUFFO0lBQzVDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFBLHFCQUFjLEdBQUUsQ0FBQTtJQUVqQyxNQUFNLG1CQUFtQixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLEdBQUcsNEJBQXFCO1FBQ3hCO1lBQ0UsR0FBRyxpQkFBaUI7WUFDcEIsWUFBWSxFQUFFO2dCQUNaLEdBQUcsaUJBQWlCLENBQUMsWUFBWTtnQkFDakMscUJBQXFCLEVBQUUsSUFBSTthQUM1QjtTQUNGO1FBQ0QsaUJBQW9CO1FBQ3BCLGlCQUFzQjtLQUN2QixFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQy9CLElBQUksUUFBUSxLQUFLLFNBQVM7WUFDeEIsT0FBTywwTEFBMEwsQ0FBQTtRQUNuTSxJQUFJLFFBQVEsS0FBSyxPQUFPO1lBQ3RCLE9BQU8sc09BQXNPLENBQUE7UUFFL08sT0FBTyx5SEFBeUgsQ0FBQTtJQUNsSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRWQsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM1RSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFBO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxVQUFVLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQzlELE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxlQUFlLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQ3pFLE9BQU87WUFDTCxHQUFHLElBQUk7WUFDUCxRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxRQUFRO2dCQUNYLEtBQUs7Z0JBQ0wsV0FBVztnQkFDWCxXQUFXO2FBQ1o7WUFDRCxZQUFZLEVBQUU7Z0JBQ1osR0FBRyxJQUFJLENBQUMsWUFBWTtnQkFDcEIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixLQUFLO2FBQ047U0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRTdCLE1BQU0seUJBQXlCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzFGLEdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTtRQUMvQixPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUMsRUFBRSxFQUF3QyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7SUFFdkUsT0FBTyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbEIsT0FBTztZQUNMLEtBQUssRUFBRSxzQkFBc0I7WUFDN0IsUUFBUSxFQUFFO2dCQUNSLEdBQUcseUJBQXlCO2dCQUM1QixDQUFDLGlCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSx5QkFBeUIsRUFBRSxDQUFDLGlCQUFTLENBQUMsa0JBQWtCLENBQUM7YUFDeEY7U0FDRixDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFBO0FBQ3pELENBQUMsQ0FBQTtBQTVEWSxRQUFBLHlCQUF5Qiw2QkE0RHJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBdmFpbGFibGVOb2Rlc01ldGFEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcy1zdG9yZS9zdG9yZSdcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IFdPUktGTE9XX0NPTU1PTl9OT0RFUyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzL25vZGUnXG5pbXBvcnQgZGF0YVNvdXJjZUVtcHR5RGVmYXVsdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlLWVtcHR5L2RlZmF1bHQnXG5pbXBvcnQgZGF0YVNvdXJjZURlZmF1bHQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS9kZWZhdWx0J1xuaW1wb3J0IGtub3dsZWRnZUJhc2VEZWZhdWx0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMva25vd2xlZGdlLWJhc2UvZGVmYXVsdCdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VHZXRMYW5ndWFnZSB9IGZyb20gJ0AvY29udGV4dC9pMThuJ1xuXG5leHBvcnQgY29uc3QgdXNlQXZhaWxhYmxlTm9kZXNNZXRhRGF0YSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGxhbmd1YWdlID0gdXNlR2V0TGFuZ3VhZ2UoKVxuXG4gIGNvbnN0IG1lcmdlZE5vZGVzTWV0YURhdGEgPSB1c2VNZW1vKCgpID0+IFtcbiAgICAuLi5XT1JLRkxPV19DT01NT05fTk9ERVMsXG4gICAge1xuICAgICAgLi4uZGF0YVNvdXJjZURlZmF1bHQsXG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgLi4uZGF0YVNvdXJjZURlZmF1bHQuZGVmYXVsdFZhbHVlLFxuICAgICAgICBfZGF0YVNvdXJjZVN0YXJ0VG9BZGQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAga25vd2xlZGdlQmFzZURlZmF1bHQsXG4gICAgZGF0YVNvdXJjZUVtcHR5RGVmYXVsdCxcbiAgXSwgW10pXG5cbiAgY29uc3QgaGVscExpbmtVcmkgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAobGFuZ3VhZ2UgPT09ICd6aF9IYW5zJylcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvemgtaGFucy9ndWlkZXMva25vd2xlZGdlLWJhc2Uva25vd2xlZGdlLXBpcGVsaW5lL2tub3dsZWRnZS1waXBlbGluZS1vcmNoZXN0cmF0aW9uIyVFNiVBRCVBNSVFOSVBQSVBNCVFNCVCOCU4MCVFRiVCQyU5QSVFNiU5NSVCMCVFNiU4RCVBRSVFNiVCQSU5MCVFOSU4NSU4RCVFNyVCRCVBRSdcbiAgICBpZiAobGFuZ3VhZ2UgPT09ICdqYV9KUCcpXG4gICAgICByZXR1cm4gJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2phLWpwL2d1aWRlcy9rbm93bGVkZ2UtYmFzZS9rbm93bGVkZ2UtcGlwZWxpbmUva25vd2xlZGdlLXBpcGVsaW5lLW9yY2hlc3RyYXRpb24jJUUzJTgyJUI5JUUzJTgzJTg2JUUzJTgzJTgzJUUzJTgzJTk3MSVFRiVCQyU5QSVFMyU4MyU4NyVFMyU4MyVCQyVFMyU4MiVCRiVFMyU4MiVCRCVFMyU4MyVCQyVFMyU4MiVCOSVFMyU4MSVBRSVFOCVBOCVBRCVFNSVBRSU5QSdcblxuICAgIHJldHVybiAnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvZW4vZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2tub3dsZWRnZS1waXBlbGluZS9rbm93bGVkZ2UtcGlwZWxpbmUtb3JjaGVzdHJhdGlvbiNzdGVwLTElM0EtZGF0YS1zb3VyY2UnXG4gIH0sIFtsYW5ndWFnZV0pXG5cbiAgY29uc3QgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSA9IHVzZU1lbW8oKCkgPT4gbWVyZ2VkTm9kZXNNZXRhRGF0YS5tYXAoKG5vZGUpID0+IHtcbiAgICBjb25zdCB7IG1ldGFEYXRhIH0gPSBub2RlXG4gICAgY29uc3QgdGl0bGUgPSB0KGBibG9ja3MuJHttZXRhRGF0YS50eXBlfWAsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHQoYGJsb2Nrc0Fib3V0LiR7bWV0YURhdGEudHlwZX1gLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm5vZGUsXG4gICAgICBtZXRhRGF0YToge1xuICAgICAgICAuLi5tZXRhRGF0YSxcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBoZWxwTGlua1VyaSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0VmFsdWU6IHtcbiAgICAgICAgLi4ubm9kZS5kZWZhdWx0VmFsdWUsXG4gICAgICAgIHR5cGU6IG1ldGFEYXRhLnR5cGUsXG4gICAgICAgIHRpdGxlLFxuICAgICAgfSxcbiAgICB9XG4gIH0pLCBbbWVyZ2VkTm9kZXNNZXRhRGF0YSwgdF0pXG5cbiAgY29uc3QgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YU1hcCA9IHVzZU1lbW8oKCkgPT4gYXZhaWxhYmxlTm9kZXNNZXRhRGF0YS5yZWR1Y2UoKGFjYywgbm9kZSkgPT4ge1xuICAgIGFjYyFbbm9kZS5tZXRhRGF0YS50eXBlXSA9IG5vZGVcbiAgICByZXR1cm4gYWNjXG4gIH0sIHt9IGFzIEF2YWlsYWJsZU5vZGVzTWV0YURhdGFbJ25vZGVzTWFwJ10pLCBbYXZhaWxhYmxlTm9kZXNNZXRhRGF0YV0pXG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlczogYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSxcbiAgICAgIG5vZGVzTWFwOiB7XG4gICAgICAgIC4uLmF2YWlsYWJsZU5vZGVzTWV0YURhdGFNYXAsXG4gICAgICAgIFtCbG9ja0VudW0uVmFyaWFibGVBc3NpZ25lcl06IGF2YWlsYWJsZU5vZGVzTWV0YURhdGFNYXA/LltCbG9ja0VudW0uVmFyaWFibGVBZ2dyZWdhdG9yXSxcbiAgICAgIH0sXG4gICAgfVxuICB9LCBbYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSwgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YU1hcF0pXG59XG4iXX0=