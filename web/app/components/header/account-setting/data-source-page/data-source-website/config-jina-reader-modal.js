"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const general_1 = require("@/app/components/base/icons/src/vender/line/general");
const security_1 = require("@/app/components/base/icons/src/vender/solid/security");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const toast_1 = require("@/app/components/base/toast");
const field_1 = require("@/app/components/datasets/create/website/base/field");
const common_1 = require("@/models/common");
const datasets_1 = require("@/service/datasets");
const I18N_PREFIX = 'jinaReader';
const ConfigJinaReaderModal = ({ onCancel, onSaved, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [apiKey, setApiKey] = (0, react_1.useState)('');
    const handleSave = (0, react_1.useCallback)(async () => {
        if (isSaving)
            return;
        let errorMsg = '';
        if (!errorMsg) {
            if (!apiKey) {
                errorMsg = t('errorMsg.fieldRequired', {
                    ns: 'common',
                    field: 'API Key',
                });
            }
        }
        if (errorMsg) {
            toast_1.default.notify({
                type: 'error',
                message: errorMsg,
            });
            return;
        }
        const postData = {
            category: 'website',
            provider: common_1.DataSourceProvider.jinaReader,
            credentials: {
                auth_type: 'bearer',
                config: {
                    api_key: apiKey,
                },
            },
        };
        try {
            setIsSaving(true);
            await (0, datasets_1.createDataSourceApiKeyBinding)(postData);
            toast_1.default.notify({
                type: 'success',
                message: t('api.success', { ns: 'common' }),
            });
        }
        finally {
            setIsSaving(false);
        }
        onSaved();
    }, [apiKey, onSaved, t, isSaving]);
    return (<portal_to_follow_elem_1.PortalToFollowElem open>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[60] h-full w-full">
        <div className="fixed inset-0 flex items-center justify-center bg-background-overlay">
          <div className="mx-2 max-h-[calc(100vh-120px)] w-[640px] overflow-y-auto rounded-2xl bg-components-panel-bg shadow-xl">
            <div className="px-8 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="system-xl-semibold text-text-primary">{t(`${I18N_PREFIX}.configJinaReader`, { ns: 'datasetCreation' })}</div>
              </div>

              <div className="space-y-4">
                <field_1.default label="API Key" labelClassName="!text-sm" isRequired value={apiKey} onChange={(value) => setApiKey(value)} placeholder={t(`${I18N_PREFIX}.apiKeyPlaceholder`, { ns: 'datasetCreation' })}/>
              </div>
              <div className="my-8 flex h-8 items-center justify-between">
                <a className="flex items-center space-x-1 text-xs font-normal leading-[18px] text-text-accent" target="_blank" href="https://jina.ai/reader/">
                  <span>{t(`${I18N_PREFIX}.getApiKeyLinkText`, { ns: 'datasetCreation' })}</span>
                  <general_1.LinkExternal02 className="h-3 w-3"/>
                </a>
                <div className="flex">
                  <button_1.default size="large" className="mr-2" onClick={onCancel}>
                    {t('operation.cancel', { ns: 'common' })}
                  </button_1.default>
                  <button_1.default variant="primary" size="large" onClick={handleSave} loading={isSaving}>
                    {t('operation.save', { ns: 'common' })}
                  </button_1.default>
                </div>

              </div>
            </div>
            <div className="border-t-[0.5px] border-t-divider-regular">
              <div className="flex items-center justify-center bg-background-section-burn py-3 text-xs text-text-tertiary">
                <security_1.Lock01 className="mr-1 h-3 w-3 text-text-tertiary"/>
                {t('modelProvider.encrypted.front', { ns: 'common' })}
                <a className="mx-1 text-text-accent" target="_blank" rel="noopener noreferrer" href="https://pycryptodome.readthedocs.io/en/latest/src/cipher/oaep.html">
                  PKCS1_OAEP
                </a>
                {t('modelProvider.encrypted.back', { ns: 'common' })}
              </div>
            </div>
          </div>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = React.memo(ConfigJinaReaderModal);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWppbmEtcmVhZGVyLW1vZGFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLWppbmEtcmVhZGVyLW1vZGFsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLCtCQUE4QjtBQUM5QixpQ0FBNkM7QUFDN0MsaURBQThDO0FBQzlDLHlEQUFpRDtBQUNqRCxpRkFBb0Y7QUFDcEYsb0ZBQThFO0FBQzlFLHVGQUdvRDtBQUNwRCx1REFBK0M7QUFDL0MsK0VBQXVFO0FBQ3ZFLDRDQUFvRDtBQUNwRCxpREFBa0U7QUFPbEUsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFBO0FBRWhDLE1BQU0scUJBQXFCLEdBQWMsQ0FBQyxFQUN4QyxRQUFRLEVBQ1IsT0FBTyxHQUNSLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUMvQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUV4QyxNQUFNLFVBQVUsR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBSyxJQUFJLEVBQUU7UUFDeEMsSUFBSSxRQUFRO1lBQ1YsT0FBTTtRQUNSLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ1osUUFBUSxHQUFHLENBQUMsQ0FBQyx3QkFBd0IsRUFBRTtvQkFDckMsRUFBRSxFQUFFLFFBQVE7b0JBQ1osS0FBSyxFQUFFLFNBQVM7aUJBQ2pCLENBQUMsQ0FBQTtZQUNKLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNiLGVB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a0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHsgTGlua0V4dGVybmFsMDIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2dlbmVyYWwnXG5pbXBvcnQgeyBMb2NrMDEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9zZWN1cml0eSdcbmltcG9ydCB7XG4gIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbSdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgRmllbGQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9jcmVhdGUvd2Vic2l0ZS9iYXNlL2ZpZWxkJ1xuaW1wb3J0IHsgRGF0YVNvdXJjZVByb3ZpZGVyIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHsgY3JlYXRlRGF0YVNvdXJjZUFwaUtleUJpbmRpbmcgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9uQ2FuY2VsOiAoKSA9PiB2b2lkXG4gIG9uU2F2ZWQ6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgSTE4Tl9QUkVGSVggPSAnamluYVJlYWRlcidcblxuY29uc3QgQ29uZmlnSmluYVJlYWRlck1vZGFsOiBGQzxQcm9wcz4gPSAoe1xuICBvbkNhbmNlbCxcbiAgb25TYXZlZCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IFtpc1NhdmluZywgc2V0SXNTYXZpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IFthcGlLZXksIHNldEFwaUtleV0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBoYW5kbGVTYXZlID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGlmIChpc1NhdmluZylcbiAgICAgIHJldHVyblxuICAgIGxldCBlcnJvck1zZyA9ICcnXG4gICAgaWYgKCFlcnJvck1zZykge1xuICAgICAgaWYgKCFhcGlLZXkpIHtcbiAgICAgICAgZXJyb3JNc2cgPSB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywge1xuICAgICAgICAgIG5zOiAnY29tbW9uJyxcbiAgICAgICAgICBmaWVsZDogJ0FQSSBLZXknLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvck1zZykge1xuICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3JNc2csXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBvc3REYXRhID0ge1xuICAgICAgY2F0ZWdvcnk6ICd3ZWJzaXRlJyxcbiAgICAgIHByb3ZpZGVyOiBEYXRhU291cmNlUHJvdmlkZXIuamluYVJlYWRlcixcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIGF1dGhfdHlwZTogJ2JlYXJlcicsXG4gICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgIGFwaV9rZXk6IGFwaUtleSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBzZXRJc1NhdmluZyh0cnVlKVxuICAgICAgYXdhaXQgY3JlYXRlRGF0YVNvdXJjZUFwaUtleUJpbmRpbmcocG9zdERhdGEpXG4gICAgICBUb2FzdC5ub3RpZnkoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ2FwaS5zdWNjZXNzJywgeyBuczogJ2NvbW1vbicgfSksXG4gICAgICB9KVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldElzU2F2aW5nKGZhbHNlKVxuICAgIH1cblxuICAgIG9uU2F2ZWQoKVxuICB9LCBbYXBpS2V5LCBvblNhdmVkLCB0LCBpc1NhdmluZ10pXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtIG9wZW4+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LVs2MF0gaC1mdWxsIHctZnVsbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZC1vdmVybGF5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC0yIG1heC1oLVtjYWxjKDEwMHZoLTEyMHB4KV0gdy1bNjQwcHhdIG92ZXJmbG93LXktYXV0byByb3VuZGVkLTJ4bCBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHNoYWRvdy14bFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC04IHB0LThcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhsLXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoYCR7STE4Tl9QUkVGSVh9LmNvbmZpZ0ppbmFSZWFkZXJgLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KX08L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICA8RmllbGRcbiAgICAgICAgICAgICAgICAgIGxhYmVsPVwiQVBJIEtleVwiXG4gICAgICAgICAgICAgICAgICBsYWJlbENsYXNzTmFtZT1cIiF0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICAgIGlzUmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXthcGlLZXl9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpID0+IHNldEFwaUtleSh2YWx1ZSBhcyBzdHJpbmcpfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3QoYCR7STE4Tl9QUkVGSVh9LmFwaUtleVBsYWNlaG9sZGVyYCwgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSkhfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm15LTggZmxleCBoLTggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMSB0ZXh0LXhzIGZvbnQtbm9ybWFsIGxlYWRpbmctWzE4cHhdIHRleHQtdGV4dC1hY2NlbnRcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9qaW5hLmFpL3JlYWRlci9cIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt0KGAke0kxOE5fUFJFRklYfS5nZXRBcGlLZXlMaW5rVGV4dGAsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxMaW5rRXh0ZXJuYWwwMiBjbGFzc05hbWU9XCJoLTMgdy0zXCIgLz5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTJcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgIHNpemU9XCJsYXJnZVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVNhdmV9XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc9e2lzU2F2aW5nfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvcmRlci10LVswLjVweF0gYm9yZGVyLXQtZGl2aWRlci1yZWd1bGFyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcHktMyB0ZXh0LXhzIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICAgIDxMb2NrMDEgY2xhc3NOYW1lPVwibXItMSBoLTMgdy0zIHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICAgICAge3QoJ21vZGVsUHJvdmlkZXIuZW5jcnlwdGVkLmZyb250JywgeyBuczogJ2NvbW1vbicgfSl9XG4gICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm14LTEgdGV4dC10ZXh0LWFjY2VudFwiXG4gICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9weWNyeXB0b2RvbWUucmVhZHRoZWRvY3MuaW8vZW4vbGF0ZXN0L3NyYy9jaXBoZXIvb2FlcC5odG1sXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBQS0NTMV9PQUVQXG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIHt0KCdtb2RlbFByb3ZpZGVyLmVuY3J5cHRlZC5iYWNrJywgeyBuczogJ2NvbW1vbicgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50PlxuICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKENvbmZpZ0ppbmFSZWFkZXJNb2RhbClcbiJdfQ==