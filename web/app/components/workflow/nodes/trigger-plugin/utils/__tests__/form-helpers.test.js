"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_helpers_1 = require("../form-helpers");
describe('Form Helpers', () => {
    describe('sanitizeFormValues', () => {
        it('should convert null values to empty strings', () => {
            const input = { field1: null, field2: 'value', field3: undefined };
            const result = (0, form_helpers_1.sanitizeFormValues)(input);
            expect(result).toEqual({
                field1: '',
                field2: 'value',
                field3: '',
            });
        });
        it('should convert undefined values to empty strings', () => {
            const input = { field1: undefined, field2: 'test' };
            const result = (0, form_helpers_1.sanitizeFormValues)(input);
            expect(result).toEqual({
                field1: '',
                field2: 'test',
            });
        });
        it('should convert non-string values to strings', () => {
            const input = { number: 123, boolean: true, string: 'test' };
            const result = (0, form_helpers_1.sanitizeFormValues)(input);
            expect(result).toEqual({
                number: '123',
                boolean: 'true',
                string: 'test',
            });
        });
        it('should handle empty objects', () => {
            const result = (0, form_helpers_1.sanitizeFormValues)({});
            expect(result).toEqual({});
        });
        it('should handle objects with mixed value types', () => {
            const input = {
                null_field: null,
                undefined_field: undefined,
                zero: 0,
                false_field: false,
                empty_string: '',
                valid_string: 'test',
            };
            const result = (0, form_helpers_1.sanitizeFormValues)(input);
            expect(result).toEqual({
                null_field: '',
                undefined_field: '',
                zero: '0',
                false_field: 'false',
                empty_string: '',
                valid_string: 'test',
            });
        });
    });
    describe('deepSanitizeFormValues', () => {
        it('should handle nested objects', () => {
            const input = {
                level1: {
                    field1: null,
                    field2: 'value',
                    level2: {
                        field3: undefined,
                        field4: 'nested',
                    },
                },
                simple: 'test',
            };
            const result = (0, form_helpers_1.deepSanitizeFormValues)(input);
            expect(result).toEqual({
                level1: {
                    field1: '',
                    field2: 'value',
                    level2: {
                        field3: '',
                        field4: 'nested',
                    },
                },
                simple: 'test',
            });
        });
        it('should handle arrays correctly', () => {
            const input = {
                array: [1, 2, 3],
                nested: {
                    array: ['a', null, 'c'],
                },
            };
            const result = (0, form_helpers_1.deepSanitizeFormValues)(input);
            expect(result).toEqual({
                array: [1, 2, 3],
                nested: {
                    array: ['a', null, 'c'],
                },
            });
        });
        it('should handle null and undefined at root level', () => {
            const input = {
                null_field: null,
                undefined_field: undefined,
                nested: {
                    null_nested: null,
                },
            };
            const result = (0, form_helpers_1.deepSanitizeFormValues)(input);
            expect(result).toEqual({
                null_field: '',
                undefined_field: '',
                nested: {
                    null_nested: '',
                },
            });
        });
        it('should handle deeply nested structures', () => {
            const input = {
                level1: {
                    level2: {
                        level3: {
                            field: null,
                        },
                    },
                },
            };
            const result = (0, form_helpers_1.deepSanitizeFormValues)(input);
            expect(result).toEqual({
                level1: {
                    level2: {
                        level3: {
                            field: '',
                        },
                    },
                },
            });
        });
        it('should preserve non-null values in nested structures', () => {
            const input = {
                config: {
                    client_id: 'valid_id',
                    client_secret: null,
                    options: {
                        timeout: 5000,
                        enabled: true,
                        message: undefined,
                    },
                },
            };
            const result = (0, form_helpers_1.deepSanitizeFormValues)(input);
            expect(result).toEqual({
                config: {
                    client_id: 'valid_id',
                    client_secret: '',
                    options: {
                        timeout: 5000,
                        enabled: true,
                        message: '',
                    },
                },
            });
        });
    });
    describe('findMissingRequiredField', () => {
        const requiredFields = [
            { name: 'client_id', label: 'Client ID' },
            { name: 'client_secret', label: 'Client Secret' },
            { name: 'scope', label: 'Scope' },
        ];
        it('should return null when all required fields are present', () => {
            const formData = {
                client_id: 'test_id',
                client_secret: 'test_secret',
                scope: 'read',
                optional_field: 'optional',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toBeNull();
        });
        it('should return the first missing field', () => {
            const formData = {
                client_id: 'test_id',
                scope: 'read',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toEqual({ name: 'client_secret', label: 'Client Secret' });
        });
        it('should treat empty strings as missing fields', () => {
            const formData = {
                client_id: '',
                client_secret: 'test_secret',
                scope: 'read',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toEqual({ name: 'client_id', label: 'Client ID' });
        });
        it('should treat null values as missing fields', () => {
            const formData = {
                client_id: 'test_id',
                client_secret: null,
                scope: 'read',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toEqual({ name: 'client_secret', label: 'Client Secret' });
        });
        it('should treat undefined values as missing fields', () => {
            const formData = {
                client_id: 'test_id',
                client_secret: 'test_secret',
                scope: undefined,
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toEqual({ name: 'scope', label: 'Scope' });
        });
        it('should handle empty required fields array', () => {
            const formData = {
                client_id: 'test_id',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, []);
            expect(result).toBeNull();
        });
        it('should handle empty form data', () => {
            const result = (0, form_helpers_1.findMissingRequiredField)({}, requiredFields);
            expect(result).toEqual({ name: 'client_id', label: 'Client ID' });
        });
        it('should handle multilingual labels', () => {
            const multilingualFields = [
                { name: 'field1', label: { en_US: 'Field 1 EN', zh_Hans: 'Field 1 CN' } },
            ];
            const formData = {};
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, multilingualFields);
            expect(result).toEqual({
                name: 'field1',
                label: { en_US: 'Field 1 EN', zh_Hans: 'Field 1 CN' },
            });
        });
        it('should return null for form data with extra fields', () => {
            const formData = {
                client_id: 'test_id',
                client_secret: 'test_secret',
                scope: 'read',
                extra_field1: 'extra1',
                extra_field2: 'extra2',
            };
            const result = (0, form_helpers_1.findMissingRequiredField)(formData, requiredFields);
            expect(result).toBeNull();
        });
    });
    describe('Edge cases', () => {
        it('should handle objects with non-string keys', () => {
            const input = { [Symbol('test')]: 'value', regular: 'field' };
            const result = (0, form_helpers_1.sanitizeFormValues)(input);
            expect(result.regular).toBe('field');
        });
        it('should handle objects with getter properties', () => {
            const obj = {};
            Object.defineProperty(obj, 'getter', {
                get: () => 'computed_value',
                enumerable: true,
            });
            const result = (0, form_helpers_1.sanitizeFormValues)(obj);
            expect(result.getter).toBe('computed_value');
        });
        it('should handle circular references in deepSanitizeFormValues gracefully', () => {
            const obj = { field: 'value' };
            obj.circular = obj;
            expect(() => (0, form_helpers_1.deepSanitizeFormValues)(obj)).not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1oZWxwZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb3JtLWhlbHBlcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFzRztBQUV0RyxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7WUFDckQsTUFBTSxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFBO1lBQ2xFLE1BQU0sTUFBTSxHQUFHLElBQUEsaUNBQWtCLEVBQUMsS0FBSyxDQUFDLENBQUE7WUFFeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckIsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLEVBQUU7YUFDWCxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQTtZQUNuRCxNQUFNLE1BQU0sR0FBRyxJQUFBLGlDQUFrQixFQUFDLEtBQUssQ0FBQyxDQUFBO1lBRXhDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE1BQU0sS0FBSyxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUs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LENBQUMsT0FBTyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQTtZQUNkLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtnQkFDbkMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLGdCQUFnQjtnQkFDM0IsVUFBVSxFQUFFLElBQUk7YUFDakIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQ0FBa0IsRUFBQyxHQUFHLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtZQUNoRixNQUFNLEdBQUcsR0FBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQTtZQUNuQyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQTtZQUVsQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxxQ0FBc0IsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUN6RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWVwU2FuaXRpemVGb3JtVmFsdWVzLCBmaW5kTWlzc2luZ1JlcXVpcmVkRmllbGQsIHNhbml0aXplRm9ybVZhbHVlcyB9IGZyb20gJy4uL2Zvcm0taGVscGVycydcblxuZGVzY3JpYmUoJ0Zvcm0gSGVscGVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3Nhbml0aXplRm9ybVZhbHVlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbnVsbCB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0geyBmaWVsZDE6IG51bGwsIGZpZWxkMjogJ3ZhbHVlJywgZmllbGQzOiB1bmRlZmluZWQgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVGb3JtVmFsdWVzKGlucHV0KVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgZmllbGQxOiAnJyxcbiAgICAgICAgZmllbGQyOiAndmFsdWUnLFxuICAgICAgICBmaWVsZDM6ICcnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHVuZGVmaW5lZCB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0geyBmaWVsZDE6IHVuZGVmaW5lZCwgZmllbGQyOiAndGVzdCcgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVGb3JtVmFsdWVzKGlucHV0KVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgZmllbGQxOiAnJyxcbiAgICAgICAgZmllbGQyOiAndGVzdCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbm9uLXN0cmluZyB2YWx1ZXMgdG8gc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0geyBudW1iZXI6IDEyMywgYm9vbGVhbjogdHJ1ZSwgc3RyaW5nOiAndGVzdCcgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVGb3JtVmFsdWVzKGlucHV0KVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgbnVtYmVyOiAnMTIzJyxcbiAgICAgICAgYm9vbGVhbjogJ3RydWUnLFxuICAgICAgICBzdHJpbmc6ICd0ZXN0JyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBzYW5pdGl6ZUZvcm1WYWx1ZXMoe30pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHt9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvYmplY3RzIHdpdGggbWl4ZWQgdmFsdWUgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHtcbiAgICAgICAgbnVsbF9maWVsZDogbnVsbCxcbiAgICAgICAgdW5kZWZpbmVkX2ZpZWxkOiB1bmRlZmluZWQsXG4gICAgICAgIHplcm86IDAsXG4gICAgICAgIGZhbHNlX2ZpZWxkOiBmYWxzZSxcbiAgICAgICAgZW1wdHlfc3RyaW5nOiAnJyxcbiAgICAgICAgdmFsaWRfc3RyaW5nOiAndGVzdCcsXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBzYW5pdGl6ZUZvcm1WYWx1ZXMoaW5wdXQpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBudWxsX2ZpZWxkOiAnJyxcbiAgICAgICAgdW5kZWZpbmVkX2ZpZWxkOiAnJyxcbiAgICAgICAgemVybzogJzAnLFxuICAgICAgICBmYWxzZV9maWVsZDogJ2ZhbHNlJyxcbiAgICAgICAgZW1wdHlfc3RyaW5nOiAnJyxcbiAgICAgICAgdmFsaWRfc3RyaW5nOiAndGVzdCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2RlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbmVzdGVkIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHtcbiAgICAgICAgbGV2ZWwxOiB7XG4gICAgICAgICAgZmllbGQxOiBudWxsLFxuICAgICAgICAgIGZpZWxkMjogJ3ZhbHVlJyxcbiAgICAgICAgICBsZXZlbDI6IHtcbiAgICAgICAgICAgIGZpZWxkMzogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZmllbGQ0OiAnbmVzdGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzaW1wbGU6ICd0ZXN0JyxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMoaW5wdXQpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBsZXZlbDE6IHtcbiAgICAgICAgICBmaWVsZDE6ICcnLFxuICAgICAgICAgIGZpZWxkMjogJ3ZhbHVlJyxcbiAgICAgICAgICBsZXZlbDI6IHtcbiAgICAgICAgICAgIGZpZWxkMzogJycsXG4gICAgICAgICAgICBmaWVsZDQ6ICduZXN0ZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNpbXBsZTogJ3Rlc3QnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYXJyYXlzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0ge1xuICAgICAgICBhcnJheTogWzEsIDIsIDNdLFxuICAgICAgICBuZXN0ZWQ6IHtcbiAgICAgICAgICBhcnJheTogWydhJywgbnVsbCwgJ2MnXSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMoaW5wdXQpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBhcnJheTogWzEsIDIsIDNdLFxuICAgICAgICBuZXN0ZWQ6IHtcbiAgICAgICAgICBhcnJheTogWydhJywgbnVsbCwgJ2MnXSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgYW5kIHVuZGVmaW5lZCBhdCByb290IGxldmVsJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIG51bGxfZmllbGQ6IG51bGwsXG4gICAgICAgIHVuZGVmaW5lZF9maWVsZDogdW5kZWZpbmVkLFxuICAgICAgICBuZXN0ZWQ6IHtcbiAgICAgICAgICBudWxsX25lc3RlZDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMoaW5wdXQpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICBudWxsX2ZpZWxkOiAnJyxcbiAgICAgICAgdW5kZWZpbmVkX2ZpZWxkOiAnJyxcbiAgICAgICAgbmVzdGVkOiB7XG4gICAgICAgICAgbnVsbF9uZXN0ZWQ6ICcnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGVlcGx5IG5lc3RlZCBzdHJ1Y3R1cmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIGxldmVsMToge1xuICAgICAgICAgIGxldmVsMjoge1xuICAgICAgICAgICAgbGV2ZWwzOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBudWxsLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZGVlcFNhbml0aXplRm9ybVZhbHVlcyhpbnB1dClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIGxldmVsMToge1xuICAgICAgICAgIGxldmVsMjoge1xuICAgICAgICAgICAgbGV2ZWwzOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiAnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgbm9uLW51bGwgdmFsdWVzIGluIG5lc3RlZCBzdHJ1Y3R1cmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB7XG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ3ZhbGlkX2lkJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiBudWxsLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogdW5kZWZpbmVkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBkZWVwU2FuaXRpemVGb3JtVmFsdWVzKGlucHV0KVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgY2xpZW50X2lkOiAndmFsaWRfaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICcnLFxuICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlcXVpcmVkRmllbGRzID0gW1xuICAgICAgeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnIH0sXG4gICAgICB7IG5hbWU6ICdjbGllbnRfc2VjcmV0JywgbGFiZWw6ICdDbGllbnQgU2VjcmV0JyB9LFxuICAgICAgeyBuYW1lOiAnc2NvcGUnLCBsYWJlbDogJ1Njb3BlJyB9LFxuICAgIF1cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgd2hlbiBhbGwgcmVxdWlyZWQgZmllbGRzIGFyZSBwcmVzZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSB7XG4gICAgICAgIGNsaWVudF9pZDogJ3Rlc3RfaWQnLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiAndGVzdF9zZWNyZXQnLFxuICAgICAgICBzY29wZTogJ3JlYWQnLFxuICAgICAgICBvcHRpb25hbF9maWVsZDogJ29wdGlvbmFsJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkKGZvcm1EYXRhLCByZXF1aXJlZEZpZWxkcylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIGZpcnN0IG1pc3NpbmcgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgY2xpZW50X2lkOiAndGVzdF9pZCcsXG4gICAgICAgIHNjb3BlOiAncmVhZCcsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbmRNaXNzaW5nUmVxdWlyZWRGaWVsZChmb3JtRGF0YSwgcmVxdWlyZWRGaWVsZHMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHsgbmFtZTogJ2NsaWVudF9zZWNyZXQnLCBsYWJlbDogJ0NsaWVudCBTZWNyZXQnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJlYXQgZW1wdHkgc3RyaW5ncyBhcyBtaXNzaW5nIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgICBjbGllbnRfaWQ6ICcnLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiAndGVzdF9zZWNyZXQnLFxuICAgICAgICBzY29wZTogJ3JlYWQnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBmaW5kTWlzc2luZ1JlcXVpcmVkRmllbGQoZm9ybURhdGEsIHJlcXVpcmVkRmllbGRzKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7IG5hbWU6ICdjbGllbnRfaWQnLCBsYWJlbDogJ0NsaWVudCBJRCcgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmVhdCBudWxsIHZhbHVlcyBhcyBtaXNzaW5nIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgICBjbGllbnRfaWQ6ICd0ZXN0X2lkJyxcbiAgICAgICAgY2xpZW50X3NlY3JldDogbnVsbCxcbiAgICAgICAgc2NvcGU6ICdyZWFkJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkKGZvcm1EYXRhLCByZXF1aXJlZEZpZWxkcylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoeyBuYW1lOiAnY2xpZW50X3NlY3JldCcsIGxhYmVsOiAnQ2xpZW50IFNlY3JldCcgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmVhdCB1bmRlZmluZWQgdmFsdWVzIGFzIG1pc3NpbmcgZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZm9ybURhdGEgPSB7XG4gICAgICAgIGNsaWVudF9pZDogJ3Rlc3RfaWQnLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiAndGVzdF9zZWNyZXQnLFxuICAgICAgICBzY29wZTogdW5kZWZpbmVkLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBmaW5kTWlzc2luZ1JlcXVpcmVkRmllbGQoZm9ybURhdGEsIHJlcXVpcmVkRmllbGRzKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7IG5hbWU6ICdzY29wZScsIGxhYmVsOiAnU2NvcGUnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHJlcXVpcmVkIGZpZWxkcyBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgICBjbGllbnRfaWQ6ICd0ZXN0X2lkJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkKGZvcm1EYXRhLCBbXSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZm9ybSBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkKHt9LCByZXF1aXJlZEZpZWxkcylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpbGluZ3VhbCBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtdWx0aWxpbmd1YWxGaWVsZHMgPSBbXG4gICAgICAgIHsgbmFtZTogJ2ZpZWxkMScsIGxhYmVsOiB7IGVuX1VTOiAnRmllbGQgMSBFTicsIHpoX0hhbnM6ICdGaWVsZCAxIENOJyB9IH0sXG4gICAgICBdXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IHt9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGZpbmRNaXNzaW5nUmVxdWlyZWRGaWVsZChmb3JtRGF0YSwgbXVsdGlsaW5ndWFsRmllbGRzKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XG4gICAgICAgIG5hbWU6ICdmaWVsZDEnLFxuICAgICAgICBsYWJlbDogeyBlbl9VUzogJ0ZpZWxkIDEgRU4nLCB6aF9IYW5zOiAnRmllbGQgMSBDTicgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgZm9yIGZvcm0gZGF0YSB3aXRoIGV4dHJhIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgICBjbGllbnRfaWQ6ICd0ZXN0X2lkJyxcbiAgICAgICAgY2xpZW50X3NlY3JldDogJ3Rlc3Rfc2VjcmV0JyxcbiAgICAgICAgc2NvcGU6ICdyZWFkJyxcbiAgICAgICAgZXh0cmFfZmllbGQxOiAnZXh0cmExJyxcbiAgICAgICAgZXh0cmFfZmllbGQyOiAnZXh0cmEyJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gZmluZE1pc3NpbmdSZXF1aXJlZEZpZWxkKGZvcm1EYXRhLCByZXF1aXJlZEZpZWxkcylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVOdWxsKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIGNhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9iamVjdHMgd2l0aCBub24tc3RyaW5nIGtleXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHsgW1N5bWJvbCgndGVzdCcpXTogJ3ZhbHVlJywgcmVndWxhcjogJ2ZpZWxkJyB9IGFzIGFueVxuICAgICAgY29uc3QgcmVzdWx0ID0gc2FuaXRpemVGb3JtVmFsdWVzKGlucHV0KVxuXG4gICAgICBleHBlY3QocmVzdWx0LnJlZ3VsYXIpLnRvQmUoJ2ZpZWxkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb2JqZWN0cyB3aXRoIGdldHRlciBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge31cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdnZXR0ZXInLCB7XG4gICAgICAgIGdldDogKCkgPT4gJ2NvbXB1dGVkX3ZhbHVlJyxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNhbml0aXplRm9ybVZhbHVlcyhvYmopXG4gICAgICBleHBlY3QocmVzdWx0LmdldHRlcikudG9CZSgnY29tcHV0ZWRfdmFsdWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjaXJjdWxhciByZWZlcmVuY2VzIGluIGRlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG9iajogYW55ID0geyBmaWVsZDogJ3ZhbHVlJyB9XG4gICAgICBvYmouY2lyY3VsYXIgPSBvYmpcblxuICAgICAgZXhwZWN0KCgpID0+IGRlZXBTYW5pdGl6ZUZvcm1WYWx1ZXMob2JqKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuIl19