export type AbstractNode = {
    name: string;
    attributes: {
        [key: string]: string | undefined;
    };
    children?: AbstractNode[];
};
export type Attrs = {
    [key: string]: string | undefined;
};
export declare function normalizeAttrs(attrs?: Attrs): Attrs;
export declare function generate(node: AbstractNode, key: string, rootProps?: {
    [key: string]: any;
} | false): any;
