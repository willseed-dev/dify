declare const AppDetailLayout: (props: {
    children: React.ReactNode;
    params: Promise<{
        appId: string;
    }>;
}) => Promise<any>;
export default AppDetailLayout;
