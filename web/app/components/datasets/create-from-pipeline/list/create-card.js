"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const toast_1 = require("@/app/components/base/toast");
const use_create_dataset_1 = require("@/service/knowledge/use-create-dataset");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const CreateCard = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { push } = (0, navigation_1.useRouter)();
    const { mutateAsync: createEmptyDataset } = (0, use_create_dataset_1.useCreatePipelineDataset)();
    const invalidDatasetList = (0, use_dataset_1.useInvalidDatasetList)();
    const handleCreate = (0, react_2.useCallback)(async () => {
        await createEmptyDataset(undefined, {
            onSuccess: (data) => {
                if (data) {
                    const { id } = data;
                    toast_1.default.notify({
                        type: 'success',
                        message: t('creation.successTip', { ns: 'datasetPipeline' }),
                    });
                    invalidDatasetList();
                    (0, amplitude_1.trackEvent)('create_datasets_from_scratch', {
                        dataset_id: id,
                    });
                    push(`/datasets/${id}/pipeline`);
                }
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('creation.errorTip', { ns: 'datasetPipeline' }),
                });
            },
        });
    }, [createEmptyDataset, push, invalidDatasetList, t]);
    return (<div className="group relative flex h-[132px] cursor-pointer flex-col rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-on-panel-item-bg pb-3 shadow-xs shadow-shadow-shadow-3" onClick={handleCreate}>
      <div className="flex items-center gap-x-3 p-4 pb-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-dashed border-divider-regular bg-background-section group-hover:border-state-accent-hover-alt group-hover:bg-state-accent-hover">
          <react_1.RiAddCircleLine className="size-5 text-text-quaternary group-hover:text-text-accent"/>
        </div>
        <div className="system-md-semibold truncate text-text-primary">
          {t('creation.createFromScratch.title', { ns: 'datasetPipeline' })}
        </div>
      </div>
      <p className="system-xs-regular line-clamp-3 px-4 py-1 text-text-tertiary">
        {t('creation.createFromScratch.description', { ns: 'datasetPipeline' })}
      </p>
    </div>);
};
exports.default = React.memo(CreateCard);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWNhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVhdGUtY2FyZC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBa0Q7QUFDbEQsZ0RBQTJDO0FBQzNDLCtCQUE4QjtBQUM5QixpQ0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLCtEQUE0RDtBQUM1RCx1REFBK0M7QUFDL0MsK0VBQWlGO0FBQ2pGLGlFQUF1RTtBQUV2RSxNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDdEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUU1QixNQUFNLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsSUFBQSw2Q0FBd0IsR0FBRSxDQUFBO0lBQ3RFLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxtQ0FBcUIsR0FBRSxDQUFBO0lBRWxELE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLGtCQUFrQixDQUFDLFNBQVMsRUFBRTtZQUNsQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDbEIsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDVCxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFBO29CQUNuQixlQUFLLENBQUMsTUFBTSxDQUFDO3dCQUNYLElBQUksRUFBRSxTQUFTO3dCQUNmLE9BQU8sRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztxQkFDN0QsQ0FBQyxDQUFBO29CQUNGLGtCQUFrQixFQUFFLENBQUE7b0JBQ3BCLElBQUEsc0JBQVUsRUFBQyw4QkFBOEIsRUFBRTt3QkFDekMsVUFBVSxFQUFFLEVBQUU7cUJBQ2YsQ0FBQyxDQUFBO29CQUNGLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUE7Z0JBQ2xDLENBQUM7WUFDSCxDQUFDO1lBQ0QsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDWixlQUFLLENBQUMsTUFBTSxDQUFDO29CQUNYLElBQUksRUFBRSxPQUFPO29CQUNiLE9BQU8sRUFBRSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztpQkFDM0QsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXJELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsMkxBQTJMLENBQ3JNLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUV0QjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FDakQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ05BQWdOLENBQzdOO1VBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQywwREFBMEQsRUFDdkY7UUFBQSxFQUFFLEdBQUcsQ0FDTDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrQ0FBK0MsQ0FDNUQ7VUFBQSxDQUFDLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQ25FO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyw2REFBNkQsQ0FDeEU7UUFBQSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQ3pFO01BQUEsRUFBRSxDQUFDLENBQ0w7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBZGRDaXJjbGVMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHRyYWNrRXZlbnQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IHVzZUNyZWF0ZVBpcGVsaW5lRGF0YXNldCB9IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWNyZWF0ZS1kYXRhc2V0J1xuaW1wb3J0IHsgdXNlSW52YWxpZERhdGFzZXRMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCdcblxuY29uc3QgQ3JlYXRlQ2FyZCA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgcHVzaCB9ID0gdXNlUm91dGVyKClcblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBjcmVhdGVFbXB0eURhdGFzZXQgfSA9IHVzZUNyZWF0ZVBpcGVsaW5lRGF0YXNldCgpXG4gIGNvbnN0IGludmFsaWREYXRhc2V0TGlzdCA9IHVzZUludmFsaWREYXRhc2V0TGlzdCgpXG5cbiAgY29uc3QgaGFuZGxlQ3JlYXRlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IGNyZWF0ZUVtcHR5RGF0YXNldCh1bmRlZmluZWQsIHtcbiAgICAgIG9uU3VjY2VzczogKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICBjb25zdCB7IGlkIH0gPSBkYXRhXG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ2NyZWF0aW9uLnN1Y2Nlc3NUaXAnLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGludmFsaWREYXRhc2V0TGlzdCgpXG4gICAgICAgICAgdHJhY2tFdmVudCgnY3JlYXRlX2RhdGFzZXRzX2Zyb21fc2NyYXRjaCcsIHtcbiAgICAgICAgICAgIGRhdGFzZXRfaWQ6IGlkLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgcHVzaChgL2RhdGFzZXRzLyR7aWR9L3BpcGVsaW5lYClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6ICgpID0+IHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IHQoJ2NyZWF0aW9uLmVycm9yVGlwJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSksXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pXG4gIH0sIFtjcmVhdGVFbXB0eURhdGFzZXQsIHB1c2gsIGludmFsaWREYXRhc2V0TGlzdCwgdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJncm91cCByZWxhdGl2ZSBmbGV4IGgtWzEzMnB4XSBjdXJzb3ItcG9pbnRlciBmbGV4LWNvbCByb3VuZGVkLXhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLW9uLXBhbmVsLWl0ZW0tYmcgcGItMyBzaGFkb3cteHMgc2hhZG93LXNoYWRvdy1zaGFkb3ctM1wiXG4gICAgICBvbkNsaWNrPXtoYW5kbGVDcmVhdGV9XG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAteC0zIHAtNCBwYi0yXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzaXplLTEwIHNocmluay0wIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLVsxMHB4XSBib3JkZXIgYm9yZGVyLWRhc2hlZCBib3JkZXItZGl2aWRlci1yZWd1bGFyIGJnLWJhY2tncm91bmQtc2VjdGlvbiBncm91cC1ob3Zlcjpib3JkZXItc3RhdGUtYWNjZW50LWhvdmVyLWFsdCBncm91cC1ob3ZlcjpiZy1zdGF0ZS1hY2NlbnQtaG92ZXJcIj5cbiAgICAgICAgICA8UmlBZGRDaXJjbGVMaW5lIGNsYXNzTmFtZT1cInNpemUtNSB0ZXh0LXRleHQtcXVhdGVybmFyeSBncm91cC1ob3Zlcjp0ZXh0LXRleHQtYWNjZW50XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXNlbWlib2xkIHRydW5jYXRlIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAge3QoJ2NyZWF0aW9uLmNyZWF0ZUZyb21TY3JhdGNoLnRpdGxlJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8cCBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBsaW5lLWNsYW1wLTMgcHgtNCBweS0xIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICB7dCgnY3JlYXRpb24uY3JlYXRlRnJvbVNjcmF0Y2guZGVzY3JpcHRpb24nLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KX1cbiAgICAgIDwvcD5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKENyZWF0ZUNhcmQpXG4iXX0=