"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const next_themes_1 = require("next-themes");
const dify_logo_1 = require("./dify-logo");
const logo_embedded_chat_avatar_1 = require("./logo-embedded-chat-avatar");
const logo_embedded_chat_header_1 = require("./logo-embedded-chat-header");
const logo_site_1 = require("./logo-site");
const meta = {
    title: 'Base/General/Logo',
    component: dify_logo_1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Brand assets rendered in different contexts. DifyLogo adapts to the active theme while other variants target specific surfaces.',
            },
        },
    },
    args: {
        size: 'medium',
        style: 'default',
    },
    argTypes: {
        size: {
            control: 'radio',
            options: ['large', 'medium', 'small'],
        },
        style: {
            control: 'radio',
            options: ['default', 'monochromeWhite'],
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const ThemePreview = ({ theme, children }) => {
    return (<next_themes_1.ThemeProvider attribute="data-theme" forcedTheme={theme} enableSystem={false}>
      <div className="min-w-[320px] rounded-2xl border border-divider-subtle bg-background-default-subtle p-6 shadow-sm">
        {children}
      </div>
    </next_themes_1.ThemeProvider>);
};
exports.Playground = {
    render: ({ size, style }) => {
        return (<ThemePreview theme="dark">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-text-tertiary">Primary logo</span>
            <div className="flex items-center justify-between rounded-xl border border-divider-subtle bg-background-default p-4">
              <dify_logo_1.default size={size} style={style}/>
              <code className="text-[11px] text-text-tertiary">{`size="${size}" | style="${style}"`}</code>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-xl border border-divider-subtle bg-background-default p-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-tertiary">Site favicon</span>
              <logo_site_1.default />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-divider-subtle bg-background-default p-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-tertiary">Embedded header</span>
              <logo_embedded_chat_header_1.default />
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-divider-subtle bg-background-default p-4 sm:col-span-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-tertiary">Embedded avatar</span>
              <logo_embedded_chat_avatar_1.default className="border-divider-strong rounded-2xl border"/>
            </div>
          </div>
        </div>
      </ThemePreview>);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDZDQUEyQztBQUMzQywyQ0FBa0M7QUFDbEMsMkVBQWdFO0FBQ2hFLDJFQUFnRTtBQUNoRSwyQ0FBa0M7QUFFbEMsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsbUJBQW1CO0lBQzFCLFNBQVMsRUFBRSxtQkFBUTtJQUNuQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLGlJQUFpSTthQUM3STtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsUUFBUTtRQUNkLEtBQUssRUFBRSxTQUFTO0tBQ2pCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUM7U0FDdEM7UUFDRCxLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUM7U0FDeEM7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNhLENBQUE7QUFFakMsa0JBQWUsSUFBSSxDQUFBO0FBR25CLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFvRCxFQUFFLEVBQUU7SUFDN0YsT0FBTyxDQUNMLENBQUMsMkJBQWEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUM1RTtNQUFBLENBQUMsR0FBRyxDQUNGLFNBQVMsQ0FBQyxtR0FBbUcsQ0FFN0c7UUFBQSxDQUFDLFFBQVEsQ0FDWDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSwyQkFBYSxDQUFDLENBQ2pCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQzFCLE9BQU8sQ0FDTCxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUN4QjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FDbEM7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQ2xDO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUFDLFlBQVksRUFBRSxJQUFJLENBQzNGO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFHQUFxRyxDQUNsSDtjQUFBLENBQUMsbUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFDbkM7Y0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxTQUFTLElBQUksY0FBYyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FDOUY7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUN4QztZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1RkFBdUYsQ0FDcEc7Y0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUVBQXVFLENBQUMsWUFBWSxFQUFFLElBQUksQ0FDMUc7Y0FBQSxDQUFDLG1CQUFRLENBQUMsQUFBRCxFQUNYO1lBQUEsRUFBRSxHQUFHLENBQ0w7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUZBQXVGLENBQ3BHO2NBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVFQUF1RSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQzdHO2NBQUEsQ0FBQyxtQ0FBc0IsQ0FBQyxBQUFELEVBQ3pCO1lBQUEsRUFBRSxHQUFHLENBQ0w7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUdBQXFHLENBQ2xIO2NBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHVFQUF1RSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQzdHO2NBQUEsQ0FBQyxtQ0FBc0IsQ0FBQyxTQUFTLENBQUMsMENBQTBDLEVBQzlFO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxZQUFZLENBQUMsQ0FDaEIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIgfSBmcm9tICduZXh0LXRoZW1lcydcbmltcG9ydCBEaWZ5TG9nbyBmcm9tICcuL2RpZnktbG9nbydcbmltcG9ydCBMb2dvRW1iZWRkZWRDaGF0QXZhdGFyIGZyb20gJy4vbG9nby1lbWJlZGRlZC1jaGF0LWF2YXRhcidcbmltcG9ydCBMb2dvRW1iZWRkZWRDaGF0SGVhZGVyIGZyb20gJy4vbG9nby1lbWJlZGRlZC1jaGF0LWhlYWRlcidcbmltcG9ydCBMb2dvU2l0ZSBmcm9tICcuL2xvZ28tc2l0ZSdcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvTG9nbycsXG4gIGNvbXBvbmVudDogRGlmeUxvZ28sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQnJhbmQgYXNzZXRzIHJlbmRlcmVkIGluIGRpZmZlcmVudCBjb250ZXh0cy4gRGlmeUxvZ28gYWRhcHRzIHRvIHRoZSBhY3RpdmUgdGhlbWUgd2hpbGUgb3RoZXIgdmFyaWFudHMgdGFyZ2V0IHNwZWNpZmljIHN1cmZhY2VzLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICBzaXplOiAnbWVkaXVtJyxcbiAgICBzdHlsZTogJ2RlZmF1bHQnLFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIHNpemU6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBbJ2xhcmdlJywgJ21lZGl1bScsICdzbWFsbCddLFxuICAgIH0sXG4gICAgc3R5bGU6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBbJ2RlZmF1bHQnLCAnbW9ub2Nocm9tZVdoaXRlJ10sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgRGlmeUxvZ28+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgVGhlbWVQcmV2aWV3ID0gKHsgdGhlbWUsIGNoaWxkcmVuIH06IHsgdGhlbWU6ICdsaWdodCcgfCAnZGFyaycsIGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxUaGVtZVByb3ZpZGVyIGF0dHJpYnV0ZT1cImRhdGEtdGhlbWVcIiBmb3JjZWRUaGVtZT17dGhlbWV9IGVuYWJsZVN5c3RlbT17ZmFsc2V9PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJtaW4tdy1bMzIwcHhdIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSBwLTYgc2hhZG93LXNtXCJcbiAgICAgID5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoeyBzaXplLCBzdHlsZSB9KSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUaGVtZVByZXZpZXcgdGhlbWU9XCJkYXJrXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtNlwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMlwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+UHJpbWFyeSBsb2dvPC9zcGFuPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBwLTRcIj5cbiAgICAgICAgICAgICAgPERpZnlMb2dvIHNpemU9e3NpemV9IHN0eWxlPXtzdHlsZX0gLz5cbiAgICAgICAgICAgICAgPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e2BzaXplPVwiJHtzaXplfVwiIHwgc3R5bGU9XCIke3N0eWxlfVwiYH08L2NvZGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ2FwLTQgc206Z3JpZC1jb2xzLTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMiByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0IHAtNFwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMWVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5TaXRlIGZhdmljb248L3NwYW4+XG4gICAgICAgICAgICAgIDxMb2dvU2l0ZSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTIgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBwLTRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gZm9udC1tZWRpdW0gdXBwZXJjYXNlIHRyYWNraW5nLVswLjFlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+RW1iZWRkZWQgaGVhZGVyPC9zcGFuPlxuICAgICAgICAgICAgICA8TG9nb0VtYmVkZGVkQ2hhdEhlYWRlciAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTIgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBwLTQgc206Y29sLXNwYW4tMlwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSBmb250LW1lZGl1bSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMWVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5FbWJlZGRlZCBhdmF0YXI8L3NwYW4+XG4gICAgICAgICAgICAgIDxMb2dvRW1iZWRkZWRDaGF0QXZhdGFyIGNsYXNzTmFtZT1cImJvcmRlci1kaXZpZGVyLXN0cm9uZyByb3VuZGVkLTJ4bCBib3JkZXJcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9UaGVtZVByZXZpZXc+XG4gICAgKVxuICB9LFxufVxuIl19