"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const global_public_context_1 = require("@/context/global-public-context");
const classnames_1 = require("@/utils/classnames");
const _header_1 = require("../signin/_header");
const installForm_1 = require("./installForm");
const Install = () => {
    const { systemFeatures } = (0, global_public_context_1.useGlobalPublicStore)();
    return (<div className={(0, classnames_1.cn)('flex min-h-screen w-full justify-center bg-background-default-burn p-6')}>
      <div className={(0, classnames_1.cn)('flex w-full shrink-0 flex-col rounded-2xl border border-effects-highlight bg-background-default-subtle')}>
        <_header_1.default />
        <installForm_1.default />
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
exports.default = Install;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBQ1osK0JBQThCO0FBQzlCLDJFQUFzRTtBQUN0RSxtREFBdUM7QUFDdkMsK0NBQXNDO0FBQ3RDLCtDQUF1QztBQUV2QyxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7SUFDbkIsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUEsNENBQW9CLEdBQUUsQ0FBQTtJQUNqRCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsd0VBQXdFLENBQUMsQ0FBQyxDQUMzRjtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLHdHQUF3RyxDQUFDLENBQUMsQ0FDM0g7UUFBQSxDQUFDLGlCQUFNLENBQUMsQUFBRCxFQUNQO1FBQUEsQ0FBQyxxQkFBVyxDQUFDLEFBQUQsRUFDWjtRQUFBLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUNuQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQy9EOztZQUNBLENBQUMsR0FBRyxDQUNKO1lBQUEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUN6QjtZQUFBLENBQUMsR0FBRyxDQUNKOztVQUNGLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDSDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUdsb2JhbFB1YmxpY1N0b3JlIH0gZnJvbSAnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IEhlYWRlciBmcm9tICcuLi9zaWduaW4vX2hlYWRlcidcbmltcG9ydCBJbnN0YWxsRm9ybSBmcm9tICcuL2luc3RhbGxGb3JtJ1xuXG5jb25zdCBJbnN0YWxsID0gKCkgPT4ge1xuICBjb25zdCB7IHN5c3RlbUZlYXR1cmVzIH0gPSB1c2VHbG9iYWxQdWJsaWNTdG9yZSgpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IG1pbi1oLXNjcmVlbiB3LWZ1bGwganVzdGlmeS1jZW50ZXIgYmctYmFja2dyb3VuZC1kZWZhdWx0LWJ1cm4gcC02Jyl9PlxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IHctZnVsbCBzaHJpbmstMCBmbGV4LWNvbCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0IGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUnKX0+XG4gICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgPEluc3RhbGxGb3JtIC8+XG4gICAgICAgIHshc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC04IHB5LTYgdGV4dC1zbSBmb250LW5vcm1hbCB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIMKpXG4gICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAge25ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKX1cbiAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICBMYW5nR2VuaXVzLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnN0YWxsXG4iXX0=