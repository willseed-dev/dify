"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const use_ps_info_1 = require("../components/billing/partner-stack/use-ps-info");
const normal_form_1 = require("./normal-form");
const one_more_step_1 = require("./one-more-step");
const SignIn = () => {
    const searchParams = (0, navigation_1.useSearchParams)();
    const step = searchParams.get('step');
    const { saveOrUpdate } = (0, use_ps_info_1.default)();
    (0, react_1.useEffect)(() => {
        saveOrUpdate();
    }, []);
    if (step === 'next')
        return <one_more_step_1.default />;
    return <normal_form_1.default />;
};
exports.default = SignIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBQ1osZ0RBQWlEO0FBQ2pELGlDQUFpQztBQUNqQyxpRkFBdUU7QUFDdkUsK0NBQXNDO0FBQ3RDLG1EQUF5QztBQUV6QyxNQUFNLE1BQU0sR0FBRyxHQUFHLEVBQUU7SUFDbEIsTUFBTSxZQUFZLEdBQUcsSUFBQSw0QkFBZSxHQUFFLENBQUE7SUFDdEMsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNyQyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBQSxxQkFBUyxHQUFFLENBQUE7SUFFcEMsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLFlBQVksRUFBRSxDQUFBO0lBQ2hCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLElBQUksSUFBSSxLQUFLLE1BQU07UUFDakIsT0FBTyxDQUFDLHVCQUFXLENBQUMsQUFBRCxFQUFHLENBQUE7SUFDeEIsT0FBTyxDQUFDLHFCQUFVLENBQUMsQUFBRCxFQUFHLENBQUE7QUFDdkIsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgeyB1c2VTZWFyY2hQYXJhbXMgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB1c2VQU0luZm8gZnJvbSAnLi4vY29tcG9uZW50cy9iaWxsaW5nL3BhcnRuZXItc3RhY2svdXNlLXBzLWluZm8nXG5pbXBvcnQgTm9ybWFsRm9ybSBmcm9tICcuL25vcm1hbC1mb3JtJ1xuaW1wb3J0IE9uZU1vcmVTdGVwIGZyb20gJy4vb25lLW1vcmUtc3RlcCdcblxuY29uc3QgU2lnbkluID0gKCkgPT4ge1xuICBjb25zdCBzZWFyY2hQYXJhbXMgPSB1c2VTZWFyY2hQYXJhbXMoKVxuICBjb25zdCBzdGVwID0gc2VhcmNoUGFyYW1zLmdldCgnc3RlcCcpXG4gIGNvbnN0IHsgc2F2ZU9yVXBkYXRlIH0gPSB1c2VQU0luZm8oKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2F2ZU9yVXBkYXRlKClcbiAgfSwgW10pXG5cbiAgaWYgKHN0ZXAgPT09ICduZXh0JylcbiAgICByZXR1cm4gPE9uZU1vcmVTdGVwIC8+XG4gIHJldHVybiA8Tm9ybWFsRm9ybSAvPlxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWduSW5cbiJdfQ==