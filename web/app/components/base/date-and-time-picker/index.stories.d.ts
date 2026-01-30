import type { StoryObj } from '@storybook/nextjs';
import type { DatePickerProps } from './types';
declare const meta: Meta<({ value, timezone, onChange, onClear, placeholder, needTimePicker, renderTrigger, triggerWrapClassName, popupZIndexClassname, noConfirm, getIsDateDisabled, }: DatePickerProps) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const DateOnly: Story;
