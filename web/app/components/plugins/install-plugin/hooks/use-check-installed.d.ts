type Props = {
    pluginIds: string[];
    enabled: boolean;
};
declare const useCheckInstalled: (props: Props) => {
    installedInfo: any;
    isLoading: any;
    error: any;
};
export default useCheckInstalled;
