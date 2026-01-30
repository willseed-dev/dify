"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const app_1 = require("@/types/app");
const index_1 = require("./index");
vi.mock('@heroicons/react/20/solid', () => ({
    PlusIcon: ({ className }) => <div data-testid="plus-icon" className={className} aria-label="Add icon">+</div>,
}));
const mockApp = {
    app: {
        id: 'test-app-id',
        mode: app_1.AppModeEnum.CHAT,
        icon_type: 'emoji',
        icon: '🤖',
        icon_background: '#FFEAD5',
        icon_url: '',
        name: 'Test Chat App',
        description: 'A test chat application for demonstration purposes',
        use_icon_as_answer_icon: false,
    },
    app_id: 'test-app-id',
    description: 'A comprehensive chat application template',
    copyright: 'Test Corp',
    privacy_policy: null,
    custom_disclaimer: null,
    category: 'Assistant',
    position: 1,
    is_listed: true,
    install_count: 100,
    installed: false,
    editable: true,
    is_agent: false,
};
describe('AppCard', () => {
    const defaultProps = {
        app: mockApp,
        canCreate: true,
        onCreate: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            expect(container.querySelector('em-emoji')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test Chat App')).toBeInTheDocument();
            expect(react_1.screen.getByText(mockApp.description)).toBeInTheDocument();
        });
        it('should render app type icon and label', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            expect(container.querySelector('svg')).toBeInTheDocument();
            expect(react_1.screen.getByText('app.typeSelector.chatbot')).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        describe('canCreate behavior', () => {
            it('should show create button when canCreate is true', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} canCreate={true}/>);
                const button = react_1.screen.getByRole('button', { name: /app\.newApp\.useTemplate/ });
                expect(button).toBeInTheDocument();
            });
            it('should hide create button when canCreate is false', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} canCreate={false}/>);
                const button = react_1.screen.queryByRole('button', { name: /app\.newApp\.useTemplate/ });
                expect(button).not.toBeInTheDocument();
            });
        });
        it('should display app name from appBasicInfo', () => {
            const customApp = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    name: 'Custom App Name',
                },
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={customApp}/>);
            expect(react_1.screen.getByText('Custom App Name')).toBeInTheDocument();
        });
        it('should display app description from app level', () => {
            const customApp = {
                ...mockApp,
                description: 'Custom description for the app',
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={customApp}/>);
            expect(react_1.screen.getByText('Custom description for the app')).toBeInTheDocument();
        });
        it('should truncate long app names', () => {
            const longNameApp = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    name: 'This is a very long app name that should be truncated with line-clamp-1',
                },
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={longNameApp}/>);
            const nameElement = react_1.screen.getByTitle('This is a very long app name that should be truncated with line-clamp-1');
            expect(nameElement).toBeInTheDocument();
        });
    });
    describe('App Modes - Data Driven Tests', () => {
        const testCases = [
            {
                mode: app_1.AppModeEnum.CHAT,
                expectedLabel: 'app.typeSelector.chatbot',
                description: 'Chat application mode',
            },
            {
                mode: app_1.AppModeEnum.AGENT_CHAT,
                expectedLabel: 'app.typeSelector.agent',
                description: 'Agent chat mode',
            },
            {
                mode: app_1.AppModeEnum.COMPLETION,
                expectedLabel: 'app.typeSelector.completion',
                description: 'Completion mode',
            },
            {
                mode: app_1.AppModeEnum.ADVANCED_CHAT,
                expectedLabel: 'app.typeSelector.advanced',
                description: 'Advanced chat mode',
            },
            {
                mode: app_1.AppModeEnum.WORKFLOW,
                expectedLabel: 'app.typeSelector.workflow',
                description: 'Workflow mode',
            },
        ];
        testCases.forEach(({ mode, expectedLabel, description }) => {
            it(`should display correct type label for ${description}`, () => {
                const appWithMode = {
                    ...mockApp,
                    app: {
                        ...mockApp.app,
                        mode,
                    },
                };
                (0, react_1.render)(<index_1.default {...defaultProps} app={appWithMode}/>);
                expect(react_1.screen.getByText(expectedLabel)).toBeInTheDocument();
            });
        });
    });
    describe('Icon Type Tests', () => {
        it('should render emoji icon without image element', () => {
            const appWithIcon = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    icon_type: 'emoji',
                    icon: '🤖',
                },
            };
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} app={appWithIcon}/>);
            const card = container.firstElementChild;
            expect((0, react_1.within)(card).queryByRole('img', { name: 'app icon' })).not.toBeInTheDocument();
            expect(card.querySelector('em-emoji')).toBeInTheDocument();
        });
        it('should prioritize icon_url when both icon and icon_url are provided', () => {
            const appWithImageUrl = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    icon_type: 'image',
                    icon: 'local-icon.png',
                    icon_url: 'https://example.com/remote-icon.png',
                },
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={appWithImageUrl}/>);
            expect(react_1.screen.getByRole('img', { name: 'app icon' })).toHaveAttribute('src', 'https://example.com/remote-icon.png');
        });
    });
    describe('User Interactions', () => {
        it('should call onCreate when create button is clicked', async () => {
            const mockOnCreate = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onCreate={mockOnCreate}/>);
            const button = react_1.screen.getByRole('button', { name: /app\.newApp\.useTemplate/ });
            await user_event_1.default.click(button);
            expect(mockOnCreate).toHaveBeenCalledTimes(1);
        });
        it('should handle click on card itself', async () => {
            const mockOnCreate = vi.fn();
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} onCreate={mockOnCreate}/>);
            const card = container.firstElementChild;
            await user_event_1.default.click(card);
            // Note: Card click doesn't trigger onCreate, only the button does
            expect(mockOnCreate).not.toHaveBeenCalled();
        });
    });
    describe('Keyboard Accessibility', () => {
        it('should allow the create button to be focused', async () => {
            const mockOnCreate = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onCreate={mockOnCreate}/>);
            await user_event_1.default.tab();
            const button = react_1.screen.getByRole('button', { name: /app\.newApp\.useTemplate/ });
            // Test that button can be focused
            expect(button).toHaveFocus();
            // Test click event works (keyboard events on buttons typically trigger click)
            await user_event_1.default.click(button);
            expect(mockOnCreate).toHaveBeenCalledTimes(1);
        });
    });
    describe('Edge Cases', () => {
        it('should handle app with null icon_type', () => {
            const appWithNullIcon = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    icon_type: null,
                },
            };
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} app={appWithNullIcon}/>);
            const appIcon = container.querySelector('em-emoji');
            expect(appIcon).toBeInTheDocument();
            // AppIcon component should handle null icon_type gracefully
        });
        it('should handle app with empty description', () => {
            const appWithEmptyDesc = {
                ...mockApp,
                description: '',
            };
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} app={appWithEmptyDesc}/>);
            const descriptionContainer = container.querySelector('.line-clamp-3');
            expect(descriptionContainer).toBeInTheDocument();
            expect(descriptionContainer).toHaveTextContent('');
        });
        it('should handle app with very long description', () => {
            const longDescription = 'This is a very long description that should be truncated with line-clamp-3. '.repeat(5);
            const appWithLongDesc = {
                ...mockApp,
                description: longDescription,
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={appWithLongDesc}/>);
            expect(react_1.screen.getByText(/This is a very long description/)).toBeInTheDocument();
        });
        it('should handle app with special characters in name', () => {
            const appWithSpecialChars = {
                ...mockApp,
                app: {
                    ...mockApp.app,
                    name: 'App <script>alert("test")</script> & Special "Chars"',
                },
            };
            (0, react_1.render)(<index_1.default {...defaultProps} app={appWithSpecialChars}/>);
            expect(react_1.screen.getByText('App <script>alert("test")</script> & Special "Chars"')).toBeInTheDocument();
        });
        it('should handle onCreate function throwing error', async () => {
            const errorOnCreate = vi.fn(() => {
                return Promise.reject(new Error('Create failed'));
            });
            // Mock console.error to avoid test output noise
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
            (0, react_1.render)(<index_1.default {...defaultProps} onCreate={errorOnCreate}/>);
            const button = react_1.screen.getByRole('button', { name: /app\.newApp\.useTemplate/ });
            let capturedError;
            try {
                await user_event_1.default.click(button);
            }
            catch (err) {
                capturedError = err;
            }
            expect(errorOnCreate).toHaveBeenCalledTimes(1);
            // expect(consoleSpy).toHaveBeenCalled()
            if (capturedError instanceof Error)
                expect(capturedError.message).toContain('Create failed');
            consoleSpy.mockRestore();
        });
    });
    describe('Accessibility', () => {
        it('should have proper elements for accessibility', () => {
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            expect(container.querySelector('em-emoji')).toBeInTheDocument();
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
        it('should have title attribute for app name when truncated', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const nameElement = react_1.screen.getByText('Test Chat App');
            expect(nameElement).toHaveAttribute('title', 'Test Chat App');
        });
        it('should have accessible button with proper label', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const button = react_1.screen.getByRole('button', { name: /app\.newApp\.useTemplate/ });
            expect(button).toBeEnabled();
            expect(button).toHaveTextContent('app.newApp.useTemplate');
        });
    });
    describe('User-Visible Behavior Tests', () => {
        it('should show plus icon in create button', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            expect(react_1.screen.getByTestId('plus-icon')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQStEO0FBQy9ELDREQUFtRDtBQUNuRCxxQ0FBeUM7QUFDekMsbUNBQTZCO0FBRTdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztDQUNuSCxDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sT0FBTyxHQUFRO0lBQ25CLEdBQUcsRUFBRTtRQUNILEVBQUUsRUFBRSxhQUFhO1FBQ2pCLElBQUksRUFBRSxpQkFBVyxDQUFDLElBQUk7UUFDdEIsU0FBUyxFQUFFLE9BQXNCO1FBQ2pDLElBQUksRUFBRSxJQUFJO1FBQ1YsZUFBZSxFQUFFLFNBQVM7UUFDMUIsUUFBUSxFQUFFLEVBQUU7UUFDWixJQUFJLEVBQUUsZUFBZTtRQUNyQixXQUFXLEVBQUUsb0RBQW9EO1FBQ2pFLHVCQUF1QixFQUFFLEtBQUs7S0FDL0I7SUFDRCxNQUFNLEVBQUUsYUFBYTtJQUNyQixXQUFXLEVBQUUsMkNBQTJDO0lBQ3hELFNBQVMsRUFBRSxXQUFXO0lBQ3RCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsUUFBUSxFQUFFLFdBQVc7SUFDckIsUUFBUSxFQUFFLENBQUM7SUFDWCxTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFNBQVMsRUFBRSxLQUFLO0lBQ2hCLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQTtB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LGVBQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyQyxNQUFNLFdBQVcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLEdBQUcsRUFBRTtZQUN6RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVyQyxNQUFNLE1BQU0sR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBMEIsRUFBRSxDQUFDLENBQUE7WUFDL0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQzNDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFPLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFckMsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwIH0gZnJvbSAnQC9tb2RlbHMvZXhwbG9yZSdcbmltcG9ydCB0eXBlIHsgQXBwSWNvblR5cGUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuLCB3aXRoaW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IEFwcENhcmQgZnJvbSAnLi9pbmRleCdcblxudmkubW9jaygnQGhlcm9pY29ucy9yZWFjdC8yMC9zb2xpZCcsICgpID0+ICh7XG4gIFBsdXNJY29uOiAoeyBjbGFzc05hbWUgfTogYW55KSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwicGx1cy1pY29uXCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IGFyaWEtbGFiZWw9XCJBZGQgaWNvblwiPis8L2Rpdj4sXG59KSlcblxuY29uc3QgbW9ja0FwcDogQXBwID0ge1xuICBhcHA6IHtcbiAgICBpZDogJ3Rlc3QtYXBwLWlkJyxcbiAgICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICAgIGljb25fdHlwZTogJ2Vtb2ppJyBhcyBBcHBJY29uVHlwZSxcbiAgICBpY29uOiAn8J+klicsXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgaWNvbl91cmw6ICcnLFxuICAgIG5hbWU6ICdUZXN0IENoYXQgQXBwJyxcbiAgICBkZXNjcmlwdGlvbjogJ0EgdGVzdCBjaGF0IGFwcGxpY2F0aW9uIGZvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzJyxcbiAgICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gIH0sXG4gIGFwcF9pZDogJ3Rlc3QtYXBwLWlkJyxcbiAgZGVzY3JpcHRpb246ICdBIGNvbXByZWhlbnNpdmUgY2hhdCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZScsXG4gIGNvcHlyaWdodDogJ1Rlc3QgQ29ycCcsXG4gIHByaXZhY3lfcG9saWN5OiBudWxsLFxuICBjdXN0b21fZGlzY2xhaW1lcjogbnVsbCxcbiAgY2F0ZWdvcnk6ICdBc3Npc3RhbnQnLFxuICBwb3NpdGlvbjogMSxcbiAgaXNfbGlzdGVkOiB0cnVlLFxuICBpbnN0YWxsX2NvdW50OiAxMDAsXG4gIGluc3RhbGxlZDogZmFsc2UsXG4gIGVkaXRhYmxlOiB0cnVlLFxuICBpc19hZ2VudDogZmFsc2UsXG59XG5cbmRlc2NyaWJlKCdBcHBDYXJkJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgYXBwOiBtb2NrQXBwLFxuICAgIGNhbkNyZWF0ZTogdHJ1ZSxcbiAgICBvbkNyZWF0ZTogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZW0tZW1vamknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQ2hhdCBBcHAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobW9ja0FwcC5kZXNjcmlwdGlvbikpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXBwIHR5cGUgaWNvbiBhbmQgbGFiZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLnR5cGVTZWxlY3Rvci5jaGF0Ym90JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnY2FuQ3JlYXRlIGJlaGF2aW9yJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IGNyZWF0ZSBidXR0b24gd2hlbiBjYW5DcmVhdGUgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IGNhbkNyZWF0ZT17dHJ1ZX0gLz4pXG5cbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvYXBwXFwubmV3QXBwXFwudXNlVGVtcGxhdGUvIH0pXG4gICAgICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGlkZSBjcmVhdGUgYnV0dG9uIHdoZW4gY2FuQ3JlYXRlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gY2FuQ3JlYXRlPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9hcHBcXC5uZXdBcHBcXC51c2VUZW1wbGF0ZS8gfSlcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBhcHAgbmFtZSBmcm9tIGFwcEJhc2ljSW5mbycsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbUFwcCA9IHtcbiAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgYXBwOiB7XG4gICAgICAgICAgLi4ubW9ja0FwcC5hcHAsXG4gICAgICAgICAgbmFtZTogJ0N1c3RvbSBBcHAgTmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gYXBwPXtjdXN0b21BcHB9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIEFwcCBOYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGFwcCBkZXNjcmlwdGlvbiBmcm9tIGFwcCBsZXZlbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbUFwcCA9IHtcbiAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDdXN0b20gZGVzY3JpcHRpb24gZm9yIHRoZSBhcHAnLFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IGFwcD17Y3VzdG9tQXBwfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbSBkZXNjcmlwdGlvbiBmb3IgdGhlIGFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJ1bmNhdGUgbG9uZyBhcHAgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nTmFtZUFwcCA9IHtcbiAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgYXBwOiB7XG4gICAgICAgICAgLi4ubW9ja0FwcC5hcHAsXG4gICAgICAgICAgbmFtZTogJ1RoaXMgaXMgYSB2ZXJ5IGxvbmcgYXBwIG5hbWUgdGhhdCBzaG91bGQgYmUgdHJ1bmNhdGVkIHdpdGggbGluZS1jbGFtcC0xJyxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBhcHA9e2xvbmdOYW1lQXBwfSAvPilcblxuICAgICAgY29uc3QgbmFtZUVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUaXRsZSgnVGhpcyBpcyBhIHZlcnkgbG9uZyBhcHAgbmFtZSB0aGF0IHNob3VsZCBiZSB0cnVuY2F0ZWQgd2l0aCBsaW5lLWNsYW1wLTEnKVxuICAgICAgZXhwZWN0KG5hbWVFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQXBwIE1vZGVzIC0gRGF0YSBEcml2ZW4gVGVzdHMnLCAoKSA9PiB7XG4gICAgY29uc3QgdGVzdENhc2VzID0gW1xuICAgICAge1xuICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DSEFULFxuICAgICAgICBleHBlY3RlZExhYmVsOiAnYXBwLnR5cGVTZWxlY3Rvci5jaGF0Ym90JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDaGF0IGFwcGxpY2F0aW9uIG1vZGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbW9kZTogQXBwTW9kZUVudW0uQUdFTlRfQ0hBVCxcbiAgICAgICAgZXhwZWN0ZWRMYWJlbDogJ2FwcC50eXBlU2VsZWN0b3IuYWdlbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FnZW50IGNoYXQgbW9kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5DT01QTEVUSU9OLFxuICAgICAgICBleHBlY3RlZExhYmVsOiAnYXBwLnR5cGVTZWxlY3Rvci5jb21wbGV0aW9uJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdDb21wbGV0aW9uIG1vZGUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbW9kZTogQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVCxcbiAgICAgICAgZXhwZWN0ZWRMYWJlbDogJ2FwcC50eXBlU2VsZWN0b3IuYWR2YW5jZWQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0FkdmFuY2VkIGNoYXQgbW9kZScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBtb2RlOiBBcHBNb2RlRW51bS5XT1JLRkxPVyxcbiAgICAgICAgZXhwZWN0ZWRMYWJlbDogJ2FwcC50eXBlU2VsZWN0b3Iud29ya2Zsb3cnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1dvcmtmbG93IG1vZGUnLFxuICAgICAgfSxcbiAgICBdXG5cbiAgICB0ZXN0Q2FzZXMuZm9yRWFjaCgoeyBtb2RlLCBleHBlY3RlZExhYmVsLCBkZXNjcmlwdGlvbiB9KSA9PiB7XG4gICAgICBpdChgc2hvdWxkIGRpc3BsYXkgY29ycmVjdCB0eXBlIGxhYmVsIGZvciAke2Rlc2NyaXB0aW9ufWAsICgpID0+IHtcbiAgICAgICAgY29uc3QgYXBwV2l0aE1vZGUgPSB7XG4gICAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgICBhcHA6IHtcbiAgICAgICAgICAgIC4uLm1vY2tBcHAuYXBwLFxuICAgICAgICAgICAgbW9kZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBhcHA9e2FwcFdpdGhNb2RlfSAvPilcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChleHBlY3RlZExhYmVsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJY29uIFR5cGUgVGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1vamkgaWNvbiB3aXRob3V0IGltYWdlIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBXaXRoSWNvbiA9IHtcbiAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgYXBwOiB7XG4gICAgICAgICAgLi4ubW9ja0FwcC5hcHAsXG4gICAgICAgICAgaWNvbl90eXBlOiAnZW1vamknIGFzIEFwcEljb25UeXBlLFxuICAgICAgICAgIGljb246ICfwn6SWJyxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gYXBwPXthcHBXaXRoSWNvbn0gLz4pXG5cbiAgICAgIGNvbnN0IGNhcmQgPSBjb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3aXRoaW4oY2FyZCkucXVlcnlCeVJvbGUoJ2ltZycsIHsgbmFtZTogJ2FwcCBpY29uJyB9KSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjYXJkLnF1ZXJ5U2VsZWN0b3IoJ2VtLWVtb2ppJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmlvcml0aXplIGljb25fdXJsIHdoZW4gYm90aCBpY29uIGFuZCBpY29uX3VybCBhcmUgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBXaXRoSW1hZ2VVcmwgPSB7XG4gICAgICAgIC4uLm1vY2tBcHAsXG4gICAgICAgIGFwcDoge1xuICAgICAgICAgIC4uLm1vY2tBcHAuYXBwLFxuICAgICAgICAgIGljb25fdHlwZTogJ2ltYWdlJyBhcyBBcHBJY29uVHlwZSxcbiAgICAgICAgICBpY29uOiAnbG9jYWwtaWNvbi5wbmcnLFxuICAgICAgICAgIGljb25fdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9yZW1vdGUtaWNvbi5wbmcnLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IGFwcD17YXBwV2l0aEltYWdlVXJsfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycsIHsgbmFtZTogJ2FwcCBpY29uJyB9KSkudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9leGFtcGxlLmNvbS9yZW1vdGUtaWNvbi5wbmcnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNyZWF0ZSB3aGVuIGNyZWF0ZSBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNyZWF0ZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBvbkNyZWF0ZT17bW9ja09uQ3JlYXRlfSAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvYXBwXFwubmV3QXBwXFwudXNlVGVtcGxhdGUvIH0pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soYnV0dG9uKVxuICAgICAgZXhwZWN0KG1vY2tPbkNyZWF0ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNsaWNrIG9uIGNhcmQgaXRzZWxmJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja09uQ3JlYXRlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBvbkNyZWF0ZT17bW9ja09uQ3JlYXRlfSAvPilcblxuICAgICAgY29uc3QgY2FyZCA9IGNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGNhcmQpXG4gICAgICAvLyBOb3RlOiBDYXJkIGNsaWNrIGRvZXNuJ3QgdHJpZ2dlciBvbkNyZWF0ZSwgb25seSB0aGUgYnV0dG9uIGRvZXNcbiAgICAgIGV4cGVjdChtb2NrT25DcmVhdGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdLZXlib2FyZCBBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWxsb3cgdGhlIGNyZWF0ZSBidXR0b24gdG8gYmUgZm9jdXNlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNyZWF0ZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBvbkNyZWF0ZT17bW9ja09uQ3JlYXRlfSAvPilcblxuICAgICAgYXdhaXQgdXNlckV2ZW50LnRhYigpXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9hcHBcXC5uZXdBcHBcXC51c2VUZW1wbGF0ZS8gfSkgYXMgSFRNTEJ1dHRvbkVsZW1lbnRcblxuICAgICAgLy8gVGVzdCB0aGF0IGJ1dHRvbiBjYW4gYmUgZm9jdXNlZFxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlRm9jdXMoKVxuXG4gICAgICAvLyBUZXN0IGNsaWNrIGV2ZW50IHdvcmtzIChrZXlib2FyZCBldmVudHMgb24gYnV0dG9ucyB0eXBpY2FsbHkgdHJpZ2dlciBjbGljaylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhidXR0b24pXG4gICAgICBleHBlY3QobW9ja09uQ3JlYXRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFwcCB3aXRoIG51bGwgaWNvbl90eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwV2l0aE51bGxJY29uID0ge1xuICAgICAgICAuLi5tb2NrQXBwLFxuICAgICAgICBhcHA6IHtcbiAgICAgICAgICAuLi5tb2NrQXBwLmFwcCxcbiAgICAgICAgICBpY29uX3R5cGU6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IGFwcD17YXBwV2l0aE51bGxJY29ufSAvPilcblxuICAgICAgY29uc3QgYXBwSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdlbS1lbW9qaScpXG4gICAgICBleHBlY3QoYXBwSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gQXBwSWNvbiBjb21wb25lbnQgc2hvdWxkIGhhbmRsZSBudWxsIGljb25fdHlwZSBncmFjZWZ1bGx5XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFwcCB3aXRoIGVtcHR5IGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwV2l0aEVtcHR5RGVzYyA9IHtcbiAgICAgICAgLi4ubW9ja0FwcCxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSBhcHA9e2FwcFdpdGhFbXB0eURlc2N9IC8+KVxuXG4gICAgICBjb25zdCBkZXNjcmlwdGlvbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubGluZS1jbGFtcC0zJylcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uQ29udGFpbmVyKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYXBwIHdpdGggdmVyeSBsb25nIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ0Rlc2NyaXB0aW9uID0gJ1RoaXMgaXMgYSB2ZXJ5IGxvbmcgZGVzY3JpcHRpb24gdGhhdCBzaG91bGQgYmUgdHJ1bmNhdGVkIHdpdGggbGluZS1jbGFtcC0zLiAnLnJlcGVhdCg1KVxuICAgICAgY29uc3QgYXBwV2l0aExvbmdEZXNjID0ge1xuICAgICAgICAuLi5tb2NrQXBwLFxuICAgICAgICBkZXNjcmlwdGlvbjogbG9uZ0Rlc2NyaXB0aW9uLFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IGFwcD17YXBwV2l0aExvbmdEZXNjfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1RoaXMgaXMgYSB2ZXJ5IGxvbmcgZGVzY3JpcHRpb24vKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhcHAgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcFdpdGhTcGVjaWFsQ2hhcnMgPSB7XG4gICAgICAgIC4uLm1vY2tBcHAsXG4gICAgICAgIGFwcDoge1xuICAgICAgICAgIC4uLm1vY2tBcHAuYXBwLFxuICAgICAgICAgIG5hbWU6ICdBcHAgPHNjcmlwdD5hbGVydChcInRlc3RcIik8L3NjcmlwdD4gJiBTcGVjaWFsIFwiQ2hhcnNcIicsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gYXBwPXthcHBXaXRoU3BlY2lhbENoYXJzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FwcCA8c2NyaXB0PmFsZXJ0KFwidGVzdFwiKTwvc2NyaXB0PiAmIFNwZWNpYWwgXCJDaGFyc1wiJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25DcmVhdGUgZnVuY3Rpb24gdGhyb3dpbmcgZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBlcnJvck9uQ3JlYXRlID0gdmkuZm4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdDcmVhdGUgZmFpbGVkJykpXG4gICAgICB9KVxuXG4gICAgICAvLyBNb2NrIGNvbnNvbGUuZXJyb3IgdG8gYXZvaWQgdGVzdCBvdXRwdXQgbm9pc2VcbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnZXJyb3InKS5tb2NrSW1wbGVtZW50YXRpb24odmkuZm4oKSlcblxuICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IG9uQ3JlYXRlPXtlcnJvck9uQ3JlYXRlfSAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvYXBwXFwubmV3QXBwXFwudXNlVGVtcGxhdGUvIH0pXG4gICAgICBsZXQgY2FwdHVyZWRFcnJvcjogdW5rbm93blxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGJ1dHRvbilcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgY2FwdHVyZWRFcnJvciA9IGVyclxuICAgICAgfVxuICAgICAgZXhwZWN0KGVycm9yT25DcmVhdGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgLy8gZXhwZWN0KGNvbnNvbGVTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgaWYgKGNhcHR1cmVkRXJyb3IgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAgICAgZXhwZWN0KGNhcHR1cmVkRXJyb3IubWVzc2FnZSkudG9Db250YWluKCdDcmVhdGUgZmFpbGVkJylcblxuICAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGVsZW1lbnRzIGZvciBhY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QXBwQ2FyZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdlbS1lbW9qaScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB0aXRsZSBhdHRyaWJ1dGUgZm9yIGFwcCBuYW1lIHdoZW4gdHJ1bmNhdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxBcHBDYXJkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBuYW1lRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQ2hhdCBBcHAnKVxuICAgICAgZXhwZWN0KG5hbWVFbGVtZW50KS50b0hhdmVBdHRyaWJ1dGUoJ3RpdGxlJywgJ1Rlc3QgQ2hhdCBBcHAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBidXR0b24gd2l0aCBwcm9wZXIgbGFiZWwnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2FwcFxcLm5ld0FwcFxcLnVzZVRlbXBsYXRlLyB9KVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUVuYWJsZWQoKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlVGV4dENvbnRlbnQoJ2FwcC5uZXdBcHAudXNlVGVtcGxhdGUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VzZXItVmlzaWJsZSBCZWhhdmlvciBUZXN0cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgcGx1cyBpY29uIGluIGNyZWF0ZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEFwcENhcmQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdXMtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=