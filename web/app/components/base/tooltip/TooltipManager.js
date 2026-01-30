"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tooltipManager = void 0;
class TooltipManager {
    constructor() {
        this.activeCloser = null;
    }
    register(closeFn) {
        if (this.activeCloser)
            this.activeCloser();
        this.activeCloser = closeFn;
    }
    clear(closeFn) {
        if (this.activeCloser === closeFn)
            this.activeCloser = null;
    }
    /**
     * Closes the currently active tooltip by calling its closer function
     * and clearing the reference to it
     */
    closeActiveTooltip() {
        if (this.activeCloser) {
            this.activeCloser();
            this.activeCloser = null;
        }
    }
}
exports.tooltipManager = new TooltipManager();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9vbHRpcE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUb29sdGlwTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLGNBQWM7SUFBcEI7UUFDVSxpQkFBWSxHQUF3QixJQUFJLENBQUE7SUF1QmxELENBQUM7SUFyQkMsUUFBUSxDQUFDLE9BQW1CO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVk7WUFDbkIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFBO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBbUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLE9BQU87WUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7SUFDNUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7UUFDMUIsQ0FBQztJQUNILENBQUM7Q0FDRjtBQUVZLFFBQUEsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBUb29sdGlwTWFuYWdlciB7XG4gIHByaXZhdGUgYWN0aXZlQ2xvc2VyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuXG4gIHJlZ2lzdGVyKGNsb3NlRm46ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVDbG9zZXIpXG4gICAgICB0aGlzLmFjdGl2ZUNsb3NlcigpXG4gICAgdGhpcy5hY3RpdmVDbG9zZXIgPSBjbG9zZUZuXG4gIH1cblxuICBjbGVhcihjbG9zZUZuOiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlQ2xvc2VyID09PSBjbG9zZUZuKVxuICAgICAgdGhpcy5hY3RpdmVDbG9zZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRvb2x0aXAgYnkgY2FsbGluZyBpdHMgY2xvc2VyIGZ1bmN0aW9uXG4gICAqIGFuZCBjbGVhcmluZyB0aGUgcmVmZXJlbmNlIHRvIGl0XG4gICAqL1xuICBjbG9zZUFjdGl2ZVRvb2x0aXAoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlQ2xvc2VyKSB7XG4gICAgICB0aGlzLmFjdGl2ZUNsb3NlcigpXG4gICAgICB0aGlzLmFjdGl2ZUNsb3NlciA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHRvb2x0aXBNYW5hZ2VyID0gbmV3IFRvb2x0aXBNYW5hZ2VyKClcbiJdfQ==