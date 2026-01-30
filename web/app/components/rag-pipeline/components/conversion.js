"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const confirm_1 = require("@/app/components/base/confirm");
const toast_1 = require("@/app/components/base/toast");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const use_base_1 = require("@/service/use-base");
const use_pipeline_1 = require("@/service/use-pipeline");
const screenshot_1 = require("./screenshot");
const Conversion = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { datasetId } = (0, navigation_1.useParams)();
    const [showConfirmModal, setShowConfirmModal] = (0, react_1.useState)(false);
    const { mutateAsync: convert, isPending } = (0, use_pipeline_1.useConvertDatasetToPipeline)();
    const invalidDatasetDetail = (0, use_base_1.useInvalid)([...use_dataset_1.datasetDetailQueryKeyPrefix, datasetId]);
    const handleConvert = (0, react_1.useCallback)(() => {
        convert(datasetId, {
            onSuccess: (res) => {
                if (res.status === 'success') {
                    toast_1.default.notify({
                        type: 'success',
                        message: t('conversion.successMessage', { ns: 'datasetPipeline' }),
                    });
                    setShowConfirmModal(false);
                    invalidDatasetDetail();
                }
                else if (res.status === 'failed') {
                    toast_1.default.notify({
                        type: 'error',
                        message: t('conversion.errorMessage', { ns: 'datasetPipeline' }),
                    });
                }
            },
            onError: () => {
                toast_1.default.notify({
                    type: 'error',
                    message: t('conversion.errorMessage', { ns: 'datasetPipeline' }),
                });
            },
        });
    }, [convert, datasetId, invalidDatasetDetail, t]);
    const handleShowConfirmModal = (0, react_1.useCallback)(() => {
        setShowConfirmModal(true);
    }, []);
    const handleCancelConversion = (0, react_1.useCallback)(() => {
        setShowConfirmModal(false);
    }, []);
    return (<div className="flex h-full w-full items-center justify-center bg-background-body p-6 pb-16">
      <div className="flex rounded-2xl border-[0.5px] border-components-card-border bg-components-card-bg shadow-sm shadow-shadow-shadow-4">
        <div className="flex max-w-[480px] flex-col justify-between p-10">
          <div className="flex flex-col gap-y-2.5">
            <div className="title-4xl-semi-bold text-text-primary">
              {t('conversion.title', { ns: 'datasetPipeline' })}
            </div>
            <div className="body-md-medium">
              <span className="text-text-secondary">{t('conversion.descriptionChunk1', { ns: 'datasetPipeline' })}</span>
              <span className="text-text-tertiary">{t('conversion.descriptionChunk2', { ns: 'datasetPipeline' })}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <button_1.default variant="primary" className="w-32" onClick={handleShowConfirmModal}>
              {t('operations.convert', { ns: 'datasetPipeline' })}
            </button_1.default>
            <span className="system-xs-regular text-text-warning">
              {t('conversion.warning', { ns: 'datasetPipeline' })}
            </span>
          </div>
        </div>
        <div className="pb-8 pl-[25px] pr-0 pt-6">
          <div className="rounded-l-xl border border-effects-highlight bg-background-default p-1 shadow-md shadow-shadow-shadow-5 backdrop-blur-[5px]">
            <div className="overflow-hidden rounded-l-lg">
              <screenshot_1.default />
            </div>
          </div>
        </div>
      </div>
      {showConfirmModal && (<confirm_1.default title={t('conversion.confirm.title', { ns: 'datasetPipeline' })} content={t('conversion.confirm.content', { ns: 'datasetPipeline' })} isShow={showConfirmModal} onConfirm={handleConvert} onCancel={handleCancelConversion} isLoading={isPending} isDisabled={isPending}/>)}
    </div>);
};
exports.default = React.memo(Conversion);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udmVyc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnZlcnNpb24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQTJDO0FBQzNDLCtCQUE4QjtBQUM5QixpQ0FBNkM7QUFDN0MsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFDbkQsdURBQStDO0FBQy9DLGlFQUE2RTtBQUM3RSxpREFBK0M7QUFDL0MseURBQW9FO0FBQ3BFLDZDQUE2QztBQUU3QyxNQUFNLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDdEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUNqQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0QsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSwwQ0FBMkIsR0FBRSxDQUFBO0lBQ3pFLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxxQkFBVSxFQUFDLENBQUMsR0FBRyx5Q0FBMkIsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBQ3BGLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDckMsT0FBTyxDQUFDLFNBQW1CLEVBQUU7WUFDM0IsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztvQkFDN0IsZUFBSyxDQUFDLE1BQU0sQ0FBQzt3QkFDWCxJQUFJLEVBQUUsU0FBUzt3QkFDZixPQUFPLEVBQUUsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUM7cUJBQ25FLENBQUMs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TDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FDdkM7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNkhBQTZILENBQzFJO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUMzQztjQUFBLENBQUMsb0JBQWtCLENBQUMsQUFBRCxFQUNyQjtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxnQkFBZ0IsSUFBSSxDQUNuQixDQUFDLGlCQUFPLENBQ04sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUNoRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQ3BFLE1BQU0sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQ3pCLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUN6QixRQUFRLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUNqQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FDckIsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQ3RCLENBQ0gsQ0FDSDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IENvbmZpcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NvbmZpcm0nXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgZGF0YXNldERldGFpbFF1ZXJ5S2V5UHJlZml4IH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCdcbmltcG9ydCB7IHVzZUludmFsaWQgfSBmcm9tICdAL3NlcnZpY2UvdXNlLWJhc2UnXG5pbXBvcnQgeyB1c2VDb252ZXJ0RGF0YXNldFRvUGlwZWxpbmUgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJ1xuaW1wb3J0IFBpcGVsaW5lU2NyZWVuU2hvdCBmcm9tICcuL3NjcmVlbnNob3QnXG5cbmNvbnN0IENvbnZlcnNpb24gPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IGRhdGFzZXRJZCB9ID0gdXNlUGFyYW1zKClcbiAgY29uc3QgW3Nob3dDb25maXJtTW9kYWwsIHNldFNob3dDb25maXJtTW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogY29udmVydCwgaXNQZW5kaW5nIH0gPSB1c2VDb252ZXJ0RGF0YXNldFRvUGlwZWxpbmUoKVxuICBjb25zdCBpbnZhbGlkRGF0YXNldERldGFpbCA9IHVzZUludmFsaWQoWy4uLmRhdGFzZXREZXRhaWxRdWVyeUtleVByZWZpeCwgZGF0YXNldElkXSlcbiAgY29uc3QgaGFuZGxlQ29udmVydCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb252ZXJ0KGRhdGFzZXRJZCBhcyBzdHJpbmcsIHtcbiAgICAgIG9uU3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICBpZiAocmVzLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ2NvbnZlcnNpb24uc3VjY2Vzc01lc3NhZ2UnLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHNldFNob3dDb25maXJtTW9kYWwoZmFsc2UpXG4gICAgICAgICAgaW52YWxpZERhdGFzZXREZXRhaWwoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlcy5zdGF0dXMgPT09ICdmYWlsZWQnKSB7XG4gICAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiB0KCdjb252ZXJzaW9uLmVycm9yTWVzc2FnZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiB0KCdjb252ZXJzaW9uLmVycm9yTWVzc2FnZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pLFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbY29udmVydCwgZGF0YXNldElkLCBpbnZhbGlkRGF0YXNldERldGFpbCwgdF0pXG5cbiAgY29uc3QgaGFuZGxlU2hvd0NvbmZpcm1Nb2RhbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRTaG93Q29uZmlybU1vZGFsKHRydWUpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUNhbmNlbENvbnZlcnNpb24gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgc2V0U2hvd0NvbmZpcm1Nb2RhbChmYWxzZSlcbiAgfSwgW10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1mdWxsIHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZC1ib2R5IHAtNiBwYi0xNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHJvdW5kZWQtMnhsIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLWNhcmQtYm9yZGVyIGJnLWNvbXBvbmVudHMtY2FyZC1iZyBzaGFkb3ctc20gc2hhZG93LXNoYWRvdy1zaGFkb3ctNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWF4LXctWzQ4MHB4XSBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gcC0xMFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAteS0yLjVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGUtNHhsLXNlbWktYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgICAgICB7dCgnY29udmVyc2lvbi50aXRsZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvZHktbWQtbWVkaXVtXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnY29udmVyc2lvbi5kZXNjcmlwdGlvbkNodW5rMScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3QoJ2NvbnZlcnNpb24uZGVzY3JpcHRpb25DaHVuazInLCB7IG5zOiAnZGF0YXNldFBpcGVsaW5lJyB9KX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC14LTRcIj5cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTMyXCJcbiAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU2hvd0NvbmZpcm1Nb2RhbH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3QoJ29wZXJhdGlvbnMuY29udmVydCcsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfVxuICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtd2FybmluZ1wiPlxuICAgICAgICAgICAgICB7dCgnY29udmVyc2lvbi53YXJuaW5nJywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBiLTggcGwtWzI1cHhdIHByLTAgcHQtNlwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sLXhsIGJvcmRlciBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctYmFja2dyb3VuZC1kZWZhdWx0IHAtMSBzaGFkb3ctbWQgc2hhZG93LXNoYWRvdy1zaGFkb3ctNSBiYWNrZHJvcC1ibHVyLVs1cHhdXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93LWhpZGRlbiByb3VuZGVkLWwtbGdcIj5cbiAgICAgICAgICAgICAgPFBpcGVsaW5lU2NyZWVuU2hvdCAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7c2hvd0NvbmZpcm1Nb2RhbCAmJiAoXG4gICAgICAgIDxDb25maXJtXG4gICAgICAgICAgdGl0bGU9e3QoJ2NvbnZlcnNpb24uY29uZmlybS50aXRsZScsIHsgbnM6ICdkYXRhc2V0UGlwZWxpbmUnIH0pfVxuICAgICAgICAgIGNvbnRlbnQ9e3QoJ2NvbnZlcnNpb24uY29uZmlybS5jb250ZW50JywgeyBuczogJ2RhdGFzZXRQaXBlbGluZScgfSl9XG4gICAgICAgICAgaXNTaG93PXtzaG93Q29uZmlybU1vZGFsfVxuICAgICAgICAgIG9uQ29uZmlybT17aGFuZGxlQ29udmVydH1cbiAgICAgICAgICBvbkNhbmNlbD17aGFuZGxlQ2FuY2VsQ29udmVyc2lvbn1cbiAgICAgICAgICBpc0xvYWRpbmc9e2lzUGVuZGluZ31cbiAgICAgICAgICBpc0Rpc2FibGVkPXtpc1BlbmRpbmd9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQ29udmVyc2lvbilcbiJdfQ==