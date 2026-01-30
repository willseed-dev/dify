import type { FeatureStoreState } from './store';
export declare function useFeatures<T>(selector: (state: FeatureStoreState) => T): T;
export declare function useFeaturesStore(): any;
