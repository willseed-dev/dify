type CustomEdgeLinearGradientRenderProps = {
    id: string;
    startColor: string;
    stopColor: string;
    position: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
};
declare const CustomEdgeLinearGradientRender: ({ id, startColor, stopColor, position, }: CustomEdgeLinearGradientRenderProps) => any;
export default CustomEdgeLinearGradientRender;
