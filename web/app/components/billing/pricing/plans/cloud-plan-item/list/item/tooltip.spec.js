"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const tooltip_1 = require("./tooltip");
describe('Tooltip', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering the info tooltip container
    describe('Rendering', () => {
        it('should render the content panel when provide with text', () => {
            // Arrange
            const content = 'Usage resets on the first day of every month.';
            // Act
            (0, react_1.render)(<tooltip_1.default content={content}/>);
            // Assert
            expect(() => react_1.screen.getByText(content)).not.toThrow();
        });
    });
    describe('Icon rendering', () => {
        it('should render the icon when provided with content', () => {
            // Arrange
            const content = 'Tooltips explain each plan detail.';
            // Act
            (0, react_1.render)(<tooltip_1.default content={content}/>);
            // Assert
            expect(react_1.screen.getByTestId('tooltip-icon')).toBeInTheDocument();
        });
    });
    // Handling empty strings while keeping structure consistent
    describe('Edge cases', () => {
        it('should render without crashing when passed empty content', () => {
            // Arrange
            const content = '';
            // Act and Assert
            expect(() => (0, react_1.render)(<tooltip_1.default content={content}/>)).not.toThrow();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidG9vbHRpcC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUF1RDtBQUN2RCx1Q0FBK0I7QUFFL0IsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLHVDQUF1QztJQUN2QyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1lBQ2hFLFVBQVU7WUFDVixNQUFNLE9BQU8sR0FBRywrQ0FBK0MsQ0FBQTtZQUUvRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyQyxTQUFTO1lBQ1QsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDdkQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxVQUFVO1lBQ1YsTUFBTSxPQUFPLEdBQUcsb0NBQW9DLENBQUE7WUFFcEQsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckMsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNERBQTREO0lBQzVELFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7WUFDbEUsVUFBVTtZQUNWLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQTtZQUVsQixpQkFBaUI7WUFDakIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsY0FBTSxFQUFDLENBQUMsaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDbkUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi90b29sdGlwJ1xuXG5kZXNjcmliZSgnVG9vbHRpcCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIHRoZSBpbmZvIHRvb2x0aXAgY29udGFpbmVyXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIGNvbnRlbnQgcGFuZWwgd2hlbiBwcm92aWRlIHdpdGggdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAnVXNhZ2UgcmVzZXRzIG9uIHRoZSBmaXJzdCBkYXkgb2YgZXZlcnkgbW9udGguJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VG9vbHRpcCBjb250ZW50PXtjb250ZW50fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoKCkgPT4gc2NyZWVuLmdldEJ5VGV4dChjb250ZW50KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0ljb24gcmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBpY29uIHdoZW4gcHJvdmlkZWQgd2l0aCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29udGVudCA9ICdUb29sdGlwcyBleHBsYWluIGVhY2ggcGxhbiBkZXRhaWwuJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VG9vbHRpcCBjb250ZW50PXtjb250ZW50fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b29sdGlwLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSGFuZGxpbmcgZW1wdHkgc3RyaW5ncyB3aGlsZSBrZWVwaW5nIHN0cnVjdHVyZSBjb25zaXN0ZW50XG4gIGRlc2NyaWJlKCdFZGdlIGNhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcgd2hlbiBwYXNzZWQgZW1wdHkgY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAnJ1xuXG4gICAgICAvLyBBY3QgYW5kIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8VG9vbHRpcCBjb250ZW50PXtjb250ZW50fSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==