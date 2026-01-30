"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const Empty = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="system-xs-regular flex h-10 items-center justify-center rounded-[10px] bg-background-section text-text-tertiary">
      {t('nodes.loop.setLoopVariables', { ns: 'workflow' })}
    </div>);
};
exports.default = Empty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbXB0eS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBOEM7QUFFOUMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFO0lBQ2pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGlIQUFpSCxDQUM5SDtNQUFBLENBQUMsQ0FBQyxDQUFDLDZCQUE2QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQ3ZEO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuXG5jb25zdCBFbXB0eSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIGZsZXggaC0xMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1bMTBweF0gYmctYmFja2dyb3VuZC1zZWN0aW9uIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlxuICAgICAge3QoJ25vZGVzLmxvb3Auc2V0TG9vcFZhcmlhYmxlcycsIHsgbnM6ICd3b3JrZmxvdycgfSl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRW1wdHlcbiJdfQ==