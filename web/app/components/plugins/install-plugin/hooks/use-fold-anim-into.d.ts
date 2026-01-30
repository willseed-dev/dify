declare const useFoldAnimInto: (onClose: () => void) => {
    modalClassName: string;
    foldIntoAnim: () => Promise<void>;
    clearCountDown: () => void;
    countDownFoldIntoAnim: () => Promise<void>;
};
export default useFoldAnimInto;
