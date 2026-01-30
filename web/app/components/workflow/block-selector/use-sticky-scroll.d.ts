import * as React from 'react';
export declare enum ScrollPosition {
    belowTheWrap = "belowTheWrap",
    showing = "showing",
    aboveTheWrap = "aboveTheWrap"
}
type Params = {
    wrapElemRef: React.RefObject<HTMLElement | null>;
    nextToStickyELemRef: React.RefObject<HTMLElement | null>;
};
declare const useStickyScroll: ({ wrapElemRef, nextToStickyELemRef, }: Params) => {
    handleScroll: any;
    scrollPosition: any;
};
export default useStickyScroll;
