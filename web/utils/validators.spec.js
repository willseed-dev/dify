"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
describe('Validators', () => {
    describe('draft07Validator', () => {
        it('should validate a valid JSON schema', () => {
            const validSchema = {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                },
            };
            const result = (0, validators_1.draft07Validator)(validSchema);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should invalidate schema with unknown type', () => {
            const invalidSchema = {
                type: 'invalid_type',
            };
            const result = (0, validators_1.draft07Validator)(invalidSchema);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
        it('should validate nested schemas', () => {
            const nestedSchema = {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            address: {
                                type: 'object',
                                properties: {
                                    street: { type: 'string' },
                                    city: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            };
            const result = (0, validators_1.draft07Validator)(nestedSchema);
            expect(result.valid).toBe(true);
        });
        it('should validate array schemas', () => {
            const arraySchema = {
                type: 'array',
                items: { type: 'string' },
            };
            const result = (0, validators_1.draft07Validator)(arraySchema);
            expect(result.valid).toBe(true);
        });
    });
    describe('forbidBooleanProperties', () => {
        it('should return empty array for schema without boolean properties', () => {
            const schema = {
                properties: {
                    name: { type: 'string' },
                    age: { type: 'number' },
                },
            };
            const errors = (0, validators_1.forbidBooleanProperties)(schema);
            expect(errors).toHaveLength(0);
        });
        it('should detect boolean property at root level', () => {
            const schema = {
                properties: {
                    name: true,
                    age: { type: 'number' },
                },
            };
            const errors = (0, validators_1.forbidBooleanProperties)(schema);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('name');
        });
        it('should detect boolean properties in nested objects', () => {
            const schema = {
                properties: {
                    user: {
                        properties: {
                            name: true,
                            profile: {
                                properties: {
                                    bio: false,
                                },
                            },
                        },
                    },
                },
            };
            const errors = (0, validators_1.forbidBooleanProperties)(schema);
            expect(errors).toHaveLength(2);
            expect(errors.some(e => e.includes('user.name'))).toBe(true);
            expect(errors.some(e => e.includes('user.profile.bio'))).toBe(true);
        });
        it('should handle schema without properties', () => {
            const schema = { type: 'string' };
            const errors = (0, validators_1.forbidBooleanProperties)(schema);
            expect(errors).toHaveLength(0);
        });
        it('should handle null schema', () => {
            const errors = (0, validators_1.forbidBooleanProperties)(null);
            expect(errors).toHaveLength(0);
        });
        it('should handle empty schema', () => {
            const errors = (0, validators_1.forbidBooleanProperties)({});
            expect(errors).toHaveLength(0);
        });
        it('should provide correct path in error messages', () => {
            const schema = {
                properties: {
                    level1: {
                        properties: {
                            level2: {
                                properties: {
                                    level3: true,
                                },
                            },
                        },
                    },
                },
            };
            const errors = (0, validators_1.forbidBooleanProperties)(schema);
            expect(errors[0]).toContain('level1.level2.level3');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmFsaWRhdG9ycy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXdFO0FBRXhFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtZQUM3QyxNQUFNLFdBQVcsR0FBRztnQkFDbEIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7b0JBQ3hCLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7aUJBQ3hCO2FBQ0YsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFHLElBQUEsNkJBQWdCLEVBQUMsV0FBVyxDQUFDLENBQUE7WUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3BELE1BQU0sYUFBYSxHQUFHO2dCQUNwQixJQUFJLEVBQUUsY0FBYzthQUNyQixDQUFBO1lBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBQSw2QkFBZ0IsRUFBQyxhQUFhLENBQUMsQ0FBQTtZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakQsQ0FBQyxD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QUFNLE1BQU0sR0FBRztnQkFDYixVQUFVLEVBQUU7b0JBQ1YsTUFBTSxFQUFFO3dCQUNOLFVBQVUsRUFBRTs0QkFDVixNQUFNLEVBQUU7Z0NBQ04sVUFBVSxFQUFFO29DQUNWLE1BQU0sRUFBRSxJQUFJO2lDQUNiOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFHLElBQUEsb0NBQXVCLEVBQUMsTUFBTSxDQUFDLENBQUE7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRyYWZ0MDdWYWxpZGF0b3IsIGZvcmJpZEJvb2xlYW5Qcm9wZXJ0aWVzIH0gZnJvbSAnLi92YWxpZGF0b3JzJ1xuXG5kZXNjcmliZSgnVmFsaWRhdG9ycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2RyYWZ0MDdWYWxpZGF0b3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBhIHZhbGlkIEpTT04gc2NoZW1hJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsaWRTY2hlbWEgPSB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbmFtZTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgIGFnZTogeyB0eXBlOiAnbnVtYmVyJyB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZHJhZnQwN1ZhbGlkYXRvcih2YWxpZFNjaGVtYSlcbiAgICAgIGV4cGVjdChyZXN1bHQudmFsaWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZXJyb3JzKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbnZhbGlkYXRlIHNjaGVtYSB3aXRoIHVua25vd24gdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGludmFsaWRTY2hlbWEgPSB7XG4gICAgICAgIHR5cGU6ICdpbnZhbGlkX3R5cGUnLFxuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gZHJhZnQwN1ZhbGlkYXRvcihpbnZhbGlkU2NoZW1hKVxuICAgICAgZXhwZWN0KHJlc3VsdC52YWxpZCkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZXJyb3JzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgbmVzdGVkIHNjaGVtYXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBuZXN0ZWRTY2hlbWEgPSB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgYWRkcmVzczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgIHN0cmVldDogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgY2l0eTogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBkcmFmdDA3VmFsaWRhdG9yKG5lc3RlZFNjaGVtYSlcbiAgICAgIGV4cGVjdChyZXN1bHQudmFsaWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBhcnJheSBzY2hlbWFzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXJyYXlTY2hlbWEgPSB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGl0ZW1zOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSBkcmFmdDA3VmFsaWRhdG9yKGFycmF5U2NoZW1hKVxuICAgICAgZXhwZWN0KHJlc3VsdC52YWxpZCkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2ZvcmJpZEJvb2xlYW5Qcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IGFycmF5IGZvciBzY2hlbWEgd2l0aG91dCBib29sZWFuIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzY2hlbWEgPSB7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBuYW1lOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgICAgYWdlOiB7IHR5cGU6ICdudW1iZXInIH0sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvcnMgPSBmb3JiaWRCb29sZWFuUHJvcGVydGllcyhzY2hlbWEpXG4gICAgICBleHBlY3QoZXJyb3JzKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkZXRlY3QgYm9vbGVhbiBwcm9wZXJ0eSBhdCByb290IGxldmVsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0ge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgICAgICBhZ2U6IHsgdHlwZTogJ251bWJlcicgfSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9ycyA9IGZvcmJpZEJvb2xlYW5Qcm9wZXJ0aWVzKHNjaGVtYSlcbiAgICAgIGV4cGVjdChlcnJvcnMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgICAgZXhwZWN0KGVycm9yc1swXSkudG9Db250YWluKCduYW1lJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkZXRlY3QgYm9vbGVhbiBwcm9wZXJ0aWVzIGluIG5lc3RlZCBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0ge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBuYW1lOiB0cnVlLFxuICAgICAgICAgICAgICBwcm9maWxlOiB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgICAgYmlvOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JzID0gZm9yYmlkQm9vbGVhblByb3BlcnRpZXMoc2NoZW1hKVxuICAgICAgZXhwZWN0KGVycm9ycykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICBleHBlY3QoZXJyb3JzLnNvbWUoZSA9PiBlLmluY2x1ZGVzKCd1c2VyLm5hbWUnKSkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChlcnJvcnMuc29tZShlID0+IGUuaW5jbHVkZXMoJ3VzZXIucHJvZmlsZS5iaW8nKSkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2NoZW1hIHdpdGhvdXQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IHsgdHlwZTogJ3N0cmluZycgfVxuICAgICAgY29uc3QgZXJyb3JzID0gZm9yYmlkQm9vbGVhblByb3BlcnRpZXMoc2NoZW1hKVxuICAgICAgZXhwZWN0KGVycm9ycykudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgc2NoZW1hJywgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3JzID0gZm9yYmlkQm9vbGVhblByb3BlcnRpZXMobnVsbClcbiAgICAgIGV4cGVjdChlcnJvcnMpLnRvSGF2ZUxlbmd0aCgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlcnJvcnMgPSBmb3JiaWRCb29sZWFuUHJvcGVydGllcyh7fSlcbiAgICAgIGV4cGVjdChlcnJvcnMpLnRvSGF2ZUxlbmd0aCgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByb3ZpZGUgY29ycmVjdCBwYXRoIGluIGVycm9yIG1lc3NhZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc2NoZW1hID0ge1xuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgbGV2ZWwxOiB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGxldmVsMjoge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICAgIGxldmVsMzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JzID0gZm9yYmlkQm9vbGVhblByb3BlcnRpZXMoc2NoZW1hKVxuICAgICAgZXhwZWN0KGVycm9yc1swXSkudG9Db250YWluKCdsZXZlbDEubGV2ZWwyLmxldmVsMycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=