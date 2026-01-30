"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPartnerStackInfo = exports.fetchBillingUrl = exports.fetchSubscriptionUrls = exports.fetchCurrentPlanInfo = void 0;
const base_1 = require("./base");
const fetchCurrentPlanInfo = () => {
    return (0, base_1.get)('/features');
};
exports.fetchCurrentPlanInfo = fetchCurrentPlanInfo;
const fetchSubscriptionUrls = (plan, interval) => {
    return (0, base_1.get)(`/billing/subscription?plan=${plan}&interval=${interval}`);
};
exports.fetchSubscriptionUrls = fetchSubscriptionUrls;
const fetchBillingUrl = () => {
    return (0, base_1.get)('/billing/invoices');
};
exports.fetchBillingUrl = fetchBillingUrl;
const bindPartnerStackInfo = (partnerKey, clickId) => {
    return (0, base_1.put)(`/billing/partners/${partnerKey}/tenants`, {
        body: {
            click_id: clickId,
        },
    }, {
        silent: true,
    });
};
exports.bindPartnerStackInfo = bindPartnerStackInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmlsbGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJpbGxpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQWlDO0FBRTFCLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO0lBQ3ZDLE9BQU8sSUFBQSxVQUFHLEVBQXlCLFdBQVcsQ0FBQyxDQUFBO0FBQ2pELENBQUMsQ0FBQTtBQUZZLFFBQUEsb0JBQW9CLHdCQUVoQztBQUVNLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ3RFLE9BQU8sSUFBQSxVQUFHLEVBQTBCLDhCQUE4QixJQUFJLGFBQWEsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUNoRyxDQUFDLENBQUE7QUFGWSxRQUFBLHFCQUFxQix5QkFFakM7QUFFTSxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUU7SUFDbEMsT0FBTyxJQUFBLFVBQUcsRUFBa0IsbUJBQW1CLENBQUMsQ0FBQTtBQUNsRCxDQUFDLENBQUE7QUFGWSxRQUFBLGVBQWUsbUJBRTNCO0FBRU0sTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFVBQWtCLEVBQUUsT0FBZSxFQUFFLEVBQUU7SUFDMUUsT0FBTyxJQUFBLFVBQUcsRUFBQyxxQkFBcUIsVUFBVSxVQUFVLEVBQUU7UUFDcEQsSUFBSSxFQUFFO1lBQ0osUUFBUSxFQUFFLE9BQU87U0FDbEI7S0FDRixFQUFFO1FBQ0QsTUFBTSxFQUFFLElBQUk7S0FDYixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFSWSxRQUFBLG9CQUFvQix3QkFRaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEN1cnJlbnRQbGFuSW5mb0JhY2tlbmQsIFN1YnNjcmlwdGlvblVybHNCYWNrZW5kIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBnZXQsIHB1dCB9IGZyb20gJy4vYmFzZSdcblxuZXhwb3J0IGNvbnN0IGZldGNoQ3VycmVudFBsYW5JbmZvID0gKCkgPT4ge1xuICByZXR1cm4gZ2V0PEN1cnJlbnRQbGFuSW5mb0JhY2tlbmQ+KCcvZmVhdHVyZXMnKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hTdWJzY3JpcHRpb25VcmxzID0gKHBsYW46IHN0cmluZywgaW50ZXJ2YWw6IHN0cmluZykgPT4ge1xuICByZXR1cm4gZ2V0PFN1YnNjcmlwdGlvblVybHNCYWNrZW5kPihgL2JpbGxpbmcvc3Vic2NyaXB0aW9uP3BsYW49JHtwbGFufSZpbnRlcnZhbD0ke2ludGVydmFsfWApXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaEJpbGxpbmdVcmwgPSAoKSA9PiB7XG4gIHJldHVybiBnZXQ8eyB1cmw6IHN0cmluZyB9PignL2JpbGxpbmcvaW52b2ljZXMnKVxufVxuXG5leHBvcnQgY29uc3QgYmluZFBhcnRuZXJTdGFja0luZm8gPSAocGFydG5lcktleTogc3RyaW5nLCBjbGlja0lkOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHB1dChgL2JpbGxpbmcvcGFydG5lcnMvJHtwYXJ0bmVyS2V5fS90ZW5hbnRzYCwge1xuICAgIGJvZHk6IHtcbiAgICAgIGNsaWNrX2lkOiBjbGlja0lkLFxuICAgIH0sXG4gIH0sIHtcbiAgICBzaWxlbnQ6IHRydWUsXG4gIH0pXG59XG4iXX0=