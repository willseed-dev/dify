"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("./utils");
describe('buildWorkflowOutputParameters', () => {
    it('returns provided output parameters when array input exists', () => {
        const params = [
            { name: 'text', description: 'final text', type: types_1.VarType.string },
        ];
        const result = (0, utils_1.buildWorkflowOutputParameters)(params, null);
        expect(result).toBe(params);
    });
    it('derives parameters from schema when explicit array missing', () => {
        const schema = {
            type: 'object',
            properties: {
                answer: {
                    type: types_1.VarType.string,
                    description: 'AI answer',
                },
                attachments: {
                    type: types_1.VarType.arrayFile,
                    description: 'Supporting files',
                },
                unknown: {
                    type: 'custom',
                    description: 'Unsupported type',
                },
            },
        };
        const result = (0, utils_1.buildWorkflowOutputParameters)(undefined, schema);
        expect(result).toEqual([
            { name: 'answer', description: 'AI answer', type: types_1.VarType.string },
            { name: 'attachments', description: 'Supporting files', type: types_1.VarType.arrayFile },
            { name: 'unknown', description: 'Unsupported type', type: undefined },
        ]);
    });
    it('returns empty array when no source information is provided', () => {
        expect((0, utils_1.buildWorkflowOutputParameters)(null, null)).toEqual([]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFBeUQ7QUFDekQsbUNBQXVEO0FBRXZELFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7SUFDN0MsRUFBRSxDQUFDLDREQUE0RCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxNQUFNLE1BQU0sR0FBMEM7WUFDcEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNLEVBQUU7U0FDbEUsQ0FBQTtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUEscUNBQTZCLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRTFELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFFRixFQUFFLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLE1BQU0sTUFBTSxHQUFxQztZQUMvQyxJQUFJLEVBQUUsUUFBUTtZQUNkLFVBQVUsRUFBRTtnQkFDVixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLGVBQU8sQ0FBQyxNQUFNO29CQUNwQixXQUFXLEVBQUUsV0FBVztpQkFDekI7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSxlQUFPLENBQUMsU0FBUztvQkFDdkIsV0FBVyxFQUFFLGtCQUFrQjtpQkFDaEM7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxRQUFRO29CQUNkLFdBQVcsRUFBRSxrQkFBa0I7aUJBQ2hDO2FBQ0Y7U0FDRixDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQ0FBNkIsRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFFL0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNyQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsZUFBTyxDQUFDLE1BQU0sRUFBRTtZQUNsRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxlQUFPLENBQUMsU0FBUyxFQUFFO1lBQ2pGLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtTQUN0RSxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsTUFBTSxDQUFDLElBQUEscUNBQTZCLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQy9ELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdvcmtmbG93VG9vbFByb3ZpZGVyT3V0cHV0UGFyYW1ldGVyLCBXb3JrZmxvd1Rvb2xQcm92aWRlck91dHB1dFNjaGVtYSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgVmFyVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBidWlsZFdvcmtmbG93T3V0cHV0UGFyYW1ldGVycyB9IGZyb20gJy4vdXRpbHMnXG5cbmRlc2NyaWJlKCdidWlsZFdvcmtmbG93T3V0cHV0UGFyYW1ldGVycycsICgpID0+IHtcbiAgaXQoJ3JldHVybnMgcHJvdmlkZWQgb3V0cHV0IHBhcmFtZXRlcnMgd2hlbiBhcnJheSBpbnB1dCBleGlzdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgcGFyYW1zOiBXb3JrZmxvd1Rvb2xQcm92aWRlck91dHB1dFBhcmFtZXRlcltdID0gW1xuICAgICAgeyBuYW1lOiAndGV4dCcsIGRlc2NyaXB0aW9uOiAnZmluYWwgdGV4dCcsIHR5cGU6IFZhclR5cGUuc3RyaW5nIH0sXG4gICAgXVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYnVpbGRXb3JrZmxvd091dHB1dFBhcmFtZXRlcnMocGFyYW1zLCBudWxsKVxuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZShwYXJhbXMpXG4gIH0pXG5cbiAgaXQoJ2Rlcml2ZXMgcGFyYW1ldGVycyBmcm9tIHNjaGVtYSB3aGVuIGV4cGxpY2l0IGFycmF5IG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2NoZW1hOiBXb3JrZmxvd1Rvb2xQcm92aWRlck91dHB1dFNjaGVtYSA9IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBhbnN3ZXI6IHtcbiAgICAgICAgICB0eXBlOiBWYXJUeXBlLnN0cmluZyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0FJIGFuc3dlcicsXG4gICAgICAgIH0sXG4gICAgICAgIGF0dGFjaG1lbnRzOiB7XG4gICAgICAgICAgdHlwZTogVmFyVHlwZS5hcnJheUZpbGUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdTdXBwb3J0aW5nIGZpbGVzJyxcbiAgICAgICAgfSxcbiAgICAgICAgdW5rbm93bjoge1xuICAgICAgICAgIHR5cGU6ICdjdXN0b20nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVW5zdXBwb3J0ZWQgdHlwZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkV29ya2Zsb3dPdXRwdXRQYXJhbWV0ZXJzKHVuZGVmaW5lZCwgc2NoZW1hKVxuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbXG4gICAgICB7IG5hbWU6ICdhbnN3ZXInLCBkZXNjcmlwdGlvbjogJ0FJIGFuc3dlcicsIHR5cGU6IFZhclR5cGUuc3RyaW5nIH0sXG4gICAgICB7IG5hbWU6ICdhdHRhY2htZW50cycsIGRlc2NyaXB0aW9uOiAnU3VwcG9ydGluZyBmaWxlcycsIHR5cGU6IFZhclR5cGUuYXJyYXlGaWxlIH0sXG4gICAgICB7IG5hbWU6ICd1bmtub3duJywgZGVzY3JpcHRpb246ICdVbnN1cHBvcnRlZCB0eXBlJywgdHlwZTogdW5kZWZpbmVkIH0sXG4gICAgXSlcbiAgfSlcblxuICBpdCgncmV0dXJucyBlbXB0eSBhcnJheSB3aGVuIG5vIHNvdXJjZSBpbmZvcm1hdGlvbiBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICBleHBlY3QoYnVpbGRXb3JrZmxvd091dHB1dFBhcmFtZXRlcnMobnVsbCwgbnVsbCkpLnRvRXF1YWwoW10pXG4gIH0pXG59KVxuIl19