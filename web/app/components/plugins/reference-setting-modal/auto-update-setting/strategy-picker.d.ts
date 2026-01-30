import { AUTO_UPDATE_STRATEGY } from './types';
type Props = {
    value: AUTO_UPDATE_STRATEGY;
    onChange: (value: AUTO_UPDATE_STRATEGY) => void;
};
declare const StrategyPicker: ({ value, onChange, }: Props) => any;
export default StrategyPicker;
