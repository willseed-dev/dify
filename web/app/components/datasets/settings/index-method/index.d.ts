import { IndexingType } from '../../create/step-two';
type IndexMethodProps = {
    value: IndexingType;
    onChange: (id: IndexingType) => void;
    disabled?: boolean;
    currentValue?: IndexingType;
    keywordNumber: number;
    onKeywordNumberChange: (value: number) => void;
};
declare const IndexMethod: ({ value, onChange, disabled, currentValue, keywordNumber, onKeywordNumberChange, }: IndexMethodProps) => any;
export default IndexMethod;
