"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('ItemOperation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const renderComponent = (overrides = {}) => {
        const props = {
            isPinned: false,
            isShowDelete: true,
            togglePin: vi.fn(),
            onDelete: vi.fn(),
            ...overrides,
        };
        return {
            props,
            ...(0, react_1.render)(<index_1.default {...props}/>),
        };
    };
    // Rendering: menu items show after opening.
    describe('Rendering', () => {
        it('should render pin and delete actions when menu is open', async () => {
            // Arrange
            renderComponent();
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            // Assert
            expect(await react_1.screen.findByText('explore.sidebar.action.pin')).toBeInTheDocument();
            expect(react_1.screen.getByText('explore.sidebar.action.delete')).toBeInTheDocument();
        });
    });
    // Props: render optional rename action and pinned label text.
    describe('Props', () => {
        it('should render rename action when isShowRenameConversation is true', async () => {
            // Arrange
            renderComponent({ isShowRenameConversation: true });
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            // Assert
            expect(await react_1.screen.findByText('explore.sidebar.action.rename')).toBeInTheDocument();
        });
        it('should render unpin label when isPinned is true', async () => {
            // Arrange
            renderComponent({ isPinned: true });
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            // Assert
            expect(await react_1.screen.findByText('explore.sidebar.action.unpin')).toBeInTheDocument();
        });
    });
    // User interactions: clicking action items triggers callbacks.
    describe('User Interactions', () => {
        it('should call togglePin when clicking pin action', async () => {
            // Arrange
            const { props } = renderComponent();
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            react_1.fireEvent.click(await react_1.screen.findByText('explore.sidebar.action.pin'));
            // Assert
            expect(props.togglePin).toHaveBeenCalledTimes(1);
        });
        it('should call onDelete when clicking delete action', async () => {
            // Arrange
            const { props } = renderComponent();
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            react_1.fireEvent.click(await react_1.screen.findByText('explore.sidebar.action.delete'));
            // Assert
            expect(props.onDelete).toHaveBeenCalledTimes(1);
        });
    });
    // Edge cases: menu closes after mouse leave when no hovering state remains.
    describe('Edge Cases', () => {
        it('should close the menu when mouse leaves the panel and item is not hovering', async () => {
            // Arrange
            renderComponent();
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            const pinText = await react_1.screen.findByText('explore.sidebar.action.pin');
            const menu = pinText.closest('div')?.parentElement;
            // Act
            react_1.fireEvent.mouseEnter(menu);
            react_1.fireEvent.mouseLeave(menu);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('explore.sidebar.action.pin')).not.toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLG1DQUFtQztBQUVuQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxZQUFpRSxFQUFFLEVBQUUsRUFBRTtRQUM5RixNQUFNLEtBQUssR0FBK0M7WUFDeEQsUUFBUSxFQUFFLEtBQUs7WUFDZixZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQixRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqQixHQUFHLFNBQVM7U0FDYixDQUFBO1FBQ0QsT0FBTztZQUNMLEtBQUs7WUFDTCxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQztTQUN4QyxDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsNENBQTRDO0lBQzVDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN0RSxVQUFVO1lBQ1YsZUFBZSxFQUFFLENBQUE7WUFFakIsTUFBTTtZQUNOLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO1lBRTdELFNBQVM7WUFDVCxNQUFNLENBQUMsTUFBTSxjQUFNLENBQUMsVUFBVSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2pGLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFD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QyxFQUFFLGFBQTRCLENBQUE7WUFFakUsTUFBTTtZQUNOLGlCQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzFCLGlCQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTFCLFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xGLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgSXRlbU9wZXJhdGlvbiBmcm9tICcuL2luZGV4J1xuXG5kZXNjcmliZSgnSXRlbU9wZXJhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKG92ZXJyaWRlczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgSXRlbU9wZXJhdGlvbj4+ID0ge30pID0+IHtcbiAgICBjb25zdCBwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIEl0ZW1PcGVyYXRpb24+ID0ge1xuICAgICAgaXNQaW5uZWQ6IGZhbHNlLFxuICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgdG9nZ2xlUGluOiB2aS5mbigpLFxuICAgICAgb25EZWxldGU6IHZpLmZuKCksXG4gICAgICAuLi5vdmVycmlkZXMsXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBwcm9wcyxcbiAgICAgIC4uLnJlbmRlcig8SXRlbU9wZXJhdGlvbiB7Li4ucHJvcHN9IC8+KSxcbiAgICB9XG4gIH1cblxuICAvLyBSZW5kZXJpbmc6IG1lbnUgaXRlbXMgc2hvdyBhZnRlciBvcGVuaW5nLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBpbiBhbmQgZGVsZXRlIGFjdGlvbnMgd2hlbiBtZW51IGlzIG9wZW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tb3BlcmF0aW9uLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci5hY3Rpb24ucGluJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdleHBsb3JlLnNpZGViYXIuYWN0aW9uLmRlbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wczogcmVuZGVyIG9wdGlvbmFsIHJlbmFtZSBhY3Rpb24gYW5kIHBpbm5lZCBsYWJlbCB0ZXh0LlxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmVuYW1lIGFjdGlvbiB3aGVuIGlzU2hvd1JlbmFtZUNvbnZlcnNhdGlvbiBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgaXNTaG93UmVuYW1lQ29udmVyc2F0aW9uOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1vcGVyYXRpb24tdHJpZ2dlcicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnZXhwbG9yZS5zaWRlYmFyLmFjdGlvbi5yZW5hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB1bnBpbiBsYWJlbCB3aGVuIGlzUGlubmVkIGlzIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBpc1Bpbm5lZDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tb3BlcmF0aW9uLXRyaWdnZXInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci5hY3Rpb24udW5waW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBpbnRlcmFjdGlvbnM6IGNsaWNraW5nIGFjdGlvbiBpdGVtcyB0cmlnZ2VycyBjYWxsYmFja3MuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdG9nZ2xlUGluIHdoZW4gY2xpY2tpbmcgcGluIGFjdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcHJvcHMgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1vcGVyYXRpb24tdHJpZ2dlcicpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdleHBsb3JlLnNpZGViYXIuYWN0aW9uLnBpbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChwcm9wcy50b2dnbGVQaW4pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25EZWxldGUgd2hlbiBjbGlja2luZyBkZWxldGUgYWN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBwcm9wcyB9ID0gcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLW9wZXJhdGlvbi10cmlnZ2VyJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci5hY3Rpb24uZGVsZXRlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHByb3BzLm9uRGVsZXRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgY2FzZXM6IG1lbnUgY2xvc2VzIGFmdGVyIG1vdXNlIGxlYXZlIHdoZW4gbm8gaG92ZXJpbmcgc3RhdGUgcmVtYWlucy5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjbG9zZSB0aGUgbWVudSB3aGVuIG1vdXNlIGxlYXZlcyB0aGUgcGFuZWwgYW5kIGl0ZW0gaXMgbm90IGhvdmVyaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2l0ZW0tb3BlcmF0aW9uLXRyaWdnZXInKSlcbiAgICAgIGNvbnN0IHBpblRleHQgPSBhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnZXhwbG9yZS5zaWRlYmFyLmFjdGlvbi5waW4nKVxuICAgICAgY29uc3QgbWVudSA9IHBpblRleHQuY2xvc2VzdCgnZGl2Jyk/LnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnRcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQubW91c2VFbnRlcihtZW51KVxuICAgICAgZmlyZUV2ZW50Lm1vdXNlTGVhdmUobWVudSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZXhwbG9yZS5zaWRlYmFyLmFjdGlvbi5waW4nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=