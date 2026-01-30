"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_i18next_1 = require("react-i18next");
const i18n_1 = require("@/context/i18n");
const InfoPanel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const docLink = (0, i18n_1.useDocLink)();
    return (<div className="flex w-[360px] flex-col items-start pb-2 pr-8 pt-[108px]">
      <div className="flex w-full min-w-[240px] flex-col items-start gap-3 self-stretch rounded-xl bg-background-section p-6">
        <div className="flex h-10 w-10 grow items-center justify-center gap-2 self-stretch rounded-lg border-[0.5px] border-components-card-border bg-components-card-bg p-1">
          <react_1.RiBookOpenLine className="h-5 w-5 text-text-accent"/>
        </div>
        <p className="flex flex-col items-start gap-2 self-stretch">
          <span className="system-xl-semibold self-stretch text-text-secondary">
            {t('connectDatasetIntro.title', { ns: 'dataset' })}
          </span>
          <span className="system-sm-regular text-text-tertiary">
            {t('connectDatasetIntro.content.front', { ns: 'dataset' })}
            <a className="system-sm-regular ml-1 text-text-accent" href={docLink('/guides/knowledge-base/external-knowledge-api')} target="_blank" rel="noopener noreferrer">
              {t('connectDatasetIntro.content.link', { ns: 'dataset' })}
            </a>
            {t('connectDatasetIntro.content.end', { ns: 'dataset' })}
          </span>
          <a className="system-sm-regular self-stretch text-text-accent" href={docLink('/guides/knowledge-base/connect-external-knowledge-base')} target="_blank" rel="noopener noreferrer">
            {t('connectDatasetIntro.learnMore', { ns: 'dataset' })}
          </a>
        </p>
      </div>
    </div>);
};
exports.default = InfoPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5mb1BhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiSW5mb1BhbmVsLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFpRDtBQUNqRCxpREFBOEM7QUFDOUMseUNBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtJQUNyQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxPQUFPLEdBQUcsSUFBQSxpQkFBVSxHQUFFLENBQUE7SUFFNUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwREFBMEQsQ0FDdkU7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0dBQXdHLENBQ3JIO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNKQUFzSixDQUNuSztVQUFBLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLEVBQ3REO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsOENBQThDLENBQ3pEO1VBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFEQUFxRCxDQUNuRTtZQUFBLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQ3BEO1VBQUEsRUFBRSxJQUFJLENBQ047VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQ3BEO1lBQUEsQ0FBQyxDQUFDLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDMUQ7WUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FDOUo7Y0FBQSxDQUFDLENBQUMsQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUMzRDtZQUFBLEVBQUUsQ0FBQyxDQUNIO1lBQUEsQ0FBQyxDQUFDLENBQUMsaUNBQWlDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDMUQ7VUFBQSxFQUFFLElBQUksQ0FDTjtVQUFBLENBQUMsQ0FBQyxDQUNBLFNBQVMsQ0FBQyxpREFBaUQsQ0FDM0QsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLHdEQUF3RCxDQUFDLENBQUMsQ0FDeEUsTUFBTSxDQUFDLFFBQVEsQ0FDZixHQUFHLENBQUMscUJBQXFCLENBRXpCO1lBQUEsQ0FBQyxDQUFDLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FDeEQ7VUFBQSxFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsQ0FBQyxDQUNMO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSaUJvb2tPcGVuTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VEb2NMaW5rIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5cbmNvbnN0IEluZm9QYW5lbCA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGRvY0xpbmsgPSB1c2VEb2NMaW5rKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LVszNjBweF0gZmxleC1jb2wgaXRlbXMtc3RhcnQgcGItMiBwci04IHB0LVsxMDhweF1cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgbWluLXctWzI0MHB4XSBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAtMyBzZWxmLXN0cmV0Y2ggcm91bmRlZC14bCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24gcC02XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTEwIHctMTAgZ3JvdyBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgc2VsZi1zdHJldGNoIHJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtY2FyZC1ib3JkZXIgYmctY29tcG9uZW50cy1jYXJkLWJnIHAtMVwiPlxuICAgICAgICAgIDxSaUJvb2tPcGVuTGluZSBjbGFzc05hbWU9XCJoLTUgdy01IHRleHQtdGV4dC1hY2NlbnRcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAtMiBzZWxmLXN0cmV0Y2hcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0teGwtc2VtaWJvbGQgc2VsZi1zdHJldGNoIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIHt0KCdjb25uZWN0RGF0YXNldEludHJvLnRpdGxlJywgeyBuczogJ2RhdGFzZXQnIH0pfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgIHt0KCdjb25uZWN0RGF0YXNldEludHJvLmNvbnRlbnQuZnJvbnQnLCB7IG5zOiAnZGF0YXNldCcgfSl9XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJzeXN0ZW0tc20tcmVndWxhciBtbC0xIHRleHQtdGV4dC1hY2NlbnRcIiBocmVmPXtkb2NMaW5rKCcvZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2V4dGVybmFsLWtub3dsZWRnZS1hcGknKX0gdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiPlxuICAgICAgICAgICAgICB7dCgnY29ubmVjdERhdGFzZXRJbnRyby5jb250ZW50LmxpbmsnLCB7IG5zOiAnZGF0YXNldCcgfSl9XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICB7dCgnY29ubmVjdERhdGFzZXRJbnRyby5jb250ZW50LmVuZCcsIHsgbnM6ICdkYXRhc2V0JyB9KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHNlbGYtc3RyZXRjaCB0ZXh0LXRleHQtYWNjZW50XCJcbiAgICAgICAgICAgIGhyZWY9e2RvY0xpbmsoJy9ndWlkZXMva25vd2xlZGdlLWJhc2UvY29ubmVjdC1leHRlcm5hbC1rbm93bGVkZ2UtYmFzZScpfVxuICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0KCdjb25uZWN0RGF0YXNldEludHJvLmxlYXJuTW9yZScsIHsgbnM6ICdkYXRhc2V0JyB9KX1cbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZm9QYW5lbFxuIl19