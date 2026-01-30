import type { Shape } from './store';
export declare const HooksStoreContext: any;
type HooksStoreContextProviderProps = Partial<Shape> & {
    children: React.ReactNode;
};
export declare const HooksStoreContextProvider: ({ children, ...restProps }: HooksStoreContextProviderProps) => any;
export {};
