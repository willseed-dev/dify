"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_schema_type_1 = require("./match-schema-type");
describe('match the schema type', () => {
    it('should return true for identical primitive types', () => {
        expect((0, match_schema_type_1.default)({ type: 'string' }, { type: 'string' })).toBe(true);
        expect((0, match_schema_type_1.default)({ type: 'number' }, { type: 'number' })).toBe(true);
    });
    it('should return false for different primitive types', () => {
        expect((0, match_schema_type_1.default)({ type: 'string' }, { type: 'number' })).toBe(false);
    });
    it('should ignore values and only compare types', () => {
        expect((0, match_schema_type_1.default)({ type: 'string', value: 'hello' }, { type: 'string', value: 'world' })).toBe(true);
        expect((0, match_schema_type_1.default)({ type: 'number', value: 42 }, { type: 'number', value: 100 })).toBe(true);
    });
    it('should return true for structural differences but no types', () => {
        expect((0, match_schema_type_1.default)({ type: 'string', other: { b: 'xxx' } }, { type: 'string', other: 'xxx' })).toBe(true);
        expect((0, match_schema_type_1.default)({ type: 'string', other: { b: 'xxx' } }, { type: 'string' })).toBe(true);
    });
    it('should handle nested objects with same structure and types', () => {
        const obj1 = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' },
                address: {
                    type: 'object',
                    properties: {
                        street: { type: 'string' },
                        city: { type: 'string' },
                    },
                },
            },
        };
        const obj2 = {
            type: 'object',
            properties: {
                name: { type: 'string', value: 'Alice' },
                age: { type: 'number', value: 30 },
                address: {
                    type: 'object',
                    properties: {
                        street: { type: 'string', value: '123 Main St' },
                        city: { type: 'string', value: 'Wonderland' },
                    },
                },
            },
        };
        expect((0, match_schema_type_1.default)(obj1, obj2)).toBe(true);
    });
    it('should return false for nested objects with different structures', () => {
        const obj1 = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' },
            },
        };
        const obj2 = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                address: { type: 'string' },
            },
        };
        expect((0, match_schema_type_1.default)(obj1, obj2)).toBe(false);
    });
    it('file struct should match file type', () => {
        const fileSchema = {
            $id: 'https://dify.ai/schemas/v1/file.json',
            $schema: 'http://json-schema.org/draft-07/schema#',
            version: '1.0.0',
            type: 'object',
            title: 'File Schema',
            description: 'Schema for file objects (v1)',
            properties: {
                name: {
                    type: 'string',
                    description: 'file name',
                },
                size: {
                    type: 'number',
                    description: 'file size',
                },
                extension: {
                    type: 'string',
                    description: 'file extension',
                },
                type: {
                    type: 'string',
                    description: 'file type',
                },
                mime_type: {
                    type: 'string',
                    description: 'file mime type',
                },
                transfer_method: {
                    type: 'string',
                    description: 'file transfer method',
                },
                url: {
                    type: 'string',
                    description: 'file url',
                },
                related_id: {
                    type: 'string',
                    description: 'file related id',
                },
            },
            required: [
                'name',
            ],
        };
        const file = {
            type: 'object',
            title: 'File',
            description: 'Schema for file objects (v1)',
            properties: {
                name: {
                    type: 'string',
                    description: 'file name',
                },
                size: {
                    type: 'number',
                    description: 'file size',
                },
                extension: {
                    type: 'string',
                    description: 'file extension',
                },
                type: {
                    type: 'string',
                    description: 'file type',
                },
                mime_type: {
                    type: 'string',
                    description: 'file mime type',
                },
                transfer_method: {
                    type: 'string',
                    description: 'file transfer method',
                },
                url: {
                    type: 'string',
                    description: 'file url',
                },
                related_id: {
                    type: 'string',
                    description: 'file related id',
                },
            },
            required: [
                'name',
            ],
        };
        expect((0, match_schema_type_1.default)(fileSchema, file)).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtc2NoZW1hLXR5cGUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hdGNoLXNjaGVtYS10eXBlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyREFBb0Q7QUFFcEQsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtJQUNyQyxFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzFELE1BQU0sQ0FBQyxJQUFBLDJCQUFrQixFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDN0UsTUFBTSxDQUFDLElBQUEsMkJBQWtCLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvRSxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxtREFBbUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxDQUFDLElBQUEsMkJBQWtCLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoRixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsTUFBTSxDQUFDLElBQUEsMkJBQWtCLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDN0csTUFBTSxDQUFD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QUssRUFBRSxNQUFNO1lBQ2IsV0FBVyxFQUFFLDhCQUE4QjtZQUMzQyxVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxRQUFRO29CQUNkLFdBQVcsRUFBRSxXQUFXO2lCQUN6QjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxXQUFXLEVBQUUsZ0JBQWdCO2lCQUM5QjtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxXQUFXLEVBQUUsZ0JBQWdCO2lCQUM5QjtnQkFDRCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLHNCQUFzQjtpQkFDcEM7Z0JBQ0QsR0FBRyxFQUFFO29CQUNILElBQUksRUFBRSxRQUFRO29CQUNkLFdBQVcsRUFBRSxVQUFVO2lCQUN4QjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsV0FBVyxFQUFFLGlCQUFpQjtpQkFDL0I7YUFDRjtZQUNELFFBQVEsRUFBRTtnQkFDUixNQUFNO2FBQ1A7U0FDRixDQUFBO1FBQ0QsTUFBTSxDQUFDLElBQUEsMkJBQWtCLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3pELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWF0Y2hUaGVTY2hlbWFUeXBlIGZyb20gJy4vbWF0Y2gtc2NoZW1hLXR5cGUnXG5cbmRlc2NyaWJlKCdtYXRjaCB0aGUgc2NoZW1hIHR5cGUnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIGlkZW50aWNhbCBwcmltaXRpdmUgdHlwZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1hdGNoVGhlU2NoZW1hVHlwZSh7IHR5cGU6ICdzdHJpbmcnIH0sIHsgdHlwZTogJ3N0cmluZycgfSkpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QobWF0Y2hUaGVTY2hlbWFUeXBlKHsgdHlwZTogJ251bWJlcicgfSwgeyB0eXBlOiAnbnVtYmVyJyB9KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBkaWZmZXJlbnQgcHJpbWl0aXZlIHR5cGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdChtYXRjaFRoZVNjaGVtYVR5cGUoeyB0eXBlOiAnc3RyaW5nJyB9LCB7IHR5cGU6ICdudW1iZXInIH0pKS50b0JlKGZhbHNlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaWdub3JlIHZhbHVlcyBhbmQgb25seSBjb21wYXJlIHR5cGVzJywgKCkgPT4ge1xuICAgIGV4cGVjdChtYXRjaFRoZVNjaGVtYVR5cGUoeyB0eXBlOiAnc3RyaW5nJywgdmFsdWU6ICdoZWxsbycgfSwgeyB0eXBlOiAnc3RyaW5nJywgdmFsdWU6ICd3b3JsZCcgfSkpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QobWF0Y2hUaGVTY2hlbWFUeXBlKHsgdHlwZTogJ251bWJlcicsIHZhbHVlOiA0MiB9LCB7IHR5cGU6ICdudW1iZXInLCB2YWx1ZTogMTAwIH0pKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3Igc3RydWN0dXJhbCBkaWZmZXJlbmNlcyBidXQgbm8gdHlwZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KG1hdGNoVGhlU2NoZW1hVHlwZSh7IHR5cGU6ICdzdHJpbmcnLCBvdGhlcjogeyBiOiAneHh4JyB9IH0sIHsgdHlwZTogJ3N0cmluZycsIG90aGVyOiAneHh4JyB9KSkudG9CZSh0cnVlKVxuICAgIGV4cGVjdChtYXRjaFRoZVNjaGVtYVR5cGUoeyB0eXBlOiAnc3RyaW5nJywgb3RoZXI6IHsgYjogJ3h4eCcgfSB9LCB7IHR5cGU6ICdzdHJpbmcnIH0pKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIG9iamVjdHMgd2l0aCBzYW1lIHN0cnVjdHVyZSBhbmQgdHlwZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgb2JqMSA9IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBuYW1lOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIGFnZTogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgICAgICBhZGRyZXNzOiB7XG4gICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgc3RyZWV0OiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICBjaXR5OiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICAgIGNvbnN0IG9iajIgPSB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbmFtZTogeyB0eXBlOiAnc3RyaW5nJywgdmFsdWU6ICdBbGljZScgfSxcbiAgICAgICAgYWdlOiB7IHR5cGU6ICdudW1iZXInLCB2YWx1ZTogMzAgfSxcbiAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHN0cmVldDogeyB0eXBlOiAnc3RyaW5nJywgdmFsdWU6ICcxMjMgTWFpbiBTdCcgfSxcbiAgICAgICAgICAgIGNpdHk6IHsgdHlwZTogJ3N0cmluZycsIHZhbHVlOiAnV29uZGVybGFuZCcgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9XG4gICAgZXhwZWN0KG1hdGNoVGhlU2NoZW1hVHlwZShvYmoxLCBvYmoyKSkudG9CZSh0cnVlKVxuICB9KVxuICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3IgbmVzdGVkIG9iamVjdHMgd2l0aCBkaWZmZXJlbnQgc3RydWN0dXJlcycsICgpID0+IHtcbiAgICBjb25zdCBvYmoxID0ge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgYWdlOiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgICB9LFxuICAgIH1cbiAgICBjb25zdCBvYmoyID0ge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgYWRkcmVzczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgfSxcbiAgICB9XG4gICAgZXhwZWN0KG1hdGNoVGhlU2NoZW1hVHlwZShvYmoxLCBvYmoyKSkudG9CZShmYWxzZSlcbiAgfSlcblxuICBpdCgnZmlsZSBzdHJ1Y3Qgc2hvdWxkIG1hdGNoIGZpbGUgdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBmaWxlU2NoZW1hID0ge1xuICAgICAgJGlkOiAnaHR0cHM6Ly9kaWZ5LmFpL3NjaGVtYXMvdjEvZmlsZS5qc29uJyxcbiAgICAgICRzY2hlbWE6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA3L3NjaGVtYSMnLFxuICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgdGl0bGU6ICdGaWxlIFNjaGVtYScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1NjaGVtYSBmb3IgZmlsZSBvYmplY3RzICh2MSknLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIG5hbWUnLFxuICAgICAgICB9LFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIHNpemUnLFxuICAgICAgICB9LFxuICAgICAgICBleHRlbnNpb246IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgZXh0ZW5zaW9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSB0eXBlJyxcbiAgICAgICAgfSxcbiAgICAgICAgbWltZV90eXBlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIG1pbWUgdHlwZScsXG4gICAgICAgIH0sXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSB0cmFuc2ZlciBtZXRob2QnLFxuICAgICAgICB9LFxuICAgICAgICB1cmw6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgdXJsJyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVsYXRlZF9pZDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSByZWxhdGVkIGlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZXF1aXJlZDogW1xuICAgICAgICAnbmFtZScsXG4gICAgICBdLFxuICAgIH1cbiAgICBjb25zdCBmaWxlID0ge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICB0aXRsZTogJ0ZpbGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIGZpbGUgb2JqZWN0cyAodjEpJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBuYW1lJyxcbiAgICAgICAgfSxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBzaXplJyxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0ZW5zaW9uOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIGV4dGVuc2lvbicsXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgdHlwZScsXG4gICAgICAgIH0sXG4gICAgICAgIG1pbWVfdHlwZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnZmlsZSBtaW1lIHR5cGUnLFxuICAgICAgICB9LFxuICAgICAgICB0cmFuc2Zlcl9tZXRob2Q6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgdHJhbnNmZXIgbWV0aG9kJyxcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdmaWxlIHVybCcsXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGF0ZWRfaWQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGUgcmVsYXRlZCBpZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVxdWlyZWQ6IFtcbiAgICAgICAgJ25hbWUnLFxuICAgICAgXSxcbiAgICB9XG4gICAgZXhwZWN0KG1hdGNoVGhlU2NoZW1hVHlwZShmaWxlU2NoZW1hLCBmaWxlKSkudG9CZSh0cnVlKVxuICB9KVxufSlcbiJdfQ==