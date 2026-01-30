"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertV1ToV2 = exports.getOperationItems = exports.formatOperationName = exports.checkNodeValid = void 0;
exports.isOperationItem = isOperationItem;
const types_1 = require("./types");
const checkNodeValid = (_payload) => {
    return true;
};
exports.checkNodeValid = checkNodeValid;
const formatOperationName = (type) => {
    if (type === 'over-write')
        return 'Overwrite';
    return type.charAt(0).toUpperCase() + type.slice(1);
};
exports.formatOperationName = formatOperationName;
function isOperationItem(item) {
    return item.value !== 'divider';
}
const getOperationItems = (assignedVarType, writeModeTypes, writeModeTypesArr, writeModeTypesNum) => {
    if (assignedVarType?.startsWith('array') && writeModeTypesArr) {
        return writeModeTypesArr.map(type => ({
            value: type,
            name: type,
        }));
    }
    if (assignedVarType === 'number' && writeModeTypes && writeModeTypesNum) {
        return [
            ...writeModeTypes.map(type => ({
                value: type,
                name: type,
            })),
            { value: 'divider', name: 'divider' },
            ...writeModeTypesNum.map(type => ({
                value: type,
                name: type,
            })),
        ];
    }
    if (writeModeTypes && ['string', 'boolean', 'object'].includes(assignedVarType || '')) {
        return writeModeTypes.map(type => ({
            value: type,
            name: type,
        }));
    }
    return [];
};
exports.getOperationItems = getOperationItems;
const convertOldWriteMode = (oldMode) => {
    switch (oldMode) {
        case 'over-write':
            return types_1.WriteMode.overwrite;
        case 'append':
            return types_1.WriteMode.append;
        case 'clear':
            return types_1.WriteMode.clear;
        default:
            return types_1.WriteMode.overwrite;
    }
};
const convertV1ToV2 = (payload) => {
    if (payload.version === '2' && payload.items)
        return payload;
    return {
        version: '2',
        items: [{
                variable_selector: payload.assigned_variable_selector || [],
                input_type: types_1.AssignerNodeInputType.variable,
                operation: convertOldWriteMode(payload.write_mode),
                value: payload.input_variable_selector || [],
            }],
        ...payload,
    };
};
exports.convertV1ToV2 = convertV1ToV2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFvQkEsMENBRUM7QUFwQkQsbUNBQTBEO0FBRW5ELE1BQU0sY0FBYyxHQUFHLENBQUMsUUFBMEIsRUFBRSxFQUFFO0lBQzNELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBRlksUUFBQSxjQUFjLGtCQUUxQjtBQUVNLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtJQUNsRCxJQUFJLElBQUksS0FBSyxZQUFZO1FBQ3ZCLE9BQU8sV0FBVyxDQUFBO0lBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JELENBQUMsQ0FBQTtBQUpZLFFBQUEsbUJBQW1CLHVCQUkvQjtBQVFELFNBQWdCLGVBQWUsQ0FBQyxJQUFVO0lBQ3hDLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUE7QUFDakMsQ0FBQztBQUVNLE1BQU0saUJBQWlCLEdBQUcsQ0FDL0IsZUFBd0IsRUFDeEIsY0FBNEIsRUFDNUIsaUJBQStCLEVBQy9CLGlCQUErQixFQUN2QixFQUFFO0lBQ1YsSUFBSSxlQUFlLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDOUQsT0FBTyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxJQUFJLGVBQWUsS0FBSyxRQUFRLElBQUksY0FBYyxJQUFJLGlCQUFpQixFQUFFLENBQUM7UUFDeEUsT0FBTztZQUNMLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdCLEtBQUssRUFBRSxJQUFJO2dCQUNYLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQVU7WUFDN0MsR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxJQUFJLEVBQUUsSUFBSTthQUNYLENBQUMsQ0FBQztTQUNKLENBQUE7SUFDSCxDQUFDO0lBRUQsSUFBSSxjQUFjLElBQUksQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN0RixPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssRUFBRSxJQUFJO1lBQ1gsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxPQUFPLEVBQUUsQ0FBQTtBQUNYLENBQUMsQ0FBQTtBQW5DWSxRQUFBLGlCQUFpQixxQkFtQzdCO0FBRUQsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLE9BQWUsRUFBYSxFQUFFO0lBQ3pELFFBQVEsT0FBTyxFQUFFLENBQUM7UUFDaEIsS0FBSyxZQUFZO1lBQ2YsT0FBTyxpQkFBUyxDQUFDLFNBQVMsQ0FBQTtRQUM1QixLQUFLLFFBQVE7WUFDWCxPQUFPLGlCQUFTLENBQUMsTUFBTSxDQUFBO1FBQ3pCLEtBQUssT0FBTztZQUNWLE9BQU8saUJBQVMsQ0FBQyxLQUFLLENBQUE7UUFDeEI7WUFDRSxPQUFPLGlCQUFTLENBQUMsU0FBUyxDQUFBO0lBQzlCLENBQUM7QUFDSCxDQUFDLENBQUE7QUFFTSxNQUFNLGFBQWEsR0FBRyxDQUFDLE9BQVksRUFBb0IsRUFBRTtJQUM5RCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLO1FBQzFDLE9BQU8sT0FBMkIsQ0FBQTtJQUVwQyxPQUFPO1FBQ0wsT0FBTyxFQUFFLEdBQUc7UUFDWixLQUFLLEVBQUUsQ0FBQztnQkFDTixpQkFBaUIsRUFBRSxPQUFPLENBQUMsMEJBQTBCLElBQUksRUFBRTtnQkFDM0QsVUFBVSxFQUFFLDZCQUFxQixDQUFDLFFBQVE7Z0JBQzFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2dCQUNsRCxLQUFLLEVBQUUsT0FBTyxDQUFDLHVCQUF1QixJQUFJLEVBQUU7YUFDN0MsQ0FBQztRQUNGLEdBQUcsT0FBTztLQUNYLENBQUE7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLGFBQWEsaUJBY3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBc3NpZ25lck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgSTE4bktleXNCeVByZWZpeCB9IGZyb20gJ0AvdHlwZXMvaTE4bidcbmltcG9ydCB7IEFzc2lnbmVyTm9kZUlucHV0VHlwZSwgV3JpdGVNb2RlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IGNoZWNrTm9kZVZhbGlkID0gKF9wYXlsb2FkOiBBc3NpZ25lck5vZGVUeXBlKSA9PiB7XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRPcGVyYXRpb25OYW1lID0gKHR5cGU6IHN0cmluZykgPT4ge1xuICBpZiAodHlwZSA9PT0gJ292ZXItd3JpdGUnKVxuICAgIHJldHVybiAnT3ZlcndyaXRlJ1xuICByZXR1cm4gdHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR5cGUuc2xpY2UoMSlcbn1cblxuZXhwb3J0IHR5cGUgT3BlcmF0aW9uTmFtZSA9IEkxOG5LZXlzQnlQcmVmaXg8J3dvcmtmbG93JywgJ25vZGVzLmFzc2lnbmVyLm9wZXJhdGlvbnMuJz5cblxuZXhwb3J0IHR5cGUgSXRlbVxuICA9IHwgeyB2YWx1ZTogJ2RpdmlkZXInLCBuYW1lOiAnZGl2aWRlcicgfVxuICAgIHwgeyB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyLCBuYW1lOiBPcGVyYXRpb25OYW1lIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT3BlcmF0aW9uSXRlbShpdGVtOiBJdGVtKTogaXRlbSBpcyB7IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIsIG5hbWU6IE9wZXJhdGlvbk5hbWUgfSB7XG4gIHJldHVybiBpdGVtLnZhbHVlICE9PSAnZGl2aWRlcidcbn1cblxuZXhwb3J0IGNvbnN0IGdldE9wZXJhdGlvbkl0ZW1zID0gKFxuICBhc3NpZ25lZFZhclR5cGU/OiBzdHJpbmcsXG4gIHdyaXRlTW9kZVR5cGVzPzogV3JpdGVNb2RlW10sXG4gIHdyaXRlTW9kZVR5cGVzQXJyPzogV3JpdGVNb2RlW10sXG4gIHdyaXRlTW9kZVR5cGVzTnVtPzogV3JpdGVNb2RlW10sXG4pOiBJdGVtW10gPT4ge1xuICBpZiAoYXNzaWduZWRWYXJUeXBlPy5zdGFydHNXaXRoKCdhcnJheScpICYmIHdyaXRlTW9kZVR5cGVzQXJyKSB7XG4gICAgcmV0dXJuIHdyaXRlTW9kZVR5cGVzQXJyLm1hcCh0eXBlID0+ICh7XG4gICAgICB2YWx1ZTogdHlwZSxcbiAgICAgIG5hbWU6IHR5cGUsXG4gICAgfSkpXG4gIH1cblxuICBpZiAoYXNzaWduZWRWYXJUeXBlID09PSAnbnVtYmVyJyAmJiB3cml0ZU1vZGVUeXBlcyAmJiB3cml0ZU1vZGVUeXBlc051bSkge1xuICAgIHJldHVybiBbXG4gICAgICAuLi53cml0ZU1vZGVUeXBlcy5tYXAodHlwZSA9PiAoe1xuICAgICAgICB2YWx1ZTogdHlwZSxcbiAgICAgICAgbmFtZTogdHlwZSxcbiAgICAgIH0pKSxcbiAgICAgIHsgdmFsdWU6ICdkaXZpZGVyJywgbmFtZTogJ2RpdmlkZXInIH0gYXMgSXRlbSxcbiAgICAgIC4uLndyaXRlTW9kZVR5cGVzTnVtLm1hcCh0eXBlID0+ICh7XG4gICAgICAgIHZhbHVlOiB0eXBlLFxuICAgICAgICBuYW1lOiB0eXBlLFxuICAgICAgfSkpLFxuICAgIF1cbiAgfVxuXG4gIGlmICh3cml0ZU1vZGVUeXBlcyAmJiBbJ3N0cmluZycsICdib29sZWFuJywgJ29iamVjdCddLmluY2x1ZGVzKGFzc2lnbmVkVmFyVHlwZSB8fCAnJykpIHtcbiAgICByZXR1cm4gd3JpdGVNb2RlVHlwZXMubWFwKHR5cGUgPT4gKHtcbiAgICAgIHZhbHVlOiB0eXBlLFxuICAgICAgbmFtZTogdHlwZSxcbiAgICB9KSlcbiAgfVxuXG4gIHJldHVybiBbXVxufVxuXG5jb25zdCBjb252ZXJ0T2xkV3JpdGVNb2RlID0gKG9sZE1vZGU6IHN0cmluZyk6IFdyaXRlTW9kZSA9PiB7XG4gIHN3aXRjaCAob2xkTW9kZSkge1xuICAgIGNhc2UgJ292ZXItd3JpdGUnOlxuICAgICAgcmV0dXJuIFdyaXRlTW9kZS5vdmVyd3JpdGVcbiAgICBjYXNlICdhcHBlbmQnOlxuICAgICAgcmV0dXJuIFdyaXRlTW9kZS5hcHBlbmRcbiAgICBjYXNlICdjbGVhcic6XG4gICAgICByZXR1cm4gV3JpdGVNb2RlLmNsZWFyXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBXcml0ZU1vZGUub3ZlcndyaXRlXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbnZlcnRWMVRvVjIgPSAocGF5bG9hZDogYW55KTogQXNzaWduZXJOb2RlVHlwZSA9PiB7XG4gIGlmIChwYXlsb2FkLnZlcnNpb24gPT09ICcyJyAmJiBwYXlsb2FkLml0ZW1zKVxuICAgIHJldHVybiBwYXlsb2FkIGFzIEFzc2lnbmVyTm9kZVR5cGVcblxuICByZXR1cm4ge1xuICAgIHZlcnNpb246ICcyJyxcbiAgICBpdGVtczogW3tcbiAgICAgIHZhcmlhYmxlX3NlbGVjdG9yOiBwYXlsb2FkLmFzc2lnbmVkX3ZhcmlhYmxlX3NlbGVjdG9yIHx8IFtdLFxuICAgICAgaW5wdXRfdHlwZTogQXNzaWduZXJOb2RlSW5wdXRUeXBlLnZhcmlhYmxlLFxuICAgICAgb3BlcmF0aW9uOiBjb252ZXJ0T2xkV3JpdGVNb2RlKHBheWxvYWQud3JpdGVfbW9kZSksXG4gICAgICB2YWx1ZTogcGF5bG9hZC5pbnB1dF92YXJpYWJsZV9zZWxlY3RvciB8fCBbXSxcbiAgICB9XSxcbiAgICAuLi5wYXlsb2FkLFxuICB9XG59XG4iXX0=