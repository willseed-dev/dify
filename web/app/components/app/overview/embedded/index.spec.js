"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const copy_to_clipboard_1 = require("copy-to-clipboard");
const React = require("react");
const react_2 = require("react");
const vitest_1 = require("vitest");
const index_1 = require("./index");
vitest_1.vi.mock('./style.module.css', () => ({
    default: {
        option: 'option',
        active: 'active',
        iframeIcon: 'iframeIcon',
        scriptsIcon: 'scriptsIcon',
        chromePluginIcon: 'chromePluginIcon',
        pluginInstallIcon: 'pluginInstallIcon',
    },
}));
const mockThemeBuilder = {
    buildTheme: vitest_1.vi.fn(),
    theme: {
        primaryColor: '#123456',
    },
};
const mockUseAppContext = vitest_1.vi.fn(() => ({
    langGeniusVersionInfo: {
        current_env: 'PRODUCTION',
        current_version: '',
        latest_version: '',
        release_date: '',
        release_notes: '',
        version: '',
        can_auto_update: false,
    },
}));
vitest_1.vi.mock('copy-to-clipboard', () => ({
    default: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/app/components/base/chat/embedded-chatbot/theme/theme-context', () => ({
    useThemeContext: () => mockThemeBuilder,
}));
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => mockUseAppContext(),
}));
const mockWindowOpen = vitest_1.vi.spyOn(window, 'open').mockImplementation(() => null);
const mockedCopy = vitest_1.vi.mocked(copy_to_clipboard_1.default);
const siteInfo = {
    title: 'test site',
    chat_color_theme: '#000000',
    chat_color_theme_inverted: false,
};
const baseProps = {
    isShow: true,
    siteInfo,
    onClose: vitest_1.vi.fn(),
    appBaseUrl: 'https://app.example.com',
    accessToken: 'token',
    className: 'custom-modal',
};
const getCopyButton = () => {
    const buttons = react_1.screen.getAllByRole('button');
    const actionButton = buttons.find(button => button.className.includes('action-btn'));
    (0, vitest_1.expect)(actionButton).toBeDefined();
    return actionButton;
};
(0, vitest_1.describe)('Embedded', () => {
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockWindowOpen.mockClear();
    });
    (0, vitest_1.afterAll)(() => {
        mockWindowOpen.mockRestore();
    });
    (0, vitest_1.it)('builds theme and copies iframe snippet', async () => {
        await (0, react_2.act)(async () => {
            (0, react_1.render)(<index_1.default {...baseProps}/>);
        });
        const actionButton = getCopyButton();
        const innerDiv = actionButton.querySelector('div');
        (0, react_2.act)(() => {
            react_1.fireEvent.click(innerDiv ?? actionButton);
        });
        (0, vitest_1.expect)(mockThemeBuilder.buildTheme).toHaveBeenCalledWith(siteInfo.chat_color_theme, siteInfo.chat_color_theme_inverted);
        (0, vitest_1.expect)(mockedCopy).toHaveBeenCalledWith(vitest_1.expect.stringContaining('/chatbot/token'));
    });
    (0, vitest_1.it)('opens chrome plugin store link when chrome option selected', async () => {
        await (0, react_2.act)(async () => {
            (0, react_1.render)(<index_1.default {...baseProps}/>);
        });
        const optionButtons = document.body.querySelectorAll('[class*="option"]');
        (0, vitest_1.expect)(optionButtons.length).toBeGreaterThanOrEqual(3);
        (0, react_2.act)(() => {
            react_1.fireEvent.click(optionButtons[2]);
        });
        const [chromeText] = react_1.screen.getAllByText('appOverview.overview.appInfo.embedded.chromePlugin');
        (0, react_2.act)(() => {
            react_1.fireEvent.click(chromeText);
        });
        (0, vitest_1.expect)(mockWindowOpen).toHaveBeenCalledWith('https://chrome.google.com/webstore/detail/dify-chatbot/ceehdapohffmjmkdcifjofadiaoeggaf', '_blank', 'noopener,noreferrer');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLHlEQUFvQztBQUNwQywrQkFBOEI7QUFFOUIsaUNBQTJCO0FBQzNCLG1DQUFzRTtBQUN0RSxtQ0FBOEI7QUFFOUIsV0FBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRSxZQUFZO1FBQ3hCLFdBQVcsRUFBRSxhQUFhO1FBQzFCLGdCQUFnQixFQUFFLGtCQUFrQjtRQUNwQyxpQkFBaUIsRUFBRSxtQkFBbUI7S0FDdkM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUNILE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIsVUFBVSxFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkIsS0FBSyxFQUFFO1FBQ0wsWUFBWSxFQUFFLFNBQVM7S0FDeEI7Q0FDRixDQUFBO0FBQ0QsTUFBTSxpQkFBaUIsR0FBRyxXQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckMscUJBQXFCLEVBQUU7UUFDckIsV0FBVyxFQUFFLFlBQVk7UUFDekIsZUFBZSxFQUFFLEVBQUU7UUFDbkIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsWUFBWSxFQUFFLEVBQUU7UUFDaEIsYUFBYSxFQUFFLEVBQUU7UUFDakIsT0FBTyxFQUFFLEVBQUU7UUFDWCxlQUFlLEVBQUUsS0FBSztLQUN2QjtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO0NBQ2pCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsV0FB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QUssSUFBSSxFQUFFO1FBQzFFLE1BQU0sSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkIsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRyxDQUFDLENBQUE7UUFDckMsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDekUsSUFBQSxlQUFNLEVBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3RELElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLGlCQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtRQUM5RixJQUFBLFdBQUcsRUFBQyxHQUFHLEVBQUU7WUFDUCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUM3QixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLGNBQWMsQ0FBQyxDQUFDLG9CQUFvQixDQUN6Qyx5RkFBeUYsRUFDekYsUUFBUSxFQUNSLHFCQUFxQixDQUN0QixDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgU2l0ZUluZm8gfSBmcm9tICdAL21vZGVscy9zaGFyZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IGNvcHkgZnJvbSAnY29weS10by1jbGlwYm9hcmQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHsgYWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBhZnRlckFsbCwgYWZ0ZXJFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgRW1iZWRkZWQgZnJvbSAnLi9pbmRleCdcblxudmkubW9jaygnLi9zdHlsZS5tb2R1bGUuY3NzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDoge1xuICAgIG9wdGlvbjogJ29wdGlvbicsXG4gICAgYWN0aXZlOiAnYWN0aXZlJyxcbiAgICBpZnJhbWVJY29uOiAnaWZyYW1lSWNvbicsXG4gICAgc2NyaXB0c0ljb246ICdzY3JpcHRzSWNvbicsXG4gICAgY2hyb21lUGx1Z2luSWNvbjogJ2Nocm9tZVBsdWdpbkljb24nLFxuICAgIHBsdWdpbkluc3RhbGxJY29uOiAncGx1Z2luSW5zdGFsbEljb24nLFxuICB9LFxufSkpXG5jb25zdCBtb2NrVGhlbWVCdWlsZGVyID0ge1xuICBidWlsZFRoZW1lOiB2aS5mbigpLFxuICB0aGVtZToge1xuICAgIHByaW1hcnlDb2xvcjogJyMxMjM0NTYnLFxuICB9LFxufVxuY29uc3QgbW9ja1VzZUFwcENvbnRleHQgPSB2aS5mbigoKSA9PiAoe1xuICBsYW5nR2VuaXVzVmVyc2lvbkluZm86IHtcbiAgICBjdXJyZW50X2VudjogJ1BST0RVQ1RJT04nLFxuICAgIGN1cnJlbnRfdmVyc2lvbjogJycsXG4gICAgbGF0ZXN0X3ZlcnNpb246ICcnLFxuICAgIHJlbGVhc2VfZGF0ZTogJycsXG4gICAgcmVsZWFzZV9ub3RlczogJycsXG4gICAgdmVyc2lvbjogJycsXG4gICAgY2FuX2F1dG9fdXBkYXRlOiBmYWxzZSxcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCdjb3B5LXRvLWNsaXBib2FyZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHZpLmZuKCksXG59KSlcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGF0L2VtYmVkZGVkLWNoYXRib3QvdGhlbWUvdGhlbWUtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVRoZW1lQ29udGV4dDogKCkgPT4gbW9ja1RoZW1lQnVpbGRlcixcbn0pKVxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlQXBwQ29udGV4dDogKCkgPT4gbW9ja1VzZUFwcENvbnRleHQoKSxcbn0pKVxuY29uc3QgbW9ja1dpbmRvd09wZW4gPSB2aS5zcHlPbih3aW5kb3csICdvcGVuJykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG51bGwpXG5jb25zdCBtb2NrZWRDb3B5ID0gdmkubW9ja2VkKGNvcHkpXG5cbmNvbnN0IHNpdGVJbmZvOiBTaXRlSW5mbyA9IHtcbiAgdGl0bGU6ICd0ZXN0IHNpdGUnLFxuICBjaGF0X2NvbG9yX3RoZW1lOiAnIzAwMDAwMCcsXG4gIGNoYXRfY29sb3JfdGhlbWVfaW52ZXJ0ZWQ6IGZhbHNlLFxufVxuXG5jb25zdCBiYXNlUHJvcHMgPSB7XG4gIGlzU2hvdzogdHJ1ZSxcbiAgc2l0ZUluZm8sXG4gIG9uQ2xvc2U6IHZpLmZuKCksXG4gIGFwcEJhc2VVcmw6ICdodHRwczovL2FwcC5leGFtcGxlLmNvbScsXG4gIGFjY2Vzc1Rva2VuOiAndG9rZW4nLFxuICBjbGFzc05hbWU6ICdjdXN0b20tbW9kYWwnLFxufVxuXG5jb25zdCBnZXRDb3B5QnV0dG9uID0gKCkgPT4ge1xuICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgY29uc3QgYWN0aW9uQnV0dG9uID0gYnV0dG9ucy5maW5kKGJ1dHRvbiA9PiBidXR0b24uY2xhc3NOYW1lLmluY2x1ZGVzKCdhY3Rpb24tYnRuJykpXG4gIGV4cGVjdChhY3Rpb25CdXR0b24pLnRvQmVEZWZpbmVkKClcbiAgcmV0dXJuIGFjdGlvbkJ1dHRvbiFcbn1cblxuZGVzY3JpYmUoJ0VtYmVkZGVkJywgKCkgPT4ge1xuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tXaW5kb3dPcGVuLm1vY2tDbGVhcigpXG4gIH0pXG5cbiAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgIG1vY2tXaW5kb3dPcGVuLm1vY2tSZXN0b3JlKClcbiAgfSlcblxuICBpdCgnYnVpbGRzIHRoZW1lIGFuZCBjb3BpZXMgaWZyYW1lIHNuaXBwZXQnLCBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8RW1iZWRkZWQgey4uLmJhc2VQcm9wc30gLz4pXG4gICAgfSlcblxuICAgIGNvbnN0IGFjdGlvbkJ1dHRvbiA9IGdldENvcHlCdXR0b24oKVxuICAgIGNvbnN0IGlubmVyRGl2ID0gYWN0aW9uQnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpXG4gICAgYWN0KCgpID0+IHtcbiAgICAgIGZpcmVFdmVudC5jbGljayhpbm5lckRpdiA/PyBhY3Rpb25CdXR0b24pXG4gICAgfSlcblxuICAgIGV4cGVjdChtb2NrVGhlbWVCdWlsZGVyLmJ1aWxkVGhlbWUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHNpdGVJbmZvLmNoYXRfY29sb3JfdGhlbWUsIHNpdGVJbmZvLmNoYXRfY29sb3JfdGhlbWVfaW52ZXJ0ZWQpXG4gICAgZXhwZWN0KG1vY2tlZENvcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCcvY2hhdGJvdC90b2tlbicpKVxuICB9KVxuXG4gIGl0KCdvcGVucyBjaHJvbWUgcGx1Z2luIHN0b3JlIGxpbmsgd2hlbiBjaHJvbWUgb3B0aW9uIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEVtYmVkZGVkIHsuLi5iYXNlUHJvcHN9IC8+KVxuICAgIH0pXG5cbiAgICBjb25zdCBvcHRpb25CdXR0b25zID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3MqPVwib3B0aW9uXCJdJylcbiAgICBleHBlY3Qob3B0aW9uQnV0dG9ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMylcbiAgICBhY3QoKCkgPT4ge1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKG9wdGlvbkJ1dHRvbnNbMl0pXG4gICAgfSlcblxuICAgIGNvbnN0IFtjaHJvbWVUZXh0XSA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ2FwcE92ZXJ2aWV3Lm92ZXJ2aWV3LmFwcEluZm8uZW1iZWRkZWQuY2hyb21lUGx1Z2luJylcbiAgICBhY3QoKCkgPT4ge1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNocm9tZVRleHQpXG4gICAgfSlcblxuICAgIGV4cGVjdChtb2NrV2luZG93T3BlbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAnaHR0cHM6Ly9jaHJvbWUuZ29vZ2xlLmNvbS93ZWJzdG9yZS9kZXRhaWwvZGlmeS1jaGF0Ym90L2NlZWhkYXBvaGZmbWpta2RjaWZqb2ZhZGlhb2VnZ2FmJyxcbiAgICAgICdfYmxhbmsnLFxuICAgICAgJ25vb3BlbmVyLG5vcmVmZXJyZXInLFxuICAgIClcbiAgfSlcbn0pXG4iXX0=