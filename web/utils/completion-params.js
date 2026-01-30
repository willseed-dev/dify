"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndMergeValidCompletionParams = exports.mergeValidCompletionParams = void 0;
const mergeValidCompletionParams = (oldParams, rules, isAdvancedMode = false) => {
    if (!oldParams || Object.keys(oldParams).length === 0)
        return { params: {}, removedDetails: {} };
    const ruleMap = {};
    rules.forEach((r) => {
        ruleMap[r.name] = r;
    });
    const nextParams = {};
    const removedDetails = {};
    Object.entries(oldParams).forEach(([key, value]) => {
        if (key === 'stop' && isAdvancedMode) {
            // keep stop in advanced mode
            nextParams[key] = value;
            return;
        }
        const rule = ruleMap[key];
        if (!rule) {
            removedDetails[key] = 'unsupported';
            return;
        }
        switch (rule.type) {
            case 'int':
            case 'float': {
                if (typeof value !== 'number') {
                    removedDetails[key] = 'invalid type';
                    return;
                }
                const min = rule.min ?? Number.NEGATIVE_INFINITY;
                const max = rule.max ?? Number.POSITIVE_INFINITY;
                if (value < min || value > max) {
                    removedDetails[key] = `out of range (${min}-${max})`;
                    return;
                }
                nextParams[key] = value;
                return;
            }
            case 'boolean': {
                if (typeof value !== 'boolean') {
                    removedDetails[key] = 'invalid type';
                    return;
                }
                nextParams[key] = value;
                return;
            }
            case 'string':
            case 'text': {
                if (typeof value !== 'string') {
                    removedDetails[key] = 'invalid type';
                    return;
                }
                if (Array.isArray(rule.options) && rule.options.length) {
                    if (!rule.options.includes(value)) {
                        removedDetails[key] = 'unsupported option';
                        return;
                    }
                }
                nextParams[key] = value;
                return;
            }
            default: {
                removedDetails[key] = `unsupported rule type: ${rule?.type ?? 'unknown'}`;
            }
        }
    });
    return { params: nextParams, removedDetails };
};
exports.mergeValidCompletionParams = mergeValidCompletionParams;
const fetchAndMergeValidCompletionParams = async (provider, modelId, oldParams, isAdvancedMode = false) => {
    const { fetchModelParameterRules } = await Promise.resolve().then(() => require('@/service/common'));
    const url = `/workspaces/current/model-providers/${provider}/models/parameter-rules?model=${modelId}`;
    const { data: parameterRules } = await fetchModelParameterRules(url);
    return (0, exports.mergeValidCompletionParams)(oldParams, parameterRules ?? [], isAdvancedMode);
};
exports.fetchAndMergeValidCompletionParams = fetchAndMergeValidCompletionParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGlvbi1wYXJhbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wbGV0aW9uLXBhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLDBCQUEwQixHQUFHLENBQ3hDLFNBQWdDLEVBQ2hDLEtBQTJCLEVBQzNCLGlCQUEwQixLQUFLLEVBQ2dDLEVBQUU7SUFDakUsSUFBSSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUUzQyxNQUFNLE9BQU8sR0FBdUMsRUFBRSxDQUFBO0lBQ3RELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNyQixDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sVUFBVSxHQUFjLEVBQUUsQ0FBQTtJQUNoQyxNQUFNLGNBQWMsR0FBMkIsRUFBRSxDQUFBO0lBRWpELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtRQUNqRCxJQUFJLEdBQUcsS0FBSyxNQUFNLElBQUksY0FBYyxFQUFFLENBQUM7WUFDckMsNkJBQTZCO1lBQzdCLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7WUFDdkIsT0FBTTtRQUNSLENBQUM7UUFDRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDekIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1YsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQTtZQUNuQyxPQUFNO1FBQ1IsQ0FBQztRQUVELFFB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c0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGb3JtVmFsdWUsIE1vZGVsUGFyYW1ldGVyUnVsZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcblxuZXhwb3J0IGNvbnN0IG1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zID0gKFxuICBvbGRQYXJhbXM6IEZvcm1WYWx1ZSB8IHVuZGVmaW5lZCxcbiAgcnVsZXM6IE1vZGVsUGFyYW1ldGVyUnVsZVtdLFxuICBpc0FkdmFuY2VkTW9kZTogYm9vbGVhbiA9IGZhbHNlLFxuKTogeyBwYXJhbXM6IEZvcm1WYWx1ZSwgcmVtb3ZlZERldGFpbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9PiB7XG4gIGlmICghb2xkUGFyYW1zIHx8IE9iamVjdC5rZXlzKG9sZFBhcmFtcykubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB7IHBhcmFtczoge30sIHJlbW92ZWREZXRhaWxzOiB7fSB9XG5cbiAgY29uc3QgcnVsZU1hcDogUmVjb3JkPHN0cmluZywgTW9kZWxQYXJhbWV0ZXJSdWxlPiA9IHt9XG4gIHJ1bGVzLmZvckVhY2goKHIpID0+IHtcbiAgICBydWxlTWFwW3IubmFtZV0gPSByXG4gIH0pXG5cbiAgY29uc3QgbmV4dFBhcmFtczogRm9ybVZhbHVlID0ge31cbiAgY29uc3QgcmVtb3ZlZERldGFpbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxuXG4gIE9iamVjdC5lbnRyaWVzKG9sZFBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKGtleSA9PT0gJ3N0b3AnICYmIGlzQWR2YW5jZWRNb2RlKSB7XG4gICAgICAvLyBrZWVwIHN0b3AgaW4gYWR2YW5jZWQgbW9kZVxuICAgICAgbmV4dFBhcmFtc1trZXldID0gdmFsdWVcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBydWxlID0gcnVsZU1hcFtrZXldXG4gICAgaWYgKCFydWxlKSB7XG4gICAgICByZW1vdmVkRGV0YWlsc1trZXldID0gJ3Vuc3VwcG9ydGVkJ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3dpdGNoIChydWxlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ludCc6XG4gICAgICBjYXNlICdmbG9hdCc6IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICByZW1vdmVkRGV0YWlsc1trZXldID0gJ2ludmFsaWQgdHlwZSdcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtaW4gPSBydWxlLm1pbiA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFlcbiAgICAgICAgY29uc3QgbWF4ID0gcnVsZS5tYXggPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXG4gICAgICAgIGlmICh2YWx1ZSA8IG1pbiB8fCB2YWx1ZSA+IG1heCkge1xuICAgICAgICAgIHJlbW92ZWREZXRhaWxzW2tleV0gPSBgb3V0IG9mIHJhbmdlICgke21pbn0tJHttYXh9KWBcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBuZXh0UGFyYW1zW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgICAgIHJlbW92ZWREZXRhaWxzW2tleV0gPSAnaW52YWxpZCB0eXBlJ1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIG5leHRQYXJhbXNba2V5XSA9IHZhbHVlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3RleHQnOiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVtb3ZlZERldGFpbHNba2V5XSA9ICdpbnZhbGlkIHR5cGUnXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocnVsZS5vcHRpb25zKSAmJiBydWxlLm9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKCEocnVsZS5vcHRpb25zIGFzIHN0cmluZ1tdKS5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlbW92ZWREZXRhaWxzW2tleV0gPSAndW5zdXBwb3J0ZWQgb3B0aW9uJ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5leHRQYXJhbXNba2V5XSA9IHZhbHVlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZGVmYXVsdDoge1xuICAgICAgICByZW1vdmVkRGV0YWlsc1trZXldID0gYHVuc3VwcG9ydGVkIHJ1bGUgdHlwZTogJHsocnVsZSBhcyBhbnkpPy50eXBlID8/ICd1bmtub3duJ31gXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiB7IHBhcmFtczogbmV4dFBhcmFtcywgcmVtb3ZlZERldGFpbHMgfVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hBbmRNZXJnZVZhbGlkQ29tcGxldGlvblBhcmFtcyA9IGFzeW5jIChcbiAgcHJvdmlkZXI6IHN0cmluZyxcbiAgbW9kZWxJZDogc3RyaW5nLFxuICBvbGRQYXJhbXM6IEZvcm1WYWx1ZSB8IHVuZGVmaW5lZCxcbiAgaXNBZHZhbmNlZE1vZGU6IGJvb2xlYW4gPSBmYWxzZSxcbik6IFByb21pc2U8eyBwYXJhbXM6IEZvcm1WYWx1ZSwgcmVtb3ZlZERldGFpbHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfT4gPT4ge1xuICBjb25zdCB7IGZldGNoTW9kZWxQYXJhbWV0ZXJSdWxlcyB9ID0gYXdhaXQgaW1wb3J0KCdAL3NlcnZpY2UvY29tbW9uJylcbiAgY29uc3QgdXJsID0gYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L21vZGVscy9wYXJhbWV0ZXItcnVsZXM/bW9kZWw9JHttb2RlbElkfWBcbiAgY29uc3QgeyBkYXRhOiBwYXJhbWV0ZXJSdWxlcyB9ID0gYXdhaXQgZmV0Y2hNb2RlbFBhcmFtZXRlclJ1bGVzKHVybClcbiAgcmV0dXJuIG1lcmdlVmFsaWRDb21wbGV0aW9uUGFyYW1zKG9sZFBhcmFtcywgcGFyYW1ldGVyUnVsZXMgPz8gW10sIGlzQWR2YW5jZWRNb2RlKVxufVxuIl19