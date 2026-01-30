export type IInstalledAppProps = {
    params?: Promise<{
        appId: string;
    }>;
};
declare function InstalledApp({ params }: IInstalledAppProps): Promise<any>;
export default InstalledApp;
