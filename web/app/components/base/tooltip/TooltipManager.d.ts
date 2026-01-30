declare class TooltipManager {
    private activeCloser;
    register(closeFn: () => void): void;
    clear(closeFn: () => void): void;
    /**
     * Closes the currently active tooltip by calling its closer function
     * and clearing the reference to it
     */
    closeActiveTooltip(): void;
}
export declare const tooltipManager: TooltipManager;
export {};
