"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocale = void 0;
exports.useTranslation = useTranslation;
const react_i18next_1 = require("react-i18next");
function useTranslation(ns) {
    return (0, react_i18next_1.useTranslation)(ns);
}
var i18n_1 = require("@/context/i18n");
Object.defineProperty(exports, "useLocale", { enumerable: true, get: function () { return i18n_1.useLocale; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliLmNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpYi5jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBS1osd0NBRUM7QUFKRCxpREFBd0U7QUFFeEUsU0FBZ0IsY0FBYyxDQUFDLEVBQXVCO0lBQ3BELE9BQU8sSUFBQSw4QkFBc0IsRUFBQyxFQUFFLENBQUMsQ0FBQTtBQUNuQyxDQUFDO0FBRUQsdUNBQTBDO0FBQWpDLGlHQUFBLFNBQVMsT0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgdHlwZSB7IE5hbWVzcGFjZUNhbWVsQ2FzZSB9IGZyb20gJy4vcmVzb3VyY2VzJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gYXMgdXNlVHJhbnNsYXRpb25PcmlnaW5hbCB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VUcmFuc2xhdGlvbihucz86IE5hbWVzcGFjZUNhbWVsQ2FzZSkge1xuICByZXR1cm4gdXNlVHJhbnNsYXRpb25PcmlnaW5hbChucylcbn1cblxuZXhwb3J0IHsgdXNlTG9jYWxlIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG4iXX0=