import type { ButtonProps, IPaginationProps, PageButtonProps } from './type';
export declare const PrevButton: ({ className, children, dataTestId, as, ...buttonProps }: ButtonProps) => any;
export declare const NextButton: ({ className, children, dataTestId, as, ...buttonProps }: ButtonProps) => any;
export declare const PageButton: ({ as, className, dataTestIdActive, dataTestIdInactive, activeClassName, inactiveClassName, renderExtraProps, }: PageButtonProps) => any;
export declare const Pagination: {
    ({ dataTestId, ...paginationProps }: IPaginationProps & {
        dataTestId?: string;
    }): any;
    PrevButton: ({ className, children, dataTestId, as, ...buttonProps }: ButtonProps) => any;
    NextButton: ({ className, children, dataTestId, as, ...buttonProps }: ButtonProps) => any;
    PageButton: ({ as, className, dataTestIdActive, dataTestIdInactive, activeClassName, inactiveClassName, renderExtraProps, }: PageButtonProps) => any;
};
