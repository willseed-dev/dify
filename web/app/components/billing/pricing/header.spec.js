"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const header_1 = require("./header");
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
describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockTranslations = {};
    });
    // Rendering behavior
    describe('Rendering', () => {
        it('should render title and description translations', () => {
            // Arrange
            const handleClose = vi.fn();
            // Act
            (0, react_1.render)(<header_1.default onClose={handleClose}/>);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.title.plans')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.plansCommon.title.description')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    // Prop-driven behavior
    describe('Props', () => {
        it('should invoke onClose when close button is clicked', () => {
            // Arrange
            const handleClose = vi.fn();
            (0, react_1.render)(<header_1.default onClose={handleClose}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(handleClose).toHaveBeenCalledTimes(1);
        });
    });
    // Edge case rendering behavior
    describe('Edge Cases', () => {
        it('should render structure when translations are empty strings', () => {
            // Arrange
            mockTranslations = {
                'billing.plansCommon.title.plans': '',
                'billing.plansCommon.title.description': '',
            };
            // Act
            const { container } = (0, react_1.render)(<header_1.default onClose={vi.fn()}/>);
            // Assert
            expect(container.querySelector('span')).toBeInTheDocument();
            expect(container.querySelector('p')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFkZXIuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBa0U7QUFDbEUsK0JBQThCO0FBQzlCLHFDQUE2QjtBQUU3QixJQUFJLGdCQUFnQixHQUEyQixFQUFFLENBQUE7QUFFakQsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUFFO0lBQ2hELE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxFQUFrQyxDQUFBO0lBQ3JFLE9BQU87UUFDTCxHQUFHLE1BQU07UUFDVCxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNyQixDQUFDLEVBQUUsQ0FBQyxHQUFXLEVBQUUsT0FBeUIsRUFBRSxFQUFFO2dCQUM1QyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQztvQkFDdkIsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDOUIsTUFBTSxNQUFNLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDbEQsT0FBTyxHQUFHLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQTtZQUMxQixDQUFDO1NBQ0YsQ0FBQztLQUNILENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbEIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFBO0lBRUYscUJBQXFCO0lBQ3JCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsVUFBVTtZQUNWLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUUzQixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUV4QyxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0UsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRix1QkFBdUI7SUFDdkIsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtZQUM1RCxVQUFVO1lBQ1YsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQzNCLElBQUEsY0FBTSxFQUFDLENBQUMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFeEMsTUFBTTtZQUNOLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUUzQyxTQUFTO1lBQ1QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiwrQkFBK0I7SUFDL0IsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxVQUFVO1lBQ1YsZ0JBQWdCLEdBQUc7Z0JBQ2pCLGlDQUFpQyxFQUFFLEVBQUU7Z0JBQ3JDLHVDQUF1QyxFQUFFLEVBQUU7YUFDNUMsQ0FBQTtZQUVELE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUUxRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9oZWFkZXInXG5cbmxldCBtb2NrVHJhbnNsYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cblxudmkubW9jaygncmVhY3QtaTE4bmV4dCcsIGFzeW5jIChpbXBvcnRPcmlnaW5hbCkgPT4ge1xuICBjb25zdCBhY3R1YWwgPSBhd2FpdCBpbXBvcnRPcmlnaW5hbDx0eXBlb2YgaW1wb3J0KCdyZWFjdC1pMThuZXh0Jyk+KClcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3R1YWwsXG4gICAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgaWYgKG1vY2tUcmFuc2xhdGlvbnNba2V5XSlcbiAgICAgICAgICByZXR1cm4gbW9ja1RyYW5zbGF0aW9uc1trZXldXG4gICAgICAgIGNvbnN0IHByZWZpeCA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uYCA6ICcnXG4gICAgICAgIHJldHVybiBgJHtwcmVmaXh9JHtrZXl9YFxuICAgICAgfSxcbiAgICB9KSxcbiAgfVxufSlcblxuZGVzY3JpYmUoJ0hlYWRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1RyYW5zbGF0aW9ucyA9IHt9XG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIGJlaGF2aW9yXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgYW5kIGRlc2NyaXB0aW9uIHRyYW5zbGF0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGhhbmRsZUNsb3NlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIG9uQ2xvc2U9e2hhbmRsZUNsb3NlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi50aXRsZS5wbGFucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi50aXRsZS5kZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFByb3AtZHJpdmVuIGJlaGF2aW9yXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGludm9rZSBvbkNsb3NlIHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoYW5kbGVDbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SGVhZGVyIG9uQ2xvc2U9e2hhbmRsZUNsb3NlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgY2FzZSByZW5kZXJpbmcgYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3RydWN0dXJlIHdoZW4gdHJhbnNsYXRpb25zIGFyZSBlbXB0eSBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1RyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgJ2JpbGxpbmcucGxhbnNDb21tb24udGl0bGUucGxhbnMnOiAnJyxcbiAgICAgICAgJ2JpbGxpbmcucGxhbnNDb21tb24udGl0bGUuZGVzY3JpcHRpb24nOiAnJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcigncCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==