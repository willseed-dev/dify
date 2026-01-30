import type { App } from '@/types/app';
type Props = {
    value?: {
        app_id: string;
        inputs: Record<string, any>;
    };
    appDetail: App;
    onFormChange: (value: Record<string, any>) => void;
};
declare const AppInputsPanel: ({ value, appDetail, onFormChange, }: Props) => any;
export default AppInputsPanel;
