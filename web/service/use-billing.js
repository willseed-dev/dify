"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBillingUrl = exports.useBindPartnerStackInfo = void 0;
const react_query_1 = require("@tanstack/react-query");
const billing_1 = require("@/service/billing");
const NAME_SPACE = 'billing';
const useBindPartnerStackInfo = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'bind-partner-stack'],
        mutationFn: (data) => (0, billing_1.bindPartnerStackInfo)(data.partnerKey, data.clickId),
    });
};
exports.useBindPartnerStackInfo = useBindPartnerStackInfo;
const useBillingUrl = (enabled) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'url'],
        enabled,
        queryFn: async () => {
            const res = await (0, billing_1.fetchBillingUrl)();
            return res.url;
        },
    });
};
exports.useBillingUrl = useBillingUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWJpbGxpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYmlsbGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBNkQ7QUFDN0QsK0NBQXlFO0FBRXpFLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQTtBQUVyQixNQUFNLHVCQUF1QixHQUFHLEdBQUcsRUFBRTtJQUMxQyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUM7UUFDL0MsVUFBVSxFQUFFLENBQUMsSUFBNkMsRUFBRSxFQUFFLENBQUMsSUFBQSw4QkFBb0IsRUFBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDbkgsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBTFksUUFBQSx1QkFBdUIsMkJBS25DO0FBRU0sTUFBTSxhQUFhLEdBQUcsQ0FBQyxPQUFnQixFQUFFLEVBQUU7SUFDaEQsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO1FBQzdCLE9BQU87UUFDUCxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLHlCQUFlLEdBQUUsQ0FBQTtZQUNuQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUE7UUFDaEIsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVRZLFFBQUEsYUFBYSxpQkFTekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VNdXRhdGlvbiwgdXNlUXVlcnkgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBiaW5kUGFydG5lclN0YWNrSW5mbywgZmV0Y2hCaWxsaW5nVXJsIH0gZnJvbSAnQC9zZXJ2aWNlL2JpbGxpbmcnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAnYmlsbGluZydcblxuZXhwb3J0IGNvbnN0IHVzZUJpbmRQYXJ0bmVyU3RhY2tJbmZvID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ2JpbmQtcGFydG5lci1zdGFjayddLFxuICAgIG11dGF0aW9uRm46IChkYXRhOiB7IHBhcnRuZXJLZXk6IHN0cmluZywgY2xpY2tJZDogc3RyaW5nIH0pID0+IGJpbmRQYXJ0bmVyU3RhY2tJbmZvKGRhdGEucGFydG5lcktleSwgZGF0YS5jbGlja0lkKSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUJpbGxpbmdVcmwgPSAoZW5hYmxlZDogYm9vbGVhbikgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ3VybCddLFxuICAgIGVuYWJsZWQsXG4gICAgcXVlcnlGbjogYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2hCaWxsaW5nVXJsKClcbiAgICAgIHJldHVybiByZXMudXJsXG4gICAgfSxcbiAgfSlcbn1cbiJdfQ==