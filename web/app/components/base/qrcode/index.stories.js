"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoLink = exports.Playground = void 0;
const _1 = require(".");
const QRDemo = ({ content = 'https://dify.ai', }) => {
    return (<div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Share QR</p>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Generated URL:</span>
        <code className="rounded-md bg-background-default px-2 py-1 text-[11px]">{content}</code>
      </div>
      <_1.default content={content}/>
    </div>);
};
const meta = {
    title: 'Base/Data Display/QRCode',
    component: QRDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Toggleable QR code generator for sharing app URLs. Clicking the trigger reveals the code with a download CTA.',
            },
        },
    },
    argTypes: {
        content: {
            control: 'text',
        },
    },
    args: {
        content: 'https://dify.ai',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.DemoLink = {
    args: {
        content: 'https://dify.ai/docs',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUEyQjtBQUUzQixNQUFNLE1BQU0sR0FBRyxDQUFDLEVBQ2QsT0FBTyxHQUFHLGlCQUFpQixHQUc1QixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlHQUF5RyxDQUN0SDtNQUFBLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUNqRjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxREFBcUQsQ0FDbEU7UUFBQSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUMxQjtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FDMUY7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsVUFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUNoQztJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDBCQUEwQjtJQUNqQyxTQUFTLEVBQUUsTUFBTTtJQUNqQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLCtHQUErRzthQUMzSDtTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUUsTUFBTTtTQUNoQjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLGlCQUFpQjtLQUMzQjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNXLENBQUE7QUFFL0Isa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBO0FBRXRCLFFBQUEsUUFBUSxHQUFVO0lBQzdCLElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxzQkFBc0I7S0FDaEM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IFNoYXJlUVJDb2RlIGZyb20gJy4nXG5cbmNvbnN0IFFSRGVtbyA9ICh7XG4gIGNvbnRlbnQgPSAnaHR0cHM6Ly9kaWZ5LmFpJyxcbn06IHtcbiAgY29udGVudD86IHN0cmluZ1xufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctc20gZmxleC1jb2wgZ2FwLTMgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+U2hhcmUgUVI8L3A+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICA8c3Bhbj5HZW5lcmF0ZWQgVVJMOjwvc3Bhbj5cbiAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQgcHgtMiBweS0xIHRleHQtWzExcHhdXCI+e2NvbnRlbnR9PC9jb2RlPlxuICAgICAgPC9kaXY+XG4gICAgICA8U2hhcmVRUkNvZGUgY29udGVudD17Y29udGVudH0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBEaXNwbGF5L1FSQ29kZScsXG4gIGNvbXBvbmVudDogUVJEZW1vLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1RvZ2dsZWFibGUgUVIgY29kZSBnZW5lcmF0b3IgZm9yIHNoYXJpbmcgYXBwIFVSTHMuIENsaWNraW5nIHRoZSB0cmlnZ2VyIHJldmVhbHMgdGhlIGNvZGUgd2l0aCBhIGRvd25sb2FkIENUQS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIGNvbnRlbnQ6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgY29udGVudDogJ2h0dHBzOi8vZGlmeS5haScsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFFSRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgRGVtb0xpbms6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgY29udGVudDogJ2h0dHBzOi8vZGlmeS5haS9kb2NzJyxcbiAgfSxcbn1cbiJdfQ==