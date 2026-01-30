"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const workflow_1 = require("@/app/components/base/icons/src/vender/workflow");
const types_1 = require("@/app/components/workflow/types");
const IterationLogTrigger = ({ nodeInfo, allExecutions, onShowIterationResultList, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const filterNodesForInstance = (key) => {
        if (!allExecutions)
            return [];
        const parallelNodes = allExecutions.filter(exec => exec.execution_metadata?.parallel_mode_run_id === key);
        if (parallelNodes.length > 0)
            return parallelNodes;
        const serialIndex = Number.parseInt(key, 10);
        if (!isNaN(serialIndex)) {
            const serialNodes = allExecutions.filter(exec => exec.execution_metadata?.iteration_id === nodeInfo.node_id
                && exec.execution_metadata?.iteration_index === serialIndex);
            if (serialNodes.length > 0)
                return serialNodes;
        }
        return [];
    };
    const handleOnShowIterationDetail = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const iterationNodeMeta = nodeInfo.execution_metadata;
        const iterDurationMap = nodeInfo?.iterDurationMap || iterationNodeMeta?.iteration_duration_map || {};
        let structuredList = [];
        if (iterationNodeMeta?.iteration_duration_map) {
            const instanceKeys = Object.keys(iterationNodeMeta.iteration_duration_map);
            structuredList = instanceKeys
                .map(key => filterNodesForInstance(key))
                .filter(branchNodes => branchNodes.length > 0);
            // Also include failed iterations that might not be in duration map
            if (allExecutions && nodeInfo.details?.length) {
                const existingIterationIndices = new Set();
                structuredList.forEach((iteration) => {
                    iteration.forEach((node) => {
                        if (node.execution_metadata?.iteration_index !== undefined)
                            existingIterationIndices.add(node.execution_metadata.iteration_index);
                    });
                });
                // Find failed iterations that are not in the structured list
                nodeInfo.details.forEach((iteration, index) => {
                    if (!existingIterationIndices.has(index) && iteration.some(node => node.status === types_1.NodeRunningStatus.Failed))
                        structuredList.push(iteration);
                });
                // Sort by iteration index to maintain order
                structuredList.sort((a, b) => {
                    const aIndex = a[0]?.execution_metadata?.iteration_index ?? 0;
                    const bIndex = b[0]?.execution_metadata?.iteration_index ?? 0;
                    return aIndex - bIndex;
                });
            }
        }
        else if (nodeInfo.details?.length) {
            structuredList = nodeInfo.details;
        }
        onShowIterationResultList(structuredList, iterDurationMap);
    };
    let displayIterationCount = 0;
    const iterMap = nodeInfo.execution_metadata?.iteration_duration_map;
    if (iterMap)
        displayIterationCount = Object.keys(iterMap).length;
    else if (nodeInfo.details?.length)
        displayIterationCount = nodeInfo.details.length;
    else if (nodeInfo.metadata?.iterator_length)
        displayIterationCount = nodeInfo.metadata.iterator_length;
    const getErrorCount = (details, iterationNodeMeta) => {
        if (!details || details.length === 0)
            return 0;
        // Use Set to track failed iteration indices to avoid duplicate counting
        const failedIterationIndices = new Set();
        // Collect failed iteration indices from details
        details.forEach((iteration, index) => {
            if (iteration.some(item => item.status === types_1.NodeRunningStatus.Failed)) {
                // Try to get iteration index from first node, fallback to array index
                const iterationIndex = iteration[0]?.execution_metadata?.iteration_index ?? index;
                failedIterationIndices.add(iterationIndex);
            }
        });
        // If allExecutions exists, check for additional failed iterations
        if (iterationNodeMeta?.iteration_duration_map && allExecutions) {
            // Find all failed iteration nodes
            allExecutions.forEach((exec) => {
                if (exec.execution_metadata?.iteration_id === nodeInfo.node_id
                    && exec.status === types_1.NodeRunningStatus.Failed
                    && exec.execution_metadata?.iteration_index !== undefined) {
                    failedIterationIndices.add(exec.execution_metadata.iteration_index);
                }
            });
        }
        return failedIterationIndices.size;
    };
    const errorCount = getErrorCount(nodeInfo.details, nodeInfo.execution_metadata);
    return (<button_1.default className="flex w-full cursor-pointer items-center gap-2 self-stretch rounded-lg border-none bg-components-button-tertiary-bg-hover px-3 py-2 hover:bg-components-button-tertiary-bg-hover" onClick={handleOnShowIterationDetail}>
      <workflow_1.Iteration className="h-4 w-4 shrink-0 text-components-button-tertiary-text"/>
      <div className="system-sm-medium flex-1 text-left text-components-button-tertiary-text">
        {t('nodes.iteration.iteration', { ns: 'workflow', count: displayIterationCount })}
        {errorCount > 0 && (<>
            {t('nodes.iteration.comma', { ns: 'workflow' })}
            {t('nodes.iteration.error', { ns: 'workflow', count: errorCount })}
          </>)}
      </div>
      <react_1.RiArrowRightSLine className="h-4 w-4 shrink-0 text-components-button-tertiary-text"/>
    </button_1.default>);
};
exports.default = IterationLogTrigger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmF0aW9uLWxvZy10cmlnZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlcmF0aW9uLWxvZy10cmlnZ2VyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDRDQUFvRDtBQUNwRCxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELDhFQUEyRTtBQUMzRSwyREFBbUU7QUFPbkUsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEVBQzNCLFFBQVEsRUFDUixhQUFhLEVBQ2IseUJBQXlCLEdBQ0EsRUFBRSxFQUFFO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLHNCQUFzQixHQUFHLENBQUMsR0FBVyxFQUFpQixFQUFFO1FBQzVELElBQUksQ0FBQyxhQUFhO1lBQ2hCLE9BQU8sRUFBRSxDQUFBO1FBRVgsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNoRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsb0JBQW9CLEtBQUssR0FBRyxDQUN0RCxDQUFBO1FBQ0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDMUIsT0FBTyxhQUFhLENBQUE7UUFFdEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO1lBQ3hCLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDOUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksS0FBSyxRQUFRLENBQUMsT0FBTzttQkFDdkQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLGVBQWUsS0FBSyxXQUFXLENBQzVELENBQUE7WUFDRCxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDeEIsT0FBTyxXQUFX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QSxFQUFFLGdCQUFNLENBQUMsQ0FDVixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsbUJBQW1CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIEl0ZXJhdGlvbkR1cmF0aW9uTWFwLFxuICBOb2RlVHJhY2luZyxcbn0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IFJpQXJyb3dSaWdodFNMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB7IEl0ZXJhdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL3dvcmtmbG93J1xuaW1wb3J0IHsgTm9kZVJ1bm5pbmdTdGF0dXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG50eXBlIEl0ZXJhdGlvbkxvZ1RyaWdnZXJQcm9wcyA9IHtcbiAgbm9kZUluZm86IE5vZGVUcmFjaW5nXG4gIGFsbEV4ZWN1dGlvbnM/OiBOb2RlVHJhY2luZ1tdXG4gIG9uU2hvd0l0ZXJhdGlvblJlc3VsdExpc3Q6IChpdGVyYXRpb25SZXN1bHRMaXN0OiBOb2RlVHJhY2luZ1tdW10sIGl0ZXJhdGlvblJlc3VsdER1cmF0aW9uTWFwOiBJdGVyYXRpb25EdXJhdGlvbk1hcCkgPT4gdm9pZFxufVxuY29uc3QgSXRlcmF0aW9uTG9nVHJpZ2dlciA9ICh7XG4gIG5vZGVJbmZvLFxuICBhbGxFeGVjdXRpb25zLFxuICBvblNob3dJdGVyYXRpb25SZXN1bHRMaXN0LFxufTogSXRlcmF0aW9uTG9nVHJpZ2dlclByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuXG4gIGNvbnN0IGZpbHRlck5vZGVzRm9ySW5zdGFuY2UgPSAoa2V5OiBzdHJpbmcpOiBOb2RlVHJhY2luZ1tdID0+IHtcbiAgICBpZiAoIWFsbEV4ZWN1dGlvbnMpXG4gICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IHBhcmFsbGVsTm9kZXMgPSBhbGxFeGVjdXRpb25zLmZpbHRlcihleGVjID0+XG4gICAgICBleGVjLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfbW9kZV9ydW5faWQgPT09IGtleSxcbiAgICApXG4gICAgaWYgKHBhcmFsbGVsTm9kZXMubGVuZ3RoID4gMClcbiAgICAgIHJldHVybiBwYXJhbGxlbE5vZGVzXG5cbiAgICBjb25zdCBzZXJpYWxJbmRleCA9IE51bWJlci5wYXJzZUludChrZXksIDEwKVxuICAgIGlmICghaXNOYU4oc2VyaWFsSW5kZXgpKSB7XG4gICAgICBjb25zdCBzZXJpYWxOb2RlcyA9IGFsbEV4ZWN1dGlvbnMuZmlsdGVyKGV4ZWMgPT5cbiAgICAgICAgZXhlYy5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pZCA9PT0gbm9kZUluZm8ubm9kZV9pZFxuICAgICAgICAmJiBleGVjLmV4ZWN1dGlvbl9tZXRhZGF0YT8uaXRlcmF0aW9uX2luZGV4ID09PSBzZXJpYWxJbmRleCxcbiAgICAgIClcbiAgICAgIGlmIChzZXJpYWxOb2Rlcy5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gc2VyaWFsTm9kZXNcbiAgICB9XG5cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGNvbnN0IGhhbmRsZU9uU2hvd0l0ZXJhdGlvbkRldGFpbCA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxCdXR0b25FbGVtZW50PikgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICBlLm5hdGl2ZUV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG5cbiAgICBjb25zdCBpdGVyYXRpb25Ob2RlTWV0YSA9IG5vZGVJbmZvLmV4ZWN1dGlvbl9tZXRhZGF0YVxuICAgIGNvbnN0IGl0ZXJEdXJhdGlvbk1hcCA9IG5vZGVJbmZvPy5pdGVyRHVyYXRpb25NYXAgfHwgaXRlcmF0aW9uTm9kZU1ldGE/Lml0ZXJhdGlvbl9kdXJhdGlvbl9tYXAgfHwge31cblxuICAgIGxldCBzdHJ1Y3R1cmVkTGlzdDogTm9kZVRyYWNpbmdbXVtdID0gW11cbiAgICBpZiAoaXRlcmF0aW9uTm9kZU1ldGE/Lml0ZXJhdGlvbl9kdXJhdGlvbl9tYXApIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlS2V5cyA9IE9iamVjdC5rZXlzKGl0ZXJhdGlvbk5vZGVNZXRhLml0ZXJhdGlvbl9kdXJhdGlvbl9tYXApXG4gICAgICBzdHJ1Y3R1cmVkTGlzdCA9IGluc3RhbmNlS2V5c1xuICAgICAgICAubWFwKGtleSA9PiBmaWx0ZXJOb2Rlc0Zvckluc3RhbmNlKGtleSkpXG4gICAgICAgIC5maWx0ZXIoYnJhbmNoTm9kZXMgPT4gYnJhbmNoTm9kZXMubGVuZ3RoID4gMClcblxuICAgICAgLy8gQWxzbyBpbmNsdWRlIGZhaWxlZCBpdGVyYXRpb25zIHRoYXQgbWlnaHQgbm90IGJlIGluIGR1cmF0aW9uIG1hcFxuICAgICAgaWYgKGFsbEV4ZWN1dGlvbnMgJiYgbm9kZUluZm8uZGV0YWlscz8ubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSXRlcmF0aW9uSW5kaWNlcyA9IG5ldyBTZXQ8bnVtYmVyPigpXG4gICAgICAgIHN0cnVjdHVyZWRMaXN0LmZvckVhY2goKGl0ZXJhdGlvbikgPT4ge1xuICAgICAgICAgIGl0ZXJhdGlvbi5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pbmRleCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICBleGlzdGluZ0l0ZXJhdGlvbkluZGljZXMuYWRkKG5vZGUuZXhlY3V0aW9uX21ldGFkYXRhLml0ZXJhdGlvbl9pbmRleClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEZpbmQgZmFpbGVkIGl0ZXJhdGlvbnMgdGhhdCBhcmUgbm90IGluIHRoZSBzdHJ1Y3R1cmVkIGxpc3RcbiAgICAgICAgbm9kZUluZm8uZGV0YWlscy5mb3JFYWNoKChpdGVyYXRpb24sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYgKCFleGlzdGluZ0l0ZXJhdGlvbkluZGljZXMuaGFzKGluZGV4KSAmJiBpdGVyYXRpb24uc29tZShub2RlID0+IG5vZGUuc3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5GYWlsZWQpKVxuICAgICAgICAgICAgc3RydWN0dXJlZExpc3QucHVzaChpdGVyYXRpb24pXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gU29ydCBieSBpdGVyYXRpb24gaW5kZXggdG8gbWFpbnRhaW4gb3JkZXJcbiAgICAgICAgc3RydWN0dXJlZExpc3Quc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGNvbnN0IGFJbmRleCA9IGFbMF0/LmV4ZWN1dGlvbl9tZXRhZGF0YT8uaXRlcmF0aW9uX2luZGV4ID8/IDBcbiAgICAgICAgICBjb25zdCBiSW5kZXggPSBiWzBdPy5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pbmRleCA/PyAwXG4gICAgICAgICAgcmV0dXJuIGFJbmRleCAtIGJJbmRleFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChub2RlSW5mby5kZXRhaWxzPy5sZW5ndGgpIHtcbiAgICAgIHN0cnVjdHVyZWRMaXN0ID0gbm9kZUluZm8uZGV0YWlsc1xuICAgIH1cblxuICAgIG9uU2hvd0l0ZXJhdGlvblJlc3VsdExpc3Qoc3RydWN0dXJlZExpc3QsIGl0ZXJEdXJhdGlvbk1hcClcbiAgfVxuXG4gIGxldCBkaXNwbGF5SXRlcmF0aW9uQ291bnQgPSAwXG4gIGNvbnN0IGl0ZXJNYXAgPSBub2RlSW5mby5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9kdXJhdGlvbl9tYXBcbiAgaWYgKGl0ZXJNYXApXG4gICAgZGlzcGxheUl0ZXJhdGlvbkNvdW50ID0gT2JqZWN0LmtleXMoaXRlck1hcCkubGVuZ3RoXG4gIGVsc2UgaWYgKG5vZGVJbmZvLmRldGFpbHM/Lmxlbmd0aClcbiAgICBkaXNwbGF5SXRlcmF0aW9uQ291bnQgPSBub2RlSW5mby5kZXRhaWxzLmxlbmd0aFxuICBlbHNlIGlmIChub2RlSW5mby5tZXRhZGF0YT8uaXRlcmF0b3JfbGVuZ3RoKVxuICAgIGRpc3BsYXlJdGVyYXRpb25Db3VudCA9IG5vZGVJbmZvLm1ldGFkYXRhLml0ZXJhdG9yX2xlbmd0aFxuXG4gIGNvbnN0IGdldEVycm9yQ291bnQgPSAoZGV0YWlsczogTm9kZVRyYWNpbmdbXVtdIHwgdW5kZWZpbmVkLCBpdGVyYXRpb25Ob2RlTWV0YT86IGFueSkgPT4ge1xuICAgIGlmICghZGV0YWlscyB8fCBkZXRhaWxzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiAwXG5cbiAgICAvLyBVc2UgU2V0IHRvIHRyYWNrIGZhaWxlZCBpdGVyYXRpb24gaW5kaWNlcyB0byBhdm9pZCBkdXBsaWNhdGUgY291bnRpbmdcbiAgICBjb25zdCBmYWlsZWRJdGVyYXRpb25JbmRpY2VzID0gbmV3IFNldDxudW1iZXI+KClcblxuICAgIC8vIENvbGxlY3QgZmFpbGVkIGl0ZXJhdGlvbiBpbmRpY2VzIGZyb20gZGV0YWlsc1xuICAgIGRldGFpbHMuZm9yRWFjaCgoaXRlcmF0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGl0ZXJhdGlvbi5zb21lKGl0ZW0gPT4gaXRlbS5zdGF0dXMgPT09IE5vZGVSdW5uaW5nU3RhdHVzLkZhaWxlZCkpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGdldCBpdGVyYXRpb24gaW5kZXggZnJvbSBmaXJzdCBub2RlLCBmYWxsYmFjayB0byBhcnJheSBpbmRleFxuICAgICAgICBjb25zdCBpdGVyYXRpb25JbmRleCA9IGl0ZXJhdGlvblswXT8uZXhlY3V0aW9uX21ldGFkYXRhPy5pdGVyYXRpb25faW5kZXggPz8gaW5kZXhcbiAgICAgICAgZmFpbGVkSXRlcmF0aW9uSW5kaWNlcy5hZGQoaXRlcmF0aW9uSW5kZXgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIElmIGFsbEV4ZWN1dGlvbnMgZXhpc3RzLCBjaGVjayBmb3IgYWRkaXRpb25hbCBmYWlsZWQgaXRlcmF0aW9uc1xuICAgIGlmIChpdGVyYXRpb25Ob2RlTWV0YT8uaXRlcmF0aW9uX2R1cmF0aW9uX21hcCAmJiBhbGxFeGVjdXRpb25zKSB7XG4gICAgICAvLyBGaW5kIGFsbCBmYWlsZWQgaXRlcmF0aW9uIG5vZGVzXG4gICAgICBhbGxFeGVjdXRpb25zLmZvckVhY2goKGV4ZWMpID0+IHtcbiAgICAgICAgaWYgKGV4ZWMuZXhlY3V0aW9uX21ldGFkYXRhPy5pdGVyYXRpb25faWQgPT09IG5vZGVJbmZvLm5vZGVfaWRcbiAgICAgICAgICAmJiBleGVjLnN0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuRmFpbGVkXG4gICAgICAgICAgJiYgZXhlYy5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZmFpbGVkSXRlcmF0aW9uSW5kaWNlcy5hZGQoZXhlYy5leGVjdXRpb25fbWV0YWRhdGEuaXRlcmF0aW9uX2luZGV4KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBmYWlsZWRJdGVyYXRpb25JbmRpY2VzLnNpemVcbiAgfVxuICBjb25zdCBlcnJvckNvdW50ID0gZ2V0RXJyb3JDb3VudChub2RlSW5mby5kZXRhaWxzLCBub2RlSW5mby5leGVjdXRpb25fbWV0YWRhdGEpXG5cbiAgcmV0dXJuIChcbiAgICA8QnV0dG9uXG4gICAgICBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLTIgc2VsZi1zdHJldGNoIHJvdW5kZWQtbGcgYm9yZGVyLW5vbmUgYmctY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktYmctaG92ZXIgcHgtMyBweS0yIGhvdmVyOmJnLWNvbXBvbmVudHMtYnV0dG9uLXRlcnRpYXJ5LWJnLWhvdmVyXCJcbiAgICAgIG9uQ2xpY2s9e2hhbmRsZU9uU2hvd0l0ZXJhdGlvbkRldGFpbH1cbiAgICA+XG4gICAgICA8SXRlcmF0aW9uIGNsYXNzTmFtZT1cImgtNCB3LTQgc2hyaW5rLTAgdGV4dC1jb21wb25lbnRzLWJ1dHRvbi10ZXJ0aWFyeS10ZXh0XCIgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBmbGV4LTEgdGV4dC1sZWZ0IHRleHQtY29tcG9uZW50cy1idXR0b24tdGVydGlhcnktdGV4dFwiPlxuICAgICAgICB7dCgnbm9kZXMuaXRlcmF0aW9uLml0ZXJhdGlvbicsIHsgbnM6ICd3b3JrZmxvdycsIGNvdW50OiBkaXNwbGF5SXRlcmF0aW9uQ291bnQgfSl9XG4gICAgICAgIHtlcnJvckNvdW50ID4gMCAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIHt0KCdub2Rlcy5pdGVyYXRpb24uY29tbWEnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgICAgICAge3QoJ25vZGVzLml0ZXJhdGlvbi5lcnJvcicsIHsgbnM6ICd3b3JrZmxvdycsIGNvdW50OiBlcnJvckNvdW50IH0pfVxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgICA8UmlBcnJvd1JpZ2h0U0xpbmUgY2xhc3NOYW1lPVwiaC00IHctNCBzaHJpbmstMCB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXRlcnRpYXJ5LXRleHRcIiAvPlxuICAgIDwvQnV0dG9uPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEl0ZXJhdGlvbkxvZ1RyaWdnZXJcbiJdfQ==