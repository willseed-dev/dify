"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const development_1 = require("@/app/components/base/icons/src/vender/solid/development");
const input_var_type_icon_1 = require("../_base/components/input-var-type-icon");
const i18nPrefix = 'nodes.start';
const Node = ({ data, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { variables } = data;
    if (!variables.length)
        return null;
    return (<div className="mb-1 px-3 py-1">
      <div className="space-y-0.5">
        {variables.map(variable => (<div key={variable.variable} className="flex h-6 items-center justify-between space-x-1 rounded-md  bg-workflow-block-parma-bg px-1">
            <div className="flex w-0 grow items-center space-x-1">
              <development_1.Variable02 className="h-3.5 w-3.5 shrink-0 text-text-accent"/>
              <span className="system-xs-regular w-0 grow truncate text-text-secondary">{variable.variable}</span>
            </div>

            <div className="ml-1 flex items-center space-x-1">
              {variable.required && <span className="system-2xs-regular-uppercase text-text-tertiary">{t(`${i18nPrefix}.required`, { ns: 'workflow' })}</span>}
              <input_var_type_icon_1.default type={variable.type} className="h-3 w-3 text-text-tertiary"/>
            </div>
          </div>))}
      </div>
    </div>);
};
exports.default = React.memo(Node);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5QywwRkFBcUY7QUFDckYsaUZBQXNFO0FBRXRFLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQTtBQUVoQyxNQUFNLElBQUksR0FBaUMsQ0FBQyxFQUMxQyxJQUFJLEdBQ0wsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUE7SUFFMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO1FBQ25CLE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDN0I7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUMxQjtRQUFBLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQ3pCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsNkZBQTZGLENBQ2xJO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUNuRDtjQUFBLENBQUMsd0JBQVUsQ0FBQyxTQUFTLENBQUMsdUNBQXVDLEVBQzdEO2NBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlEQUF5RCxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FDckc7WUFBQSxFQUFFLEdBQUcsQ0FFTDs7WUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsa0NBQWtDLENBQy9DO2NBQUEsQ0FBQyxRQUFRLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsV0FBVyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FDaEo7Y0FBQSxDQUFDLDZCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQy9FO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgU3RhcnROb2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGVQcm9wcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IFZhcmlhYmxlMDIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9kZXZlbG9wbWVudCdcbmltcG9ydCBJbnB1dFZhclR5cGVJY29uIGZyb20gJy4uL19iYXNlL2NvbXBvbmVudHMvaW5wdXQtdmFyLXR5cGUtaWNvbidcblxuY29uc3QgaTE4blByZWZpeCA9ICdub2Rlcy5zdGFydCdcblxuY29uc3QgTm9kZTogRkM8Tm9kZVByb3BzPFN0YXJ0Tm9kZVR5cGU+PiA9ICh7XG4gIGRhdGEsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IHZhcmlhYmxlcyB9ID0gZGF0YVxuXG4gIGlmICghdmFyaWFibGVzLmxlbmd0aClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xIHB4LTMgcHktMVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTAuNVwiPlxuICAgICAgICB7dmFyaWFibGVzLm1hcCh2YXJpYWJsZSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e3ZhcmlhYmxlLnZhcmlhYmxlfSBjbGFzc05hbWU9XCJmbGV4IGgtNiBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHNwYWNlLXgtMSByb3VuZGVkLW1kICBiZy13b3JrZmxvdy1ibG9jay1wYXJtYS1iZyBweC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy0wIGdyb3cgaXRlbXMtY2VudGVyIHNwYWNlLXgtMVwiPlxuICAgICAgICAgICAgICA8VmFyaWFibGUwMiBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNSBzaHJpbmstMCB0ZXh0LXRleHQtYWNjZW50XCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdy0wIGdyb3cgdHJ1bmNhdGUgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt2YXJpYWJsZS52YXJpYWJsZX08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtbC0xIGZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMVwiPlxuICAgICAgICAgICAgICB7dmFyaWFibGUucmVxdWlyZWQgJiYgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1yZWd1bGFyLXVwcGVyY2FzZSB0ZXh0LXRleHQtdGVydGlhcnlcIj57dChgJHtpMThuUHJlZml4fS5yZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycgfSl9PC9zcGFuPn1cbiAgICAgICAgICAgICAgPElucHV0VmFyVHlwZUljb24gdHlwZT17dmFyaWFibGUudHlwZX0gY2xhc3NOYW1lPVwiaC0zIHctMyB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhOb2RlKVxuIl19