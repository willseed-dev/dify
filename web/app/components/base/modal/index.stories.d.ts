import type { StoryObj } from '@storybook/nextjs';
import Modal from '.';
declare const meta: Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const HighPriorityOverflow: Story;
