"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.CompactList = exports.APIAccessControl = exports.NotificationPreferences = exports.FeatureToggles = exports.PrivacyControls = exports.SettingsPanel = exports.WithLabels = exports.SizeComparison = exports.DisabledOn = exports.DisabledOff = exports.DefaultOn = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/Switch',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Toggle switch component with multiple sizes (xs, sm, md, lg, l). Built on Headless UI Switch with smooth animations.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'l'],
            description: 'Switch size',
        },
        defaultValue: {
            control: 'boolean',
            description: 'Default checked state',
        },
        disabled: {
            control: 'boolean',
            description: 'Disabled state',
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const SwitchDemo = (args) => {
    const [enabled, setEnabled] = (0, react_1.useState)(args.defaultValue || false);
    return (<div style={{ width: '300px' }}>
      <div className="flex items-center gap-3">
        <_1.default {...args} defaultValue={enabled} onChange={(value) => {
            setEnabled(value);
            console.log('Switch toggled:', value);
        }}/>
        <span className="text-sm text-gray-700">
          {enabled ? 'On' : 'Off'}
        </span>
      </div>
    </div>);
};
// Default state (off)
exports.Default = {
    render: args => <SwitchDemo {...args}/>,
    args: {
        size: 'md',
        defaultValue: false,
        disabled: false,
    },
};
// Default on
exports.DefaultOn = {
    render: args => <SwitchDemo {...args}/>,
    args: {
        size: 'md',
        defaultValue: true,
        disabled: false,
    },
};
// Disabled off
exports.DisabledOff = {
    render: args => <SwitchDemo {...args}/>,
    args: {
        size: 'md',
        defaultValue: false,
        disabled: true,
    },
};
// Disabled on
exports.DisabledOn = {
    render: args => <SwitchDemo {...args}/>,
    args: {
        size: 'md',
        defaultValue: true,
        disabled: true,
    },
};
// Size variations
const SizeComparisonDemo = () => {
    const [states, setStates] = (0, react_1.useState)({
        xs: false,
        sm: false,
        md: true,
        lg: true,
        l: false,
    });
    return (<div style={{ width: '400px' }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <_1.default size="xs" defaultValue={states.xs} onChange={v => setStates({ ...states, xs: v })}/>
          <span className="text-sm text-gray-700">Extra Small (xs)</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <_1.default size="sm" defaultValue={states.sm} onChange={v => setStates({ ...states, sm: v })}/>
          <span className="text-sm text-gray-700">Small (sm)</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <_1.default size="md" defaultValue={states.md} onChange={v => setStates({ ...states, md: v })}/>
          <span className="text-sm text-gray-700">Medium (md)</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <_1.default size="l" defaultValue={states.l} onChange={v => setStates({ ...states, l: v })}/>
          <span className="text-sm text-gray-700">Large (l)</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <_1.default size="lg" defaultValue={states.lg} onChange={v => setStates({ ...states, lg: v })}/>
          <span className="text-sm text-gray-700">Extra Large (lg)</span>
        </div>
      </div>
    </div>);
};
exports.SizeComparison = {
    render: () => <SizeComparisonDemo />,
};
// With labels
const WithLabelsDemo = () => {
    const [enabled, setEnabled] = (0, react_1.useState)(true);
    return (<div style={{ width: '400px' }}>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <div className="text-sm font-medium text-gray-900">Email Notifications</div>
          <div className="text-xs text-gray-500">Receive email updates about your account</div>
        </div>
        <_1.default size="md" defaultValue={enabled} onChange={setEnabled}/>
      </div>
    </div>);
};
exports.WithLabels = {
    render: () => <WithLabelsDemo />,
};
// Real-world example - Settings panel
const SettingsPanelDemo = () => {
    const [settings, setSettings] = (0, react_1.useState)({
        notifications: true,
        autoSave: true,
        darkMode: false,
        analytics: false,
        emailUpdates: true,
    });
    const updateSetting = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Application Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Push Notifications</div>
            <div className="text-xs text-gray-500">Receive push notifications on your device</div>
          </div>
          <_1.default size="md" defaultValue={settings.notifications} onChange={v => updateSetting('notifications', v)}/>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Auto-Save</div>
            <div className="text-xs text-gray-500">Automatically save changes as you work</div>
          </div>
          <_1.default size="md" defaultValue={settings.autoSave} onChange={v => updateSetting('autoSave', v)}/>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Dark Mode</div>
            <div className="text-xs text-gray-500">Use dark theme for the interface</div>
          </div>
          <_1.default size="md" defaultValue={settings.darkMode} onChange={v => updateSetting('darkMode', v)}/>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Analytics</div>
            <div className="text-xs text-gray-500">Help us improve by sharing usage data</div>
          </div>
          <_1.default size="md" defaultValue={settings.analytics} onChange={v => updateSetting('analytics', v)}/>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Email Updates</div>
            <div className="text-xs text-gray-500">Receive product updates via email</div>
          </div>
          <_1.default size="md" defaultValue={settings.emailUpdates} onChange={v => updateSetting('emailUpdates', v)}/>
        </div>
      </div>
    </div>);
};
exports.SettingsPanel = {
    render: () => <SettingsPanelDemo />,
};
// Real-world example - Privacy controls
const PrivacyControlsDemo = () => {
    const [privacy, setPrivacy] = (0, react_1.useState)({
        profilePublic: false,
        showEmail: false,
        allowMessages: true,
        shareActivity: false,
    });
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold">Privacy Settings</h3>
      <p className="mb-4 text-sm text-gray-600">Control who can see your information</p>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Public Profile</div>
            <div className="text-xs text-gray-500">Make your profile visible to everyone</div>
          </div>
          <_1.default size="md" defaultValue={privacy.profilePublic} onChange={v => setPrivacy({ ...privacy, profilePublic: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Show Email Address</div>
            <div className="text-xs text-gray-500">Display your email on your profile</div>
          </div>
          <_1.default size="md" defaultValue={privacy.showEmail} onChange={v => setPrivacy({ ...privacy, showEmail: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Allow Direct Messages</div>
            <div className="text-xs text-gray-500">Let others send you private messages</div>
          </div>
          <_1.default size="md" defaultValue={privacy.allowMessages} onChange={v => setPrivacy({ ...privacy, allowMessages: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Share Activity</div>
            <div className="text-xs text-gray-500">Show your recent activity to connections</div>
          </div>
          <_1.default size="md" defaultValue={privacy.shareActivity} onChange={v => setPrivacy({ ...privacy, shareActivity: v })}/>
        </div>
      </div>
    </div>);
};
exports.PrivacyControls = {
    render: () => <PrivacyControlsDemo />,
};
// Real-world example - Feature toggles
const FeatureTogglesDemo = () => {
    const [features, setFeatures] = (0, react_1.useState)({
        betaFeatures: false,
        experimentalUI: false,
        advancedMode: true,
        developerTools: false,
    });
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Feature Flags</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧪</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Beta Features</div>
              <div className="text-xs text-gray-500">Access experimental functionality</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={features.betaFeatures} onChange={v => setFeatures({ ...features, betaFeatures: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎨</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Experimental UI</div>
              <div className="text-xs text-gray-500">Try the new interface design</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={features.experimentalUI} onChange={v => setFeatures({ ...features, experimentalUI: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Advanced Mode</div>
              <div className="text-xs text-gray-500">Show advanced configuration options</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={features.advancedMode} onChange={v => setFeatures({ ...features, advancedMode: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔧</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Developer Tools</div>
              <div className="text-xs text-gray-500">Enable debugging and inspection tools</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={features.developerTools} onChange={v => setFeatures({ ...features, developerTools: v })}/>
        </div>
      </div>
    </div>);
};
exports.FeatureToggles = {
    render: () => <FeatureTogglesDemo />,
};
// Real-world example - Notification preferences
const NotificationPreferencesDemo = () => {
    const [notifications, setNotifications] = (0, react_1.useState)({
        email: true,
        push: true,
        sms: false,
        desktop: true,
    });
    const allEnabled = Object.values(notifications).every(v => v);
    const someEnabled = Object.values(notifications).some(v => v);
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notification Channels</h3>
        <div className="text-xs text-gray-500">
          {allEnabled ? 'All enabled' : someEnabled ? 'Some enabled' : 'All disabled'}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Email</div>
              <div className="text-xs text-gray-500">Receive notifications via email</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={notifications.email} onChange={v => setNotifications({ ...notifications, email: v })}/>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Push Notifications</div>
              <div className="text-xs text-gray-500">Mobile and browser push notifications</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={notifications.push} onChange={v => setNotifications({ ...notifications, push: v })}/>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <div className="text-sm font-medium text-gray-900">SMS Messages</div>
              <div className="text-xs text-gray-500">Receive text message notifications</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={notifications.sms} onChange={v => setNotifications({ ...notifications, sms: v })}/>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💻</span>
            <div>
              <div className="text-sm font-medium text-gray-900">Desktop Alerts</div>
              <div className="text-xs text-gray-500">Show desktop notification popups</div>
            </div>
          </div>
          <_1.default size="md" defaultValue={notifications.desktop} onChange={v => setNotifications({ ...notifications, desktop: v })}/>
        </div>
      </div>
    </div>);
};
exports.NotificationPreferences = {
    render: () => <NotificationPreferencesDemo />,
};
// Real-world example - API access control
const APIAccessControlDemo = () => {
    const [access, setAccess] = (0, react_1.useState)({
        readAccess: true,
        writeAccess: true,
        deleteAccess: false,
        adminAccess: false,
    });
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold">API Permissions</h3>
      <p className="mb-4 text-sm text-gray-600">Configure access levels for API key</p>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-green-600">✓</span>
              {' '}
              Read Access
            </div>
            <div className="text-xs text-gray-500">View resources and data</div>
          </div>
          <_1.default size="md" defaultValue={access.readAccess} onChange={v => setAccess({ ...access, readAccess: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-blue-600">✎</span>
              {' '}
              Write Access
            </div>
            <div className="text-xs text-gray-500">Create and update resources</div>
          </div>
          <_1.default size="md" defaultValue={access.writeAccess} onChange={v => setAccess({ ...access, writeAccess: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-red-600">🗑</span>
              {' '}
              Delete Access
            </div>
            <div className="text-xs text-gray-500">Remove resources permanently</div>
          </div>
          <_1.default size="md" defaultValue={access.deleteAccess} onChange={v => setAccess({ ...access, deleteAccess: v })}/>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-purple-50 p-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <span className="text-purple-600">⚡</span>
              {' '}
              Admin Access
            </div>
            <div className="text-xs text-gray-500">Full administrative privileges</div>
          </div>
          <_1.default size="md" defaultValue={access.adminAccess} onChange={v => setAccess({ ...access, adminAccess: v })}/>
        </div>
      </div>
    </div>);
};
exports.APIAccessControl = {
    render: () => <APIAccessControlDemo />,
};
// Compact list with switches
const CompactListDemo = () => {
    const [items, setItems] = (0, react_1.useState)([
        { id: 1, name: 'Feature A', enabled: true },
        { id: 2, name: 'Feature B', enabled: false },
        { id: 3, name: 'Feature C', enabled: true },
        { id: 4, name: 'Feature D', enabled: false },
        { id: 5, name: 'Feature E', enabled: true },
    ]);
    const toggleItem = (id) => {
        setItems(items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
    };
    return (<div style={{ width: '400px' }} className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold">Quick Toggles</h3>
      <div className="space-y-2">
        {items.map(item => (<div key={item.id} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">{item.name}</span>
            <_1.default size="sm" defaultValue={item.enabled} onChange={() => toggleItem(item.id)}/>
          </div>))}
      </div>
    </div>);
};
exports.CompactList = {
    render: () => <CompactListDemo />,
};
// Interactive playground
exports.Playground = {
    render: args => <SwitchDemo {...args}/>,
    args: {
        size: 'md',
        defaultValue: false,
        disabled: false,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBc0I7QUFFdEIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsd0JBQXdCO0lBQy9CLFNBQVMsRUFBRSxVQUFNO0lBQ2pCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsc0hBQXNIO2FBQ2xJO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO1lBQ3RDLFdBQVcsRUFBRSxhQUFhO1NBQzNCO1FBQ0QsWUFBWSxFQUFFO1lBQ1osT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLHVCQUF1QjtTQUNyQztRQUNELFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxnQkFBZ0I7U0FDOUI7S0FDRjtDQUM0QixDQUFBO0FBRS9CLGtCQUFlLElBQUksQ0FBQTtBQUduQiwyQkFBMkI7QUFDM0IsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtJQUMvQixNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQyxDQUFBO0lBRWxFLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUM3QjtNQUFBLENBQUMsR0FBRyxDQUFD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QyxPQUFPLENBQUMsQ0FDM0IsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUV4QztVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNKO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFdBQVcsR0FBVTtJQUNoQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQUFBRCxFQUFHO0NBQ2xDLENBQUE7QUFFRCx5QkFBeUI7QUFDWixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3hDLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxJQUFJO1FBQ1YsWUFBWSxFQUFFLEtBQUs7UUFDbkIsUUFBUSxFQUFFLEtBQUs7S0FDaEI7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBTd2l0Y2ggZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRW50cnkvU3dpdGNoJyxcbiAgY29tcG9uZW50OiBTd2l0Y2gsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnVG9nZ2xlIHN3aXRjaCBjb21wb25lbnQgd2l0aCBtdWx0aXBsZSBzaXplcyAoeHMsIHNtLCBtZCwgbGcsIGwpLiBCdWlsdCBvbiBIZWFkbGVzcyBVSSBTd2l0Y2ggd2l0aCBzbW9vdGggYW5pbWF0aW9ucy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ1R5cGVzOiB7XG4gICAgc2l6ZToge1xuICAgICAgY29udHJvbDogJ3NlbGVjdCcsXG4gICAgICBvcHRpb25zOiBbJ3hzJywgJ3NtJywgJ21kJywgJ2xnJywgJ2wnXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU3dpdGNoIHNpemUnLFxuICAgIH0sXG4gICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmF1bHQgY2hlY2tlZCBzdGF0ZScsXG4gICAgfSxcbiAgICBkaXNhYmxlZDoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlZCBzdGF0ZScsXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFN3aXRjaD5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG4vLyBJbnRlcmFjdGl2ZSBkZW1vIHdyYXBwZXJcbmNvbnN0IFN3aXRjaERlbW8gPSAoYXJnczogYW55KSA9PiB7XG4gIGNvbnN0IFtlbmFibGVkLCBzZXRFbmFibGVkXSA9IHVzZVN0YXRlKGFyZ3MuZGVmYXVsdFZhbHVlIHx8IGZhbHNlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzMwMHB4JyB9fT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIHsuLi5hcmdzfVxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZW5hYmxlZH1cbiAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBzZXRFbmFibGVkKHZhbHVlKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1N3aXRjaCB0b2dnbGVkOicsIHZhbHVlKVxuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgIHtlbmFibGVkID8gJ09uJyA6ICdPZmYnfVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBEZWZhdWx0IHN0YXRlIChvZmYpXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8U3dpdGNoRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICBzaXplOiAnbWQnLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2UsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBEZWZhdWx0IG9uXG5leHBvcnQgY29uc3QgRGVmYXVsdE9uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTd2l0Y2hEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHNpemU6ICdtZCcsXG4gICAgZGVmYXVsdFZhbHVlOiB0cnVlLFxuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gRGlzYWJsZWQgb2ZmXG5leHBvcnQgY29uc3QgRGlzYWJsZWRPZmY6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFN3aXRjaERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgc2l6ZTogJ21kJyxcbiAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxuICAgIGRpc2FibGVkOiB0cnVlLFxuICB9LFxufVxuXG4vLyBEaXNhYmxlZCBvblxuZXhwb3J0IGNvbnN0IERpc2FibGVkT246IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFN3aXRjaERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgc2l6ZTogJ21kJyxcbiAgICBkZWZhdWx0VmFsdWU6IHRydWUsXG4gICAgZGlzYWJsZWQ6IHRydWUsXG4gIH0sXG59XG5cbi8vIFNpemUgdmFyaWF0aW9uc1xuY29uc3QgU2l6ZUNvbXBhcmlzb25EZW1vID0gKCkgPT4ge1xuICBjb25zdCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gdXNlU3RhdGUoe1xuICAgIHhzOiBmYWxzZSxcbiAgICBzbTogZmFsc2UsXG4gICAgbWQ6IHRydWUsXG4gICAgbGc6IHRydWUsXG4gICAgbDogZmFsc2UsXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNDAwcHgnIH19IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgIDxTd2l0Y2ggc2l6ZT1cInhzXCIgZGVmYXVsdFZhbHVlPXtzdGF0ZXMueHN9IG9uQ2hhbmdlPXt2ID0+IHNldFN0YXRlcyh7IC4uLnN0YXRlcywgeHM6IHYgfSl9IC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNzAwXCI+RXh0cmEgU21hbGwgKHhzKTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICA8U3dpdGNoIHNpemU9XCJzbVwiIGRlZmF1bHRWYWx1ZT17c3RhdGVzLnNtfSBvbkNoYW5nZT17diA9PiBzZXRTdGF0ZXMoeyAuLi5zdGF0ZXMsIHNtOiB2IH0pfSAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTcwMFwiPlNtYWxsIChzbSk8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgPFN3aXRjaCBzaXplPVwibWRcIiBkZWZhdWx0VmFsdWU9e3N0YXRlcy5tZH0gb25DaGFuZ2U9e3YgPT4gc2V0U3RhdGVzKHsgLi4uc3RhdGVzLCBtZDogdiB9KX0gLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS03MDBcIj5NZWRpdW0gKG1kKTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICA8U3dpdGNoIHNpemU9XCJsXCIgZGVmYXVsdFZhbHVlPXtzdGF0ZXMubH0gb25DaGFuZ2U9e3YgPT4gc2V0U3RhdGVzKHsgLi4uc3RhdGVzLCBsOiB2IH0pfSAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTcwMFwiPkxhcmdlIChsKTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICA8U3dpdGNoIHNpemU9XCJsZ1wiIGRlZmF1bHRWYWx1ZT17c3RhdGVzLmxnfSBvbkNoYW5nZT17diA9PiBzZXRTdGF0ZXMoeyAuLi5zdGF0ZXMsIGxnOiB2IH0pfSAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTcwMFwiPkV4dHJhIExhcmdlIChsZyk8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFNpemVDb21wYXJpc29uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8U2l6ZUNvbXBhcmlzb25EZW1vIC8+LFxufVxuXG4vLyBXaXRoIGxhYmVsc1xuY29uc3QgV2l0aExhYmVsc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtlbmFibGVkLCBzZXRFbmFibGVkXSA9IHVzZVN0YXRlKHRydWUpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNDAwcHgnIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNFwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+RW1haWwgTm90aWZpY2F0aW9uczwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+UmVjZWl2ZSBlbWFpbCB1cGRhdGVzIGFib3V0IHlvdXIgYWNjb3VudDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXtlbmFibGVkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtzZXRFbmFibGVkfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFdpdGhMYWJlbHM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxXaXRoTGFiZWxzRGVtbyAvPixcbn1cblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gU2V0dGluZ3MgcGFuZWxcbmNvbnN0IFNldHRpbmdzUGFuZWxEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbc2V0dGluZ3MsIHNldFNldHRpbmdzXSA9IHVzZVN0YXRlKHtcbiAgICBub3RpZmljYXRpb25zOiB0cnVlLFxuICAgIGF1dG9TYXZlOiB0cnVlLFxuICAgIGRhcmtNb2RlOiBmYWxzZSxcbiAgICBhbmFseXRpY3M6IGZhbHNlLFxuICAgIGVtYWlsVXBkYXRlczogdHJ1ZSxcbiAgfSlcblxuICBjb25zdCB1cGRhdGVTZXR0aW5nID0gKGtleTogc3RyaW5nLCB2YWx1ZTogYm9vbGVhbikgPT4ge1xuICAgIHNldFNldHRpbmdzKHsgLi4uc2V0dGluZ3MsIFtrZXldOiB2YWx1ZSB9KVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkFwcGxpY2F0aW9uIFNldHRpbmdzPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+UHVzaCBOb3RpZmljYXRpb25zPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlJlY2VpdmUgcHVzaCBub3RpZmljYXRpb25zIG9uIHlvdXIgZGV2aWNlPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17c2V0dGluZ3Mubm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHVwZGF0ZVNldHRpbmcoJ25vdGlmaWNhdGlvbnMnLCB2KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkF1dG8tU2F2ZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5BdXRvbWF0aWNhbGx5IHNhdmUgY2hhbmdlcyBhcyB5b3Ugd29yazwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3NldHRpbmdzLmF1dG9TYXZlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gdXBkYXRlU2V0dGluZygnYXV0b1NhdmUnLCB2KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkRhcmsgTW9kZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5Vc2UgZGFyayB0aGVtZSBmb3IgdGhlIGludGVyZmFjZTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3NldHRpbmdzLmRhcmtNb2RlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gdXBkYXRlU2V0dGluZygnZGFya01vZGUnLCB2KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkFuYWx5dGljczwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5IZWxwIHVzIGltcHJvdmUgYnkgc2hhcmluZyB1c2FnZSBkYXRhPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17c2V0dGluZ3MuYW5hbHl0aWNzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gdXBkYXRlU2V0dGluZygnYW5hbHl0aWNzJywgdil9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5FbWFpbCBVcGRhdGVzPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlJlY2VpdmUgcHJvZHVjdCB1cGRhdGVzIHZpYSBlbWFpbDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e3NldHRpbmdzLmVtYWlsVXBkYXRlc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHVwZGF0ZVNldHRpbmcoJ2VtYWlsVXBkYXRlcycsIHYpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFNldHRpbmdzUGFuZWw6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxTZXR0aW5nc1BhbmVsRGVtbyAvPixcbn1cblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gUHJpdmFjeSBjb250cm9sc1xuY29uc3QgUHJpdmFjeUNvbnRyb2xzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3ByaXZhY3ksIHNldFByaXZhY3ldID0gdXNlU3RhdGUoe1xuICAgIHByb2ZpbGVQdWJsaWM6IGZhbHNlLFxuICAgIHNob3dFbWFpbDogZmFsc2UsXG4gICAgYWxsb3dNZXNzYWdlczogdHJ1ZSxcbiAgICBzaGFyZUFjdGl2aXR5OiBmYWxzZSxcbiAgfSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc1MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+UHJpdmFjeSBTZXR0aW5nczwvaDM+XG4gICAgICA8cCBjbGFzc05hbWU9XCJtYi00IHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPkNvbnRyb2wgd2hvIGNhbiBzZWUgeW91ciBpbmZvcm1hdGlvbjwvcD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5QdWJsaWMgUHJvZmlsZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5NYWtlIHlvdXIgcHJvZmlsZSB2aXNpYmxlIHRvIGV2ZXJ5b25lPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17cHJpdmFjeS5wcm9maWxlUHVibGljfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gc2V0UHJpdmFjeSh7IC4uLnByaXZhY3ksIHByb2ZpbGVQdWJsaWM6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPlNob3cgRW1haWwgQWRkcmVzczwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5EaXNwbGF5IHlvdXIgZW1haWwgb24geW91ciBwcm9maWxlPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17cHJpdmFjeS5zaG93RW1haWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17diA9PiBzZXRQcml2YWN5KHsgLi4ucHJpdmFjeSwgc2hvd0VtYWlsOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5BbGxvdyBEaXJlY3QgTWVzc2FnZXM8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+TGV0IG90aGVycyBzZW5kIHlvdSBwcml2YXRlIG1lc3NhZ2VzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17cHJpdmFjeS5hbGxvd01lc3NhZ2VzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gc2V0UHJpdmFjeSh7IC4uLnByaXZhY3ksIGFsbG93TWVzc2FnZXM6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPlNoYXJlIEFjdGl2aXR5PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlNob3cgeW91ciByZWNlbnQgYWN0aXZpdHkgdG8gY29ubmVjdGlvbnM8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtwcml2YWN5LnNoYXJlQWN0aXZpdHl9XG4gICAgICAgICAgICBvbkNoYW5nZT17diA9PiBzZXRQcml2YWN5KHsgLi4ucHJpdmFjeSwgc2hhcmVBY3Rpdml0eTogdiB9KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQcml2YWN5Q29udHJvbHM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxQcml2YWN5Q29udHJvbHNEZW1vIC8+LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBGZWF0dXJlIHRvZ2dsZXNcbmNvbnN0IEZlYXR1cmVUb2dnbGVzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW2ZlYXR1cmVzLCBzZXRGZWF0dXJlc10gPSB1c2VTdGF0ZSh7XG4gICAgYmV0YUZlYXR1cmVzOiBmYWxzZSxcbiAgICBleHBlcmltZW50YWxVSTogZmFsc2UsXG4gICAgYWR2YW5jZWRNb2RlOiB0cnVlLFxuICAgIGRldmVsb3BlclRvb2xzOiBmYWxzZSxcbiAgfSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc1MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+RmVhdHVyZSBGbGFnczwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgcC0zIGhvdmVyOmJnLWdyYXktNTBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhsXCI+8J+nqjwvc3Bhbj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+QmV0YSBGZWF0dXJlczwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkFjY2VzcyBleHBlcmltZW50YWwgZnVuY3Rpb25hbGl0eTwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZmVhdHVyZXMuYmV0YUZlYXR1cmVzfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gc2V0RmVhdHVyZXMoeyAuLi5mZWF0dXJlcywgYmV0YUZlYXR1cmVzOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBwLTMgaG92ZXI6YmctZ3JheS01MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteGxcIj7wn46oPC9zcGFuPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5FeHBlcmltZW50YWwgVUk8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5UcnkgdGhlIG5ldyBpbnRlcmZhY2UgZGVzaWduPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtmZWF0dXJlcy5leHBlcmltZW50YWxVSX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEZlYXR1cmVzKHsgLi4uZmVhdHVyZXMsIGV4cGVyaW1lbnRhbFVJOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBwLTMgaG92ZXI6YmctZ3JheS01MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteGxcIj7imqE8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkFkdmFuY2VkIE1vZGU8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5TaG93IGFkdmFuY2VkIGNvbmZpZ3VyYXRpb24gb3B0aW9uczwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZmVhdHVyZXMuYWR2YW5jZWRNb2RlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3YgPT4gc2V0RmVhdHVyZXMoeyAuLi5mZWF0dXJlcywgYWR2YW5jZWRNb2RlOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBwLTMgaG92ZXI6YmctZ3JheS01MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteGxcIj7wn5SnPC9zcGFuPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5EZXZlbG9wZXIgVG9vbHM8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5FbmFibGUgZGVidWdnaW5nIGFuZCBpbnNwZWN0aW9uIHRvb2xzPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtmZWF0dXJlcy5kZXZlbG9wZXJUb29sc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEZlYXR1cmVzKHsgLi4uZmVhdHVyZXMsIGRldmVsb3BlclRvb2xzOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IEZlYXR1cmVUb2dnbGVzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8RmVhdHVyZVRvZ2dsZXNEZW1vIC8+LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBOb3RpZmljYXRpb24gcHJlZmVyZW5jZXNcbmNvbnN0IE5vdGlmaWNhdGlvblByZWZlcmVuY2VzRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW25vdGlmaWNhdGlvbnMsIHNldE5vdGlmaWNhdGlvbnNdID0gdXNlU3RhdGUoe1xuICAgIGVtYWlsOiB0cnVlLFxuICAgIHB1c2g6IHRydWUsXG4gICAgc21zOiBmYWxzZSxcbiAgICBkZXNrdG9wOiB0cnVlLFxuICB9KVxuXG4gIGNvbnN0IGFsbEVuYWJsZWQgPSBPYmplY3QudmFsdWVzKG5vdGlmaWNhdGlvbnMpLmV2ZXJ5KHYgPT4gdilcbiAgY29uc3Qgc29tZUVuYWJsZWQgPSBPYmplY3QudmFsdWVzKG5vdGlmaWNhdGlvbnMpLnNvbWUodiA9PiB2KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzUwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5Ob3RpZmljYXRpb24gQ2hhbm5lbHM8L2gzPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgIHthbGxFbmFibGVkID8gJ0FsbCBlbmFibGVkJyA6IHNvbWVFbmFibGVkID8gJ1NvbWUgZW5hYmxlZCcgOiAnQWxsIGRpc2FibGVkJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC0yeGxcIj7wn5OnPC9zcGFuPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5FbWFpbDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlJlY2VpdmUgbm90aWZpY2F0aW9ucyB2aWEgZW1haWw8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e25vdGlmaWNhdGlvbnMuZW1haWx9XG4gICAgICAgICAgICBvbkNoYW5nZT17diA9PiBzZXROb3RpZmljYXRpb25zKHsgLi4ubm90aWZpY2F0aW9ucywgZW1haWw6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bFwiPvCflJQ8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPlB1c2ggTm90aWZpY2F0aW9uczwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPk1vYmlsZSBhbmQgYnJvd3NlciBwdXNoIG5vdGlmaWNhdGlvbnM8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e25vdGlmaWNhdGlvbnMucHVzaH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldE5vdGlmaWNhdGlvbnMoeyAuLi5ub3RpZmljYXRpb25zLCBwdXNoOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC0yeGxcIj7wn5KsPC9zcGFuPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5TTVMgTWVzc2FnZXM8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5SZWNlaXZlIHRleHQgbWVzc2FnZSBub3RpZmljYXRpb25zPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtub3RpZmljYXRpb25zLnNtc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldE5vdGlmaWNhdGlvbnMoeyAuLi5ub3RpZmljYXRpb25zLCBzbXM6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bFwiPvCfkrs8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPkRlc2t0b3AgQWxlcnRzPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+U2hvdyBkZXNrdG9wIG5vdGlmaWNhdGlvbiBwb3B1cHM8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e25vdGlmaWNhdGlvbnMuZGVza3RvcH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldE5vdGlmaWNhdGlvbnMoeyAuLi5ub3RpZmljYXRpb25zLCBkZXNrdG9wOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IE5vdGlmaWNhdGlvblByZWZlcmVuY2VzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8Tm90aWZpY2F0aW9uUHJlZmVyZW5jZXNEZW1vIC8+LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBBUEkgYWNjZXNzIGNvbnRyb2xcbmNvbnN0IEFQSUFjY2Vzc0NvbnRyb2xEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbYWNjZXNzLCBzZXRBY2Nlc3NdID0gdXNlU3RhdGUoe1xuICAgIHJlYWRBY2Nlc3M6IHRydWUsXG4gICAgd3JpdGVBY2Nlc3M6IHRydWUsXG4gICAgZGVsZXRlQWNjZXNzOiBmYWxzZSxcbiAgICBhZG1pbkFjY2VzczogZmFsc2UsXG4gIH0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi0yIHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkFQSSBQZXJtaXNzaW9uczwvaDM+XG4gICAgICA8cCBjbGFzc05hbWU9XCJtYi00IHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPkNvbmZpZ3VyZSBhY2Nlc3MgbGV2ZWxzIGZvciBBUEkga2V5PC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBiZy1ncmVlbi01MCBwLTNcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS05MDBcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1ncmVlbi02MDBcIj7inJM8L3NwYW4+XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIFJlYWQgQWNjZXNzXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+VmlldyByZXNvdXJjZXMgYW5kIGRhdGE8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXthY2Nlc3MucmVhZEFjY2Vzc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEFjY2Vzcyh7IC4uLmFjY2VzcywgcmVhZEFjY2VzczogdiB9KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiByb3VuZGVkLWxnIGJnLWJsdWUtNTAgcC0zXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtYmx1ZS02MDBcIj7inI48L3NwYW4+XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIFdyaXRlIEFjY2Vzc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkNyZWF0ZSBhbmQgdXBkYXRlIHJlc291cmNlczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2FjY2Vzcy53cml0ZUFjY2Vzc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEFjY2Vzcyh7IC4uLmFjY2Vzcywgd3JpdGVBY2Nlc3M6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBiZy1yZWQtNTAgcC0zXCI+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktOTAwXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmVkLTYwMFwiPvCfl5E8L3NwYW4+XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIERlbGV0ZSBBY2Nlc3NcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5SZW1vdmUgcmVzb3VyY2VzIHBlcm1hbmVudGx5PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPFN3aXRjaFxuICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17YWNjZXNzLmRlbGV0ZUFjY2Vzc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEFjY2Vzcyh7IC4uLmFjY2VzcywgZGVsZXRlQWNjZXNzOiB2IH0pfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbGcgYmctcHVycGxlLTUwIHAtM1wiPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTkwMFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXB1cnBsZS02MDBcIj7imqE8L3NwYW4+XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIEFkbWluIEFjY2Vzc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkZ1bGwgYWRtaW5pc3RyYXRpdmUgcHJpdmlsZWdlczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWU9e2FjY2Vzcy5hZG1pbkFjY2Vzc31cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt2ID0+IHNldEFjY2Vzcyh7IC4uLmFjY2VzcywgYWRtaW5BY2Nlc3M6IHYgfSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgQVBJQWNjZXNzQ29udHJvbDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEFQSUFjY2Vzc0NvbnRyb2xEZW1vIC8+LFxufVxuXG4vLyBDb21wYWN0IGxpc3Qgd2l0aCBzd2l0Y2hlc1xuY29uc3QgQ29tcGFjdExpc3REZW1vID0gKCkgPT4ge1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlKFtcbiAgICB7IGlkOiAxLCBuYW1lOiAnRmVhdHVyZSBBJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgIHsgaWQ6IDIsIG5hbWU6ICdGZWF0dXJlIEInLCBlbmFibGVkOiBmYWxzZSB9LFxuICAgIHsgaWQ6IDMsIG5hbWU6ICdGZWF0dXJlIEMnLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgeyBpZDogNCwgbmFtZTogJ0ZlYXR1cmUgRCcsIGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgeyBpZDogNSwgbmFtZTogJ0ZlYXR1cmUgRScsIGVuYWJsZWQ6IHRydWUgfSxcbiAgXSlcblxuICBjb25zdCB0b2dnbGVJdGVtID0gKGlkOiBudW1iZXIpID0+IHtcbiAgICBzZXRJdGVtcyhpdGVtcy5tYXAoaXRlbSA9PlxuICAgICAgaXRlbS5pZCA9PT0gaWQgPyB7IC4uLml0ZW0sIGVuYWJsZWQ6ICFpdGVtLmVuYWJsZWQgfSA6IGl0ZW0sXG4gICAgKSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC00XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItMyB0ZXh0LXNtIGZvbnQtc2VtaWJvbGRcIj5RdWljayBUb2dnbGVzPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgIHtpdGVtcy5tYXAoaXRlbSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2l0ZW0uaWR9IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBweS0yXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS03MDBcIj57aXRlbS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXtpdGVtLmVuYWJsZWR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoKSA9PiB0b2dnbGVJdGVtKGl0ZW0uaWQpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgQ29tcGFjdExpc3Q6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxDb21wYWN0TGlzdERlbW8gLz4sXG59XG5cbi8vIEludGVyYWN0aXZlIHBsYXlncm91bmRcbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTd2l0Y2hEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHNpemU6ICdtZCcsXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZSxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG59XG4iXX0=