"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_version_feature_1 = require("./plugin-version-feature");
describe('plugin-version-feature', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('isSupportMCP', () => {
        it('should call isEqualOrLaterThanVersion with the correct parameters', () => {
            expect((0, plugin_version_feature_1.isSupportMCP)('0.0.3')).toBe(true);
            expect((0, plugin_version_feature_1.isSupportMCP)('1.0.0')).toBe(true);
        });
        it('should return true when version is equal to the supported MCP version', () => {
            const mockVersion = '0.0.2';
            const result = (0, plugin_version_feature_1.isSupportMCP)(mockVersion);
            expect(result).toBe(true);
        });
        it('should return false when version is less than the supported MCP version', () => {
            const mockVersion = '0.0.1';
            const result = (0, plugin_version_feature_1.isSupportMCP)(mockVersion);
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXZlcnNpb24tZmVhdHVyZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGx1Z2luLXZlcnNpb24tZmVhdHVyZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUVBQXVEO0FBRXZELFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQzVCLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsTUFBTSxDQUFDLElBQUEscUNBQVksRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN4QyxNQUFNLENBQUMsSUFBQSxxQ0FBWSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtZQUMvRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUE7WUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQ0FBWSxFQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ2pGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQTtZQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFBLHFDQUFZLEVBQUMsV0FBVyxDQUFDLENBQUE7WUFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM1QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1N1cHBvcnRNQ1AgfSBmcm9tICcuL3BsdWdpbi12ZXJzaW9uLWZlYXR1cmUnXG5cbmRlc2NyaWJlKCdwbHVnaW4tdmVyc2lvbi1mZWF0dXJlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnaXNTdXBwb3J0TUNQJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBpc0VxdWFsT3JMYXRlclRoYW5WZXJzaW9uIHdpdGggdGhlIGNvcnJlY3QgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGV4cGVjdChpc1N1cHBvcnRNQ1AoJzAuMC4zJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpc1N1cHBvcnRNQ1AoJzEuMC4wJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIHZlcnNpb24gaXMgZXF1YWwgdG8gdGhlIHN1cHBvcnRlZCBNQ1AgdmVyc2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tWZXJzaW9uID0gJzAuMC4yJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gaXNTdXBwb3J0TUNQKG1vY2tWZXJzaW9uKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIHZlcnNpb24gaXMgbGVzcyB0aGFuIHRoZSBzdXBwb3J0ZWQgTUNQIHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrVmVyc2lvbiA9ICcwLjAuMSdcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGlzU3VwcG9ydE1DUChtb2NrVmVyc2lvbilcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=