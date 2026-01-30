import type { StoryObj } from '@storybook/nextjs';
import { PortalToFollowElem } from '.';
declare const meta: Meta<({ placement, triggerPopupSameWidth, }: {
    placement?: Parameters<typeof PortalToFollowElem>[0]["placement"];
    triggerPopupSameWidth?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const SameWidthPanel: Story;
