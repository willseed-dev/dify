import './style.css';
type ISliderProps = {
    className?: string;
    thumbClassName?: string;
    trackClassName?: string;
    value: number;
    max?: number;
    min?: number;
    step?: number;
    disabled?: boolean;
    onChange: (value: number) => void;
};
declare const Slider: React.FC<ISliderProps>;
export default Slider;
