"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/FullScreenModal',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Backdrop-blurred fullscreen modal. Supports close button, custom content, and optional overflow visibility.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const ModalDemo = (props) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    return (<div className="flex h-[360px] items-center justify-center bg-background-default-subtle">
      <button type="button" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Launch full-screen modal
      </button>

      <_1.default {...props} open={open} onClose={() => setOpen(false)} closable>
        <div className="flex h-full flex-col bg-background-default-subtle">
          <div className="flex h-16 items-center justify-center border-b border-divider-subtle text-lg font-semibold text-text-primary">
            Full-screen experience
          </div>
          <div className="flex flex-1 items-center justify-center text-sm text-text-secondary">
            Place dashboards, flow builders, or immersive previews here.
          </div>
        </div>
      </_1.default>
    </div>);
};
exports.Playground = {
    render: args => <ModalDemo {...args}/>,
    args: {
        open: false,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBK0I7QUFFL0IsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsK0JBQStCO0lBQ3RDLFNBQVMsRUFBRSxVQUFlO0lBQzFCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsNkdBQTZHO2FBQ3pIO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNvQixDQUFBO0FBRXhDLGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQW1ELEVBQUUsRUFBRTtJQUN4RSxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUV2QyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlFQUF5RSxDQUN0RjtNQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLG1HQUFtRyxDQUM3RyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFN0I7O01BQ0YsRUFBRSxNQUFNLENBRVI7O01BQUEsQ0FBQyxVQUFlLENBQ2QsSUFBSSxLQUFLLENBQUMsQ0FDVixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDWCxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDOUIsUUFBUSxDQUVSO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1EQUFtRCxDQUNoRTtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw4R0FBOEcsQ0FDM0g7O1VBQ0YsRUFBRSxHQUFHLENBQ0w7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUVBQXFFLENBQ2xGOztVQUNGLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLFVBQWUsQ0FDbkI7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3ZDLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxLQUFLO0tBQ1o7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBGdWxsU2NyZWVuTW9kYWwgZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL0Z1bGxTY3JlZW5Nb2RhbCcsXG4gIGNvbXBvbmVudDogRnVsbFNjcmVlbk1vZGFsLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnZnVsbHNjcmVlbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnQmFja2Ryb3AtYmx1cnJlZCBmdWxsc2NyZWVuIG1vZGFsLiBTdXBwb3J0cyBjbG9zZSBidXR0b24sIGN1c3RvbSBjb250ZW50LCBhbmQgb3B0aW9uYWwgb3ZlcmZsb3cgdmlzaWJpbGl0eS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGdWxsU2NyZWVuTW9kYWw+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgTW9kYWxEZW1vID0gKHByb3BzOiBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRnVsbFNjcmVlbk1vZGFsPikgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLVszNjBweF0gaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGVcIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtNCBweS0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBzaGFkb3ctc20gaG92ZXI6YmctcHJpbWFyeS03MDBcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgPlxuICAgICAgICBMYXVuY2ggZnVsbC1zY3JlZW4gbW9kYWxcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICA8RnVsbFNjcmVlbk1vZGFsXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgb3Blbj17b3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAgIGNsb3NhYmxlXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgZmxleC1jb2wgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTE2IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBib3JkZXItYiBib3JkZXItZGl2aWRlci1zdWJ0bGUgdGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgICAgICBGdWxsLXNjcmVlbiBleHBlcmllbmNlXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtMSBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICBQbGFjZSBkYXNoYm9hcmRzLCBmbG93IGJ1aWxkZXJzLCBvciBpbW1lcnNpdmUgcHJldmlld3MgaGVyZS5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0Z1bGxTY3JlZW5Nb2RhbD5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8TW9kYWxEZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIG9wZW46IGZhbHNlLFxuICB9LFxufVxuIl19