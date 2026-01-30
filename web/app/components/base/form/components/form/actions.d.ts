import type { FormType } from '../..';
export type CustomActionsProps = {
    form: FormType;
    isSubmitting: boolean;
    canSubmit: boolean;
};
type ActionsProps = {
    CustomActions?: (props: CustomActionsProps) => React.ReactNode | React.JSX.Element;
};
declare const Actions: ({ CustomActions, }: ActionsProps) => any;
export default Actions;
