"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Account;
const react_i18next_1 = require("react-i18next");
const use_document_title_1 = require("@/hooks/use-document-title");
const account_page_1 = require("./account-page");
function Account() {
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, use_document_title_1.default)(t('menus.account', { ns: 'common' }));
    return (<div className="mx-auto w-full max-w-[640px] px-6 pt-12">
      <account_page_1.default />
    </div>);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBS1osMEJBUUM7QUFaRCxpREFBOEM7QUFDOUMsbUVBQXlEO0FBQ3pELGlEQUF3QztBQUV4QyxTQUF3QixPQUFPO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixJQUFBLDRCQUFnQixFQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3RELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQ3REO01BQUEsQ0FBQyxzQkFBVyxDQUFDLEFBQUQsRUFDZDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJ0AvaG9va3MvdXNlLWRvY3VtZW50LXRpdGxlJ1xuaW1wb3J0IEFjY291bnRQYWdlIGZyb20gJy4vYWNjb3VudC1wYWdlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBY2NvdW50KCkge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgdXNlRG9jdW1lbnRUaXRsZSh0KCdtZW51cy5hY2NvdW50JywgeyBuczogJ2NvbW1vbicgfSkpXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJteC1hdXRvIHctZnVsbCBtYXgtdy1bNjQwcHhdIHB4LTYgcHQtMTJcIj5cbiAgICAgIDxBY2NvdW50UGFnZSAvPlxuICAgIDwvZGl2PlxuICApXG59XG4iXX0=