"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
const toast_1 = require("@/app/components/base/toast");
const tooltip_1 = require("@/app/components/base/tooltip");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const annotation_1 = require("@/service/annotation");
const AnnotationCtrlButton = ({ cached, query, answer, appId, messageId, onAdded, onEdit, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { plan, enableBilling } = (0, provider_context_1.useProviderContext)();
    const isAnnotationFull = (enableBilling && plan.usage.annotatedResponse >= plan.total.annotatedResponse);
    const { setShowAnnotationFullModal } = (0, modal_context_1.useModalContext)();
    const handleAdd = async () => {
        if (isAnnotationFull) {
            setShowAnnotationFullModal();
            return;
        }
        const res = await (0, annotation_1.addAnnotation)(appId, {
            message_id: messageId,
            question: query,
            answer,
        });
        toast_1.default.notify({
            message: t('api.actionSuccess', { ns: 'common' }),
            type: 'success',
        });
        onAdded(res.id, res.account?.name ?? '');
    };
    return (<>
      {cached && (<tooltip_1.default popupContent={t('feature.annotation.edit', { ns: 'appDebug' })}>
          <action_button_1.default onClick={onEdit}>
            <react_1.RiEditLine className="h-4 w-4"/>
          </action_button_1.default>
        </tooltip_1.default>)}
      {!cached && answer && (<tooltip_1.default popupContent={t('feature.annotation.add', { ns: 'appDebug' })}>
          <action_button_1.default onClick={handleAdd}>
            <react_1.RiFileEditLine className="h-4 w-4"/>
          </action_button_1.default>
        </tooltip_1.default>)}
    </>);
};
exports.default = React.memo(AnnotationCtrlButton);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbi1jdHJsLWJ1dHRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFubm90YXRpb24tY3RybC1idXR0b24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBRVosNENBR3lCO0FBQ3pCLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMsdUVBQThEO0FBQzlELHVEQUErQztBQUMvQywyREFBbUQ7QUFDbkQsMkRBQXlEO0FBQ3pELGlFQUErRDtBQUMvRCxxREFBb0Q7QUFZcEQsTUFBTSxvQkFBb0IsR0FBYyxDQUFDLEVBQ3ZDLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLEtBQUssRUFDTCxTQUFTLEVBQ1QsT0FBTyxFQUNQLE1BQU0sR0FDUCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFBLHFDQUFrQixHQUFFLENBQUE7SUFDcEQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtJQUN4RyxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxJQUFBLCtCQUFlLEdBQUUsQ0FBQTtJQUN4RCxNQUFNLFNBQVMsR0FBRyxLQUFLLElBQUksRUFBRTtRQUMzQixJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDckIsMEJBQTBCLEVBQUUsQ0FBQTtZQUM1QixPQUFNO1FBQ1IsQ0FBQztRQUNELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBQSwwQkFBYSxFQUFDLEtBQUssRUFBRTtZQUNyQyxVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU07U0FDUCxDQUFDLENBQUE7UUFDRixlQUFLLENBQUMsTUFBTSxDQUFDO1lBQ1gsT0FBTyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBVztZQUMzRCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFDLENBQUE7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUMxQyxDQUFDLENBQUE7SUFFRCxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsTUFBTSxJQUFJLENBQ1QsQ0FBQyxpQkFBTyxDQUNOLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBRS9EO1VBQUEsQ0FBQyx1QkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUM1QjtZQUFBLENBQUMsa0JBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUNqQztVQUFBLEVBQUUsdUJBQVksQ0FDaEI7UUFBQSxFQUFFLGlCQUFPLENBQUMsQ0FDWCxDQUNEO01BQUEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLElBQUksQ0FDcEIsQ0FBQyxpQkFBTyxDQUNOLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBRTlEO1VBQUEsQ0FBQyx1QkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUMvQjtZQUFBLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUNyQztVQUFBLEVBQUUsdUJBQVksQ0FDaEI7UUFBQSxFQUFFLGlCQUFPLENBQUMsQ0FDWCxDQUNIO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIFJpRWRpdExpbmUsXG4gIFJpRmlsZUVkaXRMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQWN0aW9uQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hY3Rpb24tYnV0dG9uJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBUb29sdGlwIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b29sdGlwJ1xuaW1wb3J0IHsgdXNlTW9kYWxDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IGFkZEFubm90YXRpb24gfSBmcm9tICdAL3NlcnZpY2UvYW5ub3RhdGlvbidcblxudHlwZSBQcm9wcyA9IHtcbiAgYXBwSWQ6IHN0cmluZ1xuICBtZXNzYWdlSWQ/OiBzdHJpbmdcbiAgY2FjaGVkOiBib29sZWFuXG4gIHF1ZXJ5OiBzdHJpbmdcbiAgYW5zd2VyOiBzdHJpbmdcbiAgb25BZGRlZDogKGFubm90YXRpb25JZDogc3RyaW5nLCBhdXRob3JOYW1lOiBzdHJpbmcpID0+IHZvaWRcbiAgb25FZGl0OiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IEFubm90YXRpb25DdHJsQnV0dG9uOiBGQzxQcm9wcz4gPSAoe1xuICBjYWNoZWQsXG4gIHF1ZXJ5LFxuICBhbnN3ZXIsXG4gIGFwcElkLFxuICBtZXNzYWdlSWQsXG4gIG9uQWRkZWQsXG4gIG9uRWRpdCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgcGxhbiwgZW5hYmxlQmlsbGluZyB9ID0gdXNlUHJvdmlkZXJDb250ZXh0KClcbiAgY29uc3QgaXNBbm5vdGF0aW9uRnVsbCA9IChlbmFibGVCaWxsaW5nICYmIHBsYW4udXNhZ2UuYW5ub3RhdGVkUmVzcG9uc2UgPj0gcGxhbi50b3RhbC5hbm5vdGF0ZWRSZXNwb25zZSlcbiAgY29uc3QgeyBzZXRTaG93QW5ub3RhdGlvbkZ1bGxNb2RhbCB9ID0gdXNlTW9kYWxDb250ZXh0KClcbiAgY29uc3QgaGFuZGxlQWRkID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChpc0Fubm90YXRpb25GdWxsKSB7XG4gICAgICBzZXRTaG93QW5ub3RhdGlvbkZ1bGxNb2RhbCgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcmVzID0gYXdhaXQgYWRkQW5ub3RhdGlvbihhcHBJZCwge1xuICAgICAgbWVzc2FnZV9pZDogbWVzc2FnZUlkLFxuICAgICAgcXVlc3Rpb246IHF1ZXJ5LFxuICAgICAgYW5zd2VyLFxuICAgIH0pXG4gICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgIG1lc3NhZ2U6IHQoJ2FwaS5hY3Rpb25TdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSkgYXMgc3RyaW5nLFxuICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgIH0pXG4gICAgb25BZGRlZChyZXMuaWQsIHJlcy5hY2NvdW50Py5uYW1lID8/ICcnKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2NhY2hlZCAmJiAoXG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgcG9wdXBDb250ZW50PXt0KCdmZWF0dXJlLmFubm90YXRpb24uZWRpdCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8QWN0aW9uQnV0dG9uIG9uQ2xpY2s9e29uRWRpdH0+XG4gICAgICAgICAgICA8UmlFZGl0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKX1cbiAgICAgIHshY2FjaGVkICYmIGFuc3dlciAmJiAoXG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgcG9wdXBDb250ZW50PXt0KCdmZWF0dXJlLmFubm90YXRpb24uYWRkJywgeyBuczogJ2FwcERlYnVnJyB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIDxBY3Rpb25CdXR0b24gb25DbGljaz17aGFuZGxlQWRkfT5cbiAgICAgICAgICAgIDxSaUZpbGVFZGl0TGluZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgKX1cbiAgICA8Lz5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhBbm5vdGF0aW9uQ3RybEJ1dHRvbilcbiJdfQ==