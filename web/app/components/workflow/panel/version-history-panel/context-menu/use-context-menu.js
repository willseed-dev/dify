"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("../../../types");
const useContextMenu = (props) => {
    const { isNamedVersion, } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const deleteOperation = {
        key: types_1.VersionHistoryContextMenuOptions.delete,
        name: t('operation.delete', { ns: 'common' }),
    };
    const options = (0, react_1.useMemo)(() => {
        return [
            {
                key: types_1.VersionHistoryContextMenuOptions.restore,
                name: t('common.restore', { ns: 'workflow' }),
            },
            isNamedVersion
                ? {
                    key: types_1.VersionHistoryContextMenuOptions.edit,
                    name: t('versionHistory.editVersionInfo', { ns: 'workflow' }),
                }
                : {
                    key: types_1.VersionHistoryContextMenuOptions.edit,
                    name: t('versionHistory.nameThisVersion', { ns: 'workflow' }),
                },
            // todo: pipeline support export specific version DSL
            ...(!pipelineId
                ? [{
                        key: types_1.VersionHistoryContextMenuOptions.exportDSL,
                        name: t('export', { ns: 'app' }),
                    }]
                : []),
            {
                key: types_1.VersionHistoryContextMenuOptions.copyId,
                name: t('versionHistory.copyId', { ns: 'workflow' }),
            },
        ];
    }, [isNamedVersion, t]);
    return {
        deleteOperation,
        options,
    };
};
exports.default = useContextMenu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbnRleHQtbWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb250ZXh0LW1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBK0I7QUFDL0IsaURBQThDO0FBQzlDLDJEQUEwRDtBQUMxRCwwQ0FBaUU7QUFFakUsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUF1QixFQUFFLEVBQUU7SUFDakQsTUFBTSxFQUNKLGNBQWMsR0FDZixHQUFHLEtBQUssQ0FBQTtJQUNULE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFOUMsTUFBTSxlQUFlLEdBQUc7UUFDdEIsR0FBRyxFQUFFLHdDQUFnQyxDQUFDLE1BQU07UUFDNUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQztLQUM5QyxDQUFBO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzNCLE9BQU87WUFDTDtnQkFDRSxHQUFHLEVBQUUsd0NBQWdDLENBQUMsT0FBTztnQkFDN0MsSUFBSSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQzthQUM5QztZQUNELGNBQWM7Z0JBQ1osQ0FBQyxDQUFDO29CQUNFLEdBQUcsRUFBRSx3Q0FBZ0MsQ0FBQyxJQUFJO29CQUMxQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDO2lCQUM5RDtnQkFDSCxDQUFDLENBQUM7b0JBQ0UsR0FBRyxFQUFFLHdDQUFnQyxDQUFDLElBQUk7b0JBQzFDLElBQUksRUFBRSxDQUFDLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7aUJBQzlEO1lBQ0wscURBQXFEO1lBQ3JELEdBQUcsQ0FBQyxDQUFDLFVBQVU7Z0JBQ2IsQ0FBQyxDQUFDLENBQUM7d0JBQ0MsR0FBRyxFQUFFLHdDQUFnQyxDQUFDLFNBQVM7d0JBQy9DLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDO3FCQUNqQyxDQUFDO2dCQUNKLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDUDtnQkFDRSxHQUFHLEVBQUUsd0NBQWdDLENBQUMsTUFBTTtnQkFDNUMsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQzthQUNyRDtTQUNGLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUV2QixPQUFPO1FBQ0wsZUFBZTtRQUNmLE9BQU87S0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDb250ZXh0TWVudVByb3BzIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5cbmNvbnN0IHVzZUNvbnRleHRNZW51ID0gKHByb3BzOiBDb250ZXh0TWVudVByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBpc05hbWVkVmVyc2lvbixcbiAgfSA9IHByb3BzXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBwaXBlbGluZUlkID0gdXNlU3RvcmUocyA9PiBzLnBpcGVsaW5lSWQpXG5cbiAgY29uc3QgZGVsZXRlT3BlcmF0aW9uID0ge1xuICAgIGtleTogVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZGVsZXRlLFxuICAgIG5hbWU6IHQoJ29wZXJhdGlvbi5kZWxldGUnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgfVxuXG4gIGNvbnN0IG9wdGlvbnMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBrZXk6IFZlcnNpb25IaXN0b3J5Q29udGV4dE1lbnVPcHRpb25zLnJlc3RvcmUsXG4gICAgICAgIG5hbWU6IHQoJ2NvbW1vbi5yZXN0b3JlJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIH0sXG4gICAgICBpc05hbWVkVmVyc2lvblxuICAgICAgICA/IHtcbiAgICAgICAgICAgIGtleTogVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZWRpdCxcbiAgICAgICAgICAgIG5hbWU6IHQoJ3ZlcnNpb25IaXN0b3J5LmVkaXRWZXJzaW9uSW5mbycsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgfVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIGtleTogVmVyc2lvbkhpc3RvcnlDb250ZXh0TWVudU9wdGlvbnMuZWRpdCxcbiAgICAgICAgICAgIG5hbWU6IHQoJ3ZlcnNpb25IaXN0b3J5Lm5hbWVUaGlzVmVyc2lvbicsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgfSxcbiAgICAgIC8vIHRvZG86IHBpcGVsaW5lIHN1cHBvcnQgZXhwb3J0IHNwZWNpZmljIHZlcnNpb24gRFNMXG4gICAgICAuLi4oIXBpcGVsaW5lSWRcbiAgICAgICAgPyBbe1xuICAgICAgICAgICAga2V5OiBWZXJzaW9uSGlzdG9yeUNvbnRleHRNZW51T3B0aW9ucy5leHBvcnREU0wsXG4gICAgICAgICAgICBuYW1lOiB0KCdleHBvcnQnLCB7IG5zOiAnYXBwJyB9KSxcbiAgICAgICAgICB9XVxuICAgICAgICA6IFtdKSxcbiAgICAgIHtcbiAgICAgICAga2V5OiBWZXJzaW9uSGlzdG9yeUNvbnRleHRNZW51T3B0aW9ucy5jb3B5SWQsXG4gICAgICAgIG5hbWU6IHQoJ3ZlcnNpb25IaXN0b3J5LmNvcHlJZCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB9LFxuICAgIF1cbiAgfSwgW2lzTmFtZWRWZXJzaW9uLCB0XSlcblxuICByZXR1cm4ge1xuICAgIGRlbGV0ZU9wZXJhdGlvbixcbiAgICBvcHRpb25zLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUNvbnRleHRNZW51XG4iXX0=