"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGAEvent = void 0;
const client_1 = require("@/utils/client");
/**
 * Send Google Analytics event
 * @param eventName - event name
 * @param eventParams - event params
 */
const sendGAEvent = (eventName, eventParams) => {
    if (client_1.isServer || typeof window.gtag !== 'function') {
        return;
    }
    window.gtag('event', eventName, eventParams);
};
exports.sendGAEvent = sendGAEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3RhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImd0YWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXlDO0FBRXpDOzs7O0dBSUc7QUFDSSxNQUFNLFdBQVcsR0FBRyxDQUN6QixTQUFpQixFQUNqQixXQUE2QixFQUN2QixFQUFFO0lBQ1IsSUFBSSxpQkFBUSxJQUFJLE9BQVEsTUFBYyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUUsQ0FBQztRQUMzRCxPQUFNO0lBQ1IsQ0FBQztJQUNBLE1BQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUN2RCxDQUFDLENBQUE7QUFSWSxRQUFBLFdBQVcsZUFRdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1NlcnZlciB9IGZyb20gJ0AvdXRpbHMvY2xpZW50J1xuXG4vKipcbiAqIFNlbmQgR29vZ2xlIEFuYWx5dGljcyBldmVudFxuICogQHBhcmFtIGV2ZW50TmFtZSAtIGV2ZW50IG5hbWVcbiAqIEBwYXJhbSBldmVudFBhcmFtcyAtIGV2ZW50IHBhcmFtc1xuICovXG5leHBvcnQgY29uc3Qgc2VuZEdBRXZlbnQgPSAoXG4gIGV2ZW50TmFtZTogc3RyaW5nLFxuICBldmVudFBhcmFtcz86IEd0YWdFdmVudFBhcmFtcyxcbik6IHZvaWQgPT4ge1xuICBpZiAoaXNTZXJ2ZXIgfHwgdHlwZW9mICh3aW5kb3cgYXMgYW55KS5ndGFnICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgKHdpbmRvdyBhcyBhbnkpLmd0YWcoJ2V2ZW50JywgZXZlbnROYW1lLCBldmVudFBhcmFtcylcbn1cbiJdfQ==