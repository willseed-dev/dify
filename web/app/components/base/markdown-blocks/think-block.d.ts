import * as React from 'react';
type ThinkBlockProps = React.ComponentProps<'details'> & {
    'data-think'?: boolean;
};
declare const ThinkBlock: ({ children, ...props }: ThinkBlockProps) => any;
export default ThinkBlock;
