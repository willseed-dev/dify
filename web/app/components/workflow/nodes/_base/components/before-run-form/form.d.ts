import type { InputVar } from '../../../../types';
export type Props = {
    className?: string;
    label?: string;
    inputs: InputVar[];
    values: Record<string, string>;
    onChange: (newValues: Record<string, any>) => void;
};
declare const _default: any;
export default _default;
