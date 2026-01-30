"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useCheckVerticalScrollbar = (ref) => {
    const [hasVerticalScrollbar, setHasVerticalScrollbar] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const elem = ref.current;
        if (!elem)
            return;
        const checkScrollbar = () => {
            setHasVerticalScrollbar(elem.scrollHeight > elem.clientHeight);
        };
        checkScrollbar();
        const resizeObserver = new ResizeObserver(checkScrollbar);
        resizeObserver.observe(elem);
        const mutationObserver = new MutationObserver(checkScrollbar);
        mutationObserver.observe(elem, { childList: true, subtree: true, characterData: true });
        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [ref]);
    return hasVerticalScrollbar;
};
exports.default = useCheckVerticalScrollbar;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNoZWNrLXZlcnRpY2FsLXNjcm9sbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jaGVjay12ZXJ0aWNhbC1zY3JvbGxiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBMkM7QUFFM0MsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLEdBQWlDLEVBQUUsRUFBRTtJQUN0RSxNQUFNLENBQUMsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFdkUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUE7UUFDeEIsSUFBSSxDQUFDLElBQUk7WUFDUCxPQUFNO1FBRVIsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQzFCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ2hFLENBQUMsQ0FBQTtRQUVELGNBQWMsRUFBRSxDQUFBO1FBRWhCLE1BQU0sY0FBYyxHQUFHLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3pELGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFNUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzdELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFFdkYsT0FBTyxHQUFHLEVBQUU7WUFDVixjQUFjLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDM0IsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDL0IsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUVULE9BQU8sb0JBQW9CLENBQUE7QUFDN0IsQ0FBQyxDQUFBO0FBRUQsa0JBQWUseUJBQXlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5cbmNvbnN0IHVzZUNoZWNrVmVydGljYWxTY3JvbGxiYXIgPSAocmVmOiBSZWFjdC5SZWZPYmplY3Q8SFRNTEVsZW1lbnQ+KSA9PiB7XG4gIGNvbnN0IFtoYXNWZXJ0aWNhbFNjcm9sbGJhciwgc2V0SGFzVmVydGljYWxTY3JvbGxiYXJdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBlbGVtID0gcmVmLmN1cnJlbnRcbiAgICBpZiAoIWVsZW0pXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IGNoZWNrU2Nyb2xsYmFyID0gKCkgPT4ge1xuICAgICAgc2V0SGFzVmVydGljYWxTY3JvbGxiYXIoZWxlbS5zY3JvbGxIZWlnaHQgPiBlbGVtLmNsaWVudEhlaWdodClcbiAgICB9XG5cbiAgICBjaGVja1Njcm9sbGJhcigpXG5cbiAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihjaGVja1Njcm9sbGJhcilcbiAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKGVsZW0pXG5cbiAgICBjb25zdCBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2hlY2tTY3JvbGxiYXIpXG4gICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGVsZW0sIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpXG4gICAgICBtdXRhdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgIH1cbiAgfSwgW3JlZl0pXG5cbiAgcmV0dXJuIGhhc1ZlcnRpY2FsU2Nyb2xsYmFyXG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUNoZWNrVmVydGljYWxTY3JvbGxiYXJcbiJdfQ==