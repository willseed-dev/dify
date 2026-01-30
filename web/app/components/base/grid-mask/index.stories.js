"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomBackground = exports.Playground = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/Layout/GridMask',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Displays a soft grid overlay with gradient mask, useful for framing hero sections or marketing callouts.',
            },
        },
    },
    args: {
        wrapperClassName: 'rounded-2xl p-10',
        canvasClassName: '',
        gradientClassName: '',
        children: (<div className="relative z-10 flex flex-col gap-3 text-left text-white">
        <span className="text-xs uppercase tracking-[0.16em] text-white/70">Grid Mask Demo</span>
        <span className="text-2xl font-semibold leading-tight">Beautiful backgrounds for feature highlights</span>
        <p className="max-w-md text-sm text-white/80">
          Place any content inside the mask. On dark backgrounds the grid and soft gradient add depth without distracting from the main message.
        </p>
      </div>),
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
exports.CustomBackground = {
    args: {
        wrapperClassName: 'rounded-3xl p-10 bg-[#0A0A1A]',
        gradientClassName: 'bg-gradient-to-r from-[#0A0A1A]/90 via-[#101030]/60 to-[#05050A]/90',
        children: (<div className="flex flex-col gap-2 text-white">
        <span className="text-sm font-medium text-white/80">Custom gradient</span>
        <span className="text-3xl font-semibold leading-tight">Use your own colors</span>
        <p className="max-w-md text-sm text-white/70">
          Override gradient and canvas classes to match brand palettes while keeping the grid texture.
        </p>
      </div>),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF3QjtBQUV4QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSxzQkFBc0I7SUFDN0IsU0FBUyxFQUFFLFVBQVE7SUFDbkIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFlBQVk7UUFDcEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwwR0FBMEc7YUFDdEg7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osZ0JBQWdCLEVBQUUsa0JBQWtCO1FBQ3BDLGVBQWUsRUFBRSxFQUFFO1FBQ25CLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsUUFBUSxFQUFFLENBQ1IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUNyRTtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtREFBbUQsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUN4RjtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyw0Q0FBNEMsRUFBRSxJQUFJLENBQ3pHO1FBQUEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUMzQzs7UUFDRixFQUFFLENBQUMsQ0FDTDtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztDQUNhLENBQUE7QUFFakMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBO0FBRXRCLFFBQUEsZ0JBQWdCLEdBQVU7SUFDckMsSUFBSSxFQUFFO1FBQ0osZ0JBQWdCLEVBQUUsK0JBQStCO1FBQ2pELGlCQUFpQixFQUFFLHFFQUFxRTtRQUN4RixRQUFRLEVBQUUsQ0FDUixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQzdDO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQ3pFO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FDaEY7UUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQzNDOztRQUNGLEVBQUUsQ0FBQyxDQUNMO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBHcmlkTWFzayBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvTGF5b3V0L0dyaWRNYXNrJyxcbiAgY29tcG9uZW50OiBHcmlkTWFzayxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0Rpc3BsYXlzIGEgc29mdCBncmlkIG92ZXJsYXkgd2l0aCBncmFkaWVudCBtYXNrLCB1c2VmdWwgZm9yIGZyYW1pbmcgaGVybyBzZWN0aW9ucyBvciBtYXJrZXRpbmcgY2FsbG91dHMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHdyYXBwZXJDbGFzc05hbWU6ICdyb3VuZGVkLTJ4bCBwLTEwJyxcbiAgICBjYW52YXNDbGFzc05hbWU6ICcnLFxuICAgIGdyYWRpZW50Q2xhc3NOYW1lOiAnJyxcbiAgICBjaGlsZHJlbjogKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIGZsZXggZmxleC1jb2wgZ2FwLTMgdGV4dC1sZWZ0IHRleHQtd2hpdGVcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMTZlbV0gdGV4dC13aGl0ZS83MFwiPkdyaWQgTWFzayBEZW1vPC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LXNlbWlib2xkIGxlYWRpbmctdGlnaHRcIj5CZWF1dGlmdWwgYmFja2dyb3VuZHMgZm9yIGZlYXR1cmUgaGlnaGxpZ2h0czwvc3Bhbj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwibWF4LXctbWQgdGV4dC1zbSB0ZXh0LXdoaXRlLzgwXCI+XG4gICAgICAgICAgUGxhY2UgYW55IGNvbnRlbnQgaW5zaWRlIHRoZSBtYXNrLiBPbiBkYXJrIGJhY2tncm91bmRzIHRoZSBncmlkIGFuZCBzb2Z0IGdyYWRpZW50IGFkZCBkZXB0aCB3aXRob3V0IGRpc3RyYWN0aW5nIGZyb20gdGhlIG1haW4gbWVzc2FnZS5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgR3JpZE1hc2s+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge31cblxuZXhwb3J0IGNvbnN0IEN1c3RvbUJhY2tncm91bmQ6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgd3JhcHBlckNsYXNzTmFtZTogJ3JvdW5kZWQtM3hsIHAtMTAgYmctWyMwQTBBMUFdJyxcbiAgICBncmFkaWVudENsYXNzTmFtZTogJ2JnLWdyYWRpZW50LXRvLXIgZnJvbS1bIzBBMEExQV0vOTAgdmlhLVsjMTAxMDMwXS82MCB0by1bIzA1MDUwQV0vOTAnLFxuICAgIGNoaWxkcmVuOiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTIgdGV4dC13aGl0ZVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUvODBcIj5DdXN0b20gZ3JhZGllbnQ8L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtc2VtaWJvbGQgbGVhZGluZy10aWdodFwiPlVzZSB5b3VyIG93biBjb2xvcnM8L3NwYW4+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cIm1heC13LW1kIHRleHQtc20gdGV4dC13aGl0ZS83MFwiPlxuICAgICAgICAgIE92ZXJyaWRlIGdyYWRpZW50IGFuZCBjYW52YXMgY2xhc3NlcyB0byBtYXRjaCBicmFuZCBwYWxldHRlcyB3aGlsZSBrZWVwaW5nIHRoZSBncmlkIHRleHR1cmUuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICksXG4gIH0sXG59XG4iXX0=