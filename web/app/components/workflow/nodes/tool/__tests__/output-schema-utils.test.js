"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const output_schema_utils_1 = require("../output-schema-utils");
// Mock the getMatchedSchemaType dependency
vi.mock('../../_base/components/variable/use-match-schema-type', () => ({
    getMatchedSchemaType: (schema) => {
        // Return schema_type or schemaType if present
        return schema?.schema_type || schema?.schemaType || undefined;
    },
}));
describe('output-schema-utils', () => {
    describe('normalizeJsonSchemaType', () => {
        it('should return undefined for null or undefined schema', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)(null)).toBeUndefined();
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)(undefined)).toBeUndefined();
        });
        it('should return the type directly for simple string type', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'string' })).toBe('string');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'number' })).toBe('number');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'boolean' })).toBe('boolean');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'object' })).toBe('object');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'array' })).toBe('array');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: 'integer' })).toBe('integer');
        });
        it('should handle array type with nullable (e.g., ["string", "null"])', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: ['string', 'null'] })).toBe('string');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: ['null', 'number'] })).toBe('number');
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({ type: ['object', 'null'] })).toBe('object');
        });
        it('should handle oneOf schema', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({
                oneOf: [
                    { type: 'string' },
                    { type: 'null' },
                ],
            })).toBe('string');
        });
        it('should handle anyOf schema', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({
                anyOf: [
                    { type: 'number' },
                    { type: 'null' },
                ],
            })).toBe('number');
        });
        it('should handle allOf schema', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({
                allOf: [
                    { type: 'object' },
                ],
            })).toBe('object');
        });
        it('should infer object type from properties', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({
                properties: {
                    name: { type: 'string' },
                },
            })).toBe('object');
        });
        it('should infer array type from items', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({
                items: { type: 'string' },
            })).toBe('array');
        });
        it('should return undefined for empty schema', () => {
            expect((0, output_schema_utils_1.normalizeJsonSchemaType)({})).toBeUndefined();
        });
    });
    describe('pickItemSchema', () => {
        it('should return undefined for null or undefined schema', () => {
            expect((0, output_schema_utils_1.pickItemSchema)(null)).toBeUndefined();
            expect((0, output_schema_utils_1.pickItemSchema)(undefined)).toBeUndefined();
        });
        it('should return undefined if no items property', () => {
            expect((0, output_schema_utils_1.pickItemSchema)({ type: 'array' })).toBeUndefined();
            expect((0, output_schema_utils_1.pickItemSchema)({})).toBeUndefined();
        });
        it('should return items directly if items is an object', () => {
            const itemSchema = { type: 'string' };
            expect((0, output_schema_utils_1.pickItemSchema)({ items: itemSchema })).toBe(itemSchema);
        });
        it('should return first item if items is an array (tuple schema)', () => {
            const firstItem = { type: 'string' };
            const secondItem = { type: 'number' };
            expect((0, output_schema_utils_1.pickItemSchema)({ items: [firstItem, secondItem] })).toBe(firstItem);
        });
    });
    describe('resolveVarType', () => {
        describe('primitive types', () => {
            it('should resolve string type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'string' });
                expect(result.type).toBe(types_1.VarType.string);
            });
            it('should resolve number type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'number' });
                expect(result.type).toBe(types_1.VarType.number);
            });
            it('should resolve integer type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'integer' });
                expect(result.type).toBe(types_1.VarType.integer);
            });
            it('should resolve boolean type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'boolean' });
                expect(result.type).toBe(types_1.VarType.boolean);
            });
            it('should resolve object type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'object' });
                expect(result.type).toBe(types_1.VarType.object);
            });
        });
        describe('array types', () => {
            it('should resolve array of strings to arrayString', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: { type: 'string' },
                });
                expect(result.type).toBe(types_1.VarType.arrayString);
            });
            it('should resolve array of numbers to arrayNumber', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: { type: 'number' },
                });
                expect(result.type).toBe(types_1.VarType.arrayNumber);
            });
            it('should resolve array of integers to arrayNumber', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: { type: 'integer' },
                });
                expect(result.type).toBe(types_1.VarType.arrayNumber);
            });
            it('should resolve array of booleans to arrayBoolean', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: { type: 'boolean' },
                });
                expect(result.type).toBe(types_1.VarType.arrayBoolean);
            });
            it('should resolve array of objects to arrayObject', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                        },
                    },
                });
                expect(result.type).toBe(types_1.VarType.arrayObject);
            });
            it('should resolve array without items to generic array', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'array' });
                expect(result.type).toBe(types_1.VarType.array);
            });
        });
        describe('complex schema - user scenario (tags field)', () => {
            it('should correctly resolve tags array with object items', () => {
                // This is the exact schema from the user's issue
                const tagsSchema = {
                    type: 'array',
                    description: '标签数组',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: '标签ID',
                            },
                            k: {
                                type: 'number',
                                description: '标签类型',
                            },
                            group: {
                                type: 'number',
                                description: '标签分组',
                            },
                        },
                    },
                };
                const result = (0, output_schema_utils_1.resolveVarType)(tagsSchema);
                expect(result.type).toBe(types_1.VarType.arrayObject);
            });
        });
        describe('nullable types', () => {
            it('should handle nullable string type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: ['string', 'null'] });
                expect(result.type).toBe(types_1.VarType.string);
            });
            it('should handle nullable array type', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: ['array', 'null'],
                    items: { type: 'string' },
                });
                expect(result.type).toBe(types_1.VarType.arrayString);
            });
        });
        describe('unknown types', () => {
            it('should resolve unknown type to any', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({ type: 'unknown_type' });
                expect(result.type).toBe(types_1.VarType.any);
            });
            it('should resolve empty schema to any', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({});
                expect(result.type).toBe(types_1.VarType.any);
            });
        });
        describe('file types via schemaType', () => {
            it('should resolve object with file schemaType to file', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'object',
                    schema_type: 'file',
                });
                expect(result.type).toBe(types_1.VarType.file);
                expect(result.schemaType).toBe('file');
            });
            it('should resolve array of files to arrayFile', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: {
                        type: 'object',
                        schema_type: 'file',
                    },
                });
                expect(result.type).toBe(types_1.VarType.arrayFile);
            });
        });
        describe('nested arrays', () => {
            it('should handle array of arrays as generic array', () => {
                const result = (0, output_schema_utils_1.resolveVarType)({
                    type: 'array',
                    items: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                });
                // Nested arrays fall back to generic array type
                expect(result.type).toBe(types_1.VarType.array);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LXNjaGVtYS11dGlscy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3V0cHV0LXNjaGVtYS11dGlscy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQXlEO0FBQ3pELGdFQUkrQjtBQUUvQiwyQ0FBMkM7QUFDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLG9CQUFvQixFQUFFLENBQUMsTUFBVyxFQUFFLEVBQUU7UUFDcEMsOENBQThDO1FBQzlDLE9BQU8sTUFBTSxFQUFFLFdBQVcsSUFBSSxNQUFNLEVBQUUsVUFBVSxJQUFJLFNBQVMsQ0FBQTtJQUMvRCxDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsRUFBRSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtZQUM5RCxNQUFNLENBQUMsSUFBQSw2Q0FBdUIsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQ3JELE1BQU0sQ0FBQyxJQUFBLDZDQUF1QixFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLE1BQU0sQ0FBQyxJQUFBLDZDQUF1QixFQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLElBQUEsNkNBQXVCLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNsRSxNQUFNLENBQUMsSUFBQSw2Q0FB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RUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO3FCQUMxQjtpQkFDRixDQUFDLENBQUE7Z0JBQ0YsZ0RBQWdEO2dCQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDekMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWYXJUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7XG4gIG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlLFxuICBwaWNrSXRlbVNjaGVtYSxcbiAgcmVzb2x2ZVZhclR5cGUsXG59IGZyb20gJy4uL291dHB1dC1zY2hlbWEtdXRpbHMnXG5cbi8vIE1vY2sgdGhlIGdldE1hdGNoZWRTY2hlbWFUeXBlIGRlcGVuZGVuY3lcbnZpLm1vY2soJy4uLy4uL19iYXNlL2NvbXBvbmVudHMvdmFyaWFibGUvdXNlLW1hdGNoLXNjaGVtYS10eXBlJywgKCkgPT4gKHtcbiAgZ2V0TWF0Y2hlZFNjaGVtYVR5cGU6IChzY2hlbWE6IGFueSkgPT4ge1xuICAgIC8vIFJldHVybiBzY2hlbWFfdHlwZSBvciBzY2hlbWFUeXBlIGlmIHByZXNlbnRcbiAgICByZXR1cm4gc2NoZW1hPy5zY2hlbWFfdHlwZSB8fCBzY2hlbWE/LnNjaGVtYVR5cGUgfHwgdW5kZWZpbmVkXG4gIH0sXG59KSlcblxuZGVzY3JpYmUoJ291dHB1dC1zY2hlbWEtdXRpbHMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdub3JtYWxpemVKc29uU2NoZW1hVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIG51bGwgb3IgdW5kZWZpbmVkIHNjaGVtYScsICgpID0+IHtcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZShudWxsKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3Qobm9ybWFsaXplSnNvblNjaGVtYVR5cGUodW5kZWZpbmVkKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRoZSB0eXBlIGRpcmVjdGx5IGZvciBzaW1wbGUgc3RyaW5nIHR5cGUnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qobm9ybWFsaXplSnNvblNjaGVtYVR5cGUoeyB0eXBlOiAnc3RyaW5nJyB9KSkudG9CZSgnc3RyaW5nJylcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7IHR5cGU6ICdudW1iZXInIH0pKS50b0JlKCdudW1iZXInKVxuICAgICAgZXhwZWN0KG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHsgdHlwZTogJ2Jvb2xlYW4nIH0pKS50b0JlKCdib29sZWFuJylcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7IHR5cGU6ICdvYmplY3QnIH0pKS50b0JlKCdvYmplY3QnKVxuICAgICAgZXhwZWN0KG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHsgdHlwZTogJ2FycmF5JyB9KSkudG9CZSgnYXJyYXknKVxuICAgICAgZXhwZWN0KG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHsgdHlwZTogJ2ludGVnZXInIH0pKS50b0JlKCdpbnRlZ2VyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYXJyYXkgdHlwZSB3aXRoIG51bGxhYmxlIChlLmcuLCBbXCJzdHJpbmdcIiwgXCJudWxsXCJdKScsICgpID0+IHtcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7IHR5cGU6IFsnc3RyaW5nJywgJ251bGwnXSB9KSkudG9CZSgnc3RyaW5nJylcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7IHR5cGU6IFsnbnVsbCcsICdudW1iZXInXSB9KSkudG9CZSgnbnVtYmVyJylcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7IHR5cGU6IFsnb2JqZWN0JywgJ251bGwnXSB9KSkudG9CZSgnb2JqZWN0JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25lT2Ygc2NoZW1hJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHtcbiAgICAgICAgb25lT2Y6IFtcbiAgICAgICAgICB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgeyB0eXBlOiAnbnVsbCcgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pKS50b0JlKCdzdHJpbmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbnlPZiBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qobm9ybWFsaXplSnNvblNjaGVtYVR5cGUoe1xuICAgICAgICBhbnlPZjogW1xuICAgICAgICAgIHsgdHlwZTogJ251bWJlcicgfSxcbiAgICAgICAgICB7IHR5cGU6ICdudWxsJyB9LFxuICAgICAgICBdLFxuICAgICAgfSkpLnRvQmUoJ251bWJlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFsbE9mIHNjaGVtYScsICgpID0+IHtcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7XG4gICAgICAgIGFsbE9mOiBbXG4gICAgICAgICAgeyB0eXBlOiAnb2JqZWN0JyB9LFxuICAgICAgICBdLFxuICAgICAgfSkpLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5mZXIgb2JqZWN0IHR5cGUgZnJvbSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG5vcm1hbGl6ZUpzb25TY2hlbWFUeXBlKHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIG5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKS50b0JlKCdvYmplY3QnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluZmVyIGFycmF5IHR5cGUgZnJvbSBpdGVtcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7XG4gICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB9KSkudG9CZSgnYXJyYXknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIGVtcHR5IHNjaGVtYScsICgpID0+IHtcbiAgICAgIGV4cGVjdChub3JtYWxpemVKc29uU2NoZW1hVHlwZSh7fSkpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3BpY2tJdGVtU2NoZW1hJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgbnVsbCBvciB1bmRlZmluZWQgc2NoZW1hJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBpY2tJdGVtU2NoZW1hKG51bGwpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChwaWNrSXRlbVNjaGVtYSh1bmRlZmluZWQpKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGlmIG5vIGl0ZW1zIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHBpY2tJdGVtU2NoZW1hKHsgdHlwZTogJ2FycmF5JyB9KSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QocGlja0l0ZW1TY2hlbWEoe30pKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaXRlbXMgZGlyZWN0bHkgaWYgaXRlbXMgaXMgYW4gb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgaXRlbVNjaGVtYSA9IHsgdHlwZTogJ3N0cmluZycgfVxuICAgICAgZXhwZWN0KHBpY2tJdGVtU2NoZW1hKHsgaXRlbXM6IGl0ZW1TY2hlbWEgfSkpLnRvQmUoaXRlbVNjaGVtYSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmlyc3QgaXRlbSBpZiBpdGVtcyBpcyBhbiBhcnJheSAodHVwbGUgc2NoZW1hKScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHsgdHlwZTogJ3N0cmluZycgfVxuICAgICAgY29uc3Qgc2Vjb25kSXRlbSA9IHsgdHlwZTogJ251bWJlcicgfVxuICAgICAgZXhwZWN0KHBpY2tJdGVtU2NoZW1hKHsgaXRlbXM6IFtmaXJzdEl0ZW0sIHNlY29uZEl0ZW1dIH0pKS50b0JlKGZpcnN0SXRlbSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdyZXNvbHZlVmFyVHlwZScsICgpID0+IHtcbiAgICBkZXNjcmliZSgncHJpbWl0aXZlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNvbHZlIHN0cmluZyB0eXBlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlVmFyVHlwZSh7IHR5cGU6ICdzdHJpbmcnIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShWYXJUeXBlLnN0cmluZylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVzb2x2ZSBudW1iZXIgdHlwZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiAnbnVtYmVyJyB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5udW1iZXIpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgaW50ZWdlciB0eXBlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlVmFyVHlwZSh7IHR5cGU6ICdpbnRlZ2VyJyB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5pbnRlZ2VyKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXNvbHZlIGJvb2xlYW4gdHlwZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiAnYm9vbGVhbicgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuYm9vbGVhbilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVzb2x2ZSBvYmplY3QgdHlwZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiAnb2JqZWN0JyB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5vYmplY3QpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnYXJyYXkgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgYXJyYXkgb2Ygc3RyaW5ncyB0byBhcnJheVN0cmluZycsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuYXJyYXlTdHJpbmcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgYXJyYXkgb2YgbnVtYmVycyB0byBhcnJheU51bWJlcicsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ251bWJlcicgfSxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuYXJyYXlOdW1iZXIpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgYXJyYXkgb2YgaW50ZWdlcnMgdG8gYXJyYXlOdW1iZXInLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc29sdmVWYXJUeXBlKHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5hcnJheU51bWJlcilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVzb2x2ZSBhcnJheSBvZiBib29sZWFucyB0byBhcnJheUJvb2xlYW4nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc29sdmVWYXJUeXBlKHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5hcnJheUJvb2xlYW4pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgYXJyYXkgb2Ygb2JqZWN0cyB0byBhcnJheU9iamVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBpZDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICBuYW1lOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShWYXJUeXBlLmFycmF5T2JqZWN0KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXNvbHZlIGFycmF5IHdpdGhvdXQgaXRlbXMgdG8gZ2VuZXJpYyBhcnJheScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiAnYXJyYXknIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShWYXJUeXBlLmFycmF5KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2NvbXBsZXggc2NoZW1hIC0gdXNlciBzY2VuYXJpbyAodGFncyBmaWVsZCknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSByZXNvbHZlIHRhZ3MgYXJyYXkgd2l0aCBvYmplY3QgaXRlbXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGV4YWN0IHNjaGVtYSBmcm9tIHRoZSB1c2VyJ3MgaXNzdWVcbiAgICAgICAgY29uc3QgdGFnc1NjaGVtYSA9IHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAn5qCH562+5pWw57uEJyxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICfmoIfnrb5JRCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGs6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ+agh+etvuexu+WeiycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdyb3VwOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICfmoIfnrb7liIbnu4QnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUodGFnc1NjaGVtYSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuYXJyYXlPYmplY3QpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnbnVsbGFibGUgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsYWJsZSBzdHJpbmcgdHlwZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiBbJ3N0cmluZycsICdudWxsJ10gfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuc3RyaW5nKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbGFibGUgYXJyYXkgdHlwZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe1xuICAgICAgICAgIHR5cGU6IFsnYXJyYXknLCAnbnVsbCddLFxuICAgICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShWYXJUeXBlLmFycmF5U3RyaW5nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3Vua25vd24gdHlwZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgdW5rbm93biB0eXBlIHRvIGFueScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoeyB0eXBlOiAndW5rbm93bl90eXBlJyB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5hbnkpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlc29sdmUgZW1wdHkgc2NoZW1hIHRvIGFueScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe30pXG4gICAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShWYXJUeXBlLmFueSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdmaWxlIHR5cGVzIHZpYSBzY2hlbWFUeXBlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNvbHZlIG9iamVjdCB3aXRoIGZpbGUgc2NoZW1hVHlwZSB0byBmaWxlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSByZXNvbHZlVmFyVHlwZSh7XG4gICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgc2NoZW1hX3R5cGU6ICdmaWxlJyxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuZmlsZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5zY2hlbWFUeXBlKS50b0JlKCdmaWxlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVzb2x2ZSBhcnJheSBvZiBmaWxlcyB0byBhcnJheUZpbGUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlc29sdmVWYXJUeXBlKHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHNjaGVtYV90eXBlOiAnZmlsZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFZhclR5cGUuYXJyYXlGaWxlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ25lc3RlZCBhcnJheXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBhcnJheSBvZiBhcnJheXMgYXMgZ2VuZXJpYyBhcnJheScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzb2x2ZVZhclR5cGUoe1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIC8vIE5lc3RlZCBhcnJheXMgZmFsbCBiYWNrIHRvIGdlbmVyaWMgYXJyYXkgdHlwZVxuICAgICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoVmFyVHlwZS5hcnJheSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=