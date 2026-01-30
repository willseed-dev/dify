import type { AbstractNode } from './utils';
export type IconData = {
    name: string;
    icon: AbstractNode;
};
export type IconBaseProps = {
    data: IconData;
    className?: string;
    onClick?: React.MouseEventHandler<SVGElement>;
    style?: React.CSSProperties;
};
declare const IconBase: {
    ({ ref, ...props }: IconBaseProps & {
        ref?: React.RefObject<React.RefObject<HTMLOrSVGElement>>;
    }): any;
    displayName: string;
};
export default IconBase;
