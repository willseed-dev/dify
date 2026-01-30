"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignInLayout;
const loading_1 = require("@/app/components/base/loading");
const _header_1 = require("@/app/signin/_header");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const use_document_title_1 = require("@/hooks/use-document-title");
const use_common_1 = require("@/service/use-common");
const classnames_1 = require("@/utils/classnames");
function SignInLayout({ children }) {
    const { systemFeatures } = (0, global_public_context_1.useGlobalPublicStore)();
    (0, use_document_title_1.default)('');
    const { isLoading, data: loginData } = (0, use_common_1.useIsLogin)();
    const isLoggedIn = loginData?.logged_in;
    if (isLoading) {
        return (<div className="flex min-h-screen w-full justify-center bg-background-default-burn">
        <loading_1.default />
      </div>);
    }
    return (<>
      <div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
        <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col items-center rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
          <_header_1.default />
          <div className={(0, classnames_1.cn)('flex w-full grow flex-col items-center justify-center px-6 md:px-[108px]')}>
            <div className="flex flex-col md:w-[400px]">
              {isLoggedIn
            ? (<app_context_1.AppContextProvider>
                      {children}
                    </app_context_1.AppContextProvider>)
            : children}
            </div>
          </div>
          {systemFeatures.branding.enabled === false && (<div className="system-xs-regular px-8 py-6 text-text-tertiary">
              ©
              {' '}
              {new Date().getFullYear()}
              {' '}
              LangGenius, Inc. All rights reserved.
            </div>)}
        </div>
      </div>
    </>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQVVaLCtCQTBDQztBQW5ERCwyREFBbUQ7QUFFbkQsa0RBQXlDO0FBQ3pDLHVEQUEwRDtBQUMxRCwyRUFBc0U7QUFDdEUsbUVBQXlEO0FBQ3pELHFEQUFpRDtBQUNqRCxtREFBdUM7QUFFdkMsU0FBd0IsWUFBWSxDQUFDLEVBQUUsUUFBUSxFQUFPO0lBQ3BELE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLDRDQUFvQixHQUFFLENBQUE7SUFDakQsSUFBQSw0QkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQixNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVCQUFVLEdBQUUsQ0FBQTtJQUNuRCxNQUFNLFVBQVUsR0FBRyxTQUFTLEVBQUUsU0FBUyxDQUFBO0lBRXZDLElBQUksU0FBUyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG9FQUFvRSxDQUNqRjtRQUFBLENBQUMsaUJBQU8sQ0FBQyxBQUFELEVBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0lBQ0QsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx3RUFBd0UsQ0FBQyxDQUFDLENBQzNGO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMscUhBQXFILENBQUMsQ0FBQyxDQUN4STtVQUFBLENBQUMsaUJBQU0sQ0FBQyxBQUFELEVBQ1A7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQywwRUFBMEUsQ0FBQyxDQUFDLENBQzdGO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUN6QztjQUFBLENBQUMsVUFBVTtZQUNULENBQUMsQ0FBQyxDQUNFLENBQUMsZ0NBQWtCLENBQ2pCO3NCQUFBLENBQUMsUUFBUSxDQUNYO29CQUFBLEVBQUUsZ0NBQWtCLENBQUMsQ0FDdEI7WUFDSCxDQUFDLENBQUMsUUFBUSxDQUNkO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDTDtVQUFBLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLENBQzVDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnREFBZ0QsQ0FDN0Q7O2NBQ0EsQ0FBQyxHQUFHLENBQ0o7Y0FBQSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQ3pCO2NBQUEsQ0FBQyxHQUFHLENBQ0o7O1lBQ0YsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IExvYWRpbmcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2xvYWRpbmcnXG5cbmltcG9ydCBIZWFkZXIgZnJvbSAnQC9hcHAvc2lnbmluL19oZWFkZXInXG5pbXBvcnQgeyBBcHBDb250ZXh0UHJvdmlkZXIgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSB9IGZyb20gJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnXG5pbXBvcnQgdXNlRG9jdW1lbnRUaXRsZSBmcm9tICdAL2hvb2tzL3VzZS1kb2N1bWVudC10aXRsZSdcbmltcG9ydCB7IHVzZUlzTG9naW4gfSBmcm9tICdAL3NlcnZpY2UvdXNlLWNvbW1vbidcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWduSW5MYXlvdXQoeyBjaGlsZHJlbiB9OiBhbnkpIHtcbiAgY29uc3QgeyBzeXN0ZW1GZWF0dXJlcyB9ID0gdXNlR2xvYmFsUHVibGljU3RvcmUoKVxuICB1c2VEb2N1bWVudFRpdGxlKCcnKVxuICBjb25zdCB7IGlzTG9hZGluZywgZGF0YTogbG9naW5EYXRhIH0gPSB1c2VJc0xvZ2luKClcbiAgY29uc3QgaXNMb2dnZWRJbiA9IGxvZ2luRGF0YT8ubG9nZ2VkX2luXG5cbiAgaWYgKGlzTG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggbWluLWgtc2NyZWVuIHctZnVsbCBqdXN0aWZ5LWNlbnRlciBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtYnVyblwiPlxuICAgICAgICA8TG9hZGluZyAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBtaW4taC1zY3JlZW4gdy1mdWxsIGp1c3RpZnktY2VudGVyIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuIHAtNicpfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IHctZnVsbCBzaHJpbmstMCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1lZmZlY3RzLWhpZ2hsaWdodCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlJyl9PlxuICAgICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggdy1mdWxsIGdyb3cgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTYgbWQ6cHgtWzEwOHB4XScpfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDp3LVs0MDBweF1cIj5cbiAgICAgICAgICAgICAge2lzTG9nZ2VkSW5cbiAgICAgICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICAgICAgPEFwcENvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgICAgIDwvQXBwQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIDogY2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7c3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCA9PT0gZmFsc2UgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBweC04IHB5LTYgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgIMKpXG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIExhbmdHZW5pdXMsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gIClcbn1cbiJdfQ==