"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _i18n_1 = require("#i18n");
const Description = () => {
    const { t } = (0, _i18n_1.useTranslation)('plugin');
    const { t: tCommon } = (0, _i18n_1.useTranslation)('common');
    const locale = (0, _i18n_1.useLocale)();
    const isZhHans = locale === 'zh-Hans';
    return (<>
      <h1 className="title-4xl-semi-bold mb-2 shrink-0 text-center text-text-primary">
        {t('marketplace.empower')}
      </h1>
      <h2 className="body-md-regular flex shrink-0 items-center justify-center text-center text-text-tertiary">
        {isZhHans && (<>
              <span className="mr-1">{tCommon('operation.in')}</span>
              {t('marketplace.difyMarketplace')}
              {t('marketplace.discover')}
            </>)}
        {!isZhHans && (<>
              {t('marketplace.discover')}
            </>)}
        <span className="body-md-medium relative z-[1] ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.models')}
        </span>
        ,
        <span className="body-md-medium relative z-[1] ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.tools')}
        </span>
        ,
        <span className="body-md-medium relative z-[1] ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.datasources')}
        </span>
        ,
        <span className="body-md-medium relative z-[1] ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.triggers')}
        </span>
        ,
        <span className="body-md-medium relative z-[1] ml-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.agents')}
        </span>
        ,
        <span className="body-md-medium relative z-[1] ml-1 mr-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.extensions')}
        </span>
        {t('marketplace.and')}
        <span className="body-md-medium relative z-[1] ml-1 mr-1 text-text-secondary after:absolute after:bottom-[1.5px] after:left-0 after:h-2 after:w-full after:bg-text-text-selected after:content-['']">
          {t('category.bundles')}
        </span>
        {!isZhHans && (<>
              <span className="mr-1">{tCommon('operation.in')}</span>
              {t('marketplace.difyMarketplace')}
            </>)}
      </h2>
    </>);
};
exports.default = Description;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUQ7QUFFakQsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFO0lBQ3ZCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLHNCQUFjLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFDdEMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLHNCQUFjLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQkFBUyxHQUFFLENBQUE7SUFFMUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLFNBQVMsQ0FBQTtJQUVyQyxPQUFPLENBQ0wsRUFDRTtNQUFBLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxpRUFBaUUsQ0FDN0U7UUFBQSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUMzQjtNQUFBLEVBQUUsRUFBRSxDQUNKO01BQUEsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLDBGQUEwRixDQUN0RztRQUFBLENBQ0UsUUFBUSxJQUFJLENBQ1YsRUFDRTtjQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQ3REO2NBQUEsQ0FBQyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FDakM7Y0FBQSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUM1QjtZQUFBLEdBQUcsQ0FFUCxDQUNBO1FBQUEsQ0FDRSxDQUFDLFFBQVEsSUFBSSxDQUNYLEVBQ0U7Y0FBQSxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUM1QjtZQUFBLEdBQUcsQ0FFUCxDQUNBO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtLQUErSyxDQUM3TDtVQUFBLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQ3ZCO1FBQUEsRUFBRSxJQUFJLENBQ047O1FBQ0EsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtLQUErSyxDQUM3TDtVQUFBLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQ3RCO1FBQUEsRUFBRSxJQUFJLENBQ047O1FBQ0EsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtLQUErSyxDQUM3TDtVQUFBLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQzVCO1FBQUEsRUFBRSxJQUFJLENBQ047O1FBQ0EsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtLQUErSyxDQUM3TDtVQUFBLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQ3pCO1FBQUEsRUFBRSxJQUFJLENBQ047O1FBQ0EsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLCtLQUErSyxDQUM3TDtVQUFBLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQ3ZCO1FBQUEsRUFBRSxJQUFJLENBQ047O1FBQ0EsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9MQUFvTCxDQUNsTTtVQUFBLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQzNCO1FBQUEsRUFBRSxJQUFJLENBQ047UUFBQSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNyQjtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvTEFBb0wsQ0FDbE07VUFBQSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUN4QjtRQUFBLEVBQUUsSUFBSSxDQUNOO1FBQUEsQ0FDRSxDQUFDLFFBQVEsSUFBSSxDQUNYLEVBQ0U7Y0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUN0RDtjQUFBLENBQUMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQ25DO1lBQUEsR0FBRyxDQUVQLENBQ0Y7TUFBQSxFQUFFLEVBQUUsQ0FDTjtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTG9jYWxlLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJyNpMThuJ1xuXG5jb25zdCBEZXNjcmlwdGlvbiA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigncGx1Z2luJylcbiAgY29uc3QgeyB0OiB0Q29tbW9uIH0gPSB1c2VUcmFuc2xhdGlvbignY29tbW9uJylcbiAgY29uc3QgbG9jYWxlID0gdXNlTG9jYWxlKClcblxuICBjb25zdCBpc1poSGFucyA9IGxvY2FsZSA9PT0gJ3poLUhhbnMnXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGgxIGNsYXNzTmFtZT1cInRpdGxlLTR4bC1zZW1pLWJvbGQgbWItMiBzaHJpbmstMCB0ZXh0LWNlbnRlciB0ZXh0LXRleHQtcHJpbWFyeVwiPlxuICAgICAgICB7dCgnbWFya2V0cGxhY2UuZW1wb3dlcicpfVxuICAgICAgPC9oMT5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJib2R5LW1kLXJlZ3VsYXIgZmxleCBzaHJpbmstMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIHtcbiAgICAgICAgICBpc1poSGFucyAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtci0xXCI+e3RDb21tb24oJ29wZXJhdGlvbi5pbicpfTwvc3Bhbj5cbiAgICAgICAgICAgICAge3QoJ21hcmtldHBsYWNlLmRpZnlNYXJrZXRwbGFjZScpfVxuICAgICAgICAgICAgICB7dCgnbWFya2V0cGxhY2UuZGlzY292ZXInKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgIWlzWmhIYW5zICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIHt0KCdtYXJrZXRwbGFjZS5kaXNjb3ZlcicpfVxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJvZHktbWQtbWVkaXVtIHJlbGF0aXZlIHotWzFdIG1sLTEgdGV4dC10ZXh0LXNlY29uZGFyeSBhZnRlcjphYnNvbHV0ZSBhZnRlcjpib3R0b20tWzEuNXB4XSBhZnRlcjpsZWZ0LTAgYWZ0ZXI6aC0yIGFmdGVyOnctZnVsbCBhZnRlcjpiZy10ZXh0LXRleHQtc2VsZWN0ZWQgYWZ0ZXI6Y29udGVudC1bJyddXCI+XG4gICAgICAgICAge3QoJ2NhdGVnb3J5Lm1vZGVscycpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgICxcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYm9keS1tZC1tZWRpdW0gcmVsYXRpdmUgei1bMV0gbWwtMSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGFmdGVyOmFic29sdXRlIGFmdGVyOmJvdHRvbS1bMS41cHhdIGFmdGVyOmxlZnQtMCBhZnRlcjpoLTIgYWZ0ZXI6dy1mdWxsIGFmdGVyOmJnLXRleHQtdGV4dC1zZWxlY3RlZCBhZnRlcjpjb250ZW50LVsnJ11cIj5cbiAgICAgICAgICB7dCgnY2F0ZWdvcnkudG9vbHMnKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICAsXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJvZHktbWQtbWVkaXVtIHJlbGF0aXZlIHotWzFdIG1sLTEgdGV4dC10ZXh0LXNlY29uZGFyeSBhZnRlcjphYnNvbHV0ZSBhZnRlcjpib3R0b20tWzEuNXB4XSBhZnRlcjpsZWZ0LTAgYWZ0ZXI6aC0yIGFmdGVyOnctZnVsbCBhZnRlcjpiZy10ZXh0LXRleHQtc2VsZWN0ZWQgYWZ0ZXI6Y29udGVudC1bJyddXCI+XG4gICAgICAgICAge3QoJ2NhdGVnb3J5LmRhdGFzb3VyY2VzJyl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgLFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJib2R5LW1kLW1lZGl1bSByZWxhdGl2ZSB6LVsxXSBtbC0xIHRleHQtdGV4dC1zZWNvbmRhcnkgYWZ0ZXI6YWJzb2x1dGUgYWZ0ZXI6Ym90dG9tLVsxLjVweF0gYWZ0ZXI6bGVmdC0wIGFmdGVyOmgtMiBhZnRlcjp3LWZ1bGwgYWZ0ZXI6YmctdGV4dC10ZXh0LXNlbGVjdGVkIGFmdGVyOmNvbnRlbnQtWycnXVwiPlxuICAgICAgICAgIHt0KCdjYXRlZ29yeS50cmlnZ2VycycpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgICxcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYm9keS1tZC1tZWRpdW0gcmVsYXRpdmUgei1bMV0gbWwtMSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGFmdGVyOmFic29sdXRlIGFmdGVyOmJvdHRvbS1bMS41cHhdIGFmdGVyOmxlZnQtMCBhZnRlcjpoLTIgYWZ0ZXI6dy1mdWxsIGFmdGVyOmJnLXRleHQtdGV4dC1zZWxlY3RlZCBhZnRlcjpjb250ZW50LVsnJ11cIj5cbiAgICAgICAgICB7dCgnY2F0ZWdvcnkuYWdlbnRzJyl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgLFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJib2R5LW1kLW1lZGl1bSByZWxhdGl2ZSB6LVsxXSBtbC0xIG1yLTEgdGV4dC10ZXh0LXNlY29uZGFyeSBhZnRlcjphYnNvbHV0ZSBhZnRlcjpib3R0b20tWzEuNXB4XSBhZnRlcjpsZWZ0LTAgYWZ0ZXI6aC0yIGFmdGVyOnctZnVsbCBhZnRlcjpiZy10ZXh0LXRleHQtc2VsZWN0ZWQgYWZ0ZXI6Y29udGVudC1bJyddXCI+XG4gICAgICAgICAge3QoJ2NhdGVnb3J5LmV4dGVuc2lvbnMnKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICB7dCgnbWFya2V0cGxhY2UuYW5kJyl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJvZHktbWQtbWVkaXVtIHJlbGF0aXZlIHotWzFdIG1sLTEgbXItMSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGFmdGVyOmFic29sdXRlIGFmdGVyOmJvdHRvbS1bMS41cHhdIGFmdGVyOmxlZnQtMCBhZnRlcjpoLTIgYWZ0ZXI6dy1mdWxsIGFmdGVyOmJnLXRleHQtdGV4dC1zZWxlY3RlZCBhZnRlcjpjb250ZW50LVsnJ11cIj5cbiAgICAgICAgICB7dCgnY2F0ZWdvcnkuYnVuZGxlcycpfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHtcbiAgICAgICAgICAhaXNaaEhhbnMgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibXItMVwiPnt0Q29tbW9uKCdvcGVyYXRpb24uaW4nKX08L3NwYW4+XG4gICAgICAgICAgICAgIHt0KCdtYXJrZXRwbGFjZS5kaWZ5TWFya2V0cGxhY2UnKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9oMj5cbiAgICA8Lz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXNjcmlwdGlvblxuIl19