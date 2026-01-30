"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.APIAuthMethod = exports.StorageOptions = exports.DeploymentStrategy = exports.CloudProviderSelection = exports.MultipleCards = exports.WithConfiguration = exports.NoRadio = exports.Selected = exports.Default = void 0;
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/RadioCard',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Radio card component for selecting options with rich content. Features icon, title, description, and optional configuration panel when selected.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        icon: {
            description: 'Icon element to display',
        },
        iconBgClassName: {
            control: 'text',
            description: 'Background color class for icon container',
        },
        title: {
            control: 'text',
            description: 'Card title',
        },
        description: {
            control: 'text',
            description: 'Card description',
        },
        isChosen: {
            control: 'boolean',
            description: 'Whether the card is selected',
        },
        noRadio: {
            control: 'boolean',
            description: 'Hide the radio button indicator',
        },
    },
};
exports.default = meta;
// Single card demo
const RadioCardDemo = (args) => {
    const [isChosen, setIsChosen] = (0, react_2.useState)(args.isChosen || false);
    return (<div style={{ width: '400px' }}>
      <_1.default {...args} isChosen={isChosen} onChosen={() => setIsChosen(!isChosen)}/>
    </div>);
};
// Default state
exports.Default = {
    render: args => <RadioCardDemo {...args}/>,
    args: {
        icon: <react_1.RiRocketLine className="h-5 w-5 text-purple-600"/>,
        iconBgClassName: 'bg-purple-100',
        title: 'Quick Start',
        description: 'Get started quickly with default settings',
        isChosen: false,
        noRadio: false,
    },
};
// Selected state
exports.Selected = {
    render: args => <RadioCardDemo {...args}/>,
    args: {
        icon: <react_1.RiRocketLine className="h-5 w-5 text-purple-600"/>,
        iconBgClassName: 'bg-purple-100',
        title: 'Quick Start',
        description: 'Get started quickly with default settings',
        isChosen: true,
        noRadio: false,
    },
};
// Without radio indicator
exports.NoRadio = {
    render: args => <RadioCardDemo {...args}/>,
    args: {
        icon: <react_1.RiRocketLine className="h-5 w-5 text-purple-600"/>,
        iconBgClassName: 'bg-purple-100',
        title: 'Information Card',
        description: 'Card without radio indicator',
        noRadio: true,
    },
};
// With configuration panel
const WithConfigurationDemo = () => {
    const [isChosen, setIsChosen] = (0, react_2.useState)(true);
    return (<div style={{ width: '400px' }}>
      <_1.default icon={<react_1.RiDatabase2Line className="h-5 w-5 text-blue-600"/>} iconBgClassName="bg-blue-100" title="Database Storage" description="Store data in a managed database" isChosen={isChosen} onChosen={() => setIsChosen(!isChosen)} chosenConfig={(<div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Region:</label>
              <select className="rounded border border-gray-300 px-2 py-1 text-xs">
                <option>US East</option>
                <option>EU West</option>
                <option>Asia Pacific</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">Size:</label>
              <select className="rounded border border-gray-300 px-2 py-1 text-xs">
                <option>Small (10GB)</option>
                <option>Medium (50GB)</option>
                <option>Large (100GB)</option>
              </select>
            </div>
          </div>)}/>
    </div>);
};
exports.WithConfiguration = {
    render: () => <WithConfigurationDemo />,
    parameters: { controls: { disable: true } },
};
// Multiple cards selection
const MultipleCardsDemo = () => {
    const [selected, setSelected] = (0, react_2.useState)('standard');
    const options = [
        {
            value: 'standard',
            icon: <react_1.RiRocketLine className="h-5 w-5 text-purple-600"/>,
            iconBg: 'bg-purple-100',
            title: 'Standard',
            description: 'Perfect for most use cases',
        },
        {
            value: 'advanced',
            icon: <react_1.RiCpuLine className="h-5 w-5 text-blue-600"/>,
            iconBg: 'bg-blue-100',
            title: 'Advanced',
            description: 'More features and customization',
        },
        {
            value: 'enterprise',
            icon: <react_1.RiShieldLine className="h-5 w-5 text-green-600"/>,
            iconBg: 'bg-green-100',
            title: 'Enterprise',
            description: 'Full features with premium support',
        },
    ];
    return (<div style={{ width: '450px' }} className="space-y-3">
      {options.map(option => (<_1.default key={option.value} icon={option.icon} iconBgClassName={option.iconBg} title={option.title} description={option.description} isChosen={selected === option.value} onChosen={() => setSelected(option.value)}/>))}
      <div className="mt-4 text-sm text-gray-600">
        Selected:
        {' '}
        <span className="font-semibold">{selected}</span>
      </div>
    </div>);
};
exports.MultipleCards = {
    render: () => <MultipleCardsDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Cloud provider selection
const CloudProviderSelectionDemo = () => {
    const [provider, setProvider] = (0, react_2.useState)('aws');
    const [region, setRegion] = (0, react_2.useState)('us-east-1');
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Select Cloud Provider</h3>
      <div className="space-y-3">
        <_1.default icon={<react_1.RiCloudLine className="h-5 w-5 text-orange-600"/>} iconBgClassName="bg-orange-100" title="Amazon Web Services" description="Industry-leading cloud infrastructure" isChosen={provider === 'aws'} onChosen={() => setProvider('aws')} chosenConfig={(<div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Region</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={region} onChange={e => setRegion(e.target.value)}>
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>)}/>
        <_1.default icon={<react_1.RiCloudLine className="h-5 w-5 text-blue-600"/>} iconBgClassName="bg-blue-100" title="Microsoft Azure" description="Enterprise-grade cloud platform" isChosen={provider === 'azure'} onChosen={() => setProvider('azure')}/>
        <_1.default icon={<react_1.RiCloudLine className="h-5 w-5 text-red-600"/>} iconBgClassName="bg-red-100" title="Google Cloud Platform" description="Scalable and reliable infrastructure" isChosen={provider === 'gcp'} onChosen={() => setProvider('gcp')}/>
      </div>
    </div>);
};
exports.CloudProviderSelection = {
    render: () => <CloudProviderSelectionDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Deployment strategy
const DeploymentStrategyDemo = () => {
    const [strategy, setStrategy] = (0, react_2.useState)('rolling');
    return (<div style={{ width: '550px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 text-lg font-semibold">Deployment Strategy</h3>
      <p className="mb-4 text-sm text-gray-600">Choose how you want to deploy your application</p>
      <div className="space-y-3">
        <_1.default icon={<react_1.RiRocketLine className="h-5 w-5 text-green-600"/>} iconBgClassName="bg-green-100" title="Rolling Deployment" description="Gradually replace instances with zero downtime" isChosen={strategy === 'rolling'} onChosen={() => setStrategy('rolling')} chosenConfig={(<div className="rounded-lg bg-green-50 p-3 text-xs text-gray-700">
              ✓ Recommended for production environments
              <br />
              ✓ Minimal risk with automatic rollback
              <br />
              ✓ Takes 5-10 minutes
            </div>)}/>
        <_1.default icon={<react_1.RiCpuLine className="h-5 w-5 text-blue-600"/>} iconBgClassName="bg-blue-100" title="Blue-Green Deployment" description="Switch between two identical environments" isChosen={strategy === 'blue-green'} onChosen={() => setStrategy('blue-green')} chosenConfig={(<div className="rounded-lg bg-blue-50 p-3 text-xs text-gray-700">
              ✓ Instant rollback capability
              <br />
              ✓ Requires double the resources
              <br />
              ✓ Takes 2-5 minutes
            </div>)}/>
        <_1.default icon={<react_1.RiLightbulbLine className="h-5 w-5 text-yellow-600"/>} iconBgClassName="bg-yellow-100" title="Canary Deployment" description="Test with a small subset of users first" isChosen={strategy === 'canary'} onChosen={() => setStrategy('canary')} chosenConfig={(<div className="rounded-lg bg-yellow-50 p-3 text-xs text-gray-700">
              ✓ Test changes with real traffic
              <br />
              ✓ Gradual rollout reduces risk
              <br />
              ✓ Takes 15-30 minutes
            </div>)}/>
      </div>
      <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Deploy with
        {' '}
        {strategy}
        {' '}
        strategy
      </button>
    </div>);
};
exports.DeploymentStrategy = {
    render: () => <DeploymentStrategyDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Storage options
const StorageOptionsDemo = () => {
    const [storage, setStorage] = (0, react_2.useState)('ssd');
    const storageOptions = [
        {
            value: 'ssd',
            icon: <react_1.RiDatabase2Line className="h-5 w-5 text-purple-600"/>,
            iconBg: 'bg-purple-100',
            title: 'SSD Storage',
            description: 'Fast and reliable solid state drives',
            price: '$0.10/GB/month',
            speed: 'Up to 3000 IOPS',
        },
        {
            value: 'hdd',
            icon: <react_1.RiDatabase2Line className="h-5 w-5 text-gray-600"/>,
            iconBg: 'bg-gray-100',
            title: 'HDD Storage',
            description: 'Cost-effective magnetic disk storage',
            price: '$0.05/GB/month',
            speed: 'Up to 500 IOPS',
        },
        {
            value: 'nvme',
            icon: <react_1.RiDatabase2Line className="h-5 w-5 text-red-600"/>,
            iconBg: 'bg-red-100',
            title: 'NVMe Storage',
            description: 'Ultra-fast PCIe-based storage',
            price: '$0.20/GB/month',
            speed: 'Up to 10000 IOPS',
        },
    ];
    const selectedOption = storageOptions.find(opt => opt.value === storage);
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Storage Type</h3>
      <div className="space-y-3">
        {storageOptions.map(option => (<_1.default key={option.value} icon={option.icon} iconBgClassName={option.iconBg} title={(<div className="flex items-center justify-between">
                <span>{option.title}</span>
                <span className="text-xs font-normal text-gray-500">{option.price}</span>
              </div>)} description={`${option.description} - ${option.speed}`} isChosen={storage === option.value} onChosen={() => setStorage(option.value)}/>))}
      </div>
      {selectedOption && (<div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-700">
            <strong>Selected:</strong>
            {' '}
            {selectedOption.title}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {selectedOption.price}
            {' '}
            •
            {selectedOption.speed}
          </div>
        </div>)}
    </div>);
};
exports.StorageOptions = {
    render: () => <StorageOptionsDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - API authentication method
const APIAuthMethodDemo = () => {
    const [authMethod, setAuthMethod] = (0, react_2.useState)('api_key');
    const [apiKey, setApiKey] = (0, react_2.useState)('');
    return (<div style={{ width: '550px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">API Authentication</h3>
      <div className="space-y-3">
        <_1.default icon={<react_1.RiShieldLine className="h-5 w-5 text-blue-600"/>} iconBgClassName="bg-blue-100" title="API Key" description="Simple authentication using a secret key" isChosen={authMethod === 'api_key'} onChosen={() => setAuthMethod('api_key')} chosenConfig={(<div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Your API Key</label>
              <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)}/>
              <p className="text-xs text-gray-500">Keep your API key secure and never share it publicly</p>
            </div>)}/>
        <_1.default icon={<react_1.RiShieldLine className="h-5 w-5 text-green-600"/>} iconBgClassName="bg-green-100" title="OAuth 2.0" description="Industry-standard authorization protocol" isChosen={authMethod === 'oauth'} onChosen={() => setAuthMethod('oauth')} chosenConfig={(<div className="rounded-lg bg-green-50 p-3">
              <p className="mb-2 text-xs text-gray-700">
                Configure OAuth 2.0 authentication for secure access
              </p>
              <button className="text-xs font-medium text-green-600 hover:underline">
                Configure OAuth Settings →
              </button>
            </div>)}/>
        <_1.default icon={<react_1.RiShieldLine className="h-5 w-5 text-purple-600"/>} iconBgClassName="bg-purple-100" title="JWT Token" description="JSON Web Token based authentication" isChosen={authMethod === 'jwt'} onChosen={() => setAuthMethod('jwt')} chosenConfig={(<div className="rounded-lg bg-purple-50 p-3 text-xs text-gray-700">
              JWT tokens provide stateless authentication with expiration and refresh capabilities
            </div>)}/>
      </div>
    </div>);
};
exports.APIAuthMethod = {
    render: () => <APIAuthMethodDemo />,
    parameters: { controls: { disable: true } },
};
// Interactive playground
const PlaygroundDemo = () => {
    const [selected, setSelected] = (0, react_2.useState)('option1');
    return (<div style={{ width: '450px' }} className="space-y-3">
      <_1.default icon={<react_1.RiRocketLine className="h-5 w-5 text-purple-600"/>} iconBgClassName="bg-purple-100" title="Option 1" description="First option with icon and description" isChosen={selected === 'option1'} onChosen={() => setSelected('option1')}/>
      <_1.default icon={<react_1.RiDatabase2Line className="h-5 w-5 text-blue-600"/>} iconBgClassName="bg-blue-100" title="Option 2" description="Second option with different styling" isChosen={selected === 'option2'} onChosen={() => setSelected('option2')} chosenConfig={(<div className="rounded bg-blue-50 p-2 text-xs text-gray-600">
            Additional configuration appears when selected
          </div>)}/>
      <_1.default icon={<react_1.RiCloudLine className="h-5 w-5 text-green-600"/>} iconBgClassName="bg-green-100" title="Option 3" description="Third option to demonstrate selection" isChosen={selected === 'option3'} onChosen={() => setSelected('option3')}/>
    </div>);
};
exports.Playground = {
    render: () => <PlaygroundDemo />,
    parameters: { controls: { disable: true } },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUF1SDtBQUN2SCxpQ0FBZ0M7QUFDaEMsd0JBQXlCO0FBRXpCLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDJCQUEyQjtJQUNsQyxTQUFTLEVBQUUsVUFBUztJQUNwQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLGtKQUFrSjthQUM5SjtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFLHlCQUF5QjtTQUN2QztRQUNELGVBQWUsRUFBRTtZQUNmLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLDJDQUEyQztTQUN6RDtRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLFlBQVk7U0FDMUI7UUFDRCxXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxrQkFBa0I7U0FDaEM7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsU0FBUztZQUNsQixXQUFXLEVBQUUsOEJBQThCO1NBQzVDO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGlDQUFpQztTQUMvQztLQUNGO0NBQytCLENBQUE7QUFFbEMsa0JBQWUsSUFBSSxDQUFBO0FBR25CLG1CQUFtQjtBQUNuQixNQUFNLGFBQWEsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO0lBQ2xDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxD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LE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtDQUN4QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgUmlDbG91ZExpbmUsIFJpQ3B1TGluZSwgUmlEYXRhYmFzZTJMaW5lLCBSaUxpZ2h0YnVsYkxpbmUsIFJpUm9ja2V0TGluZSwgUmlTaGllbGRMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaW9DYXJkIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L1JhZGlvQ2FyZCcsXG4gIGNvbXBvbmVudDogUmFkaW9DYXJkLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1JhZGlvIGNhcmQgY29tcG9uZW50IGZvciBzZWxlY3Rpbmcgb3B0aW9ucyB3aXRoIHJpY2ggY29udGVudC4gRmVhdHVyZXMgaWNvbiwgdGl0bGUsIGRlc2NyaXB0aW9uLCBhbmQgb3B0aW9uYWwgY29uZmlndXJhdGlvbiBwYW5lbCB3aGVuIHNlbGVjdGVkLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnVHlwZXM6IHtcbiAgICBpY29uOiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0ljb24gZWxlbWVudCB0byBkaXNwbGF5JyxcbiAgICB9LFxuICAgIGljb25CZ0NsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdCYWNrZ3JvdW5kIGNvbG9yIGNsYXNzIGZvciBpY29uIGNvbnRhaW5lcicsXG4gICAgfSxcbiAgICB0aXRsZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDYXJkIHRpdGxlJyxcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ0NhcmQgZGVzY3JpcHRpb24nLFxuICAgIH0sXG4gICAgaXNDaG9zZW46IHtcbiAgICAgIGNvbnRyb2w6ICdib29sZWFuJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0aGUgY2FyZCBpcyBzZWxlY3RlZCcsXG4gICAgfSxcbiAgICBub1JhZGlvOiB7XG4gICAgICBjb250cm9sOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0hpZGUgdGhlIHJhZGlvIGJ1dHRvbiBpbmRpY2F0b3InLFxuICAgIH0sXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBSYWRpb0NhcmQ+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuLy8gU2luZ2xlIGNhcmQgZGVtb1xuY29uc3QgUmFkaW9DYXJkRGVtbyA9IChhcmdzOiBhbnkpID0+IHtcbiAgY29uc3QgW2lzQ2hvc2VuLCBzZXRJc0Nob3Nlbl0gPSB1c2VTdGF0ZShhcmdzLmlzQ2hvc2VuIHx8IGZhbHNlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQwMHB4JyB9fT5cbiAgICAgIDxSYWRpb0NhcmRcbiAgICAgICAgey4uLmFyZ3N9XG4gICAgICAgIGlzQ2hvc2VuPXtpc0Nob3Nlbn1cbiAgICAgICAgb25DaG9zZW49eygpID0+IHNldElzQ2hvc2VuKCFpc0Nob3Nlbil9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbi8vIERlZmF1bHQgc3RhdGVcbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxSYWRpb0NhcmREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIGljb246IDxSaVJvY2tldExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXB1cnBsZS02MDBcIiAvPixcbiAgICBpY29uQmdDbGFzc05hbWU6ICdiZy1wdXJwbGUtMTAwJyxcbiAgICB0aXRsZTogJ1F1aWNrIFN0YXJ0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0dldCBzdGFydGVkIHF1aWNrbHkgd2l0aCBkZWZhdWx0IHNldHRpbmdzJyxcbiAgICBpc0Nob3NlbjogZmFsc2UsXG4gICAgbm9SYWRpbzogZmFsc2UsXG4gIH0sXG59XG5cbi8vIFNlbGVjdGVkIHN0YXRlXG5leHBvcnQgY29uc3QgU2VsZWN0ZWQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFJhZGlvQ2FyZERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgaWNvbjogPFJpUm9ja2V0TGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtcHVycGxlLTYwMFwiIC8+LFxuICAgIGljb25CZ0NsYXNzTmFtZTogJ2JnLXB1cnBsZS0xMDAnLFxuICAgIHRpdGxlOiAnUXVpY2sgU3RhcnQnLFxuICAgIGRlc2NyaXB0aW9uOiAnR2V0IHN0YXJ0ZWQgcXVpY2tseSB3aXRoIGRlZmF1bHQgc2V0dGluZ3MnLFxuICAgIGlzQ2hvc2VuOiB0cnVlLFxuICAgIG5vUmFkaW86IGZhbHNlLFxuICB9LFxufVxuXG4vLyBXaXRob3V0IHJhZGlvIGluZGljYXRvclxuZXhwb3J0IGNvbnN0IE5vUmFkaW86IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFJhZGlvQ2FyZERlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgaWNvbjogPFJpUm9ja2V0TGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtcHVycGxlLTYwMFwiIC8+LFxuICAgIGljb25CZ0NsYXNzTmFtZTogJ2JnLXB1cnBsZS0xMDAnLFxuICAgIHRpdGxlOiAnSW5mb3JtYXRpb24gQ2FyZCcsXG4gICAgZGVzY3JpcHRpb246ICdDYXJkIHdpdGhvdXQgcmFkaW8gaW5kaWNhdG9yJyxcbiAgICBub1JhZGlvOiB0cnVlLFxuICB9LFxufVxuXG4vLyBXaXRoIGNvbmZpZ3VyYXRpb24gcGFuZWxcbmNvbnN0IFdpdGhDb25maWd1cmF0aW9uRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW2lzQ2hvc2VuLCBzZXRJc0Nob3Nlbl0gPSB1c2VTdGF0ZSh0cnVlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQwMHB4JyB9fT5cbiAgICAgIDxSYWRpb0NhcmRcbiAgICAgICAgaWNvbj17PFJpRGF0YWJhc2UyTGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtYmx1ZS02MDBcIiAvPn1cbiAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctYmx1ZS0xMDBcIlxuICAgICAgICB0aXRsZT1cIkRhdGFiYXNlIFN0b3JhZ2VcIlxuICAgICAgICBkZXNjcmlwdGlvbj1cIlN0b3JlIGRhdGEgaW4gYSBtYW5hZ2VkIGRhdGFiYXNlXCJcbiAgICAgICAgaXNDaG9zZW49e2lzQ2hvc2VufVxuICAgICAgICBvbkNob3Nlbj17KCkgPT4gc2V0SXNDaG9zZW4oIWlzQ2hvc2VuKX1cbiAgICAgICAgY2hvc2VuQ29uZmlnPXsoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTYwMFwiPlJlZ2lvbjo8L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT1cInJvdW5kZWQgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0yIHB5LTEgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgIDxvcHRpb24+VVMgRWFzdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24+RVUgV2VzdDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24+QXNpYSBQYWNpZmljPC9vcHRpb24+XG4gICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS02MDBcIj5TaXplOjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPVwicm91bmRlZCBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHB4LTIgcHktMSB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgICAgPG9wdGlvbj5TbWFsbCAoMTBHQik8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uPk1lZGl1bSAoNTBHQik8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8b3B0aW9uPkxhcmdlICgxMDBHQik8L29wdGlvbj5cbiAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFdpdGhDb25maWd1cmF0aW9uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8V2l0aENvbmZpZ3VyYXRpb25EZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIE11bHRpcGxlIGNhcmRzIHNlbGVjdGlvblxuY29uc3QgTXVsdGlwbGVDYXJkc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtzZWxlY3RlZCwgc2V0U2VsZWN0ZWRdID0gdXNlU3RhdGUoJ3N0YW5kYXJkJylcblxuICBjb25zdCBvcHRpb25zID0gW1xuICAgIHtcbiAgICAgIHZhbHVlOiAnc3RhbmRhcmQnLFxuICAgICAgaWNvbjogPFJpUm9ja2V0TGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtcHVycGxlLTYwMFwiIC8+LFxuICAgICAgaWNvbkJnOiAnYmctcHVycGxlLTEwMCcsXG4gICAgICB0aXRsZTogJ1N0YW5kYXJkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUGVyZmVjdCBmb3IgbW9zdCB1c2UgY2FzZXMnLFxuICAgIH0sXG4gICAge1xuICAgICAgdmFsdWU6ICdhZHZhbmNlZCcsXG4gICAgICBpY29uOiA8UmlDcHVMaW5lIGNsYXNzTmFtZT1cImgtNSB3LTUgdGV4dC1ibHVlLTYwMFwiIC8+LFxuICAgICAgaWNvbkJnOiAnYmctYmx1ZS0xMDAnLFxuICAgICAgdGl0bGU6ICdBZHZhbmNlZCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ01vcmUgZmVhdHVyZXMgYW5kIGN1c3RvbWl6YXRpb24nLFxuICAgIH0sXG4gICAge1xuICAgICAgdmFsdWU6ICdlbnRlcnByaXNlJyxcbiAgICAgIGljb246IDxSaVNoaWVsZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyZWVuLTYwMFwiIC8+LFxuICAgICAgaWNvbkJnOiAnYmctZ3JlZW4tMTAwJyxcbiAgICAgIHRpdGxlOiAnRW50ZXJwcmlzZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Z1bGwgZmVhdHVyZXMgd2l0aCBwcmVtaXVtIHN1cHBvcnQnLFxuICAgIH0sXG4gIF1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0NTBweCcgfX0gY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICB7b3B0aW9ucy5tYXAob3B0aW9uID0+IChcbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGtleT17b3B0aW9uLnZhbHVlfVxuICAgICAgICAgIGljb249e29wdGlvbi5pY29ufVxuICAgICAgICAgIGljb25CZ0NsYXNzTmFtZT17b3B0aW9uLmljb25CZ31cbiAgICAgICAgICB0aXRsZT17b3B0aW9uLnRpdGxlfVxuICAgICAgICAgIGRlc2NyaXB0aW9uPXtvcHRpb24uZGVzY3JpcHRpb259XG4gICAgICAgICAgaXNDaG9zZW49e3NlbGVjdGVkID09PSBvcHRpb24udmFsdWV9XG4gICAgICAgICAgb25DaG9zZW49eygpID0+IHNldFNlbGVjdGVkKG9wdGlvbi52YWx1ZSl9XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCB0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgU2VsZWN0ZWQ6XG4gICAgICAgIHsnICd9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGRcIj57c2VsZWN0ZWR9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IE11bHRpcGxlQ2FyZHM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxNdWx0aXBsZUNhcmRzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBDbG91ZCBwcm92aWRlciBzZWxlY3Rpb25cbmNvbnN0IENsb3VkUHJvdmlkZXJTZWxlY3Rpb25EZW1vID0gKCkgPT4ge1xuICBjb25zdCBbcHJvdmlkZXIsIHNldFByb3ZpZGVyXSA9IHVzZVN0YXRlKCdhd3MnKVxuICBjb25zdCBbcmVnaW9uLCBzZXRSZWdpb25dID0gdXNlU3RhdGUoJ3VzLWVhc3QtMScpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlNlbGVjdCBDbG91ZCBQcm92aWRlcjwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICA8UmFkaW9DYXJkXG4gICAgICAgICAgaWNvbj17PFJpQ2xvdWRMaW5lIGNsYXNzTmFtZT1cImgtNSB3LTUgdGV4dC1vcmFuZ2UtNjAwXCIgLz59XG4gICAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctb3JhbmdlLTEwMFwiXG4gICAgICAgICAgdGl0bGU9XCJBbWF6b24gV2ViIFNlcnZpY2VzXCJcbiAgICAgICAgICBkZXNjcmlwdGlvbj1cIkluZHVzdHJ5LWxlYWRpbmcgY2xvdWQgaW5mcmFzdHJ1Y3R1cmVcIlxuICAgICAgICAgIGlzQ2hvc2VuPXtwcm92aWRlciA9PT0gJ2F3cyd9XG4gICAgICAgICAgb25DaG9zZW49eygpID0+IHNldFByb3ZpZGVyKCdhd3MnKX1cbiAgICAgICAgICBjaG9zZW5Db25maWc9eyhcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5SZWdpb248L2xhYmVsPlxuICAgICAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0zIHB5LTIgdGV4dC1zbVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3JlZ2lvbn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRSZWdpb24oZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInVzLWVhc3QtMVwiPlVTIEVhc3QgKE4uIFZpcmdpbmlhKTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ1cy13ZXN0LTJcIj5VUyBXZXN0IChPcmVnb24pPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImV1LXdlc3QtMVwiPkVVIChJcmVsYW5kKTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJhcC1zb3V0aGVhc3QtMVwiPkFzaWEgUGFjaWZpYyAoU2luZ2Fwb3JlKTwvb3B0aW9uPlxuICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICAgIDxSYWRpb0NhcmRcbiAgICAgICAgICBpY29uPXs8UmlDbG91ZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWJsdWUtNjAwXCIgLz59XG4gICAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctYmx1ZS0xMDBcIlxuICAgICAgICAgIHRpdGxlPVwiTWljcm9zb2Z0IEF6dXJlXCJcbiAgICAgICAgICBkZXNjcmlwdGlvbj1cIkVudGVycHJpc2UtZ3JhZGUgY2xvdWQgcGxhdGZvcm1cIlxuICAgICAgICAgIGlzQ2hvc2VuPXtwcm92aWRlciA9PT0gJ2F6dXJlJ31cbiAgICAgICAgICBvbkNob3Nlbj17KCkgPT4gc2V0UHJvdmlkZXIoJ2F6dXJlJyl9XG4gICAgICAgIC8+XG4gICAgICAgIDxSYWRpb0NhcmRcbiAgICAgICAgICBpY29uPXs8UmlDbG91ZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXJlZC02MDBcIiAvPn1cbiAgICAgICAgICBpY29uQmdDbGFzc05hbWU9XCJiZy1yZWQtMTAwXCJcbiAgICAgICAgICB0aXRsZT1cIkdvb2dsZSBDbG91ZCBQbGF0Zm9ybVwiXG4gICAgICAgICAgZGVzY3JpcHRpb249XCJTY2FsYWJsZSBhbmQgcmVsaWFibGUgaW5mcmFzdHJ1Y3R1cmVcIlxuICAgICAgICAgIGlzQ2hvc2VuPXtwcm92aWRlciA9PT0gJ2djcCd9XG4gICAgICAgICAgb25DaG9zZW49eygpID0+IHNldFByb3ZpZGVyKCdnY3AnKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBDbG91ZFByb3ZpZGVyU2VsZWN0aW9uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8Q2xvdWRQcm92aWRlclNlbGVjdGlvbkRlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gRGVwbG95bWVudCBzdHJhdGVneVxuY29uc3QgRGVwbG95bWVudFN0cmF0ZWd5RGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3N0cmF0ZWd5LCBzZXRTdHJhdGVneV0gPSB1c2VTdGF0ZSgncm9sbGluZycpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTUwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi0yIHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkRlcGxveW1lbnQgU3RyYXRlZ3k8L2gzPlxuICAgICAgPHAgY2xhc3NOYW1lPVwibWItNCB0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5DaG9vc2UgaG93IHlvdSB3YW50IHRvIGRlcGxveSB5b3VyIGFwcGxpY2F0aW9uPC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGljb249ezxSaVJvY2tldExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyZWVuLTYwMFwiIC8+fVxuICAgICAgICAgIGljb25CZ0NsYXNzTmFtZT1cImJnLWdyZWVuLTEwMFwiXG4gICAgICAgICAgdGl0bGU9XCJSb2xsaW5nIERlcGxveW1lbnRcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uPVwiR3JhZHVhbGx5IHJlcGxhY2UgaW5zdGFuY2VzIHdpdGggemVybyBkb3dudGltZVwiXG4gICAgICAgICAgaXNDaG9zZW49e3N0cmF0ZWd5ID09PSAncm9sbGluZyd9XG4gICAgICAgICAgb25DaG9zZW49eygpID0+IHNldFN0cmF0ZWd5KCdyb2xsaW5nJyl9XG4gICAgICAgICAgY2hvc2VuQ29uZmlnPXsoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctZ3JlZW4tNTAgcC0zIHRleHQteHMgdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICAgICDinJMgUmVjb21tZW5kZWQgZm9yIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRzXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICDinJMgTWluaW1hbCByaXNrIHdpdGggYXV0b21hdGljIHJvbGxiYWNrXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICDinJMgVGFrZXMgNS0xMCBtaW51dGVzXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAvPlxuICAgICAgICA8UmFkaW9DYXJkXG4gICAgICAgICAgaWNvbj17PFJpQ3B1TGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtYmx1ZS02MDBcIiAvPn1cbiAgICAgICAgICBpY29uQmdDbGFzc05hbWU9XCJiZy1ibHVlLTEwMFwiXG4gICAgICAgICAgdGl0bGU9XCJCbHVlLUdyZWVuIERlcGxveW1lbnRcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uPVwiU3dpdGNoIGJldHdlZW4gdHdvIGlkZW50aWNhbCBlbnZpcm9ubWVudHNcIlxuICAgICAgICAgIGlzQ2hvc2VuPXtzdHJhdGVneSA9PT0gJ2JsdWUtZ3JlZW4nfVxuICAgICAgICAgIG9uQ2hvc2VuPXsoKSA9PiBzZXRTdHJhdGVneSgnYmx1ZS1ncmVlbicpfVxuICAgICAgICAgIGNob3NlbkNvbmZpZz17KFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLWJsdWUtNTAgcC0zIHRleHQteHMgdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICAgICDinJMgSW5zdGFudCByb2xsYmFjayBjYXBhYmlsaXR5XG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICDinJMgUmVxdWlyZXMgZG91YmxlIHRoZSByZXNvdXJjZXNcbiAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgIOKckyBUYWtlcyAyLTUgbWludXRlc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGljb249ezxSaUxpZ2h0YnVsYkxpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXllbGxvdy02MDBcIiAvPn1cbiAgICAgICAgICBpY29uQmdDbGFzc05hbWU9XCJiZy15ZWxsb3ctMTAwXCJcbiAgICAgICAgICB0aXRsZT1cIkNhbmFyeSBEZXBsb3ltZW50XCJcbiAgICAgICAgICBkZXNjcmlwdGlvbj1cIlRlc3Qgd2l0aCBhIHNtYWxsIHN1YnNldCBvZiB1c2VycyBmaXJzdFwiXG4gICAgICAgICAgaXNDaG9zZW49e3N0cmF0ZWd5ID09PSAnY2FuYXJ5J31cbiAgICAgICAgICBvbkNob3Nlbj17KCkgPT4gc2V0U3RyYXRlZ3koJ2NhbmFyeScpfVxuICAgICAgICAgIGNob3NlbkNvbmZpZz17KFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLXllbGxvdy01MCBwLTMgdGV4dC14cyB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgICAgIOKckyBUZXN0IGNoYW5nZXMgd2l0aCByZWFsIHRyYWZmaWNcbiAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgIOKckyBHcmFkdWFsIHJvbGxvdXQgcmVkdWNlcyByaXNrXG4gICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICDinJMgVGFrZXMgMTUtMzAgbWludXRlc1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJtdC02IHctZnVsbCByb3VuZGVkLWxnIGJnLWJsdWUtNjAwIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUgaG92ZXI6YmctYmx1ZS03MDBcIj5cbiAgICAgICAgRGVwbG95IHdpdGhcbiAgICAgICAgeycgJ31cbiAgICAgICAge3N0cmF0ZWd5fVxuICAgICAgICB7JyAnfVxuICAgICAgICBzdHJhdGVneVxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IERlcGxveW1lbnRTdHJhdGVneTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPERlcGxveW1lbnRTdHJhdGVneURlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gU3RvcmFnZSBvcHRpb25zXG5jb25zdCBTdG9yYWdlT3B0aW9uc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtzdG9yYWdlLCBzZXRTdG9yYWdlXSA9IHVzZVN0YXRlKCdzc2QnKVxuXG4gIGNvbnN0IHN0b3JhZ2VPcHRpb25zID0gW1xuICAgIHtcbiAgICAgIHZhbHVlOiAnc3NkJyxcbiAgICAgIGljb246IDxSaURhdGFiYXNlMkxpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXB1cnBsZS02MDBcIiAvPixcbiAgICAgIGljb25CZzogJ2JnLXB1cnBsZS0xMDAnLFxuICAgICAgdGl0bGU6ICdTU0QgU3RvcmFnZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Zhc3QgYW5kIHJlbGlhYmxlIHNvbGlkIHN0YXRlIGRyaXZlcycsXG4gICAgICBwcmljZTogJyQwLjEwL0dCL21vbnRoJyxcbiAgICAgIHNwZWVkOiAnVXAgdG8gMzAwMCBJT1BTJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHZhbHVlOiAnaGRkJyxcbiAgICAgIGljb246IDxSaURhdGFiYXNlMkxpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyYXktNjAwXCIgLz4sXG4gICAgICBpY29uQmc6ICdiZy1ncmF5LTEwMCcsXG4gICAgICB0aXRsZTogJ0hERCBTdG9yYWdlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29zdC1lZmZlY3RpdmUgbWFnbmV0aWMgZGlzayBzdG9yYWdlJyxcbiAgICAgIHByaWNlOiAnJDAuMDUvR0IvbW9udGgnLFxuICAgICAgc3BlZWQ6ICdVcCB0byA1MDAgSU9QUycsXG4gICAgfSxcbiAgICB7XG4gICAgICB2YWx1ZTogJ252bWUnLFxuICAgICAgaWNvbjogPFJpRGF0YWJhc2UyTGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtcmVkLTYwMFwiIC8+LFxuICAgICAgaWNvbkJnOiAnYmctcmVkLTEwMCcsXG4gICAgICB0aXRsZTogJ05WTWUgU3RvcmFnZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VsdHJhLWZhc3QgUENJZS1iYXNlZCBzdG9yYWdlJyxcbiAgICAgIHByaWNlOiAnJDAuMjAvR0IvbW9udGgnLFxuICAgICAgc3BlZWQ6ICdVcCB0byAxMDAwMCBJT1BTJyxcbiAgICB9LFxuICBdXG5cbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSBzdG9yYWdlT3B0aW9ucy5maW5kKG9wdCA9PiBvcHQudmFsdWUgPT09IHN0b3JhZ2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlN0b3JhZ2UgVHlwZTwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICB7c3RvcmFnZU9wdGlvbnMubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgICAga2V5PXtvcHRpb24udmFsdWV9XG4gICAgICAgICAgICBpY29uPXtvcHRpb24uaWNvbn1cbiAgICAgICAgICAgIGljb25CZ0NsYXNzTmFtZT17b3B0aW9uLmljb25CZ31cbiAgICAgICAgICAgIHRpdGxlPXsoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4+e29wdGlvbi50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW5vcm1hbCB0ZXh0LWdyYXktNTAwXCI+e29wdGlvbi5wcmljZX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIGRlc2NyaXB0aW9uPXtgJHtvcHRpb24uZGVzY3JpcHRpb259IC0gJHtvcHRpb24uc3BlZWR9YH1cbiAgICAgICAgICAgIGlzQ2hvc2VuPXtzdG9yYWdlID09PSBvcHRpb24udmFsdWV9XG4gICAgICAgICAgICBvbkNob3Nlbj17KCkgPT4gc2V0U3RvcmFnZShvcHRpb24udmFsdWUpfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgICB7c2VsZWN0ZWRPcHRpb24gJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgICA8c3Ryb25nPlNlbGVjdGVkOjwvc3Ryb25nPlxuICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgIHtzZWxlY3RlZE9wdGlvbi50aXRsZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb24ucHJpY2V9XG4gICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAg4oCiXG4gICAgICAgICAgICB7c2VsZWN0ZWRPcHRpb24uc3BlZWR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgU3RvcmFnZU9wdGlvbnM6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxTdG9yYWdlT3B0aW9uc0RlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gQVBJIGF1dGhlbnRpY2F0aW9uIG1ldGhvZFxuY29uc3QgQVBJQXV0aE1ldGhvZERlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFthdXRoTWV0aG9kLCBzZXRBdXRoTWV0aG9kXSA9IHVzZVN0YXRlKCdhcGlfa2V5JylcbiAgY29uc3QgW2FwaUtleSwgc2V0QXBpS2V5XSA9IHVzZVN0YXRlKCcnKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzU1MHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5BUEkgQXV0aGVudGljYXRpb248L2gzPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGljb249ezxSaVNoaWVsZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWJsdWUtNjAwXCIgLz59XG4gICAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctYmx1ZS0xMDBcIlxuICAgICAgICAgIHRpdGxlPVwiQVBJIEtleVwiXG4gICAgICAgICAgZGVzY3JpcHRpb249XCJTaW1wbGUgYXV0aGVudGljYXRpb24gdXNpbmcgYSBzZWNyZXQga2V5XCJcbiAgICAgICAgICBpc0Nob3Nlbj17YXV0aE1ldGhvZCA9PT0gJ2FwaV9rZXknfVxuICAgICAgICAgIG9uQ2hvc2VuPXsoKSA9PiBzZXRBdXRoTWV0aG9kKCdhcGlfa2V5Jyl9XG4gICAgICAgICAgY2hvc2VuQ29uZmlnPXsoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+WW91ciBBUEkgS2V5PC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHB4LTMgcHktMiB0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cInNrLS4uLlwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2FwaUtleX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRBcGlLZXkoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5LZWVwIHlvdXIgQVBJIGtleSBzZWN1cmUgYW5kIG5ldmVyIHNoYXJlIGl0IHB1YmxpY2x5PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGljb249ezxSaVNoaWVsZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyZWVuLTYwMFwiIC8+fVxuICAgICAgICAgIGljb25CZ0NsYXNzTmFtZT1cImJnLWdyZWVuLTEwMFwiXG4gICAgICAgICAgdGl0bGU9XCJPQXV0aCAyLjBcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uPVwiSW5kdXN0cnktc3RhbmRhcmQgYXV0aG9yaXphdGlvbiBwcm90b2NvbFwiXG4gICAgICAgICAgaXNDaG9zZW49e2F1dGhNZXRob2QgPT09ICdvYXV0aCd9XG4gICAgICAgICAgb25DaG9zZW49eygpID0+IHNldEF1dGhNZXRob2QoJ29hdXRoJyl9XG4gICAgICAgICAgY2hvc2VuQ29uZmlnPXsoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctZ3JlZW4tNTAgcC0zXCI+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1iLTIgdGV4dC14cyB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgICAgICAgQ29uZmlndXJlIE9BdXRoIDIuMCBhdXRoZW50aWNhdGlvbiBmb3Igc2VjdXJlIGFjY2Vzc1xuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LWdyZWVuLTYwMCBob3Zlcjp1bmRlcmxpbmVcIj5cbiAgICAgICAgICAgICAgICBDb25maWd1cmUgT0F1dGggU2V0dGluZ3Mg4oaSXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgICAgPFJhZGlvQ2FyZFxuICAgICAgICAgIGljb249ezxSaVNoaWVsZExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXB1cnBsZS02MDBcIiAvPn1cbiAgICAgICAgICBpY29uQmdDbGFzc05hbWU9XCJiZy1wdXJwbGUtMTAwXCJcbiAgICAgICAgICB0aXRsZT1cIkpXVCBUb2tlblwiXG4gICAgICAgICAgZGVzY3JpcHRpb249XCJKU09OIFdlYiBUb2tlbiBiYXNlZCBhdXRoZW50aWNhdGlvblwiXG4gICAgICAgICAgaXNDaG9zZW49e2F1dGhNZXRob2QgPT09ICdqd3QnfVxuICAgICAgICAgIG9uQ2hvc2VuPXsoKSA9PiBzZXRBdXRoTWV0aG9kKCdqd3QnKX1cbiAgICAgICAgICBjaG9zZW5Db25maWc9eyhcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1wdXJwbGUtNTAgcC0zIHRleHQteHMgdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgICAgICBKV1QgdG9rZW5zIHByb3ZpZGUgc3RhdGVsZXNzIGF1dGhlbnRpY2F0aW9uIHdpdGggZXhwaXJhdGlvbiBhbmQgcmVmcmVzaCBjYXBhYmlsaXRpZXNcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgQVBJQXV0aE1ldGhvZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEFQSUF1dGhNZXRob2REZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIEludGVyYWN0aXZlIHBsYXlncm91bmRcbmNvbnN0IFBsYXlncm91bmREZW1vID0gKCkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWQsIHNldFNlbGVjdGVkXSA9IHVzZVN0YXRlKCdvcHRpb24xJylcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0NTBweCcgfX0gY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICA8UmFkaW9DYXJkXG4gICAgICAgIGljb249ezxSaVJvY2tldExpbmUgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LXB1cnBsZS02MDBcIiAvPn1cbiAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctcHVycGxlLTEwMFwiXG4gICAgICAgIHRpdGxlPVwiT3B0aW9uIDFcIlxuICAgICAgICBkZXNjcmlwdGlvbj1cIkZpcnN0IG9wdGlvbiB3aXRoIGljb24gYW5kIGRlc2NyaXB0aW9uXCJcbiAgICAgICAgaXNDaG9zZW49e3NlbGVjdGVkID09PSAnb3B0aW9uMSd9XG4gICAgICAgIG9uQ2hvc2VuPXsoKSA9PiBzZXRTZWxlY3RlZCgnb3B0aW9uMScpfVxuICAgICAgLz5cbiAgICAgIDxSYWRpb0NhcmRcbiAgICAgICAgaWNvbj17PFJpRGF0YWJhc2UyTGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtYmx1ZS02MDBcIiAvPn1cbiAgICAgICAgaWNvbkJnQ2xhc3NOYW1lPVwiYmctYmx1ZS0xMDBcIlxuICAgICAgICB0aXRsZT1cIk9wdGlvbiAyXCJcbiAgICAgICAgZGVzY3JpcHRpb249XCJTZWNvbmQgb3B0aW9uIHdpdGggZGlmZmVyZW50IHN0eWxpbmdcIlxuICAgICAgICBpc0Nob3Nlbj17c2VsZWN0ZWQgPT09ICdvcHRpb24yJ31cbiAgICAgICAgb25DaG9zZW49eygpID0+IHNldFNlbGVjdGVkKCdvcHRpb24yJyl9XG4gICAgICAgIGNob3NlbkNvbmZpZz17KFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZCBiZy1ibHVlLTUwIHAtMiB0ZXh0LXhzIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgICAgIEFkZGl0aW9uYWwgY29uZmlndXJhdGlvbiBhcHBlYXJzIHdoZW4gc2VsZWN0ZWRcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgICA8UmFkaW9DYXJkXG4gICAgICAgIGljb249ezxSaUNsb3VkTGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtZ3JlZW4tNjAwXCIgLz59XG4gICAgICAgIGljb25CZ0NsYXNzTmFtZT1cImJnLWdyZWVuLTEwMFwiXG4gICAgICAgIHRpdGxlPVwiT3B0aW9uIDNcIlxuICAgICAgICBkZXNjcmlwdGlvbj1cIlRoaXJkIG9wdGlvbiB0byBkZW1vbnN0cmF0ZSBzZWxlY3Rpb25cIlxuICAgICAgICBpc0Nob3Nlbj17c2VsZWN0ZWQgPT09ICdvcHRpb24zJ31cbiAgICAgICAgb25DaG9zZW49eygpID0+IHNldFNlbGVjdGVkKCdvcHRpb24zJyl9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8UGxheWdyb3VuZERlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcbiJdfQ==