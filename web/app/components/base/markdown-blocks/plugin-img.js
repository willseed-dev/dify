"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginImg = void 0;
/**
 * @fileoverview Img component for rendering <img> tags in Markdown.
 * Extracted from the main markdown renderer for modularity.
 * Uses the ImageGallery component to display images.
 */
const React = require("react");
const react_1 = require("react");
const image_gallery_1 = require("@/app/components/base/image-gallery");
const use_plugins_1 = require("@/service/use-plugins");
const utils_1 = require("./utils");
const PluginImg = ({ src, pluginInfo }) => {
    const { pluginUniqueIdentifier, pluginId } = pluginInfo || {};
    const { data: assetData } = (0, use_plugins_1.usePluginReadmeAsset)({ plugin_unique_identifier: pluginUniqueIdentifier, file_name: src });
    const [blobUrl, setBlobUrl] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (!assetData) {
            setBlobUrl(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(assetData);
        setBlobUrl(objectUrl);
        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [assetData]);
    const imageUrl = (0, react_1.useMemo)(() => {
        if (blobUrl)
            return blobUrl;
        return (0, utils_1.getMarkdownImageURL)(src, pluginId);
    }, [blobUrl, pluginId, src]);
    return (<div className="markdown-img-wrapper">
      <image_gallery_1.default srcs={[imageUrl]}/>
    </div>);
};
exports.PluginImg = PluginImg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWltZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBsdWdpbi1pbWcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBOzs7O0dBSUc7QUFDSCwrQkFBOEI7QUFDOUIsaUNBQW9EO0FBQ3BELHVFQUE4RDtBQUM5RCx1REFBNEQ7QUFDNUQsbUNBQTZDO0FBT3RDLE1BQU0sU0FBUyxHQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUE7SUFDN0QsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGtDQUFvQixFQUFDLEVBQUUsd0JBQXdCLEVBQUUsc0JBQXNCLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFDdEgsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsR0FBRyxJQUFBLGdCQUFRLEdBQVUsQ0FBQTtJQUVoRCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2YsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3JCLE9BQU07UUFDUixDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNoRCxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFckIsT0FBTyxHQUFHLEVBQUU7WUFDVixHQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ2hDLENBQUMsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFZixNQUFNLFFBQVEsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDNUIsSUFBSSxPQUFPO1lBQ1QsT0FBTyxPQUFPLENBQUE7UUFFaEIsT0FBTyxJQUFBLDJCQUFtQixFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUMzQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFFNUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FDbkM7TUFBQSxDQUFDLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUNqQztJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQS9CWSxRQUFBLFNBQVMsYUErQnJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTaW1wbGVQbHVnaW5JbmZvIH0gZnJvbSAnLi4vbWFya2Rvd24vcmVhY3QtbWFya2Rvd24td3JhcHBlcidcbi8qKlxuICogQGZpbGVvdmVydmlldyBJbWcgY29tcG9uZW50IGZvciByZW5kZXJpbmcgPGltZz4gdGFncyBpbiBNYXJrZG93bi5cbiAqIEV4dHJhY3RlZCBmcm9tIHRoZSBtYWluIG1hcmtkb3duIHJlbmRlcmVyIGZvciBtb2R1bGFyaXR5LlxuICogVXNlcyB0aGUgSW1hZ2VHYWxsZXJ5IGNvbXBvbmVudCB0byBkaXNwbGF5IGltYWdlcy5cbiAqL1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgSW1hZ2VHYWxsZXJ5IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pbWFnZS1nYWxsZXJ5J1xuaW1wb3J0IHsgdXNlUGx1Z2luUmVhZG1lQXNzZXQgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBsdWdpbnMnXG5pbXBvcnQgeyBnZXRNYXJrZG93bkltYWdlVVJMIH0gZnJvbSAnLi91dGlscydcblxudHlwZSBJbWdQcm9wcyA9IHtcbiAgc3JjOiBzdHJpbmdcbiAgcGx1Z2luSW5mbz86IFNpbXBsZVBsdWdpbkluZm9cbn1cblxuZXhwb3J0IGNvbnN0IFBsdWdpbkltZzogUmVhY3QuRkM8SW1nUHJvcHM+ID0gKHsgc3JjLCBwbHVnaW5JbmZvIH0pID0+IHtcbiAgY29uc3QgeyBwbHVnaW5VbmlxdWVJZGVudGlmaWVyLCBwbHVnaW5JZCB9ID0gcGx1Z2luSW5mbyB8fCB7fVxuICBjb25zdCB7IGRhdGE6IGFzc2V0RGF0YSB9ID0gdXNlUGx1Z2luUmVhZG1lQXNzZXQoeyBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IHBsdWdpblVuaXF1ZUlkZW50aWZpZXIsIGZpbGVfbmFtZTogc3JjIH0pXG4gIGNvbnN0IFtibG9iVXJsLCBzZXRCbG9iVXJsXSA9IHVzZVN0YXRlPHN0cmluZz4oKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFhc3NldERhdGEpIHtcbiAgICAgIHNldEJsb2JVcmwodW5kZWZpbmVkKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0VXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChhc3NldERhdGEpXG4gICAgc2V0QmxvYlVybChvYmplY3RVcmwpXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTChvYmplY3RVcmwpXG4gICAgfVxuICB9LCBbYXNzZXREYXRhXSlcblxuICBjb25zdCBpbWFnZVVybCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChibG9iVXJsKVxuICAgICAgcmV0dXJuIGJsb2JVcmxcblxuICAgIHJldHVybiBnZXRNYXJrZG93bkltYWdlVVJMKHNyYywgcGx1Z2luSWQpXG4gIH0sIFtibG9iVXJsLCBwbHVnaW5JZCwgc3JjXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWFya2Rvd24taW1nLXdyYXBwZXJcIj5cbiAgICAgIDxJbWFnZUdhbGxlcnkgc3Jjcz17W2ltYWdlVXJsXX0gLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl19