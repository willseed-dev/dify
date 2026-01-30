"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollPosition = void 0;
const ahooks_1 = require("ahooks");
const React = require("react");
var ScrollPosition;
(function (ScrollPosition) {
    ScrollPosition["belowTheWrap"] = "belowTheWrap";
    ScrollPosition["showing"] = "showing";
    ScrollPosition["aboveTheWrap"] = "aboveTheWrap";
})(ScrollPosition || (exports.ScrollPosition = ScrollPosition = {}));
const useStickyScroll = ({ wrapElemRef, nextToStickyELemRef, }) => {
    const [scrollPosition, setScrollPosition] = React.useState(ScrollPosition.belowTheWrap);
    const { run: handleScroll } = (0, ahooks_1.useThrottleFn)(() => {
        const wrapDom = wrapElemRef.current;
        const stickyDOM = nextToStickyELemRef.current;
        if (!wrapDom || !stickyDOM)
            return;
        const { height: wrapHeight, top: wrapTop } = wrapDom.getBoundingClientRect();
        const { top: nextToStickyTop } = stickyDOM.getBoundingClientRect();
        let scrollPositionNew;
        if (nextToStickyTop - wrapTop >= wrapHeight)
            scrollPositionNew = ScrollPosition.belowTheWrap;
        else if (nextToStickyTop <= wrapTop)
            scrollPositionNew = ScrollPosition.aboveTheWrap;
        else
            scrollPositionNew = ScrollPosition.showing;
        if (scrollPosition !== scrollPositionNew)
            setScrollPosition(scrollPositionNew);
    }, { wait: 100 });
    return {
        handleScroll,
        scrollPosition,
    };
};
exports.default = useStickyScroll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXN0aWNreS1zY3JvbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utc3RpY2t5LXNjcm9sbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBc0M7QUFDdEMsK0JBQThCO0FBRTlCLElBQVksY0FJWDtBQUpELFdBQVksY0FBYztJQUN4QiwrQ0FBNkIsQ0FBQTtJQUM3QixxQ0FBbUIsQ0FBQTtJQUNuQiwrQ0FBNkIsQ0FBQTtBQUMvQixDQUFDLEVBSlcsY0FBYyw4QkFBZCxjQUFjLFFBSXpCO0FBTUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxFQUN2QixXQUFXLEVBQ1gsbUJBQW1CLEdBQ1osRUFBRSxFQUFFO0lBQ1gsTUFBTSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQWlCLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUN2RyxNQUFNLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUEsc0JBQWEsRUFBQyxHQUFHLEVBQUU7UUFDL0MsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQTtRQUNuQyxNQUFNLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUE7UUFDN0MsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVM7WUFDeEIsT0FBTTtRQUNSLE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtRQUM1RSxNQUFNLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFBO1FBQ2xFLElBQUksaUJBQWlDLENBQUE7UUFFckMsSUFBSSxlQUFlLEdBQUcsT0FBTyxJQUFJLFVBQVU7WUFDekMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQTthQUM1QyxJQUFJLGVBQWUsSUFBSSxPQUFPO1lBQ2pDLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUE7O1lBRS9DLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUE7UUFFNUMsSUFBSSxjQUFjLEtBQUssaUJBQWlCO1lBQ3RDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFDeEMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFFakIsT0FBTztRQUNMLFlBQVk7UUFDWixjQUFjO0tBQ2YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVRocm90dGxlRm4gfSBmcm9tICdhaG9va3MnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcblxuZXhwb3J0IGVudW0gU2Nyb2xsUG9zaXRpb24ge1xuICBiZWxvd1RoZVdyYXAgPSAnYmVsb3dUaGVXcmFwJyxcbiAgc2hvd2luZyA9ICdzaG93aW5nJyxcbiAgYWJvdmVUaGVXcmFwID0gJ2Fib3ZlVGhlV3JhcCcsXG59XG5cbnR5cGUgUGFyYW1zID0ge1xuICB3cmFwRWxlbVJlZjogUmVhY3QuUmVmT2JqZWN0PEhUTUxFbGVtZW50IHwgbnVsbD5cbiAgbmV4dFRvU3RpY2t5RUxlbVJlZjogUmVhY3QuUmVmT2JqZWN0PEhUTUxFbGVtZW50IHwgbnVsbD5cbn1cbmNvbnN0IHVzZVN0aWNreVNjcm9sbCA9ICh7XG4gIHdyYXBFbGVtUmVmLFxuICBuZXh0VG9TdGlja3lFTGVtUmVmLFxufTogUGFyYW1zKSA9PiB7XG4gIGNvbnN0IFtzY3JvbGxQb3NpdGlvbiwgc2V0U2Nyb2xsUG9zaXRpb25dID0gUmVhY3QudXNlU3RhdGU8U2Nyb2xsUG9zaXRpb24+KFNjcm9sbFBvc2l0aW9uLmJlbG93VGhlV3JhcClcbiAgY29uc3QgeyBydW46IGhhbmRsZVNjcm9sbCB9ID0gdXNlVGhyb3R0bGVGbigoKSA9PiB7XG4gICAgY29uc3Qgd3JhcERvbSA9IHdyYXBFbGVtUmVmLmN1cnJlbnRcbiAgICBjb25zdCBzdGlja3lET00gPSBuZXh0VG9TdGlja3lFTGVtUmVmLmN1cnJlbnRcbiAgICBpZiAoIXdyYXBEb20gfHwgIXN0aWNreURPTSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHsgaGVpZ2h0OiB3cmFwSGVpZ2h0LCB0b3A6IHdyYXBUb3AgfSA9IHdyYXBEb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB7IHRvcDogbmV4dFRvU3RpY2t5VG9wIH0gPSBzdGlja3lET00uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQgc2Nyb2xsUG9zaXRpb25OZXc6IFNjcm9sbFBvc2l0aW9uXG5cbiAgICBpZiAobmV4dFRvU3RpY2t5VG9wIC0gd3JhcFRvcCA+PSB3cmFwSGVpZ2h0KVxuICAgICAgc2Nyb2xsUG9zaXRpb25OZXcgPSBTY3JvbGxQb3NpdGlvbi5iZWxvd1RoZVdyYXBcbiAgICBlbHNlIGlmIChuZXh0VG9TdGlja3lUb3AgPD0gd3JhcFRvcClcbiAgICAgIHNjcm9sbFBvc2l0aW9uTmV3ID0gU2Nyb2xsUG9zaXRpb24uYWJvdmVUaGVXcmFwXG4gICAgZWxzZVxuICAgICAgc2Nyb2xsUG9zaXRpb25OZXcgPSBTY3JvbGxQb3NpdGlvbi5zaG93aW5nXG5cbiAgICBpZiAoc2Nyb2xsUG9zaXRpb24gIT09IHNjcm9sbFBvc2l0aW9uTmV3KVxuICAgICAgc2V0U2Nyb2xsUG9zaXRpb24oc2Nyb2xsUG9zaXRpb25OZXcpXG4gIH0sIHsgd2FpdDogMTAwIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVTY3JvbGwsXG4gICAgc2Nyb2xsUG9zaXRpb24sXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlU3RpY2t5U2Nyb2xsXG4iXX0=