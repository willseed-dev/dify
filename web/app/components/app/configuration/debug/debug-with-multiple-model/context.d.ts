import type { ModelAndParameter } from '../types';
export type DebugWithMultipleModelContextType = {
    multipleModelConfigs: ModelAndParameter[];
    onMultipleModelConfigsChange: (multiple: boolean, modelConfigs: ModelAndParameter[]) => void;
    onDebugWithMultipleModelChange: (singleModelConfig: ModelAndParameter) => void;
    checkCanSend?: () => boolean;
};
declare const DebugWithMultipleModelContext: any;
export declare const useDebugWithMultipleModelContext: () => any;
type DebugWithMultipleModelContextProviderProps = {
    children: React.ReactNode;
} & DebugWithMultipleModelContextType;
export declare const DebugWithMultipleModelContextProvider: ({ children, onMultipleModelConfigsChange, multipleModelConfigs, onDebugWithMultipleModelChange, checkCanSend, }: DebugWithMultipleModelContextProviderProps) => any;
export default DebugWithMultipleModelContext;
