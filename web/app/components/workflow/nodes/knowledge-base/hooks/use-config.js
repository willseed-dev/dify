"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfig = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const hooks_1 = require("@/app/components/workflow/hooks");
const datasets_1 = require("@/models/datasets");
const types_1 = require("../types");
const utils_1 = require("../utils");
const useConfig = (id) => {
    const store = (0, reactflow_1.useStoreApi)();
    const { handleNodeDataUpdateWithSyncDraft } = (0, hooks_1.useNodeDataUpdate)();
    const getNodeData = (0, react_1.useCallback)(() => {
        const { getNodes } = store.getState();
        const nodes = getNodes();
        return nodes.find(node => node.id === id);
    }, [store, id]);
    const handleNodeDataUpdate = (0, react_1.useCallback)((data) => {
        handleNodeDataUpdateWithSyncDraft({
            id,
            data,
        });
    }, [id, handleNodeDataUpdateWithSyncDraft]);
    const getDefaultWeights = (0, react_1.useCallback)(({ embeddingModel, embeddingModelProvider, }) => {
        return {
            vector_setting: {
                vector_weight: datasets_1.DEFAULT_WEIGHTED_SCORE.other.semantic,
                embedding_provider_name: embeddingModelProvider || '',
                embedding_model_name: embeddingModel,
            },
            keyword_setting: {
                keyword_weight: datasets_1.DEFAULT_WEIGHTED_SCORE.other.keyword,
            },
        };
    }, []);
    const handleChunkStructureChange = (0, react_1.useCallback)((chunkStructure) => {
        const nodeData = getNodeData();
        const { indexing_technique, retrieval_model, chunk_structure, index_chunk_variable_selector, } = nodeData?.data || {};
        const { search_method } = retrieval_model || {};
        handleNodeDataUpdate({
            chunk_structure: chunkStructure,
            indexing_technique: (chunkStructure === types_1.ChunkStructureEnum.parent_child || chunkStructure === types_1.ChunkStructureEnum.question_answer) ? types_1.IndexMethodEnum.QUALIFIED : indexing_technique,
            retrieval_model: {
                ...retrieval_model,
                search_method: ((chunkStructure === types_1.ChunkStructureEnum.parent_child || chunkStructure === types_1.ChunkStructureEnum.question_answer) && !(0, utils_1.isHighQualitySearchMethod)(search_method)) ? types_1.RetrievalSearchMethodEnum.keywordSearch : search_method,
            },
            index_chunk_variable_selector: chunkStructure === chunk_structure ? index_chunk_variable_selector : [],
        });
    }, [handleNodeDataUpdate, getNodeData]);
    const handleIndexMethodChange = (0, react_1.useCallback)((indexMethod) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate((0, immer_1.produce)(nodeData?.data, (draft) => {
            draft.indexing_technique = indexMethod;
            if (indexMethod === types_1.IndexMethodEnum.ECONOMICAL)
                draft.retrieval_model.search_method = types_1.RetrievalSearchMethodEnum.keywordSearch;
            else if (indexMethod === types_1.IndexMethodEnum.QUALIFIED)
                draft.retrieval_model.search_method = types_1.RetrievalSearchMethodEnum.semantic;
        }));
    }, [handleNodeDataUpdate, getNodeData]);
    const handleKeywordNumberChange = (0, react_1.useCallback)((keywordNumber) => {
        handleNodeDataUpdate({ keyword_number: keywordNumber });
    }, [handleNodeDataUpdate]);
    const handleEmbeddingModelChange = (0, react_1.useCallback)(({ embeddingModel, embeddingModelProvider, }) => {
        const nodeData = getNodeData();
        const defaultWeights = getDefaultWeights({
            embeddingModel,
            embeddingModelProvider,
        });
        const changeData = {
            embedding_model: embeddingModel,
            embedding_model_provider: embeddingModelProvider,
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
            },
        };
        if (changeData.retrieval_model.weights) {
            changeData.retrieval_model = {
                ...changeData.retrieval_model,
                weights: {
                    ...changeData.retrieval_model.weights,
                    vector_setting: {
                        ...changeData.retrieval_model.weights.vector_setting,
                        embedding_provider_name: embeddingModelProvider,
                        embedding_model_name: embeddingModel,
                    },
                },
            };
        }
        else {
            changeData.retrieval_model = {
                ...changeData.retrieval_model,
                weights: defaultWeights,
            };
        }
        handleNodeDataUpdate(changeData);
    }, [getNodeData, getDefaultWeights, handleNodeDataUpdate]);
    const handleRetrievalSearchMethodChange = (0, react_1.useCallback)((searchMethod) => {
        const nodeData = getNodeData();
        const changeData = {
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                search_method: searchMethod,
                reranking_mode: nodeData?.data.retrieval_model.reranking_mode || datasets_1.RerankingModeEnum.RerankingModel,
            },
        };
        if (searchMethod === types_1.RetrievalSearchMethodEnum.hybrid) {
            changeData.retrieval_model = {
                ...changeData.retrieval_model,
                reranking_enable: changeData.retrieval_model.reranking_mode === datasets_1.RerankingModeEnum.RerankingModel,
            };
        }
        handleNodeDataUpdate(changeData);
    }, [getNodeData, handleNodeDataUpdate]);
    const handleHybridSearchModeChange = (0, react_1.useCallback)((hybridSearchMode) => {
        const nodeData = getNodeData();
        const defaultWeights = getDefaultWeights({
            embeddingModel: nodeData?.data.embedding_model || '',
            embeddingModelProvider: nodeData?.data.embedding_model_provider || '',
        });
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                reranking_mode: hybridSearchMode,
                reranking_enable: hybridSearchMode === types_1.HybridSearchModeEnum.RerankingModel,
                weights: nodeData?.data.retrieval_model.weights || defaultWeights,
            },
        });
    }, [getNodeData, getDefaultWeights, handleNodeDataUpdate]);
    const handleRerankingModelEnabledChange = (0, react_1.useCallback)((rerankingModelEnabled) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                reranking_enable: rerankingModelEnabled,
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleWeighedScoreChange = (0, react_1.useCallback)((weightedScore) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                weights: {
                    weight_type: types_1.WeightedScoreEnum.Customized,
                    vector_setting: {
                        ...nodeData?.data.retrieval_model.weights?.vector_setting,
                        vector_weight: weightedScore.value[0],
                    },
                    keyword_setting: {
                        keyword_weight: weightedScore.value[1],
                    },
                },
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleRerankingModelChange = (0, react_1.useCallback)((rerankingModel) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                reranking_model: {
                    reranking_provider_name: rerankingModel.reranking_provider_name,
                    reranking_model_name: rerankingModel.reranking_model_name,
                },
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleTopKChange = (0, react_1.useCallback)((topK) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                top_k: topK,
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleScoreThresholdChange = (0, react_1.useCallback)((scoreThreshold) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                score_threshold: scoreThreshold,
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleScoreThresholdEnabledChange = (0, react_1.useCallback)((isEnabled) => {
        const nodeData = getNodeData();
        handleNodeDataUpdate({
            retrieval_model: {
                ...nodeData?.data.retrieval_model,
                score_threshold_enabled: isEnabled,
            },
        });
    }, [getNodeData, handleNodeDataUpdate]);
    const handleInputVariableChange = (0, react_1.useCallback)((inputVariable) => {
        handleNodeDataUpdate({
            index_chunk_variable_selector: Array.isArray(inputVariable) ? inputVariable : [],
        });
    }, [handleNodeDataUpdate]);
    return {
        handleChunkStructureChange,
        handleIndexMethodChange,
        handleKeywordNumberChange,
        handleEmbeddingModelChange,
        handleRetrievalSearchMethodChange,
        handleHybridSearchModeChange,
        handleRerankingModelEnabledChange,
        handleWeighedScoreChange,
        handleRerankingModelChange,
        handleTopKChange,
        handleScoreThresholdChange,
        handleScoreThresholdEnabledChange,
        handleInputVariableChange,
    };
};
exports.useConfig = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBS0EsaUNBQStCO0FBQy9CLGlDQUVjO0FBQ2QseUNBQXVDO0FBQ3ZDLDJEQUFtRTtBQUNuRSxnREFBNkU7QUFDN0Usb0NBTWlCO0FBQ2pCLG9DQUFvRDtBQUU3QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLElBQUEseUJBQWlCLEdBQUUsQ0FBQTtJQUVqRSxNQUFNLFdBQVcsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ25DLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDckMsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFFeEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUMzQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUVmLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsSUFBb0MsRUFBRSxFQUFFO1FBQ2hGLGlDQUFpQyxDQUFDO1lBQ2hDLEVBQUU7WUFDRixJQUFJO1NBQ0wsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLGlDQUFpQyxDQUFDLENBQUMsQ0FBQTtJQUUzQyxNQUFNLGlCQUFpQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLEVBQ3JDLGNBQWMsRUFDZCxzQkFBc0IsR0FJdkIsRUFBRSxFQUFFO1FBQ0gsT0FBTztZQUNMLGNBQWMsRUFBRTtnQkFDZCxhQUFhLEVBQUUsaUNB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QUFBO0lBRXZDLE1BQU0seUJBQXlCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsYUFBcUMsRUFBRSxFQUFFO1FBQ3RGLG9CQUFvQixDQUFDO1lBQ25CLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUNqRixDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUE7SUFFMUIsT0FBTztRQUNMLDBCQUEwQjtRQUMxQix1QkFBdUI7UUFDdkIseUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQixpQ0FBaUM7UUFDakMsNEJBQTRCO1FBQzVCLGlDQUFpQztRQUNqQyx3QkFBd0I7UUFDeEIsMEJBQTBCO1FBQzFCLGdCQUFnQjtRQUNoQiwwQkFBMEI7UUFDMUIsaUNBQWlDO1FBQ2pDLHlCQUF5QjtLQUMxQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbFBZLFFBQUEsU0FBUyxhQWtQckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIEtub3dsZWRnZUJhc2VOb2RlVHlwZSxcbiAgUmVyYW5raW5nTW9kZWwsXG59IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBWYWx1ZVNlbGVjdG9yIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdXNlTm9kZURhdGFVcGRhdGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJ1xuaW1wb3J0IHsgREVGQVVMVF9XRUlHSFRFRF9TQ09SRSwgUmVyYW5raW5nTW9kZUVudW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7XG4gIENodW5rU3RydWN0dXJlRW51bSxcbiAgSHlicmlkU2VhcmNoTW9kZUVudW0sXG4gIEluZGV4TWV0aG9kRW51bSxcbiAgUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bSxcbiAgV2VpZ2h0ZWRTY29yZUVudW0sXG59IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgaXNIaWdoUXVhbGl0eVNlYXJjaE1ldGhvZCB9IGZyb20gJy4uL3V0aWxzJ1xuXG5leHBvcnQgY29uc3QgdXNlQ29uZmlnID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG4gIGNvbnN0IHsgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0IH0gPSB1c2VOb2RlRGF0YVVwZGF0ZSgpXG5cbiAgY29uc3QgZ2V0Tm9kZURhdGEgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3QgeyBnZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuXG4gICAgcmV0dXJuIG5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmlkID09PSBpZClcbiAgfSwgW3N0b3JlLCBpZF0pXG5cbiAgY29uc3QgaGFuZGxlTm9kZURhdGFVcGRhdGUgPSB1c2VDYWxsYmFjaygoZGF0YTogUGFydGlhbDxLbm93bGVkZ2VCYXNlTm9kZVR5cGU+KSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGVXaXRoU3luY0RyYWZ0KHtcbiAgICAgIGlkLFxuICAgICAgZGF0YSxcbiAgICB9KVxuICB9LCBbaWQsIGhhbmRsZU5vZGVEYXRhVXBkYXRlV2l0aFN5bmNEcmFmdF0pXG5cbiAgY29uc3QgZ2V0RGVmYXVsdFdlaWdodHMgPSB1c2VDYWxsYmFjaygoe1xuICAgIGVtYmVkZGluZ01vZGVsLFxuICAgIGVtYmVkZGluZ01vZGVsUHJvdmlkZXIsXG4gIH06IHtcbiAgICBlbWJlZGRpbmdNb2RlbDogc3RyaW5nXG4gICAgZW1iZWRkaW5nTW9kZWxQcm92aWRlcjogc3RyaW5nXG4gIH0pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdmVjdG9yX3NldHRpbmc6IHtcbiAgICAgICAgdmVjdG9yX3dlaWdodDogREVGQVVMVF9XRUlHSFRFRF9TQ09SRS5vdGhlci5zZW1hbnRpYyxcbiAgICAgICAgZW1iZWRkaW5nX3Byb3ZpZGVyX25hbWU6IGVtYmVkZGluZ01vZGVsUHJvdmlkZXIgfHwgJycsXG4gICAgICAgIGVtYmVkZGluZ19tb2RlbF9uYW1lOiBlbWJlZGRpbmdNb2RlbCxcbiAgICAgIH0sXG4gICAgICBrZXl3b3JkX3NldHRpbmc6IHtcbiAgICAgICAga2V5d29yZF93ZWlnaHQ6IERFRkFVTFRfV0VJR0hURURfU0NPUkUub3RoZXIua2V5d29yZCxcbiAgICAgIH0sXG4gICAgfVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVDaHVua1N0cnVjdHVyZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChjaHVua1N0cnVjdHVyZTogQ2h1bmtTdHJ1Y3R1cmVFbnVtKSA9PiB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXROb2RlRGF0YSgpXG4gICAgY29uc3Qge1xuICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlLFxuICAgICAgcmV0cmlldmFsX21vZGVsLFxuICAgICAgY2h1bmtfc3RydWN0dXJlLFxuICAgICAgaW5kZXhfY2h1bmtfdmFyaWFibGVfc2VsZWN0b3IsXG4gICAgfSA9IG5vZGVEYXRhPy5kYXRhIHx8IHt9XG4gICAgY29uc3QgeyBzZWFyY2hfbWV0aG9kIH0gPSByZXRyaWV2YWxfbW9kZWwgfHwge31cbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICBjaHVua19zdHJ1Y3R1cmU6IGNodW5rU3RydWN0dXJlLFxuICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiAoY2h1bmtTdHJ1Y3R1cmUgPT09IENodW5rU3RydWN0dXJlRW51bS5wYXJlbnRfY2hpbGQgfHwgY2h1bmtTdHJ1Y3R1cmUgPT09IENodW5rU3RydWN0dXJlRW51bS5xdWVzdGlvbl9hbnN3ZXIpID8gSW5kZXhNZXRob2RFbnVtLlFVQUxJRklFRCA6IGluZGV4aW5nX3RlY2huaXF1ZSxcbiAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAuLi5yZXRyaWV2YWxfbW9kZWwsXG4gICAgICAgIHNlYXJjaF9tZXRob2Q6ICgoY2h1bmtTdHJ1Y3R1cmUgPT09IENodW5rU3RydWN0dXJlRW51bS5wYXJlbnRfY2hpbGQgfHwgY2h1bmtTdHJ1Y3R1cmUgPT09IENodW5rU3RydWN0dXJlRW51bS5xdWVzdGlvbl9hbnN3ZXIpICYmICFpc0hpZ2hRdWFsaXR5U2VhcmNoTWV0aG9kKHNlYXJjaF9tZXRob2QpKSA/IFJldHJpZXZhbFNlYXJjaE1ldGhvZEVudW0ua2V5d29yZFNlYXJjaCA6IHNlYXJjaF9tZXRob2QsXG4gICAgICB9LFxuICAgICAgaW5kZXhfY2h1bmtfdmFyaWFibGVfc2VsZWN0b3I6IGNodW5rU3RydWN0dXJlID09PSBjaHVua19zdHJ1Y3R1cmUgPyBpbmRleF9jaHVua192YXJpYWJsZV9zZWxlY3RvciA6IFtdLFxuICAgIH0pXG4gIH0sIFtoYW5kbGVOb2RlRGF0YVVwZGF0ZSwgZ2V0Tm9kZURhdGFdKVxuXG4gIGNvbnN0IGhhbmRsZUluZGV4TWV0aG9kQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGluZGV4TWV0aG9kOiBJbmRleE1ldGhvZEVudW0pID0+IHtcbiAgICBjb25zdCBub2RlRGF0YSA9IGdldE5vZGVEYXRhKClcblxuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHByb2R1Y2Uobm9kZURhdGE/LmRhdGEgYXMgS25vd2xlZGdlQmFzZU5vZGVUeXBlLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmluZGV4aW5nX3RlY2huaXF1ZSA9IGluZGV4TWV0aG9kXG5cbiAgICAgIGlmIChpbmRleE1ldGhvZCA9PT0gSW5kZXhNZXRob2RFbnVtLkVDT05PTUlDQUwpXG4gICAgICAgIGRyYWZ0LnJldHJpZXZhbF9tb2RlbC5zZWFyY2hfbWV0aG9kID0gUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bS5rZXl3b3JkU2VhcmNoXG4gICAgICBlbHNlIGlmIChpbmRleE1ldGhvZCA9PT0gSW5kZXhNZXRob2RFbnVtLlFVQUxJRklFRClcbiAgICAgICAgZHJhZnQucmV0cmlldmFsX21vZGVsLnNlYXJjaF9tZXRob2QgPSBSZXRyaWV2YWxTZWFyY2hNZXRob2RFbnVtLnNlbWFudGljXG4gICAgfSkpXG4gIH0sIFtoYW5kbGVOb2RlRGF0YVVwZGF0ZSwgZ2V0Tm9kZURhdGFdKVxuXG4gIGNvbnN0IGhhbmRsZUtleXdvcmROdW1iZXJDaGFuZ2UgPSB1c2VDYWxsYmFjaygoa2V5d29yZE51bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoeyBrZXl3b3JkX251bWJlcjoga2V5d29yZE51bWJlciB9KVxuICB9LCBbaGFuZGxlTm9kZURhdGFVcGRhdGVdKVxuXG4gIGNvbnN0IGhhbmRsZUVtYmVkZGluZ01vZGVsQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHtcbiAgICBlbWJlZGRpbmdNb2RlbCxcbiAgICBlbWJlZGRpbmdNb2RlbFByb3ZpZGVyLFxuICB9OiB7XG4gICAgZW1iZWRkaW5nTW9kZWw6IHN0cmluZ1xuICAgIGVtYmVkZGluZ01vZGVsUHJvdmlkZXI6IHN0cmluZ1xuICB9KSA9PiB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXROb2RlRGF0YSgpXG4gICAgY29uc3QgZGVmYXVsdFdlaWdodHMgPSBnZXREZWZhdWx0V2VpZ2h0cyh7XG4gICAgICBlbWJlZGRpbmdNb2RlbCxcbiAgICAgIGVtYmVkZGluZ01vZGVsUHJvdmlkZXIsXG4gICAgfSlcbiAgICBjb25zdCBjaGFuZ2VEYXRhID0ge1xuICAgICAgZW1iZWRkaW5nX21vZGVsOiBlbWJlZGRpbmdNb2RlbCxcbiAgICAgIGVtYmVkZGluZ19tb2RlbF9wcm92aWRlcjogZW1iZWRkaW5nTW9kZWxQcm92aWRlcixcbiAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAuLi5ub2RlRGF0YT8uZGF0YS5yZXRyaWV2YWxfbW9kZWwsXG4gICAgICB9LFxuICAgIH1cbiAgICBpZiAoY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwud2VpZ2h0cykge1xuICAgICAgY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwgPSB7XG4gICAgICAgIC4uLmNoYW5nZURhdGEucmV0cmlldmFsX21vZGVsLFxuICAgICAgICB3ZWlnaHRzOiB7XG4gICAgICAgICAgLi4uY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwud2VpZ2h0cyxcbiAgICAgICAgICB2ZWN0b3Jfc2V0dGluZzoge1xuICAgICAgICAgICAgLi4uY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwud2VpZ2h0cy52ZWN0b3Jfc2V0dGluZyxcbiAgICAgICAgICAgIGVtYmVkZGluZ19wcm92aWRlcl9uYW1lOiBlbWJlZGRpbmdNb2RlbFByb3ZpZGVyLFxuICAgICAgICAgICAgZW1iZWRkaW5nX21vZGVsX25hbWU6IGVtYmVkZGluZ01vZGVsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwgPSB7XG4gICAgICAgIC4uLmNoYW5nZURhdGEucmV0cmlldmFsX21vZGVsLFxuICAgICAgICB3ZWlnaHRzOiBkZWZhdWx0V2VpZ2h0cyxcbiAgICAgIH1cbiAgICB9XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoY2hhbmdlRGF0YSlcbiAgfSwgW2dldE5vZGVEYXRhLCBnZXREZWZhdWx0V2VpZ2h0cywgaGFuZGxlTm9kZURhdGFVcGRhdGVdKVxuXG4gIGNvbnN0IGhhbmRsZVJldHJpZXZhbFNlYXJjaE1ldGhvZENoYW5nZSA9IHVzZUNhbGxiYWNrKChzZWFyY2hNZXRob2Q6IFJldHJpZXZhbFNlYXJjaE1ldGhvZEVudW0pID0+IHtcbiAgICBjb25zdCBub2RlRGF0YSA9IGdldE5vZGVEYXRhKClcbiAgICBjb25zdCBjaGFuZ2VEYXRhID0ge1xuICAgICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgIC4uLm5vZGVEYXRhPy5kYXRhLnJldHJpZXZhbF9tb2RlbCxcbiAgICAgICAgc2VhcmNoX21ldGhvZDogc2VhcmNoTWV0aG9kLFxuICAgICAgICByZXJhbmtpbmdfbW9kZTogbm9kZURhdGE/LmRhdGEucmV0cmlldmFsX21vZGVsLnJlcmFua2luZ19tb2RlIHx8IFJlcmFua2luZ01vZGVFbnVtLlJlcmFua2luZ01vZGVsLFxuICAgICAgfSxcbiAgICB9XG4gICAgaWYgKHNlYXJjaE1ldGhvZCA9PT0gUmV0cmlldmFsU2VhcmNoTWV0aG9kRW51bS5oeWJyaWQpIHtcbiAgICAgIGNoYW5nZURhdGEucmV0cmlldmFsX21vZGVsID0ge1xuICAgICAgICAuLi5jaGFuZ2VEYXRhLnJldHJpZXZhbF9tb2RlbCxcbiAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogY2hhbmdlRGF0YS5yZXRyaWV2YWxfbW9kZWwucmVyYW5raW5nX21vZGUgPT09IFJlcmFua2luZ01vZGVFbnVtLlJlcmFua2luZ01vZGVsLFxuICAgICAgfVxuICAgIH1cbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZShjaGFuZ2VEYXRhKVxuICB9LCBbZ2V0Tm9kZURhdGEsIGhhbmRsZU5vZGVEYXRhVXBkYXRlXSlcblxuICBjb25zdCBoYW5kbGVIeWJyaWRTZWFyY2hNb2RlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGh5YnJpZFNlYXJjaE1vZGU6IEh5YnJpZFNlYXJjaE1vZGVFbnVtKSA9PiB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXROb2RlRGF0YSgpXG4gICAgY29uc3QgZGVmYXVsdFdlaWdodHMgPSBnZXREZWZhdWx0V2VpZ2h0cyh7XG4gICAgICBlbWJlZGRpbmdNb2RlbDogbm9kZURhdGE/LmRhdGEuZW1iZWRkaW5nX21vZGVsIHx8ICcnLFxuICAgICAgZW1iZWRkaW5nTW9kZWxQcm92aWRlcjogbm9kZURhdGE/LmRhdGEuZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyIHx8ICcnLFxuICAgIH0pXG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgIC4uLm5vZGVEYXRhPy5kYXRhLnJldHJpZXZhbF9tb2RlbCxcbiAgICAgICAgcmVyYW5raW5nX21vZGU6IGh5YnJpZFNlYXJjaE1vZGUsXG4gICAgICAgIHJlcmFua2luZ19lbmFibGU6IGh5YnJpZFNlYXJjaE1vZGUgPT09IEh5YnJpZFNlYXJjaE1vZGVFbnVtLlJlcmFua2luZ01vZGVsLFxuICAgICAgICB3ZWlnaHRzOiBub2RlRGF0YT8uZGF0YS5yZXRyaWV2YWxfbW9kZWwud2VpZ2h0cyB8fCBkZWZhdWx0V2VpZ2h0cyxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSwgW2dldE5vZGVEYXRhLCBnZXREZWZhdWx0V2VpZ2h0cywgaGFuZGxlTm9kZURhdGFVcGRhdGVdKVxuXG4gIGNvbnN0IGhhbmRsZVJlcmFua2luZ01vZGVsRW5hYmxlZENoYW5nZSA9IHVzZUNhbGxiYWNrKChyZXJhbmtpbmdNb2RlbEVuYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCBub2RlRGF0YSA9IGdldE5vZGVEYXRhKClcbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICByZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgICAgLi4ubm9kZURhdGE/LmRhdGEucmV0cmlldmFsX21vZGVsLFxuICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiByZXJhbmtpbmdNb2RlbEVuYWJsZWQsXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtnZXROb2RlRGF0YSwgaGFuZGxlTm9kZURhdGFVcGRhdGVdKVxuXG4gIGNvbnN0IGhhbmRsZVdlaWdoZWRTY29yZUNoYW5nZSA9IHVzZUNhbGxiYWNrKCh3ZWlnaHRlZFNjb3JlOiB7IHZhbHVlOiBudW1iZXJbXSB9KSA9PiB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXROb2RlRGF0YSgpXG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgIC4uLm5vZGVEYXRhPy5kYXRhLnJldHJpZXZhbF9tb2RlbCxcbiAgICAgICAgd2VpZ2h0czoge1xuICAgICAgICAgIHdlaWdodF90eXBlOiBXZWlnaHRlZFNjb3JlRW51bS5DdXN0b21pemVkLFxuICAgICAgICAgIHZlY3Rvcl9zZXR0aW5nOiB7XG4gICAgICAgICAgICAuLi5ub2RlRGF0YT8uZGF0YS5yZXRyaWV2YWxfbW9kZWwud2VpZ2h0cz8udmVjdG9yX3NldHRpbmcsXG4gICAgICAgICAgICB2ZWN0b3Jfd2VpZ2h0OiB3ZWlnaHRlZFNjb3JlLnZhbHVlWzBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga2V5d29yZF9zZXR0aW5nOiB7XG4gICAgICAgICAgICBrZXl3b3JkX3dlaWdodDogd2VpZ2h0ZWRTY29yZS52YWx1ZVsxXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbZ2V0Tm9kZURhdGEsIGhhbmRsZU5vZGVEYXRhVXBkYXRlXSlcblxuICBjb25zdCBoYW5kbGVSZXJhbmtpbmdNb2RlbENoYW5nZSA9IHVzZUNhbGxiYWNrKChyZXJhbmtpbmdNb2RlbDogUmVyYW5raW5nTW9kZWwpID0+IHtcbiAgICBjb25zdCBub2RlRGF0YSA9IGdldE5vZGVEYXRhKClcbiAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICByZXRyaWV2YWxfbW9kZWw6IHtcbiAgICAgICAgLi4ubm9kZURhdGE/LmRhdGEucmV0cmlldmFsX21vZGVsLFxuICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogcmVyYW5raW5nTW9kZWwucmVyYW5raW5nX3Byb3ZpZGVyX25hbWUsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsX25hbWU6IHJlcmFua2luZ01vZGVsLnJlcmFua2luZ19tb2RlbF9uYW1lLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbZ2V0Tm9kZURhdGEsIGhhbmRsZU5vZGVEYXRhVXBkYXRlXSlcblxuICBjb25zdCBoYW5kbGVUb3BLQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHRvcEs6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0Tm9kZURhdGEoKVxuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAuLi5ub2RlRGF0YT8uZGF0YS5yZXRyaWV2YWxfbW9kZWwsXG4gICAgICAgIHRvcF9rOiB0b3BLLFxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbZ2V0Tm9kZURhdGEsIGhhbmRsZU5vZGVEYXRhVXBkYXRlXSlcblxuICBjb25zdCBoYW5kbGVTY29yZVRocmVzaG9sZENoYW5nZSA9IHVzZUNhbGxiYWNrKChzY29yZVRocmVzaG9sZDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgbm9kZURhdGEgPSBnZXROb2RlRGF0YSgpXG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICAgIC4uLm5vZGVEYXRhPy5kYXRhLnJldHJpZXZhbF9tb2RlbCxcbiAgICAgICAgc2NvcmVfdGhyZXNob2xkOiBzY29yZVRocmVzaG9sZCxcbiAgICAgIH0sXG4gICAgfSlcbiAgfSwgW2dldE5vZGVEYXRhLCBoYW5kbGVOb2RlRGF0YVVwZGF0ZV0pXG5cbiAgY29uc3QgaGFuZGxlU2NvcmVUaHJlc2hvbGRFbmFibGVkQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGlzRW5hYmxlZDogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IG5vZGVEYXRhID0gZ2V0Tm9kZURhdGEoKVxuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgIHJldHJpZXZhbF9tb2RlbDoge1xuICAgICAgICAuLi5ub2RlRGF0YT8uZGF0YS5yZXRyaWV2YWxfbW9kZWwsXG4gICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBpc0VuYWJsZWQsXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtnZXROb2RlRGF0YSwgaGFuZGxlTm9kZURhdGFVcGRhdGVdKVxuXG4gIGNvbnN0IGhhbmRsZUlucHV0VmFyaWFibGVDaGFuZ2UgPSB1c2VDYWxsYmFjaygoaW5wdXRWYXJpYWJsZTogc3RyaW5nIHwgVmFsdWVTZWxlY3RvcikgPT4ge1xuICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgIGluZGV4X2NodW5rX3ZhcmlhYmxlX3NlbGVjdG9yOiBBcnJheS5pc0FycmF5KGlucHV0VmFyaWFibGUpID8gaW5wdXRWYXJpYWJsZSA6IFtdLFxuICAgIH0pXG4gIH0sIFtoYW5kbGVOb2RlRGF0YVVwZGF0ZV0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVDaHVua1N0cnVjdHVyZUNoYW5nZSxcbiAgICBoYW5kbGVJbmRleE1ldGhvZENoYW5nZSxcbiAgICBoYW5kbGVLZXl3b3JkTnVtYmVyQ2hhbmdlLFxuICAgIGhhbmRsZUVtYmVkZGluZ01vZGVsQ2hhbmdlLFxuICAgIGhhbmRsZVJldHJpZXZhbFNlYXJjaE1ldGhvZENoYW5nZSxcbiAgICBoYW5kbGVIeWJyaWRTZWFyY2hNb2RlQ2hhbmdlLFxuICAgIGhhbmRsZVJlcmFua2luZ01vZGVsRW5hYmxlZENoYW5nZSxcbiAgICBoYW5kbGVXZWlnaGVkU2NvcmVDaGFuZ2UsXG4gICAgaGFuZGxlUmVyYW5raW5nTW9kZWxDaGFuZ2UsXG4gICAgaGFuZGxlVG9wS0NoYW5nZSxcbiAgICBoYW5kbGVTY29yZVRocmVzaG9sZENoYW5nZSxcbiAgICBoYW5kbGVTY29yZVRocmVzaG9sZEVuYWJsZWRDaGFuZ2UsXG4gICAgaGFuZGxlSW5wdXRWYXJpYWJsZUNoYW5nZSxcbiAgfVxufVxuIl19