"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/hooks-store/store");
const types_1 = require("@/app/components/workflow/types");
const store_2 = require("../store");
const main_1 = require("./main");
const NodeSelectorWrapper = (props) => {
    const availableNodesMetaData = (0, store_1.useHooksStore)(s => s.availableNodesMetaData);
    const dataSourceList = (0, store_2.useStore)(s => s.dataSourceList);
    const blocks = (0, react_1.useMemo)(() => {
        const result = availableNodesMetaData?.nodes || [];
        return result.filter((block) => {
            if (block.metaData.type === types_1.BlockEnum.Start)
                return false;
            if (block.metaData.type === types_1.BlockEnum.DataSource)
                return false;
            if (block.metaData.type === types_1.BlockEnum.Tool)
                return false;
            if (block.metaData.type === types_1.BlockEnum.IterationStart)
                return false;
            if (block.metaData.type === types_1.BlockEnum.LoopStart)
                return false;
            if (block.metaData.type === types_1.BlockEnum.DataSourceEmpty)
                return false;
            return true;
        });
    }, [availableNodesMetaData?.nodes]);
    return (<main_1.default {...props} blocks={props.blocks || blocks} dataSources={props.dataSources || dataSourceList || []}/>);
};
exports.default = NodeSelectorWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FFYztBQUNkLHVFQUEyRTtBQUMzRSwyREFBMkQ7QUFDM0Qsb0NBQW1DO0FBQ25DLGlDQUFpQztBQUVqQyxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBd0IsRUFBRSxFQUFFO0lBQ3ZELE1BQU0sc0JBQXNCLEdBQUcsSUFBQSxxQkFBYSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUE7SUFDM0UsTUFBTSxjQUFjLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRXRELE1BQU0sTUFBTSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUMxQixNQUFNLE1BQU0sR0FBRyxzQkFBc0IsRUFBRSxLQUFLLElBQUksRUFBRSxDQUFBO1FBRWxELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzdCLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxLQUFLO2dCQUN6QyxPQUFPLEtBQUssQ0FBQTtZQUVkLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxVQUFVO2dCQUM5QyxPQUFPLEtBQUssQ0FBQTtZQUVkLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxJQUFJO2dCQUN4QyxPQUFPLEtBQUssQ0FBQTtZQUVkLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxjQUFjO2dCQUNsRCxPQUFPLEtBQUssQ0FBQTtZQUVkLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxTQUFTO2dCQUM3QyxPQUFPLEtBQUssQ0FBQTtZQUVkLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxlQUFlO2dCQUNuRCxPQUFPLEtBQUssQ0FBQTtZQUVkLE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBRW5DLE9BQU8sQ0FDTCxDQUFDLGNBQVksQ0FDWCxJQUFJLEtBQUssQ0FBQyxDQUNWLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQy9CLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksY0FBYyxJQUFJLEVBQUUsQ0FBQyxFQUN2RCxDQUNILENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxtQkFBbUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZVNlbGVjdG9yUHJvcHMgfSBmcm9tICcuL21haW4nXG5pbXBvcnQge1xuICB1c2VNZW1vLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUhvb2tzU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzLXN0b3JlL3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnLi4vc3RvcmUnXG5pbXBvcnQgTm9kZVNlbGVjdG9yIGZyb20gJy4vbWFpbidcblxuY29uc3QgTm9kZVNlbGVjdG9yV3JhcHBlciA9IChwcm9wczogTm9kZVNlbGVjdG9yUHJvcHMpID0+IHtcbiAgY29uc3QgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSA9IHVzZUhvb2tzU3RvcmUocyA9PiBzLmF2YWlsYWJsZU5vZGVzTWV0YURhdGEpXG4gIGNvbnN0IGRhdGFTb3VyY2VMaXN0ID0gdXNlU3RvcmUocyA9PiBzLmRhdGFTb3VyY2VMaXN0KVxuXG4gIGNvbnN0IGJsb2NrcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF2YWlsYWJsZU5vZGVzTWV0YURhdGE/Lm5vZGVzIHx8IFtdXG5cbiAgICByZXR1cm4gcmVzdWx0LmZpbHRlcigoYmxvY2spID0+IHtcbiAgICAgIGlmIChibG9jay5tZXRhRGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBpZiAoYmxvY2subWV0YURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBpZiAoYmxvY2subWV0YURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRvb2wpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBpZiAoYmxvY2subWV0YURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkl0ZXJhdGlvblN0YXJ0KVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgaWYgKGJsb2NrLm1ldGFEYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Mb29wU3RhcnQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBpZiAoYmxvY2subWV0YURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2VFbXB0eSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgfSwgW2F2YWlsYWJsZU5vZGVzTWV0YURhdGE/Lm5vZGVzXSlcblxuICByZXR1cm4gKFxuICAgIDxOb2RlU2VsZWN0b3JcbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIGJsb2Nrcz17cHJvcHMuYmxvY2tzIHx8IGJsb2Nrc31cbiAgICAgIGRhdGFTb3VyY2VzPXtwcm9wcy5kYXRhU291cmNlcyB8fCBkYXRhU291cmNlTGlzdCB8fCBbXX1cbiAgICAvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVTZWxlY3RvcldyYXBwZXJcbiJdfQ==