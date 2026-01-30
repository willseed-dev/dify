"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRetrievalSetting = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const knowledge_1 = require("@/app/components/base/icons/src/vender/knowledge");
const types_1 = require("../../types");
const useRetrievalSetting = (indexMethod) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const VectorSearchOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.RetrievalSearchMethodEnum.semantic,
            icon: knowledge_1.VectorSearch,
            title: t('retrieval.semantic_search.title', { ns: 'dataset' }),
            description: t('retrieval.semantic_search.description', { ns: 'dataset' }),
            effectColor: 'purple',
        };
    }, [t]);
    const FullTextSearchOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.RetrievalSearchMethodEnum.fullText,
            icon: knowledge_1.FullTextSearch,
            title: t('retrieval.full_text_search.title', { ns: 'dataset' }),
            description: t('retrieval.full_text_search.description', { ns: 'dataset' }),
            effectColor: 'purple',
        };
    }, [t]);
    const HybridSearchOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.RetrievalSearchMethodEnum.hybrid,
            icon: knowledge_1.HybridSearch,
            title: t('retrieval.hybrid_search.title', { ns: 'dataset' }),
            description: t('retrieval.hybrid_search.description', { ns: 'dataset' }),
            effectColor: 'purple',
        };
    }, [t]);
    const InvertedIndexOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.RetrievalSearchMethodEnum.keywordSearch,
            icon: knowledge_1.HybridSearch,
            title: t('retrieval.keyword_search.title', { ns: 'dataset' }),
            description: t('retrieval.keyword_search.description', { ns: 'dataset' }),
            effectColor: 'purple',
        };
    }, [t]);
    const WeightedScoreModeOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.HybridSearchModeEnum.WeightedScore,
            title: t('weightedScore.title', { ns: 'dataset' }),
            description: t('weightedScore.description', { ns: 'dataset' }),
        };
    }, [t]);
    const RerankModelModeOption = (0, react_1.useMemo)(() => {
        return {
            id: types_1.HybridSearchModeEnum.RerankingModel,
            title: t('modelProvider.rerankModel.key', { ns: 'common' }),
            description: t('modelProvider.rerankModel.tip', { ns: 'common' }),
        };
    }, [t]);
    return (0, react_1.useMemo)(() => ({
        options: indexMethod === types_1.IndexMethodEnum.ECONOMICAL
            ? [
                InvertedIndexOption,
            ]
            : [
                VectorSearchOption,
                FullTextSearchOption,
                HybridSearchOption,
            ],
        hybridSearchModeOptions: [
            WeightedScoreModeOption,
            RerankModelModeOption,
        ],
    }), [
        VectorSearchOption,
        FullTextSearchOption,
        HybridSearchOption,
        InvertedIndexOption,
        indexMethod,
        WeightedScoreModeOption,
        RerankModelModeOption,
    ]);
};
exports.useRetrievalSetting = useRetrievalSetting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsaUNBQStCO0FBQy9CLGlEQUE4QztBQUM5QyxnRkFJeUQ7QUFDekQsdUNBSW9CO0FBRWIsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFdBQTZCLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxrQkFBa0IsR0FBVyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDOUMsT0FBTztZQUNMLEVBQUUsRUFBRSxpQ0FBeUIsQ0FBQyxRQUFRO1lBQ3RDLElBQUksRUFBRSx3QkFBbUI7WUFDekIsS0FBSyxFQUFFLENBQUMsQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUM5RCxXQUFXLEVBQUUsQ0FBQyxDQUFDLHVDQUF1QyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQzFFLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ1AsTUFBTSxvQkFBb0IsR0FBVyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDaEQsT0FBTztZQUNMLEVBQUUsRUFBRSxpQ0FBeUIsQ0FBQyxRQUFRO1lBQ3RDLElBQUksRUFBRSwwQkFBcUI7WUFDM0IsS0FBSyxFQUFFLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUMvRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLHdDQUF3QyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQzNFLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ1AsTUFBTSxrQkFBa0IsR0FBVyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDOUMsT0FBTztZQUNMLEVBQUUsRUFBRSxpQ0FBeUIsQ0FBQyxNQUFNO1lBQ3BDLElBQUksRUFBRSx3QkFBbUI7WUFDekIsS0FBSyxFQUFFLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUM1RCxXQUFXLEVBQUUsQ0FBQyxDQUFDLHFDQUFxQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQ3hFLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ1AsTUFBTSxtQkFBbUIsR0FBVyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDL0MsT0FBTztZQUNMLEVBQUUsRUFBRSxpQ0FBeUIsQ0FBQyxhQUFhO1lBQzNDLElBQUksRUFBRSx3QkFBbUI7WUFDekIsS0FBSyxFQUFFLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUM3RCxXQUFXLEVBQUUsQ0FBQyxDQUFDLHNDQUFzQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQ3pFLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRVAsTUFBTSx1QkFBdUIsR0FBMkIsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25FLE9BQU87WUFDTCxFQUFFLEVBQUUsNEJBQW9CLENBQUMsYUFBYTtZQUN0QyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQ2xELFdBQVcsRUFBRSxDQUFDLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUM7U0FDL0QsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDUCxNQUFNLHFCQUFxQixHQUEyQixJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDakUsT0FBTztZQUNMLEVBQUUsRUFBRSw0QkFBb0IsQ0FBQyxjQUFjO1lBQ3ZDLEtBQUssRUFBRSxDQUFDLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUM7WUFDM0QsV0FBVyxFQUFFLENBQUMsQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztTQUNsRSxDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVQLE9BQU8sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwQixPQUFPLEVBQUUsV0FBVyxLQUFLLHVCQUFlLENBQUMsVUFBVTtZQUNqRCxDQUFDLENBQUM7Z0JBQ0UsbUJBQW1CO2FBQ3BCO1lBQ0gsQ0FBQyxDQUFDO2dCQUNFLGtCQUFrQjtnQkFDbEIsb0JBQW9CO2dCQUNwQixrQkFBa0I7YUFDbkI7UUFDTCx1QkFBdUIsRUFBRTtZQUN2Qix1QkFBdUI7WUFDdkIscUJBQXFCO1NBQ3RCO0tBQ0YsQ0FBQyxFQUFFO1FBQ0Ysa0JBQWtCO1FBQ2xCLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLFdBQVc7UUFDWCx1QkFBdUI7UUFDdkIscUJBQXFCO0tBQ3RCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQTdFWSxRQUFBLG1CQUFtQix1QkE2RS9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBIeWJyaWRTZWFyY2hNb2RlT3B0aW9uLFxuICBPcHRpb24sXG59IGZyb20gJy4vdHlwZSdcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7XG4gIEZ1bGxUZXh0U2VhcmNoLFxuICBIeWJyaWRTZWFyY2gsXG4gIFZlY3RvclNlYXJjaCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIva25vd2xlZGdlJ1xuaW1wb3J0IHtcbiAgSHlicmlkU2VhcmNoTW9kZUVudW0sXG4gIEluZGV4TWV0aG9kRW51bSxcbiAgUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bSxcbn0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VSZXRyaWV2YWxTZXR0aW5nID0gKGluZGV4TWV0aG9kPzogSW5kZXhNZXRob2RFbnVtKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBWZWN0b3JTZWFyY2hPcHRpb246IE9wdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bS5zZW1hbnRpYyxcbiAgICAgIGljb246IFZlY3RvclNlYXJjaCBhcyBhbnksXG4gICAgICB0aXRsZTogdCgncmV0cmlldmFsLnNlbWFudGljX3NlYXJjaC50aXRsZScsIHsgbnM6ICdkYXRhc2V0JyB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0KCdyZXRyaWV2YWwuc2VtYW50aWNfc2VhcmNoLmRlc2NyaXB0aW9uJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZWZmZWN0Q29sb3I6ICdwdXJwbGUnLFxuICAgIH1cbiAgfSwgW3RdKVxuICBjb25zdCBGdWxsVGV4dFNlYXJjaE9wdGlvbjogT3B0aW9uID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBSZXRyaWV2YWxTZWFyY2hNZXRob2RFbnVtLmZ1bGxUZXh0LFxuICAgICAgaWNvbjogRnVsbFRleHRTZWFyY2ggYXMgYW55LFxuICAgICAgdGl0bGU6IHQoJ3JldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLnRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ3JldHJpZXZhbC5mdWxsX3RleHRfc2VhcmNoLmRlc2NyaXB0aW9uJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZWZmZWN0Q29sb3I6ICdwdXJwbGUnLFxuICAgIH1cbiAgfSwgW3RdKVxuICBjb25zdCBIeWJyaWRTZWFyY2hPcHRpb246IE9wdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bS5oeWJyaWQsXG4gICAgICBpY29uOiBIeWJyaWRTZWFyY2ggYXMgYW55LFxuICAgICAgdGl0bGU6IHQoJ3JldHJpZXZhbC5oeWJyaWRfc2VhcmNoLnRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ3JldHJpZXZhbC5oeWJyaWRfc2VhcmNoLmRlc2NyaXB0aW9uJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZWZmZWN0Q29sb3I6ICdwdXJwbGUnLFxuICAgIH1cbiAgfSwgW3RdKVxuICBjb25zdCBJbnZlcnRlZEluZGV4T3B0aW9uOiBPcHRpb24gPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFJldHJpZXZhbFNlYXJjaE1ldGhvZEVudW0ua2V5d29yZFNlYXJjaCxcbiAgICAgIGljb246IEh5YnJpZFNlYXJjaCBhcyBhbnksXG4gICAgICB0aXRsZTogdCgncmV0cmlldmFsLmtleXdvcmRfc2VhcmNoLnRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ3JldHJpZXZhbC5rZXl3b3JkX3NlYXJjaC5kZXNjcmlwdGlvbicsIHsgbnM6ICdkYXRhc2V0JyB9KSxcbiAgICAgIGVmZmVjdENvbG9yOiAncHVycGxlJyxcbiAgICB9XG4gIH0sIFt0XSlcblxuICBjb25zdCBXZWlnaHRlZFNjb3JlTW9kZU9wdGlvbjogSHlicmlkU2VhcmNoTW9kZU9wdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogSHlicmlkU2VhcmNoTW9kZUVudW0uV2VpZ2h0ZWRTY29yZSxcbiAgICAgIHRpdGxlOiB0KCd3ZWlnaHRlZFNjb3JlLnRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pLFxuICAgICAgZGVzY3JpcHRpb246IHQoJ3dlaWdodGVkU2NvcmUuZGVzY3JpcHRpb24nLCB7IG5zOiAnZGF0YXNldCcgfSksXG4gICAgfVxuICB9LCBbdF0pXG4gIGNvbnN0IFJlcmFua01vZGVsTW9kZU9wdGlvbjogSHlicmlkU2VhcmNoTW9kZU9wdGlvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogSHlicmlkU2VhcmNoTW9kZUVudW0uUmVyYW5raW5nTW9kZWwsXG4gICAgICB0aXRsZTogdCgnbW9kZWxQcm92aWRlci5yZXJhbmtNb2RlbC5rZXknLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0KCdtb2RlbFByb3ZpZGVyLnJlcmFua01vZGVsLnRpcCcsIHsgbnM6ICdjb21tb24nIH0pLFxuICAgIH1cbiAgfSwgW3RdKVxuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+ICh7XG4gICAgb3B0aW9uczogaW5kZXhNZXRob2QgPT09IEluZGV4TWV0aG9kRW51bS5FQ09OT01JQ0FMXG4gICAgICA/IFtcbiAgICAgICAgICBJbnZlcnRlZEluZGV4T3B0aW9uLFxuICAgICAgICBdXG4gICAgICA6IFtcbiAgICAgICAgICBWZWN0b3JTZWFyY2hPcHRpb24sXG4gICAgICAgICAgRnVsbFRleHRTZWFyY2hPcHRpb24sXG4gICAgICAgICAgSHlicmlkU2VhcmNoT3B0aW9uLFxuICAgICAgICBdLFxuICAgIGh5YnJpZFNlYXJjaE1vZGVPcHRpb25zOiBbXG4gICAgICBXZWlnaHRlZFNjb3JlTW9kZU9wdGlvbixcbiAgICAgIFJlcmFua01vZGVsTW9kZU9wdGlvbixcbiAgICBdLFxuICB9KSwgW1xuICAgIFZlY3RvclNlYXJjaE9wdGlvbixcbiAgICBGdWxsVGV4dFNlYXJjaE9wdGlvbixcbiAgICBIeWJyaWRTZWFyY2hPcHRpb24sXG4gICAgSW52ZXJ0ZWRJbmRleE9wdGlvbixcbiAgICBpbmRleE1ldGhvZCxcbiAgICBXZWlnaHRlZFNjb3JlTW9kZU9wdGlvbixcbiAgICBSZXJhbmtNb2RlbE1vZGVPcHRpb24sXG4gIF0pXG59XG4iXX0=