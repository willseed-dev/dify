"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const app_initializer_1 = require("@/app/components/app-initializer");
const amplitude_1 = require("@/app/components/base/amplitude");
const ga_1 = require("@/app/components/base/ga");
const zendesk_1 = require("@/app/components/base/zendesk");
const goto_anything_1 = require("@/app/components/goto-anything");
const header_1 = require("@/app/components/header");
const header_wrapper_1 = require("@/app/components/header/header-wrapper");
const readme_panel_1 = require("@/app/components/plugins/readme-panel");
const app_context_1 = require("@/context/app-context");
const event_emitter_1 = require("@/context/event-emitter");
const modal_context_1 = require("@/context/modal-context");
const provider_context_1 = require("@/context/provider-context");
const partner_stack_1 = require("../components/billing/partner-stack");
const splash_1 = require("../components/splash");
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
                {children}
                <partner_stack_1.default />
                <readme_panel_1.default />
                <goto_anything_1.default />
                <splash_1.default />
              </modal_context_1.ModalContextProvider>
            </provider_context_1.ProviderContextProvider>
          </event_emitter_1.EventEmitterContextProvider>
        </app_context_1.AppContextProvider>
        <zendesk_1.default />
      </app_initializer_1.AppInitializer>
    </>);
};
exports.default = Layout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtCQUE4QjtBQUM5QixzRUFBaUU7QUFDakUsK0RBQStEO0FBQy9ELGlEQUFxRDtBQUNyRCwyREFBbUQ7QUFDbkQsa0VBQXlEO0FBQ3pELG9EQUE0QztBQUM1QywyRUFBa0U7QUFDbEUsd0VBQStEO0FBQy9ELHVEQUEwRDtBQUMxRCwyREFBcUU7QUFDckUsMkRBQThEO0FBQzlELGlFQUFvRTtBQUNwRSx1RUFBOEQ7QUFDOUQsaURBQXlDO0FBRXpDLE1BQU0sTUFBTSxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQTJCLEVBQUUsRUFBRTtJQUN2RCxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQU0sQ0FBQyxLQUFLLENBQUMsRUFDekI7TUFBQSxDQUFDLG1CQUFpQixDQUFDLEFBQUQsRUFDbEI7TUFBQSxDQUFDLGdDQUFjLENBQ2I7UUFBQSxDQUFDLGdDQUFrQixDQUNqQjtVQUFBLENBQUMsMkNBQTJCLENBQzFCO1lBQUEsQ0FBQywwQ0FBdUIsQ0FDdEI7Y0FBQSxDQUFDLG9DQUFvQixDQUNuQjtnQkFBQSxDQUFDLHdCQUFhLENBQ1o7a0JBQUEsQ0FBQyxnQkFBTSxDQUFDLEFBQUQsRUFDVDtnQkFBQSxFQUFFLHdCQUFhLENBQ2Y7Z0JBQUEsQ0FBQyxRQUFRLENBQ1Q7Z0JBQUEsQ0FBQyx1QkFBWSxDQUFDLEFBQUQsRUFDYjtnQkFBQSxDQUFDLHNCQUFXLENBQUMsQUFBRCxFQUNaO2dCQUFBLENBQUMsdUJBQVksQ0FBQyxBQUFELEVBQ2I7Z0JBQUEsQ0FBQyxnQkFBTSxDQUFDLEFBQUQsRUFDVDtjQUFBLEVBQUUsb0NBQW9CLENBQ3hCO1lBQUEsRUFBRSwwQ0FBdUIsQ0FDM0I7VUFBQSxFQUFFLDJDQUEyQixDQUMvQjtRQUFBLEVBQUUsZ0NBQWtCLENBQ3BCO1FBQUEsQ0FBQyxpQkFBTyxDQUFDLEFBQUQsRUFDVjtNQUFBLEVBQUUsZ0NBQWMsQ0FDbEI7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFwcEluaXRpYWxpemVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAtaW5pdGlhbGl6ZXInXG5pbXBvcnQgQW1wbGl0dWRlUHJvdmlkZXIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZSdcbmltcG9ydCBHQSwgeyBHYVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZ2EnXG5pbXBvcnQgWmVuZGVzayBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvemVuZGVzaydcbmltcG9ydCBHb3RvQW55dGhpbmcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9nb3RvLWFueXRoaW5nJ1xuaW1wb3J0IEhlYWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlcidcbmltcG9ydCBIZWFkZXJXcmFwcGVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2hlYWRlci13cmFwcGVyJ1xuaW1wb3J0IFJlYWRtZVBhbmVsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9yZWFkbWUtcGFuZWwnXG5pbXBvcnQgeyBBcHBDb250ZXh0UHJvdmlkZXIgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXJDb250ZXh0UHJvdmlkZXIgfSBmcm9tICdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcidcbmltcG9ydCB7IE1vZGFsQ29udGV4dFByb3ZpZGVyIH0gZnJvbSAnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnXG5pbXBvcnQgeyBQcm92aWRlckNvbnRleHRQcm92aWRlciB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IFBhcnRuZXJTdGFjayBmcm9tICcuLi9jb21wb25lbnRzL2JpbGxpbmcvcGFydG5lci1zdGFjaydcbmltcG9ydCBTcGxhc2ggZnJvbSAnLi4vY29tcG9uZW50cy9zcGxhc2gnXG5cbmNvbnN0IExheW91dCA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxHQSBnYVR5cGU9e0dhVHlwZS5hZG1pbn0gLz5cbiAgICAgIDxBbXBsaXR1ZGVQcm92aWRlciAvPlxuICAgICAgPEFwcEluaXRpYWxpemVyPlxuICAgICAgICA8QXBwQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgIDxFdmVudEVtaXR0ZXJDb250ZXh0UHJvdmlkZXI+XG4gICAgICAgICAgICA8UHJvdmlkZXJDb250ZXh0UHJvdmlkZXI+XG4gICAgICAgICAgICAgIDxNb2RhbENvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICAgICAgICA8SGVhZGVyV3JhcHBlcj5cbiAgICAgICAgICAgICAgICAgIDxIZWFkZXIgLz5cbiAgICAgICAgICAgICAgICA8L0hlYWRlcldyYXBwZXI+XG4gICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgIDxQYXJ0bmVyU3RhY2sgLz5cbiAgICAgICAgICAgICAgICA8UmVhZG1lUGFuZWwgLz5cbiAgICAgICAgICAgICAgICA8R290b0FueXRoaW5nIC8+XG4gICAgICAgICAgICAgICAgPFNwbGFzaCAvPlxuICAgICAgICAgICAgICA8L01vZGFsQ29udGV4dFByb3ZpZGVyPlxuICAgICAgICAgICAgPC9Qcm92aWRlckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgICA8L0V2ZW50RW1pdHRlckNvbnRleHRQcm92aWRlcj5cbiAgICAgICAgPC9BcHBDb250ZXh0UHJvdmlkZXI+XG4gICAgICAgIDxaZW5kZXNrIC8+XG4gICAgICA8L0FwcEluaXRpYWxpemVyPlxuICAgIDwvPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBMYXlvdXRcbiJdfQ==