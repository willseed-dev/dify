"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// Mock useDocLink from context
const mockDocLink = vi.fn((path) => `https://docs.dify.ai/en-US${path || ''}`);
vi.mock('@/context/i18n', () => ({
    useDocLink: () => mockDocLink,
}));
// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
    value: mockWindowOpen,
    writable: true,
});
describe('CustomizeModal', () => {
    const defaultProps = {
        isShow: true,
        onClose: vi.fn(),
        api_base_url: 'https://api.example.com',
        appId: 'test-app-id-123',
        mode: app_1.AppModeEnum.CHAT,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests - verify component renders correctly with various configurations
    describe('Rendering', () => {
        it('should render without crashing when isShow is true', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.title')).toBeInTheDocument();
            });
        });
        it('should not render content when isShow is false', async () => {
            // Arrange
            const props = { ...defaultProps, isShow: false };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('appOverview.overview.appInfo.customize.title')).not.toBeInTheDocument();
            });
        });
        it('should render modal description', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.explanation')).toBeInTheDocument();
            });
        });
        it('should render way 1 and way 2 tags', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way 2')).toBeInTheDocument();
            });
        });
        it('should render all step numbers (1, 2, 3)', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('1')).toBeInTheDocument();
                expect(react_1.screen.getByText('2')).toBeInTheDocument();
                expect(react_1.screen.getByText('3')).toBeInTheDocument();
            });
        });
        it('should render step instructions', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way1.step1')).toBeInTheDocument();
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way1.step2')).toBeInTheDocument();
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way1.step3')).toBeInTheDocument();
            });
        });
        it('should render environment variables with appId and api_base_url', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_APP_ID/i).closest('pre');
                expect(preElement).toBeInTheDocument();
                expect(preElement?.textContent).toContain('NEXT_PUBLIC_APP_ID=\'test-app-id-123\'');
                expect(preElement?.textContent).toContain('NEXT_PUBLIC_API_URL=\'https://api.example.com\'');
            });
        });
        it('should render GitHub icon in step 1 button', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - find the GitHub link and verify it contains an SVG icon
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toBeInTheDocument();
                expect(githubLink.querySelector('svg')).toBeInTheDocument();
            });
        });
    });
    // Props tests - verify props are correctly applied
    describe('Props', () => {
        it('should display correct appId in environment variables', async () => {
            // Arrange
            const customAppId = 'custom-app-id-456';
            const props = { ...defaultProps, appId: customAppId };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_APP_ID/i).closest('pre');
                expect(preElement?.textContent).toContain(`NEXT_PUBLIC_APP_ID='${customAppId}'`);
            });
        });
        it('should display correct api_base_url in environment variables', async () => {
            // Arrange
            const customApiUrl = 'https://custom-api.example.com';
            const props = { ...defaultProps, api_base_url: customApiUrl };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_API_URL/i).closest('pre');
                expect(preElement?.textContent).toContain(`NEXT_PUBLIC_API_URL='${customApiUrl}'`);
            });
        });
    });
    // Mode-based conditional rendering tests - verify GitHub link changes based on app mode
    describe('Mode-based GitHub link', () => {
        it('should link to webapp-conversation repo for CHAT mode', async () => {
            // Arrange
            const props = { ...defaultProps, mode: app_1.AppModeEnum.CHAT };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('href', 'https://github.com/langgenius/webapp-conversation');
            });
        });
        it('should link to webapp-conversation repo for ADVANCED_CHAT mode', async () => {
            // Arrange
            const props = { ...defaultProps, mode: app_1.AppModeEnum.ADVANCED_CHAT };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('href', 'https://github.com/langgenius/webapp-conversation');
            });
        });
        it('should link to webapp-text-generator repo for COMPLETION mode', async () => {
            // Arrange
            const props = { ...defaultProps, mode: app_1.AppModeEnum.COMPLETION };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('href', 'https://github.com/langgenius/webapp-text-generator');
            });
        });
        it('should link to webapp-text-generator repo for WORKFLOW mode', async () => {
            // Arrange
            const props = { ...defaultProps, mode: app_1.AppModeEnum.WORKFLOW };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('href', 'https://github.com/langgenius/webapp-text-generator');
            });
        });
        it('should link to webapp-text-generator repo for AGENT_CHAT mode', async () => {
            // Arrange
            const props = { ...defaultProps, mode: app_1.AppModeEnum.AGENT_CHAT };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('href', 'https://github.com/langgenius/webapp-text-generator');
            });
        });
    });
    // External links tests - verify external links have correct security attributes
    describe('External links', () => {
        it('should have GitHub repo link that opens in new tab', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                expect(githubLink).toHaveAttribute('target', '_blank');
                expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });
        it('should have Vercel docs link that opens in new tab', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const vercelLink = react_1.screen.getByRole('link', { name: /step2Operation/i });
                expect(vercelLink).toHaveAttribute('href', 'https://vercel.com/docs/concepts/deployments/git/vercel-for-github');
                expect(vercelLink).toHaveAttribute('target', '_blank');
                expect(vercelLink).toHaveAttribute('rel', 'noopener noreferrer');
            });
        });
    });
    // User interactions tests - verify user actions trigger expected behaviors
    describe('User Interactions', () => {
        it('should call window.open with doc link when way 2 button is clicked', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.way2.operation')).toBeInTheDocument();
            });
            const way2Button = react_1.screen.getByText('appOverview.overview.appInfo.customize.way2.operation').closest('button');
            expect(way2Button).toBeInTheDocument();
            react_1.fireEvent.click(way2Button);
            // Assert
            expect(mockWindowOpen).toHaveBeenCalledTimes(1);
            expect(mockWindowOpen).toHaveBeenCalledWith(expect.stringContaining('/guides/application-publishing/developing-with-apis'), '_blank');
        });
        it('should call onClose when modal close button is clicked', async () => {
            // Arrange
            const onClose = vi.fn();
            const props = { ...defaultProps, onClose };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for modal to be fully rendered
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appOverview.overview.appInfo.customize.title')).toBeInTheDocument();
            });
            // Find the close button by navigating from the heading to the close icon
            // The close icon is an SVG inside a sibling div of the title
            const heading = react_1.screen.getByRole('heading', { name: /customize\.title/i });
            const closeIcon = heading.parentElement.querySelector('svg');
            // Assert - closeIcon must exist for the test to be valid
            expect(closeIcon).toBeInTheDocument();
            react_1.fireEvent.click(closeIcon);
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
    // Edge cases tests - verify component handles boundary conditions
    describe('Edge Cases', () => {
        it('should handle empty appId', async () => {
            // Arrange
            const props = { ...defaultProps, appId: '' };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_APP_ID/i).closest('pre');
                expect(preElement?.textContent).toContain('NEXT_PUBLIC_APP_ID=\'\'');
            });
        });
        it('should handle empty api_base_url', async () => {
            // Arrange
            const props = { ...defaultProps, api_base_url: '' };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_API_URL/i).closest('pre');
                expect(preElement?.textContent).toContain('NEXT_PUBLIC_API_URL=\'\'');
            });
        });
        it('should handle special characters in appId', async () => {
            // Arrange
            const specialAppId = 'app-id-with-special-chars_123';
            const props = { ...defaultProps, appId: specialAppId };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_APP_ID/i).closest('pre');
                expect(preElement?.textContent).toContain(`NEXT_PUBLIC_APP_ID='${specialAppId}'`);
            });
        });
        it('should handle URL with special characters in api_base_url', async () => {
            // Arrange
            const specialApiUrl = 'https://api.example.com:8080/v1';
            const props = { ...defaultProps, api_base_url: specialApiUrl };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                const preElement = react_1.screen.getByText(/NEXT_PUBLIC_API_URL/i).closest('pre');
                expect(preElement?.textContent).toContain(`NEXT_PUBLIC_API_URL='${specialApiUrl}'`);
            });
        });
    });
    // StepNum component tests - verify step number styling
    describe('StepNum component', () => {
        it('should render step numbers with correct styling class', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - The StepNum component is the direct container of the text
            await (0, react_1.waitFor)(() => {
                const stepNumber1 = react_1.screen.getByText('1');
                expect(stepNumber1).toHaveClass('rounded-2xl');
            });
        });
    });
    // GithubIcon component tests - verify GitHub icon renders correctly
    describe('GithubIcon component', () => {
        it('should render GitHub icon SVG within GitHub link button', async () => {
            // Arrange
            const props = { ...defaultProps };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Find GitHub link and verify it contains an SVG icon with expected class
            await (0, react_1.waitFor)(() => {
                const githubLink = react_1.screen.getByRole('link', { name: /step1Operation/i });
                const githubIcon = githubLink.querySelector('svg');
                expect(githubIcon).toBeInTheDocument();
                expect(githubIcon).toHaveClass('text-text-secondary');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLHFDQUF5QztBQUN6QyxtQ0FBb0M7QUFFcEMsK0JBQStCO0FBQy9CLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFhLEVBQUUsRUFBRSxDQUFDLDZCQUE2QixJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN2RixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVc7Q0FDOUIsQ0FBQyxDQUFDLENBQUE7QUFFSCxtQkFBbUI7QUFDbkIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzlCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNwQyxLQUFLLEVBQUUsY0FBYztJQUNyQixRQUFRLEVBQUUsSUFBSTtDQUNmLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsTUFBTSxZQUFZLEdBQUc7UUFDbkIsTUFBTSxFQUFFLElBQUk7UUFDWixPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoQixZQUFZLEVBQUUseUJBQXlCO1FBQ3ZDLEtBQUssRUFBRSxpQkFBaUI7UUFDeEIsSUFBSSxFQUFFLGlCQUFXLENBQUMsSUFBSTtLQUN2QixDQUFBO0lBRUQsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLG1GQUFtRjtJQUNuRixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJ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SUFDcEUsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxFQUFFLENBQUMseURBQXlELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdkUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsQ0FBQTtZQUVqQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFjLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckMsbUZBQW1GO1lBQ25GLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLFVBQVUsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUE7Z0JBQ3hFLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ2xELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO2dCQUN0QyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUE7WUFDdkQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgQ3VzdG9taXplTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayB1c2VEb2NMaW5rIGZyb20gY29udGV4dFxuY29uc3QgbW9ja0RvY0xpbmsgPSB2aS5mbigocGF0aD86IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5kaWZ5LmFpL2VuLVVTJHtwYXRoIHx8ICcnfWApXG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZURvY0xpbms6ICgpID0+IG1vY2tEb2NMaW5rLFxufSkpXG5cbi8vIE1vY2sgd2luZG93Lm9wZW5cbmNvbnN0IG1vY2tXaW5kb3dPcGVuID0gdmkuZm4oKVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ29wZW4nLCB7XG4gIHZhbHVlOiBtb2NrV2luZG93T3BlbixcbiAgd3JpdGFibGU6IHRydWUsXG59KVxuXG5kZXNjcmliZSgnQ3VzdG9taXplTW9kYWwnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc1Nob3c6IHRydWUsXG4gICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICBhcGlfYmFzZV91cmw6ICdodHRwczovL2FwaS5leGFtcGxlLmNvbScsXG4gICAgYXBwSWQ6ICd0ZXN0LWFwcC1pZC0xMjMnLFxuICAgIG1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgdGVzdHMgLSB2ZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5IHdpdGggdmFyaW91cyBjb25maWd1cmF0aW9uc1xuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcgd2hlbiBpc1Nob3cgaXMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uY3VzdG9taXplLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjb250ZW50IHdoZW4gaXNTaG93IGlzIGZhbHNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgaXNTaG93OiBmYWxzZSB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdhcHBPdmVydmlldy5vdmVydmlldy5hcHBJbmZvLmN1c3RvbWl6ZS50aXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgZGVzY3JpcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBPdmVydmlldy5vdmVydmlldy5hcHBJbmZvLmN1c3RvbWl6ZS5leHBsYW5hdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3YXkgMSBhbmQgd2F5IDIgdGFncycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uY3VzdG9taXplLndheSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uY3VzdG9taXplLndheSAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBzdGVwIG51bWJlcnMgKDEsIDIsIDMpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3RlcCBpbnN0cnVjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBPdmVydmlldy5vdmVydmlldy5hcHBJbmZvLmN1c3RvbWl6ZS53YXkxLnN0ZXAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uY3VzdG9taXplLndheTEuc3RlcDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwT3ZlcnZpZXcub3ZlcnZpZXcuYXBwSW5mby5jdXN0b21pemUud2F5MS5zdGVwMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2l0aCBhcHBJZCBhbmQgYXBpX2Jhc2VfdXJsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvTkVYVF9QVUJMSUNfQVBQX0lEL2kpLmNsb3Nlc3QoJ3ByZScpXG4gICAgICAgIGV4cGVjdChwcmVFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChwcmVFbGVtZW50Py50ZXh0Q29udGVudCkudG9Db250YWluKCdORVhUX1BVQkxJQ19BUFBfSUQ9XFwndGVzdC1hcHAtaWQtMTIzXFwnJylcbiAgICAgICAgZXhwZWN0KHByZUVsZW1lbnQ/LnRleHRDb250ZW50KS50b0NvbnRhaW4oJ05FWFRfUFVCTElDX0FQSV9VUkw9XFwnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb21cXCcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgR2l0SHViIGljb24gaW4gc3RlcCAxIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gZmluZCB0aGUgR2l0SHViIGxpbmsgYW5kIHZlcmlmeSBpdCBjb250YWlucyBhbiBTVkcgaWNvblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdpdGh1YkxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvc3RlcDFPcGVyYXRpb24vaSB9KVxuICAgICAgICBleHBlY3QoZ2l0aHViTGluaykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3QoZ2l0aHViTGluay5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFByb3BzIHRlc3RzIC0gdmVyaWZ5IHByb3BzIGFyZSBjb3JyZWN0bHkgYXBwbGllZFxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgYXBwSWQgaW4gZW52aXJvbm1lbnQgdmFyaWFibGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3VzdG9tQXBwSWQgPSAnY3VzdG9tLWFwcC1pZC00NTYnXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBhcHBJZDogY3VzdG9tQXBwSWQgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgcHJlRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoL05FWFRfUFVCTElDX0FQUF9JRC9pKS5jbG9zZXN0KCdwcmUnKVxuICAgICAgICBleHBlY3QocHJlRWxlbWVudD8udGV4dENvbnRlbnQpLnRvQ29udGFpbihgTkVYVF9QVUJMSUNfQVBQX0lEPScke2N1c3RvbUFwcElkfSdgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgYXBpX2Jhc2VfdXJsIGluIGVudmlyb25tZW50IHZhcmlhYmxlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbUFwaVVybCA9ICdodHRwczovL2N1c3RvbS1hcGkuZXhhbXBsZS5jb20nXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBhcGlfYmFzZV91cmw6IGN1c3RvbUFwaVVybCB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvTkVYVF9QVUJMSUNfQVBJX1VSTC9pKS5jbG9zZXN0KCdwcmUnKVxuICAgICAgICBleHBlY3QocHJlRWxlbWVudD8udGV4dENvbnRlbnQpLnRvQ29udGFpbihgTkVYVF9QVUJMSUNfQVBJX1VSTD0nJHtjdXN0b21BcGlVcmx9J2ApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gTW9kZS1iYXNlZCBjb25kaXRpb25hbCByZW5kZXJpbmcgdGVzdHMgLSB2ZXJpZnkgR2l0SHViIGxpbmsgY2hhbmdlcyBiYXNlZCBvbiBhcHAgbW9kZVxuICBkZXNjcmliZSgnTW9kZS1iYXNlZCBHaXRIdWIgbGluaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGxpbmsgdG8gd2ViYXBwLWNvbnZlcnNhdGlvbiByZXBvIGZvciBDSEFUIG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBtb2RlOiBBcHBNb2RlRW51bS5DSEFUIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdpdGh1YkxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvc3RlcDFPcGVyYXRpb24vaSB9KVxuICAgICAgICBleHBlY3QoZ2l0aHViTGluaykudG9IYXZlQXR0cmlidXRlKCdocmVmJywgJ2h0dHBzOi8vZ2l0aHViLmNvbS9sYW5nZ2VuaXVzL3dlYmFwcC1jb252ZXJzYXRpb24nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW5rIHRvIHdlYmFwcC1jb252ZXJzYXRpb24gcmVwbyBmb3IgQURWQU5DRURfQ0hBVCBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgbW9kZTogQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBnaXRodWJMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogL3N0ZXAxT3BlcmF0aW9uL2kgfSlcbiAgICAgICAgZXhwZWN0KGdpdGh1YkxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2dpdGh1Yi5jb20vbGFuZ2dlbml1cy93ZWJhcHAtY29udmVyc2F0aW9uJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGluayB0byB3ZWJhcHAtdGV4dC1nZW5lcmF0b3IgcmVwbyBmb3IgQ09NUExFVElPTiBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgbW9kZTogQXBwTW9kZUVudW0uQ09NUExFVElPTiB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBnaXRodWJMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogL3N0ZXAxT3BlcmF0aW9uL2kgfSlcbiAgICAgICAgZXhwZWN0KGdpdGh1YkxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2dpdGh1Yi5jb20vbGFuZ2dlbml1cy93ZWJhcHAtdGV4dC1nZW5lcmF0b3InKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW5rIHRvIHdlYmFwcC10ZXh0LWdlbmVyYXRvciByZXBvIGZvciBXT1JLRkxPVyBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgbW9kZTogQXBwTW9kZUVudW0uV09SS0ZMT1cgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgZ2l0aHViTGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnLCB7IG5hbWU6IC9zdGVwMU9wZXJhdGlvbi9pIH0pXG4gICAgICAgIGV4cGVjdChnaXRodWJMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9naXRodWIuY29tL2xhbmdnZW5pdXMvd2ViYXBwLXRleHQtZ2VuZXJhdG9yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbGluayB0byB3ZWJhcHAtdGV4dC1nZW5lcmF0b3IgcmVwbyBmb3IgQUdFTlRfQ0hBVCBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgbW9kZTogQXBwTW9kZUVudW0uQUdFTlRfQ0hBVCB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBnaXRodWJMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogL3N0ZXAxT3BlcmF0aW9uL2kgfSlcbiAgICAgICAgZXhwZWN0KGdpdGh1YkxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2dpdGh1Yi5jb20vbGFuZ2dlbml1cy93ZWJhcHAtdGV4dC1nZW5lcmF0b3InKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEV4dGVybmFsIGxpbmtzIHRlc3RzIC0gdmVyaWZ5IGV4dGVybmFsIGxpbmtzIGhhdmUgY29ycmVjdCBzZWN1cml0eSBhdHRyaWJ1dGVzXG4gIGRlc2NyaWJlKCdFeHRlcm5hbCBsaW5rcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgR2l0SHViIHJlcG8gbGluayB0aGF0IG9wZW5zIGluIG5ldyB0YWInLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGdpdGh1YkxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvc3RlcDFPcGVyYXRpb24vaSB9KVxuICAgICAgICBleHBlY3QoZ2l0aHViTGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgICAgZXhwZWN0KGdpdGh1YkxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIFZlcmNlbCBkb2NzIGxpbmsgdGhhdCBvcGVucyBpbiBuZXcgdGFiJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCB2ZXJjZWxMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogL3N0ZXAyT3BlcmF0aW9uL2kgfSlcbiAgICAgICAgZXhwZWN0KHZlcmNlbExpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL3ZlcmNlbC5jb20vZG9jcy9jb25jZXB0cy9kZXBsb3ltZW50cy9naXQvdmVyY2VsLWZvci1naXRodWInKVxuICAgICAgICBleHBlY3QodmVyY2VsTGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgICAgZXhwZWN0KHZlcmNlbExpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgaW50ZXJhY3Rpb25zIHRlc3RzIC0gdmVyaWZ5IHVzZXIgYWN0aW9ucyB0cmlnZ2VyIGV4cGVjdGVkIGJlaGF2aW9yc1xuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHdpbmRvdy5vcGVuIHdpdGggZG9jIGxpbmsgd2hlbiB3YXkgMiBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBPdmVydmlldy5vdmVydmlldy5hcHBJbmZvLmN1c3RvbWl6ZS53YXkyLm9wZXJhdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB3YXkyQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnYXBwT3ZlcnZpZXcub3ZlcnZpZXcuYXBwSW5mby5jdXN0b21pemUud2F5Mi5vcGVyYXRpb24nKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KHdheTJCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGZpcmVFdmVudC5jbGljayh3YXkyQnV0dG9uISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1dpbmRvd09wZW4pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tXaW5kb3dPcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJy9ndWlkZXMvYXBwbGljYXRpb24tcHVibGlzaGluZy9kZXZlbG9waW5nLXdpdGgtYXBpcycpLFxuICAgICAgICAnX2JsYW5rJyxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBtb2RhbCBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBvbkNsb3NlIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFdhaXQgZm9yIG1vZGFsIHRvIGJlIGZ1bGx5IHJlbmRlcmVkXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uY3VzdG9taXplLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEZpbmQgdGhlIGNsb3NlIGJ1dHRvbiBieSBuYXZpZ2F0aW5nIGZyb20gdGhlIGhlYWRpbmcgdG8gdGhlIGNsb3NlIGljb25cbiAgICAgIC8vIFRoZSBjbG9zZSBpY29uIGlzIGFuIFNWRyBpbnNpZGUgYSBzaWJsaW5nIGRpdiBvZiB0aGUgdGl0bGVcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdoZWFkaW5nJywgeyBuYW1lOiAvY3VzdG9taXplXFwudGl0bGUvaSB9KVxuICAgICAgY29uc3QgY2xvc2VJY29uID0gaGVhZGluZy5wYXJlbnRFbGVtZW50IS5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuXG4gICAgICAvLyBBc3NlcnQgLSBjbG9zZUljb24gbXVzdCBleGlzdCBmb3IgdGhlIHRlc3QgdG8gYmUgdmFsaWRcbiAgICAgIGV4cGVjdChjbG9zZUljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUljb24hKVxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRnZSBjYXNlcyB0ZXN0cyAtIHZlcmlmeSBjb21wb25lbnQgaGFuZGxlcyBib3VuZGFyeSBjb25kaXRpb25zXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGFwcElkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgYXBwSWQ6ICcnIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEN1c3RvbWl6ZU1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZUVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KC9ORVhUX1BVQkxJQ19BUFBfSUQvaSkuY2xvc2VzdCgncHJlJylcbiAgICAgICAgZXhwZWN0KHByZUVsZW1lbnQ/LnRleHRDb250ZW50KS50b0NvbnRhaW4oJ05FWFRfUFVCTElDX0FQUF9JRD1cXCdcXCcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYXBpX2Jhc2VfdXJsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgYXBpX2Jhc2VfdXJsOiAnJyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvTkVYVF9QVUJMSUNfQVBJX1VSTC9pKS5jbG9zZXN0KCdwcmUnKVxuICAgICAgICBleHBlY3QocHJlRWxlbWVudD8udGV4dENvbnRlbnQpLnRvQ29udGFpbignTkVYVF9QVUJMSUNfQVBJX1VSTD1cXCdcXCcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGFwcElkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbEFwcElkID0gJ2FwcC1pZC13aXRoLXNwZWNpYWwtY2hhcnNfMTIzJ1xuICAgICAgY29uc3QgcHJvcHMgPSB7IC4uLmRlZmF1bHRQcm9wcywgYXBwSWQ6IHNwZWNpYWxBcHBJZCB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvTkVYVF9QVUJMSUNfQVBQX0lEL2kpLmNsb3Nlc3QoJ3ByZScpXG4gICAgICAgIGV4cGVjdChwcmVFbGVtZW50Py50ZXh0Q29udGVudCkudG9Db250YWluKGBORVhUX1BVQkxJQ19BUFBfSUQ9JyR7c3BlY2lhbEFwcElkfSdgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVVJMIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGFwaV9iYXNlX3VybCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNwZWNpYWxBcGlVcmwgPSAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb206ODA4MC92MSdcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMsIGFwaV9iYXNlX3VybDogc3BlY2lhbEFwaVVybCB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDdXN0b21pemVNb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBwcmVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvTkVYVF9QVUJMSUNfQVBJX1VSTC9pKS5jbG9zZXN0KCdwcmUnKVxuICAgICAgICBleHBlY3QocHJlRWxlbWVudD8udGV4dENvbnRlbnQpLnRvQ29udGFpbihgTkVYVF9QVUJMSUNfQVBJX1VSTD0nJHtzcGVjaWFsQXBpVXJsfSdgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFN0ZXBOdW0gY29tcG9uZW50IHRlc3RzIC0gdmVyaWZ5IHN0ZXAgbnVtYmVyIHN0eWxpbmdcbiAgZGVzY3JpYmUoJ1N0ZXBOdW0gY29tcG9uZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN0ZXAgbnVtYmVycyB3aXRoIGNvcnJlY3Qgc3R5bGluZyBjbGFzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIFN0ZXBOdW0gY29tcG9uZW50IGlzIHRoZSBkaXJlY3QgY29udGFpbmVyIG9mIHRoZSB0ZXh0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3RlcE51bWJlcjEgPSBzY3JlZW4uZ2V0QnlUZXh0KCcxJylcbiAgICAgICAgZXhwZWN0KHN0ZXBOdW1iZXIxKS50b0hhdmVDbGFzcygncm91bmRlZC0yeGwnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIEdpdGh1Ykljb24gY29tcG9uZW50IHRlc3RzIC0gdmVyaWZ5IEdpdEh1YiBpY29uIHJlbmRlcnMgY29ycmVjdGx5XG4gIGRlc2NyaWJlKCdHaXRodWJJY29uIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBHaXRIdWIgaWNvbiBTVkcgd2l0aGluIEdpdEh1YiBsaW5rIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3VzdG9taXplTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRmluZCBHaXRIdWIgbGluayBhbmQgdmVyaWZ5IGl0IGNvbnRhaW5zIGFuIFNWRyBpY29uIHdpdGggZXhwZWN0ZWQgY2xhc3NcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBnaXRodWJMaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogL3N0ZXAxT3BlcmF0aW9uL2kgfSlcbiAgICAgICAgY29uc3QgZ2l0aHViSWNvbiA9IGdpdGh1YkxpbmsucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgICAgZXhwZWN0KGdpdGh1Ykljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KGdpdGh1Ykljb24pLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtc2Vjb25kYXJ5JylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=