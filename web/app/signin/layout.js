"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignInLayout;
const global_public_context_1 = require("@/context/global-public-context");
const use_document_title_1 = require("@/hooks/use-document-title");
const classnames_1 = require("@/utils/classnames");
const _header_1 = require("./_header");
function SignInLayout({ children }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQU9aLCtCQTBCQztBQWhDRCwyRUFBc0U7QUFFdEUsbUVBQXlEO0FBQ3pELG1EQUF1QztBQUN2Qyx1Q0FBOEI7QUFFOUIsU0FBd0IsWUFBWSxDQUFDLEVBQUUsUUFBUSxFQUFPO0lBQ3BELE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLDRDQUFvQixHQUFFLENBQUE7SUFDakQsSUFBQSw0QkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQixPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdFQUF3RSxDQUFDLENBQUMsQ0FDM0Y7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxxSEFBcUgsQ0FBQyxDQUFDLENBQ3hJO1VBQUEsQ0FBQyxpQkFBTSxDQUFDLEFBQUQsRUFDUDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDBFQUEwRSxDQUFDLENBQUMsQ0FDN0Y7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO2NBQUEsQ0FBQyxRQUFRLENBQ1g7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxLQUFLLElBQUksQ0FDNUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdEQUFnRCxDQUM3RDs7Y0FDQSxDQUFDLEdBQUcsQ0FDSjtjQUFBLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FDekI7Y0FBQSxDQUFDLEdBQUcsQ0FDSjs7WUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQ0g7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSB9IGZyb20gJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnXG5cbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJ0AvaG9va3MvdXNlLWRvY3VtZW50LXRpdGxlJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vX2hlYWRlcidcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2lnbkluTGF5b3V0KHsgY2hpbGRyZW4gfTogYW55KSB7XG4gIGNvbnN0IHsgc3lzdGVtRmVhdHVyZXMgfSA9IHVzZUdsb2JhbFB1YmxpY1N0b3JlKClcbiAgdXNlRG9jdW1lbnRUaXRsZSgnJylcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IG1pbi1oLXNjcmVlbiB3LWZ1bGwganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZC1kZWZhdWx0LWJ1cm4gcC02Jyl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggdy1mdWxsIHNocmluay0wIGZsZXgtY29sIGl0ZW1zLWNlbnRlciByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0IGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUnKX0+XG4gICAgICAgICAgPEhlYWRlciAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCB3LWZ1bGwgZ3JvdyBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcHgtNiBtZDpweC1bMTA4cHhdJyl9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIG1kOnctWzQwMHB4XVwiPlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7c3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCA9PT0gZmFsc2UgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBweC04IHB5LTYgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgIMKpXG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIExhbmdHZW5pdXMsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gIClcbn1cbiJdfQ==