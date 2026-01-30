type Params = {
    ref?: React.RefObject<HTMLDivElement | null>;
    hasFooter?: boolean;
    isInNode?: boolean;
};
declare const useToggleExpend: ({ ref, hasFooter, isInNode }: Params) => {
    wrapClassName: string;
    wrapStyle: {
        boxShadow: string;
    } | {
        boxShadow?: undefined;
    };
    editorExpandHeight: number;
    isExpand: any;
    setIsExpand: any;
};
export default useToggleExpend;
