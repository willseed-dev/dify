"use strict";
/**
 * Utility functions for form data handling in trigger plugin components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMissingRequiredField = exports.deepSanitizeFormValues = exports.sanitizeFormValues = void 0;
/**
 * Sanitizes form values by converting null/undefined to empty strings
 * This ensures React form inputs don't receive null values which can cause warnings
 */
const sanitizeFormValues = (values) => {
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [
        key,
        value === null || value === undefined ? '' : String(value),
    ]));
};
exports.sanitizeFormValues = sanitizeFormValues;
/**
 * Deep sanitizes form values while preserving nested objects structure
 * Useful for complex form schemas with nested properties
 */
const deepSanitizeFormValues = (values, visited = new WeakSet()) => {
    if (visited.has(values))
        return {};
    visited.add(values);
    const result = {};
    for (const [key, value] of Object.entries(values)) {
        if (value === null || value === undefined)
            result[key] = '';
        else if (typeof value === 'object' && !Array.isArray(value))
            result[key] = (0, exports.deepSanitizeFormValues)(value, visited);
        else
            result[key] = value;
    }
    return result;
};
exports.deepSanitizeFormValues = deepSanitizeFormValues;
/**
 * Validates required fields in form data
 * Returns the first missing required field or null if all are present
 */
const findMissingRequiredField = (formData, requiredFields) => {
    for (const field of requiredFields) {
        if (!formData[field.name] || formData[field.name] === '')
            return field;
    }
    return null;
};
exports.findMissingRequiredField = findMissingRequiredField;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm9ybS1oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7R0FFRzs7O0FBRUg7OztHQUdHO0FBQ0ksTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE1BQTJCLEVBQTBCLEVBQUU7SUFDeEYsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUN2QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMzQyxHQUFHO1FBQ0gsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDM0QsQ0FBQyxDQUNILENBQUE7QUFDSCxDQUFDLENBQUE7QUFQWSxRQUFBLGtCQUFrQixzQkFPOUI7QUFFRDs7O0dBR0c7QUFDSSxNQUFNLHNCQUFzQixHQUFHLENBQUMsTUFBMkIsRUFBRSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsRUFBdUIsRUFBRTtJQUNsSCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sRUFBRSxDQUFBO0lBRVgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVuQixNQUFNLE1BQU0sR0FBd0IsRUFBRSxDQUFBO0lBRXRDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDbEQsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTO1lBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7YUFDYixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFBLDhCQUFzQixFQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTs7WUFFcEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtJQUN2QixDQUFDO0lBRUQsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDLENBQUE7QUFsQlksUUFBQSxzQkFBc0IsMEJBa0JsQztBQUVEOzs7R0FHRztBQUNJLE1BQU0sd0JBQXdCLEdBQUcsQ0FDdEMsUUFBNkIsRUFDN0IsY0FBbUQsRUFDZCxFQUFFO0lBQ3ZDLEtBQUssTUFBTSxLQUFLLElBQUksY0FBYyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3RELE9BQU8sS0FBSyxDQUFBO0lBQ2hCLENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQVRZLFFBQUEsd0JBQXdCLDRCQVNwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbnMgZm9yIGZvcm0gZGF0YSBoYW5kbGluZyBpbiB0cmlnZ2VyIHBsdWdpbiBjb21wb25lbnRzXG4gKi9cblxuLyoqXG4gKiBTYW5pdGl6ZXMgZm9ybSB2YWx1ZXMgYnkgY29udmVydGluZyBudWxsL3VuZGVmaW5lZCB0byBlbXB0eSBzdHJpbmdzXG4gKiBUaGlzIGVuc3VyZXMgUmVhY3QgZm9ybSBpbnB1dHMgZG9uJ3QgcmVjZWl2ZSBudWxsIHZhbHVlcyB3aGljaCBjYW4gY2F1c2Ugd2FybmluZ3NcbiAqL1xuZXhwb3J0IGNvbnN0IHNhbml0aXplRm9ybVZhbHVlcyA9ICh2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0+IHtcbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICBPYmplY3QuZW50cmllcyh2YWx1ZXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiBbXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcodmFsdWUpLFxuICAgIF0pLFxuICApXG59XG5cbi8qKlxuICogRGVlcCBzYW5pdGl6ZXMgZm9ybSB2YWx1ZXMgd2hpbGUgcHJlc2VydmluZyBuZXN0ZWQgb2JqZWN0cyBzdHJ1Y3R1cmVcbiAqIFVzZWZ1bCBmb3IgY29tcGxleCBmb3JtIHNjaGVtYXMgd2l0aCBuZXN0ZWQgcHJvcGVydGllc1xuICovXG5leHBvcnQgY29uc3QgZGVlcFNhbml0aXplRm9ybVZhbHVlcyA9ICh2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4sIHZpc2l0ZWQgPSBuZXcgV2Vha1NldCgpKTogUmVjb3JkPHN0cmluZywgYW55PiA9PiB7XG4gIGlmICh2aXNpdGVkLmhhcyh2YWx1ZXMpKVxuICAgIHJldHVybiB7fVxuXG4gIHZpc2l0ZWQuYWRkKHZhbHVlcylcblxuICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlcykpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgIHJlc3VsdFtrZXldID0gJydcbiAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICAgIHJlc3VsdFtrZXldID0gZGVlcFNhbml0aXplRm9ybVZhbHVlcyh2YWx1ZSwgdmlzaXRlZClcbiAgICBlbHNlXG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIHJlcXVpcmVkIGZpZWxkcyBpbiBmb3JtIGRhdGFcbiAqIFJldHVybnMgdGhlIGZpcnN0IG1pc3NpbmcgcmVxdWlyZWQgZmllbGQgb3IgbnVsbCBpZiBhbGwgYXJlIHByZXNlbnRcbiAqL1xuZXhwb3J0IGNvbnN0IGZpbmRNaXNzaW5nUmVxdWlyZWRGaWVsZCA9IChcbiAgZm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIHJlcXVpcmVkRmllbGRzOiBBcnJheTx7IG5hbWU6IHN0cmluZywgbGFiZWw6IGFueSB9Pixcbik6IHsgbmFtZTogc3RyaW5nLCBsYWJlbDogYW55IH0gfCBudWxsID0+IHtcbiAgZm9yIChjb25zdCBmaWVsZCBvZiByZXF1aXJlZEZpZWxkcykge1xuICAgIGlmICghZm9ybURhdGFbZmllbGQubmFtZV0gfHwgZm9ybURhdGFbZmllbGQubmFtZV0gPT09ICcnKVxuICAgICAgcmV0dXJuIGZpZWxkXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cbiJdfQ==