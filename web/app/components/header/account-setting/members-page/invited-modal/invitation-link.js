"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const copy_to_clipboard_1 = require("copy-to-clipboard");
const i18next_1 = require("i18next");
const React = require("react");
const react_1 = require("react");
const tooltip_1 = require("@/app/components/base/tooltip");
const index_module_css_1 = require("./index.module.css");
const InvitationLink = ({ value, }) => {
    const [isCopied, setIsCopied] = (0, react_1.useState)(false);
    const copyHandle = (0, react_1.useCallback)(() => {
        // No prefix is needed here because the backend has already processed it
        (0, copy_to_clipboard_1.default)(`${!value.url.startsWith('http') ? window.location.origin : ''}${value.url}`);
        setIsCopied(true);
    }, [value]);
    (0, react_1.useEffect)(() => {
        if (isCopied) {
            const timeout = setTimeout(() => {
                setIsCopied(false);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isCopied]);
    return (<div className="flex items-center rounded-lg border border-components-input-border-active bg-components-input-bg-normal py-2 hover:bg-state-base-hover">
      <div className="flex h-5 grow items-center">
        <div className="relative h-full grow text-[13px]">
          <tooltip_1.default popupContent={isCopied ? `${(0, i18next_1.t)('copied', { ns: 'appApi' })}` : `${(0, i18next_1.t)('copy', { ns: 'appApi' })}`}>
            <div className="r-0 absolute left-0 top-0 w-full cursor-pointer truncate pl-2 pr-2 text-text-primary" onClick={copyHandle}>{value.url}</div>
          </tooltip_1.default>
        </div>
        <div className="h-4 shrink-0 border bg-divider-regular"/>
        <tooltip_1.default popupContent={isCopied ? `${(0, i18next_1.t)('copied', { ns: 'appApi' })}` : `${(0, i18next_1.t)('copy', { ns: 'appApi' })}`}>
          <div className="shrink-0 px-0.5">
            <div className={`box-border flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover ${index_module_css_1.default.copyIcon} ${isCopied ? index_module_css_1.default.copied : ''}`} onClick={copyHandle}>
            </div>
          </div>
        </tooltip_1.default>
      </div>
    </div>);
};
exports.default = InvitationLink;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRhdGlvbi1saW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW52aXRhdGlvbi1saW5rLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLHlEQUFvQztBQUNwQyxxQ0FBMkI7QUFDM0IsK0JBQThCO0FBQzlCLGlDQUF3RDtBQUN4RCwyREFBbUQ7QUFDbkQseURBQWtDO0FBTWxDLE1BQU0sY0FBYyxHQUFHLENBQUMsRUFDdEIsS0FBSyxHQUNnQixFQUFFLEVBQUU7SUFDekIsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFL0MsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNsQyx3RUFBd0U7UUFDeEUsSUFBQSwyQkFBSSxFQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUNsRixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbkIsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUVYLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2IsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVSLE9BQU8sR0FBRyxFQUFFO2dCQUNWLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN2QixDQUFDLENBQUE7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUVkLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0lBQXdJLENBQ3JKO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUN6QztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FDL0M7VUFBQSxDQUFDLGlCQUFPLENBQ04sWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUEsV0FBQyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBQSxXQUFDLEVBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUUvRjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzRkFBc0YsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQzdJO1VBQUEsRUFBRSxpQkFBTyxDQUNYO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0NBQXdDLEVBQ3ZEO1FBQUEsQ0FBQyxpQkFBTyxDQUNOLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFBLFdBQUMsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUEsV0FBQyxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FFL0Y7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQzlCO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMscUhBQXFILDBCQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsMEJBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQ25NO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsaUJBQU8sQ0FDWDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IFN1Y2Nlc3NJbnZpdGF0aW9uUmVzdWx0IH0gZnJvbSAnLidcbmltcG9ydCBjb3B5IGZyb20gJ2NvcHktdG8tY2xpcGJvYXJkJ1xuaW1wb3J0IHsgdCB9IGZyb20gJ2kxOG5leHQnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9vbHRpcCdcbmltcG9ydCBzIGZyb20gJy4vaW5kZXgubW9kdWxlLmNzcydcblxudHlwZSBJSW52aXRhdGlvbkxpbmtQcm9wcyA9IHtcbiAgdmFsdWU6IFN1Y2Nlc3NJbnZpdGF0aW9uUmVzdWx0XG59XG5cbmNvbnN0IEludml0YXRpb25MaW5rID0gKHtcbiAgdmFsdWUsXG59OiBJSW52aXRhdGlvbkxpbmtQcm9wcykgPT4ge1xuICBjb25zdCBbaXNDb3BpZWQsIHNldElzQ29waWVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IGNvcHlIYW5kbGUgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgLy8gTm8gcHJlZml4IGlzIG5lZWRlZCBoZXJlIGJlY2F1c2UgdGhlIGJhY2tlbmQgaGFzIGFscmVhZHkgcHJvY2Vzc2VkIGl0XG4gICAgY29weShgJHshdmFsdWUudXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gOiAnJ30ke3ZhbHVlLnVybH1gKVxuICAgIHNldElzQ29waWVkKHRydWUpXG4gIH0sIFt2YWx1ZV0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaXNDb3BpZWQpIHtcbiAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0SXNDb3BpZWQoZmFsc2UpXG4gICAgICB9LCAxMDAwKVxuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtpc0NvcGllZF0pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1jb21wb25lbnRzLWlucHV0LWJvcmRlci1hY3RpdmUgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgcHktMiBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC01IGdyb3cgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1mdWxsIGdyb3cgdGV4dC1bMTNweF1cIj5cbiAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgcG9wdXBDb250ZW50PXtpc0NvcGllZCA/IGAke3QoJ2NvcGllZCcsIHsgbnM6ICdhcHBBcGknIH0pfWAgOiBgJHt0KCdjb3B5JywgeyBuczogJ2FwcEFwaScgfSl9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInItMCBhYnNvbHV0ZSBsZWZ0LTAgdG9wLTAgdy1mdWxsIGN1cnNvci1wb2ludGVyIHRydW5jYXRlIHBsLTIgcHItMiB0ZXh0LXRleHQtcHJpbWFyeVwiIG9uQ2xpY2s9e2NvcHlIYW5kbGV9Pnt2YWx1ZS51cmx9PC9kaXY+XG4gICAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTQgc2hyaW5rLTAgYm9yZGVyIGJnLWRpdmlkZXItcmVndWxhclwiIC8+XG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgcG9wdXBDb250ZW50PXtpc0NvcGllZCA/IGAke3QoJ2NvcGllZCcsIHsgbnM6ICdhcHBBcGknIH0pfWAgOiBgJHt0KCdjb3B5JywgeyBuczogJ2FwcEFwaScgfSl9YH1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hyaW5rLTAgcHgtMC41XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJveC1ib3JkZXIgZmxleCBoLVszMHB4XSB3LVszMHB4XSBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1sZyBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyICR7cy5jb3B5SWNvbn0gJHtpc0NvcGllZCA/IHMuY29waWVkIDogJyd9YH0gb25DbGljaz17Y29weUhhbmRsZX0+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Ub29sdGlwPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgSW52aXRhdGlvbkxpbmtcbiJdfQ==