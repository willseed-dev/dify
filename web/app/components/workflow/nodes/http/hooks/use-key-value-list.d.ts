import type { KeyValue } from '../types';
declare const useKeyValueList: (value: string, onChange: (value: string) => void, noFilter?: boolean) => {
    list: any;
    setList: (l: KeyValue[]) => void;
    addItem: any;
    isKeyValueEdit: any;
    toggleIsKeyValueEdit: any;
};
export default useKeyValueList;
