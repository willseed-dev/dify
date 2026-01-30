"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
function printNodeStructure(node, depth) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}${node.title}`);
    if (node.parallelDetail?.children) {
        node.parallelDetail.children.forEach((child) => {
            printNodeStructure(child, depth + 1);
        });
    }
}
function addTitle({ list, depth, belongParallelIndexInfo, }, t) {
    let branchIndex = 0;
    const hasMoreThanOneParallel = list.filter(node => node.parallelDetail?.isParallelStartNode).length > 1;
    list.forEach((node) => {
        const parallel_id = node.parallel_id ?? node.execution_metadata?.parallel_id ?? null;
        const parallel_start_node_id = node.parallel_start_node_id ?? node.execution_metadata?.parallel_start_node_id ?? null;
        const isNotInParallel = !parallel_id || node.node_type === types_1.BlockEnum.End;
        if (isNotInParallel)
            return;
        const isParallelStartNode = node.parallelDetail?.isParallelStartNode;
        const parallelIndexLetter = (() => {
            if (!isParallelStartNode || !hasMoreThanOneParallel)
                return '';
            const index = 1 + list.filter(node => node.parallelDetail?.isParallelStartNode).findIndex(item => item.node_id === node.node_id);
            return String.fromCharCode(64 + index);
        })();
        const parallelIndexInfo = `${depth}${parallelIndexLetter}`;
        if (isParallelStartNode) {
            node.parallelDetail.isParallelStartNode = true;
            node.parallelDetail.parallelTitle = `${t('common.parallel', { ns: 'workflow' })}-${parallelIndexInfo}`;
        }
        const isBrachStartNode = parallel_start_node_id === node.node_id;
        if (isBrachStartNode) {
            branchIndex++;
            const branchLetter = String.fromCharCode(64 + branchIndex);
            if (!node.parallelDetail) {
                node.parallelDetail = {
                    branchTitle: '',
                };
            }
            node.parallelDetail.branchTitle = `${t('common.branch', { ns: 'workflow' })}-${belongParallelIndexInfo}-${branchLetter}`;
        }
        if (node.parallelDetail?.children && node.parallelDetail.children.length > 0) {
            addTitle({
                list: node.parallelDetail.children,
                depth: depth + 1,
                belongParallelIndexInfo: parallelIndexInfo,
            }, t);
        }
    });
}
// list => group by parallel_id(parallel tree).
const format = (list, t, isPrint) => {
    if (isPrint)
        console.log(list);
    const result = [...list];
    // list to tree by parent_parallel_start_node_id and branch by parallel_start_node_id. Each parallel may has more than one branch.
    result.forEach((node) => {
        const parallel_id = node.parallel_id ?? node.execution_metadata?.parallel_id ?? null;
        const parallel_start_node_id = node.parallel_start_node_id ?? node.execution_metadata?.parallel_start_node_id ?? null;
        const parent_parallel_id = node.parent_parallel_id ?? node.execution_metadata?.parent_parallel_id ?? null;
        const branchStartNodeId = node.parallel_start_node_id ?? node.execution_metadata?.parallel_start_node_id ?? null;
        const parentParallelBranchStartNodeId = node.parent_parallel_start_node_id ?? node.execution_metadata?.parent_parallel_start_node_id ?? null;
        const isNotInParallel = !parallel_id || node.node_type === types_1.BlockEnum.End;
        if (isNotInParallel)
            return;
        const isParallelStartNode = parallel_start_node_id === node.node_id; // in the same parallel has more than one start node
        if (isParallelStartNode) {
            const selfNode = { ...node, parallelDetail: undefined };
            node.parallelDetail = {
                isParallelStartNode: true,
                children: [selfNode],
            };
            const isRootLevel = !parent_parallel_id;
            if (isRootLevel)
                return;
            const parentParallelStartNode = result.find(item => item.node_id === parentParallelBranchStartNodeId);
            // append to parent parallel start node and after the same branch
            if (parentParallelStartNode) {
                if (!parentParallelStartNode?.parallelDetail) {
                    parentParallelStartNode.parallelDetail = {
                        children: [],
                    };
                }
                if (parentParallelStartNode.parallelDetail.children) {
                    const sameBranchNodesLastIndex = parentParallelStartNode.parallelDetail.children.findLastIndex((node) => {
                        const currStartNodeId = node.parallel_start_node_id ?? node.execution_metadata?.parallel_start_node_id ?? null;
                        return currStartNodeId === parentParallelBranchStartNodeId;
                    });
                    if (sameBranchNodesLastIndex !== -1)
                        parentParallelStartNode.parallelDetail.children.splice(sameBranchNodesLastIndex + 1, 0, node);
                    else
                        parentParallelStartNode.parallelDetail.children.push(node);
                }
            }
            return;
        }
        // append to parallel start node and after the same branch
        const parallelStartNode = result.find(item => parallel_start_node_id === item.node_id);
        if (parallelStartNode && parallelStartNode.parallelDetail && parallelStartNode.parallelDetail.children) {
            const sameBranchNodesLastIndex = parallelStartNode.parallelDetail.children.findLastIndex((node) => {
                const currStartNodeId = node.parallel_start_node_id ?? node.execution_metadata?.parallel_start_node_id ?? null;
                return currStartNodeId === branchStartNodeId;
            });
            if (sameBranchNodesLastIndex !== -1) {
                parallelStartNode.parallelDetail.children.splice(sameBranchNodesLastIndex + 1, 0, node);
            }
            else { // new branch
                parallelStartNode.parallelDetail.children.push(node);
            }
        }
        // parallelStartNode!.parallelDetail!.children.push(node)
    });
    const filteredInParallelSubNodes = result.filter((node) => {
        const parallel_id = node.parallel_id ?? node.execution_metadata?.parallel_id ?? null;
        const isNotInParallel = !parallel_id || node.node_type === types_1.BlockEnum.End;
        if (isNotInParallel)
            return true;
        const parent_parallel_id = node.parent_parallel_id ?? node.execution_metadata?.parent_parallel_id ?? null;
        if (parent_parallel_id)
            return false;
        const isParallelStartNode = node.parallelDetail?.isParallelStartNode;
        if (!isParallelStartNode)
            return false;
        return true;
    });
    // print node structure for debug
    if (isPrint) {
        filteredInParallelSubNodes.forEach((node) => {
            const now = Date.now();
            console.log(`----- p: ${now} start -----`);
            printNodeStructure(node, 0);
            console.log(`----- p: ${now} end -----`);
        });
    }
    addTitle({
        list: filteredInParallelSubNodes,
        depth: 1,
    }, t);
    return filteredInParallelSubNodes;
};
exports.default = format;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJEQUEyRDtBQUUzRCxTQUFTLGtCQUFrQixDQUFDLElBQWlCLEVBQUUsS0FBYTtJQUMxRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDckMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzdDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLEVBQ2hCLElBQUksRUFDSixLQUFLLEVBQ0wsdUJBQXVCLEdBS3hCLEVBQUUsQ0FBTTtJQUNQLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQTtJQUNuQixNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUN2RyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDcEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQTtRQUNwRixNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsc0JBQXNC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QTtRQUVwRSxJQUFJLENBQUMsbUJBQW1CO1lBQ3RCLE9BQU8sS0FBSyxDQUFBO1FBRWQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLENBQUMsQ0FBQTtJQUVGLGlDQUFpQztJQUNqQyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1osMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQyxDQUFBO1lBQzFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxRQUFRLENBQUM7UUFDUCxJQUFJLEVBQUUsMEJBQTBCO1FBQ2hDLEtBQUssRUFBRSxDQUFDO0tBQ1QsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUVMLE9BQU8sMEJBQTBCLENBQUE7QUFDbkMsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlVHJhY2luZyB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5mdW5jdGlvbiBwcmludE5vZGVTdHJ1Y3R1cmUobm9kZTogTm9kZVRyYWNpbmcsIGRlcHRoOiBudW1iZXIpIHtcbiAgY29uc3QgaW5kZW50ID0gJyAgJy5yZXBlYXQoZGVwdGgpXG4gIGNvbnNvbGUubG9nKGAke2luZGVudH0ke25vZGUudGl0bGV9YClcbiAgaWYgKG5vZGUucGFyYWxsZWxEZXRhaWw/LmNoaWxkcmVuKSB7XG4gICAgbm9kZS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgcHJpbnROb2RlU3RydWN0dXJlKGNoaWxkLCBkZXB0aCArIDEpXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRUaXRsZSh7XG4gIGxpc3QsXG4gIGRlcHRoLFxuICBiZWxvbmdQYXJhbGxlbEluZGV4SW5mbyxcbn06IHtcbiAgbGlzdDogTm9kZVRyYWNpbmdbXVxuICBkZXB0aDogbnVtYmVyXG4gIGJlbG9uZ1BhcmFsbGVsSW5kZXhJbmZvPzogc3RyaW5nXG59LCB0OiBhbnkpIHtcbiAgbGV0IGJyYW5jaEluZGV4ID0gMFxuICBjb25zdCBoYXNNb3JlVGhhbk9uZVBhcmFsbGVsID0gbGlzdC5maWx0ZXIobm9kZSA9PiBub2RlLnBhcmFsbGVsRGV0YWlsPy5pc1BhcmFsbGVsU3RhcnROb2RlKS5sZW5ndGggPiAxXG4gIGxpc3QuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGNvbnN0IHBhcmFsbGVsX2lkID0gbm9kZS5wYXJhbGxlbF9pZCA/PyBub2RlLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPz8gbnVsbFxuICAgIGNvbnN0IHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPSBub2RlLnBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPz8gbm9kZS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPz8gbnVsbFxuXG4gICAgY29uc3QgaXNOb3RJblBhcmFsbGVsID0gIXBhcmFsbGVsX2lkIHx8IG5vZGUubm9kZV90eXBlID09PSBCbG9ja0VudW0uRW5kXG4gICAgaWYgKGlzTm90SW5QYXJhbGxlbClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgaXNQYXJhbGxlbFN0YXJ0Tm9kZSA9IG5vZGUucGFyYWxsZWxEZXRhaWw/LmlzUGFyYWxsZWxTdGFydE5vZGVcblxuICAgIGNvbnN0IHBhcmFsbGVsSW5kZXhMZXR0ZXIgPSAoKCkgPT4ge1xuICAgICAgaWYgKCFpc1BhcmFsbGVsU3RhcnROb2RlIHx8ICFoYXNNb3JlVGhhbk9uZVBhcmFsbGVsKVxuICAgICAgICByZXR1cm4gJydcblxuICAgICAgY29uc3QgaW5kZXggPSAxICsgbGlzdC5maWx0ZXIobm9kZSA9PiBub2RlLnBhcmFsbGVsRGV0YWlsPy5pc1BhcmFsbGVsU3RhcnROb2RlKS5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLm5vZGVfaWQgPT09IG5vZGUubm9kZV9pZClcbiAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgaW5kZXgpXG4gICAgfSkoKVxuXG4gICAgY29uc3QgcGFyYWxsZWxJbmRleEluZm8gPSBgJHtkZXB0aH0ke3BhcmFsbGVsSW5kZXhMZXR0ZXJ9YFxuXG4gICAgaWYgKGlzUGFyYWxsZWxTdGFydE5vZGUpIHtcbiAgICAgIG5vZGUucGFyYWxsZWxEZXRhaWwhLmlzUGFyYWxsZWxTdGFydE5vZGUgPSB0cnVlXG4gICAgICBub2RlLnBhcmFsbGVsRGV0YWlsIS5wYXJhbGxlbFRpdGxlID0gYCR7dCgnY29tbW9uLnBhcmFsbGVsJywgeyBuczogJ3dvcmtmbG93JyB9KX0tJHtwYXJhbGxlbEluZGV4SW5mb31gXG4gICAgfVxuXG4gICAgY29uc3QgaXNCcmFjaFN0YXJ0Tm9kZSA9IHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPT09IG5vZGUubm9kZV9pZFxuICAgIGlmIChpc0JyYWNoU3RhcnROb2RlKSB7XG4gICAgICBicmFuY2hJbmRleCsrXG4gICAgICBjb25zdCBicmFuY2hMZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgYnJhbmNoSW5kZXgpXG4gICAgICBpZiAoIW5vZGUucGFyYWxsZWxEZXRhaWwpIHtcbiAgICAgICAgbm9kZS5wYXJhbGxlbERldGFpbCA9IHtcbiAgICAgICAgICBicmFuY2hUaXRsZTogJycsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbm9kZS5wYXJhbGxlbERldGFpbCEuYnJhbmNoVGl0bGUgPSBgJHt0KCdjb21tb24uYnJhbmNoJywgeyBuczogJ3dvcmtmbG93JyB9KX0tJHtiZWxvbmdQYXJhbGxlbEluZGV4SW5mb30tJHticmFuY2hMZXR0ZXJ9YFxuICAgIH1cblxuICAgIGlmIChub2RlLnBhcmFsbGVsRGV0YWlsPy5jaGlsZHJlbiAmJiBub2RlLnBhcmFsbGVsRGV0YWlsLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGFkZFRpdGxlKHtcbiAgICAgICAgbGlzdDogbm9kZS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbixcbiAgICAgICAgZGVwdGg6IGRlcHRoICsgMSxcbiAgICAgICAgYmVsb25nUGFyYWxsZWxJbmRleEluZm86IHBhcmFsbGVsSW5kZXhJbmZvLFxuICAgICAgfSwgdClcbiAgICB9XG4gIH0pXG59XG5cbi8vIGxpc3QgPT4gZ3JvdXAgYnkgcGFyYWxsZWxfaWQocGFyYWxsZWwgdHJlZSkuXG5jb25zdCBmb3JtYXQgPSAobGlzdDogTm9kZVRyYWNpbmdbXSwgdDogYW55LCBpc1ByaW50PzogYm9vbGVhbik6IE5vZGVUcmFjaW5nW10gPT4ge1xuICBpZiAoaXNQcmludClcbiAgICBjb25zb2xlLmxvZyhsaXN0KVxuXG4gIGNvbnN0IHJlc3VsdDogTm9kZVRyYWNpbmdbXSA9IFsuLi5saXN0XVxuICAvLyBsaXN0IHRvIHRyZWUgYnkgcGFyZW50X3BhcmFsbGVsX3N0YXJ0X25vZGVfaWQgYW5kIGJyYW5jaCBieSBwYXJhbGxlbF9zdGFydF9ub2RlX2lkLiBFYWNoIHBhcmFsbGVsIG1heSBoYXMgbW9yZSB0aGFuIG9uZSBicmFuY2guXG4gIHJlc3VsdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgY29uc3QgcGFyYWxsZWxfaWQgPSBub2RlLnBhcmFsbGVsX2lkID8/IG5vZGUuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJhbGxlbF9pZCA/PyBudWxsXG4gICAgY29uc3QgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA9IG5vZGUucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBub2RlLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBudWxsXG4gICAgY29uc3QgcGFyZW50X3BhcmFsbGVsX2lkID0gbm9kZS5wYXJlbnRfcGFyYWxsZWxfaWQgPz8gbm9kZS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmVudF9wYXJhbGxlbF9pZCA/PyBudWxsXG4gICAgY29uc3QgYnJhbmNoU3RhcnROb2RlSWQgPSBub2RlLnBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPz8gbm9kZS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPz8gbnVsbFxuICAgIGNvbnN0IHBhcmVudFBhcmFsbGVsQnJhbmNoU3RhcnROb2RlSWQgPSBub2RlLnBhcmVudF9wYXJhbGxlbF9zdGFydF9ub2RlX2lkID8/IG5vZGUuZXhlY3V0aW9uX21ldGFkYXRhPy5wYXJlbnRfcGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBudWxsXG4gICAgY29uc3QgaXNOb3RJblBhcmFsbGVsID0gIXBhcmFsbGVsX2lkIHx8IG5vZGUubm9kZV90eXBlID09PSBCbG9ja0VudW0uRW5kXG4gICAgaWYgKGlzTm90SW5QYXJhbGxlbClcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgaXNQYXJhbGxlbFN0YXJ0Tm9kZSA9IHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPT09IG5vZGUubm9kZV9pZCAvLyBpbiB0aGUgc2FtZSBwYXJhbGxlbCBoYXMgbW9yZSB0aGFuIG9uZSBzdGFydCBub2RlXG4gICAgaWYgKGlzUGFyYWxsZWxTdGFydE5vZGUpIHtcbiAgICAgIGNvbnN0IHNlbGZOb2RlID0geyAuLi5ub2RlLCBwYXJhbGxlbERldGFpbDogdW5kZWZpbmVkIH1cbiAgICAgIG5vZGUucGFyYWxsZWxEZXRhaWwgPSB7XG4gICAgICAgIGlzUGFyYWxsZWxTdGFydE5vZGU6IHRydWUsXG4gICAgICAgIGNoaWxkcmVuOiBbc2VsZk5vZGVdLFxuICAgICAgfVxuICAgICAgY29uc3QgaXNSb290TGV2ZWwgPSAhcGFyZW50X3BhcmFsbGVsX2lkXG4gICAgICBpZiAoaXNSb290TGV2ZWwpXG4gICAgICAgIHJldHVyblxuXG4gICAgICBjb25zdCBwYXJlbnRQYXJhbGxlbFN0YXJ0Tm9kZSA9IHJlc3VsdC5maW5kKGl0ZW0gPT4gaXRlbS5ub2RlX2lkID09PSBwYXJlbnRQYXJhbGxlbEJyYW5jaFN0YXJ0Tm9kZUlkKVxuICAgICAgLy8gYXBwZW5kIHRvIHBhcmVudCBwYXJhbGxlbCBzdGFydCBub2RlIGFuZCBhZnRlciB0aGUgc2FtZSBicmFuY2hcbiAgICAgIGlmIChwYXJlbnRQYXJhbGxlbFN0YXJ0Tm9kZSkge1xuICAgICAgICBpZiAoIXBhcmVudFBhcmFsbGVsU3RhcnROb2RlPy5wYXJhbGxlbERldGFpbCkge1xuICAgICAgICAgIHBhcmVudFBhcmFsbGVsU3RhcnROb2RlIS5wYXJhbGxlbERldGFpbCA9IHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudFBhcmFsbGVsU3RhcnROb2RlIS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbikge1xuICAgICAgICAgIGNvbnN0IHNhbWVCcmFuY2hOb2Rlc0xhc3RJbmRleCA9IHBhcmVudFBhcmFsbGVsU3RhcnROb2RlLnBhcmFsbGVsRGV0YWlsLmNoaWxkcmVuLmZpbmRMYXN0SW5kZXgoKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJTdGFydE5vZGVJZCA9IG5vZGUucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBub2RlLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBudWxsXG4gICAgICAgICAgICByZXR1cm4gY3VyclN0YXJ0Tm9kZUlkID09PSBwYXJlbnRQYXJhbGxlbEJyYW5jaFN0YXJ0Tm9kZUlkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAoc2FtZUJyYW5jaE5vZGVzTGFzdEluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgIHBhcmVudFBhcmFsbGVsU3RhcnROb2RlIS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbi5zcGxpY2Uoc2FtZUJyYW5jaE5vZGVzTGFzdEluZGV4ICsgMSwgMCwgbm9kZSlcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJlbnRQYXJhbGxlbFN0YXJ0Tm9kZSEucGFyYWxsZWxEZXRhaWwuY2hpbGRyZW4ucHVzaChub2RlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgdG8gcGFyYWxsZWwgc3RhcnQgbm9kZSBhbmQgYWZ0ZXIgdGhlIHNhbWUgYnJhbmNoXG4gICAgY29uc3QgcGFyYWxsZWxTdGFydE5vZGUgPSByZXN1bHQuZmluZChpdGVtID0+IHBhcmFsbGVsX3N0YXJ0X25vZGVfaWQgPT09IGl0ZW0ubm9kZV9pZClcblxuICAgIGlmIChwYXJhbGxlbFN0YXJ0Tm9kZSAmJiBwYXJhbGxlbFN0YXJ0Tm9kZS5wYXJhbGxlbERldGFpbCAmJiBwYXJhbGxlbFN0YXJ0Tm9kZSEucGFyYWxsZWxEZXRhaWwhLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBzYW1lQnJhbmNoTm9kZXNMYXN0SW5kZXggPSBwYXJhbGxlbFN0YXJ0Tm9kZS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbi5maW5kTGFzdEluZGV4KChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJTdGFydE5vZGVJZCA9IG5vZGUucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBub2RlLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfc3RhcnRfbm9kZV9pZCA/PyBudWxsXG4gICAgICAgIHJldHVybiBjdXJyU3RhcnROb2RlSWQgPT09IGJyYW5jaFN0YXJ0Tm9kZUlkXG4gICAgICB9KVxuICAgICAgaWYgKHNhbWVCcmFuY2hOb2Rlc0xhc3RJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgcGFyYWxsZWxTdGFydE5vZGUucGFyYWxsZWxEZXRhaWwuY2hpbGRyZW4uc3BsaWNlKHNhbWVCcmFuY2hOb2Rlc0xhc3RJbmRleCArIDEsIDAsIG5vZGUpXG4gICAgICB9XG4gICAgICBlbHNlIHsgLy8gbmV3IGJyYW5jaFxuICAgICAgICBwYXJhbGxlbFN0YXJ0Tm9kZS5wYXJhbGxlbERldGFpbC5jaGlsZHJlbi5wdXNoKG5vZGUpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIHBhcmFsbGVsU3RhcnROb2RlIS5wYXJhbGxlbERldGFpbCEuY2hpbGRyZW4ucHVzaChub2RlKVxuICB9KVxuXG4gIGNvbnN0IGZpbHRlcmVkSW5QYXJhbGxlbFN1Yk5vZGVzID0gcmVzdWx0LmZpbHRlcigobm9kZSkgPT4ge1xuICAgIGNvbnN0IHBhcmFsbGVsX2lkID0gbm9kZS5wYXJhbGxlbF9pZCA/PyBub2RlLmV4ZWN1dGlvbl9tZXRhZGF0YT8ucGFyYWxsZWxfaWQgPz8gbnVsbFxuICAgIGNvbnN0IGlzTm90SW5QYXJhbGxlbCA9ICFwYXJhbGxlbF9pZCB8fCBub2RlLm5vZGVfdHlwZSA9PT0gQmxvY2tFbnVtLkVuZFxuICAgIGlmIChpc05vdEluUGFyYWxsZWwpXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgY29uc3QgcGFyZW50X3BhcmFsbGVsX2lkID0gbm9kZS5wYXJlbnRfcGFyYWxsZWxfaWQgPz8gbm9kZS5leGVjdXRpb25fbWV0YWRhdGE/LnBhcmVudF9wYXJhbGxlbF9pZCA/PyBudWxsXG5cbiAgICBpZiAocGFyZW50X3BhcmFsbGVsX2lkKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBjb25zdCBpc1BhcmFsbGVsU3RhcnROb2RlID0gbm9kZS5wYXJhbGxlbERldGFpbD8uaXNQYXJhbGxlbFN0YXJ0Tm9kZVxuXG4gICAgaWYgKCFpc1BhcmFsbGVsU3RhcnROb2RlKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9KVxuXG4gIC8vIHByaW50IG5vZGUgc3RydWN0dXJlIGZvciBkZWJ1Z1xuICBpZiAoaXNQcmludCkge1xuICAgIGZpbHRlcmVkSW5QYXJhbGxlbFN1Yk5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnNvbGUubG9nKGAtLS0tLSBwOiAke25vd30gc3RhcnQgLS0tLS1gKVxuICAgICAgcHJpbnROb2RlU3RydWN0dXJlKG5vZGUsIDApXG4gICAgICBjb25zb2xlLmxvZyhgLS0tLS0gcDogJHtub3d9IGVuZCAtLS0tLWApXG4gICAgfSlcbiAgfVxuXG4gIGFkZFRpdGxlKHtcbiAgICBsaXN0OiBmaWx0ZXJlZEluUGFyYWxsZWxTdWJOb2RlcyxcbiAgICBkZXB0aDogMSxcbiAgfSwgdClcblxuICByZXR1cm4gZmlsdGVyZWRJblBhcmFsbGVsU3ViTm9kZXNcbn1cbmV4cG9ydCBkZWZhdWx0IGZvcm1hdFxuIl19