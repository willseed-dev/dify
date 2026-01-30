"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignInLayout;
const global_public_context_1 = require("@/context/global-public-context");
const classnames_1 = require("@/utils/classnames");
const _header_1 = require("../signin/_header");
function SignInLayout({ children }) {
    const { systemFeatures } = (0, global_public_context_1.useGlobalPublicStore)();
    return (<>
      <div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
        <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
          <_header_1.default />
          <div className={(0, classnames_1.cn)('flex w-full grow flex-col items-center justify-center', 'px-6', 'md:px-[108px]')}>
            <div className="flex flex-col md:w-[400px]">
              {children}
            </div>
          </div>
          {!systemFeatures.branding.enabled && (<div className="system-xs-regular px-8 py-6 text-text-tertiary">
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQU1aLCtCQWdDQztBQXJDRCwyRUFBc0U7QUFFdEUsbURBQXVDO0FBQ3ZDLCtDQUFzQztBQUV0QyxTQUF3QixZQUFZLENBQUMsRUFBRSxRQUFRLEVBQU87SUFDcEQsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUEsNENBQW9CLEdBQUUsQ0FBQTtJQUNqRCxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdFQUF3RSxDQUFDLENBQUMsQ0FDM0Y7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx3R0FBd0csQ0FBQyxDQUFDLENBQzNIO1VBQUEsQ0FBQyxpQkFBTSxDQUFDLEFBQUQsRUFDUDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUNiLElBQUEsZUFBRSxFQUNBLHVEQUF1RCxFQUN2RCxNQUFNLEVBQ04sZUFBZSxDQUVuQixDQUFDLENBRUM7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO2NBQUEsQ0FBQyxRQUFRLENBQ1g7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLENBQ25DLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnREFBZ0QsQ0FDN0Q7O2NBQ0EsQ0FBQyxHQUFHLENBQ0o7Y0FBQSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQ3pCO2NBQUEsQ0FBQyxHQUFHLENBQ0o7O1lBQ0YsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUNIO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi4vc2lnbmluL19oZWFkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpZ25JbkxheW91dCh7IGNoaWxkcmVuIH06IGFueSkge1xuICBjb25zdCB7IHN5c3RlbUZlYXR1cmVzIH0gPSB1c2VHbG9iYWxQdWJsaWNTdG9yZSgpXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBtaW4taC1zY3JlZW4gdy1mdWxsIGp1c3RpZnktY2VudGVyIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuIHAtNicpfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IHctZnVsbCBzaHJpbmstMCBmbGV4LWNvbCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0IGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUnKX0+XG4gICAgICAgICAgPEhlYWRlciAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtcbiAgICAgICAgICAgIGNuKFxuICAgICAgICAgICAgICAnZmxleCB3LWZ1bGwgZ3JvdyBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXInLFxuICAgICAgICAgICAgICAncHgtNicsXG4gICAgICAgICAgICAgICdtZDpweC1bMTA4cHhdJyxcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIG1kOnctWzQwMHB4XVwiPlxuICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICB7IXN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWQgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciBweC04IHB5LTYgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgIMKpXG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIHtuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCl9XG4gICAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICAgIExhbmdHZW5pdXMsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gIClcbn1cbiJdfQ==