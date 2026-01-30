import type { StateCreator } from 'zustand';
import type { SliceFromInjection } from './store';
export declare const WorkflowContext: any;
export type WorkflowProviderProps = {
    children: React.ReactNode;
    injectWorkflowStoreSliceFn?: StateCreator<SliceFromInjection>;
};
export declare const WorkflowContextProvider: ({ children, injectWorkflowStoreSliceFn }: WorkflowProviderProps) => any;
