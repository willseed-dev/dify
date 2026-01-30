"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonConfigPlaceHolder = exports.jsonObjectWrap = void 0;
exports.jsonObjectWrap = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
};
exports.jsonConfigPlaceHolder = JSON.stringify({
    type: 'object',
    properties: {
        foo: {
            type: 'string',
        },
        bar: {
            type: 'object',
            properties: {
                sub: {
                    type: 'number',
                },
            },
            required: [],
            additionalProperties: true,
        },
    },
    required: [],
    additionalProperties: true,
}, null, 2);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsY0FBYyxHQUFHO0lBQzVCLElBQUksRUFBRSxRQUFRO0lBQ2QsVUFBVSxFQUFFLEVBQUU7SUFDZCxRQUFRLEVBQUUsRUFBRTtJQUNaLG9CQUFvQixFQUFFLElBQUk7Q0FDM0IsQ0FBQTtBQUVZLFFBQUEscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FDakQ7SUFDRSxJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRTtRQUNWLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxRQUFRO1NBQ2Y7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUU7b0JBQ0gsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7YUFDRjtZQUNELFFBQVEsRUFBRSxFQUFFO1lBQ1osb0JBQW9CLEVBQUUsSUFBSTtTQUMzQjtLQUNGO0lBQ0QsUUFBUSxFQUFFLEVBQUU7SUFDWixvQkFBb0IsRUFBRSxJQUFJO0NBQzNCLEVBQ0QsSUFBSSxFQUNKLENBQUMsQ0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGpzb25PYmplY3RXcmFwID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge30sXG4gIHJlcXVpcmVkOiBbXSxcbiAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWUsXG59XG5cbmV4cG9ydCBjb25zdCBqc29uQ29uZmlnUGxhY2VIb2xkZXIgPSBKU09OLnN0cmluZ2lmeShcbiAge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIGZvbzoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIH0sXG4gICAgICBiYXI6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzdWI6IHtcbiAgICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVpcmVkOiBbXSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVxdWlyZWQ6IFtdLFxuICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiB0cnVlLFxuICB9LFxuICBudWxsLFxuICAyLFxuKVxuIl19