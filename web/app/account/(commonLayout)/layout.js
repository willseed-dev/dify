"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const app_initializer_1 = require("@/app/components/app-initializer");
const amplitude_1 = require("@/app/components/base/amplitude");
const ga_1 = require("@/app/components/base/ga");
const header_wrapper_1 = require("@/app/components/header/header-wrapper");
const app_context_1 = require("@/context/app-context");
const event_emitter_1 = require("@/context/event-emitter");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const header_1 = require("./header");
const Layout = ({ children }) => {
    return (<>
      <ga_1.default gaType={ga_1.GaType.admin}/>
      <amplitude_1.default />
      <app_initializer_1.AppInitializer>
        <app_context_1.AppContextProvider>
          <event_emitter_1.EventEmitterContextProvider>
            <provider_context_1.ProviderContextProvider>
              <modal_context_1.ModalContextProvider>
                <header_wrapper_1.default>
                  <header_1.default />
                </header_wrapper_1.default>
                <div className="relative flex h-0 shrink-0 grow flex-col overflow-y-auto bg-components-panel-bg">
                  {children}
                </div>
              </modal_context_1.ModalContextProvider>
            </provider_context_1.ProviderContextProvider>
          </event_emitter_1.EventEmitterContextProvider>
        </app_context_1.AppContextProvider>
      </app_initializer_1.AppInitializer>
    </>);
};
exports.default = Layout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtCQUE4QjtBQUM5QixzRUFBaUU7QUFDakUsK0RBQStEO0FBQy9ELGlEQUFxRDtBQUNyRCwyRUFBa0U7QUFDbEUsdURBQTBEO0FBQzFELDJEQUFxRTtBQUNyRSwyREFBOEQ7QUFDOUQsaUVBQW9FO0FBQ3BFLHFDQUE2QjtBQUU3QixNQUFNLE1BQU0sR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUEyQixFQUFFLEVBQUU7SUFDdkQsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLFlBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFNLENBQUMsS0FBSyxDQUFDLEVBQ3pCO01BQUEsQ0FBQyxtQkFBaUIsQ0FBQyxBQUFELEVBQ2xCO01BQUEsQ0FBQyxnQ0FBYyxDQUNiO1FBQUEsQ0FBQyxnQ0FBa0IsQ0FDakI7VUFBQSxDQUFDLDJDQUEyQixDQUMxQjtZQUFBLENBQUMsMENBQXVCLENBQ3RCO2NBQUEsQ0FBQyxvQ0FBb0IsQ0FDbkI7Z0JBQUEsQ0FBQyx3QkFBYSxDQUNaO2tCQUFBLENBQUMsZ0JBQU0sQ0FBQyxBQUFELEVBQ1Q7Z0JBQUEsRUFBRSx3QkFBYSxDQUNmO2dCQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsQ0FDOUY7a0JBQUEsQ0FBQyxRQUFRLENBQ1g7Z0JBQUEsRUFBRSxHQUFHLENBQ1A7Y0FBQSxFQUFFLG9DQUFvQixDQUN4QjtZQUFBLEVBQUUsMENBQXVCLENBQzNCO1VBQUEsRUFBRSwyQ0FBMkIsQ0FDL0I7UUFBQSxFQUFFLGdDQUFrQixDQUN0QjtNQUFBLEVBQUUsZ0NBQWMsQ0FDbEI7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwcEluaXRpYWxpemVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAtaW5pdGlhbGl6ZXInXG5pbXBvcnQgQW1wbGl0dWRlUHJvdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZSdcbmltcG9ydCBHQSwgeyBHYVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZ2EnXG5pbXBvcnQgSGVhZGVyV3JhcHBlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9oZWFkZXItd3JhcHBlcidcbmltcG9ydCB7IEFwcENvbnRleHRQcm92aWRlciB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IEV2ZW50RW1pdHRlckNvbnRleHRQcm92aWRlciB9IGZyb20gJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJ1xuaW1wb3J0IHsgTW9kYWxDb250ZXh0UHJvdmlkZXIgfSBmcm9tICdAL2NvbnRleHQvbW9kYWwtY29udGV4dCdcbmltcG9ydCB7IFByb3ZpZGVyQ29udGV4dFByb3ZpZGVyIH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vaGVhZGVyJ1xuXG5jb25zdCBMYXlvdXQgPSAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8R0EgZ2FUeXBlPXtHYVR5cGUuYWRtaW59IC8+XG4gICAgICA8QW1wbGl0dWRlUHJvdmlkZXIgLz5cbiAgICAgIDxBcHBJbml0aWFsaXplcj5cbiAgICAgICAgPEFwcENvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICA8RXZlbnRFbWl0dGVyQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgICAgPFByb3ZpZGVyQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgICAgICA8TW9kYWxDb250ZXh0UHJvdmlkZXI+XG4gICAgICAgICAgICAgICAgPEhlYWRlcldyYXBwZXI+XG4gICAgICAgICAgICAgICAgICA8SGVhZGVyIC8+XG4gICAgICAgICAgICAgICAgPC9IZWFkZXJXcmFwcGVyPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBoLTAgc2hyaW5rLTAgZ3JvdyBmbGV4LWNvbCBvdmVyZmxvdy15LWF1dG8gYmctY29tcG9uZW50cy1wYW5lbC1iZ1wiPlxuICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L01vZGFsQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgICAgPC9Qcm92aWRlckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICA8L0V2ZW50RW1pdHRlckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgPC9BcHBDb250ZXh0UHJvdmlkZXI+XG4gICAgICA8L0FwcEluaXRpYWxpemVyPlxuICAgIDwvPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBMYXlvdXRcbiJdfQ==