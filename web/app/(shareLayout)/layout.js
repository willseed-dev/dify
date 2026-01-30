"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_app_context_1 = require("@/context/web-app-context");
const splash_1 = require("./components/splash");
const Layout = ({ children }) => {
    return (<div className="h-full min-w-[300px] pb-[env(safe-area-inset-bottom)]">
      <web_app_context_1.default>
        <splash_1.default>
          {children}
        </splash_1.default>
      </web_app_context_1.default>
    </div>);
};
exports.default = Layout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtEQUEyRDtBQUMzRCxnREFBd0M7QUFFeEMsTUFBTSxNQUFNLEdBQTBCLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO0lBQ3JELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdURBQXVELENBQ3BFO01BQUEsQ0FBQyx5QkFBbUIsQ0FDbEI7UUFBQSxDQUFDLGdCQUFNLENBQ0w7VUFBQSxDQUFDLFFBQVEsQ0FDWDtRQUFBLEVBQUUsZ0JBQU0sQ0FDVjtNQUFBLEVBQUUseUJBQW1CLENBQ3ZCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGQywgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCdcbmltcG9ydCBXZWJBcHBTdG9yZVByb3ZpZGVyIGZyb20gJ0AvY29udGV4dC93ZWItYXBwLWNvbnRleHQnXG5pbXBvcnQgU3BsYXNoIGZyb20gJy4vY29tcG9uZW50cy9zcGxhc2gnXG5cbmNvbnN0IExheW91dDogRkM8UHJvcHNXaXRoQ2hpbGRyZW4+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1mdWxsIG1pbi13LVszMDBweF0gcGItW2VudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tKV1cIj5cbiAgICAgIDxXZWJBcHBTdG9yZVByb3ZpZGVyPlxuICAgICAgICA8U3BsYXNoPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9TcGxhc2g+XG4gICAgICA8L1dlYkFwcFN0b3JlUHJvdmlkZXI+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGF5b3V0XG4iXX0=