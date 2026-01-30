"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const plan_range_switcher_1 = require("./plan-range-switcher");
let mockTranslations = {};
vi.mock('react-i18next', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useTranslation: () => ({
            t: (key, options) => {
                if (mockTranslations[key])
                    return mockTranslations[key];
                const prefix = options?.ns ? `${options.ns}.` : '';
                return `${prefix}${key}`;
            },
        }),
    };
});
describe('PlanRangeSwitcher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockTranslations = {};
    });
    // Rendering behavior
    describe('Rendering', () => {
        it('should render the annual billing label', () => {
            // Arrange
            (0, react_1.render)(<plan_range_switcher_1.default value={plan_range_switcher_1.PlanRange.monthly} onChange={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.annualBilling')).toBeInTheDocument();
            expect(react_1.screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
        });
    });
    // Prop-driven behavior
    describe('Props', () => {
        it('should switch to yearly when toggled from monthly', () => {
            // Arrange
            const handleChange = vi.fn();
            (0, react_1.render)(<plan_range_switcher_1.default value={plan_range_switcher_1.PlanRange.monthly} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('switch'));
            // Assert
            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange).toHaveBeenCalledWith(plan_range_switcher_1.PlanRange.yearly);
        });
        it('should switch to monthly when toggled from yearly', () => {
            // Arrange
            const handleChange = vi.fn();
            (0, react_1.render)(<plan_range_switcher_1.default value={plan_range_switcher_1.PlanRange.yearly} onChange={handleChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('switch'));
            // Assert
            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange).toHaveBeenCalledWith(plan_range_switcher_1.PlanRange.monthly);
        });
    });
    // Edge case rendering behavior
    describe('Edge Cases', () => {
        it('should render when the translation string is empty', () => {
            // Arrange
            mockTranslations = {
                'billing.plansCommon.annualBilling': '',
            };
            // Act
            const { container } = (0, react_1.render)(<plan_range_switcher_1.default value={plan_range_switcher_1.PlanRange.monthly} onChange={vi.fn()}/>);
            // Assert
            const label = container.querySelector('span');
            expect(label).toBeInTheDocument();
            expect(label?.textContent).toBe('');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhbi1yYW5nZS1zd2l0Y2hlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxhbi1yYW5nZS1zd2l0Y2hlci5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFrRTtBQUNsRSwrQkFBOEI7QUFDOUIsK0RBQW9FO0FBRXBFLElBQUksZ0JBQWdCLEdBQTJCLEVBQUUsQ0FBQTtBQUVqRCxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDaEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQWtDLENBQUE7SUFDckUsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QixFQUFFLEVBQUU7Z0JBQzVDLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDO29CQUN2QixPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUM5QixNQUFNLE1BQU0sR0FBRyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO2dCQUNsRCxPQUFPLEdBQUcsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFBO1lBQzFCLENBQUM7U0FDRixDQUFDO0tBQ0gsQ0FBQTtBQUNILENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtJQUN2QixDQUFDLENBQUMsQ0FBQTtJQUVGLHFCQUFxQjtJQUNyQixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsd0NBQXdDLEVB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QUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUGxhblJhbmdlU3dpdGNoZXIsIHsgUGxhblJhbmdlIH0gZnJvbSAnLi9wbGFuLXJhbmdlLXN3aXRjaGVyJ1xuXG5sZXQgbW9ja1RyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9XG5cbnZpLm1vY2soJ3JlYWN0LWkxOG5leHQnLCBhc3luYyAoaW1wb3J0T3JpZ2luYWwpID0+IHtcbiAgY29uc3QgYWN0dWFsID0gYXdhaXQgaW1wb3J0T3JpZ2luYWw8dHlwZW9mIGltcG9ydCgncmVhY3QtaTE4bmV4dCcpPigpXG4gIHJldHVybiB7XG4gICAgLi4uYWN0dWFsLFxuICAgIHVzZVRyYW5zbGF0aW9uOiAoKSA9PiAoe1xuICAgICAgdDogKGtleTogc3RyaW5nLCBvcHRpb25zPzogeyBucz86IHN0cmluZyB9KSA9PiB7XG4gICAgICAgIGlmIChtb2NrVHJhbnNsYXRpb25zW2tleV0pXG4gICAgICAgICAgcmV0dXJuIG1vY2tUcmFuc2xhdGlvbnNba2V5XVxuICAgICAgICBjb25zdCBwcmVmaXggPSBvcHRpb25zPy5ucyA/IGAke29wdGlvbnMubnN9LmAgOiAnJ1xuICAgICAgICByZXR1cm4gYCR7cHJlZml4fSR7a2V5fWBcbiAgICAgIH0sXG4gICAgfSksXG4gIH1cbn0pXG5cbmRlc2NyaWJlKCdQbGFuUmFuZ2VTd2l0Y2hlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1RyYW5zbGF0aW9ucyA9IHt9XG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIGJlaGF2aW9yXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIGFubnVhbCBiaWxsaW5nIGxhYmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxQbGFuUmFuZ2VTd2l0Y2hlciB2YWx1ZT17UGxhblJhbmdlLm1vbnRobHl9IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5hbm51YWxCaWxsaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSkudG9IYXZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnLCAnZmFsc2UnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcC1kcml2ZW4gYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3dpdGNoIHRvIHllYXJseSB3aGVuIHRvZ2dsZWQgZnJvbSBtb250aGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxQbGFuUmFuZ2VTd2l0Y2hlciB2YWx1ZT17UGxhblJhbmdlLm1vbnRobHl9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChoYW5kbGVDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFBsYW5SYW5nZS55ZWFybHkpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3dpdGNoIHRvIG1vbnRobHkgd2hlbiB0b2dnbGVkIGZyb20geWVhcmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxQbGFuUmFuZ2VTd2l0Y2hlciB2YWx1ZT17UGxhblJhbmdlLnllYXJseX0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KGhhbmRsZUNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoUGxhblJhbmdlLm1vbnRobHkpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZGdlIGNhc2UgcmVuZGVyaW5nIGJlaGF2aW9yXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdoZW4gdGhlIHRyYW5zbGF0aW9uIHN0cmluZyBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tUcmFuc2xhdGlvbnMgPSB7XG4gICAgICAgICdiaWxsaW5nLnBsYW5zQ29tbW9uLmFubnVhbEJpbGxpbmcnOiAnJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbGFuUmFuZ2VTd2l0Y2hlciB2YWx1ZT17UGxhblJhbmdlLm1vbnRobHl9IG9uQ2hhbmdlPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsYWJlbCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJylcbiAgICAgIGV4cGVjdChsYWJlbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGxhYmVsPy50ZXh0Q29udGVudCkudG9CZSgnJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==