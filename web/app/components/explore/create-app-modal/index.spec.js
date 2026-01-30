"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const provider_context_1 = require("@/__mocks__/provider-context");
const type_1 = require("@/app/components/billing/type");
const app_1 = require("@/types/app");
const index_1 = require("./index");
let mockTranslationOverrides = {};
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const override = mockTranslationOverrides[key];
            if (override !== undefined)
                return override;
            if (options?.returnObjects)
                return [`${key}-feature-1`, `${key}-feature-2`];
            if (options) {
                const { ns, ...rest } = options;
                const prefix = ns ? `${ns}.` : '';
                const suffix = Object.keys(rest).length > 0 ? `:${JSON.stringify(rest)}` : '';
                return `${prefix}${key}${suffix}`;
            }
            return key;
        },
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
    Trans: ({ children }) => children,
    initReactI18next: {
        type: '3rdParty',
        init: vi.fn(),
    },
}));
// Avoid heavy emoji dataset initialization during unit tests.
vi.mock('emoji-mart', () => ({
    init: vi.fn(),
    SearchIndex: { search: vi.fn().mockResolvedValue([]) },
}));
vi.mock('@emoji-mart/data', () => ({
    default: {
        categories: [
            { id: 'people', emojis: ['😀'] },
        ],
    },
}));
vi.mock('next/navigation', () => ({
    useParams: () => ({}),
}));
vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        userProfile: { email: 'test@example.com' },
        langGeniusVersionInfo: { current_version: '0.0.0' },
    }),
}));
const createPlanInfo = (buildApps) => ({
    vectorSpace: 0,
    buildApps,
    teamMembers: 0,
    annotatedResponse: 0,
    documentsUploadQuota: 0,
    apiRateLimit: 0,
    triggerEvents: 0,
});
let mockEnableBilling = false;
let mockPlanType = type_1.Plan.team;
let mockUsagePlanInfo = createPlanInfo(1);
let mockTotalPlanInfo = createPlanInfo(10);
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => {
        const withPlan = (0, provider_context_1.createMockPlan)(mockPlanType);
        const withUsage = (0, provider_context_1.createMockPlanUsage)(mockUsagePlanInfo, withPlan);
        const withTotal = (0, provider_context_1.createMockPlanTotal)(mockTotalPlanInfo, withUsage);
        return { ...withTotal, enableBilling: mockEnableBilling };
    },
}));
const setup = (overrides = {}) => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onHide = vi.fn();
    const props = {
        show: true,
        isEditModal: false,
        appName: 'Test App',
        appDescription: 'Test description',
        appIconType: 'emoji',
        appIcon: '🤖',
        appIconBackground: '#FFEAD5',
        appIconUrl: null,
        appMode: app_1.AppModeEnum.CHAT,
        appUseIconAsAnswerIcon: false,
        max_active_requests: null,
        onConfirm,
        confirmDisabled: false,
        onHide,
        ...overrides,
    };
    (0, react_1.render)(<index_1.default {...props}/>);
    return { onConfirm, onHide };
};
const getAppIconTrigger = () => {
    const nameInput = react_1.screen.getByPlaceholderText('app.newApp.appNamePlaceholder');
    const iconRow = nameInput.parentElement?.parentElement;
    const iconTrigger = iconRow?.firstElementChild;
    if (!(iconTrigger instanceof HTMLElement))
        throw new Error('Failed to locate app icon trigger');
    return iconTrigger;
};
describe('CreateAppModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockTranslationOverrides = {};
        mockEnableBilling = false;
        mockPlanType = type_1.Plan.team;
        mockUsagePlanInfo = createPlanInfo(1);
        mockTotalPlanInfo = createPlanInfo(10);
    });
    // The title and form sections vary based on the modal mode (create vs edit).
    describe('Rendering', () => {
        it('should render create title and actions when creating', () => {
            setup({ appName: 'My App', isEditModal: false });
            expect(react_1.screen.getByText('explore.appCustomize.title:{"name":"My App"}')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.create' })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.cancel' })).toBeInTheDocument();
        });
        it('should render edit-only fields when editing a chat app', () => {
            setup({ isEditModal: true, appMode: app_1.AppModeEnum.CHAT, max_active_requests: 5 });
            expect(react_1.screen.getByText('app.editAppTitle')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeInTheDocument();
            expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
            expect(react_1.screen.getByRole('spinbutton').value).toBe('5');
        });
        it.each([app_1.AppModeEnum.ADVANCED_CHAT, app_1.AppModeEnum.AGENT_CHAT])('should render answer icon switch when editing %s app', (mode) => {
            setup({ isEditModal: true, appMode: mode });
            expect(react_1.screen.getByRole('switch')).toBeInTheDocument();
        });
        it('should not render answer icon switch when editing a non-chat app', () => {
            setup({ isEditModal: true, appMode: app_1.AppModeEnum.COMPLETION });
            expect(react_1.screen.queryByRole('switch')).not.toBeInTheDocument();
        });
        it('should not render modal content when hidden', () => {
            setup({ show: false });
            expect(react_1.screen.queryByRole('button', { name: 'common.operation.create' })).not.toBeInTheDocument();
        });
    });
    // Disabled states prevent submission and reflect parent-driven props.
    describe('Props', () => {
        it('should disable confirm action when confirmDisabled is true', () => {
            setup({ confirmDisabled: true });
            expect(react_1.screen.getByRole('button', { name: 'common.operation.create' })).toBeDisabled();
        });
        it('should disable confirm action when appName is empty', () => {
            setup({ appName: '   ' });
            expect(react_1.screen.getByRole('button', { name: 'common.operation.create' })).toBeDisabled();
        });
    });
    // Defensive coverage for falsy input values and translation edge cases.
    describe('Edge Cases', () => {
        it('should default description to empty string when appDescription is empty', () => {
            setup({ appDescription: '' });
            expect(react_1.screen.getByPlaceholderText('app.newApp.appDescriptionPlaceholder').value).toBe('');
        });
        it('should fall back to empty placeholders when translations return empty string', () => {
            mockTranslationOverrides = {
                'newApp.appNamePlaceholder': '',
                'newApp.appDescriptionPlaceholder': '',
            };
            setup();
            expect(react_1.screen.getByDisplayValue('Test App').placeholder).toBe('');
            expect(react_1.screen.getByDisplayValue('Test description').placeholder).toBe('');
        });
    });
    // The modal should close from user-initiated cancellation actions.
    describe('User Interactions', () => {
        it('should call onHide when cancel button is clicked', () => {
            const { onConfirm, onHide } = setup();
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            expect(onHide).toHaveBeenCalledTimes(1);
            expect(onConfirm).not.toHaveBeenCalled();
        });
        it('should call onHide when pressing Escape while visible', () => {
            const { onHide } = setup();
            react_1.fireEvent.keyDown(window, { key: 'Escape', keyCode: 27 });
            expect(onHide).toHaveBeenCalledTimes(1);
        });
        it('should not call onHide when pressing Escape while hidden', () => {
            const { onHide } = setup({ show: false });
            react_1.fireEvent.keyDown(window, { key: 'Escape', keyCode: 27 });
            expect(onHide).not.toHaveBeenCalled();
        });
    });
    // When billing limits are reached, the modal blocks app creation and shows quota guidance.
    describe('Quota Gating', () => {
        it('should show AppsFull and disable create when apps quota is reached', () => {
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.team;
            mockUsagePlanInfo = createPlanInfo(10);
            mockTotalPlanInfo = createPlanInfo(10);
            setup({ isEditModal: false });
            expect(react_1.screen.getByText('billing.apps.fullTip2')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.create' })).toBeDisabled();
        });
        it('should allow saving when apps quota is reached in edit mode', () => {
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.team;
            mockUsagePlanInfo = createPlanInfo(10);
            mockTotalPlanInfo = createPlanInfo(10);
            setup({ isEditModal: true });
            expect(react_1.screen.queryByText('billing.apps.fullTip2')).not.toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'common.operation.save' })).toBeEnabled();
        });
    });
    // Shortcut handlers are important for power users and must respect gating rules.
    describe('Keyboard Shortcuts', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });
        it.each([
            ['meta+enter', { metaKey: true }],
            ['ctrl+enter', { ctrlKey: true }],
        ])('should submit when %s is pressed while visible', (_, modifier) => {
            const { onConfirm, onHide } = setup();
            react_1.fireEvent.keyDown(window, { key: 'Enter', keyCode: 13, ...modifier });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onHide).toHaveBeenCalledTimes(1);
        });
        it('should not submit when modal is hidden', () => {
            const { onConfirm, onHide } = setup({ show: false });
            react_1.fireEvent.keyDown(window, { key: 'Enter', keyCode: 13, metaKey: true });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
        it('should not submit when apps quota is reached in create mode', () => {
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.team;
            mockUsagePlanInfo = createPlanInfo(10);
            mockTotalPlanInfo = createPlanInfo(10);
            const { onConfirm, onHide } = setup({ isEditModal: false });
            react_1.fireEvent.keyDown(window, { key: 'Enter', keyCode: 13, metaKey: true });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
        it('should submit when apps quota is reached in edit mode', () => {
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.team;
            mockUsagePlanInfo = createPlanInfo(10);
            mockTotalPlanInfo = createPlanInfo(10);
            const { onConfirm, onHide } = setup({ isEditModal: true });
            react_1.fireEvent.keyDown(window, { key: 'Enter', keyCode: 13, metaKey: true });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onHide).toHaveBeenCalledTimes(1);
        });
        it('should not submit when name is empty', () => {
            const { onConfirm, onHide } = setup({ appName: '   ' });
            react_1.fireEvent.keyDown(window, { key: 'Enter', keyCode: 13, metaKey: true });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
    });
    // The app icon picker is a key user flow for customizing metadata.
    describe('App Icon Picker', () => {
        it('should open and close the picker when cancel is clicked', () => {
            setup({
                appIconType: 'image',
                appIcon: 'file-123',
                appIconUrl: 'https://example.com/icon.png',
            });
            react_1.fireEvent.click(getAppIconTrigger());
            expect(react_1.screen.getByRole('button', { name: 'app.iconPicker.cancel' })).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'app.iconPicker.cancel' }));
            expect(react_1.screen.queryByRole('button', { name: 'app.iconPicker.cancel' })).not.toBeInTheDocument();
        });
        it('should update icon payload when selecting emoji and confirming', () => {
            vi.useFakeTimers();
            try {
                const { onConfirm } = setup({
                    appIconType: 'image',
                    appIcon: 'file-123',
                    appIconUrl: 'https://example.com/icon.png',
                });
                react_1.fireEvent.click(getAppIconTrigger());
                // Find the emoji grid by locating the category label, then find the clickable emoji wrapper
                const categoryLabel = react_1.screen.getByText('people');
                const emojiGrid = categoryLabel.nextElementSibling;
                const clickableEmojiWrapper = emojiGrid?.firstElementChild;
                if (!(clickableEmojiWrapper instanceof HTMLElement))
                    throw new Error('Failed to locate emoji wrapper');
                react_1.fireEvent.click(clickableEmojiWrapper);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'app.iconPicker.ok' }));
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
                (0, react_1.act)(() => {
                    vi.advanceTimersByTime(300);
                });
                expect(onConfirm).toHaveBeenCalledTimes(1);
                const payload = onConfirm.mock.calls[0][0];
                expect(payload).toMatchObject({
                    icon_type: 'emoji',
                    icon: '😀',
                    icon_background: '#FFEAD5',
                });
            }
            finally {
                vi.useRealTimers();
            }
        });
        it('should reset emoji icon to initial props when picker is cancelled', () => {
            vi.useFakeTimers();
            try {
                const { onConfirm } = setup({
                    appIconType: 'emoji',
                    appIcon: '🤖',
                    appIconBackground: '#FFEAD5',
                });
                // Open picker, select a new emoji, and confirm
                react_1.fireEvent.click(getAppIconTrigger());
                // Find the emoji grid by locating the category label, then find the clickable emoji wrapper
                const categoryLabel = react_1.screen.getByText('people');
                const emojiGrid = categoryLabel.nextElementSibling;
                const clickableEmojiWrapper = emojiGrid?.firstElementChild;
                if (!(clickableEmojiWrapper instanceof HTMLElement))
                    throw new Error('Failed to locate emoji wrapper');
                react_1.fireEvent.click(clickableEmojiWrapper);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'app.iconPicker.ok' }));
                expect(react_1.screen.queryByRole('button', { name: 'app.iconPicker.cancel' })).not.toBeInTheDocument();
                // Open picker again and cancel - should reset to initial props
                react_1.fireEvent.click(getAppIconTrigger());
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'app.iconPicker.cancel' }));
                expect(react_1.screen.queryByRole('button', { name: 'app.iconPicker.cancel' })).not.toBeInTheDocument();
                // Submit and verify the payload uses the original icon (cancel reverts to props)
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
                (0, react_1.act)(() => {
                    vi.advanceTimersByTime(300);
                });
                expect(onConfirm).toHaveBeenCalledTimes(1);
                const payload = onConfirm.mock.calls[0][0];
                expect(payload).toMatchObject({
                    icon_type: 'emoji',
                    icon: '🤖',
                    icon_background: '#FFEAD5',
                });
            }
            finally {
                vi.useRealTimers();
            }
        });
    });
    // Submitting uses a debounced handler and builds a payload from current form state.
    describe('Submitting', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });
        it('should call onConfirm with emoji payload and hide when create is clicked', () => {
            const { onConfirm, onHide } = setup({
                appName: 'My App',
                appDescription: 'My description',
                appIconType: 'emoji',
                appIcon: '😀',
                appIconBackground: '#000000',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onHide).toHaveBeenCalledTimes(1);
            const payload = onConfirm.mock.calls[0][0];
            expect(payload).toMatchObject({
                name: 'My App',
                icon_type: 'emoji',
                icon: '😀',
                icon_background: '#000000',
                description: 'My description',
                use_icon_as_answer_icon: false,
            });
            expect(payload).not.toHaveProperty('max_active_requests');
        });
        it('should include updated description when textarea is changed before submitting', () => {
            const { onConfirm } = setup({ appDescription: 'Old description' });
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('app.newApp.appDescriptionPlaceholder'), { target: { value: 'Updated description' } });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(onConfirm.mock.calls[0][0]).toMatchObject({ description: 'Updated description' });
        });
        it('should omit icon_background when submitting with image icon', () => {
            const { onConfirm } = setup({
                appIconType: 'image',
                appIcon: 'file-123',
                appIconUrl: 'https://example.com/icon.png',
                appIconBackground: null,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            const payload = onConfirm.mock.calls[0][0];
            expect(payload).toMatchObject({
                icon_type: 'image',
                icon: 'file-123',
            });
            expect(payload.icon_background).toBeUndefined();
        });
        it('should include max_active_requests and updated answer icon when saving', () => {
            const { onConfirm } = setup({
                isEditModal: true,
                appMode: app_1.AppModeEnum.CHAT,
                appUseIconAsAnswerIcon: false,
                max_active_requests: 3,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('switch'));
            react_1.fireEvent.change(react_1.screen.getByRole('spinbutton'), { target: { value: '12' } });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            const payload = onConfirm.mock.calls[0][0];
            expect(payload).toMatchObject({
                use_icon_as_answer_icon: true,
                max_active_requests: 12,
            });
        });
        it('should omit max_active_requests when input is empty', () => {
            const { onConfirm } = setup({ isEditModal: true, max_active_requests: null });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            const payload = onConfirm.mock.calls[0][0];
            expect(payload.max_active_requests).toBeUndefined();
        });
        it('should omit max_active_requests when input is not a number', () => {
            const { onConfirm } = setup({ isEditModal: true, max_active_requests: null });
            react_1.fireEvent.change(react_1.screen.getByRole('spinbutton'), { target: { value: 'abc' } });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.save' }));
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            const payload = onConfirm.mock.calls[0][0];
            expect(payload.max_active_requests).toBeUndefined();
        });
        it('should show toast error and not submit when name becomes empty before debounced submit runs', () => {
            const { onConfirm, onHide } = setup({ appName: 'My App' });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.create' }));
            react_1.fireEvent.change(react_1.screen.getByPlaceholderText('app.newApp.appNamePlaceholder'), { target: { value: '   ' } });
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(300);
            });
            expect(react_1.screen.getByText('explore.appCustomize.nameRequired')).toBeInTheDocument();
            (0, react_1.act)(() => {
                vi.advanceTimersByTime(6000);
            });
            expect(react_1.screen.queryByText('explore.appCustomize.nameRequired')).not.toBeInTheDocument();
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQXVFO0FBQ3ZFLCtCQUE4QjtBQUM5QixtRUFBdUc7QUFDdkcsd0RBQW9EO0FBQ3BELHFDQUF5QztBQUN6QyxtQ0FBb0M7QUFFcEMsSUFBSSx3QkFBd0IsR0FBdUMsRUFBRSxDQUFBO0FBRXJFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE9BQWlDLEVBQUUsRUFBRTtZQUNwRCxNQUFNLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUM5QyxJQUFJLFFBQVEsS0FBSyxTQUFTO2dCQUN4QixPQUFPLFFBQVEsQ0FBQTtZQUNqQixJQUFJLE9BQU8sRUFBRSxhQUFhO2dCQUN4QixPQUFPLENBQUMsR0FBRyxHQUFHLFlBQVksRUFBRSxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUE7WUFDakQsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDWixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFBO2dCQUMvQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDakMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO2dCQUM3RSxPQUFPLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLEVB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QUE7WUFDRixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDdkYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENyZWF0ZUFwcE1vZGFsUHJvcHMgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHR5cGUgeyBVc2FnZVBsYW5JbmZvIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBhY3QsIGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjcmVhdGVNb2NrUGxhbiwgY3JlYXRlTW9ja1BsYW5Ub3RhbCwgY3JlYXRlTW9ja1BsYW5Vc2FnZSB9IGZyb20gJ0AvX19tb2Nrc19fL3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyBQbGFuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IENyZWF0ZUFwcE1vZGFsIGZyb20gJy4vaW5kZXgnXG5cbmxldCBtb2NrVHJhbnNsYXRpb25PdmVycmlkZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZD4gPSB7fVxuXG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgKCkgPT4gKHtcbiAgdXNlVHJhbnNsYXRpb246ICgpID0+ICh7XG4gICAgdDogKGtleTogc3RyaW5nLCBvcHRpb25zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIGNvbnN0IG92ZXJyaWRlID0gbW9ja1RyYW5zbGF0aW9uT3ZlcnJpZGVzW2tleV1cbiAgICAgIGlmIChvdmVycmlkZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gb3ZlcnJpZGVcbiAgICAgIGlmIChvcHRpb25zPy5yZXR1cm5PYmplY3RzKVxuICAgICAgICByZXR1cm4gW2Ake2tleX0tZmVhdHVyZS0xYCwgYCR7a2V5fS1mZWF0dXJlLTJgXVxuICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgeyBucywgLi4ucmVzdCB9ID0gb3B0aW9uc1xuICAgICAgICBjb25zdCBwcmVmaXggPSBucyA/IGAke25zfS5gIDogJydcbiAgICAgICAgY29uc3Qgc3VmZml4ID0gT2JqZWN0LmtleXMocmVzdCkubGVuZ3RoID4gMCA/IGA6JHtKU09OLnN0cmluZ2lmeShyZXN0KX1gIDogJydcbiAgICAgICAgcmV0dXJuIGAke3ByZWZpeH0ke2tleX0ke3N1ZmZpeH1gXG4gICAgICB9XG4gICAgICByZXR1cm4ga2V5XG4gICAgfSxcbiAgICBpMThuOiB7XG4gICAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICAgIGNoYW5nZUxhbmd1YWdlOiB2aS5mbigpLFxuICAgIH0sXG4gIH0pLFxuICBUcmFuczogKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiBjaGlsZHJlbixcbiAgaW5pdFJlYWN0STE4bmV4dDoge1xuICAgIHR5cGU6ICczcmRQYXJ0eScsXG4gICAgaW5pdDogdmkuZm4oKSxcbiAgfSxcbn0pKVxuXG4vLyBBdm9pZCBoZWF2eSBlbW9qaSBkYXRhc2V0IGluaXRpYWxpemF0aW9uIGR1cmluZyB1bml0IHRlc3RzLlxudmkubW9jaygnZW1vamktbWFydCcsICgpID0+ICh7XG4gIGluaXQ6IHZpLmZuKCksXG4gIFNlYXJjaEluZGV4OiB7IHNlYXJjaDogdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZShbXSkgfSxcbn0pKVxudmkubW9jaygnQGVtb2ppLW1hcnQvZGF0YScsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBjYXRlZ29yaWVzOiBbXG4gICAgICB7IGlkOiAncGVvcGxlJywgZW1vamlzOiBbJ/CfmIAnXSB9LFxuICAgIF0sXG4gIH0sXG59KSlcblxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUGFyYW1zOiAoKSA9PiAoe30pLFxufSkpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUFwcENvbnRleHQ6ICgpID0+ICh7XG4gICAgdXNlclByb2ZpbGU6IHsgZW1haWw6ICd0ZXN0QGV4YW1wbGUuY29tJyB9LFxuICAgIGxhbmdHZW5pdXNWZXJzaW9uSW5mbzogeyBjdXJyZW50X3ZlcnNpb246ICcwLjAuMCcgfSxcbiAgfSksXG59KSlcblxuY29uc3QgY3JlYXRlUGxhbkluZm8gPSAoYnVpbGRBcHBzOiBudW1iZXIpOiBVc2FnZVBsYW5JbmZvID0+ICh7XG4gIHZlY3RvclNwYWNlOiAwLFxuICBidWlsZEFwcHMsXG4gIHRlYW1NZW1iZXJzOiAwLFxuICBhbm5vdGF0ZWRSZXNwb25zZTogMCxcbiAgZG9jdW1lbnRzVXBsb2FkUXVvdGE6IDAsXG4gIGFwaVJhdGVMaW1pdDogMCxcbiAgdHJpZ2dlckV2ZW50czogMCxcbn0pXG5cbmxldCBtb2NrRW5hYmxlQmlsbGluZyA9IGZhbHNlXG5sZXQgbW9ja1BsYW5UeXBlOiBQbGFuID0gUGxhbi50ZWFtXG5sZXQgbW9ja1VzYWdlUGxhbkluZm86IFVzYWdlUGxhbkluZm8gPSBjcmVhdGVQbGFuSW5mbygxKVxubGV0IG1vY2tUb3RhbFBsYW5JbmZvOiBVc2FnZVBsYW5JbmZvID0gY3JlYXRlUGxhbkluZm8oMTApXG5cbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUHJvdmlkZXJDb250ZXh0OiAoKSA9PiB7XG4gICAgY29uc3Qgd2l0aFBsYW4gPSBjcmVhdGVNb2NrUGxhbihtb2NrUGxhblR5cGUpXG4gICAgY29uc3Qgd2l0aFVzYWdlID0gY3JlYXRlTW9ja1BsYW5Vc2FnZShtb2NrVXNhZ2VQbGFuSW5mbywgd2l0aFBsYW4pXG4gICAgY29uc3Qgd2l0aFRvdGFsID0gY3JlYXRlTW9ja1BsYW5Ub3RhbChtb2NrVG90YWxQbGFuSW5mbywgd2l0aFVzYWdlKVxuICAgIHJldHVybiB7IC4uLndpdGhUb3RhbCwgZW5hYmxlQmlsbGluZzogbW9ja0VuYWJsZUJpbGxpbmcgfVxuICB9LFxufSkpXG5cbnR5cGUgQ29uZmlybVBheWxvYWQgPSBQYXJhbWV0ZXJzPENyZWF0ZUFwcE1vZGFsUHJvcHNbJ29uQ29uZmlybSddPlswXVxuXG5jb25zdCBzZXR1cCA9IChvdmVycmlkZXM6IFBhcnRpYWw8Q3JlYXRlQXBwTW9kYWxQcm9wcz4gPSB7fSkgPT4ge1xuICBjb25zdCBvbkNvbmZpcm0gPSB2aS5mbjwocGF5bG9hZDogQ29uZmlybVBheWxvYWQpID0+IFByb21pc2U8dm9pZD4+KCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG5cbiAgY29uc3QgcHJvcHM6IENyZWF0ZUFwcE1vZGFsUHJvcHMgPSB7XG4gICAgc2hvdzogdHJ1ZSxcbiAgICBpc0VkaXRNb2RhbDogZmFsc2UsXG4gICAgYXBwTmFtZTogJ1Rlc3QgQXBwJyxcbiAgICBhcHBEZXNjcmlwdGlvbjogJ1Rlc3QgZGVzY3JpcHRpb24nLFxuICAgIGFwcEljb25UeXBlOiAnZW1vamknLFxuICAgIGFwcEljb246ICfwn6SWJyxcbiAgICBhcHBJY29uQmFja2dyb3VuZDogJyNGRkVBRDUnLFxuICAgIGFwcEljb25Vcmw6IG51bGwsXG4gICAgYXBwTW9kZTogQXBwTW9kZUVudW0uQ0hBVCxcbiAgICBhcHBVc2VJY29uQXNBbnN3ZXJJY29uOiBmYWxzZSxcbiAgICBtYXhfYWN0aXZlX3JlcXVlc3RzOiBudWxsLFxuICAgIG9uQ29uZmlybSxcbiAgICBjb25maXJtRGlzYWJsZWQ6IGZhbHNlLFxuICAgIG9uSGlkZSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cblxuICByZW5kZXIoPENyZWF0ZUFwcE1vZGFsIHsuLi5wcm9wc30gLz4pXG4gIHJldHVybiB7IG9uQ29uZmlybSwgb25IaWRlIH1cbn1cblxuY29uc3QgZ2V0QXBwSWNvblRyaWdnZXIgPSAoKTogSFRNTEVsZW1lbnQgPT4ge1xuICBjb25zdCBuYW1lSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2FwcC5uZXdBcHAuYXBwTmFtZVBsYWNlaG9sZGVyJylcbiAgY29uc3QgaWNvblJvdyA9IG5hbWVJbnB1dC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50XG4gIGNvbnN0IGljb25UcmlnZ2VyID0gaWNvblJvdz8uZmlyc3RFbGVtZW50Q2hpbGRcbiAgaWYgKCEoaWNvblRyaWdnZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gbG9jYXRlIGFwcCBpY29uIHRyaWdnZXInKVxuICByZXR1cm4gaWNvblRyaWdnZXJcbn1cblxuZGVzY3JpYmUoJ0NyZWF0ZUFwcE1vZGFsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVHJhbnNsYXRpb25PdmVycmlkZXMgPSB7fVxuICAgIG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbiAgICBtb2NrUGxhblR5cGUgPSBQbGFuLnRlYW1cbiAgICBtb2NrVXNhZ2VQbGFuSW5mbyA9IGNyZWF0ZVBsYW5JbmZvKDEpXG4gICAgbW9ja1RvdGFsUGxhbkluZm8gPSBjcmVhdGVQbGFuSW5mbygxMClcbiAgfSlcblxuICAvLyBUaGUgdGl0bGUgYW5kIGZvcm0gc2VjdGlvbnMgdmFyeSBiYXNlZCBvbiB0aGUgbW9kYWwgbW9kZSAoY3JlYXRlIHZzIGVkaXQpLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNyZWF0ZSB0aXRsZSBhbmQgYWN0aW9ucyB3aGVuIGNyZWF0aW5nJywgKCkgPT4ge1xuICAgICAgc2V0dXAoeyBhcHBOYW1lOiAnTXkgQXBwJywgaXNFZGl0TW9kYWw6IGZhbHNlIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdleHBsb3JlLmFwcEN1c3RvbWl6ZS50aXRsZTp7XCJuYW1lXCI6XCJNeSBBcHBcIn0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY3JlYXRlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlZGl0LW9ubHkgZmllbGRzIHdoZW4gZWRpdGluZyBhIGNoYXQgYXBwJywgKCkgPT4ge1xuICAgICAgc2V0dXAoeyBpc0VkaXRNb2RhbDogdHJ1ZSwgYXBwTW9kZTogQXBwTW9kZUVudW0uQ0hBVCwgbWF4X2FjdGl2ZV9yZXF1ZXN0czogNSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmVkaXRBcHBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoKHNjcmVlbi5nZXRCeVJvbGUoJ3NwaW5idXR0b24nKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSkudG9CZSgnNScpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW0FwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVQsIEFwcE1vZGVFbnVtLkFHRU5UX0NIQVRdKSgnc2hvdWxkIHJlbmRlciBhbnN3ZXIgaWNvbiBzd2l0Y2ggd2hlbiBlZGl0aW5nICVzIGFwcCcsIChtb2RlKSA9PiB7XG4gICAgICBzZXR1cCh7IGlzRWRpdE1vZGFsOiB0cnVlLCBhcHBNb2RlOiBtb2RlIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgYW5zd2VyIGljb24gc3dpdGNoIHdoZW4gZWRpdGluZyBhIG5vbi1jaGF0IGFwcCcsICgpID0+IHtcbiAgICAgIHNldHVwKHsgaXNFZGl0TW9kYWw6IHRydWUsIGFwcE1vZGU6IEFwcE1vZGVFbnVtLkNPTVBMRVRJT04gfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnc3dpdGNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBtb2RhbCBjb250ZW50IHdoZW4gaGlkZGVuJywgKCkgPT4ge1xuICAgICAgc2V0dXAoeyBzaG93OiBmYWxzZSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNyZWF0ZScgfSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBEaXNhYmxlZCBzdGF0ZXMgcHJldmVudCBzdWJtaXNzaW9uIGFuZCByZWZsZWN0IHBhcmVudC1kcml2ZW4gcHJvcHMuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgY29uZmlybSBhY3Rpb24gd2hlbiBjb25maXJtRGlzYWJsZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHNldHVwKHsgY29uZmlybURpc2FibGVkOiB0cnVlIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNyZWF0ZScgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBjb25maXJtIGFjdGlvbiB3aGVuIGFwcE5hbWUgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBzZXR1cCh7IGFwcE5hbWU6ICcgICAnIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNyZWF0ZScgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBEZWZlbnNpdmUgY292ZXJhZ2UgZm9yIGZhbHN5IGlucHV0IHZhbHVlcyBhbmQgdHJhbnNsYXRpb24gZWRnZSBjYXNlcy5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZWZhdWx0IGRlc2NyaXB0aW9uIHRvIGVtcHR5IHN0cmluZyB3aGVuIGFwcERlc2NyaXB0aW9uIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgc2V0dXAoeyBhcHBEZXNjcmlwdGlvbjogJycgfSlcblxuICAgICAgZXhwZWN0KChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2FwcC5uZXdBcHAuYXBwRGVzY3JpcHRpb25QbGFjZWhvbGRlcicpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlKS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZhbGwgYmFjayB0byBlbXB0eSBwbGFjZWhvbGRlcnMgd2hlbiB0cmFuc2xhdGlvbnMgcmV0dXJuIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICAgIG1vY2tUcmFuc2xhdGlvbk92ZXJyaWRlcyA9IHtcbiAgICAgICAgJ25ld0FwcC5hcHBOYW1lUGxhY2Vob2xkZXInOiAnJyxcbiAgICAgICAgJ25ld0FwcC5hcHBEZXNjcmlwdGlvblBsYWNlaG9sZGVyJzogJycsXG4gICAgICB9XG5cbiAgICAgIHNldHVwKClcblxuICAgICAgZXhwZWN0KChzY3JlZW4uZ2V0QnlEaXNwbGF5VmFsdWUoJ1Rlc3QgQXBwJykgYXMgSFRNTElucHV0RWxlbWVudCkucGxhY2Vob2xkZXIpLnRvQmUoJycpXG4gICAgICBleHBlY3QoKHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgnVGVzdCBkZXNjcmlwdGlvbicpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnBsYWNlaG9sZGVyKS50b0JlKCcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGhlIG1vZGFsIHNob3VsZCBjbG9zZSBmcm9tIHVzZXItaW5pdGlhdGVkIGNhbmNlbGxhdGlvbiBhY3Rpb25zLlxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uSGlkZSB3aGVuIGNhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgb25Db25maXJtLCBvbkhpZGUgfSA9IHNldHVwKClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJyB9KSlcblxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBwcmVzc2luZyBFc2NhcGUgd2hpbGUgdmlzaWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgb25IaWRlIH0gPSBzZXR1cCgpXG5cbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKHdpbmRvdywgeyBrZXk6ICdFc2NhcGUnLCBrZXlDb2RlOiAyNyB9KVxuXG4gICAgICBleHBlY3Qob25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkhpZGUgd2hlbiBwcmVzc2luZyBFc2NhcGUgd2hpbGUgaGlkZGVuJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkhpZGUgfSA9IHNldHVwKHsgc2hvdzogZmFsc2UgfSlcblxuICAgICAgZmlyZUV2ZW50LmtleURvd24od2luZG93LCB7IGtleTogJ0VzY2FwZScsIGtleUNvZGU6IDI3IH0pXG5cbiAgICAgIGV4cGVjdChvbkhpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFdoZW4gYmlsbGluZyBsaW1pdHMgYXJlIHJlYWNoZWQsIHRoZSBtb2RhbCBibG9ja3MgYXBwIGNyZWF0aW9uIGFuZCBzaG93cyBxdW90YSBndWlkYW5jZS5cbiAgZGVzY3JpYmUoJ1F1b3RhIEdhdGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgQXBwc0Z1bGwgYW5kIGRpc2FibGUgY3JlYXRlIHdoZW4gYXBwcyBxdW90YSBpcyByZWFjaGVkJywgKCkgPT4ge1xuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhblR5cGUgPSBQbGFuLnRlYW1cbiAgICAgIG1vY2tVc2FnZVBsYW5JbmZvID0gY3JlYXRlUGxhbkluZm8oMTApXG4gICAgICBtb2NrVG90YWxQbGFuSW5mbyA9IGNyZWF0ZVBsYW5JbmZvKDEwKVxuXG4gICAgICBzZXR1cCh7IGlzRWRpdE1vZGFsOiBmYWxzZSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5hcHBzLmZ1bGxUaXAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNyZWF0ZScgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgc2F2aW5nIHdoZW4gYXBwcyBxdW90YSBpcyByZWFjaGVkIGluIGVkaXQgbW9kZScsICgpID0+IHtcbiAgICAgIG1vY2tFbmFibGVCaWxsaW5nID0gdHJ1ZVxuICAgICAgbW9ja1BsYW5UeXBlID0gUGxhbi50ZWFtXG4gICAgICBtb2NrVXNhZ2VQbGFuSW5mbyA9IGNyZWF0ZVBsYW5JbmZvKDEwKVxuICAgICAgbW9ja1RvdGFsUGxhbkluZm8gPSBjcmVhdGVQbGFuSW5mbygxMClcblxuICAgICAgc2V0dXAoeyBpc0VkaXRNb2RhbDogdHJ1ZSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiaWxsaW5nLmFwcHMuZnVsbFRpcDInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLnNhdmUnIH0pKS50b0JlRW5hYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBTaG9ydGN1dCBoYW5kbGVycyBhcmUgaW1wb3J0YW50IGZvciBwb3dlciB1c2VycyBhbmQgbXVzdCByZXNwZWN0IGdhdGluZyBydWxlcy5cbiAgZGVzY3JpYmUoJ0tleWJvYXJkIFNob3J0Y3V0cycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHZpLnVzZUZha2VUaW1lcnMoKVxuICAgIH0pXG5cbiAgICBhZnRlckVhY2goKCkgPT4ge1xuICAgICAgdmkudXNlUmVhbFRpbWVycygpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgWydtZXRhK2VudGVyJywgeyBtZXRhS2V5OiB0cnVlIH1dLFxuICAgICAgWydjdHJsK2VudGVyJywgeyBjdHJsS2V5OiB0cnVlIH1dLFxuICAgIF0pKCdzaG91bGQgc3VibWl0IHdoZW4gJXMgaXMgcHJlc3NlZCB3aGlsZSB2aXNpYmxlJywgKF8sIG1vZGlmaWVyKSA9PiB7XG4gICAgICBjb25zdCB7IG9uQ29uZmlybSwgb25IaWRlIH0gPSBzZXR1cCgpXG5cbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKHdpbmRvdywgeyBrZXk6ICdFbnRlcicsIGtleUNvZGU6IDEzLCAuLi5tb2RpZmllciB9KVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzdWJtaXQgd2hlbiBtb2RhbCBpcyBoaWRkZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IG9uQ29uZmlybSwgb25IaWRlIH0gPSBzZXR1cCh7IHNob3c6IGZhbHNlIH0pXG5cbiAgICAgIGZpcmVFdmVudC5rZXlEb3duKHdpbmRvdywgeyBrZXk6ICdFbnRlcicsIGtleUNvZGU6IDEzLCBtZXRhS2V5OiB0cnVlIH0pXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDMwMClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvbkhpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc3VibWl0IHdoZW4gYXBwcyBxdW90YSBpcyByZWFjaGVkIGluIGNyZWF0ZSBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhblR5cGUgPSBQbGFuLnRlYW1cbiAgICAgIG1vY2tVc2FnZVBsYW5JbmZvID0gY3JlYXRlUGxhbkluZm8oMTApXG4gICAgICBtb2NrVG90YWxQbGFuSW5mbyA9IGNyZWF0ZVBsYW5JbmZvKDEwKVxuXG4gICAgICBjb25zdCB7IG9uQ29uZmlybSwgb25IaWRlIH0gPSBzZXR1cCh7IGlzRWRpdE1vZGFsOiBmYWxzZSB9KVxuXG4gICAgICBmaXJlRXZlbnQua2V5RG93bih3aW5kb3csIHsga2V5OiAnRW50ZXInLCBrZXlDb2RlOiAxMywgbWV0YUtleTogdHJ1ZSB9KVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25IaWRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3VibWl0IHdoZW4gYXBwcyBxdW90YSBpcyByZWFjaGVkIGluIGVkaXQgbW9kZScsICgpID0+IHtcbiAgICAgIG1vY2tFbmFibGVCaWxsaW5nID0gdHJ1ZVxuICAgICAgbW9ja1BsYW5UeXBlID0gUGxhbi50ZWFtXG4gICAgICBtb2NrVXNhZ2VQbGFuSW5mbyA9IGNyZWF0ZVBsYW5JbmZvKDEwKVxuICAgICAgbW9ja1RvdGFsUGxhbkluZm8gPSBjcmVhdGVQbGFuSW5mbygxMClcblxuICAgICAgY29uc3QgeyBvbkNvbmZpcm0sIG9uSGlkZSB9ID0gc2V0dXAoeyBpc0VkaXRNb2RhbDogdHJ1ZSB9KVxuXG4gICAgICBmaXJlRXZlbnQua2V5RG93bih3aW5kb3csIHsga2V5OiAnRW50ZXInLCBrZXlDb2RlOiAxMywgbWV0YUtleTogdHJ1ZSB9KVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzdWJtaXQgd2hlbiBuYW1lIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0sIG9uSGlkZSB9ID0gc2V0dXAoeyBhcHBOYW1lOiAnICAgJyB9KVxuXG4gICAgICBmaXJlRXZlbnQua2V5RG93bih3aW5kb3csIHsga2V5OiAnRW50ZXInLCBrZXlDb2RlOiAxMywgbWV0YUtleTogdHJ1ZSB9KVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25IaWRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUaGUgYXBwIGljb24gcGlja2VyIGlzIGEga2V5IHVzZXIgZmxvdyBmb3IgY3VzdG9taXppbmcgbWV0YWRhdGEuXG4gIGRlc2NyaWJlKCdBcHAgSWNvbiBQaWNrZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFuZCBjbG9zZSB0aGUgcGlja2VyIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBzZXR1cCh7XG4gICAgICAgIGFwcEljb25UeXBlOiAnaW1hZ2UnLFxuICAgICAgICBhcHBJY29uOiAnZmlsZS0xMjMnLFxuICAgICAgICBhcHBJY29uVXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QXBwSWNvblRyaWdnZXIoKSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5pY29uUGlja2VyLmNhbmNlbCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5pY29uUGlja2VyLmNhbmNlbCcgfSkpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5pY29uUGlja2VyLmNhbmNlbCcgfSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGljb24gcGF5bG9hZCB3aGVuIHNlbGVjdGluZyBlbW9qaSBhbmQgY29uZmlybWluZycsICgpID0+IHtcbiAgICAgIHZpLnVzZUZha2VUaW1lcnMoKVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHtcbiAgICAgICAgICBhcHBJY29uVHlwZTogJ2ltYWdlJyxcbiAgICAgICAgICBhcHBJY29uOiAnZmlsZS0xMjMnLFxuICAgICAgICAgIGFwcEljb25Vcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nJyxcbiAgICAgICAgfSlcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QXBwSWNvblRyaWdnZXIoKSlcblxuICAgICAgICAvLyBGaW5kIHRoZSBlbW9qaSBncmlkIGJ5IGxvY2F0aW5nIHRoZSBjYXRlZ29yeSBsYWJlbCwgdGhlbiBmaW5kIHRoZSBjbGlja2FibGUgZW1vamkgd3JhcHBlclxuICAgICAgICBjb25zdCBjYXRlZ29yeUxhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgncGVvcGxlJylcbiAgICAgICAgY29uc3QgZW1vamlHcmlkID0gY2F0ZWdvcnlMYWJlbC5uZXh0RWxlbWVudFNpYmxpbmdcbiAgICAgICAgY29uc3QgY2xpY2thYmxlRW1vamlXcmFwcGVyID0gZW1vamlHcmlkPy5maXJzdEVsZW1lbnRDaGlsZFxuICAgICAgICBpZiAoIShjbGlja2FibGVFbW9qaVdyYXBwZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gbG9jYXRlIGVtb2ppIHdyYXBwZXInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xpY2thYmxlRW1vamlXcmFwcGVyKVxuXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdhcHAuaWNvblBpY2tlci5vaycgfSkpXG5cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY3JlYXRlJyB9KSlcbiAgICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDMwMClcbiAgICAgICAgfSlcblxuICAgICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IG9uQ29uZmlybS5tb2NrLmNhbGxzWzBdWzBdXG4gICAgICAgIGV4cGVjdChwYXlsb2FkKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgICBpY29uX3R5cGU6ICdlbW9qaScsXG4gICAgICAgICAgaWNvbjogJ/CfmIAnLFxuICAgICAgICAgIGljb25fYmFja2dyb3VuZDogJyNGRkVBRDUnLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIHZpLnVzZVJlYWxUaW1lcnMoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlc2V0IGVtb2ppIGljb24gdG8gaW5pdGlhbCBwcm9wcyB3aGVuIHBpY2tlciBpcyBjYW5jZWxsZWQnLCAoKSA9PiB7XG4gICAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgb25Db25maXJtIH0gPSBzZXR1cCh7XG4gICAgICAgICAgYXBwSWNvblR5cGU6ICdlbW9qaScsXG4gICAgICAgICAgYXBwSWNvbjogJ/CfpJYnLFxuICAgICAgICAgIGFwcEljb25CYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gT3BlbiBwaWNrZXIsIHNlbGVjdCBhIG5ldyBlbW9qaSwgYW5kIGNvbmZpcm1cbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFwcEljb25UcmlnZ2VyKCkpXG5cbiAgICAgICAgLy8gRmluZCB0aGUgZW1vamkgZ3JpZCBieSBsb2NhdGluZyB0aGUgY2F0ZWdvcnkgbGFiZWwsIHRoZW4gZmluZCB0aGUgY2xpY2thYmxlIGVtb2ppIHdyYXBwZXJcbiAgICAgICAgY29uc3QgY2F0ZWdvcnlMYWJlbCA9IHNjcmVlbi5nZXRCeVRleHQoJ3Blb3BsZScpXG4gICAgICAgIGNvbnN0IGVtb2ppR3JpZCA9IGNhdGVnb3J5TGFiZWwubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgICAgIGNvbnN0IGNsaWNrYWJsZUVtb2ppV3JhcHBlciA9IGVtb2ppR3JpZD8uZmlyc3RFbGVtZW50Q2hpbGRcbiAgICAgICAgaWYgKCEoY2xpY2thYmxlRW1vamlXcmFwcGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGxvY2F0ZSBlbW9qaSB3cmFwcGVyJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsaWNrYWJsZUVtb2ppV3JhcHBlcilcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnYXBwLmljb25QaWNrZXIub2snIH0pKVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5pY29uUGlja2VyLmNhbmNlbCcgfSkpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgLy8gT3BlbiBwaWNrZXIgYWdhaW4gYW5kIGNhbmNlbCAtIHNob3VsZCByZXNldCB0byBpbml0aWFsIHByb3BzXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBcHBJY29uVHJpZ2dlcigpKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnYXBwLmljb25QaWNrZXIuY2FuY2VsJyB9KSlcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdhcHAuaWNvblBpY2tlci5jYW5jZWwnIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAgIC8vIFN1Ym1pdCBhbmQgdmVyaWZ5IHRoZSBwYXlsb2FkIHVzZXMgdGhlIG9yaWdpbmFsIGljb24gKGNhbmNlbCByZXZlcnRzIHRvIHByb3BzKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jcmVhdGUnIH0pKVxuICAgICAgICBhY3QoKCkgPT4ge1xuICAgICAgICAgIHZpLmFkdmFuY2VUaW1lcnNCeVRpbWUoMzAwKVxuICAgICAgICB9KVxuXG4gICAgICAgIGV4cGVjdChvbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gb25Db25maXJtLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgICAgZXhwZWN0KHBheWxvYWQpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICAgICAgICBpY29uOiAn8J+klicsXG4gICAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBmaW5hbGx5IHtcbiAgICAgICAgdmkudXNlUmVhbFRpbWVycygpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICAvLyBTdWJtaXR0aW5nIHVzZXMgYSBkZWJvdW5jZWQgaGFuZGxlciBhbmQgYnVpbGRzIGEgcGF5bG9hZCBmcm9tIGN1cnJlbnQgZm9ybSBzdGF0ZS5cbiAgZGVzY3JpYmUoJ1N1Ym1pdHRpbmcnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHZpLnVzZVJlYWxUaW1lcnMoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25Db25maXJtIHdpdGggZW1vamkgcGF5bG9hZCBhbmQgaGlkZSB3aGVuIGNyZWF0ZSBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0sIG9uSGlkZSB9ID0gc2V0dXAoe1xuICAgICAgICBhcHBOYW1lOiAnTXkgQXBwJyxcbiAgICAgICAgYXBwRGVzY3JpcHRpb246ICdNeSBkZXNjcmlwdGlvbicsXG4gICAgICAgIGFwcEljb25UeXBlOiAnZW1vamknLFxuICAgICAgICBhcHBJY29uOiAn8J+YgCcsXG4gICAgICAgIGFwcEljb25CYWNrZ3JvdW5kOiAnIzAwMDAwMCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jcmVhdGUnIH0pKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICBjb25zdCBwYXlsb2FkID0gb25Db25maXJtLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIGV4cGVjdChwYXlsb2FkKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgbmFtZTogJ015IEFwcCcsXG4gICAgICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICAgICAgaWNvbjogJ/CfmIAnLFxuICAgICAgICBpY29uX2JhY2tncm91bmQ6ICcjMDAwMDAwJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdNeSBkZXNjcmlwdGlvbicsXG4gICAgICAgIHVzZV9pY29uX2FzX2Fuc3dlcl9pY29uOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBleHBlY3QocGF5bG9hZCkubm90LnRvSGF2ZVByb3BlcnR5KCdtYXhfYWN0aXZlX3JlcXVlc3RzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIHVwZGF0ZWQgZGVzY3JpcHRpb24gd2hlbiB0ZXh0YXJlYSBpcyBjaGFuZ2VkIGJlZm9yZSBzdWJtaXR0aW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHsgYXBwRGVzY3JpcHRpb246ICdPbGQgZGVzY3JpcHRpb24nIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdhcHAubmV3QXBwLmFwcERlc2NyaXB0aW9uUGxhY2Vob2xkZXInKSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdVcGRhdGVkIGRlc2NyaXB0aW9uJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jcmVhdGUnIH0pKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qob25Db25maXJtKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0ubW9jay5jYWxsc1swXVswXSkudG9NYXRjaE9iamVjdCh7IGRlc2NyaXB0aW9uOiAnVXBkYXRlZCBkZXNjcmlwdGlvbicgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvbWl0IGljb25fYmFja2dyb3VuZCB3aGVuIHN1Ym1pdHRpbmcgd2l0aCBpbWFnZSBpY29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHtcbiAgICAgICAgYXBwSWNvblR5cGU6ICdpbWFnZScsXG4gICAgICAgIGFwcEljb246ICdmaWxlLTEyMycsXG4gICAgICAgIGFwcEljb25Vcmw6ICdodHRwczovL2V4YW1wbGUuY29tL2ljb24ucG5nJyxcbiAgICAgICAgYXBwSWNvbkJhY2tncm91bmQ6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jcmVhdGUnIH0pKVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwYXlsb2FkID0gb25Db25maXJtLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIGV4cGVjdChwYXlsb2FkKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgaWNvbl90eXBlOiAnaW1hZ2UnLFxuICAgICAgICBpY29uOiAnZmlsZS0xMjMnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChwYXlsb2FkLmljb25fYmFja2dyb3VuZCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBtYXhfYWN0aXZlX3JlcXVlc3RzIGFuZCB1cGRhdGVkIGFuc3dlciBpY29uIHdoZW4gc2F2aW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHtcbiAgICAgICAgaXNFZGl0TW9kYWw6IHRydWUsXG4gICAgICAgIGFwcE1vZGU6IEFwcE1vZGVFbnVtLkNIQVQsXG4gICAgICAgIGFwcFVzZUljb25Bc0Fuc3dlckljb246IGZhbHNlLFxuICAgICAgICBtYXhfYWN0aXZlX3JlcXVlc3RzOiAzLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ3N3aXRjaCcpKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzY3JlZW4uZ2V0QnlSb2xlKCdzcGluYnV0dG9uJyksIHsgdGFyZ2V0OiB7IHZhbHVlOiAnMTInIH0gfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDMwMClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBvbkNvbmZpcm0ubW9jay5jYWxsc1swXVswXVxuICAgICAgZXhwZWN0KHBheWxvYWQpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogdHJ1ZSxcbiAgICAgICAgbWF4X2FjdGl2ZV9yZXF1ZXN0czogMTIsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9taXQgbWF4X2FjdGl2ZV9yZXF1ZXN0cyB3aGVuIGlucHV0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHsgaXNFZGl0TW9kYWw6IHRydWUsIG1heF9hY3RpdmVfcmVxdWVzdHM6IG51bGwgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScgfSkpXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDMwMClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBheWxvYWQgPSBvbkNvbmZpcm0ubW9jay5jYWxsc1swXVswXVxuICAgICAgZXhwZWN0KHBheWxvYWQubWF4X2FjdGl2ZV9yZXF1ZXN0cykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb21pdCBtYXhfYWN0aXZlX3JlcXVlc3RzIHdoZW4gaW5wdXQgaXMgbm90IGEgbnVtYmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBvbkNvbmZpcm0gfSA9IHNldHVwKHsgaXNFZGl0TW9kYWw6IHRydWUsIG1heF9hY3RpdmVfcmVxdWVzdHM6IG51bGwgfSlcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShzY3JlZW4uZ2V0QnlSb2xlKCdzcGluYnV0dG9uJyksIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYWJjJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5zYXZlJyB9KSlcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHZpLmFkdmFuY2VUaW1lcnNCeVRpbWUoMzAwKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGF5bG9hZCA9IG9uQ29uZmlybS5tb2NrLmNhbGxzWzBdWzBdXG4gICAgICBleHBlY3QocGF5bG9hZC5tYXhfYWN0aXZlX3JlcXVlc3RzKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHRvYXN0IGVycm9yIGFuZCBub3Qgc3VibWl0IHdoZW4gbmFtZSBiZWNvbWVzIGVtcHR5IGJlZm9yZSBkZWJvdW5jZWQgc3VibWl0IHJ1bnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IG9uQ29uZmlybSwgb25IaWRlIH0gPSBzZXR1cCh7IGFwcE5hbWU6ICdNeSBBcHAnIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNyZWF0ZScgfSkpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnYXBwLm5ld0FwcC5hcHBOYW1lUGxhY2Vob2xkZXInKSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcgICAnIH0gfSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSgzMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZXhwbG9yZS5hcHBDdXN0b21pemUubmFtZVJlcXVpcmVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHZpLmFkdmFuY2VUaW1lcnNCeVRpbWUoNjAwMClcbiAgICAgIH0pXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdleHBsb3JlLmFwcEN1c3RvbWl6ZS5uYW1lUmVxdWlyZWQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvbkhpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==