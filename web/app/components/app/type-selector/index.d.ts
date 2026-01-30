import { AppModeEnum } from '@/types/app';
export type AppSelectorProps = {
    value: Array<AppModeEnum>;
    onChange: (value: AppSelectorProps['value']) => void;
};
declare const AppTypeSelector: ({ value, onChange }: AppSelectorProps) => any;
export default AppTypeSelector;
export declare const AppTypeIcon: any;
type AppTypeLabelProps = {
    type: AppModeEnum;
    className?: string;
};
export declare function AppTypeLabel({ type, className }: AppTypeLabelProps): any;
