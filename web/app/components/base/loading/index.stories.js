"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSpinner = exports.AreaSpinner = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/Loading',
    component: _1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Spinner used while fetching data (`area`) or bootstrapping the full application shell (`app`).',
            },
        },
    },
    argTypes: {
        type: {
            control: 'radio',
            options: ['area', 'app'],
        },
    },
    args: {
        type: 'area',
    },
    tags: ['autodocs'],
};
exports.default = meta;
const LoadingPreview = ({ type }) => {
    const containerHeight = type === 'app' ? 'h-48' : 'h-20';
    const title = type === 'app' ? 'App loading state' : 'Inline loading state';
    return (<div className="flex flex-col items-center gap-4">
      <span className="text-xs uppercase tracking-[0.18em] text-text-tertiary">{title}</span>
      <div className={`flex w-64 items-center justify-center rounded-xl border border-divider-subtle bg-background-default-subtle ${containerHeight}`}>
        <_1.default type={type}/>
      </div>
    </div>);
};
exports.AreaSpinner = {
    render: () => <LoadingPreview type="area"/>,
};
exports.AppSpinner = {
    render: () => <LoadingPreview type="app"/>,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF1QjtBQUV2QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx1QkFBdUI7SUFDOUIsU0FBUyxFQUFFLFVBQU87SUFDbEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxnR0FBZ0c7YUFDNUc7U0FDRjtLQUNGO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLE9BQU87WUFDaEIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztTQUN6QjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNZLENBQUE7QUFFaEMsa0JBQWUsSUFBSSxDQUFBO0FBR25CLE1BQU0sY0FBYyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQTRCLEVBQUUsRUFBRTtJQUM1RCxNQUFNLGVBQWUsR0FBRyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtJQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUE7SUFFM0UsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FDL0M7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQ3RGO01BQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLENBQUMsOEdBQThHLGVBQWUsRUFBRSxDQUFDLENBRTNJO1FBQUEsQ0FBQyxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ3RCO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFdBQVcsR0FBVTtJQUNoQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRztDQUM3QyxDQUFBO0FBRVksUUFBQSxVQUFVLEdBQVU7SUFDL0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUc7Q0FDNUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBMb2FkaW5nIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Mb2FkaW5nJyxcbiAgY29tcG9uZW50OiBMb2FkaW5nLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1NwaW5uZXIgdXNlZCB3aGlsZSBmZXRjaGluZyBkYXRhIChgYXJlYWApIG9yIGJvb3RzdHJhcHBpbmcgdGhlIGZ1bGwgYXBwbGljYXRpb24gc2hlbGwgKGBhcHBgKS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIHR5cGU6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBbJ2FyZWEnLCAnYXBwJ10sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHR5cGU6ICdhcmVhJyxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTG9hZGluZz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBMb2FkaW5nUHJldmlldyA9ICh7IHR5cGUgfTogeyB0eXBlOiAnYXJlYScgfCAnYXBwJyB9KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IHR5cGUgPT09ICdhcHAnID8gJ2gtNDgnIDogJ2gtMjAnXG4gIGNvbnN0IHRpdGxlID0gdHlwZSA9PT0gJ2FwcCcgPyAnQXBwIGxvYWRpbmcgc3RhdGUnIDogJ0lubGluZSBsb2FkaW5nIHN0YXRlJ1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtNFwiPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3RpdGxlfTwvc3Bhbj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPXtgZmxleCB3LTY0IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctYmFja2dyb3VuZC1kZWZhdWx0LXN1YnRsZSAke2NvbnRhaW5lckhlaWdodH1gfVxuICAgICAgPlxuICAgICAgICA8TG9hZGluZyB0eXBlPXt0eXBlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IEFyZWFTcGlubmVyOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8TG9hZGluZ1ByZXZpZXcgdHlwZT1cImFyZWFcIiAvPixcbn1cblxuZXhwb3J0IGNvbnN0IEFwcFNwaW5uZXI6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxMb2FkaW5nUHJldmlldyB0eXBlPVwiYXBwXCIgLz4sXG59XG4iXX0=