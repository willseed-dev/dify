"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("es-toolkit/object");
const types_1 = require("../../../types");
const agent_1 = require("./agent");
const iteration_1 = require("./iteration");
const loop_1 = require("./loop");
const parallel_1 = require("./parallel");
const retry_1 = require("./retry");
const formatIterationAndLoopNode = (list, t) => {
    const clonedList = (0, object_1.cloneDeep)(list);
    // Identify all loop and iteration nodes
    const loopNodeIds = clonedList
        .filter(item => item.node_type === types_1.BlockEnum.Loop)
        .map(item => item.node_id);
    const iterationNodeIds = clonedList
        .filter(item => item.node_type === types_1.BlockEnum.Iteration)
        .map(item => item.node_id);
    // Identify all child nodes for both loop and iteration
    const loopChildrenNodeIds = clonedList
        .filter(item => item.execution_metadata?.loop_id && loopNodeIds.includes(item.execution_metadata.loop_id))
        .map(item => item.node_id);
    const iterationChildrenNodeIds = clonedList
        .filter(item => item.execution_metadata?.iteration_id && iterationNodeIds.includes(item.execution_metadata.iteration_id))
        .map(item => item.node_id);
    // Filter out child nodes as they will be included in their parent nodes
    const result = clonedList
        .filter(item => !loopChildrenNodeIds.includes(item.node_id) && !iterationChildrenNodeIds.includes(item.node_id))
        .map((item) => {
        // Process Loop nodes
        if (item.node_type === types_1.BlockEnum.Loop) {
            const childrenNodes = clonedList.filter(child => child.execution_metadata?.loop_id === item.node_id);
            const error = childrenNodes.find(child => child.status === 'failed');
            if (error) {
                item.status = 'failed';
                item.error = error.error;
            }
            const addedChildrenList = (0, loop_1.addChildrenToLoopNode)(item, childrenNodes);
            // Handle parallel nodes in loop node
            if (addedChildrenList.details && addedChildrenList.details.length > 0) {
                addedChildrenList.details = addedChildrenList.details.map((row) => {
                    return (0, parallel_1.default)(row, t);
                });
            }
            return addedChildrenList;
        }
        // Process Iteration nodes
        if (item.node_type === types_1.BlockEnum.Iteration) {
            const childrenNodes = clonedList.filter(child => child.execution_metadata?.iteration_id === item.node_id);
            const error = childrenNodes.find(child => child.status === 'failed');
            if (error) {
                item.status = 'failed';
                item.error = error.error;
            }
            const addedChildrenList = (0, iteration_1.addChildrenToIterationNode)(item, childrenNodes);
            // Handle parallel nodes in iteration node
            if (addedChildrenList.details && addedChildrenList.details.length > 0) {
                addedChildrenList.details = addedChildrenList.details.map((row) => {
                    return (0, parallel_1.default)(row, t);
                });
            }
            return addedChildrenList;
        }
        return item;
    });
    return result;
};
const formatToTracingNodeList = (list, t) => {
    const allItems = (0, object_1.cloneDeep)([...list]).sort((a, b) => a.index - b.index);
    /*
    * First handle not change list structure node
    * Because Handle struct node will put the node in different
    */
    const formattedAgentList = (0, agent_1.default)(allItems);
    const formattedRetryList = (0, retry_1.default)(formattedAgentList); // retry one node
    // would change the structure of the list. Iteration and parallel can include each other.
    const formattedLoopAndIterationList = formatIterationAndLoopNode(formattedRetryList, t);
    const formattedParallelList = (0, parallel_1.default)(formattedLoopAndIterationList, t);
    const result = formattedParallelList;
    // console.log(allItems)
    // console.log(result)
    return result;
};
exports.default = formatToTracingNodeList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhDQUE2QztBQUM3QywwQ0FBMEM7QUFDMUMsbUNBQXFDO0FBQ3JDLDJDQUF3RDtBQUN4RCxpQ0FBOEM7QUFDOUMseUNBQTJDO0FBQzNDLG1DQUFxQztBQUVyQyxNQUFNLDBCQUEwQixHQUFHLENBQUMsSUFBbUIsRUFBRSxDQUFNLEVBQUUsRUFBRTtJQUNqRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGtCQUFTLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFFbEMsd0NBQXdDO0lBQ3hDLE1BQU0sV0FBVyxHQUFHLFVBQVU7U0FDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxpQkFBUyxDQUFDLElBQUksQ0FBQztTQUNqRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFNUIsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVO1NBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssaUJBQVMsQ0FBQyxTQUFTLENBQUM7U0FDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTVCLHVEQUF1RDtJQUN2RCxNQUFNLG1CQUFtQixHQUFHLFVBQVU7U0FDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE9BQU8sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFNUIsTUFBTSx3QkFBd0IsR0FBRyxVQUFVO1NBQ3hDLE1BQU0s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T0FBTyxJQUFBLGtCQUFrQixFQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDbkMsQ0FBQyxDQUFDLENBQUE7WUFDSixDQUFDO1lBQ0QsT0FBTyxpQkFBaUIsQ0FBQTtRQUMxQixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLENBQUMsQ0FBQTtJQUVKLE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQyxDQUFBO0FBRUQsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLElBQW1CLEVBQUUsQ0FBTSxFQUFFLEVBQUU7SUFDOUQsTUFBTSxRQUFRLEdBQUcsSUFBQSxrQkFBUyxFQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZFOzs7TUFHRTtJQUNGLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxlQUFlLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFDcEQsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLGVBQWUsRUFBQyxrQkFBa0IsQ0FBQyxDQUFBLENBQUMsaUJBQWlCO0lBQ2hGLHlGQUF5RjtJQUN6RixNQUFNLDZCQUE2QixHQUFHLDBCQUEwQixDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3ZGLE1BQU0scUJBQXFCLEdBQUcsSUFBQSxrQkFBa0IsRUFBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUVsRixNQUFNLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQTtJQUNwQyx3QkFBd0I7SUFDeEIsc0JBQXNCO0lBRXRCLE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsdUJBQXVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVUcmFjaW5nIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IGNsb25lRGVlcCB9IGZyb20gJ2VzLXRvb2xraXQvb2JqZWN0J1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgZm9ybWF0QWdlbnROb2RlIGZyb20gJy4vYWdlbnQnXG5pbXBvcnQgeyBhZGRDaGlsZHJlblRvSXRlcmF0aW9uTm9kZSB9IGZyb20gJy4vaXRlcmF0aW9uJ1xuaW1wb3J0IHsgYWRkQ2hpbGRyZW5Ub0xvb3BOb2RlIH0gZnJvbSAnLi9sb29wJ1xuaW1wb3J0IGZvcm1hdFBhcmFsbGVsTm9kZSBmcm9tICcuL3BhcmFsbGVsJ1xuaW1wb3J0IGZvcm1hdFJldHJ5Tm9kZSBmcm9tICcuL3JldHJ5J1xuXG5jb25zdCBmb3JtYXRJdGVyYXRpb25BbmRMb29wTm9kZSA9IChsaXN0OiBOb2RlVHJhY2luZ1tdLCB0OiBhbnkpID0+IHtcbiAgY29uc3QgY2xvbmVkTGlzdCA9IGNsb25lRGVlcChsaXN0KVxuXG4gIC8vIElkZW50aWZ5IGFsbCBsb29wIGFuZCBpdGVyYXRpb24gbm9kZXNcbiAgY29uc3QgbG9vcE5vZGVJZHMgPSBjbG9uZWRMaXN0XG4gICAgLmZpbHRlcihpdGVtID0+IGl0ZW0ubm9kZV90eXBlID09PSBCbG9ja0VudW0uTG9vcClcbiAgICAubWFwKGl0ZW0gPT4gaXRlbS5ub2RlX2lkKVxuXG4gIGNvbnN0IGl0ZXJhdGlvbk5vZGVJZHMgPSBjbG9uZWRMaXN0XG4gICAgLmZpbHRlcihpdGVtID0+IGl0ZW0ubm9kZV90eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uKVxuICAgIC5tYXAoaXRlbSA9PiBpdGVtLm5vZGVfaWQpXG5cbiAgLy8gSWRlbnRpZnkgYWxsIGNoaWxkIG5vZGVzIGZvciBib3RoIGxvb3AgYW5kIGl0ZXJhdGlvblxuICBjb25zdCBsb29wQ2hpbGRyZW5Ob2RlSWRzID0gY2xvbmVkTGlzdFxuICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YT8ubG9vcF9pZCAmJiBsb29wTm9kZUlkcy5pbmNsdWRlcyhpdGVtLmV4ZWN1dGlvbl9tZXRhZGF0YS5sb29wX2lkKSlcbiAgICAubWFwKGl0ZW0gPT4gaXRlbS5ub2RlX2lkKVxuXG4gIGNvbnN0IGl0ZXJhdGlvbkNoaWxkcmVuTm9kZUlkcyA9IGNsb25lZExpc3RcbiAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbS5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pZCAmJiBpdGVyYXRpb25Ob2RlSWRzLmluY2x1ZGVzKGl0ZW0uZXhlY3V0aW9uX21ldGFkYXRhLml0ZXJhdGlvbl9pZCkpXG4gICAgLm1hcChpdGVtID0+IGl0ZW0ubm9kZV9pZClcblxuICAvLyBGaWx0ZXIgb3V0IGNoaWxkIG5vZGVzIGFzIHRoZXkgd2lsbCBiZSBpbmNsdWRlZCBpbiB0aGVpciBwYXJlbnQgbm9kZXNcbiAgY29uc3QgcmVzdWx0ID0gY2xvbmVkTGlzdFxuICAgIC5maWx0ZXIoaXRlbSA9PiAhbG9vcENoaWxkcmVuTm9kZUlkcy5pbmNsdWRlcyhpdGVtLm5vZGVfaWQpICYmICFpdGVyYXRpb25DaGlsZHJlbk5vZGVJZHMuaW5jbHVkZXMoaXRlbS5ub2RlX2lkKSlcbiAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAvLyBQcm9jZXNzIExvb3Agbm9kZXNcbiAgICAgIGlmIChpdGVtLm5vZGVfdHlwZSA9PT0gQmxvY2tFbnVtLkxvb3ApIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IGNsb25lZExpc3QuZmlsdGVyKGNoaWxkID0+IGNoaWxkLmV4ZWN1dGlvbl9tZXRhZGF0YT8ubG9vcF9pZCA9PT0gaXRlbS5ub2RlX2lkKVxuICAgICAgICBjb25zdCBlcnJvciA9IGNoaWxkcmVuTm9kZXMuZmluZChjaGlsZCA9PiBjaGlsZC5zdGF0dXMgPT09ICdmYWlsZWQnKVxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBpdGVtLnN0YXR1cyA9ICdmYWlsZWQnXG4gICAgICAgICAgaXRlbS5lcnJvciA9IGVycm9yLmVycm9yXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWRkZWRDaGlsZHJlbkxpc3QgPSBhZGRDaGlsZHJlblRvTG9vcE5vZGUoaXRlbSwgY2hpbGRyZW5Ob2RlcylcblxuICAgICAgICAvLyBIYW5kbGUgcGFyYWxsZWwgbm9kZXMgaW4gbG9vcCBub2RlXG4gICAgICAgIGlmIChhZGRlZENoaWxkcmVuTGlzdC5kZXRhaWxzICYmIGFkZGVkQ2hpbGRyZW5MaXN0LmRldGFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGFkZGVkQ2hpbGRyZW5MaXN0LmRldGFpbHMgPSBhZGRlZENoaWxkcmVuTGlzdC5kZXRhaWxzLm1hcCgocm93KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0UGFyYWxsZWxOb2RlKHJvdywgdClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhZGRlZENoaWxkcmVuTGlzdFxuICAgICAgfVxuXG4gICAgICAvLyBQcm9jZXNzIEl0ZXJhdGlvbiBub2Rlc1xuICAgICAgaWYgKGl0ZW0ubm9kZV90eXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuTm9kZXMgPSBjbG9uZWRMaXN0LmZpbHRlcihjaGlsZCA9PiBjaGlsZC5leGVjdXRpb25fbWV0YWRhdGE/Lml0ZXJhdGlvbl9pZCA9PT0gaXRlbS5ub2RlX2lkKVxuICAgICAgICBjb25zdCBlcnJvciA9IGNoaWxkcmVuTm9kZXMuZmluZChjaGlsZCA9PiBjaGlsZC5zdGF0dXMgPT09ICdmYWlsZWQnKVxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBpdGVtLnN0YXR1cyA9ICdmYWlsZWQnXG4gICAgICAgICAgaXRlbS5lcnJvciA9IGVycm9yLmVycm9yXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWRkZWRDaGlsZHJlbkxpc3QgPSBhZGRDaGlsZHJlblRvSXRlcmF0aW9uTm9kZShpdGVtLCBjaGlsZHJlbk5vZGVzKVxuXG4gICAgICAgIC8vIEhhbmRsZSBwYXJhbGxlbCBub2RlcyBpbiBpdGVyYXRpb24gbm9kZVxuICAgICAgICBpZiAoYWRkZWRDaGlsZHJlbkxpc3QuZGV0YWlscyAmJiBhZGRlZENoaWxkcmVuTGlzdC5kZXRhaWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhZGRlZENoaWxkcmVuTGlzdC5kZXRhaWxzID0gYWRkZWRDaGlsZHJlbkxpc3QuZGV0YWlscy5tYXAoKHJvdykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdFBhcmFsbGVsTm9kZShyb3csIHQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWRkZWRDaGlsZHJlbkxpc3RcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuY29uc3QgZm9ybWF0VG9UcmFjaW5nTm9kZUxpc3QgPSAobGlzdDogTm9kZVRyYWNpbmdbXSwgdDogYW55KSA9PiB7XG4gIGNvbnN0IGFsbEl0ZW1zID0gY2xvbmVEZWVwKFsuLi5saXN0XSkuc29ydCgoYSwgYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpXG4gIC8qXG4gICogRmlyc3QgaGFuZGxlIG5vdCBjaGFuZ2UgbGlzdCBzdHJ1Y3R1cmUgbm9kZVxuICAqIEJlY2F1c2UgSGFuZGxlIHN0cnVjdCBub2RlIHdpbGwgcHV0IHRoZSBub2RlIGluIGRpZmZlcmVudFxuICAqL1xuICBjb25zdCBmb3JtYXR0ZWRBZ2VudExpc3QgPSBmb3JtYXRBZ2VudE5vZGUoYWxsSXRlbXMpXG4gIGNvbnN0IGZvcm1hdHRlZFJldHJ5TGlzdCA9IGZvcm1hdFJldHJ5Tm9kZShmb3JtYXR0ZWRBZ2VudExpc3QpIC8vIHJldHJ5IG9uZSBub2RlXG4gIC8vIHdvdWxkIGNoYW5nZSB0aGUgc3RydWN0dXJlIG9mIHRoZSBsaXN0LiBJdGVyYXRpb24gYW5kIHBhcmFsbGVsIGNhbiBpbmNsdWRlIGVhY2ggb3RoZXIuXG4gIGNvbnN0IGZvcm1hdHRlZExvb3BBbmRJdGVyYXRpb25MaXN0ID0gZm9ybWF0SXRlcmF0aW9uQW5kTG9vcE5vZGUoZm9ybWF0dGVkUmV0cnlMaXN0LCB0KVxuICBjb25zdCBmb3JtYXR0ZWRQYXJhbGxlbExpc3QgPSBmb3JtYXRQYXJhbGxlbE5vZGUoZm9ybWF0dGVkTG9vcEFuZEl0ZXJhdGlvbkxpc3QsIHQpXG5cbiAgY29uc3QgcmVzdWx0ID0gZm9ybWF0dGVkUGFyYWxsZWxMaXN0XG4gIC8vIGNvbnNvbGUubG9nKGFsbEl0ZW1zKVxuICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZGVmYXVsdCBmb3JtYXRUb1RyYWNpbmdOb2RlTGlzdFxuIl19