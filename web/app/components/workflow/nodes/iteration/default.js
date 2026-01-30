"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_2 = require("../../types");
const i18nPrefix = '';
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Logic,
    sort: 2,
    type: types_2.BlockEnum.Iteration,
    isTypeFixed: true,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        start_node_id: '',
        iterator_selector: [],
        output_selector: [],
        _children: [],
        _isShowTips: false,
        is_parallel: false,
        parallel_nums: 10,
        error_handle_mode: types_2.ErrorHandleMode.Terminated,
        flatten_output: true,
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages
            && (!payload.iterator_selector || payload.iterator_selector.length === 0)) {
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, {
                ns: 'workflow',
                field: t(`${i18nPrefix}nodes.iteration.input`, { ns: 'workflow' }),
            });
        }
        if (!errorMessages
            && (!payload.output_selector || payload.output_selector.length === 0)) {
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, {
                ns: 'workflow',
                field: t(`${i18nPrefix}nodes.iteration.output`, { ns: 'workflow' }),
            });
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQWlFO0FBQ2pFLHVDQUF3RDtBQUV4RCxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUE7QUFFckIsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxLQUFLO0lBQzdDLElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsU0FBUztJQUN6QixXQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBbUM7SUFDbEQsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsZUFBZSxFQUFFLEVBQUU7UUFDbkIsU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFXLEVBQUUsS0FBSztRQUNsQixXQUFXLEVBQUUsS0FBSztRQUNsQixhQUFhLEVBQUUsRUFBRTtRQUNqQixpQkFBaUIsRUFBRSx1QkFBZSxDQUFDLFVBQVU7UUFDN0MsY0FBYyxFQUFFLElBQUk7S0FDckI7SUFDRCxVQUFVLENBQUMsT0FBMEIsRUFBRSxDQUFNO1FBQzNDLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQTtRQUV0QixJQUNFLENBQUMsYUFBYTtlQUNYLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFDekUsQ0FBQztZQUNELGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFO2dCQUN2RCxFQUFFLEVBQUUsVUFBVTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQzthQUNuRSxDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsSUFDRSxDQUFDLGFBQWE7ZUFDWCxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFDckUsQ0FBQztZQUNELGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLHdCQUF3QixFQUFFO2dCQUN2RCxFQUFFLEVBQUUsVUFBVTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQzthQUNwRSxDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsT0FBTztZQUNMLE9BQU8sRUFBRSxDQUFDLGFBQWE7WUFDdkIsWUFBWSxFQUFFLGFBQWE7U0FDNUIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRGVmYXVsdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJdGVyYXRpb25Ob2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtLCBFcnJvckhhbmRsZU1vZGUgfSBmcm9tICcuLi8uLi90eXBlcydcblxuY29uc3QgaTE4blByZWZpeCA9ICcnXG5cbmNvbnN0IG1ldGFEYXRhID0gZ2VuTm9kZU1ldGFEYXRhKHtcbiAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkxvZ2ljLFxuICBzb3J0OiAyLFxuICB0eXBlOiBCbG9ja0VudW0uSXRlcmF0aW9uLFxuICBpc1R5cGVGaXhlZDogdHJ1ZSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8SXRlcmF0aW9uTm9kZVR5cGU+ID0ge1xuICBtZXRhRGF0YSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgc3RhcnRfbm9kZV9pZDogJycsXG4gICAgaXRlcmF0b3Jfc2VsZWN0b3I6IFtdLFxuICAgIG91dHB1dF9zZWxlY3RvcjogW10sXG4gICAgX2NoaWxkcmVuOiBbXSxcbiAgICBfaXNTaG93VGlwczogZmFsc2UsXG4gICAgaXNfcGFyYWxsZWw6IGZhbHNlLFxuICAgIHBhcmFsbGVsX251bXM6IDEwLFxuICAgIGVycm9yX2hhbmRsZV9tb2RlOiBFcnJvckhhbmRsZU1vZGUuVGVybWluYXRlZCxcbiAgICBmbGF0dGVuX291dHB1dDogdHJ1ZSxcbiAgfSxcbiAgY2hlY2tWYWxpZChwYXlsb2FkOiBJdGVyYXRpb25Ob2RlVHlwZSwgdDogYW55KSB7XG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuXG4gICAgaWYgKFxuICAgICAgIWVycm9yTWVzc2FnZXNcbiAgICAgICYmICghcGF5bG9hZC5pdGVyYXRvcl9zZWxlY3RvciB8fCBwYXlsb2FkLml0ZXJhdG9yX3NlbGVjdG9yLmxlbmd0aCA9PT0gMClcbiAgICApIHtcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHtcbiAgICAgICAgbnM6ICd3b3JrZmxvdycsXG4gICAgICAgIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9bm9kZXMuaXRlcmF0aW9uLmlucHV0YCwgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWVycm9yTWVzc2FnZXNcbiAgICAgICYmICghcGF5bG9hZC5vdXRwdXRfc2VsZWN0b3IgfHwgcGF5bG9hZC5vdXRwdXRfc2VsZWN0b3IubGVuZ3RoID09PSAwKVxuICAgICkge1xuICAgICAgZXJyb3JNZXNzYWdlcyA9IHQoYCR7aTE4blByZWZpeH1lcnJvck1zZy5maWVsZFJlcXVpcmVkYCwge1xuICAgICAgICBuczogJ3dvcmtmbG93JyxcbiAgICAgICAgZmllbGQ6IHQoYCR7aTE4blByZWZpeH1ub2Rlcy5pdGVyYXRpb24ub3V0cHV0YCwgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6ICFlcnJvck1lc3NhZ2VzLFxuICAgICAgZXJyb3JNZXNzYWdlOiBlcnJvck1lc3NhZ2VzLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==