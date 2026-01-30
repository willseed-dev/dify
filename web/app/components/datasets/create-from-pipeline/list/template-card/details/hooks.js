"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChunkStructureConfig = void 0;
const react_i18next_1 = require("react-i18next");
const knowledge_1 = require("@/app/components/base/icons/src/vender/knowledge");
const datasets_1 = require("@/models/datasets");
const types_1 = require("./types");
const useChunkStructureConfig = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const GeneralOption = {
        icon: <knowledge_1.GeneralChunk className="size-4"/>,
        title: 'General',
        description: t('stepTwo.generalTip', { ns: 'datasetCreation' }),
        effectColor: types_1.EffectColor.indigo,
    };
    const ParentChildOption = {
        icon: <knowledge_1.ParentChildChunk className="size-4"/>,
        title: 'Parent-Child',
        description: t('stepTwo.parentChildTip', { ns: 'datasetCreation' }),
        effectColor: types_1.EffectColor.blueLight,
    };
    const QuestionAnswerOption = {
        icon: <knowledge_1.QuestionAndAnswer className="size-4"/>,
        title: 'Q&A',
        description: t('stepTwo.qaTip', { ns: 'datasetCreation' }),
        effectColor: types_1.EffectColor.green,
    };
    const chunkStructureConfig = {
        [datasets_1.ChunkingMode.text]: GeneralOption,
        [datasets_1.ChunkingMode.parentChild]: ParentChildOption,
        [datasets_1.ChunkingMode.qa]: QuestionAnswerOption,
    };
    return chunkStructureConfig;
};
exports.useChunkStructureConfig = useChunkStructureConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaURBQThDO0FBQzlDLGdGQUFvSDtBQUNwSCxnREFBZ0Q7QUFDaEQsbUNBQXFDO0FBRTlCLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxFQUFFO0lBQzFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLGFBQWEsR0FBVztRQUM1QixJQUFJLEVBQUUsQ0FBQyx3QkFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUc7UUFDekMsS0FBSyxFQUFFLFNBQVM7UUFDaEIsV0FBVyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO1FBQy9ELFdBQVcsRUFBRSxtQkFBVyxDQUFDLE1BQU07S0FDaEMsQ0FBQTtJQUNELE1BQU0saUJBQWlCLEdBQVc7UUFDaEMsSUFBSSxFQUFFLENBQUMsNEJBQWdCLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRztRQUM3QyxLQUFLLEVBQUUsY0FBYztRQUNyQixXQUFXLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUM7UUFDbkUsV0FBVyxFQUFFLG1CQUFXLENBQUMsU0FBUztLQUNuQyxDQUFBO0lBQ0QsTUFBTSxvQkFBb0IsR0FBVztRQUNuQyxJQUFJLEVBQUUsQ0FBQyw2QkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFHO1FBQzlDLEtBQUssRUFBRSxLQUFLO1FBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztRQUMxRCxXQUFXLEVBQUUsbUJBQVcsQ0FBQyxLQUFLO0tBRS9CLENBQUE7SUFFRCxNQUFNLG9CQUFvQixHQUFpQztRQUN6RCxDQUFDLHVCQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYTtRQUNsQyxDQUFDLHVCQUFZLENBQUMsV0FBVyxDQUFDLEVBQUUsaUJBQWlCO1FBQzdDLENBQUMsdUJBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxvQkFBb0I7S0FDeEMsQ0FBQTtJQUVELE9BQU8sb0JBQW9CLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBOUJZLFFBQUEsdUJBQXVCLDJCQThCbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE9wdGlvbiB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBHZW5lcmFsQ2h1bmssIFBhcmVudENoaWxkQ2h1bmssIFF1ZXN0aW9uQW5kQW5zd2VyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIva25vd2xlZGdlJ1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBFZmZlY3RDb2xvciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VDaHVua1N0cnVjdHVyZUNvbmZpZyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgR2VuZXJhbE9wdGlvbjogT3B0aW9uID0ge1xuICAgIGljb246IDxHZW5lcmFsQ2h1bmsgY2xhc3NOYW1lPVwic2l6ZS00XCIgLz4sXG4gICAgdGl0bGU6ICdHZW5lcmFsJyxcbiAgICBkZXNjcmlwdGlvbjogdCgnc3RlcFR3by5nZW5lcmFsVGlwJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksXG4gICAgZWZmZWN0Q29sb3I6IEVmZmVjdENvbG9yLmluZGlnbyxcbiAgfVxuICBjb25zdCBQYXJlbnRDaGlsZE9wdGlvbjogT3B0aW9uID0ge1xuICAgIGljb246IDxQYXJlbnRDaGlsZENodW5rIGNsYXNzTmFtZT1cInNpemUtNFwiIC8+LFxuICAgIHRpdGxlOiAnUGFyZW50LUNoaWxkJyxcbiAgICBkZXNjcmlwdGlvbjogdCgnc3RlcFR3by5wYXJlbnRDaGlsZFRpcCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pLFxuICAgIGVmZmVjdENvbG9yOiBFZmZlY3RDb2xvci5ibHVlTGlnaHQsXG4gIH1cbiAgY29uc3QgUXVlc3Rpb25BbnN3ZXJPcHRpb246IE9wdGlvbiA9IHtcbiAgICBpY29uOiA8UXVlc3Rpb25BbmRBbnN3ZXIgY2xhc3NOYW1lPVwic2l6ZS00XCIgLz4sXG4gICAgdGl0bGU6ICdRJkEnLFxuICAgIGRlc2NyaXB0aW9uOiB0KCdzdGVwVHdvLnFhVGlwJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksXG4gICAgZWZmZWN0Q29sb3I6IEVmZmVjdENvbG9yLmdyZWVuLFxuXG4gIH1cblxuICBjb25zdCBjaHVua1N0cnVjdHVyZUNvbmZpZzogUmVjb3JkPENodW5raW5nTW9kZSwgT3B0aW9uPiA9IHtcbiAgICBbQ2h1bmtpbmdNb2RlLnRleHRdOiBHZW5lcmFsT3B0aW9uLFxuICAgIFtDaHVua2luZ01vZGUucGFyZW50Q2hpbGRdOiBQYXJlbnRDaGlsZE9wdGlvbixcbiAgICBbQ2h1bmtpbmdNb2RlLnFhXTogUXVlc3Rpb25BbnN3ZXJPcHRpb24sXG4gIH1cblxuICByZXR1cm4gY2h1bmtTdHJ1Y3R1cmVDb25maWdcbn1cbiJdfQ==