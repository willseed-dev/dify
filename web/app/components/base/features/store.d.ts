import type { Features } from './types';
export type FeaturesModal = {
    showFeaturesModal: boolean;
    setShowFeaturesModal: (showFeaturesModal: boolean) => void;
};
export type FeaturesState = {
    features: Features;
};
export type FeaturesAction = {
    setFeatures: (features: Features) => void;
};
export type FeatureStoreState = FeaturesState & FeaturesAction & FeaturesModal;
export type FeaturesStore = ReturnType<typeof createFeaturesStore>;
export declare const createFeaturesStore: (initProps?: Partial<FeaturesState>) => any;
