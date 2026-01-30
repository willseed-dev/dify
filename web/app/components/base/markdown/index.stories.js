"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compact = exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const SAMPLE_MD = `
# Product Update

Our agent now supports **tool-runs** with structured outputs.

## Highlights
- Faster reasoning with \\(O(n \\log n)\\) planning.
- Inline chain-of-thought:

<details data-think>
<summary>Thinking aloud</summary>

Check cached metrics first.  
If missing, fetch raw warehouse data.  
[ENDTHINKFLAG]

</details>

## Mermaid Diagram
\`\`\`mermaid
graph TD
  Start[User Message] --> Parse{Detect Intent?}
  Parse -->|Tool| ToolCall[Call search tool]
  Parse -->|Answer| Respond[Stream response]
  ToolCall --> Respond
\`\`\`

## Code Example
\`\`\`typescript
const reply = await client.chat({
  message: 'Summarise weekly metrics.',
  tags: ['analytics'],
})
\`\`\`
`;
const MarkdownDemo = ({ compact = false, }) => {
    const [content] = (0, react_1.useState)(SAMPLE_MD.trim());
    return (<div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Markdown renderer</div>
      <_1.Markdown content={content} className={compact ? '!text-sm leading-relaxed' : ''}/>
    </div>);
};
const meta = {
    title: 'Base/Data Display/Markdown',
    component: MarkdownDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Markdown wrapper with GitHub-flavored markdown, Mermaid diagrams, math, and custom blocks (details, audio, etc.).',
            },
        },
    },
    argTypes: {
        compact: { control: 'boolean' },
    },
    args: {
        compact: false,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.Compact = {
    args: {
        compact: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBNEI7QUFFNUIsTUFBTSxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FrQ2pCLENBQUE7QUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLEVBQ3BCLE9BQU8sR0FBRyxLQUFLLEdBR2hCLEVBQUUsRUFBRTtJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7SUFFNUMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwR0FBMEcsQ0FDdkg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUM5RjtNQUFBLENBQUMsV0FBUSxDQUNQLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFFekQ7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsU0FBUyxFQUFFLFlBQVk7SUFDdkIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxtSEFBbUg7YUFDL0g7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtLQUNoQztJQUNELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxLQUFLO0tBQ2Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDaUIsQ0FBQTtBQUVyQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVSxFQUFFLENBQUE7QUFFdEIsUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLElBQUk7S0FDZDtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgTWFya2Rvd24gfSBmcm9tICcuJ1xuXG5jb25zdCBTQU1QTEVfTUQgPSBgXG4jIFByb2R1Y3QgVXBkYXRlXG5cbk91ciBhZ2VudCBub3cgc3VwcG9ydHMgKip0b29sLXJ1bnMqKiB3aXRoIHN0cnVjdHVyZWQgb3V0cHV0cy5cblxuIyMgSGlnaGxpZ2h0c1xuLSBGYXN0ZXIgcmVhc29uaW5nIHdpdGggXFxcXChPKG4gXFxcXGxvZyBuKVxcXFwpIHBsYW5uaW5nLlxuLSBJbmxpbmUgY2hhaW4tb2YtdGhvdWdodDpcblxuPGRldGFpbHMgZGF0YS10aGluaz5cbjxzdW1tYXJ5PlRoaW5raW5nIGFsb3VkPC9zdW1tYXJ5PlxuXG5DaGVjayBjYWNoZWQgbWV0cmljcyBmaXJzdC4gIFxuSWYgbWlzc2luZywgZmV0Y2ggcmF3IHdhcmVob3VzZSBkYXRhLiAgXG5bRU5EVEhJTktGTEFHXVxuXG48L2RldGFpbHM+XG5cbiMjIE1lcm1haWQgRGlhZ3JhbVxuXFxgXFxgXFxgbWVybWFpZFxuZ3JhcGggVERcbiAgU3RhcnRbVXNlciBNZXNzYWdlXSAtLT4gUGFyc2V7RGV0ZWN0IEludGVudD99XG4gIFBhcnNlIC0tPnxUb29sfCBUb29sQ2FsbFtDYWxsIHNlYXJjaCB0b29sXVxuICBQYXJzZSAtLT58QW5zd2VyfCBSZXNwb25kW1N0cmVhbSByZXNwb25zZV1cbiAgVG9vbENhbGwgLS0+IFJlc3BvbmRcblxcYFxcYFxcYFxuXG4jIyBDb2RlIEV4YW1wbGVcblxcYFxcYFxcYHR5cGVzY3JpcHRcbmNvbnN0IHJlcGx5ID0gYXdhaXQgY2xpZW50LmNoYXQoe1xuICBtZXNzYWdlOiAnU3VtbWFyaXNlIHdlZWtseSBtZXRyaWNzLicsXG4gIHRhZ3M6IFsnYW5hbHl0aWNzJ10sXG59KVxuXFxgXFxgXFxgXG5gXG5cbmNvbnN0IE1hcmtkb3duRGVtbyA9ICh7XG4gIGNvbXBhY3QgPSBmYWxzZSxcbn06IHtcbiAgY29tcGFjdD86IGJvb2xlYW5cbn0pID0+IHtcbiAgY29uc3QgW2NvbnRlbnRdID0gdXNlU3RhdGUoU0FNUExFX01ELnRyaW0oKSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWF4LXctM3hsIGZsZXgtY29sIGdhcC00IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+TWFya2Rvd24gcmVuZGVyZXI8L2Rpdj5cbiAgICAgIDxNYXJrZG93blxuICAgICAgICBjb250ZW50PXtjb250ZW50fVxuICAgICAgICBjbGFzc05hbWU9e2NvbXBhY3QgPyAnIXRleHQtc20gbGVhZGluZy1yZWxheGVkJyA6ICcnfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBEaXNwbGF5L01hcmtkb3duJyxcbiAgY29tcG9uZW50OiBNYXJrZG93bkRlbW8sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnTWFya2Rvd24gd3JhcHBlciB3aXRoIEdpdEh1Yi1mbGF2b3JlZCBtYXJrZG93biwgTWVybWFpZCBkaWFncmFtcywgbWF0aCwgYW5kIGN1c3RvbSBibG9ja3MgKGRldGFpbHMsIGF1ZGlvLCBldGMuKS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIGNvbXBhY3Q6IHsgY29udHJvbDogJ2Jvb2xlYW4nIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBjb21wYWN0OiBmYWxzZSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTWFya2Rvd25EZW1vPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHt9XG5cbmV4cG9ydCBjb25zdCBDb21wYWN0OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGNvbXBhY3Q6IHRydWUsXG4gIH0sXG59XG4iXX0=