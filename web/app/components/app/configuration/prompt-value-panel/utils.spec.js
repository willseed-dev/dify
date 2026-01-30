"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_1 = require("./utils");
const promptVariables = [
    { key: 'user', name: 'User', type: 'string' },
    { key: 'topic', name: 'Topic', type: 'string' },
];
(0, vitest_1.describe)('replaceStringWithValues', () => {
    (0, vitest_1.it)('should replace placeholders when inputs have values', () => {
        const template = 'Hello {{user}} talking about {{topic}}';
        const result = (0, utils_1.replaceStringWithValues)(template, promptVariables, { user: 'Alice', topic: 'cats' });
        (0, vitest_1.expect)(result).toBe('Hello Alice talking about cats');
    });
    (0, vitest_1.it)('should use prompt variable name when value is missing', () => {
        const template = 'Hi {{user}} from {{topic}}';
        const result = (0, utils_1.replaceStringWithValues)(template, promptVariables, {});
        (0, vitest_1.expect)(result).toBe('Hi {{User}} from {{Topic}}');
    });
    (0, vitest_1.it)('should leave placeholder untouched when no variable is defined', () => {
        const template = 'Unknown {{missing}} placeholder';
        const result = (0, utils_1.replaceStringWithValues)(template, promptVariables, {});
        (0, vitest_1.expect)(result).toBe('Unknown {{missing}} placeholder');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtQ0FBNkM7QUFDN0MsbUNBQWlEO0FBRWpELE1BQU0sZUFBZSxHQUFxQjtJQUN4QyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0lBQzdDLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7Q0FDaEQsQ0FBQTtBQUVELElBQUEsaUJBQVEsRUFBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDdkMsSUFBQSxXQUFFLEVBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQzdELE1BQU0sUUFBUSxHQUFHLHdDQUF3QyxDQUFBO1FBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUEsK0JBQXVCLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDbkcsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsTUFBTSxRQUFRLEdBQUcsNEJBQTRCLENBQUE7UUFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3JFLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0lBQ25ELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQ3hFLE1BQU0sUUFBUSxHQUFHLGlDQUFpQyxDQUFBO1FBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUEsK0JBQXVCLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNyRSxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtJQUN4RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcm9tcHRWYXJpYWJsZSB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuXG5pbXBvcnQgeyBkZXNjcmliZSwgZXhwZWN0LCBpdCB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IHJlcGxhY2VTdHJpbmdXaXRoVmFsdWVzIH0gZnJvbSAnLi91dGlscydcblxuY29uc3QgcHJvbXB0VmFyaWFibGVzOiBQcm9tcHRWYXJpYWJsZVtdID0gW1xuICB7IGtleTogJ3VzZXInLCBuYW1lOiAnVXNlcicsIHR5cGU6ICdzdHJpbmcnIH0sXG4gIHsga2V5OiAndG9waWMnLCBuYW1lOiAnVG9waWMnLCB0eXBlOiAnc3RyaW5nJyB9LFxuXVxuXG5kZXNjcmliZSgncmVwbGFjZVN0cmluZ1dpdGhWYWx1ZXMnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmVwbGFjZSBwbGFjZWhvbGRlcnMgd2hlbiBpbnB1dHMgaGF2ZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSAnSGVsbG8ge3t1c2VyfX0gdGFsa2luZyBhYm91dCB7e3RvcGljfX0nXG4gICAgY29uc3QgcmVzdWx0ID0gcmVwbGFjZVN0cmluZ1dpdGhWYWx1ZXModGVtcGxhdGUsIHByb21wdFZhcmlhYmxlcywgeyB1c2VyOiAnQWxpY2UnLCB0b3BpYzogJ2NhdHMnIH0pXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnSGVsbG8gQWxpY2UgdGFsa2luZyBhYm91dCBjYXRzJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIHVzZSBwcm9tcHQgdmFyaWFibGUgbmFtZSB3aGVuIHZhbHVlIGlzIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSAnSGkge3t1c2VyfX0gZnJvbSB7e3RvcGljfX0nXG4gICAgY29uc3QgcmVzdWx0ID0gcmVwbGFjZVN0cmluZ1dpdGhWYWx1ZXModGVtcGxhdGUsIHByb21wdFZhcmlhYmxlcywge30pXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnSGkge3tVc2VyfX0gZnJvbSB7e1RvcGljfX0nKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbGVhdmUgcGxhY2Vob2xkZXIgdW50b3VjaGVkIHdoZW4gbm8gdmFyaWFibGUgaXMgZGVmaW5lZCcsICgpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9ICdVbmtub3duIHt7bWlzc2luZ319IHBsYWNlaG9sZGVyJ1xuICAgIGNvbnN0IHJlc3VsdCA9IHJlcGxhY2VTdHJpbmdXaXRoVmFsdWVzKHRlbXBsYXRlLCBwcm9tcHRWYXJpYWJsZXMsIHt9KVxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJ1Vua25vd24ge3ttaXNzaW5nfX0gcGxhY2Vob2xkZXInKVxuICB9KVxufSlcbiJdfQ==