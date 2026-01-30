"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("@/app/education-apply/hooks");
const use_document_title_1 = require("@/hooks/use-document-title");
const list_1 = require("./list");
const Apps = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, use_document_title_1.default)(t('menus.apps', { ns: 'common' }));
    (0, hooks_1.useEducationInit)();
    return (<div className="relative flex h-0 shrink-0 grow flex-col overflow-y-auto bg-background-body">
      <list_1.default />
    </div>);
};
exports.default = Apps;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFDWixpREFBOEM7QUFDOUMsdURBQThEO0FBQzlELG1FQUF5RDtBQUN6RCxpQ0FBeUI7QUFFekIsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFO0lBQ2hCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixJQUFBLDRCQUFnQixFQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ25ELElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUVsQixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZFQUE2RSxDQUMxRjtNQUFBLENBQUMsY0FBSSxDQUFDLEFBQUQsRUFDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlRWR1Y2F0aW9uSW5pdCB9IGZyb20gJ0AvYXBwL2VkdWNhdGlvbi1hcHBseS9ob29rcydcbmltcG9ydCB1c2VEb2N1bWVudFRpdGxlIGZyb20gJ0AvaG9va3MvdXNlLWRvY3VtZW50LXRpdGxlJ1xuaW1wb3J0IExpc3QgZnJvbSAnLi9saXN0J1xuXG5jb25zdCBBcHBzID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICB1c2VEb2N1bWVudFRpdGxlKHQoJ21lbnVzLmFwcHMnLCB7IG5zOiAnY29tbW9uJyB9KSlcbiAgdXNlRWR1Y2F0aW9uSW5pdCgpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggaC0wIHNocmluay0wIGdyb3cgZmxleC1jb2wgb3ZlcmZsb3cteS1hdXRvIGJnLWJhY2tncm91bmQtYm9keVwiPlxuICAgICAgPExpc3QgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBzXG4iXX0=