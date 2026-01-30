"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeContext = exports.ThemeBuilder = exports.Theme = void 0;
const use_context_selector_1 = require("use-context-selector");
const utils_1 = require("./utils");
class Theme {
    constructor(chatColorTheme = null, chatColorThemeInverted = false) {
        this.primaryColor = '#1C64F2';
        this.backgroundHeaderColorStyle = 'backgroundImage: linear-gradient(to right, #2563eb, #0ea5e9)';
        this.headerBorderBottomStyle = '';
        this.colorFontOnHeaderStyle = 'color: white';
        this.colorPathOnHeader = 'text-text-primary-on-surface';
        this.backgroundButtonDefaultColorStyle = 'backgroundColor: #1C64F2';
        this.roundedBackgroundColorStyle = 'backgroundColor: rgb(245 248 255)';
        this.chatBubbleColorStyle = '';
        this.chatColorTheme = chatColorTheme;
        this.chatColorThemeInverted = chatColorThemeInverted;
        this.configCustomColor();
        this.configInvertedColor();
    }
    configCustomColor() {
        if (this.chatColorTheme !== null && this.chatColorTheme !== '') {
            this.primaryColor = this.chatColorTheme ?? '#1C64F2';
            this.backgroundHeaderColorStyle = `backgroundColor: ${this.primaryColor}`;
            this.backgroundButtonDefaultColorStyle = `backgroundColor: ${this.primaryColor}; color: ${this.colorFontOnHeaderStyle};`;
            this.roundedBackgroundColorStyle = `backgroundColor: ${(0, utils_1.hexToRGBA)(this.primaryColor, 0.05)}`;
            this.chatBubbleColorStyle = `backgroundColor: ${(0, utils_1.hexToRGBA)(this.primaryColor, 0.15)}`;
        }
    }
    configInvertedColor() {
        if (this.chatColorThemeInverted) {
            this.backgroundHeaderColorStyle = 'backgroundColor: #ffffff';
            this.colorFontOnHeaderStyle = `color: ${this.primaryColor}`;
            this.headerBorderBottomStyle = 'borderBottom: 1px solid #ccc';
            this.colorPathOnHeader = this.primaryColor;
        }
    }
}
exports.Theme = Theme;
class ThemeBuilder {
    constructor() {
        this.buildChecker = false;
    }
    get theme() {
        if (this._theme === undefined) {
            this._theme = new Theme();
            return this._theme;
        }
        else {
            return this._theme;
        }
    }
    buildTheme(chatColorTheme = null, chatColorThemeInverted = false) {
        if (!this.buildChecker) {
            this._theme = new Theme(chatColorTheme, chatColorThemeInverted);
            this.buildChecker = true;
        }
        else {
            if (this.theme?.chatColorTheme !== chatColorTheme || this.theme?.chatColorThemeInverted !== chatColorThemeInverted) {
                this._theme = new Theme(chatColorTheme, chatColorThemeInverted);
                this.buildChecker = true;
            }
        }
    }
}
exports.ThemeBuilder = ThemeBuilder;
const ThemeContext = (0, use_context_selector_1.createContext)(new ThemeBuilder());
const useThemeContext = () => (0, use_context_selector_1.useContext)(ThemeContext);
exports.useThemeContext = useThemeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUtY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRoZW1lLWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0RBQWdFO0FBQ2hFLG1DQUFtQztBQUVuQyxNQUFhLEtBQUs7SUFhaEIsWUFBWSxpQkFBZ0MsSUFBSSxFQUFFLHNCQUFzQixHQUFHLEtBQUs7UUFUekUsaUJBQVksR0FBRyxTQUFTLENBQUE7UUFDeEIsK0JBQTBCLEdBQUcsOERBQThELENBQUE7UUFDM0YsNEJBQXVCLEdBQUcsRUFBRSxDQUFBO1FBQzVCLDJCQUFzQixHQUFHLGNBQWMsQ0FBQTtRQUN2QyxzQkFBaUIsR0FBRyw4QkFBOEIsQ0FBQTtRQUNsRCxzQ0FBaUMsR0FBRywwQkFBMEIsQ0FBQTtRQUM5RCxnQ0FBMkIsR0FBRyxtQ0FBbUMsQ0FBQTtRQUNqRSx5QkFBb0IsR0FBRyxFQUFFLENBQUE7UUFHOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUE7UUFDcEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFBO1FBQ3BELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0lBQzVCLENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLEVBQUUsRUFBRSxDQUFDO1lBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxTQUFTLENBQUE7WUFDcEQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLG9CQUFvQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDekUsSUFBSSxDQUFDLGlDQUFpQyxHQUFHLG9CQUFvQixJQUFJLENBQUMsWUFBWSxZQUFZLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFBO1lBQ3hILElBQUksQ0FBQywyQkFBMkIsR0FBRyxvQkFBb0IsSUFBQSxpQkFBUyxFQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQTtZQUMzRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLElBQUEsaUJBQVMsRUFBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDdEYsQ0FBQztJQUNILENBQUM7SUFFTyxtQkFBbUI7UUFDekIsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsMEJBQTBCLEdBQUcsMEJBQTBCLENBQUE7WUFDNUQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFVBQVUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQzNELElBQUksQ0FBQyx1QkFBdUIsR0FBRyw4QkFBOEIsQ0FBQTtZQUM3RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQTtRQUM1QyxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBdENELHNCQXNDQztBQUVELE1BQWEsWUFBWTtJQUF6QjtRQUVVLGlCQUFZLEdBQUcsS0FBSyxDQUFBO0lBd0I5QixDQUFDO0lBdEJDLElBQVcsS0FBSztRQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUE7WUFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3BCLENBQUM7YUFDSSxDQUFDO1lBQ0osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBRU0sVUFBVSxDQUFDLGlCQUFnQyxJQUFJLEVBQUUsc0JBQXNCLEdBQUcsS0FBSztRQUNwRixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLHNCQUFzQixDQUFDLENBQUE7WUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7UUFDMUIsQ0FBQzthQUNJLENBQUM7WUFDSixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsY0FBYyxLQUFLLGNBQWMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLHNCQUFzQixLQUFLLHNCQUFzQixFQUFFLENBQUM7Z0JBQ25ILElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLHNCQUFzQixDQUFDLENBQUE7Z0JBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO1lBQzFCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBMUJELG9DQTBCQztBQUVELE1BQU0sWUFBWSxHQUFHLElBQUEsb0NBQWEsRUFBZSxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUE7QUFDN0QsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBQSxpQ0FBVSxFQUFDLFlBQVksQ0FBQyxDQUFBO0FBQWhELFFBQUEsZUFBZSxtQkFBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgeyBoZXhUb1JHQkEgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgVGhlbWUge1xuICBwdWJsaWMgY2hhdENvbG9yVGhlbWU6IHN0cmluZyB8IG51bGxcbiAgcHVibGljIGNoYXRDb2xvclRoZW1lSW52ZXJ0ZWQ6IGJvb2xlYW5cblxuICBwdWJsaWMgcHJpbWFyeUNvbG9yID0gJyMxQzY0RjInXG4gIHB1YmxpYyBiYWNrZ3JvdW5kSGVhZGVyQ29sb3JTdHlsZSA9ICdiYWNrZ3JvdW5kSW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgIzI1NjNlYiwgIzBlYTVlOSknXG4gIHB1YmxpYyBoZWFkZXJCb3JkZXJCb3R0b21TdHlsZSA9ICcnXG4gIHB1YmxpYyBjb2xvckZvbnRPbkhlYWRlclN0eWxlID0gJ2NvbG9yOiB3aGl0ZSdcbiAgcHVibGljIGNvbG9yUGF0aE9uSGVhZGVyID0gJ3RleHQtdGV4dC1wcmltYXJ5LW9uLXN1cmZhY2UnXG4gIHB1YmxpYyBiYWNrZ3JvdW5kQnV0dG9uRGVmYXVsdENvbG9yU3R5bGUgPSAnYmFja2dyb3VuZENvbG9yOiAjMUM2NEYyJ1xuICBwdWJsaWMgcm91bmRlZEJhY2tncm91bmRDb2xvclN0eWxlID0gJ2JhY2tncm91bmRDb2xvcjogcmdiKDI0NSAyNDggMjU1KSdcbiAgcHVibGljIGNoYXRCdWJibGVDb2xvclN0eWxlID0gJydcblxuICBjb25zdHJ1Y3RvcihjaGF0Q29sb3JUaGVtZTogc3RyaW5nIHwgbnVsbCA9IG51bGwsIGNoYXRDb2xvclRoZW1lSW52ZXJ0ZWQgPSBmYWxzZSkge1xuICAgIHRoaXMuY2hhdENvbG9yVGhlbWUgPSBjaGF0Q29sb3JUaGVtZVxuICAgIHRoaXMuY2hhdENvbG9yVGhlbWVJbnZlcnRlZCA9IGNoYXRDb2xvclRoZW1lSW52ZXJ0ZWRcbiAgICB0aGlzLmNvbmZpZ0N1c3RvbUNvbG9yKClcbiAgICB0aGlzLmNvbmZpZ0ludmVydGVkQ29sb3IoKVxuICB9XG5cbiAgcHJpdmF0ZSBjb25maWdDdXN0b21Db2xvcigpIHtcbiAgICBpZiAodGhpcy5jaGF0Q29sb3JUaGVtZSAhPT0gbnVsbCAmJiB0aGlzLmNoYXRDb2xvclRoZW1lICE9PSAnJykge1xuICAgICAgdGhpcy5wcmltYXJ5Q29sb3IgPSB0aGlzLmNoYXRDb2xvclRoZW1lID8/ICcjMUM2NEYyJ1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSGVhZGVyQ29sb3JTdHlsZSA9IGBiYWNrZ3JvdW5kQ29sb3I6ICR7dGhpcy5wcmltYXJ5Q29sb3J9YFxuICAgICAgdGhpcy5iYWNrZ3JvdW5kQnV0dG9uRGVmYXVsdENvbG9yU3R5bGUgPSBgYmFja2dyb3VuZENvbG9yOiAke3RoaXMucHJpbWFyeUNvbG9yfTsgY29sb3I6ICR7dGhpcy5jb2xvckZvbnRPbkhlYWRlclN0eWxlfTtgXG4gICAgICB0aGlzLnJvdW5kZWRCYWNrZ3JvdW5kQ29sb3JTdHlsZSA9IGBiYWNrZ3JvdW5kQ29sb3I6ICR7aGV4VG9SR0JBKHRoaXMucHJpbWFyeUNvbG9yLCAwLjA1KX1gXG4gICAgICB0aGlzLmNoYXRCdWJibGVDb2xvclN0eWxlID0gYGJhY2tncm91bmRDb2xvcjogJHtoZXhUb1JHQkEodGhpcy5wcmltYXJ5Q29sb3IsIDAuMTUpfWBcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ0ludmVydGVkQ29sb3IoKSB7XG4gICAgaWYgKHRoaXMuY2hhdENvbG9yVGhlbWVJbnZlcnRlZCkge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSGVhZGVyQ29sb3JTdHlsZSA9ICdiYWNrZ3JvdW5kQ29sb3I6ICNmZmZmZmYnXG4gICAgICB0aGlzLmNvbG9yRm9udE9uSGVhZGVyU3R5bGUgPSBgY29sb3I6ICR7dGhpcy5wcmltYXJ5Q29sb3J9YFxuICAgICAgdGhpcy5oZWFkZXJCb3JkZXJCb3R0b21TdHlsZSA9ICdib3JkZXJCb3R0b206IDFweCBzb2xpZCAjY2NjJ1xuICAgICAgdGhpcy5jb2xvclBhdGhPbkhlYWRlciA9IHRoaXMucHJpbWFyeUNvbG9yXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUaGVtZUJ1aWxkZXIge1xuICBwcml2YXRlIF90aGVtZT86IFRoZW1lXG4gIHByaXZhdGUgYnVpbGRDaGVja2VyID0gZmFsc2VcblxuICBwdWJsaWMgZ2V0IHRoZW1lKCkge1xuICAgIGlmICh0aGlzLl90aGVtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl90aGVtZSA9IG5ldyBUaGVtZSgpXG4gICAgICByZXR1cm4gdGhpcy5fdGhlbWVcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGhlbWVcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYnVpbGRUaGVtZShjaGF0Q29sb3JUaGVtZTogc3RyaW5nIHwgbnVsbCA9IG51bGwsIGNoYXRDb2xvclRoZW1lSW52ZXJ0ZWQgPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5idWlsZENoZWNrZXIpIHtcbiAgICAgIHRoaXMuX3RoZW1lID0gbmV3IFRoZW1lKGNoYXRDb2xvclRoZW1lLCBjaGF0Q29sb3JUaGVtZUludmVydGVkKVxuICAgICAgdGhpcy5idWlsZENoZWNrZXIgPSB0cnVlXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKHRoaXMudGhlbWU/LmNoYXRDb2xvclRoZW1lICE9PSBjaGF0Q29sb3JUaGVtZSB8fCB0aGlzLnRoZW1lPy5jaGF0Q29sb3JUaGVtZUludmVydGVkICE9PSBjaGF0Q29sb3JUaGVtZUludmVydGVkKSB7XG4gICAgICAgIHRoaXMuX3RoZW1lID0gbmV3IFRoZW1lKGNoYXRDb2xvclRoZW1lLCBjaGF0Q29sb3JUaGVtZUludmVydGVkKVxuICAgICAgICB0aGlzLmJ1aWxkQ2hlY2tlciA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgVGhlbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxUaGVtZUJ1aWxkZXI+KG5ldyBUaGVtZUJ1aWxkZXIoKSlcbmV4cG9ydCBjb25zdCB1c2VUaGVtZUNvbnRleHQgPSAoKSA9PiB1c2VDb250ZXh0KFRoZW1lQ29udGV4dClcbiJdfQ==