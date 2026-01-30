"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const use_fold_anim_into_1 = require("./use-fold-anim-into");
const useHideLogic = (onClose) => {
    const { modalClassName, foldIntoAnim: doFoldAnimInto, clearCountDown, countDownFoldIntoAnim, } = (0, use_fold_anim_into_1.default)(onClose);
    const [isInstalling, doSetIsInstalling] = (0, react_1.useState)(false);
    const setIsInstalling = (0, react_1.useCallback)((isInstalling) => {
        if (!isInstalling)
            clearCountDown();
        doSetIsInstalling(isInstalling);
    }, [clearCountDown]);
    const foldAnimInto = (0, react_1.useCallback)(() => {
        if (isInstalling) {
            doFoldAnimInto();
            return;
        }
        onClose();
    }, [doFoldAnimInto, isInstalling, onClose]);
    const handleStartToInstall = (0, react_1.useCallback)(() => {
        setIsInstalling(true);
        countDownFoldIntoAnim();
    }, [countDownFoldIntoAnim, setIsInstalling]);
    return {
        modalClassName,
        foldAnimInto,
        setIsInstalling,
        handleStartToInstall,
    };
};
exports.default = useHideLogic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWhpZGUtbG9naWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtaGlkZS1sb2dpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUE2QztBQUM3Qyw2REFBa0Q7QUFFbEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUFtQixFQUFFLEVBQUU7SUFDM0MsTUFBTSxFQUNKLGNBQWMsRUFDZCxZQUFZLEVBQUUsY0FBYyxFQUM1QixjQUFjLEVBQ2QscUJBQXFCLEdBQ3RCLEdBQUcsSUFBQSw0QkFBZSxFQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRTVCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDekQsTUFBTSxlQUFlLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsWUFBcUIsRUFBRSxFQUFFO1FBQzVELElBQUksQ0FBQyxZQUFZO1lBQ2YsY0FBYyxFQUFFLENBQUE7UUFDbEIsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDakMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVwQixNQUFNLFlBQVksR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3BDLElBQUksWUFBWSxFQUFFLENBQUM7WUFDakIsY0FBYyxFQUFFLENBQUE7WUFDaEIsT0FBTTtRQUNSLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUUzQyxNQUFNLG9CQUFvQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDNUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JCLHFCQUFxQixFQUFFLENBQUE7SUFDekIsQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUU1QyxPQUFPO1FBQ0wsY0FBYztRQUNkLFlBQVk7UUFDWixlQUFlO1FBQ2Ysb0JBQW9CO0tBQ3JCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB1c2VGb2xkQW5pbUludG8gZnJvbSAnLi91c2UtZm9sZC1hbmltLWludG8nXG5cbmNvbnN0IHVzZUhpZGVMb2dpYyA9IChvbkNsb3NlOiAoKSA9PiB2b2lkKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBtb2RhbENsYXNzTmFtZSxcbiAgICBmb2xkSW50b0FuaW06IGRvRm9sZEFuaW1JbnRvLFxuICAgIGNsZWFyQ291bnREb3duLFxuICAgIGNvdW50RG93bkZvbGRJbnRvQW5pbSxcbiAgfSA9IHVzZUZvbGRBbmltSW50byhvbkNsb3NlKVxuXG4gIGNvbnN0IFtpc0luc3RhbGxpbmcsIGRvU2V0SXNJbnN0YWxsaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBzZXRJc0luc3RhbGxpbmcgPSB1c2VDYWxsYmFjaygoaXNJbnN0YWxsaW5nOiBib29sZWFuKSA9PiB7XG4gICAgaWYgKCFpc0luc3RhbGxpbmcpXG4gICAgICBjbGVhckNvdW50RG93bigpXG4gICAgZG9TZXRJc0luc3RhbGxpbmcoaXNJbnN0YWxsaW5nKVxuICB9LCBbY2xlYXJDb3VudERvd25dKVxuXG4gIGNvbnN0IGZvbGRBbmltSW50byA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBpZiAoaXNJbnN0YWxsaW5nKSB7XG4gICAgICBkb0ZvbGRBbmltSW50bygpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgb25DbG9zZSgpXG4gIH0sIFtkb0ZvbGRBbmltSW50bywgaXNJbnN0YWxsaW5nLCBvbkNsb3NlXSlcblxuICBjb25zdCBoYW5kbGVTdGFydFRvSW5zdGFsbCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRJc0luc3RhbGxpbmcodHJ1ZSlcbiAgICBjb3VudERvd25Gb2xkSW50b0FuaW0oKVxuICB9LCBbY291bnREb3duRm9sZEludG9BbmltLCBzZXRJc0luc3RhbGxpbmddKVxuXG4gIHJldHVybiB7XG4gICAgbW9kYWxDbGFzc05hbWUsXG4gICAgZm9sZEFuaW1JbnRvLFxuICAgIHNldElzSW5zdGFsbGluZyxcbiAgICBoYW5kbGVTdGFydFRvSW5zdGFsbCxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VIaWRlTG9naWNcbiJdfQ==