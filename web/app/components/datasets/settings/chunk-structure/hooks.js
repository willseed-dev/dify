"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChunkStructure = void 0;
const react_i18next_1 = require("react-i18next");
const knowledge_1 = require("@/app/components/base/icons/src/vender/knowledge");
const datasets_1 = require("@/models/datasets");
const types_1 = require("./types");
const useChunkStructure = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const GeneralOption = {
        id: datasets_1.ChunkingMode.text,
        icon: <knowledge_1.GeneralChunk className="size-[18px]"/>,
        iconActiveColor: 'text-util-colors-indigo-indigo-600',
        title: 'General',
        description: t('stepTwo.generalTip', { ns: 'datasetCreation' }),
        effectColor: types_1.EffectColor.indigo,
        showEffectColor: true,
    };
    const ParentChildOption = {
        id: datasets_1.ChunkingMode.parentChild,
        icon: <knowledge_1.ParentChildChunk className="size-[18px]"/>,
        iconActiveColor: 'text-util-colors-blue-light-blue-light-500',
        title: 'Parent-Child',
        description: t('stepTwo.parentChildTip', { ns: 'datasetCreation' }),
        effectColor: types_1.EffectColor.blueLight,
        showEffectColor: true,
    };
    const QuestionAnswerOption = {
        id: datasets_1.ChunkingMode.qa,
        icon: <knowledge_1.QuestionAndAnswer className="size-[18px]"/>,
        title: 'Q&A',
        description: t('stepTwo.qaTip', { ns: 'datasetCreation' }),
    };
    const options = [
        GeneralOption,
        ParentChildOption,
        QuestionAnswerOption,
    ];
    return {
        options,
    };
};
exports.useChunkStructure = useChunkStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaURBQThDO0FBQzlDLGdGQUl5RDtBQUN6RCxnREFBZ0Q7QUFDaEQsbUNBQXFDO0FBRTlCLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLGFBQWEsR0FBVztRQUM1QixFQUFFLEVBQUUsdUJBQVksQ0FBQyxJQUFJO1FBQ3JCLElBQUksRUFBRSxDQUFDLHdCQUFZLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRztRQUM5QyxlQUFlLEVBQUUsb0NBQW9DO1FBQ3JELEtBQUssRUFBRSxTQUFTO1FBQ2hCLFdBQVcsRUFBRSxDQUFDLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztRQUMvRCxXQUFXLEVBQUUsbUJBQVcsQ0FBQyxNQUFNO1FBQy9CLGVBQWUsRUFBRSxJQUFJO0tBQ3RCLENBQUE7SUFDRCxNQUFNLGlCQUFpQixHQUFXO1FBQ2hDLEVBQUUsRUFBRSx1QkFBWSxDQUFDLFdBQVc7UUFDNUIsSUFBSSxFQUFFLENBQUMsNEJBQWdCLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRztRQUNsRCxlQUFlLEVBQUUsNENBQTRDO1FBQzdELEtBQUssRUFBRSxjQUFjO1FBQ3JCLFdBQVcsRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztRQUNuRSxXQUFXLEVBQUUsbUJBQVcsQ0FBQyxTQUFTO1FBQ2xDLGVBQWUsRUFBRSxJQUFJO0tBQ3RCLENBQUE7SUFDRCxNQUFNLG9CQUFvQixHQUFXO1FBQ25DLEVBQUUsRUFBRSx1QkFBWSxDQUFDLEVBQUU7UUFDbkIsSUFBSSxFQUFFLENBQUMsNkJBQWlCLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRztRQUNuRCxLQUFLLEVBQUUsS0FBSztRQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUM7S0FDM0QsQ0FBQTtJQUVELE1BQU0sT0FBTyxHQUFHO1FBQ2QsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixvQkFBb0I7S0FDckIsQ0FBQTtJQUVELE9BQU87UUFDTCxPQUFPO0tBQ1IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXJDWSxRQUFBLGlCQUFpQixxQkFxQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBPcHRpb24gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHtcbiAgR2VuZXJhbENodW5rLFxuICBQYXJlbnRDaGlsZENodW5rLFxuICBRdWVzdGlvbkFuZEFuc3dlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIva25vd2xlZGdlJ1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBFZmZlY3RDb2xvciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VDaHVua1N0cnVjdHVyZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgR2VuZXJhbE9wdGlvbjogT3B0aW9uID0ge1xuICAgIGlkOiBDaHVua2luZ01vZGUudGV4dCxcbiAgICBpY29uOiA8R2VuZXJhbENodW5rIGNsYXNzTmFtZT1cInNpemUtWzE4cHhdXCIgLz4sXG4gICAgaWNvbkFjdGl2ZUNvbG9yOiAndGV4dC11dGlsLWNvbG9ycy1pbmRpZ28taW5kaWdvLTYwMCcsXG4gICAgdGl0bGU6ICdHZW5lcmFsJyxcbiAgICBkZXNjcmlwdGlvbjogdCgnc3RlcFR3by5nZW5lcmFsVGlwJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksXG4gICAgZWZmZWN0Q29sb3I6IEVmZmVjdENvbG9yLmluZGlnbyxcbiAgICBzaG93RWZmZWN0Q29sb3I6IHRydWUsXG4gIH1cbiAgY29uc3QgUGFyZW50Q2hpbGRPcHRpb246IE9wdGlvbiA9IHtcbiAgICBpZDogQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkLFxuICAgIGljb246IDxQYXJlbnRDaGlsZENodW5rIGNsYXNzTmFtZT1cInNpemUtWzE4cHhdXCIgLz4sXG4gICAgaWNvbkFjdGl2ZUNvbG9yOiAndGV4dC11dGlsLWNvbG9ycy1ibHVlLWxpZ2h0LWJsdWUtbGlnaHQtNTAwJyxcbiAgICB0aXRsZTogJ1BhcmVudC1DaGlsZCcsXG4gICAgZGVzY3JpcHRpb246IHQoJ3N0ZXBUd28ucGFyZW50Q2hpbGRUaXAnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KSxcbiAgICBlZmZlY3RDb2xvcjogRWZmZWN0Q29sb3IuYmx1ZUxpZ2h0LFxuICAgIHNob3dFZmZlY3RDb2xvcjogdHJ1ZSxcbiAgfVxuICBjb25zdCBRdWVzdGlvbkFuc3dlck9wdGlvbjogT3B0aW9uID0ge1xuICAgIGlkOiBDaHVua2luZ01vZGUucWEsXG4gICAgaWNvbjogPFF1ZXN0aW9uQW5kQW5zd2VyIGNsYXNzTmFtZT1cInNpemUtWzE4cHhdXCIgLz4sXG4gICAgdGl0bGU6ICdRJkEnLFxuICAgIGRlc2NyaXB0aW9uOiB0KCdzdGVwVHdvLnFhVGlwJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksXG4gIH1cblxuICBjb25zdCBvcHRpb25zID0gW1xuICAgIEdlbmVyYWxPcHRpb24sXG4gICAgUGFyZW50Q2hpbGRPcHRpb24sXG4gICAgUXVlc3Rpb25BbnN3ZXJPcHRpb24sXG4gIF1cblxuICByZXR1cm4ge1xuICAgIG9wdGlvbnMsXG4gIH1cbn1cbiJdfQ==