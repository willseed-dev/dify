export default function ContentSwitch({ count, currentIndex, prevDisabled, nextDisabled, switchSibling, }: {
    count?: number;
    currentIndex?: number;
    prevDisabled: boolean;
    nextDisabled: boolean;
    switchSibling: (direction: 'prev' | 'next') => void;
}): any;
