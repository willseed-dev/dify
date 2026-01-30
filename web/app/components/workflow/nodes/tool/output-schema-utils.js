"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVarType = exports.pickItemSchema = exports.normalizeJsonSchemaType = void 0;
const types_1 = require("@/app/components/workflow/types");
const use_match_schema_type_1 = require("../_base/components/variable/use-match-schema-type");
/**
 * Normalizes a JSON Schema type to a simple string type.
 * Handles complex schemas with oneOf, anyOf, allOf.
 */
const normalizeJsonSchemaType = (schema) => {
    if (!schema)
        return undefined;
    const { type, properties, items, oneOf, anyOf, allOf } = schema;
    if (Array.isArray(type))
        return type.find((item) => item && item !== 'null') || type[0];
    if (typeof type === 'string')
        return type;
    const compositeCandidates = [oneOf, anyOf, allOf]
        .filter((entry) => Array.isArray(entry))
        .flat();
    for (const candidate of compositeCandidates) {
        const normalized = (0, exports.normalizeJsonSchemaType)(candidate);
        if (normalized)
            return normalized;
    }
    if (properties)
        return 'object';
    if (items)
        return 'array';
    return undefined;
};
exports.normalizeJsonSchemaType = normalizeJsonSchemaType;
/**
 * Extracts the items schema from an array schema.
 */
const pickItemSchema = (schema) => {
    if (!schema || !schema.items)
        return undefined;
    return Array.isArray(schema.items) ? schema.items[0] : schema.items;
};
exports.pickItemSchema = pickItemSchema;
/**
 * Resolves a JSON Schema to a VarType enum value.
 * Properly handles array types by inspecting item types.
 */
const resolveVarType = (schema, schemaTypeDefinitions) => {
    const schemaType = (0, use_match_schema_type_1.getMatchedSchemaType)(schema, schemaTypeDefinitions);
    const normalizedType = (0, exports.normalizeJsonSchemaType)(schema);
    switch (normalizedType) {
        case 'string':
            return { type: types_1.VarType.string, schemaType };
        case 'number':
            return { type: types_1.VarType.number, schemaType };
        case 'integer':
            return { type: types_1.VarType.integer, schemaType };
        case 'boolean':
            return { type: types_1.VarType.boolean, schemaType };
        case 'object':
            if (schemaType === 'file')
                return { type: types_1.VarType.file, schemaType };
            return { type: types_1.VarType.object, schemaType };
        case 'array': {
            const itemSchema = (0, exports.pickItemSchema)(schema);
            if (!itemSchema)
                return { type: types_1.VarType.array, schemaType };
            const { type: itemType, schemaType: itemSchemaType } = (0, exports.resolveVarType)(itemSchema, schemaTypeDefinitions);
            const resolvedSchemaType = schemaType || itemSchemaType;
            if (itemSchemaType === 'file')
                return { type: types_1.VarType.arrayFile, schemaType: resolvedSchemaType };
            switch (itemType) {
                case types_1.VarType.string:
                    return { type: types_1.VarType.arrayString, schemaType: resolvedSchemaType };
                case types_1.VarType.number:
                case types_1.VarType.integer:
                    return { type: types_1.VarType.arrayNumber, schemaType: resolvedSchemaType };
                case types_1.VarType.boolean:
                    return { type: types_1.VarType.arrayBoolean, schemaType: resolvedSchemaType };
                case types_1.VarType.object:
                    return { type: types_1.VarType.arrayObject, schemaType: resolvedSchemaType };
                case types_1.VarType.file:
                    return { type: types_1.VarType.arrayFile, schemaType: resolvedSchemaType };
                default:
                    return { type: types_1.VarType.array, schemaType: resolvedSchemaType };
            }
        }
        default:
            return { type: types_1.VarType.any, schemaType };
    }
};
exports.resolveVarType = resolveVarType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LXNjaGVtYS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm91dHB1dC1zY2hlbWEtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkRBQXlEO0FBQ3pELDhGQUF5RjtBQUV6Rjs7O0dBR0c7QUFDSSxNQUFNLHVCQUF1QixHQUFHLENBQUMsTUFBVyxFQUFzQixFQUFFO0lBQ3pFLElBQUksQ0FBQyxNQUFNO1FBQ1QsT0FBTyxTQUFTLENBQUE7SUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFBO0lBRS9ELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBbUIsRUFBRSxFQUFFLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFL0UsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzFCLE9BQU8sSUFBSSxDQUFBO0lBRWIsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO1NBQzlDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBa0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkQsSUFBSSxFQUFFLENBQUE7SUFFVCxLQUFLLE1BQU0sU0FBUyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxTQUFTLENBQUMsQ0FBQTtRQUNyRCxJQUFJLFVBQVU7WUFDWixPQUFPLFVBQVUsQ0FBQTtJQUNyQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxRQUFRLENBQUE7SUFFakIsSUFBSSxLQUFLO1FBQ1As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QWtCLEVBQUUsQ0FBQTtnQkFDdkUsS0FBSyxlQUFPLENBQUMsTUFBTTtvQkFDakIsT0FBTyxFQUFFLElBQUksRUFBRSxlQUFPLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxDQUFBO2dCQUN0RSxLQUFLLGVBQU8sQ0FBQyxJQUFJO29CQUNmLE9BQU8sRUFBRSxJQUFJLEVBQUUsZUFBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQTtnQkFDcEU7b0JBQ0UsT0FBTyxFQUFFLElBQUksRUFBRSxlQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxDQUFBO1lBQ2xFLENBQUM7UUFDSCxDQUFDO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGVBQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFLENBQUE7SUFDNUMsQ0FBQztBQUNILENBQUMsQ0FBQTtBQWxEWSxRQUFBLGNBQWMsa0JBa0QxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2NoZW1hVHlwZURlZmluaXRpb24gfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IFZhclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgZ2V0TWF0Y2hlZFNjaGVtYVR5cGUgfSBmcm9tICcuLi9fYmFzZS9jb21wb25lbnRzL3ZhcmlhYmxlL3VzZS1tYXRjaC1zY2hlbWEtdHlwZSdcblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgSlNPTiBTY2hlbWEgdHlwZSB0byBhIHNpbXBsZSBzdHJpbmcgdHlwZS5cbiAqIEhhbmRsZXMgY29tcGxleCBzY2hlbWFzIHdpdGggb25lT2YsIGFueU9mLCBhbGxPZi5cbiAqL1xuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlID0gKHNjaGVtYTogYW55KTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKCFzY2hlbWEpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICBjb25zdCB7IHR5cGUsIHByb3BlcnRpZXMsIGl0ZW1zLCBvbmVPZiwgYW55T2YsIGFsbE9mIH0gPSBzY2hlbWFcblxuICBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSlcbiAgICByZXR1cm4gdHlwZS5maW5kKChpdGVtOiBzdHJpbmcgfCBudWxsKSA9PiBpdGVtICYmIGl0ZW0gIT09ICdudWxsJykgfHwgdHlwZVswXVxuXG4gIGlmICh0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIHR5cGVcblxuICBjb25zdCBjb21wb3NpdGVDYW5kaWRhdGVzID0gW29uZU9mLCBhbnlPZiwgYWxsT2ZdXG4gICAgLmZpbHRlcigoZW50cnkpOiBlbnRyeSBpcyBhbnlbXSA9PiBBcnJheS5pc0FycmF5KGVudHJ5KSlcbiAgICAuZmxhdCgpXG5cbiAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgY29tcG9zaXRlQ2FuZGlkYXRlcykge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBub3JtYWxpemVKc29uU2NoZW1hVHlwZShjYW5kaWRhdGUpXG4gICAgaWYgKG5vcm1hbGl6ZWQpXG4gICAgICByZXR1cm4gbm9ybWFsaXplZFxuICB9XG5cbiAgaWYgKHByb3BlcnRpZXMpXG4gICAgcmV0dXJuICdvYmplY3QnXG5cbiAgaWYgKGl0ZW1zKVxuICAgIHJldHVybiAnYXJyYXknXG5cbiAgcmV0dXJuIHVuZGVmaW5lZFxufVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBpdGVtcyBzY2hlbWEgZnJvbSBhbiBhcnJheSBzY2hlbWEuXG4gKi9cbmV4cG9ydCBjb25zdCBwaWNrSXRlbVNjaGVtYSA9IChzY2hlbWE6IGFueSkgPT4ge1xuICBpZiAoIXNjaGVtYSB8fCAhc2NoZW1hLml0ZW1zKVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoc2NoZW1hLml0ZW1zKSA/IHNjaGVtYS5pdGVtc1swXSA6IHNjaGVtYS5pdGVtc1xufVxuXG4vKipcbiAqIFJlc29sdmVzIGEgSlNPTiBTY2hlbWEgdG8gYSBWYXJUeXBlIGVudW0gdmFsdWUuXG4gKiBQcm9wZXJseSBoYW5kbGVzIGFycmF5IHR5cGVzIGJ5IGluc3BlY3RpbmcgaXRlbSB0eXBlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlc29sdmVWYXJUeXBlID0gKFxuICBzY2hlbWE6IGFueSxcbiAgc2NoZW1hVHlwZURlZmluaXRpb25zPzogU2NoZW1hVHlwZURlZmluaXRpb25bXSxcbik6IHsgdHlwZTogVmFyVHlwZSwgc2NoZW1hVHlwZT86IHN0cmluZyB9ID0+IHtcbiAgY29uc3Qgc2NoZW1hVHlwZSA9IGdldE1hdGNoZWRTY2hlbWFUeXBlKHNjaGVtYSwgc2NoZW1hVHlwZURlZmluaXRpb25zKVxuICBjb25zdCBub3JtYWxpemVkVHlwZSA9IG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHNjaGVtYSlcblxuICBzd2l0Y2ggKG5vcm1hbGl6ZWRUeXBlKSB7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiB7IHR5cGU6IFZhclR5cGUuc3RyaW5nLCBzY2hlbWFUeXBlIH1cbiAgICBjYXNlICdudW1iZXInOlxuICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5udW1iZXIsIHNjaGVtYVR5cGUgfVxuICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5pbnRlZ2VyLCBzY2hlbWFUeXBlIH1cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB7IHR5cGU6IFZhclR5cGUuYm9vbGVhbiwgc2NoZW1hVHlwZSB9XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGlmIChzY2hlbWFUeXBlID09PSAnZmlsZScpXG4gICAgICAgIHJldHVybiB7IHR5cGU6IFZhclR5cGUuZmlsZSwgc2NoZW1hVHlwZSB9XG4gICAgICByZXR1cm4geyB0eXBlOiBWYXJUeXBlLm9iamVjdCwgc2NoZW1hVHlwZSB9XG4gICAgY2FzZSAnYXJyYXknOiB7XG4gICAgICBjb25zdCBpdGVtU2NoZW1hID0gcGlja0l0ZW1TY2hlbWEoc2NoZW1hKVxuICAgICAgaWYgKCFpdGVtU2NoZW1hKVxuICAgICAgICByZXR1cm4geyB0eXBlOiBWYXJUeXBlLmFycmF5LCBzY2hlbWFUeXBlIH1cblxuICAgICAgY29uc3QgeyB0eXBlOiBpdGVtVHlwZSwgc2NoZW1hVHlwZTogaXRlbVNjaGVtYVR5cGUgfSA9IHJlc29sdmVWYXJUeXBlKGl0ZW1TY2hlbWEsIHNjaGVtYVR5cGVEZWZpbml0aW9ucylcbiAgICAgIGNvbnN0IHJlc29sdmVkU2NoZW1hVHlwZSA9IHNjaGVtYVR5cGUgfHwgaXRlbVNjaGVtYVR5cGVcblxuICAgICAgaWYgKGl0ZW1TY2hlbWFUeXBlID09PSAnZmlsZScpXG4gICAgICAgIHJldHVybiB7IHR5cGU6IFZhclR5cGUuYXJyYXlGaWxlLCBzY2hlbWFUeXBlOiByZXNvbHZlZFNjaGVtYVR5cGUgfVxuXG4gICAgICBzd2l0Y2ggKGl0ZW1UeXBlKSB7XG4gICAgICAgIGNhc2UgVmFyVHlwZS5zdHJpbmc6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheVN0cmluZywgc2NoZW1hVHlwZTogcmVzb2x2ZWRTY2hlbWFUeXBlIH1cbiAgICAgICAgY2FzZSBWYXJUeXBlLm51bWJlcjpcbiAgICAgICAgY2FzZSBWYXJUeXBlLmludGVnZXI6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheU51bWJlciwgc2NoZW1hVHlwZTogcmVzb2x2ZWRTY2hlbWFUeXBlIH1cbiAgICAgICAgY2FzZSBWYXJUeXBlLmJvb2xlYW46XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheUJvb2xlYW4sIHNjaGVtYVR5cGU6IHJlc29sdmVkU2NoZW1hVHlwZSB9XG4gICAgICAgIGNhc2UgVmFyVHlwZS5vYmplY3Q6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheU9iamVjdCwgc2NoZW1hVHlwZTogcmVzb2x2ZWRTY2hlbWFUeXBlIH1cbiAgICAgICAgY2FzZSBWYXJUeXBlLmZpbGU6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheUZpbGUsIHNjaGVtYVR5cGU6IHJlc29sdmVkU2NoZW1hVHlwZSB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogVmFyVHlwZS5hcnJheSwgc2NoZW1hVHlwZTogcmVzb2x2ZWRTY2hlbWFUeXBlIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB7IHR5cGU6IFZhclR5cGUuYW55LCBzY2hlbWFUeXBlIH1cbiAgfVxufVxuIl19