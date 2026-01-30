"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = exports.MultipleSliders = exports.ImageQualitySelector = exports.AIModelParameters = exports.ZoomControl = exports.ProgressSlider = exports.TemperatureSelector = exports.PriceRangeFilter = exports.BrightnessControl = exports.VolumeControl = exports.Disabled = exports.DecimalValues = exports.WithStepIncrement = exports.CustomRange = exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/Slider',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Slider component for selecting a numeric value within a range. Built on react-slider with customizable min/max/step values.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'number',
            description: 'Current slider value',
        },
        min: {
            control: 'number',
            description: 'Minimum value (default: 0)',
        },
        max: {
            control: 'number',
            description: 'Maximum value (default: 100)',
        },
        step: {
            control: 'number',
            description: 'Step increment (default: 1)',
        },
        disabled: {
            control: 'boolean',
            description: 'Disabled state',
        },
    },
    args: {
        onChange: (value) => {
            console.log('Slider value:', value);
        },
    },
};
exports.default = meta;
// Interactive demo wrapper
const SliderDemo = (args) => {
    const [value, setValue] = (0, react_1.useState)(args.value || 50);
    return (<div style={{ width: '400px' }}>
      <_1.default {...args} value={value} onChange={(v) => {
            setValue(v);
            console.log('Slider value:', v);
        }}/>
      <div className="mt-4 text-center text-sm text-gray-600">
        Value:
        {' '}
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>);
};
// Default state
exports.Default = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
    },
};
// With custom range
exports.CustomRange = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 25,
        min: 0,
        max: 50,
        step: 1,
        disabled: false,
    },
};
// With step increment
exports.WithStepIncrement = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 10,
        disabled: false,
    },
};
// Decimal values
exports.DecimalValues = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 2.5,
        min: 0,
        max: 5,
        step: 0.5,
        disabled: false,
    },
};
// Disabled state
exports.Disabled = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 75,
        min: 0,
        max: 100,
        step: 1,
        disabled: true,
    },
};
// Real-world example - Volume control
const VolumeControlDemo = () => {
    const [volume, setVolume] = (0, react_1.useState)(70);
    const getVolumeIcon = (vol) => {
        if (vol === 0)
            return '🔇';
        if (vol < 33)
            return '🔈';
        if (vol < 66)
            return '🔉';
        return '🔊';
    };
    return (<div style={{ width: '400px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Volume Control</h3>
        <span className="text-2xl">{getVolumeIcon(volume)}</span>
      </div>
      <_1.default value={volume} min={0} max={100} step={1} onChange={setVolume}/>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Mute</span>
        <span className="text-lg font-semibold">
          {volume}
          %
        </span>
        <span>Max</span>
      </div>
    </div>);
};
exports.VolumeControl = {
    render: () => <VolumeControlDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Brightness control
const BrightnessControlDemo = () => {
    const [brightness, setBrightness] = (0, react_1.useState)(80);
    return (<div style={{ width: '400px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Screen Brightness</h3>
        <span className="text-2xl">☀️</span>
      </div>
      <_1.default value={brightness} min={0} max={100} step={5} onChange={setBrightness}/>
      <div className="mt-4 rounded-lg bg-gray-50 p-4" style={{ opacity: brightness / 100 }}>
        <div className="text-sm text-gray-700">
          Preview at
          {' '}
          {brightness}
          % brightness
        </div>
      </div>
    </div>);
};
exports.BrightnessControl = {
    render: () => <BrightnessControlDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Price range filter
const PriceRangeFilterDemo = () => {
    const [maxPrice, setMaxPrice] = (0, react_1.useState)(500);
    const minPrice = 0;
    const products = [
        { name: 'Product A', price: 150 },
        { name: 'Product B', price: 350 },
        { name: 'Product C', price: 600 },
        { name: 'Product D', price: 250 },
        { name: 'Product E', price: 450 },
    ];
    const filteredProducts = products.filter(p => p.price >= minPrice && p.price <= maxPrice);
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Filter by Price</h3>
      <div className="mb-2">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>Maximum Price</span>
          <span className="font-semibold text-gray-900">
            $
            {maxPrice}
          </span>
        </div>
        <_1.default value={maxPrice} min={0} max={1000} step={50} onChange={setMaxPrice}/>
      </div>
      <div className="mt-6">
        <div className="mb-3 text-sm font-medium text-gray-700">
          Showing
          {' '}
          {filteredProducts.length}
          {' '}
          of
          {' '}
          {products.length}
          {' '}
          products
        </div>
        <div className="space-y-2">
          {filteredProducts.map(product => (<div key={product.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm">{product.name}</span>
              <span className="font-semibold text-gray-900">
                $
                {product.price}
              </span>
            </div>))}
        </div>
      </div>
    </div>);
};
exports.PriceRangeFilter = {
    render: () => <PriceRangeFilterDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Temperature selector
const TemperatureSelectorDemo = () => {
    const [temperature, setTemperature] = (0, react_1.useState)(22);
    const fahrenheit = ((temperature * 9) / 5 + 32).toFixed(1);
    return (<div style={{ width: '400px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Thermostat Control</h3>
      <div className="mb-6">
        <_1.default value={temperature} min={16} max={30} step={0.5} onChange={setTemperature}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="mb-1 text-xs text-gray-600">Celsius</div>
          <div className="text-3xl font-bold text-blue-600">
            {temperature}
            °C
          </div>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <div className="mb-1 text-xs text-gray-600">Fahrenheit</div>
          <div className="text-3xl font-bold text-orange-600">
            {fahrenheit}
            °F
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500">
        {temperature < 18 && '🥶 Too cold'}
        {temperature >= 18 && temperature <= 24 && '😊 Comfortable'}
        {temperature > 24 && '🥵 Too warm'}
      </div>
    </div>);
};
exports.TemperatureSelector = {
    render: () => <TemperatureSelectorDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Progress/completion slider
const ProgressSliderDemo = () => {
    const [progress, setProgress] = (0, react_1.useState)(65);
    return (<div style={{ width: '450px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Project Completion</h3>
      <_1.default value={progress} min={0} max={100} step={5} onChange={setProgress}/>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-lg font-bold text-blue-600">
            {progress}
            %
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={progress >= 25 ? '✅' : '⏳'}>Planning</span>
            <span className="text-xs text-gray-500">25%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={progress >= 50 ? '✅' : '⏳'}>Development</span>
            <span className="text-xs text-gray-500">50%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={progress >= 75 ? '✅' : '⏳'}>Testing</span>
            <span className="text-xs text-gray-500">75%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={progress >= 100 ? '✅' : '⏳'}>Deployment</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </div>
    </div>);
};
exports.ProgressSlider = {
    render: () => <ProgressSliderDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Zoom control
const ZoomControlDemo = () => {
    const [zoom, setZoom] = (0, react_1.useState)(100);
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Zoom Level</h3>
      <div className="flex items-center gap-4">
        <button className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300" onClick={() => setZoom(Math.max(50, zoom - 10))}>
          -
        </button>
        <div className="flex-1">
          <_1.default value={zoom} min={50} max={200} step={10} onChange={setZoom}/>
        </div>
        <button className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300" onClick={() => setZoom(Math.min(200, zoom + 10))}>
          +
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>50%</span>
        <span className="text-lg font-semibold">
          {zoom}
          %
        </span>
        <span>200%</span>
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-4 text-center" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}>
        <div className="text-sm">Preview content</div>
      </div>
    </div>);
};
exports.ZoomControl = {
    render: () => <ZoomControlDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - AI model parameters
const AIModelParametersDemo = () => {
    const [temperature, setTemperature] = (0, react_1.useState)(0.7);
    const [maxTokens, setMaxTokens] = (0, react_1.useState)(2000);
    const [topP, setTopP] = (0, react_1.useState)(0.9);
    return (<div style={{ width: '500px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Model Configuration</h3>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Temperature</label>
            <span className="text-sm font-semibold">{temperature}</span>
          </div>
          <_1.default value={temperature} min={0} max={2} step={0.1} onChange={setTemperature}/>
          <p className="mt-1 text-xs text-gray-500">
            Controls randomness. Lower is more focused, higher is more creative.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Max Tokens</label>
            <span className="text-sm font-semibold">{maxTokens}</span>
          </div>
          <_1.default value={maxTokens} min={100} max={4000} step={100} onChange={setMaxTokens}/>
          <p className="mt-1 text-xs text-gray-500">
            Maximum length of generated response.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Top P</label>
            <span className="text-sm font-semibold">{topP}</span>
          </div>
          <_1.default value={topP} min={0} max={1} step={0.05} onChange={setTopP}/>
          <p className="mt-1 text-xs text-gray-500">
            Nucleus sampling threshold.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-xs text-gray-700">
        <div>
          <strong>Temperature:</strong>
          {' '}
          {temperature}
        </div>
        <div>
          <strong>Max Tokens:</strong>
          {' '}
          {maxTokens}
        </div>
        <div>
          <strong>Top P:</strong>
          {' '}
          {topP}
        </div>
      </div>
    </div>);
};
exports.AIModelParameters = {
    render: () => <AIModelParametersDemo />,
    parameters: { controls: { disable: true } },
};
// Real-world example - Image quality selector
const ImageQualitySelectorDemo = () => {
    const [quality, setQuality] = (0, react_1.useState)(80);
    const getQualityLabel = (q) => {
        if (q < 50)
            return 'Low';
        if (q < 70)
            return 'Medium';
        if (q < 90)
            return 'High';
        return 'Maximum';
    };
    const estimatedSize = Math.round((quality / 100) * 5);
    return (<div style={{ width: '450px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Image Export Quality</h3>
      <_1.default value={quality} min={10} max={100} step={10} onChange={setQuality}/>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">Quality</div>
          <div className="text-lg font-semibold">{getQualityLabel(quality)}</div>
          <div className="text-xs text-gray-500">
            {quality}
            %
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="text-xs text-gray-600">File Size</div>
          <div className="text-lg font-semibold">
            ~
            {estimatedSize}
            {' '}
            MB
          </div>
          <div className="text-xs text-gray-500">Estimated</div>
        </div>
      </div>
    </div>);
};
exports.ImageQualitySelector = {
    render: () => <ImageQualitySelectorDemo />,
    parameters: { controls: { disable: true } },
};
// Multiple sliders
const MultipleSlidersDemo = () => {
    const [red, setRed] = (0, react_1.useState)(128);
    const [green, setGreen] = (0, react_1.useState)(128);
    const [blue, setBlue] = (0, react_1.useState)(128);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    return (<div style={{ width: '450px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">RGB Color Picker</h3>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-red-600">Red</label>
            <span className="text-sm font-semibold">{red}</span>
          </div>
          <_1.default value={red} min={0} max={255} step={1} onChange={setRed}/>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-green-600">Green</label>
            <span className="text-sm font-semibold">{green}</span>
          </div>
          <_1.default value={green} min={0} max={255} step={1} onChange={setGreen}/>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-blue-600">Blue</label>
            <span className="text-sm font-semibold">{blue}</span>
          </div>
          <_1.default value={blue} min={0} max={255} step={1} onChange={setBlue}/>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="h-24 w-24 rounded-lg border-2 border-gray-300" style={{ backgroundColor: rgbColor }}/>
        <div className="text-right">
          <div className="mb-1 text-xs text-gray-600">Color Value</div>
          <div className="font-mono text-sm font-semibold">{rgbColor}</div>
          <div className="mt-1 font-mono text-xs text-gray-500">
            #
            {red.toString(16).padStart(2, '0')}
            {green.toString(16).padStart(2, '0')}
            {blue.toString(16).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>);
};
exports.MultipleSliders = {
    render: () => <MultipleSlidersDemo />,
    parameters: { controls: { disable: true } },
};
// Interactive playground
exports.Playground = {
    render: args => <SliderDemo {...args}/>,
    args: {
        value: 50,
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBc0I7QUFFdEIsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsd0JBQXdCO0lBQy9CLFNBQVMsRUFBRSxVQUFNO0lBQ2pCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsNkhBQTZIO2FBQ3pJO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsUUFBUTtZQUNqQixXQUFXLEVBQUUsc0JBQXNCO1NBQ3BDO1FBQ0QsR0FBRyxFQUFFO1lBQ0gsT0FBTyxFQUFFLFFBQVE7WUFDakIsV0FBVyxFQUFFLDRCQUE0QjtTQUMxQztRQUNELEdBQUcsRUFBRTtZQUNILE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFdBQVcsRUFBRSw4QkFBOEI7U0FDNUM7UUFDRCxJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsUUFBUTtZQUNqQixXQUFXLEVBQUUsNkJBQTZCO1NBQzNDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLFNBQVM7WUFDbEIsV0FBVyxFQUFFLGdCQUFnQjtTQUM5QjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDckMsQ0FBQztLQUNGO0NBQzRCLENBQUE7QUFFL0Isa0JBQWUsSUFBSSxDQUFBO0FBR25CLDJCQUEyQjtBQUMzQixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO0lBQy9CLE1BQU0sQ0FBQyxL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RSxDQUFDO1FBQ04sR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsQ0FBQztRQUNQLFFBQVEsRUFBRSxLQUFLO0tBQ2hCO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgU2xpZGVyIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L1NsaWRlcicsXG4gIGNvbXBvbmVudDogU2xpZGVyLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1NsaWRlciBjb21wb25lbnQgZm9yIHNlbGVjdGluZyBhIG51bWVyaWMgdmFsdWUgd2l0aGluIGEgcmFuZ2UuIEJ1aWx0IG9uIHJlYWN0LXNsaWRlciB3aXRoIGN1c3RvbWl6YWJsZSBtaW4vbWF4L3N0ZXAgdmFsdWVzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnVHlwZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgY29udHJvbDogJ251bWJlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0N1cnJlbnQgc2xpZGVyIHZhbHVlJyxcbiAgICB9LFxuICAgIG1pbjoge1xuICAgICAgY29udHJvbDogJ251bWJlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ01pbmltdW0gdmFsdWUgKGRlZmF1bHQ6IDApJyxcbiAgICB9LFxuICAgIG1heDoge1xuICAgICAgY29udHJvbDogJ251bWJlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ01heGltdW0gdmFsdWUgKGRlZmF1bHQ6IDEwMCknLFxuICAgIH0sXG4gICAgc3RlcDoge1xuICAgICAgY29udHJvbDogJ251bWJlcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1N0ZXAgaW5jcmVtZW50IChkZWZhdWx0OiAxKScsXG4gICAgfSxcbiAgICBkaXNhYmxlZDoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlZCBzdGF0ZScsXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIG9uQ2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdTbGlkZXIgdmFsdWU6JywgdmFsdWUpXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFNsaWRlcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG4vLyBJbnRlcmFjdGl2ZSBkZW1vIHdyYXBwZXJcbmNvbnN0IFNsaWRlckRlbW8gPSAoYXJnczogYW55KSA9PiB7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGUoYXJncy52YWx1ZSB8fCA1MClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0MDBweCcgfX0+XG4gICAgICA8U2xpZGVyXG4gICAgICAgIHsuLi5hcmdzfVxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIG9uQ2hhbmdlPXsodikgPT4ge1xuICAgICAgICAgIHNldFZhbHVlKHYpXG4gICAgICAgICAgY29uc29sZS5sb2coJ1NsaWRlciB2YWx1ZTonLCB2KVxuICAgICAgICB9fVxuICAgICAgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCB0ZXh0LWNlbnRlciB0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgVmFsdWU6XG4gICAgICAgIHsnICd9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZFwiPnt2YWx1ZX08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBEZWZhdWx0IHN0YXRlXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8U2xpZGVyRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB2YWx1ZTogNTAsXG4gICAgbWluOiAwLFxuICAgIG1heDogMTAwLFxuICAgIHN0ZXA6IDEsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBXaXRoIGN1c3RvbSByYW5nZVxuZXhwb3J0IGNvbnN0IEN1c3RvbVJhbmdlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTbGlkZXJEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiAyNSxcbiAgICBtaW46IDAsXG4gICAgbWF4OiA1MCxcbiAgICBzdGVwOiAxLFxuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgfSxcbn1cblxuLy8gV2l0aCBzdGVwIGluY3JlbWVudFxuZXhwb3J0IGNvbnN0IFdpdGhTdGVwSW5jcmVtZW50OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTbGlkZXJEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIHZhbHVlOiA1MCxcbiAgICBtaW46IDAsXG4gICAgbWF4OiAxMDAsXG4gICAgc3RlcDogMTAsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxufVxuXG4vLyBEZWNpbWFsIHZhbHVlc1xuZXhwb3J0IGNvbnN0IERlY2ltYWxWYWx1ZXM6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFNsaWRlckRlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFsdWU6IDIuNSxcbiAgICBtaW46IDAsXG4gICAgbWF4OiA1LFxuICAgIHN0ZXA6IDAuNSxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gIH0sXG59XG5cbi8vIERpc2FibGVkIHN0YXRlXG5leHBvcnQgY29uc3QgRGlzYWJsZWQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPFNsaWRlckRlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgdmFsdWU6IDc1LFxuICAgIG1pbjogMCxcbiAgICBtYXg6IDEwMCxcbiAgICBzdGVwOiAxLFxuICAgIGRpc2FibGVkOiB0cnVlLFxuICB9LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBWb2x1bWUgY29udHJvbFxuY29uc3QgVm9sdW1lQ29udHJvbERlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFt2b2x1bWUsIHNldFZvbHVtZV0gPSB1c2VTdGF0ZSg3MClcblxuICBjb25zdCBnZXRWb2x1bWVJY29uID0gKHZvbDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHZvbCA9PT0gMClcbiAgICAgIHJldHVybiAn8J+UhydcbiAgICBpZiAodm9sIDwgMzMpXG4gICAgICByZXR1cm4gJ/CflIgnXG4gICAgaWYgKHZvbCA8IDY2KVxuICAgICAgcmV0dXJuICfwn5SJJ1xuICAgIHJldHVybiAn8J+UiidcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5Wb2x1bWUgQ29udHJvbDwvaDM+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtMnhsXCI+e2dldFZvbHVtZUljb24odm9sdW1lKX08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxTbGlkZXJcbiAgICAgICAgdmFsdWU9e3ZvbHVtZX1cbiAgICAgICAgbWluPXswfVxuICAgICAgICBtYXg9ezEwMH1cbiAgICAgICAgc3RlcD17MX1cbiAgICAgICAgb25DaGFuZ2U9e3NldFZvbHVtZX1cbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlxuICAgICAgICA8c3Bhbj5NdXRlPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5cbiAgICAgICAgICB7dm9sdW1lfVxuICAgICAgICAgICVcbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3Bhbj5NYXg8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgVm9sdW1lQ29udHJvbDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFZvbHVtZUNvbnRyb2xEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIEJyaWdodG5lc3MgY29udHJvbFxuY29uc3QgQnJpZ2h0bmVzc0NvbnRyb2xEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbYnJpZ2h0bmVzcywgc2V0QnJpZ2h0bmVzc10gPSB1c2VTdGF0ZSg4MClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkXCI+U2NyZWVuIEJyaWdodG5lc3M8L2gzPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bFwiPuKYgO+4jzwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPFNsaWRlclxuICAgICAgICB2YWx1ZT17YnJpZ2h0bmVzc31cbiAgICAgICAgbWluPXswfVxuICAgICAgICBtYXg9ezEwMH1cbiAgICAgICAgc3RlcD17NX1cbiAgICAgICAgb25DaGFuZ2U9e3NldEJyaWdodG5lc3N9XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IHJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTRcIiBzdHlsZT17eyBvcGFjaXR5OiBicmlnaHRuZXNzIC8gMTAwIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTcwMFwiPlxuICAgICAgICAgIFByZXZpZXcgYXRcbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHticmlnaHRuZXNzfVxuICAgICAgICAgICUgYnJpZ2h0bmVzc1xuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBCcmlnaHRuZXNzQ29udHJvbDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEJyaWdodG5lc3NDb250cm9sRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBQcmljZSByYW5nZSBmaWx0ZXJcbmNvbnN0IFByaWNlUmFuZ2VGaWx0ZXJEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbbWF4UHJpY2UsIHNldE1heFByaWNlXSA9IHVzZVN0YXRlKDUwMClcbiAgY29uc3QgbWluUHJpY2UgPSAwXG5cbiAgY29uc3QgcHJvZHVjdHMgPSBbXG4gICAgeyBuYW1lOiAnUHJvZHVjdCBBJywgcHJpY2U6IDE1MCB9LFxuICAgIHsgbmFtZTogJ1Byb2R1Y3QgQicsIHByaWNlOiAzNTAgfSxcbiAgICB7IG5hbWU6ICdQcm9kdWN0IEMnLCBwcmljZTogNjAwIH0sXG4gICAgeyBuYW1lOiAnUHJvZHVjdCBEJywgcHJpY2U6IDI1MCB9LFxuICAgIHsgbmFtZTogJ1Byb2R1Y3QgRScsIHByaWNlOiA0NTAgfSxcbiAgXVxuXG4gIGNvbnN0IGZpbHRlcmVkUHJvZHVjdHMgPSBwcm9kdWN0cy5maWx0ZXIocCA9PiBwLnByaWNlID49IG1pblByaWNlICYmIHAucHJpY2UgPD0gbWF4UHJpY2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNTAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkZpbHRlciBieSBQcmljZTwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiB0ZXh0LXNtIHRleHQtZ3JheS02MDBcIj5cbiAgICAgICAgICA8c3Bhbj5NYXhpbXVtIFByaWNlPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTkwMFwiPlxuICAgICAgICAgICAgJFxuICAgICAgICAgICAge21heFByaWNlfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxTbGlkZXJcbiAgICAgICAgICB2YWx1ZT17bWF4UHJpY2V9XG4gICAgICAgICAgbWluPXswfVxuICAgICAgICAgIG1heD17MTAwMH1cbiAgICAgICAgICBzdGVwPXs1MH1cbiAgICAgICAgICBvbkNoYW5nZT17c2V0TWF4UHJpY2V9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNlwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTMgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgU2hvd2luZ1xuICAgICAgICAgIHsnICd9XG4gICAgICAgICAge2ZpbHRlcmVkUHJvZHVjdHMubGVuZ3RofVxuICAgICAgICAgIHsnICd9XG4gICAgICAgICAgb2ZcbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHtwcm9kdWN0cy5sZW5ndGh9XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICBwcm9kdWN0c1xuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cbiAgICAgICAgICB7ZmlsdGVyZWRQcm9kdWN0cy5tYXAocHJvZHVjdCA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17cHJvZHVjdC5uYW1lfSBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtXCI+e3Byb2R1Y3QubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTkwMFwiPlxuICAgICAgICAgICAgICAgICRcbiAgICAgICAgICAgICAgICB7cHJvZHVjdC5wcmljZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFByaWNlUmFuZ2VGaWx0ZXI6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxQcmljZVJhbmdlRmlsdGVyRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBUZW1wZXJhdHVyZSBzZWxlY3RvclxuY29uc3QgVGVtcGVyYXR1cmVTZWxlY3RvckRlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFt0ZW1wZXJhdHVyZSwgc2V0VGVtcGVyYXR1cmVdID0gdXNlU3RhdGUoMjIpXG4gIGNvbnN0IGZhaHJlbmhlaXQgPSAoKHRlbXBlcmF0dXJlICogOSkgLyA1ICsgMzIpLnRvRml4ZWQoMSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc0MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+VGhlcm1vc3RhdCBDb250cm9sPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNlwiPlxuICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgdmFsdWU9e3RlbXBlcmF0dXJlfVxuICAgICAgICAgIG1pbj17MTZ9XG4gICAgICAgICAgbWF4PXszMH1cbiAgICAgICAgICBzdGVwPXswLjV9XG4gICAgICAgICAgb25DaGFuZ2U9e3NldFRlbXBlcmF0dXJlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLWJsdWUtNTAgcC00IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xIHRleHQteHMgdGV4dC1ncmF5LTYwMFwiPkNlbHNpdXM8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCB0ZXh0LWJsdWUtNjAwXCI+XG4gICAgICAgICAgICB7dGVtcGVyYXR1cmV9XG4gICAgICAgICAgICDCsENcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1vcmFuZ2UtNTAgcC00IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xIHRleHQteHMgdGV4dC1ncmF5LTYwMFwiPkZhaHJlbmhlaXQ8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCB0ZXh0LW9yYW5nZS02MDBcIj5cbiAgICAgICAgICAgIHtmYWhyZW5oZWl0fVxuICAgICAgICAgICAgwrBGXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgdGV4dC1jZW50ZXIgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgIHt0ZW1wZXJhdHVyZSA8IDE4ICYmICfwn6W2IFRvbyBjb2xkJ31cbiAgICAgICAge3RlbXBlcmF0dXJlID49IDE4ICYmIHRlbXBlcmF0dXJlIDw9IDI0ICYmICfwn5iKIENvbWZvcnRhYmxlJ31cbiAgICAgICAge3RlbXBlcmF0dXJlID4gMjQgJiYgJ/CfpbUgVG9vIHdhcm0nfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFRlbXBlcmF0dXJlU2VsZWN0b3I6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxUZW1wZXJhdHVyZVNlbGVjdG9yRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBQcm9ncmVzcy9jb21wbGV0aW9uIHNsaWRlclxuY29uc3QgUHJvZ3Jlc3NTbGlkZXJEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbcHJvZ3Jlc3MsIHNldFByb2dyZXNzXSA9IHVzZVN0YXRlKDY1KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQ1MHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5Qcm9qZWN0IENvbXBsZXRpb248L2gzPlxuICAgICAgPFNsaWRlclxuICAgICAgICB2YWx1ZT17cHJvZ3Jlc3N9XG4gICAgICAgIG1pbj17MH1cbiAgICAgICAgbWF4PXsxMDB9XG4gICAgICAgIHN0ZXA9ezV9XG4gICAgICAgIG9uQ2hhbmdlPXtzZXRQcm9ncmVzc31cbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlByb2dyZXNzPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ib2xkIHRleHQtYmx1ZS02MDBcIj5cbiAgICAgICAgICAgIHtwcm9ncmVzc31cbiAgICAgICAgICAgICVcbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMiB0ZXh0LXNtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtwcm9ncmVzcyA+PSAyNSA/ICfinIUnIDogJ+KPsyd9PlBsYW5uaW5nPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+MjUlPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17cHJvZ3Jlc3MgPj0gNTAgPyAn4pyFJyA6ICfij7MnfT5EZXZlbG9wbWVudDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPjUwJTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3Byb2dyZXNzID49IDc1ID8gJ+KchScgOiAn4o+zJ30+VGVzdGluZzwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPjc1JTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3Byb2dyZXNzID49IDEwMCA/ICfinIUnIDogJ+KPsyd9PkRlcGxveW1lbnQ8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj4xMDAlPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQcm9ncmVzc1NsaWRlcjogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFByb2dyZXNzU2xpZGVyRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBab29tIGNvbnRyb2xcbmNvbnN0IFpvb21Db250cm9sRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3pvb20sIHNldFpvb21dID0gdXNlU3RhdGUoMTAwKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzUwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5ab29tIExldmVsPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQgYmctZ3JheS0yMDAgcHgtMyBweS0xIHRleHQtc20gaG92ZXI6YmctZ3JheS0zMDBcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFpvb20oTWF0aC5tYXgoNTAsIHpvb20gLSAxMCkpfVxuICAgICAgICA+XG4gICAgICAgICAgLVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTFcIj5cbiAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICB2YWx1ZT17em9vbX1cbiAgICAgICAgICAgIG1pbj17NTB9XG4gICAgICAgICAgICBtYXg9ezIwMH1cbiAgICAgICAgICAgIHN0ZXA9ezEwfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3NldFpvb219XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkIGJnLWdyYXktMjAwIHB4LTMgcHktMSB0ZXh0LXNtIGhvdmVyOmJnLWdyYXktMzAwXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRab29tKE1hdGgubWluKDIwMCwgem9vbSArIDEwKSl9XG4gICAgICAgID5cbiAgICAgICAgICArXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQtc20gdGV4dC1ncmF5LTYwMFwiPlxuICAgICAgICA8c3Bhbj41MCU8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlxuICAgICAgICAgIHt6b29tfVxuICAgICAgICAgICVcbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3Bhbj4yMDAlPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtNCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHRyYW5zZm9ybTogYHNjYWxlKCR7em9vbSAvIDEwMH0pYCwgdHJhbnNmb3JtT3JpZ2luOiAnY2VudGVyJyB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtXCI+UHJldmlldyBjb250ZW50PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgWm9vbUNvbnRyb2w6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxab29tQ29udHJvbERlbW8gLz4sXG4gIHBhcmFtZXRlcnM6IHsgY29udHJvbHM6IHsgZGlzYWJsZTogdHJ1ZSB9IH0sXG59IGFzIHVua25vd24gYXMgU3RvcnlcblxuLy8gUmVhbC13b3JsZCBleGFtcGxlIC0gQUkgbW9kZWwgcGFyYW1ldGVyc1xuY29uc3QgQUlNb2RlbFBhcmFtZXRlcnNEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbdGVtcGVyYXR1cmUsIHNldFRlbXBlcmF0dXJlXSA9IHVzZVN0YXRlKDAuNylcbiAgY29uc3QgW21heFRva2Vucywgc2V0TWF4VG9rZW5zXSA9IHVzZVN0YXRlKDIwMDApXG4gIGNvbnN0IFt0b3BQLCBzZXRUb3BQXSA9IHVzZVN0YXRlKDAuOSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc1MDBweCcgfX0gY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGJnLXdoaXRlIHAtNlwiPlxuICAgICAgPGgzIGNsYXNzTmFtZT1cIm1iLTQgdGV4dC1sZyBmb250LXNlbWlib2xkXCI+TW9kZWwgQ29uZmlndXJhdGlvbjwvaDM+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNlwiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5UZW1wZXJhdHVyZTwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtc2VtaWJvbGRcIj57dGVtcGVyYXR1cmV9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTbGlkZXJcbiAgICAgICAgICAgIHZhbHVlPXt0ZW1wZXJhdHVyZX1cbiAgICAgICAgICAgIG1pbj17MH1cbiAgICAgICAgICAgIG1heD17Mn1cbiAgICAgICAgICAgIHN0ZXA9ezAuMX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXRUZW1wZXJhdHVyZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICBDb250cm9scyByYW5kb21uZXNzLiBMb3dlciBpcyBtb3JlIGZvY3VzZWQsIGhpZ2hlciBpcyBtb3JlIGNyZWF0aXZlLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+TWF4IFRva2VuczwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtc2VtaWJvbGRcIj57bWF4VG9rZW5zfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICB2YWx1ZT17bWF4VG9rZW5zfVxuICAgICAgICAgICAgbWluPXsxMDB9XG4gICAgICAgICAgICBtYXg9ezQwMDB9XG4gICAgICAgICAgICBzdGVwPXsxMDB9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0TWF4VG9rZW5zfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtMSB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgIE1heGltdW0gbGVuZ3RoIG9mIGdlbmVyYXRlZCByZXNwb25zZS5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTcwMFwiPlRvcCBQPC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZFwiPnt0b3BQfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICB2YWx1ZT17dG9wUH1cbiAgICAgICAgICAgIG1pbj17MH1cbiAgICAgICAgICAgIG1heD17MX1cbiAgICAgICAgICAgIHN0ZXA9ezAuMDV9XG4gICAgICAgICAgICBvbkNoYW5nZT17c2V0VG9wUH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAgICBOdWNsZXVzIHNhbXBsaW5nIHRocmVzaG9sZC5cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTYgcm91bmRlZC1sZyBiZy1ibHVlLTUwIHAtNCB0ZXh0LXhzIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8c3Ryb25nPlRlbXBlcmF0dXJlOjwvc3Ryb25nPlxuICAgICAgICAgIHsnICd9XG4gICAgICAgICAge3RlbXBlcmF0dXJlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8c3Ryb25nPk1heCBUb2tlbnM6PC9zdHJvbmc+XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7bWF4VG9rZW5zfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8c3Ryb25nPlRvcCBQOjwvc3Ryb25nPlxuICAgICAgICAgIHsnICd9XG4gICAgICAgICAge3RvcFB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IEFJTW9kZWxQYXJhbWV0ZXJzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8QUlNb2RlbFBhcmFtZXRlcnNEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIEltYWdlIHF1YWxpdHkgc2VsZWN0b3JcbmNvbnN0IEltYWdlUXVhbGl0eVNlbGVjdG9yRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3F1YWxpdHksIHNldFF1YWxpdHldID0gdXNlU3RhdGUoODApXG5cbiAgY29uc3QgZ2V0UXVhbGl0eUxhYmVsID0gKHE6IG51bWJlcikgPT4ge1xuICAgIGlmIChxIDwgNTApXG4gICAgICByZXR1cm4gJ0xvdydcbiAgICBpZiAocSA8IDcwKVxuICAgICAgcmV0dXJuICdNZWRpdW0nXG4gICAgaWYgKHEgPCA5MClcbiAgICAgIHJldHVybiAnSGlnaCdcbiAgICByZXR1cm4gJ01heGltdW0nXG4gIH1cblxuICBjb25zdCBlc3RpbWF0ZWRTaXplID0gTWF0aC5yb3VuZCgocXVhbGl0eSAvIDEwMCkgKiA1KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQ1MHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5JbWFnZSBFeHBvcnQgUXVhbGl0eTwvaDM+XG4gICAgICA8U2xpZGVyXG4gICAgICAgIHZhbHVlPXtxdWFsaXR5fVxuICAgICAgICBtaW49ezEwfVxuICAgICAgICBtYXg9ezEwMH1cbiAgICAgICAgc3RlcD17MTB9XG4gICAgICAgIG9uQ2hhbmdlPXtzZXRRdWFsaXR5fVxuICAgICAgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNjAwXCI+UXVhbGl0eTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkXCI+e2dldFF1YWxpdHlMYWJlbChxdWFsaXR5KX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgICAge3F1YWxpdHl9XG4gICAgICAgICAgICAlXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctZ3JheS01MCBwLTNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTYwMFwiPkZpbGUgU2l6ZTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkXCI+XG4gICAgICAgICAgICB+XG4gICAgICAgICAgICB7ZXN0aW1hdGVkU2l6ZX1cbiAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICBNQlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+RXN0aW1hdGVkPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IEltYWdlUXVhbGl0eVNlbGVjdG9yOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8SW1hZ2VRdWFsaXR5U2VsZWN0b3JEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7IGNvbnRyb2xzOiB7IGRpc2FibGU6IHRydWUgfSB9LFxufSBhcyB1bmtub3duIGFzIFN0b3J5XG5cbi8vIE11bHRpcGxlIHNsaWRlcnNcbmNvbnN0IE11bHRpcGxlU2xpZGVyc0RlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtyZWQsIHNldFJlZF0gPSB1c2VTdGF0ZSgxMjgpXG4gIGNvbnN0IFtncmVlbiwgc2V0R3JlZW5dID0gdXNlU3RhdGUoMTI4KVxuICBjb25zdCBbYmx1ZSwgc2V0Qmx1ZV0gPSB1c2VTdGF0ZSgxMjgpXG5cbiAgY29uc3QgcmdiQ29sb3IgPSBgcmdiKCR7cmVkfSwgJHtncmVlbn0sICR7Ymx1ZX0pYFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzQ1MHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5SR0IgQ29sb3IgUGlja2VyPC9oMz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1yZWQtNjAwXCI+UmVkPC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZFwiPntyZWR9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTbGlkZXIgdmFsdWU9e3JlZH0gbWluPXswfSBtYXg9ezI1NX0gc3RlcD17MX0gb25DaGFuZ2U9e3NldFJlZH0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmVlbi02MDBcIj5HcmVlbjwvbGFiZWw+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtc2VtaWJvbGRcIj57Z3JlZW59PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxTbGlkZXIgdmFsdWU9e2dyZWVufSBtaW49ezB9IG1heD17MjU1fSBzdGVwPXsxfSBvbkNoYW5nZT17c2V0R3JlZW59IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtYmx1ZS02MDBcIj5CbHVlPC9sYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZFwiPntibHVlfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2xpZGVyIHZhbHVlPXtibHVlfSBtaW49ezB9IG1heD17MjU1fSBzdGVwPXsxfSBvbkNoYW5nZT17c2V0Qmx1ZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImgtMjQgdy0yNCByb3VuZGVkLWxnIGJvcmRlci0yIGJvcmRlci1ncmF5LTMwMFwiXG4gICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiByZ2JDb2xvciB9fVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtcmlnaHRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTEgdGV4dC14cyB0ZXh0LWdyYXktNjAwXCI+Q29sb3IgVmFsdWU8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LXNtIGZvbnQtc2VtaWJvbGRcIj57cmdiQ29sb3J9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIGZvbnQtbW9ubyB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICNcbiAgICAgICAgICAgIHtyZWQudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyl9XG4gICAgICAgICAgICB7Z3JlZW4udG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsICcwJyl9XG4gICAgICAgICAgICB7Ymx1ZS50b1N0cmluZygxNikucGFkU3RhcnQoMiwgJzAnKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgTXVsdGlwbGVTbGlkZXJzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8TXVsdGlwbGVTbGlkZXJzRGVtbyAvPixcbiAgcGFyYW1ldGVyczogeyBjb250cm9sczogeyBkaXNhYmxlOiB0cnVlIH0gfSxcbn0gYXMgdW5rbm93biBhcyBTdG9yeVxuXG4vLyBJbnRlcmFjdGl2ZSBwbGF5Z3JvdW5kXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8U2xpZGVyRGVtbyB7Li4uYXJnc30gLz4sXG4gIGFyZ3M6IHtcbiAgICB2YWx1ZTogNTAsXG4gICAgbWluOiAwLFxuICAgIG1heDogMTAwLFxuICAgIHN0ZXA6IDEsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICB9LFxufVxuIl19