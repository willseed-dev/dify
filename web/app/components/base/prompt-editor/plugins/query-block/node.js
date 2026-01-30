"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBlockNode = void 0;
exports.$createQueryBlockNode = $createQueryBlockNode;
exports.$isQueryBlockNode = $isQueryBlockNode;
const lexical_1 = require("lexical");
const component_1 = require("./component");
class QueryBlockNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'query-block';
    }
    static clone() {
        return new QueryBlockNode();
    }
    isInline() {
        return true;
    }
    createDOM() {
        const div = document.createElement('div');
        div.classList.add('inline-flex', 'items-center', 'align-middle');
        return div;
    }
    updateDOM() {
        return false;
    }
    decorate() {
        return <component_1.default nodeKey={this.getKey()}/>;
    }
    static importJSON() {
        const node = $createQueryBlockNode();
        return node;
    }
    exportJSON() {
        return {
            type: 'query-block',
            version: 1,
        };
    }
    getTextContent() {
        return '{{#query#}}';
    }
}
exports.QueryBlockNode = QueryBlockNode;
function $createQueryBlockNode() {
    return new QueryBlockNode();
}
function $isQueryBlockNode(node) {
    return node instanceof QueryBlockNode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWtEQSxzREFFQztBQUVELDhDQUlDO0FBekRELHFDQUF1QztBQUN2QywyQ0FBNkM7QUFJN0MsTUFBYSxjQUFlLFNBQVEsdUJBQWdDO0lBQ2xFLE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTyxhQUFhLENBQUE7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsT0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFBO0lBQzdCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsU0FBUztRQUNQLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNoRSxPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRyxDQUFBO0lBQ3hELENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVTtRQUNmLE1BQU0sSUFBSSxHQUFHLHFCQUFxQixFQUFFLENBQUE7UUFFcEMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU87WUFDTCxJQUFJLEVBQUUsYUFBYTtZQUNuQixPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUE7SUFDSCxDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sYUFBYSxDQUFBO0lBQ3RCLENBQUM7Q0FDRjtBQTNDRCx3Q0EyQ0M7QUFDRCxTQUFnQixxQkFBcUI7SUFDbkMsT0FBTyxJQUFJLGNBQWMsRUFBRSxDQUFBO0FBQzdCLENBQUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FDL0IsSUFBcUQ7SUFFckQsT0FBTyxJQUFJLFlBQVksY0FBYyxDQUFBO0FBQ3ZDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IExleGljYWxOb2RlLCBTZXJpYWxpemVkTGV4aWNhbE5vZGUgfSBmcm9tICdsZXhpY2FsJ1xuaW1wb3J0IHsgRGVjb3JhdG9yTm9kZSB9IGZyb20gJ2xleGljYWwnXG5pbXBvcnQgUXVlcnlCbG9ja0NvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudCdcblxuZXhwb3J0IHR5cGUgU2VyaWFsaXplZE5vZGUgPSBTZXJpYWxpemVkTGV4aWNhbE5vZGVcblxuZXhwb3J0IGNsYXNzIFF1ZXJ5QmxvY2tOb2RlIGV4dGVuZHMgRGVjb3JhdG9yTm9kZTxSZWFjdC5KU1guRWxlbWVudD4ge1xuICBzdGF0aWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAncXVlcnktYmxvY2snXG4gIH1cblxuICBzdGF0aWMgY2xvbmUoKTogUXVlcnlCbG9ja05vZGUge1xuICAgIHJldHVybiBuZXcgUXVlcnlCbG9ja05vZGUoKVxuICB9XG5cbiAgaXNJbmxpbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNyZWF0ZURPTSgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWZsZXgnLCAnaXRlbXMtY2VudGVyJywgJ2FsaWduLW1pZGRsZScpXG4gICAgcmV0dXJuIGRpdlxuICB9XG5cbiAgdXBkYXRlRE9NKCk6IGZhbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGRlY29yYXRlKCk6IFJlYWN0LkpTWC5FbGVtZW50IHtcbiAgICByZXR1cm4gPFF1ZXJ5QmxvY2tDb21wb25lbnQgbm9kZUtleT17dGhpcy5nZXRLZXkoKX0gLz5cbiAgfVxuXG4gIHN0YXRpYyBpbXBvcnRKU09OKCk6IFF1ZXJ5QmxvY2tOb2RlIHtcbiAgICBjb25zdCBub2RlID0gJGNyZWF0ZVF1ZXJ5QmxvY2tOb2RlKClcblxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBleHBvcnRKU09OKCk6IFNlcmlhbGl6ZWROb2RlIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3F1ZXJ5LWJsb2NrJyxcbiAgICAgIHZlcnNpb246IDEsXG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dENvbnRlbnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ3t7I3F1ZXJ5I319J1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gJGNyZWF0ZVF1ZXJ5QmxvY2tOb2RlKCk6IFF1ZXJ5QmxvY2tOb2RlIHtcbiAgcmV0dXJuIG5ldyBRdWVyeUJsb2NrTm9kZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiAkaXNRdWVyeUJsb2NrTm9kZShcbiAgbm9kZTogUXVlcnlCbG9ja05vZGUgfCBMZXhpY2FsTm9kZSB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBub2RlIGlzIFF1ZXJ5QmxvY2tOb2RlIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiBRdWVyeUJsb2NrTm9kZVxufVxuIl19