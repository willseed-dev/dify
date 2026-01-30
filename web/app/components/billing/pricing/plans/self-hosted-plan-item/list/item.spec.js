"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const item_1 = require("./item");
describe('SelfHostedPlanItem/List/Item', () => {
    it('should display provided feature label', () => {
        const { container } = (0, react_1.render)(<item_1.default label="Dedicated support"/>);
        expect(react_1.screen.getByText('Dedicated support')).toBeInTheDocument();
        expect(container.querySelector('svg')).not.toBeNull();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXRlbS5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUF1RDtBQUN2RCwrQkFBOEI7QUFDOUIsaUNBQXlCO0FBRXpCLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7SUFDNUMsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxjQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFHLENBQUMsQ0FBQTtRQUVoRSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUN2RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgSXRlbSBmcm9tICcuL2l0ZW0nXG5cbmRlc2NyaWJlKCdTZWxmSG9zdGVkUGxhbkl0ZW0vTGlzdC9JdGVtJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIGRpc3BsYXkgcHJvdmlkZWQgZmVhdHVyZSBsYWJlbCcsICgpID0+IHtcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJdGVtIGxhYmVsPVwiRGVkaWNhdGVkIHN1cHBvcnRcIiAvPilcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEZWRpY2F0ZWQgc3VwcG9ydCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKSkubm90LnRvQmVOdWxsKClcbiAgfSlcbn0pXG4iXX0=