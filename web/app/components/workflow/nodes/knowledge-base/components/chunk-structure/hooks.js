"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChunkStructure = void 0;
const react_i18next_1 = require("react-i18next");
const knowledge_1 = require("@/app/components/base/icons/src/vender/knowledge");
const classnames_1 = require("@/utils/classnames");
const types_1 = require("../../types");
const useChunkStructure = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const GeneralOption = {
        id: types_1.ChunkStructureEnum.general,
        icon: (isActive) => (<knowledge_1.GeneralChunk className={(0, classnames_1.cn)('h-[18px] w-[18px] text-text-tertiary group-hover:text-util-colors-indigo-indigo-600', isActive && 'text-util-colors-indigo-indigo-600')}/>),
        title: t('stepTwo.general', { ns: 'datasetCreation' }),
        description: t('stepTwo.generalTip', { ns: 'datasetCreation' }),
        effectColor: 'blue',
    };
    const ParentChildOption = {
        id: types_1.ChunkStructureEnum.parent_child,
        icon: (isActive) => (<knowledge_1.ParentChildChunk className={(0, classnames_1.cn)('h-[18px] w-[18px] text-text-tertiary group-hover:text-util-colors-blue-light-blue-light-500', isActive && 'text-util-colors-blue-light-blue-light-500')}/>),
        title: t('stepTwo.parentChild', { ns: 'datasetCreation' }),
        description: t('stepTwo.parentChildTip', { ns: 'datasetCreation' }),
        effectColor: 'blue-light',
    };
    const QuestionAnswerOption = {
        id: types_1.ChunkStructureEnum.question_answer,
        icon: (isActive) => (<knowledge_1.QuestionAndAnswer className={(0, classnames_1.cn)('h-[18px] w-[18px] text-text-tertiary group-hover:text-util-colors-teal-teal-600', isActive && 'text-util-colors-teal-teal-600')}/>),
        title: 'Q&A',
        description: t('stepTwo.qaTip', { ns: 'datasetCreation' }),
        effectColor: 'teal',
    };
    const optionMap = {
        [types_1.ChunkStructureEnum.general]: GeneralOption,
        [types_1.ChunkStructureEnum.parent_child]: ParentChildOption,
        [types_1.ChunkStructureEnum.question_answer]: QuestionAnswerOption,
    };
    const options = [
        GeneralOption,
        ParentChildOption,
        QuestionAnswerOption,
    ];
    return {
        options,
        optionMap,
    };
};
exports.useChunkStructure = useChunkStructure;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaURBQThDO0FBQzlDLGdGQUl5RDtBQUN6RCxtREFBdUM7QUFDdkMsdUNBQWdEO0FBRXpDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLGFBQWEsR0FBVztRQUM1QixFQUFFLEVBQUUsMEJBQWtCLENBQUMsT0FBTztRQUM5QixJQUFJLEVBQUUsQ0FBQyxRQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUMzQixDQUFDLHdCQUFZLENBQ1gsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQ1gscUZBQXFGLEVBQ3JGLFFBQVEsSUFBSSxvQ0FBb0MsQ0FDakQsQ0FBQyxFQUNGLENBQ0g7UUFDRCxLQUFLLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUM7UUFDdEQsV0FBVyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO1FBQy9ELFdBQVcsRUFBRSxNQUFNO0tBQ3BCLENBQUE7SUFDRCxNQUFNLGlCQUFpQixHQUFXO1FBQ2hDLEVBQUUsRUFBRSwwQkFBa0IsQ0FBQyxZQUFZO1FBQ25DLElBQUksRUFBRSxDQUFDLFFBQWlCLEVBQUUsRUFBRSxDQUFDLENBQzNCLENBQUMsNEJBQWdCLENBQ2YsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQ1gsNkZBQTZGLEVBQzdGLFFBQVEsSUFBSSw0Q0FBNEMsQ0FDekQsQ0FBQyxFQUNGLENBQ0g7UUFDRCxLQUFLLEVBQUUsQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLENBQUM7UUFDMUQsV0FBVyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO1FBQ25FLFdBQVcsRUFBRSxZQUFZO0tBQzFCLENBQUE7SUFDRCxNQUFNLG9CQUFvQixHQUFXO1FBQ25DLEVBQUUsRUFBRSwwQkFBa0IsQ0FBQyxlQUFlO1FBQ3RDLElBQUksRUFBRSxDQUFDLFFBQWlCLEVBQUUsRUFBRSxDQUFDLENBQzNCLENBQUMsNkJBQWlCLENBQ2hCLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUNYLGlGQUFpRixFQUNqRixRQUFRLElBQUksZ0NBQWdDLENBQzdDLENBQUMsRUFDRixDQUNIO1FBQ0QsS0FBSyxFQUFFLEtBQUs7UUFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO1FBQzFELFdBQVcsRUFBRSxNQUFNO0tBQ3BCLENBQUE7SUFFRCxNQUFNLFNBQVMsR0FBdUM7UUFDcEQsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFhO1FBQzNDLENBQUMsMEJBQWtCLENBQUMsWUFBWSxDQUFDLEVBQUUsaUJBQWlCO1FBQ3BELENBQUMsMEJBQWtCLENBQUMsZUFBZSxDQUFDLEVBQUUsb0JBQW9CO0tBQzNELENBQUE7SUFFRCxNQUFNLE9BQU8sR0FBRztRQUNkLGFBQWE7UUFDYixpQkFBaUI7UUFDakIsb0JBQW9CO0tBQ3JCLENBQUE7SUFFRCxPQUFPO1FBQ0wsT0FBTztRQUNQLFNBQVM7S0FDVixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBN0RZLFFBQUEsaUJBQWlCLHFCQTZEN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE9wdGlvbiB9IGZyb20gJy4vdHlwZSdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7XG4gIEdlbmVyYWxDaHVuayxcbiAgUGFyZW50Q2hpbGRDaHVuayxcbiAgUXVlc3Rpb25BbmRBbnN3ZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL2tub3dsZWRnZSdcbmltcG9ydCB7IGNuIH0gZnJvbSAnQC91dGlscy9jbGFzc25hbWVzJ1xuaW1wb3J0IHsgQ2h1bmtTdHJ1Y3R1cmVFbnVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VDaHVua1N0cnVjdHVyZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IEdlbmVyYWxPcHRpb246IE9wdGlvbiA9IHtcbiAgICBpZDogQ2h1bmtTdHJ1Y3R1cmVFbnVtLmdlbmVyYWwsXG4gICAgaWNvbjogKGlzQWN0aXZlOiBib29sZWFuKSA9PiAoXG4gICAgICA8R2VuZXJhbENodW5rXG4gICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgJ2gtWzE4cHhdIHctWzE4cHhdIHRleHQtdGV4dC10ZXJ0aWFyeSBncm91cC1ob3Zlcjp0ZXh0LXV0aWwtY29sb3JzLWluZGlnby1pbmRpZ28tNjAwJyxcbiAgICAgICAgICBpc0FjdGl2ZSAmJiAndGV4dC11dGlsLWNvbG9ycy1pbmRpZ28taW5kaWdvLTYwMCcsXG4gICAgICAgICl9XG4gICAgICAvPlxuICAgICksXG4gICAgdGl0bGU6IHQoJ3N0ZXBUd28uZ2VuZXJhbCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pLFxuICAgIGRlc2NyaXB0aW9uOiB0KCdzdGVwVHdvLmdlbmVyYWxUaXAnLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJyB9KSxcbiAgICBlZmZlY3RDb2xvcjogJ2JsdWUnLFxuICB9XG4gIGNvbnN0IFBhcmVudENoaWxkT3B0aW9uOiBPcHRpb24gPSB7XG4gICAgaWQ6IENodW5rU3RydWN0dXJlRW51bS5wYXJlbnRfY2hpbGQsXG4gICAgaWNvbjogKGlzQWN0aXZlOiBib29sZWFuKSA9PiAoXG4gICAgICA8UGFyZW50Q2hpbGRDaHVua1xuICAgICAgICBjbGFzc05hbWU9e2NuKFxuICAgICAgICAgICdoLVsxOHB4XSB3LVsxOHB4XSB0ZXh0LXRleHQtdGVydGlhcnkgZ3JvdXAtaG92ZXI6dGV4dC11dGlsLWNvbG9ycy1ibHVlLWxpZ2h0LWJsdWUtbGlnaHQtNTAwJyxcbiAgICAgICAgICBpc0FjdGl2ZSAmJiAndGV4dC11dGlsLWNvbG9ycy1ibHVlLWxpZ2h0LWJsdWUtbGlnaHQtNTAwJyxcbiAgICAgICAgKX1cbiAgICAgIC8+XG4gICAgKSxcbiAgICB0aXRsZTogdCgnc3RlcFR3by5wYXJlbnRDaGlsZCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pLFxuICAgIGRlc2NyaXB0aW9uOiB0KCdzdGVwVHdvLnBhcmVudENoaWxkVGlwJywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSksXG4gICAgZWZmZWN0Q29sb3I6ICdibHVlLWxpZ2h0JyxcbiAgfVxuICBjb25zdCBRdWVzdGlvbkFuc3dlck9wdGlvbjogT3B0aW9uID0ge1xuICAgIGlkOiBDaHVua1N0cnVjdHVyZUVudW0ucXVlc3Rpb25fYW5zd2VyLFxuICAgIGljb246IChpc0FjdGl2ZTogYm9vbGVhbikgPT4gKFxuICAgICAgPFF1ZXN0aW9uQW5kQW5zd2VyXG4gICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgJ2gtWzE4cHhdIHctWzE4cHhdIHRleHQtdGV4dC10ZXJ0aWFyeSBncm91cC1ob3Zlcjp0ZXh0LXV0aWwtY29sb3JzLXRlYWwtdGVhbC02MDAnLFxuICAgICAgICAgIGlzQWN0aXZlICYmICd0ZXh0LXV0aWwtY29sb3JzLXRlYWwtdGVhbC02MDAnLFxuICAgICAgICApfVxuICAgICAgLz5cbiAgICApLFxuICAgIHRpdGxlOiAnUSZBJyxcbiAgICBkZXNjcmlwdGlvbjogdCgnc3RlcFR3by5xYVRpcCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pLFxuICAgIGVmZmVjdENvbG9yOiAndGVhbCcsXG4gIH1cblxuICBjb25zdCBvcHRpb25NYXA6IFJlY29yZDxDaHVua1N0cnVjdHVyZUVudW0sIE9wdGlvbj4gPSB7XG4gICAgW0NodW5rU3RydWN0dXJlRW51bS5nZW5lcmFsXTogR2VuZXJhbE9wdGlvbixcbiAgICBbQ2h1bmtTdHJ1Y3R1cmVFbnVtLnBhcmVudF9jaGlsZF06IFBhcmVudENoaWxkT3B0aW9uLFxuICAgIFtDaHVua1N0cnVjdHVyZUVudW0ucXVlc3Rpb25fYW5zd2VyXTogUXVlc3Rpb25BbnN3ZXJPcHRpb24sXG4gIH1cblxuICBjb25zdCBvcHRpb25zID0gW1xuICAgIEdlbmVyYWxPcHRpb24sXG4gICAgUGFyZW50Q2hpbGRPcHRpb24sXG4gICAgUXVlc3Rpb25BbnN3ZXJPcHRpb24sXG4gIF1cblxuICByZXR1cm4ge1xuICAgIG9wdGlvbnMsXG4gICAgb3B0aW9uTWFwLFxuICB9XG59XG4iXX0=