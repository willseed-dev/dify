"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignInLayout;
const react_i18next_1 = require("react-i18next");
const global_public_context_1 = require("@/context/global-public-context");
const use_document_title_1 = require("@/hooks/use-document-title");
const classnames_1 = require("@/utils/classnames");
function SignInLayout({ children }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    (0, use_document_title_1.default)(t('webapp.login', { ns: 'login' }));
    return (<>
      <div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
        <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
          {/* <Header /> */}
          <div className={(0, classnames_1.cn)('flex w-full grow flex-col items-center justify-center px-6 md:px-[108px]')}>
            <div className="flex justify-center md:w-[440px] lg:w-[600px]">
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQVFaLCtCQTJCQztBQWhDRCxpREFBOEM7QUFDOUMsMkVBQXNFO0FBQ3RFLG1FQUF5RDtBQUN6RCxtREFBdUM7QUFFdkMsU0FBd0IsWUFBWSxDQUFDLEVBQUUsUUFBUSxFQUFxQjtJQUNsRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxjQUFjLEdBQUcsSUFBQSw0Q0FBb0IsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUNsRSxJQUFBLDRCQUFnQixFQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3BELE9BQU8sQ0FDTCxFQUNFO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsd0VBQXdFLENBQUMsQ0FBQyxDQUMzRjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdHQUF3RyxDQUFDLENBQUMsQ0FDM0g7VUFBQSxDQUFDLGdCQUFnQixDQUNqQjtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDBFQUEwRSxDQUFDLENBQUMsQ0FDN0Y7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsK0NBQStDLENBQzVEO2NBQUEsQ0FBQyxRQUFRLENBQ1g7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksQ0FDNUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdEQUFnRCxDQUM3RDs7Y0FDQSxDQUFDLEdBQUcsQ0FDSjtjQUFBLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FDekI7Y0FBQSxDQUFDLEdBQUcsQ0FDSjs7WUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0g7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUdsb2JhbFB1YmxpY1N0b3JlIH0gZnJvbSAnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCdcbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJ0AvaG9va3MvdXNlLWRvY3VtZW50LXRpdGxlJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ25JbkxheW91dCh7IGNoaWxkcmVuIH06IFByb3BzV2l0aENoaWxkcmVuKSB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBzeXN0ZW1GZWF0dXJlcyA9IHVzZUdsb2JhbFB1YmxpY1N0b3JlKHMgPT4gcy5zeXN0ZW1GZWF0dXJlcylcbiAgdXNlRG9jdW1lbnRUaXRsZSh0KCd3ZWJhcHAubG9naW4nLCB7IG5zOiAnbG9naW4nIH0pKVxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggbWluLWgtc2NyZWVuIHctZnVsbCBqdXN0aWZ5LWNlbnRlciBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtYnVybiBwLTYnKX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCB3LWZ1bGwgc2hyaW5rLTAgZmxleC1jb2wgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1lZmZlY3RzLWhpZ2hsaWdodCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlJyl9PlxuICAgICAgICAgIHsvKiA8SGVhZGVyIC8+ICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCB3LWZ1bGwgZ3JvdyBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtNiBtZDpweC1bMTA4cHhdJyl9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktY2VudGVyIG1kOnctWzQ0MHB4XSBsZzp3LVs2MDBweF1cIj5cbiAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge3N5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWQgPT09IGZhbHNlICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgcHgtOCBweS02IHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgICDCqVxuICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICB7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfVxuICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICBMYW5nR2VuaXVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApXG59XG4iXX0=