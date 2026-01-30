import type { RenderOptions } from '@testing-library/react';
import type { Mock, MockedFunction } from 'vitest';
import type { ModalContextState } from '@/context/modal-context';
import { useModalContext as actualUseModalContext } from '@/context/modal-context';
import { useProviderContext as actualUseProviderContext } from '@/context/provider-context';
declare const mockUseProviderContext: MockedFunction<typeof actualUseProviderContext>;
declare const mockUseModalContext: MockedFunction<typeof actualUseModalContext>;
declare const defaultProviderContext: {
    modelProviders: never[];
    refreshModelProviders: any;
    textGenerationModelList: never[];
    supportRetrievalMethods: never[];
    isAPIKeySet: boolean;
    plan: any;
    isFetchedPlan: boolean;
    enableBilling: boolean;
    onPlanInfoChanged: any;
    enableReplaceWebAppLogo: boolean;
    modelLoadBalancingEnabled: boolean;
    datasetOperatorEnabled: boolean;
    enableEducationPlan: boolean;
    isEducationWorkspace: boolean;
    isEducationAccount: boolean;
    allowRefreshEducationVerify: boolean;
    educationAccountExpireAt: null;
    isLoadingEducationAccountInfo: boolean;
    isFetchingEducationAccountInfo: boolean;
    webappCopyrightEnabled: boolean;
    licenseLimit: {
        workspace_members: {
            size: number;
            limit: number;
        };
    };
    refreshLicenseLimit: any;
    isAllowTransferWorkspace: boolean;
    isAllowPublishAsCustomKnowledgePipelineTemplate: boolean;
};
declare const defaultModalContext: ModalContextState;
export type MockOverrides = {
    providerContext?: Partial<typeof defaultProviderContext>;
    modalContext?: Partial<typeof defaultModalContext>;
};
export type APIKeyInfoPanelRenderOptions = {
    mockOverrides?: MockOverrides;
} & Omit<RenderOptions, 'wrapper'>;
export declare function setupMocks(overrides?: MockOverrides): void;
export declare function renderAPIKeyInfoPanel(options?: APIKeyInfoPanelRenderOptions): any;
export declare const scenarios: {
    withAPIKeyNotSet: (overrides?: MockOverrides) => any;
    withAPIKeySet: (overrides?: MockOverrides) => any;
    withMockModal: (mockSetShowAccountSettingModal: Mock, overrides?: MockOverrides) => any;
};
export declare const assertions: {
    shouldRenderMainButton: () => any;
    shouldNotRender: (container: HTMLElement) => void;
    shouldHavePanelStyling: (panel: HTMLElement) => void;
    shouldHaveCloseButton: (container: HTMLElement) => any;
};
export declare const interactions: {
    clickMainButton: () => any;
    clickCloseButton: (container: HTMLElement) => any;
};
export declare const textKeys: {
    selfHost: {
        titleRow1: RegExp;
        titleRow2: RegExp;
        setAPIBtn: RegExp;
        tryCloud: RegExp;
    };
    cloud: {
        trialTitle: RegExp;
        trialDescription: RegExp;
        setAPIBtn: RegExp;
    };
};
export declare function clearAllMocks(): void;
export { defaultModalContext, mockUseModalContext, mockUseProviderContext };
