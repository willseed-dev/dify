"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const use_document_title_1 = require("@/hooks/use-document-title");
const common_1 = require("@/service/common");
const var_1 = require("@/utils/var");
const loading_1 = require("../components/base/loading");
const toast_1 = require("../components/base/toast");
const InitPasswordPopup = () => {
    (0, use_document_title_1.default)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [validated, setValidated] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleValidation = async () => {
        setLoading(true);
        try {
            const response = await (0, common_1.initValidate)({ body: { password } });
            if (response.result === 'success') {
                setValidated(true);
                router.push('/install'); // or render setup form
            }
            else {
                throw new Error('Validation failed');
            }
        }
        catch (e) {
            toast_1.default.notify({
                type: 'error',
                message: e.message,
                duration: 5000,
            });
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        (0, common_1.fetchInitValidateStatus)().then((res) => {
            if (res.status === 'finished')
                window.location.href = `${var_1.basePath}/install`;
            else
                setLoading(false);
        });
    }, []);
    return (loading
        ? <loading_1.default />
        : (<div>
            {!validated && (<div className="mx-12 block min-w-28">
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                    {t('adminInitPassword', { ns: 'login' })}

                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full appearance-none rounded-md border border-divider-regular px-3 py-2 shadow-sm placeholder:text-text-quaternary focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"/>
                  </div>
                </div>
                <div className="flex flex-row flex-wrap justify-stretch p-0">
                  <button_1.default variant="primary" onClick={handleValidation} className="min-w-28 basis-full">
                    {t('validate', { ns: 'login' })}
                  </button_1.default>
                </div>
              </div>)}
          </div>));
};
exports.default = InitPasswordPopup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5pdFBhc3N3b3JkUG9wdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJJbml0UGFzc3dvcmRQb3B1cC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWixnREFBMkM7QUFDM0MsaUNBQTJDO0FBQzNDLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsbUVBQXlEO0FBQ3pELDZDQUF3RTtBQUN4RSxxQ0FBc0M7QUFDdEMsd0RBQWdEO0FBQ2hELG9EQUE0QztBQUU1QyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUM3QixJQUFBLDRCQUFnQixFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3BCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzVDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUEsc0JBQVMsR0FBRSxDQUFBO0lBRTFCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLGdCQUFnQixHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoQixJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEscUJBQVksRUFBQyxFQUFFLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUMzRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7Z0JBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQSxDQUFDLHVCQUF1QjtZQUNqRCxDQUFDO2lCQUNJLENBQUM7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQ3RDLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxDQUFNLEVBQUUsQ0FBQztZQUNkLGVBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ1gsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNsQixRQUFRLEVBQUUsSUFBSTthQUNmLENBQUMsQ0FBQTtZQUNGLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQixDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUEsZ0NBQXVCLEdBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUErQixFQUFFLEVBQUU7WUFDakUsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLFVBQVU7Z0JBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsY0FBUSxVQUFVLENBQUE7O2dCQUU1QyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckIsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixPQUFPLENBQ0wsT0FBTztRQUNMLENBQUMsQ0FBQyxDQUFDLGlCQUFPLENBQUMsQUFBRCxFQUFHO1FBQ2IsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxHQUFHLENBQ0Y7WUFBQSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQ2IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUNuQztnQkFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuQjtrQkFBQSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQywrQ0FBK0MsQ0FDakY7b0JBQUEsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FFMUM7O2tCQUFBLEVBQUUsS0FBSyxDQUNQO2tCQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FDakQ7b0JBQUEsQ0FBQyxLQUFLLENBQ0osRUFBRSxDQUFDLFVBQVUsQ0FDYixJQUFJLENBQUMsVUFBVSxDQUNmLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNoQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQzNDLFNBQVMsQ0FBQyx3TUFBd00sRUFFdE47a0JBQUEsRUFBRSxHQUFHLENBQ1A7Z0JBQUEsRUFBRSxHQUFHLENBQ0w7Z0JBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUMxRDtrQkFBQSxDQUFDLGdCQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FDbEY7b0JBQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQ2pDO2tCQUFBLEVBQUUsZ0JBQU0sQ0FDVjtnQkFBQSxFQUFFLEdBQUcsQ0FDUDtjQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDTixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsaUJBQWlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgSW5pdFZhbGlkYXRlU3RhdHVzUmVzcG9uc2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgdXNlRG9jdW1lbnRUaXRsZSBmcm9tICdAL2hvb2tzL3VzZS1kb2N1bWVudC10aXRsZSdcbmltcG9ydCB7IGZldGNoSW5pdFZhbGlkYXRlU3RhdHVzLCBpbml0VmFsaWRhdGUgfSBmcm9tICdAL3NlcnZpY2UvY29tbW9uJ1xuaW1wb3J0IHsgYmFzZVBhdGggfSBmcm9tICdAL3V0aWxzL3ZhcidcbmltcG9ydCBMb2FkaW5nIGZyb20gJy4uL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4uL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcblxuY29uc3QgSW5pdFBhc3N3b3JkUG9wdXAgPSAoKSA9PiB7XG4gIHVzZURvY3VtZW50VGl0bGUoJycpXG4gIGNvbnN0IFtwYXNzd29yZCwgc2V0UGFzc3dvcmRdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IFt2YWxpZGF0ZWQsIHNldFZhbGlkYXRlZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcblxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBjb25zdCBoYW5kbGVWYWxpZGF0aW9uID0gYXN5bmMgKCkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSlcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbml0VmFsaWRhdGUoeyBib2R5OiB7IHBhc3N3b3JkIH0gfSlcbiAgICAgIGlmIChyZXNwb25zZS5yZXN1bHQgPT09ICdzdWNjZXNzJykge1xuICAgICAgICBzZXRWYWxpZGF0ZWQodHJ1ZSlcbiAgICAgICAgcm91dGVyLnB1c2goJy9pbnN0YWxsJykgLy8gb3IgcmVuZGVyIHNldHVwIGZvcm1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbGlkYXRpb24gZmFpbGVkJylcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGU6IGFueSkge1xuICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgIH0pXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2hJbml0VmFsaWRhdGVTdGF0dXMoKS50aGVuKChyZXM6IEluaXRWYWxpZGF0ZVN0YXR1c1Jlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAocmVzLnN0YXR1cyA9PT0gJ2ZpbmlzaGVkJylcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHtiYXNlUGF0aH0vaW5zdGFsbGBcbiAgICAgIGVsc2VcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSlcbiAgICB9KVxuICB9LCBbXSlcblxuICByZXR1cm4gKFxuICAgIGxvYWRpbmdcbiAgICAgID8gPExvYWRpbmcgLz5cbiAgICAgIDogKFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICB7IXZhbGlkYXRlZCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtMTIgYmxvY2sgbWluLXctMjhcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ2FkbWluSW5pdFBhc3N3b3JkJywgeyBuczogJ2xvZ2luJyB9KX1cblxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXQtMSByb3VuZGVkLW1kIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRQYXNzd29yZChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgdy1mdWxsIGFwcGVhcmFuY2Utbm9uZSByb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1yZWd1bGFyIHB4LTMgcHktMiBzaGFkb3ctc20gcGxhY2Vob2xkZXI6dGV4dC10ZXh0LXF1YXRlcm5hcnkgZm9jdXM6Ym9yZGVyLWluZGlnby01MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctaW5kaWdvLTUwMCBzbTp0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXJvdyBmbGV4LXdyYXAganVzdGlmeS1zdHJldGNoIHAtMFwiPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwicHJpbWFyeVwiIG9uQ2xpY2s9e2hhbmRsZVZhbGlkYXRpb259IGNsYXNzTmFtZT1cIm1pbi13LTI4IGJhc2lzLWZ1bGxcIj5cbiAgICAgICAgICAgICAgICAgICAge3QoJ3ZhbGlkYXRlJywgeyBuczogJ2xvZ2luJyB9KX1cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbml0UGFzc3dvcmRQb3B1cFxuIl19