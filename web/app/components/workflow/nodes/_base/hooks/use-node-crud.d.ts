import type { CommonNodeType } from '@/app/components/workflow/types';
declare const useNodeCrud: <T>(id: string, data: CommonNodeType<T>) => {
    inputs: CommonNodeType<T>;
    setInputs: (newInputs: CommonNodeType<T>) => void;
};
export default useNodeCrud;
