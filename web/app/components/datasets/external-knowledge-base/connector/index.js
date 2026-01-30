"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const React = require("react");
const react_1 = require("react");
const amplitude_1 = require("@/app/components/base/amplitude");
const toast_1 = require("@/app/components/base/toast");
const create_1 = require("@/app/components/datasets/external-knowledge-base/create");
const datasets_1 = require("@/service/datasets");
const ExternalKnowledgeBaseConnector = () => {
    const { notify } = (0, toast_1.useToastContext)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleConnect = async (formValue) => {
        try {
            setLoading(true);
            const result = await (0, datasets_1.createExternalKnowledgeBase)({ body: formValue });
            if (result && result.id) {
                notify({ type: 'success', message: 'External Knowledge Base Connected Successfully' });
                (0, amplitude_1.trackEvent)('create_external_knowledge_base', {
                    provider: formValue.provider,
                    name: formValue.name,
                });
                router.back();
            }
            else {
                throw new Error('Failed to create external knowledge base');
            }
        }
        catch (error) {
            console.error('Error creating external knowledge base:', error);
            notify({ type: 'error', message: 'Failed to connect External Knowledge Base' });
        }
        setLoading(false);
    };
    return (<create_1.default onConnect={handleConnect} loading={loading}/>);
};
exports.default = ExternalKnowledgeBaseConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWixnREFBMkM7QUFDM0MsK0JBQThCO0FBQzlCLGlDQUFnQztBQUNoQywrREFBNEQ7QUFDNUQsdURBQTZEO0FBQzdELHFGQUFrRztBQUNsRyxpREFBZ0U7QUFFaEUsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLEVBQUU7SUFDMUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWUsR0FBRSxDQUFBO0lBQ3BDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFBO0lBRTFCLE1BQU0sYUFBYSxHQUFHLEtBQUssRUFBRSxTQUFpQyxFQUFFLEVBQUU7UUFDaEUsSUFBSSxDQUFDO1lBQ0gsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBQSxzQ0FBMkIsRUFBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBQ3JFLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsZ0RBQWdELEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixJQUFBLHNCQUFVLEVBQUMsZ0NBQWdDLEVBQUU7b0JBQzNDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUTtvQkFDNUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO2lCQUNyQixDQUFDLENBQUE7Z0JBQ0YsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ2YsQ0FBQztpQkFDSSxDQUFDO2dCQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQTtZQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQy9ELE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLDJDQUEyQyxFQUFFLENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBQ0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQTtJQUNELE9BQU8sQ0FDTCxDQUFDLGdCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFHLENBQzVFLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSw4QkFBOEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgdHlwZSB7IENyZWF0ZUtub3dsZWRnZUJhc2VSZXEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2V4dGVybmFsLWtub3dsZWRnZS1iYXNlL2NyZWF0ZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB0cmFja0V2ZW50IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZSdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBFeHRlcm5hbEtub3dsZWRnZUJhc2VDcmVhdGUgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9leHRlcm5hbC1rbm93bGVkZ2UtYmFzZS9jcmVhdGUnXG5pbXBvcnQgeyBjcmVhdGVFeHRlcm5hbEtub3dsZWRnZUJhc2UgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5cbmNvbnN0IEV4dGVybmFsS25vd2xlZGdlQmFzZUNvbm5lY3RvciA9ICgpID0+IHtcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZVRvYXN0Q29udGV4dCgpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuXG4gIGNvbnN0IGhhbmRsZUNvbm5lY3QgPSBhc3luYyAoZm9ybVZhbHVlOiBDcmVhdGVLbm93bGVkZ2VCYXNlUmVxKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNyZWF0ZUV4dGVybmFsS25vd2xlZGdlQmFzZSh7IGJvZHk6IGZvcm1WYWx1ZSB9KVxuICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaWQpIHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnRXh0ZXJuYWwgS25vd2xlZGdlIEJhc2UgQ29ubmVjdGVkIFN1Y2Nlc3NmdWxseScgfSlcbiAgICAgICAgdHJhY2tFdmVudCgnY3JlYXRlX2V4dGVybmFsX2tub3dsZWRnZV9iYXNlJywge1xuICAgICAgICAgIHByb3ZpZGVyOiBmb3JtVmFsdWUucHJvdmlkZXIsXG4gICAgICAgICAgbmFtZTogZm9ybVZhbHVlLm5hbWUsXG4gICAgICAgIH0pXG4gICAgICAgIHJvdXRlci5iYWNrKClcbiAgICAgIH1cbiAgICAgIGVsc2UgeyB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgZXh0ZXJuYWwga25vd2xlZGdlIGJhc2UnKSB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgZXh0ZXJuYWwga25vd2xlZGdlIGJhc2U6JywgZXJyb3IpXG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiAnRmFpbGVkIHRvIGNvbm5lY3QgRXh0ZXJuYWwgS25vd2xlZGdlIEJhc2UnIH0pXG4gICAgfVxuICAgIHNldExvYWRpbmcoZmFsc2UpXG4gIH1cbiAgcmV0dXJuIChcbiAgICA8RXh0ZXJuYWxLbm93bGVkZ2VCYXNlQ3JlYXRlIG9uQ29ubmVjdD17aGFuZGxlQ29ubmVjdH0gbG9hZGluZz17bG9hZGluZ30gLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHRlcm5hbEtub3dsZWRnZUJhc2VDb25uZWN0b3JcbiJdfQ==