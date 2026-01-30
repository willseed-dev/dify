"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mermaid = exports.Playground = void 0;
const code_block_1 = require("./code-block");
const SAMPLE_CODE = `const greet = (name: string) => {
  return \`Hello, \${name}\`
}

console.log(greet('Dify'))`;
const CodeBlockDemo = ({ language = 'typescript', }) => {
    return (<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Code block</div>
      <code_block_1.default className={`language-${language}`}>
        {SAMPLE_CODE}
      </code_block_1.default>
    </div>);
};
const meta = {
    title: 'Base/Data Display/CodeBlock',
    component: CodeBlockDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Syntax highlighted code block with copy button and SVG toggle support.',
            },
        },
    },
    argTypes: {
        language: {
            control: 'radio',
            options: ['typescript', 'json', 'mermaid'],
        },
    },
    args: {
        language: 'typescript',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.Mermaid = {
    args: {
        language: 'mermaid',
    },
    render: ({ language }) => (<div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <code_block_1.default className={`language-${language}`}>
        {`graph TD
  Start --> Decision{User message?}
  Decision -->|Tool| ToolCall[Call web search]
  Decision -->|Respond| Answer[Compose draft]
`}
      </code_block_1.default>
    </div>),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS1ibG9jay5zdG9yaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZS1ibG9jay5zdG9yaWVzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2Q0FBb0M7QUFFcEMsTUFBTSxXQUFXLEdBQUc7Ozs7MkJBSU8sQ0FBQTtBQUUzQixNQUFNLGFBQWEsR0FBRyxDQUFDLEVBQ3JCLFFBQVEsR0FBRyxZQUFZLEdBR3hCLEVBQUUsRUFBRTtJQUNILE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUdBQXlHLENBQ3RIO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQ3ZGO01BQUEsQ0FBQyxvQkFBUyxDQUNSLFNBQVMsQ0FBQyxDQUFDLFlBQVksUUFBUSxFQUFFLENBQUMsQ0FFbEM7UUFBQSxDQUFDLFdBQVcsQ0FDZDtNQUFBLEVBQUUsb0JBQVMsQ0FDYjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDZCQUE2QjtJQUNwQyxTQUFTLEVBQUUsYUFBYTtJQUN4QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHdFQUF3RTthQUNwRjtTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQztTQUMzQztLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFlBQVk7S0FDdkI7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDa0IsQ0FBQTtBQUV0QyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUE7QUFFdEIsUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLFNBQVM7S0FDcEI7SUFDRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUN4QixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUdBQXlHLENBQ3RIO01BQUEsQ0FBQyxvQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksUUFBUSxFQUFFLENBQUMsQ0FDM0M7UUFBQSxDQUFDOzs7O0NBSVIsQ0FDSztNQUFBLEVBQUUsb0JBQVMsQ0FDYjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IENvZGVCbG9jayBmcm9tICcuL2NvZGUtYmxvY2snXG5cbmNvbnN0IFNBTVBMRV9DT0RFID0gYGNvbnN0IGdyZWV0ID0gKG5hbWU6IHN0cmluZykgPT4ge1xuICByZXR1cm4gXFxgSGVsbG8sIFxcJHtuYW1lfVxcYFxufVxuXG5jb25zb2xlLmxvZyhncmVldCgnRGlmeScpKWBcblxuY29uc3QgQ29kZUJsb2NrRGVtbyA9ICh7XG4gIGxhbmd1YWdlID0gJ3R5cGVzY3JpcHQnLFxufToge1xuICBsYW5ndWFnZT86IHN0cmluZ1xufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXcteGwgZmxleC1jb2wgZ2FwLTQgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5Db2RlIGJsb2NrPC9kaXY+XG4gICAgICA8Q29kZUJsb2NrXG4gICAgICAgIGNsYXNzTmFtZT17YGxhbmd1YWdlLSR7bGFuZ3VhZ2V9YH1cbiAgICAgID5cbiAgICAgICAge1NBTVBMRV9DT0RFfVxuICAgICAgPC9Db2RlQmxvY2s+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRGlzcGxheS9Db2RlQmxvY2snLFxuICBjb21wb25lbnQ6IENvZGVCbG9ja0RlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnU3ludGF4IGhpZ2hsaWdodGVkIGNvZGUgYmxvY2sgd2l0aCBjb3B5IGJ1dHRvbiBhbmQgU1ZHIHRvZ2dsZSBzdXBwb3J0LicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgbGFuZ3VhZ2U6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBbJ3R5cGVzY3JpcHQnLCAnanNvbicsICdtZXJtYWlkJ10sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIGxhbmd1YWdlOiAndHlwZXNjcmlwdCcsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIENvZGVCbG9ja0RlbW8+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge31cblxuZXhwb3J0IGNvbnN0IE1lcm1haWQ6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgbGFuZ3VhZ2U6ICdtZXJtYWlkJyxcbiAgfSxcbiAgcmVuZGVyOiAoeyBsYW5ndWFnZSB9KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy14bCBmbGV4LWNvbCBnYXAtNCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8Q29kZUJsb2NrIGNsYXNzTmFtZT17YGxhbmd1YWdlLSR7bGFuZ3VhZ2V9YH0+XG4gICAgICAgIHtgZ3JhcGggVERcbiAgU3RhcnQgLS0+IERlY2lzaW9ue1VzZXIgbWVzc2FnZT99XG4gIERlY2lzaW9uIC0tPnxUb29sfCBUb29sQ2FsbFtDYWxsIHdlYiBzZWFyY2hdXG4gIERlY2lzaW9uIC0tPnxSZXNwb25kfCBBbnN3ZXJbQ29tcG9zZSBkcmFmdF1cbmB9XG4gICAgICA8L0NvZGVCbG9jaz5cbiAgICA8L2Rpdj5cbiAgKSxcbn1cbiJdfQ==