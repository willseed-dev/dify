import * as React from 'react';
type FlowchartProps = {
    PrimitiveCode: string;
    theme?: 'light' | 'dark';
    ref?: React.Ref<HTMLDivElement>;
};
declare const Flowchart: {
    (props: FlowchartProps): any;
    displayName: string;
};
export default Flowchart;
