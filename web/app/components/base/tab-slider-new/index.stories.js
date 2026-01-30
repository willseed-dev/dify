"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const _1 = require(".");
const OPTIONS = [
    { value: 'visual', text: 'Visual builder', icon: <react_1.RiSparklingFill className="mr-2 h-4 w-4 text-primary-500"/> },
    { value: 'code', text: 'Code', icon: <react_1.RiTerminalBoxLine className="mr-2 h-4 w-4 text-text-tertiary"/> },
];
const TabSliderNewDemo = ({ initialValue = 'visual', }) => {
    const [value, setValue] = (0, react_2.useState)(initialValue);
    return (<div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Pill tabs</div>
      <_1.default value={value} options={OPTIONS} onChange={setValue}/>
    </div>);
};
const meta = {
    title: 'Base/Navigation/TabSliderNew',
    component: TabSliderNewDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Rounded pill tabs suited for switching between editors. Icons illustrate mixed text/icon options.',
            },
        },
    },
    argTypes: {
        initialValue: {
            control: 'radio',
            options: OPTIONS.map(option => option.value),
        },
    },
    args: {
        initialValue: 'visual',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDRDQUFxRTtBQUNyRSxpQ0FBZ0M7QUFDaEMsd0JBQTRCO0FBRTVCLE1BQU0sT0FBTyxHQUFHO0lBQ2QsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsRUFBRyxFQUFFO0lBQ2hILEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsRUFBRyxFQUFFO0NBQ3pHLENBQUE7QUFFRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsRUFDeEIsWUFBWSxHQUFHLFFBQVEsR0FHeEIsRUFBRSxFQUFFO0lBQ0gsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsWUFBWSxDQUFDLENBQUE7SUFFaEQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5R0FBeUcsQ0FDdEg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FDdEY7TUFBQSxDQUFDLFVBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFDbkU7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw4QkFBOEI7SUFDckMsU0FBUyxFQUFFLGdCQUFnQjtJQUMzQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLG1HQUFtRzthQUMvRztTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixZQUFZLEVBQUU7WUFDWixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDN0M7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLFlBQVksRUFBRSxRQUFRO0tBQ3ZCO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ3FCLENBQUE7QUFFekMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgUmlTcGFya2xpbmdGaWxsLCBSaVRlcm1pbmFsQm94TGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRhYlNsaWRlck5ldyBmcm9tICcuJ1xuXG5jb25zdCBPUFRJT05TID0gW1xuICB7IHZhbHVlOiAndmlzdWFsJywgdGV4dDogJ1Zpc3VhbCBidWlsZGVyJywgaWNvbjogPFJpU3BhcmtsaW5nRmlsbCBjbGFzc05hbWU9XCJtci0yIGgtNCB3LTQgdGV4dC1wcmltYXJ5LTUwMFwiIC8+IH0sXG4gIHsgdmFsdWU6ICdjb2RlJywgdGV4dDogJ0NvZGUnLCBpY29uOiA8UmlUZXJtaW5hbEJveExpbmUgY2xhc3NOYW1lPVwibXItMiBoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+IH0sXG5dXG5cbmNvbnN0IFRhYlNsaWRlck5ld0RlbW8gPSAoe1xuICBpbml0aWFsVmFsdWUgPSAndmlzdWFsJyxcbn06IHtcbiAgaW5pdGlhbFZhbHVlPzogc3RyaW5nXG59KSA9PiB7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGUoaW5pdGlhbFZhbHVlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy1zbSBmbGV4LWNvbCBnYXAtNCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjE4ZW1dIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlBpbGwgdGFiczwvZGl2PlxuICAgICAgPFRhYlNsaWRlck5ldyB2YWx1ZT17dmFsdWV9IG9wdGlvbnM9e09QVElPTlN9IG9uQ2hhbmdlPXtzZXRWYWx1ZX0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvTmF2aWdhdGlvbi9UYWJTbGlkZXJOZXcnLFxuICBjb21wb25lbnQ6IFRhYlNsaWRlck5ld0RlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnUm91bmRlZCBwaWxsIHRhYnMgc3VpdGVkIGZvciBzd2l0Y2hpbmcgYmV0d2VlbiBlZGl0b3JzLiBJY29ucyBpbGx1c3RyYXRlIG1peGVkIHRleHQvaWNvbiBvcHRpb25zLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgaW5pdGlhbFZhbHVlOiB7XG4gICAgICBjb250cm9sOiAncmFkaW8nLFxuICAgICAgb3B0aW9uczogT1BUSU9OUy5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSksXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIGluaXRpYWxWYWx1ZTogJ3Zpc3VhbCcsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFRhYlNsaWRlck5ld0RlbW8+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge31cbiJdfQ==