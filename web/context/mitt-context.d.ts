import { useMitt } from '@/hooks/use-mitt';
type ContextValueType = ReturnType<typeof useMitt>;
export declare const MittContext: any;
export declare const MittProvider: ({ children }: {
    children: React.ReactNode;
}) => any;
export declare const useMittContext: () => any;
export declare function useMittContextSelector<T>(selector: (value: ContextValueType) => T): T;
export {};
