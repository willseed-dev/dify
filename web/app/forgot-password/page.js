"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const React = require("react");
const ChangePasswordForm_1 = require("@/app/forgot-password/ChangePasswordForm");
const global_public_context_1 = require("@/context/global-public-context");
const use_document_title_1 = require("@/hooks/use-document-title");
const classnames_1 = require("@/utils/classnames");
const _header_1 = require("../signin/_header");
const ForgotPasswordForm_1 = require("./ForgotPasswordForm");
const ForgotPassword = () => {
    (0, use_document_title_1.default)('');
    const searchParams = (0, navigation_1.useSearchParams)();
    const token = searchParams.get('token');
    const { systemFeatures } = (0, global_public_context_1.useGlobalPublicStore)();
    return (<div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
      <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
        <_header_1.default />
        {token ? <ChangePasswordForm_1.default /> : <ForgotPasswordForm_1.default />}
        {!systemFeatures.branding.enabled && (<div className="px-8 py-6 text-sm font-normal text-text-tertiary">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            LangGenius, Inc. All rights reserved.
          </div>)}
      </div>
    </div>);
};
exports.default = ForgotPassword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBQ1osZ0RBQWlEO0FBQ2pELCtCQUE4QjtBQUM5QixpRkFBeUU7QUFDekUsMkVBQXNFO0FBQ3RFLG1FQUF5RDtBQUN6RCxtREFBdUM7QUFDdkMsK0NBQXNDO0FBQ3RDLDZEQUFxRDtBQUVyRCxNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUU7SUFDMUIsSUFBQSw0QkFBZ0IsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUNwQixNQUFNLFlBQVksR0FBRyxJQUFBLDRCQUFlLEdBQUUsQ0FBQTtJQUN0QyxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3ZDLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxJQUFBLDRDQUFvQixHQUFFLENBQUE7SUFFakQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdFQUF3RSxDQUFDLENBQUMsQ0FDM0Y7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyx3R0FBd0csQ0FBQyxDQUFDLENBQzNIO1FBQUEsQ0FBQyxpQkFBTSxDQUFDLEFBQUQsRUFDUDtRQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDRCQUFrQixDQUFDLEFBQUQsRUFBRyxDQUN4RDtRQUFBLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUNuQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQy9EOztZQUNBLENBQUMsR0FBRyxDQUNKO1lBQUEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUN6QjtZQUFBLENBQUMsR0FBRyxDQUNKOztVQUNGLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDaGFuZ2VQYXNzd29yZEZvcm0gZnJvbSAnQC9hcHAvZm9yZ290LXBhc3N3b3JkL0NoYW5nZVBhc3N3b3JkRm9ybSdcbmltcG9ydCB7IHVzZUdsb2JhbFB1YmxpY1N0b3JlIH0gZnJvbSAnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCdcbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJ0AvaG9va3MvdXNlLWRvY3VtZW50LXRpdGxlJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4uL3NpZ25pbi9faGVhZGVyJ1xuaW1wb3J0IEZvcmdvdFBhc3N3b3JkRm9ybSBmcm9tICcuL0ZvcmdvdFBhc3N3b3JkRm9ybSdcblxuY29uc3QgRm9yZ290UGFzc3dvcmQgPSAoKSA9PiB7XG4gIHVzZURvY3VtZW50VGl0bGUoJycpXG4gIGNvbnN0IHNlYXJjaFBhcmFtcyA9IHVzZVNlYXJjaFBhcmFtcygpXG4gIGNvbnN0IHRva2VuID0gc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKVxuICBjb25zdCB7IHN5c3RlbUZlYXR1cmVzIH0gPSB1c2VHbG9iYWxQdWJsaWNTdG9yZSgpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggbWluLWgtc2NyZWVuIHctZnVsbCBqdXN0aWZ5LWNlbnRlciBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtYnVybiBwLTYnKX0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2ZsZXggdy1mdWxsIHNocmluay0wIGZsZXgtY29sIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZScpfT5cbiAgICAgICAgPEhlYWRlciAvPlxuICAgICAgICB7dG9rZW4gPyA8Q2hhbmdlUGFzc3dvcmRGb3JtIC8+IDogPEZvcmdvdFBhc3N3b3JkRm9ybSAvPn1cbiAgICAgICAgeyFzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy5lbmFibGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTggcHktNiB0ZXh0LXNtIGZvbnQtbm9ybWFsIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAgICAgICAgwqlcbiAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICB7bmV3IERhdGUoKS5nZXRGdWxsWWVhcigpfVxuICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgIExhbmdHZW5pdXMsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcmdvdFBhc3N3b3JkXG4iXX0=