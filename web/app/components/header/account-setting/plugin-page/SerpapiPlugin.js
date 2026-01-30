"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = require("next/image");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const app_context_1 = require("@/context/app-context");
const serpapi_png_1 = require("../../assets/serpapi.png");
const key_validator_1 = require("../key-validator");
const utils_1 = require("./utils");
const SerpapiPlugin = ({ plugin, onUpdate, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isCurrentWorkspaceManager } = (0, app_context_1.useAppContext)();
    const { notify } = (0, toast_1.useToastContext)();
    const forms = [{
            key: 'api_key',
            title: t('plugin.serpapi.apiKey', { ns: 'common' }),
            placeholder: t('plugin.serpapi.apiKeyPlaceholder', { ns: 'common' }),
            value: plugin.credentials?.api_key,
            validate: {
                before: (v) => {
                    if (v?.api_key)
                        return true;
                },
                run: async (v) => {
                    return (0, utils_1.validatePluginKey)('serpapi', {
                        credentials: {
                            api_key: v?.api_key,
                        },
                    });
                },
            },
            handleFocus: (v, dispatch) => {
                if (v.api_key === plugin.credentials?.api_key)
                    dispatch({ ...v, api_key: '' });
            },
        }];
    const handleSave = async (v) => {
        if (!v?.api_key || v?.api_key === plugin.credentials?.api_key)
            return;
        const res = await (0, utils_1.updatePluginKey)('serpapi', {
            credentials: {
                api_key: v?.api_key,
            },
        });
        if (res.status === 'success') {
            notify({ type: 'success', message: t('actionMsg.modifiedSuccessfully', { ns: 'common' }) });
            onUpdate();
            return true;
        }
    };
    return (<key_validator_1.default type="serpapi" title={<image_1.default alt="serpapi logo" src={serpapi_png_1.default} width={64}/>} status={plugin.credentials?.api_key ? 'success' : 'add'} forms={forms} keyFrom={{
            text: t('plugin.serpapi.keyFrom', { ns: 'common' }),
            link: 'https://serpapi.com/manage-api-key',
        }} onSave={handleSave} disabled={!isCurrentWorkspaceManager}/>);
};
exports.default = SerpapiPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VycGFwaVBsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlNlcnBhcGlQbHVnaW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsc0NBQThCO0FBQzlCLGlEQUE4QztBQUM5Qyx1REFBNkQ7QUFDN0QsdURBQXFEO0FBQ3JELDBEQUFrRDtBQUNsRCxvREFBMkM7QUFDM0MsbUNBQTREO0FBTTVELE1BQU0sYUFBYSxHQUFHLENBQUMsRUFDckIsTUFBTSxFQUNOLFFBQVEsR0FDVyxFQUFFLEVBQUU7SUFDdkIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSx5QkFBeUIsRUFBRSxHQUFHLElBQUEsMkJBQWEsR0FBRSxDQUFBO0lBQ3JELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEdBQUUsQ0FBQTtJQUVwQyxNQUFNLEtBQUssR0FBVyxDQUFDO1lBQ3JCLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUNuRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ3BFLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU87WUFDbEMsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNaLElBQUksQ0FBQyxFQUFFLE9BQU87d0JBQ1osT0FBTyxJQUFJLENBQUE7Z0JBQ2YsQ0FBQztnQkFDRCxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNmLE9BQU8sSUFBQSx5QkFBaUIsRUFBQyxTQUFTLEVBQUU7d0JBQ2xDLFdBQVcsRUFBRTs0QkFDWCxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU87eUJBQ3BCO3FCQUNGLENBQUMsQ0FBQTtnQkFDSixDQUFDO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU87b0JBQzNDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ25DLENBQUM7U0FDRixDQUFDLENBQUE7SUFFRixNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQUUsQ0FBZ0IsRUFBRSxFQUFFO1FBQzVDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPO1lBQzNELE9BQU07UUFFUixNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsdUJBQWUsRUFBQyxTQUFTLEVBQUU7WUFDM0MsV0FBVyxFQUFFO2dCQUNYLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTzthQUNwQjtTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDM0YsUUFBUSxFQUFFLENBQUE7WUFDVixPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxPQUFPLENBQ0wsQ0FBQyx1QkFBWSxDQUNYLElBQUksQ0FBQyxTQUFTLENBQ2QsS0FBSyxDQUFDLENBQUMsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUcsQ0FBQyxDQUNqRSxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDeEQsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2IsT0FBTyxDQUFDLENBQUM7WUFDUCxJQUFJLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO1lBQ25ELElBQUksRUFBRSxvQ0FBb0M7U0FDM0MsQ0FBQyxDQUNGLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNuQixRQUFRLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEVBQ3JDLENBQ0gsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGFBQWEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRm9ybSwgVmFsaWRhdGVWYWx1ZSB9IGZyb20gJy4uL2tleS12YWxpZGF0b3IvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5Qcm92aWRlciB9IGZyb20gJ0AvbW9kZWxzL2NvbW1vbidcbmltcG9ydCBJbWFnZSBmcm9tICduZXh0L2ltYWdlJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCBTZXJwYXBpTG9nbyBmcm9tICcuLi8uLi9hc3NldHMvc2VycGFwaS5wbmcnXG5pbXBvcnQgS2V5VmFsaWRhdG9yIGZyb20gJy4uL2tleS12YWxpZGF0b3InXG5pbXBvcnQgeyB1cGRhdGVQbHVnaW5LZXksIHZhbGlkYXRlUGx1Z2luS2V5IH0gZnJvbSAnLi91dGlscydcblxudHlwZSBTZXJwYXBpUGx1Z2luUHJvcHMgPSB7XG4gIHBsdWdpbjogUGx1Z2luUHJvdmlkZXJcbiAgb25VcGRhdGU6ICgpID0+IHZvaWRcbn1cbmNvbnN0IFNlcnBhcGlQbHVnaW4gPSAoe1xuICBwbHVnaW4sXG4gIG9uVXBkYXRlLFxufTogU2VycGFwaVBsdWdpblByb3BzKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcblxuICBjb25zdCBmb3JtczogRm9ybVtdID0gW3tcbiAgICBrZXk6ICdhcGlfa2V5JyxcbiAgICB0aXRsZTogdCgncGx1Z2luLnNlcnBhcGkuYXBpS2V5JywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgcGxhY2Vob2xkZXI6IHQoJ3BsdWdpbi5zZXJwYXBpLmFwaUtleVBsYWNlaG9sZGVyJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgdmFsdWU6IHBsdWdpbi5jcmVkZW50aWFscz8uYXBpX2tleSxcbiAgICB2YWxpZGF0ZToge1xuICAgICAgYmVmb3JlOiAodikgPT4ge1xuICAgICAgICBpZiAodj8uYXBpX2tleSlcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSxcbiAgICAgIHJ1bjogYXN5bmMgKHYpID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlUGx1Z2luS2V5KCdzZXJwYXBpJywge1xuICAgICAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgICAgICBhcGlfa2V5OiB2Py5hcGlfa2V5LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0sXG4gICAgaGFuZGxlRm9jdXM6ICh2LCBkaXNwYXRjaCkgPT4ge1xuICAgICAgaWYgKHYuYXBpX2tleSA9PT0gcGx1Z2luLmNyZWRlbnRpYWxzPy5hcGlfa2V5KVxuICAgICAgICBkaXNwYXRjaCh7IC4uLnYsIGFwaV9rZXk6ICcnIH0pXG4gICAgfSxcbiAgfV1cblxuICBjb25zdCBoYW5kbGVTYXZlID0gYXN5bmMgKHY6IFZhbGlkYXRlVmFsdWUpID0+IHtcbiAgICBpZiAoIXY/LmFwaV9rZXkgfHwgdj8uYXBpX2tleSA9PT0gcGx1Z2luLmNyZWRlbnRpYWxzPy5hcGlfa2V5KVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCByZXMgPSBhd2FpdCB1cGRhdGVQbHVnaW5LZXkoJ3NlcnBhcGknLCB7XG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBhcGlfa2V5OiB2Py5hcGlfa2V5LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgaWYgKHJlcy5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiB0KCdhY3Rpb25Nc2cubW9kaWZpZWRTdWNjZXNzZnVsbHknLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgb25VcGRhdGUoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxLZXlWYWxpZGF0b3JcbiAgICAgIHR5cGU9XCJzZXJwYXBpXCJcbiAgICAgIHRpdGxlPXs8SW1hZ2UgYWx0PVwic2VycGFwaSBsb2dvXCIgc3JjPXtTZXJwYXBpTG9nb30gd2lkdGg9ezY0fSAvPn1cbiAgICAgIHN0YXR1cz17cGx1Z2luLmNyZWRlbnRpYWxzPy5hcGlfa2V5ID8gJ3N1Y2Nlc3MnIDogJ2FkZCd9XG4gICAgICBmb3Jtcz17Zm9ybXN9XG4gICAgICBrZXlGcm9tPXt7XG4gICAgICAgIHRleHQ6IHQoJ3BsdWdpbi5zZXJwYXBpLmtleUZyb20nLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vc2VycGFwaS5jb20vbWFuYWdlLWFwaS1rZXknLFxuICAgICAgfX1cbiAgICAgIG9uU2F2ZT17aGFuZGxlU2F2ZX1cbiAgICAgIGRpc2FibGVkPXshaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcn1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnBhcGlQbHVnaW5cbiJdfQ==