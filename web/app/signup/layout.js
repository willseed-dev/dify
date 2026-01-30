"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterLayout;
const _header_1 = require("@/app/signin/_header");
const global_public_context_1 = require("@/context/global-public-context");
const use_document_title_1 = require("@/hooks/use-document-title");
const classnames_1 = require("@/utils/classnames");
function RegisterLayout({ children }) {
    const { systemFeatures } = (0, global_public_context_1.useGlobalPublicStore)();
    (0, use_document_title_1.default)('');
    return (<>
      <div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
        <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col items-center rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
          <_header_1.default />
          <div className={(0, classnames_1.cn)('flex w-full grow flex-col items-center justify-center px-6 md:px-[108px]')}>
            <div className="flex flex-col md:w-[400px]">
              {children}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQU9aLGlDQTBCQztBQWhDRCxrREFBeUM7QUFFekMsMkVBQXNFO0FBQ3RFLG1FQUF5RDtBQUN6RCxtREFBdUM7QUFFdkMsU0FBd0IsY0FBYyxDQUFDLEVBQUUsUUFBUSxFQUFPO0lBQ3RELE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLDRDQUFvQixHQUFFLENBQUE7SUFDakQsSUFBQSw0QkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQixPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdFQUF3RSxDQUFDLENBQUMsQ0FDM0Y7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxxSEFBcUgsQ0FBQyxDQUFDLENBQ3hJO1VBQUEsQ0FBQyxpQkFBTSxDQUFDLEFBQUQsRUFDUDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDBFQUEwRSxDQUFDLENBQUMsQ0FDN0Y7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO2NBQUEsQ0FBQyxRQUFRLENBQ1g7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksQ0FDNUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdEQUFnRCxDQUM3RDs7Y0FDQSxDQUFDLEdBQUcsQ0FDSjtjQUFBLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FDekI7Y0FBQSxDQUFDLEdBQUcsQ0FDSjs7WUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0g7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgSGVhZGVyIGZyb20gJ0AvYXBwL3NpZ25pbi9faGVhZGVyJ1xuXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSB9IGZyb20gJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnXG5pbXBvcnQgdXNlRG9jdW1lbnRUaXRsZSBmcm9tICdAL2hvb2tzL3VzZS1kb2N1bWVudC10aXRsZSdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWdpc3RlckxheW91dCh7IGNoaWxkcmVuIH06IGFueSkge1xuICBjb25zdCB7IHN5c3RlbUZlYXR1cmVzIH0gPSB1c2VHbG9iYWxQdWJsaWNTdG9yZSgpXG4gIHVzZURvY3VtZW50VGl0bGUoJycpXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBtaW4taC1zY3JlZW4gdy1mdWxsIGp1c3RpZnktY2VudGVyIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuIHAtNicpfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IHctZnVsbCBzaHJpbmstMCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1lZmZlY3RzLWhpZ2hsaWdodCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlJyl9PlxuICAgICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggdy1mdWxsIGdyb3cgZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTYgbWQ6cHgtWzEwOHB4XScpfT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDp3LVs0MDBweF1cIj5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3N5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWQgPT09IGZhbHNlICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgcHgtOCBweS02IHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICDCqVxuICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICB7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfVxuICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICBMYW5nR2VuaXVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApXG59XG4iXX0=