"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const types_1 = require("@/app/components/workflow/types");
const useSingleRunFormParams = ({ payload, runInputData, setRunInputData, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const query = runInputData.query;
    const setQuery = (0, react_1.useCallback)((newQuery) => {
        setRunInputData({
            ...runInputData,
            query: newQuery,
        });
    }, [runInputData, setRunInputData]);
    const forms = (0, react_1.useMemo)(() => {
        return [
            {
                inputs: [{
                        label: t('nodes.common.inputVars', { ns: 'workflow' }),
                        variable: 'query',
                        type: types_1.InputVarType.paragraph,
                        required: true,
                    }],
                values: { query },
                onChange: (keyValue) => setQuery(keyValue.query),
            },
        ];
    }, [query, setQuery, t]);
    const getDependentVars = () => {
        return [payload.index_chunk_variable_selector];
    };
    const getDependentVar = (variable) => {
        if (variable === 'query')
            return payload.index_chunk_variable_selector;
    };
    return {
        forms,
        getDependentVars,
        getDependentVar,
    };
};
exports.default = useSingleRunFormParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGlDQUE0QztBQUM1QyxpREFBOEM7QUFDOUMsMkRBQThEO0FBVTlELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxFQUM5QixPQUFPLEVBQ1AsWUFBWSxFQUNaLGVBQWUsR0FDUixFQUFFLEVBQUU7SUFDWCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQTtJQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7UUFDaEQsZUFBZSxDQUFDO1lBQ2QsR0FBRyxZQUFZO1lBQ2YsS0FBSyxFQUFFLFFBQVE7U0FDaEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7SUFFbkMsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ3pCLE9BQU87WUFDTDtnQkFDRSxNQUFNLEVBQUUsQ0FBQzt3QkFDUCxLQUFLLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO3dCQUN0RCxRQUFRLEVBQUUsT0FBTzt3QkFDakIsSUFBSSxFQUFFLG9CQUFZLENBQUMsU0FBUzt3QkFDNUIsUUFBUSxFQUFFLElBQUk7cUJBQ2YsQ0FBQztnQkFDRixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUU7Z0JBQ2pCLFFBQVEsRUFBRSxDQUFDLFFBQTZCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2FBQ3RFO1NBQ0YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUV4QixNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtRQUM1QixPQUFPLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFBO0lBQ0QsTUFBTSxlQUFlLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7UUFDM0MsSUFBSSxRQUFRLEtBQUssT0FBTztZQUN0QixPQUFPLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQTtJQUNoRCxDQUFDLENBQUE7SUFFRCxPQUFPO1FBQ0wsS0FBSztRQUNMLGdCQUFnQjtRQUNoQixlQUFlO0tBQ2hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxzQkFBc0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgS25vd2xlZGdlQmFzZU5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgSW5wdXRWYXIsIFZhcmlhYmxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBJbnB1dFZhclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG50eXBlIFBhcmFtcyA9IHtcbiAgaWQ6IHN0cmluZ1xuICBwYXlsb2FkOiBLbm93bGVkZ2VCYXNlTm9kZVR5cGVcbiAgcnVuSW5wdXREYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gIGdldElucHV0VmFyczogKHRleHRMaXN0OiBzdHJpbmdbXSkgPT4gSW5wdXRWYXJbXVxuICBzZXRSdW5JbnB1dERhdGE6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB2b2lkXG4gIHRvVmFySW5wdXRzOiAodmFyaWFibGVzOiBWYXJpYWJsZVtdKSA9PiBJbnB1dFZhcltdXG59XG5jb25zdCB1c2VTaW5nbGVSdW5Gb3JtUGFyYW1zID0gKHtcbiAgcGF5bG9hZCxcbiAgcnVuSW5wdXREYXRhLFxuICBzZXRSdW5JbnB1dERhdGEsXG59OiBQYXJhbXMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHF1ZXJ5ID0gcnVuSW5wdXREYXRhLnF1ZXJ5XG4gIGNvbnN0IHNldFF1ZXJ5ID0gdXNlQ2FsbGJhY2soKG5ld1F1ZXJ5OiBzdHJpbmcpID0+IHtcbiAgICBzZXRSdW5JbnB1dERhdGEoe1xuICAgICAgLi4ucnVuSW5wdXREYXRhLFxuICAgICAgcXVlcnk6IG5ld1F1ZXJ5LFxuICAgIH0pXG4gIH0sIFtydW5JbnB1dERhdGEsIHNldFJ1bklucHV0RGF0YV0pXG5cbiAgY29uc3QgZm9ybXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBpbnB1dHM6IFt7XG4gICAgICAgICAgbGFiZWw6IHQoJ25vZGVzLmNvbW1vbi5pbnB1dFZhcnMnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICAgIHZhcmlhYmxlOiAncXVlcnknLFxuICAgICAgICAgIHR5cGU6IElucHV0VmFyVHlwZS5wYXJhZ3JhcGgsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH1dLFxuICAgICAgICB2YWx1ZXM6IHsgcXVlcnkgfSxcbiAgICAgICAgb25DaGFuZ2U6IChrZXlWYWx1ZTogUmVjb3JkPHN0cmluZywgYW55PikgPT4gc2V0UXVlcnkoa2V5VmFsdWUucXVlcnkpLFxuICAgICAgfSxcbiAgICBdXG4gIH0sIFtxdWVyeSwgc2V0UXVlcnksIHRdKVxuXG4gIGNvbnN0IGdldERlcGVuZGVudFZhcnMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIFtwYXlsb2FkLmluZGV4X2NodW5rX3ZhcmlhYmxlX3NlbGVjdG9yXVxuICB9XG4gIGNvbnN0IGdldERlcGVuZGVudFZhciA9ICh2YXJpYWJsZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKHZhcmlhYmxlID09PSAncXVlcnknKVxuICAgICAgcmV0dXJuIHBheWxvYWQuaW5kZXhfY2h1bmtfdmFyaWFibGVfc2VsZWN0b3JcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZm9ybXMsXG4gICAgZ2V0RGVwZW5kZW50VmFycyxcbiAgICBnZXREZXBlbmRlbnRWYXIsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlU2luZ2xlUnVuRm9ybVBhcmFtc1xuIl19