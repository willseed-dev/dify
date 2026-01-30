type Props = {
    inputsForms: any[];
    inputs: Record<string, any>;
    inputsRef: any;
    onFormChange: (value: Record<string, any>) => void;
};
declare const AppInputsForm: ({ inputsForms, inputs, inputsRef, onFormChange, }: Props) => any;
export default AppInputsForm;
