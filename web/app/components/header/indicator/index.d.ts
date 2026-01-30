export type IndicatorProps = {
    color?: 'green' | 'orange' | 'red' | 'blue' | 'yellow' | 'gray';
    className?: string;
};
export type ColorMap = {
    green: string;
    orange: string;
    red: string;
    blue: string;
    yellow: string;
    gray: string;
};
export default function Indicator({ color, className, }: IndicatorProps): any;
