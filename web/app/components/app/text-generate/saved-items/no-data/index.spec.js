"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
(0, vitest_1.describe)('NoData', () => {
    (0, vitest_1.it)('renders title/description and calls callback when button clicked', () => {
        const handleStart = vitest_1.vi.fn();
        (0, react_1.render)(<index_1.default onStartCreateContent={handleStart}/>);
        const title = react_1.screen.getByText('share.generation.savedNoData.title');
        const description = react_1.screen.getByText('share.generation.savedNoData.description');
        const button = react_1.screen.getByRole('button', { name: 'share.generation.savedNoData.startCreateContent' });
        (0, vitest_1.expect)(title).toBeInTheDocument();
        (0, vitest_1.expect)(description).toBeInTheDocument();
        (0, vitest_1.expect)(button).toBeInTheDocument();
        react_1.fireEvent.click(button);
        (0, vitest_1.expect)(handleStart).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLG1DQUFpRDtBQUVqRCxtQ0FBNEI7QUFFNUIsSUFBQSxpQkFBUSxFQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBQSxXQUFFLEVBQUMsa0VBQWtFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLE1BQU0sV0FBVyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUMzQixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQTtRQUVyRCxNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7UUFDcEUsTUFBTSxXQUFXLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFBO1FBQ2hGLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlEQUFpRCxFQUFFLENBQUMsQ0FBQTtRQUV0RyxJQUFBLGVBQU0sRUFBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2pDLElBQUEsZUFBTSxFQUFDLFdBQVcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUVsQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN2QixJQUFBLGVBQU0sRUFBQyxXQUFXLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM5QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5cbmltcG9ydCBOb0RhdGEgZnJvbSAnLi9pbmRleCdcblxuZGVzY3JpYmUoJ05vRGF0YScsICgpID0+IHtcbiAgaXQoJ3JlbmRlcnMgdGl0bGUvZGVzY3JpcHRpb24gYW5kIGNhbGxzIGNhbGxiYWNrIHdoZW4gYnV0dG9uIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlU3RhcnQgPSB2aS5mbigpXG4gICAgcmVuZGVyKDxOb0RhdGEgb25TdGFydENyZWF0ZUNvbnRlbnQ9e2hhbmRsZVN0YXJ0fSAvPilcblxuICAgIGNvbnN0IHRpdGxlID0gc2NyZWVuLmdldEJ5VGV4dCgnc2hhcmUuZ2VuZXJhdGlvbi5zYXZlZE5vRGF0YS50aXRsZScpXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdzaGFyZS5nZW5lcmF0aW9uLnNhdmVkTm9EYXRhLmRlc2NyaXB0aW9uJylcbiAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdzaGFyZS5nZW5lcmF0aW9uLnNhdmVkTm9EYXRhLnN0YXJ0Q3JlYXRlQ29udGVudCcgfSlcblxuICAgIGV4cGVjdCh0aXRsZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgZXhwZWN0KGhhbmRsZVN0YXJ0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgfSlcbn0pXG4iXX0=