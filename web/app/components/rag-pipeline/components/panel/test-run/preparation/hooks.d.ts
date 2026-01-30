import { TestRunStep } from '../types';
export declare const useTestRunSteps: () => {
    steps: {
        label: any;
        value: TestRunStep;
    }[];
    currentStep: any;
    handleNextStep: any;
    handleBackStep: any;
};
export declare const useDatasourceOptions: () => any;
export declare const useOnlineDocument: () => {
    clearOnlineDocumentData: any;
};
export declare const useWebsiteCrawl: () => {
    clearWebsiteCrawlData: any;
};
export declare const useOnlineDrive: () => {
    clearOnlineDriveData: any;
};
