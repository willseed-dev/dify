import type { FeaturesState } from './store';
export declare const FeaturesContext: any;
type FeaturesProviderProps = {
    children: React.ReactNode;
} & Partial<FeaturesState>;
export declare const FeaturesProvider: ({ children, ...props }: FeaturesProviderProps) => any;
export {};
