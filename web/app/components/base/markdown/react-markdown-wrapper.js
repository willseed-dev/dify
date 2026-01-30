"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactMarkdownWrapper = void 0;
const dynamic_1 = require("next/dynamic");
const react_markdown_1 = require("react-markdown");
const rehype_katex_1 = require("rehype-katex");
const rehype_raw_1 = require("rehype-raw");
const remark_breaks_1 = require("remark-breaks");
const remark_gfm_1 = require("remark-gfm");
const remark_math_1 = require("remark-math");
const markdown_blocks_1 = require("@/app/components/base/markdown-blocks");
const config_1 = require("@/config");
const markdown_utils_1 = require("./markdown-utils");
const CodeBlock = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/base/markdown-blocks/code-block')), { ssr: false });
const ReactMarkdownWrapper = (props) => {
    const { customComponents, latexContent, pluginInfo } = props;
    return (<react_markdown_1.default remarkPlugins={[
            remark_gfm_1.default,
            [remark_math_1.default, { singleDollarTextMath: config_1.ENABLE_SINGLE_DOLLAR_LATEX }],
            remark_breaks_1.default,
        ]} rehypePlugins={[
            rehype_katex_1.default,
            rehype_raw_1.default,
            // The Rehype plug-in is used to remove the ref attribute of an element
            () => {
                return (tree) => {
                    const iterate = (node) => {
                        if (node.type === 'element' && node.properties?.ref)
                            delete node.properties.ref;
                        if (node.type === 'element' && !/^[a-z][a-z0-9]*$/i.test(node.tagName)) {
                            node.type = 'text';
                            node.value = `<${node.tagName}`;
                        }
                        if (node.children)
                            node.children.forEach(iterate);
                    };
                    tree.children.forEach(iterate);
                };
            },
        ]} urlTransform={markdown_utils_1.customUrlTransform} disallowedElements={['iframe', 'head', 'html', 'meta', 'link', 'style', 'body', ...(props.customDisallowedElements || [])]} components={{
            code: CodeBlock,
            img: (props) => pluginInfo ? <markdown_blocks_1.PluginImg {...props} pluginInfo={pluginInfo}/> : <markdown_blocks_1.Img {...props}/>,
            video: markdown_blocks_1.VideoBlock,
            audio: markdown_blocks_1.AudioBlock,
            a: markdown_blocks_1.Link,
            p: (props) => pluginInfo ? <markdown_blocks_1.PluginParagraph {...props} pluginInfo={pluginInfo}/> : <markdown_blocks_1.Paragraph {...props}/>,
            button: markdown_blocks_1.MarkdownButton,
            form: markdown_blocks_1.MarkdownForm,
            script: markdown_blocks_1.ScriptBlock,
            details: markdown_blocks_1.ThinkBlock,
            ...customComponents,
        }}>
      {/* Markdown detect has problem. */}
      {latexContent}
    </react_markdown_1.default>);
};
exports.ReactMarkdownWrapper = ReactMarkdownWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbWFya2Rvd24td3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlYWN0LW1hcmtkb3duLXdyYXBwZXIudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDBDQUFrQztBQUNsQyxtREFBMEM7QUFDMUMsK0NBQXNDO0FBQ3RDLDJDQUFrQztBQUNsQyxpREFBd0M7QUFDeEMsMkNBQWtDO0FBQ2xDLDZDQUFvQztBQUNwQywyRUFBdUw7QUFDdkwscUNBQXFEO0FBQ3JELHFEQUFxRDtBQUVyRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGlCQUFPLEVBQUMsR0FBRyxFQUFFLHNDQUFRLGtEQUFrRCxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQWNwRyxNQUFNLG9CQUFvQixHQUFrQyxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQzNFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBRTVELE9BQU8sQ0FDTCxDQUFDLHdCQUFhLENBQ1osYUFBYSxDQUFDLENBQUM7WUFDYixvQkFBUztZQUNULENBQUMscUJBQVUsRUFBRSxFQUFFLG9CQUFvQixFQUFFLG1DQUEwQixFQUFFLENBQUM7WUFDbEUsdUJBQVk7U0FDYixDQUFDLENBQ0YsYUFBYSxDQUFDLENBQUM7WUFDYixzQkFBVztZQUNYLG9CQUFnQjtZQUNoQix1RUFBdUU7WUFDdkUsR0FBRyxFQUFFO2dCQUNILE9BQU8sQ0FBQyxJQUFTLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTt3QkFDNUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUc7NEJBQ2pELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUE7d0JBRTVCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7NEJBQ3ZFLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFBOzRCQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO3dCQUNqQyxDQUFDO3dCQUVELElBQUksSUFBSSxDQUFDLFFBQVE7NEJBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7b0JBQ2xDLENBQUMsQ0FBQTtvQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDaEMsQ0FBQyxDQUFBO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FDRixZQUFZLENBQUMsQ0FBQyxtQ0FBa0IsQ0FBQyxDQUNqQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUMzSCxVQUFVLENBQUMsQ0FBQztZQUNWLElBQUksRUFBRSxTQUFTO1lBQ2YsR0FBRyxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsMkJBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHO1lBQ3ZHLEtBQUssRUFBRSw0QkFBVTtZQUNqQixLQUFLLEVBQUUsNEJBQVU7WUFDakIsQ0FBQyxFQUFFLHNCQUFJO1lBQ1AsQ0FBQyxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsaUNBQWUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsMkJBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHO1lBQ2pILE1BQU0sRUFBRSxnQ0FBYztZQUN0QixJQUFJLEVBQUUsOEJBQVk7WUFDbEIsTUFBTSxFQUFFLDZCQUFrQjtZQUMxQixPQUFPLEVBQUUsNEJBQVU7WUFDbkIsR0FBRyxnQkFBZ0I7U0FDcEIsQ0FBQyxDQUVGO01BQUEsQ0FBQyxrQ0FBa0MsQ0FDbkM7TUFBQSxDQUFDLFlBQVksQ0FDZjtJQUFBLEVBQUUsd0JBQWEsQ0FBQyxDQUNqQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBcERZLFFBQUEsb0JBQW9CLHdCQW9EaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgZHluYW1pYyBmcm9tICduZXh0L2R5bmFtaWMnXG5pbXBvcnQgUmVhY3RNYXJrZG93biBmcm9tICdyZWFjdC1tYXJrZG93bidcbmltcG9ydCBSZWh5cGVLYXRleCBmcm9tICdyZWh5cGUta2F0ZXgnXG5pbXBvcnQgUmVoeXBlUmF3IGZyb20gJ3JlaHlwZS1yYXcnXG5pbXBvcnQgUmVtYXJrQnJlYWtzIGZyb20gJ3JlbWFyay1icmVha3MnXG5pbXBvcnQgUmVtYXJrR2ZtIGZyb20gJ3JlbWFyay1nZm0nXG5pbXBvcnQgUmVtYXJrTWF0aCBmcm9tICdyZW1hcmstbWF0aCdcbmltcG9ydCB7IEF1ZGlvQmxvY2ssIEltZywgTGluaywgTWFya2Rvd25CdXR0b24sIE1hcmtkb3duRm9ybSwgUGFyYWdyYXBoLCBQbHVnaW5JbWcsIFBsdWdpblBhcmFncmFwaCwgU2NyaXB0QmxvY2ssIFRoaW5rQmxvY2ssIFZpZGVvQmxvY2sgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbWFya2Rvd24tYmxvY2tzJ1xuaW1wb3J0IHsgRU5BQkxFX1NJTkdMRV9ET0xMQVJfTEFURVggfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IGN1c3RvbVVybFRyYW5zZm9ybSB9IGZyb20gJy4vbWFya2Rvd24tdXRpbHMnXG5cbmNvbnN0IENvZGVCbG9jayA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbWFya2Rvd24tYmxvY2tzL2NvZGUtYmxvY2snKSwgeyBzc3I6IGZhbHNlIH0pXG5cbmV4cG9ydCB0eXBlIFNpbXBsZVBsdWdpbkluZm8gPSB7XG4gIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZ1xuICBwbHVnaW5JZDogc3RyaW5nXG59XG5cbmV4cG9ydCB0eXBlIFJlYWN0TWFya2Rvd25XcmFwcGVyUHJvcHMgPSB7XG4gIGxhdGV4Q29udGVudDogYW55XG4gIGN1c3RvbURpc2FsbG93ZWRFbGVtZW50cz86IHN0cmluZ1tdXG4gIGN1c3RvbUNvbXBvbmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWFjdC5Db21wb25lbnRUeXBlPGFueT4+XG4gIHBsdWdpbkluZm8/OiBTaW1wbGVQbHVnaW5JbmZvXG59XG5cbmV4cG9ydCBjb25zdCBSZWFjdE1hcmtkb3duV3JhcHBlcjogRkM8UmVhY3RNYXJrZG93bldyYXBwZXJQcm9wcz4gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBjdXN0b21Db21wb25lbnRzLCBsYXRleENvbnRlbnQsIHBsdWdpbkluZm8gfSA9IHByb3BzXG5cbiAgcmV0dXJuIChcbiAgICA8UmVhY3RNYXJrZG93blxuICAgICAgcmVtYXJrUGx1Z2lucz17W1xuICAgICAgICBSZW1hcmtHZm0sXG4gICAgICAgIFtSZW1hcmtNYXRoLCB7IHNpbmdsZURvbGxhclRleHRNYXRoOiBFTkFCTEVfU0lOR0xFX0RPTExBUl9MQVRFWCB9XSxcbiAgICAgICAgUmVtYXJrQnJlYWtzLFxuICAgICAgXX1cbiAgICAgIHJlaHlwZVBsdWdpbnM9e1tcbiAgICAgICAgUmVoeXBlS2F0ZXgsXG4gICAgICAgIFJlaHlwZVJhdyBhcyBhbnksXG4gICAgICAgIC8vIFRoZSBSZWh5cGUgcGx1Zy1pbiBpcyB1c2VkIHRvIHJlbW92ZSB0aGUgcmVmIGF0dHJpYnV0ZSBvZiBhbiBlbGVtZW50XG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKHRyZWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlcmF0ZSA9IChub2RlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2VsZW1lbnQnICYmIG5vZGUucHJvcGVydGllcz8ucmVmKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlLnByb3BlcnRpZXMucmVmXG5cbiAgICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2VsZW1lbnQnICYmICEvXlthLXpdW2EtejAtOV0qJC9pLnRlc3Qobm9kZS50YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9ICd0ZXh0J1xuICAgICAgICAgICAgICAgIG5vZGUudmFsdWUgPSBgPCR7bm9kZS50YWdOYW1lfWBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChub2RlLmNoaWxkcmVuKVxuICAgICAgICAgICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChpdGVyYXRlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKGl0ZXJhdGUpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgXX1cbiAgICAgIHVybFRyYW5zZm9ybT17Y3VzdG9tVXJsVHJhbnNmb3JtfVxuICAgICAgZGlzYWxsb3dlZEVsZW1lbnRzPXtbJ2lmcmFtZScsICdoZWFkJywgJ2h0bWwnLCAnbWV0YScsICdsaW5rJywgJ3N0eWxlJywgJ2JvZHknLCAuLi4ocHJvcHMuY3VzdG9tRGlzYWxsb3dlZEVsZW1lbnRzIHx8IFtdKV19XG4gICAgICBjb21wb25lbnRzPXt7XG4gICAgICAgIGNvZGU6IENvZGVCbG9jayxcbiAgICAgICAgaW1nOiAocHJvcHM6IGFueSkgPT4gcGx1Z2luSW5mbyA/IDxQbHVnaW5JbWcgey4uLnByb3BzfSBwbHVnaW5JbmZvPXtwbHVnaW5JbmZvfSAvPiA6IDxJbWcgey4uLnByb3BzfSAvPixcbiAgICAgICAgdmlkZW86IFZpZGVvQmxvY2ssXG4gICAgICAgIGF1ZGlvOiBBdWRpb0Jsb2NrLFxuICAgICAgICBhOiBMaW5rLFxuICAgICAgICBwOiAocHJvcHM6IGFueSkgPT4gcGx1Z2luSW5mbyA/IDxQbHVnaW5QYXJhZ3JhcGggey4uLnByb3BzfSBwbHVnaW5JbmZvPXtwbHVnaW5JbmZvfSAvPiA6IDxQYXJhZ3JhcGggey4uLnByb3BzfSAvPixcbiAgICAgICAgYnV0dG9uOiBNYXJrZG93bkJ1dHRvbixcbiAgICAgICAgZm9ybTogTWFya2Rvd25Gb3JtLFxuICAgICAgICBzY3JpcHQ6IFNjcmlwdEJsb2NrIGFzIGFueSxcbiAgICAgICAgZGV0YWlsczogVGhpbmtCbG9jayxcbiAgICAgICAgLi4uY3VzdG9tQ29tcG9uZW50cyxcbiAgICAgIH19XG4gICAgPlxuICAgICAgey8qIE1hcmtkb3duIGRldGVjdCBoYXMgcHJvYmxlbS4gKi99XG4gICAgICB7bGF0ZXhDb250ZW50fVxuICAgIDwvUmVhY3RNYXJrZG93bj5cbiAgKVxufVxuIl19