"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const category_1 = require("./category");
describe('Category', () => {
    const allCategoriesEn = 'Recommended';
    const renderComponent = (overrides = {}) => {
        const props = {
            list: ['Writing', 'Recommended'],
            value: allCategoriesEn,
            onChange: vi.fn(),
            allCategoriesEn,
            ...overrides,
        };
        return {
            props,
            ...(0, react_1.render)(<category_1.default {...props}/>),
        };
    };
    // Rendering: basic categories and all-categories button.
    describe('Rendering', () => {
        it('should render all categories item and translated categories', () => {
            // Arrange
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('explore.apps.allCategories')).toBeInTheDocument();
            expect(react_1.screen.getByText('explore.category.Writing')).toBeInTheDocument();
        });
        it('should not render allCategoriesEn again inside the category list', () => {
            // Arrange
            renderComponent();
            // Assert
            const recommendedItems = react_1.screen.getAllByText('explore.apps.allCategories');
            expect(recommendedItems).toHaveLength(1);
        });
    });
    // Props: clicking items triggers onChange.
    describe('Props', () => {
        it('should call onChange with category value when category item is clicked', () => {
            // Arrange
            const { props } = renderComponent();
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('explore.category.Writing'));
            // Assert
            expect(props.onChange).toHaveBeenCalledWith('Writing');
        });
        it('should call onChange with allCategoriesEn when all categories is clicked', () => {
            // Arrange
            const { props } = renderComponent({ value: 'Writing' });
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('explore.apps.allCategories'));
            // Assert
            expect(props.onChange).toHaveBeenCalledWith(allCategoriesEn);
        });
    });
    // Edge cases: handle values not in the list.
    describe('Edge Cases', () => {
        it('should treat unknown value as all categories selection', () => {
            // Arrange
            renderComponent({ value: 'Unknown' });
            // Assert
            const allCategoriesItem = react_1.screen.getByText('explore.apps.allCategories');
            expect(allCategoriesItem.className).toContain('bg-components-main-nav-nav-button-bg-active');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhdGVnb3J5LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLHlDQUFpQztBQUVqQyxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixNQUFNLGVBQWUsR0FBRyxhQUFhLENBQUE7SUFFckMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxZQUE0RCxFQUFFLEVBQUUsRUFBRTtRQUN6RixNQUFNLEtBQUssR0FBMEM7WUFDbkQsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBa0I7WUFDakQsS0FBSyxFQUFFLGVBQWU7WUFDdEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakIsZUFBZTtZQUNmLEdBQUcsU0FBUztTQUNiLENBQUE7UUFDRCxPQUFPO1lBQ0wsS0FBSztZQUNMLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxrQkFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQztTQUNuQyxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBRUQseURBQXlEO0lBQ3pELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDckUsVUFBVTtZQUNWLGVBQWUsRUFBRSxDQUFBO1lBRWpCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMxRSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7WUFDMUUsVUFBVTtZQUNWLGVBQWUsRUFBRSxDQUFBO1lBRWpCLFNBQVM7WUFDVCxNQUFNLGdCQUFnQixHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtZQUMxRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDJDQUEyQztJQUMzQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUNyQixFQUFFLENBQUMsd0VBQXdFLEVBQUUsR0FBRyxFQUFFO1lBQ2hGLFVBQVU7WUFDVixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUE7WUFFbkMsTUFBTTtZQUNOLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFBO1lBRTdELFNBQVM7WUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBFQUEwRSxFQUFFLEdBQUcsRUFBRTtZQUNsRixVQUFVO1lBQ1YsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBRXZELE1BQU07WUFDTixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQTtZQUUvRCxTQUFTO1lBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkNBQTZDO0lBQzdDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxHQUFHLEVBQUU7WUFDaEUsVUFBVTtZQUNWLGVBQWUsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBRXJDLFNBQVM7WUFDVCxNQUFNLGlCQUFpQixHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtZQUN4RSxNQUFNLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUE7UUFDOUYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBDYXRlZ29yeSB9IGZyb20gJ0AvbW9kZWxzL2V4cGxvcmUnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCBDYXRlZ29yeSBmcm9tICcuL2NhdGVnb3J5J1xuXG5kZXNjcmliZSgnQ2F0ZWdvcnknLCAoKSA9PiB7XG4gIGNvbnN0IGFsbENhdGVnb3JpZXNFbiA9ICdSZWNvbW1lbmRlZCdcblxuICBjb25zdCByZW5kZXJDb21wb25lbnQgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBDYXRlZ29yeT4+ID0ge30pID0+IHtcbiAgICBjb25zdCBwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIENhdGVnb3J5PiA9IHtcbiAgICAgIGxpc3Q6IFsnV3JpdGluZycsICdSZWNvbW1lbmRlZCddIGFzIEFwcENhdGVnb3J5W10sXG4gICAgICB2YWx1ZTogYWxsQ2F0ZWdvcmllc0VuLFxuICAgICAgb25DaGFuZ2U6IHZpLmZuKCksXG4gICAgICBhbGxDYXRlZ29yaWVzRW4sXG4gICAgICAuLi5vdmVycmlkZXMsXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBwcm9wcyxcbiAgICAgIC4uLnJlbmRlcig8Q2F0ZWdvcnkgey4uLnByb3BzfSAvPiksXG4gICAgfVxuICB9XG5cbiAgLy8gUmVuZGVyaW5nOiBiYXNpYyBjYXRlZ29yaWVzIGFuZCBhbGwtY2F0ZWdvcmllcyBidXR0b24uXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGNhdGVnb3JpZXMgaXRlbSBhbmQgdHJhbnNsYXRlZCBjYXRlZ29yaWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZXhwbG9yZS5hcHBzLmFsbENhdGVnb3JpZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2V4cGxvcmUuY2F0ZWdvcnkuV3JpdGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBhbGxDYXRlZ29yaWVzRW4gYWdhaW4gaW5zaWRlIHRoZSBjYXRlZ29yeSBsaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCByZWNvbW1lbmRlZEl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnZXhwbG9yZS5hcHBzLmFsbENhdGVnb3JpZXMnKVxuICAgICAgZXhwZWN0KHJlY29tbWVuZGVkSXRlbXMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHM6IGNsaWNraW5nIGl0ZW1zIHRyaWdnZXJzIG9uQ2hhbmdlLlxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggY2F0ZWdvcnkgdmFsdWUgd2hlbiBjYXRlZ29yeSBpdGVtIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHByb3BzIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdleHBsb3JlLmNhdGVnb3J5LldyaXRpbmcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocHJvcHMub25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdXcml0aW5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggYWxsQ2F0ZWdvcmllc0VuIHdoZW4gYWxsIGNhdGVnb3JpZXMgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcHJvcHMgfSA9IHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiAnV3JpdGluZycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZXhwbG9yZS5hcHBzLmFsbENhdGVnb3JpZXMnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocHJvcHMub25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGFsbENhdGVnb3JpZXNFbilcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgY2FzZXM6IGhhbmRsZSB2YWx1ZXMgbm90IGluIHRoZSBsaXN0LlxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyZWF0IHVua25vd24gdmFsdWUgYXMgYWxsIGNhdGVnb3JpZXMgc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6ICdVbmtub3duJyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFsbENhdGVnb3JpZXNJdGVtID0gc2NyZWVuLmdldEJ5VGV4dCgnZXhwbG9yZS5hcHBzLmFsbENhdGVnb3JpZXMnKVxuICAgICAgZXhwZWN0KGFsbENhdGVnb3JpZXNJdGVtLmNsYXNzTmFtZSkudG9Db250YWluKCdiZy1jb21wb25lbnRzLW1haW4tbmF2LW5hdi1idXR0b24tYmctYWN0aXZlJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==