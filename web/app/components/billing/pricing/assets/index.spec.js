"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('Pricing Assets', () => {
    // Rendering: each asset should render an svg.
    describe('Rendering', () => {
        it('should render static assets without crashing', () => {
            // Arrange
            const assets = [
                <index_1.Community key="community"/>,
                <index_1.Enterprise key="enterprise"/>,
                <index_1.EnterpriseNoise key="enterprise-noise"/>,
                <index_1.NoiseBottom key="noise-bottom"/>,
                <index_1.NoiseTop key="noise-top"/>,
                <index_1.Premium key="premium"/>,
                <index_1.PremiumNoise key="premium-noise"/>,
                <index_1.Professional key="professional"/>,
                <index_1.Sandbox key="sandbox"/>,
                <index_1.Team key="team"/>,
            ];
            // Act / Assert
            assets.forEach((asset) => {
                const { container, unmount } = (0, react_1.render)(asset);
                expect(container.querySelector('svg')).toBeInTheDocument();
                unmount();
            });
        });
    });
    // Props: active state should change fill color for selectable assets.
    describe('Props', () => {
        it('should render active state for Cloud', () => {
            // Arrange
            const { container } = (0, react_1.render)(<index_1.Cloud isActive/>);
            // Assert
            const rects = Array.from(container.querySelectorAll('rect'));
            expect(rects.some(rect => rect.getAttribute('fill') === 'var(--color-saas-dify-blue-accessible)')).toBe(true);
        });
        it('should render inactive state for SelfHosted', () => {
            // Arrange
            const { container } = (0, react_1.render)(<index_1.SelfHosted isActive={false}/>);
            // Assert
            const rects = Array.from(container.querySelectorAll('rect'));
            expect(rects.some(rect => rect.getAttribute('fill') === 'var(--color-text-primary)')).toBe(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQStDO0FBQy9DLG1DQWFnQjtBQUVoQixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLDhDQUE4QztJQUM5QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1lBQ3RELFVBQVU7WUFDVixNQUFNLE1BQU0sR0FBRztnQkFDYixDQUFDLGlCQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRztnQkFDN0IsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUc7Z0JBQy9CLENBQUMsdUJBQWUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUc7Z0JBQzFDLENBQUMsbUJBQVcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFHO2dCQUNsQyxDQUFDLGdCQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRztnQkFDNUIsQ0FBQyxlQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRztnQkFDekIsQ0FBQyxvQkFBWSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUc7Z0JBQ3BDLENBQUMsb0JBQVksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFHO2dCQUNuQyxDQUFDLGVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFHO2dCQUN6QixDQUFDLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFHO2FBQ3BCLENBQUE7WUFFRCxlQUFlO1lBQ2YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUN2QixNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0JBQzFELE9BQU8sRUFBRSxDQUFBO1lBQ1gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsc0VBQXNFO0lBQ3RFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsVUFBVTtZQUNWLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGFBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQyxDQUFBO1lBRWhELFNBQVM7WUFDVCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQzVELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyx3Q0FBd0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9HLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtZQUNyRCxVQUFVO1lBQ1YsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsa0JBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFN0QsU0FBUztZQUNULE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDNUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbEcsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7XG4gIENsb3VkLFxuICBDb21tdW5pdHksXG4gIEVudGVycHJpc2UsXG4gIEVudGVycHJpc2VOb2lzZSxcbiAgTm9pc2VCb3R0b20sXG4gIE5vaXNlVG9wLFxuICBQcmVtaXVtLFxuICBQcmVtaXVtTm9pc2UsXG4gIFByb2Zlc3Npb25hbCxcbiAgU2FuZGJveCxcbiAgU2VsZkhvc3RlZCxcbiAgVGVhbSxcbn0gZnJvbSAnLi9pbmRleCdcblxuZGVzY3JpYmUoJ1ByaWNpbmcgQXNzZXRzJywgKCkgPT4ge1xuICAvLyBSZW5kZXJpbmc6IGVhY2ggYXNzZXQgc2hvdWxkIHJlbmRlciBhbiBzdmcuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3RhdGljIGFzc2V0cyB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYXNzZXRzID0gW1xuICAgICAgICA8Q29tbXVuaXR5IGtleT1cImNvbW11bml0eVwiIC8+LFxuICAgICAgICA8RW50ZXJwcmlzZSBrZXk9XCJlbnRlcnByaXNlXCIgLz4sXG4gICAgICAgIDxFbnRlcnByaXNlTm9pc2Uga2V5PVwiZW50ZXJwcmlzZS1ub2lzZVwiIC8+LFxuICAgICAgICA8Tm9pc2VCb3R0b20ga2V5PVwibm9pc2UtYm90dG9tXCIgLz4sXG4gICAgICAgIDxOb2lzZVRvcCBrZXk9XCJub2lzZS10b3BcIiAvPixcbiAgICAgICAgPFByZW1pdW0ga2V5PVwicHJlbWl1bVwiIC8+LFxuICAgICAgICA8UHJlbWl1bU5vaXNlIGtleT1cInByZW1pdW0tbm9pc2VcIiAvPixcbiAgICAgICAgPFByb2Zlc3Npb25hbCBrZXk9XCJwcm9mZXNzaW9uYWxcIiAvPixcbiAgICAgICAgPFNhbmRib3gga2V5PVwic2FuZGJveFwiIC8+LFxuICAgICAgICA8VGVhbSBrZXk9XCJ0ZWFtXCIgLz4sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdCAvIEFzc2VydFxuICAgICAgYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyLCB1bm1vdW50IH0gPSByZW5kZXIoYXNzZXQpXG4gICAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHM6IGFjdGl2ZSBzdGF0ZSBzaG91bGQgY2hhbmdlIGZpbGwgY29sb3IgZm9yIHNlbGVjdGFibGUgYXNzZXRzLlxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWN0aXZlIHN0YXRlIGZvciBDbG91ZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENsb3VkIGlzQWN0aXZlIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHJlY3RzID0gQXJyYXkuZnJvbShjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgncmVjdCcpKVxuICAgICAgZXhwZWN0KHJlY3RzLnNvbWUocmVjdCA9PiByZWN0LmdldEF0dHJpYnV0ZSgnZmlsbCcpID09PSAndmFyKC0tY29sb3Itc2Fhcy1kaWZ5LWJsdWUtYWNjZXNzaWJsZSknKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbmFjdGl2ZSBzdGF0ZSBmb3IgU2VsZkhvc3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFNlbGZIb3N0ZWQgaXNBY3RpdmU9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCByZWN0cyA9IEFycmF5LmZyb20oY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3JlY3QnKSlcbiAgICAgIGV4cGVjdChyZWN0cy5zb21lKHJlY3QgPT4gcmVjdC5nZXRBdHRyaWJ1dGUoJ2ZpbGwnKSA9PT0gJ3ZhcigtLWNvbG9yLXRleHQtcHJpbWFyeSknKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19